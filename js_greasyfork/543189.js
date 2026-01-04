// ==UserScript==
// @name         Bypass best-links.org Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically bypass best-links.org redirect pages to the final URL
// @author       YourName
// @match        *://best-links.org/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543189/Bypass%20best-linksorg%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543189/Bypass%20best-linksorg%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper to wait until DOM is ready
    function onReady(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    onReady(() => {
        // Attempt 1: Look for meta refresh
        const meta = document.querySelector('meta[http-equiv="refresh"]');
        if (meta && meta.content.includes('url=')) {
            const url = meta.content.split('url=')[1];
            window.location.href = url;
            return;
        }

        // Attempt 2: Look for redirect links in buttons or anchor tags
        const possibleLinks = [...document.querySelectorAll('a, button')]
            .map(el => el.href || el.getAttribute('onclick'))
            .filter(href => href && href.includes('http'));

        if (possibleLinks.length > 0) {
            window.location.href = possibleLinks[0];
            return;
        }

        // Attempt 3: Look for scripts containing the final URL
        const scripts = [...document.scripts].map(s => s.textContent);
        for (const code of scripts) {
            const match = code.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
            if (match) {
                window.location.href = match[1];
                return;
            }
        }

        console.log('[Bypass Script] No redirect URL found on this page.');
    });
})();