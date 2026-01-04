// ==UserScript==
// @name         多邻三合一助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动获取多邻国钻石、经验值和Boost
// @author       Crazy uncle
// @match        https://*.duolingo.com/*
// @match        https://*.duolingo.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @grant        GM_xmlhttpRequest
// @connect      autoduo.one
// @connect      duolingo.com
// @connect      duolingo.cn
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527415/%E5%A4%9A%E9%82%BB%E4%B8%89%E5%90%88%E4%B8%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527415/%E5%A4%9A%E9%82%BB%E4%B8%89%E5%90%88%E4%B8%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @typedef {Object} UserInfo
     * @property {string} cookie - 用户Cookie
     * @property {string} userId - 用户ID
     * @property {string} skillId - 技能树ID
     * @property {string} fromLanguage - 用户语言
     * @property {string} learningLanguage - 学习语言
     */

    /**
     * @type {boolean}
     * @description 控制请求循环的标志
     */
    let isRunning = false;

    /**
     * @type {number}
     * @description 累计获得的钻石数量
     */
    let totalDiamonds = 0;

    /**
     * @type {UserInfo}
     * @description 存储用户信息
     */
    let cachedUserInfo = null;

    /**
     * @type {Object}
     * @description 存储请求头信息
     */
    let HEADERS = null;

    /**
     * @type {HTMLButtonElement}
     * @description 开始按钮的引用
     */
    let startButton = null;

    /**
     * @type {Object}
     * @description 会话配置
     */
    const sessionPayloads = {
        10: {
            challengeTypes: [
                "assist", "characterIntro", "characterMatch", "characterPuzzle",
                "characterSelect", "characterTrace", "characterWrite",
                "completeReverseTranslation", "definition", "dialogue",
                "extendedMatch", "extendedListenMatch", "form", "freeResponse",
                "gapFill", "judge", "listen", "listenComplete", "listenMatch",
                "match", "name", "listenComprehension", "listenIsolation",
                "listenSpeak", "listenTap", "orderTapComplete", "partialListen",
                "partialReverseTranslate", "patternTapComplete", "radioBinary",
                "radioImageSelect", "radioListenMatch", "radioListenRecognize",
                "radioSelect", "readComprehension", "reverseAssist", "sameDifferent",
                "select", "selectPronunciation", "selectTranscription", "svgPuzzle",
                "syllableTap", "syllableListenTap", "speak", "tapCloze",
                "tapClozeTable", "tapComplete", "tapCompleteTable", "tapDescribe",
                "translate", "transliterate", "transliterationAssist", "typeCloze",
                "typeClozeTable", "typeComplete", "typeCompleteTable", "writeComprehension"
            ],
            isFinalLevel: false,
            isV2: true,
            juicy: true,
            smartTipsVersion: 2,
            type: "GLOBAL_PRACTICE"
        }
    };

    /**
     * @type {Object}
     * @description 会话更新配置
     */
    const updateSessionPayloads = {
        10: {
            heartsLeft: 0,
            startTime: new Date().getTime() / 1000,
            enableBonusPoints: true,
            endTime: new Date().getTime() / 1000 + 112,
            failed: false,
            maxInLessonStreak: 9,
            shouldLearnThings: true,
            hasBoost: true,
            happyHourBonusXp: 10
        }
    };

    /**
     * 初始化界面
     */
    function initInterface() {
        const containerHTML = `
            <div id="control-panel" class="control-panel hidden">
                <div class="panel-header">
                    <h3>多邻国助手 <span id="user-id" class="user-id"></span></h3>
                    <button id="toggle-btn">👈</button>
                </div>
                <div class="panel-content">
                    <div class="mode-select">
                        <button class="mode-btn active" data-mode="diamond">钻石</button>
                        <button class="mode-btn" data-mode="xp">经验</button>
                    </div>
                    <div class="target-input">
                        <input type="number" id="target-amount" placeholder="目标数量（可选）" min="0">
                    </div>
                    <button id="start-btn" class="key-btn">开始</button>
                    <button id="stop-btn" class="key-btn stop">停止</button>
                    <div id="status-text" class="status-text">已获得: 0</div>

                    <!-- Boost功能区域 -->
                    <div class="boost-section">
                        <select id="boostType" class="boost-select">
                            <option value="xp_boost_15">15分钟 Boost</option>
                            <option value="general_xp_boost">30分钟 Boost</option>
                            <option value="xp_boost_60">60分钟 Boost</option>
                        </select>
                        <button id="getBoost" class="boost-btn">获取Boost</button>
                        <div id="boostResult" class="boost-result" style="display:none;"></div>
                    </div>
                </div>
            </div>`;

        const style = document.createElement('style');
        style.innerHTML = `
            .author-info {
            margin-top: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
            }

            .author-info a {
                color: #58CC02;
                text-decoration: none;
                transition: color 0.3s;
            }

            .author-info a:hover {
                color: #28a745;
                text-decoration: underline;
            }

            .control-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                background: white;
                padding: 15px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 9999;
                width: 250px;
                transition: transform 0.3s ease;
            }

            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .panel-header h3 {
                margin: 0;
                color: #28a745;
                font-size: 1.2em;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .user-id {
                font-size: 0.8em;
                color: #666;
                font-weight: normal;
            }

            #toggle-btn {
                position: absolute;
                left: -30px;
                top: 50%;
                transform: translateY(-50%);
                width: 25px;
                height: 25px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }

            #toggle-btn:hover {
                background: #218838;
                transform: translateY(-50%) scale(1.1);
            }

            .mode-select {
                display: flex;
                gap: 8px;
                margin-bottom: 10px;
            }

            .mode-btn {
                flex: 1;
                padding: 8px;
                border: 2px solid #58CC02;
                background: white;
                color: #58CC02;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .mode-btn.active {
                background: #58CC02;
                color: white;
            }

            .status-text {
                margin-top: 10px;
                text-align: center;
                color: #666;
            }

            .hidden {
                transform: translateX(calc(100% + 10px));
            }

            .key-input {
                width: 100%;
                padding: 8px;
                border: 2px solid #58CC02;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s;
                margin-bottom: 10px;
            }

            .key-input:focus {
                border-color: #28a745;
                box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
            }

            .key-input::placeholder {
                color: #999;
            }

            .key-btn {
                width: 100%;
                padding: 8px 16px;
                background: #58CC02;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
                margin-bottom: 10px;
            }

            .key-btn:hover {
                background: #28a745;
            }

            .key-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .key-btn.stop {
                background: #dc3545;
                display: none;
            }

            .key-btn.stop:hover {
                background: #c82333;
            }

            .key-section {
                margin-bottom: 10px;
            }

            .validity-info {
                text-align: center;
                color: #28a745;
                margin-bottom: 10px;
                font-size: 14px;
            }

            .target-input {
                margin: 10px 0;
            }

            .target-input input {
                width: 100%;
                padding: 8px;
                border: 2px solid #58CC02;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
            }

            .target-input input:focus {
                border-color: #28a745;
                box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
            }

            /* Boost相关样式 */
            .boost-section {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }

            .boost-select {
                width: 100%;
                padding: 8px;
                margin-bottom: 10px;
                border: 2px solid #58CC02;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
            }

            .boost-btn {
                width: 100%;
                padding: 8px;
                background: #58CC02;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }

            .boost-btn:hover {
                background: #46a302;
            }

            .boost-result {
                margin-top: 10px;
                padding: 10px;
                border-radius: 8px;
                background: #f5f5f5;
                font-size: 12px;
                white-space: pre-wrap;
                font-family: monospace;
            }

            /* 隐藏应用下载提示和抽屉背景 */
            .rs95t._3fIZ6._19idO,
            ._3qIEH,
            ._2yaOw,
            [data-focus-lock-disabled],
            ._1ATOC._1Fnem,
            [data-test="drawer-backdrop"] {
                display: none !important;
            }

            /* 移除弹窗时的body样式 */
            body._1ZopE,
            body._2Ownk {
                overflow: auto !important;
                position: static !important;
            }
        `;

        document.head.appendChild(style);

        const container = document.createElement('div');
        container.innerHTML = containerHTML;
        document.body.appendChild(container);

        // 初始化界面引用
        startButton = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const toggleBtn = document.getElementById('toggle-btn');
        const controlPanel = document.getElementById('control-panel');
        const statusText = document.getElementById('status-text');

        // 添加事件监听
        toggleBtn.addEventListener('click', () => {
            controlPanel.classList.toggle('hidden');
            toggleBtn.textContent = controlPanel.classList.contains('hidden') ? '👈' : '👉';
            toggleBtn.style.transform = 'translateY(-50%)';
        });

        // 添加模式切换功能
        let currentMode = 'diamond';
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                statusText.textContent = `已获得: 0`;
                totalDiamonds = 0;
            });
        });

        // 修改开始按钮事件
        startButton.addEventListener('click', async () => {
            if (!cachedUserInfo) {
                alert('请先登录多邻国');
                return;
            }

            startButton.style.display = 'none';
            stopBtn.style.display = 'block';
            isRunning = true;

            if (currentMode === 'diamond') {
                startDiamondCollection(cachedUserInfo, statusText);
            } else {
                startXPCollection(cachedUserInfo, statusText);
            }
        });

        // 添加停止按钮事件
        stopBtn.addEventListener('click', () => {
            startButton.style.display = 'block';
            stopBtn.style.display = 'none';
            isRunning = false;
        });

        // 添加输入框值修正逻辑
        const targetInput = document.getElementById('target-amount');
        targetInput.addEventListener('change', () => {
            const value = parseInt(targetInput.value);
            if (value) {
                const multiplier = currentMode === 'diamond' ? 30 : 36;
                const correctedValue = Math.ceil(value / multiplier) * multiplier;
                targetInput.value = correctedValue;
            }
        });

        // 添加移除弹窗的观察器
        const observer = new MutationObserver((mutations) => {
            // 移除下载提示弹窗
            const downloadPrompt = document.querySelector('[data-focus-lock-disabled]');
            if (downloadPrompt) {
                downloadPrompt.remove();
                document.body.classList.remove('_1ZopE');
            }

            // 移除抽屉背景
            const drawerBackdrop = document.querySelector('[data-test="drawer-backdrop"]');
            if (drawerBackdrop) {
                drawerBackdrop.remove();
                document.body.classList.remove('_2Ownk');
            }
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 添加Boost功能
        document.getElementById('getBoost').addEventListener('click', async () => {
            const boostType = document.getElementById('boostType').value;
            const resultDiv = document.getElementById('boostResult');

            if (!cachedUserInfo) {
                resultDiv.textContent = '请先登录多邻国';
                resultDiv.style.display = 'block';
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://www.duolingo.cn/2017-06-30/users/${cachedUserInfo.userId}/shop-items`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getJwtToken()}`,
                    'User-Agent': navigator.userAgent,
                    'Origin': window.location.origin,
                    'Referer': window.location.origin + '/'
                },
                data: JSON.stringify({
                    itemName: boostType,
                    isFree: true
                }),
                onload: function(response) {
                    let resultMessage = 'Boost获取成功！\n\n';

                    try {
                        // 尝试解析并格式化响应内容
                        const jsonResponse = JSON.parse(response.responseText);
                        resultMessage += JSON.stringify(jsonResponse, null, 2);
                    } catch (e) {
                        // 如果不是JSON，直接显示响应文本
                        resultMessage += response.responseText;
                    }

                    resultDiv.textContent = resultMessage;
                    resultDiv.style.display = 'block';

                    // 5秒后隐藏结果
                    setTimeout(() => {
                        resultDiv.style.display = 'none';
                    }, 5000);
                },
                onerror: function(error) {
                    resultDiv.textContent = '请求错误，请重试';
                    resultDiv.style.display = 'block';

                    // 3秒后隐藏结果
                    setTimeout(() => {
                        resultDiv.style.display = 'none';
                    }, 3000);
                }
            });
        });
    }

    /**
     * 获取JWT令牌
     * @returns {string|null} JWT令牌
     */
    function getJwtToken() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith('jwt_token=')) {
                return trimmedCookie.substring('jwt_token='.length);
            }
        }
        return null;
    }

    /**
     * 解码JWT令牌
     * @param {string} token - JWT令牌
     * @returns {Object} 解码后的数据
     */
    function decodeJwtToken(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    /**
     * 获取用户信息
     * @returns {Promise<UserInfo>} 用户信息对象
     */
    async function getUserInfo() {
        try {
            // 获取JWT令牌
            const jwtToken = getJwtToken();
            if (!jwtToken) {
                throw new Error('未找到JWT令牌，请确保已登录');
            }

            // 解码JWT获取用户ID
            const decodedToken = decodeJwtToken(jwtToken);
            const userId = decodedToken.sub;

            // 设置请求头
            HEADERS = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken,
                "User-Agent": navigator.userAgent
            };

            // 获取用户详细信息
            const userInfoUrl = `https://www.duolingo.cn/2017-06-30/users/${userId}?fields=username,fromLanguage,learningLanguage`;
            const response = await fetch(userInfoUrl, {
                method: 'GET',
                headers: HEADERS
            });

            const userData = await response.json();

            return {
                cookie: document.cookie,
                userId: userId,
                skillId: userData.learningLanguage || 'BASIC_1',
                fromLanguage: userData.fromLanguage,
                learningLanguage: userData.learningLanguage
            };
        } catch (error) {
            console.error('获取用户信息失败:', error);
            alert('获取用户信息失败，请确保您已登录多邻国');
            throw error;
        }
    }

    /**
     * 发送单次钻石请求
     * @param {UserInfo} userInfo - 用户信息
     * @returns {Promise<boolean>} 请求是否成功
     */
    async function sendDiamondRequest(userInfo) {
        try {
            const response = await fetch(
                `https://www.duolingo.cn/2017-06-30/users/${userInfo.userId}/rewards/SKILL_COMPLETION_BALANCED-d043e8d5_dcca_3e51_879b_1f007f99523d-2-GEMS`,
                {
                    method: 'PATCH',
                    headers: HEADERS,
                    credentials: 'include',
                    body: JSON.stringify({
                        amount: 0,
                        type: 'mission',
                        consumed: true,
                        skillId: userInfo.skillId
                    })
                }
            );
            return response.ok;
        } catch (error) {
            console.error('请求失败:', error);
            return false;
        }
    }

    /**
     * 开始收集钻石
     * @param {UserInfo} userInfo - 用户信息
     * @param {HTMLElement} statusElement - 状态显示元素
     */
    async function startDiamondCollection(userInfo, statusElement) {
        const targetInput = document.getElementById('target-amount');
        const targetAmount = parseInt(targetInput.value);

        while (isRunning) {
            const success = await sendDiamondRequest(userInfo);
            if (success) {
                totalDiamonds += 30;
                statusElement.textContent = `已获得钻石: ${totalDiamonds}`;

                // 检查是否达到目标
                if (targetAmount && totalDiamonds >= targetAmount) {
                    isRunning = false;
                    startButton.style.display = 'block';
                    document.getElementById('stop-btn').style.display = 'none';
                    break;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * 创建练习会话
     * @param {number} xp - XP数量
     * @returns {Promise<Object>} 会话对象
     */
    async function createSession(xp) {
        const sessionPayload = {
            ...sessionPayloads[xp],
            fromLanguage: cachedUserInfo.fromLanguage,
            learningLanguage: cachedUserInfo.learningLanguage
        };

        console.log('Creating session with payload:', sessionPayload);

        const response = await fetch('https://www.duolingo.cn/2017-06-30/sessions', {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(sessionPayload)
        });

        if (!response.ok) {
            console.error('Session creation failed:', await response.text());
            throw new Error('Failed to create session');
        }

        return await response.json();
    }

    /**
     * 更新练习会话
     * @param {Object} session - 会话对象
     * @param {number} xp - XP数量
     * @returns {Promise<Object>} 更新后的会话对象
     */
    async function updateSession(session, xp) {
        const updateSessionPayload = {
            ...session,
            ...updateSessionPayloads[xp],
            startTime: new Date().getTime() / 1000,
            endTime: new Date().getTime() / 1000 + 112
        };
        const response = await fetch(`https://www.duolingo.cn/2017-06-30/sessions/${session.id}`, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify(updateSessionPayload)
        });
        return await response.json();
    }

    /**
     * 开始收集XP
     * @param {UserInfo} userInfo - 用户信息
     * @param {HTMLElement} statusElement - 状态显示元素
     */
    async function startXPCollection(userInfo, statusElement) {
        const targetInput = document.getElementById('target-amount');
        const targetAmount = parseInt(targetInput.value);
        let totalXP = 0;

        while (isRunning) {
            try {
                const session = await createSession(10);
                const updatedSession = await updateSession(session, 10);
                if (updatedSession && updatedSession.xpGain) {
                    totalXP += updatedSession.xpGain;
                    statusElement.textContent = `已获得经验: ${totalXP}`;

                    // 检查是否达到目标
                    if (targetAmount && totalXP >= targetAmount) {
                        isRunning = false;
                        startButton.style.display = 'block';
                        document.getElementById('stop-btn').style.display = 'none';
                        break;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('获取XP失败:', error);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    /**
     * 初始化用户信息
     */
    async function initializeUserInfo() {
        try {
            cachedUserInfo = await getUserInfo();

            // 更新用户ID显示
            const userIdElement = document.getElementById('user-id');
            if (userIdElement) {
                userIdElement.textContent = `(${cachedUserInfo.userId})`;
            }
        } catch (error) {
            console.error('初始化用户信息失败:', error);
        }
    }

    // 简化初始化逻辑
    window.addEventListener('load', async () => {
        initInterface();
        await initializeUserInfo();

        // 添加自动刷新用户信息
        setInterval(async () => {
            await initializeUserInfo();
        }, 5 * 60 * 1000);
    });

    // 路由变化监听
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initializeUserInfo();
        }
    }).observe(document, { subtree: true, childList: true });
})();