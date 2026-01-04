// ==UserScript==
// @name         Reddit Force Hot Sort (Global)
// @namespace    https://reddit.com/
// @version      1.2
// @description  Force Reddit to always use "hot" sort globally, including r/popular, r/all, all subreddits, and dynamic navigation (SPA). Works on both mobile and the Desktop! 
// @author       Ryan Noles
// @match        *://www.reddit.com/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538827/Reddit%20Force%20Hot%20Sort%20%28Global%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538827/Reddit%20Force%20Hot%20Sort%20%28Global%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const enforceHotSort = () => {
        const url = new URL(window.location.href);
        const pathname = url.pathname;

        // Skip the comment threads and user profiles
        if (pathname.match(/^\/r\/[^\/]+\/comments\//) || pathname.startsWith('/user/')) return;

        // Already sorted by hot? 
        if (pathname.includes('/hot')) return;

        let newPath;

        // Main homepage when site is accessed....
        if (pathname === '/' || pathname === '') {
            newPath = '/hot';
        }
        // r/popular or r/all subs
        else if (pathname === '/r/popular' || pathname === '/r/popular/') {
            newPath = '/r/popular/hot';
        }
        else if (pathname === '/r/all' || pathname === '/r/all/') {
            newPath = '/r/all/hot';
        }
        // Any other subreddit will also be applied 
        else {
            const match = pathname.match(/^\/r\/[^\/]+\/?$/);
            if (match) {
                newPath = pathname.replace(/\/$/, '') + '/hot';
            }
        }

        if (newPath) {
            const target = newPath + url.search;
            history.replaceState(null, '', target);
            location.reload(); // force page reload due to Reddit SPA
        }
    };

    const interceptSPA = () => {
        const _pushState = history.pushState;
        const _replaceState = history.replaceState;

        history.pushState = function () {
            _pushState.apply(this, arguments);
            setTimeout(enforceHotSort, 50);
        };

        history.replaceState = function () {
            _replaceState.apply(this, arguments);
            setTimeout(enforceHotSort, 50);
        };

        window.addEventListener('popstate', enforceHotSort);
    };

    interceptSPA();
    enforceHotSort();
})();