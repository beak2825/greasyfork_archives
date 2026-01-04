// ==UserScript==
// @name         修改 bilibili 选集列表高度（video-pod__body）
// @namespace    https://github.com/Ahaochan/Tampermonkey
// @version      0.1
// @description  修改 bilibili 视频页面中选集列表的高度，使用 class "video-pod__body"
// @author       star_abyss
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526446/%E4%BF%AE%E6%94%B9%20bilibili%20%E9%80%89%E9%9B%86%E5%88%97%E8%A1%A8%E9%AB%98%E5%BA%A6%EF%BC%88video-pod__body%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526446/%E4%BF%AE%E6%94%B9%20bilibili%20%E9%80%89%E9%9B%86%E5%88%97%E8%A1%A8%E9%AB%98%E5%BA%A6%EF%BC%88video-pod__body%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义修改高度的函数
    function modifyEpisodeHeight() {
        var episodeList = document.querySelector('.video-pod__body');
        if (episodeList) {
            // 将 max-height 强制设置为 620px（可根据需要修改数值）
            episodeList.style.setProperty('max-height', '620px', 'important');
            console.log('bilibili 选集列表最大高度已强制修改为 620px');
            return true;
        }
        return false;
    }

    // 处理页面异步加载：使用 MutationObserver 监控 DOM 变化
    var observer = new MutationObserver(function(mutations, obs) {
        if (modifyEpisodeHeight()) {
            obs.disconnect(); // 找到目标元素后停止观察
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 页面初次加载时也执行一次修改操作
    window.addEventListener('load', modifyEpisodeHeight);
})();
