// ==UserScript==
// @name        中国大学Mooc刷学习时长
// @namespace   http://tampermonkey.net/
// @version     0.0.2
// @description 点亮所有学习任务后但是会发现学习时长不够，使用该脚本进行反复刷某一个视频即可。
// @author      HengY1
// @match       *://www.icourse163.org/learn/*
// @grant       none
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/475098/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6Mooc%E5%88%B7%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/475098/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6Mooc%E5%88%B7%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 先把debugger下掉，方便如果需要调试
    Function.prototype.__constructor_back = Function.prototype.constructor;
    Function.prototype.constructor = function () {
        if (arguments && typeof arguments[0] === 'string') {
            if ("debugger" === arguments[0]) {
                return
            }
        }
        return Function.prototype.__constructor_back.apply(this, arguments);
    }

    window.getVideo_hengyi = false;

    // 核心思路就是随便打开一个视频，然后缩小浏览器自己干自己的事情去。
    // 我们目前是会看时长，但不会看你看了哪些视频。

    // 拿到播放器进行相关控制
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement
    function checkPlayer() {
        let videoElement = document.querySelector('video');
        console.log("获取到videoElement", videoElement);
        if (videoElement) {
            clearInterval(intervalId); // 清除定时器
            window.getVideo_hengyi = true;
            videoElement.playbackRate = 1;
            videoElement.muted = true;
            videoElement.autoplay = true;
            videoElement.addEventListener('ended', () => {
                console.log('视频已经播放完毕,重新跳转到当前页面进行刷时间');
                location.reload();
            });
            videoElement.addEventListener('pause', () => {
                const currentTime = videoElement.currentTime;
                const duration = videoElement.duration;
                if (currentTime !== duration) { // 现在莫名多了个选择题，直接不管继续播放进行
                    setTimeout(function () {
                        document.getElementById('j-anchorContainer').style.display = 'none';
                        videoElement.play();
                    }, Math.floor(Math.random() * 400) + 800); // 模拟人在做题
                }
            });
        }
    }
    let intervalId = setInterval(checkPlayer, 500); // 没找到对应回调，暴力点

    function setStart() {
        if (window.getVideo_hengyi) {
            clearInterval(intervalId2); // 清除定时器
            setTimeout(function() {
                let videoElement = document.querySelector('video');
                videoElement.currentTime = 1; // 不管多少都从1s开始
              }, 2000);
        }
    }

    let intervalId2 = setInterval(setStart, 500);
})();