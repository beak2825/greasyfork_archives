// ==UserScript==
// @name         Twitter to Mastodon Redirector
// @namespace    http://your-domain-here/
// @version      1
// @description  Redirects to Mastodon if the Twitter user has a Mastodon account associated with them.
// @match        *://twitter.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470141/Twitter%20to%20Mastodon%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/470141/Twitter%20to%20Mastodon%20Redirector.meta.js
// ==/UserScript==
const HOME_SERVER = 'mastodon.social';

(function() {
    'use strict';

    // Get the Twitter username from the URL
    function getUsername() {
        const match = window.location.pathname.match(/^\/([a-zA-Z0-9_]+)/);
        if (match) {
            return match[1];
        }
        return null;
    }

function checkForMastodon(username) {
    const commonWords = ['home', 'explore', 'notification', 'i', 'message', 'settings','search'];
    if (commonWords.includes(username.toLowerCase())) {
        removeMastodonButton();
        return;
    }
    const apiURL = `https://t2m.ooyeep.uk/api?username=${username}`;
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiURL,
        onload: function(response) {
            const data = JSON.parse(response.responseText);
            if (data.status === 'success' && data.mastodon_domain && data.mastodon_username) {
                createMastodonButton(data.mastodon_domain, data.mastodon_username);
            } else {
                removeMastodonButton();
            }
        }
    });
}

    // Create the Mastodon redirect button component
    function createMastodonButton(domain, username) {
        let button = document.getElementById('mastodon-button');
        if (!button) {
            button = document.createElement('div');
            button.id = 'mastodon-button';
            button.style = 'position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 9999;';
            document.body.appendChild(button);
        }
        button.innerHTML = `
            <a href="https://${HOME_SERVER}/@${username}@${domain}" target="_blank">
                <span class="text" style="color: white; background-color: hotPink; padding: 12px 24px; border-radius: 25px;">Follow on Mastodon</span>
            </a>
        `;
    }

    // Remove the Mastodon redirect button component
    function removeMastodonButton() {
        const button = document.getElementById('mastodon-button');
        if (button) {
            button.remove();
        }
    }

    // Check for Mastodon account periodically
    let username = getUsername();
    setInterval(function() {
        const newUsername = getUsername();
        if (newUsername && newUsername !== username) {
            username = newUsername;
            checkForMastodon(username);
        }
    }, 1000);
})();