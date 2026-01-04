// ==UserScript==
// @name         YouTube Skipper
// @version      1.2
// @description  This script will automatically skip all video ads on YouTube. Works best with an AdBlocker installed. 
// @author       GeloZP
// @match        https://www.youtube.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/700355
// @downloadURL https://update.greasyfork.org/scripts/423725/YouTube%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/423725/YouTube%20Skipper.meta.js
// ==/UserScript==

const equalText1 = "Skip Ads";
const equalText2 = "Skip Ad";

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

function skipAd(){
    console.log("Tried to skip a ad");
    if(document.getElementsByClassName("ytp-ad-skip-button").length > 0){
        if(document.getElementsByClassName("ytp-ad-skip-button")[0].childNodes[0].textContent === equalText1 || document.getElementsByClassName("ytp-ad-skip-button")[0].childNodes[0].textContent === equalText2){
            document.getElementsByClassName("ytp-ad-skip-button")[0].click();
        } else {
            setTimeout(skipAd(), 1000);
        }
    }
}

(function() {
    'use strict';
    addNewStyle('.ytp-ad-overlay-slot {display:none !important;}');
    setInterval(function (){
        if(window.location.href.substring(0,30) == "https://www.youtube.com/watch?"){
            skipAd();
        }
    }, 2500);
})();