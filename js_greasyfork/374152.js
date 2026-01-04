// ==UserScript==
// @name         Happy Tian Boss
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Let Tian Boss Happy.
// @author       lintmx
// @match        http*://www.acfun.cn/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374152/Happy%20Tian%20Boss.user.js
// @updateURL https://update.greasyfork.org/scripts/374152/Happy%20Tian%20Boss.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        window.location.reload();
    }, 7000000)
    // Your code here...
})();