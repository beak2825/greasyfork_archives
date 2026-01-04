// ==UserScript==
// @name         链接净化器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  复制时自动删除URL中的中文字符干扰符
// @author       Flygeon
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526543/%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526543/%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 链接清洗白名单（RFC3986标准）
    const urlAllowedChars = /[^\w\-._~:/?#[\]@!$&'()*+,;=%]/g;

    // ================= 核心函数 =================
    function cleanURL(url) {
        return url
            // 删除非白名单字符
            .replace(urlAllowedChars, '')
            // 修复协议头
            .replace(/^(h+)(t+)(p+)(s*)(:*\/?\/?)/i, (_, h, t, p, s, sep) => {
                const proto = `http${s ? 's' : ''}:${sep.includes('//') ? '//' : ''}`;
                return proto.startsWith('http') ? proto : '';
            })
            // 移除多余斜杠
            .replace(/(https?:\/)\/*/g, '$1/');
    }

    // ============== 功能1：修复页面链接 ==============
    function processTextNode(node) {
        // 跳过已处理的节点和特殊元素
        if (node._linkProcessed || node.parentElement.tagName === 'A') return;
        node._linkProcessed = true;

        const text = node.textContent;
        // 匹配疑似被干扰的URL（宽松匹配）
        const urlRegex = /\b(?:h[-_\w]*t[-_\w]*t[-_\w]*p[-_\w]*s?:\/\/|www\.)[^\s\u4e00-\u9fa5]+/gi;

        let newHtml = text;
        let match;

        while ((match = urlRegex.exec(text)) !== null) {
            const rawUrl = match[0];
            const cleaned = cleanURL(rawUrl);

            // 仅当清理后是有效URL时替换
            if (/^https?:\/\/\w+/.test(cleaned)) {
                newHtml = newHtml.replace(rawUrl,
                    `<a href="${cleaned}" target="_blank" style="color:#06c;">${cleaned}</a>`);
            }
        }

        if (newHtml !== text) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = newHtml;
            node.parentNode.replaceChild(wrapper, node);
        }
    }

    // 使用MutationObserver监听动态内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        processTextNode(node);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        node.querySelectorAll('*').forEach(el => {
                            if (el.childNodes.length === 1 && el.firstChild.nodeType === Node.TEXT_NODE) {
                                processTextNode(el.firstChild);
                            }
                        });
                    }
                });
            }
        });
    });

    // 初始处理 + 启动监听
    document.querySelectorAll('*').forEach(el => {
        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) processTextNode(node);
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // ============== 功能2：复制时清理 ==============
    document.addEventListener('copy', e => {
        const selection = window.getSelection().toString();
        const cleaned = selection.replace(/(https?:\/\/[^\s]+)/gi, (url) => {
            return cleanURL(url).replace(/\s/g, '');
        });

        if (cleaned !== selection) {
            e.clipboardData.setData('text/plain', cleaned);
            e.preventDefault();
        }
    });
})();