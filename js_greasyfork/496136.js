// ==UserScript==
// @name         B站看电影自动跳转片尾
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  该脚本用于在B站观看热心UP上传的分段电影视频，因为B站目前的反制措施，很多分段视频不得不在视频结尾的地方添加无关的视频拼凑时长，该脚本可以根据需要跳过该时间,感谢RyananChen提供的跳转思路
// @author       panndora
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496136/B%E7%AB%99%E7%9C%8B%E7%94%B5%E5%BD%B1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%89%87%E5%B0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/496136/B%E7%AB%99%E7%9C%8B%E7%94%B5%E5%BD%B1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%89%87%E5%B0%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 从localStorage读取开关状态和跳过时间，如果没有则设置默认值
    let isActive = localStorage.getItem('isActive') === 'true';
    let skipTimeSeconds = parseInt(localStorage.getItem('skipTimeSeconds'), 10) || 90; // 默认跳过时间设置为90秒

    // 创建开关按钮
    let toggleButton = document.createElement('button');
    toggleButton.innerText = isActive ? '关' : '开';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9999';
    document.body.appendChild(toggleButton);

    // 切换开关状态
    toggleButton.onclick = function() {
        isActive = !isActive;
        localStorage.setItem('isActive', isActive); // 保存开关状态到localStorage
        toggleButton.innerText = isActive ? '关' : '开';
        console.log("用户切换了状态");
    };

    // 创建输入框
    let inputSeconds = document.createElement('input');
    inputSeconds.type = 'number';
    inputSeconds.min = '1';
    inputSeconds.placeholder = '输入需要跳过的秒数';
    inputSeconds.style.position = 'fixed';
    inputSeconds.style.bottom = '20px'; // 与开关按钮等高
    inputSeconds.style.right = '40px'; // 初始位置在开关按钮旁边（假设按钮宽度为100px）
    inputSeconds.style.zIndex = '9999';

    // 为输入框添加样式，使其与按钮等高
    let buttonHeight = window.getComputedStyle(toggleButton).height;
    inputSeconds.style.top = `-${buttonHeight}}px`; // 根据按钮的高度设置input的top值，使其看起来等高
    inputSeconds.style.width = '80px'; // 可以调整输入框的宽度

    document.body.appendChild(inputSeconds);

    // 处理输入框的回车键事件
    inputSeconds.onkeypress = function(e) {
        if (e.key === 'Enter') {
            skipTimeSeconds = parseInt(inputSeconds.value, 10);
            if (!isNaN(skipTimeSeconds)) { // 确保输入的是数字
                localStorage.setItem('skipTimeSeconds', skipTimeSeconds); // 保存跳过时间到localStorage
                // 这里可以添加代码来根据新的跳过时间执行操作
                // ...
                console.log("用户设置了当前跳过时间为",skipTimeSeconds);
            }
        }
    };

    // 这里需要根据实际页面元素进行调整
    const videoElement = document.querySelector("#bilibili-player video"); // 你的视频元素选择器
    // 其他脚本代码，例如检查视频时间并跳转...
    function checkAndSkipVideo() {
        if (!isActive) return;
        if (videoElement) {
            console.log("定时器ID:", intervalId);
            console.log("用户设定的跳过秒数:", skipTimeSeconds);
            // 如果视频当前时间大于 视频总时间减去用户设定时间, 将当前播放时间设置为视频总时间实现跳过视频
            if (videoElement.currentTime > (videoElement.duration - skipTimeSeconds)){
                videoElement.currentTime = videoElement.duration;
                console.log("当前已经执行过跳过命令了.");
            }
        }
    }
    // 每1秒检查一次
    let intervalId = setInterval(checkAndSkipVideo, 1000);
    console.log("脚本加载完成");
})();