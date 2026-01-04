// ==UserScript==
// @name         B站音量调节幅度改至2% 恢复鼠标滚轮控制音量功能（解除Power Mouse X屏蔽）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将B站上下箭头按键的音量调节幅度设置为2%，增加鼠标滚轮控制音量功能（原本可以使用，但装了Power Mouse X插件被屏蔽了）
// @author       sidebar AI生成修改
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517590/B%E7%AB%99%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82%E5%B9%85%E5%BA%A6%E6%94%B9%E8%87%B32%25%20%E6%81%A2%E5%A4%8D%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E6%8E%A7%E5%88%B6%E9%9F%B3%E9%87%8F%E5%8A%9F%E8%83%BD%EF%BC%88%E8%A7%A3%E9%99%A4Power%20Mouse%20X%E5%B1%8F%E8%94%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/517590/B%E7%AB%99%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82%E5%B9%85%E5%BA%A6%E6%94%B9%E8%87%B32%25%20%E6%81%A2%E5%A4%8D%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E6%8E%A7%E5%88%B6%E9%9F%B3%E9%87%8F%E5%8A%9F%E8%83%BD%EF%BC%88%E8%A7%A3%E9%99%A4Power%20Mouse%20X%E5%B1%8F%E8%94%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const volumeStep = 0.02; // 每次调整的音量变化（2%）
    const videoSelector = 'video'; // 选择器用于选择视频元素

// 监听视频元素的点击事件，以设置激活状态
    const video = document.querySelector(videoSelector);

    //if (video) {
      //  video.addEventListener('', function() {
            //isVideoActive = true;
            //video.play();
        //    if(video &&document.fullscreenElement){ }
        //    else
       //     {
        //    video.webkitRequestFullscreen();
        //    console.log('焦点');}
            // 点击视频时设置为激活状态
            //document.querySelector('mirror-vdcon').click();
            //video.click();
            
      //  });}

    // 调整音量的函数
    const adjustVolume = (change) => {
        const video = document.querySelector(videoSelector);
        if (video) {
            video.volume = Math.min(1, Math.max(0, video.volume + change)); // 确保音量在 0 - 1 之间
console.log('增加后当前音量:', (video.volume ).toFixed(2) + '');

        }
    };

// 初始设置位置


    document.addEventListener('keydown', function(event) {
        const video = document.querySelector(videoSelector);
        switch (event.key) {
            case 'ArrowUp':
                 if (video&& document.activeElement === video) {
                adjustVolume(-0.08);}else{adjustVolume(0.02)} // 增加音量
                event.preventDefault();
event.stopPropagation();
                break;
            case 'ArrowDown':
                if (video&& document.activeElement === video) {
                adjustVolume(0.08);}else{adjustVolume(-0.02)} // 减少音量
event.stopPropagation();
                event.preventDefault();
                break;
        }
    });

   /* // 监听鼠标滚轮事件
    document.addEventListener('wheel', function(event) {
        // 检查是否在视频区域内
        const video = document.querySelector(videoSelector);
        if (video && document.fullscreenElement) { // 仅在全屏时有效
            // 向上滚动增加音量，向下滚动减少音量
            adjustVolume(event.deltaY > 0 ? -volumeStep : volumeStep);
            //event.preventDefault(); // 防止页面滚动
        }
    });
    */
    // 监听鼠标滚轮事件
document.addEventListener('wheel', function(event) {
    // 查找视频元素
    const video = document.querySelector(videoSelector);

    // 检查视频元素是否存在
    if (video) {
        // 获取视频元素的边界框
        const rect = video.getBoundingClientRect();

        // 检查鼠标是否在视频区域内
        const isMouseOverVideo = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

        // 如果鼠标在视频区域内，调整音量
        if (isMouseOverVideo) {
            // 向上滚动增加音量，向下滚动减少音量
            adjustVolume(event.deltaY > 0 ? -volumeStep : volumeStep);
            event.preventDefault(); // 防止页面滚动
            event.stopPropagation(); // 停止事件传播
              // 禁用页面滚动
            document.body.style.overflow = 'hidden';
        } else {
            // 恢复页面滚动
            document.body.style.overflow = 'auto';
        }
    }
}, { passive: false }); // 设置为非被动事件监听器

// 添加鼠标离开事件以恢复滚动
document.addEventListener('mouseleave', function() {
    document.body.style.overflow = 'auto'; // 鼠标离开页面时恢复滚动
});

    setInterval(function(){
        console.log(document.activeElement)
    },100000);




})();