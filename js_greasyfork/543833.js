// ==UserScript==
// @name         Magic Eden批量选择器
// @namespace    https://x.com/NotevenDe
// @version      3.1
// @description  批量选中Magic Eden上的NFT项目，支持部分选中、取消选择和智能刷新
// @author       Not
// @match        https://magiceden.io/*
// @match        https://*.magiceden.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543833/Magic%20Eden%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543833/Magic%20Eden%E6%89%B9%E9%87%8F%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentCollectionName = '';
    let autoRefreshEnabled = true;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // 创建悬浮控制面板的样式
    const panelStyle = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        z-index: 10000;
        background: linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 12px 48px rgba(59, 130, 246, 0.25), 0 4px 20px rgba(59, 130, 246, 0.15);
        min-width: 260px;
        max-width: 320px;
        transition: all 0.3s ease;
        cursor: move;
        backdrop-filter: blur(15px);
        overflow: hidden;
    `;

    const headerStyle = `
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
        padding: 16px 20px 12px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        cursor: move;
        user-select: none;
    `;

    const contentStyle = `
        background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
        padding: 20px;
        border-radius: 0 0 20px 20px;
    `;

    const buttonStyle = `
        width: 100%;
        border: none;
        border-radius: 12px;
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    `;

    const primaryButtonStyle = `
        ${buttonStyle}
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        color: white;
        border: 1px solid rgba(59, 130, 246, 0.3);
    `;

    const secondaryButtonStyle = `
        ${buttonStyle}
        background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
        color: white;
        border: 1px solid rgba(14, 165, 233, 0.3);
    `;

    const dangerButtonStyle = `
        ${buttonStyle}
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: 1px solid rgba(239, 68, 68, 0.3);
    `;

    const sliderStyle = `
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(to right, #e2e8f0 0%, #cbd5e0 100%);
        outline: none;
        opacity: 0.9;
        transition: opacity 0.2s;
        margin: 12px 0;
        cursor: pointer;
        border: 1px solid rgba(59, 130, 246, 0.2);
    `;

    const sliderThumbStyle = `
        input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            cursor: pointer;
            box-shadow: 0 3px 12px rgba(59, 130, 246, 0.4), 0 1px 4px rgba(59, 130, 246, 0.2);
            transition: all 0.2s ease;
            border: 2px solid white;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.6), 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 3px 12px rgba(59, 130, 246, 0.4);
        }

        .dragging {
            cursor: grabbing !important;
            transform: rotate(2deg);
            box-shadow: 0 15px 50px rgba(59, 130, 246, 0.3), 0 8px 25px rgba(59, 130, 246, 0.2);
        }
    `;

    // 添加CSS样式到页面
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = sliderThumbStyle;
        document.head.appendChild(style);
    }

    // 获取NFT集合名称
    function getCollectionName() {
        const pathMatch = window.location.pathname.match(/\/ordinals\/marketplace\/([^\/]+)/);
        if (pathMatch) {
            return pathMatch[1];
        }

        const linkElement = document.querySelector('a[href*="/ordinals/marketplace/"] span');
        if (linkElement) {
            return linkElement.textContent.trim();
        }

        return 'Unknown Collection';
    }

    // 创建拖拽功能
    function makeDraggable(panel) {
        const header = panel.querySelector('#panel-header');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            panel.classList.add('dragging');

            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });

        function onMouseMove(e) {
            if (!isDragging) return;

            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            // 限制在窗口范围内
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            const constrainedX = Math.max(0, Math.min(x, maxX));
            const constrainedY = Math.max(0, Math.min(y, maxY));

            panel.style.left = constrainedX + 'px';
            panel.style.top = constrainedY + 'px';
            panel.style.right = 'auto';
            panel.style.transform = 'none';
        }

        function onMouseUp() {
            isDragging = false;
            panel.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'magic-eden-control-panel';
        panel.style.cssText = panelStyle;

        panel.innerHTML = `
            <div id="panel-header" style="${headerStyle}">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0; color: white; font-size: 16px; font-weight: 700;">NFT批量选择器</h3>
                        <div id="collection-name" style="font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 4px; word-break: break-word;">
                            ${currentCollectionName}
                        </div>
                    </div>
                    <a href="https://x.com/NotevenDe" target="_blank" rel="noopener"
                       style="color: rgba(255,255,255,0.9); text-decoration: none; transition: all 0.2s ease; margin-left: 12px;"
                       onmouseover="this.style.color='white'; this.style.transform='scale(1.1)'"
                       onmouseout="this.style.color='rgba(255,255,255,0.9)'; this.style.transform='scale(1)'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>
                </div>
            </div>

            <div style="${contentStyle}">
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: #1e40af; font-size: 14px; font-weight: 500;">总数量</span>
                        <span id="total-count" style="color: #1e3a8a; font-weight: 700; font-size: 16px;">0</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: #1e40af; font-size: 14px; font-weight: 500;">可添加</span>
                        <span id="available-count" style="color: #0ea5e9; font-weight: 700; font-size: 16px;">0</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: #1e40af; font-size: 14px; font-weight: 500;">已选择</span>
                        <span id="selected-count" style="color: #ef4444; font-weight: 700; font-size: 16px;">0</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="color: #1e40af; font-size: 13px; font-weight: 500; display: block; margin-bottom: 8px;">
                        选择比例: <span id="percentage" style="color: #3b82f6; font-weight: 700;">0%</span>
                    </label>
                    <input type="range" id="selection-slider" min="0" max="100" value="0"
                           style="${sliderStyle}">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 500;">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <button id="refresh-count" style="${secondaryButtonStyle}">
                        🔄 刷新统计
                    </button>

                    <div style="display: flex; gap: 8px;">
                        <button id="bulk-select" style="${primaryButtonStyle} flex: 1;" disabled>
                            ➕ 选择
                        </button>
                        <button id="bulk-deselect" style="${dangerButtonStyle} flex: 1;" disabled>
                            ➖ 取消
                        </button>
                    </div>

                    <div style="display: flex; gap: 8px; align-items: center; justify-content: center; margin-top: 8px;">
                        <label style="display: flex; align-items: center; font-size: 13px; color: #1e40af; cursor: pointer; font-weight: 500;">
                            <input type="checkbox" id="auto-refresh" checked
                                   style="margin-right: 8px; width: 16px; height: 16px; accent-color: #3b82f6;">
                            自动刷新
                        </label>
                    </div>
                </div>

                <div id="status-message" style="margin-top: 12px; font-size: 12px; text-align: center; color: #1e40af; min-height: 16px; font-weight: 500; padding: 8px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.15) 100%); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2);">
                    点击"刷新统计"开始
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);
        return panel;
    }

    // 获取所有NFT项目的添加按钮（未选择的）
    function getAddButtons() {
        const buttons = document.querySelectorAll('button[data-test-id=""]');

        return Array.from(buttons).filter(button => {
            const svg = button.querySelector('svg');
            if (!svg) return false;

            const lines = svg.querySelectorAll('line');
            if (lines.length !== 2) return false;

            const line1 = lines[0];
            const line2 = lines[1];

            return (line1.getAttribute('x1') === '12' && line1.getAttribute('x2') === '12' &&
                    line2.getAttribute('y1') === '12' && line2.getAttribute('y2') === '12');
        });
    }

    // 获取所有取消选择按钮（已选择的）
    function getRemoveButtons() {
        const selectedButtons = document.querySelectorAll('button[data-test-id="item-selected"]');

        return Array.from(selectedButtons).filter(button => {
            const svg = button.querySelector('svg');
            if (!svg) return false;

            const polyline = svg.querySelector('polyline');
            if (polyline) {
                const points = polyline.getAttribute('points');
                return points && points.includes('20 6 9 17 4 12');
            }

            return false;
        });
    }

    // 获取所有NFT项目
    function getAllNFTItems() {
        return document.querySelectorAll('[data-index]');
    }

    // 更新统计信息
    function updateStats() {
        const addButtons = getAddButtons();
        const removeButtons = getRemoveButtons();
        const totalItems = getAllNFTItems().length;

        const availableCount = addButtons.length;
        const selectedCount = removeButtons.length;

        // 更新集合名称
        currentCollectionName = getCollectionName();
        const collectionElement = document.getElementById('collection-name');
        if (collectionElement) {
            collectionElement.textContent = currentCollectionName;
        }

        // 更新计数
        document.getElementById('total-count').textContent = totalItems;
        document.getElementById('available-count').textContent = availableCount;
        document.getElementById('selected-count').textContent = selectedCount;

        const slider = document.getElementById('selection-slider');
        const selectCount = Math.floor(availableCount * (slider.value / 100));
        document.getElementById('percentage').textContent = slider.value + '%';

        // 更新按钮状态
        const bulkSelectBtn = document.getElementById('bulk-select');
        const bulkDeselectBtn = document.getElementById('bulk-deselect');

        if (availableCount > 0) {
            bulkSelectBtn.disabled = false;
            bulkSelectBtn.textContent = selectCount > 0 ? `➕ 添加 ${selectCount}` : '➕ 添加 0';
        } else {
            bulkSelectBtn.disabled = true;
            bulkSelectBtn.textContent = '➕ 无可添加';
        }

        if (selectedCount > 0) {
            bulkDeselectBtn.disabled = false;
            bulkDeselectBtn.textContent = `➖ 取消 ${selectedCount}`;
        } else {
            bulkDeselectBtn.disabled = true;
            bulkDeselectBtn.textContent = '➖ 无已选择';
        }

        // 更新状态消息
        let statusMessage = '';
        if (totalItems === 0) {
            statusMessage = '未找到NFT项目';
        } else if (availableCount === 0 && selectedCount === 0) {
            statusMessage = '正在加载NFT数据...';
        } else {
            statusMessage = `${currentCollectionName} - 可添加${availableCount}个，已选${selectedCount}个`;
        }

        document.getElementById('status-message').textContent = statusMessage;

        return { totalItems, availableCount, selectedCount, selectCount };
    }

    // 刷新统计
    function refreshCount() {
        const refreshBtn = document.getElementById('refresh-count');
        const originalText = refreshBtn.textContent;

        refreshBtn.textContent = '🔄 统计中...';
        refreshBtn.disabled = true;

        setTimeout(() => {
            const stats = updateStats();
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;

            console.log('统计更新:', stats);
        }, 500);
    }

    // 随机选择指定数量的按钮
    function getRandomButtons(buttons, count) {
        if (count >= buttons.length) return buttons;

        const shuffled = [...buttons].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // 批量选择
    function bulkSelect() {
        const addButtons = getAddButtons();
        const slider = document.getElementById('selection-slider');
        const selectCount = Math.floor(addButtons.length * (slider.value / 100));

        if (selectCount === 0) {
            document.getElementById('status-message').textContent = '请选择要添加的数量';
            return;
        }

        const confirmed = confirm(`确定要添加 ${selectCount}/${addButtons.length} 个NFT项目吗？`);
        if (!confirmed) return;

        executeOperation(getRandomButtons(addButtons, selectCount), '添加', '➕');
    }

    // 批量取消选择
    function bulkDeselect() {
        const removeButtons = getRemoveButtons();

        if (removeButtons.length === 0) {
            document.getElementById('status-message').textContent = '没有已选择的NFT';
            return;
        }

        const confirmed = confirm(`确定要取消选择所有 ${removeButtons.length} 个NFT项目吗？`);
        if (!confirmed) return;

        executeOperation(removeButtons, '取消', '➖');
    }

    // 快速批量执行（优化版）
    function executeOperation(buttons, actionName, icon) {
        const bulkSelectBtn = document.getElementById('bulk-select');
        const bulkDeselectBtn = document.getElementById('bulk-deselect');
        const originalSelectText = bulkSelectBtn.textContent;
        const originalDeselectText = bulkDeselectBtn.textContent;

        bulkSelectBtn.disabled = true;
        bulkDeselectBtn.disabled = true;
        bulkSelectBtn.textContent = `${icon} ${actionName}中...`;

        let completedCount = 0;
        const totalCount = buttons.length;

        // 快速批量模式：分批并发执行
        const batchSize = 8; // 每批8个，平衡速度和稳定性
        let currentBatch = 0;

        function processBatch() {
            const startIndex = currentBatch * batchSize;
            const endIndex = Math.min(startIndex + batchSize, totalCount);
            const currentButtons = buttons.slice(startIndex, endIndex);

            // 并发点击当前批次的按钮
            currentButtons.forEach((button, index) => {
                setTimeout(() => {
                    try {
                        // 模拟鼠标悬停
                        const container = button.closest('.group');
                        if (container) {
                            container.classList.add('hover');
                        }

                        button.click();
                        completedCount++;

                        const progress = Math.round((completedCount / totalCount) * 100);
                        bulkSelectBtn.textContent = `${icon} ${actionName}中 ${progress}%`;
                        document.getElementById('status-message').textContent =
                            `快速${actionName}中... ${completedCount}/${totalCount}`;

                        // 如果所有操作完成
                        if (completedCount >= totalCount) {
                            bulkSelectBtn.textContent = `${icon} ${actionName}完成`;
                            document.getElementById('status-message').textContent =
                                `完成！快速${actionName}了 ${completedCount} 个NFT`;

                            setTimeout(() => {
                                bulkSelectBtn.textContent = originalSelectText;
                                bulkDeselectBtn.textContent = originalDeselectText;
                                refreshCount(); // 自动刷新统计
                            }, 1500);
                        }
                    } catch (error) {
                        console.error(`${actionName}失败:`, error);
                        completedCount++; // 确保进度继续
                    }
                }, index * 15); // 每个按钮间隔15ms，快速执行
            });

            currentBatch++;
            // 如果还有剩余批次，继续处理
            if (currentBatch * batchSize < totalCount) {
                setTimeout(processBatch, 80); // 批次间隔80ms
            }
        }

        processBatch();
    }

    // 自动刷新功能
    function setupAutoRefresh() {
        let lastStats = { total: 0, available: 0, selected: 0 };

        setInterval(() => {
            if (!autoRefreshEnabled) return;

            const panel = document.getElementById('magic-eden-control-panel');
            if (!panel) return;

            const addButtons = getAddButtons();
            const removeButtons = getRemoveButtons();
            const totalItems = getAllNFTItems().length;

            const currentStats = {
                total: totalItems,
                available: addButtons.length,
                selected: removeButtons.length
            };

            if (currentStats.total !== lastStats.total ||
                currentStats.available !== lastStats.available ||
                currentStats.selected !== lastStats.selected) {

                lastStats = currentStats;
                updateStats();
                console.log('自动刷新: NFT状态变化', currentStats);
            }
        }, 2000);
    }

    // 初始化事件监听器
    function initEventListeners() {
        const slider = document.getElementById('selection-slider');
        slider.addEventListener('input', updateStats);

        document.getElementById('refresh-count').addEventListener('click', refreshCount);
        document.getElementById('bulk-select').addEventListener('click', bulkSelect);
        document.getElementById('bulk-deselect').addEventListener('click', bulkDeselect);

        const autoRefreshCheckbox = document.getElementById('auto-refresh');
        autoRefreshCheckbox.addEventListener('change', (e) => {
            autoRefreshEnabled = e.target.checked;
            console.log('自动刷新:', autoRefreshEnabled ? '开启' : '关闭');
        });
    }

    // 等待页面加载完成
    function waitForPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPlugin);
        } else {
            initPlugin();
        }
    }

    // 初始化插件
    function initPlugin() {
        const isNFTListPage = document.querySelector('[data-test-id="grid-container"]') !== null;

        if (!isNFTListPage) {
            return;
        }

        setTimeout(() => {
            if (document.getElementById('magic-eden-control-panel')) {
                return;
            }

            currentCollectionName = getCollectionName();

            addCustomStyles();
            createControlPanel();
            initEventListeners();
            setupAutoRefresh();

            setTimeout(refreshCount, 1000);

            console.log('Magic Eden批量选择器已加载 - 优化版');
        }, 1000);
    }

    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const hasGridContainer = document.querySelector('[data-test-id="grid-container"]');
                    const hasPanel = document.getElementById('magic-eden-control-panel');

                    if (hasGridContainer && !hasPanel) {
                        setTimeout(initPlugin, 500);
                    } else if (!hasGridContainer && hasPanel) {
                        hasPanel.remove();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动插件
    waitForPageLoad();
    observePageChanges();

})();