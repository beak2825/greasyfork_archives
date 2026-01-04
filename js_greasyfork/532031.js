// ==UserScript==
// @name         Chat Improvements
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chat improvements script
// @author       realwdpcker
// @match        pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532031/Chat%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/532031/Chat%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INPUT_SELECTOR = '#chat input[type="text"]';
    let lastInputValue = '';
    let clearTimer = null;

    function setupInputWatcher() {
        const input = document.querySelector(INPUT_SELECTOR);
        if (!input) return;

        function startClearTimer() {
            if (clearTimer) clearTimeout(clearTimer);
            clearTimer = setTimeout(() => {
                input.value = '';
                lastInputValue = '';
            }, 5000);
        }

        input.addEventListener('input', () => {
            lastInputValue = input.value;
            startClearTimer();
        });

        input.addEventListener('blur', () => {
            if (!input.value && lastInputValue) {
                input.value = lastInputValue;
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                setTimeout(() => {
                    input.value = '';
                    lastInputValue = '';
                    if (clearTimer) clearTimeout(clearTimer);
                }, 10);
            }
        });

        const form = input.closest('form');
        if (form) {
            form.addEventListener('submit', () => {
                lastInputValue = '';
                if (clearTimer) clearTimeout(clearTimer);
            });
        }
    }

    const observer = new MutationObserver(() => {
        const input = document.querySelector(INPUT_SELECTOR);
        if (input) {
            setupInputWatcher();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();