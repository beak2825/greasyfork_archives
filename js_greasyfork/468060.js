// ==UserScript==
// @name         Redz Ad Skipper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Skipz Ads For You!
// @author       TheMrRedSlime
// @match        https://*.youtube.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?domain=youtube.com&sz=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468060/Redz%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/468060/Redz%20Ad%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("TheMrRedSlime's Youtube ad skipper running. Enjoy!")
    const adrloop = setInterval(youtubeadzskipr, 500);
    const adloop = setInterval(autoskipr, 500);

    function youtubeadzskipr(){
        if(document.querySelector("div.ad-showing")){
            var adzlol = document.querySelector('video');
            adzlol.currentTime = adzlol.duration;
            document.getElementsByClassName("ytp-ad-skip-button")[0].click()
            setTimeout(()=> { document.getElementsByClassName("ytp-ad-skip-button")[0].click() },500);
        }
    }
    function autoskipr(){
    if(document.getElementsByClassName("ytp-ad-skip-button") != null){ document.getElementsByClassName("ytp-ad-skip-button")[0].click() }
    }
})();