// ==UserScript==
// @name         Automatic Vencord Loader & Tracker Blocker
// @namespace    http://example.com/
// @version      1.1
// @description  Automatically loads Vencord on Discord and blocks select trackers to enhance privacy (does not hide IP)
// @license      MIT
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531868/Automatic%20Vencord%20Loader%20%20Tracker%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/531868/Automatic%20Vencord%20Loader%20%20Tracker%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /********************
     * Tracker Blocking *
     ********************/
    // Override fetch to block requests to analytics/tracker endpoints.
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
        if (url && /discord(app)?\.com\/(api\/v\d+\/analytics|.*\/track)/i.test(url)) {
            console.log('[Tracker Blocker] Blocked fetch to:', url);
            return Promise.resolve(new Response('', { status: 204 }));
        }
        return originalFetch(input, init);
    };

    // Override XMLHttpRequest to block tracker requests.
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url && /discord(app)?\.com\/(api\/v\d+\/analytics|.*\/track)/i.test(url)) {
            console.log('[Tracker Blocker] Blocked XMLHttpRequest to:', url);
            this.send = function() {
                this.readyState = 4;
                this.status = 204;
                if (typeof this.onreadystatechange === 'function') {
                    this.onreadystatechange();
                }
            };
            return;
        }
        return originalXHROpen.apply(this, arguments);
    };

    /********************
     * Vencord Injection *
     ********************/
    // Function to inject the Vencord script.
    function injectVencord() {
        console.log('Injecting Vencord...');
        const script = document.createElement('script');
        // Ensure this URL points to a current copy of the Vencord browser script.
        script.src = 'https://raw.githubusercontent.com/Vendicated/Vencord/main/browser/vencord.js';
        script.onload = function() {
            console.log('Vencord loaded successfully.');
            this.remove();
        };
        script.onerror = function(e) {
            console.error('Failed to load Vencord:', e);
        };
        (document.head || document.documentElement).appendChild(script);
    }

    // Wait for a stable Discord UI to be present.
    function waitForDiscordUI(callback) {
        const checkInterval = 1000;
        const maxAttempts = 30;
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            // Check for the presence of the chat textbox as an indicator of a loaded UI.
            if (document.querySelector('[role="textbox"]')) {
                clearInterval(interval);
                console.log('Discord UI detected.');
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.warn('Discord UI not detected after several attempts; injecting Vencord anyway.');
                callback();
            }
        }, checkInterval);
    }

    // Automatically inject Vencord once Discord UI is ready.
    waitForDiscordUI(injectVencord);
})();
