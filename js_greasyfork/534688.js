// ==UserScript==
// @name         18Comic 移动端底部广告移除
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在移动端视图中自动移除18comic.vip网站底部推荐内容广告
// @match        *://*.18comic.vip/*
// @match        *://*.18comic.org/*
// @run-at       document-end
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/534688/18Comic%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BA%95%E9%83%A8%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/534688/18Comic%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BA%95%E9%83%A8%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 广告元素 CSS 选择器：匹配 data-group 属性以 'album_related' 或 'all_bottom' 开头的元素
    const adSelectors = "[data-group^='album_related'], [data-group^='all_bottom']";

    // 定义广告移除函数：查找并删除所有匹配选择器的广告元素
    function removeAds() {
        const ads = document.querySelectorAll(adSelectors);
        ads.forEach(ad => {
            if (ad && ad.parentNode) {
                // 从 DOM 中删除广告元素，避免留下空白占位
                ad.parentNode.removeChild(ad);
            }
        });
    }

    // 页面初始加载完成后先执行一次广告清理
    removeAds();

    // 使用 MutationObserver 监听动态插入的节点
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            // 遍历所有新增节点
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                // 如果新增节点本身匹配广告选择器，则直接删除
                if (node.matches && node.matches(adSelectors)) {
                    node.remove();
                } else {
                    // 否则在节点内部查找并删除所有匹配的广告子节点
                    const innerAds = node.querySelectorAll(adSelectors);
                    innerAds.forEach(innerAd => innerAd.remove());
                }
            });
        }
    });

    // 开始观察文档主体，监听其子元素和后代元素的插入
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
