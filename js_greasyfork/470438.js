// ==UserScript==
// @name         自动播放抓取的音频文件使网页保持前台（挂机游戏）
// @namespace    Psychiiii.Su
// @version      1.3
// @license      MIT
// @description  Automatically play audio files to keep the webpage in the foreground. 从指定网址抓取音频文件并播放，用于部分网页挂机游戏保持前台，使用时请自行修改@Match以及下面“检查是否在指定网址”中的网址。
// @match        *://*.itch.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470438/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8A%93%E5%8F%96%E7%9A%84%E9%9F%B3%E9%A2%91%E6%96%87%E4%BB%B6%E4%BD%BF%E7%BD%91%E9%A1%B5%E4%BF%9D%E6%8C%81%E5%89%8D%E5%8F%B0%EF%BC%88%E6%8C%82%E6%9C%BA%E6%B8%B8%E6%88%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470438/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8A%93%E5%8F%96%E7%9A%84%E9%9F%B3%E9%A2%91%E6%96%87%E4%BB%B6%E4%BD%BF%E7%BD%91%E9%A1%B5%E4%BF%9D%E6%8C%81%E5%89%8D%E5%8F%B0%EF%BC%88%E6%8C%82%E6%9C%BA%E6%B8%B8%E6%88%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 音频文件的URL
    var audioURL = 'https://download.samplelib.com/mp3/sample-9s.mp3';

    // 创建音频元素
    var audio = new Audio();

    // 监听页面加载完成事件
    window.addEventListener('load', function() {
        // 检查是否在指定网址
        if (window.location.href.indexOf('itch.io') !== -1) {
            // 加载音频文件
            audio.src = audioURL;
            audio.loop = true;
            audio.volume = 0.01;
            audio.play();
        }
    });
})();