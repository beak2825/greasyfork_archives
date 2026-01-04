// ==UserScript==
// @name         WhatsApp Fullscreen Mode
// @version      2.4.4
// @description  Forces WhatsApp Web to fit proportionally in the browser window with proper scaling and positioning
// @author       Hikary
// @match        https://web.whatsapp.com/
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1349112
// @downloadURL https://update.greasyfork.org/scripts/517663/WhatsApp%20Fullscreen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/517663/WhatsApp%20Fullscreen%20Mode.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function applyStyles() {
        let styles = `
            body, html {
                margin: 0 !important;
                padding: 0 !important;
                height: 100vh !important;
                width: 100vw !important;
                overflow: hidden !important;
            }
            #app {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
            }
            .landing-wrapper {
                width: 100% !important;
                height: 100% !important;
            }
            div.app-wrapper-web {
                width: 100vw !important;
                height: 100vh !important;
                top: 0 !important;
                left: 0 !important;
                position: fixed !important;
                margin: 0 !important;
                padding: 0 !important;
                transform: none !important;
            }
            ._3jRbH {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
            }
            .two {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
            }
            .app-wrapper-web ._1XkO3 {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
            }
            .app-wrapper-web ._1jJ70 {
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
            }
            /* Remove any potential max-width constraints */
            [data-testid="chat-list"],
            [data-testid="conversation-panel-wrapper"],
            .app > div,
            #main,
            #app > div > div {
                max-width: none !important;
                width: 100% !important;
                height: 100% !important;
            }
        `;

        let styleSheet = document.getElementById('whatsapp-fullscreen-styles');
        if (!styleSheet) {
            styleSheet = document.createElement("style");
            styleSheet.id = 'whatsapp-fullscreen-styles';
            document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = styles;
    }

    function waitForWhatsApp() {
        let retries = 0;
        const maxRetries = 30;

        const checkForApp = setInterval(() => {
            const appWrapper = document.querySelector('div.app-wrapper-web');
            const loading = document.querySelector('div.loading-screen');

            if (appWrapper && !loading) {
                clearInterval(checkForApp);
                applyStyles();

                // Reapply styles after short delays to ensure they take effect
                setTimeout(applyStyles, 500);
                setTimeout(applyStyles, 1000);
                setTimeout(applyStyles, 2000);
            }

            retries++;
            if (retries >= maxRetries) {
                clearInterval(checkForApp);
            }
        }, 1000);
    }

    // Initial load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForWhatsApp);
    } else {
        waitForWhatsApp();
    }

    // Apply styles on any hash change (WhatsApp navigation)
    window.addEventListener('hashchange', applyStyles);

    // Apply styles on window resize
    window.addEventListener('resize', () => {
        applyStyles();
        // Reapply after a short delay to ensure it takes effect
        setTimeout(applyStyles, 100);
    });
})();