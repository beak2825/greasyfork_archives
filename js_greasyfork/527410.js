// ==UserScript==
// @name         make DONALD TRUMP great again
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make the whitehouse.gov looks like DPRK's official website
// @author       Yaju Senpai
// @match        *://*.whitehouse.gov/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527410/make%20DONALD%20TRUMP%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/527410/make%20DONALD%20TRUMP%20great%20again.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = [
        'President Donald J. Trump',
        'President Donald Trump',
        'President Trump',
        'Donald Trump',
        'Donald J. Trump',
        'Trump'
    ].sort((a, b) => b.length - a.length);

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function calculateBaseFontSize(element) {
        const computedStyle = window.getComputedStyle(element);
        return parseFloat(computedStyle.fontSize);
    }

    function processTextNode(textNode) {
        if (!textNode.parentNode || textNode.parentNode.classList?.contains('trump-processed')) {
            return;
        }
        const originalText = textNode.nodeValue;
        const baseFontSize = calculateBaseFontSize(textNode.parentNode);
        const targetFontSize = Math.round(baseFontSize * 2);
        const temp = document.createElement('span');
        let currentText = originalText;
        let hasMatch = false;
        for (const keyword of keywords) {
            const index = currentText.indexOf(keyword);
            if (index !== -1) {
                hasMatch = true;
                const before = currentText.substring(0, index);
                const after = currentText.substring(index + keyword.length);
                if (before) temp.appendChild(document.createTextNode(before));
                const span = document.createElement('span');
                span.textContent = keyword;
                span.className = 'trump-processed';
                span.style.color = '#1937d6';
                span.style.fontSize = `${targetFontSize}px`;
                span.style.fontWeight = 800;
                temp.appendChild(span);
                if (after) temp.appendChild(document.createTextNode(after));
                currentText = after;
            }
        }
        if (hasMatch) {
            textNode.parentNode.replaceChild(temp, textNode);
        }
    }

    function walkText(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentNode.classList?.contains('trump-processed') ||
                        node.parentNode.nodeName === 'SCRIPT' ||
                        node.parentNode.nodeName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        requestAnimationFrame(() => {
            textNodes.forEach(processTextNode);
        });
    }

    walkText(document.body);

    const debouncedWalkText = debounce((node) => walkText(node), 250);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    debouncedWalkText(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();