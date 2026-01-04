// ==UserScript==
// @name         固定宽度为1300 - kimi.moonshot.cn
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  将kimi.moonshot.cn页面中特定元素的宽度固定为1300px
// @author       zhongji
// @match        *://kimi.moonshot.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonshot.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520508/%E5%9B%BA%E5%AE%9A%E5%AE%BD%E5%BA%A6%E4%B8%BA1300%20-%20kimimoonshotcn.user.js
// @updateURL https://update.greasyfork.org/scripts/520508/%E5%9B%BA%E5%AE%9A%E5%AE%BD%E5%BA%A6%E4%B8%BA1300%20-%20kimimoonshotcn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll('.css-jdjpte');
        if (elements.length > 0) {
            elements.forEach(element => {
                element.style.maxWidth = '1300px';
            });
            observer.disconnect();
            // 一旦找到元素并修改，停止观察
        }
    });

    // 配置观察的目标和选项
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();