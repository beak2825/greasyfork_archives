// ==UserScript==
// @name         Persistent Auto-Click "Continue" on UpLearn
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Continuously simulates user click on UpLearn's "Continue" button across multiple lessons/pages in SPA environment like React (no full reloads needed). 🧠✨
// @author       JustSimplyDnaie
// @match        *://*.uplearn.co.uk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531936/Persistent%20Auto-Click%20%22Continue%22%20on%20UpLearn.user.js
// @updateURL https://update.greasyfork.org/scripts/531936/Persistent%20Auto-Click%20%22Continue%22%20on%20UpLearn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_SELECTOR = 'button[type="submit"]';
    const OBSERVER_DELAY = 500; // How often to check DOM changes
    let clickedRecently = false;

    function simulateClick(element) {
        console.log('[Auto-Click] Simulating click on "Continue"...');
        const mouseEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        element.dispatchEvent(mouseEvent);
        clickedRecently = true;

        setTimeout(() => {
            clickedRecently = false;
        }, 3000); // prevent double-clicking during countdown transitions
    }

    function tryClickContinue() {
        if (clickedRecently) return;

        const buttons = document.querySelectorAll(BUTTON_SELECTOR);
        for (const btn of buttons) {
            if (btn.textContent.trim().toLowerCase() === 'continue') {
                console.log('[Auto-Click] Found "Continue" button. Clicking...');
                simulateClick(btn);
                break;
            }
        }
    }

    // Setup MutationObserver to detect dynamic content changes
    const observer = new MutationObserver(() => {
        tryClickContinue();
    });

    window.addEventListener('load', () => {
        console.log('[Auto-Click] Loaded. Watching for DOM changes...');
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial check in case button already present
        setTimeout(tryClickContinue, 1000);
    });
})();
