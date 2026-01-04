// ==UserScript==
// @name         MilkywayIdle 市场价格助手（自定义商品+可缩放+删除+移动端优化）
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  市场价格采集与管理工具（可缩放窗口，表头固定，倒计时采集防刷，表格自适应，商品可自定义添加删除，移动端优化）
// @author       AI
// @match        https://www.milkywayidle.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538433/MilkywayIdle%20%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%BC%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89%E5%95%86%E5%93%81%2B%E5%8F%AF%E7%BC%A9%E6%94%BE%2B%E5%88%A0%E9%99%A4%2B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538433/MilkywayIdle%20%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%BC%E5%8A%A9%E6%89%8B%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89%E5%95%86%E5%93%81%2B%E5%8F%AF%E7%BC%A9%E6%94%BE%2B%E5%88%A0%E9%99%A4%2B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function() {
'use strict';

// 常量定义
const CATEGORY_OPTIONS = ["资源", "消耗品", "技能书", "钥匙", "装备", "工具"];
const DEFAULT_PRODUCTS = [
    {name: "糖", category: "资源"}
];
const STORAGE_KEY = 'mw_idle_market_prices';
const PRODUCTS_KEY = 'mw_idle_market_products';
const POSITION_KEY = 'mw_market_helper_position';
const SIZE_KEY = 'mw_market_helper_size';
const COL_VIS_KEY = 'mw_market_helper_col_vis'; // 显示列
const COL_COPY_KEY = 'mw_market_helper_col_copy'; // 复制列
const ALL_COLUMNS = [
    {key: 'name', label: '商品', always: true},
    {key: 'category', label: '分类'},
    {key: 'left', label: '左1'},
    {key: 'right', label: '右1'},
    {key: 'leftAvailable', label: '待出'},
    {key: 'sellOrderCount', label: '出售订单数'},
    {key: 'rightAvailable', label: '待收'},
    {key: 'buyOrderCount', label: '收购订单数'},
    {key: 'ratio', label: '出收比'},
    {key: 'suggestion', label: '建议'},
    {key: 'actions', label: '删除', isAction: true}
];


// 状态变量
let lastMarketPageStatus = false;
let clickLock = false;
let clickCountdown = 0;
let clickCountdownTimer = null;

// 工具函数
function isMobile() {
    return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}



function getColVis() {
    try {
        const arr = JSON.parse(localStorage.getItem(COL_VIS_KEY));
        if (Array.isArray(arr) && arr.length) return arr;
    } catch(e){}
    // 默认全部显示（除了actions）
    return ALL_COLUMNS.filter(c => c.key !== 'actions').map(c => c.key);
}

    function getCooldownTime() {
    let t = Number(localStorage.getItem('mw_market_helper_cooldown_time'));
    if (isNaN(t) || t < 1) t = 1;
    return t;
}

function setColVis(arr) {
    localStorage.setItem(COL_VIS_KEY, JSON.stringify(arr));
}
function getColCopy() {
    try {
        const arr = JSON.parse(localStorage.getItem(COL_COPY_KEY));
        if (Array.isArray(arr) && arr.length) return arr;
    } catch(e){}
    // 默认只复制左1和右1
    return ['left','right'];
}
function setColCopy(arr) {
    localStorage.setItem(COL_COPY_KEY, JSON.stringify(arr));
}



function saveSize(w, h) {
    localStorage.setItem(SIZE_KEY, JSON.stringify({w, h}));
}

function loadSize() {
    try {
        const sz = localStorage.getItem(SIZE_KEY);
        return sz ? JSON.parse(sz) : null;
    } catch(e) {
        return null;
    }
}

function getSavedProducts() {
    try {
        const data = localStorage.getItem(PRODUCTS_KEY);
        if (data) {
            const arr = JSON.parse(data);
            if (Array.isArray(arr) && arr.length > 0 && arr[0].name && arr[0].category) {
                return arr;
            }
        }
    } catch(e) {}
    return [...DEFAULT_PRODUCTS];
}

function saveProducts(arr) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(arr));
}

function getSavedData() {
    const PRODUCTS = getSavedProducts();
    let obj = {};

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            obj = JSON.parse(data);
        }
    } catch(e) {}

    // 确保所有产品都有数据条目
    PRODUCTS.forEach(p => {
        if (!(p.name in obj)) {
            obj[p.name] = {
                left: '',
                right: '',
                leftAvailable: '',
                rightAvailable: '',
                sellOrderCount: 0,
                buyOrderCount: 0
            };
        }
    });

    // 删除不在产品列表中的数据
    Object.keys(obj).forEach(name => {
        if (!PRODUCTS.some(p => p.name === name)) {
            delete obj[name];
        }
    });

    saveData(obj);
    return obj;
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearData() {
    localStorage.removeItem(STORAGE_KEY);
}

// UI相关函数
function showToast(msg, ms=2000) {
    const box = document.createElement("div");
    box.innerText = msg;
    box.style.position = "fixed";
    box.style.left = "50%";
    box.style.top = "30%";
    box.style.transform = "translate(-50%, -50%)";
    box.style.background = "#222";
    box.style.color = "#fff";
    box.style.padding = "18px 36px";
    box.style.fontSize = isMobile() ? "22px" : "20px";
    box.style.borderRadius = "14px";
    box.style.zIndex = 999999;
    box.style.boxShadow = "0 2px 16px #0008";
    box.style.opacity = "0";
    box.style.transition = "opacity 0.3s";
    document.body.appendChild(box);

    setTimeout(() => { box.style.opacity = "1"; }, 10);
    setTimeout(() => {
        box.style.opacity = "0";
        setTimeout(() => box.remove(), 300);
    }, ms);
}

// 检测是否在市场页面
function isMarketPage() {
    const panel = Array.from(document.querySelectorAll('div'))
        .find(div =>
            Array.from(div.classList).some(cls => cls.startsWith('MarketplacePanel_marketplacePanel__')) &&
            div.offsetParent !== null
        );
    const title = Array.from(document.querySelectorAll('h1'))
        .find(h1 =>
            Array.from(h1.classList).some(cls => cls.startsWith('MarketplacePanel_title__')) &&
            h1.textContent.trim().includes('市场') &&
            h1.offsetParent !== null
        );
    return !!(panel && title);
}

// 获取商品分类
function getMarketCategory(itemName) {
    const PRODUCTS = getSavedProducts();
    const item = PRODUCTS.find(p => p.name === itemName);
    return item ? item.category : "资源";
}

