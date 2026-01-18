// ==UserScript==
// @name         Claude 对话导出器 | Claude Conversation Exporter Plus
// @namespace    http://tampermonkey.net/
// @version      4.6.7
// @description  优雅导出 Claude 对话记录，支持 JSON 和 Markdown 格式，包含思考过程。Elegantly export Claude conversation records, supporting JSON and Markdown formats with thinking process.
// @author       Gao + Gemini
// @license      Custom License
// @match        https://*.claudesvip.top/chat/*
// @match        https://*.claude.ai/chat/*
// @match        https://*.fuclaude.com/chat/*
// @match        https://*.aikeji.vip/chat/*
// @match        https://share.mynanian.top/chat/*
// @match        https://demo.fuclaude.com/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517832/Claude%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20Claude%20Conversation%20Exporter%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/517832/Claude%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20Claude%20Conversation%20Exporter%20Plus.meta.js
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

    let includeThinking = localStorage.getItem('claudeExporterIncludeThinking') !== 'false';

    const log = {
        info: (msg) => console.log(`[Claude Saver] ${msg}`),
        error: (msg, e) => console.error(`[Claude Saver] ${msg}`, e)
    };

    const targetUrlPattern = /\/chat_conversations\/[\w-]+\?tree=True&rendering_mode=messages&render_all_tools=true/;

    function processTargetResponse(text, url) {
        try {
            if (targetUrlPattern.test(url)) {
                state.targetResponse = text;
                state.lastUpdateTime = new Date().toLocaleTimeString();
                const jsonData = JSON.parse(text);
                state.convertedMd = convertJsonToMd(jsonData);
                updateButtonStatus();
                log.info(`成功捕获对话数据 (${text.length} bytes)`);
            }
        } catch (e) {
            log.error('处理响应失败:', e);
        }
    }

    function updateButtonStatus() {
        const jsonBtn = document.getElementById('downloadJsonButton');
        const mdBtn = document.getElementById('downloadMdButton');
        const modeBtn = document.getElementById('thinkingModeButton');
        const hasData = state.targetResponse !== null;

        if (jsonBtn) jsonBtn.style.backgroundColor = hasData ? '#28a745' : '#007bff';
        if (mdBtn) mdBtn.style.backgroundColor = state.convertedMd ? '#28a745' : '#007bff';
        if (modeBtn) modeBtn.innerText = includeThinking ? '包含思考' : '不包含思考';
    }

    // --- 核心转换逻辑 ---
    function convertJsonToMd(data) {
        if (!data || !data['chat_messages']) return "";

        let md = [];
        const title = document.title.trim().replace(/\s+-\s+Claude$/, '');
        md.push(`# ${title}\n`);

        const baseUrl = window.location.href.replace(/\/chat\/.*$/, '');

        for (const msg of data['chat_messages']) {
            const sender = msg['sender'] === 'human' ? 'Human' : 'Assistant';
            md.push(`## ${sender}`);
            md.push(`*${msg['created_at'] || '未知时间'}*\n`);

            if (msg['content'] && Array.isArray(msg['content'])) {
                for (const block of msg['content']) {
                    // 1. 处理思考块 (Thinking)
                    if (block.type === 'thinking' && includeThinking) {
                        const duration = (block.start_timestamp && block.stop_timestamp)
                            ? ((new Date(block.stop_timestamp) - new Date(block.start_timestamp)) / 1000).toFixed(1)
                            : null;

                        md.push(`### 思考过程 ${duration ? `(${duration}s)` : ''}`);
                        md.push(adjustHeadingLevel(block.thinking || '', 3));

                        if (block.summaries && block.summaries.length > 0) {
                            md.push(`\n**思考摘要：**`);
                            block.summaries.forEach(s => md.push(`- ${s.summary}`));
                        }
                        md.push(`\n---\n`);
                    }

                    // 2. 处理文字内容 (Text)
                    if (block.type === 'text') {
                        let textContent = block.text || '';
                        let processedText = processLatex(textContent);
                        processedText = adjustHeadingLevel(processedText, includeThinking ? 3 : 2);
                        md.push(processedText + '\n');
                    }

                    // 3. 处理工具调用 (Tool Use: Artifacts / Search)
                    if (block.type === 'tool_use') {
                        if (block.name === 'artifacts') {
                            const art = block.input || {};
                            // 安全读取 type 属性，防止 split 报错
                            const typeStr = art.type || 'text/plain';
                            const lang = typeStr.includes('/') ? typeStr.split('/').pop().replace('ant.', '') : typeStr;

                            md.push(`### Artifact: ${art.title || 'Untitled'}`);
                            md.push(`\`\`\`${lang}\n${art.content || ''}\n\`\`\`\n`);
                        } else if (block.name === 'web_search') {
                            md.push(`*> 联网搜索: ${block.input?.query || '执行搜索'}*\n`);
                        }
                    }
                }
            }

            // 处理附件 (PDF/Images etc.)
            const files = [...(msg['attachments'] || []), ...(msg['files_v2'] || [])];
            if (files.length > 0) {
                md.push(`### 附件清单`);
                files.forEach(file => {
                    const link = file.preview_url || (file.document_asset && file.document_asset.url);
                    if (link) {
                        md.push(`- [${file.file_name}](${baseUrl}${link})`);
                    } else if (file.extracted_content) {
                        md.push(`- ${file.file_name} (内容已提取)`);
                        md.push(`\n\`\`\`\n${file.extracted_content}\n\`\`\`\n`);
                    } else {
                        md.push(`- ${file.file_name}`);
                    }
                });
                md.push('');
            }
        }
        return md.join('\n');
    }

    function adjustHeadingLevel(text, increaseLevel = 2) {
        if (typeof text !== 'string' || !text) return '';

        const codeBlockPattern = /(```[\s\S]*?```)/g;
        const parts = text.split(codeBlockPattern);

        return parts.map(part => {
            if (part.startsWith('```')) return part;
            return part.split('\n').map(line => {
                if (line.trim().startsWith('#')) {
                    const levelMatch = line.match(/^#+/);
                    const level = levelMatch ? levelMatch[0].length : 0;
                    return '#'.repeat(level + increaseLevel) + line.slice(level);
                }
                return line;
            }).join('\n');
        }).join('');
    }

    function processLatex(text) {
        if (typeof text !== 'string') return '';
        return text.replace(/\$\$(.+?)\$\$/gs, (match, formula) => {
            return formula.includes('\n') ? `\n$$\n${formula.trim()}\n$$\n` : `$${formula.trim()}$`;
        });
    }

    // --- UI 相关 ---
    function createDownloadButtons() {
        if (document.getElementById('claude-exporter-ui')) return;

        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed', top: '40%', right: '15px', zIndex: '10000',
            display: 'flex', flexDirection: 'column', gap: '8px',
            opacity: '0.6', transition: 'opacity 0.3s'
        });
        container.id = 'claude-exporter-ui';

        const btnStyle = `padding: 8px 14px; border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-family: sans-serif;`;

        container.innerHTML = `
            <div style="display: flex; gap: 5px;">
                <button id="downloadJsonButton" style="${btnStyle} background: #007bff;">JSON</button>
                <button id="downloadMdButton" style="${btnStyle} background: #007bff;">MD</button>
            </div>
            <button id="thinkingModeButton" style="${btnStyle} background: #6c757d; width: 100%;">${includeThinking ? '包含思考' : '不包含思考'}</button>
        `;

        container.onmouseenter = () => container.style.opacity = '1';
        container.onmouseleave = () => container.style.opacity = '0.6';

        document.body.appendChild(container);

        document.getElementById('downloadJsonButton').onclick = () => downloadFile(state.targetResponse, 'json');
        document.getElementById('downloadMdButton').onclick = () => downloadFile(state.convertedMd, 'md');
        document.getElementById('thinkingModeButton').onclick = () => {
            includeThinking = !includeThinking;
            localStorage.setItem('claudeExporterIncludeThinking', includeThinking);
            // 重新转换一次而不是刷新，体验更好
            if (state.targetResponse) {
                state.convertedMd = convertJsonToMd(JSON.parse(state.targetResponse));
                updateButtonStatus();
            } else {
                window.location.reload();
            }
        };

        // 简易拖拽
        let isDragging = false, offset = [0, 0];
        container.onmousedown = (e) => {
            if(e.target.tagName !== 'BUTTON') {
                isDragging = true;
                offset = [container.offsetLeft - e.clientX, container.offsetTop - e.clientY];
            }
        };
        document.onmousemove = (e) => {
            if (isDragging) {
                container.style.left = (e.clientX + offset[0]) + 'px';
                container.style.top = (e.clientY + offset[1]) + 'px';
                container.style.right = 'auto';
            }
        };
        document.onmouseup = () => isDragging = false;

        updateButtonStatus();
    }

    function downloadFile(content, ext) {
        if (!content) {
            alert("尚未捕获到有效数据。请尝试发送一条新消息，或刷新页面。");
            return;
        }
        const time = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
        const name = document.title.split(' - ')[0].replace(/[\\/:*?"<>|]/g, '_').slice(0, 30);
        const blob = new Blob([content], { type: ext === 'json' ? 'application/json' : 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Claude_${name}_${time}.${ext}`;
        a.click();
    }

    // --- 网络拦截 ---
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0]?.toString() || "";

        if (targetUrlPattern.test(url)) {
            const clone = response.clone();
            clone.text().then(text => processTargetResponse(text, url)).catch(err => log.error("读取流失败", err));
        }
        return response;
    };

    // 初始创建
    if (document.readyState === 'complete') {
        createDownloadButtons();
    } else {
        window.addEventListener('load', createDownloadButtons);
    }

    // 持续监听防丢失
    setInterval(() => {
        if (!document.getElementById('claude-exporter-ui')) createDownloadButtons();
    }, 2000);

})();