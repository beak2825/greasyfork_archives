// ==UserScript==
// @name         可上线-TikTok 全能对话助手 (v22.1 修正配置版)
// @namespace    http://tampermonkey.net/
// @version      22.1
// @description  修正脚本不运行的bug。新增菜单配置项，可按需显示泰国(泰/缅)或德国的翻译按钮。
// @author       Gemini & You & Jiang Yanhao
// @match        https://affiliate.tiktok.com/seller/im*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      gemini-tiktok-translate.1170731839.workers.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543901/%E5%8F%AF%E4%B8%8A%E7%BA%BF-TikTok%20%E5%85%A8%E8%83%BD%E5%AF%B9%E8%AF%9D%E5%8A%A9%E6%89%8B%20%28v221%20%E4%BF%AE%E6%AD%A3%E9%85%8D%E7%BD%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543901/%E5%8F%AF%E4%B8%8A%E7%BA%BF-TikTok%20%E5%85%A8%E8%83%BD%E5%AF%B9%E8%AF%9D%E5%8A%A9%E6%89%8B%20%28v221%20%E4%BF%AE%E6%AD%A3%E9%85%8D%E7%BD%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("TikTok 全能对话助手 (v22.1): 脚本开始执行...");

    // --- 1. 配置中心 ---
    // 从存储中读取配置，如果不存在则默认为 true (开启)
    let isThailandEnabled = GM_getValue('isThailandEnabled', true);
    let isGermanyEnabled = GM_getValue('isGermanyEnabled', true);

    // 定义创建设置面板的函数
    function showSettingsPanel() {
        if (document.getElementById('gemini-settings-panel')) return; // 防止重复创建

        const panel = document.createElement('div');
        panel.id = 'gemini-settings-panel';
        panel.innerHTML = `
            <div class="gemini-settings-content">
                <h2>对话助手按钮设置</h2>
                <p>选择需要显示的翻译按钮组：</p>
                <div class="gemini-settings-option">
                    <input type="checkbox" id="gemini-th-setting" ${isThailandEnabled ? 'checked' : ''}>
                    <label for="gemini-th-setting">泰国 (显示泰语和缅甸语按钮)</label>
                </div>
                <div class="gemini-settings-option">
                    <input type="checkbox" id="gemini-de-setting" ${isGermanyEnabled ? 'checked' : ''}>
                    <label for="gemini-de-setting">德国 (显示德语按钮)</label>
                </div>
                <div class="gemini-settings-buttons">
                    <button id="gemini-save-settings">保存并刷新</button>
                    <button id="gemini-close-settings">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('gemini-save-settings').addEventListener('click', () => {
            isThailandEnabled = document.getElementById('gemini-th-setting').checked;
            isGermanyEnabled = document.getElementById('gemini-de-setting').checked;

            GM_setValue('isThailandEnabled', isThailandEnabled);
            GM_setValue('isGermanyEnabled', isGermanyEnabled);

            alert('设置已保存，页面将自动刷新！');
            location.reload();
        });

        document.getElementById('gemini-close-settings').addEventListener('click', () => {
            panel.remove();
        });
    }

    // 注册菜单命令，将其添加到油猴菜单
    GM_registerMenuCommand('设置翻译按钮 (Settings)', showSettingsPanel);
    console.log("TikTok 全能对话助手 (v22.1): 设置菜单已注册。");

    // --- 2. 样式中心 ---
    GM_addStyle(`
        #gemini-settings-panel { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .gemini-settings-content { background: white; padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); color: #333; }
        .gemini-settings-content h2 { margin-top: 0; }
        .gemini-settings-option { margin: 15px 0; font-size: 16px; display: flex; align-items: center; }
        .gemini-settings-option input { margin-right: 10px; width: 16px; height: 16px; }
        .gemini-settings-buttons { margin-top: 20px; text-align: right; }
        .gemini-settings-buttons button { padding: 8px 16px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; margin-left: 10px; }
        #gemini-save-settings { background-color: #007bff; color: white; border-color: #007bff; }
        .gemini-translate-btn { padding: 0 12px; height: 32px; margin-left: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; white-space: nowrap; flex-shrink: 0; transition: background-color 0.2s; }
        .gemini-translate-btn:hover { background-color: #0056b3; }
        .gemini-translate-btn:disabled { background-color: #cccccc; cursor: not-allowed; }
        .chatd-bubble-main { position: relative; }
        .translate-btn-container { position: absolute; top: 2px; right: 2px; }
        .chatd-bubble-main--self .translate-btn-container { top: auto; right: auto; bottom: 4px; left: 4px; }
        .translate-icon-btn { background-color: rgba(173, 216, 230, 0.15); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; transition: background-color 0.2s; }
        .translate-icon-btn:hover { background-color: rgba(173, 216, 230, 1); }
        .translate-icon-btn.loading { cursor: not-allowed; }
        .translation-container { margin-top: 10px; padding-top: 10px; font-style: normal; font-size: 0.9em; line-height: 1.4; }
        .chatd-bubble-main--other .translation-container { color: #D92B2B; border-top: 1px solid rgba(0, 0, 0, 0.12); }
        .chatd-bubble-main--self .translation-container { color: blue; border-top: 1px solid blue; }
        .translation-loader { border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; width: 12px; height: 12px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `);

    // --- 3. 工具与核心函数 ---
    const TRANSLATE_API_URL = 'https://gemini-tiktok-translate.1170731839.workers.dev';
    let discoveredReactPropsKey = null;
    let currentMessageObserver = null;

    function findReactKey(element, prefix) {
        if (!element) return null;
        for (const key in element) {
            if (key.startsWith(prefix)) return key;
        }
        return null;
    }

    function translateText(text, langName) {
        return new Promise((resolve, reject) => {
            const prompt = `请将以下文本翻译成${langName}，只需要直接返回翻译后的纯文本结果，不要包含任何额外的解释或标签。原文如下：\n\n"${text}"`;
            GM_xmlhttpRequest({
                method: "POST",
                url: TRANSLATE_API_URL,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ prompt }),
                onload: (response) => {
                    if (response.status === 200 && response.responseText) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.response) {
                                resolve(result.response.trim());
                            } else {
                                reject('API未返回有效的response内容。');
                            }
                        } catch (e) {
                            reject('解析API响应失败。');
                        }
                    } else {
                        reject(`翻译API返回错误，状态码: ${response.status}`);
                    }
                },
                onerror: () => reject('翻译API请求失败。')
            });
        });
    }

    function executeSend(textToSend) {
        return new Promise((resolve, reject) => {
            if (!discoveredReactPropsKey) return reject("React Props钥匙未找到。");
            const inputBox = document.querySelector('textarea[data-e2e="798845f5-2eb9-0980"]');
            const sendButton = document.querySelector('button[data-e2e="55f52c38-fed6-9128"]');
            if (!inputBox || !sendButton) return reject("找不到输入框或发送按钮。");
            const reactFiberKey = findReactKey(inputBox, '__reactFiber$');
            if (!reactFiberKey) return reject("找不到输入框的React实例。");
            const reactInstance = inputBox[reactFiberKey];
            const onChange = reactInstance.memoizedProps.onChange;
            if (typeof onChange !== 'function') return reject("输入框无onChange函数。");
            onChange({ target: { value: textToSend } });
            setTimeout(() => {
                const buttonReactProps = sendButton[discoveredReactPropsKey];
                if (buttonReactProps && typeof buttonReactProps.onClick === 'function') {
                    buttonReactProps.onClick();
                    resolve();
                } else {
                    reject("发送按钮无onClick Prop");
                }
            }, 500);
        });
    }

    // --- 4. 模块 B: 手动翻译发送 (已重构以支持配置) ---
    function initializeTranslateAndSendButtons() {
        if (!discoveredReactPropsKey) return;
        const sendButton = document.querySelector('button[data-e2e="55f52c38-fed6-9128"]');
        if (!sendButton) return;

        const buttonContainer = sendButton.parentElement;
        if (!buttonContainer || buttonContainer.dataset.geminiButtonsConfigured) return;

        const buttonConfigs = [
            { id: 'th', name: '泰语', text: '发送泰语翻译', group: 'thailand' },
            { id: 'my', name: '缅甸语', text: '发送缅甸语翻译', group: 'thailand' },
            { id: 'de', name: '德语', text: '发送德语翻译', group: 'germany' }
        ];

        const visibleConfigs = buttonConfigs.filter(config =>
            (config.group === 'thailand' && isThailandEnabled) ||
            (config.group === 'germany' && isGermanyEnabled)
        );

        if (visibleConfigs.length === 0) {
             buttonContainer.dataset.geminiButtonsConfigured = 'true';
             return;
        }

        const createdButtons = [];

        const handleTranslateClick = async (langName, btn) => {
            const inputBox = document.querySelector('textarea[data-e2e="798845f5-2eb9-0980"]');
            const originalText = inputBox ? inputBox.value.trim() : '';
            if (!originalText) {
                alert('请输入需要翻译的内容！');
                return;
            }
            createdButtons.forEach(b => { b.element.disabled = true; });
            btn.textContent = '翻译中...';
            try {
                const translatedText = await translateText(originalText, langName);
                await executeSend(translatedText);
            } catch (error) {
                console.error("翻译并发送失败:", error);
                alert(`操作失败: ${error}`);
            } finally {
                createdButtons.forEach(b => {
                    b.element.disabled = false;
                    b.element.textContent = b.originalText;
                });
            }
        };

        visibleConfigs.forEach(config => {
            const button = document.createElement('button');
            button.id = `gemini-translate-${config.id}-btn`;
            button.className = 'gemini-translate-btn';
            button.textContent = config.text;
            button.addEventListener('click', () => handleTranslateClick(config.name, button));
            buttonContainer.appendChild(button);
            createdButtons.push({ element: button, originalText: config.text });
        });

        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.dataset.geminiButtonsConfigured = 'true';
    }


    // --- 5. 模块 A: 消息内嵌翻译 (功能不变) ---
    async function triggerInPlaceTranslation(textElement, button) {
        if (!textElement || !button) return;
        button.disabled = true;
        button.classList.add('loading');
        button.innerHTML = '<div class="translation-loader"></div>';
        const bubbleMain = textElement.closest('.chatd-bubble-main');
        if (bubbleMain) {
            bubbleMain.querySelector('.translation-container')?.remove();
        }
        const originalText = textElement.innerText.trim();
        try {
            const translatedText = await translateText(originalText, "中文");
            const translationDiv = document.createElement('div');
            translationDiv.className = 'translation-container';
            translationDiv.textContent = translatedText;
            if (bubbleMain) {
                bubbleMain.appendChild(translationDiv);
            }
        } catch (error) {
            console.error("内嵌翻译失败:", error);
        } finally {
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = 'G';
        }
    }

    function addTranslateButtonToNode(messageNode) {
        if (!messageNode || messageNode.dataset?.translationButtonAdded) return;
        messageNode.dataset.translationButtonAdded = 'true';
        const textElement = messageNode.querySelector('pre.content-whPFtV');
        if (!textElement || !textElement.innerText.trim() || !isNaN(textElement.innerText.trim()) || !/[a-zA-Z\u0E00-\u0E7F\u1000-\u109F]/.test(textElement.innerText.trim())) return;
        const bubbleMain = textElement.closest('.chatd-bubble-main');
        if (!bubbleMain) return;
        const btnContainer = document.createElement('div');
        btnContainer.className = 'translate-btn-container';
        const button = document.createElement('button');
        button.className = 'translate-icon-btn';
        button.innerHTML = 'G';
        button.title = '翻译此条消息';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerInPlaceTranslation(textElement, button);
        });
        btnContainer.appendChild(button);
        bubbleMain.appendChild(btnContainer);
    }

    // --- 6. 启动与监控 (功能不变) ---
    function autoTranslateLatestIfNeeded(container) {
        const allMessages = container.querySelectorAll('.chatd-message');
        if (allMessages.length === 0) return;
        const lastMessage = allMessages[allMessages.length - 1];
        if (lastMessage.matches('.chatd-message--left') && !lastMessage.dataset.autoTranslated) {
            lastMessage.dataset.autoTranslated = 'true';
            const textEl = lastMessage.querySelector('pre.content-whPFtV');
            const btnEl = lastMessage.querySelector('.translate-icon-btn');
            if (textEl && btnEl) {
                console.log("智能翻译：检测到最后一条是达人消息，执行自动翻译...");
                triggerInPlaceTranslation(textEl, btnEl);
            }
        }
    }

    function startMessageObserver(chatContentNode) {
        if (currentMessageObserver) {
            currentMessageObserver.disconnect();
        }
        console.log("全能助手：消息内嵌翻译模块已激活。");
        chatContentNode.querySelectorAll('.chatd-message').forEach(addTranslateButtonToNode);
        autoTranslateLatestIfNeeded(chatContentNode);
        const observer = new MutationObserver((mutationsList) => {
            let hasNewMessages = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const messages = node.matches('.chatd-message') ? [node] : node.querySelectorAll('.chatd-message');
                            if (messages.length > 0) {
                                hasNewMessages = true;
                                messages.forEach(addTranslateButtonToNode);
                            }
                        }
                    });
                }
            }
            if (hasNewMessages) {
                autoTranslateLatestIfNeeded(chatContentNode);
            }
        });
        observer.observe(chatContentNode, { childList: true, subtree: true });
        currentMessageObserver = observer;
    }

    function startMainAppObserver() {
        const appContainer = document.body;
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            let chatContent = node.matches('.chatd-scrollView-content') ? node : node.querySelector('.chatd-scrollView-content');
                            if (chatContent) {
                                startMessageObserver(chatContent);
                                return;
                            }
                        }
                    }
                }
            }
        });
        console.log("全能助手：主监控已启动，正在监控对话切换...");
        observer.observe(appContainer, { childList: true, subtree: true });
        const initialChatContent = document.querySelector('.chatd-scrollView-content');
        if (initialChatContent) {
            startMessageObserver(initialChatContent);
        }
    }

    // 主程序入口
    console.log("TikTok 全能对话助手 (v22.1): 准备启动主程序...");
    setTimeout(() => {
        const keyFinderInterval = setInterval(() => {
            const sampleElement = document.querySelector('.contactCard-wsHws4, textarea[data-e2e="798845f5-2eb9-0980"]');
            if (sampleElement) {
                discoveredReactPropsKey = findReactKey(sampleElement, '__reactProps$');
                if (discoveredReactPropsKey) {
                    console.log(`%c成功找到React Props钥匙: ${discoveredReactPropsKey}`, "color: green; font-weight: bold;");
                    clearInterval(keyFinderInterval);
                    startMainAppObserver();
                    setInterval(initializeTranslateAndSendButtons, 1000); // 轮询以确保UI加载后能添加按钮
                }
            }
        }, 1000);
    }, 2000);

})();