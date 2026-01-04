// ==UserScript==
// @name         아카라이브 키워드 감지 크롬 알림
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  아카라이브에서 특정 단어가 등장하면 크롬 알림을 표시합니다
// @author       You
// @match        https://arca.live/*
// @grant        none
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/534603/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EA%B0%90%EC%A7%80%20%ED%81%AC%EB%A1%AC%20%EC%95%8C%EB%A6%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/534603/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%ED%82%A4%EC%9B%8C%EB%93%9C%20%EA%B0%90%EC%A7%80%20%ED%81%AC%EB%A1%AC%20%EC%95%8C%EB%A6%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEYWORDS = ['키워드']; // 감지할 키워드

    const originalWebSocket = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        const ws = protocols ? new originalWebSocket(url, protocols) : new originalWebSocket(url);

        ws.addEventListener('message', (event) => {
            const data = event.data;

            for (const keyword of KEYWORDS) {
                if (data.includes(keyword)) {
                    showChromeNotification(`${keyword}`, `📢 [${keyword}] 키워드가 포함된 새 글이 감지되었습니다!`);
                    break;
                }
            }
        });

        return ws;
    };
    window.WebSocket.prototype = originalWebSocket.prototype;

    function showChromeNotification(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: 'https://arca.live/favicon.ico' // 아카라이브 아이콘
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: body,
                        icon: 'https://arca.live/favicon.ico'
                    });
                }
            });
        }
    }

    console.log("[Tampermonkey] WebSocket 감시 + 크롬 알림 스크립트 활성화됨.");
})();
