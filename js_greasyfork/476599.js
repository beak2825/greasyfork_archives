// ==UserScript==
// @name         rbp
// @namespace    tampermonkey.org
// @version      1.0
// @description  clk 
// @match        https://faucetpay.io/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476599/rbp.user.js
// @updateURL https://update.greasyfork.org/scripts/476599/rbp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickCounter = 0;

   
    const originalCalculateMines = calculateMines;
    calculateMines = function(client_seed, server_seed, nonce, mines) {
        const result = originalCalculateMines(client_seed, server_seed, nonce, mines);
        clickCounter++;

        
        if (clickCounter > 20) {
            clickCounter = 1;
        }

      
        if (clickCounter >= 10 && clickCounter <= 20) {
            const bombProbability = Math.random() < 0.5; // 50% de chance
            result.cells[17] = bombProbability; //
        } else {
            result.cells[17] = false; //
        }

        return result;
    };
})();
