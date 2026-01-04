// ==UserScript==
// @name         E站里站授权登录
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  检测Exhentai是否为白屏，支持官网授权登录和手动停止刷新
// @author       牛子哥
// @match        https://exhentai.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      api.ipdata.co
// @connect      api.github.com
// @connect      github.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520315/E%E7%AB%99%E9%87%8C%E7%AB%99%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520315/E%E7%AB%99%E9%87%8C%E7%AB%99%E6%8E%88%E6%9D%83%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_SETTINGS = {
        refreshIntervalMs: 5000,
        maxRetries: 3,
        retryDelay: 2000,
        backgroundImage: 'https://img.lansonsam.com/wallhaven-5gvpg7_1920x1080.png',
        apiKey: '',
        buttonColor: 'rgba(128, 128, 128, 0.75)',
        githubClientId: '',
        githubClientSecret: ''
    };

    function getSettings() {
        const savedSettings = localStorage.getItem('exhentai_settings');
        return savedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) } : DEFAULT_SETTINGS;
    }

    function saveSettings(settings) {
        localStorage.setItem('exhentai_settings', JSON.stringify(settings));
    }

    let refreshInterval;
    let refreshUI;
    let countdown;
    const refreshIntervalMs = 5000; // 刷新间隔，毫秒

    const styles = `
                        html, body {
                            background-image: url('https://img.lansonsam.com/wallhaven-5gvpg7_1920x1080.png');
                        }

                        .exh-ui {
                            font-family: inherit;
                            color: #333;
                        }

                        .exh-container {
                            background-color: rgba(255, 255, 255, 0.3);
                            backdrop-filter: blur(10px);
                            -webkit-backdrop-filter: blur(10px);
                            border-radius: 20px;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                            padding: 40px;
                            max-width: 400px;
                            margin: auto;
                        }

                        .exh-title {
                            color: rgba(0, 0, 0, 0.8);
                            font-size: 36px;
                            font-weight: 600;
                            margin-bottom: 40px;
                            text-align: center;
                        }

                        .exh-button {
                            background-color: ${getSettings().buttonColor};
                            color: white;
                            border: none;
                            padding: 16px 32px;
                            margin: 15px 0;
                            border-radius: 15px;
                            font-size: 20px;
                            font-weight: 500;
                            cursor: pointer;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: transform 0.3s ease;
                        }

                        .exh-button:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                        }

                        .exh-input {
                            background-color: rgba(255, 255, 255, 0.5);
                            width: 100%;
                            padding: 16px;
                            margin-bottom: 20px;
                            border: 1px solid rgba(229, 229, 234, 0.7);
                            border-radius: 15px;
                            font-size: 18px;
                        }

                        .exh-input:focus {
                            outline: none;
                            border-color: rgba(128, 128, 128, 0.75);
                        }

                        .exh-label {
                            display: block;
                            margin-bottom: 8px;
                            color: #333;
                            font-size: 14px;
                        }

                        .exh-progress-container {
                            background: rgba(200, 200, 200, 0.3);
                            border-radius: 2px;
                            height: 4px;
                            overflow: hidden;
                            margin: 2px 0;
                            position: relative;
                        }

                        .exh-progress-bar {
                            height: 100%;
                            background: #007AFF;
                            transition: width 0.1s linear;
                        }

                        .color-picker-wrapper {
                            position: relative;
                            width: 100%;
                            margin-bottom: 15px;
                        }

                        .color-picker-wrapper input[type="color"] {
                            position: absolute;
                            right: 10px;
                            top: 50%;
                            transform: translateY(-50%);
                            width: 30px;
                            height: 30px;
                            border: none;
                            border-radius: 4px;
                            background: none;
                            cursor: pointer;
                        }

                        .color-picker-wrapper input[type="color"]::-webkit-color-swatch-wrapper {
                            padding: 0;
                        }

                        .color-picker-wrapper input[type="color"]::-webkit-color-swatch {
                            border: none;
                            border-radius: 4px;
                        }

                        .color-preview {
                            width: 100%;
                            height: 40px;
                            border-radius: 8px;
                            margin-top: 10px;
                            transition: all 0.3s ease;
                        }

                        #countdown {
                            font-size: 24px;
                            font-weight: 600;
                            margin: 20px 0;
                            text-align: center;
                            color: #333;
                        }

                        .float-button {
                            position: fixed;
                            right: 20px;
                            bottom: 20px;
                            width: 60px;
                            height: 60px;
                            border-radius: 30px;
                            background-color: rgba(128, 128, 128, 0.75);
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 10000;
                            color: white;
                            font-size: 14px;
                            flex-direction: column;
                        }

                        .float-button:hover {
                            background-color: rgba(100, 100, 100, 0.75);
                        }
                    `;

    function addStyles() {
        const settings = getSettings();
        const styleElement = document.createElement('style');

        // 检查是否已登录（通过检查必要的 cookie）
        const isLoggedIn = document.cookie.includes('ipb_member_id') &&
            document.cookie.includes('ipb_pass_hash') &&
            document.cookie.includes('igneous');

        // 只有在未登录时才添加背景图片
        styleElement.textContent = `
                            html, body {
                                ${!isLoggedIn ? `background-image: url('${settings.backgroundImage}');` : ''}
                            }
                            ${styles} /* 其他样式保持不变 */
                        `;
        document.head.appendChild(styleElement);
    }

    let retryCount = 0;

    function checkNetwork() {
        return navigator.onLine;
    }

    async function checkIP() {
        const settings = getSettings();
        if (!settings.apiKey) {
            console.log('未设置 API key');
            return null;
        }

        try {
            const response = await fetch(`https://api.ipdata.co/?api-key=${settings.apiKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('IP 检测失败:', error);
            return null;
        }
    }

    async function checkPageWithRetry() {
        if (!checkNetwork()) {
            showNetworkError();
            return;
        }

        const settings = getSettings();
        try {
            const response = await fetch(window.location.href);
            const data = await response.text();

            if (data.trim() === '' || document.body.innerHTML.trim() === '') {
                showLoginUI();
            } else {
                console.log('页面正常加载');
                retryCount = 0;

                // 只移除背景图片，不设置背景颜色
                document.body.style.backgroundImage = 'none';

                // 移除已存在的悬浮按钮（如有）
                const existingButton = document.querySelector('.float-button');
                if (existingButton) {
                    existingButton.remove();
                }
                // 延迟1创建按钮
                setTimeout(() => createFloatButton(), 1000);
            }
        } catch (error) {
            console.error('请求失败:', error);
            if (retryCount < settings.maxRetries) {
                retryCount++;
                showRetryMessage(retryCount, settings.maxRetries);
                setTimeout(() => checkPageWithRetry(), settings.retryDelay);
            } else {
                showLoginUI();
                retryCount = 0;
            }
        }
    }

    function showNetworkError() {
        const errorUI = document.createElement('div');
        errorUI.className = 'exh-ui';
        errorUI.innerHTML = `
                                <div class="exh-container" style="
                                    background: rgba(244, 67, 54, 0.1);
                                    border: 1px solid rgba(244, 67, 54, 0.3);
                                    max-width: 400px;
                                    text-align: center;
                                    padding: 30px;
                                ">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F44336" stroke-width="2" style="margin-bottom: 20px;">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12" y2="17"></line>
                                    </svg>
                                    <h2 class="exh-title" style="color: #F44336; margin-bottom: 15px;">网络错误</h2>
                                    <p style="color: #666; margin-bottom: 20px;">请检查您的网络连接</p>
                                    <button class="exh-button" id="retryConnection" style="
                                        background: linear-gradient(45deg, #F44336, #FF5252);
                                        border: none;
                                        width: 100%;
                                    ">重试连接</button>
                                </div>
                            `;

        document.body.appendChild(errorUI);

        document.getElementById('retryConnection').onclick = () => {
            document.body.removeChild(errorUI);
            checkPageWithRetry();
        };
    }

    function showRetryMessage(current, max) {
        const retryUI = document.createElement('div');
        retryUI.className = 'exh-ui';
        retryUI.innerHTML = `
                                <div class="exh-container">
                                    <h2 class="exh-title">正在重试</h2>
                                    <p>第 ${current}/${max} 次重���</p>
                                    <div class="exh-progress-container">
                                        <div class="exh-progress-bar" style="width: ${(current / max) * 100}%"></div>
                                    </div>
                                </div>
                            `;

        document.body.appendChild(retryUI);

        setTimeout(() => {
            document.body.removeChild(retryUI);
        }, 2000);
    }

    function showLoginUI() {
        let loginUI = document.createElement('div');
        loginUI.className = 'exh-ui';
        loginUI.style.position = 'fixed';
        loginUI.style.top = '0';
        loginUI.style.width = '100%';
        loginUI.style.height = '100%';
        loginUI.style.zIndex = '9999';
        loginUI.style.display = 'flex';
        loginUI.style.alignItems = 'center';
        loginUI.style.justifyContent = 'center';

        loginUI.innerHTML = `
                                <div class="exh-container">
                                    <h1 class="exh-title">Exhentai 登录</h1>
                                    <button class="exh-button" id="cookieLogin" style="background-color: ${getSettings().buttonColor}">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                                            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM11 6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10C9 10.5523 9.44772 11 10 11C10.5523 11 11 10.5523 11 10V6ZM10 15C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13C10.5523 13 11 13.4477 11 14C11 14.5523 10.5523 15 10 15Z" fill="white"/>
                                        </svg>
                                        Cookie 登录
                                    </button>
                                    <button class="exh-button" id="authorizeLogin" style="
                                        background-color: ${getSettings().buttonColor};
                                        position: relative;
                                        z-index: 1000;
                                        pointer-events: auto;
                                    ">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                                            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM13.7071 8.70711C14.0976 8.31658 14.0976 7.68342 13.7071 7.29289C13.3166 6.90237 12.6834 6.90237 12.2929 7.29289L9 10.5858L7.70711 9.29289C7.31658 8.90237 6.68342 8.90237 6.29289 9.29289C5.90237 9.68342 5.90237 10.3166 6.29289 10.7071L8.29289 12.7071C8.68342 13.0976 9.31658 13.0976 9.70711 12.7071L13.7071 8.70711Z" fill="white"/>
                                        </svg>
                                        官网授权登录
                                    </button>
                                    <button class="exh-button" id="showSettings" style="background-color: ${getSettings().buttonColor}">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px;">
                                            <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" fill="white"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0z" fill="white"/>
                                        </svg>
                                        设置
                                    </button>
                                </div>
                            `;

        document.body.appendChild(loginUI);

        // 确保事件监听器被正确添加
        const cookieLoginBtn = document.getElementById('cookieLogin');
        const authorizeLoginBtn = document.getElementById('authorizeLogin');
        const showSettingsBtn = document.getElementById('showSettings');

        if (cookieLoginBtn) cookieLoginBtn.addEventListener('click', loginWithCookie);
        if (authorizeLoginBtn) authorizeLoginBtn.addEventListener('click', authorizeLogin);
        if (showSettingsBtn) showSettingsBtn.addEventListener('click', showSettingsUI);

        if (getCookie('shuaxin') === 'yes') {
            startRefreshing();
        }
    }

    function loginWithCookie() {
        clearSpecificCookie('yay');
        showInjectOptions();
    }

    function showInjectOptions() {
        // 移除登录界面
        const loginUI = document.querySelector('.exh-ui');
        if (loginUI) {
            loginUI.remove();
        }

        const injectUI = document.createElement('div');
        injectUI.className = 'exh-ui';
        injectUI.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 10001;
                        `;

        const settings = getSettings();  // 获取当前设置

        injectUI.innerHTML = `
                            <div class="exh-container" style="max-width: 400px; padding: 40px;">
                                <h2 class="exh-title" style="margin-bottom: 30px;">选择注入方式</h2>

                                <button class="exh-button" id="localInject" style="
                                    background-color: ${settings.buttonColor};
                                    border: none;
                                    margin-bottom: 15px;
                                    position: relative;
                                    overflow: hidden;
                                ">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                    </svg>
                                    本地注入
                                </button>

                                <button class="exh-button" id="githubInject" style="
                                    background-color: ${settings.buttonColor};
                                    border: none;
                                    margin-bottom: 15px;
                                    position: relative;
                                    overflow: hidden;
                                ">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                    GitHub 授权
                                    <span style="
                                        position: absolute;
                                        top: 0;
                                        right: 0;
                                        background: rgba(0,0,0,0.2);
                                        padding: 4px 8px;
                                        font-size: 12px;
                                        border-radius: 0 0 0 8px;
                                    ">开发中</span>
                                </button>

                                <button class="exh-button" id="backToLogin" style="
                                    background-color: ${settings.buttonColor};
                                    border: none;
                                ">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
                                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                                    </svg>
                                    返回
                                </button>
                            </div>
                        `;

        document.body.appendChild(injectUI);

        // 事件处理
        document.getElementById('localInject').onclick = () => {
            injectUI.remove();
            showCookieInput();
        };

        document.getElementById('githubInject').onclick = () => {
            authenticateWithGithub();
        };

        document.getElementById('backToLogin').onclick = () => {
            injectUI.remove();
            showLoginUI();
        };
    }

    function showGistSettings() {
        const settingsUI = document.createElement('div');
        settingsUI.className = 'exh-ui';
        settingsUI.style.cssText = `
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 400px;
                                z-index: 10002;
                            `;

        settingsUI.innerHTML = `
                                <div class="exh-container" style="padding: 30px;">
                                    <h2 class="exh-title" style="margin-bottom: 20px;">云盘接入设置</h2>

                                    <div class="setting-item" style="margin-bottom: 20px;">
                                        <label class="exh-label" for="gistToken">Gist Token</label>
                                        <input class="exh-input" type="text" id="gistToken" placeholder="输入您的 GitHub Gist Token">
                                        <a href="https://gist.github.com/" target="_blank" style="
                                            color: #2196F3;
                                            text-decoration: none;
                                            font-size: 14px;
                                            display: block;
                                            margin-top: 5px;
                                        ">
                                            获取 Gist Token
                                        </a>
                                    </div>

                                    <div style="display: flex; gap: 10px;">
                                        <button class="exh-button" id="saveGistSettings" style="
                                            flex: 1;
                                            background: linear-gradient(45deg, #4CAF50, #8BC34A);
                                            border: none;
                                        ">保存</button>
                                        <button class="exh-button" id="cancelGistSettings" style="
                                            flex: 1;
                                            background: linear-gradient(45deg, #9E9E9E, #607D8B);
                                            border: none;
                                        ">取消</button>
                                    </div>
                                </div>
                            `;

        document.body.appendChild(settingsUI);

        // 事件处理
        document.getElementById('saveGistSettings').onclick = () => {
            const token = document.getElementById('gistToken').value;
            if (!token) {
                showToast('请输入 Gist Token', 'warning');
                return;
            }
            // 保存 token 逻辑
            showToast('Gist Token 保存成功', 'success');
            settingsUI.remove();
            showInjectOptions();
        };

        document.getElementById('cancelGistSettings').onclick = () => {
            settingsUI.remove();
            showInjectOptions();
        };
    }

    function showCookieInput() {
        let cookieUI = document.createElement('div');
        cookieUI.className = 'exh-ui';
        cookieUI.style.cssText = `
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 100%;
                                height: 100%;
                                z-index: 10001;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            `;

        const settings = getSettings();  // 获取当前设置

        cookieUI.innerHTML = `
                            <div class="exh-container" style="max-width: 400px; padding: 40px;">
                                <h2 class="exh-title" style="margin-bottom: 30px;">输入 Cookie</h2>

                                <div class="setting-item">
                                    <label class="exh-label" for="igneous">igneous</label>
                                    <input class="exh-input" type="text" id="igneous" placeholder="输入 igneous">
                                </div>

                                <div class="setting-item">
                                    <label class="exh-label" for="ipb_member_id">ipb_member_id</label>
                                    <input class="exh-input" type="text" id="ipb_member_id" placeholder="输入 ipb_member_id">
                                </div>

                                <div class="setting-item">
                                    <label class="exh-label" for="ipb_pass_hash">ipb_pass_hash</label>
                                    <input class="exh-input" type="text" id="ipb_pass_hash" placeholder="输入 ipb_pass_hash">
                                </div>

                                <div style="display: flex; gap: 10px; margin-top: 20px;">
                                    <button class="exh-button" id="submitCookie" style="
                                        flex: 1;
                                        background-color: ${settings.buttonColor};
                                        border: none;
                                        padding: 12px;
                                        font-size: 15px;
                                    ">确认</button>
                                    <button class="exh-button" id="backToInject" style="
                                        flex: 1;
                                        background-color: ${settings.buttonColor};
                                        border: none;
                                        padding: 12px;
                                        font-size: 15px;
                                    ">返回</button>
                                </div>
                            </div>
                        `;

        document.body.appendChild(cookieUI);

        // 事件处理
        document.getElementById('submitCookie').onclick = () => {
            const igneous = document.getElementById('igneous').value;
            const memberId = document.getElementById('ipb_member_id').value;
            const passHash = document.getElementById('ipb_pass_hash').value;

            if (!igneous || !memberId || !passHash) {
                showToast('请填写所有必要的 Cookie 值', 'warning');
                return;
            }

            setCookie('igneous', igneous, 365);
            setCookie('ipb_member_id', memberId, 365);
            setCookie('ipb_pass_hash', passHash, 365);
            setCookie('shuaxin', 'yes', 1);

            // 只移除背景图���
            document.body.style.backgroundImage = 'none';

            showToast('Cookie 设置成功', 'success');
            cookieUI.remove();

            // 启动刷新逻辑，替代直接刷新页面
            startRefreshing();
        };

        document.getElementById('backToInject').onclick = () => {
            cookieUI.remove();
            showInjectOptions();
        };
    }

    // 修改 authorizeLogin 函数
    function authorizeLogin() {
        // 使用 E-Hentai 官方登录接口
        const loginUrl = 'https://forums.e-hentai.org/index.php?act=Login&CODE=01';

        // 打开登录窗口
        let loginWindow = window.open(loginUrl, 'loginWindow', 'width=800,height=600');

        // 检查登录状态
        let checkLoginInterval = setInterval(() => {
            try {
                // 如果窗口关闭了
                if (loginWindow.closed) {
                    clearInterval(checkLoginInterval);

                    // 检查 cookie 是否设置成功
                    const memberId = getCookie('ipb_member_id');
                    const passHash = getCookie('ipb_pass_hash');
                    const igneous = getCookie('igneous');

                    if (memberId && passHash) {
                        // 登录成功
                        setCookie('shuaxin', 'yes', 1);
                        showToast('登录成功！', 'success');

                        // 移除背景图片
                        document.body.style.backgroundImage = 'none';

                        // 移除登录UI
                        const loginUI = document.querySelector('.exh-ui');
                        if (loginUI) {
                            loginUI.remove();
                        }

                        // 启动刷新逻辑
                        startRefreshing();

                        // 延迟1秒创建浮动按钮
                        setTimeout(() => {
                            createFloatButton();
                        }, 1000);
                    } else {
                        // 登录失败或未完成
                        showToast('登录未完成，请重试', 'warning');
                    }
                }
            } catch (e) {
                // 如果出现跨域错误，继续检查
                console.log('等待登录完成...');
            }
        }, 1000);

        // 30秒后停止检查
        setTimeout(() => {
            clearInterval(checkLoginInterval);
        }, 30000);
    }

    function createRefreshUI() {
        if (refreshUI) {
            refreshUI.style.display = 'block';
            return;
        }

        refreshUI = document.createElement('div');
        refreshUI.className = 'exh-refresh-ui';
        refreshUI.style.cssText = `
                            position: fixed;
                            top: 10px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 180px;
                            z-index: 10000;
                            text-align: center;
                            background: rgba(255, 255, 255, 0.4);
                            padding: 6px 18px;
                            border-radius: 30px;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                            backdrop-filter: blur(10px);
                            -webkit-backdrop-filter: blur(10px);
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            cursor: pointer;
                        `;

        refreshUI.innerHTML = `
                            <div id="countdown" style="
                                font-size: 16px;
                                font-weight: 500;
                                color: rgba(0, 0, 0, 0.8);
                                margin-bottom: 4px;
                            "></div>

                            <div class="exh-progress-container" style="
                                background: rgba(255, 255, 255, 0.3);
                                height: 6px;
                                border-radius: 3px;
                                overflow: hidden;
                                margin: 2px 0;
                                position: relative;
                                top: -1px;
                            ">
                                <div id="progress" class="exh-progress-bar" style="
                                    height: 100%;
                                    background: rgba(0, 122, 255, 0.8);
                                    transition: width 0.1s linear;
                                "></div>
                            </div>
                        `;

        // 点击停止刷新
        refreshUI.onclick = () => {
            // 移除遮罩层
            const overlay = document.querySelector('div[style*="backdrop-filter: blur"]');
            if (overlay) {
                overlay.remove();
            }
            // 移除退出按钮
            const exitButton = document.querySelector('button.exh-button[style*="position: fixed"]');
            if (exitButton) {
                exitButton.remove();
            }
            stopRefreshing();
        };

        document.body.appendChild(refreshUI);
    }

    function startRefreshing() {
        const settings = getSettings();

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            backdrop-filter: blur(5px);
                            z-index: 9999;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        `;
        document.body.appendChild(overlay);

        // 创建进度条界面
        createRefreshUI();

        updateCountdown(settings.refreshIntervalMs);
        refreshInterval = setInterval(function () {
            clearSpecificCookie('yay');
            window.location.reload();
        }, settings.refreshIntervalMs);
    }

    function stopRefreshing() {
        clearInterval(refreshInterval);
        clearInterval(countdown);
        if (refreshUI) {
            refreshUI.remove();
            refreshUI = null;
        }
        // 除遮罩层
        const overlay = document.querySelector('div[style*="backdrop-filter: blur"]');
        if (overlay) {
            overlay.remove();
        }
        setCookie('shuaxin', 'no', 1);
    }

    function updateCountdown(intervalMs) {
        let countdownElement = document.getElementById('countdown');
        let progressElement = document.getElementById('progress');
        let startTime = Date.now();
        let endTime = startTime + intervalMs;

        countdownElement.innerText = Math.ceil(intervalMs / 1000) + '秒';
        progressElement.style.width = '0%';

        countdown = setInterval(function () {
            let now = Date.now();
            let timeLeft = Math.ceil((endTime - now) / 1000);
            let progress = ((now - startTime) / intervalMs) * 100;

            countdownElement.innerText = timeLeft + '秒';
            progressElement.style.width = progress + '%';

            if (timeLeft <= 0) {
                clearInterval(countdown);
                countdownElement.innerText = '刷新中';
                progressElement.style.width = '100%';
            }
        }, 100);
    }

    function clearSpecificCookie(cookieName) {
        document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.exhentai.org';
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function showSettingsUI() {
        if (document.querySelector('.settings-ui')) {
            showToast('设置界面已经打开', 'warning');
            return;
        }

        const settings = getSettings();
        let settingsUI = document.createElement('div');
        settingsUI.className = 'exh-ui settings-ui';
        settingsUI.style.cssText = `
                                position: fixed;
                                top: 50%;
                                left: 20px;
                                transform: translateY(-50%);
                                width: 400px;
                                max-height: 80vh;
                                z-index: 10002;
                            `;

        settingsUI.innerHTML = `
                                <div class="exh-container" style="
                                    position: relative;
                                    width: 100%;
                                    overflow-y: auto;
                                    overflow-x: hidden;
                                    padding: 30px;
                                    border-radius: 20px;
                                    scrollbar-width: thin;
                                    scrollbar-color: rgba(0, 122, 255, 0.5) rgba(255, 255, 255, 0.1);
                                    display: flex;
                                    flex-direction: column;
                                    max-height: 80vh;
                                ">
                                    <!-- 关闭按钮 -->
                                    <div style="
                                        position: absolute;
                                        top: 20px;  /* 调整关闭按钮位置 */
                                        right: 20px;
                                        padding: 8px;
                                        cursor: pointer;
                                        width: 30px;
                                        height: 30px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        background-color: rgba(255, 255, 255, 0.1);
                                        border-radius: 50%;
                                        transition: all 0.3s ease;
                                        z-index: 1;
                                    " id="closeSettings">
                                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </div>

                                    <h2 class="exh-title" style="margin: 10px 0 20px 0;">设置</h2>

                                    <!-- 设置内容区域 -->
                                    <div style="
                                        flex: 1;
                                        overflow-y: auto;
                                        padding-right: 10px;
                                        margin-bottom: 20px;
                                    ">
                                        <!-- 基本设置部分 -->
                                        <div class="settings-section" style="margin-bottom: 20px;">
                                            <h3 style="font-size: 16px; margin-bottom: 10px; color: rgba(0,0,0,0.7);">基本设置</h3>
                                            <div class="setting-item" style="margin-bottom: 15px;">
                                                <label class="exh-label" for="refreshInterval">刷新间隔 (秒)</label>
                                                <input class="exh-input" type="number" id="refreshInterval" value="${settings.refreshIntervalMs / 1000}" style="
                                                    background: rgba(255,255,255,0.7);
                                                    transition: all 0.3s ease;
                                                ">
                                            </div>
                                        </div>

                                        <!-- IP 检测部分 -->
                                        <div class="settings-section" style="margin-bottom: 20px;">
                                            <h3 style="font-size: 16px; margin-bottom: 10px; color: rgba(0,0,0,0.7);">IP 检测</h3>
                                            <button class="exh-button" id="checkIP" style="
                                                background-color: ${settings.buttonColor};
                                                border: none;
                                                margin-bottom: 15px;
                                            ">
                                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; fill: white; margin-right: 10px;">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
                                                </svg>
                                                检测前 IP
                                            </button>
                                        </div>

                                        <!-- 按钮颜色设置部分 -->
                                        <div class="settings-section" style="margin-bottom: 20px;">
                                            <h3 style="font-size: 16px; margin-bottom: 10px; color: rgba(0,0,0,0.7);">按钮颜色设置</h3>
                                            <div class="color-picker-wrapper">
                                                <label class="exh-label" for="buttonColor">按钮颜色</label>
                                                <input class="exh-input" type="text" id="buttonColor" value="${settings.buttonColor}" placeholder="例: rgba(128, 128, 128, 0.75)">
                                                <input type="color" id="buttonColorPicker"
                                                    value="${rgbaToHex(settings.buttonColor)}"
                                                    onchange="document.getElementById('buttonColor').value = hexToRgba(this.value, 0.75)">
                                            </div>
                                        </div>

                                        <!-- API 设置部分 -->
                                        <div class="settings-section" style="margin-bottom: 20px;">
                                            <h3 style="font-size: 16px; margin-bottom: 10px; color: rgba(0,0,0,0.7);">API 设置</h3>
                                            <div class="setting-item" style="margin-bottom: 10px;">
                                                <label class="exh-label" for="apiKey">IP 检测 API Key</label>
                                                <input class="exh-input" type="text" id="apiKey" value="${settings.apiKey}" placeholder="从 ipdata.co 获取 API key">
                                            </div>
                                            <a href="https://dashboard.ipdata.co/sign-up.html" target="_blank" style="
                                                color: #2196F3;
                                                text-decoration: none;
                                                font-size: 14px;
                                                display: block;
                                                margin-bottom: 15px;
                                            ">
                                                注册获取 API Key
                                            </a>
                                            <button class="exh-button" id="testApiKey" style="
                                                background-color: ${settings.buttonColor};
                                                border: none;
                                            ">测试 API Key</button>
                                        </div>

                                        <!-- GitHub 设置部分 -->
                                        <div class="settings-section" style="margin-bottom: 20px;">
                                            <h3 style="font-size: 16px; margin-bottom: 10px; color: rgba(0,0,0,0.7);">GitHub 设置</h3>
                                            <div class="setting-item" style="margin-bottom: 10px;">
                                                <label class="exh-label" for="githubClientId">Client ID</label>
                                                <input class="exh-input" type="text" id="githubClientId" value="${settings.githubClientId || ''}" placeholder="输入 GitHub OAuth App Client ID">
                                            </div>
                                            <div class="setting-item" style="margin-bottom: 10px;">
                                                <label class="exh-label" for="githubClientSecret">Client Secret</label>
                                                <input class="exh-input" type="password" id="githubClientSecret" value="${settings.githubClientSecret || ''}" placeholder="输入 GitHub OAuth App Client Secret">
                                            </div>
                                            <a href="https://github.com/settings/developers" target="_blank" style="
                                                color: #2196F3;
                                                text-decoration: none;
                                                font-size: 14px;
                                                display: block;
                                                margin-bottom: 15px;
                                            ">
                                                创建 GitHub OAuth App
                                            </a>
                                            <div style="
                                                background: rgba(255, 255, 255, 0.1);
                                                padding: 10px;
                                                border-radius: 8px;
                                                font-size: 12px;
                                                color: #666;
                                            ">
                                                <p style="margin: 0 0 8px 0;">OAuth App 设置说明：</p>
                                                <ul style="margin: 0; padding-left: 20px;">
                                                    <li>Homepage URL: ${window.location.origin}</li>
                                                    <li>Authorization callback URL: ${window.location.origin}/callback</li>
                                                    <li>需权限: gist (读写)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 底部按钮区域 -->
                                    <div style="
                                        padding-top: 20px;
                                        border-top: 1px solid rgba(255,255,255,0.1);
                                        margin-top: auto;  /* 自调整顶部边距 */
                                    ">
                                        <div style="display: flex; gap: 10px;">
                                            <button class="exh-button" id="saveSettings" style="
                                                flex: 1;
                                                background-color: ${settings.buttonColor};
                                                border: none;
                                                padding: 12px;
                                                font-size: 15px;
                                            ">保存</button>
                                            <button class="exh-button" id="cancelSettings" style="
                                                flex: 1;
                                                background-color: ${settings.buttonColor};
                                                border: none;
                                                padding: 12px;
                                                font-size: 15px;
                                            ">取消</button>
                                        </div>
                                    </div>
                                </div>
                            `;

        // 添加样式
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
                                .exh-container::-webkit-scrollbar {
                                    width: 8px;  /* 增加滚动条度 */
                                }
                                .exh-container::-webkit-scrollbar-track {
                                    background: rgba(255, 255, 255, 0.1);
                                    border-radius: 4px;
                                    margin: 10px 0;  /* 添加上下边距 */
                                }
                                .exh-container::-webkit-scrollbar-thumb {
                                    background: rgba(0, 122, 255, 0.3);  /* 降低不透明度 */
                                    border-radius: 4px;
                                    border: 2px solid transparent;  /* 边框 */
                                    background-clip: padding-box;  /* 使边框透明 */
                                }
                                .exh-container::-webkit-scrollbar-thumb:hover {
                                    background: rgba(0, 122, 255, 0.5);
                                    border: 2px solid transparent;
                                    background-clip: padding-box;
                                }
                                .settings-section {
                                    background: rgba(255, 255, 255, 0.05);
                                    border-radius: 15px;
                                    padding: 20px;
                                    margin-bottom: 20px;
                                }
                                .setting-item {
                                    margin-bottom: 15px;
                                }
                                .exh-button {
                                    transition: transform 0.3s ease;
                                }
                                .exh-button:hover {
                                    transform: translateY(-2px);
                                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                                }
                            `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(settingsUI);

        document.getElementById('closeSettings').onclick = () => {
            document.body.removeChild(settingsUI);
        };

        document.getElementById('checkIP').onclick = async () => {
            const existingIpInfo = document.querySelector('.ip-info-ui');
            if (existingIpInfo) {
                showToast('IP 信息界面已经打开', 'warning');
                return;
            }

            const button = document.getElementById('checkIP');
            const originalContent = button.innerHTML;

            button.innerHTML = `
                                    <div style="width: 20px; height: 20px; border: 2px solid white;
                                                border-top-color: transparent; border-radius: 50%;
                                                animation: spin 1s linear infinite;">
                                    </div>
                                    <span style="margin-left: 10px;">检测中...</span>
                                `;

            const ipData = await checkIP();
            button.innerHTML = originalContent;

            if (ipData) {
                showIPInfo(ipData);
            } else {
                showToast('获取 IP 信息失败，请检查 API Key 设置', 'error');
            }
        };

        document.getElementById('testApiKey').onclick = async () => {
            const apiKey = document.getElementById('apiKey').value;
            if (!apiKey) {
                showToast('请先输入 API Key', 'warning');
                return;
            }

            const testSettings = { ...getSettings(), apiKey };
            saveSettings(testSettings);

            const ipData = await checkIP();
            if (ipData && ipData.ip) {
                showToast(`API Key 有效! IP: ${ipData.ip}`, 'success');
            } else {
                showToast('API Key 无效或请求失败，请检查 API Key 是否正确', 'error');
            }
        };

        document.getElementById('saveSettings').onclick = () => {
            const newSettings = {
                refreshIntervalMs: parseInt(document.getElementById('refreshInterval').value) * 1000,
                apiKey: document.getElementById('apiKey').value,
                buttonColor: document.getElementById('buttonColor').value,
                backgroundImage: settings.backgroundImage,
                githubClientId: document.getElementById('githubClientId').value,
                githubClientSecret: document.getElementById('githubClientSecret').value,
                // 保持默认值
                maxRetries: DEFAULT_SETTINGS.maxRetries,
                retryDelay: DEFAULT_SETTINGS.retryDelay
            };

            // 验证数值的有效性
            if (isNaN(newSettings.refreshIntervalMs)) {
                showToast('请输入有效的数字', 'error');
                return;
            }

            saveSettings(newSettings);

            // 更新 GitHub 配置
            GITHUB_CONFIG.clientId = newSettings.githubClientId;

            if (document.body.contains(settingsUI)) {
                document.body.removeChild(settingsUI);
            }

            if (refreshInterval) {
                clearInterval(refreshInterval);
                clearInterval(countdown);
            }

            addStyles();
            if (getCookie('shuaxin') === 'yes') {
                startRefreshing();
            }

            showToast('设置已保存', 'success');
        };

        document.getElementById('cancelSettings').onclick = () => {
            document.body.removeChild(settingsUI);
        };

        // 修改按钮颜色输入和预览的事件处理
        const buttonColorInput = document.getElementById('buttonColor');
        const buttonColorPicker = document.getElementById('buttonColorPicker');

        // 实时更新所有按钮的颜色
        function updateAllButtonColors(color) {
            document.querySelectorAll('.exh-button').forEach(button => {
                const buttonStyle = window.getComputedStyle(button);
                if (!buttonStyle.background.includes('gradient')) {
                    button.style.backgroundColor = color;
                }
            });

            const floatButton = document.querySelector('.float-button');
            if (floatButton) {
                floatButton.style.backgroundColor = color;
            }
        }

        buttonColorInput.oninput = (e) => {
            const newColor = e.target.value;
            updateAllButtonColors(newColor);
            buttonColorPicker.value = rgbaToHex(newColor);
        };

        buttonColorPicker.onchange = (e) => {
            const newColor = hexToRgba(e.target.value, 0.75);
            buttonColorInput.value = newColor;
            updateAllButtonColors(newColor);
        };
    }

    function showIPInfo(ipData) {
        const ipInfoUI = document.createElement('div');
        ipInfoUI.className = 'exh-ui ip-info-ui';
        ipInfoUI.style.cssText = `
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            z-index: 10003;
                            width: auto;
                            max-width: 400px;
                        `;

        ipInfoUI.innerHTML = `
                            <div class="exh-container" style="
                                padding: 25px;
                                background: rgba(255, 255, 255, 0.95);
                                color: #333;
                            ">
                                <div style="margin-bottom: 25px;">
                                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #666;">IP 信息</h3>
                                    <div style="
                                        display: flex;
                                        align-items: center;
                                        margin-bottom: 15px;
                                        background: rgba(0,0,0,0.03);
                                        padding: 10px;
                                        border-radius: 8px;
                                    ">
                                        <span style="font-size: 20px; font-weight: 500;">${ipData.ip}</span>
                                    </div>
                                    <div style="display: flex; align-items: center;">
                                        <img src="${ipData.flag}" alt="${ipData.country_code}" style="width: 24px; margin-right: 10px;">
                                        <span style="font-size: 16px;">${ipData.country_name}</span>
                                    </div>
                                </div>

                                <div style="margin-bottom: 25px;">
                                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #666;">网络信息</h3>
                                    <div style="
                                        background: rgba(0,0,0,0.03);
                                        padding: 15px;
                                        border-radius: 8px;
                                    ">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                            <span style="font-weight: 500;">AS${ipData.asn.asn.replace('AS', '')}</span>
                                            <span style="color: #666;">${ipData.asn.type}</span>
                                        </div>
                                        <div style="margin-bottom: 5px; font-weight: 500;">${ipData.asn.name}</div>
                                        <div style="color: #666; font-size: 14px;">${ipData.asn.domain}</div>
                                        <div style="color: #666; font-size: 14px;">${ipData.asn.route}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #666;">安全状态</h3>
                                    <div style="
                                        display: grid;
                                        grid-template-columns: repeat(3, 1fr);
                                        gap: 10px;
                                    ">
                                        ${Object.entries(ipData.threat)
                .filter(([key]) => key.startsWith('is_'))
                .map(([key, value]) => {
                    const label = key.replace('is_', '').replace(/_/g, ' ').toUpperCase();
                    return `
                                                    <div style="
                                                        padding: 10px;
                                                        background-color: ${value ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)'};
                                                        border-radius: 6px;
                                                        text-align: center;
                                                        font-size: 12px;
                                                        font-weight: 500;
                                                        color: ${value ? '#ff3b30' : '#34c759'};
                                                    ">
                                                        ${label}
                                                    </div>
                                                `;
                }).join('')}
                                    </div>
                                </div>

                                <!-- 关闭按钮 -->
                                <div style="
                                    position: absolute;
                                    top: 15px;
                                    right: 15px;
                                    cursor: pointer;
                                    width: 24px;
                                    height: 24px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: #666;
                                    border-radius: 12px;
                                    transition: all 0.3s ease;
                                " onclick="this.parentElement.parentElement.remove()">×</div>
                            </div>
                        `;

        document.body.appendChild(ipInfoUI);
        return ipInfoUI;
    }

    function createFloatButton() {
        // 检查是否已存在按钮
        if (document.querySelector('.float-button')) {
            return;
        }

        const floatButton = document.createElement('div');
        floatButton.className = 'float-button';
        floatButton.style.cssText = `
                                position: fixed;
                                right: 20px;
                                bottom: 20px;
                                width: 60px;
                                height: 60px;
                                border-radius: 30px;
                                background-color: rgba(128, 128, 128, 0.75);
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                z-index: 10000;
                                color: white;
                                font-size: 14px;
                                flex-direction: column;
                            `;

        floatButton.innerHTML = `
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; fill: white; margin-bottom: 4px;">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
                                </svg>
                                <span>IP测</span>
                            `;

        floatButton.onmouseover = () => {
            floatButton.style.backgroundColor = 'rgba(100, 100, 100, 0.75)';
        };

        floatButton.onmouseout = () => {
            floatButton.style.backgroundColor = 'rgba(128, 128, 128, 0.75)';
        };

        let ipInfoUI = null;

        floatButton.onclick = async () => {
            if (ipInfoUI) {
                document.body.removeChild(ipInfoUI);
                ipInfoUI = null;
                return;
            }

            const originalContent = floatButton.innerHTML;
            floatButton.innerHTML = `
                                    <div style="width: 20px; height: 20px; border: 2px solid white;
                                                border-top-color: transparent; border-radius: 50%;
                                                animation: spin 1s linear infinite;">
                                    </div>
                                `;

            const ipData = await checkIP();

            floatButton.innerHTML = originalContent;

            if (ipData) {
                ipInfoUI = showIPInfo(ipData);
            } else {
                alert('获取 IP 信息失败，请检查 API Key 设置');
            }
        };

        document.body.appendChild(floatButton);

        // 创建保存按钮
        const saveButton = document.createElement('div');
        saveButton.className = 'float-button save-button';
        saveButton.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 90px; // 位于IP检测按钮上方
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background-color: rgba(76, 175, 80, 0.75);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-size: 14px;
            flex-direction: column;
        `;

        saveButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white" style="margin-bottom: 4px;">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span>保存</span>
        `;

        saveButton.onmouseover = () => {
            saveButton.style.backgroundColor = 'rgba(56, 142, 60, 0.75)';
        };

        saveButton.onmouseout = () => {
            saveButton.style.backgroundColor = 'rgba(76, 175, 80, 0.75)';
        };

        saveButton.onclick = () => {
            saveCookieToGist();
        };

        document.body.appendChild(saveButton);
    }

    // 添加保存cookie到gist的函数
    async function saveCookieToGist() {
        try {
            // 获取当前cookie
            const currentCookies = {
                igneous: getCookie('igneous'),
                ipb_member_id: getCookie('ipb_member_id'),
                ipb_pass_hash: getCookie('ipb_pass_hash')
            };

            // 验证cookie是否完整
            if (!currentCookies.igneous || !currentCookies.ipb_member_id || !currentCookies.ipb_pass_hash) {
                showToast('当前没有完整的Cookie信息', 'warning');
                return;
            }

            // 获取现有的gist
            const gists = await fetchGists();
            if (!gists || gists.length === 0) {
                // 如果没有gist，创建新的
                await createGist([currentCookies]);
                showToast('Cookie保存成功', 'success');
                return;
            }

            const cookieGist = gists[0];
            const content = cookieGist.files['exhentai_cookies.json'].content;
            let cookieList = JSON.parse(content);

            // 检查是否已存在相同账号
            const existingIndex = cookieList.findIndex(item => {
                const cookies = Array.isArray(item) ? item : [item];
                return cookies.some(cookie =>
                    cookie.name === 'ipb_member_id' &&
                    cookie.value === currentCookies.ipb_member_id
                );
            });

            if (existingIndex !== -1) {
                // 显示确认对话框
                if (confirm('已存在相同账号的Cookie，是否覆盖？')) {
                    cookieList[existingIndex] = [
                        { name: 'igneous', value: currentCookies.igneous, domain: '.exhentai.org', path: '/' },
                        { name: 'ipb_member_id', value: currentCookies.ipb_member_id, domain: '.exhentai.org', path: '/' },
                        { name: 'ipb_pass_hash', value: currentCookies.ipb_pass_hash, domain: '.exhentai.org', path: '/' }
                    ];
                } else {
                    return;
                }
            } else {
                // 添加新账号
                cookieList.push([
                    { name: 'igneous', value: currentCookies.igneous, domain: '.exhentai.org', path: '/' },
                    { name: 'ipb_member_id', value: currentCookies.ipb_member_id, domain: '.exhentai.org', path: '/' },
                    { name: 'ipb_pass_hash', value: currentCookies.ipb_pass_hash, domain: '.exhentai.org', path: '/' }
                ]);
            }

            // 更新gist
            await updateGist(cookieGist.id, {
                files: {
                    'exhentai_cookies.json': {
                        content: JSON.stringify(cookieList)
                    }
                }
            });

            showToast('Cookie保存成功', 'success');

        } catch (error) {
            console.error('保存Cookie失败:', error);
            showToast('保存Cookie失败: ' + error.message, 'error');
        }
    }

    // 修改 updateGist 函数
    async function updateGist(gistId, content) {
        try {
            const token = localStorage.getItem('github_token');
            if (!token) {
                throw new Error('未找到 GitHub token');
            }

            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(content)
            });

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('更新 Gist 失败:', error);
            throw error;
        }
    }

    addStyles();
    checkPageWithRetry();

    window.addEventListener('online', () => {
        checkPageWithRetry();
    });

    window.addEventListener('offline', () => {
        showNetworkError();
    });

    // 添加一个通用的提示函数
    function showToast(message, type = 'info') {
        // 移除已存在的提示
        const existingToast = document.querySelector('.exh-toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }

        const toast = document.createElement('div');
        toast.className = 'exh-toast';

        toast.style.cssText = `
                                position: fixed;
                                top: 20px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: rgba(255, 255, 255, 0.75);
                                color: #333;
                                padding: 12px 20px;
                                border-radius: 4px;
                                border: 1px solid rgba(0, 0, 0, 0.1);
                                z-index: 100000;
                                font-size: 14px;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                min-width: 200px;
                                max-width: 400px;
                            `;

        toast.innerHTML = `
                                <span style="flex: 1;">${message}</span>
                                <div style="cursor: pointer;" onclick="this.parentElement.remove()">×</div>
                            `;

        document.body.appendChild(toast);

        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3000);
    }

    // 添加颜色转换工具函数
    function rgbaToHex(rgba) {
        const values = rgba.match(/[\d.]+/g);
        if (!values || values.length < 3) return '#808080';

        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);

        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function hexToRgba(hex, alpha = 0.75) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // 修改 GitHub OAuth 配置
    const GITHUB_CONFIG = {
        clientId: getSettings().githubClientId || '',  // 使用 getSettings() 替代直接访 settings
        scope: 'gist',
        gistDescription: 'ExHentai Cookie Storage'
    };

    // 修改 GitHub 认证函数
    async function authenticateWithGithub() {
        const settings = getSettings();
        if (!settings.githubClientId || !settings.githubClientSecret) {
            showToast('请先在设置中配置 GitHub Client ID 和 Client Secret', 'warning');
            return;
        }

        try {
            const token = localStorage.getItem('github_token');
            if (token) {
                // 如果已经有 token，直接显示 cookie 列表
                showCookieList();
                return;
            }

            // 如果没有 token，进行授权流程
            const state = Math.random().toString(36).substring(7);
            localStorage.setItem('github_client_id', settings.githubClientId);
            localStorage.setItem('github_client_secret', settings.githubClientSecret);
            localStorage.setItem('oauth_state', state);

            const authUrl = `https://github.com/login/oauth/authorize?` +
                `client_id=${settings.githubClientId}&` +
                `scope=${GITHUB_CONFIG.scope}&` +
                `state=${state}`;

            window.open(authUrl, 'github-oauth', 'width=800,height=600');
        } catch (error) {
            console.error('GitHub 认证错误:', error);
            showToast('GitHub 认证失败，请重试', 'error');
        }
    }

    // 修改消息监听器
    window.addEventListener('message', async (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'github_oauth_success') {
            const token = event.data.token;
            if (token) {
                localStorage.setItem('github_token', token);
                showToast('GitHub 授权成功！', 'success');
                showCookieList(); // 直接显示 cookie 列表，它会自动处理初始化
            }
        }
    });

    // 检查 URL 中的 token
    function checkOAuthRedirect() {
        try {
            const hash = window.location.hash;
            if (hash) {
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get('access_token');
                const state = params.get('state');

                if (accessToken && state) {
                    const savedState = localStorage.getItem('oauth_state');
                    if (state === savedState) {
                        // 保存 token
                        localStorage.setItem('github_token', accessToken);
                        // 清除状态
                        localStorage.removeItem('oauth_state');
                        // 清除 URL 中的 token
                        window.location.hash = '';
                        // 显示成功消息
                        showToast('GitHub 授权成功！', 'success');
                    } else {
                        showToast('OAuth 认证失败：state 不匹配', 'error');
                    }
                }
            }
        } catch (error) {
            console.error('OAuth 重定向处理错误:', error);
            showToast('OAuth 重定向处理失败', 'error');
        }
    }

    // 修改 fetchGists 函数
    async function fetchGists() {
        try {
            const token = localStorage.getItem('github_token');
            if (!token) {
                throw new Error('未找到 GitHub token');
            }

            // 从 localStorage 获取已保存的 gist ID
            const gistId = localStorage.getItem('exhentai_gist_id');

            if (gistId) {
                // 如果有保存的 gist ID，直接获取该 gist
                const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        // 如果 gist 不存在，清除保存的 ID
                        localStorage.removeItem('exhentai_gist_id');
                        return null;
                    }
                    throw new Error(`GitHub API 请求失败: ${response.status}`);
                }

                const gist = await response.json();
                return [gist]; // 返回数组格式以保持兼容性
            } else {
                // 如果没有保存的 gist ID，搜索所有 gist
                const response = await fetch('https://api.github.com/gists', {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`GitHub API 请求失败: ${response.status}`);
                }

                const gists = await response.json();
                // 找到 ExHentai Cookie Storage gist
                const cookieGist = gists.find(gist =>
                    gist.description === GITHUB_CONFIG.gistDescription
                );

                if (cookieGist) {
                    // 保存找到的 gist ID
                    localStorage.setItem('exhentai_gist_id', cookieGist.id);
                }

                return cookieGist ? [cookieGist] : [];
            }
        } catch (error) {
            console.error('获取 Gists 失败:', error);
            showToast('获取 Gists 失败: ' + error.message, 'error');
            return null;
        }
    }

    // 修改 createGist 函数
    async function createGist(cookieData, description = '') {
        try {
            const token = localStorage.getItem('github_token');
            if (!token) {
                throw new Error('未找到 GitHub token');
            }

            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: GITHUB_CONFIG.gistDescription,
                    public: false,
                    files: {
                        'exhentai_cookies.json': {
                            content: '[]' // 初始化为空数组
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.status}`);
            }

            const result = await response.json();
            // 保存新创建的 gist ID
            localStorage.setItem('exhentai_gist_id', result.id);
            return result;
        } catch (error) {
            console.error('创建 Gist 失败:', error);
            showToast('创建 Gist 失败: ' + error.message, 'error');
            return null;
        }
    }

    // 修改 updateGist 函数，支持添加新的 cookie
    async function updateGist(gistId, cookieData, description = '') {
        try {
            const token = localStorage.getItem('github_token');
            if (!token) {
                throw new Error('未找到 GitHub token');
            }

            // 先获取现有的 Gist 内容
            const response = await fetch(`https://api.github.com/gists/${gistId}`);
            const gist = await response.json();

            let cookieList = [];
            if (gist.files['exhentai_cookies.json']) {
                cookieList = JSON.parse(gist.files['exhentai_cookies.json'].content);
            }

            // 添加新的 cookie
            const newCookieItem = {
                timestamp: Date.now(),
                description: description || `账号 ${cookieList.length + 1}`,
                data: cookieData
            };
            cookieList.push(newCookieItem);

            // 更新 Gist
            const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        'exhentai_cookies.json': {
                            content: JSON.stringify(cookieList)
                        }
                    }
                })
            });

            if (!updateResponse.ok) {
                throw new Error(`GitHub API 请求失败: ${updateResponse.status}`);
            }

            return await updateResponse.json();
        } catch (error) {
            console.error('更新 Gist 失败:', error);
            showToast('更新 Gist 失败: ' + error.message, 'error');
            return null;
        }
    }

    // 在脚本初始化时检查 OAuth 重定向
    checkOAuthRedirect();

    // 在 GitHub OAuth 相关函数部分添加以下函数
    async function initializeGist() {
        try {
            // 获取当前的 cookie 数据
            const cookieData = {
                igneous: getCookie('igneous'),
                ipb_member_id: getCookie('ipb_member_id'),
                ipb_pass_hash: getCookie('ipb_pass_hash')
            };

            // 获取所有 gists
            const gists = await fetchGists();
            if (!gists) {
                throw new Error('无法获取 Gists');
            }

            // 查找现有的 ExHentai cookie gist
            const existingGist = gists.find(gist =>
                gist.description === GITHUB_CONFIG.gistDescription
            );

            if (existingGist) {
                // 更新现有的 gist
                const result = await updateGist(existingGist.id, cookieData);
                if (result) {
                    showToast('Cookie 数据已更新到 Gist', 'success');
                    return result;
                }
            } else {
                // 创建新的 gist
                const result = await createGist(cookieData);
                if (result) {
                    showToast('Cookie 数据已保存到新的 Gist', 'success');
                    return result;
                }
            }

            throw new Error('Gist 操作失败');
        } catch (error) {
            console.error('初始化 Gist 失败:', error);
            showToast('初始化 Gist 失败: ' + error.message, 'error');
            return null;
        }
    }

    // 修改 showCookieList 函数的开头部分
    async function showCookieList() {
        try {
            const gists = await fetchGists();
            if (!gists) {
                throw new Error('无法获取 Gists');
            }

            const cookieGist = gists.find(gist =>
                gist.description === GITHUB_CONFIG.gistDescription
            );

            // 如果没有找到 Gist，自动创建一个新的
            if (!cookieGist || !cookieGist.files || !cookieGist.files['exhentai_cookies.json']) {
                const currentCookies = [
                    { name: 'igneous', value: getCookie('igneous'), domain: '.exhentai.org', path: '/' },
                    { name: 'ipb_member_id', value: getCookie('ipb_member_id'), domain: '.exhentai.org', path: '/' },
                    { name: 'ipb_pass_hash', value: getCookie('ipb_pass_hash'), domain: '.exhentai.org', path: '/' }
                ];

                // 检查当前是否有可用的 cookie
                if (!currentCookies.every(cookie => cookie.value)) {
                    showToast('当前没有可用的 Cookie，请先登录', 'warning');
                    showEmptyCookieUI();
                    return;
                }

                showToast('正在初始化 Cookie 存储...', 'info');
                const result = await createGist(currentCookies);
                if (!result) {
                    throw new Error('初始化 Cookie 存储失败');
                }

                showToast('Cookie 存储初始化成功', 'success');
                // 重新调用自身以显示新创建的 cookie
                return showCookieList();
            }

            // 解析 cookie 列表
            let cookieGroups;
            try {
                const content = cookieGist.files['exhentai_cookies.json'].content.trim();

                // 检查是否是初始化状态（单个 cookie 组）
                try {
                    const parsedContent = JSON.parse(content);
                    if (Array.isArray(parsedContent) && parsedContent.length > 0 && parsedContent[0].name) {
                        // 如果是单个 cookie 组，转换为数组格式
                        cookieGroups = [parsedContent];
                    } else {
                        cookieGroups = parsedContent;
                    }
                } catch (e) {
                    // 如果解析失败，尝试按换行符分割
                    cookieGroups = content.split('\n').map(group => {
                        try {
                            return JSON.parse(group.trim());
                        } catch (e) {
                            console.error('解析单组 cookie 失败:', e);
                            return null;
                        }
                    }).filter(group => group !== null);
                }

                if (cookieGroups.length === 0) {
                    throw new Error('没有有效的 Cookie 数据');
                }
            } catch (e) {
                console.error('解析 Cookie 失败:', e);
                showEmptyCookieUI();
                return;
            }

            // 创建 cookie 选择界面
            const cookieSelectUI = document.createElement('div');
            cookieSelectUI.className = 'exh-ui';
            cookieSelectUI.style.cssText = `
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 100%;
                                height: 100%;
                                z-index: 10001;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                backdrop-filter: blur(10px);
                            `;

            cookieSelectUI.innerHTML = `
                                <div class="exh-container" style="
                                    width: calc(100% - 160px); /* 左右各留 80px 的边距 */
                                    max-width: 400px; /* 增加最大宽度 */
                                    padding: 30px;
                                    background: rgba(255, 255, 255, 0.3);
                                    backdrop-filter: blur(10px);
                                    border-radius: 20px;
                                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                                ">
                                    <h2 class="exh-title" style="
                                        margin-bottom: 20px;
                                        font-size: 24px;
                                        text-align: center;
                                        color: rgba(0, 0, 0, 0.8);
                                    ">Cookie 管理</h2>

                                    ${cookieGroups.map((group, index) => {
                const memberId = group.find(c => c.name === 'ipb_member_id')?.value || '未知';
                return `
                                            <div style="
                                                margin-bottom: 10px;
                                                background: rgba(255, 255, 255, 0.1);
                                                padding: 20px; /* 增加内边距 */
                                                border-radius: 10px;
                                            ">
                                                <div style="
                                                    color: rgba(0, 0, 0, 0.8);
                                                    font-size: 16px;
                                                    margin-bottom: 15px;
                                                    text-align: center; /* 居中显示账号 */
                                                ">账号 ${memberId}</div>
                                                <div style="display: flex; gap: 15px;">
                                                    <button class="exh-button inject-cookie" data-index="${index}" style="
                                                        flex: 1;
                                                        background-color: rgba(76, 175, 80, 0.8);
                                                        border: none;
                                                        padding: 10px; /* 增加按钮内边距 */
                                                        border-radius: 8px;
                                                        color: white;
                                                        font-size: 14px;
                                                        cursor: pointer;
                                                    ">注入</button>
                                                    <button class="exh-button delete-cookie" data-index="${index}" style="
                                                        flex: 1;
                                                        background-color: rgba(244, 67, 54, 0.8);
                                                        border: none;
                                                        padding: 10px; /* 增加按钮内边距 */
                                                        border-radius: 8px;
                                                        color: white;
                                                        font-size: 14px;
                                                        cursor: pointer;
                                                    ">删除</button>
                                                </div>
                                            </div>
                                        `;
            }).join('')}

                                    <button class="exh-button" id="closeSelect" style="
                                        width: 100%;
                                        background-color: rgba(158, 158, 158, 0.8);
                                        border: none;
                                        padding: 12px; /* 增加返回按钮内边距 */
                                        border-radius: 10px;
                                        color: white;
                                        font-size: 14px;
                                        cursor: pointer;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        margin-top: 20px;
                                    ">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px;">
                                            <path d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        返回
                                    </button>
                                </div>
                            `;

            document.body.appendChild(cookieSelectUI);

            // 绑定事件
            cookieSelectUI.addEventListener('click', async (e) => {
                const target = e.target;
                if (target.classList.contains('inject-cookie')) {
                    const index = parseInt(target.dataset.index);
                    const selectedGroup = cookieGroups[index];

                    // 注入选中的 cookie 组
                    selectedGroup.forEach(cookie => {
                        setCookie(cookie.name, cookie.value, 365);
                    });
                    setCookie('shuaxin', 'yes', 1);

                    document.body.style.backgroundImage = 'none';
                    cookieSelectUI.remove();
                    showToast('Cookie 注入成功', 'success');
                    startRefreshing();
                } else if (target.classList.contains('delete-cookie')) {
                    const index = parseInt(target.dataset.index);
                    cookieGroups.splice(index, 1);

                    // 更新 Gist
                    const newContent = JSON.stringify(cookieGroups);

                    await updateGist(cookieGist.id, {
                        files: {
                            'exhentai_cookies.json': {
                                content: newContent
                            }
                        }
                    });

                    cookieSelectUI.remove();
                    showCookieList();
                }
            });

            document.getElementById('closeSelect').onclick = () => {
                cookieSelectUI.remove();
                showInjectOptions();
            };

        } catch (error) {
            console.error('显示 Cookie 列表失败:', error);
            showToast('获取 Cookie 列表失败: ' + error.message, 'error');
            showInjectOptions();
        }
    }

    // 修改显示空 Cookie 界面的函数
    function showEmptyCookieUI() {
        const emptyUI = document.createElement('div');
        emptyUI.className = 'exh-ui';
        emptyUI.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 100%;
                            height: 100%;
                            z-index: 10001;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;

        emptyUI.innerHTML = `
                            <div class="exh-container" style="max-width: 400px; padding: 40px;">
                                <h2 class="exh-title" style="margin-bottom: 30px;">Cookie 管理</h2>

                                <div style="
                                    text-align: center;
                                    padding: 30px;
                                    background: rgba(255, 255, 255, 0.1);
                                    border-radius: 10px;
                                    margin-bottom: 30px;
                                ">
                                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="
                                        margin-bottom: 15px;
                                        color: #666;
                                    ">
                                        <path d="M20 7h-7L10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"></path>
                                    </svg>
                                    <div style="
                                        color: #666;
                                        font-size: 16px;
                                        margin-bottom: 5px;
                                    ">暂无保存的账号</div>
                                    <div style="
                                        color: #999;
                                        font-size: 14px;
                                    ">请先登录后添加当前账号</div>
                                </div>

                                <div style="display: flex; gap: 10px;">
                                    <button class="exh-button" id="addFirstCookie" style="
                                        flex: 1;
                                        background-color: ${getSettings().buttonColor};
                                        padding: 12px;
                                    ">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
                                            <path d="M12 5v14M5 12h14"></path>
                                        </svg>
                                        添加当前账号
                                    </button>
                                    <button class="exh-button" id="closeEmpty" style="
                                        flex: 1;
                                        background-color: ${getSettings().buttonColor};
                                        padding: 12px;
                                    ">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
                                            <path d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        返回
                                    </button>
                                </div>
                            </div>
                        `;

        document.body.appendChild(emptyUI);

        // 添加当前账号按钮事件
        document.getElementById('addFirstCookie').onclick = async () => {
            const currentCookies = [
                { name: 'igneous', value: getCookie('igneous'), domain: '.exhentai.org', path: '/' },
                { name: 'ipb_member_id', value: getCookie('ipb_member_id'), domain: '.exhentai.org', path: '/' },
                { name: 'ipb_pass_hash', value: getCookie('ipb_pass_hash'), domain: '.exhentai.org', path: '/' }
            ];

            if (!currentCookies.every(cookie => cookie.value)) {
                showToast('请先登录后再添加账号', 'warning');
                return;
            }

            const result = await createGist([currentCookies]);
            if (result) {
                emptyUI.remove();
                showToast('账号添加成功', 'success');
                showCookieList();
            }
        };

        // 关闭按钮事件
        document.getElementById('closeEmpty').onclick = () => {
            emptyUI.remove();
            showInjectOptions();
        };
    }

    // 添加显示新建 Cookie 界面的函数
    async function showNewCookieUI() {
        try {
            const currentCookie = {
                igneous: getCookie('igneous'),
                ipb_member_id: getCookie('ipb_member_id'),
                ipb_pass_hash: getCookie('ipb_pass_hash')
            };

            // 验证当前是否有可用的 cookie
            if (!currentCookie.igneous || !currentCookie.ipb_member_id || !currentCookie.ipb_pass_hash) {
                showToast('当前没有可用的 Cookie，请先登录', 'warning');
                return;
            }

            // 创建界面
            const newCookieUI = document.createElement('div');
            newCookieUI.className = 'exh-ui';
            newCookieUI.style.cssText = `
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 100%;
                                height: 100%;
                                z-index: 10001;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            `;

            newCookieUI.innerHTML = `
                                <div class="exh-container" style="max-width: 400px; padding: 40px;">
                                    <h2 class="exh-title" style="margin-bottom: 30px;">保存当前 Cookie</h2>

                                    <div class="cookie-info" style="
                                        background: rgba(255, 255, 255, 0.1);
                                        padding: 15px;
                                        border-radius: 10px;
                                        margin-bottom: 20px;
                                    ">
                                        <div class="setting-item">
                                            <label class="exh-label">账号描述</label>
                                            <input type="text" id="cookieDescription" class="exh-input" placeholder="请输入账号描述" value="默认账号">
                                        </div>
                                    </div>

                                    <div style="display: flex; gap: 10px;">
                                        <button class="exh-button" id="saveCookie" style="
                                            flex: 1;
                                            background-color: ${getSettings().buttonColor};
                                        ">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
                                                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                <polyline points="7 3 7 8 15 8"></polyline>
                                            </svg>
                                            保存
                                        </button>
                                        <button class="exh-button" id="cancelSave" style="
                                            flex: 1;
                                            background-color: ${getSettings().buttonColor};
                                        ">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;">
                                                <path d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                            取消
                                        </button>
                                    </div>
                                </div>
                            `;

            document.body.appendChild(newCookieUI);

            // 保存按钮事件
            document.getElementById('saveCookie').onclick = async () => {
                const description = document.getElementById('cookieDescription').value.trim() || '默认账号';
                const result = await createGist(currentCookie, description);
                if (result) {
                    newCookieUI.remove();
                    showToast('Cookie 保存成功', 'success');
                    showCookieList();
                }
            };

            // 取消按钮事件
            document.getElementById('cancelSave').onclick = () => {
                newCookieUI.remove();
                showInjectOptions();
            };

        } catch (error) {
            console.error('显示新建 Cookie 界面失败:', error);
            showToast('创建新 Cookie 失败: ' + error.message, 'error');
            showInjectOptions();
        }
    }
})();