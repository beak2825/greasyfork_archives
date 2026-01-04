// ==UserScript==
// @name         Discord Helper
// @namespace    https://greasyfork.org/users/1179204
// @version      0.0.1
// @description  Click any Discord message to copy its message ID
// @author       KaKa
// @match        https://discord.com/channels/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538773/Discord%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/538773/Discord%20Helper.meta.js
// ==/UserScript==
(function () {
    'use strict';

    document.addEventListener('click', function (event) {
        const messageElement = event.target.closest('[id^="chat-messages-"]');
        if (!messageElement) return;

        const rawId = messageElement.id;
        if (!rawId.startsWith('chat-messages-')) return;

        const fullId = rawId.substring('chat-messages-'.length);
        const parts = fullId.split('-');
        const messageId = parts[1] || parts[0];

        navigator.clipboard.writeText(messageId).then(() => {
            messageElement.style.outline = '2px solid red';
            setTimeout(() =>{
                messageElement.style.outline = ''}, 500);
        }).catch(err => {
            console.error('Failed to copy message ID:', err);
        });
    });
})();