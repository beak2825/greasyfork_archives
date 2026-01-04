// ==UserScript==
// @name         Cyberpunk 2077 Official Map UI Cleanup
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides UI panels and overrides styles on the Cyberpunk 2077 Night City map page using MutationObserver and custom CSS.
// @author       Ihor Ovechko
// @match        https://maps.piggyback.com/cyberpunk-2077/maps/night-city
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545855/Cyberpunk%202077%20Official%20Map%20UI%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/545855/Cyberpunk%202077%20Official%20Map%20UI%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔧 Inject custom CSS to override styles
    const style = document.createElement('style');
    style.textContent = `
        .mb-10 {
            margin-bottom: 0 !important;
        }
        .leaflet-bottom {
            padding-bottom: 15px !important;
        }
    `;
    document.head.appendChild(style);
    console.log('Custom styles injected.');

    // 🧹 Helper to hide element by class selector
    function hideElementByClass(classSelector) {
        const el = document.querySelector(classSelector);
        if (el) {
            el.style.display = 'none';
            console.log(`Hid element: ${classSelector}`);
        }
    }

    // 🎯 Target class selectors (escaped where needed)
    const selectorsToHide = [
        '.bottom-0.left-0.z-10.flex.w-full.flex-col.items-end.justify-center.sm\\:flex-row.md\\:absolute.h-36.sm\\:h-16.overflow-hidden.relative',
        '.mb-20.flex.w-50.flex-col.items-start'
    ];

    // 🚀 Initial sweep
    selectorsToHide.forEach(hideElementByClass);

    // 🔄 MutationObserver for dynamic content
    const observer = new MutationObserver(() => {
        selectorsToHide.forEach(hideElementByClass);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('MutationObserver active and style overrides applied.');
})();