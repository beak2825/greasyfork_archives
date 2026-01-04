// ==UserScript==
// @name         Disable LaTeX on Discourse
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent LaTeX rendering on Discourse forums
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542590/Disable%20LaTeX%20on%20Discourse.user.js
// @updateURL https://update.greasyfork.org/scripts/542590/Disable%20LaTeX%20on%20Discourse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper to override MathJax and KaTeX render functions
    function blockRenderers() {
        if (window.MathJax) {
            console.log("[Tampermonkey] Blocking MathJax...");
            window.MathJax = {
                typeset: function() {},
                typesetPromise: function() { return Promise.resolve(); },
                startup: { promise: Promise.resolve() },
                config: {}
            };
        }

        if (window.katex) {
            console.log("[Tampermonkey] Blocking KaTeX...");
            window.katex = {
                render: function() {},
                renderToString: function() { return ''; }
            };
        }
    }

    // Observe new script tags that try to load MathJax or KaTeX
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src &&
                    (node.src.includes('MathJax') || node.src.includes('katex'))) {
                    console.log("[Tampermonkey] Blocking script:", node.src);
                    node.type = 'javascript/blocked';
                    node.parentNode.removeChild(node);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Run blocker early and often
    blockRenderers();
    setInterval(blockRenderers, 1000); // Re-block in case the page tries to reload them
})();