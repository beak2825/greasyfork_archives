// ==UserScript==
// @name         ITDOG 自动刷新器
// @version      1.7
// @description  定时刷新 itdog.cn 页面以重复测速（首页除外），支持自定义间隔和开关，主页不会刷新
// @author       Dahi
// @match        https://www.itdog.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @namespace https://greasyfork.org/users/1442595
// @downloadURL https://update.greasyfork.org/scripts/543843/ITDOG%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543843/ITDOG%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 MD3 样式
    GM_addStyle(`
        :root {
            --md-sys-color-primary: #6750A4;
            --md-sys-color-on-primary: #FFFFFF;
            --md-sys-color-primary-container: #EADDFF;
            --md-sys-color-on-primary-container: #21005D;
            --md-sys-color-secondary: #625B71;
            --md-sys-color-on-secondary: #FFFFFF;
            --md-sys-color-secondary-container: #E8DEF8;
            --md-sys-color-on-secondary-container: #1D192B;
            --md-sys-color-tertiary: #7D5260;
            --md-sys-color-on-tertiary: #FFFFFF;
            --md-sys-color-tertiary-container: #FFD8E4;
            --md-sys-color-on-tertiary-container: #31111D;
            --md-sys-color-error: #B3261E;
            --md-sys-color-on-error: #FFFFFF;
            --md-sys-color-error-container: #F9DEDC;
            --md-sys-color-on-error-container: #410E0B;
            --md-sys-color-outline: #79747E;
            --md-sys-color-background: #FFFBFE;
            --md-sys-color-on-background: #1C1B1F;
            --md-sys-color-surface: #FFFBFE;
            --md-sys-color-on-surface: #1C1B1F;
            --md-sys-color-surface-variant: #E7E0EC;
            --md-sys-color-on-surface-variant: #49454F;
            --md-sys-color-shadow: #000000;
        }

        .md3-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 16px;
            background-color: var(--md-sys-color-background);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: 'Roboto', Arial, sans-serif;
            width: 300px;
            border: 1px solid var(--md-sys-color-outline);
            color: var(--md-sys-color-on-background);
        }

        .md3-title {
            font-size: 1.25rem;
            font-weight: 500;
            margin: 0 0 16px 0;
            color: var(--md-sys-color-primary);
        }

        .md3-label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.875rem;
            color: var(--md-sys-color-on-surface-variant);
        }

        .md3-textfield {
            width: 100%;
            padding: 12px 16px;
            margin-bottom: 16px;
            border-radius: 4px;
            border: 1px solid var(--md-sys-color-outline);
            background-color: var(--md-sys-color-surface);
            font-size: 1rem;
            transition: border 0.2s;
        }

        .md3-textfield:focus {
            outline: none;
            border-color: var(--md-sys-color-primary);
        }

        .md3-switch {
            position: relative;
            display: inline-block;
            width: 42px;
            height: 24px;
            margin-right: 8px;
            vertical-align: middle;
        }

        .md3-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .md3-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--md-sys-color-surface-variant);
            transition: .4s;
            border-radius: 24px;
        }

        .md3-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: var(--md-sys-color-on-surface-variant);
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .md3-slider {
            background-color: var(--md-sys-color-primary);
        }

        input:checked + .md3-slider:before {
            transform: translateX(18px);
            background-color: var(--md-sys-color-on-primary);
        }

        .md3-button {
            padding: 10px 16px;
            border-radius: 20px;
            border: none;
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.1px;
            cursor: pointer;
            transition: background-color 0.2s;
            text-transform: uppercase;
        }

        .md3-button-group {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }

        .md3-button-filled {
            background-color: var(--md-sys-color-primary);
            color: var(--md-sys-color-on-primary);
        }

        .md3-button-filled:hover {
            background-color: #5E47A0;
        }

        .md3-button-tonal {
            background-color: var(--md-sys-color-secondary-container);
            color: var(--md-sys-color-on-secondary-container);
        }

        .md3-button-tonal:hover {
            background-color: #D5C4F0;
        }

        .md3-button-outlined {
            background-color: transparent;
            color: var(--md-sys-color-primary);
            border: 1px solid var(--md-sys-color-outline);
        }

        .md3-button-outlined:hover {
            background-color: rgba(103, 80, 164, 0.08);
        }

        .md3-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            background-color: var(--md-sys-color-inverse-surface);
            color: var(--md-sys-color-inverse-on-surface);
            border-radius: 4px;
            box-shadow: 0 3px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 0.875rem;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .md3-form-item {
            margin-bottom: 16px;
        }

        .md3-switch-container {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }

        .md3-switch-label {
            font-size: 0.875rem;
            color: var(--md-sys-color-on-surface);
        }
    `);

    // 默认配置
    const DEFAULT_INTERVAL = 300; // 默认 5 分钟（单位：秒）
    let refreshInterval = GM_getValue('refreshInterval', DEFAULT_INTERVAL);
    let isEnabled = GM_getValue('isEnabled', true);

    // 检查是否是首页
    const isHomePage = () => {
        return window.location.pathname === '/' || window.location.pathname === '/index.html';
    };

    // 创建设置面板
    const createSettingsPanel = () => {
        // 如果面板已存在，则不再重复创建
        if (document.getElementById('itdog-auto-refresh-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'itdog-auto-refresh-panel';
        panel.className = 'md3-panel';

        panel.innerHTML = `
            <h3 class="md3-title">自动刷新设置</h3>
            <div class="md3-form-item">
                <label class="md3-label">刷新间隔（秒）</label>
                <input type="number" id="refreshIntervalInput" class="md3-textfield" value="${refreshInterval}" min="10">
            </div>
            <div class="md3-switch-container">
                <label class="md3-switch">
                    <input type="checkbox" id="toggleEnabled" ${isEnabled ? 'checked' : ''}>
                    <span class="md3-slider"></span>
                </label>
                <span class="md3-switch-label">启用自动刷新</span>
            </div>
            <div class="md3-button-group">
                <button id="saveSettings" class="md3-button md3-button-filled">保存</button>
                <button id="refreshNow" class="md3-button md3-button-tonal">立即刷新</button>
                <button id="closePanel" class="md3-button md3-button-outlined">关闭</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('saveSettings').addEventListener('click', saveSettings);
        document.getElementById('refreshNow').addEventListener('click', () => {
            if (!isHomePage()) location.reload();
            else showToast('首页不支持自动刷新');
        });
        document.getElementById('closePanel').addEventListener('click', () => panel.remove());
    };

    // 保存设置
    const saveSettings = () => {
        refreshInterval = parseInt(document.getElementById('refreshIntervalInput').value) || DEFAULT_INTERVAL;
        isEnabled = document.getElementById('toggleEnabled').checked;
        GM_setValue('refreshInterval', refreshInterval);
        GM_setValue('isEnabled', isEnabled);
        showToast('设置已保存！');
        if (isEnabled && !isHomePage()) setupAutoRefresh();
    };

    // 显示提示信息
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'md3-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // 设置自动刷新
    const setupAutoRefresh = () => {
        if (!isEnabled || isHomePage()) return;
        showToast(`页面将在 ${refreshInterval} 秒后自动刷新`);
        setTimeout(() => location.reload(), refreshInterval * 1000);
    };

    // 初始化
    const init = () => {
        // 默认显示面板
        createSettingsPanel();
        // 添加油猴菜单命令
        GM_registerMenuCommand('打开自动刷新设置', createSettingsPanel);
        // 如果是首页则不启动自动刷新
        if (!isHomePage() && isEnabled) setupAutoRefresh();
    };

    // 确保页面加载完成后执行
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();