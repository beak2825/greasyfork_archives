// ==UserScript==
// @name         微信公众号文章朗读助手
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  修复了按钮不加载的问题，并优化文本分段逻辑，解决了朗读卡顿、不连贯的问题。
// @author       Gemini & User
// @match        https://mp.weixin.qq.com/*
// @license      MPL-2.0 License
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQyYjM2YSIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zIDl2Nmg0bDUgNVY0TDcgOWg0em0xMy41IDNjMC0xLjc3LTEuMDItMy4yOS0yLjUtNC4wM3Y4LjA1YzEuNDgtLjczIDIuNS0yLjI1IDIuNS00LjAyek0xNCAzLjk4djIuMDZjMi44OS44NiA1IDEuNzEgNSA1Ljk2czEuMjggMy40NSA0IDQuM3YtMi4xYzAtMy44Ny0yLjQzLTYuNjYtNS03Ljl6Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/538875/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E6%9C%97%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538875/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E6%9C%97%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[朗读助手 v3.1] 脚本启动');

    // --- 配置项 ---
    const TARGET_VOICE_NAME = "Microsoft Yunxi Online (Natural) - Chinese (Mainland)"; // 优先选择更自然的云端语音
    const CHUNK_MAX_LENGTH = 180; // 设置每个朗读片段的最大长度，平衡流畅性与稳定性
    const PLAY_ICON_SVG = `<svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: middle; fill: currentColor;"><path d="M192 128l640 384-640 384z"></path></svg>`;
    const PAUSE_ICON_SVG = `<svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: middle; fill: currentColor;"><path d="M320 128h128v768H320zM576 128h128v768H576z"></path></svg>`;
    const BUTTON_TEXT_PLAY = "朗读";
    const BUTTON_TEXT_PAUSE = "暂停";
    const BUTTON_TEXT_RESUME = "继续";

    let speechState = 'idle'; // 'idle', 'playing', 'paused'
    let speechAPI = window.speechSynthesis;
    let targetVoice = null;
    let speechUtteranceChunks = [];
    let currentChunkIndex = 0;

    /**
     * 使用轮询来等待目标元素出现
     */
    function waitForElement(selector, callback) {
        let interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`[朗读助手 v3.1] 成功找到目标元素: ${selector}`);
                clearInterval(interval);
                callback(element);
            }
        }, 250); // 每250毫秒检查一次

        // 15秒后如果还没找到，就超时放弃
        setTimeout(() => {
            if (interval) {
                clearInterval(interval);
                console.warn(`[朗读助手 v3.1] 超时：未找到元素 ${selector}`);
            }
        }, 15000);
    }

    /**
     * 主初始化函数
     */
    function initializeReader(targetContainer) {
        if (document.getElementById('custom-read-aloud-button')) {
            console.log('[朗读助手 v3.1] 按钮已存在，跳过初始化。');
            return;
        }
        console.log('[朗读助手 v3.1] 开始初始化朗读模块...');

        if (!('speechSynthesis' in window)) {
            console.error("[朗读助手 v3.1] 浏览器不支持 Web Speech API。");
            return;
        }

        // 页面加载时可能语音列表未准备好，需要等待
        populateVoiceList().then(() => {
            if (speechAPI.onvoiceschanged !== undefined) {
                speechAPI.onvoiceschanged = () => populateVoiceList();
            }
            createReadAloudButton(targetContainer);
        });
    }

    function populateVoiceList() {
        return new Promise((resolve) => {
            let voices = speechAPI.getVoices();
            if (voices.length !== 0) {
                targetVoice = voices.find(voice => voice.name === TARGET_VOICE_NAME) || voices.find(voice => /zh|chinese/i.test(voice.lang) && /natural/i.test(voice.name)) || voices.find(voice => /zh|chinese/i.test(voice.lang));
                if (targetVoice) {
                    console.log(`[朗读助手 v3.1] 已选择语音: ${targetVoice.name}`);
                } else {
                    console.warn('[朗读助手 v3.1] 未找到理想的中文语音。');
                }
                resolve();
            } else {
                speechAPI.onvoiceschanged = () => {
                    voices = speechAPI.getVoices();
                    targetVoice = voices.find(voice => voice.name === TARGET_VOICE_NAME) || voices.find(voice => /zh|chinese/i.test(voice.lang) && /natural/i.test(voice.name)) || voices.find(voice => /zh|chinese/i.test(voice.lang));
                    if (targetVoice) {
                         console.log(`[朗读助手 v3.1] 已选择语音 (onvoiceschanged): ${targetVoice.name}`);
                    } else {
                        console.warn('[朗读助手 v3.1] 未找到理想的中文语音。');
                    }
                    resolve();
                };
            }
        });
    }

    function createReadAloudButton(container) {
        const readButton = document.createElement('span');
        readButton.id = 'custom-read-aloud-button';

        GM_addStyle(`
            #custom-read-aloud-button {
                display: inline-flex; align-items: center; gap: 4px;
                margin-left: 16px; padding: 2px 8px; border-radius: 12px;
                background-color: #f0f0f0; color: #555; cursor: pointer;
                font-size: 14px; transition: all 0.2s ease-in-out; user-select: none;
            }
            #custom-read-aloud-button:hover { background-color: #e0e0e0; transform: scale(1.05); }
            #custom-read-aloud-button.speaking { background-color: #d4edda; color: #155724; }
            #custom-read-aloud-button.paused { background-color: #fff3cd; color: #856404; }
        `);

        readButton.addEventListener('click', mainControl);
        // 【修复】恢复到原版可靠的按钮注入方式
        container.insertAdjacentElement('afterend', readButton);
        console.log('[朗读助手 v3.1] 按钮DOM已注入。');
        updateButtonState(speechState);
    }

    function mainControl() {
        switch (speechState) {
            case 'idle':
                startReading();
                break;
            case 'playing':
                pauseReading();
                break;
            case 'paused':
                resumeReading();
                break;
        }
    }

    /**
     * 【核心优化】将文本分割成更长、更连贯的片段
     */
    function splitTextIntoChunks(text, maxLength) {
        const sentences = text.split(/([。！？?!\n])/); // 按句末标点分割，并保留标点
        const chunks = [];
        let currentChunk = '';

        for (let i = 0; i < sentences.length; i += 2) {
            const sentence = sentences[i];
            const punctuation = sentences[i + 1] || '';
            const combined = sentence + punctuation;

            if (currentChunk.length + combined.length > maxLength && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            currentChunk += combined;
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
        }

        console.log(`[朗读助手 v3.1] 文本被分割成 ${chunks.length} 个片段。`);
        return chunks.filter(c => c); // 过滤空片段
    }


    function startReading() {
        const contentElement = document.getElementById('js_content');
        if (!contentElement || !contentElement.innerText.trim()) {
            alert("文章内容为空或无法找到。");
            return;
        }

        // 停止任何正在进行的朗读
        speechAPI.cancel();

        const textToRead = contentElement.innerText;
        // 【核心优化】使用新的文本分割函数
        const chunks = splitTextIntoChunks(textToRead, CHUNK_MAX_LENGTH);

        if (chunks.length === 0) {
            console.warn("[朗读助手 v3.1] 未能从文本中提取任何有效朗读片段。");
            return;
        }

        speechUtteranceChunks = chunks.map(chunk => {
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.voice = targetVoice;
            utterance.lang = targetVoice ? targetVoice.lang : 'zh-CN';
            utterance.rate = 1.0; // 语速，可根据喜好调整
            return utterance;
        });

        currentChunkIndex = 0;
        speechState = 'playing';
        updateButtonState(speechState);
        playNextChunk();
    }

    function pauseReading() {
        speechAPI.pause();
        speechState = 'paused';
        updateButtonState(speechState);
    }

    function resumeReading() {
        speechAPI.resume();
        speechState = 'playing';
        updateButtonState(speechState);
    }

    function stopReading() {
        speechAPI.cancel();
        speechState = 'idle';
        currentChunkIndex = 0;
        speechUtteranceChunks = [];
        updateButtonState(speechState);
    }

    function playNextChunk() {
        if (currentChunkIndex >= speechUtteranceChunks.length) {
            console.log("[朗读助手 v3.1] 朗读完成。");
            stopReading();
            return;
        }

        // 当状态不是播放时（例如用户点击了暂停），则不继续下一段
        if (speechState !== 'playing') {
            return;
        }

        const utterance = speechUtteranceChunks[currentChunkIndex];

        utterance.onend = () => {
            // 确保是在播放状态下自然结束才进入下一段
            if (speechState === 'playing') {
                currentChunkIndex++;
                playNextChunk();
            }
        };

        utterance.onerror = (event) => {
            console.error('[朗读助手 v3.1] 朗读错误:', event.error);
            // 发生错误时停止，而不是继续尝试
            stopReading();
        };

        speechAPI.speak(utterance);
    }

    function updateButtonState(state) {
        const button = document.getElementById('custom-read-aloud-button');
        if (!button) {
            console.warn('[朗读助手 v3.1] 更新状态时未找到按钮。');
            return;
        }

        console.log(`[朗读助手 v3.1] 更新按钮状态为: ${state}`);
        button.classList.remove('speaking', 'paused');

        switch (state) {
            case 'playing':
                button.innerHTML = `${PAUSE_ICON_SVG} <span class="button-text">${BUTTON_TEXT_PAUSE}</span>`;
                button.classList.add('speaking');
                break;
            case 'paused':
                button.innerHTML = `${PLAY_ICON_SVG} <span class="button-text">${BUTTON_TEXT_RESUME}</span>`;
                button.classList.add('paused');
                break;
            case 'idle':
            default:
                button.innerHTML = `${PLAY_ICON_SVG} <span class="button-text">${BUTTON_TEXT_PLAY}</span>`;
                break;
        }
    }

    // --- 脚本执行入口 ---
    // 【修复】恢复到原版可靠的目标元素
    waitForElement('#meta_content_hide_info', initializeReader);

    // 增加一个监听器，当页面URL变化时（例如在公众号内跳转），重新初始化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // 停止之前的朗读
            if(speechState !== 'idle') {
                stopReading();
            }
            // 延迟一点等待新页面加载
            setTimeout(() => {
                 // 【修复】同样使用恢复后的可靠目标元素
                 waitForElement('#meta_content_hide_info', initializeReader);
            }, 500);
        }
    }).observe(document.body, { subtree: true, childList: true });

})();
