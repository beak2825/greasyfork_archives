// ==UserScript==
// @name         Auto RTL Input
// @namespace    https://github.com/sinazadeh/userscripts
// @match        *://*.chatgpt.com/*
// @match        *://*.openai.com/*
// @match        *://gemini.google.com/*
// @grant        none
// @version      1.0.1
// @author       -
// @description  Automatically sets right-to-left (RTL) direction in ChatGPT's and Gemini's input fields when typing Arabic or Persian.
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543234/Auto%20RTL%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/543234/Auto%20RTL%20Input.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function () {
    'use strict';

    // This regex detects characters in the Arabic, Thaana, and other Arabic-based scripts.
    const isRTLText = text =>
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

    function setDirection(el) {
        const text = el.innerText || el.textContent || el.value || '';
        // Set direction to 'rtl' if RTL text is detected, otherwise 'ltr'.
        const dir = isRTLText(text.trim()) ? 'rtl' : 'ltr';
        if (el.getAttribute('dir') !== dir) {
            el.setAttribute('dir', dir);
            // Also set CSS direction as backup
            el.style.direction = dir;
        }
    }

    function attachListeners(el) {
        if (!el || el.dataset.rtlAttached) return; // Do not attach more than once
        el.dataset.rtlAttached = 'true';

        console.log('RTL Script: Attached to element:', el);

        const update = () => setDirection(el);
        el.addEventListener('input', update);
        el.addEventListener('keyup', update);
        el.addEventListener('keydown', update);
        el.addEventListener('focus', update);
        // Use a small timeout on paste to allow the content to render.
        el.addEventListener('paste', () => setTimeout(update, 10));

        update(); // Run once on initial attachment
    }

    function findAndAttach() {
        // ChatGPT selectors (multiple fallbacks)
        const chatGPTSelectors = [
            "div.ProseMirror[contenteditable='true']",
            "[data-testid='user-message'] div[contenteditable='true']",
            "div[contenteditable='true'][data-id]",
        ];

        // Gemini selectors (multiple fallbacks)
        const geminiSelectors = [
            'div[role="textbox"][contenteditable="true"]',
            'div[contenteditable="true"][data-testid]',
            'div[contenteditable="true"][placeholder]',
            'textarea[placeholder*="Enter a prompt"]',
            'div[contenteditable="true"]',
            'rich-textarea div[contenteditable="true"]',
            '[data-testid="input-area"] div[contenteditable="true"]',
        ];

        const allSelectors = [...chatGPTSelectors, ...geminiSelectors];

        function processElements(selector) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (
                    el &&
                    (el.getAttribute('contenteditable') === 'true' ||
                        el.tagName.toLowerCase() === 'textarea')
                ) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 50 && rect.height > 20) {
                        attachListeners(el);
                    }
                }
            }
        }

        for (const selector of allSelectors) {
            processElements(selector);
        }

        // Special handling for dynamically created elements
        // Look for any contenteditable div that might be an input
        const allContentEditable = document.querySelectorAll(
            'div[contenteditable="true"]',
        );
        allContentEditable.forEach(el => {
            // Check if element looks like an input (has certain characteristics)
            const rect = el.getBoundingClientRect();
            const hasInputLikeParent =
                el.closest('[role="textbox"]') ||
                el.closest('form') ||
                el.closest('[data-testid]') ||
                el.parentElement?.className.includes('input');

            if (rect.width > 100 && rect.height > 30 && hasInputLikeParent) {
                attachListeners(el);
            }
        });
    }

    // More aggressive observation for SPAs
    const observer = new MutationObserver(mutations => {
        let shouldCheck = false;

        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if new node contains input elements
                        if (
                            node.querySelector &&
                            (node.querySelector('[contenteditable="true"]') ||
                                node.querySelector('textarea') ||
                                node.querySelector('[role="textbox"]'))
                        ) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });

        if (shouldCheck) {
            // Small delay to ensure elements are fully rendered
            setTimeout(findAndAttach, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['contenteditable', 'role'],
    });

    // Initial run when the script loads
    setTimeout(findAndAttach, 500);

    // Also run on page focus (for navigation)
    window.addEventListener('focus', () => setTimeout(findAndAttach, 200));

    // Debug: Log when script loads
    console.log(
        'RTL Auto Direction Script loaded for:',
        window.location.hostname,
    );
})();
