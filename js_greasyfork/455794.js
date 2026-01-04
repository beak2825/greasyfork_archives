// ==UserScript==
// @name         Colorful Weibo
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  weibo script
// @author       You
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455794/Colorful%20Weibo.user.js
// @updateURL https://update.greasyfork.org/scripts/455794/Colorful%20Weibo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    document.querySelector("title").nextSibling.remove();
})();