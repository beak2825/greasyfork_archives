// ==UserScript==
// @name         净化bilibili搜索栏，去除搜索推荐
// @namespace    yuik
// @version      1.0.0
// @description  净化bilibili搜索栏，去除搜索推荐，bili-placeholder
// @author       Yui
// @match        *://*.bilibili.com/*
// @exclude      *://search.bilibili.com/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512542/%E5%87%80%E5%8C%96bilibili%E6%90%9C%E7%B4%A2%E6%A0%8F%EF%BC%8C%E5%8E%BB%E9%99%A4%E6%90%9C%E7%B4%A2%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/512542/%E5%87%80%E5%8C%96bilibili%E6%90%9C%E7%B4%A2%E6%A0%8F%EF%BC%8C%E5%8E%BB%E9%99%A4%E6%90%9C%E7%B4%A2%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时轮询，检查并修改 placeholder
    var interval = setInterval(function() {
        var searchInput = document.querySelector("#nav-searchform > div.nav-search-content > input");
        if (searchInput && searchInput.placeholder !== '滚去学习') {
            searchInput.placeholder = '滚去学习';
            console.log("Placeholder modified");
        }
    }, 100);  // 每隔500ms检查一次

    // 停止轮询条件：找到并修改成功后停止
    var stopInterval = setInterval(function() {
        var searchInput = document.querySelector("#nav-searchform > div.nav-search-content > input");
        if (searchInput && searchInput.placeholder === '滚去学习') {
            clearInterval(interval);  // 停止轮询
            clearInterval(stopInterval);  // 停止停止条件轮询
            console.log("Polling stopped");
        }
    }, 1000);
})();
