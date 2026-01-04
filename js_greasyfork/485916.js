// ==UserScript==
// @name         HIDE PLAYER
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide specific player on bonk.io with Alt+H
// @author       You
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485916/HIDE%20PLAYER.user.js
// @updateURL https://update.greasyfork.org/scripts/485916/HIDE%20PLAYER.meta.js
// ==/UserScript==


    // ==UserScript==


(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'h' and the 'Alt' key is pressed
        if (event.altKey && event.key === 'h') {
            // Display 'HIDDEN ON' in the lobby chat
            const chatMessage = document.querySelector('.newbonklobby_chat_msg_txt');
            if (chatMessage) {
                chatMessage.textContent = 'HIDDEN ON';
            }

            // Make the in-game chat box visible if not already visible
            const inGameChatBox = document.getElementById('ingamechatbox');
            if (inGameChatBox && inGameChatBox.style.visibility !== 'visible') {
                inGameChatBox.style.visibility = 'visible';
            }

            // Inject styles to hide player during in-game
            GM_addStyle('.newbonklobby_playerentry_menuhighlighted { display: none !important; }');
        }
    });
})();
