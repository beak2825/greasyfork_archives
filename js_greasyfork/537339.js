// ==UserScript==
// @name         ActualBidAmount
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  Show real value of bid item - 1.28*amount
// @author       You
// @match        https://canada.hibid.com/catalog/*/*
// @match        https://canada.hibid.com/account/watchlist
// @match        https://canada.hibid.com/account/currentbids
// @match        https://canada.hibid.com/livecatalog/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibid.com
// @grant        none
// @run-at       document-body
// @run-at document-end
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/537339/ActualBidAmount.user.js
// @updateURL https://update.greasyfork.org/scripts/537339/ActualBidAmount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForAnyElement(selectors, callback, maxAttempts = 40, interval = 250) {
        let attempts = 0;
        const timer = setInterval(() => {
            for (const selector of selectors) {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    callback(el);
                    return;
                }
            }
            if (++attempts >= maxAttempts) {
                clearInterval(timer);
                console.warn('Giving up waiting for', selectors);
            }
        }, interval);
    }



    // Convert a single bid span
    function convertBidSpan(span) {
        if (span.dataset.converted) return; // Prevent double conversion
        const text = span.innerText.trim().split(" ");
        const originalValue = parseFloat(text[0].replace(/[^0-9.]/g, ''));
        if (isNaN(originalValue)) return;
        const convertedValue = (originalValue * 1.26).toFixed(2);
        span.style.color = '#d3ff00';
        span.innerText = `${convertedValue} CAD`;
        span.dataset.converted = "true";
    }

    // Convert all bid spans inside a node
    function updateBidAmountsIn(node) {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches('span.TileDisplayMinBid')) {
            convertBidSpan(node);
        }
        node.querySelectorAll && node.querySelectorAll('span.TileDisplayMinBid').forEach(convertBidSpan);
    }

    // Main logic after lot-tiles is present
    function startScript(lotTiles) {
        // Initial conversion
        updateBidAmountsIn(lotTiles);

        // Observe for future dynamic changes
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                mutation.addedNodes.forEach(updateBidAmountsIn);
            }
        });
        observer.observe(lotTiles, { childList: true, subtree: true });
    }


    // Wait for the lot-tiles container or for catalog lot pages, then run everything
    waitForAnyElement(['.lot-tiles', 'body', '.lot-bid-text-container', '.d-sm-inline'], startScript);

})();
