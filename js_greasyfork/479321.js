// ==UserScript==
// @name         黄金右键【改】-灵活控制视频倍速-Golden Right-Flexibly control the playback rate of videos
// @description  Press and hold arrow keys to control video speed: right key (→) for 2x speed, left key (←) for 0.5x speed
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/SkyJinXX/Golden-Right
// @version      2.7
// @author       SkyJin & edr1412
// @include     http://*
// @include     https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479321/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE%E3%80%90%E6%94%B9%E3%80%91-%E7%81%B5%E6%B4%BB%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F-Golden%20Right-Flexibly%20control%20the%20playback%20rate%20of%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/479321/%E9%BB%84%E9%87%91%E5%8F%B3%E9%94%AE%E3%80%90%E6%94%B9%E3%80%91-%E7%81%B5%E6%B4%BB%E6%8E%A7%E5%88%B6%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F-Golden%20Right-Flexibly%20control%20the%20playback%20rate%20of%20videos.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let right_down_count = 0;
    let left_down_count = 0;
    const speed_up_factor = 2;
    const slow_down_factor = 0.5;
    let normal_rate = 1;
    const add_time = 5;
    let page_video;

    // 添加需要直接快退/快进5秒的网站名单
    const forceSkipSites = [
        'tingwu.aliyun.com',
        // 在这里添加更多网站
    ];

    // 检查当前网站是否在强制快进名单中
    const isForceSkipSite = () => {
        return forceSkipSites.some(site => location.origin.indexOf(site) > -1);
    };

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
    const init = () => {
        if (location.origin.indexOf("youtube.com") > -1) {
            document.body.addEventListener("keydown", downEvent_YT, true);
            document.body.parentElement.addEventListener("keyup", upEvent_YT, true);
        } else {
            document.body.addEventListener("keydown", downEvent, true);
            document.body.parentElement.addEventListener("keyup", upEvent, true);
        }
    };

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
            return v.offsetWidth > 9;
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
    const downEvent = (e) => {
        if (e.keyCode !== 39 && e.keyCode !== 37) return;

        if (e.metaKey || e.ctrlKey || e.altKey) {
            console.log("modifier detected, do nothing...");
            return;
        }

        if (e.simulated) {
            console.log("simulated 不处理...");
            return;
        }
        e.stopPropagation();

        // 计数+1
        if (e.keyCode === 39) {
            right_down_count++;
            // 长按右键-开始
            if (right_down_count === 2) {
                if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                    relativeEvent.shouldPrevent && relativeEvent.prevent();
                    normal_rate = page_video.playbackRate;
                    page_video.playbackRate = normal_rate * speed_up_factor;
                    console.log("加速播放中...");
                }
            }
        } else if (e.keyCode === 37) {
            left_down_count++;
            // 长按左键-开始
            if (left_down_count === 2) {
                if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                    relativeEvent.shouldPrevent && relativeEvent.prevent();
                    normal_rate = page_video.playbackRate;
                    page_video.playbackRate = normal_rate * slow_down_factor;
                    console.log("减速播放中...");
                }
            }
        }
    };
    const upEvent = (e) => {
        if (e.keyCode !== 39 && e.keyCode !== 37) return;

        if (e.metaKey || e.ctrlKey || e.altKey) {
            console.log("modifier detected, do nothing...");
            return;
        }

        e.stopPropagation();

        if (e.keyCode === 39) {
            // 右键单击
            if (right_down_count === 1) {
                if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                    if (isForceSkipSite()) {
                        // 在指定网站上直接快进5秒
                        page_video.currentTime += add_time;
                        console.log("前进" + add_time + "秒");
                    } else {
                        // 其他网站保持原有行为
                        console.log("模拟右方向键...");
                        // 模拟 keydown 事件
                        let simulatedKeyDown = new KeyboardEvent("keydown", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 39,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyDown);

                        // 模拟 keyup 事件
                        let simulatedKeyUp = new KeyboardEvent("keyup", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 39,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyUp);
                    }
                }
            }
            right_down_count = 0;
        } else if (e.keyCode === 37) {
            // 左键单击
            if (left_down_count === 1) {
                if (checkPageVideo(page_video) || (page_video = getPageVideo())) {
                    if (isForceSkipSite()) {
                        // 在指定网站上直接快退5秒
                        page_video.currentTime -= add_time;
                        console.log("后退" + add_time + "秒");
                    } else {
                        // 其他网站保持原有行为
                        console.log("模拟左方向键...");
                        // 模拟 keydown 事件
                        let simulatedKeyDown = new KeyboardEvent("keydown", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 37,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyDown);

                        // 模拟 keyup 事件
                        let simulatedKeyUp = new KeyboardEvent("keyup", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 37,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyUp);
                    }
                }
            }
            left_down_count = 0;
        }

        // 长按结束-恢复正常速度
        if (page_video && page_video.playbackRate !== normal_rate) {
            page_video.playbackRate = normal_rate;
            relativeEvent.shouldPrevent && relativeEvent.allow();
        }
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
            return v.getPlayerState() == 1 || v.getPlayerState() == 2;
        } else {
            return false;
        }
    };
    const downEvent_YT = (e) => {
        if (e.keyCode !== 39 && e.keyCode !== 37) return;

        if (e.metaKey || e.ctrlKey || e.altKey) {
            console.log("modifier detected, do nothing...");
            return;
        }

        e.stopPropagation();

        if (e.keyCode === 39) {
            right_down_count++;
            // 长按右键-开始
            if (right_down_count === 2) {
                if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                    normal_rate = page_video.getPlaybackRate();
                    page_video.setPlaybackRate(normal_rate * speed_up_factor);
                    console.log("加速播放中...");
                }
            }
        } else if (e.keyCode === 37) {
            left_down_count++;
            // 长按左键-开始
            if (left_down_count === 2) {
                if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                    normal_rate = page_video.getPlaybackRate();
                    page_video.setPlaybackRate(normal_rate * slow_down_factor);
                    console.log("减速播放中...");
                }
            }
        }
    };
    const upEvent_YT = (e) => {
        if (e.keyCode !== 39 && e.keyCode !== 37) return;

        if (e.metaKey || e.ctrlKey || e.altKey) {
            console.log("modifier detected, do nothing...");
            return;
        }
        
        e.stopPropagation();

        if (e.keyCode === 39) {
            // 右键单击
            if (right_down_count === 1) {
                if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                    if (isForceSkipSite()) {
                        // 在指定网站上直接快进5秒
                        page_video.seekToStreamTime(page_video.getCurrentTime() + add_time);
                        console.log("前进" + add_time + "秒");
                    } else {
                        // 其他网站保持原有行为
                        console.log("模拟右方向键...");
                        let simulatedKeyDown = new KeyboardEvent("keydown", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 39,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyDown);

                        let simulatedKeyUp = new KeyboardEvent("keyup", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 39,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyUp);
                    }
                }
            }
            right_down_count = 0;
        } else if (e.keyCode === 37) {
            // 左键单击
            if (left_down_count === 1) {
                if (checkPageVideo_YT(page_video) || (page_video = getPageVideo_YT())) {
                    if (isForceSkipSite()) {
                        // 在指定网站上直接快退5秒
                        page_video.seekToStreamTime(page_video.getCurrentTime() - add_time);
                        console.log("后退" + add_time + "秒");
                    } else {
                        // 其他网站保持原有行为
                        console.log("模拟左方向键...");
                        let simulatedKeyDown = new KeyboardEvent("keydown", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 37,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyDown);

                        let simulatedKeyUp = new KeyboardEvent("keyup", {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 37,
                            simulated: true
                        });
                        document.dispatchEvent(simulatedKeyUp);
                    }
                }
            }
            left_down_count = 0;
        }

        // 长按结束-恢复正常速度
        if (page_video && page_video.playbackRate !== normal_rate) {
            page_video.setPlaybackRate(normal_rate);
        }
    };

    /* initiate */

    init();
})();