// ==UserScript==
// @name         Magnet URI 到 qBittorrent Web UI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  攔截磁力連結點擊並發送到 qBittorrent Web UI
// @author       您的名字
// @match        *://**/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/532213/Magnet%20URI%20%E5%88%B0%20qBittorrent%20Web%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/532213/Magnet%20URI%20%E5%88%B0%20qBittorrent%20Web%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置 - 請修改為您的 qBittorrent Web UI 設定
    const QBITTORRENT_URL = 'http://您的qbittorrent主機:端口';
    const USERNAME = '您的用戶名';
    const PASSWORD = '您的密碼';

    // 驗證狀態追蹤變數
    let isAuthenticated = false;
    let authTimer = null;

    // 添加設定按鈕到頁面
    function addSettingsButton() {
        const button = document.createElement('div');
        button.innerHTML = '⚙️ qBT';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.backgroundColor = '#2980b9';
        button.style.color = 'white';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.style.fontSize = '14px';

        button.addEventListener('click', function() {
            const newUrl = prompt('請輸入您的 qBittorrent Web UI URL:', localStorage.getItem('qbt_url') || QBITTORRENT_URL);
            if (newUrl) localStorage.setItem('qbt_url', newUrl);

            const newUsername = prompt('請輸入您的用戶名:', localStorage.getItem('qbt_username') || USERNAME);
            if (newUsername) localStorage.setItem('qbt_username', newUsername);

            const newPassword = prompt('請輸入您的密碼:', localStorage.getItem('qbt_password') || PASSWORD);
            if (newPassword) localStorage.setItem('qbt_password', newPassword);

            // 重置驗證狀態
            isAuthenticated = false;
            alert('設定已更新！');
        });

        document.body.appendChild(button);
    }

    // 獲取當前設定值
    function getConfig(key, defaultValue) {
        return localStorage.getItem('qbt_' + key) || defaultValue;
    }

    // 顯示通知
    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '70px';
        notification.style.right = '20px';
        notification.style.backgroundColor = isSuccess ? '#27ae60' : '#e74c3c';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.fontWeight = 'bold';
        notification.style.fontSize = '14px';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';

        document.body.appendChild(notification);

        // 淡入效果
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // 3秒後自動移除通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }

    // 與 qBittorrent Web UI 進行驗證
    function authenticate(callback) {
        const qbtUrl = getConfig('url', QBITTORRENT_URL);
        const username = getConfig('username', USERNAME);
        const password = getConfig('password', PASSWORD);

        GM_xmlhttpRequest({
            method: 'POST',
            url: qbtUrl + '/api/v2/auth/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            withCredentials: true,
            onload: function(response) {
                if (response.responseText === 'Ok.') {
                    isAuthenticated = true;
                    // 設定計時器，每50分鐘重新驗證（qBittorrent 會話1小時後過期）
                    if (authTimer) clearTimeout(authTimer);
                    authTimer = setTimeout(function() {
                        isAuthenticated = false;
                    }, 50 * 60 * 1000);

                    if (callback) callback();
                } else {
                    console.error('qBittorrent 驗證失敗', response.status, response.responseText);
                    showNotification('qBittorrent 驗證失敗，請檢查您的憑證', false);
                }
            },
            onerror: function(error) {
                console.error('連接到 qBittorrent Web UI 時出錯', error);
                showNotification('無法連接到 qBittorrent Web UI，請檢查它是否運行並可訪問', false);
            }
        });
    }

    // 將磁力連結添加到 qBittorrent
    function addMagnetToQBittorrent(magnetURI) {
        const qbtUrl = getConfig('url', QBITTORRENT_URL);

        const addTorrentFunction = function() {
            GM_xmlhttpRequest({
                method: 'POST',
                url: qbtUrl + '/api/v2/torrents/add',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `urls=${encodeURIComponent(magnetURI)}`,
                withCredentials: true,
                onload: function(response) {
                    if (response.status === 200) {
                        console.log('磁力連結成功添加到 qBittorrent');
                        showNotification('磁力連結成功添加到 qBittorrent');
                    } else {
                        console.error('無法將磁力連結添加到 qBittorrent', response.status, response.responseText);
                        showNotification('無法將磁力連結添加到 qBittorrent', false);
                    }
                },
                onerror: function(error) {
                    console.error('連接到 qBittorrent Web UI 時出錯', error);
                    showNotification('無法連接到 qBittorrent Web UI', false);
                }
            });
        };

        if (!isAuthenticated) {
            authenticate(addTorrentFunction);
        } else {
            addTorrentFunction();
        }
    }

    // 初始化腳本
    function init() {
        // 添加設定按鈕
        if (window.top === window.self) {  // 只在主框架執行
            addSettingsButton();
        }

        // 攔截磁力連結點擊
        document.addEventListener('click', function(event) {
            let target = event.target;

            // 檢查點擊的元素是否為錨點或有錨點父元素
            while (target && target.tagName !== 'A') {
                target = target.parentNode;
                if (!target || target === document) return;
            }

            // 檢查連結是否為磁力URI
            if (target && target.href && target.href.startsWith('magnet:')) {
                event.preventDefault(); // 阻止默認操作
                addMagnetToQBittorrent(target.href);
            }
        }, true);
    }

    // 等待頁面加載完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();