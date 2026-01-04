// ==UserScript==
// @name         아프리카TV 옛날 채팅창
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adjust chat styles on AfreecaTV live streams
// @author       You
// @match        https://play.afreecatv.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486659/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EC%98%9B%EB%82%A0%20%EC%B1%84%ED%8C%85%EC%B0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/486659/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4TV%20%EC%98%9B%EB%82%A0%20%EC%B1%84%ED%8C%85%EC%B0%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        adjustChatLayout();
        adjustContainerMargin();
    });

    const observer = new MutationObserver(function() {
        adjustChatLayout();
        adjustContainerMargin();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function adjustChatLayout() {
        const usernames = document.querySelectorAll('.username');
        const messages = document.querySelectorAll('.message-text');

        usernames.forEach(function(username) {
            username.style.display = 'block';
        });
        messages.forEach(function(message) {
            message.style.display = 'block';
        });
    }

    function adjustContainerMargin() {
        const messageContainers = document.querySelectorAll('.message-container');

        messageContainers.forEach(function(container) {
            container.style.margin = '2px';
        });
    }
})();
