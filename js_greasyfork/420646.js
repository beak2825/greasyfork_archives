// ==UserScript==
// @name         LeftRightArrowForVideo
// @namespace    butaixianran
// @version      0.1
// @description  Add left/right arrow hotkey to backward/forward 5 seconds for chrome's default video player. For example, videos on twitter or personal site
// @author       butaixianran
// @homepage     https://github.com/butaixianran/LeftRightArrowForVideo
// @match        *://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://vimeo.com/*
// @exclude      *://*.instagram.com/*
// @exclude      *://*.bilibili.com/*
// @exclude      *://*.acfun.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420646/LeftRightArrowForVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/420646/LeftRightArrowForVideo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Execute when the whole page has loaded
    window.onload = function(){

        //Bind left and right hotkey
        document.onkeydown = function(e) {
            //console.log("Add Left and Right hotkey to video tag");

            //get all video tags
            let videos = document.querySelectorAll('video');

            //return if there is no video
            if(!videos) {
                console.log("can not find video");
                return;
            }
            if(!videos.length) {
                console.log("videos.length is 0");
                return;
            }

            //Find first video tag in viewport area.
            //For example, there gonna be a lot of videos on one twitter page,
            //we only need the first video in viewport area.

            //define current video
            let currentVideo = null;
            //for saving video position and size
            let videoRect = null;
            //loop on all videos
            for (let video of videos) {
                //get video position and size
                videoRect = video.getBoundingClientRect();
                //get video's left-top position and compare it to viewport size
                if(videoRect.top >= 0 && videoRect.top <= window.innerHeight) {
                    //now, this video is the first one in viewport
                    currentVideo = video;
                    //don't need other videos
                    break;
                }

            }




            let currentTime = currentVideo.currentTime;

            //console.log("currentTime: " + currentTime);

            //check key code
            switch(e.which) {
                case 37: // left
                    //console.log("pressed Left");
                    currentVideo.currentTime = ((currentTime-5)<0)?0:(currentTime-5);
                    break;

                case 39: // right
                    //console.log("pressed Right");
                    currentVideo.currentTime = ((currentTime+5)>currentVideo.duration)?currentVideo.duration:(currentTime+5);
                    break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)

            //console.log("new time: " + currentVideo.currentTime);
        };

    };



})();
