// ==UserScript==
// @name        规避防挂机和刷时间检查
// @namespace   Violentmonkey Scripts
// @match        *://me.xdf.cn/ntp/passThrough/*
// @grant       none
// @version     2.0
// @author      GY
// @license MIT
// @description 2025/5/10 16:31:01自动规避网页的防挂机和刷时间机制
// @downloadURL https://update.greasyfork.org/scripts/535539/%E8%A7%84%E9%81%BF%E9%98%B2%E6%8C%82%E6%9C%BA%E5%92%8C%E5%88%B7%E6%97%B6%E9%97%B4%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/535539/%E8%A7%84%E9%81%BF%E9%98%B2%E6%8C%82%E6%9C%BA%E5%92%8C%E5%88%B7%E6%97%B6%E9%97%B4%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 模拟鼠标移动，每30秒触发一次
    setInterval(function() {
        var event = new MouseEvent('mousemove', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        document.dispatchEvent(event);
        console.log('模拟鼠标移动');
    }, 30000);

    // 阻止页面检测到焦点丢失
    window.onblur = function() {
        return false;
    };

    // 自动点击防挂机弹窗的“继续播放”按钮
    setInterval(function() {
        var continueButton = document.querySelector('button:contains("继续播放")') ||
                           document.querySelector('.continue-play'); // 根据实际class或文本调整
        if (continueButton) {
            continueButton.click();
            console.log('点击继续播放按钮');
        }
    }, 1000);

    // 自动确认“好的”弹窗
    setInterval(function() {
        var okButton = document.querySelector('button:contains("好的")') ||
                      document.querySelector('.confirm'); // 根据实际class或文本调整
        if (okButton) {
            okButton.click();
            console.log('点击好的按钮');
        }
    }, 1000);

    // 确保视频持续播放
    setInterval(function() {
        var video = document.querySelector('video');
        if (video && video.paused) {
            video.play();
            console.log('恢复视频播放');
        }
    }, 1000);
})();