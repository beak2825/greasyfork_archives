// ==UserScript==
// @name         网页转 Markdown 插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键将网页正文转换为 Markdown，支持 AI 优化、编辑预览，可保存自定义提示词。
// @author       An
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/readability/0.5.0/Readability.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.3/turndown.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540721/%E7%BD%91%E9%A1%B5%E8%BD%AC%20Markdown%20%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/540721/%E7%BD%91%E9%A1%B5%E8%BD%AC%20Markdown%20%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // 模块一：核心逻辑 (非 UI)
    // =================================================================================

    // 默认的 AI 提示词
    const DEFAULT_AI_PROMPT = '请对以下 Markdown 内容进行格式和排版优化，以提升其可读性。请注意：此次优化的目标是改善展现形式，而不是修改内容本身。所有文字、数据和核心信息必须保持原样，不得增删或改写。你可以调整的方面包括但不限于：规范化标题层级（例如，`#`, `##`）。整理列表格式（有序和无序）。确保代码块和行内代码使用正确的 Markdown 语法。调整段落间距和换行。修正纯粹的 Markdown 语法错误。';

    /**
     * 使用 Readability 提取文章内容
     * @param {Document} doc 文档对象
     * @return {Object|null} 提取的文章对象或 null
     */
    function extractArticle(doc) {
        try {
            const reader = new Readability(doc.cloneNode(true));
            const article = reader.parse();

            if (!article || !article.content) {
                // 尝试从常见内容容器中提取内容
                const contentSelectors = ['main', 'article', '#main', '#content', '.main', '.content'];
                for (const selector of contentSelectors) {
                    const main = doc.querySelector(selector);
                    if (main) {
                        return { title: doc.title, content: main.innerHTML };
                    }
                }
                return null;
            }
            return article;
        } catch (e) {
            console.error('Error extracting article with Readability:', e);
            return null;
        }
    }

    // 配置 TurndownService 实例
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        hr: '---',
        bulletListMarker: '-'
    });

    // 添加图片处理规则
    turndownService.addRule('images', {
        filter: 'img',
        replacement: function (content, node) {
            let src = node.getAttribute('src') || '';
            // 将相对 URL 转换为绝对 URL
            if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                src = new URL(src, window.location.href).href;
            }
            const alt = node.getAttribute('alt') || '';
            return `![${alt}](${src})`;
        }
    });

    // 添加表格处理改进
    turndownService.addRule('tableCell', {
        filter: ['th', 'td'],
        replacement: function (content, node) {
            return ` ${content.trim()} |`;
        }
    });

    /**
     * 将 HTML 转换为 Markdown
     * @param {string} htmlString HTML 字符串
     * @return {string} 转换后的 Markdown 字符串
     */
    function htmlToMarkdown(htmlString) {
        const sanitizedHtml = new DOMParser().parseFromString(htmlString, 'text/html').body;
        return turndownService.turndown(sanitizedHtml);
    }

    /**
     * 使用 DeepSeek API 优化 Markdown 内容
     * @param {string} prompt 指令提示词
     * @param {string} originalMarkdown 原始 Markdown 文本
     * @param {string} apiKey DeepSeek API 密钥
     * @return {Promise<string>} 优化后的 Markdown 文本
     */
    async function getEnhancedMarkdown(prompt, originalMarkdown, apiKey) {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('请先输入有效的DeepSeek API Key');
        }

        return new Promise((resolve, reject) => {
            const requestTimeout = 60000; // 60秒超时时间

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.deepseek.com/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: "system", content: prompt },
                        { role: "user", content: originalMarkdown }
                    ]
                }),
                timeout: requestTimeout,
                onload: res => {
                    try {
                        if (res.status >= 200 && res.status < 300) {
                            const response = JSON.parse(res.responseText);
                            if (response.choices && response.choices[0] && response.choices[0].message) {
                                resolve(response.choices[0].message.content);
                            } else {
                                reject('API 返回结果格式异常');
                            }
                        } else {
                            reject(`API错误: ${res.status} - ${res.responseText}`);
                        }
                    } catch (error) {
                        reject(`解析 API 响应失败: ${error.message}`);
                    }
                },
                onerror: err => reject(`网络错误: ${err}`),
                ontimeout: () => reject('请求超时，请稍后再试')
            });
        });
    }

    /**
     * 下载文件
     * @param {string} filename 文件名
     * @param {string} content 文件内容
     * @param {string} mimeType 文件 MIME 类型
     */
    function downloadFile(filename, content, mimeType = 'text/markdown;charset=utf-8') {
        const blob = new Blob([content], { type: mimeType });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = sanitizeFilename(filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    /**
     * 净化文件名，移除不合法字符
     * @param {string} filename 文件名
     * @return {string} 净化后的文件名
     */
    function sanitizeFilename(filename) {
        return filename.replace(/[/?%*:|"<>\\]/g, '-');
    }

    // =================================================================================
    // 模块二：浏览器插件 UI
    // =================================================================================

    class MarkdownConverterUI {
        constructor() {
            this.container = null;
            this.elements = {};
            this.currentArticleTitle = 'untitled';
            this.init();
        }

        init() {
            this.injectCSS();
            this.createUI();
            this.attachEventListeners();
            GM_registerMenuCommand("启动 Markdown 转换器", () => this.toggle());
        }

        toggle() {
            if (!this.container) return;
            this.container.style.display = (this.container.style.display === 'none') ? 'block' : 'none';
        }

        createUI() {
            this.container = document.createElement('div');
            this.container.id = 'mk-converter-container';
            this.container.style.display = 'none';
            this.container.innerHTML = `
                <div id="mk-converter-header"><span>网页转 Markdown</span><button id="mk-converter-close" class="mk-btn-close">×</button></div>
                <div id="mk-converter-body">
                    <div id="mk-single-page-initial" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                        <button id="mk-convert-current-page-btn" class="mk-btn mk-btn-primary">转换当前页面</button>
                    </div>
                    <div id="mk-preview-view" style="display: none;">
                        <div class="mk-control-group">
                            <div class="mk-ai-input-group">
                                <input type="text" id="mk-ai-api-key" placeholder="请输入DeepSeek API key">
                                <div class="mk-tooltip" id="mk-api-tooltip">
                                    <span>API 密钥已保存</span>
                                </div>
                            </div>
                            <div class="mk-prompt-container">
                                <textarea id="mk-ai-prompt" rows="3" placeholder="AI 指令 Prompt..."></textarea>
                                <div class="mk-prompt-buttons">
                                    <button id="mk-save-prompt-btn" class="mk-btn mk-btn-small" title="保存当前提示词">
                                        保存提示词
                                    </button>
                                    <button id="mk-reset-prompt-btn" class="mk-btn mk-btn-small" title="重置为默认提示词">
                                        重置提示词
                                    </button>
                                    <div class="mk-tooltip" id="mk-prompt-tooltip">
                                        <span>提示词已保存</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mk-control-group mk-export-controls">
                            <button id="mk-copy-btn" class="mk-btn">复制</button>
                            <button id="mk-download-btn" class="mk-btn">下载</button>
                            <button id="mk-ai-optimize-btn" class="mk-btn mk-btn-primary" style="margin-left: auto;">AI 优化并下载</button>
                        </div>
                        <div id="mk-dual-pane-editor" class="mk-control-group">
                            <textarea id="mk-md-editor" placeholder="Markdown 源码..."></textarea>
                            <div id="mk-md-preview" class="mk-preview-pane"></div>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(this.container);
            this.cacheElements();
        }

        cacheElements() {
            this.elements = {
                closeBtn: this.container.querySelector('#mk-converter-close'),
                convertCurrentPageBtn: this.container.querySelector('#mk-convert-current-page-btn'),
                previewView: this.container.querySelector('#mk-preview-view'),
                aiApiKey: this.container.querySelector('#mk-ai-api-key'),
                apiTooltip: this.container.querySelector('#mk-api-tooltip'),
                aiPrompt: this.container.querySelector('#mk-ai-prompt'),
                savePromptBtn: this.container.querySelector('#mk-save-prompt-btn'),
                resetPromptBtn: this.container.querySelector('#mk-reset-prompt-btn'),
                promptTooltip: this.container.querySelector('#mk-prompt-tooltip'),
                aiOptimizeBtn: this.container.querySelector('#mk-ai-optimize-btn'),
                mdEditor: this.container.querySelector('#mk-md-editor'),
                mdPreview: this.container.querySelector('#mk-md-preview'),
                copyBtn: this.container.querySelector('#mk-copy-btn'),
                downloadBtn: this.container.querySelector('#mk-download-btn'),
            };
        }

        attachEventListeners() {
            // 拖拽功能
            this.setupDraggable();

            // 关闭按钮
            this.elements.closeBtn.addEventListener('click', () => this.toggle());

            // 加载保存的API密钥
            this.elements.aiApiKey.value = GM_getValue('deepseek_api_key', '');

            // 加载保存的AI提示词
            this.elements.aiPrompt.value = GM_getValue('custom_ai_prompt', DEFAULT_AI_PROMPT);

            // 保存API密钥并提供反馈
            this.elements.aiApiKey.addEventListener('input', (e) => this.handleApiKeyInput(e));

            // 保存和重置提示词功能
            this.elements.savePromptBtn.addEventListener('click', () => this.handleSavePrompt());
            this.elements.resetPromptBtn.addEventListener('click', () => this.handleResetPrompt());

            // 其他事件监听
            this.elements.convertCurrentPageBtn.addEventListener('click', () => this.handleConvertCurrentPage());
            this.elements.mdEditor.addEventListener('input', () => this.updatePreview());
            this.elements.aiOptimizeBtn.addEventListener('click', () => this.handleAiOptimize());
            this.elements.copyBtn.addEventListener('click', () => this.handleCopy());
            this.elements.downloadBtn.addEventListener('click', () => this.handleDownload());
        }

        handleSavePrompt() {
            const promptText = this.elements.aiPrompt.value.trim();
            if (promptText) {
                GM_setValue('custom_ai_prompt', promptText);
                // 显示可视反馈
                this.elements.promptTooltip.classList.add('show');
                setTimeout(() => {
                    this.elements.promptTooltip.classList.remove('show');
                }, 2000);
            } else {
                alert('提示词不能为空');
            }
        }

        handleResetPrompt() {
            this.elements.aiPrompt.value = DEFAULT_AI_PROMPT;
            GM_setValue('custom_ai_prompt', DEFAULT_AI_PROMPT);
            this.showNotification('已重置为默认提示词');
        }

        setupDraggable() {
            const header = this.container.querySelector('#mk-converter-header');
            let isDragging = false, offset = { x: 0, y: 0 };

            header.addEventListener('mousedown', (e) => {
                if (e.target.matches('.mk-btn-close')) return;
                isDragging = true;
                offset = {
                    x: e.clientX - this.container.offsetLeft,
                    y: e.clientY - this.container.offsetTop
                };
                header.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const left = Math.max(0, Math.min(window.innerWidth - this.container.offsetWidth, e.clientX - offset.x));
                    const top = Math.max(0, Math.min(window.innerHeight - this.container.offsetHeight, e.clientY - offset.y));

                    this.container.style.left = `${left}px`;
                    this.container.style.top = `${top}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                header.style.cursor = 'grab';
            });
        }

        handleApiKeyInput(e) {
            const key = e.target.value.trim();
            GM_setValue('deepseek_api_key', key);

            // 显示可视反馈
            if (key) {
                this.elements.apiTooltip.classList.add('show');
                setTimeout(() => {
                    this.elements.apiTooltip.classList.remove('show');
                }, 2000);
            }
        }

        async handleConvertCurrentPage() {
            const btn = this.elements.convertCurrentPageBtn;
            btn.textContent = '转换中...';
            btn.disabled = true;

            try {
                const article = extractArticle(document);

                if (!article) {
                    alert('无法提取当前页面的正文。');
                    return;
                }

                this.currentArticleTitle = article.title || document.title;
                const markdown = `# ${this.currentArticleTitle}\n\n` + htmlToMarkdown(article.content);
                this.elements.mdEditor.value = markdown;
                this.updatePreview();
                this.container.querySelector('#mk-single-page-initial').style.display = 'none';
                this.elements.previewView.style.display = 'flex';

                // 使用保存的自定义提示词或默认提示词
                this.elements.aiPrompt.value = GM_getValue('custom_ai_prompt', DEFAULT_AI_PROMPT);
            } catch (error) {
                console.error('转换页面失败:', error);
                alert(`转换页面失败: ${error.message || '未知错误'}`);
            } finally {
                btn.textContent = '转换当前页面';
                btn.disabled = false;
            }
        }

        updatePreview() {
            try {
                this.elements.mdPreview.innerHTML = marked.parse(this.elements.mdEditor.value);
            } catch (error) {
                console.error('预览渲染失败:', error);
                this.elements.mdPreview.innerHTML = '<div class="mk-error">渲染预览时出错</div>';
            }
        }

        async handleAiOptimize() {
            const btn = this.elements.aiOptimizeBtn;
            btn.textContent = '处理中...';
            btn.disabled = true;

            try {
                const apiKey = this.elements.aiApiKey.value.trim();
                if (!apiKey) {
                    alert('请先输入有效的DeepSeek API Key');
                    throw new Error('API Key未提供');
                }

                const prompt = this.elements.aiPrompt.value || DEFAULT_AI_PROMPT;

                // 显示加载状态
                this.elements.mdPreview.innerHTML = '<div class="mk-loading">AI 优化中，请稍候...</div>';

                const enhancedMarkdown = await getEnhancedMarkdown(prompt, this.elements.mdEditor.value, apiKey);
                this.elements.mdEditor.value = enhancedMarkdown;
                this.updatePreview();

                // 提取文章标题
                const titleMatch = enhancedMarkdown.match(/^#\s(.+)/m);
                const title = titleMatch ? titleMatch[1] : this.currentArticleTitle;

                downloadFile(`${title}_(AI优化).md`, enhancedMarkdown);
                alert('AI 优化完成并已自动下载！');
            } catch (error) {
                alert(`AI 优化失败: ${error.message || error}`);
                console.error('AI 优化失败:', error);
                this.updatePreview(); // 恢复原有预览
            } finally {
                btn.textContent = 'AI 优化并下载';
                btn.disabled = false;
            }
        }

        handleCopy() {
            try {
                navigator.clipboard.writeText(this.elements.mdEditor.value)
                    .then(() => {
                        this.showNotification('已复制到剪贴板!');
                    })
                    .catch(() => {
                        alert('无法访问剪贴板，请检查浏览器权限。');
                    });
            } catch (error) {
                console.error('复制失败:', error);
                alert('复制失败!');
            }
        }

        handleDownload() {
            try {
                const markdownText = this.elements.mdEditor.value;
                const titleMatch = markdownText.match(/^#\s(.+)/m);
                const title = titleMatch ? titleMatch[1] : this.currentArticleTitle;

                downloadFile(`${title}.md`, markdownText);
                this.showNotification('下载成功!');
            } catch (error) {
                console.error('下载失败:', error);
                alert('下载失败!');
            }
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'mk-notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');

                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 2000);
            }, 10);
        }

        injectCSS() {
            GM_addStyle(`
                #mk-converter-container { position: fixed; top: 50px; right: 20px; width: 800px; max-width: 90vw; height: 85vh; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); z-index: 99999; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #222; resize: both; overflow: hidden; min-width: 600px; min-height: 500px; }
                #mk-converter-header { padding: 10px 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; cursor: grab; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
                #mk-converter-header span { font-weight: 600; font-size: 16px; }
                .mk-btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #888; }
                .mk-btn-close:hover { color: #333; }
                #mk-converter-body { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
                .mk-btn { padding: 8px 16px; font-size: 14px; border-radius: 5px; border: 1px solid #ccc; background-color: #f0f0f0; cursor: pointer; transition: all 0.2s ease; }
                .mk-btn:hover { background-color: #e6e6e6; }
                .mk-btn:active { transform: translateY(1px); }
                .mk-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .mk-btn-primary { background-color: #007bff; color: white; border-color: #007bff; }
                .mk-btn-primary:hover { background-color: #0056b3; }
                .mk-btn-small { padding: 4px 8px; font-size: 12px; }
                .mk-control-group { margin-bottom: 15px; flex-shrink: 0; }
                #mk-preview-view { flex-direction: column; height: 100%; display: flex; }
                .mk-ai-input-group { display: flex; gap: 10px; margin-bottom: 10px; position: relative; }
                #mk-ai-api-key, #mk-ai-prompt { padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 13px; transition: border-color 0.3s; }
                #mk-ai-api-key { flex-grow: 1; }
                .mk-prompt-container { position: relative; width: 100%; }
                #mk-ai-prompt { width: 100%; box-sizing: border-box; resize: vertical; margin-bottom: 5px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
                .mk-prompt-buttons { display: flex; gap: 8px; margin-bottom: 10px; }
                .mk-icon { margin-right: 4px; }
                #mk-dual-pane-editor { display: flex; flex-grow: 1; gap: 10px; height: 50vh; min-height: 300px; }
                #mk-md-editor, #mk-md-preview { width: 50%; height: 100%; padding: 12px; border: 1px solid #ced4da; border-radius: 4px; overflow-y: auto; font-size: 14px; }
                #mk-md-editor { resize: none; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; line-height: 1.5; }
                .mk-preview-pane { line-height: 1.6; }
                .mk-export-controls { display: flex; gap: 10px; align-items: center; }
                .mk-tooltip { position: absolute; top: -30px; right: 0; background-color: #333; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
                .mk-tooltip.show { opacity: 1; }
                #mk-prompt-tooltip { top: -30px; right: 0; }
                .mk-notification { position: fixed; bottom: 20px; right: 20px; background-color: #333; color: white; padding: 10px 20px; border-radius: 4px; z-index: 100000; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; }
                .mk-notification.show { transform: translateY(0); opacity: 0.9; }
                .mk-loading { display: flex; justify-content: center; align-items: center; height: 100%; color: #666; font-style: italic; }
                .mk-error { color: #d9534f; padding: 10px; border: 1px solid #d9534f; border-radius: 4px; }
                #mk-md-preview h1 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
                #mk-md-preview h2 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
                #mk-md-preview pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
                #mk-md-preview code { background-color: rgba(27,31,35,.05); padding: 0.2em 0.4em; border-radius: 3px; font-size: 85%; }
                #mk-md-preview pre code { background-color: transparent; padding: 0; }
                #mk-md-preview blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; }
                #mk-md-preview img { max-width: 100%; }
                #mk-md-preview table { border-collapse: collapse; width: 100%; overflow: auto; display: block; }
                #mk-md-preview table th, #mk-md-preview table td { padding: 6px 13px; border: 1px solid #dfe2e5; }
                #mk-md-preview table tr { background-color: #fff; border-top: 1px solid #c6cbd1; }
                #mk-md-preview table tr:nth-child(2n) { background-color: #f6f8fa; }
            `);
        }
    }

    new MarkdownConverterUI();
})();