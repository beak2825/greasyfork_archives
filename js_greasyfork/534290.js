// ==UserScript==
// @name         浙师校园网自动连
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  每次重连很麻烦？自动登录浙江师范大学校园网！（使用前请再脚本下拉菜单配置）
// @author       邩星
// @match        http://10.63.63.63/*
// @match        http://10.63.63.63:80/*
// @match        http://10.63.63.63:801/*
// @match        http://10.63.100.103/*
// @match        http://10.63.100.103:80/*
// @match        http://10.63.100.103:801/*
// @match        http://www.msftconnecttest.com/redirect*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/534290/%E6%B5%99%E5%B8%88%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/534290/%E6%B5%99%E5%B8%88%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置账号和密码
    const defaultConfig = {
        username: '521314', // 替换为你的学号
        password: '114514', // 替换为你的密码
        operatorType: '@cmcc', // 校园网类型：空为校园网络，@cmcc为移动，@telecom为电信，@unicom为联通
        autoReconnect: true, // 是否启用自动重连
        reconnectInterval: 30 // 自动重连检测间隔（秒）
    };

    let config = GM_getValue('config', defaultConfig);

    GM_registerMenuCommand('配置自动登录信息', configureSettings);
    
    function setInputValue(input, value) {
        if (!input) return false;

        input.value = value;
        
        let event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
        
        event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
        
        try {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, value);
        } catch (e) {
            console.error("无法使用属性设置器设置值:", e);
        }
        
        return true;
    }

    function configureSettings() {
        const newUsername = prompt('请输入学号:', config.username);
        if (newUsername === null) return;
        
        const newPassword = prompt('请输入密码:', config.password);
        if (newPassword === null) return;
        
        const operatorOptions = {
            '校园网': '',
            '移动': '@cmcc',
            '电信': '@telecom',
            '联通': '@unicom'
        };
        
        let operatorMessage = '请选择运营商 (输入序号):\n';
        let index = 1;
        const operatorMap = {};
        
        for (const [name, value] of Object.entries(operatorOptions)) {
            operatorMessage += `${index}. ${name}\n`;
            operatorMap[index] = value;
            index++;
        }
        
        const operatorChoice = prompt(operatorMessage, '1');
        if (operatorChoice === null) return;
        
        const newOperatorType = operatorMap[operatorChoice] || '';
        
        const autoReconnectChoice = confirm('是否启用自动重连功能?');
        
        let reconnectInterval = config.reconnectInterval;
        if (autoReconnectChoice) {
            const newInterval = prompt('自动重连检测间隔（秒）:', config.reconnectInterval);
            if (newInterval !== null && !isNaN(newInterval) && newInterval > 0) {
                reconnectInterval = parseInt(newInterval);
            }
        }
        
        config = {
            username: newUsername,
            password: newPassword,
            operatorType: newOperatorType,
            autoReconnect: autoReconnectChoice,
            reconnectInterval: reconnectInterval
        };
        
        GM_setValue('config', config);
        alert('配置已保存!');

        if (isLoginPage()) {
            autoLogin();
        }
    }

    function isLoginPage() {
        return document.querySelector('input[name="DDDDD"]') !== null || 
               document.querySelector('input[name="username"]') !== null;
    }

    function isLoggedIn() {
        return !isLoginPage() && document.title !== "上网登录页";
    }

    function setupAutoReconnect() {
        if (!config.autoReconnect) return;
        
        console.log(`设置自动重连检测，间隔${config.reconnectInterval}秒`);
        
        setInterval(function() {
            const testFrame = document.createElement('iframe');
            testFrame.style.display = 'none';
            testFrame.src = 'http://www.msftconnecttest.com/redirect';
            
            document.body.appendChild(testFrame);
            
            setTimeout(function() {
                try {
                    document.body.removeChild(testFrame);
                    
                    if (isLoginPage() || 
                        (testFrame.contentWindow && testFrame.contentWindow.location && 
                         testFrame.contentWindow.location.href.includes('10.63.63.63'))) {
                        console.log('检测到网络已断开，尝试重新登录');
                        window.location.href = 'http://10.63.63.63';
                    } else {
                        console.log('网络连接正常');
                    }
                } catch (e) {
                    console.error('自动重连检测错误:', e);
                    window.location.href = 'http://10.63.63.63';
                }
            }, 5000);
        }, config.reconnectInterval * 1000);
    }

    function findInputElements() {
        const usernameSelectors = [
            'input[name="DDDDD"]',
            'input[name="username"]',
            'input[placeholder*="学号"]',
            'input[placeholder*="账号"]',
            'input[type="text"]'
        ];
        
        const passwordSelectors = [
            'input[name="upass"]',
            'input[name="password"]',
            'input[placeholder*="密码"]',
            'input[type="password"]'
        ];
        
        const formSelectors = [
            'form[name="f3"]',
            'form[name="f0"]',
            'form'
        ];
        
        let usernameInput = null;
        for (const selector of usernameSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element.offsetHeight > 0 && element.offsetWidth > 0) {
                    usernameInput = element;
                    break;
                }
            }
            if (usernameInput) break;
        }
        
        let passwordInput = null;
        for (const selector of passwordSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element.offsetHeight > 0 && element.offsetWidth > 0) {
                    passwordInput = element;
                    break;
                }
            }
            if (passwordInput) break;
        }
        
        let loginForm = null;
        for (const selector of formSelectors) {
            const form = document.querySelector(selector);
            if (form && form.offsetHeight > 0 && form.offsetWidth > 0) {
                loginForm = form;
                break;
            }
        }
        
        return { usernameInput, passwordInput, loginForm };
    }

    // 查找可能的登录按钮
    function findLoginButtons() {
        const buttonSelectors = [
            'input[value="登录"]',
            'input[name="0MKKey"]',
            'button[name="authentication"]',
            'button:contains("登录")',
            'input[type="submit"]',
            'button[type="submit"]'
        ];
        
        let loginButtons = [];
        
        for (const selector of buttonSelectors) {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element.offsetHeight > 0 && element.offsetWidth > 0) {
                        loginButtons.push(element);
                    }
                });
            } catch (e) {
                console.error(`选择器 ${selector} 错误:`, e);
            }
        }
        
        document.querySelectorAll('button, input[type="button"], a').forEach(element => {
            if ((element.textContent && element.textContent.includes('登录')) || 
                (element.value && element.value.includes('登录'))) {
                if (element.offsetHeight > 0 && element.offsetWidth > 0) {
                    loginButtons.push(element);
                }
            }
        });
        
        return loginButtons;
    }
    function hasOperatorSelect() {
        return document.querySelector('select[name="ISP_select"]') !== null;
    }

    function autoLogin() {
        console.log('开始自动登录过程');
        
        let attempts = 0;
        const maxAttempts = 5;
        
        function attemptLogin() {
            attempts++;
            console.log(`登录尝试 ${attempts}/${maxAttempts}`);
            
            const { usernameInput, passwordInput, loginForm } = findInputElements();
            const operatorSelectExists = hasOperatorSelect();
            
            console.log('登录页分析结果:', { 
                hasOperatorSelect: operatorSelectExists,
                operatorType: config.operatorType 
            });
            
            if (operatorSelectExists) {
                const operatorSelect = document.querySelector('select[name="ISP_select"]');
                try {
                    for (let i = 0; i < operatorSelect.options.length; i++) {
                        if (operatorSelect.options[i].value === config.operatorType) {
                            operatorSelect.selectedIndex = i;
                            
                            const event = new Event('change', { bubbles: true });
                            operatorSelect.dispatchEvent(event);
                            console.log('已通过下拉菜单选择运营商:', config.operatorType);
                            break;
                        }
                    }
                } catch (e) {
                    console.error('设置运营商错误:', e);
                }
            }
            
            let usernameSet = false;
            let passwordSet = false;
            
            if (usernameInput) {
                usernameSet = setInputValue(usernameInput, config.username);
                console.log('用户名设置成功:', usernameSet, '值:', config.username);
            } else {
                console.error('未找到用户名输入框');
            }
            
            if (passwordInput) {
                passwordSet = setInputValue(passwordInput, config.password);
                console.log('密码设置成功:', passwordSet);
            } else {
                console.error('未找到密码输入框');
            }
            
            if (usernameSet && passwordSet) {
                console.log('用户名和密码已填写，尝试登录');
                
                setTimeout(function() {
                    const loginButtons = findLoginButtons();
                    
                    let buttonClicked = false;
                    for (const button of loginButtons) {
                        try {
                            console.log('找到登录按钮，点击登录');
                            button.click();
                            buttonClicked = true;
                            break;
                        } catch (e) {
                            console.error('点击按钮错误:', e);
                        }
                    }
                    
                    if (!buttonClicked && loginForm) {
                        console.log('未找到登录按钮或点击失败，尝试直接提交表单');
                        try {
                            loginForm.submit();
                        } catch (e) {
                            console.error('提交表单错误:', e);
                        }
                    }
                }, 500); 
                return true;
            }
            
            return false;
        }
        
        const success = attemptLogin();
        
        if (!success && attempts < maxAttempts) {
            const interval = setInterval(function() {
                const success = attemptLogin();
                
                if (success || attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            }, 1000); 
        }
    }

    function main() {
        if (!GM_getValue('configured')) {
            configureSettings();
            GM_setValue('configured', true);
            return;
        }
        
        console.log('自动登录脚本已加载');
        
        if (isLoginPage()) {
            setTimeout(autoLogin, 1500);
        } else {
            setupAutoReconnect();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        setTimeout(main, 1000);
    }
})(); 