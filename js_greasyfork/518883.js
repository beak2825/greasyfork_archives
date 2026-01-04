// ==UserScript==
// @name         B站/Bilibili片头片尾跳过
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Skip the intro and outro of Bilibili videos
// @author       Scabish
// @match        https://www.bilibili.com/bangumi/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518883/B%E7%AB%99Bilibili%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/518883/B%E7%AB%99Bilibili%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化配置
    let config = {
        skipIntro: GM_getValue('skipIntro', false),
        introDuration: GM_getValue('introDuration', 0),
        skipOutro: GM_getValue('skipOutro', false),
        outroDuration: GM_getValue('outroDuration', 0)
    };

    // 注册菜单命令以修改配置
    GM_registerMenuCommand("Configure Skipper", function() {
        const introDuration = prompt("输入要跳过的片头时长 (以秒为单位，0表示关闭该功能):", config.introDuration);
        const outroDuration = prompt("输入要跳过的片尾时长 (以秒为单位，0表示关闭该功能):", config.outroDuration);
        const skipIntro = introDuration !== null && introDuration !== "0";
        const skipOutro = outroDuration !== null && outroDuration !== "0";

        // 更新配置
        config = {
            skipIntro: skipIntro,
            introDuration: parseInt(introDuration, 10) || 0,
            skipOutro: skipOutro,
            outroDuration: parseInt(outroDuration, 10) || 0
        };

        // 保存配置
        GM_setValue('skipIntro', skipIntro);
        GM_setValue('introDuration', config.introDuration);
        GM_setValue('skipOutro', skipOutro);
        GM_setValue('outroDuration', config.outroDuration);
    });

    // 检查视频播放状态
    function checkVideoStatus() {
        // 获取视频元素
        const videoElement = document.querySelector('video');

        // 检查视频元素是否存在
        if (!videoElement) {
            return;
        }

        // 获取视频的当前播放时间
        const currentTime = videoElement.currentTime;
        let isPaused = true;
        // 检查视频是否已经开始播放
        if (currentTime > 0) {
            // 视频已开始播放
            isPaused = false;
        } else {
            // 视频暂停
            isPaused = true;
        }

        // 如果视频正在播放且已启用跳过片头，且当前时间小于片头时长，则跳转
        if (!isPaused && config.skipIntro && currentTime < config.introDuration) {
            skipIntro();
        }

        // 如果启用跳过片尾，则检查是否需要跳转
        if (config.skipOutro) {
            skipOutro();
        }
    }

    // 跳过片头
    function skipIntro() {
        const video = document.querySelector('video');
        if (video && video.readyState > 0) {
            video.currentTime = config.introDuration;
        }
    }

    // 跳过片尾
    function skipOutro() {
        const video = document.querySelector('video');
        if (video && video.readyState > 0) {
            const remainingTime = video.duration - video.currentTime;
            if (remainingTime < config.outroDuration) {
                const nextButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-next');
                if (nextButton) {
                    nextButton.click();
                }
            }
        }
    }

    // 设置定时器检查视频状态
    setInterval(checkVideoStatus, 5000);
})();
