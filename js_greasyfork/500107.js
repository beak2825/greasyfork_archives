// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Ban Detector
// @version      2
// @description  Automatically runs an action when banned.
// @match        *://www.brick-hill.com/*
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhbandetector
// @run-at       document-start
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/500107/%5BBrick-Kill%5D%20Ban%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/500107/%5BBrick-Kill%5D%20Ban%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*-    SETTINGS    -*/

    const action = "logout"; // What to do when you get banned. Use "logout" or "refresh".

    const Check_interval = 60; // How many seconds you want to check. Recommended to do 60 seconds, or 20 seconds if active on the website.

    /*-                -*/

    const banCheckUrl = 'https://www.brick-hill.com/banned';

    async function logoutAndRedirect() {
        try {
            const tokenInput = document.querySelector('input[name="_token"]');
            if (!tokenInput) throw new Error('Token input not found');

            const formData = new URLSearchParams({ '_token': tokenInput.value });

            const response = await fetch('https://www.brick-hill.com/logout', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (response.ok) {
                console.log('Successfully logged out');
                window.location.href = 'https://www.brick-hill.com/login';
            } else {
                throw new Error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    function refreshPage() {
        if (!window.location.href.includes(banCheckUrl)) {
            console.log('Refreshing page...');
            window.location.reload();
        } else {
            console.log('Ban page detected. Not refreshing.');
        }
    }

    function showNotification() {
        GM_notification({
            title: 'Ban Detected',
            text: 'You have been banned from Brick Hill!',
            timeout: 5000,
            onclick: () => window.focus(),
        });
    }

    async function checkBanStatus() {
        try {
            const response = await fetch(banCheckUrl, { method: 'GET', credentials: 'include', redirect: 'manual' });

            if (response.status === 302 || response.redirected) {
                console.log('Redirect detected (potential ban). Performing action:', action);
                showNotification();
                if (action === "logout") {
                    logoutAndRedirect();
                } else if (action === "refresh") {
                    refreshPage();
                }
            } else if (response.status === 200) {
                console.log('Ban detected. Performing action:', action);
                showNotification();
                if (action === "logout") {
                    logoutAndRedirect();
                } else if (action === "refresh") {
                    refreshPage();
                }
            }
        } catch (error) {
            console.error('Error checking ban status:', error);
        }
    }

    function startBanCheck() {
        setInterval(checkBanStatus, Check_interval * 1000);
    }

    window.addEventListener('load', startBanCheck);
})();