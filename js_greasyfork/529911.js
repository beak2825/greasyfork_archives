// ==UserScript==
// @name         紳士漫畫（绅士漫画）广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽紳士（绅士漫画）漫畫网站上的广告
// @author       Crazyuncle
// @match        https://www.wn02.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529911/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%EF%BC%88%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%EF%BC%89%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529911/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%EF%BC%88%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%EF%BC%89%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 移除所有包含 src="/ds3" 的广告元素
     */
    function removeAds() {
        // 查找所有img元素
        const images = document.querySelectorAll('img[src^="/ds3"]');

        // 遍历并移除包含广告的父div元素
        images.forEach(img => {
            const adDiv = img.closest('div');
            if (adDiv) {
                adDiv.remove();
            }
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeAds);

    // 创建一个观察器来处理动态加载的内容
    const observer = new MutationObserver(removeAds);

    // 配置观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();