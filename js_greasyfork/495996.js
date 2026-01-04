// ==UserScript==
// @name         eBay Spec Scraper wVARIABLE IMAGES (Updated)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @license MIT
// @description  Updated script to reliably copy eBay listing info including prices.
// @author       You
// @match        *://*.ebay.com/itm/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/495996/eBay%20Spec%20Scraper%20wVARIABLE%20IMAGES%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495996/eBay%20Spec%20Scraper%20wVARIABLE%20IMAGES%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract up to 25 item specifics and specific attributes
    function extractItemSpecifics() {
        let rows = document.querySelectorAll('.ux-layout-section-evo__row');
        let specifics = {};
        let specificAttributes = {};
        let maxPairs = 25; // Updated to 25 from 15
        const requiredAttributes = ['Brand', 'MPN', 'ePID', 'UPC', 'Type'];

        rows.forEach(row => {
            let columns = row.querySelectorAll('.ux-layout-section-evo__col');

            columns.forEach(col => {
                if (Object.keys(specifics).length < maxPairs) {
                    let name = col.querySelector('.ux-labels-values__labels .ux-textspans')?.textContent.trim();
                    let value = col.querySelector('.ux-labels-values__values .ux-textspans')?.textContent.trim();

                    if (name && value) {
                        specifics[name] = value;
                        if (requiredAttributes.includes(name)) {
                            specificAttributes[name] = value;
                        }
                    }
                }
            });
        });

        return { specifics, specificAttributes };
    }

    // Function to format data for JSON output
    function formatForJSON(specifics) {
        return specifics;
    }

    // Function to extract listing details including specific attributes
    function extractDetails(specificAttributes) {
        var title = document.querySelector('#mainContent > div > div.vim.x-item-title > h1 > span')?.textContent.trim();
        var price = extractPrice(); // Call the new function to extract the price
        var condition = document.querySelector('#mainContent > div > div.vim.x-item-condition.mar-t-20 > div.x-item-condition-text > div > span > span:nth-child(1) > span')?.textContent.trim() || '--';
        var shippingCost = document.querySelector('#mainContent > div > div.vim.d-shipping-minview.mar-t-20 > div > div > div > div:nth-child(1) > div > div > div.ux-labels-values__values.col-9 > div > div:nth-child(1) > span.ux-textspans.ux-textspans--BOLD')?.textContent.trim() || 'Varies';
        var url = window.location.href;
        var itemNumberMatch = url.match(/\/itm\/(\d+)/);
        var itemNumber = itemNumberMatch ? itemNumberMatch[1] : 'N/A';
        var epidMatch = url.match(/epid=(\d+)/);
        var epid = epidMatch ? epidMatch[1] : 'N/A';
        var iframeSrc = document.querySelector('#desc_ifr')?.src;
        var categoryNumber = iframeSrc ? new URLSearchParams(new URL(iframeSrc).search).get('category') : 'N/A';

        var details = {
            Title: title,
            Price: price,
            Condition: condition,
            ShippingCost: shippingCost,
            ItemNumber: itemNumber,
            CategoryNumber: categoryNumber,
            EbayCatalogNumber: epid
        };

        // Include specific attributes in details, checking for duplicates
        for (const [key, value] of Object.entries(specificAttributes)) {
            if (!details.hasOwnProperty(key)) {
                details[key] = value;
            }
        }
        return details;
    }

    // New function to extract the price value from the updated eBay page structure
    function extractPrice() {
        // Primary price class
        const priceElement = document.querySelector('.x-price-primary .ux-textspans');
        if (priceElement) {
            return priceElement.textContent.replace(/[^0-9.]/g, '').trim(); // Clean and return the price
        }
        return 'Price not found'; // Fallback in case the price is not found
    }

    // Function to extract the image link for the "500w" size
    function extractImageLink() {
        var imageElement = document.querySelector('img[srcset]');
        if (imageElement) {
            var srcset = imageElement.getAttribute('srcset');
            var sizes = ['s-l200', 's-l300', 's-l500', 's-l960', 's-l1600', 's-l2000'];
            for (let size of sizes) {
                var match = srcset.match(new RegExp(`\\bhttps?:\/\/\\S*?${size}\\.\\S*?(?=\\s|$)`));
                if (match) {
                    return match[0];
                }
            }
            return 'No suitable image found for specified sizes.';
        }
        return 'No image element found.';
    }

    window.addEventListener('load', function() {
        let { specifics, specificAttributes } = extractItemSpecifics();
        let formattedSpecifics = Object.keys(specifics).length > 0 ? formatForJSON(specifics) : { message: 'No item specifics found.' };
        let details = extractDetails(specificAttributes);
        let imageLink = extractImageLink();
        let combinedData = { Specifics: formattedSpecifics, Details: details, ImageLink: imageLink };

        GM_setClipboard(JSON.stringify(combinedData, null, 2));
        console.log('Data copied to clipboard:', combinedData);
    }, false);
})();