// 跳转到市场商品
function jumpToMarketItemWithCategory(itemName, callback) {
    const category = getMarketCategory(itemName);
    const tabBtn = Array.from(document.querySelectorAll('.MuiTabs-flexContainer [role="tab"]'))
        .find(el => el.textContent.trim().startsWith(category));

    if (!tabBtn) {
        showToast('未找到市场分类按钮: ' + category, 2500);
        if (callback) callback(false);
        return;
    }

    if (tabBtn.getAttribute("aria-selected") !== "true") {
        tabBtn.click();
    }

    setTimeout(() => {
        const marketList = document.querySelector('[class^="MarketplacePanel_itemSelectionTabsContainer__"]');
        let svgs = [];

        if (marketList) {
            svgs = Array.from(marketList.querySelectorAll('svg[aria-label]'));
        }

        let svg = svgs.find(el => el.getAttribute('aria-label').trim() === itemName.trim());
        if (!svg) {
            svg = svgs.find(el => el.getAttribute('aria-label').includes(itemName));
        }

        if (svg) {
            const clickable = svg.closest('.Item_item__2De2O');
            if (clickable) {
                clickable.scrollIntoView({behavior: "smooth", block: "center"});
                clickable.click();
                if (callback) callback(true);
                return;
            }
        }

        showToast('未找到该商品，请确认名称和分类！', 2000);
        if (callback) callback(false);
    }, 500);
}

// 数字格式化函数
function parseAmount(str) {
    str = str.replace(/,/g, '').trim().toLowerCase();
    if (str.endsWith('m')) return Math.round(parseFloat(str) * 1e6);
    if (str.endsWith('k')) return Math.round(parseFloat(str) * 1e3);
    return Math.round(parseFloat(str));
}

function formatAmount(n) {
    if (n === undefined || n === null || n === '') return '';
    n = Number(n);
    if (isNaN(n)) return '';
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.00$/, '') + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
    if (n >= 1e4) return (n / 1e3).toFixed(2).replace(/\.00$/, '') + 'K';
    return n.toString();
}


function calcRatio(out, inn) {
    if (!out || !inn) return '';
    if (inn === 0) return '';
    const ratio = out / inn;
    return ratio >= 1 ? ratio.toFixed(2) : (ratio * 100).toFixed(1) + '%';
}

// 获取订单统计
function getOrderStats() {
    const tables = document.querySelectorAll('.MarketplacePanel_orderBookTableContainer__hUu-X table');
    if (tables.length < 2) {
        return {
            sell: {sum: 0, count: 0},
            buy: {sum: 0, count: 0}
        };
    }

    function sumTable(table) {
        const rows = table.querySelectorAll('tbody tr');
        let sum = 0;
        let count = 0;

        for (let row of rows) {
            const numTd = row.querySelector('td');
            if (!numTd) continue;

            const text = numTd.textContent.replace(/[^\d.kKmM]/g, '').trim();
            let value = 0;

            if (/^[\d.]+[kK]$/.test(text)) {
                value = parseFloat(text) * 1000;
            } else if (/^[\d.]+[mM]$/.test(text)) {
                value = parseFloat(text) * 1000000;
            } else {
                value = parseInt(text, 10);
            }

            if (!isNaN(value)) {
                sum += value;
                count++;
            }
        }

        return {sum, count};
    }

    return {
        sell: sumTable(tables[0]),
        buy: sumTable(tables[1])
    };
}

// 添加样式
GM_addStyle(`

#mw_market_helper {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1.5px solid #6ad3fc;
    border-radius: 12px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.10), 0 1px 4px #6ad3fc33;
    font-size: 14px;
    color: #222;
    position: fixed;
    z-index: 99999;
    user-select: none;
    overflow: hidden;
    box-sizing: border-box;
    min-width: 320px !important;
    min-height: 180px !important;
    max-width: 98vw !important;
    max-height: 98vh !important;
    resize: none !important;
    transition: box-shadow 0.18s;
}
#mw_market_helper_header {
    background: linear-gradient(90deg,#e0f7fa 0%,#b2ebf2 100%);
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid #b2ebf2;
    padding: 4px 12px;
    display: flex;
    align-items: center;
    font-weight: bold;
    cursor: grab;
    user-select: none;
    justify-content: space-between;
    font-size: 15px;
    flex: none;
}
#mw_market_helper_title_wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}
#mw_market_helper_countdown {
    font-size: 14px;
    color: #e74c3c;
    font-weight: bold;
    margin-left: 6px;
    min-width: 40px;
    display: inline-block;
}
#mw_market_helper_close {
    cursor: pointer;
    font-size: 18px;
    margin-left: auto;
    color: #d33;
    padding: 0 8px;
    border-radius: 6px;
    transition: background 0.2s;
}
#mw_market_helper_close:hover {
    background: #fdd;
}
#mw_market_helper_table_wrapper {
    flex: 1 1 0;
    min-height: 0;
     max-height: 100%;
    overflow-y: auto;
    overflow-x: auto;
    margin: 0 4px;
    position: relative;
}
#mw_market_helper table {
    border-collapse: collapse;
    width: 100%;
    background: #fff;
    font-size: 13px;
    table-layout: auto;
}
#mw_market_helper th, #mw_market_helper td {
    border: 1px solid #e0e0e0;
    padding: 4px 6px;
    text-align: center;
    word-break: break-all;
}
#mw_market_helper th {
    background: #f4fbfe;
    font-size: 13px;
    position: sticky;
    top: 0;
    z-index: 2;
    font-weight: 600;
    white-space: nowrap;
}

#mw_market_helper td {
    font-size: 13px;
}
#mw_market_helper_actions {
    flex: none;
    margin: 4px 4px 6px 4px;
    user-select: none;
    text-align: left;
}
#mw_market_helper_actions button {
    margin-left: 8px;
    margin-top: 0;
    padding: 3px 13px;
    font-size: 13px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background: #6ad3fc;
    color: #fff;
    opacity: 1;
    transition: background 0.2s;
    box-shadow: 0 1px 2px #8be9fd33;
    display:inline-block;
}
#mw_market_helper_actions button:hover {
    background: #1e90ff;
}
#mw_market_helper_actions button:disabled {
    background: #bbb;
    color: #eee;
    opacity: 0.7;
    cursor: not-allowed;
}
#mw_market_helper_ball {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg,#6ad3fc 30%,#1e90ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    position: fixed;
    z-index: 2147483647 !important;
    box-shadow: 0 2px 12px #6ad3fc33, 0 1.5px 6px #1e90ff22;
    user-select: none;
    transition: background 0.2s;
    pointer-events: auto !important;
}

.mw_market_helper_link {
    text-decoration: none;
    font-weight: bold;
    border-radius: 4px;
    padding: 1px 6px;
    display: inline-block;
    min-width: 52px;
    font-size: 13px;
    transition: background 0.2s, color 0.2s;
    word-break: break-all;
    white-space: normal;
    line-height: 1.2;
}
.mw_market_helper_link.market-disabled {
    background: #e0e0e0 !important;
    color: #aaa !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
    text-decoration: none;
    border: 1px solid #ccc;
}
.mw_market_helper_link.market-enabled {
    background: #2c7 !important;
    color: #fff !important;
    cursor: pointer !important;
    border: 1.5px solid #2c7;
}
.market-helper-del-btn {
    color: #e74c3c;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 0 4px;
    margin-left: 1px;
    vertical-align: middle;
}
.mw_market_helper_resize_handle:after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,transparent 60%,#6ad3fc 100%);
    border-radius: 4px;
}
::-webkit-scrollbar {width: 7px; background: #f7f7f7;}
::-webkit-scrollbar-thumb {background: #b2ebf2;}
body > .market-helper-fix {display:none!important;}
`);


