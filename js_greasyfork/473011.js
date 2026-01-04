// ==UserScript==
// @name         Remove Sponsored Kijiji Listings
// @namespace    https://greasyfork.org/users/710133
// @author       tomcatadam
// @version      0.1
// @description  Removes elements with the kijiji sponsored badge.
// @match        https://*.kijiji.ca/*
// @match        http://*.kijiji.ca/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473011/Remove%20Sponsored%20Kijiji%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/473011/Remove%20Sponsored%20Kijiji%20Listings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSponsoredListings() {
        const listItemSelector = 'li[data-testid*="listing-card-list-item"]';
        const sponsoredBadgeSelector = '[data-testid="listing-sponsored-badge"]';

        const listItems = document.querySelectorAll(listItemSelector);

        listItems.forEach(listItem => {
            if (listItem.querySelector(sponsoredBadgeSelector)) {
                listItem.remove();
            }
        });
    }

    // Something breaks when we execute right away, so I added a sleep here and it seems reliable.
    // There's probably a proper way to wait for whatever nextjs hooks to finish, but it'll take some debugging, so we'll do that later.
    window.addEventListener('load', setTimeout(removeSponsoredListings, 4000), false);
})();
