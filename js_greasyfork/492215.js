// ==UserScript==
// @name         大数据再教育自动刷课
// @namespace    http://tampermonkey.net/
// @version      v1.0.1
// @description  本脚本仅供学习和交流使用，不得用于任何违反法律法规或侵犯他人权益的行为。用户在使用本脚本时应自行承担责任，并遵守当地法律法规。若因使用本脚本导致任何违法违规行为，与本作者无关。
// @author       You
// @match        https://appn7ewdtmz2955.pc.xiaoe-tech.com/p/t_pc/course_pc_detail/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoe-tech.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492215/%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%86%8D%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/492215/%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%86%8D%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 定义要匹配的字符串开头，在每次课程完成后，下一个可以学习的课程的图标会变化
    var searchString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABadJREFUWEe1V12IVVUU/tY593adcqby';
    // learnig
    var searchString2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABmlJREFUWEetV2tsHNUZPWdm12u7sUOzOzNOyA/M'

    // 获取当前时间和总时长的span元素
    let currentTimeSpan
    let totalTimeSpan// 获取currentTimeSpan后面的span元素

    // 设置检查进度的间隔（例如每秒检查一次）
    const checkInterval = 5000;
    let intervalId = null; // 用于存储setInterval的ID，以便稍后清除它

 
    // 检查当前时间是否等于总时长的函数
    function checkIfTimeEqualsTotal() {
        currentTimeSpan = document.querySelector('.xeplayer-time-Tips');
        totalTimeSpan = currentTimeSpan.nextElementSibling; // 获取currentTimeSpan后面的span元素

        const currentTimeStr = currentTimeSpan.textContent;
        const totalTimeStr = totalTimeSpan.textContent;


        if (currentTimeStr === totalTimeStr) {
            // 执行当播放完成时的操作
            console.log('播放完成，执行其他操作');
            // 在这里添加你的代码，比如弹出提示、跳转到下一个视频等
            clickNextVideo()
            // 清除检查进度的定时器
            clearInterval(intervalId);
            intervalId = null;
            setTimeout(() => window.close(), 5000)
        } else {
            console.log('当前学习中：', currentTimeStr + '/' + totalTimeStr )
        }
    }

    // 点击下一个待学习的视频
    function clickNextVideo() {
        // 查找所有的图片标签
        var images = document.getElementsByTagName('img');

        // 打印正在检查的图片数量
        console.log("正在检查是否有下一个准备学习的视频");

        // 循环遍历每个图片
        for (var i = 0; i < images.length; i++) {
            // 检查图片的src属性是否以指定的字符串开头
            if (images[i].src.startsWith(searchString) || images[i].src.startsWith(searchString2)) {
                console.log('检查到有准备学习的视频')
                // 模拟点击图片
                images[i].parentElement.parentElement.click()
                console.log("点击下一个视频");
                break; // 停止循环
            }
        }
    }

    // 延时开始
    setTimeout(async () => {
        // 获取video元素
        const videoElement = document.querySelector('video');

        // 设置video为静音
        videoElement.muted = true;

        // 开始播放video
        try {
            videoElement.play()
            console.log('视频开始播放');
        }catch(error ) {
            console.error('播放视频时出错:', error);
        };

        console.log('开始检查进度的定时器')

        // 开始检查进度的定时器
        intervalId = setInterval(checkIfTimeEqualsTotal, checkInterval);
    }, 10000)
})();