// ==UserScript==
// @name         GC Collectible Quick Search
// @namespace     https://www.grundos.cafe/
// @version      1.0
// @description  Quickly search for buyables on Books Read, Gourmet Club and Plushies.
// @author       Zarotrox
// @match        https://www.grundos.cafe/books_read/*
// @match        https://www.grundos.cafe/gourmet_club/*
// @match        https://www.grundos.cafe/plushies/*
// @icon         https://grundoscafe.b-cdn.net/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540881/GC%20Collectible%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/540881/GC%20Collectible%20Quick%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const updateLinks = () => {
        document.querySelectorAll('a[href^="/search/items/?item_name="]').forEach(link => {

            const href = link.getAttribute('href');
            const params = new URLSearchParams(href.split('?')[1]);
            const itemName = params.get('item_name');

            if (itemName) {
                const formattedItemName = itemName.replace(/%20/g, '+');
                const newHref = `/market/wizard/?submit=Search&query=${formattedItemName}&area=0&search_method=1&min_price=&max_price=`;

                link.setAttribute('href', newHref);
                link.setAttribute('target', '_blank');
            }

        });
    };

    updateLinks();

    // Observe dynamically added content (for pages loading items after initial load)
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });

})();