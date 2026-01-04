// ==UserScript==
// @name         全局移除喷嚏网广告（包括二级页面）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动去除https://www.dapenti.com博客及其二级页面中的所有广告
// @author       wj6019
// @match        https://www.dapenti.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529194/%E5%85%A8%E5%B1%80%E7%A7%BB%E9%99%A4%E5%96%B7%E5%9A%8F%E7%BD%91%E5%B9%BF%E5%91%8A%EF%BC%88%E5%8C%85%E6%8B%AC%E4%BA%8C%E7%BA%A7%E9%A1%B5%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529194/%E5%85%A8%E5%B1%80%E7%A7%BB%E9%99%A4%E5%96%B7%E5%9A%8F%E7%BD%91%E5%B9%BF%E5%91%8A%EF%BC%88%E5%8C%85%E6%8B%AC%E4%BA%8C%E7%BA%A7%E9%A1%B5%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通用广告选择器（根据广告元素的共性设置）
    const adSelectors = [
        'img[src*="googlesyndication.com"]', // Google广告图片
        'img[src*="2mdn.net"]', // 其他广告图片
        'div[class*="ns-"]', // 广告容器
        'iframe[src*="ad"]', // iframe广告
        'a[href*="ad"]', // 广告链接
        'div[class*="ad"]', // 广告容器
        'div[class*="banner"]', // 横幅广告
        'div[class*="sponsor"]' // 赞助广告
    ];

    // 移除广告的函数
    function removeAds() {
        adSelectors.forEach(function(selector) {
            const ads = document.querySelectorAll(selector);
            ads.forEach(function(ad) {
                ad.remove();
                console.log('已移除广告元素:', ad);
            });
        });
    }

    // 初始移除广告
    removeAds();

    // 监听 DOM 变化，动态移除广告
    const observer = new MutationObserver(function(mutations) {
        removeAds();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听页面跳转
    window.addEventListener('load', function() {
        removeAds(); // 页面加载时移除广告
    });

    // 监听链接点击（确保在新页面中也生效）
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'A' && target.href) {
            // 如果是链接，设置延时以确保新页面加载完成
            setTimeout(function() {
                removeAds();
            }, 1000); // 延迟1秒执行
        }
    });

    console.log('广告移除脚本已启动！');
})();