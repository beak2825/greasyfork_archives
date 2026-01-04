// ==UserScript==
// @name         Search Redirect & Tracking Cleaner
// @namespace    https://greasyfork.org/nl/users/1197317-opus-x
// @version      1.0
// @description  Bypass search engine click tracking and strip tracking parameters from URLs
// @author       Opus-X
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @match        *://*.duckduckgo.com/*
// @match        *://*.yahoo.com/*
// @match        *://*.ecosia.org/*
// @match        *://*.startpage.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545403/Search%20Redirect%20%20Tracking%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/545403/Search%20Redirect%20%20Tracking%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Full list of tracking parameters (marketing + click IDs)
    const trackingPatterns = [
        /^utm_(source|medium|campaign|term|content|id|source_platform|campaign_id|creative_format|marketing_tactic)$/i,
        /^gclid$/i, /^gclsrc$/i, /^dclid$/i,
        /^fbclid$/i, /^msclkid$/i, /^li_fat_id$/i,
        /^ttclid$/i, /^twclid$/i, /^yclid$/i,
        /^zanpid$/i, /^icid$/i
    ];

    function cleanURL(urlString) {
        try {
            const url = new URL(urlString);

            // Remove tracking parameters
            for (const key of [...url.searchParams.keys()]) {
                if (trackingPatterns.some(rx => rx.test(key))) {
                    url.searchParams.delete(key);
                }
            }

            return url.toString();
        } catch {
            return urlString;
        }
    }

    function bypassRedirect(href) {
        try {
            const u = new URL(href, location.origin);

            // Google
            if (u.hostname.match(/(^|\.)google\./) && u.pathname === '/url') {
                const target = u.searchParams.get('q') || u.searchParams.get('url');
                if (target) return cleanURL(target);
            }

            // Bing
            if (u.hostname.match(/(^|\.)bing\.com$/) && u.pathname.startsWith('/ck/a')) {
                const target = u.searchParams.get('u');
                if (target) return cleanURL(target);
            }

            // DuckDuckGo
            if (u.hostname.match(/(^|\.)duckduckgo\.com$/) && u.pathname === '/l/') {
                const target = u.searchParams.get('uddg');
                if (target) return cleanURL(decodeURIComponent(target));
            }

            // Startpage
            if (u.hostname.match(/(^|\.)startpage\.com$/) && u.pathname.startsWith('/sp/redirect')) {
                const target = u.searchParams.get('url');
                if (target) return cleanURL(target);
            }

            // Otherwise, just clean
            return cleanURL(href);
        } catch {
            return href;
        }
    }

    function processLink(a) {
        if (!(a instanceof HTMLAnchorElement)) return;
        if (!a.href) return;
        a.href = bypassRedirect(a.href);
    }

    function processAllLinks() {
        document.querySelectorAll('a[href]').forEach(processLink);
    }

    // Click interception to block JS-based trackers
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href]');
        if (!a) return;
        const newURL = bypassRedirect(a.href);
        if (newURL !== a.href) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = newURL;
        }
    }, true);

    // Observe for dynamically loaded results
    const observer = new MutationObserver(processAllLinks);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Process initial links
    document.addEventListener('DOMContentLoaded', processAllLinks);
})();