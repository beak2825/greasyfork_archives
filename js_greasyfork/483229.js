// ==UserScript==
// @name         正中华自动下一节
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  由于正中华平台播放完这个视频不会自动播放下一个视频，所以写下此脚本，献给有需要的人，希望可以帮助到您
// @author       NianJiuYue
// @match        https://hn.ischinese.cn/*
// @match        https://hn.ischinese.cn/learncenter/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @updateURL
// @installURL
// @downloadURL
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483229/%E6%AD%A3%E4%B8%AD%E5%8D%8E%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/483229/%E6%AD%A3%E4%B8%AD%E5%8D%8E%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Script is running!");

    function handleVideoUpdate () {
        var video = document.querySelector(".video-js .vjs-tech");
        var nextButton = document.querySelector(".nextdontcheat");

        if (video && nextButton) {
            var currentTime = video.currentTime;
            var duration = video.duration;
            var remainingTime = duration - currentTime;
            var formattedRemainingTime =
                Math.floor(remainingTime / 60) + "分钟" + Math.floor(remainingTime % 60) + "秒";
            console.log("剩余时间：" + formattedRemainingTime);

            if (currentTime >= duration - 1) {
                console.log("视频播放完成");
                nextButton.click();
            }

            video.removeEventListener("timeupdate", handleVideoUpdate);
            video.addEventListener("timeupdate", handleVideoUpdate);
        } else {
            console.error("未找到视频元素或下一节按钮");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        console.log("所有 DOM 元素加载完成");

        setTimeout(function () {
            var video = document.querySelector(".video-js .vjs-tech");

            if (video) {
                video.play();

                video.addEventListener("timeupdate", handleVideoUpdate);

                setTimeout(handleVideoUpdate, 3000);
            } else {
                console.error("未找到视频元素");
            }
        }, 3000);
    });
})();
