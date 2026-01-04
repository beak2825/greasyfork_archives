// ==UserScript==
// @name         JellyNeo Inflation Parser
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Displays the calculated value of inflated items, as adults are capable of making decisions in a manipulated market despite not wanting to do math manually.
// @author       Domain (the_public_domain)
// @match        https://items.jellyneo.net/item/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502030/JellyNeo%20Inflation%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/502030/JellyNeo%20Inflation%20Parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the first div with class "price-row" inside div with class "pricing-row-container"
    const pricingRowContainer = document.querySelector('div.pricing-row-container');
    if (pricingRowContainer) {
        const priceRow = pricingRowContainer.querySelector('div.price-row');
        const olderPriceRow = pricingRowContainer.querySelector('div.older-price');

        // Check if the first "price-row" contains the text "Inflation Notice:"
        if (priceRow && olderPriceRow && priceRow.textContent.includes("Inflation Notice:")) {
            // Extract the percentage increase value
            const inflationText = priceRow.textContent.match(/Inflation Notice:\s+\+(\d+)%/);
            if (inflationText && inflationText[1]) {
                const percentageIncrease = parseInt(inflationText[1]);

                // Extract the number value from the first "older-price"
                const olderPriceText = olderPriceRow.textContent.match(/(\d+,?\d*,?\d*)\s*NP/);
                if (olderPriceText && olderPriceText[1]) {
                    const olderPriceValue = parseInt(olderPriceText[1].replace(/,/g, ''));

                    // Calculate the new inflated price
                    const inflatedPriceValue = olderPriceValue * (1 + percentageIncrease / 100);
                    const inflatedPriceText = `Inflated: ${inflatedPriceValue.toLocaleString()} NP`;

                    // Replace the contents of the first "price-row" with the new value
                    priceRow.textContent = inflatedPriceText;
                }
            }
        }
    }
})();
