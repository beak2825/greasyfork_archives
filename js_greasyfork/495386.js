// ==UserScript==
// @name         自动给页面中的英文和中文中间添加空格
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动给页面中的英文和中文中间添加空格，文本中如果包含 A 标签，则在 A 标签的前后也添加空格
// @author       mxlg2003
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495386/%E8%87%AA%E5%8A%A8%E7%BB%99%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E8%8B%B1%E6%96%87%E5%92%8C%E4%B8%AD%E6%96%87%E4%B8%AD%E9%97%B4%E6%B7%BB%E5%8A%A0%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/495386/%E8%87%AA%E5%8A%A8%E7%BB%99%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E8%8B%B1%E6%96%87%E5%92%8C%E4%B8%AD%E6%96%87%E4%B8%AD%E9%97%B4%E6%B7%BB%E5%8A%A0%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add space around A tags and between English and Chinese characters
    function addSpaces(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            // Process element nodes
            if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'NOSCRIPT') {
                // Add node around A tags
                if (node.querySelector('a')) {
                    // Replace the content of the node with spaces around A tags
                    node.innerHTML = node.innerHTML.replace(/(<a[^>]*>)(.*?)(<\/a>)/g, ' $1$2$3 ');
                }
                for (let child = node.firstChild; child; child = child.nextSibling) {
                    addSpaces(child);
                }
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            // Process text nodes
            let text = node.nodeValue;

            // Add spaces between English and Chinese characters
            text = text.replace(/([\u4e00-\u9fa5])([A-Za-z0-9])/g, '$1 $2');
            text = text.replace(/([A-Za-z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
            node.nodeValue = text;
        }
    }

    // Initial run
    addSpaces(document.body);


})();
