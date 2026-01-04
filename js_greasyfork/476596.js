// ==UserScript==
// @name         nbc 
// @namespace    your_namespace
// @version      1.0
// @description  rmg
// @match       https://faucetpay.io/mines
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476596/nbc.user.js
// @updateURL https://update.greasyfork.org/scripts/476596/nbc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    const originalCalculateMines = calculateMines;
    calculateMines = function(client_seed, server_seed, nonce, mines) {
        const result = originalCalculateMines(client_seed, server_seed, nonce, mines);

        //
        result.cells = Array(25).fill(false);

        return result;
    };
})();
