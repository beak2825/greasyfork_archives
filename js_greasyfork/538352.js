// ==UserScript==
// @name         VRCW.net World ID to VRCX Deeplink
// @namespace    au.benjithatfoxguy.vrcw.net
// @icon         https://cdn.benjifox.gay/favicon.ico
// @version      1.2.3
// @description  Converts VRChat world IDs to VRCX deeplinks on vrcw.net
// @author       BenjiThatFoxGuy
// @match        *://*.vrcw.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538352/VRCWnet%20World%20ID%20to%20VRCX%20Deeplink.user.js
// @updateURL https://update.greasyfork.org/scripts/538352/VRCWnet%20World%20ID%20to%20VRCX%20Deeplink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const worldIdRegex = /wrld_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

    function processTextNode(node) {
        const text = node.textContent;
        if (worldIdRegex.test(text)) {
            const span = document.createElement('span');
            span.innerHTML = text.replace(worldIdRegex, match => 
                `<a href="vrcx://world/${match}" style="color: inherit; text-decoration: underline;">${match}</a>`
            );
            node.parentNode.replaceChild(span, node);
        }
    }

    function findAndReplaceWorldIds(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return worldIdRegex.test(node.textContent) ? 
                        NodeFilter.FILTER_ACCEPT : 
                        NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(processTextNode);
    }

    // Process existing content
    findAndReplaceWorldIds(document.body);

    // Watch for dynamic content changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    findAndReplaceWorldIds(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
