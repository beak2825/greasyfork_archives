// ==UserScript==
// @name         Discord Link Refresher
// @description  A Userscript to fix broken discord attachment links
// @license      WTFPL
// @author       Anon
// @namespace    discord-link-refresher
// @version      1
// @match        https://cdn.discordapp.com/attachments/*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/538886/Discord%20Link%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/538886/Discord%20Link%20Refresher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function refresh_url() {
        const token = GM_getValue('token', null);
        if (!token) {
            alert('[Discord Link Refresher] No token set!');
            return;
        }

        const response = await GM.xmlHttpRequest({
            method: 'POST',
            url: 'https://discord.com/api/v9/attachments/refresh-urls',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            data: JSON.stringify({ attachment_urls: [window.location.href] })
        });

        if (response.status !== 200) {
            alert('API request failed: ' + response.status);
            return;
        }
        const new_link = JSON.parse(response.responseText)['refreshed_urls'][0]['refreshed'];
        if (new_link && window.location.href !== new_link) {
            console.log('[Discord Link Refresher] Redirecting to refreshed link...');
            window.location.href = new_link;
        } else {
            console.log('[Discord Link Refresher] Link already refreshed, likely a real 404');
        }
    }

    GM_registerMenuCommand('Set token', function() {
        const input = prompt('Set token:');
        if (input !== null) {
            GM_setValue('token', input.trim());
            alert('Token saved.');
        }
    });

    GM_registerMenuCommand('Force refresh', refresh_url);

    if (document.body.innerText.includes('This content is no longer available.')) {
        refresh_url();
    }
})();
