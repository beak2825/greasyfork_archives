// ==UserScript==
// @name         YouTube - Pause background videos
// @namespace    q1k
// @version      1.0.1
// @description  Pause videos playing in other background tabs. When you start playback of a video in foreground tab, background playback will be paused.
// @author       q1k
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463632/YouTube%20-%20Pause%20background%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/463632/YouTube%20-%20Pause%20background%20videos.meta.js
// ==/UserScript==

function findElement(selector) {
    return new Promise(function(resolve) {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(function(mutations) {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

var video;
const channel = new BroadcastChannel("video-channel");

findElement("#player #movie_player video").then(function(el){
    video = el;
    /*if(!!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2)) {
        channel.postMessage("pause");
    }*/
    Object.defineProperty(el, 'isplaying', {
        get: function(){
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        }
    });
    video.addEventListener("playing",function(){
        //start play, send pause
        if(document.hasFocus()){
            channel.postMessage("pause");
        }
    })
});

channel.addEventListener("message",function(ev){
    if(ev.data=="pause"){
        //received pause
        if(!document.hasFocus()){ //ignore if tab is active
            if(video.isplaying) {
                video.pause();
            }
        }
    }
});

