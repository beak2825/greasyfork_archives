// ==UserScript==
// @name         YouTube 自动选择最高画质 + 自动跳过广告
// @namespace    https://cococ.co/
// @version      4.1
// @description  自动将 YouTube 视频设置为最高可用画质，并自动点击“跳过广告”按钮、关闭横幅广告、加速不可跳过的广告。稳定、高效、省心。
// @author       blues max (融合优化)
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544945/YouTube%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%20%2B%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/544945/YouTube%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%20%2B%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 全局配置区 ---
    const CONFIG = {
        // 画质相关配置
        setQuality: true, // 是否启用自动画质选择功能
        preferredQualities: ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720'], // 优先画质列表

        // 广告相关配置
        skipAds: true, // 是否启用自动跳过广告功能
        adCheckInterval: 100, // 检查广告的频率 (毫秒)

        // 调试模式
        debug: false // 设置为 true 可在控制台看到详细日志
    };

    const log = (...args) => {
        if (CONFIG.debug) {
            console.log('[YT-Ultimate]', ...args);
        }
    };

    // --- 模块一：画质选择 ---

    /**
     * 设置画质的核心函数
     * @param {object} player - YouTube 播放器实例
     * @returns {boolean} - 是否成功设置或检查完毕
     */
    function setBestQuality(player) {
        if (!player || typeof player.getAvailableQualityLevels !== 'function') {
            log('画质模块: 播放器或 API 不可用。');
            return false;
        }

        const availableQualities = player.getAvailableQualityLevels();
        if (availableQualities.length === 0) {
            log('画质模块: 画质列表为空（可能是广告），等待下一次机会。');
            return false;
        }

        log('画质模块: 可用画质:', availableQualities);

        for (const quality of CONFIG.preferredQualities) {
            if (availableQualities.includes(quality)) {
                const currentQuality = player.getPlaybackQuality();
                if (currentQuality !== quality) {
                    player.setPlaybackQualityRange(quality);
                    player.setPlaybackQuality(quality);
                    log(`✅ 画质已成功切换到 -> ${quality}`);
                } else {
                    log(`👍 当前画质 (${currentQuality}) 已是最佳，无需更改。`);
                }
                return true;
            }
        }

        log('🤷‍♂️ 未找到偏好的画质选项。');
        return true;
    }

    /**
     * 轮询检查播放器是否准备就绪并设置画质
     */
    function pollingCheckQuality() {
        let attempts = 0;
        const maxAttempts = 15;

        const intervalId = setInterval(() => {
            const player = document.getElementById('movie_player');
            attempts++;

            if (player && typeof player.getAvailableQualityLevels === 'function') {
                if (setBestQuality(player)) {
                    clearInterval(intervalId);
                    attachStateChangeListener(player);
                }
            }

            if (attempts >= maxAttempts) {
                log('画质模块: 超时，未能找到播放器或设置画质。');
                clearInterval(intervalId);
            }
        }, 1000);
    }

    /**
     * 附加 onStateChange 监听器，用于在广告后快速恢复画质
     */
    function attachStateChangeListener(player) {
        if (player.dataset.qualityListenerAttached === 'true') return;
        player.addEventListener('onStateChange', (state) => {
            if (state === 1) { // 1 = 正在播放
                log('▶️ 播放状态改变，重新检查画质...');
                setTimeout(() => setBestQuality(player), 250);
            }
        });
        player.dataset.qualityListenerAttached = 'true';
        log('画质模块: 事件监听器已附加。');
    }

    // --- 模块二：广告处理 ---

    /**
     * 检查并处理广告的函数
     */
    function handleAds() {
        // 1. 寻找并点击“跳过广告”按钮 (包括新旧两种样式)
        const skipButton = document.querySelector('.ytp-ad-skip-button-modern, .ytp-ad-skip-button');
        if (skipButton) {
            log('广告模块: 发现可跳过广告，点击！');
            skipButton.click();
        }

        // 2. 寻找并关闭视频上方的“横幅广告”
        const closeButton = document.querySelector('.ytp-ad-overlay-close-button');
        if (closeButton) {
            log('广告模块: 发现横幅广告，关闭！');
            closeButton.click();
        }

        // 3. 加速无法跳过的广告（高级技巧）
        // .ad-showing 选择器表示广告正在播放
        const adVideo = document.querySelector('.ad-showing .html5-main-video');
        if (adVideo) {
            // 将广告静音并以16倍速快进，让它光速结束
            adVideo.muted = true;
            adVideo.playbackRate = 16;
        }
    }

    // --- 脚本主入口 ---

    log('终极脚本启动！');

    // 启动画质选择功能
    if (CONFIG.setQuality) {
        log('画质选择功能已启用。');
        window.addEventListener('yt-navigate-finish', () => {
            log('--- 页面导航完成，启动画质检查 ---');
            pollingCheckQuality();
        });
        pollingCheckQuality(); // 首次加载时执行
    }

    // 启动广告处理功能
    if (CONFIG.skipAds) {
        log('广告处理功能已启用。');
        // 使用 setInterval 持续检查广告，这是最可靠的方式
        setInterval(handleAds, CONFIG.adCheckInterval);
    }

})();
