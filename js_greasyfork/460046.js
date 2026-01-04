// ==UserScript==
// @name         移除听书宝的全屏广告
// @namespace    https://djzhao.js.org
// @version      0.2
// @description  移除听书宝的全屏iframe广告
// @author       djzhao
// @match        *.tingshubao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tingshubao.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460046/%E7%A7%BB%E9%99%A4%E5%90%AC%E4%B9%A6%E5%AE%9D%E7%9A%84%E5%85%A8%E5%B1%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/460046/%E7%A7%BB%E9%99%A4%E5%90%AC%E4%B9%A6%E5%AE%9D%E7%9A%84%E5%85%A8%E5%B1%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("iframe").parentElement.remove();
    document.body.style.overflow="auto";
})();