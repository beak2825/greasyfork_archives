// ==UserScript==
// @name         YouTube Ad Auto Report
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This Script is going to check for ad on YouTube every 200ms and if it find's one it will automatically report it which results in successfully skipping it. (NOT WORKING WITH AD PERSONALISATION TURNED OFF!!!)
// @author       You
// @include      http://www.youtube.com/watch*
// @include      https://www.youtube.com/watch*
// @include      youtube.com/watch*
// @include      http://www.youtube.com/*
// @include      https://www.youtube.com*
// @include      youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433448/YouTube%20Ad%20Auto%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/433448/YouTube%20Ad%20Auto%20Report.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function skipAds() {
    if (document.getElementsByClassName("ytp-ad-overlay-close-button").length != 0){
        document.getElementsByClassName("ytp-ad-overlay-close-button")[0].click();
    }
    if (document.getElementsByClassName("ytp-ad-button ytp-ad-button-link ytp-ad-clickable").length != 0) {
        document.getElementsByClassName("ytp-ad-button ytp-ad-button-link ytp-ad-clickable")[0].click();
        sleep(50);
        document.getElementsByClassName("ytp-ad-button ytp-ad-info-dialog-mute-button ytp-ad-button-link")[0].click();
        sleep(50);
        document.getElementsByClassName("ytp-ad-feedback-dialog-reason-input")[0].click();
        sleep(50);
        document.getElementsByClassName("ytp-ad-feedback-dialog-confirm-button")[0].click();
        console.log("SkippedAd");
    }
}


var start = function() {
    setInterval(function () {
        skipAds();
    }, 200);
}
document.onload = start();