// ==UserScript==
// @name         微博还原灰色滤镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  还原微博灰色滤镜
// @author       SamWise
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/455731/%E5%BE%AE%E5%8D%9A%E8%BF%98%E5%8E%9F%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455731/%E5%BE%AE%E5%8D%9A%E8%BF%98%E5%8E%9F%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styles = `.grayTheme {filter: none!important;}`;

    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

})();