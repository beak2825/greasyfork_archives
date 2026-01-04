// ==UserScript==
// @name         Smart Page Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Smoothly refreshes web pages when changed. Press Ctrl+R to start auto refresh
// @author       kequn yang
// @match        *://*/*
// @match        file:///*
// @match        http://127.0.0.1:*/*
// @match        http://localhost:*/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515880/Smart%20Page%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/515880/Smart%20Page%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const REFRESH_INTERVAL = 1000;
    const STORAGE_KEY = 'autoRefreshEnabled';
    let isRefreshing = false;
    let refreshTimer = null;
    let lastContent = '';
    let notificationTimeout = null;

    // 添加样式
    GM_addStyle(`
        .refresh-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: rgba(33, 150, 243, 0.95);
            color: white;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease-in-out;
        }
        
        .refresh-notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .refresh-notification.success {
            background-color: rgba(76, 175, 80, 0.95);
        }
        
        .refresh-notification.error {
            background-color: rgba(244, 67, 54, 0.95);
        }
    `);

    // 显示通知
    function showNotification(message, type = 'info') {
        // 移除现有通知
        const existingNotification = document.querySelector('.refresh-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 清除现有计时器
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `refresh-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // 触发动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // 2秒后淡出
        notificationTimeout = setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    function isLocalFile() {
        return window.location.protocol === 'file:';
    }

    async function checkForChanges() {
        if (!isRefreshing) return;

        try {
            const response = await fetch(window.location.href, {
                cache: 'no-store'
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const newContent = await response.text();

            if (newContent !== lastContent) {
                console.log('Content changed, refreshing...');
                lastContent = newContent;
                window.location.reload();
            }
        } catch (error) {
            console.error('Refresh error:', error);
            showNotification('Auto refresh error!', 'error');
            stopAutoRefresh();
        }
    }

    function startAutoRefresh() {
        if (isRefreshing) return;

        fetch(window.location.href, {
            cache: 'no-store'
        }).then(response => response.text())
          .then(content => {
              lastContent = content;
              isRefreshing = true;
              localStorage.setItem(STORAGE_KEY, 'true');

              if (refreshTimer) {
                  clearInterval(refreshTimer);
              }

              refreshTimer = setInterval(checkForChanges, REFRESH_INTERVAL);
              showNotification('Auto refresh turned ON', 'success');
              console.log('Auto refresh started');
          })
          .catch(error => {
              console.error('Error starting auto refresh:', error);
              showNotification('Failed to start auto refresh!', 'error');
          });
    }

    function stopAutoRefresh() {
        if (!isRefreshing) return;

        isRefreshing = false;
        localStorage.setItem(STORAGE_KEY, 'false');

        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }

        showNotification('Auto refresh turned OFF', 'error');
        console.log('Auto refresh stopped');
    }

    function handleKeyPress(e) {
        if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
            e.preventDefault();
            if (isRefreshing) {
                stopAutoRefresh();
            } else {
                startAutoRefresh();
            }
        }
    }

    // 初始化
    function initialize() {
        document.addEventListener('keydown', handleKeyPress);

        // 获取保存的状态
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState === 'true') {
            startAutoRefresh();
        }
    }

    // 打印使用说明
    console.log(`%cSmart Page Auto Refresh Instructions`, 'font-size: 16px; font-weight: bold; color: #2196F3');
    console.log(`%cAutomatically refresh web pages. Press Ctrl+R to start/stop page refresh.`, 'color: #4CAF50');
    console.log(`\n%cFor CORS problem of local file, start Chrome with these parameters:`, 'color: #FF5722');
    console.log(`%c# MacOS`, 'color: #9C27B0');
    console.log(`open -a "Google Chrome" --args --allow-file-access-from-files --disable-web-security --user-data-dir="~/ChromeDevSession"`);
    console.log(`\n%c# Windows`, 'color: #9C27B0');
    console.log(`chrome.exe --allow-file-access-from-files --disable-web-security --user-data-dir=C:\\ChromeDevSession`);
    console.log(`\n%c# Linux`, 'color: #9C27B0');
    console.log(`google-chrome --allow-file-access-from-files --disable-web-security --user-data-dir="~/ChromeDevSession"`);

    // 运行初始化
    initialize();

    // 在页面卸载前清理
    window.addEventListener('unload', () => {
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }
    });
})();