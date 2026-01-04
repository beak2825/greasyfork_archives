// ==UserScript==
// @name         B站专注插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bilibili 网页端隐藏卡片广告、评论区、推荐视频、首页推荐、热搜
// @author       Fcpig
// @match        https://www.bilibili.com/*
// @match        https://bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541974/B%E7%AB%99%E4%B8%93%E6%B3%A8%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/541974/B%E7%AB%99%E4%B8%93%E6%B3%A8%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简化选择器，移除动态生成的data-v-*属性
    const selectors = [
        'div#commentapp', // 评论区
        'div.recommend-list-v1', // 推荐列表
        'div.search-panel', // 搜索推荐
        'div.bili-header__channel', //频道
        'div.header-channel', // 频道
        'main.bili-feed4-layout', // 首页推荐
        'div.video-card-ad-small',//视频广告
        'div.ad-floor-cover.b-img',// 底部广告
        'div.slide_ad',//侧广告
        // 需要添加什么元素就在这里添加即可，不会可以把这个代码发给ai帮你修改哈！
    ];

    // 强化隐藏元素的方法
    function hideElements() {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 应用多重隐藏样式确保生效
                element.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    width: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    margin: 0 !important;
                    padding: 0 !important;
                `;
            });
        });
    }

    // 初始执行
    hideElements();


    const observer = new MutationObserver((mutations) => {
        // 只有当有新节点添加时才执行隐藏操作
        if (mutations.some(m => m.addedNodes.length > 0)) {
            hideElements();
        }
    });

    // 开始观察
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 延迟执行，确保覆盖动态加载内容
    setTimeout(hideElements, 800);
    setTimeout(hideElements, 2000);
})();
