// ==UserScript==
// @name         Filter GamesDoneQuick (AGDQ, SGDQ) Twitch chat.
// @namespace    https://gamesdonequick.com/
// @version      0.5
// @description  Removes chat messages with emotes only, UPPERCASE ONLY and user notices.
// @author       ciscoheat
// @match        https://www.twitch.tv/gamesdonequick*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369814/Filter%20GamesDoneQuick%20%28AGDQ%2C%20SGDQ%29%20Twitch%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/369814/Filter%20GamesDoneQuick%20%28AGDQ%2C%20SGDQ%29%20Twitch%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var messages = document.querySelectorAll('.chat-line__message');
        [].forEach.call(messages, function(message) {
            var node = message.querySelector('span[data-a-target="chat-message-text"]');
            var msg = node ? node.innerText : null;
            //console.log(msg);
            if(!node || (msg.toUpperCase() == msg ||
                       msg == "SourPls" ||
                       msg.match(/^([A-Z][a-z]+)+$/) !== null)
            ) {
                message.style.display = "none";
            }
       });

        var notices = document.querySelectorAll('.user-notice-line');
        [].forEach.call(notices, function(notice) {
            notice.style.display = "none";
        });
     }, 1);
})();