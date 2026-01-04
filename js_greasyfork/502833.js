// ==UserScript==
// @name         刷客
// @namespace    http://tampermonkey.net/
// @version      2024-08-08
// @description  Hello World!
// @author       You
// @match        https://www.gxela.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gxela.gov.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502833/%E5%88%B7%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/502833/%E5%88%B7%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var o = localStorage.getItem;
    localStorage.getItem = function(s) {
        return s === 'videoPlay' ? false : o.call(localStorage, s);
    }
    // Your code here...
})();