// 启用拖动功能
function enableDrag(dragElem, moveElem) {
    if (isMobile()) return; // 移动端不启用拖动

    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    dragElem.addEventListener('mousedown', function onMouseDown(e) {
        if (e.button !== 0) return;
        isDragging = true;
        const rect = moveElem.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = "none";

        function onMouseMove(e) {
            if (!isDragging) return;

            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            const maxX = window.innerWidth - moveElem.offsetWidth;
            const maxY = window.innerHeight - moveElem.offsetHeight;

            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));

            moveElem.style.left = x + "px";
            moveElem.style.top = y + "px";
            moveElem.style.right = "";
            moveElem.style.bottom = "";
        }

        function onMouseUp() {
            isDragging = false;
            document.body.style.userSelect = "";
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            // 只在拖动box时保存右下角坐标
            if (moveElem.id === 'mw_market_helper') {
                const rect = moveElem.getBoundingClientRect();
                let x = rect.left + rect.width;
                let y = rect.top + rect.height;
                localStorage.setItem(POSITION_KEY, JSON.stringify({x, y}));
                saveSize(moveElem.offsetWidth, moveElem.offsetHeight); // 新增
            }
             if (moveElem.id === 'mw_market_helper_ball') {
        localStorage.setItem('mw_market_helper_ball_pos', JSON.stringify({
            left: moveElem.style.left,
            top: moveElem.style.top
        }));
    }
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });

    // 防止按钮等元素触发拖动
    Array.from(dragElem.querySelectorAll('button, input, a')).forEach(ele => {
        ele.addEventListener('mousedown', e => e.stopPropagation());
    });
}


// 设置市场链接状态
function setMarketLinksEnabled(enabled) {
    document.querySelectorAll('.mw_market_helper_link').forEach(link => {
        if (enabled) {
            link.classList.add('market-enabled');
            link.classList.remove('market-disabled');
            link.onclick = function() {
                if (clickLock) {
                    showToast(`请等待${clickCountdown}s后再次采集`, 1200);
                    return;
                }
                const itemName = this.getAttribute("data-itemname");
                collectPriceManual(itemName);
            };
        } else {
            link.classList.remove('market-enabled');
            link.classList.add('market-disabled');
            link.onclick = function(e) {
                e.preventDefault();
                showToast("请先进入市场界面！", 1800);
            };
        }
    });
}

// 倒计时显示
function showCountdown(sec) {
    const ct = document.getElementById('mw_market_helper_countdown');
    if (!ct) return;

    if (sec > 0) {
        ct.style.display = '';
        ct.textContent = `请等待 ${sec} 秒`;
    } else {
        ct.style.display = 'none';
    }
}

function getCellHighlight(val, his, highlight, isOrder) {
    // highlight: 是否高亮（价格/订单）
    // isOrder: true=订单数量相关，false=价格
    let cellStyle = '';
    let colorNote = '';
    if (!highlight || !his || typeof val === 'undefined' || val === '') return {cellStyle, colorNote};

    let durationMs = Date.now() - (his.streakStartTime || 0);
    // 价格列和订单列都用streakDirection判断
    if (his.streakDirection === "up") {
        if (durationMs > 30000) {
            cellStyle = 'background:#b2e0ff;';
            let duration = formatDuration(durationMs);
            colorNote = `/<span style="color:#333;">${duration}</span>`;
        } else {
            cellStyle = 'background:#fbb;';
        }
    } else if (his.streakDirection === "down") {
        if (durationMs > 30000) {
            cellStyle = 'background:#b2e0ff;';
            let duration = formatDuration(durationMs);
            colorNote = `/<span style="color:#333;">${duration}</span>`;
        } else {
            cellStyle = 'background:#c8f7c5;';
        }
    } else {
        // 首次采集或无变化方向，如果超时也变蓝
        if (durationMs > 30000) {
            cellStyle = 'background:#b2e0ff;';
            let duration = formatDuration(durationMs);
            colorNote = `/<span style="color:#333;">${duration}</span>`;
        } else {
            cellStyle = '';
        }
    }
    return {cellStyle, colorNote};
}



// 渲染表格
function renderTable(data) {
    const table = document.getElementById('mw_market_helper_table');
    if (!table) return;

    const PRODUCTS = getSavedProducts();
    const colVis = getColVis();
    const highlightPrice = localStorage.getItem('mw_market_helper_highlight_price') === '1';
    const highlightOrder = localStorage.getItem('mw_market_helper_highlight_order') === '1';

    // 构造表头
    let html = `<thead><tr>`;
    ALL_COLUMNS.forEach(col=>{
        if (col.key === 'name' || colVis.includes(col.key)) {
            html += `<th>${col.label}</th>`;
        }
    });
    html += `</tr></thead><tbody>`;

    PRODUCTS.forEach((p, idx) => {
        const d = data[p.name] || {
            left: '',
            right: '',
            leftAvailable: '',
            rightAvailable: '',
            sellOrderCount: 0,
            buyOrderCount: 0
        };

        // 计算衍生字段
        const ratio = calcRatio(d.leftAvailable, d.rightAvailable);
        let ratioNum = Number(ratio.replace('%', ''));
        let ratioBg = '';
        if (ratio !== '') {
            if (ratio.includes('%')) {
                if (ratioNum < 100) ratioBg = 'background:#c8f7c5;';
            } else if (ratioNum > 20) {
                ratioBg = 'background:#fbb;';
            }
        }
        let suggestion = '';
        if (ratio !== '') {
            if (ratio.includes('%')) {
                ratioNum = Number(ratio.replace('%',''));
                if (ratioNum < 100) suggestion = '易出售';
            } else {
                ratioNum = Number(ratio);
                if (ratioNum > 20) suggestion = '易收购';
            }
        }
        const delBtn = `<button class="market-helper-del-btn" title="删除" data-index="${idx}">✖</button>`;

        html += `<tr id="mw_market_helper_row_${encodeURIComponent(p.name)}">`;

        ALL_COLUMNS.forEach(col=>{
            if (col.key === 'name' || colVis.includes(col.key)) {
                if (col.key === 'name') {
                    html += `<td>
                        <a href="javascript:void(0);"
                        class="mw_market_helper_link market-disabled"
                        data-itemname="${p.name}">${p.name}</a>
                    </td>`;
                } else if (col.key === 'category') {
                    html += `<td>${p.category}</td>`;
                } else if (col.key === 'left' || col.key === 'right') {
                    let val = d[col.key];
                    let showVal = formatAmount(val);
                    let his = d[col.key + 'History'];
                    let {cellStyle, colorNote} = getCellHighlight(val, his, highlightPrice, false);
                    html += `<td style="${cellStyle}">${showVal}${colorNote}</td>`;
                } else if (
                    col.key === 'leftAvailable' ||
                    col.key === 'rightAvailable' ||
                    col.key === 'sellOrderCount' ||
                    col.key === 'buyOrderCount'
                ) {
                    let val = d[col.key];
                    let showVal = formatAmount(val);
                    let his = d[col.key + 'History'];
                    let {cellStyle, colorNote} = getCellHighlight(val, his, highlightOrder, true);
                    html += `<td style="${cellStyle}">${showVal}${colorNote}</td>`;
                } else if (col.key === 'ratio') {
                    html += `<td style="${ratioBg}">${ratio}</td>`;
                } else if (col.key === 'suggestion') {
                    html += `<td>${suggestion}</td>`;
                } else if (col.key === 'actions') {
                    html += `<td>${delBtn}</td>`;
                }
            }
        });
        html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;

    // 删除按钮事件
    table.querySelectorAll('.market-helper-del-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = Number(this.getAttribute('data-index'));
            const PRODUCTS = getSavedProducts();
            const delName = PRODUCTS[idx].name;

            // 如果只剩一个产品，提示用户不能删除所有产品
            if (PRODUCTS.length <= 1) {
                showToast("至少需要保留一个监控物品！", 2000);
                return;
            }

            if (!confirm(`确定要删除【${delName}】吗？`)) return;

            PRODUCTS.splice(idx, 1);
            saveProducts(PRODUCTS);

            const data = getSavedData();
            if (data[delName]) delete data[delName];
            saveData(data);

            renderTable(getSavedData()); // 删除后刷新全表
        };
    });

    // 右键商品名清除高亮
    table.querySelectorAll('.mw_market_helper_link').forEach(link => {
        link.oncontextmenu = function(e) {
            e.preventDefault();
            const itemName = this.getAttribute('data-itemname');
            const data = getSavedData();
            if (data[itemName]) {
                // 清除所有高亮历史
                ['left','right','leftAvailable','rightAvailable','sellOrderCount','buyOrderCount'].forEach(key=>{
                    if (data[itemName][key+'History']) {
                        delete data[itemName][key+'History'];
                    }
                });
                saveData(data);
                updateTableRow(itemName);
            }
        };
    });
}


