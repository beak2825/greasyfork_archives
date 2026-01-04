// ==UserScript==
// @name         [MWI] WebSocket 调试工具
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  显示 WebSocket 收发的 JSON 数据，并支持手动发包和屏蔽指定类型
// @author       XIxixi297
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538937/%5BMWI%5D%20WebSocket%20%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/538937/%5BMWI%5D%20WebSocket%20%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.__wsLoggerInstalled) return;
    window.__wsLoggerInstalled = true;

    // 全局状态
    const wsLogger = {
        instances: new Set(),
        currentWS: null,
        blockedTypes: new Set(),
        STORAGE_KEY: 'ws_blocked_types'
    };

    // 初始化屏蔽列表
    try {
        const stored = localStorage.getItem(wsLogger.STORAGE_KEY);
        if (stored) wsLogger.blockedTypes = new Set(JSON.parse(stored));
    } catch (e) {}

    function saveBlockedTypes() {
        try {
            localStorage.setItem(wsLogger.STORAGE_KEY, JSON.stringify([...wsLogger.blockedTypes]));
        } catch (e) {}
    }

    // 消息日志记录
    function logMessage(data, direction) {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            const msgType = parsed.type || '未知类型';

            if (!wsLogger.blockedTypes.has(msgType)) {
                const color = direction === 'send' ? '#03A9F4' : '#4CAF50';
                const arrow = direction === 'send' ? '→' : '←';
                console.groupCollapsed(`%c${arrow} ${msgType}`, `color: ${color}; font-weight: bold;`);
                console.log(parsed);
                console.groupEnd();
            }
        } catch (e) {
            const color = direction === 'send' ? '#03A9F4' : '#4CAF50';
            const arrow = direction === 'send' ? '→' : '←';
            console.log(`%c${arrow} 非JSON:`, `color: ${color};`, data);
        }
    }

    // WebSocket劫持
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        // 添加到实例集合
        wsLogger.instances.add(ws);
        wsLogger.currentWS = ws;

        // Hook send 方法
        const originalSend = ws.send;
        ws.send = function(data) {
            logMessage(data, 'send');
            return originalSend.apply(this, arguments);
        };

        // 监听消息
        ws.addEventListener('message', (event) => {
            logMessage(event.data, 'receive');
        });

        ws.addEventListener('open', () => {
            console.info('%cWebSocket 已连接: ' + url, 'color: gray;');
        });

        ws.addEventListener('close', () => {
            console.warn('%cWebSocket 已断开', 'color: orange;');
            wsLogger.instances.delete(ws);
            if (wsLogger.currentWS === ws) {
                const remaining = [...wsLogger.instances];
                wsLogger.currentWS = remaining[remaining.length - 1] || null;
            }
        });

        return ws;
    };

    // 保持原型链
    Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
    window.WebSocket.prototype = OriginalWebSocket.prototype;

    // 工具函数
    window.sendWS = function(data) {
        if (!wsLogger.currentWS || wsLogger.currentWS.readyState !== WebSocket.OPEN) {
            console.error('没有可用的WebSocket连接');
            return false;
        }
        const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
        wsLogger.currentWS.send(jsonData);
        console.log('%c✅ 手动发送:', 'color: #FF9800; font-weight: bold;', data);
        return true;
    };

    window.listWS = function() {
        console.log('%cWebSocket 连接列表:', 'color: #9C27B0; font-weight: bold;');
        [...wsLogger.instances].forEach((ws, index) => {
            const status = ws.readyState === WebSocket.OPEN ? '✅' : '❌';
            console.log(`[${index}] ${ws.url} ${status}`);
        });
    };

    window.blockType = function(type) {
        if (typeof type === 'string') {
            wsLogger.blockedTypes.add(type);
        } else if (Array.isArray(type)) {
            type.forEach(t => wsLogger.blockedTypes.add(t));
        }
        saveBlockedTypes();
        console.log('%c🚫 已屏蔽:', 'color: #F44336; font-weight: bold;', type);
    };

    window.unblockType = function(type) {
        if (typeof type === 'string') {
            wsLogger.blockedTypes.delete(type);
        } else if (Array.isArray(type)) {
            type.forEach(t => wsLogger.blockedTypes.delete(t));
        }
        saveBlockedTypes();
        console.log('%c✅ 已取消屏蔽:', 'color: #4CAF50; font-weight: bold;', type);
    };

    window.listBlocked = function() {
        if (wsLogger.blockedTypes.size === 0) {
            console.log('%c无屏蔽类型', 'color: #607D8B;');
        } else {
            console.log('%c屏蔽列表:', 'color: #F44336; font-weight: bold;', [...wsLogger.blockedTypes]);
        }
    };

    window.clearBlocked = function() {
        const count = wsLogger.blockedTypes.size;
        wsLogger.blockedTypes.clear();
        saveBlockedTypes();
        console.log(`%c✅ 已清空 ${count} 个屏蔽类型`, 'color: #4CAF50; font-weight: bold;');
    };

    // 启动提示
    console.info('%c[MWI] WebSocket监听器已启用', 'color: purple; font-weight: bold;');

    if (wsLogger.blockedTypes.size > 0) {
        console.info(`%c已加载 ${wsLogger.blockedTypes.size} 个屏蔽类型:`, 'color: #FF9800; font-weight: bold;', [...wsLogger.blockedTypes]);
    }

    console.info('%c使用方法:', 'color: #2196F3; font-weight: bold;');
    console.info('%c  sendWS(data) - 发送消息到当前WebSocket', 'color: #2196F3;');
    console.info('%c  blockType(type) - 屏蔽指定类型消息 (支持字符串或数组)', 'color: #F44336;');
    console.info('%c  unblockType(type) - 取消屏蔽指定类型', 'color: #4CAF50;');
    console.info('%c  listBlocked() - 查看当前屏蔽的消息类型', 'color: #607D8B;');
    console.info('%c  clearBlocked() - 清空所有屏蔽类型', 'color: #607D8B;');
    console.info('%c示例: blockType(["chat_message_received", "ping"]) - 屏蔽多个类型', 'color: #9E9E9E;');

})();