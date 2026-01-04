// ==UserScript==
// @name        Chess.com Bind Space to Next Puzzle Button
// @namespace   Violentmonkey Scripts
// @match       https://www.chess.com/puzzles
// @grant       none
// @version     1.0
// @license     MIT
// @author      chess_immense
// @description 2/14/2022, 10:16:12 AM
// @downloadURL https://update.greasyfork.org/scripts/452373/Chesscom%20Bind%20Space%20to%20Next%20Puzzle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/452373/Chesscom%20Bind%20Space%20to%20Next%20Puzzle%20Button.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  document.body.onkeydown = event => {
      if(event.code === 'Space') {
          document.querySelector('[data-cy="next-puzzle-btn"]').click()
      }
  }
}, false);