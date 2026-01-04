// ==UserScript==
// @name         New Reddit for Everything but Post Pages
// @namespace    plennhar-new-reddit-for-everything-but-post-pages
// @version      3.5.1
// @description  Changes hrefs to old.reddit.com for all post and comment pages, and redirects to them if necessary.  Keeps all other pages as the default design.  For this script to work it requires that you NOT opt into old.reddit.com in preferences.
// @author       Plennhar
// @match        *://*.reddit.com/*
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/498893/New%20Reddit%20for%20Everything%20but%20Post%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/498893/New%20Reddit%20for%20Everything%20but%20Post%20Pages.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2025 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(function () {
    'use strict';

    const oldRedditPrefix = 'https://old.reddit.com';
    const newRedditPrefix = 'https://www.reddit.com';
    const redditDomainRe = /^https?:\/\/(?:www\.)?reddit\.com/;
    const videoLinkRe = /^https?:\/\/(?:www\.)?reddit\.com\/link\/[^/]+\/video\//;
    const pollLinkRe = /^https?:\/\/(?:www\.)?reddit\.com\/poll\//;

    const switchToNewButtonId = 'userscript-switch-to-new-reddit';
    const switchToOldLinkId = 'userscript-switch-to-old-reddit';

    function getForcedNewRedditUrl() {
        const url = new URL(location.href);
        url.protocol = 'https:';
        url.hostname = 'www.reddit.com';

        // Prevents redirectIfNecessary() from bouncing straight back to old.
        url.searchParams.set('new_reddit', 'true');

        return url.toString();
    }

    function getOldRedditUrl() {
        const url = new URL(location.href);
        url.protocol = 'https:';
        url.hostname = 'old.reddit.com';

        // If you arrived here via the "new reddit" button, don't keep forcing new.
        url.searchParams.delete('new_reddit');

        if (url.searchParams.get('utm_name') === 'GamesOnReddit') {
            url.searchParams.delete('utm_name');
        }
        if (url.searchParams.get('entry_point') === 'games_drawer_personalized_game') {
            url.searchParams.delete('entry_point');
        }

        return url.toString();
    }

    function findTabmenuForButton() {
        const tabmenus = Array.from(document.querySelectorAll('ul.tabmenu'));
        if (!tabmenus.length) return null;

        // Prefer the post-page tabmenu.
        const commentsMenu = tabmenus.find(ul =>
            Array.from(ul.querySelectorAll('a.choice')).some(a =>
                (a.textContent || '').trim().toLowerCase() === 'comments'
            )
        );

        return commentsMenu || tabmenus[0];
    }

    function ensureSwitchToNewRedditButton() {
        if (!location.hostname.startsWith('old.')) return;

        const tabmenu = findTabmenuForButton();
        if (!tabmenu) return;

        const existing = document.getElementById(switchToNewButtonId);
        if (existing) return;

        const li = document.createElement('li');
        li.id = switchToNewButtonId;

        // If RES (or other CSS) uses flex ordering, force this to the end.
        li.style.order = '9999';

        const a = document.createElement('a');
        a.className = 'choice';
        a.textContent = 'new reddit';
        a.title = 'Open this page on www.reddit.com';
        a.href = getForcedNewRedditUrl();

        li.appendChild(a);
        tabmenu.appendChild(li);
    }

    function findNewRedditTimeAgoElement() {
        const sep = document.getElementById('time-ago-separator');
        if (sep && sep.parentElement) {
            const timeago = sep.parentElement.querySelector('faceplate-timeago');
            if (timeago) return timeago;
        }

        const post = document.querySelector('shreddit-post');
        if (post) {
            const timeago = post.querySelector('faceplate-timeago');
            if (timeago) return timeago;
        }

        return null;
    }

    function ensureSwitchToOldRedditLink() {
        const onModern = location.hostname.endsWith('reddit.com') &&
            !location.hostname.startsWith('old.');
        if (!onModern) return;

        if (!location.pathname.includes('/comments/')) return;

        const existing = document.getElementById(switchToOldLinkId);
        if (existing) {
            existing.href = getOldRedditUrl();
            return;
        }

        const timeago = findNewRedditTimeAgoElement();
        if (!timeago) return;

        const a = document.createElement('a');
        a.id = switchToOldLinkId;
        a.textContent = 'old reddit';
        a.title = 'Open this page on old.reddit.com';
        a.href = getOldRedditUrl();
        a.style.color = 'inherit';
        a.style.fontSize = '12px';
        a.style.textDecoration = 'none';
        a.style.marginLeft = '0.5rem';

            timeago.insertAdjacentElement('afterend', a);
    }

    // Rewrite links so that post pages open on old Reddit, while everything else prefers new Reddit.
    function updateLinks() {
        ensureSwitchToNewRedditButton();
        ensureSwitchToOldRedditLink();

        document.querySelectorAll('a[href]').forEach(anchor => {
            const href = anchor.getAttribute('href');  // Skip anchors without an href.
            if (!href) return;

            // Fast flag checks to avoid repeated regexes later.
            const hasNewParam = href.includes('new_reddit=true');
            const isGamesUtm = href.includes('utm_name=GamesOnReddit');
            const isGamesEntry = href.includes('entry_point=games_drawer_personalized_game');
            const isComments = href.includes('/comments/');
            const isRelative = href.startsWith('/');
            const isModernAbs = redditDomainRe.test(href);
            const isOldAbs = href.startsWith(oldRedditPrefix);

            if (isComments && !hasNewParam && !isGamesUtm && !isGamesEntry) {  // For all post links land on the old Reddit equivalent (except for in-line video links).
                let oldUrl;
                if (isRelative) {
                    oldUrl = oldRedditPrefix + href;
                } else if (isModernAbs) {
                    oldUrl = href.replace(redditDomainRe, oldRedditPrefix);
                }
                if (oldUrl) anchor.setAttribute('href', oldUrl);
            }

            else {  // For all other links land on the new Reddit equivalent.
                let newUrl;
                if (isRelative && location.hostname.startsWith('old.')) {
                    newUrl = newRedditPrefix + href;
                } else if (isOldAbs) {
                    newUrl = href.replace(oldRedditPrefix, newRedditPrefix);
                }
                if (newUrl) anchor.setAttribute('href', newUrl);
            }

            // Preserve middle-click behaviour; hijack left-click to mimic normal in-page navigation (prevents some extensions/sites from opening extra tabs).
            if (!anchor.dataset.redditLinkHijack) {
                anchor.dataset.redditLinkHijack = '1';
                anchor.addEventListener('click', evt => {
                    if (evt.button === 1) return;  // If middle click then let the browser handle it.
                    if (evt.button === 0 && !anchor.target) {  // If left click then open in same-tab only.
                        evt.preventDefault();
                        location.href = anchor.href;
                    }
                });
            }
        });
    }

    // If the user lands on a new Reddit post page (not via a video-link or poll redirect and not explicitly forced), bounce them to the old Reddit equivalent.
    function redirectIfNecessary() {
        const onModern = location.hostname.endsWith('reddit.com') &&
            !location.hostname.startsWith('old.');
        const fromVideo = videoLinkRe.test(document.referrer);
        const fromPoll = pollLinkRe.test(document.referrer);
        const params = new URLSearchParams(location.search);
        const forcedNew = params.get('new_reddit') === 'true';
        const fromGamesUtm = params.get('utm_name') === 'GamesOnReddit';
        const fromGamesEntry = params.get('entry_point') === 'games_drawer_personalized_game';

        if (onModern &&
            location.pathname.includes('/comments/') &&
            !fromVideo &&
            !fromPoll &&
            !forcedNew &&
            !fromGamesUtm &&
            !fromGamesEntry) {
            const oldUrl = location.href.replace(redditDomainRe, oldRedditPrefix);
            location.replace(oldUrl);  // No history entry left behind.
        }
    }

    // Watch for dynamically injected content (stuff like infinite scroll).
    function observeDOMChanges() {
        const obs = new MutationObserver(updateLinks);
        obs.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        redirectIfNecessary();
        updateLinks();
        observeDOMChanges();
    });
})();