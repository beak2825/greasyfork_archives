// ==UserScript==
// @name         智能聚光灯
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlight multiple keywords in deep blue on Linux.do
// @author       Your Name
// @match        https://linux.do/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/493337/%E6%99%BA%E8%83%BD%E8%81%9A%E5%85%89%E7%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/493337/%E6%99%BA%E8%83%BD%E8%81%9A%E5%85%89%E7%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = ["免费", "bin", "病友", "白嫖", "公益", "kfc", "节点"];
    const color = "#28a745";  // 设置高亮颜色为柔和的绿色

    function highlightText(node) {
        if (node.nodeType === 3) {
            let text = node.nodeValue;
            const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
            const newHTML = text.replace(regex, `<span style="color: ${color};">$1</span>`);
            
            if (newHTML !== text) {
                const newSpan = document.createElement('span');
                newSpan.innerHTML = newHTML;
                node.parentNode.replaceChild(newSpan, node);
                return true;
            }
            return false;
        } else if (node.nodeType === 1 && node.nodeName.toLowerCase() !== 'script' && node.nodeName.toLowerCase() !== 'style') {
            for (const child of node.childNodes) {
                if (highlightText(child)) {
                    return true;
                }
            }
        }
        return false;
    }

    function applyHighlight() {
        const nodes = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td');
        nodes.forEach(node => {
            highlightText(node);
        });
    }

    // Start a periodic check to apply highlights. Adjusted to every 1000 milliseconds (1 seconds)
    setInterval(applyHighlight, 1000);

    applyHighlight();  // Initial application
})();