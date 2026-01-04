// ==UserScript==
// @name         Etsy Price Rounder
// @version      1.99
// @description  Rounds prices to the nearest $0.25
// @author       JustAnOkapi
// @match        https://www.etsy.com/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1198856
// @downloadURL https://update.greasyfork.org/scripts/477682/Etsy%20Price%20Rounder.user.js
// @updateURL https://update.greasyfork.org/scripts/477682/Etsy%20Price%20Rounder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to round all prices
    function roundPrices() {
        // Round prices in class
        const priceElements = document.querySelectorAll('.currency-value');
        for (const priceElement of priceElements) {
            const priceValue = parseFloat(priceElement.textContent);
            if (!isNaN(priceValue)) {
                const roundedPrice = Math.round(priceValue * 4) / 4;
                priceElement.textContent = roundedPrice.toFixed(2);
            }
        }
        // Round prices in text nodes
        const textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while (textNodes.nextNode()) {
            const node = textNodes.currentNode;
            const text = node.textContent;

            // Use a regular expression to match prices in different formats
            const roundedText = text.replace(/\$(\d+\.\d{2})/g, (match, price) => {
                const roundedPrice = Math.round(parseFloat(price) * 4) / 4;
                return '$' + roundedPrice.toFixed(2);
            });

            if (roundedText !== text) {
                node.textContent = roundedText;
            }
        }
    }

    // Always up to date
    const observer = new MutationObserver(roundPrices);
    observer.observe(document.body, { childList: true, subtree: true });
})();
