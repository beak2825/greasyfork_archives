// ==UserScript==
// @name         Remove Sponsored Listings on Amazon
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes sponsored product listings from Amazon search results.
// @author       deeone
// @match        https://www.amazon.*/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536756/Remove%20Sponsored%20Listings%20on%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/536756/Remove%20Sponsored%20Listings%20on%20Amazon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSponsoredListings() {
        const items = document.querySelectorAll('[data-component-type="s-search-result"]');
        items.forEach(item => {
            // well it works i guess
            if (item.innerText.includes('Sponsored')) {
                item.remove();
            }
        });
    }

    // run on page load / search
    removeSponsoredListings();

    // make sure items added dynamically are checked aswell
    const observer = new MutationObserver(() => {
        removeSponsoredListings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
