// ==UserScript==
// @name         消除知乎直答标记（蓝色字体）
// @namespace    
// @version      1.1
// @description  移除知乎网页端回答和文章中类似"知乎直答✦"的关键词链接
// @author       
// @match        *://*.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541968/%E6%B6%88%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%E6%A0%87%E8%AE%B0%EF%BC%88%E8%93%9D%E8%89%B2%E5%AD%97%E4%BD%93%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541968/%E6%B6%88%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%E6%A0%87%E8%AE%B0%EF%BC%88%E8%93%9D%E8%89%B2%E5%AD%97%E4%BD%93%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetClass = "RichContent-EntityWord";

    // 移除链接并清理角标
    function removeLinks() {
        const links = document.querySelectorAll(`a.${targetClass}:not([data-processed])`);
        links.forEach(link => {
            // 获取纯文本内容并移除✦
            let text = link.textContent.replace(/✦/g, '');

            // 创建纯文本节点
            const textNode = document.createTextNode(text);

            // 用纯文本替换链接
            link.parentNode.replaceChild(textNode, link);

            // 标记为已处理（虽然元素已被替换，但为保险起见）
            textNode.data = textNode.data + ' '; // 添加标记但不影响显示
        });
    }

    // 页面加载时初次处理
    removeLinks();

    // 设置MutationObserver处理动态内容
    const observer = new MutationObserver(mutations => {
        let needsProcess = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                needsProcess = true;
            }
        });
        if (needsProcess) {
            removeLinks();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false,
        attributes: false
    });

    // 添加防抖处理滚动加载
    let timer;
    window.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(removeLinks, 300);
    });
})();