// ==UserScript==
// @name         华电在线视频自动化助手 - 增强版
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  自动控制华电在线视频播放，支持2倍速播放、自动点击继续按钮、拖动记录（增强自动播放版）
// @author       你的名字
// @match        https://school.huadianline.com/course/watch/*.html
// @match        https://school.huadianline.com/course/watch/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538584/%E5%8D%8E%E7%94%B5%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538584/%E5%8D%8E%E7%94%B5%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

/*
 * 更新日志 v1.6.0:
 * 🚀 新增特性：
 * - 🎯 智能自动播放：无需手动点击，自动绕过浏览器限制
 * - 📱 多重交互模拟：自动模拟用户交互事件
 * - 🔄 静音自动播放：优先尝试静音播放绕过限制
 * - ⚡ 页面加载时预处理：提前获取用户交互状态
 * - 🛠️ 增强的播放策略：多种方式确保播放成功
 * - 🎨 更智能的交互检测：利用页面现有交互状态
 */

(function() {
    'use strict';

    // 获取页面的真实 window 对象
    const realWindow = unsafeWindow || window;

    // 配置参数
    const CONFIG = {
        CHECK_INTERVAL: 3000,     // 3秒检查一次
        CONTINUE_BUTTON_PRIORITY: true, // 继续按钮优先处理
        TARGET_PLAYBACK_RATE: 2,  // 目标播放速度
        TARGET_VOLUME: 0,         // 目标音量（静音）
        DEBUG: false,             // 调试模式
        MAX_RETRY: 10,            // 最大重试次数
        AGGRESSIVE_AUTOPLAY: true // 激进的自动播放模式
    };

    let retryCount = 0;
    let monitorInterval = null;
    let isRunning = false;

    // 日志函数
    function log(message, type = 'info') {
        if (CONFIG.DEBUG || type === 'error') {
            const timestamp = new Date().toLocaleTimeString();
            console[type](`[华电助手增强版 ${timestamp}] ${message}`);
        }
    }

    // 获取 myPlayer 对象的函数
    function getMyPlayer() {
        try {
            return realWindow.myPlayer ||
                   realWindow.window?.myPlayer ||
                   eval('myPlayer') ||
                   null;
        } catch (error) {
            log(`获取 myPlayer 时出错: ${error.message}`, 'warn');
            return null;
        }
    }

    // 等待元素出现
    function waitForElement(condition, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                try {
                    const result = condition();
                    if (result) {
                        resolve(result);
                        return;
                    }
                } catch (error) {
                    // 忽略检查过程中的错误，继续等待
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error('等待超时'));
                    return;
                }

                setTimeout(check, 100);
            }

            check();
        });
    }

    // 用户交互状态追踪（增强版）
    let userHasInteracted = false;
    let autoplayAttempts = 0;
    const MAX_AUTOPLAY_ATTEMPTS = 5; // 增加尝试次数
    let lastInteractionTime = 0;
    let interactionSimulated = false;

    // 智能用户交互检测和模拟
    function enhancedInteractionDetection() {
        // 1. 检查是否已经有用户交互
        checkExistingInteraction();

        // 2. 设置交互事件监听器
        setupInteractionListeners();

        // 3. 如果启用激进模式，尝试模拟交互
        if (CONFIG.AGGRESSIVE_AUTOPLAY) {
            setTimeout(simulateUserInteraction, 1000);
        }
    }

    // 检查现有的用户交互状态
    function checkExistingInteraction() {
        // 检查用户是否已经与页面有过交互
        if (document.hasFocus() ||
            document.visibilityState === 'visible' ||
            performance.now() - performance.timeOrigin > 5000) { // 页面加载超过5秒
            userHasInteracted = true;
            lastInteractionTime = Date.now();
            log('✅ 检测到现有用户交互状态');
            return true;
        }
        return false;
    }

    // 设置交互事件监听器
    function setupInteractionListeners() {
        const interactionEvents = ['click', 'keydown', 'mousedown', 'touchstart', 'focus', 'scroll'];

        const markInteraction = (event) => {
            userHasInteracted = true;
            lastInteractionTime = Date.now();
            log(`✅ 检测到用户交互: ${event.type}`);

            // 移除事件监听器（保留一个以防万一）
            if (lastInteractionTime - autoplayAttempts > 1000) {
                interactionEvents.forEach(eventType => {
                    document.removeEventListener(eventType, markInteraction, { passive: true });
                });
            }
        };

        // 添加事件监听器
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, markInteraction, { passive: true });
        });
    }

    // 模拟用户交互（增强版）
    function simulateUserInteraction() {
        if (userHasInteracted || interactionSimulated) {
            return;
        }

        try {
            log('🤖 尝试模拟用户交互以启用自动播放');

            // 方法1：模拟鼠标移动和点击
            const mouseEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: 100,
                clientY: 100
            });
            document.dispatchEvent(mouseEvent);

            // 方法2：模拟键盘事件
            const keyEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Tab'
            });
            document.dispatchEvent(keyEvent);

            // 方法3：尝试focus事件
            if (document.body) {
                document.body.focus();
            }

            // 方法4：创建并立即移除一个按钮点击
            const invisibleButton = document.createElement('button');
            invisibleButton.style.cssText = 'position:absolute;left:-9999px;opacity:0;pointer-events:none;';
            document.body.appendChild(invisibleButton);

            setTimeout(() => {
                invisibleButton.click();
                document.body.removeChild(invisibleButton);

                // 标记已模拟交互
                interactionSimulated = true;
                userHasInteracted = true;
                lastInteractionTime = Date.now();
                log('✅ 用户交互模拟完成');

                // 立即尝试播放
                setTimeout(attemptAutoplay, 500);
            }, 100);

        } catch (error) {
            log(`模拟用户交互失败: ${error.message}`, 'warn');
        }
    }

    // 智能自动播放尝试
    function attemptAutoplay() {
        const myPlayer = getMyPlayer();
        if (!myPlayer) return false;

        try {
            log('🎬 开始智能自动播放尝试');

            // 策略1：静音播放（浏览器通常允许）
            if (myPlayer.volume() > 0) {
                myPlayer.volume(0);
                myPlayer.muted(true);
                log('🔇 设置为静音模式以绕过自动播放限制');
            }

            // 策略2：直接调用播放API
            const playPromise = myPlayer.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(() => {
                    log('✅ 自动播放成功！');
                    autoplayAttempts = 0;
                    hideInteractionPrompt();

                    // 播放成功后设置速度
                    setTimeout(() => {
                        setPlaybackRate();
                    }, 1000);

                }).catch(error => {
                    log(`API播放失败: ${error.message}，尝试其他方法`, 'warn');
                    tryAlternativePlayMethods();
                });
            } else {
                // 没有Promise返回，延迟检查播放状态
                setTimeout(() => {
                    if (!myPlayer.paused()) {
                        log('✅ 播放命令执行成功');
                        autoplayAttempts = 0;
                        hideInteractionPrompt();
                    } else {
                        tryAlternativePlayMethods();
                    }
                }, 1000);
            }

            return true;
        } catch (error) {
            log(`自动播放尝试失败: ${error.message}`, 'error');
            tryAlternativePlayMethods();
            return false;
        }
    }

    // 替代播放方法
    function tryAlternativePlayMethods() {
        log('🔄 尝试替代播放方法');

        // 方法1：点击播放按钮
        setTimeout(() => {
            if (simulateClickCenter()) {
                log('✅ 通过模拟点击启动播放');
                return;
            }
        }, 200);

        // 方法2：尝试触发播放事件
        setTimeout(() => {
            const myPlayer = getMyPlayer();
            if (myPlayer) {
                try {
                    myPlayer.trigger('play');
                    log('✅ 通过事件触发启动播放');
                } catch (e) {
                    log('事件触发播放失败', 'warn');
                }
            }
        }, 500);

        // 方法3：显示交互提示（作为最后手段）
        setTimeout(() => {
            const myPlayer = getMyPlayer();
            if (myPlayer && myPlayer.paused()) {
                showEnhancedInteractionPrompt();
            }
        }, 1000);
    }

    // 模拟点击屏幕中心（增强版）
    function simulateClickCenter() {
        try {
            const myPlayer = getMyPlayer();
            let videoElement = null;

            // 尝试多种方式找到视频元素
            videoElement = document.querySelector('video') ||
                          document.querySelector('.video-js') ||
                          (myPlayer && typeof myPlayer.el === 'function' ? myPlayer.el() : null);

            if (!videoElement || typeof videoElement.getBoundingClientRect !== 'function') {
                return tryClickPlayButton();
            }

            const rect = videoElement.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) {
                return tryClickPlayButton();
            }

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // 创建多种类型的点击事件
            const events = ['mousedown', 'mouseup', 'click'];
            events.forEach(eventType => {
                const clickEvent = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: centerX,
                    clientY: centerY,
                    button: 0
                });
                videoElement.dispatchEvent(clickEvent);
            });

            log(`✅ 已模拟点击视频中心区域 (${Math.round(centerX)}, ${Math.round(centerY)})`);
            return true;

        } catch (error) {
            log(`模拟点击失败: ${error.message}`, 'error');
            return tryClickPlayButton();
        }
    }

    // 尝试点击播放按钮的备选方案
    function tryClickPlayButton() {
        try {
            const playButtonSelectors = [
                '.vjs-big-play-button',
                '.vjs-play-control',
                '.play-btn',
                '[aria-label*="播放"]',
                '[title*="播放"]',
                '.video-play-button',
                '.vjs-play-control.vjs-control.vjs-button'
            ];

            for (const selector of playButtonSelectors) {
                const playButton = document.querySelector(selector);
                if (playButton && playButton.offsetParent !== null) {
                    // 模拟多种点击事件
                    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                        playButton.dispatchEvent(new MouseEvent(eventType, {
                            bubbles: true,
                            cancelable: true
                        }));
                    });

                    log(`✅ 已点击播放按钮: ${selector}`);
                    return true;
                }
            }

            log('未找到可点击的播放按钮', 'warn');
            return false;
        } catch (error) {
            log(`点击播放按钮失败: ${error.message}`, 'error');
            return false;
        }
    }

    // 增强版交互提示
    function showEnhancedInteractionPrompt() {
        // 避免重复创建提示
        if (document.getElementById('huadian-interaction-prompt')) {
            return;
        }

        const prompt = document.createElement('div');
        prompt.id = 'huadian-interaction-prompt';
        prompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            cursor: pointer;
            animation: pulseScale 2s ease-in-out infinite;
            text-align: center;
            user-select: none;
        `;

        prompt.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">🎬</div>
            <div>点击此处启动自动播放</div>
            <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">
                浏览器需要用户交互才能播放视频
            </div>
        `;

        // 添加动画样式
        if (!document.getElementById('enhanced-prompt-style')) {
            const style = document.createElement('style');
            style.id = 'enhanced-prompt-style';
            style.textContent = `
                @keyframes pulseScale {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }

        // 点击提示即可触发交互
        prompt.addEventListener('click', () => {
            userHasInteracted = true;
            interactionSimulated = true;
            lastInteractionTime = Date.now();
            autoplayAttempts = 0;
            hideInteractionPrompt();
            log('✅ 用户点击交互提示，立即尝试播放');

            // 立即尝试播放
            setTimeout(attemptAutoplay, 100);
        });

        document.body.appendChild(prompt);

        // 5秒后自动隐藏
        setTimeout(hideInteractionPrompt, 5000);
    }

    // 隐藏交互提示
    function hideInteractionPrompt() {
        const prompt = document.getElementById('huadian-interaction-prompt');
        if (prompt) {
            prompt.remove();
        }
    }

    // 检查并处理视频播放状态（增强版）
    function checkVideoPlayback() {
        try {
            const myPlayer = getMyPlayer();

            if (!myPlayer) {
                log('myPlayer 对象不存在');
                return false;
            }

            if (typeof myPlayer.paused !== 'function') {
                log('播放器方法不可用，可能还未初始化完成');
                return false;
            }

            let isPaused, hasEnded, readyState;
            try {
                isPaused = myPlayer.paused();
                hasEnded = myPlayer.ended && myPlayer.ended();
                readyState = myPlayer.readyState && myPlayer.readyState();
            } catch (error) {
                log(`获取播放器状态失败: ${error.message}`, 'warn');
                return false;
            }

            if (CONFIG.DEBUG) {
                log(`视频状态 - 暂停: ${isPaused}, 结束: ${hasEnded}, 就绪状态: ${readyState}, 用户交互: ${userHasInteracted}, 尝试次数: ${autoplayAttempts}`);
            }

            if (isPaused && !hasEnded) {
                // 智能播放逻辑
                if (autoplayAttempts < MAX_AUTOPLAY_ATTEMPTS) {
                    autoplayAttempts++;

                    if (userHasInteracted || interactionSimulated) {
                        // 有用户交互，直接尝试播放
                        log('有用户交互，尝试播放...');
                        return attemptAutoplay();
                    } else if (CONFIG.AGGRESSIVE_AUTOPLAY) {
                        // 激进模式：先尝试静音播放
                        log('激进模式：尝试静音自动播放...');
                        return attemptAutoplay();
                    } else {
                        // 保守模式：显示交互提示
                        if (autoplayAttempts === 1) {
                            log('⚠️ 需要用户交互才能播放视频');
                            showEnhancedInteractionPrompt();
                        }
                        return false;
                    }
                } else {
                    log('已达到最大自动播放尝试次数');
                    return false;
                }
            } else if (!isPaused) {
                if (autoplayAttempts > 0) {
                    log('✅ 视频正在播放中');
                    autoplayAttempts = 0;
                    hideInteractionPrompt();
                }
            } else if (hasEnded) {
                log('视频已播放完毕');
                autoplayAttempts = 0;
            }

            return true;
        } catch (error) {
            log(`检查播放状态时出错: ${error.message}`, 'error');
            return false;
        }
    }

    // 设置播放速度
    function setPlaybackRate() {
        try {
            const myPlayer = getMyPlayer();

            if (!myPlayer || typeof myPlayer.playbackRate !== 'function') {
                return false;
            }

            const currentRate = myPlayer.playbackRate();
            if (currentRate !== CONFIG.TARGET_PLAYBACK_RATE) {
                myPlayer.playbackRate(CONFIG.TARGET_PLAYBACK_RATE);
                log(`播放速度已设置为 ${CONFIG.TARGET_PLAYBACK_RATE}x`);
            }

            return true;
        } catch (error) {
            log(`设置播放速度失败: ${error.message}`, 'error');
            return false;
        }
    }

    // 设置音量
    function setVolume() {
        try {
            const myPlayer = getMyPlayer();

            if (!myPlayer || typeof myPlayer.volume !== 'function') {
                return false;
            }

            const currentVolume = myPlayer.volume();
            if (currentVolume !== CONFIG.TARGET_VOLUME) {
                myPlayer.volume(CONFIG.TARGET_VOLUME);
                log(`音量已设置为 ${CONFIG.TARGET_VOLUME}`);
            }

            if (CONFIG.TARGET_VOLUME === 0 && typeof myPlayer.muted === 'function') {
                if (!myPlayer.muted()) {
                    myPlayer.muted(true);
                    log('视频已静音');
                }
            }

            return true;
        } catch (error) {
            log(`设置音量失败: ${error.message}`, 'error');
            return false;
        }
    }

    // 检查并点击继续按钮（保持原有逻辑）
    function checkContinueButton() {
        try {
            const continueSelectors = [
                '.layui-layer-btn0',
                '.layui-layer-btn a:first-child',
                '.layui-layer-btn .layui-layer-btn-yes',
                '.layui-layer-btn a[onclick*="yes"]',
                '.layui-layer-dialog .layui-layer-btn a:first',
                '.layui-layer-dialog .layui-layer-btn0',
                'button[data-action="confirm"]',
                '.confirm-btn',
                '.btn-continue',
                '.modal-confirm-btn'
            ];

            for (const selector of continueSelectors) {
                try {
                    const $btns = $(selector);
                    if ($btns.length > 0) {
                        $btns.each(function() {
                            const $this = $(this);
                            if ($this.is(':visible') &&
                                $this.css('display') !== 'none' &&
                                !$this.is(':disabled') &&
                                !$this.hasClass('disabled')) {

                                log(`🔴 发现继续按钮: ${selector}`);

                                try {
                                    $this.click();
                                    if ($this.is('a')) {
                                        $this[0].click();
                                    }
                                    log(`✅ 已成功点击继续按钮: ${selector}`);
                                    return true;
                                } catch (clickError) {
                                    log(`❌ 点击按钮失败: ${clickError.message}`, 'error');
                                }
                            }
                        });
                    }
                } catch (selectorError) {
                    if (CONFIG.DEBUG) {
                        log(`选择器 ${selector} 检查失败: ${selectorError.message}`, 'warn');
                    }
                }
            }

            return false;

        } catch (error) {
            log(`检查继续按钮时出错: ${error.message}`, 'error');
            return false;
        }
    }

    // 发送播放记录到后台（保持原有逻辑）
    function sendPlaybackRecord(currentTime, totalTime, isManualSeek = false) {
        try {
            const watchMatch = window.location.pathname.match(/\/course\/watch\/(\d+)_(\d+)\.html/);
            if (!watchMatch) {
                log('无法从URL提取vid和sid参数', 'warn');
                return false;
            }

            const vid = watchMatch[1];
            const sid = watchMatch[2];
            const timeInt = parseInt(currentTime);
            const totalTimeInt = parseInt(totalTime);

            if (timeInt <= 0) return false;

            const recordData = {
                time: timeInt,
                player_seek_time: timeInt,
                vid: vid,
                sid: sid,
                totaltime: totalTimeInt,
                is_true: isManualSeek ? 1 : 0,
                type: "1"
            };

            $.ajax({
                type: "POST",
                url: "https://school.huadianline.com/index.php?app=course&mod=Video&act=updateLearn",
                data: recordData,
                dataType: "json",
                success: function(response) {
                    if (CONFIG.DEBUG) {
                        log(`播放记录已发送: ${timeInt}秒 (${isManualSeek ? '手动拖动' : '正常播放'})`);
                    }
                },
                error: function(xhr, status, error) {
                    log(`发送播放记录失败: ${error}`, 'warn');
                }
            });

            return true;
        } catch (error) {
            log(`发送播放记录时出错: ${error.message}`, 'error');
            return false;
        }
    }

    // 设置播放器事件监听
    function setupPlayerEventListeners() {
        try {
            const myPlayer = getMyPlayer();
            if (!myPlayer || myPlayer._huadianListenersSet) {
                return false;
            }

            // 监听拖动事件
            myPlayer.on('seeked', function() {
                const currentTime = myPlayer.currentTime();
                const totalTime = myPlayer.duration();
                log(`🎯 检测到拖动播放条: ${currentTime.toFixed(1)}秒`);
                sendPlaybackRecord(currentTime, totalTime, true);
            });

            // 监听播放事件
            myPlayer.on('play', function() {
                log('🎬 视频开始播放');
                hideInteractionPrompt();
            });

            // 监听暂停事件
            myPlayer.on('pause', function() {
                log('⏸️ 视频已暂停');
            });

            myPlayer._huadianListenersSet = true;
            log('✅ 播放器事件监听器设置完成');
            return true;
        } catch (error) {
            log(`设置播放器事件监听时出错: ${error.message}`, 'error');
            return false;
        }
    }

    // 主监控函数（增强版）
    function performMonitoring() {
        if (CONFIG.DEBUG && autoplayAttempts < 2) {
            log('执行监控检查...');
        }

        try {
            if (!window.location.href.includes('/course/watch/')) {
                log('已离开视频页面，停止监控');
                stopMonitoring();
                return;
            }

            const myPlayer = getMyPlayer();
            if (!myPlayer) {
                retryCount++;
                if (retryCount > CONFIG.MAX_RETRY) {
                    log('达到最大重试次数，停止监控', 'error');
                    stopMonitoring();
                    return;
                }
                if (retryCount <= 3 || retryCount % 5 === 0) {
                    log(`myPlayer 不存在，重试 ${retryCount}/${CONFIG.MAX_RETRY}`);
                }
                return;
            }

            if (retryCount > 0) {
                retryCount = 0;
                log('myPlayer 已找到，重置重试计数');
                setupPlayerEventListeners();
            }

            let hasActivity = false;

            // 优先级1: 检查继续按钮
            if (checkContinueButton()) {
                hasActivity = true;
                log('检测到继续按钮并已处理，等待视频自动恢复播放...');
                return;
            }

            // 优先级2: 检查播放状态
            if (checkVideoPlayback()) {
                hasActivity = true;
            }

            // 优先级3: 设置播放参数（只在视频播放时）
            try {
                const isPaused = myPlayer.paused();
                const hasEnded = myPlayer.ended && myPlayer.ended();

                if (!isPaused && !hasEnded) {
                    // 设置播放速度
                    const currentRate = myPlayer.playbackRate();
                    if (Math.abs(currentRate - CONFIG.TARGET_PLAYBACK_RATE) > 0.01) {
                        if (setPlaybackRate()) {
                            hasActivity = true;
                        }
                    }

                    // 设置音量
                    const currentVolume = myPlayer.volume();
                    if (Math.abs(currentVolume - CONFIG.TARGET_VOLUME) > 0.01) {
                        if (setVolume()) {
                            hasActivity = true;
                        }
                    }
                }
            } catch (error) {
                log(`检查播放参数时出错: ${error.message}`, 'warn');
            }

            if (hasActivity && CONFIG.DEBUG) {
                log('监控检查完成 - 有操作执行');
            }

        } catch (error) {
            log(`监控过程中出现错误: ${error.message}`, 'error');
        }
    }

    // 启动监控
    function startMonitoring() {
        if (isRunning) {
            log('监控已在运行中');
            return;
        }

        isRunning = true;
        retryCount = 0;
        log('开始启动增强版视频监控...');

        waitForElement(() => getMyPlayer(), 15000)
            .then(() => {
                log('myPlayer 对象已找到，开始监控');

                // 立即尝试一次智能播放
                setTimeout(() => {
                    if (CONFIG.AGGRESSIVE_AUTOPLAY) {
                        attemptAutoplay();
                    }
                    performMonitoring();
                }, 1000);

                monitorInterval = setInterval(performMonitoring, CONFIG.CHECK_INTERVAL);
                log(`增强版监控已启动，每 ${CONFIG.CHECK_INTERVAL/1000} 秒检查一次`);
            })
            .catch(error => {
                log(`无法找到 myPlayer 对象: ${error.message}`, 'error');
                isRunning = false;
            });
    }

    // 停止监控
    function stopMonitoring() {
        if (monitorInterval) {
            clearInterval(monitorInterval);
            monitorInterval = null;
        }
        isRunning = false;
        hideInteractionPrompt();
        log('监控已停止');
    }

    // 添加菜单命令
    function setupMenuCommands() {
        GM_registerMenuCommand('🚀 开始/重启增强监控', () => {
            stopMonitoring();
            setTimeout(startMonitoring, 100);
        });

        GM_registerMenuCommand('⏹️ 停止监控', stopMonitoring);

        GM_registerMenuCommand('🎬 立即尝试播放', () => {
            userHasInteracted = true;
            interactionSimulated = true;
            autoplayAttempts = 0;
            hideInteractionPrompt();

            const success = attemptAutoplay();
            alert(success ? '已触发播放尝试！' : '播放尝试失败，请检查控制台');
        });

        GM_registerMenuCommand('🔄 切换激进模式', () => {
            CONFIG.AGGRESSIVE_AUTOPLAY = !CONFIG.AGGRESSIVE_AUTOPLAY;
            GM_setValue('aggressiveAutoplay', CONFIG.AGGRESSIVE_AUTOPLAY);
            alert(`激进自动播放模式${CONFIG.AGGRESSIVE_AUTOPLAY ? '已开启' : '已关闭'}`);
        });

        GM_registerMenuCommand('🔧 切换调试模式', () => {
            CONFIG.DEBUG = !CONFIG.DEBUG;
            GM_setValue('debug', CONFIG.DEBUG);
            log(`调试模式${CONFIG.DEBUG ? '已开启' : '已关闭'}`);
        });

        GM_registerMenuCommand('📊 显示状态', () => {
            const myPlayer = getMyPlayer();
            let playerStatus = '未找到';
            if (myPlayer) {
                try {
                    const isPaused = myPlayer.paused();
                    const rate = myPlayer.playbackRate();
                    const volume = myPlayer.volume();
                    const currentTime = myPlayer.currentTime();
                    const listeners = myPlayer._huadianListenersSet ? '已设置' : '未设置';
                    playerStatus = `已找到 - 暂停:${isPaused} 速度:${rate}x 音量:${volume} 时间:${currentTime.toFixed(1)}s 监听器:${listeners}`;
                } catch (e) {
                    playerStatus = '已找到但状态获取失败';
                }
            }

            const status = `
增强版监控状态: ${isRunning ? '✅ 运行中' : '❌ 已停止'}
播放器对象: ${playerStatus}
用户交互状态: ${userHasInteracted ? '✅ 已交互' : '❌ 未交互'}
交互模拟状态: ${interactionSimulated ? '✅ 已模拟' : '❌ 未模拟'}
激进模式: ${CONFIG.AGGRESSIVE_AUTOPLAY ? '✅ 开启' : '❌ 关闭'}
自动播放尝试次数: ${autoplayAttempts}/${MAX_AUTOPLAY_ATTEMPTS}
重试次数: ${retryCount}/${CONFIG.MAX_RETRY}
调试模式: ${CONFIG.DEBUG ? '开启' : '关闭'}
            `;
            alert(status.trim());
        });
    }

    // 页面清理函数
    function cleanup() {
        log('页面即将卸载，清理资源');
        stopMonitoring();
    }

    // 初始化函数
    function initialize() {
        log('华电在线视频自动化助手增强版已加载 v1.6.0');

        // 加载保存的设置
        CONFIG.DEBUG = GM_getValue('debug', false);
        CONFIG.AGGRESSIVE_AUTOPLAY = GM_getValue('aggressiveAutoplay', true);

        setupMenuCommands();
        window.addEventListener('beforeunload', cleanup);

        // 立即启动用户交互检测
        enhancedInteractionDetection();

        if (window.location.href.includes('/course/watch/')) {
            log('检测到视频页面，准备启动增强版监控');
            setTimeout(() => {
                startMonitoring();
            }, 1500); // 稍微延迟启动以确保页面完全加载
        } else {
            log('当前不是视频页面，等待跳转');
        }

        // 监听页面变化
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                log('页面URL已变化: ' + url);

                if (url.includes('/course/watch/')) {
                    log('进入视频页面');
                    // 重置状态
                    userHasInteracted = false;
                    interactionSimulated = false;
                    autoplayAttempts = 0;
                    lastInteractionTime = 0;
                    hideInteractionPrompt();
                    enhancedInteractionDetection();
                    setTimeout(startMonitoring, 1500);
                } else {
                    log('离开视频页面');
                    stopMonitoring();
                }
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 等待 jQuery 加载完成后初始化
    function waitForJQuery() {
        if (typeof $ !== 'undefined' && $.fn) {
            initialize();
        } else {
            setTimeout(waitForJQuery, 100);
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForJQuery);
    } else {
        waitForJQuery();
    }

})();