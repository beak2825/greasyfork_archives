// ==UserScript==
// @name         Extract and Copy Product Info from WikiArms
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract product info and URL from WikiArms AmmoEngine search results
// @author       You
// @match        https://www.wikiarms.com/search?caliber=*&source=*&q=*
// @license MIT
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/495998/Extract%20and%20Copy%20Product%20Info%20from%20WikiArms.user.js
// @updateURL https://update.greasyfork.org/scripts/495998/Extract%20and%20Copy%20Product%20Info%20from%20WikiArms.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract and copy product info
    function extractAndCopyProductInfo() {
        // Target the first product row
        const firstRow = document.querySelector('#products-table .table tbody tr:first-child');
        if (!firstRow) {
            console.log("No product row found.");
            return;
        }

        // Extract details
        const productLinkElement = firstRow.querySelector('.product a');
        const productName = productLinkElement.textContent.trim();
        const productLink = productLinkElement.getAttribute('href');
        const pricePerRound = firstRow.querySelector('.ppr').textContent.trim();
        const totalPrice = firstRow.querySelector('.price').textContent.trim();

        // Concatenate the details
        const info = `Product: ${productName}, Price Per Round: ${pricePerRound}, Total Price: ${totalPrice}, Link: ${productLink}`;

        // Copy to clipboard
        GM_setClipboard(info);
    }

    // Call the function to extract and copy info
    extractAndCopyProductInfo();
})();
