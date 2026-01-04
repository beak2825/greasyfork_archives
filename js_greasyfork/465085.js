// ==UserScript==
// @name        Etsy - Sponsored Products remover
// @namespace   https://greasyfork.org/en/users/2755-robotoilinc
// @author      RobotOilInc
// @version     0.7.3
// @license     MIT
// @description Removes the terrible sponsored products/banners/suggested searches/etc from Etsy.
// @match       http*://www.etsy.com/search?*
// @match       http*://etsy.com/search?*
// @match       http*://www.etsy.com/c/*
// @match       http*://etsy.com/c/*
// @match       http*://www.etsy.com/*/market/*
// @match       http*://etsy.com/*/market/*
// @icon        https://i.imgur.com/YYVvnud.png
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/465085/Etsy%20-%20Sponsored%20Products%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/465085/Etsy%20-%20Sponsored%20Products%20remover.meta.js
// ==/UserScript==

new MutationObserver(function(mutationList, observer) {
    // Removed most loved
    document.querySelectorAll('[data-top-rated-narrowing-intent-search]').forEach(function(element) {
        console.log('Removed most loved', element);
        element.remove();
    });

    // Removed Etsys picks
    document.querySelectorAll('[data-etsys-pick-narrowing-intent-search]').forEach(function(element) {
        console.log(`Removed Etsy's Picks`, element);
        element.remove();
    });

    // Removed related searches
    document.querySelectorAll('[data-search-query-ingresses]').forEach(function(element) {
        console.log('Removed related searches', element);
        element.remove();
    });

    // Removed "Ad by Etsy seller" search results
    document.querySelectorAll('[data-logger-id]').forEach(function(element) {
        const parent = element.closest('li.wt-list-unstyled');
        if(!parent) {
            return;
        }

        console.log('Removed Ad by Etsy seller', parent);
        parent.remove();
    });

    // Removed ads in Market
    document.querySelectorAll('h2[id^="ad-listing-title"]').forEach(function(element) {
        const parent = element.closest('li.wt-list-unstyled');
        if(!parent) {
            return;
        }

        console.log('Removed Ad in Market', parent);
        parent.remove();
    });
}).observe(document.body, { childList: true, subtree: true });