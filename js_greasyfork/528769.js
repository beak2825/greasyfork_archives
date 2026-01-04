// ==UserScript==
// @name         新能源课程自动播放-优化修复版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  修复播放完成后无法返回课程列表的问题
// @match        *://*.xet.citv.cn/*
// @match        *://*.h5.xiaoeknow.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/528769/%E6%96%B0%E8%83%BD%E6%BA%90%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E4%BC%98%E5%8C%96%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528769/%E6%96%B0%E8%83%BD%E6%BA%90%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E4%BC%98%E5%8C%96%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        interval: 5000,      // 进度检测间隔(ms)
        minProgress: 100,    // 视为完成的最小进度
        returnDelay: 3000,   // 返回延迟
        courseListUrlPattern: /camp\/term/, // 更宽松的课程列表页匹配规则
        maxRetryCount: 3,    // 最大重试次数
        retryDelay: 2000     // 重试延迟
    };

    // 全局状态管理
    const state = {
        isProcessing: false,
        currentRetry: 0,
        taskQueue: []
    };

    // 页面类型检测
    const isCourseListPage = () => config.courseListUrlPattern.test(location.href);
    const isVideoPage = () => document.querySelector('video') !== null;

    // 注入样式
    GM_addStyle(`
        .auto-play-highlight {
            box-shadow: 0 0 8px #4CAF50 !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
        .video-processing-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: rgba(76,175,80,0.9);
            color: white;
            border-radius: 8px;
            z-index: 9999;
            font-size: 14px;
            backdrop-filter: blur(4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .auto-play-status {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 10px 15px;
            background: rgba(33,150,243,0.9);
            color: white;
            border-radius: 6px;
            z-index: 9998;
            font-size: 12px;
        }
    `);

    // 工具函数
    const utils = {
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        log: (message) => {
            console.log(`[AutoPlay] ${message}`);
        },

        showStatus: (message) => {
            let statusEl = document.querySelector('.auto-play-status');
            if (!statusEl) {
                statusEl = document.createElement('div');
                statusEl.className = 'auto-play-status';
                document.body.appendChild(statusEl);
            }
            statusEl.textContent = `自动播放: ${message}`;
        }
    };

    class CourseAutoPlayer {
        constructor() {
            this.taskList = this.getValidTasks();
            this.currentTaskIndex = 0;
            utils.log(`找到 ${this.taskList.length} 个待完成任务`);
            utils.showStatus(`找到 ${this.taskList.length} 个任务`);
        }

        // 改进的任务选择器
        getValidTasks() {
            const tasks = [...document.querySelectorAll('.task:not(.task-locked)')]
                .filter(task => {
                    const doneElement = task.querySelector('.done');
                    return !doneElement || doneElement.textContent !== '已学完';
                });

            utils.log(`过滤后有效任务: ${tasks.length}`);
            return tasks;
        }

        async start() {
            if (this.taskList.length === 0) {
                utils.log('没有需要完成的任务');
                utils.showStatus('所有任务已完成');
                return;
            }

            state.isProcessing = true;

            while(this.currentTaskIndex < this.taskList.length && state.isProcessing) {
                const task = this.taskList[this.currentTaskIndex];
                const success = await this.processTask(task);

                if (success) {
                    this.currentTaskIndex++;
                    utils.showStatus(`进度: ${this.currentTaskIndex}/${this.taskList.length}`);
                    await utils.delay(1000); // 任务间延迟
                } else {
                    utils.log('任务处理失败，停止自动播放');
                    break;
                }
            }

            state.isProcessing = false;
            if (this.currentTaskIndex >= this.taskList.length) {
                utils.showStatus('所有任务完成!');
            }
        }

        async processTask(task) {
            try {
                utils.log(`开始处理任务 ${this.currentTaskIndex + 1}`);
                this.highlightTask(task);

                // 保存当前URL以便返回时验证
                const originalUrl = location.href;

                await this.triggerTaskClick(task);

                // 等待页面跳转到视频页
                await this.waitForPageChange(originalUrl);

                return true;
            } catch (error) {
                utils.log(`任务处理失败: ${error}`);
                return false;
            }
        }

        highlightTask(task) {
            task.classList.add('auto-play-highlight');
        }

        async triggerTaskClick(task) {
            const clickable = task.querySelector('.task-title') || task.querySelector('.task-content') || task;
            if (clickable) {
                clickable.click();
                utils.log('已点击任务链接');
            } else {
                throw new Error('找不到可点击的元素');
            }
        }

        async waitForPageChange(originalUrl, timeout = 10000) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                if (location.href !== originalUrl && isVideoPage()) {
                    utils.log('检测到页面已跳转到视频页');
                    return true;
                }
                await utils.delay(500);
            }
            throw new Error('页面跳转超时');
        }
    }

    class VideoProcessor {
        constructor() {
            this.alertBox = this.createAlertBox();
            this.video = document.querySelector('video');
            this.originalUrl = location.href;
        }

        createAlertBox() {
            const box = document.createElement('div');
            box.className = 'video-processing-alert';
            box.innerHTML = '🎥 视频自动播放中<br>完成后将自动返回课程列表...';
            document.body.appendChild(box);
            return box;
        }

        async start() {
            try {
                utils.log('开始处理视频播放');
                await this.handleVideoPlayback();

                utils.log('视频播放完成，准备返回课程列表');
                await utils.delay(config.returnDelay);

                // 返回课程列表
                await this.returnToCourseList();

            } catch (error) {
                utils.log(`视频处理失败: ${error}`);
                // 失败时也尝试返回
                await this.returnToCourseList();
            } finally {
                this.cleanup();
            }
        }

        async handleVideoPlayback() {
            if (!this.video) {
                throw new Error('未找到视频元素');
            }

            // 强制开始播放
            try {
                await this.video.play();
                utils.log('视频开始播放');
            } catch (e) {
                utils.log('自动播放失败，尝试点击播放按钮...');
                await this.clickFallbackPlayButton();
            }

            await this.waitForCompletion();
            utils.log('视频播放完成');
        }

        async clickFallbackPlayButton() {
            const playButton = document.querySelector('.video-player-play-button, .play-button, [class*="play"]');
            if (playButton) {
                playButton.click();
                utils.log('已点击播放按钮');
                await utils.delay(2000);
            } else {
                throw new Error('找不到播放按钮');
            }
        }

        waitForCompletion() {
            return new Promise((resolve) => {
                const check = () => {
                    if (!this.video) {
                        resolve();
                        return;
                    }

                    const progress = (this.video.currentTime / this.video.duration * 100);
                    utils.log(`视频进度: ${progress.toFixed(1)}%`);

                    if (progress >= config.minProgress || this.video.ended) {
                        resolve();
                    } else {
                        setTimeout(check, config.interval);
                    }
                };
                check();
            });
        }

        async returnToCourseList() {
            utils.log('正在返回课程列表...');

            // 尝试多种返回方式
            if (window.history.length > 1) {
                window.history.back();
                await utils.delay(3000);
            }

            // 如果还在视频页，尝试重新加载或直接跳转
            if (isVideoPage()) {
                utils.log('返回失败，尝试重新加载历史记录');
                window.location.reload();
            }
        }

        cleanup() {
            if (this.alertBox && this.alertBox.parentNode) {
                this.alertBox.remove();
            }
        }
    }

    // 改进的启动逻辑
    const init = async () => {
        // 防止重复运行
        if (window.autoPlayInitialized) return;
        window.autoPlayInitialized = true;

        utils.log('脚本初始化中...');

        // 等待页面完全加载
        await utils.delay(2000);

        if (isCourseListPage()) {
            utils.log('检测到课程列表页');
            // 课程列表页 - 开始自动播放流程
            const player = new CourseAutoPlayer();
            await player.start();

        } else if (isVideoPage()) {
            utils.log('检测到视频播放页');
            // 视频页 - 处理当前视频并返回
            const processor = new VideoProcessor();
            await processor.start();
        }
    };

    // 多种初始化方式确保脚本运行
    const initializeScript = () => {
        // 立即尝试初始化
        init();

        // 监听URL变化（应对SPA）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(init, 1000);
            }
        }).observe(document, { subtree: true, childList: true });

        // 监听页面可见性变化（用户切换标签页返回时）
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(init, 1000);
            }
        });
    };

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        setTimeout(initializeScript, 1000);
    }
})();