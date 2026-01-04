// ==UserScript==
// @name         LinuxONE 自动化工具集
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  集成注册和实例创建的自动化工具
// @author       Your Name
// @match        https://linuxone.cloud.marist.edu/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536225/LinuxONE%20%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/536225/LinuxONE%20%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 固定密码配置
    const FIXED_PASSWORD = "Admin@passw0rd";

    // 指纹配置库
    const FP_CONFIG = {
        userAgents: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'
        ],
        resolutions: [
            {width: 1920, height: 1080, depth: 24},
            {width: 1536, height: 864, depth: 30},
            {width: 1440, height: 900, depth: 24}
        ],
        webgl: [
            {vendor: 'Google Inc.', renderer: 'ANGLE (NVIDIA, Vulkan 1.3)'},
            {vendor: 'Intel Inc.', renderer: 'Intel Iris OpenGL Engine'},
            {vendor: 'AMD', renderer: 'AMD Radeon RX 7900 XT'}
        ],
        timeZones: ['Asia/Shanghai', 'Europe/London', 'America/Los_Angeles'],
        langs: ['en-US', 'zh-CN', 'en-GB']
    };

    // 存储键
    const STORAGE_KEYS = {
        INSTANCE_NUMBER: 'linuxone_creator_config',
        CURRENT_FP: 'currentFP'
    };

    // 注入基础样式
    GM_addStyle(`
        .floating-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2147483647;
            font-family: 'Segoe UI', system-ui;
            transition: all 0.3s ease;
        }

        .panel-header {
            background: #007aff;
            color: white;
            padding: 12px 15px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .panel-header.collapsed {
            border-radius: 50px;
        }

        .panel-content {
            background: #f5f7fa;
            margin-top: 10px;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: none;
        }

        .panel-content.visible {
            display: block;
        }

        .tab-container {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .tab-button {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 6px;
            background: #e1e5ea;
            cursor: pointer;
            transition: all 0.2s;
        }

        .tab-button.active {
            background: #007aff;
            color: white;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .input-group {
            margin: 10px 0;
        }

        .input-label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }

        .input-field {
            width: 100%;
            padding: 8px;
            border: 1px solid #d0d7de;
            border-radius: 6px;
            font-size: 14px;
        }

        .submit-btn {
            background: #007aff;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            font-weight: 500;
            margin-top: 10px;
            transition: background 0.2s;
        }

        .submit-btn:hover {
            background: #0063cc;
        }

        .status-bar {
            font-size: 12px;
            color: #666;
            margin: 8px 0;
            height: 18px;
        }
    `);

    // 创建悬浮面板
    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.className = 'floating-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 16c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                    <path d="M2.8 17.2L2 16.4c-.3-.3-.3-.8 0-1.1l1.4-1.4c.3-.3.8-.3 1.1 0l.8.8c.3.3.3.8 0 1.1l-1.4 1.4c-.3.3-.8.3-1.1 0zM21.2 17.2l-.8-.8c-.3-.3-.3-.8 0-1.1l1.4-1.4c.3-.3.8-.3 1.1 0l.8.8c.3.3.3.8 0 1.1l-1.4 1.4c-.3.3-.8.3-1.1 0z"/>
                </svg>
                <span>LinuxONE 工具</span>
            </div>
            <div class="panel-content visible">
                <div class="tab-container">
                    <button class="tab-button active" data-tab="register">注册</button>
                    <button class="tab-button" data-tab="create">创建实例</button>
                </div>
                
                <div class="tab-content active" id="register-tab">
                    <div class="input-group">
                        <label class="input-label">邮箱地址</label>
                        <input type="email" class="input-field" id="reg-email" placeholder="请输入邮箱">
                    </div>
                    <button class="submit-btn" id="start-register">🚀 开始自动注册</button>
                </div>

                <div class="tab-content" id="create-tab">
                    <div class="input-group">
                        <label class="input-label">实例名前缀</label>
                        <input type="text" class="input-field" id="instance-prefix" value="admin">
                    </div>
                    <div class="input-group">
                        <label class="input-label">起始序号</label>
                        <input type="number" class="input-field" id="start-number" value="1">
                    </div>
                    <div class="input-group">
                        <label class="input-label">操作间隔 (ms)</label>
                        <input type="number" class="input-field" id="action-delay" value="1000">
                    </div>
                    <button class="submit-btn" id="start-creation">🚀 开始自动创建</button>
                </div>

                <div class="status-bar" id="status-info">就绪</div>
            </div>
        `;

        // 绑定事件处理
        panel.querySelector('#start-register').addEventListener('click', () => {
            const email = panel.querySelector('#reg-email').value.trim();
            if (!/^\w+@\w+\.\w+$/.test(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }
            
            setTimeout(() => {
                try {
                    const $scope = angular.element(document).scope();
                    if ($scope && !$scope.$$phase) {
                        $scope.$apply(() => {
                            autoRegister(email);
                        });
                    } else {
                        autoRegister(email);
                    }
                } catch (e) {
                    console.warn('Angular 上下文不可用，直接执行:', e);
                    autoRegister(email);
                }
            }, 0);
        });

        panel.querySelector('#start-creation').addEventListener('click', () => {
            setTimeout(() => {
                try {
                    const $scope = angular.element(document).scope();
                    if ($scope && !$scope.$$phase) {
                        $scope.$apply(() => {
                            updateConfig();
                            autoCreate();
                        });
                    } else {
                        updateConfig();
                        autoCreate();
                    }
                } catch (e) {
                    console.warn('Angular 上下文不可用，直接执行:', e);
                    updateConfig();
                    autoCreate();
                }
            }, 0);
        });

        // 直接添加到 body
        document.body.appendChild(panel);

        // 面板折叠/展开
        const header = panel.querySelector('.panel-header');
        const content = panel.querySelector('.panel-content');
        header.classList.remove('collapsed'); // 确保初始展开
        
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('visible');
        });

        // 标签切换
        const tabs = panel.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabContents = panel.querySelectorAll('.tab-content');
                tabContents.forEach(c => c.classList.remove('active'));
                panel.querySelector(`#${tab.dataset.tab}-tab`).classList.add('active');
            });
        });
    }

    // 生成随机指纹
    function generateFingerprint() {
        const random = arr => arr[Math.floor(Math.random() * arr.length)];
        return {
            ua: random(FP_CONFIG.userAgents),
            res: random(FP_CONFIG.resolutions),
            tz: random(FP_CONFIG.timeZones),
            lang: random(FP_CONFIG.langs),
            webgl: random(FP_CONFIG.webgl),
            cores: Math.floor(Math.random() * 6 + 2),
            ram: Math.floor(Math.random() * 6 + 4)
        };
    }

    // 应用指纹伪装
    function applyFingerprint(fp) {
        // 基础伪装
        Object.defineProperties(navigator, {
            userAgent: { value: fp.ua },
            language: { value: fp.lang },
            languages: { value: [fp.lang] },
            hardwareConcurrency: { value: fp.cores },
            deviceMemory: { value: fp.ram }
        });

        // 屏幕属性
        Object.defineProperties(screen, {
            width: { value: fp.res.width },
            height: { value: fp.res.height },
            colorDepth: { value: fp.res.depth }
        });

        // 时区伪装
        const originalTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        Date.prototype.getTimezoneOffset = () => {
            const offset = originalTZ === fp.tz ?
                new Date().getTimezoneOffset() :
                Math.floor(Math.random() * 600 - 300);
            return offset;
        };

        // WebGL伪装
        const webglHandler = {
            getParameter: (p) => {
                if (p === 37445) return fp.webgl.vendor;
                if (p === 37446) return fp.webgl.renderer;
                return WebGLRenderingContext.prototype.getParameter(p);
            }
        };
        WebGLRenderingContext.prototype.getParameter =
            new Proxy(WebGLRenderingContext.prototype.getParameter, webglHandler);

        // 反自动化检测
        Object.defineProperty(document, 'hidden', { value: false });
        Object.defineProperty(navigator, 'webdriver', { value: false });
    }

    // 更新状态显示
    function updateStatus(text) {
        const statusBar = document.querySelector('#status-info');
        if (statusBar) statusBar.textContent = text;
    }

    // 添加 fill 函数定义
    function fill(selector, value) {
        const el = document.querySelector(selector);
        if (!el) return;

        // 直接设置值
        el.value = value;
        
        // 触发事件
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 如果有 Angular 绑定，更新模型
        try {
            const $element = angular.element(el);
            const ngModel = $element.controller('ngModel');
            if (ngModel) {
                ngModel.$setViewValue(value);
                ngModel.$render();
            }
        } catch (e) {
            console.warn('Angular 模型更新失败:', e);
        }
    }

    // 修改 autoRegister 函数
    async function autoRegister(email) {
        const name = generateName();
        const org = `TestOrg${Math.floor(Math.random() * 900 + 100)}`;

        try {
            updateStatus('开始自动注册...');
            
            // 使用原生方式填写表单
            await fillForm({
                '#email': email,
                'input[name="password"]': FIXED_PASSWORD,
                'input[name="password2"]': FIXED_PASSWORD,
                'input[name="firstName"]': name.first,
                'input[name="lastName"]': name.last,
                'input[name="organization"]': org,
                '#registrationTextarea': 'For research and development purposes'
            });

            // 等待一下让表单验证完成
            await wait(1000);

            // 勾选复选框
            const checkbox = document.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.click(); // 使用 click 而不是直接设置 checked
                await wait(500);
            }

            // 等待按钮可用
            await wait(1000);

            // 提交表单
            const submitBtn = document.querySelector('#submitFormButton');
            if (submitBtn) {
                submitBtn.click();
                GM_notification({
                    title: '注册已提交',
                    text: '请等待注册结果...',
                    timeout: 3000
                });
            }
        } catch (error) {
            updateStatus('注册失败: ' + error.message);
            GM_notification({
                title: '发生错误',
                text: error.message,
                timeout: 5000
            });
        }
    }

    // 添加表单填写辅助函数
    async function fillForm(fields) {
        for (const [selector, value] of Object.entries(fields)) {
            fill(selector, value);
            await wait(800); // 添加延迟，避免触发反爬
        }
    }

    // 自动创建实例流程
    async function autoCreate() {
        const config = updateConfig();
        const instanceName = generateInstanceName(config.instancePrefix, config.startNumber);

        try {
            updateStatus('正在导航到创建页面...');
            
            // 使用原生方式触发导航
            const navButton = document.querySelector('button[ng-click="nav(\'cinstance\')"]');
            if (navButton) {
                try {
                    const $element = angular.element(navButton);
                    const $scope = $element.scope();
                    if ($scope) {
                        $scope.nav('cinstance');
                    } else {
                        navButton.click();
                    }
                } catch (e) {
                    console.warn('Angular 导航失败，使用原生点击:', e);
                    navButton.click();
                }
            }

            await wait(config.delay * 2);

            // 填写实例名称
            updateStatus('填写实例名称...');
            const nameInput = document.querySelector('input[name="instancename"]');
            setInputValue(nameInput, instanceName);

            // 选择镜像
            await wait(config.delay);
            updateStatus('选择镜像...');
            clickElement('#image_2');

            // 选择配置
            await wait(config.delay);
            updateStatus('选择配置...');
            clickElement('#flavor_0');

            // 创建密钥
            await wait(config.delay);
            updateStatus('创建密钥...');
            const createKeyBtn = document.querySelector('a[ng-click="createkey()"]');
            if (createKeyBtn) {
                try {
                    const $element = angular.element(createKeyBtn);
                    const $scope = $element.scope();
                    if ($scope) {
                        $scope.createkey();
                    } else {
                        createKeyBtn.click();
                    }
                } catch (e) {
                    console.warn('Angular 创建密钥失败，使用原生点击:', e);
                    createKeyBtn.click();
                }
            }

            // 填写密钥名称
            await wait(config.delay);
            const keyInput = document.querySelector('input[name="keyName"]');
            setInputValue(keyInput, instanceName);

            // 生成密钥对
            await wait(config.delay);
            const generateKeyBtn = document.querySelector('button[ng-click="generatekeypair(keyname)"]');
            if (generateKeyBtn) {
                try {
                    const $element = angular.element(generateKeyBtn);
                    const $scope = $element.scope();
                    if ($scope) {
                        $scope.generatekeypair($scope.keyname);
                    } else {
                        generateKeyBtn.click();
                    }
                } catch (e) {
                    console.warn('Angular 生成密钥失败，使用原生点击:', e);
                    generateKeyBtn.click();
                }
            }

            // 等待密钥创建和列表更新
            updateStatus('等待密钥生成...');
            await wait(5000); // 等待5秒

            // 查找并选择对应名称的密钥
            updateStatus('选择密钥...');
            const keys = document.querySelectorAll('.key-item'); // 假设密钥项有这个类名
            let keyFound = false;
            
            for (const key of keys) {
                const keyName = key.textContent || key.innerText;
                if (keyName.includes(instanceName)) {
                    key.click();
                    keyFound = true;
                    break;
                }
            }

            if (!keyFound) {
                // 如果没找到对应名称的密钥，尝试使用索引选择
                console.warn('未找到指定名称的密钥，尝试选择第一个密钥');
                const firstKey = document.querySelector('#key_0');
                if (firstKey) {
                    firstKey.click();
                } else {
                    throw new Error('未找到可用的密钥');
                }
            }

            // 最终创建
            await wait(config.delay);
            updateStatus('正在创建实例...');
            const createVMBtn = document.querySelector('button[ng-click="createvm()"]');
            if (createVMBtn) {
                try {
                    const $element = angular.element(createVMBtn);
                    const $scope = $element.scope();
                    if ($scope) {
                        $scope.createvm();
                    } else {
                        createVMBtn.click();
                    }
                } catch (e) {
                    console.warn('Angular 创建实例失败，使用原生点击:', e);
                    createVMBtn.click();
                }
            }

            updateStatus('创建流程完成 ✓');
            await wait(5000);
            updateStatus('就绪');
        } catch (error) {
            updateStatus('创建失败: ' + error.message);
            console.error(error);
        }
    }

    // 工具函数
    function generateName() {
        const first = ['James', 'Emma', 'Liam', 'Olivia', 'Noah'];
        const last = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'];
        return {
            first: first[Math.floor(Math.random() * first.length)],
            last: last[Math.floor(Math.random() * last.length)]
        };
    }

    function wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function clickElement(selector) {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`元素未找到: ${selector}`);
        
        // 检查是否有 Angular 绑定
        const ngClick = el.getAttribute('ng-click');
        if (ngClick) {
            try {
                const $element = angular.element(el);
                const $scope = $element.scope();
                if ($scope) {
                    const fn = new Function('return ' + ngClick)();
                    fn.call($scope);
                    return;
                }
            } catch (e) {
                console.warn('Angular 点击处理失败:', e);
            }
        }
        
        // 降级到原生点击
        el.click();
    }

    function setInputValue(input, value) {
        if (!input) throw new Error('输入框未找到');
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function updateConfig() {
        const config = {
            instancePrefix: document.querySelector('#instance-prefix').value,
            startNumber: parseInt(document.querySelector('#start-number').value),
            delay: parseInt(document.querySelector('#action-delay').value)
        };
        GM_setValue(STORAGE_KEYS.INSTANCE_NUMBER, config.startNumber);
        return config;
    }

    // 添加实例名称生成函数
    function generateInstanceName(prefix, number) {
        return `${prefix}${number.toString().padStart(2, '0')}`;
    }

    // 修改初始化函数
    function init() {
        // 应用指纹伪装
        const fp = generateFingerprint();
        applyFingerprint(fp);
        GM_setValue(STORAGE_KEYS.CURRENT_FP, JSON.stringify(fp));

        // 等待页面完全加载后创建面板
        if (document.readyState === 'complete') {
            createFloatingPanel();
        } else {
            window.addEventListener('load', createFloatingPanel);
        }
    }

    // 修改启动逻辑
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 注册菜单命令
    GM_registerMenuCommand("重置创建序号", () => {
        GM_setValue(STORAGE_KEYS.INSTANCE_NUMBER, 1);
        document.querySelector('#start-number').value = 1;
        updateStatus('序号已重置');
    });
})(); 