// ==UserScript==
// @name         Google AI Studio 汉化脚本
// @name:zh-CN   Google AI Studio 汉化脚本
// @namespace    https://github.com/mefengl
// @version      1.2
// @description  对 Google AI Studio 网站界面进行汉化，方便中文用户使用。
// @description:zh-CN  对 Google AI Studio 网站界面进行汉化，方便中文用户使用。
// @author       way nicholas & AI
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541895/Google%20AI%20Studio%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541895/Google%20AI%20Studio%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译映射表 (英文 -> 中文)
    const translations = {
        "OK, got it": "好的，知道了",
        "Skip to main content": "跳转到主要内容",
        "Get API key": "获取 API 密钥",
        "New chat": "新建聊天",
        "Stream": "实时对话",
        "Generate Media": "生成媒体",
        "Build": "构建",
        "History": "历史记录",
        "Studio": "工作室",
        "Dashboard": "信息中心",
        "Documentation": "文档",
        "API Keys": "API 密钥",
        "Usage & Billing": "用量和结算",
        "Changelog": "更新日志",
        "Disclaimer": "免责声明",
        "Expand or collapse navigation menu": "展开/折叠导航菜单",
        "Open navigation menu": "打开导航菜单",
        "Show run settings": "显示运行设置",
        "Open settings menu": "打开设置菜单",
        "Chat Prompt": "聊天提示",
        "System instructions": "系统指令",
        "Get code": "获取代码",
        "Get SDK code to chat with Gemini": "获取与 Gemini 聊天的 SDK 代码",
        "Share prompt": "分享提示",
        "You need to create and run a prompt in order to share it": "您需要创建并运行一个提示才能分享它",
        "Save prompt": "保存提示",
        "No changes to save": "没有要保存的更改",
        "Compare mode": "比较模式",
        "Clear chat": "清空聊天",
        "View more actions": "查看更多操作",
        "Welcome to AI Studio": "欢迎使用 AI Studio",
        "Type something or tab to choose an example prompt": "输入内容，或按 Tab 键选择示例提示",
        "Explain the probability of rolling two dice and getting 7": "解释掷两个骰子得到 7 的概率",
        "Insert assets such as images, videos, files, or audio": "插入图片、视频、文件或音频等资源",
        "Insert assets such as images, videos, folders, files, or audio": "插入图片、视频、文件夹、文件或音频等资源",
        "Run": "运行",
        "Run prompt": "运行提示",
        "What's new": "新增功能",
        "URL context tool": "网址上下文工具",
        "Fetch information from web links": "从网页链接中获取信息",
        "Native speech generation": "原生语音生成",
        "Generate high quality text to speech with Gemini": "使用 Gemini 生成高质量文本转语音",
        "Live audio-to-audio dialog": "实时音频对话",
        "Try Gemini's natural, real-time dialog with audio and video inputs": "体验 Gemini 带有音频和视频输入的自然、实时对话",
        "Native image generation": "原生图片生成",
        "Interleaved text-and-image generation with the new Gemini 2.0 Flash": "使用新的 Gemini Flash 进行文图交错生成",
        "Run settings": "运行设置",
        "Reset default settings": "重置默认设置",
        "Close run settings panel": "关闭运行设置面板",
        "Token count": "令牌计数",
        "Temperature": "温度",
        "Creativity allowed in the responses": "响应中允许的创造性",
        "Media Resolution": "媒体分辨率",
        "Higher resolutions may provide better understanding but use more tokens.": "更高的分辨率可以提供更好的理解，但会消耗更多令牌。",
        "Default": "默认",
        "Thinking": "思考中",
        "Thinking mode": "思考模式",
        "Toggle thinking mode": "切换思考模式",
        "Unable to disable thinking mode for this model.": "无法禁用此模型的思考模式。",
        "Set thinking budget": "设置思考预算",
        "Let the model decide how many thinking tokens to use or choose your own value": "让模型决定使用多少思考令牌，或选择您自己的值",
        "Toggle thinking budget between auto and manual": "在自动和手动之间切换思考预算",
        "Tools": "工具",
        "Structured output": "结构化输出",
        "Generate structured output": "生成结构化输出",
        "Edit": "编辑",
        "Code execution": "代码执行",
        "Lets Gemini use code to solve complex tasks": "让 Gemini 使用代码解决复杂任务",
        "Function calling": "函数调用",
        "Lets you define functions that Gemini can call": "让您可以定义 Gemini 能够调用的函数",
        "Grounding with Google Search": "基于 Google 搜索",
        "Use Google Search": "使用 Google 搜索",
        "URL context": "网址上下文",
        "Browse the url context": "浏览网址上下文",
        "Advanced settings": "高级设置",
        "Safety settings": "安全设置",
        "Adjust harmful response settings": "调整有害响应设置",
        "Add stop sequence": "添加停止序列",
        "Truncate response including and after string": "在包含指定字符串后截断响应",
        "Add stop...": "添加停止序列...",
        "Output length": "输出长度",
        "Maximum number of tokens in response": "响应中的最大令牌数",
        "Top P": "Top-P",
        "Top K": "Top-K",
        "Probability threshold for top-p sampling": "Top-P 采样的概率阈值",
        "Prompt gallery": "提示库",
        "Chat": "聊天",
        "Light theme": "浅色主题",
        "Dark theme": "深色主题",
        "System theme": "系统主题",
        "Select or upload a file on Google Drive to include in your prompt": "在 Google Drive 上选择或上传文件以包含在您的提示中",
        "Upload a file to Google Drive to include in your prompt": "上传文件到 Google Drive 以包含在您的提示中",
        "Learn more": "了解详情"
    };

    /**
     * 翻译单个节点，包括其属性和文本内容
     * @param {Node} node - 要翻译的 DOM 节点
     */
    function translateNode(node) {
        // 翻译元素节点的属性
        if (node.nodeType === Node.ELEMENT_NODE) {
            const attributes = ['aria-label', 'placeholder', 'mattooltip', 'title'];
            for (const attr of attributes) {
                const value = node.getAttribute(attr);
                if (value && translations[value.trim()]) {
                    node.setAttribute(attr, translations[value.trim()]);
                }
            }
        }

        // 翻译文本节点
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue.trim();
            if (translations[text]) {
                // 使用 replace 保留原始文本周围的空白字符
                node.nodeValue = node.nodeValue.replace(text, translations[text]);
            } else if (text.startsWith("Google AI Studio uses cookies")) {
                 // 对 Cookie 提示信息的特殊处理
                 node.nodeValue = "Google AI Studio 使用 Google 的 Cookie 来提供和增强其服务质量，并分析流量。";
            }
        }
    }

    /**
     * 遍历指定根节点下的所有节点并应用翻译
     * @param {Node} rootNode - 开始遍历的根节点
     */
    function walkAndTranslate(rootNode) {
        if (!rootNode) return;
        // 使用 TreeWalker 高效遍历所有可见元素和文本节点
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            translateNode(node);
        }
    }

    // 使用 MutationObserver 来处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                // 当新节点被添加到 DOM 时，对其进行翻译
                walkAndTranslate(node);
            }
        }
    });

    // 延迟初始翻译，以确保单页应用（SPA）已完成初步渲染
    setTimeout(() => {
        // 首次加载时完整翻译一次 body
        walkAndTranslate(document.body);

        // 开始监听 body 内的 DOM 变化
        observer.observe(document.body, {
            childList: true, // 监听子节点的添加或删除
            subtree: true    // 监听所有后代节点
        });
    }, 1500); // 1.5秒的延迟，对于复杂的单页应用更稳定

})();