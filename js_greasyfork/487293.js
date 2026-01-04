// ==UserScript==
// @name         autoDL网页闲置提醒
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  网页闲置10分钟后提醒
// @author       irebix
// @license      MIT
// @match        https://*.seetacloud.com:*/*
// @match        https://*.gpuhub.com:*/*
// @exclude      https://*.seetacloud.com:*/jupyter/lab*
// @exclude      https://*.gpuhub.com:*/jupyter/lab*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487293/autoDL%E7%BD%91%E9%A1%B5%E9%97%B2%E7%BD%AE%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/487293/autoDL%E7%BD%91%E9%A1%B5%E9%97%B2%E7%BD%AE%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let idleInterval;
    const maxIdleTime = 10 * 60 * 1000; // 10分钟提醒一次

    function startIdleTimer() {
        // Only start the timer if it hasn't been started already
        if (!idleInterval) {
            idleInterval = setTimeout(showNotification, maxIdleTime);
        }
    }

    function resetIdleTimer() {
        if (idleInterval) {
            clearTimeout(idleInterval); // Clear any existing timer
            idleInterval = null; // Reset the interval
        }
    }

    function showNotification() {
        if (document.visibilityState === 'hidden') {
            // Ensure the browser supports notifications
            if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    new Notification('Idle Alert', {
                        body: 'You have been away from the page for more than 20 minutes.',
                        //icon: 'https://example.com/icon.png' // Optional icon URL
                    });
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission(function(permission) {
                        if(permission === "granted") {
                            new Notification('闲置警告', {
                                body: '您已经20分钟没有切到主机页面了，注意计费',
                                //icon: 'https://example.com/icon.png' // Optional icon URL
                            });
                        }
                    });
                }
            }
        }
    }

    // Start or reset the idle timer whenever the tab gains or loses focus
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            resetIdleTimer();
        } else {
            // The tab is no longer active, so start the idle timer
            startIdleTimer();
        }
    });

    // Initialize the timer when script loads and the tab is not active
    if (document.visibilityState === 'hidden') {
        startIdleTimer();
    }
})();
