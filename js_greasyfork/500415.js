// ==UserScript==
// @name         GC  Cliffhanger Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1291562-zarotrox
// @version      1.0
// @description  Press Enter to Start and Answer. Pairing with Grundos Cafe Cliffhanger Solver is advised for best result.
// @author       Zarotrox
// @match        https://www.grundos.cafe/games/cliffhanger/
// @icon         https://i.ibb.co/44SS6xZ/Zarotrox.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500415/GC%20%20Cliffhanger%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/500415/GC%20%20Cliffhanger%20Keyboard%20Controls.meta.js
// ==/UserScript==

var Play = document.querySelector("input[value='Play Cliffhanger']")
var Answer = document.querySelector("input[value='I Know!!! Let Me Solve The Puzzle!']")


function Enter (element, event) {
  if (event.keyCode == 13) {
    element.click()
  }
}

    document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
        if (Play != null) {
            Play.click();
        } else if (Answer != null) {
            Answer.click();
        }

      }
    });

