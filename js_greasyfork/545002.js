// ==UserScript==
// @name         华医网自动看课助手 (V2.0.0 CC播放器适配版)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  【强力防暂停 + 适配新版CC播放器】通过直接控制HTML5 video元素，实现后台挂机、自动静音、自动播放、处理弹窗、播放完自动跳转下一集。全自动建立学习队列，可视化面板显示进度。
// @author       Gemini & Your Name
// @match        *://*.91huayi.com/pages/course_ware.aspx*
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545002/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E5%8A%A9%E6%89%8B%20%28V200%20CC%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%82%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545002/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E5%8A%A9%E6%89%8B%20%28V200%20CC%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%82%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const CHECK_INTERVAL = 2000; // 每2秒检查一次播放状态
    const END_THRESHOLD = 2.5;   // 视频剩余多少秒时算作播放完毕

    // --- 数据存储 ---
    const db = {
        load: (key, def) => JSON.parse(GM_getValue(key, JSON.stringify(def))),
        save: (key, val) => GM_setValue(key, JSON.stringify(val)),
    };
    const learningQueueDB = {
        key: 'learning_queue_v2_0', // 使用新版本key避免旧数据冲突
        get: () => db.load(learningQueueDB.key, []),
        set: (data) => db.save(learningQueueDB.key, data),
        clear: () => GM_deleteValue(learningQueueDB.key)
    };

    // --- 状态管理 ---
    let scriptState = {
        isRunning: false,
        mainIntervalId: null,
        isProcessingEnd: false, // 是否正在处理视频结束逻辑
        videoElement: null,     // 缓存video元素
    };

    // --- 辅助函数 ---
    const formatTime = (s) => (s = Math.floor(s || 0), `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`);
    const log = (message) => console.log(`[华医网助手] ${message}`);

    // --- 核心功能 ---

    /**
     * V2.0 改造核心：扫描课程列表，建立待看队列
     * 此函数逻辑与旧版兼容，无需修改。
     */
    function buildAndStoreCourseList() {
        if (learningQueueDB.get().length > 0) return;
        log("扫描页面，建立学习队列...");
        const allLessons = document.querySelectorAll('.lis-inside-content');
        const currentLessonMarker = document.getElementById('top_play');
        if (!currentLessonMarker) {
            log("错误：未找到当前播放的课程标记(#top_play)，无法建立队列。");
            return;
        }
        const currentLessonLi = currentLessonMarker.closest('.lis-inside-content');
        if (!currentLessonLi) return;

        let foundCurrent = false;
        const queue = [];

        for (const lesson of allLessons) {
            // 定位到当前课程，从下一个开始处理
            if (lesson === currentLessonLi) {
                foundCurrent = true;
                continue;
            }
            if (foundCurrent) {
                const statusButton = lesson.querySelector('button');
                // 只添加未完成的课程
                if (!statusButton || (statusButton.innerText.trim() !== '已完成' && statusButton.innerText.trim() !== '待考试')) {
                    const h2 = lesson.querySelector('h2');
                    const onclickAttr = h2 ? h2.getAttribute('onclick') : null;
                    const urlMatch = onclickAttr ? onclickAttr.match(/'(.*?)'/) : null;
                    if (urlMatch && urlMatch[1]) {
                        queue.push({ name: h2.innerText.trim().replace(/^\d+、\s*/, ''), url: urlMatch[1] });
                    }
                }
            }
        }
        learningQueueDB.set(queue);
        log(`队列建立完毕，发现 ${queue.length} 个待看课程。`);
        updatePanel();
    }

    /**
     * V2.0 改造核心：处理各种弹窗
     * 选择器兼容新旧页面结构。
     */
    function findAndClickPopups() {
        // 涵盖了“温馨提示”、“继续学习”、“绑定提示”等各类弹窗的确认按钮
        const selectors = [
            '#div_preview1 #btnPay',     // "继续学习" 按钮
            '#div_preview2 .rig_btn',    // 试看结束后的 "继续学习" 按钮
            '#div_tip .rig_btn',         // "提示" 弹窗的 "是" 按钮
            '.study_diaog .btn_sign',    // 旧版可能存在的签到按钮
            '#div_processbar_tip .rig_btn' // 旧版可能存在的进度提示按钮
        ];
        for (const selector of selectors) {
            const button = document.querySelector(selector);
            // 确保按钮可见且可点击
            if (button && button.offsetParent !== null) {
                log(`发现弹窗，点击 -> ${button.value || button.innerText}`);
                button.click();
            }
        }
    }

    /**
     * V2.0 改造核心：主循环任务
     * 完全基于 HTML5 <video> 元素进行操作，不再依赖特定播放器API。
     */
    function mainLoop() {
        if (!scriptState.isRunning || scriptState.isProcessingEnd) return;

        findAndClickPopups();

        // 查找并缓存 video 元素
        if (!scriptState.videoElement) {
            // 这个选择器能同时兼容新旧页面的视频播放器位置
            scriptState.videoElement = document.querySelector('#video video, .video video');
            if (!scriptState.videoElement) {
                log("等待播放器加载...");
                updateProgressUI('等待播放器...');
                return;
            }
            log("播放器 video 元素已找到！");
        }

        const video = scriptState.videoElement;

        try {
            // 1. 强制静音 (更可靠的方式)
            if (!video.muted) {
                video.muted = true;
                log("已强制静音。");
            }

            // 2. 检查是否暂停，如果是则播放
            if (video.paused && !video.ended) {
                video.play().catch(e => log(`尝试播放失败: ${e.message}`));
                log("检测到视频暂停，已尝试恢复播放。");
            }

            const currentTime = video.currentTime;
            const duration = video.duration;

            // 3. 检查是否播放完毕
            // (条件：有有效时长，且没结束，且快要结束了)
            if (duration > 0 && !video.ended && (duration - currentTime < END_THRESHOLD)) {
                log(`检测到视频播放完毕 (进度: ${formatTime(currentTime)} / ${formatTime(duration)})，准备切换。`);
                scriptState.isProcessingEnd = true; // 设置标志，防止重复触发
                processNextInQueue();
                return; // 立即退出本次循环，等待页面跳转
            }

             // 4. 更新UI进度
            updateProgressUI();

        } catch (e) {
             log(`主循环发生错误: ${e.message}`);
             // 重置video元素，以便下次循环重新查找
             scriptState.videoElement = null;
        }
    }

    /**
     * 更新控制面板上的进度显示
     */
    function updateProgressUI(customMessage = '') {
        const progressEl = document.getElementById('video-progress-status');
        if (!progressEl) return;

        if (customMessage) {
            progressEl.textContent = customMessage;
            return;
        }

        if (scriptState.videoElement) {
             const video = scriptState.videoElement;
             const currentTime = video.currentTime;
             const duration = video.duration;
             if (duration > 0) {
                 progressEl.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
             } else {
                 progressEl.textContent = '加载中...';
             }
        } else {
            progressEl.textContent = '未开始';
        }
    }

    /**
     * 处理队列中的下一个课程
     * 此函数无需修改。
     */
    function processNextInQueue() {
        log("处理队列中的下一个课程...");
        let queue = learningQueueDB.get();
        if (queue.length > 0) {
            const nextCourse = queue.shift();
            learningQueueDB.set(queue);
            log(`将在3秒后跳转到 -> ${nextCourse.name}`);
            setTimeout(() => { window.location.href = nextCourse.url; }, 3000);
        } else {
            log("恭喜！学习队列已清空，所有课程均已完成。");
            learningQueueDB.clear();
            stopScript();
            alert("恭喜！所有课程均已完成，脚本自动停止。");
        }
    }

    // --- 脚本生命周期与UI控制 (无需修改) ---

    function startScript() {
        if (scriptState.isRunning) return;
        scriptState.isRunning = true;
        if (learningQueueDB.get().length === 0) {
            buildAndStoreCourseList();
        }
        scriptState.mainIntervalId = setInterval(mainLoop, CHECK_INTERVAL);
        updatePanel();
        log("脚本已启动。");
        mainLoop(); // 立即执行一次
    }

    function stopScript() {
        if (!scriptState.isRunning) return;
        clearInterval(scriptState.mainIntervalId);
        scriptState.mainIntervalId = null;
        scriptState.isRunning = false;
        scriptState.isProcessingEnd = false;
        scriptState.videoElement = null;
        updatePanel();
        log("脚本已停止。");
    }

    function setupUI() {
        const panel = document.createElement('div');
        panel.id = 'auto-video-panel';
        document.body.appendChild(panel);
        GM_addStyle(`
            #auto-video-panel { position: fixed; bottom: 20px; right: 20px; background-color: #e6f7ff; border: 2px solid #1890ff; border-radius: 8px; padding: 15px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 280px; }
            #auto-video-panel h3 { margin: 0 0 12px 0; color: #1890ff; text-align: center; font-size: 16px; }
            #auto-video-panel button { width: 100%; padding: 10px; border: none; border-radius: 5px; color: white; cursor: pointer; font-size: 14px; transition: background-color 0.2s; margin-bottom: 10px; }
            #auto-video-panel button.start { background-color: #52c41a; }
            #auto-video-panel button.stop { background-color: #f5222d; }
            #auto-video-panel p { margin: 8px 0 0 0; font-size: 12px; }
            #auto-video-panel strong { color: #333; }
            #script-status-text, #video-progress-status { font-weight: bold; }
            #queue-list-container { background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 5px 10px; margin-top: 10px; max-height: 120px; overflow-y: auto; font-size: 12px; }
            #queue-list-container ol { margin: 0; padding-left: 20px; }
            #queue-list-container li { margin-bottom: 5px; color: #555; }
            .empty-queue { color: #888; text-align: center; font-style: italic; padding: 10px 0; }
        `);
        panel.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                scriptState.isRunning ? stopScript() : startScript();
            }
        });
        updatePanel();
    }

    function updatePanel() {
        const panel = document.getElementById('auto-video-panel');
        if (!panel) return;
        const isRunning = scriptState.isRunning;
        const queue = learningQueueDB.get();
        let queueHtml = '<p class="empty-queue">队列为空或已学完</p>';
        if (queue.length > 0) {
            queueHtml = '<ol>' + queue.map(course => `<li>${course.name}</li>`).join('') + '</ol>';
        }
        panel.innerHTML = `
            <h3>自动看课助手 (V2.0.0)</h3>
            <button class="${isRunning ? 'stop' : 'start'}">${isRunning ? '暂停自动看课' : '开始自动看课'}</button>
            <p><strong>状态:</strong> <span id="script-status-text" style="color: ${isRunning ? '#52c41a' : '#f5222d'};">${isRunning ? '运行中...' : '已停止'}</span></p>
            <p><strong>进度:</strong> <span id="video-progress-status" style="color:#1890ff;">未开始</span></p>
            <strong>待看列表 (${queue.length}个):</strong>
            <div id="queue-list-container">${queueHtml}</div>
        `;
        updateProgressUI();
    }

    function init() {
        log("脚本(V2.0.0 CC播放器适配版)已加载。");
        setupUI();
        // 如果是从一个课程跳转过来的，并且队列里还有课，则自动开始
        if (window.location.search.includes('cwid=') && learningQueueDB.get().length > 0) {
             log("检测到从上一课程跳转而来，将在3秒后自动开始。");
             setTimeout(startScript, 3000); // 延迟启动，等待页面和播放器充分加载
        }
    }

    // 使用 load 事件确保页面所有资源（包括播放器脚本）都加载完毕
    window.addEventListener('load', init);

})();