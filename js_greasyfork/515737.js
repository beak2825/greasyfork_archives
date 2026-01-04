// ==UserScript==
// @name        Youtube, Auto-follow Raid redirects
// @version     2024-11-04-01
// @description Attempt to auto-follow live-stream raid redirects, ignoring Youtube auto-play setting
// @author      You and others
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at      document-end
// @grant       none
// @license     MIT
// @namespace https://greasyfork.org/users/416400
// @downloadURL https://update.greasyfork.org/scripts/515737/Youtube%2C%20Auto-follow%20Raid%20redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/515737/Youtube%2C%20Auto-follow%20Raid%20redirects.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        var video = document.querySelector("video");
        if (!video || !video.ended) return;
        var autonav = document.querySelector("#movie_player > div.html5-endscreen.ytp-player-content.autonav-endscreen > div.ytp-autonav-endscreen-countdown-overlay > div > div.ytp-autonav-endscreen-button-container > a");
        if (!autonav) return;

        location.href = autonav.href;
    }, 5000);
})();