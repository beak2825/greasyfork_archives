// ==UserScript==
// @name         MLPA (Make Lepra Playing Again)
// @namespace    http://leprosorium.ru/
// @version      2025.04.11
// @description  Fix broken video players in Safari on Lepra
// @author       zero_sugar
// @match        *://*.leprosorium.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leprosorium.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532410/MLPA%20%28Make%20Lepra%20Playing%20Again%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532410/MLPA%20%28Make%20Lepra%20Playing%20Again%29.meta.js
// ==/UserScript==

/*
History:
2025.04.11: add 'playsinline' attribute as per Apple guidelines
2025.04.10: fix typos mpla -> mlpa
2025.04.07: initial version
*/

(function() {
    'use strict';

    console.debug("MLPA is ready and waiting a page to load...");

    function fixer(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            node.querySelectorAll('video:not([data-mlpa])').forEach(v => {
                // Cloning a node removes event listeners. This is the only way. Viva JS!
                const cloned = v.cloneNode(true);
                cloned.dataset.mlpa = true; // flag it as fixed
                cloned.preload = "metadata";
                cloned.playsInline = true; // Gay Cook recommends: https://developer.apple.com/documentation/webkit/delivering-video-content-for-safari#Enable-Inline-Video-Playback
                cloned.addEventListener("loadedmetadata", () => {cloned.currentTime = 0.2});
                v.replaceWith(cloned);
            });
        }
    }

    // Wait for a party to start
    document.addEventListener("DOMContentLoaded", () => {fixer(document.body)});

    if (document.readyState !== 'loading') {
        // We are late to a party, so just do a call
        fixer(document.body);
    }

    // Fix content that is dynamically added
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => m.addedNodes.forEach(node => fixer(node)));
    });

    observer.observe(document.body, {childList: true, subtree: true});

})();