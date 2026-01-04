// ==UserScript==
// @name         修改 Tongyi 页面宽度
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  当页面打开 https://tongyi.aliyun.com/ 时，修改 class="sc-dChVcU ktbQOR" 元素的 width 样式为 1800。
// @author       YourName
// @match        https://tongyi.aliyun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526513/%E4%BF%AE%E6%94%B9%20Tongyi%20%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/526513/%E4%BF%AE%E6%94%B9%20Tongyi%20%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来修改样式
    function modifyWidth() {
        const targetElement = document.querySelector('.sc-dChVcU.ktbQOR');
        if (targetElement) {
            console.log('找到目标元素:', targetElement);
            // 直接修改内联样式
            targetElement.style.width = '1800px';
            console.log('已将 width 修改为 1800px');
        } else {
            console.log('未找到目标元素');
        }
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        modifyWidth();
    });

    // 开始监听整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 页面加载完成后执行一次
    window.addEventListener('load', () => {
        modifyWidth();
    });
})();