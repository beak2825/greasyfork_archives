// ==UserScript==
// @name         MouseHunt - Eggsweeper Helper
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.2
// @description  Tool to help with SEH Eggsweeper puzzle boards
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/381797/MouseHunt%20-%20Eggsweeper%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/381797/MouseHunt%20-%20Eggsweeper%20Helper.meta.js
// ==/UserScript==

(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      if (
        this.responseURL ===
        "https://www.mousehuntgame.com/managers/ajax/events/eggstreme_eggscavation.php"
      ) {
        console.group("Eggsweeper Helper");
        let game;
        try {
          game = JSON.parse(this.responseText)["game"];
          if (game["is_active"] && !game["is_complete"]) {
            if (game["num_snowballs"] > 0) {
              parseBoard(game, false);
            } else {
              parseBoard(game, true);
              console.log("You are out of Shovels!");
            }
          } else if (game["is_active"] && game["is_complete"]) {
            displayStats(game.board_rows);
          } else {
            console.log("Board is inactive");
          }
        } catch (error) {
          console.log("Failed to process server response");
          console.error(error.stack);
        }
        console.groupEnd("Eggsweeper Helper");
      }
    });
    originalOpen.apply(this, arguments);
  };

  /**
   * Main function to process overall game state
   * @param {object} game Parsed response from eggstreme_eggscavation.php
   * @param {boolean} isSilent True = inject "o" targeting overlay
   */
  function parseBoard(game, isSilent) {
    const board = game.board_rows;
    console.time("Duration");

    console.log(board);

    // Build an empty initial board
    const boardState = generateEmptyGameBoard("available");

    // Parse current game state and populate boardState with hits and misses
    for (let row of board) {
      for (let tile of row.data) {
        const loc = getArrayIndex(tile.value);
        if (tile.status === "miss") {
          boardState[loc.y][loc.x] = tile.num_clues;
        } else if (tile.status.indexOf("complete") >= 0) {
          boardState[loc.y][loc.x] = "hit";
        } else if (tile.status === "no_egg") {
          boardState[loc.y][loc.x] = "none";
        }
      }
    }
    console.table(boardState);

    /**
     * Calculate intermediate ENE board
     * 0 and up: Tile value after subtracting surrounding hits
     * -1: Initial value, corresponds to 0 in final scored board
     * -2: Guaranteed no egg here, corresponds to -1 in final scored board
     */
    const intBoard = generateEmptyGameBoard(-1);
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 9; j++) {
        const tile = boardState[i][j];
        if (typeof tile === "number") {
          let score = tile;
          if (tile > 0) {
            for (let el of getBordering(i, j)) {
              if (boardState[el[0]][el[1]] === "hit") {
                score -= 1;
              }
            }
          }
          intBoard[i][j] = score;

          if (score === 0) {
            for (let el of getBordering(i, j)) {
              if (intBoard[el[0]][el[1]] === -1) {
                intBoard[el[0]][el[1]] = -2;
              }
            }
          }
        } else if (tile === "hit") {
          intBoard[i][j] = -2;
        }
      }
    }
    console.table(intBoard);

    /**
     * Calculate final scored board
     * 1 and up: Positive score, there is a chance an egg is underneath this tile
     * 0: Initial score, no extra info to include/exclude chance of egg
     * -1: Guaranteed no egg here
     */
    const scoredBoard = generateEmptyGameBoard(0);
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 9; j++) {
        const int = intBoard[i][j];
        if (int > 0) {
          for (let el of getBordering(i, j)) {
            if (
              boardState[el[0]][el[1]] === "available" &&
              intBoard[el[0]][el[1]] !== -2
            ) {
              scoredBoard[el[0]][el[1]] += int;
            }
          }
        } else if (int === -2) {
          scoredBoard[i][j] = -1;
        }
        if (typeof boardState[i][j] === "number") {
          scoredBoard[i][j] = -1;
        }
      }
    }
    console.table(scoredBoard);

    // Calculate scores and ideal position(s)
    const scoreArray = [];
    const noHits = [];
    let highScore = [0, []];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 9; j++) {
        const dataVal = getValue(i, j);
        const score = scoredBoard[i][j];
        scoreArray.push(score);
        if (score > highScore[0]) {
          highScore[0] = score;
          highScore[1] = [dataVal];
        } else if (score === highScore[0]) {
          highScore[1].push(dataVal);
        } else if (score === -1) {
          noHits.push(dataVal); // Accumulate guaranteed no hit tiles
        }
      }
    }
    console.log(scoreArray);
    console.log(highScore);

    // Second pass: apply bonuses to tiles that can give the most info
    if (highScore[1].length > 1) {
      const newScores = [];
      for (let val of highScore[1]) {
        const pos = getArrayIndex(val);
        let score = highScore[0];
        for (let el of getBordering(pos.y, pos.x)) {
          if (scoredBoard[el[0]][el[1]] >= 0) score += 1;
        }
        newScores.push(score);
      }

      const newArr = [0, []];
      for (let i = 0; i < newScores.length; i++) {
        if (newScores[i] > newArr[0]) {
          newArr[0] = newScores[i];
          newArr[1] = [highScore[1][i]];
        } else if (newScores[i] === newArr[0]) {
          newArr[1].push(highScore[1][i]);
        }
      }
      highScore = newArr;
    }
    console.log(highScore);

    // Place suggestion(s) onto UI
    for (let i = 1; i < 54; i++) {
      const tile = document.querySelector(
        `.eggSweeper-board-row-cell[data-index="${i}"]`
      );
      // Inject tile titles with "Score: #"
      tile.setAttribute("title", `Score: ${scoreArray[i - 1]}`);

      // Remove existing targets and score titles when an "available" tile is clicked
      if (tile.getAttribute("tsitu-click-listener") !== "true") {
        tile.addEventListener("click", function () {
          if (tile.className.indexOf("available") >= 0) {
            document.querySelectorAll(".egg-tile-target").forEach(node => {
              node.remove();
            });
            document
              .querySelectorAll(
                ".eggSweeper-layer.tiles .eggSweeper-board-row-cell"
              )
              .forEach(node => {
                node.removeAttribute("title");
              });
          }
        });
        tile.setAttribute("tsitu-click-listener", "true");
      }
    }

    // Add targeting overlay for high scores and mark guaranteed no hit tiles
    if (!isSilent) {
      for (let el of highScore[1]) {
        const tile = document.querySelector(
          `.eggSweeper-board-row-cell[data-index="${el}"]`
        );

        if (tile) {
          // Inject "o" target(s) into UI
          const textSpan = document.createElement("span");
          textSpan.className = "egg-tile-target";
          textSpan.textContent = "o";
          textSpan.setAttribute(
            "style",
            `z-index: 100; position: absolute; color: seagreen; font-size: 70px; font-weight: bold; left: 8px; top: -21px; text-align: center; pointer-events: none; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;`
          );
          tile.appendChild(textSpan);
        }
      }

      for (let el of noHits) {
        const tile = document.querySelector(
          `.eggSweeper-board-row-cell[data-index="${el}"]`
        );

        if (tile && tile.className.indexOf("available") >= 0) {
          // Auto-mark as a no-egg tile
          if (!tile.classList.contains("no_egg")) {
            tile.classList.toggle("no_egg");
            tile.style.pointerEvents = "auto";
          }
        }
      }
    }

    displayStats(board);
    console.timeEnd("Duration");
  }

  /**
   * Counts hits/misses/total and render to top-left of UI
   * @param {object} board From game["board_rows"]
   */
  function displayStats(board) {
    let countMiss = 0;
    let countHit = 0;
    for (let row of board) {
      for (let tile of row.data) {
        if (tile.status === "miss") {
          countMiss++;
        } else if (tile.status.indexOf("complete") >= 0) {
          countHit++;
        }
      }
    }

    // Reset "title-span-data" node
    const titleSpanData = document.querySelector("#title-span-data-egg");
    if (titleSpanData) {
      titleSpanData.remove();
    }

    // Shovel stats on top left of game UI
    const mainTitle = document.querySelector(".eggSweeper-title");
    const leftSpan = document.createElement("span");
    leftSpan.id = "title-span-data-egg";
    leftSpan.textContent = `Hits:        ${countHit}\r\nMisses:   ${countMiss}\r\nTotal:      ${
      countMiss + countHit
    }`;
    leftSpan.setAttribute(
      "style",
      "text-shadow: none; white-space: pre; z-index: 100; position: absolute; color: white; font-size: 12px; left: 10px; top: 0px; text-align: left;"
    );
    mainTitle.appendChild(leftSpan);
  }

  /**
   * Generates a 6-row x 9-column pre-filled with a default value
   * @param {*} defaultValue
   */
  function generateEmptyGameBoard(defaultValue) {
    const returnBoard = [];
    for (let i = 0; i < 6; i++) {
      const arr = [];
      arr.length = 9;
      arr.fill(defaultValue);
      returnBoard.push(arr);
    }

    return returnBoard;
  }

  /**
   * Get bordering tile coordinates
   * Sample input: [1,1]
   * Return: [0,0] [0,1] [0,2] [1,0] [1,2] [2,0] [2,1] [2,2]
   * @param {number} row Integer from 0-5
   * @param {number} col Integer from 0-8
   * @return {number[]} Array of bordering [row, col] pairs
   */
  function getBordering(row, col) {
    const retArr = [];
    const rowM = row - 1;
    const colM = col - 1;
    const rowP = row + 1;
    const colP = col + 1;

    function validRow(val) {
      return val >= 0 && val <= 5;
    }

    function validCol(val) {
      return val >= 0 && val <= 8;
    }

    if (validRow(rowM) && validCol(colM)) retArr.push([rowM, colM]);
    if (validRow(rowM) && validCol(col)) retArr.push([rowM, col]);
    if (validRow(rowM) && validCol(colP)) retArr.push([rowM, colP]);
    if (validRow(row) && validCol(colM)) retArr.push([row, colM]);
    if (validRow(row) && validCol(colP)) retArr.push([row, colP]);
    if (validRow(rowP) && validCol(colM)) retArr.push([rowP, colM]);
    if (validRow(rowP) && validCol(col)) retArr.push([rowP, col]);
    if (validRow(rowP) && validCol(colP)) retArr.push([rowP, colP]);

    return retArr;
  }

  /**
   * Convert array indices to an integer data-index value
   * @param {number} row Integer from 0-5
   * @param {number} col Integer from 0-8
   * @return {number} Integer from 1-54
   */
  function getValue(row, col) {
    return row * 9 + (col + 1);
  }

  /**
   * Convert an integer data-index value to proper boardState array indices
   * @param {number} value Integer from 1-54
   * @return {object}
   */
  function getArrayIndex(value) {
    let posX = (value % 9) - 1;
    let posY = Math.floor(value / 9);

    // Right-most column is a special case
    if (value % 9 === 0) {
      posX = 8;
      posY = Math.floor(value / 9) - 1;
    }

    return {
      x: posX,
      y: posY
    };
  }
})();
