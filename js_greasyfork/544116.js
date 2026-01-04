// ==UserScript==
// @name        AI Chat RTL-LTR Fixer (Persian/English)
// @namespace   http://tampermonkey.net/
// @version     1.6
// @description Automatically and dynamically sets the correct text direction (RTL/LTR) for Persian and English text, including headings, lists, tables, and input fields, in AI chat interfaces without needing a refresh.
// @description:fa  جهت نوشتار فارسی و انگلیسی را به صورت کاملاً پویا و زنده در محیط چت‌بات‌های هوش مصنوعی (مثل ChatGPT، Gemini و...) اصلاح می‌کند. شامل اصلاح سرتیترها، لیست‌ها، جدول‌ها و کادرهای ورودی متن بدون نیاز به رفرش.
// @author      Your Name
// @match       *://*/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/544116/AI%20Chat%20RTL-LTR%20Fixer%20%28PersianEnglish%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544116/AI%20Chat%20RTL-LTR%20Fixer%20%28PersianEnglish%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Regex to detect Persian (Arabic script) characters.
    const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

    // --- Function to Fix Direction for Standard Elements ---
    function fixDirection(element) {
        if (!element || element.nodeType !== 1 || element.isContentEditable) {
            return;
        }

        if (element.matches('pre, code, kbd, samp')) {
            element.style.direction = 'ltr';
            element.style.textAlign = 'left';
            return;
        }

        const hasPersian = persianRegex.test(element.textContent);

        if (element.matches('p, li, h1, h2, h3, h4, h5, h6, blockquote, table, th, td, div, span')) {
            if (hasPersian) {
                if (element.style.direction !== 'rtl') {
                    element.style.direction = 'rtl';
                    element.style.textAlign = 'right';
                }
            } else {
                if (!element.querySelector('[style*="direction: rtl"]')) {
                    if (element.style.direction !== 'ltr') {
                        element.style.direction = 'ltr';
                        element.style.textAlign = 'left';
                    }
                }
            }
        }
    }

    // --- Function to Fix Direction for Input/Textarea Elements ---
    function fixInputDirection(inputElement) {
        const isEditable = inputElement.isContentEditable;
        const value = isEditable ? inputElement.textContent : inputElement.value;

        if (typeof value === 'undefined') return;

        const hasPersian = persianRegex.test(value);

        if (hasPersian) {
            if (inputElement.style.direction !== 'rtl') {
                inputElement.style.direction = 'rtl';
                inputElement.style.textAlign = 'right';
            }
        } else {
            if (inputElement.style.direction !== 'ltr') {
                inputElement.style.direction = 'ltr';
                inputElement.style.textAlign = 'left';
            }
        }
    }

    // --- Function to Scan the Document and Set Up Listeners ---
    function scanAndFixAll() {
        const contentSelectors = 'p, div, span, li, ol, ul, blockquote, table, th, td, h1, h2, h3, h4, h5, h6';
        document.querySelectorAll(contentSelectors).forEach(fixDirection);

        const inputSelectors = 'textarea, input[type="text"], input[type="search"], input:not([type]), [contenteditable="true"]';
        document.querySelectorAll(inputSelectors).forEach(input => {
            if (!input.dataset.rtlFixerAttached) {
                fixInputDirection(input);
                input.addEventListener('input', () => fixInputDirection(input));
                input.dataset.rtlFixerAttached = 'true';
            }
        });
    }

    // --- MutationObserver to Handle Dynamic Content ---
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Case 1: New nodes are added
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        fixDirection(node);
                        node.querySelectorAll('*').forEach(fixDirection);
                    }
                });
            }
            // Case 2: Text content of an existing node changes
            else if (mutation.type === 'characterData') {
                if (mutation.target.parentElement) {
                    fixDirection(mutation.target.parentElement);
                }
            }
        });
    });

    // --- Start the Script ---
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true // IMPORTANT: This watches for text changes
    });

    // Run initial scans to handle content present on load
    scanAndFixAll();
    setTimeout(scanAndFixAll, 500); // For apps that render content after initial load

    console.log('AI Chat RTL Fixer v1.6 (Dynamic) is active.');
})();
