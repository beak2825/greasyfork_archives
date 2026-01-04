// ==UserScript==
// @name         BiliBili 防沉迷
// @namespace    http://tampermonkey.net/
// @version      2025-01-10
// @description  主动防沉迷系统, 隐藏相关视频推荐和主页视频推荐, 保留视频搜索
// @author       MarkCup
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523321/BiliBili%20%E9%98%B2%E6%B2%89%E8%BF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/523321/BiliBili%20%E9%98%B2%E6%B2%89%E8%BF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 1; // 检测间隔（毫秒）
    const MAX_ATTEMPTS = 1000; // 最大检测次数
    let remainingAttempts = MAX_ATTEMPTS;

    function detectAndRemove(selector, observerName) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
            clearInterval(observerName);
            console.log(`已删除 ${selector} 元素。`);
        } else {
            if (remainingAttempts <= 0) {
                clearInterval(observerName);
            }
        }
    }

    function clock(){
        remainingAttempts--;
        if (remainingAttempts <= 0) {
            clearInterval(timmer);
            console.log(`检测超时，停止检测。`);
        }
    }

    const observerRecommend = setInterval(() => detectAndRemove('.recommend-list-v1', observerRecommend), CHECK_INTERVAL);
    const observerLive = setInterval(() => detectAndRemove('.pop-live-small-mode.part-1', observerLive), CHECK_INTERVAL);
    const observerEndingRelated = setInterval(() => detectAndRemove('.bpx-player-ending-related', observerEndingRelated), CHECK_INTERVAL);
    const observerFeed = setInterval(() => detectAndRemove('.feed2', observerFeed), CHECK_INTERVAL);
    const timmer = setInterval(clock, CHECK_INTERVAL);
})();