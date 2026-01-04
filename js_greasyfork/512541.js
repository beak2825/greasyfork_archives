// ==UserScript==
// @name         广州工商学院自动刷课
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  广州工商学院学子刷课用，目前无法自动刷题，无法通过人机识别，只能刷视频,倍速暂固定为1.3倍
// @author       要和母猪配对
// @match   https://study.gzgsmooc.org.cn/*
// @match   https://study.gzgsmooc.org.cn/play-vod?chapterId=*&studyVersion=*&isTeaching=*&isClassHour=*&isCustomer=*&classId=*&params=*
// @grant        none
// @run-at       document-start
// @license      GPL
// @icon https://study.gzgsmooc.org.cn/favicon.ico
//
// @downloadURL https://update.greasyfork.org/scripts/512541/%E5%B9%BF%E5%B7%9E%E5%B7%A5%E5%95%86%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/512541/%E5%B9%BF%E5%B7%9E%E5%B7%A5%E5%95%86%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let video = document.querySelector("video");
    //视频设置
    function videoElement(){
        let video = document.querySelector("video");
        //视频静音
        video.muted=true
        //视频倍速
        video.playbackRate=1.3
    }
    //视频播放
    function start(){
        let video = document.querySelector("video");
        //判断视频是否播放
        setTimeout(()=>{
            if(video.paused===true){
                videoElement()
                //视频播放
                video.play()
                console.log("视频暂停，视频已播放");
            }
            else{
                videoElement()
                console.log("视频正在播放，已开启静音和倍速");
            }
        },2000)
    };
    //播放结束并下一节内容
    function isEnd(){
        const interval =setInterval(()=>{
            let video = document.querySelector("video");
            if(video.currentTime >= video.duration - 0.1){
                console.log("视频播放结束");
                //下一节内容
                for (let index = 0; index < document.querySelectorAll(".el-icon-video-camera-solid").length; index++) {
                    if(getComputedStyle(document.querySelectorAll(".el-icon-video-camera-solid")[index]).color==="rgb(255, 87, 34)"&&parseInt(document.querySelectorAll(".progress_txt")[index].innerText)===100){
                        document.querySelectorAll(".course-chapter-item")[index+1].click();
                    }
                }
                clearInterval(interval);//清除时间，防止卡顿
            }
            else{
                if (document.querySelector("video").paused) {
                    console.log("视频被暂停，请稍后")
                    setTimeout(()=>{
                        document.querySelector("video").play()
                        console.log("视频已恢复播放")
                    },500)
                }
                //console.log("视频未结束");
            }
        },3000)
    }
    //检查页面是否有视频
    function checkForVideo() {
        setTimeout(()=>{
            const video = document.querySelector('video');
            if (!video) {
                console.log("未检测到视频标签");
            } else {
                console.log("视频标签已检测到，继续执行逻辑...");
                start();
                document.querySelector('video').addEventListener('play', () => {
                    console.log("检测到页面视频正在播放");
                });
                isEnd();
            }
        },1500)
    }
    //监控页面是否有视频
    window.onload = () => {
        checkForVideo();
        document.addEventListener('click', () => {
            console.log("页面被点击，重新检测视频标签...");
            clearTimeout()
            checkForVideo();
        });
    };


})();