function updateTableRow(itemName) {
    const data = getSavedData();
    const PRODUCTS = getSavedProducts();
    const colVis = getColVis();
    const highlightPrice = localStorage.getItem('mw_market_helper_highlight_price') === '1';
    const highlightOrder = localStorage.getItem('mw_market_helper_highlight_order') === '1';
    const p = PRODUCTS.find(pp=>pp.name===itemName);
    if (!p) return;
    const d = data[p.name] || {
        left: '',
        right: '',
        leftAvailable: '',
        rightAvailable: '',
        sellOrderCount: 0,
        buyOrderCount: 0
    };
    let html = '';
    // 计算衍生字段
    const ratio = calcRatio(d.leftAvailable, d.rightAvailable);
    let ratioNum = Number(ratio && ratio.replace('%', ''));
    let ratioBg = '';
    if (ratio !== '') {
        if (ratio.includes('%')) {
            if (ratioNum < 100) ratioBg = 'background:#c8f7c5;';
        } else if (ratioNum > 20) {
            ratioBg = 'background:#fbb;';
        }
    }
    let suggestion = '';
    if (ratio !== '') {
        if (ratio.includes('%')) {
            ratioNum = Number(ratio.replace('%',''));
            if (ratioNum < 100) suggestion = '易出售';
        } else {
            ratioNum = Number(ratio);
            if (ratioNum > 20) suggestion = '易收购';
        }
    }
    const delBtn = `<button class="market-helper-del-btn" title="删除" data-index="${PRODUCTS.findIndex(pp=>pp.name===itemName)}">✖</button>`;

    ALL_COLUMNS.forEach(col=>{
        if (col.key === 'name' || colVis.includes(col.key)) {
            if (col.key === 'name') {
                html += `<td>
                    <a href="javascript:void(0);"
                    class="mw_market_helper_link market-disabled"
                    data-itemname="${p.name}">${p.name}</a>
                </td>`;
            } else if (col.key === 'category') {
                html += `<td>${p.category}</td>`;
            } else if (col.key === 'left' || col.key === 'right') {
                let val = d[col.key];
                let showVal = formatAmount(val);
                let his = d[col.key + 'History'];
                let {cellStyle, colorNote} = getCellHighlight(val, his, highlightPrice, false);
                html += `<td style="${cellStyle}">${showVal}${colorNote}</td>`;
            } else if (
                col.key === 'leftAvailable' ||
                col.key === 'rightAvailable' ||
                col.key === 'sellOrderCount' ||
                col.key === 'buyOrderCount'
            ) {
                let val = d[col.key];
                let showVal = formatAmount(val);
                let his = d[col.key + 'History'];
                let {cellStyle, colorNote} = getCellHighlight(val, his, highlightOrder, true);
                html += `<td style="${cellStyle}">${showVal}${colorNote}</td>`;
            } else if (col.key === 'ratio') {
                html += `<td style="${ratioBg}">${ratio}</td>`;
            } else if (col.key === 'suggestion') {
                html += `<td>${suggestion}</td>`;
            } else if (col.key === 'actions') {
                html += `<td>${delBtn}</td>`;
            }
        }
    });
    const tr = document.getElementById(`mw_market_helper_row_${encodeURIComponent(itemName)}`);
    if (tr) tr.innerHTML = html;

    // 重新绑定删除按钮和右键事件
    if (tr) {
        tr.querySelectorAll('.market-helper-del-btn').forEach(btn => {
            btn.onclick = function() {
                const idx = Number(this.getAttribute('data-index'));
                const PRODUCTS = getSavedProducts();
                const delName = PRODUCTS[idx].name;
                if (PRODUCTS.length <= 1) {
                    showToast("至少需要保留一个监控物品！", 2000);
                    return;
                }
                if (!confirm(`确定要删除【${delName}】吗？`)) return;
                PRODUCTS.splice(idx, 1);
                saveProducts(PRODUCTS);
                const data = getSavedData();
                if (data[delName]) delete data[delName];
                saveData(data);
                renderTable(getSavedData());
            };
        });
        tr.querySelectorAll('.mw_market_helper_link').forEach(link => {
            link.oncontextmenu = function(e) {
                e.preventDefault();
                const itemName = this.getAttribute('data-itemname');
                const data = getSavedData();
                if (data[itemName]) {
                    ['left','right','leftAvailable','rightAvailable','sellOrderCount','buyOrderCount'].forEach(key=>{
                        if (data[itemName][key+'History']) {
                            delete data[itemName][key+'History'];
                        }
                    });
                    saveData(data);
                    updateTableRow(itemName);
                }
            };
        });
    }
}




