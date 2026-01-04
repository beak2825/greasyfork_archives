// ==UserScript==
// @name         岐黄天使刷课助手 - UI模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.4.3
// @description  岐黄天使刷课助手的用户界面模块，负责生成和管理控制面板及相关UI元素。
// @author       AI助手
// ==/UserScript==

// UI模块
(function() {
    'use strict';

    // 创建控制面板
    function createPanel() {
        console.log('[UI模块] createPanel 函数开始执行');

        // 强制初始化 window.qh 对象和必要属性
        try {
            if (!window.qh) {
                window.qh = {};
                console.log('[UI模块] 初始化 window.qh 对象');
            }

            if (!window.qh.questionBankData) {
                window.qh.questionBankData = [];
                console.log('[UI模块] 初始化 window.qh.questionBankData 为空数组');
            }

            if (typeof window.qh.panelCreated === 'undefined') {
                window.qh.panelCreated = false;
                console.log('[UI模块] 初始化 window.qh.panelCreated 为 false');
            }

            if (!window.qh.courseList) {
                window.qh.courseList = [];
                console.log('[UI模块] 初始化 window.qh.courseList 为空数组');
            }

            if (typeof window.qh.currentCourseIndex === 'undefined') {
                window.qh.currentCourseIndex = 0;
                console.log('[UI模块] 初始化 window.qh.currentCourseIndex 为 0');
            }

        } catch (e) {
            console.error('[UI模块] 初始化 window.qh 对象时出错:', e);
            return;
        }

        // 检查是否在iframe中，如果是则不创建面板
        try {
            if (window.self !== window.top) {
                console.log('[UI模块] 在iframe中，不创建控制面板');
                return;
            }
        } catch (e) {
            console.error('[UI模块] 检查iframe状态出错:', e);
            return;
        }

        // 检查是否已经创建过面板，避免重复创建
        if (window.qh.panelCreated || document.querySelector('.qh-assistant-panel')) {
            console.log('[UI模块] 面板已存在，跳过创建');
            // 如果面板已存在但不可见，则显示它
            const existingPanel = document.querySelector('.qh-assistant-panel');
            if (existingPanel && existingPanel.style.display === 'none') {
                existingPanel.style.display = 'block';
                console.log('[UI模块] 显示已存在的面板');
            }
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'qh-assistant-panel';
        panel.id = 'qh-assistant-panel';
        panel.innerHTML = `
            <div class="qh-assistant-title">
                岐黄天使刷课助手 v1.4.0
                <span class="qh-assistant-minimize">_</span>
                <span class="qh-assistant-close">✖</span>
            </div>
            <div class="qh-assistant-content">
                <div><span>状态:</span> <span id="qh-status">初始化中...</span></div>
                <div><span>当前课程:</span> <span id="qh-current-course">无</span></div>
                <div><span>进度:</span> <span id="qh-progress">0%</span></div>
                <div class="qh-assistant-progress">
                    <div class="qh-assistant-progress-bar" id="qh-progress-bar"></div>
                </div>
                <div><span>每日上限:</span> <span id="qh-daily-limit-status">未检测</span></div>
                <div><span>距离重置:</span> <span id="qh-daily-limit-countdown">--:--:--</span></div>
                <div style="text-align: center; margin-top: 5px;">
                    <button class="qh-assistant-btn" id="qh-manual-reset-btn" style="background: linear-gradient(90deg, #607D8B, #455A64); font-size: 12px; padding: 4px 8px;">手动重置上限</button>
                </div>
            </div>
            <div class="qh-assistant-nav-btns">
                <button class="qh-assistant-nav-btn" id="qh-prev-btn" disabled>上一课</button>
                <button class="qh-assistant-nav-btn" id="qh-next-btn" disabled>下一课</button>
            </div>
            <button class="qh-assistant-btn" id="qh-toggle-btn">开始自动刷课</button>
            <button class="qh-assistant-btn" id="qh-get-questions-btn" style="background: linear-gradient(90deg, #FF9800, #F57C00);">查看题库</button>
            <button class="qh-assistant-btn" id="qh-auto-answer-btn" style="background: linear-gradient(90deg, #E91E63, #C2185B);">自动答题</button>
            <button class="qh-assistant-btn" id="qh-chapter-exam-btn" style="background: linear-gradient(90deg, #9C27B0, #7B1FA2);">章节考试</button>
            <button class="qh-assistant-btn" id="qh-final-exam-btn" style="background: linear-gradient(90deg, #3F51B5, #303F9F);">结业考试</button>
            <button class="qh-assistant-btn" id="qh-auto-flow-btn" style="background: linear-gradient(90deg, #FF5722, #E64A19);">自动化设置</button>
            <div id="qh-question-status" style="font-size: 12px; text-align: center; margin-top: 5px; color: rgba(255,255,255,0.7);">
                题库状态: 未加载
            </div>
        `;

        try {
            document.body.appendChild(panel);
            window.qh.panelCreated = true;
            console.log('[UI模块] ✅ 控制面板创建成功');
        } catch (e) {
            console.error('[UI模块] ❌ 添加面板到页面时出错:', e);
            return;
        }

        // 绑定事件处理器
        try {
            // 绑定关闭按钮事件
            const closeBtn = document.querySelector('.qh-assistant-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    panel.style.display = 'none';
                });
                console.log('[UI模块] 关闭按钮事件绑定成功');
            }

            // 绑定最小化按钮事件
            const minimizeBtn = document.querySelector('.qh-assistant-minimize');
            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', function() {
                    panel.classList.toggle('minimized');
                    if (panel.classList.contains('minimized')) {
                        this.textContent = '+';
                    } else {
                        this.textContent = '_';
                    }
                });
                console.log('[UI模块] 最小化按钮事件绑定成功');
            }
        } catch (e) {
            console.error('[UI模块] 绑定基础按钮事件时出错:', e);
        }

        // 绑定功能按钮事件
        try {
            // 绑定开始/暂停按钮事件
            const toggleBtn = document.getElementById('qh-toggle-btn');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    if (typeof toggleAutoLearn === 'function') {
                        toggleAutoLearn();
                    } else {
                        console.warn('[UI模块] toggleAutoLearn 函数不可用');
                    }
                });
                console.log('[UI模块] 开始/暂停按钮事件绑定成功');
            }

            // 绑定上一课按钮事件
            const prevBtn = document.getElementById('qh-prev-btn');
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    if (typeof navigateToPrevCourse === 'function') {
                        navigateToPrevCourse();
                    } else {
                        console.warn('[UI模块] navigateToPrevCourse 函数不可用');
                    }
                });
                console.log('[UI模块] 上一课按钮事件绑定成功');
            }

            // 绑定下一课按钮事件
            const nextBtn = document.getElementById('qh-next-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    if (typeof navigateToNextCourse === 'function') {
                        navigateToNextCourse();
                    } else {
                        console.warn('[UI模块] navigateToNextCourse 函数不可用');
                    }
                });
                console.log('[UI模块] 下一课按钮事件绑定成功');
            }
        } catch (e) {
            console.error('[UI模块] 绑定导航按钮事件时出错:', e);
        }

        // 绑定其他功能按钮事件
        try {
            // 绑定获取题目和答案按钮事件
            const questionsBtn = document.getElementById('qh-get-questions-btn');
            if (questionsBtn) {
                questionsBtn.addEventListener('click', function() {
                    if (typeof showQuestionPanel === 'function') {
                        showQuestionPanel();
                    } else {
                        console.warn('[UI模块] showQuestionPanel 函数不可用');
                    }
                });
                console.log('[UI模块] 查看题库按钮事件绑定成功');
            }

            // 绑定自动答题按钮事件
            const autoAnswerBtn = document.getElementById('qh-auto-answer-btn');
            if (autoAnswerBtn) {
                autoAnswerBtn.addEventListener('click', function() {
                    if (typeof toggleAutoAnswer === 'function') {
                        toggleAutoAnswer();
                    } else {
                        console.warn('[UI模块] toggleAutoAnswer 函数不可用');
                    }
                });
                console.log('[UI模块] 自动答题按钮事件绑定成功');
            }

            // 绑定章节考试按钮事件
            const chapterExamBtn = document.getElementById('qh-chapter-exam-btn');
            if (chapterExamBtn) {
                chapterExamBtn.addEventListener('click', function() {
                    if (typeof showChapterExamPanel === 'function') {
                        showChapterExamPanel();
                    } else {
                        console.warn('[UI模块] showChapterExamPanel 函数不可用');
                    }
                });
                console.log('[UI模块] 章节考试按钮事件绑定成功');
            }

            // 绑定结业考试按钮事件
            const finalExamBtn = document.getElementById('qh-final-exam-btn');
            if (finalExamBtn) {
                finalExamBtn.addEventListener('click', function() {
                    if (typeof checkFinalExamStatus === 'function') {
                        checkFinalExamStatus();
                    } else {
                        console.warn('[UI模块] checkFinalExamStatus 函数不可用');
                    }
                });
                console.log('[UI模块] 结业考试按钮事件绑定成功');
            }

            // 绑定自动化设置按钮事件
            const autoFlowBtn = document.getElementById('qh-auto-flow-btn');
            if (autoFlowBtn) {
                autoFlowBtn.addEventListener('click', function() {
                    if (typeof showAutoFlowSettingsPanel === 'function') {
                        showAutoFlowSettingsPanel();
                    } else {
                        console.warn('[UI模块] showAutoFlowSettingsPanel 函数不可用');
                    }
                });
                console.log('[UI模块] 自动化设置按钮事件绑定成功');
            }

            // 绑定手动重置上限按钮事件
            const manualResetBtn = document.getElementById('qh-manual-reset-btn');
            if (manualResetBtn) {
                manualResetBtn.addEventListener('click', function() {
                    if (window.qh && window.qh.dailyLimitManager && typeof window.qh.dailyLimitManager.manualReset === 'function') {
                        console.log('[UI模块] 执行手动重置每日上限');
                        window.qh.dailyLimitManager.manualReset();
                        alert('每日学习上限已手动重置！');
                    } else {
                        console.warn('[UI模块] dailyLimitManager 不可用');
                        alert('每日上限管理器未初始化，无法重置');
                    }
                });
                console.log('[UI模块] 手动重置按钮事件绑定成功');
            }

            console.log('[UI模块] ✅ 所有按钮事件绑定完成');
        } catch (e) {
            console.error('[UI模块] 绑定功能按钮事件时出错:', e);
        }

        console.log('[UI模块] ✅ createPanel 函数执行完成');
    };

    // 更新状态显示
    function updateStatus(status) {
        // 在控制台记录状态，确保在iframe中也能看到
        console.log('状态更新:', status);

        // 尝试更新UI状态
        const statusEl = document.getElementById('qh-status');
        if (statusEl) {
            statusEl.textContent = status;
        }

        // 如果在iframe中，尝试向父窗口发送消息
        try {
            if (window.self !== window.top) {
                window.parent.postMessage({
                    type: 'qh-status-update',
                    status: status
                }, '*');
            }
        } catch (e) {
            console.error('向父窗口发送状态更新失败:', e);
        }
    };

    // 更新当前课程显示
    function updateCurrentCourse(course) {
        const courseEl = document.getElementById('qh-current-course');
        if (courseEl) {
            if (course && course.trim()) {
                courseEl.textContent = course;
                console.log('更新当前课程:', course);
            } else {
                // 如果没有提供课程名称，尝试从页面中获取
                const detectedCourse = detectCurrentCourse();
                if (detectedCourse) {
                    courseEl.textContent = detectedCourse;
                    console.log('自动检测到当前课程:', detectedCourse);
                } else {
                    courseEl.textContent = '无';
                    console.log('未能检测到当前课程');
                }
            }
        }
    };

    // 检测当前页面课程标题
    function detectCurrentCourse() {
        try {
            // 1. 首先尝试从kcTitle元素获取（最优先）
            const kcTitleElement = document.getElementById('kcTitle');
            if (kcTitleElement && kcTitleElement.textContent.trim()) {
                const title = kcTitleElement.textContent.trim();
                console.log('从kcTitle元素获取课程:', title);
                return title;
            }

            // 2. 尝试从iframe中查找kcTitle元素
            const frames = document.querySelectorAll('iframe');
            for (const frame of frames) {
                try {
                    const frameDoc = frame.contentDocument || frame.contentWindow.document;
                    const frameTitleElement = frameDoc.getElementById('kcTitle');
                    if (frameTitleElement && frameTitleElement.textContent.trim()) {
                        const title = frameTitleElement.textContent.trim();
                        console.log('从iframe中的kcTitle元素获取课程:', title);
                        return title;
                    }
                } catch (e) {
                    console.error('无法访问iframe内容:', e);
                }
            }

            // 3. 如果从navigateToCourse函数中提取了视频ID和标题，使用该信息
            if (window.qh.lastExtractedVideoInfo) {
                console.log('使用上次提取的视频信息:', window.qh.lastExtractedVideoInfo);
                return window.qh.lastExtractedVideoInfo;
            }

            // 4. 尝试从当前活动的课程链接获取
            if (window.qh.courseList.length > 0 && window.qh.currentCourseIndex >= 0 && window.qh.currentCourseIndex < window.qh.courseList.length) {
                return window.qh.courseList[window.qh.currentCourseIndex].title;
            }

            return null;
        } catch (e) {
            console.error('检测当前课程出错:', e);
            return null;
        }
    }

    // 更新进度条显示
    function updateProgress(progress) {
        const progressEl = document.getElementById('qh-progress');
        const progressBarEl = document.getElementById('qh-progress-bar');
        if (progressEl && progressBarEl) {
            progressEl.textContent = progress + '%';
            progressBarEl.style.width = progress + '%';
        }
    };

    // 更新按钮状态
    function updateButtonStatus() {
        // 获取当前状态，如果GM_getValue不可用，则使用localStorage
        let isRunning;
        if (typeof GM_getValue !== 'undefined') {
            isRunning = GM_getValue('qh-is-running', false);
        } else {
            isRunning = localStorage.getItem('qh-is-running') === 'true';
        }

        const btn = document.getElementById('qh-toggle-btn');
        if (btn) {
            btn.textContent = isRunning ? '暂停自动刷课' : '开始自动刷课';
            // 使用背景渐变而不是backgroundColor，以匹配CSS样式
            if (isRunning) {
                btn.style.background = 'linear-gradient(90deg, #f44336, #e53935)';
            } else {
                btn.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
            }
            console.log('播放状态已更新:', isRunning ? '播放中' : '已暂停');
        }

        // 更新题库状态显示 (增强安全检查)
        const qStatusEl = document.getElementById('qh-question-status');
        if (qStatusEl) {
            try {
                // 确保 window.qh 和 questionBankData 都存在且为数组
                if (window.qh &&
                    window.qh.questionBankData &&
                    Array.isArray(window.qh.questionBankData) &&
                    window.qh.questionBankData.length > 0) {
                    qStatusEl.textContent = `题库: ${window.qh.questionBankData.length} 道`;
                } else {
                    // 初始化 questionBankData 如果不存在
                    if (window.qh && !window.qh.questionBankData) {
                        window.qh.questionBankData = [];
                        console.log('[UI模块] 初始化 questionBankData 为空数组');
                    }
                    qStatusEl.textContent = '题库: 未加载或为空';
                }
            } catch (error) {
                console.error('[UI模块] 更新题库状态时出错:', error);
                qStatusEl.textContent = '题库: 状态错误';

                // 确保 questionBankData 被正确初始化
                if (window.qh && !Array.isArray(window.qh.questionBankData)) {
                    window.qh.questionBankData = [];
                    console.log('[UI模块] 修复 questionBankData 初始化');
                }
            }
        }
    }

    // 更新上一课/下一课按钮状态
    function updateNavButtons(canPrev, canNext) {
        const prevBtn = document.getElementById('qh-prev-btn');
        const nextBtn = document.getElementById('qh-next-btn');
        if (prevBtn) {
            prevBtn.disabled = !canPrev;
        }
        if (nextBtn) {
            nextBtn.disabled = !canNext;
        }
    }

    // 更新每日学习上限相关的UI元素
    function updateDailyLimitDisplay(statusText, countdownText) {
        const limitStatusEl = document.getElementById('qh-daily-limit-status');
        const countdownEl = document.getElementById('qh-daily-limit-countdown');

        if (limitStatusEl) {
            limitStatusEl.textContent = statusText;
        }
        if (countdownEl) {
            countdownEl.textContent = countdownText;
        }
    }

    // 导出模块API
    window.qh = window.qh || {};
    window.qh.createPanel = createPanel; // 保留导出以防万一，但主要应由模块自行调用
    window.qh.updateStatus = updateStatus;
    window.qh.updateCurrentCourse = updateCurrentCourse;
    window.qh.detectCurrentCourse = detectCurrentCourse;
    window.qh.updateProgress = updateProgress;
    window.qh.updateButtonStatus = updateButtonStatus;
    window.qh.updateNavButtons = updateNavButtons;
    window.qh.updateDailyLimitDisplay = updateDailyLimitDisplay;
    // window.showQuestionPanel 由 questionBank.js 或类似模块处理，这里不重复导出
    // 其他按钮的点击事件直接绑定，不需要导出其处理函数

    // 模块加载时自动创建面板
    function initUI() {
        console.log('[UI模块] 准备初始化UI...');
        // 确保 qh 对象存在
        window.qh = window.qh || {};
        createPanel();
        // 可以在这里进行其他UI相关的初始化设置
        // 例如，根据存储的状态更新按钮文本等
        updateButtonStatus(); // 根据初始状态更新按钮
        updateNavButtons(false, false); // 初始禁用导航按钮
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        // DOMContentLoaded has already fired or state is 'interactive' or 'complete'
        setTimeout(initUI, 0); // Use setTimeout to ensure it runs after current script block
    }

    console.log('[模块加载] ui 模块已加载并配置为自动初始化');
})();
