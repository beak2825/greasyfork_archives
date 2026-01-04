// ==UserScript==
// @name         ChatGPT 界面汉化脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  尝试将 ChatGPT 界面汉化
// @author       Kailous
// @match        *://*chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481425/ChatGPT%20%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481425/ChatGPT%20%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("汉化脚本开始执行。");
    // 汉化映射表
    const translationMap = {
        "Send message": "发送消息",
        "ChatGPT can make mistakes. Consider checking important information.": "ChatGPT 可能会出错。 考虑检查重要信息。",
        "My plan": "我的计划",
        "My GPTs": "我的 GPTs",
        "Custom instructions": "自定义指令",
        "Settings & Beta": "设置与 Beta",
        "Log out": "登出",
        "Share": "分享",
    "Rename": "重命名",
    "Delete chat": "删除聊天",
        "Recently Used": "最近使用",
    "Made by OpenAI": "由 OpenAI 创建",
    "Remove from Recent": "从最近中移除",
    "Edit": "编辑",
    "Delete GPT": "删除 GPT",
    "Load more": "加载更多",
    "Create a GPT ": "创建一个 GPT",
    "Customize a version of ChatGPT for a specific purpose": "定制特定用途的 ChatGPT 版本",
    "Upgrade your plan": "升级您的计划",
    "Plus": "高级版",
    "USD $20/month": "20美元/月",
    "Your current plan": "您当前的计划",
    "Access to GPT-4, our most capable model": "访问 GPT-4，我们最强大的模型",
    "Browse, create, and use GPTs": "浏览、创建和使用 GPTs",
    "Access to additional tools like DALL·E, Browsing, Advanced Data Analysis and more": "访问额外工具如 DALL·E、浏览、高级数据分析等",
    "Manage my subscription": "管理我的订阅",
    "I need help with a billing issue": "我需要账单问题帮助",
    "Need more capabilities? See ChatGPT Enterprise": "需要更多功能？查看 ChatGPT 企业版",
    "Personalize your builder profile to connect with users of your GPTs. These settings apply to publicly shared GPTs.": "个性化您的构建者档案，以与使用您的 GPTs 的用户建立联系。这些设置适用于公开共享的 GPTs。",
    "Name": "名称",
    "Website": "网站",
    "Select a domain": "选择一个域名",
    "General": "通用",
    "Beta features": "测试功能",
    "Data controls": "数据控制",
    "Builder profile": "构建者档案",
    "Theme": "主题",
        "Share chat":"分享聊天",
        "Share link to Chat":"分享聊天链接",
        "Sharing conversations with images is not yet supported":"尚不支持与图像共享对话",
        "Messages you send after creating your link won't be shared. Anyone with the URL will be able to view the shared chat.":"您在创建链接后发送的消息将不会被共享。 知道该 URL 的任何人都可以查看共享聊天。",
        "Any personalized data not present in the conversation won’t be shared with viewers (ex: custom instructions).":"对话中不存在的任何个性化数据都不会与查看者共享（例如：自定义说明）。",
        "More Info":"更多信息",
        "Copy Link":"复制链接",
        "Share your name":"分享你的名字",
        "What would you like ChatGPT to know about you to provide better responses?":"您希望 ChatGPT 了解您的哪些信息以便提供更好的回复？",
        "How would you like ChatGPT to respond?":"您希望 ChatGPT 如何回应？",
        "Enable for new chats":"启用新聊天",
        "Save":"保存",
        "Archived chats":"存档的聊天记录",
        "Archived Chats":"存档的聊天记录",
        "Archive chat":"存档聊天记录",
        "You have no archived conversations.":"您没有存档的对话。",
        "Manage":"管理",
        "Delete all chats":"删除所有聊天记录",
        "Delete all":"删除所有",
    "System": "系统",
    "Dark":"暗色模式",
    "Light":"亮色模式",
    "Clear all chats": "清除所有聊天",
    "Chat history & training": "聊天历史和训练",
    "Save new chats on this browser to your history and allow them to be used to improve our models. Unsaved chats will be deleted from our systems within 30 days. This setting does not sync across browsers or devices.": "将新聊天保存在此浏览器的历史记录中，并允许用来提升我们的模型。未保存的聊天将在30天内从我们的系统中删除。此设置不会在浏览器或设备间同步。",
    "Shared links": "共享链接",
    "Export data": "导出数据",
    "Delete account": "删除账户",
    "Plugins": "插件",
    "Try a version of ChatGPT that knows when and how to use third-party plugins that you enable.": "尝试一个版本的 ChatGPT，它知道何时以及如何使用您启用的第三方插件。",
    "As a Plus user, enjoy early access to experimental new features, which may change during development.": "作为 Plus 用户，享受实验性新功能的早期访问权，这些功能在开发过程中可能会发生改变。",
        "Clear your conversation history - are you sure?": "清除您的对话历史 - 您确定吗？",
"Cancel": "取消",
"Confirm deletion": "确认删除",
"Shared Links": "共享链接",
"Name": "名称",
"Date shared": "共享日期",
"Delete all shared links": "删除所有共享链接",
"Request data export - are you sure?": "请求数据导出 - 您确定吗？",
"Your account details and conversations will be included in the export.": "您的账户详情和对话将包含在导出中。",
"The data will be sent to your registered email in a downloadable file.": "数据将发送到您注册的邮箱中，附带可下载文件。",
"The download link will expire 24 hours after you receive it.": "下载链接将在您收到后24小时内过期。",
"Processing may take some time. You'll be notified when it's ready.": "处理可能需要一些时间。准备就绪后将通知您。",
"To proceed, click \"Confirm export\" below.": "要继续，请点击下方的“确认导出”。",
"Delete account - are you sure?": "删除账户 - 您确定吗？",
"Deleting your account is permanent and cannot be undone.": "删除账户是永久性的，不能撤销。",
"Deletion will prevent you from accessing OpenAI services, including ChatGPT, API, and DALL·E.": "删除后您将无法访问OpenAI服务，包括 ChatGPT、API 和 DALL·E。",
"You cannot create a new account using the same email address.": "您不能使用相同的邮箱地址创建新账户。",
"Your data will be deleted within 30 days, except we may retain a limited set of data for longer where required or permitted by law.": "您的数据将在30天内删除，法律要求或允许的情况下，我们可能会保留有限的数据集更长时间。",
"Read our help center article for more information.": "阅读我们的帮助中心文章以获取更多信息。",
"You may only delete your account if you have logged in within the last 10 minutes. Please log in again, then return here to continue.": "您只能在最近10分钟内登录后删除您的账户。请重新登录，然后返回此处继续。",
"Verify new domain": "验证新域名",
"GPT-4": "GPT-4",
"With DALL·E, browsing and analysis": "搭配DALL·E，浏览和分析功能",
"Limit 40 messages / 3 hours": "限制 40 条消息 / 3 小时",
"GPT-3.5": "GPT-3.5",
"Great for everyday tasks": "适用于日常任务",
"Create": "创建",
"Configure": "配置",
"Preview": "预览",
"Name your GPT": "为您的GPT命名",
"Description": "描述",
"Add a short description about what this GPT does": "添加关于这个GPT功能的简短描述",
"Instructions": "指令",
"What does this GPT do? How does it behave? What should it avoid doing?": "这个GPT能做什么？它会如何行动？有什么应该避免的？",
"Conversation starters": "对话开始",
"Knowledge": "知识",
"Upload files": "上传文件",
"Capabilities": "能力",
"Web Browsing": "网页浏览",
"DALL·E Image Generation": "DALL·E 图像生成",
"Code Interpreter": "代码解释器",
"Actions": "动作",
"Create new action": "创建新动作",
"Message .*…": "发送消息给",
        "Keep in sidebar": "保留在侧边栏",
    "Hide from sidebar": "从侧边栏隐藏",
    "New chat": "新聊天",
    "About": "关于",
    "Privacy settings": "隐私设置",
    "Copy link": "复制链接",
    "Report": "报告问题",
    "Powered by GPT-4": "由 GPT-4 驱动",
    "Browsing, Advanced Data Analysis, and DALL·E are now built into GPT-4": "浏览、高级数据分析和 DALL·E 现已集成于 GPT-4",
    "GPT's privacy settings": "GPT 的隐私设置",
    "Select which 3rd party actions are allowed in conversations with Canva.": "选择允许在与 Canva 对话中使用哪些第三方操作。",
    "Always allow": "总是允许",
    "Ask": "询问",
    "Please tell us why you are reporting": "请告诉我们您举报的原因",
    "Your help allows us to take the correct action on the reported GPT": "您的帮助让我们能对被举报的 GPT 采取正确行动",
    "This content is illegal or unlawful": "此内容是非法或违法的",
    "This content is harmful or unsafe": "此内容有害或不安全",
    "Other Reason": "其他原因",

        // 添加更多的映射...
    };
    // 修改后的 placeholder 翻译函数
    function translatePlaceholder() {
        Object.keys(translationMap).forEach((text) => {
            try {
                // 适配类似 "Message ChatGPT…" 的 placeholder
                if (text.startsWith("Message ")) {
                    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((element) => {
                        if (element.placeholder.includes("Message ")) {
                            element.placeholder = element.placeholder.replace("Message ", translationMap[text]);
                        }
                    });
                } else {
                    // 处理其他普通 placeholder 翻译
                    const elements = document.querySelectorAll(`[placeholder="${text}"]`);
                    elements.forEach((element) => {
                        const translation = translationMap[text];
                        if (translation) {
                            element.placeholder = translation;
                        }
                    });
                }
            } catch (error) {
                console.error("翻译 placeholder 时出错：", error);
            }
        });
    }
   // 修改后的文本节点汉化函数
    function translateNode(node) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            const textContent = node.textContent.trim();
            const translation = translationMap[textContent];
            if (translation) {
                console.log(`找到需要翻译的文本: "${textContent}"`);
                node.textContent = translation;
            }
        } else {
            node.childNodes.forEach(translateNode);
        }
    }

    // 修改后的观察者回调
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        console.log("检测到 DOM 变更，应用汉化。");
                        translateNode(node);
                        // 如果您的页面有用到 placeholder，取消下面这行的注释
                        translatePlaceholder();
                    }
                });
            }
        }
    });

    // 启动观察者
    observer.observe(document.body, { childList: true, subtree: true });

    // 翻译已有的节点
    translateNode(document.body);
    // 如果您的页面有用到 placeholder，取消下面这行的注释
    translatePlaceholder();

    console.log("汉化脚本执行完毕。");
})();