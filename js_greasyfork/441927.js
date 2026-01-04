// ==UserScript==
// @name         Twitch pause autoplay
// @namespace    https://github.com/etshy
// @icon         https://www.twitch.tv/favicon.ico
// @version      1.0.4
// @description  Pause stream/video in the channel and video-list page
// @author       Etshy
// @exclude      https://www.twitch.tv/videos/*
// @match        https://www.twitch.tv/*
// @supportURL   https://gist.github.com/etshy/325d00b7487cae4ad45569f4f6b1bdb8
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441927/Twitch%20pause%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/441927/Twitch%20pause%20autoplay.meta.js
// ==/UserScript==

/* jshint esversion:6 */

window.onload = function() {
    let active = 1;
    
    let interval = setInterval(function(){
        if (active === 0) {
            return;
        }
        let liveVideo = document.querySelector('.channel-root--live')
        let liveVideoHome = document.querySelector('.channel-root--home')
        if (liveVideo && (!liveVideoHome || liveVideoHome === null)) {
            //we are on live page video
            let videoPlayer = document.querySelector('video')
            if (videoPlayer.paused) {
                videoPlayer.play()
                active = 0;
            }
            return;
        }
        if (!window.location.href.startsWith('https://www.twitch.tv/videos/') || (liveVideoHome && liveVideoHome !== null)) {
            let videoPlayer = document.querySelector('video')
            if (videoPlayer.paused === false) {
                videoUrlLoaded = videoPlayer.src
                videoPlayer.pause();
                active = 0;
            }
        }
        if (window.location.href.startsWith('https://www.twitch.tv/videos/')) {
            let videoPlayer = document.querySelector('video')
            if (videoPlayer.paused) {
                videoPlayer.play()
                active = 0;
            }
        }
    }, 100);
    window.addEventListener('popstate', function (event) {
	    active = 1;
    });
};
