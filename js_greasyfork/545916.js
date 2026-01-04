// ==UserScript==
// @name         超级调皮小幽灵 (DeepSeek版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在页面上添加一个会躲鼠标的可爱小幽灵，现在还能与DeepSeek对话！
// @author       Coding Master
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545916/%E8%B6%85%E7%BA%A7%E8%B0%83%E7%9A%AE%E5%B0%8F%E5%B9%BD%E7%81%B5%20%28DeepSeek%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545916/%E8%B6%85%E7%BA%A7%E8%B0%83%E7%9A%AE%E5%B0%8F%E5%B9%BD%E7%81%B5%20%28DeepSeek%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载保存的设置
    const savedSettings = GM_getValue('ghostSettings', {
        ghostColor: '#f0f0ff',
        eyeColor: '#64e3ff',
        size: 1,
        speed: 1,
        sensitivity: 120,
        autoHide: false,
        hideDuration: 30,
        showDuration: 60,
        showSpeech: true,
        enableDeepSeek: true,
        deepSeekAPIKey: '',
        deepSeekModel: 'deepseek-chat'
    });

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'ghost-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            z-index: 1000001;
            display: none;
            width: 350px;
            max-width: 90%;
            font-family: Arial, sans-serif;
        `;

        panel.innerHTML = `
            <h2 style="margin-top: 0; color: #333;">幽灵设置</h2>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">幽灵颜色:</label>
                <input type="color" id="ghost-color" value="${savedSettings.ghostColor}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">眼睛颜色:</label>
                <input type="color" id="eye-color" value="${savedSettings.eyeColor}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">大小: ${savedSettings.size}x</label>
                <input type="range" id="ghost-size" min="0.5" max="2" step="0.1" value="${savedSettings.size}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">速度: ${savedSettings.speed}x</label>
                <input type="range" id="ghost-speed" min="0.5" max="2" step="0.1" value="${savedSettings.speed}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">敏感度: ${savedSettings.sensitivity}px</label>
                <input type="range" id="ghost-sensitivity" min="80" max="200" step="10" value="${savedSettings.sensitivity}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center;">
                    <input type="checkbox" id="ghost-auto-hide" ${savedSettings.autoHide ? 'checked' : ''} style="margin-right: 8px;">
                    自动隐藏
                </label>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">隐藏时长: ${savedSettings.hideDuration}秒</label>
                <input type="range" id="ghost-hide-duration" min="10" max="120" step="5" value="${savedSettings.hideDuration}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">显示时长: ${savedSettings.showDuration}秒</label>
                <input type="range" id="ghost-show-duration" min="10" max="120" step="5" value="${savedSettings.showDuration}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center;">
                    <input type="checkbox" id="ghost-show-speech" ${savedSettings.showSpeech ? 'checked' : ''} style="margin-right: 8px;">
                    显示对话气泡
                </label>
            </div>
            <div style="margin-bottom: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                    <input type="checkbox" id="enable-deepseek" ${savedSettings.enableDeepSeek ? 'checked' : ''} style="margin-right: 8px;">
                    <strong>启用DeepSeek对话</strong>
                </label>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 13px;">DeepSeek API Key:</label>
                    <input type="password" id="deepseek-api-key" value="${savedSettings.deepSeekAPIKey}" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 13px;">模型:</label>
                    <select id="deepseek-model" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="deepseek-chat" ${savedSettings.deepSeekModel === 'deepseek-chat' ? 'selected' : ''}>DeepSeek Chat</option>
                        <option value="deepseek-coder" ${savedSettings.deepSeekModel === 'deepseek-coder' ? 'selected' : ''}>DeepSeek Coder</option>
                    </select>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    提示: 按D键可与幽灵对话
                </div>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <button id="save-settings" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
                <button id="reset-settings" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">重置</button>
                <button id="close-settings" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
            </div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // 创建对话面板
    function createChatPanel() {
        const panel = document.createElement('div');
        panel.id = 'ghost-chat-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            max-width: 90%;
            background: white;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            z-index: 1000000;
            display: none;
            flex-direction: column;
            font-family: Arial, sans-serif;
            overflow: hidden;
        `;

        panel.innerHTML = `
            <div style="background: #f5f5f5; padding: 12px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px; color: #333;">与幽灵对话</h3>
                <button id="close-chat" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">×</button>
            </div>
            <div id="chat-messages" style="flex: 1; padding: 15px; height: 300px; overflow-y: auto; background: #fff;">
                <div style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
                    幽灵正在等待你的消息...
                </div>
            </div>
            <div style="padding: 15px; border-top: 1px solid #eee; background: #f9f9f9;">
                <textarea id="chat-input" placeholder="输入消息..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: none; min-height: 60px; margin-bottom: 10px;"></textarea>
                <div style="display: flex; justify-content: space-between;">
                    <button id="send-message" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">发送</button>
                    <button id="clear-chat" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">清空</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // 添加聊天消息
    function addChatMessage(role, content) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        // 如果第一条消息是占位文本，清除它
        if (chatMessages.children.length === 1 && chatMessages.children[0].textContent === "幽灵正在等待你的消息...") {
            chatMessages.innerHTML = '';
        }

        const messageDiv = document.createElement('div');
        messageDiv.style.marginBottom = '15px';

        if (role === 'user') {
            messageDiv.innerHTML = `
                <div style="display: flex; justify-content: flex-end; margin-bottom: 5px;">
                    <div style="background: #e3f2fd; color: #333; padding: 10px; border-radius: 10px; max-width: 80%; word-wrap: break-word;">
                        ${content}
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; margin-bottom: 5px;">
                    <div style="width: 30px; height: 30px; background: #f0f0ff; border-radius: 50%; margin-right: 10px; flex-shrink: 0;"></div>
                    <div style="background: #f5f5f5; color: #333; padding: 10px; border-radius: 10px; max-width: 80%; word-wrap: break-word;">
                        ${content}
                    </div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 与DeepSeek API交互
    async function chatWithDeepSeek(message) {
        if (!savedSettings.enableDeepSeek || !savedSettings.deepSeekAPIKey) {
            return "DeepSeek功能未启用或API Key未设置";
        }

        addChatMessage('user', message);

        // 显示正在输入状态
        const chatMessages = document.getElementById('chat-messages');
        const typingIndicator = document.createElement('div');
        typingIndicator.innerHTML = `
            <div style="display: flex; align-items: flex-start; margin-bottom: 5px;">
                <div style="width: 30px; height: 30px; background: #f0f0ff; border-radius: 50%; margin-right: 10px; flex-shrink: 0;"></div>
                <div style="background: #f5f5f5; color: #333; padding: 10px; border-radius: 10px; max-width: 80%; word-wrap: break-word;">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 添加打字动画样式
        const style = document.createElement('style');
        style.textContent = `
            .typing-indicator {
                display: inline-flex;
                align-items: center;
                height: 20px;
            }
            .typing-indicator span {
                width: 6px;
                height: 6px;
                margin: 0 2px;
                background-color: #666;
                border-radius: 50%;
                display: inline-block;
                opacity: 0.4;
            }
            .typing-indicator span:nth-child(1) {
                animation: typing 1s infinite;
            }
            .typing-indicator span:nth-child(2) {
                animation: typing 1s infinite 0.2s;
            }
            .typing-indicator span:nth-child(3) {
                animation: typing 1s infinite 0.4s;
            }
            @keyframes typing {
                0% { opacity: 0.4; transform: translateY(0); }
                50% { opacity: 1; transform: translateY(-3px); }
                100% { opacity: 0.4; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://api.deepseek.com/v1/chat/completions",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${savedSettings.deepSeekAPIKey}`
                    },
                    data: JSON.stringify({
                        model: savedSettings.deepSeekModel,
                        messages: [
                            {
                                role: "system",
                                content: "你是一个调皮的网页小幽灵，喜欢开玩笑和恶作剧。用可爱、幽默的语气回答用户的问题，偶尔可以加入幽灵相关的双关语或玩笑。保持回答简洁，最多2-3句话。"
                            },
                            {
                                role: "user",
                                content: message
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 150
                    }),
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            const reply = data.choices[0].message.content;

            // 移除正在输入状态
            chatMessages.removeChild(typingIndicator);
            document.head.removeChild(style);

            addChatMessage('assistant', reply);

            // 如果气泡可见，也显示简短回复
            if (savedSettings.showSpeech && document.getElementById('ghost-chat-panel').style.display !== 'block') {
                const shortReply = reply.length > 30 ? reply.substring(0, 30) + '...' : reply;
                showSpeechBubble(shortReply);
            }

            return reply;
        } catch (error) {
            console.error("DeepSeek API错误:", error);

            // 移除正在输入状态
            chatMessages.removeChild(typingIndicator);
            document.head.removeChild(style);

            const errorMsg = "哎呀，幽灵网络出问题了！稍后再试吧~";
            addChatMessage('assistant', errorMsg);

            if (savedSettings.showSpeech) {
                showSpeechBubble(errorMsg);
            }

            return errorMsg;
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand('幽灵设置', function() {
        const panel = document.getElementById('ghost-settings-panel') || createSettingsPanel();
        panel.style.display = 'block';
    });

    // 创建幽灵元素
    function createGhost() {
        const ghost = document.createElement('div');
        ghost.id = 'playful-ghost';
        ghost.style.cssText = `
            position: fixed;
            width: ${80 * savedSettings.size}px;
            height: ${100 * savedSettings.size}px;
            cursor: pointer;
            z-index: 999999;
            transition: transform 0.3s ease, opacity 0.5s;
            user-select: none;
            display: none;
        `;

        ghost.innerHTML = `
            <div class="ghost-container" style="position: relative; width: 100%; height: 100%;">
                <div class="ghost-body" style="position: absolute; top: 0; left: 0; width: 100%; height: ${80 * savedSettings.size}px; background: ${savedSettings.ghostColor}; border-radius: 50% 50% 50% 50%; box-shadow: 0 0 ${15 * savedSettings.size}px rgba(255,255,255,0.5);"></div>
                <div class="ghost-eyes" style="position: absolute; top: ${35 * savedSettings.size}px; display: flex; justify-content: space-between; width: 100%; padding: 0 ${15 * savedSettings.size}px; transition: all 0.3s ease;">
                    <div class="eye left-eye" style="width: ${16 * savedSettings.size}px; height: ${22 * savedSettings.size}px; background: ${savedSettings.eyeColor}; border-radius: 50%; box-shadow: 0 0 ${8 * savedSettings.size}px rgba(100,227,255,0.8);"></div>
                    <div class="eye right-eye" style="width: ${16 * savedSettings.size}px; height: ${22 * savedSettings.size}px; background: ${savedSettings.eyeColor}; border-radius: 50%; box-shadow: 0 0 ${8 * savedSettings.size}px rgba(100,227,255,0.8);"></div>
                </div>
                <div class="ghost-mouth" style="position: absolute; top: ${60 * savedSettings.size}px; left: 50%; transform: translateX(-50%); width: ${30 * savedSettings.size}px; height: ${12 * savedSettings.size}px; border-radius: 0 0 ${10 * savedSettings.size}px ${10 * savedSettings.size}px; background: ${savedSettings.eyeColor}; transition: all 0.3s ease;"></div>
                <div class="ghost-bottom" style="position: absolute; bottom: 0; width: 100%; height: ${30 * savedSettings.size}px; display: flex;">
                    <div style="flex: 1; height: 100%; background: ${savedSettings.ghostColor}; border-radius: 0 0 0 ${15 * savedSettings.size}px;"></div>
                    <div style="flex: 1; height: 100%; background: ${savedSettings.ghostColor};"></div>
                    <div style="flex: 1; height: 100%; background: ${savedSettings.ghostColor};"></div>
                    <div style="flex: 1; height: 100%; background: ${savedSettings.ghostColor};"></div>
                    <div style="flex: 1; height: 100%; background: ${savedSettings.ghostColor}; border-radius: 0 0 ${15 * savedSettings.size}px 0;"></div>
                </div>
                <div class="speech-bubble" style="position: absolute; left: 50%; top: -${80 * savedSettings.size}px; transform: translateX(-50%); background: white; color: #333; padding: ${8 * savedSettings.size}px ${12 * savedSettings.size}px; border-radius: ${20 * savedSettings.size}px; font-size: ${14 * savedSettings.size}px; width: max-content; max-width: ${200 * savedSettings.size}px; text-align: center; box-shadow: 0 ${2 * savedSettings.size}px ${10 * savedSettings.size}px rgba(0,0,0,0.1); display: none; z-index: 1000000; font-family: Arial, sans-serif;">
                    👻 Boo! 点我试试！
                </div>
                <div class="ghost-hat" style="position: absolute; top: -${20 * savedSettings.size}px; left: 50%; transform: translateX(-50%); width: ${60 * savedSettings.size}px; height: ${20 * savedSettings.size}px; background: #FF5722; border-radius: ${5 * savedSettings.size}px ${5 * savedSettings.size}px 0 0; display: none;"></div>
                <div class="ghost-accessory" style="position: absolute; top: ${20 * savedSettings.size}px; right: ${10 * savedSettings.size}px; width: ${20 * savedSettings.size}px; height: ${20 * savedSettings.size}px; background: #FFC107; border-radius: 50%; display: none;"></div>
            </div>
        `;

        document.body.appendChild(ghost);
        return ghost;
    }

    // 初始化幽灵
    const ghost = createGhost();
    ghost.style.display = 'block';
    ghost.style.left = '100px';
    ghost.style.top = '100px';

    // 存储幽灵状态
    const ghostState = {
        posX: 100,
        posY: 100,
        velX: 0.8 * savedSettings.speed,
        velY: 0.8 * savedSettings.speed,
        rotation: 0,
        isHiding: false,
        emotion: 'normal', // normal, scared, happy, angry
        lastMouseX: 0,
        lastMouseY: 0,
        sensitivity: savedSettings.sensitivity,
        isFollowing: false,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        lastHideTime: 0,
        lastShowTime: Date.now(),
        accessories: {
            hat: false,
            bowtie: false,
            glasses: false
        },
        mood: 'playful', // playful, sleepy, excited
        currentAnimation: null,
        isChatting: false
    };

    // 可说的话
    const ghostPhrases = [
        "👻 Boo! 我抓住你了！",
        "幽灵需要抱抱~",
        "网页浏览太孤单？",
        "哈！想戳我？",
        "别跑，一起玩嘛！",
        "幽灵也要交朋友！",
        "偷偷告诉你个秘密...",
        "哇！你鼠标跑好快！",
        "我飘呀飘~",
        "小心，我可能会消失！",
        "网页里有幽灵出没👻",
        "一起在网上冲浪吗？",
        "按F键切换跟随模式",
        "空格键让我消失/出现",
        "拖拽我可以移动我哦",
        "右键点击我有惊喜！",
        "我有点困了...zzZ",
        "今天心情特别好！",
        "别惹我生气哦！",
        "看看我的新帽子！",
        "我是不是很时尚？",
        "按D键可以和我聊天！",
        "我是AI幽灵，聪明着呢！"
    ];

    // 改变幽灵表情
    function setGhostEmotion(emotion) {
        if (ghostState.isHiding) return;

        ghostState.emotion = emotion;
        const eyes = ghost.querySelector('.ghost-eyes');
        const mouth = ghost.querySelector('.ghost-mouth');

        switch(emotion) {
            case 'scared':
                eyes.style.transform = 'translateY(5px)';
                mouth.style.height = `${24 * savedSettings.size}px`;
                mouth.style.top = `${50 * savedSettings.size}px`;
                mouth.style.borderRadius = '50%';
                break;
            case 'happy':
                eyes.style.transform = 'translateY(-4px) scale(0.9)';
                mouth.style.height = `${8 * savedSettings.size}px`;
                mouth.style.top = `${62 * savedSettings.size}px`;
                mouth.style.width = `${40 * savedSettings.size}px`;
                mouth.style.borderRadius = `0 0 ${15 * savedSettings.size}px ${15 * savedSettings.size}px`;
                break;
            case 'angry':
                eyes.style.transform = 'translateY(2px)';
                eyes.querySelector('.left-eye').style.transform = 'rotate(-10deg)';
                eyes.querySelector('.right-eye').style.transform = 'rotate(10deg)';
                mouth.style.height = `${6 * savedSettings.size}px`;
                mouth.style.top = `${65 * savedSettings.size}px`;
                mouth.style.width = `${40 * savedSettings.size}px`;
                mouth.style.borderRadius = '0';
                break;
            case 'sleepy':
                eyes.style.transform = 'translateY(5px)';
                eyes.querySelector('.left-eye').style.height = `${6 * savedSettings.size}px`;
                eyes.querySelector('.right-eye').style.height = `${6 * savedSettings.size}px`;
                mouth.style.height = `${4 * savedSettings.size}px`;
                mouth.style.top = `${65 * savedSettings.size}px`;
                mouth.style.width = `${30 * savedSettings.size}px`;
                mouth.style.borderRadius = '0';
                break;
            default: // normal
                eyes.style.transform = '';
                if (eyes.querySelector('.left-eye').style.transform) {
                    eyes.querySelector('.left-eye').style.transform = '';
                    eyes.querySelector('.right-eye').style.transform = '';
                }
                if (eyes.querySelector('.left-eye').style.height) {
                    eyes.querySelector('.left-eye').style.height = `${22 * savedSettings.size}px`;
                    eyes.querySelector('.right-eye').style.height = `${22 * savedSettings.size}px`;
                }
                mouth.style.height = `${12 * savedSettings.size}px`;
                mouth.style.top = `${60 * savedSettings.size}px`;
                mouth.style.width = `${30 * savedSettings.size}px`;
                mouth.style.borderRadius = `0 0 ${10 * savedSettings.size}px ${10 * savedSettings.size}px`;
        }
    }

    // 改变幽灵心情
    function setGhostMood(mood) {
        ghostState.mood = mood;

        switch(mood) {
            case 'sleepy':
                setGhostEmotion('sleepy');
                ghostState.velX *= 0.5;
                ghostState.velY *= 0.5;
                if (savedSettings.showSpeech) showSpeechBubble("我有点困了...zzZ");
                break;
            case 'excited':
                setGhostEmotion('happy');
                ghostState.velX *= 1.5;
                ghostState.velY *= 1.5;
                if (savedSettings.showSpeech) showSpeechBubble("今天心情特别好！");
                break;
            default: // playful
                setGhostEmotion('normal');
        }
    }

    // 显示说话气泡
    function showSpeechBubble(text) {
        if (!savedSettings.showSpeech) return;

        const bubble = ghost.querySelector('.speech-bubble');
        if (!bubble) return;

        bubble.textContent = text;
        bubble.style.display = 'block';
        bubble.style.animation = 'fadeInUp 0.5s ease';

        // 应用动画关键帧
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                100% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);

        // 自动隐藏
        setTimeout(() => {
            bubble.style.animation = 'fadeOut 0.5s ease';

            // 添加淡出动画
            const fadeOutStyle = document.createElement('style');
            fadeOutStyle.textContent = `
                @keyframes fadeOut {
                    0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                }
            `;
            document.head.appendChild(fadeOutStyle);

            setTimeout(() => {
                bubble.style.display = 'none';
                document.head.removeChild(fadeOutStyle);
            }, 500);
        }, 3000);
    }

    // 幽灵隐身/显形
    function toggleGhostVisibility() {
        if (ghostState.isHiding) {
            // 逐渐显现
            ghost.style.opacity = '0';
            ghost.style.display = 'block';

            let opacity = 0;
            const fadeIn = setInterval(() => {
                opacity += 0.05;
                ghost.style.opacity = opacity;
                if (opacity >= 1) {
                    clearInterval(fadeIn);
                    ghostState.isHiding = false;
                    ghostState.lastShowTime = Date.now();
                }
            }, 30);

            // 随机新位置出现
            ghostState.posX = 50 + Math.random() * (window.innerWidth - 100);
            ghostState.posY = 50 + Math.random() * (window.innerHeight - 150);

            // 显示欢迎消息
            if (savedSettings.showSpeech) {
                setTimeout(() => {
                    showSpeechBubble("我回来啦！");
                }, 1000);
            }
        } else {
            // 逐渐消失
            let opacity = 1;
            const fadeOut = setInterval(() => {
                opacity -= 0.05;
                ghost.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(fadeOut);
                    ghost.style.display = 'none';
                    ghostState.isHiding = true;
                    ghostState.lastHideTime = Date.now();
                }
            }, 30);

            // 显示再见消息
            if (savedSettings.showSpeech) {
                showSpeechBubble("幽灵要躲起来啦！");
            }
        }
    }

    // 切换配件显示
    function toggleAccessory(accessory, show) {
        const element = ghost.querySelector(`.ghost-${accessory}`);
        if (element) {
            element.style.display = show ? 'block' : 'none';
            ghostState.accessories[accessory] = show;
        }
    }

    // 随机切换心情
    function randomMoodChange() {
        const moods = ['playful', 'sleepy', 'excited'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setGhostMood(randomMood);

        // 随机切换配件
        if (Math.random() < 0.3) {
            toggleAccessory('hat', Math.random() > 0.5);
        }
        if (Math.random() < 0.3) {
            toggleAccessory('accessory', Math.random() > 0.5);
        }
    }

    // 移动幽灵
    function moveGhost() {
        if (ghostState.isHiding) {
            // 如果幽灵正在隐藏，随机决定是否重新出现
            if (savedSettings.autoHide &&
                Date.now() - ghostState.lastHideTime > savedSettings.hideDuration * 1000) {
                toggleGhostVisibility();
            }
            requestAnimationFrame(moveGhost);
            return;
        }

        // 自动隐藏检查
        if (savedSettings.autoHide &&
            Date.now() - ghostState.lastShowTime > savedSettings.showDuration * 1000) {
            toggleGhostVisibility();
            requestAnimationFrame(moveGhost);
            return;
        }

        // 随机改变心情
        if (Math.random() < 0.001) {
            randomMoodChange();
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // 在边界反弹
        if (ghostState.posX < 40 || ghostState.posX > screenWidth - 40) {
            ghostState.velX *= -1;
            // 改变表情为惊讶
            setGhostEmotion('scared');
            setTimeout(() => setGhostEmotion(ghostState.mood === 'sleepy' ? 'sleepy' : 'normal'), 500);
        }
        if (ghostState.posY < 40 || ghostState.posY > screenHeight - 120) {
            ghostState.velY *= -1;
            setGhostEmotion('scared');
            setTimeout(() => setGhostEmotion(ghostState.mood === 'sleepy' ? 'sleepy' : 'normal'), 500);
        }

        // 随机改变方向
        if (Math.random() < 0.02) {
            ghostState.velX += (Math.random() - 0.5) * 0.8 * savedSettings.speed;
            ghostState.velY += (Math.random() - 0.5) * 0.8 * savedSettings.speed;

            // 限制速度
            const speed = Math.sqrt(ghostState.velX * ghostState.velX + ghostState.velY * ghostState.velY);
            const maxSpeed = 1.5 * savedSettings.speed * (ghostState.mood === 'excited' ? 1.5 : 1);
            if (speed > maxSpeed) {
                ghostState.velX *= maxSpeed / speed;
                ghostState.velY *= maxSpeed / speed;
            }

            // 偶尔说话
            if (Math.random() < 0.3 && savedSettings.showSpeech) {
                const randomPhrase = ghostPhrases[Math.floor(Math.random() * ghostPhrases.length)];
                showSpeechBubble(randomPhrase);
            }
        }

        // 更新位置
        ghostState.posX += ghostState.velX;
        ghostState.posY += ghostState.velY;

        // 应用位置
        ghost.style.left = `${ghostState.posX}px`;
        ghost.style.top = `${ghostState.posY}px`;

        // 基于移动方向轻微旋转
        ghostState.rotation = Math.atan2(ghostState.velY, ghostState.velX) * 5;
        ghost.style.transform = `rotate(${ghostState.rotation}deg)`;

        requestAnimationFrame(moveGhost);
    }

    // 鼠标移动事件处理
    function handleMouseMove(e) {
        ghostState.lastMouseX = e.clientX;
        ghostState.lastMouseY = e.clientY;

        if (ghostState.isDragging) {
            ghostState.posX = e.clientX - ghostState.dragOffsetX;
            ghostState.posY = e.clientY - ghostState.dragOffsetY;
            return;
        }

        // 计算幽灵与鼠标的距离
        const dx = ghostState.posX - e.clientX;
        const dy = ghostState.posY - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 如果鼠标在幽灵附近，幽灵会逃开
        if (distance < ghostState.sensitivity && !ghostState.isFollowing) {
            const angle = Math.atan2(dy, dx);
            const force = (ghostState.sensitivity - distance) / ghostState.sensitivity * 1.5 * savedSettings.speed;

            ghostState.velX += Math.cos(angle) * force * 0.2;
            ghostState.velY += Math.sin(angle) * force * 0.2;

            // 限制速度
            const speed = Math.sqrt(ghostState.velX * ghostState.velX + ghostState.velY * ghostState.velY);
            const maxSpeed = 3 * savedSettings.speed;
            if (speed > maxSpeed) {
                ghostState.velX *= maxSpeed / speed;
                ghostState.velY *= maxSpeed / speed;
            }

            // 改变表情为害怕
            if (ghostState.mood !== 'sleepy') {
                setGhostEmotion('scared');
            }
        } else if (ghostState.emotion === 'scared' && ghostState.mood !== 'sleepy') {
            // 鼠标离开后恢复表情
            setGhostEmotion(ghostState.mood === 'sleepy' ? 'sleepy' : 'normal');
        }
    }

    // 创建粒子效果
    function createParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${color || (i % 3 === 0 ? savedSettings.eyeColor : i % 3 === 1 ? '#5e98f7' : savedSettings.ghostColor)};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 999998;
                box-shadow: 0 0 6px ${i % 3 === 0 ? 'rgba(100,227,255,0.8)' : 'rgba(94,152,247,0.8)'};
            `;

            document.body.appendChild(particle);

            // 粒子动画
            const velX = (Math.random() - 0.5) * 10;
            const velY = (Math.random() - 0.7) * 8;
            const startTime = Date.now();

            function animateParticle() {
                const elapsed = Date.now() - startTime;
                if (elapsed > 1000) {
                    particle.remove();
                    return;
                }

                const progress = elapsed / 1000;
                const ease = 1 - Math.pow(1 - progress, 2);

                particle.style.left = `${x + velX * elapsed / 20}px`;
                particle.style.top = `${y + velY * elapsed / 20 - 0.5 * 0.2 * elapsed * elapsed / 100}px`;
                particle.style.opacity = `${1 - progress}`;
                particle.style.transform = `scale(${1 - progress * 0.5})`;

                requestAnimationFrame(animateParticle);
            }

            animateParticle();
        }
    }

    // 创建心形效果
    function createHearts(x, y) {
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            heart.style.cssText = `
                position: fixed;
                font-size: ${20 + Math.random() * 10}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 999998;
                transform: translate(-50%, -50%);
                opacity: 0.8;
            `;

            document.body.appendChild(heart);

            // 心形动画
            const angle = Math.random() * Math.PI * 2;
            const velocity = 1 + Math.random() * 2;
            const startTime = Date.now();

            function animateHeart() {
                const elapsed = Date.now() - startTime;
                if (elapsed > 2000) {
                    heart.remove();
                    return;
                }

                const progress = elapsed / 2000;
                heart.style.left = `${x + Math.cos(angle) * velocity * elapsed / 2}px`;
                heart.style.top = `${y - velocity * elapsed / 2 - 0.5 * 0.1 * elapsed * elapsed / 100}px`;
                heart.style.opacity = `${0.8 * (1 - progress)}`;
                heart.style.transform = `translate(-50%, -50%) scale(${1 + progress})`;

                requestAnimationFrame(animateHeart);
            }

            animateHeart();
        }
    }

    // 幽灵点击事件
    ghost.addEventListener('click', function(e) {
        if (e.button === 2) return; // 忽略右键

        createParticles(e.clientX, e.clientY);
        setGhostEmotion('happy');
        setTimeout(() => setGhostEmotion(ghostState.mood === 'sleepy' ? 'sleepy' : 'normal'), 1000);

        // 说话泡泡
        if (savedSettings.showSpeech) {
            const randomPhrase = ghostPhrases[Math.floor(Math.random() * ghostPhrases.length)];
            showSpeechBubble(randomPhrase);
        }

        // 点击后幽灵会瞬间跳跃到新位置
        ghostState.posX = 50 + Math.random() * (window.innerWidth - 100);
        ghostState.posY = 50 + Math.random() * (window.innerHeight - 150);
    });

    // 幽灵右键点击事件
    ghost.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        createHearts(e.clientX, e.clientY);
        setGhostEmotion('happy');
        setTimeout(() => setGhostEmotion(ghostState.mood === 'sleepy' ? 'sleepy' : 'normal'), 1000);

        if (savedSettings.showSpeech) {
            showSpeechBubble("谢谢你喜欢我！❤️");
        }
    });

    // 幽灵鼠标悬停事件
    ghost.addEventListener('mouseenter', function() {
        if (ghostState.mood !== 'sleepy') {
            setGhostEmotion('happy');
        }

        // 显示引导消息
        if (Math.random() < 0.3 && savedSettings.showSpeech) {
            showSpeechBubble("点我可以传送！");
        }
    });

    ghost.addEventListener('mouseleave', function() {
        setGhostEmotion(ghostState.mood === 'sleepy' ? 'sleepy' : 'normal');
    });

    // 拖拽幽灵
    ghost.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return; // 只处理左键

        ghostState.isDragging = true;
        ghostState.dragOffsetX = e.clientX - ghostState.posX;
        ghostState.dragOffsetY = e.clientY - ghostState.posY;
        ghostState.velX = 0;
        ghostState.velY = 0;

        // 改变表情为惊讶
        setGhostEmotion('scared');

        // 添加拖拽样式
        ghost.style.cursor = 'grabbing';
        ghost.style.transition = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (ghostState.isDragging) {
            ghostState.posX = e.clientX - ghostState.dragOffsetX;
            ghostState.posY = e.clientY - ghostState.dragOffsetY;
            ghost.style.left = `${ghostState.posX}px`;
            ghost.style.top = `${ghostState.posY}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        if (ghostState.isDragging) {
            ghostState.isDragging = false;

            // 恢复样式
            ghost.style.cursor = 'pointer';
            ghost.style.transition = 'transform 0.3s ease, opacity 0.5s';

            // 恢复表情
            setTimeout(() => {
                setGhostEmotion(ghostState.mood === 'sleepy' ? 'sleepy' : 'normal');
            }, 500);

            // 显示消息
            if (savedSettings.showSpeech) {
                showSpeechBubble("哇！你移动了我！");
            }
        }
    });

    // 键盘控制
    document.addEventListener('keydown', function(e) {
        // 按空格键让幽灵隐藏/出现
        if (e.key === ' ') {
            toggleGhostVisibility();
        }
        // 按F键切换跟随模式
        else if (e.key === 'f' || e.key === 'F') {
            ghostState.isFollowing = !ghostState.isFollowing;
            if (savedSettings.showSpeech) {
                showSpeechBubble(ghostState.isFollowing ? "我来跟着你啦！" : "我想自由活动~");
            }
        }
        // 按H键切换帽子
        else if (e.key === 'h' || e.key === 'H') {
            const showHat = !ghostState.accessories.hat;
            toggleAccessory('hat', showHat);
            if (savedSettings.showSpeech) {
                showSpeechBubble(showHat ? "看看我的新帽子！" : "帽子不见了...");
            }
        }
        // 按A键切换配件
        else if (e.key === 'a' || e.key === 'A') {
            const showAccessory = !ghostState.accessories.accessory;
            toggleAccessory('accessory', showAccessory);
            if (savedSettings.showSpeech) {
                showSpeechBubble(showAccessory ? "我是不是很时尚？" : "配件不见了...");
            }
        }
        // 按1键设置心情为活泼
        else if (e.key === '1') {
            setGhostMood('playful');
        }
        // 按2键设置心情为困倦
        else if (e.key === '2') {
            setGhostMood('sleepy');
        }
        // 按3键设置心情为兴奋
        else if (e.key === '3') {
            setGhostMood('excited');
        }
        // 按D键打开对话面板
        else if (e.key === 'd' || e.key === 'D') {
            if (!savedSettings.enableDeepSeek) {
                if (savedSettings.showSpeech) {
                    showSpeechBubble("DeepSeek功能未启用，请在设置中开启");
                }
                return;
            }

            const chatPanel = document.getElementById('ghost-chat-panel') || createChatPanel();
            chatPanel.style.display = 'flex';
            document.getElementById('chat-input').focus();
        }
    });

    // 鼠标移动监听
    document.addEventListener('mousemove', handleMouseMove);

    // 设置面板事件处理
    const settingsPanel = createSettingsPanel();

    document.getElementById('save-settings').addEventListener('click', function() {
        const newSettings = {
            ghostColor: document.getElementById('ghost-color').value,
            eyeColor: document.getElementById('eye-color').value,
            size: parseFloat(document.getElementById('ghost-size').value),
            speed: parseFloat(document.getElementById('ghost-speed').value),
            sensitivity: parseInt(document.getElementById('ghost-sensitivity').value),
            autoHide: document.getElementById('ghost-auto-hide').checked,
            hideDuration: parseInt(document.getElementById('ghost-hide-duration').value),
            showDuration: parseInt(document.getElementById('ghost-show-duration').value),
            showSpeech: document.getElementById('ghost-show-speech').checked,
            enableDeepSeek: document.getElementById('enable-deepseek').checked,
            deepSeekAPIKey: document.getElementById('deepseek-api-key').value,
            deepSeekModel: document.getElementById('deepseek-model').value
        };

        GM_setValue('ghostSettings', newSettings);

        // 应用新设置
        Object.assign(savedSettings, newSettings);

        // 更新幽灵外观
        ghost.querySelector('.ghost-body').style.background = savedSettings.ghostColor;
        ghost.querySelector('.ghost-bottom div').style.background = savedSettings.ghostColor;
        ghost.querySelector('.eye').style.background = savedSettings.eyeColor;
        ghost.querySelector('.ghost-mouth').style.background = savedSettings.eyeColor;

        ghostState.sensitivity = savedSettings.sensitivity;
        ghostState.velX = 0.8 * savedSettings.speed;
        ghostState.velY = 0.8 * savedSettings.speed;

        // 调整大小
        ghost.style.width = `${80 * savedSettings.size}px`;
        ghost.style.height = `${100 * savedSettings.size}px`;

        // 隐藏面板
        settingsPanel.style.display = 'none';

        if (savedSettings.showSpeech) {
            showSpeechBubble("设置已保存！");
        }
    });

    document.getElementById('reset-settings').addEventListener('click', function() {
        const defaultSettings = {
            ghostColor: '#f0f0ff',
            eyeColor: '#64e3ff',
            size: 1,
            speed: 1,
            sensitivity: 120,
            autoHide: false,
            hideDuration: 30,
            showDuration: 60,
            showSpeech: true,
            enableDeepSeek: true,
            deepSeekAPIKey: '',
            deepSeekModel: 'deepseek-chat'
        };

        document.getElementById('ghost-color').value = defaultSettings.ghostColor;
        document.getElementById('eye-color').value = defaultSettings.eyeColor;
        document.getElementById('ghost-size').value = defaultSettings.size;
        document.getElementById('ghost-speed').value = defaultSettings.speed;
        document.getElementById('ghost-sensitivity').value = defaultSettings.sensitivity;
        document.getElementById('ghost-auto-hide').checked = defaultSettings.autoHide;
        document.getElementById('ghost-hide-duration').value = defaultSettings.hideDuration;
        document.getElementById('ghost-show-duration').value = defaultSettings.showDuration;
        document.getElementById('ghost-show-speech').checked = defaultSettings.showSpeech;
        document.getElementById('enable-deepseek').checked = defaultSettings.enableDeepSeek;
        document.getElementById('deepseek-api-key').value = defaultSettings.deepSeekAPIKey;
        document.getElementById('deepseek-model').value = defaultSettings.deepSeekModel;

        // 更新显示的标签
        document.querySelector('label[for="ghost-size"]').textContent = `大小: ${defaultSettings.size}x`;
        document.querySelector('label[for="ghost-speed"]').textContent = `速度: ${defaultSettings.speed}x`;
        document.querySelector('label[for="ghost-sensitivity"]').textContent = `敏感度: ${defaultSettings.sensitivity}px`;
        document.querySelector('label[for="ghost-hide-duration"]').textContent = `隐藏时长: ${defaultSettings.hideDuration}秒`;
        document.querySelector('label[for="ghost-show-duration"]').textContent = `显示时长: ${defaultSettings.showDuration}秒`;
    });

    document.getElementById('close-settings').addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });

    // 实时更新滑块标签
    document.getElementById('ghost-size').addEventListener('input', function() {
        document.querySelector('label[for="ghost-size"]').textContent = `大小: ${this.value}x`;
    });

    document.getElementById('ghost-speed').addEventListener('input', function() {
        document.querySelector('label[for="ghost-speed"]').textContent = `速度: ${this.value}x`;
    });

    document.getElementById('ghost-sensitivity').addEventListener('input', function() {
        document.querySelector('label[for="ghost-sensitivity"]').textContent = `敏感度: ${this.value}px`;
    });

    document.getElementById('ghost-hide-duration').addEventListener('input', function() {
        document.querySelector('label[for="ghost-hide-duration"]').textContent = `隐藏时长: ${this.value}秒`;
    });

    document.getElementById('ghost-show-duration').addEventListener('input', function() {
        document.querySelector('label[for="ghost-show-duration"]').textContent = `显示时长: ${this.value}秒`;
    });

    // 聊天面板事件处理
    const chatPanel = createChatPanel();

    document.getElementById('close-chat').addEventListener('click', function() {
        chatPanel.style.display = 'none';
    });

    document.getElementById('send-message').addEventListener('click', function() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (message) {
            chatWithDeepSeek(message);
            input.value = '';
        }
    });

    document.getElementById('clear-chat').addEventListener('click', function() {
        document.getElementById('chat-messages').innerHTML = `
            <div style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
                幽灵正在等待你的消息...
            </div>
        `;
    });

    document.getElementById('chat-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('send-message').click();
        }
    });

    // 启动幽灵动画
    moveGhost();

    // 窗口尺寸变化时重新定位
    window.addEventListener('resize', function() {
        if (ghostState.posX > window.innerWidth - 40) {
            ghostState.posX = window.innerWidth - 40;
        }
        if (ghostState.posY > window.innerHeight - 120) {
            ghostState.posY = window.innerHeight - 120;
        }
    });

    // 初始欢迎消息
    setTimeout(() => {
        if (savedSettings.showSpeech) {
            showSpeechBubble("我是一只调皮的小幽灵 👻 (按Ctrl+Shift+G打开设置)");
        }
    }, 2000);
})();