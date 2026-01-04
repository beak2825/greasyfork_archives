// ==UserScript==
// @name         Notion AI 快速保存助手
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  一个由 AI 驱动的用户脚本（UserScript），支持 OpenAI 和 Gemini，可以快速将网页保存并智能分类到您的 Notion 数据库中。它拥有一个设计优雅、可拖动的悬浮 UI、一个功能全面的设置面板，并为兼容现代网站而精心设计。
// @author       tsdw
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/542680/Notion%20AI%20%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542680/Notion%20AI%20%E5%BF%AB%E9%80%9F%E4%BF%9D%E5%AD%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================
    // ===================== 初始化锁 (双重保险) =========================
    // ===================================================================
    if (window.self !== window.top) { return; }
    if (window.NQS_SCRIPT_RUNNING) { return; }
    window.NQS_SCRIPT_RUNNING = true;


    // ===================================================================
    // ===================== 全局容器与样式隔离 ========================
    // ===================================================================
    const globalContainer = document.createElement('div');
    globalContainer.id = 'NQS_GLOBAL_CONTAINER';
    document.body.appendChild(globalContainer);

    // ===================================================================
    // ===================== 默认配置与分类管理 ========================
    // ===================================================================
    const DEFAULT_CATEGORIES = [ "前端开发", "后端开发", "人工智能", "运维安全", "生活服务", "美食烹饪", "旅行", "健康医疗", "影视", "音乐", "游戏", "动漫","综艺", "学术研究", "教育学习", "金融理财", "二手交易", "求职招聘", "办公工具", "职业规划", "热点与政策", "社区互动", "其他" ];
    const SETTINGS_DEFAULTS = {
        theme: 'auto',
        notion_api_key: '',
        database_id: '',
        ai_provider: 'openai',
        ai_api_key: '',
        ai_api_url: 'https://api.openai.com/v1/chat/completions',
        ai_model: 'gpt-3.5-turbo',
        ai_enabled: true,
        ai_include_body: false,
        ai_timeout: 20000,
        ai_model_fetch_timeout: 10000, // 新增: 独立的模型列表获取超时
        ai_retry_count: 2, // 新增: AI调用重试次数
        ai_confidence_threshold: 0.7, // 新增: AI分类置信度阈值
        ai_learning_enabled: true, // 新增: 启用AI分类学习

        content_extraction_enabled: true, // 新增: 启用内容提取增强
        auto_summary_enabled: false, // 新增: 自动生成摘要
        auto_keywords_enabled: false, // 新增: 自动提取关键词
        content_save_mode: 'link', // 新增: 内容保存模式 (link/summary/full)
        notification_enabled: true, // 新增: 启用浏览器通知
        notification_success_enabled: true, // 新增: 成功通知
        notification_error_enabled: true, // 新增: 错误通知
        progress_indicator_enabled: true, // 新增: 显示进度指示器
        proxy_enabled: false,
        proxy_url: '',
        user_categories: JSON.stringify(DEFAULT_CATEGORIES),
        prop_name_title: '名称',
        prop_name_url: '链接',
        prop_name_category: '类型',
        read_later_enabled: true,
        read_later_category: '稍后读',
        ai_prompt: `你是一个专精于网页内容分类的AI模型。你的唯一任务是遵循下述协议，分析网页信息，并从一个预设的分类列表中，选择唯一且最匹配的一个分类。
# 分析层级与协议 (Analysis Hierarchy & Protocol)
你必须严格按照以下优先级顺序获取和分析信息。高优先级方法成功后，低优先级信息仅用作辅助验证。
1. **最高优先级：实时网页分析 (Live Webpage Analysis)**
   * **行动指令：** 如果你的能力允许，首先尝试直接访问并完整分析 Page URL 指向的实时网页内容。
   * **基本原理：** 实时网页是最权威、最准确的信息源。它的内容、结构和互动元素能最完整地反映页面的真实用途。
2. **次高优先级：静态元数据分析 (Static Metadata Analysis)**
   * **触发条件：** 当且仅当你无法访问实时网页（例如，技术限制、访问错误、防火墙）时，启用此层级。
   * **行动指令：** 详细分析提供的网页标题 (Page Title) 和 元描述 (Meta Description)。这两个字段是网站所有者设定的核心摘要。
3. **最低优先级：辅助正文参考 (Supplementary Body Text)**
   * **触发条件：** 仅在前序层级（实时网页或静态元数据）分析后，分类结果依然高度模糊、难以抉择时，才可使用此信息。
   * **行动指令：** 将提供的{page_body_text}作为最后的补充线索。
   * **注意：** 此文本可能是不完整或过时的快照，其权重远低于实时网页内容和核心元数据。
# 分类决策原则
在获得信息后，运用以下原则进行最终决策：
- **选择最具体的：** 如果页面符合一个宽泛分类（如"社区互动"）和一个具体分类（如"前端开发"），优先选择更具体的那个。
- **识别核心用途：** 对于多主题页面（如门户网站首页），判断其最核心、最主要的功能或主题进行分类。
- **识别平台/服务核心价值：** 对于像 GitHub, YouTube, Amazon 这样的平台型网站，应根据其核心服务来分类（例如，GitHub -> "后端开发" 或 "办公工具"，YouTube -> "影视"，Amazon -> "生活服务"），而不是其首页上可能出现的具体内容。
- **选择最佳匹配：** 必须从下方列表中选择。即使没有完美的选项，也要选择最接近的一个。
# 预设分类列表
{categories}
# 输出格式规定
- **【绝对必须】** 只输出最终的分类名称，且该名称必须完整存在于"预设分类列表"中。
- **【绝对禁止】** 禁止添加任何形式的解释、说明、标点符号（如 "", 「」）、Markdown标记（如 *, \`\`)或其他任何多余字符。
# 任务开始
根据下面提供的信息，并严格遵守上述所有协议、原则和规则，给出你的分类结果。
## 网页信息:
{page_metadata}{optional_body_section}`
        ,
        ai_prompt_templates: JSON.stringify([{ id: 'default', title: '默认', content: '', builtIn: true }]),
        ai_active_template_id: 'default'
    };
    const LOG_LIMIT = 100;
    const LOG_SCHEMA_VERSION = 2;
    const LOG_STRING_LIMIT = 600;
    const LOG_CONTEXT_DEPTH = 3;
    const LOG_CONTEXT_ARRAY_LIMIT = 20;
    const LOG_LEVELS = new Set(['info', 'error', 'warn', 'debug']);
    const FALLBACK_CATEGORY = '其他';

    // ===================================================================
    // ================= CSP TrustedHTML 处理器 ==========================
    // ===================================================================
    let nqsPolicy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            nqsPolicy = window.trustedTypes.createPolicy('nqs-policy', { createHTML: string => string });
        } catch (e) {
            nqsPolicy = window.trustedTypes.defaultPolicy || window.trustedTypes.policies.get("nqs-policy");
        }
    }
    function createSafeHTML(htmlString) { return nqsPolicy ? nqsPolicy.createHTML(htmlString) : htmlString; }
    function setSafeInnerHTML(element, htmlString) { element.innerHTML = createSafeHTML(htmlString); }
    function escapeHtml(str) { if (typeof str !== 'string') return ''; const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }; return str.replace(/[&<>"']/g, char => map[char]); }

    function truncateLogString(value, limit = LOG_STRING_LIMIT) {
        if (value === undefined || value === null) return '';
        const str = (() => {
            if (typeof value === 'string') return value;
            if (typeof value === 'object') {
                try {
                    return JSON.stringify(value);
                } catch (error) {
                    return value.toString ? value.toString() : '[object Object]';
                }
            }
            return String(value);
        })();
        if (str.length <= limit) return str;
        return `${str.slice(0, limit)}… (${str.length - limit} more chars)`;
    }

    function normalizeLogLevel(level) {
        const normalized = typeof level === 'string' ? level.toLowerCase() : 'info';
        return LOG_LEVELS.has(normalized) ? normalized : 'info';
    }

    function serializeErrorForLog(errorLike) {
        if (!errorLike) return null;
        const err = errorLike instanceof Error ? errorLike : new Error(String(errorLike));
        return {
            name: err.name || 'Error',
            message: truncateLogString(err.message || String(errorLike)),
            stack: err.stack ? truncateLogString(err.stack, 1500) : undefined
        };
    }

    function safeCloneForLog(payload, depth = 0) {
        if (payload === null || payload === undefined) return payload;
        if (typeof payload === 'string') return truncateLogString(payload);
        if (typeof payload === 'number' || typeof payload === 'boolean') return payload;
        if (payload instanceof Date) return payload.toISOString();
        if (payload instanceof URL) return payload.toString();
        if (payload instanceof Error) return serializeErrorForLog(payload);
        if (Array.isArray(payload)) {
            if (depth >= LOG_CONTEXT_DEPTH) return '[Array depth limit]';
            const slice = payload.slice(0, LOG_CONTEXT_ARRAY_LIMIT).map(item => safeCloneForLog(item, depth + 1));
            if (payload.length > LOG_CONTEXT_ARRAY_LIMIT) slice.push(`…(${payload.length - LOG_CONTEXT_ARRAY_LIMIT} more)`);
            return slice;
        }
        if (payload instanceof Map) {
            return {
                type: 'Map',
                size: payload.size,
                entries: depth >= LOG_CONTEXT_DEPTH ? '[Map depth limit]' : Array.from(payload.entries()).slice(0, LOG_CONTEXT_ARRAY_LIMIT).map(([k, v]) => [safeCloneForLog(k, depth + 1), safeCloneForLog(v, depth + 1)])
            };
        }
        if (payload instanceof Set) {
            return {
                type: 'Set',
                size: payload.size,
                values: depth >= LOG_CONTEXT_DEPTH ? '[Set depth limit]' : Array.from(payload.values()).slice(0, LOG_CONTEXT_ARRAY_LIMIT).map(v => safeCloneForLog(v, depth + 1))
            };
        }
        if (typeof Node !== 'undefined' && payload instanceof Node) {
            return `[DOM ${payload.nodeName}]`;
        }
        if (typeof payload === 'object') {
            if (depth >= LOG_CONTEXT_DEPTH) return '[Object depth limit]';
            const entries = Object.entries(payload).slice(0, 50);
            const result = {};
            for (const [key, value] of entries) {
                try {
                    result[key] = safeCloneForLog(value, depth + 1);
                } catch (err) {
                    result[key] = `[Unserializable: ${err?.message || err}]`;
                }
            }
            return result;
        }
        return String(payload);
    }

    function normalizeLogContext(details) {
        if (details === undefined || details === null) return {};
        if (details instanceof Error) return { error: serializeErrorForLog(details) };
        if (typeof details === 'string' || typeof details === 'number' || typeof details === 'boolean') return { note: truncateLogString(details) };
        const cloned = safeCloneForLog(details);
        return cloned && typeof cloned === 'object' ? cloned : { note: truncateLogString(cloned) };
    }

    function extractLogTags(details) {
        if (!details || typeof details !== 'object') return [];
        const raw = Array.isArray(details.tags) ? details.tags : Array.isArray(details.logTags) ? details.logTags : null;
        if (!raw) return [];
        return raw.map(tag => String(tag).trim()).filter(Boolean).slice(0, 6);
    }

    function getCurrentPageMeta() {
        try {
            return {
                title: document?.title || '',
                url: document?.location?.href || ''
            };
        } catch (error) {
            console.warn('NQS - 无法获取页面信息用于日志记录:', error);
            return { title: '', url: '' };
        }
    }

    function logToConsole(level, message, entry) {
        const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : level === 'debug' ? 'debug' : 'log';
        if (!(method in console)) return;
        try {
            console[method](`NQS[${level.toUpperCase()}] ${message}`, entry?.context || entry);
        } catch (error) {
            console.warn('NQS - 日志控制台输出失败:', error);
        }
    }

    function normalizeTextForCategory(text) {
        return (text || '')
            .toString()
            .replace(/[\s"'“”‘’《》〈〉「」【】（）()、，。.!?：:;|\\]/g, '')
            .toLowerCase();
    }

    function interpretAIResponse(rawText, categories = []) {
        const normalizedCategories = categories.map(name => ({
            name,
            normalized: normalizeTextForCategory(name)
        }));
        const candidate = (rawText || '')
            .split(/[\r\n]+/)
            .map(s => s.trim())
            .filter(Boolean)[0] || '';
        const normalizedCandidate = normalizeTextForCategory(candidate);

        if (!candidate) {
            return { category: FALLBACK_CATEGORY, confidence: 0.2, reason: 'empty_response', candidate: '' };
        }

        const exact = normalizedCategories.find(item => item.name === candidate);
        if (exact) {
            return { category: exact.name, confidence: 0.9, reason: 'exact_match', candidate };
        }

        const normalizedMatch = normalizedCategories.find(item => item.normalized && item.normalized === normalizedCandidate);
        if (normalizedMatch) {
            return { category: normalizedMatch.name, confidence: 0.85, reason: 'normalized_match', candidate };
        }

        const parts = candidate.split(/[,，;；、/|]+/).map(s => s.trim()).filter(Boolean);
        for (const part of parts) {
            const normalizedPart = normalizeTextForCategory(part);
            const partMatch = normalizedCategories.find(item => item.normalized === normalizedPart);
            if (partMatch) {
                return { category: partMatch.name, confidence: 0.75, reason: 'partial_match', candidate: part };
            }
        }

        const fuzzy = normalizedCategories.find(item =>
            item.normalized &&
            (item.normalized.includes(normalizedCandidate) || normalizedCandidate.includes(item.normalized))
        );
        if (fuzzy) {
            return { category: fuzzy.name, confidence: 0.6, reason: 'fuzzy_match', candidate };
        }

        const fallbackCategory = normalizedCategories.find(item => item.name === FALLBACK_CATEGORY)?.name || FALLBACK_CATEGORY;
        return { category: fallbackCategory, confidence: 0.3, reason: 'fallback', candidate };
    }

    // ===================================================================
    // ====================== 核心功能与辅助函数 =======================
    // ===================================================================
    function getHighSignalPageData(doc) { const url = doc.location.href; const title = doc.title; const description = (doc.querySelector('meta[name="description"]') || {}).content || '无'; const keywords = (doc.querySelector('meta[name="keywords"]') || {}).content || '无'; return `Page URL: ${url}\nPage Title: ${title}\nMeta Description: ${description.trim()}\nMeta Keywords: ${keywords.trim()}`; }
    // ===================================================================
    // ====================== 增强内容提取功能 ============================
    // ===================================================================
    function extractMainContent(doc) {
        try {
            const main = doc.querySelector('main');
            if (main) return main.innerText;
            const articles = doc.querySelectorAll('article');
            if (articles.length > 0) return Array.from(articles).map(el => el.innerText).join('\n\n');
            const clonedBody = doc.body.cloneNode(true);
            clonedBody.querySelectorAll('nav, footer, header, aside, .sidebar, #sidebar, [role="navigation"], [role="banner"], [role="contentinfo"], .ad, #ad, .advertisement').forEach(el => el.remove());
            const cleanedText = clonedBody.innerText;
            return (cleanedText && cleanedText.trim().length > 100) ? cleanedText : doc.body.innerText;
        } catch (error) {
            console.error("NQS - 智能内容提取失败:", error);
            return doc.body.innerText;
        }
    }

    function extractAdvancedContent(doc) {
        const content = {
            title: doc.title,
            url: doc.location.href,
            description: (doc.querySelector('meta[name="description"]') || {}).content || '',
            keywords: (doc.querySelector('meta[name="keywords"]') || {}).content || '',
            author: (doc.querySelector('meta[name="author"]') || {}).content || '',
            publishTime: '',
            readingTime: 0,
            mainContent: '',
            images: [],
            links: []
        };

        // 提取发布时间
        const timeSelectors = [
            'time[datetime]',
            '[datetime]',
            '.publish-time',
            '.date',
            '.post-date'
        ];
        for (const selector of timeSelectors) {
            const timeEl = doc.querySelector(selector);
            if (timeEl) {
                content.publishTime = timeEl.getAttribute('datetime') || timeEl.textContent.trim();
                break;
            }
        }

        // 提取主要内容
        content.mainContent = extractMainContent(doc);

        // 计算阅读时间（基于词数，中文按字符数）
        const textLength = content.mainContent.replace(/\s+/g, '').length;
        content.readingTime = Math.ceil(textLength / 500); // 假设每分钟500字

        // 提取图片
        const images = doc.querySelectorAll('img[src]');
        content.images = Array.from(images).slice(0, 5).map(img => ({
            src: img.src,
            alt: img.alt || '',
            title: img.title || ''
        }));

        // 提取重要链接
        const links = doc.querySelectorAll('a[href]');
        content.links = Array.from(links).filter(link =>
            link.href.startsWith('http') &&
            !link.href.includes(doc.location.hostname)
        ).slice(0, 10).map(link => ({
            href: link.href,
            text: link.textContent.trim()
        }));

        return content;
    }

    async function generateContentSummary(content, settings) {
        if (!settings.ai_enabled || !settings.auto_summary_enabled) {
            return null;
        }

        try {
            const summaryPrompt = `请为以下网页内容生成一个简洁的摘要（100-200字）：

标题：${content.title}
内容：${content.mainContent.substring(0, 2000)}

要求：
1. 提取核心要点
2. 语言简洁明了
3. 保持客观中性
4. 只输出摘要内容，无需其他说明`;

            const aiResult = await makeSummaryRequest(settings, summaryPrompt);
            return aiResult.summary;
        } catch (error) {
            console.warn('NQS - 自动摘要生成失败:', error.message);
            return null;
        }
    }

    async function extractKeywords(content, settings) {
        if (!settings.ai_enabled || !settings.auto_keywords_enabled) {
            return [];
        }

        try {
            const keywordPrompt = `请从以下网页内容中提取5-8个关键词：

标题：${content.title}
描述：${content.description}
内容：${content.mainContent.substring(0, 1500)}

要求：
1. 关键词应该是名词或名词短语
2. 体现内容的核心主题
3. 用逗号分隔
4. 只输出关键词，无需其他文字`;

            const aiResult = await makeSummaryRequest(settings, keywordPrompt);
            return aiResult.summary.split(',').map(k => k.trim()).filter(k => k.length > 0);
        } catch (error) {
            console.warn('NQS - 关键词提取失败:', error.message);
            return [];
        }
    }

    function buildGeminiEndpoint(model, proxySettings = {}) {
        const normalizedModel = (model || '').trim();
        if (!normalizedModel) {
            throw new Error("Gemini 模型 ID 未配置");
        }
        const encodedModel = encodeURIComponent(normalizedModel);
        const path = `/v1beta/models/${encodedModel}:generateContent`;
        const { enabled = false, url = '' } = proxySettings;

        if (enabled && url) {
            const trimmedUrl = url.trim();
            if (!trimmedUrl) {
                throw new Error("代理已启用，但代理地址为空");
            }
            const shouldAppendPath = !/\/models\//i.test(trimmedUrl) && !trimmedUrl.includes(':generateContent');
            const normalizedBase = trimmedUrl.endsWith('/') ? trimmedUrl.slice(0, -1) : trimmedUrl;
            return shouldAppendPath ? `${normalizedBase}${path}` : trimmedUrl;
        }

        return `https://generativelanguage.googleapis.com${path}`;
    }

    function formatResponseSnippet(responseText, limit = 200) {
        if (typeof responseText !== 'string') return '';
        const snippet = responseText.trim().replace(/\s+/g, ' ').slice(0, limit);
        return snippet ? ` | 响应片段: ${snippet}` : '';
    }

    function safeJSONParse(responseText, contextLabel = 'AI接口') {
        if (typeof responseText !== 'string' || responseText.trim() === '') {
            throw new Error(`${contextLabel}响应为空`);
        }
        try {
            return JSON.parse(responseText);
        } catch (error) {
            const snippet = responseText.trim().replace(/\s+/g, ' ').slice(0, 200);
            throw new Error(`${contextLabel}响应不是合法JSON: ${error.message}${snippet ? ` | 片段: ${snippet}` : ''}`);
        }
    }

    async function makeSummaryRequest(settings, prompt) {
        const { ai_provider, ai_api_key, ai_api_url, ai_model, ai_timeout, proxy_enabled, proxy_url } = settings;
        const proxySettings = { enabled: proxy_enabled, url: proxy_url };

        return new Promise((resolve, reject) => {
            const requestDetails = {
                method: 'POST',
                url: '',
                headers: { 'Content-Type': 'application/json' },
                data: '',
                timeout: parseInt(ai_timeout, 10) || 20000,
                ontimeout: () => reject(new Error('摘要生成超时')),
                onload: null,
                onerror: () => reject(new Error('摘要请求网络失败'))
            };

            if (ai_provider === 'gemini') {
                try {
                    requestDetails.url = buildGeminiEndpoint(ai_model, proxySettings);
                } catch (configError) {
                    reject(configError);
                    return;
                }
                if (ai_api_key) {
                    requestDetails.headers['x-goog-api-key'] = ai_api_key.trim();
                }
                requestDetails.data = JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 300 }
                });

                requestDetails.onload = (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = safeJSONParse(response.responseText, 'Gemini');
                            const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
                            resolve({ summary: summary.trim() });
                        } catch (e) {
                            reject(new Error(`解析摘要响应失败: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`摘要生成API错误: ${response.status} ${response.statusText || ''}${formatResponseSnippet(response.responseText)}`));
                    }
                };
            } else { // OpenAI
                requestDetails.url = (proxy_enabled && proxy_url) ? proxy_url : ai_api_url;
                requestDetails.headers['Authorization'] = `Bearer ${ai_api_key}`;
                requestDetails.data = JSON.stringify({
                    model: ai_model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 300
                });

                requestDetails.onload = (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = safeJSONParse(response.responseText, 'OpenAI');
                            const summary = result.choices[0].message.content || '';
                            resolve({ summary: summary.trim() });
                        } catch (e) {
                            reject(new Error(`解析摘要响应失败: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`摘要生成API错误: ${response.status} ${response.statusText || ''}${formatResponseSnippet(response.responseText)}`));
                    }
                };
            }

            GM_xmlhttpRequest(requestDetails);
        });
    }
    async function addLog(level, message, details = {}) {
        let logs;
        try {
            logs = JSON.parse(await GM_getValue('nqs_logs', '[]') || '[]');
            if (!Array.isArray(logs)) logs = [];
        } catch (error) {
            console.error("NQS - 解析本地日志失败:", error);
            logs = [];
        }

        const timestamp = Date.now();
        const normalizedLevel = normalizeLogLevel(level);
        let normalizedContext = {};
        try {
            normalizedContext = normalizeLogContext(details) || {};
        } catch (error) {
            normalizedContext = { note: '日志上下文序列化失败', serializerError: serializeErrorForLog(error) };
        }

        const tags = extractLogTags(details);
        if (normalizedContext && typeof normalizedContext === 'object') {
            delete normalizedContext.tags;
            delete normalizedContext.logTags;
        }

        let extractedError = normalizedContext.error;
        if (extractedError) {
            delete normalizedContext.error;
        } else if (details instanceof Error) {
            extractedError = serializeErrorForLog(details);
        } else if (details && typeof details === 'object' && details.error instanceof Error) {
            extractedError = serializeErrorForLog(details.error);
        }

        const action = details && typeof details === 'object' && typeof details.action === 'string' ? details.action : undefined;
        const component = details && typeof details === 'object' && typeof details.component === 'string' ? details.component : undefined;
        const messageText = truncateLogString(message);

        const logEntry = {
            id: `${timestamp}-${Math.random().toString(16).slice(2, 8)}`,
            version: LOG_SCHEMA_VERSION,
            timestamp,
            level: normalizedLevel,
            message: messageText,
            page: getCurrentPageMeta(),
            tags: tags.length ? tags : undefined,
            context: normalizedContext && Object.keys(normalizedContext).length ? normalizedContext : undefined,
            action,
            component
        };

        if (!logEntry.action) delete logEntry.action;
        if (!logEntry.component) delete logEntry.component;
        if (!logEntry.context) delete logEntry.context;
        if (!logEntry.tags) delete logEntry.tags;
        if (extractedError) logEntry.error = extractedError;

        logs.unshift(logEntry);
        if (logs.length > LOG_LIMIT) logs.splice(LOG_LIMIT);
        await GM_setValue('nqs_logs', JSON.stringify(logs));
        logToConsole(normalizedLevel, messageText, logEntry);
    }
    async function loadAllSettings() { const settings = {}; for (const key of Object.keys(SETTINGS_DEFAULTS)) { settings[key] = await GM_getValue(key, SETTINGS_DEFAULTS[key]); } return settings; }
    function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }
    async function applyTheme() { const theme = await GM_getValue('theme', SETTINGS_DEFAULTS.theme); const container = document.getElementById('NQS_GLOBAL_CONTAINER'); if(container) container.dataset.theme = theme; }

    // ===================================================================
    // ===================== UI创建与管理 (CSP-Ready) =====================
    // ===================================================================
    function closeAllNQSPopups() { const container = document.getElementById('NQS_GLOBAL_CONTAINER'); if (container) container.querySelectorAll('.nqs-overlay').forEach(el => el.remove()); }
    function createBasePanel(title, subtitle = '', options = {}) {
        injectStyles();
        const container = document.getElementById('NQS_GLOBAL_CONTAINER');
        const overlay = document.createElement('div');
        overlay.className = 'nqs-overlay';
        if (options.panelId) overlay.id = options.panelId;
        if (options.isNested) {
            const existingOverlays = container.querySelectorAll('.nqs-overlay');
            let topZ = 100000;
            if (existingOverlays.length > 0) {
                const zIndexes = Array.from(existingOverlays).map(el => parseInt(window.getComputedStyle(el).zIndex, 10));
                const maxZ = Math.max(...zIndexes.filter(z => !isNaN(z)));
                if (isFinite(maxZ)) topZ = maxZ;
            }
            overlay.style.zIndex = topZ + 1;
        }
        const panel = document.createElement('div');
        panel.className = `nqs-panel ${options.panelClass || ''}`;
        if (options.maxWidth) panel.style.maxWidth = options.maxWidth;
        const header = document.createElement('div');
        header.className = 'nqs-header';
        const h1 = document.createElement('h1');
        h1.textContent = title;
        header.appendChild(h1);
        if (subtitle) {
            const p = document.createElement('p');
            p.textContent = subtitle;
            header.appendChild(p);
        }
        const body = document.createElement('div');
        body.className = 'nqs-body';
        const footer = document.createElement('div');
        footer.className = 'nqs-footer';
        panel.appendChild(header);
        panel.appendChild(body);
        panel.appendChild(footer);
        overlay.appendChild(panel);
        container.appendChild(overlay);
        const close = () => { overlay.classList.remove('visible'); setTimeout(() => overlay.remove(), 300); };
        panel.addEventListener('click', e => e.stopPropagation());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        setTimeout(() => overlay.classList.add('visible'), 10);
        return { overlay, body, footer, close };
    }
    function highlightJson(jsonString) { if (typeof jsonString !== 'string') jsonString = JSON.stringify(jsonString, undefined, 2); jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) { let cls = 'json-number'; if (/^"/.test(match)) { if (/:$/.test(match)) { cls = 'json-key'; } else { cls = 'json-string'; } } else if (/true|false/.test(match)) { cls = 'json-boolean'; } else if (/null/.test(match)) { cls = 'json-null'; } return '<span class="' + cls + '">' + match + '</span>'; });}
    function showAlertModal(title, message) { return new Promise((resolve) => { const { body, footer, close } = createBasePanel(title, '', { maxWidth: '480px', isNested: true }); setSafeInnerHTML(body, `<p class="nqs-p">${message}</p>`); setSafeInnerHTML(footer, `<div style="flex-grow: 1;"></div><button id="nqs-alert-ok" class="nqs-button nqs-button-primary">确定</button>`); footer.querySelector('#nqs-alert-ok').onclick = () => { close(); resolve(); }; });}
    function showConfirmationModal(title, message, options = {}) { return new Promise((resolve) => { const { body, footer, close } = createBasePanel(title, '', { maxWidth: '480px', isNested: true }); const { danger = false, confirmText = '确认', cancelText = '取消' } = options; setSafeInnerHTML(body, `<p class="nqs-p">${message}</p>`); const confirmClass = danger ? 'nqs-button-danger' : 'nqs-button-primary'; setSafeInnerHTML(footer, `<button id="nqs-confirm-cancel" class="nqs-button nqs-button-secondary">${cancelText}</button><div style="flex-grow: 1;"></div><button id="nqs-confirm-ok" class="nqs-button ${confirmClass}">${confirmText}</button>`); footer.querySelector('#nqs-confirm-ok').onclick = () => { close(); resolve(true); }; footer.querySelector('#nqs-confirm-cancel').onclick = () => { close(); resolve(false); }; });}
    function showDetailsModal(title, detailsObject) { const { body, footer, close } = createBasePanel(title, '上下文详细信息', { maxWidth: '800px', isNested: true }); body.classList.add('nqs-json-viewer'); const pre = document.createElement('pre'); pre.style.whiteSpace = 'pre-wrap'; pre.style.wordWrap = 'break-word'; pre.style.margin = '0'; setSafeInnerHTML(pre, highlightJson(detailsObject)); body.appendChild(pre); setSafeInnerHTML(footer, `<div style="flex-grow: 1;"></div><button class="nqs-button nqs-button-primary">关闭</button>`); footer.querySelector('button').addEventListener('click', close);}

    async function openSettingsPanel() {
        closeAllNQSPopups();
        const { body, footer, close } = createBasePanel('⚙️ 脚本设置', '配置您的 Notion AI 快速保存助手，实现高效网页收藏', { maxWidth: '900px', panelClass: 'nqs-panel--settings' });
        const elements = {};

        // 创建设置分组的辅助函数
        const createSettingsGroup = (title, description = '', icon = '⚙️') => {
            const group = document.createElement('div');
            group.className = 'nqs-settings-group';

            const header = document.createElement('div');
            header.className = 'nqs-settings-group-header';
            header.innerHTML = `
                <div class="nqs-settings-group-icon">${icon}</div>
                <div class="nqs-settings-group-content">
                    <h3 class="nqs-settings-group-title">${title}</h3>
                    ${description ? `<p class="nqs-settings-group-description">${description}</p>` : ''}
                </div>
            `;

            const content = document.createElement('div');
            content.className = 'nqs-settings-group-content';

            group.appendChild(header);
            group.appendChild(content);
            return { group, content };
        };

        // 创建设置字段的辅助函数
        const createSettingField = (parent, id, labelText, descText, type = 'text', options = {}) => {
            const field = document.createElement('div');
            field.className = 'nqs-setting-field';
            // 用于后续显隐控制（例如代理URL）
            field.dataset.fieldId = id;

            // 支持全宽字段（无标签或明确要求时）
            if (!labelText || options.fullWidth) {
                field.classList.add('nqs-setting-field--full');
            }

            const labelGroup = document.createElement('div');
            labelGroup.className = 'nqs-setting-label-group';

            const label = document.createElement('label');
            label.htmlFor = 'nqs-' + id;
            label.textContent = labelText;
            labelGroup.appendChild(label);

            if (descText) {
                const desc = document.createElement('p');
                desc.className = 'nqs-setting-description';
                desc.innerHTML = createSafeHTML(descText);
                labelGroup.appendChild(desc);
            }

            field.appendChild(labelGroup);

            const inputGroup = document.createElement('div');
            inputGroup.className = 'nqs-setting-input-group';

            const creators = {
                toggle: () => createToggleSwitch(id),
                select: () => createSelectInput(id, options.choices || []),
                textarea: () => createTextareaInput(id, options.placeholder || ''),
                number: () => createNumberInput(id, options.min, options.max, options.step),
                multiselect: () => createMultiSelectInput(id, options.choices || [])
            };
            const input = creators[type] ? creators[type]() : createTextInput(id, type, options.placeholder || '');

            inputGroup.appendChild(input);
            field.appendChild(inputGroup);
            parent.appendChild(field);

            elements[id] = input;
            return field;
        };

        // 创建开关组件
        const createToggleSwitch = (id) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'nqs-toggle-switch';

            const label = document.createElement('label');
            label.className = 'nqs-switch';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'nqs-' + id;

            const span = document.createElement('span');
            span.className = 'nqs-slider';

            label.appendChild(input);
            label.appendChild(span);
            wrapper.appendChild(label);

            return wrapper;
        };

        // 创建选择器组件
        const createSelectInput = (id, choices) => {
            const select = document.createElement('select');
            select.id = 'nqs-' + id;
            select.className = 'nqs-select';

            choices.forEach(choice => {
                const option = document.createElement('option');
                option.value = choice.value;
                option.textContent = choice.label;
                select.appendChild(option);
            });

            return select;
        };

        // 创建多选选择器组件（统一风格）
        const createMultiSelectInput = (id, choices) => {
            const select = document.createElement('select');
            select.id = 'nqs-' + id;
            select.className = 'nqs-select';
            select.multiple = true;
            choices.forEach(choice => {
                const option = document.createElement('option');
                option.value = choice.value;
                option.textContent = choice.label;
                select.appendChild(option);
            });
            return select;
        };

        // 创建文本输入组件
        const createTextInput = (id, type, placeholder) => {
            const input = document.createElement('input');
            input.id = 'nqs-' + id;
            input.className = 'nqs-input';
            input.type = type;
            if (placeholder) input.placeholder = placeholder;
            return input;
        };

        // 创建数字输入组件
        const createNumberInput = (id, min, max, step) => {
            const input = document.createElement('input');
            input.id = 'nqs-' + id;
            input.className = 'nqs-input';
            input.type = 'number';
            if (min !== undefined) input.min = min;
            if (max !== undefined) input.max = max;
            if (step !== undefined) input.step = step;
            return input;
        };

        // 创建文本域组件
        const createTextareaInput = (id, placeholder) => {
            const textarea = document.createElement('textarea');
            textarea.id = 'nqs-' + id;
            textarea.className = 'nqs-textarea';
            if (placeholder) textarea.placeholder = placeholder;
            return textarea;
        };

        // 创建分类管理组件
        const createCategoryManager = (parent) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'nqs-category-manager-section';

            const header = document.createElement('div');
            header.className = 'nqs-category-manager-header';
            header.innerHTML = `
                <h4>分类列表</h4>
                <p>管理您的自定义分类，这些分类将用于手动选择和AI自动分类</p>
            `;
            categorySection.appendChild(header);

            const inputGroup = document.createElement('div');
            inputGroup.className = 'nqs-category-input-group';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'nqs-category-input';
            input.placeholder = '输入新分类名称...';
            input.id = 'nqs-new-category-input';

            const addBtn = document.createElement('button');
            addBtn.className = 'nqs-button nqs-button-primary nqs-category-add-btn';
            addBtn.textContent = '添加分类';
            addBtn.id = 'nqs-add-category-btn';

            inputGroup.appendChild(input);
            inputGroup.appendChild(addBtn);
            categorySection.appendChild(inputGroup);

            const categoryList = document.createElement('div');
            categoryList.className = 'nqs-category-list-container';
            categorySection.appendChild(categoryList);

            parent.appendChild(categorySection);
            return { input, addBtn, categoryList };
        };

        // 创建AI模型选择器组件
        const createModelSelector = (parent) => {
            const modelSection = document.createElement('div');
            modelSection.className = 'nqs-model-selector-section';

            const inputGroup = document.createElement('div');
            inputGroup.className = 'nqs-model-input-group';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'nqs-input';
            input.id = 'nqs-ai_model';
            input.placeholder = '选择AI模型...';

            const fetchBtn = document.createElement('button');
            fetchBtn.className = 'nqs-icon-button nqs-fetch-models-btn';
            fetchBtn.title = '获取可用模型列表';
            fetchBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1.293-2.707a1 1 0 0 1-1.414-1.414l.001-.001 2.122-2.121a1 1 0 0 1 1.414 0l2.121 2.121a1 1 0 0 1-1.414 1.414L13 16.414V20a1 1 0 1 1-2 0v-3.586l-.293.293zM13 4a1 1 0 1 1 2 0v3.586l.293-.293a1 1 0 1 1 1.414 1.414l-2.121 2.121a1 1 0 0 1-1.414 0L10.05 8.707a1 1 0 0 1 1.414-1.414L11.76 7.586 11 7.586V4h2z"></path>
                </svg>
            `;

            inputGroup.appendChild(input);
            inputGroup.appendChild(fetchBtn);
            modelSection.appendChild(inputGroup);

            const dropdown = document.createElement('div');
            dropdown.className = 'nqs-model-dropdown';
            modelSection.appendChild(dropdown);

            parent.appendChild(modelSection);
            return { input, fetchBtn, dropdown };
        };

        // 创建设置内容容器（供右侧内容滚动）
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'nqs-settings-container';

        // 1. 外观设置组
        const appearanceGroup = createSettingsGroup('🎨 外观设置', '自定义界面主题和显示效果', '🎨');
        createSettingField(appearanceGroup.content, 'theme', '主题模式', '选择UI的显示主题，"自动"将跟随系统设置', 'select', {
            choices: [
                { value: 'auto', label: '自动 (跟随系统)' },
                { value: 'light', label: '明亮主题' },
                { value: 'dark', label: '暗黑主题' }
            ]
        });

        // 2. 核心功能组
        const coreGroup = createSettingsGroup('🚀 核心功能', '配置脚本的基本功能和AI自动分类', '🚀');
        createSettingField(coreGroup.content, 'ai_enabled', 'AI 自动分类', '开启后将自动判断分类，关闭则需要手动选择', 'toggle');
        createSettingField(coreGroup.content, 'read_later_enabled', '"稍后读"功能', '开启后将显示一个独立的"稍后读"快捷按钮', 'toggle');
        createSettingField(coreGroup.content, 'read_later_category', '"稍后读"分类名', '指定用于"稍后读"功能的分类名称', 'text', { placeholder: '例如：稍后读' });

        // 3. 通知设置组
        const notificationGroup = createSettingsGroup('🔔 通知设置', '配置各种通知和进度提示', '🔔');
        createSettingField(notificationGroup.content, 'notification_enabled', '浏览器通知', '启用桌面通知功能', 'toggle');
        createSettingField(notificationGroup.content, 'notification_success_enabled', '成功通知', '保存成功时显示通知', 'toggle');
        createSettingField(notificationGroup.content, 'notification_error_enabled', '错误通知', '保存失败时显示通知', 'toggle');
        createSettingField(notificationGroup.content, 'progress_indicator_enabled', '顶部进度条', '显示操作进度的顶部状态栏', 'toggle');

        // 4. 分类管理组
        const categoryGroup = createSettingsGroup('📂 分类管理', '管理您的自定义分类列表', '📂');
        const categoryManager = createCategoryManager(categoryGroup.content);

        // 5. Notion 配置组
        const notionGroup = createSettingsGroup('📝 Notion 配置', '配置Notion API和数据库连接（重要）', '📝');
        createSettingField(notionGroup.content, 'notion_api_key', 'Notion API Key', '请填入您的Notion Internal Integration Token', 'password', { placeholder: 'sk_...' });
        createSettingField(notionGroup.content, 'database_id', '数据库ID', '请填入您要保存到的Notion数据库ID', 'text', { placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });

        const fieldMappingHeader = document.createElement('div');
        fieldMappingHeader.className = 'nqs-subsection-header';
        fieldMappingHeader.innerHTML = '<h4>数据库字段名称</h4><p>请确保以下名称与您Notion数据库中的属性列名完全一致</p>';
        notionGroup.content.appendChild(fieldMappingHeader);

        createSettingField(notionGroup.content, 'prop_name_title', '标题属性名', '', 'text', { placeholder: '例如：名称' });
        createSettingField(notionGroup.content, 'prop_name_url', '链接属性名', '', 'text', { placeholder: '例如：链接' });
        createSettingField(notionGroup.content, 'prop_name_category', '分类属性名', '', 'text', { placeholder: '例如：类型' });

        // 6. AI 配置组
        const aiGroup = createSettingsGroup('🤖 AI 配置', '配置AI提供商和模型参数', '🤖');
        createSettingField(aiGroup.content, 'ai_provider', 'AI 提供商', '选择用于内容分类的 AI 服务', 'select', {
            choices: [
                { value: 'openai', label: 'OpenAI (GPT)' },
                { value: 'gemini', label: 'Google Gemini' }
            ]
        });
        createSettingField(aiGroup.content, 'ai_api_key', 'AI API Key', '填入所选提供商的 API Key', 'password', { placeholder: 'sk-... 或 AIza...' });
        createSettingField(aiGroup.content, 'ai_api_url', 'AI API Endpoint', '兼容 OpenAI 格式的 API 地址，Gemini 可留空', 'text', { placeholder: 'https://api.openai.com/v1/chat/completions' });

        const modelSelector = createModelSelector(aiGroup.content);
        elements['ai_model'] = modelSelector.input;

        createSettingField(aiGroup.content, 'ai_include_body', '附加网页正文', '开启后会提取并发送部分正文，可能增加成本但有助于分析复杂页面', 'toggle');
        createSettingField(aiGroup.content, 'ai_timeout', 'AI分析超时(ms)', 'AI进行内容分析请求的等待上限', 'number', { min: 5000, max: 60000, step: 1000 });
        createSettingField(aiGroup.content, 'ai_model_fetch_timeout', '获取模型超时(ms)', '获取可用模型列表的等待上限', 'number', { min: 5000, max: 30000, step: 1000 });
        createSettingField(aiGroup.content, 'ai_retry_count', 'AI重试次数', 'AI请求失败时的重试次数', 'number', { min: 0, max: 5, step: 1 });
        createSettingField(aiGroup.content, 'ai_confidence_threshold', '置信度阈值', '低于此阈值时将提示用户手动确认分类', 'number', { min: 0.1, max: 1.0, step: 0.1 });
        createSettingField(aiGroup.content, 'ai_learning_enabled', 'AI分类学习', '记录用户的分类习惯，提高AI分类准确性', 'toggle');

        // 7. 内容提取增强组
        const contentGroup = createSettingsGroup('📊 内容提取增强', '配置页面内容提取和AI分析功能', '📊');
        createSettingField(contentGroup.content, 'content_extraction_enabled', '启用内容提取增强', '提取页面的详细信息，如发布时间、阅读时间等', 'toggle');
        createSettingField(contentGroup.content, 'auto_summary_enabled', '自动生成摘要', '使用AI自动为保存的页面生成内容摘要', 'toggle');
        createSettingField(contentGroup.content, 'auto_keywords_enabled', '自动提取关键词', '使用AI自动提取页面关键词', 'toggle');
        createSettingField(contentGroup.content, 'content_save_mode', '内容保存模式', '选择保存到Notion的内容详细程度', 'select', {
            choices: [
                { value: 'link', label: '仅链接' },
                { value: 'summary', label: '链接+摘要' },
                { value: 'full', label: '完整内容' }
            ]
        });

        // 8. AI 提示词组
        const promptGroup = createSettingsGroup('💬 AI 提示词', '自定义AI分类指令模板（高级用户）', '💬');
        const promptHeader = document.createElement('div');
        promptHeader.className = 'nqs-prompt-header';
        promptHeader.innerHTML = `
            <div class="nqs-prompt-info">
                <h4>系统提示词</h4>
                <p>自定义AI分类的指令模板，影响分类的准确性和风格</p>
            </div>
            <button id="nqs-reset-prompt" class="nqs-button nqs-button-text">
                <span>🔄</span> 恢复默认
            </button>
        `;
        promptGroup.content.appendChild(promptHeader);

        // 提示词模式切换（模板 / 自定义）
        const promptMode = document.createElement('div');
        promptMode.className = 'nqs-segmented';
        promptMode.innerHTML = `
            <button class="nqs-seg-btn is-active" data-mode="template">模板</button>
            <button class="nqs-seg-btn" data-mode="custom">自定义</button>
        `;
        promptGroup.content.appendChild(promptMode);
        // 默认模板模式：隐藏文本域，仅展示卡片
        promptGroup.content.setAttribute('data-prompt-mode', 'template');

        createSettingField(
            promptGroup.content,
            'ai_prompt',
            '',
            '',
            'textarea',
            { placeholder: '输入自定义的 AI 系统提示词模板（支持 {categories}、{page_metadata}、{optional_body_section} 占位符）', fullWidth: true }
        );

        // 提示词文本域增强：自适应高度 + 计数信息
        const enhanceSystemPromptField = () => {
            const promptField = elements && elements['ai_prompt'];
            if (!promptField) return;
            promptField.classList.add('nqs-prompt-textarea');
            const autosize = () => {
                promptField.style.height = 'auto';
                const maxPx = Math.max(200, Math.floor(window.innerHeight * 0.5));
                promptField.style.height = Math.min(promptField.scrollHeight + 2, maxPx) + 'px';
            };
            promptField.addEventListener('input', autosize);
            setTimeout(autosize, 0);

            const meta = document.createElement('div');
            meta.className = 'nqs-prompt-meta';
            const hint = document.createElement('span');
            hint.textContent = '可使用占位符 {categories}、{page_metadata}、{optional_body_section}';
            const counter = document.createElement('span');
            counter.className = 'nqs-prompt-counter';
            const updateCounter = () => { counter.textContent = (promptField.value || '').length + ' 字符'; };
            promptField.addEventListener('input', updateCounter);
            setTimeout(updateCounter, 0);
            meta.appendChild(hint);
            meta.appendChild(counter);
            const inputGroup = promptField.parentElement; // .nqs-setting-input-group
            if (inputGroup) inputGroup.appendChild(meta);
        };
        enhanceSystemPromptField();

        // 覆盖旧的提示词输入方式：仅使用模板管理
        (async () => {
            try {
                // 清空提示词分组内容，改为模板模式
                if (promptGroup && promptGroup.content) {
                    promptGroup.content.innerHTML = '';
                }

                const checkPlaceholders = (text) => {
                    const t = String(text || '');
                    const hasPageMeta = /\{page_metadata\}/.test(t);
                    const hasCategories = /\{categories\}/.test(t);
                    const hasOptional = /\{optional_body_section\}/.test(t);
                    const missing = [];
                    if (!hasPageMeta) missing.push('{page_metadata}');
                    if (!hasCategories) missing.push('{categories}');
                    if (!hasOptional) missing.push('{optional_body_section}');
                    return { hasPageMeta, hasCategories, hasOptional, missing };
                };

                let promptTemplates = [];
                let activeTemplateId = await GM_getValue('ai_active_template_id', SETTINGS_DEFAULTS.ai_active_template_id);
                try {
                    promptTemplates = JSON.parse(await GM_getValue('ai_prompt_templates', SETTINGS_DEFAULTS.ai_prompt_templates) || '[]');
                } catch { promptTemplates = []; }
                if (!promptTemplates.find(t => t.id === 'default')) {
                    promptTemplates.unshift({ id: 'default', title: '默认', content: SETTINGS_DEFAULTS.ai_prompt, builtIn: true });
                } else {
                    const d = promptTemplates.find(t => t.id === 'default');
                    if (!d.content) d.content = SETTINGS_DEFAULTS.ai_prompt;
                }
                if (!activeTemplateId) activeTemplateId = 'default';

                const saveTemplatesState = async () => {
                    await GM_setValue('ai_prompt_templates', JSON.stringify(promptTemplates));
                    await GM_setValue('ai_active_template_id', activeTemplateId);
                };

                const openTemplateEditor = async (tpl) => {
                    const creating = !tpl;
                    const data = tpl ? { ...tpl } : { id: `t_${Date.now()}`, title: '', content: '', builtIn: false };
                    const { body: mb, footer: mf, close } = createBasePanel(creating ? '新增模板' : '编辑模板', '必须包含 {page_metadata}、{categories}、{optional_body_section}', { maxWidth: '720px', isNested: true });
                    mb.innerHTML = `
                        <div class="nqs-field nqs-field-full">
                            <div class="nqs-setting-label-group"><label>模板名称</label></div>
                            <div class="nqs-setting-input-group"><input type="text" id="nqs-tpl-title" class="nqs-input" placeholder="例如：精确分类"></div>
                        </div>
                        <div class="nqs-field nqs-field-full">
                            <div class="nqs-setting-label-group"><label>模板内容</label><p class="nqs-setting-description">必须包含 {page_metadata}、{categories}、{optional_body_section}</p></div>
                            <div class="nqs-setting-input-group"><textarea id="nqs-tpl-content" class="nqs-textarea" rows="10" placeholder="输入模板内容..."></textarea></div>
                        </div>
                    `;
                    mf.innerHTML = `<button class="nqs-button nqs-button-secondary" id="nqs-tpl-cancel">取消</button><div style="flex:1"></div><button class="nqs-button nqs-button-primary" id="nqs-tpl-ok">保存</button>`;
                    const ti = mb.querySelector('#nqs-tpl-title');
                    const tc = mb.querySelector('#nqs-tpl-content');
                    ti.value = data.title || '';
                    tc.value = data.content || '';
                    const doSave = async () => {
                        const title = ti.value.trim();
                        const content = tc.value;
                        if (!title) { await showAlertModal('校验失败', '请填写模板名称'); return; }
                        const chk = checkPlaceholders(content);
                        if (chk.missing.length) { await showAlertModal('占位符缺失', `模板缺少：${chk.missing.join(', ')}`); return; }
                        data.title = title; data.content = content;
                        if (creating) promptTemplates.unshift(data); else {
                            const i = promptTemplates.findIndex(t => t.id === data.id); if (i >= 0) promptTemplates[i] = data;
                        }
                        await saveTemplatesState();
                        renderPromptTemplates();
                        close();
                    };
                    mf.querySelector('#nqs-tpl-ok').addEventListener('click', doSave);
                    mf.querySelector('#nqs-tpl-cancel').addEventListener('click', close);
                };

                const renderPromptTemplates = () => {
                    promptGroup.content.innerHTML = '';
                    const header = document.createElement('div');
                    header.className = 'nqs-prompt-header';
                    header.innerHTML = `
                        <div class="nqs-prompt-info">
                            <h4>模板列表</h4>
                            <p>仅展示名称，点击可预览内容</p>
                        </div>
                        <div class="nqs-prompt-actions">
                            <button id="nqs-add-template" class="nqs-button nqs-button-primary"><span>＋</span> 新增模板</button>
                        </div>`;
                    promptGroup.content.appendChild(header);

                    const section = document.createElement('div');
                    section.className = 'nqs-prompt-templates';
                    const grid = document.createElement('div');
                    grid.className = 'nqs-template-grid';
                    section.appendChild(grid);
                    promptGroup.content.appendChild(section);

                    promptTemplates.forEach(tpl => {
                        const card = document.createElement('div');
                        const isActive = tpl.id === activeTemplateId;
                        card.className = 'nqs-template-card nqs-template-card--compact' + (isActive ? ' is-active' : '');
                        card.innerHTML = `
                            <div class="nqs-template-card-top">
                                <label class="nqs-template-select"><input type="radio" name="nqs-active-template" value="${tpl.id}" ${isActive ? 'checked' : ''}></label>
                                <h5 class="nqs-template-title">${tpl.title}${tpl.builtIn ? '（默认）' : ''}</h5>
                            </div>
                            <div class="nqs-template-card-actions">
                                <button class="nqs-button nqs-button-secondary" data-act="edit" data-id="${tpl.id}">编辑</button>
                                ${tpl.builtIn ? '' : `<button class="nqs-button nqs-button-danger" data-act="del" data-id="${tpl.id}">删除</button>`}
                            </div>`;
                        grid.appendChild(card);
                    });

                    // 选择模板（单选）
                    grid.addEventListener('change', async (e) => {
                        const input = e.target; if (input && input.name === 'nqs-active-template') {
                            activeTemplateId = input.value;
                            // 更新选中样式
                            grid.querySelectorAll('.nqs-template-card').forEach(card => card.classList.remove('is-active'));
                            const activeCard = input.closest('.nqs-template-card');
                            if (activeCard) activeCard.classList.add('is-active');

                            const at = promptTemplates.find(t => t.id === activeTemplateId);
                            const chk = checkPlaceholders(at?.content || '');
                            if (chk.missing.length) await showAlertModal('占位符缺失', `当前模板缺少：${chk.missing.join(', ')}`);
                            await saveTemplatesState();
                        }
                    });

                    // 卡片点击快捷选择 + 操作按钮
                    grid.addEventListener('click', async (e) => {
                        const actBtn = e.target.closest('button[data-act]');
                        if (actBtn) {
                            const id = actBtn.getAttribute('data-id');
                            const act = actBtn.getAttribute('data-act');
                            const idx = promptTemplates.findIndex(t => t.id === id); if (idx < 0) return;
                            if (act === 'del') {
                                if (promptTemplates[idx].builtIn) return;
                                const ok = await showConfirmationModal('删除模板', '确定要删除该模板吗？', { danger: true });
                                if (!ok) return;
                                const removingActive = (activeTemplateId === id);
                                promptTemplates.splice(idx, 1);
                                if (removingActive) activeTemplateId = 'default';
                                await saveTemplatesState();
                                renderPromptTemplates();
                            } else if (act === 'edit') {
                                await openTemplateEditor(promptTemplates[idx]);
                            }
                            return;
                        }

                        // 非操作区域点击则选中该卡片
                        const card = e.target.closest('.nqs-template-card');
                        if (card) {
                            const radio = card.querySelector('input[type="radio"]');
                            if (radio) {
                                radio.checked = true;
                                radio.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                    });

                    header.querySelector('#nqs-add-template').addEventListener('click', async () => { await openTemplateEditor(); });
                };
                renderPromptTemplates();
            } catch (e) { console.warn('Prompt templates init failed', e); }
        })();

        // 提示词模板库（卡片列表 + 多选插入）
        const initPromptTemplates = () => {
            const promptTextarea = elements && elements['ai_prompt'];
            if (!promptTextarea) return;

            const templates = [
                {
                    id: 'precise-classify',
                    title: '精确分类（严格匹配）',
                    brief: '强调只从给定列表中选择，并说明优先级与权重',
                    content: '【精确分类】\n- 仅从预设列表中选择，禁止输出列表外类别\n- 优先级：实时内容 > 元数据 > 正文快照\n- 若无法确定，选择最具体且覆盖度最高的一项\n- 输出：仅类别名，无其他内容'
                },
                {
                    id: 'strict-output',
                    title: '严格输出（零其他字符）',
                    brief: '输出只包含类别名称，严禁标点或解释',
                    content: '【严格输出】\n- 仅输出最终分类名称\n- 禁止任何标点、引号、解释或多余字符\n- 如果分类不在列表中，选择“其他”'
                },
                {
                    id: 'learning-context',
                    title: '含学习上下文偏好',
                    brief: '结合域名历史修正进行偏好调整',
                    content: '【学习上下文】\n- 结合历史修正示例调整判断偏好\n- 若历史记录与当前判断冲突，参考历史选择但以当前内容为准\n- 如无冲突，优先采纳更具体类别'
                }
            ];

            const section = document.createElement('div');
            section.className = 'nqs-prompt-templates';
            section.innerHTML = `
                <div class="nqs-prompt-templates-header">
                    <h4>模板库</h4>
                    <div class="nqs-prompt-templates-actions">
                        <button class="nqs-button nqs-button-secondary" id="nqs-insert-selected" disabled>插入所选</button>
                        <button class="nqs-button nqs-button-primary" id="nqs-apply-selected" disabled>应用所选</button>
                    </div>
                </div>
                <div class="nqs-template-grid"></div>
            `;

            const grid = section.querySelector('.nqs-template-grid');
            const selected = new Set();

            const updateBulkBtn = () => {
                const btn1 = section.querySelector('#nqs-insert-selected');
                const btn2 = section.querySelector('#nqs-apply-selected');
                const disabled = selected.size === 0;
                btn1.disabled = disabled;
                btn2.disabled = disabled;
            };

            const previewTemplate = (tpl) => {
                const { body: mBody, footer: mFooter, close } = createBasePanel(`模板预览 - ${tpl.title}`, '', { maxWidth: '800px', isNested: true });
                const pre = document.createElement('pre');
                pre.style.whiteSpace = 'pre-wrap';
                pre.style.wordWrap = 'break-word';
                pre.style.margin = '0';
                pre.textContent = tpl.content;
                mBody.appendChild(pre);
                mFooter.innerHTML = '<div style="flex:1"></div><button class="nqs-button nqs-button-primary">关闭</button>';
                mFooter.querySelector('button').addEventListener('click', close);
            };

            templates.forEach(tpl => {
                const card = document.createElement('div');
                card.className = 'nqs-template-card';
                card.innerHTML = `
                    <div class="nqs-template-card-top">
                        <label class="nqs-template-select">
                            <input type="checkbox" data-id="${tpl.id}" />
                        </label>
                        <h5 class="nqs-template-title">${tpl.title}</h5>
                        <p class="nqs-template-brief">${tpl.brief}</p>
                    </div>
                    <div class="nqs-template-card-actions">
                        <button class="nqs-button nqs-button-text" data-action="preview">预览</button>
                        <button class="nqs-button nqs-button-secondary" data-action="insert">插入</button>
                    </div>
                `;

                card.querySelector('[data-action="preview"]').addEventListener('click', () => previewTemplate(tpl));
                card.querySelector('[data-action="insert"]').addEventListener('click', () => {
                    const joiner = (promptTextarea.value && !promptTextarea.value.endsWith('\n')) ? '\n\n' : '';
                    promptTextarea.value = promptTextarea.value + joiner + tpl.content;
                    promptTextarea.dispatchEvent(new Event('input'));
                });

                const checkbox = card.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) selected.add(tpl.id); else selected.delete(tpl.id);
                    updateBulkBtn();
                });

                grid.appendChild(card);
            });

            section.querySelector('#nqs-insert-selected').addEventListener('click', () => {
                const picked = templates.filter(t => selected.has(t.id)).map(t => t.content);
                if (picked.length === 0) return;
                const addition = picked.join('\n\n');
                const joiner = (promptTextarea.value && !promptTextarea.value.endsWith('\n')) ? '\n\n' : '';
                promptTextarea.value = promptTextarea.value + joiner + addition;
                promptTextarea.dispatchEvent(new Event('input'));
            });

            section.querySelector('#nqs-apply-selected').addEventListener('click', () => {
                const picked = templates.filter(t => selected.has(t.id)).map(t => t.content);
                if (picked.length === 0) return;
                promptTextarea.value = picked.join('\n\n');
                promptTextarea.dispatchEvent(new Event('input'));
                // 切换到“自定义”模式以便查看与微调
                setPromptMode('custom');
            });

            // 将模板区块追加到提示词输入区域之后
            const inputGroup = promptTextarea.parentElement;
            if (inputGroup) inputGroup.appendChild(section);
        };
        initPromptTemplates();

        // 模式切换逻辑
        const setPromptMode = (mode) => {
            if (!mode || (mode !== 'template' && mode !== 'custom')) return;
            promptGroup.content.setAttribute('data-prompt-mode', mode);
            const btns = promptMode.querySelectorAll('.nqs-seg-btn');
            btns.forEach(b => b.classList.toggle('is-active', b.dataset.mode === mode));
        };
        promptMode.addEventListener('click', (e) => {
            const btn = e.target.closest('.nqs-seg-btn');
            if (!btn) return;
            setPromptMode(btn.dataset.mode);
        });

        // 9. 网络配置组
        const networkGroup = createSettingsGroup('🌐 网络配置', '配置代理和自定义网络端点（高级）', '🌐');
        createSettingField(networkGroup.content, 'proxy_enabled', '启用自定义端点', '当需要使用第三方中继服务器或反代地址来访问AI服务时，请开启此项', 'toggle');
        createSettingField(networkGroup.content, 'proxy_url', '端点/代理服务器地址', '一个兼容目标AI提供商API格式的请求中继地址', 'text', { placeholder: 'https://your-proxy.com/api' });

        // 添加所有设置组到容器
        settingsContainer.appendChild(appearanceGroup.group);
        settingsContainer.appendChild(coreGroup.group);
        settingsContainer.appendChild(notificationGroup.group);
        settingsContainer.appendChild(categoryGroup.group);
        settingsContainer.appendChild(notionGroup.group);
        settingsContainer.appendChild(aiGroup.group);
        settingsContainer.appendChild(contentGroup.group);
        settingsContainer.appendChild(promptGroup.group);
        settingsContainer.appendChild(networkGroup.group);

        // --- 左侧侧边导航栏（快速跳转）---
        // 组装分组元数据（用于构建导航和滚动联动）
        const groupsMeta = [
            { key: 'appearance', title: '外观设置', icon: '🎨', el: appearanceGroup.group },
            { key: 'core',       title: '核心功能', icon: '🚀', el: coreGroup.group },
            { key: 'notify',     title: '通知设置', icon: '🔔', el: notificationGroup.group },
            { key: 'category',   title: '分类管理', icon: '📂', el: categoryGroup.group },
            { key: 'notion',     title: 'Notion 配置', icon: '📝', el: notionGroup.group },
            { key: 'ai',         title: 'AI 配置', icon: '🤖', el: aiGroup.group },
            { key: 'content',    title: '内容提取增强', icon: '📊', el: contentGroup.group },
            { key: 'prompt',     title: 'AI 提示词', icon: '💬', el: promptGroup.group },
            { key: 'network',    title: '网络配置', icon: '🌐', el: networkGroup.group }
        ];
        groupsMeta.forEach(g => { if (g.el) g.el.id = `nqs-group-${g.key}`; });

        // 构建布局：左侧导航 + 右侧内容
        const layout = document.createElement('div');
        layout.className = 'nqs-settings-layout';

        const sidebar = document.createElement('aside');
        sidebar.className = 'nqs-settings-sidebar';

        const nav = document.createElement('nav');
        nav.className = 'nqs-settings-nav';
        sidebar.appendChild(nav);

        // 构建导航项
        const navItems = {};
            // 控制点击时的高亮与观察抑制，避免快速切换造成错乱
            let suppressIO = false;
            let navClickTimer = null;

            const buildNavItem = (g) => {
                if (!g || !g.el) return null;
                const a = document.createElement('a');
                a.href = `#${g.el.id}`;
                a.className = 'nqs-nav-item';
                a.setAttribute('data-target', g.el.id);
                a.setAttribute('role', 'button');
                a.setAttribute('tabindex', '0');
                a.innerHTML = `<span class="nqs-nav-icon">${g.icon}</span><span class="nqs-nav-text">${g.title}</span>`;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById(g.el.id);
                    if (!target) return;
                    // 精确滚动到分组顶部（相对于滚动容器）
                    const offsetTop = target.getBoundingClientRect().top - contentWrap.getBoundingClientRect().top + contentWrap.scrollTop;
                    // 若在快速连续点击期间，采用瞬间跳转，避免队列中的平滑动画叠加造成错乱
                    const isInstant = suppressIO === true;
                    contentWrap.scrollTo({ top: offsetTop, behavior: isInstant ? 'auto' : 'smooth' });
                    // 立即同步侧边栏高亮，避免平滑滚动期间高亮不同步
                    setActiveNav(target.id);
                    // 在抑制窗口内忽略 IntersectionObserver 更新，滚动后恢复
                    suppressIO = true;
                    if (navClickTimer) clearTimeout(navClickTimer);
                    navClickTimer = setTimeout(() => { suppressIO = false; }, 400);
                    // 滚动完成后再确认一次（处理不同浏览器的动画时序）
                    setTimeout(() => setActiveNav(target.id), 300);

                    // 鼠标点击后移除焦点，避免与滚动同步产生“双高亮”
                    if (e.detail && e.detail > 0) {
                        setTimeout(() => a.blur(), 0);
                    }
                });
                a.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        a.click();
                    }
                });
                navItems[g.key] = a;
                return a;
            };
        groupsMeta.forEach(g => { const item = buildNavItem(g); if (item) nav.appendChild(item); });

        const contentWrap = document.createElement('div');
        contentWrap.className = 'nqs-settings-content';
        contentWrap.appendChild(settingsContainer);

        layout.appendChild(sidebar);
        layout.appendChild(contentWrap);
        body.appendChild(layout);

        // 激活状态联动（滚动高亮）
        const setActiveNav = (id) => {
            const items = nav.querySelectorAll('.nqs-nav-item');
            items.forEach(it => it.classList.toggle('active', it.getAttribute('data-target') === id));
            // 仅当活动项不在可视区域时才滚动，避免频繁滚动造成“滑动错乱”的观感
            const active = nav.querySelector('.nqs-nav-item.active');
            if (active) {
                const navRect = nav.getBoundingClientRect();
                const itemRect = active.getBoundingClientRect();
                const outOfView = itemRect.top < navRect.top || itemRect.bottom > navRect.bottom;
                if (outOfView && typeof active.scrollIntoView === 'function') {
                    active.scrollIntoView({ block: 'nearest' });
                }
            }
        };
        let io = null;
        const attachObservers = () => {
            if (!('IntersectionObserver' in window)) return;
            if (io) io.disconnect();
            io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!suppressIO && entry.isIntersecting) setActiveNav(entry.target.id);
                });
            }, { root: contentWrap, threshold: [0.1, 0.3, 0.6], rootMargin: '-15% 0px -65% 0px' });
            groupsMeta.forEach(g => {
                if (g.el && g.el.style.display !== 'none') io.observe(g.el);
            });
        };
        attachObservers();
        // 补充：基于滚动位置的高亮同步（作为 IO 的稳定兜底）
        const syncActiveByScroll = () => {
            if (suppressIO) return;
            const wrapRect = contentWrap.getBoundingClientRect();
            let bestId = null;
            let bestDelta = Infinity;
            groupsMeta.forEach(g => {
                if (!g.el || g.el.style.display === 'none') return;
                const rect = g.el.getBoundingClientRect();
                const delta = Math.abs(rect.top - wrapRect.top - 12); // 与容器顶部的距离
                if (delta < bestDelta) { bestDelta = delta; bestId = g.el.id; }
            });
            if (bestId) setActiveNav(bestId);
        };
        const debouncedScrollSync = debounce(syncActiveByScroll, 50);
        contentWrap.addEventListener('scroll', debouncedScrollSync, { passive: true });
        // 初始高亮第一个可见分组
        const firstVisible = groupsMeta.find(g => g.el && g.el.style.display !== 'none');
        if (firstVisible && firstVisible.el) setActiveNav(firstVisible.el.id);

        // 底部按钮
        const cancelButton = document.createElement('button');
        cancelButton.id = 'nqs-close';
        cancelButton.className = 'nqs-button nqs-button-secondary';
        cancelButton.innerHTML = '<span>❌</span> 取消';

        const spacer = document.createElement('div');
        spacer.style.flexGrow = '1';

        const saveButton = document.createElement('button');
        saveButton.id = 'nqs-save';
        saveButton.className = 'nqs-button nqs-button-primary';
        saveButton.innerHTML = '<span>💾</span> 保存设置';

        footer.append(cancelButton, spacer, saveButton);

        // --- 逻辑与事件绑定 ---
        let currentCategories = JSON.parse(await GM_getValue('user_categories', SETTINGS_DEFAULTS.user_categories));

        // 切换AI相关设置组的可见性（同步侧边栏）
        const toggleAISectionVisibility = () => {
            if (!elements['ai_enabled'] || !elements['ai_enabled'].querySelector('input')) return;
            const aiEnabled = elements['ai_enabled'].querySelector('input').checked;
            if (aiGroup && aiGroup.group) aiGroup.group.style.display = aiEnabled ? 'block' : 'none';
            if (contentGroup && contentGroup.group) contentGroup.group.style.display = aiEnabled ? 'block' : 'none';
            if (promptGroup && promptGroup.group) promptGroup.group.style.display = aiEnabled ? 'block' : 'none';
            if (networkGroup && networkGroup.group) networkGroup.group.style.display = aiEnabled ? 'block' : 'none';

            // 同步侧边栏导航项显示状态
            const safeToggle = (key, visible) => { const item = navItems[key]; if (item) item.style.display = visible ? '' : 'none'; };
            safeToggle('ai', aiEnabled);
            safeToggle('content', aiEnabled);
            safeToggle('prompt', aiEnabled);
            safeToggle('network', aiEnabled);

            // 如果当前高亮项隐藏了，则选中第一个可见项
            const activeItem = nav.querySelector('.nqs-nav-item.active');
            if (activeItem && activeItem.style.display === 'none') {
                const first = Array.from(nav.querySelectorAll('.nqs-nav-item')).find(i => i.style.display !== 'none');
                if (first) setActiveNav(first.getAttribute('data-target'));
            }

            // 重新挂载观察器，仅观察可见分组
            attachObservers();
        };

        // 切换代理URL字段的可见性
        const toggleProxyUrlVisibility = () => {
            if (!elements['proxy_enabled'] || !elements['proxy_enabled'].querySelector('input')) return;

            const proxyEnabled = elements['proxy_enabled'].querySelector('input').checked;
            if (networkGroup && networkGroup.content) {
                const proxyFieldWrapper = networkGroup.content.querySelector('[data-field-id="proxy_url"]');
                if (proxyFieldWrapper) {
                    proxyFieldWrapper.style.display = proxyEnabled ? 'grid' : 'none';
                }
            }
        };

        // 更新提供商特定的UI
        const updateProviderSpecificUI = () => {
            if (!elements['ai_provider'] || !elements['ai_api_url'] || !modelSelector || !modelSelector.input) return;

            const provider = elements['ai_provider'].value;
            const apiUrlInput = elements['ai_api_url'];
            const modelInput = modelSelector.input;

            if (provider === 'gemini') {
                apiUrlInput.placeholder = '通常留空，会自动使用谷歌官方地址';
                modelInput.placeholder = '例如: gemini-1.5-flash-latest';
                if (apiUrlInput.value.includes('openai.com')) {
                    apiUrlInput.value = '';
                }
            } else { // openai
                apiUrlInput.placeholder = '例如: https://api.openai.com/v1/chat/completions';
                modelInput.placeholder = '例如: gpt-3.5-turbo';
                if (!apiUrlInput.value) {
                    apiUrlInput.value = SETTINGS_DEFAULTS.ai_api_url;
                }
            }
        };

        // 渲染分类列表
        const renderCategories = () => {
            if (!categoryManager || !categoryManager.categoryList) return;

            categoryManager.categoryList.innerHTML = '';
            currentCategories.forEach(cat => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'nqs-category-item';
                categoryItem.innerHTML = `
                    <span class="nqs-category-name">${cat}</span>
                    <button class="nqs-category-delete-btn" data-category="${cat}">
                        <span>×</span>
                    </button>
                `;
                categoryManager.categoryList.appendChild(categoryItem);
            });
        };

        // 添加分类
        const addCategoryAction = () => {
            if (!categoryManager || !categoryManager.input) return;

            const newCat = categoryManager.input.value.trim();
            if (newCat && !currentCategories.includes(newCat)) {
                currentCategories.unshift(newCat);
                renderCategories();
                categoryManager.input.value = '';
            }
        };

        // 删除分类
        const deleteCategory = (category) => {
            currentCategories = currentCategories.filter(c => c !== category);
            renderCategories();
        };

        // 重置提示词
        const resetPrompt = async () => {
            if (!elements['ai_prompt']) return;

            if (await showConfirmationModal('恢复默认提示词', '您当前输入的内容将被覆盖。确定要恢复吗？')) {
                elements['ai_prompt'].value = SETTINGS_DEFAULTS.ai_prompt;
            }
        };

        // 获取可用模型列表
        let availableModels = [], activeOptionIndex = -1;

        const renderModelDropdown = (filter = '') => {
            if (!modelSelector || !modelSelector.dropdown || !modelSelector.input) return;

            const filteredModels = availableModels.filter(model =>
                model.toLowerCase().includes(filter.toLowerCase())
            );

            modelSelector.dropdown.innerHTML = '';

            if (filteredModels.length === 0) {
                modelSelector.dropdown.classList.remove('is-visible');
                return;
            }

            filteredModels.forEach((model, index) => {
                const item = document.createElement('div');
                item.className = 'nqs-dropdown-item';
                item.textContent = model;
                item.dataset.index = index;
                item.addEventListener('click', () => {
                    modelSelector.input.value = model;
                    modelSelector.dropdown.classList.remove('is-visible');
                });
                modelSelector.dropdown.appendChild(item);
            });

            modelSelector.dropdown.classList.add('is-visible');
            activeOptionIndex = -1;
        };

        const updateActiveModelOption = (newIndex) => {
            if (!modelSelector || !modelSelector.dropdown) return;

            const items = modelSelector.dropdown.querySelectorAll('.nqs-dropdown-item');
            if (activeOptionIndex >= 0 && items[activeOptionIndex]) {
                items[activeOptionIndex].classList.remove('is-active');
            }
            if (newIndex >= 0 && items[newIndex]) {
                items[newIndex].classList.add('is-active');
                items[newIndex].scrollIntoView({ block: 'nearest' });
                activeOptionIndex = newIndex;
            }
        };

        // 获取模型列表
        const fetchModels = async () => {
            if (!elements['ai_provider'] || !elements['ai_api_url'] || !elements['ai_api_key'] ||
                !elements['ai_model_fetch_timeout'] || !elements['proxy_enabled'] || !elements['proxy_url'] ||
                !modelSelector || !modelSelector.fetchBtn || !modelSelector.input) {
                showAlertModal('操作失败', '必要的配置元素未找到。');
                return;
            }

            const provider = elements['ai_provider'].value;
            const baseUrl = elements['ai_api_url'].value;
            const apiKey = elements['ai_api_key'].value;
            const fetchTimeout = elements['ai_model_fetch_timeout'].value;
            const proxySettings = {
                enabled: elements['proxy_enabled'].querySelector('input').checked,
                url: elements['proxy_url'].value
            };

            if (!apiKey) {
                showAlertModal('操作失败', '请先填写 AI API Key。');
                return;
            }

            modelSelector.fetchBtn.classList.add('is-loading');
            modelSelector.fetchBtn.disabled = true;

            try {
                availableModels = await fetchAvailableModels(provider, baseUrl, apiKey, fetchTimeout, proxySettings);
                renderModelDropdown(modelSelector.input.value);
                await showAlertModal('操作成功', `成功获取 ${availableModels.length} 个可用模型！`);
            } catch (error) {
                await showAlertModal('操作失败', `无法获取模型列表，请检查您的网络、配置和 API Key 是否正确。\n\n错误详情: ${error.message}`);
            } finally {
                modelSelector.fetchBtn.classList.remove('is-loading');
                modelSelector.fetchBtn.disabled = false;
            }
        };

        // 加载当前设置值
        for (const key of Object.keys(SETTINGS_DEFAULTS)) {
            const element = elements[key];
            if (element) {
                const value = await GM_getValue(key, SETTINGS_DEFAULTS[key]);
                if (element.type === 'checkbox' || element.querySelector('input[type="checkbox"]')) {
                    const checkbox = element.querySelector('input[type="checkbox"]') || element;
                    checkbox.checked = value;
                } else if (element.tagName === 'SELECT') {
                    element.value = value;
                } else {
                    element.value = value;
                }
            }
        }

        // 初始化UI状态
        renderCategories();
        toggleAISectionVisibility();
        toggleProxyUrlVisibility();
        updateProviderSpecificUI();

        // 绑定事件 - 确保所有元素都已创建
        setTimeout(() => {
            // AI相关事件
            if (elements['ai_enabled'] && elements['ai_enabled'].querySelector('input')) {
                elements['ai_enabled'].querySelector('input').addEventListener('change', toggleAISectionVisibility);
            }

            if (elements['proxy_enabled'] && elements['proxy_enabled'].querySelector('input')) {
                elements['proxy_enabled'].querySelector('input').addEventListener('change', toggleProxyUrlVisibility);
            }

            if (elements['ai_provider']) {
                elements['ai_provider'].addEventListener('change', updateProviderSpecificUI);
            }

            // 分类管理事件
            if (categoryManager && categoryManager.addBtn) {
                categoryManager.addBtn.addEventListener('click', addCategoryAction);
            }

            if (categoryManager && categoryManager.input) {
                categoryManager.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addCategoryAction();
                    }
                });
            }

            // 分类删除事件委托
            if (categoryManager && categoryManager.categoryList) {
                categoryManager.categoryList.addEventListener('click', (e) => {
                    if (e.target.closest('.nqs-category-delete-btn')) {
                        const btn = e.target.closest('.nqs-category-delete-btn');
                        const category = btn.dataset.category;
                        deleteCategory(category);
                    }
                });
            }

            // 重置提示词事件
            const resetPromptBtn = footer.querySelector('#nqs-reset-prompt');
            if (resetPromptBtn) {
                resetPromptBtn.addEventListener('click', resetPrompt);
            }

            // 模型选择器事件
            if (modelSelector && modelSelector.fetchBtn) {
                modelSelector.fetchBtn.addEventListener('click', fetchModels);
            }

            if (modelSelector && modelSelector.input) {
                modelSelector.input.addEventListener('focus', () => {
                    if (availableModels.length > 0) renderModelDropdown(modelSelector.input.value);
                });

                modelSelector.input.addEventListener('input', () => {
                    renderModelDropdown(modelSelector.input.value);
                });

                modelSelector.input.addEventListener('keydown', (e) => {
                    const items = modelSelector.dropdown.querySelectorAll('.nqs-dropdown-item');
                    if (!modelSelector.dropdown.classList.contains('is-visible') || items.length === 0) return;

                    switch(e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            updateActiveModelOption(activeOptionIndex < items.length - 1 ? activeOptionIndex + 1 : 0);
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            updateActiveModelOption(activeOptionIndex > 0 ? activeOptionIndex - 1 : items.length - 1);
                            break;
                        case 'Enter':
                            e.preventDefault();
                            if (activeOptionIndex >= 0 && items[activeOptionIndex]) {
                                items[activeOptionIndex].click();
                            }
                            break;
                        case 'Escape':
                            modelSelector.dropdown.classList.remove('is-visible');
                            break;
                    }
                });
            }

            // 点击外部关闭下拉
            if (modelSelector && modelSelector.input) {
                document.addEventListener('click', (e) => {
                    if (!modelSelector.input.parentNode.contains(e.target)) {
                        modelSelector.dropdown.classList.remove('is-visible');
                    }
                });
            }
        }, 100);

        // 保存设置
        saveButton.addEventListener('click', async () => {
            // 使用当前选择的模板作为 ai_prompt
            try {
                const tpls = JSON.parse(await GM_getValue('ai_prompt_templates', SETTINGS_DEFAULTS.ai_prompt_templates) || '[]');
                const activeId = await GM_getValue('ai_active_template_id', SETTINGS_DEFAULTS.ai_active_template_id);
                const activeTpl = (tpls.find(t => t.id === activeId) || tpls.find(t => t.id === 'default'));
                const content = (activeTpl && activeTpl.content) ? activeTpl.content : SETTINGS_DEFAULTS.ai_prompt;
                const missing = [];
                if (!/\{page_metadata\}/.test(content)) missing.push('{page_metadata}');
                if (!/\{categories\}/.test(content)) missing.push('{categories}');
                if (!/\{optional_body_section\}/.test(content)) missing.push('{optional_body_section}');
                if (missing.length) {
                    await showAlertModal('占位符缺失', `当前使用的模板缺少必需占位符：${missing.join(', ')}`);
                    return;
                }
                if (!/\{page_metadata\}/.test(content)) {
                    await showAlertModal('占位符缺失', '当前使用的模板缺少必需占位符 {page_metadata}');
                    return;
                }
                await GM_setValue('ai_prompt', content);
            } catch (e) {
                console.warn('Failed to apply active template, fallback to default.', e);
                await GM_setValue('ai_prompt', SETTINGS_DEFAULTS.ai_prompt);
            }
            for (const key of Object.keys(SETTINGS_DEFAULTS)) {
                const element = elements[key];
                if (element) {
                    let value;
                    if (element.type === 'checkbox' || element.querySelector('input[type="checkbox"]')) {
                        const checkbox = element.querySelector('input[type="checkbox"]') || element;
                        value = checkbox.checked;
                    } else {
                        value = element.value;
                    }

                    // ai_prompt 已由模板系统统一保存
                    if (key !== 'user_categories' && key !== 'ai_prompt') {
                        await GM_setValue(key, value);
                    }
                }
            }

            await GM_setValue('user_categories', JSON.stringify(currentCategories));
            await applyTheme();

            notificationManager.showSuccessNotification('设置保存成功', '您的设置已成功保存并应用');
            close();
            initFloatingButtons();
        });

        cancelButton.addEventListener('click', close);
    }

    async function openLogViewerPanel() {
        closeAllNQSPopups();
        const allLogs = JSON.parse(await GM_getValue('nqs_logs', '[]'));
        const { body, footer, close } = createBasePanel('📋 操作日志', '', { maxWidth: '1000px', panelClass: 'nqs-panel--log-viewer' });

        // 创建日志统计卡片区域
        const statsContainer = document.createElement('div');
        statsContainer.className = 'nqs-log-stats';

        // 统计不同类型的日志数量
        const stats = allLogs.reduce((acc, log) => {
            const level = log.level || 'info';
            acc[level] = (acc[level] || 0) + 1;
            acc.total++;
            return acc;
        }, { total: 0, info: 0, error: 0, debug: 0 });

        statsContainer.innerHTML = `
            <div class="nqs-stat-card nqs-stat-total">
                <div class="nqs-stat-icon">📊</div>
                <div class="nqs-stat-content">
                    <div class="nqs-stat-number">${stats.total}</div>
                    <div class="nqs-stat-label">总记录</div>
                </div>
            </div>
            <div class="nqs-stat-card nqs-stat-success">
                <div class="nqs-stat-icon">✅</div>
                <div class="nqs-stat-content">
                    <div class="nqs-stat-number">${stats.info || 0}</div>
                    <div class="nqs-stat-label">成功操作</div>
                </div>
            </div>
            <div class="nqs-stat-card nqs-stat-error">
                <div class="nqs-stat-icon">❌</div>
                <div class="nqs-stat-content">
                    <div class="nqs-stat-number">${stats.error || 0}</div>
                    <div class="nqs-stat-label">失败记录</div>
                </div>
            </div>
            <div class="nqs-stat-card nqs-stat-debug">
                <div class="nqs-stat-icon">🔧</div>
                <div class="nqs-stat-content">
                    <div class="nqs-stat-number">${stats.debug || 0}</div>
                    <div class="nqs-stat-label">调试信息</div>
                </div>
            </div>
        `;
        body.appendChild(statsContainer);

        // 创建过滤和搜索栏
        const filterContainer = document.createElement('div');
        filterContainer.className = 'nqs-log-filter-bar';
        filterContainer.innerHTML = `
            <div class="nqs-filter-left">
                <div class="nqs-filter-group">
                    <button class="nqs-filter-btn active" data-filter="all">
                        <span class="nqs-filter-icon">📋</span>
                        <span>全部</span>
                    </button>
                    <button class="nqs-filter-btn" data-filter="info">
                        <span class="nqs-filter-icon">✅</span>
                        <span>成功</span>
                    </button>
                    <button class="nqs-filter-btn" data-filter="error">
                        <span class="nqs-filter-icon">❌</span>
                        <span>错误</span>
                    </button>
                </div>
            </div>
            <div class="nqs-filter-right">
                <div class="nqs-search-box">
                    <input type="text" id="nqs-log-search" placeholder="搜索日志消息..." class="nqs-search-input">
                    <span class="nqs-search-icon">🔍</span>
                </div>
                <div class="nqs-toggle-group">
                    <label class="nqs-toggle-label">
                        <input type="checkbox" id="nqs-show-debug" class="nqs-toggle-input">
                        <span class="nqs-toggle-slider"></span>
                        <span class="nqs-toggle-text">调试模式</span>
                    </label>
                </div>
            </div>
        `;
        body.appendChild(filterContainer);

        // 创建表格容器
        const tableContainer = document.createElement('div');
        tableContainer.className = 'nqs-table-container';
        body.appendChild(tableContainer);

        let currentFilter = 'all', showDebug = false, searchTerm = '';

        const rerenderTable = () => {
            const searchTermLower = searchTerm.toLowerCase();
            const filteredLogs = allLogs.filter(log => {
                const level = (log.level || 'info').toLowerCase();
                const matchesFilter = (currentFilter === 'all' || level === currentFilter || (!log.level && currentFilter === 'info'));
                const matchesDebug = (showDebug || level !== 'debug');
                const haystack = (typeof log.message === 'string' ? log.message : (log.title || '')).toLowerCase();
                const matchesSearch = (!searchTerm || haystack.includes(searchTermLower));
                return matchesFilter && matchesDebug && matchesSearch;
            }).slice(0, 100);

            if (filteredLogs.length === 0) {
                tableContainer.innerHTML = `
                    <div class="nqs-empty-state">
                        <div class="nqs-empty-icon">📝</div>
                        <div class="nqs-empty-title">暂无日志记录</div>
                        <div class="nqs-empty-message">当前筛选条件下没有找到相关的日志记录</div>
                    </div>
                `;
                return;
            }

            const cardsHTML = `
                <div class="nqs-log-cards">
                    ${filteredLogs.map((log) => {
                        const originalIndex = allLogs.indexOf(log);
                        const level = (log.level || 'info').toLowerCase();
                        const displayMessage = log.level ? log.message : `[Legacy] Saved '${log.title}' as '${log.result || 'N/A'}'`;
                        const isLegacy = level === 'info' && !log.level;
                        const safeMessage = escapeHtml(displayMessage || '');
                        const pageMeta = log.page && (log.page.title || log.page.url)
                            ? `<span class="nqs-log-page" title="${log.page.url ? escapeHtml(log.page.url) : ''}">${escapeHtml(log.page.title || log.page.url)}</span>`
                            : '';
                        const actionBadge = log.action ? `<span class="nqs-log-action-pill">${escapeHtml(log.action)}</span>` : '';
                        const componentBadge = log.component ? `<span class="nqs-log-action-pill nqs-log-action-pill--muted">${escapeHtml(log.component)}</span>` : '';
                        const tagsMarkup = Array.isArray(log.tags)
                            ? log.tags.filter(Boolean).slice(0, 6).map(tag => `<span class="nqs-log-tag-pill">${escapeHtml(String(tag))}</span>`).join('')
                            : '';
                        const metaHtml = (pageMeta || actionBadge || componentBadge || tagsMarkup)
                            ? `<div class="nqs-log-meta">${pageMeta}${actionBadge}${componentBadge}${tagsMarkup}</div>`
                            : '';

                        const levelIcons = {
                            'info': '✅',
                            'error': '❌',
                            'debug': '🔧',
                            'warn': '⚠️'
                        };

                        const levelColors = {
                            'info': '#34C759',
                            'error': '#FF3B30',
                            'debug': '#8E8E93',
                            'warn': '#FF9500'
                        };

                        return `
                            <div class="nqs-log-card nqs-log-card--${level}" data-log-index="${originalIndex}">
                                <div class="nqs-log-card-header">
                                    <div class="nqs-log-level-badge" style="background: ${levelColors[level]}20; color: ${levelColors[level]};">
                                        <span class="nqs-log-level-icon">${levelIcons[level] || '📋'}</span>
                                        <span class="nqs-log-level-text">${getLogLevelText(level, isLegacy)}</span>
                                    </div>
                                    <div class="nqs-log-time">${formatLogTime(log.timestamp)}</div>
                                </div>
                                <div class="nqs-log-card-body">
                                    <div class="nqs-log-message">${safeMessage}</div>
                                    ${metaHtml}
                                </div>
                                <div class="nqs-log-card-footer">
                                    <button class="nqs-log-detail-btn" data-log-index="${originalIndex}">
                                        <span>🔍</span> 查看详情
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            setSafeInnerHTML(tableContainer, cardsHTML);
        };

        // 格式化时间显示
        window.formatLogTime = (timestamp) => {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;

            if (diff < 60000) return '刚刚';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
            if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`;

            return date.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        // 获取日志级别文本
        window.getLogLevelText = (level, isLegacy = false) => {
            if (isLegacy) return 'LEGACY';
            const levelMap = {
                'info': 'INFO',
                'error': 'ERROR',
                'debug': 'DEBUG',
                'warn': 'WARN'
            };
            return levelMap[level] || level.toUpperCase();
        };

        // 创建日志详情弹窗函数
        const showLogDetailModal = (log) => {
            const { body: detailBody, footer: detailFooter, close: closeDetail } = createBasePanel(
                '📋 日志详情',
                '',
                { maxWidth: '800px', panelClass: 'nqs-panel--log-detail', isNested: true }
            );

            // 格式化日志数据
            const rawContext = (log.context && typeof log.context === 'object') ? log.context : (log.details && typeof log.details === 'object' ? log.details : null);
            let contextPayload = null;
            let contextCloned = false;
            if (rawContext) {
                try {
                    contextPayload = JSON.parse(JSON.stringify(rawContext));
                    contextCloned = true;
                } catch (error) {
                    contextPayload = rawContext;
                }
            }
            const errorPayload = log.error || (contextPayload && contextPayload.error ? contextPayload.error : null);
            if (contextCloned && contextPayload && contextPayload.error === errorPayload) {
                delete contextPayload.error;
            }

            const logData = {
                时间: new Date(log.timestamp).toLocaleString('zh-CN'),
                级别: log.level ? log.level.toUpperCase() : 'LEGACY',
                消息: log.message || (log.title ? `[Legacy] Saved '${log.title}' as '${log.result || 'N/A'}'` : '无消息'),
                ...(log.action ? { 操作: log.action } : {}),
                ...(log.component ? { 组件: log.component } : {}),
                ...(Array.isArray(log.tags) && log.tags.length ? { 标签: log.tags } : {}),
                ...(log.page && (log.page.title || log.page.url) ? { 页面: log.page } : {}),
                ...(errorPayload ? { 错误: errorPayload } : {}),
                ...(contextPayload ? { 上下文: contextPayload } : {}),
                ...(log.title && !log.level ? { 标题: log.title } : {}),
                ...(log.result && !log.level ? { 结果: log.result } : {}),
                ...(log.url && !log.level ? { 链接: log.url } : {})
            };

            detailBody.innerHTML = `
                <div class="nqs-log-detail-content">
                    <div class="nqs-json-viewer">
                        <pre class="nqs-json-code">${JSON.stringify(logData, null, 2)}</pre>
                    </div>
                </div>
            `;

            setSafeInnerHTML(detailFooter, `
                <div class="nqs-log-detail-footer">
                    <button class="nqs-button nqs-button-secondary" id="copy-log-data">
                        <span>📋</span> 复制数据
                    </button>
                    <button class="nqs-button nqs-button-primary" id="close-log-detail">
                        <span>✅</span> 关闭
                    </button>
                </div>
            `);

            // 绑定事件
            detailFooter.querySelector('#copy-log-data').addEventListener('click', () => {
                navigator.clipboard.writeText(JSON.stringify(logData, null, 2)).then(() => {
                    notificationManager.showSuccessNotification('复制成功', '日志数据已复制到剪贴板');
                }).catch(() => {
                    notificationManager.showErrorNotification('复制失败', '无法访问剪贴板');
                });
            });

            detailFooter.querySelector('#close-log-detail').addEventListener('click', closeDetail);

            // 显示弹窗
            setTimeout(() => {
                document.querySelector('.nqs-overlay:last-child').classList.add('visible');
            }, 10);
        };

        // 绑定卡片点击事件
        tableContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('nqs-log-detail-btn') || e.target.closest('.nqs-log-detail-btn')) {
                const btn = e.target.classList.contains('nqs-log-detail-btn') ? e.target : e.target.closest('.nqs-log-detail-btn');
                const logIndex = btn.dataset.logIndex;
                const log = allLogs[logIndex];
                if (log) {
                    showLogDetailModal(log);
                }
            }
        });

        // 绑定过滤事件
        filterContainer.querySelector('.nqs-filter-group').addEventListener('click', (e) => {
            if (!e.target.closest('.nqs-filter-btn')) return;
            const btn = e.target.closest('.nqs-filter-btn');
            filterContainer.querySelectorAll('.nqs-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
        rerenderTable();
        });

        filterContainer.querySelector('#nqs-show-debug').addEventListener('change', (e) => {
            showDebug = e.target.checked;
            rerenderTable();
        });

        filterContainer.querySelector('#nqs-log-search').addEventListener('input', (e) => {
            searchTerm = e.target.value.trim();
            rerenderTable();
        });

        // 底部操作按钮
        setSafeInnerHTML(footer, `
            <div class="nqs-log-footer-actions">
                <div class="nqs-log-footer-left">
                    <button class="nqs-button nqs-button-secondary" id="export-logs">
                        <span>📤</span> 导出日志
                    </button>
                    <button class="nqs-button nqs-button-danger" id="clear-logs">
                        <span>🗑️</span> 清空日志
                    </button>
                </div>
                <div class="nqs-log-footer-right">
                    <button class="nqs-button nqs-button-primary" id="close-logs">
                        <span>✅</span> 关闭
                    </button>
                </div>
            </div>
        `);

        footer.querySelector('#clear-logs').addEventListener('click', async () => {
            const confirmed = await showConfirmationModal('确认清空日志', '此操作不可撤销，您确定要删除所有日志记录吗？', { danger: true, confirmText: '确认清空' });
            if (confirmed) {
                await GM_setValue('nqs_logs', '[]');
                notificationManager.showSuccessNotification('日志已清空', '所有日志记录已成功清除');
                close();
            }
        });

        footer.querySelector('#export-logs').addEventListener('click', () => {
            const dataStr = JSON.stringify(allLogs, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `notion-ai-logs-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            notificationManager.showSuccessNotification('日志已导出', '日志文件已成功下载到本地');
        });

        footer.querySelector('#close-logs').addEventListener('click', close);

        rerenderTable();
    }
    async function openCategorySelectorPanel(pageTitle, pageUrl, uiContext) {
        closeAllNQSPopups();
        const settings = await loadAllSettings();
        let categories = JSON.parse(settings.user_categories);
        if (settings.read_later_enabled && settings.read_later_category) { categories = categories.filter(c => c !== settings.read_later_category); }
        const { body, close } = createBasePanel('选择或创建分类', '', { maxWidth: '560px' });
        setSafeInnerHTML(body, `<div id="nqs-selector-list">${categories.map(cat => `<button class="nqs-button nqs-button-secondary" data-cat="${cat}">${cat}</button>`).join('')}</div><div class="nqs-category-manager"><input type="text" class="nqs-input" id="nqs-new-cat-input" placeholder="或输入新分类..."><button id="nqs-save-new-cat" class="nqs-button nqs-button-primary">添加并保存</button></div>`);
        const doSave = async (category) => {
            if (!category) return; close();
            const saveButton = document.getElementById('nqs-save-button'); const originalText = '➤ Notion';
            if (uiContext.source === 'fab' && saveButton) showNotification(saveButton, `🚀 保存为: ${category}`, true, originalText); else console.log(`NQS: [Menu] 🚀 即将保存为: ${category}`);
            try {
                const notionResponse = await saveToNotion(settings.notion_api_key, settings.database_id, pageTitle, pageUrl, category, settings);

                // 记录手动分类学习数据（如果之前有AI建议的话）
                const domain = new URL(pageUrl).hostname;
                const pageMetadata = getHighSignalPageData(document);
                await recordCategoryLearning(domain, pageMetadata, category, null);

                await addLog('info', `页面已手动保存 (${uiContext.source})`, { title: pageTitle, url: pageUrl, result: category });
                if (uiContext.source === 'fab' && saveButton) showNotification(saveButton, notionResponse, false, originalText); else console.log(`NQS: [Menu] ${notionResponse}`);
            } catch (error) {
                if (uiContext.source === 'fab' && saveButton) showNotification(saveButton, error.message, false, originalText); else console.error(`NQS: [Menu] 保存失败！错误信息: ${error.message}`);
                await addLog('error', '手动保存至Notion失败', { title: pageTitle, url: pageUrl, category: category, error: error.message, stack: error.stack });
            }
        };
        body.querySelector('#nqs-selector-list').addEventListener('click', e => { if (e.target.tagName === 'BUTTON' && e.target.dataset.cat) doSave(e.target.dataset.cat); });
        const newCatInputAction = async () => { const newCat = body.querySelector('#nqs-new-cat-input').value.trim(); if (newCat && !categories.includes(newCat)) { const allCategories = JSON.parse(await GM_getValue('user_categories', SETTINGS_DEFAULTS.user_categories)); allCategories.unshift(newCat); await GM_setValue('user_categories', JSON.stringify(allCategories)); } doSave(newCat); };
        body.querySelector('#nqs-save-new-cat').addEventListener('click', newCatInputAction);
        body.querySelector('#nqs-new-cat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); newCatInputAction(); } });
    }

    // ===================================================================
    // ====================== API 调用与主逻辑 =========================
    // ===================================================================
    // ===================================================================
    // ====================== AI分类学习功能 =============================
    // ===================================================================
    async function recordCategoryLearning(domain, pageMetadata, userChoice, aiSuggestion) {
        if (!await GM_getValue('ai_learning_enabled', SETTINGS_DEFAULTS.ai_learning_enabled)) return;

        let learningData = [];
        try {
            learningData = JSON.parse(await GM_getValue('nqs_learning_data', '[]') || '[]');
        } catch (e) {
            console.error("NQS - 解析学习数据失败:", e);
            learningData = [];
        }

        learningData.unshift({
            timestamp: Date.now(),
            domain: domain,
            metadata: pageMetadata,
            userChoice: userChoice,
            aiSuggestion: aiSuggestion
        });

        // 保持最近1000条记录
        if (learningData.length > 1000) learningData.splice(1000);
        await GM_setValue('nqs_learning_data', JSON.stringify(learningData));
    }

    async function getDomainLearningContext(domain) {
        try {
            const learningData = JSON.parse(await GM_getValue('nqs_learning_data', '[]') || '[]');
            const domainData = learningData.filter(item => item.domain === domain).slice(0, 10);
            if (domainData.length === 0) return '';

            const corrections = domainData.filter(item => item.userChoice !== item.aiSuggestion);
            if (corrections.length === 0) return '';

            return `\n\n# 历史分类学习 (${domain})\n用户在此域名下的历史修正:\n` +
                   corrections.map(c => `- "${c.metadata.split('\n')[1]}" → 用户选择: ${c.userChoice} (AI建议: ${c.aiSuggestion})`).join('\n');
        } catch (e) {
            console.error("NQS - 获取学习上下文失败:", e);
            return '';
        }
    }

    // ===================================================================
    // ====================== 增强的AI分类功能 ============================
    // ===================================================================
    function determineCategoryAI(settings, pageMetadata, pageBodyText) {
        return new Promise(async (resolve, reject) => {
            const { ai_provider, ai_api_key, ai_api_url, ai_model, ai_prompt, user_categories, ai_include_body, ai_timeout, ai_retry_count, read_later_enabled, read_later_category, proxy_enabled, proxy_url } = settings;
            const proxySettings = { enabled: proxy_enabled, url: proxy_url };
            if (!ai_model) return reject(new Error("AI Model 未在设置中指定"));
            if (!ai_api_key) return reject(new Error("AI API Key 未在设置中指定"));
            let categories = JSON.parse(user_categories);
            if (read_later_enabled && read_later_category) { categories = categories.filter(c => c !== read_later_category); }
            if (!categories.includes(FALLBACK_CATEGORY)) {
                categories.push(FALLBACK_CATEGORY);
            }

            // 添加学习上下文
            const domain = new URL(pageMetadata.split('\n')[0].replace('Page URL: ', '')).hostname;
            const learningContext = await getDomainLearningContext(domain);

            const bodySectionTemplate = `\n\n## (可选) 辅助正文快照:\n"""\n{page_body_text}\n"""`;
            const optionalBodySection = ai_include_body ? bodySectionTemplate.replace('{page_body_text}', pageBodyText) : "N/A";
            const finalPrompt = ai_prompt.replace('{categories}', JSON.stringify(categories)).replace('{page_metadata}', pageMetadata).replace('{optional_body_section}', optionalBodySection) + learningContext;

            // 重试逻辑
            const makeAIRequest = (attempt = 1) => {
                return new Promise((resolveRequest, rejectRequest) => {
                    addLog('debug', `发送请求至AI (第${attempt}次尝试)`, {
                        provider: ai_provider,
                        model: ai_model,
                        attempt,
                        includeBody: !!settings.ai_include_body,
                        promptPreview: truncateLogString(finalPrompt, 2000)
                    });

                    let requestDetails = {
                        method: 'POST',
                        url: '',
                        headers: { 'Content-Type': 'application/json' },
                        data: '',
                        timeout: parseInt(ai_timeout, 10) || 20000,
                        ontimeout: () => rejectRequest(new Error("AI分析超时")),
                        onload: null,
                        onerror: () => rejectRequest(new Error('AI网络请求失败'))
                    };

            if (ai_provider === 'gemini') {
                try {
                    requestDetails.url = buildGeminiEndpoint(ai_model, proxySettings);
                } catch (configError) {
                    rejectRequest(configError);
                    return;
                }
                if (ai_api_key) {
                    requestDetails.headers['x-goog-api-key'] = ai_api_key.trim();
                }
                requestDetails.data = JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
                    generationConfig: { temperature: 0.0, maxOutputTokens: 100 },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ]
                });

                requestDetails.onload = (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = safeJSONParse(response.responseText, 'Gemini');
                            if (!result.candidates || result.candidates.length === 0) {
                                if (result.promptFeedback && result.promptFeedback.blockReason) {
                                    throw new Error(`AI请求被拒绝: ${result.promptFeedback.blockReason}`);
                                }
                                throw new Error("AI响应缺少 'candidates' 字段");
                            }
                            const rawResponse = (result.candidates[0]?.content?.parts?.[0]?.text || "").trim().replace(/["'（）《》`*]/g, '');
                            const interpretation = interpretAIResponse(rawResponse, categories);
                            if (interpretation.reason === 'empty_response' || interpretation.reason === 'fallback') {
                                addLog('warn', 'AI分类结果为空或无法匹配，已使用回退分类', {
                                    provider: ai_provider,
                                    attempt,
                                    reason: interpretation.reason,
                                    rawResponse: rawResponse || ''
                                });
                                console.warn('NQS - AI响应触发回退策略(Gemini):', rawResponse);
                            }
                            resolveRequest({
                                category: interpretation.category,
                                rawResponse,
                                confidence: interpretation.confidence,
                                fullApiResponse: result,
                                domain,
                                aiReason: interpretation.reason
                            });
                        } catch (e) {
                            rejectRequest(new Error(`解析AI响应失败: ${e.message}`));
                        }
                    } else {
                        rejectRequest(new Error(`AI接口错误: ${response.status} ${response.statusText || ''}${formatResponseSnippet(response.responseText)}`));
                    }
                };
            } else { // OpenAI
                requestDetails.url = (proxy_enabled && proxy_url) ? proxy_url : ai_api_url;
                requestDetails.headers['Authorization'] = `Bearer ${ai_api_key}`;
                requestDetails.data = JSON.stringify({
                    model: ai_model,
                    messages: [{ role: 'user', content: finalPrompt }],
                    temperature: 0.0,
                    max_tokens: 50
                });

                requestDetails.onload = (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = safeJSONParse(response.responseText, 'OpenAI');
                            if (!result.choices || result.choices.length === 0) throw new Error("AI响应缺少 'choices' 字段");
                            const rawResponse = (result.choices[0].message.content || "").trim().replace(/["'（）《》]/g, '');
                            const interpretation = interpretAIResponse(rawResponse, categories);
                            if (interpretation.reason === 'empty_response' || interpretation.reason === 'fallback') {
                                addLog('warn', 'AI分类结果为空或无法匹配，已使用回退分类', {
                                    provider: ai_provider,
                                    attempt,
                                    reason: interpretation.reason,
                                    rawResponse: rawResponse || ''
                                });
                                console.warn('NQS - AI响应触发回退策略(OpenAI):', rawResponse);
                            }
                            resolveRequest({
                                category: interpretation.category,
                                rawResponse,
                                confidence: interpretation.confidence,
                                fullApiResponse: result,
                                domain,
                                aiReason: interpretation.reason
                            });
                        } catch (e) {
                            rejectRequest(new Error(`解析AI响应失败: ${e.message}`));
                        }
                    } else {
                        rejectRequest(new Error(`AI接口错误: ${response.status} ${response.statusText || ''}${formatResponseSnippet(response.responseText)}`));
                    }
                };
            }

            GM_xmlhttpRequest(requestDetails);
        });
            };

            // 执行带重试的AI请求
            const maxRetries = parseInt(ai_retry_count, 10) || 2;
            for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
                try {
                    const result = await makeAIRequest(attempt);
                    resolve(result);
                    return;
                } catch (error) {
                    if (attempt === maxRetries + 1) {
                        reject(error);
                        return;
                    }
                    addLog('debug', `AI请求失败，准备重试`, { attempt, error: error.message });
                    // 等待一段时间后重试
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
        });
    }
    function saveToNotion(notionKey, dbId, title, url, category, settings, content = null) {
        return new Promise((resolve, reject) => {
            if (!notionKey || !dbId) return reject(new Error("Notion Key或DB ID未在设置中指定"));

            const properties = {
                [settings.prop_name_title]: { title: [{ text: { content: title } }] },
                [settings.prop_name_url]: { url: url },
                [settings.prop_name_category]: { select: { name: category } }
            };

            const requestBody = {
                parent: { database_id: dbId },
                properties
            };

            // 如果有内容，添加到页面body中
            if (content) {
                requestBody.children = [{
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [{
                            type: "text",
                            text: {
                                content: content.substring(0, 2000) // Notion限制单个文本块长度
                            }
                        }]
                    }
                }];
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.notion.com/v1/pages',
                headers: {
                    'Authorization': `Bearer ${notionKey}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                data: JSON.stringify(requestBody),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve('✅ 成功保存到 Notion！');
                    } else {
                        try {
                            const error = JSON.parse(response.responseText);
                            console.error('NQS - Notion API Error:', error);
                            reject(new Error(`Notion保存失败: ${error.message}`));
                        } catch (e) {
                            reject(new Error(`Notion保存失败: ${response.status} ${response.statusText}. 响应: ${response.responseText}`));
                        }
                    }
                },
                onerror: () => reject(new Error('❌ Notion网络请求失败！'))
            });
        });
    }
    function fetchAvailableModels(provider, baseUrl, apiKey, timeout, proxySettings) {
        return new Promise((resolve, reject) => {
            let finalUrl, headers = { 'Content-Type': 'application/json' };
            if (proxySettings.enabled && proxySettings.url) {
                if (provider === 'gemini') {
                    finalUrl = `${proxySettings.url}`;
                    if (!finalUrl.endsWith('/models')) finalUrl += (finalUrl.endsWith('/') ? 'v1beta/models' : '/v1beta/models');
                } else { // openai
                    finalUrl = `${proxySettings.url}`;
                    if (!finalUrl.endsWith('/models')) finalUrl += (finalUrl.endsWith('/') ? 'models' : '/models');
                }
                headers['Authorization'] = `Bearer ${apiKey}`;
            } else {
                if (provider === 'gemini') {
                    finalUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                } else { // openai
                    if (!baseUrl) return reject(new Error("未提供 OpenAI API Endpoint"));
                    try { const tempUrl = new URL(baseUrl); const pathParts = tempUrl.pathname.split('/').filter(Boolean); const v1Index = pathParts.indexOf('v1'); if (v1Index === -1) { finalUrl = `${tempUrl.origin}/v1/models`; } else { const basePath = pathParts.slice(0, v1Index + 1).join('/'); finalUrl = `${tempUrl.origin}/${basePath}/models`; }
                    } catch (e) { return reject(new Error(`无效的 Endpoint URL: ${e.message}`)); }
                    headers['Authorization'] = `Bearer ${apiKey}`;
                }
            }
            GM_xmlhttpRequest({
                method: 'GET', url: finalUrl, headers: headers, timeout: parseInt(timeout, 10) || 10000,
                ontimeout: () => reject(new Error('获取模型列表超时')),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = JSON.parse(response.responseText); let modelIds;
                            if (provider === 'gemini') { if (!result.models || !Array.isArray(result.models)) throw new Error("API响应格式不正确，缺少 'models' 数组。"); modelIds = result.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).map(m => m.name.replace('models/', '')).sort();
                            } else { if (!result.data || !Array.isArray(result.data)) throw new Error("API响应格式不正确，缺少 'data' 数组。"); modelIds = result.data.map(model => model.id).sort(); }
                            resolve(modelIds);
                        } catch (e) { reject(new Error(`解析模型列表响应失败: ${e.message}`)); }
                    } else { reject(new Error(`API错误: ${response.status} ${response.statusText}. 响应: ${response.responseText}`)); }
                },
                onerror: (e) => reject(new Error('网络请求失败，请检查网络或浏览器控制台。'))
            });
        });
    }

    // ===================================================================
    // ====================== 增强通知系统 ===============================
    // ===================================================================
    class NotificationManager {
        constructor() {
            this.permission = null;
            this.toastContainer = null;
            this.fabNotifications = new Map(); // 存储FAB按钮通知状态
            this.checkPermission();
            this.createToastContainer();
        }

        async checkPermission() {
            if ('Notification' in window) {
                this.permission = Notification.permission;
                if (this.permission === 'default') {
                    this.permission = await Notification.requestPermission();
                }
            }
        }

        createToastContainer() {
            if (this.toastContainer) return;

            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'nqs-toast-container';

            const globalContainer = document.getElementById('NQS_GLOBAL_CONTAINER');
            globalContainer.appendChild(this.toastContainer);
        }

        async showToast(title, message, type = 'info', options = {}) {
            const settings = await loadAllSettings();

            // 检查通知类型设置
            if (type === 'success' && !settings.notification_success_enabled) return;
            if (type === 'error' && !settings.notification_error_enabled) return;

            const toast = document.createElement('div');
            toast.className = `nqs-toast ${type}`;

            const iconMap = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };

            toast.innerHTML = `
                <div class="nqs-toast-content">
                    <div class="nqs-toast-icon">${iconMap[type] || iconMap.info}</div>
                    <div class="nqs-toast-text">
                        <div class="nqs-toast-title">${title}</div>
                        ${message ? `<div class="nqs-toast-message">${message}</div>` : ''}
                    </div>
                </div>
                <button class="nqs-toast-close" aria-label="关闭">×</button>
            `;

            this.toastContainer.appendChild(toast);

            // 添加关闭事件
            const closeBtn = toast.querySelector('.nqs-toast-close');
            closeBtn.addEventListener('click', () => this.hideToast(toast));

            // 显示动画
            setTimeout(() => {
                toast.classList.add('visible');
            }, 10);

            // 自动隐藏
            const duration = options.duration || (type === 'error' ? 6000 : 4000);
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);

            // 同时显示浏览器通知（如果启用）
            if (settings.notification_enabled && this.permission === 'granted') {
                this.showBrowserNotification(title, message, type);
            }
        }

        hideToast(toast) {
            toast.classList.remove('visible');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }

        async showBrowserNotification(title, message, type) {
            const iconMap = {
                success: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzEwYjk4MSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTQgOGwtNiA2LTMtMy0xLjQxIDEuNDFMMTAgMTQgMTcuNTkgNi40MSAxNiA1IDEwIDExWiIvPjwvc3ZnPg==',
                error: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2VmNDQ0NCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVoLTJ2LTZoMnY2em0wLThoLTJWN2gydjJaIi8+PC9zdmc+',
                warning: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y1OWUwYiI+PHBhdGggZD0iTTEgMjFoMjJMMTIgMiAxIDIxWm0xMi0zaC0ydi0yaDJWMThabS0yLTRoMlY5aC0yVjE0WiIvPjwvc3ZnPg==',
                info: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzNiODJmNiI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVoLTJ2LTZoMnY2em0wLThoLTJWN2gydjJaIi8+PC9zdmc+'
            };

            new Notification(title, {
                body: message,
                icon: iconMap[type] || iconMap.info,
                tag: 'nqs-notification',
                requireInteraction: false,
                silent: false
            });
        }

        showSuccessNotification(title, message = '') {
            return this.showToast(title, message, 'success');
        }

        showErrorNotification(title, message = '') {
            return this.showToast(title, message, 'error');
        }

        showWarningNotification(title, message = '') {
            return this.showToast(title, message, 'warning');
        }

        showInfoNotification(title, message = '') {
            return this.showToast(title, message, 'info');
        }

        // 统一的FAB按钮通知方法
        showFabNotification(button, message, isLoading = false, originalText = '') {
            if (!button) return;

            const buttonId = button.id || 'unknown';

            // 清除之前的定时器
            if (this.fabNotifications.has(buttonId)) {
                clearTimeout(this.fabNotifications.get(buttonId));
            }

            // 更新按钮文本和状态
            button.textContent = message;

            if (isLoading) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;

                // 如果不是加载状态，3秒后恢复原始文本
                if (originalText) {
                    const timeoutId = setTimeout(() => {
                        button.textContent = originalText;
                        this.fabNotifications.delete(buttonId);
                    }, 3000);

                    this.fabNotifications.set(buttonId, timeoutId);
                }
            }
        }

        // 统一的通知方法 - 自动选择Toast或FAB
        showUnifiedNotification(title, message = '', type = 'info', fabButton = null, originalText = '') {
            // 显示Toast通知
            this.showToast(title, message, type);

            // 如果有FAB按钮，也更新按钮状态
            if (fabButton) {
                const isLoading = type === 'loading';
                this.showFabNotification(fabButton, title, isLoading, originalText);
            }
        }
    }

    class ProgressIndicator {
        constructor() {
            this.container = null;
            this.progressBar = null;
            this.isShowing = false;
            this.createProgressBar();
        }

        createProgressBar() {
            // 创建顶部进度条
            this.container = document.createElement('div');
            this.container.className = 'nqs-top-progress';
            this.container.innerHTML = `
                <div class="nqs-progress-bar">
                    <div class="nqs-progress-fill"></div>
                </div>
                <div class="nqs-progress-status">
                    <span class="nqs-progress-text">准备就绪</span>
                </div>
            `;

            const globalContainer = document.getElementById('NQS_GLOBAL_CONTAINER');
            globalContainer.appendChild(this.container);
            this.progressBar = this.container.querySelector('.nqs-progress-fill');
        }

        async show(message = '处理中...') {
            const settings = await loadAllSettings();
            if (!settings.progress_indicator_enabled) return;

            if (this.isShowing) return;
            this.isShowing = true;

            this.updateMessage(message);
            this.container.classList.add('visible');

            // 开始进度条动画
            this.progressBar.style.width = '0%';
            this.animateProgress();
        }

        animateProgress() {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 90) progress = 90;
                this.progressBar.style.width = progress + '%';

                if (!this.isShowing) {
                    clearInterval(interval);
                }
            }, 200);
        }

        updateMessage(message) {
            if (this.container) {
                const textEl = this.container.querySelector('.nqs-progress-text');
                if (textEl) textEl.textContent = message;
            }
        }

        hide() {
            if (!this.isShowing) return;

            // 完成进度条
            this.progressBar.style.width = '100%';

            setTimeout(() => {
                this.container.classList.remove('visible');
                this.isShowing = false;

                // 重置进度条
                setTimeout(() => {
                    this.progressBar.style.width = '0%';
                    this.updateMessage('准备就绪');
                }, 300);
            }, 200);
        }
    }

    const notificationManager = new NotificationManager();
    const progressIndicator = new ProgressIndicator();



    // ===================================================================
    // ====================== 批量保存功能 ===============================
    // ===================================================================
    // ===================================================================
    // ====================== 智能收藏夹功能 =============================
    // ===================================================================
    async function openSmartBookmarkManager() {
        closeAllNQSPopups();
        const { body, footer, close } = createBasePanel('🚀 智能收藏夹管理', '快速保存和整理网页资源', { maxWidth: '900px', panelClass: 'nqs-panel--bookmark-manager' });

        const content = `
            <div class="nqs-bookmark-manager">
                <!-- 主要功能区域 -->
                <div class="nqs-feature-grid">
                    <div class="nqs-feature-card nqs-feature-primary" data-action="save-session">
                        <div class="nqs-feature-icon">🖥️</div>
                        <div class="nqs-feature-content">
                            <h4>网站会话保存</h4>
                            <p>智能识别并保存当前网站的相关页面，自动归类整理</p>
                            <div class="nqs-feature-badge">推荐</div>
                        </div>
                        <div class="nqs-feature-arrow">→</div>
                    </div>

                    <div class="nqs-feature-card" data-action="save-links">
                        <div class="nqs-feature-icon">🔗</div>
                        <div class="nqs-feature-content">
                            <h4>页面链接提取</h4>
                            <p>提取页面中的有价值链接，批量保存到Notion</p>
                        </div>
                        <div class="nqs-feature-arrow">→</div>
                    </div>

                    <div class="nqs-feature-card" data-action="create-reading-list">
                        <div class="nqs-feature-icon">📚</div>
                        <div class="nqs-feature-content">
                            <h4>主题阅读清单</h4>
                            <p>基于当前内容创建个性化的学习资源清单</p>
                        </div>
                        <div class="nqs-feature-arrow">→</div>
                    </div>
                </div>

                <!-- 快速分类保存 -->
                <div class="nqs-quick-save-section">
                    <div class="nqs-section-header">
                        <h3>⚡ 快速分类保存</h3>
                        <p>一键保存到预设分类</p>
                    </div>
                    <div class="nqs-quick-categories">
                        <button class="nqs-category-btn" data-category="重要参考">
                            <span class="nqs-category-icon">📌</span>
                            <span class="nqs-category-name">重要参考</span>
                        </button>
                        <button class="nqs-category-btn" data-category="学习教程">
                            <span class="nqs-category-icon">🎯</span>
                            <span class="nqs-category-name">学习教程</span>
                        </button>
                        <button class="nqs-category-btn" data-category="灵感素材">
                            <span class="nqs-category-icon">💡</span>
                            <span class="nqs-category-name">灵感素材</span>
                        </button>
                        <button class="nqs-category-btn" data-category="工具资源">
                            <span class="nqs-category-icon">🛠️</span>
                            <span class="nqs-category-name">工具资源</span>
                        </button>
                        <button class="nqs-category-btn" data-category="技术文档">
                            <span class="nqs-category-icon">📖</span>
                            <span class="nqs-category-name">技术文档</span>
                        </button>
                        <button class="nqs-category-btn" data-category="设计案例">
                            <span class="nqs-category-icon">🎨</span>
                            <span class="nqs-category-name">设计案例</span>
                        </button>
                    </div>
                </div>

                <!-- 页面信息预览 -->
                <div class="nqs-page-preview">
                    <div class="nqs-section-header">
                        <h3>📄 当前页面信息</h3>
                    </div>
                    <div class="nqs-page-info">
                        <div class="nqs-page-title">${document.title}</div>
                        <div class="nqs-page-url">${window.location.href}</div>
                        <div class="nqs-page-meta">
                            <span class="nqs-meta-item">
                                <span class="nqs-meta-label">域名:</span>
                                <span class="nqs-meta-value">${window.location.hostname}</span>
                            </span>
                            <span class="nqs-meta-item">
                                <span class="nqs-meta-label">类型:</span>
                                <span class="nqs-meta-value">${getPageType()}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setSafeInnerHTML(body, content);
        setSafeInnerHTML(footer, `
            <div class="nqs-bookmark-footer">
                <div class="nqs-footer-left">
                    <button class="nqs-button nqs-button-secondary" id="cancel-bookmark">
                        <span>❌</span> 取消
                    </button>
                </div>
                <div class="nqs-footer-center">
                    <button class="nqs-button nqs-button-text" id="open-settings">
                        <span>⚙️</span> 设置收藏规则
                    </button>
                </div>
                <div class="nqs-footer-right">
                    <button class="nqs-button nqs-button-primary" id="save-current-page">
                        <span>💾</span> 保存当前页面
                    </button>
                </div>
            </div>
        `);

        // 获取页面类型的辅助函数
        function getPageType() {
            const url = window.location.href.toLowerCase();
            const title = document.title.toLowerCase();

            if (url.includes('github.com')) return 'GitHub项目';
            if (url.includes('stackoverflow.com')) return '技术问答';
            if (url.includes('medium.com') || url.includes('dev.to')) return '技术博客';
            if (url.includes('youtube.com')) return '视频教程';
            if (url.includes('docs.') || title.includes('documentation')) return '技术文档';
            if (url.includes('tutorial') || title.includes('tutorial')) return '教程指南';
            if (url.includes('news') || url.includes('blog')) return '新闻博客';
            return '普通网页';
        }

        // 绑定主要功能事件
        body.querySelector('[data-action="save-session"]').addEventListener('click', () => {
            close();
            saveCurrentSession();
        });

        body.querySelector('[data-action="save-links"]').addEventListener('click', () => {
            close();
            saveDomainLinks();
        });

        body.querySelector('[data-action="create-reading-list"]').addEventListener('click', () => {
            close();
            createReadingList();
        });

        // 绑定快速分类按钮事件
        body.querySelectorAll('.nqs-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                close();
                quickSaveWithCategory(category);
            });
        });

        // 绑定底部按钮事件
        footer.querySelector('#cancel-bookmark').addEventListener('click', close);

        footer.querySelector('#open-settings').addEventListener('click', () => {
            close();
            openSettingsPanel();
        });

        footer.querySelector('#save-current-page').addEventListener('click', () => {
            close();
            startSaveProcess({ source: 'bookmark-manager' });
        });

        // 添加卡片悬浮效果
        body.querySelectorAll('.nqs-feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    async function saveCurrentSession() {
        try {
            const settings = await loadAllSettings();
            if (!settings.notion_api_key || !settings.database_id) {
                throw new Error('❌ 配置不完整！');
            }

            await progressIndicator.show('📚 分析当前会话...');

            const currentUrl = window.location.href;
            const currentTitle = document.title;
            const domain = new URL(currentUrl).hostname;

            // 创建会话标题
            const sessionTitle = `【会话】${domain} - ${new Date().toLocaleDateString()}`;

            // 分析页面内容，提取相关信息
            const content = extractAdvancedContent(document);

            progressIndicator.updateMessage('🤖 生成会话摘要...');

            let sessionSummary = '';
            if (settings.ai_enabled && settings.auto_summary_enabled) {
                try {
                    const summaryPrompt = `基于以下网页信息，生成一个会话摘要，说明这个网站/页面的主要价值和学习要点：

网站：${domain}
页面标题：${currentTitle}
页面描述：${content.description}
主要内容：${content.mainContent.substring(0, 1000)}

请生成：
1. 网站/页面的主要价值（1-2句话）
2. 关键学习要点（3-5个要点）
3. 推荐的后续行动（如继续阅读的建议）

格式：简洁的markdown格式`;

                    const result = await makeSummaryRequest(settings, summaryPrompt);
                    sessionSummary = result.summary;
                } catch (error) {
                    console.warn('AI摘要生成失败');
                }
            }

            const sessionContent = `# 📚 网站会话记录

**访问时间：** ${new Date().toLocaleString('zh-CN')}
**网站域名：** ${domain}
**当前页面：** [${currentTitle}](${currentUrl})

## 📋 会话摘要
${sessionSummary || '本次会话的主要页面和资源记录'}

## 🎯 页面信息
- **阅读时长：** 约 ${content.readingTime} 分钟
- **页面类型：** ${content.author ? '文章页面' : '信息页面'}
${content.publishTime ? `- **发布时间：** ${content.publishTime}` : ''}

## 🔗 相关链接
${content.links.slice(0, 5).map(link => `- [${link.text}](${link.href})`).join('\n')}

---
*记录时间：${new Date().toLocaleString('zh-CN')}*`;

            progressIndicator.updateMessage('💾 保存会话记录...');

            // 保存会话记录
            await saveToNotion(settings.notion_api_key, settings.database_id, sessionTitle, currentUrl, '学习记录', settings, sessionContent);

            progressIndicator.hide();
            notificationManager.showSuccessNotification('会话已保存', '当前网站会话记录已保存到Notion');

            await addLog('info', '网站会话已保存', {
                domain: domain,
                title: currentTitle,
                linksCount: content.links.length
            });

        } catch (error) {
            progressIndicator.hide();
            notificationManager.showErrorNotification('会话保存失败', error.message);
            console.error('保存会话失败:', error);
        }
    }

    async function saveDomainLinks() {
        try {
            const settings = await loadAllSettings();
            if (!settings.notion_api_key || !settings.database_id) {
                throw new Error('❌ 配置不完整！');
            }

            await progressIndicator.show('🔍 提取页面链接...');

            const currentUrl = window.location.href;
            const currentTitle = document.title;
            const domain = new URL(currentUrl).hostname;

            // 提取所有外部链接
            const links = Array.from(document.querySelectorAll('a[href]'))
                .filter(link => {
                    const href = link.href;
                    return href.startsWith('http') &&
                           !href.includes(domain) &&
                           link.textContent.trim().length > 0;
                })
                .map(link => ({
                    text: link.textContent.trim(),
                    href: link.href,
                    context: link.closest('h1, h2, h3, h4, h5, h6, p, li')?.textContent.trim() || ''
                }))
                .filter((link, index, array) =>
                    // 去重
                    array.findIndex(l => l.href === link.href) === index
                )
                .slice(0, 20); // 限制数量

            if (links.length === 0) {
                throw new Error('❌ 未找到有效的外部链接');
            }

            progressIndicator.updateMessage('📝 整理链接资源...');

            const linksTitle = `【链接收集】${currentTitle}`;
            const linksContent = `# 🔗 链接资源收集

**来源页面：** [${currentTitle}](${currentUrl})
**收集时间：** ${new Date().toLocaleString('zh-CN')}
**链接数量：** ${links.length}

## 📋 链接列表

${links.map((link, index) => `### ${index + 1}. [${link.text}](${link.href})
${link.context ? `> 上下文：${link.context.substring(0, 100)}${link.context.length > 100 ? '...' : ''}` : ''}
`).join('\n')}

---
*由 Notion AI 助手自动收集整理*`;

            progressIndicator.updateMessage('💾 保存链接收集...');

            await saveToNotion(settings.notion_api_key, settings.database_id, linksTitle, currentUrl, '资源收集', settings, linksContent);

            progressIndicator.hide();
            notificationManager.showSuccessNotification('链接已收集', `已收集 ${links.length} 个有价值的链接`);

            await addLog('info', '页面链接已收集', {
                sourceTitle: currentTitle,
                linksCount: links.length
            });

        } catch (error) {
            progressIndicator.hide();
            notificationManager.showErrorNotification('链接收集失败', error.message);
            console.error('链接收集失败:', error);
        }
    }

    async function createReadingList() {
        try {
            const settings = await loadAllSettings();
            if (!settings.notion_api_key || !settings.database_id) {
                throw new Error('❌ 配置不完整！');
            }

            await progressIndicator.show('📖 创建阅读清单...');

            const currentUrl = window.location.href;
            const currentTitle = document.title;
            const content = extractAdvancedContent(document);

            progressIndicator.updateMessage('🤖 AI生成推荐...');

            let recommendations = '';
            if (settings.ai_enabled) {
                try {
                    const recommendPrompt = `基于以下页面信息，推荐5-8个相关的学习主题和关键词，用于进一步深入学习：

页面标题：${currentTitle}
页面描述：${content.description}
关键词：${content.keywords}
主要内容概要：${content.mainContent.substring(0, 800)}

请提供：
1. 核心学习主题（3-4个）
2. 相关技术栈/概念（4-6个）
3. 推荐的学习路径（简要说明）

格式：markdown列表格式，简洁明了`;

                    const result = await makeSummaryRequest(settings, recommendPrompt);
                    recommendations = result.summary;
                } catch (error) {
                    console.warn('AI推荐生成失败');
                }
            }

            const listTitle = `【学习清单】${currentTitle}`;
            const listContent = `# 📚 主题学习清单

**起始页面：** [${currentTitle}](${currentUrl})
**创建时间：** ${new Date().toLocaleString('zh-CN')}

## 🎯 当前页面要点
- **阅读时长：** ${content.readingTime} 分钟
- **主要类型：** ${content.description || '知识学习'}
- **关键信息：** ${content.keywords || '待补充'}

## 🚀 推荐学习方向
${recommendations || `基于"${currentTitle}"的内容，建议深入学习以下方向：

### 核心概念深化
- [ ] 相关基础理论
- [ ] 实践应用案例
- [ ] 最佳实践总结

### 扩展学习
- [ ] 相关技术栈
- [ ] 进阶应用
- [ ] 行业应用案例`}

## ✅ 学习计划
- [ ] 完成当前页面学习
- [ ] 查找相关补充资料
- [ ] 实践练习/项目应用
- [ ] 总结学习心得

## 📖 待读资源
${content.links.slice(0, 3).map(link => `- [ ] [${link.text}](${link.href})`).join('\n')}

---
*学习清单由 AI 助手生成，可根据个人需要调整*`;

            progressIndicator.updateMessage('💾 保存学习清单...');

            await saveToNotion(settings.notion_api_key, settings.database_id, listTitle, currentUrl, '学习计划', settings, listContent);

            progressIndicator.hide();
            notificationManager.showSuccessNotification('学习清单已创建', '个人化学习计划已保存');

            await addLog('info', '学习清单已创建', {
                sourceTitle: currentTitle,
                hasAIRecommendations: !!recommendations
            });

        } catch (error) {
            progressIndicator.hide();
            notificationManager.showErrorNotification('清单创建失败', error.message);
            console.error('学习清单创建失败:', error);
        }
    }

    async function quickSaveWithCategory(customCategory) {
        try {
            const settings = await loadAllSettings();
            if (!settings.notion_api_key || !settings.database_id) {
                throw new Error('❌ 配置不完整！');
            }

            await progressIndicator.show(`💾 保存为${customCategory}...`);

            const currentUrl = window.location.href;
            const currentTitle = document.title;
            const quickTitle = `【${customCategory}】${currentTitle}`;

            await saveToNotion(settings.notion_api_key, settings.database_id, quickTitle, currentUrl, customCategory, settings);

            progressIndicator.hide();
            notificationManager.showSuccessNotification('快速保存成功', `已保存为"${customCategory}"`);

            await addLog('info', '快速分类保存', {
                title: currentTitle,
                category: customCategory
            });

        } catch (error) {
            progressIndicator.hide();
            notificationManager.showErrorNotification('快速保存失败', error.message);
            console.error('快速保存失败:', error);
        }
    }

    // ===================================================================
    // ====================== 智能摘录功能 ===============================
    // ===================================================================
    async function saveSelectedTextAsNote() {
        try {
            const selectedText = window.getSelection().toString().trim();
            if (!selectedText) {
                throw new Error('❌ 请先选择要保存的文本内容。');
            }

            if (selectedText.length < 20) {
                throw new Error('❌ 选中的文本太短，建议选择至少20个字符的内容。');
            }

            const settings = await loadAllSettings();
            if (!settings.notion_api_key || !settings.database_id) {
                throw new Error('❌ 配置不完整！请在"设置"中填写 Notion API Key 和数据库ID。');
            }

            await progressIndicator.show('📝 处理选中文本...');

            // 获取选中文本的上下文
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                ? range.commonAncestorContainer.parentNode
                : range.commonAncestorContainer;

            // 尝试获取更多上下文信息
            let contextInfo = '';
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let nearestHeading = '';

            // 找到距离选中文本最近的标题
            for (const heading of headings) {
                if (container.compareDocumentPosition &&
                    container.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_PRECEDING) {
                    nearestHeading = heading.textContent.trim();
                }
            }

            if (nearestHeading) {
                contextInfo = `\n\n**所在章节：** ${nearestHeading}`;
            }

            // 创建富文本摘录标题
            const originalTitle = document.title;
            const sourceInfo = `【摘录】${nearestHeading || originalTitle}`;

            // 构建摘录内容
            let noteContent = '';
            if (settings.content_save_mode === 'full' || settings.auto_summary_enabled) {
                progressIndicator.updateMessage('🤖 AI分析中...');

                // 使用AI生成摘录的背景和要点
                try {
                    const analysisPrompt = `请分析以下文本摘录，并提供：
1. 这段文字的核心观点（1-2句话）
2. 为什么这段话值得摘录（价值分析）
3. 相关的关键词标签（3-5个）

原文标题：${originalTitle}
${nearestHeading ? `章节：${nearestHeading}` : ''}
摘录内容：
${selectedText}

请用以下格式回答：
核心观点：[观点内容]
价值分析：[为什么重要]
关键词：[词1, 词2, 词3]`;

                    const analysisResult = await makeSummaryRequest(settings, analysisPrompt);
                    const analysis = analysisResult.summary;

                    noteContent = `## 📖 文本摘录

**原文链接：** [${originalTitle}](${window.location.href})${contextInfo}

**摘录内容：**
> ${selectedText}

## 🎯 AI 分析
${analysis}

---
*摘录时间：${new Date().toLocaleString('zh-CN')}*`;
                } catch (aiError) {
                    console.warn('AI分析失败，使用基础格式:', aiError);
                    noteContent = `## 📖 文本摘录

**原文链接：** [${originalTitle}](${window.location.href})${contextInfo}

**摘录内容：**
> ${selectedText}

---
*摘录时间：${new Date().toLocaleString('zh-CN')}*`;
                }
            } else {
                noteContent = selectedText;
            }

            progressIndicator.updateMessage('🚀 保存到 Notion...');

            // 智能分类
            let category = "学习笔记";
            if (settings.ai_enabled) {
                try {
                    const pageMetadata = `Page URL: ${window.location.href}\nPage Title: ${originalTitle}\nContext: ${nearestHeading}\nSelected Text: ${selectedText.substring(0, 500)}`;
                    const aiResult = await determineCategoryAI(settings, pageMetadata, selectedText);
                    category = aiResult.category;
                } catch (error) {
                    console.warn('AI分类失败，使用默认分类');
                }
            }

            // 保存摘录（这里需要扩展saveToNotion函数支持富文本内容）
            await saveToNotion(settings.notion_api_key, settings.database_id, sourceInfo, window.location.href, category, settings, noteContent);

            progressIndicator.hide();

            await addLog('info', '文本摘录已保存', {
                originalTitle: originalTitle,
                textLength: selectedText.length,
                category: category,
                hasAnalysis: noteContent.includes('AI 分析')
            });

            notificationManager.showSuccessNotification('摘录保存成功', `已保存到分类："${category}"`);
            console.log(`NQS: [Menu] ✅ 文本摘录已保存为: ${category}`);

        } catch (error) {
            progressIndicator.hide();
            notificationManager.showErrorNotification('摘录保存失败', error.message);
            console.error('NQS: [Menu] 保存文本摘录失败:', error.message);
            await addLog('error', '保存文本摘录失败', { error: error.message });
        }
    }

    // ===================================================================
    // ====================== 统一的保存逻辑 (Refactored) ===============
    // ===================================================================
    async function runAiSave(settings, pageTitle, pageUrl, uiContext) {
        const saveButton = uiContext.buttonElement;
        const originalText = '➤ Notion';

        try {
            // 显示进度条和状态
            await progressIndicator.show('🧠 AI 分类中...');

            // 只更新FAB按钮状态，不显示Toast通知
            if (uiContext.source === 'fab' && saveButton) {
                notificationManager.showFabNotification(saveButton, '🧠 AI 分析中...', true, originalText);
            }

            const pageMetadata = getHighSignalPageData(document);
            const pageBodyText = settings.ai_include_body ? extractMainContent(document).substring(0, 4000) : "N/A";

            const aiResult = await determineCategoryAI(settings, pageMetadata, pageBodyText);
            const { category, confidence, domain, aiReason } = aiResult;

            // 更新进度
            progressIndicator.updateMessage('🚀 保存到 Notion...');

            // 显示置信度信息
            const confidenceText = confidence ? ` (${Math.round(confidence * 100)}%)` : '';

            // 更新FAB按钮状态
            if (uiContext.source === 'fab' && saveButton) {
                notificationManager.showFabNotification(saveButton, `🚀 保存中...`, true, originalText);
            }

            const notionResponse = await saveToNotion(settings.notion_api_key, settings.database_id, pageTitle, pageUrl, category, settings);

            // 隐藏进度条
            progressIndicator.hide();

            await addLog('info', `页面已通过AI保存 (${uiContext.source})`, {
                title: pageTitle,
                url: pageUrl,
                result: category,
                confidence: confidence,
                provider: settings.ai_provider,
                domain: domain,
                aiReason: aiReason
            });

            // 显示成功通知和恢复FAB按钮状态
            const confidenceInfo = confidence ? ` (AI置信度: ${Math.round(confidence * 100)}%)` : '';
            const fallbackNote = aiReason && (aiReason === 'empty_response' || aiReason === 'fallback') ? '（AI结果为空，已使用回退分类，建议人工确认）' : '';
            notificationManager.showSuccessNotification('保存成功', `已保存为"${category}"${confidenceInfo}${fallbackNote}`);

            if (uiContext.source === 'fab' && saveButton) {
                notificationManager.showFabNotification(saveButton, '✅ 已保存', false, originalText);
                setTimeout(() => {
                    notificationManager.showFabNotification(saveButton, originalText, false, originalText);
                }, 2000);
            }

        } catch(error) {
            progressIndicator.hide();

            // 只更新FAB按钮状态，显示错误Toast通知
            if (uiContext.source === 'fab' && saveButton) {
                notificationManager.showFabNotification(saveButton, '❌ 失败', false, originalText);
                setTimeout(() => {
                    notificationManager.showFabNotification(saveButton, originalText, false, originalText);
                }, 3000);
            }

            // 显示错误Toast通知
            notificationManager.showErrorNotification('保存失败', error.message);

            throw error;
        }
    }
    async function startSaveProcess(uiContext) { const pageTitle = document.title; const pageUrl = window.location.href; const saveButton = uiContext.buttonElement; try { if (uiContext.source === 'fab') showNotification(saveButton, '⚙️ 读取中...', true, '➤ Notion'); else console.log('NQS: [Menu] 开始处理 "保存"...'); const settings = await loadAllSettings(); if (!settings.notion_api_key || !settings.database_id) { throw new Error('❌ 配置不完整！请在"设置"中填写 Notion API Key 和数据库ID。'); } if (settings.ai_enabled) { await runAiSave(settings, pageTitle, pageUrl, uiContext); } else { if (uiContext.source === 'fab') showNotification(saveButton, '📂 手动选择', false, '➤ Notion'); else console.log('NQS: [Menu] AI已关闭，正在打开分类选择器...'); await openCategorySelectorPanel(pageTitle, pageUrl, uiContext); } } catch (error) { if (uiContext.source === 'fab') showNotification(saveButton, error.message, false, '➤ Notion'); else console.error(`NQS: [Menu] 保存失败！错误信息: ${error.message}`); await addLog('error', `保存操作失败 (${uiContext.source}): ${error.message}`, { title: pageTitle, url: pageUrl, error: error.message, stack: error.stack }); if (error.message.includes('配置')) setTimeout(openSettingsPanel, 1000); } }
    async function startReadLaterSave(uiContext) {
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        const readLaterButton = uiContext.buttonElement;
        const originalText = '◷ 稍后读';

        try {
            // 显示进度条
            await progressIndicator.show('⚙️ 读取配置中...');

            // 只更新FAB按钮状态
            if (uiContext.source === 'fab' && readLaterButton) {
                notificationManager.showFabNotification(readLaterButton, '⚙️ 准备中...', true, originalText);
            }

            const settings = await loadAllSettings();
            if (!settings.notion_api_key || !settings.database_id) {
                throw new Error('❌ 配置不完整！请在"设置"中填写 Notion API Key 和数据库ID。');
            }
            if (!settings.read_later_enabled) {
                throw new Error('💡 "稍后读"功能未开启。');
            }
            if (!settings.read_later_category) {
                throw new Error('❌ 未设置"稍后读"分类名称。');
            }

            const category = settings.read_later_category;

            // 更新保存状态
            progressIndicator.updateMessage('🚀 保存到 Notion...');

            // 只更新FAB按钮状态
            if (uiContext.source === 'fab' && readLaterButton) {
                notificationManager.showFabNotification(readLaterButton, '🚀 保存中...', true, originalText);
            }

            const notionResponse = await saveToNotion(settings.notion_api_key, settings.database_id, pageTitle, pageUrl, category, settings);

            // 隐藏进度条
            progressIndicator.hide();

            await addLog('info', `页面已存为稍后读 (${uiContext.source})`, {
                title: pageTitle,
                url: pageUrl,
                result: category
            });

            // 显示成功通知和恢复FAB按钮状态
            notificationManager.showSuccessNotification('保存成功', `已添加到"${category}"`);

            if (uiContext.source === 'fab' && readLaterButton) {
                notificationManager.showFabNotification(readLaterButton, '✅ 已保存', false, originalText);
                setTimeout(() => {
                    notificationManager.showFabNotification(readLaterButton, originalText, false, originalText);
                }, 2000);
            }

        } catch (error) {
            progressIndicator.hide();

            // 只更新FAB按钮状态，显示错误Toast通知
            if (uiContext.source === 'fab' && readLaterButton) {
                notificationManager.showFabNotification(readLaterButton, '❌ 失败', false, originalText);
                setTimeout(() => {
                    notificationManager.showFabNotification(readLaterButton, originalText, false, originalText);
                }, 3000);
            }

            // 显示错误Toast通知
            notificationManager.showErrorNotification('保存失败', error.message);

            await addLog('error', `"稍后读"失败 (${uiContext.source}): ${error.message}`, {
                title: pageTitle,
                url: pageUrl,
                error: error.message,
                stack: error.stack
            });

            if (error.message.includes('配置')) {
                setTimeout(openSettingsPanel, 1000);
            }
        }
    }

    // ===================================================================
    // ====================== 脚本初始化与执行 =======================
    // ===================================================================
    class FabPositionManager { constructor() { this.position = null; this.storageKey = 'nqs_fab_pos'; } async loadPosition() { try { const rawPos = await GM_getValue(this.storageKey, null); if (typeof rawPos === 'string') { this.position = JSON.parse(rawPos); } else if (rawPos && typeof rawPos === 'object') { this.position = rawPos; } return this.position; } catch (error) { console.warn('Failed to load fab position:', error); return null; } } async savePosition(position) { this.position = position; try { await GM_setValue(this.storageKey, JSON.stringify(position)); } catch (error) { console.error('Failed to save fab position:', error); } } updatePosition(fabElement) { if (!fabElement) return; const rect = fabElement.getBoundingClientRect(); this.position = { topPercent: rect.top / window.innerHeight, leftPercent: rect.left / window.innerWidth, snapped: false }; } }
    class FabDragHandler { constructor(fabElement, positionManager) { this.fabElement = fabElement; this.positionManager = positionManager; this.isDragging = false; this.wasDragged = false; this.offset = { x: 0, y: 0 }; this.bindEvents(); } bindEvents() { const trigger = this.fabElement.querySelector('#nqs-fab-trigger'); if (!trigger) return; trigger.addEventListener('mousedown', this.handleDragStart.bind(this)); document.addEventListener('mousemove', this.handleDragMove.bind(this)); document.addEventListener('mouseup', this.handleDragEnd.bind(this)); trigger.addEventListener('click', (e) => { if (this.wasDragged) { e.preventDefault(); e.stopPropagation(); } }); } handleDragStart(e) { this.fabElement.classList.remove('is-expanded'); this.isDragging = true; this.wasDragged = false; this.fabElement.classList.add('is-dragging'); const rect = this.fabElement.getBoundingClientRect(); this.offset.x = e.clientX - rect.left; this.offset.y = e.clientY - rect.top; document.body.style.userSelect = 'none'; } handleDragMove(e) { if (!this.isDragging) return; e.preventDefault(); this.wasDragged = true; const newPosition = this.calculateNewPosition(e); this.applyPosition(newPosition); this.removeSnapState(); fabInstance.updateAlignmentClass(); } calculateNewPosition(e) { let newX = e.clientX - this.offset.x; let newY = e.clientY - this.offset.y; const fabRect = this.fabElement.getBoundingClientRect(); const maxX = window.innerWidth - fabRect.width; const maxY = window.innerHeight - fabRect.height; return { x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) }; } applyPosition({ x, y }) { Object.assign(this.fabElement.style, { left: `${x}px`, top: `${y}px`, right: 'auto', bottom: 'auto' }); } removeSnapState() { this.fabElement.classList.remove('snapped-right', 'snapped-left'); } async handleDragEnd() { if (!this.isDragging) return; this.isDragging = false; this.fabElement.classList.remove('is-dragging'); document.body.style.userSelect = 'auto'; setTimeout(() => { this.wasDragged = false; }, 0); const position = this.calculateFinalPosition(); fabInstance.applyPosition(position); await this.positionManager.savePosition(position); } calculateFinalPosition() { const rect = this.fabElement.getBoundingClientRect(); const snapThresholdRight = window.innerWidth * 0.98; const snapThresholdLeft = window.innerWidth * 0.02; if (rect.right > snapThresholdRight) { return { topPercent: rect.top / window.innerHeight, snapped: 'right' }; } else if (rect.left < snapThresholdLeft) { return { topPercent: rect.top / window.innerHeight, snapped: 'left' }; } return { topPercent: rect.top / window.innerHeight, leftPercent: rect.left / window.innerWidth, snapped: false }; } }
    class FloatingActionButton { constructor() { this.positionManager = new FabPositionManager(); this.dragHandler = null; this.container = null; this.resizeHandler = debounce(this.handleResize.bind(this), 150); this.leaveTimeoutId = null; } async init() { await this.cleanup(); injectStyles(); await this.createContainer(); await this.setupPosition(); this.setupInteractions(); this.bindResizeHandler(); } async cleanup() { const existingContainer = document.querySelector('#nqs-fab-container'); if (existingContainer) existingContainer.remove(); } async createContainer() { const globalContainer = document.getElementById('NQS_GLOBAL_CONTAINER'); this.container = document.createElement('div'); this.container.id = 'nqs-fab-container'; await this.createButtons(); globalContainer.appendChild(this.container); } async createButtons() { const settings = await loadAllSettings(); const optionsWrapper = document.createElement('div'); optionsWrapper.className = 'nqs-fab-options'; const saveButton = this.createActionButton('nqs-save-button', '➤ Notion'); saveButton.addEventListener('click', (e) => { e.stopPropagation(); this.handleButtonClick(e, 'save', saveButton); }); optionsWrapper.appendChild(saveButton); if (settings.read_later_enabled) { const readLaterButton = this.createActionButton('nqs-read-later-button', '◷ 稍后读'); readLaterButton.addEventListener('click', (e) => { e.stopPropagation(); this.handleButtonClick(e, 'readLater', readLaterButton); }); optionsWrapper.appendChild(readLaterButton); } const triggerButton = document.createElement('div'); triggerButton.id = 'nqs-fab-trigger'; setSafeInnerHTML(triggerButton, '➤'); this.container.appendChild(triggerButton); this.container.appendChild(optionsWrapper); } createActionButton(id, text) { const button = document.createElement('div'); button.id = id; button.className = 'nqs-fab-action-btn'; button.textContent = text; return button; } handleButtonClick(e, action, buttonElement) { (action === 'save' ? startSaveProcess : startReadLaterSave)({ source: 'fab', buttonElement }); } async setupPosition() { const savedPos = await this.positionManager.loadPosition(); if (savedPos) this.applyPosition(savedPos); else this.setDefaultPosition(); } applyPosition(position) { this.container.classList.remove('snapped-right', 'snapped-left'); if (position.snapped === 'right') { Object.assign(this.container.style, { top: `${position.topPercent * window.innerHeight}px`, right: '0px', left: 'auto', bottom: 'auto' }); this.container.classList.add('snapped-right'); } else if (position.snapped === 'left') { Object.assign(this.container.style, { top: `${position.topPercent * window.innerHeight}px`, left: '0px', right: 'auto', bottom: 'auto' }); this.container.classList.add('snapped-left'); } else { Object.assign(this.container.style, { top: `${position.topPercent * window.innerHeight}px`, left: `${position.leftPercent * window.innerWidth}px`, right: 'auto', bottom: 'auto' }); } this.updateAlignmentClass(); } setDefaultPosition() { Object.assign(this.container.style, { right: '30px', bottom: '30px' }); setTimeout(() => { this.positionManager.updatePosition(this.container); this.updateAlignmentClass(); }, 0); } updateAlignmentClass() { if (!this.container) return; const rect = this.container.getBoundingClientRect(); const viewportCenterX = window.innerWidth / 2; const fabCenterX = rect.left + rect.width / 2; if (fabCenterX < viewportCenterX) this.container.classList.add('align-left'); else this.container.classList.remove('align-left'); }
        setupInteractions() { this.dragHandler = new FabDragHandler(this.container, this.positionManager); this.container.addEventListener('mouseenter', (event) => { if (this.leaveTimeoutId) { clearTimeout(this.leaveTimeoutId); this.leaveTimeoutId = null; } if (this.dragHandler.isDragging || event.buttons === 1) return; this.container.classList.add('is-expanded'); }); this.container.addEventListener('mouseleave', () => { this.leaveTimeoutId = setTimeout(() => { this.container.classList.remove('is-expanded'); }, 300); }); }
        handleResize() { const position = this.positionManager.position; if (!this.container || !position || this.dragHandler?.isDragging) return; if (!position.snapped) { const newX = position.leftPercent * window.innerWidth; this.container.style.left = `${newX}px`; } const newY = position.topPercent * window.innerHeight; this.container.style.top = `${newY}px`; this.updateAlignmentClass(); } bindResizeHandler() { window.addEventListener('resize', this.resizeHandler); } destroy() { window.removeEventListener('resize', this.resizeHandler); this.container?.remove(); }
    }

    let fabInstance = null;
    function injectStyles() { const styleId = 'nqs-custom-ui-styles'; const container = document.getElementById('NQS_GLOBAL_CONTAINER'); if (container.querySelector(`#${styleId}`)) return; const css = `
/* === 统一的主题变量系统 === */
#NQS_GLOBAL_CONTAINER {
    all: initial;
    /* 明亮主题变量 */
    --nqs-bg: #ffffff;
    --nqs-bg-subtle: #f8fafc;
    --nqs-bg-hover: #f1f5f9;
    --nqs-bg-active: #e2e8f0;
    --nqs-border: #e2e8f0;
    --nqs-border-hover: #cbd5e1;
    --nqs-text-primary: #0f172a;
    --nqs-text-secondary: #64748b;
    --nqs-text-tertiary: #94a3b8;
    --nqs-accent: #3b82f6;
    --nqs-accent-hover: #2563eb;
    --nqs-accent-light: #dbeafe;
    --nqs-success: #10b981;
    --nqs-success-light: #d1fae5;
    --nqs-warning: #f59e0b;
    --nqs-warning-light: #fef3c7;
    --nqs-danger: #ef4444;
    --nqs-danger-light: #fecaca;
    --nqs-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --nqs-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --nqs-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --nqs-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --nqs-radius: 8px;
    --nqs-radius-lg: 12px;
    --nqs-radius-xl: 16px;
}

/* 暗黑主题变量 */
#NQS_GLOBAL_CONTAINER[data-theme='dark'] {
    --nqs-bg: #0f172a;
    --nqs-bg-subtle: #1e293b;
    --nqs-bg-hover: #334155;
    --nqs-bg-active: #475569;
    --nqs-border: #334155;
    --nqs-border-hover: #475569;
    --nqs-text-primary: #f8fafc;
    --nqs-text-secondary: #cbd5e1;
    --nqs-text-tertiary: #94a3b8;
    --nqs-accent: #3b82f6;
    --nqs-accent-hover: #60a5fa;
    --nqs-accent-light: #1e3a8a;
    --nqs-success: #10b981;
    --nqs-success-light: #064e3b;
    --nqs-warning: #f59e0b;
    --nqs-warning-light: #78350f;
    --nqs-danger: #ef4444;
    --nqs-danger-light: #7f1d1d;
    --nqs-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    --nqs-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
    --nqs-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
}

/* 自动主题跟随系统 */
@media (prefers-color-scheme: dark) {
    #NQS_GLOBAL_CONTAINER[data-theme='auto'] {
        --nqs-bg: #0f172a;
        --nqs-bg-subtle: #1e293b;
        --nqs-bg-hover: #334155;
        --nqs-bg-active: #475569;
        --nqs-border: #334155;
        --nqs-border-hover: #475569;
        --nqs-text-primary: #f8fafc;
        --nqs-text-secondary: #cbd5e1;
        --nqs-text-tertiary: #94a3b8;
        --nqs-accent: #3b82f6;
        --nqs-accent-hover: #60a5fa;
        --nqs-accent-light: #1e3a8a;
        --nqs-success: #10b981;
        --nqs-success-light: #064e3b;
        --nqs-warning: #f59e0b;
        --nqs-warning-light: #78350f;
        --nqs-danger: #ef4444;
        --nqs-danger-light: #7f1d1d;
        --nqs-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        --nqs-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
        --nqs-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
    }
}
/* === 基础样式和动画 === */
#NQS_GLOBAL_CONTAINER * {
    box-sizing: border-box;
    font-family: var(--nqs-font-family);
}

@keyframes nqs-spin {
    from { transform: translateY(-50%) rotate(0deg); }
    to { transform: translateY(-50%) rotate(360deg); }
}

@keyframes nqs-fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes nqs-slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* === 模态弹窗样式 === */
#NQS_GLOBAL_CONTAINER .nqs-overlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100000;
}

#NQS_GLOBAL_CONTAINER .nqs-overlay.visible{
    opacity: 1;
}

#NQS_GLOBAL_CONTAINER .nqs-panel{
    width: 100%;
    max-width: 720px;
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-xl);
    box-shadow: var(--nqs-shadow-xl);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    margin: 1rem;
    transform: scale(0.95) translateY(20px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-overlay.visible .nqs-panel{
    transform: scale(1) translateY(0);
}
/* === 面板内容样式 === */
#NQS_GLOBAL_CONTAINER .nqs-header{
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--nqs-border);
    flex-shrink: 0;
    background: var(--nqs-bg-subtle);
    border-top-left-radius: var(--nqs-radius-xl);
    border-top-right-radius: var(--nqs-radius-xl);
}

#NQS_GLOBAL_CONTAINER .nqs-header h1{
    font-size: 1.5rem;
    margin: 0;
    color: var(--nqs-text-primary);
    font-weight: 700;
    letter-spacing: -0.025em;
}

#NQS_GLOBAL_CONTAINER .nqs-header p{
    font-size: 0.9rem;
    margin: 0.5rem 0 0 0;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

#NQS_GLOBAL_CONTAINER .nqs-body{
    padding: 2rem;
    overflow-y: auto;
    flex-grow: 1;
    min-height: 0;
    background: var(--nqs-bg);
}
/* === 日志查看器布局样式 === */
#NQS_GLOBAL_CONTAINER .nqs-panel--log-viewer .nqs-body {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 75vh;
    min-height: 600px;
    max-height: 800px;
    background: var(--nqs-bg-subtle);
    width: 100%;
    overflow: hidden;
}

/* === 日志统计卡片样式 === */
#NQS_GLOBAL_CONTAINER .nqs-log-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 20px;
    background: var(--nqs-bg);
    border-bottom: 1px solid var(--nqs-border);
}

#NQS_GLOBAL_CONTAINER .nqs-stat-card {
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--nqs-accent);
}

#NQS_GLOBAL_CONTAINER .nqs-stat-card.nqs-stat-success::before {
    background: linear-gradient(90deg, #34C759, #30D158);
}

#NQS_GLOBAL_CONTAINER .nqs-stat-card.nqs-stat-error::before {
    background: linear-gradient(90deg, #FF3B30, #FF453A);
}

#NQS_GLOBAL_CONTAINER .nqs-stat-card.nqs-stat-debug::before {
    background: linear-gradient(90deg, #8E8E93, #AEAEB2);
}

#NQS_GLOBAL_CONTAINER .nqs-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--nqs-shadow-lg);
}

#NQS_GLOBAL_CONTAINER .nqs-stat-icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nqs-bg-subtle);
    border-radius: 12px;
    flex-shrink: 0;
}

#NQS_GLOBAL_CONTAINER .nqs-stat-content {
    flex: 1;
}

#NQS_GLOBAL_CONTAINER .nqs-stat-number {
    font-size: 24px;
    font-weight: 700;
    color: var(--nqs-text-primary);
    line-height: 1.2;
}

#NQS_GLOBAL_CONTAINER .nqs-stat-label {
    font-size: 14px;
    color: var(--nqs-text-secondary);
    margin-top: 4px;
}

/* === 过滤栏样式 === */
#NQS_GLOBAL_CONTAINER .nqs-log-filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    flex-shrink: 0;
    background: var(--nqs-bg);
    border-bottom: 1px solid var(--nqs-border);
    gap: 20px;
}

#NQS_GLOBAL_CONTAINER .nqs-filter-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-filter-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-search-box {
    position: relative;
    display: flex;
    align-items: center;
}

#NQS_GLOBAL_CONTAINER .nqs-search-input {
    padding: 8px 12px 8px 36px;
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    background: var(--nqs-bg-subtle);
    color: var(--nqs-text-primary);
    font-size: 14px;
    width: 200px;
    transition: all 0.2s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-search-input:focus {
    outline: none;
    border-color: var(--nqs-accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

#NQS_GLOBAL_CONTAINER .nqs-search-icon {
    position: absolute;
    left: 12px;
    font-size: 14px;
    color: var(--nqs-text-secondary);
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-group {
    display: flex;
    align-items: center;
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--nqs-text-primary);
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-input {
    display: none;
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-slider {
    width: 40px;
    height: 20px;
    background: var(--nqs-border);
    border-radius: 10px;
    position: relative;
    transition: all 0.3s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-slider::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-input:checked + .nqs-toggle-slider {
    background: var(--nqs-accent);
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-input:checked + .nqs-toggle-slider::after {
    transform: translateX(20px);
}

#NQS_GLOBAL_CONTAINER .nqs-toggle-text {
    font-weight: 500;
}

/* === 表格容器样式 === */
#NQS_GLOBAL_CONTAINER .nqs-table-container {
    overflow-y: auto;
    flex-grow: 1;
    padding: 0;
    width: 100%;
    background: var(--nqs-bg);
    min-height: 0;
}

/* === 日志卡片样式 === */
#NQS_GLOBAL_CONTAINER .nqs-log-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-card {
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    padding: 16px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-log-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--nqs-accent);
}

#NQS_GLOBAL_CONTAINER .nqs-log-card--info::before {
    background: linear-gradient(90deg, #34C759, #30D158);
}

#NQS_GLOBAL_CONTAINER .nqs-log-card--error::before {
    background: linear-gradient(90deg, #FF3B30, #FF453A);
}

#NQS_GLOBAL_CONTAINER .nqs-log-card--debug::before {
    background: linear-gradient(90deg, #8E8E93, #AEAEB2);
}

#NQS_GLOBAL_CONTAINER .nqs-log-card--warn::before {
    background: linear-gradient(90deg, #FF9500, #FF9F0A);
}

#NQS_GLOBAL_CONTAINER .nqs-log-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--nqs-shadow-lg);
    border-color: var(--nqs-accent-light);
}

#NQS_GLOBAL_CONTAINER .nqs-log-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-level-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: var(--nqs-radius);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-level-icon {
    font-size: 14px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-time {
    font-size: 12px;
    color: var(--nqs-text-secondary);
    font-weight: 500;
}

#NQS_GLOBAL_CONTAINER .nqs-log-card-body {
    margin-bottom: 12px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-message {
    color: var(--nqs-text-primary);
    line-height: 1.5;
    font-size: 14px;
    word-break: break-word;
}

#NQS_GLOBAL_CONTAINER .nqs-log-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--nqs-text-secondary);
}

#NQS_GLOBAL_CONTAINER .nqs-log-page {
    font-weight: 600;
    color: var(--nqs-text-secondary);
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#NQS_GLOBAL_CONTAINER .nqs-log-action-pill,
#NQS_GLOBAL_CONTAINER .nqs-log-tag-pill {
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    border: 1px solid var(--nqs-border);
    background: var(--nqs-bg-subtle);
    color: var(--nqs-text-secondary);
}

#NQS_GLOBAL_CONTAINER .nqs-log-action-pill {
    border-color: var(--nqs-accent);
    color: var(--nqs-accent);
    background: var(--nqs-accent-light);
    font-weight: 600;
}

#NQS_GLOBAL_CONTAINER .nqs-log-action-pill--muted {
    border-color: var(--nqs-border);
    color: var(--nqs-text-secondary);
    background: transparent;
}

#NQS_GLOBAL_CONTAINER .nqs-log-card-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid var(--nqs-border-light);
}

#NQS_GLOBAL_CONTAINER .nqs-log-detail-btn {
    background: var(--nqs-accent-light);
    color: var(--nqs-accent);
    border: 1px solid var(--nqs-accent);
    padding: 6px 12px;
    border-radius: var(--nqs-radius);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-detail-btn:hover {
    background: var(--nqs-accent);
    color: white;
    transform: scale(1.05);
}

#NQS_GLOBAL_CONTAINER .nqs-no-details {
    color: var(--nqs-text-tertiary);
    font-size: 12px;
    font-style: italic;
}

/* === 空状态样式 === */
#NQS_GLOBAL_CONTAINER .nqs-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

#NQS_GLOBAL_CONTAINER .nqs-empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

#NQS_GLOBAL_CONTAINER .nqs-empty-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--nqs-text-primary);
    margin-bottom: 8px;
}

#NQS_GLOBAL_CONTAINER .nqs-empty-message {
    font-size: 14px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

/* === 底部操作栏样式 === */
#NQS_GLOBAL_CONTAINER .nqs-log-footer-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

#NQS_GLOBAL_CONTAINER .nqs-log-footer-left {
    display: flex;
    gap: 12px;
    align-items: center;
}

#NQS_GLOBAL_CONTAINER .nqs-log-footer-right {
    display: flex;
    align-items: center;
}

#NQS_GLOBAL_CONTAINER .nqs-log-footer-actions .nqs-button {
    display: flex;
    align-items: center;
    gap: 8px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-footer-actions .nqs-button span:first-child {
    font-size: 16px;
}

/* === 日志详情弹窗样式 === */
#NQS_GLOBAL_CONTAINER .nqs-panel--log-detail .nqs-body {
    padding: 0;
    max-height: 70vh;
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-log-detail-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

#NQS_GLOBAL_CONTAINER .nqs-json-viewer {
    flex: 1;
    overflow: auto;
    background: var(--nqs-bg-subtle);
    border-radius: var(--nqs-radius);
    border: 1px solid var(--nqs-border);
    margin: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-json-code {
    margin: 0;
    padding: 20px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: var(--nqs-text-primary);
    background: transparent;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

#NQS_GLOBAL_CONTAINER .nqs-log-detail-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

#NQS_GLOBAL_CONTAINER .nqs-log-detail-footer .nqs-button {
    display: flex;
    align-items: center;
    gap: 8px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-detail-footer .nqs-button span:first-child {
    font-size: 16px;
}
#NQS_GLOBAL_CONTAINER .nqs-filter-group {
    display: flex;
    gap: 8px;
    align-items: center;
}

/* === 现代化过滤按钮样式 === */
#NQS_GLOBAL_CONTAINER .nqs-filter-btn {
    background: var(--nqs-bg-subtle);
    border: 1px solid var(--nqs-border);
    color: var(--nqs-text-primary);
    padding: 10px 16px;
    border-radius: var(--nqs-radius-lg);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 8px;
}

#NQS_GLOBAL_CONTAINER .nqs-filter-icon {
    font-size: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-filter-btn:hover {
    background: var(--nqs-bg-hover);
    border-color: var(--nqs-accent);
    transform: translateY(-1px);
    box-shadow: var(--nqs-shadow);
}

#NQS_GLOBAL_CONTAINER .nqs-filter-btn.active {
    background: var(--nqs-accent);
    color: white;
    border-color: var(--nqs-accent);
    box-shadow: var(--nqs-shadow-lg);
}

#NQS_GLOBAL_CONTAINER .nqs-filter-btn.active:hover {
    background: var(--nqs-accent-hover);
    transform: translateY(-1px);
}

/* === 详情按钮样式 === */
#NQS_GLOBAL_CONTAINER .nqs-detail-btn {
    background: var(--nqs-accent-light);
    color: var(--nqs-accent);
    border: 1px solid var(--nqs-accent);
    padding: 6px 12px;
    border-radius: var(--nqs-radius);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-detail-btn:hover {
    background: var(--nqs-accent);
    color: white;
    transform: scale(1.05);
}

#NQS_GLOBAL_CONTAINER .nqs-no-detail {
    color: var(--nqs-text-tertiary);
    font-size: 12px;
}

/* === 底部操作栏样式 === */
#NQS_GLOBAL_CONTAINER .nqs-footer{
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--nqs-border);
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--nqs-bg-subtle);
    border-bottom-left-radius: var(--nqs-radius-xl);
    border-bottom-right-radius: var(--nqs-radius-xl);
    flex-shrink: 0;
}

/* === 统一按钮样式 === */
#NQS_GLOBAL_CONTAINER .nqs-button{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: var(--nqs-radius);
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-button:hover{
    transform: translateY(-2px);
    box-shadow: var(--nqs-shadow-lg);
}

#NQS_GLOBAL_CONTAINER .nqs-button:active{
    transform: translateY(0);
    box-shadow: var(--nqs-shadow);
}

#NQS_GLOBAL_CONTAINER .nqs-button-primary{
    background: var(--nqs-accent);
    color: white;
    border-color: var(--nqs-accent);
}

#NQS_GLOBAL_CONTAINER .nqs-button-primary:hover{
    background: var(--nqs-accent-hover);
    border-color: var(--nqs-accent-hover);
}

#NQS_GLOBAL_CONTAINER .nqs-button-secondary{
    background: var(--nqs-bg-subtle);
    border-color: var(--nqs-border);
    color: var(--nqs-text-primary);
}

#NQS_GLOBAL_CONTAINER .nqs-button-secondary:hover{
    background: var(--nqs-bg-hover);
    border-color: var(--nqs-border-hover);
}

#NQS_GLOBAL_CONTAINER .nqs-button-danger{
    background: var(--nqs-danger);
    color: white;
    border-color: var(--nqs-danger);
}

#NQS_GLOBAL_CONTAINER .nqs-button-danger:hover{
    background: #dc2626;
    border-color: #dc2626;
}

#NQS_GLOBAL_CONTAINER .nqs-button-text{
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    color: var(--nqs-accent);
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    line-height: 1.5;
    font-size: 0.9rem;
    border-radius: var(--nqs-radius);
    transition: all 0.2s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-button-text:hover{
    background: var(--nqs-accent-light);
    color: var(--nqs-accent-hover);
    transform: none;
    box-shadow: none;
}
/* === iOS风格日志表格样式 === */
#NQS_GLOBAL_CONTAINER .nqs-log-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 15px;
    background: rgba(255, 255, 255, 0.95);
    margin: 0;
    letter-spacing: -0.24px;
}

/* 暗色主题适配 */
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-log-table {
    background: rgba(28, 28, 30, 0.95);
}

#NQS_GLOBAL_CONTAINER .nqs-log-table th {
    text-align: left;
    padding: 16px 20px;
    font-weight: 600;
    color: var(--nqs-text-secondary);
    background: rgba(242, 242, 247, 0.95);
    position: sticky;
    top: 0;
    z-index: 5;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

/* 暗色主题适配 */
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-log-table th {
    background: rgba(44, 44, 46, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.12);
}

#NQS_GLOBAL_CONTAINER .nqs-log-table td {
    padding: 16px 20px;
    vertical-align: middle;
    color: var(--nqs-text-primary);
    background: rgba(255, 255, 255, 0.95);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    position: relative;
    font-size: 15px;
    letter-spacing: -0.24px;
}

/* 暗色主题适配 */
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-log-table td {
    background: rgba(28, 28, 30, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.08);
}

/* 基础行样式 */
#NQS_GLOBAL_CONTAINER .nqs-log-table tbody tr {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

#NQS_GLOBAL_CONTAINER .nqs-log-table tbody tr::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, var(--nqs-accent), transparent);
    transition: width 0.3s ease;
    z-index: 1;
}

#NQS_GLOBAL_CONTAINER .nqs-log-table tbody tr:nth-child(even) td {
    background: rgba(242, 242, 247, 0.5);
}

#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-log-table tbody tr:nth-child(even) td {
    background: rgba(44, 44, 46, 0.5);
}

#NQS_GLOBAL_CONTAINER .nqs-log-table tbody tr:hover {
    box-shadow:
        0 4px 20px rgba(0, 122, 255, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.1);
    transform: scale(1.005);
}

#NQS_GLOBAL_CONTAINER .nqs-log-table tbody tr:hover::before {
    width: 3px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-table tbody tr:hover td {
    background: rgba(0, 122, 255, 0.04) !important;
    position: relative;
    z-index: 2;
}

#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-log-table tbody tr:hover td {
    background: rgba(0, 122, 255, 0.08) !important;
}

/* iOS风格日志行状态样式 */
#NQS_GLOBAL_CONTAINER .nqs-log-row--info td {
    border-left: 3px solid #007AFF;
    background: rgba(0, 122, 255, 0.04);
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--info:nth-child(even) td {
    background: rgba(0, 122, 255, 0.06);
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--info:hover td {
    background: rgba(0, 122, 255, 0.1) !important;
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--error td {
    border-left: 3px solid #FF3B30;
    background: rgba(255, 59, 48, 0.04);
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--error:nth-child(even) td {
    background: rgba(255, 59, 48, 0.06);
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--error:hover td {
    background: rgba(255, 59, 48, 0.1) !important;
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--debug td {
    border-left: 3px solid #8E8E93;
    background: rgba(142, 142, 147, 0.04);
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--debug:nth-child(even) td {
    background: rgba(142, 142, 147, 0.06);
}

#NQS_GLOBAL_CONTAINER .nqs-log-row--debug:hover td {
    background: rgba(142, 142, 147, 0.1) !important;
}

/* iOS风格单元格内容样式 */
#NQS_GLOBAL_CONTAINER .nqs-log-cell-time {
    white-space: nowrap;
    color: var(--nqs-text-secondary);
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    font-size: 13px;
    font-weight: 500;
    min-width: 140px;
    letter-spacing: -0.08px;
    opacity: 0.8;
}

#NQS_GLOBAL_CONTAINER .nqs-log-cell-level {
    min-width: 80px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-cell-message {
    word-break: break-word;
    white-space: normal;
    line-height: 1.5;
    max-width: 400px;
    letter-spacing: -0.24px;
}

#NQS_GLOBAL_CONTAINER .nqs-log-cell-actions {
    min-width: 80px;
    text-align: center;
}

#NQS_GLOBAL_CONTAINER .nqs-log-cell-actions a {
    color: #007AFF;
    text-decoration: none;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 16px;
    transition: all 0.2s ease;
    font-size: 13px;
    letter-spacing: -0.08px;
    background: rgba(0, 122, 255, 0.1);
}

#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-log-cell-actions a {
    color: #0A84FF;
    background: rgba(10, 132, 255, 0.15);
}

#NQS_GLOBAL_CONTAINER .nqs-log-cell-actions a:hover {
    background: rgba(0, 122, 255, 0.2);
    color: #005BB5;
    transform: scale(1.05);
}

#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-log-cell-actions a:hover {
    background: rgba(10, 132, 255, 0.25);
    color: #409CFF;
}
/* === 日志标签样式 === */
#NQS_GLOBAL_CONTAINER .nqs-log-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem 0.8rem;
    border-radius: var(--nqs-radius);
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1;
    border: none;
    min-width: 60px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-log-tag.info {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

#NQS_GLOBAL_CONTAINER .nqs-log-tag.error {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

#NQS_GLOBAL_CONTAINER .nqs-log-tag.debug {
    background: linear-gradient(135deg, #6b7280, #4b5563);
    color: white;
}

#NQS_GLOBAL_CONTAINER .nqs-log-tag.legacy {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
}
#NQS_GLOBAL_CONTAINER .nqs-json-viewer { background-color: var(--nqs-bg-subtle); color: var(--nqs-text-primary); font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 14px; padding: 1.5rem; }
#NQS_GLOBAL_CONTAINER .json-key { color: #9cdcfe; } #NQS_GLOBAL_CONTAINER .json-string { color: #ce9178; } #NQS_GLOBAL_CONTAINER .json-number { color: #b5cea8; } #NQS_GLOBAL_CONTAINER .json-boolean { color: #569cd6; } #NQS_GLOBAL_CONTAINER .json-null { color: #c586c0; }
/* 保留旧的标签组样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER .nqs-label-group{padding-top:.5rem;display:flex;flex-direction:column;}
#NQS_GLOBAL_CONTAINER .nqs-label-group label{display:block;font-weight:500;color:var(--nqs-text-primary); margin: 0; padding: 0;}
#NQS_GLOBAL_CONTAINER p.nqs-p, #NQS_GLOBAL_CONTAINER .nqs-label-group p {font-size:.85rem;color:var(--nqs-text-secondary);margin:.25rem 0 0 0; line-height: 1.6;}

/* 新的设置标签组样式 */

#NQS_GLOBAL_CONTAINER .nqs-toggle-switch{display:flex;align-items:center;justify-content:flex-end}
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch .nqs-switch{position:relative;display:inline-block;width:50px;height:28px}
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch .nqs-switch input{opacity:0;width:0;height:0}
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch .nqs-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:28px}
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-toggle-switch .nqs-slider { background-color: var(--nqs-border); }
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch .nqs-slider:before{position:absolute;content:"";height:20px;width:20px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch input:checked+.nqs-slider{background-color:var(--nqs-accent)}
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch input:checked+.nqs-slider:before{transform:translateX(22px)}
/* === 表单元素样式 === */
#NQS_GLOBAL_CONTAINER .nqs-input,
#NQS_GLOBAL_CONTAINER .nqs-textarea{
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
    font-family: inherit;
    color: var(--nqs-text-primary);
    background-color: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1.5;
}

#NQS_GLOBAL_CONTAINER .nqs-input:hover,
#NQS_GLOBAL_CONTAINER .nqs-textarea:hover{
    border-color: var(--nqs-border-hover);
    background-color: var(--nqs-bg-hover);
}

#NQS_GLOBAL_CONTAINER .nqs-input:focus,
#NQS_GLOBAL_CONTAINER .nqs-textarea:focus{
    outline: 0;
    border-color: var(--nqs-accent);
    background-color: var(--nqs-bg);
    box-shadow: 0 0 0 3px var(--nqs-accent-light);
    transform: translateY(-1px);
}

#NQS_GLOBAL_CONTAINER .nqs-input::placeholder,
#NQS_GLOBAL_CONTAINER .nqs-textarea::placeholder{
    color: var(--nqs-text-tertiary);
}
#NQS_GLOBAL_CONTAINER .nqs-section{margin-bottom:2.5rem}.nqs-section:last-child{margin-bottom:0}
#NQS_GLOBAL_CONTAINER .nqs-section-title{font-size:1.25rem;font-weight:600;color:var(--nqs-text-primary);border-bottom:1px solid var(--nqs-border);padding-bottom:.75rem;margin-bottom:1.5rem}
#NQS_GLOBAL_CONTAINER .nqs-subsection-title{font-size:1rem;font-weight:600;color:var(--nqs-text-primary);margin-top:1.5rem;margin-bottom:0.5rem;}
#NQS_GLOBAL_CONTAINER .nqs-subsection-p{font-size:.85rem;color:var(--nqs-text-secondary);margin-top:0;margin-bottom:1rem;}
/* 保留旧的字段样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER .nqs-field{display:grid;grid-template-columns:1fr 1.5fr;gap:1rem 2rem;align-items:flex-start;margin-bottom:1.5rem}
#NQS_GLOBAL_CONTAINER .nqs-field-full{grid-template-columns:1fr}

/* 新的设置字段样式 */

/* 保留旧的分类管理样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER .nqs-category-manager{display: flex; margin-top: 0.5rem;}
#NQS_GLOBAL_CONTAINER .nqs-category-manager input{border-top-right-radius:0;border-bottom-right-radius:0}
#NQS_GLOBAL_CONTAINER .nqs-category-manager button{border-top-left-radius:0;border-bottom-left-radius:0}

/* 新的分类管理样式 */

/* 保留旧的模型选择器样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER .nqs-model-selector-wrapper { position: relative; }
#NQS_GLOBAL_CONTAINER .nqs-model-selector-wrapper .nqs-input { padding-right: 44px !important; }

/* 新的模型选择器样式 */

/* 保留旧的图标按钮样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER .nqs-icon-button { position: absolute; top: 50%; right: 5px; transform: translateY(-50%); width: 34px; height: 34px; border: none; background: transparent; color: var(--nqs-text-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: color 0.2s, background-color 0.2s; }
#NQS_GLOBAL_CONTAINER .nqs-icon-button:hover { background-color: var(--nqs-bg-subtle); color: var(--nqs-text-primary); }
#NQS_GLOBAL_CONTAINER .nqs-icon-button:disabled { cursor: not-allowed; color: var(--nqs-border); }
#NQS_GLOBAL_CONTAINER .nqs-icon-button.is-loading svg { animation: nqs-spin 1s linear infinite; }

/* 新的获取模型按钮样式 */

/* 保留旧的自定义下拉框样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER .nqs-custom-dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: 10; background: var(--nqs-bg); border: 1px solid var(--nqs-border); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 0.5rem; max-height: 200px; overflow-y: auto; opacity: 0; transform: translateY(-10px); transition: opacity .2s ease, transform .2s ease; pointer-events: none; }
#NQS_GLOBAL_CONTAINER .nqs-custom-dropdown.is-visible { opacity: 1; transform: translateY(0); pointer-events: auto; }

/* 新的模型下拉框样式 */

/* 保留旧的下拉框项目样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER .nqs-dropdown-item { padding: 0.75rem 1rem; cursor: pointer; transition: background-color .2s; color: var(--nqs-text-primary); }
#NQS_GLOBAL_CONTAINER .nqs-dropdown-item:hover, #NQS_GLOBAL_CONTAINER .nqs-dropdown-item.is-active { background-color: var(--nqs-bg-subtle); }

/* 新的下拉框项目样式 */

#NQS_GLOBAL_CONTAINER .nqs-textarea{min-height:150px;resize:vertical}
/* 保留旧的分类列表样式以兼容其他功能 */
#NQS_GLOBAL_CONTAINER #nqs-category-list{list-style:none;padding:0;margin-top:1rem;display:flex;flex-wrap:wrap;gap:.75rem}
#NQS_GLOBAL_CONTAINER #nqs-category-list li{display:flex;align-items:center;background:var(--nqs-bg-subtle);color:var(--nqs-text-primary);padding:.5rem 1rem;border-radius:8px;font-size:.9rem;font-weight:500; line-height:1; border: 1px solid var(--nqs-border);}
#NQS_GLOBAL_CONTAINER #nqs-category-list .delete-cat{margin-left:.75rem;cursor:pointer;color:var(--nqs-text-secondary);font-weight:700;font-size:1.3em;line-height:1;transition:color .2s ease}
#NQS_GLOBAL_CONTAINER #nqs-category-list .delete-cat:hover{color:var(--nqs-danger)}

/* 新的分类列表样式 */

#NQS_GLOBAL_CONTAINER .nqs-button-text{background:none;border:none;padding:4px 8px;color:var(--nqs-accent);font-weight:500;cursor:pointer;text-align:left;line-height:1.5; font-size: 0.8rem;}
#NQS_GLOBAL_CONTAINER .nqs-button-text:hover{text-decoration:underline}
#NQS_GLOBAL_CONTAINER #nqs-selector-list {display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem;}
#NQS_GLOBAL_CONTAINER #nqs-selector-list .nqs-button-secondary { background: var(--nqs-bg-subtle); color: var(--nqs-text-primary); border-color: var(--nqs-border); }
/* === FAB (悬浮球) 样式 === */
#NQS_GLOBAL_CONTAINER #nqs-fab-container { position: fixed; z-index: 99999; width: 48px; height: 48px; transition: transform 0.3s ease-out; }
#NQS_GLOBAL_CONTAINER #nqs-fab-trigger { width: 100%; height: 100%; background: var(--nqs-accent); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); cursor: grab; transition: transform 0.2s ease, box-shadow 0.2s ease; position: relative; z-index: 2; }
#NQS_GLOBAL_CONTAINER #nqs-fab-trigger:active { cursor: grabbing; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.is-dragging #nqs-fab-trigger { transform: scale(1.1); }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.is-expanded #nqs-fab-trigger { transform: rotate(90deg); }
#NQS_GLOBAL_CONTAINER .nqs-fab-options { position: absolute; bottom: calc(100% + 15px); right: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; transition: opacity 0.2s ease, transform 0.2s ease; opacity: 0; transform: translateY(10px); pointer-events: none; z-index: 1; }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.align-left .nqs-fab-options { right: auto; left: 0; align-items: flex-start; }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.is-expanded .nqs-fab-options { opacity: 1; transform: translateY(0); pointer-events: auto; }
#NQS_GLOBAL_CONTAINER .nqs-fab-action-btn { padding: 8px 16px; color: white; border-radius: 20px; font-size: 14px; font-weight: 600; box-shadow: 0 6px 15px rgba(0,0,0,0.15); transition: all .2s ease-out; white-space: nowrap; cursor: pointer; }
#NQS_GLOBAL_CONTAINER #nqs-save-button { background-color: rgba(0, 122, 255, 0.95); }
#NQS_GLOBAL_CONTAINER #nqs-read-later-button { background-color: rgba(90, 90, 90, 0.95); }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.is-expanded .nqs-fab-options #nqs-read-later-button { transition-delay: 0.05s; }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.is-expanded .nqs-fab-options #nqs-save-button { transition-delay: 0.1s; }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.snapped-right { transform: translateX(30%); }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.snapped-right:hover, #NQS_GLOBAL_CONTAINER #nqs-fab-container.snapped-right.is-expanded { transform: translateX(0); }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.snapped-left { transform: translateX(-30%); }
#NQS_GLOBAL_CONTAINER #nqs-fab-container.snapped-left:hover, #NQS_GLOBAL_CONTAINER #nqs-fab-container.snapped-left.is-expanded { transform: translateX(0); }
/* === 顶部进度条样式 === */
#NQS_GLOBAL_CONTAINER .nqs-top-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100001;
    background: var(--nqs-bg);
    border-bottom: 1px solid var(--nqs-border);
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

#NQS_GLOBAL_CONTAINER .nqs-top-progress.visible {
    transform: translateY(0);
}

#NQS_GLOBAL_CONTAINER .nqs-progress-bar {
    height: 3px;
    background: var(--nqs-border);
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--nqs-accent), var(--nqs-accent-hover));
    width: 0%;
    transition: width 0.3s ease;
    position: relative;
}

#NQS_GLOBAL_CONTAINER .nqs-progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
    animation: nqs-shimmer 1.5s infinite;
}

@keyframes nqs-shimmer {
    0% { transform: translateX(-20px); }
    100% { transform: translateX(20px); }
}

#NQS_GLOBAL_CONTAINER .nqs-progress-status {
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

#NQS_GLOBAL_CONTAINER .nqs-progress-text {
    color: var(--nqs-text-secondary);
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: -0.025em;
}

#NQS_GLOBAL_CONTAINER .nqs-progress-status::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--nqs-accent);
    animation: nqs-pulse 2s infinite;
}

@keyframes nqs-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
}

/* === 浮动通知样式 === */
#NQS_GLOBAL_CONTAINER .nqs-toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100002;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

#NQS_GLOBAL_CONTAINER .nqs-toast {
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    box-shadow: var(--nqs-shadow-lg);
    padding: 1rem 1.5rem;
    min-width: 320px;
    max-width: 400px;
    pointer-events: auto;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-left: 4px solid var(--nqs-accent);
}

#NQS_GLOBAL_CONTAINER .nqs-toast.visible {
    transform: translateX(0);
    opacity: 1;
}

#NQS_GLOBAL_CONTAINER .nqs-toast.success {
    border-left-color: var(--nqs-success);
}

#NQS_GLOBAL_CONTAINER .nqs-toast.error {
    border-left-color: var(--nqs-danger);
}

#NQS_GLOBAL_CONTAINER .nqs-toast.warning {
    border-left-color: var(--nqs-warning);
}

#NQS_GLOBAL_CONTAINER .nqs-toast-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

#NQS_GLOBAL_CONTAINER .nqs-toast-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: white;
    flex-shrink: 0;
    margin-top: 2px;
}

#NQS_GLOBAL_CONTAINER .nqs-toast.success .nqs-toast-icon {
    background: var(--nqs-success);
}

#NQS_GLOBAL_CONTAINER .nqs-toast.error .nqs-toast-icon {
    background: var(--nqs-danger);
}

#NQS_GLOBAL_CONTAINER .nqs-toast.warning .nqs-toast-icon {
    background: var(--nqs-warning);
}

#NQS_GLOBAL_CONTAINER .nqs-toast.info .nqs-toast-icon {
    background: var(--nqs-accent);
}

#NQS_GLOBAL_CONTAINER .nqs-toast-text {
    flex: 1;
    min-width: 0;
}

#NQS_GLOBAL_CONTAINER .nqs-toast-title {
    font-weight: 600;
    color: var(--nqs-text-primary);
    margin: 0 0 4px 0;
    font-size: 0.95rem;
    line-height: 1.4;
}

#NQS_GLOBAL_CONTAINER .nqs-toast-message {
    color: var(--nqs-text-secondary);
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.5;
}

#NQS_GLOBAL_CONTAINER .nqs-toast-close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    color: var(--nqs-text-tertiary);
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 14px;
}

#NQS_GLOBAL_CONTAINER .nqs-toast-close:hover {
    background: var(--nqs-bg-hover);
    color: var(--nqs-text-primary);
}

/* iOS风格的加载状态按钮 */
#NQS_GLOBAL_CONTAINER .nqs-button.loading {
    position: relative;
    color: transparent !important;
}

#NQS_GLOBAL_CONTAINER .nqs-button.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: nqs-spin 1s linear infinite;
}
/* === 现代化设置界面样式 === */
#NQS_GLOBAL_CONTAINER .nqs-panel--settings .nqs-body {
    padding: 0;
    background: var(--nqs-bg-subtle);
}

#NQS_GLOBAL_CONTAINER .nqs-settings-container {
    padding: 24px;
    max-height: 70vh;
    overflow-y: auto;
}

/* === 设置侧边导航布局与样式 === */
#NQS_GLOBAL_CONTAINER .nqs-settings-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    padding: 24px;
    height: 70vh;
    box-sizing: border-box;
}

#NQS_GLOBAL_CONTAINER .nqs-settings-sidebar {
    align-self: start;
    position: sticky;
    top: 0;
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-settings-nav {
    display: flex;
    flex-direction: column;
}

#NQS_GLOBAL_CONTAINER .nqs-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    text-decoration: none;
    color: var(--nqs-text-secondary);
    border-left: 3px solid transparent;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
    min-height: 40px; /* 保持各项高度一致，避免“AI 配置”显得突兀 */
    line-height: 1.2;
}

#NQS_GLOBAL_CONTAINER .nqs-nav-item:hover {
    background: var(--nqs-bg-subtle);
    color: var(--nqs-text-primary);
}

#NQS_GLOBAL_CONTAINER .nqs-nav-item.active {
    background: var(--nqs-bg-subtle);
    color: var(--nqs-accent);
    border-left-color: var(--nqs-accent);
}

#NQS_GLOBAL_CONTAINER .nqs-nav-icon {
    width: 20px;
    height: 20px; /* 统一高度，避免表情/图标导致的垂直错位 */
    display: inline-flex;
    justify-content: center;
}

/* 导航文字单行省略，避免“AI 配置”等出现换行导致的错位感 */
#NQS_GLOBAL_CONTAINER .nqs-nav-text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px; /* 为侧栏保留足够留白，防止过长文本折行 */
}

#NQS_GLOBAL_CONTAINER .nqs-settings-content {
    overflow: auto;
}

/* 避免内层再产生滚动条，由外层 content 控制滚动 */
#NQS_GLOBAL_CONTAINER .nqs-settings-content .nqs-settings-container {
    padding: 0;
    max-height: none;
    overflow: visible;
}

@media (max-width: 880px) {
    #NQS_GLOBAL_CONTAINER .nqs-settings-layout {
        grid-template-columns: 1fr;
        height: auto;
    }
    #NQS_GLOBAL_CONTAINER .nqs-settings-sidebar {
        position: static;
        overflow: auto;
    }
    #NQS_GLOBAL_CONTAINER .nqs-settings-nav {
        flex-direction: row;
        gap: 8px;
        padding-bottom: 8px;
    }
    #NQS_GLOBAL_CONTAINER .nqs-nav-item {
        border-left: none;
        border-bottom: 2px solid transparent;
        padding: 10px 12px;
        white-space: nowrap;
    }
    #NQS_GLOBAL_CONTAINER .nqs-nav-item.active {
        border-bottom-color: var(--nqs-accent);
    }
}

#NQS_GLOBAL_CONTAINER .nqs-settings-group {
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    margin-bottom: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-settings-group:hover {
    border-color: var(--nqs-accent-light);
    box-shadow: var(--nqs-shadow);
}

#NQS_GLOBAL_CONTAINER .nqs-settings-group-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: var(--nqs-bg-subtle);
    border-bottom: 1px solid var(--nqs-border);
}

#NQS_GLOBAL_CONTAINER .nqs-settings-group-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nqs-accent-light);
    border-radius: var(--nqs-radius-lg);
    color: var(--nqs-accent);
    flex-shrink: 0;
}

#NQS_GLOBAL_CONTAINER .nqs-settings-group-content {
    flex: 1;
    padding: 24px;
}

#NQS_GLOBAL_CONTAINER .nqs-settings-group-title {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--nqs-text-primary);
    line-height: 1.3;
}

#NQS_GLOBAL_CONTAINER .nqs-settings-group-description {
    margin: 0;
    font-size: 14px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

/* === 设置字段样式 === */
#NQS_GLOBAL_CONTAINER .nqs-setting-field {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
    padding: 16px 0;
    border-bottom: 1px solid var(--nqs-border);
}

#NQS_GLOBAL_CONTAINER .nqs-setting-field:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

#NQS_GLOBAL_CONTAINER .nqs-setting-label-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

#NQS_GLOBAL_CONTAINER .nqs-setting-label-group label {
    font-weight: 600;
    color: var(--nqs-text-primary);
    font-size: 15px;
    line-height: 1.4;
}

#NQS_GLOBAL_CONTAINER .nqs-setting-description {
    font-size: 13px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
    margin: 0;
}

#NQS_GLOBAL_CONTAINER .nqs-setting-input-group {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* === 分类管理样式 === */
#NQS_GLOBAL_CONTAINER .nqs-category-manager-section {
    margin-top: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-category-manager-header {
    margin-bottom: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-category-manager-header h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--nqs-text-primary);
}

#NQS_GLOBAL_CONTAINER .nqs-category-manager-header p {
    margin: 0;
    font-size: 13px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

#NQS_GLOBAL_CONTAINER .nqs-category-input-group {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-category-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius);
    font-size: 14px;
    background: var(--nqs-bg);
    color: var(--nqs-text-primary);
    transition: all 0.2s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-category-input:focus {
    outline: none;
    border-color: var(--nqs-accent);
    box-shadow: 0 0 0 3px var(--nqs-accent-light);
}

#NQS_GLOBAL_CONTAINER .nqs-category-add-btn {
    padding: 12px 20px;
    white-space: nowrap;
}

#NQS_GLOBAL_CONTAINER .nqs-category-list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

#NQS_GLOBAL_CONTAINER .nqs-category-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--nqs-bg-subtle);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius);
    padding: 8px 16px;
    transition: all 0.2s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-category-item:hover {
    border-color: var(--nqs-accent);
    background: var(--nqs-accent-light);
}

#NQS_GLOBAL_CONTAINER .nqs-category-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--nqs-text-primary);
}

#NQS_GLOBAL_CONTAINER .nqs-category-delete-btn {
    background: none;
    border: none;
    color: var(--nqs-text-tertiary);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 16px;
    font-weight: bold;
}

#NQS_GLOBAL_CONTAINER .nqs-category-delete-btn:hover {
    background: var(--nqs-danger-light);
    color: var(--nqs-danger);
}

/* === AI模型选择器样式 === */
#NQS_GLOBAL_CONTAINER .nqs-model-selector-section {
    position: relative;
}

#NQS_GLOBAL_CONTAINER .nqs-model-input-group {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
}

#NQS_GLOBAL_CONTAINER .nqs-model-input-group .nqs-input {
    padding-right: 50px;
}

#NQS_GLOBAL_CONTAINER .nqs-fetch-models-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border: none;
    background: var(--nqs-accent-light);
    color: var(--nqs-accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-fetch-models-btn:hover {
    background: var(--nqs-accent);
    color: white;
    transform: translateY(-50%) scale(1.1);
}

#NQS_GLOBAL_CONTAINER .nqs-fetch-models-btn.is-loading svg {
    animation: nqs-spin 1s linear infinite;
}

#NQS_GLOBAL_CONTAINER .nqs-model-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius);
    box-shadow: var(--nqs-shadow-lg);
    margin-top: 4px;
    max-height: 200px;
    overflow-y: auto;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    pointer-events: none;
}

#NQS_GLOBAL_CONTAINER .nqs-model-dropdown.is-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

#NQS_GLOBAL_CONTAINER .nqs-dropdown-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--nqs-text-primary);
    border-bottom: 1px solid var(--nqs-border);
}

#NQS_GLOBAL_CONTAINER .nqs-dropdown-item:last-child {
    border-bottom: none;
}

#NQS_GLOBAL_CONTAINER .nqs-dropdown-item:hover,
#NQS_GLOBAL_CONTAINER .nqs-dropdown-item.is-active {
    background: var(--nqs-accent-light);
    color: var(--nqs-accent);
}

/* === 提示词头部样式 === */
#NQS_GLOBAL_CONTAINER .nqs-prompt-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--nqs-border);
}

#NQS_GLOBAL_CONTAINER .nqs-prompt-info h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--nqs-text-primary);
}

#NQS_GLOBAL_CONTAINER .nqs-prompt-info p {
    margin: 0;
    font-size: 13px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

/* === 子分组标题样式 === */
#NQS_GLOBAL_CONTAINER .nqs-subsection-header {
    margin: 24px 0 16px 0;
    padding: 16px 0;
    border-bottom: 1px solid var(--nqs-border);
}

#NQS_GLOBAL_CONTAINER .nqs-subsection-header h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--nqs-text-primary);
}

#NQS_GLOBAL_CONTAINER .nqs-subsection-header p {
    margin: 0;
    font-size: 13px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

/* === 选择器样式 === */
#NQS_GLOBAL_CONTAINER .nqs-select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    background: linear-gradient(0deg, rgba(0,0,0,0.02), rgba(255,255,255,0.02)), var(--nqs-bg);
    color: var(--nqs-text-primary);
    font-size: 14px;
    cursor: pointer;
    transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease, transform .15s ease;
    min-height: 40px;
    line-height: 1.2;
    box-shadow: inset 0 1px 0 rgba(0,0,0,0.03);
}

#NQS_GLOBAL_CONTAINER .nqs-select:hover {
    border-color: var(--nqs-border-hover);
    background-color: var(--nqs-bg-hover);
}

#NQS_GLOBAL_CONTAINER .nqs-select:focus {
    outline: none;
    border-color: var(--nqs-accent);
    box-shadow: 0 0 0 3px var(--nqs-accent-light);
}

#NQS_GLOBAL_CONTAINER .nqs-select:focus-visible {
    outline: none;
    border-color: var(--nqs-accent);
    box-shadow: 0 0 0 3px var(--nqs-accent-light);
}

/* === 现代化智能收藏夹管理样式 === */
#NQS_GLOBAL_CONTAINER .nqs-bookmark-manager {
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background: var(--nqs-bg-subtle);
    border-radius: var(--nqs-radius-lg);
}

/* === 主要功能卡片网格 === */
#NQS_GLOBAL_CONTAINER .nqs-feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-card {
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
    transition: left 0.6s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-card:hover::before {
    left: 100%;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-card:hover {
    border-color: var(--nqs-accent);
    box-shadow: var(--nqs-shadow-lg);
}

#NQS_GLOBAL_CONTAINER .nqs-feature-card.nqs-feature-primary {
    border-color: var(--nqs-accent);
    background: linear-gradient(135deg, var(--nqs-bg) 0%, rgba(59, 130, 246, 0.02) 100%);
}

#NQS_GLOBAL_CONTAINER .nqs-feature-icon {
    font-size: 32px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--nqs-bg-subtle);
    border-radius: var(--nqs-radius-lg);
    flex-shrink: 0;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-primary .nqs-feature-icon {
    background: linear-gradient(135deg, var(--nqs-accent-light), var(--nqs-accent));
    color: white;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-content {
    flex: 1;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-content h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--nqs-text-primary);
    line-height: 1.3;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-content p {
    margin: 0;
    font-size: 14px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
    color: white;
    padding: 4px 12px;
    border-radius: var(--nqs-radius);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-arrow {
    font-size: 20px;
    color: var(--nqs-text-tertiary);
    transition: all 0.3s ease;
}

#NQS_GLOBAL_CONTAINER .nqs-feature-card:hover .nqs-feature-arrow {
    color: var(--nqs-accent);
    transform: translateX(4px);
}

/* === 快速分类保存区域 === */
#NQS_GLOBAL_CONTAINER .nqs-quick-save-section {
    margin-bottom: 32px;
}

#NQS_GLOBAL_CONTAINER .nqs-section-header {
    margin-bottom: 20px;
}

#NQS_GLOBAL_CONTAINER .nqs-section-header h3 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--nqs-text-primary);
    display: flex;
    align-items: center;
    gap: 12px;
}

#NQS_GLOBAL_CONTAINER .nqs-section-header p {
    margin: 0;
    font-size: 14px;
    color: var(--nqs-text-secondary);
    line-height: 1.5;
}

#NQS_GLOBAL_CONTAINER .nqs-quick-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
}

#NQS_GLOBAL_CONTAINER .nqs-category-btn {
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

#NQS_GLOBAL_CONTAINER .nqs-category-btn:hover {
    border-color: var(--nqs-accent);
    background: var(--nqs-accent-light);
    transform: translateY(-2px);
    box-shadow: var(--nqs-shadow);
}

#NQS_GLOBAL_CONTAINER .nqs-category-icon {
    font-size: 24px;
    display: block;
}

#NQS_GLOBAL_CONTAINER .nqs-category-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--nqs-text-primary);
    line-height: 1.2;
}

/* === 页面信息预览 === */
#NQS_GLOBAL_CONTAINER .nqs-page-preview {
    margin-bottom: 24px;
}

#NQS_GLOBAL_CONTAINER .nqs-page-info {
    background: var(--nqs-bg);
    border: 1px solid var(--nqs-border);
    border-radius: var(--nqs-radius-lg);
    padding: 20px;
}

#NQS_GLOBAL_CONTAINER .nqs-page-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--nqs-text-primary);
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-page-url {
    font-size: 13px;
    color: var(--nqs-accent);
    margin-bottom: 12px;
    word-break: break-all;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

#NQS_GLOBAL_CONTAINER .nqs-page-meta {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

#NQS_GLOBAL_CONTAINER .nqs-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

#NQS_GLOBAL_CONTAINER .nqs-meta-label {
    font-size: 12px;
    color: var(--nqs-text-tertiary);
    font-weight: 500;
}

#NQS_GLOBAL_CONTAINER .nqs-meta-value {
    font-size: 12px;
    color: var(--nqs-text-secondary);
    background: var(--nqs-bg-subtle);
    padding: 2px 8px;
    border-radius: var(--nqs-radius);
}

/* === 底部操作栏 === */
#NQS_GLOBAL_CONTAINER .nqs-bookmark-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 20px;
}

#NQS_GLOBAL_CONTAINER .nqs-footer-left,
#NQS_GLOBAL_CONTAINER .nqs-footer-center,
#NQS_GLOBAL_CONTAINER .nqs-footer-right {
    display: flex;
    align-items: center;
}

#NQS_GLOBAL_CONTAINER .nqs-footer-center {
    flex: 1;
    justify-content: center;
}

#NQS_GLOBAL_CONTAINER .nqs-bookmark-footer .nqs-button {
    display: flex;
    align-items: center;
    gap: 8px;
}

#NQS_GLOBAL_CONTAINER .nqs-bookmark-footer .nqs-button span:first-child {
    font-size: 16px;
}

/* ===== 追加的设置界面优化样式 ===== */
/* 小屏幕：设置字段改为单列，间距更紧凑 */
@media (max-width: 720px) {
    #NQS_GLOBAL_CONTAINER .nqs-setting-field {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        padding: 12px 0 !important;
    }
}

/* 设置内容滚动体验优化 */
#NQS_GLOBAL_CONTAINER .nqs-settings-content {
    overscroll-behavior: contain;
}

/* 统一滚动条样式（WebKit） */
#NQS_GLOBAL_CONTAINER .nqs-settings-content::-webkit-scrollbar,
#NQS_GLOBAL_CONTAINER .nqs-settings-container::-webkit-scrollbar,
#NQS_GLOBAL_CONTAINER .nqs-json-viewer::-webkit-scrollbar,
#NQS_GLOBAL_CONTAINER .nqs-model-dropdown::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
#NQS_GLOBAL_CONTAINER .nqs-settings-content::-webkit-scrollbar-thumb,
#NQS_GLOBAL_CONTAINER .nqs-settings-container::-webkit-scrollbar-thumb,
#NQS_GLOBAL_CONTAINER .nqs-json-viewer::-webkit-scrollbar-thumb,
#NQS_GLOBAL_CONTAINER .nqs-model-dropdown::-webkit-scrollbar-thumb {
    background: var(--nqs-border);
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: content-box;
}
#NQS_GLOBAL_CONTAINER .nqs-settings-content::-webkit-scrollbar-thumb:hover,
#NQS_GLOBAL_CONTAINER .nqs-settings-container::-webkit-scrollbar-thumb:hover,
#NQS_GLOBAL_CONTAINER .nqs-json-viewer::-webkit-scrollbar-thumb:hover,
#NQS_GLOBAL_CONTAINER .nqs-model-dropdown::-webkit-scrollbar-thumb:hover {
    background: var(--nqs-border-hover);
}

/* 导航项键盘焦点样式（可达性） */
/* 仅键盘导航时显示焦点态，避免鼠标点击后残留视觉高亮 */
#NQS_GLOBAL_CONTAINER .nqs-nav-item:focus-visible {
    outline: none;
    color: var(--nqs-accent);
    box-shadow: 0 0 0 3px var(--nqs-accent-light) inset;
}

/* 输入/选择器交互反馈更细腻 */
#NQS_GLOBAL_CONTAINER .nqs-input,
#NQS_GLOBAL_CONTAINER .nqs-textarea,
#NQS_GLOBAL_CONTAINER .nqs-select {
    transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease, transform .15s ease;
}

/* 模型下拉样式优化 */
#NQS_GLOBAL_CONTAINER .nqs-model-dropdown {
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border-color: var(--nqs-border-hover);
}

/* 暗色模式下边框对比度提升 */
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-panel,
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-settings-group,
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-header,
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-footer {
    border-color: rgba(148, 163, 184, 0.22);
}

/* 移动端 Toast 布局优化 */
@media (max-width: 520px) {
    #NQS_GLOBAL_CONTAINER .nqs-toast-container {
        top: auto;
        bottom: 12px;
        right: 12px;
        left: 12px;
    }
    #NQS_GLOBAL_CONTAINER .nqs-toast {
        width: 100%;
        min-width: auto;
        max-width: none;
    }
}

/* 尊重“减少动态效果”设置 */
@media (prefers-reduced-motion: reduce) {
    #NQS_GLOBAL_CONTAINER * {
        animation: none !important;
        transition: none !important;
    }
}

/* ===== 追加样式（本次优化） ===== */
/* 设置面板：仅保留内部滚动（去掉外层面板滚动条） */
#NQS_GLOBAL_CONTAINER .nqs-panel--settings .nqs-body { overflow: hidden; }

/* 提示词文本域专属优化 */
#NQS_GLOBAL_CONTAINER #nqs-ai_prompt,
#NQS_GLOBAL_CONTAINER .nqs-prompt-textarea {
    min-height: 240px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 13.5px;
    line-height: 1.6;
    white-space: pre-wrap;
    tab-size: 2;
}
#NQS_GLOBAL_CONTAINER .nqs-prompt-meta {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    color: var(--nqs-text-tertiary);
    font-size: 12px;
}

/* 左侧导航视觉优化：更柔和的卡片与高亮 */
#NQS_GLOBAL_CONTAINER .nqs-settings-sidebar { padding: 8px; }
#NQS_GLOBAL_CONTAINER .nqs-settings-nav { gap: 6px; padding: 4px; }
#NQS_GLOBAL_CONTAINER .nqs-nav-item {
    border-radius: 10px;
    margin: 2px 4px;
}
#NQS_GLOBAL_CONTAINER .nqs-nav-item.active {
    background: var(--nqs-accent-light);
    color: var(--nqs-accent);
}
#NQS_GLOBAL_CONTAINER .nqs-nav-text { font-weight: 600; letter-spacing: 0.2px; }

/* 右侧内容区域滚动优化 */
#NQS_GLOBAL_CONTAINER .nqs-settings-content { overflow: auto; overscroll-behavior: contain; }

/* 全宽字段布局：用于无标签或大块输入（如系统提示词） */
#NQS_GLOBAL_CONTAINER .nqs-setting-field--full {
    grid-template-columns: 1fr !important;
}
#NQS_GLOBAL_CONTAINER .nqs-setting-field--full .nqs-setting-label-group {
    display: none;
}

/* 统一 Select 下拉样式（与输入框一致） */
#NQS_GLOBAL_CONTAINER .nqs-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7l5 5 5-5' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px 12px;
    padding-right: 40px; /* 预留箭头空间 */
    font-family: inherit;
}
#NQS_GLOBAL_CONTAINER[data-theme='dark'] .nqs-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7l5 5 5-5' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
#NQS_GLOBAL_CONTAINER .nqs-select:disabled {
    background-color: var(--nqs-bg-subtle);
    color: var(--nqs-text-tertiary);
    cursor: not-allowed;
}
/* 多选下拉的尺寸与滚动控制 */
#NQS_GLOBAL_CONTAINER .nqs-select[multiple] {
    min-height: 140px;
    background-image: none;
    padding-right: 16px;
    overflow: auto;
}
#NQS_GLOBAL_CONTAINER .nqs-select[multiple] option {
    padding: 6px 8px;
}

/* 模板占位符提示徽章与预览 */
#NQS_GLOBAL_CONTAINER .nqs-template-badges { display:flex; gap:6px; flex-wrap: wrap; margin-bottom: 6px; }
#NQS_GLOBAL_CONTAINER .nqs-badge { display:inline-flex; align-items:center; padding: 2px 6px; border-radius: 999px; font-size: 12px; border: 1px solid var(--nqs-border); }
#NQS_GLOBAL_CONTAINER .nqs-badge.ok { background: var(--nqs-success-light); color: var(--nqs-success); border-color: var(--nqs-success); }
#NQS_GLOBAL_CONTAINER .nqs-badge.warn { background: var(--nqs-warning-light); color: var(--nqs-warning); border-color: var(--nqs-warning); }
#NQS_GLOBAL_CONTAINER .nqs-template-preview { max-height: 120px; overflow: hidden; white-space: pre-wrap; color: var(--nqs-text-secondary); font-size: 12px; border-top: 1px dashed var(--nqs-border); padding-top: 6px; }

/* Toggle 开关统一 hover/focus/disabled 细节 */
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch .nqs-switch:hover .nqs-slider {
    filter: brightness(0.98);
}
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch .nqs-switch:focus-within .nqs-slider {
    box-shadow: 0 0 0 3px var(--nqs-accent-light);
}
#NQS_GLOBAL_CONTAINER .nqs-toggle-switch .nqs-switch input:disabled + .nqs-slider {
    background: var(--nqs-border);
    cursor: not-allowed;
    opacity: 0.7;
}

/* 提示词模板库样式 */
#NQS_GLOBAL_CONTAINER .nqs-prompt-templates { margin-top: 12px; }
#NQS_GLOBAL_CONTAINER .nqs-prompt-templates-header { display:flex; justify-content: space-between; align-items:center; margin: 8px 0 10px; }
#NQS_GLOBAL_CONTAINER .nqs-template-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
#NQS_GLOBAL_CONTAINER .nqs-template-card { background: var(--nqs-bg); border:1px solid var(--nqs-border); border-radius: var(--nqs-radius-lg); padding: 12px; display:flex; flex-direction: column; gap:10px; transition: box-shadow .2s, border-color .2s; }
#NQS_GLOBAL_CONTAINER .nqs-template-card:hover { border-color: var(--nqs-accent); box-shadow: var(--nqs-shadow); }
#NQS_GLOBAL_CONTAINER .nqs-template-card.is-active { border-color: var(--nqs-accent); box-shadow: var(--nqs-shadow-lg); background: linear-gradient(0deg, var(--nqs-accent-light), transparent); }
#NQS_GLOBAL_CONTAINER .nqs-template-card--compact .nqs-template-preview { display: none; }
#NQS_GLOBAL_CONTAINER .nqs-template-select input {
    appearance: none;
    -webkit-appearance: none;
    width: 16px; height: 16px;
    border-radius: 50%;
    border: 2px solid var(--nqs-border-hover);
    background: var(--nqs-bg);
    display: inline-block;
    transition: all .15s ease;
    box-shadow: inset 0 0 0 0 var(--nqs-success);
}
#NQS_GLOBAL_CONTAINER .nqs-template-select input:checked {
    border-color: var(--nqs-success);
    box-shadow: inset 0 0 0 4px var(--nqs-success);
}
#NQS_GLOBAL_CONTAINER .nqs-template-card.is-active .nqs-template-select input {
    border-color: var(--nqs-success);
    box-shadow: inset 0 0 0 4px var(--nqs-success);
}
#NQS_GLOBAL_CONTAINER .nqs-template-card-top { position: relative; padding-right: 8px; }
#NQS_GLOBAL_CONTAINER .nqs-template-select { position: absolute; top: 0; right: 0; }
#NQS_GLOBAL_CONTAINER .nqs-template-title { margin: 0 24px 0 0; font-size: 14px; color: var(--nqs-text-primary); font-weight: 600; }
#NQS_GLOBAL_CONTAINER .nqs-template-brief { display:none; }
#NQS_GLOBAL_CONTAINER .nqs-template-card-actions { display:flex; gap:8px; justify-content:flex-end; }

/* 提示词模式分段控件 */
#NQS_GLOBAL_CONTAINER .nqs-segmented { display:inline-flex; border:1px solid var(--nqs-border); border-radius: 8px; overflow:hidden; background: var(--nqs-bg); margin: 8px 0 12px; }
#NQS_GLOBAL_CONTAINER .nqs-seg-btn { padding: 6px 12px; font-size: 13px; color: var(--nqs-text-secondary); background: transparent; border: none; cursor: pointer; }
#NQS_GLOBAL_CONTAINER .nqs-seg-btn.is-active { color: var(--nqs-accent); background: var(--nqs-accent-light); }

/* 模板/自定义模式切换显示控制 */
#NQS_GLOBAL_CONTAINER .nqs-settings-group-content[data-prompt-mode="template"] [data-field-id="ai_prompt"] { display:none; }
#NQS_GLOBAL_CONTAINER .nqs-settings-group-content[data-prompt-mode="custom"] .nqs-prompt-templates { display:none; }

/* ===== 追加样式结束 ===== */

/* ===== 追加样式 v2（导航与提示词卡片美化） ===== */
/* 左侧导航：更清晰的激活态与指示条 */
#NQS_GLOBAL_CONTAINER .nqs-settings-sidebar {
    border-radius: var(--nqs-radius-lg);
    background: linear-gradient(0deg, rgba(0,0,0,0.02), rgba(255,255,255,0.02)), var(--nqs-bg);
}
#NQS_GLOBAL_CONTAINER .nqs-nav-item {
    position: relative;
    border-left: 3px solid transparent;
}
#NQS_GLOBAL_CONTAINER .nqs-nav-item::after {
    content: '›';
    position: absolute;
    right: 10px;
    font-size: 14px;
    color: var(--nqs-text-tertiary);
    transition: color .2s ease, transform .2s ease;
}
#NQS_GLOBAL_CONTAINER .nqs-nav-item:hover::after {
    color: var(--nqs-accent);
    transform: translateX(2px);
}
#NQS_GLOBAL_CONTAINER .nqs-nav-item.active {
    border-left-color: var(--nqs-accent);
    background: linear-gradient(0deg, var(--nqs-accent-light), transparent);
}
#NQS_GLOBAL_CONTAINER .nqs-nav-item.active::after {
    background: var(--nqs-accent);
}

/* 分组：滚动校准，避免粘到顶部时视觉拥挤 */
#NQS_GLOBAL_CONTAINER .nqs-settings-group {
    scroll-margin-top: 12px;
}

/* 提示词模板卡片：层次更分明、交互更细腻 */
#NQS_GLOBAL_CONTAINER .nqs-template-card {
    border: 1px solid var(--nqs-border);
    background: linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.02)) , var(--nqs-bg);
    transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
#NQS_GLOBAL_CONTAINER .nqs-template-card:hover {
    transform: translateY(-2px);
    border-color: var(--nqs-accent);
    box-shadow: var(--nqs-shadow-lg);
}
#NQS_GLOBAL_CONTAINER .nqs-template-card.is-active {
    border-color: var(--nqs-accent);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), var(--nqs-shadow);
    background: linear-gradient(0deg, var(--nqs-accent-light), transparent);
}
#NQS_GLOBAL_CONTAINER .nqs-template-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
}
#NQS_GLOBAL_CONTAINER .nqs-template-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
#NQS_GLOBAL_CONTAINER .nqs-template-card-actions .nqs-button {
    padding: 6px 10px;
}

/* Prompt 模式切换控件：更显著的激活态 */
#NQS_GLOBAL_CONTAINER .nqs-seg-btn {
    border-right: 1px solid var(--nqs-border);
}
#NQS_GLOBAL_CONTAINER .nqs-seg-btn:last-child {
    border-right: none;
}
#NQS_GLOBAL_CONTAINER .nqs-seg-btn.is-active {
    color: var(--nqs-accent);
    background: linear-gradient(0deg, var(--nqs-accent-light), transparent);
}

/* 模型下拉：活动项更明显 */
#NQS_GLOBAL_CONTAINER .nqs-model-dropdown .nqs-dropdown-item.is-active {
    background: var(--nqs-accent-light);
    color: var(--nqs-accent);
}
/* ===== 追加样式 v2 结束 ===== */
`; const style = document.createElement('style'); style.id = styleId; style.textContent = css; container.appendChild(style); }
    const showNotification = (button, message, stay = false, originalText) => { if (!button) return; button.textContent = message; if (!stay) { setTimeout(() => { button.textContent = originalText; }, 3000); } };
    async function initFloatingButtons() { if (fabInstance) fabInstance.destroy(); fabInstance = new FloatingActionButton(); await fabInstance.init(); }
    function savePageViaMenu() { startSaveProcess({ source: 'menu' }); }
    function savePageForLaterViaMenu() { startReadLaterSave({ source: 'menu' }); }
    async function runScript() {
        await applyTheme();



        GM_registerMenuCommand('⚙️ 设置 (Settings)', openSettingsPanel);
        GM_registerMenuCommand('📋 查看日志 (View Logs)', openLogViewerPanel);
        GM_registerMenuCommand('─'.repeat(20), () => {});
        GM_registerMenuCommand('➤ 保存到 Notion', savePageViaMenu);
        GM_registerMenuCommand('◷ 保存为稍后读', savePageForLaterViaMenu);
        GM_registerMenuCommand('📝 智能文本摘录', () => saveSelectedTextAsNote());
        GM_registerMenuCommand('📚 智能收藏夹管理', () => openSmartBookmarkManager());
        GM_registerMenuCommand('─'.repeat(20), () => {});

        try {
            initFloatingButtons();
        } catch (e) {
            console.error("NQS: 无法初始化悬浮按钮UI。这可能是由于网站的安全策略(CSP)限制。请放心使用油猴菜单中的备用按钮，功能完全相同。", e);
            addLog('error', '悬浮按钮UI初始化失败', { error: e.message, stack: e.stack });
        }
    }

    runScript();
})();
