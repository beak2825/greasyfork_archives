// ==UserScript==
// @name         CRM 自动请求工具
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.6.0
// @description  自动获取PHPSESSID并定时发送POST请求到指定CRM接口，优化UI，所有日志同时显示，布局更紧凑。
// @author       
// @match        https://crm.lxtxvip.com/manager.php/Operationwork/index
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      crm.lxtxvip.com
// @downloadURL https://update.greasyfork.org/scripts/536033/CRM%20%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/536033/CRM%20%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置信息 (Configuration) ---
    const REQUEST_URL = "https://crm.lxtxvip.com/manager.php/Operationwork/claimWork"; // 请求的目标URL
    const COOKIE_NAME_TO_FETCH = "PHPSESSID"; // 需要从document.cookie中获取的Cookie名称
    const DEFAULT_INTERVAL_MS = 200; // 默认请求间隔时间 (毫秒)
    const MIN_INTERVAL_MS = 10; // 最小允许的请求间隔时间 (毫秒)
    const MAX_LOG_ENTRIES = 80; // 主日志区最大条目数 (因空间调整减少)
    const MAX_SUCCESS_LOG_ENTRIES = 40; // 成功日志区最大条目数 (因空间调整减少)
    const MAX_HTTP_ERROR_LOG_ENTRIES = 40; // HTTP错误日志区最大条目数 (因空间调整减少)

    // --- 全局变量 (Global Variables) ---
    let requestIntervalId = null; // 用于存储setInterval的ID，方便清除定时器
    let currentPHPSESSID = null; // 存储获取到的PHPSESSID
    let requestCounter = 0; // 请求计数器
    let isPanelMinimized = GM_getValue('panelMinimized', false); // 面板是否最小化的状态

    // --- 日志记录函数 (Logging Function) ---
    /**
     * 向主UI界面和控制台输出日志
     * @param {string} message - 日志内容
     * @param {string} type - 日志类型 ('info', 'error', 'success', 'warn', 'debug', 'response')
     */
    function logToUI(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString(); // 获取当前时间戳
        const $logEntry = $(`<div class="log-entry ${type}">`).text(`[${timestamp}] ${message}`);
        $('#autoRequestLogArea').prepend($logEntry); // 将新日志添加到日志区域的顶部
        console.log(`[油猴脚本 - CRM请求工具 - 操作日志] ${message}`); // 同时在浏览器控制台输出

        // 限制日志条目数量
        if ($('#autoRequestLogArea .log-entry').length > MAX_LOG_ENTRIES) {
            $('#autoRequestLogArea .log-entry:last-child').remove();
        }
    }

    /**
     * 向成功响应UI界面输出日志
     * @param {string} message - 成功响应的日志内容
     */
    function logToSuccessUI(message) {
        const timestamp = new Date().toLocaleTimeString();
        const $logEntry = $(`<div class="success-log-entry">`).text(`[${timestamp}] ${message}`);
        $('#successLogArea').prepend($logEntry);
        console.log(`[油猴脚本 - CRM请求工具 - 成功日志] ${message}`);

        // 限制成功日志条目数量
        if ($('#successLogArea .success-log-entry').length > MAX_SUCCESS_LOG_ENTRIES) {
            $('#successLogArea .success-log-entry:last-child').remove();
        }
    }

    /**
     * 向HTTP错误UI界面输出日志 (用于记录非200状态码的响应)
     * @param {string} message - HTTP错误的日志内容
     */
    function logToHttpErrorUI(message) {
        const timestamp = new Date().toLocaleTimeString();
        const $logEntry = $(`<div class="http-error-log-entry">`).text(`[${timestamp}] ${message}`);
        $('#httpErrorLogArea').prepend($logEntry);
        console.error(`[油猴脚本 - CRM请求工具 - HTTP错误日志] ${message}`); // 使用 console.error 输出

        // 限制HTTP错误日志条目数量
        if ($('#httpErrorLogArea .http-error-log-entry').length > MAX_HTTP_ERROR_LOG_ENTRIES) {
            $('#httpErrorLogArea .http-error-log-entry:last-child').remove();
        }
    }


    // --- Cookie 获取函数 (Cookie Fetching Function) ---
    function getCookieValue(cookieName) {
        logToUI(`尝试从 document.cookie 中获取Cookie: ${cookieName}`, 'debug');
        const nameEQ = cookieName + "=";
        const cookiesArray = document.cookie.split(';');
        for(let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                const cookieValue = cookie.substring(nameEQ.length, cookie.length);
                logToUI(`成功获取到Cookie "${cookieName}" 的值: ${cookieValue}`, 'success');
                $('#phpsessidDisplay').text(cookieValue).css('color', '#28a745');
                return cookieValue;
            }
        }
        logToUI(`未能找到名为 "${cookieName}" 的Cookie。请确保您已登录或该Cookie存在且非HttpOnly。`, 'error');
        $('#phpsessidDisplay').text('获取失败或不存在').css('color', '#dc3545');
        return null;
    }

    // --- HTTP 请求函数 (Request Function) ---
    function sendClaimWorkRequest() {
        // 尝试在每次请求前都获取一次最新的Cookie，以应对会话可能中途更新的情况
        // 但如果获取失败，且之前已有currentPHPSESSID，则继续使用旧的，避免因瞬时获取失败而中断
        const freshPHPSESSID = getCookieValue(COOKIE_NAME_TO_FETCH);
        if (freshPHPSESSID) {
            currentPHPSESSID = freshPHPSESSID;
        } else if (!currentPHPSESSID) {
            // 如果之前就没有，现在也没获取到，则报错停止
            logToUI("错误: PHPSESSID 未获取到，无法发送请求。请尝试重新获取或检查登录状态。", 'error');
            updateStatusDisplay("错误：PHPSESSID丢失", "error");
            stopRequests();
            return;
        }
        // 如果 freshPHPSESSID 为 null，但 currentPHPSESSID 存在，则会使用旧的 currentPHPSESSID

        requestCounter++;
        logToUI(`[请求 #${requestCounter}] 准备发送POST请求至 ${REQUEST_URL} (使用 PHPSESSID: ${currentPHPSESSID.substring(0,10)}...)`, 'info');

        GM_xmlhttpRequest({
            method: "POST",
            url: REQUEST_URL,
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Connection": "keep-alive",
                "Content-Length": "0", // POST请求通常需要Content-Length，即使为空
                "Cookie": `${COOKIE_NAME_TO_FETCH}=${currentPHPSESSID}`,
                "Origin": "https://crm.lxtxvip.com",
                "Referer": "https://crm.lxtxvip.com/manager.php/Operationwork/index", // 保持Referer
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "User-Agent": navigator.userAgent, // 使用当前浏览器的User-Agent
                "X-Requested-With": "XMLHttpRequest",
                // sec-ch-ua headers 可能会随浏览器版本变化，如果需要精确模拟，应动态获取或让用户配置
                // "sec-ch-ua": '"Google Chrome";v="125", "Not.A/Brand";v="24", "Chromium";v="125"',
                // "sec-ch-ua-mobile": "?0",
                // "sec-ch-ua-platform": '"Windows"'
            },
            data: "", // 确保data字段存在，即使为空字符串
            timeout: 15000, // 15秒超时
            onload: function(response) {
                logToUI(`[请求 #${requestCounter}] 收到响应 (HTTP状态码: ${response.status})`, 'debug');

                if (response.status !== 200) {
                    const errorMsg = `[请求 #${requestCounter}] HTTP错误! 状态码: ${response.status} ${response.statusText}. ` +
                                     `URL: ${response.finalUrl}. ` +
                                     `响应体: ${response.responseText.substring(0, 200)}${response.responseText.length > 200 ? '...' : ''}`; // 截断过长的响应体
                    logToHttpErrorUI(errorMsg);
                    logToUI(`[请求 #${requestCounter}] 发生HTTP错误 (状态码: ${response.status})，详情见“HTTP错误”日志。`, 'error');

                    if (response.status === 401 || response.status === 403) {
                         logToUI("检测到未授权或禁止访问 (401/403)，PHPSESSID可能已失效。下次请求将尝试重新获取。", "warn");
                         // 不立即停止，让下一次 sendClaimWorkRequest 尝试刷新
                         currentPHPSESSID = null; // 清除当前ID，强制下次重新获取
                    }
                    return;
                }

                try {
                    const responseData = JSON.parse(response.responseText);
                    // 根据实际的成功/失败判断逻辑调整
                    if (responseData && typeof responseData.status !== 'undefined') {
                        if (responseData.status === "ERROR" || responseData.code !== 0) { // 假设code 0 代表成功
                            logToUI(`[请求 #${requestCounter}] 接口业务提示: ${responseData.message || responseData.msg || JSON.stringify(responseData)}`, 'warn');
                        } else {
                            logToSuccessUI(`[请求 #${requestCounter}] 成功: ${responseData.message || responseData.msg || JSON.stringify(responseData, null, 2)}`);
                            logToUI(`[请求 #${requestCounter}] 操作成功 (详情见“成功响应”日志)`, 'success');
                        }
                    } else {
                         // 如果没有明确的status/code，但HTTP是200，可以尝试记录为成功或进一步分析
                        logToSuccessUI(`[请求 #${requestCounter}] 响应 (结构未知): ${JSON.stringify(responseData, null, 2)}`);
                        logToUI(`[请求 #${requestCounter}] 收到未知结构JSON响应 (详情见“成功响应”日志)`, 'response');
                    }
                } catch (e) {
                    logToUI(`[请求 #${requestCounter}] 响应 (非JSON): ${response.responseText.substring(0, 300)}${response.responseText.length > 300 ? '...' : ''}`, 'response');
                     // 如果非JSON也可能是成功，例如返回纯文本提示
                    logToSuccessUI(`[请求 #${requestCounter}] 文本响应: ${response.responseText.substring(0, 300)}${response.responseText.length > 300 ? '...' : ''}`);
                }
            },
            onerror: function(response) {
                const errorMsg = `[请求 #${requestCounter}] 请求网络错误: ${response.statusText || '未知错误'}. 详情: ${JSON.stringify(response)}`;
                logToHttpErrorUI(errorMsg);
                logToUI(`[请求 #${requestCounter}] 请求发生网络错误，详情见“HTTP错误”日志。`, 'error');
            },
            ontimeout: function() {
                const errorMsg = `[请求 #${requestCounter}] 请求超时 (超过15秒)`;
                logToHttpErrorUI(errorMsg);
                logToUI(`[请求 #${requestCounter}] 请求超时，详情见“HTTP错误”日志。`, 'error');
            }
        });
    }

    // --- 控制函数 (Control Functions) ---
    function startRequests() {
        logToUI("尝试启动自动请求...", 'info');
        // 初始获取一次PHPSESSID
        if (!currentPHPSESSID) {
            currentPHPSESSID = getCookieValue(COOKIE_NAME_TO_FETCH);
        }

        if (!currentPHPSESSID) {
            logToUI("启动失败：未能获取到PHPSESSID。请确保已登录且Cookie可用。", 'error');
            $('#startButton').prop('disabled', false).removeClass('disabled');
            $('#stopButton').prop('disabled', true).addClass('disabled');
            updateStatusDisplay("启动失败 (无PHPSESSID)", "error");
            return;
        }

        const intervalStr = $('#intervalInput').val();
        let intervalMs = parseInt(intervalStr, 10);

        if (isNaN(intervalMs) || intervalMs < MIN_INTERVAL_MS) {
            logToUI(`警告: 无效的间隔时间 "${intervalStr}"。已校正为 ${Math.max(MIN_INTERVAL_MS, DEFAULT_INTERVAL_MS)}ms.`, 'warn');
            intervalMs = Math.max(MIN_INTERVAL_MS, DEFAULT_INTERVAL_MS);
            $('#intervalInput').val(intervalMs);
        }

        GM_setValue('requestInterval', intervalMs);
        logToUI(`请求间隔已设置为: ${intervalMs}ms`, 'info');

        if (requestIntervalId) {
            clearInterval(requestIntervalId);
        }

        sendClaimWorkRequest(); // 立即执行一次
        requestIntervalId = setInterval(sendClaimWorkRequest, intervalMs);

        $('#startButton').prop('disabled', true).addClass('disabled');
        $('#stopButton').prop('disabled', false).removeClass('disabled');
        updateStatusDisplay(`运行中 (间隔: ${intervalMs}ms)`, "success");
        logToUI("自动请求已成功启动。", 'success');
    }

    function stopRequests() {
        if (requestIntervalId) {
            clearInterval(requestIntervalId);
            requestIntervalId = null;
            logToUI("自动请求已停止。", 'info');
        } else {
            logToUI("自动请求尚未启动，无需停止。", 'warn');
        }
        $('#startButton').prop('disabled', false).removeClass('disabled');
        $('#stopButton').prop('disabled', true).addClass('disabled');
        updateStatusDisplay("已停止", "info");
        requestCounter = 0; // 重置计数器
    }

    // --- UI 更新函数 ---
    function updateStatusDisplay(statusText, type = "info") { // type: 'info', 'success', 'error', 'warn'
        $('#statusDisplay').text(statusText);
        $('#statusDisplay').removeClass('status-success status-error status-warn status-info').addClass(`status-${type}`);
    }

    function togglePanelVisibility() {
        isPanelMinimized = !isPanelMinimized;
        GM_setValue('panelMinimized', isPanelMinimized);
        if (isPanelMinimized) {
            $('#crmAutoToolPanel .panel-content-wrapper').slideUp('fast');
            $('#togglePanelButton').html('&#x25BC;'); // 向下箭头 (展开)
            logToUI("控制面板已最小化。", "debug");
        } else {
            $('#crmAutoToolPanel .panel-content-wrapper').slideDown('fast');
            $('#togglePanelButton').html('&#x25B2;'); // 向上箭头 (收起)
            logToUI("控制面板已展开。", "debug");
        }
    }

    // --- UI 创建函数 (UI Creation Function) ---
    function createUI() {
        logToUI("正在创建用户操作界面...", 'debug');
        const controlPanelHTML = `
            <div id="crmAutoToolPanel">
                <div class="panel-header">
                    <h3 class="panel-title">CRM 自动请求工具 v4</h3>
                    <button id="togglePanelButton" title="展开/折叠面板">${isPanelMinimized ? '&#x25BC;' : '&#x25B2;'}</button>
                </div>
                <div class="panel-content-wrapper" style="${isPanelMinimized ? 'display: none;' : ''}">
                    <div class="panel-content">
                        <div class="controls-section">
                            <div class="control-group">
                                <label for="intervalInput">请求间隔 (ms):</label>
                                <input type="number" id="intervalInput" value="${GM_getValue('requestInterval', DEFAULT_INTERVAL_MS)}" min="${MIN_INTERVAL_MS}" step="50">
                            </div>
                            <div class="control-group buttons">
                                <button id="startButton" class="btn btn-start">启动请求</button>
                                <button id="stopButton" class="btn btn-stop" disabled>停止请求</button>
                            </div>
                        </div>

                        <div class="status-section">
                            <p><strong>当前状态:</strong> <span id="statusDisplay" class="status-info">已停止</span></p>
                            <p><strong>PHPSESSID:</strong> <span id="phpsessidDisplay">未获取</span></p>
                        </div>

                        <div class="logs-section">
                            <div class="log-area-container">
                                <h4 class="log-area-title">操作日志 <button class="clear-log-btn" data-target="autoRequestLogArea" title="清空操作日志">清空</button></h4>
                                <div id="autoRequestLogArea" class="log-area-content"></div>
                            </div>
                            <div class="log-area-container">
                                <h4 class="log-area-title">成功响应 <button class="clear-log-btn" data-target="successLogArea" title="清空成功响应日志">清空</button></h4>
                                <div id="successLogArea" class="log-area-content"></div>
                            </div>
                            <div class="log-area-container">
                                <h4 class="log-area-title">HTTP错误 <button class="clear-log-btn" data-target="httpErrorLogArea" title="清空HTTP错误日志">清空</button></h4>
                                <div id="httpErrorLogArea" class="log-area-content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                #crmAutoToolPanel {
                    position: fixed; bottom: 10px; right: 10px; /* 稍微调整位置 */
                    background-color: #ffffff; border: 1px solid #d1d5da;
                    border-radius: 6px; padding: 0; /* 减少内边距 */
                    z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* 调整阴影 */
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px; width: 700px; /* 加宽面板 */ color: #24292e;
                }
                .panel-header {
                    background-color: #f6f8fa; padding: 8px 12px; /* 减少内边距 */
                    border-bottom: 1px solid #d1d5da;
                    border-top-left-radius: 6px; border-top-right-radius: 6px;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .panel-title { margin: 0; font-size: 15px; font-weight: 600; }
                #togglePanelButton {
                    background: none; border: none; font-size: 18px; cursor: pointer;
                    color: #586069; padding: 0 4px; line-height: 1;
                }
                .panel-content-wrapper { overflow: hidden; }
                .panel-content { padding: 10px; } /* 减少内边距 */

                .controls-section, .status-section, .logs-section { margin-bottom: 10px; }
                .controls-section { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
                .control-group { display: flex; align-items: center; gap: 6px; }
                .control-group label { font-weight: 500; white-space: nowrap; }
                #intervalInput {
                    width: 70px; padding: 5px 8px; border: 1px solid #d1d5da;
                    border-radius: 4px; box-sizing: border-box; font-size: 13px;
                }
                .btn {
                    padding: 6px 12px; border: 1px solid transparent; border-radius: 5px;
                    cursor: pointer; font-size: 13px; font-weight: 500;
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                }
                .btn-start { background-color: #2ea44f; color: white; border-color: #2c974b; }
                .btn-start:hover:not(.disabled) { background-color: #2c974b; }
                .btn-stop { background-color: #d73a49; color: white; border-color: #cb2431; }
                .btn-stop:hover:not(.disabled) { background-color: #cb2431; }
                .btn.disabled, .btn:disabled {
                    background-color: #e1e4e8 !important; color: #959da5 !important;
                    border-color: #d1d5da !important; cursor: not-allowed;
                }

                .status-section {
                    background-color: #f6f8fa; padding: 8px; border-radius: 4px;
                    border: 1px solid #e1e4e8;
                }
                .status-section p { margin: 4px 0; font-size: 12px; }
                .status-section p strong { font-weight: 600; }
                #phpsessidDisplay { word-break: break-all; }
                .status-info { color: #586069; }
                .status-success { color: #2ea44f; font-weight: bold; }
                .status-error { color: #d73a49; font-weight: bold; }
                .status-warn { color: #dbab09; font-weight: bold; }

                .logs-section { display: flex; flex-direction: column; gap: 8px; /* 垂直排列，增加间隙 */ }
                .log-area-container { /* 包裹每个日志区域和其标题 */
                    /* border: 1px solid #e1e4e8;  Optional: if you want border around title + content */
                    /* border-radius: 4px; */
                }
                .log-area-title {
                    font-size: 13px; font-weight: 600; margin: 0 0 4px 0;
                    padding: 4px 6px; background-color: #f1f3f5; border-radius: 3px 3px 0 0;
                    border: 1px solid #e1e4e8; border-bottom: none;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .log-area-content {
                    height: 100px; /* 减小高度 */ overflow-y: auto; border: 1px solid #e1e4e8;
                    background-color: #ffffff; padding: 8px; font-size: 11px; /* 减小字体 */
                    white-space: pre-wrap; word-wrap: break-word; border-radius: 0 0 3px 3px; /* 调整圆角 */
                    line-height: 1.5; /* 调整行高 */
                }
                .clear-log-btn {
                    padding: 2px 6px; font-size: 10px; background-color: #6c757d;
                    color: white; border: none; border-radius: 3px; cursor: pointer;
                    opacity: 0.8; transition: opacity 0.2s; margin-left: auto; /* 推到右边 */
                }
                .clear-log-btn:hover { opacity: 1; }
                /* Specific clear button colors (optional, can keep them all gray) */
                /* .log-area-title[data-target="successLogArea"] .clear-log-btn { background-color: #198754; } */
                /* .log-area-title[data-target="httpErrorLogArea"] .clear-log-btn { background-color: #bb2d3b; } */


                /* Log Entry Styles (保持不变，但可根据需要调整) */
                .log-entry, .success-log-entry, .http-error-log-entry { margin-bottom: 4px; padding: 2px 5px; border-radius: 3px; }
                .log-entry.error { color: #cb2431; background-color: #ffeef0; border-left: 2px solid #cb2431; }
                .log-entry.success { color: #1a7f37; background-color: #e6ffed; border-left: 2px solid #2ea44f; }
                .log-entry.warn { color: #9a6700; background-color: #fffbdd; border-left: 2px solid #f9c513; }
                .log-entry.info { color: #00529B; background-color: #eBF5FF; border-left: 2px solid #0366d6; }
                .log-entry.debug { color: #586069; font-style: italic; font-size: 10px; }
                .log-entry.response { color: #24292e; background-color: #f6f8fa; border-left: 2px solid #6f42c1; padding-left: 6px; margin-top: 3px; }

                .success-log-entry { color: #1a7f37; background-color: #f0fff4; border-left: 2px solid #28a745; }
                .http-error-log-entry { color: #a02d37; background-color: #fff0f1; border-left: 2px solid #d73a49; font-weight: 500; }
            </style>
        `;
        $('body').append(controlPanelHTML);
        logToUI("UI面板已添加到页面。", 'debug');

        currentPHPSESSID = getCookieValue(COOKIE_NAME_TO_FETCH); // 尝试在UI创建时获取一次

        // Event Listeners
        $('#startButton').on('click', startRequests);
        $('#stopButton').on('click', stopRequests);
        $('#togglePanelButton').on('click', togglePanelVisibility);

        // Event delegation for clear log buttons
        $('.logs-section').on('click', '.clear-log-btn', function() {
            const targetAreaId = $(this).data('target');
            const $targetArea = $(`#${targetAreaId}`);
            $targetArea.empty(); // 清空日志内容
            const logTypeMap = {
                'autoRequestLogArea': '操作日志',
                'successLogArea': '成功响应日志',
                'httpErrorLogArea': 'HTTP错误日志'
            };
            logToUI(`${logTypeMap[targetAreaId]} 已清空。`, 'info');
        });

        $('#intervalInput').on('change', function() {
            let val = parseInt($(this).val(), 10);
            if (isNaN(val) || val < MIN_INTERVAL_MS) {
                val = Math.max(MIN_INTERVAL_MS, DEFAULT_INTERVAL_MS); // 使用 Math.max 确保不低于最小值，若默认值也低于最小值则取最小值
                $(this).val(val);
                logToUI(`间隔时间输入无效，已自动校正为 ${val}ms`, 'warn');
            }
            GM_setValue('requestInterval', val); // 保存用户设置
            logToUI(`请求间隔已更新为: ${val}ms (将在下次启动或当前运行时动态调整，如果已启动)`, 'info');

            // 如果定时器正在运行，则更新它
            if (requestIntervalId) {
                logToUI("检测到请求正在运行，将动态更新请求间隔。", 'info');
                clearInterval(requestIntervalId); // 清除旧的定时器
                requestIntervalId = setInterval(sendClaimWorkRequest, val); // 设置新的定时器
                updateStatusDisplay(`运行中 (间隔: ${val}ms)`, "success"); // 更新状态显示
            }
        });

        updateStatusDisplay("已停止", "info");
        if ($('#stopButton').is(':disabled')) {
             $('#stopButton').addClass('disabled'); // 确保初始状态正确应用 .disabled 类
        }
        logToUI("UI创建完成，事件监听器已绑定。等待用户操作。", 'debug');
    }

    // --- 脚本初始化 (Script Initialization) ---
    $(document).ready(function() {
        console.log('[油猴脚本 - CRM请求工具 v4] 脚本开始初始化...');
        createUI();
        logToUI("脚本初始化完成。请确保已登录目标网站，然后点击“启动请求”开始。", 'info');

        if (currentPHPSESSID) {
            logToUI(`初始已获取 PHPSESSID: ${currentPHPSESSID.substring(0,10)}...`, 'info');
        } else {
            logToUI("提示：尚未获取到 PHPSESSID，可能需要登录或刷新页面。", 'warn');
        }
    });

})();
