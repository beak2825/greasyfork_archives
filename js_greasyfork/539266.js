// ==UserScript==
// @name         下载Notion页面 (Markdown)
// @namespace    https://notion.so
// @version      1.0
// @description  在右下角添加悬浮按钮，点击或使用 Alt+C 将当前 Notion 页面下载为 Markdown 文件。
// @author       YI_XUAN
// @match        https://www.notion.so/*
// @match        https://*.notion.site/*
// @require      https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js
// @run-at       document-idle
// @license           GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539266/%E4%B8%8B%E8%BD%BDNotion%E9%A1%B5%E9%9D%A2%20%28Markdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539266/%E4%B8%8B%E8%BD%BDNotion%E9%A1%B5%E9%9D%A2%20%28Markdown%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ==========================================================================
       1. 配置与常量 (Configuration)
       ========================================================================== */
    const CONFIG = {
        IDS: {
            BUTTON: 'notion-md-download-btn',
            TOAST: 'notion-md-toast-container',
            STYLE: 'notion-md-style-tag'
        },
        TIMEOUTS: {
            TOAST: 2500,
            DEBOUNCE: 300
        },
        SELECTORS: {
            CONTENT_ROOT: '.notion-page-content',
            CODE_BLOCK: '.notion-code-block', // 目标选择器
            PAGE_TITLE: 'title'
        }
    };

    /* ==========================================================================
       2. 工具函数 (Utilities)
       ========================================================================== */

    /**
     * 防抖函数：限制函数执行频率
     * @param {Function} func - 目标函数
     * @param {number} wait - 等待时间
     */
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    /**
     * 文件名清洗：移除非法字符
     * @param {string} name - 原始文件名
     * @returns {string} 安全的文件名
     */
    function sanitizeFileName(name) {
        return name
            .replace(/[<>:"/\\|?*]/g, '') // 移除系统保留字符
            .replace(/\s+/g, ' ')         // 合并空白
            .replace(/ \| Notion$/, '')   // 移除 Notion 后缀
            .replace(/ – Notion$/, '')
            .trim() || 'Untitled';
    }

    /**
     * 延迟函数：用于异步等待
     * @param {number} ms - 毫秒
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* ==========================================================================
       3. 样式管理 (Style Manager) - 将CSS从JS逻辑中剥离
       ========================================================================== */

    function injectCustomStyles() {
        if (document.getElementById(CONFIG.IDS.STYLE)) return;

        const css = `
            /* 悬浮按钮样式 */
            #${CONFIG.IDS.BUTTON} {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                width: 48px;
                height: 48px;
                font-size: 22px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #${CONFIG.IDS.BUTTON}:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
            }
            #${CONFIG.IDS.BUTTON}:active {
                transform: scale(0.95);
            }
            #${CONFIG.IDS.BUTTON}.loading {
                opacity: 0.7;
                cursor: wait;
                animation: spin 1s infinite linear;
            }

            /* Toast 容器样式 */
            #${CONFIG.IDS.TOAST} {
                position: fixed;
                bottom: 20px;
                right: 80px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
            }

            /* 单个 Toast 样式 */
            .notion-toast-item {
                padding: 10px 16px;
                font-size: 14px;
                border-radius: 8px;
                color: #fff;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateX(20px);
                transition: opacity 0.25s, transform 0.25s;
            }
            .toast-enter {
                opacity: 1;
                transform: translateX(0);
            }
            .toast-success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
            .toast-error { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
            .toast-info { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
            .toast-loading { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }

            @keyframes spin { 100% { transform: rotate(360deg); } }
        `;

        const styleEl = document.createElement('style');
        styleEl.id = CONFIG.IDS.STYLE;
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }

    /* ==========================================================================
       4. UI 组件模块 (UI Components)
       ========================================================================== */

    /**
     * 显示 Toast 通知
     * @param {string} message - 内容
     * @param {'info'|'success'|'error'|'loading'} type - 类型
     */
    function showToast(message, type = 'info') {
        let container = document.getElementById(CONFIG.IDS.TOAST);
        if (!container) {
            container = document.createElement('div');
            container.id = CONFIG.IDS.TOAST;
            document.body.appendChild(container);
        }

        const el = document.createElement('div');
        el.className = `notion-toast-item toast-${type}`;
        el.textContent = message;
        container.appendChild(el);

        // 触发重绘以激活动画
        requestAnimationFrame(() => el.classList.add('toast-enter'));

        // 定时移除
        setTimeout(() => {
            el.classList.remove('toast-enter');
            el.addEventListener('transitionend', () => el.remove(), { once: true });
        }, CONFIG.TIMEOUTS.TOAST);
    }

    /**
     * 创建或获取下载按钮
     * @returns {HTMLElement} 按钮元素
     */
    function getOrCreateButton() {
        let btn = document.getElementById(CONFIG.IDS.BUTTON);
        if (btn) return btn;

        btn = document.createElement('button');
        btn.id = CONFIG.IDS.BUTTON;
        btn.innerHTML = '📥';
        btn.title = '下载 Markdown (Alt+C)';
        btn.onclick = handleDownloadAction; // 绑定主逻辑
        document.body.appendChild(btn);
        return btn;
    }

    /**
     * 切换按钮的加载状态
     * @param {boolean} isLoading
     */
    function setButtonLoadingState(isLoading) {
        const btn = document.getElementById(CONFIG.IDS.BUTTON);
        if (!btn) return;

        if (isLoading) {
            btn.classList.add('loading');
            btn.innerHTML = '⏳';
        } else {
            btn.classList.remove('loading');
            btn.innerHTML = '📥';
        }
    }

    /* ==========================================================================
       5. 核心逻辑：图片处理 (Image Processing)
       ========================================================================== */

    /**
     * 解析 Notion 的复杂图片 URL（包括 Proxy 路径）
     * @param {string} urlPath - 原始 src
     * @returns {string} 可访问的绝对路径
     */
    function resolveNotionImageUrl(urlPath) {
        if (!urlPath) return '';

        // 处理 /image/https%3A... 格式
        if (urlPath.startsWith('/image/')) {
            const rawUrlMatch = urlPath.match(/\/image\/(https?%3A%2F%2F[^?]+)/);
            if (rawUrlMatch && rawUrlMatch[1]) {
                try {
                    return decodeURIComponent(rawUrlMatch[1]);
                } catch (e) {
                    return window.location.origin + urlPath;
                }
            }
            return window.location.origin + urlPath;
        }

        // 处理相对路径
        if (urlPath.startsWith('/')) {
            return window.location.origin + urlPath;
        }

        return urlPath;
    }

    /**
     * 预处理 DOM 中的所有图片节点
     * @param {HTMLElement} domNode - 克隆的 DOM 根节点
     */
    function processDomImages(domNode) {
        const images = domNode.querySelectorAll('img');
        images.forEach(img => {
            // 获取真实链接 (src 或 data-src)
            const rawSrc = img.getAttribute('src') || img.getAttribute('data-src');
            const realUrl = resolveNotionImageUrl(rawSrc);

            if (realUrl) {
                img.setAttribute('src', realUrl);
            }

            // 确保 Alt 文本存在，方便 Markdown 显示
            if (!img.alt) img.alt = 'image';
        });
    }


    /**
     * [新增函数] 处理代码块
     * 作用：将 Notion 的 div 代码块结构转换为标准的 <pre><code> 结构，
     * 这样 Turndown 就能正确识别为 ```block``` 并保留换行。
     */
    function processCodeBlocks(domNode) {
        const blocks = domNode.querySelectorAll(CONFIG.SELECTORS.CODE_BLOCK);

        blocks.forEach(block => {
            // 1. 获取纯文本内容 (innerText 会保留可视化的换行符)
            // Notion 的代码块内容通常不仅包含代码，还可能有行号元素等，innerText 通常能拿到“看到的样子”
            const codeContent = block.innerText;

            // 2. 创建标准的 HTML 代码块结构
            const pre = document.createElement('pre');
            const code = document.createElement('code');

            // 3. 填充内容
            code.textContent = codeContent;

            // 4. 组装
            pre.appendChild(code);

            // 5. 替换原始 Notion 节点
            // 使用 replaceWith 将原本复杂的 div 替换为干净的 pre
            block.replaceWith(pre);
        });
    }


    /* ==========================================================================
       6. 核心逻辑：转换与下载 (Converter & Download)
       ========================================================================== */

    /**
     * 初始化并配置 Turndown 服务
     * @returns {TurndownService}
     */
    function initTurndownService() {
        // eslint-disable-next-line no-undef
        const service = new TurndownService({
            headingStyle: 'atx',
            hr: '---',
            codeBlockStyle: 'fenced'
        });

        // 自定义图片规则：保留 Alt 和 Title
        service.addRule('enhancedImage', {
            filter: 'img',
            replacement: function (content, node) {
                const alt = node.alt || '';
                const src = node.getAttribute('src') || '';
                const title = node.title ? ` "${node.title}"` : '';
                return src ? `![${alt}](${src}${title})` : '';
            }
        });

        // 可以在此添加更多自定义规则，例如处理 Notion 特有的 Callout 块
        return service;
    }

    /**
     * 将 HTML 字符串转换为 Markdown
     * @param {HTMLElement} contentElement - 包含内容的 DOM 元素
     * @returns {string} Markdown 文本
     */
    function convertToMarkdown(contentElement) {
        // 1. 克隆节点，避免修改页面原显示
        const clone = contentElement.cloneNode(true);

        // 2. 预处理图片链接
        processDomImages(clone);

        // 3. [新增] 预处理代码块 (必须在 Turndown 转换前执行)
        processCodeBlocks(clone);

        // 4. 执行转换
        const turndown = initTurndownService();
        return turndown.turndown(clone.innerHTML);
    }

    /**
     * 触发浏览器下载文件
     * @param {string} content - 文件内容
     * @param {string} filename - 文件名
     */
    function triggerFileDownload(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /**
     * 主业务逻辑：执行下载流程
     */
    async function handleDownloadAction() {
        // 状态锁：防止重复点击
        if (document.getElementById(CONFIG.IDS.BUTTON)?.classList.contains('loading')) {
            return;
        }

        const contentNode = document.querySelector(CONFIG.SELECTORS.CONTENT_ROOT);
        if (!contentNode) {
            showToast('未检测到页面正文，请确保页面已加载', 'error');
            return;
        }

        try {
            setButtonLoadingState(true);
            showToast('正在解析页面结构...', 'loading');

            // 稍微等待 UI 渲染
            await sleep(50);

            // 1. 获取标题
            const rawTitle = document.title;
            const fileName = sanitizeFileName(rawTitle) + '.md';

            // 2. 转换内容
            const markdown = convertToMarkdown(contentNode);

            // 3. 下载
            triggerFileDownload(markdown, fileName);

            showToast(`下载成功: ${fileName}`, 'success');

        } catch (err) {
            console.error('[Notion MD Downloader] Error:', err);
            showToast('下载失败，请查看控制台日志', 'error');
        } finally {
            setButtonLoadingState(false);
        }
    }

    /* ==========================================================================
       7. 初始化与事件监听 (Initialization)
       ========================================================================== */

    /**
     * 键盘快捷键监听
     * @param {KeyboardEvent} e
     */
    function handleGlobalKeydown(e) {
        // Alt + C
        if (e.altKey && (e.code === 'KeyC' || e.key === 'c')) {
            e.preventDefault();
            handleDownloadAction();
        }
    }

    /**
     * 观察 DOM 变化（适配 Notion 的 SPA 单页应用特性）
     * 当路由切换时，按钮可能会被移除，需要重新添加
     */
    function startDomObserver() {
        const observer = new MutationObserver(debounce(() => {
            getOrCreateButton();
        }, 200));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 脚本主入口
     */
    function main() {
        console.log('[Notion MD Downloader] Script Loaded.');

        // 1. 注入 CSS
        injectCustomStyles();

        // 2. 初始化按钮
        getOrCreateButton();

        // 3. 绑定快捷键
        window.addEventListener('keydown', handleGlobalKeydown);

        // 4. 启动 DOM 监听 (确保切换页面后按钮不消失)
        startDomObserver();
    }

    // 启动
    main();

})();