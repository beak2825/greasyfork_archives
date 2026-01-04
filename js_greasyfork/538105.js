// ==UserScript==
// @name         LeetCode题单助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  LeetCode中英文站点增强工具，智能转换链接并显示做题状态
// @author       You
// @match        https://leetcode.cn/*
// @match        https://leetcode.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      leetcode.com
// @connect      leetcode.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538105/LeetCode%E9%A2%98%E5%8D%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/538105/LeetCode%E9%A2%98%E5%8D%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'leetcode_progress_data',
        LAST_SYNC_KEY: 'leetcode_last_sync',
        SETTINGS_KEY: 'leetcode_settings',
        CACHE_DURATION: 2 * 60 * 60 * 1000,
        VERSION: '1.1'
    };

    const DEFAULT_SETTINGS = {
        autoSync: true,
        showDifficulty: true,
        showProgress: true,
        compactMode: false,
        hideCompleted: false,
        customCSS: ''
    };

    const DIFFICULTY_MAP = {
        1: { text: 'Easy', color: '#00b8a3' },
        2: { text: 'Med.', color: '#ffc01e' },
        3: { text: 'Hard', color: '#ff375f' }
    };

    const STATUS_MAP = {
        'ac': { emoji: '✅', text: 'Solved', color: '#52c41a', bgColor: '#f6ffed' },
        'notac': { emoji: '❌', text: 'Attempted', color: '#ff4d4f', bgColor: '#fff2f0' },
        null: { emoji: '⭕', text: 'Not Attempted', color: '#8c8c8c', bgColor: '#fafafa' }
    };

    console.log('🚀 LeetCode题单助手启动，版本:', CONFIG.VERSION);

    GM_addStyle(`
        .lc-converted {
            padding-left: 8px !important;
            transition: all 0.3s ease;
        }

        .lc-converted:hover {
            background-color: #f0f8ff !important;
            transform: translateX(2px);
        }

        .lc-status-container {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-right: 8px;
        }

        .lc-status-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            border: 1px solid #d9d9d9;
            transition: transform 0.2s ease;
        }

        .lc-status-badge:hover {
            transform: scale(1.1);
        }

        .lc-difficulty-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            color: white;
            min-width: 32px;
            justify-content: center;
        }

        .lc-control-panel {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            background: #ffffff;
            color: #333333;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            overflow: hidden;
            min-width: 200px;
            transition: all 0.3s ease;
        }

        [data-theme="dark"] .lc-control-panel,
        .dark .lc-control-panel,
        body[class*="dark"] .lc-control-panel {
            background: #1f1f1f !important;
            color: #ffffff !important;
            border: 1px solid #333;
        }

        .lc-panel-header {
            background: linear-gradient(135deg, #1890ff, #40a9ff);
            color: white;
            padding: 12px 16px;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            user-select: none;
        }

        .lc-panel-toggle {
            font-size: 12px;
            opacity: 0.8;
            transition: transform 0.3s ease;
        }

        .lc-panel-toggle.collapsed {
            transform: rotate(180deg);
        }

        .lc-panel-content {
            padding: 12px;
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .lc-control-panel.collapsed .lc-panel-content {
            max-height: 0;
            padding: 0 12px;
            opacity: 0;
        }

        .lc-control-panel:not(.collapsed) .lc-panel-content {
            max-height: 500px;
            opacity: 1;
        }

        .lc-button {
            width: 100%;
            padding: 8px 12px;
            margin-bottom: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .lc-button-primary {
            background: #1890ff;
            color: white;
        }

        .lc-button-primary:hover {
            background: #40a9ff;
        }

        .lc-button-secondary {
            background: #f0f0f0;
            color: #333;
        }

        .lc-button-secondary:hover {
            background: #e0e0e0;
        }

        [data-theme="dark"] .lc-button-secondary,
        .dark .lc-button-secondary,
        body[class*="dark"] .lc-button-secondary {
            background: #333 !important;
            color: #fff !important;
        }

        [data-theme="dark"] .lc-button-secondary:hover,
        .dark .lc-button-secondary:hover,
        body[class*="dark"] .lc-button-secondary:hover {
            background: #444 !important;
        }

        .lc-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin: 8px 0;
            font-size: 10px;
        }

        .lc-stat-item {
            text-align: center;
            padding: 4px;
            border-radius: 4px;
            background: #f9f9f9;
            color: #333;
        }

        [data-theme="dark"] .lc-stat-item,
        .dark .lc-stat-item,
        body[class*="dark"] .lc-stat-item {
            background: #333 !important;
            color: #fff !important;
        }

        .lc-progress-bar {
            width: 100%;
            height: 6px;
            background: #f0f0f0;
            border-radius: 3px;
            overflow: hidden;
            margin: 8px 0;
        }

        .lc-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #52c41a, #73d13d);
            transition: width 0.3s ease;
        }

        .lc-settings {
            border-top: 1px solid #f0f0f0;
            margin-top: 8px;
            padding-top: 8px;
        }

        [data-theme="dark"] .lc-settings,
        .dark .lc-settings,
        body[class*="dark"] .lc-settings {
            border-top-color: #444 !important;
        }

        .lc-setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 11px;
            color: inherit;
        }

        .lc-switch {
            position: relative;
            width: 32px;
            height: 18px;
            background: #ccc;
            border-radius: 9px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .lc-switch.active {
            background: #1890ff;
        }

        .lc-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            transition: transform 0.2s;
        }

        .lc-switch.active::after {
            transform: translateX(14px);
        }

        .lc-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            border-left: 4px solid #52c41a;
            padding: 16px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .lc-hidden {
            opacity: 0.3;
            filter: grayscale(50%);
        }

        .lc-jump-button {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            margin-left: 12px;
            background: linear-gradient(135deg, #1890ff, #40a9ff);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            box-shadow: 0 2px 4px rgba(24, 144, 255, 0.3);
        }

        .lc-jump-button:hover {
            background: linear-gradient(135deg, #40a9ff, #69c0ff);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(24, 144, 255, 0.4);
            color: white;
            text-decoration: none;
        }

        .lc-jump-button:active {
            transform: translateY(0);
        }

        /* 新增的复制按钮样式 */
        .lc-copy-buttons-container {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-left: 12px;
            flex-wrap: wrap;
        }

        .lc-copy-button {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 10px;
            background: linear-gradient(135deg, #52c41a, #73d13d);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(82, 196, 26, 0.3);
            white-space: nowrap;
        }

        .lc-copy-button:hover {
            background: linear-gradient(135deg, #73d13d, #95de64);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(82, 196, 26, 0.4);
        }

        .lc-copy-button:active {
            transform: translateY(0);
        }

        .lc-copy-button.copying {
            background: #faad14;
            transform: none;
        }

        .lc-copy-button.success {
            background: #52c41a;
            transform: none;
        }

        .lc-copy-button.error {
            background: #ff4d4f;
            transform: none;
        }

        /* 适配小屏幕 */
        @media (max-width: 768px) {
            .lc-copy-buttons-container {
                margin-left: 0;
                margin-top: 8px;
                width: 100%;
            }

            .lc-copy-button {
                flex: 1;
                justify-content: center;
                min-width: 0;
            }
        }
    `);

    class LeetCodeUltimate {
        constructor() {
            this.settings = { ...DEFAULT_SETTINGS, ...GM_getValue(CONFIG.SETTINGS_KEY, {}) };
            this.progressData = GM_getValue(CONFIG.STORAGE_KEY, {});
            this.isInternational = window.location.hostname === 'leetcode.com';
            this.isChinese = window.location.hostname === 'leetcode.cn';
            this.stats = { total: 0, solved: 0, attempted: 0 };

            this.init();
        }

        init() {
            if (this.isInternational) {
                this.handleInternationalSite();
            } else if (this.isChinese) {
                if (this.isProblemsDetailPage()) {
                    this.addJumpButton();
                    return;
                }
                this.handleChineseSite();
            }

            if (this.settings.customCSS) {
                GM_addStyle(this.settings.customCSS);
            }
        }

        isProblemsDetailPage() {
            const path = window.location.pathname;
            return /^\/problems\/[^\/]+\/(description|solutions|discuss|submissions|editorial)/.test(path) ||
                   /^\/problems\/[^\/]+\/$/.test(path);
        }

        addJumpButton() {
            setTimeout(() => {
                this.insertJumpButton();
            }, 1500);

            const observer = new MutationObserver(() => {
                if (!document.querySelector('.lc-jump-button')) {
                    setTimeout(() => this.insertJumpButton(), 500);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        insertJumpButton() {
            if (document.querySelector('.lc-jump-button')) {
                return;
            }

            const titleSelectors = [
                'h1[data-cy="question-title"]',
                '.question-title h1',
                '.question-content h1',
                '.css-v3d350',
                '[class*="title"]'
            ];

            let titleElement = null;
            for (const selector of titleSelectors) {
                try {
                    titleElement = document.querySelector(selector);
                    if (titleElement) break;
                } catch (e) {
                    continue;
                }
            }

            if (!titleElement) {
                const h1Elements = document.querySelectorAll('h1');
                for (const h1 of h1Elements) {
                    const text = h1.textContent.trim();
                    if (/^\d+\./.test(text) && text.length > 5) {
                        titleElement = h1;
                        break;
                    }
                }
            }

            if (!titleElement) {
                return;
            }

            const currentUrl = window.location.href;
            const targetUrl = this.getTargetUrl(currentUrl);

            if (!targetUrl) {
                return;
            }

            // 创建按钮容器
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.display = 'inline-flex';
            buttonsContainer.style.alignItems = 'center';
            buttonsContainer.style.gap = '8px';
            buttonsContainer.style.marginLeft = '12px';
            buttonsContainer.style.flexWrap = 'wrap';

            // 跳转按钮
            const jumpButton = document.createElement('a');
            jumpButton.className = 'lc-jump-button';
            jumpButton.href = targetUrl;
            jumpButton.target = '_blank';
            jumpButton.rel = 'noopener noreferrer';

            if (this.isChinese) {
                jumpButton.innerHTML = `
                    <span>🌍</span>
                    <span>English</span>
                `;
                jumpButton.title = '在LeetCode国际站打开 / Open on LeetCode.com';
            } else {
                jumpButton.innerHTML = `
                    <span>🇨🇳</span>
                    <span>中文</span>
                `;
                jumpButton.title = '在LeetCode中文站打开 / Open on LeetCode.cn';
            }

            buttonsContainer.appendChild(jumpButton);

            // 如果是国际站，添加复制按钮
            if (this.isInternational) {
                const copyButtonsContainer = this.createCopyButtons();
                buttonsContainer.appendChild(copyButtonsContainer);
            }

            titleElement.appendChild(buttonsContainer);
        }

        createCopyButtons() {
            const container = document.createElement('div');
            container.className = 'lc-copy-buttons-container';

            const buttons = [
                {
                    text: '📋 Title',
                    title: 'Copy problem title to clipboard',
                    action: () => this.copyTitle()
                },
                {
                    text: '📄 Problem',
                    title: 'Copy problem description to clipboard',
                    action: () => this.copyProblem()
                },
                {
                    text: '💻 Solution',
                    title: 'Copy my solution to clipboard',
                    action: () => this.copySolution()
                }
            ];

            buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.className = 'lc-copy-button';
                button.innerHTML = buttonConfig.text;
                button.title = buttonConfig.title;
                button.onclick = buttonConfig.action;
                container.appendChild(button);
            });

            return container;
        }

        async copyTitle() {
            const button = event.target.closest('.lc-copy-button');
            const originalText = button.innerHTML;

            try {
                button.classList.add('copying');
                button.innerHTML = '⏳ Copying...';

                let titleText = '';

                // 根据HTML结构，直接查找正确的标题元素
                const titleElement = document.querySelector('.text-title-large a');
                if (titleElement) {
                    titleText = titleElement.textContent.trim();
                }

                // 备用方案
                if (!titleText) {
                    const altSelectors = [
                        '.text-title-large',
                        '[class*="title-large"]',
                        'h1',
                        '.font-semibold a'
                    ];

                    for (const selector of altSelectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            let text = element.textContent.trim();
                            // 检查是否是题目标题格式
                            if (/^\d+\.\s*.+/.test(text) && text.length > 5) {
                                titleText = text;
                                break;
                            }
                        }
                    }
                }

                // 最后的备用方案：从URL提取
                if (!titleText) {
                    const urlMatch = window.location.pathname.match(/\/problems\/([^\/]+)/);
                    if (urlMatch) {
                        const slug = urlMatch[1];
                        // 从页面标题提取
                        const pageTitle = document.title;
                        const match = pageTitle.match(/^\d+\.\s*(.+?)\s*-\s*LeetCode/);
                        if (match) {
                            titleText = match[1]; // 只要题目名称，不要数字
                        } else {
                            // 从slug转换
                            titleText = slug.split('-').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ');
                        }
                    }
                }

                if (!titleText) {
                    throw new Error('Could not find problem title');
                }

                // 清理按钮文本和其他无关内容，同时移除题目编号
                titleText = titleText
                    .replace(/🌍\s*English|🇨🇳\s*中文|📋\s*Title|📄\s*Problem|💻\s*Solution/g, '')
                    .replace(/Solved\s*$/i, '')
                    .replace(/^\d+\.\s*/, '') // 移除开头的数字和点号
                    .trim();

                await navigator.clipboard.writeText(titleText);

                button.classList.remove('copying');
                button.classList.add('success');
                button.innerHTML = '✅ Copied!';

                this.showNotification('Title Copied', `"${titleText}" has been copied to clipboard`, 'success');

            } catch (error) {
                console.error('Copy title failed:', error);
                button.classList.remove('copying');
                button.classList.add('error');
                button.innerHTML = '❌ Failed';
                this.showNotification('Copy Failed', 'Failed to copy title to clipboard', 'error');
            }

            setTimeout(() => {
                button.className = 'lc-copy-button';
                button.innerHTML = originalText;
            }, 2000);
        }

        async copyProblem() {
            const button = event.target.closest('.lc-copy-button');
            const originalText = button.innerHTML;

            try {
                button.classList.add('copying');
                button.innerHTML = '⏳ Copying...';

                // 根据HTML结构查找题目描述容器
                let descriptionElement = document.querySelector('.elfjS[data-track-load="description_content"]');

                if (!descriptionElement) {
                    // 备用选择器
                    const backupSelectors = [
                        '.elfjS',
                        '[data-track-load="description_content"]',
                        '[class*="content"]',
                        '.description'
                    ];

                    for (const selector of backupSelectors) {
                        descriptionElement = document.querySelector(selector);
                        if (descriptionElement && descriptionElement.textContent.trim().length > 50) {
                            break;
                        }
                    }
                }

                if (!descriptionElement) {
                    throw new Error('Could not find problem description');
                }

                // 转换为Markdown格式
                const problemMarkdown = this.convertToMarkdown(descriptionElement);

                if (!problemMarkdown || problemMarkdown.length < 20) {
                    throw new Error('Problem description is too short or empty');
                }

                await navigator.clipboard.writeText(problemMarkdown);

                button.classList.remove('copying');
                button.classList.add('success');
                button.innerHTML = '✅ Copied!';

                this.showNotification('Problem Copied', `Problem description (${problemMarkdown.split('\n').length} lines, ${problemMarkdown.length} chars) has been copied with Markdown formatting`, 'success');

            } catch (error) {
                console.error('Copy problem failed:', error);
                button.classList.remove('copying');
                button.classList.add('error');
                button.innerHTML = '❌ Failed';
                this.showNotification('Copy Failed', error.message || 'Failed to copy problem description to clipboard', 'error');
            }

            setTimeout(() => {
                button.className = 'lc-copy-button';
                button.innerHTML = originalText;
            }, 2000);
        }

        convertToMarkdown(element) {
            // 创建元素副本以避免修改原DOM
            const clonedElement = element.cloneNode(true);

            // 移除不需要的元素
            const unwantedSelectors = [
                '.monaco-editor',
                '.CodeMirror',
                'button',
                '.lc-copy-button',
                '.lc-jump-button',
                '[class*="editor"]',
                '[class*="playground"]',
                '[class*="testcase"]',
                '[class*="submit"]',
                '[class*="run"]',
                'script',
                'style'
            ];

            unwantedSelectors.forEach(sel => {
                const elements = clonedElement.querySelectorAll(sel);
                elements.forEach(el => el.remove());
            });

            // 转换为Markdown
            let markdown = this.elementToMarkdown(clonedElement);

            // 最小化清理，保持原始格式
            markdown = markdown
                .replace(/\n\n\n+/g, '\n\n') // 只移除多余的连续空行
                .replace(/^\s+|\s+$/g, ''); // 只移除首尾空白

            return markdown;
        }

        elementToMarkdown(element) {
            let markdown = '';

            for (const node of element.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    if (text) {
                        markdown += text;
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();

                    switch (tagName) {
                        case 'p':
                            const pContent = this.elementToMarkdown(node);
                            if (pContent.trim()) {
                                markdown += `${pContent}\n\n`;
                            }
                            break;
                        case 'strong':
                        case 'b':
                            const strongText = node.textContent;
                            if (strongText) {
                                markdown += `**${strongText}**`;
                            }
                            break;
                        case 'em':
                        case 'i':
                            const emText = node.textContent;
                            if (emText) {
                                markdown += `*${emText}*`;
                            }
                            break;
                        case 'code':
                            const codeText = node.textContent;
                            if (codeText) {
                                if (node.parentNode && node.parentNode.tagName.toLowerCase() === 'pre') {
                                    markdown += codeText; // 在pre中的code不需要额外处理
                                } else {
                                    markdown += `\`${codeText}\``;
                                }
                            }
                            break;
                        case 'pre':
                            const preContent = node.textContent;
                            if (preContent) {
                                markdown += `\n\`\`\`\n${preContent}\n\`\`\`\n\n`;
                            }
                            break;
                        case 'ul':
                            markdown += '\n';
                            const listItems = node.querySelectorAll('li');
                            listItems.forEach(li => {
                                const liText = li.textContent;
                                if (liText) {
                                    markdown += `* ${liText}\n`;
                                }
                            });
                            markdown += '\n';
                            break;
                        case 'ol':
                            markdown += '\n';
                            const orderedItems = node.querySelectorAll('li');
                            orderedItems.forEach((li, index) => {
                                const liText = li.textContent;
                                if (liText) {
                                    markdown += `${index + 1}. ${liText}\n`;
                                }
                            });
                            markdown += '\n';
                            break;
                        case 'blockquote':
                            const blockText = node.textContent;
                            if (blockText) {
                                const lines = blockText.split('\n');
                                lines.forEach(line => {
                                    if (line.trim()) {
                                        markdown += `> ${line.trim()}\n`;
                                    }
                                });
                                markdown += '\n';
                            }
                            break;
                        case 'img':
                            const alt = node.getAttribute('alt') || '';
                            const src = node.getAttribute('src') || '';
                            if (src) {
                                markdown += `![${alt}](${src})`;
                            }
                            break;
                        case 'a':
                            const linkText = node.textContent;
                            const href = node.getAttribute('href') || '';
                            if (linkText && href) {
                                markdown += `[${linkText}](${href})`;
                            } else if (linkText) {
                                markdown += linkText;
                            }
                            break;
                        case 'br':
                            markdown += '\n';
                            break;
                        case 'hr':
                            markdown += '\n---\n\n';
                            break;
                        case 'h1':
                        case 'h2':
                        case 'h3':
                        case 'h4':
                        case 'h5':
                        case 'h6':
                            const level = parseInt(tagName.charAt(1));
                            const headingText = node.textContent;
                            if (headingText) {
                                markdown += `\n${'#'.repeat(level)} ${headingText}\n\n`;
                            }
                            break;
                        case 'table':
                            markdown += this.tableToMarkdown(node);
                            break;
                        case 'div':
                        case 'span':
                            // 对于div和span，递归处理子元素
                            markdown += this.elementToMarkdown(node);
                            break;
                        default:
                            // 对于其他元素，递归处理子元素
                            markdown += this.elementToMarkdown(node);
                            break;
                    }
                }
            }

            return markdown;
        }

        tableToMarkdown(tableElement) {
            let markdown = '\n';
            const rows = tableElement.querySelectorAll('tr');

            if (rows.length === 0) return '';

            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td, th');
                if (cells.length === 0) return;

                const cellContents = Array.from(cells).map(cell => {
                    return cell.textContent.trim().replace(/\|/g, '\\|'); // 转义管道符
                });

                markdown += '| ' + cellContents.join(' | ') + ' |\n';

                // 添加表头分隔符
                if (rowIndex === 0) {
                    markdown += '| ' + cellContents.map(() => '---').join(' | ') + ' |\n';
                }
            });

            markdown += '\n';
            return markdown;
        }

        async copySolution() {
            const button = event.target.closest('.lc-copy-button');
            const originalText = button.innerHTML;

            try {
                button.classList.add('copying');
                button.innerHTML = '⏳ Copying...';

                let solutionText = '';

                // 方法1: 从Monaco Editor的view-lines获取完整代码
                const viewLines = document.querySelector('.view-lines');
                if (viewLines) {
                    const lineElements = viewLines.querySelectorAll('.view-line');

                    if (lineElements.length > 0) {
                        const lines = [];
                        lineElements.forEach((lineElement) => {
                            // 获取每行的文本内容，保持原始格式
                            function extractTextFromNode(node) {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    return node.textContent;
                                } else if (node.nodeType === Node.ELEMENT_NODE) {
                                    let text = '';
                                    for (const child of node.childNodes) {
                                        text += extractTextFromNode(child);
                                    }
                                    return text;
                                }
                                return '';
                            }

                            let lineText = extractTextFromNode(lineElement);

                            // 如果这种方法失败，使用innerText作为备用
                            if (!lineText) {
                                lineText = lineElement.innerText || lineElement.textContent || '';
                            }

                            lines.push(lineText);
                        });

                        solutionText = lines.join('\n');
                    }
                }

                // 方法2: 尝试从Monaco Editor API获取
                if (!solutionText && window.monaco && window.monaco.editor) {
                    const editors = window.monaco.editor.getEditors();

                    if (editors.length > 0) {
                        for (let i = 0; i < editors.length; i++) {
                            try {
                                const editorValue = editors[i].getValue();
                                if (editorValue && editorValue.trim().length > solutionText.length) {
                                    solutionText = editorValue;
                                }
                            } catch (e) {
                                // 跳过这个编辑器，继续下一个
                            }
                        }
                    }
                }

                // 方法3: 尝试从textarea获取
                if (!solutionText || solutionText.trim().length < 10) {
                    const textareas = document.querySelectorAll('textarea');

                    textareas.forEach((textarea) => {
                        if (textarea.value && textarea.value.trim().length > 10) {
                            if (textarea.value.length > solutionText.length) {
                                solutionText = textarea.value;
                            }
                        }
                    });
                }

                // 方法4: 尝试从可编辑的div获取
                if (!solutionText || solutionText.trim().length < 10) {
                    const editableDivs = document.querySelectorAll('[contenteditable="true"]');

                    editableDivs.forEach((div) => {
                        const content = div.textContent || div.innerText;
                        if (content && content.trim().length > 10) {
                            // 检查是否看起来像代码
                            if (content.includes('def ') || content.includes('class ') ||
                                content.includes('function') || content.includes('var ') ||
                                content.includes('let ') || content.includes('const ') ||
                                content.includes('public ') || content.includes('private ') ||
                                content.includes('return ') || content.includes('if ') ||
                                content.includes('for ') || content.includes('while ')) {

                                if (content.length > solutionText.length) {
                                    solutionText = content;
                                }
                            }
                        }
                    });
                }

                // 方法5: 尝试从CodeMirror获取
                if (!solutionText || solutionText.trim().length < 10) {
                    const codeMirrorElements = document.querySelectorAll('.CodeMirror');

                    codeMirrorElements.forEach((cm) => {
                        if (cm.CodeMirror) {
                            try {
                                const cmValue = cm.CodeMirror.getValue();
                                if (cmValue && cmValue.length > solutionText.length) {
                                    solutionText = cmValue;
                                }
                            } catch (e) {
                                // 跳过这个CodeMirror实例
                            }
                        }
                    });
                }

                // 清理和验证代码
                if (solutionText) {
                    solutionText = solutionText.trim();
                }

                if (!solutionText || solutionText.trim().length < 5) {
                    throw new Error('Could not find solution code or editor is empty. Please make sure you have written code in the editor.');
                }

                await navigator.clipboard.writeText(solutionText);

                button.classList.remove('copying');
                button.classList.add('success');
                button.innerHTML = '✅ Copied!';

                const lineCount = solutionText.split('\n').length;
                this.showNotification('Solution Copied', `Your solution (${lineCount} lines, ${solutionText.length} characters) has been copied to clipboard`, 'success');

            } catch (error) {
                console.error('Copy solution failed:', error);
                button.classList.remove('copying');
                button.classList.add('error');
                button.innerHTML = '❌ Failed';
                this.showNotification('Copy Failed', error.message || 'Failed to copy solution. Make sure you have code in the editor.', 'error');
            }

            setTimeout(() => {
                button.className = 'lc-copy-button';
                button.innerHTML = originalText;
            }, 2000);
        }

        getTargetUrl(currentUrl) {
            try {
                const url = new URL(currentUrl);
                const pathname = url.pathname;
                const search = url.search;
                const hash = url.hash;

                if (this.isChinese) {
                    return `https://leetcode.com${pathname}${search}${hash}`;
                } else if (this.isInternational) {
                    return `https://leetcode.cn${pathname}${search}${hash}`;
                }

                return null;
            } catch (e) {
                return null;
            }
        }

        handleInternationalSite() {
            if (this.isProblemsDetailPage()) {
                this.addJumpButton();
                return;
            }

            setTimeout(() => {
                this.createControlPanel();
                if (this.settings.autoSync) {
                    this.checkAndAutoSync();
                }
            }, 2000);
        }

        createControlPanel() {
            const panel = document.createElement('div');
            panel.className = 'lc-control-panel';
            panel.innerHTML = `
                <div class="lc-panel-header">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>📚</span>
                        <span>LeetCode Supporter / 题单助手</span>
                    </div>
                    <span class="lc-panel-toggle">▼</span>
                </div>
                <div class="lc-panel-content">
                    <button class="lc-button lc-button-primary" id="lc-sync-btn">
                        <span>📊</span>
                        <span>同步到中文站 / Sync to CN</span>
                    </button>
                    <button class="lc-button lc-button-secondary" id="lc-clear-btn">
                        <span>🗑️</span>
                        <span>清除缓存 / Clear Cache</span>
                    </button>
                    <div class="lc-stats" id="lc-stats">
                        <div class="lc-stat-item">
                            <div>📈 已同步 / Synced</div>
                            <div id="lc-sync-count">0</div>
                        </div>
                        <div class="lc-stat-item">
                            <div>⏰ 最后同步 / Last Sync</div>
                            <div id="lc-last-sync">未同步 / Not Synced</div>
                        </div>
                    </div>
                    <div class="lc-settings">
                        <div class="lc-setting-item">
                            <span>自动同步 / Auto Sync</span>
                            <div class="lc-switch ${this.settings.autoSync ? 'active' : ''}" data-setting="autoSync"></div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.bindInternationalEvents(panel);
            this.updateSyncStats();

            this.addPanelToggle(panel);
        }

        bindInternationalEvents(panel) {
            panel.querySelector('#lc-sync-btn').onclick = () => this.syncProgress();
            panel.querySelector('#lc-clear-btn').onclick = () => this.clearCache();

            panel.querySelectorAll('.lc-switch').forEach(sw => {
                sw.onclick = () => this.toggleSetting(sw.dataset.setting, sw);
            });
        }

        async checkAndAutoSync() {
            const lastSync = GM_getValue(CONFIG.LAST_SYNC_KEY, 0);
            if (Date.now() - lastSync > CONFIG.CACHE_DURATION) {
                setTimeout(() => this.syncProgress(), 3000);
            }
        }

        async syncProgress() {
            const button = document.querySelector('#lc-sync-btn');
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span>⏳</span><span>同步中...</span>';
            button.disabled = true;

            try {
                let data = await this.fetchFromAPI();
                if (!data) {
                    data = await this.parseFromPage();
                }
                if (!data) {
                    data = await this.extractFromLocalStorage();
                }

                if (data && Object.keys(data).length > 0) {
                    this.saveProgressData(data);
                    button.innerHTML = '<span>✅</span><span>同步成功</span>';
                    this.showNotification('同步成功！ / Sync Success!', `已同步 ${Object.keys(data).length} 个题目的状态 / Synced ${Object.keys(data).length} problems`, 'success');
                } else {
                    throw new Error('无法获取有效数据 / Cannot get valid data');
                }

            } catch (error) {
                console.error('❌ 同步失败:', error);
                button.innerHTML = '<span>❌</span><span>同步失败</span>';
                this.showNotification('同步失败 / Sync Failed', error.message || '同步过程中出现错误 / Error during sync', 'error');
            }

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
                this.updateSyncStats();
            }, 2000);
        }

        async fetchFromAPI() {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://leetcode.com/api/problems/all/',
                    headers: {
                        'User-Agent': navigator.userAgent,
                        'Referer': 'https://leetcode.com/problemset/all/'
                    },
                    timeout: 10000,
                    onload: (response) => {
                        try {
                            if (response.status === 200) {
                                const apiData = JSON.parse(response.responseText);
                                if (apiData.stat_status_pairs) {
                                    const data = {};
                                    apiData.stat_status_pairs.forEach(item => {
                                        const slug = item.stat.question__title_slug;
                                        data[slug] = {
                                            titleSlug: slug,
                                            status: item.status,
                                            frontendId: item.stat.frontend_question_id,
                                            difficulty: item.difficulty?.level || null,
                                            title: item.stat.question__title,
                                            _raw_difficulty: item.difficulty
                                        };
                                    });

                                    resolve(data);
                                    return;
                                }
                            }
                            resolve(null);
                        } catch (e) {
                            resolve(null);
                        }
                    },
                    onerror: () => {
                        resolve(null);
                    }
                });
            });
        }

        async parseFromPage() {
            const data = {};

            await new Promise(resolve => setTimeout(resolve, 2000));

            const selectors = [
                'div[role="row"]',
                'tr[data-cy="question-row"]',
                '.question-list-table tbody tr'
            ];

            for (const selector of selectors) {
                const rows = document.querySelectorAll(selector);
                if (rows.length > 0) {
                    rows.forEach((row) => {
                        try {
                            const link = row.querySelector('a[href*="/problems/"]');
                            if (!link) return;

                            const slug = link.href.match(/\/problems\/([^\/\?]+)/)?.[1];
                            if (!slug) return;

                            let status = null;
                            const statusElements = row.querySelectorAll('[data-cy="status"], .text-green-s, .text-yellow, .status, svg');
                            statusElements.forEach(el => {
                                const text = el.textContent?.toLowerCase() || '';
                                const classList = el.classList?.toString() || '';

                                if (text.includes('✓') || classList.includes('text-green') || classList.includes('solved')) {
                                    status = 'ac';
                                } else if (text.includes('?') || classList.includes('text-yellow') || classList.includes('attempted')) {
                                    status = 'notac';
                                }
                            });

                            let difficulty = null;
                            const difficultySelectors = [
                                '[data-cy="difficulty"]',
                                '.difficulty',
                                '[class*="difficulty"]',
                                'span[class*="text-"]',
                                '.text-green-s', '.text-yellow', '.text-red'
                            ];

                            difficultySelectors.forEach(selector => {
                                const diffEl = row.querySelector(selector);
                                if (diffEl && !difficulty) {
                                    const diffText = diffEl.textContent?.toLowerCase() || '';
                                    const classList = diffEl.classList?.toString().toLowerCase() || '';

                                    if (diffText.includes('easy') || classList.includes('green')) {
                                        difficulty = 1;
                                    } else if (diffText.includes('medium') || classList.includes('yellow')) {
                                        difficulty = 2;
                                    } else if (diffText.includes('hard') || classList.includes('red')) {
                                        difficulty = 3;
                                    }
                                }
                            });

                            data[slug] = {
                                titleSlug: slug,
                                status: status,
                                difficulty: difficulty,
                                title: link.textContent.trim(),
                                _source: 'page_parse'
                            };

                        } catch (e) {
                        }
                    });

                    if (Object.keys(data).length > 0) {
                        return data;
                    }
                }
            }

            return null;
        }

        async extractFromLocalStorage() {
            try {
                const keys = Object.keys(localStorage);
                for (const key of keys) {
                    if (key.includes('leetcode') || key.includes('question')) {
                        try {
                            const value = JSON.parse(localStorage.getItem(key));
                            if (value && typeof value === 'object') {
                                if (value.questionData || value.questions || value.stat_status_pairs) {
                                }
                            }
                        } catch (e) {
                        }
                    }
                }
            } catch (e) {
            }
            return null;
        }

        saveProgressData(data) {
            GM_setValue(CONFIG.STORAGE_KEY, data);
            GM_setValue(CONFIG.LAST_SYNC_KEY, Date.now());
            console.log(`💾 保存了 ${Object.keys(data).length} 个题目的数据`);
        }

        clearCache() {
            GM_setValue(CONFIG.STORAGE_KEY, {});
            GM_setValue(CONFIG.LAST_SYNC_KEY, 0);
            this.updateSyncStats();
            this.showNotification('缓存已清除 / Cache Cleared', '所有同步数据已删除 / All sync data deleted', 'info');
        }

        updateSyncStats() {
            const data = GM_getValue(CONFIG.STORAGE_KEY, {});
            const lastSync = GM_getValue(CONFIG.LAST_SYNC_KEY, 0);

            const countEl = document.querySelector('#lc-sync-count');
            const timeEl = document.querySelector('#lc-last-sync');

            if (countEl) countEl.textContent = Object.keys(data).length;
            if (timeEl) {
                timeEl.textContent = lastSync ?
                    new Date(lastSync).toLocaleTimeString() : '未同步 / Not Synced';
            }
        }

        handleChineseSite() {
            setTimeout(() => {
                this.createChinesePanel();
                this.processPage();
                this.observeChanges();
            }, 1500);
        }

        createChinesePanel() {
            const data = GM_getValue(CONFIG.STORAGE_KEY, {});
            const panel = document.createElement('div');
            panel.className = 'lc-control-panel';
            panel.innerHTML = `
                <div class="lc-panel-header">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>📚</span>
                        <span>LeetCode Supporter / 题单助手</span>
                    </div>
                    <span class="lc-panel-toggle">▼</span>
                </div>
                <div class="lc-panel-content">
                    <div class="lc-stats">
                        <div class="lc-stat-item">
                            <div>✅ 已解决 / Solved</div>
                            <div id="lc-solved">0</div>
                        </div>
                        <div class="lc-stat-item">
                            <div>❌ 尝试中 / Attempted</div>
                            <div id="lc-attempted">0</div>
                        </div>
                        <div class="lc-stat-item">
                            <div>⭕ 未尝试 / Not Attempted</div>
                            <div id="lc-not-attempted">0</div>
                        </div>
                        <div class="lc-stat-item">
                            <div>📊 总题数 / Total</div>
                            <div id="lc-total">0</div>
                        </div>
                    </div>
                    <div class="lc-progress-bar">
                        <div class="lc-progress-fill" id="lc-progress"></div>
                    </div>
                    <button class="lc-button lc-button-secondary" id="lc-refresh-btn">
                        <span>🔄</span>
                        <span>刷新状态 / Refresh</span>
                    </button>
                    <div class="lc-settings">
                        <div class="lc-setting-item">
                            <span>显示难度 / Show Difficulty</span>
                            <div class="lc-switch ${this.settings.showDifficulty ? 'active' : ''}" data-setting="showDifficulty"></div>
                        </div>
                        <div class="lc-setting-item">
                            <span>隐藏已完成 / Hide Solved</span>
                            <div class="lc-switch ${this.settings.hideCompleted ? 'active' : ''}" data-setting="hideCompleted"></div>
                        </div>
                    </div>
                    ${Object.keys(data).length === 0 ? `
                        <div style="text-align: center; margin: 12px 0; font-size: 11px; color: #999;">
                            <div>⚠️ 未找到同步数据 / No sync data found</div>
                            <a href="https://leetcode.com/problemset/all/" target="_blank" style="color: #1890ff;">
                                前往国际站同步 / Go to LeetCode.com to sync
                            </a>
                        </div>
                    ` : ''}
                </div>
            `;

            document.body.appendChild(panel);
            this.bindChineseEvents(panel);

            this.addPanelToggle(panel);
        }

        bindChineseEvents(panel) {
            panel.querySelector('#lc-refresh-btn')?.addEventListener('click', () => {
                this.processPage();
                this.showNotification('已刷新 / Refreshed', '状态显示已更新 / Status display updated', 'info');
            });

            panel.querySelectorAll('.lc-switch').forEach(sw => {
                sw.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSetting(sw.dataset.setting, sw);
                });
            });
        }

        processPage() {
            const data = GM_getValue(CONFIG.STORAGE_KEY, {});

            if (Object.keys(data).length === 0) {
                return;
            }

            document.querySelectorAll('.lc-status-container').forEach(el => el.remove());

            document.querySelectorAll('.lc-hidden').forEach(el => {
                el.classList.remove('lc-hidden');
            });

            this.processLinks(data);
            this.updateStats();
        }

        processLinks(data) {
            const links = Array.from(document.querySelectorAll('a[href*="/problems/"]'));

            if (links.length === 0) {
                return;
            }

            let processed = 0;

            links.forEach(link => {
                if (this.processLink(link, data)) {
                    processed++;
                }
            });

            if (processed > 0) {
                this.updateStats();
            }
        }

        processLink(linkElement, data) {
            const originalHref = linkElement.href;

            if (!originalHref.includes('/problems/')) {
                return false;
            }

            const slug = this.extractProblemSlug(originalHref);
            if (!slug) return false;

            if (originalHref.includes('leetcode.cn')) {
                linkElement.href = originalHref.replace('leetcode.cn', 'leetcode.com');
                linkElement.target = '_blank';
            }
            linkElement.classList.add('lc-converted');

            const problemData = data[slug];
            const status = problemData?.status;

            this.addEnhancedBadges(linkElement, problemData);

            if (this.settings.hideCompleted && status === 'ac') {
                const parentElement = linkElement.closest('tr, div[role="row"], li, .question-item, .problem-item');
                if (parentElement) {
                    parentElement.classList.add('lc-hidden');
                }
            }

            return true;
        }

        addEnhancedBadges(linkElement, problemData) {
            const existingContainer = linkElement.parentNode.querySelector('.lc-status-container');
            if (existingContainer) {
                existingContainer.remove();
            }

            const container = document.createElement('div');
            container.className = 'lc-status-container';

            if (this.settings.showDifficulty) {
                const difficulty = problemData?.difficulty;

                if (difficulty && DIFFICULTY_MAP[difficulty]) {
                    const diffInfo = DIFFICULTY_MAP[difficulty];
                    const diffBadge = document.createElement('span');
                    diffBadge.className = 'lc-difficulty-badge';
                    diffBadge.textContent = diffInfo.text;
                    diffBadge.title = `难度: ${diffInfo.text}`;
                    diffBadge.style.backgroundColor = diffInfo.color;
                    diffBadge.style.color = 'white';

                    container.appendChild(diffBadge);
                }
            }

            const status = problemData?.status;
            const statusInfo = STATUS_MAP[status] || STATUS_MAP[null];

            const statusBadge = document.createElement('span');
            statusBadge.className = 'lc-status-badge';
            statusBadge.textContent = statusInfo.text;
            statusBadge.title = `状态: ${statusInfo.text} - ${problemData?.titleSlug || 'unknown'}`;
            statusBadge.style.backgroundColor = statusInfo.bgColor;
            statusBadge.style.color = statusInfo.color;
            statusBadge.style.borderColor = statusInfo.color;

            container.appendChild(statusBadge);

            linkElement.parentNode.insertBefore(container, linkElement);
        }

        updateStats() {
            const data = GM_getValue(CONFIG.STORAGE_KEY, {});
            const links = document.querySelectorAll('.lc-converted');

            this.stats = { total: 0, solved: 0, attempted: 0, notAttempted: 0 };

            links.forEach(link => {
                const slug = this.extractProblemSlug(link.href);
                const problemData = data[slug];
                if (problemData) {
                    this.stats.total++;
                    if (problemData.status === 'ac') {
                        this.stats.solved++;
                    } else if (problemData.status === 'notac') {
                        this.stats.attempted++;
                    } else {
                        this.stats.notAttempted++;
                    }
                }
            });

            const solvedEl = document.querySelector('#lc-solved');
            const attemptedEl = document.querySelector('#lc-attempted');
            const notAttemptedEl = document.querySelector('#lc-not-attempted');
            const totalEl = document.querySelector('#lc-total');
            const progressEl = document.querySelector('#lc-progress');

            if (solvedEl) solvedEl.textContent = this.stats.solved;
            if (attemptedEl) attemptedEl.textContent = this.stats.attempted;
            if (notAttemptedEl) notAttemptedEl.textContent = this.stats.notAttempted;
            if (totalEl) totalEl.textContent = this.stats.total;
            if (progressEl && this.stats.total > 0) {
                const percentage = (this.stats.solved / this.stats.total) * 100;
                progressEl.style.width = percentage + '%';
            }
        }

        observeChanges() {
            let isProcessing = false;

            const observer = new MutationObserver((mutations) => {
                if (isProcessing) return;

                let shouldProcess = false;

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList?.contains('lc-status-container') ||
                                node.classList?.contains('lc-control-panel') ||
                                node.classList?.contains('lc-notification') ||
                                node.closest?.('.lc-status-container, .lc-control-panel, .lc-notification')) {
                                return;
                            }

                            if (node.querySelector?.('a[href*="/problems/"]:not(.lc-converted)') ||
                                (node.matches?.('a[href*="/problems/"]') && !node.classList.contains('lc-converted'))) {
                                shouldProcess = true;
                            }
                        }
                    });
                });

                if (shouldProcess) {
                    isProcessing = true;
                    setTimeout(() => {
                        this.processPage();
                        isProcessing = false;
                    }, 1000);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        extractProblemSlug(url) {
            const match = url.match(/\/problems\/([^\/\?]+)/);
            return match ? match[1] : null;
        }

        toggleSetting(key, switchEl) {
            this.settings[key] = !this.settings[key];
            switchEl.classList.toggle('active', this.settings[key]);
            GM_setValue(CONFIG.SETTINGS_KEY, this.settings);

            if (key === 'showDifficulty' || key === 'hideCompleted') {
                this.processPage();
            }

            const settingMessages = {
                'showDifficulty': {
                    on: '显示难度 / Show Difficulty',
                    off: '隐藏难度 / Hide Difficulty'
                },
                'hideCompleted': {
                    on: '隐藏已完成 / Hide Solved',
                    off: '显示已完成 / Show Solved'
                },
                'autoSync': {
                    on: '自动同步 / Auto Sync',
                    off: '手动同步 / Manual Sync'
                }
            };

            const message = settingMessages[key];
            if (message) {
                const statusText = this.settings[key] ? message.on : message.off;
                this.showNotification('设置已更新 / Settings Updated', statusText, 'info');
            }
        }

        showNotification(title, message, type = 'info') {
            const colors = {
                success: '#52c41a',
                error: '#ff4d4f',
                info: '#1890ff',
                warning: '#faad14'
            };

            const notification = document.createElement('div');
            notification.className = 'lc-notification';
            notification.style.borderLeftColor = colors[type];
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 12px; color: #666;">${message}</div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        addPanelToggle(panel) {
            const header = panel.querySelector('.lc-panel-header');
            const toggle = panel.querySelector('.lc-panel-toggle');

            const isCollapsed = GM_getValue('panel_collapsed', false);
            if (isCollapsed) {
                panel.classList.add('collapsed');
                toggle.classList.add('collapsed');
            }

            header.addEventListener('click', () => {
                const collapsed = panel.classList.toggle('collapsed');
                toggle.classList.toggle('collapsed', collapsed);

                GM_setValue('panel_collapsed', collapsed);
            });
        }

        initHotkeys() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                    e.preventDefault();
                    if (this.isInternational) {
                        this.syncProgress();
                    } else {
                        this.processPage();
                    }
                }

                if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                    e.preventDefault();
                    if (this.isChinese) {
                        const switchEl = document.querySelector('[data-setting="hideCompleted"]');
                        if (switchEl) {
                            this.toggleSetting('hideCompleted', switchEl);
                        }
                    }
                }
            });
        }
    }

    function initialize() {
        const app = new LeetCodeUltimate();

        app.initHotkeys();

        const lastVersion = GM_getValue('last_version', '');
        if (lastVersion !== CONFIG.VERSION) {
            GM_setValue('last_version', CONFIG.VERSION);
            if (lastVersion) {
                app.showNotification(
                    '更新完成！',
                    `LeetCode题单助手已更新到 v${CONFIG.VERSION}`,
                    'success'
                );
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 500);
    }

})();