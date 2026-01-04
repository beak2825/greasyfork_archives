// ==UserScript==
// @name         AI场景感知助手
// @namespace    http://tampermonkey.net/
// @version      2.8 
// @description  一个可通过AI判断页面内容类型、可拖动、能对选中和悬停文字做出即时响应，并具备智能学习提醒（全屏警句）功能的AI看板娘。超时会受到递增惩罚！
// @author       REI 
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543691/AI%E5%9C%BA%E6%99%AF%E6%84%9F%E7%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543691/AI%E5%9C%BA%E6%99%AF%E6%84%9F%E7%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 (默认值) ---
    let config = {
        apiEndpoint: 'http://127.0.0.1:52112/v1/chat/completions',
        model: 'DeepSeek-V3-Fast',
        bubbleDuration: 6000,
        triggerCooldown: 2000,
        apiKey: '',
        isEnabled: true,
        // --- 学习提醒配置 ---
        learningReminderEnabled: true,
        forcedNonLearningSites: ['weibo.com', 'douyin.com'],
        maxStayDuration: 2, // 单次摸鱼时间（分钟）
        maxHourlyDuration: 10, // 每小时摸鱼总时长（分钟）
    };

    // --- 全局状态 ---
    let state = {
        isThinking: false,
        isBubbleVisible: false,
        lastTriggerTime: 0,
        isDragging: false,
        didMove: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        lastHoveredElement: null,
        isTimerRunning: false,
        isLearningSite: false,
        // 【核心修复】新增计时器ID，用于管理和取消异步任务
        typingTimer: null,
        hideBubbleTimer: null,
    };

    // --- UI元素 ---
    const ui = {
        container: null,
        character: null,
        characterStatus: null,
        bubbleWrapper: null,
        bubble: null,
        bubbleContent: null,
        fullScreenOverlay: null,
    };

    /**
     * 加载存储的配置
     */
    function loadConfig() {
        config.apiEndpoint = GM_getValue('ai_assistant_endpoint', config.apiEndpoint);
        config.model = GM_getValue('ai_assistant_model', config.model);
        config.apiKey = GM_getValue('ai_assistant_apikey', config.apiKey);
        config.isEnabled = GM_getValue('ai_assistant_enabled', config.isEnabled);
        config.learningReminderEnabled = GM_getValue('learning_reminder_enabled', config.learningReminderEnabled);
        try {
            config.forcedNonLearningSites = JSON.parse(GM_getValue('learning_forced_sites', JSON.stringify(config.forcedNonLearningSites)));
        } catch (e) {
            config.forcedNonLearningSites = [];
        }
        config.maxStayDuration = GM_getValue('learning_max_stay_duration', config.maxStayDuration);
        config.maxHourlyDuration = GM_getValue('learning_max_hourly_duration', config.maxHourlyDuration);
    }

    /**
     * 注册油猴菜单命令
     */
    function registerMenuCommands() {
        GM_registerMenuCommand('设置 API Key', () => {
            const newKey = prompt('请输入新的 API Key:', config.apiKey);
            if (newKey !== null) {
                config.apiKey = newKey;
                GM_setValue('ai_assistant_apikey', newKey);
                if(ui.container) showMessage('API Key 已更新！', true);
            }
        });

        GM_registerMenuCommand('设置 API Endpoint', () => {
            const newEndpoint = prompt('请输入新的 API Endpoint:', config.apiEndpoint);
            if (newEndpoint !== null) {
                config.apiEndpoint = newEndpoint;
                GM_setValue('ai_assistant_endpoint', newEndpoint);
                if(ui.container) showMessage('API Endpoint 已更新！', true);
            }
        });

        GM_registerMenuCommand('设置模型名称', () => {
            const newModel = prompt('请输入新的模型名称:', config.model);
            if (newModel !== null) {
                config.model = newModel;
                GM_setValue('ai_assistant_model', newModel);
                if(ui.container) showMessage('模型已更新！', true);
            }
        });

        const toggleText = `看板娘: ${config.isEnabled ? '✅ 已启用' : '❌ 已禁用'} (点击切换)`;
        GM_registerMenuCommand(toggleText, () => {
            GM_setValue('ai_assistant_enabled', !config.isEnabled);
            location.reload();
        });


        GM_registerMenuCommand('--- 学习提醒设置 ---', () => {});

        const reminderToggleText = `学习提醒: ${config.learningReminderEnabled ? '✅ 已启用' : '❌ 已禁用'} (点击切换)`;
        GM_registerMenuCommand(reminderToggleText, () => {
            GM_setValue('learning_reminder_enabled', !config.learningReminderEnabled);
            location.reload();
        });

        GM_registerMenuCommand('设置强制摸鱼网站 (跳过AI)', () => {
            const sites = prompt('以下网站将始终被视为摸鱼网站(用英文逗号,隔开):', config.forcedNonLearningSites.join(','));
            if (sites !== null) {
                const siteArray = sites.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
                GM_setValue('learning_forced_sites', JSON.stringify(siteArray));
                config.forcedNonLearningSites = siteArray;
                if(ui.container) showMessage('强制摸鱼网站列表已更新！', true);
            }
        });

        GM_registerMenuCommand('设置单次摸鱼时长(分钟)', () => {
            const duration = parseInt(prompt('请输入在单个网站上允许停留的最长时间(分钟):', config.maxStayDuration), 10);
            if (!isNaN(duration) && duration > 0) {
                GM_setValue('learning_max_stay_duration', duration);
                config.maxStayDuration = duration;
                if(ui.container) showMessage('单次摸鱼时长已更新！', true);
            }
        });

        GM_registerMenuCommand('设置每小时摸鱼总时长(分钟)', () => {
            const duration = parseInt(prompt('请输入每小时允许的总摸鱼时间(分钟):', config.maxHourlyDuration), 10);
            if (!isNaN(duration) && duration > 0) {
                GM_setValue('learning_max_hourly_duration', duration);
                config.maxHourlyDuration = duration;
                if(ui.container) showMessage('每小时摸鱼总时长已更新！', true);
            }
        });

        GM_registerMenuCommand('清除AI页面分类缓存', () => {
             GM_deleteValue('ai_page_classification_cache');
             if(ui.container) showMessage('AI页面分类缓存已清除！', true);
             location.reload();
        });
    }

    /**
     * 初始化函数
     */
    function init() {
        loadConfig();
        registerMenuCommands();

        if (!config.isEnabled) {
            console.log('AI看板娘已禁用。');
            return;
        }

        createUI();
        applyStyles();
        loadPosition();
        bindEvents();
        initLearningReminder();
        console.log('AI看板娘已启动 ✨');
    }

    /**
     * 创建DOM元素
     */
    function createUI() {
        ui.container = document.createElement('div');
        ui.container.id = 'ai-kanban-container';
        document.body.appendChild(ui.container);

        ui.container.innerHTML = `
            <div id="ai-bubble-wrapper">
                <div id="ai-bubble">
                    <div class="bubble-content"></div>
                </div>
            </div>
            <div id="ai-character">
                <div id="ai-character-status"></div>
            </div>
        `;

        ui.character = document.getElementById('ai-character');
        ui.characterStatus = document.getElementById('ai-character-status');
        ui.bubbleWrapper = document.getElementById('ai-bubble-wrapper');
        ui.bubble = document.getElementById('ai-bubble');
        ui.bubbleContent = ui.bubble.querySelector('.bubble-content');
    }

    /**
     * 应用CSS样式
     */
    function applyStyles() {
        const styles = `
            #ai-kanban-container {
                position: fixed;
                z-index: 99999;
            }
            #ai-character {
                width: 70px;
                height: 70px;
                background: linear-gradient(145deg, #89f7fe 0%, #66a6ff 100%);
                border-radius: 50%;
                cursor: grab;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
                box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
                border: 3px solid rgba(255, 255, 255, 0.5);
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            }
            #ai-character-status {
                color: white;
                font-size: 13px;
                font-weight: bold;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                line-height: 1.2;
                text-align: center;
                padding: 2px;
                user-select: none;
            }
            #ai-character:active {
                cursor: grabbing;
                transform: scale(1.1);
            }
            #ai-character.thinking {
                animation: thinking-sway 1.2s ease-in-out infinite;
            }
            @keyframes thinking-sway {
                0%, 100% { transform: translateX(0) rotate(0); }
                25% { transform: translateX(-3px) rotate(-2deg); }
                75% { transform: translateX(3px) rotate(2deg); }
            }
            #ai-bubble-wrapper {
                position: absolute;
                width: 300px;
                opacity: 0;
                transform: translateY(20px) scale(0.9);
                pointer-events: none;
                transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            #ai-bubble-wrapper.on-right { bottom: 50%; left: 100%; transform: translate(15px, 50%); }
            #ai-bubble-wrapper.on-left { bottom: 50%; right: 100%; transform: translate(-15px, 50%); }
            #ai-bubble-wrapper.visible {
                opacity: 1;
                transform: translate(var(--tx, 15px), 50%) scale(1);
                animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
            }
            #ai-bubble-wrapper.on-left.visible { --tx: -15px; }
            #ai-bubble-wrapper.on-right.visible { --tx: 15px; }
            @keyframes pop-in {
                0% { transform: scale(0.8); opacity: 0; }
                70% { transform: scale(1.05); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            #ai-bubble {
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 15px 20px;
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                position: relative;
            }
            #ai-bubble::after {
                content: ''; position: absolute; top: 50%; width: 0; height: 0;
                border-top: 10px solid transparent; border-bottom: 10px solid transparent;
            }
            .on-right #ai-bubble::after { right: 100%; transform: translateY(-50%); border-right: 10px solid rgba(255, 255, 255, 0.85); }
            .on-left #ai-bubble::after { left: 100%; transform: translateY(-50%); border-left: 10px solid rgba(255, 255, 255, 0.85); }
            .bubble-content { font-size: 15px; line-height: 1.5; color: #333; word-wrap: break-word; }
            .typing-cursor { display: inline-block; width: 2px; height: 1em; background-color: #007bff; animation: blink 0.7s infinite; vertical-align: middle; }
            @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }

            /* 全屏提醒样式 */
            #ai-fullscreen-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                z-index: 999999; display: flex; justify-content: center; align-items: center;
                opacity: 0; animation: fadeIn 0.5s forwards;
            }
            @keyframes fadeIn { to { opacity: 1; } }
            .overlay-content {
                max-width: 600px; text-align: center; color: white;
                padding: 40px; background: rgba(255, 255, 255, 0.1);
                border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.2);
                transform: scale(0.9); animation: pop-in-overlay 0.5s 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes pop-in-overlay { to { transform: scale(1); } }
            .overlay-reason { font-size: 18px; margin-bottom: 20px; color: #ffc107; }
            .overlay-quote { font-family: 'KaiTi', 'STKaiti', serif; font-size: 28px; line-height: 1.6; margin-bottom: 30px; min-height: 70px; }
            .overlay-close-button {
                background: #ffc107; color: #333; border: none; padding: 10px 25px;
                border-radius: 50px; cursor: pointer; font-size: 16px;
                transition: background-color 0.3s, transform 0.2s, opacity 0.3s;
            }
            .overlay-close-button:hover:not(:disabled) { background-color: #ffca2c; transform: scale(1.05); }
            .overlay-close-button:disabled {
                background-color: #6c757d;
                cursor: not-allowed;
                opacity: 0.7;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * 绑定事件
     */
    function bindEvents() {
        ui.character.addEventListener('mousedown', (e) => {
            e.preventDefault();
            state.isDragging = true;
            state.didMove = false;
            state.dragOffsetX = e.clientX - ui.container.offsetLeft;
            state.dragOffsetY = e.clientY - ui.container.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!state.isDragging) return;
            state.didMove = true;
            let newX = e.clientX - state.dragOffsetX;
            let newY = e.clientY - state.dragOffsetY;
            const containerRect = ui.container.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - containerRect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - containerRect.height));
            ui.container.style.left = `${newX}px`;
            ui.container.style.top = `${newY}px`;
        }

        function onMouseUp() {
            if (!state.isDragging) return;
            state.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            savePosition(ui.container.offsetLeft, ui.container.offsetTop);
            if (!state.didMove) {
                triggerAnalysis('manual_click');
            }
        }

        document.addEventListener('click', (e) => {
            if (ui.container.contains(e.target)) return;
            if (Math.random() < 0.2) triggerAnalysis('random_click');
        });

        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (Math.random() < 0.15) triggerAnalysis('scroll');
            }, 500);
        });

        document.addEventListener('mouseover', (e) => {
            state.lastHoveredElement = e.target;
        });

        let mouseMoveTimeout;
        document.addEventListener('mousemove', () => {
            if (state.isDragging) return;
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                if (Math.random() < 0.25) {
                    triggerAnalysis('mouse_stop');
                }
            }, 2000);
        });

        document.addEventListener('mouseup', (e) => {
            if (ui.container.contains(e.target) || state.isDragging) return;
            setTimeout(() => {
                const selectedText = window.getSelection().toString().trim();
                if (selectedText.length > 0) {
                    triggerAnalysis('selection');
                }
            }, 600);
        });
    }

    function savePosition(x, y) { GM_setValue('ai_assistant_pos', JSON.stringify({ x, y })); }

    function loadPosition() {
        const pos = JSON.parse(GM_getValue('ai_assistant_pos', 'null'));
        if (pos) {
            ui.container.style.left = `${pos.x}px`;
            ui.container.style.top = `${pos.y}px`;
        } else {
            ui.container.style.right = '30px';
            ui.container.style.bottom = '30px';
            ui.container.style.left = 'auto';
            ui.container.style.top = 'auto';
        }
    }

    function updateCharacterStatus(text) {
        if (ui.characterStatus) {
            ui.characterStatus.innerHTML = text;
        }
    }

    function adjustBubblePosition() {
        const characterRect = ui.container.getBoundingClientRect();
        const screenCenter = window.innerWidth / 2;
        ui.bubbleWrapper.classList.remove('on-left', 'on-right');
        if (characterRect.left < screenCenter) {
            ui.bubbleWrapper.classList.add('on-right');
        } else {
            ui.bubbleWrapper.classList.add('on-left');
        }
    }

    /**
     * 【核心修复】重构了 showMessage 函数，以正确处理中断和连续调用
     * @param {string} message - 要显示的消息
     * @param {boolean} isForce - 是否为强制消息 (例如，系统通知)
     */
    function showMessage(message, isForce = false) {
        // 1. 清理旧状态：在显示新消息之前，立即停止任何正在进行的打字动画和计划中的隐藏任务。
        clearTimeout(state.typingTimer);
        clearTimeout(state.hideBubbleTimer);

        // 2. 准备新消息
        ui.bubbleContent.innerHTML = ''; // 清空内容
        adjustBubblePosition();
        ui.bubbleWrapper.classList.add('visible');
        state.isBubbleVisible = true;

        // 3. 开始新的打字动画
        typeWriter(message, ui.bubbleContent, () => {
            // 打字结束后，计划一个新的隐藏任务，并将计时器ID保存起来
            const duration = isForce ? config.bubbleDuration * 1.5 : config.bubbleDuration;
            state.hideBubbleTimer = setTimeout(hideBubble, duration);
        });
    }

    /**
     * 【核心修复】修改了 hideBubble 函数，使其在隐藏时也清理计时器
     */
    function hideBubble() {
        if (!state.isBubbleVisible) return;
        ui.bubbleWrapper.classList.remove('visible');
        state.isBubbleVisible = false;

        // 清理工作，确保没有残留的计时器
        clearTimeout(state.typingTimer);
        clearTimeout(state.hideBubbleTimer);
    }

    /**
     * 【核心修复】修改了 typeWriter 函数，使其将计时器ID存入全局状态
     * @param {string} text - 要打字的文本
     * @param {HTMLElement} element - 目标元素
     * @param {function} callback - 完成后的回调函数
     */
    function typeWriter(text, element, callback) {
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);

        function type() {
            if (i < text.length) {
                element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
                // 将计时器ID保存到state中，以便可以从外部取消它
                state.typingTimer = setTimeout(type, Math.random() * 80 + 50);
            } else {
                cursor.remove();
                state.typingTimer = null; // 清空计时器ID
                if (callback) callback();
            }
        }
        type();
    }

    async function triggerAnalysis(triggerType) {
        if (state.isLearningSite) {
            return;
        }

        const now = Date.now();
        const isSelectionTrigger = triggerType === 'selection';

        if (state.isThinking || state.isDragging) return;
        if (!isSelectionTrigger && (now - state.lastTriggerTime < config.triggerCooldown)) return;

        if (!config.apiKey) {
            showMessage("请先在油猴菜单中设置API Key", true);
            return;
        }
        state.isThinking = true;
        state.lastTriggerTime = now;
        ui.character.classList.add('thinking');
        updateCharacterStatus('思考中🤔');

        try {
            const pageContext = extractPageContext();
            const prompt = createWittyPrompt(pageContext, triggerType);
            const wittyRemark = await callAIAPI(prompt);
            if (wittyRemark) showMessage(wittyRemark);
        } catch (error) {
            console.error('AI看板娘出错了:', error);
            showMessage("呀，智慧消失了...");
        } finally {
            state.isThinking = false;
            ui.character.classList.remove('thinking');
            if (!config.learningReminderEnabled) {
                updateCharacterStatus('😊');
            } else {
                if (state.isLearningSite) {
                    updateCharacterStatus('学习中📚');
                } else {
                    updateCharacterStatus('摸鱼中');
                }
            }
        }
    }

    function extractPageContext() {
        let hoveredText = '';
        if (state.lastHoveredElement && state.lastHoveredElement.innerText) {
            const validTags = ['P', 'H1', 'H2', 'H3', 'H4', 'A', 'SPAN', 'DIV', 'LI', 'BUTTON', 'TD', 'BLOCKQUOTE', 'STRONG', 'EM'];
            if (validTags.includes(state.lastHoveredElement.tagName.toUpperCase())) {
                 hoveredText = state.lastHoveredElement.innerText.trim().substring(0, 300);
            }
        }
        return {
            title: document.title,
            url: window.location.href,
            selection: window.getSelection().toString().trim(),
            hoveredText: hoveredText,
            pageText: document.body.innerText.substring(0, 4000)
        };
    }

    function createWittyPrompt(context, trigger) {
        let actionDescription = "正在浏览页面";
        let contextDetails = `- 页面标题: "${context.title}"`;

        if (trigger === 'selection' && context.selection) {
            actionDescription = `刚刚选择了一段文字`;
            contextDetails += `\n- 选择的文本: "${context.selection.substring(0, 500)}"`;
        } else if (trigger === 'mouse_stop' && context.hoveredText) {
            actionDescription = `的鼠标停留在了这段内容上`;
            contextDetails += `\n- 悬停处的文本: "${context.hoveredText}"`;
        }

        if (trigger !== 'selection' && trigger !== 'mouse_stop' && context.pageText) {
            contextDetails += `\n\n# 供参考的页面内容概览:\n${context.pageText.substring(0, 1000)}`;
        }

        return `你是一个网站的AI看板娘，性格俏皮可爱，有点小毒舌。你的任务是观察用户的行为和当前页面内容，然后用一句简短、有趣的俏皮话来吐槽或评论，***尽量避免问句***，要正能量，。\n\n# 规则:\n- 必须只回复一句话。\n- 语言风格要活泼、自然，像朋友一样。\n- 长度严格控制在30个字以内。\n- 直接返回俏皮话，不要包含任何其他说明或符号**尽量避免问句***。\n\n# 当前情景:\n- 用户行为: 用户${actionDescription}\n${contextDetails}\n\n请根据以上情景，表达你的观点（能锐评的地方锐评一下）：`;
    }

    function callAIAPI(prompt, temperature = 0.8, max_tokens = 100) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: config.apiEndpoint,
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    model: config.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: temperature,
                    max_tokens: max_tokens,
                }),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const content = data.choices[0]?.message?.content?.trim();
                            if (content) resolve(content);
                            else reject(new Error('AI返回了无效的内容'));
                        } catch (e) {
                            reject(new Error('解析AI响应失败'));
                        }
                    } else {
                        reject(new Error(`API请求失败: ${response.status} - ${response.responseText}`));
                    }
                },
                onerror: (e) => reject(new Error('网络请求错误')),
                ontimeout: () => reject(new Error('请求超时')),
            });
        });
    }

    // --- 学习提醒功能 (AI内容感知 + 全屏提醒版) ---
    const TRACKING_INTERVAL = 5 * 1000;

    function createClassificationPrompt(context) {
        return `你是一个效率助手，任务是判断一个网页的主要用途。请优先根据【页面内容】来判断，【标题】和【网址】仅作辅助参考。
判断该网页是否主要用于“学习”或“工作”。

- **学习/工作网站**: 在线课程、学术搜索等。
- **摸鱼网站**: 视频娱乐、社交媒体、新闻八卦、在线购物、游戏、小说漫画等。
- **提示**: 只要不相关数学、英语、政治、电路的大概率都算摸鱼。
- **附加规则**: 一些技术类论坛、科技讨论、工具、代码编程等也强制算作摸鱼！！！。
- **常驻页面**：www.sophnet.com不是摸鱼网站！！！

**重要规则:**
1.  如果判断为**学习/工作**网站，**只回答 "NO"**。
2.  如果判断为**摸鱼**网站，**只回答 "YES"**。
3.  不要有任何其他解释或文字。


**示例:**
- 网址是 bilibili.com, 标题是“Python入门教程”，内容是关于“变量、循环、函数”，你应该回答 "NO"。
- 网址是 bilibili.com, 标题是“年度搞笑视频集锦”，内容是“哈哈哈哈”，你应该回答 "YES"。

---
# 待判断的页面信息:
- **网址**: ${context.url}
- **标题**: ${context.title}
- **页面主要内容节选**: "${(context.pageText || '无内容').substring(0, 2000)}"

---
你的回答 (YES/NO):`;
    }

    async function getAIClassification() {
        if (state.isThinking) return null;

        state.isThinking = true;
        ui.character.classList.add('thinking');
        updateCharacterStatus('分析中...');
        showMessage("正在分析页面类型...", true);

        try {
            const context = extractPageContext();
            const prompt = createClassificationPrompt(context);
            const response = await callAIAPI(prompt, 0.1, 5);
            // hideBubble() 会在 showMessage 中自动处理，这里可以省略
            if (response && response.toUpperCase().includes('YES')) {
                return true;
            }
            if (response && response.toUpperCase().includes('NO')) {
                return false;
            }
            return null;
        } catch (error) {
            console.error("AI页面分类失败:", error);
            showMessage("AI分析失败，暂时不计时啦。", true);
            return null;
        } finally {
            state.isThinking = false;
            ui.character.classList.remove('thinking');
        }
    }

    function startTrackingTimer() {
        if (state.isTimerRunning) return;
        state.isTimerRunning = true;
        console.log('AI看板娘: 已启动摸鱼计时器。');
        checkAndUpdateTime();
        setInterval(checkAndUpdateTime, TRACKING_INTERVAL);
    }

    async function initLearningReminder() {
        if (!config.learningReminderEnabled) {
            updateCharacterStatus('😊');
            return;
        }
        if (!config.apiKey) {
            console.warn("学习提醒功能需要API Key才能进行AI页面分类。");
            updateCharacterStatus('发呆中');
            return;
        }

        const currentHost = window.location.hostname;
        let isNonLearning;

        if (config.forcedNonLearningSites.some(site => currentHost.includes(site))) {
            console.log(`AI看板娘: ${currentHost} 在强制摸鱼列表中。`);
            isNonLearning = true;
        } else {
            let classificationCache = JSON.parse(GM_getValue('ai_page_classification_cache', '{}'));
            const cacheKey = window.location.href;
            if (classificationCache.hasOwnProperty(cacheKey)) {
                 isNonLearning = classificationCache[cacheKey];
                 console.log(`AI看板娘: 根据缓存, 此页面是 ${isNonLearning ? '摸鱼' : '学习'} 网站。`);
            } else {
                isNonLearning = await getAIClassification();
                if (isNonLearning !== null) {
                    classificationCache[cacheKey] = isNonLearning;
                    const keys = Object.keys(classificationCache);
                    if (keys.length > 50) {
                        delete classificationCache[keys[0]];
                    }
                    GM_setValue('ai_page_classification_cache', JSON.stringify(classificationCache));
                }
            }
        }

        if (isNonLearning === true) {
            state.isLearningSite = false;
            updateCharacterStatus('摸鱼中');
            showMessage(`我认为你在摸鱼，计时开始！`, true);
            startTrackingTimer();
        } else if (isNonLearning === false) {
            state.isLearningSite = true;
            updateCharacterStatus('学习中📚');
            showMessage(`加油！`, true);
            GM_deleteValue('learning_current_site_stay');
        } else {
            // isNonLearning is null (AI failed)
            state.isLearningSite = false;
            updateCharacterStatus('发呆中');
            // 此处的 showMessage 已经在 getAIClassification 的 catch 块中处理了
        }
    }

    function checkAndUpdateTime() {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;

        let hourlyLog = JSON.parse(GM_getValue('learning_hourly_log', '[]'));
        hourlyLog = hourlyLog.filter(timestamp => timestamp > oneHourAgo);

        const lastLogTime = hourlyLog.length > 0 ? hourlyLog[hourlyLog.length - 1] : 0;
        if (now - lastLogTime < (TRACKING_INTERVAL - 1000)) {
            const totalMinutesWithoutUpdate = (hourlyLog.length * TRACKING_INTERVAL) / (1000 * 60);
            const timerText = `${Math.floor(totalMinutesWithoutUpdate)} / ${config.maxHourlyDuration}m`;
            updateCharacterStatus(timerText);
            return;
        }

        hourlyLog.push(now);
        GM_setValue('learning_hourly_log', JSON.stringify(hourlyLog));
        const totalMinutes = (hourlyLog.length * TRACKING_INTERVAL) / (1000 * 60);

        const timerText = `${Math.floor(totalMinutes)} / ${config.maxHourlyDuration}m`;
        updateCharacterStatus(timerText);

        if (totalMinutes > config.maxHourlyDuration) {
            const overtimeMinutes = totalMinutes - config.maxHourlyDuration;
            triggerLearningReminder('hourly', overtimeMinutes);
            return;
        }

        let siteStayInfo = JSON.parse(GM_getValue('learning_current_site_stay', '{}'));
        const currentHost = window.location.hostname;

        if (siteStayInfo.host !== currentHost) {
            siteStayInfo = { host: currentHost, startTime: now };
        }
        GM_setValue('learning_current_site_stay', JSON.stringify(siteStayInfo));
        const stayMinutes = (now - siteStayInfo.startTime) / (1000 * 60);

        if (stayMinutes > config.maxStayDuration) {
            const overtimeMinutes = stayMinutes - config.maxStayDuration;
            triggerLearningReminder('stay', overtimeMinutes);
        }
    }

    function createInspirationalQuotePrompt(reason) {
        const reasonText = reason === 'stay' ? '在同一个娱乐网站停留太久' : '一小时内娱乐总时间超标';
        return `你是一位智慧的导师，请针对以下场景，生成一句简短、有力、引人深思的名言警句，风格可以是哲学性的、现代的或略带幽默的，但核心是激励人专注和自律。
要求：
1. 直接返回名言本身，不要包含任何诸如 “好的，这是一句...” 之类的多余解释。
2. 语言为中文。
3. 长度在15到30字之间。
4. 用户在备战考研，请激励他

场景：用户因为【${reasonText}】而分心了。

名言警句：`;
    }

    async function showFullScreenReminder(reason, overtimeMinutes = 0) {
        if (ui.fullScreenOverlay) return;

        const buttonDelaySeconds = Math.min(60, 5 + Math.floor(overtimeMinutes));

        ui.fullScreenOverlay = document.createElement('div');
        ui.fullScreenOverlay.id = 'ai-fullscreen-overlay';

        const reasonText = reason === 'stay'
            ? `你在当前网站摸鱼已超过 ${config.maxStayDuration} 分钟`
            : `近一小时摸鱼已超过 ${config.maxHourlyDuration} 分钟`;

        ui.fullScreenOverlay.innerHTML = `
            <div class="overlay-content">
                <div class="overlay-reason">${reasonText} (已超时 ${Math.round(overtimeMinutes)} 分钟)</div>
                <div class="overlay-quote">正在生成警句...</div>
                <button class="overlay-close-button" disabled>不如不等 (${buttonDelaySeconds}s)</button>
            </div>
        `;

        document.body.appendChild(ui.fullScreenOverlay);

        const closeButton = ui.fullScreenOverlay.querySelector('.overlay-close-button');
        const quoteElement = ui.fullScreenOverlay.querySelector('.overlay-quote');

        let countdown = buttonDelaySeconds;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                closeButton.textContent = `不如不等 (${countdown}s)`;
            } else {
                clearInterval(countdownInterval);
                closeButton.disabled = false;
                closeButton.textContent = '不如不等';
            }
        }, 1000);

        const closeOverlay = () => {
            if (ui.fullScreenOverlay) {
                clearInterval(countdownInterval);
                ui.fullScreenOverlay.remove();
                ui.fullScreenOverlay = null;
                document.removeEventListener('keydown', onKeydown);
            }
        };

        const onKeydown = (e) => {
            if (e.key === 'Escape' && !closeButton.disabled) {
                closeOverlay();
            }
        };

        closeButton.addEventListener('click', closeOverlay);
        document.addEventListener('keydown', onKeydown);

        try {
            const prompt = createInspirationalQuotePrompt(reason);
            const quote = await callAIAPI(prompt, 0.9, 60);
            quoteElement.textContent = `“ ${quote} ”`;
        } catch (error)
        {
            console.error('生成警句失败:', error);
            quoteElement.textContent = "“ 别让短暂的愉悦，偷走你未来的成就。”";
        }
    }

    function triggerLearningReminder(reason, overtimeMinutes = 0) {
        const now = Date.now();
        const lastReminderTime = GM_getValue('learning_last_reminder_time', 0);
        const reminderCooldown = Math.max(30 * 1000, (300 - overtimeMinutes * 10) * 1000);

        if (now - lastReminderTime < reminderCooldown) return;

        GM_setValue('learning_last_reminder_time', now);
        showFullScreenReminder(reason, overtimeMinutes);
    }

    // --- 启动脚本 ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();