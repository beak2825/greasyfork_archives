// ==UserScript==
// @name         学起Plus、弘成教育挂课自动连续播放
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  一个网课挂机自动连续播放工具，仅适用于学起Plus、弘成教育 sccchina.net chinaedu.net，反馈与交流QQ群：715307684，更新日期：2022年11月27日
// @author       哆哆啦啦梦
// @match        *://*.chinaedu.net/*
// @match        *://*.sccchina.net/*
// @match        *://*.edu.cn/*
// @match        *://*.bnude.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinaedu.net
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/453460/%E5%AD%A6%E8%B5%B7Plus%E3%80%81%E5%BC%98%E6%88%90%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/453460/%E5%AD%A6%E8%B5%B7Plus%E3%80%81%E5%BC%98%E6%88%90%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

const lessionRules = {
    "play.html": {
        selector: ['.page-sidebar li>a>span[class^="title"]'],
    },
    "study.do": {
        beforeFun: () => {
            const catalogDiv = document.getElementById("catalogDiv");
            if (catalogDiv.childElementCount === 0) {
                const catalog = document.getElementById("catalogA");
                catalog && catalog.className.indexOf("Cur") === -1 && catalog.click();
            }
        },
        selector: ["#catalogDiv span[onclick]", "#catalogDiv span[class^='tit']", "#catalogDiv li h3[onclick]"],
    },
    "mp4_video_index.html": {
        selector: [".ui-folder .ui-leaf span"],
    },
    "index.html": {
        selector: [".cwcOutline span[id$='_span']"],
    },
};

const currentRules = {
    "videolearning.html": {
        selector: [".page-sidebar li.active>a>span"],
    },
    "play.html": {
        selector: [".page-sidebar li.active>a>span"],
    },
    "mp4_video_index.html": {
        selector: [".ui-folder .ui-leaf.ui-selected span"],
    },
    "study.do": {
        selector: [
            "#catalogDiv .cur span",
            ".study-video-title span[class$='title']",
            "#catalogDiv li.cur h3[onclick]",
        ],
    },
    "index.html": {
        selector: [".cwcOutline .curSelectedNode span[id$='_span']"],
    },
};

const videoRules = {
    "video.html": {
        selector: ["#videoFrame video"],
    },
    "play.html": {
        selector: ["#draggable video"],
    },
    "mp4_video_index.html": {
        selector: [".plyr__video-wrapper video"],
    },
    "study.do": {
        selector: ["videobox video"],
    },
    "index.html": {
        selector: [".video-js video"],
    },
};

const noNeedAutoPlayRules = ["mp4_video_index"];

function isInNoNeedAutoPlay() {
    return noNeedAutoPlayRules.find((e) => document.URL.indexOf(e) > 0);
}

function urlIn(rules) {
    for (let key in rules) {
        if (document.URL.indexOf(key) > 0) {
            return true;
        }
    }

    return false;
}

function getDataForRules(rules) {
    for (let key in rules) {
        if (document.URL.indexOf(key) > 0) {
            for (let i = 0; i < rules[key].selector.length; i++) {
                rules[key].beforeFun && rules[key].beforeFun(rules[key].selector[i]);
                const res = document.querySelectorAll(rules[key].selector[i]);
                rules[key].afterFun && rules[key].afterFun(rules[key].selector[i], res);

                if (res.length > 0) {
                    return res;
                }
            }
        }
    }

    return null;
}

function getCurrentLession() {
    const arr = getDataForRules(currentRules);

    if (arr) {
        GM_setValue("current", arr[arr.length - 1].innerText);
    }
}

function getLessionsInfo() {
    const arr = getDataForRules(lessionRules);

    if (arr) {
        const lessions = [];
        for (let i = 0; i < arr.length; i++) {
            const className = "api20221120-" + i;
            if (arr[i].className.indexOf(className) === -1) {
                arr[i].className += " " + className;
            }
            lessions.push({ title: arr[i].innerText, className });
        }
        GM_setValue("lessions", lessions);
    }
}

let findVideoCount = 0;
const findVideoMaxCount = 3;

