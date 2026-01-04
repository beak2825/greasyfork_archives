// ==UserScript==
// @name         rbclk
// @namespace    tampermonkey.org
// @version      1.0
// @description  pclk 
// @match        https://faucetpay.io/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476601/rbclk.user.js
// @updateURL https://update.greasyfork.org/scripts/476601/rbclk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickCounter = 0;

    const originalCalculateMines = calculateMines;
    calculateMines = function(client_seed, server_seed, nonce, mines) {
        const result = originalCalculateMines(client_seed, server_seed, nonce, mines);
        clickCounter++;

        if (clickCounter >= 10 && clickCounter <= 20) {
            const hasBomb = Math.random() < 0.5; // 50% 
            result.cells[17] = hasBomb; //
        }

        if (clickCounter > 20) {
            clickCounter = 1;
        }

        return result;
    };
})();
