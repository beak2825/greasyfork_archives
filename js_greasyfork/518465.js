// ==UserScript==
// @name         隐藏Bilibili搜索栏内的推荐搜索
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  隐藏Bilibili搜索栏内的推荐搜索,自己编着玩的
// @author       Xw
// @match           *://*.bilibili.com/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @exclude         *://message.bilibili.com/pages/nav/header_sync
// @exclude         *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude         *://open-live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518465/%E9%9A%90%E8%97%8FBilibili%E6%90%9C%E7%B4%A2%E6%A0%8F%E5%86%85%E7%9A%84%E6%8E%A8%E8%8D%90%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/518465/%E9%9A%90%E8%97%8FBilibili%E6%90%9C%E7%B4%A2%E6%A0%8F%E5%86%85%E7%9A%84%E6%8E%A8%E8%8D%90%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        if (mainFunc()) {
            clearInterval(interval);
            console.log('执行隐藏Bilibili热搜内的推荐搜索脚本完成');
        }
    }, 500);
})();

function mainFunc() {
    const inputElement = document.querySelector('.nav-search-input');
    if (inputElement) {
        inputElement.placeholder = '搜索';
        return true;
    }
    return false;
}