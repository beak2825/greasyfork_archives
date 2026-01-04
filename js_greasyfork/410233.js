// ==UserScript==
// @name        Youtube Default SpeedUp Playback Rate
// @version     2.02
// @namespace   XcomeX
// @author      XcomeX
// @license     Copyleft (Ɔ) GPLv3
// @description Set default playback rate to 2x. And disable annotations. Based on Jason Miller source.
// @source      https://webapps.stackexchange.com/a/136744
// @match       *://*youtube.com/*
// @run-at      document-start
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410233/Youtube%20Default%20SpeedUp%20Playback%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/410233/Youtube%20Default%20SpeedUp%20Playback%20Rate.meta.js
// ==/UserScript==

// in DevConsole you can set speed up to 4x:
// document.getElementsByTagName("video")[0].playbackRate = 4;

var defaultSpeed = '2';
var excludedChNames = [
    "Next Excluded Channel Name",
    "Play Always 1x Speed Channel",
    "...",
    "..",
    ".",
];

/******************************************************************/
// default speed-up
sessionStorage.setItem("yt-player-playback-rate", JSON.stringify({
    "data": defaultSpeed,
    "creation": Date.now(),
}));
slowSpeedForExcluded_waitOnVideoLoadAsync();



// wait for video loaded and set speed 1x for excluded channel by name
async function slowSpeedForExcluded_waitOnVideoLoadAsync(numberOfTriesDone=1) {
    let promise = new Promise((res, rej) => {
        setTimeout(() => res("Promise 250ms done!"), 250)
    });

    // wait until the promise returns us a value
    let result = await promise;
    var video = document.querySelector('.html5-main-video');
    var chNameEl = document.querySelector('yt-formatted-string.ytd-channel-name > a.yt-simple-endpoint');
    if ( chNameEl && video && video.readyState === 4 ) {
        setSlowSpeedForExcluded(video);
        disableAnnotations();
    } else {
        if (numberOfTriesDone <= 40) {
            numberOfTriesDone += 1;
            slowSpeedForExcluded_waitOnVideoLoadAsync(numberOfTriesDone);
        } else {
            console.log("Page loading timeout for 'slow speed playback' expired!");
        }
    }
}


function setSlowSpeedForExcluded(video) {
    var chName = document.querySelector('yt-formatted-string.ytd-channel-name > a.yt-simple-endpoint').innerHTML;
    var isExcluded = excludedChNames.indexOf(chName) >= 0 ? true : false;
    if (isExcluded) {
        video.playbackRate = 1;
        console.log("playback speed: 1x");
    } else {
        console.log("playback speed: "+defaultSpeed+"x");
    }
}

function disableAnnotations() {
    var settings_button = document.querySelector(".ytp-settings-button");
    settings_button.click(); settings_button.click(); // open and close settings, so annotations label is created

    var all_labels = document.getElementsByClassName("ytp-menuitem-label");
    for (var i = 0; i < all_labels.length; i++) {
        if ((all_labels[i].innerHTML == "Annotations") && (all_labels[i].parentNode.getAttribute("aria-checked") == "true")) { // find the correct label and see if it is active
            all_labels[i].click(); // and in that case, click it
        }
    }
}