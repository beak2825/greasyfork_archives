// ==UserScript==
// @name         YouTube Classic UI Restorer (Trusted Types Safe)
// @namespace    x0t.youtubeuirevert
// @version      1.4.0
// @description  Reverts YouTube UI to classic layout with security compliance
// @author       HAMZA
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526246/YouTube%20Classic%20UI%20Restorer%20%28Trusted%20Types%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526246/YouTube%20Classic%20UI%20Restorer%20%28Trusted%20Types%20Safe%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================================
    // SAFE CSS INJECTION (Trusted Types compliant)
    // =============================================
    const cssStyles = `
        /* Player controls restoration */
        .ytp-chrome-bottom {
            width: calc(100% - 24px) !important;
            left: 12px !important;
        }
        .ytp-progress-bar-container {
            bottom: 49px !important;
        }
        .ytp-chrome-controls {
            padding: 0 12px !important;
        }
        
        /* Classic layout restoration */
        ytd-rich-grid-row {
            display: block !important;
        }
        #contents.ytd-rich-grid-row {
            justify-content: flex-start !important;
        }
        ytd-video-renderer {
            width: 300px !important;
            margin: 12px !important;
        }
        
        /* Hide new UI elements */
        ytd-enforcement-message-view-model,
        div[is-shared-heimdall] {
            display: none !important;
        }
    `;

    // Create and append style element safely
    const injectCSS = () => {
        if (document.head) {
            const style = document.createElement('style');
            style.textContent = cssStyles; // Safe method (uses textContent)
            document.head.appendChild(style);
            return true;
        }
        return false;
    };

    // Retry until successful (DOM might not be ready immediately)
    const cssInterval = setInterval(() => {
        if (injectCSS()) clearInterval(cssInterval);
    }, 100);

    // =============================================
    // EXPERIMENT FLAGS CONFIGURATION
    // =============================================
    const requiredFlags = {
        web_player_enable_featured_product_banner_exclusives_on_desktop: false,
        kevlar_watch_comments_ep_disable_theater: true,
        kevlar_watch_comments_panel_button: true,
        kevlar_watch_flexy_metadata_height: 136,
        kevlar_watch_grid: false,
        web_watch_theater_chat: false,
        // ... add other flags as needed
    };

    const configureFlags = () => {
        try {
            if (typeof ytcfg !== 'undefined' && ytcfg.get('EXPERIMENT_FLAGS')) {
                const currentFlags = ytcfg.get('EXPERIMENT_FLAGS');
                
                // Only update if needed to minimize DOM thrashing
                let needsUpdate = false;
                for (const [key, value] of Object.entries(requiredFlags)) {
                    if (currentFlags[key] !== value) {
                        currentFlags[key] = value;
                        needsUpdate = true;
                    }
                }

                if (needsUpdate) {
                    ytcfg.set('EXPERIMENT_FLAGS', currentFlags);
                }
            }
        } catch (e) {
            console.debug('[Classic UI] Flag configuration error:', e);
        }
    };

    // =============================================
    // MUTATION OBSERVER FOR DYNAMIC CONTENT
    // =============================================
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                configureFlags();
            }
        });
    });

    // =============================================
    // INITIALIZATION SEQUENCE
    // =============================================
    const initialize = () => {
        // Initial configuration
        configureFlags();

        // Set up periodic checks (less aggressive than 1s)
        const configInterval = setInterval(configureFlags, 3000);
        
        // Start observing document body
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(configInterval);
            observer.disconnect();
        });
    };

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();