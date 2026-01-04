// ==UserScript==
// @name         weihou
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  微吼视频教程交互体验
// @author       galan99
// @match        https://live.vhall.com/room/watch/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446195/weihou.user.js
// @updateURL https://update.greasyfork.org/scripts/446195/weihou.meta.js
// ==/UserScript==

/* 使用es6声明 */
/* jshint esversion: 6 */

(function() {
  'use strict';
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  document.onkeydown = function(e) {
    var videoElement = document.querySelector("video");
    console.log(e.keyCode);
    if (!videoElement) return;
    let code = e ? e.keyCode : "";
    var vol = 0.1; //1代表100%音量，每次增减0.1
    var time = 10; //单位秒，每次增减10秒
    e.preventDefault();
    if (code == 38) {
      // 上键
      videoElement.volume !== 1 ? videoElement.volume += vol : 1;
    } else if (code == 40) {
      // 下键
      videoElement.volume !== 0 ? videoElement.volume -= vol : 1;
    } else if (code == 37) {
      // 左键
      videoElement.currentTime !== 0 ? videoElement.currentTime -= time : 1;
    } else if (code == 39) {
      // 右键
      videoElement.volume !== videoElement.duration ? videoElement.currentTime += time : 1;
    } else if (code == 32) {
      // 空格键
      videoElement.paused ? videoElement.play() : videoElement.pause();
    } else if (code == 49) {
      // 1键 倍率1.0
      videoElement.playbackRate = 1;
    } else if (code == 50) {
      // 2键
      videoElement.playbackRate = 1.3;
    } else if (code == 51) {
      // 3键
      videoElement.playbackRate = 1.5;
    } else if (code == 52) {
      // 4键
      videoElement.playbackRate = 2;
    }
  }

  function run() {
    var video = document.querySelector("video");
    var madol = document.querySelector("#vhy-danmaku-wrapbox");
    console.log(video)
    if (video && madol) {
      madol.style.display = "none";
      video.addEventListener("click", function() {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });
    } else {
      sleep(500).then(function() {
        run();
      });
    }
  }
  run()
})();