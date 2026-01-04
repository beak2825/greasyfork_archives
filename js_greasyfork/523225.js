// ==UserScript==
// @name         solscan交易辅助脚本
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  pump.fun自定义交易按钮位置和点击序列
// @author       sunsanxiao
// @match        https://photon-sol.tinyastro.io/zh/lp/*
// @match        https://photon-sol.tinyastro.io/en/lp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523225/solscan%E4%BA%A4%E6%98%93%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523225/solscan%E4%BA%A4%E6%98%93%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 优化配置选项和常量
    const CONFIG = {
        enabled: false,
        clickDelay: 70,
        colors: {
            buy: '#4CAF50',
            sell: '#f44336',
            set: '#2196F3',
            clear: '#757575',
            disabled: '#cccccc'
        },
        buttonSizes: {
            normal: { width: '50px', height: '25px' },
            wide: { width: '60px', height: '25px' }
        },
        defaultPosition: { x: 20, y: 50 }
    };

    // 优化控制面板样式
    const PANEL_STYLES = {
        panel: `
            position: fixed;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 8px;
            color: white;
            z-index: 9999;
            display: flex;
            flex-direction: row;
            gap: 5px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            align-items: center;
            cursor: move;
            user-select: none;
        `,
        button: (color, size) => `
            width: ${size.width};
            height: ${size.height};
            background: ${color};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: ${size.width === '60px' ? '11px' : '12px'};
        `,
        status: `
            font-size: 11px;
            text-align: center;
            padding: 3px 8px;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
            min-width: 60px;
        `
    };

    // 优化创建按钮的函数
    function createButton(id, text, color, size) {
        return `<button id="${id}" style="${PANEL_STYLES.button(color, size)}">${text}</button>`;
    }

    // 状态变量
    let isSettingBuyPoints = false;
    let isSettingSellPoints = false;
    let buyPoints = JSON.parse(localStorage.getItem('buyPoints')) || [];
    let sellPoints = JSON.parse(localStorage.getItem('sellPoints')) || [];

    // 创建控制面板
    function createControlPanel() {
        const savedPosition = JSON.parse(localStorage.getItem('panelPosition')) || CONFIG.defaultPosition;

        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="tradePanel" style="${PANEL_STYLES.panel}; transform: translate(${savedPosition.x}px, ${savedPosition.y}px);">
                <div style="display: flex; gap: 5px;">
                    ${createButton('buyBtn', '买入', CONFIG.colors.buy, CONFIG.buttonSizes.normal)}
                    ${createButton('sellBtn', '卖出', CONFIG.colors.sell, CONFIG.buttonSizes.normal)}
                </div>
                <div style="display: flex; gap: 5px;">
                    ${createButton('setBuyBtn', '设买点', CONFIG.colors.set, CONFIG.buttonSizes.wide)}
                    ${createButton('setSellBtn', '设卖点', CONFIG.colors.set, CONFIG.buttonSizes.wide)}
                </div>
                ${createButton('clearBtn', '清除', CONFIG.colors.clear, CONFIG.buttonSizes.normal)}
                <div id="status" style="${PANEL_STYLES.status}">就绪</div>
            </div>
        `;

        document.body.appendChild(panel);
        setupDragAndDrop(panel, savedPosition);
        setupButtonEvents(panel);
    }

    // 优化拖拽功能
    function setupDragAndDrop(panel, savedPosition) {
        const tradePanel = panel.querySelector('#tradePanel');
        let isDragging = false;
        let currentX = savedPosition.x;
        let currentY = savedPosition.y;
        let initialX, initialY;
        let xOffset = savedPosition.x;
        let yOffset = savedPosition.y;

        const dragStart = (e) => {
            if (e.target.tagName === 'BUTTON') return;

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === tradePanel || e.target.parentElement === tradePanel) {
                isDragging = true;
            }
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;

            const maxX = window.innerWidth - tradePanel.offsetWidth;
            const maxY = window.innerHeight - tradePanel.offsetHeight;
            currentX = Math.min(Math.max(0, currentX), maxX);
            currentY = Math.min(Math.max(0, currentY), maxY);

            setTranslate(currentX, currentY, tradePanel);
            savePosition(currentX, currentY);
        };

        const dragEnd = () => {
            if (isDragging) {
                savePosition(currentX, currentY);
            }
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        };

        tradePanel.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    }

    // 优化位置保存
    function savePosition(x, y) {
        localStorage.setItem('panelPosition', JSON.stringify({ x, y }));
    }

    // 优化按钮事件设置
    function setupButtonEvents(panel) {
        const buttons = panel.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => button.style.opacity = '0.8');
            button.addEventListener('mouseout', () => button.style.opacity = '1');
        });

        panel.querySelector('#buyBtn').onclick = executeBuySequence;
        panel.querySelector('#sellBtn').onclick = executeSellSequence;
        panel.querySelector('#setBuyBtn').onclick = startSettingBuyPoints;
        panel.querySelector('#setSellBtn').onclick = startSettingSellPoints;
        panel.querySelector('#clearBtn').onclick = clearAllPoints;
    }

    // 更新状态显示
    function updateStatus(text) {
        const status = document.getElementById('status');
        status.textContent = text;
    }

    // 开始设置买入点
    function startSettingBuyPoints() {
        isSettingBuyPoints = true;
        isSettingSellPoints = false;
        buyPoints = [];
        updateStatus('请点击需要记录的买入点位置');
        document.addEventListener('click', recordBuyPoint);
    }

    // 开始设置卖出点
    function startSettingSellPoints() {
        isSettingSellPoints = true;
        isSettingBuyPoints = false;
        sellPoints = [];
        updateStatus('请点击需要记录的卖出点位置');
        document.addEventListener('click', recordSellPoint);
    }

    // 记录买入点
    function recordBuyPoint(e) {
        if (!isSettingBuyPoints) return;

        e.preventDefault();
        e.stopPropagation();

        // 修改第一次点击的逻辑
        if (buyPoints.length === 0) {
            updateStatus('请点击需要记录的买入点位置');
        }

        buyPoints.push({
            x: e.clientX,
            y: e.clientY
        });

        showClickMarker(e.clientX, e.clientY, '#4CAF50');
        if (buyPoints.length > 1) {
            updateStatus(`已记录${buyPoints.length-1}个操作点位`);
        }
        localStorage.setItem('buyPoints', JSON.stringify(buyPoints));

        if (e.key === 'Escape') {
            stopSettingPoints();
        }
    }

    // 记录卖出点
    function recordSellPoint(e) {
        if (!isSettingSellPoints) return;

        e.preventDefault();
        e.stopPropagation();

        // 修改第一次点击的逻辑
        if (sellPoints.length === 0) {
            updateStatus('请点击需要记录的卖出点位置');
        }

        sellPoints.push({
            x: e.clientX,
            y: e.clientY
        });

        showClickMarker(e.clientX, e.clientY, '#f44336');
        if (sellPoints.length > 1) {
            updateStatus(`已记录${sellPoints.length-1}个操作点位`);
        }
        localStorage.setItem('sellPoints', JSON.stringify(sellPoints));

        if (e.key === 'Escape') {
            stopSettingPoints();
        }
    }

    // 显示点击标记
    function showClickMarker(x, y, color) {
        const marker = document.createElement('div');
        marker.style.cssText = `
            position: fixed;
            left: ${x - 5}px;
            top: ${y - 5}px;
            width: 10px;
            height: 10px;
            background: ${color};
            border-radius: 50%;
            z-index: 9998;
            pointer-events: none;
        `;
        document.body.appendChild(marker);
    }

    // 停止设置点
    function stopSettingPoints() {
        isSettingBuyPoints = false;
        isSettingSellPoints = false;
        document.removeEventListener('click', recordBuyPoint);
        document.removeEventListener('click', recordSellPoint);
        updateStatus('设置完成');
    }

    // 执行买入序列
    async function executeBuySequence() {
        if (buyPoints.length <= 1) {
            updateStatus('请至少设置2个买入点');
            return;
        }

        if (this.isExecutingBuy) return;

        try {
            this.isExecutingBuy = true;
            const buyBtn = document.getElementById('buyBtn');
            buyBtn.style.backgroundColor = '#cccccc';

            // 从第二个点位开始执行
            for (let i = 1; i < buyPoints.length; i++) {
                const point = buyPoints[i];
                simulateClick(point.x, point.y);
                // 只在必要时添加最小延迟
                if (i < buyPoints.length - 1) {
                    await sleep(CONFIG.clickDelay);
                }
            }

            buyBtn.style.backgroundColor = '#4CAF50';
            updateStatus('买入操作完成');
        } finally {
            this.isExecutingBuy = false;
        }
    }

    // 执行卖出序列
    async function executeSellSequence() {
        if (sellPoints.length <= 1) {
            updateStatus('请至少设置2个卖出点');
            return;
        }

        if (this.isExecutingSell) return;

        try {
            this.isExecutingSell = true;
            const sellBtn = document.getElementById('sellBtn');
            sellBtn.style.backgroundColor = '#cccccc';

            // 从第二个点位开始执行
            for (let i = 1; i < sellPoints.length; i++) {
                const point = sellPoints[i];
                simulateClick(point.x, point.y);
                // 只在必要时添加最小延迟
                if (i < sellPoints.length - 1) {
                    await sleep(CONFIG.clickDelay);
                }
            }

            sellBtn.style.backgroundColor = '#f44336';
            updateStatus('卖出操作完成');
        } finally {
            this.isExecutingSell = false;
        }
    }

    // 模拟点击
    function simulateClick(x, y) {
        const element = document.elementFromPoint(x, y);
        if (element) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y
            });
            element.dispatchEvent(clickEvent);
        }
        return Promise.resolve(); // 直接返回resolved promise
    }

    // 清除所有设置点
    function clearAllPoints() {
        buyPoints = [];
        sellPoints = [];
        localStorage.removeItem('buyPoints');
        localStorage.removeItem('sellPoints');
        updateStatus('已清除所有设置');

        // 清除所有标记
        const markers = document.querySelectorAll('.click-marker');
        markers.forEach(marker => marker.remove());

        // 重置按钮状态
        const buyBtn = document.getElementById('buyBtn');
        const sellBtn = document.getElementById('sellBtn');

        // 恢复按钮颜色
        buyBtn.style.backgroundColor = '#4CAF50';
        sellBtn.style.backgroundColor = '#f44336';
    }

    // 工具函数：延时
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 添加ESC键监听
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            stopSettingPoints();
        }
    });

    // 初始化
    createControlPanel();
})();