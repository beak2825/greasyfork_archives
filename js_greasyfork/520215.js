// ==UserScript==
// @name         乐魂_抖音网页直播自动点赞
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  进入直播间后自动开始点赞
// @author       yuehun
// @match        *://live.douyin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520215/%E4%B9%90%E9%AD%82_%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/520215/%E4%B9%90%E9%AD%82_%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function startAutoLike() {
        let target = document.getElementsByClassName('LO5TGkc0');

        if (target && target.length > 0) {
            console.log('开始自动点赞');
            setInterval(() => {
                target[0].click();
            }, 2000);
        } else {
            console.log('未找到点赞按钮，1秒后重试');
            setTimeout(startAutoLike, 1000);
        }
    }

    // 立即开始检查并在找到点赞按钮后启动
    startAutoLike();

    // 页面加载完成后再次尝试
    window.addEventListener('load', startAutoLike);

    // DOMContentLoaded 时也尝试启动
    document.addEventListener('DOMContentLoaded', startAutoLike);

    // 为了确保一定能启动，3秒后再试一次
    setTimeout(startAutoLike, 3000);
})();

