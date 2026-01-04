// ==UserScript==
// @name         在中国大陆的Deepseek登录页面中添加Google登录方式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  【已更新新版登录页面】因为Deepseek会检测IP并且检测方式比较严格，导致我开规则代理无法突破此检测，遂写下该脚本，在大陆的Deepseek登录页面中添加Google登录方式
// @icon         https://cdn.deepseek.com/chat/icon.png
// @author       GamerNoTitle
// @match        *://chat.deepseek.com/*
// @match        *://platform.deepseek.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/525119/%E5%9C%A8%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E7%9A%84Deepseek%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E4%B8%AD%E6%B7%BB%E5%8A%A0Google%E7%99%BB%E5%BD%95%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/525119/%E5%9C%A8%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E7%9A%84Deepseek%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E4%B8%AD%E6%B7%BB%E5%8A%A0Google%E7%99%BB%E5%BD%95%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateRandomDeviceId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let deviceId = '';
        for (let i = 0; i < 64; i++) {
            deviceId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return btoa(deviceId).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function addGoogleLoginButton() {
        let baseUrl, loginButtonSelector, shumeiVerification;

        if (window.location.hostname === 'chat.deepseek.com') {
            baseUrl = 'https://chat.deepseek.com/api/v0/users/oauth/google/authorize';
            loginButtonSelector = '.ds-sign-up-form__register-button';
            shumeiVerification = '{"region":"CN","rid":""}';
        } else if (window.location.hostname === 'platform.deepseek.com') {
            baseUrl = 'https://platform.deepseek.com/auth-api/v0/users/oauth/google/authorize';
            loginButtonSelector = '.ds-sign-up-form__register-button';
            shumeiVerification = '{%22region%22:%22CN%22,%22rid%22:%22%22}';
        } else {
            return;
        }

        const loginButton = document.querySelector(loginButtonSelector);
        if (!loginButton) {
            console.warn("[Google登录] 找不到登录按钮");
            return;
        }

        // 创建完整的Google登录按钮
        const googleLoginButton = document.createElement('div');
        googleLoginButton.role = 'button';
        googleLoginButton.classList.add('ds-button', 'ds-button--secondary',
            'ds-button--bordered', 'ds-button--rect', 'ds-button--block', 'ds-button--l');
        googleLoginButton.tabIndex = 0;
        googleLoginButton.style.marginBottom = '16px';
        googleLoginButton.innerHTML = `
            <div class="ds-button__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" style="width: 16px; height: 16px;">
                    <path fill="#4285f4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34a853" d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"/>
                    <path fill="#fbbc05" d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#ea4335" d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"/>
                </svg>
            </div>
            Log in with Google
        `;

        // 构建OAuth URL
        const deviceId = generateRandomDeviceId();
        const googleOAuthURL = `${baseUrl}?os=web&device_id=${deviceId}&shumei_verification=${shumeiVerification}`;

        // 添加点击事件
        googleLoginButton.addEventListener('click', () => {
            window.location.href = googleOAuthURL;
        });

        // 插入到登录按钮上方
        loginButton.parentNode.insertBefore(googleLoginButton, loginButton);

        // 调整间距
        const spacer = loginButton.previousElementSibling;
        if (spacer && spacer.style.height === '33px') {
            spacer.style.height = '16px';
        }

        console.log("[Google登录] 按钮添加成功");
    }

    // Mutation Observer配置
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };

    // 使用Mutation Observer确保动态加载
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.ds-sign-up-form__register-button')) {
            observer.disconnect();
            addGoogleLoginButton();
        }
    });

    // 开始监听
    observer.observe(document.body, observerConfig);

    // 初始尝试
    if (document.querySelector('.ds-sign-up-form__register-button')) {
        addGoogleLoginButton();
    }
})();
