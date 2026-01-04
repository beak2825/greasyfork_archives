// ==UserScript==
// @name         Fix <code> bug for Edge translator
// @name:zh-CN   Fix <code> bug for Edge translator
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Replace <code> tags with styled <span> to fix the bug of Edge's translator.
// @description:zh-CN  把网页中的所有内联的<code>标签替换成同样式<span>，以修复Edge内置翻译器bug
// @author       yqs112358
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/485715/Fix%20%3Ccode%3E%20bug%20for%20Edge%20translator.user.js
// @updateURL https://update.greasyfork.org/scripts/485715/Fix%20%3Ccode%3E%20bug%20for%20Edge%20translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace a single <code> tag with a same-styled <span>
    function replaceCodeToSpan(codeNode) {
        // only process <code> without any child element
        if (codeNode.tagName === 'CODE' && codeNode.children.length === 0) {
            const spanNode = document.createElement('span');

            // Copy all attributes
            Array.from(codeNode.attributes).forEach(attr => {
                spanNode.setAttribute(attr.name, attr.value);
            });
            // Copy all computed styles
            const computedStyle = window.getComputedStyle(codeNode);
            for (let key of computedStyle) {
                spanNode.style[key] = computedStyle[key];
            }
            // Copy InnerHTML
            spanNode.innerHTML = codeNode.innerHTML;

            codeNode.parentNode.replaceChild(spanNode, codeNode);
        }
    }

    // Walkthrough a node and its child to replace <code> tags
    function processNodeAndChild(node) {
        if (node.nodeType === 1) {      // Element node
            node.querySelectorAll('code').forEach(replaceCodeToSpan);
            replaceCodeToSpan(node);
        }
    }

    ////////////////////////////////////////////////////////

    // Replace <code> at startup
    document.querySelectorAll('code').forEach(replaceCodeToSpan);

    // Observe DOM changes and replace new-generated <code> if needed
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(processNodeAndChild);
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();