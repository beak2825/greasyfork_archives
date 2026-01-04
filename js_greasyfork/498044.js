// ==UserScript==
// @name         河北省专业技术人员继续教育
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  实现网课视频16倍速播放（未实现自动连播）
// @author       randox@126.com
// @match        https://contentzyjs.heb12333.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498044/%E6%B2%B3%E5%8C%97%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/498044/%E6%B2%B3%E5%8C%97%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setVideoSpeed() {
        document.querySelectorAll('video').forEach(v => v.playbackRate = 16);
    }

    setVideoSpeed();

    new MutationObserver(mutations =>
        mutations.forEach(({ addedNodes }) =>
            addedNodes.forEach(node => node.tagName === 'VIDEO' && (node.playbackRate = 16))
        )
    ).observe(document.body, { childList: true, subtree: true });

    // 定期检测是否出现限制弹窗
    setInterval(function() {
        // 使用更精确的选择器定位弹窗
        const popupElement = document.querySelector('.layui-layer-dialog[times="2"] .layui-layer-content');
        if (popupElement && popupElement.textContent.includes('不允许倍速观看')) {
            console.log('Popup detected, attempting to close');

            // 自动关闭弹窗
            const closeButton = document.querySelector('.layui-layer-dialog[times="2"] .layui-layer-close1');
            if (closeButton) {
                closeButton.click();
                console.log('Popup closed');
            } else {
                // 如果无法自动关闭,提示用户手动关闭
                alert('请手动关闭弹窗以继续观看');
            }

            // 再次设置播放速率为16倍
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.playbackRate = 16;
                console.log('Playback rate reset to 16x');
            }

            // 查找跳过按钮并模拟点击
            const skipButton = document.querySelector('.skip-button');
            if (skipButton) {
                skipButton.click();
                console.log('Skip button clicked');
            }
        }
    }, 500);
})();