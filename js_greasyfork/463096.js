// ==UserScript==
// @name         自动关闭B站横幅提示
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动关闭B站网页顶端的横幅提示，提供更好的用户体验。
// @author       lichungang
// @match        https://www.bilibili.com/*
// @match        https://www.autodl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463096/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADB%E7%AB%99%E6%A8%AA%E5%B9%85%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463096/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%ADB%E7%AB%99%E6%A8%AA%E5%B9%85%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取横幅元素
    let banner = document.querySelector('.adblock-tips');
    if (banner) {
        // 隐藏横幅元素
        banner.style.display = 'none';
    }

    const targetElement = document.querySelector('div.gpuhub-tip.user-console[data-v-1e9806a3]');
    if (targetElement) {
        // 隐藏横幅元素
        targetElement.style.display = 'none';
    }
    // 创建一个 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        // 使用 querySelector 查找具有 class="gpuhub-tip login-center" 和 data-v-1e9806a3 属性的 div
        const targetElement1 = document.querySelector('div.gpuhub-tip.login-center[data-v-1e9806a3]');

        // 如果找到了该元素，隐藏它
        if (targetElement1) {
            targetElement1.style.display = 'none';
            // 停止观察
            observer.disconnect();
        }
    });

    // 开始观察整个 body 内容变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 在页面加载完成后再次尝试找到该元素并隐藏
    window.addEventListener('load', function() {
        const targetElement1 = document.querySelector('div.gpuhub-tip.login-center[data-v-1e9806a3]');
        if (targetElement1) {
            targetElement1.style.display = 'none';
        }
    });
})();
