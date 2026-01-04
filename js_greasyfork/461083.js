// ==UserScript==
// @name         Twitch known bot highlighter
// @namespace    sh1n-shark.github.io
// @version      2.0.1
// @description  Highlights all known bot accounts from twitchinsights.net when in moderator mode.
// @author       SH1N_shark
// @match        https://www.twitch.tv/moderator/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461083/Twitch%20known%20bot%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/461083/Twitch%20known%20bot%20highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INSIGHTS_API_URL = 'https://api.twitchinsights.net/v1/bots/all';
    const BACKGROUND_COLOR = '#5c1616';
    let users = [];

    const getBotUsers = async () => {
        const userList = document.getElementById('chat-viewers-list-header-Users');
        if (!userList) {
            console.log('User list not found. Retrying...')
            setTimeout(getBotUsers, 500);
            return;
        }
        users = Array.from(userList.nextSibling.children).map(child => child.firstChild.getAttribute('data-username'));
        try {
            const response = await GM.xmlHttpRequest({
                url: INSIGHTS_API_URL,
                method: 'GET',
            });
            const result = JSON.parse(response.response);
            const bots = Array.from(result.bots).map(rawBot => rawBot[0]);
            const botUsers = users.filter(user => bots.includes(user));
            botUsers.forEach(botUser => {
                const botUserElement = document.querySelectorAll(`[data-username="${botUser}"]`)[0];
                if (botUserElement) {
                    botUserElement.style.backgroundColor = BACKGROUND_COLOR;
                }
            });
        } catch (error) {
            console.error(`Error fetching bot users: ${error}`);
        }
    };

    const registerListeners = () => {
        const listOpenHandle = document.getElementsByClassName('mod-view-context-bar__handle')[0];
        if (listOpenHandle) {
            listOpenHandle.addEventListener('click', getBotUsers);
        }
        const refreshButton = document.querySelectorAll('[data-test-selector="chat-viewers__refresh"]')[0];
        if (refreshButton) {
            refreshButton.addEventListener('click', getBotUsers);
        }
        const detailsCloseButton = document.querySelectorAll('[data-a-target="user-details-close"]')[0];
        if (detailsCloseButton) {
            detailsCloseButton.addEventListener('click', getBotUsers);
        }
    };

    window.addEventListener('load', () => {
        setTimeout(getBotUsers, 1000);
        registerListeners();
    });

    window.addEventListener('click', registerListeners);
})();