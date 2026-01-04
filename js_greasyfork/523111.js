// ==UserScript==
// @name        Play Stripchat via PotPlayer, VLC, nPlayer, etc
// @namespace   https://greasyfork.org/scripts/473187
// @version     1.3.0
// @description Play Stripchat videos using external players like PotPlayer, VLC, and nPlayer.
// @match       *://*.stripchat.com/*
// @grant       GM_setClipboard
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523111/Play%20Stripchat%20via%20PotPlayer%2C%20VLC%2C%20nPlayer%2C%20etc.user.js
// @updateURL https://update.greasyfork.org/scripts/523111/Play%20Stripchat%20via%20PotPlayer%2C%20VLC%2C%20nPlayer%2C%20etc.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let live_url = '';

    // 📡 Bắt URL qua XHR
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.responseText) {
                try {
                    if (this.responseText.includes('.m3u8')) {
                        const match = this.responseText.match(/https?:\/\/[^\s"]+\.m3u8/);
                        if (match) {
                            live_url = match[0];
                            console.log('🎯 Found m3u8 URL via XHR:', live_url);
                        }
                    }
                } catch (e) {
                    console.warn('⚠️ XHR Error:', e);
                }
            }
        });
        originalXHR.apply(this, arguments);
    };

    // 📡 Bắt URL qua WebSocket
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const ws = new originalWebSocket(...args);

        ws.addEventListener('message', (event) => {
            try {
                const data = event.data;
                if (typeof data === 'string' && data.includes('.m3u8')) {
                    const match = data.match(/https?:\/\/[^\s"]+\.m3u8/);
                    if (match) {
                        live_url = match[0];
                        console.log('🎯 Found m3u8 URL via WebSocket:', live_url);
                    }
                }
            } catch (e) {
                console.warn('⚠️ WebSocket Error:', e);
            }
        });

        return ws;
    };

    // 🎮 Tạo nút điều khiển
    function createButton(player_name, player_url, copy_url = false) {
        let button = document.createElement("button");
        button.innerHTML = player_name;
        button.style.cssText = `
            width: 100px;
            height: 35px;
            text-align: center;
            color: white;
            background: #e33e33;
            border: 1px solid #e33e33;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            margin: 5px;
        `;

        button.onclick = function () {
            if (!live_url) {
                alert('❌ Không tìm thấy URL video. Hãy làm mới trang và thử lại.');
                return;
            }

            let final_url = `${player_url}${live_url}`;
            if (copy_url) {
                GM_setClipboard(final_url);
                alert(`✅ URL đã sao chép: ${final_url}`);
            } else {
                window.open(final_url);
            }
        };

        document.querySelector("#portal-root")?.prepend(button);
    }

    // Thêm nút phát video
    createButton("Copy Link", "", true);
    createButton("PotPlayer", "potplayer://");
    createButton("VLC", "vlc://");
    createButton("nPlayer", "nplayer-");
})();
