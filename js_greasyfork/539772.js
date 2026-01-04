// ==UserScript==
// @name         Kick.com Auto Select 1080p60 Quality [2025 Working!]
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Tries full interaction: focus, pointer events, then click to open settings menu and select 1080p60 (or fallback) on kick.com. Restarts on URL change.
// @match        https://kick.com/*
// @author       Paradox109
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539772/Kickcom%20Auto%20Select%201080p60%20Quality%20%5B2025%20Working%21%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/539772/Kickcom%20Auto%20Select%201080p60%20Quality%20%5B2025%20Working%21%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const preferredQualities = ['1080p60', '720p60'];
    let currentHref = window.location.href;
    let mainInterval;

    function findCogButton() {
        const buttons = document.querySelectorAll('button[aria-haspopup="menu"]');
        for (const btn of buttons) {
            const svg = btn.querySelector('svg path');
            if (!svg) continue;
            const pathD = svg.getAttribute('d');
            if (!pathD) continue;
            if (pathD.startsWith('M25.7,17.3c0.1-0.4')) return btn;
        }
        return null;
    }

    function simulateFullClick(el) {
        if (!el) return;
        el.focus();
        ['pointerover', 'pointerenter', 'pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
            const event = new PointerEvent(type, {
                bubbles: true,
                cancelable: true,
                composed: true,
                pointerId: 1,
                pointerType: 'mouse',
                isPrimary: true,
            });
            el.dispatchEvent(event);
        });
        el.click(); // fallback
    }

    function selectQuality() {
        const items = document.querySelectorAll('[role="menuitemradio"]');
        if (items.length === 0) {
            console.log('Quality options not available yet.');
            return false;
        }
        for (const quality of preferredQualities) {
            const match = Array.from(items).find(item => item.textContent.trim() === quality);
            if (match) {
                console.log(`Selecting quality: ${quality}`);
                match.click();
                return true;
            }
        }
        return false;
    }

    function observeMenuAndSelect() {
        const menuContainer = document.querySelector('div[role="menu"]') || document.body;
        const observer = new MutationObserver((_, obs) => {
            if (selectQuality()) {
                console.log('Quality selected, disconnecting observer and stopping script.');
                obs.disconnect();
                clearInterval(mainInterval);
            }
        });
        observer.observe(menuContainer, { childList: true, subtree: true });
    }

    function trySelectQuality() {
        const cogButton = findCogButton();
        if (!cogButton) {
            console.log('Cog button not found yet.');
            return;
        }
        console.log('Cog button found, simulating full interaction click...');
        simulateFullClick(cogButton);
        observeMenuAndSelect();
    }

    function startScript() {
        clearInterval(mainInterval);
        mainInterval = setInterval(() => {
            trySelectQuality();
        }, 50);
    }

    // Start first run
    startScript();

    // Monitor URL change every 500ms
    setInterval(() => {
        if (window.location.href !== currentHref) {
            console.log('URL changed, restarting script...');
            currentHref = window.location.href;
            startScript();
        }
    }, 500);
})();
