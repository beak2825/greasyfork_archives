
// ==UserScript==
// @name         rbp 
// @namespace    tampermonkey.org
// @version      1.2
// @description  gba
// @match        https://faucetpay.io/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476598/rbp.user.js
// @updateURL https://update.greasyfork.org/scripts/476598/rbp.meta.js
// ==/UserScript==

(function() {
    'use strict';

   
    const originalCalculateMines = calculateMines;
    calculateMines = function(client_seed, server_seed, nonce, mines) {
        const result = originalCalculateMines(client_seed, server_seed, nonce, mines);

     
        const bombProbability = 0.05; // Por exemplo, 5% de chance

        for (let i = 0; i < result.cells.length; i++) {
            if (i === 17 && Math.random() < bombProbability) {
                result.cells[i] = true; //
            } else {
                result.cells[i] = false; //
            }
        }

        return result;
    };
})();
