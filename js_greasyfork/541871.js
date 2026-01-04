// ==UserScript==
// @name         Amazon Page Smoother
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Performance optimization for Amazon: background throttling, lazy loading, and layout stabilization.
// @license      Unlicense
// @author       VeleSila
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.com.au/*
// @exclude      */cart/*
// @exclude      */buy/*
// @exclude      */checkout/*
// @exclude      */gp/buy/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541871/Amazon%20Page%20Smoother.user.js
// @updateURL https://update.greasyfork.org/scripts/541871/Amazon%20Page%20Smoother.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * CONFIGURATION
     */
    const CONFIG = {
        // Number of images to load with high priority (Above the fold approximation)
        HIGH_PRIORITY_COUNT: 4,
        // Debounce delay for the mutation observer (ms)
        DEBOUNCE_DELAY_MS: 300
    };

    /**
     * 1. CRITICAL SAFETY CHECK
     * Immediately exit on sensitive pages to prevent interference with payments.
     */
    const sensitivePaths = /(checkout|signin|payment|addressselect|huc)/i;
    if (sensitivePaths.test(window.location.pathname)) {
        return;
    }

    /**
     * 2. CSS OPTIMIZER
     * Uses modern CSS containment to prevent rendering off-screen content.
     */
    function injectOptimizedStyles() {
        const css = `
            /* Optimize Search Results */
            .s-main-slot .s-result-item {
                content-visibility: auto;
                contain-intrinsic-size: 1px 350px;
            }

            /* GPU Acceleration for Product Images */
            img.s-image {
                transform: translateZ(0);
                will-change: opacity;
            }

            /* Defer Footer Rendering */
            #navFooter {
                content-visibility: auto;
                contain-intrinsic-size: 1px 600px;
            }
        `;

        if (typeof GM_addStyle === 'function') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    /**
     * 3. RESOURCE OPTIMIZER
     * Applies lazy loading and fetch priority attributes.
     */
    function optimizeResources(rootNode = document) {
        // Select images that haven't been optimized yet
        const images = rootNode.querySelectorAll('img:not([data-opt])');
        if (images.length === 0) return;

        // Check for browser support
        const supportsPriority = 'fetchPriority' in HTMLImageElement.prototype;

        for (let i = 0, len = images.length; i < len; i++) {
            const img = images[i];
            
            // Mark as processed
            img.dataset.opt = '1';

            // 1. Footer Images: Always low priority and lazy
            if (img.closest('#navFooter')) {
                img.loading = 'lazy';
                img.decoding = 'async';
                if (supportsPriority) img.fetchPriority = 'low';
                continue;
            }

            // 2. Product Images (Search results)
            if (img.classList.contains('s-image')) {
                // Heuristic: The first few images found in the DOM are likely "Above the fold"
                if (i < CONFIG.HIGH_PRIORITY_COUNT) {
                    img.loading = 'eager';
                    if (supportsPriority) img.fetchPriority = 'high';
                } else {
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    if (supportsPriority) img.fetchPriority = 'low';
                }
                continue;
            }

            // 3. General Fallback for other images
            if (!img.hasAttribute('loading')) {
                img.loading = 'lazy';
                img.decoding = 'async';
            }
        }
    }

    /**
     * 4. INITIALIZATION & OBSERVER
     */
    function main() {
        try {
            injectOptimizedStyles();
            
            // Initial pass
            optimizeResources(document);

            // Debounced Observer for dynamic content
            let debounceTimer;
            const observer = new MutationObserver((mutations) => {
                let hasNewNodes = false;
                for (const m of mutations) {
                    if (m.addedNodes.length > 0) {
                        hasNewNodes = true;
                        break;
                    }
                }
                if (!hasNewNodes) return;

                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(() => optimizeResources(document.body));
                    } else {
                        optimizeResources(document.body);
                    }
                }, CONFIG.DEBOUNCE_DELAY_MS);
            });

            // Target the search slot specifically if it exists, otherwise fallback to body
            const targetNode = document.querySelector('.s-main-slot') || document.body;
            
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });

        } catch (error) {
            // Silently fail
        }
    }

    // Boot Logic
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main, { once: true });
    } else {
        main();
    }

})();