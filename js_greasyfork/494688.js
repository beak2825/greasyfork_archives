// ==UserScript==
// @name         黄金右键2
// @description  Press and hold the right arrow key (→) to alter the video playback speed or simulate the original key function based on the length of the press.
// @namespace    http://tampermonkey.net/
// @version      1
// @author        edr1412
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494688/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE2.user.js
// @updateURL https://update.greasyfork.org/scripts/494688/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE2.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let keyDownTime = 0;
    let timeoutId = null;
    let originalRate = 1;
    const rateMultiplicationFactor = 2;
    const threshold = 100;  // Press duration threshold for distinguishing between short and long press
    let page_video;

    // Utility function to convert a NodeList to an Array
    function makeArray(arr) {
        return Array.prototype.slice.call(arr);
    }

    const init = () => {
        if (location.origin.indexOf("youtube.com") > -1) {
            // Special handling for YouTube
            document.body.addEventListener("keydown", handleKeyDown_YT, true);
            document.body.parentElement.addEventListener("keyup", handleKeyUp_YT, true);
        } else {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
        }
    };

    // Handle keydown for general video elements
    function handleKeyDown(e) {
        if (e.keyCode !== 39) return;
        if (e.simulated) {
            console.log("Simulated event ignored...");
            return;
        }
        e.stopPropagation();

        if (keyDownTime === 0) {
            keyDownTime = Date.now();
            timeoutId = setTimeout(() => {
                if (Date.now() - keyDownTime >= threshold) {
                    increaseSpeed();
                }
            }, threshold);
        }
    }

    // Handle keyup for general video elements
    function handleKeyUp(e) {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        clearTimeout(timeoutId);
        let duration = Date.now() - keyDownTime;
        keyDownTime = 0;

        if (duration < threshold) {
            simulateOriginalFunction();
        } else {
            restoreSpeed();
        }
    }

    function increaseSpeed() {
        if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
            relativeEvent.shouldPrevent && relativeEvent.prevent();
            originalRate = page_video.playbackRate;
            page_video.playbackRate = originalRate * rateMultiplicationFactor;
            console.log("加速播放中...");
        }
    }

    function restoreSpeed() {
        if (page_video && page_video.playbackRate !== originalRate) {
            page_video.playbackRate = originalRate;
            relativeEvent.shouldPrevent && relativeEvent.allow();
        }
    }

    function simulateOriginalFunction() {
        // Simulate keydown event
        let simulatedKeyDown = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            keyCode: 39,
            simulated: true
        });
        document.dispatchEvent(simulatedKeyDown);

        // Simulate keyup event
        let simulatedKeyUp = new KeyboardEvent("keyup", {
            bubbles: true,
            cancelable: true,
            keyCode: 39,
            simulated: true
        });
        document.dispatchEvent(simulatedKeyUp);
    }

    /* for others */

    const getPageVideo = () => {
        console.log("Finding available Video Element...");
        const allVideoElementArray = makeArray(
            document.getElementsByTagName("video")
        ).concat(makeArray(document.getElementsByTagName("bwp-video")));
        console.log(allVideoElementArray);
        const page_video = Array.prototype.find.call(
            allVideoElementArray,
            (e) => {
                if (checkPageVideo(e)) return e;
            }
        );

        if (page_video) {
            console.log("Found the Video Element!");
            return page_video;
        } else {
            console.log("找不到正在播放的Video Element");
        }
    };
    const checkPageVideo = (v) => {
        if (v) {
            return v.offsetWidth > 9 && !v.paused;
        } else {
            return false;
        }
    };
    const relativeEvent = {
        _stopper: (e) => e.stopPropagation(),
        // 目前针对腾讯视频
        shouldPrevent:
            location.origin.indexOf("qq.com") > -1 ||
            location.origin.indexOf("wetv.vip") > -1,
        prevent() {
            document.body.addEventListener("ratechange", this._stopper, true);
            document.body.addEventListener("timeupdate", this._stopper, true);
        },
        allow() {
            document.body.removeEventListener(
                "ratechange",
                this._stopper,
                true
            );
            document.body.removeEventListener(
                "timeupdate",
                this._stopper,
                true
            );
        },
    };

    /* for youtube */

    const getPageVideo_YT = () => {
        console.log("Finding available Video Element...");
        let pv;

        if (document.getElementById("ytd-player") && checkPageVideo_YT(document.getElementById("ytd-player").player_))
            pv = document.getElementById("ytd-player").player_

        if (pv) {
            console.log("Found the Video Element!");
            return pv;
        } else {
            console.log("找不到正在播放的Video Element");
        }
    };
    const checkPageVideo_YT = (v) => {
        if (v) {
            return v.getPlayerState() == 1;
        } else {
            return false;
        }
    };


    // Handle keydown for general video elements
    function handleKeyDown_YT(e) {
        if (e.keyCode !== 39) return;
        if (e.simulated) {
            console.log("Simulated event ignored...");
            return;
        }
        e.stopPropagation();

        if (keyDownTime === 0) {
            keyDownTime = Date.now();
            timeoutId = setTimeout(() => {
                if (Date.now() - keyDownTime >= threshold) {
                    increaseSpeed_YT();
                }
            }, threshold);
        }
    }

    // Handle keyup for general video elements
    function handleKeyUp_YT(e) {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        clearTimeout(timeoutId);
        let duration = Date.now() - keyDownTime;
        keyDownTime = 0;

        if (duration < threshold) {
            simulateOriginalFunction();
        } else {
            restoreSpeed_YT();
        }
    }

    function increaseSpeed_YT() {
        if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
            originalRate = page_video.getPlaybackRate();
            page_video.setPlaybackRate(originalRate * rateMultiplicationFactor);
            console.log("加速播放中...");
        }
    }

    function restoreSpeed_YT() {
        if (page_video && page_video.playbackRate !== originalRate) {
                page_video.setPlaybackRate(originalRate);
        }
    }

    // Initialization
    init();
})();
