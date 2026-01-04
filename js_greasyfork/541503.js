// ==UserScript==
// @name         炼金模拟器 color
// @namespace    http://tampermonkey.net/
// @version      v29
// @description  这是炼金模拟器，包括了期望方差风险的估算，
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       Redbean
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://test.milkywayidlecn.com/*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/ml-fft@1.3.5/dist/ml-fft.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @require      https://update.greasyfork.org/scripts/541207/1646092/item-data%20v20250820.js
// @require      https://update.greasyfork.org/scripts/541208/1616568/alchemyDetail%20v10.js
// @require      https://update.greasyfork.org/scripts/541343/1636422/alchemy-calculator.js
// @require      https://update.greasyfork.org/scripts/541211/1646102/alchemy-data%20v250820.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541503/%E7%82%BC%E9%87%91%E6%A8%A1%E6%8B%9F%E5%99%A8%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/541503/%E7%82%BC%E9%87%91%E6%A8%A1%E6%8B%9F%E5%99%A8%20color.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加自定义样式
     GM_addStyle(`
    /* 风险等级样式（加大字体） */
    .alchemy-simulator-modal .result-value .profit { color: #4CAF50; }  /* 盈利率绿色 */
    .alchemy-simulator-modal .result-value .loss { color: #f44336; }    /* 亏利率红色 */
    .alchemy-simulator-modal #Risk {
        font-weight: bold;
        border-radius: 4px;
    }
    /* 不同风险等级颜色 */
    .alchemy-simulator-modal #Risk.profit {
        color: #4CAF50;
    }
    .alchemy-simulator-modal #Risk.loss {
        color: #f44336;
    }
    .alchemy-simulator-modal #Risk.high-risk {
        color: #ff8c00;
    }
    .alchemy-simulator-modal #Risk.extreme-risk {
        color: #ff0000;
    }

    .alchemy-simulator-modal.hidden {
        display: none;
    }

    button[data-custom="alchemy-simulator"] .MuiBadge-root {
        color: #0dcaf0;
        padding: 5px 15px;
        font-size: 1rem;
    }

    /* API加载中的视觉效果 */
    .alchemy-simulator-modal .loading-price {
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="%23ccc" fill="none" stroke-width="8" stroke-dasharray="62.83 62.83" transform="rotate(90 50 50)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50"/></circle></svg>') no-repeat right center;
        background-size: 20px;
    }

    .alchemy-simulator-modal .loading-price {
        color: #999 !important;
        font-style: italic;
    }

    /* 错误状态 */
    .alchemy-simulator-modal .error-price {
        color: #ff6b6b;
        animation: shake 0.5s;
    }

    /* 模态框样式 - 调整为600px宽度 */
    .alchemy-simulator-modal {
        position: absolute;
        top: 100px;
        left: 250px;
        transform: none;
        width: 600px;
        max-width: 95vw;
        max-height: 90vh;
        background: rgb(25 118 210 / 50%);
        border-radius: 20px;
        box-shadow: 0 4px 35px rgb(9 184 204);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 5px solid #00ffff9e;
    }

    .alchemy-simulator-modal .alchemy-simulator-header {
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 25px 0px 25px;
        background-color: #1f6f9a82;
    }

    .alchemy-simulator-modal .output-quantity {
        width: 50%;
    }

    .alchemy-simulator-modal .output-allquantity {
        width: 50%;
    }

    .alchemy-simulator-modal .alchemy-simulator-title {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
    }

    .alchemy-simulator-modal .alchemy-simulator-close {
        background: none;
        border: none;
        color: #ff6b6b;
        font-size: 20px;
        cursor: pointer;
        padding: 5px;
        transition: transform 0.2s;
    }

    .alchemy-simulator-modal .alchemy-simulator-close:hover {
        transform: scale(1.2);
    }

    .alchemy-simulator-modal .alchemy-simulator-content {
        flex: 1;
        padding: 5px;
        overflow-y: auto;
        color: #fff;
    }

    .alchemy-simulator-modal .container {
        width: 100%;
        background: #00ffff52;
        border-radius: 10px;
        box-shadow: 0 4px 20px #00ffff9e;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(212, 175, 55, 0.1);
        overflow-x: auto;
    }

    .alchemy-simulator-modal h1 {
        text-align: center;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 300;
        letter-spacing: 1px;
        color: var(--accent);
        position: relative;
    }

    .alchemy-simulator-modal h1::after {
        content: "";
        display: block;
        width: 60px;
        height: 2px;
        background: var(--accent);
        margin: 8px auto 0;
        opacity: 0.6;
    }

    .alchemy-simulator-modal .input-row {
        display: flex;
        justify-content: space-evenly;
        gap: 5px;
    }

    .alchemy-simulator-modal .control-group {
        flex: 1 1 calc(33% - 8px);
        min-width: 100px;
        text-align: center;
        margin-bottom: 8px;
    }

    .alchemy-simulator-modal label {
        display: block;
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
        opacity: 0.8;
        white-space: nowrap;
    }

    .alchemy-simulator-modal input {
        width: 100%;
        padding: 0.1rem;
        background: rgb(37 40 42 / 75%);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 6px;
        color: var(--text);
        text-align: center;
        font-size: 0.75rem;
        transition: all 0.3s ease;
    }

    .alchemy-simulator-modal input:focus,
    .alchemy-simulator-modal select:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }

    .alchemy-simulator-modal input::placeholder {
        color: rgba(0, 51, 102, 0.3);
    }

    .alchemy-simulator-modal .btn {
        background: linear-gradient(135deg, var(--primary), #004080);
        color: white;
        border: none;
        padding: 0.3rem 0.7rem;
        border-radius: 10px;
        cursor: pointer;
        font-size: 0.9rem;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
    }

    .alchemy-simulator-modal .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 53, 102, 0.3);
    }

    .alchemy-simulator-modal .btn:active {
        transform: translateY(0);
    }

    .result-row {
        display: flex;
        justify-content: space-around;
        margin-top: 0.3rem;
        flex-wrap: wrap;
        gap: 2px;
        font-size: 0.8rem;
    }

    .alchemy-simulator-modal .result-box {
        text-align: center;
        padding: 0.4rem;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        min-width: 100px;
        flex: 1;
        margin-top: 1px;
    }

    .alchemy-simulator-modal .result-value {
        font-size: 0.9rem;
        font-weight: bold;
    }

    .alchemy-simulator-modal .result-value.profit {
    color: #4CAF50 !important; /* 绿色 */
    }

    .alchemy-simulator-modal .result-value.loss {
    color: #f44336 !important; /* 红色 */
    }

    .alchemy-simulator-modal .output-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0 0 0.3rem
        font-size: 0.85rem;
    }

    .alchemy-simulator-modal .output-table th,
    .alchemy-simulator-modal .output-table td {
        border: 1px solid rgb(29 229 253);
        padding: 0.35rem;
        text-align: center;
    }

    .alchemy-simulator-modal .output-table th {
        background: rgba(0, 51, 102, 0.3);
    }

    .alchemy-simulator-modal .output-table tr:nth-child(even) {
        background: rgb(24 108 136);
    }

    /* 价格选择器样式 */
    .alchemy-simulator-modal .price-selector {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 0.5rem 0;
        gap: 8px;
    }

    .alchemy-simulator-modal .catalyst-selector {
        padding: 8px;
        width: 33%;
        flex: 1;
        background: #16457585;
        border-radius: 8px;
        font-size: 0.85rem;
    }

    .alchemy-simulator-modal .catalyst-selector label {
        margin-bottom: 0.3rem;
        display: block;
    }

    .alchemy-simulator-modal .catalyst-selector select {
        width: 80%;
        padding: 0.3rem;
        border-radius: 10px;
        font-size: 0.8rem;
    }

    /* 响应式调整 */
    @media (max-width: 600px) {
        .alchemy-simulator-modal .control-group {
            flex: 1 1 100%;
        }

        .alchemy-simulator-modal .price-selector {
            flex-direction: column;
        }

        .alchemy-simulator-modal .catalyst-selector {
            width: 100%;
        }
    }

    /* 自动完成样式 */
    .ui-autocomplete {
        max-height: 300px;
        width: 150px;
        overflow-y: auto;
        overflow-x: hidden;
        background: #3385d9bf;
        border: 1px solid #15fffd;
        z-index: 99999 !important;
    }

    .ui-menu-item {
        border-bottom: 1px solid #333;
        color: #fff;
        cursor: pointer;
    }

    .ui-menu-item:hover {
        background: rgb(9 184 204);
        box-shadow: 0 4px 35px rgb(9 184 204);
    }

    .ui-state-focus {
        background: #004080 !important;
        border-color: #004080 !important;
    }
`);
    //Bouns
    const CATALYST_BONUS = {
    "catalyst_of_transmutation": 0.15,
    "prime_catalyst": 0.25,
    "": 0
    };
    const BASE_TEA = 1; // 基础值
    const TEA_BONUS = 0.05; // 基础增幅5%
    function updateSuccessRate() {
    const baseRate = parseFloat(document.getElementById('nonesuccessRate').value) || 0;
    const catalystType = document.getElementById('catalystType').value;
    const pouchMultiplier = parseFloat(document.getElementById('GuzzlingPouch').value);

    // 茶增幅作用于基础成功率，催化剂增幅额外叠加
    const teaBonus = 0.05 * pouchMultiplier; // 茶基础5% × 暴饮系数
    const catalystBonus = CATALYST_BONUS[catalystType] || 0;
    const finalRate = baseRate * (1 + teaBonus) + (baseRate * catalystBonus);

    document.getElementById('successRate').value = Math.min(100, finalRate).toFixed(2);
}
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAlchemySimulatorTab);
    } else {
        addAlchemySimulatorTab();
    }
    let currentMaterialMode = 'ask'; // 默认值
    let currentOutputMode = 'ask';
    let alchemyData = {};

    // 添加findTabByText函数定义
