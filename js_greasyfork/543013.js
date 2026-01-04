// ==UserScript==
// @name         自动表单填充工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动生成并填充注册表单，支持记录和导出数据
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/543013/%E8%87%AA%E5%8A%A8%E8%A1%A8%E5%8D%95%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/543013/%E8%87%AA%E5%8A%A8%E8%A1%A8%E5%8D%95%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储生成的账户信息
    let accountRecords = GM_getValue('accountRecords', []);

    // 自动检测和点击的开关
    let autoDetectEnabled = GM_getValue('autoDetectEnabled', true);

    // 检测间隔（毫秒）
    const DETECT_INTERVAL = 1000;

    // 检测器ID
    let detectorId = null;

    // 当前填充的账户信息（临时存储）
    let currentAccountInfo = null;

    // 随机生成用户名（8-9位大小写字母组合）
    function generateUsername() {
        const length = Math.floor(Math.random() * 2) + 8; // 8-9位
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let username = '';
        for (let i = 0; i < length; i++) {
            username += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return username;
    }

    // 随机生成邮箱
    function generateEmail() {
        const length = Math.floor(Math.random() * 6) + 10; // 10-15位
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let email = '';
        for (let i = 0; i < length; i++) {
            email += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const domains = [
            '163.com',
            'gmail.com',
            'outlook.com',
            'protonmail.com',
            'tutanota.com',
            'zoho.com',
            'yandex.com',
            'mail.com',
            'gmx.com',
            'fastmail.com'
        ];

        const domain = domains[Math.floor(Math.random() * domains.length)];
        return email + '@' + domain;
    }

    // 随机生成密码（10-15位大小写字母+数字）
    function generatePassword() {
        const length = Math.floor(Math.random() * 6) + 10; // 10-15位
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        GM_setClipboard(text);
        showNotification('已复制到剪贴板');
    }

    // 自动检测和点击playnow元素
    function startAutoDetector() {
        // 清除旧的检测器
        if (detectorId) {
            clearInterval(detectorId);
            detectorId = null;
        }

        if (!autoDetectEnabled) return;

        let clickedPlaynow = false;

        detectorId = setInterval(() => {
            // 首先检测playnow元素
            const playnowElement = document.getElementById('playnow');
            if (playnowElement && !clickedPlaynow) {
                console.log('检测到playnow元素，尝试点击...');
                try {
                    playnowElement.click();
                    showNotification('已点击展开注册页面');
                    clickedPlaynow = true;
                    // 点击后，等待表单出现
                    checkForFormFields();
                } catch (e) {
                    console.error('点击playnow元素失败:', e);
                }
            } else if (!clickedPlaynow) {
                // 如果没找到playnow元素，继续检查表单字段
                // 这种情况适用于页面加载时就已经显示表单的情况
                checkForFormFields();
            }
        }, DETECT_INTERVAL);
    }

    // 检查表单字段
    function checkForFormFields() {
        // 检查是否有常见的注册表单字段
        if (hasRegistrationFields()) {
            console.log('检测到注册表单字段，自动填充...');
            fillForm();
            // 填充后停止检测，避免重复填充
            clearInterval(detectorId);
            detectorId = null;
        }
    }

    // 判断页面中是否有注册表单字段
    function hasRegistrationFields() {
        // 检测常见的注册表单字段
        return document.getElementById('username') ||
               document.getElementById('email') ||
               document.getElementById('password') ||
               document.getElementById('passwordCheck') ||
               // 查找其他可能的字段ID或名称
               document.querySelector('input[name="username"]') ||
               document.querySelector('input[name="email"]') ||
               document.querySelector('input[name="password"]') ||
               document.querySelector('input[type="email"]') ||
               document.querySelector('input[type="password"]');
    }

    // 监听提交按钮
    function setupSubmitButtonListener() {
        // 寻找可能的提交按钮
        const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"], .registerbutton, .btn-success');

        submitButtons.forEach(button => {
            // 避免重复添加事件监听
            button.removeEventListener('click', handleSubmitClick);
            button.addEventListener('click', handleSubmitClick);
            console.log('已监听提交按钮:', button);
        });
    }

    // 处理提交按钮点击事件
    function handleSubmitClick(event) {
        // 如果有当前填充的账户信息，就记录它
        if (currentAccountInfo) {
            console.log('提交按钮被点击，记录账户信息');

            // 添加到记录列表
            accountRecords.push(currentAccountInfo);
            GM_setValue('accountRecords', accountRecords);

            // 更新计数器
            const countElement = document.getElementById('records-count');
            if (countElement) {
                countElement.textContent = accountRecords.length;
            }

            // 如果账户列表是展开的，则更新显示
            const container = document.getElementById('accounts-container');
            if (container && container.style.display !== 'none') {
                updateAccountsList();
            }

            showNotification('账户信息已记录!');

            // 清除当前账户信息
            currentAccountInfo = null;
        }
    }

    // 创建控制面板UI
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'auto-fill-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-size: 14px;
            width: 300px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">自动填充工具</div>
            <button id="auto-fill-btn" style="width: 100%; margin-bottom: 5px; padding: 5px;">自动填充</button>
            <div style="display: flex; margin-bottom: 5px;">
                <label style="display: flex; align-items: center; cursor: pointer; width: 100%;">
                    <input type="checkbox" id="auto-detect-toggle" ${autoDetectEnabled ? 'checked' : ''} style="margin-right: 5px;">
                    自动检测并填充表单
                </label>
            </div>
            <button id="export-txt-btn" style="width: 100%; margin-bottom: 5px; padding: 5px;">导出记录为TXT</button>
            <button id="clear-records-btn" style="width: 100%; margin-bottom: 5px; padding: 5px;">清空记录</button>
            <div style="font-size: 12px; margin-top: 5px;">已记录: <span id="records-count">${accountRecords.length}</span>条</div>
            <div style="margin-top: 10px;">
                <div id="toggle-accounts" style="cursor: pointer; font-weight: bold; user-select: none;">
                    ▶ 查看账户记录 (点击展开)
                </div>
                <div id="accounts-container" style="display: none; margin-top: 5px; max-height: 300px; overflow-y: auto;">
                </div>
            </div>
            <div style="text-align: right; font-size: 12px; cursor: pointer;" id="hide-panel">隐藏</div>
        `;

        document.body.appendChild(panel);

        // 显示/隐藏面板的按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'toggle-panel-btn';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #00a5e9;
            color: white;
            border-radius: 3px;
            padding: 5px 10px;
            z-index: 9998;
            cursor: pointer;
            display: none;
        `;
        toggleBtn.textContent = '显示工具';
        document.body.appendChild(toggleBtn);

        // 绑定事件
        document.getElementById('auto-fill-btn').addEventListener('click', fillForm);
        document.getElementById('export-txt-btn').addEventListener('click', exportToTxt);
        document.getElementById('clear-records-btn').addEventListener('click', clearRecords);
        document.getElementById('hide-panel').addEventListener('click', function() {
            panel.style.display = 'none';
            toggleBtn.style.display = 'block';
        });

        toggleBtn.addEventListener('click', function() {
            panel.style.display = 'block';
            toggleBtn.style.display = 'none';
        });

        // 绑定展开/收起账户记录的事件
        document.getElementById('toggle-accounts').addEventListener('click', function() {
            const container = document.getElementById('accounts-container');
            if (container.style.display === 'none') {
                container.style.display = 'block';
                this.textContent = '▼ 查看账户记录 (点击收起)';
                updateAccountsList(); // 更新账户列表
            } else {
                container.style.display = 'none';
                this.textContent = '▶ 查看账户记录 (点击展开)';
            }
        });

        // 绑定自动检测开关事件
        document.getElementById('auto-detect-toggle').addEventListener('change', function() {
            autoDetectEnabled = this.checked;
            GM_setValue('autoDetectEnabled', autoDetectEnabled);

            if (autoDetectEnabled) {
                showNotification('已开启自动检测');
                startAutoDetector();
            } else {
                showNotification('已关闭自动检测');
                if (detectorId) {
                    clearInterval(detectorId);
                    detectorId = null;
                }
            }
        });
    }

    // 更新账户列表显示
    function updateAccountsList() {
        const container = document.getElementById('accounts-container');
        if (!container) return;

        container.innerHTML = '';

        if (accountRecords.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 10px;">暂无记录</div>';
            return;
        }

        // 倒序显示记录，最新的在最前面
        for (let i = accountRecords.length - 1; i >= 0; i--) {
            const record = accountRecords[i];
            const recordElem = document.createElement('div');
            recordElem.style.cssText = `
                border: 1px solid #eee;
                border-radius: 3px;
                padding: 8px;
                margin-bottom: 8px;
                background-color: #fff;
                font-size: 13px;
            `;

            recordElem.innerHTML = `
                <div style="color: #666; font-size: 12px;">${record.date}</div>
                <div style="margin: 5px 0;">
                    用户名: <span class="copyable" data-value="${record.username}" style="cursor: pointer; color: #0066cc;">${record.username}</span>
                </div>
                <div style="margin: 5px 0;">
                    邮箱: <span class="copyable" data-value="${record.email}" style="cursor: pointer; color: #0066cc;">${record.email}</span>
                </div>
                <div style="margin: 5px 0;">
                    密码: <span class="copyable" data-value="${record.password}" style="cursor: pointer; color: #0066cc;">${record.password}</span>
                </div>
            `;

            container.appendChild(recordElem);
        }

        // 给可复制元素添加点击事件
        const copyables = container.querySelectorAll('.copyable');
        copyables.forEach(el => {
            el.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                copyToClipboard(value);
            });
        });
    }

    // 填充表单
    function fillForm() {
        const username = generateUsername();
        const email = generateEmail();
        const password = generatePassword();

        // 填充表单
        const usernameFields = document.querySelectorAll('#username, input[name="username"], input[placeholder*="用户名"], input[placeholder*="username"]');
        const emailFields = document.querySelectorAll('#email, input[name="email"], input[type="email"], input[placeholder*="邮箱"], input[placeholder*="email"]');
        const passwordFields = document.querySelectorAll('#password, input[name="password"], input[type="password"], input[placeholder*="密码"], input[placeholder*="password"]');
        const confirmPasswordFields = document.querySelectorAll('#passwordCheck, #confirmPassword, input[name="confirmPassword"], input[placeholder*="确认密码"], input[placeholder*="confirm"]');

        // 尝试填充所有可能的字段
        usernameFields.forEach(field => field.value = username);
        emailFields.forEach(field => field.value = email);
        passwordFields.forEach(field => field.value = password);
        confirmPasswordFields.forEach(field => field.value = password);

        // 准备账户信息但不立即保存
        currentAccountInfo = {
            username: username,
            email: email,
            password: password,
            date: new Date().toLocaleString()
        };

        // 设置提交按钮监听
        setupSubmitButtonListener();

        // 显示提示
        showNotification('表单已填充，提交注册后将记录账户信息');
    }

    // 导出为TXT
    function exportToTxt() {
        if (accountRecords.length === 0) {
            showNotification('没有记录可导出');
            return;
        }

        let txtContent = '';
        accountRecords.forEach((record, index) => {
            txtContent += `记录 #${index + 1} [${record.date}]\n`;
            txtContent += `用户名: ${record.username}\n`;
            txtContent += `邮箱: ${record.email}\n`;
            txtContent += `密码: ${record.password}\n`;
            txtContent += '------------------------\n\n';
        });

        // 创建下载链接
        const blob = new Blob([txtContent], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `账户记录_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('导出成功!');
    }

    // 清空记录
    function clearRecords() {
        if (confirm('确定要清空所有记录吗?')) {
            accountRecords = [];
            GM_setValue('accountRecords', accountRecords);
            document.getElementById('records-count').textContent = '0';

            // 更新账户列表显示
            updateAccountsList();

            showNotification('记录已清空');
        }
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }

    // 注册油猴菜单命令
    GM_registerMenuCommand('自动填充表单', fillForm);
    GM_registerMenuCommand('导出记录为TXT', exportToTxt);
    GM_registerMenuCommand('清空记录', clearRecords);

    // 页面加载完成后创建UI并启动自动检测
    window.addEventListener('load', function() {
        // 创建UI
        createUI();

        // 启动自动检测
        if (autoDetectEnabled) {
            startAutoDetector();
        }
    });
})();