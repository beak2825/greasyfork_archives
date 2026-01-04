// ==UserScript==
// @name         Reddit Tab Icons & Title Prefix
// @namespace https://github.com/sinazadeh/userscripts
// @version      1.3.6
// @description  Adds subreddit icons to Reddit tabs and prefixes the tab title with r/SubredditName for easier tab identification and navigation.
// @author       TheSina
// @match        https://*.reddit.com/*
// @exclude      https://*.reddit.com/account/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540946/Reddit%20Tab%20Icons%20%20Title%20Prefix.user.js
// @updateURL https://update.greasyfork.org/scripts/540946/Reddit%20Tab%20Icons%20%20Title%20Prefix.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
(function () {
    'use strict';

    // --- Configuration ---
    const DEBUG = false;
    const SPECIAL_SUBS = new Set(['all', 'friends', 'popular']);
    const SUBRE_PATH = /^\/r\/([^\/]+)/;
    const CACHE_TTL = 24 * 3600 * 1000; // 24h
    const DEBOUNCE_ICON = 50; // ms
    const DEBOUNCE_TITLE = 50; // ms
    const POLL_INTERVAL = 2000; // ms

    // --- Logging ---
    const LOG = (...args) => {
        if (DEBUG) console.log('[RTU]', ...args);
    };

    // --- State ---
    let iconEls = [],
        originalIcon = null,
        iconCache = new Map(),
        lastHref = location.href;

    // --- Init ---
    function init() {
        // grab/create favicon element
        iconEls = Array.from(document.querySelectorAll('link[rel*="icon"]'));
        if (!iconEls.length) {
            const link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.head.appendChild(link);
            iconEls = [link];
        }
        originalIcon = iconEls[0].href;

        // Hook SPA nav & polling
        hookHistory();
        window.addEventListener('popstate', onNav);
        setInterval(() => {
            if (location.href !== lastHref) {
                lastHref = location.href;
                onNav();
            }
        }, POLL_INTERVAL);

        // **Watch the <title> node** for any changes
        const titleNode = document.head.querySelector('title');
        if (titleNode) {
            new MutationObserver(debounce(updateTitle, DEBOUNCE_TITLE)).observe(
                titleNode,
                {childList: true, characterData: true, subtree: true},
            );
        }

        onNav();
    }

    // --- Helpers ---
    function getSub() {
        const m = SUBRE_PATH.exec(location.pathname);
        return m ? m[1] : null;
    }
    function setFavicon(url) {
        iconEls.forEach(el => (el.href = url));
    }
    function resetFavicon() {
        setFavicon(originalIcon);
    }

    // Fast + background favicon
    const updateFavicon = debounce(async () => {
        const sub = getSub();
        if (!sub || SPECIAL_SUBS.has(sub)) {
            resetFavicon();
            return;
        }

        // 1) quick switch via /favicon.ico
        const quick = `https://www.reddit.com/r/${sub}/favicon.ico`;
        setFavicon(quick);
        LOG('Quick icon:', quick);

        // 2) cached?
        const now = Date.now(),
            cached = iconCache.get(sub);
        if (cached && now - cached.ts < CACHE_TTL) {
            setFavicon(cached.url);
            return;
        }

        // 3) fetch “proper” community_icon
        try {
            const res = await fetch(
                `https://www.reddit.com/r/${sub}/about.json?raw_json=1`,
            );
            const js = await res.json();
            const d = js.data || {};
            const url =
                decodeHTML(d.community_icon) ||
                d.icon_img ||
                d.header_img ||
                quick;
            iconCache.set(sub, {url, ts: now});
            setFavicon(url);
            LOG('Fetched icon:', url);
        } catch (e) {
            LOG('Fetch failed, keeping quick icon');
        }
    }, DEBOUNCE_ICON);

    function decodeHTML(str) {
        const ta =
            decodeHTML._ta ||
            (decodeHTML._ta = document.createElement('textarea'));
        ta.innerHTML = str || '';
        return ta.value;
    }

    // Update the document.title with no gaps
    function updateTitle() {
        const sub = getSub();
        if (!sub) return;
        const prefix = `r/${sub} - `;
        const cur = document.title;
        // strip old prefix if present
        const raw = cur.startsWith(prefix) ? cur.slice(prefix.length) : cur;
        const next = prefix + raw;
        if (cur !== next) {
            document.title = next;
            LOG('Title set to', next);
        }
    }

    function onNav() {
        updateFavicon();
        updateTitle();
    }

    function hookHistory() {
        const push = history.pushState,
            rep = history.replaceState;
        history.pushState = function () {
            push.apply(this, arguments);
            onNav();
        };
        history.replaceState = function () {
            rep.apply(this, arguments);
            onNav();
        };
    }

    // --- debounce util ---
    function debounce(fn, ms) {
        let t;
        return function (...a) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, a), ms);
        };
    }

    // --- Start ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
