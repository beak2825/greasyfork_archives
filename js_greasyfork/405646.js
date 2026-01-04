// ==UserScript==
// @name         Instagram video player with basic control of volume and skipping.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Emerlender
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405646/Instagram%20video%20player%20with%20basic%20control%20of%20volume%20and%20skipping.user.js
// @updateURL https://update.greasyfork.org/scripts/405646/Instagram%20video%20player%20with%20basic%20control%20of%20volume%20and%20skipping.meta.js
// ==/UserScript==

(function() {
    'use strict';
            console.log('Here you go enjoy your democracy at instagram with full control of player, Trump 2020 KEKW')
            var videoList = document.getElementsByTagName("video");
    setInterval(function(){
            if(videoList[0]){
        videoList[0].setAttribute("controls", "controls");
        videoList[0].style.zIndex = "1";
            }
    }, 1000);
})();