// ==UserScript==
// @name         白宫官网特朗普名字高亮
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bold and highlight all occurrences of the name “Donald Trump” on the whitehouse.gov 
// @author       三太阳同志
// @match        *://*.whitehouse.gov/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543093/%E7%99%BD%E5%AE%AB%E5%AE%98%E7%BD%91%E7%89%B9%E6%9C%97%E6%99%AE%E5%90%8D%E5%AD%97%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/543093/%E7%99%BD%E5%AE%AB%E5%AE%98%E7%BD%91%E7%89%B9%E6%9C%97%E6%99%AE%E5%90%8D%E5%AD%97%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const patterns = [
        /\bDonald\s+Trump\b/gi,
        /\bDonald\s+J\.?\s+Trump\b/gi,
        /\bMr\.?\s+Trump\b/gi,
        /\bPresident\s+Trump\b/gi
    ];

    function processTextNode(textNode) {
        let text = textNode.nodeValue;
        let replaced = false;

        for (const pattern of patterns) {
            if (pattern.test(text)) {
                text = text.replace(pattern, match =>
                    `<span style="font-weight:bold; font-family:Arial, sans-serif; color:red;">${match}</span>`
                );
                replaced = true;
            }
        }

        if (replaced) {
            const span = document.createElement('span');
            span.innerHTML = text;
            textNode.parentNode.replaceChild(span, textNode);
        }
    }

    function walkAndProcess(node) {
        let child, next;
        switch (node.nodeType) {
            case 1: // Element
            case 9: // Document
            case 11: // Document fragment
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    walkAndProcess(child);
                    child = next;
                }
                break;
            case 3: // Text node
                processTextNode(node);
                break;
        }
    }

    // Initial processing
    walkAndProcess(document.body);

    // MutationObserver for dynamic content
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 || node.nodeType === 11) {
                    walkAndProcess(node);
                } else if (node.nodeType === 3) {
                    processTextNode(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
