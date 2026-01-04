// ==UserScript==
// @name         Discord消息Follow邀请码监控
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @description  监控Discord特定用户的消息内容并发送到自定义Webhook
// @author       recar
// @match        https://discord.com/channels/1243823539426033696/1265932718084984963
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/509342/Discord%E6%B6%88%E6%81%AFFollow%E9%82%80%E8%AF%B7%E7%A0%81%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/509342/Discord%E6%B6%88%E6%81%AFFollow%E9%82%80%E8%AF%B7%E7%A0%81%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #config-panel {
            position: fixed;
            top: 20px;
            right: -300px;
            width: 280px;
            background: #36393f;
            border-radius: 8px;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
            padding: 16px;
            z-index: 9999;
            transition: right 0.3s ease-in-out;
            color: #dcddde;
            font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        #config-panel.open {
            right: 20px;
        }
        #config-panel h3 {
            margin-top: 0;
            color: #fff;
            font-size: 16px;
            margin-bottom: 16px;
        }
        #config-panel input, #config-panel button {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            border-radius: 4px;
            border: none;
            background: #40444b;
            color: #dcddde;
            font-size: 14px;
        }
        #config-panel input::placeholder {
            color: #72767d;
        }
        #config-panel button {
            background: #5865f2;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
        }
        #config-panel button:hover {
            background: #4752c4;
        }
        #toggle-config {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #5865f2;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            transition: transform 0.3s;
        }
        #toggle-config:hover {
            transform: rotate(180deg);
        }
        .example {
            font-size: 12px;
            color: #72767d;
            margin-top: 4px;
        }
        #status-message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #5865f2;
            color: #fff;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        #status-message.show {
            opacity: 1;
        }
    `);

    // 配置面板HTML
    const configPanelHTML = `
        <button id="toggle-config">⚙️</button>
        <div id="config-panel">
            <h3>配置面板</h3>
            <input id="usernames" type="text" placeholder="用户名(逗号分隔)">
            <div class="example">例如: Joshua,Alice,Bob</div>
            <input id="webhook-url" type="text" placeholder="Webhook URL">
            <div class="example">例如: https://api2.pushdeer.com/message/push?pushkey=YOUR_KEY</div>
            <input id="interval" type="number" placeholder="检查间隔(毫秒)">
            <div class="example">例如: 5000 (5秒)</div>
            <button id="save-config">保存配置</button>
            <button id="test-config">测试配置</button>
        </div>
        <div id="status-message"></div>
    `;

    // 添加配置面板到页面
    document.body.insertAdjacentHTML('beforeend', configPanelHTML);

    // 获取配置
    function getConfig() {
        return {
            usernames: localStorage.getItem('discord-monitor-usernames') || '',
            webhookUrl: localStorage.getItem('discord-monitor-webhook-url') || '',
            interval: parseInt(localStorage.getItem('discord-monitor-interval')) || 5000
        };
    }

    // 保存配置
    function saveConfig() {
        const usernames = document.getElementById('usernames').value;
        const webhookUrl = document.getElementById('webhook-url').value;
        const interval = document.getElementById('interval').value;

        localStorage.setItem('discord-monitor-usernames', usernames);
        localStorage.setItem('discord-monitor-webhook-url', webhookUrl);
        localStorage.setItem('discord-monitor-interval', interval);

        showStatus('配置已保存');
        setTimeout(() => location.reload(), 1000);
    }

    // 测试配置
    function testConfig() {
        const config = getConfig();
        sendWebhook('这是一条测试消息', config.webhookUrl);
    }

    // 发送webhook
    function sendWebhook(message, webhookUrl) {
        const url = `${webhookUrl}&text=${encodeURIComponent(message)}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                console.log("Webhook发送成功:", response.responseText);
                showStatus("Webhook发送成功");
            },
            onerror: function(error) {
                console.error("Webhook发送失败:", error);
                showStatus("Webhook发送失败", true);
            }
        });
    }

    // 显示状态消息
    function showStatus(message, isError = false) {
        const statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        statusElement.style.background = isError ? '#ed4245' : '#5865f2';
        statusElement.classList.add('show');
        setTimeout(() => statusElement.classList.remove('show'), 3000);
    }

    // 用于存储已处理的消息ID
    const processedMessages = new Set();

    // 监控新消息
    function checkForNewMessages() {
        const config = getConfig();
        const usernames = config.usernames.split(',').map(u => u.trim());

        const messages = document.evaluate(
            '//div[contains(@class, "contents_f9f2ca")]',
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < messages.snapshotLength; i++) {
            const messageElement = messages.snapshotItem(i);
            const usernameElement = messageElement.querySelector('.username_f9f2ca');
            if (usernameElement && usernames.includes(usernameElement.textContent.trim())) {
                const contentElements = messageElement.querySelectorAll('div[id^="message-content-"] span');
                contentElements.forEach(contentElement => {
                    const messageId = contentElement.parentElement.id;
                    if (!processedMessages.has(messageId)) {
                        processedMessages.add(messageId);
                        const content = contentElement.textContent.trim();
                        console.log(`${usernameElement.textContent.trim()}的新消息 (${messageId}): ${content}`);
                        sendWebhook(`${usernameElement.textContent.trim()}的新消息: ${content}`, config.webhookUrl);
                    }
                });
            }
        }
    }

    // 初始化
    function init() {
        const config = getConfig();
        document.getElementById('usernames').value = config.usernames;
        document.getElementById('webhook-url').value = config.webhookUrl;
        document.getElementById('interval').value = config.interval;

        document.getElementById('save-config').addEventListener('click', saveConfig);
        document.getElementById('test-config').addEventListener('click', testConfig);
        document.getElementById('toggle-config').addEventListener('click', () => {
            document.getElementById('config-panel').classList.toggle('open');
        });

        setInterval(checkForNewMessages, config.interval);
        checkForNewMessages(); // 初始检查
    }

    // 运行初始化
    init();
})();