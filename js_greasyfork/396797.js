// ==UserScript==
// @name         KimCartoon AutoPlay by ImFalling
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autoplay and auto-fullscreen next episode on kimcartoon.to
// @author       ImFalling @ GitHub
// @match        https://kimcartoon.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396797/KimCartoon%20AutoPlay%20by%20ImFalling.user.js
// @updateURL https://update.greasyfork.org/scripts/396797/KimCartoon%20AutoPlay%20by%20ImFalling.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Get the video player
    var video = document.querySelector("#my_video_1_html5_api");
    //Set time variables
    var durationValue = video.duration;
    var currentValue = video.currentTime;
    //Variable to ensure the script will not spam the "next" link. KimCartoon detects bots through this type of request spam.
    var clicked = false;

    //Define margin of video end in seconds
    var margin = 3;
    //Define interval of script trigger in milliseconds
    var interval = 4000;

    //Make the video player cover the entire page, since actual auto-fullscreen is disabled in browsers due to security issues.
    video.style.position = "fixed";
    video.play();
    video.controls = true;

    document.body.style.overflowY = "hidden";

    function disableScript(){
        video.style.position= "relative";
        document.body.style.overflowY = "scroll";
        clearInterval(checkOver);
        video.controls = false;
    }

    function checkOver(){
        //Update time values
        currentValue = video.currentTime;
        durationValue = video.duration;

        //DEBUG STUFF
        /*console.log("Right time: " + currentValue + " >= " + durationValue + "?");
        console.log(currentValue >= durationValue);
        console.log("Has clicked: ");
        console.log(clicked);*/

        //Check if episode is over, and if the next link has not yet been clicked.
        if(currentValue >= durationValue - margin && !clicked){
            var next = document.querySelector("#myContainer > div:nth-child(2) > a:nth-child(2)");
            if(next != null){
                next.click()
            }
            else{
                if(confirm("Could not find 'Next' button on page. Perhaps this was the last episode?\nDisable the script for this page?")){
                    disableScript();
                }
            }
            clicked = true;

        }
    }

    setInterval(checkOver, interval);

    video.addEventListener("pause", function(e){
        if(confirm("Press OK to disable the script. Otherwise, press cancel.")){
           disableScript();
        }
    }, false);
})();