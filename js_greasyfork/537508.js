// ==UserScript==
// @name         Notion 高亮挖空
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blurs highlighted text in Notion notes, reveals on hover with improved reliability
// @author       tianzhongs
// @match        https://*.notion.so/*
// @grant        GM_addStyle
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/537508/Notion%20%E9%AB%98%E4%BA%AE%E6%8C%96%E7%A9%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/537508/Notion%20%E9%AB%98%E4%BA%AE%E6%8C%96%E7%A9%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS with higher specificity and pointer-events
    GM_addStyle(`
        /* Target Notion highlight classes or elements with background colors */
        .notion-page-content span[style*="background"],
        .notion-page-content [class*="color"],
        .notion-page-content span[style*="background-color"] {
            filter: blur(4px) !important;
            transition: filter 0.3s ease !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 1 !important;
        }

        /* Remove blur on hover with higher specificity */
        .notion-page-content span[style*="background"]:hover,
        .notion-page-content [class*="color"]:hover,
        .notion-page-content span[style*="background-color"]:hover {
            filter: none !important;
        }
    `);

    // JavaScript fallback for hover handling
    function applyHoverEffect() {
        const highlights = document.querySelectorAll(
            '.notion-page-content span[style*="background"], .notion-page-content [class*="color"], .notion-page-content span[style*="background-color"]'
        );
        highlights.forEach(el => {
            // Ensure initial blur
            el.style.filter = 'blur(4px)';
            el.style.transition = 'filter 0.3s ease';
            el.style.pointerEvents = 'auto';

            // Add hover event listeners
            el.addEventListener('mouseenter', () => {
                el.style.filter = 'none';
            });
            el.addEventListener('mouseleave', () => {
                el.style.filter = 'blur(4px)';
            });
        });
    }

    // Run initial application of hover effect
    applyHoverEffect();

    // MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                applyHoverEffect();
            }
        });
    });

    // Observe changes in the Notion page content
    const targetNode = document.querySelector('body');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }
})();