// ==UserScript==
// @name         eBay Remove Listings with Price Range
// @namespace    ebay_remove_price_range_listings
// @version      2025.07.18
// @description  Removes eBay listings that show a price range from search results
// @author       bwhurd
// @match        https://www.ebay.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542947/eBay%20Remove%20Listings%20with%20Price%20Range.user.js
// @updateURL https://update.greasyfork.org/scripts/542947/eBay%20Remove%20Listings%20with%20Price%20Range.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIG ---
    // Optionally, set a whitelist of search terms to skip script
    const whitelist = ['gameboy color', 'amiga 1200'];
    const searchParams = new URLSearchParams(location.search);
    if (whitelist.includes((searchParams.get('_nkw') || '').toLowerCase())) return;

    let removed = 0;

    // Helper function to remove price range listings
    function removePriceRangeListings() {
        // All price spans in search results
        let priceSpans = document.querySelectorAll('span.s-item__price');
        priceSpans.forEach(span => {
            let text = span.textContent.replace(/\s+/g, ' ').trim();
            // Match "$X.XX to $Y.YY" (or similar, e.g. "AU $1.50 to AU $9.99")
            if (/to/i.test(text)) {
                // Remove the top li.s-item ancestor
                let li = span.closest('li.s-item');
                if (li && li.parentNode) {
                    li.parentNode.removeChild(li);
                    removed++;
                }
            }
        });
    }

    // Initial removal
    removePriceRangeListings();

    // eBay uses dynamic/infinite loading, so listen for DOM changes
    const observer = new MutationObserver(() => {
        removePriceRangeListings();
    });

    observer.observe(document.body, {childList: true, subtree: true});

    // Show a message if anything was removed
    function showInfo() {
        if (removed > 0 && !document.getElementById('tm-ebay-pricerange-info')) {
            const infoMsg = document.createElement("div");
            infoMsg.id = 'tm-ebay-pricerange-info';
            infoMsg.textContent = `${removed} price range listings were removed.`;
            infoMsg.style.position = "fixed";
            infoMsg.style.top = "40px";
            infoMsg.style.left = "10px";
            infoMsg.style.zIndex = 9999;
            infoMsg.style.padding = "10px";
            infoMsg.style.backgroundColor = "#ffc";
            infoMsg.style.border = "1px solid #aaa";
            infoMsg.style.fontSize = "16px";
            infoMsg.style.color = "#333";
            document.body.appendChild(infoMsg);
            setTimeout(() => infoMsg.remove(), 6000);
        }
    }

    // Show message after initial run and after DOM changes
    setInterval(showInfo, 1500);

})();