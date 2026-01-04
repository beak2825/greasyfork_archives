// ==UserScript==
// @name         全网视频倍速调节快捷键
// @namespace    https://www.bilibili.com
// @version      2.0
// @description  可以使用该脚本，使用快捷键调节
// @author       pick
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460697/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/460697/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E8%8A%82%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==
'use strict';
let LOCALSTORAGE_PLAYBACK_RATE_KEY = "video_playbackRate";
let SHOW_DIV_ID = "pickBilibili";
let INNER_DIV_ID = "innerDiv";
let DEBUG = false;
let DEBUG_PREFIX = "PICK-DEBUG";
let MAX_NO_FOUND_VIDEO_CONTINUOUS_TIMES = 30;
let lastKeyPressTime = new Map();
let doubleClickInterval = 200;
let DETAIL_KEY = 'a';
let RATE_ARRAYS = {
    'z': [1, 1.5, 2],
    'x': [1, 1.25, 1.5, 2, 3],
    'c': [1, 2, 3],
    'v': [1, 5, 10]
}
let HTML = `<div id="${SHOW_DIV_ID}" style="position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(128, 128, 128, 0.5);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
            z-index: 10;display: none">
    <div id="${INNER_DIV_ID}"></div>
</div>`


log("脚本开始运行");

if (window.top === window.self) {  // 只在主文档中执行一次
    document.addEventListener("keydown", videoKeydownEvent);
    proxy();
} else {
    document.addEventListener("keydown", videoKeydownEvent);
    proxy();
}

function proxy() {
    let noFoundVideoContinuousTimes = 0;
    const intervalId = setInterval(() => {
        let number = setPlaybackRate();
        if (number === 0) {
            noFoundVideoContinuousTimes += 1;
            // log("连续没发现视频次数:" + noFoundVideoContinuousTimes);

        } else {
            // log("连续没发现视频次数,归0");
            noFoundVideoContinuousTimes = 0;
        }
        if (noFoundVideoContinuousTimes === MAX_NO_FOUND_VIDEO_CONTINUOUS_TIMES) {
            // log("连续没发现视频次数:" + noFoundVideoContinuousTimes + ",任务终止");
            clearInterval(intervalId);
        }
    }, 1000);
}


/**
 *  将当前页面所有video标签的倍数设置为用户使用的倍速
 * @returns {number} 当前页面视频数量
 */
function setPlaybackRate() {
    let videoDivs = getVideoDivs();
    let playbackRate = getLocalPlaybackRate();
    for (let i = 0; i < videoDivs.length; i++) {
        videoDivs[i].playbackRate = playbackRate;
        //视频可以聚焦
        // videoDivs[i].setAttribute('tabindex', '0');
        if ((videoDivs[i].pickHaveAlreadShow == null || videoDivs[i].pickHaveAlreadShow !== videoDivs[i].src) && !videoDivs[i].paused) {
            showPlaybackRateNew({showText: getLocalPlaybackRate() + "倍速", dismissTime: 1000});
            videoDivs[i].pickHaveAlreadShow = videoDivs[i].src;
        }
    }
    return videoDivs.length;
}

/**
 * 键盘事件调整倍速事件
 * @param event 事件
 */
function videoKeydownEvent(event) {
    log("功能键 ctrl", event.ctrlKey, "shiftKey", event.shiftKey, "altKey", event.altKey, "eventKey", event.key);
    if (event.altKey || event.shiftKey || event.ctrlKey || event.target.tagName === "INPUT" || event.target.tagName === 'TEXTAREA') {
        return;
    }
    if (getVideoDivs().length === 0) {
        return;
    }
    if (event.key === 's') {
        showPlaybackRateNew({showText: getLocalPlaybackRate() + "倍速", dismissTime: 500, key: event.key});
        return;
    } else if (event.key === DETAIL_KEY) {
        showPlaybackRateNew({showText: getLocalPlaybackRate() + "倍速", dismissTime: 2000, key: event.key});
    }
    if(RATE_ARRAYS[event.key] == null){
        return;
    }
    if (doubleClick(event)) {
        log("doubleClick", event.type, event.key, event.target);
        event.stopPropagation();
        setLocalPlaybackRate(getLastPlaybackRate(event.key));
        setPlaybackRate();
        showPlaybackRateNew({showText: getLocalPlaybackRate() + "倍速", dismissTime: 500});
    } else {
        log(event.type, event.key, event.target);
        event.stopPropagation();
        setLocalPlaybackRate(getNextPlaybackRate(event.key));
        setPlaybackRate();
        showPlaybackRateNew({showText: getLocalPlaybackRate() + "倍速", dismissTime: 500, key: event.key});
    }


}


function doubleClick(event) {
    return false;
    let lastTime = lastKeyPressTime.get(event.key);
    if (lastTime === null) {
        lastTime = 0;
    }
    const currentTime = Date.now();
    let doubleClick = false;
    if (currentTime - lastTime <= doubleClickInterval) {
        doubleClick = true;
    } else {
        doubleClick = false;
    }
    lastKeyPressTime.set(event.key, Date.now());
    return doubleClick;
}

function getNextPlaybackRate(key) {
    let rateArray = RATE_ARRAYS[key];
    let rate = getLocalPlaybackRate();
    for (let i = 0; i < rateArray.length; i++) {
        if (rate < rateArray[i]) {
            return rateArray [i]
        }
    }
    return rateArray[0];
}

