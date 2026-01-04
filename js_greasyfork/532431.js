// ==UserScript==
// @name         腾讯元宝对话导出器 | Tencent Yuanbao Exporter
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  导出腾讯元宝对话记录，支持 JSON 和 Markdown 格式。按时间正序，格式更贴近聊天界面。
// @author       Gao + Gemini 2.5 Pro
// @license      Custom License
// @match        https://yuanbao.tencent.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532431/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20Tencent%20Yuanbao%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/532431/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20Tencent%20Yuanbao%20Exporter.meta.js
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

    // --- Helper Functions ---

    function formatTimestamp(unixTimestamp) {
        if (!unixTimestamp) return 'N/A';
        try {
            const dt = new Date(unixTimestamp * 1000);
            return dt.toLocaleString('sv').replace('T', ' ');
        } catch (e) {
            log.error('Error formatting timestamp:', e);
            return 'Invalid Date';
        }
    }

    // Markdown 标题降级函数
    function adjustHeaderLevels(text, increaseBy = 1) {
        if (!text) return '';
        return text.replace(/^(#+)(\s*)(.*?)\s*$/gm, (match, hashes, existingSpace, content) => {
            return '#'.repeat(hashes.length + increaseBy) + ' ' + content.trim();
        });
    }

    // --- State Management ---
    let state = {
        latestDetailResponse: null,
        latestResponseSize: 0,
        latestResponseUrl: null,
        lastUpdateTime: null
    };

    // --- Logging ---
    const log = {
        info: (msg) => console.log(`[Yuanbao Exporter] ${msg}`),
        error: (msg, e) => console.error(`[Yuanbao Exporter] ${msg}`, e)
    };

    // --- Core Conversion Logic ---

    function convertYuanbaoJsonToMarkdown(jsonData) {
        if (!jsonData || !jsonData.convs || !Array.isArray(jsonData.convs)) {
            log.error('Invalid JSON data or missing/invalid "convs" array.');
            return '# 错误：无效的JSON数据\n\n无法解析对话内容。';
        }

        let markdownContent = '';

        // 1. Add Header Info
        const title = jsonData.sessionTitle || jsonData.title || '元宝对话记录';
        markdownContent += `# ${title}\n\n`;

        // 2. Add Multimedia Info
        if (jsonData.multiMediaInfo && jsonData.multiMediaInfo.length > 0) {
            markdownContent += '**包含的多媒体文件:**\n';
            jsonData.multiMediaInfo.forEach(media => {
                markdownContent += `*   [${media.fileName || '未知文件'}](${media.url || '#'}) (${media.type || '未知类型'})\n`;
            });
            markdownContent += '\n---\n';
        } else {
            markdownContent += '---\n';
        }

        // 3. Process Conversation Turns (按 index 正序处理)
        const sortedConvs = [...jsonData.convs].sort((a, b) => (a.index || 0) - (b.index || 0));

        if (sortedConvs.length === 0) {
             log.info('No conversation turns found in the data.');
             return markdownContent.replace('\n---\n','').trim() || '# 对话记录为空';
        }

        sortedConvs.forEach(turn => {
            const timestamp = formatTimestamp(turn.createTime);
            const index = turn.index !== undefined ? turn.index : 'N/A';

            if (turn.speaker === 'human') {
                markdownContent += `\n## 用户 (轮次 ${index})\n`;
                markdownContent += `*时间: ${timestamp}*\n\n`;
                // Find the text part of the user's input
                let userTextMsg = ' ';
                 if (turn.speechesV2 && turn.speechesV2.length > 0 && turn.speechesV2[0].content) {
                     const textBlock = turn.speechesV2[0].content.find(block => block.type === 'text');
                     if (textBlock && typeof textBlock.msg === 'string') {
                         userTextMsg = textBlock.msg;
                     } else if (typeof turn.displayPrompt === 'string') {
                         // Fallback to displayPrompt if no text block found (though less likely for multimodal)
                         userTextMsg = turn.displayPrompt;
                     }
                 } else if (typeof turn.displayPrompt === 'string') {
                     // Fallback for non-multimodal turns
                      userTextMsg = turn.displayPrompt;
                 }
                markdownContent += `${userTextMsg}\n`; // Display the text message


                // 修正：检查本轮用户是否上传了文件，并正确显示类型
                if (turn.speechesV2 && turn.speechesV2.length > 0 && turn.speechesV2[0].content) {
                    let uploadedMedia = [];
                    turn.speechesV2[0].content.forEach(block => {
                        // 检查 block 是否代表一个文件（有 fileName 和 url），并且类型不是 'text'
                        if (block.type !== 'text' && block.fileName && block.url) {
                            uploadedMedia.push(`[${block.fileName || '未知文件'}](${block.url || '#'}) (类型: ${block.type || '未知'})`); // 直接使用 block.type
                        }
                    });
                    if (uploadedMedia.length > 0) {
                        markdownContent += `\n*上传了文件: ${uploadedMedia.join(', ')}*\n`;
                    }
                }

            } else if (turn.speaker === 'ai') {
                markdownContent += `\n## AI (轮次 ${index})\n`;

                let modelDisplay = '未知模型';
                let primaryPluginId = '无插件';

                if (turn.speechesV2 && turn.speechesV2.length > 0) {
                    const firstSpeech = turn.speechesV2[0];
                    const modelIdRaw = firstSpeech.chatModelId;
                    primaryPluginId = firstSpeech.pluginId || primaryPluginId;

                    if (modelIdRaw && String(modelIdRaw).trim() !== '') {
                        modelDisplay = `\`${modelIdRaw}\``;
                    }
                }

                markdownContent += `*时间: ${timestamp} | 模型: ${modelDisplay} | 插件: \`${primaryPluginId}\`*\n\n`;

                // 处理内容块
                if (turn.speechesV2 && turn.speechesV2.length > 0) {
                    turn.speechesV2.forEach(speech => {
                        if (speech.content && speech.content.length > 0) {
                            speech.content.forEach(block => {
                                switch (block.type) {
                                    case 'text':
                                        markdownContent += `${adjustHeaderLevels(block.msg || '', 1)}\n\n`;
                                        break;
                                    case 'think':
                                        markdownContent += `> **[思考过程]** ${block.title || ''}\n>\n`;
                                        (block.content || '无思考内容').split('\n').forEach(line => {
                                            markdownContent += `> ${line}\n`;
                                        });
                                        markdownContent += '\n';
                                        break;
                                    case 'searchGuid':
                                        markdownContent += `**${block.title || '搜索结果'}** (查询: \`${block.botPrompt || 'N/A'}\` | 主题: ${block.topic || 'N/A'})\n`;
                                        if (block.docs && block.docs.length > 0) {
                                            block.docs.forEach((doc, docIndex) => {
                                                markdownContent += `*   [${docIndex + 1}] [${doc.title || '无标题'}](${doc.url || '#'}) (${doc.sourceName || '未知来源'})\n    *   > ${doc.quote || '无引用'}\n`;
                                            });
                                        }
                                        markdownContent += '\n';
                                        break;
                                    case 'image':
                                    case 'code':
                                    case 'pdf': // 添加对 pdf 等类型的处理
                                    // 可以根据需要添加更多类型 case 'ppt': case 'doc': ...
                                        markdownContent += `*文件:* [${block.fileName || '未知文件'}](${block.url || '#'}) (类型: ${block.type})\n\n`;
                                        break;
                                    default:
                                        // Skip unknown types silently
                                }
                            });
                        }
                    });
                }
            } else {
                // 其他发言者
                markdownContent += `\n## ${turn.speaker || '未知发言者'} (轮次 ${index})\n`;
                markdownContent += `*时间: ${timestamp}*\n\n`;
                markdownContent += `*无法识别的内容*\n`;
            }
            // 每轮之间的分隔符
            markdownContent += '\n---\n';
        });

        // 移除末尾多余的分隔符
        if (markdownContent.endsWith('\n---\n')) {
             markdownContent = markdownContent.slice(0, markdownContent.length - 5).trimEnd();
        }

        return markdownContent.trim();
    }


    // --- Network Interception --- (保持不变)

    function processYuanbaoResponse(text, url) {
        if (!url || !url.includes('/api/user/agent/conversation/v1/detail')) {
            return;
        }
        try {
            if (text && text.includes('"convs":') && text.includes('"createTime":')) {
                const responseSize = text.length;
                state.latestDetailResponse = text;
                state.latestResponseSize = responseSize;
                state.latestResponseUrl = url;
                state.lastUpdateTime = new Date().toLocaleTimeString();
                updateButtonsStatus();
                log.info(`捕获到元宝对话详情响应 (${(responseSize / 1024).toFixed(2)} KB)`);
            } else {
                log.info(`捕获到响应，但似乎不是有效的对话详情格式: ${url}`);
            }
        } catch (e) {
            log.error(`处理响应时出错 (${url}):`, e);
        }
    }

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        let response;
        try {
             response = await originalFetch.apply(this, args);
             if (typeof url === 'string' && url.includes('/api/user/agent/conversation/v1/detail')) {
                 const clonedResponse = response.clone();
                 clonedResponse.text().then(text => {
                     processYuanbaoResponse(text, url);
                 }).catch(e => {
                     log.error(`解析fetch响应文本时出错 (${url}):`, e);
                 });
             }
        } catch (error) {
             log.error('Fetch request failed:', error);
             throw error;
        }
        return response;
    };


    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    const xhrUrlMap = new WeakMap();

    XMLHttpRequest.prototype.open = function(method, url) {
        xhrUrlMap.set(this, url);
        if (typeof url === 'string' && url.includes('/api/user/agent/conversation/v1/detail')) {
            this.addEventListener('load', function() {
                if (this.readyState === 4 && this.status === 200) {
                    const requestUrl = xhrUrlMap.get(this);
                    try {
                        processYuanbaoResponse(this.responseText, requestUrl);
                    } catch (e) {
                        log.error('处理XHR响应时出错:', e);
                    }
                } else if (this.readyState === 4) {
                     log.error(`XHR 请求失败，状态: ${this.status}`, xhrUrlMap.get(this));
                }
            });
            this.addEventListener('error', function() {
                log.error('XHR 网络错误:', xhrUrlMap.get(this));
            });
        }
        return originalXhrOpen.apply(this, arguments);
    };

     XMLHttpRequest.prototype.send = function() {
         return originalXhrSend.apply(this, arguments);
     };


    // --- UI Buttons --- (保持不变)

    function updateButtonsStatus() {
        const jsonButton = document.getElementById('downloadYuanbaoJsonButton');
        const mdButton = document.getElementById('downloadYuanbaoMdButton');

        [jsonButton, mdButton].forEach(button => {
            if (button) {
                button.disabled = !state.latestDetailResponse;
                button.style.backgroundColor = state.latestDetailResponse ? '#28a745' : '#cccccc';
                button.style.cursor = state.latestDetailResponse ? 'pointer' : 'not-allowed';
                button.title = state.latestDetailResponse
                    ? `最后捕获时间: ${state.lastUpdateTime}\n大小: ${(state.latestResponseSize / 1024).toFixed(2)}KB`
                    : '等待捕获元宝对话详情... (请打开一个具体对话)';
            }
        });
    }

    function createDownloadButtons() {
        const existingJsonBtn = document.getElementById('downloadYuanbaoJsonButton');
        const existingMdBtn = document.getElementById('downloadYuanbaoMdButton');
        if (existingJsonBtn) existingJsonBtn.remove();
        if (existingMdBtn) existingMdBtn.remove();

        const buttonStyles = {
            position: 'fixed',
            top: '100px',
            right: '10px',
            zIndex: '10001',
            padding: '8px 12px',
            backgroundColor: '#cccccc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'not-allowed',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            fontFamily: 'Arial, sans-serif',
            fontSize: '13px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            opacity: '0.9'
        };

        const jsonButton = document.createElement('button');
        jsonButton.id = 'downloadYuanbaoJsonButton';
        jsonButton.innerText = '下载JSON';
        Object.assign(jsonButton.style, buttonStyles);

        const mdButton = document.createElement('button');
        mdButton.id = 'downloadYuanbaoMdButton';
        mdButton.innerText = '下载MD';
        Object.assign(mdButton.style, buttonStyles);
        mdButton.style.top = '145px';

        [jsonButton, mdButton].forEach(button => {
            button.onmouseover = () => { if (!button.disabled) button.style.opacity = '1'; };
            button.onmouseout = () => { if (!button.disabled) button.style.opacity = '0.9'; };
        });

        function triggerDownload(blob, fileName) {
             const link = document.createElement('a');
             link.href = URL.createObjectURL(blob);
             link.download = fileName;
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
             URL.revokeObjectURL(link.href);
        }

        jsonButton.onclick = function() {
            if (!state.latestDetailResponse) {
                alert('尚未捕获到元宝对话详情数据。\n请确保您已打开一个具体的对话页面，并等待数据加载。');
                return;
            }
            try {
                const jsonData = JSON.parse(state.latestDetailResponse);
                const title = "元宝 - " + (jsonData.sessionTitle || jsonData.title || 'Yuanbao对话').replace(/[/\\?%*:|"<>]/g, '-');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                const fileName = `${title}_${timestamp}.json`;
                const blob = new Blob([state.latestDetailResponse], { type: 'application/json;charset=utf-8' });
                triggerDownload(blob, fileName);
                log.info(`成功触发JSON文件下载: ${fileName}`);
            } catch (e) {
                log.error('下载JSON过程中出错:', e);
                alert('下载JSON过程中发生错误，捕获的数据可能不是有效的JSON。请查看控制台了解详情。');
            }
        };

        mdButton.onclick = function() {
            if (!state.latestDetailResponse) {
                alert('尚未捕获到元宝对话详情数据。\n请确保您已打开一个具体的对话页面，并等待数据加载。');
                return;
            }
            try {
                const jsonData = JSON.parse(state.latestDetailResponse);
                // Use the final conversion function
                const markdownContent = convertYuanbaoJsonToMarkdown(jsonData);

                if (markdownContent.startsWith('# 错误')) {
                     alert('Markdown 生成失败，请检查控制台日志。');
                     log.error('Markdown generation failed.');
                     return;
                }

                const title = "元宝 - " + (jsonData.sessionTitle || jsonData.title || 'Yuanbao对话').replace(/[/\\?%*:|"<>]/g, '-');
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                const fileName = `${title}_${timestamp}.md`;
                const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
                triggerDownload(blob, fileName);
                log.info(`成功触发MD文件下载: ${fileName}`);
            } catch (e) {
                log.error('下载MD过程中出错:', e);
                alert('下载MD过程中发生错误，可能是JSON解析或Markdown转换失败。请查看控制台了解详情。');
            }
        };

        document.body.appendChild(jsonButton);
        document.body.appendChild(mdButton);
        updateButtonsStatus();
        log.info('导出按钮已创建');
    }

    // --- Initialization --- (保持不变)

    function initializeScript() {
        if (document.body) {
            createDownloadButtons();
             const observer = new MutationObserver((mutationsList, observer) => {
                  if (!document.getElementById('downloadYuanbaoJsonButton') || !document.getElementById('downloadYuanbaoMdButton')) {
                      log.info('检测到按钮丢失 (可能由于页面导航)，正在重新创建...');
                      createDownloadButtons();
                  }
             });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            log.info('元宝对话导出脚本已启动并监听');
        } else {
            setTimeout(initializeScript, 500);
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

})();