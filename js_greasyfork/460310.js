// ==UserScript==
// @name         Microsoft Rewards助手
// @version      4.0.0
// @description  自动完成Microsoft Rewards必应搜索任务，基于Async/Await重构，模拟真人操作，支持SPA，状态记忆。
// @author       Sentaku1129
// @match        *://*.bing.com/*
// @license      GUN GPLv3
// @icon         https://www.bing.com/favicon.ico
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/1029902
// @downloadURL https://update.greasyfork.org/scripts/460310/Microsoft%20Rewards%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460310/Microsoft%20Rewards%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 解析积分数据
    function parseRewardsFromDoc(doc) {
        const cards = doc.querySelectorAll('.promo_cont');
        if (!cards.length) return null;

        let pc = { c: 0, m: 0 }, mb = { c: 0, m: 0 };

        cards.forEach(card => {
            const text = card.innerText;
            const isMobile = text.includes('移动') || text.includes('Mobile');
            const row = card.querySelector('.daily_search_row');

            // 1. 未完成 (进度条)
            if (row) {
                const match = row.innerText.match(/(\d+)\s*\/\s*(\d+)/);
                if (match) {
                    const [_, current, max] = match.map(Number);
                    if (isMobile || max === 60) mb = { c: current, m: max };
                    else pc = { c: current, m: max };
                }
                return;
            }

            // 2. 已完成
            if (text.includes('已获得') || text.includes('earned')) {
                const match = text.match(/(\d+)/);
                if (match) {
                    const points = parseInt(match[1]);
                    if (isMobile || points === 60) mb = { c: points, m: points };
                    else if (points >= 90) pc = { c: points, m: points };
                }
            }
        });

        return { pc, mb };
    }

    // Iframe 通信处理
    if (window.self !== window.top) {
        window.addEventListener('message', (e) => {
            if (e.data === 'REQUEST_REWARDS_DATA') {
                const result = parseRewardsFromDoc(document);
                if (result) window.top.postMessage({ type: 'REWARDS_DATA_RESPONSE', payload: result }, '*');
            }
        });
        return;
    }

    // --- 工具函数 ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const randomSleep = (min, max) => sleep(Math.floor(Math.random() * (max - min + 1) + min) * 1000);

    // --- 主题配置 ---
    const theme = {
        main: "#0078d4",
        accent: "#4CAF50",
        error: "#f44336",
        bg: "rgba(255, 255, 255, 0.95)",
        fg: "#333",
        border: "#e0e0e0",
        shadow: "0 8px 30px rgba(0,0,0,0.12)",
        font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
    };

    // --- 默认配置与状态 ---
    const DEFAULT_CONFIG = {
        restTime: 5 * 60, // 5分钟
        scrollTime: 8,    // 滚动持续时间
        waitTime: 10,     // 搜索间隔
        maxNoProgress: 3, // 最大无进度次数
        randomTime: 5     // 随机时间偏移(秒)
    };

    let state = {
        isSearching: false,
        isCollapsed: true,
        usedTerms: [],
        termsPool: [],
        progress: { current: 0, total: 0, lastChecked: 0, noProgressCount: 0, completed: false },
        rewards: { balance: "---", today: 0, limit: 0, pc: { c: 0, m: 0 }, mobile: { c: 0, m: 0 } },
        config: { ...DEFAULT_CONFIG },
        timer: null
    };

    const STORAGE_KEY_CONFIG = 'rewardsHelper_config_v3.4';
    const STORAGE_KEY_TASK = 'rewardsHelper_task_v3.4';
    const FALLBACK_WORDS = [
        "天气", "新闻", "壁纸", "翻译", "地图", "汇率", "日历", "计算器", "电影", "音乐", "NBA", "游戏", "美食", "旅游", "股票", "小说", "科技", "数码", "汽车", "房产",
        "Python教程", "Java入门", "C++编程", "Linux命令", "Docker容器", "Kubernetes", "人工智能", "机器学习", "深度学习", "神经网络",
        "唐诗三百首", "宋词精选", "红楼梦", "三国演义", "水浒传", "西游记", "鲁迅全集", "金庸小说", "古龙小说", "科幻小说",
        "宫保鸡丁做法", "红烧肉食谱", "清蒸鱼技巧", "火锅底料", "奶茶制作", "咖啡冲泡", "烘焙入门", "健康饮食", "减肥食谱", "素食主义",
        "北京旅游攻略", "上海景点", "广州美食", "深圳科技园", "成都火锅", "重庆夜景", "西安兵马俑", "杭州西湖", "苏州园林", "三亚海滩"
    ];

    // --- 持久化存储 ---
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({
                isCollapsed: state.isCollapsed,
                config: state.config
            }));
            sessionStorage.setItem(STORAGE_KEY_TASK, JSON.stringify({
                isSearching: state.isSearching,
                usedTerms: state.usedTerms.slice(-50)
            }));
        } catch (e) { console.error("保存状态失败", e); }
    }

    function loadState() {
        try {
            const savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY_CONFIG));
            if (savedConfig) {
                state.isCollapsed = savedConfig.isCollapsed || false;
                if (savedConfig.config) state.config = { ...DEFAULT_CONFIG, ...savedConfig.config };
            }
            const savedTask = JSON.parse(sessionStorage.getItem(STORAGE_KEY_TASK));
            if (savedTask) {
                state.isSearching = savedTask.isSearching || false;
                state.usedTerms = savedTask.usedTerms || [];
            }
        } catch (e) { console.error("读取状态失败", e); }
    }

    // --- 核心逻辑：积分获取 ---
    async function fetchRewards() {
        logStatus('查询积分中...');

        // 尝试获取总分
        for (let i = 0; i < 5; i++) {
            const el = document.querySelector('#id_rc, .points-container');
            if (el) {
                state.rewards.balance = el.innerText;
                updateUI();
                break;
            }
            await sleep(500);
        }

        return new Promise((resolve) => {
            // 查找挂件
            let widget = null;
            const findWidget = setInterval(() => {
                widget = document.querySelector('.b_clickarea, #id_rh');
                if (widget) {
                    clearInterval(findWidget);
                    startProcess();
                }
            }, 500);

            setTimeout(() => {
                if (!widget) {
                    clearInterval(findWidget);
                    logStatus('未找到积分挂件');
                    resolve();
                }
            }, 5000);

            function startProcess() {
                const flyout = document.getElementById('rewid-f');
                const isVisible = flyout && flyout.style.display !== 'none' && flyout.style.visibility !== 'hidden';

                if (!isVisible) {
                    // 仅在搜索页或首页点击
                    const isSearch = location.search.includes('q=') || location.pathname.includes('/search');
                    if (state.isSearching || !isSearch) {
                        logStatus('展开积分面板...');
                        widget.click();
                        setTimeout(() => parseCards(isVisible), 2000);
                    } else {
                        resolve();
                    }
                } else {
                    parseCards(isVisible);
                }
            }

            function parseCards(wasVisible) {
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    attempts++;
                    const iframe = document.querySelector('#rewid-f iframe');

                    if (iframe) {
                        // 尝试直接读取
                        try {
                            const doc = iframe.contentDocument || iframe.contentWindow.document;
                            const result = parseRewardsFromDoc(doc);
                            if (result) return handleSuccess(result);
                        } catch (e) {}

                        // 尝试PostMessage
                        iframe.contentWindow.postMessage('REQUEST_REWARDS_DATA', '*');
                    }

                    if (attempts > 20) {
                        clearInterval(checkInterval);
                        window.removeEventListener('message', messageHandler);
                        logStatus('查询超时');
                        resolve();
                    }
                }, 500);

                const messageHandler = (e) => {
                    if (e.data.type === 'REWARDS_DATA_RESPONSE') handleSuccess(e.data.payload);
                };
                window.addEventListener('message', messageHandler);

                function handleSuccess(data) {
                    clearInterval(checkInterval);
                    window.removeEventListener('message', messageHandler);

                    const { pc, mb } = data;
                    const balanceEl = document.querySelector('#id_rc, .points-container');

                    state.rewards.balance = balanceEl ? balanceEl.innerText : "---";
                    state.rewards.pc = pc;
                    state.rewards.mobile = mb;
                    state.rewards.today = pc.c + mb.c;
                    state.rewards.limit = pc.m + mb.m;

                    logStatus(`积分: ${state.rewards.today}/${state.rewards.limit} (PC:${pc.c}/${pc.m})`);

                    if (state.isSearching) {
                        if (state.rewards.limit > 0 && state.rewards.today >= state.rewards.limit) {
                            logStatus("任务已完成！");
                            toggleSearch();
                        } else if (pc.m > 0 && pc.c >= pc.m && mb.c < mb.m) {
                            logStatus("PC完成，尝试移动端...");
                        }
                    }

                    updateUI();
                    if (!wasVisible) widget.click(); // 恢复状态
                    resolve();
                }
            }
        });
    }

    // --- 核心逻辑：数据获取 ---
    function grabSearchTerms() {
        const suggestElements = document.querySelectorAll('.richrsrailsuggestion_text, .sa_tm_text, .sa_sg .sa_tm');
        const pageTerms = Array.from(suggestElements).map(el => el.innerText).filter(t => t);

        let iframeTerms = [];
        const iframe = document.querySelector('iframe#b_context');
        if (iframe) {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const spans = doc.querySelectorAll('.ss_items_wrapper span');
                iframeTerms = Array.from(spans).map(s => s.innerText).filter(t => t);
            } catch (e) {}
        }

        state.termsPool = [...new Set([...pageTerms, ...iframeTerms, ...FALLBACK_WORDS])];
        updateUI();
    }

    function getNextTerm() {
        const available = state.termsPool.filter(t => !state.usedTerms.includes(t));
        if (available.length === 0) {
            return `Bing搜索 ${Math.floor(Math.random() * 10000)}`;
        }
        return available[Math.floor(Math.random() * available.length)];
    }

    // --- 核心逻辑：模拟操作 ---
    async function performSearch(term) {
        const input = document.getElementById('sb_form_q');
        const form = document.getElementById('sb_form');
        if (!input || !form) return false;

        input.value = term;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(300);

        const submitBtn = document.getElementById('sb_form_go') || document.querySelector('label[for="sb_form_go"]');
        const beforeUrl = location.href;
        state.usedTerms.push(term);
        saveState();

        if (form.target === '_blank') form.target = '_self';

        if (submitBtn) submitBtn.click();
        else form.submit();

        return new Promise(resolve => {
            let checks = 0;
            const checker = setInterval(() => {
                checks++;
                if (location.href !== beforeUrl) {
                    clearInterval(checker);
                    resolve(true);
                }
                if (checks > 20) {
                    clearInterval(checker);
                    resolve(true);
                }
            }, 500);
        });
    }

    async function simulateHumanScroll() {
        logStatus('模拟浏览中...');
        const baseTime = state.config.scrollTime;
        const randomAdd = Math.floor(Math.random() * (state.config.randomTime + 1));
        const totalTime = baseTime + randomAdd;
        const startTime = Date.now();

        while (Date.now() - startTime < totalTime * 1000) {
            const direction = Math.random() > 0.3 ? 1 : -1;
            const distance = Math.floor(Math.random() * 400) + 100;

            window.scrollBy({ top: distance * direction, behavior: 'smooth' });
            updateCountdown(Math.ceil((totalTime * 1000 - (Date.now() - startTime)) / 1000), '浏览页面');
            await sleep(1500 + Math.random() * 1500);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- 自动化主流程 ---
    async function runLoop() {
        if (!state.isSearching) return;

        logStatus("正在检查积分...");
        await fetchRewards();
        if (!state.isSearching) return;

        grabSearchTerms();
        const term = getNextTerm();
        logStatus(`准备搜索: ${term}`);

        if (state.config.randomTime > 0) await randomSleep(1, 3);

        await performSearch(term);
        await sleep(3000);

        if (state.isSearching) {
            logStatus("搜索后复查积分...");
            await fetchRewards();
            if (!state.isSearching) return;
        }

        if (state.isSearching) await simulateHumanScroll();

        if (state.isSearching) {
            const baseWait = state.config.waitTime;
            const randomAdd = Math.floor(Math.random() * (state.config.randomTime + 1));
            const totalWait = baseWait + randomAdd;

            for (let i = totalWait; i > 0; i--) {
                if (!state.isSearching) break;
                updateCountdown(i, '等待下次搜索');
                await sleep(1000);
            }
            if (state.isSearching) setTimeout(runLoop, 100);
        }
    }

    function toggleSearch() {
        state.isSearching = !state.isSearching;
        saveState();
        updateUI();
        if (state.isSearching) {
            runLoop();
        } else {
            logStatus("已停止");
            updateCountdown(0, "");
        }
    }

    // --- UI 构建与更新 ---
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            #rh-container {
                position: fixed; top: 80px; right: 20px; width: 300px;
                background: ${theme.bg}; backdrop-filter: blur(10px);
                border: 1px solid ${theme.border}; border-radius: 12px;
                box-shadow: ${theme.shadow}; z-index: 99999;
                font-family: ${theme.font}; font-size: 14px; color: ${theme.fg};
                transition: all 0.3s ease; overflow: hidden;
            }
            #rh-header {
                background: ${theme.main}; color: white; padding: 12px 16px;
                font-weight: 600; display: flex; justify-content: space-between;
                align-items: center; cursor: move; user-select: none;
            }
            #rh-content { padding: 16px; }
            .rh-btn {
                width: 100%; padding: 10px; border: none; border-radius: 8px;
                font-weight: 600; cursor: pointer; transition: 0.2s; margin-top: 10px;
            }
            .rh-btn.start { background: ${theme.main}; color: white; }
            .rh-btn.start:hover { background: #0063b1; }
            .rh-btn.stop { background: ${theme.error}; color: white; }
            .rh-btn.stop:hover { background: #d32f2f; }
            .rh-row { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center;}
            .rh-input { width: 50px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; text-align: center; }
            .rh-status { font-size: 12px; color: #666; margin-top: 5px; min-height: 1.5em;}
            .rh-tag { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #555; margin-right: 4px; display: inline-block;}
            .hidden { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    function createUI() {
        injectStyles();
        const container = document.createElement('div');
        container.id = 'rh-container';
        container.innerHTML = `
            <div id="rh-header">
                <span>🏆 Rewards 助手 Pro</span>
                <div style="display:flex;gap:10px;">
                    <span id="rh-toggle" style="cursor:pointer;font-size:18px;">－</span>
                    <span id="rh-close" style="cursor:pointer;font-size:18px;">×</span>
                </div>
            </div>
            <div id="rh-content">
                <div class="rh-row">
                    <span>运行状态</span>
                    <span id="rh-state-text" style="font-weight:bold;color:${theme.main}">待机</span>
                </div>
                <div class="rh-row">
                    <span>当前积分</span>
                    <span id="rh-points" style="font-weight:bold;color:#E65100">---</span>
                </div>
                <div class="rh-row">
                    <span>今日搜索</span>
                    <div style="flex:1;margin-left:10px;display:flex;flex-direction:column;justify-content:center;">
                        <div style="background:#eee;height:6px;border-radius:3px;overflow:hidden;">
                            <div id="rh-progress-bar" style="width:0%;height:100%;background:${theme.accent};transition:width 0.5s;"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:10px;margin-top:2px;">
                            <span id="rh-search-progress" style="font-weight:bold;color:#2E7D32">--- / ---</span>
                            <span id="rh-progress-percent">0%</span>
                        </div>
                    </div>
                </div>
                <div id="rh-countdown" class="rh-row" style="color:${theme.accent};font-weight:bold;display:none;">
                    ⏳ <span id="rh-countdown-text"></span>
                </div>
                <div class="rh-status" id="rh-log">就绪...</div>

                <div id="rh-settings">
                    <hr style="border:0;border-top:1px solid #eee;margin:10px 0;">
                    <div class="rh-row">
                        <label>搜索间隔(秒)</label>
                        <input type="number" id="cfg-wait" class="rh-input" value="${state.config.waitTime}">
                    </div>
                    <div class="rh-row">
                        <label>浏览时长(秒)</label>
                        <input type="number" id="cfg-scroll" class="rh-input" value="${state.config.scrollTime}">
                    </div>
                    <div class="rh-row">
                        <label>随机偏移(秒)</label>
                        <input type="number" id="cfg-random" class="rh-input" value="${state.config.randomTime}">
                    </div>
                </div>

                <button id="rh-action-btn" class="rh-btn start">开始任务</button>
            </div>
        `;
        document.body.appendChild(container);

        // 绑定事件
        const dragHeader = container.querySelector('#rh-header');
        makeDraggable(container, dragHeader);

        document.getElementById('rh-close').onclick = () => container.style.display = 'none';
        document.getElementById('rh-toggle').onclick = () => {
            state.isCollapsed = !state.isCollapsed;
            saveState();
            updateUI();
        };

        const actionBtn = document.getElementById('rh-action-btn');
        actionBtn.onclick = toggleSearch;

        // 配置绑定
        const bindInput = (id, key) => {
            const el = document.getElementById(id);
            el.onchange = () => {
                state.config[key] = parseInt(el.value) || DEFAULT_CONFIG[key];
                saveState();
            };
        };
        bindInput('cfg-wait', 'waitTime');
        bindInput('cfg-scroll', 'scrollTime');
        bindInput('cfg-random', 'randomTime');

        updateUI();
    }

    function updateUI() {
        const content = document.getElementById('rh-settings');
        const toggleBtn = document.getElementById('rh-toggle');
        const actionBtn = document.getElementById('rh-action-btn');
        const stateText = document.getElementById('rh-state-text');
        const pointsText = document.getElementById('rh-points');
        const progressText = document.getElementById('rh-search-progress');
        const progressBar = document.getElementById('rh-progress-bar');
        const progressPercent = document.getElementById('rh-progress-percent');

        if (state.isCollapsed) {
            content.classList.add('hidden');
            toggleBtn.textContent = '＋';
        } else {
            content.classList.remove('hidden');
            toggleBtn.textContent = '－';
        }

        // 更新积分显示
        if (pointsText) pointsText.textContent = state.rewards.balance;
        if (progressText && progressBar && progressPercent) {
            if (state.rewards.limit > 0) {
                const percent = Math.round((state.rewards.today / state.rewards.limit) * 100);
                progressText.textContent = `${state.rewards.today} / ${state.rewards.limit}`;
                progressBar.style.width = `${percent}%`;
                progressPercent.textContent = `${percent}%`;

                // 颜色变化：接近完成变绿，否则蓝色
                progressBar.style.background = percent >= 100 ? theme.accent : theme.main;

                // 悬浮显示详情
                const pc = state.rewards.pc;
                const mb = state.rewards.mobile;
                progressText.title = `PC: ${pc.c}/${pc.m} | Mobile: ${mb.c}/${mb.m}`;
                progressText.style.cursor = "help";
            } else {
                progressText.textContent = "--- / ---";
                progressBar.style.width = "0%";
                progressPercent.textContent = "0%";
            }
        }        if (state.isSearching) {
            actionBtn.textContent = "停止任务";
            actionBtn.className = "rh-btn stop";
            stateText.textContent = "运行中";
            stateText.style.color = theme.accent;
        } else {
            actionBtn.textContent = "开始任务";
            actionBtn.className = "rh-btn start";
            stateText.textContent = "待机";
            stateText.style.color = "#999";
        }
    }

    function logStatus(msg) {
        const el = document.getElementById('rh-log');
        if (el) el.textContent = msg;
    }

    function updateCountdown(sec, action) {
        const div = document.getElementById('rh-countdown');
        const text = document.getElementById('rh-countdown-text');
        if (sec > 0) {
            div.style.display = 'flex';
            text.textContent = `${action}: ${sec}s`;
        } else {
            div.style.display = 'none';
        }
    }

    function makeDraggable(el, handle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        handle.addEventListener('mousedown', e => {
            if (e.target !== handle && e.target.id !== 'rh-header') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            el.style.right = 'auto'; // 清除right定位，改用left
            el.style.left = initialLeft + 'px';
            el.style.top = initialTop + 'px';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = `${initialLeft + dx}px`;
            el.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    // --- 启动入口 ---
    window.addEventListener('load', () => {
        loadState();
        createUI();
        fetchRewards(); // 初始获取积分

        // 自动恢复运行 (如果是刷新页面导致的)
        if (state.isSearching) {
            logStatus("页面恢复，准备继续...");
            // 增加随机延迟，避免“瞬间”开始，模拟用户思考
            const delay = 2000 + Math.floor(Math.random() * (state.config.randomTime * 1000 + 1));
            setTimeout(runLoop, delay);
        }
    });

})();
