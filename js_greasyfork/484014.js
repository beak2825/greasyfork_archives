// ==UserScript==
// @name         【万能】宏少-视频全站加速
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  "全站视频加速视频，Q793890171"
// @author       万能加速脚本
// @match        http*://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gptapi.us
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484014/%E3%80%90%E4%B8%87%E8%83%BD%E3%80%91%E5%AE%8F%E5%B0%91-%E8%A7%86%E9%A2%91%E5%85%A8%E7%AB%99%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/484014/%E3%80%90%E4%B8%87%E8%83%BD%E3%80%91%E5%AE%8F%E5%B0%91-%E8%A7%86%E9%A2%91%E5%85%A8%E7%AB%99%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待页面上的视频元素可用
    function waitForVideo() {
        var video = document.querySelector('video');
        if (video) {
            addSpeedControlPanel(video);
        } else {
            setTimeout(waitForVideo, 500); // 如果没有找到视频，500ms后再次尝试
        }
    }

    // 添加播放速度控制面板
    function addSpeedControlPanel(video) {
        // 创建面板元素
        var panel = document.createElement('div');
        var speedInput = document.createElement('input');
        var speedInputLabel = document.createElement('label');

        // 设置输入框的属性
        speedInput.type = 'number';
        speedInput.min = '1';
        //speedInput.max = '10';
        speedInput.step = '2';
        speedInput.value = '1'; // 默认速度为正常速度
        speedInput.style.width = '50px';

        // 设置标签
        speedInputLabel.textContent = '播放速度: ';
        speedInputLabel.htmlFor = 'speed-input';

        // 设置面板样式
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '10px';
        panel.style.backgroundColor = '#FFF';
        panel.style.border = '1px solid #000';
        panel.style.padding = '5px';
        panel.style.zIndex = '10000';

        // 监听输入框的变化事件
        speedInput.addEventListener('input', function() {
            var speed = parseFloat(this.value);
            video.playbackRate = speed || 1; // 如果输入不是数字，则重置为1
        });

        // 将输入框和标签添加到面板
        panel.appendChild(speedInputLabel);
        panel.appendChild(speedInput);

        // 将面板添加到页面
        document.body.appendChild(panel);
    }

    // 开始检查视频元素
    waitForVideo();
})();