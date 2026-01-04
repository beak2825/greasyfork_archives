// ==UserScript==
// @name         Refresh Youtube Next Video in Playlist
// @namespace    http://tampermonkey.net/
// @description  When a video in a playlist ends and the next video starts, this refreshes the new video immediately as workaround to issue of some YouTube videos running into playback error and requires manual refresh.
// @version      2024-01-29
// @author       1000MilesAway
// @match        https://www.youtube.com/watch*
// @icon         https://banner2.cleanpng.com/20210611/tvj/transparent-refresh-icon-reload-icon-creative-outlines-icon-60c2e81fd1a1a6.5252411116233861438587.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485961/Refresh%20Youtube%20Next%20Video%20in%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/485961/Refresh%20Youtube%20Next%20Video%20in%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkID = localStorage.getItem('checkID') || null;

    setInterval(() => {
        const videoID = new URLSearchParams(window.location.search).get('v');
        if (videoID !== checkID) {
            checkID = videoID;
            localStorage.setItem('checkID', checkID);
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }, 3000);
})();