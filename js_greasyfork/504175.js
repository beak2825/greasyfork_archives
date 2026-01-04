// ==UserScript==
// @name         Remove "Donate", "Steam" on lztmarket
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @description  VSEMPRIVETKOGONEVIDEL
// @author       x5839
// @match        https://lzt.market/*
// @match        https://lzt.market
// @match        https://lolz.market
// @match        https://lolz.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504175/Remove%20%22Donate%22%2C%20%22Steam%22%20on%20lztmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/504175/Remove%20%22Donate%22%2C%20%22Steam%22%20on%20lztmarket.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".header_market_info_group { display: none !important }")
})();