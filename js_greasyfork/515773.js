// ==UserScript==
// @name         淘宝自动点击脚本
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在指定时间自动点击淘宝网站上的指定元素,可控制开始和停止
// @author       Vincent Ko (https://vincentko.top | https://github.com/forrany)
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515773/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/515773/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置常量
    const CONFIG = {
        MAX_CLICKS: 20,
        MAX_FIND_ATTEMPTS: 100,
        FIND_INTERVAL: 100,
        STORAGE_KEY: 'autoClickState',
        CONTROL_PANEL_ID: 'autoClickControl'
    };

    // 核心状态管理
    const State = {
        executeTime: GM_getValue('executeTime', ''),
        targetSelector: GM_getValue('targetSelector', ''),
        isRunning: false,
        timer: null,
        clickCount: 0,
        
        init() {
            const storedState = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (storedState) {
                const state = JSON.parse(storedState);
                this.isRunning = state.isRunning;
                this.clickCount = state.clickCount;
            }
        },
        
        save() {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                isRunning: this.isRunning,
                clickCount: this.clickCount
            }));
        }
    };

    // UI 控制器
    const UI = {
        init() {
            this.injectStyles();
            this.createControlPanel();
            this.bindEvents();
            this.initializeElementPicker();
            this.updateStatus();
        },

        injectStyles() {
            GM_addStyle(`
                #autoClickControl {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    z-index: 9999;
                    background: #fff;
                    border: 1px solid #ccc;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    min-width: 300px;
                    font-family: Arial, sans-serif;
                }
                #autoClickControl .control-header {
                    font-weight: bold;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #eee;
                }
                #autoClickControl .control-item {
                    margin-bottom: 10px;
                }
                #autoClickControl .control-item label {
                    display: block;
                    margin-bottom: 5px;
                    color: #666;
                    font-size: 12px;
                }
                #autoClickControl input {
                    width: 100%;
                    padding: 5px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    margin-bottom: 5px;
                }
                #autoClickControl .button-group {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                }
                #autoClickControl button {
                    padding: 5px 15px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s;
                }
                #startAutoClick {
                    background: #1890ff;
                    color: white;
                }
                #stopAutoClick {
                    background: #ff4d4f;
                    color: white;
                }
                #startAutoClick:hover {
                    background: #40a9ff;
                }
                #stopAutoClick:hover {
                    background: #ff7875;
                }
                .status-text {
                    font-size: 12px;
                    color: #666;
                    margin-top: 5px;
                    text-align: center;
                }
                #autoClickControl .minimize-btn {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    cursor: pointer;
                    padding: 2px 6px;
                    background: #f0f0f0;
                    border-radius: 3px;
                    font-size: 12px;
                }
                #autoClickControl.minimized {
                    min-width: auto;
                    padding: 5px;
                }
                #autoClickControl.minimized .control-content {
                    display: none;
                }
            `);
        },

        createControlPanel() {
            const controlDiv = document.createElement('div');
            controlDiv.id = CONFIG.CONTROL_PANEL_ID;
            controlDiv.innerHTML = `
                <div class="minimize-btn">_</div>
                <div class="control-content">
                    <div class="control-header">自动点击控制面板</div>
                    <div class="control-item">
                        <label>执行时间:</label>
                        <input type="datetime-local" id="executeTimeInput" step="1">
                    </div>
                    <div class="control-item">
                        <label>目标元素 (CSS选择器):</label>
                        <input type="text" id="targetSelectorInput" placeholder="请输入CSS选择器">
                        <button id="pickElement" style="width: auto; margin-top: 5px;">选择元素</button>
                    </div>
                    <div class="button-group">
                        <button id="startAutoClick">开始</button>
                        <button id="stopAutoClick">停止</button>
                    </div>
                    <div class="status-text" id="statusText"></div>
                </div>
            `;
            document.body.appendChild(controlDiv);

            // 初始化输入框值
            if (State.executeTime) {
                document.getElementById('executeTimeInput').value = State.executeTime.replace(' ', 'T');
            }
            if (State.targetSelector) {
                document.getElementById('targetSelectorInput').value = State.targetSelector;
            }
        },

        bindEvents() {
            // 最小化功能
            const minimizeBtn = document.querySelector('.minimize-btn');
            minimizeBtn.addEventListener('click', () => {
                const controlDiv = document.getElementById(CONFIG.CONTROL_PANEL_ID);
                controlDiv.classList.toggle('minimized');
                minimizeBtn.textContent = controlDiv.classList.contains('minimized') ? '+' : '_';
            });

            // 输入框事件
            document.getElementById('executeTimeInput').addEventListener('change', function() {
                State.executeTime = this.value.replace('T', ' ');
                GM_setValue('executeTime', State.executeTime);
                UI.updateStatus();
            });

            document.getElementById('targetSelectorInput').addEventListener('change', function() {
                State.targetSelector = this.value;
                GM_setValue('targetSelector', State.targetSelector);
                UI.updateStatus();
            });

            // 控按钮事件
            document.getElementById('startAutoClick').addEventListener('click', () => Controller.start());
            document.getElementById('stopAutoClick').addEventListener('click', () => Controller.stop());
        },

        updateStatus() {
            const statusText = document.getElementById('statusText');
            const timeStr = State.executeTime ? new Date(State.executeTime).toLocaleString() : '未设置';
            const selectorStr = State.targetSelector || '未设置';
            const elements = document.querySelectorAll(State.targetSelector);
            const totalElements = elements.length;
            
            statusText.innerHTML = `
                当前状态: ${State.isRunning ? '运行中' : '已停止'}<br>
                执行时间: ${timeStr}<br>
                目标元素: ${selectorStr} (匹配到 ${totalElements} 个元素)<br>
                点击次数: ${State.clickCount}/${CONFIG.MAX_CLICKS * Math.max(1, totalElements)}
            `;
        },

        updateButtonState() {
            document.getElementById('startAutoClick').disabled = State.isRunning;
            document.getElementById('stopAutoClick').disabled = !State.isRunning;
        },

        initializeElementPicker() {
            const pickButton = document.getElementById('pickElement');
            pickButton.addEventListener('click', () => ElementPicker.enable());
        }
    };

    // 点击控制器
    const ClickController = {
        findAttempts: 0,

        async performClicks() {
            this.findAttempts = 0;
            
            for (let i = 0; i < CONFIG.MAX_CLICKS; i++) {
                if (!State.isRunning) return false;
                
                const elements = await this.findElements();
                if (!elements) {
                    Controller.stop();
                    alert(`未找到目标元素，已尝试 ${CONFIG.MAX_FIND_ATTEMPTS} 次，脚本已停止`);
                    return false;
                }

                let allElementsProcessed = true;
                for (const element of elements) {
                    if (!State.isRunning) return false;
                    
                    if (this.checkElementInnerHTML(element)) {
                        console.log('元素内容为"去使用"，跳过点击');
                        continue;
                    }
                    
                    element.click();
                    State.clickCount++;
                    console.log(`点击元素 (${State.clickCount}/${CONFIG.MAX_CLICKS * elements.length})`);
                    
                    await new Promise(resolve => setTimeout(resolve, 10));
                    
                    if (this.checkElementInnerHTML(element)) {
                        allElementsProcessed = false;
                        break;
                    }
                }
                
                UI.updateStatus();
                
                if (allElementsProcessed) {
                    console.log('所有元素处理完成，停止脚本');
                    Controller.stop();
                    alert('所有元素处理完成，脚本已停止');
                    return false;
                }
            }
            
            // 达到最大点击次数，停止脚本
            if (State.isRunning) {
                Controller.stop();
                alert('已达到最大点击次数，脚本已停止');
            }
            return false;
        },
        
        async findElements() {
            while (this.findAttempts < CONFIG.MAX_FIND_ATTEMPTS) {
                const elements = document.querySelectorAll(State.targetSelector);
                if (elements.length > 0) {
                    console.log(`找到 ${elements.length} 个目标元素`);
                    return elements;
                }
                
                this.findAttempts++;
                console.log(`未找到目标元素，第 ${this.findAttempts} 次尝试`);
                
                document.getElementById('statusText').innerHTML = `
                    当前状态: 查找目标元素中 (${this.findAttempts}/${CONFIG.MAX_FIND_ATTEMPTS})<br>
                    目标选择器: ${State.targetSelector}
                `;
                
                await new Promise(resolve => setTimeout(resolve, CONFIG.FIND_INTERVAL));
            }
            
            return null;
        },
        
        checkElementInnerHTML(element) {
            return element && element.innerHTML.includes("去使用");
        }
    };

    // 元素选择器工具
    const ElementPicker = {
        isActive: false,
        overlay: null,
        highlightElement: null,
        currentPanel: null,
        
        enable() {
            if (this.isActive) return;
            
            this.isActive = true;
            const controlPanel = document.getElementById(CONFIG.CONTROL_PANEL_ID);
            controlPanel.style.pointerEvents = 'none';

            this.overlay = this.createOverlay();
            this.highlightElement = this.createHighlightElement();

            document.body.appendChild(this.overlay);
            document.body.appendChild(this.highlightElement);

            this.setupOverlayEvents(controlPanel);
        },

        cleanup() {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            if (this.highlightElement && this.highlightElement.parentNode) {
                this.highlightElement.parentNode.removeChild(this.highlightElement);
            }
            
            const panels = document.querySelectorAll('div[style*="z-index: 10002"]');
            panels.forEach(panel => {
                if (panel.parentNode) {
                    panel.parentNode.removeChild(panel);
                }
            });
            
            const controlPanel = document.getElementById(CONFIG.CONTROL_PANEL_ID);
            if (controlPanel) {
                controlPanel.style.pointerEvents = 'auto';
            }
            
            this.isActive = false;
            this.overlay = null;
            this.highlightElement = null;
            this.currentPanel = null;

            document.removeEventListener('keydown', this.handleKeyPress);
        },

        createOverlay() {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                cursor: crosshair;
                z-index: 10000;
            `;
            return overlay;
        },

        createHighlightElement() {
            const highlightElement = document.createElement('div');
            highlightElement.style.cssText = `
                position: fixed;
                border: 2px solid #ff0000;
                background: rgba(255, 0, 0, 0.2);
                pointer-events: none;
                z-index: 10001;
                display: none;
            `;
            return highlightElement;
        },

        setupOverlayEvents(controlPanel) {
            let hoveredElement = null;

            this.overlay.addEventListener('mousemove', (e) => {
                e.stopPropagation();
                this.overlay.style.pointerEvents = 'none';
                hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
                this.overlay.style.pointerEvents = 'auto';
                this.updateHighlight(hoveredElement, controlPanel);
            });

            this.overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (hoveredElement && hoveredElement !== this.overlay) {
                    if (this.currentPanel && this.currentPanel.parentNode) {
                        this.currentPanel.parentNode.removeChild(this.currentPanel);
                    }

                    const selectors = this.generateSelectors(hoveredElement);
                    const panel = this.createSelectorPanel(selectors, hoveredElement, e.clientX, e.clientY);
                    document.body.appendChild(panel);
                    this.currentPanel = panel;
                }
            });

            document.addEventListener('keydown', this.handleKeyPress);
        },

        updateHighlight(element, controlPanel) {
            if (!element || element === this.overlay || element === controlPanel) {
                this.highlightElement.style.display = 'none';
                return;
            }

            const rect = element.getBoundingClientRect();
            this.highlightElement.style.display = 'block';
            this.highlightElement.style.top = rect.top + 'px';
            this.highlightElement.style.left = rect.left + 'px';
            this.highlightElement.style.width = rect.width + 'px';
            this.highlightElement.style.height = rect.height + 'px';
        },

        generateSelectors(element) {
            const selectors = [];
            
            // 基础选择器
            if (element.className) {
                const classes = element.className.trim().split(/\s+/);
                if (classes[0]) {
                    selectors.push(`${element.tagName.toLowerCase()}.${classes[0]}`);
                }
            }
            
            // 带父元素的选择器
            let parent = element.parentElement;
            if (parent && parent.className) {
                const parentClass = parent.className.trim().split(/\s+/)[0];
                selectors.push(`.${parentClass} ${selectors[0]}`);
            }
            
            // 带couponOuterWrapper的选择器
            let wrapper = element.closest('.couponOuterWrapper_88763c3f');
            if (wrapper) {
                const allWrappers = Array.from(document.querySelectorAll('.couponOuterWrapper_88763c3f'));
                const wrapperIndex = allWrappers.indexOf(wrapper);
                if (wrapperIndex !== -1) {
                    selectors.push(`.couponOuterWrapper_88763c3f:nth-of-type(${wrapperIndex + 1}) ${selectors[0]}`);
                }
            }
            
            return selectors;
        },

        createSelectorPanel(selectors, element, x, y) {
            const panel = document.createElement('div');
            panel.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 10002;
                max-width: 300px;
            `;
            
            panel.innerHTML = `
                <div style="margin-bottom: 8px; font-weight: bold;">请选择合适的选择器：</div>
                <div class="selector-list" style="max-height: 200px; overflow-y: auto;"></div>
            `;
            
            const selectorList = panel.querySelector('.selector-list');
            
            selectors.forEach(selector => {
                const count = document.querySelectorAll(selector).length;
                const item = document.createElement('div');
                item.style.cssText = `
                    padding: 5px;
                    margin: 2px 0;
                    cursor: pointer;
                    border-radius: 3px;
                    background: #f5f5f5;
                `;
                item.innerHTML = `
                    <div style="font-size: 12px; color: #666;">匹配到 ${count} 个元素</div>
                    <div style="word-break: break-all;">${selector}</div>
                `;
                
                item.addEventListener('mouseover', () => {
                    item.style.background = '#e6f7ff';
                });
                
                item.addEventListener('mouseout', () => {
                    item.style.background = '#f5f5f5';
                });
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetSelectorInput = document.getElementById('targetSelectorInput');
                    targetSelectorInput.value = selector;
                    State.targetSelector = selector;
                    GM_setValue('targetSelector', selector);
                    UI.updateStatus();
                    
                    this.cleanup();
                });
                
                selectorList.appendChild(item);
            });
            
            return panel;
        },

        handleKeyPress(e) {
            if (e.key === 'Escape') {
                ElementPicker.cleanup();
            }
        }
    };

    // 主控制器
    const Controller = {
        async start() {
            if (!State.executeTime || !State.targetSelector) {
                alert('请先设置执行时间和目标元素');
                return;
            }
            
            State.isRunning = true;
            State.clickCount = 0;
            this.main();
            UI.updateStatus();
            UI.updateButtonState();
            State.save();
        },
        
        stop() {
            State.isRunning = false;
            if (State.timer) {
                clearTimeout(State.timer);
                State.timer = null;
            }
            UI.updateStatus();
            UI.updateButtonState();
            State.save();
        },
        
        async main() {
            if (!State.executeTime || !State.targetSelector) {
                document.getElementById('statusText').textContent = '请先设置执行时间和目标元素';
                return;
            }

            const targetTime = new Date(State.executeTime).getTime();
            const now = new Date().getTime();

            if (now < targetTime) {
                const delay = targetTime - now;
                document.getElementById('statusText').textContent = 
                    `将在 ${Math.floor(delay/1000)} 秒后执行点击操作`;
                State.timer = setTimeout(() => this.executeClickSequence(), delay);
            } else {
                document.getElementById('statusText').textContent = '指定时间已过,立即执行点击操作';
                this.executeClickSequence();
            }
        },

        async executeClickSequence() {
            if (State.isRunning) {
                await ClickController.performClicks();
            }
        }
    };

    // 初始化
    function initialize() {
        State.init();
        UI.init();
        
        if (State.isRunning) {
            Controller.main();
        }
    }

    initialize();
})();

