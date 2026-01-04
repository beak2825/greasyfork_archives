// ==UserScript==
// @name         Pardus Shadowban - Forum
// @license MIT
// @namespace    https://pardus.at/
// @version      1.01
// @description  Hide posts, quotes, threads from blocked users, and optionally remove Off Topic forum.
// @author       Solarix
// @match        https://forum.pardus.at/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543987/Pardus%20Shadowban%20-%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/543987/Pardus%20Shadowban%20-%20Forum.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === SETTINGS ===
    const hideOffTopicForum = false;
    const blockedUsers = ['Jinx','Artie','Rabid Duck','Hired Gun','InsertNameHere']; // case-insensitive usernames

    const isBlocked = (name) =>
        blockedUsers.some(blocked => name.trim().toLowerCase() === blocked.toLowerCase());

    const containsQuoteFromBlockedUser = (html) =>
        blockedUsers.some(blocked =>
            html.includes(`${blocked} @`) || html.includes(`>${blocked} wrote:`)
        );

    // === 1. Hide posts by blocked users or quotes from them ===
    if (window.location.href.includes('showtopic=')) {
        document.querySelectorAll('table').forEach((table) => {
            try {
                const nameCell = table.querySelector('span.normalname > a');
                const postDiv = table.querySelector('div.postcolor');

                if ((nameCell && isBlocked(nameCell.textContent)) ||
                    (postDiv && containsQuoteFromBlockedUser(postDiv.innerHTML))) {
                    table.style.display = 'none';
                }
            } catch (e) {
                console.warn('Post hiding error:', e);
            }
        });
    }

    // === 2. Hide thread rows started by blocked users ===
    if (window.location.href.includes('act=SF') || window.location.href.includes('showforum=')) {
        document.querySelectorAll('table > tbody > tr').forEach(row => {
            const starterCell = row.querySelectorAll('td')[3];
            const starterLink = starterCell?.querySelector('a');
            if (starterLink && isBlocked(starterLink.textContent)) {
                row.style.display = 'none';
            }
        });
    }

    // === 3. Hide Off Topic forum from index ===
    if (hideOffTopicForum) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const isSearchScreen = urlParams.has('act') && urlParams.get('act') === 'Search';

        const topicLinkEls = document.querySelectorAll('.row4 a');
        for (let loop = 0; loop < topicLinkEls.length; loop++) {
            if (topicLinkEls[loop].href.includes('showforum=6')) {
                let nodeToHide = topicLinkEls[loop].parentNode.parentNode;
                if (!isSearchScreen) nodeToHide = nodeToHide.parentNode;
                nodeToHide.style.display = 'none';
                if (!isSearchScreen) break;
            }
        }
    }
})();
