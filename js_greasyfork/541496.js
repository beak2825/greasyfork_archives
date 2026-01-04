// ==UserScript==
// @name         一键设置token
// @namespace    http://tampermonkey.net/
// @version      20250708
// @license MIT
// @description  一键设置token、切换中英日文
// @author       zr
// @match        https://doctor-frontend.dev.chohotech.com/*
// @match        https://doctor-frontend.alpha.chohotech.com/*
// @match        https://doctor-frontend.uat.chohotech.com/*
// @match        https://doctor-frontend.tenant.chohotech.com/*
// @match        https://doctor-frontend.uat-sg.chohotech.com/*
// @match        https://cn-dentalcraft.alpha.chohotech.com/*
// @match        localhost:5173/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/541991/%E4%B8%80%E9%94%AE%E8%AE%BE%E7%BD%AEtoken.user.js
// @updateURL https://update.greasyfork.org/scripts/541991/%E4%B8%80%E9%94%AE%E8%AE%BE%E7%BD%AEtoken.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否在 iframe 中
    if (window.self !== window.top) {
        return; // 如果在 iframe 中，则不执行脚本
    }

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .token-panel {
            position: fixed;
            left: -100px;
            top: 50%;
            transform: translateY(-50%);
            width: 100px;
            background: #fff;
            border-radius: 0 6px 6px 0;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transition: all 0.25s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid #ccc;
            border-left: none;
        }

        .token-panel:hover {
            left: 0;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
        }

        .panel-trigger {
            position: absolute;
            right: -12px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 40px;
            background: #4a90e2;
            border: 1px solid #357abd;
            border-left: none;
            border-radius: 0 6px 6px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            font-size: 8px;
            font-weight: 600;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            letter-spacing: 0.5px;
            transition: all 0.25s ease;
        }

        .panel-trigger:hover {
            background: #357abd;
            color: white;
            width: 15px;
        }

        .panel-content {
            padding: 8px 6px;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.25s ease 0.1s;
        }

        .token-panel:hover .panel-content {
            opacity: 1;
            transform: translateX(0);
        }

        .button-group {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .group-title {
            color: #777;
            font-size: 8px;
            font-weight: 600;
            margin: 5px 0 2px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .token-btn {
            background: #f5f5f5;
            border: 1px solid #ccc;
            color: #333;
            padding: 4px 6px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 9px;
            font-weight: 500;
            transition: all 0.2s ease;
            text-align: center;
        }

        .token-btn:hover {
            background: #e9e9e9;
            border-color: #aaa;
            color: #000;
        }

        .token-btn:active {
            background: #ddd;
            transform: translateY(1px);
        }

        .token-btn.primary {
            background: #4a90e2;
            border-color: #357abd;
            color: white;
            font-weight: 600;
        }

        .token-btn.primary:hover {
            background: #357abd;
            border-color: #2c6aa0;
            color: white;
        }

        .token-btn.success {
            background: #5cb85c;
            border-color: #4cae4c;
            color: white;
            font-weight: 600;
        }

        .token-btn.success:hover {
            background: #4cae4c;
            border-color: #419641;
            color: white;
        }

        .token-btn.info {
            background: #5bc0de;
            border-color: #46b8da;
            color: white;
            font-weight: 600;
        }

        .token-btn.info:hover {
            background: #46b8da;
            border-color: #31b0d5;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // 创建主面板
    const panel = document.createElement('div');
    panel.className = 'token-panel';

    // 创建触发器
    const trigger = document.createElement('div');
    trigger.className = 'panel-trigger';
    trigger.textContent = '工具';

    // 创建面板内容
    const content = document.createElement('div');
    content.className = 'panel-content';

    // 创建按钮组容器
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    // Token管理组
    const tokenGroupTitle = document.createElement('div');
    tokenGroupTitle.className = 'group-title';
    tokenGroupTitle.textContent = '灵芽 Token';

    // 语言切换组
    const langGroupTitle = document.createElement('div');
    langGroupTitle.className = 'group-title';
    langGroupTitle.textContent = '语言切换';

    // 技师Token组
    const techGroupTitle = document.createElement('div');
    techGroupTitle.className = 'group-title';
    techGroupTitle.textContent = '技师 Token';

    // 创建按钮配置
    const buttons = [
        { text: '获取Token', class: 'primary', action: 'getToken' },
        { text: '设置Token', class: 'success', action: 'setToken' },
        { text: '中文', class: 'info', action: 'setLangZh' },
        { text: '英语', class: 'info', action: 'setLangEn' },
        { text: '日语', class: 'info', action: 'setLangJa' },
        { text: '法语', class: 'info', action: 'setLangFr' },
        { text: '西语', class: 'info', action: 'setLangEs' },
        { text: '获取Token', class: 'primary', action: 'getTechToken' },
        { text: '设置Token', class: 'success', action: 'setTechToken' }
    ];

    // 创建按钮
    buttons.forEach((btnConfig, index) => {
        if (index === 0) buttonGroup.appendChild(tokenGroupTitle);
        if (index === 2) buttonGroup.appendChild(langGroupTitle);
        if (index === 7) buttonGroup.appendChild(techGroupTitle);

        const btn = document.createElement('div');
        btn.className = `token-btn ${btnConfig.class}`;
        btn.textContent = btnConfig.text;
        btn.addEventListener('click', () => handleButtonClick(btnConfig.action));
        buttonGroup.appendChild(btn);
    });

    // 组装面板
    content.appendChild(buttonGroup);
    panel.appendChild(trigger);
    panel.appendChild(content);
    document.body.appendChild(panel);

    // 功能函数
    function getAndStoreHash() {
        let hash = window.location.hash;
        if (hash) {
            let cleanHash = hash.substring(1);
            if(cleanHash.length > 1){
                GM_setValue('hashValue', cleanHash);
            }
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 6px 12px;
            border-radius: 3px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.25s ease;
            max-width: 200px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 250);
        }, 2000);
    }

    // 获取当前URL查询参数中的language值
    function getCurrentLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('language');
    }

    // 获取当前URL中hash部分的language值
    function getCurrentLanguageFromHash() {
        const hash = window.location.hash;
        if (hash && hash.includes('?')) {
            const hashQuery = hash.split('?')[1];
            const hashParams = new URLSearchParams(hashQuery);
            return hashParams.get('language');
        }
        return null;
    }

    // 检查URL查询参数中是否包含language参数
    function hasLanguageInURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('language');
    }

    // 检查hash部分是否包含language参数
    function hasLanguageInHash() {
        const hash = window.location.hash;
        if (hash && hash.includes('?')) {
            const hashQuery = hash.split('?')[1];
            const hashParams = new URLSearchParams(hashQuery);
            return hashParams.has('language');
        }
        return false;
    }

    // 修改URL查询参数中的language参数并重定向
    function redirectWithURLLanguage(newLang) {
        const urlParams = new URLSearchParams(window.location.search);

        // 修改language参数
        urlParams.set('language', newLang);

        // 重新构造URL，不包含hash部分
        const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + urlParams.toString();

        // 同时更新localStorage
        localStorage.setItem('language', newLang);

        // 使用history.replaceState来避免添加历史记录
        window.history.replaceState(null, null, newUrl);

        // 立即刷新页面以应用语言变化
        setTimeout(() => {
            window.location.reload();
        }, 50);
    }

    // 修改hash部分的language参数并重定向
    function redirectWithHashLanguage(newLang) {
        const hash = window.location.hash;
        let newHash;

        if (hash && hash.includes('?')) {
            // 已有查询参数的情况
            const hashParts = hash.split('?');
            const hashBase = hashParts[0]; // #/path
            const hashQuery = hashParts[1];
            const hashParams = new URLSearchParams(hashQuery);

            // 修改language参数
            hashParams.set('language', newLang);

            // 重新构造URL
            newHash = hashBase + '?' + hashParams.toString();
        } else {
            // 没有查询参数的情况，直接添加
            const hashBase = hash || '#/';
            newHash = hashBase + '?language=' + newLang;
        }

        // 同时更新localStorage和URL hash
        localStorage.setItem('language', newLang);

        // 使用history.replaceState来避免添加历史记录
        const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search + newHash;
        window.history.replaceState(null, null, newUrl);

        // 立即刷新页面以应用语言变化
        setTimeout(() => {
            window.location.reload();
        }, 50);
    }

    // 只修改localStorage（保持原有功能）
    function setLanguageLocalStorageOnly(newLang) {
        localStorage.setItem('language', newLang);
        showNotification(`已切换到${getLanguageName(newLang)}，页面将自动刷新...`);
        setTimeout(() => location.reload(), 1000);
    }

    // 统一的语言切换函数
    function switchLanguage(newLang) {
        // 优先检查URL查询参数中的language
        const urlLang = getCurrentLanguageFromURL();
        const hashLang = getCurrentLanguageFromHash();
        const localLang = localStorage.getItem('language');

        const currentLang = urlLang || hashLang || localLang;

        if (currentLang === newLang) {
            showNotification(`当前已经是${getLanguageName(newLang)}`);
            return;
        }

        showNotification(`切换到${getLanguageName(newLang)}，即将重定向...`);

        // 直接使用字符串替换方式修改URL中的language参数
        const currentUrl = window.location.href;
        let newUrl;

        if (hasLanguageInURL()) {
            // 如果URL查询参数中有language，直接替换
            const languageRegex = /([?&])language=[^&]*/;
            if (languageRegex.test(currentUrl)) {
                newUrl = currentUrl.replace(languageRegex, `$1language=${newLang}`);
            } else {
                // 如果没有匹配到，使用URLSearchParams方式
                setTimeout(() => redirectWithURLLanguage(newLang), 500);
                return;
            }
        } else if (hasLanguageInHash()) {
            setTimeout(() => redirectWithHashLanguage(newLang), 500);
            return;
        } else {
            // 如果URL和hash中都没有language参数，则只修改localStorage
            setTimeout(() => setLanguageLocalStorageOnly(newLang), 500);
            return;
        }

        // 更新localStorage
        localStorage.setItem('language', newLang);

        // 使用history.replaceState来避免添加历史记录
        window.history.replaceState(null, null, newUrl);

        // 立即刷新页面以应用语言变化
        setTimeout(() => {
            window.location.reload();
        }, 50);
    }

    // 获取语言名称
    function getLanguageName(lang) {
        const langMap = {
            'zh': '中文',
            'en': '英语',
            'ja': '日语',
            'fr': '法语',
            'es': '西语'
        };
        return langMap[lang] || lang;
    }

    // 按钮点击处理函数（修复版）
    function handleButtonClick(action) {
        switch(action) {
            case 'getToken':
                let token = localStorage.getItem('QWNjZXNzLVRva2Vu');
                let refreshToken = localStorage.getItem('UmVmcmVzaC1Ub2tlbg==');
                GM_setValue('QWNjZXNzLVRva2Vu', token);
                GM_setValue('UmVmcmVzaC1Ub2tlbg==', refreshToken);
                showNotification('Token 获取成功！');
                break;

            case 'setToken':
                let savedToken = GM_getValue('QWNjZXNzLVRva2Vu');
                let savedRefreshToken = GM_getValue('UmVmcmVzaC1Ub2tlbg==');
                localStorage.setItem('QWNjZXNzLVRva2Vu', savedToken);
                localStorage.setItem('UmVmcmVzaC1Ub2tlbg==', savedRefreshToken);
                showNotification('Token 设置成功，即将刷新页面...');
                setTimeout(() => location.reload(), 1000);
                break;

            case 'setLangZh':
                switchLanguage('zh');
                break;

            case 'setLangEn':
                switchLanguage('en');
                break;

            case 'setLangJa':
                switchLanguage('ja');
                break;

            case 'setLangFr':
                switchLanguage('fr');
                break;

            case 'setLangEs':
                switchLanguage('es');
                break;

            case 'getTechToken':
                let techToken = localStorage.getItem('token');
                GM_setValue('token', techToken);
                showNotification('技师 Token 获取成功！');
                break;

            case 'setTechToken':
                let savedTechToken = GM_getValue('token');
                localStorage.setItem('token', savedTechToken);
                showNotification('技师 Token 设置成功，即将刷新页面...');
                setTimeout(() => location.reload(), 1000);
                break;
        }
    }
})();