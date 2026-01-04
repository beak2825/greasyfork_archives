// ==UserScript==
// @name         Arcade Punks - Kill Adblock Overlay & Scroll Lock
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Nukes Google Funding Choices completely – no overlays, no scroll lock, no adblock nag, no mercy.
// @author       You
// @match        https://www.arcadepunks.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540652/Arcade%20Punks%20-%20Kill%20Adblock%20Overlay%20%20Scroll%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/540652/Arcade%20Punks%20-%20Kill%20Adblock%20Overlay%20%20Scroll%20Lock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Block ad-related APIs
    Object.defineProperty(window, 'fcSettings', { value: null, writable: false });
    Object.defineProperty(window, '__tcfapi', { value: () => {}, writable: false });
    Object.defineProperty(window, '__uspapi', { value: () => {}, writable: false });

    // Block known Funding Choices and AdSense scripts
    const blockedScriptSrcs = [
        'https://fundingchoicesmessages.google.com/',
        'https://pagead2.googlesyndication.com/'
    ];

    const blockScripts = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && node.src) {
                    blockedScriptSrcs.forEach(bad => {
                        if (node.src.includes(bad)) {
                            console.log('Blocked script:', node.src);
                            node.remove();
                        }
                    });
                }
            });
        });
    });

    blockScripts.observe(document.documentElement, { childList: true, subtree: true });

    // Kill overlays and unlock scrolling
    const obliterateOverlay = () => {
        const selectors = [
            '.fc-dialog-overlay',
            '.fc-dialog-container',
            '.fc-consent-root',
            '.fc-dialog',
            '.fc-ab-root',
            '#fc-focus-trap-pre-div',
            '#fc-focus-trap-post-div',
            '[id^="fc-consent-root"]',
            '#nEaWZEQVKinHfsN',
            '#RkugiDyPflsJS'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
                console.log('Removed element:', sel);
            });
        });

        // Restore scrolling
        ['html', 'body'].forEach(tag => {
            const el = document.querySelector(tag);
            if (el && el.style.overflow === 'hidden') {
                el.style.overflow = 'auto';
                console.log('Scroll restored on', tag);
            }
        });
    };

    // Run cleanup repeatedly for 30 seconds
    const interval = setInterval(obliterateOverlay, 300);
    setTimeout(() => clearInterval(interval), 30000);
})();
