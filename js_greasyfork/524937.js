// ==UserScript==
// @name         CSGO BUFF 每日市场数据爬虫
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  爬取BUFF CSGO商品信息，支持档位分类
// @author       Your name
// @match        https://buff.163.com/goods/*
// @grant        none
// @license      禁止分享
// @downloadURL https://update.greasyfork.org/scripts/524937/CSGO%20BUFF%20%E6%AF%8F%E6%97%A5%E5%B8%82%E5%9C%BA%E6%95%B0%E6%8D%AE%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/524937/CSGO%20BUFF%20%E6%AF%8F%E6%97%A5%E5%B8%82%E5%9C%BA%E6%95%B0%E6%8D%AE%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储数据的数组
    let itemsData = [];

    // 档位配置
    let tierConfig = JSON.parse(localStorage.getItem('tierConfig')) || Array(7).fill().map((_, i) => ({
        name: `档位${i + 1}`,
        seeds: ''
    }));

    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 创建UI界面
    function createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 400px;
        `;

        const buttonStyle = `
            margin: 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
        `;

        const inputStyle = `
            width: 100%;
            margin: 5px 0;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 3px;
        `;

        // 创建档位配置UI
        let tierInputsHTML = '';
        for (let i = 0; i < 7; i++) {
            tierInputsHTML += `
                <div style="margin: 5px 0;">
                    <input type="text" id="tierName${i}" placeholder="档位名称"
                           value="${tierConfig[i].name}" style="${inputStyle}">
                    <input type="text" id="tierSeeds${i}" placeholder="模板ID（用逗号分隔）"
                           value="${tierConfig[i].seeds}" style="${inputStyle}">
                </div>
            `;
        }

        container.innerHTML = `
            <div style="margin-bottom: 10px;">
                <button id="copyTable" style="${buttonStyle}">复制表格</button>
                <button id="clearTable" style="${buttonStyle}">清空表格</button>
                <button id="autoNext" style="${buttonStyle}">自动翻页</button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="saveTiers" style="${buttonStyle}">保存档位配置</button>
            </div>
            <div style="max-height: 200px; overflow-y: auto; margin-bottom: 10px;">
                ${tierInputsHTML}
            </div>
            <div id="itemsTable" style="margin-top: 10px; max-height: 300px; overflow-y: auto;"></div>
        `;

        document.body.appendChild(container);

        // 绑定按钮事件
        document.getElementById('copyTable').addEventListener('click', copyTableToClipboard);
        document.getElementById('clearTable').addEventListener('click', clearTable);
        document.getElementById('autoNext').addEventListener('click', toggleAutoNext);
        document.getElementById('saveTiers').addEventListener('click', saveTierConfig);
    }

    // 保存档位配置
    function saveTierConfig() {
        tierConfig = Array(7).fill().map((_, i) => ({
            name: document.getElementById(`tierName${i}`).value,
            seeds: document.getElementById(`tierSeeds${i}`).value
        }));
        localStorage.setItem('tierConfig', JSON.stringify(tierConfig));
        updateAllItemTiers();
        updateTable();
        alert('档位配置已保存！');
    }

    // 获取商品档位
    function getItemTier(paintseed) {
        for (let i = 0; i < tierConfig.length; i++) {
            const seeds = tierConfig[i].seeds
                .split(/[,，、]/)
                .map(s => s.trim())
                .filter(s => s);

            if (seeds.includes(paintseed.toString())) {
                return tierConfig[i].name;
            }
        }
        return '未分类';
    }

    // 更新所有商品的档位
    function updateAllItemTiers() {
        itemsData.forEach(item => {
            item.tier = getItemTier(item.paintseed);
        });
    }

// 解析商品数据
function parseItems() {

    // 查找具有特定 id 的 table
const table = document.querySelector('table#market-selling-list');
if (!table) return;

// 查找该 table 下的 tbody
const tbody = table.querySelector('tbody');
if (!tbody) return;

    console.log('开始解析商品数据');

    const rows = tbody.querySelectorAll('tr');
    const newItems = [];

    rows.forEach((row, index) => {
        const lastTd = row.querySelector('td:last-child');
        if (!lastTd) {
            console.warn(`行 ${index} 无法找到最后一个 <td> 元素`);
            return;
        }

        const link = lastTd.querySelector('a');
        if (!link) {
            console.warn(`行 ${index} 无法找到 <a> 元素`);
            return;
        }

        try {
            const assetInfo = JSON.parse(link.getAttribute('data-asset-info'));
            const price = parseFloat(link.getAttribute('data-price'));
            console.log(`行 ${index} 解析成功`, assetInfo, price);

            const item = {
                paintseed: assetInfo.info ? assetInfo.info.paintseed : '', // 使用空值作为默认
                paintwear: assetInfo.paintwear || '', // 使用空值作为默认
                name: assetInfo.info && assetInfo.info.metaphysic ? assetInfo.info.metaphysic.data.name : '',
                price: price || 0, // 使用0作为默认
                tier: assetInfo.info ? getItemTier(assetInfo.info.paintseed) : '未分类'
            };

            // 去重检查
            const isDuplicate = itemsData.some(existing =>
                existing.paintseed === item.paintseed &&
                existing.paintwear === item.paintwear);

            if (!isDuplicate) {
                console.log(`添加新项目:`, item);
                newItems.push(item);
            } else {
                console.info('检测到重复项目:', item);
            }
        } catch (e) {
            console.error('解析数据错误，生成默认值:', e);

            const item = {
                paintseed: '',
                paintwear: '',
                name: '',
                price: 0,
                tier: '未分类'
            };

            const isDuplicate = itemsData.some(existing =>
                existing.paintseed === item.paintseed &&
                existing.paintwear === item.paintwear);

            if (!isDuplicate) {
                console.log(`添加默认项目:`, item);
                newItems.push(item);
            }
        }
    });

    // 批量更新数据
    if (newItems.length > 0) {
        console.log(`更新数据表，共新增 ${newItems.length} 项`);
        itemsData = [...itemsData, ...newItems];
        requestAnimationFrame(updateTable);
    } else {
        console.log('没有新项目需要更新');
    }
}


    // 更新表格显示
    function updateTable() {
        const tableContainer = document.getElementById('itemsTable');
        if (!tableContainer) return;

        const fragment = document.createDocumentFragment();
        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse;';
        table.border = "1";

        // 构建表头
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>模板ID</th>
                <th>磨损值</th>
                <th>相关标签</th>
                <th>价格</th>
                <th>档位</th>
            </tr>
        `;
        table.appendChild(thead);

        // 构建表体
        const tbody = document.createElement('tbody');
        itemsData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.paintseed}</td>
                <td>${item.paintwear}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.tier}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        fragment.appendChild(table);

        // 一次性更新DOM
        tableContainer.innerHTML = '';
        tableContainer.appendChild(fragment);
    }

    // 复制表格到剪贴板
    function copyTableToClipboard() {
        const tableHtml = document.getElementById('itemsTable').innerHTML;
        const textarea = document.createElement('textarea');
        textarea.value = tableHtml;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('表格已复制到剪贴板！');
    }

    // 清空表格
    function clearTable() {
        itemsData = [];
        updateTable();
    }

    // 自动翻页变量
    let isAutoNextEnabled = false;
    let pageChangeTimeout = null;

    // 切换自动翻页
    function toggleAutoNext() {
        isAutoNextEnabled = !isAutoNextEnabled;
        const button = document.getElementById('autoNext');
        button.style.background = isAutoNextEnabled ? '#ff4444' : '#4CAF50';
        button.textContent = isAutoNextEnabled ? '停止翻页' : '自动翻页';

        if (isAutoNextEnabled) {
            goToNextPage();
        } else if (pageChangeTimeout) {
            clearTimeout(pageChangeTimeout);
            pageChangeTimeout = null;
        }
    }

    // 执行翻页
    function goToNextPage() {
        if (!isAutoNextEnabled) return;

        const nextButton = document.querySelector('a.page-link.next');
        if (nextButton) {
            nextButton.click();
            // 使用较长的延时确保页面完全加载
            pageChangeTimeout = setTimeout(() => {
                parseItems();
                goToNextPage();
            }, 3000);
        } else {
            isAutoNextEnabled = false;
            const button = document.getElementById('autoNext');
            button.style.background = '#4CAF50';
            button.textContent = '自动翻页';
        }
    }

    // 优化后的观察者
    const observer = new MutationObserver(
        throttle((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    parseItems();
                }
            });
        }, 1000)
    );

    // 初始化
    function init() {
        createUI();
        parseItems();

        // 开始监听页面变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等待页面完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
