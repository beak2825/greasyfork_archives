// ==UserScript==
// @name         南昌大学深澜校园网自动登录-NCUConnect Pro
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  自动登录深澜校园网认证系统（记住账号密码和网络类型）
// @author       榛铭
// @license      MIT
// @match        http://222.204.3.154/*
// @match        http://222.204.3.154/srun_portal*
// @match        http://222.204.3.154/srun_portal_success*
// @match        http://222.204.3.154/srun_portal_pc*
// @match        http://222.204.3.154/index_*.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518470/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%B7%B1%E6%BE%9C%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-NCUConnect%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/518470/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%B7%B1%E6%BE%9C%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-NCUConnect%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .auto-login-btn {
            position: fixed;
            top: 10px;
            z-index: 9999;
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .auto-login-btn:hover {
            background-color: #45a049;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transform: translateY(-1px);
        }
        .auto-login-btn.clear {
            background-color: #f44336;
        }
        .auto-login-btn.clear:hover {
            background-color: #d32f2f;
        }
        .network-type {
            position: fixed;
            top: 60px;
            right: 10px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        }
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 4px;
            color: white;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: opacity 0.5s ease;
        }
    `);

    const NETWORK_TYPES = {
        'mobile': '@cmcc',
        'campus': '@ncu',
        'telecom': '@ndcard',
        'unicom': '@unicom'
    };

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    function setLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.originalText = button.textContent;
            button.textContent = '处理中...';
            button.style.opacity = '0.7';
        } else {
            button.disabled = false;
            button.textContent = button.originalText;
            button.style.opacity = '1';
        }
    }

    async function selectNetworkType() {
        const savedType = GM_getValue('networkType', 'telecom');
        const domainSelect = await waitForElement('#domain');
        
        if (domainSelect) {
            const value = NETWORK_TYPES[savedType];
            if (value) {
                domainSelect.value = value;
                domainSelect.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
        }
        return false;
    }

    function createNetworkTypeUI() {
        const div = document.createElement('div');
        div.className = 'network-type';
        
        const types = [
            ['mobile', '移动'],
            ['campus', '校园网'],
            ['telecom', '电信'],
            ['unicom', '联通']
        ];
        
        div.innerHTML = `
            <h4 style="margin:0 0 10px">选择默认网络:</h4>
            ${types.map(([value, text]) => `
                <label style="display:block;margin:8px 0;cursor:pointer">
                    <input type="radio" name="networkType" value="${value}" 
                           ${GM_getValue('networkType', 'telecom') === value ? 'checked' : ''}>
                    ${text}
                </label>
            `).join('')}
        `;
        
        div.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                GM_setValue('networkType', e.target.value);
                div.style.opacity = '0';
                setTimeout(() => div.remove(), 300);
                selectNetworkType();
                showNotification('网络类型已保存');
            }
        });
        
        return div;
    }

    function waitForElement(selector, timeout = 5000, retries = 3) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const startTime = Date.now();
            
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }
                
                if (Date.now() - startTime >= timeout) {
                    attempts++;
                    if (attempts >= retries) {
                        reject(new Error(`等待元素 ${selector} 超时`));
                        return;
                    }
                    setTimeout(checkElement, 1000); // 等待1秒后重试
                    return;
                }
                
                requestAnimationFrame(checkElement);
            };
            
            checkElement();
        });
    }

    async function handleCaptcha() {
        try {
            const captchaInput = await waitForElement('#captcha');
            const captchaImg = await waitForElement('#captchaImg');
            
            if (captchaInput && captchaImg) {
                // 等待用户手动输入验证码
                return new Promise(resolve => {
                    captchaInput.addEventListener('input', () => {
                        if (captchaInput.value.length >= 4) {
                            resolve(true);
                        }
                    });
                });
            }
        } catch (error) {
            console.error('获取验证码元素失败:', error);
            return false;
        }
    }

    function clearSettings() {
        if (confirm('确定要清除所有保存的设置吗？\n这将包括：\n- 登录信息\n- 网络类型选择')) {
            GM_setValue('credentials', '');
            GM_setValue('networkType', '');
            showNotification('所有设置已清除');
            setTimeout(() => location.reload(), 1000);
        }
    }

    if (location.href.includes('srun_portal_success')) {
        if (GM_getValue('credentials')) {
            const clearBtn = document.createElement('button');
            clearBtn.textContent = '清除设置';
            clearBtn.className = 'auto-login-btn clear';
            clearBtn.style.right = '10px';
            clearBtn.onclick = () => {
                clearSettings();
                location.href = '/';
            };
            document.body.appendChild(clearBtn);
        }
        return;
    }

    if (!GM_getValue('credentials')) {
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '保存登录信息';
        settingsBtn.className = 'auto-login-btn';
        settingsBtn.style.right = '10px';

        settingsBtn.onclick = async function() {
            setLoading(this, true);
            try {
                const [username, password] = await Promise.all([
                    waitForElement('#username'),
                    waitForElement('#password')
                ]);

                if (username && password && username.value && password.value) {
                    GM_setValue('credentials', btoa(JSON.stringify({
                        username: username.value,
                        password: password.value
                    })));
                    
                    const networkTypeUI = createNetworkTypeUI();
                    document.body.appendChild(networkTypeUI);
                    showNotification('登录信息已保存，请选择默认网络类型');
                } else {
                    showNotification('请先输入用户名和密码！', 'error');
                }
            } catch (error) {
                console.error('获取输入框失败:', error);
                showNotification('无法找到登录输入框，请确保在登录页面！', 'error');
            } finally {
                setLoading(this, false);
            }
        };
        
        document.body.appendChild(settingsBtn);
    } else {
        const credentials = JSON.parse(atob(GM_getValue('credentials')));

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清除设置';
        clearBtn.className = 'auto-login-btn clear';
        clearBtn.style.right = '150px';
        clearBtn.onclick = clearSettings;
        document.body.appendChild(clearBtn);

        window.addEventListener('load', async function() {
            try {
                const [username, password, loginButton] = await Promise.all([
                    waitForElement('#username'),
                    waitForElement('#password'),
                    waitForElement('#login-account')
                ]);

                if (username && password && loginButton) {
                    showNotification('正在自动登录...');
                    username.value = credentials.username;
                    password.value = credentials.password;

                    username.dispatchEvent(new Event('input', { bubbles: true }));
                    password.dispatchEvent(new Event('input', { bubbles: true }));

                    await selectNetworkType();
                    
                    // 点击登录按钮
                    setTimeout(() => {
                        loginButton.click();
                        
                        // 监听登录状态
                        const checkLoginSuccess = setInterval(() => {
                            if (location.href.includes('srun_portal_success')) {
                                clearInterval(checkLoginSuccess);
                                showNotification('登录成功，即将关闭页面...');
                                setTimeout(() => window.close(), 1500);
                            }
                        }, 100);
                        
                        setTimeout(() => clearInterval(checkLoginSuccess), 5000);
                    }, 800);
                }
            } catch (error) {
                console.error('自动登录失败:', error);
                showNotification('自动登录失败，请手动登录或刷新页面重试', 'error');
            }
        });
    }
})();