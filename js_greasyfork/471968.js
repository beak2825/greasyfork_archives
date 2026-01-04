// ==UserScript==
// @name          🔥【就是爽】解决网盘不保存只能观看1秒的限制+可显示字幕(360和chrome均已测试)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  修复百度网盘视频播放暂停问题
// @license       Yolanda Morgan
// @author       Your Name
// @match        https://pan.baidu.com/*
// @exclude       *://pan.baidu.com/disk/*
// @exclude      *://pan.baidu.com/play/video#/video*
// @exclude       *://pan.baidu.com/pfile/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471968/%F0%9F%94%A5%E3%80%90%E5%B0%B1%E6%98%AF%E7%88%BD%E3%80%91%E8%A7%A3%E5%86%B3%E7%BD%91%E7%9B%98%E4%B8%8D%E4%BF%9D%E5%AD%98%E5%8F%AA%E8%83%BD%E8%A7%82%E7%9C%8B1%E7%A7%92%E7%9A%84%E9%99%90%E5%88%B6%2B%E5%8F%AF%E6%98%BE%E7%A4%BA%E5%AD%97%E5%B9%95%28360%E5%92%8Cchrome%E5%9D%87%E5%B7%B2%E6%B5%8B%E8%AF%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471968/%F0%9F%94%A5%E3%80%90%E5%B0%B1%E6%98%AF%E7%88%BD%E3%80%91%E8%A7%A3%E5%86%B3%E7%BD%91%E7%9B%98%E4%B8%8D%E4%BF%9D%E5%AD%98%E5%8F%AA%E8%83%BD%E8%A7%82%E7%9C%8B1%E7%A7%92%E7%9A%84%E9%99%90%E5%88%B6%2B%E5%8F%AF%E6%98%BE%E7%A4%BA%E5%AD%97%E5%B9%95%28360%E5%92%8Cchrome%E5%9D%87%E5%B7%B2%E6%B5%8B%E8%AF%95%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式表
    let style = document.createElement("style");

//也可以用下面语句控制播放栏目的位置,不能在样式表外指定,会被覆盖失效
//    style.innerHTML = `
//        #html5player .vjs-control-bar {
//            left: calc(80% - 33px) !important;
//        }
    style.innerHTML = `

        .vjs-control-bar {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 50%;
            transform: translateY(50%);
            justify-content: flex-end;
        }
         .vjs-progress-control{
            display: none !important;
        }
         .vjs-current-time-display{
            display: none !important;
        }
         .vjs-duration{
            display: none !important;
        }
         .vjs-time-control{
            display: none !important;
        }
         .vjs-volume-panel{
            display: none !important;
        }
          .vjs-play-control.vjs-control,
        #html5player_html5_api::-webkit-media-controls-fullscreen-button {
            display: none !important;
        }
    `;
    document.head.appendChild(style);


    let checkAble = setInterval(function(){
        let video = document.querySelector("#html5player_html5_api");
        let controlsBar = document.querySelector("#html5player .vjs-control-bar");
        let overlayIframe = document.querySelector("#video-wrap-outer .video-overlay-iframe");
        let videoStartTip = document.querySelector(".video-start-tip");

        if (video && controlsBar && overlayIframe && videoStartTip) {
            console.log("%cBaidu Wangpan Video Control: ", "color:red;font-size:16px;font-weight:bold", "Start");
            clearInterval(checkAble);


            // 修复视频播放暂停问题
            video.controls = true;
            video.pause = null;
            overlayIframe.style.display = "none";
            videoStartTip.style.display = "none";

            console.log("%cBaidu Wangpan Video Control: ", "color:green;font-size:16px;font-weight:bold", "Successful");
        }
    }, 1000);


        var parentElement1= document.querySelector("#html5player > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused");
        parentElement1.style = ' display: none; opacity: 0';
         //var parentElement2= document.querySelector(".video-js.vjs-control-bar");
       //parentElement2.style = 'position: absolute; display: block;  top: 82.5%; font-size: 15px; opacity: 0.4;';
           // var parentElement3= document.querySelector("#html5player > div.vjs-control-bar > div.vjs-duration.vjs-time-control.vjs-control > span.vjs-duration-display");
       // parentElement3.style = ' display: none; opacity: 0';


})();

