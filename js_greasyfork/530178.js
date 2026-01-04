// ==UserScript==
// @name         PT种子认领管理助手
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  提供种子认领管理功能，包括悬浮窗显示总体积、检查当月种子并一键放弃不达标种子等功能
// @author       AI Assistant
// @match        */claim.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530178/PT%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530178/PT%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量存储状态
    let totalSize = 0;
    let abandonedCount = 0;
    let abandonedSize = 0;
    let nonCompletableTorrents = [];
    let zeroSeedTimeTorrents = [];
    let processingTorrent = false;
    let autoConfirmDialogs = false;
    let lastUrl = window.location.href; // 记录当前URL用于检测变化
    let panelInitialized = false; // 标记悬浮窗是否已初始化

    // 创建存储对象用于保存数据
    const storageKey = 'PT_SEED_MANAGER_DATA';
    const pendingKey = 'PT_PENDING_ABANDONS';
    const sessionStatsKey = 'PT_SESSION_STATS';
    const processingKey = 'PT_PROCESSING_ACTIVE';
    let savedData = loadData();

    // 页面加载完成后初始化
    window.addEventListener('load', init);

    // 定期检查悬浮窗是否存在，如果不存在则重新创建
    setInterval(checkPanelExists, 1000);

    // 监听URL变化
    setInterval(checkUrlChange, 500);

    // 检查URL变化，用于处理翻页
    function checkUrlChange() {
        if (lastUrl !== window.location.href) {
            console.log('URL已变化，重新初始化面板');
            lastUrl = window.location.href;
            // 清除面板初始化标记
            panelInitialized = false;
            // 延迟一下确保DOM已加载
            setTimeout(initOrUpdatePanel, 800);
        }
    }

    // 检查面板是否存在
    function checkPanelExists() {
        if (!document.getElementById('cyberPanel') && document.readyState === 'complete') {
            console.log('未找到面板，重新初始化');
            initOrUpdatePanel();
        }
    }

    // 初始化或更新面板
    function initOrUpdatePanel() {
        // 如果已有面板，移除它
        const existingPanel = document.getElementById('cyberPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // 重新初始化
        init();
    }

    // 监听分页按钮点击
    function setupPaginationListeners() {
        const paginationLinks = document.querySelectorAll('.nexus-pagination a');
        if (paginationLinks.length > 0) {
            paginationLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // 标记面板需要重新初始化
                    panelInitialized = false;
                });
            });
        }
    }

    function init() {
        if (panelInitialized) return;

        // 获取当前日期并计算本月剩余天数
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const remainingDays = lastDayOfMonth.getDate() - today.getDate() + 1; // 包括今天

        // 创建悬浮窗
        createFloatingPanel(remainingDays);

        // 分析页面中的种子数据
        analyzeTorrents();

        // 监视页面变化，查找确认对话框
        setupDialogObserver();

        // 检查是否有未完成的放弃操作
        checkPendingAbandons();

        // 设置分页监听器
        setupPaginationListeners();

        panelInitialized = true;
    }

    function createFloatingPanel(remainingDays) {
        const panel = document.createElement('div');
        panel.id = 'cyberPanel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 300px;
            background-color: rgba(0, 0, 0, 0.8);
            border: 1px solid #00FF88;
            border-radius: 10px;
            padding: 15px;
            color: white;
            font-family: 'Courier New', monospace;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        `;

        // 获取会话统计信息
        const sessionStats = JSON.parse(localStorage.getItem(sessionStatsKey) || '{"count":0,"size":0,"total":0}');

        // 添加标题和内容
        panel.innerHTML = `
            <h2 style="color:#00FF88;margin:0 0 15px">种子认领管理</h2>
            <div id="totalSize">当前页总做种体积: 计算中...</div>
            <div id="abandonedStats">总计已放弃: ${savedData.abandonedCount || 0}个种子 (${formatSize(savedData.abandonedSize || 0)})</div>
            <div id="remainingDays">本月剩余天数: ${remainingDays}天</div>
            <button class="control-btn" id="mainSwitch" style="margin-top:10px;background:#22aa22;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">
                启动系统
            </button>
            <div style="margin-top:15px">
                <label style="display:block;margin:10px 0">
                    <input type="checkbox" id="abandonZeroSeed" ${savedData.abandonZeroSeed ? 'checked' : ''}>
                    删除0天做种种子
                </label>
                <label style="display:block;margin:10px 0">
                    <input type="checkbox" id="abandonNonCompletable" ${savedData.abandonNonCompletable ? 'checked' : ''}>
                    删除本月不达标种子
                </label>
                <label style="display:block;margin:10px 0">
                    <input type="checkbox" id="processNewTorrents" ${savedData.processNewTorrents ? 'checked' : ''}>
                    自动处理新发现的不达标种子
                </label>
                <label style="display:block;margin:10px 0">
                    <input type="checkbox" id="debugMode" ${savedData.debugMode ? 'checked' : ''}>
                    调试模式
                </label>
            </div>
            <div id="processingStats" style="margin-top:10px;display:${sessionStats.total > 0 ? 'block' : 'none'};">
                <div>处理进度: <span id="progressCount">${sessionStats.count}</span>/<span id="totalCount">${sessionStats.total}</span></div>
                <div>已放弃: <span id="currentAbandoned">${sessionStats.count}</span> 个种子</div>
                <div>已放弃体积: <span id="currentAbandonedSize">${formatSize(sessionStats.size)}</span></div>
                <button id="stopProcessing" style="margin-top:5px;background:#cc0000;color:white;border:none;padding:3px 8px;border-radius:3px;cursor:pointer;">
                    停止处理
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加按钮点击事件
        document.getElementById('mainSwitch').addEventListener('click', toggleSystem);
        document.getElementById('abandonZeroSeed').addEventListener('change', saveSettings);
        document.getElementById('abandonNonCompletable').addEventListener('change', saveSettings);
        document.getElementById('processNewTorrents').addEventListener('change', saveSettings);

        // 停止处理按钮事件
        const stopButton = document.getElementById('stopProcessing');
        if (stopButton) {
            stopButton.addEventListener('click', function() {
                localStorage.removeItem(pendingKey);
                localStorage.removeItem(sessionStatsKey);
                localStorage.removeItem(processingKey);
                document.getElementById('processingStats').style.display = 'none';
                alert('已停止处理队列');
            });
        }

        // 调试模式按钮
        document.getElementById('debugMode').addEventListener('change', function() {
            saveSettings();
            if (this.checked) {
                console.log('调试模式已启用');
                console.log(`总种子数: ${document.querySelectorAll('#claim-table tr:not(:first-child)').length}`);
                console.log(`0天做种种子数: ${zeroSeedTimeTorrents.length}`);
                console.log(`不达标种子数: ${nonCompletableTorrents.length}`);
                console.log(`总做种体积: ${formatSize(totalSize)}`);
                console.log('待处理队列:', JSON.parse(localStorage.getItem(pendingKey) || '[]'));
            }
        });

        // 恢复之前的状态
        if (savedData.systemActive) {
            document.getElementById('mainSwitch').click();
        }
    }

    function toggleSystem() {
        const mainSwitch = document.getElementById('mainSwitch');

        if (mainSwitch.textContent.trim() === '启动系统') {
            // 启动系统
            mainSwitch.textContent = '系统运行中';
            mainSwitch.style.backgroundColor = '#aa2222';
            analyzeTorrents(); // 重新分析并标记

            // 添加"一键放弃"按钮
            let abandonButton = document.getElementById('abandonButton');
            if (!abandonButton) {
                abandonButton = document.createElement('button');
                abandonButton.id = 'abandonButton';
                abandonButton.className = 'control-btn';
                abandonButton.textContent = '一键放弃选定种子';
                abandonButton.style.cssText = 'margin-top:10px;background:#880000;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;';
                abandonButton.addEventListener('click', abandonSelectedTorrents);
                mainSwitch.parentNode.insertBefore(abandonButton, mainSwitch.nextSibling);
            } else {
                abandonButton.style.display = 'block';
            }
        } else {
            // 关闭系统
            mainSwitch.textContent = '启动系统';
            mainSwitch.style.backgroundColor = '#22aa22';
            resetTorrentHighlights();

            // 隐藏放弃按钮
            const abandonButton = document.getElementById('abandonButton');
            if (abandonButton) {
                abandonButton.style.display = 'none';
            }
        }

        saveSettings();
    }

    function saveSettings() {
        savedData = {
            systemActive: document.getElementById('mainSwitch').textContent.trim() === '系统运行中',
            abandonZeroSeed: document.getElementById('abandonZeroSeed').checked,
            abandonNonCompletable: document.getElementById('abandonNonCompletable').checked,
            processNewTorrents: document.getElementById('processNewTorrents').checked,
            debugMode: document.getElementById('debugMode').checked,
            abandonedCount: abandonedCount,
            abandonedSize: abandonedSize
        };

        localStorage.setItem(storageKey, JSON.stringify(savedData));

        // 如果系统处于活动状态，更新高亮显示和按钮状态
        if (savedData.systemActive) {
            analyzeTorrents(); // 重新分析并标记

            // 确保放弃按钮存在
            const abandonButton = document.getElementById('abandonButton');
            if (!abandonButton) {
                const mainSwitch = document.getElementById('mainSwitch');
                const newButton = document.createElement('button');
                newButton.id = 'abandonButton';
                newButton.className = 'control-btn';
                newButton.textContent = '一键放弃选定种子';
                newButton.style.cssText = 'margin-top:10px;background:#880000;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;';
                newButton.addEventListener('click', abandonSelectedTorrents);
                mainSwitch.parentNode.insertBefore(newButton, mainSwitch.nextSibling);
            } else {
                abandonButton.style.display = 'block';
            }
        }
    }

    function loadData() {
        try {
            const data = localStorage.getItem(storageKey);
            if (data) {
                const parsedData = JSON.parse(data);
                // 恢复保存的统计数据
                abandonedCount = parsedData.abandonedCount || 0;
                abandonedSize = parsedData.abandonedSize || 0;
                return parsedData;
            }
            return {};
        } catch (e) {
            console.error('加载存储数据时出错:', e);
            return {};
        }
    }

    // 修复: 重新计算剩余天数，并改进判定逻辑
    function analyzeTorrents() {
        // 重新计算剩余天数，避免使用旧值
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const remainingDays = lastDayOfMonth.getDate() - today.getDate() + 1; // 包括今天

        const torrentRows = document.querySelectorAll('#claim-table tr:not(:first-child)');
        totalSize = 0;
        nonCompletableTorrents = [];
        zeroSeedTimeTorrents = [];

        const debugMode = document.getElementById('debugMode')?.checked;

        if (debugMode) {
            console.log(`当前日期: ${today.toLocaleDateString()}, 本月剩余天数: ${remainingDays}天`);
        }

        torrentRows.forEach((row, index) => {
            // 提取种子信息
            const removeButton = row.querySelector('button[data-action="removeClaim"]');
            if (!removeButton) return;  // 跳过没有放弃按钮的行

            const claimId = removeButton.getAttribute('data-claim_id');
            const torrentId = removeButton.getAttribute('data-torrent_id');
            const torrentName = row.querySelectorAll('td')[2].textContent.trim();
            const sizeText = row.querySelectorAll('td')[3].textContent.trim();
            const seedTimeText = row.querySelectorAll('td')[7].textContent.trim();
            const isCompletedCell = row.querySelectorAll('td')[9];
            const isCompleted = isCompletedCell.textContent.trim();

            // 计算总体积
            const sizeValue = parseSize(sizeText);
            totalSize += sizeValue;

            // 分析种子是否能完成做种要求
            const seedTimeDays = parseSeedTime(seedTimeText);

            // 修复: 直接使用页面显示的达标状态，不再自己计算
            // 如果页面显示"Yes"则认为达标，如果显示"No"则判断是否可能达标
            const canComplete = isCompleted === 'Yes' || (seedTimeDays > 0 && seedTimeDays + remainingDays >= 14);

            if (debugMode) {
                console.log(`种子 #${index + 1}: ${torrentName}`);
                console.log(`  做种时间: ${seedTimeText} (${seedTimeDays.toFixed(2)}天)`);
                console.log(`  页面显示是否达标: ${isCompleted}`);
                console.log(`  计算结果: 做种时间 ${seedTimeDays.toFixed(2)} + 剩余天数 ${remainingDays} = ${(seedTimeDays + remainingDays).toFixed(2)} 天`);
                console.log(`  判定结果: ${canComplete ? '达标(绿色)' : '不达标(红色)'}`);
            }

            // 直接修改"本月是否达标"列的颜色
            if (document.getElementById('mainSwitch').textContent.trim() === '系统运行中') {
                isCompletedCell.style.backgroundColor = canComplete ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
            } else {
                isCompletedCell.style.backgroundColor = '';
            }

            // 保存不能完成的种子信息
            if (!canComplete) {
                const torrentInfo = {
                    row: row,
                    claimId: claimId,
                    torrentId: torrentId,
                    torrentName: torrentName,
                    size: sizeValue,
                    sizeText: sizeText,
                    seedTimeDays: seedTimeDays
                };

                nonCompletableTorrents.push(torrentInfo);

                // 特别标记0天做种的种子
                if (seedTimeDays === 0) {
                    zeroSeedTimeTorrents.push(torrentInfo);
                }
            }
        });

        // 更新悬浮窗信息
        document.getElementById('totalSize').textContent = `总做种体积: ${formatSize(totalSize)}`;

        // 如果启用了调试模式，则显示更多信息
        if (debugMode) {
            console.log(`总种子数: ${torrentRows.length}`);
            console.log(`0天做种种子数: ${zeroSeedTimeTorrents.length}`);
            console.log(`不达标种子数: ${nonCompletableTorrents.length}`);
            console.log(`总做种体积: ${formatSize(totalSize)}`);
        }
    }

    function resetTorrentHighlights() {
        const torrentRows = document.querySelectorAll('#claim-table tr:not(:first-child)');
        torrentRows.forEach(row => {
            // 清除所有本月达标列的背景色
            const isCompletedCell = row.querySelectorAll('td')[9];
            if (isCompletedCell) {
                isCompletedCell.style.backgroundColor = '';
            }
        });
    }

    function abandonSelectedTorrents() {
        // 检查选项
        const abandonZeroSeed = document.getElementById('abandonZeroSeed').checked;
        const abandonNonCompletable = document.getElementById('abandonNonCompletable').checked;

        // 至少选择一个选项
        if (!abandonZeroSeed && !abandonNonCompletable) {
            alert('请至少选择一个放弃选项（删除0天做种种子或删除本月不达标种子）');
            return;
        }

        // 确定要放弃的种子列表
        let torrentsToAbandon = [];

        if (abandonZeroSeed) {
            torrentsToAbandon = torrentsToAbandon.concat(zeroSeedTimeTorrents);
        }

        if (abandonNonCompletable) {
            // 如果已经包含了0天种子，需要过滤掉重复的
            const nonZeroNonCompletable = nonCompletableTorrents.filter(torrent =>
                torrent.seedTimeDays > 0 || !abandonZeroSeed
            );
            torrentsToAbandon = torrentsToAbandon.concat(nonZeroNonCompletable);
        }

        // 去除重复项
        const uniqueTorrents = [];
        const seen = new Set();

        torrentsToAbandon.forEach(torrent => {
            if (!seen.has(torrent.claimId)) {
                seen.add(torrent.claimId);
                uniqueTorrents.push(torrent);
            }
        });

        torrentsToAbandon = uniqueTorrents;

        if (torrentsToAbandon.length === 0) {
            alert('没有需要放弃的种子');
            return;
        }

        // 检查是否已有处理队列
        if (localStorage.getItem(pendingKey)) {
            if (!confirm('已有正在处理的队列，是否重新开始？')) {
                return;
            }
        }

        if (!confirm(`确定要放弃 ${torrentsToAbandon.length} 个种子吗？`)) {
            return;
        }

        // 将种子信息保存到队列
        const pendingList = torrentsToAbandon.map(t => ({
            claimId: t.claimId,
            torrentId: t.torrentId,
            size: t.size,
            name: t.torrentName
        }));

        // 保存队列到localStorage
        localStorage.setItem(pendingKey, JSON.stringify(pendingList));
        localStorage.setItem(processingKey, 'true');

        // 初始化会话统计数据
        localStorage.setItem(sessionStatsKey, JSON.stringify({
            count: 0,
            size: 0,
            total: pendingList.length
        }));

        // 显示处理统计面板
        const processingStats = document.getElementById('processingStats');
        processingStats.style.display = 'block';
        document.getElementById('totalCount').textContent = pendingList.length;
        document.getElementById('progressCount').textContent = '0';
        document.getElementById('currentAbandoned').textContent = '0';
        document.getElementById('currentAbandonedSize').textContent = '0 B';

        // 开始处理第一个种子
        processNextTorrent();
    }

    // 检查是否有未完成的放弃操作
    function checkPendingAbandons() {
        const pendingList = JSON.parse(localStorage.getItem(pendingKey) || '[]');
        const isProcessing = localStorage.getItem(processingKey) === 'true';

        if (pendingList.length > 0 && isProcessing) {
            // 如果有待处理的种子，继续处理
            const stats = JSON.parse(localStorage.getItem(sessionStatsKey) || '{"count":0,"size":0,"total":0}');

            // 更新统计显示
            document.getElementById('processingStats').style.display = 'block';
            document.getElementById('totalCount').textContent = stats.total;
            document.getElementById('progressCount').textContent = stats.count;
            document.getElementById('currentAbandoned').textContent = stats.count;
            document.getElementById('currentAbandonedSize').textContent = formatSize(stats.size);

            // 延迟一会再处理，确保页面完全加载
            setTimeout(processNextTorrent, 1000);
        } else if (pendingList.length === 0 && isProcessing) {
            // 队列为空但仍处于处理状态，说明刚刚完成
            finishAbandonProcess();

            // 检查是否需要自动处理新种子
            checkForNewTorrents();
        } else {
            // 隐藏处理统计面板
            const processingStats = document.getElementById('processingStats');
            if (processingStats) {
                processingStats.style.display = 'none';
            }
        }
    }

    // 处理队列中的下一个种子
    function processNextTorrent() {
        // 获取待处理队列
        const pendingList = JSON.parse(localStorage.getItem(pendingKey) || '[]');

        if (pendingList.length === 0) {
            // 所有种子处理完成
            finishAbandonProcess();
            return;
        }

        // 取出第一个种子
        const torrent = pendingList[0];

        // 在页面上查找对应的放弃按钮
        const abandonButton = document.querySelector(`button[data-action="removeClaim"][data-claim_id="${torrent.claimId}"]`);

        if (!abandonButton) {
            // 如果找不到按钮，可能已经处理过，移到下一个
            pendingList.shift();
            localStorage.setItem(pendingKey, JSON.stringify(pendingList));
            processNextTorrent();
            return;
        }

        // 在调试模式下记录
        if (document.getElementById('debugMode')?.checked) {
            console.log(`准备放弃种子: ${torrent.name} (${formatSize(torrent.size)})`);
            console.log('放弃按钮:', abandonButton);
        }

        // 设置自动确认对话框
        autoConfirmDialogs = true;

        // 统计放弃信息
        abandonedCount++;
        abandonedSize += torrent.size;

        // 更新全局统计信息
        document.getElementById('abandonedStats').textContent =
            `已放弃: ${abandonedCount}个种子 (${formatSize(abandonedSize)})`;

        // 保存全局统计
        saveSettings();

        // 更新会话统计信息
        const sessionStats = JSON.parse(localStorage.getItem(sessionStatsKey) || '{"count":0,"size":0,"total":0}');
        sessionStats.count++;
        sessionStats.size += torrent.size;
        localStorage.setItem(sessionStatsKey, JSON.stringify(sessionStats));

        // 更新处理进度显示
        document.getElementById('progressCount').textContent = sessionStats.count;
        document.getElementById('currentAbandoned').textContent = sessionStats.count;
        document.getElementById('currentAbandonedSize').textContent = formatSize(sessionStats.size);

        // 移除该种子从待处理列表
        pendingList.shift();
        localStorage.setItem(pendingKey, JSON.stringify(pendingList));

        // 点击放弃按钮 (页面将在确认后刷新)
        abandonButton.click();
    }

    function finishAbandonProcess() {
        // 清除处理队列
        localStorage.removeItem(pendingKey);
        localStorage.removeItem(sessionStatsKey);
        localStorage.removeItem(processingKey);

        // 隐藏处理统计面板
        const processingStats = document.getElementById('processingStats');
        if (processingStats) {
            processingStats.style.display = 'none';
        }

        autoConfirmDialogs = false;

        // 重新分析页面
        analyzeTorrents();

        // 提示完成
        alert('所有种子放弃操作已完成！');

        // 检查是否需要自动处理新种子
        checkForNewTorrents();
    }

    // 检查并处理新发现的不达标种子
    function checkForNewTorrents() {
        // 检查是否启用了自动处理新种子选项
        const processNewTorrents = document.getElementById('processNewTorrents')?.checked;
        if (!processNewTorrents) return;

        // 检查系统是否处于活动状态
        const systemActive = document.getElementById('mainSwitch').textContent.trim() === '系统运行中';
        if (!systemActive) return;

        // 分析当前页面上的种子
        analyzeTorrents();

        // 获取选项设置
        const abandonZeroSeed = document.getElementById('abandonZeroSeed').checked;
        const abandonNonCompletable = document.getElementById('abandonNonCompletable').checked;

        // 准备新的放弃队列
        let newTorrentsToAbandon = [];

        if (abandonZeroSeed) {
            newTorrentsToAbandon = newTorrentsToAbandon.concat(zeroSeedTimeTorrents);
        }

        if (abandonNonCompletable) {
            const nonZeroNonCompletable = nonCompletableTorrents.filter(torrent =>
                torrent.seedTimeDays > 0 || !abandonZeroSeed
            );
            newTorrentsToAbandon = newTorrentsToAbandon.concat(nonZeroNonCompletable);
        }

        // 去除重复项
        const uniqueTorrents = [];
        const seen = new Set();

        newTorrentsToAbandon.forEach(torrent => {
            if (!seen.has(torrent.claimId)) {
                seen.add(torrent.claimId);
                uniqueTorrents.push(torrent);
            }
        });

        if (uniqueTorrents.length > 0) {
            // 如果找到新的不达标种子，询问是否自动处理
            if (confirm(`发现 ${uniqueTorrents.length} 个新的不达标种子，是否自动处理？`)) {
                // 将种子信息保存到队列
                const pendingList = uniqueTorrents.map(t => ({
                    claimId: t.claimId,
                    torrentId: t.torrentId,
                    size: t.size,
                    name: t.torrentName
                }));

                // 保存队列到localStorage
                localStorage.setItem(pendingKey, JSON.stringify(pendingList));
                localStorage.setItem(processingKey, 'true');

                // 初始化会话统计数据
                localStorage.setItem(sessionStatsKey, JSON.stringify({
                    count: 0,
                    size: 0,
                    total: pendingList.length
                }));

                // 显示处理统计面板
                const processingStats = document.getElementById('processingStats');
                processingStats.style.display = 'block';
                document.getElementById('totalCount').textContent = pendingList.length;
                document.getElementById('progressCount').textContent = '0';
                document.getElementById('currentAbandoned').textContent = '0';
                document.getElementById('currentAbandonedSize').textContent = '0 B';

                // 开始处理第一个种子
                setTimeout(processNextTorrent, 1000);
            }
        }
    }

    // 设置监听器来处理确认对话框
    function setupDialogObserver() {
        // 创建一个观察器来监听DOM变化
        const observer = new MutationObserver((mutations) => {
            if (!autoConfirmDialogs) return;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 查找可能的确认对话框
                            const dialogButton = findConfirmButton(node);
                            if (dialogButton) {
                                // 在调试模式下记录
                                if (document.getElementById('debugMode')?.checked) {
                                    console.log('找到确认按钮，自动点击:', dialogButton);
                                }

                                // 点击确认按钮
                                setTimeout(() => {
                                    dialogButton.click();
                                }, 100);
                                return;
                            }
                        }
                    }
                }
            }
        });

        // 开始观察整个文档
        observer.observe(document.body, { childList: true, subtree: true });

        // 覆盖原生的confirm函数
        const originalConfirm = window.confirm;
        window.confirm = function(message) {
            if (autoConfirmDialogs && message.includes('确认要放弃认领')) {
                return true;
            }
            return originalConfirm.apply(this, arguments);
        };
    }

    // 查找确认按钮
    function findConfirmButton(container) {
        // 首先搜索container内的按钮
        const searchContainer = container || document;

        // 寻找包含特定文本的按钮，或者有特定ID/类的按钮
        const confirmKeys = ['确认', '确定', 'OK', '是', 'Yes'];

        // 查找按钮元素
        const buttons = Array.from(searchContainer.querySelectorAll('button, input[type="button"], .btn, .layui-layer-btn0'));

        // 找到符合条件的第一个按钮
        for (const key of confirmKeys) {
            const button = buttons.find(btn => {
                const text = btn.textContent || btn.value || '';
                return text.includes(key);
            });

            if (button) return button;
        }

        // 检查是否有layui的确认按钮
        const layuiBtn = searchContainer.querySelector('.layui-layer-btn0');
        if (layuiBtn) return layuiBtn;

        return null;
    }

    // 修复: 改进时间解析，考虑小时和分钟
    function parseSeedTime(timeText) {
        const timeRegex = /^(\d+)天(\d+):(\d+):(\d+)$/;
        const match = timeText.match(timeRegex);

        if (!match) {
            console.warn(`时间格式不匹配: "${timeText}"`);
            return 0;
        }

        const days = parseInt(match[1], 10);
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);

        // 考虑小时和分钟作为天的小数部分
        return days + (hours / 24) + (minutes / (24 * 60));
    }

    // 解析种子大小文本为字节数
    function parseSize(sizeText) {
        const sizeRegex = /^([\d.]+)\s+(KB|MB|GB|TB)$/;
        const match = sizeText.match(sizeRegex);

        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2];

        switch (unit) {
            case 'KB': return value * 1024;
            case 'MB': return value * 1024 * 1024;
            case 'GB': return value * 1024 * 1024 * 1024;
            case 'TB': return value * 1024 * 1024 * 1024 * 1024;
            default: return 0;
        }
    }

    // 格式化字节数为可读的大小文本
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        if (bytes < 1024 * 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
    }
})();
