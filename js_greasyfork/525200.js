// ==UserScript==
// @name         Add 100 Coins
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds 100 coins to your balance
// @author       You
// @match        https://bangvicro.github.io/link/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525200/Add%20100%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/525200/Add%20100%20Coins.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function addCoins() {
        let coinElement = document.querySelector('#coin-count'); // Adjust selector if needed
        if (coinElement) {
            let currentCoins = parseInt(coinElement.textContent, 10) || 0;
            coinElement.textContent = currentCoins + 100;
        } else {
            console.warn('Coin element not found. Check the selector.');
        }
    }
    
    // Run the function
    addCoins();
})();
