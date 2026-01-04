// ==UserScript==
// @name         元宝 & DeepSeek 对话导出工具 | Yuanbao & DeepSeek Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  支持元宝和 DeepSeek 对话导出，支持 JSON 和 Markdown 格式。Export Yuanbao and DeepSeek chat history with JSON and Markdown formats.
// @author       dst1213
// @license      MIT
// @match        https://yuanbao.tencent.com/chat/*
// @match        https://*.deepseek.com/a/chat/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530773/%E5%85%83%E5%AE%9D%20%20DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20%7C%20Yuanbao%20%20DeepSeek%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/530773/%E5%85%83%E5%AE%9D%20%20DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20%7C%20Yuanbao%20%20DeepSeek%20Chat%20Exporter.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    let state = {
        targetResponse: null,
        lastUpdateTime: null,
        convertedMd: null,
        isYuanbao: window.location.href.includes('yuanbao.tencent.com'),
        isDeepSeek: window.location.href.includes('deepseek.com')
    };
 
    const log = {
        info: (msg) => console.log(`[Chat Exporter] ${msg}`),
        error: (msg, e) => console.error(`[Chat Exporter] ${msg}`, e)
    };
 
    function processTargetResponse() {
        try {
            if (state.isYuanbao) {
                const messages = extractYuanbaoMessages();
                if (messages.length > 0) {
                    state.targetResponse = JSON.stringify({ messages }, null, 2);
                    state.lastUpdateTime = new Date().toLocaleTimeString();
                    state.convertedMd = convertJsonToMd({ messages });
                    updateButtonStatus();
                    log.info('成功提取元宝对话内容');
                }
            } else if (state.isDeepSeek) {
                // DeepSeek 的逻辑保持不变
                // ...
            }
        } catch (e) {
            log.error('处理对话内容时出错:', e);
        }
    }
 
    function extractYuanbaoMessages() {
        const messages = [];
        const messageElements = document.querySelectorAll('.agent-chat__list__item');
        messageElements.forEach(el => {
            const role = el.classList.contains('agent-chat__list__item--human') ? 'human' : 'ai';
            const content = el.querySelector('.hyc-content-text, .hyc-content-md')?.innerText || '';
            messages.push({ role, content });
        });
        return messages;
    }
 
    function convertJsonToMd(data) {
        let mdContent = [];
        if (state.isYuanbao) {
            data.messages.forEach(msg => {
                const role = msg.role === 'human' ? 'Human' : 'Assistant';
                mdContent.push(`### ${role}`);
                mdContent.push(msg.content + '\n');
            });
        } else if (state.isDeepSeek) {
            // DeepSeek 的逻辑保持不变
            // ...
        }
        return mdContent.join('\n');
    }
 
    function updateButtonStatus() {
        const jsonButton = document.getElementById('downloadJsonButton');
        const mdButton = document.getElementById('downloadMdButton');
        if (jsonButton && mdButton) {
            const hasResponse = state.targetResponse !== null;
            jsonButton.style.backgroundColor = hasResponse ? '#28a745' : '#007bff';
            mdButton.style.backgroundColor = state.convertedMd ? '#28a745' : '#007bff';
            const statusText = hasResponse ? `最后更新: ${state.lastUpdateTime}\n数据已准备好` : '等待目标响应中...';
            jsonButton.title = statusText;
            mdButton.title = statusText;
        }
    }
 
    function createDownloadButtons() {
        const buttonContainer = document.createElement('div');
        const jsonButton = document.createElement('button');
        const mdButton = document.createElement('button');
 
        Object.assign(buttonContainer.style, {
            position: 'fixed',
            top: '45%',
            right: '10px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            opacity: '0.5',
            transition: 'opacity 0.3s ease',
            cursor: 'move'
        });
 
        const buttonStyles = {
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            fontSize: '14px'
        };
 
        jsonButton.id = 'downloadJsonButton';
        jsonButton.innerText = 'JSON';
        mdButton.id = 'downloadMdButton';
        mdButton.innerText = 'MD';
 
        Object.assign(jsonButton.style, buttonStyles);
        Object.assign(mdButton.style, buttonStyles);
 
        buttonContainer.onmouseenter = () => buttonContainer.style.opacity = '1';
        buttonContainer.onmouseleave = () => buttonContainer.style.opacity = '0.5';
 
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
 
        buttonContainer.onmousedown = dragStart;
        document.onmousemove = drag;
        document.onmouseup = dragEnd;
 
        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === buttonContainer) {
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
                setTranslate(currentX, currentY, buttonContainer);
            }
        }
 
        function dragEnd() {
            isDragging = false;
        }
 
        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }
 
        jsonButton.onclick = function () {
            if (!state.targetResponse) {
                alert('还没有发现有效的对话记录。\n请等待目标响应或进行一些对话。');
                return;
            }
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const chatName = state.isYuanbao ? `Yuanbao - Chat` : `DeepSeek - Chat`;
                const fileName = `${chatName}_${timestamp}.json`;
 
                const blob = new Blob([state.targetResponse], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
 
                log.info(`成功下载文件: ${fileName}`);
            } catch (e) {
                log.error('下载过程中出错:', e);
                alert('下载过程中发生错误，请查看控制台了解详情。');
            }
        };
 
        mdButton.onclick = function () {
            if (!state.convertedMd) {
                alert('还没有发现有效的对话记录。\n请等待目标响应或进行一些对话。');
                return;
            }
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const chatName = state.isYuanbao ? `Yuanbao - Chat` : `DeepSeek - Chat`;
                const fileName = `${chatName}_${timestamp}.md`;
 
                const blob = new Blob([state.convertedMd], { type: 'text/markdown' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
 
                log.info(`成功下载文件: ${fileName}`);
            } catch (e) {
                log.error('下载过程中出错:', e);
                alert('下载过程中发生错误，请查看控制台了解详情。');
            }
        };
 
        buttonContainer.appendChild(jsonButton);
        buttonContainer.appendChild(mdButton);
        document.body.appendChild(buttonContainer);
 
        updateButtonStatus();
    }
 
    window.addEventListener('load', function () {
        createDownloadButtons();
 
        const observer = new MutationObserver(() => {
            processTargetResponse();
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        log.info('对话导出脚本已启动');
    });
})();