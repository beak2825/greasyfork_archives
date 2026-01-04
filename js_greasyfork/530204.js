// ==UserScript==
// @name         MWI - Hide Chinese Chat Messages
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hides only new chat messages containing Chinese characters, without affecting the rest of the page.
// @author       Epsilon
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530204/MWI%20-%20Hide%20Chinese%20Chat%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/530204/MWI%20-%20Hide%20Chinese%20Chat%20Messages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Chinese character Unicode blocks
    const CHINESE_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;

    // Check text content only
    function containsChineseText(text) {
        return CHINESE_REGEX.test(text);
    }

    // Hide a node if it only contains Chinese text (or includes it)
    function hideIfChinese(node) {
        if (node.nodeType === Node.TEXT_NODE && containsChineseText(node.textContent)) {
            const parent = node.parentElement;
            if (parent) {
                parent.style.display = 'none';
            }
        }
    }

    // Observe only additions of text nodes in the DOM
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    hideIfChinese(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    node.querySelectorAll('*').forEach(child => {
                        child.childNodes.forEach(hideIfChinese);
                    });
                }
            }
        }
    });

    // Start observing the entire document, but only for small text updates
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
