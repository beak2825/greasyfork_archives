// ==UserScript==
// @name         AliExpress Enhanced Listings
// @namespace    https://aliexpress.com/
// @version      1.71
// @description  Shows full listing titles and highlights Choice, Bundle deals, and Premium Quality tagged listings in a unique way.
// @author       ObnubiladO
// @match        https://*.aliexpress.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/540609/AliExpress%20Enhanced%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/540609/AliExpress%20Enhanced%20Listings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const addStyle = (typeof GM_addStyle === 'function')
        ? GM_addStyle
        : (css) => {
            const s = document.createElement('style');
            s.textContent = css;
            document.head.appendChild(s);
        };

    // ==================== CSS ====================
    addStyle(`
        /* Card wrappers - expanded for full titles */
        .search-item-card-wrapper-gallery,
        .search-item-card-wrapper-list,
        [class*="search-item-card-wrapper"],
        .product-card,
        .product-container,
        .list-item,
        [data-widget*="product"],
        [data-widget*="list"],
        [class*="search-card"] {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            min-height: 0 !important;
            position: static !important;
        }

        /* Title elements - show full text */
        .title-expanded {
            display: block !important;
            white-space: normal !important;
            -webkit-line-clamp: initial !important;
            overflow: visible !important;
            text-overflow: clip !important;
            height: auto !important;
            max-height: none !important;
            line-height: 1.35 !important;
        }

        /* Spacing */
        .product-container,
        [class*="search-item-card-wrapper"] {
            margin-bottom: 25px !important;
        }

        /* Highlights */
        .choice-highlight {
            background-color: #fff8c4 !important;
            border: 2px solid #f5c518 !important;
        }
        .bundle-highlight {
            background-color: #ff3b3b !important;
            color: white !important;
            font-weight: bold !important;
            border-radius: 4px;
        }
        .premium-highlight {
            background-color: #ffc501 !important;
            color: #666666 !important;
            font-weight: bold !important;
            border-radius: 4px;
            padding: 0 4px;
        }
    `);

    // ==================== Title Expansion ====================
    function revealFullTitles() {
        // Restore original comprehensive selector
        const selector = [
            'a[href*="/item/"] h3',
            'a[href*="/item/"] [numberoflines]',
            'a[href*="/item/"] [title]',
            'a[href*="/item/"] [style*="-webkit-line-clamp"]',
            '[class*="search-item-card-wrapper"] h3',
            '[class*="search-item-card-wrapper"] [numberoflines]',
            '[class*="search-item-card-wrapper"] [title]',
            '[class*="search-item-card-wrapper"] [style*="-webkit-line-clamp"]',
            'h3.kt_ki'
        ].join(',');

        const titles = document.querySelectorAll(selector);
        const updates = [];

        titles.forEach(el => {
            // CRITICAL: Add class AND inline styles to beat stubborn inline styles
            el.classList.add('title-expanded');
            el.style.cssText += 'display:block!important;white-space:normal!important;-webkit-line-clamp:initial!important;overflow:visible!important;text-overflow:clip!important;height:auto!important;max-height:none!important;line-height:1.35!important;';

            // Check title attribute
            const titleAttr = el.getAttribute('title');
            if (titleAttr) {
                const visibleText = (el.textContent || '').trim();
                if (titleAttr.trim().length > visibleText.length) {
                    updates.push({ el, text: titleAttr });
                }
            }
        });

        // Batch text updates
        updates.forEach(({ el, text }) => {
            el.textContent = text;
        });
    }

    // ==================== Optimized Highlighting ====================
    function findElementsByText(text) {
        const results = [];
        const xpath = `//text()[normalize-space()='${text}']/parent::*[not(self::script or self::style)]`;
        const iterator = document.evaluate(xpath, document.body, null,
            XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

        let node;
        while (node = iterator.iterateNext()) {
            if (node.offsetParent !== null) {
                results.push(node);
            }
        }
        return results;
    }

    function highlightChoiceCards() {
        const cards = document.querySelectorAll('.search-item-card-wrapper-gallery');
        cards.forEach(card => {
            const img = card.querySelector('img[src*="154x64.png"], img[src*="S1887a285b60743859ac7bdbfca5e0896Z"]');
            if (img) {
                card.classList.add('choice-highlight');
            }
        });
    }

    function highlightBundleTags() {
        findElementsByText('Bundle deals').forEach(el => {
            el.classList.add('bundle-highlight');
        });
    }

    function highlightPremiumQualityTags() {
        findElementsByText('Premium Quality').forEach(el => {
            // Only replace if it's a text-only node
            if (el.childNodes.length === 1 && el.firstChild.nodeType === Node.TEXT_NODE) {
                const span = document.createElement('span');
                span.textContent = 'Premium Quality';
                span.classList.add('premium-highlight');
                el.textContent = '';
                el.appendChild(span);
            }
        });
    }

    function applyHighlights() {
        // Clear old highlights efficiently with class selectors
        document.querySelectorAll('.choice-highlight, .bundle-highlight, .premium-highlight')
            .forEach(el => el.classList.remove('choice-highlight', 'bundle-highlight', 'premium-highlight'));

        highlightChoiceCards();
        highlightBundleTags();
        highlightPremiumQualityTags();
    }

    // ==================== Throttled Update ====================
    let rafId;
    function updateAll() {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            revealFullTitles();
            applyHighlights();
        });
    }

    // ==================== Optimized Observer Setup ====================
    function setupObserversAndEvents() {
        // Only observe the product grid, not entire body
        const productContainer = document.querySelector('.search-product-grid, .right-container, .product-list');
        const observerTarget = productContainer || document.body;

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                updateAll();
            }
        });

        observer.observe(observerTarget, {
            childList: true,
            subtree: true
        });

        // Throttled scroll (only for lazy-load edge cases)
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateAll, 100);
        }, { passive: true });

        // Modern SPA navigation detection (where supported)
        if ('navigation' in window) {
            window.navigation.addEventListener('navigate', updateAll);
        } else {
            // Legacy URL change detection (throttled)
            let lastUrl = location.href;
            setInterval(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    updateAll();
                }
            }, 1000);
        }
    }

    // ==================== Initialization ====================
    function init() {
        console.log('[AliExpress Enhanced Listings v1.71] Initializing...');
        updateAll();
        setupObserversAndEvents();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();