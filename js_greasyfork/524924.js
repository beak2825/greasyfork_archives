// ==UserScript==
// @name         【快速版】2025年暑期教师研修|付费版半分钟学完！！国家中小学智慧教育平台|教师假期研修-秒过
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  2025年智慧中小学平台自动学习助手|支持单账号快速处理|有网页版|秒过|快速
// @author       beyondddd
// @match        https://www.smartedu.cn/*
// @match        https://basic.smartedu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      yanxiu.pro
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524924/%E3%80%90%E5%BF%AB%E9%80%9F%E7%89%88%E3%80%912025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E4%BB%98%E8%B4%B9%E7%89%88%E5%8D%8A%E5%88%86%E9%92%9F%E5%AD%A6%E5%AE%8C%EF%BC%81%EF%BC%81%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E6%95%99%E5%B8%88%E5%81%87%E6%9C%9F%E7%A0%94%E4%BF%AE-%E7%A7%92%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/524924/%E3%80%90%E5%BF%AB%E9%80%9F%E7%89%88%E3%80%912025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E4%BB%98%E8%B4%B9%E7%89%88%E5%8D%8A%E5%88%86%E9%92%9F%E5%AD%A6%E5%AE%8C%EF%BC%81%EF%BC%81%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E6%95%99%E5%B8%88%E5%81%87%E6%9C%9F%E7%A0%94%E4%BF%AE-%E7%A7%92%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let isCollapsed = GM_getValue('isCollapsed', false);
    let announcement = '';
    let instructions = '';

    // 创建样式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --primary-color: #4c6ef5;
                --primary-gradient: linear-gradient(135deg, #4c6ef5 0%, #364fc7 100%);
                --secondary-color: #20c997;
                --secondary-gradient: linear-gradient(135deg, #20c997 0%, #12b886 100%);
                --accent-color: #f03e3e;
                --warning-color: #fd7e14;
                --success-color: #51cf66;
                --danger-color: #f03e3e;
                --info-color: #339af0;
            }

            #smartedu-assistant {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 380px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                z-index: 999999;
                border: 1px solid rgba(255, 255, 255, 0.3);
                font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                max-height: 90vh;
                overflow: hidden;
            }

            #smartedu-assistant.collapsed {
                width: 200px;
                height: 60px;
            }

            #smartedu-assistant.collapsed .assistant-content {
                display: none;
            }

            .assistant-header {
                background: var(--primary-gradient);
                color: white;
                padding: 15px 20px;
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                user-select: none;
            }

            .assistant-title {
                font-weight: 700;
                font-size: 16px;
                display: flex;
                align-items: center;
            }

            .assistant-title i {
                margin-right: 8px;
                font-size: 18px;
            }

            .collapse-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 14px;
            }

            .collapse-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .assistant-content {
                padding: 20px;
                max-height: calc(90vh - 90px);
                overflow-y: auto;
            }

            .announcement-section {
                background: linear-gradient(135deg, rgba(32, 201, 151, 0.1) 0%, rgba(18, 184, 134, 0.1) 100%);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 20px;
                border-left: 4px solid var(--secondary-color);
            }

            .announcement-title {
                color: var(--secondary-color);
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 14px;
                display: flex;
                align-items: center;
            }

            .announcement-title i {
                margin-right: 6px;
            }

            .announcement-content {
                color: #4a5568;
                font-size: 13px;
                line-height: 1.5;
            }

            .form-group {
                margin-bottom: 16px;
            }

            .form-label {
                font-weight: 600;
                margin-bottom: 8px;
                color: #2d3748;
                font-size: 14px;
                display: flex;
                align-items: center;
            }

            .form-label i {
                margin-right: 8px;
                color: var(--primary-color);
            }

            .form-control {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 13px;
                transition: all 0.3s ease;
                background: white;
                box-sizing: border-box;
            }

            .form-control:focus {
                border-color: var(--primary-color);
                outline: none;
                box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
            }

            .form-control::placeholder {
                color: #a0aec0;
            }

            .account-group {
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 16px;
                background: rgba(255, 255, 255, 0.7);
                transition: all 0.3s ease;
            }

            .account-group:hover {
                border-color: var(--primary-color);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(76, 110, 245, 0.1);
            }

            .account-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .account-label {
                font-weight: 600;
                color: #4a5568;
                font-size: 14px;
            }

            .account-status {
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
            }

            .account-status i {
                margin-right: 4px;
                font-size: 11px;
            }

            .status-default {
                background: #f8f9fa;
                color: #6c757d;
                border: 1px solid #dee2e6;
            }

            .status-processing {
                background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                color: #856404;
                border: 1px solid #ffeaa7;
                animation: pulse 2s infinite;
            }

            .status-success {
                background: linear-gradient(135deg, #d1f2eb 0%, #a3e9d0 100%);
                color: #155724;
                border: 1px solid #a3e9d0;
            }

            .status-error {
                background: linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%);
                color: #721c24;
                border: 1px solid #f1aeb5;
            }

            .status-warning {
                background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                color: #856404;
                border: 1px solid #ffeaa7;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .account-inputs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }

            .btn {
                padding: 12px 16px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: #2d3748;
                margin-bottom: 8px;
                text-shadow: none;
                min-height: 44px;
            }

            .btn i {
                margin-right: 8px;
                font-size: 14px;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            /* 参考提供的六按钮配色方案 */
            .btn-primary {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                color: #1f2937 !important;
            }

            .btn-primary:hover {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: #1f2937 !important;
            }

            .btn-success {
                background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                color: #1f2937 !important;
            }

            .btn-success:hover {
                background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                color: #1f2937 !important;
            }

            .btn-warning {
                background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
                color: #1f2937 !important;
            }

            .btn-warning:hover {
                background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
                color: #1f2937 !important;
            }

            .btn-danger {
                background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
                color: #1f2937 !important;
                border: 2px solid #fecaca;
            }

            .btn-danger:hover {
                background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                color: #1f2937 !important;
                border: 2px solid #fca5a5;
            }

            .btn-info {
                background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                color: #1f2937 !important;
            }

            .btn-info:hover {
                background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                color: #1f2937 !important;
            }

            .button-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 20px;
            }

            .button-grid-triple {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 8px;
                margin-bottom: 20px;
            }

            .toast {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background: var(--secondary-gradient);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 8px 25px rgba(32, 201, 151, 0.3);
                z-index: 1000000;
                transition: transform 0.3s ease;
                font-weight: 600;
                display: flex;
                align-items: center;
                font-size: 14px;
                max-width: 300px;
                text-align: center;
            }

            .toast.show {
                transform: translateX(-50%) translateY(0);
            }

            .toast.error {
                background: linear-gradient(135deg, #f03e3e 0%, #e03131 100%);
                box-shadow: 0 8px 25px rgba(240, 62, 62, 0.3);
            }

            .toast i {
                margin-right: 8px;
                font-size: 16px;
            }

            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                z-index: 1000001;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .modal.show {
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1;
            }

            .modal-content {
                background: white;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
                overflow: hidden;
            }

            .modal.show .modal-content {
                transform: scale(1);
            }

            .modal-header {
                background: var(--primary-gradient);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-title {
                font-size: 18px;
                font-weight: 700;
            }

            .close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .modal-body {
                padding: 20px;
                overflow-y: auto;
                max-height: calc(80vh - 100px);
            }

            /* 自定义滚动条 */
            .assistant-content::-webkit-scrollbar,
            .modal-body::-webkit-scrollbar {
                width: 6px;
            }

            .assistant-content::-webkit-scrollbar-track,
            .modal-body::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 3px;
            }

            .assistant-content::-webkit-scrollbar-thumb,
            .modal-body::-webkit-scrollbar-thumb {
                background: var(--primary-gradient);
                border-radius: 3px;
            }

            /* 响应式调整 */
            @media (max-width: 480px) {
                #smartedu-assistant {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }

                #smartedu-assistant.collapsed {
                    width: 200px;
                    left: auto;
                }

                .button-grid-triple {
                    grid-template-columns: 1fr 1fr;
                }
            }

            /* FontAwesome图标补充 */
            .fa {
                display: inline-block;
                font-style: normal;
                font-variant: normal;
                text-rendering: auto;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建主界面
    function createUI() {
        const container = document.createElement('div');
        container.id = 'smartedu-assistant';
        if (isCollapsed) {
            container.classList.add('collapsed');
        }

        container.innerHTML = `
            <div class="assistant-header">
                <div class="assistant-title">
                    <i class="fa">🎓</i> 学习助手
                </div>
                <button class="collapse-btn" id="collapseBtn" title="${isCollapsed ? '展开' : '收起'}">
                    <i class="fa">${isCollapsed ? '📖' : '📚'}</i>
                </button>
            </div>
            <div class="assistant-content">
                <div class="announcement-section">
                    <div class="announcement-title">
                        <i class="fa">📢</i> 系统公告
                    </div>
                    <div class="announcement-content" id="announcement">
                        正在加载公告...
                    </div>
                </div>

                <div class="button-grid">
                    <button class="btn btn-primary" id="startBtn">
                        <i class="fa">▶️</i> 一键开刷
                    </button>
                    <button class="btn btn-danger" id="clearBtn">
                        <i class="fa">🗑️</i> 清空全部
                    </button>
                </div>

                <div class="button-grid">
                    <button class="btn btn-warning" id="webVersionBtn">
                        <i class="fa">🌐</i> 使用网页版助手
                    </button>
                    <button class="btn btn-success" id="buyBtn">
                        <i class="fa">🛒</i> 购买授权码
                    </button>
                </div>

                <div class="button-grid">
                    <button class="btn btn-info" id="instructionsBtn">
                        <i class="fa">❓</i> 使用说明
                    </button>
                    <button class="btn btn-info" id="contactBtn">
                        <i class="fa">💬</i> 联系客服
                    </button>
                </div>

                <div class="form-group">
                    <div class="form-label">
                        <i class="fa">🔑</i> 授权码
                    </div>
                    <input type="text" class="form-control" id="authCode" placeholder="请输入授权码">
                </div>

                <div class="account-group">
                    <div class="account-header">
                        <div class="account-label">账号信息</div>
                        <div class="account-status status-default" id="accountStatus">
                            <i class="fa">⏱️</i> 待处理
                        </div>
                    </div>
                    <div class="account-inputs">
                        <input type="text" class="form-control" id="username" placeholder="用户名">
                        <input type="password" class="form-control" id="password" placeholder="密码">
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 绑定事件监听器
        bindEventListeners();
    }

    // 绑定事件监听器
    function bindEventListeners() {
        // 折叠/展开功能
        document.getElementById('collapseBtn').addEventListener('click', toggleCollapse);
        document.querySelector('.assistant-header').addEventListener('click', function(e) {
            if (e.target.closest('.collapse-btn')) return;
            toggleCollapse();
        });

        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', startProcessing);
        document.getElementById('clearBtn').addEventListener('click', clearAll);
        document.getElementById('webVersionBtn').addEventListener('click', openWebVersion);
        document.getElementById('buyBtn').addEventListener('click', buyAuthCode);
        document.getElementById('instructionsBtn').addEventListener('click', showInstructions);
        document.getElementById('contactBtn').addEventListener('click', contactService);
    }

    // 创建模态框
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'instructionsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">使用说明</div>
                    <button class="close-btn" id="closeModalBtn">
                        <i class="fa">✖️</i>
                    </button>
                </div>
                <div class="modal-body" id="modalBody">
                    正在加载使用说明...
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 绑定关闭事件
        document.getElementById('closeModalBtn').addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // 显示提示信息
    function showToast(message, type = 'success') {
        const existingToast = document.getElementById('smartedu-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'smartedu-toast';
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fa">${type === 'success' ? '✅' : '❌'}</i>${message}`;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // API请求函数
    function makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                data: options.data,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        resolve({ status: 'error', message: '响应解析失败' });
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }
    // 配置
    const API_BASE = 'http://yanxiu.pro:5000';
    // 获取公告
    async function fetchAnnouncement() {
        try {
            const data = await makeRequest(`${API_BASE}/api/announcement`);
            if (data.status === 'success') {
                document.getElementById('announcement').textContent = data.content;
                announcement = data.content;
            }
        } catch (error) {
            console.error('获取公告失败:', error);
            document.getElementById('announcement').textContent = '获取公告失败，请检查网络连接。';
        }
    }

    // 获取使用说明
    async function fetchInstructions() {
        try {
            const data = await makeRequest(`${API_BASE}/api/instructions`);
            if (data.status === 'success') {
                instructions = data.content;
            }
        } catch (error) {
            console.error('获取使用说明失败:', error);
            instructions = '<p>获取使用说明失败，请检查网络连接。</p>';
        }
    }

    // 功能函数
    function toggleCollapse() {
        const container = document.getElementById('smartedu-assistant');
        const btn = document.querySelector('.collapse-btn i');

        isCollapsed = !isCollapsed;
        GM_setValue('isCollapsed', isCollapsed);

        if (isCollapsed) {
            container.classList.add('collapsed');
            btn.textContent = '📖';
            document.getElementById('collapseBtn').title = '展开';
        } else {
            container.classList.remove('collapsed');
            btn.textContent = '📚';
            document.getElementById('collapseBtn').title = '收起';
        }
    }

    async function startProcessing() {
        const authCode = document.getElementById('authCode').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!authCode) {
            showToast('请输入授权码', 'error');
            return;
        }

        if (!username || !password) {
            showToast('请输入完整的账号密码', 'error');
            return;
        }

        // 更新状态为处理中
        const statusBox = document.getElementById('accountStatus');
        statusBox.className = 'account-status status-processing';
        statusBox.innerHTML = '<i class="fa">⚡</i> 处理中...';

        try {
            const formData = new URLSearchParams();
            formData.append('auth_code', authCode);
            formData.append('username1', username);
            formData.append('password1', password);

            const data = await makeRequest(`${API_BASE}/study`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: formData.toString()
            });

            if (data.status === 'success' && data.accounts && data.accounts.length > 0) {
                const account = data.accounts[0];
                if (account.status === 'success') {
                    statusBox.className = 'account-status status-success';
                    statusBox.innerHTML = '<i class="fa">✅</i> 成功';
                    statusBox.title = account.message;
                    showToast('学习完成！', 'success');
                } else if (account.status === 'warning') {
                    statusBox.className = 'account-status status-warning';
                    statusBox.innerHTML = '<i class="fa">⚠️</i> 已学习';
                    statusBox.title = account.message;
                    showToast('该账号已经学习过', 'success');
                } else {
                    statusBox.className = 'account-status status-error';
                    statusBox.innerHTML = '<i class="fa">❌</i> 失败';
                    statusBox.title = account.message;
                    showToast(account.message || '学习失败', 'error');
                }
            } else {
                statusBox.className = 'account-status status-error';
                statusBox.innerHTML = '<i class="fa">❌</i> 失败';
                showToast(data.message || '处理失败', 'error');
            }
        } catch (error) {
            console.error('提交请求失败:', error);
            statusBox.className = 'account-status status-error';
            statusBox.innerHTML = '<i class="fa">❌</i> 失败';
            showToast('网络错误，请重试', 'error');
        }
    }

    function clearAll() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        const statusBox = document.getElementById('accountStatus');
        statusBox.className = 'account-status status-default';
        statusBox.innerHTML = '<i class="fa">⏱️</i> 待处理';
        statusBox.title = '';

        showToast('已清空账号信息', 'success');
    }

    function openWebVersion() {
        window.open('http://yanxiu.pro/', '_blank');
        showToast('已打开网页版助手', 'success');
    }

    function buyAuthCode() {
        window.open('https://68n.cn/8l2jB', '_blank');
    }

    function showInstructions() {
        const modal = document.getElementById('instructionsModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = instructions;
        modal.classList.add('show');
    }

    function closeModal() {
        const modal = document.getElementById('instructionsModal');
        modal.classList.remove('show');
    }

    async function contactService() {
        const qqNumber = '1556818085';

        try {
            await navigator.clipboard.writeText(qqNumber);
            showToast('客服QQ号已复制到剪切板！', 'success');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = qqNumber;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                showToast('客服QQ号已复制到剪切板！', 'success');
            } catch (err) {
                showToast(`复制失败，客服QQ：${qqNumber}`, 'error');
            }

            document.body.removeChild(textArea);
        }
    }

    // 保存表单数据
    function saveFormData() {
        const formData = {
            authCode: document.getElementById('authCode').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        };

        GM_setValue('formData', JSON.stringify(formData));
    }

    // 恢复表单数据
    function restoreFormData() {
        const savedData = GM_getValue('formData', '{}');
        try {
            const formData = JSON.parse(savedData);

            if (formData.authCode) {
                document.getElementById('authCode').value = formData.authCode;
            }
            if (formData.username) {
                document.getElementById('username').value = formData.username;
            }
            if (formData.password) {
                document.getElementById('password').value = formData.password;
            }
        } catch (e) {
            console.log('恢复表单数据失败:', e);
        }
    }

    // 初始化
    function init() {
        createStyles();
        createUI();
        createModal();

        fetchAnnouncement();
        fetchInstructions();

        setTimeout(restoreFormData, 100);
        setInterval(saveFormData, 5000);

        console.log('智慧中小学学习助手已加载');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();