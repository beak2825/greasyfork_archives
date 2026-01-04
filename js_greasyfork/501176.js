// ==UserScript==
// @name           磁力链和ED2K文本变成超链接超级链接
// @namespace      http
// @version        1.1.1
// @description    自动将磁力链和ED2K文本变为超链接
// @author         dwpublic
// @include        http*://*
// @match          http*://*
// @grant          none
// @run-at         document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/501176/%E7%A3%81%E5%8A%9B%E9%93%BE%E5%92%8CED2K%E6%96%87%E6%9C%AC%E5%8F%98%E6%88%90%E8%B6%85%E9%93%BE%E6%8E%A5%E8%B6%85%E7%BA%A7%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/501176/%E7%A3%81%E5%8A%9B%E9%93%BE%E5%92%8CED2K%E6%96%87%E6%9C%AC%E5%8F%98%E6%88%90%E8%B6%85%E9%93%BE%E6%8E%A5%E8%B6%85%E7%BA%A7%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    const magnetRegex = /((magnet:\?xt=urn:[a-zA-Z0-9]+:[a-zA-Z0-9]{32,}))(?=\s|$)/g;
    const ed2kRegex = /ed2k:\/\/\|file\|(.+?)\|(\d+)\|([0-9a-fA-F]+)\|\//g;

    function convertLinks(element) {
        if (element.innerText != undefined) {
            element.innerHTML = element.innerHTML
                .replace(magnetRegex, '<a target="_blank" href="$1" style="text-decoration:underline;">$1</a>')
                .replace(ed2kRegex, '<a target="_blank" href="ed2k://|file|$1|$2|$3|/" style="text-decoration:underline;">ed2k://|file|$1|$2|$3|/</a>');
        }
    }

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE && (node.nodeValue.match(magnetRegex) || node.nodeValue.match(ed2kRegex))) {
            const span = document.createElement('span');
            span.innerHTML = node.nodeValue
                .replace(magnetRegex, '<a target="_blank" href="$1" style="text-decoration:underline;">$1</a>')
                .replace(ed2kRegex, '<a target="_blank" href="ed2k://|file|$1|$2|$3|/" style="text-decoration:underline;">ed2k://|file|$1|$2|$3|/</a>');
            node.parentNode.replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(child => processNode(child));
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('body *').forEach(element => processNode(element));
    });
})();
