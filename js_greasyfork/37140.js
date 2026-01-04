// ==UserScript==
// @name         RewardNow
// @namespace    http://jeuxjeuxkit.tk/
// @version      2
// @description  Disables the video that you must watch for claiming the hypixel daily reward
// @author       jeuxjeux20
// @match        https://rewards.hypixel.net/claim-reward/*
// @grant        none
// @require     http://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/37140/RewardNow.user.js
// @updateURL https://update.greasyfork.org/scripts/37140/RewardNow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var thingy = setInterval(function() {
        var youtubeVideo = YT.get($('*[id^="yt"]')[0].id);
        youtubeVideo.seekTo(youtubeVideo.getDuration());
        clearInterval(thingy);
    },6000);
})();