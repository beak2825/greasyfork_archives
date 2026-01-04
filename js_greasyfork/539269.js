// ==UserScript==
// @name         AugmentCode自动注册客户端
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成AugmentCode的注册流程 (Cloudflare Worker 版本)
// @author       Your name
// @match        https://*.augmentcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=augmentcode.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539269/AugmentCode%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%E5%AE%A2%E6%88%B7%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/539269/AugmentCode%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%E5%AE%A2%E6%88%B7%E7%AB%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置 - 替换为你的 Cloudflare Worker 地址
    const API_BASE_URL = 'https://tempmail.wgets.org';
    
    // 当前使用的邮箱
    let currentEmail = '';
    
    // 获取卡密
    function getLicenseKey() {
        return GM_getValue('license_key', '');
    }
    
    // 设置卡密
    function setLicenseKey(key) {
        GM_setValue('license_key', key);
    }
    
    // 获取保存的邮箱
    function getSavedEmail() {
        return GM_getValue('current_email', '');
    }
    
    // 保存邮箱
    function saveEmail(email) {
        GM_setValue('current_email', email);
        currentEmail = email;
    }

    // 创建日志UI
    function createLogUI() {
        const logContainer = document.createElement('div');
        logContainer.innerHTML = `
            <div id="auto-register-log" style="
                position: fixed;
                bottom: 40px;
                right: 20px;
                width: 300px;
                max-height: 400px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div style="
                    padding: 12px;
                    background: #1a73e8;
                    color: white;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>自动注册日志</span>
                    <div>
                        <button id="auto-register-btn" style="
                            background: #34a853;
                            border: none;
                            color: white;
                            cursor: pointer;
                            font-size: 12px;
                            padding: 4px 8px;
                            border-radius: 4px;
                            margin-right: 8px;
                            display: none;
                        ">开始注册</button>
                        <button id="clear-log" style="
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                            font-size: 12px;
                            padding: 4px 8px;
                            border-radius: 4px;
                        ">清除</button>
                        <button id="minimize-log" style="
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                            font-size: 14px;
                            padding: 4px 8px;
                            margin-left: 8px;
                        ">_</button>
                    </div>
                </div>
                <div style="
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #e8eaed;
                    font-size: 12px;
                    color: #5f6368;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    <span style="color: #1a73e8;">📢</span>
                    <span>关注Blibili「不要秃头的coder」获取更多技术资源</span>
                </div>
                <div id="license-input" style="
                    padding: 12px;
                    border-bottom: 1px solid #e8eaed;
                    display: flex;
                    gap: 8px;
                    align-items: center;
                ">
                    <input type="text" id="license-key" placeholder="请输入卡密" style="
                        flex: 1;
                        padding: 6px 8px;
                        border: 1px solid #dadce0;
                        border-radius: 4px;
                        font-size: 13px;
                    " value="${getLicenseKey()}">
                    <button id="save-license" style="
                        background: #1a73e8;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 12px;
                        padding: 6px 12px;
                        border-radius: 4px;
                    ">保存</button>
                </div>
                <div id="email-display" style="
                    padding: 8px 12px;
                    border-bottom: 1px solid #e8eaed;
                    font-size: 12px;
                    color: #5f6368;
                    display: ${getSavedEmail() ? 'block' : 'none'};
                ">
                    <div>当前邮箱: <span id="current-email-value" style="color: #1a73e8; font-weight: bold;">${getSavedEmail()}</span></div>
                </div>
                <div id="log-content" style="
                    padding: 12px;
                    overflow-y: auto;
                    max-height: 300px;
                    font-size: 13px;
                "></div>
            </div>
        `;

        document.body.appendChild(logContainer);

        // 最小化功能
        let isMinimized = false;
        const logContent = document.getElementById('log-content');
        const minimizeBtn = document.getElementById('minimize-log');

        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            logContent.style.display = isMinimized ? 'none' : 'block';
            document.getElementById('license-input').style.display = isMinimized ? 'none' : 'flex';
            document.getElementById('email-display').style.display = isMinimized ? 'none' : (getSavedEmail() ? 'block' : 'none');
            minimizeBtn.textContent = isMinimized ? '□' : '_';
        });

        // 清除日志功能
        const clearBtn = document.getElementById('clear-log');
        clearBtn.addEventListener('click', () => {
            logContent.innerHTML = '';
        });
        
        // 保存卡密功能
        const saveBtn = document.getElementById('save-license');
        saveBtn.addEventListener('click', async () => {
            const licenseKey = document.getElementById('license-key').value.trim();
            if (licenseKey) {
                setLicenseKey(licenseKey);
                logger.log('卡密已保存', 'success');
                
                // 验证卡密并获取邮箱
                try {
                    const result = await getEmailWithLicense();
                    if (result.success) {
                        logger.log(`卡密验证成功: ${result.message}`, 'success');
                        saveEmail(result.email);
                        updateEmailDisplay();
                        logger.log(`获取到邮箱: ${result.email}`, 'info');
                    } else {
                        logger.log(`卡密验证失败: ${result.message}`, 'error');
                    }
                } catch (error) {
                    logger.log(`卡密验证出错: ${error.message}`, 'error');
                }
            } else {
                logger.log('请输入有效的卡密', 'warning');
            }
        });

        return {
            log: function(message, type = 'info') {
                const logEntry = document.createElement('div');
                logEntry.style.marginBottom = '8px';
                logEntry.style.padding = '8px';
                logEntry.style.borderRadius = '4px';
                logEntry.style.wordBreak = 'break-word';

                switch(type) {
                    case 'success':
                        logEntry.style.background = '#e6f4ea';
                        logEntry.style.color = '#1e8e3e';
                        break;
                    case 'error':
                        logEntry.style.background = '#fce8e6';
                        logEntry.style.color = '#d93025';
                        break;
                    case 'warning':
                        logEntry.style.background = '#fef7e0';
                        logEntry.style.color = '#ea8600';
                        break;
                    default:
                        logEntry.style.background = '#f8f9fa';
                        logEntry.style.color = '#202124';
                }

                const time = new Date().toLocaleTimeString();
                logEntry.textContent = `[${time}] ${message}`;
                logContent.appendChild(logEntry);
                logContent.scrollTop = logContent.scrollHeight;
                
                // 同时在控制台记录，方便调试
                console.log(`[${type}] ${message}`);
            },
            showRegisterButton: function() {
                const registerBtn = document.getElementById('auto-register-btn');
                if (registerBtn) {
                    logger.log('找到注册按钮，正在显示...');
                    registerBtn.style.display = 'inline-block';
                    return registerBtn;
                } else {
                    logger.log('未找到注册按钮元素', 'error');
                    return null;
                }
            }
        };
    }
    
    // 更新邮箱显示
    function updateEmailDisplay() {
        const emailDisplay = document.getElementById('email-display');
        const emailValue = document.getElementById('current-email-value');
        
        if (emailDisplay && emailValue) {
            const savedEmail = getSavedEmail();
            emailValue.textContent = savedEmail;
            emailDisplay.style.display = savedEmail ? 'block' : 'none';
        }
    }

    // 创建全局日志对象
    const logger = createLogUI();

    // API 调用函数
    async function callAPI(endpoint) {
        try {
            const licenseKey = getLicenseKey();
            if (!licenseKey) {
                throw new Error("请先设置卡密");
            }
            
            // 添加卡密到请求
            const separator = endpoint.includes('?') ? '&' : '?';
            const url = `${API_BASE_URL}${endpoint}${separator}key=${encodeURIComponent(licenseKey)}`;
            
            logger.log(`正在调用 API: ${endpoint}`, 'info');
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${licenseKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                logger.log(`API 请求失败: ${response.status} - ${errorText}`, 'error');
                throw new Error(`API 请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            logger.log(`API 调用出错: ${error.message}`, 'error');
            throw error;
        }
    }
    
    // 获取邮箱（每次都尝试获取最新邮箱）
    async function getEmailWithLicense() {
        try {
            const licenseKey = getLicenseKey();
            if (!licenseKey) {
                return { success: false, message: "未设置卡密" };
            }
            
            logger.log(`正在获取邮箱...`, 'info');
            const result = await callAPI('/api/get-email');
            
            if (result.success) {
                if (result.isNewEmail) {
                    logger.log(`成功获取新邮箱: ${result.email}`, 'success');
                } else {
                    logger.log(`使用已有邮箱: ${result.email}`, 'info');
                }
                
                if (result.message) {
                    logger.log(result.message, 'info');
                }
                
                return result;
            } else {
                logger.log(`获取邮箱失败: ${result.message}`, 'error');
                return result;
            }
        } catch (error) {
            logger.log(`获取邮箱出错: ${error.message}`, 'error');
            return { success: false, message: error.message };
        }
    }

    // 获取验证码
    async function getVerificationCode() {
        try {
            // 验证卡密是否存在
            const licenseKey = getLicenseKey();
            if (!licenseKey) {
                logger.log('缺少卡密，无法获取验证码', 'error');
                throw new Error("请先设置卡密");
            }
            
            // 获取当前邮箱或获取新邮箱
            let email = getSavedEmail();
            if (!email) {
                logger.log('没有找到保存的邮箱，尝试获取新邮箱...', 'warning');
                const emailResult = await getEmailWithLicense();
                if (!emailResult.success || !emailResult.email) {
                    throw new Error("无法获取邮箱");
                }
                email = emailResult.email;
                saveEmail(email);
                updateEmailDisplay();
            }
            
            logger.log(`使用邮箱 ${email} 获取验证码`, 'info');
            
            // 构造请求URL，确保参数正确编码
            const endpoint = `/api/get-code?email=${encodeURIComponent(email)}`;
            const result = await callAPI(endpoint);
            
            if (result.success) {
                logger.log(`成功获取验证码: ${result.code} (尝试次数: ${result.attempt})`, 'success');
                return result.code;
            } else {
                logger.log(`获取验证码失败: ${result.message}`, 'error');
                return null;
            }
        } catch (error) {
            logger.log(`获取验证码出错: ${error.message}`, 'error');
            return null;
        }
    }

    // 等待元素出现
    async function waitForElement(selector, timeout = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

    // 自动填写邮箱并提交
    async function fillEmail() {
        // 每次都尝试获取新邮箱
        const result = await getEmailWithLicense();
        if (!result.success) {
            logger.log('无法获取邮箱', 'error');
            return false;
        }
        
        const email = result.email;
        saveEmail(email);
        updateEmailDisplay();

        const emailInput = await waitForElement('input[name="username"]');
        if (!emailInput) {
            logger.log('未找到邮箱输入框', 'error');
            return false;
        }

        logger.log('找到邮箱输入框，开始填写');

        // 填写邮箱
        emailInput.value = email;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));

        // 点击继续按钮
        const continueBtn = await waitForElement('button[type="submit"]');
        if (!continueBtn) {
            logger.log('未找到继续按钮', 'error');
            return false;
        }

        continueBtn.click();
        return true;
    }

    // 填写验证码
    async function fillVerificationCode() {
        const code = await getVerificationCode();
        if (!code) {
            logger.log('未能获取验证码', 'error');
            return false;
        }

        const codeInput = await waitForElement('input[name="code"]');
        if (!codeInput) {
            logger.log('未找到验证码输入框', 'error');
            return false;
        }

        // 填写验证码
        codeInput.value = code;
        codeInput.dispatchEvent(new Event('input', { bubbles: true }));

        // 点击继续按钮
        const continueBtn = await waitForElement('button[type="submit"]');
        if (!continueBtn) {
            logger.log('未找到继续按钮', 'error');
            return false;
        }

        continueBtn.click();
        return true;
    }

    // 同意服务条款并完成注册
    async function completeRegistration() {
        const checkbox = await waitForElement('input[type="checkbox"]');
        if (checkbox) {
            checkbox.click();
        }

        const signupBtn = await waitForElement('button:contains("Sign up")');
        if (!signupBtn) {
            logger.log('未找到注册按钮', 'error');
            return false;
        }

        signupBtn.click();
        return true;
    }

    // 主函数
    async function main() {
        // 只在注册页面运行
        if (!window.location.href.includes('login.augmentcode.com') && !window.location.href.includes('auth.augmentcode.com')) {
            return;
        }

        logger.log('开始自动注册流程...');
        logger.log(`使用 API 地址: ${API_BASE_URL}`);
        
        // 验证卡密并获取邮箱
        const licenseKey = getLicenseKey();
        if (licenseKey) {
            logger.log(`当前使用的卡密: ${licenseKey.substring(0, 3)}***`, 'info');
            try {
                const result = await getEmailWithLicense();
                if (result.success) {
                    saveEmail(result.email);
                    updateEmailDisplay();
                } else {
                    logger.log(`卡密验证失败: ${result.message}`, 'error');
                }
            } catch (error) {
                logger.log(`卡密验证出错: ${error.message}`, 'error');
            }
        } else {
            logger.log('请先设置卡密', 'warning');
        }

        // 检查当前页面状态
        const emailInput = document.querySelector('input[name="username"]');
        const codeInput = document.querySelector('input[name="code"]');
        const termsCheckbox = document.querySelector('#terms-of-service-checkbox');

        if (emailInput) {
            logger.log('检测到邮箱输入页面');
            // 显示注册按钮
            const registerButton = logger.showRegisterButton();
            if (registerButton) {
                registerButton.addEventListener('click', async () => {
                    try {
                        if (!getLicenseKey()) {
                            logger.log('请先设置卡密', 'error');
                            return;
                        }
                        
                        registerButton.disabled = true;
                        registerButton.textContent = '正在填写邮箱...';
                        if (await fillEmail()) {
                            logger.log('邮箱填写完成，请等待页面跳转到验证码输入...', 'success');
                        } else {
                            registerButton.disabled = false;
                            registerButton.textContent = '开始注册';
                        }
                    } catch (error) {
                        logger.log('填写邮箱过程出错: ' + error, 'error');
                        registerButton.disabled = false;
                        registerButton.textContent = '重试自动注册';
                    }
                });
            }
        } else if (codeInput) {
            logger.log('检测到验证码输入页面，自动执行验证码填写...');
            try {
                if (!getLicenseKey()) {
                    logger.log('请先设置卡密', 'error');
                    return;
                }
                
                if (await fillVerificationCode()) {
                    logger.log('验证码填写完成，完成注册...', 'success');
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    if (await completeRegistration()) {
                        logger.log('注册流程完成！', 'success');
                        // 注册完成后清除保存的邮箱，以便下次重新获取
                        saveEmail('');
                        updateEmailDisplay();
                    }
                }
            } catch (error) {
                logger.log('填写验证码过程出错: ' + error, 'error');
            }
        } else if (termsCheckbox) {
            logger.log('检测到服务条款页面，自动勾选同意框...');
            try {
                if (!termsCheckbox.checked) {
                    termsCheckbox.click();
                    logger.log('已自动勾选服务条款同意框', 'success');
                }
                
                // 查找并点击注册按钮
                const signupBtn = await waitForElement('button[type="button"]');
                if (signupBtn) {
                    signupBtn.click();
                    logger.log('点击注册按钮完成', 'success');
                }
            } catch (error) {
                logger.log('勾选服务条款过程出错: ' + error, 'error');
            }
        } else {
            logger.log('无法识别当前页面状态', 'warning');
        }
    }

    // 启动脚本
    main().catch(error => logger.log('脚本启动出错: ' + error, 'error'));
})(); 