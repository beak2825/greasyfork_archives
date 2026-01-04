// ==UserScript==
// @name         YTS Mirror Cleaner with Toggle
// @namespace    https://github.com/YOUR_USERNAME/yts-cleaner
// @version      1.2
// @description  Remove all popups, overlays, and ads from YTS.mx and mirrors without breaking torrents. Includes on-page toggle to enable/disable cleanup.
// @author       ChatGPT + You
// @match        *://yts.mx/*
// @match        *://yts.rs/*
// @match        *://yts.pm/*
// @match        *://yifytorrent/*
// @match        *://yts.lt/*
// @match        *://yts.ag/*
// @icon         https://yts.mx/assets/images/website/logo-YTS.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537857/YTS%20Mirror%20Cleaner%20with%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/537857/YTS%20Mirror%20Cleaner%20with%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = true;

    const log = (...args) => console.log('[YTS Cleaner]', ...args);

    // Toggle Button UI
    function createToggle() {
        const toggle = document.createElement('div');
        toggle.id = 'yts-clean-toggle';
        toggle.textContent = '🧹 YTS Clean: ON';
        toggle.style.position = 'fixed';
        toggle.style.top = '10px';
        toggle.style.right = '10px';
        toggle.style.zIndex = 99999;
        toggle.style.background = '#0f0';
        toggle.style.color = '#000';
        toggle.style.padding = '5px 10px';
        toggle.style.borderRadius = '6px';
        toggle.style.fontSize = '14px';
        toggle.style.cursor = 'pointer';
        toggle.style.boxShadow = '0 0 5px #000';
        toggle.style.userSelect = 'none';

        toggle.addEventListener('click', () => {
            enabled = !enabled;
            toggle.textContent = enabled ? '🧹 YTS Clean: ON' : '🧹 YTS Clean: OFF';
            toggle.style.background = enabled ? '#0f0' : '#f00';
        });

        document.body.appendChild(toggle);
    }

    // Main blocker logic
    function cleanUpPage() {
        if (!enabled) return;

        const selectors = [
            'iframe[src*="ads"]',
            'iframe[src*="doubleclick"]',
            '.adsbox',
            '.ad-container',
            '#overlay',
            '.popupOverlay',
            '.underlay',
            'div[id^="popup"]',
            'div[class*="popup"]',
            'div[class*="ads"]',
            'div[onclick]',
            'body > div:not([id]):not([class])'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
                log('Removed:', sel);
            });
        });

        const divs = document.querySelectorAll('div');
        divs.forEach(el => {
            const style = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            if (style.position === 'fixed' && rect.width >= window.innerWidth && rect.height >= window.innerHeight && style.zIndex > 1000) {
                el.remove();
                log('Removed full overlay:', el);
            }
        });

        document.documentElement.style.pointerEvents = 'auto';
        document.body.style.pointerEvents = 'auto';
    }

    // Prevent hijack clicks
    function blockHijackClicks() {
        document.addEventListener('click', e => {
            if (!enabled) return;
            if (!e.target.closest('a')) {
                e.stopImmediatePropagation();
            }
        }, true);
    }

    // Block window.open entirely
    window.open = () => {
        if (!enabled) return;
        log('Blocked popup via window.open');
        return null;
    };

    // Setup
    function initCleaner() {
        createToggle();
        cleanUpPage();
        blockHijackClicks();

        setInterval(cleanUpPage, 1000);
        window.addEventListener('load', cleanUpPage);
        window.addEventListener('scroll', cleanUpPage);
    }

    initCleaner();
})();
