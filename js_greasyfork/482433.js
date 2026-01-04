// ==UserScript==
// @name         Kick.com Unique Chatter Counter
// @version      0.4
// @description  Kick.com Unique Chatter Counter - Detect whos viewbotting
// @author       Rishi Sunak
// @match        https://kick.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1235079
// @downloadURL https://update.greasyfork.org/scripts/482433/Kickcom%20Unique%20Chatter%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/482433/Kickcom%20Unique%20Chatter%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let uniqueUserIds = {};
    let currentStreamSrc = null;

    function countUniqueUserIds() {
        const userIdElements = document.querySelectorAll('[data-chat-entry-user-id]');

        userIdElements.forEach(element => {
            const userId = element.getAttribute('data-chat-entry-user-id');
            uniqueUserIds[userId] = true;
        });

        const uniqueUserCount = Object.keys(uniqueUserIds).length;
        console.log(`Unique User IDs: ${uniqueUserCount}`);

        const chatHeaderElement = document.querySelector('.flex.flex-row.items-center.text-center .text-base.font-bold');
        if (chatHeaderElement) {
            chatHeaderElement.textContent = `Unique Chatters: ${uniqueUserCount}`;
        }
    }

    function checkStreamChange() {
        const videoElement = document.querySelector('video.vjs-tech');
        if (videoElement) {
            const newStreamSrc = videoElement.getAttribute('src');
            if (newStreamSrc !== currentStreamSrc) {
                uniqueUserIds = {};
                currentStreamSrc = newStreamSrc;
            }
        }
    }

    countUniqueUserIds();
    checkStreamChange();

    const observer = new MutationObserver(() => {
        countUniqueUserIds();
        checkStreamChange();
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    observer.observe(targetNode, config);

})();
