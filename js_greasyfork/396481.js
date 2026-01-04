// ==UserScript==
// @name         ZeroHedge cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zerohedge.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/396481/ZeroHedge%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/396481/ZeroHedge%20cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.layout-sidebar-right').style.visibility = "hidden";
    document.querySelector('.sidebar-left-wrapper').style.visibility = "hidden";
    document.querySelector('.newsletter-insert').style.visibility = "hidden";
})();
