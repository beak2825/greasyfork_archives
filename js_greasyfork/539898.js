// ==UserScript==
// @name         PT站候选自动投票
// @namespace    http://tampermonkey.net/
// @version      2025.06.18
// @description  自动点击所有包含 vote=yeah 的链接。适用于岛等需要投票才能通过候选的站点。
// @match        *://*/*offers.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539898/PT%E7%AB%99%E5%80%99%E9%80%89%E8%87%AA%E5%8A%A8%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539898/PT%E7%AB%99%E5%80%99%E9%80%89%E8%87%AA%E5%8A%A8%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.href.toLowerCase().endsWith('offers.php')) {
        return;
    }

    // 添加自定义样式
    GM_addStyle(`
        .vote-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #444;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 10000;
            width: 300px;
            border: 1px solid #666;
            color: #fff;
            font-family: Arial, sans-serif;
        }
        .vote-dialog-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #fff;
        }
        .vote-dialog-content {
            margin-bottom: 20px;
            font-size: 14px;
        }
        .vote-dialog-button {
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            float: right;
        }
        .vote-dialog-button:hover {
            background-color: #45a049;
        }
    `);

    const config = {
        defaultDelay: 1000,
        timeout: 2500,
        panelBgColor: '#333',
        buttonSpacing: '5px',
        panelOpacity: 0.9 // 默认透明度改为 90%
    };

    // 获取当前网站域名
    const currentDomain = window.location.hostname;

    // 获取或初始化投票记录
    function getVoteHistory() {
        const allHistory = GM_getValue('voteHistory', {});
        return allHistory[currentDomain] || {};
    }

    // 保存投票记录
    function saveVoteHistory(history) {
        const allHistory = GM_getValue('voteHistory', {});
        allHistory[currentDomain] = history;
        GM_setValue('voteHistory', allHistory);
    }

    // 获取历史成功投票数
    function getSuccessfulVoteCount() {
        const history = getVoteHistory();
        return Object.values(history).filter(v => v === 'success').length;
    }

    // 记录成功的投票
    function recordSuccessfulVote(url) {
        const history = getVoteHistory();
        const id = extractIdFromUrl(url);
        history[id] = 'success';
        saveVoteHistory(history);
        updateHistoryCount();
    }

    // 从URL提取ID
    function extractIdFromUrl(url) {
        const match = url.match(/id=(\d+)/);
        return match ? match[1] : '未知ID';
    }

    // 显示自定义对话框
    function showDialog(message) {
        const dialog = document.createElement('div');
        dialog.className = 'vote-dialog';

        dialog.innerHTML = `
            <div class="vote-dialog-title">自动投票提示</div>
            <div class="vote-dialog-content">${message}</div>
            <button class="vote-dialog-button">确定</button>
        `;

        document.body.appendChild(dialog);

        dialog.querySelector('.vote-dialog-button').addEventListener('click', function() {
            document.body.removeChild(dialog);
        });
    }

    function createControlButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'voteToggleButton';
        toggleButton.textContent = '⚖️';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '9999';
        // 应用透明度到主按钮
        toggleButton.style.backgroundColor = `rgba(51, 51, 51, ${config.panelOpacity})`;
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        toggleButton.style.fontFamily = 'Arial, sans-serif';
        toggleButton.style.border = '1px solid #555';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '16px';

        document.body.appendChild(toggleButton);

        const panel = document.createElement('div');
        panel.id = 'autoVotePanel';
        panel.style.position = 'fixed';
        panel.style.top = '40px';
        panel.style.right = '10px';
        panel.style.zIndex = '9998';
        // 应用透明度到主面板
        panel.style.backgroundColor = `rgba(51, 51, 51, ${config.panelOpacity})`;
        panel.style.padding = '8px';
        panel.style.borderRadius = '4px';
        panel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.width = '200px';
        panel.style.border = '1px solid #555';
        panel.style.display = 'none';

        const title = document.createElement('div');
        title.textContent = '自动投票控制';
        title.style.margin = '0 0 8px 0';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '13px';
        title.style.color = '#fff';

        // 历史投票数显示
        const historyCountText = document.createElement('div');
        historyCountText.id = 'historyVoteCount';
        historyCountText.style.margin = '0 0 8px 0';
        historyCountText.style.fontSize = '12px';
        historyCountText.style.color = '#fff';

        // 进度显示区域
        const progressContainer = document.createElement('div');
        progressContainer.style.marginBottom = '8px';

        const progressText = document.createElement('div');
        progressText.id = 'voteProgress';
        progressText.style.fontSize = '12px';
        progressText.style.color = '#fff';
        progressText.style.marginBottom = '4px';

        const progressBar = document.createElement('div');
        progressBar.id = 'voteProgressBar';
        progressBar.style.width = '100%';
        progressBar.style.height = '8px';
        progressBar.style.backgroundColor = '#555';
        progressBar.style.borderRadius = '4px';
        progressBar.style.overflow = 'hidden';

        const progressBarFill = document.createElement('div');
        progressBarFill.id = 'voteProgressBarFill';
        progressBarFill.style.height = '100%';
        progressBarFill.style.width = '0%';
        progressBarFill.style.backgroundColor = '#4CAF50';
        progressBarFill.style.transition = 'width 0.3s ease';

        progressBar.appendChild(progressBarFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);

        const currentIdText = document.createElement('div');
        currentIdText.id = 'currentVoteId';
        currentIdText.style.margin = '0 0 8px 0';
        currentIdText.style.fontSize = '12px';
        currentIdText.style.color = '#ddd';
        currentIdText.textContent = '当前ID: -';

        const statsText = document.createElement('div');
        statsText.id = 'voteStats';
        statsText.style.margin = '0 0 8px 0';
        statsText.style.fontSize = '12px';
        statsText.style.color = '#aaa';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = config.buttonSpacing;

        const actionButton = document.createElement('button');
        actionButton.id = 'voteActionButton';
        actionButton.textContent = '开始';
        actionButton.style.padding = '4px 8px';
        actionButton.style.backgroundColor = '#4CAF50';
        actionButton.style.color = 'white';
        actionButton.style.border = 'none';
        actionButton.style.borderRadius = '3px';
        actionButton.style.cursor = 'pointer';
        actionButton.style.fontSize = '12px';
        actionButton.style.width = '100%';

        const settingsButton = document.createElement('button');
        settingsButton.textContent = '设置';
        // 统一按钮风格，和 “开始” 按钮大小一致
        settingsButton.style.padding = '4px 8px';
        settingsButton.style.backgroundColor = config.panelBgColor;
        settingsButton.style.color = 'white';
        settingsButton.style.border = '1px solid #555';
        settingsButton.style.borderRadius = '3px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.fontSize = '12px';
        settingsButton.style.width = '100%';
        settingsButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        settingsButton.style.border = '1px solid #555';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.fontSize = '12px';
        settingsButton.style.width = '100%';

        buttonContainer.appendChild(actionButton);
        buttonContainer.appendChild(settingsButton);

        panel.appendChild(title);
        panel.appendChild(historyCountText);
        panel.appendChild(progressContainer);
        panel.appendChild(currentIdText);
        panel.appendChild(statsText);
        panel.appendChild(buttonContainer);
        document.body.appendChild(panel);

        updateHistoryCount();
        updateProgress(0, 0, 0);
        updateStats(0, 0, 0);

        toggleButton.addEventListener('click', function() {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        actionButton.addEventListener('click', function() {
            if (actionButton.textContent === '开始') {
                startAutoVote();
                actionButton.textContent = '停止';
                actionButton.style.backgroundColor = '#f44336';
            } else {
                stopAutoVote();
                actionButton.textContent = '开始';
                actionButton.style.backgroundColor = '#4CAF50';
            }
        });

        settingsButton.addEventListener('click', showSettings);
    }

    // 更新历史成功投票数显示
    function updateHistoryCount() {
        const count = getSuccessfulVoteCount();
        const historyCountText = document.getElementById('historyVoteCount');
        if (historyCountText) {
            // 修改显示文本
            historyCountText.innerHTML = `本站历史投票<span style="color:#4CAF50">${count}</span>个`;
        }
    }

    function updateProgress(current, total, allVoteLinksCount) {
        const progressText = document.getElementById('voteProgress');
        const progressBarFill = document.getElementById('voteProgressBarFill');

        if (progressText && progressBarFill) {
            const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
            progressText.innerHTML = `进度: ${current}/${total} <span style="color:#4CAF50">(总:${allVoteLinksCount})</span>`;
            progressBarFill.style.width = `${percentage}%`;
        }
    }

    function updateCurrentId(id) {
        const currentIdText = document.getElementById('currentVoteId');
        if (currentIdText) {
            currentIdText.textContent = `当前ID: ${id}`;
        }
    }

    function updateStats(success, failed, skipped) {
        const statsText = document.getElementById('voteStats');
        if (statsText) {
            statsText.innerHTML = `
                <div>成功: <span style="color:#4CAF50">${success}</span></div>
                <div>超时: <span style="color:#f44336">${failed}</span></div>
                <div>跳过: <span style="color:#FF9800">${skipped}</span></div>
            `;
        }
    }

    function getVoteLinks() {
        const history = getVoteHistory();
        const allLinks = Array.from(document.querySelectorAll('a[href*="vote=yeah"]')).filter(link => {
            return link.href && !link.href.includes('#') && link.href !== window.location.href;
        });

        const allVoteLinksCount = allLinks.length;
        const votedLinks = [];
        const unvotedLinks = [];

        allLinks.forEach(link => {
            const id = extractIdFromUrl(link.href);
            if (history[id] === 'success') {
                votedLinks.push(link);
            } else {
                unvotedLinks.push(link);
            }
        });

        return {
            unvoted: unvotedLinks,
            skipped: votedLinks.length,
            allCount: allVoteLinksCount
        };
    }

    let isRunning = false;
    let currentIndex = 0;
    let voteLinks = [];
    let totalLinks = 0;
    let allVoteLinksCount = 0;
    let stats = {success: 0, failed: 0, skipped: 0};

    function startAutoVote() {
        if (isRunning) return;

        const {unvoted, skipped, allCount} = getVoteLinks();
        voteLinks = unvoted;
        totalLinks = voteLinks.length;
        allVoteLinksCount = allCount;
        stats.skipped = skipped;

        if (voteLinks.length === 0) {
            showDialog('当前页面没有可投票的项目！');
            updateProgress(0, 0, allVoteLinksCount);
            return;
        }

        isRunning = true;
        currentIndex = 0;
        stats.success = 0;
        stats.failed = 0;
        updateProgress(0, totalLinks, allVoteLinksCount);
        updateStats(0, 0, stats.skipped);
        clickNextLink();
    }

    let currentRequest = null;

    function clickNextLink() {
        if (!isRunning || currentIndex >= totalLinks) {
            isRunning = false;
            const actionButton = document.getElementById('voteActionButton');
            if (actionButton) {
                actionButton.textContent = '开始';
                actionButton.style.backgroundColor = '#4CAF50';
            }
            return;
        }

        updateProgress(currentIndex, totalLinks, allVoteLinksCount);
        const currentLink = voteLinks[currentIndex].href;
        const currentId = extractIdFromUrl(currentLink);
        updateCurrentId(currentId);

        const request = GM_xmlhttpRequest({
            method: "GET",
            url: currentLink,
            timeout: config.timeout,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    recordSuccessfulVote(currentLink);
                    stats.success++;
                } else {
                    stats.failed++;
                }

                updateStats(stats.success, stats.failed, stats.skipped);
                currentIndex++;
                setTimeout(clickNextLink, config.defaultDelay);
            },
            onerror: function(response) {
                stats.failed++;
                updateStats(stats.success, stats.failed, stats.skipped);
                currentIndex++;
                setTimeout(clickNextLink, config.defaultDelay);
            },
            ontimeout: function(response) {
                stats.failed++;
                updateStats(stats.success, stats.failed, stats.skipped);
                currentIndex++;
                setTimeout(clickNextLink, config.defaultDelay);
            }
        });
    }

    function stopAutoVote() {
        isRunning = false;
        if (currentRequest) {
            currentRequest.abort();
            currentRequest = null;
        }
    }

    // 在脚本开头加载配置，使用当前域名存储配置
    const savedConfig = GM_getValue(`config_${currentDomain}`);
    if (savedConfig) {
        Object.assign(config, savedConfig);
    }

    function showSettings() {
        const dialog = document.createElement('div');
        dialog.className = 'vote-dialog';
        // 应用透明度到设置面板
        const dialogBgColor = `rgba(68, 68, 68, ${config.panelOpacity})`;
        dialog.style.backgroundColor = dialogBgColor;

        dialog.innerHTML = `
            <div class="vote-dialog-title">参数设置</div>
            <div class="vote-dialog-content">
                <div style="margin-bottom:10px;">
                    <label style="display:block; margin-bottom:5px; font-size:12px; color:#ccc;">请求间隔(ms):</label>
                    <input type="number" id="delayInput" value="${config.defaultDelay}" style="width:100%; padding:5px; background:#555; color:#fff; border:1px solid #666;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block; margin-bottom:5px; font-size:12px; color:#ccc;">超时时间(ms):</label>
                    <input type="number" id="timeoutInput" value="${config.timeout}" style="width:100%; padding:5px; background:#555; color:#fff; border:1px solid #666;">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block; margin-bottom:5px; font-size:12px; color:#ccc;">面板透明度(0-1):</label>
                    <input type="number" id="opacityInput" value="${config.panelOpacity}" step="0.1" min="0" max="1" style="width:100%; padding:5px; background:#555; color:#fff; border:1px solid #666;">
                </div>
            </div>
            <div class="button-container" style="display: flex; gap: ${config.buttonSpacing}; margin-bottom: ${config.buttonSpacing};">
                <button id="resetConfig" class="vote-dialog-button" style="flex: 1; padding: 4px 8px; background-color:#FF9800; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">重置配置</button>
                <button id="resetHistory" class="vote-dialog-button" style="flex: 1; padding: 4px 8px; background-color:#f44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">重置历史统计</button>
            </div>
            <div class="button-container" style="display: flex; gap: ${config.buttonSpacing};">
                <button id="saveSettings" class="vote-dialog-button" style="flex: 1; padding: 4px 8px; background-color:#4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">保存</button>
                <button id="cancelSettings" class="vote-dialog-button" style="flex: 1; padding: 4px 8px; background-color:#f44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">取消</button>
            </div>
        `;

        document.body.appendChild(dialog);

        document.getElementById('saveSettings').addEventListener('click', function() {
            config.defaultDelay = parseInt(document.getElementById('delayInput').value) || config.defaultDelay;
            config.timeout = parseInt(document.getElementById('timeoutInput').value) || config.timeout;
            config.panelOpacity = parseFloat(document.getElementById('opacityInput').value) || config.panelOpacity;
            GM_setValue(`config_${currentDomain}`, config);

            // 更新主面板透明度
            const panel = document.getElementById('autoVotePanel');
            if (panel) {
                panel.style.backgroundColor = `rgba(51, 51, 51, ${config.panelOpacity})`;
            }

            // 更新设置面板透明度
            dialog.style.backgroundColor = `rgba(68, 68, 68, ${config.panelOpacity})`;

            document.body.removeChild(dialog);
        });

        document.getElementById('resetConfig').addEventListener('click', function() {
            // 修复：默认配置包含透明度
            const defaultConfig = {
                defaultDelay: 1000,
                timeout: 2500,
                panelBgColor: '#333',
                buttonSpacing: '5px',
                panelOpacity: 0.9 // 默认透明度改为 90%
            };
            Object.assign(config, defaultConfig);
            GM_setValue(`config_${currentDomain}`, config);

            // 更新输入框值
            document.getElementById('delayInput').value = config.defaultDelay;
            document.getElementById('timeoutInput').value = config.timeout;
            document.getElementById('opacityInput').value = config.panelOpacity;  // 新增：更新透明度输入框

            // 新增：重置面板透明度
            const panel = document.getElementById('autoVotePanel');
            if (panel) {
                panel.style.backgroundColor = `rgba(51, 51, 51, ${config.panelOpacity})`;
            }
        });

        document.getElementById('resetHistory').addEventListener('click', function() {
            // 清除当前网站的投票历史记录
            const allHistory = GM_getValue('voteHistory', {});
            allHistory[currentDomain] = {};
            GM_setValue('voteHistory', allHistory);
            // 更新历史投票数显示
            updateHistoryCount();
        });

        document.getElementById('cancelSettings').addEventListener('click', function() {
            document.body.removeChild(dialog);
        });
    }

    createControlButton();
})();