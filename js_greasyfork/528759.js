// ==UserScript==
// @name         AI 解卦辅助工具
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  只是一个解卦工具
// @author       NULLUSER
// @match        https://www.china95.net/paipan/*
// @match        https://paipan.china95.net/*
// @require      https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528759/AI%20%E8%A7%A3%E5%8D%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/528759/AI%20%E8%A7%A3%E5%8D%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // ==                         核心配置与状态变量                             ==
    // =========================================================================
    const S_version = GM_info.script.version; // 脚本当前版本号
    const DENO_SERVER_URL = 'https://works.shatang.me'; // 后端服务基准URL

    let settings = {}; // 存储用户配置（API Key, 模型, WORK ID等）
    let conversations = []; // 存储所有已保存的历史对话（每个对话包含多条消息）
    let currentConversation = []; // 存储当前活跃对话的消息流
    // let SHOW_URL = ''; // 不再直接使用此变量，已注释或删除

    // 脚本的默认设置
    const DEFAULTS = { apiKey: '', model: 'gemini-2.5-flash', workId: '01', maxHistory: 30, panelWidth: 520 };

    // UI元素的全局引用，便于访问和操作
    let analysisContainer, chatLogContainer, questionInput, sendButton, toggleButton;
    let isUserScrolledUp = false; // 标记用户是否已向上滚动，用于智能滚动判断

    // =========================================================================
    // ==                         界面样式定义 (CSS-in-JS)                      ==
    // =========================================================================
    // UI设计常量
    const BORDER_RADIUS = '14px'; // 统一的圆角大小
    const BOX_SHADOW = '0 12px 35px -8px rgba(0, 0, 0, 0.5)'; // 阴影效果
    // 字体栈：优先使用苹果和微软系统的圆润字体，确保中文显示美观
    const FONT_FAMILY = `"SF Pro SC", "SF Pro Display", "SF Pro Text", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif`;
    // 主题强调色渐变：紫罗兰色系
    const ACCENT_GRADIENT = 'linear-gradient(135deg, #a78bfa, #6d28d9)'; // Violet-400 to Violet-700
    const ACCENT_COLOR = '#8b5cf6'; // Violet-500，用于单色强调

    // 注入CSS样式规则
    GM_addStyle(`
        /* 关键帧动画：用于消息淡入等效果 */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* 主面板容器："暗夜极光"主题优化版 */
        #ai-gua-container {
            position: fixed; top: 20px; right: 20px; height: calc(100vh - 40px);
            background: #18181B; /* 深色背景 */
            color: #d4d4d8; /* 默认文本颜色 */
            z-index: 1000; padding: 0; box-shadow: ${BOX_SHADOW}; border-radius: ${BORDER_RADIUS};
            display: flex; flex-direction: column; font-family: ${FONT_FAMILY};
            border: 1px solid #27272a; /* 边框颜色 */
            resize: horizontal; overflow: auto; min-width: 420px; max-width: 90vw; /* 可调整大小 */
            transition: all 0.3s ease; /* 过渡动画 */
        }
        #ai-gua-container.hidden { display: none; } /* 隐藏状态 */

        /* 悬浮切换按钮 */
        #ai-toggle-button {
            position: fixed; top: 20px; right: 20px; z-index: 1001;
            background: ${ACCENT_GRADIENT}; border: none; color: white;
            padding: 12px 18px; font-size: 16px; cursor: pointer;
            border-radius: ${BORDER_RADIUS}; box-shadow: ${BOX_SHADOW};
            transition: all 0.3s ease; display: flex; align-items: center; gap: 8px;
            font-family: ${FONT_FAMILY};
        }
        #ai-toggle-button:hover { transform: scale(1.05); } /* 鼠标悬停放大效果 */

        /* 面板头部区域 */
        #ai-gua-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 16px; background-color: #1f1f23; /* 头部背景色 */
            border-bottom: 1px solid #27272a; border-top-left-radius: ${BORDER_RADIUS}; border-top-right-radius: ${BORDER_RADIUS};
        }
        #ai-gua-header h2 { margin: 0; font-size: 1.2em; color: #f9fafb; white-space: nowrap; font-weight: 600; }
        #ai-gua-header h2 .version { font-size: 0.7em; color: #9ca3af; margin-left:8px; }
        #ai-gua-header .header-buttons { display: flex; align-items: center; }
        #ai-gua-header .header-buttons button {
            background: transparent; border: none; color: #c4b5fd; /* 按钮图标颜色 */
            cursor: pointer; margin-left: 4px; transition: all 0.2s; padding: 6px; border-radius: 8px;
        }
        #ai-gua-header .header-buttons button svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 1.5; }
        #ai-gua-header .header-buttons button:hover { background-color: rgba(255,255,255,0.1); color: white; transform: scale(1.1); }

        /* 聊天记录区域 */
        #chat-log-container { position: relative; flex-grow: 1; overflow-y: auto; padding: 20px; word-break: break-word; }
        .message { margin-bottom: 24px; max-width: 98%; display: flex; flex-direction: column; animation: fadeIn 0.5s ease-out; }
        .message-bubble { padding: 16px 20px; line-height: 1.7; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-size: 16px; /* 增大字体 */ }

        /* 用户消息气泡 */
        .user-message { align-self: flex-end; align-items: flex-end; }
        .user-message .message-bubble { background: ${ACCENT_GRADIENT}; color: #FFFFFF; border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} 4px ${BORDER_RADIUS}; }

        /* AI消息气泡 */
        .ai-message { align-self: flex-start; align-items: flex-start; }
        .ai-message .message-bubble { background-color: #27272a; color: #d4d4d8; border-radius: ${BORDER_RADIUS} ${BORDER_RADIUS} ${BORDER_RADIUS} 4px; }

        /* 系统警报消息（不记录到历史） */
        .system-alert { align-self: center; width: 100%; max-width: 100%;}
        .system-alert .message-bubble { background-color: #7f1d1d; color: #fecaca; padding: 15px; border-radius: ${BORDER_RADIUS}; }

        /* 欢迎界面 */
        .welcome-screen { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; text-align: center; color: #6b7280;}
        .message-bubble h3 { font-size: 1.15em; margin: 0 0 10px 0; color: #e5e7eb; font-weight: 600; border-bottom: 1px solid #4b4664; padding-bottom: 10px; }
        .message-bubble .model-name { font-size: 0.8em; color: #a1a1aa; margin-bottom: 12px; font-weight: 400; display: block; background: #3f3f46; padding: 2px 8px; border-radius: 6px; display: inline-block; }
        .message-bubble .analysis-section { margin-top: 15px; }
        .message-bubble .analysis-section strong { font-size: 1.05em; color: ${ACCENT_COLOR}; display: block; margin-bottom: 8px; font-weight:600; }
        .message-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #4b4664; font-size: 0.8em; color: #a5b4fc; }
        .share-btn {
            background: transparent; border: 1px solid #a5b4fc; color: #a5b4fc;
            padding: 4px 10px; border-radius: 6px; cursor: pointer; transition: all 0.2s;
            display: inline-flex; align-items: center; gap: 4px; font-size: 0.9em;
        }
        .share-btn:hover { background: #a5b4fc; color: #1c192c; }
        .share-btn.copied { background: #22C55E; color: white; border-color:#22C55E; }

        /* 输入区域 */
        #input-area { padding: 16px; border-top: 1px solid #27272a; background-color: #1f1f23; position:relative; }
        #question-input {
            width: 100%; height: 80px; padding: 14px; padding-right: 35px; /* 为清空按钮留出空间 */
            margin-bottom: 16px; border: 1px solid #3f3f46; border-radius: 10px;
            background-color: #18181B; color: #e4e4e7; font-size: 16px; resize: vertical;
            outline: none; transition: all 0.3s ease; box-sizing: border-box;
        }
        #question-input:focus { border-color: ${ACCENT_COLOR}; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.4); }

        /* 输入框清空按钮 */
        #clear-input-btn { position: absolute; top: 30px; right: 30px; background: transparent; border: none; color: #71717a; cursor: pointer; padding: 5px; display: none; }
        #clear-input-btn:hover { color: #e4e4e7; }

        /* 发送按钮 */
        #send-button {
            background: ${ACCENT_GRADIENT}; border: none; color: white;
            padding: 12px 28px; font-size: 16px; font-weight: 600; cursor: pointer;
            border-radius: 10px; transition: all 0.3s ease;
        }
        #send-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px -5px rgba(139, 92, 246, 0.5); }
        #send-button:disabled { background: #4b5563; cursor: not-allowed; transform: none; box-shadow: none; }

        /* 新消息提示按钮（智能滚动使用） */
        #new-message-prompt {
            position: absolute; bottom: 180px; left: 50%; transform: translateX(-50%);
            background: ${ACCENT_COLOR}; color: white; padding: 8px 16px; border-radius: 20px;
            cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10; display: none;
            animation: fadeIn 0.3s; font-size: 0.9em;
        }

        /* 模态弹窗通用样式 */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 2000; display: flex; justify-content: center; align-items: center; }
        .modal-content { background:  #282a36; padding: 24px; border: 1px solid #44475a; width: 650px; max-width: 95vw; border-radius: ${BORDER_RADIUS}; font-family: ${FONT_FAMILY}; position: relative; }
        .modal-content h2 { margin: 0 0 20px 0; color: #f8f8f2; }
        .modal-content label { display: block; margin-top: 15px; margin-bottom: 5px; color: #f8f8f2; font-size: 0.95em; }
        .modal-content input { width: 100%; padding: 10px; border: 1px solid #6272a4; border-radius: 8px; background-color: #383a59; color: #f8f8f2; box-sizing: border-box; font-size: 1em; }
        .modal-content .button-group { margin-top: 25px; text-align: right; }
        .modal-content .button-group button { background: ${ACCENT_GRADIENT}; border: none; color: white; padding: 10px 20px; cursor: pointer; border-radius: 8px; margin-left: 10px; font-weight: 500;}
        .modal-content .button-group button.secondary { background: #6272a4; }
        .modal-content .close-modal-btn { position: absolute; top: 10px; right: 10px; }

        /* 历史记录弹窗特有样式 */
        .history-group h3 { font-size: 0.9em; color: #bd93f9; margin: 16px 0 8px 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        .history-item { background-color: transparent;display: flex; align-items: center; padding: 12px; border-radius: 10px; transition: background-color 0.2s; }
        .history-item:hover { background-color: #383a59; }
        .history-item-title { color: #f8f8f2; flex-grow: 1; margin: 0 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; font-size: 1.05em; }
        .history-item-title input { background: #383a59; border: 1px solid ${ACCENT_COLOR}; color:#f8f8f2; padding: 6px 10px; border-radius: 6px; width: 100%; box-sizing: border-box; font-size: 1em; }
        .history-item-actions { display: inline-flex; gap: 4px; }
        .history-item-actions button { background: transparent; border: none; color: #f8f8f2; cursor: pointer; padding: 4px; transition: color 0.2s;}
        .history-item-actions button svg { width: 18px; height: 18px; }
        .history-item-actions button:hover { color: #8be9fd; }
    `);

    // =========================================================================
    // ==                             SVG图标定义                               ==
    // =========================================================================
    // 用于界面元素的SVG图标，减少HTTP请求，提高加载速度和显示质量
    const ICONS = {
        saveAndNew: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338A2.25 2.25 0 0017.088 3.75H15M12 3.75v9m-4.5-4.5h9" /></svg>`,
        history: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>`,
        settings: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.481.398.688 1.054.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613.438-.995s-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.073-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
        close: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
        welcome: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456 2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" /></svg>`,
        share: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.828a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z" /></svg>`,
        rename: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343zM4.5 12.25l10-10l1.25 1.25-10 10-1.25-1.25z"/></svg>`,
        restore: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M15.312 11.344A8.001 8.001 0 004.688 8.656a.75.75 0 011.062-1.062 6.5 6.5 0 019.19 9.19.75.75 0 11-1.06 1.062A7.96 7.96 0 0015.312 11.344zM4.75 4.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-3.75v3.75a.75.75 0 01-1.5 0v-4.5z" clip-rule="evenodd"/></svg>`,
        trash: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022A18.809 18.809 0 015.22 6.02a.75.75 0 00.867.625l.89-.125a.75.75 0 01.625.866l-.125.89a.75.75 0 00.625.867l.89-.125a.75.75 0 01.625.866l-.125.89a.75.75 0 00.625.867l1.498.212A.75.75 0 0015 11.25v-2.365a.75.75 0 00-1.482-.23l-.022.149a18.81 18.81 0 01-1.242-2.102.75.75 0 00-.625-.867l-.89.125a.75.75 0 01-.866-.625l.125-.89a.75.75 0 00-.867-.625l-.89.125a.75.75 0 01-.866-.625l.125-.89A2.75 2.75 0 008.75 1zM11.25 1a2.75 2.75 0 012.75 2.75v.443c.795.077 1.58.22 2.365.468a.75.75 0 11-.23 1.482l-.149-.022a18.809 18.809 0 00-1.242 2.102.75.75 0 01.625.867l.89-.125a.75.75 0 00.866.625l.89.125a.75.75 0 01.625.866l-.125.89a.75.75 0 00.625.867l-1.498.212A.75.75 0 0115 11.25v2.365a.75.75 0 01-1.482.23l.022-.149a18.81 18.81 0 00-1.242-2.102.75.75 0 01-.625-.867l-.89.125a.75.75 0 00-.866-.625l-.89-.125a.75.75 0 01-.625-.866l.125-.89a.75.75 0 00-.867-.625l-.89.125a.75.75 0 01-.866-.625L8.32 3.75v-.443A2.75 2.75 0 0111.25 1z" clip-rule="evenodd"/></svg>`,
        clear: `<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>`
    };

    // =========================================================================
    // ==                    核心逻辑与辅助函数                             ==
    // =========================================================================
    /** 调试日志输出 */
    const Dbg = {
        log: (msg, ...args) => console.log(`[AI助手 v${S_version}] ${msg}`, ...args),
        err: (msg, ...args) => console.error(`[AI助手 v${S_version}] ${msg}`, ...args)
    };

    /** 安全地解析JSON字符串，失败返回null */
    const safeJsonParse = str => { try { return JSON.parse(str); } catch(e){ return null; } };

    /** 从GM存储加载设置 */
    const loadSettings = () => { settings = { ...DEFAULTS, ...safeJsonParse(GM_getValue('aiGuaSettings', '{}')) }; };

    /** 保存当前设置到GM存储（包括面板宽度） */
    const saveSettings = () => { try { settings.panelWidth = analysisContainer.offsetWidth; } catch(e){} GM_setValue('aiGuaSettings', JSON.stringify(settings)); };

    /** 从GM存储加载所有历史对话 */
    const loadConversations = () => { conversations = safeJsonParse(GM_getValue('conversations', '[]')) || []; };

    /** 保存所有历史对话到GM存储，并处理数量上限 */
    const saveConversations = () => { while (conversations.length > settings.maxHistory) { conversations.shift(); } GM_setValue('conversations', JSON.stringify(conversations)); };

    /** 归档当前对话到历史记录 */
    const archiveCurrentConversation = () => {
        if (currentConversation.length > 0) {
            const firstQuestion = currentConversation[0].question;
            const title = firstQuestion.length > 40 ? firstQuestion.substring(0, 37) + '...' : firstQuestion;
            conversations.push({ id: Date.now(), title: title || "无标题对话", messages: currentConversation });
            saveConversations();
            Dbg.log(`已归档对话: "${title}"`);
        }
    };

    /**
 * 多策略JSON提取与解析函数：
 * 1. 尝试匹配 ```json ... ``` 代码块 (更宽松的匹配)
 * 2. 尝试匹配 ``` ... ``` (不带json) 代码块 (更宽松的匹配)
 * 3. 尝试匹配第一个 { 到最后一个 } 之间的内容 (增加合法性初步校验)
 * 4. 否则，将整个文本作为JSON字符串尝试解析
 * @param {string} text - AI返回的原始文本
 * @returns {object|null} - 解析后的JSON对象或null（如果解析失败）
 */
    const extractAndParseJson = text => {
        /**
     * 安全地解析JSON字符串。
     * 捕获解析错误并返回null。
     * @param {string} str - 待解析的字符串
     * @returns {object|null} - 解析后的JSON对象或null
     */
        const safeJsonParse = (str) => { // safeJsonParse 定义在这里
            try {
                if (typeof str !== 'string' || !str.trim()) {
                    return null; // 非字符串或空字符串直接返回null
                }
                // 尝试移除可能导致解析失败的特殊字符（如BOM头 \uFEFF）和处理极端空白情况
                const cleanedStr = str.trim().replace(/^\uFEFF/, '');
                return JSON.parse(cleanedStr);
            } catch (e) {
                // 在这里打印错误信息，假设Dbg.err可用。
                // 如果Dbg不可用，请替换为console.error或适合你项目的日志方式。
                // Dbg.err("safeJsonParse 错误:", e.message, "尝试解析的字符串:", str);
                return null;
            }
        };

        let jsonString = null;

        // 统一处理输入文本，移除前后空白，这很重要，因为有时代码块前后会有多余换行
        const trimmedText = text.trim();

        // 策略1: 严格的json代码块（允许代码块前后有任何空白字符，包括换行）
        // `/s` 标志让 `.` 匹配包括换行符在内的所有字符
        const jsonBlockMatch = trimmedText.match(/```json\s*([\s\S]*?)\s*```/s);
        if (jsonBlockMatch && jsonBlockMatch[1]) {
            jsonString = jsonBlockMatch[1];
        } else {
            // 策略2: 通用代码块（允许代码块前后有任何空白字符，包括换行）
            const genericBlockMatch = trimmedText.match(/```\s*([\s\S]*?)\s*```/s);
            if (genericBlockMatch && genericBlockMatch[1]) {
                jsonString = genericBlockMatch[1];
            } else {
                // 策略3: 括号匹配
                const firstBrace = trimmedText.indexOf('{');
                const lastBrace = trimmedText.lastIndexOf('}');

                // 只有当都找到且末尾括号在开始括号之后时才尝试截取
                if (firstBrace !== -1 && lastBrace > firstBrace) {
                    let potentialJson = trimmedText.substring(firstBrace, lastBrace + 1); // 修正：lastBrase -> lastBrace
                    // 进一步检查 potentialJson 是否以有效的JSON开始字符开头（`{` 或 `[`）
                    // 某些JSON可能直接是数组，所以加上 `[`
                    if (potentialJson.trim().startsWith('{') || potentialJson.trim().startsWith('[')) {
                        jsonString = potentialJson;
                    } else {
                        jsonString = trimmedText; // 退化到策略4
                    }
                } else {
                    jsonString = trimmedText; // 策略4: 整个文本
                }
            }
        }

        // 最终尝试解析提取到的字符串
        const result = safeJsonParse(jsonString);

        // 如果解析失败，可以在此处记录详细的错误信息，方便调试
        if (!result) {
            // 假设 Dbg.err 是一个日志函数，你需要确保它在你的环境中可用
            // Dbg.err("JSON解析失败。原始文本:", text, "尝试解析的字符串:", jsonString);
        }
        return result;
    };


    // =========================================================================
    // ==                             用户界面构建                            ==
    // =========================================================================
    /** 初始化并构建AI助手的主界面 */
    const createMainUI = () => {
        // 创建主切换按钮
        toggleButton = document.createElement('button');
        toggleButton.id = 'ai-toggle-button';
        toggleButton.title = 'AI 解卦助手';
        toggleButton.innerHTML = `AI 解卦`;
        document.body.appendChild(toggleButton);

        // 创建主AI面板容器
        analysisContainer = document.createElement('div');
        analysisContainer.id = 'ai-gua-container';
        analysisContainer.className = 'hidden';
        analysisContainer.innerHTML = `
            <div id="ai-gua-header">
                <h2>AI 解卦<span class="version">v${S_version}</span></h2>
                <div class="header-buttons">
                    <button id="save-new-btn" title="保存当前对话并新建一个空白对话">${ICONS.saveAndNew}</button>
                    <button id="history-btn" title="查看并管理历史对话">${ICONS.history}</button>
                    <button id="settings-btn" title="设置API Key与模型">${ICONS.settings}</button>
                    <button id="close-btn" title="隐藏AI助手面板">${ICONS.close}</button>
                </div>
            </div>
            <div id="chat-log-container">
                <div id="new-message-prompt" title="点击滚动到底部">↓&nbsp;&nbsp;有新消息</div>
            </div>
            <div id="input-area">
                <textarea id="question-input" placeholder="请在这里输入你的问题..."></textarea>
                <button id="clear-input-btn" title="清空输入框内容">${ICONS.clear}</button>
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <label style="color:#9ca3af;display:inline-flex;align-items:center;cursor:pointer;font-size:14px">
                        <input type="checkbox" id="use-history" style="margin-right:5px" checked>基于历史追问
                    </label>
                    <button id="send-button">发送分析</button>
                </div>
            </div>`;
        document.body.appendChild(analysisContainer);

        // 缓存常用的UI元素引用 - 这些应该在元素被添加到DOM后立即获取
        chatLogContainer = document.getElementById('chat-log-container');
        questionInput = document.getElementById('question-input');
        sendButton = document.getElementById('send-button');

        // 绑定事件监听器
        toggleButton.addEventListener('click', () => {
            analysisContainer.classList.remove('hidden');
            toggleButton.style.display = 'none';
        });

        // 获取并绑定 analysisContainer 内部的按钮
        document.getElementById('close-btn').addEventListener('click', () => { archiveCurrentConversation(); analysisContainer.classList.add('hidden'); toggleButton.style.display = 'flex'; });
        document.getElementById('save-new-btn').addEventListener('click', handleSaveAndNew);
        document.getElementById('history-btn').addEventListener('click', showHistoryModal);
        document.getElementById('settings-btn').addEventListener('click', showSettingsModal);
        sendButton.addEventListener('click', handleSend);
        questionInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }); // 回车键提交
        chatLogContainer.addEventListener('click', e => { const shareBtn = e.target.closest('.share-btn'); if(shareBtn) { handleCopyToClipboard(shareBtn); } });

        // 智能滚动事件监听
        const newMessagePrompt = document.getElementById('new-message-prompt');
        chatLogContainer.addEventListener('scroll', () => {
            // 判断用户是否已向上滚动超过100px
            isUserScrolledUp = chatLogContainer.scrollHeight - chatLogContainer.scrollTop - chatLogContainer.clientHeight > 100;
            if (newMessagePrompt && !isUserScrolledUp) { // 添加 newMessagePrompt 存在性检查
                newMessagePrompt.style.display = 'none';
            }
        });
        if (newMessagePrompt) { // 添加 newMessagePrompt 存在性检查
            newMessagePrompt.addEventListener('click', () => { scrollToBottom(true); }); // 点击提示滚动到底部
        }

        // 输入框清空按钮功能
        const clearInputBtn = document.getElementById('clear-input-btn');
        if (questionInput && clearInputBtn) { // 添加存在性检查
            questionInput.addEventListener('input', () => { clearInputBtn.style.display = questionInput.value ? 'block' : 'none'; });
            clearInputBtn.addEventListener('click', () => { questionInput.value = ''; clearInputBtn.style.display = 'none'; questionInput.focus(); });
        }
    };

    /** 渲染聊天记录为空时的欢迎界面 */
    const renderEmptyState = () => { chatLogContainer.innerHTML = `<div class="welcome-screen">${ICONS.welcome}<h3>AI 解卦助手</h3><p>准备好开始了吗？<br>请在下方的输入框中提出你的问题。</p></div>`; };

    /**
     * 在聊天记录中追加一条消息
     * @param {string} content - 消息内容
     * @param {string} type - 'user', 'ai', 或 'system'
     * @param {object} options - 额外选项，如消息ID
     * @returns {string} - 生成的消息ID
     */
    const appendMessage = (content, type, options = {}) => {
        // 如果当前显示的是欢迎界面，则清空
        if (chatLogContainer.querySelector('.welcome-screen')) chatLogContainer.innerHTML = '';
        const id = options.id || `msg-${Date.now()}`;
        const messageDiv = document.createElement('div'); messageDiv.id = id; messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `<div class="message-bubble"><p>${content}</p></div>`;
        chatLogContainer.appendChild(messageDiv);
        // 如果用户未滚动，则自动滚动到底部并隐藏新消息提示
        if (!isUserScrolledUp) { scrollToBottom(true); } else { document.getElementById('new-message-prompt').style.display = 'block'; }
        return id;
    };

    /**
     * 更新指定ID消息的内容，用于加载中或最终结果显示
     * @param {string} id - 消息ID
     * @param {object|string} content - JSON分析结果对象或错误信息字符串
     * @param {object} options - {isAnalysis: true, question: "...", error: true}
     */
    const updateMessage = (id, content, options = {}) => {
        const messageDiv = document.getElementById(id); if (!messageDiv) return;
        messageDiv.className = 'message ai-message'; // 默认设为AI消息类型
        const bubbleDiv = messageDiv.querySelector('.message-bubble');

        if (options.isAnalysis) { // 是AI的分析结果
            bubbleDiv.innerHTML = `<div class="message-header"><h3>你的问题: ${options.question || '...'}</h3><span class="model-name">Model: ${settings.model}</span></div><div class="analysis-section"><strong>综合判断</strong><p>${content['结果'] || 'N/A'}</p></div><div class="analysis-section"><strong>分析过程</strong><p>${content['分析过程'] || 'N/A'}</p></div><div class="message-footer"><span>${new Date().toLocaleString()}</span><button class="share-btn" title="复制为图片">${ICONS.share} 复制</button></div>`;
        } else { // 是系统警报或加载提示
            messageDiv.classList.add('system-alert'); // 添加警报样式
            bubbleDiv.innerHTML = `<h4>系统警报</h4><p>${content}</p>`;
        }
        // 智能滚动逻辑
        if (!isUserScrolledUp) { scrollToBottom(true); } else { document.getElementById('new-message-prompt').style.display = 'block'; }
    };

    /**
     * 渲染指定对话的消息到聊天记录区域
     * @param {Array<object>} conversation - 消息数组
     */
    const renderConversation = conversation => {
        chatLogContainer.innerHTML = '';
        if (!conversation || conversation.length === 0) { renderEmptyState(); return; }
        conversation.forEach(item => {
            appendMessage(item.question, 'user');
            const aiMsgId = `ai-msg-${item.id || Date.now()}`; appendMessage('...', 'ai', {id:aiMsgId}); // 先显示占位符
            updateMessage(aiMsgId, item.result, { isAnalysis: true, question: item.question }); // 再更新为实际内容
        });
        scrollToBottom();
    };

    /**
     * 滚动聊天记录到底部
     * @param {boolean} smooth - 是否平滑滚动
     */
    const scrollToBottom = (smooth = false) => { chatLogContainer.scrollTo({ top: chatLogContainer.scrollHeight, behavior: smooth ? 'smooth' : 'auto' }); };

    /**
     * 切换输入框和发送按钮的禁用状态
     * @param {boolean} disabled - 是否禁用（true=禁用，false=启用）
     */
    const toggleInputs = (disabled) => {
        if (questionInput) questionInput.disabled = disabled;
        if (sendButton) sendButton.disabled = disabled;
        // 清空按钮在禁用时隐藏（避免误操作）
        const clearInputBtn = document.getElementById('clear-input-btn');
        if (clearInputBtn) clearInputBtn.style.display = disabled ? 'none' : (questionInput.value ? 'block' : 'none');
    };

    // =========================================================================
    // ==                       API请求与分析处理                             ==
    // =========================================================================
    /**
 * 发送用户问题和页面HTML内容到后端进行AI分析（修复输入框状态版）
 * @param {string} question - 用户提出的问题
 */
    const analyzeHTML = async question => {
        // 输入为空时直接返回
        if (!question.trim()) {
            alert("请输入需要分析的问题内容");
            return;
        }

        // 清除之前的系统警报（避免历史提示干扰）
        document.querySelectorAll('.system-alert').forEach(el => el.remove());

        // 显示用户消息
        appendMessage(question, 'user');

        // 生成加载消息ID（用于后续更新）
        const loadingMsgId = `loading-${Date.now()}`;
        appendMessage('AI分析中，请稍候...', 'ai', {
            id: loadingMsgId,
            isProcessing: true  // 标记为处理中状态
        });

        // 禁用输入框和发送按钮（防止重复提交）
        toggleInputs(true);

        try {
            // 构建请求载荷（包含用户问题、历史对话、页面HTML）
            const payload = {
                modelName: settings.model,
                modelKey: settings.apiKey,
                promptId: settings.workId,
                userData: JSON.stringify({
                    question: question,
                    history: document.getElementById('use-history').checked ? currentConversation : [], // 按需携带历史
                    htmlContent: document.body.innerHTML // 当前页面完整HTML
                })
            };

            // 发送GM_xmlhttpRequest请求
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `${DENO_SERVER_URL}/api`,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify(payload),
                    timeout: 90000, // 90秒超时
                    onload: res => resolve(res),
                    onerror: err => reject(err),
                    ontimeout: () => reject(new Error("请求超时（90秒）"))
                });
            });

            // 处理成功响应
            if (response.status === 200) {
                const rawResponse = safeJsonParse(response.responseText);
                if (!rawResponse) throw new Error("服务器返回无效JSON");

                // 提取AI分析结果（使用健壮的JSON解析器）
                const analysisResult = extractAndParseJson(rawResponse.choices?.[0]?.message?.content || "");

                if (analysisResult?.结果) {
                    // 移除加载消息
                    const loadingMsg = document.getElementById(loadingMsgId);
                    if (loadingMsg) loadingMsg.remove();

                    // 生成最终消息ID并追加
                    const finalMsgId = `ai-result-${Date.now()}`;
                    appendMessage("分析完成", 'ai', { id: finalMsgId }); // 占位符
                    updateMessage(finalMsgId, analysisResult, {
                        isAnalysis: true,
                        question: question,
                        timestamp: new Date().toLocaleString()
                    });
                } else {
                    throw new Error("AI未返回有效分析结果");
                }
            } else {
                throw new Error(`服务器返回异常状态码：${response.status} ${response.statusText}`);
            }
        } catch (error) {
            // 统一错误处理
            console.error("分析过程发生错误：", error);
            const errorMsg = error.message || "未知错误，请重试";

            // 更新加载消息为错误提示
            const loadingMsg = document.getElementById(loadingMsgId);
            if (loadingMsg) {
                loadingMsg.textContent = `❌ ${errorMsg}`;
                loadingMsg.classList.add('system-alert');
            }
        } finally {
            // 无论成功/失败/超时，最终启用输入框
            toggleInputs(false);
        }
    };

    // =========================================================================
    // ==                       弹窗与事件处理                              ==
    // =========================================================================
    /** 处理发送按钮点击或回车键提交 */
    const handleSend = () => { const q = questionInput.value; if(!q.trim()) return; questionInput.value = ''; document.getElementById('clear-input-btn').style.display = 'none'; analyzeHTML(q); };

    /** 处理“保存并新建”按钮点击 */
    const handleSaveAndNew = () => { archiveCurrentConversation(); currentConversation = []; renderEmptyState(); };

    /**
     * 通用模态弹窗创建函数
     * @param {string} content - 弹窗内容HTML
     * @returns {HTMLElement} - 弹窗的DOM元素
     */
    const showModal = content => {
        const overlay = document.createElement('div'); overlay.className = 'modal-overlay';
        overlay.innerHTML = `<div class="modal-content"><button class="header-buttons close-modal-btn" title="关闭弹窗">${ICONS.close}</button>${content}</div>`;
        document.body.appendChild(overlay);
        const closeModal = () => overlay.remove();
        overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); }); // 点击背景关闭
        overlay.querySelector('.close-modal-btn').addEventListener('click', closeModal); // 点击关闭按钮关闭
        return overlay;
    };

    /** 显示设置弹窗 */
    const showSettingsModal = () => {
        const modal = showModal(`
            <h2>设置</h2>
            <label for="api-key-input">Gemini API Key: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:${ACCENT_COLOR};">(如何获取API Key?)</a></label>
            <input type="text" id="api-key-input" value="${settings.apiKey}" placeholder="例如: AIzaSyB...ABC">
            <label for="model-input">Gemini 模型名称:</label>
            <input type="text" id="model-input" value="${settings.model}" placeholder="例如: gemini-pro">
            <label for="work-id-input">后端服务 WORK ID:</label>
            <input type="text" id="work-id-input" value="${settings.workId}" placeholder="咨询服务提供者获取，例如: 01">
            <label for="history-count-input">历史对话归档数量 (1-100):</label>
            <input type="number" id="history-count-input" value="${settings.maxHistory}" min="1" max="100">
            <div class="button-group">
                <button id="save-settings-btn">保存设置</button>
            </div>`);
        modal.querySelector('#save-settings-btn').addEventListener('click', () => {
            settings.apiKey = modal.querySelector('#api-key-input').value.trim();
            settings.model = modal.querySelector('#model-input').value.trim();
            settings.workId = modal.querySelector('#work-id-input').value.trim();
            settings.maxHistory = parseInt(modal.querySelector('#history-count-input').value, 10) || 30;
            saveSettings(); loadConversations(); // 保存后重新加载设置和对话
            alert('设置已保存！'); modal.remove();
        });
    };

    /** 显示历史记录弹窗 */
    const showHistoryModal = () => {
        // 根据日期将对话分组
        const groups = { today: [], yesterday: [], last7Days: [], older: [] };
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        conversations.forEach(conv => {
            const convDate = new Date(conv.id);
            if (convDate >= todayStart) groups.today.push(conv);
            else if (convDate >= new Date(todayStart).setDate(todayStart.getDate() - 1)) groups.yesterday.push(conv);
            else if (convDate >= new Date(todayStart).setDate(todayStart.getDate() - 7)) groups.last7Days.push(conv);
            else groups.older.push(conv);
        });

        // 渲染对话分组HTML
        const renderGroup = (title, convs) => convs.length === 0 ? '' : `
            <div class="history-group"><h3>${title}</h3>
            ${convs.slice().reverse().map(c => `<div class="history-item" data-id="${c.id}" title="${c.title}">
                <span class="history-item-title">${c.title}</span><div class="history-item-actions">
                <button class="rename-btn" title="重命名对话">${ICONS.rename}</button>
                <button class="restore-btn" title="恢复此对话到聊天面板">${ICONS.restore}</button>
                <button class="delete-btn" title="删除此对话">${ICONS.trash}</button></div></div>`).join('')}</div>`;

        // 组合所有分组的HTML，如果没有历史则显示提示
        const historyHtml = conversations.length === 0 ? '<p style="text-align:center; color:#9ca3af; padding: 20px 0;">暂无已保存的对话</p>' : renderGroup('今天', groups.today) + renderGroup('昨天', groups.yesterday) + renderGroup('过去7天', groups.last7Days) + renderGroup('更早', groups.older);

        const modal = showModal(`<h2>对话历史</h2><div style="max-height: 60vh; overflow-y: auto;">${historyHtml}</div><div class="button-group"><button id="export-history-btn" class="secondary">导出所有历史为.txt</button></div>`);

        modal.querySelector('#export-history-btn').addEventListener('click', exportHistory);
        modal.addEventListener('click', e => {
            const item = e.target.closest('.history-item'); if (!item) return;
            const convId = Number(item.dataset.id); const titleSpan = item.querySelector('.history-item-title');

            if (e.target.closest('.rename-btn')) { // 重命名按钮点击逻辑
                const currentTitle = titleSpan.textContent;
                titleSpan.innerHTML = `<input type="text" value="${currentTitle}" autofocus/>`;
                const input = titleSpan.querySelector('input'); input.focus(); input.select();
                const saveRename = () => { const newTitle = input.value.trim() || currentTitle; const convIndex = conversations.findIndex(c=>c.id===convId); if(convIndex > -1){conversations[convIndex].title=newTitle;saveConversations();titleSpan.textContent=newTitle;}else{titleSpan.textContent=currentTitle;}};
                input.addEventListener('blur', saveRename);
                // 修复历史记录重命名输入框的笔误：将 'i.blur()' 改为 'input.blur()'
                input.addEventListener('keydown', ev=>{if(ev.key==='Enter')input.blur();if(ev.key==='Escape'){input.value=currentTitle;input.blur();}});
            } else if (e.target.closest('.restore-btn') || e.target === titleSpan) { // 恢复或点击标题逻辑
                archiveCurrentConversation(); // 归档当前对话
                const conv = conversations.find(c => c.id === convId);
                if(conv){ currentConversation = conv.messages; conversations = conversations.filter(c => c.id !== convId); saveConversations(); renderConversation(currentConversation); modal.remove();}
            } else if (e.target.closest('.delete-btn')) { // 删除按钮点击逻辑
                if (confirm(`确定要删除对话 "${titleSpan.textContent}" 吗？此操作不可撤销。`)) {
                    conversations = conversations.filter(c => c.id !== convId);
                    saveConversations();
                    item.remove(); // 从DOM中移除
                }
            }
        });
    };

    /** 导出所有历史对话为TXT文件 */
    const exportHistory = () => {
        if(conversations.length === 0 && currentConversation.length === 0) { alert('没有可以导出的对话。'); return; }
        let textContent = `AI 解卦助手 - 导出时间: ${new Date().toLocaleString()}\n==================================================\n\n`;

        // 导出当前未保存的对话
        if (currentConversation.length > 0) {
            textContent += `======== 当前未保存对话 ========\n\n`;
            currentConversation.forEach(item => { textContent += `[问题]\n${item.question}\n\n[AI 回答 (by ${settings.model})]\n结果: ${item.result?.['结果']}\n分析过程: ${item.result?.['分析过程']}\n\n`; });
            textContent += `\n--------------------------------------------------\n\n`;
        }

        // 导出所有已归档的对话
        conversations.forEach((conv, index) => {
            textContent += `======== 对话 ${index + 1}: ${conv.title} ========\n\n`;
            conv.messages.forEach(item => { textContent += `[问题]\n${item.question}\n\n[AI 回答 (by ${settings.model})]\n结果: ${item.result?.['结果']}\n分析过程: ${item.result?.['分析过程']}\n\n`; });
            textContent += `\n--------------------------------------------------\n\n`;
        });

        const blob = new Blob([textContent], {type: 'text/plain;charset=utf-8'});
        const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
        link.download = `AI 解卦历史-${new Date().toISOString().split('T')[0]}.txt`;
        link.click(); URL.revokeObjectURL(link.href);
    };

    /**
     * 将消息内容（气泡）转换为Canvas并复制到剪贴板
     * @param {HTMLElement} button - 触发此操作的按钮
     */
    const handleCopyToClipboard = async button => {
        if (!navigator.clipboard?.write) { alert('您的浏览器不支持直接复制图片到剪贴板，请升级浏览器或使用Ctrl+V粘贴。'); return; }
        const bubble = button.closest('.message-bubble'); button.innerHTML = '生成中...'; button.disabled = true;
        try {
            const canvas = await html2canvas(bubble, { useCORS: true, backgroundColor: '#2d2a44', scale: 2 }); // 统一背景色避免透明问题
            canvas.toBlob(async blob => {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    button.innerHTML = '已复制 ✅'; button.classList.add('copied');
                } catch (err) { alert(`复制失败: ${err.message}`); button.innerHTML = `${ICONS.share} 复制`; }
            }, 'image/png');
        } catch (err) { alert(`生成图片失败: ${err.message}`); button.innerHTML = `${ICONS.share} 复制`; }
        finally { setTimeout(() => { button.innerHTML = `${ICONS.share} 复制`; button.disabled = false; button.classList.remove('copied'); }, 3000); }
    };

    // =========================================================================
    // ==                               初始化                              ==
    // =========================================================================
    /** 脚本主入口，负责初始化所有功能 */
    const initialize = () => {
        // 防止重复加载脚本或在非顶级框架中运行
        if (window.self !== window.top || window.hasAIGuaAssistant) return;
        window.hasAIGuaAssistant = true; Dbg.log(`脚本初始化...`);

        loadSettings(); // 优先加载设置
        createMainUI(); // 创建 UI 元素

        // 确保 analysisContainer 已经被成功创建并添加到DOM
        if (analysisContainer) {
            analysisContainer.style.width = `${settings.panelWidth}px`;
            // 面板宽度调整并保存
            let resizeTimeout;
            new ResizeObserver(() => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(saveSettings, 500);
            }).observe(analysisContainer);
        } else {
            Dbg.err("analysisContainer 未能成功创建或获取。AI助手可能无法正常显示。");
            return; // 如果核心容器都无法创建，则中止后续初始化
        }

        loadConversations();
        renderEmptyState(); // 渲染初始的欢迎界面

        // 注册油猴菜单命令
        GM_registerMenuCommand("AI助手设置", showSettingsModal);
        Dbg.log("脚本初始化完成。");
    }

    // 启动脚本初始化流程
    // 确保在DOM完全加载后再执行初始化，提高兼容性和健壮性
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }
})();