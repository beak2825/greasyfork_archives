// ==UserScript==
// @name         Bilibili Video Ad Skipper
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/StarsWhere/Bilibili-Video-Ad-Skipper
// @version      2.1
// @description  本工具利用人工智能（AI）分析哔哩哔哩（Bilibili）的弹幕和评论，能够基于概率识别视频中的广告片段，并实现自动跳过。它结合了概率机制与评论分析，从而提高了广告检测的精准度。
// @author       StarsWhere
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @connect      comment.bilibili.com
// @connect      api.openai.com
// @connect      api.deepseek.com
// @connect      generativelanguage.googleapis.com
// @connect      api.anthropic.com
// @connect      *
// @icon         https://img.picui.cn/free/2025/06/18/68524942bfc36.png
// @downloadURL https://update.greasyfork.org/scripts/539827/Bilibili%20Video%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/539827/Bilibili%20Video%20Ad%20Skipper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONSTANTS (常量定义) ---
    const settingsIconBase64 = 'https://img.picui.cn/free/2025/06/18/68524942bfc36.png'
    const API_PROVIDERS = {
        openai: {
            defaultUrl: 'https://api.openai.com/v1',
            needsUrl: false,
            models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
        },
        deepseek: {
            defaultUrl: 'https://api.deepseek.com/v1',
            needsUrl: false,
            models: ['deepseek-chat', 'deepseek-coder']
        },
        gemini: {
            defaultUrl: 'https://generativelanguage.googleapis.com/v1beta',
            needsUrl: false,
            models: ['gemini-pro', 'gemini-pro-vision']
        },
        anthropic: {
            defaultUrl: 'https://api.anthropic.com/v1',
            needsUrl: false,
            models: ['claude-3-5-sonnet-20240620', 'claude-3-haiku-20240307']
        },
        custom: {
            defaultUrl: '',
            needsUrl: true,
            models: [] // 用户可以手动输入
        }
    };

    const DEFAULT_SETTINGS = {
        theme: 'light',
        firstTimeUse: true,
        floatingPosition: { x: 50, y: 50 },
        apiProvider: 'openai',
        baseUrl: '',
        apiKey: '',
        model: '',
        enableR1Params: false,
        useLegacyOpenAIFormat: false,
        defaultSkip: true,
        probabilityThreshold: 70,
        durationPenalty: 5,
        minAdDuration: 30,
        maxAdDuration: 300,
        maxDanmakuCount: 500,
        minDanmakuForFullAnalysis: 10,
        enableWhitelist: true,
        whitelistRegex: false,
        whitelist: [
            '分', '秒', ':', '.', '空降', '指路', '感谢', '君', '跳过', '广告', '快进',
            '坐标', '时间', '分钟', '开始', '结束', '进度', '节点', '推广', '赞助',
            '商务', '合作', '链接', '购买', '优惠', '折扣'
        ],
        enableBlacklist: true,
        blacklistRegex: false,
        blacklist: ['正片', '省流', '总结', '回顾', '分享'],
        // 更改: 最新的默认提示词
        agentPrompt: `### Agent Prompt (提示词)
**角色 (Role):**
你是一个智能agent,专门分析Bilibili视频的弹幕以检测其中包含的商业广告(硬广)时间段。

**任务 (Task):**
你收到的内容包含两部分:
1. 经过整理后的弹幕文本,格式为 \`MM: SS\` 或 \`HH: MM: SS\`
2. 视频的第一条评论内容及其状态(是否为置顶评论)
你的核心任务是根据这些信息,判断视频是否含有广告,确定广告的时间段,并给出广告概率评估。

**工作流程与逻辑 (Workflow & Logic):**
**识别广告标记弹幕**:
   - 寻找"时间跳转"或"广告提示"类弹幕。
   - 常见模式:\`X分Y秒\`, \`X: Y\`, \`X.Y\`, \`感谢XX君\`, \`空降坐标\`, \`指路牌\`, \`xx秒后\`，\`X分Y郎\`，\`你猜我为什么在这\`等。
   - 注意:忽略含有"正片"、"省流"的弹幕,这些通常指向正常内容, 弹幕不会存在商业推广内容，你只是需要评估是否有类似\`路标\`的弹幕存在即可。有时候，可能会使用中文的\`一二三\`等汉字数字。
   - 特殊情况:存在一种情况，在末尾集体出现\`感谢金主\`等感谢弹幕，可以推断是**末尾广告**。

3. **广告概率评估标准**:
   - **90-100%**: 多条弹幕指向同一时间点。
   - **70-89%**: 复数弹幕指向同一时间点,模式明确,即使评论无广告信息。
   - **50-69%**: 存在弹幕指向时间点,但模式相对明确。
   - **30-49%**: 弹幕证据较弱,但存在一些可疑指向。
   - **10-29%**: 非常微弱的证据。
   - **0-9%**: 基本无广告证据。

4. **时间确定**:
   - **广告结束时间**: 弹幕指向的目标时间点，如果没有这些信息，可以自行推测。
   - **广告开始时间**: 直接使用所有指向目标时间点的弹幕中最早的弹幕的发送时间，请注意，不是这些弹幕指向的时间，而是这些弹幕出现的时间。如果没有这些信息，可以自行推测。如果是末尾广告，
   - **末尾广告**: 结束时间直接设置为*所有弹幕*的最后一个弹幕的时间，开始时间直接设置为\`感谢金主\`等词汇大量出现时。

5. **处理无广告情况**:
   - 如果弹幕中的数字都是描述性的,且没有明确的时间跳转指示。

**输出格式 (Output Format):**
统一返回以下JSON格式:
{
  "probability": 数字(0-100, 表示广告存在的概率),
  "start": "开始时间(格式: MM:SS 或 HH:MM:SS, 如果没有则为null)",
  "end": "结束时间(格式: MM:SS 或 HH:MM:SS, 如果没有则为null)",
  "note": "分析说明"
}

**注意事项**:
- probability: 0-100的整数,表示广告概率百分比。
- start/end: 当probability >= 30时必须提供,否则可为null，此外二者之差不可小于30秒，设定值参考**时间确定**
- note: 必须详细说明判断依据。
- 输出必须是纯JSON,不包含任何其他文本或markdown标记。

**最终指令 (Final Instruction):**
你的输出**必须且只能是**一个纯粹的、格式正确的JSON对象。**绝对禁止**包含任何JSON之外的文本。`
    };

    // --- STYLES (样式定义) ---
    const injectStyles = () => {
        const styleId = 'bili-ai-skipper-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            :root {
                --primary-color: #00AEEC;
                --primary-hover: #0096D6;
                --danger-color: #FF6B6B;
                --danger-hover: #FF5252;
                --success-color: #4CAF50;
                --warning-color: #FF9800;
                --text-primary: #333;
                --text-secondary: #666;
                --bg-primary: #fff;
                --bg-secondary: #f5f5f5;
                --border-color: #ddd;
                --shadow: 0 2px 8px rgba(0,0,0,0.1);
                --shadow-lg: 0 4px 16px rgba(0,0,0,0.15);
            }
    
            .dark-theme, .bili-ai-skipper-settings-backdrop.dark-theme, .bili-ai-skipper-first-time-modal.dark-theme {
                --text-primary: #e0e0e0;
                --text-secondary: #b0b0b0;
                --bg-primary: #2a2a2a;
                --bg-secondary: #1e1e1e;
                --border-color: #404040;
                --shadow: 0 2px 8px rgba(0,0,0,0.3);
                --shadow-lg: 0 4px 16px rgba(0,0,0,0.4);
            }
    
            /* 圆形悬浮按钮 */
            .bili-ai-skipper-floating-btn {
                position: fixed;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--bg-primary);
                border: 2px solid var(--primary-color);
                box-shadow: var(--shadow-lg);
                cursor: pointer;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.7;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            .bili-ai-skipper-floating-btn:hover {
                opacity: 1;
                transform: scale(1.1);
            }
            .bili-ai-skipper-floating-btn img {
                width: 24px;
                height: 24px;
            }
    
            /* Toast 消息 */
            .bili-ai-skipper-toast {
                position: fixed; top: 20px; right: 20px;
                background: var(--bg-primary); color: var(--text-primary);
                padding: 12px 20px; border-radius: 8px; box-shadow: var(--shadow-lg);
                z-index: 10001; font-size: 14px; border-left: 4px solid var(--primary-color);
                max-width: 300px; word-wrap: break-word; animation: slideInRight 0.3s ease;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
    
            /* 设置界面 */
            .bili-ai-skipper-settings-backdrop {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5); z-index: 10002;
                display: flex; align-items: center; justify-content: center;
                animation: fadeIn 0.2s ease;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
            .bili-ai-skipper-settings-modal {
                background: var(--bg-primary); color: var(--text-primary);
                border-radius: 12px; width: 90%; max-width: 900px; height: 800px;
                display: flex; flex-direction: column; box-shadow: var(--shadow-lg);
                animation: slideInDown 0.3s ease; overflow: hidden;
            }
            .bili-ai-skipper-settings-modal.dark-theme {
                background: var(--bg-primary); color: var(--text-primary);
            }
            @keyframes slideInDown {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
    
            .bili-ai-skipper-settings-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px; border-bottom: 1px solid var(--border-color);
                background: var(--bg-secondary); flex-shrink: 0;
            }
            .bili-ai-skipper-settings-title {
                margin: 0; font-size: 18px; font-weight: 600; color: var(--text-primary);
            }
            .bili-ai-skipper-settings-close {
                background: none; border: none; font-size: 24px; cursor: pointer;
                color: var(--text-secondary); padding: 0; width: 30px; height: 30px;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                transition: all 0.2s ease;
            }
            .bili-ai-skipper-settings-close:hover { background: var(--danger-color); color: white; }
    
            .bili-ai-skipper-settings-body {
                padding: 0; flex-grow: 1; overflow-y: auto;
            }
            .bili-ai-skipper-settings-tabs {
                display: flex; background: var(--bg-secondary);
                border-bottom: 1px solid var(--border-color); flex-shrink: 0;
            }
            .bili-ai-skipper-settings-tab {
                flex: 1; padding: 15px 20px; border: none; background: none;
                color: var(--text-secondary); cursor: pointer; transition: all 0.2s ease;
                font-size: 14px; font-weight: 500;
            }
            .bili-ai-skipper-settings-tab.active {
                color: var(--primary-color); background: var(--bg-primary);
                border-bottom: 2px solid var(--primary-color);
            }
            .bili-ai-skipper-settings-tab:hover:not(.active) {
                color: var(--text-primary); background: var(--bg-primary);
            }
            .bili-ai-skipper-tab-content { display: none; padding: 20px; }
            .bili-ai-skipper-tab-content.active { display: block; }
    
            .bili-ai-skipper-settings-section { margin-bottom: 25px; }
            .bili-ai-skipper-settings-section:last-child { margin-bottom: 0; }
            .bili-ai-skipper-settings-section h3 {
                margin: 0 0 15px 0; font-size: 16px; font-weight: 600;
                color: var(--text-primary); border-bottom: 1px solid var(--border-color);
                padding-bottom: 8px;
            }
            .bili-ai-skipper-settings-group { margin-bottom: 15px; }
            .bili-ai-skipper-settings-group-inline { display: flex; gap: 15px; margin-bottom: 15px; }
            .bili-ai-skipper-settings-group-inline > div { flex: 1; }
            .bili-ai-skipper-settings-label {
                display: block; margin-bottom: 5px; font-weight: 500;
                color: var(--text-primary); font-size: 14px;
            }
            .bili-ai-skipper-settings-input,
            .bili-ai-skipper-settings-select,
            .bili-ai-skipper-list-input input[type="text"] {
                width: 100%; padding: 10px 12px; border: 1px solid var(--border-color);
                border-radius: 6px; background: var(--bg-primary); color: var(--text-primary);
                font-size: 14px; transition: all 0.2s ease; box-sizing: border-box;
            }
            .bili-ai-skipper-settings-input:focus,
            .bili-ai-skipper-settings-select:focus,
            .bili-ai-skipper-list-input input[type="text"]:focus {
                outline: none; border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(0, 174, 236, 0.2);
            }
            .bili-ai-skipper-settings-textarea {
                width: 100%; min-height: 440px; padding: 12px;
                border: 1px solid var(--border-color); border-radius: 6px;
                background: var(--bg-primary); color: var(--text-primary);
                font-size: 14px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                line-height: 1.5; resize: vertical; transition: all 0.2s ease;
                box-sizing: border-box;
            }
            .bili-ai-skipper-settings-textarea:focus {
                outline: none; border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(0, 174, 236, 0.2);
            }
            .bili-ai-skipper-settings-checkbox { display: flex; align-items: center; margin-bottom: 10px; }
            .bili-ai-skipper-settings-checkbox input[type="checkbox"] { margin-right: 8px; transform: scale(1.1); }
            .bili-ai-skipper-settings-checkbox label { cursor: pointer; font-size: 14px; color: var(--text-primary); }
    
            .bili-ai-skipper-settings-footer {
                display: flex; justify-content: space-between; align-items: center;
                padding: 20px; border-top: 1px solid var(--border-color);
                background: var(--bg-secondary); flex-shrink: 0;
            }
            .bili-ai-skipper-theme-toggle { display: flex; gap: 10px; }
            .bili-ai-skipper-theme-btn {
                width: 40px; height: 40px; border: 1px solid var(--border-color);
                border-radius: 6px; background: var(--bg-primary); cursor: pointer;
                transition: all 0.2s ease; display: flex; align-items: center;
                justify-content: center; font-size: 18px;
            }
            .bili-ai-skipper-theme-btn:hover { border-color: var(--primary-color); transform: scale(1.05); }
            .bili-ai-skipper-settings-actions { display: flex; gap: 10px; }
            .bili-ai-skipper-settings-btn-primary,
            .bili-ai-skipper-settings-btn-secondary,
            .bili-ai-skipper-list-add-btn {
                padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;
                font-size: 14px; font-weight: 500; transition: all 0.2s ease;
            }
            .bili-ai-skipper-settings-btn-primary,
            .bili-ai-skipper-list-add-btn {
                background: var(--primary-color); color: white;
            }
            .bili-ai-skipper-settings-btn-primary:hover,
            .bili-ai-skipper-list-add-btn:hover {
                background: var(--primary-hover); transform: translateY(-1px);
            }
            .bili-ai-skipper-settings-btn-secondary {
                background: var(--bg-primary); color: var(--text-primary);
                border: 1px solid var(--border-color);
            }
            .bili-ai-skipper-settings-btn-secondary:hover { background: var(--bg-secondary); }
    
            /* 列表管理 (白名单/黑名单) */
            .bili-ai-skipper-list-container { margin-top: 10px; }
            .bili-ai-skipper-list-input { display: flex; margin-bottom: 10px; }
            .bili-ai-skipper-list-input input[type="text"] { flex-grow: 1; margin-right: 10px; }
            .bili-ai-skipper-list-add-btn { padding: 0 15px; height: auto; line-height: normal; }
            .bili-ai-skipper-list-items {
                max-height: 150px; overflow-y: auto; border: 1px solid var(--border-color);
                border-radius: 4px; padding: 5px; background: var(--bg-primary);
            }
            .bili-ai-skipper-list-item {
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 5px; border-bottom: 1px solid var(--border-color);
                color: var(--text-primary);
            }
            .bili-ai-skipper-list-item:last-child { border-bottom: none; }
            .bili-ai-skipper-list-item span { flex-grow: 1; word-break: break-all; margin-right: 10px; }
            .bili-ai-skipper-list-remove-btn {
                background: none; border: none; color: var(--danger-color); cursor: pointer;
                font-size: 18px; padding: 0 5px; flex-shrink: 0;
            }
            .bili-ai-skipper-list-remove-btn:hover { color: var(--danger-hover); }
    
    
            /* 结果弹窗 */
            .bili-ai-skipper-result-popup {
                position: fixed; bottom: 20px; right: 20px; width: 350px;
                background: var(--bg-primary); color: var(--text-primary);
                border-radius: 12px; box-shadow: var(--shadow-lg); z-index: 10001;
                overflow: hidden; animation: slideInUp 0.3s ease;
                border: 1px solid var(--border-color);
            }
            .bili-ai-skipper-result-popup.dark-theme {
                background: var(--bg-primary); color: var(--text-primary); border-color: var(--border-color);
            }
            @keyframes slideInUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .bili-ai-skipper-result-popup .header {
                background: var(--primary-color); color: white;
                padding: 10px 15px; display: flex; justify-content: space-between;
                align-items: center; cursor: move;
            }
            .bili-ai-skipper-result-popup .title { font-weight: 600; font-size: 14px; }
            .bili-ai-skipper-result-popup .close-btn {
                background: none; border: none; color: white; font-size: 20px;
                cursor: pointer; padding: 0; width: 24px; height: 24px;
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                transition: all 0.2s ease; line-height: 1;
            }
            .bili-ai-skipper-result-popup .close-btn:hover { background: rgba(255, 255, 255, 0.2); }
            .bili-ai-skipper-result-popup .content {
                padding: 15px; font-size: 13px; line-height: 1.6; color: var(--text-primary);
            }
            .bili-ai-skipper-result-popup .content p { margin: 0 0 10px 0; }
            .bili-ai-skipper-result-popup .content p strong { color: var(--text-primary); }
            .bili-ai-skipper-result-popup .footer {
                padding: 10px 15px; border-top: 1px solid var(--border-color);
                background: var(--bg-secondary);
            }
            .bili-ai-skipper-result-popup .footer label {
                display: flex; align-items: center; font-size: 13px;
                color: var(--text-secondary); cursor: pointer;
            }
            .bili-ai-skipper-result-popup .footer input[type="checkbox"] { margin-right: 8px; transform: scale(1.1); }
            .bili-ai-skipper-result-popup .raw-response {
                background: var(--bg-secondary); border: 1px solid var(--border-color);
                border-radius: 4px; padding: 10px; font-family: monospace;
                font-size: 11px; white-space: pre-wrap; word-break: break-all;
                max-height: 150px; overflow-y: auto; margin-top: 8px;
                color: var(--text-secondary);
            }
            .bili-ai-skipper-result-popup details { margin-top: 10px; }
            .bili-ai-skipper-result-popup summary {
                cursor: pointer; font-size: 12px; color: var(--text-secondary);
                margin-bottom: 5px; font-weight: 500;
            }
            .bili-ai-skipper-result-popup summary:hover { color: var(--text-primary); }
            .bili-ai-skipper-result-popup.error .header { background-color: var(--danger-color); }
    
    
            /* 模型下拉框 */
            .bili-ai-skipper-model-container { position: relative; }
            .bili-ai-skipper-model-dropdown {
                position: absolute; top: 100%; left: 0; right: 0;
                background: var(--bg-primary); border: 1px solid var(--border-color);
                border-top: none; border-radius: 0 0 6px 6px; max-height: 200px;
                overflow-y: auto; z-index: 1000; box-shadow: var(--shadow);
            }
            .bili-ai-skipper-model-option {
                padding: 10px 12px; cursor: pointer; transition: background 0.2s ease;
                font-size: 14px; color: var(--text-primary);
            }
            .bili-ai-skipper-model-option:hover { background: var(--bg-secondary); }
    
            /* 首次使用模态框 */
            .bili-ai-skipper-first-time-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.7); z-index: 10003;
                display: flex; align-items: center; justify-content: center;
            }
            .bili-ai-skipper-first-time-content {
                background: var(--bg-primary); color: var(--text-primary);
                border-radius: 12px; padding: 30px; max-width: 500px; width: 90%;
                text-align: center; box-shadow: var(--shadow-lg);
            }
            .bili-ai-skipper-first-time-modal.dark-theme .bili-ai-skipper-first-time-content {
                background: var(--bg-primary); color: var(--text-primary);
            }
            .bili-ai-skipper-first-time-title {
                font-size: 24px; font-weight: 600; margin-bottom: 20px;
                color: var(--primary-color);
            }
            .bili-ai-skipper-first-time-description {
                font-size: 16px; line-height: 1.6; margin-bottom: 25px;
                color: var(--text-primary); text-align: left;
            }
            .bili-ai-skipper-first-time-description strong { color: var(--text-primary); }
            .bili-ai-skipper-first-time-input {
                width: 100%; padding: 12px; border: 1px solid var(--border-color);
                border-radius: 6px; font-size: 14px; margin-bottom: 20px;
                background: var(--bg-primary); color: var(--text-primary);
                box-sizing: border-box;
            }
            .bili-ai-skipper-first-time-actions { text-align: center; }
            .bili-ai-skipper-first-time-btn {
                background: var(--primary-color); color: white; border: none;
                padding: 12px 30px; border-radius: 6px; font-size: 16px;
                font-weight: 500; cursor: pointer; transition: all 0.2s ease;
            }
            .bili-ai-skipper-first-time-btn:disabled { background: var(--text-secondary); cursor: not-allowed; }
            .bili-ai-skipper-first-time-btn:not(:disabled):hover { background: var(--primary-hover); transform: translateY(-1px); }
    
            /* 自定义OpenAI选项组 */
            #custom-openai-options-group .bili-ai-skipper-settings-checkbox {
                margin-left: 10px;
                margin-top: 10px;
            }
            #custom-openai-options-group .bili-ai-skipper-settings-checkbox:first-child {
                margin-top: 15px;
            }
        `;
        document.head.appendChild(style);
    };

    // --- UTILITY FUNCTIONS (工具函数) ---
    const showToast = (message, duration = 3000) => {
        const settings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        const toast = document.createElement('div');
        toast.className = 'bili-ai-skipper-toast';
        if (settings.theme === 'dark') {
            toast.classList.add('dark-theme');
        }
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), duration);
    };

    const makeDraggable = (element, handle) => {
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        const dragStart = (e) => {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === handle) {
                isDragging = true;
            }
        };

        const dragEnd = () => {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        };

        const drag = (e) => {
            if (isDragging) {
                e.preventDefault();
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        };

        handle.addEventListener("mousedown", dragStart);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", dragEnd);
    };

    const timeStringToSeconds = (timeStr) => {
        if (!timeStr) return 0;
        const parts = String(timeStr).split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return parseInt(timeStr) || 0;
    };

    const secondsToTimeString = (seconds) => {
        seconds = Math.floor(seconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const pad = (num) => String(num).padStart(2, '0');
        if (h > 0) {
            return `${pad(h)}:${pad(m)}:${pad(s)}`;
        }
        return `${pad(m)}:${pad(s)}`;
    };


    // --- API FUNCTIONS (API 函数) ---
    const getVideoInfo = (bvid) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
                onload: response => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            resolve(data.data.cid);
                        } else {
                            reject(new Error('获取视频信息失败'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: () => reject(new Error('网络请求失败'))
            });
        });
    };

    const getDanmakuXml = (cid) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`,
                onload: response => resolve(response.responseText),
                onerror: () => reject(new Error('获取弹幕失败'))
            });
        });
    };

    const getTopComment = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const firstReplyItem = document.querySelector('.reply-list .root-reply-container');
                    if (!firstReplyItem) {
                        resolve({ text: '', status: '不存在置顶评论' });
                        return;
                    }

                    const commentContentElement = firstReplyItem.querySelector('.reply-content .reply-con');
                    const commentText = commentContentElement ? commentContentElement.textContent.trim() : '';

                    const isPinned = firstReplyItem.querySelector('.reply-tag .top-badge');

                    if (isPinned) {
                        if (commentText) {
                            resolve({ text: commentText, status: '存在置顶评论，内容如下：' });
                        } else {
                            resolve({ text: '', status: '存在置顶评论，但未能成功获取其内容。' });
                        }
                    } else {
                        if (commentText) {
                            resolve({ text: commentText, status: '不存在置顶评论，首条评论内容为：' });
                        } else {
                            resolve({ text: '', status: '不存在置顶评论' });
                        }
                    }
                } catch (error) {
                    console.error("获取评论失败:", error);
                    resolve({ text: '', status: '获取评论时发生错误。' });
                }
            }, 2000);
        });
    };


    const parseAndFilterDanmaku = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const danmakus = Array.from(xmlDoc.querySelectorAll('d'));

        if (danmakus.length === 0) return null;

        const settings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        let filteredDanmakus = danmakus.map(d => {
            const attr = d.getAttribute('p').split(',');
            return {
                time: parseFloat(attr[0]),
                text: d.textContent.trim()
            };
        }).filter(d => d.text.length > 0);

        if (settings.enableBlacklist && settings.blacklist.length > 0) {
            filteredDanmakus = filteredDanmakus.filter(d => {
                return !settings.blacklist.some(pattern => {
                    if (settings.blacklistRegex) {
                        try {
                            return new RegExp(pattern, 'i').test(d.text);
                        } catch (e) {
                            return d.text.toLowerCase().includes(pattern.toLowerCase());
                        }
                    } else {
                        return d.text.toLowerCase().includes(pattern.toLowerCase());
                    }
                });
            });
        }

        if (settings.enableWhitelist && settings.whitelist.length > 0) {
            filteredDanmakus = filteredDanmakus.filter(d => {
                return settings.whitelist.some(pattern => {
                    if (settings.whitelistRegex) {
                        try {
                            return new RegExp(pattern, 'i').test(d.text);
                        } catch (e) {
                            return d.text.toLowerCase().includes(pattern.toLowerCase());
                        }
                    } else {
                        return d.text.toLowerCase().includes(pattern.toLowerCase());
                    }
                });
            });
        }

        if (filteredDanmakus.length < settings.minDanmakuForFullAnalysis) {
            const simplePatterns = ['广告', '推广', '商品', '购买', '链接', '淘宝', '京东'];
            const hasAdKeywords = filteredDanmakus.some(d =>
                simplePatterns.some(pattern => d.text.includes(pattern))
            );

            if (!hasAdKeywords) {
                showToast('过滤后有效弹幕过少且无明显广告标识, 跳过分析', 3000);
                return null;
            }
        }

        if (filteredDanmakus.length > settings.maxDanmakuCount) {
            for (let i = filteredDanmakus.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filteredDanmakus[i], filteredDanmakus[j]] = [filteredDanmakus[j], filteredDanmakus[i]];
            }
            filteredDanmakus = filteredDanmakus.slice(0, settings.maxDanmakuCount);
        }

        return filteredDanmakus
            .sort((a, b) => a.time - b.time)
            .map(d => `${secondsToTimeString(d.time)} ${d.text}`)
            .join('\n');
    };

    const callAI = async (danmakuText, topCommentString) => {
        const settings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        if (!settings.apiKey) {
            throw new Error('请先配置API密钥');
        }

        const provider = API_PROVIDERS[settings.apiProvider];
        const baseUrl = settings.baseUrl || provider.defaultUrl;

        const userMessage = `弹幕内容：\n${danmakuText}\n\n评论区情况：\n${topCommentString || '无'}`;

        let requestBody, headers, url;

        headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`
        };
        url = `${baseUrl}/chat/completions`;
        requestBody = {
            model: settings.model,
            messages: [
                { role: 'system', content: settings.agentPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.3
        };

        if (settings.apiProvider === 'gemini') {
            url = `${baseUrl}/models/${settings.model}:generateContent?key=${settings.apiKey}`;
            headers = { 'Content-Type': 'application/json' };
            requestBody = {
                contents: [{
                    parts: [{
                        text: `${settings.agentPrompt}\n\n${userMessage}`
                    }]
                }]
            };
        } else if (settings.apiProvider === 'anthropic') {
            url = `${baseUrl}/messages`;
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': settings.apiKey,
                'anthropic-version': '2023-06-01'
            };
            requestBody = {
                model: settings.model,
                max_tokens: 1024,
                messages: [
                    { role: 'user', content: `${settings.agentPrompt}\n\n${userMessage}` }
                ]
            };
        } else if (settings.apiProvider === 'custom') {
            if (settings.useLegacyOpenAIFormat) {
                showToast("传统OpenAI API格式的自定义逻辑尚未完全实现。", 5000);
            }
            if (settings.enableR1Params) {
                showToast("R1模型参数的自定义逻辑尚未完全实现。", 5000);
            }
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: headers,
                data: JSON.stringify(requestBody),
                onload: response => {
                    try {
                        const data = JSON.parse(response.responseText);
                        let content;

                        if (settings.apiProvider === 'gemini') {
                            content = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        } else if (settings.apiProvider === 'anthropic') {
                            content = data.content?.[0]?.text;
                        } else {
                            content = data.choices?.[0]?.message?.content;
                        }

                        if (!content) {
                            console.error('AI响应中未找到有效内容:', data);
                            throw new Error('AI响应格式错误或无有效内容');
                        }

                        let jsonStr = content.trim();
                        if (jsonStr.startsWith('```json')) {
                            jsonStr = jsonStr.replace(/^```json\s*\n?/, '').replace(/\n?```$/, '');
                        } else if (jsonStr.startsWith('```')) {
                            jsonStr = jsonStr.replace(/^```\s*\n?/, '').replace(/\n?```$/, '');
                        }
                        if (jsonStr.startsWith('`') && jsonStr.endsWith('`')) {
                            jsonStr = jsonStr.slice(1, -1);
                        }

                        try {
                            const result = JSON.parse(jsonStr);
                            resolve(result);
                        } catch (parseError) {
                            console.error('JSON解析失败:', parseError, '原始响应:', content);
                            throw new Error(`解析AI响应失败: ${parseError.message}. 原始响应: ${content.substring(0, 200)}...`);
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: () => reject(new Error('AI API请求失败'))
            });
        });
    };

    const calculateFinalProbability = (aiResult, settings) => {
        let finalProbability = aiResult.probability || 0;
        let adjustmentNote = '';

        if (aiResult.start && aiResult.end) {
            const startSeconds = timeStringToSeconds(aiResult.start);
            const endSeconds = timeStringToSeconds(aiResult.end);
            const duration = endSeconds - startSeconds;

            if (duration < settings.minAdDuration) {
                const penalty = Math.min(30, (settings.minAdDuration - duration) * 2);
                finalProbability = Math.max(0, finalProbability - penalty);
                adjustmentNote += `时长过短惩罚: -${penalty}%; `;
            }

            if (duration > settings.maxAdDuration) {
                const penalty = Math.min(40, (duration - settings.maxAdDuration) * settings.durationPenalty);
                finalProbability = Math.max(0, finalProbability - penalty);
                adjustmentNote += `时长过长惩罚: -${penalty}%; `;
            }
        }

        return {
            ...aiResult,
            finalProbability: Math.round(finalProbability),
            adjustmentNote: adjustmentNote || '无调整'
        };
    };

    const showResultPopup = (result, danmakuSentToAI, commentStringSentToAI) => {
        const settings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        const popup = document.createElement('div');
        popup.className = 'bili-ai-skipper-result-popup';
        if (settings.theme === 'dark') {
            popup.classList.add('dark-theme');
        }

        const escapeHtml = (unsafe) => {
            if (typeof unsafe !== 'string') {
                unsafe = String(unsafe || '');
            }
            const tempDiv = document.createElement('div');
            tempDiv.textContent = unsafe;
            return tempDiv.innerHTML;
        };

        const formattedDanmakuAndComment = `【评论区情况】\n${commentStringSentToAI || '无'}\n\n【发送给AI的弹幕列表】\n${danmakuSentToAI || '无'}`;

        popup.innerHTML = `
            <div class="header">
                <span class="title">AI分析结果</span>
                <button class="close-btn">×</button>
            </div>
            <div class="content">
                <p><strong>广告概率:</strong> ${result.finalProbability}%</p>
                ${result.start && result.end ? `
                    <p><strong>广告时间:</strong> ${escapeHtml(result.start)} - ${escapeHtml(result.end)}</p>
                ` : ''}
                <p><strong>分析说明:</strong> ${escapeHtml(result.note) || '无'}</p>
                <p><strong>概率调整:</strong> ${escapeHtml(result.adjustmentNote) || '无'}</p>
                
                <details>
                    <summary>查看发送给AI的内容</summary>
                    <div class="raw-response">${escapeHtml(formattedDanmakuAndComment)}</div>
                </details>

                <details>
                    <summary>查看原始AI响应</summary>
                    <div class="raw-response">${escapeHtml(JSON.stringify(result, null, 2))}</div>
                </details>
            </div>
            <div class="footer">
                <label>
                    <input type="checkbox" id="auto-skip-toggle" ${settings.defaultSkip ? 'checked' : ''}>
                    自动跳过
                </label>
            </div>
        `;

        document.body.appendChild(popup);
        makeDraggable(popup, popup.querySelector('.header'));

        popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());

        popup.querySelector('#auto-skip-toggle').addEventListener('change', (e) => {
            const currentSettings = GM_getValue('ai_settings', DEFAULT_SETTINGS);
            GM_setValue('ai_settings', { ...currentSettings, defaultSkip: e.target.checked });
            showToast(`自动跳过已${e.target.checked ? '开启' : '关闭'}`, 2000);
        });
    };

    const waitForElement = (selector) => {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) {
                return resolve(el);
            }
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    resolve(el);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    const main = async () => {
        try {
            showToast('AI跳广告脚本已启动,正在分析...', 2000);
            
            // 获取当前BV号并存储
            const newBvidMatch = window.location.pathname.match(/video\/(BV[1-9A-HJ-NP-Za-km-z]+)/);
            if (!newBvidMatch) {
                console.log('未找到BVID');
                return;
            }
            currentBvid = newBvidMatch[1];

            const bvidMatch = window.location.pathname.match(/video\/(BV[1-9A-HJ-NP-Za-km-z]+)/);
            if (!bvidMatch) {
                console.log('未找到BVID');
                return;
            }
            const bvid = bvidMatch[1];

            const cid = await getVideoInfo(bvid);
            const [danmakuXml, topCommentInfo] = await Promise.all([
                getDanmakuXml(cid),
                getTopComment()
            ]);

            const danmakuText = parseAndFilterDanmaku(danmakuXml);
            if (!danmakuText) {
                return;
            }

            const topCommentString = topCommentInfo.status + (topCommentInfo.text ? `\n${topCommentInfo.text}` : '');
            const aiResult = await callAI(danmakuText, topCommentString);
            const settings = GM_getValue('ai_settings', DEFAULT_SETTINGS);
            const finalResult = calculateFinalProbability(aiResult, settings);

            showResultPopup(finalResult, danmakuText, topCommentString);

            if (finalResult.finalProbability >= settings.probabilityThreshold && settings.defaultSkip && finalResult.end) {
                const videoPlayer = await waitForElement('video');
                const endTime = timeStringToSeconds(finalResult.end);

                const checkTime = setInterval(() => {
                    if (videoPlayer.currentTime < endTime) {
                        const startTime = timeStringToSeconds(finalResult.start) || 0;
                        if (videoPlayer.currentTime >= startTime && videoPlayer.currentTime < endTime) {
                            showToast(`将在 ${finalResult.end} 跳过广告`, 2000);
                            videoPlayer.currentTime = endTime;
                            clearInterval(checkTime);
                        }
                    } else {
                        clearInterval(checkTime);
                    }
                }, 1000);
            }

        } catch (error) {
            console.error('视频广告跳过脚本出错:', error);
            showToast(`脚本出错: ${error.message}`, 5000);

            const errorPopup = document.createElement('div');
            errorPopup.className = 'bili-ai-skipper-result-popup error';
            if (GM_getValue('ai_settings', DEFAULT_SETTINGS).theme === 'dark') {
                errorPopup.classList.add('dark-theme');
            }
            errorPopup.innerHTML = `
                <div class="header">
                    <span class="title">脚本错误</span>
                    <span class="close-btn">×</span>
                </div>
                <div class="content">
                    <p><strong>错误信息:</strong></p>
                    <div class="raw-response" style="max-height: 200px; overflow-y: auto;">${error.message}</div>
                </div>
            `;
            document.body.appendChild(errorPopup);
            makeDraggable(errorPopup, errorPopup.querySelector('.header'));
            errorPopup.querySelector('.close-btn').addEventListener('click', () => errorPopup.remove());
        }
    };


    // --- FIRST TIME MODAL ---
    const showFirstTimeModal = () => {
        let currentSettings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        const modal = document.createElement('div');
        modal.className = 'bili-ai-skipper-first-time-modal';
        if (currentSettings.theme === 'dark') {
            modal.classList.add('dark-theme');
        }

        modal.innerHTML = `
            <div class="bili-ai-skipper-first-time-content">
                <h2 class="bili-ai-skipper-first-time-title">欢迎使用视频广告跳过器</h2>
                <div class="bili-ai-skipper-first-time-description">
                    本插件通过AI分析弹幕内容来智能识别广告段落。为了更好的识别效果，建议观众在广告时段发送包含时间戳的弹幕。<br><br>
                    <strong>使用提醒：</strong><br>
                    • 请合理使用，支持喜欢的UP主<br>
                    • 倡导在广告时段发送坐标弹幕帮助其他观众<br>
                    • 本工具仅供学习交流使用
                </div>
                <div class="bili-ai-skipper-theme-toggle" style="justify-content: center; margin-bottom: 20px;">
                    <button class="bili-ai-skipper-theme-btn light" id="ft-theme-light" title="浅色主题">☀</button>
                    <button class="bili-ai-skipper-theme-btn dark" id="ft-theme-dark" title="深色主题">🌙</button>
                </div>
                <input type="text" class="bili-ai-skipper-first-time-input" placeholder="请输入: 我已确认理解插件功能,我会遵循倡导发送坐标弹幕">
                <div class="bili-ai-skipper-first-time-actions">
                    <button class="bili-ai-skipper-first-time-btn" disabled>确认并继续</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const ftModalContent = modal.querySelector('.bili-ai-skipper-first-time-content');
        const ftLightBtn = modal.querySelector('#ft-theme-light');
        const ftDarkBtn = modal.querySelector('#ft-theme-dark');

        const updateFtThemeVisuals = (theme) => {
            ftLightBtn.style.opacity = theme === 'light' ? '1' : '0.5';
            ftDarkBtn.style.opacity = theme === 'dark' ? '1' : '0.5';
            if (theme === 'dark') {
                modal.classList.add('dark-theme');
                ftModalContent.style.background = 'var(--bg-primary)';
                ftModalContent.style.color = 'var(--text-primary)';
            } else {
                modal.classList.remove('dark-theme');
                ftModalContent.style.background = '';
                ftModalContent.style.color = '';
            }
        };
        updateFtThemeVisuals(currentSettings.theme);

        ftLightBtn.addEventListener('click', () => {
            currentSettings.theme = 'light';
            GM_setValue('ai_settings', currentSettings);
            updateFtThemeVisuals('light');
        });

        ftDarkBtn.addEventListener('click', () => {
            currentSettings.theme = 'dark';
            GM_setValue('ai_settings', currentSettings);
            updateFtThemeVisuals('dark');
        });

        const input = modal.querySelector('.bili-ai-skipper-first-time-input');
        const btn = modal.querySelector('.bili-ai-skipper-first-time-btn');
        const targetText = '我已确认理解插件功能,我会遵循倡导发送坐标弹幕';

        input.addEventListener('input', () => {
            btn.disabled = input.value.trim() !== targetText;
        });

        btn.addEventListener('click', () => {
            if (input.value.trim() === targetText) {
                currentSettings.firstTimeUse = false;
                GM_setValue('ai_settings', currentSettings);
                modal.remove();
                showToast('欢迎使用!请先配置API设置。', 3000);
                location.reload();
            }
        });
    };

    // --- SETTINGS UI (设置界面) ---
    const createSettingsUI = () => {
        const settings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        if (settings.firstTimeUse !== false) {
            showFirstTimeModal();
            return;
        }

        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'bili-ai-skipper-floating-btn';
        if (settings.theme === 'dark') {
            floatingBtn.classList.add('dark-theme');
        }
        floatingBtn.style.left = settings.floatingPosition.x + 'px';
        floatingBtn.style.top = settings.floatingPosition.y + 'px';
        floatingBtn.innerHTML = `<img src="${settingsIconBase64}" alt="AI跳广告">`;
        document.body.appendChild(floatingBtn);

        let isDragging = false, hasDragged = false, mouseDownTime = 0;
        let startX, startY, startLeft, startTop;

        floatingBtn.addEventListener('mousedown', (e) => {
            mouseDownTime = Date.now();
            hasDragged = false;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = floatingBtn.offsetLeft;
            startTop = floatingBtn.offsetTop;

            const onMouseMove = (ev) => {
                if (!isDragging && (Math.abs(ev.clientX - startX) > 5 || Math.abs(ev.clientY - startY) > 5)) {
                    isDragging = true;
                    hasDragged = true;
                }
                if (isDragging) {
                    floatingBtn.style.left = startLeft + (ev.clientX - startX) + 'px';
                    floatingBtn.style.top = startTop + (ev.clientY - startY) + 'px';
                }
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                if (isDragging) {
                    const currentSettings = GM_getValue('ai_settings', DEFAULT_SETTINGS);
                    GM_setValue('ai_settings', {
                        ...currentSettings,
                        floatingPosition: { x: parseInt(floatingBtn.style.left), y: parseInt(floatingBtn.style.top) }
                    });
                } else if (Date.now() - mouseDownTime < 200 && !hasDragged) {
                    openSettings();
                }
                isDragging = false;
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });
    };

    // 更改: 修复了此函数，现在对所有支持的提供商都尝试获取模型列表
    const fetchModels = async (provider, baseUrl, apiKey) => {
        return new Promise((resolve) => {
            const providerConfig = API_PROVIDERS[provider];

            // 定义哪些提供商支持通过端点动态获取模型
            const fetchableProviders = ['openai', 'deepseek', 'custom', 'gemini'];

            if (fetchableProviders.includes(provider)) {
                // 对于这些提供商，必须有API密钥和Base URL才能尝试获取
                if (!apiKey || !baseUrl) {
                    resolve(providerConfig.models); // 缺少凭据，返回预设列表
                    return;
                }

                let requestConfig = {};

                if (provider === 'gemini') {
                    // Gemini 使用 API Key 作为 URL 参数
                    requestConfig = {
                        method: 'GET',
                        url: `${baseUrl}/models?key=${apiKey}`,
                        headers: { 'Content-Type': 'application/json' }
                    };
                } else {
                    // OpenAI, DeepSeek, Custom 使用 Bearer Token
                    requestConfig = {
                        method: 'GET',
                        url: `${baseUrl}/models`,
                        headers: { 'Authorization': `Bearer ${apiKey}` }
                    };
                }

                GM_xmlhttpRequest({
                    ...requestConfig,
                    onload: response => {
                        try {
                            const data = JSON.parse(response.responseText);
                            let models = [];

                            if (provider === 'gemini') {
                                // Gemini 的响应结构是 { "models": [...] }
                                // 模型ID在 "name" 字段中，格式为 "models/gemini-pro"
                                models = data.models?.map(m => m.name.replace('models/', ''))
                                    .filter(id => id.includes('gemini')) // 只保留gemini相关模型
                                    .sort() || [];
                            } else {
                                // OpenAI 兼容的结构是 { "data": [...] }
                                models = data.data?.map(m => m.id).filter(id => typeof id === 'string').sort() || [];
                            }

                            resolve(models.length > 0 ? models : providerConfig.models);
                        } catch (e) {
                            console.error(`解析 ${provider} 模型列表失败:`, e);
                            resolve(providerConfig.models); // 解析失败，返回预设
                        }
                    },
                    onerror: (err) => {
                        console.error(`获取 ${provider} 模型列表失败:`, err);
                        resolve(providerConfig.models); // 网络错误，返回预设
                    }
                });

            } else {
                // 对于其他提供商（如 Anthropic），它们使用固定的模型列表
                resolve(providerConfig.models);
            }
        });
    };

    const openSettings = () => {
        let settings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        const backdrop = document.createElement('div');
        backdrop.className = 'bili-ai-skipper-settings-backdrop';
        if (settings.theme === 'dark') {
            backdrop.classList.add('dark-theme');
        }

        backdrop.innerHTML = `
            <div class="bili-ai-skipper-settings-modal">
                <div class="bili-ai-skipper-settings-header">
                    <h2 class="bili-ai-skipper-settings-title">视频广告跳过器设置</h2>
                    <button class="bili-ai-skipper-settings-close">×</button>
                </div>
                <div class="bili-ai-skipper-settings-body">
                    <div class="bili-ai-skipper-settings-tabs">
                        <button class="bili-ai-skipper-settings-tab active" data-tab="basic">基础设置</button>
                        <button class="bili-ai-skipper-settings-tab" data-tab="advanced">高级设置</button>
                        <button class="bili-ai-skipper-settings-tab" data-tab="prompt">提示词</button>
                    </div>
                    
                    <div id="basic-tab" class="bili-ai-skipper-tab-content active">
                        <div class="bili-ai-skipper-settings-section">
                            <h3>API配置</h3>
                            <div class="bili-ai-skipper-settings-group">
                                <label class="bili-ai-skipper-settings-label">API提供商</label>
                                <select id="api-provider" class="bili-ai-skipper-settings-select">
                                    <option value="openai">OpenAI官方</option>
                                    <option value="deepseek">DeepSeek</option>
                                    <option value="gemini">Google Gemini</option>
                                    <option value="anthropic">Anthropic Claude</option>
                                    <option value="custom">自定义OpenAI兼容</option>
                                </select>
                            </div>
                            <div class="bili-ai-skipper-settings-group" id="base-url-group" style="display: none;">
                                <label class="bili-ai-skipper-settings-label">API Base URL</label>
                                <input type="text" id="base-url" class="bili-ai-skipper-settings-input" placeholder="https://api.example.com/v1">
                            </div>
                            <div class="bili-ai-skipper-settings-group">
                                <label class="bili-ai-skipper-settings-label">API密钥</label>
                                <input type="password" id="api-key" class="bili-ai-skipper-settings-input" placeholder="sk-...">
                            </div>
                            <div class="bili-ai-skipper-settings-group">
                                <label class="bili-ai-skipper-settings-label">模型</label>
                                <div class="bili-ai-skipper-model-container">
                                    <input type="text" id="model" class="bili-ai-skipper-settings-input" placeholder="点击选择或输入模型名称">
                                    <div id="model-dropdown" class="bili-ai-skipper-model-dropdown" style="display: none;"></div>
                                </div>
                            </div>
                            <div class="bili-ai-skipper-settings-group" id="custom-openai-options-group" style="display: none;">
                                <div class="bili-ai-skipper-settings-checkbox">
                                    <input type="checkbox" id="enable-r1-params">
                                    <label for="enable-r1-params">启用R1模型参数</label>
                                </div>
                                <div class="bili-ai-skipper-settings-checkbox">
                                    <input type="checkbox" id="use-legacy-openai-format">
                                    <label for="use-legacy-openai-format">使用传统OpenAI API格式</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bili-ai-skipper-settings-section">
                            <h3>跳过设置</h3>
                            <div class="bili-ai-skipper-settings-checkbox">
                                <input type="checkbox" id="default-skip">
                                <label for="default-skip">默认自动跳过广告</label>
                            </div>
                            <div class="bili-ai-skipper-settings-group-inline">
                                <div>
                                    <label class="bili-ai-skipper-settings-label">概率阈值 (%)</label>
                                    <input type="number" id="probability-threshold" class="bili-ai-skipper-settings-input" min="0" max="100" placeholder="70">
                                </div>
                                <div>
                                    <label class="bili-ai-skipper-settings-label">时长惩罚系数</label>
                                    <input type="number" id="duration-penalty" class="bili-ai-skipper-settings-input" min="0" max="50" placeholder="5">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="advanced-tab" class="bili-ai-skipper-tab-content">
                        <div class="bili-ai-skipper-settings-section">
                            <h3>广告时长限制</h3>
                            <div class="bili-ai-skipper-settings-group-inline">
                                <div>
                                    <label class="bili-ai-skipper-settings-label">最小广告时长 (秒)</label>
                                    <input type="number" id="min-ad-duration" class="bili-ai-skipper-settings-input" min="1" placeholder="30">
                                </div>
                                <div>
                                    <label class="bili-ai-skipper-settings-label">最大广告时长 (秒)</label>
                                    <input type="number" id="max-ad-duration" class="bili-ai-skipper-settings-input" min="1" placeholder="300">
                                </div>
                            </div>
                            <div class="bili-ai-skipper-settings-group">
                                <label class="bili-ai-skipper-settings-label">最大弹幕数量 (用于分析)</label>
                                <input type="number" id="max-danmaku-count" class="bili-ai-skipper-settings-input" min="1" placeholder="500">
                                <small style="color: var(--text-secondary); font-size: 12px;">当过滤后弹幕数大于此值时, 将随机采样。</small>
                            </div>
                        </div>
                        
                        <div class="bili-ai-skipper-settings-section">
                            <h3>弹幕过滤设置</h3>
                            <div class="bili-ai-skipper-settings-group">
                                <label class="bili-ai-skipper-settings-label">完整分析所需最小弹幕数</label>
                                <input type="number" id="min-danmaku-full" class="bili-ai-skipper-settings-input" min="1" placeholder="50">
                                <small style="color: var(--text-secondary); font-size: 12px;">当有效弹幕数低于此值时, 可能跳过AI分析或使用简化逻辑。</small>
                            </div>
                        </div>
                        
                        <div class="bili-ai-skipper-settings-section">
                            <h3>白名单设置</h3>
                            <div class="bili-ai-skipper-settings-checkbox">
                                <input type="checkbox" id="enable-whitelist">
                                <label for="enable-whitelist">启用白名单 (仅分析含白名单关键词的弹幕)</label>
                            </div>
                            <div class="bili-ai-skipper-settings-checkbox">
                                <input type="checkbox" id="whitelist-regex">
                                <label for="whitelist-regex">白名单支持正则表达式</label>
                            </div>
                            <div class="bili-ai-skipper-list-container">
                                <div class="bili-ai-skipper-list-input">
                                    <input type="text" id="whitelist-input" placeholder="输入白名单关键词或正则表达式">
                                    <button class="bili-ai-skipper-list-add-btn" id="add-whitelist">添加</button>
                                </div>
                                <div class="bili-ai-skipper-list-items" id="whitelist-items"></div>
                            </div>
                        </div>
                        
                        <div class="bili-ai-skipper-settings-section">
                            <h3>黑名单设置</h3>
                            <div class="bili-ai-skipper-settings-checkbox">
                                <input type="checkbox" id="enable-blacklist">
                                <label for="enable-blacklist">启用黑名单 (过滤掉含黑名单关键词的弹幕)</label>
                            </div>
                            <div class="bili-ai-skipper-settings-checkbox">
                                <input type="checkbox" id="blacklist-regex">
                                <label for="blacklist-regex">黑名单支持正则表达式</label>
                            </div>
                            <div class="bili-ai-skipper-list-container">
                                <div class="bili-ai-skipper-list-input">
                                    <input type="text" id="blacklist-input" placeholder="输入黑名单关键词或正则表达式">
                                    <button class="bili-ai-skipper-list-add-btn" id="add-blacklist">添加</button>
                                </div>
                                <div class="bili-ai-skipper-list-items" id="blacklist-items"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="prompt-tab" class="bili-ai-skipper-tab-content">
                        <div class="bili-ai-skipper-settings-section">
                            <h3>AI提示词配置</h3>
                            <div class="bili-ai-skipper-settings-group">
                                <label class="bili-ai-skipper-settings-label">系统提示词 (System Prompt)</label>
                                <textarea id="agent-prompt" class="bili-ai-skipper-settings-textarea" placeholder="输入AI分析提示词..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bili-ai-skipper-settings-footer">
                    <div class="bili-ai-skipper-theme-toggle">
                        <button class="bili-ai-skipper-theme-btn light" id="theme-light" title="浅色主题">☀</button>
                        <button class="bili-ai-skipper-theme-btn dark" id="theme-dark" title="深色主题">🌙</button>
                    </div>
                    <div class="bili-ai-skipper-settings-actions">
                        <button class="bili-ai-skipper-settings-btn-secondary" id="cancel-btn">取消</button>
                        <button class="bili-ai-skipper-settings-btn-primary" id="save-btn">保存并刷新</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);

        // 初始化设置值
        document.getElementById('api-provider').value = settings.apiProvider || 'openai';
        document.getElementById('base-url').value = settings.baseUrl || '';
        document.getElementById('api-key').value = settings.apiKey || '';
        document.getElementById('model').value = settings.model || '';
        document.getElementById('enable-r1-params').checked = settings.enableR1Params || false;
        document.getElementById('use-legacy-openai-format').checked = settings.useLegacyOpenAIFormat || false;
        document.getElementById('default-skip').checked = settings.defaultSkip !== false;
        document.getElementById('probability-threshold').value = settings.probabilityThreshold || 70;
        document.getElementById('duration-penalty').value = settings.durationPenalty || 5;
        document.getElementById('min-ad-duration').value = settings.minAdDuration || 30;
        document.getElementById('max-ad-duration').value = settings.maxAdDuration || 300;
        document.getElementById('max-danmaku-count').value = settings.maxDanmakuCount || 500;
        document.getElementById('min-danmaku-full').value = settings.minDanmakuForFullAnalysis || 50;
        document.getElementById('enable-whitelist').checked = settings.enableWhitelist !== false;
        document.getElementById('whitelist-regex').checked = settings.whitelistRegex || false;
        document.getElementById('enable-blacklist').checked = settings.enableBlacklist !== false;
        document.getElementById('blacklist-regex').checked = settings.blacklistRegex || false;
        document.getElementById('agent-prompt').value = settings.agentPrompt || DEFAULT_SETTINGS.agentPrompt;

        const updateThemeButtons = (theme) => {
            const lightBtn = document.getElementById('theme-light');
            const darkBtn = document.getElementById('theme-dark');
            if (lightBtn && darkBtn) {
                lightBtn.style.opacity = theme === 'light' ? '1' : '0.5';
                darkBtn.style.opacity = theme === 'dark' ? '1' : '0.5';
            }
        };
        updateThemeButtons(settings.theme);

        const apiProviderSelect = document.getElementById('api-provider');
        const baseUrlGroup = document.getElementById('base-url-group');
        const customOpenAIOptionsGroup = document.getElementById('custom-openai-options-group');

        const updateApiProviderUI = () => {
            const provider = apiProviderSelect.value;
            const providerConfig = API_PROVIDERS[provider];
            baseUrlGroup.style.display = providerConfig.needsUrl ? 'block' : 'none';
            if (!providerConfig.needsUrl) {
                document.getElementById('base-url').value = providerConfig.defaultUrl;
            } else if (!document.getElementById('base-url').value && provider === 'custom') {
                document.getElementById('base-url').value = '';
            }
            customOpenAIOptionsGroup.style.display = provider === 'custom' ? 'block' : 'none';
        };

        apiProviderSelect.addEventListener('change', updateApiProviderUI);
        updateApiProviderUI();

        const modelInput = document.getElementById('model');
        const modelDropdown = document.getElementById('model-dropdown');

        const updateModelDropdown = async () => {
            const provider = apiProviderSelect.value;
            // 确保切换到自定义时，如果用户没有输入，baseUrl是空的，而不是继承上一个提供商的默认值
            let baseUrl = document.getElementById('base-url').value;
            if (provider !== 'custom') {
                baseUrl = baseUrl || API_PROVIDERS[provider]?.defaultUrl;
            }

            const apiKey = document.getElementById('api-key').value;
            modelDropdown.innerHTML = '<div class="bili-ai-skipper-model-option" style="color: grey; cursor: wait;">正在获取...</div>';

            const currentModels = await fetchModels(provider, baseUrl, apiKey);

            modelDropdown.innerHTML = '';
            if (currentModels.length > 0) {
                currentModels.forEach(model => {
                    const option = document.createElement('div');
                    option.className = 'bili-ai-skipper-model-option';
                    option.textContent = model;
                    option.addEventListener('click', () => {
                        modelInput.value = model;
                        modelDropdown.style.display = 'none';
                    });
                    modelDropdown.appendChild(option);
                });
            } else {
                modelDropdown.innerHTML = '<div class="bili-ai-skipper-model-option" style="color: grey; cursor: default;">无可用模型或需手动输入</div>';
            }
        };

        modelInput.addEventListener('focus', async () => {
            if (modelDropdown.style.display === 'none' || !modelDropdown.innerHTML.includes('option')) {
                await updateModelDropdown();
            }
            if (modelDropdown.children.length > 0) {
                modelDropdown.style.display = 'block';
            }
        });
        document.addEventListener('click', (e) => {
            if (!modelInput.contains(e.target) && !modelDropdown.contains(e.target)) {
                modelDropdown.style.display = 'none';
            }
        });
        apiProviderSelect.addEventListener('change', () => { modelInput.value = ''; updateApiProviderUI(); updateModelDropdown(); });
        document.getElementById('api-key').addEventListener('change', updateModelDropdown);
        document.getElementById('base-url').addEventListener('change', updateModelDropdown);

        const tabs = backdrop.querySelectorAll('.bili-ai-skipper-settings-tab');
        const contents = backdrop.querySelectorAll('.bili-ai-skipper-tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
            });
        });

        const setupListManagement = (listType) => {
            const itemsContainer = document.getElementById(`${listType}-items`);
            const input = document.getElementById(`${listType}-input`);
            const addButton = document.getElementById(`add-${listType}`);
            let list = Array.isArray(settings[listType]) ? [...settings[listType]] : [];

            const renderList = () => {
                itemsContainer.innerHTML = '';
                list.forEach((item, index) => {
                    const listItem = document.createElement('div');
                    listItem.className = 'bili-ai-skipper-list-item';
                    listItem.innerHTML = `
                        <span>${item}</span>
                        <button class="bili-ai-skipper-list-remove-btn" data-index="${index}">×</button>
                    `;
                    itemsContainer.appendChild(listItem);
                });

                itemsContainer.querySelectorAll('.bili-ai-skipper-list-remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.target.dataset.index);
                        list.splice(index, 1);
                        renderList();
                    });
                });
            };

            addButton.addEventListener('click', () => {
                const value = input.value.trim();
                if (value && !list.includes(value)) {
                    list.push(value);
                    input.value = '';
                    renderList();
                }
            });
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addButton.click(); } });
            renderList();
            return () => list;
        };

        const getWhitelist = setupListManagement('whitelist');
        const getBlacklist = setupListManagement('blacklist');

        const modalElement = backdrop.querySelector('.bili-ai-skipper-settings-modal');
        document.getElementById('theme-light').addEventListener('click', () => {
            settings.theme = 'light';
            backdrop.classList.remove('dark-theme');
            modalElement.classList.remove('dark-theme');
            updateThemeButtons('light');
        });
        document.getElementById('theme-dark').addEventListener('click', () => {
            settings.theme = 'dark';
            backdrop.classList.add('dark-theme');
            modalElement.classList.add('dark-theme');
            updateThemeButtons('dark');
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            const newSettings = {
                ...GM_getValue('ai_settings', DEFAULT_SETTINGS),
                theme: settings.theme,
                apiProvider: document.getElementById('api-provider').value,
                baseUrl: document.getElementById('base-url').value,
                apiKey: document.getElementById('api-key').value,
                model: document.getElementById('model').value,
                enableR1Params: document.getElementById('enable-r1-params').checked,
                useLegacyOpenAIFormat: document.getElementById('use-legacy-openai-format').checked,
                defaultSkip: document.getElementById('default-skip').checked,
                probabilityThreshold: parseInt(document.getElementById('probability-threshold').value) || 70,
                durationPenalty: parseFloat(document.getElementById('duration-penalty').value) || 5,
                minAdDuration: parseInt(document.getElementById('min-ad-duration').value) || 30,
                maxAdDuration: parseInt(document.getElementById('max-ad-duration').value) || 300,
                maxDanmakuCount: parseInt(document.getElementById('max-danmaku-count').value) || 500,
                minDanmakuForFullAnalysis: parseInt(document.getElementById('min-danmaku-full').value) || 50,
                enableWhitelist: document.getElementById('enable-whitelist').checked,
                whitelistRegex: document.getElementById('whitelist-regex').checked,
                whitelist: getWhitelist(),
                enableBlacklist: document.getElementById('enable-blacklist').checked,
                blacklistRegex: document.getElementById('blacklist-regex').checked,
                blacklist: getBlacklist(),
                agentPrompt: document.getElementById('agent-prompt').value,
            };

            GM_setValue('ai_settings', newSettings);
            showToast('设置已保存，即将刷新页面...', 2000);
            backdrop.remove();
            setTimeout(() => location.reload(), 500);
        });

        document.getElementById('cancel-btn').addEventListener('click', () => backdrop.remove());
        backdrop.querySelector('.bili-ai-skipper-settings-close').addEventListener('click', () => backdrop.remove());

        let isMouseDownOnBackdrop = false;
        backdrop.addEventListener('mousedown', (e) => {
            if (e.target === backdrop) {
                isMouseDownOnBackdrop = true;
            }
        });
        backdrop.addEventListener('mouseup', (e) => {
            if (isMouseDownOnBackdrop && e.target === backdrop) {
                backdrop.remove();
            }
            isMouseDownOnBackdrop = false;
        });
    };

    // 全局变量存储当前BV号
    let currentBvid = null;
    let skipTimer = null;
    let urlCheckInterval = null;

    // --- INITIALIZATION (初始化) ---
    const init = () => {
        injectStyles();
        const currentSettings = GM_getValue('ai_settings', DEFAULT_SETTINGS);

        // 启动URL变化检测
        urlCheckInterval = setInterval(() => {
            const bvidMatch = window.location.pathname.match(/video\/(BV[1-9A-HJ-NP-Za-km-z]+)/);
            const newBvid = bvidMatch ? bvidMatch[1] : null;
            
            if (newBvid && newBvid !== currentBvid) {
                // 清理旧资源
                if (skipTimer) clearInterval(skipTimer);
                const existingPopup = document.querySelector('.bili-ai-skipper-result-popup');
                if (existingPopup) existingPopup.remove();
                const existingErrorPopup = document.querySelector('.bili-ai-skipper-result-popup.error');
                if (existingErrorPopup) existingErrorPopup.remove();
                
                // 更新BV号并重新执行分析
                currentBvid = newBvid;
                if (currentSettings.apiKey && currentSettings.model) {
                    main();
                }
            }
        }, 2000);

        if (currentSettings.firstTimeUse !== false) {
            showFirstTimeModal();
        } else {
            createSettingsUI();
            // 首次加载时，不直接调用main，而是依赖urlCheckInterval来触发
            // urlCheckInterval会在检测到新的bvid时（包括首次加载时bvid从null变为实际值）触发main
            if (!currentSettings.apiKey || !currentSettings.model) {
                showToast('请点击悬浮按钮配置API密钥和模型', 3000);
            }
        }
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();