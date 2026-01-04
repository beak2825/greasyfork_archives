// ==UserScript==
// @name        隐藏必应APP弹窗
// @version      1.3
// @description  隐藏必应APP弹窗。
// @author       ChatGPT
// @match        *://*.bing.com/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/504200/%E9%9A%90%E8%97%8F%E5%BF%85%E5%BA%94APP%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/504200/%E9%9A%90%E8%97%8F%E5%BF%85%E5%BA%94APP%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏主APP推广容器
    let style = document.createElement('style');
    style.innerHTML = 'div#bnp_container {display: none !important;}';
    document.head.appendChild(style);

    // 创建观察器来检测并点击关闭按钮
    const observer = new MutationObserver(() => {
        // 查找关闭按钮
        const closeButton = document.querySelector('div#sacs_close');
        
        if (closeButton) {
            // 点击关闭按钮
            closeButton.click();
            
            // 点击一次后立即停止观察
            observer.disconnect();
        }
    });

    // 配置观察选项
    const observerConfig = {
        childList: true,
        subtree: true
    };

    // 启动观察器
    observer.observe(document.body, observerConfig);

    // 页面加载完成后立即检查一次
    window.addEventListener('load', () => {
        const closeButton = document.querySelector('div#sacs_close');
        if (closeButton) {
            closeButton.click();
            observer.disconnect();
        }
    });
})();