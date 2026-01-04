// ==UserScript==
// @name         有道词典自动跳转到柯林斯
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  有道词典自动跳转到柯林斯捏
// @author       TomIsFat
// @match        http://dict.youdao.com/w/*
// @icon         https://www.google.com/s2/favicons?domain=youdao.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/439300/%E6%9C%89%E9%81%93%E8%AF%8D%E5%85%B8%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%9F%AF%E6%9E%97%E6%96%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/439300/%E6%9C%89%E9%81%93%E8%AF%8D%E5%85%B8%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%9F%AF%E6%9E%97%E6%96%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.nav-collins > a:nth-child(1)').click();
    // Your code here...
})();