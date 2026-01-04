// ==UserScript==
// @name         digdig.io AutoScoreX
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Automatically increase XP in digdig.io. Best used with temp acc or unban.
// @author       You
// @match        https://digdig.io*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493490/digdigio%20AutoScoreX.user.js
// @updateURL https://update.greasyfork.org/scripts/493490/digdigio%20AutoScoreX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class DigDigPlayer {
        constructor() {
            this.XP = 0;
        }

        playGame() {
            const self = this;
            const intervalId = setInterval(() => {
                if (self.XP >= 2000000) {
                    clearInterval(intervalId);
                    console.log("XP reached 2 million!");
                    return;
                }
                self.dig();
            }, 100); // Adjust the interval as needed
        }

        dig() {
            this.XP += 10; // Increase XP by 10 each time
            console.log("XP increased to", this.XP);
            this.updateXpOnUI(); // Call a function to update the XP on the game UI
        }

        updateXpOnUI() {
            // Implement code here to update the XP on the game UI (e.g., DOM manipulation)
            // This function will depend on how the game UI is structured
            // Example: document.getElementById('xp-display').innerText = this.XP;
        }
    }

    const player = new DigDigPlayer();
    player.playGame();
})();
