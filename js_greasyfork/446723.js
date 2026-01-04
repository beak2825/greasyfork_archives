// ==UserScript==
// @name         Amazon Video AD Blocker
// @namespace    https://greasyfork.org/en/users/927303-rawmeateater
// @version      0.2
// @description  Made in June 19 2022 For Amazon Prime Videos. If anything you might see a millisecond of the AD.
// @author       RawMeatEater
// @license      MIT
// @match        https://www.amazon.com/Amazon-Video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446723/Amazon%20Video%20AD%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/446723/Amazon%20Video%20AD%20Blocker.meta.js
// ==/UserScript==

// This code may not be the most optimized, but it works lol
(function() {
    'use strict';
    // This value when true shows that the ad has been skipped
    var adSkipped=false;

    // Every 0.2 seconds, this function runs
    setInterval(function(){
        // Selects the video container's child (Which is the video element)
        var video=document.getElementsByClassName("rendererContainer")[0].firstChild;
        // If the "Your program resumes in " element exist
        if(document.getElementsByClassName("atvwebplayersdk-adtimeindicator-text")[0]){
            // Has it been skipped aready? (This is so that way you don't skip forward twice)
            if(adSkipped==false){
                // Grabs the ad timer and converts it into a integer
                var currentAdTime=parseInt(document.getElementsByClassName("atvwebplayersdk-adtimeindicator-text")[0].innerHTML.replace('Your program resumes in ', '').replace(" sec",""));
                // It then skipped forward the video by how much ad time the timer shows
                video.currentTime=video.currentTime+currentAdTime;
                // Shows that the ad has been skipped
                adSkipped=true;
            }
        }else{
            // When ad timer disappers, reset the ad skip value
            adSkipped=false;
        }
    // When 200 milliseconds pass, execute script
    },200);

})();