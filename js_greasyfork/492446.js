// ==UserScript==
// @name         mytube
// @namespace    http://tampermonkey.net/
// @version      2024-04-13
// @description  Skip youtube video ads duration < 180 seconds and banners. Tested on FIrefox 
// @author       player27
// @match        *://*.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492446/mytube.user.js
// @updateURL https://update.greasyfork.org/scripts/492446/mytube.meta.js
// ==/UserScript==

(function() {
    function mytube() {
        let videoPlayer = document.querySelector(".video-stream");
        if (videoPlayer && videoPlayer.duration < 180 ){
            videoPlayer.pause();
            videoPlayer.currentTime = videoPlayer.duration - 0.001;
            videoPlayer.play();
            videoPlayer.click()
            console.log("mytube","skip", videoPlayer.duration, videoPlayer.currentSrc);

            const buttons = document.querySelectorAll("[class*=ad-skip]");
            for (const button of buttons) {
                button.click();
            }
        }
        const adWords = ["-ad-", "-ads", "banner", "promo", "cta", "companion"];
        const elements = document.querySelectorAll("[class*=ytd]");
        for (const element of elements) {
            const classList = element.classList.toString();
            for (const word of adWords) {
                if (classList.indexOf(word) !== -1 && element.style.display !== 'none') {
                    element.style.display = 'none';
                    console.log("mytube","hide", classList);
                    break;
                }
            }
        }
    }
    setInterval(mytube, 250);
})();