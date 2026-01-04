// ==UserScript==
// @name         Claude 对话导出器 | Claude Conversation Exporter Plus
// @namespace    http://tampermonkey.net/
// @version      4.6.6
// @description  优雅导出 Claude 对话记录，支持 JSON 和 Markdown 格式，包含思考过程。Elegantly export Claude conversation records, supporting JSON and Markdown formats with thinking process.
// @author       Gao + GPT-4 + Claude
// @license      Custom License
// @match        https://*.claudesvip.top/chat/*
// @match        https://*.claude.ai/chat/*
// @match        https://*.fuclaude.com/chat/*
// @match        https://*.aikeji.vip/chat/*
// @match        https://share.mynanian.top/chat/*
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

    // 状态追踪
    let state = {
        targetResponse: null,
        lastUpdateTime: null,
        convertedMd: null
    };

    // 思考内容包含模式设置
    // 从localStorage读取设置，默认为true（包含思考内容）
    let includeThinking = localStorage.getItem('claudeExporterIncludeThinking') !== 'false';

    // 日志函数
    const log = {
        info: (msg) => console.log(`[Claude Saver] ${msg}`),
        error: (msg, e) => console.error(`[Claude Saver] ${msg}`, e)
    };

    // 正则表达式用于匹配目标 URL
    const targetUrlPattern = /\/chat_conversations\/[\w-]+\?tree=True&rendering_mode=messages&render_all_tools=true/;

    // 响应处理函数（处理符合匹配模式的响应）
    function processTargetResponse(text, url) {
        try {
            if (targetUrlPattern.test(url)) {
                state.targetResponse = text;
                state.lastUpdateTime = new Date().toLocaleTimeString();
                updateButtonStatus();
                log.info(`成功捕获目标响应 (${text.length} bytes) 来自: ${url}`);

                // 转换为Markdown
                state.convertedMd = convertJsonToMd(JSON.parse(text));
                log.info('成功将JSON转换为Markdown');
            }
        } catch (e) {
            log.error('处理目标响应时出错:', e);
        }
    }

    // 更新按钮状态
    function updateButtonStatus() {
        const jsonButton = document.getElementById('downloadJsonButton');
        const mdButton = document.getElementById('downloadMdButton');
        const modeButton = document.getElementById('thinkingModeButton');

        if (jsonButton && mdButton) {
            const hasResponse = state.targetResponse !== null;
            jsonButton.style.backgroundColor = hasResponse ? '#28a745' : '#007bff';
            mdButton.style.backgroundColor = state.convertedMd ? '#28a745' : '#007bff';
            const statusText = hasResponse ? `最后更新: ${state.lastUpdateTime}
数据已准备好` : '等待目标响应中...';
            jsonButton.title = statusText;
            mdButton.title = statusText;
        }

        // 更新模式按钮文本
        if (modeButton) {
            modeButton.innerText = includeThinking ? '包含思考' : '不包含思考';
        }
    }

    // 创建下载按钮
