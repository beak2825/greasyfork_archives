// ==UserScript==
// @name         Hide All Standings Links on Codeforces
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides all "Standings" links on Codeforces contest pages (both group and general standings).
// @author       joonyou
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538327/Hide%20All%20Standings%20Links%20on%20Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/538327/Hide%20All%20Standings%20Links%20on%20Codeforces.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hideStandingsLinks = () => {
        const links = document.querySelectorAll('a[href*="/standings"]');
        links.forEach(link => {
            if (link.textContent.trim() === "Standings") {
                link.style.display = 'none';
            }
        });
    };

    hideStandingsLinks();

    // Handle dynamic updates (e.g., SPA behavior on Codeforces)
    new MutationObserver(hideStandingsLinks).observe(document.body, {
        childList: true,
        subtree: true
    });
})();