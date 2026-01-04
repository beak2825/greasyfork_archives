// ==UserScript==
// @name         来吧来吧
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  自动填写表单,支持证件号码、姓名、手机号等字段的智能识别与填写
// @author       Your Name
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492752/%E6%9D%A5%E5%90%A7%E6%9D%A5%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/492752/%E6%9D%A5%E5%90%A7%E6%9D%A5%E5%90%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 默认配置
    const defaultConfig = {
        name: '张三',
        phone: '13800138000',
        idCard: '110101199001011234',
        enabled: true,
        autoFill: true,
        simulateTyping: true,
        collapsed: false
    };

    // 字段识别规则
    const FIELD_PATTERNS = {
        name: [
            'name', '姓名', 'username', 'fullname', 'truename',
            'realname', 'nickname', 'uname', '名字', '真实姓名',
            'chinese-name', '中文名'
        ],
        phone: [
            'phone', 'mobile', '手机', '电话', 'tel', 'telephone',
            'cellphone', 'phonenumber', 'mobilenumber', '联系方式',
            'contact', '联系电话', '手机号码', '电话号码'
        ],
        idCard: [
            'idcard', 'identity', '身份证', '证件号', '证件号码',
            'identno', 'zjhm', 'sfz', 'idnumber', 'cardno',
            'identitycard', '身份证号', '身份证号码',
            'id_card', 'id_no', 'credentialno', 'credential',
            'idennum', 'iden_num', 'idennumber',
            'crdt_no', 'crdtno', 'crdt', 'cert_no', 'certno',
            'identification', 'documentno', 'document_no',
            'id-number', 'id_number', 'idcode', 'id-code',
            'resident-id', 'residentid', 'citizenid',
            '居民身份证', '居民证', '公民身份号码',
            'input[maxlength="18"]',
            'input[data-type="idcard"]',
            'input[data-format="idcard"]',
            'input[pattern="[0-9Xx]{18}"]'
        ]
    };

    // 验证码输入框特征
    const CAPTCHA_PATTERNS = [
        'captcha', 'vcode', 'verify', 'verifycode',
        'validcode', 'seccode', 'checkcode', '验证码',
        '图形码', '验证'
    ];

    // 添加样式
GM_addStyle(`
        .auto-form-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            transition: all 0.3s ease;
            resize: both;
            overflow: auto;
        }
    
    .panel-header {
        padding: 12px 15px;
        background: rgba(240, 240, 240, 0.9);
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        cursor: move;
    }
    
    .panel-controls {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    .panel-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #666;
        font-size: 16px;
        line-height: 1;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .panel-btn:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #333;
    }
        
        .panel-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        
        .panel-body {
            padding: 15px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: #555;
        }
        
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.8);
        }
        
        .form-group input:focus {
            border-color: #4A90E2;
            outline: none;
            background: rgba(255, 255, 255, 1);
        }
        
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
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
            border-radius: 20px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: #4A90E2;
        }
        
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #4A90E2;
            color: white;
        }
        
        .btn-primary:hover {
            background: #357ABD;
        }
        
        .panel-footer {
            padding: 12px 15px;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .auto-form-panel.collapsed {
            width: auto !important;
            height: auto !important;
        }
        
        .auto-form-panel.collapsed .panel-body,
        .auto-form-panel.collapsed .panel-footer {
            display: none;
        }
        
        .auto-form-panel.collapsed .panel-header {
            border-radius: 12px;
            border-bottom: none;
        }
        
        .collapse-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: #666;
            font-size: 16px;
            line-height: 1;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .collapse-btn:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }
    `);

    // 创建UI面板
