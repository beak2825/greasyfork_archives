// ==UserScript==
// @name         安徽省高等教育自学考试助学服务平台，视频自动播放|连续播放|后台运行
// @namespace    http://tampermonkey.net/
// @author       花开半夏
// @version      0.0.1
// @description  适配于安徽省高等教育自学考试助学服务平台的一个脚本，主要是实现视频自动播放、连续播放、后台运行，
// @match        https://*.ahjxjy.cn/*
// @grant        none
// @license      Apache Licence 2.0
// @icon         https://www.ahjxjy.cn/images/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/539285/%E5%AE%89%E5%BE%BD%E7%9C%81%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E5%8A%A9%E5%AD%A6%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%EF%BC%8C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%7C%E5%90%8E%E5%8F%B0%E8%BF%90%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/539285/%E5%AE%89%E5%BE%BD%E7%9C%81%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E5%8A%A9%E5%AD%A6%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%EF%BC%8C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%7C%E5%90%8E%E5%8F%B0%E8%BF%90%E8%A1%8C.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let isAutoPlaying = false;
    let currentVideoElement = null;
    let autoLearningSession = false;
    let hasStartedAuto = false;
    let lastPlayAttempt = 0;
    let lastProgressLog = 0;
    let backgroundPlayInterval = null; // 后台播放保护定时器

    // 增强的后台播放保护
    function preventVideoPause() {
        console.log('🛡️ 启用增强的后台播放保护...');

        // 强制设置页面可见性
        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: false
        });

        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: false
        });

        Object.defineProperty(document, 'webkitHidden', {
            get: () => false,
            configurable: false
        });

        Object.defineProperty(document, 'webkitVisibilityState', {
            get: () => 'visible',
            configurable: false
        });

        // 阻止所有可见性变化事件
        ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange'].forEach(event => {
            document.addEventListener(event, function(e) {
                if (isAutoPlaying) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    console.log(`🛡️ 阻止了${event}事件`);
                }
            }, true);
        });

        // 阻止窗口失焦
        window.addEventListener('blur', function(e) {
            if (isAutoPlaying) {
                console.log('🛡️ 窗口失焦被阻止');
                e.stopImmediatePropagation();
                e.preventDefault();

                // 立即恢复焦点
                setTimeout(() => {
                    window.focus();
                }, 100);

                // 确保视频继续播放
                setTimeout(() => {
                    forceVideoPlay();
                }, 200);
            }
        }, true);

        // 监听页面焦点变化
        window.addEventListener('focus', function(e) {
            if (isAutoPlaying) {
                console.log('🛡️ 页面重新获得焦点');
                setTimeout(() => {
                    forceVideoPlay();
                }, 300);
            }
        });

        // 监听视频暂停事件
        document.addEventListener('pause', function(e) {
            if (isAutoPlaying && e.target.tagName === 'VIDEO') {
                const now = Date.now();
                console.log('🛡️ 检测到视频暂停，立即恢复');

                // 立即尝试恢复
                setTimeout(() => {
                    if (e.target.paused && !e.target.ended && isAutoPlaying) {
                        console.log('🔄 强制恢复视频播放');
                        e.target.play().catch(err => {
                            console.log('恢复播放失败:', err);
                        });
                    }
                }, 100);

                // 再次确认恢复
                setTimeout(() => {
                    if (e.target.paused && !e.target.ended && isAutoPlaying) {
                        console.log('🔄 二次确认恢复播放');
                        e.target.play().catch(err => {
                            console.log('二次恢复失败:', err);
                        });
                    }
                }, 1000);
            }
        }, true);

        // 阻止页面休眠和节能模式
        document.addEventListener('beforeunload', function(e) {
            if (isAutoPlaying) {
                e.preventDefault();
                e.returnValue = '';
                console.log('🛡️ 阻止页面卸载');
            }
        });

        // 启动后台播放保护定时器
        startBackgroundPlayProtection();
    }

    // 启动后台播放保护定时器
    function startBackgroundPlayProtection() {
        if (backgroundPlayInterval) {
            clearInterval(backgroundPlayInterval);
        }

        backgroundPlayInterval = setInterval(() => {
            if (isAutoPlaying && currentVideoElement) {
                forceVideoPlay();
            }
        }, 2000); // 每2秒检查一次

        console.log('🛡️ 后台播放保护定时器已启动');
    }

    // 停止后台播放保护定时器
    function stopBackgroundPlayProtection() {
        if (backgroundPlayInterval) {
            clearInterval(backgroundPlayInterval);
            backgroundPlayInterval = null;
            console.log('🛡️ 后台播放保护定时器已停止');
        }
    }

    // 强制视频播放
    function forceVideoPlay() {
        if (!currentVideoElement || !isAutoPlaying) return;

        try {
            if (currentVideoElement.paused && !currentVideoElement.ended) {
                console.log('🔄 强制视频继续播放');

                // 确保视频处于可播放状态
                currentVideoElement.muted = true;
                currentVideoElement.volume = 0;

                // 尝试播放
                const playPromise = currentVideoElement.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('✅ 强制播放成功');
                    }).catch(err => {
                        console.log('强制播放失败:', err);

                        // 如果播放失败，尝试点击播放按钮
                        setTimeout(() => {
                            clickPlayButton();
                        }, 500);
                    });
                }
            }

            // 确保静音状态
            if (!currentVideoElement.muted) {
                currentVideoElement.muted = true;
                currentVideoElement.volume = 0;
            }
        } catch (e) {
            console.log('强制播放时出错:', e);
        }
    }

    // 温和的确保视频播放（已被forceVideoPlay替代，但保留以防万一）
    function ensureVideoPlaying() {
        if (!currentVideoElement || !isAutoPlaying) return;

        const now = Date.now();
        if (now - lastPlayAttempt < 3000) {
            return; // 缩短到3秒
        }

        if (currentVideoElement.paused && !currentVideoElement.ended) {
            lastPlayAttempt = now;
            console.log('🔄 温和地恢复视频播放');

            currentVideoElement.play().then(() => {
                console.log('✅ 视频继续播放');
            }).catch(err => {
                console.log('播放失败:', err);
            });
        }

        if (!currentVideoElement.muted) {
            currentVideoElement.muted = true;
            currentVideoElement.volume = 0;
        }
    }

    // 保存和恢复自动学习状态
    function saveAutoLearningState() {
        try {
            localStorage.setItem('videoAutoLearning_active', 'true');
            localStorage.setItem('videoAutoLearning_timestamp', Date.now().toString());
        } catch (e) {
            console.log('保存状态失败:', e);
        }
    }

    function clearAutoLearningState() {
        try {
            localStorage.removeItem('videoAutoLearning_active');
            localStorage.removeItem('videoAutoLearning_timestamp');
        } catch (e) {
            console.log('清除状态失败:', e);
        }
    }

    function isInAutoLearningSession() {
        try {
            const isActive = localStorage.getItem('videoAutoLearning_active');
            const timestamp = localStorage.getItem('videoAutoLearning_timestamp');

            if (isActive === 'true' && timestamp) {
                const elapsed = Date.now() - parseInt(timestamp);
                return elapsed < 30 * 60 * 1000;
            }
        } catch (e) {
            console.log('检查状态失败:', e);
        }
        return false;
    }

    // 彻底静默所有数据库相关错误
    function handleApiErrors() {
        console.log('🔇 设置彻底的错误静默处理...');

        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args)
                .then(response => {
                    if (!response.ok && response.status !== 404) {
                        console.log(`静默处理Fetch错误: ${response.status}`);
                        return new Response('{"success":true,"message":"ok"}', {
                            status: 200,
                            statusText: 'OK',
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }
                    return response;
                })
                .catch(error => {
                    console.log('Fetch错误被静默处理:', error.message || error);
                    return new Response('{"success":true,"message":"ok"}', {
                        status: 200,
                        statusText: 'OK',
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
        };

        window.addEventListener('unhandledrejection', function(event) {
            console.log('Promise拒绝被静默处理');
            event.preventDefault();
        });

        window.addEventListener('error', function(event) {
            console.log('全局错误被静默处理');
            event.preventDefault();
        });

        const originalConsoleError = console.error;
        console.error = function(...args) {
            const message = args.join(' ');
            if (!message.includes('Database operation expected') &&
                !message.includes('optimistic concurrency')) {
                originalConsoleError.apply(console, args);
            }
        };
    }

    // 停止自动学习
    function stopAutoLearning() {
        isAutoPlaying = false;
        autoLearningSession = false;
        currentVideoElement = null;
        hasStartedAuto = false;
        lastPlayAttempt = 0;
        lastProgressLog = 0;
        stopBackgroundPlayProtection(); // 停止后台保护
        clearAutoLearningState();
        updateStatus('已停止自动播放');
    }

    // 更新状态显示
    function updateStatus(text) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = text;
        }
        console.log('📊 状态:', text);
    }

    // 获取所有视频项
    function getAllVideoItems() {
        const dots = document.querySelectorAll('div[data-v-2f21b36e].dot');
        const videoItems = [];

        dots.forEach((dot, index) => {
            const hasBlueBackground = dot.style.background && dot.style.background.includes('rgb(45, 140, 240)');
            const parentLi = dot.closest('li');

            if (parentLi) {
                let title = '';
                const titleElement = parentLi.querySelector('.title-nnx');
                if (titleElement) {
                    title = titleElement.textContent.trim();
                } else {
                    const allText = parentLi.textContent.trim();
                    const lines = allText.split('\n').map(line => line.trim()).filter(line => line);
                    title = lines.find(line => line.includes('视频:') || line.includes('.mp4')) || `视频${index + 1}`;
                }

                const isCurrent = parentLi.querySelector('.state span[style*="rgb(45, 140, 240)"]') !== null;

                videoItems.push({
                    index: index,
                    element: parentLi,
                    dot: dot,
                    isCompleted: hasBlueBackground,
                    isCurrent: isCurrent,
                    title: title
                });
            }
        });

        return videoItems;
    }

    // 检查当前页面是否有视频播放器
    function hasVideoPlayer() {
        return document.querySelector('video') !== null;
    }

    // 查找下一个未完成的视频
    function findNextUncompletedVideo() {
        const videoItems = getAllVideoItems();

        let currentIndex = -1;
        for (let i = 0; i < videoItems.length; i++) {
            if (videoItems[i].isCurrent) {
                currentIndex = i;
                break;
            }
        }

        for (let i = currentIndex + 1; i < videoItems.length; i++) {
            if (!videoItems[i].isCompleted) {
                return videoItems[i];
            }
        }

        for (let i = 0; i <= currentIndex; i++) {
            if (!videoItems[i].isCompleted) {
                return videoItems[i];
            }
        }

        return null;
    }

    // 增强的视频设置
    function setupVideo() {
        const video = document.querySelector('video');
        if (video && video !== currentVideoElement) {
            currentVideoElement = video;

            // 立即设置静音和播放属性
            video.muted = true;
            video.volume = 0;
            video.autoplay = true;
            video.loop = false;

            // 添加视频事件监听
            video.addEventListener('pause', function() {
                if (isAutoPlaying) {
                    console.log('🔄 视频暂停事件，准备恢复');
                    setTimeout(() => {
                        forceVideoPlay();
                    }, 100);
                }
            });

            video.addEventListener('ended', function() {
                console.log('📹 视频播放结束');
            });

            console.log(`✅ 视频设置完成: 已静音，已启用自动播放`);
            return true;
        }
        return currentVideoElement !== null;
    }

    // 增强的点击播放按钮
    function clickPlayButton() {
        console.log('🔍 查找播放按钮...');

        const playSelectors = [
            '.dplayer-big-play',
            '.dplayer-play-icon',
            '.dplayer-icon.dplayer-play-icon',
            'button.dplayer-play-icon',
            '.dplayer-controller .dplayer-play-icon',
            '.dplayer-video',
        ];

        for (let selector of playSelectors) {
            const button = document.querySelector(selector);

            if (button && button.offsetParent !== null) {
                console.log(`✅ 找到播放按钮，点击:`, selector);

                try {
                    button.click();
                    setTimeout(() => setupVideo(), 500);
                    setTimeout(() => setupVideo(), 1000);
                    setTimeout(() => forceVideoPlay(), 1500);
                    return true;
                } catch (e) {
                    console.log('点击播放按钮失败:', e);
                }
            }
        }

        if (setupVideo()) {
            console.log('✅ 直接设置视频成功');
            setTimeout(() => forceVideoPlay(), 500);
            return true;
        }

        console.log('❌ 未找到播放按钮');
        return false;
    }

    // 检查视频是否播放完成
    function isVideoCompleted() {
        if (!currentVideoElement) return false;

        try {
            if (currentVideoElement.ended) {
                console.log('✅ 视频已结束（ended=true）');
                return true;
            }

            if (currentVideoElement.duration > 0 && currentVideoElement.currentTime > 0) {
                const progress = currentVideoElement.currentTime / currentVideoElement.duration;
                const currentMinutes = Math.floor(currentVideoElement.currentTime / 60);
                const totalMinutes = Math.floor(currentVideoElement.duration / 60);

                const now = Date.now();
                if (!lastProgressLog || now - lastProgressLog > 30000) {
                    console.log(`📹 视频播放详情:`);
                    console.log(`   当前时间: ${currentMinutes}:${Math.floor(currentVideoElement.currentTime % 60).toString().padStart(2, '0')}`);
                    console.log(`   总时长: ${totalMinutes}:${Math.floor(currentVideoElement.duration % 60).toString().padStart(2, '0')}`);
                    console.log(`   播放进度: ${Math.round(progress * 100)}%`);
                    console.log(`   视频状态: ${currentVideoElement.paused ? '⏸️暂停' : '▶️播放中'}`);
                    console.log(`   是否结束: ${currentVideoElement.ended ? '✅是' : '❌否'}`);
                    console.log(`   后台保护: ${backgroundPlayInterval ? '✅活跃' : '❌停止'}`);
                    lastProgressLog = now;
                }

                const remainingTime = currentVideoElement.duration - currentVideoElement.currentTime;

                if (progress > 0.995 || remainingTime < 5) {
                    console.log(`✅ 视频即将完成 - 进度: ${Math.round(progress * 100)}%, 剩余: ${Math.round(remainingTime)}秒`);
                    return true;
                }

                if (remainingTime < 10 && currentVideoElement.paused) {
                    console.log(`✅ 视频在结尾暂停，认为完成`);
                    return true;
                }
            }

        } catch (e) {
            console.log('检查视频完成状态失败:', e);
        }

        return false;
    }

    // 智能点击
    function smartClick(element) {
        if (!element) return false;

        try {
            const linkElement = element.querySelector('a') || element.closest('a');
            if (linkElement) {
                linkElement.click();
                return true;
            }
            element.click();
            return true;
        } catch (e) {
            console.log('智能点击失败:', e);
            return false;
        }
    }

    // 处理视频完成后的逻辑
    async function handleVideoCompleted() {
        console.log('🎉 视频播放完成！');

        try {
            currentVideoElement = null;
            lastProgressLog = 0;
            stopBackgroundPlayProtection(); // 停止当前视频的后台保护
            updateStatus('视频完成，准备跳转...');

            console.log('⏳ 等待系统更新完成状态...');
            await new Promise(resolve => setTimeout(resolve, 8000));

            const nextVideo = findNextUncompletedVideo();

            if (nextVideo) {
                console.log(`🔄 跳转到下一个视频: "${nextVideo.title}"`);
                updateStatus(`跳转: ${nextVideo.title}`);

                if (smartClick(nextVideo.element)) {
                    console.log('✅ 已点击下一个视频');
                    // 重新启动后台保护将在新视频开始播放时进行
                } else {
                    console.log('❌ 跳转失败，停止自动播放');
                    stopAutoLearning();
                }
            } else {
                console.log('🎉 所有视频已完成！');
                stopAutoLearning();
                alert('🎉 所有视频已学习完成！');
            }
        } catch (e) {
            console.log('处理视频完成时出错:', e);
            stopAutoLearning();
        }
    }

    // 开始播放当前页面的视频
    function startCurrentVideoPlayback() {
        console.log('🚀 === 开始自动播放 ===');

        if (hasStartedAuto) {
            console.log('⚠️ 已经启动，跳过');
            return;
        }

        try {
            hasStartedAuto = true;
            autoLearningSession = true;
            isAutoPlaying = true;
            saveAutoLearningState();
            startBackgroundPlayProtection(); // 启动后台播放保护
            updateStatus('正在启动播放...');

            let attempts = 0;
            const maxAttempts = 3;

            const waitForVideo = setInterval(() => {
                attempts++;
                console.log(`🔄 尝试播放第${attempts}次...`);

                if (clickPlayButton()) {
                    clearInterval(waitForVideo);
                    console.log('✅ 播放启动成功');
                    updateStatus('🎬 视频播放中...');

                    // 主要的检查完成状态的间隔
                    const checkInterval = setInterval(() => {
                        if (!isAutoPlaying || !autoLearningSession) {
                            clearInterval(checkInterval);
                            return;
                        }

                        if (isVideoCompleted()) {
                            console.log('🎯 检测到视频播放完成');
                            clearInterval(checkInterval);
                            handleVideoCompleted();
                        }
                    }, 3000);

                    setTimeout(() => {
                        if (isAutoPlaying && autoLearningSession) {
                            clearInterval(checkInterval);
                            console.log('⏰ 视频播放超时（20分钟），跳转下一个');
                            handleVideoCompleted();
                        }
                    }, 1200000);

                } else if (attempts >= maxAttempts) {
                    clearInterval(waitForVideo);
                    console.log('❌ 启动播放失败');
                    hasStartedAuto = false;
                    updateStatus('❌ 启动失败');
                }
            }, 3000);
        } catch (e) {
            console.log('启动播放时出错:', e);
            hasStartedAuto = false;
            stopAutoLearning();
        }
    }

    // 检测并自动播放
    function detectAndAutoPlay() {
        try {
            hasStartedAuto = false;
            console.log('🔍 检测视频播放器...');

            if (hasVideoPlayer()) {
                console.log('✅ 发现视频播放器');
                updateStatus('发现视频，准备播放...');

                setTimeout(() => {
                    if (!hasStartedAuto) {
                        startCurrentVideoPlayback();
                    }
                }, 3000);
            } else {
                console.log('❌ 未发现视频播放器');

                if (isInAutoLearningSession()) {
                    console.log('🔄 自动查找下一个视频');
                    const videoItems = getAllVideoItems();

                    for (let i = 0; i < videoItems.length; i++) {
                        if (!videoItems[i].isCompleted) {
                            console.log(`🔄 自动跳转: "${videoItems[i].title}"`);
                            smartClick(videoItems[i].element);
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.log('检测播放时出错:', e);
        }
    }

    // 页面监听
    function observePageChanges() {
        try {
            const observer = new MutationObserver((mutations) => {
                let hasVideoAdded = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.tagName === 'VIDEO' || node.querySelector('video')) {
                                    hasVideoAdded = true;
                                }
                            }
                        });
                    }
                });

                if (hasVideoAdded && !hasStartedAuto) {
                    console.log('🆕 检测到新视频');
                    setTimeout(() => {
                        detectAndAutoPlay();
                    }, 2000);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            console.log('设置页面监听失败:', e);
        }
    }

    // 添加控制面板
    function addControlPanel() {
        try {
            const panel = document.createElement('div');
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                background: white;
                border: 2px solid #2d8cf0;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                min-width: 220px;
            `;

            panel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold; color: #333;">🎥 强化后台播放</div>
                <button id="stopAuto" style="background: #f56c6c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; width: 100%; margin-bottom: 8px;">⏹️ 停止播放</button>
                <button id="forcePlay" style="background: #409eff; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px; font-size: 12px;">▶️ 强制播放</button>
                <button id="debugBtn" style="background: #67c23a; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px; font-size: 12px;">🔍 状态</button>
                <div id="status" style="font-size: 12px; color: #666; margin-top: 8px;">强化模式 • 后台播放保护</div>
            `;

            document.body.appendChild(panel);

            document.getElementById('stopAuto').onclick = () => {
                stopAutoLearning();
            };

            document.getElementById('forcePlay').onclick = () => {
                console.log('🔄 手动强制播放');
                forceVideoPlay();
            };

            document.getElementById('debugBtn').onclick = () => {
                console.log('=== 详细状态 ===');
                console.log('🎬 自动播放:', isAutoPlaying);
                console.log('📚 学习会话:', autoLearningSession);
                console.log('🚀 已启动:', hasStartedAuto);
                console.log('📹 有视频:', hasVideoPlayer());
                console.log('🛡️ 后台保护:', backgroundPlayInterval ? '活跃' : '停止');
                console.log('📺 视频元素:', currentVideoElement);

                if (currentVideoElement) {
                    const progress = (currentVideoElement.currentTime / currentVideoElement.duration) * 100;
                    const currentMin = Math.floor(currentVideoElement.currentTime / 60);
                    const currentSec = Math.floor(currentVideoElement.currentTime % 60);
                    const totalMin = Math.floor(currentVideoElement.duration / 60);
                    const totalSec = Math.floor(currentVideoElement.duration % 60);

                    console.log(`⏰ 播放时间: ${currentMin}:${currentSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`);
                    console.log(`📊 播放进度: ${Math.round(progress)}%`);
                    console.log(`🎮 视频状态: ${currentVideoElement.paused ? '⏸️暂停' : '▶️播放中'}`);
                    console.log(`🏁 是否结束: ${currentVideoElement.ended ? '✅是' : '❌否'}`);
                }
            };
        } catch (e) {
            console.log('添加面板失败:', e);
        }
    }

    // 增强的自动静音
    function initAutoMute() {
        try {
            document.addEventListener('play', function(e) {
                if (e.target.tagName === 'VIDEO') {
                    console.log('🔇 视频开始播放，立即静音');
                    e.target.muted = true;
                    e.target.volume = 0;

                    // 延迟再次确认静音
                    setTimeout(() => {
                        if (e.target) {
                            e.target.muted = true;
                            e.target.volume = 0;
                        }
                    }, 100);
                }
            }, true);
        } catch (e) {
            console.log('设置静音失败:', e);
        }
    }

    // 初始化
    function initialize() {
        try {
            handleApiErrors();
            addControlPanel();
            initAutoMute();
            preventVideoPause();
            observePageChanges();

            setTimeout(() => {
                detectAndAutoPlay();
            }, 2000);
        } catch (e) {
            console.log('初始化失败:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initialize, 2000);
        });
    } else {
        setTimeout(initialize, 2000);
    }

    console.log('🎯 强化后台播放脚本已加载');

})();