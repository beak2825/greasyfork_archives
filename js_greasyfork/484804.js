// ==UserScript==
// @name         腾讯视频跳过片头(2024)
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  视频开始播放时，按 J 或者 Enter 跳过片头
// @author       XHXIAIEIN
// @match        *://v.qq.com/*
// @icon         https://v.qq.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484804/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%282024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484804/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%282024%29.meta.js
// ==/UserScript==

//-------------------------------------------
// 看动漫总是好长的的片头手动点太烦
// 按 J 或 Enter 跳过一定时间。
// 按 N 或 小键盘. 跳转到下一集。
//-------------------------------------------

// 跳过时间的键值
const skipKey = ['j', 'Enter'];
const skipTime = 19; // 片头长度

// 跳转到下一集
const nextEpisodeKey = ['n', 'NumpadDecimal'];


//-------------------------------------------
// 基于 @PLAY233 发布的脚本改编(scripts/403400)
// 1. 适配新版页面，使跳过功能可以正常工作
// 2. 增加更多快捷键，可以跳转到下一集。
//-------------------------------------------

// 于防止按键一直按着进度条一直跳的情况
let allowed = true;

window.document.onkeydown = function(event) {
    if (event.repeat !== undefined) {
        allowed = !event.repeat;
    }
    if (!allowed) {
        return;
    }
    allowed = false;

    // 跳过时间
    if (skipKey.includes(event.key)) {
        let video = document.querySelector("video[src]");
        if (video && video.currentTime < skipTime) {
            video.currentTime += skipTime;
            video.play();
        }
    }

    // 跳转到下一集
    if (nextEpisodeKey.includes(event.key)) {
        let nextButton = document.querySelector("div[aria-label='下一个']");
        if (nextButton){
          nextButton.click();
        }
    }
};

window.document.onkeyup = function(event) {
    allowed = true;
};