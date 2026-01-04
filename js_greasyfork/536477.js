// ==UserScript==
// @name         免费！！山东省执业药师继续教育助手（基础版）
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  自动处理山东省执业药师继续教育网站的弹窗提示，支持自动处理休息提示、可拖拽控制面板、实时日志显示等功能。
// @author       Age_data
// @match        *://*.sdlpa.org.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @homepage     https://greasyfork.org/scripts/your-script-id
// @supportURL   https://greasyfork.org/scripts/your-script-id/feedback
// @icon         https://www.google.com/s2/favicons?domain=sdlpa.org.cn
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536477/%E5%85%8D%E8%B4%B9%EF%BC%81%EF%BC%81%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A9%E6%89%8B%EF%BC%88%E5%9F%BA%E7%A1%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536477/%E5%85%8D%E8%B4%B9%EF%BC%81%EF%BC%81%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A9%E6%89%8B%EF%BC%88%E5%9F%BA%E7%A1%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

/**
 * 山东省执业药师继续教育助手
 * 
 * 功能说明：
 * 1. 自动处理网站弹窗提示
 * 2. 智能识别并处理休息提示
 * 3. 提供可拖拽的控制面板
 * 4. 实时显示操作日志
 * 5. 支持一键开启/暂停功能
 * 6. 首次使用时间记录和过期检测
 * 
 * 使用说明：
 * 1. 安装脚本后，在网站右上角会出现控制面板
 * 2. 点击"开始"按钮启动自动处理功能
 * 3. 可以通过拖拽标题栏移动控制面板位置
 * 4. 日志区域会实时显示脚本运行状态
 * 5. 点击"清除日志"可以清空日志记录
 * 
 * 注意事项：
 * 1. 本脚本仅供学习交流使用
 * 2. 请遵守相关法律法规和网站使用规则
 * 3. 建议合理使用，避免过度依赖
 * 4. 脚本有效期为150天
 * 
 * 更新日志：
 * v1.0 (2024-03-xx)
 * - 首次发布
 * - 实现基础弹窗处理功能
 * - 添加控制面板和日志显示
 * - 支持自动处理休息提示
 * - 添加首次使用时间记录和过期检测
 */

