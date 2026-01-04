// ==UserScript==
// @name         百度黑白
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      *://*.baidu.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387182/%E7%99%BE%E5%BA%A6%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/387182/%E7%99%BE%E5%BA%A6%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var body = document.getElementsByTagName("html")[0]
    body.style.filter = "grayscale(100%)";
})();