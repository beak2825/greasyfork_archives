// ==UserScript==
// @name         Tuituisoft autoplay
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        *tuituisoft.com/viewvideo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374945/Tuituisoft%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/374945/Tuituisoft%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var i = 0;
    var interval = setInterval(autoPlay, 200);

    function autoPlay(){
        i++;
        var videos = document.getElementsByTagName('video');
        if(videos.length) {
            var video = videos[0];
            video.startTime = 6;
            video.play();
            setTimeout(function(){
                var video = document.getElementsByTagName('video')[0];
                video.playbackRate = 2;
                video.volume = 1;
                video.addEventListener("ended",function(){$('.player-menu-bn a')[1].click();});
            }, 500);
            clearInterval(interval);
            //alert(i);
        }
        if(i>100){
            clearInterval(interval);
            alert("error");
        }
    }
})();