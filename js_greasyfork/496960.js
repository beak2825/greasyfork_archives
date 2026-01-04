// ==UserScript==
// @name         Auto Unmute Twitch
// @namespace    elanis
// @version      1.0
// @description  Automatically unmute Twitch streams
// @author       elanis
// @match        *://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @exclude      *://*.twitch.tv/p/*
// @exclude      *://*.twitch.tv/popout/*/poll*
// @exclude      *://*.twitch.tv/popout/*/reward-queue*
// @exclude      *://*.twitch.tv/popout/*/predictions*
// @exclude      *://*.twitch.tv/popout/moderator/*
// @exclude      *://*.twitch.tv/moderator/*
// @exclude      *://*.twitch.tv/broadcast/*
// @exclude      *://*.twitch.tv/subs/*
// @exclude      *://*.twitch.tv/jobs/*
// @exclude      *://*.twitch.tv/teams/*
// @exclude      *://*.twitch.tv/store/*
// @exclude      *://player.twitch.tv/*
// @exclude      *://dashboard.twitch.tv/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        none
// @license      Ns 
// @downloadURL https://update.greasyfork.org/scripts/496960/Auto%20Unmute%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/496960/Auto%20Unmute%20Twitch.meta.js
// ==/UserScript==

window.addEventListener('load', function aca() {
    console.log('Script iniciado');
    
    function unmuteStream() {
        // Selector to find the unmute button
        const muteButton = $('button[aria-label="Unmute (m)"]');
        
        if (muteButton.length > 0) {
            muteButton.click();
            console.log('Stream unmute');
        }
    }

    // Try to unmute the stream every 5 seconds
    setInterval(unmuteStream, 5000);
});
