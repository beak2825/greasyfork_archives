// ==UserScript==
// @name         敬爱的特朗普总统🙌
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  特朗普的三代体验卡
// @author       Jasperx
// @match        *://*/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/529625/%E6%95%AC%E7%88%B1%E7%9A%84%E7%89%B9%E6%9C%97%E6%99%AE%E6%80%BB%E7%BB%9F%F0%9F%99%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/529625/%E6%95%AC%E7%88%B1%E7%9A%84%E7%89%B9%E6%9C%97%E6%99%AE%E6%80%BB%E7%BB%9F%F0%9F%99%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PROCESSED_ATTR = 'data-trump-processed';
    const OBSERVER_CONFIG = {
        childList: true,
        subtree: true
    };

    const style = document.createElement('style');
    style.textContent = `
        .trump-highlight {
            font-weight: bold !important;
            font-size: 1.1em !important;
        }
    `;
    document.head.appendChild(style);

    function processNode(node) {
        if (node.nodeType !== Node.TEXT_NODE) return;
        if (node.parentNode.hasAttribute(PROCESSED_ATTR)) return;

        const regex = /(大?[唐堂]纳德[·‧・]?(?:约翰[·‧・]?)?[ 川特]?[普朗]普?|Donald\s*J?(?:ohn)?\.?\s*Trump|DJT|Trump|川普|特朗[普])/gi;
        const text = node.textContent;

        if (!regex.test(text)) return;
        regex.lastIndex = 0; // 重置正则状态

        const wrapper = document.createElement('span');
        wrapper.innerHTML = text.replace(regex, '<span class="trump-highlight">$&</span>');

        // 标记父节点
        wrapper.setAttribute(PROCESSED_ATTR, "true");
        node.parentNode.replaceChild(wrapper, node);
    }

    // 安全遍历函数
    function safeWalk(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.hasAttribute(PROCESSED_ATTR)) return;
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'SVG'].includes(node.tagName)) return;

            // 优先处理深层节点
            Array.from(node.childNodes).reverse().forEach(child => {
                safeWalk(child);
            });
        }
        processNode(node);
    }

    // MutationObserver回调
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    safeWalk(node);
                }
            });
        });
    });

    // 初始处理
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => safeWalk(document.body));
    } else {
        setTimeout(() => safeWalk(document.body), 500);
    }

    observer.observe(document.documentElement, OBSERVER_CONFIG);

    // 清理时移除监听
    window.addEventListener('unload', () => {
        observer.disconnect();
        document.head.removeChild(style);
    });
})();
