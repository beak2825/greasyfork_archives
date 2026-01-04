// ==UserScript==
// @name         GC Gormball Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1142431-guribot
// @version      0.1
// @description  Adds keyboard controls for Gormball on GC.
// @author       guribot
// @match        https://www.grundos.cafe/games/gormball/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/475693/GC%20Gormball%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/475693/GC%20Gormball%20Keyboard%20Controls.meta.js
// ==/UserScript==

// borrows HEAVILY from sanjix's "GC Dice-A-Roo Keyboard Controls" script 

var throwBall = document.querySelector("input[value='Throw!']")
var continueRound = document.querySelector("input[value='Continue!']");
var next = document.querySelector("input[value='Next >>>']")
var playAgain = document.querySelector("input[value='Play Again']")
var farvin = document.querySelector("img[title='Play with Farvin III the Alien Aisha']") // obviously


document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        if (throwBall != null) {
            throwBall.click();
        } else if (continueRound != null) {
            continueRound.click();
        } else if (next != null) {
            next.click();
        } else if (playAgain != null) {
            playAgain.click();
        } else if (farvin != null) {
            farvin.click();
        }
      }
    });