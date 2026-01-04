// ==UserScript==
// @name         MilkyWayIdle 强化等级通知到QQ (PC端)
// @namespace    http://tampermonkey.net/
// @version      1.09
// @description  实时检测强化等级与无所事事的状态通过Qmsg酱发送给QQ
// @author       Suyeye * DS
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      qmsg.zendee.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537299/MilkyWayIdle%20%E5%BC%BA%E5%8C%96%E7%AD%89%E7%BA%A7%E9%80%9A%E7%9F%A5%E5%88%B0QQ%20%28PC%E7%AB%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537299/MilkyWayIdle%20%E5%BC%BA%E5%8C%96%E7%AD%89%E7%BA%A7%E9%80%9A%E7%9F%A5%E5%88%B0QQ%20%28PC%E7%AB%AF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultConfig = {
        enabled: true,
        qmsgKey: '',
        idleNotify: true,
        enhanceLevel: 6,
        panelLeft: window.innerWidth - 300,
        panelTop: 20,
        panelVisible: true
    };

    GM_addStyle(`
        #config-panel {
            position: fixed;
            z-index: 9999;
            background: rgba(40,40,40,0.9);
            color: #fff;
            border-radius: 8px;
            padding: 15px;
            min-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            backdrop-filter: blur(5px);
            cursor: move;
        }
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .config-group {
            margin: 10px 0;
        }
        #config-panel input[type="text"], #config-panel select {
            width: 100%;
            padding: 6px;
            margin: 4px 0;
            background: #333;
            border: 1px solid #555;
            color: #fff;
        }
        .hidden {
            display: none;
        }
        /* 按钮样式 */
        .panel-button {
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: opacity 0.2s;
            margin-left: 5px;
        }
        .panel-button:hover {
            opacity: 0.8;
        }
        #toggle-enable {
            background: #28a745;
        }
        #toggle-enable.disabled {
            background: #6c757d;
        }
        #toggle-panel {
            background: #007bff;
        }
        #tutorial-button {
            background: #6f42c1;
        }
        #tutorial-button.active {
            background: #ffc107;
            color: #333;
        }
        .tutorial-content {
            max-height: 300px;
            overflow-y: auto;
            padding: 10px;
            background: rgba(50,50,50,0.8);
            border-radius: 5px;
            margin-top: 10px;
            border: 1px solid #555;
        }
        .tutorial-content ol {
            padding-left: 20px;
        }
        .tutorial-content li {
            margin-bottom: 8px;
        }
        .tutorial-content a {
            color: #80bdff;
            text-decoration: none;
        }
        .tutorial-content a:hover {
            text-decoration: underline;
        }
        /* 按钮容器 */
        .button-container {
            display: flex;
        }
    `);

    class NotificationSystem {
        constructor() {
            this.config = {...defaultConfig, ...GM_getValue('config', {})};
            this.lastState = { type: null, level: null };
            this.tutorialActive = false;
            this.observer = null;
            this.targetNode = null;
            this.initUI();
            this.initKeyboardShortcut();
            this.initObserver();
        }

        initUI() {
            this.panel = document.createElement('div');
            this.panel.id = 'config-panel';

            this.panel.style.left = `${this.config.panelLeft}px`;
            this.panel.style.top = `${this.config.panelTop}px`;

            if (!this.config.panelVisible) {
                this.panel.classList.add('hidden');
            }

            this.createPanelContent();
            document.body.appendChild(this.panel);

            this.panel.querySelector('#toggle-enable').addEventListener('click', () => this.toggleEnable());
            this.panel.querySelector('#toggle-panel').addEventListener('click', () => this.togglePanelVisibility());
            this.panel.querySelector('#tutorial-button').addEventListener('click', () => this.toggleTutorial());
            this.panel.querySelector('#tutorial-button-back').addEventListener('click', () => this.toggleTutorial());
            this.panel.querySelector('#qmsg-key').addEventListener('input', e => this.saveConfig('qmsgKey', e.target.value));
            this.panel.querySelector('#idle-notify').addEventListener('change', e => this.saveConfig('idleNotify', e.target.checked));
            this.panel.querySelector('#enhance-level').addEventListener('change', e => this.saveConfig('enhanceLevel', parseInt(e.target.value)));

            let isDragging = false;
            let offset = [0,0];
            this.panel.addEventListener('mousedown', e => {

                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') {
                    return;
                }
                isDragging = true;
                offset = [
                    e.clientX - this.panel.offsetLeft,
                    e.clientY - this.panel.offsetTop
                ];
                this.panel.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', e => {
                if (!isDragging) return;
                this.panel.style.left = `${e.clientX - offset[0]}px`;
                this.panel.style.top = `${e.clientY - offset[1]}px`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    this.panel.style.cursor = 'move';

                    this.saveConfig('panelLeft', this.panel.offsetLeft);
                    this.saveConfig('panelTop', this.panel.offsetTop);
                }
            });
        }

        createPanelContent() {
            this.panel.innerHTML = `
                <div class="panel-header">
                    <span>通知配置</span>
                    <div class="button-container">
                        <button id="toggle-enable" class="panel-button ${this.config.enabled ? '' : 'disabled'}">
                            ${this.config.enabled ? '启动中' : '禁用中'}
                        </button>
                        <button id="toggle-panel" class="panel-button">隐藏(F1)</button>
                        <button id="tutorial-button" class="panel-button">教程</button>
                        <button id="tutorial-button-back" class="panel-button hidden">返回</button>
                    </div>
                </div>
                <div class="panel-body">
                    <div id="settings-content">
                        <div class="config-group">
                            <label>Qmsg密钥：</label>
                            <input type="text" id="qmsg-key" value="${this.config.qmsgKey}" placeholder="输入您的Qmsg密钥">
                        </div>
                        <div class="config-group">
                            <label>
                                <input type="checkbox" id="idle-notify" ${this.config.idleNotify ? 'checked' : ''}>
                                启用无所事事通知
                            </label>
                        </div>
                        <div class="config-group">
                            <label>强化等级通知：</label>
                            <select id="enhance-level">
                                <option value="0" ${0 === this.config.enhanceLevel ? 'selected' : ''}>关闭</option>
                                ${Array.from({length: 13}, (_,i) => {
                                    const level = i + 8;
                                    return `<option value="${level}" ${level === this.config.enhanceLevel ? 'selected' : ''}>
                                        +${level}及以上
                                    </option>`;
                                }).join('')}
                            </select>
                        </div>
                    </div>
                    <div id="tutorial-content" class="tutorial-content hidden">
                        <div>基本功能：</div>
                        <div>检测窗口无所事事或者强化等级给QQ发送消息，须填写Qmsg酱key才能使用。</div>
                        <div>离线状态无法检测。</div>
                        <ol>
                            <li>登陆/注册<a href="https://qmsg.zendee.cn/" target="_blank">Qmsg酱</a></li>
                            <li>添加自己接收用的QQ，并选择一位机器人添加且自动通过申请。</li>
                            <li>复制我的KEY</li>
                            <li>在本窗口输入KEY并点击启用按钮</li>
                        </ol>
                            <div>※ 建议不要用第一个机器人，如果好友申请没有立刻通过，需要更换一个机器人添加。</div>
                            <div>※ 第三方机器人每天只允许发送100条消息，因此限制播报起点为+8以上。</div>
                    </div>
                </div>
            `;
        }

        initKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F1') {
                    e.preventDefault();
                    this.togglePanelVisibility();
                }
            });
        }

        saveConfig(key, value) {
            this.config[key] = value;
            GM_setValue('config', this.config);
        }

        toggleEnable() {
            this.config.enabled = !this.config.enabled;
            this.saveConfig('enabled', this.config.enabled);

            const btn = this.panel.querySelector('#toggle-enable');
            btn.textContent = this.config.enabled ? '启动中' : '禁用中';
            btn.classList.toggle('disabled', !this.config.enabled);
        }

        togglePanelVisibility() {
            this.config.panelVisible = !this.config.panelVisible;
            this.saveConfig('panelVisible', this.config.panelVisible);

            this.panel.classList.toggle('hidden');
            const btn = this.panel.querySelector('#toggle-panel');
            btn.textContent = this.config.panelVisible ? '隐藏(F1)' : '显示(F1)';
        }

        toggleTutorial() {
            this.tutorialActive = !this.tutorialActive;
            const tutorialBtn = this.panel.querySelector('#tutorial-button');
            const tutorialBackBtn = this.panel.querySelector('#tutorial-button-back');
            const settingsContent = this.panel.querySelector('#settings-content');
            const tutorialContent = this.panel.querySelector('#tutorial-content');

            const toggleEnableBtn = this.panel.querySelector('#toggle-enable');
            const togglePanelBtn = this.panel.querySelector('#toggle-panel');

            tutorialBtn.classList.toggle('hidden', this.tutorialActive);
            tutorialBackBtn.classList.toggle('hidden', !this.tutorialActive);

            settingsContent.classList.toggle('hidden', this.tutorialActive);
            tutorialContent.classList.toggle('hidden', !this.tutorialActive);

            toggleEnableBtn.classList.toggle('hidden', this.tutorialActive);
            togglePanelBtn.classList.toggle('hidden', this.tutorialActive);
        }

        detectEnhanceLevel(text) {
            if (this.config.enhanceLevel === 0) return null;
            const match = text.match(/\+(\d+)\b/);
            return match && parseInt(match[1]) >= this.config.enhanceLevel ? match[0] : null;
        }

        handleStateChange(element) {
            if (!this.config.enabled) return;

            const currentText = element?.textContent?.trim() || "";
            const isIdle = this.config.idleNotify && currentText.includes("无所事事");
            const enhanceLevel = this.detectEnhanceLevel(currentText);

            let shouldSend = false;
            let message = "";

            if (isIdle && this.lastState.type !== 'idle') {
                message = `${new Date().toTimeString().slice(0,5)}分开始闲置啦！`;
                this.lastState = { type: 'idle', level: null };
                shouldSend = true;
            }
            else if (enhanceLevel && (
                this.lastState.type !== 'enhance' ||
                this.lastState.level !== enhanceLevel
            )) {
                message = currentText;
                this.lastState = { type: 'enhance', level: enhanceLevel };
                shouldSend = true;
            }
            else if (!isIdle && !enhanceLevel && this.lastState.type !== null) {
                this.lastState = { type: null, level: null };
            }

            if (shouldSend && this.config.qmsgKey) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://qmsg.zendee.cn/send/${this.config.qmsgKey}?msg=${encodeURIComponent(message)}`,
                    onload: () => console.log(`[${new Date().toLocaleTimeString()}] 通知发送成功`),
                    onerror: (err) => console.error('发送失败:', err)
                });
            }
        }

        initObserver() {

            this.findAndObserveTarget();

            setInterval(() => {
                if (!this.targetNode || !document.body.contains(this.targetNode)) {
                    console.log('目标元素丢失，重新连接观察器...');
                    if (this.observer) {
                        this.observer.disconnect();
                        this.observer = null;
                        this.targetNode = null;
                    }
                    this.findAndObserveTarget();
                }
            }, 2000);
        }

        findAndObserveTarget() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            this.targetNode = document.querySelector("div.Header_displayName__1hN09");

            if (!this.targetNode) {
                console.log('未找到状态元素，5秒后重试...');
                setTimeout(() => this.findAndObserveTarget(), 5000);
                return;
            }

            console.log('找到状态元素，开始观察...');

            this.observer = new MutationObserver(mutations => {
                mutations.forEach(() => this.handleStateChange(this.targetNode));
            });

            this.observer.observe(this.targetNode, {
                characterData: true,
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ['textContent']
            });

            this.handleStateChange(this.targetNode);
        }
    }

    new NotificationSystem();
})();