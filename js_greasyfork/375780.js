// ==UserScript==
// @name           Amazon video skip ads
// @name:ja        Amazon video 自動広告スキップ
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    Automatically skip ad by Amazon video.
// @description:ja Amazon video の広告を自動的にスキップ
// @author         6uclz1
// @match          https://www.amazon.co.jp/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/375780/Amazon%20video%20skip%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/375780/Amazon%20video%20skip%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        //Skip Ad
        var adSB_UserScript = document.getElementsByClassName("adSkipButton")[0];
        if(typeof(adSB_UserScript) != "undefined"){
            if(adSB_UserScript.className.split(" ")[1] == "skippable"){
                console.log("Skip that ad");
                adSB_UserScript.click();
            }
        }
    }, 1500);
})();