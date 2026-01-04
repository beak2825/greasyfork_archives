// ==UserScript==
// @name         Tradingview Chatroom Premium
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify the "P" to pro/pro+/premium with proper alignment
// @author       Simonfoobar
// @match        https://*.tradingview.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469116/Tradingview%20Chatroom%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/469116/Tradingview%20Chatroom%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyP() {
        // Find all "a" elements with a title attribute
        var aElems = document.querySelectorAll('a[title]');
        aElems.forEach(function(aElem) {
            // Check if the title is "Premium", "Pro" or "Plus"
            var title = aElem.title;
            if (title === 'Premium') {
                // Find the span inside this "a" element
                var spanElem = aElem.querySelector('span');
                // Change the text and apply consistent styling
                if (spanElem) {
                    spanElem.textContent = 'P';
                    spanElem.style.fontStyle = 'normal';
                    spanElem.style.fontWeight = 'bold';
                    spanElem.style.color = '#000';
                    spanElem.style.margin = '0 4px';
                }
            }
        });
    }

    // Run the function every time the page loads or changes
    modifyP();
    var observer = new MutationObserver(modifyP);
    observer.observe(document.body, { childList: true, subtree: true, attributes: false });
})();