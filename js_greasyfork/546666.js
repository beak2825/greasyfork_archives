// ==UserScript==
// @name         Luogu-MarkdownCopy
// @namespace    https://www.luogu.com.cn/
// @version      1.1
// @description  洛谷Markdown复制工具，Ctrl+Alt+C触发
// @author       Luogu
// @match        https://*.luogu.com.cn/*
// @match        https://*.luogu.org/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546666/Luogu-MarkdownCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/546666/Luogu-MarkdownCopy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储调试信息
    const debugInfo = {
        lastUrl: '',
        lastType: '',
        lastContentLength: 0,
        lastError: null,
        extractionSteps: [], // 记录提取步骤
        apiResponse: null,   // 记录API响应
        elementSelectors: [] // 记录使用的选择器
    };

    // 页面加载完成后初始化
    window.addEventListener('load', () => {
        init();
        setupAdvancedObserver();
        console.log('洛谷Markdown复制工具已加载 (v4.2)');
        console.log('按Ctrl+Alt+C复制内容，输入__luoguCopyDebug()查看调试信息');
    });

    // 暴露调试函数
    window.__luoguCopyDebug = () => debugInfo;

    function init() {
        // 确保只绑定一次事件
        document.removeEventListener('keydown', handleKeyCombo);
        document.addEventListener('keydown', handleKeyCombo);
    }

    /**
     * 高级观察者，针对不同页面类型采用不同观察策略
     */
    function setupAdvancedObserver() {
        const isProblemPage = /problem|p\/\d+/.test(window.location.href);
        const isTeamPage = /team/.test(window.location.href);
        const isDiscussPage = /discuss/.test(window.location.href);

        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-md', 'data-markdown']
        };

        // 观察频率控制
        let lastUpdateTime = 0;
        const observer = new MutationObserver((mutations) => {
            const now = Date.now();
            if (now - lastUpdateTime > 500) {
                lastUpdateTime = now;
                if (mutations.some(m =>
                    m.addedNodes.length > 0 ||
                    m.target.hasAttribute('data-md') ||
                    m.target.hasAttribute('data-markdown')
                )) {
                    init();
                }
            }
        });

        // 针对题目页面加强观察
        if (isProblemPage) {
            const containers = [
                document.querySelector('.problem-container'),
                document.querySelector('.lg-container'),
                document.querySelector('.main-container'),
                document.body
            ].filter(Boolean);

            containers.forEach(container => observer.observe(container, config));
        }
        else if (isTeamPage) {
            const teamContainer = document.querySelector('.team-container') || document.body;
            observer.observe(teamContainer, config);
        }
        else if (isDiscussPage) {
            const discussContainer = document.querySelector('.discuss-container') || document.body;
            observer.observe(discussContainer, config);
        }
        else {
            observer.observe(document.body, config);
        }
    }

    /**
     * 处理快捷键
     */
    async function handleKeyCombo(e) {
        if (e.ctrlKey && e.altKey && (e.key === 'c' || e.key === 'C')) {
            e.preventDefault();
            e.stopPropagation();

            // 重置调试信息
            debugInfo.lastUrl = window.location.href;
            debugInfo.lastError = null;
            debugInfo.extractionSteps = [];
            debugInfo.apiResponse = null;
            debugInfo.elementSelectors = [];

            try {
                const loadingAlert = showTemporaryAlert('正在提取内容...', 5000);
                loadingAlert.element.textContent = '正在提取内容（1/5尝试）';

                // 多次尝试提取，增加成功率
                let result = null;
                for (let i = 0; i < 5; i++) {
                    if (i > 0) {
                        loadingAlert.element.textContent = `正在提取内容（${i+1}/5尝试）`;
                    }
                    result = await getMarkdownByPageType();
                    if (result?.content) break;
                    await new Promise(resolve => setTimeout(resolve, 500 + i * 300));
                }

                clearTimeout(loadingAlert.timeoutId);
                loadingAlert.element.remove();

                if (result?.content) {
                    debugInfo.lastType = result.type;
                    debugInfo.lastContentLength = result.content.length;

                    await copyToClipboard(result.content);
                    showTemporaryAlert(`✅ 已复制${result.type}（${result.content.length}字符）`, 2000);
                } else {
                    debugInfo.lastError = '未找到可复制的内容';
                    alert('❌ 未找到可复制的Markdown内容\n请尝试：\n1. 刷新页面\n2. 确保内容已加载完成\n3. 检查控制台获取更多信息');
                }
            } catch (err) {
                debugInfo.lastError = err.message;
                alert(`❌ 操作失败: ${err.message}\n请查看控制台获取详细信息`);
                console.error('复制失败:', err);
            }
        }
    }

    /**
     * 显示临时提示
     */
    function showTemporaryAlert(message, duration) {
        const alertEl = document.createElement('div');
        alertEl.style.position = 'fixed';
        alertEl.style.bottom = '20px';
        alertEl.style.right = '20px';
        alertEl.style.padding = '10px 20px';
        alertEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        alertEl.style.color = 'white';
        alertEl.style.borderRadius = '4px';
        alertEl.style.zIndex = '999999';
        alertEl.textContent = message;

        document.body.appendChild(alertEl);

        const timeoutId = setTimeout(() => {
            alertEl.remove();
        }, duration);

        return { element: alertEl, timeoutId };
    }

    /**
     * 复制到剪贴板
     */
    async function copyToClipboard(text) {
        if (!text) throw new Error('无内容可复制');

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn('剪贴板API失败，尝试备用方法:', err);
            }
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        textarea.select();
        textarea.setSelectionRange(0, text.length);

        try {
            const success = document.execCommand('copy');
            if (!success) throw new Error('无法执行复制命令');
            return true;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    /**
     * 根据页面类型获取内容
     */
    async function getMarkdownByPageType() {
        const url = window.location.href;

        // 优先处理题目页面
        if (url.includes('problem') || url.match(/p\/\d+/)) {
            const content = await getProblemContent();
            if (content) return { content, type: '题目内容' };
        }

        if (url.includes('team')) {
            const content = await getTeamContent();
            if (content) return { content, type: '团队内容' };
        }

        if (url.includes('discuss')) {
            const content = await getDiscussionContent();
            if (content) return { content, type: '讨论帖' };
        }

        const strategies = [
            { test: /article/, handler: getArticleContent, type: '专栏文章' },
            { test: /blog(?!.*admin)/i, handler: getBlogContent, type: '博客' },
            { test: /user(?!.*notification)/, handler: getUserIntroduction, type: '用户简介' },
            { test: /contest(?!.*list|.*edit)/, handler: getContestDescription, type: '比赛描述' },
            { test: /training(?!.*edit|.*list)/, handler: getTrainingDescription, type: '训练内容' },
            { test: /solution/, handler: getSolutionContent, type: '题解' },
            { test: /forum/, handler: getForumContent, type: '论坛内容' },
            { test: /.*/, handler: getGeneralMarkdownContent, type: '页面内容' }
        ];

        for (const { test, handler, type } of strategies) {
            if (test.test(url)) {
                try {
                    const content = await handler();
                    if (content) return { content, type };
                } catch (err) {
                    console.log(`[${type}]提取失败:`, err.message);
                }
            }
        }

        return { content: null, type: null };
    }

    /**
     * 团队页面内容提取
     */
    async function getTeamContent() {
        const match = window.location.href.match(/team\/(\d+)/);
        if (match?.[1]) {
            try {
                const res = await fetch(`/api/team/get?id=${match[1]}`);
                if (res.ok) {
                    const data = await res.json();
                    const parts = [];
                    if (data.data?.name) parts.push(`# ${data.data.name}`);
                    if (data.data?.description) parts.push('## 团队描述', data.data.description);
                    if (data.data?.announcement) parts.push('## 团队公告', data.data.announcement);
                    if (parts.length > 0) return parts.join('\n\n');
                }
            } catch (err) {
                console.log('团队API获取失败:', err);
            }
        }

        const teamSelectors = [
            { title: '团队描述', selector: '.team-description, .team-info-description' },
            { title: '团队公告', selector: '.team-announcement, .team-notice' },
            { title: '团队介绍', selector: '.team-intro, .team-profile' }
        ];

        const parts = [];
        const teamName = document.querySelector('.team-name, .team-title')?.textContent?.trim();
        if (teamName) parts.push(`# ${teamName}`);

        for (const { title, selector } of teamSelectors) {
            const el = document.querySelector(selector);
            if (el?.textContent?.trim()) {
                parts.push(`## ${title}`);
                const mdContent = el.getAttribute('data-md') ||
                                 el.getAttribute('data-markdown') ||
                                 el.getAttribute('data-original');
                if (mdContent) {
                    parts.push(mdContent);
                } else {
                    if (window._feInjection?.markdown?.toMarkdown) {
                        parts.push(window._feInjection.markdown.toMarkdown(el.innerHTML));
                    } else {
                        parts.push(el.textContent.trim());
                    }
                }
            }
        }

        if (parts.length > (teamName ? 1 : 0)) {
            return parts.join('\n\n');
        }

        const teamPost = document.querySelector('.team-post-content, .team-topic-content');
        if (teamPost) {
            const content = teamPost.getAttribute('data-md') ||
                           (window._feInjection?.markdown?.toMarkdown?.(teamPost.innerHTML) ||
                            teamPost.textContent.trim());
            if (content) return content;
        }

        return null;
    }

    /**
     * 讨论帖内容提取
     */
    async function getDiscussionContent() {
        const activePost = document.querySelector('.discuss-post.active, .post-item.highlight');
        if (activePost) {
            const content = await extractContentFromElement(activePost);
            if (content) return content;
        }

        const match = window.location.href.match(/discuss\/(\d+)/);
        if (match?.[1]) {
            try {
                const endpoints = [
                    `/api/discuss/show/${match[1]}`,
                    `/api/discuss/${match[1]}`,
                    `/discuss/${match[1]}/api`
                ];

                for (const endpoint of endpoints) {
                    const res = await fetch(endpoint, {
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        credentials: 'include'
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.content) return data.content;
                        if (data.data?.content) return data.data.content;
                        if (data.post?.content) return data.post.content;
                    }
                }
            } catch (err) {
                console.log('讨论帖API获取失败:', err);
            }
        }

        const contentSelectors = [
            '.discuss-content',
            '.post-content',
            '.lg-article',
            '.markdown-body',
            '.post-detail-content',
            '[class*="discuss-post-content"]'
        ];

        for (const selector of contentSelectors) {
            const el = document.querySelector(selector);
            if (el) {
                const content = await extractContentFromElement(el);
                if (content) return content;
            }
        }

        const scriptTags = document.querySelectorAll('script[type="application/json"], script:not([type])');
        for (const script of scriptTags) {
            try {
                const jsonData = JSON.parse(script.textContent);
                const content = findContentInJson(jsonData);
                if (content) return content;
            } catch (err) {
                // 忽略解析错误
            }
        }

        return null;
    }

    /**
     * 从元素中提取内容的通用方法
     */
    function extractContentFromElement(el) {
        const mdAttrs = ['data-md', 'data-markdown', 'data-original', 'data-content'];
        for (const attr of mdAttrs) {
            const mdContent = el.getAttribute(attr);
            if (mdContent && mdContent.trim().length > 0) {
                debugInfo.extractionSteps.push(`从属性 ${attr} 提取内容`);
                return mdContent.trim();
            }
        }

        const childWithMd = el.querySelector('[data-md], [data-markdown], [data-original]');
        if (childWithMd) {
            const content = childWithMd.getAttribute('data-md') ||
                           childWithMd.getAttribute('data-markdown') ||
                           childWithMd.getAttribute('data-original');
            if (content) {
                debugInfo.extractionSteps.push(`从子元素属性提取内容`);
                return content.trim();
            }
        }

        if (window._feInjection?.markdown?.toMarkdown) {
            try {
                const mdContent = window._feInjection.markdown.toMarkdown(el.innerHTML);
                if (mdContent && mdContent.trim().length > 0) {
                    debugInfo.extractionSteps.push(`使用内置工具转换HTML为Markdown`);
                    return mdContent.trim();
                }
            } catch (err) {
                console.log('转换HTML为Markdown失败:', err);
            }
        }

        const textContent = el.textContent.trim();
        if (textContent.length > 0) {
            debugInfo.extractionSteps.push(`提取纯文本内容`);
            return textContent;
        }

        return null;
    }

    /**
     * 在JSON数据中查找可能的内容
     */
    function findContentInJson(obj, depth = 0) {
        if (depth > 5) return null;

        if (typeof obj === 'object' && obj !== null) {
            const contentFields = ['content', 'markdown', 'text', 'description', 'postContent'];
            for (const field of contentFields) {
                if (obj[field] && typeof obj[field] === 'string' && obj[field].trim().length > 0) {
                    return obj[field].trim();
                }
            }

            for (const key in obj) {
                const result = findContentInJson(obj[key], depth + 1);
                if (result) return result;
            }
        }

        return null;
    }

    /**
     * 专栏/文章内容提取
     */
    function getArticleContent() {
        if (window._feInstance?.currentData?.article?.content) {
            return window._feInstance.currentData.article.content;
        }

        const lentilleContext = document.querySelector('#lentille-context');
        if (lentilleContext?.text) {
            try {
                const data = JSON.parse(lentilleContext.text);
                return data.data?.article?.content || null;
            } catch (err) { /* 忽略错误 */ }
        }

        const contentEl = document.querySelector('.article-content, .article-markdown');
        return contentEl ? extractContentFromElement(contentEl) : null;
    }

    /**
     * 博客内容提取
     */
    async function getBlogContent() {
        if (window.BlogGlobals?.blogID) {
            try {
                const res = await fetch(`/api/blog/detail/${window.BlogGlobals.blogID}`);
                const data = await res.json();
                if (data.data?.Content) return data.data.Content;
            } catch (err) { /* 忽略错误 */ }
        }

        if (window._feInstance?.currentData?.blog?.content) {
            return window._feInstance.currentData.blog.content;
        }

        const contentEl = document.querySelector('.blog-content, .blog-markdown');
        return contentEl ? extractContentFromElement(contentEl) : null;
    }

    /**
     * 题目内容提取（重点优化）
     */
    async function getProblemContent() {
        let problemId = null;
        // 增强题目ID提取：支持多种URL格式
        const match1 = window.location.href.match(/problem\/([A-Za-z0-9]+)/);
        const match2 = window.location.href.match(/p\/(\d+)/);
        const match3 = window.location.href.match(/problem\/show\?p=(\d+)/);
        if (match1) problemId = match1[1];
        if (match2) problemId = match2[1];
        if (match3) problemId = match3[1];

        debugInfo.extractionSteps.push(`识别到题目ID: ${problemId || '未识别'}`);

        // 策略1: 从API获取完整数据（支持多组样例）
        if (problemId) {
            try {
                const apiEndpoints = [
                    `/api/problem/${problemId}`,
                    `/problem/${problemId}/api`,
                    `/p/${problemId}/api`
                ];

                let apiData = null;
                for (const endpoint of apiEndpoints) {
                    debugInfo.extractionSteps.push(`尝试API: ${endpoint}`);
                    const res = await fetch(endpoint);
                    if (res.ok) {
                        apiData = await res.json();
                        debugInfo.apiResponse = apiData; // 保存API响应用于调试
                        if (apiData.data) {
                            debugInfo.extractionSteps.push(`API返回有效数据`);
                            break;
                        }
                    }
                }

                if (apiData?.data) {
                    const parts = [`# ${apiData.data.title || '题目'}`];
                    const sectionStatus = {};

                    // 添加题目描述
                    if (apiData.data.description) {
                        parts.push('## 题目描述', apiData.data.description);
                        sectionStatus.description = '已获取';
                    } else {
                        sectionStatus.description = '缺失';
                    }

                    // 添加输入格式
                    if (apiData.data.inputFormat) {
                        parts.push('## 输入格式', apiData.data.inputFormat);
                        sectionStatus.inputFormat = '已获取';
                    } else {
                        sectionStatus.inputFormat = '缺失';
                    }

                    // 添加输出格式
                    if (apiData.data.outputFormat) {
                        parts.push('## 输出格式', apiData.data.outputFormat);
                        sectionStatus.outputFormat = '已获取';
                    } else {
                        sectionStatus.outputFormat = '缺失';
                    }

                    // 处理样例（支持多组样例）
                    if (apiData.data.samples && Array.isArray(apiData.data.samples) && apiData.data.samples.length > 0) {
                        apiData.data.samples.forEach((sample, index) => {
                            if (sample.input) {
                                parts.push(`## 样例输入 ${index + 1}`, '```', sample.input, '```');
                            }
                            if (sample.output) {
                                parts.push(`## 样例输出 ${index + 1}`, '```', sample.output, '```');
                            }
                        });
                        sectionStatus.samples = `已获取 ${apiData.data.samples.length} 组`;
                    }
                    // 兼容旧版单一样例格式
                    else {
                        if (apiData.data.sampleInput) {
                            parts.push('## 样例输入', '```', apiData.data.sampleInput, '```');
                            sectionStatus.sampleInput = '已获取';
                        } else {
                            sectionStatus.sampleInput = '缺失';
                        }
                        if (apiData.data.sampleOutput) {
                            parts.push('## 样例输出', '```', apiData.data.sampleOutput, '```');
                            sectionStatus.sampleOutput = '已获取';
                        } else {
                            sectionStatus.sampleOutput = '缺失';
                        }
                    }

                    // 添加提示
                    if (apiData.data.hint) {
                        parts.push('## 提示', apiData.data.hint);
                        sectionStatus.hint = '已获取';
                    } else {
                        sectionStatus.hint = '缺失';
                    }

                    // 添加数据范围
                    if (apiData.data.limit) {
                        parts.push('## 数据范围', apiData.data.limit);
                        sectionStatus.limit = '已获取';
                    } else {
                        sectionStatus.limit = '缺失';
                    }

                    debugInfo.extractionSteps.push(`API内容提取状态: ${JSON.stringify(sectionStatus)}`);

                    // 检查是否只有描述部分，如果是则尝试页面提取补充
                    const hasOnlyDescription = Object.keys(sectionStatus).filter(k => k !== 'description').every(k => sectionStatus[k] === '缺失');
                    if (hasOnlyDescription && sectionStatus.description === '已获取') {
                        debugInfo.extractionSteps.push('API仅返回描述内容，尝试从页面补充其他部分');
                        const pageParts = await getProblemContentFromPage();
                        // 合并API描述和页面提取的其他部分
                        return mergeProblemParts(parts, pageParts);
                    }

                    return parts.filter(Boolean).join('\n\n');
                }
            } catch (err) {
                debugInfo.extractionSteps.push(`题目API获取失败: ${err.message}`);
                console.log('题目API获取失败，尝试页面提取:', err);
            }
        }

        // 策略2: 从页面元素提取（增强选择器和处理逻辑）
        debugInfo.extractionSteps.push('尝试从页面元素提取完整题目内容');
        return getProblemContentFromPage();
    }

    /**
     * 专门从页面元素提取题目内容
     */
    async function getProblemContentFromPage() {
        const problemTitle = document.querySelector('.problem-title, .lg-problem-title, .problem-header h1')?.textContent?.trim() || '题目';
        const parts = [`# ${problemTitle}`];

        // 扩展题目各部分的选择器列表，适配更多页面样式
        const sections = {
            '题目描述': [
                '.problem-description',
                '.lg-problem-description',
                '.problem-content-description',
                '[class*="description"]',
                '#description'
            ],
            '输入格式': [
                '.problem-input',
                '.lg-problem-input',
                '.problem-content-input',
                '[class*="input-format"]',
                '#input'
            ],
            '输出格式': [
                '.problem-output',
                '.lg-problem-output',
                '.problem-content-output',
                '[class*="output-format"]',
                '#output'
            ],
            '样例输入': [
                '.problem-sample-input',
                '.lg-sample-input',
                '.sample-input',
                '[class*="sample-input"]',
                '#sample-input'
            ],
            '样例输出': [
                '.problem-sample-output',
                '.lg-sample-output',
                '.sample-output',
                '[class*="sample-output"]',
                '#sample-output'
            ],
            '提示': [
                '.problem-hint',
                '.lg-problem-hint',
                '.problem-content-hint',
                '[class*="hint"]',
                '#hint'
            ],
            '数据范围': [
                '.problem-limit',
                '.lg-problem-limit',
                '.problem-content-limit',
                '[class*="data-range"]',
                '#limit'
            ]
        };

        // 提取每个区块内容
        for (const [title, selectors] of Object.entries(sections)) {
            let content = null;
            // 尝试所有可能的选择器
            for (const selector of selectors) {
                debugInfo.elementSelectors.push(`尝试选择器: ${selector}`);
                const el = document.querySelector(selector);
                if (el) {
                    content = extractContentFromElement(el);
                    if (content) {
                        debugInfo.extractionSteps.push(`成功从 ${selector} 提取 ${title}`);
                        break;
                    }
                }
            }

            if (content) {
                parts.push(`## ${title}`);
                if (title.includes('样例')) {
                    parts.push('```', content, '```');
                } else {
                    parts.push(content);
                }
            } else {
                debugInfo.extractionSteps.push(`未找到 ${title} 内容`);
            }
        }

        // 检查是否有有效内容
        if (parts.length > 1) {
            return parts.join('\n\n');
        }

        // 策略3: 尝试从全局变量提取
        if (window._feInstance?.currentData?.problem?.content) {
            debugInfo.extractionSteps.push('从全局变量获取内容');
            return window._feInstance.currentData.problem.content;
        }

        // 策略4: 从脚本标签提取
        const scriptTags = document.querySelectorAll('script[type="application/json"]');
        for (const script of scriptTags) {
            try {
                const data = JSON.parse(script.textContent);
                const content = findContentInJson(data);
                if (content) {
                    debugInfo.extractionSteps.push('从脚本标签获取内容');
                    return content;
                }
            } catch (err) { /* 忽略错误 */ }
        }

        return null;
    }

    /**
     * 合并API和页面提取的题目部分
     */
    function mergeProblemParts(apiParts, pageParts) {
        if (!pageParts) return apiParts.join('\n\n');

        // 分离标题和内容
        const apiTitle = apiParts[0];
        const apiContent = apiParts.slice(1).join('\n\n');

        // 分离页面提取的各个部分
        const pageSections = {};
        let currentSection = null;
        let currentContent = [];

        for (const part of pageParts.split('\n\n')) {
            if (part.startsWith('## ')) {
                if (currentSection) {
                    pageSections[currentSection] = currentContent.join('\n\n');
                }
                currentSection = part.slice(3).trim();
                currentContent = [];
            } else if (currentSection) {
                currentContent.push(part);
            }
        }

        if (currentSection) {
            pageSections[currentSection] = currentContent.join('\n\n');
        }

        // 合并结果：保留API的描述，补充页面的其他部分
        const mergedParts = [apiTitle];

        // 添加API中的描述
        mergedParts.push('## 题目描述', apiContent.split('\n\n').find(p => p.startsWith('## 题目描述') ? false : p) || '');

        // 添加页面中的其他部分
        const sectionOrder = ['输入格式', '输出格式', '样例输入', '样例输出', '提示', '数据范围'];
        sectionOrder.forEach(section => {
            if (pageSections[section]) {
                mergedParts.push(`## ${section}`, pageSections[section]);
            }
        });

        return mergedParts.filter(Boolean).join('\n\n');
    }

    /**
     * 其他页面内容提取函数
     */
    function getSolutionContent() {
        const match = window.location.href.match(/solution\/(\d+)/);
        if (match?.[1]) {
            try {
                return fetch(`/api/solution/${match[1]}`)
                    .then(res => res.json())
                    .then(data => data.data?.content || null)
                    .catch(() => null);
            } catch (err) { /* 忽略错误 */ }
        }

        const contentEl = document.querySelector('.solution-content, .solution-article');
        return contentEl ? extractContentFromElement(contentEl) : null;
    }

    function getForumContent() {
        const contentEl = document.querySelector('.forum-post-content, .post-body');
        return contentEl ? extractContentFromElement(contentEl) : null;
    }

    function getUserIntroduction() {
        if (window._feInstance?.currentData?.user?.introduction) {
            return window._feInstance.currentData.user.introduction;
        }

        const introEl = document.querySelector('.introduction-content, .user-intro');
        return introEl ? extractContentFromElement(introEl) : null;
    }

    function getContestDescription() {
        if (window._feInstance?.currentData?.contest?.description) {
            return window._feInstance.currentData.contest.description;
        }

        const descEl = document.querySelector('.contest-description, .contest-info-content');
        return descEl ? extractContentFromElement(descEl) : null;
    }

    function getTrainingDescription() {
        if (window._feInstance?.currentData?.training?.description) {
            return window._feInstance.currentData.training.description;
        }

        const descEl = document.querySelector('.training-description, .training-content');
        return descEl ? extractContentFromElement(descEl) : null;
    }

    function getGeneralMarkdownContent() {
        const contentSelectors = [
            '.lg-content',
            '.main-content',
            '.article-content',
            '.post-content',
            '.content-wrapper',
            '[class*="markdown-content"]',
            '[id*="content"]'
        ];

        for (const selector of contentSelectors) {
            const contentEl = document.querySelector(selector);
            if (contentEl) {
                const content = extractContentFromElement(contentEl);
                if (content) return content;
            }
        }

        return null;
    }

})();
