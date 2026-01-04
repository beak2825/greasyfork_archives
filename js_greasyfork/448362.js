// ==UserScript==
// @name         B站/s/页面自动跳转正常页面
// @namespace    https://Alastor.top
// @version      1.0
// @description  网页搜索有时候会进入www.bilibili.com/s/的无评论区页面，通过这个脚本自动进入去掉/s/类型的正常B站页面
// @author       Zander Alastor
// @match        *://www.bilibili.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448362/B%E7%AB%99s%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%AD%A3%E5%B8%B8%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448362/B%E7%AB%99s%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%AD%A3%E5%B8%B8%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.URL;
    url=url.replace(/\/s\//,"/")
    window.location.href=url;
})();