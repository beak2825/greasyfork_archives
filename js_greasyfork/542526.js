// ==UserScript==
// @name         MWI Market List History
// @name:zh-CN   [银河奶牛]市场挂单记录
// @namespace    http://tampermonkey.net/
// @version      0.1.21
// @description  记录 Milky Way Idle 游戏的市场历史数据
// @description:zh-CN  记录 Milky Way Idle 游戏的市场历史数据
// @author       deirc
// @license      MIT
// @match        *www.milkywayidle.com/game*
// @downloadURL https://update.greasyfork.org/scripts/542526/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%B8%82%E5%9C%BA%E6%8C%82%E5%8D%95%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/542526/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%B8%82%E5%9C%BA%E6%8C%82%E5%8D%95%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'milkyway_market_history';
    let lastReadTime = 0; // 记录最后一次读取时间
    const READ_INTERVAL = 1000; // 读取间隔（1秒）
    // 新增：每个物品的自动读取时间戳
    const lastAutoReadMap = {};

    // 检查是否可以读取数据
    function canReadData() {
        const now = Date.now();
        if (now - lastReadTime >= READ_INTERVAL) {
            lastReadTime = now;
            return true;
        }
        return false;
    }

    // 保存数据到 IndexedDB
    async function saveData(data) {
        // data: { itemName: [record, ...], ... }
        // 先清空再批量写入
        await clearStore();
        const records = [];
        Object.keys(data).forEach(item => {
            data[item].forEach(record => {
                // 用item+timestamp作为唯一id
                records.push({
                    id: item + '|' + record.timestamp,
                    item,
                    ...record
                });
            });
        });
        await putAll(records);
        return true;
    }

    // 从 IndexedDB 读取数据
    async function loadData() {
        const all = await getAll();
        // 组装为 { itemName: [record, ...], ... }
        const result = {};
        for (const rec of all) {
            if (!result[rec.item]) result[rec.item] = [];
            // 去除id和item字段，保持与原结构一致
            const { id, item, ...rest } = rec;
            result[item].push(rest);
        }
        return result;
    }

    // 清理过期数据（异步）
    async function cleanupOldData(allHistory) {
        const retentionDays = parseInt(localStorage.getItem('market_history_retention') || '7');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        let changed = false;
        for (const item of Object.keys(allHistory)) {
            const before = allHistory[item].length;
            allHistory[item] = allHistory[item].filter(record => new Date(record.timestamp) > cutoffDate);
            if (allHistory[item].length === 0) {
                delete allHistory[item];
            }
            if (before !== (allHistory[item]?.length || 0)) changed = true;
        }
        if (changed) await saveData(allHistory);
        return allHistory;
    }

    // 清理自动保存的数据（异步）
    async function cleanupAutoData(allHistory) {
        let hasChanges = false;
        for (const item of Object.keys(allHistory)) {
            const before = allHistory[item].length;
            allHistory[item] = allHistory[item].filter(record => record.readType === 'manual');
            if (allHistory[item].length === 0) delete allHistory[item];
            if (before !== (allHistory[item]?.length || 0)) hasChanges = true;
        }
        if (hasChanges) await saveData(allHistory);
        return hasChanges;
    }

    // 删除指定天数前的手动保存数据（异步）
    async function cleanupManualDataBefore(days) {
        let allHistory = await loadData();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        let hasChanges = false;
        for (const item of Object.keys(allHistory)) {
            const before = allHistory[item].length;
            allHistory[item] = allHistory[item].filter(record => record.readType === 'auto' || new Date(record.timestamp) > cutoffDate);
            if (allHistory[item].length === 0) delete allHistory[item];
            if (before !== (allHistory[item]?.length || 0)) hasChanges = true;
        }
        if (hasChanges) await saveData(allHistory);
        return hasChanges;
    }

    // 等待页面加载完成
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // 获取物品名称
    function getItemName() {
        const itemIconSelector = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_infoContainer__2mCnh > div > div.Item_itemContainer__x7kH1 > div > div > div.Item_iconContainer__5z7j4 > svg";
        const itemIcon = document.querySelector(itemIconSelector);
        return itemIcon?.getAttribute('aria-label') || '未知物品';
    }

    // 获取物品名称（带强化等级）
    function getItemNameWithEnhance() {
        const baseName = getItemName();
        const enhanceEl = document.querySelector('div.MarketplacePanel_infoContainer__2mCnh > div > div.Item_itemContainer__x7kH1 > div > div > div.Item_enhancementLevel__19g-e');
        if (enhanceEl) {
            const txt = enhanceEl.textContent.trim();
            if (/^[+＋][0-9]+$/.test(txt)) {
                return baseName + txt;
            }
        }
        return baseName;
    }

    // 监视物品数量元素
    function watchItemCount() {
        const itemCountSelector = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_marketNavButtonContainer__2QI9I";
        const itemIconSelector = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_infoContainer__2mCnh > div > div.Item_itemContainer__x7kH1 > div > div > div.Item_iconContainer__5z7j4";
        const marketPanelSelector = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH";
        const orderBooksSelector = 'div.MarketplacePanel_orderBooksContainer__B4YE-';
        let isMarketOpen = false;
        let lastOrderBooks = null;
        let lastItemIcon = null;
        let lastOrderBooksVisible = false;

        // 新增：为市场导航第二个按钮添加点击事件
        function addMarketNavButtonListener() {
            const navContainer = document.querySelector(itemCountSelector);
            if (navContainer) {
                const btns = navContainer.querySelectorAll('button');
                btns.forEach(btn => {
                    if (!btn._mwi_market_listener) {
                        btn.addEventListener('click', () => {
                            const btnText = btn.textContent?.trim();
                            if (btnText === '刷新' || btnText === 'Refresh') {
                                setTimeout(() => {
                                    recordMarketData('manual', text('refreshSave'));
                                }, 500);
                            }
                        });
                        btn._mwi_market_listener = true;
                    }
                });
            }
        }

        const observer = new MutationObserver((mutations, obs) => {
            const itemCount = document.querySelector(itemCountSelector);
            const marketPanel = document.querySelector(marketPanelSelector);
            const itemIcon = document.querySelector(itemIconSelector);
            const orderBooks = document.querySelector(orderBooksSelector);
            const container = document.getElementById('market-history-container');
            const historyPanel = document.getElementById('market-history-panel');

            // 检查市场面板是否打开
            const newMarketOpen = !!marketPanel;

            if (itemCount) {
                if (!container) {
                    createHistoryUI();
                }
                container?.style.setProperty('display', 'block');
                // 新增：每次出现时都尝试绑定一次
                addMarketNavButtonListener();
            } else {
                container?.style.setProperty('display', 'none');
                // 关闭历史数据面板
                historyPanel?.remove();
            }

            // 当 orderBooks 元素从无到有时执行自动读取
            const nowVisible = !!orderBooks;
            if (nowVisible && !lastOrderBooksVisible) {
                recordMarketData('auto');
            }
            lastOrderBooksVisible = nowVisible;

            isMarketOpen = newMarketOpen;
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始检查
        const itemCount = document.querySelector(itemCountSelector);
        const marketPanel = document.querySelector(marketPanelSelector);
        const itemIcon = document.querySelector(itemIconSelector);
        const orderBooks = document.querySelector(orderBooksSelector);
        if (itemCount) {
            if (!document.getElementById('market-history-container')) {
                createHistoryUI();
            }
            // 初始自动读取
            if (marketPanel && itemIcon && orderBooks) {
                isMarketOpen = true;
                lastItemIcon = itemIcon;
                lastOrderBooksVisible = true;
                recordMarketData('auto');
            } else {
                lastOrderBooksVisible = !!orderBooks;
            }
            // 新增：初始时也尝试绑定一次
            addMarketNavButtonListener();
        }
    }

    // 记录市场数据
    async function recordMarketData(readType = 'manual', tag = undefined) {
        const currentTime = new Date().toISOString();
        const itemName = getItemNameWithEnhance();
        // 自动读取时，若距离上次对该物品的自动读取不超过5秒，则跳过
        if (readType === 'auto') {
            const now = Date.now();
            if (lastAutoReadMap[itemName] && (now - lastAutoReadMap[itemName] < 5000)) {
                return;
            }
            lastAutoReadMap[itemName] = now;
            // 只做一次全局节流判断
            if (now - lastReadTime < READ_INTERVAL) {
                return;
            }
            lastReadTime = now;
        }

        const currentData = getCurrentMarketData();
        if (!currentData) {
            console.log('未找到市场数据');
            return;
        }

        // 获取所有历史数据
        let allHistory = await loadData();

        // 如果该物品没有历史记录，创建新数组
        if (!allHistory[itemName]) {
            allHistory[itemName] = [];
        }

        // 检查上一条手动保存的时间
        if (readType === 'auto') {
            const historyArr = allHistory[itemName];
            // 倒序查找最近的手动保存
            let lastManual = null;
            for (let i = historyArr.length - 1; i >= 0; i--) {
                if (historyArr[i].readType === 'manual') {
                    lastManual = historyArr[i];
                    break;
                }
            }
            // 如果没有任何手动保存数据，也标记为'manual'
            if (!lastManual) {
                readType = 'manual';
            } else {
                const lastManualTime = new Date(lastManual.timestamp).getTime();
                const nowTime = new Date(currentTime).getTime();
                if ((nowTime - lastManualTime) > 15 * 60 * 1000) {
                    readType = 'manual';
                }
            }
        }

        // 添加新记录
        const record = {
            timestamp: currentTime,
            data: currentData,
            readType: readType // 添加读取类型标记
        };
        if (tag) record.tag = tag;
        allHistory[itemName].push(record);

        // 清理旧数据
        allHistory = await cleanupOldData(allHistory);

        // 保存数据
        await saveData(allHistory);

        // 更新状态显示
        updateStatusDisplay(itemName, currentData, readType);

        // 如果是手动保存并且历史面板存在，则刷新历史面板
        const historyPanel = document.getElementById('market-history-panel');
        if (historyPanel) {
            historyPanel.remove();
            showHistory();
        }

        return {
            itemName,
            timestamp: currentTime,
            data: currentData,
            readType: readType,
            tag: tag
        };
    }

    // 获取当前市场数据
    function getCurrentMarketData() {
        // 买单选择器
        const buyOrderSelector = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(2) > table > tbody";
        // 卖单选择器
        const sellOrderSelector = "#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(1) > table > tbody";

        const buyOrderRows = document.querySelector(buyOrderSelector)?.querySelectorAll('tr');
        const sellOrderRows = document.querySelector(sellOrderSelector)?.querySelectorAll('tr');

        if (!buyOrderRows && !sellOrderRows) {
            return null;
        }

        const marketData = {
            buyOrders: [],
            sellOrders: []
        };

        // 处理买单数据
        if (buyOrderRows) {
            buyOrderRows.forEach(row => {
                const columns = row.querySelectorAll('td');
                if (columns.length >= 2) {
                    // 剔除首尾空格，保留小数点
                    const rawQuantity = columns[0]?.textContent?.trim() || '';
                    const rawPrice = columns[1]?.textContent?.trim() || '';
                    const cleanQuantity = rawQuantity.replace(/\s+/g, '');
                    const cleanPrice = rawPrice.replace(/\s+/g, '');
                    const itemData = {
                        quantity: convertNumber(cleanQuantity),
                        price: convertNumber(cleanPrice),
                    };
                    marketData.buyOrders.push(itemData);
                }
            });
        }

        // 处理卖单数据
        if (sellOrderRows) {
            sellOrderRows.forEach(row => {
                const columns = row.querySelectorAll('td');
                if (columns.length >= 2) {
                    // 剔除首尾空格，保留小数点
                    const rawQuantity = columns[0]?.textContent?.trim() || '';
                    const rawPrice = columns[1]?.textContent?.trim() || '';
                    const cleanQuantity = rawQuantity.replace(/\s+/g, '');
                    const cleanPrice = rawPrice.replace(/\s+/g, '');
                    const itemData = {
                        quantity: convertNumber(cleanQuantity),
                        price: convertNumber(cleanPrice),
                    };
                    marketData.sellOrders.push(itemData);
                }
            });
        }

        return marketData;
    }

    // 转换数值（K和M转换为具体数字）
    function convertNumber(value) {
        if (typeof value !== 'string') {
            return value;
        }

        value = value.trim().toUpperCase();

        // 只保留数字、字母和小数点，去除其它特殊字符
        value = value.replace(/[^\dA-Z.]/g, '');

        // 保留小数点，处理 K/M 单位
        if (/^[\d.]+K$/.test(value)) {
            return (parseFloat(value.slice(0, -1)) * 1000).toString();
        } else if (/^[\d.]+M$/.test(value)) {
            return (parseFloat(value.slice(0, -1)) * 1000000).toString();
        }

        // 只保留数字和小数点
        if (/^[\d.]+$/.test(value)) {
            return value;
        }

        return value;
    }

    // 格式化数值显示
    function formatNumber(value) {
        if (typeof value !== 'string') {
            return value;
        }

        const num = parseFloat(value);
        if (isNaN(num)) {
            return value;
        }

        // 保留小数点
        return num.toString();
    }

    // 创建历史记录显示界面
    function createHistoryUI() {
        const container = document.createElement('div');
        container.id = 'market-history-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 12px;
            border-radius: 5px;
            color: white;
            z-index: 9999;
            font-family: Arial, sans-serif;
            display: none;
            cursor: move;
            width: 300px;
        `;
        // 恢复面板位置
        const pos = localStorage.getItem('market_history_panel_pos');
        if (pos) {
            try {
                const { left, top } = JSON.parse(pos);
                container.style.left = left + 'px';
                container.style.top = top + 'px';
                container.style.right = '';
            } catch {}
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
        `;

        // 读取当前数据按钮
        const currentDataButton = document.createElement('button');
        currentDataButton.textContent = text('readCurrent');
        currentDataButton.style.cssText = `
            padding: 6px 12px;
            border: none;
            border-radius: 3px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            flex: 1;
            white-space: nowrap;
            font-size: 13px;
            transition: background-color 0.2s;
        `;
        currentDataButton.onmouseover = () => {
            currentDataButton.style.backgroundColor = '#45a049';
        };
        currentDataButton.onmouseout = () => {
            currentDataButton.style.backgroundColor = '#4CAF50';
        };
        currentDataButton.onclick = showCurrentData;

        // 读取历史数据按钮
        const historyButton = document.createElement('button');
        historyButton.textContent = text('readHistory');
        historyButton.style.cssText = `
            padding: 6px 12px;
            border: none;
            border-radius: 3px;
            background: #2196F3;
            color: white;
            cursor: pointer;
            flex: 1;
            white-space: nowrap;
            font-size: 13px;
            transition: background-color 0.2s;
        `;
        historyButton.onmouseover = () => {
            historyButton.style.backgroundColor = '#1e88e5';
        };
        historyButton.onmouseout = () => {
            historyButton.style.backgroundColor = '#2196F3';
        };
        historyButton.onclick = showHistory;

        // 添加按钮到容器
        buttonContainer.appendChild(currentDataButton);
        buttonContainer.appendChild(historyButton);

        const status = document.createElement('span');
        status.id = 'market-history-status';
        status.style.cssText = `
            display: block;
            margin-top: 8px;
            font-size: 12px;
            line-height: 1.4;
            color: #ccc;
            word-break: break-all;
        `;

        container.appendChild(buttonContainer);
        container.appendChild(status);
        document.body.appendChild(container);

        // 添加拖动功能
        makeDraggable(container, undefined, 'market_history_panel_pos');
    }

    // 添加拖动功能
    function makeDraggable(element, handle, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let dragging = false;
        const dragTarget = handle || element;
        dragTarget.style.cursor = 'move';
        dragTarget.onmousedown = dragMouseDown;

        // 拖动结束时保存位置
        function savePanelPosition() {
            const rect = element.getBoundingClientRect();
            localStorage.setItem(storageKey, JSON.stringify({
                left: rect.left,
                top: rect.top
            }));
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            dragging = true;
            // 首次拖动时将 right 转换为 left
            if (element.style.right && (!element.style.left || element.style.left === '')) {
                const rect = element.getBoundingClientRect();
                element.style.left = rect.left + 'px';
                element.style.top = rect.top + 'px';
                element.style.right = '';
            }
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            if (!dragging) return;
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 计算新位置，限制不超出窗口
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            const minTop = 0;
            const minLeft = 0;
            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;
            if (newTop < minTop) newTop = minTop;
            if (newLeft < minLeft) newLeft = minLeft;
            if (newTop > maxTop) newTop = maxTop;
            if (newLeft > maxLeft) newLeft = maxLeft;
            element.style.top = newTop + 'px';
            element.style.left = newLeft + 'px';
        }

        function closeDragElement() {
            dragging = false;
            document.onmouseup = null;
            document.onmousemove = null;
            savePanelPosition();
        }
    }

    // 更新状态显示
    function updateStatusDisplay(itemName, data, readType) {
        const status = document.getElementById('market-history-status');
        if (status) {
            const now = new Date().toLocaleTimeString();
            const buyCount = data.buyOrders?.length || 0;
            const sellCount = data.sellOrders?.length || 0;
            const readTypeText = readType === 'auto' ? '自动读取' : '手动读取';
            status.textContent = `${text('lastUpdate')}: ${now} | ${itemName} (${buyCount}${text('buy')}, ${sellCount}${text('sell')}) [${readTypeText}]`;
        }
    }

    // 显示当前数据
    async function showCurrentData() {
        const result = await recordMarketData('manual');
        if (!result) {
            alert(text('noData'));
            return;
        }

        const enhanceName = getItemNameWithEnhance();
        showDataPopup(enhanceName, [{
            timestamp: result.timestamp,
            data: result.data,
            readType: result.readType
        }]);

        // 如果历史数据面板已打开，更新显示
        const historyPanel = document.getElementById('market-history-panel');
        if (historyPanel) {
            historyPanel.remove();
            showHistory();
        }
        // 新增：点击读取按钮时也刷新历史面板
        if (historyPanel) {
            showItemHistory(getItemNameWithEnhance(), historyPanel);
        }
    }

    // 显示历史数据
    async function showHistory() {
        const allHistory = await loadData();
        const currentItemName = getItemNameWithEnhance();

        // 新增：打开前先关闭已有的历史面板
        const oldPanel = document.getElementById('market-history-panel');
        if (oldPanel) oldPanel.remove();

        // 创建数据面板
        const historyPanel = document.createElement('div');
        historyPanel.id = 'market-history-panel';
        historyPanel.style.cssText = `
            position: fixed;
            top: 15%;
            right: 40px;
            background: rgba(30, 30, 30, 0.98);
            padding: 24px 32px 18px 32px;
            border-radius: 8px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 10000;
            font-family: Arial, sans-serif;
            color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            min-width: 800px;
            display: flex;
            flex-direction: column;
            resize: none; /* 默认不允许浏览器原生resize */
        `;
        // 恢复数据面板位置和大小
        const dataPos = localStorage.getItem('market_history_data_pos');
        if (dataPos) {
            try {
                const { left, top } = JSON.parse(dataPos);
                historyPanel.style.left = left + 'px';
                historyPanel.style.top = top + 'px';
                historyPanel.style.right = '';
            } catch {}
        }
        const dataSize = localStorage.getItem('market_history_data_size');
        if (dataSize) {
            try {
                const { width, height } = JSON.parse(dataSize);
                if (width) historyPanel.style.width = width + 'px';
                if (height) historyPanel.style.height = height + 'px';
            } catch {}
        }

        let html = `<h2 id="market-history-title" style="margin-top: 0; margin-bottom: 15px; font-size: 16px; cursor: move; user-select: none;">${text('marketHistory')}</h2>`;

        if (Object.keys(allHistory).length === 0) {
            html += `<p style="color: #ccc;">${text('noHistory')}</p>`;
        } else {
            // 创建顶部控制栏
            html += `<div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                <select id="item-selector" style="
                    padding: 5px 10px;
                    border: none;
                    border-radius: 3px;
                    background: #4CAF50;
                    color: white;
                    cursor: pointer;
                    flex-grow: 1;
                ">
                    ${Object.keys(allHistory).map(item =>
                        `<option value="${item}" ${item === currentItemName ? 'selected' : ''}>${item}</option>`
                    ).join('')}
                </select>
                <button id="compare-data" style="
                    padding: 5px 10px;
                    border: none;
                    border-radius: 3px;
                    background: #2196F3;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    min-width: 60px;
                ">${text('compare')}</button>
                <button id="cleanup-data" style="
                    padding: 5px 10px;
                    border: none;
                    border-radius: 3px;
                    background: #f44336;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.2s;
                ">${text('cleanup')}</button>
                <button id="settings-button" style="
                    padding: 5px;
                    width: 30px;
                    height: 30px;
                    border: none;
                    border-radius: 3px;
                    background: #2196F3;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">⚙</button>
            </div>`;

            // 创建历史记录列表和数据显示区域
            html += `<div style="display: flex; gap: 15px; flex-grow: 1; min-height: 400px;">
                <div id="history-list" style="
                    width: 200px;
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    padding-right: 15px;
                    overflow-y: auto;
                    max-height: 60vh;
                "></div>
                <div id="history-detail" style="
                    flex-grow: 1;
                    overflow-y: auto;
                    max-height: 60vh;
                ">
                    <p style="color: #ccc; text-align: center;">${text('select')}</p>
                </div>
            </div>`;
        }

        historyPanel.innerHTML = html;

        // 关闭按钮必须在innerHTML赋值后插入，避免被覆盖
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.title = '关闭';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: none;
            font-size: 22px;
            cursor: pointer;
            color: #ccc;
            z-index: 10001;
            padding: 0;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            transition: background 0.2s, color 0.2s;
        `;
        closeButton.onmouseover = () => {
            closeButton.style.background = 'rgba(255,255,255,0.08)';
            closeButton.style.color = '#fff';
        };
        closeButton.onmouseout = () => {
            closeButton.style.background = 'none';
            closeButton.style.color = '#ccc';
        };
        closeButton.onclick = () => historyPanel.remove();
        historyPanel.appendChild(closeButton);

        // 如果有数据，设置事件监听
        if (Object.keys(allHistory).length > 0) {
            // 设置清理按钮事件
            const cleanupButton = historyPanel.querySelector('#cleanup-data');
            cleanupButton.onmouseover = () => {
                cleanupButton.style.background = '#d32f2f';
            };
            cleanupButton.onmouseout = () => {
                cleanupButton.style.background = '#f44336';
            };
            cleanupButton.onclick = async () => {
                createConfirmDialog(
                    text('confirmCleanup'),
                    async () => {
                        const allHistory = await loadData();
                        if (await cleanupAutoData(allHistory)) {
                            // 重新显示历史记录
                            showItemHistory(currentItemName, historyPanel);
                        }
                    }
                );
            };

            // 设置对比按钮事件
            const compareButton = historyPanel.querySelector('#compare-data');
            compareButton.onmouseover = () => {
                compareButton.style.background = '#1976D2';
            };
            compareButton.onmouseout = () => {
                compareButton.style.background = '#2196F3';
            };
            compareButton.onclick = () => {
                // 读取卖单数（第二个元素）
                const sellOrderElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(1)");

                // 读取买单数（第二个元素）
                const buyOrderElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)");

                const sellOrderValue = sellOrderElement?.textContent?.trim() || '未找到';
                const buyOrderValue = buyOrderElement?.textContent?.trim() || '未找到';

                // 对比并高亮历史记录面板中的数据
                highlightMatchingValues(sellOrderValue, buyOrderValue);

                // 使用内部信息面板而非浏览器弹窗
                showAnalysisPanel(`${text('sell2')}: ${sellOrderValue}\n${text('buy2')}: ${buyOrderValue}\n${text('highlight')}`, true);
            };

            // 设置按钮事件
            const settingsButton = historyPanel.querySelector('#settings-button');
            settingsButton.onmouseover = () => {
                settingsButton.style.background = '#1976D2';
            };
            settingsButton.onmouseout = () => {
                settingsButton.style.background = '#2196F3';
            };
            settingsButton.onclick = () => {
                showSettingsPanel();
            };

            // 设置物品选择事件
            historyPanel.querySelector('#item-selector').onchange = function(e) {
                showItemHistory(e.target.value, historyPanel);
            };

            // 显示当前物品的历史记录
            showItemHistory(currentItemName, historyPanel);
        }

        document.body.appendChild(historyPanel);
        // 只允许标题栏拖动
        const titleBar = historyPanel.querySelector('#market-history-title');
        if (titleBar) {
            makeDraggable(historyPanel, titleBar, 'market_history_data_pos');
        } else {
            makeDraggable(historyPanel, undefined, 'market_history_data_pos');
        }
        // 添加右下角拖拽改变大小的功能（必须在内容渲染和appendChild后调用）
        addResizable(historyPanel, 'market_history_data_size');
    }

    // 添加可拖拽改变大小功能
    function addResizable(element, storageKey) {
        // 创建右下角拖拽柄
        const resizer = document.createElement('div');
        resizer.style.cssText = `
            position: absolute;
            right: 2px;
            bottom: 2px;
            width: 18px;
            height: 18px;
            cursor: se-resize;
            z-index: 10001;
            opacity: 0.95;
            pointer-events: auto;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
        `;
        // SVG图标（斜向双箭头）
        resizer.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 13L13 3" stroke="#bbb" stroke-width="2"/>
  <path d="M9 13H13V9" stroke="#bbb" stroke-width="2"/>
</svg>`;
        element.appendChild(resizer);
        element.style.position = 'fixed';
        element.style.minWidth = '400px';
        element.style.minHeight = '200px';
        let startX, startY, startWidth, startHeight;
        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
            document.documentElement.addEventListener('mousemove', doDrag, false);
            document.documentElement.addEventListener('mouseup', stopDrag, false);
        });
        function doDrag(e) {
            let newWidth = startWidth + e.clientX - startX;
            let newHeight = startHeight + e.clientY - startY;
            // 限制最小宽高
            if (newWidth < 400) newWidth = 400;
            if (newHeight < 200) newHeight = 200;
            element.style.width = newWidth + 'px';
            element.style.height = newHeight + 'px';
        }
        function stopDrag(e) {
            // 保存宽高
            localStorage.setItem(storageKey, JSON.stringify({
                width: parseInt(element.style.width, 10),
                height: parseInt(element.style.height, 10)
            }));
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        }
    }

    // 显示特定物品的历史记录
    async function showItemHistory(itemName, container) {
        const allHistory = await loadData();
        let displayName = itemName.replace(/\+0$/, '');
        let itemHistory = allHistory[itemName] || [];
        // 如果没有带强化等级的历史，尝试用不带强化等级的名称兜底
        if (itemHistory.length === 0) {
            const baseName = displayName.replace(/([+＋][0-9]+)$/,'').trim();
            if (allHistory[baseName]) {
                itemHistory = allHistory[baseName];
            }
        }
        const historyList = container.querySelector('#history-list');
        const historyDetail = container.querySelector('#history-detail');

        // 生成历史记录列表
        let listHtml = '';
        const sortedHistory = itemHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        sortedHistory.forEach((record, index) => {
            const date = new Date(record.timestamp);
            const readTypeText = record.readType === 'auto' ? text('auto') : text('manual');
            const isManual = record.readType === 'manual';
            const tagHtml = record.tag ? `<span style="margin-left: 6px; padding: 2px 6px; border-radius: 3px; background: #ff9800; color: #fff; font-size: 11px;">${record.tag}</span>` : '';

            listHtml += `<div class="history-item" data-index="${index}" style="
                padding: 10px;
                border: 1px solid ${isManual ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 8px;
                border-radius: 4px;
                background: ${isManual ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
                position: relative;
            ">
                <div style="font-weight: bold; color: #fff;">${date.toLocaleDateString()}${tagHtml}</div>
                <div style="font-size: 12px; color: ${isManual ? '#4CAF50' : '#ccc'};">
                    ${date.toLocaleTimeString()}
                    <span style="
                        margin-left: 5px;
                        padding: 2px 6px;
                        border-radius: 3px;
                        background: ${isManual ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
                    ">[${readTypeText}]</span>
                </div>
                <button class="delete-record" data-timestamp="${record.timestamp}" style="
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(244, 67, 54, 0.2);
                    border: none;
                    color: #f44336;
                    border-radius: 3px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 0;
                    opacity: 0;
                    transition: opacity 0.2s;
                ">×</button>
            </div>`;
        });

        if (listHtml === '') {
            historyList.innerHTML = `<p style="color: #ccc; text-align: center;">${text('noHistory')}</p>`;
            historyDetail.innerHTML = `<p style="color: #ccc; text-align: center;">${text('noHistory')}</p>`;
            return;
        }

        historyList.innerHTML = listHtml;

        // 添加历史记录项的点击事件和悬停效果
        const historyItems = historyList.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            const index = parseInt(item.dataset.index);
            const record = sortedHistory[index];
            const isManual = record.readType === 'manual';
            const deleteBtn = item.querySelector('.delete-record');

            // 添加悬停效果
            item.onmouseover = () => {
                if (!item.classList.contains('selected')) {
                    item.style.background = isManual ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                }
                deleteBtn.style.opacity = '1';
            };
            item.onmouseout = () => {
                if (!item.classList.contains('selected')) {
                    item.style.background = isManual ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                }
                deleteBtn.style.opacity = '0';
            };

            // 添加删除按钮悬停效果
            deleteBtn.onmouseover = (e) => {
                e.stopPropagation();
                deleteBtn.style.background = 'rgba(244, 67, 54, 0.4)';
            };
            deleteBtn.onmouseout = (e) => {
                e.stopPropagation();
                deleteBtn.style.background = 'rgba(244, 67, 54, 0.2)';
            };

            // 添加删除按钮点击事件
            deleteBtn.onclick = async (e) => {
                e.stopPropagation();
                const timestamp = deleteBtn.dataset.timestamp;
                createConfirmDialog(
                    text('confirmDelete'),
                    async () => {
                        if (await deleteHistoryRecord(itemName, timestamp)) {
                            // 重新显示历史记录
                            showItemHistory(itemName, container);
                        }
                    }
                );
            };

            // 添加点击事件
            item.onclick = () => {
                // 移除其他项的选中状态
                historyItems.forEach(i => {
                    const idx = parseInt(i.dataset.index);
                    const rec = sortedHistory[idx];
                    const isManualRec = rec.readType === 'manual';
                    i.classList.remove('selected');
                    i.style.background = isManualRec ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)';
                    i.querySelector('.delete-record').style.opacity = '0';
                });

                // 设置当前项的选中状态
                item.classList.add('selected');
                item.style.background = isManual ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.15)';
                deleteBtn.style.opacity = '1';

                // 显示详细数据
                showHistoryDetail(record, historyDetail);
            };
        });

        // 默认显示最新的记录
        if (historyItems.length > 0) {
            historyItems[0].click();
        }
    }

    // 显示历史记录详情
    function showHistoryDetail(record, container) {
        const isManual = record.readType === 'manual';
        let html = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; color: #fff; font-size: 14px; padding: 8px; background: ${isManual ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)'}; border-radius: 4px; border: 1px solid ${isManual ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 255, 255, 0.1)'}; flex-grow: 1; margin-right: 10px; display: flex; align-items: center;">
                <span>${new Date(record.timestamp).toLocaleString()}</span>
                <span style="margin-left: 8px; padding: 2px 6px; border-radius: 3px; background: ${isManual ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; font-size: 12px;">
                    [${record.readType === 'auto' ? text('auto') : text('manual')}]
                </span>
                ${record.tag ? `<span style='margin-left: 8px; padding: 2px 6px; border-radius: 3px; background: #ff9800; color: #fff; font-size: 12px;'>${record.tag}</span>` : ''}
            </h3>
            ${record.readType === 'auto' ? `
                <button class="save-as-manual" data-timestamp="${record.timestamp}" style="padding: 4px 12px; border: none; border-radius: 3px; background: #4CAF50; color: white; cursor: pointer; font-size: 12px; transition: background-color 0.2s;">${text('save')}</button>
            ` : ''}
        </div>`;

        // 创建横向布局容器
        html += '<div style="display: flex; gap: 20px; margin-top: 15px;">';

        // 卖单数据（左侧）
        html += '<div style="flex: 1;">';
        html += `<h4 style="color: #f44336; margin: 0 0 10px 0; font-size: 13px;">${text('sell')}</h4>`;
        if (record.data.sellOrders && record.data.sellOrders.length > 0) {
            html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">';
            html += `<tr><th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; background: rgba(255, 255, 255, 0.1); color: #fff;">${text('quantity')}</th><th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; background: rgba(255, 255, 255, 0.1); color: #fff;">${text('price')}</th></tr>`;
            record.data.sellOrders.forEach((item, index) => {
                html += `<tr data-sell-index="${index}">
                    <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; color: #fff;">${formatNumber(item.quantity)}</td>
                    <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; color: #fff;">${formatNumber(item.price)}</td>
                </tr>`;
            });
            html += '</table>';
        } else {
            html += `<p style="color: #ccc; margin: 0;">${text('noData')}</p>`;
        }
        html += '</div>';

        // 买单数据（右侧）
        html += '<div style="flex: 1;">';
        html += `<h4 style="color: #4CAF50; margin: 0 0 10px 0; font-size: 13px;">${text('buy')}</h4>`;
        if (record.data.buyOrders && record.data.buyOrders.length > 0) {
            html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">';
            html += `<tr><th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; background: rgba(255, 255, 255, 0.1); color: #fff;">${text('quantity')}</th><th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; background: rgba(255, 255, 255, 0.1); color: #fff;">${text('price')}</th></tr>`;
            record.data.buyOrders.forEach((item, index) => {
                html += `<tr data-buy-index="${index}">
                    <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; color: #fff;">${formatNumber(item.quantity)}</td>
                    <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px; color: #fff;">${formatNumber(item.price)}</td>
                </tr>`;
            });
            html += '</table>';
        } else {
            html += `<p style="color: #ccc; margin: 0;">${text('noData')}</p>`;
        }
        html += '</div>';

        // 关闭横向布局容器
        html += '</div>';

        container.innerHTML = html;

        // 添加保存按钮事件
        const saveButton = container.querySelector('.save-as-manual');
        if (saveButton) {
            saveButton.onmouseover = () => {
                saveButton.style.background = '#45a049';
            };
            saveButton.onmouseout = () => {
                saveButton.style.background = '#4CAF50';
            };
            saveButton.onclick = () => {
                const timestamp = saveButton.dataset.timestamp;
                const itemName = document.querySelector('#item-selector').value;
                if (updateRecordType(itemName, timestamp, 'manual')) {
                    // 重新显示历史记录
                    showItemHistory(itemName, container.closest('#market-history-panel'));
                }
            };
        }
    }

    // 显示数据弹窗
    function showDataPopup(itemName, records) {
        const popupDiv = document.createElement('div');
        popupDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-height: 80vh;
            max-width: 80vw;
            overflow-y: auto;
            z-index: 10000;
            font-family: Arial, sans-serif;
            color: black;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        let html = `<h2 style="margin-top: 0;">${itemName.replace(/\+0$/, '')}</h2>`;

        records.forEach(record => {
            const readTypeText = record.readType === 'auto' ? '自动读取' : '手动读取';
            html += `<h3>${new Date(record.timestamp).toLocaleString()} [${readTypeText}]</h3>`;

            // 显示卖单数据
            if (record.data.sellOrders && record.data.sellOrders.length > 0) {
                html += '<h4 style="color: #f44336;">卖单</h4>';
                html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
                html += '<tr><th style="border: 1px solid #ddd; padding: 8px;">数量</th><th style="border: 1px solid #ddd; padding: 8px;">价格</th></tr>';
                record.data.sellOrders.forEach(item => {
                    html += `<tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
                    </tr>`;
                });
                html += '</table>';
            }

            // 显示买单数据
            if (record.data.buyOrders && record.data.buyOrders.length > 0) {
                html += '<h4 style="color: #4CAF50;">买单</h4>';
                html += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
                html += '<tr><th style="border: 1px solid #ddd; padding: 8px;">数量</th><th style="border: 1px solid #ddd; padding: 8px;">价格</th></tr>';
                record.data.buyOrders.forEach(item => {
                    html += `<tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
                    </tr>`;
                });
                html += '</table>';
            }
        });

        popupDiv.innerHTML = html;

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        `;
        closeButton.onclick = () => popupDiv.remove();
        popupDiv.appendChild(closeButton);

        document.body.appendChild(popupDiv);

        // 点击其他地方关闭
        popupDiv.onclick = e => e.stopPropagation();
        document.body.onclick = () => popupDiv.remove();
    }

    // 删除单条历史记录（异步）
    async function deleteHistoryRecord(itemName, timestamp) {
        let allHistory = await loadData();
        if (allHistory[itemName]) {
            allHistory[itemName] = allHistory[itemName].filter(record => record.timestamp !== timestamp);
            if (allHistory[itemName].length === 0) {
                delete allHistory[itemName];
            }
            await saveData(allHistory);
            return true;
        }
        return false;
    }

    // 修改记录的读取类型（异步）
    async function updateRecordType(itemName, timestamp, newType) {
        let allHistory = await loadData();
        if (allHistory[itemName]) {
            const record = allHistory[itemName].find(record => record.timestamp === timestamp);
            if (record) {
                record.readType = newType;
                await saveData(allHistory);
                return true;
            }
        }
        return false;
    }

    // 创建设置面板
    function showSettingsPanel() {
        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'market-history-settings';
        settingsDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            min-width: 300px;
        `;

        let html = `
            <h3 style="
                margin: 0 0 20px 0;
                font-size: 16px;
                color: #fff;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 10px;
            ">${text('settingsTitle')}</h3>

            <div style="margin-bottom: 15px;">
                <label style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    cursor: pointer;
                ">
                    <input type="checkbox" id="settings-auto-read" style="margin-right: 10px;">
                    <span>${text('autoRead')}</span>
                </label>
                <div style="
                    font-size: 12px;
                    color: #999;
                    margin-left: 24px;
                ">${text('autoReadDesc')}</div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">${text('retention')}</label>
                <select id="settings-retention" style="
                    width: 100%;
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    color: white;
                    margin-top: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    position: relative;
                    transition: all 0.2s;
                ">
                    <option value="1" style="background: rgba(0, 0, 0, 0.9);">1天</option>
                    <option value="3" style="background: rgba(0, 0, 0, 0.9);">3天</option>
                    <option value="7" style="background: rgba(0, 0, 0, 0.9);" selected>${text('retention')}</option>
                    <option value="14" style="background: rgba(0, 0, 0, 0.9);">14天</option>
                    <option value="30" style="background: rgba(0, 0, 0, 0.9);">30天</option>
                </select>
                <div style="
                    position: absolute;
                    right: 35px;
                    margin-top: -28px;
                    color: rgba(255, 255, 255, 0.5);
                    pointer-events: none;
                    font-size: 12px;
                ">▼</div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 10px;">${text('manualCleanup')}</label>
                <div style="
                    display: flex;
                    gap: 10px;
                    align-items: center;
                ">
                    <select id="manual-cleanup-days" style="
                        padding: 8px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 3px;
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                        appearance: none;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        position: relative;
                        transition: all 0.2s;
                        flex: 1;
                    ">
                        <option value="7" style="background: rgba(0, 0, 0, 0.9);">${text('daysAgoN')(7)}</option>
                        <option value="14" style="background: rgba(0, 0, 0, 0.9);">${text('daysAgoN')(14)}</option>
                        <option value="30" style="background: rgba(0, 0, 0, 0.9);">${text('daysAgoN')(30)}</option>
                        <option value="90" style="background: rgba(0, 0, 0, 0.9);">${text('daysAgoN')(90)}</option>
                        <option value="180" style="background: rgba(0, 0, 0, 0.9);">${text('daysAgoN')(180)}</option>
                    </select>
                    <div style="
                        position: absolute;
                        right: 140px;
                        color: rgba(255, 255, 255, 0.5);
                        pointer-events: none;
                        font-size: 12px;
                    ">▼</div>
                    <button id="manual-cleanup-button" style="
                        padding: 8px 12px;
                        border: none;
                        border-radius: 3px;
                        background: #f44336;
                        color: white;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        font-size: 14px;
                        min-width: 80px;
                    ">${text('delete')}</button>
                </div>
                <div style="
                    font-size: 12px;
                    color: #999;
                    margin-top: 5px;
                    margin-left: 2px;
                ">${text('manualCleanupDesc')}</div>
            </div>

            <div style="
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            ">
                <button id="settings-cancel" style="
                    padding: 6px 12px;
                    border: none;
                    border-radius: 3px;
                    background: #757575;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.2s;
                ">${text('cancel')}</button>
                <button id="settings-save" style="
                    padding: 6px 12px;
                    border: none;
                    border-radius: 3px;
                    background: #4CAF50;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.2s;
                ">${text('save')}</button>
            </div>
        `;

        settingsDiv.innerHTML = html;

        // 添加遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;

        // 添加按钮事件
        const saveBtn = settingsDiv.querySelector('#settings-save');
        const cancelBtn = settingsDiv.querySelector('#settings-cancel');
        const autoReadCheckbox = settingsDiv.querySelector('#settings-auto-read');
        const retentionSelect = settingsDiv.querySelector('#settings-retention');
        const manualCleanupDaysSelect = settingsDiv.querySelector('#manual-cleanup-days');
        const manualCleanupButton = settingsDiv.querySelector('#manual-cleanup-button');

        // 加载当前设置
        autoReadCheckbox.checked = localStorage.getItem('market_history_auto_read') !== 'false';
        const currentRetention = localStorage.getItem('market_history_retention') || '7';
        retentionSelect.value = currentRetention;

        // 下拉栏悬停和焦点效果
        const addSelectEffects = (select) => {
            select.onmouseover = () => {
                select.style.background = 'rgba(255, 255, 255, 0.1)';
                select.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            };
            select.onmouseout = () => {
                if (document.activeElement !== select) {
                    select.style.background = 'rgba(255, 255, 255, 0.05)';
                    select.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            };
            select.onfocus = () => {
                select.style.background = 'rgba(255, 255, 255, 0.1)';
                select.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                select.style.outline = 'none';
            };
            select.onblur = () => {
                select.style.background = 'rgba(255, 255, 255, 0.05)';
                select.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            };
        };

        // 为两个下拉框添加效果
        addSelectEffects(retentionSelect);
        addSelectEffects(manualCleanupDaysSelect);

        // 保存按钮悬停效果
        saveBtn.onmouseover = () => saveBtn.style.background = '#45a049';
        saveBtn.onmouseout = () => saveBtn.style.background = '#4CAF50';

        // 取消按钮悬停效果
        cancelBtn.onmouseover = () => cancelBtn.style.background = '#616161';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#757575';

        // 保存设置
        saveBtn.onclick = () => {
            localStorage.setItem('market_history_auto_read', autoReadCheckbox.checked);
            localStorage.setItem('market_history_retention', retentionSelect.value);
            overlay.remove();
            settingsDiv.remove();
        };

        // 取消设置
        cancelBtn.onclick = () => {
            overlay.remove();
            settingsDiv.remove();
        };

        // 点击遮罩层关闭
        overlay.onclick = () => {
            overlay.remove();
            settingsDiv.remove();
        };

        // 添加手动清理按钮事件
        manualCleanupButton.onmouseover = () => manualCleanupButton.style.background = '#d32f2f';
        manualCleanupButton.onmouseout = () => manualCleanupButton.style.background = '#f44336';
        manualCleanupButton.onclick = () => {
            const days = parseInt(manualCleanupDaysSelect.value);
            createConfirmDialog(
                text('confirmManualCleanup', days),
                () => {
                    if (cleanupManualDataBefore(days)) {
                        showItemHistory(document.querySelector('#item-selector').value, settingsDiv.closest('#market-history-settings'));
                    }
                },
                () => {} // 取消时无操作
            );
        };

        document.body.appendChild(overlay);
        document.body.appendChild(settingsDiv);
    }

    // 创建自定义确认对话框
    function createConfirmDialog(message, onConfirm, onCancel) {
        const dialogDiv = document.createElement('div');
        dialogDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            min-width: 300px;
            text-align: center;
        `;

        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 20px;
            font-size: 14px;
        `;
        messageDiv.textContent = message;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
        `;

        const confirmButton = document.createElement('button');
        confirmButton.textContent = text('confirm');
        confirmButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 3px;
            background: #f44336;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        confirmButton.onmouseover = () => confirmButton.style.background = '#d32f2f';
        confirmButton.onmouseout = () => confirmButton.style.background = '#f44336';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = text('cancel');
        cancelButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            border-radius: 3px;
            background: #757575;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        cancelButton.onmouseover = () => cancelButton.style.background = '#616161';
        cancelButton.onmouseout = () => cancelButton.style.background = '#757575';

        confirmButton.onclick = () => {
            dialogDiv.remove();
            overlay.remove();
            onConfirm();
        };

        cancelButton.onclick = () => {
            dialogDiv.remove();
            overlay.remove();
            if (onCancel) onCancel();
        };

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);
        dialogDiv.appendChild(messageDiv);
        dialogDiv.appendChild(buttonContainer);

        // 添加遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;
        overlay.onclick = () => {
            overlay.remove();
            dialogDiv.remove();
            if (onCancel) onCancel();
        };

        document.body.appendChild(overlay);
        document.body.appendChild(dialogDiv);
    }

    // 显示对比面板
    function showComparePanel(itemName, currentRecord) {
        const compareDiv = document.createElement('div');
        compareDiv.id = 'market-history-compare';
        compareDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            min-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        let html = `
            <h3 style="
                margin: 0 0 20px 0;
                font-size: 16px;
                color: #fff;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 10px;
            ">数据对比 - ${itemName}</h3>

            <div style="
                display: flex;
                gap: 20px;
            ">
                <!-- 当前数据 -->
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px;">当前数据</h4>
                    <div style="
                        font-size: 12px;
                        color: #ccc;
                        margin-bottom: 10px;
                    ">${new Date(currentRecord.timestamp).toLocaleString()}</div>

                    <!-- 卖单数据 -->
                    <div style="margin-bottom: 15px;">
                        <h5 style="color: #f44336; margin: 0 0 5px 0; font-size: 13px;">卖单</h5>
                        ${currentRecord.data.sellOrders && currentRecord.data.sellOrders.length > 0 ? `
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; background: rgba(255, 255, 255, 0.1); color: #fff;">数量</th>
                                    <th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; background: rgba(255, 255, 255, 0.1); color: #fff;">价格</th>
                                </tr>
                                ${currentRecord.data.sellOrders.map(item => `
                                    <tr>
                                        <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; color: #fff;">${formatNumber(item.quantity)}</td>
                                        <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; color: #fff;">${formatNumber(item.price)}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        ` : `<p style="color: #ccc; margin: 0;">${text('noData')}</p>`}
                    </div>

                    <!-- 买单数据 -->
                    <div>
                        <h5 style="color: #4CAF50; margin: 0 0 5px 0; font-size: 13px;">买单</h5>
                        ${currentRecord.data.buyOrders && currentRecord.data.buyOrders.length > 0 ? `
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; background: rgba(255, 255, 255, 0.1); color: #fff;">数量</th>
                                    <th style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; background: rgba(255, 255, 255, 0.1); color: #fff;">价格</th>
                                </tr>
                                ${currentRecord.data.buyOrders.map(item => `
                                    <tr>
                                        <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; color: #fff;">${formatNumber(item.quantity)}</td>
                                        <td style="border: 1px solid rgba(255, 255, 255, 0.1); padding: 5px; color: #fff;">${formatNumber(item.price)}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        ` : `<p style="color: #ccc; margin: 0;">${text('noData')}</p>`}
                    </div>
                </div>

                <!-- 历史数据（待实现） -->
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 10px 0; font-size: 14px;">历史数据</h4>
                    <div style="color: #ccc;">请选择要对比的历史数据</div>
                </div>
            </div>
        `;

        compareDiv.innerHTML = html;

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            border: none;
            background: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeButton.onmouseover = () => closeButton.style.color = '#fff';
        closeButton.onmouseout = () => closeButton.style.color = '#ccc';
        closeButton.onclick = () => analysisDiv.remove();
        compareDiv.appendChild(closeButton);

        // 添加遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;

        // 关闭事件
        const closePanel = () => {
            overlay.remove();
            compareDiv.remove();
        };

        closeButton.onclick = closePanel;
        overlay.onclick = closePanel;

        document.body.appendChild(overlay);
        document.body.appendChild(compareDiv);
    }

    // 高亮匹配的数值
    function highlightMatchingValues(sellOrderValue, buyOrderValue) {
        const historyDetail = document.querySelector('#history-detail');
        if (!historyDetail) {
            return;
        }

        // 转换读取到的数值（处理K、M等单位）
        const convertedSellValue = convertNumber(sellOrderValue);
        const convertedBuyValue = convertNumber(buyOrderValue);

        // 查找卖单列表中的数量单元格
        const sellQuantityCells = historyDetail.querySelectorAll('tr[data-sell-index] td:first-child');
        sellQuantityCells.forEach(cell => {
            const cellValue = cell.textContent?.trim();
            const convertedCellValue = convertNumber(cellValue);

            // 不再移除已有高亮和按钮

            // 如果数值匹配，添加高亮和按钮
            if (convertedCellValue === convertedSellValue) {
                cell.style.background = '#ffeb3b';
                cell.style.color = '#000';
                cell.style.fontWeight = 'bold';

                // 检查是否已存在按钮，避免重复添加
                if (!cell.querySelector('.highlight-button')) {
                // 创建按钮
                const button = document.createElement('button');
                button.textContent = text('calc');
                button.className = 'highlight-button';
                button.style.cssText = `
                    margin-left: 5px;
                    padding: 2px 6px;
                    border: none;
                    border-radius: 3px;
                    background: #2196F3;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: background-color 0.2s;
                `;

                // 添加按钮悬停效果
                button.onmouseover = () => {
                    button.style.background = '#1976D2';
                };
                button.onmouseout = () => {
                    button.style.background = '#2196F3';
                };

                // 添加按钮点击事件
                button.onclick = (e) => {
                    e.stopPropagation();
                    readRemainingOrders(cell, cellValue);
                };

                // 将按钮添加到单元格
                cell.appendChild(button);
                }
            }
        });

        // 查找买单列表中的数量单元格
        const buyQuantityCells = historyDetail.querySelectorAll('tr[data-buy-index] td:first-child');
        buyQuantityCells.forEach(cell => {
            const cellValue = cell.textContent?.trim();
            const convertedCellValue = convertNumber(cellValue);

            // 不再移除已有高亮和按钮

            // 如果数值匹配，添加高亮和按钮
            if (convertedCellValue === convertedBuyValue) {
                cell.style.background = '#ffeb3b';
                cell.style.color = '#000';
                cell.style.fontWeight = 'bold';

                // 检查是否已存在按钮，避免重复添加
                if (!cell.querySelector('.highlight-button')) {
                // 创建按钮
                const button = document.createElement('button');
                button.textContent = text('calc');
                button.className = 'highlight-button';
                button.style.cssText = `
                    margin-left: 5px;
                    padding: 2px 6px;
                    border: none;
                    border-radius: 3px;
                    background: #2196F3;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: background-color 0.2s;
                `;

                // 添加按钮悬停效果
                button.onmouseover = () => {
                    button.style.background = '#1976D2';
                };
                button.onmouseout = () => {
                    button.style.background = '#2196F3';
                };

                // 添加按钮点击事件
                button.onclick = (e) => {
                    e.stopPropagation();
                    readRemainingOrders(cell, cellValue);
                };

                // 将按钮添加到单元格
                cell.appendChild(button);
                }
            }
        });
    }

    // 读取残余订单数
    function readRemainingOrders(targetCell, currentValue) {
        // 判断当前按钮属于哪个列表
        const parentRow = targetCell.parentElement;
        const isSellOrder = parentRow.hasAttribute('data-sell-index');

        // 先计算累计数量之和
        const sum = calculateSumForCell(targetCell);
        const formattedSum = formatNumber(sum.toString());

        // 获取当前时间
        const currentTime = new Date();

        // 获取历史数据的时间（从记录中获取）
        const historyTime = getHistoryTimeFromRecord();

        if (isSellOrder) {
            // 左侧按钮：只读取残余卖单数
            const remainingSellElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(1)");
            const remainingSellValue = remainingSellElement?.textContent?.trim() || '未找到';

            // 计算差值
            const remainingSellNum = parseFloat(convertNumber(remainingSellValue)) || 0;
            const difference = sum - remainingSellNum;
            const formattedDifference = difference.toLocaleString('zh-CN');

            // 计算平均速度
            const timeDiff = currentTime - historyTime;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            const daysDiff = hoursDiff / 24;

            // 新增：千分符且无小数
            const avgPerHour = hoursDiff > 0 ? Math.floor(difference / hoursDiff) : 0;
            const avgPerDay = daysDiff > 0 ? Math.floor(difference / daysDiff) : 0;
            const avgPerHourStr = avgPerHour.toLocaleString('zh-CN');
            const avgPerDayStr = avgPerDay.toLocaleString('zh-CN');

            showAnalysisPanel(`${text('diff')}: ${formattedDifference}\n${text('timeDiff')}: ${hoursDiff.toFixed(2)}h (${daysDiff.toFixed(2)}d)\n${text('avgHourSell')}: ${avgPerHourStr}\n${text('avgDaySell')}: ${avgPerDayStr}`, false);
        } else {
            // 右侧按钮：只读取残余买单数
            const remainingBuyElement = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7  > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.MarketplacePanel_tabsComponentContainer__3ctJH > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.MarketplacePanel_orderBook__326Yx > div.MarketplacePanel_orderBooksContainer__B4YE- > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1)");
            const remainingBuyValue = remainingBuyElement?.textContent?.trim() || '未找到';

            // 计算差值
            const remainingBuyNum = parseFloat(convertNumber(remainingBuyValue)) || 0;
            const difference = sum - remainingBuyNum;
            const formattedDifference = difference.toLocaleString('zh-CN');

            // 计算平均速度
            const timeDiff = currentTime - historyTime;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            const daysDiff = hoursDiff / 24;

            // 新增：千分符且无小数
            const avgPerHour = hoursDiff > 0 ? Math.floor(difference / hoursDiff) : 0;
            const avgPerDay = daysDiff > 0 ? Math.floor(difference / daysDiff) : 0;
            const avgPerHourStr = avgPerHour.toLocaleString('zh-CN');
            const avgPerDayStr = avgPerDay.toLocaleString('zh-CN');

            showAnalysisPanel(`${text('diff')}: ${formattedDifference}\n${text('timeDiff')}: ${hoursDiff.toFixed(2)}h (${daysDiff.toFixed(2)}d)\n${text('avgHourBuy')}: ${avgPerHourStr}\n${text('avgDayBuy')}: ${avgPerDayStr}`, false);
        }
    }

    // 显示分析结果面板
    function showAnalysisPanel(content, autoClose = false) {
        // 移除已存在的分析面板
        const existingPanel = document.getElementById('analysis-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const analysisDiv = document.createElement('div');
        analysisDiv.id = 'analysis-panel';
        analysisDiv.style.cssText = `
            position: fixed;
            top: 15%; /* 向上移动 */
            left: 50%;
            transform: translate(-50%, 0); /* 只水平居中，不再垂直居中 */
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            color: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            min-width: 320px;
            max-width: 480px;
            white-space: pre-line;
            line-height: 1.6;
        `;

        analysisDiv.innerHTML = content;

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            border: none;
            background: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeButton.onmouseover = () => closeButton.style.color = '#fff';
        closeButton.onmouseout = () => closeButton.style.color = '#ccc';
        closeButton.onclick = () => analysisDiv.remove();
        analysisDiv.appendChild(closeButton);

        document.body.appendChild(analysisDiv);

        // 仅对 autoClose 为 true 时自动关闭
        if (autoClose) {
            setTimeout(() => {
                analysisDiv.remove();
            }, 5000);
        }
    }

    // 从当前显示的历史记录中获取时间
    function getHistoryTimeFromRecord() {
        const historyDetail = document.querySelector('#history-detail');
        if (!historyDetail) {
            return new Date();
        }

        // 查找时间标题
        const timeTitle = historyDetail.querySelector('h3');
        if (timeTitle) {
            const timeText = timeTitle.textContent;
            // 提取时间部分（假设格式为 "日期 时间 [类型]"）
            const timeMatch = timeText.match(/(\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2})/);
            if (timeMatch) {
                return new Date(timeMatch[1]);
            }
        }

        // 如果无法解析，返回当前时间
        return new Date();
    }

    // 计算单元格的累计数量之和
    function calculateSumForCell(targetCell) {
        const historyDetail = document.querySelector('#history-detail');
        if (!historyDetail) {
            return 0;
        }

        // 判断当前单元格属于哪个列表
        const parentRow = targetCell.parentElement;
        const isSellOrder = parentRow.hasAttribute('data-sell-index');

        let sum = 0;
        let foundTarget = false;
        let startCounting = false;

        if (isSellOrder) {
            // 处理卖单列表 - 从第一个数量开始计算
            const sellRows = historyDetail.querySelectorAll('tr[data-sell-index]');
            for (const row of sellRows) {
                const cell = row.querySelector('td:first-child');
                const cellValue = cell?.textContent?.trim();

                if (cell === targetCell) {
                    foundTarget = true;
                    break;
                }

                // 从第一个数量开始计算
                startCounting = true;

                if (startCounting && !foundTarget && cellValue) {
                    const cleanValue = cellValue.replace(/[^\d.,]/g, '');
                    if (cleanValue) {
                        const convertedValue = convertNumber(cellValue);
                        const numValue = parseFloat(convertedValue);
                        if (!isNaN(numValue)) {
                            sum += numValue;
                        }
                    }
                }
            }
        } else {
            // 处理买单列表 - 从第一个数量开始计算
            const buyRows = historyDetail.querySelectorAll('tr[data-buy-index]');
            for (const row of buyRows) {
                const cell = row.querySelector('td:first-child');
                const cellValue = cell?.textContent?.trim();

                if (cell === targetCell) {
                    foundTarget = true;
                    break;
                }

                // 从第一个数量开始计算
                startCounting = true;

                if (startCounting && !foundTarget && cellValue) {
                    const cleanValue = cellValue.replace(/[^\d.,]/g, '');
                    if (cleanValue) {
                        const convertedValue = convertNumber(cellValue);
                        const numValue = parseFloat(convertedValue);
                        if (!isNaN(numValue)) {
                            sum += numValue;
                        }
                    }
                }
            }
        }

        return sum;
    }

    // 检查并清理超出容量的最早记录（异步）
    async function checkAndCleanupStorageLimit() {
        const MAX_SIZE_MB = 4.5;
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
        let allHistory = await loadData();
        let size = await getSize();
        if (size <= MAX_SIZE_BYTES) return;
        // 收集所有记录，按时间排序
        let allRecords = [];
        Object.keys(allHistory).forEach(item => {
            allHistory[item].forEach(record => {
                allRecords.push({
                    item,
                    timestamp: record.timestamp,
                    record
                });
            });
        });
        allRecords.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        while (size > MAX_SIZE_BYTES && allRecords.length > 0) {
            const rec = allRecords.shift();
            allHistory[rec.item] = allHistory[rec.item].filter(r => r !== rec.record);
            if (allHistory[rec.item].length === 0) delete allHistory[rec.item];
            await saveData(allHistory);
            size = await getSize();
        }
    }

    // 主函数
    async function main() {
        // 检查localStorage大小
        checkAndCleanupStorageLimit();
        // 等待市场界面加载
        const marketSelector = "#root > div > div > div.GamePage_gamePanel__3uNKN";
        await waitForElement(marketSelector);
        // 创建UI并开始监视物品数量元素
        watchItemCount();
    }

    // 启动脚本
    main();

    // 多语言支持
    function getLang() {
        // 仅使用localStorage.getItem('i18nextLng')判断
        let lang = (localStorage.getItem('i18nextLng') || '').toLowerCase();
        if (lang.startsWith('zh')) return 'zh';
        if (lang.startsWith('en')) return 'en';
        return 'en'; // 默认英文
    }
    const LANG = getLang();
    const TEXT = {
        zh: {
            readCurrent: '读取当前数据',
            readHistory: '读取历史数据',
            compare: '对比',
            cleanup: '清理自动保存数据',
            settings: '⚙',
            lastUpdate: '最后更新',
            manual: '手动读取',
            auto: '自动读取',
            noHistory: '暂无历史数据',
            marketHistory: '市场历史记录',
            confirmCleanup: '确定要清理所有自动保存的数据吗？此操作不可恢复。',
            confirmDelete: '确定要删除这条记录吗？此操作不可恢复。',
            confirmManualCleanup: days => `确定要删除 ${days} 天前手动保存的所有数据吗？此操作不可恢复。`,
            diff: '差值',
            timeDiff: '时间差',
            avgHourSell: '平均每小时卖出',
            avgDaySell: '平均每天卖出',
            avgHourBuy: '平均每小时买入',
            avgDayBuy: '平均每天买入',
            sell2: '第二个卖单数',
            buy2: '第二个买单数',
            highlight: '已高亮显示匹配的数值',
            close: '关闭',
            cancel: '取消',
            confirm: '确认',
            save: '保存',
            delete: '删除',
            settingsTitle: '设置',
            autoRead: '启用自动读取',
            autoReadDesc: '切换物品时自动记录数据',
            retention: '自动保存数据保留时间',
            manualCleanup: '删除历史手动保存数据',
            manualCleanupDesc: '删除指定天数前的手动保存数据，此操作不可恢复',
            select: '请选择左侧的历史记录查看详情',
            noData: '无数据',
            sell: '卖单',
            buy: '买单',
            quantity: '数量',
            price: '价格',
            daysAgoN: n => `${n}天前`,
            calc: '计算',
            refreshSave: '刷新保存',
        },
        en: {
            readCurrent: 'Read Current Data',
            readHistory: 'Read History',
            compare: 'Compare',
            cleanup: 'Cleanup Auto Data',
            settings: '⚙',
            lastUpdate: 'Last Update',
            manual: 'Manual',
            auto: 'Auto',
            noHistory: 'No history data',
            marketHistory: 'Market History',
            confirmCleanup: 'Are you sure to cleanup all auto-saved data? This action cannot be undone.',
            confirmDelete: 'Are you sure to delete this record? This action cannot be undone.',
            confirmManualCleanup: days => `Are you sure to delete all manual data before ${days} days ago? This action cannot be undone.`,
            diff: 'Diff',
            timeDiff: 'Time Diff',
            avgHourSell: 'Avg Sell/hour',
            avgDaySell: 'Avg Sell/day',
            avgHourBuy: 'Avg Buy/hour',
            avgDayBuy: 'Avg Buy/day',
            sell2: '2nd Sell Qty',
            buy2: '2nd Buy Qty',
            highlight: 'Highlighted matching values',
            close: 'Close',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            delete: 'Delete',
            settingsTitle: 'Settings',
            autoRead: 'Enable Auto Read',
            autoReadDesc: 'Automatically record data when switching items',
            retention: 'Auto Data Retention',
            manualCleanup: 'Delete Manual Data',
            manualCleanupDesc: 'Delete all manual data before specified days, cannot be undone',
            select: 'Please select a record on the left to view details',
            noData: 'No data',
            sell: 'Sell',
            buy: 'Buy',
            quantity: 'Quantity',
            price: 'Price',
            daysAgoN: n => `${n} days ago`,
            calc: 'Calc',
            refreshSave: 'Refresh Save',
        }
    };

    // 在TEXT对象定义后添加：
    function text(key, lang) {
        lang = lang || LANG;
        const val = TEXT[lang][key];
        if (typeof val === 'function') {
            return (...args) => TEXT[lang][key](...args);
        }
        return val !== undefined ? val : key;
    }

    // ========== IndexedDB 基础工具 ==========
    const DB_NAME = 'MWI_Market_History';
    const DB_VERSION = 1;
    const STORE_NAME = 'history';

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = function(e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('item', 'item', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
            request.onsuccess = function(e) {
                resolve(e.target.result);
            };
            request.onerror = function(e) {
                reject(e);
            };
        });
    }

    async function putAll(records) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            for (const rec of records) {
                store.put(rec);
            }
            tx.oncomplete = () => resolve();
            tx.onerror = e => reject(e);
        });
    }

    async function getAll() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = e => reject(e);
        });
    }

    async function deleteByKey(id) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = e => reject(e);
        });
    }

    async function clearStore() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = e => reject(e);
        });
    }

    async function getSize() {
        // 统计所有数据的JSON字符串总字节数
        const all = await getAll();
        let total = 0;
        for (const rec of all) {
            total += JSON.stringify(rec).length * 2;
        }
        return total;
    }
    // ========== IndexedDB 工具 END ==========
})();

