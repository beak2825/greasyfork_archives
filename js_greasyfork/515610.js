// ==UserScript==
// @name         YouTube Notification Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter YouTube notifications based on keywords
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515610/YouTube%20Notification%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/515610/YouTube%20Notification%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = ['live', 'shorts', '30 minutes']; // Keywords to filter

    function filterNotifications() {
        const notifications = document.querySelectorAll('ytd-notification-renderer');
        notifications.forEach(notification => {
            const text = notification.innerText.toLowerCase();
            if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
                notification.style.display = 'none';
            }
        });
    }

    // Run filter function initially and whenever the page is updated
    const observer = new MutationObserver(filterNotifications);
    observer.observe(document.body, { childList: true, subtree: true });
})();