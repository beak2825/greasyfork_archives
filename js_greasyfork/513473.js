// ==UserScript==
// @name         天津市专业技术人员继续教育网（自动播放+解除光标限制）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  天津市专业技术人员继续教育网 1.自动播放+解除光标限制 2.代码里有倍速和拖动进度条功能，取消注释即可使用，不推荐，会报错
// @author       zzzaaa
// @match        *://*.chinahrt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinahrt.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/513473/%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%2B%E8%A7%A3%E9%99%A4%E5%85%89%E6%A0%87%E9%99%90%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513473/%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%2B%E8%A7%A3%E9%99%A4%E5%85%89%E6%A0%87%E9%99%90%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    window.beforeInterval = setInterval(function() {
        attrset.ifPauseBlur = false;//解除光标限制
        attrset.autoPlay = 1;
        //attrset.playbackRate = true;//开启倍速
        //attrset.allowPlayRate = true;//开启倍速
        //attrset.ifCanDrag = true;//拖动进度条
    }, 50);
    // 延迟后覆盖 check 函数
    window.endInterval = setTimeout(function() {
        clearInterval(window.beforeInterval);
        //覆盖 check() 函数
        window.check = function() {
            console.log('check执行了');
        };
        console.log('check function overridden after 10 seconds');
        clearInterval(window.endInterval);
    }, 5000); 
    window.anyInterval = setInterval(function() {
        console.log(attrset);
        //自动播放
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.muted = true;
            videoElement.play().catch((error) => {
                console.error('Error playing video:', error);
            });
        } else {
            console.error('Video element not found');
        }
    }, 500);
})();