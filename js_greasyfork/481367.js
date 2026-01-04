// ==UserScript==
// @name         EHR课程倍速学习
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  仅用于EHR课程倍速学习
// @author       yeaicc
// @match        https://www.italent.cn/*ThunderPage*
// @match        https://cloud.italent.cn/PageHome/Index*
// @icon         https://www.italent.cn/italent.ico
// @grant        none
// @license      MIT
// @note
// @downloadURL https://update.greasyfork.org/scripts/481367/EHR%E8%AF%BE%E7%A8%8B%E5%80%8D%E9%80%9F%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/481367/EHR%E8%AF%BE%E7%A8%8B%E5%80%8D%E9%80%9F%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const maxTryCount = 30;
    const maxWaitLogCount = 5;
    const tryInterval = 1;
    let tryIntervalId = null;
    let tryCount = 0;
    let tipWaitCount = -1;

    const log = function (msg, force = false) {
        if (tipWaitCount > maxWaitLogCount || force) {
            console.log(msg);
            tipWaitCount = 0;
        }
    };

    tryIntervalId = setInterval(() => {
        tipWaitCount++;
        if (tryCount > maxTryCount) {
            if (tryIntervalId) {
                clearInterval(tryIntervalId);
            }
            log("实在找不到视频播放器，我停了", true);
            return;
        }
        let videos = document.getElementsByTagName("video");
        if (!videos || !videos.length) {
            let studyButton = document.querySelector(".phoenix-button__wraper");
            if (
                studyButton &&
                (studyButton.innerText === "开始学习" ||
                    studyButton.innerText === "继续学习")
            ) {
                setTimeout(() => {
                    studyButton.click();
                }, 500);
                log(`即将前往${studyButton.innerText}`, true);
            } else {
                tryCount++;
                log("可能不是学习页面哈");
            }
        } else {
            for (let index = 0; index < videos.length; index++) {
                const video = videos[index];
                if (video.playbackRate !== 2) {
                    video.playbackRate = 2;
                    log("已开启倍速……", true);
                } else {
                    tipWaitCount++;
                    log("倍速学习中……");
                }
            }
        }
    }, 1000 * tryInterval);
})();
