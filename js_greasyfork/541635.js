// ==UserScript==
// @name         onlineChat-在线网页聊天室
// @namespace    sage_home
// @version      1.2
// @description  和所有人在线交流，安全匿名，无需账号，无需客户端，保护隐私，在线网页聊天室
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @connect      supabase.co
// @require      https://unpkg.com/@supabase/supabase-js@2.49.3/dist/umd/supabase.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @downloadURL https://update.greasyfork.org/scripts/541635/onlineChat-%E5%9C%A8%E7%BA%BF%E7%BD%91%E9%A1%B5%E8%81%8A%E5%A4%A9%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/541635/onlineChat-%E5%9C%A8%E7%BA%BF%E7%BD%91%E9%A1%B5%E8%81%8A%E5%A4%A9%E5%AE%A4.meta.js
// ==/UserScript==



(function () {
    'use strict';

    // 配置参数
    const CONFIG = {
        SUPABASE_URL: 'https://icaugjyuwenraxxgwvzf.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljYXVnanl1d2VucmF4eGd3dnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODcwNjcsImV4cCI6MjA1ODQ2MzA2N30.-IsrU3_NyoqDxFeNH1l2d6SgVv9pPA0uIVEA44FmuSQ',
        CHAT_UI: {
            width: 365,
            height: 700,
            position: { right: '5px', bottom: '90px' },
            bubblePosition: { right: '5px', bottom: '20px' },
            theme: {
                primary: '#8b5cf6',
                primaryLight: '#a78bfa',
                background: '#0a0a0a',
                surface: '#1a1a1a',
                surfaceLight: '#2a2a2a',
                text: '#e0e0e0',
                textSecondary: '#999999',
                border: '#333333',
                shadow: 'rgba(0, 0, 0, 0.8)'
            }
        }
    };

    // 样式管理模块
    const StyleManager = (() => {
        const cssVariables = `
            :root {
                --chat-bg: ${CONFIG.CHAT_UI.theme.background};
                --chat-surface: ${CONFIG.CHAT_UI.theme.surface};
                --chat-surface-light: ${CONFIG.CHAT_UI.theme.surfaceLight};
                --chat-text: ${CONFIG.CHAT_UI.theme.text};
                --chat-text-secondary: ${CONFIG.CHAT_UI.theme.textSecondary};
                --primary-color: ${CONFIG.CHAT_UI.theme.primary};
                --primary-light: ${CONFIG.CHAT_UI.theme.primaryLight};
                --border-color: ${CONFIG.CHAT_UI.theme.border};
                --shadow-color: ${CONFIG.CHAT_UI.theme.shadow};
            }
        `;

        const scrollbarCSS = `
            #chat-messages::-webkit-scrollbar {
                width: 6px;
                background: transparent;
            }
            #chat-messages::-webkit-scrollbar-track {
                background: var(--chat-surface);
                border-radius: 3px;
            }
            #chat-messages::-webkit-scrollbar-thumb {
                background: var(--chat-surface-light);
                border-radius: 3px;
                transition: background 0.2s ease;
            }
            #chat-messages::-webkit-scrollbar-thumb:hover {
                background: #475569;
            }
            #chat-messages {
                scrollbar-width: thin;
                scrollbar-color: var(--chat-surface-light) var(--chat-surface);
            }
        `;

        const animationsCSS = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(15px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
            }
        `;

        const globalStylesCSS = `
            #chat-container {
                animation: slideIn 0.4s ease-out;
                background: var(--chat-bg);
                border: 1px solid var(--border-color);
                border-radius: 20px;
                overflow: hidden;
            }
            #chat-messages {
                background: var(--chat-surface);
            }
            #input-container {
                padding: 12px;
                border-top: 1px solid var(--border-color);
                box-sizing: border-box;
                background: var(--chat-surface);
                position: relative;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }
            #chat-input {
                width: 100%;
                min-height: 48px;
                max-height: 120px;
                padding: 12px 16px;
                background: var(--chat-surface-light);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                color: var(--chat-text);
                resize: vertical;
                font-size: 14px;
                line-height: 1.5;
                transition: all 0.3s ease;
                overflow-y: auto;
                box-sizing: border-box;
            }
            #chat-input::-webkit-scrollbar {
                display: none;
            }
            #chat-input:focus {
                outline: none;
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }


            #chat-send-button:active {
                transform: translateY(0);
            }
            .online-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #10b981;
                margin-right: 6px;
                display: inline-block;
                animation: pulse 2s infinite;
            }
            #chat-header {
                padding: 20px 24px;
                border-bottom: 1px solid var(--border-color);
                background: linear-gradient(135deg, var(--chat-bg), var(--chat-surface));
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                height: auto;
            }
            .online-count {
                font-size: 16px;
                font-weight: 600;
                color: white;
            }
            #online-users {
                color: white;
                font-weight: 600;
            }
            #chat-minimize-button {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.1);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                font-weight: bold;
                transition: all 0.2s ease;
            }
            #chat-minimize-button:hover {
                background-color: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            #chat-minimize-button:active {
                transform: scale(0.95);
            }
            #chat-bubble {
                position: fixed;
                right: ${CONFIG.CHAT_UI.position.right};
                bottom: ${CONFIG.CHAT_UI.position.bottom};
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--chat-surface), var(--border-color));
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255,255,255,0.05) inset;
                z-index: 9999;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);;
                /* 禁止选择内部内容 */
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                /* 禁止拖拽 */
                -webkit-user-drag: none;
                user-drag: none;
            }
            #chat-bubble.show {
                display: flex;
                animation: slideIn 0.4s ease-out;
            }
            #chat-bubble:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
            }
            #chat-bubble:active {
                transform: scale(0.95);
            }
            #chat-bubble-icon {
                color: var(--chat-text);
                font-size: 28px;
                font-weight: bold;
                /* 禁止选择图标 */
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                /* 禁止拖拽 */
                -webkit-user-drag: none;
                user-drag: none;
            }
        `;

        return {
            inject: () => {
                const style = document.createElement('style');
                style.textContent = `${cssVariables} ${scrollbarCSS} ${animationsCSS} ${globalStylesCSS}`;
                document.head.appendChild(style);
            }
        };
    })();

    // Supabase 客户端管理
    const SupabaseClient = (() => {
        let client;

        return {
            initialize: async () => {
                client = window.supabase.createClient(
                    CONFIG.SUPABASE_URL,
                    CONFIG.SUPABASE_KEY,
                    {
                        realtime: { params: { eventsPerSecond: 10 } }
                    }
                );
                return client;
            },
            getClient: () => client
        };
    })();

    // HLS播放器模块
    const HlsPlayer = {
        config: {
            BUFFER_LENGTH: 10,
            MAX_RETRY: 3,
            ERROR_DELAY: 5000
        },

        init: function (videoElement, streamUrl) {
            console.log('[HLS Init] 开始初始化HLS播放器', streamUrl);
            if (typeof Hls === 'undefined') {
                console.error('[HLS Init] Hls库未加载');
                return null;
            }

            const hls = new Hls({
                maxBufferLength: this.config.BUFFER_LENGTH,
                maxMaxBufferLength: this.config.BUFFER_LENGTH * 3
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(videoElement);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('[HLS] 视频流已解析');
                /* videoElement.play().catch(err => {
                    console.error('[HLS]播放失败:', err);
                }); */
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('[HLS]致命错误:', data);
                }
            });

            return hls;
        },
    };

    // 聊天室核心功能
    class ChatRoom {
        constructor(supabase) {
            this.supabase = supabase; // 使用全局已实例化的Supabase客户端
            // 初始化首次展开标志位
            this.isFirstExpand = true;
            // this.container = this.createContainer(); // 移除对不存在方法的调用
            this.initUI();
            // 初始化用户和实时连接
            this.initializeUser();
            this.setupRealtime();
            this.loadHistory();
            // 页面关闭时清理资源
            window.addEventListener('beforeunload', () => this.cleanup());
        }


        initUI() {
            // 聊天窗口容器 - 固定在右下方，使用配置文件中的位置
            this.container = document.createElement('div');
            this.container.id = 'chat-container';
            Object.assign(this.container.style, {
                position: 'fixed',
                right: CONFIG.CHAT_UI.position.right,
                bottom: CONFIG.CHAT_UI.position.bottom,
                width: `${CONFIG.CHAT_UI.width}px`,
                height: `${CONFIG.CHAT_UI.height}px`,
                backgroundColor: 'var(--chat-bg)',
                borderRadius: '20px',
                boxShadow: '0 20px 60px var(--shadow-color), 0 0 1px rgba(255,255,255,0.1) inset',
                zIndex: 9999,
                display: 'none', // 初始状态隐藏容器
                flexDirection: 'column',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                boxSizing: 'border-box',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            });

            // 聊天窗口头部 - 调整高度
            this.header = document.createElement('div');
            this.header.id = 'chat-header';
            this.header.innerHTML = `
                <div class="online-count">
                    <span class="online-dot"></span>
                    <span id="online-users">0</span> 人在线
                </div>
            `;
            // 调整抬头高度，减少padding
            this.header.style.padding = '10px 24px';
            this.container.appendChild(this.header);

            // 最小化气泡 - 固定在右下方，始终显示，使用配置文件中的位置
            this.bubble = document.createElement('div');
            this.bubble.id = 'chat-bubble';
            this.bubble.innerHTML = '<div id="chat-bubble-icon">💬</div>';
            // 设置气泡固定在右下方，初始状态就显示
            Object.assign(this.bubble.style, {
                right: CONFIG.CHAT_UI.bubblePosition.right,
                bottom: CONFIG.CHAT_UI.bubblePosition.bottom,
                display: 'flex' // 始终显示气泡
            });
            this.bubble.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });
            document.body.appendChild(this.bubble);

            this.messageArea = this.createMessageArea();
            this.input = this.createInput();

            // 创建输入区域容器
            this.inputContainer = document.createElement('div');
            this.inputContainer.id = 'input-container';
            this.inputContainer.append(this.input);

            this.container.append(this.messageArea, this.inputContainer);
            document.body.appendChild(this.container);
        }

        createMessageArea() {
            const div = document.createElement('div');
            Object.assign(div.style, {
                flex: 1,
                padding: '20px 24px',
                overflowY: 'auto',
                color: 'var(--chat-text)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            });
            div.id = 'chat-messages';
            return div;
        }

        createInput() {
            const input = document.createElement('textarea');
            input.id = 'chat-input';
            input.placeholder = '输入消息（Enter 发送）';

            // 自动调整输入框高度和检查输入内容
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 120) + 'px';

                // 检查输入内容，启用或禁用发送按钮
                if (this.sendButton) {
                    if (input.value.trim()) {
                        this.sendButton.disabled = false;
                    } else {
                        this.sendButton.disabled = true;
                    }
                }
            });

            // 输入框键盘事件 - 支持按Enter直接发送
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            return input;
        }



        // 新增IP获取方法
        async getClientIP() {
            try {
                // 备选方案：使用第三方IP查询
                const { ip } = await fetch('https://api.ipify.org?format=json').then(r => r.json());
                return ip;
            } catch (error) {
                // 备选方案
                console.log('获取IP失败', error);
                return '0.0.0.0';
            }
        }

        /**
         * 初始化用户：检查登录状态，若无则匿名登录
         */
        async initializeUser() {
            try {
                // GM_getValue 实现跨域一致性
                this.userId = await GM_getValue('user_id');
                if (this.userId) {
                    console.log('===已存在用户ID===', this.userId);
                    //GM_deleteValue('user_id');//仅测试
                    return;
                }
                else {
                    // 匿名登录
                    const { data, error } = await this.supabase.auth.signInAnonymously({
                        options: {
                            data: {
                                ip: await this.getClientIP(),
                                device_info: {
                                    screen_resolution: `${screen.width}x${screen.height}`,
                                    color_depth: screen.colorDepth + 'bit',
                                    preferred_language: navigator.language,
                                    timezone_offset: new Date().getTimezoneOffset() / 60,
                                    hardware_concurrency: navigator.hardwareConcurrency || 'unknown',
                                    os_platform: navigator.platform,
                                    user_agent: navigator.userAgent.substring(0, 100)
                                }
                            }
                        }
                    });
                    console.log('===注册匿名用户===', data, error);
                    if (error) throw error;
                    this.userId = data.session.user.id;
                    GM_setValue('user_id', this.userId);
                }
            } catch (error) {
                console.error('用户初始化失败:', error);
                //alert('无法连接到聊天服务器，请刷新页面重试');
            }
        }

        /**
         * 设置实时通信：消息和在线状态
         */
        async setupRealtime() {
            // 统一通信频道（集成消息+在线状态）
            this.messageChannel = this.supabase.channel('chat-room', {
                config: {
                    presence: {
                        key: this.userId,
                        heartbeatInterval: 15,
                        statusTTL: 60
                    }
                }
            })
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                }, payload => this.addMessage(payload.new))
                .on('presence', { event: 'sync' }, () => {
                    try {
                        const states = this.messageChannel.presenceState();
                        const onlineCount = Object.values(states).length;
                        this.updateOnlineCount(onlineCount);
                    } catch (e) {
                        console.error('[Presence状态同步异常]', e);
                    }
                })
                .subscribe();

            // 跟踪用户在线状态
            await this.messageChannel.track({
                user_id: this.userId,
                online_at: new Date().toISOString()
            });
        }


        addMessage(message) {
            //if (message.domain !== location.host) return; // 过滤非法消息
            const isOwn = message.user_id === this.userId;
            const msgElement = document.createElement('div');

            // 设置消息容器样式，确保左右对齐
            Object.assign(msgElement.style, {
                display: 'flex',
                width: '100%',
                margin: '12px 0',
                justifyContent: isOwn ? 'flex-end' : 'flex-start'
            });

            // 智能内容解析与样式优化
            // 消息气泡渲染组件 - 优化版（支持左右分开显示）
            const renderMessageBubble = (message, isOwn) => {
                const userName = message.user_id.split('-')[0] || '匿名用户';
                const timeStr = new Date(message.created_at).toLocaleString('zh-CN', {
                    hour12: false,
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).replace(/(\d+)\/(\d+), (\d+:\d+)/, '$2-$3 $4');

                // 用户头像颜色 - 根据用户名生成唯一颜色
                const userColor = `hsl(${(userName.charCodeAt(0) * 37 + userName.charCodeAt(1)) % 360}, 70%, 60%)`;

                return `
                    <div style="
                        padding: 16px 20px;
                        background: ${isOwn ?
                            'linear-gradient(135deg, var(--chat-surface), var(--chat-surface-light))' :
                            'linear-gradient(135deg, var(--chat-surface), var(--chat-surface-light))'};
                        border-radius: ${isOwn ? '20px 20px 8px 20px' : '20px 20px 20px 8px'};
                        color: ${isOwn ? 'var(--chat-text)' : 'var(--chat-text)'};
                        box-shadow: ${isOwn ?
                            '0 6px 20px rgba(0, 0, 0, 0.5)' :
                            '0 6px 20px rgba(0, 0, 0, 0.5)'};
                        max-width: 90%;
                        animation: fadeInUp 0.4s ease-out forwards;
                        opacity: 0;
                        transform: translateY(10px);
                        position: relative;
                        overflow: hidden;">

                        <!-- 气泡装饰元素 -->
                        <div style="
                            position: absolute;
                            top: 0;
                            ${isOwn ? 'right: 0;' : 'left: 0;'}
                            width: 60px;
                            height: 60px;
                            background: ${isOwn ?
                                'radial-gradient(circle, rgba(255,255,255,0.15), transparent)' :
                                'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent)'};
                            border-radius: 50%;
                            transform: translate(${isOwn ? '20px' : '-20px'}, -20px);
                        "></div>

                        <!-- 用户信息栏 -->
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            font-size: 12px;
                            font-weight: 600;
                            color: ${isOwn ? 'var(--chat-text-secondary)' : 'var(--chat-text-secondary)'};
                            margin-bottom: 8px;">

                            <!-- 用户头像 -->
                            <div style="
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                background: ${userColor};
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 10px;
                                font-weight: 700;
                                color: white;
                                flex-shrink: 0;
                                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                            ">${userName.charAt(0).toUpperCase()}</div>

                            <span>${userName}</span>
                            <span style="color: ${isOwn ? 'rgba(255, 255, 255, 0.6)' : 'var(--chat-text-tertiary)'};">•</span>
                            <span style="font-weight: 400;">${timeStr}</span>

                            <!-- 消息状态标识 -->
                            ${isOwn ? `
                                <div style="
                                    margin-left: auto;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;">                                    <svg style="width: 14px; height: 14px; color: var(--chat-text-tertiary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>` : ''}
                        </div>

                        <!-- 消息内容 -->
                        <div style="
                            word-wrap: break-word;
                            line-height: 1.5;
                            font-size: 14px;">
                            ${createMessageContent(message)}
                        </div>
                    </div>
                `;
            };

            // 多媒体内容解析器 - 优化版
            const createMessageContent = (message) => {
                const content = message.content;
                // 修改正则表达式，允许匹配带有参数的URL，直到遇到空格、换行符或结束
                const mediaPattern = /(https?:\/\/.*?\.(?:png|jpg|gif|mp4|m3u8|webm|mp3)(?:\?[^\s\n]*)?)/gi;
                const elements = [];

                content.split('\n').forEach(text => {
                    let remaining = text;
                    let match;
                    while ((match = mediaPattern.exec(text)) !== null) {
                        const media_id = `msg_${message.id}-media_${match.index}`;
                        const [url] = match;
                        const prefix = remaining.slice(0, match.index);
                        if (prefix) elements.push(`<div style="margin-bottom: 8px;">${prefix}</div>`);

                        let mediaTag = null;
                        if (url.match(/\.(png|jpg|gif)$/i)) {
                            mediaTag = `<div style="margin: 10px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); transition: transform 0.2s ease;">
                                <img src="${url}?ts=${Date.now()}"
                                     referrerpolicy="no-referrer-when-downgrade"
                                     style="max-width: 100%; height: auto; display: block;"
                                     loading="lazy">
                            </div>`;
                        }
                        else if (url.match(/\.(mp3)$/i)) {
                            mediaTag = `<div style="margin: 10px 0;">
                                <audio controls style="width: 100%; background: rgba(0, 0, 0, 0.05); border-radius: 12px; padding: 8px; border: none;" src="${url}"></audio>
                            </div>`;
                        }
                        else if (url.match(/\.(mp4|webm)$/i)) {
                            mediaTag = `<div style="margin: 10px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);">
                                <video controls style="max-width: 100%; height: auto; display: block;" id="${media_id}" src="${url}"></video>
                            </div>`;
                        }
                        else if (url.match(/\.(m3u8)$/i)) {
                            mediaTag = `<div style="margin: 10px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);">
                                <video controls style="max-width: 100%; height: auto; display: block;"
                                    id="${media_id}"
                                    data-hls-src="${url}"
                                    data-hls-observer="pending"></video>
                            </div>`;
                        }
                        elements.push(mediaTag);
                        remaining = remaining.slice(match.index + url.length);
                    }
                    if (remaining) elements.push(`<div style="margin-bottom: 8px;">${remaining}</div>`);
                });

                return elements.join('');
            };

            // 消息渲染异常防御机制
            try {
                //const messageContainer = document.querySelector('#message-container');
                //console.assert(messageContainer, '消息容器未找到');

                const bubbleHTML = renderMessageBubble(message, isOwn);
                if (typeof bubbleHTML === 'string' && bubbleHTML.length > 0) {
                    msgElement.innerHTML = bubbleHTML;
                } else {
                    console.error('消息渲染异常:', { message, isOwn });
                    msgElement.innerHTML = `<div class="error-message">消息渲染失败</div>`;
                }
            } catch (e) {
                console.error('消息加载失败:', e);
                GM_notification({
                    title: '系统错误',
                    text: `消息加载失败: ${e.message}`,
                    timeout: 5000
                });
            }
            this.messageArea.appendChild(msgElement);
            // Initialize HLS for video elements
            msgElement.querySelectorAll('video[data-hls-src]').forEach(video => {
                const hlsSrc = video.dataset.hlsSrc;
                HlsPlayer.init(video, hlsSrc);
            });
            this.scrollToBottom();
        }

        scrollToBottom() {
            this.messageArea.scrollTo({
                top: this.messageArea.scrollHeight,
                behavior: 'smooth'
            });
        }

        async loadHistory() {
            try {
                const { data, error } = await this.supabase
                    .from('messages')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (error) throw error;
                if (!data || data.length === 0) return;

                const fragment = document.createDocumentFragment();
                data.reverse().forEach(msg => { this.addMessage(msg) });
                this.messageArea.appendChild(fragment);
                this.scrollToBottom();
            } catch (error) {
                console.error('加载消息历史失败:', error);
            }
        }

        /**
         * 更新在线人数显示
         * @param {number} count - 当前在线用户数量
         */
        updateOnlineCount(count) {
            const counter = document.getElementById('online-users');
            counter.textContent = count;
            counter.style.fontWeight = count > 0 ? '600' : '400';
        }

        /**
         * 切换聊天界面的显示/隐藏状态
         */
        toggleMinimize() {
            const wasHidden = this.container.style.display === 'none';
            this.isMinimized = !wasHidden;
            const display = this.isMinimized ? 'none' : 'flex';
            this.container.style.display = display;
            // 气泡始终显示，不随容器状态变化
            this.bubble.style.display = 'flex';

            // 只有首次从隐藏状态切换到显示状态时，才自动滚动到最新消息
            if (wasHidden && this.isFirstExpand) {
                this.scrollToBottom();
                // 设置标志位为false，表示已完成首次展开
                this.isFirstExpand = false;
            }
        }

        async cleanup() {
            // 取消所有频道订阅
            if (this.messageChannel) this.supabase.removeChannel(this.messageChannel);
        }
        /**
         * 清理资源和状态
         */
        async sendMessage() {
            const content = this.input.value.trim();
            if (!content) return;

            // 防刷机制（3秒间隔）
            if (this.lastSendTime && Date.now() - this.lastSendTime < 3000) {
                alert('发送过于频繁，请稍后再试');
                return;
            }

            try {
                const { error } = await this.supabase
                    .from('messages')
                    .insert({
                        content,
                        user_id: this.userId,
                        domain: location.host // 自动注入当前域名
                    });

                if (!error) {
                    this.input.value = '';
                    this.lastSendTime = Date.now();
                } else {
                    console.error('消息发送失败:', error);
                    //alert('消息发送失败: ' + error.message);
                }
            } catch (error) {
                console.error('消息发送失败:', error);
                //alert('消息发送失败: ' + error.message);
            }
        }


    }

    // 主初始化流程
    (async () => {
        StyleManager.inject();

        const checkInitialization = setInterval(async () => {
            if (window.supabase) {
                clearInterval(checkInitialization);
                const client = await SupabaseClient.initialize();
                new ChatRoom(client);
            }
        }, 500);
    })();

})();