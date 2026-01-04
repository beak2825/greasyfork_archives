// ==UserScript==
// @name         Persian Font Fix (Vazir)
// @namespace    https://github.com/sinazadeh/userscripts
// @version      2.2.4
// @description  Improves the readability of Persian and RTL content by applying the Vazir font across supported websites.
// @author       TheSina
// @match       *://*.telegram.org/*
// @match       *://*.x.com/*
// @match       *://*.twitter.com/*
// @match       *://*.instagram.com/*
// @match       *://*.facebook.com/*
// @match       *://*.whatsapp.com/*
// @match       *://*.github.com/*
// @match       *://*.youtube.com/*
// @match       *://*.soundcloud.com/*
// @match       *://www.google.com/*
// @match       *://gemini.google.com/*
// @match       *://translate.google.com/*
// @match       *://*.chatgpt.com/*
// @match       *://*.openai.com/*
// @match       *://fa.wikipedia.org/*
// @match       *://app.slack.com/*
// @match       *://*.goodreads.com/*
// @match       *://*.reddit.com/*
// @match       *://*.linkedin.com/*
// @exclude      *://*.google.*/recaptcha/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538095/Persian%20Font%20Fix%20%28Vazir%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538095/Persian%20Font%20Fix%20%28Vazir%29.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
(function () {
    'use strict';

    // --- Font Style ---
    GM_addStyle(`
        .font-fix-repaint { opacity: 0.99; }

        @font-face {
            font-family: 'VazirmatnFixed';
            src: local('Vazirmatn'), url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@master/fonts/webfonts/Vazirmatn-Regular.woff2') format('woff2');
            font-display: swap;
            unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
        }

        *:lang(fa),
        *:lang(ar),
        [dir="rtl"],
        span[lang^='fa'],
        span[lang^='ar'],
        [data-font-fix="fa"],
        /* Specific fix for ChatGPT prompt area */
        #prompt-textarea.ProseMirror {
            font-family: 'VazirmatnFixed', 'Noto Sans', 'Apple Color Emoji', 'Noto Color Emoji',
            'Twemoji Mozilla', 'Google Sans', 'Helvetica Neue', sans-serif !important;
        }
    `);

    // --- Debounce Utility ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Throttle Utility ---
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    // --- Character Fix ---
    const replacementRegex = /[يك]/g;
    const charMap = new Map([
        ['ي', 'ی'],
        ['ك', 'ک'],
    ]);

    const fixText = text =>
        text.replace(replacementRegex, c => charMap.get(c) || c);

    const processed = new WeakSet();
    const walkerFilter = {
        acceptNode(node) {
            return replacementRegex.test(node.nodeValue)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP;
        },
    };

    function fixNode(root) {
        if (processed.has(root) || !replacementRegex.test(root.textContent))
            return;

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            walkerFilter,
            false,
        );

        let node,
            changed = false;
        while ((node = walker.nextNode())) {
            const orig = node.nodeValue;
            const upd = fixText(orig);
            if (orig !== upd) {
                node.nodeValue = upd;
                changed = true;
            }
        }

        if (changed) processed.add(root);
    }

    // --- Auto-tag Persian text blocks ---
    const tagged = new WeakSet(); // Optimization: Avoid re-tagging
    function tagPersianText(root) {
        if (tagged.has(root)) return; // Optimization

        const regex = /[\u0600-\u06FF]/;
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false,
        );
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent) continue;
            if (!parent.dataset.fontFix && regex.test(node.nodeValue)) {
                parent.dataset.fontFix = 'fa';
            }
        }
        tagged.add(root); // Mark as tagged
    }

    // --- Throttled Processor for Mutations ---
    const processMutations = throttle(nodes => {
        for (const node of nodes) {
            // For element nodes, check content and find inputs
            if (node.nodeType === 1) {
                if (/[\u0600-\u06FF]/.test(node.textContent)) {
                    fixNode(node);
                    tagPersianText(node);
                }
                if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                    attachInput(node);
                }
                node.querySelectorAll('input,textarea').forEach(attachInput);
            }
            // For text nodes, process their parent
            else if (node.nodeType === 3 && node.parentElement) {
                if (/[\u0600-\u06FF]/.test(node.nodeValue)) {
                    fixNode(node.parentElement);
                    tagPersianText(node.parentElement);
                }
            }
        }
        nodes.clear(); // Clear the set for the next batch
    }, 250); // Process mutations at most every 250ms

    const nodesToProcess = new Set();
    const obs = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.type === 'childList') {
                m.addedNodes.forEach(n => nodesToProcess.add(n));
            } else if (m.type === 'characterData') {
                nodesToProcess.add(m.target);
            }
        }
        if (nodesToProcess.size > 0) {
            processMutations(nodesToProcess);
        }
    });

    // --- Input fix ---
    function attachInput(el) {
        if (el.dataset.pfixAttached) return;
        el.dataset.pfixAttached = '1';

        const doFix = () => {
            if (!replacementRegex.test(el.value)) return;
            const orig = el.value;
            const upd = fixText(orig);
            if (orig === upd) return;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            el.value = upd;
            if (start != null && end != null) {
                try {
                    el.setSelectionRange(start, end);
                } catch (_) {}
            }
        };

        el.addEventListener('input', () => {
            doFix(); // Immediate fix without debounce
        });

        doFix();
    }

    // --- Shadow DOM Handling ---
    function processShadowRoot(shadowRoot) {
        fixNode(shadowRoot);
        tagPersianText(shadowRoot);
        shadowRoot.querySelectorAll('input,textarea').forEach(attachInput);
        obs.observe(shadowRoot, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false, // Disable attribute monitoring
        });
    }

    const oldAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (options) {
        const shadowRoot = oldAttachShadow.call(this, options);
        processShadowRoot(shadowRoot);
        return shadowRoot;
    };

    // --- Force Reflow/Repaint ---
    function forceRepaint() {
        document.querySelectorAll('[data-font-fix="fa"]').forEach(el => {
            el.classList.add('font-fix-repaint');
            void el.offsetHeight; // Force repaint
            el.classList.remove('font-fix-repaint');
        });
    }

    // --- Viewport Change Handling ---
    const debouncedHandleViewportChange = debounce(handleViewportChange, 250);
    function handleViewportChange() {
        fixNode(document.body);
        tagPersianText(document.body);
        forceRepaint();
    }

    // --- Handle "See More" Click ---
    function handleSeeMoreClick(event) {
        const postContainer = event.target.closest(
            '[data-ad-comet-preview="message"], .x1iorvi4, .x78zum5.xdt5ytf.xz62fqu.x16ldp7u',
        );

        if (postContainer) {
            const seeMoreObserver = new MutationObserver(
                (mutations, observer) => {
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length > 0) {
                            fixNode(postContainer);
                            tagPersianText(postContainer);
                            forceRepaint();
                            observer.disconnect(); // Clean up the observer
                            return;
                        }
                    }
                },
            );

            seeMoreObserver.observe(postContainer, {
                childList: true,
                subtree: true,
            });
        }
    }

    // --- Init ---
    function init() {
        // Initial processing after a delay to let the page settle
        setTimeout(() => {
            fixNode(document.body);
            tagPersianText(document.body);
            document.querySelectorAll('input,textarea').forEach(attachInput);
            document.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot) {
                    processShadowRoot(el.shadowRoot);
                }
            });
        }, 500);

        // Single observer registration
        obs.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false, // Keep this false for performance
        });

        // Add viewport change listeners with throttling
        window.addEventListener('resize', debouncedHandleViewportChange);
        window.addEventListener('scroll', debouncedHandleViewportChange);

        // Add "See More" click listener with more specific targeting
        document.body.addEventListener('click', event => {
            if (
                event.target.matches('[role="button"]') &&
                event.target.textContent.includes('See more')
            ) {
                handleSeeMoreClick(event);
            }
        });
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
