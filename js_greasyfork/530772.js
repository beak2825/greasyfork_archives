// ==UserScript==
// @name         DeepSeek 对话导出工具 | DeepSeek Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  DeepSeek对话导出，比如JSON和Markdown 格式。Export DeepSeek chat history with JSON and Markdown formats.
// @author       dst1213
// @license      MIT
// @match        https://*.deepseek.com/a/chat/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530772/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20%7C%20DeepSeek%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/530772/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20%7C%20DeepSeek%20Chat%20Exporter.meta.js
// ==/UserScript==
 
/*
 您可以在个人设备上使用和修改该代码。
 不得将该代码或其修改版本重新分发、再发布或用于其他公众渠道。
 保留所有权利，未经授权不得用于商业用途。
*/
 
/*
You may use and modify this code on your personal devices.
You may not redistribute, republish, or use this code or its modified versions in other public channels.
All rights reserved. Unauthorized commercial use is prohibited.
*/
 
(function() {
    'use strict';
 
    let state = {
        targetResponse: null,
        lastUpdateTime: null,
        convertedMd: null
    };
 
    const log = {
        info: (msg) => console.log(`[DeepSeek Saver] ${msg}`),
        error: (msg, e) => console.error(`[DeepSeek Saver] ${msg}`, e)
    };
 
    const targetUrlPattern = /chat_session_id=/;
 
    function processTargetResponse(text, url) {
        try {
            if (targetUrlPattern.test(url)) {
                state.targetResponse = text;
                state.lastUpdateTime = new Date().toLocaleTimeString();
                updateButtonStatus();
                log.info(`成功捕获目标响应 (${text.length} bytes) 来自: ${url}`);
 
                state.convertedMd = convertJsonToMd(JSON.parse(text));
                log.info('成功将JSON转换为Markdown');
            }
        } catch (e) {
            log.error('处理目标响应时出错:', e);
        }
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
 
        jsonButton.onclick = function() {
            if (!state.targetResponse) {
                alert('还没有发现有效的对话记录。\n请等待目标响应或进行一些对话。');
                return;
            }
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const jsonData = JSON.parse(state.targetResponse);
                const chatName = `DeepSeek - ${jsonData.data.biz_data.chat_session.title || 'Untitled Chat'}`.replace(/[\/\\?%*:|"<>]/g, '-');
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
 
        mdButton.onclick = function() {
            if (!state.convertedMd) {
                alert('还没有发现有效的对话记录。\n请等待目标响应或进行一些对话。');
                return;
            }
            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const jsonData = JSON.parse(state.targetResponse);
                const chatName = `DeepSeek - ${jsonData.data.biz_data.chat_session.title || 'Untitled Chat'}`.replace(/[\/\\?%*:|"<>]/g, '-');
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
 
    function convertJsonToMd(data) {
        let mdContent = [];
        const title = data.data.biz_data.chat_session.title || 'Untitled Chat';
        const totalTokens = data.data.biz_data.chat_messages.reduce((acc, msg) => acc + msg.accumulated_token_usage, 0);
        mdContent.push(`# DeepSeek - ${title} (Total Tokens: ${totalTokens})\n`);
 
        data.data.biz_data.chat_messages.forEach(msg => {
            const role = msg.role === 'USER'? 'Human' : 'Assistant';
            mdContent.push(`### ${role}`);
 
            const timestamp = new Date(msg.inserted_at * 1000).toISOString();
            mdContent.push(`*${timestamp}*\n`);
 
            if (msg.files && msg.files.length > 0) {
                msg.files.forEach(file => {
                    const insertTime = new Date(file.inserted_at * 1000).toISOString();
                    const updateTime = new Date(file.updated_at * 1000).toISOString();
                    mdContent.push(`### File Information`);
                    mdContent.push(`- Name: ${file.file_name}`);
                    mdContent.push(`- Size: ${file.file_size} bytes`);
                    mdContent.push(`- Token Usage: ${file.token_usage}`);
                    mdContent.push(`- Upload Time: ${insertTime}`);
                    mdContent.push(`- Last Update: ${updateTime}\n`);
                });
            }
 
            let content = msg.content;
 
            if (msg.search_results && msg.search_results.length > 0) {
                const citations = {};
                msg.search_results.forEach((result, index) => {
                    if (result.cite_index !== null) {
                        citations[result.cite_index] = result.url;
                    }
                });
                content = content.replace(/\[citation:(\d+)\]/g, (match, p1) => {
                    const url = citations[parseInt(p1)];
                    return url? ` [${p1}](${url})` : match;
                });
                content = content.replace(/\s+,/g, ',').replace(/\s+\./g, '.');
            }
 
            if (msg.thinking_content) {
                const thinkingTime = msg.thinking_elapsed_secs? `(${msg.thinking_elapsed_secs}s)` : '';
                content += `\n\n**Thinking Process ${thinkingTime}:**\n${msg.thinking_content}`;
            }
 
            content = content.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
                return formula.includes('\n')? `\n$$\n${formula}\n$$\n` : `$$${formula}$$`;
            });
 
            mdContent.push(content + '\n');
        });
 
        return mdContent.join('\n');
    }
 
    const hookXHR = () => {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(...args) {
          if (args[1] && typeof args[1] === 'string' && args[1].includes('history_messages?chat_session_id') && args[1].includes('&cache_version=')) {
            args[1] = args[1].split('&cache_version=')[0];
          }
          this.addEventListener('load', function() {
            if (this.responseURL && this.responseURL.includes('history_messages?chat_session_id')) {
                processTargetResponse(this.responseText, this.responseURL);
            }
          });
          originalOpen.apply(this, args);
        };
    };
    hookXHR();
 
    window.addEventListener('load', function() {
        createDownloadButtons();
 
        const observer = new MutationObserver(() => {
            if (!document.getElementById('downloadJsonButton') || !document.getElementById('downloadMdButton')) {
                log.info('检测到按钮丢失，正在重新创建...');
                createDownloadButtons();
            }
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        log.info('DeepSeek 保存脚本已启动');
    });
})();