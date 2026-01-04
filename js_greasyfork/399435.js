// ==UserScript==
// @name         Gray Filter Cleaner
// @namespace    https://github.com/ipcjs/
// @version      0.0.1
// @description  Clear gray filter on all web pages
// @author       ipcjs
// @include      *://*/*
// @exclude      https://*.google.com/*
// @exclude      https://twitter.com/*
// @exclude      https://*.facebook.com/*
// @exclude      https://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/399435/Gray%20Filter%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/399435/Gray%20Filter%20Cleaner.meta.js
// ==/UserScript==

GM_addStyle(`
* {
    filter: none!important;
}
`)