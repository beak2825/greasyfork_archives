// ==UserScript==
// @name         广东省信息化教育与人力资源公共服务平台 - 视频加速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开视频播放页面后即可自动完成所有课程
// @author       天威
// @match        *://rk.gdceiaec.org/StudyIndex/StudyCourseV6/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412687/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%BF%A1%E6%81%AF%E5%8C%96%E6%95%99%E8%82%B2%E4%B8%8E%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20-%20%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/412687/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%BF%A1%E6%81%AF%E5%8C%96%E6%95%99%E8%82%B2%E4%B8%8E%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20-%20%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var videoID = document.querySelector('video')
    console.log(videoID)
    setTimeout(function(){
        console.log("设置视频自动开始") ;
        videoID.autoplay;
    }, 3000);
       setTimeout(function(){
        console.log("设置视频播放速度") ;
        videoID.playbackRate = 6.0
    }, 6000);
    // Your code here...
})();