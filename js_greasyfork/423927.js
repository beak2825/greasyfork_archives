// ==UserScript==
// @name         Twitch auto online presence
// @namespace    https://www.twitch.tv/ghryphen
// @author       Ghryphen
// @version      1.0
// @match        https://www.twitch.tv/*
// @icon         https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png
// @description  Sets your presence to online if offline at first load
// @downloadURL https://update.greasyfork.org/scripts/423927/Twitch%20auto%20online%20presence.user.js
// @updateURL https://update.greasyfork.org/scripts/423927/Twitch%20auto%20online%20presence.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GoOnline = () => {

        const avatarButton = document.querySelector('[data-a-target="user-menu-toggle"]');

        if (avatarButton !== null) {
            avatarButton.click();

            const onlineButton = document.querySelector('[data-a-target="online-dropdown-button"] label');

            if (onlineButton !== null) {
                const onlineInput = document.getElementById(onlineButton.htmlFor);

                if (onlineInput.checked == false) {
                    onlineButton.click();
                    console.log('Online button pressed');
                }
            }

            avatarButton.click();
        }

    };

    setTimeout(GoOnline, 5000);

})();