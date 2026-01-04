// ==UserScript==
// @name         Hide Claude menu-side-panel
// @namespace    Tampermonkey Scripts
// @version      0.1
// @description  Hide a specific div when the mouse is not hovering over it
// @match        https://claude.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511076/Hide%20Claude%20menu-side-panel.user.js
// @updateURL https://update.greasyfork.org/scripts/511076/Hide%20Claude%20menu-side-panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideDiv(div) {
        div.style.width = '18rem';
        div.style.transform = 'translateX(-25%) translateZ(0px)';
        div.style.opacity = '0';
    }

    function showDiv(div) {
        div.style.width = '';
        div.style.transform = '';
        div.style.opacity = '';
    }

    function setupDivBehavior() {
        const div = document.querySelector('.from-bg-300\\/70.to-bg-400\\/70.border-r-0\\.5.border-border-300.absolute.left-0.overflow-hidden');
        
        if (div) {
            div.addEventListener('mouseenter', () => showDiv(div));
            div.addEventListener('mouseleave', () => hideDiv(div));
            
            // Initially hide the div
            hideDiv(div);
        }
    }

    // Run the setup when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDivBehavior);
    } else {
        setupDivBehavior();
    }

    // Optional: Re-run setup on significant DOM changes
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                setupDivBehavior();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();