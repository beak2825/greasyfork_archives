// ==UserScript==
// @name         消防课程自动刷课工具
// @namespace    http://tampermonkey.net/
// @version      1.2.8
// @description  自动完成高层民用建筑消防安全管理规定课程学习，修复控制面板显示问题
// @author       Your Name
// @match        https://shhxf.119.gov.cn/*    @require  https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue  
// @downloadURL https://update.greasyfork.org/scripts/531781/%E6%B6%88%E9%98%B2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/531781/%E6%B6%88%E9%98%B2%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------- 配置参数 --------------------
    const AUTO_PLAY_INTERVAL = 500; // 自动播放间隔（毫秒）
    const CAPTCHA_CHECK_INTERVAL = 2000; // 验证码检测间隔（毫秒）
    const MAX_RETRY_TIMES = 3; // 最大重试次数
    const PLAY_BUTTON_SELECTOR = '.vjs-big-play-button'; // 播放按钮选择器
    const INITIALIZATION_DELAY = 1000; // 初始化延迟（毫秒）

    // -------------------- 全局变量 --------------------
    let isAutoPlay = false;
    let currentEpisode = 0;
    let retryCount = 0;
    let controlPanel = null;

    // -------------------- 错误处理 --------------------
    function logError(message, error) {
        console.error(`[消防刷课工具错误] ${message}`, error);
        if (controlPanel) {
            $('#status', controlPanel).text(`错误: ${message}`);
        }
    }

    // -------------------- 状态持久化 --------------------
    function loadSavedState() {
        try {
            isAutoPlay = GM_getValue('isAutoPlay', false);
            currentEpisode = GM_getValue('currentEpisode', 0);
            retryCount = GM_getValue('retryCount', 0);
        } catch (error) {
            logError('加载保存的状态失败', error);
            // 使用默认值继续执行
            isAutoPlay = false;
            currentEpisode = 0;
            retryCount = 0;
        }
    }

    function saveState() {
        try {
            GM_setValue('isAutoPlay', isAutoPlay);
            GM_setValue('currentEpisode', currentEpisode);
            GM_setValue('retryCount', retryCount);
        } catch (error) {
            logError('保存状态失败', error);
        }
    }

    // -------------------- 控制面板初始化 --------------------
    function initControlPanel() {
        try {
            controlPanel = $('<div id="courseAutoPanel"></div>')
                .css({
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    zIndex: '9999',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px'
                })
                .html(`
                    <h4 style="margin-top: 0; margin-bottom: 10px;">刷课控制面板</h4>
                    <div style="margin-bottom: 5px;">当前课程：<span id="currentEpisode">${currentEpisode}</span></div>
                    <div style="margin-bottom: 5px;">自动播放：<button id="playToggle" style="padding: 2px 8px;">${isAutoPlay ? '暂停' : '开启'}</button></div>
                    <div style="margin-bottom: 5px;">状态：<span id="status">${isAutoPlay ? '运行中' : '已暂停'}</span></div>
                    <div style="margin-bottom: 5px;">验证码重试：<span id="retryCount">${retryCount}</span>/ ${MAX_RETRY_TIMES}</div>
                    <div><button id="forceNext" style="padding: 2px 8px;">强制下一集</button></div>
                    <div><button id="resetScript" style="padding: 2px 8px;">重置脚本</button></div>
                `);

            $('body').append(controlPanel);

            // 绑定按钮事件
            $('#playToggle', controlPanel).on('click', toggleAutoPlay);
            $('#forceNext', controlPanel).on('click', forceNextEpisode);
            $('#resetScript', controlPanel).on('click', resetScript);

            updateStatus('脚本已初始化');
        } catch (error) {
            logError('初始化控制面板失败', error);
        }
    }

    // -------------------- 自动播放控制 --------------------
    function toggleAutoPlay() {
        isAutoPlay = !isAutoPlay;
        updateControlPanel();
        saveState();
        if (isAutoPlay) startAutoPlay();
    }

    function startAutoPlay() {
        try {
            setInterval(() => {
                if (isAutoPlay) {
                    if (isVideoPaused()) autoPlayVideo();
                    else if (isVideoEnded()) playNextEpisode();
                }
            }, AUTO_PLAY_INTERVAL);
            updateStatus('自动播放已启动');
        } catch (error) {
            logError('启动自动播放失败', error);
        }
    }

    function isVideoPaused() {
        try {
            return $('.video-js').hasClass('vjs-paused');
        } catch (error) {
            logError('检查视频暂停状态失败', error);
            return false;
        }
    }

    function isVideoEnded() {
        try {
            const video = $('#demoVideo_html5_api')[0];
            return video && video.ended;
        } catch (error) {
            logError('检查视频结束状态失败', error);
            return false;
        }
    }

    // -------------------- 视频播放控制 --------------------
    function autoPlayVideo() {
        try {
            const playButton = $(PLAY_BUTTON_SELECTOR);
            if (playButton.length && isVideoPaused()) {
                playButton.click();
                updateStatus('已恢复播放');
            }
        } catch (error) {
            logError('播放视频失败', error);
        }
    }

    // -------------------- 课程切换处理 --------------------
    function playNextEpisode() {
        try {
            const currentLi = $('li.on');
            const nextLi = currentLi.next('li');

            if (nextLi.length) {
                currentEpisode = parseInt(nextLi.text().match(/\d+$/)[0]);
                nextLi.click();
                updateControlPanel();
                saveState();
                updateStatus(`切换至第 ${currentEpisode} 集`);

                // 切换集数后尝试播放
                setTimeout(autoPlayVideo, 1500);
            } else {
                stopAutoPlay();
                updateStatus('所有课程已完成');
            }
        } catch (error) {
            logError('切换课程失败', error);
        }
    }

    // -------------------- 验证码处理 --------------------
    function checkCaptcha() {
        try {
            const captchaModal = $('.modal-content:visible');
            if (captchaModal.length) {
                handleCaptcha();
            }
        } catch (error) {
            logError('检查验证码失败', error);
        }
    }

    function handleCaptcha() {
        try {
            retryCount++;
            updateControlPanel();
            saveState();

            if (retryCount > MAX_RETRY_TIMES) {
                stopAutoPlay();
                updateStatus('验证码处理失败，超过最大重试次数');
                return;
            }

            updateStatus('检测到验证码，刷新页面');
            location.reload();
        } catch (error) {
            logError('处理验证码失败', error);
        }
    }

    // -------------------- 状态更新 --------------------
    function updateControlPanel() {
        if (!controlPanel) return;

        $('#currentEpisode', controlPanel).text(currentEpisode);
        $('#playToggle', controlPanel).text(isAutoPlay ? '暂停' : '开启');
        $('#status', controlPanel).text(isAutoPlay ? '运行中' : '已暂停');
        $('#retryCount', controlPanel).text(retryCount);
    }

    function updateStatus(text) {
        if (controlPanel) {
            $('#status', controlPanel).text(text);
        }
        console.log(`[消防刷课工具] ${text}`);
    }

    function stopAutoPlay() {
        isAutoPlay = false;
        updateControlPanel();
        saveState();
    }

    // -------------------- 辅助功能 --------------------
    function forceNextEpisode() {
        playNextEpisode();
        updateStatus('强制跳转下一集');
    }

    function resetScript() {
        try {
            GM_setValue('isAutoPlay', false);
            GM_setValue('currentEpisode', 0);
            GM_setValue('retryCount', 0);
            location.reload();
        } catch (error) {
            logError('重置脚本失败', error);
        }
    }

    // -------------------- 初始化执行 --------------------
    function initializeScript() {
        try {
            loadSavedState();
            initControlPanel();

            // 延迟启动自动播放，确保页面元素加载完成
            setTimeout(() => {
                if (isAutoPlay) {
                    startAutoPlay();
                    autoPlayVideo(); // 立即尝试播放
                }
            }, INITIALIZATION_DELAY);

            // 启动验证码检测
            setInterval(checkCaptcha, CAPTCHA_CHECK_INTERVAL);

            updateStatus('脚本已加载');
        } catch (error) {
            logError('初始化脚本失败', error);
        }
    }

    // 使用更安全的初始化方式
    $(document).ready(initializeScript);
})();