// ==UserScript==
// @name         Block Most Redirects (Simple)
// @namespace    https://github.com/osuobiem
// @version      1.5
// @description  Quietly block most redirects used by ad-heavy streaming sites (movieshd.watch, etc.) without breaking main page.
// @author       Gabriel Osuobiem
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545877/Block%20Most%20Redirects%20%28Simple%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545877/Block%20Most%20Redirects%20%28Simple%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.debug('[NoRedirect]', ...args);

    // Block window.open popups (ads)
    window.open = () => {
        log('Blocked window.open');
        return null;
    };

    // Block common location changes
    ['assign', 'replace', 'reload'].forEach(method => {
        try {
            const orig = window.location[method].bind(window.location);
            window.location[method] = (...args) => {
                log(`Blocked location.${method}`, args[0]);
            };
        } catch (_) {}
    });

    // Block direct location set
    try {
        Object.defineProperty(window, 'location', {
            set: (url) => log('Blocked direct location set to', url),
            get: () => document.location
        });
    } catch (_) {}

    // Remove meta refresh tags (initial and added later)
    const removeMeta = () => {
        document.querySelectorAll('meta[http-equiv="refresh"]').forEach(m => {
            log('Removed meta refresh', m.content);
            m.remove();
        });
    };
    new MutationObserver(removeMeta).observe(document.documentElement, { childList: true, subtree: true });
    removeMeta();

    // Block ad link clicks that cause immediate redirect
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href]');
        if (!a) return;
        if (!a.href.startsWith(window.location.origin)) {
            e.preventDefault();
            log('Blocked external link click', a.href);
        }
    }, true);

    log('Simple redirect blocking active.');
})();