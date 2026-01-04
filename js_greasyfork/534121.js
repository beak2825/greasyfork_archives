// ==UserScript==
// @name         Reddit Profile New Post/Comment Notifier (DS3M)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Reloads Reddit user profile, shows non-expiring notification if new post/comment detected, full logging, using native Notification API
// @match        https://www.reddit.com/user/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/534121/Reddit%20Profile%20New%20PostComment%20Notifier%20%28DS3M%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534121/Reddit%20Profile%20New%20PostComment%20Notifier%20%28DS3M%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getLastItemId() {
        return await GM_getValue('lastItemIdDS3M', null);
    }

    async function setLastItemId(id) {
        await GM_setValue('lastItemIdDS3M', id);
    }

    function getRandomInterval() {
        const minutes = Math.random() * (10 - 6) + 6;
        console.log(`[Notifier] Next check in ${minutes.toFixed(2)} minutes`);
        return minutes * 60 * 1000;
    }

    function requestNotificationPermission() {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                console.log(`[Notifier] Notification permission: ${permission}`);
            });
        }
    }

    async function checkNewContent() {
        console.log("[Notifier] Checking for new content...");

        const firstItem = document.querySelector('a[data-ks-id^="t1_"]');
        if (firstItem) {
            const itemId = firstItem.getAttribute('data-ks-id');
            const itemHref = firstItem.getAttribute('href');
            console.log(`[Notifier] Found first item: ID = ${itemId}, Link = ${itemHref}`);

            const lastItemId = await getLastItemId();

            if (lastItemId) {
                if (itemId !== lastItemId) {
                    console.log(`[Notifier] New item detected! Old ID: ${lastItemId}, New ID: ${itemId}`);
                    if (Notification.permission === 'granted') {
                        new Notification('New Reddit Post/Comment', {
                            body: 'New activity detected.',
                            requireInteraction: true  // <<< this keeps it on screen
                        });
                    } else {
                        console.warn("[Notifier] Notification permission not granted.");
                    }
                } else {
                    console.log("[Notifier] No new item detected.");
                }
            } else {
                console.log("[Notifier] No previous item stored. Saving current ID.");
            }

            await setLastItemId(itemId);
        } else {
            console.log("[Notifier] No items found on page.");
        }

        const nextInterval = getRandomInterval();
        setTimeout(() => {
            console.log("[Notifier] Reloading page for next check...");
            location.reload();
        }, nextInterval);
    }

    window.addEventListener('load', () => {
        console.log("[Notifier] Page loaded, requesting notification permission and starting initial check...");
        requestNotificationPermission();
        setTimeout(checkNewContent, 13000);
    });
})();
