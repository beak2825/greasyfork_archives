// ==UserScript==
// @name         Bunnings Grey Out Marketplace Items
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Greys out Bunnings items with "Marketplace" badge
// @match        https://www.bunnings.com.au/*
// @grant        none
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/532032/Bunnings%20Grey%20Out%20Marketplace%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/532032/Bunnings%20Grey%20Out%20Marketplace%20Items.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const greyOutItems = () => {
        // Select all product tiles
        const productTiles = document.querySelectorAll('article.search-product-tile');

        productTiles.forEach(tile => {
            const badge = tile.querySelector('div.badgeText');
            if (badge) {
                const text = badge.textContent.trim().toLowerCase();
                if (['marketplace', 'special order'].includes(text)) {
                    // Apply grey-out styling
                    tile.style.opacity = '0.4';
                    tile.style.filter = 'grayscale(100%)';
                    tile.style.pointerEvents = 'none'; // optional: disable interaction
                    tile.style.transition = 'all 0.3s ease-in-out';
                    console.log('Grayed out item:', text, tile);
                }
            }
        });
    };

    // Observe dynamic content loading
    const observer = new MutationObserver(greyOutItems);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    window.addEventListener('load', greyOutItems);
})();

