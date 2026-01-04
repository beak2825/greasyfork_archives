// ==UserScript==
// @name         Youtube End Timer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  A script that lets you know the time when a youtube video will end.
// @author       You
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462803/Youtube%20End%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/462803/Youtube%20End%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

function getDateFromHours(time) {
    if(time.length < 6)
        time = "00:" + time;
    time = time.split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}


function dateToString(time) {
    let datetext = time.toTimeString().split(' ')[0];
    let dateArr = datetext.split(':');

    return dateArr[0] + ":" + dateArr[1];
}

function getSpeed(){
        return video.playbackRate;
}

function setEndTime(){
    let diff = (video.duration - video.currentTime) * 1000;
    let endDate = new Date(Date.now() + Math.round(diff/getSpeed()) );
    span.textContent = "Ends at " + dateToString(endDate);
}

function startUp(){
    span = document.getElementById("ytp-time-end");
    if(!span){
        span = document.createElement("span");
        span.setAttribute("id", "ytp-time-end");
        span.setAttribute("style", "padding-left:10px; color:#ddd;");
        document.getElementsByClassName("ytp-time-duration")[0].insertAdjacentElement("afterend", span);
    }

     video = document.getElementsByClassName("html5-video-container")[0]
    .getElementsByClassName("video-stream html5-main-video")[0];
    video.addEventListener('timeupdate', setEndTime);
    video.addEventListener('ratechange', setEndTime);
    setEndTime();
}

document.body.addEventListener("yt-navigate-finish", function(event) {
    startUp();
});

let span;
let video;
let interval = setInterval(function(){setEndTime();}, 30000);


})();