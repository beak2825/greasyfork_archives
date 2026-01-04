// ==UserScript==
// @name         Remove Promo Div
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the promo div from the page
// @match        https://vanced-youtube.neocities.org/2015/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/469610/Remove%20Promo%20Div.user.js
// @updateURL https://update.greasyfork.org/scripts/469610/Remove%20Promo%20Div.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var promoDiv = document.querySelector('div.pmoabs');
    if (promoDiv) {
        promoDiv.remove();
    }
})();