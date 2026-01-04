// ==UserScript==
// @name         智能高清背景Pro Max
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  美观的全屏背景+智能透明度控制+完善的域名管理系统
// @author       沐沐沐倾丶
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537920/%E6%99%BA%E8%83%BD%E9%AB%98%E6%B8%85%E8%83%8C%E6%99%AFPro%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/537920/%E6%99%BA%E8%83%BD%E9%AB%98%E6%B8%85%E8%83%8C%E6%99%AFPro%20Max.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置初始化
    const defaultConfig = {
        apiUrl: '',
        opacity: 0.7,
        minOpacity: 0.3,
        maxOpacity: 0.9,
        blockedDomains: [],
        enableAutoAdjust: true,
        manualOverride: false,
        lastUpdate: 0,
        uiTheme: 'light'
    };

    // 加载配置
    let config = {
        ...defaultConfig,
        ...Object.fromEntries(
            Object.keys(defaultConfig).map(key => [key, GM_getValue(key, defaultConfig[key])])
        )
    };

    // 获取当前域名（不含www）
    const getCurrentDomain = () => {
        return window.location.hostname.replace(/^www\./, '');
    };

    // 检查是否被屏蔽
    const currentDomain = getCurrentDomain();
    if (config.blockedDomains.includes(currentDomain)) {
        return;
    }

    // 应用背景样式
    const applyBackground = () => {
        const bgCss = `
            body::before {
                content: "";
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-image: ${config.apiUrl ? `url('${config.apiUrl}?t=${Date.now()}')` : 'none'};
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                background-attachment: fixed;
                z-index: -9999;
                pointer-events: none;
                opacity: ${config.opacity};
                transition: opacity 0.3s ease;
            }
            body {
                background-color: transparent !important;
                position: relative;
            }
        `;
        GM_addStyle(bgCss);
    };

    // 自动透明度调节（不覆盖手动设置）
    const autoAdjustOpacity = () => {
        if (!config.enableAutoAdjust || config.manualOverride) return;

        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, div');
        if (textElements.length < 3) return; // 文本太少不调整

        let darkCount = 0;
        textElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;

            // 计算文字颜色亮度
            const textMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (textMatch) {
                const [_, r, g, b] = textMatch.map(Number);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                if (brightness < 128) darkCount++;
            }

            // 计算背景颜色亮度
            const bgMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (bgMatch && bgColor !== 'rgba(0, 0, 0, 0)') {
                const [_, r, g, b] = bgMatch.map(Number);
                const bgBrightness = (r * 299 + g * 587 + b * 114) / 1000;
                if (bgBrightness < 180) darkCount++;
            }
        });

        const darkRatio = darkCount / textElements.length;
        const newOpacity = Math.min(
            config.maxOpacity,
            Math.max(
                config.minOpacity,
                config.maxOpacity - (darkRatio * (config.maxOpacity - config.minOpacity))
            )
        );

        if (Math.abs(newOpacity - config.opacity) > 0.05) {
            config.opacity = newOpacity;
            GM_setValue('opacity', newOpacity);
            document.querySelector('body::before')?.style.setProperty('opacity', newOpacity);
            config.lastUpdate = Date.now();
        }
    };

    // 美观的设置界面
    const createSettingsUI = () => {
        const themeClass = config.uiTheme === 'dark' ? 'dark-theme' : 'light-theme';

        const settingsHTML = `
            <div id="bgSettingsDialog" class="${themeClass}">
                <div class="dialog-header">
                    <h2>背景设置</h2>
                    <button id="closeSettingsBtn" class="icon-btn">×</button>
                </div>

                <div class="settings-content">
                    <div class="form-group">
                        <label>背景图片URL</label>
                        <input type="text" id="bgUrlInput" value="${config.apiUrl}" placeholder="可选：输入图片URL">
                    </div>

                    <div class="form-group">
                        <div class="flex-row">
                            <label>透明度: <span id="opacityValue">${(config.opacity * 100).toFixed(0)}%</span></label>
                            <button id="resetOpacityBtn" class="text-btn">重置</button>
                        </div>
                        <input type="range" id="opacitySlider" min="10" max="100" value="${config.opacity * 100}" class="slider">
                    </div>

                    <div class="form-group">
                        <label class="checkbox-container">
                            <input type="checkbox" id="autoAdjustCheckbox" ${config.enableAutoAdjust ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            <span>智能调节透明度</span>
                        </label>
                        <p class="hint-text">根据页面文字颜色自动调整</p>
                    </div>

                    <div class="form-actions">
                        <button id="saveSettingsBtn" class="primary-btn">保存设置</button>
                        <button id="cancelSettingsBtn" class="secondary-btn">取消</button>
                    </div>

                    <div class="divider"></div>

                    <div class="domain-management">
                        <h3>域名屏蔽管理</h3>
                        <p class="hint-text">屏蔽的网站不会显示背景</p>

                        <div class="add-domain">
                            <input type="text" id="newDomainInput" placeholder="输入域名 (如: example.com)">
                            <button id="addDomainBtn" class="small-btn">添加</button>
                        </div>

                        <div id="domainList" class="domain-list">
                            ${config.blockedDomains.length > 0 ?
                                config.blockedDomains.map(domain => `
                                    <div class="domain-item">
                                        <span>${domain}</span>
                                        <button class="remove-domain-btn" data-domain="${domain}">
                                            <svg viewBox="0 0 24 24" width="16" height="16">
                                                <path d="M19 13H5v-2h14v2z"/>
                                            </svg>
                                        </button>
                                    </div>
                                `).join('') :
                                '<div class="empty-state">暂无屏蔽域名</div>'
                            }
                        </div>

                        <div class="current-domain-actions">
                            <button id="blockCurrentBtn" class="small-btn danger">屏蔽当前网站</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        GM_addStyle(`
            :root {
                --primary-color: #4361ee;
                --danger-color: #f44336;
                --text-color: #333;
                --bg-color: #fff;
                --border-color: #e0e0e0;
                --hover-color: #f5f5f5;
                --secondary-text: #666;
            }

            .dark-theme {
                --primary-color: #3a86ff;
                --danger-color: #ff4d4d;
                --text-color: #f0f0f0;
                --bg-color: #2a2a2a;
                --border-color: #444;
                --hover-color: #333;
                --secondary-text: #aaa;
            }

            #bgSettingsDialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--bg-color);
                border-radius: 12px;
                box-shadow: 0 6px 30px rgba(0,0,0,0.2);
                width: 420px;
                max-width: 90vw;
                max-height: 85vh;
                overflow-y: auto;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                color: var(--text-color);
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -45%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }

            .dialog-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .dialog-header h2 {
                margin: 0;
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--text-color);
            }

            .icon-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--secondary-text);
                padding: 4px;
                line-height: 1;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .icon-btn:hover {
                color: var(--text-color);
                background: var(--hover-color);
            }

            .form-group {
                margin-bottom: 18px;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: var(--text-color);
            }

            input[type="text"] {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 14px;
                transition: border 0.2s;
            }

            input[type="text"]:focus {
                outline: none;
                border-color: var(--primary-color);
            }

            .slider {
                -webkit-appearance: none;
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: var(--border-color);
                outline: none;
                margin: 12px 0;
            }

            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--primary-color);
                cursor: pointer;
                transition: all 0.2s;
            }

            .slider::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }

            .checkbox-container {
                display: flex;
                align-items: center;
                position: relative;
                padding-left: 28px;
                cursor: pointer;
                user-select: none;
            }

            .checkbox-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }

            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 20px;
                width: 20px;
                background-color: var(--bg-color);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                transition: all 0.2s;
            }

            .checkbox-container:hover input ~ .checkmark {
                border-color: var(--primary-color);
            }

            .checkbox-container input:checked ~ .checkmark {
                background-color: var(--primary-color);
                border-color: var(--primary-color);
            }

            .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }

            .checkbox-container input:checked ~ .checkmark:after {
                display: block;
            }

            .checkbox-container .checkmark:after {
                left: 7px;
                top: 3px;
                width: 4px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            .hint-text {
                font-size: 12px;
                color: var(--secondary-text);
                margin-top: 4px;
                margin-bottom: 0;
            }

            .flex-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .text-btn {
                background: none;
                border: none;
                color: var(--primary-color);
                font-size: 12px;
                cursor: pointer;
                padding: 2px 6px;
            }

            .form-actions {
                display: flex;
                gap: 10px;
                margin: 20px 0;
            }

            .primary-btn {
                flex: 1;
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 10px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
            }

            .primary-btn:hover {
                filter: brightness(1.1);
            }

            .secondary-btn {
                flex: 1;
                background: var(--hover-color);
                color: var(--text-color);
                border: none;
                padding: 10px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .secondary-btn:hover {
                background: var(--border-color);
            }

            .divider {
                height: 1px;
                background: var(--border-color);
                margin: 20px 0;
            }

            .domain-management h3 {
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 1.1rem;
            }

            .add-domain {
                display: flex;
                gap: 8px;
                margin-bottom: 15px;
            }

            .add-domain input {
                flex: 1;
                padding: 8px 10px;
            }

            .small-btn {
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .small-btn.danger {
                background: var(--danger-color);
                color: white;
                border: none;
            }

            .small-btn.danger:hover {
                filter: brightness(1.1);
            }

            .domain-list {
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                margin-bottom: 15px;
            }

            .domain-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 12px;
                border-bottom: 1px solid var(--border-color);
            }

            .domain-item:last-child {
                border-bottom: none;
            }

            .remove-domain-btn {
                background: none;
                border: none;
                color: var(--secondary-text);
                cursor: pointer;
                padding: 2px;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .remove-domain-btn:hover {
                color: var(--danger-color);
                background: rgba(244, 67, 54, 0.1);
            }

            .remove-domain-btn svg {
                fill: currentColor;
                vertical-align: middle;
            }

            .empty-state {
                padding: 16px;
                text-align: center;
                color: var(--secondary-text);
                font-size: 13px;
            }
        `);

        $('body').append(settingsHTML);

        // 事件绑定
        const $dialog = $('#bgSettingsDialog');
        const $opacitySlider = $('#opacitySlider');
        const $opacityValue = $('#opacityValue');

        // 透明度滑块事件
        $opacitySlider.on('input', function() {
            const value = parseInt($(this).val()) / 100;
            $opacityValue.text(`${Math.round(value * 100)}%`);
            config.opacity = value;
            document.querySelector('body::before')?.style.setProperty('opacity', value);
            config.manualOverride = true;
        });

        // 重置透明度
        $('#resetOpacityBtn').click(function() {
            const defaultValue = 0.7;
            $opacitySlider.val(defaultValue * 100);
            $opacityValue.text(`${Math.round(defaultValue * 100)}%`);
            config.opacity = defaultValue;
            document.querySelector('body::before')?.style.setProperty('opacity', defaultValue);
            config.manualOverride = false;
            GM_setValue('opacity', defaultValue);
        });

            // 域名管理功能
            $('#addDomainBtn').click(function() {
                const domain = $('#newDomainInput').val().trim().toLowerCase();
                if (!domain) return;

                if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(domain)) {
                    showMessage('请输入有效的域名格式（如：example.com）');
                    return;
                }

                if (!config.blockedDomains.includes(domain)) {
                    config.blockedDomains.push(domain);
                    refreshDomainList();
                    $('#newDomainInput').val('');
                    showMessage(`${domain} 已加入屏蔽列表`);
                } else {
                    showMessage('该域名已在屏蔽列表中');
                }
            });

            function showMessage(text) {
                const $msg = $(`<div class="message">${text}</div>`);
                $dialog.append($msg);
                setTimeout(() => $msg.fadeOut(300, () => $msg.remove()), 2000);
            }

            $(document).on('click', '.remove-domain-btn', function() {
                const domain = $(this).data('domain');
                config.blockedDomains = config.blockedDomains.filter(d => d !== domain);
                refreshDomainList();
                showMessage(`${domain} 已从屏蔽列表删除`);
            });

            $('#blockCurrentBtn').click(function() {
                if (!config.blockedDomains.includes(currentDomain)) {
                    config.blockedDomains.push(currentDomain);
                    refreshDomainList();
                    showMessage(`已屏蔽 ${currentDomain}，刷新页面后生效`);
                } else {
                    showMessage('当前网站已在屏蔽列表中');
                }
            });

            function refreshDomainList() {
                const $domainList = $('#domainList');
                $domainList.html(
                    config.blockedDomains.length > 0 ?
                        config.blockedDomains.map(domain => `
                            <div class="domain-item">
                                <span>${domain}</span>
                                <button class="remove-domain-btn" data-domain="${domain}">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path d="M19 13H5v-2h14v2z"/>
                                    </svg>
                                </button>
                            </div>
                        `).join('') :
                        '<div class="empty-state">暂无屏蔽域名</div>'
                );
            }

            // 保存设置
            $('#saveSettingsBtn').click(function() {
                config.apiUrl = $('#bgUrlInput').val().trim();
                config.enableAutoAdjust = $('#autoAdjustCheckbox').is(':checked');
                config.manualOverride = false; // 重置手动覆盖状态

                // 保存所有配置
                Object.keys(config).forEach(key => GM_setValue(key, config[key]));

                applyBackground();
                $dialog.remove();
                showMessage('设置已保存');
            });

            $('#cancelSettingsBtn, #closeSettingsBtn').click(function() {
                // 恢复原来的透明度
                document.querySelector('body::before')?.style.setProperty('opacity', GM_getValue('opacity', 0.7));
                $dialog.remove();
            });

            // 消息提示样式
            GM_addStyle(`
                .message {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-size: 14px;
                    animation: slideIn 0.3s;
                    z-index: 999999;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }

                .dark-theme .message {
                    background: rgba(255,255,255,0.9);
                    color: #222;
                }
            `);
        };

        // 屏蔽当前网站
        const blockCurrentSite = () => {
            if (!config.blockedDomains.includes(currentDomain)) {
                config.blockedDomains.push(currentDomain);
                GM_setValue('blockedDomains', config.blockedDomains);
                GM_notification({
                    title: '网站已屏蔽',
                    text: `已屏蔽 ${currentDomain}\n刷新后生效`,
                    timeout: 3000
                });
            }
        };

        // 注册菜单命令
        GM_registerMenuCommand('🎨 背景设置', createSettingsUI);
        GM_registerMenuCommand('🚫 屏蔽当前网站', blockCurrentSite);

        // 主初始化
        $(document).ready(function() {
            applyBackground();

            if (config.enableAutoAdjust && !config.manualOverride) {
                const observer = new MutationObserver(() => {
                    if (Date.now() - config.lastUpdate > 5000) {
                        autoAdjustOpacity();
                    }
                });

                observer.observe(document.body, {
                    subtree: true,
                    childList: true,
                    attributes: true
                });

                window.addEventListener('scroll', autoAdjustOpacity, { passive: true });
                setTimeout(autoAdjustOpacity, 2000);
            }
        });
    })();
