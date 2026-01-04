// ==UserScript==
// @name         Bilibili Opus HTML 实体修复器
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  将 B 站 Opus 页面中的所有 HTML 实体修正为正确字符
// @author       Cody with ChatGPT
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535013/Bilibili%20Opus%20HTML%20%E5%AE%9E%E4%BD%93%E4%BF%AE%E5%A4%8D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535013/Bilibili%20Opus%20HTML%20%E5%AE%9E%E4%BD%93%E4%BF%AE%E5%A4%8D%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 将被拆开的 span + a + span 片段合并为一个 span
     * @param {Element} root 作用范围根节点
     */
    function mergeEntityFragments(root) {
        root.querySelectorAll('.opus-module-content p').forEach(p => {
            const kids = Array.from(p.childNodes);
            if (!kids.some(n => n.nodeType === 1 && n.tagName === 'A')) return;
            const firstSpan = kids.find(n => n.nodeType === 1 && n.tagName === 'SPAN');
            if (!firstSpan) return;

            const combinedHtml = kids.map(n => {
                if (n.nodeType === Node.TEXT_NODE) {
                    return n.nodeValue;
                } else {
                    return n.innerHTML;
                }
            }).join('');

            const merged = document.createElement('span');
            Array.from(firstSpan.attributes)
                 .forEach(attr => merged.setAttribute(attr.name, attr.value));
            merged.innerHTML = combinedHtml;

            p.innerHTML = '';
            p.appendChild(merged);
        });
    }

    /**
     * 递归遍历节点，将文本节点中的 HTML 实体一次性解码为对应字符
     * @param {Node} node
     */
    function decodeEntities(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const temp = document.createElement('div');
            temp.innerHTML = node.nodeValue;
            node.nodeValue = temp.textContent || temp.innerText;
        } else {
            node.childNodes.forEach(decodeEntities);
        }
    }

    function process(root) {
        // 1. 合并碎片
        mergeEntityFragments(root);
        // 2. 解码实体
        decodeEntities(root);
    }

    function init() {
        const app = document.getElementById('app');
        if (!app) return;

        // 首次处理
        process(app);

        // 监听动态加载
        const obs = new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        process(node);
                    }
                });
            });
        });
        obs.observe(app, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
