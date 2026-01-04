// ==UserScript==
// @name         JoshWorth 78 Coins Always Flip on
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Forces all coin flips to land on tails on joshworth.com/dev/78coins/
// @author       You
// @match        https://joshworth.com/dev/78coins/
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531723/JoshWorth%2078%20Coins%20Always%20Flip%20on.user.js
// @updateURL https://update.greasyfork.org/scripts/531723/JoshWorth%2078%20Coins%20Always%20Flip%20on.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Override the random selection in the flip function
        const originalFlip = window.coins[0].flip;

        window.coins.forEach(coin => {
            coin.flip = function() {
                // Force tails by always returning tailFlip
                return window.getFlippage(this.box, window.tailFlip(this));
            };
        });

        // Also modify the initial state to show tails
        document.querySelectorAll('.coinHeads').forEach(head => {
            head.style.transform = 'matrix(1, 0, 0, 0, 0, 0)';
        });
        document.querySelectorAll('.coinTails').forEach(tail => {
            tail.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
        });

        console.log('All coins will now land on tails!');
    });
})();