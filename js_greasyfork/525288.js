// ==UserScript==
// @name         Tradingview Hide Unwanted Broker List Buttons
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hide buttons except those for TradeStation, OANDA, and Paper on TradingView
// @author       ChatGPT
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @match        https://www.tradingview.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525288/Tradingview%20Hide%20Unwanted%20Broker%20List%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/525288/Tradingview%20Hide%20Unwanted%20Broker%20List%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideUnwantedButtons() {
        // Define the brokers you want to keep
        const brokersToKeep = ['Paper', 'TRADESTATION']

        // Get all elements with the data-broker attribute
        const buttons = document.querySelectorAll('[data-broker]');

        // Loop through all buttons and hide the ones not in the brokersToKeep list
        buttons.forEach(button => {
            const broker = button.getAttribute('data-broker');
            if (!brokersToKeep.includes(broker)) {
                button.style.display = 'none';
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', hideUnwantedButtons);

    // Optionally, run the function again when there are changes in the DOM
    const observer = new MutationObserver(hideUnwantedButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Adding a slight delay to ensure all elements are loaded
    setTimeout(hideUnwantedButtons, 2000);
})();