// 复制表格数据
function doCopy(data) {
    const PRODUCTS = getSavedProducts();
    const colCopy = getColCopy();
    // 动态生成表头
    const header = ALL_COLUMNS.filter(c => !c.isAction && (colCopy.includes(c.key) || c.key === 'name')).map(c => c.label).join('\t');
    const arr = [header];

    PRODUCTS.forEach(p => {
        const d = data[p.name] || {
            left: '',
            right: '',
            leftAvailable: '',
            rightAvailable: '',
            sellOrderCount: 0,
            buyOrderCount: 0
        };

        const ratio = calcRatio(d.leftAvailable, d.rightAvailable);

        // 建议
        let suggestion = '';
        if (ratio !== '') {
            if (ratio.includes('%')) {
                const ratioNum = Number(ratio.replace('%',''));
                if (ratioNum < 100) suggestion = '易出售';
            } else {
                const ratioNum = Number(ratio);
                if (ratioNum > 20) suggestion = '易收购';
            }
        }

        // 动态生成每行数据
        const row = ALL_COLUMNS.filter(c => !c.isAction && (colCopy.includes(c.key) || c.key === 'name')).map(col => {
            if (col.key === 'name') return p.name;
            if (col.key === 'category') return p.category;
            if (col.key === 'left') return d.left;
            if (col.key === 'right') return d.right;
            if (col.key === 'leftAvailable') return d.leftAvailable;
            if (col.key === 'sellOrderCount') return d.sellOrderCount || 0;
            if (col.key === 'rightAvailable') return d.rightAvailable;
            if (col.key === 'buyOrderCount') return d.buyOrderCount || 0;
            if (col.key === 'ratio') return ratio;
            if (col.key === 'suggestion') return suggestion;
            return '';
        }).join('\t');
        arr.push(row);
    });

    const str = arr.join('\n');

    if (typeof GM_setClipboard !== 'undefined') {
        GM_setClipboard(str);
    } else {
        navigator.clipboard.writeText(str);
    }

    showToast("已复制到剪贴板！");
}

// 清除数据
function doClear() {
    clearData();
    renderTable(getSavedData());
}
function formatDuration(ms) {
    if (typeof ms !== "number" || ms < 0) return '';
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60); s %= 60;
    let h = Math.floor(m / 60); m %= 60;
    let d = Math.floor(h / 24); h %= 24;
    let arr = [];
    if (d) arr.push(d + 'd');
    if (h) arr.push(h + 'h');
    if (m) arr.push(m + 'm');
    if (s || arr.length === 0) arr.push(s + 's');
    // 只显示最大单位和次大单位
    return arr.slice(0,2).join('');
}


// 手动收集价格
function collectPriceManual(itemName) {
    if (!isMarketPage()) {
        showToast("请先进入市场界面！", 2000);
        return;
    }

    // 设置冷却时间
    clickLock = true;
    clickCountdown = getCooldownTime();
    showCountdown(clickCountdown);

    if (clickCountdownTimer) clearInterval(clickCountdownTimer);

    clickCountdownTimer = setInterval(() => {
        clickCountdown--;
        showCountdown(clickCountdown);

        if (clickCountdown <= 0) {
            clearInterval(clickCountdownTimer);
            clickLock = false;
            showCountdown(0);
        }
    }, 1000);

    // 跳转到商品并收集数据
    jumpToMarketItemWithCategory(itemName, async (found) => {
        if (!found) {
            showToast("未找到该商品，请确认名称和分类！", 2500);
            return;
        }

        const start = Date.now();
        let data = getSavedData();

        function tryCollectLoop() {
            data = getSavedData();
            const ok = tryCollect(data, itemName);

            if (ok) {
                const stats = getOrderStats();
                const now = Date.now();
                // 保存历史数据
                if (!data[itemName].leftHistory) data[itemName].leftHistory = {};
                if (!data[itemName].rightHistory) data[itemName].rightHistory = {};
                if (!data[itemName].leftAvailableHistory) data[itemName].leftAvailableHistory = {};
                if (!data[itemName].rightAvailableHistory) data[itemName].rightAvailableHistory = {};
                if (!data[itemName].sellOrderCountHistory) data[itemName].sellOrderCountHistory = {};
                if (!data[itemName].buyOrderCountHistory) data[itemName].buyOrderCountHistory = {};

['left','right','leftAvailable','rightAvailable','sellOrderCount','buyOrderCount'].forEach((key) => {
    let val;
    if (key === 'left') val = Number(data[itemName].left);
    else if (key === 'right') val = Number(data[itemName].right);
    else if (key === 'leftAvailable') val = Number(stats.sell.sum);
    else if (key === 'rightAvailable') val = Number(stats.buy.sum);
    else if (key === 'sellOrderCount') val = Number(stats.sell.count);
    else if (key === 'buyOrderCount') val = Number(stats.buy.count);

    let his = data[itemName][key+'History'] || {};

    if (typeof his.value === 'undefined') {
        his.value = val;
        his.streakStartValue = val;
        his.streakStartTime = now;
        his.streakDirection = undefined;
    } else if (his.value !== val) {
        his.streakDirection = (val > his.value) ? "up" : "down";
        his.value = val;
        his.streakStartValue = val;
        his.streakStartTime = now;
    }
    // 相同则不变
    data[itemName][key+'History'] = his;
    data[itemName][key] = val;
    console.log('采集价格:', data[itemName].left, data[itemName].right);
    console.log(`[${itemName}] ${key}: val=${val}, his.value=${his.value}, streakStartTime=${his.streakStartTime}, streakDirection=${his.streakDirection}`);


});



saveData(data);
updateTableRow(itemName);
setMarketLinksEnabled(true);
showToast("价格和订单数采集成功！", 1500);
return;
            }

            if (Date.now() - start > 5000) {
                showToast("5秒内未采集到价格，请重试！", 2500);
                return;
            }

            setTimeout(tryCollectLoop, 400);
        }

        tryCollectLoop();
    });
}


// 尝试采集价格
function tryCollect(data, itemName) {
    const panel = document.querySelector('[class^="MarketplacePanel_currentItem__"]');
    if (!panel) return false;

    const svg = panel.querySelector('svg[aria-label]');
    if (!svg) return false;

    const name = svg.getAttribute('aria-label');
    if (!name || name !== itemName) return false;

    if (!(itemName in data)) return false;

    const tableContainers = document.querySelectorAll('div[class^="MarketplacePanel_orderBookTableContainer__"]');
    if (tableContainers.length < 2) return false;

    const leftSpan = tableContainers[0].querySelector('table tbody tr:nth-child(1) td:nth-child(2) div span');
    const rightSpan = tableContainers[1].querySelector('table tbody tr:nth-child(1) td:nth-child(2) div span');

    const left = leftSpan ? leftSpan.textContent.trim() : '';
    const right = rightSpan ? rightSpan.textContent.trim() : '';

    if (left && right && !isNaN(parseAmount(left)) && !isNaN(parseAmount(right))) {
        data[itemName] = data[itemName] || {};
        data[itemName].left = parseAmount(left);
        data[itemName].right = parseAmount(right);
        saveData(data);
        return true;
    }


    return false;
}


    function isValidProductName(name) {
    // 不允许为空或全空格，不允许特殊字符，仅允许中英文、数字、下划线
    return /^[\u4e00-\u9fa5\w\d]+$/.test(name.trim());
}

