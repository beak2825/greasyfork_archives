// ==UserScript==
// @name         Et Al to And the Gang
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Replaces all instances of "et al" with "and the gang"
// @author       mostlynobody.com
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/533161/Et%20Al%20to%20And%20the%20Gang.user.js
// @updateURL https://update.greasyfork.org/scripts/533161/Et%20Al%20to%20And%20the%20Gang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(/\bet al\b/gi, 'and the gang');
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            for (let child of node.childNodes) {
                replaceTextInNode(child);
            }
        }
    }

    function replaceAllEtAl() {
        replaceTextInNode(document.body);
    }

    replaceAllEtAl();

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver(() => {
        replaceAllEtAl();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();