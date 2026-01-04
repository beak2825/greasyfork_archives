// ==UserScript==
// @name         AI对话导出word/json/md - DeepSeek/纳米/腾讯元宝/Kimi/通义千问/讯飞星火/豆包
// @namespace    http://tampermonkey.net/
// @version      2025.9.25-1
// @description  支持DeepSeek，纳米AI,腾讯元宝,kimi，通义千问和讯飞星火的对话导出功能，支持JSON、Markdown和word格式，豆包中的图片也能保存
// @author       各位大神 + deepseek + 春秋
// @match        *://chat.deepseek.com/*
// @match        *://bot.n.cn/*
// @match        *://yuanbao.tencent.com/*
// @match        *://*.kimi.com/*
// @match        *://*.tongyi.com/*
// @match        *://*.xfyun.cn/*
// @match        *://*.doubao.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542188/AI%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BAwordjsonmd%20-%20DeepSeek%E7%BA%B3%E7%B1%B3%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9DKimi%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%E8%B1%86%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/542188/AI%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BAwordjsonmd%20-%20DeepSeek%E7%BA%B3%E7%B1%B3%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9DKimi%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E8%AE%AF%E9%A3%9E%E6%98%9F%E7%81%AB%E8%B1%86%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('🚀 脚本开始加载', new Date().toISOString());

    // 配置常量
    const CONFIG = {
        API_ENDPOINT_WORD: 'https://api.any2card.com/api/md-to-word',
        DEFAULT_TITLE: '未命名对话',
        BUTTON_OPACITY: 0.3,
        BUTTON_HOVER_OPACITY: 1,
        SPINNER_ANIMATION_DURATION: '1s',
        REL_AND_KNOWLEDGE: false // 默认值为false，表示默认不导出参考链接和知识库
    };

    // 平台URL模式
    const PLATFORM_PATTERNS = {
        deepseek: /chat_session_id=/,
        ncn: /conversation\/info\?conversation_id=/,
        yuanbao: /\/api\/user\/agent\/conversation\/v1\/detail/,
        kimi:  /(\/apiv2\/kimi\.chat\.v1\.ChatService\/ListMessages|\/api\/chat\/[^\/]+\/messages|\/api\/chat|chat_session_id)/,///\/apiv2\/kimi\.chat\.v1\.ChatService\/ListMessages/
        kimi_title: /\/apiv2\/kimi\.chat\.v1\.ChatService\/GetChat/,//kimi标题信息API
        tongyi: /\/dialog\/chat\/list/,
        iflytek: /\/iflygpt\/u\/chat_history\/all\//,
        doubao:/\/im\/chain\/single/, //过期alice\/message\/list/
        doubao_title:/\/im\/conversation\/info/ // 豆包标题会话信息API
    };

    // 状态管理
    const state = {
        targetResponse: null,
        lastUpdateTime: null,
        convertedMd: null,
        platformType: null,
        messageStats: {
            totalTokens: 0,
            totalChars: 0,
            fileCount: 0,
            questions: 0,
            convTurns: 0
        },
        currentTitle: CONFIG.DEFAULT_TITLE,
        kimiSessionId: null,
        kimiTitleCache: null,
        authToken: null
    };

    // 日志工具
    const logger = {
        info: (msg, data) => console.log(`[AI对话导出] INFO: ${msg}`, data || ''),
        warn: (msg, data) => console.warn(`[AI对话导出] WARN: ${msg}`, data || ''),
        error: (msg, error) => console.error(`[AI对话导出] ERROR: ${msg}`, error || '')
    };

    // 工具函数
    const utils = {
        formatTimestamp: (timestamp) => {
            if (!timestamp) return 'N/A';
            let dt;
            try {
                // 1. 检查是否是数字（Unix 时间戳） const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
                if (typeof timestamp === 'number') {
                    // 判断是秒级还是毫秒级（通常毫秒级时间戳 >= 1e12）
                    dt = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
                }
                // 2. 检查是否是字符串（ISO 8601 或类似格式）
                else if (typeof timestamp === 'string') {
                    //dt = new Date(timestamp);
                    dt = new Date(parseInt(timestamp) < 1e12 ? parseInt(timestamp) * 1000 : parseInt(timestamp));
                }
                // 3. 其他情况（如已经是 Date 对象）
                else {
                    dt = new Date(timestamp);
                }

                // 检查日期是否有效
                if (isNaN(dt.getTime())) {
                    return 'Invalid Date';
                }

                // 使用瑞典格式 (YYYY-MM-DD HH:MM:SS) 并替换特殊字符
                return dt.toLocaleString('sv').replace(/[T \/]/g, '_');
            } catch (e) {
                logger.error('时间戳格式化错误', e);
                return 'Invalid Date';
            }
        },

        adjustHeaderLevels: (text, increaseBy = 1) => {
            if (!text) return '';
            return text.replace(/^(#+)(\s*)(.*?)\s*$/gm, (match, hashes, space, content) => {
                return '#'.repeat(hashes.length + increaseBy) + ' ' + content.trim();
            });
        },

        getLocalTimestamp: () => {
            const d = new Date();
            const offset = d.getTimezoneOffset() * 60 * 1000;
            return new Date(d.getTime() - offset).toISOString()
                .slice(0, 19)
                .replace(/T/g, '_')
                .replace(/:/g, '-');
        },

        sanitizeFilename: (name) => {
            return name.replace(/[\/\\?%*:|"<>]/g, '-');
        },

        createBlobDownload: (content, type, filename) => {
            try {
                const blob = new Blob([content], { type });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                return true;
            } catch (e) {
                logger.error('创建Blob下载失败', e);
                return false;
            }
        }
    };

    // 平台特定的转换器
    const platformConverters = {
        deepseek: (data) => {
            let mdContent = [];
            // 1. 安全的数据访问
            const bizData = data?.data?.biz_data || {};
            const chatSession = bizData.chat_session || {};
            const chatMessages = bizData.chat_messages || [];

            const title = chatSession.title || CONFIG.DEFAULT_TITLE;
            const totalTokens = chatMessages.reduce((acc, msg) =>
                                                    acc + (msg.accumulated_token_usage || 0), 0);

            // 2. 标题和统计信息
            mdContent.push(`# DeepSeek对话 - ${title}`);
            mdContent.push(`\n> 统计信息：累计Token用量 ${totalTokens}`);
            mdContent.push(`> 生成时间：${new Date().toLocaleString()}\n`);

            // 3. 处理消息
            chatMessages.forEach((msg,index) => {
                if (msg.role === 'USER') return; // 跳过用户消息

                const role = msg.role === 'ASSISTANT' ? 'Assistant' : 'Human';
                const timestamp = utils.formatTimestamp(msg.inserted_at);

                mdContent.push(`## ${role}`);
                mdContent.push(`*${timestamp}*\n`);

                // 4. 处理文件信息
                if (msg.files?.length > 0) {
                    mdContent.push('### 文件信息');
                    msg.files.forEach(file => {
                        mdContent.push(`- 名称: ${file.file_name}`);
                        mdContent.push(`- 大小: ${(file.file_size / 1024).toFixed(1)}KB`);
                        mdContent.push(`- Token用量: ${file.token_usage}`);
                    });
                    mdContent.push('');
                }

                // 5. 处理消息片段（思考过程和回复内容）
                let content = '';
                let thinkingContent = '';

                if (msg.fragments?.length > 0) {
                    const citations = {};
                    msg.fragments.forEach(fragment => {
                        if (fragment.cite_index !== null) {
                            citations[fragment.cite_index] = fragment.url;
                        }

                        switch (fragment.type) {
                            case 'THINK':
                                thinkingContent += fragment.content + '\n';
                                break;
                            case 'RESPONSE':
                                content += fragment.content + '\n';
                                break;
                            case 'TIP':
                                content += `\n> 💡 ${fragment.content}\n`;
                                break;
                            case 'REQUEST':
                                content += fragment.content + '\n';
                                break;
                        }
                    });
                    content = content.replace(/\[citation:(\d+)\]/g, (match, p1) => {
                        const url = citations[parseInt(p1)];
                        return url ? ` [${p1}](${url})` : match;
                    });
                    // 重要的空格处理（避免公式中的空格问题）
                    content = content.replace(/\s+,/g, ',').replace(/\s+\./g, '.');
                }

                // 6. 添加思考过程（如果存在）
                if (thinkingContent.trim()) {
                    const thinkFragment = msg.fragments.find(f => f.type === 'THINK');
                    const thinkTime = thinkFragment?.elapsed_secs ? `(${thinkFragment.elapsed_secs.toFixed(1)}s)` : '';
                    content += `\n**思考过程 ${thinkTime}:**\n${thinkingContent.trim()}\n`;
                }

                // 7. 数学公式格式化 - 智能处理
                content = content.replace(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$.*?\$\$)/g, (match) => {
                    // 提取公式内容（移除各种边界符号）
                    let formula = match.replace(/^\\\(|\\\)$|^\\\[|\\\]$|\$\$/g, '');

                    // 转换为单行
                    formula = formula.replace(/\s+/g, ' ').trim();

                    // 返回统一的 $...$ 格式
                    return `$${formula}$`;
                });

                mdContent.push(content.trim() + '\n');
                mdContent.push('---\n');
            });
            return mdContent.join('\n');
        },

        ncn: (data) => {
            let mdContent = [];
            const meta = data.data || {};
            mdContent.push(`# 纳米AI对话记录 - ${meta.title || CONFIG.DEFAULT_TITLE}`);
            mdContent.push(`**生成时间**: ${utils.formatTimestamp(data.timestamp) || '未知'}`);


            const totalChars = meta.messages?.reduce((acc, msg) =>
                acc + (msg.result?.length || 0), 0) || 0;
            const questions = meta.messages?.reduce((acc, msg) =>
                acc + (msg.ask_further?.length || 0), 0) || 0;

            mdContent.push(`\n> 统计信息：总字数 ${totalChars} | 后续问题 ${questions} 个`);

            meta.messages?.forEach(msg => {
                if (msg.file?.length) {
                    mdContent.push('### 附件信息');
                    msg.file.forEach(file => {
                        mdContent.push(`- ${file.title} (${(file.size / 1024).toFixed(1)}KB)`);
                    });
                }

                // 用户提问和AI回复
                mdContent.push(`\n## 用户提问\n${msg.prompt || '无内容'}`);
                // 处理AI回复内容，移除引用标记
                let cleanResult = msg.result || '无内容';
                // 移除类似[[3]()][[7]()]的引用标记
                cleanResult = cleanResult.replace(/\[\[\d+\]\(\)\]/g, '');
                // 移除多余的换行和空格
                cleanResult = cleanResult.replace(/\n{3,}/g, '\n').trim();
                mdContent.push(`\n## AI回复\n${cleanResult}`);
                //mdContent.push(`## AI回复\n${msg.result || '无内容'}`);

                // 推荐追问
                if (msg.ask_further?.length) {
                    mdContent.push('### 推荐追问');
                    msg.ask_further.forEach(q => {
                        mdContent.push(`- ${q.content}`);
                    });
                }

                //是否需要导出，通过全局配置进行选择
                if(CONFIG.REL_AND_KNOWLEDGE){
                    // 参考链接
                    if (msg.refer_search?.length) {
                        mdContent.push('\n### 参考来源');
                        msg.refer_search.forEach(ref => {
                            mdContent.push(`- [${ref.title || '无标题'}](${ref.url}) - ${ref.summary || '无摘要'}`);
                            if (ref.date) mdContent.push(`  - 发布日期: ${ref.date}`);
                            if (ref.site) mdContent.push(`  - 来源网站: ${ref.site}`);
                        });
                    }

                    // 用户知识库引用
                    if (msg.user_knowledge?.length) {
                        mdContent.push('\n### 知识库引用');
                        const uniqueFiles = new Map();
                        msg.user_knowledge.forEach(knowledge => {
                            if (knowledge.file_name && !uniqueFiles.has(knowledge.file_id)) {
                                uniqueFiles.set(knowledge.file_id, knowledge);
                                mdContent.push(`- ${knowledge.file_name} (来自文件夹: ${knowledge.folder_id || '未知'})`);
                            }
                        });
                    }
                }

                mdContent.push('\n---\n');
            });
            return mdContent.join('\n');
        },

        yuanbao: (data) => {
            if (!data?.convs || !Array.isArray(data.convs)) {
                logger.error('无效的元宝数据', data);
                return '# 错误：无效的JSON数据\n\n无法解析对话内容。';
            }

            let markdownContent = [];
            const title = data.sessionTitle || data.title || '元宝对话记录';
            markdownContent.push(`# ${title}\n`);

            if (data.multiMediaInfo?.length > 0) {
                markdownContent.push('**包含的多媒体文件:**\n');
                data.multiMediaInfo.forEach(media => {
                    markdownContent.push(`* [${media.fileName || '未知文件'}](${media.url || '#'}) (${media.type || '未知类型'})\n`);
                });
                markdownContent.push('---\n');
            }

            const sortedConvs = [...data.convs].sort((a, b) => (a.index || 0) - (b.index || 0));

            sortedConvs.forEach(turn => {
                if (turn.speaker === 'human') return;

                const timestamp = utils.formatTimestamp(turn.createTime);
                const index = turn.index !== undefined ? turn.index : 'N/A';

                if (turn.speaker === 'ai') {
                    markdownContent.push(`\n## AI (轮次 ${index})\n`);

                    let modelDisplay = '未知模型';
                    let primaryPluginId = '无插件';

                    if (turn.speechesV2?.length > 0) {
                        const firstSpeech = turn.speechesV2[0];
                        const modelIdRaw = firstSpeech.chatModelId;
                        primaryPluginId = firstSpeech.pluginId || primaryPluginId;

                        if (modelIdRaw && String(modelIdRaw).trim() !== '') {
                            modelDisplay = `\`${modelIdRaw}\``;
                        }
                    }

                    markdownContent.push(`*时间: ${timestamp} | 模型: ${modelDisplay} | 插件: \`${primaryPluginId}\`*\n\n`);

                    turn.speechesV2?.forEach(speech => {
                        speech.content?.forEach(block => {
                            switch (block.type) {
                                case 'text':
                                    markdownContent.push(`${utils.adjustHeaderLevels(block.msg || '', 1)}\n\n`);
                                    break;
                                case 'think':
                                    markdownContent.push(`> **[思考过程]** ${block.title || ''}\n>\n`);
                                    (block.content || '无思考内容').split('\n').forEach(line => {
                                        markdownContent.push(`> ${line}\n`);
                                    });
                                    markdownContent.push('\n');
                                    break;
                                case 'searchGuid':
                                    markdownContent.push(`**${block.title || '搜索结果'}** (查询: \`${block.botPrompt || 'N/A'}\` | 主题: ${block.topic || 'N/A'})\n`);
                                    block.docs?.forEach((doc, docIndex) => {
                                        markdownContent.push(`* [${docIndex + 1}] [${doc.title || '无标题'}](${doc.url || '#'}) (${doc.sourceName || '未知来源'})\n    * > ${doc.quote || '无引用'}\n`);
                                    });
                                    markdownContent.push('\n');
                                    break;
                                case 'image':
                                case 'code':
                                case 'pdf':
                                    markdownContent.push(`*文件:* [${block.fileName || '未知文件'}](${block.url || '#'}) (类型: ${block.type})\n\n`);
                                    break;
                            }
                        });
                    });
                }
                markdownContent.push('\n---\n');
            });

            return markdownContent.join('\n').replace(/\n---\n$/, '').trim();
        },

        kimi: async (data) => {
            let mdContent = [];
            const title = await fetchKimiChatTitle() || 'Kimi对话记录';
            //const title = state.currentTitle || 'Kimi对话记录';
            mdContent.push(`# ${title}\n`);

            // 处理消息数组
            data.messages?.forEach((message, index) => {
                const role = message.role === 'user' ? '👤 用户' : '🤖 Kimi';
                const timestamp = utils.formatTimestamp(message.createTime);

                mdContent.push(`## ${role} - ${timestamp}\n`);

                // 处理blocks中的内容
                message.blocks?.forEach(block => {
                    if (block.text?.content) {
                        // 文本内容
                        mdContent.push(block.text.content + '\n');
                    } else if (block.artifact) {
                        // 特殊内容（如PPT、文件等）
                        if (block.artifact.type === 'ARTIFACT_TYPE_SLIDES_JSON') {
                            mdContent.push('### 📊 生成的PPT内容\n');
                            try {
                                const slidesData = JSON.parse(block.artifact.content);
                                mdContent.push(`**标题:** ${slidesData.outline?.pptTitle || '无标题'}\n`);
                                mdContent.push(`**页数:** ${slidesData.outline?.slidesCount || 0}\n`);
                                // 可以进一步解析PPT内容
                            } catch (e) {
                                mdContent.push('*[PPT内容解析失败]*\n');
                            }
                        }
                    } else if (block.slidesView) {
                        // 幻灯片视图信息
                        mdContent.push(`### 🎨 幻灯片视图\n`);
                        mdContent.push(`- 名称: ${block.slidesView.name}\n`);
                        mdContent.push(`- 状态: ${block.slidesView.status}\n`);
                        if (block.slidesView.coverUrl) {
                            mdContent.push(`- 封面: ![封面](${block.slidesView.coverUrl})\n`);
                        }
                    }
                });

                mdContent.push('\n---\n');
            });

            return mdContent.join('\n');
        },

        tongyi: (data) => {
            let mdContent = [];
            mdContent.push(`# 通义千问对话记录`);

            const convTurns = data.data?.length || 0;
            const totalChars = data.data?.reduce((acc, msg) => {
                return acc + (msg.contents?.reduce((sum, content) => {
                    if (content.contentType === 'text' && content.content) {
                        return sum + content.content.length;
                    } else if (content.contentType === 'plugin' && content.content) {
                        // 计算插件内容中的文本长度
                        try {
                            const pluginData = JSON.parse(content.content);
                            if (pluginData.pluginCall) {
                                const callData = JSON.parse(pluginData.pluginCall);
                                return sum + (callData.prompt?.length || 0);
                            }
                        } catch (e) {
                            return sum;
                        }
                    }
                    return sum;
                }, 0) || 0);
            }, 0) || 0;

            mdContent.push(`\n> 统计信息：对话轮次 ${convTurns} | 总字数 ${totalChars}`);

            if (data.data?.length) {
                const sortedMessages = [...data.data].sort((a, b) => a.createTime - b.createTime);

                sortedMessages.forEach(msg => {
                    const time = utils.formatTimestamp ? utils.formatTimestamp(msg.createTime) :
                new Date(msg.createTime).toLocaleString();
            const role = msg.senderType === 'USER' ? '用户' : '助手';
            mdContent.push(`## ${role} (${time})\n`);

            msg.contents?.forEach(content => {
                if (content.content) {
                    if (content.contentType === 'text') {
                        // 处理普通文本
                        let text = content.content.replace(/\n/g, '\n\n');
                        text = text.replace(/```([\s\S]*?)```/g, '\n```$1```\n');
                        mdContent.push(text);
                    } else if (content.contentType === 'plugin') {
                        // 处理插件内容（文生图等）
                        try {
                            const pluginData = JSON.parse(content.content);
                            mdContent.push('### 插件调用信息');

                            if (pluginData.pluginCall) {
                                const callData = JSON.parse(pluginData.pluginCall);
                                mdContent.push(`**功能：** ${callData.toolName || '未知'}`);
                                mdContent.push(`**提示词：** ${callData.prompt || '无'}`);
                                mdContent.push(`**尺寸：** ${callData.size || '未指定'}`);
                            }

                            if (pluginData.pluginResult?.taskResult?.wanx_text_to_image?.imageList) {
                                const images = pluginData.pluginResult.taskResult.wanx_text_to_image.imageList;
                                mdContent.push('### 生成的图片');
                                images.forEach((img, index) => {
                                    mdContent.push(`**图片 ${index + 1}：**`);
                                    mdContent.push(`- 分辨率：${img.resolution}`);
                                    mdContent.push(`- 状态：${img.isSecurity ? '安全' : '待审核'}`);
                                    mdContent.push(`- 预览：![](${img.resizeUrl})`);
                                    mdContent.push(`- 原图：[点击下载](${img.url})`);
                                });
                            }

                            if (pluginData.pluginResult?.status) {
                                mdContent.push(`**任务状态：** ${pluginData.pluginResult.status}`);
                            }
                        } catch (e) {
                            mdContent.push('`[插件内容解析错误]`');
                        }
                    }
                }
            });
            mdContent.push('\n---\n');
        });
    } else {
        mdContent.push('\n暂无对话内容');
    }
            return mdContent.join('\n');
        },

        iflytek: (data) => {
            let mdContent = [];
            mdContent.push(`# 讯飞星火对话记录`);

            const convTurns = data.data?.[0]?.historyList?.length || 0;
            const totalChars = data.data?.[0]?.historyList?.reduce((acc, msg) => {
                return acc + (msg.message?.length || 0) + (msg.answer?.length || 0);
            }, 0) || 0;

            mdContent.push(`\n> 统计信息：对话轮次 ${convTurns} | 总字数 ${totalChars}`);

            data.data?.[0]?.historyList?.forEach(msg => {
                if (msg.type === 0) {
                    const time = utils.formatTimestamp(msg.createTime);
                    mdContent.push(`## 用户 (${time})\n\n${msg.message}\n`);
                } else if (msg.message) {
                    const time = utils.formatTimestamp(msg.createTime);
                    let sourceInfo = '';

                    if (msg.traceSource) {
                        try {
                            const sources = JSON.parse(msg.traceSource);
                            if (Array.isArray(sources)) {
                                sources.forEach(source => {
                                    if (source.type === 'searchSource' && source.data) {
                                        sourceInfo += '\n\n**参考来源**:\n';
                                        source.data.forEach(item => {
                                            sourceInfo += `- [${item.docid}](${item.source})\n`;
                                        });
                                    }
                                });
                            }
                        } catch (e) {
                            logger.error('解析来源信息失败', e);
                        }
                    }

                    mdContent.push(`## AI助手 (${time})\n\n${msg.message}${sourceInfo}\n`);
                }
                mdContent.push('---\n');
            });

            return mdContent.join('\n');
        },
        // 豆包消息转换
        doubao: (data) => {
            let mdContent = [];
            //const title = data.downlink_body?.get_conv_info_downlink_body?.conversation_info?.name||'豆包对话记录';
            const title = state.currentTitle || '豆包对话记录';

            // 获取正确的消息数组
            const messages = data.downlink_body?.pull_singe_chain_downlink_body?.messages || [];

            mdContent.push(`# ${title}\n`);

            // 统计信息
            const totalMessages = messages.length;
            let totalChars = 0;

            // 处理消息内容 - 按时间正序排列
            const sortedMessages = [...messages].sort((a, b) => a.create_time - b.create_time);

            sortedMessages.forEach(msg => {
                const time = utils.formatTimestamp(msg.create_time);
                const role = msg.user_type === 1 ? '用户' : '豆包AI';

                mdContent.push(`## ${role} (${time})`);

                // 处理消息内容
                let content = '';
                let messageChars = 0;

                try {
                    if (msg.content_type === 1) { // 用户文本消息
                        const contentObj = typeof msg.content === 'string' ? JSON.parse(msg.content || '{}') : msg.content;
                        content = contentObj.text || JSON.stringify(contentObj) || '';
                        messageChars = content.length;

                    } else if (msg.content_type === 9999) { // AI复合消息
                        // 方法1: 解析content字段（JSON数组）
                        if (msg.content) {
                            const contentArray = typeof msg.content === 'string' ? JSON.parse(msg.content || '[]') : msg.content;
                            if (Array.isArray(contentArray)) {
                                contentArray.forEach(item => {
                                    if (item.block_type === 10000 && item.content?.text_block?.text) {
                                        // 文本块
                                        content += item.content.text_block.text + '\n\n';
                                        messageChars += item.content.text_block.text.length;
                                    } else if (item.block_type === 2074 && item.content?.creation_block) {
                                        // 图片块
                                        const mediaContent = platformConverters.processDoubaoMediaContent(item);
                                        content += mediaContent + '\n\n';
                                    }
                                });
                            }
                        }

                        // 方法2: 使用content_block（如果存在）
                        if (!content.trim() && msg.content_block?.length) {
                            msg.content_block.forEach(block => {
                                if (block.block_type === 10000 && block.content?.text_block?.text) {
                                    content += block.content.text_block.text + '\n\n';
                                    messageChars += block.content.text_block.text.length;
                                } else if (block.block_type === 2074) {
                                    const mediaContent = platformConverters.processDoubaoMediaContent(block);
                                    content += mediaContent + '\n\n';
                                }
                            });
                        }
                    }

                    totalChars += messageChars;

                } catch (e) {
                    console.error('解析消息内容失败', e);
                    content = `解析错误: ${e.message}`;
                }

                // 清理内容格式
                content = content.replace(/```([\s\S]*?)```/g, '\n```$1```\n')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();

                mdContent.push(content || '（无内容）');
                mdContent.push('\n---\n');
            });

            // 插入统计信息到合适位置
            if (mdContent.length > 1) {
                mdContent.splice(1, 0, `> 统计信息：消息数 ${totalMessages} | 总字数 ${totalChars}\n`);
            }

            return mdContent.join('\n');
        },

        // 处理豆包的媒体内容 - 修正版本
        processDoubaoMediaContent: (blockOrMsg) => {
            let content = [];

            try {
                let contentObj;
                if (blockOrMsg.content && typeof blockOrMsg.content === 'string') {
                    contentObj = JSON.parse(blockOrMsg.content);
                } else {
                    contentObj = blockOrMsg.content || {};
                }

                // 从creation_block或直接获取creations
                const creations = contentObj.creation_block?.creations || contentObj.creations || [];

                creations.forEach(creation => {
                    if (creation.type === 1 && creation.image) {
                        const img = creation.image;

                        // 获取图片URL（按优先级）
                        const imageUrl = img.image_ori_raw?.url || img.image_raw?.url ||
                              img.image_ori?.url || img.image_preview?.url;

                        if (imageUrl) {
                            content.push(`![${img.description || 'AI生成图片'}](${imageUrl})`);

                            // 添加生成信息
                            if (img.gen_params?.prompt) {
                                content.push(`**提示词:** ${img.gen_params.prompt}`);
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('处理媒体内容失败', e);
                content.push('*[图片内容解析失败]*');
            }

            return content.join('\n\n');
        } ,
        // 豆包聊天列表转换器
        doubao_chat: (data) => {
            let mdContent = [];
            mdContent.push(`# 豆包对话列表\n`);

            // 统计信息
            const totalChats = data.data?.length || 0;
            mdContent.push(`> 统计信息：共 ${totalChats} 个对话\n`);

            // 处理对话列表
            data.data?.forEach(chat => {
                const time = utils.formatTimestamp(chat.create_time);
                mdContent.push(`## ${chat.title || '未命名对话'} (${time})`);
                mdContent.push(`- 对话ID: ${chat.conversation_id}`);
                mdContent.push(`- 最后更新时间: ${new Date(chat.update_time * 1000).toLocaleString()}`);
                mdContent.push(`- 消息数: ${chat.message_count || 0}`);
                mdContent.push('\n---\n');
            });

            return mdContent.join('\n');
        }

    };

    // 核心处理函数
    async function processTargetResponse(text, url) {
        try {
            //console.log('=== 开始处理响应 ===');
            //console.log('URL:', url);
            //console.log('响应长度:', text.length);

            let detectedPlatform = null;
            for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
                if (pattern.test(url)) {
                    detectedPlatform = platform;
                    break;
                }
            }
            //console.log(detectedPlatform);

            if (!detectedPlatform) {
                console.log('未匹配到任何平台，退出处理');
                return;
            }

/*              if (detectedPlatform==='kimi') {
                text = await fetchkimiMessage();

            } */

            state.targetResponse = text;
            state.platformType = detectedPlatform;
            state.lastUpdateTime = new Date().toLocaleTimeString();

            // 重置统计信息
            state.messageStats = {
                totalTokens: 0,
                totalChars: 0,
                fileCount: 0,
                questions: 0,
                convTurns: 0
            };

            const jsonData = JSON.parse(text);
            const match = url.match(/(\/apiv2\/kimi\.chat\.v1\.ChatService\/ListMessages|\/api\/chat\/[^\/]+\/messages|\/api\/chat|chat_session_id)/);//Kimi标题

            // 平台特定处理
            switch(detectedPlatform) {
                case 'deepseek':
                    state.convertedMd = platformConverters.deepseek(jsonData);
                    state.messageStats.totalTokens = jsonData.data?.biz_data?.chat_messages?.reduce(
                        (acc, msg) => acc + (msg.accumulated_token_usage || 0), 0) || 0;
                    state.currentTitle = jsonData.data?.biz_data?.chat_session?.title || 'deepseek-Chat';
                    break;

                case 'ncn':
                    state.convertedMd = platformConverters.ncn(jsonData);
                    state.messageStats.totalChars = jsonData.data?.messages?.reduce(
                        (acc, msg) => acc + (msg.result?.length || 0), 0) || 0;
                    state.messageStats.questions = jsonData.data?.messages?.reduce(
                        (acc, msg) => acc + (msg.ask_further?.length || 0), 0) || 0;
                    state.currentTitle = jsonData.data?.title || 'AI-Chat';
                    break;

                case 'yuanbao':
                    state.convertedMd = platformConverters.yuanbao(jsonData);
                    state.messageStats.convTurns = jsonData.convs?.length || 0;
                    state.currentTitle = jsonData.sessionTitle || jsonData.title || 'Yuanbao-Chat';
                    state.messageStats.fileCount = jsonData.multiMediaInfo?.length || 0;
                    break;

                case 'kimi':
                case 'kimi_title':
                    if (match?.[1]) {
                        state.kimiSessionId = match[1];
                        state.currentTitle = await fetchKimiChatTitle();
                        //console.log('测试Kimi_case');
                    }
                     //console.log('测试Kimicase_title');
                    // 如果是标题API，只更新标题不处理内容
                    if (state.platformType === 'kimi_title') {
                        state.currentTitle = jsonData.chat?.name || 'kimi对话';
                        logger.info(`更新kimi标题: ${state.currentTitle}`);
                        return; // 标题API不需要处理消息内容
                    }
                    state.convertedMd = await platformConverters.kimi(jsonData);
                    state.messageStats.totalChars = jsonData.messages?.reduce(
                        (acc, item) => acc + (JSON.stringify(item.contents).length || 0), 0) || 0;
                    break;

                case 'tongyi':
                    state.convertedMd = platformConverters.tongyi(jsonData);
                    state.messageStats.convTurns = jsonData.data?.length || 0;
                    state.messageStats.totalChars = jsonData.data?.reduce((acc, msg) => {
                        return acc + (msg.contents?.reduce(
                            (sum, content) => sum + (content.content?.length || 0), 0) || 0);
                    }, 0) || 0;
                    state.currentTitle = '通义千问对话';
                    break;

                case 'iflytek':
                    state.convertedMd = platformConverters.iflytek(jsonData);
                    state.messageStats.convTurns = jsonData.data?.[0]?.historyList?.length || 0;
                    state.messageStats.totalChars = jsonData.data?.[0]?.historyList?.reduce((acc, msg) => {
                        return acc + (msg.message?.length || 0) + (msg.answer?.length || 0);
                    }, 0) || 0;
                    state.currentTitle = '讯飞星火对话';
                    break;
                case 'doubao':
                case 'doubao_title':
                    // 如果是标题API，只更新标题不处理内容
                    if (state.platformType === 'doubao_title') {
                        state.currentTitle = jsonData.downlink_body?.get_conv_info_downlink_body?.conversation_info?.name || '豆包对话';
                        logger.info(`更新豆包标题: ${state.currentTitle}`);
                        return; // 标题API不需要处理消息内容
                    }

                    // 正常处理对话内容
                    state.convertedMd = platformConverters.doubao(jsonData);
                    state.messageStats.totalChars = jsonData.downlink_body?.pull_singe_chain_downlink_body?.messages?.reduce((acc, msg) => {
                        try {
                            const contentObj = JSON.parse(msg.content || '{}');
                            return acc + (contentObj.text?.length || 0);
                        } catch {
                            return acc + (msg.content?.length || 0);
                        }
                    }, 0) || 0;
                    state.messageStats.convTurns = jsonData.downlink_body?.pull_singe_chain_downlink_body?.messages?.length || 0;

                    // 如果当前标题还是默认值，尝试从对话数据中获取
                    if (state.currentTitle === CONFIG.DEFAULT_TITLE || state.currentTitle === '豆包对话') {
                        state.currentTitle = jsonData.downlink_body?.get_conv_info_downlink_body?.conversation_info?.name || '豆包对话';
                    }
                    break;
            }

            ui.updateButtonStatus();
            logger.info(`成功处理${detectedPlatform.toUpperCase()}响应`);
        } catch (e) {
            logger.error('响应处理错误', e);
        }
    }

    // Kimi相关功能
    // sessionId提取
    function getKimiSessionId() {
        const currentUrl = window.location.href;
        // 匹配多种可能的URL格式
        const match = currentUrl.match(/(?:chat|chat_session)\/([a-zA-Z0-9-]+)(?:\/|$)/);
        return match ? match[1] : null;
    }

    // 拦截XHR请求获取授权令牌
    function setupAuthInterceptor() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._requestURL = url;
            if (url.includes('/api/chat/') && !url.includes('/api/chat/list')) {
                logger.info(`拦截到Kimi API请求: ${method} ${url}`);
                this._isChatAPI = true;
            }
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (this._isChatAPI && header.toLowerCase() === 'authorization') {
                state.authToken = value;
                logger.info('获取到Authorization头');
            }
            return originalSetRequestHeader.apply(this, arguments);
        };
    }

    // 获取Kimi对话标题
    async function fetchKimiChatTitle() {
        if (state.kimiTitleCache) return state.kimiTitleCache;
        //console.log('Kimi标题获取测试');

        state.kimiSessionId = getKimiSessionId();
        if (!state.kimiSessionId) {
            logger.warn('无法获取sessionId');
            return "Kimi对话";
        }

        // 等待获取授权令牌
        let retry = 0;
        while (!state.authToken && retry < 5) {
            logger.info('等待获取授权令牌...');
            await new Promise(resolve => setTimeout(resolve, 500));
            retry++;
        }

        if (!state.authToken) {
            logger.warn('未能获取授权令牌');
            return "Kimi对话";
        }

        try {
            const url = `https://www.kimi.com/api/chat/${state.kimiSessionId}`;
            logger.info(`请求标题API: ${url}`);

            const response = await fetch(url, {
                headers: {
                    'Authorization': state.authToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                logger.warn(`API错误: ${response.status}`);
                return "Kimi对话";
            }

            const data = await response.json();
            logger.info('标题_API响应类型:', typeof data);
            logger.info('API响应:', data);

            //const kimidata =await fetchkimiMessage();
            //console.log('标题里面输出对话：',kimidata);

            state.kimiTitleCache = data.name || "Kimi对话";
            return state.kimiTitleCache;
        } catch (error) {
            logger.error('获取标题失败:', error);
            return "Kimi对话";
        }
    }

    // 获取Kimi对话信息
    async function fetchkimiMessage() {
        if (state.kimiTitleCache) return state.kimiTitleCache;

        state.kimiSessionId = getKimiSessionId();
        if (!state.kimiSessionId) {
            logger.warn('无法获取sessionId');
            return "Kimi信息";
        }

        // 等待获取授权令牌
        let retry = 0;
        while (!state.authToken && retry < 5) {
            logger.info('等待获取授权令牌...');
            await new Promise(resolve => setTimeout(resolve, 500));
            retry++;
        }

        if (!state.authToken) {
            logger.warn('未能获取授权令牌');
            return "Kimi信息";
        }

        try {
            const url = `https://www.kimi.com/apiv2/kimi.chat.v1.ChatService/ListMessages`;
            logger.info(`请求信息API: ${url}`);

            // 修正：使用POST方法并添加请求体
            const requestBody = {
                chat_id: state.kimiSessionId, // 需要传递chatId参数
                // 可能还需要其他参数，如：
                // limit: 100,
                // cursor: ""
            };

            const response = await fetch(url, {
                method: 'POST', // 改为POST方法
                headers: {
                    'Authorization': state.authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // 添加请求体
                mode: 'cors',
                referrer: window.location.href, // 使用当前页面作为referrer
                credentials: 'include'
            });

            if (!response.ok) {
                logger.warn(`API错误: ${response.status}`);
                return "Kimi信息";
            }

            // 检查Content-Type确认是JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const rawText = await response.text();
                console.warn('响应不是JSON:', rawText.substring(0, 200));
                return null;
            }

            const data = await response.json();
            //const data = JSON.stringify(restext, null, 2)
            logger.info('Kimi_API响应类型:', typeof data);
            logger.info('kimi_API响应:', data);
            //console.log('kimi_API响应:', JSON.stringify(data, null, 2));

            //state.kimiTitleCache = data.name || "Kimi对话";
            return data;

        } catch (error) {
            logger.error('获取kimi信息失败:', error);
            return "Kimi信息";
        }
    }

    // 导出功能
    // 提取获取文件名的公共逻辑
    function getExportFilename(extension = '') {
        const jsonData = JSON.parse(state.targetResponse || '{}');
        let platformPrefix = '';
        let defaultSuffix = 'Chat';

        switch(state.platformType) {
            case 'deepseek':
                platformPrefix = 'DeepSeek';
                defaultSuffix = 'deepseek-Chat';
                break;
            case 'ncn':
                platformPrefix = 'AI-N';
                defaultSuffix = 'AI-Chat';
                break;
            case 'yuanbao':
                platformPrefix = 'Yuanbao';
                defaultSuffix = 'Yuanbao-Chat';
                break;
            case 'kimi':
                platformPrefix = 'Kimi';
                defaultSuffix = 'Kimi-Chat';
                break;
            case 'tongyi':
                platformPrefix = 'Tongyi';
                defaultSuffix = 'Tongyi-Chat';
                break;
            case 'iflytek':
                platformPrefix = 'Iflytek';
                defaultSuffix = 'Iflytek-Chat';
                break;
            case 'doubao':
            case 'doubao_title':
                platformPrefix = 'Doubao';
                defaultSuffix = state.platformType === 'doubao_chat' ? 'ChatList' : 'Chat';
                break;
            default:
                platformPrefix = 'AI';
                defaultSuffix = 'Chat';
        }

        const title = state.currentTitle ||
              jsonData.data?.biz_data?.chat_session?.title ||
              jsonData.data?.title ||
              jsonData.sessionTitle ||jsonData.downlink_body?.get_conv_info_downlink_body?.conversation_info?.name||'豆包对话'||(state.platformType === 'doubao_chat' ? '豆包列表' : '豆包其他')||
              defaultSuffix;

        const sanitizedTitle = utils.sanitizeFilename(`${platformPrefix}_${title}`);
        return `${sanitizedTitle}_${utils.getLocalTimestamp()}${extension ? '.' + extension : ''}`;
    }

    const exportHandlers = {
        json: () => {
            if (!state.targetResponse) {
                alert('还没有发现有效的对话记录。\n请等待目标响应或进行一些对话。');
                return false;
            }

            try {
                const fileName = getExportFilename('json');
                return utils.createBlobDownload(
                    state.targetResponse,
                    'application/json',
                    fileName
                );
            } catch (e) {
                logger.error('JSON导出失败', e);
                alert('导出过程中发生错误，请查看控制台了解详情。');
                return false;
            }
        },

        markdown: () => {
            if (!state.convertedMd) {
                alert('还没有发现有效的对话记录。\n请等待目标响应或进行一些对话。');
                return false;
            }

            try {
                const fileName = getExportFilename('md');
                return utils.createBlobDownload(
                    state.convertedMd,
                    'text/markdown',
                    fileName
                );
            } catch (e) {
                logger.error('Markdown导出失败', e);
                alert(`导出失败: ${e.message}`);
                return false;
            }
        },

        word: () => {
            if (!state.convertedMd) {
                alert('还没有发现有效的对话记录。\n请等待目标响应或进行一些对话。');
                return;
            }

            try {
                const fileName = getExportFilename('docx');
                const chatName = fileName.replace(/_[\d_-]+\.docx$/, ''); // 移除时间戳部分作为标题

                const wordButton = document.getElementById('downloadWordButton');
                const originalText = wordButton.innerHTML;
                wordButton.innerHTML = '<span class="gm-spinner"></span>生成中...';
                wordButton.disabled = true;

                GM_xmlhttpRequest({
                    method: "POST",
                    url: CONFIG.API_ENDPOINT_WORD,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({
                        markdown: state.convertedMd,
                        title: chatName
                    }),
                    responseType: 'blob',
                    onload: function(response) {
                        wordButton.innerHTML = originalText;
                        wordButton.disabled = false;

                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const blob = response.response;
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = fileName;
                                document.body.appendChild(a);
                                a.click();
                                setTimeout(() => {
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                }, 100);
                                logger.info(`成功下载Word文件: ${fileName}`);
                            } catch (e) {
                                alert('下载文件时出错: ' + e.message);
                                logger.error("处理Word下载时出错", e);
                            }
                        } else {
                            const reader = new FileReader();
                            reader.onload = function() {
                                try {
                                    const errorResult = JSON.parse(this.result);
                                    alert(`导出失败: ${errorResult.error || '未知错误'}`);
                                } catch (e) {
                                    alert(`导出失败，状态码: ${response.status}。无法解析错误信息。`);
                                }
                            };
                            reader.readAsText(response.response);
                        }
                    },
                    onerror: function(response) {
                        wordButton.innerHTML = originalText;
                        wordButton.disabled = false;
                        alert(`请求错误: ${response.statusText || '无法连接到服务器'}`);
                    }
                });
            } catch (e) {
                logger.error('Word导出初始化失败', e);
                alert('导出初始化失败: ' + e.message);
            }
        }
    };

    // UI相关功能
    const ui = {
        updateButtonStatus: () => {
            const jsonButton = document.getElementById('downloadJsonButton');
            const mdButton = document.getElementById('downloadMdButton');
            const wordButton = document.getElementById('downloadWordButton');

            if (!jsonButton || !mdButton || !wordButton) return;

            const hasResponse = state.targetResponse !== null;
            let platformName = 'AI对话';
            let statsText = '';

            try {
                const jsonData = JSON.parse(state.targetResponse || '{}');

                switch(state.platformType) {
                    case 'deepseek':
                        platformName = `DeepSeek_${jsonData.data?.biz_data?.chat_session?.title || 'deepseek-Chat'}`;
                        statsText = `Token用量: ${state.messageStats.totalTokens}`;
                        break;
                    case 'ncn':
                        platformName = `AI-N_${jsonData.data?.title || 'AI-Chat'}`;
                        statsText = `字数: ${state.messageStats.totalChars} | 附件: ${state.messageStats.fileCount}`;
                        break;
                    case 'yuanbao':
                        platformName = `Yuanbao_${jsonData.sessionTitle || jsonData.title || 'Yuanbao-Chat'}`;
                        statsText = `对话轮次: ${state.messageStats.convTurns} | 文件: ${state.messageStats.fileCount}`;
                        break;
                    case 'kimi':
                        platformName = `Kimi_${state.currentTitle}`;
                        statsText = `消息数: ${state.messageStats.convTurns} | 字数: ${state.messageStats.totalChars}`;
                        break;
                    case 'tongyi':
                        platformName = `Tongyi_${state.currentTitle}`;
                        statsText = `对话轮次: ${state.messageStats.convTurns} | 字数: ${state.messageStats.totalChars}`;
                        break;
                    case 'iflytek':
                        platformName = `xinghuo_${state.currentTitle}`;
                        statsText = `对话轮次: ${state.messageStats.convTurns} | 字数: ${state.messageStats.totalChars}`;
                        break;
                    case 'doubao':
                    case 'doubao_title':
                        platformName = state.currentTitle ||jsonData.downlink_body?.get_conv_info_downlink_body?.conversation_info?.name ||'豆包对话';
                        statsText = state.platformType === 'doubao_title'
                            ? `对话数: ${state.messageStats.convTurns}`
                        : `消息数: ${state.messageStats.convTurns} | 字数: ${state.messageStats.totalChars} | 附件: ${state.messageStats.fileCount}`;
                        break;
                }
            } catch (e) {
                logger.error('更新按钮状态时解析JSON失败', e);
            }

            // 更新按钮状态和样式
            [jsonButton, mdButton, wordButton].forEach(button => {
                button.style.backgroundColor = hasResponse ? '#28a745' : '#007bff';
                button.dataset.tooltip = `${platformName}数据已就绪\n${statsText}\n最后更新: ${state.lastUpdateTime}`;

                // 悬停效果
                button.onmouseenter = () => {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
                };
                button.onmouseleave = () => {
                    button.style.transform = '';
                    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                };
            });

            // 特殊处理MD和Word按钮
            mdButton.style.backgroundColor = state.convertedMd ? '#28a745' : '#007bff';
            wordButton.style.backgroundColor = state.convertedMd ? '#28a745' : '#007bff';

            // 禁用状态
            jsonButton.disabled = !hasResponse;
            mdButton.disabled = !state.convertedMd;
            wordButton.disabled = !state.convertedMd;
        },

        createDownloadButtons: () => {
            // 如果按钮已存在，则不再创建
            if (document.getElementById('downloadJsonButton')) return;

            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'exportButtonsContainer';
            const jsonButton = document.createElement('button');
            const mdButton = document.createElement('button');
            const wordButton = document.createElement('button');

            // 容器样式
            Object.assign(buttonContainer.style, {
                position: 'fixed',
                top: '45%',
                right: '10px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                opacity: CONFIG.BUTTON_OPACITY,
                transition: 'opacity 0.3s ease',
                cursor: 'move'
            });

            // 按钮通用样式
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

            // 设置按钮属性和样式
            jsonButton.id = 'downloadJsonButton';
            jsonButton.innerText = 'JSON';
            mdButton.id = 'downloadMdButton';
            mdButton.innerText = 'MD';
            wordButton.id = 'downloadWordButton';
            wordButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 5px;">
                    <path d="M4 4.5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V8.2468C20 7.61538 19.7893 7.00372 19.4029 6.5L16.5 3H6C4.89543 3 4 3.89543 4 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M16 3V7C16 7.55228 16.4477 8 17 8H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M8 13L10 17L12 13L14 17L16 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>Word`;
            // 添加按钮的 classname
            [jsonButton, mdButton, wordButton].forEach(btn => {
                btn.className = 'export-button';
            });

            Object.assign(jsonButton.style, buttonStyles);
            Object.assign(mdButton.style, buttonStyles);
            Object.assign(wordButton.style, buttonStyles);

            // 鼠标悬停效果
            buttonContainer.onmouseenter = () =>{
                buttonContainer.style.opacity = CONFIG.BUTTON_HOVER_OPACITY;
                buttonContainer.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
            };
            buttonContainer.onmouseleave = () =>{
                buttonContainer.style.opacity = CONFIG.BUTTON_OPACITY;
                buttonContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }


            // 拖动功能
            let isDragging = false;
            let initialX, initialY, xOffset = 0, yOffset = 0;

            buttonContainer.addEventListener('mousedown', (e) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === buttonContainer) {
                    isDragging = true;
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    xOffset = e.clientX - initialX;
                    yOffset = e.clientY - initialY;
                    buttonContainer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // 阻止按钮的 mousedown 冒泡影响拖动
            [jsonButton, mdButton, wordButton].forEach(btn => {
                btn.addEventListener('mousedown', (e) => e.stopPropagation());
            });

            // 按钮点击事件
            jsonButton.onclick = exportHandlers.json;
            mdButton.onclick = exportHandlers.markdown;
            wordButton.onclick = exportHandlers.word;

            // 组装按钮
            buttonContainer.appendChild(jsonButton);
            buttonContainer.appendChild(mdButton);
            buttonContainer.appendChild(wordButton);
            document.body.appendChild(buttonContainer);

            // 自动折叠/展开功能
            let isCollapsed = false;
            let collapseTimeout;
            const collapseDelay = 2000; // 2秒后自动折叠

            // 自动折叠函数
            const autoCollapse = () => {
                collapseTimeout = setTimeout(() => {
                    buttonContainer.classList.add('collapsed');
                    isCollapsed = true;
                }, collapseDelay);
            };

            // 初始设置自动折叠
            autoCollapse();

            // 鼠标进入展开
            buttonContainer.addEventListener('mouseenter', () => {
                clearTimeout(collapseTimeout);
                if (isCollapsed) {
                    buttonContainer.classList.remove('collapsed');
                    isCollapsed = false;
                }
            });

            // 鼠标离开后延迟折叠
            buttonContainer.addEventListener('mouseleave', () => {
                if (!isCollapsed) {
                    autoCollapse();
                }
            });

            // 点击折叠按钮也可展开
            buttonContainer.addEventListener('click', (e) => {
                if (isCollapsed && e.target === buttonContainer) {
                    buttonContainer.classList.remove('collapsed');
                    isCollapsed = false;
                    clearTimeout(collapseTimeout);
                }
            });

            // 确保拖动时不折叠
            buttonContainer.addEventListener('mousedown', () => {
                clearTimeout(collapseTimeout);
            });

            // 添加加载动画样式
            GM_addStyle(`
               .export-button {
                transition: all 0.2s ease;
                }
                .export-button:hover {
                background-color: #0056b3 !important;
               }
                .export-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    background-color: #6c757d !important;
                }
                .gm-spinner {
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    width: 12px;
                    height: 12px;
                    animation: spin ${CONFIG.SPINNER_ANIMATION_DURATION} linear infinite;
                    display: inline-block;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                    /* 添加折叠/展开相关样式 */
                #exportButtonsContainer.collapsed {
                    width: 40px;
                    height: 40px;
                    overflow: hidden;
                    padding: 5px;
                }

                #exportButtonsContainer.collapsed .export-button {
                    display: none;
                }

                #exportButtonsContainer.collapsed::before {
                    content: "↓↓↓";
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    background: #007bff;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;

                    cursor: pointer;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }

                #exportButtonsContainer:not(.collapsed)::before {
                    display: none;
                }

                #exportButtonsContainer {
                    transition: all 0.3s ease;
                }
                /* 标题相关样式 */
                [data-tooltip] {
                    position: relative;
                }

                [data-tooltip]:hover::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    right: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    background:rgba(228,17,136,0.7);
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 16px;
                    font-family: "方正小标宋简体","黑体", Arial, sans-serif;
                    white-space: pre;
                    margin-right: 10px;
                    pointer-events: none;
                    opacity: 0.1;
                    transition: opacity 0.3s;
                }

                [data-tooltip]:hover::after {
                    opacity: 1;
                }
            `);

            ui.updateButtonStatus();
        }
    };

    // 网络拦截
    function setupNetworkInterception() {
        // 拦截XHR请求
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(...args) {
            // 处理缓存参数
            if (args[1]?.includes('history_messages?chat_session_id')) {
                args[1] = args[1].split('&cache_version=')[0];
            } else if (args[1]?.includes('conversation/info?conversation_id')) {
                args[1] = args[1].split('&cache_version=')[0];
            } else if (args[1]?.includes('/api/user/agent/conversation/v1/detail')) {
                args[1] = args[1].split('&cacheBust=')[0];
            }

            this._requestURL = args[1];
            const url = args[1];
            //console.log('XHR.open被调用:', url);

            this.addEventListener('load', () => {
                if (this.responseURL) {
                    //console.log('XHR请求完成:', this.responseURL); // 添加调试
                    for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
                        if (pattern.test(this.responseURL)) {
                            processTargetResponse(this.responseText, this.responseURL);
                            break;
                        }
                    }
                }
            });

            originalOpen.apply(this, args);
        };

        // 拦截Fetch请求
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0] instanceof Request ? args[0].url : args[0];
            let response;
            //console.log('🔍 Fetch请求被调用:', url);
            //console.log('⏰ 时间线调试 - 脚本启动:', performance.now());

            try {
                response = await originalFetch.apply(this, args);

                if (typeof url === 'string') {
                    for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
                        if (pattern.test(url)) {
                            const contentType = response.headers.get('content-type');
                            if (contentType?.includes('application/json')) {
                                const clonedResponse = response.clone();
                                clonedResponse.text().then(text => {
                                    processTargetResponse(text, url);
                                }).catch(e => {
                                    logger.error(`解析fetch响应文本时出错`, { url, error: e });
                                });
                            }
                            break;
                        }
                    }
                }
            } catch (error) {
                logger.error('Fetch请求失败', error);
                throw error;
            }

            return response;
        };
    }

    setupNetworkInterception();
    setupAuthInterceptor(); // Kimi标题授权拦截器

    // 初始化
    function initialize() {
       // setupNetworkInterception();
        ui.createDownloadButtons();
        logger.info('增强版导出脚本已启动');

        // 使用MutationObserver确保按钮存在
        const observer = new MutationObserver((mutations) => {
            if (!document.getElementById('downloadJsonButton') ||
                !document.getElementById('downloadMdButton')) {
                logger.info('检测到按钮丢失，正在重新创建...');
                ui.createDownloadButtons();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();