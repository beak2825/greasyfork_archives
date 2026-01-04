// ==UserScript==
// @name         【抖店】价格监控
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  根据指定规则高亮显示价格
// @author       itsAnstar@outlook.com
// @match        https://fxg.jinritemai.com/ffa/morder/order/list?btm_ppre=*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528619/%E3%80%90%E6%8A%96%E5%BA%97%E3%80%91%E4%BB%B7%E6%A0%BC%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/528619/%E3%80%90%E6%8A%96%E5%BA%97%E3%80%91%E4%BB%B7%E6%A0%BC%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入CSS样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .price-monitor-container {
            position: fixed;
            top: calc(5vh + 20px); /* 向下移动3%的视窗高度 */
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-width: 320px;
            transition: all 0.3s ease;
        }

        .price-monitor-container.collapsed {
            min-width: auto;
            padding: 12px;
            background: rgba(144, 238, 144, 0.3); /* 浅绿色背景，带透明度 */
            backdrop-filter: blur(10px);
            border: 1px solid rgba(144, 238, 144, 0.5); /* 浅绿色边框 */
            box-shadow: 0 2px 12px rgba(144, 238, 144, 0.2); /* 浅绿色阴影 */
        }

        .price-monitor-container.collapsed:hover {
            background: rgba(144, 238, 144, 0.4); /* 悬停时稍微加深 */
        }

        .price-monitor-container.collapsed .price-monitor-content {
            display: none;
        }

        .price-monitor-container.collapsed .price-monitor-status {
            color: #2e8b57; /* 折叠时的文字颜色为深绿色 */
        }

        .price-monitor-toggle {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1d1d1f;
            opacity: 0.6;
            transition: all 0.2s ease;
        }

        .price-monitor-toggle:hover {
            opacity: 1;
        }

        .price-monitor-toggle svg {
            width: 16px;
            height: 16px;
            transition: transform 0.3s ease;
        }

        .collapsed .price-monitor-toggle svg {
            transform: rotate(180deg);
        }

        .price-monitor-status {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #1d1d1f;
            margin-right: 24px;
        }

        .collapsed .price-monitor-status {
            margin: 0;
        }

        .price-monitor-title {
            margin: 0 0 20px 0;
            font-size: 18px;
            font-weight: 600;
            color: #1d1d1f;
        }

        .price-monitor-item {
            margin-bottom: 15px;
            padding: 12px;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .price-monitor-item:hover {
            background: rgba(0, 0, 0, 0.04);
        }

        .price-monitor-input {
            width: 100%;
            padding: 8px 12px;
            margin: 4px 0;
            border: 1px solid #d2d2d7;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .price-monitor-input:focus {
            outline: none;
            border-color: #0071e3;
            box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
        }

        .price-monitor-button {
            background: #0071e3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .price-monitor-button:hover {
            background: #0077ED;
        }

        .price-monitor-button.secondary {
            background: #f5f5f7;
            color: #1d1d1f;
            margin-right: 8px;
        }

        .price-monitor-button.secondary:hover {
            background: #e8e8ed;
        }

        .price-monitor-button.delete {
            background: #ff3b30;
            padding: 4px 8px;
            font-size: 12px;
        }

        .price-monitor-button.delete:hover {
            background: #ff453a;
        }

        .price-monitor-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #d2d2d7;
        }
    `;
    document.head.appendChild(styleSheet);

    // 默认配置
    const defaultConfig = {
        items: [
            { name: '乌黑芝麻230克*8瓶x1', expectedPrice: 119.8 }
        ]
    };

    // 从存储中获取配置
    let config = GM_getValue('priceConfig', defaultConfig);

    // 创建配置界面
    function createConfigUI() {
        const container = document.createElement('div');
        container.className = 'price-monitor-container';

        // 创建内容容器
        const content = document.createElement('div');
        content.className = 'price-monitor-content';

        // 创建状态指示器
        const status = document.createElement('div');
        status.className = 'price-monitor-status';
        status.textContent = '价格监控已启用';

        // 创建折叠按钮
        const toggleButton = document.createElement('button');
        toggleButton.className = 'price-monitor-toggle';
        toggleButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 15l-6-6-6 6"/>
            </svg>
        `;

        // 添加折叠/展开功能
        let isCollapsed = GM_getValue('uiCollapsed', false);
        if (isCollapsed) {
            container.classList.add('collapsed');
        }

        toggleButton.onclick = () => {
            isCollapsed = !isCollapsed;
            container.classList.toggle('collapsed');
            GM_setValue('uiCollapsed', isCollapsed);
        };

        // 创建标题
        const title = document.createElement('h3');
        title.className = 'price-monitor-title';
        title.textContent = '价格监控配置';
        content.appendChild(title);

        // 创建配置列表
        const configList = document.createElement('div');
        configList.id = 'configList';
        content.appendChild(configList);

        // 创建操作按钮容器
        const actions = document.createElement('div');
        actions.className = 'price-monitor-actions';

        // 添加按钮
        const addButton = document.createElement('button');
        addButton.textContent = '添加商品';
        addButton.className = 'price-monitor-button secondary';
        addButton.onclick = addConfigItem;
        actions.appendChild(addButton);

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存配置';
        saveButton.className = 'price-monitor-button';
        saveButton.onclick = saveConfig;
        actions.appendChild(saveButton);

        content.appendChild(actions);

        // 组装界面
        container.appendChild(status);
        container.appendChild(toggleButton);
        container.appendChild(content);
        document.body.appendChild(container);

        // 渲染现有配置
        renderConfigItems();

        // 更新状态显示
        function updateStatus() {
            const activeItems = config.items.length;
            status.textContent = `监控中: ${activeItems}个商品`;
        }
        updateStatus();
    }

    // 渲染配置项
    function renderConfigItems() {
        const configList = document.getElementById('configList');
        configList.innerHTML = '';

        config.items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'price-monitor-item';
            itemDiv.innerHTML = `
                <div>
                    <input type="text" placeholder="商品名称" value="${item.name}"
                           class="price-monitor-input item-name" data-index="${index}">
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="number" placeholder="预期价格" value="${item.expectedPrice}"
                               class="price-monitor-input item-price" data-index="${index}" style="flex: 1;">
                        <button class="price-monitor-button delete" onclick="this.parentElement.parentElement.parentElement.remove()">删除</button>
                    </div>
                </div>
            `;
            configList.appendChild(itemDiv);
        });
    }

    // 添加配置项
    function addConfigItem() {
        config.items.push({ name: '', expectedPrice: 0 });
        renderConfigItems();
    }

    // 保存配置
    function saveConfig() {
        const newConfig = { items: [] };
        const names = document.querySelectorAll('.item-name');
        const prices = document.querySelectorAll('.item-price');

        for (let i = 0; i < names.length; i++) {
            newConfig.items.push({
                name: names[i].value,
                expectedPrice: parseFloat(prices[i].value)
            });
        }

        config = newConfig;
        GM_setValue('priceConfig', config);
        alert('配置已保存');
    }

    // 获取价格样式
    function getPriceStyle(currentPrice, expectedPrice) {
        if (currentPrice === expectedPrice) {
            return { backgroundColor: '#90EE90', color: '#006400' }; // 绿色底色
        } else {
            return { backgroundColor: '#FFB6C1', color: '#8B0000' }; // 深红色底色
        }
    }

    // 检查元素
    function checkElements() {
        const containers = document.querySelectorAll('tr');
        const results = [];

        containers.forEach(container => {
            const relativeElement = container.querySelector('.index_ellipsis__MJ7fR');
            const priceElement = container.querySelector('.index_amountWrap___vXdu.index_marked__FC_BX');

            if (relativeElement && priceElement) {
                const relativeText = relativeElement.textContent.trim();
                const priceText = priceElement.textContent.trim();
                const priceMatch = priceText.match(/([\d,.]+)/);

                if (priceMatch && priceMatch[1]) {
                    const currentPrice = parseFloat(priceMatch[1].replace(/,/g, ''));

                    // 检查是否匹配配置的商品
                    const matchedItem = config.items.find(item => relativeText.includes(item.name));
                    if (matchedItem) {
                        const style = getPriceStyle(currentPrice, matchedItem.expectedPrice);
                        priceElement.style.backgroundColor = style.backgroundColor;
                        priceElement.style.color = style.color;

                        results.push({
                            name: relativeText,
                            price: currentPrice,
                            expectedPrice: matchedItem.expectedPrice,
                            isExpected: currentPrice === matchedItem.expectedPrice
                        });
                    }
                }
            }
        });

        // 输出结果
        if (results.length > 0) {
            console.group('价格监控结果');
            results.forEach(result => {
                const priceInfo = `当前价格: ¥${result.price.toFixed(2)} / 预期价格: ¥${result.expectedPrice.toFixed(2)}`;
                console.log(
                    `%c${result.name}%c${priceInfo}`,
                    'color: #333; font-weight: normal;',
                    `color: ${result.isExpected ? '#006400' : '#8B0000'}; font-weight: bold;`
                );
            });
            console.groupEnd();
        }
    }

    // 创建配置界面
    createConfigUI();

    // 定时检查
    setInterval(checkElements, 5000);
})();
