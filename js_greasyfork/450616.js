// ==UserScript==
// @name         住院医师规范化培训课程BOT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动听在“我的课程”里的内容。
// @author       You
// @match      http://120.25.166.167:8887
// @run-at        document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450616/%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%E8%AF%BE%E7%A8%8BBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/450616/%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%E8%AF%BE%E7%A8%8BBOT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const TASKS_URL = "http://120.25.166.167:8887/#/pages/user/course";
    const TASK_URL_PREFIX = "http://120.25.166.167:8887/#/pages/course/detail";
    const VIDEO_URL_PREFIX = "http://120.25.166.167:8887/#/pages/course/learn?courseId=";
    let uniqFlag = null;
    let currentTime = 0;
    setInterval(() => {
        if (document.URL === TASKS_URL) {
            let tasks = document.querySelectorAll('.tabcontent .item');
            console.log("SIZE: ", tasks.length, document.URL);
            if (tasks.length > 0) {
                tasks[0].click();
            }
        } else if (document.URL.startsWith(TASK_URL_PREFIX)) {
            console.log("URL: ", document.URL);
            let studyBtn = [...document.querySelectorAll('span')].filter(e => e.innerText == '开始学习');
            if (studyBtn.length > 0) {
                studyBtn[0].click();
            }
        } else if (document.URL.startsWith(VIDEO_URL_PREFIX)) {
            console.log("VIDEO Learn");
            let statusSpans = document.querySelectorAll("span");
            if (statusSpans.length >= 3 && statusSpans[2].innerText == "( 已完成 )") {
                document.location.href = TASKS_URL;
            }
            let video = document.querySelector('.uni-video-video');
            if (video) {
                video.muted=true;
               video.play();
                let curTime = video.currentTime;
                if (curTime >= currentTime) {
                    currentTime = curTime;
                } else { // 视频循环 已经听完 返回
                    // document.querySelector("a.btn.back").click();
                    console.log("YESS");
                    document.location.href = TASKS_URL;
                }
            }
            /*
            if (statusSpans.length >= 3 && statusSpans[2].innerText == "( 已完成 )") {
                document.location.href = TASKS_URL;
            }
            let viewButton = document.querySelector('div.uni-video-cover-play-button');
            console.log("playXX: ", viewButton);
            if (viewButton) {
                viewButton.click();
            }
            let video = document.querySelector('video');
            if (video) {
                video.muted=true;
                video.play();
            }
            */
        }
    }, 3000);
    // Your code here...
})();