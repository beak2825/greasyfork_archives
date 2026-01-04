// ==UserScript==
// @name         YouTube AdBlocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass YouTube ads with some player tricks.
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480777/YouTube%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/480777/YouTube%20AdBlocker.meta.js
// ==/UserScript==

(function() {
    const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

    const clickSkipButton = () => {
        document.querySelector(".ytp-ad-skip-button")?.click();
        document.querySelector(".ytp-ad-skip-button-modern")?.click();
    };

    const skipAdIfExists = async () => {
        const videoContainer = document?.getElementById("movie_player");

        if (!videoContainer) return;

        const isAd = videoContainer?.classList.contains("ad-interrupting") || videoContainer?.classList.contains("ad-showing");

        if (!isAd) return;

        const videoPlayer = document.getElementsByClassName("video-stream")[0];

        if (videoPlayer) {
            videoPlayer.muted = true;
            videoPlayer.currentTime = videoPlayer.duration - 0.1;

            if (videoPlayer.paused) {
                videoPlayer.play();
            }

            await wait(200);
        }

        clickSkipButton();

        await wait(100);

        return skipAdIfExists();
    };

    skipAdIfExists();
})();