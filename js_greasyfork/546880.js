// ==UserScript==
// @name         Google AI Studio 聊天记录导出器（修改版）
// @namespace    http://tampermonkey.net/
// @version      1
// @description  自动滚动 Google AI Studio 聊天界面，捕获用户消息、AI 思维链和 AI 回答，导出为 TXT 文件；或直接从 Python SDK 代码块中提取对话并导出。已修复网站更新所导致的问题。按钮已移至左下角并可隐藏。
// @author       pipdax & Gemini
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwNzhmZiI+PHBhdGggZD0iTTE5LjUgMi4yNWgtMTVjLTEuMjQgMC0yLjI1IDEuMDEtMi4yNSAyLjI1djE1YzAgMS4yNCAxLjAxIDIuMjUgMi4yNSAyLjI1aDE1YzEuMjQgMCAyLjI1LTEuMDEgMi4yNS0yLjI1di0xNWMwLTEuMjQtMS4wMS0yLjI1LTIuMjUtMi4yNXptLTIuMjUgNmgtMTAuNWMtLjQxIDAtLjc1LS4zNC0uNzUtLjc1cy4zNC0uNzUuNzUtLjc1aDEwLjVjLjQxIDAgLjc1LjM0Ljc1Ljc1cy0uMzQuNzUtLjc1Ljc1em0wIDRoLTEwLjVjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWgxMC41Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS4yNS43NXptLTMgNGgtNy41Yy0uNDEgMC0uNzUtLjM0LS43NS0uNzVzLjM0LS43NS43NS0uNzVoNy41Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS43NS43NXoiLz48L3N2Zz4=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546880/Google%20AI%20Studio%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E5%99%A8%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546880/Google%20AI%20Studio%20%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA%E5%99%A8%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置常量 ---
    const buttonTextStartScroll = "滚动导出TXT";
    const buttonTextStopScroll = "停止滚动";
    const buttonTextProcessingScroll = "处理滚动数据...";
    const successTextScroll = "滚动导出 TXT 成功!";
    const errorTextScroll = "滚动导出失败";

    const buttonTextStartCode = "从SDK导出对话TXT";
    const buttonTextProcessingCode = "处理SDK代码...";
    const successTextCode = "SDK代码导出成功!";
    const errorTextCode = "SDK代码导出失败";

    const exportTimeout = 3000;
    const EXPORT_FILENAME_PREFIX_SCROLL = 'aistudio_chat_scroll_export_';
    const EXPORT_FILENAME_PREFIX_CODE = 'aistudio_sdk_code_export_';

    const SCROLL_DELAY_MS = 1000;
    const MAX_SCROLL_ATTEMPTS = 300;
    const SCROLL_INCREMENT_FACTOR = 0.85;
    const SCROLL_STABILITY_CHECKS = 3;

    const CODE_BLOCK_SELECTOR = 'ms-get-code-dialog .code-display-body code';

    // --- 脚本内部状态变量 ---
    let isScrolling = false;
    let collectedData = new Map();
    let scrollCount = 0;
    let noChangeCounter = 0;

    // --- UI 界面元素变量 ---
    let captureButtonScroll = null;
    let stopButtonScroll = null;
    let captureButtonCode = null;
    let statusDiv = null;
    let hideButton = null;
    let buttonContainer = null;

    // --- 辅助工具函数 ---
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getCurrentTimestamp() {
        const n = new Date();
        const YYYY = n.getFullYear();
        const MM = (n.getMonth() + 1).toString().padStart(2, '0');
        const DD = n.getDate().toString().padStart(2, '0');
        const hh = n.getHours().toString().padStart(2, '0');
        const mm = n.getMinutes().toString().padStart(2, '0');
        const ss = n.getSeconds().toString().padStart(2, '0');
        return `${YYYY}${MM}${DD}_${hh}${mm}${ss}`;
    }

    function getMainScrollerElement_AiStudio() {
        console.log("尝试查找滚动容器 (用于滚动导出)...");
        let scroller = document.querySelector('.chat-scrollable-container');
        if (scroller && scroller.scrollHeight > scroller.clientHeight) {
            console.log("找到滚动容器 (策略 1: .chat-scrollable-container):", scroller);
            return scroller;
        }
        scroller = document.querySelector('mat-sidenav-content');
        if (scroller && scroller.scrollHeight > scroller.clientHeight) {
            console.log("找到滚动容器 (策略 2: mat-sidenav-content):", scroller);
            return scroller;
        }
        const chatTurnsContainer = document.querySelector('ms-chat-turn')?.parentElement;
        if (chatTurnsContainer) {
            let parent = chatTurnsContainer;
            for (let i = 0; i < 5 && parent; i++) {
                if (parent.scrollHeight > parent.clientHeight + 10 &&
                    (window.getComputedStyle(parent).overflowY === 'auto' || window.getComputedStyle(parent).overflowY === 'scroll')) {
                    console.log("找到滚动容器 (策略 3: 向上查找父元素):", parent);
                    return parent;
                }
                parent = parent.parentElement;
            }
        }
        console.warn("警告 (滚动导出): 未能通过特定选择器精确找到 AI Studio 滚动区域，将尝试使用 document.documentElement。如果滚动不工作，请按F12检查聊天区域的HTML结构，并更新此函数内的选择器。");
        return document.documentElement;
    }

    function findCodeBlockElement() {
        console.log(`尝试查找SDK代码块元素 (选择器: ${CODE_BLOCK_SELECTOR})...`);
        const codeElement = document.querySelector(CODE_BLOCK_SELECTOR);
        if (codeElement) {
            console.log("找到SDK代码块元素:", codeElement);
        } else {
            console.warn(`警告 (SDK代码导出): 未能找到指定的代码块元素 (${CODE_BLOCK_SELECTOR})。请检查页面结构或更新脚本中的选择器。`);
        }
        return codeElement;
    }

    /**
     * 【新增】让指定的按钮边框闪烁红色以提示用户
     */
    function flashGetCodeButton() {
        const getCodeBtn = document.querySelector("#getCodeBtn");
        if (!getCodeBtn) {
            console.warn("无法找到 #getCodeBtn 元素进行闪烁提示。");
            return;
        }
        const originalBorder = getCodeBtn.style.border;
        let flashes = 0;
        const maxFlashes = 6; // 3次亮灭
        getCodeBtn.style.transition = 'border 0.2s ease-in-out';

        const intervalId = setInterval(() => {
            if (flashes >= maxFlashes) {
                clearInterval(intervalId);
                getCodeBtn.style.border = originalBorder; // 恢复原始边框
                return;
            }
            getCodeBtn.style.border = (flashes % 2 === 0) ? '2px solid red' : originalBorder;
            flashes++;
        }, 250);
    }


    // --- UI 界面创建与更新 ---
    function createUI() {
        console.log("开始创建 UI 元素...");

        buttonContainer = document.createElement('div');
        buttonContainer.id = 'exporter-button-container';
        buttonContainer.style.cssText = `position: fixed; bottom: 20%; left: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;`;
        document.body.appendChild(buttonContainer);

        captureButtonScroll = document.createElement('button');
        captureButtonScroll.textContent = buttonTextStartScroll;
        captureButtonScroll.id = 'capture-chat-scroll-button';
        captureButtonScroll.style.cssText = `padding: 10px 15px; background-color: #1a73e8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease;`;
        captureButtonScroll.addEventListener('click', handleScrollExtraction);
        buttonContainer.appendChild(captureButtonScroll);

        stopButtonScroll = document.createElement('button');
        stopButtonScroll.textContent = buttonTextStopScroll;
        stopButtonScroll.id = 'stop-scrolling-button';
        stopButtonScroll.style.cssText = `padding: 10px 15px; background-color: #d93025; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); display: none; transition: background-color 0.3s ease;`;
        stopButtonScroll.addEventListener('click', () => {
            if (isScrolling) {
                updateStatus('手动停止滚动信号已发送...');
                isScrolling = false;
                stopButtonScroll.disabled = true;
                stopButtonScroll.textContent = '正在停止...';
            }
        });
        buttonContainer.appendChild(stopButtonScroll);

        captureButtonCode = document.createElement('button');
        captureButtonCode.textContent = buttonTextStartCode;
        captureButtonCode.id = 'capture-chat-code-button';
        captureButtonCode.style.cssText = `padding: 10px 15px; background-color: #34a853; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease;`;
        captureButtonCode.addEventListener('click', handleCodeBlockExport);
        buttonContainer.appendChild(captureButtonCode);

        hideButton = document.createElement('button');
        hideButton.textContent = '👁️';
        hideButton.id = 'hide-exporter-buttons';
        hideButton.style.cssText = `position: fixed; bottom: calc(20% + 135px); left: 20px; z-index: 10000; padding: 5px 8px; background-color: rgba(0, 0, 0, 0.3); color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px;`;
        hideButton.addEventListener('click', () => {
            const isHidden = buttonContainer.style.display === 'none';
            buttonContainer.style.display = isHidden ? 'flex' : 'none';
            hideButton.textContent = isHidden ? '👁️' : '🙈';
        });
        document.body.appendChild(hideButton);


        statusDiv = document.createElement('div');
        statusDiv.id = 'extract-status-div';
        statusDiv.style.cssText = `position: fixed; bottom: 20%; left: 200px; z-index: 9998; padding: 5px 10px; background-color: rgba(0,0,0,0.7); color: white; font-size: 12px; border-radius: 3px; display: none;`;
        document.body.appendChild(statusDiv);

        GM_addStyle(`
              #capture-chat-scroll-button:disabled, #stop-scrolling-button:disabled, #capture-chat-code-button:disabled {
                  opacity: 0.6; cursor: not-allowed; background-color: #aaa !important;
              }
               #capture-chat-scroll-button.success { background-color: #1e8e3e !important; }
               #capture-chat-scroll-button.error { background-color: #d93025 !important; }
               #capture-chat-code-button.success { background-color: #188038 !important; }
               #capture-chat-code-button.error { background-color: #d93025 !important; }
        `);
        console.log("UI 元素创建完成。");
    }

    function updateStatus(message) {
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.display = message ? 'block' : 'none';
        }
        console.log(`[Status] ${message}`);
    }


    // --- 核心业务逻辑 (滚动导出) ---
    function extractDataIncremental_AiStudio() {
        let newlyFoundCount = 0;
        let dataUpdatedInExistingTurn = false;
        const currentTurns = document.querySelectorAll('ms-chat-turn');

        currentTurns.forEach((turn, index) => {
            const turnKey = turn;
            const turnContainer = turn.querySelector('.chat-turn-container.user, .chat-turn-container.model');
            if (!turnContainer) {
                return;
            }

            let isNewTurn = !collectedData.has(turnKey);
            let extractedInfo = collectedData.get(turnKey) || {
                domOrder: index, type: 'unknown', userText: null, thoughtText: null, responseText: null
            };
            if (isNewTurn) {
                collectedData.set(turnKey, extractedInfo);
                newlyFoundCount++;
            }

            let dataWasUpdatedThisTime = false;

            if (turnContainer.classList.contains('user')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'user';
                if (!extractedInfo.userText) {
                    let userNode = turn.querySelector('.turn-content ms-cmark-node');
                    let userText = userNode ? userNode.innerText.trim() : null;
                    if (userText) {
                        extractedInfo.userText = userText;
                        dataWasUpdatedThisTime = true;
                    }
                }
            } else if (turnContainer.classList.contains('model')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'model';

                if (!extractedInfo.thoughtText) {
                    let thoughtNode = turn.querySelector('.thought-container .mat-expansion-panel-body');
                    if (thoughtNode) {
                        let thoughtText = thoughtNode.textContent.trim();
                        if (thoughtText && thoughtText.toLowerCase() !== 'thinking process:') {
                            extractedInfo.thoughtText = thoughtText;
                            dataWasUpdatedThisTime = true;
                        }
                    }
                }

                if (!extractedInfo.responseText) {
                    const responseChunks = Array.from(turn.querySelectorAll('.turn-content > ms-prompt-chunk'));
                    const responseTexts = responseChunks
                    .filter(chunk => !chunk.querySelector('.thought-container'))
                    .map(chunk => {
                        const cmarkNode = chunk.querySelector('ms-cmark-node');
                        return cmarkNode ? cmarkNode.innerText.trim() : chunk.innerText.trim();
                    })
                    .filter(text => text);

                    if (responseTexts.length > 0) {
                        extractedInfo.responseText = responseTexts.join('\n\n');
                        dataWasUpdatedThisTime = true;
                    } else if (!extractedInfo.thoughtText) {
                        const turnContent = turn.querySelector('.turn-content');
                        if(turnContent) {
                            extractedInfo.responseText = turnContent.innerText.trim();
                            dataWasUpdatedThisTime = true;
                        }
                    }
                }

                if (dataWasUpdatedThisTime) {
                    if (extractedInfo.thoughtText && extractedInfo.responseText) extractedInfo.type = 'model_thought_reply';
                    else if (extractedInfo.responseText) extractedInfo.type = 'model_reply';
                    else if (extractedInfo.thoughtText) extractedInfo.type = 'model_thought';
                }
            }

            if (dataWasUpdatedThisTime) {
                collectedData.set(turnKey, extractedInfo);
                dataUpdatedInExistingTurn = true;
            }
        });

        if (currentTurns.length > 0 && collectedData.size === 0) {
            console.warn("警告(滚动导出): 页面上存在聊天回合 (ms-chat-turn)，但未能提取任何数据。CSS选择器可能已完全失效，请按F12检查并更新 extractDataIncremental_AiStudio 函数中的选择器。");
            updateStatus(`警告: 无法从聊天记录中提取数据，请检查脚本！`);
        } else {
            updateStatus(`滚动 ${scrollCount}/${MAX_SCROLL_ATTEMPTS}... 已收集 ${collectedData.size} 条记录...`);
        }

        return newlyFoundCount > 0 || dataUpdatedInExistingTurn;
    }

    async function autoScrollDown_AiStudio() {
        console.log("启动自动滚动 (滚动导出)...");
        isScrolling = true; collectedData.clear(); scrollCount = 0; noChangeCounter = 0;
        const scroller = getMainScrollerElement_AiStudio();
        if (!scroller) {
            updateStatus('错误 (滚动): 找不到滚动区域!');
            alert('未能找到聊天记录的滚动区域，无法自动滚动。请检查脚本中的选择器。');
            isScrolling = false; return false;
        }
        console.log('使用的滚动元素 (滚动导出):', scroller);
        const isWindowScroller = (scroller === document.documentElement || scroller === document.body);
        const getScrollTop = () => isWindowScroller ? window.scrollY : scroller.scrollTop;
        const getScrollHeight = () => isWindowScroller ? document.documentElement.scrollHeight : scroller.scrollHeight;
        const getClientHeight = () => isWindowScroller ? window.innerHeight : scroller.clientHeight;
        updateStatus(`开始增量滚动 (最多 ${MAX_SCROLL_ATTEMPTS} 次)...`);
        let lastScrollHeight = -1;

        while (scrollCount < MAX_SCROLL_ATTEMPTS && isScrolling) {
            const currentScrollTop = getScrollTop(); const currentScrollHeight = getScrollHeight(); const currentClientHeight = getClientHeight();
            if (currentScrollHeight === lastScrollHeight) { noChangeCounter++; } else { noChangeCounter = 0; }
            lastScrollHeight = currentScrollHeight;
            if (noChangeCounter >= SCROLL_STABILITY_CHECKS && currentScrollTop + currentClientHeight >= currentScrollHeight - 20) {
                console.log("滚动条疑似触底 (滚动导出)，停止滚动。");
                updateStatus(`滚动完成 (疑似触底)。`);
                break;
            }
            if (currentScrollTop === 0 && scrollCount > 10) {
                console.log("滚动条返回顶部 (滚动导出)，停止滚动。");
                updateStatus(`滚动完成 (返回顶部)。`);
                break;
            }
            const targetScrollTop = currentScrollTop + (currentClientHeight * SCROLL_INCREMENT_FACTOR);
            if (isWindowScroller) { window.scrollTo({ top: targetScrollTop, behavior: 'smooth' }); } else { scroller.scrollTo({ top: targetScrollTop, behavior: 'smooth' }); }
            scrollCount++;
            updateStatus(`滚动 ${scrollCount}/${MAX_SCROLL_ATTEMPTS}... 等待 ${SCROLL_DELAY_MS}ms... (已收集 ${collectedData.size} 条)`);
            await delay(SCROLL_DELAY_MS);
            extractDataIncremental_AiStudio();
            if (!isScrolling) { console.log("检测到手动停止信号 (滚动导出)，退出滚动循环。"); break; }
        }

        if (!isScrolling && scrollCount < MAX_SCROLL_ATTEMPTS) {
            updateStatus(`滚动已手动停止 (共 ${scrollCount} 次尝试)。`);
        } else if (scrollCount >= MAX_SCROLL_ATTEMPTS) {
            updateStatus(`滚动停止: 已达到最大尝试次数 (${MAX_SCROLL_ATTEMPTS})。`);
        }
        isScrolling = false;
        return true;
    }

    function formatAndTriggerDownloadScroll() {
        updateStatus(`处理 ${collectedData.size} 条滚动记录并生成文件...`);
        const finalTurnsInDom = document.querySelectorAll('ms-chat-turn');
        let sortedData = [];
        finalTurnsInDom.forEach(turnNode => {
            if (collectedData.has(turnNode)) {
                sortedData.push(collectedData.get(turnNode));
            }
        });

        if (sortedData.length === 0) {
            updateStatus('没有收集到任何有效滚动记录。');
            alert('滚动结束后未能收集到任何聊天记录，无法导出。请检查脚本中的CSS选择器是否与当前网站匹配。');
            captureButtonScroll.textContent = buttonTextStartScroll; captureButtonScroll.disabled = false;
            captureButtonScroll.classList.remove('success', 'error'); updateStatus('');
            return;
        }

        let fileContent = "Google AI Studio 聊天记录 (自动滚动捕获)\n=========================================\n\n";
        sortedData.forEach(item => {
            let turnContent = "";
            if (item.type === 'user' && item.userText) {
                turnContent += `--- 用户 ---\n${item.userText}\n\n`;
            } else if (item.type === 'model_thought_reply') {
                if(item.thoughtText) turnContent += `--- AI 思维链 ---\n${item.thoughtText}\n\n`;
                if(item.responseText) turnContent += `--- AI 回答 ---\n${item.responseText}\n\n`;
            } else if (item.type === 'model_thought' && item.thoughtText) {
                turnContent += `--- AI 思维链 ---\n${item.thoughtText}\n\n`;
            } else if (item.type === 'model_reply' && item.responseText) {
                turnContent += `--- AI 回答 ---\n${item.responseText}\n\n`;
            } else {
                turnContent += `--- 回合 (内容提取不完整或失败) ---\n`;
                if(item.thoughtText) turnContent += `思维链(可能不全): ${item.thoughtText}\n`;
                if(item.responseText) turnContent += `回答(可能不全): ${item.responseText}\n`;
                turnContent += '\n';
            }
            if (turnContent) {
                fileContent += turnContent.trim() + "\n\n------------------------------\n\n";
            }
        });
        fileContent = fileContent.replace(/\n\n------------------------------\n\n$/, '\n').trim();

        try {
            const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `${EXPORT_FILENAME_PREFIX_SCROLL}${getCurrentTimestamp()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            captureButtonScroll.textContent = successTextScroll;
            captureButtonScroll.classList.add('success');
        } catch (e) {
            console.error("滚动导出文件失败:", e);
            captureButtonScroll.textContent = `${errorTextScroll}: 创建失败`;
            captureButtonScroll.classList.add('error');
            alert("创建滚动下载文件时出错: " + e.message);
        }

        setTimeout(() => {
            captureButtonScroll.textContent = buttonTextStartScroll;
            captureButtonScroll.disabled = false;
            captureButtonScroll.classList.remove('success', 'error');
            updateStatus('');
        }, exportTimeout);
    }

    async function handleScrollExtraction() {
        if (isScrolling) return;
        captureButtonScroll.disabled = true;
        captureButtonScroll.textContent = '滚动中...';
        stopButtonScroll.style.display = 'block';
        stopButtonScroll.disabled = false;
        stopButtonScroll.textContent = buttonTextStopScroll;

        // 【修改】在开始前先滚动到页面顶部
        const scroller = getMainScrollerElement_AiStudio();
        if (scroller) {
            updateStatus('正在滚动到顶部...');
            const isWindowScroller = (scroller === document.documentElement || scroller === document.body);
            if (isWindowScroller) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                scroller.scrollTo({ top: 0, behavior: 'smooth' });
            }
            await delay(1500); // 等待滚动动画完成
        }

        updateStatus('初始化滚动 (滚动导出)...');

        try {
            const scrollSuccess = await autoScrollDown_AiStudio();
            if (scrollSuccess !== false) {
                captureButtonScroll.textContent = buttonTextProcessingScroll;
                updateStatus('滚动结束，准备最终处理...');
                await delay(500);
                extractDataIncremental_AiStudio();
                await delay(200);
                formatAndTriggerDownloadScroll();
            } else {
                captureButtonScroll.textContent = `${errorTextScroll}: 滚动失败`;
                captureButtonScroll.classList.add('error');
                setTimeout(() => {
                    captureButtonScroll.textContent = buttonTextStartScroll;
                    captureButtonScroll.disabled = false;
                    captureButtonScroll.classList.remove('error');
                    updateStatus('');
                }, exportTimeout);
            }
        } catch (error) {
            console.error('滚动处理过程中发生错误:', error);
            updateStatus(`错误 (滚动导出): ${error.message}`);
            alert(`滚动处理过程中发生错误: ${error.message}`);
            captureButtonScroll.textContent = `${errorTextScroll}: 处理出错`;
            captureButtonScroll.classList.add('error');
            setTimeout(() => {
                captureButtonScroll.textContent = buttonTextStartScroll;
                captureButtonScroll.disabled = false;
                captureButtonScroll.classList.remove('error');
                updateStatus('');
            }, exportTimeout);
            isScrolling = false;
        } finally {
            stopButtonScroll.style.display = 'none';
            isScrolling = false;
        }
    }


    // --- 核心业务逻辑 (SDK代码导出) ---
    function extractConversationFromCodeBlock(codeText) {
        console.log("--- 开始从SDK代码中提取对话 (行状态机) ---");
        const conversation = [];
        const lines = codeText.split('\n');
        let state = '寻找 contents';
        let current_content_block = null;
        let current_part_lines = [];
        const roleExtractRegex = /role\s*=\s*["'](user|model)["']/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            switch (state) {
                case '寻找 contents':
                    if (trimmedLine.includes('contents = [')) {
                        state = '寻找 Content';
                    }
                    break;
                case '寻找 Content':
                    if (trimmedLine.startsWith('types.Content(')) {
                        if (current_content_block) {
                            processCollectedContent(current_content_block, conversation);
                        }
                        current_content_block = null;
                        state = '寻找 Role';
                    } else if (trimmedLine === ']') {
                        if (current_content_block) {
                            processCollectedContent(current_content_block, conversation);
                        }
                        state = '结束';
                    }
                    break;
                case '寻找 Role':
                    let role = 'unknown';
                    const roleMatch = roleExtractRegex.exec(line);
                    if (roleMatch && roleMatch[1]) {
                        role = roleMatch[1];
                    }
                    current_content_block = { role: role, parts: [] };
                    state = '寻找 Part 开始';
                    // Fallthrough to check the same line for a Part
                case '寻找 Part 开始':
                    if (!current_content_block) break;
                    const partStartIndex = line.indexOf('types.Part.from_text');
                    if (partStartIndex !== -1) {
                        state = '读取 Part 文本';
                        current_part_lines = [];
                        const tripleQuoteIndex = line.indexOf('"""');
                        if (tripleQuoteIndex > -1) {
                            const textAfterTripleQuote = line.substring(tripleQuoteIndex + 3);
                            const endTripleQuoteIndexSameLine = textAfterTripleQuote.indexOf('"""');
                            if (endTripleQuoteIndexSameLine !== -1) {
                                const singleLineText = textAfterTripleQuote.substring(0, endTripleQuoteIndexSameLine);
                                current_content_block.parts.push(singleLineText.trim());
                                state = '寻找 Part 开始';
                            } else {
                                current_part_lines.push(textAfterTripleQuote);
                            }
                        }
                    } else if (trimmedLine.startsWith('],') || trimmedLine === '],') {
                        state = '寻找 Content';
                    } else if (trimmedLine === ']') {
                        if (current_content_block) {
                            processCollectedContent(current_content_block, conversation);
                        }
                        state = '结束';
                    }
                    break;
                case '读取 Part 文本':
                    const endTripleQuoteIndex = line.indexOf('"""');
                    if (endTripleQuoteIndex !== -1) {
                        const textBeforeEnd = line.substring(0, endTripleQuoteIndex);
                        current_part_lines.push(textBeforeEnd);
                        const fullPartText = current_part_lines.join('\n').trim();
                        if (current_content_block) {
                            current_content_block.parts.push(fullPartText);
                        }
                        current_part_lines = [];
                        state = '寻找 Part 开始';
                    } else {
                        current_part_lines.push(line);
                    }
                    break;
            }
            if (state === '结束') break;
        }

        if (state !== '结束' && current_content_block) {
            processCollectedContent(current_content_block, conversation);
        }
        if (conversation.length === 0) {
            console.warn("SDK代码提取完成: 未能提取到任何有效的对话部分。");
        }
        return conversation;
    }

    function processCollectedContent(contentBlock, conversation) {
        if (!contentBlock || !contentBlock.parts || contentBlock.parts.length === 0) {
            return;
        }
        if (contentBlock.role === 'user') {
            conversation.push({ type: 'user', text: contentBlock.parts[0] || "" });
        } else if (contentBlock.role === 'model') {
            const numParts = contentBlock.parts.length;
            if (numParts === 1) {
                conversation.push({ type: 'response', text: contentBlock.parts[0] });
            } else if (numParts > 1) {
                const thoughtParts = contentBlock.parts.slice(0, numParts - 1);
                const thoughtText = thoughtParts.join('\n\n---\n\n');
                conversation.push({ type: 'thought', text: thoughtText });
                const responsePart = contentBlock.parts[numParts - 1];
                conversation.push({ type: 'response', text: responsePart });
            }
        } else {
            contentBlock.parts.forEach((partText) => {
                conversation.push({ type: 'unknown_part', text: partText });
            });
        }
    }


    function formatAndDownloadCodeChat(conversationData) {
        updateStatus(buttonTextProcessingCode);
        if (!conversationData || conversationData.length === 0) {
            updateStatus('错误 (SDK代码): 未提取到有效对话内容。');
            alert('未能从SDK代码中提取到任何有效的对话内容，无法导出。');
            captureButtonCode.textContent = buttonTextStartCode;
            captureButtonCode.disabled = false;
            updateStatus('');
            return;
        }

        let fileContent = "对话记录 (提取自 Python SDK 代码)\n=========================================\n\n";
        conversationData.forEach(item => {
            switch (item.type) {
                case 'user':
                    fileContent += `--- 用户输出 ---\n${item.text}\n\n`;
                    break;
                case 'thought':
                    fileContent += `--- AI 思维链 ---\n${item.text}\n\n`;
                    break;
                case 'response':
                    fileContent += `--- AI 输出 ---\n${item.text}\n\n`;
                    break;
                default:
                    fileContent += `--- 未知部分 (${item.type}) ---\n${item.text}\n\n`;
            }
            fileContent += "-----------------------------------------\n\n";
        });
        fileContent = fileContent.replace(/\n\n-----------------------------------------\n\n$/, '\n').trim();

        try {
            const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `${EXPORT_FILENAME_PREFIX_CODE}${getCurrentTimestamp()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            captureButtonCode.textContent = successTextCode;
            captureButtonCode.classList.add('success');
        } catch (e) {
            console.error("SDK代码导出文件失败:", e);
            captureButtonCode.textContent = `${errorTextCode}: 创建失败`;
            captureButtonCode.classList.add('error');
            alert("创建SDK代码下载文件时出错: " + e.message);
        }

        setTimeout(() => {
            captureButtonCode.textContent = buttonTextStartCode;
            captureButtonCode.disabled = false;
            captureButtonCode.classList.remove('success', 'error');
            updateStatus('');
        }, exportTimeout);
    }

    function handleCodeBlockExport() {
        console.log("“从SDK代码导出对话”按钮被点击。");
        updateStatus('正在查找SDK代码块...');
        captureButtonCode.disabled = true;
        captureButtonCode.textContent = '查找SDK代码...';

        setTimeout(() => {
            const codeElement = findCodeBlockElement();
            if (!codeElement) {
                // 【修改】当找不到代码块时，闪烁按钮并给出更友好的提示
                flashGetCodeButton();
                alert(`导出失败：未找到SDK代码块。\n\n请先点击页面上闪烁的 "Get code" 按钮，等待代码出现后，再点击“从SDK导出对话TXT”按钮。`);

                updateStatus(`错误: 未找到SDK代码块`);
                captureButtonCode.textContent = errorTextCode;
                captureButtonCode.classList.add('error');
                setTimeout(() => {
                    captureButtonCode.textContent = buttonTextStartCode;
                    captureButtonCode.disabled = false;
                    captureButtonCode.classList.remove('error');
                    updateStatus('');
                }, exportTimeout);
                return;
            }

            const codeText = codeElement.textContent;
            if (!codeText || codeText.trim().length === 0) {
                updateStatus('错误: SDK代码块为空。');
                alert('找到的SDK代码块元素内容为空，无法提取对话。');
                captureButtonCode.textContent = errorTextCode;
                captureButtonCode.classList.add('error');
                setTimeout(() => {
                    captureButtonCode.textContent = buttonTextStartCode;
                    captureButtonCode.disabled = false;
                    captureButtonCode.classList.remove('error');
                    updateStatus('');
                }, exportTimeout);
                return;
            }
            updateStatus('正在从SDK代码中提取对话...');
            captureButtonCode.textContent = '提取中...';
            setTimeout(() => {
                try {
                    const conversationData = extractConversationFromCodeBlock(codeText);
                    formatAndDownloadCodeChat(conversationData);
                } catch (error) {
                    console.error('SDK代码导出处理过程中发生错误:', error);
                    updateStatus(`错误 (SDK代码导出): ${error.message}`);
                    alert(`SDK代码导出处理过程中发生错误: ${error.message}`);
                    captureButtonCode.textContent = `${errorTextCode}: 处理出错`;
                    captureButtonCode.classList.add('error');
                    setTimeout(() => {
                        captureButtonCode.textContent = buttonTextStartCode;
                        captureButtonCode.disabled = false;
                        captureButtonCode.classList.remove('error');
                        updateStatus('');
                    }, exportTimeout);
                }
            }, 50);

        }, 50);
    }


    // --- 脚本初始化入口 ---
    console.log("Google AI Studio 导出脚本 (v1.4): 等待页面加载 (2.5秒)...");
    setTimeout(createUI, 2500);

})();