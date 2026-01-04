// ==UserScript==
// @name         [MWI]WebSocket Log Viewer
// @name:zh-CN   [银河奶牛]WebSocket日志查看器
// @namespace    https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-websocket-log-viewer
// @version      1.0.0
// @description  Intercept and display WebSocket communication data in console with JSON formatting
// @description:zh-CN  拦截WebSocket通信数据并以JSON格式显示在控制台
// @author       shenhuanjie
// @license      MIT
// @match        https://www.milkywayidle.com/game*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @homepage     https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-websocket-log-viewer
// @supportURL   https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-websocket-log-viewer
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/535877/%5BMWI%5DWebSocket%20Log%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535877/%5BMWI%5DWebSocket%20Log%20Viewer.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // 检查是否存在JSON Formatter库
    if (typeof JSONFormatter !== 'undefined') {
        console.info("%cJSON Formatter 库已加载", "color: #2196F3; font-weight: bold;");
    } else {
        console.warn("%cJSON Formatter 库未加载，日志将以普通格式显示", "color: #FF9800; font-weight: bold;");
    }

    // 代理 WebSocket
    const OriginalWebSocket = window.WebSocket;
    const handlerQueue = [];

    function MwiWebSocketket(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        ws.addEventListener("message", function(event) {
            try {
                const msgData = JSON.parse(event.data);
                handlerQueue.reduce((prev, handler) => {
                    return handler(prev);
                }, msgData);
            } catch (e) {
                console.warn("非 JSON 格式消息:", event.data);
            }
        });

        ws.addEventListener("open", function() {
            console.info("%cWebSocket 连接已建立: %s", "color: #4CAF50; font-weight: bold;", url);
        });

        ws.addEventListener("close", function(event) {
            console.info("%cWebSocket 连接已关闭: %s (Code: %d, Reason: %s)",
                        "color: #F44336; font-weight: bold;",
                        url, event.code, event.reason);
        });

        ws.addEventListener("error", function(event) {
            console.error("%cWebSocket 错误: %s", "color: #F44336; font-weight: bold;", url, event);
        });

        return ws;
    }

    window.WebSocket = MwiWebSocketket;

    // 动态生成安全RGB颜色的哈希函数
    const getDynamicColor = (type) => {
        let hash = 0;
        for (let i = 0; i < type.length; i++) {
            hash = type.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360; // 色调范围0-360
        return `hsl(${hue}, 65%, 55%)`; // 调整饱和度为65%，亮度为55%，提升深色背景下的可读性
    };

    // 颜色渲染开关，true为启用动态颜色，false为使用默认灰色
    const enableColor = false;

    // 白名单配置，指定不打印的消息类型
    const whitelist = ['chat_message_received'];

    // 美化显示JSON消息
    const displayMessageData = (msgData) => {
        if (whitelist.includes(msgData.type)) {
            return msgData;
        }
        const timestamp = new Date().toISOString().split('T')[1].substring(0, 12);
        const color = enableColor ? getDynamicColor(msgData.type) : '#000000'; // 根据开关选择颜色
        console.groupCollapsed(`%c[${timestamp}] ${msgData.type}`, `color: ${color}; font-weight: bold;`);
        console.log(msgData);
        console.groupEnd();
        return msgData;
    };

    // 注册消息处理器
    handlerQueue.push(displayMessageData);

    console.info("%cWebSocket 日志查看器已启动", "color: #4CAF50; font-weight: bold;");
    console.info("%c所有 WebSocket 消息将在此处显示", "color: #9C27B0; font-weight: bold;");
})();