// ==UserScript==
// @name        Floating Avatar Above Floating Footer
// @namespace    https://www.gaiaonline.com/profiles/jasska
// @version      1.4
// @author       Jasska
// @description Duplicates .oldavatar and positions it above floating footer
// @include     https://www.gaiaonline.com/*
// @exclude     https://www.gaiaonline.com/forum/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534109/Floating%20Avatar%20Above%20Floating%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/534109/Floating%20Avatar%20Above%20Floating%20Footer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - adjust these values as needed
    const config = {
        horizontalPosition: '10px',    // Distance from left/right edge
        verticalMargin: 0,             // Space between avatar and footer (px)
        updateThrottle: 100,           // Throttle position updates (ms)
        footerSelector: '#footer'      // Can use ID or '.floating-footer' if needed
    };

    let updateTimeout;

    function positionAvatar() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            const footer = document.querySelector(config.footerSelector);
            const clonedAvatar = document.getElementById('fixed-avatar');

            if (!footer || !clonedAvatar) return;

            // Get footer position and dimensions
            const footerRect = footer.getBoundingClientRect();
            const footerVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;

            if (footerVisible) {
                // Position above visible footer
                clonedAvatar.style.bottom = `${footerRect.height + config.verticalMargin}px`;
                clonedAvatar.style.display = '';
            } else {
                // If footer isn't visible, stick to bottom
                clonedAvatar.style.bottom = config.verticalMargin + 'px';
            }

            clonedAvatar.style.left = config.horizontalPosition;
        }, config.updateThrottle);
    }

    function init() {
        // Check if already injected
        if (document.getElementById('fixed-avatar')) return;

        const originalAvatar = document.querySelector('.oldavatar');
        if (!originalAvatar) {
            console.log('[Avatar Duplicator] No .oldavatar element found');
            return;
        }

        // Create clone
        const clonedAvatar = originalAvatar.cloneNode(true);
        clonedAvatar.id = 'fixed-avatar';

        // Style clone
        Object.assign(clonedAvatar.style, {
            position: 'fixed',
            left: config.horizontalPosition,
            zIndex: '9998',  // Just below footer (typically 9999)
            pointerEvents: 'none',
            transition: 'bottom 0.3s ease',
            width: '240px',
            height: '300px'
        });

        // set zoom
        clonedAvatar.style.setProperty('image-rendering', 'crisp-edges', 'important');
        clonedAvatar.style.setProperty('image-rendering', 'pixelated', 'important');

        document.body.appendChild(clonedAvatar);

        // Set up observers and listeners
        const resizeObserver = new ResizeObserver(positionAvatar);
        resizeObserver.observe(document.querySelector(config.footerSelector));

        window.addEventListener('resize', positionAvatar);
        window.addEventListener('scroll', positionAvatar);

        // Initial positioning
        positionAvatar();

        console.log('[Avatar Duplicator] Successfully initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();