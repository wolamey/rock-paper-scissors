

const crypto = require('crypto');

class RPSGame {
  constructor(moves) {
    this.moves = moves;
    this.generateKey();
    this.generateComputerMove();
  }

  generateKey() {
    this.key = crypto.randomBytes(32).toString('hex');
  }

  generateComputerMove() {
    const index = Math.floor(Math.random() * this.moves.length);
    this.computerMove = this.moves[index];
  }

  generateHMAC(move) {
    const hmac = crypto.createHmac('sha256', this.key);
    hmac.update(move);
    return hmac.digest('hex');
  }

  decideWinner(userMove) {
    const userIndex = this.moves.indexOf(userMove);
    const computerIndex = this.moves.indexOf(this.computerMove);
    const half = this.moves.length / 2;

    if (computerIndex === userIndex) {
      return 'Draw';
    } else if (
      (userIndex < computerIndex && computerIndex - userIndex <= half) ||
      (userIndex > computerIndex && userIndex - computerIndex >= half)
    ) {
      return 'You win';
    } else {
      return 'Computer wins';
    }
  }

  printMenu() {
    console.log('HMAC:', this.generateHMAC(this.computerMove));

    console.log('Available moves:');
    this.moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    })
    console.log('0 - exit');
    console.log('? - help');
  }
}

class RPSTable {
  constructor(moves) {
    this.table = [];
    for (let i = 0; i < moves.length; i++) {
      const row = [];
      for (let j = 0; j < moves.length; j++) {
        const result = this.calculateResult(i, j, moves.length);
        row.push(result);
      }
      this.table.push(row);
    }
  }

  calculateResult(i, j, n) {
    if (i === j) {
      return 'Draw';
    }
 
    const half = n / 2;
    if (
      (i < j && j - i <= half) || (i > j && i - j >= half)
    ) {
      return 'Win';
    } else {
      return 'Lose';
    }
  }

  printTable() {
    console.log('Move 0 is not used');
    for (let i = 1; i < this.table.length; i++) {
      console.log(`Move ${i}:`, this.table[i].join(' '));
    }
  }
}



class RPSApp {
    constructor(moves) {
      this.game = new RPSGame(moves);
      this.moveTable = new RPSTable(moves);
    }
  
    start() {
      console.log('Welcome to Rock-Paper-Scissors!');
      this.game.printMenu();
    }
  
    play(userMove) {
      const moves = userMove.split(' ').filter(move => move.trim() !== '');
      moves.forEach(move => {
        if (move === '0') {
          console.log('Thanks for playing! Have a great day.');
          process.exit(0);
        } else if (move === '?') {
          this.moveTable.printTable();
        } else if (!parseInt(move) || move < 1 || move > this.game.moves.length) {
          console.log('Invalid move:', move);
        } else {
          const selectedMove = this.game.moves[parseInt(move) - 1];
          console.log('Your move:', selectedMove);
          console.log('Computer move:', this.game.computerMove);
          console.log(this.game.decideWinner(selectedMove));
          console.log('HMAC key:', this.game.key);
        }
        console.log('==========');
      });
      this.game.generateComputerMove();
      this.game.printMenu();
    }
  }
  
  const app = new RPSApp(process.argv.slice(2));
  app.start();
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.prompt();
  
  readline.on('line', (move) => {
    app.play(move);
    readline.prompt();
  });