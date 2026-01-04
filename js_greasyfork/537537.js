// ==UserScript==
// @name         CSQAQ广告自动关闭与隐藏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动点击CSQAQ网站的关闭广告按钮并隐藏广告卡片
// @author       You
// @match        https://csqaq.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537537/CSQAQ%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E4%B8%8E%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/537537/CSQAQ%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E4%B8%8E%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 使用setTimeout确保所有元素都已加载
        setTimeout(function() {
            // 功能1: 自动点击关闭广告按钮
            const closeButtons = document.querySelectorAll('[class*="closeBtn"]');

            if (closeButtons.length > 0) {
                const transparentButtons = closeButtons[0].querySelectorAll('[class*="transparentButton"]');

                if (transparentButtons.length > 0) {
                    transparentButtons[0].click();
                    console.log('已自动点击关闭广告按钮');
                }
            }

            // 功能2: 隐藏广告卡片
            const advCards = document.querySelectorAll('[class*="adv_card"]');
            if (advCards.length > 0) {
                advCards.forEach(card => {
                    card.style.display = 'none';
                });
                console.log(`已隐藏 ${advCards.length} 个广告卡片`);
            }
        }, 2000); // 2秒延迟确保元素加载完成
    });

    // 添加MutationObserver监听DOM变化，处理动态加载的广告
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查新添加的节点中是否有广告卡片
            const advCards = document.querySelectorAll('[class*="adv_card"]');
            if (advCards.length > 0) {
                advCards.forEach(card => {
                    if (card.style.display !== 'none') {
                        card.style.display = 'none';
                        console.log('检测到新广告卡片并已隐藏');
                    }
                });
            }
        });
    });

    // 开始观察整个文档及其子节点的变化
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();