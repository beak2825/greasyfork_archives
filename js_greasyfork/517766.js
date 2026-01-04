// ==UserScript==
// @name         ChatGPT对话导出器 | ChatGPT Conversation Exporter Plus
// @namespace    http://tampermonkey.net/
// @version      2.2.7
// @description  优雅导出 ChatGPT 对话记录，支持 JSON 和 Markdown 格式。Elegantly export ChatGPT conversation records, supporting JSON and Markdown formats.
// @author       Gao + GPT-4 + Claude
// @license      Custom License
// @match        *://*.dawuai.de/c/*
// @match        *://*.dwai.work/c/*
// @match        *://*.dawuai.buzz/c/*
// @match        *://*.dwaiai.de/c/*
// @match        *://*.dwai.world/c/*
// @match        https://chatgpt.com/c/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517766/ChatGPT%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20ChatGPT%20Conversation%20Exporter%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/517766/ChatGPT%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20ChatGPT%20Conversation%20Exporter%20Plus.meta.js
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

    // Python转换函数移植
    function formatTimestamp(timestamp) {
        if (!timestamp) return null;
        const dt = new Date(timestamp * 1000);
        return dt.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
    }

    function getModelInfo(message) {
        if (!message || !message.metadata) return "";
        const { model_slug, default_model_slug } = message.metadata;
        if (model_slug && default_model_slug && model_slug !== default_model_slug) {
            return ` [使用模型: ${model_slug}]`;
        }
        return "";
    }

    function generateFootnotes(text, contentReferences) {
        const footnotes = [];
        let footnoteIndex = 1;
        let updatedText = text;

        for (const ref of contentReferences || []) {
            if (ref.type === 'webpage' && ref.url) {
                const title = ref.title || ref.url;
                updatedText += ` [^${footnoteIndex}]`;
                footnotes.push(`[^${footnoteIndex}]: [${title}](${ref.url})`);
                footnoteIndex++;
            }
        }

        return [footnotes, updatedText];
    }

    function extractMessageParts(message, mapping) {
        if (!message || !message.message) return [null, null, []];

        const msg = message.message;
        const timestamp = formatTimestamp(msg.create_time);

        const authorName = msg.author?.name;
        if (authorName && (authorName.startsWith('canmore.') || authorName.startsWith('dalle.'))) {
            return [null, null, []];
        }

        const parts = msg.content?.parts || [];
        if (!parts.length) return [null, null, []];

        let text = parts.join(' ');
        if (!text) return [null, null, []];

        if (parts[0] && typeof parts[0] === 'string' && parts[0].includes("DALL-E displayed")) {
            return [null, null, []];
        }

        const cleanedText = text.replace(/citeturn0news\d+/g, '');
        const contentReferences = msg.metadata?.content_references || [];

        // ====================== 在这里添加附件处理 ======================
        const attachments = [];
        // 检查当前消息的metadata中是否有附件
        const messageAttachments = msg.metadata?.attachments || [];

        // 通过mapping查找附件内容
        if (messageAttachments.length > 0 && mapping) {
            // 遍历当前节点的子节点
            const currentNode = mapping[message.id];
            const children = currentNode?.children || [];

            for (const childId of children) {
                const childNode = mapping[childId];
                // 找到myfiles_browser工具的响应
                if (childNode?.message?.author?.name === 'myfiles_browser') {
                    // 遍历它的所有子节点找到包含文件内容的消息
                    const processChildren = (nodeId) => {
                        const node = mapping[nodeId];
                        if (node?.message?.content?.content_type === 'tether_quote' &&
                            node.message.content.text) {
                            attachments.push({
                                name: node.message.content.domain,
                                content: node.message.content.text
                            });
                        }
                        // 继续递归处理子节点
                        const children = node.children || [];
                        for (const childId of children) {
                            processChildren(childId);
                        }
                    };
                    // 处理所有子节点
                    processChildren(childId);
                }
            }
        }
        // ====================== 附件处理结束 ======================

        const [footnotes, updatedText] = generateFootnotes(cleanedText, contentReferences);
        return [updatedText, timestamp, footnotes, attachments];  // 这里记得返回attachments
    }

    function isCanvasRelated(node) {
        if (!node?.message) return false;

        const message = node.message;
        const authorName = message.author?.name;
        const recipient = message.recipient;

        if ((authorName && String(authorName).includes('canmore.')) ||
            (recipient && String(recipient).includes('canmore.'))) {
            return true;
        }

        const metadata = message.metadata || {};
        return metadata.canvas || String(metadata.command || '').includes('canvas');
    }

    function adjustHeaderLevels(text, increaseBy = 2) {
        return text.replace(/^(#+)(.*?)$/gm, (match, hashes, rest) => {
            return '#'.repeat(hashes.length + increaseBy) + rest;
        });
    }

    // 状态追踪
    let state = {
        largestResponse: null,
        largestResponseSize: 0,
        largestResponseUrl: null,
        lastUpdateTime: null
    };

    // 日志函数
    const log = {
        info: (msg) => console.log(`[Conversation Saver] ${msg}`),
        error: (msg, e) => console.error(`[Conversation Saver] ${msg}`, e)
    };

    // 对话转换为Markdown的核心函数
    function buildConversationTree(mapping, nodeId, indent = 0) {
        if (!mapping[nodeId]) return [];

        const node = mapping[nodeId];
        const conversation = [];

        if (!isCanvasRelated(node)) {
            const [messageContent, timestamp, footnotes, attachments] = extractMessageParts(node, mapping); // 确保接收attachments
            if (messageContent) {
                const role = node.message?.author?.role;
                if (role === 'user' || role === 'assistant') {
                    const modelInfo = getModelInfo(node.message);
                    const timestampInfo = timestamp ? `\n\n*${timestamp}*` : "";

                    const prefix = role === 'user' ?
                        `## Human${timestampInfo}\n\n` :
                        `## Assistant${modelInfo}${timestampInfo}\n\n`;

                    const adjustedContent = adjustHeaderLevels(messageContent);
                    conversation.push(prefix + adjustedContent);

                    // ====================== 在这里添加附件展示 ======================
                    if (attachments && attachments.length > 0) {
                        conversation.push("\n## 附加文件\n");
                        for (const attachment of attachments) {
                            conversation.push(attachment.name + "\n");
                            conversation.push("```\n" + attachment.content + "\n```\n");
                        }
                    }
                    // ====================== 附件展示结束 ======================

                    if (footnotes.length) {
                        conversation.push("\n" + footnotes.join("\n"));
                    }
                }
            }
        }

        for (const childId of (node.children || [])) {
            conversation.push(...buildConversationTree(mapping, childId, indent + 1));
        }

        return conversation;
    }

    // 移除特殊标记
    function removeCiteTurnAndNavlistMarkers(data) {
        if (typeof data === 'object' && data !== null) {
            if (data.content && data.content.parts) {
                data.content.parts = data.content.parts
                    .filter(part => typeof part === 'string' && !part.includes("video 袁娅维"));
            }
            for (let key in data) {
                data[key] = removeCiteTurnAndNavlistMarkers(data[key]);
            }
            return data;
        } else if (Array.isArray(data)) {
            return data.map(item => removeCiteTurnAndNavlistMarkers(item));
        } else if (typeof data === 'string') {
            let result = data
                // 保留原有的清理规则
                .replace(/(citeturn|turn)0(news|search)\d+/g, '')
                .replace(/^video.*?《.*?》MV\s*/gm, '')
                .replace(/navlist.*?(?=\n|$)/g, '')
                // 只处理中文方括号格式，支持任意位数的数字
                .replace(/【\d{1,4}†source】/g, '')
                // 处理可能的变体格式（仍然只限中文方括号）
                .replace(/【\d{1,4}\†.*?】/g, '')
                // 保持原有的空行处理
                .replace(/\n\s*\n/g, '\n\n');
            return result.trim();
        }
        return data;
    }

    // 获取默认模型
    function getDefaultModel(data) {
        if (!data?.mapping) return 'unknown';

        for (const node of Object.values(data.mapping)) {
            if (node.message?.author?.role === 'assistant') {
                return node.message.metadata?.default_model_slug || 'unknown';
            }
        }
        return 'unknown';
    }

    // 转换JSON到Markdown
    function convertJsonToMarkdown(jsonData) {
        // 移除PUA字符
        const cleanData = JSON.parse(JSON.stringify(jsonData).replace(/[\uE000-\uF8FF]/g, ''));

        // 移除特定标记
        const processedData = removeCiteTurnAndNavlistMarkers(cleanData);

        // 获取标题和默认模型
        const title = processedData.title || 'Conversation';
        const defaultModel = getDefaultModel(processedData);

        // 获取根节点
        const mapping = processedData.mapping;
        const rootId = Object.keys(mapping).find(nodeId => !mapping[nodeId].parent);

        // 构建对话
        const conversation = buildConversationTree(mapping, rootId);

        // 生成最终的Markdown内容
        let markdownContent = `# ${title}-${defaultModel}\n\n`;
        markdownContent += conversation.join('\n\n').replace(/\n{3,}/g, '\n\n');

        return markdownContent;
    }

    // 响应处理函数
    function processResponse(text, url) {
        try {
            const responseSize = text.length;
            if (responseSize > state.largestResponseSize) {
                state.largestResponse = text;
                state.largestResponseSize = responseSize;
                state.largestResponseUrl = url;
                state.lastUpdateTime = new Date().toLocaleTimeString();
                updateButtonsStatus();
                log.info(`发现更大的响应 (${responseSize} bytes) 来自: ${url}`);
            }
        } catch (e) {
            log.error('处理响应时出错:', e);
        }
    }

    // 监听 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0];

        if (url.includes('conversation/')) {
            try {
                const clonedResponse = response.clone();
                clonedResponse.text().then(text => {
                    processResponse(text, url);
                }).catch(e => {
                    log.error('解析fetch响应时出错:', e);
                });
            } catch (e) {
                log.error('克隆fetch响应时出错:', e);
            }
        }
        return response;
    };

    // 监听传统的 XHR 请求
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('conversation/')) {
            this.addEventListener('load', function() {
                try {
                    processResponse(this.responseText, url);
                } catch (e) {
                    log.error('处理XHR响应时出错:', e);
                }
            });
        }
        return originalXhrOpen.apply(this, arguments);
    };

    // 更新按钮状态
    function updateButtonsStatus() {
        const jsonButton = document.getElementById('downloadJsonButton');
        const mdButton = document.getElementById('downloadMdButton');

        [jsonButton, mdButton].forEach(button => {
            if (button) {
                button.style.backgroundColor = state.largestResponse ? '#28a745' : '#007bff';
                button.title = state.largestResponse
                    ? `最后更新: ${state.lastUpdateTime}\n来源: ${state.largestResponseUrl}\n大小: ${(state.largestResponseSize / 1024).toFixed(2)}KB`
                    : '等待响应中...';
            }
        });
    }

    // 创建下载按钮
    function createDownloadButtons() {
        const buttonStyles = {
            position: 'fixed',
            top: '45%',
            right: '0px',
            zIndex: '9999',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap'
        };

        // JSON下载按钮
        const jsonButton = document.createElement('button');
        jsonButton.id = 'downloadJsonButton';
        jsonButton.innerText = '下载JSON';
        Object.assign(jsonButton.style, buttonStyles);

        // MD下载按钮
        const mdButton = document.createElement('button');
        mdButton.id = 'downloadMdButton';
        mdButton.innerText = '下载MD';
        Object.assign(mdButton.style, buttonStyles);
        mdButton.style.right = '100px'; // 设置MD按钮在JSON按钮左边

        // 鼠标悬停效果
        [jsonButton, mdButton].forEach(button => {
            button.onmouseover = () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            };
            button.onmouseout = () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            };
        });

        // 下载功能
        jsonButton.onclick = function() {
            if (!state.largestResponse) {
                alert('还没有发现有效的会话记录。\n请等待页面加载完成或进行一些对话。');
                return;
            }

            try {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const chatName = "Chatgpt - " + document.title.trim().replace(/[/\\?%*:|"<>]/g, '-');
                const fileName = `${chatName}_${timestamp}.json`;

                const blob = new Blob([state.largestResponse], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();

                log.info(`成功下载JSON文件: ${fileName}`);
            } catch (e) {
                log.error('下载JSON过程中出错:', e);
                alert('下载过程中发生错误，请查看控制台了解详情。');
            }
        };

        mdButton.onclick = function() {
            if (!state.largestResponse) {
                alert('还没有发现有效的会话记录。\n请等待页面加载完成或进行一些对话。');
                return;
            }

            try {
                const jsonData = JSON.parse(state.largestResponse);
                const markdownContent = convertJsonToMarkdown(jsonData);

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                const chatName = "Chatgpt - " + document.title.trim().replace(/[/\\?%*:|"<>]/g, '-');
                const fileName = `${chatName}_${timestamp}.md`;

                const blob = new Blob([markdownContent], { type: 'text/markdown' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();

                log.info(`成功下载MD文件: ${fileName}`);
            } catch (e) {
                log.error('下载MD过程中出错:', e);
                alert('下载过程中发生错误，请查看控制台了解详情。');
            }
        };

        document.body.appendChild(jsonButton);
        document.body.appendChild(mdButton);
        updateButtonsStatus();
    }

    // 页面加载完成后初始化
    window.addEventListener('load', function() {
        createDownloadButtons();

        // 使用 MutationObserver 确保按钮始终存在
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

        log.info('增强版会话保存脚本已启动');
    });
})();