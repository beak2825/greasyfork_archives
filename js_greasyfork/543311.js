// ==UserScript==
// @name         Fuck Swagger
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  移除 Swagger 页面中 API 路径的超链接,阻止path中的点击事件，使接口地址可以被更容易地选中
// @author       zheng-kun@foxmail.com
// @match        *://*/swagger*
// @match        *://*/swagger-ui*
// @match        *://*/*swagger*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543311/Fuck%20Swagger.user.js
// @updateURL https://update.greasyfork.org/scripts/543311/Fuck%20Swagger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function removeApiLinks() {
        // 查找所有包含 API 路径链接的元素
        const pathElements = document.querySelectorAll('.opblock-summary-path a.nostyle');

        pathElements.forEach(linkElement => {
            // 获取链接的文本内容
            const pathText = linkElement.textContent;

            // 创建新的 span 元素
            const newSpan = document.createElement('span');
            newSpan.textContent = pathText;

            // 替换原来的 a 标签
            linkElement.parentNode.replaceChild(newSpan, linkElement);
        });

        console.log(`已移除 ${pathElements.length} 个 API 路径链接`);
    }

    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .opblock-summary-path {
                cursor: text !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 全局阻止所有 .opblock-summary-path a.nostyle 的点击事件
    function preventLinkClicks() {
        document.addEventListener('click', function(e) {
            const target = e.target;
            if (target.matches('.opblock-summary-path') ||
                target.closest('.opblock-summary-path')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {removeApiLinks(); preventLinkClicks();addGlobalStyles()});
    } else {
        removeApiLinks();
        preventLinkClicks();
        addGlobalStyles();
    }

    // 监听动态内容变化（适用于 SPA 应用）
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查是否有新的 API 路径元素被添加
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        const hasApiPaths = node.querySelector && node.querySelector('.opblock-summary-path a.nostyle');
                        if (hasApiPaths) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });

        if (shouldProcess) {
            // 延迟一点执行，确保DOM完全渲染
            setTimeout(removeApiLinks, 100);
        }
    });

    // 开始监听DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();