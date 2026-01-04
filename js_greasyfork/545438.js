// ==UserScript==
// @name         CellCraft.io Infinite Coins Display
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays an increasing coin count to simulate infinite coins
// @author       S E N S E
// @match        *://cellcraft.io/*
// @license      S E N S E
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545438/CellCraftio%20Infinite%20Coins%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/545438/CellCraftio%20Infinite%20Coins%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findCoinDisplay() {
        return document.querySelector('.coins-count, #coins, .coin-counter');
    }

    let fakeCoins = 1000;
    const increment = 500;
    const intervalMs = 1000;

    function updateFakeCoins() {
        const coinDisplay = findCoinDisplay();
        if (coinDisplay) {
            fakeCoins += increment;
            coinDisplay.textContent = fakeCoins.toLocaleString();
        }
    }

    function startFakeCoins() {
        const coinDisplay = findCoinDisplay();
        if (coinDisplay) {
            setInterval(updateFakeCoins, intervalMs);
        } else {
            setTimeout(startFakeCoins, 1000);
        }
    }

    startFakeCoins();
})();