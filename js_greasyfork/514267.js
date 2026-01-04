// ==UserScript==
// @name         天津市专业技术人员继续教育网（性能优化+自动播放+解除光标限制）
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  天津市专业技术人员继续教育网 1.自动播放+解除光标限制 2.代码里有倍速和拖动进度条功能，取消注释即可使用，不推荐，会报错
// @author       zzzaaa
// @match        *://*.chinahrt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinahrt.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/514267/%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%2B%E8%A7%A3%E9%99%A4%E5%85%89%E6%A0%87%E9%99%90%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514267/%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%2B%E8%A7%A3%E9%99%A4%E5%85%89%E6%A0%87%E9%99%90%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    // 解除光标限制和自动播放设置的间隔
    window.beforeInterval = setInterval(function() {
        if (typeof attrset !== 'undefined') {
            attrset.ifPauseBlur = false; // 解除光标限制
            attrset.autoPlay = 1;
            //attrset.playbackRate = true; // 开启倍速
            //attrset.allowPlayRate = true; // 开启倍速
            //attrset.ifCanDrag = true; // 拖动进度条
        }
    }, 1000); // 1秒一次

    // 动态检测页面是否准备好
    function overrideCheckFunction() {
        if (typeof window.check === 'function') {
            window.check = function() {
                console.log('check执行了');
            };
            console.log('check function overridden after document is ready');
        }
        clearInterval(window.endInterval);
        clearInterval(window.beforeInterval); // 清除之前的定时器
    }

    // 使用DOMContentLoaded事件来确定页面是否已准备好
    document.addEventListener("DOMContentLoaded", function(event) {
        overrideCheckFunction();
    });

    // 设置一个3秒的备用延迟
    window.endInterval = setTimeout(overrideCheckFunction, 3000);

    // 自动播放检查的间隔
    window.anyInterval = setInterval(function() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.muted = true;
            videoElement.play().catch((error) => {
                console.error('Error playing video:', error);
            });
            // 视频开始播放后清除定时器
            clearInterval(window.anyInterval);
        } else {
            console.error('Video element not found');
        }
    }, 1000); // 1秒一次
})();