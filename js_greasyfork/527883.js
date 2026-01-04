// ==UserScript==
// @name         自动点击手机登录-步骤显示版
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  带步骤显示的移动端自动登录脚本
// @author       YourName
// @match        https://sm.hpv.pub:99/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hpv.pub
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527883/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%89%8B%E6%9C%BA%E7%99%BB%E5%BD%95-%E6%AD%A5%E9%AA%A4%E6%98%BE%E7%A4%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/527883/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%89%8B%E6%9C%BA%E7%99%BB%E5%BD%95-%E6%AD%A5%E9%AA%A4%E6%98%BE%E7%A4%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        maxRetry: 30,
        retryInterval: 1000,
        phoneNumber: '18577025857',
        delayBeforeStart: 3000,
        useTouchEvents: true,
        debugHighlight: true,
        showStatusPanel: true // 显示状态面板
    };

    let isTaskCompleted = false;
    let currentStep = '等待页面加载';

    // 创建状态面板
    function createStatusPanel() {
        const panel = document.createElement('div');
        panel.id = 'script-status-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px;
            border-radius: 8px;
            z-index: 9999;
            max-width: 280px;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(panel);
        updateStatus('脚本初始化完成');
    }

    // 更新状态显示
    function updateStatus(text, isError = false) {
        currentStep = text;
        if (!config.showStatusPanel) return;

        const panel = document.getElementById('script-status-panel') || createStatusPanel();
        panel.innerHTML = `
            <div style="margin-bottom:6px;color:${isError ? '#ff4444' : '#4CAF50'}">▶ 当前步骤：${text}</div>
            <div style="color:#888;font-size:12px;">${new Date().toLocaleTimeString()}</div>
        `;

        if (isError) {
            panel.style.animation = 'errorFlash 0.5s';
            setTimeout(() => panel.style.animation = '', 500);
        }
    }

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes errorFlash {
            0% { background: rgba(255,68,68,0.3); }
            50% { background: rgba(255,68,68,0.6); }
            100% { background: rgba(0,0,0,0.8); }
        }
    `;
    document.head.appendChild(style);

    // 元素高亮函数
    function highlightElement(element) {
        if (!element || !config.debugHighlight) return;
        element.style.transition = 'all 0.3s';
        element.style.boxShadow = '0 0 0 2px rgba(255,0,0,0.5)';
        setTimeout(() => element.style.boxShadow = '', 1000);
    }

    // 元素查找逻辑
    const elementSelectors = {
        loginButton: {
            text: ['短信登录', '手机登录'],
            type: 'button'
        },
        phoneInput: {
            placeholder: ['手机号码', '请输入手机号'],
            type: 'input'
        },
        verifyButton: {
            text: ['获取验证码'],
            type: 'button'
        }
    };

    function findMobileElement(targetType) {
        const specs = elementSelectors[targetType];
        const elements = Array.from(document.querySelectorAll(specs.type === 'button' ? 'button' : 'input'));
        
        return elements.find(element => {
            if (specs.type === 'button') {
                const span = element.querySelector('span');
                return span && specs.text.some(t => span.textContent.includes(t));
            }
            return specs.placeholder.some(p => 
                element.placeholder.includes(p) && 
                element.type === 'text'
            );
        });
    }

    // 流程控制
    async function executeFlow() {
        try {
            // 步骤1：点击登录按钮
            updateStatus('正在查找登录按钮...');
            const loginBtn = await waitForElement('loginButton');
            updateStatus('正在点击登录按钮');
            triggerMobileClick(loginBtn);

            // 步骤2：输入手机号
            updateStatus('正在查找手机输入框...');
            const phoneInput = await waitForElement('phoneInput');
            updateStatus('正在输入手机号');
            setInputValue(phoneInput, config.phoneNumber);

            // 步骤3：获取验证码
            await wait(1500);
            updateStatus('正在查找验证码按钮...');
            const verifyBtn = await waitForElement('verifyButton');
            updateStatus('正在获取验证码');
            triggerMobileClick(verifyBtn);

            updateStatus('流程完成', true);
            isTaskCompleted = true;
        } catch (error) {
            updateStatus(`错误: ${error.message}`, true);
            console.error(error);
            if (!isTaskCompleted) {
                await wait(3000);
                executeFlow();
            }
        }
    }

    // 辅助函数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(elementType) {
        const startTime = Date.now();
        
        return new Promise((resolve, reject) => {
            function check() {
                const element = findMobileElement(elementType);
                if (element) {
                    highlightElement(element);
                    resolve(element);
                } else if (Date.now() - startTime > config.maxRetry * config.retryInterval) {
                    reject(new Error(`${elementType} 元素未找到`));
                } else {
                    setTimeout(check, config.retryInterval);
                }
            }
            check();
        });
    }

    function triggerMobileClick(element) {
        if (!element) return;
        element.scrollIntoView({behavior: 'smooth', block: 'center'});
        
        if (config.useTouchEvents) {
            element.dispatchEvent(new TouchEvent('touchstart', {bubbles: true}));
            element.dispatchEvent(new TouchEvent('touchend', {bubbles: true}));
        } else {
            element.click();
        }
    }

    function setInputValue(element, value) {
        element.value = '';
        element.dispatchEvent(new Event('input'));
        element.focus();
        setTimeout(() => {
            element.value = value;
            element.dispatchEvent(new Event('change'));
        }, 300);
    }

    // 启动脚本
    setTimeout(() => {
        createStatusPanel();
        executeFlow();
        setInterval(() => {
            if (!isTaskCompleted) {
                updateStatus(`运行中... ${currentStep}`);
            }
        }, 2000);
    }, config.delayBeforeStart);
})();