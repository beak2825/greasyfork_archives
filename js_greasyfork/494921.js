// ==UserScript==
// @name         jut.su Player Ads
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove Player Ads
// @author       SaSh0o0k
// @license      MIT
// @match        https://jut.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jut.su
// @include      http*://jut.su/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494921/jutsu%20Player%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/494921/jutsu%20Player%20Ads.meta.js
// ==/UserScript==

setTimeout(function() {
    var adContainer = document.getElementById('my-player_ima-ad-container');
    if (adContainer) {
        adContainer.remove();
    }
}, 1000);

// setInterval(function() {
//     var adContainer = document.getElementById('my-player_ima-ad-container');
//     if (adContainer) {
//         adContainer.remove();
//     }
// }, 1000);

// setInterval(function() {
//     var video = document.querySelector('video[title="Advertisement"]');
//     if (video) {
//         video.pause();
//         video.style.display = 'none';
//         video.volume = 0;
//     }
// });

// setInterval(function() {
//    var videos = document.querySelectorAll('video');
//    videos.forEach(function(video) {
//        video.style.display = 'none';
//        video.volume = 0;
//    });
// }, 1000);
