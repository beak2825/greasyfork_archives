// ==UserScript==
// @name         [银河奶牛]消息屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  支持条件过滤的聊天消息屏蔽
// @author       Truth_Light
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532433/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%B6%88%E6%81%AF%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/532433/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%B6%88%E6%81%AF%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG_KEY = 'MWI_ChatFilter_Config';

    const DEFAULT_CONFIG = {
        maxCharacterID: 150000,
        whitelist: [],
        channels: ['/chat_channel_types/chinese'],
        blockedGameModes: ['standard', 'ironcow'],
        blockEmptyStyle: true,
        blockStartsWith: [],
        blockContains: [],
        blockEndsWith: []
    };
    const CHANNEL_DICT = {
        "/chat_channel_types/chinese": "中文",
        "/chat_channel_types/general": "全局",
        "/chat_channel_types/recruit": "招募",
        "/chat_channel_types/trade":"交易",
        "/chat_channel_types/beginner":"新手",
        "/chat_channel_types/ironcow":"铁牛"
    };

    const CONFIG = loadConfig();

    function loadConfig() {
        const savedConfig = localStorage.getItem(CONFIG_KEY);
        const config = savedConfig ? JSON.parse(savedConfig) : { ...DEFAULT_CONFIG };

        // 确保所有字段都存在
        return {
            ...DEFAULT_CONFIG,
            ...config,
            blockStartsWith: config.blockStartsWith || [],
            blockContains: config.blockContains || [],
            blockEndsWith: config.blockEndsWith || []
        };
    }

    function saveConfigToLocalStorage() {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(CONFIG));
    }

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) return oriGet.call(this);
            if (!socket.url.includes("api.milkywayidle.com/ws")) return oriGet.call(this);

            const message = oriGet.call(this);
            const processedMessage = handleMessage(message);

            return processedMessage;
        };

        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
    }

    function handleMessage(message) {
        try {
            const obj = JSON.parse(message);
            if (obj.type === "init_character_data") {
                addSettingsButton();
            }
            if (obj.type !== "chat_message_received") return message;
            const msg = obj.message;
            if (!msg) return message;

            // 永久放行条件
            if (msg.isModMessage || msg.isSystemMessage) return message;

            // 白名单检查
            const isWhitelisted = CONFIG.whitelist.some(name =>
                                                        msg.sName.toLowerCase() === name.toLowerCase().trim()
                                                       );

            // 样式检查
            const isEmptyStyle =
                  !CONFIG.blockEmptyStyle ||
                  (CONFIG.blockEmptyStyle &&
                   !msg.hasOwnProperty('icon') &&
                   !msg.hasOwnProperty('color'));

            // 消息内容屏蔽检查
            const startsWithBlocked = CONFIG.blockStartsWith.some(prefix =>
                                                                  msg.m.startsWith(prefix)
                                                                 );
            const containsBlocked = CONFIG.blockContains.some(substring =>
                                                              msg.m.includes(substring)
                                                             );
            const endsWithBlocked = CONFIG.blockEndsWith.some(suffix =>
                                                              msg.m.endsWith(suffix)
                                                             );

            // 综合过滤条件
            const shouldBlock =
                  !isWhitelisted &&
                  CONFIG.channels.includes(msg.chan) &&
                  isEmptyStyle &&
                  (msg.cId > CONFIG.maxCharacterID ||
                   (startsWithBlocked ||
                    containsBlocked ||
                    endsWithBlocked));

            return shouldBlock ? JSON.stringify({
                type: "chat_message_received",
                message: {
                    sName: "[屏蔽消息]",
                    cId: 0,
                },
            }) : message;

        } catch (error) {
            console.error("消息处理错误:", error, "原始消息:", message);
            return message;
        }
    }

    function addSettingsButton() {
        const waitForTarget = () => {
            const tabs = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_chatPanel__mVaVt > div > div.Chat_tabsComponentContainer__3ZoKe > div > div.TabsComponent_tabsContainer__3BDUp.TabsComponent_wrap__3fEC7 > div.MuiTabs-root.css-orq8zk > div > div");
            if (tabs && !document.getElementById('chatFilterSettingsButton')) {

                const originalBtn = tabs.lastElementChild.cloneNode(true);
                const settingsBtn = createSettingsButton(originalBtn);

                tabs.appendChild(settingsBtn);
            } else {
                setTimeout(waitForTarget, 500);
            }
        };

        waitForTarget();
    }
    function createSettingsButton(baseElement) {
        const btn = baseElement.cloneNode(true);
        btn.querySelector('.MuiBadge-root').innerHTML = '设置';
        btn.onclick = () => toggleSettingsPanel();
        btn.style.marginLeft = '10px';
        btn.id = 'chatFilterSettingsButton';
        return btn;
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'chatFilterPanel';
        panel.style = `
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #2d2d2d; padding: 20px;
            border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999; display: none;
        `;

        panel.innerHTML = `
            <h3 style="color: #fff; margin-top:0;">聊天过滤器设置(","为分隔符)</h3>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">
                    <input type="checkbox" id="blockEmpty"
                        ${CONFIG.blockEmptyStyle ? 'checked' : ''}>
                    不屏蔽有颜色/图标的玩家
                </label>
            </div>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">最大ID编号: </label>
                <input type="number" id="maxID" value="${CONFIG.maxCharacterID}"
                    style="margin-left:10px; padding:3px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">白名单: </label>
                <input type="text" id="whitelist" value="${CONFIG.whitelist.join(', ')}"
                    style="margin-left:10px; padding:3px; width:200px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">屏蔽频道: </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${Object.entries(CHANNEL_DICT).map(([k, v]) => `
                        <label style="color:#fff; display: inline-block;">
                            <input type="checkbox" value="${k}" ${CONFIG.channels.includes(k) ? 'checked' : ''}>
                            ${v}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">屏蔽模式: </label>
                <div style="display: flex; gap: 10px;">
                    <label style="color:#fff; display: inline-block;">
                        <input type="checkbox" value="standard"
                            ${CONFIG.blockedGameModes.includes('standard') ? 'checked' : ''}>
                        标准
                    </label>
                    <label style="color:#fff; display: inline-block;">
                        <input type="checkbox" value="ironcow"
                            ${CONFIG.blockedGameModes.includes('ironcow') ? 'checked' : ''}>
                        铁牛
                    </label>
                </div>
            </div>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">屏蔽规则（以xx开头）: </label>
                <input type="text" id="blockStartsWith" value="${CONFIG.blockStartsWith.join(', ')}"
                    style="margin-left:10px; padding:3px; width:200px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">屏蔽规则（包含xx）: </label>
                <input type="text" id="blockContains" value="${CONFIG.blockContains.join(', ')}"
                    style="margin-left:10px; padding:3px; width:200px;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="color:#fff;">屏蔽规则（以xx结尾）: </label>
                <input type="text" id="blockEndsWith" value="${CONFIG.blockEndsWith.join(', ')}"
                    style="margin-left:10px; padding:3px; width:200px;">
            </div>
            <button id="saveConfigButton"
                    style="margin-top:15px; padding:5px 15px;">
                保存配置
            </button>
        `;

        document.body.appendChild(panel);

        // 保存配置函数
        const saveConfig = () => {
            CONFIG.maxCharacterID = parseInt(document.getElementById('maxID').value) || 0;
            CONFIG.whitelist = document.getElementById('whitelist').value
                .split(',')
                .filter(n => n.trim());

            CONFIG.channels = Array.from(document.querySelectorAll('#chatFilterPanel input[type="checkbox"]:checked'))
                .filter(input => input.value.startsWith('/chat_channel_types'))
                .map(input => input.value);

            CONFIG.blockedGameModes = Array.from(document.querySelectorAll('#chatFilterPanel input[type="checkbox"]:checked'))
                .filter(input => ['standard', 'ironcow'].includes(input.value))
                .map(input => input.value);

            CONFIG.blockEmptyStyle = document.getElementById('blockEmpty').checked;

            CONFIG.blockStartsWith = document.getElementById('blockStartsWith').value
                .split(',')
                .filter(n => n.trim());
            CONFIG.blockContains = document.getElementById('blockContains').value
                .split(',')
                .filter(n => n.trim());
            CONFIG.blockEndsWith = document.getElementById('blockEndsWith').value
                .split(',')
                .filter(n => n.trim());

            saveConfigToLocalStorage();

            document.getElementById('chatFilterPanel').style.display = 'none';
            alert('配置已保存！');
        };

        document.getElementById('saveConfigButton').addEventListener('click', saveConfig);
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('chatFilterPanel');
        if (!panel) {
            console.error("设置面板未找到！");
            return;
        }
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    hookWS();
    createSettingsPanel();
})();