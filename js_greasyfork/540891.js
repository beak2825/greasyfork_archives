// ==UserScript==
// @name         代币价值计算
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  根据市场数据计算代币价值并高亮最佳选项
// @author       BigWatermelon
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540891/%E4%BB%A3%E5%B8%81%E4%BB%B7%E5%80%BC%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/540891/%E4%BB%A3%E5%B8%81%E4%BB%B7%E5%80%BC%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #tokensPricePage {
            width: 100%;
            padding: 8px 15px;
            box-sizing: border-box;
        }
        .remark {
            color: #38e3ed;
            padding: 8px;
            border: 1px solid #4357af;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
            background-color: rgba(76, 175, 80, 0.1);
            transform: scale(1.02);
        }
        .title {
            text-align: left;
        }

        .updateTime {
            margin-top: 5px;
        }

        /* 分类标签样式 */
        .category-tabs {
            display: flex;
            margin: 10px 0;
            gap: 5px;
        }
        .category-tab {
            padding: 5px 10px;
            background: #2c3e50;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .category-tab.active {
            background: #2196F3;
            font-weight: bold;
        }

        .flexStart {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 10px;
        }

        .itemBox {
            width: 153px;
            padding: 5px;
            border: 1px solid #4357af;
            border-radius: 4px;
            transition: all 0.3s ease;
            position: relative;
        }

        .imgBox {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 5px 0;
            height: 60px;
        }

        /* 高亮最佳选项的样式 */
        .best-profit {
            border: 1px solid #4CAF50;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
            background-color: rgba(76, 175, 80, 0.1);
            transform: scale(1.02);
        }

        .priceInput {
            width: 100%;
            text-align: center;
            margin-bottom: 5px;
        }

        .profit-value {
            font-size: 12px;
            margin-top: 3px;
            font-weight: bold;
        }

        .best-profit-marker {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }

        .update-all-btn {
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
            margin: 10px 0;
        }

        .update-all-btn:hover {
            background: #0b7dda;
        }
    `);

    const itemInfo = [
        { id: 'griffin_leather', img: '/static/media/items_sprite.6d12eb9d.svg#griffin_leather', name: '狮鹫之皮', tokensNumber: 600, category: 'D1' },
        { id: 'manticore_sting', img: '/static/media/items_sprite.6d12eb9d.svg#manticore_sting', name: '蝎狮之刺', tokensNumber: 1000, category: 'D1' },
        { id: 'jackalope_antler', img: '/static/media/items_sprite.6d12eb9d.svg#jackalope_antler', name: '鹿角兔之角', tokensNumber: 1200, category: 'D1' },
        { id: 'dodocamel_plume', img: '/static/media/items_sprite.6d12eb9d.svg#dodocamel_plume', name: '渡渡驼之翎', tokensNumber: 3000, category: 'D1' },
        { id: 'griffin_talon', img: '/static/media/items_sprite.6d12eb9d.svg#griffin_talon', name: '狮鹫之爪', tokensNumber: 3000, category: 'D1' },

        { id: 'acrobats_ribbon', img: '/static/media/items_sprite.6d12eb9d.svg#acrobats_ribbon', name: '杂技师彩带', tokensNumber: 2000, category: 'D2' },
        { id: 'magicians_cloth', img: '/static/media/items_sprite.6d12eb9d.svg#magicians_cloth', name: '魔术师织物', tokensNumber: 2000, category: 'D2' },
        { id: 'chaotic_chain', img: '/static/media/items_sprite.6d12eb9d.svg#chaotic_chain', name: '混沌锁链', tokensNumber: 3000, category: 'D2' },
        { id: 'cursed_ball', img: '/static/media/items_sprite.6d12eb9d.svg#cursed_ball', name: '诅咒之球', tokensNumber: 3000, category: 'D2' },


        { id: 'royal_cloth', img: '/static/media/items_sprite.6d12eb9d.svg#royal_cloth', name: '皇家织物', tokensNumber: 2000, category: 'D3' },
        { id: 'knights_ingot', img: '/static/media/items_sprite.6d12eb9d.svg#knights_ingot', name: '骑士之锭', tokensNumber: 2000, category: 'D3' },
        { id: 'bishops_scroll', img: '/static/media/items_sprite.6d12eb9d.svg#bishops_scroll', name: '主教卷轴', tokensNumber: 2000, category: 'D3' },
        { id: 'regal_jewel', img: '/static/media/items_sprite.6d12eb9d.svg#regal_jewel', name: '君王宝石', tokensNumber: 3000, category: 'D3' },
        { id: 'sundering_jewel', img: '/static/media/items_sprite.6d12eb9d.svg#sundering_jewel', name: '裂空宝石', tokensNumber: 3000, category: 'D3' },

        { id: 'marksman_brooch', img: '/static/media/items_sprite.6d12eb9d.svg#marksman_brooch', name: '神射胸针', tokensNumber: 2000, category: 'D4' },
        { id: 'corsair_crest', img: '/static/media/items_sprite.6d12eb9d.svg#corsair_crest', name: '掠夺者徽章', tokensNumber: 2000, category: 'D4' },
        { id: 'damaged_anchor', img: '/static/media/items_sprite.6d12eb9d.svg#damaged_anchor', name: '破损船锚', tokensNumber: 2000, category: 'D4' },
        { id: 'maelstrom_plating', img: '/static/media/items_sprite.6d12eb9d.svg#maelstrom_plating', name: '怒涛甲片', tokensNumber: 2000, category: 'D4' },
        { id: 'kraken_leather', img: '/static/media/items_sprite.6d12eb9d.svg#kraken_leather', name: '克拉肯皮革', tokensNumber: 2000, category: 'D4' },
        { id: 'kraken_fang', img: '/static/media/items_sprite.6d12eb9d.svg#kraken_fang', name: '克拉肯之牙', tokensNumber: 3000, category: 'D4' },
    ];

    // 当前选中的分类
    let currentCategory = 'all';

    // 计算单币价值
    const calculateProfit = (marketPrice, tokensNumber) => {
        return ((marketPrice * 0.98) / tokensNumber * 1000000).toFixed(2);
    };

    // 手动更新所有单币价值并高亮最佳
    const manualUpdateProfits = () => {
        itemInfo.forEach((item, index) => {
            const input = document.querySelector(`#tokensPricePage .itemBox[data-id="${item.id}"] .priceInput`);
            if (input) {
                const newPrice = parseFloat(input.value);
                if (!isNaN(newPrice)) {
                    item.marketPrice = newPrice;
                    item.profit = calculateProfit(item.marketPrice, item.tokensNumber);

                    // 更新单币价值显示
                    const profitDisplay = document.querySelector(`#tokensPricePage .itemBox[data-id="${item.id}"] .profit-value`);
                    if (profitDisplay) {
                        profitDisplay.textContent = `单币价值: ${item.profit}`;
                    }
                }
            }
        });

        // 重新计算最佳单币价值
        highlightBestProfitItem();
    };

    // 高亮单币价值最大的物品
    const highlightBestProfitItem = () => {
        // 获取当前可见的物品
        const visibleItems = currentCategory === 'all'
            ? itemInfo
            : itemInfo.filter(item => item.category === currentCategory);

        // 移除之前的高亮
        document.querySelectorAll('.itemBox').forEach(box => {
            box.classList.remove('best-profit');
            const marker = box.querySelector('.best-profit-marker');
            if (marker) marker.remove();
        });

        // 找出单币价值最大的物品
        const validItems = visibleItems.filter(item => item.profit !== undefined);
        if (validItems.length === 0) return;

        const maxProfit = Math.max(...validItems.map(item => parseFloat(item.profit)));
        const bestItems = validItems.filter(item => parseFloat(item.profit) === maxProfit);

        // 为每个最佳单币价值物品添加高亮
        bestItems.forEach(bestItem => {
            const itemBox = document.querySelector(`#tokensPricePage .itemBox[data-id="${bestItem.id}"]`);
            if (itemBox) {
                itemBox.classList.add('best-profit');

                // 添加最佳标记
                const marker = document.createElement('div');
                marker.className = 'best-profit-marker';
                marker.textContent = '买';
                itemBox.appendChild(marker);
            }
        });
    };

    // 处理id 匹配github接口字段
    const formatItemName = (id) => {
        return id
            .split('_')
            .map(word => {
                if (word.endsWith('s') && word.length > 1) {
                    const base = word.slice(0, -1);
                    return base.charAt(0).toUpperCase() + base.slice(1) + "'s";
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }
    // 获取物品价格的函数
    const fetchItemPrices = async () => {
        const gitHubResponse = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://mooket.qi-e.top/market/api.json',
                responseType: 'json',
                onload: resolve,
                onerror: reject
            });
        });

        if (gitHubResponse.status === 200) {

            const pricesData = JSON.parse(gitHubResponse.responseText);
            const marketData = pricesData.marketData;

            const timestampInMilliseconds = pricesData.timestamp * 1000;
            const date = new Date(timestampInMilliseconds);
            const formattedTime = date.toLocaleString();

            const timeDisplay = document.querySelector(".updateTime");
            if (timeDisplay) {
                timeDisplay.textContent = `(mooket)更新时间: ${formattedTime}`;
            }

            itemInfo.forEach(item => {
                const marketKey = `/items/${item.id}`;
                if (marketData[marketKey] && marketData[marketKey]["0"]) {
                    item.marketPrice = (marketData[marketKey]["0"].b / 1000000).toFixed(2);
                    item.profit = calculateProfit(item.marketPrice, item.tokensNumber);
                }
            });

            updatePriceInputs();
            highlightBestProfitItem();
            return;
        } else {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://www.milkywayidle.com/game_data/marketplace.json',
                        onload: resolve,
                        onerror: reject
                    });
                });

                const pricesData = JSON.parse(response.responseText);
                const marketData = pricesData.marketData;

                const timestampInMilliseconds = pricesData.timestamp * 1000;
                const date = new Date(timestampInMilliseconds);
                const formattedTime = date.toLocaleString();

                const timeDisplay = document.querySelector(".updateTime");
                if (timeDisplay) {
                    timeDisplay.textContent = `(官方)更新时间: ${formattedTime}`;
                }

                itemInfo.forEach(item => {
                    const marketKey = `/items/${item.id}`;
                    if (marketData[marketKey] && marketData[marketKey]["0"]) {
                        item.marketPrice = (marketData[marketKey]["0"].b / 1000000).toFixed(2);
                        item.profit = calculateProfit(item.marketPrice, item.tokensNumber);
                    }
                });

                updatePriceInputs();
                highlightBestProfitItem();
            } catch (error) {
                console.error('获取价格失败:', error);
                const timeDisplay = document.querySelector(".updateTime");
                if (timeDisplay) {
                    timeDisplay.textContent = `数据获取失败，请手动输入价格`;
                }

                itemInfo.forEach(item => {
                    item.marketPrice = 0;
                    item.profit = 0;
                });
            }
        }
    };
    // 更新输入框中的价格显示
    const updatePriceInputs = () => {
        const container = document.querySelector('#tokensPricePage .flexStart');
        if (!container) return;

        // 清空容器
        container.innerHTML = '';

        // 筛选当前分类的物品
        const filteredItems = currentCategory === 'all'
            ? itemInfo
            : itemInfo.filter(item => item.category === currentCategory);

        // 添加物品
        filteredItems.forEach(item => {
            const itemBox = document.createElement('div');
            itemBox.className = 'itemBox';
            itemBox.dataset.id = item.id;
            itemBox.innerHTML = `
                <div class="ShopPanel_name__3vA-H">${item.name}</div>
                <div class="imgBox">
                    <svg role="img" aria-label="Icon" class="Icon_icon__2LtL_ Icon_large__1H9Z5" width="100%" height="100%">
                        <use href="${item.img}"></use>
                    </svg>
                </div>
                <div class="ShopPanel_costs__XffBM">
                    <input type="number" class="priceInput" value="${item.marketPrice || 0}" step="0.1">
                    <div class="profit-value">单币价值: ${item.profit || 0}</div>
                </div>
            `;
            container.appendChild(itemBox);
        });
    };

    // 创建分类标签
    const createCategoryTabs = () => {
        const tabs = document.createElement('div');
        tabs.className = 'category-tabs';

        const categories = [
            { id: 'all', name: '全部' },
            { id: 'D1', name: 'D1' },
            { id: 'D2', name: 'D2' },
            { id: 'D3', name: 'D3' },
            { id: 'D4', name: 'D4' }
        ];

        categories.forEach(cat => {
            const tab = document.createElement('div');
            tab.className = `category-tab ${currentCategory === cat.id ? 'active' : ''}`;
            tab.textContent = cat.name;
            tab.dataset.category = cat.id;
            tab.addEventListener('click', () => {
                currentCategory = cat.id;
                document.querySelectorAll('.category-tab').forEach(t =>
                    t.classList.remove('active')
                );
                tab.classList.add('active');
                updatePriceInputs();
                highlightBestProfitItem();
            });
            tabs.appendChild(tab);
        });

        return tabs;
    };

    const tabsAdd = () => {
        const muiTabsButtons = document.querySelector('.CharacterManagement_tabsComponentContainer__3oI5G .MuiTabs-flexContainer');
        const newTabButton = document.createElement('button');
        newTabButton.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5';
        newTabButton.innerHTML = `<span class="MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu" id="tokensPriceButton">代币价值<span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorWarning css-dpce5z"></span></span><span class="MuiTouchRipple-root css-w0pj6f"></span>`;
        muiTabsButtons.appendChild(newTabButton);

        const muiTabsPages = document.querySelector('.CharacterManagement_tabsComponentContainer__3oI5G .TabsComponent_tabPanelsContainer__26mzo');
        const newTabPages = document.createElement('div');
        newTabPages.className = 'TabPanel_tabPanel__tXMJF TabPanel_hidden__26UM3';
        newTabPages.innerHTML = `
        <div id="tokensPricePage">
            <div class="remark">
                <div class="title">代币价值以百万(M)为单位，下方单币价值数字越高越好，自动获取的价格为市场右边的收购价</div>
                <div class="updateTime">更新时间: 正在获取中……</div>
            </div>
            <button class="update-all-btn">重新计算</button>
            <div class="flexStart"></div>
        </div>`;

        // 在flexStart前插入分类标签
        const flexStart = newTabPages.querySelector('.flexStart');
        flexStart.parentNode.insertBefore(createCategoryTabs(), flexStart);

        muiTabsPages.appendChild(newTabPages);

        // 添加全局更新按钮事件
        const updateAllBtn = newTabPages.querySelector('.update-all-btn');
        updateAllBtn.addEventListener('click', manualUpdateProfits);

        const allTabButtons = muiTabsButtons.querySelectorAll('.MuiButtonBase-root');
        const allTabPanels = muiTabsPages.querySelectorAll('.TabPanel_tabPanel__tXMJF');

        allTabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                allTabPanels.forEach(panel => panel.classList.add('TabPanel_hidden__26UM3'));
                allTabButtons.forEach(btn => btn.classList.remove('Mui-selected'));

                button.classList.add('Mui-selected');
                if (allTabPanels[index]) {
                    allTabPanels[index].classList.remove('TabPanel_hidden__26UM3');
                    if (button === newTabButton) {
                        fetchItemPrices();
                    }
                }
            });
        });

        // 初始加载数据
        fetchItemPrices();
    };

    const observeDOM = () => {
        const observer = new MutationObserver((mutations, obs) => {
            const muiTabs = document.querySelector('.CharacterManagement_tabsComponentContainer__3oI5G .MuiTabs-flexContainer');
            if (muiTabs) {
                tabsAdd();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    const __Main = () => {
        observeDOM();
    };

    __Main();
})();
