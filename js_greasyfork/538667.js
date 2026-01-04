// ==UserScript==
// @name         Grok Private By Default
// @namespace    nisc
// @version      2025.06.08-A
// @description  Automatically redirects to private chat on grok.com when on '/' or '/chat' without '#private'
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538667/Grok%20Private%20By%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/538667/Grok%20Private%20By%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Configuration object containing all constants used in the script
     * - URL paths and hashes that trigger redirect
     * - Target URL for private chat
     * - URL parameters to check
     */
    const CONFIG = {
        PATHS: {
            ROOT: '/',
            CHAT: '/chat'
        },
        HASHES: {
            PRIVATE: '#private'
        },
        PARAMS: {
            SESSION: '_s' // Session parameter that prevents redirect
        },
        TARGET_URL: 'https://grok.com/chat#private'
    };

    // Get current URL components
    const path = window.location.pathname;
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);

    /**
     * Redirect to private chat if:
     * 1. No active session parameter exists (_s)
     * 2. AND either:
     *    - Current path is root (/)
     *    - OR current path is /chat without #private hash
     */
    if (!searchParams.has(CONFIG.PARAMS.SESSION) &&
        (path === CONFIG.PATHS.ROOT ||
         (path === CONFIG.PATHS.CHAT && hash !== CONFIG.HASHES.PRIVATE))) {
        window.location.href = CONFIG.TARGET_URL;
    }
})();