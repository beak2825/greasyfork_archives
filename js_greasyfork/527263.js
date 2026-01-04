// ==UserScript==
// @name         Amazon Search - Show Item Weight
// @namespace    https://example.com
// @version      1.0
// @description  Fetch item weight from Amazon product pages and display it on search results
// @match        https://www.amazon.com/s*
// @grant        GM_xmlhttpRequest
// @connect      amazon.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527263/Amazon%20Search%20-%20Show%20Item%20Weight.user.js
// @updateURL https://update.greasyfork.org/scripts/527263/Amazon%20Search%20-%20Show%20Item%20Weight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Query all links on the search page that point to a product detail page
    // Typically these links contain "/dp/" or "/gp/" segments
    const productLinks = document.querySelectorAll('a[href*="/dp/"], a[href*="/gp/"]');

    productLinks.forEach(link => {
        const href = link.href;

        // Use GM_xmlhttpRequest to fetch the product detail page in the background
        GM_xmlhttpRequest({
            method: 'GET',
            url: href,
            onload: function(response) {
                // Parse the returned HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                // Find all <th> elements that match the detail label
                // Because we can't do :contains() in pure CSS, we'll iterate
                const thElements = doc.querySelectorAll('th.a-color-secondary.a-size-base.prodDetSectionEntry');

                let itemWeightValue = '';

                for (const th of thElements) {
                    const label = th.innerText.trim();
                    if (label === 'Item Weight') {
                        // The <td> containing the value should be the next sibling
                        const td = th.nextElementSibling;
                        if (td) {
                            itemWeightValue = td.innerText.trim();
                        }
                        break;
                    }
                }

                // If we found a weight, display it next to the product link on the search page
                if (itemWeightValue) {
                    const span = document.createElement('span');
                    span.style.color = 'red';
                    span.style.fontWeight = 'bold';
                    span.textContent = ` (Weight: ${itemWeightValue})`;
                    link.appendChild(span);
                }
            },
            onerror: function() {
                console.log('Failed to fetch product details for:', href);
            }
        });
    });
})();
