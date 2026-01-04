// ==UserScript==
// @name         iCampus Grade Editor (Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Instantly replaces grades & GPA on iCampus when they appear (no delay)
// @match        *://icampus.dublinusd.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539232/iCampus%20Grade%20Editor%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539232/iCampus%20Grade%20Editor%20%28Optimized%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const replacements = {
        "C": "A-",
        "(74.96%)": "(90.05%)",
        "B-": "A",
        "(80.09%)": "(93.06%)",
        "C-": "B-",
        "(72.43%)": "(83.45%)",
        "C+": "A",
        "(77.09%)": "(94.26%)",
        "B": "B+",
        "(84.65%)": "(88.65%)",
        "3.83": "4.33"
    };

    function replaceTextNodes(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const text = node.nodeValue.trim();
            for (const [from, to] of Object.entries(replacements)) {
                if (text === from) {
                    node.nodeValue = node.nodeValue.replace(from, to);
                }
            }
        }
    }

    // Apply immediately to already-loaded DOM
    replaceTextNodes(document.body);

    // Observe for fast dynamic content replacement
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue.trim();
                    for (const [from, to] of Object.entries(replacements)) {
                        if (text === from) {
                            node.nodeValue = node.nodeValue.replace(from, to);
                        }
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceTextNodes(node);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
