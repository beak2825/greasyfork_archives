// ==UserScript==
// @name         网页中网址高亮显示并跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  在网页上选中网址时自动高亮显示，并点击跳转
// @author       Jack
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526971/%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%BD%91%E5%9D%80%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E5%B9%B6%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/526971/%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%BD%91%E5%9D%80%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E5%B9%B6%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 正则表达式匹配网址
    const urlRegex = /https?:\/\/[^\s]+/g;

    // 遍历页面中的所有文本节点
    function traverseTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            const matches = text.match(urlRegex);
            if (matches) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(urlRegex, match => `<a href="${match}" target="_blank" style="color: blue; text-decoration: underline;">${match}</a>`);
                node.parentNode.replaceChild(span, node);
            }
        } else {
            for (let child of node.childNodes) {
                traverseTextNodes(child);
            }
        }
    }

    // 初始化函数
    function init() {
        traverseTextNodes(document.body);
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
