// ==UserScript==
// @name         清除黑白滤镜
// @namespace    https://greasyfork.org/zh-CN/users/990670-startracex
// @version      0.1
// @description  将清除一些元素的黑白滤镜
// @author       startracex
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455778/%E6%B8%85%E9%99%A4%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455778/%E6%B8%85%E9%99%A4%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = [document.getElementsByTagName("html")[0],document.getElementsByTagName("body")[0]
    /* ... */
    ];
    a.forEach (function (e) {
        e.setAttribute("style", "filter:grayscale(0);filter: url();-moz-filter:grayscale(0);-ms-filter:grayscale(0);-o-filter:grayscale(0);");
    });
})();