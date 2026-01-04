// ==UserScript==
// @name         知乎超链接转纯文本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  用户回答中的一些关键词会被知乎自动转换为站内搜索的超链接。然而，知乎的搜索功能并不好用，且作为一个问答社区，知乎并不适合作为查询工具。当用户试图选中这些被超链接标记的词语，准备复制到搜索引擎进行搜索时，极易误触链接而跳转至知乎的搜索页面。本脚本通过移除这些自动生成的超链接，将文本恢复为普通格式，从而避免误触。
// @author       EPC_SG
// @match        *://*.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522471/%E7%9F%A5%E4%B9%8E%E8%B6%85%E9%93%BE%E6%8E%A5%E8%BD%AC%E7%BA%AF%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522471/%E7%9F%A5%E4%B9%8E%E8%B6%85%E9%93%BE%E6%8E%A5%E8%BD%AC%E7%BA%AF%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏超链接并添加普通文本
    function hideLinksAndAddText() {
        const elements = document.querySelectorAll('a.RichContent-EntityWord.css-b7erz1');
        elements.forEach(element => {
            // 检查是否已经处理过该元素
            if (element.dataset.processed) return;

            // 隐藏超链接
            element.style.display = 'none';

            // 创建普通文本节点
            const text = element.textContent;
            const textNode = document.createTextNode(text);

            // 在超链接后插入普通文本
            element.parentNode.insertBefore(textNode, element.nextSibling);

            // 标记该元素已处理
            element.dataset.processed = true;
        });
    }

    // 初始化时执行一次替换
    hideLinksAndAddText();

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 如果有节点被添加，执行替换
                hideLinksAndAddText();
            }
        }
    });

    // 监听整个文档的变化
    observer.observe(document.body, {
        childList: true, // 监听子节点的变化
        subtree: true // 监听所有后代节点的变化
    });
})();