// ==UserScript==
// @name         百度去广告（iOS 版 Safari）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  让百度搜索页面更简洁，去除广告
// @author       ChatGPT
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526210/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88iOS%20%E7%89%88%20Safari%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526210/%E7%99%BE%E5%BA%A6%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88iOS%20%E7%89%88%20Safari%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义去广告函数
    function removeAds() {
        const adSelectors = [
            'div#content_left > div:not([id])',  // 竞价广告
            'div[id^="ad_"]',  // 可能的广告 ID
            'div[class*="ad"]', // class 包含 "ad" 关键字
            'div[class*="hint"]', // 可能的广告推荐
            'div[tpl="recommend_list"]', // 推荐广告
            'div[data-click*="ads"]', // 可能的广告点击数据
            'div.c-container:has(a[href*="tuiguang"])', // 推广链接
            'div#s_top_wrap' // 顶部导航栏
        ];

        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // 让搜索结果更紧凑
        const content = document.querySelector('#content_left');
        if (content) {
            content.style.width = 'auto';
            content.style.maxWidth = '800px';
            content.style.margin = '0 auto';
        }
    }

    // 初次加载时执行
    removeAds();

    // 监听 DOM 变化（百度搜索是单页应用）
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });

})();