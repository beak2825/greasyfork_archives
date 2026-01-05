// ==UserScript==
// @name         YouTube Always show progress bar
// @version      0.2
// @description  Always show progress bar
// @author       Workgroups
// @match        *://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/127290
// @downloadURL https://update.greasyfork.org/scripts/30046/YouTube%20Always%20show%20progress%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/30046/YouTube%20Always%20show%20progress%20bar.meta.js
// ==/UserScript==
var style = document.createElement('style');
style.type = 'text/css';
//style.innerHTML = '.ytp-autohide .ytp-chrome-bottom{opacity:1!important;width:100%!important;left:0!important}.ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container{bottom:-1px!important}.ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls{opacity:0!important}';
style.innerHTML = '.ytp-autohide .ytp-chrome-bottom{opacity:1!important;width:100%!important;left:0!important;display:block!important}.ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container{bottom:-1px!important}.ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls{opacity:0!important}';

document.getElementsByTagName('head')[0].appendChild(style);

var findVideoInterval = setInterval(function() {
    var ytplayer = document.querySelector(".html5-video-player:not(.addedupdateevents)");
    if (!ytplayer) {
        return;
    }
    clearInterval(findVideoInterval);
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