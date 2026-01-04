// ==UserScript==
// @name         BTC to USD Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts BTC balance to USD in real time
// @author       Your Name
// @match        https://freebitco.in/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515411/BTC%20to%20USD%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/515411/BTC%20to%20USD%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to fetch BTC to USD conversion rate
    async function fetchBtcToUsd() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
            const data = await response.json();
            return data.bitcoin.usd;
        } catch (error) {
            console.error('Error fetching BTC value:', error);
            return null;
        }
    }

    // Function to update balance in USD
    async function updateBalanceInUsd() {
        const balanceElement = document.getElementById('balance');
        if (!balanceElement) return;

        const btcBalance = parseFloat(balanceElement.innerText);
        const btcToUsd = await fetchBtcToUsd();

        if (btcToUsd !== null) {
            const usdBalance = (btcBalance * btcToUsd).toFixed(2);
            let usdDisplay = document.getElementById('usdBalance');

            // Create the element to display USD balance if it doesn't exist
            if (!usdDisplay) {
                usdDisplay = document.createElement('span');
                usdDisplay.id = 'usdBalance';
                usdDisplay.style.marginLeft = '10px';
                balanceElement.parentNode.insertBefore(usdDisplay, balanceElement.nextSibling);
            }

            usdDisplay.innerText = ` ($${usdBalance})`;
        }
    }

    // Update balance every 30 seconds
    setInterval(updateBalanceInUsd, 30000);

    // Call the function immediately on page load
    updateBalanceInUsd();
})();
