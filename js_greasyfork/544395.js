// ==UserScript==
// @name         Bilibili - AI 小助手字幕提取器
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在视频播放页面右下角添加悬浮按钮，可自动点击AI字幕按钮、智能切换到“字幕列表”标签页、并一键提取所有字幕文本。
// @author       Fine
// @license      MIT
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/544395/Bilibili%20-%20AI%20%E5%B0%8F%E5%8A%A9%E6%89%8B%E5%AD%97%E5%B9%95%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544395/Bilibili%20-%20AI%20%E5%B0%8F%E5%8A%A9%E6%89%8B%E5%AD%97%E5%B9%95%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const SUBTITLE_CONFIGS = [
        {
            name: 'Bilibili',
            host: 'bilibili.com',
            triggerSelector: '.video-ai-assistant',
            panelSelector: 'div[class*="_InteractWrapper_"]',
            // 改为更精确的标签页按钮选择器
            tabButtonSelector: 'div[class*="_TabItem_"]',
            tabSelectorText: '字幕列表',
            containerSelector: 'div[class*="_Subtitles_"]',
            textSelector: 'span[class*="_Text_"]',
        },
        // ... 其他网站配置
    ];

    // --- 脚本核心逻辑 ---

    /**
     * 高可靠性模拟点击函数。
     * @param {Element} element - 需要点击的 DOM 元素。
     */
    function simulateClick(element) {
        if (!element) return;
        // 依次尝试多种事件，以兼容不同框架的事件监听
        const events = [
            new MouseEvent('pointerdown', { bubbles: true, cancelable: true }),
            new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
            new MouseEvent('pointerup', { bubbles: true, cancelable: true }),
            new MouseEvent('mouseup', { bubbles: true, cancelable: true }),
            new MouseEvent('click', { bubbles: true, cancelable: true })
        ];
        events.forEach(event => element.dispatchEvent(event));
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) { resolve(element); return; }
            const observer = new MutationObserver((mutations, obs) => {
                const foundElement = document.querySelector(selector);
                if (foundElement) { obs.disconnect(); resolve(foundElement); }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素超时: "${selector}" 在 ${timeout}ms 内未出现。`));
            }, timeout);
        });
    }

    async function performExtraction(uiElements) {
        const { outputTextarea, startButton, copyButton } = uiElements;

        startButton.disabled = true;
        copyButton.disabled = true;
        outputTextarea.value = "正在初始化...";

        try {
            const currentHost = window.location.hostname;
            const config = SUBTITLE_CONFIGS.find(c => currentHost.includes(c.host));
            if (!config) throw new Error("当前网站不受支持。");

            // 步骤 1: 点击主触发按钮
            const triggerButton = document.querySelector(config.triggerSelector);
            if (triggerButton) {
                outputTextarea.value = `[1/4] 找到主按钮，正在模拟点击...`;
                simulateClick(triggerButton);
            } else {
                 console.warn(`未找到主触发按钮 "${config.triggerSelector}"，将直接继续。`);
            }

            // 步骤 2: 等待AI面板容器出现
            outputTextarea.value = `[2/4] 等待AI面板 "${config.panelSelector}" 加载...`;
            const panel = await waitForElement(config.panelSelector);

            // 步骤 3: 查找并点击 "字幕列表" 标签页 (已优化)
            outputTextarea.value = `[3/4] 面板已加载，查找并点击 "${config.tabSelectorText}" 标签页...`;

            // 查找所有可能的标签按钮
            const tabButtons = panel.querySelectorAll(config.tabButtonSelector);
            let targetTab = null;
            for (const button of tabButtons) {
                if (button.textContent.includes(config.tabSelectorText)) {
                    targetTab = button;
                    break;
                }
            }

            if (targetTab) {
                // 使用高可靠性点击
                simulateClick(targetTab);
            } else {
                throw new Error(`在AI面板中未能找到包含文本 "${config.tabSelectorText}" 的标签页按钮。`);
            }

            // 步骤 4: 等待最终的字幕容器出现
            outputTextarea.value = `[4/4] 等待字幕容器 "${config.containerSelector}" 加载...`;
            const container = await waitForElement(config.containerSelector, 5000);

            outputTextarea.value = "容器已找到，正在提取文本...";

            // 步骤 5: 提取所有字幕文本
            const textElements = container.querySelectorAll(config.textSelector);
            if (textElements.length === 0) {
                throw new Error(`在容器中未能找到任何字幕文本。\n行内文本选择器：\n"${config.textSelector}"`);
            }

            const subtitles = Array.from(textElements)
                .map(el => el.textContent.trim())
                .filter(text => text)
                .join('\n');

            outputTextarea.value = subtitles;
            copyButton.disabled = false;

        } catch (error) {
            outputTextarea.value = `错误：\n${error.message}\n\n请确认页面结构未改变或刷新页面重试。`;
            console.error("字幕提取脚本错误:", error);
        } finally {
            startButton.disabled = false;
        }
    }

    // UI 创建和初始化
    function init() {
        // --- UI 代码 (与上一版相同) ---
        GM_addStyle(`
            #subtitle-extractor-trigger { position: fixed; bottom: 20px; right: 20px; z-index: 99999; background-color: #00a1d6; color: white; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: all 0.2s ease-in-out; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            #subtitle-extractor-trigger:hover { background-color: #00b5e5; transform: translateY(-2px); }
            #subtitle-extractor-modal { position: fixed; z-index: 100000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: none; align-items: center; justify-content: center; }
            #subtitle-extractor-modal .modal-content { background-color: #2c2c2c; color: #e0e0e0; padding: 20px; border-radius: 12px; width: 90%; max-width: 600px; height: 80%; max-height: 700px; display: flex; flex-direction: column; box-shadow: 0 5px 20px rgba(0,0,0,0.5); }
            #subtitle-extractor-modal .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 15px; margin-bottom: 15px; }
            #subtitle-extractor-modal .close-button { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
            #subtitle-extractor-modal .close-button:hover { color: white; }
            #subtitle-extractor-modal .modal-body { flex-grow: 1; display: flex; }
            #subtitle-extractor-modal #subtitle-output { width: 100%; height: 100%; background: #1a1a1a; color: #e0e0e0; border: 1px solid #444; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.6; resize: none; font-family: "Consolas", "Monaco", monospace; }
            #subtitle-extractor-modal .modal-footer { padding-top: 15px; text-align: right; }
            #subtitle-extractor-modal .modal-btn { padding: 10px 20px; border: 1px solid #555; background-color: #3e3e3e; color: white; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; margin-left: 10px; }
            #subtitle-extractor-modal .modal-btn:hover:not(:disabled) { background-color: #555; }
            #subtitle-extractor-modal .modal-btn.primary { background-color: #00a1d6; border-color: #00a1d6; }
            #subtitle-extractor-modal .modal-btn.primary:hover:not(:disabled) { background-color: #00b5e5; }
            #subtitle-extractor-modal .modal-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        `);

        const triggerButton = document.createElement('div');
        triggerButton.textContent = '提取字幕';
        triggerButton.id = 'subtitle-extractor-trigger';
        document.body.appendChild(triggerButton);

        const modalContainer = document.createElement('div');
        modalContainer.id = 'subtitle-extractor-modal';
        modalContainer.innerHTML = `
            <div class="modal-content">
                <div class="modal-header"><h2>提取的字幕</h2><span class="close-button">×</span></div>
                <div class="modal-body"><textarea id="subtitle-output" readonly placeholder="点击“开始提取”按钮来启动..."></textarea></div>
                <div class="modal-footer">
                    <button id="copy-subtitle-btn" class="modal-btn" disabled>复制全部</button>
                    <button id="start-extraction-btn" class="modal-btn primary">开始提取</button>
                </div>
            </div>`;
        document.body.appendChild(modalContainer);

        const uiElements = {
            modalContainer,
            closeButton: modalContainer.querySelector('.close-button'),
            copyButton: document.getElementById('copy-subtitle-btn'),
            startButton: document.getElementById('start-extraction-btn'),
            outputTextarea: document.getElementById('subtitle-output'),
        };

        triggerButton.addEventListener('click', () => { uiElements.modalContainer.style.display = 'flex'; });
        uiElements.closeButton.addEventListener('click', () => { uiElements.modalContainer.style.display = 'none'; });
        modalContainer.addEventListener('click', (event) => { if (event.target === modalContainer) uiElements.modalContainer.style.display = 'none'; });
        uiElements.startButton.addEventListener('click', () => performExtraction(uiElements));
        uiElements.copyButton.addEventListener('click', () => {
            if (!uiElements.outputTextarea.value) return;
            GM_setClipboard(uiElements.outputTextarea.value);
            const originalText = uiElements.copyButton.textContent;
            uiElements.copyButton.textContent = '已复制!';
            setTimeout(() => { uiElements.copyButton.textContent = originalText; }, 2000);
        });
    }

    window.addEventListener('load', init, false);

})();