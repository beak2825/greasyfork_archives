// ==UserScript==
// @name         AmazonVideo Speed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Saves the set playback speed on Netflix
// @author       Bobocato
// @match        https://www.amazon.de/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40174/AmazonVideo%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/40174/AmazonVideo%20Speed.meta.js
// ==/UserScript==

function setEvents(video){
    //Safe Playback Rate
    video.onratechange = function() {
        var speedup = video.playbackRate - localStorage.getItem("playrate");
        if((Math.round(speedup *10)/10) == 0.1 ||(Math.round(speedup *10)/10) == -0.1 ){
            localStorage.setItem("playrate", video.playbackRate);
        }
    };

    //Set volume and playbackrate as soon as video starts playing
    video.onplaying = function() {
        if (localStorage.getItem("playrate") !== null){
            video.playbackRate = localStorage.getItem("playrate");
        }
    };
}

function setSettings(video){
    if (localStorage.getItem("playrate") !== null){
        video.playbackRate = localStorage.getItem("playrate");
    }
}

(function() {
    'use strict';
    setInterval(function(){
        var video = document.getElementsByTagName("video");
        for(var i = 0; i < video.length; i++){
            if(typeof(video[i]) != "undefined"){
                setEvents(video[i]);
                setSettings(video[i]);
            }
        }
    }, 2500);
})();