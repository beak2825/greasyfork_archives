// ==UserScript==
// @name         eBay 'My eBay' Hover Button Fix
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Prevents the "My eBay" link from navigating when clicked, removes hover delay, moves the menu closer, and adds a disappearing delay.
// @author       Matija Erceg
// @license      MIT
// @match        https://www.ebay.ca/*
// @match        https://www.ebay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518272/eBay%20%27My%20eBay%27%20Hover%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/518272/eBay%20%27My%20eBay%27%20Hover%20Button%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disable the click functionality for "My eBay"
    const observer = new MutationObserver(() => {
        const myEbayLink = document.querySelector('#gh-eb-My a.gh-eb-li-a');
        if (myEbayLink) {
            myEbayLink.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            // Stop observing once the link is handled
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Inject CSS to remove hover delay, move menu closer, and add disappearing delay
    const style = document.createElement('style');
    style.textContent = `
        #gh-eb-My .gh-submenu {
            margin-top: -5px !important; /* Move the menu closer to eliminate the gap */
            transition-delay: 0.2s !important; /* Add a disappearing delay */
        }
        #gh-eb-My:hover .gh-submenu {
            transition-delay: 0s !important; /* No delay on hover */
            display: block !important;
        }
    `;
    document.head.appendChild(style);
})();
