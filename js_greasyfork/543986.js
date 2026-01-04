// ==UserScript==
// @name         Pardus Shadowban - Chat
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Hide chat messages from blocked users in Pardus chat
// @author       Solarix
// @match        https://chat.pardus.at/chattext.php?channel=*&uni=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543986/Pardus%20Shadowban%20-%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/543986/Pardus%20Shadowban%20-%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedUsers = ['Jinx', 'Hired Gun', 'InsertNameHere']; // Add usernames here

    function cleanChat() {
        const lines = document.querySelectorAll('div');
        lines.forEach(line => {
            const senderLink = line.querySelector("a[href^=\"javascript:sendmsg('\"]");
            if (senderLink) {
                const match = senderLink.getAttribute('href').match(/sendmsg\('([^']+)'\)/);
                if (match && blockedUsers.includes(match[1])) {
                    line.remove();
                }
            }
        });
    }

    // Run on initial load
    cleanChat();

    // Continuously monitor for new messages
    const observer = new MutationObserver(cleanChat);
    observer.observe(document.body, { childList: true, subtree: true });
})();