// ==UserScript==
// @name         Replace Twitch Player with Kick (Bajindo Only)
// @namespace    https://kick.com/
// @version      2.0
// @description  Fully replaces Twitch's video player with Bajindo's Kick stream, ensuring video loads correctly.
// @author       YourName
// @match        https://www.twitch.tv/bajindo
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530647/Replace%20Twitch%20Player%20with%20Kick%20%28Bajindo%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530647/Replace%20Twitch%20Player%20with%20Kick%20%28Bajindo%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const kickUsername = "bajindo"; // Kick streamer username

    function replaceTwitchWithKick() {
        // Find Twitch player area
        const twitchVideoContainer = document.querySelector('div[data-a-target="video-player"]');
        if (!twitchVideoContainer) return;

        // Prevent multiple replacements
        if (document.getElementById('kick-embed-container')) return;

        // Remove all existing Twitch player elements
        twitchVideoContainer.innerHTML = '';

        // Ensure the container is properly sized
        twitchVideoContainer.style.display = "flex";
        twitchVideoContainer.style.justifyContent = "center";
        twitchVideoContainer.style.alignItems = "center";
        twitchVideoContainer.style.width = "100%";
        twitchVideoContainer.style.height = "100%";

        // Create Kick iframe
        const kickEmbed = document.createElement('iframe');
        kickEmbed.id = 'kick-embed-container';
        kickEmbed.src = `https://player.kick.com/${kickUsername}`;
        kickEmbed.allowFullscreen = true;

        // Force full fit
        kickEmbed.style.width = "100%";
        kickEmbed.style.height = "100%";
        kickEmbed.style.border = "none";

        // Insert Kick iframe
        twitchVideoContainer.appendChild(kickEmbed);
    }

    // Run the function once Twitch loads
    setTimeout(replaceTwitchWithKick, 3000);

    // Observe Twitch’s dynamic changes to replace player when needed
    const observer = new MutationObserver(replaceTwitchWithKick);
    observer.observe(document.body, { childList: true, subtree: true });

})();
