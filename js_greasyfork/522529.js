// ==UserScript==
// @name         Replace Reiner with Reiner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all occurrences of 雷纳 with Reiner on web pages.
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522529/Replace%20Reiner%20with%20Reiner.user.js
// @updateURL https://update.greasyfork.org/scripts/522529/Replace%20Reiner%20with%20Reiner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/雷纳/g, "reiner");
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                replaceText(child);
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    replaceText(node);
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial replacement
    replaceText(document.body);
})();