// 显示添加产品对话框
function showAddProductDialog() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.18)";
    overlay.style.zIndex = 999999;
    overlay.onclick = () => { overlay.remove(); };

    const dialog = document.createElement("div");
    dialog.style.position = "fixed";
    dialog.style.left = "50%";
    dialog.style.top = "50%";
    dialog.style.transform = "translate(-50%,-50%)";
    dialog.style.background = "#fff";
    dialog.style.padding = "26px 38px";
    dialog.style.borderRadius = "16px";
    dialog.style.boxShadow = "0 2px 20px #0007";
    dialog.style.zIndex = 1000000;
    dialog.style.minWidth = "340px";
    dialog.onclick = e => e.stopPropagation();

    const html = `<div style="font-size:18px;margin-bottom:10px;">添加监控物品</div>
    <table id="add_product_table" style="width:100%;font-size:15px;">
        <tr>
            <th>物品名称</th><th>分类</th><th></th>
        </tr>
        <tr>
            <td><input type="text" style="width:100px;" /></td>
            <td>
                <select>
                    ${CATEGORY_OPTIONS.map(c=>`<option value="${c}">${c}</option>`).join('')}
                </select>
            </td>
            <td><button class="add_row_btn">+</button></td>
        </tr>
    </table>
    <div style="margin-top:14px;text-align:right;">
        <button id="add_product_ok" style="padding:4px 18px;font-size:16px;border-radius:6px;background:#2c7;color:#fff;border:none;">添加</button>
        <button id="add_product_cancel" style="padding:4px 18px;font-size:16px;border-radius:6px;background:#aaa;color:#fff;border:none;margin-left:8px;">取消</button>
    </div>`;

    dialog.innerHTML = html;
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 添加行按钮事件
    dialog.querySelectorAll(".add_row_btn").forEach(btn => {
        btn.onclick = function() {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td><input type="text" style="width:100px;" /></td>
            <td>
                <select>
                    ${CATEGORY_OPTIONS.map(c=>`<option value="${c}">${c}</option>`).join('')}
                </select>
            </td>
            <td><button class="del_row_btn">-</button></td>`;

            dialog.querySelector("#add_product_table").appendChild(tr);

            tr.querySelector(".del_row_btn").onclick = function() {
                tr.remove();
            };
        };
    });

    // 取消按钮事件
    dialog.querySelector("#add_product_cancel").onclick = function() {
        overlay.remove();
    };

    // 确认添加按钮事件
dialog.querySelector("#add_product_ok").onclick = function() {
    const rows = Array.from(dialog.querySelectorAll("#add_product_table tr")).slice(1);
    let added = 0;
    const PRODUCTS = getSavedProducts();

    for (let tr of rows) {
        const name = tr.querySelector("input").value.trim();
        const cat = tr.querySelector("select").value;

        if (!isValidProductName(name)) {
            showToast("物品名称不能为空，且只能包含中英文、数字、下划线！", 1800);
            return;
        }

        if (PRODUCTS.some(p => p.name === name)) {
            showToast("有重复物品名称: " + name, 1800);
            return;
        }
    }

    rows.forEach(tr => {
        const name = tr.querySelector("input").value.trim();
        const cat = tr.querySelector("select").value;
        if (isValidProductName(name) && !PRODUCTS.some(p => p.name === name)) {
            PRODUCTS.push({name, category: cat});
            added++;
        }
    });

    if (added > 0) {
        saveProducts(PRODUCTS);
        renderTable(getSavedData());
        showToast(`成功添加${added}个物品！`, 1800);
    } else {
        showToast("无新增物品或有重复！", 1800);
    }

    overlay.remove();
};

}

    // 显示设置对话框
function showSettingsDialog() {
    // 获取当前设置
    const colVis = getColVis();
    const colCopy = getColCopy();
    const highlightPrice = localStorage.getItem('mw_market_helper_highlight_price') === '1';
    const highlightOrder = localStorage.getItem('mw_market_helper_highlight_order') === '1';
    const cooldownTime = Number(localStorage.getItem('mw_market_helper_cooldown_time')) || 1;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.18)";
    overlay.style.zIndex = 999999;
    overlay.onclick = () => { overlay.remove(); };

    const dialog = document.createElement("div");
    dialog.style.position = "fixed";
    dialog.style.left = "50%";
    dialog.style.top = "50%";
    dialog.style.transform = "translate(-50%,-50%)";
    dialog.style.background = "#fff";
    dialog.style.padding = "26px 38px";
    dialog.style.borderRadius = "16px";
    dialog.style.boxShadow = "0 2px 20px #0007";
    dialog.style.zIndex = 1000000;
    dialog.style.minWidth = "340px";
    dialog.onclick = e => e.stopPropagation();

    // 显示列设置
    let html = `<div style="font-size:18px;margin-bottom:10px;">表格显示列设置</div>
<div style="margin-bottom:10px;">
${ALL_COLUMNS.map(c => {
    if (c.key === 'name') {
        return `<label style="margin-right:16px;"><input type="checkbox" checked disabled> ${c.label}</label>`;
    }
    // 让删除列也可选
    return `<label style="margin-right:16px;">
        <input type="checkbox" class="col-vis" value="${c.key}" ${colVis.includes(c.key)?'checked':''}> ${c.label}
    </label>`;
}).join('')}
</div>
    <div style="font-size:18px;margin:12px 0 8px 0;">复制表格包含列</div>
    <div>
    ${ALL_COLUMNS.filter(c=>!c.isAction).map(c => {
        return `<label style="margin-right:16px;">
            <input type="checkbox" class="col-copy" value="${c.key}" ${colCopy.includes(c.key)?'checked':''}> ${c.label}
        </label>`;
    }).join('')}
    </div>
    <div style="margin:14px 0 8px 0;">
        <label style="margin-right:26px;">
            <input type="checkbox" id="highlight_price" ${highlightPrice ? 'checked' : ''}> 强调价格
        </label>
        <label>
            <input type="checkbox" id="highlight_order" ${highlightOrder ? 'checked' : ''}> 强调订单
        </label>
    </div>
    <div style="margin:10px 0 8px 0;">
    <label>
        采集冷却时间(秒)
        <input type="number" id="cooldown_time" min="1" max="60" value="${cooldownTime}" style="width:60px;margin-left:8px;">
    </label>
</div>

    <div style="margin-top:18px;text-align:right;">
        <button id="mw_settings_export" style="padding:4px 14px;font-size:15px;border-radius:6px;background:#6ad3fc;color:#fff;border:none;margin-right:8px;">导出设置</button>
        <button id="mw_settings_import" style="padding:4px 14px;font-size:15px;border-radius:6px;background:#6ad3fc;color:#fff;border:none;margin-right:24px;">导入设置</button>
        <button id="mw_settings_ok" style="padding:4px 18px;font-size:16px;border-radius:6px;background:#2c7;color:#fff;border:none;">确定</button>
        <button id="mw_settings_cancel" style="padding:4px 18px;font-size:16px;border-radius:6px;background:#aaa;color:#fff;border:none;margin-left:8px;">取消</button>
    </div>`;


    dialog.innerHTML = html;
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 取消
    dialog.querySelector("#mw_settings_cancel").onclick = function() {
        overlay.remove();
    };

    // 确定
    dialog.querySelector("#mw_settings_ok").onclick = function() {
        // 显示列
        const vis = [];
        dialog.querySelectorAll('.col-vis').forEach(chk => {
            if (chk.checked) vis.push(chk.value);
        });
        setColVis(vis);

        // 复制列
        const cop = [];
        dialog.querySelectorAll('.col-copy').forEach(chk => {
            if (chk.checked) cop.push(chk.value);
        });
        setColCopy(cop);

        // 新增保存强调设置
        localStorage.setItem('mw_market_helper_highlight_price', dialog.querySelector('#highlight_price').checked ? '1' : '0');
        localStorage.setItem('mw_market_helper_highlight_order', dialog.querySelector('#highlight_order').checked ? '1' : '0');

        showToast("设置已保存！");
        overlay.remove();
        renderTable(getSavedData());
        const cooldown = parseInt(dialog.querySelector('#cooldown_time').value, 10);
if (isNaN(cooldown) || cooldown < 1) {
    localStorage.setItem('mw_market_helper_cooldown_time', '1');
} else {
    localStorage.setItem('mw_market_helper_cooldown_time', cooldown.toString());
}

    };

    // 导出设置
    dialog.querySelector("#mw_settings_export").onclick = function() {
        const products = getSavedProducts();
        const json = JSON.stringify(products, null, 2);
        // 弹窗展示，方便复制
        const exportBox = document.createElement("div");
        exportBox.style.position = "fixed";
        exportBox.style.left = "50%";
        exportBox.style.top = "50%";
        exportBox.style.transform = "translate(-50%,-50%)";
        exportBox.style.background = "#fff";
        exportBox.style.padding = "22px 18px";
        exportBox.style.borderRadius = "12px";
        exportBox.style.boxShadow = "0 2px 20px #0007";
        exportBox.style.zIndex = 1000001;
        exportBox.innerHTML = `
            <div style="font-size:16px;margin-bottom:8px;">请复制以下内容：</div>
            <textarea readonly style="width:400px;height:180px;font-size:14px;">${json}</textarea>
            <div style="margin-top:12px;text-align:right;">
                <button id="export_close" style="padding:4px 16px;font-size:15px;border-radius:6px;background:#aaa;color:#fff;border:none;">关闭</button>
            </div>
        `;
        document.body.appendChild(exportBox);
        exportBox.querySelector("#export_close").onclick = function() {
            exportBox.remove();
        };
    };

    // 导入设置
    dialog.querySelector("#mw_settings_import").onclick = function() {
        // 弹窗输入框
        const importBox = document.createElement("div");
        importBox.style.position = "fixed";
        importBox.style.left = "50%";
        importBox.style.top = "50%";
        importBox.style.transform = "translate(-50%,-50%)";
        importBox.style.background = "#fff";
        importBox.style.padding = "22px 18px";
        importBox.style.borderRadius = "12px";
        importBox.style.boxShadow = "0 2px 20px #0007";
        importBox.style.zIndex = 1000001;
        importBox.innerHTML = `
            <div style="font-size:16px;margin-bottom:8px;">请粘贴导入的商品设置(JSON)：</div>
            <textarea style="width:400px;height:180px;font-size:14px;"></textarea>
            <div style="margin-top:12px;text-align:right;">
                <button id="import_ok" style="padding:4px 16px;font-size:15px;border-radius:6px;background:#2c7;color:#fff;border:none;">导入</button>
                <button id="import_close" style="padding:4px 16px;font-size:15px;border-radius:6px;background:#aaa;color:#fff;border:none;margin-left:8px;">取消</button>
            </div>
        `;
        document.body.appendChild(importBox);
        importBox.querySelector("#import_close").onclick = function() {
            importBox.remove();
        };
        importBox.querySelector("#import_ok").onclick = function() {
            const val = importBox.querySelector("textarea").value;
            let arr;
            try {
                arr = JSON.parse(val);
            } catch(e) {
                showToast("JSON格式错误！", 2000);
                return;
            }
            if (!Array.isArray(arr)) {
                showToast("导入内容不是商品数组！", 2000);
                return;
            }
            let PRODUCTS = getSavedProducts();
            let added = 0;
            arr.forEach(item => {
                if (
                    item &&
                    typeof item.name === 'string' &&
                    typeof item.category === 'string' &&
                    !PRODUCTS.some(p => p.name === item.name)
                ) {
                    PRODUCTS.push({name: item.name, category: item.category});
                    added++;
                }
            });
            if (added > 0) {
                saveProducts(PRODUCTS);
                renderTable(getSavedData());
                showToast(`成功导入${added}个新商品！`, 2000);
            } else {
                showToast("没有新商品被导入（同名已存在）！", 2000);
            }
            importBox.remove();
        };
    };
}

// 创建UI
function createUI() {
    // 主窗口
    const box = document.createElement('div');
    box.id = 'mw_market_helper';
    box.style.position = 'fixed';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';

    // 设置窗口大小（只在首次创建时设置）
    const sz = loadSize();
    if (sz) {
        box.style.width = sz.w + "px";
        box.style.height = sz.h + "px";
    } else {
        box.style.width = "800px";
        box.style.height = "540px";
    }

    // 悬浮球
    const ball = document.createElement('div');
    const ballPos = (() => {
        try {
            return JSON.parse(localStorage.getItem('mw_market_helper_ball_pos'));
        } catch(e) { return null; }
    })();
    if (ballPos && ballPos.left && ballPos.top) {
        ball.style.left = ballPos.left;
        ball.style.top = ballPos.top;
        ball.style.right = '';
        ball.style.bottom = '';
        ball.style.position = 'fixed';
    }
    ball.id = 'mw_market_helper_ball';
    ball.style.position = 'fixed';
    ball.style.display = 'flex';
    ball.title = '双击展开市场价格助手';
    ball.innerHTML = '￥';
    ball.style.display = 'none';
    document.body.appendChild(ball);

    // 设置位置
    const pos = loadBoxRightBottom();
    if (pos) {
        // 让box右下角对齐到pos.x, pos.y
        const boxW = box.offsetWidth, boxH = box.offsetHeight;
        box.style.left = (pos.x - boxW) + 'px';
        box.style.top = (pos.y - boxH) + 'px';
        box.style.right = '';
        box.style.bottom = '';
        // 圆球圆心
        ball.style.left = (pos.x - ball.offsetWidth/2) + 'px';
        ball.style.top = (pos.y - ball.offsetHeight/2) + 'px';
        ball.style.right = '';
        ball.style.bottom = '';
        ball.style.position = 'fixed';
    } else {
        // 默认右下
        box.style.right = '100px';
        box.style.bottom = '100px';
        box.style.left = '';
        box.style.top = '';
        ball.style.right = '100px';
        ball.style.bottom = '100px';
        ball.style.left = '';
        ball.style.top = '';
        ball.style.position = 'fixed';
    }

    // 标题栏
    const header = document.createElement('div');
    header.id = 'mw_market_helper_header';
    header.innerHTML = `<span id="mw_market_helper_title_wrap">市场价格助手
        <span id="mw_market_helper_countdown" style="display:none"></span>
    </span>
    <span id="mw_market_helper_close" title="关闭">✕</span>`;
    box.appendChild(header);

    // 表格容器
    const tableWrapper = document.createElement('div');
    tableWrapper.id = "mw_market_helper_table_wrapper";
    tableWrapper.style.flex = "1 1 0";
    tableWrapper.style.minHeight = "0";
    tableWrapper.style.overflowY = "auto";
    tableWrapper.style.overflowX = "auto";

const table = document.createElement('table');
table.id = "mw_market_helper_table";
table.style.tableLayout = "auto";
table.style.width = "100%";
tableWrapper.appendChild(table);

box.appendChild(tableWrapper);




    // 按钮区域
    const actions = document.createElement('div');
    actions.id = "mw_market_helper_actions";
    actions.innerHTML = `
    <button id="mw_market_helper_clear">清空历史</button>
    <button id="mw_market_helper_copy">复制表格</button>
    <button id="mw_market_helper_add">添加物品</button>
    <button id="mw_market_helper_settings">设置</button>
`;

    box.appendChild(actions);

    // 添加右下角resize角标
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'mw_market_helper_resize_handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.width = '22px';
    resizeHandle.style.height = '22px';
    resizeHandle.style.right = '2px';
    resizeHandle.style.bottom = '2px';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.style.zIndex = 10;
    resizeHandle.style.background = 'rgba(106,211,252,0.4)';
    resizeHandle.style.borderRadius = '4px';
    resizeHandle.title = '拖动改变窗口大小';

    box.appendChild(resizeHandle);

    // 右下角拖动改变窗口大小
    resizeHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let startX = e.clientX, startY = e.clientY;
        let startW = box.offsetWidth, startH = box.offsetHeight;

        function onMouseMove(e) {
            let newW = startW + (e.clientX - startX);
            let newH = startH + (e.clientY - startY);
            newW = Math.max(400, Math.min(newW, window.innerWidth - box.offsetLeft - 10));
            newH = Math.max(250, Math.min(newH, window.innerHeight - box.offsetTop - 10));
            box.style.width = newW + "px";
            box.style.height = newH + "px";
        }

        function onMouseUp() {
            // 保存右下角坐标
            const rect = box.getBoundingClientRect();
            let x = rect.left + rect.width;
            let y = rect.top + rect.height;
            saveBoxRightBottom(x, y);
            saveSize(box.offsetWidth, box.offsetHeight); // 新增
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    document.body.appendChild(box);

    // 关闭按钮事件
    document.getElementById('mw_market_helper_close').onclick = function(e) {
        e.stopPropagation();
        // 先读取 box 的位置信息
        const rect = box.getBoundingClientRect();
        let x = rect.left + rect.width;
        let y = rect.top + rect.height;
        // 隐藏 box
        box.style.display = 'none';
        // 保证小球不会超出窗口
        x = Math.min(x, window.innerWidth - ball.offsetWidth/2);
        y = Math.min(y, window.innerHeight - ball.offsetHeight/2);
        x = Math.max(ball.offsetWidth/2, x);
        y = Math.max(ball.offsetHeight/2, y);
        // 定位圆球
        ball.style.left = x + "px";
        ball.style.top = y + "px";
        ball.style.right = '';
        ball.style.bottom = '';
        ball.style.position = 'fixed';
        ball.style.display = 'flex';
        // 存储圆球圆心（即box右下角）
        saveBoxRightBottom(x, y);
    };

    // 悬浮球双击事件
    ball.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        if (box.style.display !== 'none' && box.style.display !== '') return;
        box.style.display = ''; // 先显示

        // 不再强制设置宽高，让其保持上次保存的宽高
        // 仅在首次无记录时设置默认宽高
        const sz = loadSize();
        if (!sz) {
            let boxW = Math.max(900, Math.floor(window.innerWidth * 0.8));
            let boxH = Math.max(400, Math.floor(window.innerHeight * 0.7));
            box.style.width = boxW + "px";
            box.style.height = boxH + "px";
        }

        // 让box右下角对齐到圆球圆心
        const bx = ball.offsetLeft;
        const by = ball.offsetTop;
        const rect = box.getBoundingClientRect();
        box.style.left = (bx - rect.width) + "px";
        box.style.top = (by - rect.height) + "px";
        box.style.right = '';
        box.style.bottom = '';
        ball.style.display = 'none';
    });

    // 启用拖动
    enableDrag(header, box); // 只允许header拖动box
    enableDrag(ball, ball); // 允许拖动小球本身

    // 监听窗口缩放
    let lastW = box.offsetWidth, lastH = box.offsetHeight;
    setInterval(() => {
        if (box.offsetWidth !== lastW || box.offsetHeight !== lastH) {
            lastW = box.offsetWidth;
            lastH = box.offsetHeight;
            // 保存右下角坐标
            const rect = box.getBoundingClientRect();
            let x = rect.left + rect.width;
            let y = rect.top + rect.height;
            saveBoxRightBottom(x, y);
            saveSize(box.offsetWidth, box.offsetHeight); // 新增：防止窗口被其他方式调整大小
        }
    }, 1000);

    // 初始显示状态
    box.style.display = 'none';
    ball.style.display = 'flex';
    // 保证初始位置小球在视窗内
    if (ball.offsetLeft < 0) ball.style.left = '10px';
    if (ball.offsetTop < 0) ball.style.top = '10px';
}


function saveBoxRightBottom(x, y) {
    localStorage.setItem(POSITION_KEY, JSON.stringify({x, y}));
}
function loadBoxRightBottom() {
    try {
        const pos = localStorage.getItem(POSITION_KEY);
        return pos ? JSON.parse(pos) : null;
    } catch(e) { return null; }
}

// 初始化
function init() {
    createUI();
    renderTable(getSavedData());

    // 按钮事件绑定
    document.getElementById('mw_market_helper_clear').onclick = doClear;
    document.getElementById('mw_market_helper_copy').onclick = function() {
        doCopy(getSavedData());
    };
    document.getElementById('mw_market_helper_add').onclick = showAddProductDialog;
    document.getElementById('mw_market_helper_settings').onclick = showSettingsDialog;

    // 定期检查市场状态
setInterval(() => {
    const nowMarket = isMarketPage();
    setMarketLinksEnabled(nowMarket);
    if (nowMarket !== lastMarketPageStatus) {
        lastMarketPageStatus = nowMarket;
    }
}, 1000);

const observer = new MutationObserver(() => {
    const nowMarket = isMarketPage();
    setMarketLinksEnabled(nowMarket);
    if (nowMarket !== lastMarketPageStatus) {
        lastMarketPageStatus = nowMarket;
    }
});

// 可以只监听大的 DOM 变化，减少频率
observer.observe(document.body, { childList: true, subtree: false });

}

// 启动脚本
init();

})();
