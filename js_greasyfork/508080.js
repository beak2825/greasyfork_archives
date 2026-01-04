// ==UserScript==
// @name         xjtu体美劳平台倍速视频跳转
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  支持16倍加速，自动视频跳转，节省你宝贵的时间!!!!现在支持直接跳到视频结尾！！！！！！！！！！！！！！！！！！！！！！
// @author       大阉大蜰
// @match        https://vpahw.xjtu.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508080/xjtu%E4%BD%93%E7%BE%8E%E5%8A%B3%E5%B9%B3%E5%8F%B0%E5%80%8D%E9%80%9F%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/508080/xjtu%E4%BD%93%E7%BE%8E%E5%8A%B3%E5%B9%B3%E5%8F%B0%E5%80%8D%E9%80%9F%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setVideoSpeed() {
        var video = document.querySelector('video');
        if (video) {
            video.playbackRate = 15.0;       // 修改此值设置当前的播放倍数
        } else {
            console.log('No video element found.');
        }
    }

    function removeElements() {
        var elements = document.querySelectorAll('.ck-bar.ck-bar-out');
        elements.forEach(function(element) {
            element.parentNode.removeChild(element);
        });

        var videos = document.querySelectorAll('video');
        videos.forEach(function(video) {
            if (!video.hasAttribute('controls')) {
                video.setAttribute('controls', 'controls');
            }
            setVideoSpeed(); // 设置视频速度
        });
    }



    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeElements();
            }
        });
    });

    var config = { childList: true, subtree: true };
    var targetNode = document.body;
    observer.observe(targetNode, config);

    removeElements(); // 初始调用删除函数

    // 监听视频元素的加载事件
    var video = document.querySelector('video');

    // 定义一个函数来计算并打印视频的剩余时间
function calculateAndPrintRemainingTime() {
    var video = document.querySelector('video');
    if (video) {
        var currentTime = video.currentTime; // 获取当前播放时间
        var duration = video.duration; // 获取视频总时长
        var remainingTime = duration - currentTime; // 计算剩余时间
        if(currentTime<10000)
        {
            video.currentTime = video.duration;
        }
        if (remainingTime == 0) {
            console.log("视频结束，转跳下一个视频")
           var divs = document.querySelectorAll('.bg-gray-50.opacity-100');
        if (divs.length > 0) {
            var firstDiv = divs[0];
            console.log("下一个视频是"+ firstDiv.textContent)
            firstDiv.click();
        } else {
            console.log('No divs with class .bg-gray-50 found after video ended.');
        }
        }
    } else {
        console.log('No video element found.');
    }
}

// 设置定时器，每隔1秒调用一次 calculateAndPrintRemainingTime 函数
var intervalId = setInterval(calculateAndPrintRemainingTime, 500);
// 监听视频播放结束事件，当视频播放结束时清除定时器
if (video) {
    video.addEventListener('ended', function() {
        console.log("视频播放完毕，定时器已清除。");
        clearInterval(intervalId); // 清除定时器
    });
}
    if (video) {
        video.addEventListener('loadedmetadata', setVideoSpeed);
    }
})();