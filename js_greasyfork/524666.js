// ==UserScript==
// @name         Steam Wishlist total
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  Show an alert with the summed price of all items in the wish list
// @author       pindab0ter
// @match        https://store.steampowered.com/wishlist/id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524666/Steam%20Wishlist%20total.user.js
// @updateURL https://update.greasyfork.org/scripts/524666/Steam%20Wishlist%20total.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTotalPrice() {
        let total = 0;
        let currencySymbol = '';
        const priceElements = document.evaluate(
            '//div[starts-with(@data-rfd-draggable-id, "WishlistItem")]/div[2]/div[2]/div[2]/div/div/div/div',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        const currencyMap = {
            '$': 'USD',
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            '₩': 'KRW',
            '₽': 'RUB',
            '₹': 'INR',
            // Add more mappings as needed
        };

        for (let i = 0; i < priceElements.snapshotLength; i++) {
            const priceText = priceElements.snapshotItem(i).textContent.trim();

            const symbolMatch = priceText.match(/[^0-9.,]/);
            if (symbolMatch) {
                currencySymbol = symbolMatch[0];
            }

            const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(price)) {
                total += price;
            }
        }

        const currencyCode = currencyMap[currencySymbol] || 'USD';

        const formattedTotal = new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: currencyCode
        }).format(total / 100);

        alert('Total price of all items in wishlist: ' + formattedTotal);
    }

    window.addEventListener('load', getTotalPrice);
})();