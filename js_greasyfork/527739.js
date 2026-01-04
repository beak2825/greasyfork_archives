// ==UserScript==
// @name         豆瓣影评自动展开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  自动点击展开豆瓣影评全文
// @author       NoWorld
// @match        *://movie.douban.com/*
// @grant        none
// @icon         https://img3.doubanio.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/527739/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%AF%84%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/527739/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%AF%84%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 更精准的点击实现
    function clickUnfoldElements() {
        // 使用组合选择器定位展开按钮
        const selector = 'a.unfold[title="展开"]';
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            // 添加安全点击条件
            if (element && element.offsetParent !== null) {
                console.log('找到展开按钮，正在点击...');
                element.click();
                // 点击后移除按钮避免重复点击
                element.style.display = 'none';
            }
        });
    }

    // 优化后的观察器配置
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                clickUnfoldElements();
            }
        });
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 初始执行
    setTimeout(clickUnfoldElements, 2000);
})();