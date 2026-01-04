// ==UserScript==
// @name         vvic.com
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        https://www.vvic.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/368043/vviccom.user.js
// @updateURL https://update.greasyfork.org/scripts/368043/vviccom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle('.search-content .up_time {display: inline;}');
    var addr = $('a > em.guide.vvicon').parent().parent().text().trim();
    addr = addr.substr(0, addr.lastIndexOf('-'));
    $('a > em.guide.vvicon').parent().parent().append('<a href="/gz/shops/search.html?q='+addr+'"><em class="text-top-num">同档</em></a>');
})();