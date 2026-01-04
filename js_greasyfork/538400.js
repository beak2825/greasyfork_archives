// ==UserScript==
// @name         Bilibili视频自动播放脚本
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  禁用B站未登录状态下的自动暂停，区分用户主动暂停和系统暂停
// @author       Barcode0924
// @match        *://www.bilibili.com/video/*
// @match        *://m.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538400/Bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538400/Bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Bilibili Auto Play] 脚本已启动');

    // 用户交互跟踪
    let userInteractionTracker = {
        lastUserAction: 0,
        userPausedVideo: false,
        recentInteractions: [],
        interactionTimeout: 1000, // 1秒内的交互认为可能导致暂停
        pausedByUser: new Set(), // 记录被用户暂停的视频元素
        
        // 记录用户交互
        recordInteraction: function(type, target) {
            const now = Date.now();
            this.lastUserAction = now;
            this.recentInteractions.push({
                type: type,
                target: target,
                time: now
            });
            
            // 只保留最近的交互记录
            this.recentInteractions = this.recentInteractions.filter(
                interaction => now - interaction.time < this.interactionTimeout * 2
            );
            
            console.log(`[Bilibili Auto Play] 用户交互: ${type}`, target);
        },
        
        // 检查最近是否有可能导致暂停的用户交互
        hasRecentPauseInteraction: function() {
            const now = Date.now();
            return this.recentInteractions.some(interaction => {
                const timeDiff = now - interaction.time;
                return timeDiff < this.interactionTimeout && 
                       (interaction.type === 'click' || 
                        interaction.type === 'keydown' || 
                        interaction.type === 'touch');
            });
        },
        
        // 设置用户主动暂停标志
        setUserPaused: function(paused, videoElement = null) {
            this.userPausedVideo = paused;
            if (videoElement && paused) {
                this.pausedByUser.add(videoElement);
                console.log(`[Bilibili Auto Play] 记录用户主动暂停视频`);
            }
            console.log(`[Bilibili Auto Play] 用户暂停状态: ${paused}`);
        },
        
        // 检查视频是否被用户暂停
        isVideoPausedByUser: function(videoElement) {
            return this.pausedByUser.has(videoElement);
        },
        
        // 清除用户暂停记录（当视频开始播放时）
        clearUserPause: function(videoElement) {
            this.pausedByUser.delete(videoElement);
            console.log(`[Bilibili Auto Play] 清除用户暂停记录`);
        }
    };

    // 监听用户交互事件
    function setupUserInteractionListeners() {
        // 键盘事件监听（空格键等）
        document.addEventListener('keydown', function(event) {
            userInteractionTracker.recordInteraction('keydown', event.target);
            
            // 空格键通常用于暂停/播放
            if (event.code === 'Space' && !event.target.matches('input, textarea')) {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    userInteractionTracker.setUserPaused(true, video);
                });
            }
        }, true);

        // 鼠标点击事件监听
        document.addEventListener('click', function(event) {
            userInteractionTracker.recordInteraction('click', event.target);
            
            // 检查是否点击了播放器相关元素
            const target = event.target;
            const isPlayerClick = target.closest('.bpx-player-video-wrap') || 
                                 target.closest('.bilibili-player-video-wrap') ||
                                 target.closest('.bpx-player-control-bottom') ||
                                 target.closest('.bilibili-player-video-control-bottom') ||
                                 target.matches('video') ||
                                 target.closest('[class*="player"]');
            
            if (isPlayerClick) {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    userInteractionTracker.setUserPaused(true, video);
                });
            }
        }, true);

        // 触摸事件监听（移动端）
        document.addEventListener('touchstart', function(event) {
            userInteractionTracker.recordInteraction('touch', event.target);
        }, true);
    }

    // 重写HTMLVideoElement的pause方法
    function overridePauseMethod() {
        const originalPause = HTMLVideoElement.prototype.pause;
        
        HTMLVideoElement.prototype.pause = function() {
            const stack = new Error().stack;
            console.log('[Bilibili Auto Play] 视频暂停调用，调用栈:', stack);
            
            // 检查是否是用户最近的交互导致的暂停
            const hasRecentInteraction = userInteractionTracker.hasRecentPauseInteraction();
            const isUserPaused = userInteractionTracker.userPausedVideo;
            
            // 如果有最近的用户交互或明确的用户暂停，允许暂停并记录
            if (hasRecentInteraction || isUserPaused) {
                console.log('[Bilibili Auto Play] 允许暂停 - 用户交互导致');
                userInteractionTracker.setUserPaused(true, this);
                return originalPause.call(this);
            }
            
            // 检查调用栈，判断暂停原因
            const suspiciousPatterns = [
                /visibilitychange/i,
                /blur/i,
                /focus/i,
                /autoplay/i,
                /policy/i,
                /suspend/i,
                /heartbeat/i,
                /check/i
            ];
            
            const isSuspiciousPause = suspiciousPatterns.some(pattern => pattern.test(stack));
            
            if (isSuspiciousPause) {
                console.log('[Bilibili Auto Play] 阻止可疑的自动暂停');
                return Promise.resolve();
            }
            
            // 默认允许暂停
            return originalPause.call(this);
        };
        
        // 重写play方法，清除用户暂停记录
        const originalPlay = HTMLVideoElement.prototype.play;
        HTMLVideoElement.prototype.play = function() {
            console.log('[Bilibili Auto Play] 视频开始播放');
            userInteractionTracker.clearUserPause(this);
            return originalPlay.call(this);
        };
    }

    // 阻止页面可见性相关事件
    function blockVisibilityEvents() {
        // 阻止页面可见性改变
        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: true
        });

        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true
        });

        // 阻止窗口失焦事件
        window.addEventListener('blur', function(e) {
            console.log('[Bilibili Auto Play] 阻止窗口失焦事件');
            e.stopImmediatePropagation();
        }, true);

        // 阻止页面可见性改变事件
        document.addEventListener('visibilitychange', function(e) {
            console.log('[Bilibili Auto Play] 阻止页面可见性改变事件');
            e.stopImmediatePropagation();
        }, true);
    }

    // 视频状态监控和自动恢复
    function setupVideoMonitoring() {
        function checkAndResumeVideo() {
            const videos = document.querySelectorAll('video');
            
            videos.forEach(video => {
                if (video.paused && !video.ended) {
                    // 检查是否是用户主动暂停的视频
                    if (userInteractionTracker.isVideoPausedByUser(video) || 
                        userInteractionTracker.hasRecentPauseInteraction()) {
                        console.log('[Bilibili Auto Play] 跳过恢复 - 用户主动暂停');
                        return;
                    }
                    
                    console.log('[Bilibili Auto Play] 检测到非用户暂停，尝试恢复播放');
                    video.play().catch(e => {
                        console.warn('[Bilibili Auto Play] 恢复播放失败:', e);
                    });
                }
            });
        }

        // 每2秒检查一次视频状态
        setInterval(checkAndResumeVideo, 2000);
    }

    // 模拟用户活动
    function simulateUserActivity() {
        function simulateActivity() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                // 触发一些无害的事件来模拟用户存在
                const event = new Event('timeupdate');
                video.dispatchEvent(event);
            });
        }

        // 每30秒模拟一次用户活动
        setInterval(simulateActivity, 30000);
    }

    // 初始化所有功能
    function init() {
        setupUserInteractionListeners();
        overridePauseMethod();
        blockVisibilityEvents();
        setupVideoMonitoring();
        simulateUserActivity();
        
        console.log('[Bilibili Auto Play] 所有功能已初始化');
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(); 