// ==UserScript==
// @name         Amazon GS Official Ads Course Tool
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a button to upload Excel, process data, and visualize keyword analysis with improved filtering, fixed position, and enhanced UI
// @author       Moz
// @license      MIT
// @match        https://gs.amazon.com.tw/learn/official-course
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507752/Amazon%20GS%20Official%20Ads%20Course%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/507752/Amazon%20GS%20Official%20Ads%20Course%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const prepositions = ['in', 'at', 'on', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there'];
    const units = ['ounce', 'oz', 'ml', 'liter', 'litre', 'gallon', 'pound', 'lbs', 'inch', 'cm', 'mm', 'meter', 'metre', 'km', 'mile', 'yard', 'foot', 'feet', 'gram', 'kg', 'milligram'];

    let campaignNames = new Set();
    let selectedCampaigns = new Set();
    let originalData = [];

    let button = document.createElement('button');
    button.innerHTML = '上傳Excel文件';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.onclick = function () {
        uploadExcel();
    };
    document.body.appendChild(button);

    function uploadExcel() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx';
        input.onchange = async function (event) {
            let file = event.target.files[0];
            if (file) {
                let data = await file.arrayBuffer();
                processExcel(data);
            }
        };
        input.click();
    }

    function processExcel(data) {
        let workbook = XLSX.read(data, { type: 'array' });
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        originalData = XLSX.utils.sheet_to_json(sheet);

        campaignNames = new Set(originalData.map(row => row["Campaign Name"]));
        selectedCampaigns = new Set(campaignNames);

        renderResults();
    }

    function renderResults() {
        // 確保只有一個視窗
        const existingModal = document.getElementById('resultModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'resultModal';
        modal.style.position = 'fixed';
        modal.style.top = '10%';
        modal.style.left = '50%';
        modal.style.transform = 'translateX(-50%)';
        modal.style.zIndex = 1001;
        modal.style.padding = '20px';
        modal.style.backgroundColor = 'white';
        modal.style.border = '1px solid #ddd';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.width = '80%';

        // 關閉按鈕放在右上角
        let closeButton = document.createElement('button');
        closeButton.innerHTML = '關閉';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function () {
            document.body.removeChild(modal);
        };
        modal.appendChild(closeButton);

        // 檢查是否至少選擇一個Campaign
        if (selectedCampaigns.size === 0) {
            let warning = document.createElement('div');
            warning.innerHTML = '請至少選擇一個Campaign！';
            warning.style.color = 'red';
            warning.style.marginBottom = '10px';
            modal.appendChild(warning);
        }

        let campaignFilter = document.createElement('div');
        campaignFilter.style.marginBottom = '10px';
        campaignFilter.style.display = 'flex';
        campaignFilter.style.flexWrap = 'wrap';
        campaignFilter.style.gap = '10px';

        campaignNames.forEach(name => {
            let label = document.createElement('label');
            label.style.marginRight = '10px';

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = selectedCampaigns.has(name);
            checkbox.onchange = function () {
                if (checkbox.checked) {
                    selectedCampaigns.add(name);
                } else {
                    selectedCampaigns.delete(name);
                }
                renderResults();
            };

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(name));
            campaignFilter.appendChild(label);
        });
        modal.appendChild(campaignFilter);

        const filteredData = originalData.filter(row => selectedCampaigns.has(row["Campaign Name"]));

        let allKeywords = new Set();
        filteredData.forEach(row => {
            let terms = row["Customer Search Term"].toString().toLowerCase().split(/\s+/);
            terms.forEach(term => {
                if (
                    term &&
                    !/^\d+$/.test(term) &&
                    !/^b0[a-z0-9]{8}$/.test(term) &&
                    !/^(.)\1*$/.test(term) &&
                    !prepositions.includes(term) &&
                    !units.includes(term)
                ) {
                    allKeywords.add(term);
                }
            });
        });

        let keywordData = {};
        allKeywords.forEach(keyword => {
            keywordData[keyword] = { "Impressions": 0, "Clicks": 0, "Spend": 0, "Sales": 0, "Orders": 0 };

            filteredData.forEach(row => {
                let terms = row["Customer Search Term"].toString().toLowerCase();
                if (terms.includes(keyword)) {
                    keywordData[keyword]["Impressions"] += row["Impressions"];
                    keywordData[keyword]["Clicks"] += row["Clicks"];
                    keywordData[keyword]["Spend"] += row["Spend"];
                    keywordData[keyword]["Sales"] += row["7 Day Total Sales "];
                    keywordData[keyword]["Orders"] += row["7 Day Total Orders (#)"];
                }
            });
        });

        const totalImpressions = filteredData.reduce((acc, item) => acc + item.Impressions, 0);
        const totalClicks = filteredData.reduce((acc, item) => acc + item.Clicks, 0);
        const totalSpend = filteredData.reduce((acc, item) => acc + item.Spend, 0);
        const totalSales = filteredData.reduce((acc, item) => acc + item["7 Day Total Sales "], 0);
        const totalOrders = filteredData.reduce((acc, item) => acc + item["7 Day Total Orders (#)"], 0);

        const summary = {
            totalKeywords: allKeywords.size,
            totalImpressions,
            totalClicks,
            totalSpend,
            totalSales,
            totalOrders,
            avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
            avgCPC: totalClicks > 0 ? totalSpend / totalClicks : 0,
            avgCVR: totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0,
            avgACoS: totalSales > 0 ? (totalSpend / totalSales) * 100 : (totalSpend === 0 ? 0 : "")
        };

        let adTagData = Object.entries(keywordData).map(([term, values]) => ({
            "Customer Search Term": term,
            ...values,
            "CTR": values["Impressions"] > 0 ? (values["Clicks"] / values["Impressions"]) * 100 : 0,
            "CPC": values["Clicks"] > 0 ? values["Spend"] / values["Clicks"] : 0,
            "CVR": values["Clicks"] > 0 ? (values["Orders"] / values["Clicks"]) * 100 : 0,
            "ACoS": values["Sales"] > 0 ? (values["Spend"] / values["Sales"]) * 100 : (values["Spend"] === 0 ? 0 : "")
        }));

        adTagData.sort((a, b) => b.Impressions - a.Impressions);

        showResultsAsTable(modal, adTagData, summary);
    }

    function showResultsAsTable(modal, data, summary) {
        // 渲染表格數據和統計數據
        let summaryDiv = document.createElement('div');
        summaryDiv.style.marginBottom = '10px';
        summaryDiv.style.fontSize = '14px';
        summaryDiv.style.color = '#333';
        summaryDiv.style.display = 'flex';
        summaryDiv.style.flexWrap = 'wrap';
        summaryDiv.style.gap = '15px';
        summaryDiv.innerHTML = `
            <span>關鍵詞總數：${summary.totalKeywords}</span>
            <span>總曝光量：${summary.totalImpressions.toLocaleString()}</span>
            <span>總點擊量：${summary.totalClicks.toLocaleString()}</span>
            <span>總花費：${summary.totalSpend.toFixed(2).toLocaleString()}</span>
            <span>總銷售額：${summary.totalSales.toFixed(2).toLocaleString()}</span>
            <span>總訂單數：${summary.totalOrders.toLocaleString()}</span>
            <span>平均點擊率：${summary.avgCTR.toFixed(1)}%</span>
            <span>平均廣告競價：${summary.avgCPC.toFixed(2).toLocaleString()}</span>
            <span>平均轉化率：${summary.avgCVR.toFixed(1)}%</span>
            <span>平均ACoS：${summary.avgACoS === "" ? "" : summary.avgACoS === 0 ? "0%" : Math.round(summary.avgACoS) + "%"}</span>
        `;
        modal.appendChild(summaryDiv);

        let table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        let headerRow = document.createElement('tr');
        let headers = ['Customer Search Term', 'Impressions', 'Clicks', 'Spend', 'Sales', 'Orders', 'CTR', 'CPC', 'CVR', 'ACoS'];
        headers.forEach((header, index) => {
            let th = document.createElement('th');
            th.innerText = header;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.backgroundColor = '#f8f9fa';
            th.style.fontWeight = 'bold';
            th.style.cursor = 'pointer';
            th.onclick = function () {
                sortTable(data, index);
                showResultsAsTable(modal, data, summary);
            };
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(row => {
            let tr = document.createElement('tr');
            Object.entries(row).forEach(([key, value]) => {
                let td = document.createElement('td');
                td.innerText = formatValue(key, value);
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';

       // 根據欄位名稱設置對齊方式
                if (key === 'Customer Search Term') {
                    td.style.textAlign = 'left';  // 關鍵詞欄靠左
                } else {
                    td.style.textAlign = 'right'; // 其他欄靠右
                }

                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        modal.appendChild(table);
        document.body.appendChild(modal);
    }

    function formatValue(key, value) {
        if (value === null || value === Infinity) return '';
        switch (key) {
            case 'Impressions':
            case 'Clicks':
            case 'Orders':
                return parseInt(value).toLocaleString();
            case 'Spend':
            case 'Sales':
            case 'CPC':
                return parseFloat(value).toFixed(2).toLocaleString();
            case 'CTR':
            case 'CVR':
                return parseFloat(value).toFixed(1) + '%';
            case 'ACoS':
                return value === 0 ? '0%' : (value === "" ? "" : Math.round(value) + '%');
            default:
                return value;
        }
    }

    function sortTable(data, index) {
        const key = Object.keys(data[0])[index];
        data.sort((a, b) => {
            if (typeof a[key] === 'string') {
                return a[key].localeCompare(b[key]);
            }
            return b[key] - a[key];
        });
    }

})();
