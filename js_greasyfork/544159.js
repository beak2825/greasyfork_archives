// ==UserScript==
// @name         亞馬遜廣告關鍵詞報告分析工具
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在亞馬遜賣家後台新增「廣告分析工具」按鈕。支援上傳XLSX搜尋字詞報告，進行關鍵詞與ASIN的互動式分析。內建數據可視化儀表板、多維度篩選器，並支援一鍵導出用於AI分析的結構化Prompt。
// @author       moz
// @match        https://gs.amazon.com.tw/onboarding-service*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/544159/%E4%BA%9E%E9%A6%AC%E9%81%9C%E5%BB%A3%E5%91%8A%E9%97%9C%E9%8D%B5%E8%A9%9E%E5%A0%B1%E5%91%8A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544159/%E4%BA%9E%E9%A6%AC%E9%81%9C%E5%BB%A3%E5%91%8A%E9%97%9C%E9%8D%B5%E8%A9%9E%E5%A0%B1%E5%91%8A%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全域變數 ---
    let analysisModal = null;
    let rawData = [];
    let currentFileName = '';
    let activeFilterType = 'none';
    let campaignFilters = new Set();
    let adGroupFilters = new Set();
    const initialTableFilters = { searchTerm: '', keywordType: 'all', thresholdType: 'all', thresholdValue: null, performanceTag: 'all' };
    let tableFilters = { ...initialTableFilters };
    let globalStats = {};


    // --- 樣式定義 (GM_addStyle) ---
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Huninn&display=swap');
        #ad-analysis-tool-btn{box-sizing:border-box;background-image:none;text-align:center;cursor:pointer;border-radius:36px;display:inline-block;font:700 18px/18px 'Huninn',Helvetica,Arial,sans-serif!important;min-width:0;padding:13px 26px;text-decoration:none;transition:box-shadow .15s;background-color:#ff9900;border:2px solid #ff9900;box-shadow:none;color:#161d26;margin-left:10px;vertical-align:middle}#ad-analysis-tool-btn:hover{box-shadow:0 2px 5px rgba(0,0,0,.2)}#analysis-modal-overlay{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;background-color:rgba(0,0,0,.75)!important;z-index:9999!important;display:flex!important;justify-content:center!important;align-items:center!important}#analysis-modal{background-color:#232f3e!important;color:#fff!important;width:95vw!important;max-width:1600px!important;height:90vh!important;border-radius:8px!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;border:1px solid #4a5d74!important;box-shadow:0 10px 30px rgba(0,0,0,.5)!important;font-family:'Huninn',sans-serif!important;font-size:14px!important}.modal-header{padding:16px 24px;border-bottom:1px solid #4a5d74;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;background-color:#1a2430}.modal-header h2{margin:0;font-size:22px;font-weight:500;flex-grow:1}.modal-close-btn{background:0 0;border:none;color:#ccc;font-size:28px;cursor:pointer;line-height:1;margin-left:16px}.modal-close-btn:hover{color:#fff}#stats-overview-panel{padding:16px 24px;border-bottom:1px solid #4a5d74;display:flex;flex-direction:column;gap:12px}#stats-overview-title{font-size:14px;color:#ddd;text-align:left;font-weight:500}#stats-overview-grid{display:flex;justify-content:space-between;align-items:stretch;flex-wrap:nowrap;gap:12px}.stat-item{flex:1 1 0;text-align:left;display:flex;flex-direction:column;background-color:#2b3b4f;padding:10px 12px;border-radius:4px}.stat-label{font-size:13px;color:#ccc;margin-bottom:4px;white-space:nowrap}.stat-value{font-size:24px;font-weight:700;color:#fff;line-height:1.2}.modal-body{padding:16px;flex-grow:1;overflow:hidden;display:grid;grid-template-columns:280px 1fr;gap:16px}#filter-panel{display:flex;flex-direction:column;gap:16px;border-right:1px solid #4a5d74;padding-right:16px;overflow-y:hidden}.filter-section{display:flex;flex-direction:column;gap:8px;overflow-y:auto;padding-bottom:10px}.filter-section-title{font-size:16px;font-weight:700;color:#ff9900;padding-bottom:8px;border-bottom:1px solid #4a5d74;margin-bottom:4px;position:sticky;top:0;background:#232f3e}.filter-item{cursor:pointer;padding:6px 10px;border-radius:4px;transition:background-color .2s;word-break:break-all;font-size:14px;display:flex;justify-content:space-between;align-items:center}.filter-item:hover{background-color:#37475a}.filter-item.active{background-color:#007bff;color:#fff;font-weight:700}.filter-item-name{flex-grow:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        /* --- 橢圓 --- */
        .filter-item-count{color:#aaa;margin-left:8px;font-size:12px;background-color:#37475a;padding:2px 10px;border-radius:10px;white-space:nowrap;min-width:18px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;}
        .filter-item.active .filter-item-count{background-color:#fff;color:#007bff}#main-content-panel{display:flex;flex-direction:column;min-height:0}.table-container{border:1px solid #4a5d74;border-radius:6px;display:flex;flex-direction:column;flex-grow:1;min-height:0;overflow:auto}#keyword-table{width:100%;border-collapse:collapse;table-layout:fixed}#keyword-table thead{position:sticky;top:0;z-index:10;background-color:#1a2430}#keyword-table th{padding:12px 10px;text-align:center;font-weight:700;border-bottom:2px solid #ff9900;white-space:nowrap}#keyword-table td{padding:10px;border-bottom:1px solid #37475a;vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#keyword-table tbody tr:hover{background-color:#2b3b4f}.suggestion-cell{white-space:nowrap;text-align:left}.suggestion-cell span{display:inline-block;background-color:#37475a;color:#f0f0f0;padding:4px 8px;border-radius:12px;margin:2px;font-size:12px}#keyword-table .num-cell{text-align:right}#loading-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center;color:#fff;font-size:20px;z-index:100}#table-filter-controls{display:flex;gap:16px;padding-bottom:16px;align-items:flex-end;flex-wrap:wrap}.filter-group{display:flex;flex-direction:column;gap:4px}.filter-group label{font-size:12px;color:#aaa;margin-left:2px}.filter-group input{box-sizing:border-box;padding:8px;border-radius:4px;border:1px solid #555;background-color:#1a2430;color:#fff;font-size:14px;font-family:'Huninn',sans-serif}.filter-group input[type=text]{min-width:200px}.filter-group .threshold-inputs{display:flex;gap:8px}.filter-group input[type=number]{width:100px}.filter-group input:disabled{background-color:#333;cursor:not-allowed}.toggle-group{display:inline-flex;background-color:#37475a;border-radius:20px;padding:4px}.toggle-btn{background-color:transparent;border:none;color:#ccc;padding:6px 14px;cursor:pointer;border-radius:16px;font-family:'Huninn',sans-serif;font-size:14px;transition:all .2s ease-in-out}.toggle-btn.active-toggle{background-color:#ff9900;color:#161d26;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,.2)}.reset-btn{background-color:#4a5d74;color:#fff;border:1px solid #5a6d84;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:700;transition:background-color .2s}.reset-btn:hover{background-color:#5a6d84}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}input[type=number]{-moz-appearance:textfield}#file-info-btn{color:#ccc;text-decoration:underline;cursor:pointer;font-size:14px;margin:0 16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:250px;display:inline-block;vertical-align:middle}#export-prompt-btn{background:0 0;border:none;color:#ccc;font-size:22px;cursor:pointer;padding:0 8px}#export-prompt-btn:hover{color:#fff}
    `);

    // --- 多語言支持 & 數據正規化 ---
    const keyMap = {
        'Campaign Name': ['Campaign Name', '廣告活動名稱'],
        'Ad Group Name': ['Ad Group Name', '廣告群組名稱'],
        'Customer Search Term': ['Customer Search Term', '客戶搜尋字詞'],
        'Impressions': ['Impressions', '廣告曝光'],
        'Clicks': ['Clicks', '點擊'],
        'Spend': ['Spend', '支出'],
        '7 Day Total Sales': ['7 Day Total Sales ', '7 Day Total Sales', '7 天總銷售額 ', '7 天總銷售額'],
        '7 Day Total Orders (#)': ['7 Day Total Orders (#)', '7 天總訂單數 (#)'],
        '7 Day Total Units (#)': ['7 Day Total Units (#)', '7 天單位總數 (#)'],
    };

    function normalizeRow(rawRow) {
        const normalized = {};
        for (const standardKey in keyMap) {
            const variations = keyMap[standardKey];
            for (const variation of variations) {
                if (rawRow[variation] !== undefined) {
                    normalized[standardKey] = rawRow[variation];
                    break;
                }
            }
        }
        return normalized;
    }

    // --- 輔助函數 ---
    function formatNumberWithUnit(num) { if (num >= 1000000) return (num / 1000000).toFixed(1) + ' M'; if (num >= 1000) return (num / 1000).toFixed(1) + ' k'; return num.toLocaleString(); }
    const isASIN = (term) => typeof term === 'string' && term.toLowerCase().startsWith('b0') && term.length === 10;


    // --- 核心功能函數 ---
    function handleFileSelect(isReupload = false) { const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; fileInput.style.display = 'none'; fileInput.onchange = e => { const file = e.target.files[0]; if (file) { currentFileName = file.name; if (!isReupload) createAnalysisUI(); showLoading('正在解析報告...'); const reader = new FileReader(); reader.onload = event => parseAndProcessReport(event.target.result); reader.readAsArrayBuffer(file); } }; document.body.appendChild(fileInput); fileInput.click(); document.body.removeChild(fileInput); }
    function parseAndProcessReport(arrayBuffer) { try { const workbook = XLSX.read(arrayBuffer, { type: 'buffer' }); const firstSheetName = workbook.SheetNames[0]; const worksheet = workbook.Sheets[firstSheetName]; const jsonData = XLSX.utils.sheet_to_json(worksheet);
        rawData = jsonData.map(rawRow => {
            const normalized = normalizeRow(rawRow);
            return {
                ...normalized,
                'Impressions': Number(normalized['Impressions']) || 0,
                'Clicks': Number(normalized['Clicks']) || 0,
                'Spend': Number(normalized['Spend']) || 0,
                '7 Day Total Sales': Number(normalized['7 Day Total Sales']) || 0,
                '7 Day Total Orders (#)': Number(normalized['7 Day Total Orders (#)']) || 0,
                '7 Day Total Units (#)': Number(normalized['7 Day Total Units (#)']) || 0,
            };
        });
        document.getElementById('reset-filters-btn').click(); if (document.getElementById('file-info-btn')) document.getElementById('file-info-btn').textContent = currentFileName; hideLoading(); } catch (error) { console.error("XLSX 解析錯誤:", error); alert("文件解析失敗，請確認文件格式正確。"); hideLoading(); if (analysisModal) analysisModal.remove(); } }
    function applyGlobalFilters(sourceData) { return sourceData.filter(row => { const searchTerm = (row['Customer Search Term'] || '').toLowerCase(); if (tableFilters.searchTerm && !searchTerm.includes(tableFilters.searchTerm)) return false; if (tableFilters.keywordType === 'keyword' && isASIN(searchTerm)) return false; if (tableFilters.keywordType === 'asin' && !isASIN(searchTerm)) return false; if (tableFilters.thresholdType === 'impressions' && row['Impressions'] < tableFilters.thresholdValue) return false; if (tableFilters.thresholdType === 'clicks' && row['Clicks'] < tableFilters.thresholdValue) return false; if (activeFilterType === 'campaign' && campaignFilters.size > 0 && !campaignFilters.has(row['Campaign Name'])) return false; if (activeFilterType === 'adGroup' && adGroupFilters.size > 0 && !adGroupFilters.has(row['Ad Group Name'])) return false; return true; }); }
    function applyLocalFilters(aggregatedData) { if (tableFilters.performanceTag === 'all') return aggregatedData; return aggregatedData.filter(kw => { if (tableFilters.performanceTag === 'high') { return kw.ctr > globalStats.avgCTR && kw.cvr > globalStats.avgCVR; } if (tableFilters.performanceTag === 'low') { return kw.ctr < globalStats.avgCTR && kw.cvr < globalStats.avgCVR; } return true; }); }
    function applyFiltersAndRender() { const globallyFilteredData = applyGlobalFilters(rawData); renderStatsOverview(globallyFilteredData); const aggregatedForTable = aggregateDataByKeyword(globallyFilteredData); const locallyFilteredForTable = applyLocalFilters(aggregatedForTable); renderDataTable(locallyFilteredForTable); renderFilterPanel(globallyFilteredData); updateActiveFilterUI(); }
    function aggregateDataByKeyword(sourceData) { const keywordMap = new Map(); sourceData.forEach(row => { const searchTerm = row['Customer Search Term']; if (!searchTerm || searchTerm === '*') return; if (!keywordMap.has(searchTerm)) { keywordMap.set(searchTerm, { searchTerm, impressions: 0, clicks: 0, spend: 0, orders: 0, sales: 0 }); } const current = keywordMap.get(searchTerm); current.impressions += row['Impressions']; current.clicks += row['Clicks']; current.spend += row['Spend']; current.orders += row['7 Day Total Orders (#)']; current.sales += row['7 Day Total Sales']; }); const aggregatedData = Array.from(keywordMap.values()); aggregatedData.forEach(kw => { kw.ctr = kw.impressions > 0 ? kw.clicks / kw.impressions : 0; kw.cpc = kw.clicks > 0 ? kw.spend / kw.clicks : 0; kw.cvr = kw.clicks > 0 ? kw.orders / kw.clicks : 0; kw.acos = kw.sales > 0 ? kw.spend / kw.sales : 0; kw.suggestions = generateSuggestions(kw); }); return aggregatedData; }
    function generateSuggestions(kw) { const suggestions = []; const { clicks, orders, spend, ctr, cvr, acos, impressions } = kw; if (orders > 0) { if (acos < 0.25 && cvr > 0.10 && orders > 2) { suggestions.push('建議放入獨立手動廣告組', '維持現有出價策略'); if (acos < 0.15) suggestions.push('可微幅提高競價'); } else if (cvr > 0.08 && clicks > 20) { suggestions.push('高潛力詞'); if (impressions < 5000) suggestions.push('提高競價與預算以增加曝光'); } else { suggestions.push('維持現有策略'); } } else { if (spend > 15 && clicks > 30) { suggestions.push('建議暫停投放', '考慮否定'); } else if (spend > 8 && clicks > 15) { suggestions.push('建議降低競價'); } } if (clicks > 50 && cvr < 0.02 && spend > 10) { suggestions.push('分析競品差異'); } if (impressions > 5000 && ctr < 0.002) { suggestions.push('檢查廣告素材', '考慮暫停或否定'); } if (clicks > 5 && orders === 0) { suggestions.push('持續監控轉化率'); } if (suggestions.length === 0) { suggestions.push('維持中等競價'); } return [...new Set(suggestions)]; }

    // --- UI 渲染函數 ---
    function createAnalysisUI() { if (analysisModal) analysisModal.remove(); analysisModal = document.createElement('div'); analysisModal.id = 'analysis-modal-overlay'; analysisModal.innerHTML = `<div id="analysis-modal"><div class="modal-header"><h2>廣告關鍵詞分析</h2><button id="export-prompt-btn" title="導出AI分析Prompt">📋</button><span id="file-info-btn"></span><button class="modal-close-btn">×</button></div><div id="stats-overview-panel"><div id="stats-overview-title"></div><div id="stats-overview-grid"></div></div><div class="modal-body"><div id="filter-panel"><div class="filter-section" id="campaign-filter-section"><h3 class="filter-section-title">By Campaign</h3><div class="filter-list"></div></div><div class="filter-section" id="adgroup-filter-section"><h3 class="filter-section-title">By Ad Group</h3><div class="filter-list"></div></div></div><div id="main-content-panel"><div id="table-filter-controls"></div><div class="table-container"><table id="keyword-table"><thead></thead><tbody></tbody></table></div></div></div><div id="loading-overlay" style="display: none;"><span></span></div></div>`; document.body.appendChild(analysisModal); analysisModal.querySelector('.modal-close-btn').onclick = () => analysisModal.remove(); analysisModal.onclick = (e) => { if (e.target.id === 'analysis-modal-overlay') analysisModal.remove(); }; const fileInfoBtn = document.getElementById('file-info-btn'); fileInfoBtn.textContent = currentFileName; fileInfoBtn.title = `點擊更換檔案: ${currentFileName}`; fileInfoBtn.onclick = () => handleFileSelect(true); document.getElementById('export-prompt-btn').onclick = exportAIPrompt; const filterControls = document.getElementById('table-filter-controls'); filterControls.innerHTML = `<div class="filter-group"><label>查詢關鍵詞</label><input type="text" id="keyword-search-input" placeholder="輸入文字..."></div><div class="filter-group"><label>關鍵詞類型</label><div class="toggle-group" id="keyword-type-toggle"><button class="toggle-btn active-toggle" data-value="all">全部</button><button class="toggle-btn" data-value="keyword">僅關鍵詞</button><button class="toggle-btn" data-value="asin">僅ASIN</button></div></div><div class="filter-group"><label>門檻設定</label><div class="threshold-inputs"><div class="toggle-group" id="threshold-type-toggle"><button class="toggle-btn active-toggle" data-value="all">全部</button><button class="toggle-btn" data-value="impressions">曝光量</button><button class="toggle-btn" data-value="clicks">點擊量</button></div><input type="number" id="threshold-value-input" placeholder="輸入數字" disabled></div></div><div class="filter-group"><label>績效標籤</label><div class="toggle-group" id="performance-tag-toggle"><button class="toggle-btn active-toggle" data-value="all">全部</button><button class="toggle-btn" data-value="high">高績效</button><button class="toggle-btn" data-value="low">低績效</button></div></div><div class="filter-group" style="flex-grow:1; align-items:flex-end;"><button class="reset-btn" id="reset-filters-btn">重置</button></div>`; initTableFilterListeners(); }
    function setupToggleGroup(groupId, filterKey, callback) { const group = document.getElementById(groupId); if(!group) return; group.addEventListener('click', e => { const target = e.target.closest('.toggle-btn'); if (target) { group.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active-toggle')); target.classList.add('active-toggle'); tableFilters[filterKey] = target.dataset.value; if (callback) callback(target.dataset.value); applyFiltersAndRender(); } }); }
    function initTableFilterListeners() { document.getElementById('keyword-search-input').addEventListener('input', e => { tableFilters.searchTerm = e.target.value.toLowerCase(); applyFiltersAndRender(); }); const thresholdValueEl = document.getElementById('threshold-value-input'); setupToggleGroup('keyword-type-toggle', 'keywordType'); setupToggleGroup('performance-tag-toggle', 'performanceTag'); setupToggleGroup('threshold-type-toggle', 'thresholdType', value => { thresholdValueEl.disabled = value === 'all'; if(value === 'all') { thresholdValueEl.value = ''; tableFilters.thresholdValue = null; } }); thresholdValueEl.addEventListener('input', e => { tableFilters.thresholdValue = e.target.value === '' ? null : Number(e.target.value); applyFiltersAndRender(); }); document.getElementById('reset-filters-btn').addEventListener('click', () => { tableFilters = { ...initialTableFilters }; document.getElementById('keyword-search-input').value = ''; document.querySelectorAll('.toggle-group').forEach(group => { group.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active-toggle')); group.querySelector('.toggle-btn[data-value="all"]').classList.add('active-toggle'); }); thresholdValueEl.value = ''; thresholdValueEl.disabled = true; applyFiltersAndRender(); }); }
    function renderStatsOverview(sourceData) { const gridEl = document.getElementById('stats-overview-grid'); const titleEl = document.getElementById('stats-overview-title'); if (!gridEl || !titleEl) return; const total = sourceData.reduce((acc, row) => { acc.impressions += row['Impressions']; acc.clicks += row['Clicks']; acc.orders += row['7 Day Total Orders (#)']; acc.units += row['7 Day Total Units (#)']; acc.sales += row['7 Day Total Sales']; acc.spend += row['Spend']; return acc; }, { impressions: 0, clicks: 0, orders: 0, units: 0, sales: 0, spend: 0 }); const ctr = total.impressions > 0 ? total.clicks / total.impressions : 0; const cvr = total.clicks > 0 ? total.orders / total.clicks : 0; const avgCPC = total.clicks > 0 ? total.spend / total.clicks : 0; const acos = total.sales > 0 ? (total.spend / total.sales) * 100 : 0; globalStats = { totalImpressions: total.impressions, totalClicks: total.clicks, totalOrders: total.orders, totalSales: total.sales, totalSpend: total.spend, avgCTR: ctr, avgCVR: cvr, avgCPC, overallACOS: acos }; const metrics = [ { label: '總曝光量', value: formatNumberWithUnit(total.impressions) }, { label: '總點擊量', value: formatNumberWithUnit(total.clicks) }, { label: '平均點擊率', value: `${(ctr * 100).toFixed(2)}%` }, { label: '總訂單數', value: total.orders.toLocaleString() }, { label: '總銷售量', value: total.units.toLocaleString() }, { label: '總銷售額', value: `$${total.sales.toFixed(1)}` }, { label: '平均客單價', value: total.orders > 0 ? `$${(total.sales / total.orders).toFixed(1)}` : '$0.0' }, { label: '平均轉化率', value: `${(cvr * 100).toFixed(1)}%` }, { label: '廣告總花費', value: `$${total.spend.toFixed(1)}` }, { label: '平均CPC', value: `$${avgCPC.toFixed(1)}` }, { label: 'ACOS', value: acos > 0 ? `${Math.round(acos)}%` : 'N/A' }, ]; gridEl.innerHTML = metrics.map(m => `<div class="stat-item"><div class="stat-label">${m.label}</div><div class="stat-value">${m.value}</div></div>`).join(''); const uniqueKeywords = new Set(sourceData.map(r => r['Customer Search Term']).filter(Boolean)); titleEl.textContent = `篩選結果總覽 (${uniqueKeywords.size} 個關鍵詞)`; }
    function renderDataTable(data) { const thead = document.querySelector('#keyword-table thead'); const tbody = document.querySelector('#keyword-table tbody'); if (!thead || !tbody) return; thead.innerHTML = `<tr><th>客戶搜尋字詞</th><th>曝光量</th><th>點擊量</th><th>點擊率</th><th>總支出</th><th>CPC</th><th>轉化率</th><th>出單量</th><th>銷售額</th><th>ACoS</th><th>建議</th></tr>`; const sortedData = [...data].sort((a, b) => b.orders - a.orders || b.clicks - a.clicks); tbody.innerHTML = sortedData.map(kw => `<tr title="${kw.searchTerm}"><td title="${kw.searchTerm}">${kw.searchTerm}</td><td class="num-cell">${kw.impressions.toLocaleString()}</td><td class="num-cell">${kw.clicks.toLocaleString()}</td><td class="num-cell">${(kw.ctr * 100).toFixed(2)}%</td><td class="num-cell">$${kw.spend.toFixed(1)}</td><td class="num-cell">$${kw.cpc.toFixed(1)}</td><td class="num-cell">${(kw.cvr * 100).toFixed(1)}%</td><td class="num-cell">${kw.orders.toLocaleString()}</td><td class="num-cell">$${kw.sales.toFixed(1)}</td><td class="num-cell">${kw.acos > 0 ? Math.round(kw.acos * 100) + '%' : 'N/A'}</td><td class="suggestion-cell">${kw.suggestions.map(s => `<span>${s}</span>`).join('')}</td></tr>`).join(''); }
    function getUniqueKeywordCount(sourceData, filterKey, filterValue) { const filtered = filterValue === 'all' ? sourceData : sourceData.filter(row => row[filterKey] === filterValue); return new Set(filtered.map(row => row['Customer Search Term']).filter(Boolean)).size; }
    function renderFilterPanel(globallyFilteredData) { const campaignListEl = document.querySelector('#campaign-filter-section .filter-list'); const adGroupListEl = document.querySelector('#adgroup-filter-section .filter-list'); if (!campaignListEl || !adGroupListEl) return; campaignListEl.innerHTML = ''; adGroupListEl.innerHTML = ''; const allCampaigns = [...new Set(rawData.map(row => row['Campaign Name']).filter(Boolean))].sort(); const allAdGroups = [...new Set(rawData.map(row => row['Ad Group Name']).filter(Boolean))].sort(); campaignListEl.appendChild(createFilterItem('全部廣告活動', getUniqueKeywordCount(globallyFilteredData, 'Campaign Name', 'all'), 'campaign', 'all')); allCampaigns.forEach(name => { const count = getUniqueKeywordCount(globallyFilteredData, 'Campaign Name', name); if(count > 0) campaignListEl.appendChild(createFilterItem(name, count, 'campaign', name)); }); adGroupListEl.appendChild(createFilterItem('全部廣告群組', getUniqueKeywordCount(globallyFilteredData, 'Ad Group Name', 'all'), 'adGroup', 'all')); allAdGroups.forEach(name => { const count = getUniqueKeywordCount(globallyFilteredData, 'Ad Group Name', name); if(count > 0) adGroupListEl.appendChild(createFilterItem(name, count, 'adGroup', name)); }); }
    function createFilterItem(name, count, type, value) { const item = document.createElement('div'); item.className = 'filter-item'; item.dataset.type = type; item.dataset.value = value; item.innerHTML = `<span class="filter-item-name" title="${name}">${name}</span><span class="filter-item-count">${count}</span>`; item.onclick = () => { if (activeFilterType !== type) { activeFilterType = type; if (type === 'campaign') adGroupFilters.clear(); else campaignFilters.clear(); } const filterSet = type === 'campaign' ? campaignFilters : adGroupFilters; if (value === 'all') { filterSet.clear(); } else { if (filterSet.has(value)) filterSet.delete(value); else filterSet.add(value); } applyFiltersAndRender(); }; return item; }
    function updateActiveFilterUI() { document.querySelectorAll('.filter-item').forEach(el => { const { type, value } = el.dataset; const filterSet = type === 'campaign' ? campaignFilters : adGroupFilters; el.classList.remove('active'); if (activeFilterType === type) { if (filterSet.size === 0 && value === 'all') el.classList.add('active'); if (filterSet.has(value)) el.classList.add('active'); } else if (activeFilterType === 'none' && value === 'all') { el.classList.add('active'); } }); }
    function showLoading(message) { const overlay = document.getElementById('loading-overlay'); if (overlay) { overlay.style.display = 'flex'; overlay.querySelector('span').textContent = message; } }
    function hideLoading() { const overlay = document.getElementById('loading-overlay'); if (overlay) { overlay.style.display = 'none'; } }

    // --- 修正 #2 & #3: 重構Prompt導出功能 ---
    function exportAIPrompt() {
        const aggregatedData = aggregateDataByKeyword(rawData);

        // 分離關鍵詞和ASIN
        const keywordsData = aggregatedData.filter(kw => !isASIN(kw.searchTerm));
        const asinsData = aggregatedData.filter(kw => isASIN(kw.searchTerm));

        // 定義篩選條件
        const highPerformers = data => data.filter(kw => kw.ctr > globalStats.avgCTR && kw.cvr > globalStats.avgCVR).sort((a,b) => b.sales - a.sales).slice(0, 10);
        const lowPerformers = data => data.filter(kw => kw.spend > 0 && kw.ctr < globalStats.avgCTR && kw.cvr < globalStats.avgCVR).sort((a,b) => b.spend - a.spend).slice(0, 10);
        const zeroOrderHighSpend = data => data.filter(kw => kw.orders === 0 && kw.spend > 0).sort((a,b) => b.spend - a.spend).slice(0, 10);

        // 輔助函數：生成Markdown表格或提示信息
        const generateMarkdownTable = (data, headers, rowGenerator) => {
            if (data.length === 0) {
                return '此類別中沒有符合條件的項目。\n';
            }
            const headerLine = `| ${headers.join(' | ')} |`;
            const separatorLine = `|${headers.map(() => '---').join('|')}|`;
            const rows = data.map(rowGenerator).join('\n');
            return `${headerLine}\n${separatorLine}\n${rows}\n`;
        };

        // 生成各類別的表格內容
        const highPerfKeywordsTable = generateMarkdownTable(highPerformers(keywordsData),
            ['搜尋字詞', '點擊量', '轉化率', '銷售額', 'ACoS'],
            kw => `| ${kw.searchTerm} | ${kw.clicks} | ${(kw.cvr*100).toFixed(1)}% | $${kw.sales.toFixed(1)} | ${kw.acos > 0 ? Math.round(kw.acos*100) + '%' : 'N/A'} |`
        );
        const highPerfAsinsTable = generateMarkdownTable(highPerformers(asinsData),
            ['目標ASIN', '點擊量', '轉化率', '銷售額', 'ACoS'],
            kw => `| ${kw.searchTerm} | ${kw.clicks} | ${(kw.cvr*100).toFixed(1)}% | $${kw.sales.toFixed(1)} | ${kw.acos > 0 ? Math.round(kw.acos*100) + '%' : 'N/A'} |`
        );
        const lowPerfKeywordsTable = generateMarkdownTable(lowPerformers(keywordsData),
            ['搜尋字詞', '點擊量', '花費', '轉化率', '訂單'],
            kw => `| ${kw.searchTerm} | ${kw.clicks} | $${kw.spend.toFixed(1)} | ${(kw.cvr*100).toFixed(1)}% | ${kw.orders} |`
        );
        const lowPerfAsinsTable = generateMarkdownTable(lowPerformers(asinsData),
            ['目標ASIN', '點擊量', '花費', '轉化率', '訂單'],
            kw => `| ${kw.searchTerm} | ${kw.clicks} | $${kw.spend.toFixed(1)} | ${(kw.cvr*100).toFixed(1)}% | ${kw.orders} |`
        );
        const zeroOrderKeywordsTable = generateMarkdownTable(zeroOrderHighSpend(keywordsData),
            ['搜尋字詞', '點擊量', '花費'],
            kw => `| ${kw.searchTerm} | ${kw.clicks} | $${kw.spend.toFixed(1)} |`
        );
        const zeroOrderAsinsTable = generateMarkdownTable(zeroOrderHighSpend(asinsData),
            ['目標ASIN', '點擊量', '花費'],
            kw => `| ${kw.searchTerm} | ${kw.clicks} | $${kw.spend.toFixed(1)} |`
        );

        const content = `# 角色扮演：亞馬遜廣告策略分析專家

作為一名經驗豐富的亞馬遜廣告策略分析專家，你的任務是基於以下提供的廣告報告摘要，為我提供一份全面、深入、且可執行的優化策略。

## 報告基本信息
- **報告來源文件**: \`${currentFileName}\`
- **分析目標**: 提升廣告效益(ROAS)，降低無效花費，並發掘潛在機會。

---

## 一、整體廣告表現概覽 (Overall Performance)

這部分數據是整個廣告帳戶在報告期間的宏觀表現，是我們後續所有分析的基準。

| 指標 (Metric) | 數值 (Value) |
|---|---|
| 總曝光量 (Total Impressions) | ${globalStats.totalImpressions.toLocaleString()} |
| 總點擊量 (Total Clicks) | ${globalStats.totalClicks.toLocaleString()} |
| 總訂單數 (Total Orders) | ${globalStats.totalOrders.toLocaleString()} |
| 總銷售額 (Total Sales) | $${globalStats.totalSales.toFixed(1)} |
| 總花費 (Total Spend) | $${globalStats.totalSpend.toFixed(1)} |
| **平均點擊率 (Avg. CTR)** | **${(globalStats.avgCTR * 100).toFixed(2)}%** |
| **平均轉化率 (Avg. CVR)** | **${(globalStats.avgCVR * 100).toFixed(1)}%** |
| 平均單次點擊成本 (Avg. CPC) | $${globalStats.avgCPC.toFixed(2)} |
| 整體廣告成本銷售比 (Overall ACoS) | ${Math.round(globalStats.overallACOS)}% |

---

## 二、高績效流量分析 (High-Performance Traffic Analysis)
*定義：點擊率(CTR)與轉化率(CVR)均高於平均值。這些是我們需要加大投入的「金牛」流量。*

### 2.1 高績效搜尋字詞 (Top 10 High-Performing Search Terms)
${highPerfKeywordsTable}
**分析要點：**
- 這些搜尋字詞的核心特徵是什麼？是否高度相關？
- 應該如何將這些詞轉移到手動精準(Exact Match)廣告活動中，並給予獨立預算以擴大戰果？
- 這些詞是否揭示了我們尚未滿足的客戶需求或產品使用場景？

### 2.2 高績效商品目標 (Top 10 High-Performing ASIN Targets)
${highPerfAsinsTable}
**分析要點：**
- 這些ASIN是直接競爭對手、配件還是補充品？
- 我們在這些競品的頁面上獲得轉化，說明我們的產品在哪方面（如價格、評價、主圖）具有優勢？
- 是否應該建立專門的商品投放(Product Targeting)廣告活動，積極搶占這些ASIN的流量？

---

## 三、低績效流量分析 (Low-Performance Traffic Analysis)
*定義：點擊率(CTR)與轉化率(CVR)均低於平均值，但仍有花費。這些是需要優化或止損的流量。*

### 3.1 低績效搜尋字詞 (Top 10 Low-Performing Search Terms)
${lowPerfKeywordsTable}
**分析要點：**
- 這些詞的相關性如何？有多少是應該被加入「否定關鍵詞(Negative Keywords)」列表的？
- 對於那些有一定相關性但表現不佳的詞，問題出在出價過高、廣告創意不符，還是落地頁(Listing)本身轉化能力不足？

### 3.2 低績效商品目標 (Top 10 Low-Performing ASIN Targets)
${lowPerfAsinsTable}
**分析要點：**
- 我們為什麼會在這些競品頁面上表現不佳？是我們的價格太高、評價太差，還是產品本身不具可比性？
- 針對這些ASIN，是應該降低出價、暫停投放，還是直接否定？

---

## 四、高花費無轉化流量分析 (High-Spend, Zero-Order Traffic)
*定義：有顯著花費但訂單數為0的流量。這些是必須立即處理的「燒錢」項。*

### 4.1 高花費無轉化搜尋字詞 (Top 10 High-Spend, Zero-Order Search Terms)
${zeroOrderKeywordsTable}
**分析要點：**
- 立即檢查這些詞的匹配類型。如果是廣泛匹配(Broad Match)導致的，應考慮調整為詞組(Phrase)或精準匹配，或直接否定。
- 這些詞是否應被立即加入「否定關鍵詞」列表以停止虧損？

### 4.2 高花費無轉化商品目標 (Top 10 High-Spend, Zero-Order ASIN Targets)
${zeroOrderAsinsTable}
**分析要點：**
- 這些ASIN與我們的產品關聯度到底有多大？流量是否精準？
- 建議立即暫停對這些ASIN的投放，並進行深入的競品分析，找出無法轉化的原因。

---

## 五、綜合分析與行動建議 (Overall Analysis & Action Plan)

請基於以上所有數據，為我提供一份清晰、分步的行動計劃。我希望看到具體的建議，而不僅僅是籠統的原則。

1.  **預算重分配策略**:
    - **增加預算**: 點名哪些廣告活動/廣告組（基於高績效詞/ASIN的來源）應增加預算。
    - **減少預算**: 點名哪些廣告活動/廣告組應減少預算或暫停。
2.  **出價調整策略**:
    - **提高出價**: 針對哪些具體的「高績效搜尋字詞」和「高績效ASIN」？
    - **降低出價**: 針對哪些「低績效」或「高花費無轉化」的項目？
3.  **關鍵詞與目標管理**:
    - **精準添加列表**: 整理一份建議加入手動精準廣告活動的「搜尋字詞」列表。
    - **否定關鍵詞列表**: 整理一份必須立即添加的「否定關鍵詞」列表。
    - **否定商品目標列表**: 整理一份建議否定的「ASIN」列表。
4.  **機會洞察與下一步**:
    - **市場機會**: 從數據中是否能看到新的產品開發方向、藍海市場或消費者痛點？
    - **監控重點**: 在接下來的1-2週內，我應該重點監控哪些指標來驗證優化效果？（例如：特定廣告活動的ACoS變化、否定詞後的無效點擊量下降等）。
`;
        const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `AI_Analysis_Prompt_${currentFileName.replace(/\.xlsx?/,'')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // --- 啟動腳本 ---
    function addAnalysisButton() { const targetButton = document.querySelector('a[href*="Onboarding_Webpage"]'); if (!targetButton) return; const container = targetButton.parentElement; const newButton = document.createElement('button'); newButton.id = 'ad-analysis-tool-btn'; newButton.textContent = '廣告分析工具'; newButton.onclick = () => handleFileSelect(false); container.appendChild(newButton); }
    function tryInjectButton() { const targetButton = document.querySelector('a[href*="Onboarding_Webpage"]'); if (targetButton && !document.getElementById('ad-analysis-tool-btn')) { addAnalysisButton(); console.log('[廣告分析工具] 按鈕已成功注入！'); return true; } return false; }
    (function start() { if (tryInjectButton()) return; let observer; const intervalId = setInterval(() => { if (tryInjectButton()) { clearInterval(intervalId); if (observer) observer.disconnect(); } }, 500); observer = new MutationObserver(() => { if (tryInjectButton()) { clearInterval(intervalId); observer.disconnect(); } }); observer.observe(document.body, { childList: true, subtree: true }); setTimeout(() => { clearInterval(intervalId); observer.disconnect(); }, 20000); })();
})();