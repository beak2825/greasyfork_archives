// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Request Accepter
// @version      1.02
// @description  Accepts the requests to join from 1 user if you're using Clan Botter.
// @author       Spacekiller
// @match        *://www.brick-hill.com/*
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhrequestaccepter
// @downloadURL https://update.greasyfork.org/scripts/498490/%5BBrick-Kill%5D%20Request%20Accepter.user.js
// @updateURL https://update.greasyfork.org/scripts/498490/%5BBrick-Kill%5D%20Request%20Accepter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*-    SETTINGS    -*/
    const config = {
        invite: {
            enabled: true, // Set to true to enable automatic invite accepting.
            interval: 1, // Interval in seconds between invite accept attempts.
            userId: "12345", // The user ID for the invite.
            clanId: "8000" // The clan ID to accept the request from.
        }
    };
    /*-                -*/

    function sendRequest(url, method, body) {
        const token = document.querySelector('input[name="_token"]').value;
        const requestBody = new FormData();
        for (const key in body) {
            requestBody.append(key, body[key]);
        }
        requestBody.append('_token', token);

        return fetch(url, {
            method: method,
            body: requestBody
        });
    }

    function handleInviteRequest() {
        if (!config.invite.enabled) return;
        const url = 'https://www.brick-hill.com/clan/edit';
        const body = {
            type: "pending_member",
            user_id: config.invite.userId,
            clan_id: config.invite.clanId,
            accept: "accept"
        };
        sendRequest(url, 'POST', body).then(() => {
            console.log('Invite accepted successfully.');
        }).catch((error) => {
            console.error('Error accepting invite:', error);
        });

        const nextExecution = Date.now() + config.invite.interval * 1000;
        setTimeout(handleInviteRequest, nextExecution - Date.now());
    }

    handleInviteRequest();

})();