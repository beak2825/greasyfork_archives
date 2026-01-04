// ==UserScript==
// @name         b站视频页面去除推荐视频
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏b站具体视频的个性化推荐（降低b站对用户的粘性 集中你的注意力）
// @author       肥肠想修习🌴
// @match        https://www.bilibili.com/video/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://bilibili.com&size=48
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509136/b%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%E9%9D%A2%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/509136/b%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%E9%9D%A2%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察器，用于监听页面上的 DOM 变化
    const observer = new MutationObserver((mutationsList, observer) => {
        // 检查是否有个性化推荐视频部分加载完毕
        const recoList = document.getElementById("reco_list");
        if (recoList) {
            recoList.style.display = "none";
        }

        // 检查是否有推荐直播部分加载完毕
        const liveRecommendation = document.querySelector(".pop-live-small-mode.part-1");
        if (liveRecommendation) {
            liveRecommendation.style.display = "none";
        }

        // 如果两个元素都已找到并处理完毕，可以停止观察器
        if (recoList && liveRecommendation) {
            observer.disconnect();
        }
    });

    // 配置 MutationObserver 来监听页面的子节点变化
    const config = {
        childList: true,   // 监听直接子节点的添加或删除
        subtree: true      // 监听整个子树的变化
    };

    // 开始观察整个 body 元素，监听 DOM 的变化
    observer.observe(document.body, config);

})();