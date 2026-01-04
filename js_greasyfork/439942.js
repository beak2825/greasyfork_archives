// ==UserScript==
// @name         Auto hide Youtube controls when paused
// @namespace    https://greasyfork.org/
// @version      1.3
// @description  Automatically hide youtube control bar when pause ( Embedded videos included ). If desired, control bar can be made visible again, with the mouse movement. Pressing the space key or the right-left arrow keys ensures that the control bar remains hidden during pause. if the script doesn't work properly, reflesh web page .
// @author       TimFx
// @include      https://*.youtube*.com/embed/*
// @include      https://*.youtube.com/watch?v=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439942/Auto%20hide%20Youtube%20controls%20when%20paused.user.js
// @updateURL https://update.greasyfork.org/scripts/439942/Auto%20hide%20Youtube%20controls%20when%20paused.meta.js
// ==/UserScript==

(function() {
    var timer;
     document.addEventListener('keydown', function(e){
        if (e.keyCode === 32 || e.keyCode === 39 || e.keyCode === 37 ) {
        if(document.getElementsByClassName("html5-video-player")[0].classList.contains("ytp-autohide")){
        document.getElementsByClassName("html5-video-player")[0].classList.remove("ytp-autohide");
        }
        clearTimeout(timer);
        timer = setTimeout(noAction, 0);
        }
    });

    document.addEventListener('mousemove', function(){
        if(document.getElementsByClassName("html5-video-player")[0].classList.contains("ytp-autohide")){
        document.getElementsByClassName("html5-video-player")[0].classList.remove("ytp-autohide");
        }
        clearTimeout(timer);
        timer = setTimeout(noAction, 500);
    });

    function noAction(){
        if(!document.getElementsByClassName("html5-video-player")[0].classList.contains("ytp-autohide")){
        document.getElementsByClassName("html5-video-player")[0].classList.add("ytp-autohide");
        }
    }
})();

