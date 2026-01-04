// ==UserScript==
// @name         Disable Mazii romaji
// @namespace    http://mazii.net/
// @version      2024-03-08
// @description  關掉 Mazii 的羅馬拼音
// @author       LFsWang
// @match        https://mazii.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mazii.net
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/489298/Disable%20Mazii%20romaji.user.js
// @updateURL https://update.greasyfork.org/scripts/489298/Disable%20Mazii%20romaji.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.txt-romaji { display: none !important; }');
})();