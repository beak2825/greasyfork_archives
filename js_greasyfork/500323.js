// ==UserScript==
// @name         Remove "Top Sellers" Lzt Market
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Удаляет "Лучшие продавцы" с нашего любимого лолз маркетосика
// @author       x5839, Toil очень помог спасипо ему
// @match        https://lzt.market/*
// @match        https://lzt.market
// @match        https://lolz.market
// @match        https://lolz.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500323/Remove%20%22Top%20Sellers%22%20Lzt%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/500323/Remove%20%22Top%20Sellers%22%20Lzt%20Market.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("#MarketTopSellers { display: none !important }")
})();