function createDownloadButtons() {
    const buttonContainer = document.createElement('div');
    const firstRowContainer = document.createElement('div');
    const jsonButton = document.createElement('button');
    const mdButton = document.createElement('button');
    const modeButton = document.createElement('button');

    // 主容器样式
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

    // 第一行容器样式
    Object.assign(firstRowContainer.style, {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        justifyContent: 'space-between'
    });

    // 按钮样式
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
        fontSize: '14px',
        flex: '1'
    };

    jsonButton.id = 'downloadJsonButton';
    jsonButton.innerText = 'JSON';
    mdButton.id = 'downloadMdButton';
    mdButton.innerText = 'MD';

    // 新增模式切换按钮 - 简化文本
    modeButton.id = 'thinkingModeButton';
    modeButton.innerText = includeThinking ? '包含思考' : '不包含思考';

    // 为模式按钮设置特殊颜色以区分
    const modeButtonStyle = {...buttonStyles};
    modeButtonStyle.backgroundColor = '#6c757d';
    modeButtonStyle.width = '100%'; // 设置第二行按钮宽度为100%

    Object.assign(jsonButton.style, buttonStyles);
    Object.assign(mdButton.style, buttonStyles);
    Object.assign(modeButton.style, modeButtonStyle);

    // 悬停效果
    buttonContainer.onmouseenter = () => buttonContainer.style.opacity = '1';
    buttonContainer.onmouseleave = () => buttonContainer.style.opacity = '0.5';

    // 拖拽功能
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

    // 点击事件（保持原来的功能）
    jsonButton.onclick = function() {
        if (!state.targetResponse) {
            alert(`还没有发现有效的对话记录。
请等待目标响应或进行一些对话。`);
            return;
        }

        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const chatName = "Claude - " + document.title.trim().replace(/\s+-\s+Claude$/, '').replace(/[\/\\?%*:|"<>]/g, '-');
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
            alert(`还没有发现有效的对话记录。
请等待目标响应或进行一些对话。`);
            return;
        }

        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const chatName = "Claude - " + document.title.trim().replace(/\s+-\s+Claude$/, '').replace(/[\/\\?%*:|"<>]/g, '-');
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

    // 模式切换按钮点击事件
    modeButton.onclick = function() {
        // 切换模式
        includeThinking = !includeThinking;
        // 保存设置到localStorage
        localStorage.setItem('claudeExporterIncludeThinking', includeThinking);
        // 更新按钮文本
        modeButton.innerText = includeThinking ? '包含思考' : '不包含思考';
        // 如果已有对话数据，更新Markdown
        if (state.targetResponse) {
            state.convertedMd = convertJsonToMd(JSON.parse(state.targetResponse));
            log.info(`已切换模式，${includeThinking ? '开启' : '关闭'}思考内容`);
        }
        // 刷新页面
        window.location.reload();
    };

    // 添加到两行容器中
    firstRowContainer.appendChild(jsonButton);
    firstRowContainer.appendChild(mdButton);
    buttonContainer.appendChild(firstRowContainer);
    buttonContainer.appendChild(modeButton);
    document.body.appendChild(buttonContainer);

    updateButtonStatus();
}

    function convertJsonToMd(data) {
    let mdContent = [];
    const title = document.title.trim().replace(/\s+-\s+Claude$/, '');
    mdContent.push(`# ${title}\n`);

    // 获取当前页面的完整 URL
    const currentUrl = window.location.href;

    // 提取 URL 前缀（去掉 chat/* 部分）
    const baseUrl = currentUrl.replace(/\/chat\/.*$/, '');

    for (const message of data['chat_messages']) {
        const sender = message['sender'].charAt(0).toUpperCase() + message['sender'].slice(1);
        mdContent.push(`## ${sender}`);

        const createdAt = message['created_at'] || '';
        const updatedAt = message['updated_at'] || '';
        const timestamp = createdAt === updatedAt ? `*${createdAt}*` : `*${createdAt} (updated)*`;
        mdContent.push(timestamp);

        // 处理消息内容
        if (message['content'] && Array.isArray(message['content'])) {
            // 寻找思考内容
            const thinkingContent = message['content'].find(item => item.type === 'thinking');

            // 如果有思考内容且设置为包含思考内容，则处理思考过程
            if (thinkingContent && message['sender'] === 'assistant' && includeThinking) {
                // 计算思考用时
                const startTime = new Date(thinkingContent.start_timestamp);
                const stopTime = new Date(thinkingContent.stop_timestamp);
                const thinkingTimeSeconds = (stopTime - startTime) / 1000;
                const thinkingTimeFormatted = thinkingTimeSeconds.toFixed(2);

                // 添加思考过程标题和用时
                mdContent.push(`### 思考过程 (${thinkingTimeFormatted}s)`);

                // 添加思考内容，并调整其中的标题级别
                let thinking = thinkingContent.thinking;
                thinking = adjustHeadingLevel(thinking, 3); // 确保思考过程中的标题级别比"思考过程"低
                mdContent.push(thinking);

                // 处理思考概括
                if (thinkingContent.summaries && Array.isArray(thinkingContent.summaries)) {
                    mdContent.push(`### 思考概括`);
                    for (const summary of thinkingContent.summaries) {
                        mdContent.push(`- ${summary.summary}`);
                    }
                }

                // 添加正式回答标题
                mdContent.push(`### 回答`);
            }

            // 处理文本内容（正式回答）
            const textContent = message['content'].find(item => item.type === 'text');
            if (textContent) {
                let content = processContent(textContent.text || '');
                // 调整标题级别，确保回答中的标题级别比"回答"的级别低
                // 只有在包含思考内容的情况下才需要这个调整，不包含思考时就不调整
                content = adjustHeadingLevel(content, thinkingContent && includeThinking ? 3 : 2);
                mdContent.push(`${content}\n`);
            }
        } else {
            // 如果消息内容不是数组格式，按原有逻辑处理
            let content = processContent(message['content']);
            // 调整标题级别
            content = adjustHeadingLevel(content, 2);
            mdContent.push(`${content}\n`);
        }

            // === 处理附加文件部分开始 ===
            if (message['attachments'] && message['attachments'].length > 0) {
                mdContent.push(`## 附加文件:`);

                for (const attachment of message['attachments']) {
                    // 判断文件是否有 preview_url 或 document_asset
                    if (attachment.preview_url) {
                        // 使用 preview_url 生成链接
                        const previewLink = `${baseUrl}${attachment.preview_url}`;
                        mdContent.push(`[${attachment.file_name}](${previewLink})\n`);
                    } else if (attachment.document_asset && attachment.document_asset.url) {
                        // 使用 document_asset.url 生成链接
                        const documentLink = `${baseUrl}${attachment.document_asset.url}`;
                        mdContent.push(`[${attachment.file_name}](${documentLink})\n`);
                    } else if (attachment.extracted_content) {
                        // 有具体内容的文件
                        mdContent.push(`${attachment.file_name}\n`);
                        mdContent.push("```\n");
                        mdContent.push(`${attachment.extracted_content}\n`);
                        mdContent.push("```\n");
                    } else {
                        // 无法提取内容或生成链接的文件
                        mdContent.push(`${attachment.file_name} (无法提取内容或生成链接)\n`);
                    }
                }
            }

            // === 处理 `files_v2` 部分开始 ===
            if (message['files_v2'] && message['files_v2'].length > 0) {
                mdContent.push(`## 附加文件:`);

                for (const file of message['files_v2']) {
                    if (file.document_asset && file.document_asset.url) {
                        // 处理 `document_asset` 链接
                        const documentLink = `${baseUrl}${file.document_asset.url}`;
                        mdContent.push(`[${file.file_name}](${documentLink})\n`);
                    } else if (file.preview_url) {
                        // 处理常规的 `preview_url` 链接
                        const previewLink = `${baseUrl}${file.preview_url}`;
                        mdContent.push(`[${file.file_name}](${previewLink})\n`);
                    } else {
                        mdContent.push(`${file.file_name} (无法生成预览链接)\n`);
                    }
                }
            }
            // === 处理 `files_v2` 部分结束 ===
        }

        return mdContent.join('\n');
    }

    // 调整Markdown标题级别
    function adjustHeadingLevel(text, increaseLevel = 2) {
        const codeBlockPattern = /```[\s\S]*?```/g;
        let segments = [];
        let match;

        // 提取代码块，并用占位符替代
        let lastIndex = 0;
        while ((match = codeBlockPattern.exec(text)) !== null) {
            segments.push(text.substring(lastIndex, match.index));
            segments.push(match[0]); // 保留代码块原样
            lastIndex = codeBlockPattern.lastIndex;
        }
        segments.push(text.substring(lastIndex));

        // 调整标题级别
        segments = segments.map(segment => {
            if (segment.startsWith('```')) {
                return segment; // 保留代码块原样
            } else {
                let lines = segment.split('\n');
                lines = lines.map(line => {
                    if (line.trim().startsWith('#')) {
                        const currentLevel = (line.match(/^#+/) || [''])[0].length;
                        return '#'.repeat(currentLevel + increaseLevel) + line.slice(currentLevel);
                    }
                    return line;
                });
                return lines.join('\n');
            }
        });

        return segments.join('');
    }

    // 处理消息内容，提取纯文本并处理LaTeX公式
    function processContent(content) {
        if (Array.isArray(content)) {
            let textParts = [];
            for (const item of content) {
                if (item.type === 'text') {
                    let text = item.text || '';
                    text = processLatex(text);
                    text = text.replace(/(?<!\n)(\n\| .*? \|\n\|[-| ]+\|\n(?:\| .*? \|\n)+)/g, '\n$1'); // 在表格前插入一个空行
                    textParts.push(text);
                }
            }
            return textParts.join('\n');
        }
        return String(content);
    }

    // 处理LaTeX公式
    function processLatex(text) {
        // 区分行内公式和独立公式
        text = text.replace(/\$\$(.+?)\$\$/gs, (match, formula) => {
            if (formula.includes('\n')) {
                // 这是独立公式
                return `$$${formula}$$`;
            } else {
                // 这是行内公式
                return `$${formula}$`;
            }
        });
        return text;
    }

    // 监听 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0];

        log.info(`捕获到 fetch 请求: ${url}`);

        if (targetUrlPattern.test(url)) {
            try {
                log.info(`匹配到目标 URL: ${url}`);
                const clonedResponse = response.clone();
                clonedResponse.text().then(text => {
                    processTargetResponse(text, url);
                }).catch(e => {
                    log.error('解析fetch响应时出错:', e);
                });
            } catch (e) {
                log.error('克隆fetch响应时出错:', e);
            }
        }
        return response;
    };

    // 页面加载完成后立即创建按钮
    window.addEventListener('load', function() {
        createDownloadButtons();

        // 使用 MutationObserver 确保按钮始终存在
        const observer = new MutationObserver(() => {
            if (!document.getElementById('downloadJsonButton') || !document.getElementById('downloadMdButton') || !document.getElementById('thinkingModeButton')) {
                log.info('检测到按钮丢失，正在重新创建...');
                createDownloadButtons();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log.info('Claude 保存脚本已启动');
    });
})();