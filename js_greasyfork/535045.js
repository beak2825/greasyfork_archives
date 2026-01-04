// ==UserScript==
// @name         BGA BAttleship enhancer
// @namespace    https://greasyfork.org/en/users/119330-edward-sluder
// @version      0.04
// @description  Enhance Battleship on BGA
// @author       EPS Developments
// @match        https://boardgamearena.com/1/battleship?*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535045/BGA%20BAttleship%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/535045/BGA%20BAttleship%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
javascript:(function() {
  'use strict';

  let options = {
    attributes: true,
    childList: true,
    subtree: true
  },
  observer = new MutationObserver(updateBoard);

  observer.observe(document.body, options);

  // We will add our own stylesheet to make some visual changes.
  let ourStyle = document.createElement('style');
  ourStyle.setAttribute('id', 'ourStyle');
  ourStyle.innerHTML = `
    div.grid_1.grid .state_2 {
      background-color: black;
    }
    div.grid_1.grid div[id$="_0"], div.grid_1.grid div[id^="grid_1_0"] {
      background-color: gray;
      color: white;
    }
    .maxSpaces {
      font-size: 22px;
      font-weight: bold;
      background-color: blue;
    }
  `;
  document.head.append(ourStyle);

  function updateBoard(mutations) {
    // Each time a mutation has been observed on the board we will run through this routine.

    // Remove maxSpaces class from all squares. They would have been set from previous iteration.
    let hasClassMaxSpaces = document.querySelectorAll('div.maxSpaces');
    hasClassMaxSpaces.forEach(function(div) {
      div.classList.remove('maxSpaces');
    });

    console.log(`updateBoard() was called`);

    // In the "Enemy Fleet" section, insert within each ship a number that represents the length of the ship.
    let floatingShips = document.querySelectorAll('div#fleet [id^="ofleetship"].enemy');
    let maxLength = 1;
    let maxSpaces = 1;

    floatingShips.forEach(function(ship) {
      let id = ship.getAttribute('id');
      let squares = id.substring(11, 12);

      // We are looking for the longest ship still on the board.
      if (squares > maxLength) {
        maxLength = Number(squares);
      }

      ship.innerText = squares;
    });

    // Get a reference to the grid of the enemy ships.
    let grid = document.querySelectorAll(`#board > div > div.grid_1.grid > div.grid-body div[id^="grid_1_"]:not([id^="grid_1_0"]):not([id="grid_1_1_0"]):not([id="grid_1_2_0"]):not([id="grid_1_3_0"]):not([id="grid_1_4_0"]):not([id="grid_1_5_0"]):not([id="grid_1_6_0"]):not([id="grid_1_7_0"]):not([id="grid_1_8_0"]):not([id="grid_1_9_0"]):not([id="grid_1_10_0"])`);
    console.log(grid.length);

    // We will add a class to each square that has not been hit or missed.
    grid.forEach(function(square) {
      if (!(square.classList.contains('state_2') || square.classList.contains('state_7') || square.classList.contains('state_3'))) {
        square.classList.add('unknown');
      }
    });

    // Update the Enemy squares with a class of "unknown" numbers.
    let unknowns = document.querySelectorAll('.unknown');
    console.log(unknowns.length);

    unknowns.forEach(function(square) {
      let id = square.getAttribute('id');
      let split = id.split('_');
      let column = Number(split[2]);
      let row = Number(split[3]);
      let spaces = 1;

      function lookOutward(column, row, direction) {
        if (direction === 'up' && row !== 1) {
          for (let i = row - 1; i > (row - maxLength) && i > 0; i--) {
            let evalSquare = document.querySelector(`#board > div > div.grid_1.grid > div.grid-body #grid_1_${column}_${i}`);
            if (evalSquare.classList.contains('unknown')) {
              spaces += 1;
            } else {
              break;
            }
          }
        }

        if (direction === 'down' && row < 10) {
          for (let i = row + 1; i < row + maxLength && i < 10; i++) {
            let evalSquare = document.querySelector(`#board > div > div.grid_1.grid > div.grid-body #grid_1_${column}_${i}`);
            if (evalSquare.classList.contains('unknown')) {
              spaces += 1;
            } else {
              break;
            }
          }
        }

        if (direction === 'left' && column > 1) {
          for (let i = column - 1; i > (column - maxLength) && i > 0; i--) {
            let evalSquare = document.querySelector(`#board > div > div.grid_1.grid > div.grid-body #grid_1_${i}_${row}`);
            if (evalSquare.classList.contains('unknown')) {
              spaces += 1;
            } else {
              break;
            }
          }
        }

        if (direction === 'right' && column < 10) {
          for (let i = column + 1; i < column + maxLength && i < 11; i++) {
            let evalSquare = document.querySelector(`#board > div > div.grid_1.grid > div.grid-body #grid_1_${i}_${row}`);
            if (evalSquare.classList.contains('unknown')) {
              spaces += 1;
            } else {
              break;
            }
          }
        }
      }

      lookOutward(column, row, 'up');
      lookOutward(column, row, 'down');
      lookOutward(column, row, 'left');
      lookOutward(column, row, 'right');

      square.innerText = spaces;

      if (spaces > maxSpaces) {
        maxSpaces = spaces;
      }
    });

    console.log('maxSpaces ', maxSpaces);

    unknowns = document.querySelectorAll('.unknown');
    unknowns.forEach(function(square) {
      if (Number(square.innerText) === Number(maxSpaces)) {
        square.classList.add('maxSpaces');
      }
    });
  }

  updateBoard();
})();


})();