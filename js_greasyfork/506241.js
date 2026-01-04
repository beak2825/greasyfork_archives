// ==UserScript==
// @name         TF Youtube
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  YouTube's popups? They don't bother you, and they definitely don't bother me.
// @author       koisi._.704
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506241/TF%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/506241/TF%20Youtube.meta.js
// ==/UserScript==
function we_need_a_cool_name_for_the_function() {
    const dialogElement = document.querySelector('tp-yt-paper-dialog[style-target="host"][role="dialog"]');
    const videoElement = document.querySelector('video.video-stream.html5-main-video');

    if (dialogElement) {
        dialogElement.remove();
        console.log("I removed one popup for you.");
        if (videoElement && videoElement.paused) {
            videoElement.play();
            console.log("playing.");
        }
    }
}

setInterval(we_need_a_cool_name_for_the_function, 1000);
