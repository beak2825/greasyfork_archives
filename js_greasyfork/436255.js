// ==UserScript==
// @name         [YouTube] Chat emoji categories trim
// @version      0.5
// @description  Script that leaves only one emoji category in Youtube Emoji picker to prevent lag when opening emoji menu
// @author       SL1900
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license MIT
// @namespace https://greasyfork.org/users/846039
// @downloadURL https://update.greasyfork.org/scripts/436255/%5BYouTube%5D%20Chat%20emoji%20categories%20trim.user.js
// @updateURL https://update.greasyfork.org/scripts/436255/%5BYouTube%5D%20Chat%20emoji%20categories%20trim.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

    while(true)
    {
        // YouTube Live Chat
        if(
            $("#emoji.yt-live-chat-message-input-renderer") &&
            $("#emoji.yt-live-chat-message-input-renderer").data.categories.length > 1)
        {
            $("#emoji.yt-live-chat-message-input-renderer").data.categories =
                $("#emoji.yt-live-chat-message-input-renderer").data.categories.slice(0,1);
        }

        if(
            $("#emoji.yt-live-chat-message-input-renderer") &&
            $("#emoji.yt-live-chat-message-input-renderer").data.categoryButtons.length > 1)
        {
            $("#emoji.yt-live-chat-message-input-renderer").data.categoryButtons =
                $("#emoji.yt-live-chat-message-input-renderer").data.categoryButtons.slice(0,1);
        }

        // YouTube Comment Section
        $$("yt-emoji-picker-renderer").forEach(picker => {
            if(picker.data.categories.length > 1)
                picker.data.categories = picker.data.categories.slice(0,1)

            if(picker.data.categoryButtons.length > 1)
                picker.data.categoryButtons = picker.data.categoryButtons.slice(0,1)
        });

        await sleep(100);
    }
})();