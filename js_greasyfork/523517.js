// ==UserScript==
// @name         ChatGPT Scroll Fix 1
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fix scroll issues on ChatGPT for Safari iOS 15/16
// @author       0xkuj
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523517/ChatGPT%20Scroll%20Fix%201.user.js
// @updateURL https://update.greasyfork.org/scripts/523517/ChatGPT%20Scroll%20Fix%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Allow scrolling on all possible containers
    const elements = [
        document.documentElement,
        document.body,
        document.querySelector('main'),
        document.querySelector('.overflow-hidden'),
        document.querySelector('[role="presentation"]'),
        ...document.querySelectorAll('.overflow-hidden'),
        ...document.querySelectorAll('[style*="overflow: hidden"]'),
        ...document.querySelectorAll('[style*="position: fixed"]')
    ];

    elements.forEach(el => {
        if (el) {
            el.style.cssText = `
                overflow: auto !important;
                position: relative !important;
                height: auto !important;
                max-height: none !important;
                overscroll-behavior: auto !important;
                -webkit-overflow-scrolling: touch !important;
            `;
        }
    });

    // Force layout recalculation
    window.dispatchEvent(new Event('resize'));

    // Remove any classes that might block scrolling
    document.querySelectorAll('*').forEach(el => {
        if (el.classList.contains('overflow-hidden')) {
            el.classList.remove('overflow-hidden');
        }
    });
})();
