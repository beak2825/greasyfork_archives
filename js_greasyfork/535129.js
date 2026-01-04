// ==UserScript==
// @name         B站沉浸式观影：隐藏接下来播放推荐
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动隐藏B站视频页的“接下来播放”推荐区，打造极致沉浸体验
// @author       hoshiki
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535129/B%E7%AB%99%E6%B2%89%E6%B5%B8%E5%BC%8F%E8%A7%82%E5%BD%B1%EF%BC%9A%E9%9A%90%E8%97%8F%E6%8E%A5%E4%B8%8B%E6%9D%A5%E6%92%AD%E6%94%BE%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/535129/B%E7%AB%99%E6%B2%89%E6%B5%B8%E5%BC%8F%E8%A7%82%E5%BD%B1%EF%BC%9A%E9%9A%90%E8%97%8F%E6%8E%A5%E4%B8%8B%E6%9D%A5%E6%92%AD%E6%94%BE%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创业思维：自动化、极简、专注用户体验
    function hideNextUp() {
        // B站“接下来播放”推荐区的常见选择器
        const selectors = [
            '.bpx-player-ending-panel', // 新版播放器的推荐区
            '.bilibili-player-ending-panel-box', // 旧版播放器的推荐区
            '.bpx-player-recommend', // 右侧推荐
            '.bilibili-player-recommend' // 备用
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = 'none';
            });
        });
    }

    // 观察DOM变化，动态隐藏（应对B站的异步加载）
    const observer = new MutationObserver(hideNextUp);
    observer.observe(document.body, { childList: true, subtree: true });

    // 首次加载时也执行一次
    hideNextUp();
})();
