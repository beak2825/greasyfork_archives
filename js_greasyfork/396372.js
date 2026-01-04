// ==UserScript==
// @name        TrueTheaterMode - twitch.tv
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     1.1
// @author      -
// @description Removes the small black bar that appears under the twitch player in theatre mode
// @downloadURL https://update.greasyfork.org/scripts/396372/TrueTheaterMode%20-%20twitchtv.user.js
// @updateURL https://update.greasyfork.org/scripts/396372/TrueTheaterMode%20-%20twitchtv.meta.js
// ==/UserScript==

GM_addStyle ( `
    .video-player__container--theatre-whispers {
        bottom: 0 !important;
    }
` );