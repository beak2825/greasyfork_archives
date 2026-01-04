// ==UserScript==
// @name         AtCoder Anonymizer
// @namespace    http://atcoder.jp/
// @version      0.1
// @description  Hide your name on each page
// @author       Anonymous
// @match        https://atcoder.jp/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/413425/AtCoder%20Anonymizer.user.js
// @updateURL https://update.greasyfork.org/scripts/413425/AtCoder%20Anonymizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userScreenName = window.userScreenName;
    const pattern = new RegExp(userScreenName, "g");
    const replacement = "Anonymous";

    function traverse(startNode) {
        const stack = [startNode];
        while (stack.length > 0) {
            const node = stack.pop();
            if (node.nodeType == node.TEXT_NODE) {
                node.textContent = node.textContent.replace(pattern, replacement);
            } else {
                for (const childNode of node.childNodes) {
                    stack.push(childNode);
                }
            }
        }
    }

    const observer = new MutationObserver(records => {
        for (const record of records) {
            for (const node of record.addedNodes) {
                traverse(node);
            }
        }
    });

    traverse(document);
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
})();