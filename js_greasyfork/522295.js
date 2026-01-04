// ==UserScript==
// @name         中英混用加空格
// @namespace    https://greasyfork.org/users/1171320
// @version      1.02
// @description  自动在中英文之间添加空格
// @author         yzcjd
// @author2       Lama AI 辅助
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522295/%E4%B8%AD%E8%8B%B1%E6%B7%B7%E7%94%A8%E5%8A%A0%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/522295/%E4%B8%AD%E8%8B%B1%E6%B7%B7%E7%94%A8%E5%8A%A0%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断节点是否在输入框或可编辑区域内
    function isEditable(node) {
        if (!node) return false;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return true;
            if (node.isContentEditable) return true;
        }
        // 向上找父节点，避免在输入框内部的子节点也被处理
        if (node.parentElement) return isEditable(node.parentElement);
        return false;
    }

    // 防止重复处理，给文本节点添加自定义属性标记
    function markProcessed(node) {
        node._ch_en_space_processed = true;
    }
    function isProcessed(node) {
        return node._ch_en_space_processed === true;
    }

    // 处理文本节点加空格
    function addSpaceBetweenChineseAndEnglish(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (isProcessed(node)) return; // 已处理过
            if (isEditable(node)) return; // 在输入框或可编辑区，跳过
            // 添加空格
            const oldText = node.textContent;
            const newText = oldText.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9_])/g, '$1 $2')
                                   .replace(/([a-zA-Z0-9_])([\u4e00-\u9fa5])/g, '$1 $2');
            if (newText !== oldText) {
                node.textContent = newText;
            }
            markProcessed(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                addSpaceBetweenChineseAndEnglish(child);
            }
        }
    }

    // 防抖函数，减少频繁执行
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        }
    }

    // 初始化和观察 DOM 变化
    function init() {
        const body = document.body;
        if (!body) return;

        addSpaceBetweenChineseAndEnglish(body);

        const observer = new MutationObserver(debounce(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (!isEditable(node)) {
                            addSpaceBetweenChineseAndEnglish(node);
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    const node = mutation.target;
                    if (!isEditable(node)) {
                        addSpaceBetweenChineseAndEnglish(node);
                    }
                }
            }
        }, 2000)); // 2000ms节流，避免频繁执行

        observer.observe(body, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
