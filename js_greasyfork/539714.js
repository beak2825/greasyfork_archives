// ==UserScript==
// @name         XTRF Account Check
// @namespace    http://langlink.tech/
// @version      2.2
// @description  检查 XTRF 项目页面 Account 字段状态，如果为 Unspecified 则弹窗提醒并在旁边显示提醒标记
// @author       LL-Floyd
// @license      MIT
// @match        https://*.xtrf.eu/xtrf/faces/projectAssistant/projects/project.seam*
// @grant        GM_xmlhttpRequest
// @connect      *.xtrf.eu
// @connect      update.greasyfork.org
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539714/XTRF%20Account%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/539714/XTRF%20Account%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查更新函数
    function checkForUpdates() {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://update.greasyfork.org/scripts/539714/XTRF%20Account%20Check.user.js",
                onload: function (response) {
                    const latestVersionMatch = /@version\s+([0-9.]+)/.exec(response.responseText);
                    if (latestVersionMatch) {
                        const latestVersion = latestVersionMatch[1];
                        const currentVersion = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '2.0';
                        if (latestVersion > currentVersion) {
                            alert("XTRF Account Check 有新版本可用: " + latestVersion + "\n请点击OK更新");
                            window.location.href = "https://greasyfork.org/scripts/YOUR_SCRIPT_ID";
                        }
                    }
                },
                onerror: function (error) {
                    console.error('Error checking for updates:', error);
                }
            });
        }
    }

    // 在account元素旁边添加提醒标记
    function addReminderMark(container, isIgnored = false) {
        // 先移除已存在的提醒标记
        const existingMark = document.querySelector('.account-reminder-mark');
        if (existingMark) {
            if (existingMark._updatePosition) {
                window.removeEventListener('scroll', existingMark._updatePosition);
                window.removeEventListener('resize', existingMark._updatePosition);
            }
            existingMark.remove();
        }

        // 获取Accounts字段的位置信息
        const accountRect = container.getBoundingClientRect();

        const reminderMark = document.createElement('div');
        reminderMark.className = 'account-reminder-mark';
        
        // 使用fixed定位，放在元素上方中心位置
        reminderMark.style.cssText = `
            position: fixed;
            left: ${accountRect.left + accountRect.width / 2 - 40}px;
            top: ${accountRect.top - 80}px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
            color: white;
            cursor: help;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 3px solid white;
            pointer-events: auto;
            transition: transform 0.2s ease;
            ${isIgnored ? 
                'background-color: #ff9800; animation: none;' : 
                'background-color: #f44336; animation: accountPulse 2s infinite;'
            }
        `;

        reminderMark.textContent = isIgnored ? '!' : '⚠';
        reminderMark.title = isIgnored ? 
            '账户字段需要注意 (已忽略提醒)' : 
            '账户字段需要注意 - 当前为 Unspecified';

        // 添加鼠标悬停效果
        reminderMark.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        reminderMark.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // 直接添加到body，避免被父容器限制
        document.body.appendChild(reminderMark);

        // 添加页面滚动和窗口大小变化的监听器，保持标记位置正确
        const updatePosition = () => {
            if (document.body.contains(container)) {
                const newRect = container.getBoundingClientRect();
                reminderMark.style.left = `${newRect.left + newRect.width / 2 - 40}px`;
                reminderMark.style.top = `${newRect.top - 80}px`;
            } else {
                // 如果原容器不存在了，移除标记
                if (reminderMark._updatePosition) {
                    window.removeEventListener('scroll', reminderMark._updatePosition);
                    window.removeEventListener('resize', reminderMark._updatePosition);
                }
                reminderMark.remove();
            }
        };

        // 监听滚动和窗口大小变化
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
        
        // 存储事件监听器的引用，方便清理
        reminderMark._updatePosition = updatePosition;

        // 添加CSS动画
        if (!document.getElementById('accountReminderStyles')) {
            const style = document.createElement('style');
            style.id = 'accountReminderStyles';
            style.textContent = `
                @keyframes accountPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.08); opacity: 0.9; }
                }
            `;
            document.head.appendChild(style);
        }

        // 定期检查容器是否还存在
        const checkInterval = setInterval(() => {
            if (!document.body.contains(container) || !document.body.contains(reminderMark)) {
                clearInterval(checkInterval);
                if (reminderMark._updatePosition) {
                    window.removeEventListener('scroll', reminderMark._updatePosition);
                    window.removeEventListener('resize', reminderMark._updatePosition);
                }
                if (document.body.contains(reminderMark)) {
                    reminderMark.remove();
                }
            }
        }, 1000);
    }

    // 检查 Account 字段的函数
    function checkAccountField() {
        const accountTitles = document.querySelectorAll('.title.ng-binding');

        for (let title of accountTitles) {
            if (title.textContent.trim() === 'Accounts') {
                const container = title.closest('.input-wrap');
                if (container) {
                    const accountField = container.querySelector('.nd-display.ng-binding');
                    if (accountField && accountField.textContent.trim() === 'Unspecified') {
                        // 检查是否已经显示过提醒且用户选择了忽略
                        const isIgnored = localStorage.getItem(`xtrf_account_ignored_${window.location.href}`) === 'true';
                        
                        if (!isIgnored) {
                            showAccountReminder(container);
                        } else {
                            // 如果已忽略，直接显示忽略状态的标记
                            addReminderMark(container, true);
                        }
                        return true;
                    } else {
                        // 如果账户已设置，移除提醒标记和忽略状态
                        const existingMark = document.querySelector('.account-reminder-mark');
                        if (existingMark) {
                            if (existingMark._updatePosition) {
                                window.removeEventListener('scroll', existingMark._updatePosition);
                                window.removeEventListener('resize', existingMark._updatePosition);
                            }
                            existingMark.remove();
                        }
                        localStorage.removeItem(`xtrf_account_ignored_${window.location.href}`);
                    }
                }
                break;
            }
        }
        return false;
    }

    // 显示账户提醒弹窗
    function showAccountReminder(accountContainer) {
        if (document.getElementById('accountReminderOverlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'accountReminderOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            width: 450px;
            max-width: 90vw;
            text-align: center;
            font-family: Arial, sans-serif;
        `;

        modal.innerHTML = `
            <div style="color: #d32f2f; font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h3 style="color: #d32f2f; margin: 0 0 15px 0; font-size: 18px;">账户未选择</h3>
            <p style="margin: 0 0 20px 0; color: #666; line-height: 1.5;">
                检测到 Account 字段状态为 "Unspecified"，<br>
                请注意及时设置正确的账户信息。
            </p>
            <div style="margin-top: 25px;">
                <button id="confirmButton" style="
                    background-color: #1976d2;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 15px;
                ">我知道了</button>
                <button id="ignoreButton" style="
                    background-color: #757575;
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                ">忽略此页面</button>
            </div>
            <p style="margin: 15px 0 0 0; color: #999; font-size: 12px;">
                选择"忽略此页面"将不再弹出提醒，但会保留提醒标记
            </p>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 添加提醒标记（非忽略状态）
        addReminderMark(accountContainer, false);

        document.getElementById('confirmButton').addEventListener('click', function() {
            overlay.remove();
        });

        document.getElementById('ignoreButton').addEventListener('click', function() {
            // 设置忽略状态
            localStorage.setItem(`xtrf_account_ignored_${window.location.href}`, 'true');
            // 更新提醒标记为忽略状态
            addReminderMark(accountContainer, true);
            overlay.remove();
        });

        // 点击遮罩关闭
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('accountReminderOverlay')) {
                overlay.remove();
            }
        });
    }

    // 等待页面加载并检查
    function checkWhenReady() {
        const observer = new MutationObserver(function() {
            const customFieldsContainer = document.querySelector('.widget-simple.custom-field');
            if (customFieldsContainer) {
                setTimeout(checkAccountField, 1000);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 10秒后停止观察
        setTimeout(() => observer.disconnect(), 10000);
    }

    // 页面变化时重新检查
    function setupPageChangeDetection() {
        let lastUrl = window.location.href;
        
        const checkUrlChange = () => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                // URL改变时重新检查
                setTimeout(checkAccountField, 1500);
            }
        };

        // 监听history变化
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(checkUrlChange, 100);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(checkUrlChange, 100);
        };

        window.addEventListener('popstate', checkUrlChange);
        
        // 定期检查URL变化（备用方案）
        setInterval(checkUrlChange, 2000);
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            checkWhenReady();
            setupPageChangeDetection();
        });
    } else {
        checkWhenReady();
        setupPageChangeDetection();
    }

    // 检查更新
    checkForUpdates();

})();