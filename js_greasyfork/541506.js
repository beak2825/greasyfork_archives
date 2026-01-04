// ==UserScript==
// @name         语言切换
// @namespace    http://tampermonkey.net/
// @version      20250703
// @license MIT
// @description  切换中英日法西
// @author       zr
// @match        https://doctor-frontend.dev.chohotech.com/*
// @match        https://doctor-frontend.alpha.chohotech.com/*
// @match        https://doctor-frontend.uat.chohotech.com/*
// @match        https://doctor-frontend.tenant.chohotech.com/*
// @match        https://doctor-frontend.uat-sg.chohotech.com/*
// @match        localhost:5173/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/541506/%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541506/%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.meta.js
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
        .language-panel {
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

        .language-panel:hover {
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

        .language-panel:hover .panel-content {
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

        .lang-btn {
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

        .lang-btn:hover {
            background: #e9e9e9;
            border-color: #aaa;
            color: #000;
        }

        .lang-btn:active {
            background: #ddd;
            transform: translateY(1px);
        }

        .lang-btn.info {
            background: #5bc0de;
            border-color: #46b8da;
            color: white;
            font-weight: 600;
        }

        .lang-btn.info:hover {
            background: #46b8da;
            border-color: #31b0d5;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // 创建主面板
    const panel = document.createElement('div');
    panel.className = 'language-panel';

    // 创建触发器
    const trigger = document.createElement('div');
    trigger.className = 'panel-trigger';
    trigger.textContent = '语言';

    // 创建面板内容
    const content = document.createElement('div');
    content.className = 'panel-content';

    // 创建按钮组容器
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    // 语言切换组标题
    const langGroupTitle = document.createElement('div');
    langGroupTitle.className = 'group-title';
    langGroupTitle.textContent = '语言切换';

    // 创建按钮配置
    const buttons = [
        { text: '中文', class: 'info', action: 'setLangZh' },
        { text: '英语', class: 'info', action: 'setLangEn' },
        { text: '日语', class: 'info', action: 'setLangJa' },
        { text: '法语', class: 'info', action: 'setLangFr' },
        { text: '西语', class: 'info', action: 'setLangEs' }
    ];

    // 添加标题
    buttonGroup.appendChild(langGroupTitle);

    // 创建按钮
    buttons.forEach((btnConfig) => {
        const btn = document.createElement('div');
        btn.className = `lang-btn ${btnConfig.class}`;
        btn.textContent = btnConfig.text;
        btn.addEventListener('click', () => handleButtonClick(btnConfig.action));
        buttonGroup.appendChild(btn);
    });

    // 组装面板
    content.appendChild(buttonGroup);
    panel.appendChild(trigger);
    panel.appendChild(content);
    document.body.appendChild(panel);

    // 通知函数
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

    // 修改hash部分的language参数并重定向
    function redirectWithLanguage(newLang) {
        const hash = window.location.hash;
        if (hash && hash.includes('?')) {
            const hashParts = hash.split('?');
            const hashBase = hashParts[0]; // #/
            const hashQuery = hashParts[1];
            const hashParams = new URLSearchParams(hashQuery);

            // 修改language参数
            hashParams.set('language', newLang);

            // 重新构造URL
            const newHash = hashBase + '?' + hashParams.toString();

            // 同时更新localStorage和URL hash
            localStorage.setItem('language', newLang);
            window.location.hash = newHash;

            // 立即刷新页面以应用语言变化
            setTimeout(() => {
                window.location.reload();
            }, 50);
        }
    }

    // 只修改localStorage
    function setLanguageLocalStorageOnly(newLang) {
        localStorage.setItem('language', newLang);
        showNotification(`已切换到${getLanguageName(newLang)}，页面将自动刷新...`);
        setTimeout(() => location.reload(), 1000);
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

    // 按钮点击处理函数
    function handleButtonClick(action) {
        switch(action) {
            case 'setLangZh':
                if(hasLanguageInHash()) {
                    let currentLang = getCurrentLanguageFromHash();
                    if(currentLang !== 'zh'){
                        showNotification('切换到中文，即将重定向...');
                        setTimeout(() => redirectWithLanguage('zh'), 500);
                    } else {
                        showNotification('当前已经是中文');
                    }
                } else {
                    let currentLangStorage = localStorage.getItem('language');
                    if(currentLangStorage !== 'zh'){
                        setLanguageLocalStorageOnly('zh');
                    } else {
                        showNotification('当前已经是中文');
                    }
                }
                break;

            case 'setLangEn':
                if(hasLanguageInHash()) {
                    let currentLangEn = getCurrentLanguageFromHash();
                    if(currentLangEn !== 'en'){
                        showNotification('切换到英语，即将重定向...');
                        setTimeout(() => redirectWithLanguage('en'), 500);
                    } else {
                        showNotification('当前已经是英语');
                    }
                } else {
                    let currentLangStorage = localStorage.getItem('language');
                    if(currentLangStorage !== 'en'){
                        setLanguageLocalStorageOnly('en');
                    } else {
                        showNotification('当前已经是英语');
                    }
                }
                break;

            case 'setLangJa':
                if(hasLanguageInHash()) {
                    let currentLangJa = getCurrentLanguageFromHash();
                    if(currentLangJa !== 'ja'){
                        showNotification('切换到日语，即将重定向...');
                        setTimeout(() => redirectWithLanguage('ja'), 500);
                    } else {
                        showNotification('当前已经是日语');
                    }
                } else {
                    let currentLangStorage = localStorage.getItem('language');
                    if(currentLangStorage !== 'ja'){
                        setLanguageLocalStorageOnly('ja');
                    } else {
                        showNotification('当前已经是日语');
                    }
                }
                break;

            case 'setLangFr':
                if(hasLanguageInHash()) {
                    let currentLangFr = getCurrentLanguageFromHash();
                    if(currentLangFr !== 'fr'){
                        showNotification('切换到法语，即将重定向...');
                        setTimeout(() => redirectWithLanguage('fr'), 500);
                    } else {
                        showNotification('当前已经是法语');
                    }
                } else {
                    let currentLangStorage = localStorage.getItem('language');
                    if(currentLangStorage !== 'fr'){
                        setLanguageLocalStorageOnly('fr');
                    } else {
                        showNotification('当前已经是法语');
                    }
                }
                break;

            case 'setLangEs':
                if(hasLanguageInHash()) {
                    let currentLangEs = getCurrentLanguageFromHash();
                    if(currentLangEs !== 'es'){
                        showNotification('切换到西语，即将重定向...');
                        setTimeout(() => redirectWithLanguage('es'), 500);
                    } else {
                        showNotification('当前已经是西语');
                    }
                } else {
                    let currentLangStorage = localStorage.getItem('language');
                    if(currentLangStorage !== 'es'){
                        setLanguageLocalStorageOnly('es');
                    } else {
                        showNotification('当前已经是西语');
                    }
                }
                break;
        }
    }
})();