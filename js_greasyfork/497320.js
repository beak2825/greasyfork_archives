// ==UserScript==
// @name         Disable Double Tap to Like on Instagram
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  Prevents accidental likes from Instagram's double-tap gesture. Disables double-tap to like feature while browsing images, reducing unintended interactions and giving users better control over their engagement activities.
// @author       Priesdelly
// @match        *://*.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497320/Disable%20Double%20Tap%20to%20Like%20on%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/497320/Disable%20Double%20Tap%20to%20Like%20on%20Instagram.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function preventDoubleTapToLike(event) {
        // Target images and other interactive elements where double-tap might trigger likes
        const target = event.target;
        if (target.tagName.toLowerCase() === 'img' ||
            target.closest('article') ||
            target.closest('[role="presentation"]')) {
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    }

    // Wait for DOM to be ready before adding listeners
    function initializeScript() {
        // Remove existing listeners if any (for script updates)
        document.removeEventListener('dblclick', preventDoubleTapToLike, true);

        // Add event listener with capture phase for better interception
        document.addEventListener('dblclick', preventDoubleTapToLike, true);

        // Also handle touch events for mobile devices
        document.addEventListener('touchend', function(event) {
            if (event.touches.length === 0 && event.changedTouches.length === 1) {
                const now = Date.now();
                const lastTap = this.lastTap || 0;

                if (now - lastTap < 300) { // Double tap detected
                    preventDoubleTapToLike(event);
                }
                this.lastTap = now;
            }
        }, true);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();