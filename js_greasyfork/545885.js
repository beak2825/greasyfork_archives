// ==UserScript==
// @name         Auto Read Nodeloc.com UltraPLUS2（自动阅读）
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  自动刷nodeloc.com文章（优化版：真人模拟+无jQuery依赖+精准点赞）
// @author       yuanly666 (optimized by Dev)
// @match        https://meta.discourse.org/*
// @match        https://linux.do/*
// @match        https://www.nodeloc.com/*
// @match        https://meta.appinn.net/*
// @match        https://community.openai.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=nodeloc.com
// @downloadURL https://update.greasyfork.org/scripts/545885/Auto%20Read%20Nodeloccom%20UltraPLUS2%EF%BC%88%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545885/Auto%20Read%20Nodeloccom%20UltraPLUS2%EF%BC%88%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 环境检测 ==========
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.error('[AutoRead] 错误：该脚本仅支持在浏览器的Tampermonkey插件中运行，不支持Node.js环境！');
        if (typeof module !== 'undefined' && module.exports) {
            return;
        }
        alert('[AutoRead] 运行环境错误：请在浏览器中安装Tampermonkey插件后运行此脚本！');
        return;
    }

    // 配置项
    const config = {
        commentLimit: 1000,
        topicListLimit: 50,
        likeLimit: 50,
        defaultScrollSpeed: 40,
        minScrollSpeed: 1,
        maxScrollSpeed: 200,
        scrollStep: 1,
        scrollDelay: 30,
        checkDelay: 800,
        likeInterval: 2500,
        retryDelay: 3000,
        maxRetries: 3,
        scrollSpeedRandomRange: 5,
        likeIntervalRandomRange: 1000,
        visitedTopicsLimit: 200
    };

    // 站点匹配
    const possibleBaseURLs = [
        "https://www.nodeloc.com",
        "https://linux.do",
        "https://meta.discourse.org",
        "https://meta.appinn.net",
        "https://community.openai.com"
    ];
    const currentURL = window.location.href;
    let BASE_URL = possibleBaseURLs.find(url => currentURL.startsWith(url)) || possibleBaseURLs[0];

    // 初始化存储
    function initStorage() {
        const defaultVals = {
            read: false,
            autoLikeEnabled: false,
            clickCounter: 0,
            clickCounterTimestamp: Date.now(),
            scrollSpeed: config.defaultScrollSpeed,
            isFirstRun: false,
            topicList: JSON.stringify([]),
            latestPage: 0,
            visitedTopics: JSON.stringify([])
        };

        Object.entries(defaultVals).forEach(([key, val]) => {
            if (GM_getValue(key) === undefined) {
                GM_setValue(key, val);
            }
        });

        const currentTime = Date.now();
        const storedTime = GM_getValue("clickCounterTimestamp") || new Date("1999-01-01T00:00:00Z").getTime();

        if (currentTime - storedTime > 24 * 60 * 60 * 1000) {
            GM_setValue("clickCounter", 0);
            GM_setValue("clickCounterTimestamp", currentTime);
            GM_setValue("visitedTopics", JSON.stringify([]));
        }

        let visitedTopics = JSON.parse(GM_getValue("visitedTopics") || "[]");
        if (visitedTopics.length > config.visitedTopicsLimit) {
            visitedTopics = visitedTopics.slice(-config.visitedTopicsLimit);
            GM_setValue("visitedTopics", JSON.stringify(visitedTopics));
        }
    }

    // 创建控制面板（核心修改区域）
    function createUIPanel() {
        removeExistingElements();

        // 样式优化：给最小化面板添加点击光标和居中图标
        GM_addStyle(`
            #autoReadPanel {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                position: fixed !important;
                bottom: ${GM_getValue('panelBottom', 30)}px !important;
                left: ${GM_getValue('panelLeft', 30)}px !important;
                z-index: 2147483647 !important;
                background: var(--panel-bg, rgba(255, 255, 255, 0.98)) !important;
                border-radius: 16px !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
                padding: 20px !important;
                width: 320px !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                border: 1px solid rgba(0, 0, 0, 0.08) !important;
                backdrop-filter: blur(10px) !important;
                transform: none !important;
                color: var(--text-color, #333) !important;
                cursor: default !important; /* 默认光标 */
            }

            /* 适配深色模式 */
            @media (prefers-color-scheme: dark) {
                #autoReadPanel {
                    --panel-bg: rgba(30, 30, 30, 0.98) !important;
                    --text-color: #fff !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }
            }

            /* 核心修改1：最小化面板样式优化 + 点击光标 */
            #autoReadPanel.minimized {
                width: 50px !important;
                height: 50px !important;
                padding: 0 !important;
                overflow: hidden !important;
                cursor: pointer !important; /* 点击光标提示 */
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                color: white !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            }

            #autoReadPanel.minimized::after {
                content: "📖" !important; /* 最小化后显示阅读图标 */
            }

            #autoReadPanel.minimized .panel-body {
                display: none !important;
            }

            #autoReadPanel.minimized .panel-header {
                display: none !important;
            }

            #showPanelBtn {
                display: flex !important;
                position: fixed !important;
                bottom: 20px !important;
                left: 20px !important;
                width: 50px !important;
                height: 50px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                border: none !important;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2) !important;
                cursor: pointer !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                z-index: 2147483646 !important;
            }

            .btn {
                padding: 8px 16px !important;
                border-radius: 8px !important;
                border: none !important;
                cursor: pointer !important;
                font-size: 14px !important;
                transition: all 0.2s ease !important;
                margin: 4px 0 !important;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                width: 100% !important;
            }

            .btn-secondary {
                background: rgba(0,0,0,0.05) !important;
                color: var(--text-color, #333) !important;
                width: 100% !important;
            }

            .btn:hover {
                opacity: 0.9 !important;
                transform: translateY(-1px) !important;
            }

            .speed-preset-btn {
                margin: 2px !important;
                padding: 4px 8px !important;
                font-size: 12px !important;
            }

            .speed-preset-btn.active {
                background: #667eea !important;
                color: white !important;
            }

            #pauseReadBtn {
                background: #ff6b6b !important;
                color: white !important;
                margin-top: 8px !important;
            }

            .progress-bar {
                height: 8px !important;
                background: rgba(0,0,0,0.1) !important;
                border-radius: 4px !important;
                overflow: hidden !important;
                margin: 8px 0 !important;
            }

            .progress-fill {
                height: 100% !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                transition: width 0.3s ease !important;
            }

            .status-indicator {
                display: inline-block !important;
                width: 10px !important;
                height: 10px !important;
                border-radius: 50% !important;
                margin-right: 8px !important;
            }

            .status-active {
                background: #48bb78 !important;
            }

            .status-inactive {
                background: #e53e3e !important;
            }
        `);

        // 创建主面板
        const panel = document.createElement('div');
        panel.id = 'autoReadPanel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3 class="panel-title" style="margin:0 0 16px 0 !important;">
                    <span class="status-indicator ${GM_getValue("read") ? 'status-active' : 'status-inactive'}"></span>
                    <span>自动阅读控制</span>
                </h3>
                <div class="panel-controls" style="position:absolute;top:20px;right:20px;">
                    <button class="panel-btn minimize-btn" title="最小化" style="border:none;background:none;cursor:pointer;margin:0 4px;">−</button>
                    <button class="panel-btn close-btn" title="隐藏面板" style="border:none;background:none;cursor:pointer;margin:0 4px;">×</button>
                </div>
            </div>
            <div class="panel-body">
                <div class="control-group" style="margin-bottom:12px;">
                    <div class="btn-group" style="display:flex;gap:8px;">
                        <button id="toggleReadBtn" class="btn btn-primary">
                            ${GM_getValue("read") ? '停止阅读' : '开始阅读'}
                        </button>
                    </div>
                    <button id="pauseReadBtn" class="btn" style="display:${GM_getValue("read") ? 'block' : 'none'}">
                        暂停阅读
                    </button>
                </div>

                <div class="speed-control" id="speedControl" style="margin-bottom:12px;">
                    <div class="progress-label" style="display:flex;justify-content:space-between;margin-bottom:4px;">
                        <span>滚动速度控制</span>
                        <span class="speed-value" id="speedValueDisplay">${GM_getValue("scrollSpeed") || config.defaultScrollSpeed}</span>
                    </div>
                    <div class="speed-slider-container" style="display:flex;align-items:center;gap:8px;">
                        <span style="color: #718096; font-size: 12px;">1</span>
                        <input type="range" min="${config.minScrollSpeed}" max="${config.maxScrollSpeed}"
                               value="${GM_getValue("scrollSpeed") || config.defaultScrollSpeed}"
                               step="${config.scrollStep}"
                               class="speed-slider" id="speedSlider" style="flex:1;">
                        <span style="color: #718096; font-size: 12px;">200</span>
                    </div>
                    <div class="speed-labels" style="display:flex;justify-content:space-between;margin:4px 0;font-size:12px;color:#718096;">
                        <span>超慢</span>
                        <span>慢</span>
                        <span>中</span>
                        <span>快</span>
                        <span>超快</span>
                    </div>
                    <div class="speed-presets" style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap;">
                        <button class="speed-preset-btn btn" data-speed="10">慢速 (10)</button>
                        <button class="speed-preset-btn btn" data-speed="40">中速 (40)</button>
                        <button class="speed-preset-btn btn" data-speed="80">快速 (80)</button>
                        <button class="speed-preset-btn btn" data-speed="150">极速 (150)</button>
                    </div>
                </div>

                <div class="control-group" style="margin-bottom:12px;">
                    <button id="toggleLikeBtn" class="btn btn-secondary">
                        ${GM_getValue("autoLikeEnabled") ? '禁用自动点赞' : '启用自动点赞'}
                    </button>
                </div>

                <div class="progress-container" id="likeProgressContainer" style="${GM_getValue("autoLikeEnabled") ? '' : 'display: none;'}">
                    <div class="progress-label" style="display:flex;justify-content:space-between;margin-bottom:4px;">
                        <span>今日点赞进度</span>
                        <span id="likeProgressText">${GM_getValue("clickCounter") || 0}/${config.likeLimit}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="likeProgressFill"
                             style="width: ${(GM_getValue("clickCounter") || 0) / config.likeLimit * 100}%"></div>
                    </div>
                </div>

                <div class="stats" style="margin-top:16px;font-size:12px;color:#718096;">
                    <div style="margin-bottom:4px;">
                        <span class="site-indicator" style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color: ${getSiteColor(BASE_URL)};margin-right:4px;"></span>
                        <span>当前站点: ${BASE_URL.replace('https://', '')}</span>
                    </div>
                    <div id="pageStatus">准备就绪</div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 创建显示面板的浮动按钮
        const showPanelBtn = document.createElement('button');
        showPanelBtn.id = 'showPanelBtn';
        showPanelBtn.innerHTML = '⚙️';
        showPanelBtn.style.display = 'none';
        document.body.appendChild(showPanelBtn);

        // 拖拽功能
        makeDraggable(panel);

        // ========== 核心修改2：最小化/展开逻辑 ==========
        // 1. 最小化按钮点击事件
        panel.querySelector('.minimize-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡到面板
            panel.classList.toggle('minimized');
            updateStatus(panel.classList.contains('minimized') ? '面板已最小化（点击恢复）' : '面板已展开');
        });

        // 2. 最小化面板点击展开事件（关键修复）
        panel.addEventListener('click', () => {
            if (panel.classList.contains('minimized')) {
                panel.classList.remove('minimized');
                updateStatus('面板已展开');
            }
        });

        // 3. 关闭按钮事件
        panel.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
            showPanelBtn.style.display = 'flex';
            updateStatus('面板已隐藏（点击浮动按钮恢复）');
        });

        // 4. 浮动按钮展开面板
        showPanelBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            showPanelBtn.style.display = 'none';
            updateStatus('面板已恢复显示');
        });

        // 其他事件监听
        document.getElementById('toggleReadBtn').addEventListener('click', toggleRead);
        document.getElementById('toggleLikeBtn').addEventListener('click', toggleAutoLike);

        // 暂停/继续按钮逻辑
        const pauseBtn = document.getElementById('pauseReadBtn');
        pauseBtn.addEventListener('click', () => {
            const isPaused = pauseBtn.textContent === '继续阅读';
            if (isPaused) {
                startScrolling();
                pauseBtn.textContent = '暂停阅读';
                updateStatus('已继续自动阅读');
            } else {
                stopScrolling(true);
                pauseBtn.textContent = '继续阅读';
                updateStatus('已暂停自动阅读');
            }
        });

        // 速度控制逻辑
        const speedSlider = document.getElementById('speedSlider');
        const speedValueDisplay = document.getElementById('speedValueDisplay');
        speedSlider.addEventListener('input', () => {
            const speed = parseInt(speedSlider.value);
            speedValueDisplay.textContent = speed;
            GM_setValue("scrollSpeed", speed);
            updatePresetHighlight(speed);

            if (GM_getValue("read") && scrollInterval && !isReadPaused) {
                stopScrolling();
                startScrolling();
            }

            updateStatus(`滚动速度已设置为: ${speed}`);
        });

        document.querySelectorAll('.speed-preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const speed = parseInt(this.dataset.speed);
                speedSlider.value = speed;
                speedValueDisplay.textContent = speed;
                GM_setValue("scrollSpeed", speed);
                speedSlider.dispatchEvent(new Event('input', { bubbles: true }));
                updateStatus(`已设置预设速度: ${speed}`);
            });
        });

        const currentSpeed = GM_getValue("scrollSpeed") || config.defaultScrollSpeed;
        updatePresetHighlight(currentSpeed);

        panel.style.zIndex = '2147483647';
    }

    // 辅助函数
    function removeExistingElements() {
        ['#autoReadPanel', '#showPanelBtn', 'style[data-auto-read-style]'].forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.remove();
        });
    }

    function updatePresetHighlight(speed) {
        const presets = [10, 40, 80, 150];
        const closestPreset = presets.reduce((prev, curr) =>
            Math.abs(curr - speed) < Math.abs(prev - speed) ? curr : prev
        );
        document.querySelectorAll('.speed-preset-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.speed) === closestPreset);
        });
    }

    function getSiteColor(url) {
        const colors = {
            'www.nodeloc.com': '#FF6B6B',
            'linux.do': '#4ECDC4',
            'meta.discourse.org': '#45B7D1',
            'meta.appinn.net': '#FFA07A',
            'community.openai.com': '#9B59B6'
        };
        return colors[url.replace('https://', '')] || '#95a5a6';
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.panel-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const top = element.offsetTop - pos2;
            const left = element.offsetLeft - pos1;

            element.style.top = `${top}px`;
            element.style.left = `${left}px`;

            GM_setValue('panelTop', top);
            GM_setValue('panelLeft', left);
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            GM_setValue('panelBottom', window.innerHeight - element.offsetTop - element.offsetHeight);
            GM_setValue('panelLeft', element.offsetLeft);
        }
    }

    function toggleRead() {
        const currentlyReading = GM_getValue("read");
        const newReadState = !currentlyReading;
        GM_setValue("read", newReadState);

        const btn = document.getElementById('toggleReadBtn');
        const pauseBtn = document.getElementById('pauseReadBtn');
        const statusIndicator = document.querySelector('.panel-header .status-indicator');

        btn.textContent = newReadState ? '停止阅读' : '开始阅读';
        statusIndicator.className = `status-indicator ${newReadState ? 'status-active' : 'status-inactive'}`;
        pauseBtn.style.display = newReadState ? 'block' : 'none';

        updateStatus(newReadState ? '自动阅读已启动' : '自动阅读已停止');

        if (!newReadState) {
            stopScrolling();
            isReadPaused = false;
            pauseBtn.textContent = '暂停阅读';
        } else {
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/t/') || currentPath === '/t/topic/54798/1') {
                window.location.href = `${BASE_URL}/latest`;
            }
            startScrolling();
        }
    }

    function toggleAutoLike() {
        const currentlyEnabled = GM_getValue("autoLikeEnabled");
        const newEnabledState = !currentlyEnabled;
        GM_setValue("autoLikeEnabled", newEnabledState);

        const btn = document.getElementById('toggleLikeBtn');
        const progressContainer = document.getElementById('likeProgressContainer');

        btn.textContent = newEnabledState ? '禁用自动点赞' : '启用自动点赞';
        progressContainer.style.display = newEnabledState ? 'block' : 'none';

        updateStatus(newEnabledState ? '自动点赞已启用' : '自动点赞已禁用');

        if (newEnabledState) {
            autoLike();
        } else {
            stopAutoLike();
        }
    }

    function updateStatus(message) {
        const statusElement = document.getElementById('pageStatus');
        if (statusElement) {
            statusElement.textContent = message;
            console.log(`[AutoRead] ${message}`);
        }
    }

    // 滚动控制
    let scrollInterval = null;
    let checkScrollTimeout = null;
    let autoLikeInterval = null;
    let isReadPaused = false;

    function startScrolling() {
        if (isReadPaused) return;
        if (scrollInterval) clearInterval(scrollInterval);

        const baseSpeed = GM_getValue("scrollSpeed") || config.defaultScrollSpeed;

        scrollInterval = setInterval(() => {
            const randomSpeed = baseSpeed + (Math.random() * config.scrollSpeedRandomRange * 2 - config.scrollSpeedRandomRange);
            window.scrollBy(0, Math.max(1, Math.round(randomSpeed)));
        }, config.scrollDelay);

        checkScroll();
    }

    function stopScrolling(isPause = false) {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
        if (checkScrollTimeout) {
            clearTimeout(checkScrollTimeout);
            checkScrollTimeout = null;
        }
        isReadPaused = isPause;
    }

    function checkScroll() {
        if (!GM_getValue("read") || isReadPaused) return;

        const isAtBottom = () => {
            const scrollPosition = window.scrollY || window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            return (windowHeight + scrollPosition >= documentHeight - 200) || (documentHeight <= windowHeight + 300);
        };

        if (isAtBottom()) {
            updateStatus('已到达页面底部，正在准备下一篇文章...');
            stopScrolling();

            setTimeout(async () => {
                const success = await openNewTopic();
                if (!success) {
                    updateStatus(`获取新文章失败，${config.retryDelay/1000}秒后重试...`);
                    setTimeout(() => {
                        if (GM_getValue("read")) checkScroll();
                    }, config.retryDelay);
                }
            }, 800);
        } else {
            if (checkScrollTimeout) clearTimeout(checkScrollTimeout);
            checkScrollTimeout = setTimeout(checkScroll, config.checkDelay);
        }
    }

    async function openNewTopic() {
        try {
            let topicList = JSON.parse(GM_getValue("topicList") || "[]");
            let visitedTopics = JSON.parse(GM_getValue("visitedTopics") || "[]");

            topicList = topicList.filter(topic => !visitedTopics.includes(topic.id));

            if (topicList.length === 0) {
                updateStatus('正在获取最新文章列表...');
                await getLatestTopic();
                topicList = JSON.parse(GM_getValue("topicList") || "[]");
                topicList = topicList.filter(topic => !visitedTopics.includes(topic.id));

                if (topicList.length === 0) {
                    updateStatus('没有未访问的新文章，正在加载下一页...');
                    GM_setValue("latestPage", parseInt(GM_getValue("latestPage")) + 1);
                    await getLatestTopic();
                    topicList = JSON.parse(GM_getValue("topicList") || "[]");
                    topicList = topicList.filter(topic => !visitedTopics.includes(topic.id));

                    if (topicList.length === 0) {
                        updateStatus('暂无更多新文章');
                        return false;
                    }
                }
            }

            const topic = topicList.shift();
            GM_setValue("topicList", JSON.stringify(topicList));

            visitedTopics.push(topic.id);
            GM_setValue("visitedTopics", JSON.stringify(visitedTopics));

            const topicUrl = `${BASE_URL}/t/${topic.slug || topic.id}/${topic.id}${topic.last_read_post_number ? '/' + topic.last_read_post_number : ''}`;

            window.location.href = topicUrl;
            return true;
        } catch (error) {
            console.error('[AutoRead] 跳转失败:', error);
            updateStatus(`跳转出错: ${error.message.substring(0, 50)}`);
            return false;
        }
    }

    async function getLatestTopic() {
        try {
            let latestPage = parseInt(GM_getValue("latestPage") || 0);
            let topicList = JSON.parse(GM_getValue("topicList") || "[]");
            latestPage++;

            const url = `${BASE_URL}/latest.json?no_definitions=true&page=${latestPage}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }

            const result = await response.json();

            if (result?.topic_list?.topics?.length > 0) {
                const newTopics = result.topic_list.topics
                    .filter(topic => config.commentLimit > topic.posts_count)
                    .filter(topic => !topic.closed);

                topicList = [...topicList, ...newTopics].slice(0, config.topicListLimit);
                GM_setValue("topicList", JSON.stringify(topicList));
                GM_setValue("latestPage", latestPage);
                updateStatus(`已加载第${latestPage}页，共${topicList.length}篇文章`);
            }
        } catch (error) {
            console.error('[AutoRead] 获取话题列表失败:', error);
            updateStatus(`获取列表失败: ${error.message.substring(0, 50)}`);
            const retryCount = GM_getValue('fetchRetryCount', 0);
            if (retryCount < config.maxRetries) {
                GM_setValue('fetchRetryCount', retryCount + 1);
                setTimeout(getLatestTopic, config.retryDelay);
            } else {
                GM_setValue('fetchRetryCount', 0);
            }
        }
    }

    function autoLike() {
        const clickCounter = GM_getValue("clickCounter") || 0;
        if (clickCounter >= config.likeLimit) {
            updateStatus(`今日点赞已达上限 (${config.likeLimit})`);
            GM_setValue("autoLikeEnabled", false);
            document.getElementById('toggleLikeBtn').textContent = '启用自动点赞';
            document.getElementById('likeProgressContainer').style.display = 'none';
            return;
        }

        const likeButtons = Array.from(document.querySelectorAll(
            '.discourse-reactions-reaction-button:not(.reacted), .like-button:not(.liked)'
        )).filter(btn => {
            const rect = btn.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        });

        if (likeButtons.length === 0) {
            updateStatus('未找到可点赞的按钮，5秒后重试...');
            setTimeout(autoLike, 5000);
            return;
        }

        let likesPerformed = 0;

        likeButtons.forEach((button, index) => {
            const randomInterval = config.likeInterval + (Math.random() * config.likeIntervalRandomRange * 2 - config.likeIntervalRandomRange);

            setTimeout(() => {
                const currentCount = GM_getValue("clickCounter") || 0;
                if (currentCount >= config.likeLimit || !GM_getValue("autoLikeEnabled")) return;

                try {
                    button.focus();
                    button.click();
                    button.blur();

                    likesPerformed++;
                    const newCount = currentCount + 1;
                    GM_setValue("clickCounter", newCount);

                    const progressText = document.getElementById('likeProgressText');
                    const progressFill = document.getElementById('likeProgressFill');
                    if (progressText && progressFill) {
                        progressText.textContent = `${newCount}/${config.likeLimit}`;
                        progressFill.style.width = `${(newCount / config.likeLimit) * 100}%`;
                    }

                    updateStatus(`已点赞 ${likesPerformed}/${likeButtons.length} 个 (今日 ${newCount}/${config.likeLimit})`);

                    if (newCount >= config.likeLimit) {
                        updateStatus(`今日点赞已达上限 (${config.likeLimit})`);
                        GM_setValue("autoLikeEnabled", false);
                        document.getElementById('toggleLikeBtn').textContent = '启用自动点赞';
                        document.getElementById('likeProgressContainer').style.display = 'none';
                    }
                } catch (error) {
                    console.error('[AutoRead] 点赞失败:', error);
                }
            }, index * randomInterval);
        });

        const totalInterval = likeButtons.length * config.likeInterval + 5000;
        autoLikeInterval = setTimeout(autoLike, totalInterval);
    }

    function stopAutoLike() {
        if (autoLikeInterval) {
            clearTimeout(autoLikeInterval);
            autoLikeInterval = null;
        }
    }

    // 初始化
    function init() {
        initStorage();
        createUIPanel();

        setTimeout(() => {
            if (GM_getValue("read") && !isReadPaused) {
                startScrolling();
            }

            if (GM_getValue("autoLikeEnabled")) {
                autoLike();
            }
        }, 1000);
    }

    // 注册菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('打开控制面板', () => {
            const panel = document.getElementById('autoReadPanel');
            const showBtn = document.getElementById('showPanelBtn');
            if (panel) {
                panel.style.display = 'block';
                if (showBtn) showBtn.style.display = 'none';
            } else {
                createUIPanel();
            }
        });

        GM_registerMenuCommand('重置点赞计数器', () => {
            GM_setValue("clickCounter", 0);
            GM_setValue("clickCounterTimestamp", Date.now());
            updateStatus('点赞计数器已重置');

            const progressText = document.getElementById('likeProgressText');
            const progressFill = document.getElementById('likeProgressFill');
            if (progressText && progressFill) {
                progressText.textContent = `0/${config.likeLimit}`;
                progressFill.style.width = '0%';
            }
        });

        GM_registerMenuCommand('清空已访问文章记录', () => {
            GM_setValue("visitedTopics", JSON.stringify([]));
            updateStatus('已清空已访问文章记录');
        });
    }

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
        setTimeout(init, 2000);
    }

    // 强制检查面板加载
    setTimeout(() => {
        if (!document.getElementById('autoReadPanel')) {
            console.warn('[AutoRead] 面板未正常加载，正在强制创建...');
            createUIPanel();
        }
    }, 5000);

    // 清理定时器
    window.addEventListener('beforeunload', () => {
        stopScrolling();
        stopAutoLike();
    });
})();