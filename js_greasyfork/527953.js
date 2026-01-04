// ==UserScript==
// @name         移除JobUI弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除JobUI网站上的#ui-v2-pop弹窗元素
// @author       YourName
// @match        https://www.jobui.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527953/%E7%A7%BB%E9%99%A4JobUI%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/527953/%E7%A7%BB%E9%99%A4JobUI%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建观察者监听DOM变化
    const observer = new MutationObserver(mutations => {
        // 查找目标元素
        const popup = document.getElementById('ui-v2-pop');
        if (popup) {
            // 找到元素后立即移除
            popup.remove();
            // 停止观察以优化性能
            observer.disconnect();
            console.log('弹窗元素已成功移除');
        }
    });

    // 开始观察整个文档的DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 额外立即执行一次检查（针对已存在的元素）
    const existingPopup = document.getElementById('ui-v2-pop');
    if (existingPopup) {
        existingPopup.remove();
        observer. Disconnect();
    }
})();