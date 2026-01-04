// ==UserScript==
// @name         小米有品客服自动回复油猴脚本
// @namespace    https://www.techeek.cn/
// @version      1.3
// @description  小米有品客服平台太恶心，30S内必须回复，不然就罚款，因此写了个小工具监控并自动回复（求求小米工程师优化下有品客服工具的APP吧，2025年了，还必须一直打开APP才能看到消息，而且不支持IOS平台）。
// @author       Techeek
// @match        https://yp-janus.kefu.mi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524602/%E5%B0%8F%E7%B1%B3%E6%9C%89%E5%93%81%E5%AE%A2%E6%9C%8D%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/524602/%E5%B0%8F%E7%B1%B3%E6%9C%89%E5%93%81%E5%AE%A2%E6%9C%8D%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义常量
    const DEFAULT_BARK_TITLE = encodeURIComponent("小米有品客服通知"); // Bark通知标题
    const DEFAULT_BARK_DEVICE_KEY = "123456789"; // Bark密钥，下载Bark后自动获取
    const DEFAULT_REPLY_CONTENT = "您好，请问有什么可以帮您？"; // 默认回复内容

    // 全局状态
    let isMonitoring = localStorage.getItem('autoreply_enabled') === 'true';

    // 工具函数：等待元素加载
    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100);
    }

    // 工具函数：发送 POST 请求
    async function sendPostRequest(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                console.log('POST请求成功:', await response.json());
                return true;
            } else {
                console.error('POST请求失败:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('发送POST请求时出错:', error);
            return false;
        }
    }

    // 工具函数：发送 GET 请求
    async function sendGetRequest(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.log('GET请求成功');
                return true;
            } else {
                console.error('GET请求失败:', response.status, response.statusText);
                return false;
            }
        } catch (error) {
            console.error('发送GET请求时出错:', error);
            return false;
        }
    }

    // 按钮相关逻辑
    function setupToggleButton(container) {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'autoreply-toggle';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.cursor = 'pointer';

        // 更新按钮状态
        function updateButtonState() {
            toggleButton.textContent = `自动回复: ${isMonitoring ? '开启' : '关闭'}`;
            toggleButton.style.backgroundColor = isMonitoring ? '#4CAF50' : '#f44336';
        }

        // 初始化按钮状态
        updateButtonState();

        // 按钮点击事件
        toggleButton.addEventListener('click', () => {
            isMonitoring = !isMonitoring;
            localStorage.setItem('autoreply_enabled', isMonitoring);
            window.location.reload(); // 点击按钮后自动刷新页面
        });

        container.appendChild(toggleButton);
    }

    // WebSocket 相关逻辑
    function setupWebSocket() {
        const OriginalWebSocket = window.WebSocket;

        // 重写 WebSocket 构造函数
        window.WebSocket = function (...args) {
            const wsInstance = new OriginalWebSocket(...args);

            console.log('[WebSocket] 创建连接:', args);

            // 监听消息接收
            wsInstance.addEventListener('message', async function (event) {
                if (!isMonitoring) return; // 未开启监控则直接返回

                try {
                    const message = JSON.parse(event.data);
                    if (message.body) {
                        const contentJSON = JSON.parse(message.body.content);
                        if (contentJSON.roleType === 'MiCustomer') {
                            console.log('客户名称:', contentJSON.fromUserName);
                            console.log('客户会话:', contentJSON.content);
                            console.groupEnd();

                            const match = message.body.roomId.match(/^.*:(\d+):.*@.*$/);
                            const userTenantId = match[1];
                            const postData = {
                                roomId: message.body.roomId,
                                userId: message.body.toUserId,
                                connectionId: message.body.toUserConnectionId,
                                content: DEFAULT_REPLY_CONTENT,
                                msgType: "TEXT",
                                umsgId: `KF|${Date.now()}`,
                                extraInfo: "{}",
                                tenantId: "youpin",
                                userTenantId: userTenantId
                            };

                            // 发送自动回复
                            const postUrl = 'https://yp-janus.kefu.mi.com/mcc/web-api/chat/send';
                            const postSuccess = await sendPostRequest(postUrl, postData);

                            if (postSuccess) {
                                // 自动回复成功后，通过 Bark 推送紧急消息
                                const barkUrl = `https://api.day.app/${DEFAULT_BARK_DEVICE_KEY}/${DEFAULT_BARK_TITLE}?level=critical&volume=5`;
                                await sendGetRequest(barkUrl);
                            }
                        }
                    }
                } catch (error) {
                    console.error('[WebSocket] 消息解析失败:', error, '消息内容:', event.data);
                }
            });

            return wsInstance;
        };

        // 继承 WebSocket 原型链
        window.WebSocket.prototype = OriginalWebSocket.prototype;
    }

    // 初始化
    function init() {
        // 等待页面加载完成后添加按钮
        waitForElement('.home-container-headbar', setupToggleButton);

        // 设置 WebSocket 监听
        setupWebSocket();
    }

    // 启动脚本
    init();
})();