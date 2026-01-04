// ==UserScript==
// @name         Open Twitch Channel on Streamcharts in New Tab
// @namespace    http://tampermonkey-scripts/
// @version      3
// @description  Adds a button to open the Twitch channel in a new tab with Streamscharts analytics data.
// @match        https://www.twitch.tv/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/465389/Open%20Twitch%20Channel%20on%20Streamcharts%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/465389/Open%20Twitch%20Channel%20on%20Streamcharts%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the Twitch channel name from the URL
    const twitchUrlRegex = /https:\/\/www\.twitch\.tv\/([^/]+)/;
    const match = twitchUrlRegex.exec(window.location.href);
    if (!match) {
        return;
    }
    const channelName = match[1];

    // Create a button to open the channel in a new tab with Streamscharts analytics data
    const button = document.createElement('button');
    button.innerText = 'stats';
    button.style.position = 'absolute';
//    button.style.opacity = '0.55';
    button.style.top = '0';
    button.style.left = '97%';
    button.style.right = '0';
    // button.style.transform = 'translateY(48.5%)';
    button.style.transform = 'translateY(49%)';
    button.style.zIndex = '9999';
    button.style.padding = '5px 10px';
    button.addEventListener('mouseenter', () => {
        button.style.color = '#772CE8'; // change text color on hover
    });
    button.addEventListener('mouseleave', () => {
        button.style.color = '#ffffff'; // reset text color when not hovering
    });
    button.addEventListener('click', () => {
        const streamschartsUrl = `https://streamscharts.com/channels/${channelName}`;
        GM_setClipboard(streamschartsUrl);
        window.open(streamschartsUrl, '_blank');
    });

    // Add the button to the Twitch page
    const playerElement = document.querySelector('div[data-a-target="video-player"]');
    if (playerElement) {
        playerElement.parentNode.insertBefore(button, playerElement);
    }
})();
