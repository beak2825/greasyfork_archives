// ==UserScript==
// @name         Chaturbate User Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide chosen Chaturbate users from your feed permanently
// @author       YourName
// @match        https://chaturbate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543873/Chaturbate%20User%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/543873/Chaturbate%20User%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper: Load/Save usernames to localStorage
    function getHiddenUsers() {
        return JSON.parse(localStorage.getItem('cb_hidden_users') || '[]');
    }
    function saveHiddenUsers(users) {
        localStorage.setItem('cb_hidden_users', JSON.stringify(users));
    }
    function hideUser(username) {
        let users = getHiddenUsers();
        if (!users.includes(username)) {
            users.push(username);
            saveHiddenUsers(users);
        }
    }

    // Main: Hide users and add buttons
    function processFeed() {
        let hiddenUsers = getHiddenUsers();

        // Modify according to feed layout: Change selector if needed
        document.querySelectorAll('li[data-room], .room-container, .room-card').forEach(function(elem){
            let username = '';
            // Try several selectors to extract username
            let link = elem.querySelector('a[data-room], a[href^="/profile/"], a[href^="/"]');
            if(link) {
                let match = link.href.match(/chaturbate\.com\/([^\/]+)/);
                if(match) username = match[1];
            }
            if(!username && elem.dataset.room) username = elem.dataset.room;

            if (username) {
                // Hide if user is in hiddenUsers
                if (hiddenUsers.includes(username)) {
                    elem.style.display = 'none';
                    return;
                }
                // Prevent duplicate buttons
                if (elem.querySelector('.cb-hide-btn')) return;
                // Add button
                let btn = document.createElement('button');
                btn.innerHTML = 'Hide User';
                btn.className = 'cb-hide-btn';
                btn.style.marginLeft = '10px';
                btn.onclick = function(e){
                    e.stopPropagation();
                    hideUser(username);
                    elem.style.display = 'none';
                };
                // Try to append button logically; fallback to end of element
                (elem.querySelector('.room-title, .username') || elem).appendChild(btn);
            }
        });
    }

    // Repeat every 2 seconds to handle dynamic page loads
    setInterval(processFeed, 2000);
})();
