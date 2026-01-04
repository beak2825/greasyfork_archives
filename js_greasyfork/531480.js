// ==UserScript==
// @name         Claude.ai 汉化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动翻译claude.ai网页内的内容，并且支持自动翻译title
// @match        https://claude.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531480/Claudeai%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/531480/Claudeai%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译映射
    const translations = {
        "/ month billed annually": "/ 月（年付计费）",
        "Team": "团队版",
        "For collaboration across organizations": "适用于跨组织协作",
        "SGD 34.10/ month billed annually": "34.10新元/月（年付计费）",
        "Per member, 5 minimum": "每位成员，最少5人",
        "You must use a work email to get a Team plan.": "您必须使用工作邮箱获取团队计划。",
        "Get a Team plan": "获取团队计划",
        "专业版的所有功能，外加：": "专业版的所有功能，外加：",
        "更高的使用限制": "更高的使用限制",
        "抢先体验新协作功能": "抢先体验新协作功能",
        "集中计费与管理": "集中计费与管理",
        "Enterprise": "企业版",
        "For businesses operating at scale": "适用于大规模运营的企业",
        "Contact sales": "联系销售",
        "Everything in Team, plus:": "团队版的所有功能，外加：",
        "更多使用量*": "更多使用量*",
        "Expanded context window": "扩展的上下文窗口",
        "Single sign-on (SSO) and domain capture": "单点登录(SSO)和域名捕获",
        "Role-based access with permissioning": "基于角色的访问权限管理",
        "System for Cross-domain Identity Management (SCIM)": "跨域身份管理系统(SCIM)",
        "Audit logs": "审计日志",
        "Google Docs cataloging": "Google文档编目",
        "Plans that grow with you": "与您共同成长的计划",
        "Individual": "个人",
        "Team & Enterprise": "团队与企业",
        "Usage limits apply.": "使用限制适用。",
        "Prices shown do not include applicable tax. *": "显示的价格不包含适用税款。 *",
        "Free": "免费",
        "Try Claude": "尝试Claude",
        "SGD 0": "0新元",
        "Stay on Free plan": "保持免费计划",
        "Chat on web, iOS, and Android": "在网页、iOS和Android上聊天",
        "Generate code and visualize data": "生成代码和可视化数据",
        "Write, edit, and create content": "写作、编辑和创建内容",
        "Analyze text and images": "分析文本和图像",
        "Pro": "专业版",
        "For everyday productivity": "适用于日常生产力",
        "SGD 23/ month billed annually": "23新元/月（年付计费）",
        "Get Pro plan": "获取专业版计划",
        "Everything in Free, plus:": "免费版的所有功能，外加：",
        "More usage*": "更多使用量*",
        "Access to unlimited Projects to organize chats and documents": "访问无限量项目来组织聊天和文档",
        "Ability to search the web": "可以搜索网络",
        "Extended thinking for complex work": "复杂工作的延展思考",
        "Connect Google Workspace: email, calendar, and docs": "连接Google Workspace：电子邮件、日历和文档",
        "Ability to use more Claude models": "可以使用更多Claude模型",
        "Max": "至尊版",
        "5-20x more usage than Pro": "比专业版多5-20倍的使用量",
        "From SGD 137.61": "起价137.61新元",
        "/ month billed monthly": "/ 月（月付计费）",
        "Get Max plan": "获取至尊版计划",
        "Everything in Pro, plus:": "专业版的所有功能，外加：",
        "Choose 5x or 20x more usage than Pro*": "选择比专业版多5倍或20倍的使用量*",
        "Higher output limits for all tasks": "所有任务的更高输出限制",
        "Access Claude Code directly in your terminal": "在终端中直接访问Claude Code",
        "Access to advanced Research": "访问高级研究功能",
        "Connect any context or tool through Integrations": "通过集成连接任何上下文或工具",
        "Early access to advanced Claude features": "抢先体验Claude高级功能",
        "Priority access at high traffic times": "高峰时段优先访问",
        "Get help": "获取帮助",
        "View all plans": "查看所有计划",
        "Personal": "个人",
        "Write": "写作",
        "Learn": "学习",
        "Code": "编程",
        "Life stuff": "生活点滴",
        "Claude’s choice": "Claude 精选",
        "NEW" : "新功能",
        "Collab with Claude in your codebase" : "在您的代码库中与Claude协作",
        "Get AI pair programming right in your terminal with Claude Code" : "在终端中使用Claude Code进行AI配对编程",
        "Ship better code faster, and understand complex codebases with ease" : "更快地发布更好的代码，轻松理解复杂的代码库",
        "Available through the research preview and billed through your Anthropic Console account based on API usage" : "通过研究预览版本提供，并根据API使用情况通过您的Anthropic Console账户计费",
        "Team up with Claude" : "与Claude组建团队",
        "Create Team Account" : "创建团队账户",
        "Everything in Pro" : "包含Pro版的所有功能",
        "Higher usage limits" : "更高的使用限制",
        "Early access to new collaboration features" : "抢先体验新协作功能",
        "Central billing and administration" : "集中计费与管理",
        "Color mode" : "颜色模式",
        "Chat font" : "聊天字体",
        "Log out of all devices" : "在所有设备上注销",
        "Delete your account" : "删除您的账户",
        "Get 5x more usage with Claude Pro" : "通过Claude Pro获得5倍更多使用次数",
        "Subscribe to Pro" : "订阅Pro版",
        "More usage than Free" : "比免费版有更多使用次数",
        "Organize documents and chats with Projects" : "通过项目组织文档和聊天",
        "Access additional Claude models" : "访问额外的Claude模型",
        "Use Claude 3.7 Sonnet with extended thinking mode" : "使用Claude 3.7 Sonnet并启用扩展思维模式",
        "Connected accounts" : "关联账户",
        "Analysis tool" : "分析工具",
        "Feature preview" : "功能预览",
        "Artifacts" : "产物",
        "Claude capabilities" : "Claude的基本能力",
        "Anthropic’s guidelines" : "Anthropic的指导原则",
        "Learn about preferences" : "了解更多关于偏好的信息。",
        "Your preferences will apply to all conversations, within" : "您的偏好设置将适用于所有对话，并遵循",
        "Usage policy" : "使用政策",
        "Privacy policy" : "隐私政策",
        "How can I help you today?": "我今天能帮你做些什么？",
        "Fastest model for daily tasks": "日常任务中最快的模型",
        "Our most intelligent model yet": "我们迄今为止最智能的模型",
        "Upgrade": "升级",
        "What’s new": "最近怎样",
        "Beta": "测试",
        "BETA": "测试",
        "Language": "语言",
        "Download Claude for Windows": "下载 Claude Windows 版",
        "Log out": "登出",
        "Free plan": "免费用户",
        "Chats": "历史对话",
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
        "System": "系统",
        "Light": "浅色",
        "Dark": "深色",
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
        "Export data": "导出数据",
        "Export Data": "导出数据",
        "Delete account": "删除账户",
        "Contact Support": "联系支持",
        "About Anthropic": "关于 Anthropic",
        "Consumer Terms": "用户条款",
        "Usage Policy": "使用政策",
        "Privacy Policy": "隐私政策",
        "Your Privacy Choices": "您的隐私选择",
        "Provide stakeholder perspective": "提供利益相关者视角",
        "Generate excel formulas": "生成 Excel 公式",
        "Try this prompt": "试试这个提示",
        "Polish your prose": "润色您的文笔",
        "Write a memo": "写一份备忘录",
        "Use projects to organize chats and give Claude knowledge context": "使用项目组织对话并给Claude知识上下文",
        "Reload suggestions": "重新加载提示",
        "Hide suggestions": "隐藏提示",
        "Good afternoon": "下午好",
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
                    translateWithGoogleAPI(trimmedText).then(translatedText => {
                        node.textContent = translatedText;
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
            // 处理链接文本
            if (node.tagName === 'A' && node.textContent.trim() in translations) {
                node.textContent = translations[node.textContent.trim()];
            }
        }
    }

    // 使用Google Translate API进行翻译
    async function translateWithGoogleAPI(text) {
        if (translationCache[text]) {
            return translationCache[text];
        }

        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const translatedText = data[0][0][0];
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

        translateSpecificElements();
    }

    // 添加对特定元素的翻译
    function translateSpecificElements() {
        document.querySelectorAll('.font-styrene .break-words.text-sm.font-medium.leading-tight').forEach(element => {
            translateElementContent(element);
        });

        document.querySelectorAll('.sticky .font-tiempos.truncate').forEach(element => {
            translateElementContent(element);
        });
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

    // 监听输入框内容变化
    const editableElements = document.querySelectorAll('[contenteditable="true"], textarea');
    editableElements.forEach(element => {
        element.addEventListener('input', (event) => {
            handleTranslationUpdate(event.target);
        });
    });

    // 更新编辑框的翻译
    function handleTranslationUpdate(element) {
        const updatedText = element.value || element.textContent;
        updateTranslationForElement(element, updatedText);
    }

    function updateTranslationForElement(element, text) {
        if (translationCache[text]) {
            element.textContent = translationCache[text];
        } else {
            translateWithGoogleAPI(text).then(translatedText => {
                element.textContent = translatedText;
                translationCache[text] = translatedText;
            });
        }
    }

    // 强制更新编辑框内容
    setTimeout(() => {
        editableElements.forEach(element => {
            element.dispatchEvent(new Event('input'));
        });
    }, 50);

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

                        translateSpecificElements();
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 定时翻译检查
    let translationInterval = setInterval(() => {
        translatePage();
        if (document.readyState === 'complete') {
            clearInterval(translationInterval);
            setInterval(translateSpecificElements, 5000);
        }
    }, 1000);

    // 初始翻译
    translatePage();
})();
