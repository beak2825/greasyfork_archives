// ==UserScript==
// @name         屏蔽bugly的手机号绑定验证
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽 class 为 ant-modal-root 的 div 元素（含动态加载），优化性能和错误处理及加载时机
// @author       You
// @match        https://bugly.qq.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533495/%E5%B1%8F%E8%94%BDbugly%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%BB%91%E5%AE%9A%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/533495/%E5%B1%8F%E8%94%BDbugly%E7%9A%84%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%BB%91%E5%AE%9A%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElementsByClass(className) {
        try {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(elem => {
                elem.style.display = 'none';
            });
        } catch (error) {
            console.error(`隐藏元素时出错: ${error.message}`);
        }
    }

    function handleDOMChanges(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ant-modal-root')) {
                    node.style.display = 'none';
                }
            });
        });
    }

    function init() {
        // 页面加载完成后立即隐藏已存在的元素
        hideElementsByClass('ant-modal-root');

        // 创建 MutationObserver 实例
        const observer = new MutationObserver(handleDOMChanges);

        // 开始观察 document.body 的变化
        try {
            observer.observe(document.body, {
                subtree: true,
                childList: true
            });
        } catch (error) {
            console.error(`启动 MutationObserver 时出错: ${error.message}`);
        }
    }

    // 等待页面加载完成后执行初始化操作
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();    