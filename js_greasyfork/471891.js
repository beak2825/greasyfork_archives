// ==UserScript==
// @name         2023_江苏执业药师网课助手 切屏不暂停 4倍速 自动播放下一章
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  切换屏幕,视频不暂停；4倍速播放（网站最多支持4倍速）；播放完当前视频自动播放下一章；最优
// @author       github.com/JasonJarvan
// @match        http://www.jslpa.cn/CourseDetail/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/471891/2023_%E6%B1%9F%E8%8B%8F%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%20%E5%88%87%E5%B1%8F%E4%B8%8D%E6%9A%82%E5%81%9C%204%E5%80%8D%E9%80%9F%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/471891/2023_%E6%B1%9F%E8%8B%8F%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%20%E5%88%87%E5%B1%8F%E4%B8%8D%E6%9A%82%E5%81%9C%204%E5%80%8D%E9%80%9F%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E7%AB%A0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = function(){
        setInterval(() => {
            try {
                let hre = location.href;
                if (hre.includes("http://www.jslpa.cn/CourseDetail")) {
                    let video = document.querySelector("video");

                    video.playbackRate = 4;

                    video.muted = true;
                    video.play();

                    function ClickNextChapter() {
                        let ul = document.querySelector(".chapterList");
                        let li = ul.querySelector("li[class='']");
                        li.click();
                    }
                    video.addEventListener("ended", ClickNextChapter);

                    function playVideo() {
                        if (video.paused) {
                            video.play();
                        }
                    }
                    video.addEventListener("canplay", playVideo);
                    video.addEventListener("canplaythrough", playVideo);
                    video.addEventListener("pause",playVideo);
                    video.addEventListener("waiting", playVideo);

                    let pauseBgDiv = document.querySelector('.pauseBg');
                    let dialogFooterSpan = pauseBgDiv.parentNode;
                    dialogFooterSpan.click();
                }
            } catch (error) {}
        }, 5000);

        setInterval(function(){
            window.location.reload();
        },59*60*1000);
    };
})();