// ==UserScript==
// @name         Skip Hypixel Reward Video
// @namespace    BedFullPro ON YT
// @version      2.0
// @description  Automatically skips the video on the Hypixel Rewards page
// @author       BedFullPro
// @match        https://rewards.hypixel.net/claim-reward/*
// @grant        none
// @license MIT
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/495277/Skip%20Hypixel%20Reward%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/495277/Skip%20Hypixel%20Reward%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var checkVideoInterval = 2000; // Interval in milliseconds ajust for your needs
    var interval = setInterval(function() {
        var youtubeVideo = YT.get($('*[id^="yt"]')[0].id);
        if (youtubeVideo) {
            youtubeVideo.seekTo(youtubeVideo.getDuration());
            clearInterval(interval);
        }
    }, checkVideoInterval);
})();
