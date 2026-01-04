// ==UserScript==
// @name         Google AI Studio 全面翻译
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  翻译 Google AI Studio 页面上的多个特定文本部分，包括左侧导航栏和工具提示
// @author       YourName
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547628/Google%20AI%20Studio%20%E5%85%A8%E9%9D%A2%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/547628/Google%20AI%20Studio%20%E5%85%A8%E9%9D%A2%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 集中所有需要翻译的文本和它们的定位器
    const translations = [
        // --- 核心页面内容翻译 ---
        // 模型选择器部分
        {
            original: 'Gemini 2.5 Flash',
            translated: 'Gemini 2.5 闪电版',
            selector: 'button.model-selector-card span.title'
        },
        {
            original: 'Our first hybrid reasoning model which supports a 1M token context window and has thinking budgets.',
            translated: '我们首个支持 100 万 token 上下文窗口并具有思维预算的混合推理模型。',
            selector: 'button.model-selector-card span[data-test-id="model-description"]'
        },

        // Token count
        {
            original: 'Token count',
            translated: 'Token 计数',
            selector: 'ms-token-count h3.v3-font-body'
        },

        // Temperature
        {
            original: 'Temperature',
            translated: '温度',
            selector: 'div[data-test-id="temperatureSliderContainer"] h3.v3-font-body'
        },

        // Media resolution
        {
            original: 'Media resolution',
            translated: '媒体分辨率',
            selector: 'div.media-resolution-selector h3.v3-font-body'
        },

        // Thinking section
        {
            original: 'Thinking',
            translated: '思考',
            selector: 'ms-thinking-budget-setting h3.thinking-group-title'
        },
        {
            original: 'Thinking mode',
            translated: '思考模式',
            selector: 'ms-thinking-budget-setting p.v3-font-body'
        },

        // Tools group header
        {
            original: 'Tools',
            translated: '工具',
            selector: 'div.settings-group-header p.group-title'
        },

        // Structured output
        {
            original: 'Structured output',
            translated: '结构化输出',
            selector: 'div[data-test-id="structuredOutputTooltip"] h3.v3-font-body'
        },
        {
            original: 'Edit', // Structured output旁边的Edit按钮
            translated: '编辑',
            selector: 'div[data-test-id="structuredOutputTooltip"] button.ms-button-borderless'
        },

        // Code execution
        {
            original: 'Code execution',
            translated: '代码执行',
            selector: 'div[data-test-id="codeExecutionTooltip"] h3.v3-font-body'
        },

        // Function calling
        {
            original: 'Function calling',
            translated: '函数调用',
            selector: 'div[data-test-id="functionCallingTooltip"] h3.v3-font-body'
        },
        {
            original: 'Edit', // Function calling旁边的Edit按钮
            translated: '编辑',
            selector: 'div[data-test-id="functionCallingTooltip"] button.edit-function-declarations-button'
        },

        // Grounding with Google Search
        {
            original: 'Grounding with Google Search',
            translated: '使用 Google 搜索进行接地',
            selector: 'div[data-test-id="searchAsAToolTooltip"] h3.v3-font-body'
        },

        // URL context
        {
            original: 'URL context',
            translated: 'URL 上下文',
            selector: 'div[data-test-id="browseAsAToolTooltip"] h3.v3-font-body'
        },
        {
            original: 'Default',
            translated: '默认',
            selector: 'span.mdc-list-item__primary-text'
        },
                {
            original: 'Medium',
            translated: '中等',
            selector: 'span.mdc-list-item__primary-text'
        },
                {
            original: 'Low',
            translated: '低等',
            selector: 'span.mdc-list-item__primary-text'
        },
        {
            original: 'Medium',
            translated: '中等',
            selector: '.mat-mdc-select-value-text.ng-star-inserted'
        },
             {
            original: 'Default',
            translated: '默认',
            selector: '.mat-mdc-select-value-text.ng-star-inserted'
        },
             {
            original: 'Low',
            translated: '低等',
            selector: '.mat-mdc-select-value-text.ng-star-inserted'
        },
        // Advanced settings group header
        {
            original: 'Advanced settings',
            translated: '高级设置',
            selector: 'div.settings-item.settings-group-header.expanded p.group-title'
        },

        // Safety settings
        {
            original: 'Safety settings',
            translated: '安全设置',
            selector: 'div.settings-item.safety-settings h3.v3-font-body'
        },
        {
            original: 'Edit', // Safety settings旁边的Edit按钮
            translated: '编辑',
            selector: 'div.settings-item.safety-settings button.edit-safety-button'
        },

        // Output length
        {
            original: 'Output length',
            translated: '输出长度',
            selector: 'div.settings-item.output-length h3.v3-font-body'
        },
        {
            original: 'Add stop sequence',
            translated: '添加停止序列',
            selector: 'ms-stop-sequence-input label[for="chip-input"]'
        },
        {
            original: 'Add stop...',
            translated: '添加停止符...',
            selector: 'ms-stop-sequence-input input#chip-input[placeholder="Add stop..."]',
            attribute: 'placeholder'
        },
        {
            original: 'Top P',
            translated: 'Top P (概率阈值)',
            selector: 'div.settings-item-column.ng-star-inserted h3.v3-font-body' // 注意此选择器仍可能不够精确，如果误伤请再次提供上下文
        },
        {
            original: 'Top P set of tokens to consider during generation.',
            translated: '在生成过程中考虑的 Top P token 集合。',
            selector: 'ms-slider[title="Top P set of tokens to consider during generation."]',
            attribute: 'title'
        },

        // --- 工具提示翻译 ---
        // 这些通过ID定位的div是隐藏的，其innerText通常是用于aria-describedby或作为tooltip的内容源。
        // 翻译它们理论上会影响最终显示的tooltip内容。
        { original: 'Expand prompts history', translated: '展开提示历史', selector: '#cdk-describedby-message-ng-1-2' },
        { original: 'Marc Data Import and Export', translated: 'MARC 数据导入导出', selector: '#cdk-describedby-message-ng-1-3' },
        { original: 'More options', translated: '更多选项', selector: '#cdk-describedby-message-ng-1-4' },
        { original: 'Rerun', translated: '重新运行', selector: '#cdk-describedby-message-ng-1-5' },
        { original: 'Select or upload a file on Google Drive to include in your prompt', translated: '选择或上传 Google 云端硬盘文件以包含在提示中', selector: '#cdk-describedby-message-ng-1-6' },
        { original: 'Upload a file to Google Drive to include in your prompt', translated: '上传文件到 Google 云端硬盘以包含在提示中', selector: '#cdk-describedby-message-ng-1-7' },
        { original: 'Insert assets such as images, videos, folders, files, or audio', translated: '插入图片、视频、文件夹、文件或音频等资产', selector: '#cdk-describedby-message-ng-1-8' },
        { original: 'Run prompt', translated: '运行提示', selector: '#cdk-describedby-message-ng-1-9' },
        { original: 'Get SDK code to chat with Gemini', translated: '获取 SDK 代码与 Gemini 聊天', selector: '#cdk-describedby-message-ng-1-10' },
        { original: 'Higher resolutions may provide better understanding but use more tokens.', translated: '更高的分辨率可能提供更好的理解，但会使用更多的 Token。', selector: '#cdk-describedby-message-ng-1-11' },
        { original: 'Enable or disable thinking for responses', translated: '启用或禁用响应的思考功能', selector: '#cdk-describedby-message-ng-1-12' },
        { original: 'Generate structured output\n\n This tool is not compatible with the current active tools.', translated: '生成结构化输出\n\n此工具与当前激活的工具不兼容。', selector: '#cdk-describedby-message-ng-1-13' },
        { original: 'Lets Gemini use code to solve complex tasks', translated: '让 Gemini 使用代码解决复杂任务', selector: '#cdk-describedby-message-ng-1-14' },
        { original: 'Lets you define functions that Gemini can call\n\n This tool is not compatible with the current active tools.', translated: '允许你定义 Gemini 可以调用的函数\n\n此工具与当前激活的工具不兼容。', selector: '#cdk-describedby-message-ng-1-15' },
        { original: 'Use Google Search', translated: '使用 Google 搜索', selector: '#cdk-describedby-message-ng-1-16' },
        { original: 'Browse the url context', translated: '浏览 URL 上下文', selector: '#cdk-describedby-message-ng-1-17' },
        { original: 'Adjust harmful response settings', translated: '调整有害响应设置', selector: '#cdk-describedby-message-ng-1-18' },
        { original: 'Probability threshold for top-p sampling', translated: 'Top P 采样概率阈值', selector: '#cdk-describedby-message-ng-1-19' },
        { original: 'Truncate response including and after string', translated: '截断响应，包含并去除指定字符串及之后的内容', selector: '#cdk-describedby-message-ng-1-20' },
        { original: 'Maximum number of tokens in response', translated: '响应的最大 Token 数量', selector: '#cdk-describedby-message-ng-1-21' },
        { original: 'Creativity allowed in the responses', translated: '响应的创造性等级', selector: '#cdk-describedby-message-ng-1-22' },
        { original: 'System Instructions', translated: '系统指令', selector: '#cdk-describedby-message-ng-1-23' },
        { original: 'Show conversation without markdown formatting', translated: '显示不带 Markdown 格式的对话', selector: '#cdk-describedby-message-ng-1-24' },
        { original: 'Share Prompt', translated: '分享提示', selector: '#cdk-describedby-message-ng-1-25' },
        { original: 'Compare mode', translated: '比较模式', selector: '#cdk-describedby-message-ng-1-26' },
        { original: 'Edit title and description', translated: '编辑标题和描述', selector: '#cdk-describedby-message-ng-1-27' },
        { original: 'Download', translated: '下载', selector: '#cdk-describedby-message-ng-1-28' },
        { original: 'Copy to clipboard', translated: '复制到剪贴板', selector: '#cdk-describedby-message-ng-1-29' },
        { original: 'Collapse code snippet', translated: '折叠代码片段', selector: '#cdk-describedby-message-ng-1-30' },
        { original: 'API pricing per 1M tokens. Usage in AI Studio UI is free of charge', translated: '每百万 Token 的 API 定价。AI Studio UI 中的使用免费。', selector: '#cdk-describedby-message-ng-1-31' },
        { original: 'Developer docs', translated: '开发者文档', selector: '#cdk-describedby-message-ng-1-32' },

        // --- 左侧导航栏翻译 (新增部分) ---
        {
            original: 'Studio',
            translated: '工作室',
            selector: 'mat-expansion-panel-header:has(mat-panel-title:contains("Studio")) mat-panel-title' // 更精确的Studio面板标题
        },
        {
            original: 'Chat',
            translated: '聊天',
            selector: 'a[href="/prompts/new_chat"] span.ng-trigger.ng-trigger-fadeInOut'
        },
        {
            original: 'Stream',
            translated: '流式输出',
            selector: 'a[href="/live"] span.ng-trigger.ng-trigger-fadeInOut'
        },
        {
            original: 'Generate media',
            translated: '生成媒体',
            selector: 'a[href="/gen-media"] span.ng-trigger.ng-trigger-fadeInOut'
        },
        {
            original: 'Build',
            translated: '构建',
            selector: 'a[href="/apps"] span.ng-trigger.ng-trigger-fadeInOut'
        },
        {
            original: 'History',
            translated: '历史记录',
            selector: 'a[href="/library"] span.title-label'
        },
        // 注意：历史记录列表项 "言之有话_前段" 等是用户输入，通常不翻译。
        // "Marc Data Import and Export" 在历史记录中重复，如果它只出现一次，可以翻译。
        // 但如果它也代表用户历史，最好不翻译。此处假设你需要翻译此特定链接文本。
        {
            original: 'Marc Data Import and Export',
            translated: 'MARC 数据导入导出 (历史)',
            selector: 'li[aria-describedby="cdk-describedby-message-ng-1-3"] a.prompt-link'
        },


        {
            original: 'Dashboard',
            translated: '仪表盘',
            selector: 'mat-expansion-panel-header:has(mat-panel-title:contains("Dashboard")) mat-panel-title' // 更精确的Dashboard面板标题
        },
        {
            original: 'API keys',
            translated: 'API 密钥',
            selector: 'a[href="/apikey"] span.ng-trigger.ng-trigger-fadeInOut'
        },
        {
            original: 'Usage & Billing',
            translated: '使用情况与计费',
            selector: 'a[href="/usage"] span.ng-trigger.ng-trigger-fadeInOut'
        },
        {
            original: 'Changelog',
            translated: '更新日志',
            selector: 'a[href="https://ai.google.dev/gemini-api/docs/changelog"] div.ng-trigger.ng-trigger-fadeInOut'
        },
        {
            original: 'Documentation',
            translated: '文档',
            selector: 'a[href="https://ai.google.dev/gemini-api/docs"].documentation-link' // 链接文本
        },

        // 底部动作和免责声明
        {
            original: 'Google AI models may make mistakes, so double-check outputs.',
            translated: 'Google AI 模型可能会出错，请仔细核对输出结果。',
            selector: 'ms-navbar-disclaimer div.disclaimer'
        },
        {
            original: 'Get API key',
            translated: '获取 API 密钥',
            selector: 'ms-api-key-button button[aria-label="Get API key"] span.v3-font-body'
        },
        {
            original: 'Settings',
            translated: '设置',
            selector: 'ms-settings-menu button[data-test-id="settings-menu"]'
        },
        {
            original: 'zhu261010@gmail.com', // 替换为你的邮箱
            translated: '你的邮箱 (已翻译)', // 如果你不想显示邮箱，可以替换为“我的账户”等
            selector: 'button.account-switcher-button span.account-switcher-text'
        },
        // 如果想翻译账户切换按钮的 aria-label
        {
            original: 'Google 账号：嘉（logolo） (zhu261010@gmail.com)',
            translated: 'Google 账号：嘉（logolo） (已翻译)', // 或者替换为 "我的 Google 账号"
            selector: '#account-switcher-button.container div.button-container',
            attribute: 'aria-label'
        },
    ];

    // 翻译页面的核心函数
    function applyTranslations() {
        let changesMade = false; // 标记是否有元素被翻译

        translations.forEach(item => {
            // 使用 try-catch 捕获选择器可能导致的错误
            try {
                let elements = document.querySelectorAll(item.selector);

                elements.forEach(element => {
                    // 处理 attribute 翻译 (placeholder, title, aria-label, alt 等)
                    if (item.attribute) {
                        const currentAttrValue = element.getAttribute(item.attribute);
                        if (currentAttrValue && currentAttrValue.trim() === item.original) {
                            element.setAttribute(item.attribute, item.translated);
                            changesMade = true;
                        }
                    }
                    // 默认处理 innerText 翻译
                    else {
                        if (element.innerText && element.innerText.trim() === item.original) {
                            element.innerText = item.translated;
                            changesMade = true;
                        }
                    }
                });
            } catch (error) {
                // console.error(`选择器 "${item.selector}" 出现错误:`, error);
                // 不打印错误消息
            }
        });
        return changesMade;
    }

    // --- 执行翻译的策略 ---

    // 1. 在 DOMContentLoaded 事件触发时尝试翻译
    document.addEventListener('DOMContentLoaded', applyTranslations);

    // 2. 延迟执行：对于单页应用，内容可能动态加载，延迟一段时间再次尝试
    setTimeout(applyTranslations, 1000); // 延迟 1 秒后再次尝试

    // 3. MutationObserver：监听DOM变化，当新内容加载或DOM结构变化时再次尝试翻译
    const observer = new MutationObserver((mutationsList, observer) => {
        applyTranslations();
    });

    // 监听整个 body 元素及其所有后代元素的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });

})();