// ==UserScript==
// @name         bilibili视频自动关闭弹幕、自动跳过充电鸣谢
// @namespace    https://greasyfork.org/zh-CN/scripts/438631
// @version      1.4
// @description  刚打开视频时自动关闭弹幕，自动跳过视频最后弹出的5s充电鸣谢页面
// @author       SolitudeFate
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438631/bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95%E3%80%81%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/438631/bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95%E3%80%81%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //播放视频时自动关闭弹幕
    window.onload=() => {
         //判断弹幕按钮是否开启
         if(document.getElementsByClassName('choose_danmaku')[0].innerHTML == "关闭弹幕") {
            //模拟点击关闭弹幕按钮
            document.getElementsByClassName('bui-switch-input')[0].click();
         }
    };

    //跳过充电鸣谢
    //每150ms检测当前是否跳出充电鸣谢
    setInterval(() => {
        // 判断是否跳出充电鸣谢
        if (document.getElementsByClassName('bilibili-player-electric-panel-jump')[0]) {
            // 模拟点击跳过按钮
            document.getElementsByClassName('bilibili-player-electric-panel-jump-content')[0].click();
        }
    }, 150)
})();