(function() {
    'use strict';

    // 检查是否在目标网站
    if (!window.location.hostname.endsWith('sdlpa.org.cn')) {
        return;
    }

    // 检查脚本是否过期
    const firstRunTime = GM_getValue('firstRunTime', null);
    const currentTime = new Date().getTime();
    const EXPIRY_DAYS = 150;
    const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

    if (!firstRunTime) {
        // 首次运行，记录时间
        GM_setValue('firstRunTime', currentTime);
    } else {
        // 检查是否过期
        const daysPassed = (currentTime - firstRunTime) / MILLISECONDS_PER_DAY;
        if (daysPassed > EXPIRY_DAYS) {
            alert('脚本已过期，请联系开发者更新！');
            return;
        }
    }

    /**
     * 配置参数
     * @type {Object}
     * @property {number} logMaxLines - 日志窗口最大显示行数
     * @property {number} panelWidth - 控制面板宽度
     * @property {number} panelHeight - 控制面板高度
     * @property {number} logHeight - 日志区域高度
     * @property {number} popupCheckInterval - 检查弹窗的间隔（毫秒）
     */
    const config = {
        logMaxLines: 100,    // 日志窗口最大显示行数
        panelWidth: 300,     // 控制面板宽度
        panelHeight: 200,    // 控制面板高度
        logHeight: 100,      // 日志区域高度
        popupCheckInterval: 50 // 检查弹窗的间隔（毫秒）
    };

    /**
     * 全局变量
     * @type {Object}
     */
    let scriptEnabled = GM_getValue('scriptEnabled', false);  // 脚本运行状态
    let controlPanel = null;                                 // 控制面板元素
    let logWindow = null;                                    // 日志窗口元素
    let popupCheckInterval = null;                           // 弹窗检查定时器
    let lastPopupContent = '';                              // 上次处理的弹窗内容
    let popupHandling = false;                              // 是否正在处理弹窗
    let isRunning = false;                                  // 脚本是否正在运行

    /**
     * 处理弹窗
     * 自动检测并处理网站上的弹窗提示
     * @returns {Promise<void>}
     */
    async function handlePopup() {
        if (popupHandling) return;

        const popup = document.querySelector('.el-message-box');
        if (!popup) return;

        const popupContent = popup.querySelector('.el-message-box__message')?.textContent?.trim();
        const popupTitle = popup.querySelector('.el-message-box__title span')?.textContent?.trim();
        
        if (popupContent === lastPopupContent) return;
        
        addLog(`检测到弹窗: ${popupTitle || '无标题'} - ${popupContent || '无内容'}`);

        const confirmButton = popup.querySelector('.el-message-box__btns .el-button--primary');
        if (!confirmButton) {
            addLog('未找到确定按钮');
            return;
        }

        popupHandling = true;
        lastPopupContent = popupContent;

        const isRestPopup = popupContent.includes('请稍事休息后继续学习');
        const delay = isRestPopup ? 1 : (Math.random() * 2 + 0.5);
        
        await new Promise(resolve => setTimeout(resolve, delay * 1000));

        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                // 尝试多种方式触发按钮点击
                const clickMethods = [
                    // 方法1: 直接调用按钮的click方法
                    () => {
                        confirmButton.click();
                    },
                    // 方法2: 创建并分发鼠标事件
                    () => {
                        const event = new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        confirmButton.dispatchEvent(event);
                        
                        setTimeout(() => {
                            const event2 = new MouseEvent('mouseup', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            confirmButton.dispatchEvent(event2);
                            
                            setTimeout(() => {
                                const event3 = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                });
                                confirmButton.dispatchEvent(event3);
                            }, 50);
                        }, 50);
                    },
                    // 方法3: 使用原生DOM事件
                    () => {
                        const event = document.createEvent('MouseEvents');
                        event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        confirmButton.dispatchEvent(event);
                    },
                    // 方法4: 模拟键盘回车
                    () => {
                        const event = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                            cancelable: true
                        });
                        confirmButton.dispatchEvent(event);
                    }
                ];

                for (const clickMethod of clickMethods) {
                    try {
                        clickMethod();
                        // 等待检查弹窗是否消失
                        await new Promise(resolve => setTimeout(resolve, 200));
                        
                        // 检查弹窗是否还存在
                        if (!document.querySelector('.el-message-box')) {
                            addLog('弹窗已关闭');
                            popupHandling = false;
                            lastPopupContent = '';
                            return;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                retryCount++;
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                retryCount++;
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        if (retryCount >= maxRetries) {
            addLog('多次尝试关闭弹窗失败，尝试强制关闭');
            try {
                // 尝试移除弹窗元素
                const messageBox = document.querySelector('.el-message-box');
                if (messageBox && messageBox.parentNode) {
                    messageBox.parentNode.removeChild(messageBox);
                    addLog('已强制移除弹窗');
                }
            } catch (e) {
                addLog('强制移除弹窗失败');
            }
        }

        popupHandling = false;
        lastPopupContent = '';
    }

    /**
     * 创建提示框
     * @param {string} message - 提示信息
     * @param {string} type - 提示类型（info/error）
     */
    function createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: opacity 0.3s;
            background: ${type === 'info' ? '#2196F3' : '#f44336'};
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // 3秒后淡出并移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * 开始自动处理弹窗
     * 启动定时器定期检查并处理弹窗
     */
    function startAutoHandle() {
        if (popupCheckInterval) {
            clearInterval(popupCheckInterval);
        }

        createNotification('弹窗自动处理已启动', 'info');
        isRunning = true;

        popupCheckInterval = setInterval(() => {
            if (scriptEnabled) {
                handlePopup();
            }
        }, config.popupCheckInterval);
    }

    /**
     * 停止自动处理
     * 清除定时器并停止处理弹窗
     */
    function stopAutoHandle() {
        if (popupCheckInterval) {
            clearInterval(popupCheckInterval);
            popupCheckInterval = null;
        }
        isRunning = false;
        createNotification('弹窗自动处理已停止', 'info');
    }

    /**
     * 创建控制面板
     * 生成可拖拽的控制面板，包含状态显示和日志区域
     * @returns {Object} 包含面板和日志区域的引用
     */
    function createControlPanel() {
        // 检查是否已存在面板，若存在则直接返回
        let existPanel = document.getElementById('popup-handler-panel');
        if (existPanel) {
            logWindow = existPanel.querySelector('[data-log-area]');
            return { panel: existPanel, logArea: logWindow };
        }

        const panel = document.createElement('div');
        panel.id = 'popup-handler-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: ${config.panelWidth}px;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        // 标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        `;
        titleBar.innerHTML = `
            <span style="font-weight: bold;">弹窗自动处理</span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span id="statusText" style="
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 4px;
                    background: ${scriptEnabled ? '#4CAF50' : '#f44336'};
                ">${scriptEnabled ? '运行中...' : '已停止'}</span>
                <button id="toggleScript" style="
                    background: ${scriptEnabled ? '#4CAF50' : '#f44336'};
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                ">${scriptEnabled ? '停止' : '开始'}</button>
            </div>
        `;
        panel.appendChild(titleBar);

        // 添加提示信息区域
        const noticeArea = document.createElement('div');
        noticeArea.style.cssText = `
            background: rgba(255, 193, 7, 0.2);
            border: 1px solid #ffc107;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 10px;
            font-size: 12px;
            color: #ffc107;
            text-align: center;
        `;
        
        // 计算剩余天数
        let remainingDays = EXPIRY_DAYS;
        
        if (firstRunTime) {
            const daysPassed = Math.floor((currentTime - firstRunTime) / MILLISECONDS_PER_DAY);
            remainingDays = Math.max(0, EXPIRY_DAYS - daysPassed);
        }
        
        noticeArea.innerHTML = `
            <div style="margin-bottom: 5px;">更多功能请联系作者，微信：Age_data</div>
            <div style="font-weight: bold;">免费版适用剩余 ${remainingDays} 天</div>
        `;
        panel.appendChild(noticeArea);

        // 日志区域
        const logArea = document.createElement('div');
        logArea.setAttribute('data-log-area', '1');
        logArea.style.cssText = `
            height: ${config.logHeight}px;
            background: rgba(0,0,0,0.5);
            border-radius: 4px;
            padding: 10px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            margin-top: 10px;
        `;
        panel.appendChild(logArea);

        // 添加清除日志按钮
        const clearLogBtn = document.createElement('button');
        clearLogBtn.textContent = '清除日志';
        clearLogBtn.style.cssText = `
            background: #9E9E9E;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            width: 100%;
            transition: background-color 0.3s;
        `;
        clearLogBtn.onclick = () => {
            logArea.innerHTML = '';
            addLog('日志已清除');
        };
        panel.appendChild(clearLogBtn);

        // 添加拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        titleBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === titleBar || e.target.parentNode === titleBar) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        // 修改 toggleScript 按钮的点击事件处理
        titleBar.querySelector('#toggleScript').addEventListener('click', () => {
            scriptEnabled = !scriptEnabled;
            GM_setValue('scriptEnabled', scriptEnabled);
            if (scriptEnabled) {
                startAutoHandle();
            } else {
                stopAutoHandle();
            }
            updateToggleButton(titleBar.querySelector('#toggleScript'));
            addLog(`脚本已${scriptEnabled ? '启动' : '暂停'}`);
        });

        document.body.appendChild(panel);
        return { panel, logArea };
    }

    /**
     * 更新开关按钮状态
     * @param {HTMLElement} button - 按钮元素
     */
    function updateToggleButton(button) {
        const statusText = document.querySelector('#statusText');
        const isActive = scriptEnabled && isRunning;
        button.textContent = isActive ? '停止' : '开始';
        button.style.background = isActive ? '#4CAF50' : '#f44336';
        statusText.textContent = isActive ? '运行中...' : '已停止';
        statusText.style.background = isActive ? '#4CAF50' : '#f44336';
    }

    /**
     * 添加日志
     * @param {string} message - 日志信息
     */
    function addLog(message) {
        if (!logWindow) {
            const { logArea } = createControlPanel();
            logWindow = logArea;
        }
        
        const logLine = document.createElement('div');
        logLine.style.cssText = `
            margin: 2px 0;
            padding: 2px 5px;
            border-radius: 3px;
            background: rgba(255,255,255,0.05);
        `;
        logLine.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logWindow.appendChild(logLine);
        
        // 保持最新的日志行数
        while (logWindow.children.length > config.logMaxLines) {
            logWindow.removeChild(logWindow.firstChild);
        }
        
        // 自动滚动到底部
        logWindow.scrollTop = logWindow.scrollHeight;
    }

    // 页面加载完成后初始化
    window.addEventListener('load', () => {
        createControlPanel();
        addLog('脚本已启动');
        if (scriptEnabled) {
            startAutoHandle();
        } else {
            updateToggleButton(document.querySelector('#toggleScript'));
        }
    });

})(); 