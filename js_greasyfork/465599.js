// ==UserScript==
// @name         bilibili自动选择中文翻译字幕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  哔哩哔哩自动开启字幕
// @match        https://www.bilibili.com/video/*
// @author       无名尸
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465599/bilibili%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/465599/bilibili%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(() => {
  'use strict';
  // 定义一个函数，用于启动定时器并监视目标元素的出现
  function startTimer() {
    // 执行定时器，每 500 毫秒检查一次是否存在指定的元素
        var intervalId = setInterval(function() {
            // 找到要点击的 div 元素
        var div = document.querySelector('div.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle').querySelector('div.bpx-player-ctrl-btn-icon').querySelector('span.bpx-common-svg-icon');
        // 如果找到了元素，就模拟点击它
                if (div) {
                    console.log('Hello, world!');
                    div.click();
                    clearInterval(intervalId); // 停止定时器
                }
            }
        , 500); // 每 500 毫秒执行一次
  }
    function init(){
   // 执行定时器，每 500 毫秒检查一次是否存在指定的元素
        var intervalId = setInterval(function() {
        var video = document.querySelector('video');
                if (video) {
                    video.addEventListener('loadeddata', startTimer);
                    clearInterval(intervalId); // 停止定时器
                }
            }
        , 500); // 每 500 毫秒执行一次
    }
    init();
})();

