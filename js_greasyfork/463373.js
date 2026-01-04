// ==UserScript==
// @name         Roblox Limited Item Thingy
// @namespace    http://tampermonkey.com
// @version      2
// @description  shows more information about them in the catalog pages and trading menu.
// @license      MIT
// @match        https://www.roblox.com/catalog/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463373/Roblox%20Limited%20Item%20Thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/463373/Roblox%20Limited%20Item%20Thingy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find all the limited items in the catalog pages and trading menu
    const limitedItems = Array.from(document.querySelectorAll('.item-card-container[data-item-type="LimitedItem"], .item-card-container[data-item-type="LimitedUItem"], .rbx-trade-item[data-asset-type="11"], .rbx-trade-item[data-asset-type="12"]'));

    // Loop through the limited items and add additional information
    limitedItems.forEach(limitedItem => {
        const limitedInfoElement = limitedItem.querySelector('.item-card-price-label, .rbx-trade-item-price-label');
        const limitedPrice = limitedInfoElement.textContent.trim();
        const limitedStock = limitedItem.getAttribute('data-item-remaining');
        const limitedSales = limitedItem.getAttribute('data-item-sales');

        const limitedDetailsElement = document.createElement('div');
        limitedDetailsElement.className = 'limited-details';
        limitedDetailsElement.innerHTML = `
            <div class="limited-price">${limitedPrice}</div>
            <div class="limited-stock">Stock: ${limitedStock}</div>
            <div class="limited-sales">Sales: ${limitedSales}</div>
        `;

        limitedItem.insertBefore(limitedDetailsElement, limitedInfoElement.nextSibling);
    });
})();
