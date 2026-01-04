// ==UserScript==
// @name         Hide/Show Chat
// @namespace    Hiding and Showing chat, "1" hide, "2", "4" hold 2500 ms show
// @author       Clyde
// @version      1.0
// @description  Hide or show chat on multiplayerpiano.com
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.lapishusky.dev/*
// @include      *://mpp.hyye.tk/*
// @grant        none
// @license      GitHuberII
// @downloadURL https://update.greasyfork.org/scripts/473202/HideShow%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/473202/HideShow%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the chat
    function hideChat() {
        var chatElement = document.getElementById('chat');
        if (chatElement) {
            chatElement.style.display = 'none';
        }
    }

    // Function to show the chat
    function showChat() {
        var chatElement = document.getElementById('chat');
        if (chatElement) {
            chatElement.style.display = 'block';
        }
    }

    // Keydown event listener
    document.addEventListener('keydown', function(event) {
        if (event.key === '1') {
            hideChat();
        }
        if (event.key === '2' && event.repeat) {
            var timeout = 2500; // 2500 miliseconds
            var timer;

            // Function to add or restore the chat
            function addOrRestoreChat() {
                clearTimeout(timer);
                showChat();
            }

            // Restore the chat when "S" and "C" are hold for 2500 miliseconds
            if (event.key === '2') {
                timer = setTimeout(addOrRestoreChat, timeout);
            }
            if (event.key === '4') {
                clearTimeout(timer);
            }
        }
    });
})();