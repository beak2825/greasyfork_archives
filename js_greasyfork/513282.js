// ==UserScript==
// @name         Disable setInterval Globally
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  禁止所有网站执行 setInterval 函数
// @author       Your Name
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513282/Disable%20setInterval%20Globally.user.js
// @updateURL https://update.greasyfork.org/scripts/513282/Disable%20setInterval%20Globally.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个脚本元素，将重写代码注入到页面上下文中
    const script = document.createElement('script');
    script.textContent = `
        (function() {
            // 检查是否已经重写过 setInterval，避免重复
            if (window.setInterval.originalSetInterval) {
                return;
            }

            // 保存原始的 setInterval 方法
            window.setInterval.originalSetInterval = window.setInterval;

            // 重写 setInterval 方法
            window.setInterval = function(callback, delay, ...args) {
                console.warn('setInterval 被禁止执行。');
                // 可以选择抛出错误，阻止执行
                // throw new Error('setInterval 被禁止执行。');

                // 或者简单地返回一个无效的 ID
                return null;
            };

            // 可选：冻结 setInterval 方法，防止再次被修改
            Object.defineProperty(window, 'setInterval', {
                writable: false,
                configurable: false
            });

            console.log('window.setInterval 方法已被重写以禁止其执行。');
        })();
    `;

    // 将脚本元素添加到文档中
    document.documentElement.appendChild(script);

    // 移除脚本元素以避免污染 DOM
    script.parentNode.removeChild(script);
})();
