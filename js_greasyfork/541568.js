// ==UserScript==
// @name         Reddit → Old Reddit Redirector
// @version      1.0
// @description  Redirect all reddit.com pages and links to old.reddit.com
// @match        *://*.reddit.com/*
// @author        Mane
// @license      CC0-1.0
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/541568/Reddit%20%E2%86%92%20Old%20Reddit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/541568/Reddit%20%E2%86%92%20Old%20Reddit%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper: if URL belongs to reddit.com (but not old.reddit.com), return rewritten URL
    function toOldReddit(url) {
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();
            if (
                (host === 'reddit.com' ||
                 host === 'www.reddit.com' ||
                 host === 'new.reddit.com' ||
                 (host.endsWith('.reddit.com') && !host.startsWith('old.')))
            ) {
                u.hostname = 'old.reddit.com';
                return u.href;
            }
        } catch (err) {
            return null;
        }
        return null;
    }

    // 1. Redirect current page on load
    const rewritten = toOldReddit(window.location.href);
    if (rewritten) {
        window.location.replace(rewritten);
        return;
    }

    // 2. Intercept all clicks on <a> tags pointing to reddit.com
    document.addEventListener('click', function(event) {
        const anchor = event.target.closest('a[href]');
        if (!anchor) return;

        const newHref = toOldReddit(anchor.href);
        if (newHref) {
            event.preventDefault();
            window.location.href = newHref;
        }
    }, true);
})();
