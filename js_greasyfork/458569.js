// ==UserScript==
// @name         Better Rumble Chat Mod Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Read tips on rumble streams out loud using WebSpeech API
// @author       sungorilla2036
// @match        https://rumble.com/*
// @icon         https://rumble.com/i/favicon-v4.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458569/Better%20Rumble%20Chat%20Mod%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/458569/Better%20Rumble%20Chat%20Mod%20Tools.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const SUPABASE_API_URL = "https://jdgupyekpkslpauidzoo.supabase.co/rest/v1/RumbleUsers";
    const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3VweWVrcGtzbHBhdWlkem9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQwNjg3NTgsImV4cCI6MTk4OTY0NDc1OH0.3iKSXMuR9Z0ZLp3I521hOeIuqRwvxiCMTAOhuKUr3Pg";
    const SUPABASE_HEADERS = {
      "apikey": SUPABASE_API_KEY,
      "Authorization": "Bearer " + SUPABASE_API_KEY,
      "Content-Type": "application/json",
    };

    const BLACKLISTED_USERS = new Set([]);
    const WHITELISTED_USERS = new Set([]);

    function fetchUsers() {
        fetch(SUPABASE_API_URL + `?select=*`, {
        headers: SUPABASE_HEADERS,
        })
        .then((response) => response.json())
        .then((data) => {
            for (const user of data) {
                if (user.isBlacklisted) {
                    BLACKLISTED_USERS.add(user.name);
                } else {
                    WHITELISTED_USERS.add(user.name);
                }
            }
        });
    }
    fetchUsers();

    function postUser(username, isBlacklisted) {
      fetch(SUPABASE_API_URL, {
        method: "POST",
        headers: SUPABASE_HEADERS,
        body: JSON.stringify({
          name: username,
          isBlacklisted: isBlacklisted,
        }),
      });
    }

    const observer = new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                let messageElem = node.querySelector('.chat-history--message');
                messageElem ||= node.querySelector('.chat-history--rant-text');

                let userElem = node.querySelector('.chat-history--username a');
                userElem ||= node.querySelector('.chat-history--rant-username');

                if (!messageElem) continue;
                const userName = userElem.textContent;
                if (!BLACKLISTED_USERS.has(userName)) {
                    const blacklistButton = document.createElement('button');
                    blacklistButton.textContent = '🔨';
                    blacklistButton.style = 'background-color:red;position:absolute;left:-21px;top:0';
                    blacklistButton.onclick = () => {
                        postUser(userName, true);
                        BLACKLISTED_USERS.add(userName);
                        node.removeChild(blacklistButton);
                    };
                    node.appendChild(blacklistButton);
                }
            }
        }
    });

    observer.observe(document.querySelector('#chat-history-list'), { childList: true });
})();