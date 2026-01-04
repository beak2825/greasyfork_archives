// ==UserScript==
// @name         B站右键 Bilibili-Right-Arrow 
// @description  按住"→"键倍速播放, 松开"→"键恢复原速, 灵活追剧看视频~ 支持所有H5视频的网站(YouTube、腾讯视频、优酷、番剧等) Fork 并修改自 SkyJin 的 Golden-Right (https://github.com/SkyJinXX/Golden-Right); Press and hold the right arrow key (→) to set the video playback rate faster. Release the key to restore the original rate
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/DEAN-Cherry/Bilibili-Right-Arrow
// @version      1.0.1
// @author       DEAN-Cherry
// @match       http://*/*
// @match       https://*/*
// @exclude      *://*.bilibili.com/*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/498096/B%E7%AB%99%E5%8F%B3%E9%94%AE%20Bilibili-Right-Arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/498096/B%E7%AB%99%E5%8F%B3%E9%94%AE%20Bilibili-Right-Arrow.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let down_count = 0;
    const faster_rate = 3;
    let normal_rate = 1;
    const add_time = 3;
    let page_video;

    function makeArray(arr) {
        if (arr.item) {
            var len = arr.length;
            var array = [];
            while (len--) {
                array[len] = arr[len];
            }
            return array;
        }
        return Array.prototype.slice.call(arr);
    }

    const createSpeedIndicator = () => {
        const indicator = document.createElement('div');
        indicator.id = 'speed-indicator';
        indicator.style.position = 'absolute';
        indicator.style.top = '50px';
        indicator.style.left = '50%';
        indicator.style.transform = 'translateX(-50%)';
        indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        indicator.style.color = 'white';
        indicator.style.padding = '8px 8px';
        indicator.style.borderRadius = '5px';
        indicator.style.fontSize = '12px';
        indicator.style.zIndex = '9999';
        indicator.style.display = 'none';
        indicator.innerText = '倍速播放中...';
        return indicator;
    };

    const showSpeedIndicator = (videoElement) => {
        let indicator = document.getElementById('speed-indicator');
        if (!indicator) {
            indicator = createSpeedIndicator();
            videoElement.parentElement.appendChild(indicator);
        }
        indicator.style.display = 'block';
    };

    const hideSpeedIndicator = () => {
        const indicator = document.getElementById('speed-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    };

    const restoreNormalPlaybackRate = () => {
        if (page_video && page_video.playbackRate !== normal_rate) {
            page_video.playbackRate = normal_rate;
            hideSpeedIndicator();
            relativeEvent.shouldPrevent && relativeEvent.allow();
        }
    };

    const init = () => {
        if (location.origin.indexOf("youtube.com") > -1) {
            document.body.addEventListener("keydown", downEvent_YT, true);
            document.body.parentElement.addEventListener("keyup", upEvent_YT, true);
        } else {
            document.body.addEventListener("keydown", downEvent, true);
            document.body.parentElement.addEventListener("keyup", upEvent, true);
        }
        window.addEventListener('blur', restoreNormalPlaybackRate);
    };

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

    const downEvent = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        down_count++;

        if (down_count === 2) {
            if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                relativeEvent.shouldPrevent && relativeEvent.prevent();
                normal_rate = page_video.playbackRate;
                page_video.playbackRate = faster_rate;
                showSpeedIndicator(page_video);
                console.log("加速播放中...");
            }
        }
    };

    const upEvent = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        if (down_count === 1) {
            if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                page_video.currentTime += add_time;
                console.log("前进" + add_time + "秒");
            }
        }

        restoreNormalPlaybackRate();

        down_count = 0;
    };

    const getPageVideo_YT = () => {
        console.log("Finding available Video Element...");
        let pv;

        if (document.getElementById("ytd-player") && checkPageVideo_YT(document.getElementById("ytd-player").player_)){
            pv = document.getElementById("ytd-player").player_
        }

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

    const downEvent_YT = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        down_count++;

        if (down_count === 2) {
            if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                normal_rate = page_video.getPlaybackRate();
                page_video.setPlaybackRate(faster_rate);
                showSpeedIndicator(page_video.getIframe());
                console.log("加速播放中...");
            }
        }
    };

    const upEvent_YT = (e) => {
        if (e.keyCode !== 39) return;
        e.stopPropagation();

        if (down_count === 1) {
            if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                page_video.seekToStreamTime(page_video.getCurrentTime() + add_time);
                console.log("前进" + add_time + "秒");
            }
        }

        if (page_video && page_video.playbackRate !== normal_rate) {
            page_video.setPlaybackRate(normal_rate);
            hideSpeedIndicator();
        }

        down_count = 0;
    };

    init();
})();
