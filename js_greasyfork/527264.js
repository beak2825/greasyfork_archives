// ==UserScript==
// @name         Amazon Search - Show Item Weight in JSON Popout
// @namespace    https://example.com
// @version      1.4
// @description  Fetch item weight from Amazon product pages and display it in JSON on a new page when a button is clicked.
// @match        https://www.amazon.com/s*
// @grant        GM_xmlhttpRequest
// @connect      amazon.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527264/Amazon%20Search%20-%20Show%20Item%20Weight%20in%20JSON%20Popout.user.js
// @updateURL https://update.greasyfork.org/scripts/527264/Amazon%20Search%20-%20Show%20Item%20Weight%20in%20JSON%20Popout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global array to store results
    const productData = [];

    // Create and style a button to add to the page
    const button = document.createElement('button');
    button.textContent = 'Show Item Weight Data (JSON)';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '8px';
    button.style.backgroundColor = '#ff9900';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Gather all candidate links from the page
    const allLinks = document.querySelectorAll('a[href]');
    const productLinkObjects = [];

    // Regex to extract the ASIN from URLs with /dp/
    const dpRegex = /\/dp\/([A-Z0-9]{10})/;

    // Collect only links that match /dp/ and extract the ASIN
    allLinks.forEach(link => {
        const href = link.href;
        const match = href.match(dpRegex);
        if (match) {
            productLinkObjects.push({
                key: match[1],
                href: href,
                linkElement: link
            });
        }
    });

    // Deduplicate by ASIN key
    const deduped = {};
    const dedupedLinks = [];
    productLinkObjects.forEach(obj => {
        if (!deduped[obj.key]) {
            deduped[obj.key] = true;
            dedupedLinks.push(obj);
        }
    });

    // Helper function to fetch item weight for a given product link
    function fetchItemWeight({ href }) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: href,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                // Attempt to find the "Item Weight" row in the product details
                const thElements = doc.querySelectorAll('th.a-color-secondary.a-size-base.prodDetSectionEntry');
                let itemWeightValue = '';

                for (const th of thElements) {
                    const label = th.innerText.trim();
                    if (label === 'Item Weight') {
                        const td = th.nextElementSibling;
                        if (td) {
                            itemWeightValue = td.innerText.trim();
                        }
                        break;
                    }
                }

                // Save the result
                productData.push({
                    url: href,
                    weight: itemWeightValue
                });
            },
            onerror: function() {
                console.log('Failed to fetch product details for:', href);
            }
        });
    }

    // Fetch item weight for each deduplicated product link
    dedupedLinks.forEach(obj => {
        fetchItemWeight(obj);
    });

    // When the button is clicked, open a new page with JSON data
    button.addEventListener('click', () => {
        // Convert the productData array to a formatted JSON string
        const jsonString = JSON.stringify(productData, null, 2);

        // Open a new window/tab
        const newWindow = window.open('', '_blank');

        // Write HTML into the new window with the JSON inside a <pre> tag for formatting
        newWindow.document.write(`
            <html>
                <head>
                    <title>Product Data JSON</title>
                    <style>
                        body { font-family: monospace; margin: 20px; }
                        pre { white-space: pre-wrap; word-wrap: break-word; }
                    </style>
                </head>
                <body>
                    <h1>Product Data</h1>
                    <pre>${jsonString}</pre>
                </body>
            </html>
        `);
        newWindow.document.close();
    });
})();


(function() {
    'use strict';

    // Create a global array to store the results
    const productData = [];

    // Create and style a button to add to the page
    const button = document.createElement('button');
    button.textContent = 'Show Item Weight Data (JSON)';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '8px';
    button.style.backgroundColor = '#ff9900';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // Only select links whose href includes '/dp/'
    const productLinks = document.querySelectorAll('a[href*="/dp/"]');

    // Helper function to fetch item weight for a single product link
    function fetchItemWeight(linkElement) {
        const url = linkElement.href;
        console.log('Getting details for:', url);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                // Attempt to find the "Item Weight" row in the product details
                const thElements = doc.querySelectorAll('th.a-color-secondary.a-size-base.prodDetSectionEntry');
                let itemWeightValue = '';

                for (const th of thElements) {
                    const label = th.innerText.trim();
                    if (label === 'Item Weight') {
                        const td = th.nextElementSibling;
                        if (td) {
                            itemWeightValue = td.innerText.trim();
                        }
                        break;
                    }
                }

                // Add the result to the productData array
                productData.push({
                    url: url,
                    weight: itemWeightValue
                });
            },
            onerror: function() {
                console.log('Failed to fetch product details for:', url);
            }
        });
    }

    // Fetch item weight for each product link
    productLinks.forEach(link => {
        fetchItemWeight(link);
    });

    // When the button is clicked, open a new page with JSON data
    button.addEventListener('click', () => {
        // Convert the productData array to a JSON string
        const jsonString = JSON.stringify(productData, null, 2);

        // Open a new window
        const newWindow = window.open('', '_blank');

        // Write HTML into the new window
        newWindow.document.write(`
            <html>
                <head>
                    <title>Product Data JSON</title>
                    <style>
                        body { font-family: monospace; margin: 20px; }
                        pre { white-space: pre-wrap; word-wrap: break-word; }
                    </style>
                </head>
                <body>
                    <h1>Product Data</h1>
                    <pre>${jsonString}</pre>
                </body>
            </html>
        `);
        newWindow.document.close();
    });
})();
