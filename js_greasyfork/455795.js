// ==UserScript==
// @name         Colorful Zhihu
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  simple Zhihu script
// @author       You
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455795/Colorful%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/455795/Colorful%20Zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("style").remove();
    document.querySelector(".App-main > style").remove();
})();