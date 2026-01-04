// ==UserScript==
// @name         解码“禁用S1繁简转换”造成的乱码
// @license      GPL v3
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  解码因为使用unlsycn编写“禁用S1的繁简转换”脚本造成的“乱码”，以方便阅读。感谢之前“unlsycn”提供的简繁转换脚本。
// @author       X.Y.Z
// @match        https://*.saraba1st.com/2b/*
// @icon         https://bbs.saraba1st.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/495543/%E8%A7%A3%E7%A0%81%E2%80%9C%E7%A6%81%E7%94%A8S1%E7%B9%81%E7%AE%80%E8%BD%AC%E6%8D%A2%E2%80%9D%E9%80%A0%E6%88%90%E7%9A%84%E4%B9%B1%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/495543/%E8%A7%A3%E7%A0%81%E2%80%9C%E7%A6%81%E7%94%A8S1%E7%B9%81%E7%AE%80%E8%BD%AC%E6%8D%A2%E2%80%9D%E9%80%A0%E6%88%90%E7%9A%84%E4%B9%B1%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    function convertHexToUnicode(text) {
        return text.replace(/&#x([0-9A-Fa-f]+);/g, function(match, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        });
    }

    function processTextNode(node) {
        let text = node.textContent;
        let newText = convertHexToUnicode(text);
        if (newText !== text) {
            node.textContent = newText;
        }
    }

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else {
            for (let child = node.firstChild; child; child = child.nextSibling) {
                traverseNodes(child);
            }
        }
    }

    traverseNodes(document.body);
})();