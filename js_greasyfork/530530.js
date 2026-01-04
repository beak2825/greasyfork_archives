// ==UserScript==
// @name         Block gojo2.xyz Redirects
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Blocks redirects on gojo2.xyz without property overrides
// @author       You
// @match        https://gojo2.xyz/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530530/Block%20gojo2xyz%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/530530/Block%20gojo2xyz%20Redirects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script injected at document-start on", window.location.href);

    // Block navigation early
    window.addEventListener('beforeunload', function(e) {
        console.log("Navigation attempt detected to:", window.location.href);
        e.preventDefault();
        e.returnValue = '';
    }, { capture: true });

    // Block setTimeout/setInterval without redefining
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay) {
        if (typeof fn === 'function') {
            const fnStr = fn.toString();
            if (fnStr.includes('location') || fnStr.includes('redirect') || fnStr.includes('href')) {
                console.log("Blocked setTimeout redirect attempt:", fnStr);
                return null;
            }
        }
        return originalSetTimeout(fn, delay);
    };

    const originalSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
        if (typeof fn === 'function') {
            const fnStr = fn.toString();
            if (fnStr.includes('location') || fnStr.includes('redirect') || fnStr.includes('href')) {
                console.log("Blocked setInterval redirect attempt:", fnStr);
                return null;
            }
        }
        return originalSetInterval(fn, delay);
    };

    // Block meta refresh and scripts
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Meta tags
            const metaTags = document.querySelectorAll('meta[http-equiv="refresh"]');
            metaTags.forEach(tag => {
                console.log("Found meta refresh tag:", tag.content);
                tag.remove();
                console.log("Removed meta refresh tag");
            });
            // Scripts
            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.textContent.includes('location') || script.textContent.includes('redirect') || script.textContent.includes('href')) {
                    console.log("Blocked script with redirect potential:", script.textContent.slice(0, 50) + "...");
                    script.remove();
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    console.log("Mutation observer started at document-start");

    console.log("Redirect blocker fully active on", window.location.href);
})();