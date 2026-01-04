// ==UserScript==
// @name         高校邦视频自动播放
// @namespace    https://tampermonkey.net/
// @version      2025-04-10
// @description  Automatically play and continue videos on GaoXiaoBang.
// @author       Nyaser
// @match        *://*.class.gaoxiaobang.com/class/*/unit/*/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaoxiaobang.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532525/%E9%AB%98%E6%A0%A1%E9%82%A6%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532525/%E9%AB%98%E6%A0%A1%E9%82%A6%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var video;

    function goNext() {
        var next = document.querySelector("#chapterLayout > div.chapter-info > span.chapter-next.gxb-cur-point > i");
        console.log("Moving to next chapter");
        next.click();
    }

    function heartbeat() {
        if (video.paused) {
            console.log("Resuming playback");
            video.play();
        }

        var progress = document.querySelector("div.cont > div.clear-fix.videoTit > div.progress > span");
        if (progress !== null) {
            console.log("Current progress:", progress.innerText + "%");
            if (progress.innerText == "100") {
                console.log("Progress reached 100%");
                goNext();
            }
        } else {
            console.log("Progress element not found");
            goNext();
        }
    }

    function checkVideoWithRetry(attempts) {
        return new Promise((resolve) => {
            function checkVideo() {
                video = document.querySelector("#video_player_html5_api");

                if (video) {
                    video.muted = true;
                    video.play();
                    console.log("Video found and muted");
                    resolve(true);
                } else if (attempts > 0) {
                    console.log("Video not found, retrying in 1 second");
                    console.log("Attempts left:", attempts);
                    setTimeout(checkVideo, 1e3);
                    attempts--;
                } else {
                    console.log("Video not found after all attempts");
                    resolve(false);
                }
            }

            checkVideo();
        });
    }

    function activate() {
        checkVideoWithRetry(3)
            .then(res => {
            if (res) setInterval(heartbeat, 1e3);
            else goNext();
        })
    }

    window.onload = activate;
})();