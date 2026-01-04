// ==UserScript==
// @name         YouTube Shorts: Disable Scrolling 
// @namespace    https://github.com/kuronekozero/youtube-shorts-disable-scrolling
// @version      0.2
// @description  Disables scrolling on YouTube Shorts 
// @icon         https://github.com/kuronekozero/youtube-shorts-disable-scrolling/blob/main/logo.webp
// @author       Timothy (kuronek0zero)
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520071/YouTube%20Shorts%3A%20Disable%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/520071/YouTube%20Shorts%3A%20Disable%20Scrolling.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to block events
    const blockEvent = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    };

    // Remove navigation buttons
    const removeNavButtons = () => {
        const navButtons = document.querySelectorAll(
            '#navigation-button-up, #navigation-button-down'
        );
        navButtons.forEach((btn) => {
            btn.remove();
            console.log("Removed:", btn.id);
        });
    };

    // Disable scrolling
    const disableScrolling = () => {
        console.log("Scroll Disabled");
        // Disable mouse, touch, and key scrolling
        document.addEventListener('wheel', blockEvent, { passive: false, capture: true });
        document.addEventListener('touchmove', blockEvent, { passive: false, capture: true });
        document.addEventListener('keydown', (e) => {
            const keysToBlock = [
                'ArrowUp', 'ArrowDown',
                'ArrowLeft', 'ArrowRight',
                'Space', 'PageUp', 'PageDown',
                'Home', 'End', 'Tab'
            ];
            if (keysToBlock.includes(e.code)) {
                blockEvent(e);
            }
        }, { passive: false, capture: true });

        // Disable scrollbar visibility
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    };

    // Restore scrolling
    const enableScrolling = () => {
        console.log("Scroll Restored");
        // Remove event listeners to restore scrolling
        document.removeEventListener('wheel', blockEvent, true);
        document.removeEventListener('touchmove', blockEvent, true);
        document.removeEventListener('keydown', blockEvent, true);

        // Reset scroll styles
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    };

    // Monitor URL changes
    const monitorURLChange = () => {
        let previousURL = window.location.href;

        const observer = new MutationObserver(() => {
            const currentURL = window.location.href;

            if (currentURL !== previousURL) {
                if (currentURL.includes('/shorts/')) {
                    console.log('Entered YouTube Shorts.');
                    disableScrolling();
                    removeNavButtons();  // Clean up navigation buttons
                } else {
                    console.log('Exited YouTube Shorts.');
                    enableScrolling();  // Restore scrolling on other pages
                }
                previousURL = currentURL;  // Update current URL
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Initial Check + Start Monitoring
    const initialize = () => {
        if (window.location.href.includes('/shorts/')) {
            disableScrolling();
            removeNavButtons();
        }
        monitorURLChange();  // Watch for page transitions
    };

    initialize();
})();