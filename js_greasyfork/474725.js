// ==UserScript==
// @name         隐藏B站搜索框热搜
// @namespace    https://greasyfork.org/zh-CN/scripts/474725
// @version      0.3
// @description  隐藏B站搜索框内的热搜
// @author       beibeibeibei
// @license      MIT
// @match        *search.bilibili.com/*
// @match        *.bilibili.com/
// @match        *.bilibili.com/?spm_id_from=*
// @match        https://www.bilibili.com/anime/*
// @match        *.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474725/%E9%9A%90%E8%97%8FB%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/474725/%E9%9A%90%E8%97%8FB%E7%AB%99%E6%90%9C%E7%B4%A2%E6%A1%86%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    requestIdleCallback(function (deadline) {
        let style = document.createElement('style');
        style.id = "hideTrending";
        style.innerHTML =".trending { display: none;}"
        document.head.appendChild(style);
    })
    // Your code here...
})();
