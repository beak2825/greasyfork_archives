// ==UserScript==
// @name         Claude.ai 汉化
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  自动翻译claude.ai网页内的内容，并且支持自动翻译title
// @match        https://claude.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513360/Claudeai%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/513360/Claudeai%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译映射
    const translations = {
        "Start new chat": "开始新对话",
        "Start New Chat": "开始新对话",
        "New chat": "新对话",
        "Star chat": "星标对话",
        "Projects": "项目",
        "Starred": "已加星标",
        "Unpin sidebar": "取消固定侧边栏",
        "Pin sidebar": "固定侧边栏",
        "Star projects and chats you use often": "为您经常使用的项目和对话加星标",
        "Your recent chats": "您最近的对话",
        "View all": "查看全部",
        "How can Claude help you today?": "今天Claude能为您做些什么?",
        "Use a project": "使用项目",
        "Add content": "添加内容",
        "Upload docs or images": "上传文档或者图片",
        "Max 5, 30mb each": "最多5个,每个30MB",
        "Summarize meeting notes": "总结会议记录",
        "Extract insights from report": "从报告中提取见解",
        "Generate interview questions": "生成面试问题",
        "Professional Plan": "专业版计划",
        "Good morning": "早上好",
        "Help & support": "帮助与支持",
        "Claude currently cannot access the internet or reference links": "Claude目前无法访问互联网或参考链接",
        "Use shift + return for new line": "用 Shift + 回车键换行",
        "Send message": "发送消息",
        "Rename": "重命名",
        "Delete": "删除",
        "Copy": "复制",
        "Claude can make mistakes. Please double-check responses.": "Claude可能会犯错。请仔细检查回复。",
        "Edit": "编辑",
        "Retry": "重试",
        "Share positive feedback": "分享正面反馈",
        "Report issue": "报告问题",
        "Recents": "最近",
        "Select": "选择",
        "You have {n} previous chats with Claude": "您与Claude有{n}个以前的对话",
        "Last message": "最后消息",
        "Capture screenshot":"截图",
        "Your chat history":"您的对话历史",
        "selected chats":"已选对话",
        "Select all":"全选",
        "Cancel":"取消",
        "Delete selected":"删除已选",
        "Clear Cache": "清除缓存",
        "Are you sure you want to clear the translation cache?": "您确定要清除翻译缓存吗？",
        "Yes": "是",
        "No": "否",
        "Settings": "设置",
        "Appearance": "外观",
        "Feature Preview": "功能预览",
        "Learn more": "了解更多",
        "API Console": "API 控制台",
        "Help & Support": "帮助与支持",
        "Log Out": "退出登录",
        // 图片中的新选项
        "System": "系统",
        "Light": "浅色",
        "Dark": "深色",
        // 新增的翻译项
        "Profile": "个人资料",
        "Billing": "账单",
        "Account": "账户",
        "Full name": "全名",
        "What should we call you?": "我们应该如何称呼您？",
        "Update Name": "更新名称",
        "What best describes your work?": "什么最能描述您的工作？",
        "Select your work function": "选择您的工作职能",
        "Show prompt suggestions": "显示提示建议",
        "We’ll show examples of starter prompts you can use based on your role": "我们将根据您的角色显示您可以使用的起始提示示例",
        "Enable artifacts": "启用智能工件",
        "Ask Claude to generate content like code snippets, text documents, or website designs, and Claude will create an Artifact that appears in a dedicated window alongside your conversation.": "要求 Claude 生成代码片段、文本文档或网站设计等内容，Claude 将创建一个人工制品，显示在您对话旁边的专用窗口中。",
        // 新增的翻译项
        "Subscribed to Pro": "已订阅专业版",
        "Thanks for being a Pro, BaiYa": "感谢您成为专业版用户，BaiYa",
        "Level up your Claude usage with 5x more usage versus Free plan": "相比免费计划，您的 Claude 使用量提升了 5 倍",
        "Access to Claude 3 Haiku, our fastest model, and Claude 3 Opus": "可以使用 Claude 3 Haiku（我们最快的模型）和 Claude 3 Opus",
        "Create Projects to work with Claude around a set of docs, code, or files": "创建项目，使用 Claude 处理一组文档、代码或文件",
        "Priority access during high-traffic periods": "在高流量期间享有优先访问权",
        "Early access to new features": "抢先体验新功能",
        "Payment": "支付",
        "Link by Stripe": "Stripe 链接",
        "Update": "更新",
        "Invoices": "发票",
        "Date": "日期",
        "Total": "总计",
        "Status": "状态",
        "Actions": "操作",
        "Paid": "已支付",
        "View": "查看",
        "Cancellation": "取消订阅",
        "Cancel plan": "取消计划",
        // 新增的翻译项
        "Export data": "导出数据",
        "Export Data": "导出数据",
        "Delete account": "删除账户",
        "Contact Support": "联系支持",
        // 新增的翻译项
        "About Anthropic": "关于 Anthropic",
        "Consumer Terms": "用户条款",
        "Usage Policy": "使用政策",
        "Privacy Policy": "隐私政策",
        "Your Privacy Choices": "您的隐私选择",
        // 新增的翻译项
        "Provide stakeholder perspective": "提供利益相关者视角",
        "Generate excel formulas": "生成 Excel 公式",
        "Try this prompt": "试试这个提示",
        "Polish your prose": "润色您的文笔",
        "Write a memo": "写一份备忘录",
        "Use projects to organize chats and give Claude knowledge context": "使用项目组织对话并给Claude知识上下文",
        "Reload suggestions": "重新加载提示",
        "Hide suggestions": "隐藏提示",
        "Good afternoon": "下午好",
        // 新增的翻译项
        "Chat controls": "对话控制",
        "Claude 3.5 Sonnet": "Claude 3.5 Sonnet",
        "Most intelligent model": "最智能的模型",
        "Content": "内容",
        "Add images, PDFs, docs, spreadsheets, and more to summarize, analyze, and query content with Claude.": "添加图片、PDF、文档、电子表格等,以便使用 Claude 总结、分析和查询内容。",
        "Chat styles": "对话样式",
        "Font": "字体",
        "Default": "默认",
        "Match system": "匹配系统",
        "Dyslexic friendly": "适合阅读障碍者",
        "Click to open document": "点击打开文档",
        "Refresh": "刷新",
        "Download to file": "下载到文件"
    };

    // 翻译缓存
    let translationCache = {};

    // 修改翻译函数
    function translateText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const trimmedText = node.textContent.trim();
            if (translations[trimmedText]) {
                node.textContent = node.textContent.replace(trimmedText, translations[trimmedText]);
            } else if (node.parentElement && 
                       (node.parentElement.classList.contains('truncate') || 
                        node.parentElement.classList.contains('font-tiempos') ||
                        node.parentElement.classList.contains('text-sm') ||
                        (node.parentElement.closest('.group') && node.parentElement.classList.contains('break-words')))) {
                // 检查缓存
                if (translationCache[trimmedText]) {
                    node.textContent = translationCache[trimmedText];
                } else {
                    // 如果缓存中没有，则使用Google Translate API进行翻译
                    translateWithGoogleAPI(trimmedText).then(translatedText => {
                        node.textContent = translatedText;
                        // 将翻译结果存入缓存
                        translationCache[trimmedText] = translatedText;
                    });
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            ['placeholder', 'aria-label', 'title'].forEach(attr => {
                if (node.hasAttribute(attr)) {
                    let original = node.getAttribute(attr);
                    if (translations[original]) {
                        node.setAttribute(attr, translations[original]);
                    }
                }
            });
            // 特殊处理链接文本
            if (node.tagName === 'A' && node.textContent.trim() in translations) {
                node.textContent = translations[node.textContent.trim()];
            }

            // 添加新的逻辑来处理特定的 artifact 预览内容
            if (node.classList.contains('font-styrene') && node.querySelector('.break-words.text-sm.font-medium.leading-tight')) {
                const previewTextElement = node.querySelector('.break-words.text-sm.font-medium.leading-tight');
                const originalText = previewTextElement.textContent.trim();
                
                // 检查缓存
                if (translationCache[originalText]) {
                    previewTextElement.textContent = translationCache[originalText];
                } else {
                    // 使用 Google Translate API 进行翻译
                    translateWithGoogleAPI(originalText).then(translatedText => {
                        previewTextElement.textContent = translatedText;
                        // 将翻译结果存入缓存
                        translationCache[originalText] = translatedText;
                    });
                }
            }

            // 添加对特定元素的处理
            if (node.classList.contains('font-tiempos') && node.classList.contains('truncate')) {
                translateElementContent(node);
            }
        }
    }

    // 使用Google Translate API进行翻译
    async function translateWithGoogleAPI(text) {
        // 首先检查缓存
        if (translationCache[text]) {
            return translationCache[text];
        }

        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const translatedText = data[0][0][0];
            // 将翻译结果存入缓存
            translationCache[text] = translatedText;
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // 如果翻译失败，返回原文
        }
    }

    // 修改翻译页面函数
    function translatePage() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    // 排除用户输入框、消息框和对话内容，但包括对话历史条目和特殊的group内元素
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.getAttribute('contenteditable') === 'true' ||
                         node.tagName === 'TEXTAREA' ||
                         node.tagName === 'INPUT' ||
                         (node.closest('.font-claude-message') && 
                          !node.classList.contains('truncate') && 
                          !node.classList.contains('font-tiempos') &&
                          !node.classList.contains('break-words')))) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        while(node = walker.nextNode()) {
            translateText(node);
        }

        // 添加对特定元素的翻译
        translateSpecificElements();

        // 在翻译完成后添加清除缓存按钮
        addClearCacheButton();
    }

    // 添加新函数来处理特定元素
    function translateSpecificElements() {
        // 翻译 artifact 预览内容
        document.querySelectorAll('.font-styrene .break-words.text-sm.font-medium.leading-tight').forEach(element => {
            translateElementContent(element);
        });

        // 翻译 sticky 头部的标题
        document.querySelectorAll('.sticky .font-tiempos.truncate').forEach(element => {
            translateElementContent(element);
        });

        // 可以在这里添加其他特定元素的翻译逻辑
    }

    function translateElementContent(element) {
        const originalText = element.textContent.trim();
        if (originalText && !translationCache[originalText]) {
            translateWithGoogleAPI(originalText).then(translatedText => {
                element.textContent = translatedText;
                translationCache[originalText] = translatedText;
            });
        } else if (translationCache[originalText]) {
            element.textContent = translationCache[originalText];
        }
    }

    // 修改添加清除缓存按钮的函数
    function addClearCacheButton() {
        const sidebarNav = document.querySelector('ul.flex.flex-col.gap-px');
        if (sidebarNav && !document.getElementById('clearCacheButton')) {
            const clearCacheButton = document.createElement('li');
            clearCacheButton.innerHTML = `
                <button id="clearCacheButton" class="hover:bg-bg-400 group -mx-1.5 flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors duration-200 text-text-100">
                    ${translations["Clear Cache"]}
                </button>
            `;
            clearCacheButton.querySelector('button').onclick = showClearCacheConfirmation;
            sidebarNav.appendChild(clearCacheButton);
        }
    }

    // 显示清除缓存确认弹窗
    function showClearCacheConfirmation() {
        const confirmMessage = translations["Are you sure you want to clear the translation cache?"];
        if (confirm(confirmMessage)) {
            translationCache = {};
            alert(translations["Cache cleared successfully!"]);
            translatePage(); // 重新翻译页面
        }
    }

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const walker = document.createTreeWalker(
                            node,
                            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                            {
                                acceptNode: function(node) {
                                    // 排除用户输入框、消息框和对话内容，但包括对话历史条目
                                    if (node.nodeType === Node.ELEMENT_NODE && 
                                        (node.getAttribute('contenteditable') === 'true' ||
                                         node.tagName === 'TEXTAREA' ||
                                         node.tagName === 'INPUT' ||
                                         (node.closest('.font-claude-message') && !node.classList.contains('truncate') && !node.classList.contains('font-tiempos')))) {
                                        return NodeFilter.FILTER_REJECT;
                                    }
                                    return NodeFilter.FILTER_ACCEPT;
                                }
                            },
                            false
                        );

                        let childNode;
                        while(childNode = walker.nextNode()) {
                            translateText(childNode);
                        }

                        // 对新添加的节点也执行特定元素翻译
                        translateSpecificElements();
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 修改定时器逻辑
    let translationInterval = setInterval(() => {
        translatePage();
        // 如果页面加载完成后仍有未翻译的内容，可以增加检查次数或延长间隔时间
        if (document.readyState === 'complete') {
            clearInterval(translationInterval);
            // 设置一个较长的间隔来检查可能的动态内容
            setInterval(translateSpecificElements, 5000);
        }
    }, 1000);

    // 初始翻译
    translatePage();
})();
