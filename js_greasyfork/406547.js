// ==UserScript==
// @name         youtube Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @require https://code.jquery.com/jquery-2.1.4.min.js

// @author       You
// @include       https://www.youtube.com/watch?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406547/youtube%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/406547/youtube%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){

        var ads = document.getElementById("ad-text:s");

        if(ads != undefined){
            ads.click()
        }

        // 全屏广告
        if(document.getElementsByClassName("ytp-ad-skip-button ytp-button") != undefined && document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0]!= undefined){
           document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0].click()
        }
        // 底部广告
        var adsMini = document.getElementsByClassName("ytp-ad-overlay-close-button");
        if(adsMini != undefined && adsMini[0]!==undefined){
            adsMini[0].click()
        }


    },2000)

})();