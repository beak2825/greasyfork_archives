// ==UserScript==
// @name         JumpVideo
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  skip video
// @author       You
// @match        https://lms.ouchn.cn/course/*/learning-activity/*
// @icon         https://www.google.com/s2/favicons?domain=ouchn.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436343/JumpVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/436343/JumpVideo.meta.js
// ==/UserScript==

(function() {
    'use strict';
     check();
    // Your code here...
})();

function check(){
    var retryCount = 0;
    var maxRetry = 3;
    var currentURL = window.location.href;
    var isNext = false;
    console.log("经过测试,interval 在切换视频时不会改变");
    var lock = setInterval(function(){
        console.log("开始检测是否播放完毕.....");
        let video = document.querySelector('#video video');
        if (currentURL !== window.location.href && isNext == true) {
          currentURL = window.location.href;
          isNext = false;
        }else if(currentURL == window.location.href && isNext == true){
            console.log("出现故障了，无法跳转到下一个作业,清除定时作业,lock:",lock);
            clearInterval(lock);
        }
        if(video == null || typeof video == 'undefined'){
            if(retryCount < maxRetry){
                console.log('可能是由于加载缓慢导致的未初始化问题，重试次数:'+retryCount+'，最大次数:'+maxRetry)
                retryCount++;
                return;
            }else{
                console.log("判定为当前页面没有视频，直接下一个作业");
                retryCount = 0;
                $(".next").click();
                isNext = true;
                return;
            }

        }
        if (video.paused && video.duration != video.currentTime) {
            video.playbackRate=4;
            video.muted = true;
            $('.mvp-toggle-play').click();
            return;
        }else if(video.duration == video.currentTime){
            console.log("播放完毕，下一个视频");
            $(".next").click();
            isNext = true;
        }},3000);
}