// ==UserScript==
// @name         Anti-SplitPage Tribun
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Mengubah mode split page pada situs Tribunnews menjadi all page
// @author       Mr Riuz
// @match        *://*.tribunnews.com/*
// @match        *://*.grid.id/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370506/Anti-SplitPage%20Tribun.user.js
// @updateURL https://update.greasyfork.org/scripts/370506/Anti-SplitPage%20Tribun.meta.js
// ==/UserScript==

if (window.location.href.toString().indexOf("?page=all") != -1) return false;
var oldUrlPath= window.location.pathname;
    if ( ! /\?page=all$/.test (oldUrlPath) ) {
    var newURL= oldUrlPath + "?page=all";
        window.location.replace (newURL);
}