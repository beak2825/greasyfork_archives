// ==UserScript==
// @name         YouTube - Ad Skip
// @version      1.0
// @description  Skips and removes ads on YouTube automatically
// @author       Bobocato
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/167089
// @downloadURL https://update.greasyfork.org/scripts/40178/YouTube%20-%20Ad%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/40178/YouTube%20-%20Ad%20Skip.meta.js
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