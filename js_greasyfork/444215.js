// ==UserScript==
// @name           YouTube chat minimized
// @name:es        YouTube chat minimizado
// @description    Hide live chat on live streams
// @description:es Esconde el chat de las transmisiones en vivo
// @version        0.5
// @author         IgnaV
// @match          https://www.youtube.com/*
// @icon           http://youtube.com/favicon.ico
// @namespace      http://tampermonkey.net/
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/444215/YouTube%20chat%20minimized.user.js
// @updateURL https://update.greasyfork.org/scripts/444215/YouTube%20chat%20minimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideChat = () => {
        let attemptsToHide = 0;
        const intervalId = setInterval(() => {
            const chat = document.querySelector('#show-hide-button > ytd-toggle-button-renderer');

            if (chat) {
                chat.click();
                console.log('Chat hidden!');
                clearInterval(intervalId);
                return;
            } else if (attemptsToHide < 20) {
                attemptsToHide++;
                console.log(`Attempts to hide the chat ${attemptsToHide}`);
            } else {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    window.addEventListener('urlchange', hideChat);
    hideChat();
})();