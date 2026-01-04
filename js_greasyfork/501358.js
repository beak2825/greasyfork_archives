// ==UserScript==
// @name         CZK to EUR Converter for bazos.cz
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Convert prices from CZK to EUR on bazos.cz using a configurable exchange rate
// @author       Adam
// @match        https://*.bazos.cz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501358/CZK%20to%20EUR%20Converter%20for%20bazoscz.user.js
// @updateURL https://update.greasyfork.org/scripts/501358/CZK%20to%20EUR%20Converter%20for%20bazoscz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default exchange rate:  = 0.040 EUR
    let exchangeRate = 0.040;

    // Prompt user to set the exchange rate
    const userRate = prompt("Enter the exchange rate for CZK to EUR:", exchangeRate);
    if (!isNaN(parseFloat(userRate)) && isFinite(userRate)) {
        exchangeRate = parseFloat(userRate);
    }

    // Function to convert price from CZK to EUR and update the DOM
    function convertPrices() {
        const priceElements = document.querySelectorAll('.inzeratycena b, tr td b');

        priceElements.forEach(element => {
            const priceText = element.textContent.trim();
            const priceCZK = parseFloat(priceText.replace(/[^0-9]/g, ''));
            if (!isNaN(priceCZK)) {
                const priceEUR = (priceCZK * exchangeRate).toFixed(2);
                element.textContent = `${priceCZK} Kč (${priceEUR} €)`;
            }
        });
    }

    // Convert prices once the page loads
    window.addEventListener('load', convertPrices);
})();
