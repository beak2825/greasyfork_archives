// ==UserScript==
// @name         抖音快捷键G屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  专门屏蔽抖音网页版的G键快捷关注功能
// @author       Your name
// @match        *://*.douyin.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524789/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%8D%B7%E9%94%AEG%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524789/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%8D%B7%E9%94%AEG%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个函数来重写 addEventListener
    function interceptEventListener() {
        // 保存原始的 addEventListener
        const originalAddEventListener = EventTarget.prototype.addEventListener;

        // 重写 addEventListener
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type.toLowerCase().includes('keydown') || type.toLowerCase().includes('keypress')) {
                // 包装监听器
                const wrappedListener = function(event) {
                    // 只处理 G 键的事件
                    if (event.key.toLowerCase() === 'g') {
                        // 检查事件源是否来自抖音的脚本
                        const stack = new Error().stack;
                        // 如果事件处理程序来自抖音域名的脚本，则阻止事件
                        if (stack.includes('douyin.com/')) {
                            event.stopImmediatePropagation();
                            return;
                        }
                    }
                    // 对于其他按键或非抖音源的事件，正常执行
                    return listener.apply(this, arguments);
                };

                // 调用原始方法，但使用包装后的监听器
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            // 对于非键盘事件，使用原始的监听器
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // 注入拦截代码
    const script = document.createElement('script');
    script.textContent = `(${interceptEventListener.toString()})();`;
    document.documentElement.appendChild(script);
    script.remove();

    // 监视 DOM 变化，处理动态添加的事件监听器
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        // 对新添加的脚本也应用相同的拦截逻辑
                        const script = document.createElement('script');
                        script.textContent = `(${interceptEventListener.toString()})();`;
                        document.documentElement.appendChild(script);
                        script.remove();
                    }
                });
            }
        }
    });

    // 开始观察 DOM 变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})(); 