// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] User Notifs
// @version      1.03
// @description  Notifies when a user is online.
// @author       Spacekiller
// @match        *://www.brick-hill.com/*
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhusernotif
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      brick-hill.com
// @connect      api.brick-hill.com
// @downloadURL https://update.greasyfork.org/scripts/500029/%5BBrick-Kill%5D%20User%20Notifs.user.js
// @updateURL https://update.greasyfork.org/scripts/500029/%5BBrick-Kill%5D%20User%20Notifs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*-    SETTINGS    -*/

    const userIds = [ // List of user's IDs you want notifications for being online. Defaulted to admins.
        59,
        4787,
        7175,
        51918,
        64562,
        184808
    ];

    /*-                -*/

    const userProfileUrlTemplate = 'https://api.brick-hill.com/v1/user/profile?id=';
    const userStatusUrlTemplate = 'https://www.brick-hill.com/user/';
    const userStatus = {};

    async function initializeUserStatus() {
        for (const userId of userIds) {
            userStatus[userId] = await GM.getValue(userId, {
                online: false,
                notified: false
            });
        }
    }

    function updateUserStatus(userId, status) {
        userStatus[userId] = status;
        GM.setValue(userId, status);
    }

    function checkUserStatus(userId) {
        const userProfileUrl = `${userProfileUrlTemplate}${userId}`;
        const userStatusUrl = `${userStatusUrlTemplate}${userId}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: userProfileUrl,
            onload: function (response) {
                const userProfile = JSON.parse(response.responseText);
                const username = userProfile.username;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: userStatusUrl,
                    onload: function (response) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const statusDot = doc.querySelector('.status-dot');
                        const isOnline = statusDot && statusDot.classList.contains('online');

                        if (userStatus[userId].online !== isOnline) {
                            const status = {
                                online: isOnline,
                                notified: true
                            };
                            updateUserStatus(userId, status);

                            GM_notification({
                                title: `User ${isOnline ? 'Online' : 'Offline'}`,
                                text: `${username} is ${isOnline ? 'online' : 'offline'}`,
                                timeout: 5000,
                                onclick: function () {
                                    window.open(userStatusUrl);
                                },
                            });
                        }
                    }
                });
            }
        });
    }

    async function checkAllUsers() {
        for (const userId of userIds) {
            checkUserStatus(userId);
        }
    }

    (async function () {
        await initializeUserStatus();
        setInterval(checkAllUsers, 5000);
    })();
})();