// ==UserScript==
// @name         V2ex辅助
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  V2ex辅助，对文章用浏览器新标签页打开。
// @author       rainmint
// @match        *://*.v2ex.com
// @match        *://*.v2ex.com/go/*
// @match        *://*.v2ex.com/?tab=*
// @match        *://*.v2ex.com/recent
// @match        *://*.v2ex.com/member/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/466473/V2ex%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/466473/V2ex%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all post links on the page
    var postLinks = document.querySelectorAll('.item_title a');

    // Loop through each link and add target="_blank" attribute
    for (var i = 0; i < postLinks.length; i++) {
        postLinks[i].setAttribute('target', '_blank');
    }
})();