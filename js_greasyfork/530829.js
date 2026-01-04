// ==UserScript==
// @name         Q票终极稳定刷新助手-2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  无限刷新直到响应200，含错误页面检测和自动恢复功能
// @match        https://events.q-tickets.com/qatar/eventdetails/6242778262/ittf-world-table-tennis-championships-finals-doha-2025
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530829/Q%E7%A5%A8%E7%BB%88%E6%9E%81%E7%A8%B3%E5%AE%9A%E5%88%B7%E6%96%B0%E5%8A%A9%E6%89%8B-2.user.js
// @updateURL https://update.greasyfork.org/scripts/530829/Q%E7%A5%A8%E7%BB%88%E6%9E%81%E7%A8%B3%E5%AE%9A%E5%88%B7%E6%96%B0%E5%8A%A9%E6%89%8B-2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        checkInterval: 30000,     // 正常检测间隔30秒
        pendingTimeout: 6000,     // 6秒请求超时
        retryIntervals: {
            serverError: 8000,    // 服务器错误重试间隔
            networkError: 10000,  // 网络错误重试间隔
            criticalError: 5000   // 严重错误重试间隔
        },
        maxServerErrors: 5,       // 连续服务器错误最大次数
        errorPageKeywords: [      // 错误页面关键词(支持多语言)
            "该网页无法正常运作",
            "HTTP ERROR 500",
            "This page isn't working",
            "events.q-tickets.com 目前无法处理此请求",
            "服务器错误",
            "Service Unavailable",
            "502 Bad Gateway",
            "503 Service Temporarily Unavailable",
            "504 Gateway Time-out"
        ],
        statusCheckInterval: 3000 // 脚本存活检查间隔(3秒)
    };

    // 运行时变量(使用GM_setValue持久化)
    let runtime = {
        consecutiveServerErrors: GM_getValue('consecutiveServerErrors', 0),
        lastError: GM_getValue('lastError', null),
        lastSuccess: GM_getValue('lastSuccess', null),
        totalChecks: GM_getValue('totalChecks', 0)
    };

    // 保存运行时状态
    const saveRuntime = () => {
        GM_setValue('consecutiveServerErrors', runtime.consecutiveServerErrors);
        GM_setValue('lastError', runtime.lastError);
        GM_setValue('lastSuccess', runtime.lastSuccess);
        GM_setValue('totalChecks', runtime.totalChecks);
    };

    // 创建状态指示器(防丢失版本)
    const createStatusIndicator = () => {
        // 如果已存在则先移除
        const existing = document.getElementById('refresh-status');
        if (existing) existing.remove();

        // 添加到body的直接子元素(最高层级)
        const statusDiv = document.createElement('div');
        statusDiv.id = 'refresh-status';
        statusDiv.innerHTML = `
            <div class="header">
                <div class="title">
                    <span class="icon">🔄</span>
                    <span>票务监控系统 v2.0</span>
                </div>
                <span class="status-badge" id="status-badge">INIT</span>
            </div>
            <div class="details">
                <div>状态: <span id="current-status">系统初始化中...</span></div>
                <div class="stats">
                    <span>检测次数: <span id="check-count">0</span></span>
                    <span>错误次数: <span id="error-count">0</span></span>
                </div>
                <div class="time-info">
                    <span>上次成功: <span id="last-success">-</span></span>
                    <span>下次检测: <span id="next-check">-</span></span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress" id="progress-bar"></div>
            </div>
        `;
        document.documentElement.appendChild(statusDiv); // 添加到html根元素

        // 应用样式
        GM_addStyle(`
            #refresh-status {
                position: fixed !important;
                top: 12px !important;
                right: 12px !important;
                background: rgba(30,30,30,0.95) !important;
                color: white !important;
                padding: 14px 18px !important;
                border-radius: 8px !important;
                z-index: 2147483647 !important; /* 最大z-index */
                font-family: 'Segoe UI', Roboto, sans-serif !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                min-width: 320px !important;
                backdrop-filter: blur(8px) !important;
            }
            #refresh-status .header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 10px !important;
                padding-bottom: 8px !important;
                border-bottom: 1px solid rgba(255,255,255,0.1) !important;
            }
            #refresh-status .title {
                font-weight: 600 !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                font-size: 1.05em !important;
            }
            #refresh-status .icon {
                font-size: 1.4em !important;
                width: 24px !important;
                text-align: center !important;
            }
            #refresh-status .status-badge {
                font-size: 0.8em !important;
                padding: 3px 8px !important;
                border-radius: 12px !important;
                background: rgba(255,255,255,0.15) !important;
            }
            #refresh-status .details {
                font-size: 0.95em !important;
                line-height: 1.6 !important;
            }
            #refresh-status .stats {
                display: flex !important;
                justify-content: space-between !important;
                margin: 5px 0 !important;
                font-size: 0.85em !important;
                opacity: 0.9 !important;
            }
            #refresh-status .time-info {
                margin-top: 8px !important;
                font-size: 0.88em !important;
                opacity: 0.9 !important;
                display: flex !important;
                justify-content: space-between !important;
            }
            #refresh-status.active {
                background: rgba(46, 125, 50, 0.95) !important;
            }
            #refresh-status.warning {
                background: rgba(237, 108, 2, 0.95) !important;
            }
            #refresh-status.error {
                background: rgba(211, 47, 47, 0.95) !important;
            }
            #refresh-status.critical {
                background: rgba(194, 24, 91, 0.95) !important;
            }
            #refresh-status.pending {
                background: rgba(2, 119, 189, 0.95) !important;
            }
            #refresh-status .progress-bar {
                height: 3px !important;
                background: rgba(255,255,255,0.2) !important;
                margin-top: 10px !important;
                border-radius: 3px !important;
                overflow: hidden !important;
            }
            #refresh-status .progress {
                height: 100% !important;
                background: rgba(255,255,255,0.7) !important;
                width: 0% !important;
                transition: width 0.1s linear !important;
            }
        `);

        return statusDiv;
    };

    // 初始化状态指示器
    let statusDiv = createStatusIndicator();

    // 脚本存活检测(防止意外停止)
    const scriptAliveCheck = () => {
        if (!document.getElementById('refresh-status')) {
            GM_log('状态面板丢失，重新创建...');
            statusDiv = createStatusIndicator();
        }
    };

    // 更新状态显示(防崩溃版本)
    const updateStatus = (state, message, additionalInfo = '') => {
        try {
            const now = new Date();

            // 更新DOM元素
            const elements = {
                currentStatus: document.getElementById('current-status'),
                statusBadge: document.getElementById('status-badge'),
                checkCount: document.getElementById('check-count'),
                errorCount: document.getElementById('error-count'),
                lastSuccess: document.getElementById('last-success'),
                nextCheck: document.getElementById('next-check')
            };

            if (elements.currentStatus) {
                elements.currentStatus.innerHTML = `${message} ${additionalInfo ? `<small>(${additionalInfo})</small>` : ''}`;
            }
            if (elements.statusBadge) elements.statusBadge.textContent = state;
            if (elements.checkCount) elements.checkCount.textContent = runtime.totalChecks;
            if (elements.errorCount) elements.errorCount.textContent = runtime.consecutiveServerErrors;
            if (elements.lastSuccess) {
                elements.lastSuccess.textContent = runtime.lastSuccess ?
                    new Date(runtime.lastSuccess).toLocaleTimeString() : '-';
            }
            if (elements.nextCheck) {
                elements.nextCheck.textContent = new Date(Date.now() + CONFIG.checkInterval).toLocaleTimeString();
            }

            // 更新状态样式
            statusDiv.className = '';
            const icon = statusDiv.querySelector('.icon');
            if (icon) icon.textContent = '🔄';

            switch(state) {
                case 'SUCCESS':
                    statusDiv.classList.add('active');
                    if (icon) icon.textContent = '✅';
                    runtime.lastSuccess = Date.now();
                    break;
                case 'PENDING':
                    statusDiv.classList.add('pending');
                    if (icon) icon.textContent = '⏳';
                    break;
                case '500':
                case '504':
                    statusDiv.classList.add('warning');
                    if (icon) icon.textContent = '⚠️';
                    break;
                case 'CRITICAL':
                    statusDiv.classList.add('critical');
                    if (icon) icon.textContent = '🛑';
                    break;
                case 'ERROR':
                    statusDiv.classList.add('error');
                    if (icon) icon.textContent = '❌';
                    break;
            }

            saveRuntime();
        } catch (e) {
            GM_log('状态更新失败:', e);
            // 如果状态更新失败，重建整个面板
            statusDiv = createStatusIndicator();
        }
    };

    // 检测是否为错误页面(增强版)
    const isErrorPage = () => {
        try {
            // 检查1: 页面标题包含错误关键词
            const title = document.title || '';
            if (CONFIG.errorPageKeywords.some(k => title.includes(k))) {
                return true;
            }

            // 检查2: 可见文本包含错误信息
            const bodyText = document.body?.innerText || '';
            if (CONFIG.errorPageKeywords.some(k => bodyText.includes(k))) {
                return true;
            }

            // 检查3: Chrome默认错误页面结构
            const errorDivs = document.querySelectorAll('div[role="main"], div.error-page');
            for (const div of errorDivs) {
                const text = div.innerText || '';
                if (CONFIG.errorPageKeywords.some(k => text.includes(k))) {
                    return true;
                }
            }

            return false;
        } catch (e) {
            GM_log('错误页面检测异常:', e);
            return false;
        }
    };

    // 带超时和进度显示的fetch请求(防崩溃版)
    const enhancedFetch = async (url, options) => {
        refreshController = new AbortController();
        options.signal = refreshController.signal;

        // 进度条更新
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress = Math.min(progress + 100 / (CONFIG.pendingTimeout / 100), 100);
            const bar = document.getElementById('progress-bar');
            if (bar) bar.style.width = `${progress}%`;
        }, 100);

        // 设置超时
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {
                clearInterval(progressInterval);
                refreshController.abort();
                reject(new Error(`请求超时 (${CONFIG.pendingTimeout}ms)`));
            }, CONFIG.pendingTimeout)
        );

        // 实际请求
        try {
            const fetchPromise = fetch(url, options)
                .then(response => {
                    clearInterval(progressInterval);
                    updateProgressBar(100);
                    return response;
                })
                .catch(err => {
                    clearInterval(progressInterval);
                    updateProgressBar(100);
                    throw err;
                });

            return await Promise.race([fetchPromise, timeoutPromise]);
        } catch (e) {
            clearInterval(progressInterval);
            throw e;
        }
    };

    // 智能刷新策略(增强版)
    const smartReload = (errorType) => {
        let delay = CONFIG.checkInterval;
        let reason = '计划刷新';

        switch(errorType) {
            case '500':
            case '504':
                runtime.consecutiveServerErrors++;
                delay = CONFIG.retryIntervals.serverError;
                reason = `服务器${errorType}错误`;
                break;

            case 'error-page':
                runtime.consecutiveServerErrors++;
                delay = CONFIG.retryIntervals.criticalError;
                reason = '检测到错误页面';
                break;

            case 'timeout':
                delay = CONFIG.retryIntervals.networkError;
                reason = '请求超时';
                runtime.consecutiveServerErrors = 0;
                break;

            case 'network':
                delay = CONFIG.retryIntervals.networkError;
                reason = '网络错误';
                runtime.consecutiveServerErrors = 0;
                break;

            default:
                runtime.consecutiveServerErrors = 0;
        }

        runtime.lastError = {
            type: errorType,
            time: Date.now(),
            message: reason
        };
        saveRuntime();

        // 连续错误处理
        if (runtime.consecutiveServerErrors >= CONFIG.maxServerErrors) {
            GM_notification({
                title: '⚠️ 服务器问题警报',
                text: `连续${runtime.consecutiveServerErrors}次服务器错误\n最后错误: ${reason}`,
                timeout: 8000,
                highlight: true
            });
        }

        GM_log(`[${new Date().toLocaleTimeString()}] ${reason}, ${delay/1000}秒后刷新`);

        // 使用多种刷新方式组合
        setTimeout(() => {
            try {
                // 方式1: 普通刷新
                window.location.reload();

                // 方式2: 备用刷新(如果方式1失败)
                setTimeout(() => {
                    if (isErrorPage() || document.readyState === 'loading') {
                        window.location.href = window.location.href;
                    }
                }, 3000);
            } catch (e) {
                GM_log('刷新失败:', e);
                window.location.href = window.location.href;
            }
        }, delay);
    };

    // 主检测函数(全保护版本)
    const checkAvailability = async () => {
        runtime.totalChecks++;
        saveRuntime();

        try {
            // 1. 先检查当前是否是错误页面
            if (isErrorPage()) {
                updateStatus('CRITICAL', '检测到错误页面', '自动恢复中...');
                smartReload('error-page');
                return;
            }

            // 2. 更新检测状态
            updateStatus('PENDING', '检测服务器状态');

            // 3. 执行检测请求
            const startTime = Date.now();
            const response = await enhancedFetch(window.location.href, {
                method: 'HEAD',
                cache: 'no-cache',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                referrerPolicy: 'no-referrer'
            });

            const responseTime = Date.now() - startTime;
            const statusCode = response.status;
            GM_log(`[${new Date().toLocaleTimeString()}] 响应: ${statusCode} (${responseTime}ms)`);

            // 4. 验证响应内容
            if (statusCode === 200) {
                // 额外内容检查
                try {
                    const pageCheck = await fetch(window.location.href);
                    const html = await pageCheck.text();
                    const isPageError = CONFIG.errorPageKeywords.some(k => html.includes(k));

                    if (isPageError) {
                        updateStatus('CRITICAL', '页面内容异常', '200响应但内容错误');
                        smartReload('error-page');
                    } else {
                        // 成功检测到正常页面
                        clearInterval(intervalId);
                        runtime.consecutiveServerErrors = 0;
                        updateStatus('SUCCESS', '服务已可用', '状态码: 200');

                        GM_notification({
                            title: '✅ 可以抢票了！',
                            text: '页面已恢复正常响应\n响应时间: ' + responseTime + 'ms',
                            timeout: 0,
                            highlight: true,
                            onclick: () => window.focus()
                        });
                    }
                } catch (contentErr) {
                    updateStatus('ERROR', '内容验证失败', contentErr.message);
                    smartReload('network');
                }
            } else if (statusCode === 500 || statusCode === 504) {
                updateStatus(statusCode.toString(), '服务器错误', `状态码: ${statusCode}`);
                smartReload(statusCode.toString());
            } else {
                updateStatus('REFRESH', '刷新页面', `状态码: ${statusCode}`);
                smartReload('other');
            }
        } catch (error) {
            const errorType = error.message.includes('timeout') ? 'timeout' : 'network';
            updateStatus('ERROR', errorType === 'timeout' ? '请求超时' : '网络错误', error.message);
            smartReload(errorType);
        }
    };

    // 启动系统
    let intervalId;

    // 初始化检查
    const initialize = () => {
        // 清除可能存在的旧定时器
        if (window.autoRefreshInterval) {
            clearInterval(window.autoRefreshInterval);
        }

        // 创建状态面板
        statusDiv = createStatusIndicator();

        // 启动主检测循环
        intervalId = setInterval(checkAvailability, CONFIG.checkInterval);
        window.autoRefreshInterval = intervalId;

        // 启动脚本存活检查
        setInterval(scriptAliveCheck, CONFIG.statusCheckInterval);

        // 立即执行第一次检查
        if (isErrorPage()) {
            updateStatus('CRITICAL', '初始检测到错误页面', '立即刷新');
            smartReload('error-page');
        } else {
            checkAvailability();
        }

        // 添加卸载清理
        window.addEventListener('beforeunload', () => {
            clearInterval(intervalId);
        });
    };

    // 延迟初始化以确保DOM就绪
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();