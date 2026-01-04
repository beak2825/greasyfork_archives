// ==UserScript==
// @name         GC Hide Wishlist Add Outside Of Search
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Hides the "Add to Wishlist" helper icon on every page other than search on grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license      MIT
// @match        https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488843/GC%20Hide%20Wishlist%20Add%20Outside%20Of%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/488843/GC%20Hide%20Wishlist%20Add%20Outside%20Of%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const head = document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    head.appendChild(style);

    style.sheet.insertRule(`
    .search-helper-wish-witch-add {
    display: none
    }`, style.sheet.cssRules.length);
})();