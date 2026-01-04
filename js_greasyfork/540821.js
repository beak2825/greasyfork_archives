// ==UserScript==
// @name         湖南开放大学自动刷课（2025最新版（已验证））
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  解决自动播放被阻止问题，确保视频持续播放，60分钟自动刷新，拦截弹窗，自动完成所有课程。有疑问可留言
// @author       山人
// @match        https://www.hnsydwpx.cn/*
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540821/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%882025%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%88%E5%B7%B2%E9%AA%8C%E8%AF%81%EF%BC%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540821/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%882025%E6%9C%80%E6%96%B0%E7%89%88%EF%BC%88%E5%B7%B2%E9%AA%8C%E8%AF%81%EF%BC%89%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        checkInterval: 5000,
        interactionWait: 3000,
        maxRetry: 300,
        debugMode: true,
        countdownDuration: 60*60 // 60分钟（秒数）
    };

    // 添加UI指示器
    GM_addStyle(`
  .script-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(0,0,0,0.8), #B8860B);
            color: white;
            padding: 15px 22px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            z-index: 9999;
            font-size: 25px;
        }
        .script-indicator.error {
            background: #F44336;
        }

        .pro-label {
            position: absolute;
            bottom: -10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: #FFD700;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            opacity: 0.8;
        }

        .countdown-display {
            font-size: 14px;
            margin-top: 5px;
            opacity: 0.8;
        }
    `);

    const indicator = document.createElement('div');
    indicator.className = 'script-indicator';
    indicator.innerHTML = '闪人的刷课脚本已经启动啦<div class="pro-label">Pro</div> <div class="countdown-display"></div>';
    document.body.appendChild(indicator);

    // 倒计时管理器
    class CountdownManager {
        constructor() {
            this.timer = null;
            this.startTime = null;
            this.remaining = GM_getValue('countdownRemaining', config.countdownDuration);
            this.init();
        }

        init() {
            this.updateDisplay();
            if (!GM_getValue('countdownRunning', false)) {
                GM_setValue('countdownRunning', true);
                this.startTime = Date.now();
                this.start();
            } else {
                const elapsed = Math.floor((Date.now() - GM_getValue('countdownStartTime')) / 1000);
                this.remaining = Math.max(config.countdownDuration - elapsed, 0);
                this.start();
            }
        }

        start() {
            GM_setValue('countdownStartTime', Date.now());
            this.timer = setInterval(() => {
                this.remaining--;
                GM_setValue('countdownRemaining', this.remaining);

                if (this.remaining <= 0) {
                    this.handleTimeout();
                    return;
                }

                this.updateDisplay();
            }, 1000);
        }

        updateDisplay() {
            const minutes = Math.floor(this.remaining / 60);
            const seconds = this.remaining % 60;
            indicator.querySelector('.countdown-display').textContent =
                `下次刷新: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        handleTimeout() {
            clearInterval(this.timer);
            GM_setValue('countdownRunning', false);
            GM_setValue('countdownRemaining', config.countdownDuration);

            if (1) {
                this.notify('60分钟倒计时结束，返回课程中心');
                window.location.href = 'https://www.hnsydwpx.cn/mineCourse';
            } else {
                // 如果在课程中心页面则重新开始倒计时
                this.remaining = config.countdownDuration;
                this.init();
            }
        }

        notify(message) {
            if (config.debugMode) {
                GM_notification({
                    title: `[倒计时通知]`,
                    text: message,
                    timeout: 5000
                });
            }
        }
    }


    // 解决自动播放问题的视频控制器
    class VideoController {
        constructor() {
            this.player = null;
            this.retryCount = 0;
            this.isWaitingInteraction = false;
            this.init();
        }

        async init() {
            try {
                this.player = await this.waitForElement('#coursePlayer video');
                this.addFakeInteractionLayer();
                this.startMonitoring();
                this.notify('视频控制器已启动');
            } catch (error) {
                this.notify(`初始化失败: ${error.message}`, 'error');
                indicator.classList.add('error');
                indicator.textContent = '脚本初始化失败';
            }
        }

        // 添加伪交互层解决自动播放限制
        addFakeInteractionLayer() {
            GM_addStyle(`
                .interaction-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    z-index: 9998;
                    cursor: pointer;
                }
                .interaction-notice {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 4px;
                    z-index: 9999;
                    max-width: 300px;
                    font-size: 14px;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }
            `);

            // 创建覆盖层
            const overlay = document.createElement('div');
            overlay.className = 'interaction-overlay';
            overlay.onclick = () => this.handleUserInteraction();
            document.body.appendChild(overlay);

            // 添加提示
            const notice = document.createElement('div');
            notice.className = 'interaction-notice';
            notice.innerHTML = '点击页面任意位置激活自动播放功能<br><small>3秒后自动尝试播放</small>';
            document.body.appendChild(notice);

            this.isWaitingInteraction = true;
            setTimeout(() => {
                if (this.isWaitingInteraction) {
                    this.handleUserInteraction();
                    notice.innerHTML = '已自动激活播放功能';
                    setTimeout(() => notice.remove(), 2000);
                }
            }, config.interactionWait);
        }

        // 处理用户交互
        handleUserInteraction() {
            if (!this.isWaitingInteraction) return;

            this.isWaitingInteraction = false;
            document.querySelector('.interaction-overlay')?.remove();
            document.querySelector('.interaction-notice')?.remove();

            // 首次播放需要用户触发
            this.playVideo().then(() => {
                this.notify('用户交互后自动播放已启动');
            }).catch(error => {
                this.notify(`交互后播放失败: ${error}`, 'error');
            });
        }

        // 开始监控
        startMonitoring() {
            this.monitorInterval = setInterval(() => {
                if (!this.isWaitingInteraction && this.player.paused && !this.player.ended) {
                    this.playVideo();
                }
            }, config.checkInterval);

            // 监听视频事件
            this.player.addEventListener('pause', () => {
                if (!this.isWaitingInteraction) {
                    this.notify('检测到视频暂停，尝试恢复');
                    this.playVideo();
                    removeSpecificOverlays();
                }
            });

            this.player.addEventListener('ended', () => {
                this.notify('当前视频播放完毕');
                this.nextChapter();
            });
        }

        // 播放视频（处理自动播放限制）
        async playVideo() {
            if (this.retryCount >= config.maxRetry) {
                this.notify('达到最大重试次数，请手动点击播放', 'error');
                GM_notification({
                    title: '自动播放被阻止',
                    text: '请手动点击播放按钮',
                    timeout: 5000
                });
                indicator.classList.add('error');
                indicator.textContent = '自动播放被阻止';
                return;
            }

            try {
                const playPromise = this.player.play();

                if (playPromise !== undefined) {
                    await playPromise;
                    this.retryCount = 0;
                    this.notify('不用慌，视频已经播放成功啦！哈哈ヾ(≧▽≦*)o');
                    indicator.classList.remove('error');
                    indicator.innerHTML = '山人刷课机运行中……<div class="pro-label">Pro</div> <div class="countdown-display"></div>';
                }
            } catch (error) {
                this.retryCount++;
                this.notify(`播放失败 (${this.retryCount}/${config.maxRetry}): ${error}`, 'error');

                // 尝试通过点击按钮播放
                const playBtn = await this.waitForElement('.xgplayer-play', document, 1000).catch(() => null);
                if (playBtn) {
                    playBtn.click();
                    this.notify('已尝试点击播放按钮');
                }

                // 直接尝试静音播放
                if (this.retryCount >= 1) {
                    this.player.muted = true;
                    this.player.play().catch(e => this.notify(`静音播放也失败: ${e}`, 'error'));
                }
            }
        }

        // 切换到下一章节
        nextChapter() {
            const items = document.querySelectorAll('li[data-v-290b612e]');
            for (let item of items) {
                const progress = item.querySelector('.progress')?.textContent.trim();
                if (progress === '0%') {
                    item.click();
                    this.notify(`切换到未完成章节: ${item.querySelector('.name').textContent}`);
                    // 点击后等待视频加载并开始播放
                    setTimeout(() => this.playVideo(), 2000);
                    return;
                }
            }
            this.notify('所有章节已完成，返回课程中心');
            window.location.href = 'https://www.hnsydwpx.cn/mineCourse';
        }

        // 等待元素出现
        waitForElement(selector, parent = document, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const check = () => {
                    const el = parent.querySelector(selector);
                    if (el) {
                        resolve(el);
                    } else if (Date.now() - startTime < timeout) {
                        setTimeout(check, 500);
                    } else {
                        reject(new Error(`元素未找到: ${selector}`));
                    }
                };
                check();
            });
        }

        // 弹窗通知
        notify(message, type = 'info') {
            if (config.debugMode) {
                GM_notification({
                    title: `[山人的视频控制]`,
                    text: message,
                    timeout: 5000
                });
            }
        }
    }

    function removeSpecificOverlays() {
            // 获取所有匹配的元素
            const overlays = document.querySelectorAll('.el-overlay');

            // 遍历并删除每个元素
            overlays.forEach(overlay => {
                // 检查内部是否有特定的内容

                        overlay.remove();


            });
        }



    // 页面初始化
    function check2425(items,index) {
        items[index].click();
        setTimeout(() => {
            //先检查元素是否存在
            const lists = document.querySelectorAll('.el-tab-pane .el-row .list_title');
            let button;
            if (lists.length) {
                if(index)console.log('2024年章节未完成，程序优先学习2024年章节！');
                for (let list of lists){
                    let text;
                    if((text = list.querySelector('.el-progress__text span').innerText) === '100%')continue;
                    console.log('第一个未学完的视频进度为：',text);
                    button = list.querySelector('button');
                    try {
                        button.click();break;
                    } catch (clickError) {
                        console.log('点击操作失败:', clickError);

                    }
                }
            } else {
                console.log('2024已经完成，学习2025年课程！');
                if(!index)console.log('全部完成啦！');
                else check2425(items,0);
            }

            new VideoController();
        },2000);
    }

    function init() {
         // 初始化倒计时
        new CountdownManager();


        // 只在对视频页面启用
        if (location.pathname.includes('/videoPlayback') ||
            location.pathname.includes('/getcourseDetails')) {
            new VideoController();
        }else if(!(location.pathname.includes('/mineCourse'))){
           window.location.href = 'https://www.hnsydwpx.cn/mineCourse';
        }else if(location.pathname.includes('/mineCourse')){
            setTimeout(() => {
                console.log('go to my course');
                const items = document.querySelectorAll('.years div[data-v-6a18900e]');
                check2425(items,1);
            }, 2000);
        }
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();



