// ==UserScript==
// @name               AI 生成 - 哔哩哔哩 - 隐藏已看完的播放记录
// @name:en_US         AI-gen - BiliBili - Hide watched playlists
// @description        自动隐藏已看完视频，支持热键（H）切换显示和隐藏。
// @description:en_US  Auto-hide watched videos, with hotkey (H) to toggle display.
// @version            2.0.0
// @author             DeepSeek-R1、CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.bilibili.com/history
// @match              https://www.bilibili.com/account/history
// @icon               https://static.hdslb.com/images/favicon.ico
// @grant              GM_addStyle
// @run-at             document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/486877/AI%20%E7%94%9F%E6%88%90%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E9%9A%90%E8%97%8F%E5%B7%B2%E7%9C%8B%E5%AE%8C%E7%9A%84%E6%92%AD%E6%94%BE%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/486877/AI%20%E7%94%9F%E6%88%90%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E9%9A%90%E8%97%8F%E5%B7%B2%E7%9C%8B%E5%AE%8C%E7%9A%84%E6%92%AD%E6%94%BE%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .bili-history-hidden {
            display: none !important;
        }
        .bili-history-status {
            position: fixed;
            top: 60px;
            right: 20px;
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .bili-history-status.hidden {
            background: rgba(251, 114, 153, 0.8);
        }
        .bili-history-status.visible {
            background: rgba(0, 184, 148, 0.8);
        }
    `);

    // 页面版本检测
    const isNewVersion = window.location.href.includes('www.bilibili.com/history');
    const isOldVersion = window.location.href.includes('www.bilibili.com/account/history');

    if (!isNewVersion && !isOldVersion) return;

    // 状态管理
    let hiddenStatus = true; // 默认隐藏已看完视频
    let statusElement = null;

    // 显示状态提示
    function showStatus() {
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.className = 'bili-history-status';
            document.body.appendChild(statusElement);
        }

        statusElement.textContent = `已看完视频: ${hiddenStatus ? '已隐藏' : '显示中'}`;
        statusElement.className = `bili-history-status ${hiddenStatus ? 'hidden' : 'visible'}`;

        setTimeout(() => {
            if (statusElement) {
                statusElement.style.opacity = '1';
            }
        }, 10);

        setTimeout(() => {
            if (statusElement) {
                statusElement.style.opacity = '0';
                setTimeout(() => {
                    if (statusElement && statusElement.style.opacity === '0') {
                        statusElement.remove();
                        statusElement = null;
                    }
                }, 300);
            }
        }, 2000);
    }

    // 处理单个历史记录项
    function processRecord(record) {
        if (!record) return;

        let isWatched = false;

        if (isNewVersion) {
            // 新版检测
            const stats = record.querySelector('.bili-cover-card__stats');
            if (stats && stats.textContent.includes('已看完')) {
                isWatched = true;
            }
        } else if (isOldVersion) {
            // 旧版检测
            const progress = record.querySelector('.time-wrap .progress');
            if (progress && progress.textContent.includes('已看完')) {
                isWatched = true;
            }
        }

        if (isWatched) {
            record.classList.add('bili-history-watched');
            if (hiddenStatus) {
                record.classList.add('bili-history-hidden');
            } else {
                record.classList.remove('bili-history-hidden');
            }
        } else {
            record.classList.remove('bili-history-watched', 'bili-history-hidden');
        }
    }

    // 处理整个列表
    function processAllRecords() {
        let records = [];

        if (isNewVersion) {
            // 检查当前标签页是否是综合或视频
            const activeTab = document.querySelector('.radio-tabs__item--active');
            if (activeTab) {
                const tabText = activeTab.textContent.trim();
                if (tabText !== '综合' && tabText !== '视频') return;
            }

            records = document.querySelectorAll('.history-section .section-cards .history-card');
        } else if (isOldVersion) {
            records = document.querySelectorAll('#history_list .history-record');
        }

        records.forEach(record => processRecord(record));
    }

    // 切换隐藏状态
    function toggleHiddenStatus() {
        hiddenStatus = !hiddenStatus;

        const watchedRecords = document.querySelectorAll('.bili-history-watched');
        watchedRecords.forEach(record => {
            if (hiddenStatus) {
                record.classList.add('bili-history-hidden');
            } else {
                record.classList.remove('bili-history-hidden');
            }
        });

        showStatus();
    }

    // 监听标签切换（新版）
    function setupTabSwitchListener() {
        const tabsContainer = document.querySelector('.tabs.radio-tabs');
        if (!tabsContainer) return;

        tabsContainer.addEventListener('click', (e) => {
            const tabItem = e.target.closest('.radio-tabs__item');
            if (tabItem) {
                // 使用setTimeout确保在DOM更新后执行
                setTimeout(processAllRecords, 300);
            }
        });
    }

    // 使用MutationObserver监听DOM变化
    function setupMutationObserver() {
        const targetNode = isNewVersion ?
            document.querySelector('.history-section') || document.body :
            document.querySelector('#history_list') || document.body;

        if (!targetNode) return;

        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的历史记录项被添加
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (isNewVersion && node.matches?.('.history-card')) {
                                shouldProcess = true;
                            } else if (isOldVersion && node.matches?.('.history-record')) {
                                shouldProcess = true;
                            } else if (node.querySelector) {
                                if (node.querySelector('.history-card') || node.querySelector('.history-record')) {
                                    shouldProcess = true;
                                }
                            }
                        }
                    });
                }
            }

            if (shouldProcess) {
                processAllRecords();
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        // 初始处理所有记录
        processAllRecords();

        // 设置MutationObserver监听动态加载
        setupMutationObserver();

        // 设置标签切换监听（仅新版）
        if (isNewVersion) {
            setupTabSwitchListener();
        }

        // 添加热键监听
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'h') {
                toggleHiddenStatus();
            }
        });

        // 添加初始状态提示
        setTimeout(showStatus, 1000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();