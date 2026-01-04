// ==UserScript==
// @name         安徽继续教育在线自动刷课
// @namespace    自动刷课
// @version      0.1
// @description  点进视频即可刷课 现只支持视频
// @author       FutoTan
// @match        *://main.ahjxjy.cn/study/html/content/studying/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL 3
// @downloadURL https://update.greasyfork.org/scripts/455382/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455382/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var Video;
    var NextClassButton;
    var Interval;

    function findVideo() {
        var obj = document.getElementsByClassName("jw-video jw-reset");
        if (obj.length == 0) {
            console.log("未找到视频播放器");
        } else {
            Video = obj[0];
            clearInterval(Interval);
            console.log("视频播放器已找到");
            playVideo();
        }
    }

    function findNextClassButton() {
        var obj = document.getElementsByClassName("btn btn-green");
        if (obj.length == 0) {
            console.log("未找到下一节按钮");
        } else {
            NextClassButton = obj[0];
            console.log("下一节按钮已找到");
            NextClassButton.click();
            relaod();
        }
    }

    function listenNextVideo() {
        Video.currentTime = Video.duration;
        Video.addEventListener("ended", function () {
            findNextClassButton();
        });
    }

    function playVideo() {
        try {
            Video.muted = true
            var playPromise = Video.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    listenNextVideo();
                }).catch(error => {
                    console.log(error);
                    if (error.message.match(/interact/) != null) {
                        alert("浏览器已禁止自动播放，请手动点击播放后自动刷课");
                    } else {
                        alert("未知错误，请手动点击播放后自动刷课");
                    }
                    Video.addEventListener("play", function () {
                        listenNextVideo();
                    });
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    function relaod() {
        Video = null;
        NextClassButton = null;
        Interval = null;
        main();
    }

    function main() {
        Interval = setInterval(function () {
            findVideo();
        }, 100);
    }

    main();

})();