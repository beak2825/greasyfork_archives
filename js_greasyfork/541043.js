// ==UserScript==
// @name         Bilibili BW/BML 入口去除
// @description  自动删除页面中包含 BW 或 BML 入口链接的 <li> 元素，适配动态加载
// @version      0.1.0
// @author       chesha1
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/*
// @match        https://*.bilibili.com/*
// @match        https://b23.tv/*
// @match        https://*.biligame.com/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1422393
// @downloadURL https://update.greasyfork.org/scripts/541043/Bilibili%20BWBML%20%E5%85%A5%E5%8F%A3%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/541043/Bilibili%20BWBML%20%E5%85%A5%E5%8F%A3%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 判断 li 是否需要删除：其去除空白后的文本由 "BW" 或 "BML" 重复组成
    function isTargetNode(li) {
        const txt = (li.innerText || '').replace(/\s+/g, '').toUpperCase();
        return /^(BW)+$/.test(txt) || /^(BML)+$/.test(txt);
    }

    // 在给定上下文（默认整个文档）中移除所有目标项
    function removeTargetNodes(context = document) {
        context.querySelectorAll('li').forEach(li => {
            if (isTargetNode(li)) {
                li.remove();
            }
        });
    }

    // DOM 就绪后先执行一次清理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => removeTargetNodes());
    } else {
        removeTargetNodes();
    }

    // 监听后续 DOM 变化，确保动态加载的内容也被清除
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                // 如果直接就是 li
                if (node.matches && node.matches('li') && isTargetNode(node)) {
                    node.remove();
                    return;
                }

                // 查找其子元素中的 li
                if (node.querySelectorAll) {
                    node.querySelectorAll('li').forEach(li => {
                        if (isTargetNode(li)) li.remove();
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
