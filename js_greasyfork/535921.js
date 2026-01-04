// ==UserScript==
// @name         Itaku -- Pagination
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2025-05-13
// @description  Paginate itaku.
// @author       twi
// @match        https://itaku.ee/*
// @icon         https://itaku.ee/assets/favicon-yellow.svg
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535921/Itaku%20--%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/535921/Itaku%20--%20Pagination.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Because itaku doesn't do a true document reload on switching between pages (the "app" within the document mutates its own contents), we use an observer
    // probably a bit of over-coding to disconnect the observer, but it's more ~correct~ and works just the same because the app itself is never swapped out.
    const o = new MutationObserver(function(mutList) {
        // This is the minimum i can disable in hopes to not break anything
        document.querySelector('.mat-sidenav-content').__zone_symbol__scrollfalse[0].callback = () => {};
        disconnect();
    });
    const disconnect = () => { o.disconnect(); } // what's customary in js here anyway? is omitting the curly braces a sin or is using them? without feels less readable.
    const c = { subtree:true, characterData:true };
    o.observe(document, c);
})();