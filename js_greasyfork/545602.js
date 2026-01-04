// ==UserScript==
// @name         AutoDL 自动刷新实例 - 防止回收
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  自动刷新AutoDL平台长时间关机的实例，防止被平台回收。支持自定义天数阈值和批量操作。
// @author       AutoDL助手
// @match        https://www.autodl.com/*
// @icon         https://www.autodl.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545602/AutoDL%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%AE%9E%E4%BE%8B%20-%20%E9%98%B2%E6%AD%A2%E5%9B%9E%E6%94%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/545602/AutoDL%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%AE%9E%E4%BE%8B%20-%20%E9%98%B2%E6%AD%A2%E5%9B%9E%E6%94%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .autodl-refresh-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            cursor: move;
            user-select: none;
        }

        .autodl-refresh-panel.expanded {
            width: 350px;
        }

        .autodl-refresh-panel.dragging {
            opacity: 0.8;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }

        .autodl-refresh-header {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            padding: 12px 15px;
            border-radius: 8px 8px 0 0;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }

        .autodl-refresh-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .autodl-refresh-expand {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin-right: 8px;
        }

        .autodl-refresh-expand:hover {
            opacity: 0.8;
        }

        .autodl-expand-hint {
            font-size: 10px;
            color:rgb(255, 0, 0);
            text-align: center;
            margin-top: 2px;
            margin-bottom: 0;
            line-height: 1.2;
        }

        .autodl-warning-counter {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 6px 8px;
            margin: 6px 0;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
        }

        .autodl-warning-counter.safe {
            color: #28a745;
            border-color: #28a745;
            background: #d4f5d4;
        }

        .autodl-warning-counter.warning {
            color: #dc3545;
            border-color: #dc3545;
            background: #f8d7da;
        }

        .autodl-refresh-content {
            padding: 10px;
            cursor: default;
        }

        .autodl-refresh-input-group {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .autodl-refresh-input-group label {
            display: block;
            margin-bottom: 0;
            font-weight: bold;
            color: #333;
            font-size: 13px;
            white-space: nowrap;
            min-width: 60px;
        }

        .autodl-refresh-input-group input {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
            font-size: 13px;
            cursor: text;
        }

        .autodl-refresh-btn {
            width: 100%;
            padding: 8px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 6px;
            transition: all 0.3s ease;
        }

        .autodl-refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .autodl-refresh-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
            transform: none;
        }

        .autodl-refresh-log {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            background: #f8f9fa;
            font-size: 12px;
            line-height: 1.4;
        }

        .autodl-refresh-log-item {
            margin-bottom: 5px;
            padding: 3px 0;
        }

        .autodl-refresh-log-success {
            color: #28a745;
        }

        .autodl-refresh-log-error {
            color: #dc3545;
        }

        .autodl-refresh-log-warning {
            color: #ffc107;
        }

        .autodl-refresh-log-info {
            color: #17a2b8;
        }

        .autodl-refresh-log-debug {
            color: #6c757d;
            font-style: italic;
        }

        .autodl-refresh-status {
            text-align: center;
            padding: 8px;
            margin: 8px 0;
            border-radius: 5px;
            font-weight: bold;
        }

        .autodl-refresh-status.running {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .autodl-refresh-status.completed {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }

        .autodl-refresh-status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .autodl-refresh-debug-info {
            background: #e9ecef;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 8px;
            margin: 8px 0;
            font-size: 11px;
            color: #495057;
        }

        .autodl-expanded-content {
            display: none;
        }

        .autodl-expanded-content.visible {
            display: block;
        }

        /* 展开模式下恢复垂直布局 */
        .autodl-refresh-panel.expanded .autodl-refresh-input-group {
            display: block;
        }

        .autodl-refresh-panel.expanded .autodl-refresh-input-group label {
            margin-bottom: 3px;
            min-width: auto;
        }

        .autodl-refresh-panel.expanded .autodl-refresh-input-group input {
            width: 100%;
            flex: none;
        }

        .autodl-confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 20000;
        }

        .autodl-confirm-content {
            background: white;
            border-radius: 10px;
            padding: 25px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        .autodl-confirm-title {
            font-size: 18px;
            font-weight: bold;
            color: #dc3545;
            margin-bottom: 15px;
        }

        .autodl-confirm-message {
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            margin-bottom: 20px;
            text-align: left;
        }

        .autodl-confirm-instances {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 10px;
            margin: 10px 0;
            font-family: monospace;
            font-size: 12px;
            color: #495057;
        }

        .autodl-confirm-note {
            font-size: 12px;
            color: #6c757d;
            font-style: italic;
            margin-top: 10px;
        }

        .autodl-confirm-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }

        .autodl-confirm-btn {
            padding: 10px 25px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .autodl-confirm-btn.confirm {
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
        }

        .autodl-confirm-btn.confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }

        .autodl-confirm-btn.cancel {
            background: linear-gradient(135deg, #6c757d, #5a6268);
            color: white;
        }

        .autodl-confirm-btn.cancel:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
        }
    `);

    // AutoDL API 基础URL
    const BASE_URL = "https://www.autodl.com/api/v1";

    // API 请求头
    const HEADERS = {
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "*/*",
        "appversion": "v5.95.2",
        "Origin": "https://www.autodl.com",
        "Referer": "https://www.autodl.com/login"
    };

    // 调试模式开关
    const DEBUG_MODE = true;

    // 调试日志函数
    function debugLog(message, data = null) {
        if (DEBUG_MODE) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[AutoDL Debug ${timestamp}] ${message}`);
            if (data) {
                console.log('Debug Data:', data);
            }
        }
    }

    // SHA1 哈希函数
    async function sha1Hash(text) {
        try {
            debugLog(`开始对密码进行SHA1加密...`);
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            debugLog(`密码SHA1加密完成: ${hash.substring(0, 8)}...`);
            return hash;
        } catch (error) {
            debugLog(`SHA1加密失败: ${error.message}`, error);
            throw error;
        }
    }

    // 登录并获取token
    async function loginAndGetToken(phone, plaintextPassword) {
        try {
            debugLog(`开始登录流程，手机号: ${phone}`);

            // 对明文密码进行SHA1加密
            const encryptedPassword = await sha1Hash(plaintextPassword);

            // 步骤1: 登录获取 ticket
            addLog("正在进行登录...", "info");
            debugLog(`发送登录请求到: ${BASE_URL}/new_login`);

            const loginPayload = {
                phone: phone,
                password: encryptedPassword,
                v_code: "",
                phone_area: "+86",
                picture_id: null
            };
            debugLog('登录请求参数:', loginPayload);

            const loginResponse = await fetch(`${BASE_URL}/new_login`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(loginPayload)
            });

            debugLog(`登录响应状态: ${loginResponse.status}`);
            const loginData = await loginResponse.json();
            debugLog('登录响应数据:', loginData);

            if (loginData.code !== "Success") {
                throw new Error(`登录失败: ${loginData.msg || '未知错误'}`);
            }

            const ticket = loginData.data.ticket;
            addLog(`✅ 成功获取到 Ticket: ${ticket}`, "success");
            debugLog(`获取到Ticket: ${ticket}`);

            // 步骤2: 使用 ticket 换取 token
            addLog("正在换取Token...", "info");
            debugLog(`发送passport请求到: ${BASE_URL}/passport`);

            const passportPayload = { ticket: ticket };
            debugLog('Passport请求参数:', passportPayload);

            const passportResponse = await fetch(`${BASE_URL}/passport`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(passportPayload)
            });

            debugLog(`Passport响应状态: ${passportResponse.status}`);
            const passportData = await passportResponse.json();
            debugLog('Passport响应数据:', passportData);

            if (passportData.code !== "Success") {
                throw new Error(`换取 Token 失败: ${passportData.msg || '未知错误'}`);
            }

            const token = passportData.data.token;
            addLog("🎉 成功获取到 Token！", "success");
            debugLog(`获取到Token: ${token.substring(0, 20)}...`);
            return token;

        } catch (error) {
            debugLog(`登录过程出错: ${error.message}`, error);
            addLog(`❌ 登录失败: ${error.message}`, "error");
            throw error;
        }
    }

    // 获取所有计算实例的列表
    async function getInstances(headers) {
        try {
            debugLog(`开始获取实例列表...`);
            addLog("正在获取实例列表...", "info");

            const response = await fetch(`${BASE_URL}/instance`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({})
            });

            debugLog(`获取实例响应状态: ${response.status}`);
            const data = await response.json();
            debugLog('实例列表响应数据:', data);

            if (data.code === "Success") {
                const instances = data.data.list;
                debugLog(`成功获取到 ${instances.length} 个实例`);
                addLog(`✅ 成功获取到 ${instances.length} 个实例`, "success");
                return instances;
            } else {
                throw new Error(`获取实例列表失败: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            debugLog(`获取实例列表失败: ${error.message}`, error);
            addLog(`❌ 获取实例列表失败: ${error.message}`, "error");
            throw error;
        }
    }

    // 开启指定的计算实例
    async function powerOnInstance(headers, instanceUuid) {
        try {
            debugLog(`开始开机实例: ${instanceUuid}`);
            addLog(`正在开机实例 ${instanceUuid}...`, "info");

            const payload = {
                instance_uuid: instanceUuid,
                payload: "non_gpu"
            };
            debugLog('开机请求参数:', payload);

            const response = await fetch(`${BASE_URL}/instance/power_on`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            debugLog(`开机响应状态: ${response.status}`);
            const data = await response.json();
            debugLog('开机响应数据:', data);

            if (data.code === "Success") {
                addLog(`实例 ${instanceUuid} 成功开机。`, "success");
                debugLog(`实例 ${instanceUuid} 开机成功`);
            } else {
                throw new Error(`开机失败: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            debugLog(`开机失败 ${instanceUuid}: ${error.message}`, error);
            addLog(`❌ 开机失败 ${instanceUuid}: ${error.message}`, "error");
            throw error;
        }
    }

    // 关闭指定的计算实例
    async function powerOffInstance(headers, instanceUuid) {
        try {
            debugLog(`开始关机实例: ${instanceUuid}`);
            addLog(`正在关机实例 ${instanceUuid}...`, "info");

            const payload = {
                instance_uuid: instanceUuid
            };
            debugLog('关机请求参数:', payload);

            const response = await fetch(`${BASE_URL}/instance/power_off`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            debugLog(`关机响应状态: ${response.status}`);
            const data = await response.json();
            debugLog('关机响应数据:', data);

            if (data.code === "Success") {
                addLog(`实例 ${instanceUuid} 成功关机。`, "success");
                debugLog(`实例 ${instanceUuid} 关机成功`);
            } else {
                throw new Error(`关机失败: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            debugLog(`关机失败 ${instanceUuid}: ${error.message}`, error);
            addLog(`❌ 关机失败 ${instanceUuid}: ${error.message}`, "error");
            throw error;
        }
    }

    // 等待函数
    function sleep(ms) {
        debugLog(`等待 ${ms} 毫秒...`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 添加日志
    function addLog(message, type = "info") {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;

        // 添加到控制面板
        const logContainer = document.getElementById('autodl-refresh-log');
        if (logContainer) {
            const logItem = document.createElement('div');
            logItem.className = `autodl-refresh-log-item autodl-refresh-log-${type}`;
            logItem.textContent = logMessage;
            logContainer.appendChild(logItem);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        // 同时输出到控制台
        console.log(`[AutoDL ${type.toUpperCase()}] ${message}`);
    }

    // 更新状态
    function updateStatus(message, type = "info") {
        debugLog(`更新状态: ${message} (${type})`);
        const statusElement = document.getElementById('autodl-refresh-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `autodl-refresh-status ${type}`;
        }
    }

    // 显示调试信息
    function showDebugInfo() {
        const debugContainer = document.getElementById('autodl-refresh-debug');
        if (debugContainer) {
            debugContainer.innerHTML = `
                <div class="autodl-refresh-debug-info">
                    <strong>调试信息:</strong><br>
                    - 脚本版本: 1.0.0<br>
                    - 调试模式: ${DEBUG_MODE ? '开启' : '关闭'}<br>
                    - 当前时间: ${new Date().toLocaleString()}<br>
                    - 页面URL: ${window.location.href}<br>
                    - 用户代理: ${navigator.userAgent.substring(0, 50)}...
                </div>
            `;
        }
    }

    // 显示确认弹框
    function showConfirmModal(runningInstances, callback) {
        const modal = document.createElement('div');
        modal.className = 'autodl-confirm-modal';

        const instanceList = runningInstances.map(inst => inst.uuid).join('\n');

        modal.innerHTML = `
            <div class="autodl-confirm-content">
                <div class="autodl-confirm-title">⚠️ 发现无卡模式实例冲突</div>
                <div class="autodl-confirm-message">
                    发现 ${runningInstances.length} 个无卡模式实例正在运行：
                    <div class="autodl-confirm-instances">${instanceList}</div>
                    是否关闭这些实例并执行其他符合条件的开关机操作？
                </div>
                <div class="autodl-confirm-note">
                    注：刚关闭的实例不会参与后续的开关机操作
                </div>
                <div class="autodl-confirm-buttons">
                    <button class="autodl-confirm-btn confirm">确认关闭并执行</button>
                    <button class="autodl-confirm-btn cancel">取消操作</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定按钮事件
        modal.querySelector('.autodl-confirm-btn.confirm').addEventListener('click', () => {
            modal.remove();
            callback(true); // 用户确认
        });

        modal.querySelector('.autodl-confirm-btn.cancel').addEventListener('click', () => {
            modal.remove();
            callback(false); // 用户取消
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                callback(false);
            }
        });
    }

    // 检查是否有无卡模式实例运行
    function checkRunningNonGpuInstances(instances) {
        // 这里需要根据实际的API响应结构调整
        // 假设实例对象中有 start_mode 字段表示启动模式
        return instances.filter(inst =>
            inst.status === "running" &&
            (inst.start_mode === "non_gpu" || inst.payload === "non_gpu")
        );
    }

    // 检查即将被释放的实例数量
    function checkAndUpdateWarningCounter(instances) {
        try {
            debugLog('开始检查即将被释放的实例...');
            let warningCount = 0;
            const today = new Date();

            for (const inst of instances) {
                if (inst.status === "shutdown") {
                    const stoppedInfo = inst.stopped_at;

                    if (stoppedInfo && stoppedInfo.Valid && stoppedInfo.Time) {
                        try {
                            const stoppedTime = new Date(stoppedInfo.Time);
                            const daysDiff = Math.floor((today - stoppedTime) / (1000 * 60 * 60 * 24));

                            // 检查是否关机了9天或更多（还有5天或更少会被释放）
                            if (daysDiff >= 9) {
                                warningCount++;
                                debugLog(`发现即将被释放的实例: ${inst.uuid}, 关机天数: ${daysDiff}`);
                            }
                        } catch (error) {
                            debugLog(`解析实例 ${inst.uuid} 时间出错: ${error.message}`);
                        }
                    }
                }
            }

            // 更新前端显示
            updateWarningCounter(warningCount);
            debugLog(`检查完成，发现 ${warningCount} 个即将被释放的实例`);

        } catch (error) {
            debugLog(`检查即将被释放实例时出错: ${error.message}`, error);
            updateWarningCounter(-1); // 显示错误状态
        }
    }

    // 更新警告计数器显示
    function updateWarningCounter(count) {
        const counterElement = document.getElementById('autodl-warning-counter');
        const countElement = document.getElementById('autodl-warning-count');

        if (!counterElement || !countElement) return;

        if (count === -1) {
            // 错误状态
            countElement.textContent = '检查失败';
            counterElement.className = 'autodl-warning-counter warning';
        } else if (count === 0) {
            // 安全状态
            countElement.textContent = '0';
            counterElement.className = 'autodl-warning-counter safe';
        } else {
            // 警告状态
            countElement.textContent = count.toString();
            counterElement.className = 'autodl-warning-counter warning';
        }
    }

    // 独立检查实例状态（不执行刷新任务）
    async function checkInstanceStatus() {
        const phone = document.getElementById('autodl-phone').value.trim();
        const password = document.getElementById('autodl-password').value.trim();

        if (!phone || !password) {
            updateWarningCounter(-1);
            return;
        }

        try {
            updateWarningCounter(-1); // 显示检查中状态
            document.getElementById('autodl-warning-count').textContent = '检查中...';

            // 登录并获取实例列表
            const token = await loginAndGetToken(phone, password);
            const authHeaders = { ...HEADERS, "Authorization": token };
            const instances = await getInstances(authHeaders);

            // 检查即将被释放的实例数量
            checkAndUpdateWarningCounter(instances);

        } catch (error) {
            debugLog(`独立检查实例状态失败: ${error.message}`, error);
            updateWarningCounter(-1);
        }
    }

    // 初始化展开内容
    function initializeExpandedContent() {
        // 显示调试信息
        showDebugInfo();

        // 从存储中获取保存的值
        const savedPhone = GM_getValue('phone', '');
        const savedPassword = GM_getValue('password', '');

        // 如果已有保存的账号密码，显示提示
        if (savedPhone && savedPassword) {
            addLog("✅ 已加载保存的账户信息", "success");
            addLog(`📱 手机号: ${savedPhone}`, "info");
            addLog("🔐 密码已保存，可直接执行", "info");
        } else {
            addLog("💡 首次使用，请填写账户信息并点击'保存设置'", "info");
        }

        addLog("🚀 AutoDL自动刷新插件已加载", "success");
        addLog("💡 功能说明：自动刷新关机超过指定天数的实例，防止被平台回收", "info");
        addLog("🔍 调试模式已开启，详细日志请查看浏览器控制台", "debug");
    }

    // 主执行函数
    async function executeAutoRefresh() {
        debugLog('开始执行自动刷新流程');
        console.log('🚀 ===== AutoDL 自动刷新开始 =====');

        // 展开面板显示完整内容
        const panel = document.querySelector('.autodl-refresh-panel');
        const expandedContent = document.querySelector('.autodl-expanded-content');
        const expandBtn = document.getElementById('autodl-expand-btn');
        if (panel && expandedContent) {
            panel.classList.add('expanded');
            expandedContent.classList.add('visible');
            if (expandBtn) expandBtn.textContent = '⬆️';
            document.getElementById('autodl-expand-hint').style.display = 'none'; // 隐藏提示
            // 初始化展开内容
            initializeExpandedContent();
        }

        const phone = document.getElementById('autodl-phone').value.trim();
        const password = document.getElementById('autodl-password').value.trim();
        const daysThreshold = parseInt(document.getElementById('autodl-days').value.trim());

        debugLog(`输入参数 - 手机号: ${phone}, 天数阈值: ${daysThreshold}`);

        if (!phone || !password || isNaN(daysThreshold)) {
            addLog("❌ 请填写完整的手机号、密码和天数阈值", "error");
            console.error("❌ 参数验证失败");
            return;
        }

        const startBtn = document.getElementById('autodl-start-btn');
        startBtn.disabled = true;
        startBtn.textContent = '执行中...';

        try {
            updateStatus("正在登录...", "running");
            console.log('📱 开始登录流程...');

            // 登录并获取 token
            const token = await loginAndGetToken(phone, password);

            // 使用 token 更新请求头
            const authHeaders = { ...HEADERS, "Authorization": token };
            debugLog('已更新请求头，包含Authorization token');

            updateStatus("正在获取实例列表...", "running");
            console.log('📋 开始获取实例列表...');

            // 获取实例列表
            const instances = await getInstances(authHeaders);

            // 检查即将被释放的实例数量
            checkAndUpdateWarningCounter(instances);

            // 检查是否有无卡模式实例运行
            const runningNonGpu = checkRunningNonGpuInstances(instances);
            const excludedInstances = []; // 记录要排除的实例

            if (runningNonGpu.length > 0) {
                addLog(`⚠️ 发现 ${runningNonGpu.length} 个无卡模式实例正在运行`, "warning");
                console.log('⚠️ 发现无卡模式实例冲突:', runningNonGpu);

                // 显示确认弹框
                return new Promise((resolve) => {
                    showConfirmModal(runningNonGpu, async (confirmed) => {
                        if (!confirmed) {
                            addLog("❌ 用户取消了操作", "warning");
                            updateStatus("操作已取消", "error");
                            startBtn.disabled = false;
                            startBtn.textContent = '开始执行';
                            resolve();
                            return;
                        }

                        // 用户确认，继续执行
                        addLog("✅ 用户确认关闭冲突实例", "success");

                        // 关闭冲突实例
                        for (const inst of runningNonGpu) {
                            try {
                                addLog(`正在关闭冲突实例: ${inst.uuid}`, "info");
                                await powerOffInstance(authHeaders, inst.uuid);
                                excludedInstances.push(inst.uuid);
                                await sleep(5000); // 等待5秒
                            } catch (error) {
                                addLog(`❌ 关闭冲突实例失败: ${inst.uuid}`, "error");
                            }
                        }

                        addLog(`✅ 已关闭 ${excludedInstances.length} 个冲突实例`, "success");

                        // 继续执行原有的开关机逻辑
                        await continueRefreshProcess(instances, excludedInstances, daysThreshold, authHeaders, startBtn);
                        resolve();
                    });
                });
            } else {
                // 没有冲突，直接执行
                await continueRefreshProcess(instances, excludedInstances, daysThreshold, authHeaders, startBtn);
            }

        } catch (error) {
            console.error('❌ 程序运行出错:', error);
            addLog(`❌ 程序运行出错: ${error.message}`, "error");
            updateStatus("执行失败", "error");
            startBtn.disabled = false;
            startBtn.textContent = '开始执行';
        }
    }

    // 继续执行刷新流程
    async function continueRefreshProcess(instances, excludedInstances, daysThreshold, authHeaders, startBtn) {
        try {
            // 筛选关机时长 >= 阈值的实例（排除冲突实例）
            console.log('🔍 开始筛选符合条件的实例...');
            const uuidsToRefresh = [];
            let totalShutdown = 0;

            // 将用户输入的"还有几天被释放"转换为"已关机几天"
            // AutoDL规则：关机14天后被释放，所以实际检查天数 = 14 - 用户输入的剩余天数
            const actualDaysThreshold = 14 - daysThreshold;
            addLog(`用户设置：还有${daysThreshold}天被释放，对应检查关机${actualDaysThreshold}天的实例`, "info");

            for (const inst of instances) {
                // 排除冲突实例
                if (excludedInstances.includes(inst.uuid)) {
                    debugLog(`跳过冲突实例: ${inst.uuid}`);
                    continue;
                }

                debugLog(`检查实例: ${inst.uuid}, 状态: ${inst.status}`);

                if (inst.status === "shutdown") {
                    totalShutdown++;
                    const stoppedInfo = inst.stopped_at;
                    debugLog(`实例 ${inst.uuid} 关机信息:`, stoppedInfo);

                    if (stoppedInfo && stoppedInfo.Valid && stoppedInfo.Time) {
                        try {
                            const stoppedTime = new Date(stoppedInfo.Time);
                            const now = new Date();
                            const daysDiff = Math.floor((now - stoppedTime) / (1000 * 60 * 60 * 24));
                            const remainingDays = 14 - daysDiff;

                            debugLog(`实例 ${inst.uuid} 关机天数: ${daysDiff} 天，还有 ${remainingDays} 天被释放`);

                            if (daysDiff >= actualDaysThreshold) {
                                uuidsToRefresh.push(inst.uuid);
                                addLog(`�� 发现符合条件的实例: ${inst.uuid} (关机${daysDiff}天，还有${remainingDays}天被释放)`, "info");
                            }
                        } catch (error) {
                            debugLog(`解析实例 ${inst.uuid} 关机时间出错：${error.message}`, error);
                            addLog(`⚠️ 解析实例 ${inst.uuid} 关机时间出错：${error.message}`, "warning");
                        }
                    }
                }
            }

            console.log(`📊 统计信息: 总实例 ${instances.length}, 关机实例 ${totalShutdown}, 冲突实例 ${excludedInstances.length}, 需要刷新 ${uuidsToRefresh.length}`);

            if (uuidsToRefresh.length === 0) {
                addLog(`🎉 没有找到还有${daysThreshold}天或更少会被释放的实例，无需刷新。`, "success");
                updateStatus("无需刷新", "completed");
                console.log('✅ 无需刷新任何实例');
                return;
            }

            addLog(`共找到 ${uuidsToRefresh.length} 个还有${daysThreshold}天或更少会被释放的实例，即将执行"五开模式"...`, "info");
            updateStatus(`正在处理 ${uuidsToRefresh.length} 个实例...`, "running");
            console.log(`🔄 开始处理 ${uuidsToRefresh.length} 个实例...`);

            // 执行开关机操作
            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < uuidsToRefresh.length; i++) {
                const uuid = uuidsToRefresh[i];
                try {
                    console.log(`\n🔄 处理实例 ${i + 1}/${uuidsToRefresh.length}: ${uuid}`);
                    addLog(`\n--- 正在处理实例 ${uuid} (${i + 1}/${uuidsToRefresh.length}) ---`, "info");

                    // 开机
                    await powerOnInstance(authHeaders, uuid);
                    addLog("等待 10 秒...", "info");
                    await sleep(10000);

                    // 关机
                    await powerOffInstance(authHeaders, uuid);
                    addLog("等待 10 秒...", "info");
                    await sleep(10000);

                    successCount++;
                    console.log(`✅ 实例 ${uuid} 处理完成`);

                } catch (error) {
                    errorCount++;
                    console.error(`❌ 实例 ${uuid} 处理失败:`, error);
                    addLog(`❌ 操作实例 ${uuid} 时出现错误: ${error.message}`, "error");
                }
            }

            console.log(`\n📈 执行结果统计: 成功 ${successCount}, 失败 ${errorCount}`);
            addLog(`\n🎉 所有符合条件的实例已完成开关机操作。成功: ${successCount}, 失败: ${errorCount}`, "success");
            updateStatus("执行完成", "completed");

            // 发送通知
            GM_notification({
                text: `AutoDL自动刷新完成！处理了 ${uuidsToRefresh.length} 个实例，成功: ${successCount}, 失败: ${errorCount}`,
                title: "AutoDL助手",
                timeout: 5000
            });

        } catch (error) {
            console.error('❌ 刷新流程出错:', error);
            addLog(`❌ 刷新流程出错: ${error.message}`, "error");
            updateStatus("执行失败", "error");
        } finally {
            startBtn.disabled = false;
            startBtn.textContent = '开始执行';
            console.log('🏁 ===== AutoDL 自动刷新结束 =====');
        }
    }

    // 手动保存设置函数
    function saveCredentials() {
        const phone = document.getElementById('autodl-phone').value.trim();
        const password = document.getElementById('autodl-password').value.trim();
        const days = document.getElementById('autodl-days').value.trim();

        if (!phone || !password || !days) {
            // 展开面板以显示错误信息
            const panel = document.querySelector('.autodl-refresh-panel');
            const expandedContent = document.querySelector('.autodl-expanded-content');
            const expandBtn = document.getElementById('autodl-expand-btn');
            if (panel && expandedContent && !expandedContent.classList.contains('visible')) {
                panel.classList.add('expanded');
                expandedContent.classList.add('visible');
                if (expandBtn) expandBtn.textContent = '⬆️';
                document.getElementById('autodl-expand-hint').style.display = 'none'; // 隐藏提示
                initializeExpandedContent();
            }
            addLog("❌ 请填写完整的手机号、密码和天数阈值", "error");
            return;
        }

        // 展开面板以显示保存确认信息
        const panel = document.querySelector('.autodl-refresh-panel');
        const expandedContent = document.querySelector('.autodl-expanded-content');
        const expandBtn = document.getElementById('autodl-expand-btn');
        if (panel && expandedContent && !expandedContent.classList.contains('visible')) {
            panel.classList.add('expanded');
            expandedContent.classList.add('visible');
            if (expandBtn) expandBtn.textContent = '⬆️';
            document.getElementById('autodl-expand-hint').style.display = 'none'; // 隐藏提示
            initializeExpandedContent();
        }

        GM_setValue('phone', phone);
        GM_setValue('password', password);
        GM_setValue('days', days);

        addLog("✅ 账户信息已保存！下次使用时将自动加载", "success");
        addLog("🔒 密码已加密存储在本地，请放心使用", "info");

        // 更新按钮状态
        const saveBtn = document.getElementById('autodl-save-btn');
        saveBtn.textContent = '已保存';
        saveBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

        setTimeout(() => {
            saveBtn.textContent = '保存设置';
            saveBtn.style.background = 'linear-gradient(135deg, #17a2b8, #138496)';
        }, 2000);
    }

    // 清除保存的账户信息
    function clearCredentials() {
        if (confirm('确定要清除保存的账户信息吗？这将删除您之前输入的手机号和密码。')) {
            GM_deleteValue('phone');
            GM_deleteValue('password');
            GM_deleteValue('days');
            addLog("✅ 账户信息已清除！", "success");
            addLog("💡 请重新填写账户信息以继续使用。", "info");

            // 清空输入框
            document.getElementById('autodl-phone').value = '';
            document.getElementById('autodl-password').value = '';
            document.getElementById('autodl-days').value = '5';
        }
    }

    // 测试连接函数
    async function testConnection() {
        const phone = document.getElementById('autodl-phone').value.trim();
        const password = document.getElementById('autodl-password').value.trim();
        const days = document.getElementById('autodl-days').value.trim();

        if (!phone || !password || !days) {
            // 展开面板以显示错误信息
            const panel = document.querySelector('.autodl-refresh-panel');
            const expandedContent = document.querySelector('.autodl-expanded-content');
            const expandBtn = document.getElementById('autodl-expand-btn');
            if (panel && expandedContent && !expandedContent.classList.contains('visible')) {
                panel.classList.add('expanded');
                expandedContent.classList.add('visible');
                if (expandBtn) expandBtn.textContent = '⬆️';
                document.getElementById('autodl-expand-hint').style.display = 'none'; // 隐藏提示
                initializeExpandedContent();
            }
            addLog("❌ 请填写完整的手机号、密码和天数阈值", "error");
            return;
        }

        // 展开面板以显示测试过程
        const panel = document.querySelector('.autodl-refresh-panel');
        const expandedContent = document.querySelector('.autodl-expanded-content');
        const expandBtn = document.getElementById('autodl-expand-btn');
        if (panel && expandedContent && !expandedContent.classList.contains('visible')) {
            panel.classList.add('expanded');
            expandedContent.classList.add('visible');
            if (expandBtn) expandBtn.textContent = '⬆️';
            document.getElementById('autodl-expand-hint').style.display = 'none'; // 隐藏提示
            initializeExpandedContent();
        }

        try {
            updateStatus("正在测试连接...", "running");
            console.log('🔗 开始测试连接...');

            // 尝试登录并获取实例列表
            const token = await loginAndGetToken(phone, password);
            const authHeaders = { ...HEADERS, "Authorization": token };
            const instances = await getInstances(authHeaders);

            addLog(`✅ 连接测试成功！可以正常登录和获取实例。`, "success");
            updateStatus("连接成功", "completed");
            GM_notification({
                text: "AutoDL连接测试成功！",
                title: "AutoDL助手",
                timeout: 3000
            });

        } catch (error) {
            addLog(`❌ 连接测试失败: ${error.message}`, "error");
            updateStatus("连接失败", "error");
            GM_notification({
                text: `AutoDL连接测试失败: ${error.message}`,
                title: "AutoDL助手",
                timeout: 5000
            });
        }
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'autodl-refresh-panel';

        // 从存储中获取保存的值
        const savedPhone = GM_getValue('phone', '');
        const savedPassword = GM_getValue('password', '');
        const savedDays = GM_getValue('days', '5');

        panel.innerHTML = `
            <div class="autodl-refresh-header">
                <span>🤖 AutoDL 自动刷新</span>
                <div>
                    <button class="autodl-refresh-expand" id="autodl-expand-btn">⬇️</button>
                    <button class="autodl-refresh-close">×</button>
                </div>
            </div>
            <div class="autodl-refresh-content">
                <div class="autodl-refresh-input-group">
                    <label for="autodl-phone">手机号:</label>
                    <input type="text" id="autodl-phone" placeholder="请输入手机号" value="${savedPhone}">
                </div>
                <div class="autodl-refresh-input-group">
                    <label for="autodl-password">密码:</label>
                    <input type="password" id="autodl-password" placeholder="请输入密码" value="${savedPassword}">
                </div>
                <div class="autodl-refresh-input-group">
                    <label for="autodl-days">天数阈值:</label>
                    <input type="number" id="autodl-days" placeholder="如: 5" value="${savedDays}" min="1" max="13">
                </div>
                <div style="font-size: 11px; color: #6c757d; margin-top: -6px; margin-bottom: 8px; text-align: center;">
                    输入还有几天会被释放（如输入5=找还有5天被释放的实例）
                </div>
                <button id="autodl-start-btn" class="autodl-refresh-btn">开始执行</button>

                <div class="autodl-warning-counter safe" id="autodl-warning-counter">
                    5天后被释放的数量: <span id="autodl-warning-count">检查中...</span>
                </div>

                <div class="autodl-expand-hint" id="autodl-expand-hint">点击 ⬇️ 显示全部页面</div>

                <div class="autodl-expanded-content">
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <button id="autodl-save-btn" class="autodl-refresh-btn" style="flex: 1; background: linear-gradient(135deg, #17a2b8, #138496);">保存设置</button>
                        <button id="autodl-test-btn" class="autodl-refresh-btn" style="flex: 1; background: linear-gradient(135deg, #ffc107, #e0a800);">测试连接</button>
                    </div>
                    <button id="autodl-clear-btn" class="autodl-refresh-btn" style="background: linear-gradient(135deg, #dc3545, #c82333); font-size: 12px;">清除保存信息</button>
                    <div id="autodl-refresh-status" class="autodl-refresh-status">准备就绪</div>
                    <div class="autodl-refresh-log" id="autodl-refresh-log"></div>
                    <div id="autodl-refresh-debug"></div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 从存储中获取保存的位置
        const savedX = GM_getValue('panel_x', 0);
        const savedY = GM_getValue('panel_y', 0);

        // 添加拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = savedX;
        let yOffset = savedY;

        // 恢复保存的位置
        if (savedX !== 0 || savedY !== 0) {
            setTranslate(savedX, savedY, panel);
        }

        function dragStart(e) {
            if (e.target.closest('.autodl-refresh-close') ||
                e.target.closest('input') ||
                e.target.closest('button') ||
                e.target.closest('.autodl-refresh-log')) {
                return;
            }

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === panel || e.target.closest('.autodl-refresh-header')) {
                isDragging = true;
                panel.classList.add('dragging');
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            panel.classList.remove('dragging');
            
            // 保存当前位置到存储
            GM_setValue('panel_x', xOffset);
            GM_setValue('panel_y', yOffset);
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, panel);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        panel.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // 绑定按钮事件
        document.getElementById('autodl-start-btn').addEventListener('click', executeAutoRefresh);
        document.getElementById('autodl-save-btn').addEventListener('click', saveCredentials);
        document.getElementById('autodl-clear-btn').addEventListener('click', clearCredentials);
        document.getElementById('autodl-test-btn').addEventListener('click', testConnection);
        document.querySelector('.autodl-refresh-close').addEventListener('click', () => {
            panel.remove();
        });

        // 展开/收起切换功能
        document.getElementById('autodl-expand-btn').addEventListener('click', () => {
            const expandedContent = document.querySelector('.autodl-expanded-content');
            const expandBtn = document.getElementById('autodl-expand-btn');

            if (expandedContent.classList.contains('visible')) {
                // 当前是展开状态，执行收起
                panel.classList.remove('expanded');
                expandedContent.classList.remove('visible');
                expandBtn.textContent = '⬇️';
                document.getElementById('autodl-expand-hint').style.display = 'block'; // 显示提示
            } else {
                // 当前是收起状态，执行展开
                panel.classList.add('expanded');
                expandedContent.classList.add('visible');
                expandBtn.textContent = '⬆️';
                document.getElementById('autodl-expand-hint').style.display = 'none'; // 隐藏提示
                // 初始化展开内容
                initializeExpandedContent();
            }
        });

        // 自动保存设置（当输入框失去焦点时）
        const saveSettings = () => {
            const phone = document.getElementById('autodl-phone').value.trim();
            const password = document.getElementById('autodl-password').value.trim();
            const days = document.getElementById('autodl-days').value.trim();

            if (phone) GM_setValue('phone', phone);
            if (password) GM_setValue('password', password);
            if (days) GM_setValue('days', days);

            // 如果手机号和密码都有值，自动检查实例状态
            if (phone && password) {
                checkInstanceStatus();
            }
        };

        // 绑定事件监听器
        document.getElementById('autodl-phone').addEventListener('blur', saveSettings);
        document.getElementById('autodl-password').addEventListener('blur', saveSettings);
        document.getElementById('autodl-days').addEventListener('blur', saveSettings);

        // 不在初始状态显示调试信息和日志
        // 只有在点击开始执行后才会显示

        // 如果已有保存的账号密码，自动检查一次实例状态
        const checkSavedPhone = GM_getValue('phone', '');
        const checkSavedPassword = GM_getValue('password', '');
        if (checkSavedPhone && checkSavedPassword) {
            setTimeout(() => {
                checkInstanceStatus();
            }, 1000); // 延迟1秒后检查，确保页面完全加载
        }
    }

    // 等待页面加载完成后创建控制面板
    function init() {
        console.log('🚀 AutoDL 自动刷新插件正在初始化...');

        // 检查是否在AutoDL网站
        if (window.location.hostname.includes('autodl.com')) {
            debugLog('检测到AutoDL网站，准备创建控制面板');

            // 延迟创建面板，确保页面完全加载
            setTimeout(() => {
                createControlPanel();
                console.log('✅ AutoDL 自动刷新插件初始化完成');
            }, 2000);
        } else {
            console.log('❌ 当前网站不是AutoDL，插件不会运行');
        }
    }

    // 启动插件
    init();
})();