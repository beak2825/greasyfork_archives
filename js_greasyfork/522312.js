// ==UserScript==
// @name         xbox购物车（多区域家庭版）
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Microsoft Family Multi-Region Shopping Cart
// @author       dianran
// @license      MIT
// @match        https://www.xbox.com/*
// @match        https://www.microsoft.com/store/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/522312/xbox%E8%B4%AD%E7%89%A9%E8%BD%A6%EF%BC%88%E5%A4%9A%E5%8C%BA%E5%9F%9F%E5%AE%B6%E5%BA%AD%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522312/xbox%E8%B4%AD%E7%89%A9%E8%BD%A6%EF%BC%88%E5%A4%9A%E5%8C%BA%E5%9F%9F%E5%AE%B6%E5%BA%AD%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const STORE_KEY = 'gm_xbox_hook_store_earfewfa_v0';
    const CONFIG_KEY = 'gm_xbox_config_v0';
    const API_ENDPOINTS = {
        LOAD_CART: 'https://cart.production.store-web.dynamics.com/v1.0/cart/loadCart?cartType=consumer&appId=XboxWeb',
        PARENTAL_APPROVAL: 'https://cart.production.store-web.dynamics.com/v1.0/Cart/RequestParentalApproval?appId=BuyNow'
    };

    // 市场信息配置
    const MARKETS_INFO = {
        NG: { market: 'NG', locale: 'en-NG', friendlyName: 'cart-NG' },
        EG: { market: 'EG', locale: 'en-EG', friendlyName: 'cart-EG' },
        TR: { market: 'TR', locale: 'tr-TR', friendlyName: 'cart-TR' },
        AR: { market: 'AR', locale: 'es-AR', friendlyName: 'cart-AR' }
    };

    // 默认配置
    const DEFAULT_CONFIG = {
        enableMarketInfo: true,
        enableCartIdModify: true,
        activePresetId: null,
        presets: [],
        productId: '',
        skuId: '',
        availabilityId: '',
        selectedMarket: 'NG'
    };

    // 日志工具
    const logger = {
        log: (...args) => console.log('[Xbox Script]', ...args),
        error: (...args) => console.error('[Xbox Script Error]', ...args),
        debug: (...args) => console.debug('[Xbox Script Debug]', ...args)
    };

    // 存储工具
    const storage = {
        getCartId: () => GM_getValue(STORE_KEY, ''),
        setCartId: (cartId) => GM_setValue(STORE_KEY, cartId),
        getConfig: () => GM_getValue(CONFIG_KEY, DEFAULT_CONFIG),
        setConfig: (config) => GM_setValue(CONFIG_KEY, config),
        clearCartId: () => GM_setValue(STORE_KEY, '')
    };
    // 配置面板样式
    const PANEL_STYLES = `
        .xbox-config-panel {
            position: fixed;
            top: 10%;
            right: 0;
            background: white;
            border: 1px solid #e4e4e4;
            padding: 15px;
            z-index: 10000;
            border-radius: 5px 0 0 5px;
            box-shadow: -2px 0 10px rgba(0,0,0,0.15);
            width: 90%;
            max-width: 400px;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            transition: all 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
            transform: translateX(100%);
        }

        @media screen and (max-width: 768px) {
            .xbox-config-panel {
                width: 85%;
                max-width: 320px;
                padding: 12px;
            }
            .xbox-config-panel.visible {
                transform: translateX(0);
            }
            .xbox-toggle-button.expanded {
                right: 85%;
            }
            .id-config-grid {
                grid-template-columns: 1fr;
                gap: 6px;
            }
            .xbox-preset-item {
                padding: 8px;
            }
            .xbox-dialog {
                width: 95%;
                padding: 15px;
            }
            .xbox-config-section {
                padding: 10px;
            }
            .xbox-preset-actions {
                gap: 4px;
            }
            .xbox-preset-action {
                padding: 2px 4px;
            }
        }

        .xbox-config-panel.visible {
            display: block;
            transform: translateX(0);
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }

        .xbox-config-panel h3 {
            margin: 0 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #007bff;
            color: #007bff;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .xbox-config-section {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
        }

        .xbox-config-section-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: #2c3e50;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .xbox-config-panel input[type="text"] {
            width: 100%;
            margin: 2px 0;
            padding: 4px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 12px;
            transition: border-color 0.2s ease;
        }

        .xbox-config-panel input[type="text"]:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .xbox-config-panel input[type="text"]:disabled {
            background-color: #e9ecef;
            cursor: not-allowed;
        }

        .xbox-config-panel button {
            margin: 4px;
            padding: 6px 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        .xbox-config-panel button:hover {
            background: #0056b3;
        }

        .xbox-config-panel button:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }

        /* Switch 开关样式 */
        .switch-wrapper {
            display: flex;
            align-items: center;
            margin: 6px 0;
            cursor: pointer;
        }

        .switch-wrapper:hover .switch {
            border-color: #0056b3;
        }

        .switch {
            position: relative;
            width: 32px;
            height: 18px;
            background: #e9ecef;
            border-radius: 9px;
            margin-right: 8px;
            transition: all .3s;
            border: 1px solid #ced4da;
        }

        .switch::after {
            content: '';
            position: absolute;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: white;
            top: 1px;
            left: 1px;
            transition: all .3s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .switch-input {
            display: none;
        }

        .switch-input:checked + .switch {
            background: #007bff;
            border-color: #0056b3;
        }

        .switch-input:checked + .switch::after {
            left: 15px;
        }

        .switch-label {
            font-size: 11px;
            color: #444;
            user-select: none;
        }

        .switch-wrapper:hover .switch-label {
            color: #007bff;
        }

        /* 紧凑布局样式 */
        .id-config-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 6px;
        }

        .id-input {
            position: relative;
        }

        .id-input label {
            font-size: 11px;
            color: #666;
            margin-bottom: 2px;
        }

        .id-input input {
            width: 100%;
            padding: 3px 6px;
            font-size: 11px;
            height: 24px;
        }

        .xbox-config-section.compact {
            padding: 8px;
        }

        .xbox-config-section.compact .xbox-config-section-title {
            font-size: 12px;
            margin-bottom: 4px;
        }

        /* 市场选择器样式 */
        .market-selector-wrapper {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #e9ecef;
        }

        .market-label {
        display: block;
        font-size: 12px;
        color: #2c3e50;
        font-weight: 600;
        margin-bottom: 4px;
        }

        .market-select {
        width: 100%;
        padding: 4px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 12px;
        background-color: white;
        color: #333;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        }

        .market-select:focus {
        outline: none !important;
        box-shadow: none !important;
        border-color: #007bff;
        -webkit-box-shadow: none !important;
        }

        .market-select:focus-visible {
        outline: none !important;
        }

        .market-select::-moz-focus-inner {
        border: 0;
        }

        .market-select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
        }

        /* 手动配置区域样式 */
        .manual-config {
            background: white;
            border-radius: 4px;
            padding: 8px;
            border: 1px solid #e9ecef;
        }

        .manual-config-buttons {
            text-align: right;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #e9ecef;
        }

        /* 切换按钮样式 */
        .xbox-toggle-button {
        position: fixed;
        top: 30%;
        right: 0;
        background: #0078d7;
        color: white;
        padding: 6px 4px;
        border-radius: 4px 0 0 4px;
        cursor: pointer;
        z-index: 10001;
        transition: all 0.3s ease;
        box-shadow: -1px 0 3px rgba(0,0,0,0.2);
        font-size: 15px;
        font-weight: 500;
        border: none;
        outline: none !important;
        transform: translateY(-50%);
        height: auto;
        min-height: 45px;
        }

        /* 对支持 writing-mode 的浏览器应用竖排 */
        @supports (writing-mode: vertical-rl) {
        .xbox-toggle-button {
        writing-mode: vertical-rl;
        -webkit-writing-mode: vertical-rl;
        text-orientation: upright;
        }
        }

        /* 对不支持 writing-mode 的浏览器（如 QQ 浏览器）使用旧的换行方案 */
        @supports not (writing-mode: vertical-rl) {
        .xbox-toggle-button {
        width: 20px;
        text-align: center;
        word-break: break-all;
        line-height: 1.2;
        }
        }

        .xbox-toggle-button:hover {
            background: #106ebe;
        }

        .xbox-toggle-button.expanded {
            right: 400px;
        }

        .xbox-toggle-button:focus {
            outline: none !important;
            outline-style: none;
            box-shadow: none;
            border-color: transparent;
        }

        .xbox-toggle-button::-moz-focus-inner {
            border: 0;
            outline: none;
        }

        @media screen and (max-width: 768px) {
            .xbox-toggle-button {
                padding: 4px 2px;
                font-size: 13px;
                min-height: 35px;
            }
            .xbox-toggle-button.expanded {
                right: 320px;  /* 改为固定值，与面板宽度一致 */
            }
            .xbox-config-panel {
                width: 85%;
                max-width: 320px;
                padding: 12px;
            }
            .xbox-config-panel.visible {
                transform: translateX(0);
            }
        }

        /* 预设样式 */
        .xbox-preset-item {
            background: white;
            border: 1px solid #e4e4e4;
            border-radius: 4px;
            margin-bottom: 8px;
            padding: 10px;
            transition: all 0.2s ease;
        }

        .xbox-preset-item.active {
            border-color: #007bff;
            box-shadow: 0 0 0 1px #007bff;
        }

        .xbox-preset-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }

        .xbox-preset-name {
            font-weight: 600;
            color: #2c3e50;
            font-size: 12px;
        }

        .xbox-preset-actions {
            display: flex;
            gap: 6px;
        }

        .xbox-preset-action {
            padding: 3px 6px;
            font-size: 11px;
            border-radius: 3px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .xbox-preset-action:hover {
            background: #e9ecef;
        }

        .xbox-preset-details {
            font-size: 11px;
            color: #666;
            padding: 6px;
            background: #f8f9fa;
            border-radius: 3px;
        }

        .xbox-preset-details > div {
            margin: 3px 0;
        }

        /* 辅助样式 */
        .xbox-small-button {
            padding: 3px 6px !important;
            font-size: 11px !important;
            background: #28a745 !important;
        }

        .xbox-small-button:hover {
            background: #218838 !important;
        }

        .xbox-note {
            font-size: 11px;
            color: #666;
            font-weight: normal;
        }

        .xbox-no-presets {
            color: #666;
            text-align: center;
            padding: 8px;
            font-style: italic;
            font-size: 11px;
        }

        /* 对话框样式 */
        .xbox-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10003;
        }

        .xbox-dialog {
            background: white;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .xbox-dialog h4 {
            margin: 0 0 20px 0;
            color: #2c3e50;
            font-size: 16px;
            font-weight: 600;
        }

        .xbox-dialog-content {
            margin-bottom: 20px;
        }

        .xbox-dialog-field {
            margin-bottom: 15px;
        }

        .xbox-dialog-field label {
            display: block;
            margin-bottom: 5px;
            color: #495057;
            font-size: 12px;
        }

        .xbox-dialog-field input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 12px;
        }

        .xbox-dialog-field input:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .xbox-dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .xbox-dialog-buttons button {
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            border: none;
        }

        .xbox-dialog-buttons button:first-child {
            background: #6c757d;
            color: white;
        }

        .xbox-dialog-buttons button:last-child {
            background: #007bff;
            color: white;
        }

        /* 通知样式 */
        .xbox-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10002;
            animation: fadeInOut 2s ease forwards;
            font-size: 12px;
        }

        .xbox-notification.error {
            background: #dc3545;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(20px); }
        }
    `;
    // ConfigPanel 类实现
    class ConfigPanel {
        constructor() {
            this.config = storage.getConfig();

            // 绑定事件处理器
            this.handleToggleClick = this.handleToggleClick.bind(this);
            this.handleMarketChange = this.handleMarketChange.bind(this);
            this.handleCartIdChange = this.handleCartIdChange.bind(this);
            this.handleSave = this.handleSave.bind(this);
            this.handleReset = this.handleReset.bind(this);
            this.handleAddPreset = this.handleAddPreset.bind(this);
            this.handlePresetAction = this.handlePresetAction.bind(this);
            this.handleMarketSelect = this.handleMarketSelect.bind(this);

            if (this.shouldShowPanel()) {
                this.createPanel();
                this.addStyles();
                this.bindEvents();
            }
        }

        shouldShowPanel() {
            return window.location.hostname === 'www.xbox.com';
        }

        addStyles() {
            if (this.shouldShowPanel()) {
                GM_addStyle(PANEL_STYLES);
            }
        }

        createPanel() {
            if (!this.shouldShowPanel()) {
                return;
            }

            const panel = document.createElement('div');
            panel.className = 'xbox-config-panel';
            panel.innerHTML = this.generatePanelHTML();

            const toggleButton = document.createElement('button');
            toggleButton.className = 'xbox-toggle-button';
            toggleButton.textContent = '购物车';

            // 检测浏览器类型
            const isQQBrowser = navigator.userAgent.toLowerCase().indexOf('qqbrowser') > -1;
            if (isQQBrowser) {
            // QQ浏览器特殊处理
            toggleButton.style.width = '20px';
            toggleButton.style.wordBreak = 'break-all';
            toggleButton.style.lineHeight = '1.2';
            }

            document.body.appendChild(panel);
            document.body.appendChild(toggleButton);

            this.panel = panel;
            this.toggleButton = toggleButton;
        }

        cleanup() {
            // 清理所有事件监听器
            this.toggleButton?.removeEventListener('click', this.handleToggleClick);
            document.getElementById('xbox-market-enabled')?.removeEventListener('change', this.handleMarketChange);
            document.getElementById('xbox-cartid-enabled')?.removeEventListener('change', this.handleCartIdChange);
            document.getElementById('xbox-save')?.removeEventListener('click', this.handleSave);
            document.getElementById('xbox-reset')?.removeEventListener('click', this.handleReset);
            document.getElementById('add-preset')?.removeEventListener('click', this.handleAddPreset);
            document.getElementById('presets-container')?.removeEventListener('click', this.handlePresetAction);
            document.getElementById('market-selector')?.removeEventListener('change', this.handleMarketSelect);
        }

        // 事件处理器
        handleToggleClick() {
            this.panel.classList.toggle('visible');
            this.toggleButton.classList.toggle('expanded');
            if (this.panel.classList.contains('visible')) {
                this.toggleButton.textContent = '收起';
            } else {
                this.toggleButton.textContent = '购物车';
            }
        }

        handleMarketChange(e) {
            this.config.enableMarketInfo = e.target.checked;
            const marketSelector = document.getElementById('market-selector');
            if (marketSelector) {
                marketSelector.disabled = !e.target.checked;
            }
            storage.setConfig(this.config);
            this.showNotification('市场设置已更新');
        }

        handleCartIdChange(e) {
            this.config.enableCartIdModify = e.target.checked;
            storage.setConfig(this.config);
            this.showNotification('购买请求ID设置已更新');
        }

        handleMarketSelect(e) {
            this.config.selectedMarket = e.target.value;
            storage.setConfig(this.config);
            this.showNotification(`已切换到${e.target.selectedOptions[0].text}`);
        }

        handleSave() {
            this.saveConfig();
        }

        handleReset() {
            this.resetConfig();
        }

        handleAddPreset() {
            this.showPresetDialog();
        }

        handlePresetAction(e) {
            const button = e.target.closest('.xbox-preset-action');
            if (!button) return;

            const action = button.dataset.action;
            const presetId = button.dataset.id;

            switch (action) {
                case 'toggle':
                    this.togglePreset(presetId);
                    break;
                case 'edit':
                    this.showPresetDialog(presetId);
                    break;
                case 'delete':
                    this.deletePreset(presetId);
                    break;
            }
        }

        bindEvents() {
            this.toggleButton.addEventListener('click', this.handleToggleClick);

            document.getElementById('xbox-market-enabled')?.addEventListener('change', this.handleMarketChange);
            document.getElementById('xbox-cartid-enabled')?.addEventListener('change', this.handleCartIdChange);
            document.getElementById('xbox-save')?.addEventListener('click', this.handleSave);
            document.getElementById('xbox-reset')?.addEventListener('click', this.handleReset);
            document.getElementById('add-preset')?.addEventListener('click', this.handleAddPreset);
            document.getElementById('presets-container')?.addEventListener('click', this.handlePresetAction);
            document.getElementById('market-selector')?.addEventListener('change', this.handleMarketSelect);

            // 初始化市场选择器状态
            const marketSelector = document.getElementById('market-selector');
            if (marketSelector) {
                marketSelector.disabled = !this.config.enableMarketInfo;
                marketSelector.value = this.config.selectedMarket || 'NG';
            }
        }
    generatePanelHTML() {
            const presetsHtml = this.generatePresetsHtml();

            return `
                <h3>XBOX家庭购物车</h3>
                <div class="xbox-config-section compact">
                    <div class="xbox-config-section-title">基本设置</div>
                    <label class="switch-wrapper">
                        <input type="checkbox" id="xbox-market-enabled" class="switch-input"
                            ${this.config.enableMarketInfo ? 'checked' : ''}>
                        <span class="switch"></span>
                        <span class="switch-label">修改区域市场</span>
                    </label>
                    <label class="switch-wrapper">
                        <input type="checkbox" id="xbox-cartid-enabled" class="switch-input"
                            ${this.config.enableCartIdModify ? 'checked' : ''}>
                        <span class="switch"></span>
                        <span class="switch-label">修改家庭批准ID</span>
                    </label>
                    <div class="market-selector-wrapper">
                        <label for="market-selector" class="market-label">选择区域市场:</label>
                        <select id="market-selector" class="market-select" ${!this.config.enableMarketInfo ? 'disabled' : ''}>
                            <option value="NG" ${this.config.selectedMarket === 'NG' ? 'selected' : ''}>尼日利亚 (NG)</option>
                            <option value="EG" ${this.config.selectedMarket === 'EG' ? 'selected' : ''}>埃及 (EG)</option>
                            <option value="TR" ${this.config.selectedMarket === 'TR' ? 'selected' : ''}>土耳其 (TR)</option>
                            <option value="AR" ${this.config.selectedMarket === 'AR' ? 'selected' : ''}>阿根廷 (AR)</option>
                        </select>
                    </div>
                </div>

                <div class="xbox-config-section">
                    <div class="xbox-config-section-title">
                        商品ID预设
                        <button id="add-preset" class="xbox-small-button">添加预设</button>
                    </div>
                    <div id="presets-container">
                        ${presetsHtml}
                    </div>
                </div>

                <div class="xbox-config-section compact">
                    <div class="xbox-config-section-title">
                        手动配置
                        <span class="xbox-note">${this.config.activePresetId ? '(使用预设值)' : '(手动配置)'}</span>
                    </div>
                    <div class="manual-config">
                        <div class="id-config-grid">
                            <div class="id-input">
                                <label>Product ID:</label>
                                <input type="text" id="productId" value="${this.config.productId}"
                                    placeholder="留空则不改"
                                    ${this.config.activePresetId ? 'disabled' : ''}>
                            </div>
                            <div class="id-input">
                                <label>Sku ID:</label>
                                <input type="text" id="skuId" value="${this.config.skuId}"
                                    placeholder="留空则不改"
                                    ${this.config.activePresetId ? 'disabled' : ''}>
                            </div>
                            <div class="id-input">
                                <label>Availability ID:</label>
                                <input type="text" id="availabilityId" value="${this.config.availabilityId}"
                                    placeholder="留空则不改"
                                    ${this.config.activePresetId ? 'disabled' : ''}>
                            </div>
                        </div>
                        <div class="manual-config-buttons">
                            <button id="xbox-save" ${this.config.activePresetId ? 'disabled' : ''}>保存配置</button>
                            <button id="xbox-reset" class="xbox-reset">重置配置</button>
                        </div>
                    </div>
                </div>
            `;
        }

        generatePresetsHtml() {
            if (!this.config.presets.length) {
                return '<p class="xbox-no-presets">暂无预设</p>';
            }

            return this.config.presets.map(preset => `
                <div class="xbox-preset-item ${preset.id === this.config.activePresetId ? 'active' : ''}">
                    <div class="xbox-preset-header">
                        <span class="xbox-preset-name">${preset.name}</span>
                        <div class="xbox-preset-actions">
                            <button class="xbox-preset-action" data-action="toggle" data-id="${preset.id}">
                                ${preset.id === this.config.activePresetId ? '禁用' : '启用'}
                            </button>
                            <button class="xbox-preset-action" data-action="edit" data-id="${preset.id}">
                                编辑
                            </button>
                            <button class="xbox-preset-action" data-action="delete" data-id="${preset.id}">
                                删除
                            </button>
                        </div>
                    </div>
                    <div class="xbox-preset-details">
                        <div>Product ID: ${preset.productId || '无'}</div>
                        <div>Sku ID: ${preset.skuId || '无'}</div>
                        <div>Availability ID: ${preset.availabilityId || '无'}</div>
                    </div>
                </div>
            `).join('');
        }

        showPresetDialog(presetId = null) {
            const preset = presetId ? this.config.presets.find(p => p.id === presetId) : null;
            const dialog = document.createElement('div');
            dialog.className = 'xbox-dialog-overlay';
            dialog.innerHTML = `
                <div class="xbox-dialog">
                    <h4>${preset ? '编辑预设' : '添加预设'}</h4>
                    <div class="xbox-dialog-content">
                        <div class="xbox-dialog-field">
                            <label>预设名称:</label>
                            <input type="text" id="preset-name" value="${preset?.name || ''}" placeholder="输入游戏名称">
                        </div>
                        <div class="xbox-dialog-field">
                            <label>Product ID:</label>
                            <input type="text" id="preset-productId" value="${preset?.productId || ''}" placeholder="留空则不改">
                        </div>
                        <div class="xbox-dialog-field">
                            <label>Sku ID:</label>
                            <input type="text" id="preset-skuId" value="${preset?.skuId || ''}" placeholder="留空则不改">
                        </div>
                        <div class="xbox-dialog-field">
                            <label>Availability ID:</label>
                            <input type="text" id="preset-availabilityId" value="${preset?.availabilityId || ''}" placeholder="留空则不改">
                        </div>
                    </div>
                    <div class="xbox-dialog-buttons">
                        <button id="dialog-cancel">取消</button>
                        <button id="dialog-confirm">${preset ? '保存' : '添加'}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(dialog);

            // 绑定对话框的事件处理器
            const handleCancel = () => {
                dialog.remove();
            };

            const handleConfirm = () => {
                const name = dialog.querySelector('#preset-name').value.trim();
                const productId = dialog.querySelector('#preset-productId').value.trim();
                const skuId = dialog.querySelector('#preset-skuId').value.trim();
                const availabilityId = dialog.querySelector('#preset-availabilityId').value.trim();

                if (!name) {
                    this.showNotification('请输入预设名称', 'error');
                    return;
                }

                if (!productId && !skuId && !availabilityId) {
                    this.showNotification('至少需要填写一个ID', 'error');
                    return;
                }

                if (preset) {
                    this.updatePreset(presetId, { name, productId, skuId, availabilityId });
                } else {
                    this.addPreset({ name, productId, skuId, availabilityId });
                }

                dialog.remove();
            };

            dialog.querySelector('#dialog-cancel').addEventListener('click', handleCancel);
            dialog.querySelector('#dialog-confirm').addEventListener('click', handleConfirm);

            // ESC键关闭对话框
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    dialog.remove();
                    document.removeEventListener('keydown', handleKeyDown);
                }
            };
            document.addEventListener('keydown', handleKeyDown);
        }
    showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `xbox-notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 2000);
        }

        addPreset(preset) {
            const newPreset = {
                ...preset,
                id: Date.now().toString(),
            };

            this.config.presets.push(newPreset);
            this.saveConfig();
            this.refreshPanel();
            this.showNotification('预设添加成功');
        }

        updatePreset(presetId, newData) {
            const index = this.config.presets.findIndex(p => p.id === presetId);
            if (index === -1) return;

            this.config.presets[index] = {
                ...this.config.presets[index],
                ...newData,
                id: presetId
            };

            this.saveConfig();
            this.refreshPanel();
            this.showNotification('预设更新成功');
        }

        deletePreset(presetId) {
            if (this.config.activePresetId === presetId) {
                this.config.activePresetId = null;
            }

            this.config.presets = this.config.presets.filter(p => p.id !== presetId);
            this.saveConfig();
            this.refreshPanel();
            this.showNotification('预设删除成功');
        }

        togglePreset(presetId) {
            if (this.config.activePresetId === presetId) {
                this.config.activePresetId = null;
            } else {
                this.config.activePresetId = presetId;
            }

            this.saveConfig();
            this.refreshPanel();
            this.showNotification(this.config.activePresetId ? '预设已启用' : '预设已禁用');
        }

        saveConfig() {
            const config = {
                enableMarketInfo: document.getElementById('xbox-market-enabled')?.checked ?? true,
                enableCartIdModify: document.getElementById('xbox-cartid-enabled')?.checked ?? true,
                activePresetId: this.config.activePresetId,
                presets: this.config.presets,
                productId: document.getElementById('productId')?.value.trim() ?? '',
                skuId: document.getElementById('skuId')?.value.trim() ?? '',
                availabilityId: document.getElementById('availabilityId')?.value.trim() ?? '',
                selectedMarket: document.getElementById('market-selector')?.value || 'NG'
            };

            this.config = config;
            storage.setConfig(config);
            this.showNotification('配置已保存');
        }

        resetConfig() {
            this.cleanup();
            // 只重置手动配置的三个ID字段
            this.config = {
                ...this.config,
                productId: '',
                skuId: '',
                availabilityId: ''
            };
            storage.setConfig(this.config);

            if (this.panel) {
                this.panel.innerHTML = this.generatePanelHTML();
            }

            this.bindEvents();
            this.showNotification('手动配置ID已重置');
        }

        refreshPanel() {
            if (this.panel) {
                this.cleanup();
                this.panel.innerHTML = this.generatePanelHTML();
                this.bindEvents();
            }
        }

        getConfig() {
            return this.config;
        }
    }
    // 请求处理器类
    class RequestHandler {
        constructor() {
            this.configPanel = new ConfigPanel();
        }

        isScriptEnabled() {
            return true;
        }

        async handleLoadCart(request) {
            const requestBody = await request.clone().text();
            let modifiedBody;

            try {
                modifiedBody = JSON.parse(requestBody);
                const config = this.configPanel.getConfig();

                // 修改市场信息
                if (config.enableMarketInfo) {
                    const marketInfo = MARKETS_INFO[config.selectedMarket] || MARKETS_INFO.NG;
                    modifiedBody = {
                        ...modifiedBody,
                        ...marketInfo
                    };
                    logger.log('修改市场信息:', marketInfo);
                }

                // 修改商品ID - 根据预设或手动配置
                if (modifiedBody.itemsToAdd?.items?.length > 0) {
                    const item = modifiedBody.itemsToAdd.items[0];
                    let modified = false;

                    // 检查是否有启用的预设
                    if (config.activePresetId) {
                        const activePreset = config.presets.find(p => p.id === config.activePresetId);
                        if (activePreset) {
                            if (activePreset.productId) {
                                item.productId = activePreset.productId;
                                modified = true;
                            }
                            if (activePreset.skuId) {
                                item.skuId = activePreset.skuId;
                                modified = true;
                            }
                            if (activePreset.availabilityId) {
                                item.availabilityId = activePreset.availabilityId;
                                modified = true;
                            }
                            if (modified) {
                                logger.log('使用预设修改商品ID:', item);
                            }
                        }
                    } else {
                        // 使用手动配置
                        if (config.productId) {
                            item.productId = config.productId;
                            modified = true;
                        }
                        if (config.skuId) {
                            item.skuId = config.skuId;
                            modified = true;
                        }
                        if (config.availabilityId) {
                            item.availabilityId = config.availabilityId;
                            modified = true;
                        }
                        if (modified) {
                            logger.log('使用手动配置修改商品ID:', item);
                        }
                    }
                }

                logger.debug('修改后的请求体:', modifiedBody);
            } catch (error) {
                logger.error('解析请求体失败:', error);
                return request;
            }

            return new Request(request.url, {
                method: request.method,
                headers: request.headers,
                body: JSON.stringify(modifiedBody),
                mode: request.mode,
                credentials: request.credentials,
                cache: request.cache,
                redirect: request.redirect,
                referrer: request.referrer,
                integrity: request.integrity
            });
        }

        handleParentalApproval(options) {
            if (!options.body) {
                logger.error('家长审批请求体为空');
                return options;
            }

            try {
                const body = JSON.parse(options.body);
                const config = this.configPanel.getConfig();

                // 只在开启了cartId修改时才修改
                if (!config.enableCartIdModify) {
                    logger.debug('已禁用cartId修改，保持原值');
                    return options;
                }

                const storedCartId = storage.getCartId();
                logger.log('当前存储的cartId:', storedCartId);

                if (!storedCartId) {
                    logger.error('找不到存储的cartId');
                    return options;
                }

                const modifiedBody = {
                    ...body,
                    cartId: storedCartId,
                    client: 'XboxCom'
                };

                logger.log('修改家长审批请求:', modifiedBody);

                return {
                    ...options,
                    body: JSON.stringify(modifiedBody)
                };
            } catch (error) {
                logger.error('修改家长审批请求失败:', error);
                return options;
            }
        }

        async handleResponse(response, url) {
            try {
                if (url === API_ENDPOINTS.LOAD_CART) {
                    const responseData = await response.clone().json();
                    if (responseData?.cart?.id) {
                        storage.setCartId(responseData.cart.id);
                        logger.log('保存购物车ID成功:', responseData.cart.id);
                    }
                }
            } catch (error) {
                logger.error('处理响应失败:', error);
            }
            return response;
        }
    }

    // 劫持 fetch
    const originalFetch = unsafeWindow.fetch;
    const requestHandler = new RequestHandler();

    async function hookedFetch(input, init) {
        let url = (input instanceof Request) ? input.url : input;
        let modifiedInput = input;
        let modifiedInit = init;

        logger.log('拦截请求:', url);

        try {
            // 处理购物车加载请求
            if (input instanceof Request && url === API_ENDPOINTS.LOAD_CART) {
                modifiedInput = await requestHandler.handleLoadCart(input);
            }

            // 处理家长审批请求
            if (url === API_ENDPOINTS.PARENTAL_APPROVAL && init) {
                modifiedInit = requestHandler.handleParentalApproval(init);
            }

            // 发送请求
            const response = await originalFetch.call(unsafeWindow, modifiedInput, modifiedInit);
            return await requestHandler.handleResponse(response, url);

        } catch (error) {
            logger.error('请求处理失败:', error);
            throw error;
        }
    }

    // 替换全局 fetch
    unsafeWindow.fetch = hookedFetch;
    logger.log('脚本已加载并运行');
})();