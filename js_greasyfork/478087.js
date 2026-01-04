// ==UserScript==
// @name         Skip YouTube Ads After Update
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Educational Purposes. Disable your Adblock on YT, this script will do it for you!
// @author       github:AlexanderDotEXE
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478087/Skip%20YouTube%20Ads%20After%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/478087/Skip%20YouTube%20Ads%20After%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
     checkForAds();

    function checkForAds(){
        setInterval(() =>{
        //console.log('checked for ad');
        const adButton = document.getElementsByClassName("ytp-ad-text ytp-ad-preview-text");
        var adButtons = document.getElementsByClassName("ytp-ad-skip-button ytp-button");
        //console.log(adButton.length);
        if(adButton != null && adButton.length > 0){
            //document.getElementById('efyt-not-interested').click();
            //For all ads
            document.querySelector('video').currentTime = document.querySelector('video').duration;

            //For so called unskipable ads ;)
            adButtons[0].click();
            console.log('Alexander made your Day :]');
        }
        }, 500)
    }
})();
