// ==UserScript==
// @name         检索网页中的康熙部首
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  高亮康熙部首字
// @author       沉石鱼惊旋
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540590/%E6%A3%80%E7%B4%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%BA%B7%E7%86%99%E9%83%A8%E9%A6%96.user.js
// @updateURL https://update.greasyfork.org/scripts/540590/%E6%A3%80%E7%B4%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%BA%B7%E7%86%99%E9%83%A8%E9%A6%96.meta.js
// ==/UserScript==

function highlightKangxiRadicals() {
    const kangxiRegex = /[\u2F00-\u2FD5]/g;

    function isEditable(el) {
        return el.isContentEditable ||
            el.tagName === 'TEXTAREA' ||
            (el.tagName === 'INPUT' && /text|search|email|url|tel|password/.test(el.type));
    }

    function highlightNode(node) {
        if (node.nodeType === Node.TEXT_NODE &&
            kangxiRegex.test(node.nodeValue) &&
            !isEditable(node.parentElement)) {

            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(kangxiRegex, char =>
                `<span style="background: yellow; color: red; font-weight: bold;">${char}</span>`
            );
            node.parentNode.replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE &&
            node.tagName !== 'SCRIPT' &&
            node.tagName !== 'STYLE' &&
            !isEditable(node)) {
            Array.from(node.childNodes).forEach(highlightNode);
        }
    }

    highlightNode(document.body);
}

(function () {
    'use strict';
    setInterval(function () {
        highlightKangxiRadicals();
    }, 1000);
})();