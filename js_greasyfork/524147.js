// ==UserScript==
// @name         Reddit DM Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Block unsolicited Reddit DMs containing spam keywords
// @match        https://www.reddit.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/524147/Reddit%20DM%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/524147/Reddit%20DM%20Ad%20Blocker.meta.js
// ==/UserScript==

// by justablock :)
(function() {
    'use strict';

    const dmKeywordsToFilter = ['iptv', 'IPTV', 'payday loan', 'crypto investment', 'zymotv', 'Emby', 'Plex']; // Add more as needed

    function filterDMs() {
        const messages = document.querySelectorAll('.thing.message');
        messages.forEach(message => {
            const textContent = message.querySelector('.md')?.textContent || '';
            if (dmKeywordsToFilter.some(keyword => textContent.toLowerCase().includes(keyword.toLowerCase()))) {
                message.style.display = 'none';
            }
        });
    }

    setInterval(filterDMs, 1000);

    const observer = new MutationObserver(() => {
        filterDMs();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
