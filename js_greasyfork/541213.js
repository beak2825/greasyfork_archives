// ==UserScript==
// @name         [弃]炼金模拟器
// @namespace    http://tampermonkey.net/
// @version      v18.3
// @description  这是炼金模拟器 没把握可以先模拟
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       Redbean
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/ml-fft@1.3.5/dist/ml-fft.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @require      https://update.greasyfork.org/scripts/541207/1616567/item-data%20v10.js
// @require      https://update.greasyfork.org/scripts/541208/1616568/alchemyDetail%20v10.js
// @require      https://update.greasyfork.org/scripts/541343/1617555/alchemy-calculator_v12.js
// @require      https://update.greasyfork.org/scripts/541211/1617022/alchemy-data%20v10.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541213/%5B%E5%BC%83%5D%E7%82%BC%E9%87%91%E6%A8%A1%E6%8B%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541213/%5B%E5%BC%83%5D%E7%82%BC%E9%87%91%E6%A8%A1%E6%8B%9F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加自定义样式
    GM_addStyle(`
       .alchemy-simulator-modal.hidden {
    display: none;
}
        button[data-custom="alchemy-simulator"] .MuiBadge-root {
            background: linear-gradient(90deg, #00c6ff, #0072ff);
            color: white;
            padding: 5px 15px;
            border-radius: 4px;
        }
/* API加载中的视觉效果 */
        .loading-price {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="%23ccc" fill="none" stroke-width="8" stroke-dasharray="62.83 62.83" transform="rotate(90 50 50)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50"/></circle></svg>') no-repeat right center;
    background-size: 20px;
.loading-price {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="%23ccc" fill="none" stroke-width="8" stroke-dasharray="62.83 62.83" transform="rotate(90 50 50)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50"/></circle></svg>');
    background-repeat: no-repeat;
    background-position: right center;
    background-size: 20px;
}
/* 错误状态 */
.error-price {
    color: #ff6b6b;
    animation: shake 0.5s;
}
}
.loading-price {
    color: #999 !important;
    font-style: italic;
}

        /* 模态框样式 - 调整为600px宽度 */
        .alchemy-simulator-modal {
            position: absolute;
            top: 100px; /* 初始位置 */
            left: 100px;
            transform: none; /* 移除居中转换 */
           /* 保留其他样式 */
           width: 800px;
           max-width: 95vw;
           max-height: 90vh;
           background: #1e1e1e;
           border-radius: 8px;
           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
           z-index: 9999;
           display: flex;
           flex-direction: column;
           overflow: hidden;
        }
        .alchemy-simulator-header {
        cursor: move; /* 显示可拖动光标 */
        /* 保留其他样式 */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: #2a2a2a;
        border-bottom: 1px solid #3a3a3a;
        }
        .alchemy-simulator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: #2a2a2a;
            border-bottom: 1px solid #3a3a3a;
        }
        .output-quantity{
             width: 50%;
        }
        .output-allquantity{
             width: 50%;
        }
        .alchemy-simulator-title {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
        }
        .alchemy-simulator-close {
    background: none;
    border: none;
    color: #ff6b6b;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    transition: transform 0.2s;
}
.alchemy-simulator-close:hover {
    transform: scale(1.2);
}
        .alchemy-simulator-content {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            color: #ddd;
        }

        /* 从文档2和文档3中提取的CSS，并调整为600px宽度 */
        :root {
            --primary: #003366;
            --accent: #d4af37;
            --bg: #0a0a0a;
            --text: #e0e0e0;
            --success: #4CAF50;
            --danger: #f44336;
        }

        .container {
            width: 100%;
            padding: 1rem;
            background: rgba(20, 20, 20, 0.8);
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 53, 102, 0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(212, 175, 55, 0.1);
            overflow-x: auto;
        }

        h1 {
            text-align: center;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: 1px;
            color: var(--accent);
            position: relative;
        }

        h1::after {
            content: "";
            display: block;
            width: 60px;
            height: 2px;
            background: var(--accent);
            margin: 8px auto 0;
            opacity: 0.6;
        }

        .input-row {
            display: flex;
            justify-content: center;
            gap: 12px;
        }

        .control-group {
            flex: 1 1 calc(33% - 8px);
            min-width: 100px;
            text-align: center;
            margin-bottom: 8px;
        }

        label {
            display: block;
            margin-bottom: 0.3rem;
            font-size: 0.8rem;
            opacity: 0.8;
            white-space: nowrap;
        }

        input{
            width: 100%;
            padding: 0.5rem;
            background: rgba(30, 30, 30, 0.7);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 6px;
            color: var(--text);
            text-align: center;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        input:focus, select:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        input::placeholder {
            color: #555;
        }

        .btn {
            background: linear-gradient(135deg, var(--primary), #004080);
            color: white;
            border: none;
            padding: 0.6rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            letter-spacing: 1px;
            margin-top: 0.8rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            white-space: nowrap;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 53, 102, 0.3);
        }

        .btn:active {
            transform: translateY(0);
        }

        .result-row {
            display: flex;
            justify-content: space-around;
            margin-top: 1.5rem;
            flex-wrap: wrap;
            gap: 8px;
        }

        .result-box {
            text-align: center;
            padding: 0.8rem;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.3);
            min-width: 100px;
            flex: 1;
        }

        .result-value {
            font-size: 1.2rem;
            margin-top: 0.3rem;
            font-weight: bold;
        }

        .profit {
            color: var(--success);
        }

        .loss {
            color: var(--danger);
        }

        .output-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 0.85rem;
        }

        .output-table th, .output-table td {
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 0.5rem;
            text-align: center;
        }

        .output-table th {
            background: rgba(0, 51, 102, 0.3);
        }

        .output-table tr:nth-child(even) {
            background: rgba(30, 30, 30, 0.5);
        }

        /* 自动完成样式 */
        .autocomplete {
            position: relative;
            display: inline-block;
            width: 100%;
        }

        .ui-autocomplete {
            max-height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            background: rgba(30, 30, 30, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.5);
            border-radius: 4px;
        }

        .ui-menu-item {
            padding: 8px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            cursor: pointer;
        }

        .ui-menu-item:hover {
            background-color: var(--primary);
        }

        .ui-helper-hidden-accessible {
            display: none;
        }

        /* 价格选择器样式 */
        .price-selector {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin: 0.5rem 0;
            gap: 8px;
        }

        .catalyst-selector {
            margin: 8px 0;
            padding: 8px;
            width: auto;
            flex: 1;
            min-width: 120px;
            background: #0763C3;
            border-radius: 4px;
            font-size: 0.85rem;
        }

        .catalyst-selector label {
            margin-bottom: 0.3rem;
            display: block;
        }

        .catalyst-selector select {
            width: 100%;
            padding: 0.3rem;
            font-size: 0.8rem;
        }

        /* 响应式调整 */
        @media (max-width: 600px) {
            .control-group {
                flex: 1 1 100%;
            }

            .price-selector {
                flex-direction: column;
            }

            .catalyst-selector {
                width: 100%;
            }
        }
        /* 自动完成样式 */
.ui-autocomplete {
    max-height: 300px;
    width: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #2a2a2a;
    border: 1px solid #444;
    z-index: 99999 !important;
}
.ui-menu-item {
    padding: 8px 12px;
    border-bottom: 1px solid #333;
    color: #eee;
    cursor: pointer;
}
.ui-menu-item:hover {
    background: #003366;
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
    function updateSuccessRate() {
    const baseRate = parseFloat(document.getElementById('nonesuccessRate').value) || 0;
    const catalystType = document.getElementById('catalystType').value;
    // 核心公式：基础 × 1.05 + 基础 × 催化剂加成
    const bonusMultiplier = CATALYST_BONUS[catalystType] || 0;
    const finalRate = (baseRate * 1.05) + (baseRate * bonusMultiplier);
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

    function addAlchemySimulatorTab() {
        // 使用MutationObserver监听DOM变化，确保动态加载的内容也被处理
        const observer = new MutationObserver(function(mutations) {
            const currentActionTab = findTabByText('转化');
            if (currentActionTab && !document.querySelector('button[data-custom="alchemy-simulator"]')) {
                insertSimulatorTab(currentActionTab);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始检查
        const currentActionTab = findTabByText('转化');
        if (currentActionTab) {
            insertSimulatorTab(currentActionTab);
        }
    }

    function findTabByText(text) {
        // 使用XPath查找包含特定文本的按钮
        const xpath = `//button[.//span[contains(text(), '${text}')]]`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    function insertSimulatorTab(currentActionTab) {
        // 克隆当前行动标签作为模板
        const simulatorTab = currentActionTab.cloneNode(true);

        // 修改克隆的标签
        simulatorTab.setAttribute('data-custom', 'alchemy-simulator');
        simulatorTab.removeAttribute('aria-selected');
        simulatorTab.removeAttribute('tabindex');
        simulatorTab.classList.remove('Mui-selected');

        // 修改文本内容
        const badgeSpan = simulatorTab.querySelector('.MuiBadge-root');
        if (badgeSpan) {
            badgeSpan.textContent = '炼金模拟器';
            // 清空徽章内容
            const badge = badgeSpan.querySelector('.MuiBadge-badge');
            if (badge) {
                badge.innerHTML = '';
            }
        }

        // 插入到当前行动标签之后
        currentActionTab.parentNode.insertBefore(simulatorTab, currentActionTab.nextSibling);

        // 添加点击事件
        simulatorTab.addEventListener('click', function() {
            openAlchemySimulator();
            console.log('炼金模拟器被点击');
        });
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
        title.textContent = '炼金转换模拟器 By豆子';

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
                    <label>催化剂类型（跟随成本）：</label>
                    <select id="catalystType">
                        <option value="">不使用催化剂</option>
                        <option value="catalyst_of_transmutation">转化催化剂</option>
                        <option value="prime_catalyst">至高催化剂</option>
                    </select>
                </div>
            </div>

            <div class="input-row">
                <div class="control-group">
                    <label for="alchemyitem">转换物品</label>
                    <div class="autocomplete"><input class="alchemy-text" type="text" value="太阳石"></div>
                </div>
                <div class="control-group">
                    <label for="efficiencyRate">效率%</label>
                    <input type="number" id="efficiencyRate" placeholder="0-200" min="0" max="200" value="77.7">
                </div>
                <div class="control-group">
                    <label for="simulateTimes">模拟次数</label>
                    <input type="number" id="simulateTimes" placeholder="1-1000000" min="1" max="1000000" value="1000">
                </div>
                <div class="control-group">
                    <label for="successRate">基础成功率%</label>
                    <input type="number" id="nonesuccessRate" placeholder="0-100" min="0" max="100" value="50">
                </div>
                <div class="control-group">
                    <label for="successRate">成功率%(含催化茶)</label>
                    <input type="number" id="successRate" placeholder="0-100" min="0" max="100" value="65">
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
                        <th style="width: 25%;">单次掉落/产出数量</th>
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

            <div style="text-align: center;">
                <button class="btn" id="startBtn">开始炼金</button>
                <button class="btn" id="refreshPricesBtn" style="margin-left: 10px; background: linear-gradient(135deg, #006400, #228B22);">先刷新价格</button>
                <button class="btn" id="addItemBtn" style="margin-left: 10px; background: linear-gradient(135deg, #4a148c, #7b1fa2);">添加物品</button>
            </div>

            <div class="result-row">
                <div class="result-box">
                    <div>成本</div>
                    <div class="result-value" id="totalCost">0</div>
                </div>
                <div class="result-box">
                    <div>盈亏</div>
                    <div class="result-value profit" id="profitLoss">0</div>
                </div>
                <div class="result-box">
                    <div>耗时</div>
                    <div class="result-value" id="timeCost">0秒</div>
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
    const refreshBtn = document.getElementById('refreshPricesBtn');
    const addItemBtn = document.getElementById('addItemBtn');
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
            refreshBtn.textContent = '刷新价格与重置';

            // 确保所有loading类被移除
            document.querySelectorAll('.alchemy-text, .output-item').forEach(input => {
                input.classList.remove('loading-price');
            });
        });
    });
}
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            console.log('添加物品按钮被点击');
            // 这里可以添加添加物品行的逻辑
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