// ==UserScript==
// @name         bilibili长按倍速
// @namespace    
// @version      1.1
// @description  长按“0”二倍速，长按“.”三倍速，长按“+”四倍速
// @license      MIT

// @home-url   https://greasyfork.org/zh-TW/scripts/489797
// @homepageURL  https://greasyfork.org/zh-TW/scripts/489797

// @author       个人 一只小芙蝶
// @match        https://www.bilibili.com/*
// @icon         
// @grant        none



// @downloadURL https://update.greasyfork.org/scripts/489797/bilibili%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/489797/bilibili%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==
var videoElement =
  document.querySelector("video") || document.querySelector("bwp-video");
document.addEventListener("keydown", function (event) {
  var key = event.key;
  console.log("按下按键: " + key);
  var key_down_time = new Date().getTime();
  console.log(key_down_time);
  if (videoElement) {
    if (key === "0") {
      videoElement.playbackRate = 2;
      console.log("牛逼呀! 2倍速了。");
    } else if (key === ".") {
      videoElement.playbackRate = 3;
      console.log("!!!!! 3倍速了。 好快呀!");
    } else if (key === "+") {
      videoElement.playbackRate = 4;
      console.log("4倍速了。 要被玩坏了!");
    }
  } else {
    console.log("未找到视频元素，无法设置播放速度");
  }
});
document.addEventListener("keyup", function (event) {
  var key = event.key;
  console.log("松开按键: " + key);
  if (key === "0" || key === "." || key === "+") {
    videoElement.playbackRate = 1;
    console.log("终于恢复正常了，吓死人家了!!?!");
  }
});
