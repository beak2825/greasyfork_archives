// ==UserScript==
// @name         移除B站首页非视频推荐卡片
// @namespace    https://greasyfork.org/zh-CN/scripts/520083-移除b站首页非视频推荐卡片
// @version      1.0
// @description  移除哔哩哔哩首页非视频推荐卡片，包含直播、漫画、课堂、番剧、国创、综艺、电影、电视剧、纪录片、广告
// @author       xinbiaobeta
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/520083/%E7%A7%BB%E9%99%A4B%E7%AB%99%E9%A6%96%E9%A1%B5%E9%9D%9E%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/520083/%E7%A7%BB%E9%99%A4B%E7%AB%99%E9%A6%96%E9%A1%B5%E9%9D%9E%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除 floor-single-card 元素
    function removeFloorSingleCard() {
        const floorCards = document.querySelectorAll('.floor-single-card');
        floorCards.forEach(card => card.remove());
    }

    // 移除带有广告信息的 bili-video-card 元素
    function removeAdVideoCards() {
        const videoCards = document.querySelectorAll('.bili-video-card.is-rcmd');
        videoCards.forEach(card => {
            if (card.querySelector('.bili-video-card__info--ad')) {
                card.remove();
            }
        });
    }

    // 移除带有直播信息的 bili-live-card 元素
    function removeLivingLiveCards() {
        const liveCards = document.querySelectorAll('.bili-live-card.is-rcmd.enable-no-interest');
        liveCards.forEach(card => {
            if (card.querySelector('.bili-live-card__info--living')) {
                card.remove();
            }
        });
    }

    // 移除不包含 bili-video-card 元素的 feed-card
    function removeNonRcmdFeedCards() {
        const feedCards = document.querySelectorAll('.feed-card');
        feedCards.forEach(card => {
            if (!card.querySelector('.bili-video-card.is-rcmd.enable-no-interest')) {
                card.remove();
            }
        });
    }

    // 移除所有不需要的元素
    function removeUnwantedElements() {
        removeFloorSingleCard();
        removeAdVideoCards();
        removeLivingLiveCards();
        removeNonRcmdFeedCards();
    }

    // 使用 MutationObserver 来检测 DOM 动态变化
    const observer = new MutationObserver(() => {
        removeUnwantedElements();
    });

    // 开始监听文档主体的子节点变化
    observer.observe(document.body, {
        childList: true, // 监控添加或删除的子节点
        subtree: true    // 监控整个文档树（不仅仅是 body）
    });

    // 页面加载时进行初次清理
    removeUnwantedElements();
})();