// ==UserScript==
// @name         Amazon Keepa Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button above the buy box to open the product in Keepa, updates dynamically on navigation
// @author       You
// @match        https://www.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526556/Amazon%20Keepa%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/526556/Amazon%20Keepa%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getProductId() {
        const match = window.location.pathname.match(/(?:dp|product)\/([A-Z0-9]{10})/);
        return match ? match[1] : null;
    }

    function insertKeepaButton() {
        const productId = getProductId();
        if (!productId) return;

        const keepaUrl = `https://keepa.com/#!product/1-${productId}`;
        const buyBox = document.getElementById('desktop_buybox');

        if (buyBox && !document.getElementById('keepa-button')) {
            const button = document.createElement('button');
            button.id = 'keepa-button';
            button.textContent = 'Price History ⮣';
            button.style.background = 'linear-gradient(to right, #f7986c, #79cf55)';
            button.style.color = 'white';
            button.style.padding = '10px';
            button.style.marginBottom = '10px';
            button.style.width = '100%';
            button.style.fontSize = '16px';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '4px';

            button.onclick = function() {
                window.open(keepaUrl, '_blank');
            };

            buyBox.prepend(button);
        }
    }

    function observeUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(insertKeepaButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    insertKeepaButton();
    observeUrlChanges();
})();
