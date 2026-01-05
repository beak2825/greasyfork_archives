// ==UserScript==
// @name         YouTube Progressbar Updater
// @version      0.2
// @description  Forces the YouTube progress bar to update even when it's supposed to be hidden.
// @author       Workgroups
// @match        *://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/14014
// @downloadURL https://update.greasyfork.org/scripts/11486/YouTube%20Progressbar%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/11486/YouTube%20Progressbar%20Updater.meta.js
// ==/UserScript==

var findVideoInterval = setInterval(function() {
    var ytplayer = document.querySelector(".html5-video-player:not(.addedupdateevents)");
    if (!ytplayer) {
        return;
    }
    ytplayer.className+=" addedupdateevents";
    var video = ytplayer.querySelector("video");
    var progressbar = ytplayer.querySelector(".ytp-play-progress");
    var loadbar = ytplayer.querySelector(".ytp-load-progress");
    if (!video || !progressbar || !loadbar) {
        return;
    }
    video.addEventListener("timeupdate",function() {
        progressbar.style.transform = "scaleX("+(video.currentTime/video.duration)+")";
    });
    video.addEventListener("progress",function() {
        loadbar.style.transform = "scaleX("+(video.buffered.end(video.buffered.length-1)/video.duration)+")";
    });
},500);