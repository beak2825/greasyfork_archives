// ==UserScript==
// @name         Youtube Boost Limiter
// @version      1.0.0
// @description  A Youtube Boost Limiter
// @author       blmds
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/943808
// @downloadURL https://update.greasyfork.org/scripts/494045/Youtube%20Boost%20Limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/494045/Youtube%20Boost%20Limiter.meta.js
// ==/UserScript==

var prevBoost, boost = 1;
var pregainNode, masterGainNode, limiterNode;
var audioCtx, source;
var isSetup = false;
var disconnected = false;
var player;

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForElmChange(selector) {
    return new Promise(resolve => {
        // if (document.querySelector(selector)) {
        //     return resolve(document.querySelector(selector));
        // }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                // observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.querySelector(selector), {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,

        });
    });
}

// waitForElm('#movie_player').then((elm) => {
//     console.log("new video!!!!!!");
//     console.log(elm.getStatsForNerds(0).volume.match(/-([\d.]+)dB/));
//     waitForElmChange('#movie_player').then((elm) => {
// console.log(elm.getStatsForNerds(0).volume.match(/-([\d.]+)dB/));
//     });
// });

waitForElm('.video-stream.html5-main-video').then((elm) => {
    player = elm;
    console.log('Element is ready');

    // console.log(elm.textContent);
    player.addEventListener("playing", function() {

        boost = readVolume();
        console.log("readVolume");
        if (!isSetup) {
            isSetup = true;
            setUpAudio();
            console.log("setUpAudio");
        }
        if (prevBoost != boost) {
            // source = audioCtx.createMediaElementSource(player);
            changeVolume();
            console.log("changeVolume");
            prevBoost = boost;
        }
    });
});

// document.addEventListener("spfready", function() {
//     //your code
//     console.log("new video");
//     //     console.log("clear");
//     player = document.querySelector(".video-stream.html5-main-video");
//     if (!player) {
//         console.log("no player");
//         return;
//     }
//     player.addEventListener("playing", function() {

//         boost = readVolume();
//         console.log("readVolume");
//         if (!isSetup) {
//             isSetup = true;
//             setUpAudio();
//             console.log("setUpAudio")
//         }
//         changeVolume();
//         console.log("changeVolume")
//     }, { once: true });
// });

// document.addEventListener('yt-navigate-start', function(){ console.log('document.yt-navigate-start', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-navigate-finish', function(){ console.log('document.yt-navigate-finish', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-navigate-error', function(){ console.log('document.yt-navigate-error', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-navigate-redirect', function(){ console.log('document.yt-navigate-redirect', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-navigate-cache', function(){ console.log('document.yt-navigate-cache', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-navigate-action', function(){ console.log('document.yt-navigate-action', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-navigate-home-action', function(){ console.log('document.yt-navigate-home-action', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-page-data-fetched', function(){ console.log('document.yt-page-data-fetched', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('DOMContentLoaded', function(){ console.log('document.DOMContentLoaded', document.querySelector(".video-stream.html5-main-video"))})
// document.addEventListener('yt-player-updated', function(){ console.log('document.yt-page-data-fetched', document.querySelector(".video-stream.html5-main-video"))})
(function() {
    'use strict';
    //       document.querySelector(".video-stream.html5-main-video").addEventListener("abort", function() {console.log("abort")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("canplay", function() {console.log("canplay")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("canplaythrough", function() {console.log("canplaythrough")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("durationchange", function() {console.log("durationchange")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("emptied", function() {console.log("emptied")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("encrypted", function() {console.log("encrypted")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("ended", function() {console.log("ended")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("error", function() {console.log("error")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("loadeddata", function() {console.log("loadeddata")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("loadedmetadata", function() {console.log("loadedmetadata")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("loadstart", function() {console.log("loadstart")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("pause", function() {console.log("pause")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("play", function() {console.log("play")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("playing", function() {console.log("playing")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("progress", function() {console.log("progress")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("ratechange", function() {console.log("ratechange")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("seeked", function() {console.log("seeked")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("seeking", function() {console.log("seeking")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("stalled", function() {console.log("stalled")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("suspend", function() {console.log("suspend")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("timeupdate", function() {console.log("timeupdate")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("volumechange", function() {console.log("volumechange")}, { once: true });
    // document.querySelector(".video-stream.html5-main-video").addEventListener("waiting", function() {console.log("waiting")}, { once: true });

})();

var stats;
// Your code here...
function readVolume() {
    if (!stats) stats = document.getElementById("movie_player");
    var volume = stats.getStatsForNerds(0).volume.match(/-([\d.]+)dB/);
    if (!volume) return 1;
    return 2 ** (volume[1] / 6);
}
function setUpAudio() {
    // Create AudioContext
    audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(player);
    // unsafeWindow.audioCtx = audioCtx;
    pregainNode = audioCtx.createGain();
    // console.log("add source");
    // unsafeWindow.pregainNode = pregainNode;

    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(0.9, audioCtx.currentTime);  // Amount of gain in db -infinity to +infinity. -0.3 leaves a little headroom.

    limiterNode = audioCtx.createDynamicsCompressor();
    // Creating a compressor but setting a high threshold and
    // high ratio so it acts as a limiter. More explanation at
    // https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
    limiterNode.threshold.setValueAtTime(-5.0, audioCtx.currentTime); // In Decibels
    limiterNode.knee.setValueAtTime(0, audioCtx.currentTime); // In Decibels
    limiterNode.ratio.setValueAtTime(20.0, audioCtx.currentTime);  // In Decibels
    limiterNode.attack.setValueAtTime(0, audioCtx.currentTime); // Time is seconds
    limiterNode.release.setValueAtTime(0.01, audioCtx.currentTime); // Time is seconds

    source.connect(pregainNode);
    // pregainNode.connect(masterGainNode);
    // masterGainNode.connect(audioCtx.destination);
    pregainNode.connect(limiterNode);
    limiterNode.connect(masterGainNode);
    masterGainNode.connect(audioCtx.destination);
}
function changeVolume() {
    pregainNode.gain.value = boost;
    if (boost == 1 && !disconnected) {
        source.connect(audioCtx.destination);
        masterGainNode.disconnect();
        disconnected = true;
        console.log("disconnected");
    } else {
        if (disconnected) {
            source.disconnect();
            source.connect(pregainNode);
            // pregainNode.connect(masterGainNode);
            // masterGainNode.connect(audioCtx.destination);
            // pregainNode.connect(limiterNode);
            // limiterNode.connect(masterGainNode);
            masterGainNode.connect(audioCtx.destination);
            disconnected = false;
            console.log("connected");
        }
    }
}