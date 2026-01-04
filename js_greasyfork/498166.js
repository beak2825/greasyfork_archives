// ==UserScript==
// @name         视频快进
// @namespace    https://bmmmd.com/
// @version      0.2
// @description  视频快进!
// @author       bmm
// @match        https://v.qq.com/x/cover/*/*.html*
// @match        https://www.mgtv.com/b/*/*.html*
// @match        https://www.iqiyi.com/v_*.html*
// @match        https://v.youku.com/v_show/*
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.bilibili.com/video/*/*
// @match        https://www.acfun.cn/v/*
// @grant        none
// @run-at       document-idle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/498166/%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/498166/%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* 配置 */
    let playbackRate = 3; // 默认快进速度
    const holdKey = '.'; // 长按快进模式按钮
    const clickKey = ','; // 点击快进模式按钮
    const showTips = true; // 是否显示快进提示

    /**
     * 快进提示
     * @param text 提示文本
     */
    const tips = (text, video) => {
        if (!showTips) { return; }
        let tipsDIV = document.querySelector('#bmmmd_video_fast_tips');
        if (!tipsDIV) {
            tipsDIV = document.createElement("div");
            tipsDIV.id = "bmmmd_video_fast_tips";
            tipsDIV.style.cssText = "position:absolute;width:6rem;height:6rem;border-radius:50%;background-color:rgba(255,255,255,0.5);display:none;justify-content:center;align-items:center;z-index:999999;font-size:2rem;color:#fff;";
            document.body.appendChild(tipsDIV);
        }
        tipsDIV.innerHTML = text;
        tipsDIV.style.display = "flex";
        if (video) {
            const rect = video.getBoundingClientRect();
            tipsDIV.style.top = `${rect.top + rect.height / 2 - tipsDIV.offsetHeight / 2}px`;
            tipsDIV.style.left = `${rect.left + rect.width / 2 - tipsDIV.offsetWidth / 2}px`;
        } else {
            tipsDIV.style.top = tipsDIV.style.left = "50%";
            tipsDIV.style.transform = "translate(-50%, -50%)";
        }
        setTimeout(function () {
            tipsDIV.style.display = "none";
        }, 500);
    }
    /**
     * 遍历所有video标签
     * @param callback 回调函数
     */
    const iterateVideos = (callback) => {
        const videos = document.querySelectorAll('video');
        for (const index in videos) {
            if (!videos[index].getAttribute('src') || videos[index].videoHeight == 0 || videos[index].videoWidth == 0) { continue; }
            callback(videos[index]);
        }
    }
    /**
     * 设置视频播放速度
     * @param fast 快速播放 or 恢复
     */
    const changePlaybackRate = (fast = true) => {
        iterateVideos((video) => {
            if (fast) {
                video.originalPlaybackRate = video.playbackRate;
                video.playbackRate = playbackRate;
            } else {
                video.playbackRate = video.originalPlaybackRate ?? 1;
            }
            tips(`x${video.playbackRate}`, video);
        });
    }
    let isPressed = false; // 是否按住
    let isToggled = false; // 是否切换
    /* 按下按钮 */
    const handleKeyDown = (event) => {
        // 长按只触发一次 忽略在输入框中的按键事件
        if (event.repeat || event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") { return; }
        // 当前按下状态 且 按下的键是数字键 则修改播放速度
        if ((isPressed || isToggled) && event.key >= 1 && event.key <= 9) {
            playbackRate = Number(event.key);
            iterateVideos((video) => {
                video.playbackRate = playbackRate;
                tips(`x${video.playbackRate}`, video);
            });
        } else if (event.key == holdKey) {
            isPressed = true;
            changePlaybackRate();
        } else if (event.key == clickKey) {
            isToggled = !isToggled;
            changePlaybackRate(isToggled);
        }
    }
    /* 松开按钮 */
    const handleKeyUp = (event) => {
        // 忽略在输入框中的按键事件
        if (event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") { return; }
        if (event.key == holdKey) {
            isPressed = false;
            changePlaybackRate(false);
        }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
})();