// ==UserScript==
// @name         AI Studio 连续点5次继续
// @name:en      AI Studio Continuous Click 5 Times
// @namespace    https://github.com/Huoyuuu/
// @version      3.5
// @description  在Google AI Studio页面添加按钮，可连续点5次继续。
// @description:en Adds a control panel to Google AI Studio, enabling 5 consecutive "Continue" clicks.
// @author       Huoyuuu & AI Assistant
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=aistudio.google.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541325/AI%20Studio%20%E8%BF%9E%E7%BB%AD%E7%82%B95%E6%AC%A1%E7%BB%A7%E7%BB%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/541325/AI%20Studio%20%E8%BF%9E%E7%BB%AD%E7%82%B95%E6%AC%A1%E7%BB%A7%E7%BB%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[AI Studio Script] v3.4 - Execution started.');

    try {
        // --- 全局状态 ---
        let isProcessRunning = false;
        let forceStopRequested = false;

        // --- 配置区域 ---
        const DEFAULT_CYCLES = 5;
        const CONTINUE_MESSAGE = '继续';
        const MAX_WAIT_SECONDS = 180;

        // --- 【关键优化】选择器 ---
        // 使用更简短、更健壮的选择器，它们不依赖于动态生成的类名，能同时匹配初始状态和对话状态。
        const INPUT_SELECTOR = 'ms-autosize-textarea textarea';
        const SEND_BUTTON_SELECTOR = 'run-button button';
        // 我们使用一个更高层的、稳定的组件作为页面加载完成的标志。
        const INIT_READY_SELECTOR = 'ms-chunk-editor';

        // --- 核心功能函数 ---
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        function isGenerating() {
            const sendButton = document.querySelector(SEND_BUTTON_SELECTOR);
            return sendButton?.disabled || sendButton?.querySelector('svg') !== null;
        }

        function updateInfo(text, type = 'info', timerText = '') {
            const infoPanel = document.getElementById('control-panel-info');
            if (infoPanel) {
                infoPanel.textContent = text + (timerText ? ` ${timerText}` : '');
                infoPanel.className = `info-panel ${type}`;
            }
        }

        async function sendAndWait(message, infoPrefix, options = {}) {
            if (forceStopRequested) throw new Error('用户强制终止');
            updateInfo(`${infoPrefix}: 准备中...`);

            if (!options.skipInitialWaitCheck && isGenerating()) {
                updateInfo(`${infoPrefix}: 检测到AI仍在回复，等待...`);
                while (isGenerating()) {
                    if (forceStopRequested) throw new Error('用户强制终止');
                    await sleep(500);
                }
            }
            
            // 每次都重新查找元素，以适应动态UI
            const inputEl = document.querySelector(INPUT_SELECTOR);
            const sendBtn = document.querySelector(SEND_BUTTON_SELECTOR);
            if (!inputEl) throw new Error("关键错误：无法找到输入框！请检查选择器。");
            if (!sendBtn) throw new Error("关键错误：无法找到发送按钮！请检查选择器。");

            updateInfo(`${infoPrefix}: 正在输入'${message.slice(0, 10)}...'`);
            inputEl.value = message;
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(100);

            sendBtn.click();
            await sleep(200);

            updateInfo(`${infoPrefix}: 等待AI回复...`);
            let waitSeconds = 0;
            while (isGenerating()) {
                if (forceStopRequested) throw new Error('用户强制终止');
                if (waitSeconds >= MAX_WAIT_SECONDS) throw new Error("等待AI回复超时！");
                
                const timer = `(${waitSeconds}s / ${MAX_WAIT_SECONDS}s)`;
                updateInfo(`${infoPrefix}: 等待AI回复...`, 'info', timer);
                
                await sleep(1000);
                waitSeconds++;
            }

            updateInfo(`${infoPrefix}: 回复已完成！`, 'success');
            await sleep(1000);
        }

        // --- 任务流程 ---
        async function startMultiStepProcess() {
            const cycles = parseInt(document.getElementById('continue-cycles-input').value, 10);
            const initialPrompt = prompt('请输入您的初始提示词：', '请帮我写一个关于未来城市生活的短篇故事大纲，分段详细描述。');
            if (!initialPrompt) {
                updateInfo('操作已取消。');
                throw new Error('用户取消输入'); 
            }
            await sendAndWait(initialPrompt, '初始任务', { skipInitialWaitCheck: true });
            for (let i = 1; i <= cycles; i++) {
                await sendAndWait(CONTINUE_MESSAGE, `继续 (${i}/${cycles})`);
            }
            updateInfo(`任务完成！(1+${cycles})`, 'success');
        }

        async function startContinueOnlyProcess() {
            const cycles = parseInt(document.getElementById('continue-cycles-input').value, 10);
            for (let i = 1; i <= cycles; i++) {
                await sendAndWait(CONTINUE_MESSAGE, `继续 (${i}/${cycles})`);
            }
            updateInfo(`任务完成！(${cycles}次继续)`, 'success');
        }

        // --- UI 与 总控 ---
        function setUIState(running) {
            document.getElementById('multi-step-btn').style.display = running ? 'none' : 'block';
            document.getElementById('continue-only-btn').style.display = running ? 'none' : 'block';
            document.getElementById('controls-settings').style.display = running ? 'none' : 'flex';
            document.getElementById('force-stop-btn').style.display = running ? 'block' : 'none';
            isProcessRunning = running;
        }

        async function runProcess(processFunction) {
            if (isProcessRunning) return;
            const cyclesInput = document.getElementById('continue-cycles-input');
            const cycles = parseInt(cyclesInput.value, 10);
            if (isNaN(cycles) || cycles < 1) {
                alert('请输入一个大于0的有效数字！');
                cyclesInput.focus();
                return;
            }
            setUIState(true);
            forceStopRequested = false;
            try {
                await processFunction();
            } catch (error) {
                if (error.message !== '用户取消输入' && error.message !== '用户强制终止') {
                    console.error('[AI Studio Script] An error occurred during process:', error);
                    updateInfo(`错误: ${error.message}`, 'error');
                } else {
                    updateInfo(error.message, 'info');
                }
            } finally {
                setUIState(false);
            }
        }

        function createUI() {
            if (document.getElementById('control-panel-container')) return;

            const container = document.createElement('div');
            container.id = 'control-panel-container';
            const infoPanel = document.createElement('div');
            infoPanel.id = 'control-panel-info';
            infoPanel.className = 'info-panel';
            const controls = document.createElement('div');
            controls.id = 'controls-wrapper';
            const settingsDiv = document.createElement('div');
            settingsDiv.id = 'controls-settings';
            const label = document.createElement('label');
            label.htmlFor = 'continue-cycles-input';
            label.title = '设置“继续”的次数';
            label.textContent = '次数:';
            const input = document.createElement('input');
            input.type = 'number';
            input.id = 'continue-cycles-input';
            input.min = '1';
            input.value = DEFAULT_CYCLES;
            settingsDiv.appendChild(label);
            settingsDiv.appendChild(input);
            const multiStepBtn = document.createElement('button');
            multiStepBtn.id = 'multi-step-btn';
            multiStepBtn.className = 'control-btn primary';
            multiStepBtn.textContent = '启动 (1+N)';
            multiStepBtn.title = '先输入初始提示，然后自动继续N次';
            multiStepBtn.addEventListener('click', () => runProcess(startMultiStepProcess));
            const continueOnlyBtn = document.createElement('button');
            continueOnlyBtn.id = 'continue-only-btn';
            continueOnlyBtn.className = 'control-btn secondary';
            continueOnlyBtn.textContent = '仅继续 (N次)';
            continueOnlyBtn.title = '直接发送N次“继续”';
            continueOnlyBtn.addEventListener('click', () => runProcess(startContinueOnlyProcess));
            const forceStopBtn = document.createElement('button');
            forceStopBtn.id = 'force-stop-btn';
            forceStopBtn.className = 'control-btn danger';
            forceStopBtn.textContent = '强制终止';
            forceStopBtn.style.display = 'none';
            forceStopBtn.addEventListener('click', () => { forceStopRequested = true; updateInfo('正在终止...', 'error'); });
            controls.appendChild(settingsDiv);
            controls.appendChild(multiStepBtn);
            controls.appendChild(continueOnlyBtn);
            controls.appendChild(forceStopBtn);
            container.appendChild(infoPanel);
            container.appendChild(controls);
            document.body.appendChild(container);
            GM_addStyle(`
                #control-panel-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
                #controls-wrapper { display: flex; gap: 8px; align-items: center; background-color: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); padding: 8px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .info-panel { background-color: rgba(32, 33, 36, 0.85); color: white; padding: 8px 12px; border-radius: 8px; font-size: 13px; text-align: right; min-width: 200px; transition: all 0.3s ease; }
                .info-panel.success { background-color: rgba(46, 125, 50, 0.85); }
                .info-panel.error { background-color: rgba(198, 40, 40, 0.85); }
                #controls-settings { display: flex; align-items: center; gap: 5px; }
                #controls-settings label { font-size: 13px; color: #5f6368; cursor: help; }
                #continue-cycles-input { width: 40px; padding: 6px; border: 1px solid #dadce0; border-radius: 4px; font-size: 14px; text-align: center; }
                #continue-cycles-input:focus { border-color: #1a73e8; outline: none; }
                .control-btn { border: none; border-radius: 8px; padding: 8px 14px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
                .control-btn.primary { background-color: #1a73e8; color: white; }
                .control-btn.primary:hover { background-color: #185abc; }
                .control-btn.secondary { background-color: #e8f0fe; color: #1967d2; border: 1px solid #dadce0;}
                .control-btn.secondary:hover { background-color: #d2e3fc; }
                .control-btn.danger { background-color: #d93025; color: white; }
                .control-btn.danger:hover { background-color: #a50e0e; }
            `);
           setTimeout(() => updateInfo('控制面板已就绪'), 0);
        }

        // --- 初始化逻辑 ---
        const checkInterval = setInterval(() => {
            const targetElement = document.querySelector(INIT_READY_SELECTOR);
            if (targetElement) {
                console.log('[AI Studio Script] Ready signal detected. Initializing UI.');
                clearInterval(checkInterval);
                createUI();
            }
        }, 500);

    } catch (e) {
        console.error('[AI Studio Script] A critical error occurred during script setup:', e);
        alert('AI Studio 自动继续脚本发生严重错误，请检查开发者控制台（F12）获取详情。');
    }
})();