// ==UserScript==
// @name         AugmentCode autoRegister(With Config Panel)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动完成AugmentCode的注册流程，支持可视化配置
// @original-author chengazhen
// @author       hj01857655
// @match        https://*.augmentcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=augmentcode.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      tempmail.plus
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540130/AugmentCode%20autoRegister%28With%20Config%20Panel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540130/AugmentCode%20autoRegister%28With%20Config%20Panel%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        emailDomain: "", // 默认不带@前缀
        firstNames: ["linda", "john", "mary", "david", "sarah", "michael", "jennifer"],
        lastNames: ["garcia", "smith", "johnson", "brown", "davis", "miller", "wilson"],
        tempMailConfig: {
            tempMailAddress: "@mailto.plus",
            epin: ""
        },
        maxRetries: 5,
        retryInterval: 3000
    };

    // 获取配置（带错误处理和缓存）
    let configCache = null;
    function getConfig() {
        if (configCache) {
            return configCache;
        }

        try {
            const savedConfig = GM_getValue('autoRegisterConfig', null);
            configCache = savedConfig ? JSON.parse(savedConfig) : { ...DEFAULT_CONFIG };
            return configCache;
        } catch (error) {
            console.error('配置解析失败:', error);
            configCache = { ...DEFAULT_CONFIG };
            return configCache;
        }
    }

    // 清除配置缓存
    function clearConfigCache() {
        configCache = null;
    }

    // 保存配置
    function saveConfig(config) {
        try {
            GM_setValue('autoRegisterConfig', JSON.stringify(config));
            clearConfigCache(); // 清除缓存以确保下次获取最新配置
        } catch (error) {
            console.error('配置保存失败:', error);
            throw new Error('配置保存失败');
        }
    }

    // 生成随机邮箱
    function generateEmail() {
        const config = getConfig();
        const firstName = config.firstNames[Math.floor(Math.random() * config.firstNames.length)];
        const lastName = config.lastNames[Math.floor(Math.random() * config.lastNames.length)];
        const timestamp = Date.now().toString(36);
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        let username = `${firstName}${lastName}${timestamp}${randomNum}`;
        let domain = config.emailDomain.trim().replace(/^@+/, ''); // 移除所有开头的@，防止多余
        if (!domain) {
            logger && logger.log('邮箱域名配置为空，无法生成邮箱！', 'error');
            throw new Error('邮箱域名配置为空，无法生成邮箱');
        }
        return `${username}@${domain}`;
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



    // 等待页面完全加载
    async function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve, { once: true });
            }
        });
    }



    // 从邮件文本中提取验证码
    function extractVerificationCode(mailText) {
        const codeMatch = mailText.match(/(?<![a-zA-Z@.])\b\d{6}\b/);
        return codeMatch ? codeMatch[0] : null;
    }

    // 删除邮件
    async function deleteEmail(firstId) {
        return new Promise((resolve) => {
            const config = getConfig();
            const deleteUrl = 'https://tempmail.plus/api/mails/';
            const maxRetries = 5;
            let retryCount = 0;

            function tryDelete() {
                GM_xmlhttpRequest({
                    method: "DELETE",
                    url: deleteUrl,
                    data: `email=${config.tempMailConfig.tempMailAddress}&first_id=${firstId}&epin=${config.tempMailConfig.epin}`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function (response) {
                        try {
                            const result = JSON.parse(response.responseText).result;
                            if (result === true) {
                                logger.log("邮件删除成功", 'success');
                                resolve(true);
                                return;
                            }
                        } catch (error) {
                            logger.log("解析删除响应失败: " + error, 'warning');
                        }

                        if (retryCount < maxRetries - 1) {
                            retryCount++;
                            logger.log(`删除邮件失败，正在重试 (${retryCount}/${maxRetries})...`, 'warning');
                            setTimeout(tryDelete, 500);
                        } else {
                            logger.log("删除邮件失败，已达到最大重试次数", 'error');
                            resolve(false);
                        }
                    },
                    onerror: function (error) {
                        if (retryCount < maxRetries - 1) {
                            retryCount++;
                            logger.log(`删除邮件出错，正在重试 (${retryCount}/${maxRetries})...`, 'warning');
                            setTimeout(tryDelete, 500);
                        } else {
                            logger.log("删除邮件失败: " + error, 'error');
                            resolve(false);
                        }
                    }
                });
            }

            tryDelete();
        });
    }

    // 获取最新邮件中的验证码
    async function getLatestMailCode() {
        return new Promise((resolve) => {
            const config = getConfig();
            const mailListUrl = `https://tempmail.plus/api/mails?email=${config.tempMailConfig.tempMailAddress}&limit=20&epin=${config.tempMailConfig.epin}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: mailListUrl,
                onload: async function (mailListResponse) {
                    try {
                        const mailListData = JSON.parse(mailListResponse.responseText);
                        if (!mailListData.result || !mailListData.first_id) {
                            resolve(null);
                            return;
                        }

                        const firstId = mailListData.first_id;
                        const mailDetailUrl = `https://tempmail.plus/api/mails/${firstId}?email=${config.tempMailConfig.tempMailAddress}&epin=${config.tempMailConfig.epin}`;

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: mailDetailUrl,
                            onload: async function (mailDetailResponse) {
                                try {
                                    const mailDetailData = JSON.parse(mailDetailResponse.responseText);
                                    if (!mailDetailData.result) {
                                        resolve(null);
                                        return;
                                    }

                                    const mailText = mailDetailData.text || "";
                                    const mailSubject = mailDetailData.subject || "";
                                    logger.log("找到邮件主题: " + mailSubject);

                                    const code = extractVerificationCode(mailText);

                                    if (code) {
                                        await deleteEmail(firstId);
                                    }

                                    resolve(code);
                                } catch (error) {
                                    logger.log("解析邮件详情失败: " + error, 'error');
                                    resolve(null);
                                }
                            },
                            onerror: function (error) {
                                logger.log("获取邮件详情失败: " + error, 'error');
                                resolve(null);
                            }
                        });
                    } catch (error) {
                        logger.log("解析邮件列表失败: " + error, 'error');
                        resolve(null);
                    }
                },
                onerror: function (error) {
                    logger.log("获取邮件列表失败: " + error, 'error');
                    resolve(null);
                }
            });
        });
    }

    // 获取验证码（带重试机制）
    async function getVerificationCode() {
        const config = getConfig();
        const maxRetries = config.maxRetries;
        const retryInterval = config.retryInterval;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            logger.log(`尝试获取验证码 (第 ${attempt + 1}/${maxRetries} 次)...`);

            try {
                const code = await getLatestMailCode();
                if (code) {
                    logger.log("成功获取验证码: " + code, 'success');
                    return code;
                }

                if (attempt < maxRetries - 1) {
                    logger.log(`未获取到验证码，${retryInterval / 1000}秒后重试...`, 'warning');
                    await new Promise(resolve => setTimeout(resolve, retryInterval));
                }
            } catch (error) {
                logger.log("获取验证码出错: " + error, 'error');
                if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, retryInterval));
                }
            }
        }

        throw new Error(`经过 ${maxRetries} 次尝试后仍未获取到验证码。`);
    }

    // 自动填写邮箱并提交
    async function fillEmail() {
        const email = generateEmail();
        logger.log('使用邮箱: ' + email);

        const emailInput = await waitForElement('input[name="username"]');
        if (!emailInput) {
            logger.log('未找到邮箱输入框', 'error');
            return false;
        }

        logger.log('找到邮箱输入框，开始填写');
        emailInput.value = email;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));

        // 等待页面完全加载
        logger.log('确保页面完全加载...', 'info');
        await waitForPageLoad();

        // 等待2秒确保页面稳定
        logger.log('等待2秒确保页面稳定...', 'info');
        await new Promise(resolve => setTimeout(resolve, 2000));

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

        codeInput.value = code;
        codeInput.dispatchEvent(new Event('input', { bubbles: true }));

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

        // 查找包含"Sign up"文本的按钮
        const signupBtn = await waitForElement('button[type="button"]') ||
            await waitForElement('button[type="submit"]') ||
            Array.from(document.querySelectorAll('button')).find(btn =>
                btn.textContent.includes('Sign up') ||
                btn.textContent.includes('start coding')
            );

        if (!signupBtn) {
            logger.log('未找到注册按钮', 'error');
            return false;
        }

        signupBtn.click();
        return true;
    }

    // 创建配置面板
    function createConfigPanel() {
        const config = getConfig();

        const configPanel = document.createElement('div');
        configPanel.innerHTML = `
            <div id="config-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.15); z-index: 10000; display: none;"></div>
<div id="config-panel" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                z-index: 10001;
                font-family: Arial, sans-serif;
                overflow: hidden;
                display: none;
            ">
                <div style="
                    padding: 16px 20px;
                    background: #1a73e8;
                    color: white;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>自动注册配置</span>
                    <button id="close-config" style="
                        background: transparent;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 18px;
                        padding: 4px;
                    ">×</button>
                </div>
                <div style="
                    padding: 20px;
                    overflow-y: auto;
                    max-height: calc(80vh - 120px);
                ">
                    <div style="
                        margin-bottom: 24px;
                        padding: 16px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border: 1px solid #e8eaed;
                    ">
                        <label style="
                            display: block;
                            margin-bottom: 10px;
                            font-weight: bold;
                            color: #1a73e8;
                            font-size: 15px;
                        ">📧 邮箱域名</label>
                        <input id="email-domain" type="text" value="${config.emailDomain}" style="
                            width: calc(100% - 24px);
                            padding: 12px;
                            border: 2px solid #e8eaed;
                            border-radius: 6px;
                            font-size: 14px;
                            background: white;
                            transition: border-color 0.2s;
                        " placeholder="例如: example.com">
                        <small style="
                            color: #5f6368;
                            font-size: 12px;
                            display: block;
                            margin-top: 6px;
                            font-style: italic;
                        ">💡 提示: 请输入邮箱域名（不含@前缀）</small>
                    </div>

                    <div style="
                        margin-bottom: 24px;
                        padding: 16px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border: 1px solid #e8eaed;
                    ">
                        <label style="
                            display: block;
                            margin-bottom: 10px;
                            font-weight: bold;
                            color: #1a73e8;
                            font-size: 15px;
                        ">👤 名字列表</label>
                        <textarea id="first-names" style="
                            width: calc(100% - 24px);
                            height: 80px;
                            padding: 12px;
                            border: 2px solid #e8eaed;
                            border-radius: 6px;
                            font-size: 14px;
                            background: white;
                            resize: vertical;
                            font-family: Arial, sans-serif;
                            line-height: 1.4;
                        " placeholder="用逗号分隔，例如: john, mary, david">${config.firstNames.join(', ')}</textarea>
                        <small style="
                            color: #5f6368;
                            font-size: 12px;
                            display: block;
                            margin-top: 6px;
                            font-style: italic;
                        ">💡 提示: 用于生成邮箱用户名的名字，用逗号分隔</small>
                    </div>

                    <div style="
                        margin-bottom: 24px;
                        padding: 16px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border: 1px solid #e8eaed;
                    ">
                        <label style="
                            display: block;
                            margin-bottom: 10px;
                            font-weight: bold;
                            color: #1a73e8;
                            font-size: 15px;
                        ">👥 姓氏列表</label>
                        <textarea id="last-names" style="
                            width: calc(100% - 24px);
                            height: 80px;
                            padding: 12px;
                            border: 2px solid #e8eaed;
                            border-radius: 6px;
                            font-size: 14px;
                            background: white;
                            resize: vertical;
                            font-family: Arial, sans-serif;
                            line-height: 1.4;
                        " placeholder="用逗号分隔，例如: smith, johnson, brown">${config.lastNames.join(', ')}</textarea>
                        <small style="
                            color: #5f6368;
                            font-size: 12px;
                            display: block;
                            margin-top: 6px;
                            font-style: italic;
                        ">💡 提示: 用于生成邮箱用户名的姓氏，用逗号分隔</small>
                    </div>

                    <div style="
                        margin-bottom: 24px;
                        padding: 16px;
                        background: #fff3e0;
                        border-radius: 8px;
                        border: 1px solid #ffcc02;
                    ">
                        <h4 style="
                            margin: 0 0 16px 0;
                            color: #e65100;
                            font-size: 16px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        ">📮 临时邮箱配置</h4>

                        <div style="margin-bottom: 16px;">
    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #e65100; font-size: 14px;">📨 临时邮箱地址</label>
    <div style="display: flex; align-items: center; gap: 8px;">
        <input id="temp-mail-address" type="text" value="${config.tempMailConfig.tempMailAddress || ''}" style="flex:1; padding: 12px; border: 2px solid #ffcc02; border-radius: 6px; font-size: 14px; background: white; transition: border-color 0.2s;" placeholder="例如: @mailto.plus">
        <button id="paste-mail-btn" type="button" style="padding: 8px 12px; border-radius: 6px; border: none; background: #ffcc02; color: #fff; font-weight: bold; cursor: pointer;">粘贴</button>
    </div>
    <small id="mail-check-result" style="color: #bf360c; font-size: 12px; display: block; margin-top: 6px; font-style: italic;">💡 请输入完整的临时邮箱地址（如 @mailto.plus）</small>
</div>

<button id="toggle-advanced" type="button" style="margin-bottom: 12px; background: #e0e0e0; color: #e65100; border: none; border-radius: 6px; padding: 4px 12px; font-size: 13px; cursor: pointer;">显示高级选项 ▼</button>
<div id="advanced-options" style="display: none;">

                        <div style="margin-bottom: 0;">
    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #e65100; font-size: 14px;">🔑 EPIN</label>
    <input id="temp-epin" type="text" value="${config.tempMailConfig.epin}" style="width: calc(100% - 24px); padding: 12px; border: 2px solid #ffcc02; border-radius: 6px; font-size: 14px; background: white; transition: border-color 0.2s;" placeholder="可选的安全PIN码">
    <small style="color: #bf360c; font-size: 12px; display: block; margin-top: 6px; font-style: italic;">💡 临时邮箱的安全PIN码（可选）</small>
</div>

                    </div>
<div style="display: flex; gap: 10px; margin-bottom: 18px;">
    <button id="reset-config" type="button" style="flex:1; background: #f5f5f5; color: #1a73e8; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 0; font-weight: bold; cursor: pointer;">恢复默认</button>
    <button id="import-config" type="button" style="flex:1; background: #f5f5f5; color: #009688; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 0; font-weight: bold; cursor: pointer;">导入配置</button>
    <button id="export-config" type="button" style="flex:1; background: #f5f5f5; color: #e65100; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 0; font-weight: bold; cursor: pointer;">导出配置</button>
</div>

<div style="
    margin-bottom: 24px;
    padding: 16px;
    background: #e8f5e8;
    border-radius: 8px;
    border: 1px solid #4caf50;
">
    <h4 style="
        margin: 0 0 16px 0;
        color: #2e7d32;
                            font-size: 16px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        ">⚙️ 重试设置</h4>

                        <div style="display: flex; gap: 20px;">
                            <div style="flex: 1;">
                                <label style="
                                    display: block;
                                    margin-bottom: 8px;
                                    font-weight: bold;
                                    color: #2e7d32;
                                    font-size: 14px;
                                ">🔄 最大重试次数</label>
                                <input id="max-retries" type="number" value="${config.maxRetries}" min="1" max="10" style="
                                    width: calc(100% - 24px);
                                    padding: 12px;
                                    border: 2px solid #4caf50;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    background: white;
                                    transition: border-color 0.2s;
                                " placeholder="1-10">
                                <small style="
                                    color: #1b5e20;
                                    font-size: 12px;
                                    display: block;
                                    margin-top: 6px;
                                    font-style: italic;
                                ">💡 获取验证码失败时的重试次数</small>
                            </div>
                            <div style="flex: 1;">
                                <label style="
                                    display: block;
                                    margin-bottom: 8px;
                                    font-weight: bold;
                                    color: #2e7d32;
                                    font-size: 14px;
                                ">⏱️ 重试间隔</label>
                                <input id="retry-interval" type="number" value="${config.retryInterval}" min="1000" max="10000" step="500" style="
                                    width: calc(100% - 24px);
                                    padding: 12px;
                                    border: 2px solid #4caf50;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    background: white;
                                    transition: border-color 0.2s;
                                " placeholder="毫秒">
                                <small style="
                                    color: #1b5e20;
                                    font-size: 12px;
                                    display: block;
                                    margin-top: 6px;
                                    font-style: italic;
                                ">💡 每次重试之间的等待时间(毫秒)</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="
                    padding: 16px 20px;
                    background: #f8f9fa;
                    border-top: 1px solid #e8eaed;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button id="reset-config" style="
                        background: #ea4335;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                        padding: 8px 16px;
                        border-radius: 4px;
                    ">重置默认</button>
                    <button id="save-config" style="
                        background: #34a853;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                        padding: 8px 16px;
                        border-radius: 4px;
                    ">保存配置</button>
                </div>
            </div>
            <div id="config-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: none;
            "></div>
        `;

        document.body.appendChild(configPanel);
        return configPanel;
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
                    padding: 14px 16px 12px 18px;
                    background: linear-gradient(90deg, #1a73e8 0%, #34a853 100%);
                    color: #fff;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 16px;
                    letter-spacing: 1px;
                    border-top-left-radius: 18px;
                    border-top-right-radius: 18px;
                    box-shadow: 0 2px 12px 0 rgba(26,115,232,0.08);
                    border-bottom: 1.5px solid #e3e8ee;
                    position: relative;
                ">
                    <span style="display:flex;align-items:center;gap:7px;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#fff2"/><path d="M12 7v5l3.5 3.5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        自动注册日志
                    </span>
                    <div>
                        <button id="config-btn" style="
                            background: #ff9800;
                            border: none;
                            color: white;
                            cursor: pointer;
                            font-size: 12px;
                            padding: 4px 8px;
                            border-radius: 4px;
                            margin-right: 4px;
                        ">⚙️</button>
                        <button id="auto-register-btn" style="
                            background: linear-gradient(90deg, #34a853 0%, #1a73e8 100%);
                            border: none;
                            color: #fff;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: bold;
                            padding: 8px 22px;
                            border-radius: 999px;
                            margin-right: 10px;
                            margin-left: 10px;
                            margin-bottom: 2px;
                            box-shadow: 0 2px 8px 0 rgba(52,168,83,0.10);
                            display: none;
                            transition: background 0.3s, box-shadow 0.2s, transform 0.15s;
                        "
                        onmouseover="this.style.background='linear-gradient(90deg,#1a73e8 0%,#34a853 100%)';this.style.transform='scale(1.06)';this.style.boxShadow='0 4px 20px 0 rgba(52,168,83,0.18)';"
                        onmouseout="this.style.background='linear-gradient(90deg,#34a853 0%,#1a73e8 100%)';this.style.transform='scale(1)';this.style.boxShadow='0 2px 8px 0 rgba(52,168,83,0.10)';"
                    >立即自动注册 🚀</button>
                        <button id="clear-log" style="
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                            font-size: 12px;
                            padding: 4px 8px;
                            border-radius: 4px;
                            margin-right: 4px;
                        ">清除</button>
                        <button id="minimize-log" style="
                            background: transparent;
                            border: none;
                            color: white;
                            cursor: pointer;
                            font-size: 14px;
                            padding: 4px 8px;
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
                    <span style="color: #1a73e8;">
                    📢<span>原作者公众号「code 未来」获取更多技术资源</span>
                    📢<span>二开作者公众号「码趣科技汇」</span>
                    </span>
                    
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

        // 创建配置面板
        createConfigPanel();

        // 配置按钮功能
        const configBtn = document.getElementById('config-btn');
        configBtn.addEventListener('click', () => {
            document.getElementById('config-panel').style.display = 'block';
            document.getElementById('config-overlay').style.display = 'block';
        });

        // 配置面板事件处理
        const closeConfigBtn = document.getElementById('close-config');
        const configOverlay = document.getElementById('config-overlay');
        const saveConfigBtn = document.getElementById('save-config');
        const resetConfigBtn = document.getElementById('reset-config');

        // 关闭配置面板
        const closeConfig = () => {
            document.getElementById('config-panel').style.display = 'none';
            document.getElementById('config-overlay').style.display = 'none';
        };

        closeConfigBtn.addEventListener('click', closeConfig);
        configOverlay.addEventListener('click', closeConfig);

        // 添加输入框实时验证
        const tempMailAddressInput = document.getElementById('temp-mail-address');
        const maxRetriesInput = document.getElementById('max-retries');
        const retryIntervalInput = document.getElementById('retry-interval');

        // 粘贴按钮功能
        const pasteBtn = document.getElementById('paste-mail-btn');
        const mailCheckResult = document.getElementById('mail-check-result');
        if (pasteBtn && tempMailAddressInput) {
            pasteBtn.onclick = async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    tempMailAddressInput.value = text;
                    tempMailAddressInput.dispatchEvent(new Event('input'));
                } catch (e) {
                    mailCheckResult.textContent = '⚠️ 无法读取剪贴板内容，请手动粘贴';
                }
            };
        }
        // 临时邮箱实时校验
        function checkMailInput() {
            const value = tempMailAddressInput.value.trim();
            if (!value) {
                tempMailAddressInput.style.borderColor = '#ea4335';
                mailCheckResult.textContent = '邮箱不能为空';
                return false;
            }
            if (!/^.+@.+\..+$/.test(value)) {
                tempMailAddressInput.style.borderColor = '#ea4335';
                mailCheckResult.textContent = '格式错误：请输入完整邮箱地址';
                return false;
            }
            tempMailAddressInput.style.borderColor = '#4caf50';
            mailCheckResult.textContent = '格式正确';
            return true;
        }
        if (tempMailAddressInput) {
            tempMailAddressInput.addEventListener('input', checkMailInput);
            checkMailInput();
        }

        // 高级选项折叠切换
        const toggleAdvancedBtn = document.getElementById('toggle-advanced');
        const advancedOptions = document.getElementById('advanced-options');
        if (toggleAdvancedBtn && advancedOptions) {
            toggleAdvancedBtn.onclick = () => {
                if (advancedOptions.style.display === 'none') {
                    advancedOptions.style.display = '';
                    toggleAdvancedBtn.textContent = '隐藏高级选项 ▲';
                } else {
                    advancedOptions.style.display = 'none';
                    toggleAdvancedBtn.textContent = '显示高级选项 ▼';
                }
            };
        }

        // 保存按钮禁用逻辑
        function updateSaveBtnState() {
            let valid = true;
            if (!checkMailInput()) valid = false;
            // 你可以在这里加更多表单校验
            saveConfigBtn.disabled = !valid;
            saveConfigBtn.style.opacity = valid ? 1 : 0.6;
        }
        if (tempMailAddressInput) tempMailAddressInput.addEventListener('input', updateSaveBtnState);
        updateSaveBtnState();

        // 恢复默认
        const resetBtn = document.getElementById('reset-config');
        if (resetBtn) {
            resetBtn.onclick = () => {
                if (confirm('确定要恢复默认配置吗？')) {
                    saveConfig(DEFAULT_CONFIG);
                    location.reload();
                }
            };
        }
        // 导出配置
        const exportBtn = document.getElementById('export-config');
        if (exportBtn) {
            exportBtn.onclick = () => {
                const data = JSON.stringify(getConfig(), null, 2);
                navigator.clipboard.writeText(data).then(() => {
                    alert('配置已复制到剪贴板');
                });
            };
        }
        // 导入配置
        const importBtn = document.getElementById('import-config');
        if (importBtn) {
            importBtn.onclick = () => {
                const input = prompt('请粘贴导出的配置JSON：');
                if (!input) return;
                try {
                    const cfg = JSON.parse(input);
                    saveConfig(cfg);
                    alert('导入成功，页面将刷新');
                    location.reload();
                } catch (e) {
                    alert('配置格式错误，请检查！');
                }
            };
        }

        // 暗色模式适配
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.getElementById('config-panel').style.background = '#23272e';
            document.getElementById('config-panel').style.color = '#eee';
            document.querySelectorAll('#config-panel input, #config-panel textarea').forEach(el => {
                el.style.background = '#23272e';
                el.style.color = '#eee';
            });
        }


        // 重试次数验证
        maxRetriesInput.addEventListener('input', function () {
            const value = parseInt(this.value);
            if (isNaN(value) || value < 1 || value > 10) {
                this.style.borderColor = '#ea4335';
                this.style.background = '#fce8e6';
            } else {
                this.style.borderColor = '#4caf50';
                this.style.background = 'white';
            }
        });

        // 重试间隔验证
        retryIntervalInput.addEventListener('input', function () {
            const value = parseInt(this.value);
            if (isNaN(value) || value < 1000 || value > 10000) {
                this.style.borderColor = '#ea4335';
                this.style.background = '#fce8e6';
            } else {
                this.style.borderColor = '#4caf50';
                this.style.background = 'white';
            }
        });

        // 保存配置
        saveConfigBtn.addEventListener('click', () => {
            // 验证输入
            const emailDomain = document.getElementById('email-domain').value.trim();
            const firstNames = document.getElementById('first-names').value.split(',').map(s => s.trim()).filter(s => s);
            const lastNames = document.getElementById('last-names').value.split(',').map(s => s.trim()).filter(s => s);
            const maxRetries = parseInt(document.getElementById('max-retries').value);
            const retryInterval = parseInt(document.getElementById('retry-interval').value);

            // 输入验证
            if (!emailDomain) {
                alert('邮箱域名不能为空');
                return;
            }
            if (!tempMailAddressInput.value.trim() || !/^.+@.+\..+$/.test(tempMailAddressInput.value.trim())) {
                alert('临时邮箱地址不能为空，且必须为完整邮箱格式');
                return;
            }
            if (firstNames.length === 0) {
                alert('名字列表不能为空');
                return;
            }
            if (lastNames.length === 0) {
                alert('姓氏列表不能为空');
                return;
            }
            if (isNaN(maxRetries) || maxRetries < 1 || maxRetries > 10) {
                alert('最大重试次数必须是1-10之间的数字');
                return;
            }
            if (isNaN(retryInterval) || retryInterval < 1000 || retryInterval > 10000) {
                alert('重试间隔必须是1000-10000之间的数字（毫秒）');
                return;
            }

            const newConfig = {
                emailDomain: emailDomain,
                firstNames: firstNames,
                lastNames: lastNames,
                tempMailConfig: {
                    tempMailAddress: tempMailAddressInput.value.trim(),
                    epin: document.getElementById('temp-epin').value.trim()
                },
                maxRetries: maxRetries,
                retryInterval: retryInterval
            };

            saveConfig(newConfig);
            closeConfig();

            // 显示保存成功消息
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '8px';
            logEntry.style.padding = '8px';
            logEntry.style.borderRadius = '4px';
            logEntry.style.background = '#e6f4ea';
            logEntry.style.color = '#1e8e3e';
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] 配置已保存成功！`;
            document.getElementById('log-content').appendChild(logEntry);

            // 滚动到最新日志
            const logContent = document.getElementById('log-content');
            logContent.scrollTop = logContent.scrollHeight;
        });

        // 重置配置
        resetConfigBtn.addEventListener('click', () => {
            if (confirm('确定要重置为默认配置吗？')) {
                saveConfig(DEFAULT_CONFIG);
                closeConfig();
                location.reload();
            }
        });

        // 最小化功能
        let isMinimized = false;
        const logContent = document.getElementById('log-content');
        const minimizeBtn = document.getElementById('minimize-log');

        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            logContent.style.display = isMinimized ? 'none' : 'block';
            minimizeBtn.textContent = isMinimized ? '□' : '_';
        });

        // 清除日志功能
        const clearBtn = document.getElementById('clear-log');
        clearBtn.addEventListener('click', () => {
            logContent.innerHTML = '';
        });

        return {
            log: function (message, type = 'info') {
                const logEntry = document.createElement('div');
                logEntry.style.marginBottom = '8px';
                logEntry.style.padding = '8px';
                logEntry.style.borderRadius = '4px';
                logEntry.style.wordBreak = 'break-word';

                switch (type) {
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
            },
            showRegisterButton: function () {
                const registerBtn = document.getElementById('auto-register-btn');
                if (registerBtn) {
                    this.log('找到注册按钮，正在显示...');
                    registerBtn.style.display = 'inline-block';
                    return registerBtn;
                } else {
                    this.log('未找到注册按钮元素', 'error');
                    return null;
                }
            }
        };
    }

    // 创建全局日志对象
    const logger = createLogUI();

    // 现在logger已初始化，更新iframe拦截器中的日志函数
    if (typeof window.updateIframeInterceptorLogger === 'undefined') {
        window.updateIframeInterceptorLogger = function () {
            // 这个函数会在需要时被调用来更新日志函数
        };
    }

    // 主函数
    async function main() {
        // 只在注册页面运行
        if (!window.location.href.includes('login.augmentcode.com') && !window.location.href.includes('auth.augmentcode.com')) {
            return;
        }

        logger.log('开始自动注册流程...');

        // 等待页面完全加载后再进行初始检查
        logger.log('等待页面完全加载...');
        await waitForPageLoad();
        logger.log('页面已完全加载');



        // 检查当前页面状态
        const emailInput = document.querySelector('input[name="username"]');
        const codeInput = document.querySelector('input[name="code"]');
        const termsCheckbox = document.querySelector('#terms-of-service-checkbox');

        if (emailInput) {
            logger.log('检测到邮箱输入页面');
            // 直接显示注册按钮并绑定逻辑，无需等待Cloudflare
            const registerButton = logger.showRegisterButton();
            if (registerButton) {
                registerButton.addEventListener('click', async () => {
                    try {
                        registerButton.disabled = true;
                        registerButton.textContent = '正在填写邮箱...';
                        if (await fillEmail()) {
                            logger.log('邮箱填写完成，请等待页面跳转到验证码输入...', 'success');
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
                if (await fillVerificationCode()) {
                    logger.log('验证码填写完成，完成注册...', 'success');
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    if (await completeRegistration()) {
                        logger.log('注册流程完成！', 'success');
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
        } else if (window.location.href.includes('/invitations')) {
            logger.log('检测到邀请页面，自动点击 Accept Invite 按钮...');
            // 尝试查找按钮（可以根据按钮文本、aria-label或class等多种方式）
            let acceptBtn = document.querySelector('button.accept-button[onclick*="acceptInvitation"], button[onclick*="acceptInvitation"]');
            if (!acceptBtn) {
                acceptBtn = Array.from(document.querySelectorAll('button'))
                    .find(btn => btn.textContent && btn.textContent.trim().toLowerCase().includes('accept invite'));
            }
            if (acceptBtn) {
                acceptBtn.click();
                logger.log('已自动点击 Accept Invite 按钮', 'success');
            } else {
                logger.log('未找到 Accept Invite 按钮', 'error');
            }
        } else {
            logger.log('无法识别当前页面状态', 'warning');
        }
    }

    // 启动脚本
    main().catch(error => logger.log('脚本启动出错: ' + error, 'error'));
})();
