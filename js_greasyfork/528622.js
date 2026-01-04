// ==UserScript==
// @name         去圆角 - 让所有网站元素变直角 #网页外观
// @namespace    https://example.com
// @version      2.1
// @description  让所有网站的输入框、按钮、容器等元素变成直角，去掉所有 border-radius
// @author       宗品建
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528622/%E5%8E%BB%E5%9C%86%E8%A7%92%20-%20%E8%AE%A9%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E5%85%83%E7%B4%A0%E5%8F%98%E7%9B%B4%E8%A7%92%20%E7%BD%91%E9%A1%B5%E5%A4%96%E8%A7%82.user.js
// @updateURL https://update.greasyfork.org/scripts/528622/%E5%8E%BB%E5%9C%86%E8%A7%92%20-%20%E8%AE%A9%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E5%85%83%E7%B4%A0%E5%8F%98%E7%9B%B4%E8%A7%92%20%E7%BD%91%E9%A1%B5%E5%A4%96%E8%A7%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 强制覆盖所有可能的 UI 元素
    GM_addStyle(`
        *, *::before, *::after {
            border-radius: 0px !important;
        }
    `);

    // 监听 DOM 变化，确保动态加载的元素也被处理
    const observer = new MutationObserver(() => {
        document.querySelectorAll('*').forEach(el => {
            if (el.style.borderRadius) {
                el.style.borderRadius = '0px';
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 处理 Shadow DOM
    function processShadowRoots(node) {
        if (node.shadowRoot) {
            GM_addStyle(`
                :host, * {
                    border-radius: 0px !important;
                }
            `);
            node.shadowRoot.querySelectorAll('*').forEach(el => {
                el.style.borderRadius = '0px';
            });
        }
    }

    // 监听 Shadow DOM 变化
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => processShadowRoots(node));
        });
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
