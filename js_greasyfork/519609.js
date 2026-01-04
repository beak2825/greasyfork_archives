// ==UserScript==
// @name         Bilibili Player 小窗口助手
// @namespace    https://www.bilibili.com/
// @version      2024-12-02
// @description  亲爱的上班族，打卡摸鱼看B站视频的时间到啦！别让那个迷你视频播放器压得你看不清楚！我们来救场啦，调整一下小窗口的大小，让你的小屏幕也能看得清楚，边工作边娱乐，不再担心被老板抓个正着！
// @author       Anthony Lee
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519609/Bilibili%20Player%20%E5%B0%8F%E7%AA%97%E5%8F%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519609/Bilibili%20Player%20%E5%B0%8F%E7%AA%97%E5%8F%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';



    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.target.id === "playerWrap") {
                    const playerContainer = document.querySelector(".bpx-player-container");

                    if (entry.isIntersecting) {
                        if (playerContainer) {
                            playerContainer.style.cssText = "width: 100%; height: 100%;";
                        }
                    } else {
                        if (playerContainer) {
                            playerContainer.style.cssText = "width: 36%; height: 67%;";
                        }
                    }
                }
            });
        },
        { threshold: 0.1 }
    );

    const playerWrap = document.getElementById("playerWrap");
    if (playerWrap) {
        observer.observe(playerWrap);
    } else {
        console.warn("#playerWrap element not found.");
    }



})();
