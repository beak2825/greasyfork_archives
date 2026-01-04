// ==UserScript==
// @name         闲鱼消息提醒增强，新消息提示音 
// @namespace    https://greasyfork.org/zh-CN/scripts/514326
// @version      1.1
// @description  监听闲鱼 WebSocket 消息格式并播放提示音
// @match        https://www.goofish.com/im
// @author       kukemc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514326/%E9%97%B2%E9%B1%BC%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92%E5%A2%9E%E5%BC%BA%EF%BC%8C%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/514326/%E9%97%B2%E9%B1%BC%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92%E5%A2%9E%E5%BC%BA%EF%BC%8C%E6%96%B0%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提示音文件
    const audio = new Audio('https://m.ccw.site/gandi_application/user_assets/82913b503c6ce20ad838609ee68e32c7.mp3'); // 替换为你的提示音 URL
    audio.addEventListener("canplaythrough", () => {
        console.log("提示音文件加载成功");
    }, false);

    // 检查消息结构的函数
    function isTargetMessage(parsedMessage) {
        // 检查消息是否包含符合条件的字段和结构
        return (
            parsedMessage.headers &&
            parsedMessage.headers['app-key'] === '444e9908a51d1cb236a27862abc769c9' &&
            parsedMessage.body &&
            parsedMessage.body.syncPushPackage &&
            Array.isArray(parsedMessage.body.syncPushPackage.data) &&
            parsedMessage.body.syncPushPackage.data.some(item => item.bizType === 40 && item.objectType === 40000)
        );
    }

    // 为 WebSocket 实例添加消息监听器
    function addMessageListener(ws) {
        ws.addEventListener('message', (event) => {
            console.log("收到 WebSocket 消息:", event.data);

            try {
                const parsedMessage = JSON.parse(event.data);

                // 如果消息符合条件，则播放提示音并弹出通知
                if (isTargetMessage(parsedMessage)) {
                    console.log("匹配到符合条件的消息，正在播放提示音");
                    audio.play(); // 播放提示音
                } else {
                    console.log("消息不符合指定条件");
                }
            } catch (error) {
                console.log("收到的消息不是 JSON 格式:", event.data);
            }
        });
    }

    // 使用 Proxy 监听 WebSocket 连接
    const originalWebSocket = window.WebSocket;
    window.WebSocket = new Proxy(originalWebSocket, {
        construct(target, args) {
            const wsInstance = new target(...args);

            // 仅监听目标 WebSocket URL
            if (args[0].includes("wss-goofish.dingtalk.com")) {
                console.log("已连接到目标 WebSocket:", args[0]);
                addMessageListener(wsInstance);
            }

            return wsInstance;
        }
    });

    console.log("WebSocket 被动监听器已初始化，等待符合条件的消息...");
})();
