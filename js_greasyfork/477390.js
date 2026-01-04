//New script available!
//[BETA] Youtube NO preroll ads, Bypass new restrictions!
//download: https://greasyfork.org/en/scripts/477464-beta-youtube-no-preroll-ads-bypass-new-restrictions



// ==UserScript==
// @name         Remove Youtube Adblock Warnings!
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  No more 'Ad blockers are not allowed on YouTube'
// @author       coder369
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477390/Remove%20Youtube%20Adblock%20Warnings%21.user.js
// @updateURL https://update.greasyfork.org/scripts/477390/Remove%20Youtube%20Adblock%20Warnings%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var player = document.getElementById("movie_player");
    var closeit = setInterval(function() {
        if(document.getElementsByClassName("style-scope ytd-popup-container").length > 0 && document.getElementById("dismiss-button")&& document.getElementById("divider"))
        {
            setTimeout(function(){
                document.getElementById("dismiss-button").click();
                document.getElementsByClassName("ytp-play-button ytp-button")[0].click();
                console.log("banner closed");
                clearInterval(closeit);
            }, 4000);
        }
    }, 300);
})();