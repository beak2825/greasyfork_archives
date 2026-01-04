// ==UserScript==
// @name        Bol.com - Sponsored Products remover
// @namespace   https://greasyfork.org/en/users/2755-robotoilinc
// @author      RobotOilInc
// @version     0.1.0
// @license     MIT
// @description Removes the terrible sponsored products from Bol.com.
// @include     http*://bol.com/*
// @include     http*://www.bol.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=bol.com
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/492604/Bolcom%20-%20Sponsored%20Products%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/492604/Bolcom%20-%20Sponsored%20Products%20remover.meta.js
// ==/UserScript==

new MutationObserver(function(mutationList, observer) {
    // Remove search result Ad banner
    document.querySelectorAll('[data-group-name="ad-banner"]').forEach(function(element) {
        element.remove();
    });

    // Remove sponsored results
    document.querySelectorAll('wsp-dsa-modal-application').forEach(function(element) {
        const parent = element.closest('[data-id]');
        if(parent) parent.remove();
    });

    // "Verder kijken" suggestions
    document.querySelectorAll('.px_common_objectrecommendation_view').forEach(function(element) {
        element.remove();
    });

    // "Bekijk ook eens" results (they are all sponsored)
    document.querySelectorAll('[data-group-name="sponsored-products"]').forEach(function(element) {
        element.remove();
    });
}).observe(document.body, { childList: true, subtree: true });
