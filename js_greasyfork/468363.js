// ==UserScript==
// @name         Redirect YouTube Shorts to Watch
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Redirect /shorts to /watch
// @author       CY Fung
// @license      MIT
// @run-at       document-start
// @match        https://*.youtube.com/*
// @match        http://*.youtube.com/*
// @match        https://youtube.com/*
// @match        http://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @unwrap
// @noframes
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/468363/Redirect%20YouTube%20Shorts%20to%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/468363/Redirect%20YouTube%20Shorts%20to%20Watch.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastPathname = '';
    let lastId = '';

    let lastRedirection = '';
    let lastRedirectionCache = sessionStorage.getItem('v5Nmolo6');
    if (typeof lastRedirectionCache === 'string') {
        let s = lastRedirectionCache.split('|');
        if (s.length === 2) {
            let lastRedirectionTime = +s[1];
            if (Date.now() - lastRedirectionTime < 2300) {
                lastRedirection = s[0];
            }
        }
    }

    /**
     *
     * @param {Event?} evt
     */
    function checkRedirect(evt) {
        let pathname = location.pathname;
        if (lastPathname !== pathname) {
            let id = '';
            if (pathname && pathname.startsWith('/shorts')) {
                let m = /\/shorts\/([\w\-\_\+\=]+)/.exec(pathname)
                if (m) {
                    id = m[1];
                }
            }
            lastPathname = pathname;
            lastId = id;
        }
        let id = lastId;
        if (id) {
            if (evt) {
                evt.stopPropagation();
                evt.stopImmediatePropagation();
            }
            if (lastRedirection !== id) {
                lastRedirection = id;
                sessionStorage.setItem('v5Nmolo6', id + '|' + Date.now());
                location.replace('/watch?v=' + id);
            }
        }
    }

    for (const s of ['yt-navigate', 'yt-navigate-start', 'yt-page-data-fetched', 'yt-page-data-updated', 'yt-navigate-finish']) {
        document.addEventListener(s, checkRedirect, true);
    }
    checkRedirect();


    // Your code here...
})();