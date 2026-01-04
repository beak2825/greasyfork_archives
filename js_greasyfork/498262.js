// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Mass Reporter
// @version      2
// @description  Sends automated report garbage seen by admins.
// @match        *://www.brick-hill.com/*
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhmassreporter
// @downloadURL https://update.greasyfork.org/scripts/498262/%5BBrick-Kill%5D%20Mass%20Reporter.user.js
// @updateURL https://update.greasyfork.org/scripts/498262/%5BBrick-Kill%5D%20Mass%20Reporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*-    SETTINGS    -*/
    const config = {
        report: {
            enabled: true, // Set to true to enable automatic reporting.

            interval: 30, // Don't go below 30 seconds, cause that's the limit.

            reportableType: 1, // The type of thing you are reporting.
            // 1 for items
            // 2 for users
            // 3 for games
            // 4 for threads
            // 5 for replies
            // 6 for comments
            // 7 for messages
            // 8 for clans.

            reportableId: 373212, // The ID you are reporting.

            reasonID: 6, // The ID of the reason.
            // 1 is for Excessive or inappropriate use of profanity
            // 2 is for Inappropriate/adult content
            // 3 is for Requesting or giving private information
            // 4 is for Engaging in third party/offsite deals
            // 5 is for Harassing/bullying other users
            // 6 is for Exploiting/scamming other users
            // 7 is for Stolen account
            // 8 is for Phishing/hacking/trading accounts
            // 9 is for Other

            note: "Coinfarmed" // Note for the report.
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

    function handleReportRequest() {
        if (!config.report.enabled) return;
        const url = 'https://www.brick-hill.com/report/send';
        const body = {
            reportable_type: config.report.reportableType,
            reportable_id: config.report.reportableId,
            reason: config.report.reasonID.toString(),
            note: config.report.note
        };
        sendRequest(url, 'POST', body).then(() => {
            console.log('Report sent successfully.');
        }).catch((error) => {
            console.error('Error sending report:', error);
        });

        const nextExecution = Date.now() + config.report.interval * 1000;
        setTimeout(handleReportRequest, nextExecution - Date.now());
    }

    handleReportRequest();

})();