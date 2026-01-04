// ==UserScript==
// @name         Cleaner Rugplay
// @namespace    http://ayaangrover.is-a.dev
// @version      1.2.0
// @description  Hides Hopium, Gambling, About, and Leaderboard buttons from RugPlay sidebar UI and redirects those pages to homepage
// @author       Ayaan Grover
// @license      none
// @supportURL   none
// @match        https://rugplay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540262/Cleaner%20Rugplay.user.js
// @updateURL https://update.greasyfork.org/scripts/540262/Cleaner%20Rugplay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targets = ['/hopium', '/gambling', '/about', '/leaderboard'];

    function hideSidebarLinks() {
        document.querySelectorAll('a[href]').forEach(a => {
            if (targets.includes(a.getAttribute('href'))) {
                a.style.display = 'none';
            }
        });
    }

    function redirectIfTargetPage() {
        if (targets.includes(window.location.pathname)) {
            window.location.href = '/';
        }
    }

    // Run once and again when DOM updates
    const observer = new MutationObserver(hideSidebarLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    hideSidebarLinks();
    redirectIfTargetPage();
})();