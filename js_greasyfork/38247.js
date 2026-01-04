// ==UserScript==
// @name         Xhamster Progressbar Updater (@include FR etc...) v.1
// @version      1.01
// @description  Forces the Xhamster progress bar to update even when it's supposed to be hidden.
// @icon       https://external-content.duckduckgo.com/ip3/fr.xhamster.com.ico
// @namespace https://greasyfork.org/en/users/7434-janvier56


// @match        https://xhamster.com/videos/*
// @match        https://*.xhamster.com/videos/*
// .xplayer.no-user-action .progress-bar .seeker

// @grant        none
// @namespace https://greasyfork.org/users/14014

// FROM - https://greasyfork.org/fr/scripts/11486-youtube-progressbar-updater

// @downloadURL https://update.greasyfork.org/scripts/38247/Xhamster%20Progressbar%20Updater%20%28%40include%20FR%20etc%29%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/38247/Xhamster%20Progressbar%20Updater%20%28%40include%20FR%20etc%29%20v1.meta.js
// ==/UserScript==

var findVideoInterval = setInterval(function() {

//    var ytplayer = document.querySelector(".html5-video-player:not(.addedupdateevents)");
var ytplayer = document.querySelector(".xplayer.no-user-action");
    if (!ytplayer) {
        return;
    }

//    ytplayer.className+=" addedupdateevents";
//ytplayer.className+=" no-user-action";

    var video = ytplayer.querySelector("video");

// BUFFER
//    var progressbar = ytplayer.querySelector(".ytp-play-progress");
var progressbar = ytplayer.querySelector(".xplayer.no-user-action .xp-progress-bar .seeker .buffer");

// FILLER
//    var loadbar = ytplayer.querySelector(".ytp-load-progress");
var loadbar = ytplayer.querySelector(".xplayer.no-user-action .xp-progress-bar .seeker .filler");

// HANDLE
//    var loadbar = ytplayer.querySelector(".ytp-load-progress");
var handle = ytplayer.querySelector(".xplayer.no-user-action .xp-progress-bar .seeker .handle");

//    if (!video || !progressbar || !loadbar) {
if (!video || !progressbar || !loadbar || !handle) {
        return;
    }
    video.addEventListener("timeupdate",function() {
        progressbar.style.transform = "scaleX("+(video.currentTime/video.duration)+")";
    });
    video.addEventListener("progress",function() {
        loadbar.style.transform = "scaleX("+(video.buffered.end(video.buffered.length-1)/video.duration)+")";
    });
},500);