// ==UserScript==
// @name         高德地图POI提取并导出CSV
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在amap.com搜索结果页面添加UI，用于提取商户信息（名称、地址），实时显示数量并可导出为CSV文件。
// @author       CodeDust
// @match        https://*.amap.com/search*
// @icon         https://a.amap.com/pc/static/favicon.ico
// @grant        GM_addStyle
// @charset      UTF-8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542900/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BEPOI%E6%8F%90%E5%8F%96%E5%B9%B6%E5%AF%BC%E5%87%BACSV.user.js
// @updateURL https://update.greasyfork.org/scripts/542900/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BEPOI%E6%8F%90%E5%8F%96%E5%B9%B6%E5%AF%BC%E5%87%BACSV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'amap_poi_data';

    // --- 1. 创建UI元素 (按钮和容器) ---
    const panel = document.createElement('div');
    panel.id = 'gemini-gaode-panel';

    // 使用 innerHTML 一次性构建所有按钮，结构更清晰
    panel.innerHTML = `
        <button class="gemini-save-btn" id="gemini-extract-btn" title="一键保存本页所有商户信息">提取本页数据</button>
        <div class="gemini-main-btn" id="gemini-download-btn" title="点击下载已收集的商户信息">
            <span>下载CSV</span>
            <span class="gemini-data-count" id="gemini-poi-count">0</span>
        </div>
        <button class="gemini-clear-btn" id="gemini-clear-btn" title="清空所有已收集的数据">清空</button>
    `;
    document.body.appendChild(panel);

    // 获取按钮元素的引用
    const extractButton = document.getElementById('gemini-extract-btn');
    const downloadButton = document.getElementById('gemini-download-btn');
    const clearButton = document.getElementById('gemini-clear-btn');
    const countElement = document.getElementById('gemini-poi-count');


    // --- 2. 添加与参考代码一致的样式 ---
    GM_addStyle(`
        #gemini-gaode-panel {
            display: flex;
            align-items: center;
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
        }
        .gemini-main-btn, .gemini-clear-btn, .gemini-save-btn {
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 14px;
            font-family: "Microsoft YaHei", sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            margin-left: 10px;
            height: 40px;
            color: white;
            padding: 0 15px;
            user-select: none; /* 防止选中文本 */
        }
        .gemini-save-btn {
            background-color: #409EFF; /* 主操作按钮 - 蓝色 */
            font-weight: bold;
        }
        .gemini-save-btn:hover {
            background-color: #3a8ee6;
        }
        .gemini-main-btn {
            background-color: #00AE66; /* 下载按钮 - 绿色 */
        }
        .gemini-main-btn:hover {
            background-color: #00995a;
        }
        .gemini-clear-btn {
            background-color: #F56C6C; /* 清空按钮 - 红色 */
            min-width: 50px;
        }
        .gemini-clear-btn:hover {
            background-color: #d32f2f;
        }
        .gemini-data-count {
            background-color: white;
            color: #00AE66;
            padding: 2px 8px;
            border-radius: 10px;
            margin-left: 8px;
            font-weight: bold;
            font-size: 12px;
            min-width: 12px;
            text-align: center;
        }
        .gemini-main-btn.disabled, .gemini-clear-btn.disabled {
            background-color: #b0bec5 !important;
            cursor: not-allowed;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
    `);

    // --- 3. 核心功能函数 ---

    function updateButtonState() {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const count = data.length;

        if (countElement) {
            countElement.innerText = count;
        }

        if (count === 0) {
            downloadButton.classList.add('disabled');
            clearButton.classList.add('disabled');
        } else {
            downloadButton.classList.remove('disabled');
            clearButton.classList.remove('disabled');
        }
    }

    function extractData() {
        const poiList = document.querySelectorAll('.poibox');
        if (poiList.length === 0) return;

        let existingData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        poiList.forEach(item => {
            const nameElement = item.querySelector('.poi-name');
            const addressElement = item.querySelector('.poi-addr');
            if (nameElement && addressElement) {
                const name = nameElement.getAttribute('title') || nameElement.innerText.trim().replace(/^\d+\.\s*/, '');
                const address = addressElement.innerText.trim();
                const isDuplicate = existingData.some(poi => poi.name === name && poi.address === address);
                if (!isDuplicate) {
                    existingData.push({ name, address });
                }
            }
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
        updateButtonState();
    }

    function downloadCSV() {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        if (data.length === 0) return;

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "名称,地址\n";
        data.forEach(item => {
            const name = `"${item.name.replace(/"/g, '""')}"`;
            const address = `"${item.address.replace(/"/g, '""')}"`;
            csvContent += `${name},${address}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `高德地图商户信息_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function clearData() {
        if (JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').length === 0) return;
        if (confirm('您确定要清空所有已收集的商户信息吗？此操作不可恢复。')) {
            localStorage.removeItem(STORAGE_KEY);
            updateButtonState();
        }
    }

    // --- 4. 绑定事件监听与初始化 ---
    extractButton.addEventListener('click', extractData);
    downloadButton.addEventListener('click', downloadCSV);
    clearButton.addEventListener('click', clearData);

    // 脚本加载时，立即更新一次按钮状态和数量
    updateButtonState();

})();