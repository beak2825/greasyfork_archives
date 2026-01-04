// ==UserScript==
// @name         TJ-DORM-WIFI 辅助
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  同济大学宿舍网络登录助手
// @author       kexu
// @match        http://172.21.0.54/*
// @match        http://172.21.0.54:8080/*
// @match        http://172.21.0.54/index.html*
// @match        http://172.21.0.54/drcom/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      172.21.0.54
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519430/TJ-DORM-WIFI%20%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/519430/TJ-DORM-WIFI%20%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        .tj-wifi-container {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            bottom: 20px !important; /* 添加底部边距 */
            z-index: 999999999 !important;
            background: white !important;
            padding: 24px !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            width: 380px !important; /* 固定宽度 */
            height: auto !important;
            max-height: calc(100vh - 40px) !important; /* 视窗高度减去上下边距 */
            visibility: visible !important;
            opacity: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            pointer-events: auto !important;
            transform: none !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            overflow: hidden !important;
        }

        .tj-wifi-container h2 {
            margin: 0 0 24px 0 !important;
            text-align: center !important;
            color: #1a202c !important;
            font-size: 22px !important;
            font-weight: 600 !important;
        }

        .tj-wifi-container input,
        .tj-wifi-container select {
            width: 100% !important;
            padding: 14px !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 16px !important;
            font-size: 15px !important;
            transition: all 0.3s ease !important;
            box-sizing: border-box !important;
            background: #f8fafc !important;
            margin-bottom: 12px !important;
            color: #1a202c !important;
            -webkit-appearance: none !important;
            appearance: none !important;
        }

        .tj-wifi-container select {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
            background-repeat: no-repeat !important;
            background-position: right 12px center !important;
            background-size: 16px !important;
            padding-right: 40px !important;
        }

        .tj-wifi-container input:focus,
        .tj-wifi-container select:focus {
            border-color: #3b82f6 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            background: white !important;
        }

        .tj-wifi-container button {
            width: 100% !important;
            padding: 14px !important;
            border: none !important;
            border-radius: 16px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            margin-bottom: 12px !important;
            color: white !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .tj-wifi-container button:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }

        .tj-wifi-container button:active {
            transform: translateY(0) !important;
        }

        .tj-wifi-container button.login-btn {
            background: linear-gradient(135deg, #3b82f6, #10b981) !important;
        }

        .tj-wifi-container button.logout-btn {
            background: linear-gradient(135deg, #ef4444, #f59e0b) !important;
        }

        .tj-wifi-container button.device-btn {
            background: linear-gradient(135deg, #06b6d4, #0ea5e9) !important;
        }

        .status-card {
            background: #ffffff !important;
            border-radius: 12px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            overflow: hidden !important;
            border: 1px solid #e2e8f0 !important;
        }

        .status-header {
            padding: 12px 16px !important;
            background: #f8fafc !important;
            border-bottom: 1px solid #e2e8f0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .status-content {
            padding: 20px !important;
        }

        .status-row {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 16px !important;
            font-size: 14px !important;
            padding: 4px 8px !important;
            background: #f8fafc !important;
            border-radius: 6px !important;
        }

        .status-row:last-child {
            margin-bottom: 0 !important;
        }

        .status-label {
            color: #64748b !important;
            font-weight: 500 !important;
        }

        .status-value {
            color: #1e293b !important;
            font-weight: 600 !important;
        }

        .status-icon {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 20px !important;
            height: 20px !important;
            background: #dcfce7 !important;
            color: #16a34a !important;
            border-radius: 50% !important;
            font-size: 12px !important;
        }

        .status-footer {
            padding: 12px 16px !important;
            background: #f8fafc !important;
            border-top: 1px solid #e2e8f0 !important;
            font-size: 13px !important;
            color: #64748b !important;
            text-align: right !important;
        }

        .device-list {
            flex: 1 1 auto !important;
            overflow-y: auto !important;
            margin-top: 16px !important;
            padding-right: 8px !important;
            width: 100% !important; /* 确保列表占满容器宽度 */
        }

        .device-list::-webkit-scrollbar {
            width: 6px !important;
        }

        .device-list::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
            border-radius: 3px !important;
        }

        .device-list::-webkit-scrollbar-thumb {
            background: #888 !important;
            border-radius: 3px !important;
        }

        .device-list::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
        }

        .device-list-header {
            color: #64748b !important;
            font-size: 14px !important;
            margin-bottom: 12px !important;
            padding: 0 4px !important;
        }

        .device-card {
            background: #f8fafc !important;
            border-radius: 16px !important;
            padding: 16px !important;
            margin-bottom: 12px !important;
            border: 1px solid #e2e8f0 !important;
        }

        .device-card .device-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 12px !important;
            padding-bottom: 8px !important;
            border-bottom: 1px solid #e2e8f0 !important;
        }

        .device-card .device-title {
            color: #1e293b !important;
            font-weight: 600 !important;
            font-size: 15px !important;
        }

        .device-card .device-status {
            padding: 4px 12px !important;
            border-radius: 20px !important;
            font-size: 13px !important;
            background: #dcfce7 !important;
            color: #10b981 !important;
            font-weight: 500 !important;
        }

        .device-info-row {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 8px !important;
            font-size: 14px !important;
        }

        .device-info-row:last-child {
            margin-bottom: 0 !important;
        }

        .device-info-label {
            color: #64748b !important;
        }

        .device-info-value {
            color: #1e293b !important;
            font-weight: 500 !important;
        }

        .device-list-card {
            width: 100% !important;
            background: white !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            border: 1px solid #17a2b820 !important;
        }
    `);

    // 检查UI是否已存在
    function isUIExists() {
        return document.getElementById('login-container') !== null;
    }

    // 创建UI
    function createUI() {
        try {
            console.log('[TJ-WIFI] 开始创建UI...');
            if (isUIExists()) {
                console.log('[TJ-WIFI] UI已存在，跳过创建');
                return;
            }

            const container = document.createElement('div');
            container.id = 'login-container';
            container.className = 'tj-wifi-container';
            console.log('[TJ-WIFI] 创建container元素');

            // 添加标题
            const title = document.createElement('h2');
            title.textContent = 'TJ-DORM-WIFI 辅助';
            title.style.cssText = `
                margin: 0 0 20px 0;
                text-align: center;
                color: #2c3e50;
                font-size: 20px;
                font-weight: 600;
            `;
            container.appendChild(title);

            // 添加登录部分
            const loginSection = document.createElement('div');
            loginSection.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            `;

            // 添加用户名输入框
            const username = document.createElement('input');
            username.id = 'username';
            username.type = 'text';
            username.placeholder = '学号';
            username.value = GM_getValue('username', '');

            // 添加密码输入框
            const password = document.createElement('input');
            password.id = 'password';
            password.type = 'password';
            password.placeholder = '密码';
            password.value = GM_getValue('password', '');

            // 添加网络选择下拉框
            const networkSelector = document.createElement('select');
            networkSelector.id = 'network-type';
            networkSelector.innerHTML = `
                <option value="0">校园网</option>
                <option value="2">中国移动</option>
                <option value="3">中国联通</option>
                <option value="4">中国电信</option>
            `;

            const savedNetworkType = GM_getValue('networkType', '0');
            networkSelector.value = savedNetworkType;

            networkSelector.addEventListener('change', function() {
                GM_setValue('networkType', this.value);
            });

            // 添加按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 10px;
            `;

            // 添加登录按钮
            const loginButton = document.createElement('button');
            loginButton.textContent = '登录';
            loginButton.className = 'login-btn';
            loginButton.addEventListener('click', autoLogin);

            // 添加登出按钮
            const logoutButton = document.createElement('button');
            logoutButton.textContent = '登出';
            logoutButton.className = 'logout-btn';
            logoutButton.addEventListener('click', autoLogout);

            // 添加设备列表按钮
            const deviceButton = document.createElement('button');
            deviceButton.textContent = '查看设备列表';
            deviceButton.className = 'device-btn';
            deviceButton.addEventListener('click', getDeviceList);

            // 添加状态显示区域
            const statusDiv = document.createElement('div');
            statusDiv.id = 'login-status';
            statusDiv.className = 'status-card';

            // 添加设备列表显示区域
            const deviceListDiv = document.createElement('div');
            deviceListDiv.id = 'device-list';
            deviceListDiv.style.cssText = `
                margin-top: 15px;
                display: none;
            `;

            // 组装UI
            loginSection.appendChild(username);
            loginSection.appendChild(password);
            loginSection.appendChild(networkSelector);
            buttonContainer.appendChild(loginButton);
            buttonContainer.appendChild(logoutButton);
            buttonContainer.appendChild(deviceButton);
            loginSection.appendChild(buttonContainer);
            container.appendChild(loginSection);
            container.appendChild(statusDiv);
            container.appendChild(deviceListDiv);

            document.body.appendChild(container);
            console.log('[TJ-WIFI] UI创建成功');

            // 保存用户名和密码
            username.addEventListener('change', () => {
                console.log('[TJ-WIFI] 保存用户名');
                GM_setValue('username', username.value);
            });
            password.addEventListener('change', () => {
                console.log('[TJ-WIFI] 保存密码');
                GM_setValue('password', password.value);
            });
        } catch (error) {
            console.error('[TJ-WIFI] 创建UI时发生错误:', error);
        }
    }

    // 自动登录功能
    function autoLogin() {
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        const networkType = document.getElementById('network-type')?.value || '0';

        if (!username || !password) {
            updateStatus('请输入用户名和密码', 'error');
            return;
        }

        // 根据网络类型构建登录参数
        const loginParams = {
            callback: 'dr1003',
            DDDDD: username,
            upass: password,
            '0MKKey': '123456',
            R1: '0',
            R2: '',
            R3: networkType,  // 使用选择的网络类型
            R6: '0',
            para: '00',
            v6ip: '',
            terminal_type: '1',
            lang: 'zh-cn',
            jsVersion: '4.1',
            v: '2653',
            lang: 'zh'
        };

        // 构建URL参数字符串
        const queryString = Object.entries(loginParams)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        const loginUrl = `http://172.21.0.54/drcom/login?${queryString}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: loginUrl,
            onload: function(response) {
                if (response.status === 200) {
                    updateStatus('登录请求已发送...', 'info');
                    setTimeout(() => {
                        checkLoginStatus(() => {
                            setTimeout(() => {
                                window.location.reload();
                            }, 300);
                        });
                    }, 500);
                } else {
                    updateStatus('登录请求失败', 'error');
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);
                }
            },
            onerror: function() {
                updateStatus('网络错误', 'error');
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            }
        });
    }

    // 自动登出功能
    function autoLogout() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://172.21.0.54/drcom/logout?callback=dr1006',
            onload: function(response) {
                if (response.status === 200) {
                    updateStatus('已登出', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);
                } else {
                    updateStatus('登出失败', 'error');
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);
                }
            },
            onerror: function() {
                updateStatus('网络错误', 'error');
                setTimeout(() => {
                    window.location.reload();
                }, 800);
            }
        });
    }

    // 检查登录状态
    function checkLoginStatus(callback) {
        console.log('[TJ-WIFI] 开始检查登录状态');
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://172.21.0.54/',
            timeout: 5000,
            onload: function(response) {
                try {
                    const isLoggedIn = response.responseText.includes('注销页') &&
                                     !response.responseText.includes('上网登录页');

                    if (isLoggedIn) {
                        console.log('[TJ-WIFI] 检测到已登录状态');
                        const uidMatch = response.responseText.match(/uid\s*=\s*["']([^"']+)["']/);
                        const nameMatch = response.responseText.match(/NID\s*=\s*["']([^"']+)["']/);
                        const ipMatch = response.responseText.match(/v4ip\s*=\s*["']([^"']+)["']/);
                        const loginTimeMatch = response.responseText.match(/stime\s*=\s*["']([^"']+)["']/);

                        const uid = uidMatch ? uidMatch[1].trim() : '未知';
                        const name = nameMatch ? nameMatch[1].trim() : '未知';
                        const ip = ipMatch ? ipMatch[1].trim() : '未知';
                        const loginTime = loginTimeMatch ? loginTimeMatch[1].trim() : '未知';

                        const statusInfo = {
                            type: 'success',
                            status: '在线',
                            details: {
                                学号: uid,
                                姓名: name,
                                IP: ip,
                                登录时间: loginTime
                            }
                        };
                        updateStatusWithFormat(statusInfo);
                    } else {
                        console.log('[TJ-WIFI] 检测到未登录状态');
                        updateStatusWithFormat({
                            type: 'error',
                            status: '离线',
                            message: '未登录'
                        });
                    }

                    if (callback) callback();
                } catch (error) {
                    console.error('[TJ-WIFI] 解析登录状态失败:', error);
                    updateStatusWithFormat({
                        type: 'warning',
                        status: '错误',
                        message: '状态检查失败'
                    });
                    if (callback) callback();
                }
            },
            onerror: function() {
                console.error('[TJ-WIFI] 网络请求失败');
                updateStatusWithFormat({
                    type: 'error',
                    status: '错误',
                    message: '网络请求失败'
                });
                if (callback) callback();
            }
        });
    }

    // 格式化状态显示
    function updateStatusWithFormat(statusInfo) {
        const statusDiv = document.getElementById('login-status');
        if (!statusDiv) return;

        // 立即显示一个加载状态
        if (!statusDiv.innerHTML) {
            statusDiv.innerHTML = `
                <div class="status-card">
                    <div class="status-header">
                        <span style="color: #17a2b8;">⟳</span>
                        <span style="color: #17a2b8; font-weight: 500;">正在检查状态...</span>
                    </div>
                    <div class="status-content">
                        <div style="text-align: center; color: #4a5568;">
                            正在获取网络状态信息
                        </div>
                    </div>
                </div>
            `;
            statusDiv.style.display = 'block';
        }

        let content = '';

        if (statusInfo.type === 'success' && statusInfo.details) {
            content = `
                <div class="status-card">
                    <div class="status-header">
                        <span class="status-icon">✓</span>
                        <span style="color: #28a745; font-weight: 500;">在线</span>
                    </div>
                    <div class="status-content">
                        <div class="status-row">
                            <span class="status-label">学号</span>
                            <span class="status-value">${statusInfo.details.学号}</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">姓名</span>
                            <span class="status-value">${statusInfo.details.姓名}</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">IP</span>
                            <span class="status-value">${statusInfo.details.IP}</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">登录时间</span>
                            <span class="status-value">${statusInfo.details.登录时间}</span>
                        </div>
                    </div>
                    <div class="status-footer">
                        更新时间: ${new Date().toLocaleTimeString()}
                    </div>
                </div>
            `;
        } else {
            const colors = {
                error: '#dc3545',
                info: '#17a2b8',
                warning: '#ffc107'
            };

            content = `
                <div class="status-card">
                    <div class="status-header">
                        <span style="color: ${colors[statusInfo.type]};">${
                            statusInfo.type === 'error' ? '✗' :
                            statusInfo.type === 'warning' ? '⚠️' : 'ℹ'
                        }</span>
                        <span style="color: ${colors[statusInfo.type]}; font-weight: 500;">
                            ${statusInfo.status}
                        </span>
                    </div>
                    <div class="status-content">
                        <div style="text-align: center; color: #4a5568;">
                            ${statusInfo.message}
                        </div>
                    </div>
                    <div class="status-footer">
                        更新时间: ${new Date().toLocaleTimeString()}
                    </div>
                </div>
            `;
        }

        statusDiv.innerHTML = content;
        statusDiv.style.display = 'block';
    }

    // 更新状态显示（兼容旧的调用方式）
    function updateStatus(message, type = 'info') {
        if (message.includes('在线')) {
            const parts = message.split(' ');
            updateStatusWithFormat({
                type: 'success',
                status: '在线',
                details: {
                    学号: parts[2].split(':')[1],
                    姓名: parts[3].split(':')[1],
                    IP: parts[4].split(':')[1],
                    登录时间: parts[5].split(':').slice(1).join(':')
                }
            });
        } else {
            updateStatusWithFormat({
                type,
                status: type === 'success' ? '成功' : type === 'error' ? '错误' : '提示',
                message
            });
        }
    }

    // 获取设备列表
    function getDeviceList() {
        const username = document.getElementById('username')?.value;

        if (!username) {
            updateStatus('请先输入学号', 'error');
            return;
        }

        const deviceListUrl = `http://172.21.0.54:801/eportal/portal/mac/find?callback=dr1002&user_account=${username}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: deviceListUrl,
            headers: {
                'Host': '172.21.0.54:801',
                'Connection': 'keep-alive',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Sec-GPC': '1',
                'Accept-Language': 'zh-CN,zh',
                'Referer': 'http://172.21.0.54/'
            },
            onload: function(response) {
                try {
                    // 解析返回的数据
                    let jsonStr = response.responseText;

                    // 调试输出
                    console.log('Raw response:', jsonStr);

                    // 提取JSON部分
                    const match = jsonStr.match(/dr1002\((.*)\)/);
                    if (!match || !match[1]) {
                        throw new Error('Invalid response format');
                    }
                    jsonStr = match[1];

                    // 调试输出
                    console.log('Extracted JSON:', jsonStr);

                    const data = JSON.parse(jsonStr);
                    console.log('Parsed data:', data);

                    if (data.result === 1 && Array.isArray(data.list)) {
                        displayDeviceList(data.list, data.total);
                    } else {
                        updateDeviceListStatus(data.msg || '无设备数据', 'info');
                    }
                } catch (error) {
                    console.error('解析设备列表失败:', error);
                    console.error('原始数据:', response.responseText);
                    updateDeviceListStatus('获取设备列表失败: ' + error.message, 'error');
                }
            },
            onerror: function() {
                updateDeviceListStatus('网络请求失败', 'error');
            }
        });
    }

    // 显示设备列表
    function displayDeviceList(devices, total) {
        const deviceListDiv = document.getElementById('device-list');
        if (!deviceListDiv) return;

        // 确保容器可以滚动
        deviceListDiv.style.display = 'block';
        deviceListDiv.style.maxHeight = '400px';
        deviceListDiv.style.overflowY = 'auto';
        deviceListDiv.style.overflowX = 'hidden';
        deviceListDiv.style.paddingRight = '10px';
        deviceListDiv.style.position = 'relative';

        // 生成设备列表HTML
        let content = `
            <div class="device-list-card" style="
                background: white;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #17a2b820;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    background: #17a2b810;
                    border-bottom: 1px solid #17a2b820;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                    background: white;
                ">
                    <span style="
                        color: #17a2b8;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        设备列表 (共${total}台)
                    </span>
                </div>
                <div style="padding: 12px;">
                    <div style="
                        display: grid;
                        gap: 16px;
                        color: #4a5568;
                    ">
        `;

        // 添加每个设备的信息
        devices.forEach((device, index) => {
            // 计算在线时长
            const timeLong = parseInt(device.time_long);
            const hours = Math.floor(timeLong / 3600);
            const minutes = Math.floor((timeLong % 3600) / 60);
            const seconds = timeLong % 60;
            const timeStr = `${hours}小时${minutes}分${seconds}秒`;

            // 计算流量
            const uplink = (parseInt(device.uplink_bytes) / 1024 / 1024).toFixed(2);
            const downlink = (parseInt(device.downlink_bytes) / 1024 / 1024).toFixed(2);

            // 格式化登录时间
            const loginTime = device.online_time.split(' ');
            const datePart = loginTime[0];
            const timePart = loginTime[1];

            content += `
                <div style="
                    padding: 12px;
                    background: #e3f2fd;
                    border-radius: 6px;
                    border: 1px solid #90caf9;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    ">
                        <span style="
                            font-weight: 500;
                            color: #1976d2;
                        ">
                            设备 ${index + 1}
                        </span>
                        <span style="
                            font-size: 12px;
                            padding: 2px 8px;
                            border-radius: 12px;
                            background: #28a74520;
                            color: #28a745;
                        ">
                            在线
                        </span>
                    </div>
                    <div style="display: grid; gap: 4px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #718096; font-size: 13px;">MAC地址</span>
                            <span style="text-align: right;">${device.online_mac || '-'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #718096; font-size: 13px;">IP地址</span>
                            <span style="text-align: right;">${device.online_ip || '-'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <span style="color: #718096; font-size: 13px;">登录时间</span>
                            <span style="text-align: right;">
                                ${datePart}<br>${timePart}
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #718096; font-size: 13px;">在线时长</span>
                            <span style="text-align: right;">${timeStr}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #718096; font-size: 13px;">上行流量</span>
                            <span style="text-align: right;">${uplink} MB</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #718096; font-size: 13px;">下行流量</span>
                            <span style="text-align: right;">${downlink} MB</span>
                        </div>
                    </div>
                </div>
            `;
        });

        content += `
                </div>
            </div>
        </div>
    `;

    // 设置内容并确保可滚动
    deviceListDiv.innerHTML = content;
    deviceListDiv.style.webkitOverflowScrolling = 'touch'; // 移动端平滑滚动
    }

    // 更新设备列表状态
    function updateDeviceListStatus(message, type) {
        const deviceListDiv = document.getElementById('device-list');
        if (!deviceListDiv) return;

        deviceListDiv.style.display = 'block';

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };

        deviceListDiv.innerHTML = `
            <div style="
                padding: 12px;
                color: ${colors[type]};
                text-align: center;
                background: white;
                border-radius: 8px;
                border: 1px solid ${colors[type]}20;
            ">
                ${message}
            </div>
        `;
    }

    // 启动登录状态检查
    function startLoginStatusCheck() {
        checkLoginStatus();
        setInterval(checkLoginStatus, 30000);
    }

    // 初始化脚本
    function initScript() {
        console.log('[TJ-WIFI] 开始初始化脚本...');
        console.log('[TJ-WIFI] 当前URL:', window.location.href);

        if (window.top !== window.self) {
            console.log('[TJ-WIFI] 脚本在iframe中，停止初始化');
            return;
        }

        if (window.tjWifiInitialized) {
            console.log('[TJ-WIFI] 脚本已初始化，停止初始化');
            return;
        }

        // 使用 MutationObserver 监听页面变化，防止页面被重定向或修改
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // 检查是否有元素被移除
                if (mutation.removedNodes.length > 0) {
                    ensureUIExists();
                }
                // 检查是否有元素被添加
                if (mutation.addedNodes.length > 0) {
                    ensureUIExists();
                }
            });
        });

        // 监听整个文档的变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        window.tjWifiInitialized = true;
        console.log('[TJ-WIFI] 设置初始化标志');

        // 确保UI始终存在
        function ensureUIExists() {
            if (!isUIExists()) {
                console.log('[TJ-WIFI] UI不存在，重新创建');
                createUI();
                // 立即检查一次登录状态
                checkLoginStatus();
            }
        }

        try {
            // 立即创建UI并检查状态
            createUI();
            checkLoginStatus();

            // 定期检查UI是否存在和登录状态
            setInterval(() => {
                ensureUIExists();
                checkLoginStatus();
            }, 30000);

            // 添加页面卸载监听器
            window.addEventListener('beforeunload', () => {
                console.log('[TJ-WIFI] 页面即将卸载');
            });

            // 添加页面可见性变化监听器
            document.addEventListener('visibilitychange', () => {
                console.log('[TJ-WIFI] 页面可见性变化:', document.visibilityState);
                if (document.visibilityState === 'visible') {
                    ensureUIExists();
                    checkLoginStatus();
                }
            });

        } catch (error) {
            console.error('[TJ-WIFI] 初始化脚本时发生错误:', error);
        }
    }

    // 启动脚本
    console.log('[TJ-WIFI] 脚本开始执行');

    // 确保在页面加载的最早时机执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();