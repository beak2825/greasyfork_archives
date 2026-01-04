// ==UserScript==
// @name         椰椰智能注册助手
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  椰椰智能注册助手，支持多网站，集成临时邮箱系统
// @author       AI Assistant
// @match        http://*.veo*./*
// @match        http://*.try*./*
// @match        https://*.veo3.ai/*
// @match        https://*.veo3.bot/*
// @match        http://*.tryveo3.ai/*
// @match        https://*.topmediai*/*
// @match        https://*.topmediai.com/*
// @match        https://*.tryveo3.ai/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      159.75.188.43
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/545888/%E6%A4%B0%E6%A4%B0%E6%99%BA%E8%83%BD%E6%B3%A8%E5%86%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545888/%E6%A4%B0%E6%A4%B0%E6%99%BA%E8%83%BD%E6%B3%A8%E5%86%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    function init() {
        console.log('智能注册助手启动中...');

        // 自动加载的网站列表
        const autoLoadSites = ['veo3.ai', 'tryveo3.ai', 'veo3.bot', 'topmediai.com'];
        const currentHost = window.location.hostname;
        const shouldAutoLoad = autoLoadSites.some(site => currentHost.includes(site));

        // 如果不是自动加载的网站，显示启动按钮
        // if (!shouldAutoLoad) {
        //     createLaunchButton();
        //     return;
        // }

        // 现在所有网站都直接加载插件面板，不显示悬浮按钮

        // 配置
        const CONFIG = {
            TEMPMAIL_API: 'http://159.75.188.43/tempmail/api',
            ALLOWED_USER: '', // 将由用户输入
            CHECK_INTERVAL: 2000, // 检查邮件间隔（毫秒）
            MAX_WAIT_TIME: 60000, // 最大等待时间（毫秒）
        };

        // 自动填充模式
        let autoFillMode = true; // 默认开启自动模式
        let lastFilledFormId = null; // 记录上次填充的表单

        // 添加样式
        GM_addStyle(`
            #smart-register-panel {
                position: fixed;
                top: 60px;
                left: 20px;
                z-index: 999999;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 20px;
                width: 300px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
            }
            #smart-register-panel * {
                box-sizing: border-box;
            }
            #smart-register-panel h3 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 16px;
                font-weight: 600;
            }
            .register-info {
                margin: 8px 0;
                padding: 8px;
                background: #f5f5f5;
                border-radius: 5px;
                font-size: 13px;
            }
            .register-info label {
                font-weight: bold;
                color: #666;
                display: inline-block;
                width: 70px;
                font-size: 12px;
            }
            .register-info span {
                color: #333;
                word-break: break-all;
                font-size: 12px;
            }
            .register-info input {
                width: 100%;
                padding: 6px;
                margin-top: 4px;
                border: 1px solid #ddd;
                border-radius: 3px;
                font-size: 13px;
            }
            .register-button {
                width: 100%;
                padding: 10px;
                margin: 8px 0;
                border: none;
                border-radius: 5px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s;
            }
            .register-button:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .register-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            .btn-generate {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .btn-fill {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .btn-get-code {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
            }
            .status-message {
                padding: 8px;
                margin: 8px 0;
                border-radius: 5px;
                font-size: 12px;
                text-align: center;
            }
            .status-success {
                background: #d4edda;
                color: #155724;
            }
            .status-error {
                background: #f8d7da;
                color: #721c24;
            }
            .status-info {
                background: #d1ecf1;
                color: #0c5460;
            }
            .loading {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                vertical-align: middle;
                margin-left: 8px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .panel-close {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 20px;
                height: 20px;
                cursor: pointer;
                color: #999;
                font-size: 18px;
                line-height: 20px;
                text-align: center;
            }
            .panel-close:hover {
                color: #333;
            }
            .panel-minimize {
                position: absolute;
                top: 10px;
                right: 35px;
                width: 20px;
                height: 20px;
                cursor: pointer;
                color: #999;
                font-size: 18px;
                line-height: 20px;
                text-align: center;
            }
            .panel-minimize:hover {
                color: #333;
            }
            #smart-register-panel.minimized {
                height: auto;
                width: auto;
                padding: 10px 15px;
            }
            #smart-register-panel.minimized .panel-content {
                display: none;
            }
            #smart-register-panel.minimized h3 {
                margin: 0;
                font-size: 14px;
                cursor: pointer;
            }
            .panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            #smart-register-panel.minimized .panel-header {
                margin-bottom: 0;
            }
        `);

        // 工具函数
        function generateRandomString(length = 8, options = {}) {
            const { useNumbers = true, useUpperCase = true, useLowerCase = true, useSpecial = false } = options;
            let chars = '';
            if (useLowerCase) chars += 'abcdefghijklmnopqrstuvwxyz';
            if (useUpperCase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (useNumbers) chars += '0123456789';
            if (useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        function generatePassword() {
            // 只使用字母和数字
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let password = '';
            
            // 确保密码至少包含一个大写字母
            password += 'A';
            // 确保密码至少包含一个小写字母
            password += 'a';
            // 确保密码至少包含一个数字
            password += '1';
            
            // 继续生成剩余字符，直到达到8位
            while (password.length < 8) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            // 打乱密码字符顺序
            return password.split('').sort(() => Math.random() - 0.5).join('');
        }

        // API调用函数
        function callAPI(endpoint, method = 'GET', data = null) {
            return new Promise((resolve, reject) => {
                const userId = document.getElementById('user-id-input')?.value?.trim() || CONFIG.ALLOWED_USER;

                const requestConfig = {
                    method: method,
                    url: `${CONFIG.TEMPMAIL_API}${endpoint}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-ID': userId
                    },
                    onload: function(response) {
                        try {
                            console.log('API响应状态:', response.status);
                            console.log('API响应内容:', response.responseText);

                            // 检查响应状态
                            if (response.status !== 200 && response.status !== 201) {
                                throw new Error(`API返回错误状态: ${response.status}`);
                            }

                            const result = JSON.parse(response.responseText);
                            resolve(result);
                        } catch (e) {
                            console.error('API响应解析失败:', e);
                            console.error('原始响应:', response);
                            reject(new Error('API响应解析失败: ' + e.message));
                        }
                    },
                    onerror: function(error) {
                        console.error('API请求失败:', error);
                        reject(new Error('API请求失败'));
                    }
                };

                // 只有在有数据时才添加data字段，避免发送"null"字符串
                if (data) {
                    requestConfig.data = JSON.stringify(data);
                } else if (method === 'POST') {
                    // POST请求需要发送空对象而不是null
                    requestConfig.data = '{}';
                }

                GM_xmlhttpRequest(requestConfig);
            });
        }

        // 获取新邮箱
        async function getNewEmail() {
            try {
                // 获取用户ID作为userName
                const userId = document.getElementById('user-id-input')?.value?.trim();
                if (!userId) {
                    throw new Error('请先输入用户ID');
                }

                // 准备请求数据
                const requestData = {
                    prefix: '',  // 留空，让服务器自动生成
                    domain: '', // 留空，使用默认域名
                    clientPrefix: userId, // 使用用户ID作为客户端前缀
                    userName: userId // 使用用户ID作为用户名
                };

                console.log('发送邮箱生成请求:', requestData);

                const result = await callAPI('/email/generate', 'POST', requestData);

                // API返回的邮箱在data对象中
                if (result.success && result.data && result.data.email) {
                    console.log('邮箱生成成功:', result.data.email);
                    return result.data.email;
                }
                // 兼容旧格式
                else if (result.success && result.email) {
                    return result.email;
                }

                throw new Error(result.message || result.error || '获取邮箱失败');
            } catch (error) {
                console.error('获取邮箱失败:', error);
                throw error;
            }
        }

        // 获取邮件列表
        async function getEmails(email) {
            try {
                const result = await callAPI(`/emails/${email}`);

                // 兼容两种API返回格式
                let emails = [];
                if (result.success) {
                    emails = result.emails || result.data || [];
                }

                if (emails.length > 0) {
                    console.log(`[${new Date().toLocaleTimeString()}] 获取到 ${emails.length} 封邮件`);

                    // 打印每封邮件的基本信息
                    emails.forEach((mail, index) => {
                        console.log(`邮件${index + 1}: 主题="${mail.subject || '无主题'}", 发件人="${mail.from || '未知'}", 时间="${mail.timestamp || mail.createdAt || '未知'}"`);
                    });
                }

                return emails;
            } catch (error) {
                console.error('获取邮件失败:', error);
                return [];
            }
        }

        // 提取验证码 - 增强版
        function extractVerificationCode(emailContent) {
            console.log('开始提取验证码，内容长度:', emailContent.length);

            // 常见验证码模式（中英文）
            const patterns = [
                // 中文模式
                /验证码[：:：\s]*(\d{4,6})/,
                /您的验证码是[：:：\s]*(\d{4,6})/,
                /动态验证码[：:：\s]*(\d{4,6})/,
                /校验码[：:：\s]*(\d{4,6})/,

                // 英文模式
                /verification code[：:：\s]*(\d{4,6})/i,
                /your code is[：:：\s]*(\d{4,6})/i,
                /code[：:：\s]*(\d{4,6})/i,
                /OTP[：:：\s]*(\d{4,6})/i,
                /PIN[：:：\s]*(\d{4,6})/i,

                // 更宽松的模式
                /code\s*is\s*(\d{4,6})/i,
                /is[：:：\s]*(\d{4,6})/i,
                /为[：:：\s]*(\d{4,6})/,

                // 独立数字（作为最后手段）
                /\b(\d{6})\b/, // 独立的6位数字
                /\b(\d{4})\b/   // 独立的4位数字
            ];

            // 尝试每个模式
            for (const pattern of patterns) {
                const match = emailContent.match(pattern);
                if (match) {
                    console.log('匹配成功，使用模式:', pattern);
                    console.log('提取到的验证码:', match[1]);
                    return match[1];
                }
            }

            // 如果没找到，尝试查找所有4-6位数字
            const allNumbers = emailContent.match(/\d{4,6}/g);
            if (allNumbers && allNumbers.length > 0) {
                console.log('使用备用方案，找到的所有数字:', allNumbers);
                // 优先返回6位数字
                const sixDigits = allNumbers.filter(n => n.length === 6);
                if (sixDigits.length > 0) {
                    console.log('返回6位数字:', sixDigits[0]);
                    return sixDigits[0];
                }
                // 否则返回第一个数字
                console.log('返回第一个数字:', allNumbers[0]);
                return allNumbers[0];
            }

            console.log('未能提取验证码');
            return null;
        }

        // 等待验证码邮件
        async function waitForVerificationCode(email, maxWaitTime = CONFIG.MAX_WAIT_TIME) {
            const startTime = Date.now();
            let lastEmailCount = 0;

            while (Date.now() - startTime < maxWaitTime) {
                const emails = await getEmails(email);

                if (emails.length > lastEmailCount) {
                    // 有新邮件
                    const newEmails = emails.slice(lastEmailCount);
                    for (const emailItem of newEmails) {
                        // 跳过欢迎邮件
                        if (emailItem.subject && emailItem.subject.includes('欢迎使用临时邮箱')) {
                            console.log('跳过欢迎邮件');
                            continue;
                        }

                        // 打印邮件详情以便调试
                        console.log('=== 收到新邮件 ===');
                        console.log('主题:', emailItem.subject || '无主题');
                        console.log('发件人:', emailItem.from || '未知');

                        // 处理内容（可能是字符串或数组）
                        let content = emailItem.content || emailItem.textContent || '';
                        if (Array.isArray(content)) {
                            content = content.join(' ');
                        }

                        console.log('内容长度:', content.length);
                        console.log('完整内容:', content);
                        console.log('=================');

                        // 尝试从邮件主题和内容中提取验证码
                        const code = extractVerificationCode(content) ||
                                   extractVerificationCode(emailItem.subject || '');
                        if (code) {
                            console.log('成功提取验证码:', code);
                            return code;
                        } else {
                            console.log('未能从此邮件提取验证码');
                        }
                    }
                    lastEmailCount = emails.length;
                }

                await new Promise(resolve => setTimeout(resolve, CONFIG.CHECK_INTERVAL));
            }

            throw new Error('等待验证码超时');
        }

        // 查找表单元素 - 针对Veo3和TopMediAI优化
        function findFormElements() {
            // 查找所有可见的输入框
            const inputs = Array.from(document.querySelectorAll('input')).filter(input => {
                const rect = input.getBoundingClientRect();
                const style = window.getComputedStyle(input);
                // 增加可见性检查
                return rect.width > 0 && rect.height > 0 && 
                       style.display !== 'none' && 
                       style.visibility !== 'hidden' &&
                       style.opacity !== '0';
            });
            
            console.log(`找到 ${inputs.length} 个可见输入框`);
            
            const elements = {};
            
            // 根据placeholder和类型识别输入框
            inputs.forEach((input, index) => {
                const placeholder = (input.placeholder || '').toLowerCase();
                const type = input.type || 'text';
                const name = (input.name || '').toLowerCase();
                const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
                const className = (input.className || '').toLowerCase();
                const id = (input.id || '').toLowerCase();
                
                console.log(`输入框${index}:`, {
                    placeholder,
                    type,
                    name,
                    ariaLabel,
                    className,
                    id,
                    value: input.value
                });
                
                // TopMediAI特殊处理
                if (window.location.hostname.includes('topmediai')) {
                    // 邮箱输入框 - TopMediAI特有的邮箱输入框样式
                    if (placeholder.includes('输入注册邮箱') || 
                        placeholder.includes('输入注册的电子邮件地址') ||
                        ariaLabel.includes('邮箱') || 
                        ariaLabel.includes('电子邮件') ||
                        placeholder.includes('注册邮箱')) {
                        elements.email = input;
                        console.log('识别为TopMediAI邮箱输入框');
                    }
                    // 密码输入框 - TopMediAI特有的密码输入框样式
                    else if (type === 'password' || 
                             placeholder.includes('密码') || 
                             ariaLabel.includes('密码')) {
                        elements.password = input;
                        console.log('识别为TopMediAI密码输入框');
                    }
                    
                    // 如果找到了输入框，立即填充
                    if (elements.email) {
                        fillForm(elements.email, window.registerInfo.email);
                    }
                    if (elements.password) {
                        fillForm(elements.password, window.registerInfo.password);
                    }
                    
                    return;
                }
                
                // 通用识别逻辑
                // 邮箱输入框
                if (placeholder.includes('邮箱') || placeholder.includes('邮件') || 
                    placeholder.includes('邮件地址') || placeholder.includes('电子邮件') ||
                    placeholder.includes('email') || placeholder.includes('mail') ||
                    placeholder.includes('e-mail') || placeholder.includes('电邮') ||
                    type === 'email' || name.includes('email') || name.includes('mail')) {
                    elements.email = input;
                    console.log('识别为邮箱输入框');
                }
                // 验证码输入框
                else if (placeholder.includes('验证码') || placeholder.includes('验证') || 
                         placeholder.includes('code') || placeholder.includes('verification') ||
                         placeholder.includes('otp') || name.includes('code') || 
                         name.includes('captcha') || name.includes('otp') || 
                         name.includes('verification')) {
                    elements.verificationCode = input;
                    console.log('识别为验证码输入框');
                }
                // 用户名输入框
                else if (placeholder.includes('用户名') || placeholder.includes('用户ID') || 
                         placeholder.includes('用户') || placeholder.includes('username') ||
                         placeholder.includes('user') || placeholder.includes('account') ||
                         name.includes('username') || name.includes('user') || 
                         name.includes('account')) {
                    elements.userId = input;
                    console.log('识别为用户名输入框');
                }
                // 密码输入框
                else if (type === 'password') {
                    if (placeholder.includes('确认') || placeholder.includes('再次') || 
                        placeholder.includes('confirm') || placeholder.includes('retype') ||
                        placeholder.includes('again') || name.includes('confirm') || 
                        name.includes('password2') || name.includes('repassword')) {
                        elements.confirmPassword = input;
                        console.log('识别为确认密码输入框');
                    } else {
                        elements.password = input;
                        console.log('识别为密码输入框');
                    }
                }
            });
            
            // 如果没有找到输入框，尝试更宽松的选择器
            if (window.location.hostname.includes('topmediai') && (!elements.email || !elements.password)) {
                console.log('使用备用选择器查找输入框...');
                
                // 使用更通用的选择器
                const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
                allInputs.forEach(input => {
                    const type = input.type;
                    if ((type === 'text' || type === 'email') && !elements.email) {
                        elements.email = input;
                        console.log('使用备用方法找到邮箱输入框');
                    } else if (type === 'password' && !elements.password) {
                        elements.password = input;
                        console.log('使用备用方法找到密码输入框');
                    }
                });
            }
            
            console.log('识别结果:', Object.keys(elements));
            return elements;
        }

        // 填充表单 - 增强版
        function fillForm(element, value) {
            if (!element || !value) return false;
            
            try {
                console.log('开始填充表单:', {
                    element: element.outerHTML,
                    value: value
                });
                
                // 聚焦元素
                element.focus();
                element.click();
                
                // 清空原有内容
                element.value = '';
                
                // 对于React等框架的特殊处理
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(element, value);
                
                // 触发更多事件以确保更新
                const events = [
                    new Event('input', { bubbles: true }),
                    new Event('change', { bubbles: true }),
                    new KeyboardEvent('keydown', { bubbles: true }),
                    new KeyboardEvent('keypress', { bubbles: true }),
                    new KeyboardEvent('keyup', { bubbles: true }),
                    new Event('blur', { bubbles: true })
                ];
                
                events.forEach(event => {
                    element.dispatchEvent(event);
                });
                
                // 再次设置值，确保填充成功
                element.value = value;
                
                console.log(`成功填充 [${element.placeholder || element.name || element.type}]: ${value}`);
                return true;
            } catch (error) {
                console.error('填充失败:', error);
                return false;
            }
        }

        // 创建控制面板
        function createControlPanel() {
            // 检查是否已存在
            if (document.getElementById('smart-register-panel')) {
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'smart-register-panel';
            panel.innerHTML = `
                <span class="panel-close" title="关闭">×</span>
                <span class="panel-minimize" title="最小化">—</span>
                <div class="panel-header">
                    <h3>🤖 智能注册助手</h3>
                </div>
                <div class="panel-content">
                    <div id="status-message"></div>
                    <div class="register-info" style="background: #fff3cd; border: 1px solid #ffeaa7;">
                        <label>用户ID:</label>
                        <input type="text" id="user-id-input" placeholder="请输入有效用户ID" value="">
                    </div>
                    <div class="register-info">
                        <label>邮箱:</label>
                        <span id="email-display">未生成</span>
                    </div>
                    <div class="register-info">
                        <label>用户名:</label>
                        <span id="username-display">未生成</span>
                    </div>
                    <div class="register-info">
                        <label>密码:</label>
                        <span id="password-display">未生成</span>
                    </div>
                    <div class="register-info">
                        <label>验证码:</label>
                        <span id="code-display">未获取</span>
                    </div>
                                        <button class="register-button btn-generate" id="btn-generate">生成注册信息</button>
                    <button class="register-button btn-fill" id="btn-fill" style="display:none;">一键填充表单</button>
                    <div style="margin-top: 10px; padding: 10px; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 5px; border: 1px solid #4caf50;">
                        <label style="display: flex; align-items: center; font-size: 13px; cursor: pointer;">
                            <input type="checkbox" id="auto-mode" checked style="margin-right: 8px; width: 16px; height: 16px; cursor: pointer;">
                            <span style="color: #2e7d32; font-weight: 500;">🤖 自动模式（检测到注册框自动填充）</span>
                        </label>
                    </div>
               </div>
            `;
            document.body.appendChild(panel);

            // 关闭按钮
            panel.querySelector('.panel-close').addEventListener('click', () => {
                panel.remove();
            });

            // 最小化/展开功能
            let isMinimized = false;
            const minimizeBtn = panel.querySelector('.panel-minimize');
            const panelHeader = panel.querySelector('.panel-header h3');

            function toggleMinimize() {
                isMinimized = !isMinimized;
                if (isMinimized) {
                    panel.classList.add('minimized');
                    minimizeBtn.textContent = '+';
                    minimizeBtn.title = '展开';
                } else {
                    panel.classList.remove('minimized');
                    minimizeBtn.textContent = '—';
                    minimizeBtn.title = '最小化';
                }
            }

            minimizeBtn.addEventListener('click', toggleMinimize);

            // 点击标题也可以展开/收起
            panelHeader.addEventListener('click', (e) => {
                if (panel.classList.contains('minimized')) {
                    toggleMinimize();
                }
            });

            // 自动最小化函数
            function autoMinimize() {
                if (!isMinimized) {
                    toggleMinimize();
                }
            }

            // 注册信息对象（放在更外层作用域）
            window.registerInfo = {
                email: '',
                username: '',
                password: '',
                verificationCode: ''
            };

            // 状态显示
            function showStatus(message, type = 'info') {
                const statusDiv = document.getElementById('status-message');
                statusDiv.className = `status-message status-${type}`;
                statusDiv.innerHTML = message;
            }

            // 生成注册信息
            document.getElementById('btn-generate').addEventListener('click', async function() {
                // 检查用户ID
                const userId = document.getElementById('user-id-input').value.trim();
                if (!userId) {
                    showStatus('请先输入有效用户ID', 'error');
                    return;
                }

                this.disabled = true;
                showStatus('正在生成注册信息... <span class="loading"></span>', 'info');

                try {
                    // 生成邮箱
                    window.window.registerInfo.email = await getNewEmail();
                    document.getElementById('email-display').textContent = window.window.registerInfo.email;

                    // 生成用户名和密码
                    window.window.registerInfo.username = generateRandomString(8, { useSpecial: false });
                    window.window.registerInfo.password = generatePassword();

                    document.getElementById('username-display').textContent = window.window.registerInfo.username;
                    document.getElementById('password-display').textContent = window.window.registerInfo.password;

                    showStatus('注册信息生成成功！', 'success');
                    document.getElementById('btn-fill').style.display = 'block';

                    // 生成信息后，如果是自动模式，启动检测
                    if (autoFillMode) {
                        console.log('注册信息已生成，启动自动检测');
                        // 先停止之前的检测（如果有的话）
                        stopAutoDetection();
                        // 重新启动检测
                        startAutoDetection();

                        // 立即执行一次检测
                        setTimeout(() => {
                            console.log('立即执行一次表单检测...');
                            const allContainers = document.querySelectorAll('div, form, section, article');
                            console.log(`找到 ${allContainers.length} 个容器`);

                            // 手动触发一次检测
                            window.manualCheckForm = function() {
                                console.log('手动检测表单...');
                                for (const container of allContainers) {
                                    const inputs = container.querySelectorAll('input');
                                    if (inputs.length >= 2) {
                                        console.log('发现包含', inputs.length, '个输入框的容器');
                                        for (const input of inputs) {
                                            console.log('- 输入框:', input.type, input.placeholder);
                                        }
                                    }
                                }
                            };
                            console.log('可以在控制台运行 manualCheckForm() 手动检测表单');
                        }, 1000);
                    }
                } catch (error) {
                    showStatus('生成失败: ' + error.message, 'error');
                } finally {
                    this.disabled = false;
                }
            });

            // 自动监测发送验证码按钮
            function findSendCodeButton() {
                // 查找所有可能的按钮元素
                const buttons = Array.from(document.querySelectorAll('button, [role="button"], .btn, input[type="button"], a[href="#"], div[onclick], span[onclick]'));

                // 关键词匹配（支持更多语言）
                const keywords = ['发送', '获取', '发', 'send', 'get', 'request', 'receive'];
                const codeWords = ['验证码', '验证', '码', 'code', 'verification', 'verify', 'otp', 'captcha', '邮件', 'email', 'mail'];

                for (const btn of buttons) {
                    const text = (btn.textContent || btn.innerText || btn.value || '').toLowerCase();

                    // 检查是否包含关键词
                    const hasKeyword = keywords.some(keyword => text.includes(keyword.toLowerCase()));
                    const hasCodeWord = codeWords.some(word => text.includes(word.toLowerCase()));

                    if (hasKeyword && hasCodeWord) {
                        // 检查按钮是否可见且可点击
                        const rect = btn.getBoundingClientRect();
                        const isVisible = rect.width > 0 && rect.height > 0 &&
                                        window.getComputedStyle(btn).display !== 'none' &&
                                        window.getComputedStyle(btn).visibility !== 'hidden';

                        if (isVisible && !btn.disabled) {
                            console.log('找到发送验证码按钮:', text.trim());
                            return btn;
                        }
                    }
                }

                console.log('未找到发送验证码按钮');
                return null;
            }

            // 自动获取验证码流程
            async function autoGetVerificationCode(email) {
                try {
                    // 查找并点击发送验证码按钮
                    const sendBtn = findSendCodeButton();
                    if (sendBtn) {
                        console.log('自动点击发送验证码按钮');
                        sendBtn.click();

                        // 等待邮件发送
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }

                    // 开始监听邮件
                    showStatus('正在等待验证码邮件... <span class="loading"></span>', 'info');
                    const code = await waitForVerificationCode(email);

                    if (code) {
                        window.registerInfo.verificationCode = code;
                        document.getElementById('code-display').textContent = code;
                        showStatus('验证码获取成功！', 'success');
                        return code;
                    }
                } catch (error) {
                    console.error('自动获取验证码失败:', error);
                    throw error;
                }
            }

            // 将自动填充函数暴露到全局，方便调试
            window.triggerAutoFill = function() {
                console.log('手动触发自动填充...');
                autoFillRegistrationForm();
            };

            // 一键填充表单（按照网站流程）
            document.getElementById('btn-fill').addEventListener('click', async function() {
                if (!window.registerInfo.email || !window.registerInfo.password) {
                    showStatus('请先生成注册信息', 'error');
                    return;
                }

                this.disabled = true;

                // 直接调用自动填充函数
                console.log('点击一键填充，执行自动化流程...');
                autoFillRegistrationForm();

                // 延迟后恢复按钮
                setTimeout(() => {
                    this.disabled = false;
                }, 2000);

                return; // 暂时跳过原有逻辑

                try {
                    const elements = findFormElements();

                    // 步骤1: 先填充邮箱
                    showStatus('步骤1: 填充邮箱... <span class="loading"></span>', 'info');
                    if (elements.email && window.registerInfo.email) {
                        fillForm(elements.email, window.registerInfo.email);
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // 步骤2: 查找并点击获取验证码按钮
                        showStatus('步骤2: 点击获取验证码按钮... <span class="loading"></span>', 'info');
                        const sendBtn = findSendCodeButton();
                        if (sendBtn) {
                            console.log('找到发送验证码按钮，自动点击');
                            sendBtn.click();
                            await new Promise(resolve => setTimeout(resolve, 2000));

                            // 步骤3: 等待并获取验证码
                            showStatus('步骤3: 等待验证码邮件（可能需要5-30秒）... <span class="loading"></span>', 'info');
                            try {
                                const code = await waitForVerificationCode(window.registerInfo.email);
                                if (code) {
                                    window.registerInfo.verificationCode = code;
                                    document.getElementById('code-display').textContent = code;
                                    console.log('成功获取验证码:', code);

                                    // 步骤4: 填充所有表单字段
                                    showStatus('步骤4: 填充所有表单字段... <span class="loading"></span>', 'info');
                                    await fillAllFormFields(elements, registerInfo);

                                    showStatus('✅ 表单填充完成！请检查并提交', 'success');
                                    // 3秒后自动最小化
                                    setTimeout(() => {
                                        autoMinimize();
                                    }, 3000);
                                } else {
                                    throw new Error('未能获取到验证码');
                                }
                            } catch (error) {
                                showStatus('❌ 验证码获取失败，请手动操作: ' + error.message, 'error');
                                // 即使验证码失败，也填充其他字段
                                await fillAllFormFields(elements, registerInfo);
                            }
                        } else {
                            showStatus('❌ 未找到获取验证码按钮，请手动点击', 'error');
                            // 继续填充其他字段
                            await fillAllFormFields(elements, registerInfo);
                        }
                    } else {
                        showStatus('❌ 未找到邮箱输入框', 'error');
                    }
                } catch (error) {
                    showStatus('❌ 操作失败: ' + error.message, 'error');
                } finally {
                    this.disabled = false;
                }
            });

            // 监听自动模式开关
            document.getElementById('auto-mode').addEventListener('change', function() {
                autoFillMode = this.checked;
                if (autoFillMode) {
                    showStatus('自动模式已启用', 'info');
                    startAutoDetection();
                } else {
                    showStatus('自动模式已关闭', 'info');
                    stopAutoDetection();
                }
            });

            // 如果默认开启自动模式，立即启动检测
            if (autoFillMode) {
                console.log('🤖 自动模式已默认开启');
                startAutoDetection();

                // 添加DOM变化监听器，更灵敏地检测新表单
                const observer = new MutationObserver((mutations) => {
                    // 检查是否有新的输入框被添加
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === 1) { // Element node
                                    const inputs = node.querySelectorAll ? node.querySelectorAll('input') : [];
                                    if (inputs.length > 0 && window.registerInfo.email) {
                                        console.log('🔍 检测到新的输入框被添加到页面');
                                        // 检查是否是密码输入框
                                        const passwordInputs = node.querySelectorAll('input[type="password"]');
                                        if (passwordInputs.length > 0) {
                                            console.log('🎯 发现密码输入框，可能是注册表单！');
                                            setTimeout(() => {
                                                autoFillRegistrationForm();
                                            }, 500);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                // 开始观察整个文档的变化
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                console.log('📡 DOM变化监听器已启动');

                // 添加全局点击监听器
                document.addEventListener('click', function(e) {
                    if (!window.registerInfo.email) return;

                    // 检查点击的是否是可能触发注册表单的按钮
                    const target = e.target;
                    const text = (target.textContent || target.innerText || '').toLowerCase();

                    if (text.includes('注册') || text.includes('sign up') ||
                        text.includes('register') || text.includes('加入')) {
                        console.log('👆 点击了可能的注册按钮:', text);

                        // 延迟检查是否出现了注册表单
                        setTimeout(() => {
                            const passwordInputs = document.querySelectorAll('input[type="password"]:not(#smart-register-panel input)');
                            if (passwordInputs.length >= 2) {
                                console.log('🎯 检测到注册表单出现！');
                                autoFillRegistrationForm();
                            }
                        }, 1000);
                    }
                });

                console.log('👆 点击事件监听器已启动');
            }

            // 自动检测注册框
            let detectionInterval = null;

            function startAutoDetection() {
                if (detectionInterval) return;

                console.log('启动自动检测...');
                detectionInterval = setInterval(() => {
                    if (!autoFillMode) {
                        console.log('自动模式未开启');
                        return;
                    }
                    if (!window.registerInfo.email) {
                        return;
                    }

                    // 检测注册表单的特征
                    let foundRegistrationForm = false;

                    // 方法1: 检测确认密码输入框
                    const confirmPasswordInputs = document.querySelectorAll('input[type="password"]');
                    if (confirmPasswordInputs.length >= 2) {
                        console.log('🎯 检测到多个密码输入框（可能是确认密码）');
                        foundRegistrationForm = true;
                    }

                    // 方法2: 检测包含"欢迎加入"等注册相关文字的元素
                    const registrationKeywords = ['欢迎加入', '创建账户', '注册', '立即注册', '创建帐户', 'sign up', 'create account', 'register'];
                    const allTexts = document.body.innerText.toLowerCase();
                    for (const keyword of registrationKeywords) {
                        if (allTexts.includes(keyword.toLowerCase())) {
                            console.log(`🎯 检测到注册关键词: "${keyword}"`);
                            foundRegistrationForm = true;
                            break;
                        }
                    }

                    // 方法3: 检测包含邮箱、密码、确认密码的表单
                    const allInputs = document.querySelectorAll('input:not(#smart-register-panel input)');
                    let hasEmailInput = false;
                    let hasPasswordInput = false;
                    let hasConfirmPasswordInput = false;

                    for (const input of allInputs) {
                        if (input.offsetWidth === 0 || input.offsetHeight === 0) continue;

                        const type = input.type || 'text';
                        const placeholder = (input.placeholder || '').toLowerCase();
                        const name = (input.name || '').toLowerCase();

                        // 检测邮箱
                        if (type === 'email' || placeholder.includes('邮') || placeholder.includes('email') ||
                            placeholder.includes('mail') || name.includes('email')) {
                            hasEmailInput = true;
                        }

                        // 检测密码
                        if (type === 'password') {
                            if (placeholder.includes('确认') || placeholder.includes('再次') ||
                                placeholder.includes('confirm') || placeholder.includes('retype') ||
                                name.includes('confirm') || name.includes('password2')) {
                                hasConfirmPasswordInput = true;
                            } else {
                                hasPasswordInput = true;
                            }
                        }
                    }

                    if (hasEmailInput && hasPasswordInput && hasConfirmPasswordInput) {
                        console.log('🎯 检测到完整的注册表单（邮箱+密码+确认密码）');
                        foundRegistrationForm = true;
                    }

                    // 如果检测到注册表单，执行自动填充
                    if (foundRegistrationForm) {
                        const currentFormId = document.body.innerHTML.substring(0, 200);
                        if (currentFormId !== lastFilledFormId) {
                            console.log('📝 这是一个新的注册表单，开始自动填充...');
                            lastFilledFormId = currentFormId;

                            // 延迟执行，确保表单完全加载
                            setTimeout(() => {
                                autoFillRegistrationForm();
                            }, 1000);
                        }
                    }

                    // 每30秒输出一次状态，避免刷屏
                    if (!foundRegistrationForm && Date.now() % 30000 < 1000) {
                        console.log('⏳ 自动检测运行中...');
                    }
                }, 1000); // 每秒检测一次
            }

            function stopAutoDetection() {
                if (detectionInterval) {
                    clearInterval(detectionInterval);
                    detectionInterval = null;
                }
            }



            
            // 自动填充注册表单
            async function autoFillRegistrationForm() {
                console.log('🚀 开始自动化注册流程...');
                showStatus('自动填充中...', 'info');
                
                try {
                    if (window.location.hostname.includes('topmediai')) {
                        console.log('检测到TopMediAI网站，使用特殊处理流程');
                        
                        // 声明成功标志变量
                        let emailSuccess = false;
                        let passwordSuccess = false;
                        
                        // 1. 查找并填充邮箱输入框
                        // 在 autoFillRegistrationForm 函数中修改邮箱输入框查找逻辑
                        const emailPlaceholders = [
                            '輸入註冊的電子郵件帳號',  // 繁体
                            '輸入註冊的電子郵件帳戶',  // 简体
                            'Enter Email Address'    // 英文版
                        ];

                        // 构建选择器
                        const emailSelectors = emailPlaceholders
                            .map(placeholder => `input.el-input__inner[placeholder="${placeholder}"]`)
                            .join(', ');
                        // const emailInputs = document.querySelectorAll('input.el-input__inner[placeholder="輸入註冊的電子郵件帳號"]');
                        const emailInputs = document.querySelectorAll(emailSelectors);
                        console.log('找到邮箱输入框数量:', emailInputs.length);


                        
                        // 使用试探法找出真正可用的邮箱输入框
                        let emailInput = null;
                        for (const input of emailInputs) {
                            try {
                                // 保存原始值
                                const originalValue = input.value;
                                
                                // 尝试输入
                                input.focus();
                                await new Promise(resolve => setTimeout(resolve, 100));
                                
                                // 先清空值
                                input.value = '';
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 100));
                                
                                // 尝试输入一个值
                                input.value = 'test';
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 100));
                                
                                // 检查值是否被接受，以及输入框是否仍然可见和可交互
                                const rect = input.getBoundingClientRect();
                                if (input.value === 'test' && 
                                    rect.width > 0 && 
                                    rect.height > 0 && 
                                    !input.disabled && 
                                    !input.readOnly &&
                                    window.getComputedStyle(input).display !== 'none' &&
                                    window.getComputedStyle(input).visibility !== 'hidden') {
                                    
                                    console.log('找到可用的邮箱输入框:', input);
                                    emailInput = input;
                                    
                                    // 恢复原始值
                                    input.value = originalValue;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                    break;
                                }
                            } catch (e) {
                                console.log('尝试邮箱输入框失败:', e);
                            }
                        }
                        
                        if (!emailInput) {
                            console.log('未找到可用的邮箱输入框');
                            showStatus('未找到邮箱输入框', 'error');
                            return;
                        }

                        // 2. 查找并填充密码输入框
                        const passwordInputs = document.querySelectorAll('input.el-input__inner[placeholder="密碼"]:not([modelmodifiers])');
                        console.log('找到密码输入框数量:', passwordInputs.length);
                        
                        // 使用试探法找出真正可用的密码输入框
                        let passwordInput = null;
                        for (const input of passwordInputs) {
                            try {
                                const originalValue = input.value;
                                input.focus();
                                input.value = 'testpass';
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 100));
                                
                                if (input.value === 'testpass') {
                                    console.log('找到可用的密码输入框:', input);
                                    passwordInput = input;
                                    input.value = originalValue;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                    break;
                                }
                            } catch (e) {
                                console.log('尝试密码输入框失败:', e);
                            }
                        }
                        
                        if (!passwordInput) {
                            console.log('未找到可用的密码输入框');
                            showStatus('未找到密码输入框', 'error');
                            return;
                        }

                        // 3. 填充邮箱
                        console.log('开始填充邮箱:', window.registerInfo.email);
                        try {
                            // 先聚焦
                            emailInput.focus();
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            // 直接设置值
                            emailInput.value = window.registerInfo.email;
                            
                            // 触发所有可能的事件
                            const events = ['input', 'change', 'blur'];
                            events.forEach(eventType => {
                                emailInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                            });
                            
                            // 验证值是否设置成功
                            await new Promise(resolve => setTimeout(resolve, 100));
                            emailSuccess = emailInput.value === window.registerInfo.email;
                            console.log('邮箱填充结果:', emailSuccess, emailInput.value);
                        } catch (e) {
                            console.log('邮箱填充失败:', e);
                        }

                        if (!emailSuccess) {
                            console.log('邮箱填充失败');
                            showStatus('邮箱填充失败', 'error');
                            return;
                        }

                        // 4. 填充密码
                        console.log('开始填充密码:', window.registerInfo.password);
                        try {
                            // 先聚焦
                            passwordInput.focus();
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            // 直接设置值
                            passwordInput.value = window.registerInfo.password;
                            
                            // 触发所有可能的事件
                            const events = ['input', 'change', 'blur'];
                            events.forEach(eventType => {
                                passwordInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                            });
                            
                            // 验证值是否设置成功
                            await new Promise(resolve => setTimeout(resolve, 100));
                            passwordSuccess = passwordInput.value === window.registerInfo.password;
                            console.log('密码填充结果:', passwordSuccess, passwordInput.value);
                        } catch (e) {
                            console.log('密码填充失败:', e);
                        }

                        if (!passwordSuccess) {
                            console.log('密码填充失败');
                            showStatus('密码填充失败', 'error');
                            return;
                        }

                        // 5. 如果邮箱和密码都填充成功，点击创建账户按钮
                        if (emailSuccess && passwordSuccess) {
                            console.log('邮箱和密码填充成功，准备点击创建账户按钮');
                            
                            // 查找创建账户按钮 - 使用精确的选择器
                            const submitButton = Array.from(document.querySelectorAll('button.el-button.el-button--primary.login-btn'))
                                .find(btn => btn.textContent.includes('創建帳戶') || btn.textContent.includes('建立帳戶')) || 
                                document.querySelector('button.el-button.el-button--primary.login-btn');
                                                   
                            if (submitButton && submitButton.offsetWidth > 0 && !submitButton.disabled) {
                                console.log('找到创建账户按钮，准备点击');
                                submitButton.click();
                                console.log('已点击创建账户按钮');
                                showStatus('已发送创建账户请求，等待验证码...', 'info');

                                // 等待验证码邮件
                                let retries = 0;
                                const maxRetries = 30; // 最多等待30秒
                                const checkVerificationCode = setInterval(async () => {
                                    try {
                                        // 使用 GM_xmlhttpRequest 获取验证码
                                        const response = await new Promise((resolve, reject) => {
                                            GM_xmlhttpRequest({
                                                method: 'GET',
                                                url: `http://159.75.188.43/tempmail/api/emails/${window.registerInfo.email}`,
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-User-ID': document.getElementById('user-id-input')?.value?.trim() || CONFIG.ALLOWED_USER
                                                },
                                                onload: function(response) {
                                                    resolve(response);
                                                },
                                                onerror: function(error) {
                                                    console.error('获取验证码失败:', error);
                                                    reject(new Error('获取验证码失败，请检查网络连接'));
                                                }
                                            });
                                        });

                                        const data = JSON.parse(response.responseText);
                                        console.log('收到邮件数据:', data);
                                        
                                        if (data && data.success && data.data && Array.isArray(data.data)) {
                                            // 找到最新的邮件
                                            const emails = data.data;
                                            for (const email of emails) {
                                                // 检查是否是验证码邮件
                                                if (email.subject && email.subject.includes('Verification')) {
                                                    console.log('找到验证码邮件:', email);
                                                    
                                                    // 从verificationCodes中提取验证码
                                                    const verificationCode = email.verificationCodes && 
                                                                          Array.isArray(email.verificationCodes) && 
                                                                          email.verificationCodes.length > 0 ? 
                                                                          email.verificationCodes[0].code : null;
                                                    
                                                    if (verificationCode) {
                                                        clearInterval(checkVerificationCode);
                                                        console.log('获取到验证码:', verificationCode);
                                                        
                                                        // 找到验证码输入框的父容器
                                                        let codeContainer = document.evaluate('/html/body/div[4]/div/div[2]/div/div/div/div/div/div[2]/div[2]/div[1]/div/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                                        
                                                        // 如果XPath方式找不到，尝试使用class选择器
                                                        if (!codeContainer) {
                                                            codeContainer = document.querySelector('.verification-inputs');
                                                        }
                                                        console.log('验证码输入框容器:', codeContainer);

                                                        if (codeContainer) {
                                                            console.log('找到验证码输入框容器');
                                                            
                                                            // 获取所有输入框
                                                            const inputs = codeContainer.querySelectorAll('input');
                                                            if (inputs.length === 6) {
                                                                console.log('找到6个验证码输入框，开始填充');
                                                                
                                                                // 逐个填充验证码
                                                                for (let i = 0; i < verificationCode.length; i++) {
                                                                    const input = inputs[i];
                                                                    // 确保输入框可交互
                                                                    input.focus();
                                                                    // 设置值
                                                                    input.value = verificationCode[i];
                                                                    // 触发必要的事件
                                                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                                                    // 等待一小段时间再填充下一个
                                                                    await new Promise(resolve => setTimeout(resolve, 100));
                                                                }
                                                                
                                                                // 等待所有输入框填充完成
                                                                await new Promise(resolve => setTimeout(resolve, 500));
                                                                
                                                                // 查找并点击继续按钮
                                                                const nextButton = document.evaluate('/html/body/div[4]/div/div[2]/div/div/div/div/div/div[2]/div[2]/div[1]/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ||
                                                                // 增加备用查找方式
                                                                Array.from(document.querySelectorAll('button.el-button.el-button--primary.login-btn'))
                                                                    .find(btn => {
                                                                        const text = (btn.textContent || '').trim();
                                                                        return text === '继续' || text === '繼續' || text === '下一步';
                                                                    });
                                                                console.log('继续按钮:', nextButton);

                                                                if (nextButton) {
                                                                    console.log('找到继续按钮，准备点击');
                                                                    nextButton.click();
                                                                    showStatus('验证码填充完成', 'success');
                                                                } else {
                                                                    console.log('未找到继续按钮');
                                                                    showStatus('未找到继续按钮', 'error');
                                                                }
                                                            } else {
                                                                console.log('未找到正确数量的验证码输入框');
                                                                showStatus('未找到验证码输入框', 'error');
                                                            }
                                                        } else {
                                                            console.log('未找到验证码输入框容器');
                                                            showStatus('未找到验证码输入框', 'error');
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        
                                        retries++;
                                        if (retries >= maxRetries) {
                                            clearInterval(checkVerificationCode);
                                            console.log('等待验证码超时');
                                            showStatus('未收到验证码邮件', 'error');
                                        }
                                    } catch (e) {
                                        console.log('获取验证码失败:', e);
                                        clearInterval(checkVerificationCode);
                                        showStatus('获取验证码失败', 'error');
                                    }
                                }, 1000);
                            } else {
                                console.log('创建账户按钮不可点击或未找到');
                                showStatus('创建账户按钮不可点击', 'error');
                            }
                        }

                        return;
                    }
                    
                    // 其他网站的通用处理逻辑保持不变
                    if (!elements.email) {
                        console.log('❌ 未找到邮箱输入框');
                        return;
                    }

                    // 步骤1: 填充基本信息
                    console.log('📝 步骤1: 填充基本信息');
                    if (elements.email && window.registerInfo.email) {
                        fillForm(elements.email, window.registerInfo.email);
                        console.log('✅ 已填充邮箱');
                    }
                    if (elements.userId && window.registerInfo.username) {
                        fillForm(elements.userId, window.registerInfo.username);
                        console.log('✅ 已填充用户名');
                    }
                    if (elements.password && window.registerInfo.password) {
                        fillForm(elements.password, window.registerInfo.password);
                        console.log('✅ 已填充密码');
                    }
                    if (elements.confirmPassword && window.registerInfo.password) {
                        fillForm(elements.confirmPassword, window.registerInfo.password);
                        console.log('✅ 已填充确认密码');
                    }

                    // 给表单一点时间响应
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // 步骤2: 自动点击获取验证码
                    console.log('🔍 步骤2: 查找并点击获取验证码按钮');
                    const sendBtn = findSendCodeButton();
                    if (sendBtn) {
                        console.log('✅ 找到获取验证码按钮，自动点击');
                        sendBtn.click();

                        showStatus('请完成人机验证（如有）', 'info');

                        // 步骤3: 启动表单完整性检测
                        console.log('⏰ 步骤3: 启动表单完整性检测，等待验证码填充...');
                        formCompletionChecker = setInterval(() => {
                            const currentElements = findFormElements();
                            if (currentElements.verificationCode && currentElements.verificationCode.value) {
                                console.log('✅ 检测到验证码已填充！');
                                clearInterval(formCompletionChecker);

                                // 延迟一下再点击提交，确保表单状态更新
                                setTimeout(() => {
                                    console.log('🎯 查找注册按钮...');
                                    const submitBtn = findSubmitButton();
                                    if (submitBtn) {
                                        console.log('✅ 找到注册按钮，自动点击！');
                                        showStatus('正在自动提交注册...', 'info');
                                        submitBtn.click();
                                        setTimeout(() => {
                                            showStatus('✅ 已自动提交注册！', 'success');
                                        }, 1000);
                                    } else {
                                        console.log('❌ 未找到注册按钮');
                                        showStatus('未找到注册按钮，请手动提交', 'info');
                                    }
                                }, 1000); // 给一秒时间确保表单状态更新
                            }
                        }, 1000); // 每秒检查一次

                        // 步骤4: 等待验证码
                        setTimeout(async () => {
                            try {
                                const code = await waitForVerificationCode(window.registerInfo.email);
                                if (code) {
                                    window.registerInfo.verificationCode = code;
                                    document.getElementById('code-display').textContent = code;

                                    // 填充验证码
                                    const currentElements = findFormElements();
                                    if (currentElements.verificationCode) {
                                        fillForm(currentElements.verificationCode, code);
                                        // formCompletionChecker 会自动处理提交
                                    }
                                } else {
                                    showStatus('未收到验证码，请检查邮箱', 'error');
                                }
                            } catch (error) {
                                showStatus('获取验证码失败：' + error.message, 'error');
                            } finally {
                                // 30秒后清理检测器
                                setTimeout(() => {
                                    if (formCompletionChecker) {
                                        clearInterval(formCompletionChecker);
                                    }
                                }, 30000);
                            }
                        }, 3000); // 给人机验证3秒时间

                    } else {
                        showStatus('未找到获取验证码按钮', 'error');
                    }
                } catch (error) {
                    console.error('自动填充失败:', error);
                    showStatus('自动填充失败: ' + error.message, 'error');
                }
            }

            // 查找提交/注册按钮 - 增加TopMediAI支持
            function findSubmitButton() {
                const buttons = Array.from(document.querySelectorAll('button, [type="submit"], [role="button"], .btn, input[type="button"], a[href="#"], div[onclick], span[onclick]'));
                const submitKeywords = ['注册', '提交', '确认', '完成', '创建账户', '创建帐户', 'register', 'submit', 'sign up', 'create', 'join', 'signup', 'Sign Up'];
                
                // TopMediAI特殊处理
                if (window.location.hostname.includes('topmediai')) {
                    for (const btn of buttons) {
                        const text = (btn.textContent || btn.innerText || btn.value || '').trim();
                        if (text === '创建账户' || text.includes('创建帐户')) {
                            console.log('找到TopMediAI创建账户按钮:', text);
                            return btn;
                        }
                    }
                }
                
                // 通用按钮查找逻辑
                for (const btn of buttons) {
                    const text = (btn.textContent || btn.innerText || btn.value || '').trim();
                    const textLower = text.toLowerCase();
                    const rect = btn.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0 && 
                                    window.getComputedStyle(btn).display !== 'none' &&
                                    window.getComputedStyle(btn).visibility !== 'hidden';
                    
                    if (isVisible && !btn.disabled) {
                        // 优先精确匹配中文"注册"
                        if (text === '注册' || text === '立即注册' || text === '确认注册') {
                            console.log('找到精确匹配的注册按钮:', text);
                            return btn;
                        }
                        
                        // 其次匹配包含关键词的按钮
                        for (const keyword of submitKeywords) {
                            if (textLower.includes(keyword.toLowerCase())) {
                                // 排除获取验证码等按钮
                                if (!textLower.includes('验证码') && !textLower.includes('code') && 
                                    !textLower.includes('获取') && !textLower.includes('发送') &&
                                    !textLower.includes('get') && !textLower.includes('send')) {
                                    console.log('找到包含关键词的注册按钮:', text);
                                    return btn;
                                }
                            }
                        }
                    }
                }
                
                console.log('未找到注册按钮');
                return null;
            }

            // 填充所有表单字段的辅助函数
            async function fillAllFormFields(elements, info) {
                let filledCount = 0;

                // 填充用户名
                if (elements.userId && info.username) {
                    fillForm(elements.userId, info.username);
                    filledCount++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                }

                // 填充验证码（如果有）
                if (elements.verificationCode && info.verificationCode) {
                    fillForm(elements.verificationCode, info.verificationCode);
                    filledCount++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                }

                // 填充密码
                if (elements.password && info.password) {
                    fillForm(elements.password, info.password);
                    filledCount++;
                    await new Promise(resolve => setTimeout(resolve, 300));
                }

                // 填充确认密码
                if (elements.confirmPassword && info.password) {
                    fillForm(elements.confirmPassword, info.password);
                    filledCount++;
                }

                console.log(`填充了 ${filledCount} 个字段`);
                return filledCount;
            }
        }

        // 延迟创建面板，确保页面加载完成
        setTimeout(() => {
            createControlPanel();
            console.log('智能注册助手已加载');
        }, 2000);
    }

    // 创建启动按钮（用于非自动加载网站）
    function createLaunchButton() {
        // 添加样式
        GM_addStyle(`
            .smart-register-launch-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                cursor: pointer;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                color: white;
                transition: all 0.3s ease;
            }
            .smart-register-launch-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
            }
        `);

        const btn = document.createElement('div');
        btn.className = 'smart-register-launch-btn';
        btn.innerHTML = '🤖';
        btn.title = '启动智能注册助手';

        btn.addEventListener('click', function() {
            btn.remove();
            init(); // 调用初始化函数
        });

        document.body.appendChild(btn);
    }

})();