function findTabByText(text) {
    // 查找包含指定文本的标签页元素
    const tabs = document.querySelectorAll('.MuiTab-root');
    for (const tab of tabs) {
        if (tab.textContent.includes(text)) {
            return tab;
        }
    }
    return null;
}

// addAlchemySimulatorTab函数
function addAlchemySimulatorTab() {
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        const currentActionTab = findTabByText('转化');
        const myListingsTab = findTabByText('我的挂牌');

        if (currentActionTab && !document.querySelector('button[data-custom="alchemy-simulator"]')) {
            insertSimulatorTab(currentActionTab);
        }

        if (myListingsTab && !document.querySelector('button[data-custom="alchemy-simulator-listings"]')) {
            insertSimulatorTab(myListingsTab, 'listings');
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查
    const currentActionTab = findTabByText('转化');
    const myListingsTab = findTabByText('我的挂牌');

    if (currentActionTab) {
        insertSimulatorTab(currentActionTab);
    }

    if (myListingsTab) {
        insertSimulatorTab(myListingsTab, 'listings');
    }
}

// insertSimulatorTab函数保持不变
function insertSimulatorTab(targetTab, type = 'default') {
    const simulatorTab = targetTab.cloneNode(true);

    if (type === 'listings') {
        simulatorTab.setAttribute('data-custom', 'alchemy-simulator-listings');
    } else {
        simulatorTab.setAttribute('data-custom', 'alchemy-simulator');
    }

    simulatorTab.removeAttribute('aria-selected');
    simulatorTab.removeAttribute('tabindex');
    simulatorTab.classList.remove('Mui-selected');

    const badgeSpan = simulatorTab.querySelector('.MuiBadge-root');
    if (badgeSpan) {
        badgeSpan.textContent = '炼金模拟器';
        const badge = badgeSpan.querySelector('.MuiBadge-badge');
        if (badge) {
            badge.innerHTML = '';
        }
    }

    targetTab.parentNode.insertBefore(simulatorTab, targetTab.nextSibling);

    simulatorTab.addEventListener('click', function() {
        openAlchemySimulator();
        console.log('炼金模拟器被点击');
    });
}

    // 在初始化函数中添加结果框的事件监听
function initializeResultBoxInteractions() {
    document.querySelectorAll('.result-box').forEach(box => {
        box.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                copyToChat(box); // 传递整个结果框元素
                e.preventDefault();
            }
        });
    });
}

