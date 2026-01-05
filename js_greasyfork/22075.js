// ==UserScript==
// @name         Wifog auto ad viewer
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Automatically starts wifog ads.
// @author       Chawan
// @match        portal.wifog.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22075/Wifog%20auto%20ad%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/22075/Wifog%20auto%20ad%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#video").ready(function() {
        console.log("Wifog ad viewer loaded");

        if (document.body.textContent.toLowerCase().indexOf("vi hittade ingen enkät") > -1) {
            console.log("This is the survey page, don't start the bot");
        } else {
            if (document.body.textContent.toLowerCase().indexOf("försök igen i morgon") > -1) {
                console.log("No more ads for today");
                var a = new Audio("http://198.199.75.220/done.wav");
                a.play();
            }

            if (document.body.textContent.toLowerCase().indexOf("vi hittade tyvärr ingen reklamfilm") > -1) {
                console.log("No ad available at the moment, refreshing in 2 minutes");
                var waitForAd = setInterval(function() {
                    window.location.href = "http://portal.wifog.com/";
                    clearInterval(waitForAd);
                }, 120000);
            }

            var checkExist = setInterval(function() {
                if ($("#video").length) {
                    console.log("Found the video element");
                    clearInterval(checkExist);
                    startAd();
                }
            }, 100);
            
            var checkFlashExist = setInterval(function() {
                if ($("#video-cont").length) {
                    if(document.getElementById("video-cont").style.display !== "none") {
                        console.log("Found flash based ad");
                        clearInterval(checkFlashExist);
                        startFlashAd(); 
                    }
                }
            }, 100);
        }



    });

    
    function startFlashAd() {
        var videoDiv = document.getElementById("video-cont");
        
        if (videoDiv !== null) {
            console.log("Starting ad");
            videoDiv.click();
        }
    }

    function startAd() {
        var videoWrapper = document.getElementById("video-cont");
        var videoElement = document.querySelector("video");

        console.log(videoElement.paused);

        if (videoElement !== null) {
            console.log("Muting video");
            videoElement.muted = true;
            
            if(videoElement.paused) {
                console.log("Ad not playing, starting it");
                videoWrapper.click();
            }
        }
    }
})();