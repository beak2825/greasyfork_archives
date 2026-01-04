// ==UserScript==
// @name         EnaeaAsst-学习公社16X速全自动
// @namespace    http://tampermonkey.net/
// @version      10.0.0
// @license      MIT
// @description  A fully-featured, robust, and intelligent learning assistant for ENAEA. Handles all playback scenarios and errors gracefully.
// @author       beabaed@gmail.com, KKG&GM&CL
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do*
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540952/EnaeaAsst-%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE16X%E9%80%9F%E5%85%A8%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540952/EnaeaAsst-%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE16X%E9%80%9F%E5%85%A8%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // =================================================================
    // --- 1. 配置区 (CONSTANTS) ---
    // =================================================================
    const CONFIG = {
        TICK_INTERVAL: 3000,                 // 主循环心跳间隔（毫秒）
        PLAY_DEBOUNCE_PERIOD: 5000,          // 播放指令的防抖冷却时间（毫秒），防止过于频繁的点击
        MAX_PLAY_ATTEMPTS: 20,               // 单个视频播放失败的最大尝试次数（触发熔断）
        MAX_COURSE_FAILURES: 3,              // 单个课程被熔断的最大次数（触发跳过）
        STATE_STORAGE_KEY: 'enaea_helper_state_v9_0',       // 用户设置的永久状态存储Key
        STATUS_FLAG_KEY: 'enaea_helper_task_status_v9_0',   // 用于跨页面通信的状态旗帜Key
        FAILED_COURSES_KEY: 'enaea_helper_failed_courses_v9_4',// 熔断失败课程的计数器存储Key
        SPEED_TIERS: [16.0, 10.0, 8.0, 4.0, 2.0], // 速度阶梯，用于在高倍速无效时自动降速
        VIDEO_PAGE_IDENTIFIER: 'viewerforccvideo.do',        // 视频播放页的URL标识
        DIRECTORY_PAGE_IDENTIFIER: 'circleIndexRedirect.do', // 课程目录页的URL标识
        VIDEO_SIDEBAR_ITEM_SELECTOR: '.cvtb-MCK-course-content',      // 视频页-侧边栏课程项
        VIDEO_SIDEBAR_PROGRESS_SELECTOR: '.cvtb-MCK-CsCt-studyProgress',// 视频页-侧边栏课程项的进度
        DIRECTORY_COURSE_ROW_SELECTOR: '#J_listContent tbody tr',       // 目录页-课程列表的行
        DIRECTORY_PROGRESS_COLUMN_INDEX: 4,  // 目录页-“学习进度”列的索引（从0开始）
        DIRECTORY_ACTION_COLUMN_INDEX: 5,    // 目录页-“操作”按钮列的索引
        PROGRESS_COMPLETE_TEXT_VIDEO: '100', // 进度100%的文本标识
        PLAYER_HOST_SELECTOR: '#J_CC_videoPlayerDiv', // 播放器宿主容器（可能包含Shadow DOM）
        BIG_PLAY_BUTTON_SELECTOR: 'xg-start',   // 初始大播放按钮的选择器
        CONTROL_BAR_PLAY_BUTTON_SELECTOR: 'xg-play' // 控制栏播放/暂停按钮的选择器
    };

    // =================================================================
    // --- 2. 状态区 (GLOBAL STATE) ---
    // =================================================================
    let STATE = {
        maxPlaybackRate: 16.0,       // 用户期望的最高播放速率
        isEvaluatingProgress: false, // 状态锁：是否正在评估视频进度，防止竞速
        forceContinue: false         // 状态锁：用户是否点击了“继续学习”，以无视总时长限制
    };
    let sessionState = {}; // 用于存储每个视频URL的独立状态 (速率、进度、尝试次数等)

    // =================================================================
    // --- 3. 函数定义区 (FUNCTIONS) ---
    // =================================================================

    // --- 状态管理函数 ---
    async function loadState() { try { const permanentState = await GM_getValue(CONFIG.STATE_STORAGE_KEY, { maxPlaybackRate: 16.0 }); STATE.maxPlaybackRate = permanentState.maxPlaybackRate; sessionState = await GM_getValue(CONFIG.STATE_STORAGE_KEY + '_session', {}); } catch (e) { console.error("【脚本错误】加载状态失败:", e); STATE.maxPlaybackRate = 16.0; } }
    async function saveSessionState() { try { await GM_setValue(CONFIG.STATE_STORAGE_KEY + '_session', sessionState); } catch (e) { console.error("【脚本错误】保存会话状态失败:", e); } }
    async function savePermanentState() { try { await GM_setValue(CONFIG.STATE_STORAGE_KEY, { maxPlaybackRate: STATE.maxPlaybackRate }); } catch (e) { console.error("【脚本错误】保存永久状态失败:", e); } }

    // --- UI 及播放器辅助函数 ---
    function updateStatus(message) { const el = document.getElementById('helper-status-display'); if (el) el.textContent = message; }
    function applyPlaybackRate(video, rate) { if (video && video.playbackRate !== rate) video.playbackRate = rate; }
    function updateActiveButtons() { document.querySelectorAll('#playback-rate-buttons .rate-btn').forEach(b => b.classList.toggle('active', parseFloat(b.dataset.rate) === STATE.maxPlaybackRate)); }
    function getPlayerContext() { const playerHost = document.querySelector(CONFIG.PLAYER_HOST_SELECTOR); if (!playerHost) return null; return playerHost.shadowRoot || playerHost; }
    function clickPlayButton(context) { if (!context) return false; const bigPlayBtn = context.querySelector(CONFIG.BIG_PLAY_BUTTON_SELECTOR); if (bigPlayBtn && bigPlayBtn.offsetParent !== null) { bigPlayBtn.click(); return true; } const controlBarPlayBtn = context.querySelector(CONFIG.CONTROL_BAR_PLAY_BUTTON_SELECTOR); if (controlBarPlayBtn) { controlBarPlayBtn.click(); return true; } return false; }

    /**
     * @description 创建并显示控制UI面板
     */
    function createControlPanel() {
        if (document.getElementById('ai-helper-panel')) return;
        const panelHTML = `
            <div id="ai-helper-panel">
                <div class="panel-title">智能学习助手 v10.0.0</div>
                <div class="panel-status">
                    <strong>状态:</strong> <span id="helper-status-display">初始化...</span>
                </div>
                <div class="panel-controls">
                    <strong>最高期望速度:</strong>
                    <div id="playback-rate-buttons">
                        ${CONFIG.SPEED_TIERS.map(r => `<button class="rate-btn" data-rate="${r}">${r}x</button>`).join('')}
                    </div>
                    <button id="force-continue-btn" style="display: none; grid-column: span 5; background-color: #28a745; color: white; margin-top: 10px; border: none;">继续学习 (无视时长)</button>
                </div>
                <div class="panel-warning">脚本将从此速度开始尝试，并根据情况自动降速</div>
            </div>`;
        GM_addStyle(` #ai-helper-panel { position: fixed; bottom: 20px; right: 20px; width: 320px; background-color: rgba(247, 247, 247, 0.9); border: 1px solid #ccc; border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.15); z-index: 99999; font-family: sans-serif; font-size: 14px; padding: 15px; color: #333; transition: opacity 0.3s; backdrop-filter: blur(5px); } #ai-helper-panel:hover { opacity: 1; } #ai-helper-panel .panel-title { font-size: 16px; font-weight: bold; color: #007bff; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; } #ai-helper-panel .panel-controls { margin-bottom: 12px; display: grid; } #ai-helper-panel .panel-controls strong { display: block; margin-bottom: 8px; font-size: 13px; } #playback-rate-buttons { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; } #ai-helper-panel button { background-color: #fff; border: 1px solid #007bff; color: #007bff; padding: 6px 0; border-radius: 6px; cursor: pointer; transition: background-color 0.2s, color 0.2s; text-align: center; } #ai-helper-panel button.active { background-color: #007bff; color: #fff; font-weight: bold; } #ai-helper-panel .panel-warning { font-size: 11px; color: #999; text-align: center; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px; } `);
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        document.getElementById('playback-rate-buttons').addEventListener('click', async (e) => { const target = e.target.closest('button.rate-btn'); if (!target) return; const newRate = parseFloat(target.dataset.rate); STATE.maxPlaybackRate = newRate; updateActiveButtons(); await savePermanentState(); const playerContext = getPlayerContext(); if (playerContext) { const video = playerContext.querySelector('video'); if (video) { const pageUrl = window.location.href; if (!sessionState[pageUrl]) sessionState[pageUrl] = {}; sessionState[pageUrl].rate = newRate; await saveSessionState(); applyPlaybackRate(video, newRate); updateStatus(`速率已手动设置为: ${newRate}x`); } } });
        document.getElementById('force-continue-btn').addEventListener('click', () => { STATE.forceContinue = true; document.getElementById('force-continue-btn').style.display = 'none'; updateStatus('强制继续模式已激活...'); mainTick(); });
        updateActiveButtons();
    }

    // --- 核心页面逻辑 ---

    /**
     * @description 在视频页，处理当前课程分集的跳转。如果全系列完成，则通知目录页刷新。
     */
    async function playNextUncompletedVideo() { for (const item of document.querySelectorAll(CONFIG.VIDEO_SIDEBAR_ITEM_SELECTOR)) { if (!item.querySelector(CONFIG.VIDEO_SIDEBAR_PROGRESS_SELECTOR)?.innerText.includes(CONFIG.PROGRESS_COMPLETE_TEXT_VIDEO)) { if (!item.classList.contains('current')) { item.click(); } return; } } updateStatus('当前系列课程已全部完成！通知目录页刷新...'); await GM_setValue(CONFIG.STATUS_FLAG_KEY, 'refresh_needed'); window.close(); }

    /**
     * @description 目录页的核心处理函数，负责寻找下一个可学习的课程。
     */
    async function handleDirectoryPage() {
        // 步骤1：处理特殊状态（页面在后台、需要刷新、学习中）
        if (document.hidden) { updateStatus('目录页在后台，暂停操作'); return; }
        const taskStatus = await GM_getValue(CONFIG.STATUS_FLAG_KEY, 'initial');
        if (taskStatus === 'refresh_needed') { await GM_setValue(CONFIG.STATUS_FLAG_KEY, 'initial'); updateStatus('课程已完成，正在刷新目录以获取最新进度...'); location.reload(); return; }
        if (taskStatus === 'studying') { updateStatus('视频学习中，本页暂停...'); return; }

        // 步骤2：检查并满足“总学时”要求
        const requireP = Array.from(document.querySelectorAll('.class-survey .require')).find(p => p.textContent.includes('要求'));
        const completeP = Array.from(document.querySelectorAll('.class-survey .require')).find(p => p.textContent.includes('已学'));
        if (requireP && completeP) {
            const requiredMinutes = parseFloat(requireP.textContent.match(/[\d.]+/)?.[0] || 0);
            const completedMinutes = parseFloat(completeP.textContent.match(/[\d.]+/)?.[0] || 0);
            if (completedMinutes >= requiredMinutes && !STATE.forceContinue) {
                updateStatus('学习总时长已达标！');
                document.getElementById('force-continue-btn').style.display = 'block';
                await GM_setValue(CONFIG.STATUS_FLAG_KEY, 'all_done');
                return;
            }
        }

        // 步骤3：检查并设置页面大小为100
        const pageSizeDisplay = document.querySelector('#J_myOptionRecords_customlength .disval');
        if (pageSizeDisplay && pageSizeDisplay.textContent.trim() !== '100') { updateStatus('调整分页为100条/页...'); const dropdownTrigger = document.querySelector('#J_myOptionRecords_customlength'); if (dropdownTrigger) { dropdownTrigger.click(); setTimeout(() => { const option100 = document.querySelector('#J_myOptionRecords_customlength .dropmenu li[data="100"]'); if (option100) { option100.click(); } }, 200); } return; }

        const courseRows = document.querySelectorAll(CONFIG.DIRECTORY_COURSE_ROW_SELECTOR);
        if (courseRows.length === 0) { updateStatus('等待目录列表加载...'); return; }

        const failedCounts = await GM_getValue(CONFIG.FAILED_COURSES_KEY, {});

        // 步骤4：核心寻路逻辑：单次遍历，找到第一个可学习的课程
        for (const row of courseRows) {
            const progressCell = row.querySelectorAll('td')[CONFIG.DIRECTORY_PROGRESS_COLUMN_INDEX];
            if (!progressCell) continue;
            const progressValue = parseFloat(progressCell.textContent);
            if (isNaN(progressValue) || progressValue >= 100) continue;

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
            await GM_setValue(CONFIG.STATUS_FLAG_KEY, 'studying');
            actionButton.click();
            return;
        }

        // 步骤5：若循环结束仍未找到，则宣告全部完成
        updateStatus('恭喜！所有可用课程均已完成。');
        await GM_setValue(CONFIG.STATUS_FLAG_KEY, 'all_done');
    }

    /**
     * @description 视频播放页的核心处理函数
     */
    async function handleVideoPage() {
        if (STATE.isEvaluatingProgress) { updateStatus('评估进度中，请稍候...'); return; }
        const playerContext = getPlayerContext();
        if (!playerContext) { updateStatus('等待播放器宿主加载...'); return; }
        const video = playerContext.querySelector('video');
        const currentItem = document.querySelector(CONFIG.VIDEO_SIDEBAR_ITEM_SELECTOR + '.current');
        if (!video || !currentItem) { updateStatus('等待视频和课程信息加载...'); return; }
        const progressEl = currentItem.querySelector(CONFIG.VIDEO_SIDEBAR_PROGRESS_SELECTOR);
        if (!progressEl) { updateStatus('等待进度元素加载...'); return; }

        const progressText = progressEl.innerText.trim();
        const pageUrl = window.location.href;
        let videoState = sessionState[pageUrl];
        if (!videoState) { videoState = { rate: STATE.maxPlaybackRate, lastProgress: 0, lastPlayAttemptTime: 0, playAttemptCounter: 0 }; sessionState[pageUrl] = videoState; await saveSessionState(); }
        if (typeof videoState.playAttemptCounter === 'undefined') { videoState.playAttemptCounter = 0; }

        if (progressText.includes(CONFIG.PROGRESS_COMPLETE_TEXT_VIDEO)) { updateStatus(`本集已完成 (100%)，寻找下一集...`); delete sessionState[pageUrl]; await saveSessionState(); await playNextUncompletedVideo(); return; }
        const currentProgress = parseFloat(progressText) || 0;
        if (currentProgress > videoState.lastProgress) { videoState.lastProgress = currentProgress; videoState.playAttemptCounter = 0; await saveSessionState(); }

        if (!video.seeking && video.duration > 0 && video.currentTime >= video.duration - 0.5) {
            video.pause(); STATE.isEvaluatingProgress = true; updateStatus(`播放完毕，评估进度 (${currentProgress}%)...`);
            const progressElementOfFinishedVideo = currentItem.querySelector(CONFIG.VIDEO_SIDEBAR_PROGRESS_SELECTOR);
            setTimeout(async () => {
                const latestProgress = parseFloat(progressElementOfFinishedVideo ? progressElementOfFinishedVideo.innerText.trim() : videoState.lastProgress);
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
                applyPlaybackRate(video, videoState.rate);
            }, 2000);
            return;
        }

        applyPlaybackRate(video, videoState.rate);
        if (video.paused) {
            const lastAttempt = videoState.lastPlayAttemptTime || 0;
            if (Date.now() - lastAttempt > CONFIG.PLAY_DEBOUNCE_PERIOD) {
                updateStatus(`检测到暂停，尝试自动播放 (第 ${videoState.playAttemptCounter + 1} 次)...`);
                if (clickPlayButton(playerContext)) {
                    videoState.lastPlayAttemptTime = Date.now();
                    videoState.playAttemptCounter++;
                    await saveSessionState();
                    if (videoState.playAttemptCounter > CONFIG.MAX_PLAY_ATTEMPTS) {
                        updateStatus(`已连续尝试 ${CONFIG.MAX_PLAY_ATTEMPTS} 次播放失败，放弃此课程...`);
                        const failedCounts = await GM_getValue(CONFIG.FAILED_COURSES_KEY, {});
                        const courseId = new URL(pageUrl).searchParams.get('courseId');
                        if (courseId) { failedCounts[courseId] = (failedCounts[courseId] || 0) + 1; }
                        await GM_setValue(CONFIG.FAILED_COURSES_KEY, failedCounts);
                        await GM_setValue(CONFIG.STATUS_FLAG_KEY, 'initial');
                        window.close();
                        return;
                    }
                }
            } else { updateStatus('等待播放器响应...'); }
        } else {
            updateStatus(`播放中 (速率: ${video.playbackRate}x, 进度: ${currentProgress}%)`);
        }
    }

    /**
     * @description 主心跳函数，作为任务路由，根据当前页面URL分发任务。
     */
    async function mainTick() { if (window.location.href.includes(CONFIG.DIRECTORY_PAGE_IDENTIFIER)) { await handleDirectoryPage(); } else if (window.location.href.includes(CONFIG.VIDEO_PAGE_IDENTIFIER)) { await handleVideoPage(); } else { updateStatus('在未知页面或等待跳转...'); } }

    // =================================================================
    // --- 4. 启动区 (ENTRY POINT) ---
    // =================================================================
    (async function() {
        try {
            console.log('EnaeaAssistant-学习公社16X速全自动 V10.0.0 已加载。');
            await loadState();
            createControlPanel();
            if (window.location.href.includes(CONFIG.DIRECTORY_PAGE_IDENTIFIER)) {
                 await GM_setValue(CONFIG.STATUS_FLAG_KEY, 'initial');
                 if (!sessionStorage.getItem('enaea_session_started')) {
                    await GM_setValue(CONFIG.FAILED_COURSES_KEY, {}); // 新会话开始时，清空失败计数器
                    sessionStorage.setItem('enaea_session_started', 'true');
                 }
            }
            setInterval(mainTick, CONFIG.TICK_INTERVAL);
        } catch (error) {
            console.error("【脚本启动时发生严重错误】:", error);
            alert("脚本启动失败！请按F12查看控制台报错信息。");
        }
    })();
})();