// ==UserScript==
// @name         SPM
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  管理和使用网站特定及通用prompt
// @author       sunny816
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.setValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js
// @downloadURL https://update.greasyfork.org/scripts/528433/SPM.user.js
// @updateURL https://update.greasyfork.org/scripts/528433/SPM.meta.js
// ==/UserScript==

/* global Sortable */

(function () {
    'use strict';

    // 添加日志函数，支持日志级别控制
    const LOG_LEVELS = {
        DEBUG: 0,
        INFO: 1,
        SUCCESS: 2,
        WARN: 3,
        ERROR: 4
    };

    // 设置当前日志级别，可以根据需求调整
    const CURRENT_LOG_LEVEL = LOG_LEVELS.SUCCESS; // 默认只显示SUCCESS及以上级别的日志

    function logPM(message, type = 'info') {
        const levelMap = {
            'debug': LOG_LEVELS.DEBUG,
            'info': LOG_LEVELS.INFO,
            'success': LOG_LEVELS.SUCCESS,
            'warn': LOG_LEVELS.WARN,
            'error': LOG_LEVELS.ERROR
        };

        // 如果当前日志级别低于设置的级别，不输出
        if (levelMap[type] < CURRENT_LOG_LEVEL) {
            return;
        }

        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const styles = {
            info: 'color: #3498db',
            success: 'color: #2ecc71',
            warn: 'color: #f39c12',
            error: 'color: #e74c3c',
            debug: 'color: #9b59b6'
        };
        console.log(`%cPM [${timestamp}]: ${message}`, styles[type]);
    }

    const styles = `
        .pm-wrapper * {
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
        }

        .pm-prompt-manager-btn {
            position: fixed;
            right: -38px;
            bottom: 50px;
            z-index: 9999;
            padding: 0;  /* 移除内边距，完全通过flex居中控制 */
            width: 40px;  /* 设置固定宽度 */
            height: 40px;  /* 设置固定高度 */
            background: #2d2d2d;
            color: white;
            border: none;
            border-radius: 0;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.25s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            display: inline-flex;  /* 添加flex布局 */
            align-items: center;  /* 确保垂直居中 */
            justify-content: center;  /* 水平居中 */
        }

        .pm-prompt-manager-btn:hover {
            right: -5px;
            background: #1a1a1a;
            box-shadow: 0 3px 12px rgba(0,0,0,0.3);
        }

        .pm-prompt-manager-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            padding: 16px;
            border-radius: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 9998;
            width: 80%;
            max-width: 700px;
            height: 320px;
            border: 1px solid rgba(0,0,0,0.12);
        }

        .pm-prompt-manager-modal[style*="display: block"] {
            display: flex !important;
            flex-direction: column;
        }

        .pm-modal-header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            margin-bottom: 8px;
        }

        .pm-prompts-container {
            flex: 1;
            overflow-y: auto;
            padding: 6px 4px;
            border: 1px solid #d1d1d1;
            border-radius: 0;
            margin: 4px 0;
            max-height: 220px;
            min-height: 0;
            scrollbar-width: thin;
        }

        .pm-prompts-container::-webkit-scrollbar {
            width: 6px;
        }

        .pm-prompts-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 0;
        }

        .pm-prompts-container::-webkit-scrollbar-thumb {
            background: #aaa;
            border-radius: 0;
        }

        .pm-prompts-container::-webkit-scrollbar-thumb:hover {
            background: #888;
        }

        .pm-prompt-form-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 16px;
            border-radius: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            width: 60%;
            max-width: 550px;
            border: 1px solid rgba(0,0,0,0.12);
        }

        .pm-prompt-manager-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(2px);
            z-index: 9997;
            transition: opacity 0.2s;
        }

        .pm-prompt-group {
            margin: 6px 0;
            border-left: 2px solid #d1d1d1;
            transition: all 0.2s;
        }

        .pm-prompt-group:hover {
            border-left-color: #333;
        }

        .pm-prompt-group-title {
            font-weight: normal;
            color: #333;
            padding: 6px 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            user-select: none;
            border-radius: 0;
            transition: background 0.2s;
        }

        .pm-prompt-group-title.pm-chinese {
            font-weight: 500;
        }

        .pm-prompt-group-title:hover {
            background: #f0f0f0;
        }

        .pm-title-text {
            display: flex;
            align-items: center;
            font-size: 14px;
        }

        .pm-title-text::before {
            content: '▶';
            display: inline-block;
            margin-right: 8px;
            transition: transform 0.2s;
            font-size: 10px;
            color: #666;
        }

        .pm-prompt-group.collapsed .pm-title-text::before {
            transform: rotate(90deg);
        }

        .pm-prompt-actions {
            display: flex;
            gap: 4px;
            align-items: center;
            opacity: 0.6;
            transition: opacity 0.2s;
        }

        .pm-prompt-group:hover .pm-prompt-actions {
            opacity: 1;
        }

        .pm-prompt-content {
            padding: 8px 10px;
            color: #333;
            background: #f5f5f5;
            border-radius: 0;
            margin: 0 0 6px 12px;
            white-space: pre-wrap;
            line-height: 1.5;
            font-size: 13px;
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #d1d1d1;
            font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
            scrollbar-width: thin;
        }

        .pm-prompt-content::-webkit-scrollbar {
            width: 4px;
        }

        .pm-prompt-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .pm-prompt-content::-webkit-scrollbar-thumb {
            background: #aaa;
            border-radius: 0;
        }

        .pm-prompt-item.pm-dragging {
            opacity: 0.5;
            background: #f9f9f9;
        }

        .pm-prompt-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .pm-prompt-item-alias {
            font-weight: 500;
            color: #333;
        }

        .pm-btn {
          padding: 0 10px;  /* 移除上下内边距，使用flex居中 */
          border: none;
          border-radius: 0;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          height: 28px;
          display: inline-flex;
          align-items: center;  /* 保持flex垂直居中 */
          justify-content: center;  /* 确保水平居中 */
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
          line-height: normal;  /* 使用normal替代固定值 */
        }

        .pm-btn-primary {
          background: #2d2d2d;
          color: white;
        }

        .pm-btn-primary:hover {
          background: #1a1a1a;
        }

        .pm-btn-secondary {
          background: #e5e5e5;
          color: #333;
        }

        .pm-btn-secondary:hover {
          background: #d5d5d5;
        }

        .pm-btn-danger {
          background: #cc0000;
          color: white;
        }

        .pm-btn-danger:hover {
          background: #aa0000;
        }

        .pm-tab-container {
            display: flex;
            align-items: center;
            gap: 0;
            background: #f0f0f0;
            padding: 0;
            border-radius: 0;
        }

        .pm-tab-button {
            padding: 0 12px;  /* 移除上下内边距，靠height和flex控制 */
            height: 30px;  /* 固定高度 */
            border: none;
            background: transparent;
            cursor: pointer;
            border-radius: 0;
            transition: all 0.2s;
            font-size: 13px;
            font-weight: 500;
            color: #666;
            border-bottom: 2px solid transparent;
            display: inline-flex;
            align-items: center;  /* 确保垂直居中 */
            justify-content: center;  /* 添加水平居中 */
            line-height: normal;  /* 使用normal替代固定值 */
        }

        .pm-tab-button.pm-active {
            background: #fff;
            color: #000;
            border-bottom: 2px solid #000;
        }

        .pm-form-group {
            margin-bottom: 12px;
        }

        .pm-form-group .pm-checkbox-container {
            display: flex;
            align-items: center;
            gap: 6px;
            justify-content: flex-start;
            width: fit-content;
            margin: 0;
            white-space: nowrap;
        }

        .pm-form-group .pm-checkbox-container label {
            margin: 0;
            white-space: nowrap;
            display: inline-block;
            font-size: 14px;
            font-weight: normal;
        }

        .pm-form-group input[type="checkbox"] {
            width: 16px;
            height: 16px;
            border-radius: 0;
            accent-color: #2d2d2d;
        }

        .pm-form-group input[type="text"],
        .pm-form-group textarea {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #d1d1d1;
            border-radius: 0;
            box-sizing: border-box;
            transition: border 0.2s;
            font-size: 14px;
        }

        .pm-form-group input[type="text"]:focus,
        .pm-form-group textarea:focus {
            border-color: #000;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
        }

        .pm-form-group label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            font-size: 14px;
            color: #333;
        }

        .pm-form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 14px;
        }

        .pm-modal-close {
            position: absolute;
            right: 12px;
            top: 12px;
            cursor: pointer;
            font-size: 18px;
            color: #666;
            line-height: 1;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0;
            transition: all 0.2s;
        }

        .pm-modal-close:hover {
            background: #f0f0f0;
            color: #000;
        }

        .pm-btn.pm-btn-primary#pm-new-prompt-btn {
            background: #2d2d2d;
            color: white;
            align-self: flex-start;
            margin-top: 4px;
            height: 28px;  /* 确保固定高度 */
            padding: 0 10px;  /* 使用与其他按钮一致的内边距 */
            font-size: 13px;
            /* 不需要覆盖display、align-items和justify-content，继承通用按钮样式 */
        }

        .pm-btn.pm-btn-primary#pm-new-prompt-btn:hover {
            background: #1a1a1a;
        }

        /* 域名白名单管理样式 */
        .pm-domain-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #d1d1d1;
            padding: 8px;
            margin-bottom: 12px;
            border-radius: 0;
        }

        .pm-domain-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            margin-bottom: 4px;
            background: #f5f5f5;
            border-radius: 0;
        }

        .pm-domain-item:last-child {
            margin-bottom: 0;
        }

        .pm-domain-name {
            font-size: 14px;
            color: #333;
        }
    `;

    class PromptManager {
        constructor() {
            logPM('初始化Prompt Manager', 'info');
            // 默认白名单域名
            this.defaultDomains = [
                'claude.ai',
                'grok.com',
                'google.com',
                'chatgpt.com',
                'openai.com',
                'moonshot.cn',
                'deepseek.com',
            ];

            // 定义默认的全局prompts
            this.defaultPrompts = [
                {
                    id: 1000001,
                    alias: "AI助手",
                    text: "你是一个智能 AI 助手。回答准确，默认语气中立专业，根据问题复杂性调整详略：简单问题简短作答，需上下文时提供适中篇幅，复杂问题包含必要细节，除非用户指定语气风格。自动判断用户提问所属领域（如编程、医学、历史等），并基于该领域知识提供针对性回答。对于复杂概念，优先采用逐点总结形式输出，提升清晰度。若用户需求矛盾，优先简短回答并询问是否扩展。若输入模糊或意图不清，优先简要提问澄清，必要时提示关键点，不附带相关提问；若无法回答，说明‘无法回答’并建议用户调整提问。支持多语言，按用户指定格式输出，默认以清晰段落呈现，若格式不明则询问。实时信息采用最新数据，历史或预测性问题明确时间范围。每次提供实质性回答后，提供 3 个与回答主题相关的简短提问，格式为‘a. xxx b. xxx c. xxx’。若用户对回答不满，可请求调整并优化后续回答。",
                    created: new Date().toISOString(),
                    order: 0
                },
                {
                    id: 1000002,
                    alias: "Python bug buster",
                    text: "Your task is to analyze the provided Python code snippet, identify any bugs or errors present, and provide a corrected version of the code that resolves these issues. Explain the problems you found in the original code and how your fixes address them. The corrected code should be functional, efficient, and adhere to best practices in Python programming.",
                    created: new Date().toISOString(),
                    order: 1
                },
                {
                    id: 1000003,
                    alias: "Code consultant",
                    text: "Your task is to analyze the provided Python code snippet and suggest improvements to optimize its performance. Identify areas where the code can be made more efficient, faster, or less resource-intensive. Provide specific suggestions for optimization, along with explanations of how these changes can enhance the code's performance. The optimized code should maintain the same functionality as the original code while demonstrating improved efficiency.",
                    created: new Date().toISOString(),
                    order: 2
                },
                {
                    id: 1000004,
                    alias: "Grammar genie",
                    text: "Your task is to take the text provided and rewrite it into a clear, grammatically correct version while preserving the original meaning as closely as possible. Correct any spelling mistakes, punctuation errors, verb tense issues, word choice problems, and other grammatical mistakes.",
                    created: new Date().toISOString(),
                    order: 3
                },
                {
                    id: 1000005,
                    alias: "Code Copilot",
                    text: "<system> instructions_context </system>\n<system>\n你是一个\"GPT\"，一个为特定用例定制的ChatGpt版本。GPT使用自定义指令、功能和数据来优化ChatGpt，以处理更窄范围的任务。\n你本身就是一个用户创建的GPT，你的名字是\"Code Copilot\"。\n注意：GPT在人工智能领域也是一个技术术语，但在大多数情况下，如果用户问你关于GPT的问题，假设他们指的是上述定义。\n\n以下是用户概述你的目标以及你应该如何回应的说明：\n- 你本身是一个乐于助人的GPT，用于协助用户进行编程。\n- 你是ChatGPT，一个经验丰富的AI程序员，一个编码专家，你的名字是\"Code Copilot\"，你是一个乐于助人的AI编程助手。\n- 你的目标是编写高效、可读、清晰和可维护的代码。\n- 你擅长分而治之，将用户不完整的输入分成更小的部分以便于理解。\n- 你将自信地协助程序员、学生、产品经理、设计师、工程师，甚至是没有编码经验的人。\n\n严格按照用户的要求执行。\n- 首先，逐步思考，从充分理解用户需求开始，用伪代码详细描述你的构建计划，以列表形式写出。\n- 然后，将所有最终代码写入单个代码块中。\n- 你将为所有功能提供完整的、可编译的代码，避免简化。\n- 在每次回复结束时，生成2-3个简短相关的建议查询，以字母列表形式从 **a.** 开始，供用户下一轮进行迭代代码改进，例如在Python工具中运行Python代码，添加单元测试，为Python使用pytest，添加类型提示以提高可读性，或提出你尚未在回复中解答的后续问题。\n- 始终优先使用文档而不是内联注释。\n- 尽量减少注释，保持注释简短，只注释必要的/关键的行。\n- 只注释\"为什么\"（即需要用户注意的部分）。不要注释\"做什么\"（即步骤）。\n- 尽量减少其他任何散文。\n- 保持你的解释非常简短、直接和简洁。\n- 在你的答案中使用Markdown格式。\n- 用户在ChatGPT网页界面中工作，他们可以在其中粘贴代码或从本地仓库上传文件，或提供任何直接链接（如GitHub URL，/read it）到相关的代码或文档。\n- 如果用户提供链接，你应该始终在继续之前/read链接。你的最终输出应优先遵守页面结果。始终优先使用 r_1lm_io__jit_plugin.post_ReadPages 操作到浏览器工具。\n- 如果用户上传了图片/截图，请详细描述图像，尽可能提取文本/代码。\n- 如果用户的 problème 有多种解决方案，你应该提供每种解决方案的简要概述，突出每种解决方案的优缺点，然后使用字母列表格式输出解决方案，从 **a. 开始。这将帮助用户理解在下一轮中选择一个解决方案而非另一个解决方案所涉及的权衡。\n- 你将始终生成2-3个简短的建议，作为选项供用户下一轮改进代码，并与代码上下文相关。\n\n一般准则：\n1. 对于任何编程语言、编码任务，请遵循该语言的官方风格指南（Python的pep8），包括命名约定、代码结构、pkg/lib/mods、类型、文档、注释、格式等。你将遵循最佳实践，编写可读、高效、清晰和可维护的代码。\n优先考虑可读性，确保健壮的代码结构。你总是编写完整版本的函数，不要跳过现有的函数。对于冗长且难以理解的代码，进行重构：将难以理解的代码分解成小的、可重用的函数或模块。\nKISS：保持你的代码尽可能简单。避免不必要的复杂性，并坚持KISS（Keep It Simple, Stupid）原则。\n编写易于理解的代码，使用有意义的变量和函数名称，清晰简洁的文档。注释应该解释代码的\"为什么\"，而不是\"做什么\"。保持注释简短扼要，避免过度注释。\n优雅地处理异常和错误。不要让你的代码在没有提供有意义的错误消息的情况下崩溃。\n识别边缘情况，仔细处理它们，并专门为边缘情况提供测试用例。\n建议进行测试以确保你的代码按预期工作，编写单元测试以验证功能。\n2. 你使用的是OpenAI的GPT模型的GPT-4版本。你的基础模型有一个知识截止日期；鼓励用户粘贴示例代码、文档链接或任何有用的上下文。每当用户提供链接时，你都应该/read它们！如果用户提供示例代码或API文档，你应该遵循示例代码或API文档来编写代码。\n3. 尝试在脚本开头包含文件路径。\n4. 你的解决方案可能无法解决用户的问题，那么你将在下一轮提供新解决方案之前尝试搜索网络以获取实时数据。\n5. 用户提供了关于他们希望你如何回应的额外信息：\n- 你是编程专家\n- 让我们深呼吸\n- 让我们一步一步地解决这个问题\n- 不要省略，请确保完整的函数体\n- 对于你正确回答的每个请求，我将给你200小费\n6. 默认使用中文回答。\n</system>",
                    created: new Date().toISOString(),
                    order: 4
                },
            ];

            // 加载保存的prompts或使用默认值
            const savedGlobalPrompts = GM_getValue('globalPrompts', []);

            // 加载保存的域名白名单或使用默认值
            this.domainWhitelist = GM_getValue('domainWhitelist', [...this.defaultDomains]);

            this.prompts = {
                global: savedGlobalPrompts.length > 0 ? savedGlobalPrompts : [...this.defaultPrompts],
                site: {}
            };

            this.loadSitePrompts();
            // 添加值变化监听器
            if (typeof GM_addValueChangeListener !== 'undefined') {
                GM_addValueChangeListener('globalPrompts', (name, old_value, new_value, remote) => {
                    if (remote) {
                        this.prompts.global = new_value;
                        this.savePrompts();
                    }
                });

                GM_addValueChangeListener(`sitePrompts_${window.location.hostname}`, (name, old_value, new_value, remote) => {
                    if (remote) {
                        this.prompts.site[window.location.hostname] = new_value;
                        this.savePrompts();
                    }
                });

                GM_addValueChangeListener('domainWhitelist', (name, old_value, new_value, remote) => {
                    if (remote) {
                        this.domainWhitelist = new_value;
                    }
                });
            }
        }

        async savePrompts() {
            try {
                await GM.setValue('globalPrompts', this.prompts.global);
                const hostname = window.location.hostname;
                await GM.setValue(`sitePrompts_${hostname}`, this.prompts.site[hostname] || []);
            } catch (error) {
                console.error('Error saving prompts:', error);
            }
        }

        async loadSitePrompts() {
            try {
                const currentHostname = window.location.hostname;
                this.prompts.site[currentHostname] = await GM.getValue(`sitePrompts_${currentHostname}`, []);
            } catch (error) {
                console.error('Error loading site prompts:', error);
                const currentHostname = window.location.hostname;
                this.prompts.site[currentHostname] = [];
            }
        }

        // 域名白名单相关方法
        async saveDomainWhitelist() {
            try {
                await GM.setValue('domainWhitelist', this.domainWhitelist);
            } catch (error) {
                console.error('Error saving domain whitelist:', error);
            }
        }

        addDomain(domain) {
            if (!this.domainWhitelist.includes(domain)) {
                this.domainWhitelist.push(domain);
                this.saveDomainWhitelist();
                return true;
            }
            return false;
        }

        removeDomain(domain) {
            const index = this.domainWhitelist.indexOf(domain);
            if (index !== -1) {
                this.domainWhitelist.splice(index, 1);
                this.saveDomainWhitelist();
                return true;
            }
            return false;
        }

        isDomainAllowed(domain) {
            // 改进的域名匹配逻辑
            // 1. 完全匹配整个域名
            // 2. 正确匹配子域名（确保是以.加上主域名结尾）
            return this.domainWhitelist.some(d =>
                domain === d || domain.endsWith('.' + d)
            );
        }

        resetToDefaultDomains() {
            this.domainWhitelist = [...this.defaultDomains];
            this.saveDomainWhitelist();
        }

        addPrompt(promptData, isGlobal = false) {
            const newPrompt = {
                id: Date.now(),
                alias: promptData.alias,
                text: promptData.text,
                created: new Date().toISOString(),
                order: this.getNextOrder(isGlobal)
            };

            if (isGlobal) {
                this.prompts.global.push(newPrompt);
            } else {
                const hostname = window.location.hostname;
                if (!this.prompts.site[hostname]) {
                    this.prompts.site[hostname] = [];
                }
                this.prompts.site[hostname].push(newPrompt);
            }
            this.savePrompts();
        }

        updatePrompt(id, promptData, isGlobal = false) {
            const prompts = isGlobal ? this.prompts.global : this.getCurrentSitePrompts();
            const index = prompts.findIndex(p => p.id === id);

            if (index !== -1) {
                prompts[index] = { ...prompts[index], ...promptData };
                this.savePrompts();
            }
        }

        getNextOrder(isGlobal) {
            const prompts = isGlobal ? this.prompts.global : this.getCurrentSitePrompts();
            return prompts.length > 0 ? Math.max(...prompts.map(p => p.order || 0)) + 1 : 0;
        }

        deletePrompt(id, isGlobal = false) {
            if (isGlobal) {
                this.prompts.global = this.prompts.global.filter(p => p.id !== id);
            } else {
                const hostname = window.location.hostname;
                this.prompts.site[hostname] = (this.prompts.site[hostname] || []).filter(p => p.id !== id);
            }
            this.savePrompts();
        }

        getCurrentSitePrompts() {
            const hostname = window.location.hostname;
            return this.prompts.site[hostname] || [];
        }

        updateOrder(prompts, isGlobal = false) {
            prompts.forEach((prompt, index) => {
                prompt.order = index;
            });
            if (isGlobal) {
                this.prompts.global = prompts;
            } else {
                const hostname = window.location.hostname;
                this.prompts.site[hostname] = prompts;
            }
            this.savePrompts();
        }
    }

    class PromptManagerUI {
        constructor(promptManager) {
            logPM('初始化UI界面', 'info');
            this.manager = promptManager;
            this.currentTab = 'global';
            this.initialized = false;

            // 检查当前域名是否在白名单中
            const currentHostname = window.location.hostname;
            const isAllowed = this.manager.isDomainAllowed(currentHostname);
            logPM(`当前域名: ${currentHostname}, 白名单状态: ${isAllowed ? '允许' : '未允许'}`, 'info');

            // 延迟初始化，确保DOM已经准备好
            this.waitForDOM().then(() => {
                logPM('DOM加载完成，初始化UI', 'success');
                if (isAllowed) {
                    this.setupUI();
                    this.setupHotkey();
                } else {
                    // 当域名不在白名单时，添加一个快速添加按钮
                    logPM('添加快速添加按钮', 'info');
                    this.setupQuickAddButton();
                }
                this.initialized = true;

                // 注册菜单命令
                this.registerMenuCommands();
            }).catch(err => {
                logPM(`UI初始化失败: ${err.message}`, 'error');
            });
        }

        // 等待DOM准备好的函数
        waitForDOM() {
            logPM('等待DOM加载...', 'debug');
            return new Promise((resolve) => {
                // 如果文档已经完成加载，检查是否需要额外等待
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    const currentHost = window.location.hostname;
                    logPM(`文档状态: ${document.readyState}`, 'debug');

                    // 对于需要特殊处理的SPA网站配置延时等待
                    const spaDelays = {
                        'chat.openai.com': 1000,
                        'chatgpt.com': 1000,
                        'gemini.google.com': 1000,
                        'bard.google.com': 1000
                    };

                    // 检查网站是否需要额外延时
                    const extraDelay = spaDelays[currentHost] ||
                        Object.entries(spaDelays).some(([domain, _]) =>
                            currentHost.includes(domain)) ? 1000 : 300;

                    // 增加等待时间以确保SPA界面完全加载
                    setTimeout(() => {
                        // 再增加一个较小的延迟,等待可能的动态注入
                        setTimeout(() => {
                            // 对特定SPA网站进行额外检查
                            const checkSPAReady = () => {
                                // ChatGPT相关网站检查
                                if (currentHost.includes('chatgpt.com') || currentHost.includes('chat.openai.com')) {
                                    return document.querySelector('main') !== null ||
                                        document.querySelector('form') !== null ||
                                        document.querySelector('[role="main"]') !== null;
                                }
                                // Google相关产品检查
                                if (currentHost.includes('gemini.google.com') || currentHost.includes('bard.google.com')) {
                                    return document.querySelector('[role="main"]') !== null ||
                                        document.querySelector('textarea') !== null ||
                                        document.querySelector('#prompt-textarea') !== null;
                                }
                                // Claude相关检查
                                if (currentHost.includes('claude.ai')) {
                                    return document.querySelector('main') !== null ||
                                        document.querySelector('textarea') !== null ||
                                        document.querySelector('[role="textbox"]') !== null;
                                }
                                // 对于其他SPA网站,检查常见的标识符
                                return document.querySelector('main') !== null ||
                                    document.querySelector('#app') !== null ||
                                    document.querySelector('#root') !== null ||
                                    document.querySelector('[role="main"]') !== null ||
                                    true; // 如果都找不到,也允许继续
                            };

                            // 如果SPA还未准备好，继续等待
                            if (!checkSPAReady()) {
                                logPM('SPA未就绪，启动轮询检查', 'debug');
                                let checkCount = 0;
                                const checkInterval = setInterval(() => {
                                    checkCount++;
                                    // 减少日志输出，只在每3次检查时记录
                                    if (checkCount % 3 === 0) {
                                        logPM(`SPA就绪检查中(${checkCount})`, 'debug');
                                    }
                                    if (checkSPAReady()) {
                                        clearInterval(checkInterval);
                                        logPM('SPA就绪', 'debug');
                                        resolve();
                                    }
                                }, 500);

                                // 设置最大等待时间为5秒
                                setTimeout(() => {
                                    clearInterval(checkInterval);
                                    logPM('继续初始化', 'debug');
                                    resolve();
                                }, 5000);
                            } else {
                                resolve();
                            }
                        }, 200);
                    }, extraDelay);

                } else {
                    // 如果文档尚未加载完成，监听DOMContentLoaded事件
                    logPM(`等待DOMContentLoaded事件`, 'debug');
                    window.addEventListener('DOMContentLoaded', () => {
                        setTimeout(resolve, 500);
                    });
                }
            });
        }

        registerMenuCommands() {
            logPM('注册菜单命令');
            const currentHostname = window.location.hostname;
            const isAllowed = this.manager.isDomainAllowed(currentHostname);

            if (isAllowed) {
                GM_registerMenuCommand("打开主界面", () => this.showModal());
            } else {
                GM_registerMenuCommand("添加当前域名到白名单", () => this.addCurrentDomainToWhitelist());
            }
            GM_registerMenuCommand("管理域名白名单", () => this.showDomainWhitelistModal());
            logPM('菜单命令注册完成');
        }

        // 创建DOM元素的辅助函数
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);

            // 设置属性
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.entries(value).forEach(([styleKey, styleValue]) => {
                        element.style[styleKey] = styleValue;
                    });
                } else if (key === 'textContent') {
                    element.textContent = value;
                } else if (key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                } else if (key === 'dataset' && typeof value === 'object') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });

            // 添加子元素
            if (Array.isArray(children)) {
                children.forEach(child => {
                    if (child instanceof Node) {
                        element.appendChild(child);
                    } else if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    }
                });
            } else if (typeof children === 'string') {
                element.appendChild(document.createTextNode(children));
            } else if (children instanceof Node) {
                element.appendChild(children);
            }

            return element;
        }

        setupUI() {
            logPM('设置UI界面', 'info');
            // 检查body是否存在，如果不存在则等待
            if (!document.body) {
                setTimeout(() => this.setupUI(), 200);
                return;
            }

            logPM('创建Shadow DOM容器');
            // 创建Shadow DOM容器以完全隔离样式
            const hostElement = document.createElement('div');
            hostElement.className = 'pm-wrapper';
            document.body.appendChild(hostElement);

            // 使用Shadow DOM实现样式隔离
            const shadowRoot = hostElement.attachShadow({ mode: 'closed' });
            logPM('Shadow DOM创建成功');

            // 添加样式到Shadow DOM
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            shadowRoot.appendChild(styleElement);
            logPM('样式添加到Shadow DOM');

            // 创建主按钮
            const btn = this.createElement('button', {
                className: 'pm-prompt-manager-btn',
                textContent: '📝',
                onClick: () => this.showModal()
            });
            shadowRoot.appendChild(btn);
            logPM('主按钮创建成功');

            // 创建主模态框
            const modal = this.createModalElement();
            shadowRoot.appendChild(modal);
            logPM('主模态框创建成功');

            // 创建表单模态框
            const formModal = this.createFormModalElement();
            shadowRoot.appendChild(formModal);
            logPM('表单模态框创建成功');

            // 创建遮罩层
            const overlay = this.createElement('div', {
                className: 'pm-prompt-manager-overlay',
                style: { display: 'none' },
                onClick: () => this.hideModal()
            });
            shadowRoot.appendChild(overlay);
            logPM('遮罩层创建成功');

            this.modal = modal;
            this.formModal = formModal;
            this.overlay = overlay;
            this.shadowRoot = shadowRoot;

            logPM('绑定事件处理器');
            this.bindEvents();

            logPM('初始化Sortable');
            this.initSortable();

            setTimeout(() => {
                logPM('默认切换到全局标签');
                this.switchTab('global');
            }, 0);

            logPM('UI设置完成', 'success');
        }

        // 创建主模态框元素
        createModalElement() {
            // 创建模态框容器
            const modal = this.createElement('div', {
                className: 'pm-prompt-manager-modal',
                style: { display: 'none' }
            });

            // 创建模态框头部
            const modalHeader = this.createElement('div', { className: 'pm-modal-header' });

            // 创建标签容器
            const tabContainer = this.createElement('div', { className: 'pm-tab-container' });

            // 创建站点标签按钮
            const siteTabButton = this.createElement('button', {
                className: 'pm-tab-button pm-active',
                dataset: { tab: 'site' },
                textContent: '当前网站Prompts'
            });

            // 创建全局标签按钮
            const globalTabButton = this.createElement('button', {
                className: 'pm-tab-button',
                dataset: { tab: 'global' },
                textContent: '全局Prompts'
            });

            tabContainer.appendChild(siteTabButton);
            tabContainer.appendChild(globalTabButton);

            // 创建新增按钮
            const newPromptBtn = this.createElement('button', {
                id: 'pm-new-prompt-btn',
                className: 'pm-btn pm-btn-primary',
                textContent: '新增 Prompt',
                onClick: () => this.showFormModal()
            });

            modalHeader.appendChild(tabContainer);
            modalHeader.appendChild(newPromptBtn);

            // 创建提示容器
            const promptsContainer = this.createElement('div', { className: 'pm-prompts-container' });

            // 创建站点提示和全局提示容器
            const sitePrompts = this.createElement('div', { id: 'pm-site-prompts' });
            const globalPrompts = this.createElement('div', {
                id: 'pm-global-prompts',
                style: { display: 'none' }
            });

            promptsContainer.appendChild(sitePrompts);
            promptsContainer.appendChild(globalPrompts);

            modal.appendChild(modalHeader);
            modal.appendChild(promptsContainer);

            return modal;
        }

        // 创建表单模态框元素
        createFormModalElement() {
            // 创建表单模态框容器
            const formModal = this.createElement('div', {
                className: 'pm-prompt-form-modal',
                style: { display: 'none' }
            });

            // 创建关闭按钮
            const closeBtn = this.createElement('span', {
                className: 'pm-modal-close',
                textContent: '×',
                onClick: () => this.hideFormModal()
            });

            // 创建别名输入组
            const aliasGroup = this.createElement('div', { className: 'pm-form-group' });
            const aliasLabel = this.createElement('label', {
                for: 'pm-prompt-alias',
                textContent: '别名'
            });
            const aliasInput = this.createElement('input', {
                type: 'text',
                id: 'pm-prompt-alias',
                placeholder: '输入prompt别名'
            });
            aliasGroup.appendChild(aliasLabel);
            aliasGroup.appendChild(aliasInput);

            // 创建内容输入组
            const contentGroup = this.createElement('div', { className: 'pm-form-group' });
            const contentLabel = this.createElement('label', {
                for: 'pm-prompt-content',
                textContent: '内容'
            });
            const contentTextarea = this.createElement('textarea', {
                id: 'pm-prompt-content',
                placeholder: '输入prompt内容',
                rows: '6'
            });
            contentGroup.appendChild(contentLabel);
            contentGroup.appendChild(contentTextarea);

            // 创建全局设置复选框组
            const checkboxGroup = this.createElement('div', { className: 'pm-form-group' });
            const checkboxContainer = this.createElement('div', { className: 'pm-checkbox-container' });
            const isGlobalCheckbox = this.createElement('input', {
                type: 'checkbox',
                id: 'pm-is-global'
            });
            const checkboxLabel = this.createElement('label', {
                for: 'pm-is-global',
                textContent: '设为全局Prompt'
            });
            checkboxContainer.appendChild(isGlobalCheckbox);
            checkboxContainer.appendChild(checkboxLabel);
            checkboxGroup.appendChild(checkboxContainer);

            // 创建操作按钮组
            const actionsGroup = this.createElement('div', { className: 'pm-form-actions' });
            const cancelButton = this.createElement('button', {
                id: 'pm-cancel-prompt',
                className: 'pm-btn pm-btn-secondary',
                textContent: '取消',
                onClick: () => this.hideFormModal()
            });
            const saveButton = this.createElement('button', {
                id: 'pm-save-prompt',
                className: 'pm-btn pm-btn-primary',
                textContent: '保存'
            });
            actionsGroup.appendChild(cancelButton);
            actionsGroup.appendChild(saveButton);

            // 创建隐藏字段
            const idInput = this.createElement('input', {
                type: 'hidden',
                id: 'pm-editing-prompt-id'
            });
            const globalInput = this.createElement('input', {
                type: 'hidden',
                id: 'pm-editing-prompt-global'
            });

            // 添加所有元素到表单模态框
            formModal.appendChild(closeBtn);
            formModal.appendChild(aliasGroup);
            formModal.appendChild(contentGroup);
            formModal.appendChild(checkboxGroup);
            formModal.appendChild(actionsGroup);
            formModal.appendChild(idInput);
            formModal.appendChild(globalInput);

            return formModal;
        }

        setupHotkey() {
            logPM('设置快捷键');
            document.addEventListener('keydown', (e) => {
                // 检查是否按下 Alt + H
                if (e.altKey && e.key.toLowerCase() === 'h') {
                    logPM('检测到快捷键 Alt+H');
                    e.preventDefault(); // 阻止默认行为

                    // 如果modal已显示则隐藏，否则显示
                    if (this.modal.style.display === 'block') {
                        this.hideModal();
                    } else {
                        this.showModal();
                    }
                }
            });
        }

        setupQuickAddButton() {
            // 创建Shadow DOM容器以完全隔离样式
            const hostElement = document.createElement('div');
            hostElement.className = 'pm-wrapper';
            document.body.appendChild(hostElement);

            // 使用Shadow DOM实现样式隔离
            const shadowRoot = hostElement.attachShadow({ mode: 'closed' });

            // 添加样式到Shadow DOM
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            shadowRoot.appendChild(styleElement);

            // 添加快速添加按钮，样式与主按钮类似但颜色稍有不同
            const quickAddBtn = this.createElement('button', {
                className: 'pm-prompt-manager-btn',
                style: {
                    backgroundColor: '#28a745', // 绿色，表示"添加"
                    right: '-40px', // 位置与主按钮错开
                    bottom: '100px', // 位置在主按钮上方
                    width: '40px',  // 设置固定宽度
                    height: '40px'  // 设置固定高度
                },
                textContent: '➕',
                title: '将当前域名添加到白名单',
                onClick: () => this.addCurrentDomainToWhitelist()
            });

            shadowRoot.appendChild(quickAddBtn);
            this.shadowRoot = shadowRoot;
        }

        addCurrentDomainToWhitelist() {
            const currentHostname = window.location.hostname;

            if (confirm(`是否将 ${currentHostname} 添加到白名单？添加后将刷新页面以启用脚本功能。`)) {
                // 添加域名到白名单
                this.manager.addDomain(currentHostname);

                // 显示成功消息并刷新页面
                alert(`已成功将 ${currentHostname} 添加到白名单！页面将刷新以启用脚本功能。`);
                window.location.reload();
            }
        }

        initSortable() {
            // 确保在切换标签页时重新初始化Sortable
            this.updateSortable();
        }

        updateSortable() {
            const sitePrompts = this.shadowRoot.querySelector('#pm-site-prompts');
            const globalPrompts = this.shadowRoot.querySelector('#pm-global-prompts');

            [sitePrompts, globalPrompts].forEach(container => {
                // 销毁之前的实例以避免重复初始化
                if (container.sortableInstance) {
                    container.sortableInstance.destroy();
                }

                container.sortableInstance = new Sortable(container, {
                    animation: 150,
                    handle: '.pm-prompt-group-title', // 只能通过标题区域拖动
                    ghostClass: 'pm-dragging',
                    onEnd: (evt) => {
                        const isGlobal = container.id === 'pm-global-prompts';
                        const prompts = isGlobal ? this.manager.prompts.global : this.manager.getCurrentSitePrompts();
                        const newPrompts = Array.from(container.children).map(el => {
                            const id = parseInt(el.dataset.id);
                            return prompts.find(p => p.id === id);
                        });
                        this.manager.updateOrder(newPrompts, isGlobal);
                    }
                });
            });
        }

        // 创建域名白名单管理模态框
        createDomainWhitelistModalElement() {
            const domainModal = this.createElement('div', {
                className: 'pm-prompt-form-modal',
                style: { display: 'none' }
            });

            // 创建头部
            const modalHeader = this.createElement('div', { className: 'pm-modal-header' });
            const heading = this.createElement('h3', {
                style: { margin: '0 0 8px 0', fontSize: '16px' },
                textContent: '域名白名单管理'
            });
            modalHeader.appendChild(heading);

            // 创建域名列表部分
            const domainListGroup = this.createElement('div', { className: 'pm-form-group' });
            const domainListLabel = this.createElement('label', { textContent: '当前白名单域名' });
            const domainList = this.createElement('div', {
                className: 'pm-domain-list',
                id: 'pm-domain-list'
            });
            domainListGroup.appendChild(domainListLabel);
            domainListGroup.appendChild(domainList);

            // 创建添加域名部分
            const addDomainGroup = this.createElement('div', { className: 'pm-form-group' });
            const addDomainLabel = this.createElement('label', {
                for: 'pm-new-domain',
                textContent: '添加域名'
            });

            const inputContainer = this.createElement('div', {
                style: { display: 'flex', gap: '8px' }
            });

            const domainInput = this.createElement('input', {
                type: 'text',
                id: 'pm-new-domain',
                placeholder: '输入域名 (如 example.com)',
                style: {
                    flex: '1',
                    height: '28px',
                    padding: '0 8px',
                    boxSizing: 'border-box'
                }
            });

            const addDomainBtn = this.createElement('button', {
                id: 'pm-add-domain-btn',
                className: 'pm-btn pm-btn-primary',
                textContent: '添加'
            });

            inputContainer.appendChild(domainInput);
            inputContainer.appendChild(addDomainBtn);

            addDomainGroup.appendChild(addDomainLabel);
            addDomainGroup.appendChild(inputContainer);

            // 创建操作按钮组
            const actionsGroup = this.createElement('div', { className: 'pm-form-actions' });

            const resetButton = this.createElement('button', {
                id: 'pm-reset-domains-btn',
                className: 'pm-btn pm-btn-secondary',
                textContent: '恢复默认'
            });

            const closeButton = this.createElement('button', {
                id: 'pm-close-domains-btn',
                className: 'pm-btn pm-btn-primary',
                textContent: '关闭'
            });

            actionsGroup.appendChild(resetButton);
            actionsGroup.appendChild(closeButton);

            // 添加所有元素到模态框
            domainModal.appendChild(modalHeader);
            domainModal.appendChild(domainListGroup);
            domainModal.appendChild(addDomainGroup);
            domainModal.appendChild(actionsGroup);

            return domainModal;
        }

        // 修改渲染提示方法，使用DOM API替代innerHTML
        renderPrompts(prompts, container) {
            logPM(`渲染Prompts，数量: ${prompts.length}`);
            // 清空容器内容
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            const sortedPrompts = [...prompts].sort((a, b) => (a.order || 0) - (b.order || 0));

            sortedPrompts.forEach(prompt => {
                // 创建提示组元素
                const promptGroup = this.createElement('div', {
                    className: 'pm-prompt-group',
                    dataset: { id: prompt.id.toString() }
                });

                // 检查标题是否包含中文字符
                const hasChinese = /[\u4e00-\u9fa5]/.test(prompt.alias);
                const titleClass = hasChinese ? 'pm-prompt-group-title pm-chinese' : 'pm-prompt-group-title';

                // 创建标题元素
                const titleElement = this.createElement('div', { className: titleClass });

                // 创建标题文本
                const titleText = this.createElement('div', { className: 'pm-title-text' }, prompt.alias);

                // 创建操作按钮
                const actions = this.createElement('div', { className: 'pm-prompt-actions' });

                // 创建编辑按钮
                const editBtn = this.createElement('button', {
                    className: 'pm-btn pm-btn-secondary pm-edit-prompt',
                    dataset: { id: prompt.id.toString() },
                    textContent: '编辑'
                });

                // 创建复制按钮
                const copyBtn = this.createElement('button', {
                    className: 'pm-btn pm-btn-primary pm-copy-prompt',
                    dataset: { id: prompt.id.toString() },
                    textContent: '复制'
                });

                // 创建删除按钮
                const deleteBtn = this.createElement('button', {
                    className: 'pm-btn pm-btn-danger pm-delete-prompt',
                    dataset: { id: prompt.id.toString() },
                    textContent: '删除'
                });

                // 将按钮添加到操作区
                actions.appendChild(editBtn);
                actions.appendChild(copyBtn);
                actions.appendChild(deleteBtn);

                // 将标题文本和操作区添加到标题元素
                titleElement.appendChild(titleText);
                titleElement.appendChild(actions);

                // 创建提示内容元素
                const contentElement = this.createElement('pre', {
                    className: 'pm-prompt-content',
                    style: { display: 'none' },
                    textContent: prompt.text
                });

                // 将标题和内容添加到提示组
                promptGroup.appendChild(titleElement);
                promptGroup.appendChild(contentElement);

                // 添加点击事件，实现折叠/展开功能
                titleElement.addEventListener('click', (e) => {
                    // 如果点击的是按钮，不执行展开/折叠
                    if (e.target.tagName === 'BUTTON') {
                        return;
                    }
                    contentElement.style.display = contentElement.style.display === 'none' ? 'block' : 'none';
                    promptGroup.classList.toggle('collapsed');
                });

                // 将提示组添加到容器
                container.appendChild(promptGroup);
            });

            logPM('Prompts渲染完成');
        }

        // 渲染域名白名单列表
        renderDomainWhitelist() {
            const container = this.shadowRoot.querySelector('#pm-domain-list');
            if (!container) return;

            // 清空容器
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // 为每个域名创建DOM元素
            this.manager.domainWhitelist.forEach(domain => {
                const domainItem = this.createElement('div', { className: 'pm-domain-item' });

                const domainName = this.createElement('div', {
                    className: 'pm-domain-name',
                    textContent: domain
                });

                const removeButton = this.createElement('button', {
                    className: 'pm-btn pm-btn-danger pm-remove-domain',
                    dataset: { domain: domain },
                    textContent: '删除'
                });

                // 添加删除按钮事件
                removeButton.addEventListener('click', () => {
                    this.manager.removeDomain(domain);
                    this.renderDomainWhitelist();
                });

                domainItem.appendChild(domainName);
                domainItem.appendChild(removeButton);

                container.appendChild(domainItem);
            });
        }

        showFormModal(promptData = null, isGlobal = false) {
            const aliasInput = this.shadowRoot.querySelector('#pm-prompt-alias');
            const contentInput = this.shadowRoot.querySelector('#pm-prompt-content');
            const isGlobalCheckbox = this.shadowRoot.querySelector('#pm-is-global');
            const idInput = this.shadowRoot.querySelector('#pm-editing-prompt-id');
            const globalInput = this.shadowRoot.querySelector('#pm-editing-prompt-global');

            if (promptData) {
                aliasInput.value = promptData.alias;
                contentInput.value = promptData.text;
                isGlobalCheckbox.checked = isGlobal;
                idInput.value = promptData.id;
                globalInput.value = isGlobal ? 'true' : 'false';
            } else {
                aliasInput.value = '';
                contentInput.value = '';
                isGlobalCheckbox.checked = this.currentTab === 'global';
                idInput.value = '';
                globalInput.value = '';
            }

            this.formModal.style.display = 'block';
            this.overlay.style.display = 'block';

            // 添加延时聚焦，确保modal显示后再聚焦
            setTimeout(() => {
                aliasInput.focus();
            }, 50);
        }

        hideFormModal() {
            this.formModal.style.display = 'none';
            if (this.modal.style.display === 'none') {
                this.overlay.style.display = 'none';
            }
        }

        // 显示域名白名单管理模态框
        showDomainWhitelistModal() {
            // 如果不存在则创建模态框
            if (!this.domainModal) {
                const modal = this.createDomainWhitelistModalElement();

                if (!this.shadowRoot) {
                    // 如果当前域名不在白名单中，需要创建shadowRoot
                    const hostElement = document.createElement('div');
                    hostElement.className = 'pm-wrapper';
                    document.body.appendChild(hostElement);

                    this.shadowRoot = hostElement.attachShadow({ mode: 'closed' });

                    const styleElement = document.createElement('style');
                    styleElement.textContent = styles;
                    this.shadowRoot.appendChild(styleElement);

                    if (!this.overlay) {
                        const overlay = this.createElement('div', {
                            className: 'pm-prompt-manager-overlay',
                            style: { display: 'none' }
                        });
                        this.shadowRoot.appendChild(overlay);
                        this.overlay = overlay;
                    }
                }

                this.shadowRoot.appendChild(modal);
                this.domainModal = modal;

                // 绑定域名白名单管理事件
                this.bindDomainWhitelistEvents();
            }

            this.renderDomainWhitelist();
            this.domainModal.style.display = 'block';
            this.overlay.style.display = 'block';
        }

        // 隐藏域名白名单管理模态框
        hideDomainWhitelistModal() {
            if (this.domainModal) {
                this.domainModal.style.display = 'none';
                if ((!this.modal || this.modal.style.display === 'none') &&
                    (!this.formModal || this.formModal.style.display === 'none')) {
                    this.overlay.style.display = 'none';
                }
            }
        }

        // 绑定域名白名单管理事件
        bindDomainWhitelistEvents() {
            this.shadowRoot.querySelector('#pm-add-domain-btn').addEventListener('click', () => {
                const input = this.shadowRoot.querySelector('#pm-new-domain');
                const domain = input.value.trim();
                if (domain) {
                    if (this.manager.addDomain(domain)) {
                        this.renderDomainWhitelist();
                        input.value = '';
                    } else {
                        alert('该域名已在白名单中');
                    }
                }
            });

            this.shadowRoot.querySelector('#pm-reset-domains-btn').addEventListener('click', () => {
                if (confirm('确定要恢复默认域名设置吗？')) {
                    this.manager.resetToDefaultDomains();
                    this.renderDomainWhitelist();
                }
            });

            this.shadowRoot.querySelector('#pm-close-domains-btn').addEventListener('click', () => {
                this.hideDomainWhitelistModal();
            });

            // 阻止输入框的事件冒泡
            ['keydown', 'keyup', 'keypress', 'input'].forEach(eventType => {
                this.shadowRoot.querySelector('#pm-new-domain').addEventListener(eventType, (e) => {
                    e.stopPropagation();
                });
            });

            // 按回车添加域名
            this.shadowRoot.querySelector('#pm-new-domain').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.shadowRoot.querySelector('#pm-add-domain-btn').click();
                }
            });
        }

        bindEvents() {
            this.shadowRoot.querySelectorAll('.pm-tab-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    this.switchTab(e.target.dataset.tab);
                });
            });

            this.shadowRoot.querySelector('#pm-new-prompt-btn').addEventListener('click', () => {
                this.showFormModal();
            });

            this.shadowRoot.querySelector('.pm-modal-close').addEventListener('click', () => {
                this.hideFormModal();
            });

            this.shadowRoot.querySelector('#pm-cancel-prompt').addEventListener('click', () => {
                this.hideFormModal();
            });

            this.shadowRoot.querySelector('#pm-save-prompt').addEventListener('click', () => {
                const alias = this.shadowRoot.querySelector('#pm-prompt-alias').value.trim();
                const text = this.shadowRoot.querySelector('#pm-prompt-content').value.trim();
                const isGlobal = this.shadowRoot.querySelector('#pm-is-global').checked;
                const editingId = this.shadowRoot.querySelector('#pm-editing-prompt-id').value;
                const wasGlobal = this.shadowRoot.querySelector('#pm-editing-prompt-global').value === 'true';

                if (alias && text) {
                    if (editingId) {
                        const id = parseInt(editingId);
                        if (wasGlobal !== isGlobal) {
                            this.manager.deletePrompt(id, wasGlobal);
                            this.manager.addPrompt({ alias, text }, isGlobal);
                        } else {
                            this.manager.updatePrompt(id, { alias, text }, isGlobal);
                        }
                    } else {
                        this.manager.addPrompt({ alias, text }, isGlobal);
                    }
                    this.hideFormModal();
                    this.updatePromptLists();
                }
            });

            this.modal.addEventListener('click', (e) => {
                const target = e.target;
                const id = parseInt(target.dataset.id);
                const isGlobal = this.currentTab === 'global';
                const prompts = isGlobal ? this.manager.prompts.global : this.manager.getCurrentSitePrompts();
                const prompt = prompts.find(p => p.id === id);

                if (target.classList.contains('pm-edit-prompt') && prompt) {
                    this.showFormModal(prompt, isGlobal);
                } else if (target.classList.contains('pm-copy-prompt') && prompt) {
                    navigator.clipboard.writeText(prompt.text).then(() => {
                        target.textContent = '已复制';
                        setTimeout(() => target.textContent = '复制', 1000);
                    });
                } else if (target.classList.contains('pm-delete-prompt') && prompt) {
                    if (confirm('确定要删除这个prompt吗？')) {
                        this.manager.deletePrompt(id, isGlobal);
                        this.updatePromptLists();
                    }
                }
            });

            // 阻止表单模态框内的事件冒泡到原始页面
            this.formModal.addEventListener('keydown', (e) => {
                e.stopPropagation();
            });

            // 阻止输入框的事件冒泡
            ['keydown', 'keyup', 'keypress', 'input'].forEach(eventType => {
                this.shadowRoot.querySelector('#pm-prompt-alias').addEventListener(eventType, (e) => {
                    e.stopPropagation();
                });

                this.shadowRoot.querySelector('#pm-prompt-content').addEventListener(eventType, (e) => {
                    e.stopPropagation();
                });
            });
        }

        switchTab(tab) {
            logPM(`切换到标签: ${tab}`);
            this.currentTab = tab;

            // 更新tab按钮状态
            this.shadowRoot.querySelectorAll('.pm-tab-button').forEach(button => {
                button.classList.toggle('pm-active', button.dataset.tab === tab);
            });

            // 更新内容显示
            const sitePrompts = this.shadowRoot.querySelector('#pm-site-prompts');
            const globalPrompts = this.shadowRoot.querySelector('#pm-global-prompts');

            if (tab === 'site') {
                sitePrompts.style.display = 'block';
                globalPrompts.style.display = 'none';
                const currentPrompts = this.manager.getCurrentSitePrompts();
                logPM(`加载站点特定Prompts，数量: ${currentPrompts.length}`);
                this.renderPrompts(currentPrompts, sitePrompts);
            } else {
                sitePrompts.style.display = 'none';
                globalPrompts.style.display = 'block';
                logPM(`加载全局Prompts，数量: ${this.manager.prompts.global.length}`);
                this.renderPrompts(this.manager.prompts.global, globalPrompts);
            }

            // 在渲染完成后更新Sortable
            setTimeout(() => this.updateSortable(), 0);
        }

        updatePromptLists() {
            this.renderPrompts(this.manager.getCurrentSitePrompts(), this.shadowRoot.querySelector('#pm-site-prompts'));
            this.renderPrompts(this.manager.prompts.global, this.shadowRoot.querySelector('#pm-global-prompts'));
        }

        showModal() {
            logPM('打开主界面', 'debug');
            try {
                this.modal.style.display = 'block';
                this.overlay.style.display = 'block';
                // 阻止模态框内的键盘事件冒泡
                this.modal.addEventListener('keydown', (e) => {
                    e.stopPropagation();
                }, true);
                this.switchTab(this.currentTab);
                this.updatePromptLists();
            } catch (err) {
                logPM(`显示模态框失败: ${err.message}`, 'error');
                console.error(err);
            }
        }

        hideModal() {
            logPM('隐藏模态框');
            this.modal.style.display = 'none';
            this.formModal.style.display = 'none';
            this.overlay.style.display = 'none';
        }
    }

    // 只在初始化时输出一条主要日志
    logPM('Prompt Manager 初始化', 'info');
    const promptManager = new PromptManager();
    const ui = new PromptManagerUI(promptManager);
})();

