// ==UserScript==
// @name         MySnowballShowdownAide
// @namespace    https://greasyfork.org/en/users/20489
// @version      1.0.2.1.0
// @description  mh snowball showdown
// @author       Elie
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/20489/MySnowballShowdownAide.user.js
// @updateURL https://update.greasyfork.org/scripts/20489/MySnowballShowdownAide.meta.js
// ==/UserScript==

(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', function () {
      if (
        this.responseURL.indexOf(
          'mousehuntgame.com/managers/ajax/events/snowball_showdown.php'
        ) < 0
      )
        return;
      console.group('Snowball Showdown Helper');
      let game;
      try {
        game = JSON.parse(this.responseText)['snowball_showdown_game'];
        if (game['is_active'] == true && !game['is_complete']) {
          if (game['num_snowballs'] > 0) {
            parseBoard(game);
          } else {
            console.log('You are out of Throwable Snowballs!');
          }
        } else if (game['is_active'] === true && game['is_complete']) {
          displayStats(game.board_rows);
        } else {
          console.log('Board is inactive');
          if (game['num_snowballs'] > 0) {
            displayStats(game.board_rows, true);
            setTimeout(() => {
              document
                .querySelector('.snowballShowdownView-newGameButton.default')
                .click();
            }, 5000);
          }
        }
      } catch (error) {
        console.log('Failed to process server response');
        console.error(error.stack);
      }
      console.groupEnd('Snowball Showdown Helper');
    });
    originalOpen.apply(this, arguments);
  };

  /**
   * Main function to process overall game state
   * @param {object} game Parsed response from snowball_showdown.php
   */
  function parseBoard(game) {
    const board = game.board_rows;
    const currentShapes = game.rewards
      .filter((el) => {
        if (el.status !== 'complete') {
          return el;
        }
      })
      .map((el) => el.name);
    console.time('Duration');

    // console.log(board);
    console.log(currentShapes);

    // Build an empty initial board
    const boardState = generateEmptyGameBoard('available');
    let hitCount = 0;
    let missCount = 0;
    let isFirstGuess = false;
    let is2ndGuess = false;
    /**
     * Parse current game state
     */
    // Populate boardState with hits and misses
    for (const row of board) {
      for (const tile of row.data) {
        const loc = getArrayIndex(tile.value);
        if (tile.status === 'miss') {
          missCount += 1;
          boardState[loc.y][loc.x] = 'miss';
        } else if (tile.status === 'hit') {
          hitCount += 1;
          boardState[loc.y][loc.x] = 'hit';
        } else if (tile.status === 'complete') {
          hitCount += 1;
          boardState[loc.y][loc.x] = 'miss';
        }
      }
    }
    console.table(boardState);
    if (hitCount + missCount === 0) isFirstGuess = true;
    if (hitCount === 0 && missCount === 1) is2ndGuess = true;
    console.log(`hit count: ${hitCount}, missCount: ${missCount}`);
    console.log(`is first guess: ${isFirstGuess}, is 2nd guess: ${is2ndGuess}`);

    /**
     * Superpose remaining shape possibility boards
     */
    const sumBoard = generateEmptyGameBoard(0);
    for (const shape of currentShapes) {
      const scored = generateScoredBoard(boardState, shape);
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 11; j++) {
          sumBoard[i][j] += scored[i][j];
        }
      }
    }

    // Set all non-available tiles to 0
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 11; j++) {
        if (boardState[i][j] !== 'available') {
          sumBoard[i][j] = 0;
        }
      }
    }
    console.table(sumBoard);

    /**
     * Calculate scores and ideal position(s)
     */
    const scoreArray = [];
    const noHits = [];
    const highScore = [0, []];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 11; j++) {
        const dataVal = getValue(i, j);
        const score = sumBoard[i][j];
        scoreArray.push(score);
        if (score > highScore[0]) {
          highScore[0] = score;
          highScore[1] = [dataVal];
        } else if (score === highScore[0]) {
          highScore[1].push(dataVal);
        }

        if (score === 0) {
          noHits.push(dataVal); // Accumulate guaranteed no hit tiles
        }
      }
    }
    // console.log(scoreArray);
    // console.log(highScore);
    // console.log(noHits);

    /**
     * Place suggestion(s) onto UI
     */
    // Inject tile titles with "Score: #"
    for (let i = 1; i < 67; i++) {
      const tile = document
        .querySelector('.snowballShowdownView-layer.tiles')
        .querySelector(
          `.snowballShowdownView-board-row-cell[data-index="${i}"]`
        );
      tile.setAttribute(
        'title',
        `Score: ${parseFloat(scoreArray[i - 1].toFixed(2))}`
      );

      // Remove existing targets and score titles when an "available" tile is clicked
      if (tile.getAttribute('tsitu-click-listener') !== 'true') {
        tile.addEventListener('click', function () {
          if (tile.className.indexOf('available') >= 0) {
            document
              .querySelectorAll('.snowball-tile-target')
              .forEach((node) => {
                node.remove();
              });
            document
              .querySelectorAll(
                '.snowballShowdownView-layer.tiles .snowballShowdownView-board-row-cell'
              )
              .forEach((node) => {
                node.removeAttribute('title');
              });
          }

          // Reset disabled class if user overrode indicator and clicked anyway
          if (tile.className.indexOf('disabled') >= 0) {
            tile.classList.toggle('disabled');
          }
        });
        tile.setAttribute('tsitu-click-listener', 'true');
      }
    }

    // Add targeting overlay for high scores
    for (let i = 0; i < highScore[1].length; i++) {
      const tile = document
        .querySelector('.snowballShowdownView-layer.tiles')
        .querySelector(
          `.snowballShowdownView-board-row-cell[data-index="${highScore[1][i]}"]`
        );

      if (tile) {
        // Inject "o" target(s) into UI
        const textSpan = document.createElement('span');
        textSpan.className = 'snowball-tile-target';
        textSpan.textContent = 'o';
        textSpan.setAttribute(
          'style',
          `z-index: 100; position: absolute; color: seagreen; font-size: 70px; font-weight: bold; left: 8px; top: -21px; text-align: center; pointer-events: none; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;`
        );
        tile.appendChild(textSpan);
      }
    }

    // Mark guaranteed no hit tiles
    for (const el of noHits) {
      const tile = document
        .querySelector('.snowballShowdownView-layer.tiles')
        .querySelector(
          `.snowballShowdownView-board-row-cell[data-index="${el}"]`
        );

      if (tile && tile.className.indexOf('available') >= 0) {
        if (!tile.classList.contains('disabled')) {
          tile.classList.toggle('disabled');
          tile.style.pointerEvents = 'auto';
        }
      }
    }

    displayStats(board);
    console.timeEnd('Duration');
    const firstHigh = highScore[1][0];
    console.log(`first high: ${firstHigh}, game: ${game['is_complete']}`);
    console.log(game);
    if (firstHigh || firstHigh === 0)
      setTimeout(() => {
        if (isFirstGuess) makeGuess(25);
        else if (is2ndGuess) makeGuess(42);
        else makeGuess(firstHigh);
      }, 200);
  }
  function makeGuess(index) {
    const params = {
      action: 'make_guess',
      guess: index
    };
    // _ajaxBusy = true;
    ajax(params, function (data) {
      // update(data.snowball_showdown_game);
      // _gameData = data.snowball_showdown_game;
      // eventRegistry.doEvent('ajax_response', data);
      // _ajaxBusy = false;
    });
  }
  function ajax(params, successCallback) {
    const callbackurl = 'https://www.mousehuntgame.com/';
    const lastReadJournalEntryId = parseInt(
      document.querySelector('div[data-entry-id]').getAttribute('data-entry-id')
    );
    params['last_read_journal_entry_id'] = lastReadJournalEntryId;
    // eslint-disable-next-line no-undef
    params['uh'] = user.unique_hash;
    // eslint-disable-next-line no-undef
    $.ajax({
      data: params,
      dataType: 'json',
      type: 'post',
      url: callbackurl + 'managers/ajax/events/snowball_showdown.php',
      success: function (data) {
        // eslint-disable-next-line no-undef
        eventRegistry.doEvent('ajax_response', data);
        if (successCallback) {
          successCallback(data);
        }
        // _ajaxBusy = false;
      },
      error: function () {
        // eslint-disable-next-line no-undef, new-cap
        const popup = new jsDialog();
        popup.setTemplate('error');
        popup.addToken('{*title*}', 'The Snowball Showdown is out of order.');
        popup.addToken('{*content*}', 'An error occurred. Please try again!');
        popup.show();
        // _ajaxBusy = false;
      }
    });
  }
  /**
   * Counts hits/misses/total and render to top-left of UI
   * @param {object} board From game["board_rows"]
   */
  function displayStats(board, isGameCompleted) {
    let countMiss = 0;
    let countHit = 0;
    for (const row of board) {
      for (const tile of row.data) {
        if (tile.status === 'miss') {
          countMiss++;
        } else if (tile.status === 'hit' || tile.status === 'complete') {
          countHit++;
        }
      }
    }

    // Reset "title-span-data" node
    const titleSpanData = document.querySelector('#title-span-data');
    if (titleSpanData) {
      titleSpanData.remove();
    }

    // Snowball stats on top left of game UI
    const mainTitle = document.querySelector('.snowballShowdownView-title');
    const leftSpan = document.createElement('span');
    leftSpan.id = 'title-span-data';
    leftSpan.textContent = `Hits:        ${countHit}\r\nMisses:   ${countMiss}\r\nTotal:      ${
      (isGameCompleted ? 'completed' : '') + (countMiss + countHit)
    }`;
    leftSpan.setAttribute(
      'style',
      'text-shadow: 1px 1px 10px #608bec, 1px 1px 2px #000; white-space: pre; z-index: 100; position: absolute; color: #fff; font-size: 16px; left: 35px; top: 15px; text-align: left;'
    );
    mainTitle.appendChild(leftSpan);
  }

  // row (left-right), col (up-down) from [0, 0] to [5, 10]
  // combos start at top-left corner for each shape
  // prettier-ignore
  const allShapes = {
    "Chamberstick Candle": {
      default: {
        map: [[0, 1], [0, 1], [1, 1, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      },
      tipped_left: {
        map: [[0, 0, 1], [1, 1, 1], [0, 0, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      },
      tipped_right: {
        map: [[1], [1, 1, 1], [1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      },
      upside_down: {
        map: [[1, 1, 1], [0, 1], [0, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      }
    },
    "Candy Cane": {
      default: {
        map: [[1, 1], [1, 1], [1], [1]],
        combos: [
          [[0, 0], [0, 2], [0, 4], [0, 6], [0, 8]],
          [[0, 1], [0, 3], [0, 5], [0, 7], [0, 9]],
          [[1, 0], [1, 2], [1, 4], [1, 6], [1, 8]],
          [[1, 1], [1, 3], [1, 5], [1, 7], [1, 9]],
          [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8]],
          [[2, 1], [2, 3], [2, 5], [2, 7], [2, 9]]
        ]
      },
      left: {
        map: [[1, 1], [1, 1], [0, 1], [0, 1]],
        combos: [
          [[0, 0], [0, 2], [0, 4], [0, 6], [0, 8]],
          [[0, 1], [0, 3], [0, 5], [0, 7], [0, 9]],
          [[1, 0], [1, 2], [1, 4], [1, 6], [1, 8]],
          [[1, 1], [1, 3], [1, 5], [1, 7], [1, 9]],
          [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8]],
          [[2, 1], [2, 3], [2, 5], [2, 7], [2, 9]]
        ]
      },
      side_up_right: {
        map: [[0, 0, 1, 1], [1, 1, 1, 1]],
        combos: [
          [[0, 0], [0, 4], [2, 0], [2, 4], [4, 0], [4, 4]],
          [[0, 1], [0, 5], [2, 1], [2, 5], [4, 1], [4, 5]],
          [[0, 2], [0, 6], [2, 2], [2, 6], [4, 2], [4, 6]],
          [[0, 3], [0, 7], [2, 3], [2, 7], [4, 3], [4, 7]],
          [[1, 0], [1, 4], [3, 0], [3, 4]],
          [[1, 1], [1, 5], [3, 1], [3, 5]],
          [[1, 2], [1, 6], [3, 2], [3, 6]],
          [[1, 3], [1, 7], [3, 3], [3, 7]]
        ]
      },
      side_up_left: {
        map: [[1, 1], [1, 1, 1, 1]],
        combos: [
          [[0, 0], [0, 4], [2, 0], [2, 4], [4, 0], [4, 4]],
          [[0, 1], [0, 5], [2, 1], [2, 5], [4, 1], [4, 5]],
          [[0, 2], [0, 6], [2, 2], [2, 6], [4, 2], [4, 6]],
          [[0, 3], [0, 7], [2, 3], [2, 7], [4, 3], [4, 7]],
          [[1, 0], [1, 4], [3, 0], [3, 4]],
          [[1, 1], [1, 5], [3, 1], [3, 5]],
          [[1, 2], [1, 6], [3, 2], [3, 6]],
          [[1, 3], [1, 7], [3, 3], [3, 7]]
        ]
      },
      side_down_right: {
        map: [[1, 1, 1, 1], [0, 0, 1, 1]],
        combos: [
          [[0, 0], [0, 4], [2, 0], [2, 4], [4, 0], [4, 4]],
          [[0, 1], [0, 5], [2, 1], [2, 5], [4, 1], [4, 5]],
          [[0, 2], [0, 6], [2, 2], [2, 6], [4, 2], [4, 6]],
          [[0, 3], [0, 7], [2, 3], [2, 7], [4, 3], [4, 7]],
          [[1, 0], [1, 4], [3, 0], [3, 4]],
          [[1, 1], [1, 5], [3, 1], [3, 5]],
          [[1, 2], [1, 6], [3, 2], [3, 6]],
          [[1, 3], [1, 7], [3, 3], [3, 7]]
        ]
      },
      side_down_left: {
        map: [[1, 1, 1, 1], [1, 1]],
        combos: [
          [[0, 0], [0, 4], [2, 0], [2, 4], [4, 0], [4, 4]],
          [[0, 1], [0, 5], [2, 1], [2, 5], [4, 1], [4, 5]],
          [[0, 2], [0, 6], [2, 2], [2, 6], [4, 2], [4, 6]],
          [[0, 3], [0, 7], [2, 3], [2, 7], [4, 3], [4, 7]],
          [[1, 0], [1, 4], [3, 0], [3, 4]],
          [[1, 1], [1, 5], [3, 1], [3, 5]],
          [[1, 2], [1, 6], [3, 2], [3, 6]],
          [[1, 3], [1, 7], [3, 3], [3, 7]]
        ]
      },
      down_right: {
        map: [[1], [1], [1, 1], [1, 1]],
        combos: [
          [[0, 0], [0, 2], [0, 4], [0, 6], [0, 8]],
          [[0, 1], [0, 3], [0, 5], [0, 7], [0, 9]],
          [[1, 0], [1, 2], [1, 4], [1, 6], [1, 8]],
          [[1, 1], [1, 3], [1, 5], [1, 7], [1, 9]],
          [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8]],
          [[2, 1], [2, 3], [2, 5], [2, 7], [2, 9]]
        ]
      },
      down_left: {
        map: [[0, 1], [0, 1], [1, 1], [1, 1]],
        combos: [
          [[0, 0], [0, 2], [0, 4], [0, 6], [0, 8]],
          [[0, 1], [0, 3], [0, 5], [0, 7], [0, 9]],
          [[1, 0], [1, 2], [1, 4], [1, 6], [1, 8]],
          [[1, 1], [1, 3], [1, 5], [1, 7], [1, 9]],
          [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8]],
          [[2, 1], [2, 3], [2, 5], [2, 7], [2, 9]]
        ]
      }
    },
    "Crescent Cookie": {
      default: {
        map: [[1, 1], [1], [1, 1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [0, 9],
            [3, 1],
            [3, 3],
            [3, 5],
            [3, 7],
            [3, 9]
          ],
          [[1, 0], [1, 2], [1, 4], [1, 6], [1, 8]],
          [[1, 1], [1, 3], [1, 5], [1, 7], [1, 9]],
          [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8]],
          [[2, 1], [2, 3], [2, 5], [2, 7], [2, 9]]
        ]
      },
      down: {
        map: [[1, 1, 1], [1, 0, 1]],
        combos: [
          [
            [0, 0],
            [0, 3],
            [0, 6],
            [2, 0],
            [2, 3],
            [2, 6],
            [4, 0],
            [4, 3],
            [4, 6]
          ],
          [
            [0, 1],
            [0, 4],
            [0, 7],
            [2, 1],
            [2, 4],
            [2, 7],
            [4, 1],
            [4, 4],
            [4, 7]
          ],
          [
            [0, 2],
            [0, 5],
            [0, 8],
            [2, 2],
            [2, 5],
            [2, 8],
            [4, 2],
            [4, 5],
            [4, 8]
          ],
          [[1, 0], [1, 3], [1, 6], [3, 0], [3, 3], [3, 6]],
          [[1, 1], [1, 4], [1, 7], [3, 1], [3, 4], [3, 7]],
          [[1, 2], [1, 5], [1, 8], [3, 2], [3, 5], [3, 8]]
        ]
      },
      left: {
        map: [[1, 1], [0, 1], [1, 1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [0, 9],
            [3, 1],
            [3, 3],
            [3, 5],
            [3, 7],
            [3, 9]
          ],
          [[1, 0], [1, 2], [1, 4], [1, 6], [1, 8]],
          [[1, 1], [1, 3], [1, 5], [1, 7], [1, 9]],
          [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8]],
          [[2, 1], [2, 3], [2, 5], [2, 7], [2, 9]]
        ]
      },
      up: {
        map: [[1, 0, 1], [1, 1, 1]],
        combos: [
          [
            [0, 0],
            [0, 3],
            [0, 6],
            [2, 0],
            [2, 3],
            [2, 6],
            [4, 0],
            [4, 3],
            [4, 6]
          ],
          [
            [0, 1],
            [0, 4],
            [0, 7],
            [2, 1],
            [2, 4],
            [2, 7],
            [4, 1],
            [4, 4],
            [4, 7]
          ],
          [
            [0, 2],
            [0, 5],
            [0, 8],
            [2, 2],
            [2, 5],
            [2, 8],
            [4, 2],
            [4, 5],
            [4, 8]
          ],
          [[1, 0], [1, 3], [1, 6], [3, 0], [3, 3], [3, 6]],
          [[1, 1], [1, 4], [1, 7], [3, 1], [3, 4], [3, 7]],
          [[1, 2], [1, 5], [1, 8], [3, 2], [3, 5], [3, 8]]
        ]
      }
    },
    "Large Gift": {
      default: {
        map: [[1, 1], [1, 1], [1, 1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [0, 9],
            [3, 1],
            [3, 3],
            [3, 5],
            [3, 7],
            [3, 9]
          ],
          [[1, 0], [1, 2], [1, 4], [1, 6], [1, 8]],
          [[1, 1], [1, 3], [1, 5], [1, 7], [1, 9]],
          [[2, 0], [2, 2], [2, 4], [2, 6], [2, 8]],
          [[2, 1], [2, 3], [2, 5], [2, 7], [2, 9]]
        ]
      },
      side: {
        map: [[1, 1, 1], [1, 1, 1]],
        combos: [
          [
            [0, 0],
            [0, 3],
            [0, 6],
            [2, 0],
            [2, 3],
            [2, 6],
            [4, 0],
            [4, 3],
            [4, 6]
          ],
          [
            [0, 1],
            [0, 4],
            [0, 7],
            [2, 1],
            [2, 4],
            [2, 7],
            [4, 1],
            [4, 4],
            [4, 7]
          ],
          [
            [0, 2],
            [0, 5],
            [0, 8],
            [2, 2],
            [2, 5],
            [2, 8],
            [4, 2],
            [4, 5],
            [4, 8]
          ],
          [[1, 0], [1, 3], [1, 6], [3, 0], [3, 3], [3, 6]],
          [[1, 1], [1, 4], [1, 7], [3, 1], [3, 4], [3, 7]],
          [[1, 2], [1, 5], [1, 8], [3, 2], [3, 5], [3, 8]]
        ]
      }
    },
    "Cozy Scarf": {
      default: {
        map: [[0, 1, 1], [1, 1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [2, 0],
            [2, 2],
            [2, 4],
            [2, 6],
            [2, 8],
            [4, 0],
            [4, 2],
            [4, 4],
            [4, 6],
            [4, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [2, 1],
            [2, 3],
            [2, 5],
            [2, 7],
            [4, 1],
            [4, 3],
            [4, 5],
            [4, 7]
          ],
          [
            [1, 0],
            [1, 2],
            [1, 4],
            [1, 6],
            [1, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [[1, 1], [1, 3], [1, 5], [1, 7], [3, 1], [3, 3], [3, 5], [3, 7]]
        ]
      },
      falling: {
        map: [[1], [1, 1], [0, 1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [2, 0],
            [2, 2],
            [2, 4],
            [2, 6],
            [2, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [0, 9],
            [2, 1],
            [2, 3],
            [2, 5],
            [2, 7],
            [2, 9]
          ],
          [
            [1, 0],
            [1, 2],
            [1, 4],
            [1, 6],
            [1, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [
            [1, 1],
            [1, 3],
            [1, 5],
            [1, 7],
            [1, 9],
            [3, 1],
            [3, 3],
            [3, 5],
            [3, 7],
            [3, 9]
          ]
        ]
      },
      falling_flipped: {
        map: [[0, 1], [1, 1], [1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [2, 0],
            [2, 2],
            [2, 4],
            [2, 6],
            [2, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [0, 9],
            [2, 1],
            [2, 3],
            [2, 5],
            [2, 7],
            [2, 9]
          ],
          [
            [1, 0],
            [1, 2],
            [1, 4],
            [1, 6],
            [1, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [
            [1, 1],
            [1, 3],
            [1, 5],
            [1, 7],
            [1, 9],
            [3, 1],
            [3, 3],
            [3, 5],
            [3, 7],
            [3, 9]
          ]
        ]
      },
      flipped: {
        map: [[1, 1], [0, 1, 1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [2, 0],
            [2, 2],
            [2, 4],
            [2, 6],
            [2, 8],
            [4, 0],
            [4, 2],
            [4, 4],
            [4, 6],
            [4, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [2, 1],
            [2, 3],
            [2, 5],
            [2, 7],
            [4, 1],
            [4, 3],
            [4, 5],
            [4, 7]
          ],
          [
            [1, 0],
            [1, 2],
            [1, 4],
            [1, 6],
            [1, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [[1, 1], [1, 3], [1, 5], [1, 7], [3, 1], [3, 3], [3, 5], [3, 7]]
        ]
      }
    },
    "Small Gift": {
      default: {
        map: [[1, 1], [1, 1]],
        combos: [
          [
            [0, 0],
            [0, 2],
            [0, 4],
            [0, 6],
            [0, 8],
            [2, 0],
            [2, 2],
            [2, 4],
            [2, 6],
            [2, 8],
            [4, 0],
            [4, 2],
            [4, 4],
            [4, 6],
            [4, 8]
          ],
          [
            [0, 1],
            [0, 3],
            [0, 5],
            [0, 7],
            [0, 9],
            [2, 1],
            [2, 3],
            [2, 5],
            [2, 7],
            [2, 9],
            [4, 1],
            [4, 3],
            [4, 5],
            [4, 7],
            [4, 9]
          ],
          [
            [1, 0],
            [1, 2],
            [1, 4],
            [1, 6],
            [1, 8],
            [3, 0],
            [3, 2],
            [3, 4],
            [3, 6],
            [3, 8]
          ],
          [
            [1, 1],
            [1, 3],
            [1, 5],
            [1, 7],
            [1, 9],
            [3, 1],
            [3, 3],
            [3, 5],
            [3, 7],
            [3, 9]
          ]
        ]
      }
    },
    "Winter Star": {
      default: {
        map: [[0, 1], [1, 1, 1], [0, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      }
    },
    "Holiday Tree": {
      default: {
        map: [[0, 1], [1, 1, 1], [1, 1, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      },
      right: {
        map: [[1, 1], [1, 1, 1], [1, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      },
      left: {
        map: [[0, 1, 1], [1, 1, 1], [0, 1, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      }
      // Verify existence (12/8/2020: CBS confirms non-existence, but may add in future)
      // down: {
      //   map: [[1, 1, 1], [1, 1, 1], [0, 1]],
      //   combos: [
      //     [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
      //     [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
      //     [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
      //     [[1, 0], [1, 3], [1, 6]],
      //     [[1, 1], [1, 4], [1, 7]],
      //     [[1, 2], [1, 5], [1, 8]],
      //     [[2, 0], [2, 3], [2, 6]],
      //     [[2, 1], [2, 4], [2, 7]],
      //     [[2, 2], [2, 5], [2, 8]]
      //   ]
      // }
    },
    "Festive Wreath": {
      default: {
        map: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6]],
          [[0, 1], [0, 4], [0, 7], [3, 1], [3, 4], [3, 7]],
          [[0, 2], [0, 5], [0, 8], [3, 2], [3, 5], [3, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      }
    },
    "Yule Log": {
      default: {
        map: [[1, 1, 1, 1, 1]],
        combos: [
          [
            [0, 0],
            [0, 5],
            [1, 0],
            [1, 5],
            [2, 0],
            [2, 5],
            [3, 0],
            [3, 5],
            [4, 0],
            [4, 5],
            [5, 0],
            [5, 5]
          ],
          [
            [0, 1],
            [0, 6],
            [1, 1],
            [1, 6],
            [2, 1],
            [2, 6],
            [3, 1],
            [3, 6],
            [4, 1],
            [4, 6],
            [5, 1],
            [5, 6]
          ],
          [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2]],
          [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3]],
          [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4]]
        ]
      },
      standing: {
        map: [[1], [1], [1], [1], [1]],
        combos: [
          [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
            [0, 6],
            [0, 7],
            [0, 8],
            [0, 9],
            [0, 10]
          ],
          [
            [1, 0],
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
            [1, 6],
            [1, 7],
            [1, 8],
            [1, 9],
            [1, 10]
          ]
        ]
      }
    },
    "Magical Holiday Hat": {
      default: {
        map: [[0, 1, 1], [0, 1, 1], [1, 1, 1, 1]],
        combos: [
          [[0, 0], [0, 4], [3, 0], [3, 4]],
          [[0, 1], [0, 5], [3, 1], [3, 5]],
          [[0, 2], [0, 6], [3, 2], [3, 6]],
          [[0, 3], [0, 7], [3, 3], [3, 7]],
          [[1, 0], [1, 4]],
          [[1, 1], [1, 5]],
          [[1, 2], [1, 6]],
          [[1, 3], [1, 7]],
          [[2, 0], [2, 4]],
          [[2, 1], [2, 5]],
          [[2, 2], [2, 6]],
          [[2, 3], [2, 7]]
        ]
      },
      flip: {
        map: [[1, 1, 1, 1], [0, 1, 1], [0, 1, 1]],
        combos: [
          [[0, 0], [0, 4], [3, 0], [3, 4]],
          [[0, 1], [0, 5], [3, 1], [3, 5]],
          [[0, 2], [0, 6], [3, 2], [3, 6]],
          [[0, 3], [0, 7], [3, 3], [3, 7]],
          [[1, 0], [1, 4]],
          [[1, 1], [1, 5]],
          [[1, 2], [1, 6]],
          [[1, 3], [1, 7]],
          [[2, 0], [2, 4]],
          [[2, 1], [2, 5]],
          [[2, 2], [2, 6]],
          [[2, 3], [2, 7]]
        ]
      },
      left: {
        map: [[0, 0, 1], [1, 1, 1], [1, 1, 1], [0, 0, 1]],
        combos: [
          [[0, 0], [0, 3], [0, 6]],
          [[0, 1], [0, 4], [0, 7]],
          [[0, 2], [0, 5], [0, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      },
      right: {
        map: [[1], [1, 1, 1], [1, 1, 1], [1]],
        combos: [
          [[0, 0], [0, 3], [0, 6]],
          [[0, 1], [0, 4], [0, 7]],
          [[0, 2], [0, 5], [0, 8]],
          [[1, 0], [1, 3], [1, 6]],
          [[1, 1], [1, 4], [1, 7]],
          [[1, 2], [1, 5], [1, 8]],
          [[2, 0], [2, 3], [2, 6]],
          [[2, 1], [2, 4], [2, 7]],
          [[2, 2], [2, 5], [2, 8]]
        ]
      }
    }
  };

  // Number of cells in shape - 1
  const maxThreshold = {
    'Chamberstick Candle': 4,
    'Candy Cane': 5,
    'Crescent Cookie': 4,
    'Large Gift': 5,
    'Cozy Scarf': 3,
    'Small Gift': 3,
    'Winter Star': 4,
    'Holiday Tree': 6,
    'Festive Wreath': 7,
    'Yule Log': 4,
    'Magical Holiday Hat': 7
  };

  /**
   * Generate a scored game board given an input board state plus a shape
   * @param {array} board Current board state
   * @param {string} shapeName Name of shape to process
   * @return {array} Scored board
   */
  function generateScoredBoard(board, shapeName) {
    const shape = allShapes[shapeName];
    const masterValueTrack = [];
    const masterHitCounter = [];

    // Track highest amount of hits for all combos of a shape
    let highestHit = 0;

    for (const type in shape) {
      if (!Object.hasOwn(shape, type)) continue;
      const map = shape[type]['map'];
      for (const combo of shape[type]['combos']) {
        // Convert shape positions into array of 1-66 values
        const valueTrack = [];
        for (const el of combo) {
          const row = el[0];
          const col = el[1];
          const valueArr = [];
          for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
              // Check for 1
              if (map[i][j] === 1) {
                valueArr.push(getValue(row + i, col + j));
              }
            }
          }
          valueTrack.push(valueArr);
        }
        masterValueTrack.push(valueTrack);

        // Array to track hits per shape in a single combo board
        const hitCounter = [];
        hitCounter.length = valueTrack.length;
        hitCounter.fill(0);

        // Calculate number of hits for each shape
        // A miss is permanently represented by -1
        for (let row = 0; row < 6; row++) {
          for (let col = 0; col < 11; col++) {
            const el = board[row][col];
            const [exists, index] = checkExist(getValue(row, col));
            if (exists && hitCounter[index] >= 0) {
              if (el === 'miss') {
                hitCounter[index] = -1;
              } else if (el === 'hit') {
                hitCounter[index] += 1;
              }
            }
          }
        }
        masterHitCounter.push(hitCounter);

        // Checks for existence in value tracking array
        function checkExist(value) {
          let returnBool = false;
          let index = 0;
          for (let i = 0; i < valueTrack.length; i++) {
            if (valueTrack[i].indexOf(value) > -1) {
              returnBool = true;
              index = i;
              break;
            }
          }

          return [returnBool, index];
        }

        for (const num of hitCounter) {
          highestHit = num > highestHit ? num : highestHit;
        }

        highestHit =
          highestHit > maxThreshold[shapeName]
            ? maxThreshold[shapeName]
            : highestHit;
      }
    }

    // Generate empty board for calculating scores
    const scoreBoard = generateEmptyGameBoard(0);

    // Populate with scores
    let iterCount = 0;
    let patternCount = 0; // For Paul's method
    let shapeHighScore = 0; // For Paul's method
    for (const type in shape) {
      if (!Object.hasOwn(shape, type)) continue;
      const map = shape[type]['map'];
      for (const combo of shape[type]['combos']) {
        const calcBoard = generateEmptyGameBoard(0);
        for (let x = 0; x < combo.length; x++) {
          const row = combo[x][0];
          const col = combo[x][1];
          for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
              if (
                masterValueTrack[iterCount][x].indexOf(
                  getValue(row + i, col + j)
                ) > -1
              ) {
                const calcScore = calculateScore(x, iterCount, highestHit);
                calcBoard[row + i][col + j] = calcScore;
                if (calcScore > shapeHighScore) {
                  shapeHighScore = calcScore;
                  patternCount = 1;
                } else if (calcScore === shapeHighScore) {
                  patternCount += 1;
                }
              }
            }
          }
        }
        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 11; j++) {
            scoreBoard[i][j] += calcBoard[i][j];
          }
        }
        iterCount++;
      }
    }

    /**
     * @param {number} index Index of the hit in its hitCounter array
     * @param {number} iter Index of the hitCounter array to use
     * @param {number} threshold highestHit
     * @return {number} Score
     */
    function calculateScore(index, iter, threshold) {
      const hit = masterHitCounter[iter][index];
      if (hit === -1) {
        return 0; // Miss
      } else if (hit === 0) {
        return 1; // Available
      } else if (hit >= 1) {
        const num = hit === threshold ? hit : 0;
        return num * 10 + 1; // Hit (hitWeight of 10)
      }
    }

    // Paul's modified weighting algorithm (based on remaining patterns)
    // https://www.mousehuntgame.com/forum/showthread.php?136423-Snowball-Showndown-Minigame-Probability-Spreadsheet&p=1421247&viewfull=1#post1421247
    return scoreBoard.map((row) =>
      row.map((col) => {
        return (col / (patternCount / (maxThreshold[shapeName] + 1))) * 5;
      })
    );
  }

  /**
   * Generates a 6-row x 11-column pre-filled with a default value
   * @param {*} defaultValue
   */
  function generateEmptyGameBoard(defaultValue) {
    const returnBoard = [];
    for (let i = 0; i < 6; i++) {
      const arr = [];
      arr.length = 11;
      arr.fill(defaultValue);
      returnBoard.push(arr);
    }

    return returnBoard;
  }

  /**
   * Convert array indices to an integer data-index value
   * @param {number} row Integer from 0-5
   * @param {number} col Integer from 0-10
   * @return {number} Integer from 1-66
   */
  function getValue(row, col) {
    return row * 11 + (col + 1);
  }

  /**
   * Convert an integer data-index value to proper boardState array indices
   * @param {number} value Integer from 1-66
   * @return {object}
   */
  function getArrayIndex(value) {
    let posX = (value % 11) - 1;
    let posY = Math.floor(value / 11);

    // Right-most column is a special case
    if (value % 11 === 0) {
      posX = 10;
      posY = Math.floor(value / 11) - 1;
    }

    return {
      x: posX,
      y: posY
    };
  }
})();
