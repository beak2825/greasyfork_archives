// ==UserScript==
// @name         超星自动采集（优化版）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  超星自动采集 - 支持单个考试页面和考试列表页面（性能优化版）
// @author       You
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/work/dowork*
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/exam/lookpaper*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @require      https://unpkg.com/layui@2.11.2/dist/layui.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537974/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537974/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局配置
    const CONFIG = {
        API_ENDPOINT: 'http://localhost:5000/api/questions/add', // 主要API端点
        API_ENDPOINTS: ['http://localhost:5000/api/questions/add', 'http://127.0.0.1:5000/api/questions/add'], // 备用端点列表
        MAX_RETRIES: 2,
        RETRY_DELAY: 1000, // 重试间隔（毫秒）
        AUTO_COLLECT_DELAY: 500,
        NOTIFICATION_DURATION: 3000,
        AUTO_CLOSE_DELAY: 100,
        BATCH_SIZE: 20, // 批量处理题目时的批次大小
        DEBUG: true // 调试模式
    };

    // 日志工具
    const Logger = {
        log: function (message, data) {
            if (CONFIG.DEBUG) {
                console.log(`[超星采集] ${message}`, data || '');
            }
        },
        warn: function (message, data) {
            if (CONFIG.DEBUG) {
                console.warn(`[超星采集] ${message}`, data || '');
            }
        },
        error: function (message, error) {
            console.error(`[超星采集] ${message}`, error || '');
        }
    };

    // 检测当前页面类型
    const PageDetector = {
        isExamPage: location.href.includes('/exam/lookpaper'),
        isExamListPage: function () {
            return this.isExamPage && !!document.querySelector('.dataBody');
        },
        isExamDetailPage: function () {
            return this.isExamPage && !!document.querySelector('.stem_con');
        },
        detectPageType: function () {
            if (this.isExamListPage()) {
                return 'examList';
            } else if (this.isExamDetailPage()) {
                return 'examDetail';
            }
            return 'unknown';
        }
    };

    // 创建全局状态对象
    const state = {
        examLinks: [],
        currentExamIndex: 0,
        isCollecting: false,
        totalCollected: 0,
        startTime: null,
        // 新增：本地存储支持
        saveState: function () {
            const stateToSave = {
                examLinks: this.examLinks,
                currentExamIndex: this.currentExamIndex,
                totalCollected: this.totalCollected
            };
            localStorage.setItem('examCollectorState', JSON.stringify(stateToSave));
            Logger.log('状态已保存到本地存储');
        },
        loadState: function () {
            try {
                const savedState = localStorage.getItem('examCollectorState');
                if (savedState) {
                    const parsedState = JSON.parse(savedState);
                    this.examLinks = parsedState.examLinks || [];
                    this.currentExamIndex = parsedState.currentExamIndex || 0;
                    this.totalCollected = parsedState.totalCollected || 0;
                    Logger.log('从本地存储加载状态成功');
                    return true;
                }
            } catch (e) {
                Logger.error('从本地存储加载状态失败', e);
            }
            return false;
        },
        clearState: function () {
            localStorage.removeItem('examCollectorState');
            Logger.log('本地存储状态已清除');
        }
    };

    // 根据页面类型执行不同的初始化
    const pageType = PageDetector.detectPageType();
    Logger.log(`检测到页面类型: ${pageType}`);

    if (pageType === 'examList') {
        initExamListPage();
    } else if (pageType === 'examDetail') {
        initExamDetailPage();
    } else {
        Logger.warn('未知页面类型，脚本停止执行');
        return;
    }

    // 考试列表页面初始化函数
    function initExamListPage() {
        // 防止重复添加按钮
        if (document.getElementById('batch-collect-btn')) return;

        // 尝试从本地存储加载状态
        const hasRestoredState = state.loadState();

        // 收集所有考试链接
        if (!hasRestoredState || state.examLinks.length === 0) {
            collectExamLinks();
        } else {
            Logger.log('已从本地存储恢复考试链接列表', state.examLinks.length);
        }

        // 创建UI
        createExamListUI();

        // 检查是否满足自动开始批量采集的条件
        const autoStartParam = new URLSearchParams(window.location.search).get('autostart');
        const hasAutoStartFlag = autoStartParam === 'true' || autoStartParam === '1';
        const hasEnoughExams = state.examLinks.length > 0;
        const shouldAutoStart = (hasAutoStartFlag || localStorage.getItem('autoCollectEnabled') !== 'false') && hasEnoughExams;

        // 如果满足自动开始条件，延迟一秒后自动开始批量采集
        if (shouldAutoStart) {
            Logger.log('检测到自动采集已启用，将自动开始批量采集...');
            setTimeout(() => {
                startBatchCollection(true); // 传入true表示自动模式
            }, 1000);
        }
    }

    // 创建考试列表页面UI
    function createExamListUI() {
        // 创建批量采集按钮和自动采集开关
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            position: 'fixed',
            right: '30px',
            bottom: '30px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        });
        document.body.appendChild(buttonContainer);

        // 自动采集开关
        const autoCollectContainer = document.createElement('div');
        Object.assign(autoCollectContainer.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            marginBottom: '5px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        });

        const autoCollectLabel = document.createElement('label');
        autoCollectLabel.textContent = '自动开始采集';
        Object.assign(autoCollectLabel.style, {
            fontSize: '14px',
            color: '#333',
            userSelect: 'none',
            cursor: 'pointer'
        });

        const autoCollectCheckbox = document.createElement('input');
        autoCollectCheckbox.type = 'checkbox';
        autoCollectCheckbox.id = 'auto-collect-checkbox';
        // 默认选中
        autoCollectCheckbox.checked = localStorage.getItem('autoCollectEnabled') !== 'false';
        autoCollectCheckbox.style.cursor = 'pointer';

        // 保存选择状态
        autoCollectCheckbox.addEventListener('change', function () {
            localStorage.setItem('autoCollectEnabled', this.checked);

            // 如果勾选了自动采集，并且有考试链接，则自动开始采集
            if (this.checked && state.examLinks.length > 0) {
                setTimeout(() => {
                    startBatchCollection(true);
                }, 500);
            }
        });

        autoCollectLabel.setAttribute('for', 'auto-collect-checkbox');
        autoCollectContainer.appendChild(autoCollectLabel);
        autoCollectContainer.appendChild(autoCollectCheckbox);
        buttonContainer.appendChild(autoCollectContainer);

        // 批量采集按钮
        const batchBtn = document.createElement('button');
        batchBtn.id = 'batch-collect-btn';
        batchBtn.textContent = `批量采集题目 (${state.examLinks.length} 个考试)`;
        Object.assign(batchBtn.style, {
            padding: '10px 20px',
            background: '#409EFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '100%'
        });
        buttonContainer.appendChild(batchBtn);

        // 创建状态提示
        const statusTip = document.createElement('div');
        statusTip.id = 'batch-status-tip';
        statusTip.style.display = 'none';
        Object.assign(statusTip.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            borderRadius: '5px',
            zIndex: '9999',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            fontWeight: 'bold',
            textAlign: 'center'
        });
        document.body.appendChild(statusTip);

        // 添加批量采集点击事件
        batchBtn.onclick = startBatchCollection;

        // 添加进度条
        const progressContainer = document.createElement('div');
        progressContainer.id = 'collection-progress-container';
        Object.assign(progressContainer.style, {
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '200px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'none',
            zIndex: '9998'
        });

        const progressLabel = document.createElement('div');
        progressLabel.id = 'progress-label';
        progressLabel.textContent = '采集进度';
        Object.assign(progressLabel.style, {
            fontSize: '14px',
            marginBottom: '5px',
            fontWeight: 'bold'
        });

        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar-container';
        Object.assign(progressBar.style, {
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
        });

        const progressFill = document.createElement('div');
        progressFill.id = 'progress-bar-fill';
        Object.assign(progressFill.style, {
            height: '100%',
            width: '0%',
            backgroundColor: '#409EFF',
            borderRadius: '4px',
            transition: 'width 0.3s'
        });

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressLabel);
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
    }

    // 收集考试链接函数
    function collectExamLinks() {
        state.examLinks = [];

        // 从页面中获取所有考试链接
        const links = document.querySelectorAll('.random_opera_td_20 a.look_td');

        if (links.length === 0) {
            Logger.warn('没有找到考试链接');
            return;
        }

        // 将相对路径转换为完整URL
        links.forEach((link, index) => {
            const href = link.getAttribute('href');
            const fullUrl = new URL(href, window.location.origin).href;
            const examName = link.closest('.randomBody_td').querySelector('.random_name_td').textContent.trim();

            state.examLinks.push({
                url: fullUrl,
                name: examName,
                index: index + 1
            });
        });

        Logger.log(`共找到 ${state.examLinks.length} 个考试链接`);

        // 保存状态到本地存储
        state.saveState();
    }

    // 开始批量采集函数
    function startBatchCollection(isAuto = false) {
        if (state.isCollecting) {
            alert('正在采集中，请等待当前采集完成');
            return;
        }

        if (state.examLinks.length === 0) {
            alert('没有可采集的考试链接');
            return;
        }

        // 更新状态
        state.isCollecting = true;
        state.startTime = new Date();

        // 显示进度条
        const progressContainer = document.getElementById('collection-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }

        // 显示状态提示
        const statusTip = document.getElementById('batch-status-tip');
        if (statusTip) {
            statusTip.textContent = `正在准备批量采集 ${state.examLinks.length} 个考试...`;
            statusTip.style.display = 'block';
        }

        // 更新进度
        updateProgressBar(0, state.examLinks.length);

        // 开始处理第一个考试
        Logger.log('开始批量采集');
        setTimeout(() => {
            processNextExam();
        }, 500);
    }

    // 更新进度条
    function updateProgressBar(current, total) {
        const progressFill = document.getElementById('progress-bar-fill');
        const progressLabel = document.getElementById('progress-label');

        if (progressFill && progressLabel) {
            const percent = Math.round((current / total) * 100);
            progressFill.style.width = `${percent}%`;
            progressLabel.textContent = `采集进度: ${current}/${total} (${percent}%)`;
        }
    }

    // 处理下一个考试 - 使用自动定时检查方式
    function processNextExam() {
        // 检查是否已完成所有考试
        if (state.currentExamIndex >= state.examLinks.length) {
            finishBatchCollection();
            return;
        }

        // 获取当前要处理的考试
        const currentExam = state.examLinks[state.currentExamIndex];

        // 更新状态提示
        const statusTip = document.getElementById('batch-status-tip');
        if (statusTip) {
            statusTip.textContent = `正在采集: ${currentExam.name} (${state.currentExamIndex + 1}/${state.examLinks.length})`;
        }

        // 更新进度条
        updateProgressBar(state.currentExamIndex, state.examLinks.length);

        // 记录当前处理的索引到会话存储，用于恢复
        sessionStorage.setItem('currentProcessingIndex', state.currentExamIndex);
        sessionStorage.setItem('batchCollection', 'true');
        sessionStorage.setItem('batchCollectionIndex', state.currentExamIndex);

        // 记录当前时间戳，用于检测超时
        const startTime = new Date().getTime();
        localStorage.setItem('lastExamStartTime', startTime);
        localStorage.setItem('lastExamIndex', state.currentExamIndex);

        Logger.log(`处理考试 ${state.currentExamIndex + 1}/${state.examLinks.length}: ${currentExam.name}`);

        // 打开考试链接
        const examWindow = window.open(currentExam.url, '_blank');

        // 增加考试索引，为下一个做准备
        state.currentExamIndex++;

        // 保存状态到本地存储
        state.saveState();

        // 如果无法打开新窗口（可能被浏览器阻止）
        if (!examWindow) {
            Logger.error('无法打开新窗口，可能被浏览器阻止');
            alert('无法打开新窗口，请检查浏览器是否阻止了弹出窗口');
            state.isCollecting = false;
            return;
        }

        // 设置定时器检查是否需要继续下一个
        // 如果当前窗口已关闭，或者超过一定时间，自动继续下一个
        setTimeout(checkAndContinue, 5000);
    }

    // 检查是否需要继续下一个考试
    function checkAndContinue() {
        if (!state.isCollecting) return;

        const lastExamIndex = parseInt(localStorage.getItem('lastExamIndex') || '0');
        const lastStartTime = parseInt(localStorage.getItem('lastExamStartTime') || '0');
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - lastStartTime;

        // 检查是否有完成标记
        const examCompleted = localStorage.getItem('examCompleted') === 'true';
        const lastCompletedIndex = parseInt(localStorage.getItem('lastCompletedIndex') || '-1');
        const lastCompletedTime = parseInt(localStorage.getItem('lastCompletedTime') || '0');

        // 如果有完成标记，并且完成的是当前考试
        if (examCompleted && lastCompletedIndex === lastExamIndex) {
            // 如果完成时间足够新（在最近的一分钟内）
            if (currentTime - lastCompletedTime < 60000) {
                Logger.log(`检测到考试已完成，索引: ${lastCompletedIndex}`);
                // 清除完成标记
                localStorage.removeItem('examCompleted');
                // 继续下一个考试
                processNextExam();
                return;
            }
        }

        // 如果当前索引不等于上次记录的索引，说明已经开始了下一个考试
        if (state.currentExamIndex > lastExamIndex + 1) {
            Logger.log('已经开始了新的考试，不需要自动继续');
            return;
        }

        // 检查是否超时，默认30秒
        if (timeElapsed > 30000) {
            Logger.log(`当前考试处理超时 ${timeElapsed / 1000} 秒，自动继续下一个`);
            processNextExam();
            return;
        }

        // 如果没有超时，继续定时检查
        setTimeout(checkAndContinue, 5000);
    }

    // 完成批量采集
    function finishBatchCollection() {
        const endTime = new Date();
        const timeUsed = (endTime - state.startTime) / 1000;

        // 更新状态
        state.isCollecting = false;

        // 清除会话存储
        sessionStorage.removeItem('batchCollection');
        sessionStorage.removeItem('batchCollectionIndex');
        sessionStorage.removeItem('currentProcessingIndex');

        // 清除本地存储状态
        state.clearState();

        // 隐藏进度条
        const progressContainer = document.getElementById('collection-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }

        // 更新状态提示
        const statusTip = document.getElementById('batch-status-tip');
        if (statusTip) {
            statusTip.textContent = `批量采集完成! 共采集 ${state.totalCollected} 道题目，耗时 ${timeUsed.toFixed(1)} 秒`;
            statusTip.style.background = 'rgba(40, 167, 69, 0.9)';

            // 5秒后隐藏状态提示
            setTimeout(() => {
                statusTip.style.display = 'none';
                statusTip.style.background = 'rgba(0, 0, 0, 0.7)';
            }, 5000);
        }

        Logger.log(`批量采集完成! 共采集 ${state.totalCollected} 道题目，耗时 ${timeUsed.toFixed(1)} 秒`);

        // 重置状态
        state.currentExamIndex = 0;
        state.totalCollected = 0;
    }

    // 考试详情页面初始化函数
    function initExamDetailPage() {
        // 移除左侧菜单，优化页面布局
        $("#lookLeft").remove();
        // 添加选中状态
        $(".check_dx").addClass("checked_dx")
        // 显示答案
        $(".answerDiv").show();
        // 防止重复初始化
        if (document.getElementById('my-question-btn')) return;

        // 检查是否来自自动采集
        const isFromBatchCollection = sessionStorage.getItem('batchCollection') === 'true';

        // 创建UI元素
        createExamDetailUI();

        // 自动开始采集和导入功能
        Logger.log('自动采集已启动');

        // 使用较短的延迟确保页面完全加载
        setTimeout(() => {
            // 直接调用采集函数，避免额外的DOM操作
            const questions = parseQuestionsFromPage();
            if (!questions.length) {
                showNotification('未采集到题目', 'error');

                // 如果来自批量采集，则关闭页面并继续下一个
                if (isFromBatchCollection) {
                    safeCloseWindow(0);
                }
                return;
            }

            Logger.log(`采集完成，共 ${questions.length} 道题目，开始导入`);

            // 更新状态提示
            const statusTip = document.querySelector('div[style*="position: fixed"][style*="top: 10px"]');
            if (statusTip) {
                statusTip.textContent = `正在导入 ${questions.length} 道题目...`;
            }

            // 如果来自批量采集，设置自动导入标记
            if (isFromBatchCollection) {
                const autoImportFlag = document.querySelector('.auto-import-flag');
                if (autoImportFlag) {
                    autoImportFlag.style.display = 'block';
                }
            }

            // 直接发送请求，跳过预览弹窗步骤
            importQuestions(questions);
        }, 300); // 等待300ms确保页面完全加载
    }

    // 创建考试详情页面UI
    function createExamDetailUI() {
        // 创建按钮
        const btn = document.createElement('button');
        btn.id = 'my-question-btn';
        btn.textContent = '开始采集';
        Object.assign(btn.style, {
            position: 'fixed',
            right: '30px',
            bottom: '30px',
            zIndex: 9999,
            padding: '10px 20px',
            background: '#409EFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        });
        document.body.appendChild(btn);

        // 创建自动导入标记
        const autoImportFlag = document.createElement('div');
        autoImportFlag.className = 'auto-import-flag';
        autoImportFlag.style.display = 'none';
        document.body.appendChild(autoImportFlag);

        // 创建状态提示
        const statusTip = document.createElement('div');
        Object.assign(statusTip.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            borderRadius: '5px',
            zIndex: '9999',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            fontWeight: 'bold'
        });
        statusTip.textContent = '自动采集中...';
        document.body.appendChild(statusTip);

        // 添加按钮点击事件
        btn.onclick = function () {
            const questions = parseQuestionsFromPage();
            if (!questions.length) {
                showNotification('未采集到题目', 'error');
                return;
            }
            // 格式化预览HTML
            const html = renderQuestionsPreview(questions);
            showQuestionsPreview(html, questions);
        };

        // 添加消息监听器，接收子窗口的采集完成消息
        window.addEventListener('message', function (event) {
            if (event.data && event.data.type === 'examCollected') {
                const collectedCount = event.data.collectedCount || 0;
                Logger.log(`收到采集完成消息，采集数量: ${collectedCount}`);

                // 更新总采集数量
                state.totalCollected += collectedCount;

                // 更新状态提示
                const statusTip = document.getElementById('batch-status-tip');
                if (statusTip) {
                    statusTip.textContent = `正在采集: 已完成 ${state.currentExamIndex}/${state.examLinks.length}, 共采集 ${state.totalCollected} 道题目`;
                }

                // 处理下一个考试
                setTimeout(() => {
                    processNextExam();
                }, 50); // 极大减少等待时间，加快批量采集速度
            }
        });
    }

    // 显示题目预览
    function showQuestionsPreview(html, questions) {
        layui.use('layer', function () {
            let layer = layui.layer;
            layer.open({
                type: 1,
                title: '<div style="display:flex;align-items:center;gap:10px;font-size:18px;font-weight:500;line-height:1.2;min-height:32px;">' +
                    '<img src="https://img1.imgtp.com/2023/07/16/2Qv7Qw1b.png" style="width:22px;height:22px;vertical-align:middle;">' +
                    '<span>采集题目预览</span>' +
                    '</div>',
                closeBtn: 1,
                area: ['750px', '520px'],
                content: `<div id="plum-bg" style="position:relative;min-height:420px;">${html}</div>` +
                    `<style>
                    #plum-bg::before {
                        content: '';
                        position: absolute;
                        left: 0; top: 0; right: 0; bottom: 0;
                        background: url('https://img1.imgtp.com/2023/07/16/2Qv7Qw1b.png') repeat center center;
                        opacity: 0.07;
                        pointer-events: none;
                        z-index: 0;
                    }
                    #plum-bg table {
                        border-radius: 14px;
                        box-shadow: 0 4px 24px 0 rgba(120,80,160,0.13);
                        overflow: hidden;
                        background: rgba(255,255,255,0.97);
                        font-size: 15px;
                    }
                    #plum-bg th {
                        background: linear-gradient(90deg,#f5f7fa 60%,#f0e6f6 100%);
                        color: #6d3b7b;
                        font-weight: 600;
                        border-bottom: 2px solid #e0d7f3;
                    }
                    #plum-bg tr:hover {background: #f0f6ff;}
                    #plum-bg th, #plum-bg td {
                        transition: background 0.2s;
                        padding: 8px 10px;
                    }
                    #plum-bg td {
                        border:1px solid #eee;
                        border-left: none;
                        border-right: none;
                    }
                    .layui-layer-content { border-radius: 16px!important; }
                    .layui-layer { box-shadow: 0 8px 32px 0 rgba(120,80,160,0.18)!important; border-radius: 18px!important; }
                    .layui-layer-title { font-size:18px!important; font-weight:500; background:linear-gradient(90deg,#fff 60%,#f0e6f6 100%)!important; color:#6d3b7b!important; border-radius: 18px 18px 0 0!important; min-height: 32px; display: flex; align-items: center; gap: 10px;}
                    .layui-layer-setwin { right: 16px!important; top: 16px!important; }
                    .layui-layer-setwin .layui-layer-close1 { font-size:22px!important; color:#b08bc7!important; }
                    .layui-layer-btn {
                        padding-bottom: 18px !important;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 0;
                    }
                    .layui-layer-btn .layui-layer-btn0 {
                        background: linear-gradient(90deg,#8f6ed5 0%,#4e8cff 100%);
                        color: #fff !important;
                        border: none !important;
                        border-radius: 12px !important;
                        font-size: 17px;
                        font-weight: 700;
                        box-shadow: 0 4px 16px 0 rgba(120,80,160,0.18);
                        padding: 0 38px;
                        height: 44px;
                        min-width: 120px;
                        margin: 0 12px 0 0;
                        transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
                        outline: none;
                    }
                    .layui-layer-btn .layui-layer-btn0:hover, .layui-layer-btn .layui-layer-btn0:focus {
                        background: linear-gradient(90deg,#4e8cff 0%,#8f6ed5 100%);
                        box-shadow: 0 8px 32px 0 rgba(120,80,160,0.22);
                        transform: translateY(-2px) scale(1.04);
                    }
                    .layui-layer-btn .layui-layer-btn1 {
                        background: #f5f7fa !important;
                        color: #8f6ed5 !important;
                        border: 1.5px solid #e0d7f3 !important;
                        border-radius: 12px !important;
                        font-size: 16px;
                        font-weight: 500;
                        min-width: 100px;
                        height: 44px;
                        margin-left: 0;
                        margin-right: 12px;
                        transition: background 0.2s, color 0.2s, border 0.2s, transform 0.1s;
                        outline: none;
                    }
                    .layui-layer-btn .layui-layer-btn1:hover, .layui-layer-btn .layui-layer-btn1:focus {
                        background: #e6e6f7 !important;
                        color: #6d3b7b !important;
                        border: 1.5px solid #b08bc7 !important;
                        transform: translateY(-1px) scale(1.03);
                    }
                    @media (max-width: 600px) {
                        .layui-layer-btn .layui-layer-btn0, .layui-layer-btn .layui-layer-btn1 {
                            min-width: 80px;
                            font-size: 15px;
                            padding: 0 12px;
                            height: 38px;
                        }
                    }
                    </style>`,
                btn: ['确定导入', '取消'],
                btnAlign: 'c',
                yes: function (index) {
                    importQuestions(questions);
                }
            });
        });
    }

    // 导入题目到服务器
    async function importQuestions(questions) {
        try {
            const isAutoImport = document.querySelector('.auto-import-flag') !== null;
            // 检查是否来自批量采集
            const isFromBatchCollection = sessionStorage.getItem('batchCollection') === 'true';

            Logger.log(`开始录入题目到数据库，共 ${questions.length} 道题目${isAutoImport ? ' (自动导入模式)' : ''}`);

            if (!questions || questions.length === 0) {
                Logger.warn('未找到可采集的题目');
                // 只在批量采集模式下才调用closeAndContinue
                if (isFromBatchCollection && typeof closeAndContinue === 'function') {
                    closeAndContinue(0);
                } else {
                    showNotification('未找到可采集的题目', 'error');
                }
                return;
            }

            // 记录开始时间
            const startTime = new Date();

            // 发送数据到服务器
            let body = { questions };
            Logger.log('发送数据:', JSON.stringify(body).substring(0, 200) + '...');

            // 添加重试机制
            let retryCount = 0;
            let success = false;

            while (retryCount < CONFIG.MAX_RETRIES && !success) {
                try {
                    // 确保使用正确的API端点
                    const apiEndpoint = CONFIG.API_ENDPOINT || 'http://localhost:5000/api/questions/add';
                    Logger.log(`正在连接到API端点: ${apiEndpoint}`);

                    const response = await fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        Logger.log('导入成功:', result);

                        // 显示更醒目的导入成功提示
                        const successMsg = `导入成功: ${result.message || `已导入 ${questions.length} 道题目`}`;

                        // 使用layui的通知
                        if (typeof layui !== 'undefined' && layui.layer) {
                            layui.layer.msg(successMsg, {
                                icon: 1,
                                offset: 't',
                                time: 3000,
                                shade: 0.3,
                                anim: 6,
                                skin: 'layui-layer-molv'
                            });
                        } else {
                            // 创建一个更醒目的成功提示框
                            const successNotice = document.createElement('div');
                            Object.assign(successNotice.style, {
                                position: 'fixed',
                                top: '20%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                padding: '15px 25px',
                                background: 'rgba(82, 196, 26, 0.9)',
                                color: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                zIndex: 10000,
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                animation: 'fadeInDown 0.5s forwards',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            });

                            // 添加动画样式
                            if (!document.getElementById('successNoticeStyles')) {
                                const style = document.createElement('style');
                                style.id = 'successNoticeStyles';
                                style.textContent = `
                                    @keyframes fadeInDown {
                                        from { opacity: 0; transform: translate(-50%, -70%); }
                                        to { opacity: 1; transform: translate(-50%, -50%); }
                                    }
                                    @keyframes fadeOutUp {
                                        from { opacity: 1; transform: translate(-50%, -50%); }
                                        to { opacity: 0; transform: translate(-50%, -70%); }
                                    }
                                `;
                                document.head.appendChild(style);
                            }

                            // 添加成功图标
                            const iconSpan = document.createElement('span');
                            iconSpan.innerHTML = '✔'; // 勾选图标
                            iconSpan.style.marginRight = '10px';
                            iconSpan.style.fontSize = '20px';
                            successNotice.appendChild(iconSpan);

                            // 添加文本
                            const textSpan = document.createElement('span');
                            textSpan.textContent = successMsg;
                            successNotice.appendChild(textSpan);

                            // 添加到文档
                            document.body.appendChild(successNotice);

                            // 定时移除
                            setTimeout(() => {
                                successNotice.style.animation = 'fadeOutUp 0.5s forwards';
                                setTimeout(() => {
                                    if (document.body.contains(successNotice)) {
                                        document.body.removeChild(successNotice);
                                    }
                                }, 500);
                            }, 3000);
                        }

                        // 同时更新状态提示
                        updateStatusTip({
                            text: successMsg,
                            background: 'rgba(40, 167, 69, 0.9)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        });

                        success = true;

                        // 如果是批量采集模式，则关闭当前页面并继续下一个
                        if (isFromBatchCollection) {
                            Logger.log('批量采集模式，关闭当前页面并继续');
                            // 安全地关闭窗口并继续
                            safeCloseWindow(questions.length);
                        }
                    } else {
                        const errorText = await response.text();
                        throw new Error(`服务器响应错误: ${response.status} ${errorText}`);
                    }
                } catch (error) {
                    retryCount++;
                    Logger.error(`导入失败 (重试 ${retryCount}/${CONFIG.MAX_RETRIES}):`, error);

                    if (retryCount >= CONFIG.MAX_RETRIES) {
                        showNotification(`导入失败: ${error.message}`, 'error');
                        // 如果是批量采集模式，则关闭当前页面并继续下一个
                        if (isFromBatchCollection) {
                            Logger.log('导入失败，但仍然关闭页面并继续');
                            safeCloseWindow(0);
                        }
                    } else {
                        // 等待一段时间后重试
                        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
                    }
                }
            }
        } catch (e) {
            Logger.error('导入过程中发生异常:', e);
            showNotification(`导入过程中发生异常: ${e.message}`, 'error');

            // 如果是批量采集模式，即使出错也继续下一个
            const isFromBatchCollection = sessionStorage.getItem('batchCollection') === 'true';
            if (isFromBatchCollection) {
                Logger.log('导入过程异常，但仍然关闭页面并继续');
                safeCloseWindow(0);
            }
            Logger.error('录入题目失败，错误信息:', e);
            showNotification('网络错误，录入失败！', 'error');
            updateStatusTip({
                text: `导入失败: 网络错误`,
                background: 'rgba(220, 53, 69, 0.9)'
            });
        }
    }

    // 显示通知提示
    function showNotification(message, type = 'info') {
        // 使用layui提供的通知功能
        if (typeof layui !== 'undefined' && layui.layer) {
            // 根据类型设置图标
            let icon = 0; // 默认信息图标
            switch (type) {
                case 'success': icon = 1; break;
                case 'error': icon = 2; break;
                case 'warning': icon = 0; break;
                case 'info': icon = 6; break;
            }

            // 显示通知
            layui.layer.msg(message, {
                icon: icon,
                offset: 't',
                anim: 6,
                time: CONFIG.NOTIFICATION_DURATION
            });
        } else {
            // 如果layui不可用，创建一个简单的通知元素
            const notificationId = 'custom-notification-' + Date.now();
            const notification = document.createElement('div');
            notification.id = notificationId;

            // 根据类型设置样式
            let backgroundColor = '#1890ff';
            let textColor = '#fff';

            switch (type) {
                case 'success':
                    backgroundColor = '#52c41a';
                    break;
                case 'error':
                    backgroundColor = '#f5222d';
                    break;
                case 'warning':
                    backgroundColor = '#faad14';
                    break;
            }

            // 设置样式
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                background: backgroundColor,
                color: textColor,
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 10000,
                fontWeight: 'bold',
                animation: 'fadeIn 0.3s forwards'
            });

            // 添加动画样式
            if (!document.getElementById('notificationStyles')) {
                const style = document.createElement('style');
                style.id = 'notificationStyles';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translate(-50%, -20px); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; transform: translate(-50%, 0); }
                        to { opacity: 0; transform: translate(-50%, -20px); }
                    }
                `;
                document.head.appendChild(style);
            }

            // 设置内容
            notification.textContent = message;

            // 添加到文档
            document.body.appendChild(notification);

            // 定时移除
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => {
                    if (document.getElementById(notificationId)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, CONFIG.NOTIFICATION_DURATION);
        }

        // 同时更新状态提示
        updateStatusTip({
            text: message,
            background: type === 'error' ? 'rgba(220, 53, 69, 0.9)' :
                type === 'success' ? 'rgba(40, 167, 69, 0.9)' :
                    'rgba(0, 123, 255, 0.9)'
        });

        // 输出到控制台
        if (type === 'error') {
            Logger.error(message);
        } else {
            Logger.log(message);
        }
    }

    // 更新状态提示
    function updateStatusTip(options) {
        const statusTip = document.querySelector('div[style*="position: fixed"][style*="top: 10px"]');
        if (statusTip) {
            if (options.text) statusTip.textContent = options.text;
            if (options.background) statusTip.style.background = options.background;
            if (options.boxShadow) statusTip.style.boxShadow = options.boxShadow;

            // 5秒后消失
            setTimeout(() => {
                statusTip.style.animation = 'fadeOut 0.5s forwards';
                // 添加消失动画
                if (!document.getElementById('fadeOutStyle')) {
                    const fadeStyle = document.createElement('style');
                    fadeStyle.id = 'fadeOutStyle';
                    fadeStyle.textContent = `
                        @keyframes fadeOut {
                            from { opacity: 1; transform: translateX(-50%) translateY(0); }
                            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                        }
                    `;
                    document.head.appendChild(fadeStyle);
                }
                setTimeout(() => statusTip.style.display = 'none', 500);
            }, 5000);
        }
    }

    // 显示成功通知
    function showSuccessNotification(options) {
        layui.use('layer', function () {
            let layer = layui.layer;
            layer.open({
                type: 1,
                title: false,
                closeBtn: false,
                shade: 0.3,
                area: ['400px', 'auto'],
                skin: 'success-notification',
                time: CONFIG.NOTIFICATION_DURATION,
                anim: 2,
                shadeClose: true,
                content: `<div style="padding: 20px; text-align: center; background: linear-gradient(135deg, #28a745, #20c997); border-radius: 10px; box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);">
                    <div style="font-size: 60px; margin-bottom: 10px; color: white;"><i class="layui-icon layui-icon-ok-circle"></i></div>
                    <div style="font-size: 22px; font-weight: bold; color: white; margin-bottom: 5px;">${options.title}</div>
                    <div style="color: rgba(255,255,255,0.9); font-size: 16px;">${options.message}</div>
                    <div style="margin-top: 15px; color: rgba(255,255,255,0.8); font-size: 14px;">${options.details}</div>
                </div>`
            });
        });
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        if (layui && layui.layer) {
            const icons = {
                info: 0,
                success: 1,
                error: 2,
                warning: 0
            };
            layui.layer.msg(message, { icon: icons[type] || 0 });
        } else {
            alert(message);
        }
    }

    // 安全关闭窗口并继续下一个考试的辅助函数
    function safeCloseWindow(collectedCount = 0) {
        try {
            // 直接使用现有的closeAndContinue函数
            if (typeof closeAndContinue === 'function') {
                Logger.log(`调用closeAndContinue函数，采集数量: ${collectedCount}`);
                closeAndContinue(collectedCount);
                return;
            }

            // 如果closeAndContinue函数不存在，尝试直接与父窗口交互
            if (window.opener && !window.opener.closed) {
                try {
                    // 尝试通知父窗口更新采集状态
                    if (window.opener.state) {
                        window.opener.state.totalCollected += collectedCount;
                    }

                    // 调用父窗口的processNextExam函数
                    if (typeof window.opener.processNextExam === 'function') {
                        Logger.log(`直接调用父窗口的processNextExam函数，采集数量: ${collectedCount}`);
                        window.opener.processNextExam();
                    }
                } catch (e) {
                    Logger.error('通知父窗口失败:', e);
                }
            }

            // 清除会话存储
            sessionStorage.removeItem('batchCollection');
            sessionStorage.removeItem('batchCollectionIndex');
            sessionStorage.removeItem('currentProcessingIndex');

            // 关闭当前窗口
            Logger.log('关闭当前窗口，继续下一个考试');
            try { window.close(); } catch (e) { /* 忽略错误 */ }

            // 如果窗口没有关闭（浏览器可能阻止了脚本关闭窗口）
            setTimeout(() => {
                if (!window.closed) {
                    alert('请手动关闭此窗口以继续采集下一个考试');
                }
            }, 500);
        } catch (err) {
            Logger.error('关闭页面失败:', err);
            try { window.close(); } catch (e) { /* 忽略错误 */ }
        }
    }

    // 关闭当前页面并继续下一个考试 - 使用本地存储方式
    function closeAndContinue(collectedCount) {
        // 输出详细日志，帮助调试
        Logger.log('==== 开始处理关闭并继续下一个考试 ====');
        Logger.log(`当前采集数量: ${collectedCount}`);

        // 检查会话存储中的批量采集状态
        const batchCollection = sessionStorage.getItem('batchCollection');
        const batchIndex = parseInt(sessionStorage.getItem('batchCollectionIndex') || '0');
        Logger.log(`批量采集状态: ${batchCollection}, 索引: ${batchIndex}`);

        // 获取当前总采集数量
        const oldTotal = parseInt(localStorage.getItem('totalCollected') || '0');
        const newTotal = oldTotal + collectedCount;

        // 更新本地存储中的采集数量
        localStorage.setItem('totalCollected', newTotal);
        Logger.log(`更新采集计数: ${oldTotal} + ${collectedCount} = ${newTotal}`);

        // 标记当前考试已完成
        localStorage.setItem('examCompleted', 'true');
        localStorage.setItem('lastCompletedIndex', batchIndex);
        localStorage.setItem('lastCompletedTime', new Date().getTime());

        // 清除会话存储
        sessionStorage.removeItem('batchCollection');
        sessionStorage.removeItem('batchCollectionIndex');
        sessionStorage.removeItem('currentProcessingIndex');

        // 关闭窗口
        closeWindow();

        // 关闭窗口函数
        function closeWindow() {
            // 关闭当前窗口
            Logger.log('关闭当前窗口，继续下一个考试');

            try {
                window.close();
            } catch (e) {
                Logger.error('关闭窗口失败:', e);
            }

            // 如果窗口没有关闭（浏览器可能阻止了脚本关闭窗口）
            setTimeout(() => {
                if (!window.closed) {
                    alert('请手动关闭此窗口以继续采集下一个考试');
                }
            }, 500);
        }
    }

    // 从页面解析问题
    function parseQuestionsFromPage() {
        const questions = [];
        const stemElements = $('.stem_con').get();

        // 使用批量处理提高性能
        for (let i = 0; i < stemElements.length; i++) {
            const stemElement = $(stemElements[i]);

            // 题型识别 - 使用缓存的选择器结果
            const typeTextElement = stemElement.find('span.colorShallow');
            const typeText = typeTextElement.length ? typeTextElement.text() : '';

            // 根据关键词识别题目类型
            let type = 'single'; // 默认为单选题

            // 获取题目完整内容用于进一步分析
            const fullQuestionText = stemElement.text().trim();

            // 先检查类型文本
            if (/多选|多项|多个|多种|选出多个|选出正确的选项有/.test(typeText)) {
                type = 'multiple';
            }
            // 如果类型文本中没有多选关键词，检查完整题目内容
            else if (/\(多选题|（多选题|多选题，|多选题,|选出多个|选出正确的选项有|正确的有|有\(\)$|有（）$/.test(fullQuestionText)) {
                type = 'multiple';
                Logger.log('基于题目内容识别为多选题:', fullQuestionText.substring(0, 50) + '...');
            }
            // 检查选项数量，如果超过4个选项且没有其他类型标识，可能是多选题
            else if (stemElement.next('.stem_answer').find('.num_option').length > 4) {
                type = 'multiple';
                Logger.log('基于选项数量识别为多选题');
            }
            // 其他题型检测
            else if (/判断|对错|是非/.test(typeText)) {
                type = 'judgement';
            } else if (/填空|补充|填写/.test(typeText)) {
                type = 'completion';
            } else if (/简答|问答|说明|说说|讨论|分析/.test(typeText)) {
                type = 'short';
            }

            // 获取完整题目，包括序号、题型信息和题干
            let questionPrefix = '';

            // 获取题目序号（如果有）
            const questionNumberNode = stemElement.contents().filter(function () {
                return this.nodeType === 3; // 文本节点
            }).first();

            const questionNumber = questionNumberNode.length ? questionNumberNode.text().trim() : '';
            if (questionNumber) {
                questionPrefix = questionNumber + ' ';
            }

            // 获取题型信息
            if (typeText) {
                questionPrefix += typeText + ' ';
            }

            // 题干（合并所有非空p，防止空p导致题干丢失）
            // 使用数组存储并过滤空元素，提高性能
            const paragraphs = stemElement.find('p').map(function () {
                return $(this).html().trim();
            }).get().filter(Boolean);

            // 将所有段落合并为题干内容
            let questionContent = paragraphs.join(' ');

            // 如果题干开头包含序号和题型前缀，尝试去除
            // 匹配序号和题型前缀，如"61. (判断题，1分)"
            // 保存原始内容用于日志记录
            const originalContent = questionContent;

            // 先尝试去除常见的序号+题型前缀格式
            questionContent = questionContent.replace(/^\s*\d+\.?\s*[\(\uff08][^\)\uff09]+[\)\uff09]\s*/i, '');

            // 再尝试去除可能的其他格式前缀
            questionContent = questionContent.replace(/^\s*\d+\.?\s*/i, ''); // 去除只有序号的前缀
            questionContent = questionContent.replace(/^\s*[\(\uff08][^\)\uff09]+[\)\uff09]\s*/i, ''); // 去除只有括号的前缀

            // 去除可能的空格
            questionContent = questionContent.trim();

            // 如果内容发生了变化，记录日志
            if (originalContent !== questionContent) {
                Logger.log(`题目前缀去除: 原始="${originalContent.substring(0, 50)}..." → 处理后="${questionContent.substring(0, 50)}..."`);
            }

            // 组合前缀和处理后的题干
            const question = questionPrefix + questionContent;

            Logger.log(`提取题干: ${questionContent.substring(0, 50)}...`);

            // 选项处理
            const $answerBlock = stemElement.next('.stem_answer');
            const options = [];
            const optionMap = {};

            // 只有选择题才处理选项
            if ((type === 'single' || type === 'multiple') && $answerBlock.length) {
                // 使用缓存的jQuery对象减少DOM查询
                const optionElements = $answerBlock.find('.num_option').get();

                for (let j = 0; j < optionElements.length; j++) {
                    const optionElement = $(optionElements[j]);
                    const letter = optionElement.text().replace(/[.．、]/, '').trim();

                    // 使用更精确的选择器获取选项内容
                    let content = optionElement.next('.answer_p').html() || optionElement.next().html();
                    content = content ? content.trim() : (optionElement.next('.answer_p').text().trim() || optionElement.next().text().trim());

                    options.push(letter + '.' + content);
                    optionMap[letter] = content;
                }
            }

            // 答案处理：根据题型不同，获取答案区域
            let $answerDiv;

            if (type === 'single' || type === 'multiple') {
                // 选择题：取 .stem_answer 的下一个兄弟 .answerDiv
                $answerDiv = $answerBlock.length ? $answerBlock.next('.answerDiv') : $();
            } else {
                // 非选择题：直接从题干区域获取下一个兄弟 .answerDiv
                $answerDiv = stemElement.next('.stem_answer').next('.answerDiv');
                if (!$answerDiv.length) {
                    $answerDiv = stemElement.next('.answerDiv');
                }
            }

            // 根据题型提取答案
            let answer = '';

            if (type === 'single' || type === 'multiple') {
                // 选择题答案处理
                const ansText = $answerDiv.find('.answer_tit p').text().trim().replace(/[^A-Z]/ig, '');
                const ansArr = ansText.split('');
                const ansContentArr = ansArr.map(l => optionMap[l] || l);
                answer = ansContentArr.join(';');
            } else if (type === 'completion') {
                // 填空题答案处理
                const blanks = [];

                // 尝试多种选择器获取填空题答案
                const blankElements = $answerDiv.find('.tiankong_con .ans-wid-cRight p').get();

                if (blankElements.length) {
                    for (let k = 0; k < blankElements.length; k++) {
                        const blankElement = $(blankElements[k]);
                        let v = blankElement.html();
                        v = v ? v.trim() : blankElement.text().trim();
                        if (v) blanks.push(v);
                    }
                } else {
                    // 备用选择器
                    const paragraphElements = $answerDiv.find('p').get();
                    for (let k = 0; k < paragraphElements.length; k++) {
                        const paragraphElement = $(paragraphElements[k]);
                        let v = paragraphElement.html();
                        v = v ? v.trim() : paragraphElement.text().trim();
                        if (v) blanks.push(v);
                    }
                }

                answer = blanks.join(';');
            } else if (type === 'judgement') {
                // 判断题答案处理
                answer = $answerDiv.find('.answer_tit p').text().trim();
                if (!answer) {
                    answer = $answerDiv.find('p').text().trim();
                }

                // 标准化判断题答案
                if (/^(对|正确|true|√)$/i.test(answer)) answer = '正确';
                if (/^(错|错误|false|×)$/i.test(answer)) answer = '错误';
            } else if (type === 'short') {
                // 简答题答案处理
                const ansArr = [];
                const shortAnswerElements = $answerDiv.find('.ans-wid-cRight p').get();

                if (shortAnswerElements.length) {
                    for (let k = 0; k < shortAnswerElements.length; k++) {
                        const shortAnswerElement = $(shortAnswerElements[k]);
                        let v = shortAnswerElement.html();
                        v = v ? v.trim() : shortAnswerElement.text().trim();
                        if (v) ansArr.push(v);
                    }
                }

                if (!ansArr.length) {
                    // 尝试获取HTML内容
                    let v = $answerDiv.find('.ans-wid-cRight').html();
                    v = v ? v.trim() : $answerDiv.find('.ans-wid-cRight').text().trim();
                    if (v) ansArr.push(v);
                }

                answer = ansArr.filter(Boolean).join('\n');
            } else {
                // 其他类型题目的答案处理
                const otherAnswerElements = $answerDiv.find('p').get();
                const otherAnswers = [];

                for (let k = 0; k < otherAnswerElements.length; k++) {
                    const otherAnswerElement = $(otherAnswerElements[k]);
                    let v = otherAnswerElement.html();
                    v = v ? v.trim() : otherAnswerElement.text().trim();
                    if (v) otherAnswers.push(v);
                }

                answer = otherAnswers.filter(Boolean).join(';');
            }

            // 根据题型构建题目对象
            if (type === 'single' || type === 'multiple') {
                questions.push({
                    question,
                    type,
                    options: options.join(';'),
                    answer
                });
            } else {
                questions.push({
                    question,
                    type,
                    answer
                });
            }
        }

        return questions;
    }

    // 格式化题目预览
    function renderQuestionsPreview(questions) {
        // 使用DocumentFragment提高性能
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');

        // 创建表格内容
        let html = '<div style="max-height:350px;overflow:auto;"><table style="width:100%;border-collapse:collapse;">';
        html += '<tr style="background:#f5f7fa;"><th>题干</th><th>类型</th><th>选项</th><th>答案</th></tr>';

        // 高效处理所有题目
        questions.forEach(q => {
            // 根据题目类型显示不同的标签颜色
            let typeClass = '';
            switch (q.type) {
                case 'single': typeClass = 'background-color:#e6f7ff;color:#1890ff;'; break;
                case 'multiple': typeClass = 'background-color:#f6ffed;color:#52c41a;'; break;
                case 'judgement': typeClass = 'background-color:#fff7e6;color:#fa8c16;'; break;
                case 'completion': typeClass = 'background-color:#f9f0ff;color:#722ed1;'; break;
                case 'short': typeClass = 'background-color:#fcf5e9;color:#fa541c;'; break;
            }

            // 类型显示中文
            let typeText = '';
            switch (q.type) {
                case 'single': typeText = '单选题'; break;
                case 'multiple': typeText = '多选题'; break;
                case 'judgement': typeText = '判断题'; break;
                case 'completion': typeText = '填空题'; break;
                case 'short': typeText = '简答题'; break;
                default: typeText = q.type;
            }

            // 限制题干显示长度，避免表格过宽
            const maxQuestionLength = 100;
            let questionText = q.question;
            if (questionText.length > maxQuestionLength) {
                questionText = questionText.substring(0, maxQuestionLength) + '...';
            }

            html += `<tr>
                <td style="border:1px solid #eee;padding:6px 8px;">${questionText}</td>
                <td style="border:1px solid #eee;padding:6px 8px;${typeClass}">${typeText}</td>
                <td style="border:1px solid #eee;padding:6px 8px;">${q.options || ''}</td>
                <td style="border:1px solid #eee;padding:6px 8px;">${q.answer}</td>
            </tr>`;
        });

        html += '</table></div>';
        html += `<div style="color:#888;font-size:13px;margin-top:10px;">共采集到 <b>${questions.length}</b> 道题目</div>`;

        // 高效处理所有题目
        questions.forEach(q => {
            // 根据题目类型显示不同的标签颜色

            // 获取题型信息
            if (typeText) {
                questionPrefix += typeText + ' ';
            }

            // 题干（合并所有非空p，防止空p导致题干丢失）
            // 使用数组存储并过滤空元素，提高性能
            const paragraphs = stemElement.find('p').map(function () {
                return $(this).html().trim();
            }).get().filter(Boolean);

            // 将所有段落合并为题干内容
            let questionContent = paragraphs.join(' ');

            // 如果题干开头包含序号和题型前缀，尝试去除
            // 匹配序号和题型前缀，如"61. (判断题，1分)"
            // 保存原始内容用于日志记录
            const originalContent = questionContent;

            // 先尝试去除常见的序号+题型前缀格式
            questionContent = questionContent.replace(/^\s*\d+\.?\s*[\(\uff08][^\)\uff09]+[\)\uff09]\s*/i, '');

            // 再尝试去除可能的其他格式前缀
            questionContent = questionContent.replace(/^\s*\d+\.?\s*/i, ''); // 去除只有序号的前缀
            questionContent = questionContent.replace(/^\s*[\(\uff08][^\)\uff09]+[\)\uff09]\s*/i, ''); // 去除只有括号的前缀

            // 去除可能的空格
            questionContent = questionContent.trim();

            // 如果内容发生了变化，记录日志
            if (originalContent !== questionContent) {
                Logger.log(`题目前缀去除: 原始="${originalContent.substring(0, 50)}..." → 处理后="${questionContent.substring(0, 50)}..."`);
            }

            // 组合前缀和处理后的题干
            const question = questionPrefix + questionContent;

            Logger.log(`提取题干: ${questionContent.substring(0, 50)}...`);

            // 选项处理
            const $answerBlock = stemElement.next('.stem_answer');
            const options = [];
            const optionMap = {};

            // 只有选择题才处理选项
            if ((type === 'single' || type === 'multiple') && $answerBlock.length) {
                // 使用缓存的jQuery对象减少DOM查询
                const optionElements = $answerBlock.find('.num_option').get();

                for (let j = 0; j < optionElements.length; j++) {
                    const optionElement = $(optionElements[j]);
                    const letter = optionElement.text().replace(/[.．、]/, '').trim();

                    // 使用更精确的选择器获取选项内容
                    let content = optionElement.next('.answer_p').html() || optionElement.next().html();
                    content = content ? content.trim() : (optionElement.next('.answer_p').text().trim() || optionElement.next().text().trim());

                    options.push(letter + '.' + content);
                    optionMap[letter] = content;
                }
            }

            // 答案处理：根据题型不同，获取答案区域
            let $answerDiv;

            if (type === 'single' || type === 'multiple') {
                // 选择题：取 .stem_answer 的下一个兄弟 .answerDiv
                $answerDiv = $answerBlock.length ? $answerBlock.next('.answerDiv') : $();
            } else {
                // 非选择题：直接从题干区域获取下一个兄弟 .answerDiv
                $answerDiv = stemElement.next('.stem_answer').next('.answerDiv');
                if (!$answerDiv.length) {
                    $answerDiv = stemElement.next('.answerDiv');
                }
            }

            // 根据题型提取答案
            let answer = '';

            if (type === 'single' || type === 'multiple') {
                // 选择题答案处理
                const ansText = $answerDiv.find('.answer_tit p').text().trim().replace(/[^A-Z]/ig, '');
                const ansArr = ansText.split('');
                const ansContentArr = ansArr.map(l => optionMap[l] || l);
                answer = ansContentArr.join(';');
            } else if (type === 'completion') {
                // 填空题答案处理
                const blanks = [];

                // 尝试多种选择器获取填空题答案
                const blankElements = $answerDiv.find('.tiankong_con .ans-wid-cRight p').get();

                if (blankElements.length) {
                    for (let k = 0; k < blankElements.length; k++) {
                        const blankElement = $(blankElements[k]);
                        let v = blankElement.html();
                        v = v ? v.trim() : blankElement.text().trim();
                        if (v) blanks.push(v);
                    }
                } else {
                    // 备用选择器
                    const paragraphElements = $answerDiv.find('p').get();
                    for (let k = 0; k < paragraphElements.length; k++) {
                        const paragraphElement = $(paragraphElements[k]);
                        let v = paragraphElement.html();
                        v = v ? v.trim() : paragraphElement.text().trim();
                        if (v) blanks.push(v);
                    }
                }

                answer = blanks.join(';');
            } else if (type === 'judgement') {
                // 判断题答案处理
                answer = $answerDiv.find('.answer_tit p').text().trim();
                if (!answer) {
                    answer = $answerDiv.find('p').text().trim();
                }

                // 标准化判断题答案
                if (/^(对|正确|true|√)$/i.test(answer)) answer = '正确';
                if (/^(错|错误|false|×)$/i.test(answer)) answer = '错误';
            } else if (type === 'short') {
                // 简答题答案处理
                const ansArr = [];
                const shortAnswerElements = $answerDiv.find('.ans-wid-cRight p').get();

                if (shortAnswerElements.length) {
                    for (let k = 0; k < shortAnswerElements.length; k++) {
                        const shortAnswerElement = $(shortAnswerElements[k]);
                        let v = shortAnswerElement.html();
                        v = v ? v.trim() : shortAnswerElement.text().trim();
                        if (v) ansArr.push(v);
                    }
                }

                if (!ansArr.length) {
                    // 尝试获取HTML内容
                    let v = $answerDiv.find('.ans-wid-cRight').html();
                    v = v ? v.trim() : $answerDiv.find('.ans-wid-cRight').text().trim();
                    if (v) ansArr.push(v);
                }

                answer = ansArr.filter(Boolean).join('\n');
            } else {
                // 其他类型题目的答案处理
                const otherAnswerElements = $answerDiv.find('p').get();
                const otherAnswers = [];

                for (let k = 0; k < otherAnswerElements.length; k++) {
                    const otherAnswerElement = $(otherAnswerElements[k]);
                    let v = otherAnswerElement.html();
                    v = v ? v.trim() : otherAnswerElement.text().trim();
                    if (v) otherAnswers.push(v);
                }

                answer = otherAnswers.filter(Boolean).join(';');
            }

            // 根据题型构建题目对象
            if (type === 'single' || type === 'multiple') {
                questions.push({
                    question,
                    type,
                    options: options.join(';'),
                    answer
                });
            } else {
                questions.push({
                    question,
                    type,
                    answer
                });
            }


            return questions;
        })
    }
})();
