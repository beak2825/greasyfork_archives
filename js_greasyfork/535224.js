// ==UserScript==
// @name         Torn - EZ Stock Converter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Type d100k instead of calculating shares. Just type d, money want and add k/m/b and it does the math for you.
// @author       GFOUR [3498427]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535224/Torn%20-%20EZ%20Stock%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/535224/Torn%20-%20EZ%20Stock%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const FEE_PERCENT = 0.1;
    const MULTIPLIERS = {
        'k': 1000,
        'm': 1000000,
        'b': 1000000000
    };

    // Observer configuration
    const OBSERVER_OPTIONS = { childList: true, subtree: true };

    /**
     * Converts a string with suffix (k, m, b) to a number
     * @param {string} value - The value to convert
     * @returns {number} - The converted number
     */
    function parseMoneyInput(value) {
        // Remove any non-alphanumeric characters except dots
        const cleanValue = value.replace(/[^0-9kmb.]/gi, '');

        // Check for suffixes
        let multiplier = 1;
        let numericPart = cleanValue;

        if (cleanValue.match(/[kmb]$/i)) {
            const suffix = cleanValue.slice(-1).toLowerCase();
            multiplier = MULTIPLIERS[suffix] || 1;
            numericPart = cleanValue.slice(0, -1);
        }

        const amount = parseFloat(numericPart);
        return isNaN(amount) ? 0 : amount * multiplier;
    }

    /**
     * Gets the current stock price from the DOM
     * @param {HTMLElement} inputElement - The input element
     * @returns {number} - The current stock price
     */
    function getCurrentPrice(inputElement) {
        try {
            const stockLine = inputElement.closest("div#panel-ownedTab").previousSibling;
            const labels = stockLine.querySelectorAll("span[class^=number__]");

            // Combine text from all number spans
            let numberStr = Array.from(labels).map(node => node.innerText).join('');
            return parseFloat(numberStr.replace(/[^0-9.]/g, ''));
        } catch (e) {
            console.error("Error getting stock price:", e);
            return 1; // Default to prevent division by zero
        }
    }

    /**
     * Handles input in money fields
     * @param {Event} event - The input event
     */
    function handleMoneyInput(event) {
        const input = event.target;
        const value = input.value.trim();

        // Only process if the value ends with k, m, or b
        if (value.match(/[kmb]$/i)) {
            const amount = parseMoneyInput(value);
            if (amount > 0) {
                const currentPrice = getCurrentPrice(input);

                // Calculate shares needed and round up
                const shares = Math.ceil(amount / currentPrice);

                // Update the input value
                setTimeout(() => {
                    input.value = shares;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                }, 10);
            }
        }
    }

    /**
     * Attaches event listeners to money input fields
     */
    function attachMoneyInputListeners() {
        const moneyInputs = document.querySelectorAll("input.input-money");
        moneyInputs.forEach(input => {
            // Remove existing listeners to prevent duplicates
            input.removeEventListener("input", handleMoneyInput);
            input.addEventListener("input", handleMoneyInput);
        });
    }

    /**
     * Observer callback for when money fields appear
     */
    const observerCallback = (mutations) => {
        attachMoneyInputListeners();
    };

    // Initialize the script
    function initialize() {
        const checkForStockMarket = setInterval(() => {
            const stockMarket = document.querySelector("div#stockmarketroot");

            if (stockMarket) {
                const observer = new MutationObserver(observerCallback);
                observer.observe(stockMarket, OBSERVER_OPTIONS);

                // Initial attachment of listeners
                attachMoneyInputListeners();

                clearInterval(checkForStockMarket);
            }
        }, 250);
    }

    // Start the script
    initialize();
})();