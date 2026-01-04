// ==UserScript==
// @name         coolcollege
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  原脚本为DingTalk 0.2版。更新了适配网址learning.coolcollege.cn，点击学习的视频，1秒钟后自动6倍数播放，点击中途的防挂机弹窗，进度100%时自动点击返回课程，后续的自动下一节课播放没空做了。
// @author       Devilz
// @match        https://*.coolcollege.cn/*
// @icon         https://oss.coolcollege.cn/1925559134103670784.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472893/coolcollege.user.js
// @updateURL https://update.greasyfork.org/scripts/472893/coolcollege.meta.js
// ==/UserScript==

window.isDOMLoaded = false;
window.isDOMRendered = false;

document.addEventListener('readystatechange', function () {
    if (document.readyState === "interactive" || document.readyState === "complete") {
        window.isDOMLoaded = true;
    }
});
~function (global){
    'use strict';

 var cli = function(){
   var v = document.querySelector("video");
   v.playbackRate = 6;
    console.log("6倍速启动");
   //var button = document.evaluate("//*[@class='prism-big-play-btn pause']", document).iterateNext();
   //console.log("button:"+button)
   var button2 = document.evaluate("//*[@class='new-watch-course-page__right__catalog__item active']/following-sibling::div[1]", document).iterateNext();
   var buttonContinue = document.evaluate("//*[@class='ant-btn ant-btn-primary']", document).iterateNext();
   var buttonPlaying = document.evaluate("//*[@class='prism-play-btn']", document).iterateNext();
   var buttonBigPlaying = document.evaluate("//*[@class='prism-big-play-btn']", document).iterateNext();
   var buttonBack = document.evaluate("//*[@class='ant-btn ant-btn-link']", document).iterateNext();
   var ifProgressFinished;
     if("width: 100%;" == document.evaluate("//*[@class='prism-progress-played']", document).iterateNext().getAttribute("style")){
         ifProgressFinished = true;
         console.log("ifProgressFinished:"+ifProgressFinished);
     }else{
         ifProgressFinished = false;
         console.log("ifProgressFinished:"+ifProgressFinished);
     }

     if ( ifProgressFinished ) {
         buttonBack.click();
         console.log("进度100%，返回");
     }
     if (!ifProgressFinished && buttonBigPlaying != undefined && buttonBigPlaying != null && buttonPlaying != undefined && buttonPlaying != null) {
         buttonBigPlaying.click();
         console.log("点击大播放键，开始播放。buttonBigPlaying:"+buttonBigPlaying);
     }else if(!ifProgressFinished && buttonPlaying != undefined && buttonPlaying != null){
         buttonPlaying.click();
         console.log("点击小播放键，开始播放。buttonPlaying:"+buttonPlaying);
     }
     if (!ifProgressFinished && buttonPlaying != undefined && buttonPlaying != null && buttonContinue != undefined && buttonContinue != null) {
         buttonContinue.click();
         console.log("点击弹窗，继续播放");
     }


 }
     var timer1 = setInterval(cli, 10000);
     // Your code here...
        if (global.eHook) {
         global.eHook.plugins({
             name: 'timer1',
             /**
              * 插件装载
              * @param util
              */
             mout: timer1
         });
     }
}(window);
