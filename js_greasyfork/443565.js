// ==UserScript==
// @name         联大脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  联大脚本自动刷视频 
// @author       zhangyu
// @match        *://kc.jxjypt.cn/*
// @grant        none
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/443565/%E8%81%94%E5%A4%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443565/%E8%81%94%E5%A4%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* jshint esversion: 6 */


var number = 0;
var list = [];
(function () {
    'use strict';
    //课程码集合
    var courseHtmlArr

    var href = location.href
    // 获取目录判断目录是否存在
    var a = document.getElementsByClassName("course-l");

    if (a != null) {

        $("div[class='course-l'] dd[class='z-gery-icon']").each(function () {
            list.push($(this).attr('data-jie-id'));
        });
        if (number != list.lentgh) {
            play()
        }
    }
    // Your code here...
})();

function play() {
    console.log("list：" + list);
    var id = list[number]
    console.log("id：" + id);
    var d = document.querySelector("dd[data-jie-id='" + id + "']")
    setTimeout(function () {
        console.log("d：" + d + id);
        d.click();
        console.log("点击课程：" + id);
        var divVideo = document.getElementsByClassName("course-video")[0];
        if (divVideo != null) {
            setTimeout(function () {
                var palyDiv = $(".course-video #video-content .prism-big-play-btn")[0];
                var video = $("video")[0];
                palyDiv.click();
                console.log("video：" + $("video")[0]);
                video.addEventListener('play', function () {
                    //播放开始执行的函数
                    console.log("开始播放:" + id);
                });
                video.addEventListener('loadedmetadata', function () {
                    //加载数据
                    //视频的总长度
                    console.log("视频总时长" + video.duration);
                    var allTime = video.duration;
                    console.log("视频正在播放");
                    if (allTime == video.currentTime) {
                        number = number + 1
                    }
                });
                video.addEventListener('ended', function () {
                    //结束
                    console.log("播放结束");
                    number = number + 1
                }, false);
            }, 5000)
        }
    }, 5000);
    getvideoprogress();
}
// 检测当前播放的进度
function getvideoprogress() {
    setInterval(function () {
        var video = $("video")[0];
        var currentTime = Math.floor(video.currentTime)-1;
        var duration = Math.floor(video.duration)-10;
        if (currentTime == -1) {
            var palyDiv = $(".course-video #video-content .prism-big-play-btn")[0];
            palyDiv.click();
        }
        if (currentTime == duration) {
            video.pause() //暂停
            number = number + 1
            if (number < list.length) {
                play();
            }
        }
        console.log('当前进度:', currentTime + "总时长：" + duration);
    }, 10000);
}