// ==UserScript==
// @name         SillyTavern Auto Connect
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动连接LLM API和AllTalkTTS API
// @match        *://127.0.0.1:8000/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/530465/SillyTavern%20Auto%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/530465/SillyTavern%20Auto%20Connect.meta.js
// ==/UserScript==

if (
    window.location.href !== 'http://127.0.0.1:8000/' &&
    !window.location.href.startsWith('http://127.0.0.1:8000/#')
) {
    console.log('非目标页面，脚本终止');
    return;
}

(function() {
    'use strict';

    // 配置中心
    const CONFIG = {
        buttons: [
            {
                selector: '#api_button_textgenerationwebui',
                name: 'API连接',
                status: {
                    element: '.online_status_indicator',
                    successCondition: el => el.classList.contains('success')
                }
            },
            {
                selector: '#tts_refresh',
                name: 'TTS刷新',
                status: {
                    element: '.at-settings-option.status-option #status_info',
                    successCondition: el => el.innerText.trim() === 'Ready'
                }
            }
        ],
        timing: {
            interval: 1000,     // 检测间隔(ms)，改为1.5秒加快检查速度
            retryLimit: 30     // 最大尝试次数
        }
    };

    // 获取界面显示设置，默认为显示(true)
    let showInterface = GM_getValue('showInterface', true);

    // 注册Tampermonkey菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand(`${showInterface ? '✓ 已启用' : '✗ 已禁用'} 界面显示`, () => {
            showInterface = !showInterface;
            GM_setValue('showInterface', showInterface);

            // 如果面板已创建，则更新其显示状态
            if (statusPanel) {
                statusPanel.style.display = showInterface ? 'block' : 'none';
            }

            // 刷新菜单
            registerMenuCommands();
        });
    }

    // 初始注册菜单
    registerMenuCommands();

    // 创建增强状态面板
    const statusPanel = createStatusPanel();
    let isRunning = true;

    // 状态面板模板
    function createStatusPanel() {
        const panel = document.createElement('div');
        panel.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.85);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 99999;
            font-family: Arial;
            min-width: 220px;
            backdrop-filter: blur(5px);
            display: ${showInterface ? 'block' : 'none'};
        `;
        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="margin:0;color:#4CAF50;font-size:16px;">连接状态监控</h3>
                <div>
                    <button id="stopConnectBtn" style="background:#ff4444;color:white;border:none;border-radius:4px;padding:3px 8px;cursor:pointer;font-size:12px;">停止</button>
                </div>
            </div>
            <div id="statusContent" style="line-height:1.6;font-size:14px;"></div>
        `;
        document.body.appendChild(panel);

        // 添加停止按钮事件监听
        panel.querySelector('#stopConnectBtn').addEventListener('click', () => {
            isRunning = false;
            const statusContent = panel.querySelector('#statusContent');
            statusContent.innerHTML += `
                <div style="color:#ff9800;margin-top:10px;border-top:1px solid #333;padding-top:8px;">
                    已手动停止连接尝试
                </div>
            `;
            // 3秒后关闭面板
            setTimeout(() => {
                statusPanel.remove();
            }, 3000);
        });

        return panel;
    }

    // 状态检测器
    function checkConnectionStatus(buttonConfig) {
        const statusElement = document.querySelector(buttonConfig.status.element);
        if (!statusElement) return false;
        return buttonConfig.status.successCondition(statusElement);
    }

    // 增强点击方法
    async function performEnhancedClick(selector) {
        const btn = document.querySelector(selector);
        if (!btn) return false;

        // 使用更温和的方式触发点击，避免干扰用户操作
        try {
            // 直接调用按钮的原生click方法，而不是分发多个鼠标事件
            btn.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        } catch (error) {
            console.error(`点击按钮 ${selector} 时出错:`, error);
            return false;
        }
    }

    // 更新状态显示
    function updateStatusDisplay(attempts) {
        const statusContent = statusPanel.querySelector('#statusContent');
        let html = CONFIG.buttons.map(btn => {
            const isConnected = checkConnectionStatus(btn);
            return `
                <div style="margin-bottom:8px;">
                    <span style="color:${isConnected ? '#4CAF50' : '#ff4444'}">${isConnected ? '✓' : '✗'}</span>
                    ${btn.name}：
                    <span style="color:${isConnected ? '#4CAF50' : '#ff4444'}">
                        ${isConnected ? '已连接' : '未连接'}
                    </span>
                </div>
            `;
        }).join('');

        html += `
            <div style="border-top:1px solid #333;padding-top:8px;margin-top:8px;">
                尝试次数：${attempts}/${CONFIG.timing.retryLimit}<br>
                下次检测：${new Date(Date.now() + CONFIG.timing.interval).toLocaleTimeString()}
            </div>
        `;
        statusContent.innerHTML = html;
    }

    // 主控制器
    async function controlLoop() {
        let attempts = 0;

        // 先检查是否已全部连接
        let initialCheck = true;
        let allConnected = true;
        const connectionStatus = {};

        // 检查每个按钮的连接状态
        for (const btn of CONFIG.buttons) {
            const isConnected = checkConnectionStatus(btn);
            connectionStatus[btn.selector] = isConnected;
            if (!isConnected) allConnected = false;
        }

        // 如果已全部连接，直接显示成功并3秒后关闭
        if (allConnected) {
            updateStatusDisplay(0);
            const statusContent = statusPanel.querySelector('#statusContent');
            statusContent.innerHTML += `
                <div style="color:#4CAF50;margin-top:10px;border-top:1px solid #333;padding-top:8px;">
                    所有连接已成功！无需重连
                </div>
            `;
            setTimeout(() => {
                statusPanel.remove();
            }, 3000);
            return;
        }

        // 如果有未连接的，开始重连流程
        const timer = setInterval(async () => {
            if (!isRunning) {
                clearInterval(timer);
                return;
            }

            attempts++;
            allConnected = true;

            // 只对未连接的按钮进行点击操作
            for (const btn of CONFIG.buttons) {
                const isConnected = checkConnectionStatus(btn);
                connectionStatus[btn.selector] = isConnected;

                if (!isConnected) {
                    // 只点击未连接的按钮
                    const clicked = await performEnhancedClick(btn.selector);
                    if (!clicked) console.warn(`找不到按钮：${btn.name}`);
                    allConnected = false;
                }
            }

            updateStatusDisplay(attempts);

            if (allConnected || attempts >= CONFIG.timing.retryLimit) {
                clearInterval(timer);
                isRunning = false;
                const statusContent = statusPanel.querySelector('#statusContent');
                statusContent.innerHTML += `
                    <div style="color:#${allConnected ? '4CAF50' : 'ff4444'};margin-top:10px;border-top:1px solid #333;padding-top:8px;">
                        ${allConnected ? '所有连接已成功！' : '达到最大尝试次数'}
                    </div>
                `;
                // 添加3秒后移除面板逻辑
                if (allConnected) {
                    setTimeout(() => {
                        statusPanel.remove();
                    }, 3000);
                }
            }
        }, CONFIG.timing.interval);
    }

    // 启动系统
    window.addEventListener('load', () => {
        setTimeout(controlLoop, 2000); // 等待页面初始化
    });
})();