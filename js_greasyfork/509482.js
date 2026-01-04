// ==UserScript==
// @name         遇到句号就添加换行
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  在网页正文中的句号后面添加</br>实现换行
// @author       阿虚同学
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509482/%E9%81%87%E5%88%B0%E5%8F%A5%E5%8F%B7%E5%B0%B1%E6%B7%BB%E5%8A%A0%E6%8D%A2%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/509482/%E9%81%87%E5%88%B0%E5%8F%A5%E5%8F%B7%E5%B0%B1%E6%B7%BB%E5%8A%A0%E6%8D%A2%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to add line breaks after Chinese periods
    function addLineBreaks(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let newText = text.replace(/。/g, '。</br>');
            let newNode = document.createElement('span');
            newNode.innerHTML = newText;
            node.parentNode.replaceChild(newNode, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                addLineBreaks(child);
            }
        }
    }

    // Target the main content area of the webpage
    let contentArea = document.body; // You might want to target a specific element instead of the whole body

    // Apply the line breaks recursively
    addLineBreaks(contentArea);

})();