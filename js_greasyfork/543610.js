// ==UserScript==
// @name         OpenRouter 注册与API密钥生成器 (v2.0 - 交互式)
// @name:en      OpenRouter Reg & API Key Generator (v2.0 - Interactive)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  单次注册，等待用户输入验证链接，然后自动完成邮箱验证、API密钥创建、保存和登出。
// @description:en Single registration workflow that waits for user's verification link, then automates verification, API key creation, saving, and sign-out.
// @author       YourName
// @match        https://openrouter.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543610/OpenRouter%20%E6%B3%A8%E5%86%8C%E4%B8%8EAPI%E5%AF%86%E9%92%A5%E7%94%9F%E6%88%90%E5%99%A8%20%28v20%20-%20%E4%BA%A4%E4%BA%92%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543610/OpenRouter%20%E6%B3%A8%E5%86%8C%E4%B8%8EAPI%E5%AF%86%E9%92%A5%E7%94%9F%E6%88%90%E5%99%A8%20%28v20%20-%20%E4%BA%A4%E4%BA%92%E5%BC%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置与常量 ---
    const STATE_KEY = 'REGISTRATION_WORKFLOW_STATE';

    // --- 辅助函数 ---
    const waitForElement = (selector, timeout = 15000) => new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
            reject(new Error(`Element "${selector}" not found.`));
        }, timeout);
    });

    const forceInput = (element, value) => {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const generateRandomPassword = (min = 10, max = 12) => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
        let password = '';
        const length = Math.floor(Math.random() * (max - min + 1)) + min;
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };

    const downloadLog = (content, filename) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // --- 核心工作流函数 ---

    // Phase 1: 启动注册流程
    async function startRegistration() {
        updateStatus('Phase 1: 开始注册...');
        try {
            await waitForElement('button[component="SignInButton"]').then(el => el.click());
            await waitForElement('a[href*="/sign-up"]').then(el => el.click());

            const timestamp = Date.now();
            const email = `${timestamp}@fake-name.me`;
            const password = generateRandomPassword();

            const state = { isRunning: true, phase: 'AWAITING_VERIFICATION', email, password, timestamp };
            await GM_setValue(STATE_KEY, state);

            console.log(`%c准备注册账号: %c${email} %c密码: %c${password}`, 'color: blue;', 'color: green; font-weight: bold;', 'color: blue;', 'color: orange; font-weight: bold;');

            const emailInput = await waitForElement('#emailAddress-field');
            forceInput(emailInput, email);
            const passwordInput = await waitForElement('#password-field');
            forceInput(passwordInput, password);
            await new Promise(r => setTimeout(r, 100));
            await waitForElement('#legalAccepted-field').then(el => { if (!el.checked) el.click(); });
            await new Promise(r => setTimeout(r, 100));
            const continueButton = await waitForElement('button.cl-formButtonPrimary');
            if (continueButton.disabled) throw new Error('"Continue" 按钮是禁用的。');
            continueButton.click();

            updateStatus('Phase 1 完成. 请检查邮箱，然后将验证链接粘贴到下方。');
            createControlPanel(state); // Refresh panel to show verification input
        } catch (e) {
            handleError(e);
        }
    }

    // Phase 2: 用户提交验证链接
    async function handleVerificationSubmit() {
        const linkInput = document.getElementById('verification-link');
        if (!linkInput || !linkInput.value.includes('https://')) {
            alert('请输入有效的验证链接！');
            return;
        }
        updateStatus('Phase 2: 已收到链接，正在跳转验证...');
        const state = await GM_getValue(STATE_KEY);
        state.phase = 'VERIFYING';
        await GM_setValue(STATE_KEY, state);
        window.location.href = linkInput.value;
    }

    // Phase 3: 在验证页面着陆后执行
    async function handleVerificationLanded() {
        updateStatus('Phase 3: 验证成功，等待5秒...');
        await new Promise(r => setTimeout(r, 5000));
        updateStatus('...即将跳转到API密钥页面。');
        const state = await GM_getValue(STATE_KEY);
        state.phase = 'CREATING_KEY';
        await GM_setValue(STATE_KEY, state);
        window.location.href = 'https://openrouter.ai/settings/keys';
    }

    // Phase 4 & 5: 创建并保存API密钥
    async function createAndSaveApiKey() {
        const state = await GM_getValue(STATE_KEY);
        updateStatus('Phase 4: 正在创建API密钥...');
        try {
            await waitForElement('button:not([disabled]):not([aria-label])', 10000).then(el => {
                if (el.textContent.includes("Create API Key")) el.click();
            });

            const keyName = `${state.timestamp} - ${state.password}`;
            const nameInput = await waitForElement('#name');
            forceInput(nameInput, keyName);

            // The create button selector is tricky, let's be specific.
            const createButtons = Array.from(document.querySelectorAll('button'));
            const createBtn = createButtons.find(btn => btn.textContent === "Create" && !btn.disabled);
            if (!createBtn) throw new Error("无法找到'Create'按钮。");
            createBtn.click();

            updateStatus('Phase 5: 正在保存API密钥...');
            const codeElement = await waitForElement('code.my-4');
            const apiKey = codeElement.textContent;

            const logContent = `
OpenRouter Account Details
==========================
Date: ${new Date(state.timestamp).toUTCString()}
Email: ${state.email}
Password: ${state.password}
API Key: ${apiKey}
            `;
            downloadLog(logContent.trim(), `openrouter_key_${state.timestamp}.txt`);
            console.log('%cAPI密钥已保存到下载文件！', 'color: lightgreen; font-size: 16px;');
            
            // Proceed to logout
            state.phase = 'LOGGING_OUT';
            await GM_setValue(STATE_KEY, state);
            performLogout();

        } catch (e) {
            handleError(e);
        }
    }

    // Phase 6: 登出
    async function performLogout() {
        updateStatus('Phase 6: 正在登出...');
        try {
            // Close the API key modal first
            const closeButtons = Array.from(document.querySelectorAll('button[aria-label]'));
            const closeModalBtn = closeButtons.find(btn => btn.getAttribute('aria-label').toLowerCase().includes("close"));
            if(closeModalBtn) closeModalBtn.click();
            
            await new Promise(r => setTimeout(r, 500)); // Wait for modal to close

            // Click avatar
            await waitForElement('img[width="24"][height="24"]').then(el => el.click());

            // Click "Sign out" in the popover
            const signOutBtn = await waitForElement('.cl-userButtonPopoverActionButton');
            if(signOutBtn.textContent.includes('Sign out')) {
                signOutBtn.click();
            } else {
                throw new Error("找不到 'Sign out' 按钮。");
            }

            updateStatus('登出成功！流程结束。');
            await GM_deleteValue(STATE_KEY);
            await new Promise(r => setTimeout(r, 2000)); // Wait for logout to complete
            createControlPanel(null); // Reset UI
        } catch (e) {
            handleError(e);
        }
    }

    // --- UI 和状态管理 ---
    function createControlPanel(state) {
        let existingPanel = document.getElementById('reg-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'reg-panel';
        panel.style.cssText = `position: fixed; bottom: 20px; right: 20px; background-color: #2c3e50; color: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 9999; font-family: Arial, sans-serif; font-size: 14px; width: 320px;`;

        let innerHTML = `<h3 style="margin: 0 0 10px; padding-bottom: 5px; border-bottom: 1px solid #7f8c8d;">注册与密钥生成器 (v2.0)</h3>`;

        if (!state || !state.isRunning) {
            innerHTML += `<button id="start-reg-btn" style="background-color: #27ae60; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; width: 100%;">开始一次新注册</button>`;
        } else if (state.phase === 'AWAITING_VERIFICATION') {
            innerHTML += `
                <div style="margin-bottom: 10px;">
                    <label for="verification-link" style="display: block; margin-bottom: 5px;">验证链接:</label>
                    <input type="text" id="verification-link" placeholder="在此处粘贴邮件中的验证链接" style="width: 95%; color: black; padding: 5px;">
                </div>
                <button id="submit-link-btn" style="background-color: #3498db; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%;">提交验证链接</button>
            `;
        }
        
        innerHTML += `<p id="reg-status" style="margin-top: 10px; font-size: 12px; color: #ecf0f1; min-height: 1.2em;">状态: 空闲</p>`;
        innerHTML += `<button id="reset-btn" style="background-color: #c0392b; color: white; border: none; padding: 5px; border-radius: 4px; cursor: pointer; width: 100%; margin-top:10px;">重置/取消当前任务</button>`;

        panel.innerHTML = innerHTML;
        document.body.appendChild(panel);

        // Add event listeners
        if (!state || !state.isRunning) {
            document.getElementById('start-reg-btn').addEventListener('click', startRegistration);
        } else if (state.phase === 'AWAITING_VERIFICATION') {
            document.getElementById('submit-link-btn').addEventListener('click', handleVerificationSubmit);
        }
        document.getElementById('reset-btn').addEventListener('click', resetProcess);
    }

    function updateStatus(message) {
        const statusEl = document.getElementById('reg-status');
        if (statusEl) statusEl.textContent = `状态: ${message}`;
        console.log(`[RegBot] ${message}`);
    }
    
    async function resetProcess() {
        await GM_deleteValue(STATE_KEY);
        alert('任务已重置。页面将刷新。');
        window.location.reload();
    }

    function handleError(error) {
        console.error('脚本发生错误:', error);
        updateStatus(`错误: ${error.message}`);
        alert(`脚本出错: ${error.message}\n请检查控制台(F12)获取详情，然后点击'重置'按钮。`);
    }

    // --- 主执行逻辑 (页面加载时运行) ---
    async function main() {
        const state = await GM_getValue(STATE_KEY);
        createControlPanel(state); // Always create the UI first

        if (!state || !state.isRunning) {
            updateStatus('空闲，等待用户操作。');
            return;
        }

        // State Machine Router
        switch (state.phase) {
            case 'AWAITING_VERIFICATION':
                updateStatus('等待用户粘贴验证链接...');
                break;
            case 'VERIFYING':
                // This logic is for when we land ON the verification page
                handleVerificationLanded();
                break;
            case 'CREATING_KEY':
                if (window.location.pathname.includes('/settings/keys')) {
                    createAndSaveApiKey();
                } else {
                    // Safety net in case of redirect failure
                    window.location.href = 'https://openrouter.ai/settings/keys';
                }
                break;
            case 'LOGGING_OUT':
                performLogout();
                break;
        }
    }

    window.addEventListener('load', main);
})();