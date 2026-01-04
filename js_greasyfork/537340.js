// ==UserScript==
// @name         ActualBidAmount (Lot Page Only, 5s Delay)
// @namespace    http://tampermonkey.net/
// @version      2025-05-11
// @description  Show real value of bid item - 1.28*amount (waits 5s for HiBid lot pages)
// @author       You
// @match        https://canada.hibid.com/lot/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibid.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537340/ActualBidAmount%20%28Lot%20Page%20Only%2C%205s%20Delay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537340/ActualBidAmount%20%28Lot%20Page%20Only%2C%205s%20Delay%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Converts a single bid span
    function convertBidSpan(span) {
        if (span.dataset.converted) return; // Prevent double conversion
        const text = span.innerText.trim().split(" ");
        const originalValue = parseFloat(text[0].replace(/[^0-9.]/g, ''));
        if (isNaN(originalValue)) return;
        const convertedValue = (originalValue * 1.28).toFixed(2);
        span.style.color = '#d3ff00';
        span.innerText = `${convertedValue} CAD`;
        span.dataset.converted = "true";
    }

    // Converts all bid spans on the page
    function updateBidAmounts() {
        document.querySelectorAll('span.TileDisplayMinBid').forEach(convertBidSpan);
    }

    // Wait 5 seconds, then update
    setTimeout(updateBidAmounts, 3000);

})();