function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'auto-form-panel';
    panel.innerHTML = `
        <div class="panel-header">
            <span class="panel-title">自动填写助手</span>
            <div class="panel-controls">
                <button class="collapse-btn" id="collapseBtn" title="展开/收起">⇕</button>
                <label class="switch">
                    <input type="checkbox" id="enableSwitch" ${getConfig().enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
            <div class="panel-body">
                <div class="form-group">
                    <label>姓名</label>
                    <div style="display: flex; align-items: center;">
                        <input type="text" id="nameInput" value="${getConfig().name}">
                        <button class="copy-btn" data-target="nameInput">复制</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>手机号</label>
                    <div style="display: flex; align-items: center;">
                        <input type="text" id="phoneInput" value="${getConfig().phone}">
                        <button class="copy-btn" data-target="phoneInput">复制</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>身份证号</label>
                    <div style="display: flex; align-items: center;">
                        <input type="text" id="idCardInput" value="${getConfig().idCard}">
                        <button class="copy-btn" data-target="idCardInput">复制</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="autoFillSwitch" ${getConfig().autoFill ? 'checked' : ''}>
                        自动填写新表单
                    </label>
                </div>
            </div>
            <div class="panel-footer">
                <button class="btn btn-primary" id="saveConfig">保存设置</button>
            </div>
    `;
    
    document.body.appendChild(panel);
    
        // 绑定事件
        panel.querySelector('#saveConfig').addEventListener('click', saveConfig);
        panel.querySelector('#enableSwitch').addEventListener('change', toggleEnabled);

        // 绑定复制按钮事件
        panel.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const input = document.getElementById(targetId);
                input.select();
                document.execCommand('copy');
                showNotification('已复制到剪贴板');
            });
        });

        // 绑定拖动事件
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        panel.querySelector('.panel-header').addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = panel.offsetLeft;
            startTop = panel.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.left = `${startLeft + dx}px`;
            panel.style.top = `${startTop + dy}px`;
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    
    // 添加收缩/展开按钮事件处理
    const collapseBtn = panel.querySelector('#collapseBtn');
    collapseBtn.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        // 保存当前的收缩状态
        const config = getConfig();
        config.collapsed = panel.classList.contains('collapsed');
        GM_setValue('formConfig', config);
    });

    // 恢复上次的收缩状态
    if (getConfig().collapsed) {
        panel.classList.add('collapsed');
    }
    }

    // 获取配置
    function getConfig() {
        return Object.assign({}, defaultConfig, GM_getValue('formConfig', {}));
    }

    // 保存配置
    function saveConfig() {
        const config = {
            name: document.querySelector('#nameInput').value,
            phone: document.querySelector('#phoneInput').value,
            idCard: document.querySelector('#idCardInput').value,
            enabled: document.querySelector('#enableSwitch').checked,
            autoFill: document.querySelector('#autoFillSwitch').checked
        };
        
        GM_setValue('formConfig', config);
        showNotification('设置已保存');
    }

    // 切换启用状态
    function toggleEnabled(e) {
        const config = getConfig();
        config.enabled = e.target.checked;
        GM_setValue('formConfig', config);
        
        if (config.enabled) {
            startAutoFill();
        }
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10001;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2000);
    }

    // 添加证件号码格式验证函数
    function validateIdCard(idCard) {
        const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(idCard);
    }

    // 修改 identifyFieldType 函数，增加特殊判断逻辑
    function identifyFieldType(element) {
        const fieldString = [
            element.name,
            element.id,
            element.placeholder,
            element.getAttribute('aria-label'),
            element.getAttribute('data-type'),
            element.getAttribute('data-format'),
            element.getAttribute('pattern'),
            element.closest('label')?.textContent,
            element.closest('.form-group')?.textContent,
            element.closest('.field')?.textContent,
            element.closest('.form-item')?.textContent,
            element.closest('[class*="form"]')?.textContent
        ].filter(Boolean).join(' ').toLowerCase();

        if (element.maxLength === 18 && !fieldString.includes('手机') && !fieldString.includes('电话')) {
            return 'idCard';
        }

        if (CAPTCHA_PATTERNS.some(pattern => fieldString.includes(pattern))) {
            return 'captcha';
        }

        for (const [type, patterns] of Object.entries(FIELD_PATTERNS)) {
            if (patterns.some(pattern => {
                if (pattern.startsWith('input[')) {
                    return element.matches(pattern);
                }
                return fieldString.includes(pattern);
            })) {
                return type;
            }
        }

        return null;
    }

    // 添加模拟手动输入函数
    async function simulateManualInput(element, value) {
        element.focus();
        element.value = '';
        
        for (let i = 0; i < value.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
            element.value = value.substring(0, i + 1);
            
            const events = [
                new Event('input', { bubbles: true }),
                new KeyboardEvent('keydown', { key: value[i], bubbles: true }),
                new KeyboardEvent('keypress', { key: value[i], bubbles: true }),
                new KeyboardEvent('keyup', { key: value[i], bubbles: true })
            ];
            
            events.forEach(event => element.dispatchEvent(event));
        }
        
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // 修改 autoFillForm 函数，增加智能填写逻辑
    function autoFillForm() {
        const config = getConfig();
        if (!config.enabled) return;

        const inputs = document.querySelectorAll(`
            input[type="text"],
            input[type="tel"],
            input[type="number"],
            input:not([type]),
            input[data-type="idcard"],
            input[data-format="idcard"],
            input[pattern*="[0-9Xx]{18}"],
            input[maxlength="18"]
        `);
        
        inputs.forEach(async input => {
            const fieldType = identifyFieldType(input);
            if (!fieldType || fieldType === 'captcha') return;

            const value = config[fieldType];
            if (value) {
                let formattedValue = value;
                if (fieldType === 'idCard') {
                    if (input.getAttribute('pattern')?.includes('X')) {
                        formattedValue = value.toUpperCase();
                    } else if (input.getAttribute('pattern')?.includes('x')) {
                        formattedValue = value.toLowerCase();
                    }
                }

                try {
                    input.value = formattedValue;
                    triggerEvents(input);
                    
                    if (input.value !== formattedValue) {
                        await simulateManualInput(input, formattedValue);
                    }
                } catch (e) {
                    await simulateManualInput(input, formattedValue);
                }

                if (input.matches('[ng-model]')) {
                    triggerAngularUpdate(input);
                } else if (input.__vue__) {
                    triggerVueUpdate(input, formattedValue);
                }
            }
        });
    }

    // 添加框架特定的更新函数
    function triggerAngularUpdate(element) {
        if (window.angular) {
            const scope = angular.element(element).scope();
            if (scope) {
                scope.$apply();
            }
        }
    }

    function triggerVueUpdate(element, value) {
        if (element.__vue__) {
            element.__vue__.$emit('input', value);
            element.__vue__.$emit('change', value);
        }
    }

    // 扩展 triggerEvents 函数
    function triggerEvents(element) {
        const events = [
            'input',
            'change',
            'blur',
            'keyup',
            'keydown',
            'focus',
            'update'
        ];

        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });

        if (element._reactProps) {
            const nativeEvent = new Event('input', { bubbles: true });
            element._reactProps.onChange?.({ target: element, nativeEvent });
        }
    }

    // 开始自动填写
    function startAutoFill() {
        const config = getConfig();
        if (!config.enabled) return;

        autoFillForm();

        const observer = new MutationObserver((mutations) => {
            if (config.autoFill) {
                autoFillForm();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        createPanel();
        startAutoFill();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 