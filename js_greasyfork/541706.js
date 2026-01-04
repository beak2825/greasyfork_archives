// ==UserScript==
// @name         B站学习监督助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  只允许访问指定UP主的视频，其他显示全屏学习警告，支持自定义倒计时和详细日志
// @author       FCY
// @match        *://www.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @resource     fontAwesome https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @downloadURL https://update.greasyfork.org/scripts/541706/B%E7%AB%99%E5%AD%A6%E4%B9%A0%E7%9B%91%E7%9D%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541706/B%E7%AB%99%E5%AD%A6%E4%B9%A0%E7%9B%91%E7%9D%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试模式开关（设为false可关闭日志）
    const DEBUG_MODE = false;
    function log(...args) {
        if (DEBUG_MODE) {
            console.log("[B站学习监督助手]", ...args);
        }
    }

    log("脚本已加载，版本8.4");

    // ====== 全局变量 ======
    let videoTimeTrackingInterval = null; // 视频播放时间跟踪计时器
    let lastVideoPlayTime = 0; // 上次视频播放时间（用于计算增量）
    let isTrackingActive = false; // 跟踪状态标志

    // ====== 默认配置 ======
    const defaultConfig = {
        showCountdown: true,
        countdownTitle: "考试",
        examDate: getDefaultDate(),
        warningMessages: [
            "刷B站一时爽，考试挂科泪两行！",
            "你收藏夹里的学习视频都看完了吗？",
            "说好的只看10分钟呢？已经过去2小时了！",
            "题都刷完了吗？还在这看视频！",
            "再刷B站考试就要挂科了！",
            "想想你的目标，放下手机去学习！",
            "今日的懈怠，明日的懊悔！",
            "你离梦想只差一个专注的学习时间！",
            "现在每学一分钟，考试多拿一分！",
            "沉迷B站，考试完蛋！快去看书！"
        ],
        allowedUpIds: [],
        // 新增：每日观看时长限制（分钟）
        dailyWatchLimit: 35
    };

    // 获取默认日期（下个月的今天）
    function getDefaultDate() {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        return nextMonth.toISOString().split('T')[0];
    }

    // 加载配置
    let config = GM_getValue('config', JSON.parse(JSON.stringify(defaultConfig)));
    log("配置加载完成", config);

    // 注册菜单命令
    GM_registerMenuCommand("学习监督设置", openSettingsPanel);
    // 新增：注册非白名单观看时长菜单命令
    GM_registerMenuCommand("查看非白名单观看时长", showWatchTimeInfo);

    // 新增：显示非白名单观看时长信息
    function showWatchTimeInfo() {
        const watchedSeconds = getTodayWatchedSeconds();
        const watchedMinutes = Math.floor(watchedSeconds / 60);
        const remainingSeconds = watchedSeconds % 60;
        const limitMinutes = config.dailyWatchLimit;
        const remainingMinutes = Math.max(0, limitMinutes - watchedMinutes);

        alert(`📊 今日非白名单观看时长统计：
⏱️ 已观看: ${watchedMinutes}分${remainingSeconds}秒
⏳ 剩余: ${remainingMinutes}分钟
📏 每日限额: ${limitMinutes}分钟`);
    }

    // 检测当前页面是否为视频页面
    function isVideoPage() {
        const isVideo = window.location.pathname.startsWith('/video/');
        log("当前页面是否为视频页面:", isVideo);
        return isVideo;
    }

    // 获取今日日期字符串（YYYY-MM-DD）
    function getTodayDateString() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    // 初始化今日观看时间
    function initTodayWatchTime() {
        const today = getTodayDateString();
        const watchTimeData = GM_getValue('watchTimeData', {});

        // 如果今天的数据不存在或日期已变更，重置为0
        if (!watchTimeData[today]) {
            watchTimeData[today] = 0;
            GM_setValue('watchTimeData', watchTimeData);
        }

        return watchTimeData;
    }

    // 获取今日已观看时间（秒）
    function getTodayWatchedSeconds() {
        const watchTimeData = GM_getValue('watchTimeData', {});
        const today = getTodayDateString();
        return watchTimeData[today] || 0;
    }

    // 更新今日观看时间
    function updateTodayWatchTime(seconds) {
        const watchTimeData = GM_getValue('watchTimeData', {});
        const today = getTodayDateString();
        watchTimeData[today] = seconds;
        GM_setValue('watchTimeData', watchTimeData);
    }

    // 重置今日观看时间
    function resetTodayWatchTime() {
        const watchTimeData = GM_getValue('watchTimeData', {});
        const today = getTodayDateString();
        watchTimeData[today] = 0;
        GM_setValue('watchTimeData', watchTimeData);
        log("今日观看时间已重置");

        // 显示提示
        alert("今日观看时间已重置为0分钟");
    }

    // 开始跟踪视频播放时间（非白名单UP主）
    function startVideoTimeTracking() {
        log("开始跟踪视频播放时间...");

        // 先清除之前的计时器（如果有）
        stopVideoTimeTracking();

        // 获取视频元素
        const video = document.querySelector('video');
        if (!video) {
            log("未找到视频元素，无法跟踪播放时间");
            return;
        }

        // 初始化上次播放时间
        lastVideoPlayTime = Date.now();
        isTrackingActive = true;

        // 每秒钟更新一次
        videoTimeTrackingInterval = setInterval(() => {
            // 如果视频正在播放
            if (!video.paused && !video.ended) {
                const now = Date.now();
                const deltaSeconds = Math.floor((now - lastVideoPlayTime) / 1000);
                lastVideoPlayTime = now;

                if (deltaSeconds > 0) {
                    // 更新今日观看时间
                    const watchedSeconds = getTodayWatchedSeconds() + deltaSeconds;
                    updateTodayWatchTime(watchedSeconds);
                    log(`更新观看时间：${watchedSeconds}秒`);

                    // 检查是否超过限制
                    const limitSeconds = config.dailyWatchLimit * 60;
                    if (watchedSeconds >= limitSeconds) {
                        log("今日观看时长已达上限，显示警告页面");
                        replaceEntirePage(true);
                    }
                }
            }
        }, 1000);
    }

    // 停止跟踪视频播放时间
    function stopVideoTimeTracking() {
        if (videoTimeTrackingInterval) {
            clearInterval(videoTimeTrackingInterval);
            videoTimeTrackingInterval = null;
            isTrackingActive = false;
            log("已停止视频播放时间跟踪");
        }
    }

    // 主入口
    if (isVideoPage()) {
        log("检测到视频页面，开始初始化...");
        // 初始化今日观看时间
        initTodayWatchTime();

        // 初始检查
        startVideoCheck();

        // 设置核心监听器
        setupCoreListeners();
    }

    // 设置核心监听器
    function setupCoreListeners() {
        log("设置核心监听器...");

        // 监听B站SPA路由变化事件
        window.addEventListener('popstate', handlePageChange);
        window.addEventListener('pushState', handlePageChange);
        window.addEventListener('replaceState', handlePageChange);

        // 监听视频切换事件
        setupVideoChangeListener();

        // 监听DOM变化 - 这是关键改进
        setupDOMMutationObserver();
    }

    // 启动视频检查
    function startVideoCheck() {
        log("开始视频检查...");

        // 尝试立即检查
        const upElement = getUpElement();
        if (upElement) {
            log("UP元素已存在，立即检查");
            checkUpPermission();
            return;
        }

        log("UP元素不存在，等待DOM变化...");
        // 设置超时以防元素永远不出现
        setTimeout(() => {
            const targetElement = getUpElement();
            if (!targetElement) {
                log("等待UP元素超时，尝试检查");
                checkUpPermission();
            }
        }, 3000);
    }

    // 设置DOM变化监听器
    function setupDOMMutationObserver() {
        log("设置DOM变化监听器...");

        // 创建MutationObserver实例
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                // 检查是否有新增的节点包含UP主信息
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && (node.matches('.up-detail-top, .up-info, .upname') ||
                            node.querySelector('.up-detail-top, .up-info, .upname'))) {
                            log("检测到UP元素变化");
                            handlePageChange();
                            return;
                        }
                    }
                }
            }
        });

        // 开始观察整个文档的变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        log("DOM变化监听器已激活");
    }

    // 设置视频切换监听
    function setupVideoChangeListener() {
        log("设置视频切换监听...");

        // 监听推荐视频点击
        document.body.addEventListener('click', function(event) {
            const target = event.target;
            if (target.closest('.recommend-card') ||
                target.closest('.video-card') ||
                target.closest('.bili-video-card')) {
                log("检测到推荐视频点击");
                setTimeout(() => {
                    log("执行视频切换检查");
                    startVideoCheck();
                }, 1200);
            }
        });

        // 监听播放器事件 - 优化后的版本
        function setupPlayerEvents() {
            log("尝试设置播放器事件监听...");

            // 尝试获取视频元素
            const video = document.querySelector('video');
            if (video) {
                log("找到视频元素，添加播放状态监听");

                // 清除旧的事件监听器
                video.removeEventListener('play', handleVideoPlay);
                video.removeEventListener('pause', handleVideoPause);
                video.removeEventListener('ended', handleVideoEnded);

                // 添加新的事件监听器
                video.addEventListener('play', handleVideoPlay);
                video.addEventListener('pause', handleVideoPause);
                video.addEventListener('ended', handleVideoEnded);

                // 如果视频已经在播放，检查是否需要开始计时
                if (!video.paused && !video.ended) {
                    log("视频已在播放状态，检查计时");
                    const currentUpId = getCurrentUpId();
                    if (currentUpId && !isUpAllowed(currentUpId)) {
                        if (!isTrackingActive) {
                            log("非白名单视频正在播放，但未计时，启动计时");
                            startVideoTimeTracking();
                        } else {
                            log("非白名单视频正在播放，计时已激活");
                        }
                    }
                }
            } else {
                log("未找到视频元素，稍后重试");
                // 如果未找到视频元素，稍后重试
                setTimeout(setupPlayerEvents, 1000);
            }
        }

        // 视频播放事件处理
        function handleVideoPlay() {
            log("视频开始播放");
            handleVideoEvent();

            // 如果是非白名单视频，开始计时
            const currentUpId = getCurrentUpId();
            if (currentUpId && !isUpAllowed(currentUpId)) {
                log("非白名单视频开始播放，启动计时");
                startVideoTimeTracking();
            }
        }

        // 视频暂停事件处理
        function handleVideoPause() {
            log("视频暂停");
            handleVideoEvent();
            stopVideoTimeTracking();
        }

        // 视频结束事件处理
        function handleVideoEnded() {
            log("视频结束");
            handleVideoEvent();
            stopVideoTimeTracking();
        }

        // 初始设置播放器事件
        setupPlayerEvents();

        // 添加额外的重试机制
        const playerObserver = new MutationObserver(() => {
            log("检测到DOM变化，重新设置播放器事件");
            setupPlayerEvents();
        });

        playerObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // 视频事件处理
    function handleVideoEvent() {
        log("检测到视频状态变化");
        clearTimeout(window.videoCheckTimeout);
        window.videoCheckTimeout = setTimeout(() => {
            log("执行视频事件检查");
            startVideoCheck();
        }, 800);
    }

    // 页面变化处理
    function handlePageChange() {
        log("检测到页面变化");
        // 停止任何进行中的时间跟踪
        stopVideoTimeTracking();

        if (isVideoPage()) {
            log("当前是视频页面，开始检查...");
            // 防止重复检查
            clearTimeout(window.videoCheckTimeout);
            window.videoCheckTimeout = setTimeout(() => {
                startVideoCheck();
            }, 800);
        }
    }

    // 获取UP元素
    function getUpElement() {
        return document.querySelector('.up-detail-top') ||
               document.querySelector('.up-info') ||
               document.querySelector('.upname') ||
               document.querySelector('.up-detail') ||
               document.querySelector('.up-info-container');
    }

    // 获取当前UP主ID
    function getCurrentUpId() {
        log("开始获取UP主ID...");

        // 尝试多种选择器获取UP主信息
        let upLink = document.querySelector('a.up-name') ||
                     document.querySelector('.up-info .name') ||
                     document.querySelector('.username') ||
                     document.querySelector('.up-name') ||
                     document.querySelector('.up-info_name');

        if (!upLink) {
            log("未找到UP主链接元素");
            // 尝试最后一种方法：通过UP主头像容器查找
            const avatarContainer = document.querySelector('.up-detail-top') ||
                                    document.querySelector('.up-info') ||
                                    document.querySelector('.up-avatar') ||
                                    document.querySelector('.up-info_avatar');

            if (avatarContainer && avatarContainer.querySelector('a')) {
                upLink = avatarContainer.querySelector('a');
                log("通过头像容器找到UP主链接");
            }
        }

        if (!upLink) {
            log("无法找到UP主信息");
            return null;
        }

        const href = upLink.getAttribute('href') || "";
        log("UP主链接:", href);

        // 提取UP主ID
        let currentUpId = null;
        const upIdMatch = href.match(/space\.bilibili\.com\/(\d+)/);

        if (upIdMatch && upIdMatch.length >= 2) {
            currentUpId = upIdMatch[1];
        } else {
            // 尝试从URL中直接提取数字ID
            const numMatch = href.match(/\/(\d+)/);
            if (numMatch && numMatch.length >= 2) {
                currentUpId = numMatch[1];
            }
        }

        if (!currentUpId) {
            log("无法从链接中提取UP主ID:", href);
            return null;
        }

        log("当前UP主ID:", currentUpId);
        return currentUpId;
    }

    // 检查UP主是否在白名单
    function isUpAllowed(upId) {
        return config.allowedUpIds.some(up => up.id === upId);
    }

    // 检测UP主权限 - 修复后的版本
    function checkUpPermission() {
        log("开始检查UP权限...");

        const currentUpId = getCurrentUpId();
        if (!currentUpId) {
            log("无法获取UP主ID，跳过检查");
            return;
        }

        log("允许的UP主列表:", config.allowedUpIds.map(u => u.id));

        // 检查是否在允许列表中
        const isAllowed = isUpAllowed(currentUpId);
        log("权限检查结果:", isAllowed ? "允许" : "禁止");

        // 处理非白名单UP主 - 修复逻辑
        if (!isAllowed) {
            const watchedSeconds = getTodayWatchedSeconds();
            const limitSeconds = config.dailyWatchLimit * 60;
            log(`今日已观看非白名单视频: ${watchedSeconds}秒, 限制: ${limitSeconds}秒`);

            if (watchedSeconds >= limitSeconds) {
                log("今日观看时长已达上限，显示警告页面");
                replaceEntirePage(true); // 显示时间限制警告
                return;
            } else {
                log("未超过每日观看时长，允许观看");
                removeWarningPage(); // 确保移除警告页面

                // 检查视频是否正在播放，如果是则开始计时
                const video = document.querySelector('video');
                if (video && !video.paused && !video.ended) {
                    log("非白名单视频正在播放，启动计时");
                    startVideoTimeTracking();
                } else {
                    log("非白名单视频未在播放，等待播放事件");
                }
                return;
            }
        }

        // 白名单UP主处理
        log("视频在白名单中，允许观看");
        removeWarningPage();
    }

    // 移除警告页面
    function removeWarningPage() {
        if (document.getElementById('study-warning-page')) {
            log("移除警告页面");
            window.location.reload();
        }
    }

    // 替换整个页面为警告页面
    function replaceEntirePage(timeLimitExceeded = false) {
        log("创建警告页面...", timeLimitExceeded ? "(时间限制)" : "");

        // 停止任何进行中的时间跟踪
        stopVideoTimeTracking();

        // 检查是否已经创建了警告页面
        if (document.getElementById('study-warning-page')) {
            log("警告页面已存在，跳过创建");
            return;
        }

        // 创建全屏警告页面
        const warningPage = document.createElement('div');
        warningPage.id = 'study-warning-page';

        // 随机选择一条警告信息
        let randomMessage;
        if (timeLimitExceeded) {
            randomMessage = `今日非学习UP主观看时长已达上限（${config.dailyWatchLimit}分钟）！快去学习！`;
        } else {
            randomMessage = config.warningMessages[Math.floor(Math.random() * config.warningMessages.length)];
        }

        // 生成倒计时HTML（如果启用）
        const countdownHTML = config.showCountdown ? `
            <div class="countdown">
                <div class="countdown-title">距离${config.countdownTitle}还有：</div>
                <div id="timer">00:00:00</div>
            </div>
        ` : '';

        // 新增：今日观看时间显示
        const watchedSeconds = getTodayWatchedSeconds();
        const watchedMinutes = Math.floor(watchedSeconds / 60);
        const remainingSeconds = watchedSeconds % 60;
        const limitMinutes = config.dailyWatchLimit;

        warningPage.innerHTML = `
            <div class="particles" id="particles"></div>

            <div class="container">
                <div class="header">
                    <h1><i class="fas fa-graduation-cap"></i> B站学习监督助手</h1>
                    <!-- <p class="subtitle">只允许访问指定UP主，其他视频将显示全屏学习警告</p> -->
                </div>

                <div class="main-content">
                    <div class="warning-section">
                        <div class="warning-icon">⚠️📚⏰</div>
                        <div class="warning-message">${randomMessage}</div>

                        <!-- 新增：今日观看时间统计 -->
                        <div class="time-stats">
                            <div class="time-stat">
                                <i class="fas fa-clock"></i>
                                <span>今日已观看: ${watchedMinutes}分${remainingSeconds}秒</span>
                            </div>
                            <div class="time-stat">
                                <i class="fas fa-hourglass-half"></i>
                                <span>每日限额: ${limitMinutes}分钟</span>
                            </div>
                        </div>

                        ${countdownHTML}

                        <div class="quote">
                            "学习如逆水行舟，不进则退；心似平原走马，易放难收"
                        </div>
                    </div>


                </div>
            </div>

            <div class="settings-btn" id="study-settings-btn">
                <i class="fas fa-cog"></i>
            </div>
        `;

        // 替换整个页面
        document.body.innerHTML = '';
        document.body.appendChild(warningPage);

        // 添加样式
        addStyles();

        // 添加粒子效果
        createParticles();

        // 如果启用倒计时，初始化倒计时
        if (config.showCountdown) {
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }

        // 添加设置按钮事件
        document.getElementById('study-settings-btn').addEventListener('click', openSettingsPanel);

        log("警告页面创建完成");

        // 在警告页面中也需要监听视频切换
        setupVideoChangeListener();
    }

    // 添加样式
    function addStyles() {
        GM_addStyle(`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            body {
                background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c);
                color: white;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
                padding: 20px;
            }

            #study-warning-page .container {
                max-width: 1200px;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 30px;
                z-index: 10;
            }

            #study-warning-page .header {
                text-align: center;
                // margin-bottom: 10px;
            }

            #study-warning-page h1 {
                font-size: 3rem;
                margin-bottom: 10px;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            }

            #study-warning-page .subtitle {
                font-size: 1.3rem;
                opacity: 0.9;
                max-width: 600px;
                margin: 0 auto 15px;
            }

            #study-warning-page .debug-info {
                background: rgba(255, 255, 255, 0.1);
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                margin-top: 10px;
                display: inline-block;
            }

            #study-warning-page .main-content {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 25px;
                width: 100%;
            }

            #study-warning-page .warning-section {
                flex: 1;
                min-width: 300px;
                max-width: 600px;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                text-align: center;
                border: 3px solid #ffcc00;
                animation: glow 2s infinite alternate;
            }

            #study-warning-page .warning-icon {
                font-size: 5rem;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }

            #study-warning-page .warning-message {
                font-size: 1.8rem;
                font-weight: bold;
                margin: 25px 0;
                line-height: 1.6;
            }

            /* 新增：时间统计样式 */
            #study-warning-page .time-stats {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 15px;
                margin: 20px 0;
                border: 2px solid #3498db;
            }

            #study-warning-page .time-stat {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 10px 0;
                font-size: 1.3rem;
            }

            #study-warning-page .time-stat i {
                color: #3498db;
            }

            #study-warning-page .countdown {
                background: rgba(0, 0, 0, 0.5);
                border-radius: 15px;
                padding: 20px;
                margin: 25px 0;
                border: 2px solid #ff5252;
            }

            #study-warning-page .countdown-title {
                font-size: 1.4rem;
                margin-bottom: 15px;
                color: #ffcc00;
            }

            #study-warning-page #timer {
                font-size: 2.2rem;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                letter-spacing: 3px;
                color: #4cff00;
            }

            #study-warning-page .quote {
                font-style: italic;
                margin-top: 25px;
                font-size: 1.2rem;
                opacity: 0.9;
            }

            #study-warning-page .info-section {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                width: 100%;
                max-width: 800px;
            }

            #study-warning-page .info-card {
                flex: 1;
                min-width: 250px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                border: 2px solid #00bfff;
                transition: all 0.3s;
            }

            #study-warning-page .info-card:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.15);
            }

            #study-warning-page .info-card i {
                font-size: 3rem;
                margin-bottom: 15px;
                color: #00bfff;
            }

            #study-warning-page .info-card h3 {
                font-size: 1.5rem;
                margin-bottom: 10px;
            }

            #study-warning-page .info-card p {
                font-size: 1rem;
                opacity: 0.9;
            }

            #study-warning-page .settings-btn {
                position: fixed;
                bottom: 25px;
                right: 25px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6a11cb, #2575fc);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                cursor: pointer;
                z-index: 100;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transition: all 0.3s;
            }

            #study-warning-page .settings-btn:hover {
                transform: scale(1.1) rotate(30deg);
            }

            #study-warning-page .particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }

            #study-warning-page .particle {
                position: absolute;
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                animation: float linear infinite;
            }

            /* Animations */
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 0.8; }
            }

            @keyframes glow {
                0% { box-shadow: 0 0 15px #ffcc00; }
                100% { box-shadow: 0 0 40px #ffcc00; }
            }

            @keyframes float {
                to {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }

            /* Responsive design */
            @media (max-width: 768px) {
                #study-warning-page h1 {
                    font-size: 2.2rem;
                }

                #study-warning-page .subtitle {
                    font-size: 1.1rem;
                }

                #study-warning-page .warning-message {
                    font-size: 1.5rem;
                }

                #study-warning-page #timer {
                    font-size: 1.8rem;
                }

                #study-warning-page .warning-icon {
                    font-size: 4rem;
                }

                #study-warning-page .time-stat {
                    font-size: 1.1rem;
                }
            }

            @media (max-width: 480px) {
                #study-warning-page .warning-section {
                    padding: 20px;
                }

                #study-warning-page h1 {
                    font-size: 1.8rem;
                }

                #study-warning-page .warning-message {
                    font-size: 1.3rem;
                }

                #study-warning-page #timer {
                    font-size: 1.5rem;
                }

                #study-warning-page .info-card {
                    min-width: 100%;
                }

                #study-warning-page .time-stat {
                    font-size: 1rem;
                }
            }
        `);
    }

    // 创建粒子效果
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // 随机大小
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // 随机位置
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // 随机颜色
            const colors = ['#ffcc00', '#ff5252', '#4cff00', '#00bfff'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // 随机动画
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            particle.style.animation = `float ${duration}s linear ${delay}s infinite`;

            particlesContainer.appendChild(particle);
        }
    }

    // 更新倒计时
    function updateCountdown() {
        const timer = document.getElementById('timer');
        if (!timer) return;

        const examDateObj = new Date(config.examDate);
        const now = new Date();
        const diff = examDateObj - now;

        if (diff <= 0) {
            timer.textContent = `${config.countdownTitle}已开始！`;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        timer.textContent =
            `${days}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 打开设置面板
    function openSettingsPanel() {
        // 创建设置面板容器
        const panel = document.createElement('div');
        panel.id = 'study-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 700px;
            max-height: 90vh;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
            z-index: 100000;
            overflow: auto;
            padding: 25px;
            color: #333;
        `;

        // 计算今日观看时间
        const watchedSeconds = getTodayWatchedSeconds();
        const watchedMinutes = Math.floor(watchedSeconds / 60);
        const watchedSecs = watchedSeconds % 60;
        const watchedTimeStr = `${watchedMinutes}分${watchedSecs}秒`;
        const remainingMinutes = Math.max(0, config.dailyWatchLimit - watchedMinutes);
        const remainingTimeStr = `${remainingMinutes}分钟`;

        // 面板内容
        panel.innerHTML = `
            <style>
                #study-settings-panel * {
                    box-sizing: border-box;
                    font-family: 'Microsoft YaHei', sans-serif;
                    color: #333;
                }

                #study-settings-panel h2 {
                    font-size: 1.8rem;
                    color: #2c3e50;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #3498db;
                    text-align: center;
                }

                .settings-section {
                    background: #f9f9f9;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 25px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                }

                .settings-section h3 {
                    margin-bottom: 15px;
                    color: #3498db;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                #study-settings-panel .input-group {
                    margin-bottom: 20px;
                }

                #study-settings-panel label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #2c3e50;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                #study-settings-panel input[type="text"],
                #study-settings-panel input[type="date"],
                #study-settings-panel input[type="number"] {
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #e1e5eb;
                    border-radius: 10px;
                    font-size: 1rem;
                    color: #000;
                    background: #fff;
                }

                #study-settings-panel input[type="text"]::placeholder {
                    color: #aaa;
                }

                #study-settings-panel .checkbox-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                }

                #study-settings-panel .checkbox-group input {
                    margin-right: 10px;
                    width: 18px;
                    height: 18px;
                }

                #study-settings-panel button {
                    background: linear-gradient(to right, #3498db, #2c3e50);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 12px 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                #study-settings-panel button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 7px 15px rgba(52, 152, 219, 0.4);
                }

                #study-settings-panel .btn-add {
                    background: linear-gradient(to right, #2ecc71, #27ae60);
                    width: 100%;
                    padding: 14px;
                    margin-top: 10px;
                }

                #study-settings-panel .btn-delete {
                    background: linear-gradient(to right, #e74c3c, #c0392b);
                    padding: 8px 15px;
                    font-size: 0.9rem;
                }

                #study-settings-panel .up-list {
                    max-height: 300px;
                    overflow-y: auto;
                    border: 2px solid #e1e5eb;
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 20px;
                }

                #study-settings-panel .up-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 15px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    margin-bottom: 12px;
                    transition: all 0.3s;
                }

                #study-settings-panel .up-item:hover {
                    background: #e3f2fd;
                    transform: translateX(5px);
                }

                #study-settings-panel .up-info {
                    display: flex;
                    flex-direction: column;
                }

                #study-settings-panel .up-name {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #2c3e50;
                    margin-bottom: 5px;
                }

                #study-settings-panel .up-id {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                }

                #study-settings-panel .empty-state {
                    text-align: center;
                    padding: 30px;
                    color: #7f8c8d;
                }

                #study-settings-panel .btn-container {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }

                #study-settings-panel .date-inputs {
                    display: flex;
                    gap: 15px;
                }

                #study-settings-panel .date-inputs > div {
                    flex: 1;
                }

                /* 新增：观看时长统计卡片样式 */
                .watch-time-card {
                    background: linear-gradient(135deg, #3498db, #2c3e50);
                    color: white;
                    border-radius: 15px;
                    padding: 20px;
                    margin: 20px 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }

                .watch-time-card h4 {
                    font-size: 1.3rem;
                    margin-bottom: 15px;
                    text-align: center;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .watch-time-stats {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .watch-time-stat {
                    text-align: center;
                    flex: 1;
                    min-width: 120px;
                }

                .watch-time-stat .value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .watch-time-stat .label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
            </style>

            <h2><i class="fas fa-cog"></i> 学习监督设置</h2>

            <!-- 新增：非白名单观看时长统计卡片 -->
            <div class="watch-time-card">
                <h4><i class="fas fa-chart-bar"></i> 非白名单观看时长统计</h4>
                <div class="watch-time-stats">
                    <div class="watch-time-stat">
                        <div class="value">${watchedTimeStr}</div>
                        <div class="label">今日已观看</div>
                    </div>
                    <div class="watch-time-stat">
                        <div class="value">${remainingTimeStr}</div>
                        <div class="label">剩余时长</div>
                    </div>
                    <div class="watch-time-stat">
                        <div class="value">${config.dailyWatchLimit}分钟</div>
                        <div class="label">每日限额</div>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h3><i class="fas fa-user-cog"></i> UP主管理</h3>

                <div class="input-group">
                    <label for="study-up-link"><i class="fas fa-link"></i> UP主主页链接：</label>
                    <input type="text" id="study-up-link" placeholder="例如：https://space.bilibili.com/1625060795">
                </div>

                <div class="input-group">
                    <label for="study-up-name"><i class="fas fa-user"></i> UP主昵称：</label>
                    <input type="text" id="study-up-name" placeholder="手动输入UP主昵称">
                </div>

                <button class="btn btn-add" id="study-add-up-btn">
                    <i class="fas fa-plus-circle"></i> 添加到允许列表
                </button>

                <h4 style="margin: 20px 0 10px;">已允许的UP主列表</h4>

                <div class="up-list" id="study-up-list">
                    ${config.allowedUpIds.length > 0 ?
                        config.allowedUpIds.map(up => `
                            <div class="up-item" data-id="${up.id}">
                                <div class="up-info">
                                    <div class="up-name">${up.name}</div>
                                    <div class="up-id">ID: ${up.id}</div>
                                </div>
                                <button class="btn btn-delete">
                                    <i class="fas fa-trash-alt"></i> 删除
                                </button>
                            </div>
                        `).join('') :
                        `<div class="empty-state">
                            <i class="fas fa-user-friends" style="font-size: 40px; margin-bottom: 15px;"></i>
                            <p>尚未添加任何UP主</p>
                        </div>`
                    }
                </div>
            </div>

            <div class="settings-section">
                <h3><i class="fas fa-clock"></i> 倒计时设置</h3>

                <div class="checkbox-group">
                    <input type="checkbox" id="show-countdown" ${config.showCountdown ? 'checked' : ''}>
                    <label for="show-countdown">显示倒计时模块</label>
                </div>

                <div id="countdown-settings" style="${config.showCountdown ? '' : 'display: none;'}">
                    <div class="input-group">
                        <label for="countdown-title"><i class="fas fa-heading"></i> 倒计时标题：</label>
                        <input type="text" id="countdown-title" value="${config.countdownTitle}" placeholder="例如：期末考试">
                    </div>

                    <div class="input-group">
                        <label for="exam-date"><i class="fas fa-calendar-alt"></i> 目标日期：</label>
                        <input type="date" id="exam-date" value="${config.examDate}">
                    </div>
                </div>
            </div>

            <!-- 新增：每日观看时长设置 -->
            <div class="settings-section">
                <h3><i class="fas fa-stopwatch"></i> 每日观看时长限制</h3>
                <div class="input-group">
                    <label for="daily-watch-limit"><i class="fas fa-hourglass-half"></i> 每日可观看时长（分钟，非白名单UP主）：</label>
                    <input type="number" id="daily-watch-limit" value="${config.dailyWatchLimit}" min="1" step="1" disabled>
                </div>
                <div class="input-group" style="display: none">
                    <button id="reset-today-watch" class="btn" style="background: linear-gradient(to right, #f39c12, #e67e22); width:100%;">
                        <i class="fas fa-history"></i> 重置今日已观看时间
                    </button>
                </div>
            </div>

            <div class="settings-section">
                <h3><i class="fas fa-comment-alt"></i> 警告消息设置</h3>
                <div class="input-group">
                    <label for="warning-messages"><i class="fas fa-exclamation-triangle"></i> 自定义警告消息（每行一条）：</label>
                    <textarea id="warning-messages" rows="6" style="width: 100%; padding: 12px; border: 2px solid #e1e5eb; border-radius: 10px; font-size: 1rem;">${config.warningMessages.join('\n')}</textarea>
                </div>
            </div>

            <div class="btn-container">
                <button id="study-save-btn" style="background: linear-gradient(to right, #2ecc71, #27ae60);">
                    <i class="fas fa-save"></i> 保存设置
                </button>
                <button id="study-reset-btn" style="background: linear-gradient(to right, #f39c12, #e67e22);">
                    <i class="fas fa-undo"></i> 恢复默认
                </button>
                <button id="study-close-btn" style="background: linear-gradient(to right, #95a5a6, #7f8c8d);">
                    <i class="fas fa-times"></i> 关闭
                </button>
            </div>
        `;

        // 添加到文档
        document.body.appendChild(panel);

        // 添加遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'study-settings-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
        `;
        document.body.appendChild(overlay);

        // 事件监听
        document.getElementById('study-add-up-btn').addEventListener('click', addUpFromPanel);
        document.getElementById('study-save-btn').addEventListener('click', saveSettings);
        document.getElementById('study-reset-btn').addEventListener('click', resetSettings);
        document.getElementById('study-close-btn').addEventListener('click', closeSettingsPanel);
        document.getElementById('show-countdown').addEventListener('change', toggleCountdownSettings);
        document.getElementById('reset-today-watch').addEventListener('click', resetTodayWatchTime);
        overlay.addEventListener('click', closeSettingsPanel);

        // 添加删除事件
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.up-item');
                const id = item.getAttribute('data-id');
                config.allowedUpIds = config.allowedUpIds.filter(up => up.id !== id);
                item.remove();

                // 如果没有UP主了，显示空状态
                if (document.querySelectorAll('.up-item').length === 0) {
                    document.getElementById('study-up-list').innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-user-friends" style="font-size: 40px; margin-bottom: 15px;"></i>
                            <p>尚未添加任何UP主</p>
                        </div>
                    `;
                }
            });
        });

        // 从面板添加UP主
        function addUpFromPanel() {
            const upLink = document.getElementById('study-up-link').value.trim();
            const upName = document.getElementById('study-up-name').value.trim();

            if (!upLink) {
                alert('请输入UP主主页链接');
                return;
            }

            if (!upName) {
                alert('请输入UP主昵称');
                return;
            }

            // 从链接中提取UP主ID
            const idMatch = upLink.match(/space\.bilibili\.com\/(\d+)/);
            let upId = null;

            if (idMatch && idMatch.length >= 2) {
                upId = idMatch[1];
            } else {
                // 尝试从URL中直接提取数字ID
                const numMatch = upLink.match(/\/(\d+)/);
                if (numMatch && numMatch.length >= 2) {
                    upId = numMatch[1];
                }
            }

            if (!upId) {
                alert('无法从链接中提取UP主ID，请确保链接格式正确');
                return;
            }

            // 检查是否已存在
            if (config.allowedUpIds.some(up => up.id === upId)) {
                alert('该UP主已在允许列表中');
                return;
            }

            // 添加到列表
            config.allowedUpIds.push({
                id: upId,
                name: upName,
                url: upLink
            });

            // 清空输入框
            document.getElementById('study-up-link').value = '';
            document.getElementById('study-up-name').value = '';

            // 添加到列表显示
            const upItem = document.createElement('div');
            upItem.className = 'up-item';
            upItem.setAttribute('data-id', upId);
            upItem.innerHTML = `
                <div class="up-info">
                    <div class="up-name">${upName}</div>
                    <div class="up-id">ID: ${upId}</div>
                </div>
                <button class="btn btn-delete">
                    <i class="fas fa-trash-alt"></i> 删除
                </button>
            `;

            // 添加删除事件
            upItem.querySelector('.btn-delete').addEventListener('click', function() {
                const id = upItem.getAttribute('data-id');
                config.allowedUpIds = config.allowedUpIds.filter(up => up.id !== id);
                upItem.remove();
            });

            // 移除空状态（如果存在）
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) emptyState.remove();

            document.getElementById('study-up-list').appendChild(upItem);

            // 显示成功消息
            alert(`已添加UP主: ${upName} (ID: ${upId})`);
        }

        // 切换倒计时设置显示
        function toggleCountdownSettings() {
            const showCountdown = document.getElementById('show-countdown').checked;
            document.getElementById('countdown-settings').style.display = showCountdown ? 'block' : 'none';
        }

        // 保存设置
        function saveSettings() {
            // 更新倒计时设置
            config.showCountdown = document.getElementById('show-countdown').checked;
            config.countdownTitle = document.getElementById('countdown-title').value || "考试";
            config.examDate = document.getElementById('exam-date').value || getDefaultDate();

            // 更新每日观看时长
            const dailyLimit = parseInt(document.getElementById('daily-watch-limit').value);
            config.dailyWatchLimit = isNaN(dailyLimit) ? 30 : Math.max(1, dailyLimit);

            // 更新警告消息
            const messagesText = document.getElementById('warning-messages').value;
            config.warningMessages = messagesText.split('\n').filter(msg => msg.trim().length > 0);

            // 保存配置
            GM_setValue('config', config);
            alert('设置已保存！');
            closeSettingsPanel();
            location.reload(); // 重新加载页面应用新设置
        }

        // 恢复默认设置
        function resetSettings() {
            if (confirm('确定要恢复默认设置吗？所有自定义设置将被重置。')) {
                config = JSON.parse(JSON.stringify(defaultConfig));
                GM_setValue('config', config);
                alert('已恢复默认设置！');
                closeSettingsPanel();
                location.reload();
            }
        }

        // 关闭设置面板
        function closeSettingsPanel() {
            const panel = document.getElementById('study-settings-panel');
            const overlay = document.getElementById('study-settings-overlay');
            if (panel) panel.remove();
            if (overlay) overlay.remove();
        }
    }
})();