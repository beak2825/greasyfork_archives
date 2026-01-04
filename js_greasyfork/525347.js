// ==UserScript==
// @name         DeepSeek UnFilter
// @namespace    http://tampermonkey.net/
// @version      2025-01-30
// @description  This copy the "thinking" process censored.
// @author       Fptbb (Made By DeepSeek R1)
// @license      MIT
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525347/DeepSeek%20UnFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/525347/DeepSeek%20UnFilter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer2 = new MutationObserver(function(mutations) {
        const nodesToRestore = [];

        // First pass: Identify nodes to restore
        mutations.forEach((mutation) => {
            if (mutation.removedNodes.length > 0) {
                Array.from(mutation.removedNodes).forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        node.classList.contains("edb250b1")) {
                        nodesToRestore.push({
                            node: node,
                            parent: mutation.target
                        });
                    }
                });
            }
        });

        // Second pass: Restore nodes if parent still exists
        if (nodesToRestore.length > 0) {
            // Temporarily disconnect observer to prevent infinite loop
            observer2.disconnect();

            nodesToRestore.forEach(({ node, parent }) => {
                if (parent.isConnected) {
                    parent.appendChild(node);
                }
            });

            // Reconnect observer after restoration
            observer2.observe(document.body, { childList: true, subtree: true });
        }
    });

    observer2.observe(document.body, { childList: true, subtree: true });
})();