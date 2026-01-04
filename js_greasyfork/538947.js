// ==UserScript==
// @name         Enazo声音提示测试版
// @namespace    http://tampermonkey.net/
// @version      2025-06-10.2
// @description  Sound Notifications for Enazo Chat Messages
// @author       Noa
// @match        https://enazo.cn/r/*
// @icon         https://enazo.cn/favicon.ico
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/538947/Enazo%E5%A3%B0%E9%9F%B3%E6%8F%90%E7%A4%BA%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538947/Enazo%E5%A3%B0%E9%9F%B3%E6%8F%90%E7%A4%BA%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    const playAlertSound = () => {
        try {
            const audio = new Audio("https://aoi.magiconch.com/vo/0139_%E3%82%88%E3%81%89%EF%BD%9E%E3%81%84.m4a");
            audio.volume = 1.0;
            audio.play().catch(() => {});
        } catch (e) {
            console.error("failed：", e);
        }
    };

    function shouldNotify() {
        return document.hidden || !document.hasFocus();
    }

    function notifyUser(msg) {
        if (!shouldNotify()) return;
        playAlertSound();
    }

    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const ws = new OriginalWebSocket(...args);

        ws.addEventListener('message', function (event) {
            const data = event.data;

            if (typeof data === 'string' && data.startsWith('16')) {
                const messageList = document.querySelector('.draw-message-box .message-list');
                if (messageList) {
                    notifyUser(data);
                }
            }
        });

        return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;

})();