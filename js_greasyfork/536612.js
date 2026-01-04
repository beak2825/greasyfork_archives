// ==UserScript==
// @name         Tweakers PriceGraph Mover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Move priceGraph below listings
// @author       Markisoke
// @match        https://tweakers.net/pricewatch/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536612/Tweakers%20PriceGraph%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/536612/Tweakers%20PriceGraph%20Mover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveAndResize() {
        const priceGraph = document.querySelector('.priceGraph');
        const listing = document.getElementById('listing');
        const reference = document.querySelector('.top-banner.hideInGradeXS.loading.reserveSpace');

        if (priceGraph && listing && reference) {
            // Move priceGraph after listing
            if (listing.nextSibling !== priceGraph) {
                listing.parentNode.insertBefore(priceGraph, listing.nextSibling);
            }

            // Match width
            const refWidth = window.getComputedStyle(reference).width;

            [listing, priceGraph].forEach(el => {
                el.style.width = refWidth;
                el.style.maxWidth = refWidth;
                el.style.margin = '0 auto';
                el.style.boxSizing = 'border-box';
            });

            const listingTable = listing.querySelector('table');
            if (listingTable) {
                listingTable.style.width = '100%';
                listingTable.style.tableLayout = 'auto';
            }
        }
    }

    // Observe for dynamic content
    const observer = new MutationObserver(() => {
        const listing = document.getElementById('listing');
        const priceGraph = document.querySelector('.priceGraph');
        const reference = document.querySelector('.top-banner.hideInGradeXS.loading.reserveSpace');

        if (listing && priceGraph && reference) {
            moveAndResize();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also run after full DOM load
    window.addEventListener('load', moveAndResize);
})();