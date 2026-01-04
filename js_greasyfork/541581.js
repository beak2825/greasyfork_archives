// ==UserScript==
// @name         自动链接化文本
// @namespace    https://greasyfork.org/zh-CN/scripts/541581
// @version      0.7
// @description  自动将页面中的网址、电子邮件地址、裸域名和子域名转换为可点击的链接。
// @author       vDtv3vNZoE5d
// @match        https://bbs.oldmantvg.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541581/%E8%87%AA%E5%8A%A8%E9%93%BE%E6%8E%A5%E5%8C%96%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541581/%E8%87%AA%E5%8A%A8%E9%93%BE%E6%8E%A5%E5%8C%96%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function linkifyText(node) {
        // 跳过某些标签，避免破坏功能或重复处理
        if (node.nodeName === 'A' || node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT' || node.nodeName === 'PRE' || node.nodeName === 'CODE') {
            return;
        }

        let text = node.textContent;

        // 增强后的正则表达式：
        // 匹配规则优先级：完整URL -> WWWURL -> Email -> 裸域名/子域名+路径
        const urlRegex = /(https?:\/\/[^\s<>"'()]+\b(?!\.(jpe?g|png|gif|bmp|webp|ico|svg|css|js))|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?<![a-zA-Z0-9_.-])(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s<>"'()]*)?(?:\?[^\s<>"'()]*)?(?:#[^\s<>"'()]*)?)(?=[/\s.,;?!)\]\}<]|$)/g;

        let match;
        let lastIndex = 0;
        let fragment = document.createDocumentFragment();

        while ((match = urlRegex.exec(text)) !== null) {
            // 确保匹配到的内容不是空的
            if (match[0].trim() === '') {
                 lastIndex = urlRegex.lastIndex;
                 continue;
            }

            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            }

            let a = document.createElement('a');
            let href = match[0];

            // 判断匹配到的类型并设置href
            if (href.startsWith('http://') || href.startsWith('https://')) {
                a.href = href;
            } else if (href.startsWith('www.')) {
                a.href = 'http://' + href;
            } else if (href.includes('@')) { // 电子邮件地址
                a.href = 'mailto:' + href;
            } else { // 裸域名/子域名（含路径）
                a.href = 'http://' + href;
            }

            a.textContent = href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';

            fragment.appendChild(a);
            lastIndex = urlRegex.lastIndex;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        if (fragment.children.length > 0 || lastIndex > 0) {
            node.parentNode.replaceChild(fragment, node);
        }
    }

    function traverseDOM(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            linkifyText(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 避免处理已经变成链接的元素，以及代码块、预格式化文本等
            if (node.nodeName === 'A' || node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT' || node.nodeName === 'PRE' || node.nodeName === 'CODE') {
                return;
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseDOM(node.childNodes[i]);
            }
        }
    }

    window.addEventListener('load', function() {
        traverseDOM(document.body);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        traverseDOM(node);
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();