// ==UserScript==
// @name         Remove Disable Adblock Nag Screen on 1mov.lol 
// @version      1.5
// @description  Automatically removes the Disable Ads Blocker nag screen overlays on 1mov.lol
// @author       https://greasyfork.org/en/users/567951-stuart-saddler, but the overlay removal logic is based on the "Behind the Overlay" extension by NicolaeNMV (https://github.com/NicolaeNMV/BehindTheOverlay)
// @icon         https://1mov.lol/wp-content/uploads/2024/07/cropped-logo.png
// @match        https://1mov.lol/*
// @license      MIT
// @namespace    https://greasyfork.org/users/567951
// @downloadURL https://update.greasyfork.org/scripts/513207/Remove%20Disable%20Adblock%20Nag%20Screen%20on%201movlol.user.js
// @updateURL https://update.greasyfork.org/scripts/513207/Remove%20Disable%20Adblock%20Nag%20Screen%20on%201movlol.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to identify and remove overlays, excluding login-related elements and season/episode selectors
    function removeStubbornOverlays() {
        // Select all elements
        const elements = document.querySelectorAll('*');

        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const zIndex = parseInt(style.zIndex, 10);
            const textContent = element.textContent.toLowerCase();
            const className = element.className.toLowerCase();
            const id = element.id.toLowerCase();

            // Keywords to identify login-related elements to exclude
            const loginKeywords = ['login', 'sign in', 'register', 'sign up', 'sign out', 'logout'];

            // Keywords to identify season and episode dropdowns to exclude
            const seasonEpisodeKeywords = ['episodes', 'season', 'tv'];

            // Check if the element matches any login-related or season/episode keyword in its text, class, or ID
            const isLoginRelated = loginKeywords.some(keyword =>
                textContent.includes(keyword) || className.includes(keyword) || id.includes(keyword)
            );
            
            const isSeasonEpisodeRelated = seasonEpisodeKeywords.some(keyword =>
                textContent.includes(keyword) || className.includes(keyword) || id.includes(keyword)
            );

            // Remove overlays if they're not login-related or season/episode-related, and if position is fixed or absolute and z-index is high
            if ((style.position === 'fixed' || style.position === 'absolute') && zIndex > 999 && !isLoginRelated && !isSeasonEpisodeRelated) {
                element.remove();  // Remove the overlay
            }
        });

        // Additional removal of elements with overlay-specific IDs or classes, but still exclude login and season/episode elements
        const specificOverlays = ['#modal-overlay', '.modal-backdrop', '.popup-overlay', '#full-screen-overlay'];
        specificOverlays.forEach(selector => {
            const overlays = document.querySelectorAll(selector);
            overlays.forEach(overlay => {
                const textContent = overlay.textContent.toLowerCase();
                const className = overlay.className.toLowerCase();
                const id = overlay.id.toLowerCase();
                const isLoginRelated = loginKeywords.some(keyword =>
                    textContent.includes(keyword) || className.includes(keyword) || id.includes(keyword)
                );
                const isSeasonEpisodeRelated = seasonEpisodeKeywords.some(keyword =>
                    textContent.includes(keyword) || className.includes(keyword) || id.includes(keyword)
                );
                if (!isLoginRelated && !isSeasonEpisodeRelated) {
                    overlay.remove();
                }
            });
        });
    }

    // Initial removal of existing overlays
    removeStubbornOverlays();

    // Use MutationObserver to detect dynamically added overlays and remove them
    const observer = new MutationObserver(() => {
        removeStubbornOverlays();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
