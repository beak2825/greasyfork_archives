// ==UserScript==
// @name         PlayStation Network (PSN) wishlist discount emphasizer
// @namespace    http://tampermonkey.net/
// @version      2025-05-28-2
// @description  When viewing your PSN wishlist, hides anything that's not currently on-sale/discounted.
// @author       Josh1billion
// @match        https://library.playstation.com/wishlist
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playstation.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537564/PlayStation%20Network%20%28PSN%29%20wishlist%20discount%20emphasizer.user.js
// @updateURL https://update.greasyfork.org/scripts/537564/PlayStation%20Network%20%28PSN%29%20wishlist%20discount%20emphasizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function cleanWishlistItems() {
        const items = document.querySelectorAll('.wishlist-list__item');
        items.forEach(item => {
            if (!item.querySelector('s')) {
                item.remove();
            }
        });
    }

    // run once on page load
    window.addEventListener('load', cleanWishlistItems);

    // also run after mutations (e.g., AJAX updates)
    const observer = new MutationObserver(() => {
        cleanWishlistItems();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // set a few timeouts so that it runs again a few times, because the pageload etc is not consistent enough. a little hacky but whatever.
    for (var i = 1; i <= 20; i++) {
        setTimeout(cleanWishlistItems, 500 * i);
    }
})();