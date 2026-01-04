// ==UserScript==
// @name 导出背包物品和计算火车木板需要量
// @namespace http://tampermonkey.net/
// @version 2.2
// @description 导出背包物品和计算火车木板需要数量
// @author 午睡箱子
// @match https://www.milkywayidle.com/game*
// @grant GM_setClipboard
// @grant GM_addStyle
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545920/%E5%AF%BC%E5%87%BA%E8%83%8C%E5%8C%85%E7%89%A9%E5%93%81%E5%92%8C%E8%AE%A1%E7%AE%97%E7%81%AB%E8%BD%A6%E6%9C%A8%E6%9D%BF%E9%9C%80%E8%A6%81%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/545920/%E5%AF%BC%E5%87%BA%E8%83%8C%E5%8C%85%E7%89%A9%E5%93%81%E5%92%8C%E8%AE%A1%E7%AE%97%E7%81%AB%E8%BD%A6%E6%9C%A8%E6%9D%BF%E9%9C%80%E8%A6%81%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式，让按钮和面板更显眼
    GM_addStyle(`
        #export-inventory-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease;
        }
        #export-inventory-btn:hover {
            background-color: #0056b3;
        }
        #inventory-panel {
            position: fixed;
            bottom: 20px;
            left: 170px;
            min-width: 200px;
            min-height: 200px;
            width: 300px;
            height: 400px;
            background-color: #ffffff;
            color: #000000;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            z-index: 9998;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: none;
            font-family: monospace;
            font-size: 16px;
            overflow-y: hidden;
            resize: both;
            overflow: auto;
        }
        #panel-header {
            cursor: move;
            background-color: #f1f1f1;
            padding: 5px 10px;
            border-bottom: 1px solid #ccc;
            margin: -15px -15px 15px -15px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #panel-header span {
            font-weight: bold;
        }
        #inventory-panel pre {
            margin: 0;
            white-space: pre-wrap;
            font-size: 16px;
            height: calc(100% - 40px);
            overflow-y: auto;
        }
        #close-panel-btn {
            background: none;
            border: none;
            color: #000000;
            font-size: 18px;
            cursor: pointer;
        }
        #copy-panel-btn {
            position: absolute;
            bottom: 5px;
            right: 5px;
            background-color: #28a745;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        }
        #calc-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            min-width: 200px;
            min-height: 200px;
            width: 300px;
            height: 400px;
            background-color: #ffffff;
            color: #000000;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            z-index: 9998;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: none;
            font-family: monospace;
            font-size: 16px;
            overflow-y: hidden;
            resize: both;
            overflow: auto;
        }
        #calc-panel-header {
            cursor: move;
            background-color: #f1f1f1;
            padding: 5px 10px;
            border-bottom: 1px solid #ccc;
            margin: -15px -15px 15px -15px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #calc-panel-header span {
            font-weight: bold;
        }
        #calc-panel pre {
            margin: 0;
            white-space: pre-wrap;
            font-size: 16px;
            height: calc(100% - 40px);
            overflow-y: auto;
        }
        .item-add-btn {
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 14px;
            cursor: pointer;
            margin-left: 5px;
            float: right; /* 确保按钮在右侧 */
        }
        .item-add-btn.active {
            background-color: #dc3545;
        }
        /* 新增的样式，用于突出显示计算结果中的“还需”数量 */
        #calc-panel pre .highlight-needed {
            color: #d9534f; /* 红色 */
            font-weight: bold;
        }
    `);

    // 物品升级所需木板数量定义
    const recipeData = {
        '弩': {
            '木弩': { '木板': 18 },
            '桦木弩': { '白桦木板': 27 },
            '雪松弩': { '雪松木板': 36 },
            '紫心弩': { '紫心木板': 54 },
            '银杏弩': { '银杏木板': 81 },
            '红杉弩': { '红杉木板': 117 },
            '神秘弩': { '神秘木板': 162 }
        },
        '法杖': {
            '木法杖': { '木板': 18 },
            '桦木法杖': { '白桦木板': 27 },
            '雪松法杖': { '雪松木板': 36 },
            '紫心法杖': { '紫心木板': 54 },
            '银杏法杖': { '银杏木板': 81 },
            '红杉法杖': { '红杉木板': 117 },
            '神秘法杖': { '神秘木板': 162 }
        },
        '弓': {
            '木弓': { '木板': 18 * 4 / 3 },
            '桦木弓': { '白桦木板': 27 * 4 / 3 },
            '雪松弓': { '雪松木板': 36 * 4 / 3 },
            '紫心弓': { '紫心木板': 54 * 4 / 3 },
            '银杏弓': { '银杏木板': 81 * 4 / 3 },
            '红杉弓': { '红杉木板': 117 * 4 / 3 },
            '神秘弓': { '神秘木板': 162 * 4 / 3 }
        }
    };

    // 木板名称列表，用于筛选和遍历
    const plankNames = ['木板', '白桦木板', '雪松木板', '紫心木板', '银杏木板', '红杉木板', '神秘木板'];

    let totalWoodPlanks = {};
    let addedItems = {};
    let allInventoryItems = [];

    function parseNumberWithUnit(str) {
        const units = { 'k': 1000, 'm': 1000000, 'b': 1000000000 };
        str = str.toLowerCase().trim();
        const unit = str.slice(-1);
        const number = parseFloat(str);
        if (units[unit] && !isNaN(number)) {
            return number * units[unit];
        }
        return isNaN(number) ? null : number;
    }

    // 获取背包中所有物品
    function getInventoryItems() {
        const items = [];
        const itemDivs = document.querySelectorAll('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_characterManagementPanel__3OYQL > div > div > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(1) > div > div.Inventory_items__6SXv0.script_buildScore_added.script_invSort_added > div > div > div');

        itemDivs.forEach(div => {
            const itemNameSpan = div.querySelector('.Item_itemName__-eD3a');
            const svg = div.querySelector('div.Item_iconContainer__5z7j4 > svg');
            let name = '';
            if (itemNameSpan) {
                name = itemNameSpan.textContent.trim();
            } else if (svg) {
                name = svg.getAttribute('aria-label') || '';
            }

            let enhance = '';
            const enhanceDiv = div.querySelector('.Item_enhancementLevel__19g-e');
            if (enhanceDiv) {
                enhance = enhanceDiv.textContent.trim();
            }

            let displayName = name;
            if (enhance) {
                displayName += enhance;
            }

            const countDiv = div.querySelector('.Item_count__1HVvv');
            if (!countDiv) return;

            const txt = countDiv.textContent.trim();
            const qty = parseNumberWithUnit(txt);
            if (qty === null || isNaN(qty)) return;

            if (displayName) items.push({ name: displayName, qty, element: div });
        });

        return items;
    }

    // 获取背包中已有的木板数量
    function getOwnedPlanks() {
        const ownedPlanks = {};
        allInventoryItems.forEach(item => {
            if (plankNames.includes(item.name)) {
                ownedPlanks[item.name] = (ownedPlanks[item.name] || 0) + item.qty;
            }
        });
        return ownedPlanks;
    }

    // 格式化计算结果，将需求、拥有、还需合并到一行
    function formatCalcOutput() {
        const ownedPlanks = getOwnedPlanks();
        let resultText = "=== 神秘装备木板需求 ===\n\n";
        let hasItems = false;

        // 汇总总需求
        const finalNeeded = {};
        for (const plank of plankNames) {
            finalNeeded[plank] = 0;
        }

        for (const itemId in addedItems) {
            if (addedItems[itemId]) {
                const costs = calculateUpgradeCost(addedItems[itemId].name);
                const quantity = addedItems[itemId].qty;
                for (const plank in costs) {
                    finalNeeded[plank] = (finalNeeded[plank] || 0) + costs[plank] * quantity;
                }
            }
        }

        for (const plank of plankNames) {
            const totalNeeded = finalNeeded[plank] || 0;
            const owned = ownedPlanks[plank] || 0;
            if (totalNeeded > 0 || owned > 0) {
                const needed = Math.max(0, Math.ceil(totalNeeded - owned));
                resultText += `${plank}: 总需 ${Math.ceil(totalNeeded)}, 已有 ${owned}, 还需 ${needed > 0 ? `<span class="highlight-needed">${needed}</span>` : '0'}\n`;
                hasItems = true;
            }
        }

        return hasItems ? resultText : '默认为0';
    }

    // 计算升级到神秘材质所需的木板
    function calculateUpgradeCost(itemName) {
        const costs = {};
        const prefixOrder = ['木', '桦木', '雪松', '紫心', '银杏', '红杉', '神秘'];
        let itemType = '';
        if (itemName.includes('弩')) itemType = '弩';
        else if (itemName.includes('法杖')) itemType = '法杖';
        else if (itemName.includes('弓')) itemType = '弓';

        if (!itemType) return costs;

        const currentPrefix = prefixOrder.find(p => itemName.startsWith(p));
        const foundIndex = prefixOrder.indexOf(currentPrefix);
        if (foundIndex === -1) return costs;

        for (let i = foundIndex; i < prefixOrder.length - 1; i++) {
            const nextPrefix = prefixOrder[i+1];
            const recipeItemName = nextPrefix + itemType;
            const recipe = recipeData[itemType][recipeItemName];

            if (recipe) {
                for (const plank in recipe) {
                    costs[plank] = (costs[plank] || 0) + recipe[plank];
                }
            }
        }
        return costs;
    }

    // 在物品列表项中添加计算按钮
    function addCalcButtons() {
        document.querySelectorAll('.item-add-btn').forEach(btn => btn.remove());

        const equipmentItems = allInventoryItems.filter(item => item.name.includes('弩') || item.name.includes('法杖') || item.name.includes('弓'));

        equipmentItems.forEach(item => {
            const btn = document.createElement('button');
            btn.textContent = '+';
            btn.className = 'item-add-btn';
            item.element.appendChild(btn);

            const itemIdentifier = `${item.name}-${item.qty}`;
            if (addedItems[itemIdentifier]) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isAlreadyAdded = !!addedItems[itemIdentifier];
                if (isAlreadyAdded) {
                    btn.classList.remove('active');
                    delete addedItems[itemIdentifier];
                } else {
                    btn.classList.add('active');
                    addedItems[itemIdentifier] = { name: item.name, qty: item.qty };
                }
                const calcPre = document.getElementById('calc-panel').querySelector('pre');
                calcPre.innerHTML = formatCalcOutput();
                document.getElementById('calc-panel').style.display = 'block';
            });
        });
    }

    // 处理并排序物品列表
    function processAndSortItems(items) {
        return items.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 格式化输出文本
    function formatOutputText(items) {
        return items.map(item => `${item.name} x${item.qty}`).join('\n');
    }

    // 创建并配置UI界面
    function createUI() {
        const button = document.createElement('button');
        button.id = 'export-inventory-btn';
        button.textContent = '导出背包物品';
        document.body.appendChild(button);

        const panel = document.createElement('div');
        panel.id = 'inventory-panel';
        document.body.appendChild(panel);

        const panelHeader = document.createElement('div');
        panelHeader.id = 'panel-header';
        panel.appendChild(panelHeader);

        const headerTitle = document.createElement('span');
        headerTitle.textContent = '背包物品列表';
        panelHeader.appendChild(headerTitle);

        const closeBtn = document.createElement('button');
        closeBtn.id = 'close-panel-btn';
        closeBtn.innerHTML = '&times;';
        panelHeader.appendChild(closeBtn);

        const pre = document.createElement('pre');
        panel.appendChild(pre);

        const copyBtn = document.createElement('button');
        copyBtn.id = 'copy-panel-btn';
        copyBtn.textContent = '复制';
        panel.appendChild(copyBtn);

        const calcPanel = document.createElement('div');
        calcPanel.id = 'calc-panel';
        document.body.appendChild(calcPanel);

        const calcPanelHeader = document.createElement('div');
        calcPanelHeader.id = 'calc-panel-header';
        calcPanel.appendChild(calcPanelHeader);

        const calcHeaderTitle = document.createElement('span');
        calcHeaderTitle.textContent = '木板需求';
        calcPanelHeader.appendChild(calcHeaderTitle);

        const closeCalcBtn = document.createElement('button');
        closeCalcBtn.id = 'close-panel-btn';
        closeCalcBtn.innerHTML = '&times;';
        calcPanelHeader.appendChild(closeCalcBtn);

        const calcPre = document.createElement('pre');
        calcPre.innerHTML = '默认为0';
        calcPanel.appendChild(calcPre);

        // 使面板可拖动
        const makeDraggable = (element, header) => {
            let isDragging = false;
            let offset = { x: 0, y: 0 };
            header.addEventListener('mousedown', function(e) {
                isDragging = true;
                offset.x = e.clientX - element.offsetLeft;
                offset.y = e.clientY - element.offsetTop;
                document.body.style.userSelect = 'none';
                element.style.bottom = 'auto';
                element.style.right = 'auto';
            });
            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    const newLeft = e.clientX - offset.x;
                    const newTop = e.clientY - offset.y;
                    const minTop = 0;
                    const minLeft = 0;
                    const maxTop = window.innerHeight - element.offsetHeight;
                    const maxLeft = window.innerWidth - element.offsetWidth;
                    element.style.left = `${Math.max(minLeft, Math.min(newLeft, maxLeft))}px`;
                    element.style.top = `${Math.max(minTop, Math.min(newTop, maxTop))}px`;
                }
            });
            document.addEventListener('mouseup', function() {
                isDragging = false;
                document.body.style.userSelect = '';
            });
        };
        makeDraggable(panel, panelHeader);
        makeDraggable(calcPanel, calcPanelHeader);

        button.addEventListener('click', () => {
            allInventoryItems = getInventoryItems();
            if (allInventoryItems.length > 0) {
                const sortedItems = processAndSortItems(allInventoryItems);
                const resultText = formatOutputText(sortedItems);
                pre.textContent = resultText;
                panel.style.display = 'block';
                addCalcButtons();
            } else {
                alert('未找到背包物品，请确保背包面板已打开。');
            }
        });

        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        closeCalcBtn.addEventListener('click', () => {
            calcPanel.style.display = 'none';
        });

        copyBtn.addEventListener('click', () => {
            GM_setClipboard(pre.textContent);
            alert('背包物品列表已复制到剪贴板！');
        });
    }

    let observer = null;

    // 监听DOM变化，以便在背包物品更新时重新加载按钮
    function startObserver() {
        const targetNode = document.querySelector('body');
        if (!targetNode) {
            setTimeout(startObserver, 500);
            return;
        }

        const config = { childList: true, subtree: true };

        const callback = (mutationsList) => {
            for(const mutation of mutationsList) {
                // 检查是否是背包内容发生了变化
                if (mutation.target.classList && mutation.target.classList.contains('Inventory_items__6SXv0')) {
                    allInventoryItems = getInventoryItems();
                    if (allInventoryItems.length > 0) {
                        addCalcButtons();
                    }
                    break;
                }
            }
        };

        observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // 初始化 UI 并启动观察者
    createUI();
    startObserver();
})();