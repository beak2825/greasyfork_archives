// ==UserScript==
// @name         链接可点击
// @namespace    
// @version      2025-04-28
// @description  允许所有不可点击的文本链接变为可点击的链接(也就是给他套上了<a>标签)
// @author       Frank2222
// @match        *://*/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534278/%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/534278/%E9%93%BE%E6%8E%A5%E5%8F%AF%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {

    const urlRegex = /https?:\/\/[^\s<>"'{}()]+/gi;

    function walk(node) {
        let child = node.firstChild;
        while (child) {
            const next = child.nextSibling;
            if (child.nodeType === Node.TEXT_NODE) {
                replaceText(child);
            } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'A' && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                // 只处理非 <a>、<script>、<style> 标签内的内容
                walk(child);
            }
            child = next;
        }
    }

    // 替换url
    function replaceText(textNode) {
        const text = textNode.nodeValue;
        const matches = text.match(urlRegex);
        if (matches) {
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            for (const match of matches) {
                const index = text.indexOf(match, lastIndex);
                if (index > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
                }
                const a = document.createElement('a');
                a.href = match;
                a.textContent = match;
                a.style.color = 'blue';
                a.target = '_blank';
                fragment.appendChild(a);
                lastIndex = index + match.length;
            }
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    }

    walk(document.body);
})();