function getLastPlaybackRate(key) {
    let rateArray = RATE_ARRAYS[key];
    let rate = getLocalPlaybackRate();
    for (let i = rateArray.length - 1; i >= 0; i--) {
        if (rate > rateArray[i]) {
            return rateArray [i]
        }
    }
    return rateArray[rateArray.length - 1];
}


/**
 *
 * @returns {number} localStorage中存储的倍速
 */
function getLocalPlaybackRate() {
    let item = localStorage.getItem(LOCALSTORAGE_PLAYBACK_RATE_KEY);
    let playbackRate;
    try {
        playbackRate = parseFloat(item);
    } catch (err) {
        playbackRate = 1;
    }
    return playbackRate;
}

/**
 * 向localStorage中存储倍速
 * @param playbackRate 倍速
 */
function setLocalPlaybackRate(playbackRate) {
    localStorage.setItem(LOCALSTORAGE_PLAYBACK_RATE_KEY, playbackRate);
}

function log(...args) {
    if (DEBUG) {
        console.log(DEBUG_PREFIX, ...args);
    }
}


/**
 * 获得该页面下video的div
 * @returns {any[]}
 */
function getVideoDivs() {
    let videos = document.querySelectorAll("video");
    let result = [];
    for (let i = 0; i < videos.length; i++) {
        let thisVideo = videos[i];
        if (thisVideo.style.display == null || thisVideo.style.display === "") {
            result.push(thisVideo);
        }
    }
    return result;
}

function findVideo() {
    let videoDivs = getVideoDivs();
    if (videoDivs.length === 0) {
        return {
            parent: null,
            video: document.body
        }
    } else {
        let targetVideo;
        for (let video of videoDivs) {
            if (video === document.activeElement) {
                targetVideo = video;
                break;
            }
        }
        if (location.hostname === "www.douyin.com") {
            targetVideo = videoDivs.length === 3 ? videoDivs[1] : videoDivs[0];
        } else {
            targetVideo = videoDivs[0];
        }
        return {
            parent: targetVideo.parentElement,
            video: targetVideo
        };
    }
}

/**
 *
 * @returns {{showDiv: Element, textDiv: Element, video:Element, innerDiv:Element}} 调整倍速后，展示倍速，获得相关div
 */
function findSuitShowInfo() {
    let videoInfo = findVideo();
    let parent = videoInfo.parent;
    let insertDiv = parent.querySelector("#" + SHOW_DIV_ID);
    if (insertDiv == null) {
        parent.insertAdjacentHTML("beforeend", HTML);
    }
    return {
        showDiv: parent.querySelector("#" + SHOW_DIV_ID),
        innerDiv: parent.querySelector("#" + INNER_DIV_ID),
        video: videoInfo.video
    }
}

/**
 *
 * @param configuration 配置信息,showText:展示内容，dismissTime消失时间
 */
function showPlaybackRateNew(configuration) {
    let info = findSuitShowInfo();
    if (info != null) {
        info.showDiv.style.display = 'block';
        if (configuration.key === 's') {
            info.innerDiv.innerHTML =
                `<p style="font-size:30px;color:black;font-weight: bold;text-align: center">${configuration.showText}</p>
                <p style="font-size:30px;color:black;font-weight: bold;text-align: center">${getVideoCustomerInfo(info.video)}</p>`;
        } else if (configuration.key === DETAIL_KEY) {
            info.innerDiv.innerHTML =
                `<p style="font-size:30px;color:black;font-weight: bold;text-align: center">${configuration.showText}</p>
                <p style="font-size:30px;color:black;font-weight: bold;text-align: center">${getVideoCustomerInfo(info.video)}</p>
                <p style="font-size:30px;color:black;font-weight: bold;text-align: center">${speedPrint()}</p>
                <p style="font-size:30px;color:black;font-weight: bold;text-align: center">${DETAIL_KEY}:详细信息</p>`;
        } else {
            info.innerDiv.innerHTML =
                `<p style="font-size:30px;color:black;font-weight: bold;text-align: center">${configuration.showText}</p>
                 <p style="font-size:30px;color:black;font-weight: bold;text-align: center">${getKeyArrayPrint(configuration)}</p>`;
        }
        SLEEP(configuration.dismissTime).then(function () {
            info.showDiv.style.display = 'none';
        });
    } else {
        log("无法展示倍速");
    }
}

function getKeyArrayPrint(configuration) {
    if (RATE_ARRAYS[configuration.key] != null) {
        return RATE_ARRAYS[configuration.key].map(n => n === getLocalPlaybackRate() ? `<span style="color: red;">${n}</span>` : n).join(" ");
    }
    return ``;
}

function getVideoCustomerInfo(video) {
    return "分辨率:" + video.videoWidth + "x" + video.videoHeight;
}

function speedPrint() {
    let result = [];
    for (let key in RATE_ARRAYS) {
        let concat;
        concat = key + "键:" + RATE_ARRAYS[key].map(n => n === getLocalPlaybackRate() ? `<span style="color: red;">${n}</span>` : n).join(" ");
        result.push(concat);
    }
    return result.join("<br>");
}

let SLEEP = (time) => new Promise((resolve) => {
    if (time == null || time === 0) {
        resolve();
    } else {
        setTimeout(resolve, time);
    }
});