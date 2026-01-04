// ==UserScript==
// @name         GC Dice-A-Roo Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.3
// @description  Adds keyboard controls for Dice-A-Roo on GC.
// @author       sanjix
// @match        https://www.grundos.cafe/games/play_dicearoo/
// @match        https://www.grundos.cafe/games/dicearoo/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475566/GC%20Dice-A-Roo%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/475566/GC%20Dice-A-Roo%20Keyboard%20Controls.meta.js
// ==/UserScript==
var restart = document.querySelector("input[value='Press Me']")
var play = document.querySelector("input[value='Lets Play!']")
var roll = document.querySelector("input[value='Roll Again']");


function diceARoo(element, event) {
  if (event.keyCode == 13) {
    element.click()
  }
}

document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        if (play != null) {
            play.click();
        } else if (roll != null) {
            roll.click();
        } else if (restart != null) {
            restart.click();
        }
      }
    });