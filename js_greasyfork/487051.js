// ==UserScript==
// @name         Twitter unmute video
// @namespace    https://greasyfork.org/users/1259797
// @version      2024-07-05
// @description  Unmute Twitter(x.com) videos.
// @author       PsychopathicKiller77
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487051/Twitter%20unmute%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/487051/Twitter%20unmute%20video.meta.js
// ==/UserScript==

setInterval(function() {
    var videos = document.getElementsByTagName("video");
    for (var video of videos) {
        if (video != null && !video.paused && video.muted) {
            video.muted = false;
        }
    }
}, 100);