// 复制到聊天框的函数
function copyToChat() {
    try {
        const materialPriceMode = document.querySelector('select[name="materialPriceMode"]')?.value || 'ask';
        const outputPriceMode = document.querySelector('select[name="outputPriceMode"]')?.value || 'ask';
        const inputItem = document.querySelector('.alchemy-text')?.value || '未知物品';
        const simulateTimes = document.getElementById('simulateTimes')?.value || '0';
        const catalystType = document.getElementById('catalystType')?.value || '无';
        const catalystName =
            catalystType === 'prime_catalyst' ? '至高催化剂' :
            catalystType === 'catalyst_of_transmutation' ? '转化催化剂' : '无';
        const guzzlingPouchSelect = document.getElementById('GuzzlingPouch');
        const guzzlingPouchText = guzzlingPouchSelect?.options[guzzlingPouchSelect.selectedIndex]?.text || '无';
        const guzzlingPouchLevel = guzzlingPouchText === '无' ? '无' :
                                 guzzlingPouchText.match(/\+(\d+)/)?.[1] || '0';
        const getLatestValue = (selector) => {
            const el = document.querySelector(selector);
            if (!el) return '0';
            return el.value ?? el.textContent?.trim() ?? '0';
        };
        const outputText = `炼金模拟器数据：转化物品:${inputItem}  物品数量:${simulateTimes}  收益模式: ${materialPriceMode === 'ask' ? '左买' : '右买'}${outputPriceMode === 'ask' ? '左卖' : '右卖'}   催化剂:${catalystName}  暴饮之囊:${guzzlingPouchLevel}  成本:${getLatestValue('#totalCost')}  最大盈:${getLatestValue('#byprofit')}  最大亏:${getLatestValue('#byLoss')}  期望:${getLatestValue('#expectation')}  正收益&总次数:${getLatestValue('#Besimulationsisk')}  正收益概率:${getLatestValue('#positivereturn')}  风险评估:${getLatestValue('#Risk')}`;
        const chatInput = document.querySelector('input.Chat_chatInput__16dhX');
        if (!chatInput) {
            console.error('错误：未找到聊天输入框');
            return;
        }
        chatInput.focus();
        chatInput.select();
        if (document.execCommand) {
            document.execCommand('insertText', false, outputText);
        }
        else if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(outputText).then(() => {
                document.execCommand('paste');
            });
        }
        else {
            const startPos = chatInput.selectionStart;
            chatInput.value =
                chatInput.value.substring(0, startPos) +
                outputText +
                chatInput.value.substring(chatInput.selectionEnd);
            ['input', 'change', 'keydown', 'keyup'].forEach(type => {
                chatInput.dispatchEvent(new Event(type, { bubbles: true }));
            });
        }
        console.log('成功插入消息：', outputText);
    } catch (e) {
        console.error('复制失败：', e);
    }
}

    function openAlchemySimulator() {
        // 如果已经存在模态框，则不再创建
        const existingModal = document.querySelector('.alchemy-simulator-modal');
        if (existingModal) {
        // 如果存在且隐藏，则显示它
        if (existingModal.classList.contains('hidden')) {
            existingModal.classList.remove('hidden');
            return;
        }
        // 如果已经显示，则不做任何操作
        return;
    }
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'alchemy-simulator-modal';
        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;
        // 创建头部
        const header = document.createElement('div');
        header.className = 'alchemy-simulator-header';
        header.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - modal.getBoundingClientRect().left;
        offsetY = e.clientY - modal.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        modal.style.left = (e.clientX - offsetX) + 'px';
        modal.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

        const title = document.createElement('div');
        title.className = 'alchemy-simulator-title';
        title.textContent = '炼金转化模拟器v28 | By MapleRedbean';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'alchemy-simulator-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
        modal.classList.add('hidden'); // 改为隐藏而不是移除
    });

        // 创建内容区域 - 使用文档2中的HTML内容
        const content = document.createElement('div');
        content.className = 'alchemy-simulator-content';
        content.innerHTML = `
        <div class="container">
            <!-- 价格选择器 -->
            <div class="price-selector">
                <div class="catalyst-selector">
                    <label>成本价格：</label>
                    <select name="materialPriceMode" id="likecatalystType">
                        <option value="ask" selected>使用左一</option>
                        <option value="bid">使用右一</option>
                    </select>
                </div>
                <div class="catalyst-selector">
                    <label>产出价格：</label>
                    <select name="outputPriceMode" id="llikecatalystType">
                        <option value="ask" selected>使用左一</option>
                        <option value="bid">使用右一</option>
                    </select>
                </div>
                <div class="catalyst-selector">
                    <label>催化剂：</label>
                    <select id="catalystType">
                        <option value="">不使用</option>
                        <option value="catalyst_of_transmutation">转化催化剂</option>
                        <option value="prime_catalyst">至高催化剂</option>
                    </select>
                </div>
                <div class="catalyst-selector">
                    <label>暴饮之囊：</label>
                    <select id="GuzzlingPouch">
                        <option value="1">无</option>
                        <option value="1.1000">0</option>
                        <option value="1.1020">+1</option>
                        <option value="1.1042">+2</option>
                        <option value="1.1066">+3</option>
                        <option value="1.1092">+4</option>
                        <option value="1.1120">+5</option>
                        <option value="1.1150">+6</option>
                        <option value="1.1182">+7</option>
                        <option value="1.1216">+8</option>
                        <option value="1.1252">+9</option>
                        <option value="1.1290">+10</option>
                        <option value="1.1331">+11</option>
                        <option value="1.1372">+12</option>
                        <option value="1.1416">+13</option>
                        <option value="1.1462">+14</option>
                        <option value="1.1510">+15</option>
                        <option value="1.1560">+16</option>
                        <option value="1.1612">+17</option>
                        <option value="1.1666">+18</option>
                        <option value="1.1722">+19</option>
                        <option value="1.1780">+20</option>
                    </select>
                </div>
            </div>

            <div class="input-row">
                <div class="control-group">
                    <label for="alchemyitem">转化物品</label>
                    <div class="autocomplete"><input type="text" class="alchemy-text" id="alchemyitem" value="太阳石"></div>
                </div>
                <div class="control-group">
                    <label for="efficiencyRate">效率%</label>
                    <input type="number" id="efficiencyRate" placeholder="0-200" min="0" max="200" value="77.7">
                </div>
                <div class="control-group">
                    <label for="simulateTimes">物品数量</label>
                    <input type="number" id="simulateTimes" placeholder="1-1000000" min="1" max="1000000" value="1000">
                </div>
                <div class="control-group">
                    <label for="successRate">基础成功率%</label>
                    <input type="number" id="nonesuccessRate" placeholder="0-100" min="0" max="100" value="50">
                </div>
                <div class="control-group">
                    <label for="successRate">成功率%(含催化茶)</label>
                    <input type="number" id="successRate" placeholder="0-100" min="0" max="100" value="52.5">
                </div>
            </div>

            <div class="input-row">
                <div class="control-group">
                    <label for="itemPrice">物品价格</label>
                    <input type="number" id="itemPrice" placeholder="金币" value="0" readonly>
                </div>
                <div class="control-group">
                    <label for="Catalyst">催化剂成本</label>
                    <input type="number" id="Catalyst" placeholder="金币" value="0">
                </div>
                <div class="control-group">
                    <label for="costPerTry">金币</label>
                    <input type="number" id="costPerTry" placeholder="金币" value="0">
                </div>
                <div class="control-group">
                    <label for="Catalyst">单次成本</label>
                    <input type="number" id="allcostPerTry" placeholder="金币" value="0" readonly>
                </div>
                <div class="control-group">
                    <label for="timePerTry">单次耗时 (秒)</label>
                    <input type="number" id="timePerTry" placeholder="秒" value="9.09">
                </div>
            </div>

            <table class="output-table">
                <thead>
                    <tr>
                        <th>产出物品</th>
                        <th style="width: 15%;">概率 (%)</th>
                        <th style="width: 20%;">价格</th>
                        <th style="width: 25%;">单次|产出数量</th>
                        <th>单个物品总价</th>
                    </tr>
                </thead>
                <tbody id="outputItems">
                    <tr>
                        <td><div class="autocomplete"><input type="text" class="output-item" value="星光碎片"></div></td>
                        <td><input type="number" class="output-probability" value="25" step="0.01"></td>
                        <td><input type="number" class="output-price" value="0"></td>
                        <td><input type="number" class="output-quantity" value="10" readonly=""><input type="number" class="output-allquantity" readonly=""></td>
                        <td><input type="number" class="output-total" readonly=""></td>
                    </tr>
                    <tr>
                        <td><div class="autocomplete"><input type="text" class="output-item" value="月亮石"></div></td>
                        <td><input type="number" class="output-probability" value="30" step="0.01"></td>
                        <td><input type="number" class="output-price" value="0"></td>
                        <td><input type="number" class="output-quantity" value="1" readonly=""><input type="number" class="output-allquantity" readonly=""></td>
                        <td><input type="number" class="output-total" readonly=""></td>
                    </tr>
                    <tr>
                        <td><div class="autocomplete"><input type="text" class="output-item" value="太阳石"></div></td>
                        <td><input type="number" class="output-probability" value="44.9" step="0.01"></td>
                        <td><input type="number" class="output-price" value="0"></td>
                        <td><input type="number" class="output-quantity" value="1" readonly=""><input type="number" class="output-allquantity" readonly=""></td>
                        <td><input type="number" class="output-total" readonly=""></td>
                    </tr>
                    <tr>
                        <td><div class="autocomplete"><input type="text" class="output-item" value="贤者之石"></div></td>
                        <td><input type="number" class="output-probability" value="0.1" step="0.01"></td>
                        <td><input type="number" class="output-price" value="0"></td>
                        <td><input type="number" class="output-quantity" value="1" readonly=""><input type="number" class="output-allquantity" readonly=""></td>
                        <td><input type="number" class="output-total" readonly=""></td>
                    </tr>
                </tbody>
            </table>

            <div style="display: flex; justify-content: center; align-items: center; height: 100%; margin-top: 0.3rem;">
                <button class="btn" id="startBtn" style="background: linear-gradient(135deg, #33148c, #381fa2);">开始转化</button>
                <button class="btn" id="startBtnEQ" style="margin-left: 10px; background: linear-gradient(135deg, #FF8C00, #FFA500);">递归转化(装备)</button>
                <button class="btn" id="refreshPricesBtn" style="margin-left: 10px; background: linear-gradient(135deg, #006400, #228B22);">先刷新价格</button>
                <button class="btn" id="addItemBtn" style="margin-left: 10px; background: linear-gradient(135deg, #4a148c, #7b1fa2);">出货即停</button>
                <button class="btn" id="restart" style="margin-left: 10px; background: linear-gradient(135deg, #33148c, #381fa2);">重置</button>
            </div>
            <div class="result-row">
                <div class="result-box">
                    <div>成本</div>
                    <div class="result-value" id="totalCost">0</div>
                </div>
                <div class="result-box">
                    <div>本次盈亏</div>
                    <div class="result-value profit" id="profitLoss">0</div>
                </div>
                <div class="result-box">
                    <div>最大盈</div>
                    <div class="result-value profit" id="byprofit">0</div>
                </div>
                <div class="result-box">
                    <div>最大亏</div>
                    <div class="result-value profit" id="byLoss">0</div>
                </div>
                <div class="result-box">
                    <div>耗时</div>
                    <div class="result-value" id="timeCost">0秒</div>
                </div>
                <div class="result-box">
                    <div>盈亏比率</div>
                    <div class="result-value" id="profit_loss_ratio">0%|0%</div>
                </div>
                <div class="result-box">
                    <div>成功次数</div>
                    <div class="result-value" id="Consumable">0</div>
                </div>
                <div class="result-box">
                    <div>实际|高价值</div>
                    <div class="result-value" id="ActualSuccessrate">0%</div>
                </div>
                <div class="result-box">
                    <div>期望利润</div>
                    <div class="result-value" id="expectation">0</div>
                </div>
                <div class="result-box">
                    <div>标准差</div>
                    <div class="result-value" id="stdDeviation">0</div>
                </div>
                <div class="result-box">
                    <div>正收益|总次数</div>
                    <div class="result-value" id="Besimulationsisk">0</div>
                </div>
                <div class="result-box">
                    <div>正收益概率</div>
                    <div class="result-value" id="positivereturn">0</div>
                </div>
                <div class="result-box">
                    <div>风险评估(ctrl+单击)</div>
                    <div class="result-value" id="Risk">0</div>
                </div>
            </div>
            <input type="hidden" id="catalystPriceFetcher" value="不使用催化剂">
        </div>
        `;

        // 组装模态框
        header.appendChild(title);
        header.appendChild(closeBtn);
        modal.appendChild(header);
        modal.appendChild(content);

        // 添加到页面
        document.body.appendChild(modal);
        // 初始化自动完成功能
        initializeAutocomplete();

        // 绑定按钮事件
        bindButtonEvents();
        setTimeout(() => {const dummy = document.body.offsetHeight;initializeResultBoxInteractions();}, 100);
    }


    function initializeAutocomplete() {
    // 转换物品数据为自动完成需要的格式
    const autocompleteData = Object.entries(window.itemData).map(([id, name]) => {
        return { label: name, value: id.replace('/items/', '') };
    });

    // 为所有输入框添加自动完成功能
    function setupAutocomplete(inputElement, isMaterial) {
        $(inputElement).autocomplete({
            source: function(request, response) {
                const results = $.ui.autocomplete.filter(autocompleteData, request.term);
                response(results.slice(0, 10));
            },
            select: function(event, ui) {
                $(this).val(ui.item.label);
                const priceMode = isMaterial ? currentMaterialMode : currentOutputMode;

                if ($(this).hasClass('alchemy-text')) {
                    // 主材料输入框
                    fetchItemPrice(ui.item.value, $('#itemPrice'), priceMode);
                    autoFillAlchemyData(ui.item.label); // 新增：自动填充炼金数据
                } else {
                    // 产出物品输入框
                    fetchItemPrice(
                        ui.item.value,
                        $(this).closest('tr').find('.output-price'),
                        priceMode
                    );
                }
                return false;
            },
            focus: function(event, ui) {
                $(this).val(ui.item.label);
                return false;
            },
            minLength: 1
        }).data("ui-autocomplete")._renderItem = function(ul, item) {
            return $("<li>")
                .append(`<div>${item.label}</div>`)
                .appendTo(ul);
        };
    }
     loadAlchemyData();
    // 为所有相关输入框设置自动完成
    $('.alchemy-text').each(function() {
        setupAutocomplete(this, true); // 主材料使用material模式
    });

    $('.output-item').each(function() {
        setupAutocomplete(this, false); // 产出物品使用output模式
    });
}
//炼金配方数据相关函数
    function loadAlchemyData() {
    // 直接使用 @require 加载的 JS 文件
    if (window.alchemyDetailData) {
        alchemyData = window.alchemyDetailData;
        console.log("炼金数据加载完成");
        return Promise.resolve(); // 返回一个已解决的 Promise 以保持接口一致
    } else {
        console.error("炼金数据未加载");
        return Promise.reject("炼金数据未加载");
    }
}
    function findAlchemyData(chineseName) {
    // 在全局itemData中查找物品ID
    const itemEntry = Object.entries(window.itemData).find(
        ([id, name]) => name === chineseName
    );
    if (!itemEntry) {
        console.warn(`未找到物品: ${chineseName}`);
        return null;
    }
    const itemId = itemEntry[0].toLowerCase();
    const itemInfo = alchemyData[itemId];
    // 检查并提取炼金数据
    if (!itemInfo || !itemInfo.alchemyDetail) {
        console.warn(`找到物品但无炼金数据: ${chineseName} (ID: ${itemId})`);
        return null;
    }
    // 返回标准化结构
    return {
        successRate: itemInfo.alchemyDetail.transmuteSuccessRate,
        dropTable: itemInfo.alchemyDetail.transmuteDropTable || []
    };
}
    async function autoFillAlchemyData(chineseName) {
    try {
        const detail = findAlchemyData(chineseName);
        if (!detail) {
            console.warn(`无法获取炼金数据: ${chineseName}`);
            return;
        }
        // 1. 填充基础成功率（转换为百分比）
        $('#nonesuccessRate').val((detail.successRate * 100).toFixed(1)).trigger('change');
        // 2. 清空现有产出物品行（保留第一行）
        $('#outputItems tr:not(:first)').remove();
        // 3. 填充产出物品数据
        if (!Array.isArray(detail.dropTable)) {
            console.warn(`产出表格式不正确:`, detail.dropTable);
            return;
        }
        detail.dropTable.forEach((drop, index) => {
            const $row = (index === 0)
                ? $('#outputItems tr:first')
                : $('#outputItems tr:first').clone().appendTo('#outputItems');
            // 获取中文名称
            const itemName = window.itemData[drop.itemHrid] ||
                            drop.itemHrid.split('/').pop().replace(/_/g, ' ');
            // 填充数据
            $row.find('.output-item').val(itemName);
            $row.find('.output-probability').val((drop.dropRate * 100).toFixed(3));
			$row.find('.output-price').val('0');
            $row.find('.output-price').val('0');
			// 新增：填充maxCount到output-quantity0
            if (drop.maxCount !== undefined) {
                $row.find('.output-quantity').val(drop.maxCount);
            }
        });
    } catch (error) {
        console.error("自动填充失败:", error);
    }
}


    function bindButtonEvents() {
    // 获取按钮元素（使用原生的document.getElementById或自定义的ac_getElement）
    const startBtn = document.getElementById('startBtn');
    const startBtnEQ = document.getElementById('startBtnEQ');
    const refreshBtn = document.getElementById('refreshPricesBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const restartBtn = document.getElementById('restart');
    // 监听材料价格模式切换
    document.querySelector('select[name="materialPriceMode"]')?.addEventListener('change', function() {
        currentMaterialMode = this.value;
        console.log('材料模式切换到:', currentMaterialMode);
    });
    // 监听产出价格模式切换
    document.querySelector('select[name="outputPriceMode"]')?.addEventListener('change', function() {
        currentOutputMode = this.value;
        console.log('产出模式切换到:', currentOutputMode);
    });
    // 核心刷新函数
    function refreshMaterialPrice() {
    const inputItem = document.querySelector('.alchemy-text')?.value;
    if (!inputItem) return Promise.resolve();

    const itemId = findItemIdByName(inputItem);
    if (!itemId) return Promise.resolve();

    return fetchItemPrice(
        itemId,
        document.getElementById('itemPrice'),
        currentMaterialMode
    );
}
    function refreshOutputPrices() {
    const promises = [];
    document.querySelectorAll('.output-item').forEach(item => {
        const itemName = item.value;
        if (!itemName) return;
        const priceInput = item.closest('tr')?.querySelector('.output-price');
        if (!priceInput) return;
        const itemId = findItemIdByName(itemName);
        if (!itemId) return;
        promises.push(fetchItemPrice(
            itemId,
            priceInput,
            currentOutputMode
        ));
    });
    return Promise.all(promises);
}
    // 核心刷新函数
    // 暴饮
    document.getElementById('GuzzlingPouch').addEventListener('change', updateSuccessRate);
    // 核心催化剂
    document.getElementById('catalystType')?.addEventListener('change', function() {
    const selectedCatalyst = this.value;
    console.log('催化剂类型变更为:', selectedCatalyst);
    // 重置催化剂价格和更新成本
    document.getElementById('Catalyst').value = 0;
    updateSingleCost();
    // 立即更新成功率（无需等待价格获取）
    updateSuccessRate();
    // 如果没有选择催化剂则直接返回
    if (!selectedCatalyst) return;
    // 获取催化剂名称和ID
    const catalystName = selectedCatalyst === 'prime_catalyst'
        ? '至高催化剂'
        : '转化催化剂';
    const catalystId = findItemIdByName(catalystName);
    // 如果找到催化剂ID则获取价格
    if (catalystId) {
        fetchItemPrice(
            catalystId,
            document.getElementById('Catalyst'),
            currentMaterialMode
        ).then(() => {
            updateSingleCost(); // 价格获取后更新成本
        }).catch(error => {
            console.error('获取催化剂价格失败:', error);
        });
    }
});
    // 核心催化剂
    // 如果按钮存在，则添加事件监听器
    if (startBtn) {
        // 移除旧监听器
        startBtn.removeEventListener('click', window.alchemyCalculator?.simulateAlchemy);
        // 添加新监听器
        startBtn.addEventListener('click', function() {
            console.log('开始炼金按钮被点击');
            // 通过全局对象调用函数
            if (window.alchemyCalculator?.simulateAlchemy) {
                window.alchemyCalculator.simulateAlchemy();
            } else {
                console.error('炼金模拟函数未加载！');
                alert('炼金计算器功能未正确加载，请刷新页面重试');
            }
        });
    }
    if (startBtnEQ) {
    startBtnEQ.addEventListener('click', function() {
        console.log('开始装备炼金按钮被点击');
        if (window.alchemyCalculator?.simulateRecursiveAlchemy) {
            window.alchemyCalculator.simulateRecursiveAlchemy();
        } else {
            console.error('装备炼金模拟函数未加载！');
            alert('装备炼金计算器功能未正确加载，请刷新页面重试');
        }
    });
}
    if (restartBtn) {
    restartBtn.addEventListener('click', function() {
        console.log('重置按钮被点击');
        if (window.alchemyCalculator?.resetResults) {
            window.alchemyCalculator.resetResults();
        } else {
            console.error('重置函数未找到');
        }
    });
}
    // 其他按钮保持不变...
    if (refreshBtn) {
    // 移除原有监听器（如果存在）
    refreshBtn.onclick = null;
    // 添加新逻辑
    refreshBtn.addEventListener('click', function() {
        console.log('触发增强版刷新');
        // 禁用按钮防止重复点击
        refreshBtn.disabled = true;
        refreshBtn.textContent = '刷新中...';
        // 添加loading类
        document.querySelectorAll('.alchemy-text, .output-item').forEach(input => {
            input.classList.add('loading-price');
        });
        Promise.all([
            refreshMaterialPrice(),
            refreshOutputPrices()
        ]).then(() => {
            updateSuccessRate();
        }).catch(error => {
            console.error('刷新价格时出错:', error);
        }).finally(() => {
            // 恢复按钮状态
            refreshBtn.disabled = false;
            refreshBtn.textContent = '刷新价格';

            // 确保所有loading类被移除
            document.querySelectorAll('.alchemy-text, .output-item').forEach(input => {
                input.classList.remove('loading-price');
            });
        });
    });
}    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            console.log('出货即停按钮被点击');
            // 禁用按钮防止重复点击
            try {
                window.alchemyCalculator.simulateUntilTarget();
            } catch (error) {
                console.error('模拟出错:', error);
            } finally {
                // 恢复按钮状态
                setTimeout(() => {
                    addItemBtn.disabled = false;
                    addItemBtn.textContent = '出货即停';
                }, 500);
            }
        });
    }
    $('.alchemy-text').on('change', function() {
        const itemName = $(this).val();
        if (itemName) {
            const itemId = findItemIdByName(itemName);
            if (itemId) {
                fetchItemPrice(itemId, $('#itemPrice'), currentMaterialMode);
            }
        }
    });

    // 监听产出物品输入框变化
    $('.output-item').on('change', function() {
        const itemName = $(this).val();
        if (itemName) {
            const itemId = findItemIdByName(itemName);
            if (itemId) {
                fetchItemPrice(
                    itemId,
                    $(this).closest('tr').find('.output-price'),
                    currentOutputMode
                );
            }
        }
    });
}

    //////////////////////////////
    function updateSingleCost() {
    const itemPrice = parseFloat(document.getElementById('itemPrice').value) || 0;
    const catalystCost = parseFloat(document.getElementById('Catalyst').value) || 0;
    const goldCost = parseFloat(document.getElementById('costPerTry').value) || 0;
    const total = itemPrice + catalystCost + goldCost;
    document.getElementById('allcostPerTry').value = total;
    // 如果有全局计算函数也触发它
    if (window.alchemyCalculator?.calculateSingleCost) {
        window.alchemyCalculator.calculateSingleCost();
    }
}
    // 查找物品ID（纯JS版）
    function findItemIdByName(name) {
    if (!window.itemData) return null;
    for (const [id, itemName] of Object.entries(window.itemData)) {
        if (itemName === name) {
            return id.replace('/items/', '');
        }
    }
    return null;
}
    // 获取价格（纯JS版）
    function fetchItemPrice(itemId, priceInput, priceMode) {
    if (!itemId || !priceInput) return;
    const inputElement = priceInput.jquery ? priceInput[0] : priceInput;
    inputElement.readOnly = true;
    inputElement.classList.add('loading-price');
    fetch(`https://mooket.qi-e.top/market/item/price?name=/items/${encodeURIComponent(itemId)}`)
        .then(response => response.json())
        .then(data => {
            const price = priceMode === 'ask' ? data.ask : data.bid;
            if (price !== undefined) {
                priceInput.value = price;
                updateSingleCost(); // 新增：触发成本计算
            }
        })
        .catch(error => {
            console.error('价格查询失败:', error);
            priceInput.value = '?';
            priceInput.style.color = '#ff6b6b';
            setTimeout(() => priceInput.style.color = '', 1000);
        })
        .finally(() => {
            inputElement.readOnly = false;
            inputElement.classList.remove('loading-price');

            const actualInput = inputElement.classList.contains('ui-autocomplete-input') ?
                inputElement : inputElement.querySelector('input');
            if (actualInput) {
                actualInput.classList.remove('loading-price');
            }
        });
}
})();