function getVideo() {
    const status = GM_getValue("play_end");
    if (GM_getValue("video") || status) {
        return;
    }

    if (findVideoCount >= findVideoMaxCount) {
        if (status !== "not found") {
            GM_setValue("play_end", "not found");
            findVideoCount = 0;
        }
        return;
    }

    if (document.querySelector("video")) {
        GM_setValue("video", document.URL);

        setTimeout(() => {
            playCheck();
        }, 5000);
    } else {
        findVideoCount++;
    }
}

function playCheck() {
    if (GM_getValue("play_end")) {
        return;
    }

    const video = document.querySelector("video");

    if (video) {
        video.muted = true;
        video.playbackRate = 2;

        const currentTime = video.currentTime.toFixed(1);
        const totalTime = video.duration.toFixed(1);
        const nowTime = new Date();

        console.log(`${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()},当前进度:${currentTime}/${totalTime} ${(currentTime / totalTime).toFixed(1)},${document.URL}`);

        if (video.ended || totalTime - currentTime < 35 * video.playbackRate) {
            video.onpause = null;

            setTimeout(() => {
                GM_setValue("play_end", "over");
            }, 5000);
        } else {
            if (video.paused) {
                console.log("视频被暂停，继续播放！");
                video.play();
                video.onpause = function() {
                    document.querySelector("video").play();
                }
            }

            setTimeout(() => {
                playCheck();
            }, 5000);
        }
    } else {
        console.log("异常:找不到视频元素了");
    }
}

function nextCheck() {
    const status = GM_getValue("play_end");
    const lessions = GM_getValue("lessions");
    if (status && lessions && lessions.length) {
        let currentText = GM_getValue("current");
        const lastCurrent = GM_getValue("last_current");

        if (!lastCurrent || (currentText && lastCurrent !== currentText)) {
            GM_setValue("last_current", currentText);
        } else {
            currentText = lastCurrent;
        }

        let index = GM_getValue("last_pos") ?? 0;

        const newIndex = lessions.findIndex((e) => e.title === currentText);

        if (newIndex !== -1 && newIndex > index) {
            index = newIndex;
        }

        if (status === "not found" && !currentText) {
            index = 0;
        } else if (isInNoNeedAutoPlay()) {
            return;
        } else {
            index += 1;
        }

        GM_setValue("last_pos", index);

        if (index < lessions.length) {
            console.log(lessions[index]);
            GM_deleteValue("play_end");
            GM_deleteValue("video");
            document.querySelector("." + lessions[index].className).click();
        } else {
            alert("课程播放结束");
            return;
        }
    }

    setTimeout(() => {
        nextCheck();
    }, 5000);
}

function getResource() {
    getCurrentLession();
    getLessionsInfo();
}

function init() {
    GM_deleteValue("play_end");
    GM_deleteValue("video");
    GM_deleteValue("current");
    GM_deleteValue("last_current");
    GM_deleteValue("lessions");
}


function initLessions() {
    GM_setValue("step", 1);
    GM_setValue("last_pos", 0);
    return true;
}

function popupClose() {
    const tips = document.querySelector(".win-content");

    if (tips && tips.innerText.indexOf("继续学习") > 0) {
        const btn = document.querySelector(".win-content .close-win-bt");
        btn && btn.click();
    }

    const pop = document.querySelector("#pop");

    pop && pop.querySelector(".pop_close").click();
}

function work() {
    init();

    setTimeout(() => {
        urlIn(lessionRules) && initLessions() && nextCheck();
    }, 5000);

    setInterval(() => {
        urlIn(videoRules) && getVideo();
    }, 10000);

    setInterval(() => {
        getResource();
        popupClose();
    }, 3000);

    setInterval(() => {
        if (document.URL.indexOf("sccchina.net/student/") >= 0) {
            // 定时刷新
            setTimeout(() => {
                location.reload();
            }, (new Date().getSeconds() + 100) * 1234);
        }
    }, 60 * 15 * 1000);
}

(function () {
    "use strict";

    work();
})();
