// ==UserScript==
// @name         移除简书文章推荐
// @namespace    lesterxiao
// @version      1.0
// @description  JianShu remove recommend article
// @author       lesterxiao
// @license      MIT
// @match        https://www.jianshu.com/p/*
// @icon         https://www.jianshu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464788/%E7%A7%BB%E9%99%A4%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/464788/%E7%A7%BB%E9%99%A4%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        document.getElementsByClassName("ouvJEz")[1].remove();
        console.log("文章推荐列表已删除");
    }, 1000);
})();