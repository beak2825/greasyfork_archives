// ==UserScript==
// @name         EnaeaAsst-学习公社16X速全自动(2026最新版)
// @namespace    http://tampermonkey.net/
// @version      3.13
// @license      MIT
// @description  A fully-featured, robust, and intelligent learning assistant for ENAEA. Handles all playback scenarios and errors gracefully.
// @author       beabaed@gmail.com, KKG&GM&CL
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do*
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540952/EnaeaAsst-%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE16X%E9%80%9F%E5%85%A8%E8%87%AA%E5%8A%A8%282026%E6%9C%80%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540952/EnaeaAsst-%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE16X%E9%80%9F%E5%85%A8%E8%87%AA%E5%8A%A8%282026%E6%9C%80%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Release notes:
    // 3.13: Added passive mode toggle and playback-stable gating to avoid autoplay interference.

    // =================================================================
    // --- 1. 配置区 (CONSTANTS) ---
    // =================================================================
    const CONFIG = {
        TICK_INTERVAL: 3000,                 // 主循环心跳间隔（毫秒）
        PLAY_DEBOUNCE_PERIOD: 5000,          // 播放指令的防抖冷却时间（毫秒）
        MAX_PLAY_ATTEMPTS: 20,               // 单个视频播放失败的最大尝试次数
        MAX_COURSE_FAILURES: 3,              // 单个课程被熔断的最大次数
        STATE_STORAGE_KEY: 'enaea_helper_state_v9_0',       // 用户设置的永久状态存储Key
        STATUS_FLAG_KEY: 'enaea_helper_task_status_v9_0',   // 用于跨页面通信的状态旗帜Key
        STATUS_TIMESTAMP_KEY: 'enaea_helper_task_status_ts_v9_0', // 状态更新时间戳Key
        PANEL_POSITION_KEY: 'enaea_helper_panel_position_v3_05', // 面板位置存储Key
        FAILED_COURSES_KEY: 'enaea_helper_failed_courses_v9_4',// 熔断失败课程的计数器存储Key
        SPEED_TIERS: [16.0, 10.0, 8.0, 4.0, 2.0], // 速度阶梯
        FORCE_MUTED_ON_AUTOPLAY_BLOCK: true, // 自动播放被拦截时是否强制静音尝试
        DEFAULT_VOLUME: 0.4, // 自动播放正常后恢复的音量
        STUDYING_TIMEOUT_MS: 5 * 60 * 1000, // 学习状态超时时间（毫秒）
        STUDYING_RECENT_GRACE_MS: 10 * 1000, // 目录页检测到最近学习时的宽限时间（毫秒）
        USER_SWITCH_GRACE_MS: 8 * 1000, // 用户手动切换视频的豁免窗口
        AUTOPLAY_INIT_GRACE_MS: 8 * 1000, // 课程打开后等待播放器自动开始的宽限时间
        PASSIVE_PLAY_STABLE_MS: 3 * 1000, // 被动模式下等待播放稳定的时间
        PROGRESS_STALL_GRACE_MS: 12 * 1000, // 进度刚更新后的等待窗口，避免误判暂停
        TIME_STALL_GRACE_MS: 6 * 1000, // currentTime 无变化的等待窗口，避免误判暂停
        STALL_TRIGGER_MS: 20 * 1000, // 无明显播放活动后的强制尝试阈值
        AUTOPLAY_BLOCK_COOLDOWN_MS: 10 * 1000, // 自动播放被拦截后的冷却期
        PAUSE_CONFIRM_GRACE_MS: 6 * 1000, // 暂停事件后的观察窗口
        VIDEO_PAGE_IDENTIFIER: 'viewerforccvideo.do',        // 视频播放页的URL标识
        DIRECTORY_PAGE_IDENTIFIER: 'circleIndexRedirect.do', // 课程目录页的URL标识
        VIDEO_SIDEBAR_ITEM_SELECTOR: '.cvtb-MCK-course-content',      // 视频页-侧边栏课程项
        VIDEO_SIDEBAR_PROGRESS_SELECTOR: '.cvtb-MCK-CsCt-studyProgress',// 视频页-侧边栏课程项的进度
        DIRECTORY_COURSE_ROW_SELECTOR: '#J_listContent tbody tr',       // 目录页-课程列表的行
        DIRECTORY_PROGRESS_COLUMN_INDEX: 4,  // 目录页-“学习进度”列的索引
        DIRECTORY_ACTION_COLUMN_INDEX: 5,    // 目录页-“操作”按钮列的索引
        PROGRESS_COMPLETE_TEXT_VIDEO: '100', // 进度100%的文本标识
        PLAYER_HOST_SELECTOR: '#J_CC_videoPlayerDiv', // 播放器宿主容器
        BIG_PLAY_BUTTON_SELECTOR: 'xg-start',   // 初始大播放按钮的选择器
        CONTROL_BAR_PLAY_BUTTON_SELECTOR: 'xg-play' // 控制栏播放/暂停按钮的选择器
    };

    // =================================================================
    // --- 2. 状态区 (GLOBAL STATE) ---
    // =================================================================
    let STATE = {
        maxPlaybackRate: 16.0,       // 用户期望的最高播放速率
        passiveMode: false,          // 仅监测播放，不主动触发播放
        isEvaluatingProgress: false, // 状态锁：是否正在评估视频进度
        forceContinue: false,        // 状态锁：用户是否点击了“继续学习”
        autoplayBlocked: false,      // 自动播放是否被浏览器策略阻止
        autoplayBlockedAt: 0,         // 自动播放拦截时间戳
        pausedSince: 0,               // 连续暂停开始时间戳
        autoplayMuteLocked: false,    // 自动播放静音锁定（避免反复触发拦截）
        userSwitchUntil: 0,           // 用户手动切换视频的短暂豁免窗口
        pendingRefresh: false         // 等待目录页刷新，避免 beforeunload 覆盖状态
    };
    let sessionState = {}; // 用于存储每个视频URL的独立状态
    const LOG_BUFFER = []; // 轻量日志缓冲区

    // =================================================================
    // --- 3. 函数定义区 (FUNCTIONS) ---
    // =================================================================

    // --- 状态管理函数 ---
    async function loadState() { try { const permanentState = await GM_getValue(CONFIG.STATE_STORAGE_KEY, { maxPlaybackRate: 16.0, passiveMode: false }); STATE.maxPlaybackRate = permanentState.maxPlaybackRate; STATE.passiveMode = !!permanentState.passiveMode; sessionState = await GM_getValue(CONFIG.STATE_STORAGE_KEY + '_session', {}); } catch (e) { console.error("【脚本错误】加载状态失败:", e); STATE.maxPlaybackRate = 16.0; STATE.passiveMode = false; } }
    async function saveSessionState() { try { await GM_setValue(CONFIG.STATE_STORAGE_KEY + '_session', sessionState); } catch (e) { console.error("【脚本错误】保存会话状态失败:", e); } }
    async function savePermanentState() { try { await GM_setValue(CONFIG.STATE_STORAGE_KEY, { maxPlaybackRate: STATE.maxPlaybackRate, passiveMode: STATE.passiveMode }); } catch (e) { console.error("【脚本错误】保存永久状态失败:", e); } }
    async function setStatusFlag(status) { try { await GM_setValue(CONFIG.STATUS_FLAG_KEY, status); await GM_setValue(CONFIG.STATUS_TIMESTAMP_KEY, Date.now()); } catch (e) { console.error("【脚本错误】保存状态失败:", e); } }
    async function touchStatusTimestamp() { try { await GM_setValue(CONFIG.STATUS_TIMESTAMP_KEY, Date.now()); } catch (e) { console.error("【脚本错误】更新时间戳失败:", e); } }
    function logEvent(type, message) {
        const line = `[${new Date().toISOString()}] [${type}] ${message}`;
        LOG_BUFFER.push(line);
        if (LOG_BUFFER.length > 1000) LOG_BUFFER.shift();
        console.debug(line);
    }

    // --- UI 及播放器辅助函数 ---
    function updateStatus(message) { const el = document.getElementById('helper-status-display'); if (el) el.textContent = message; }
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function applyPlaybackRate(video, rate) { if (video && video.playbackRate !== rate) video.playbackRate = rate; }
    function ensureAudible(video) { if (video && !video.paused && !STATE.autoplayBlocked) { if (video.muted || video.volume < CONFIG.DEFAULT_VOLUME) { video.muted = false; video.volume = CONFIG.DEFAULT_VOLUME; } } }
    function updateActiveButtons() { document.querySelectorAll('#playback-rate-buttons .rate-btn').forEach(b => b.classList.toggle('active', parseFloat(b.dataset.rate) === STATE.maxPlaybackRate)); }
    function getPlayerContext() { const playerHost = document.querySelector(CONFIG.PLAYER_HOST_SELECTOR); if (!playerHost) return null; return playerHost.shadowRoot || playerHost; }
    function clickPlayButton(context) { if (!context) return false; const bigPlayBtn = context.querySelector(CONFIG.BIG_PLAY_BUTTON_SELECTOR); if (bigPlayBtn && bigPlayBtn.offsetParent !== null) { bigPlayBtn.click(); return true; } const controlBarPlayBtn = context.querySelector(CONFIG.CONTROL_BAR_PLAY_BUTTON_SELECTOR); if (controlBarPlayBtn) { controlBarPlayBtn.click(); return true; } return false; }
    function attachVideoListeners(video, videoState) {
        if (!video || video.dataset.enaeaHooked === '1') return;
        video.dataset.enaeaHooked = '1';
        if (!video.paused) {
            const now = Date.now();
            videoState.lastPlayAt = now;
            if (!videoState.playingSince) videoState.playingSince = now;
        }
        video.addEventListener('playing', () => {
            const now = Date.now();
            videoState.lastPlayAt = now;
            if (!videoState.playingSince) videoState.playingSince = now;
        });
        video.addEventListener('pause', () => {
            videoState.lastPauseAt = Date.now();
            videoState.playingSince = 0;
        });
    }

    async function attemptStartPlayback(context, video) {
        let attempted = false;
        let playError = null;
        if (!video) return false;
        if (!video.paused && !video.ended) return true;
        if (clickPlayButton(context)) {
            attempted = true;
            await sleep(200);
            if (!video.paused) return true;
        }
        if (video.paused) {
            try { video.click(); attempted = true; } catch (e) {}
            await sleep(200);
            if (!video.paused) return true;
        }
        if (STATE.autoplayBlocked && CONFIG.FORCE_MUTED_ON_AUTOPLAY_BLOCK && video) {
            try {
                video.muted = true;
                const mutedPlay = video.play();
                attempted = true;
                if (mutedPlay && typeof mutedPlay.then === 'function') { await mutedPlay; }
                await sleep(200);
                if (!video.paused) { STATE.autoplayBlocked = false; STATE.autoplayMuteLocked = true; logEvent('play', '自动播放被拦截后，已静音继续播放'); return true; }
            } catch (e) { playError = e; }
        }
        if (STATE.autoplayMuteLocked) return attempted && !video.paused;
        if (clickPlayButton(context)) {
            attempted = true;
            await sleep(200);
        }
        if (!video.paused) return true;
        if (playError && video.muted === false) {
            const prevMuted = video.muted;
            const prevVolume = video.volume;
            try {
                video.muted = true;
                const mutedPlay = video.play();
                attempted = true;
                if (mutedPlay && typeof mutedPlay.then === 'function') { await mutedPlay; }
                await sleep(200);
            } catch (e) { playError = playError || e; } finally {
                if (!prevMuted) { setTimeout(() => { try { video.muted = false; video.volume = prevVolume; } catch (e) {} }, 1000); }
            }
        }
        if (playError && playError.name === 'NotAllowedError') {
            STATE.autoplayBlocked = true;
            STATE.autoplayMuteLocked = true;
            STATE.autoplayBlockedAt = Date.now();
            logEvent('play', '自动播放被浏览器拦截，需要用户交互');
        }
        return attempted && !video.paused;
    }

    function stripTimeText(text) {
        return (text || '')
            .replace(/\b\d{1,2}:\d{2}:\d{2}\b/g, '')
            .replace(/\b\d{1,2}:\d{2}\b/g, '');
    }
    function parseProgressText(text) {
        const input = stripTimeText(text);
        const matches = [...input.matchAll(/([\d.]+)\s*%/g)];
        const raw = matches.length ? matches[matches.length - 1][1] : '';
        const value = parseFloat(raw);
        return isNaN(value) ? 0 : value;
    }
    function parseProgressPercentFromText(text) {
        const input = stripTimeText(text);
        const matches = [...input.matchAll(/([\d.]+)\s*%/g)];
        if (!matches.length) return null;
        const value = parseFloat(matches[matches.length - 1][1]);
        return isNaN(value) ? null : value;
    }
    function parseDirectoryProgress(progressCell) {
        if (!progressCell) return null;
        let value = parseProgressPercentFromText(progressCell.textContent);
        if (value !== null) return value;
        const percentEl = Array.from(progressCell.querySelectorAll('*')).find(el => /%/.test(el.textContent || ''));
        if (percentEl) {
            value = parseProgressPercentFromText(percentEl.textContent);
            if (value !== null) return value;
        }
        const bar = progressCell.querySelector('[aria-valuenow], [style*="width"]');
        if (bar) {
            const aria = bar.getAttribute('aria-valuenow');
            if (aria && !isNaN(parseFloat(aria))) return parseFloat(aria);
            const style = bar.getAttribute('style') || '';
            const m = style.match(/width\s*:\s*([\d.]+)%/);
            if (m) return parseFloat(m[1]);
        }
        const dataProgress = progressCell.getAttribute('data-progress');
        if (dataProgress && !isNaN(parseFloat(dataProgress))) return parseFloat(dataProgress);
        return null;
    }
    function getCurrentItemKey(item) {
        if (!item) return '';
        return item.id
            || item.getAttribute('data-content-id')
            || item.getAttribute('data-coursecontentid')
            || item.getAttribute('data-id')
            || item.querySelector('a[data-vurl*="coursecontentId="]')?.getAttribute('data-vurl')
            || (item.textContent || '').trim().slice(0, 80);
    }

    /**
     * @description 创建并显示控制UI面板 (设计升级版)
     */
    function createControlPanel() {
        if (document.getElementById('ai-helper-panel')) return;

        // 定义 SVG 图标
        const iconEmail = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
        const iconX = `<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
        const iconLog = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
        const iconUser = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

        const panelHTML = `
            <div id="ai-helper-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <span class="dot"></span> EnaeaAsst 智能助手 <span class="version">V3.13</span>
                    </div>
                </div>

                <div class="panel-body">
                    <div class="status-box">
                        <div class="status-label">当前状态</div>
                        <div class="status-value" id="helper-status-display">等待初始化...</div>
                    </div>

                    <div class="control-group">
                        <div class="control-label">倍速控制</div>
                        <div id="playback-rate-buttons" class="rate-group">
                            ${CONFIG.SPEED_TIERS.map(r => `<button class="rate-btn" data-rate="${r}">${r}x</button>`).join('')}
                        </div>
                    </div>
                    <div class="control-group">
                        <label class="toggle-row">
                            <input id="passive-mode-toggle" type="checkbox">
                            <span>仅监测播放（不主动播放）</span>
                        </label>
                    </div>

                    <button id="force-continue-btn" class="action-btn success-btn" style="display: none;">
                        <span>继续学习 (强制模式)</span>
                    </button>

                    <div class="action-row">
                        <button id="export-log-btn" class="action-btn secondary-btn" title="导出运行日志">
                            ${iconLog} <span>导出日志</span>
                        </button>
                        <button id="contact-author-btn" class="action-btn secondary-btn" title="联系作者">
                            ${iconUser} <span>联系作者</span>
                        </button>
                    </div>
                </div>
            </div>

            <div id="author-modal-overlay" class="modal-overlay">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>关于作者</h3>
                        <button class="close-modal-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p class="author-intro">如有问题或建议，欢迎通过以下方式联系。</p>

                        <a class="contact-item" href="mailto:beabaed@gmail.com">
                            <div class="contact-icon email-bg">${iconEmail}</div>
                            <div class="contact-info">
                                <span class="label">Email</span>
                                <span class="value">beabaed@gmail.com</span>
                            </div>
                        </a>

                        <a class="contact-item" href="https://x.com/Kaylerris" target="_blank" rel="noopener noreferrer">
                            <div class="contact-icon x-bg">${iconX}</div>
                            <div class="contact-info">
                                <span class="label">X (Twitter)</span>
                                <span class="value">@Kaylerris</span>
                            </div>
                        </a>
                    </div>
                    <div class="modal-footer">
                        <span class="copyright">Designed by KKG&GM&CL</span>
                    </div>
                </div>
            </div>
        `;

        // CSS 样式注入 - 高端 UI 设计
        GM_addStyle(`
            :root {
                --eah-primary: #2563eb;
                --eah-primary-hover: #1d4ed8;
                --eah-bg: rgba(255, 255, 255, 0.85);
                --eah-text: #1e293b;
                --eah-text-light: #64748b;
                --eah-border: rgba(255, 255, 255, 0.6);
                --eah-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                --eah-radius: 16px;
                --eah-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }

            /* 主面板 */
            #ai-helper-panel {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 340px;
                background: var(--eah-bg);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: var(--eah-radius);
                box-shadow: var(--eah-shadow);
                z-index: 99999;
                font-family: var(--eah-font);
                color: var(--eah-text);
                transition: transform 0.3s ease, opacity 0.3s ease;
                animation: eah-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes eah-slide-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .panel-header {
                padding: 16px 20px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: move;
                user-select: none;
            }

            .panel-title {
                font-size: 15px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .dot {
                width: 8px;
                height: 8px;
                background-color: #10b981;
                border-radius: 50%;
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
            }

            .version {
                font-size: 11px;
                background: rgba(0,0,0,0.06);
                padding: 2px 6px;
                border-radius: 4px;
                color: var(--eah-text-light);
                font-weight: 500;
            }

            .panel-body {
                padding: 16px 20px;
            }

            /* 状态显示 */
            .status-box {
                background: #f8fafc;
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 16px;
                border: 1px solid rgba(0,0,0,0.03);
            }
            .status-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--eah-text-light);
                margin-bottom: 4px;
            }
            .status-value {
                font-size: 13px;
                font-weight: 600;
                color: var(--eah-primary);
                line-height: 1.4;
            }

            /* 控件通用 */
            .control-group { margin-bottom: 16px; }
            .control-label {
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 8px;
                color: var(--eah-text);
            }
            .toggle-row {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: var(--eah-text);
                user-select: none;
            }
            .toggle-row input {
                accent-color: var(--eah-primary);
            }

            /* 速率按钮 */
            .rate-group {
                display: flex;
                gap: 6px;
                background: #f1f5f9;
                padding: 4px;
                border-radius: 10px;
            }
            .rate-btn {
                flex: 1;
                border: none;
                background: transparent;
                padding: 6px 0;
                font-size: 12px;
                font-weight: 600;
                color: var(--eah-text-light);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .rate-btn:hover { background: rgba(255,255,255,0.5); color: var(--eah-text); }
            .rate-btn.active {
                background: #fff;
                color: var(--eah-primary);
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }

            /* 底部操作区 */
            .action-row {
                display: flex;
                gap: 10px;
            }
            .action-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px 12px;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                border: 1px solid transparent;
                transition: all 0.2s;
                font-family: var(--eah-font);
            }
            .action-btn .icon { width: 16px; height: 16px; }

            .secondary-btn {
                background: #fff;
                border: 1px solid rgba(0,0,0,0.08);
                color: var(--eah-text);
            }
            .secondary-btn:hover {
                background: #f8fafc;
                border-color: rgba(0,0,0,0.15);
                transform: translateY(-1px);
            }

            .success-btn {
                width: 100%;
                background: #10b981;
                color: white;
                margin-bottom: 12px;
                box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
            }
            .success-btn:hover { background: #059669; }

            /* 模态框 (Contact Modal) */
            .modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.4);
                backdrop-filter: blur(4px);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .modal-overlay.visible {
                opacity: 1;
                visibility: visible;
            }
            .modal-card {
                background: white;
                width: 90%;
                max-width: 360px;
                border-radius: 20px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                transform: scale(0.95);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                overflow: hidden;
            }
            .modal-overlay.visible .modal-card {
                transform: scale(1);
            }
            .modal-header {
                padding: 20px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #f1f5f9;
            }
            .modal-header h3 { margin: 0; font-size: 18px; color: #0f172a; }
            .close-modal-btn {
                background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; padding: 0; line-height: 1;
            }
            .close-modal-btn:hover { color: #64748b; }
            .modal-body { padding: 24px; }
            .author-intro { margin: 0 0 20px 0; font-size: 14px; color: #64748b; line-height: 1.5; }

            .contact-item {
                display: flex;
                align-items: center;
                padding: 12px;
                background: #f8fafc;
                border-radius: 12px;
                margin-bottom: 12px;
                transition: transform 0.2s;
                text-decoration: none;
            }
            .contact-item:hover { transform: translateX(4px); background: #f1f5f9; }
            .contact-icon {
                width: 40px; height: 40px;
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                margin-right: 14px;
                color: white;
            }
            .contact-icon.email-bg { background: linear-gradient(135deg, #f87171, #ef4444); }
            .contact-icon.x-bg { background: #000; }
            .contact-icon .icon { width: 20px; height: 20px; }

            .contact-info { display: flex; flex-direction: column; }
            .contact-info .label { font-size: 12px; color: #94a3b8; font-weight: 500; }
            .contact-info .value { font-size: 15px; color: #334155; font-weight: 600; font-family: monospace; }

            .modal-footer {
                padding: 12px 24px 20px;
                text-align: center;
            }
            .copyright { font-size: 12px; color: #cbd5e1; }
        `);

        document.body.insertAdjacentHTML('beforeend', panelHTML);

        const panelEl = document.getElementById('ai-helper-panel');
        const savedPos = GM_getValue(CONFIG.PANEL_POSITION_KEY, null);
        if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
            panelEl.style.left = `${savedPos.left}px`;
            panelEl.style.top = `${savedPos.top}px`;
            panelEl.style.right = 'auto';
            panelEl.style.bottom = 'auto';
        }
        const dragHandle = panelEl.querySelector('.panel-header') || panelEl;
        let dragActive = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        const startDrag = (clientX, clientY) => {
            const rect = panelEl.getBoundingClientRect();
            dragActive = true;
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;
            panelEl.style.right = 'auto';
            panelEl.style.bottom = 'auto';
        };
        const onMove = (clientX, clientY) => {
            if (!dragActive) return;
            const maxLeft = Math.max(0, window.innerWidth - panelEl.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - panelEl.offsetHeight);
            const left = Math.min(Math.max(0, clientX - dragOffsetX), maxLeft);
            const top = Math.min(Math.max(0, clientY - dragOffsetY), maxTop);
            panelEl.style.left = `${left}px`;
            panelEl.style.top = `${top}px`;
        };
        const endDrag = () => {
            if (!dragActive) return;
            dragActive = false;
            const left = parseFloat(panelEl.style.left);
            const top = parseFloat(panelEl.style.top);
            if (!isNaN(left) && !isNaN(top)) {
                GM_setValue(CONFIG.PANEL_POSITION_KEY, { left, top });
            }
        };
        dragHandle.addEventListener('mousedown', (e) => { startDrag(e.clientX, e.clientY); e.preventDefault(); });
        document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        document.addEventListener('mouseup', endDrag);
        dragHandle.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (t) { startDrag(t.clientX, t.clientY); } }, { passive: true });
        document.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) { onMove(t.clientX, t.clientY); } }, { passive: true });
        document.addEventListener('touchend', endDrag);

        // 事件绑定
        document.addEventListener('click', (e) => {
            const item = e.target.closest(CONFIG.VIDEO_SIDEBAR_ITEM_SELECTOR);
            if (item) STATE.userSwitchUntil = Date.now() + CONFIG.USER_SWITCH_GRACE_MS;
        });
        document.getElementById('playback-rate-buttons').addEventListener('click', async (e) => {
            const target = e.target.closest('button.rate-btn');
            if (!target) return;
            const newRate = parseFloat(target.dataset.rate);
            STATE.maxPlaybackRate = newRate;
            updateActiveButtons();
            await savePermanentState();
            const playerContext = getPlayerContext();
            if (playerContext) {
                const video = playerContext.querySelector('video');
                if (video) {
                    const pageUrl = window.location.href;
                    if (!sessionState[pageUrl]) sessionState[pageUrl] = {};
                    sessionState[pageUrl].rate = newRate;
                    await saveSessionState();
                    applyPlaybackRate(video, newRate);
                    updateStatus(`速率已手动设置为: ${newRate}x`);
                }
            }
        });

        const passiveToggle = document.getElementById('passive-mode-toggle');
        if (passiveToggle) {
            passiveToggle.checked = !!STATE.passiveMode;
            passiveToggle.addEventListener('change', async () => {
                STATE.passiveMode = passiveToggle.checked;
                await savePermanentState();
                updateStatus(STATE.passiveMode ? '已开启被动模式' : '已关闭被动模式');
            });
        }

        document.getElementById('force-continue-btn').addEventListener('click', () => {
            STATE.forceContinue = true;
            document.getElementById('force-continue-btn').style.display = 'none';
            updateStatus('强制继续模式已激活...');
            mainTick();
        });

        document.getElementById('export-log-btn').addEventListener('click', async () => {
            const text = LOG_BUFFER.join('\n');
            try { await navigator.clipboard.writeText(text); updateStatus('日志已复制到剪贴板'); } catch (e) { window.prompt('复制日志:', text); }
        });

        // 模态框逻辑
        const modal = document.getElementById('author-modal-overlay');
        const closeModal = () => modal.classList.remove('visible');

        document.getElementById('contact-author-btn').addEventListener('click', () => {
            modal.classList.add('visible');
        });

        modal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        updateActiveButtons();
    }

    // --- 核心页面逻辑 (完全保留原逻辑) ---

    /**
     * @description 在视频页，处理当前课程分集的跳转。如果全系列完成，则通知目录页刷新。
     */
    async function playNextUncompletedVideo() { for (const item of document.querySelectorAll(CONFIG.VIDEO_SIDEBAR_ITEM_SELECTOR)) { const progressText = item.querySelector(CONFIG.VIDEO_SIDEBAR_PROGRESS_SELECTOR)?.innerText || ''; const progressValue = parseProgressText(progressText); if (progressValue < 100) { if (!item.classList.contains('current')) { item.click(); } return; } } updateStatus('当前系列课程已全部完成！通知目录页刷新...'); STATE.pendingRefresh = true; await setStatusFlag('refresh_needed'); window.close(); }

    /**
     * @description 目录页的核心处理函数，负责寻找下一个可学习的课程。
     */
    async function handleDirectoryPage() {
        if (document.hidden) { updateStatus('目录页在后台，暂停操作'); return; }
        const taskStatus = await GM_getValue(CONFIG.STATUS_FLAG_KEY, 'initial');
        const lastStatusAt = await GM_getValue(CONFIG.STATUS_TIMESTAMP_KEY, 0);
        if (taskStatus === 'initial' && Date.now() - lastStatusAt < CONFIG.STUDYING_RECENT_GRACE_MS) {
            updateStatus('检测到视频仍在播放，本页暂停...');
            return;
        }
        if (taskStatus === 'refresh_needed') { await setStatusFlag('initial'); updateStatus('课程已完成，正在刷新目录以获取最新进度...'); location.reload(); return; }
        if (taskStatus === 'studying') { if (Date.now() - lastStatusAt > CONFIG.STUDYING_TIMEOUT_MS) { updateStatus('学习状态超时，自动重置...'); await setStatusFlag('initial'); return; } updateStatus('视频学习中，本页暂停...'); return; }

        const requireP = Array.from(document.querySelectorAll('.class-survey .require')).find(p => p.textContent.includes('要求'));
        const completeP = Array.from(document.querySelectorAll('.class-survey .require')).find(p => p.textContent.includes('已学'));
        if (requireP && completeP) {
            const requiredMinutes = parseFloat(requireP.textContent.match(/[\d.]+/)?.[0] || 0);
            const completedMinutes = parseFloat(completeP.textContent.match(/[\d.]+/)?.[0] || 0);
            if (completedMinutes >= requiredMinutes && !STATE.forceContinue) {
                updateStatus('学习总时长已达标！');
                document.getElementById('force-continue-btn').style.display = 'flex'; // UI修改：block改为flex以适应新CSS
                await setStatusFlag('all_done');
                return;
            }
        }

        const pageSizeDisplay = document.querySelector('#J_myOptionRecords_customlength .disval');
        if (pageSizeDisplay && pageSizeDisplay.textContent.trim() !== '100') { updateStatus('调整分页为100条/页...'); const dropdownTrigger = document.querySelector('#J_myOptionRecords_customlength'); if (dropdownTrigger) { dropdownTrigger.click(); setTimeout(() => { const option100 = document.querySelector('#J_myOptionRecords_customlength .dropmenu li[data="100"]'); if (option100) { option100.click(); } }, 200); } return; }

        const courseRows = document.querySelectorAll(CONFIG.DIRECTORY_COURSE_ROW_SELECTOR);
        if (courseRows.length === 0) { updateStatus('等待目录列表加载...'); return; }

        const failedCounts = await GM_getValue(CONFIG.FAILED_COURSES_KEY, {});

        for (const row of courseRows) {
            const progressCell = row.querySelectorAll('td')[CONFIG.DIRECTORY_PROGRESS_COLUMN_INDEX];
            if (!progressCell) continue;
            const progressValue = parseDirectoryProgress(progressCell);
            if (progressValue === null || progressValue >= 100) continue;

            const actionCell = row.querySelectorAll('td')[CONFIG.DIRECTORY_ACTION_COLUMN_INDEX];
            if (!actionCell) continue;

            const actionButton = actionCell.querySelector('a[data-vurl*="courseId="]');
            if (!actionButton) continue;

            let courseId;
            try {
                courseId = new URL(actionButton.dataset.vurl, window.location.origin).searchParams.get('courseId');
            } catch (e) { continue; }
            if (!courseId) continue;

            if ((failedCounts[courseId] || 0) >= CONFIG.MAX_COURSE_FAILURES) continue;

            const courseTitle = (row.querySelector('a[title]') || actionButton).textContent.trim();
            updateStatus(`找到未完成任务 [${courseTitle}]`);
            await setStatusFlag('studying');
            actionButton.click();
            return;
        }

        updateStatus('恭喜！所有可用课程均已完成。');
        await setStatusFlag('all_done');
    }

    /**
     * @description 视频播放页的核心处理函数
     */
    async function handleVideoPage() {
        if (STATE.isEvaluatingProgress) { updateStatus('评估进度中，请稍候...'); return; }
        const playerContext = getPlayerContext();
        if (!playerContext) { updateStatus('等待播放器宿主加载...'); return; }
        const video = playerContext.querySelector('video');
        if (!video) { updateStatus('等待视频和课程信息加载...'); return; }
        if (!video.paused) {
            STATE.pausedSince = 0;
            if (STATE.autoplayBlocked) {
                STATE.autoplayBlocked = false;
                STATE.autoplayMuteLocked = false;
                STATE.autoplayBlockedAt = 0;
                logEvent('play', '检测到自动播放已开始，清除拦截标记');
            }
        } else if (!STATE.pausedSince) {
            STATE.pausedSince = Date.now();
        }
        const currentItem = document.querySelector(CONFIG.VIDEO_SIDEBAR_ITEM_SELECTOR + '.current');
        if (!currentItem) { updateStatus('等待课程信息加载...'); return; }
        const progressEl = currentItem.querySelector(CONFIG.VIDEO_SIDEBAR_PROGRESS_SELECTOR);
        if (!progressEl) { updateStatus('等待进度元素加载...'); return; }
        await touchStatusTimestamp();

        const progressText = progressEl.innerText.trim();
        logEvent('progress', progressText);
        const pageUrl = window.location.href;
        let videoState = sessionState[pageUrl];
        if (!videoState) { videoState = { rate: STATE.maxPlaybackRate, lastProgress: 0, lastPlayAttemptTime: 0, playAttemptCounter: 0, initAt: Date.now(), lastPlayAt: 0, lastPauseAt: 0, lastProgressAt: 0, lastTime: 0, lastTimeAt: 0, playingSince: 0 }; sessionState[pageUrl] = videoState; await saveSessionState(); }
        if (typeof videoState.playAttemptCounter === 'undefined') { videoState.playAttemptCounter = 0; }
        attachVideoListeners(video, videoState);

        const currentProgress = parseProgressText(progressText);
        if (video.currentTime > 0 && Math.abs(video.currentTime - (videoState.lastTime || 0)) > 0.1) {
            videoState.lastTime = video.currentTime;
            videoState.lastTimeAt = Date.now();
        }
        if (videoState.lastProgress && currentProgress + 1 < videoState.lastProgress) {
            videoState.lastProgress = currentProgress;
            videoState.playAttemptCounter = 0;
            videoState.initAt = Date.now();
            videoState.lastPlayAt = 0;
            videoState.lastPauseAt = 0;
            videoState.lastProgressAt = Date.now();
            videoState.lastTime = video.currentTime || 0;
            videoState.lastTimeAt = Date.now();
            videoState.playingSince = 0;
            await saveSessionState();
        }
        const currentItemKey = getCurrentItemKey(currentItem);
        const prevItemKey = videoState.currentItemKey;
        if (currentItemKey && prevItemKey && prevItemKey !== currentItemKey) {
            if (videoState.lastProgress < 100) {
                const revertEl = document.getElementById(prevItemKey)
                    || document.querySelector(`[data-content-id="${prevItemKey}"]`)
                    || document.querySelector(`[data-coursecontentid="${prevItemKey}"]`)
                    || document.querySelector(`[data-id="${prevItemKey}"]`);
                if (revertEl) {
                    updateStatus('未到100%，禁止切换，已自动切回');
                    revertEl.click();
                    return;
                }
            }
        }
        if (currentItemKey && prevItemKey && prevItemKey !== currentItemKey) {
            videoState.rate = STATE.maxPlaybackRate;
            videoState.lastProgress = 0;
            videoState.playAttemptCounter = 0;
            videoState.currentItemKey = currentItemKey;
            videoState.initAt = Date.now();
            videoState.lastPlayAt = 0;
            videoState.lastPauseAt = 0;
            videoState.lastTime = 0;
            videoState.lastTimeAt = 0;
            videoState.playingSince = 0;
            await saveSessionState();
            if (!STATE.passiveMode) applyPlaybackRate(video, videoState.rate);
        } else if (currentItemKey && !videoState.currentItemKey) {
            videoState.currentItemKey = currentItemKey;
            await saveSessionState();
        }
        if (currentProgress >= 100) { updateStatus(`本集已完成 (100%)，寻找下一集...`); delete sessionState[pageUrl]; await saveSessionState(); await playNextUncompletedVideo(); return; }
        if (currentProgress > videoState.lastProgress) {
            if (!video.paused && STATE.autoplayMuteLocked) {
                STATE.autoplayMuteLocked = false;
                video.muted = false;
                video.volume = CONFIG.DEFAULT_VOLUME;
            }
            videoState.lastProgress = currentProgress;
            videoState.playAttemptCounter = 0;
            videoState.lastProgressAt = Date.now();
            await saveSessionState();
        }

        if (!video.seeking && video.duration > 0 && video.currentTime >= video.duration - 0.5) {
            video.pause(); STATE.isEvaluatingProgress = true; updateStatus(`播放完毕，评估进度 (${currentProgress}%)...`);
            const progressElementOfFinishedVideo = currentItem.querySelector(CONFIG.VIDEO_SIDEBAR_PROGRESS_SELECTOR);
            setTimeout(async () => {
                const latestProgress = parseProgressText(progressElementOfFinishedVideo ? progressElementOfFinishedVideo.innerText.trim() : `${videoState.lastProgress}`);
                if (latestProgress <= videoState.lastProgress) {
                    const currentSpeedIndex = CONFIG.SPEED_TIERS.indexOf(videoState.rate);
                    if (currentSpeedIndex < CONFIG.SPEED_TIERS.length - 1) { videoState.rate = CONFIG.SPEED_TIERS[currentSpeedIndex + 1]; updateStatus(`进度未动，降速至 ${videoState.rate}x 后重试...`); }
                    else { updateStatus(`已是最低速 (${videoState.rate}x)，但进度仍未动...`); }
                } else { videoState.lastProgress = latestProgress; }
                await saveSessionState();
                const seekAndPlay = () => { clickPlayButton(playerContext); STATE.isEvaluatingProgress = false; };
                video.addEventListener('seeked', seekAndPlay, { once: true });
                setTimeout(() => { STATE.isEvaluatingProgress = false; }, 3000);
                video.currentTime = video.duration * (videoState.lastProgress / 100);
                if (!STATE.passiveMode) applyPlaybackRate(video, videoState.rate);
            }, 2000);
            return;
        }

        if (STATE.passiveMode) {
            if (video.paused) {
                updateStatus('被动模式：等待播放器自动播放...');
                return;
            }
            const stableSince = videoState.playingSince || 0;
            if (!stableSince || Date.now() - stableSince < CONFIG.PASSIVE_PLAY_STABLE_MS) {
                updateStatus('被动模式：播放稳定后再加速...');
                return;
            }
        }

        applyPlaybackRate(video, videoState.rate);
        if (video.paused) {
            if (STATE.passiveMode) {
                updateStatus('被动模式：不触发播放，持续监测...');
                return;
            }
            const lastAttempt = videoState.lastPlayAttemptTime || 0;
            if (Date.now() - lastAttempt > CONFIG.PLAY_DEBOUNCE_PERIOD) {
                if (!STATE.pausedSince) STATE.pausedSince = Date.now();
                if (Date.now() - STATE.pausedSince < 1500) {
                    updateStatus('检测到暂停，等待稳定...');
                    return;
                }
                const pauseConfirmed = videoState.lastPauseAt && (!videoState.lastPlayAt || videoState.lastPauseAt >= videoState.lastPlayAt);
                if (!pauseConfirmed) {
                    updateStatus('未确认暂停，继续监测...');
                    return;
                }
                if (videoState.lastPauseAt && Date.now() - videoState.lastPauseAt < CONFIG.PAUSE_CONFIRM_GRACE_MS) {
                    updateStatus('暂停刚发生，继续监测...');
                    return;
                }
                if (videoState.initAt && Date.now() - videoState.initAt < CONFIG.AUTOPLAY_INIT_GRACE_MS && video.currentTime < 1) {
                    updateStatus('等待播放器自动开始...');
                    return;
                }
                if (videoState.lastPlayAt && Date.now() - videoState.lastPlayAt < 2000) {
                    updateStatus('播放器刚开始播放，等待稳定...');
                    return;
                }
                if (videoState.lastProgressAt && Date.now() - videoState.lastProgressAt < CONFIG.PROGRESS_STALL_GRACE_MS) {
                    updateStatus('进度刚更新，等待播放器继续...');
                    return;
                }
                if (videoState.lastTimeAt && Date.now() - videoState.lastTimeAt < CONFIG.TIME_STALL_GRACE_MS) {
                    updateStatus('播放时间仍在推进，等待稳定...');
                    return;
                }
                const lastActivityAt = Math.max(
                    videoState.lastProgressAt || 0,
                    videoState.lastTimeAt || 0,
                    videoState.lastPlayAt || 0,
                    videoState.lastPauseAt || 0
                );
                if (lastActivityAt && Date.now() - lastActivityAt < CONFIG.STALL_TRIGGER_MS) {
                    updateStatus('播放可能在缓冲，继续观察...');
                    return;
                }
                if (STATE.autoplayBlocked && STATE.autoplayBlockedAt && Date.now() - STATE.autoplayBlockedAt < CONFIG.AUTOPLAY_BLOCK_COOLDOWN_MS) {
                    updateStatus('自动播放受限，等待用户交互...');
                    return;
                }
                if (STATE.autoplayBlocked) {
                    updateStatus('自动播放受限，等待用户交互或静音尝试...');
                }
                videoState.lastPlayAttemptTime = Date.now();
                videoState.playAttemptCounter++;
                const started = await attemptStartPlayback(playerContext, video);
                const msg = started ? `检测到暂停，尝试自动播放 (第 ${videoState.playAttemptCounter} 次)...` : `检测到暂停，未能触发播放 (第 ${videoState.playAttemptCounter} 次)...`;
                updateStatus(msg);
                logEvent('play', msg);
                await saveSessionState();
                if (videoState.playAttemptCounter > CONFIG.MAX_PLAY_ATTEMPTS) {
                    updateStatus(`已连续尝试 ${CONFIG.MAX_PLAY_ATTEMPTS} 次播放失败，放弃此课程...`);
                    const failedCounts = await GM_getValue(CONFIG.FAILED_COURSES_KEY, {});
                    const courseId = new URL(pageUrl).searchParams.get('courseId');
                    if (courseId) { failedCounts[courseId] = (failedCounts[courseId] || 0) + 1; }
                    await GM_setValue(CONFIG.FAILED_COURSES_KEY, failedCounts);
                    await setStatusFlag('initial');
                    window.close();
                    return;
                }
            } else { updateStatus('等待播放器响应...'); }
        } else {
            STATE.pausedSince = 0;
            ensureAudible(video);
            updateStatus(`播放中 (速率: ${video.playbackRate}x, 进度: ${currentProgress}%)`);
        }
    }

    /**
     * @description 主心跳函数
     */
    async function mainTick() { if (window.location.href.includes(CONFIG.DIRECTORY_PAGE_IDENTIFIER)) { await handleDirectoryPage(); } else if (window.location.href.includes(CONFIG.VIDEO_PAGE_IDENTIFIER)) { await handleVideoPage(); } else { updateStatus('在未知页面或等待跳转...'); } }

    // =================================================================
    // --- 4. 启动区 (ENTRY POINT) ---
    // =================================================================
    (async function() {
        try {
            console.log('EnaeaAssistant-学习公社16X速全自动 V3.13 已加载。');
            await loadState();
            createControlPanel();
            if (window.location.href.includes(CONFIG.DIRECTORY_PAGE_IDENTIFIER)) {
                 const currentStatus = await GM_getValue(CONFIG.STATUS_FLAG_KEY, 'initial');
                 const lastStatusAt = await GM_getValue(CONFIG.STATUS_TIMESTAMP_KEY, 0);
                 if (currentStatus !== 'studying' && Date.now() - lastStatusAt >= CONFIG.STUDYING_RECENT_GRACE_MS) {
                    await setStatusFlag('initial');
                 }
                 if (!sessionStorage.getItem('enaea_session_started')) {
                    await GM_setValue(CONFIG.FAILED_COURSES_KEY, {});
                    sessionStorage.setItem('enaea_session_started', 'true');
                 }
            }
            window.addEventListener('beforeunload', () => { if (window.location.href.includes(CONFIG.VIDEO_PAGE_IDENTIFIER) && !STATE.pendingRefresh) { setStatusFlag('initial'); } });
        document.addEventListener('click', () => {
            if (STATE.autoplayBlocked) {
                STATE.autoplayBlocked = false;
                STATE.autoplayMuteLocked = false;
                STATE.autoplayBlockedAt = 0;
                logEvent('play', '检测到用户点击，解除自动播放限制');
                mainTick();
            }
        });
        document.addEventListener('touchstart', () => {
            if (STATE.autoplayBlocked) {
                STATE.autoplayBlocked = false;
                STATE.autoplayMuteLocked = false;
                STATE.autoplayBlockedAt = 0;
                logEvent('play', '检测到用户触摸，解除自动播放限制');
                mainTick();
            }
        });
            setInterval(mainTick, CONFIG.TICK_INTERVAL);
        } catch (error) {
            console.error("【脚本启动时发生严重错误】:", error);
            alert("脚本启动失败！请按F12查看控制台报错信息。");
        }
    })();
})();
