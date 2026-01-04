// ==UserScript==
// @name         家庭金会员助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Microsoft Family Gold Membership
// @author       dianran
// @license       MIT
// @match        https://account.microsoft.com/family/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522300/%E5%AE%B6%E5%BA%AD%E9%87%91%E4%BC%9A%E5%91%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522300/%E5%AE%B6%E5%BA%AD%E9%87%91%E4%BC%9A%E5%91%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultSettings = {
        enabled: true,
        isExpanded: false,  // 默认收起
        presets: [
            { name: "", id: "" }
        ],
        currentPreset: 0
    };

    // 获取设置
    function getSettings() {
        return GM_getValue('settings', defaultSettings);
    }

    // 保存设置
    function saveSettings(settings) {
        GM_setValue('settings', settings);
    }

    // 创建设置面板
    function createPanel() {
        const settings = getSettings();
        const panel = document.createElement('div');
        panel.id = 'ms-modifier-panel';

        // 设置基础样式
        panel.style.cssText = `
            position: fixed;
            top: 60%;
            transform: translateY(-50%);
            ${settings.isExpanded ? 'left: 0' : 'left: -310px'};
            background: white;
            padding: 15px;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            width: 280px;
            transition: left 0.3s ease;
        `;

        const toggleBtnStyle = `
            position: absolute;
            right: -32px;
            top: 60%;
            transform: translateY(-50%);
            width: 30px;
            height: 100px;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            padding: 0;
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 14px;
            letter-spacing: 2px;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            z-index: 10001;
        `;

        // 添加内部HTML
        panel.innerHTML = `
            <style>
                #ms-modifier-panel button {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    background: #0078d4;
                    color: white;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                #ms-modifier-panel button:hover {
                    background: #106ebe;
                }
                #ms-modifier-panel button.secondary {
                    background: #f0f0f0;
                    color: #333;
                }
                #ms-modifier-panel button.secondary:hover {
                    background: #e0e0e0;
                }
                #ms-modifier-panel input[type="text"] {
                    width: 100%;
                    padding: 6px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    margin: 4px 0;
                }
                #ms-modifier-panel .preset-item {
                    display: flex;
                    align-items: center;
                    margin: 8px 0;
                    padding: 8px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                }
                #ms-modifier-panel .preset-item.active {
                    border-color: #0078d4;
                    background: #f0f9ff;
                }
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background-color: #0078d4;
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                #requestLog {
                    margin-top: 10px;
                    padding: 8px;
                    background: #f8f8f8;
                    border-radius: 4px;
                    max-height: 150px;
                    overflow-y: auto;
                    font-size: 12px;
                }
            </style>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0">金会员助手</h3>
                <label class="switch">
                    <input type="checkbox" id="enableSwitch" ${settings.enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div id="presetContainer">
                ${settings.presets.map((preset, index) => `
                    <div class="preset-item ${index === settings.currentPreset ? 'active' : ''}" data-index="${index}">
                        <div style="flex-grow: 1">
                            <input type="text" class="preset-name" value="${preset.name}" placeholder="游戏名称">
                            <input type="text" class="preset-id" value="${preset.id}" placeholder="填写id并点击添加预设">
                        </div>
                        <div style="margin-left: 8px">
                            ${index === settings.currentPreset ?
                                '<button class="secondary" disabled>当前</button>' :
                                '<button class="use-preset">使用</button>'}
                            ${settings.presets.length > 1 ?
                                '<button class="delete-preset secondary">删除</button>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 10px">
                <button id="addPreset">添加预设</button>
            </div>
            <div id="requestLog"></div>
            <button id="toggle-panel" style="${toggleBtnStyle}">金会员助手</button>
        `;

        document.body.appendChild(panel);
        // 绑定事件处理器
        panel.addEventListener('click', function(e) {
            // 使用预设
            if (e.target.classList.contains('use-preset')) {
                const presetItem = e.target.closest('.preset-item');
                const index = parseInt(presetItem.dataset.index);
                if (!isNaN(index)) {
                    const settings = getSettings();
                    settings.currentPreset = index;
                    saveSettings(settings);
                    refreshPanel();
                    logToPanel(`已切换到预设: ${settings.presets[index].name}`);
                }
            }

            // 删除预设
            if (e.target.classList.contains('delete-preset')) {
                const presetItem = e.target.closest('.preset-item');
                const index = parseInt(presetItem.dataset.index);
                if (!isNaN(index)) {
                    const settings = getSettings();
                    settings.presets.splice(index, 1);
                    if (settings.currentPreset >= index) {
                        settings.currentPreset = Math.max(0, settings.currentPreset - 1);
                    }
                    saveSettings(settings);
                    refreshPanel();
                    logToPanel('已删除预设');
                }
            }
        });

        // 绑定其他事件
        document.getElementById('toggle-panel').addEventListener('click', togglePanel);
        document.getElementById('addPreset').addEventListener('click', addPreset);
        document.getElementById('enableSwitch').addEventListener('change', toggleEnable);

        // 为预设输入框添加事件监听
        const presetInputs = panel.querySelectorAll('.preset-name, .preset-id');
        presetInputs.forEach(input => {
            input.addEventListener('change', updatePresets);
            input.addEventListener('blur', updatePresets);
        });
    }

    // 切换面板显示状态
    function togglePanel() {
        const panel = document.getElementById('ms-modifier-panel');
        const settings = getSettings();
        settings.isExpanded = !settings.isExpanded;

        panel.style.left = settings.isExpanded ? '0' : '-310px';
        saveSettings(settings);
    }

    // 切换启用状态
    function toggleEnable(e) {
        const settings = getSettings();
        settings.enabled = e.target.checked;
        saveSettings(settings);
        logToPanel(`修改器已${settings.enabled ? '启用' : '禁用'}`);
    }

    // 添加预设
    function addPreset() {
        const settings = getSettings();
        settings.presets.push({
            name: '',
            id: ''
        });
        saveSettings(settings);
        refreshPanel();
        logToPanel('已添加新预设');
    }

    // 更新预设
    function updatePresets() {
        const settings = getSettings();
        const presetContainer = document.getElementById('presetContainer');
        const presetItems = presetContainer.querySelectorAll('.preset-item');

        const newPresets = Array.from(presetItems).map((item, index) => ({
            name: item.querySelector('.preset-name').value,
            id: item.querySelector('.preset-id').value
        }));

        // 确保 currentPreset 的有效性
        if (settings.currentPreset >= newPresets.length) {
            settings.currentPreset = newPresets.length - 1;
        }

        settings.presets = newPresets;
        saveSettings(settings);
        logToPanel('预设已更新');
        refreshPanel(); // 刷新面板以更新视觉状态
    }

    // 刷新面板
    function refreshPanel() {
        const oldPanel = document.getElementById('ms-modifier-panel');
        if (oldPanel) {
            oldPanel.remove();
        }
        createPanel();
    }

    // 记录日志
    function logToPanel(message) {
        const logDiv = document.getElementById('requestLog');
        if (logDiv) {
            const time = new Date().toLocaleTimeString();
            logDiv.innerHTML = `[${time}] ${message}<br>` + logDiv.innerHTML;
        }
    }

    // 获取当前 availabilityId
    function getCurrentAvailabilityId() {
        const settings = getSettings();
        return settings.enabled ? settings.presets[settings.currentPreset]?.id : null;
    }

    // 修改 products 参数
    function modifyProducts(productsStr) {
        try {
            const customAvailabilityId = getCurrentAvailabilityId();
            if (!customAvailabilityId) return productsStr;

            // 解码 URL 编码的字符串
            let decodedProducts = productsStr;
            try {
                decodedProducts = decodeURIComponent(productsStr);
            } catch (e) {
                // 如果解码失败，使用原始字符串
                console.log('URL解码失败，使用原始字符串');
            }

            // 解析 JSON
            const products = JSON.parse(decodedProducts);

            if (Array.isArray(products) && products[0]) {
                products[0].availabilityId = customAvailabilityId;
                logToPanel(`已修改 availabilityId: ${customAvailabilityId}`);

                // 如果原始输入是URL编码的，则重新编码
                if (productsStr !== decodedProducts) {
                    return encodeURIComponent(JSON.stringify(products));
                }
                return JSON.stringify(products);
            }
            return productsStr;
        } catch (e) {
            console.error('修改 products 失败:', e);
            return productsStr;
        }
    }

    // 处理表单提交前的数据修改
    function processFormBeforeSubmit(form) {
        try {
            const customAvailabilityId = getCurrentAvailabilityId();
            if (!customAvailabilityId) return true;

            // 获取所有表单数据
            const formData = new FormData(form);
            const data = {};
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }

            // 修改 products 字段
            if (data.products) {
                data.products = modifyProducts(data.products);
            }

            // 清空原有表单字段
            while (form.firstChild) {
                form.removeChild(form.firstChild);
            }

            // 重新填充修改后的数据
            for (const [key, value] of Object.entries(data)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }

            return true;
        } catch (e) {
            console.error('处理表单数据失败:', e);
            return false;
        }
    }

    // 拦截 XHR 请求
    const originalXHR = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        if (this._url && this._url.includes('purchase.md.mp.microsoft.com/v7.0/users/me/orders') && data) {
            try {
                const customAvailabilityId = getCurrentAvailabilityId();
                if (customAvailabilityId) {
                    const jsonData = JSON.parse(data);
                    if (jsonData.items && jsonData.items[0]) {
                        jsonData.items[0].availabilityId = customAvailabilityId;
                        data = JSON.stringify(jsonData);
                        logToPanel(`已修改 XHR 请求的 availabilityId: ${customAvailabilityId}`);
                    }
                }
            } catch (e) {
                console.error('修改 XHR 请求失败:', e);
            }
        }
        return originalXHR.call(this, data);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    // 拦截表单提交事件
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.action && form.action.includes('microsoft.com/store/purchase/buynowui/buynow')) {
            if (!processFormBeforeSubmit(form)) {
                e.preventDefault();
            }
        }
    }, true);

    // 监听新元素添加
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const forms = document.querySelectorAll('form[action*="microsoft.com/store/purchase/buynowui/buynow"]');
                forms.forEach(form => {
                    if (!form.dataset.processed) {
                        form.dataset.processed = 'true';
                        processFormBeforeSubmit(form);
                    }
                });
            }
        }
    });

    // 开始监听 DOM 变化
    window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });

    // 监听表单提交的原生方法
    const originalSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function() {
        if (this.action && this.action.includes('microsoft.com/store/purchase/buynowui/buynow')) {
            processFormBeforeSubmit(this);
        }
        return originalSubmit.call(this);
    };

    // 在家庭账户页面显示设置面板
    if (window.location.href.includes('account.microsoft.com/family')) {
        window.addEventListener('load', function() {
            createPanel();
            document.getElementById('ms-modifier-panel').style.display = 'block';
            logToPanel('脚本已加载');
        });
    }
})();