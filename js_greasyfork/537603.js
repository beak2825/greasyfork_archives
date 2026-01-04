// ==UserScript==
// @name         Twitch Latency Display / 延迟显示插件
// @name:en      Twitch Latency Display / 延迟显示插件
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在Twitch聊天窗口显示总延迟时间，包括缓冲区大小、网络延迟和编码延迟
// @description:en  Display total latency in Twitch chat window, including buffer size, network latency and encoding latency
// @author       L
// @match        *://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537603/Twitch%20Latency%20Display%20%20%E5%BB%B6%E8%BF%9F%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/537603/Twitch%20Latency%20Display%20%20%E5%BB%B6%E8%BF%9F%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

/**
 * 本脚本修改自Chrome扩展 Twitch Latency Display
 * 原始扩展地址: https://chromewebstore.google.com/detail/twitch-latency-display/gfbfblhgcnaceejlekkogpbjjogdealk
 * 侵删
 */

(function() {
    'use strict';

    const cssStyles = `
    /* 快进按钮样式 */
    .FF_buffer_btn {
        color: var(--color-fill-button-icon, #efeff1);
        border-radius: var(--border-radius-medium, 0.4rem);
        width: var(--button-size-default, 3rem);
        height: var(--button-size-default, 3rem);
        display: flex;
        cursor: pointer;
        border: none;
        outline: none;
        background: none;
    }
    .FF_buffer_btn > svg {
        fill: currentcolor;
        margin: auto;
    }
    .FF_buffer_btn:hover {
        background-color: var(--color-background-button-text-hover, rgba(255, 255, 255, 0.2));
    }
    .FF_buffer_btn:active {
        background-color: var(--color-background-button-text-active, rgba(255, 255, 255, 0.15));
    }

    /* 显示/隐藏快进按钮 */
    :root[hide_ff_btn] .FF_buffer_btn {
        display: none !important;
    }

    /* 隐藏菜单时的样式 */
    :root.twitch_latency_hide_menu div[role="dialog"] {pointer-events: none !important; opacity: 0 !important;}

    /* 视频统计信息样式 - 迷你模式 */
    :root:not([hide_video_stats]) .video-player [data-a-target="player-overlay-video-stats"]:not(:hover) > table {box-shadow: unset !important;}
    :root:not([hide_video_stats]) .video-player [data-a-target="player-overlay-video-stats"]:not(:hover) :is(div, thead, p:not([aria-label="直播者延迟"]):not([aria-label="缓冲区大小"]):not([aria-label="Latency To Broadcaster"]):not([aria-label="Buffer Size"])) {display: none !important;}
    :root:not([hide_video_stats]) .video-player [data-a-target="player-overlay-video-stats"]:not(:hover) :not(p) {padding: 0 !important;}
    :root:not([hide_video_stats]) .video-player [data-a-target="player-overlay-video-stats"]:not(:hover) p {margin-right: -16px; padding: 2px 6px; filter: drop-shadow(0px 0px 2px #000) drop-shadow(0px 0px 0px #0009); font-weight: bold;}
    :root:not([hide_video_stats]) .video-player [data-a-target="player-overlay-video-stats"]:not(:hover) {transform: scale(0.8); transform-origin: 0 0; background: #0004 !important;}

    /* 当迷你模式关闭时，原始统计信息始终可见 */
    :root[hide_video_stats] .video-player [data-a-target="player-overlay-video-stats"] {
        opacity: 1 !important;
        display: block !important;
    }
    :root[hide_video_stats] .video-player [data-a-target="player-overlay-video-stats"] > table {
        display: table !important;
    }

    /* 弹窗样式 */
    .twitch-latency-settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .twitch-latency-settings-container {
        background-color: #18181b;
        border-radius: 4px;
        padding: 20px;
        width: 400px;
        max-width: 90%;
        color: #efeff1;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    }

    .twitch-latency-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .twitch-latency-settings-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
    }

    .twitch-latency-settings-close {
        background: none;
        border: none;
        color: #efeff1;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
    }

    .twitch-latency-settings-option {
        margin-bottom: 15px;
    }

    .twitch-latency-settings-label {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .twitch-latency-settings-checkbox {
        margin-right: 10px;
    }

    .twitch-latency-settings-number {
        background-color: #3a3a3d;
        border: 1px solid #464649;
        border-radius: 4px;
        color: #efeff1;
        padding: 5px 10px;
        width: 60px;
        margin-left: 10px;
    }

    .twitch-latency-settings-description {
        margin-top: 5px;
        color: #adadb8;
        font-size: 12px;
        padding-left: 25px;
    }

    .twitch-latency-settings-footer {
        margin-top: 20px;
        color: #adadb8;
        font-size: 12px;
        padding-top: 10px;
        border-top: 1px solid #464649;
    }

    .twitch-latency-settings-select {
        background-color: #3a3a3d;
        border: 1px solid #464649;
        border-radius: 4px;
        color: #efeff1;
        padding: 5px 10px;
        margin-left: 10px;
    }

    .twitch-latency-settings-button {
        padding: 6px 12px;
        background-color: #772ce8;
        border: none;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        margin-right: 10px;
    }
    `;

    GM_addStyle(cssStyles);

    const languages = {
        'zh': {
            // 设置界面
            settingsTitle: 'Settings / 设置',
            showMiniStats: '显示迷你视频统计信息',
            miniStatsDesc: '在视频左上角显示简化的视频统计信息，包括缓冲区大小和直播者延迟',
            autoOpenStats: '自动打开视频统计',
            autoOpenStatsDesc: '进入页面时自动打开视频统计信息（显示迷你统计信息依赖此功能）',
            showFFBtn: '显示快进直播缓冲按钮',
            ffBtnDesc: '在聊天输入框旁边显示快进按钮，点击可以将视频跳转到缓冲区的最新位置',
            showDelayText: '在聊天框显示总延迟',
            delayTextDesc: '在聊天输入框中显示总延迟时间',
            encodingLatency: '编码延迟(秒)：',
            encodingLatencyDesc: '在优化系统上使用"低延迟"模式时，OBS 延迟可低至 1-2 秒',
            language: '语言：',
            fastForward: '快进直播缓冲',
            hoverStatsHint: '如果将鼠标悬停在视频的左上角，可以查看完整的高级视频统计信息',
            refreshHint: '修改语言或设置后刷新页面才能完全生效',
            enableDebug: '启用调试模式',
            enableDebugDesc: '在浏览器控制台显示详细的调试信息',

            // Twitch元素名称
            bufferSize: "缓冲区大小",
            latencyToBroadcaster: "直播者延迟",

            // 其他文本
            totalDelay: '总延迟: {0} 秒',
            ffBtnTitle: '快进视频缓冲',
            scriptLoaded: 'Twitch延迟显示插件已加载',
            openerNotExists: 'opener不存在',
            openerClosed: 'opener已关闭'
        },
        'en': {
            // 设置界面
            settingsTitle: 'Settings / 设置',
            showMiniStats: 'Show Mini Video Stats',
            miniStatsDesc: 'Display simplified video statistics in the top left corner of the video, including buffer size and latency to broadcaster',
            autoOpenStats: 'Auto Open Video Stats',
            autoOpenStatsDesc: 'Automatically open video statistics when entering the page (display mini stats depends on this function)',
            showFFBtn: 'Show Fast Forward Buffer Button',
            ffBtnDesc: 'Display a fast forward button next to the chat input, click to jump to the latest point in the buffer',
            showDelayText: 'Show Total Delay in Chat',
            delayTextDesc: 'Display the total delay time in the chat input field',
            encodingLatency: 'Encoding Latency (sec):',
            encodingLatencyDesc: 'On an optimized system using "Low Latency" mode, OBS delay can be as low as 1-2 seconds',
            language: 'Language:',
            fastForward: 'Fast Forward Buffer',
            hoverStatsHint: 'Hover your mouse over the top left corner of the video to see the full advanced video statistics',
            refreshHint: 'Refresh the page for language and settings to take full effect',
            enableDebug: 'Enable Debug Mode',
            enableDebugDesc: 'Display detailed debug information in browser console',

            // Twitch元素名称
            bufferSize: "Buffer Size",
            latencyToBroadcaster: "Latency To Broadcaster",

            // 其他文本
            totalDelay: 'Total Delay: {0} sec',
            ffBtnTitle: 'Fast Forward Video Buffer',
            scriptLoaded: 'Twitch Latency Display loaded',
            openerNotExists: 'opener does not exist',
            openerClosed: 'opener closed'
        }
    };

    // 默认设置
    const default_options = {
        sw_show_small_video_stats_css: true,
        sw_show_ff_btn: true,
        sw_show_delay_text: true,
        sw_auto_open_stats: true,
        encoding_latency: 1.5,
        language: getBrowserLanguage(),
        debug_mode: false
    };

    // 获取浏览器语言
    function getBrowserLanguage() {
        const lang = navigator.language.toLowerCase();
        return lang.startsWith('zh') ? 'zh' : 'en';
    }

    // 获取当前语言
    function getCurrentLanguage() {
        return GM_getValue('language', default_options.language);
    }

    // 获取翻译文本
    function getText(key, ...args) {
        const currentLang = getCurrentLanguage();
        let text = languages[currentLang][key] || languages['en'][key] || key;

        // 如果有参数，替换占位符
        if (args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                text = text.replace(`{${i}}`, args[i]);
            }
        }

        return text;
    }

    // 初始化设置
    function initSettings() {
        for (const key in default_options) {
            if(GM_getValue(key) === undefined) {
                GM_setValue(key, default_options[key]);
                console.log(key, "设置为默认值");
            }
        }
    }

    // 创建设置弹窗
    function createSettingsUI() {
        // 移除现有弹窗（如果存在）
        const existingOverlay = document.querySelector('.twitch-latency-settings-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
            return;
        }

        // 创建弹窗
        const overlay = document.createElement('div');
        overlay.className = 'twitch-latency-settings-overlay';

        const container = document.createElement('div');
        container.className = 'twitch-latency-settings-container';

        // 弹窗头部
        const header = document.createElement('div');
        header.className = 'twitch-latency-settings-header';

        const title = document.createElement('h2');
        title.className = 'twitch-latency-settings-title';
        title.textContent = getText('settingsTitle');

        const closeBtn = document.createElement('button');
        closeBtn.className = 'twitch-latency-settings-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => overlay.remove());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 设置选项
        const optionsContainer = document.createElement('div');

        // 语言选择
        const langOption = document.createElement('div');
        langOption.className = 'twitch-latency-settings-option';

        const langLabel = document.createElement('label');
        langLabel.className = 'twitch-latency-settings-label';
        langLabel.appendChild(document.createTextNode(getText('language')));

        const langSelect = document.createElement('select');
        langSelect.className = 'twitch-latency-settings-select';

        const zhOption = document.createElement('option');
        zhOption.value = 'zh';
        zhOption.textContent = '中文';
        zhOption.selected = getCurrentLanguage() === 'zh';

        const enOption = document.createElement('option');
        enOption.value = 'en';
        enOption.textContent = 'English';
        enOption.selected = getCurrentLanguage() === 'en';

        langSelect.appendChild(zhOption);
        langSelect.appendChild(enOption);

        langSelect.addEventListener('change', (e) => {
            GM_setValue('language', e.target.value);
            // 更新界面语言
            overlay.remove();
            setTimeout(createSettingsUI, 100); // 重新打开设置以更新语言
        });

        langLabel.appendChild(langSelect);
        langOption.appendChild(langLabel);

        // 小视频统计信息选项
        const statsOption = document.createElement('div');
        statsOption.className = 'twitch-latency-settings-option';

        const statsLabel = document.createElement('label');
        statsLabel.className = 'twitch-latency-settings-label';

        const statsCheckbox = document.createElement('input');
        statsCheckbox.className = 'twitch-latency-settings-checkbox';
        statsCheckbox.type = 'checkbox';
        statsCheckbox.checked = GM_getValue('sw_show_small_video_stats_css', true);
        statsCheckbox.addEventListener('change', (e) => {
            GM_setValue('sw_show_small_video_stats_css', e.target.checked);
            toggleSmallVideoStats(e.target.checked);
        });

        statsLabel.appendChild(statsCheckbox);
        statsLabel.appendChild(document.createTextNode(getText('showMiniStats')));

        const statsDesc = document.createElement('div');
        statsDesc.className = 'twitch-latency-settings-description';
        statsDesc.textContent = getText('miniStatsDesc');

        statsOption.appendChild(statsLabel);
        statsOption.appendChild(statsDesc);

        // 自动打开视频统计选项
        const autoOpenStatsOption = document.createElement('div');
        autoOpenStatsOption.className = 'twitch-latency-settings-option';

        const autoOpenStatsLabel = document.createElement('label');
        autoOpenStatsLabel.className = 'twitch-latency-settings-label';

        const autoOpenStatsCheckbox = document.createElement('input');
        autoOpenStatsCheckbox.className = 'twitch-latency-settings-checkbox';
        autoOpenStatsCheckbox.type = 'checkbox';
        autoOpenStatsCheckbox.checked = GM_getValue('sw_auto_open_stats', true);
        autoOpenStatsCheckbox.addEventListener('change', (e) => {
            GM_setValue('sw_auto_open_stats', e.target.checked);
        });

        autoOpenStatsLabel.appendChild(autoOpenStatsCheckbox);
        autoOpenStatsLabel.appendChild(document.createTextNode(getText('autoOpenStats')));

        const autoOpenStatsDesc = document.createElement('div');
        autoOpenStatsDesc.className = 'twitch-latency-settings-description';
        autoOpenStatsDesc.textContent = getText('autoOpenStatsDesc');

        autoOpenStatsOption.appendChild(autoOpenStatsLabel);
        autoOpenStatsOption.appendChild(autoOpenStatsDesc);

        // 快进按钮选项
        const ffBtnOption = document.createElement('div');
        ffBtnOption.className = 'twitch-latency-settings-option';

        const ffBtnLabel = document.createElement('label');
        ffBtnLabel.className = 'twitch-latency-settings-label';

        const ffBtnCheckbox = document.createElement('input');
        ffBtnCheckbox.className = 'twitch-latency-settings-checkbox';
        ffBtnCheckbox.type = 'checkbox';
        ffBtnCheckbox.checked = GM_getValue('sw_show_ff_btn', true);
        ffBtnCheckbox.addEventListener('change', (e) => {
            GM_setValue('sw_show_ff_btn', e.target.checked);
            toggleFFBtn(e.target.checked);
        });

        ffBtnLabel.appendChild(ffBtnCheckbox);
        ffBtnLabel.appendChild(document.createTextNode(getText('showFFBtn')));

        const ffBtnDesc = document.createElement('div');
        ffBtnDesc.className = 'twitch-latency-settings-description';
        ffBtnDesc.textContent = getText('ffBtnDesc');

        ffBtnOption.appendChild(ffBtnLabel);
        ffBtnOption.appendChild(ffBtnDesc);

        // 聊天框显示总延迟选项
        const delayTextOption = document.createElement('div');
        delayTextOption.className = 'twitch-latency-settings-option';

        const delayTextLabel = document.createElement('label');
        delayTextLabel.className = 'twitch-latency-settings-label';

        const delayTextCheckbox = document.createElement('input');
        delayTextCheckbox.className = 'twitch-latency-settings-checkbox';
        delayTextCheckbox.type = 'checkbox';
        delayTextCheckbox.checked = GM_getValue('sw_show_delay_text', true);
        delayTextCheckbox.addEventListener('change', (e) => {
            GM_setValue('sw_show_delay_text', e.target.checked);
            // 立即应用设置
            if (!e.target.checked) {
                // 如果关闭了显示，清除当前显示的文本
                const output1 = document.querySelector(".chat-wysiwyg-input__placeholder");
                const output2 = document.querySelector(`[data-a-target="chat-input"]`);
                if (output1) output1.textContent = '';
                if (output2) output2.removeAttribute("placeholder");
            }
        });

        delayTextLabel.appendChild(delayTextCheckbox);
        delayTextLabel.appendChild(document.createTextNode(getText('showDelayText')));

        const delayTextDesc = document.createElement('div');
        delayTextDesc.className = 'twitch-latency-settings-description';
        delayTextDesc.textContent = getText('delayTextDesc');

        delayTextOption.appendChild(delayTextLabel);
        delayTextOption.appendChild(delayTextDesc);

        // 编码延迟设置
        const encodingOption = document.createElement('div');
        encodingOption.className = 'twitch-latency-settings-option';

        const encodingLabel = document.createElement('label');
        encodingLabel.className = 'twitch-latency-settings-label';
        encodingLabel.appendChild(document.createTextNode(getText('encodingLatency')));

        const encodingInput = document.createElement('input');
        encodingInput.className = 'twitch-latency-settings-number';
        encodingInput.type = 'number';
        encodingInput.min = '0';
        encodingInput.step = '0.1';
        encodingInput.value = GM_getValue('encoding_latency', 1.5);
        encodingInput.addEventListener('change', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0) {
                GM_setValue('encoding_latency', value);
                setEncodingLatency(value);
            }
        });

        encodingLabel.appendChild(encodingInput);

        const encodingDesc = document.createElement('div');
        encodingDesc.className = 'twitch-latency-settings-description';
        encodingDesc.textContent = getText('encodingLatencyDesc');

        encodingOption.appendChild(encodingLabel);
        encodingOption.appendChild(encodingDesc);

        // 快速操作按钮
        const fastActionOption = document.createElement('div');
        fastActionOption.className = 'twitch-latency-settings-option';

        const fastForwardBtn = document.createElement('button');
        fastForwardBtn.textContent = getText('fastForward');
        fastForwardBtn.className = 'twitch-latency-settings-button';
        fastForwardBtn.addEventListener('click', () => {
            fastForwardBuffer();
            fastForwardBtn.blur();
        });

        fastActionOption.appendChild(fastForwardBtn);

        // 调试选项
        const debugOption = document.createElement('div');
        debugOption.className = 'twitch-latency-settings-option';

        const debugLabel = document.createElement('label');
        debugLabel.className = 'twitch-latency-settings-label';

        const debugCheckbox = document.createElement('input');
        debugCheckbox.className = 'twitch-latency-settings-checkbox';
        debugCheckbox.type = 'checkbox';
        debugCheckbox.checked = GM_getValue('debug_mode', false);
        debugCheckbox.addEventListener('change', (e) => {
            GM_setValue('debug_mode', e.target.checked);
        });

        debugLabel.appendChild(debugCheckbox);
        debugLabel.appendChild(document.createTextNode(getText('enableDebug')));

        const debugDesc = document.createElement('div');
        debugDesc.className = 'twitch-latency-settings-description';
        debugDesc.textContent = getText('enableDebugDesc');

        debugOption.appendChild(debugLabel);
        debugOption.appendChild(debugDesc);

        // 添加刷新提示
        const refreshHint = document.createElement('div');
        refreshHint.className = 'twitch-latency-settings-description';
        refreshHint.style.color = '#ff8280';
        refreshHint.style.marginTop = '10px';
        refreshHint.textContent = getText('refreshHint');

        // 添加页脚说明
        const footer = document.createElement('div');
        footer.className = 'twitch-latency-settings-footer';
        footer.textContent = getText('hoverStatsHint');

        // 组装弹窗
        optionsContainer.appendChild(langOption);
        optionsContainer.appendChild(statsOption);
        optionsContainer.appendChild(autoOpenStatsOption);
        // 顺序调整：快进按钮前插入编码延迟和调试模式
        optionsContainer.appendChild(debugOption); // 调试模式在前
        optionsContainer.appendChild(encodingOption); // 编码延迟在调试模式后
        optionsContainer.appendChild(ffBtnOption); // 快进按钮
        optionsContainer.appendChild(delayTextOption);
        optionsContainer.appendChild(fastActionOption);
        optionsContainer.appendChild(refreshHint);

        container.appendChild(header);
        container.appendChild(optionsContainer);
        container.appendChild(footer);

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // 点击弹窗外部关闭弹窗
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // 注册单个菜单命令
    function registerMenuCommand() {
        GM_registerMenuCommand("Settings / 设置", createSettingsUI);
    }

    // 编码延迟的全局变量
    let encoding_latency_localvalue;

    // 主监听函数
    function main_listener(interval = 900) {
        let last_timeStamp = 0;
        return async function(event) {
            if(event.timeStamp - last_timeStamp <= interval) return; // 节流
            last_timeStamp = event.timeStamp;

            if(event.target.nodeName !== "VIDEO") {
                return;
            }

            if(typeof encoding_latency_localvalue === "undefined") {
                encoding_latency_localvalue = GM_getValue("encoding_latency", 1.5);
            }

            const output1 = document.querySelector(".chat-wysiwyg-input__placeholder"); // ".rich-input-container" 的第一个子元素
            const output2 = document.querySelector(`[data-a-target="chat-input"]`); // (`textarea[aria-label="发送消息"]`);
            const chat_left = document.querySelector(`[data-test-selector="chat-room-component-layout"]`)?.getBoundingClientRect().left;
            if((output1 || output2) && chat_left && window.innerWidth > chat_left) {
                // 获取当前语言的延迟文本标签
                const currentLang = getCurrentLanguage();
                const bufferSizeLabel = languages[currentLang].bufferSize;
                const latencyLabel = languages[currentLang].latencyToBroadcaster;

                const delay1 = document.querySelector(`[aria-label="${bufferSizeLabel}"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               document.querySelector(`[aria-label="Buffer Size"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               document.querySelector(`[aria-label="缓冲区大小"]`)?.textContent?.match(/([0-9.]+)/)?.[1]; // Buffer Size

                const delay2 = document.querySelector(`[aria-label="${latencyLabel}"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               document.querySelector(`[aria-label="Latency To Broadcaster"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               document.querySelector(`[aria-label="直播者延迟"]`)?.textContent?.match(/([0-9.]+)/)?.[1]; // Latency To Broadcaster

                if(delay1 && delay2) {
                    const max_delay = Math.max(delay1 * 1, delay2 * 1); // 回放以人为增加缓冲区时，广播延迟的缓冲区值更新较慢，暂时使用较大值

                    // 检查是否启用聊天框显示总延迟
                    if (GM_getValue('sw_show_delay_text', true)) {
                        const text = getText('totalDelay', (max_delay + encoding_latency_localvalue).toFixed(2));
                        output1 && (output1.textContent = text);
                        output2?.setAttribute("placeholder", text);
                    }
                }
                else {
                    // 检查是否自动打开视频统计
                    if(GM_getValue("sw_auto_open_stats", true)) {
                        showVideoStats.menuClick();
                    }
                }

                createFFButton();
            }
        };
    }

    // 弹出聊天窗口的计时器
    function popupChat_intervalTimer() {
        if(!opener?.document.documentElement) {
            console.log(getText('openerNotExists'));
            return;
        }
        const loop_timer = setInterval(async () => {
            if(!opener?.document.documentElement) {
                console.log(getText('openerClosed'));
                clearInterval(loop_timer);
                return;
            }
            if(!encoding_latency_localvalue) {
                encoding_latency_localvalue = GM_getValue("encoding_latency", 1.5);
            }

            const output1 = document.querySelector(".chat-wysiwyg-input__placeholder");
            const output2 = document.querySelector(`[data-a-target="chat-input"]`);
            if(output1 || output2) {
                // 获取当前语言的延迟文本标签
                const currentLang = getCurrentLanguage();
                const bufferSizeLabel = languages[currentLang].bufferSize;
                const latencyLabel = languages[currentLang].latencyToBroadcaster;

                const delay1 = opener.document.querySelector(`[aria-label="${bufferSizeLabel}"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               opener.document.querySelector(`[aria-label="Buffer Size"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               opener.document.querySelector(`[aria-label="缓冲区大小"]`)?.textContent?.match(/([0-9.]+)/)?.[1]; // Buffer Size

                const delay2 = opener.document.querySelector(`[aria-label="${latencyLabel}"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               opener.document.querySelector(`[aria-label="Latency To Broadcaster"]`)?.textContent?.match(/([0-9.]+)/)?.[1] ||
                               opener.document.querySelector(`[aria-label="直播者延迟"]`)?.textContent?.match(/([0-9.]+)/)?.[1]; // Latency To Broadcaster

                if(delay1 && delay2) {
                    const max_delay = Math.max(delay1 * 1, delay2 * 1);

                    // 检查是否启用聊天框显示总延迟
                    if (GM_getValue('sw_show_delay_text', true)) {
                        const text = getText('totalDelay', (max_delay + encoding_latency_localvalue).toFixed(2));
                        output1 && (output1.textContent = text);
                        output2?.setAttribute("placeholder", text);
                    }
                }
                else {
                    // 检查是否自动打开视频统计
                    if(GM_getValue("sw_auto_open_stats", true)) {
                        showVideoStats.menuClick();
                    }
                }

                createFFButton(true);
            }
        }, 1000);
    }

    // 显示视频统计信息
    const showVideoStats = (function() {
        let run_flag;
        let hidemenu_css_timer;

        function menuClick(delay = 200) {
            if(run_flag || !document.querySelector(`[data-a-target="player-settings-button"]`)) {
                debugLog("menuClick - 退出原因:", run_flag ? "run_flag已设置" : "未找到设置按钮");
                return;
            }
            run_flag = true;
            let limit = 20;

            // 保存第一个设置按钮的引用
            const firstSettingBtn = document.querySelector(`[data-a-target="player-settings-button"]`);
            debugLog("已保存第一个设置按钮");

            const menuloop = setInterval(() => {
                const visibled_video_stats = !!document.querySelector(`[data-a-target="player-overlay-video-stats"]`);
                debugLog("menuloop - 视频统计是否可见:", visibled_video_stats);

                if(limit-- <= 0) {
                    console.error("[TLD DEBUG] menuloop - 达到最大尝试次数限制");
                    clearInterval(menuloop);
                    run_flag = false;
                    return;
                }

                if(!visibled_video_stats) {
                    const visibled_menu = !!document.querySelector(`[data-a-target="player-settings-menu"]`);
                    const setting_btn = document.querySelectorAll(`[data-a-target="player-settings-button"]`);
                    const advanced_btn = document.querySelectorAll(`[data-a-target="player-settings-menu-item-advanced"]`);
                    const video_stats = document.querySelector(`[data-a-target="player-settings-submenu-advanced-video-stats"] input`);

                    debugLog("当前状态:", {
                        visibled_menu,
                        "设置按钮数量": setting_btn.length,
                        "高级按钮数量": advanced_btn.length,
                        "视频统计复选框": video_stats ? (video_stats.checked ? "已选中" : "未选中") : "未找到"
                    });

                    if(!visibled_menu && setting_btn.length) {
                        debugLog("点击第一个设置按钮");
                        firstSettingBtn.click();
                        return;
                    }
                    else if(advanced_btn.length) {
                        debugLog("点击第一个高级按钮");
                        advanced_btn[0].click();
                        return;
                    }
                    if(video_stats?.checked === false) {
                        debugLog("点击视频统计复选框");
                        video_stats.click();
                        return;
                    }
                }
                else {
                    debugLog("视频统计已显示，点击设置按钮关闭菜单");
                    firstSettingBtn.click();
                    debugLog("菜单操作完成，清理定时器");
                    clearInterval(menuloop);
                    run_flag = false;

                    // 提前结束菜单隐藏计时器
                    if(hidemenu_css_timer) {
                        clearTimeout(hidemenu_css_timer);
                        document.documentElement.classList.remove("twitch_latency_hide_menu");
                        hidemenu_css_timer = null;
                    }
                    return;
                }
            }, delay);
        }

        return { menuClick };
    })();

    // 创建快进按钮(插入到聊天输入区域)
    function createFFButton(is_popup = false) {
        if(document.querySelector(".FF_buffer_btn") || !GM_getValue("sw_show_ff_btn", true)) return;

        const container = document.querySelector(`[data-test-selector="chat-input-buttons-container"] > :last-child`);
        if (!container) return;

        const ff_btn = document.createElement("button");
        ff_btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <path d="M11,10.036L2.413,16.888V3.183Z"/>  <path d="M18.623,10.036l-8.587,6.852V3.183Z"/>
        </svg>`;
        ff_btn.setAttribute("class", "FF_buffer_btn");
        ff_btn.setAttribute("title", getText('ffBtnTitle'));

        if(is_popup) {
            ff_btn.addEventListener("click", function() {
                opener?.document.querySelectorAll("video").forEach(video => {
                    video.buffered.length && (video.currentTime = video.buffered.end(video.buffered.length - 1));
                });
                this.blur();
            });
        } else {
            ff_btn.addEventListener("click", function() {
                fastForwardBuffer();
                this.blur();
            });
        }

        container.prepend(ff_btn);
    }

    // 切换小型视频统计显示
    function toggleSmallVideoStats(show) {
        if(show) {
            document.documentElement.removeAttribute("hide_video_stats");
            // 自动打开视频统计
            showVideoStats.menuClick();
        } else {
            document.documentElement.setAttribute("hide_video_stats", "");

            // 确保视频统计信息已打开
            const videoStats = document.querySelector(`[data-a-target="player-overlay-video-stats"]`);
            if (!videoStats) {
                // 如果统计信息未显示，则打开它
                showVideoStats.menuClick();
            }
        }
    }

    // 切换快进按钮显示
    function toggleFFBtn(show) {
        if(show) {
            document.documentElement.removeAttribute("hide_ff_btn");
            createFFButton();
        } else {
            document.documentElement.setAttribute("hide_ff_btn", "");
            // 移除现有按钮 (虽然CSS已经隐藏，但为了保持DOM干净)
            const existingBtn = document.querySelector(".FF_buffer_btn");
            if(existingBtn) existingBtn.remove();
        }
    }

    // 设置编码延迟
    function setEncodingLatency(value) {
        encoding_latency_localvalue = undefined;
    }

    // 快进缓冲区
    function fastForwardBuffer() {
        document.querySelectorAll("video").forEach(video => {
            video.buffered.length && (video.currentTime = video.buffered.end(video.buffered.length - 1));
        });
    }

    // 调试日志函数
    function debugLog(message, data = null) {
        if (!GM_getValue('debug_mode', false)) return;
        const prefix = '[TLD DEBUG]';
        if (data) {
            console.log(prefix, message, data);
        } else {
            console.log(prefix, message);
        }
    }

    // 初始化脚本
    function initScript() {
        initSettings();
        registerMenuCommand();

        const sw_show_ff_btn = GM_getValue("sw_show_ff_btn", true);
        if(!sw_show_ff_btn) {
            document.documentElement.setAttribute("hide_ff_btn", "");
        }

        const pathname_split = location.pathname?.split("/");
        if(pathname_split[1] === "popout" && pathname_split[3] === "chat") {
            popupChat_intervalTimer();
            return;
        }

        const show_stats = GM_getValue("sw_show_small_video_stats_css", true);
        if(!show_stats) {
            document.documentElement.setAttribute("hide_video_stats", "");
        }

        // 检查是否自动打开视频统计
        if(GM_getValue("sw_auto_open_stats", true)) {
            // 延迟一点时间确保页面元素已加载
            setTimeout(() => {
                const videoStats = document.querySelector(`[data-a-target="player-overlay-video-stats"]`);
                if (!videoStats) {
                    showVideoStats.menuClick();
                }
            }, 2000);
        }

        if(!document.documentElement.hasAttribute("video_latency_display")) {
            document.documentElement.setAttribute("video_latency_display", "");
            document.addEventListener("timeupdate", main_listener(900), true);
        }
    }

    // 启动脚本
    initScript();
    console.log(getText('scriptLoaded'));
})();