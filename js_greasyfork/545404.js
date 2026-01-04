// ==UserScript==
// @name         Universal Tracking Cleaner & Redirect Bypass
// @namespace    https://greasyfork.org/nl/users/1197317-opus-x
// @version      1.0
// @description  Remove tracking parameters from all links and bypass common search engine redirects everywhere
// @author       Opus-X
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545404/Universal%20Tracking%20Cleaner%20%20Redirect%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/545404/Universal%20Tracking%20Cleaner%20%20Redirect%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tracking parameters regex list (common marketing + click IDs)
    const trackingPatterns = [
        /^utm_(source|medium|campaign|term|content|id|source_platform|campaign_id|creative_format|marketing_tactic)$/i,
        /^gclid$/i, /^gclsrc$/i, /^dclid$/i,
        /^fbclid$/i, /^msclkid$/i, /^li_fat_id$/i,
        /^ttclid$/i, /^twclid$/i, /^yclid$/i,
        /^zanpid$/i, /^icid$/i
    ];

    // Known redirect domains and how to extract target URL param
    // We cover Google, Bing, DuckDuckGo, Startpage, Yahoo
    const redirectRules = [
        { hostRegex: /(^|\.)google\./i, path: '/url', param: ['q','url'] },
        { hostRegex: /(^|\.)bing\.com$/i, pathPrefix: '/ck/a', param: ['u'] },
        { hostRegex: /(^|\.)duckduckgo\.com$/i, path: '/l/', param: ['uddg'] },
        { hostRegex: /(^|\.)startpage\.com$/i, pathPrefix: '/sp/redirect', param: ['url'] },
        { hostRegex: /(^|\.)yahoo\.com$/i, pathPrefix: '/clk', param: ['u'] },
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

            for (const rule of redirectRules) {
                if (rule.hostRegex.test(u.hostname)) {
                    if (rule.path && u.pathname === rule.path) {
                        for (const p of rule.param) {
                            const target = u.searchParams.get(p);
                            if (target) {
                                return cleanURL(decodeURIComponent(target));
                            }
                        }
                    }
                    if (rule.pathPrefix && u.pathname.startsWith(rule.pathPrefix)) {
                        for (const p of rule.param) {
                            const target = u.searchParams.get(p);
                            if (target) {
                                return cleanURL(decodeURIComponent(target));
                            }
                        }
                    }
                }
            }
            // If no redirect pattern matched, just clean params
            return cleanURL(href);
        } catch {
            return href;
        }
    }

    function processLink(a) {
        if (!(a instanceof HTMLAnchorElement)) return;
        if (!a.href) return;

        const newHref = bypassRedirect(a.href);
        if (newHref !== a.href) {
            a.href = newHref;
        }
    }

    function processAllLinks() {
        document.querySelectorAll('a[href]').forEach(processLink);
    }

    // Intercept clicks to bypass JS redirect handlers
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

    // Mutation observer for dynamic content (infinite scroll etc)
    const observer = new MutationObserver(processAllLinks);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial link cleaning on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAllLinks);
    } else {
        processAllLinks();
    }
})();
