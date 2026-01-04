// ==UserScript==
// @name         Neopets - Dice-A-Roo Autoplayer
// @namespace    https://greasyfork.org/en/users/1450608-dogwithglasses
// @version      1.6
// @description  Autoplays Dice-A-Roo
// @match        *://www.neopets.com/games/play_dicearoo.phtml*
// @match        *://www.neopets.com/games/dicearoo.phtml*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532215/Neopets%20-%20Dice-A-Roo%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/532215/Neopets%20-%20Dice-A-Roo%20Autoplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        const letsPlayBtn = findLinkContainingString("Lets Play!");
        const playBtn = findLinkContainingString("Play Dice-A-Roo");
        const rollAgainBtn = findLinkContainingString("Roll Again");
        const pressMeBtn = findLinkContainingString("Press Me");

        const buttonsFound = letsPlayBtn || playBtn || rollAgainBtn || pressMeBtn;

        if (!buttonsFound && !document.body.innerHTML.includes("Im SO BORED of Dice-A-Roo")) {
            location.reload();
            return;
        }

        if (letsPlayBtn) {
            letsPlayBtn.click();
        } else if (playBtn) {
            playBtn.click();
        } else if (document.body.innerHTML.search("You are now eligible to use") < 0) {
            if (rollAgainBtn) {
                rollAgainBtn.click();
            } else if (pressMeBtn) {
                pressMeBtn.click();
            }
        }
    }

    function findLinkContainingString(searchText) {
        const inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value.search(searchText) !== -1) {
                return inputs[i];
            }
        }
        return null;
    }

    setTimeout(main, Math.floor(Math.random() * 800) + 200);

})();