// ==UserScript==
// @name         GoToWebinar 統計工具
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  v4.2 - 智慧型來源標籤顯示、增強版CSV匯出、完美日期格式、UI修正。終極無腦體驗的完美形態！
// @author       Your Name & You
// @match        https://dashboard.gotowebinar.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gotowebinar.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      global.gotowebinar.com
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543855/GoToWebinar%20%E7%B5%B1%E8%A8%88%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/543855/GoToWebinar%20%E7%B5%B1%E8%A8%88%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedAuthToken = null;
    let allProcessedResults = [];

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(...args) {
        try {
            const headers = args[1]?.headers;
            if (headers && headers.Authorization && headers.Authorization.startsWith('Token ')) {
                capturedAuthToken = headers.Authorization.substring(6);
            }
        } catch (e) { /* silent fail */ }
        return originalFetch.apply(this, args);
    };

    window.addEventListener('DOMContentLoaded', (event) => {
        console.log("GTS 統計工具 v4.2 已啟動。");
        createFloatingButton();
        injectStyles();
    });

    function createFloatingButton() {
        if (document.getElementById('gts-floating-button')) return;
        const statsButton = document.createElement('div');
        statsButton.id = 'gts-floating-button';
        statsButton.innerHTML = '📊<span class="gts-button-text">一鍵全統計</span>';
        document.body.appendChild(statsButton);
        statsButton.addEventListener('click', startAnalysis);
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // 【v4.2 新增】日期格式化函數
    function formatDate(dateStr) {
        if (!dateStr) return { csvDate: '', uiDate: '' };
        try {
            const date = new Date(dateStr.replace(/,/g, ''));
            if (isNaN(date.getTime())) return { csvDate: dateStr, uiDate: dateStr }; // 無法解析則返回原字串

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dayOfWeek = dateStr.split(' ')[0].replace(',', '');

            return {
                csvDate: `${year}/${month}/${day}`,
                uiDate: `${year}/${month}/${day} ${dayOfWeek}`
            };
        } catch (e) {
            return { csvDate: dateStr, uiDate: dateStr }; // 出錯則返回原字串
        }
    }

    async function startAnalysis(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!capturedAuthToken) {
            alert('錯誤：無法自動獲取 Authorization Token！請嘗試重新整理頁面後再試一次。');
            return;
        }
        allProcessedResults = [];
        showModal(`<div style="display: flex; flex-direction: column; align-items: center;"><div class="gts-spinner"></div><p class="gts-status-text" id="gts-status-text">流程啟動，正在初始化...</p></div>`);

        try {
            updateStatus("檢查 'SEE MORE' 按鈕...");
            const seeMoreButton = document.querySelector('button#upcoming_events_see_all_button');
            if (seeMoreButton) {
                seeMoreButton.click();
                updateStatus("已點擊 'SEE MORE'，等待內容加載...");
                await sleep(2000);
            }
            updateStatus("正在掃描所有分頁以收集活動列表...");
            const allWebinarInfo = await scrapeAllWebinarInfo();
            if (allWebinarInfo.length === 0) {
                updateStatus("找不到任何活動！流程終止。");
                return;
            }
            updateStatus(`掃描完畢！共找到 ${allWebinarInfo.length} 個活動。`);
            const pageOneButton = Array.from(document.querySelectorAll('button.page-link')).find(p => p.textContent.trim() === '1');
            if (pageOneButton && !pageOneButton.closest('.active')) {
                 pageOneButton.click();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            await sleep(500);
            for (let i = 0; i < allWebinarInfo.length; i++) {
                const info = allWebinarInfo[i];
                updateStatus(`[${i+1}/${allWebinarInfo.length}] 正在處理：${info.title}`);
                const registrants = await fetchRegistrantsDirect(info.webinarKey, capturedAuthToken);
                const sourceCounts = countSources(registrants.map(reg => reg.source || ''));
                allProcessedResults.push({ ...info, registrants, sourceCounts });
            }
            updateStatus('所有資料處理完畢，正在生成報告...');
            displayResults(allProcessedResults);
        } catch (error) {
            console.error("GTS 統計工具：分析過程中發生錯誤", error);
            updateStatus(`發生嚴重錯誤: ${error.message}`);
        }
    }

    async function scrapeAllWebinarInfo() {
        const webinarInfoMap = new Map();
        const pageButtons = Array.from(document.querySelectorAll('button.page-link'));
        const numPages = pageButtons.length > 0 ? Math.max(...pageButtons.map(p => parseInt(p.textContent) || 1)) : 1;

        for (let i = 1; i <= numPages; i++) {
            updateStatus(`正在掃描第 ${i} / ${numPages} 頁...`);
            if (i > 1) {
                const pageButton = Array.from(document.querySelectorAll('button.page-link')).find(p => p.textContent.trim() == i);
                if (pageButton) { pageButton.click(); await sleep(1500); }
            }
            document.querySelectorAll('a[href^="webinar/"]').forEach(link => {
                const webinarKey = link.getAttribute('href').split('/')[1];
                if (!webinarKey || webinarInfoMap.has(webinarKey)) return;
                const title = link.querySelector('h3')?.textContent.trim() || '未命名活動';
                const rawDate = link.querySelector('span[id="event_cell_date"]')?.textContent.trim() || '';
                const { csvDate, uiDate } = formatDate(rawDate); // 【v4.2】使用日期格式化函數
                const time = link.querySelector('span[id="event_cell_time"]')?.textContent.trim() || '';
                webinarInfoMap.set(webinarKey, { webinarKey, title, date: csvDate, uiDate, time });
            });
        }
        return Array.from(webinarInfoMap.values());
    }

    function downloadCSV() {
        if (allProcessedResults.length === 0) { alert("沒有可匯出的資料。"); return; }
        const headers = ["Topic", "Date", "Time", "Name", "Email", "Source"];
        const rows = allProcessedResults.flatMap(result =>
            result.registrants.map(reg => {
                const topic = result.title.replace(/"/g, '""');
                const date = result.date; // 【v4.2】使用格式化後的日期
                const time = result.time;
                const name = `${reg.firstName || ''} ${reg.lastName || ''}`.trim().replace(/"/g, '""');
                const email = reg.email || '';
                const source = reg.source || '';
                return `"${topic}","${date}","${time}","${name}","${email}","${source}"`;
            })
        );
        const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `GoToWebinar_Full_Report_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function downloadAsImage() {
        const reportElement = document.querySelector('.gts-report-container');
        if (!reportElement) return;
        const originalBg = reportElement.style.backgroundColor;
        reportElement.style.backgroundColor = '#f9f9f9';
        html2canvas(reportElement, { useCORS: true, scale: 1.5 }).then(canvas => {
            reportElement.style.backgroundColor = originalBg;
            const link = document.createElement('a');
            link.download = `GoToWebinar_Report_${new Date().toISOString().slice(0,10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    function displayResults(results) {
        const modalBody = document.querySelector('.gts-modal-body');
        const modalHeader = document.querySelector('.gts-modal-header');
        if (!modalBody || !modalHeader) return;
        modalHeader.innerHTML = `<h2 class="gts-modal-title">報名來源統計結果</h2><div class="gts-export-buttons"><button id="gts-download-csv" class="gts-export-btn">下載 CSV</button><button id="gts-download-img" class="gts-export-btn">下載為圖片</button></div>`;
        document.getElementById('gts-download-csv').addEventListener('click', downloadCSV);
        document.getElementById('gts-download-img').addEventListener('click', downloadAsImage);

        const colorPalette = ["#f1e05a", "#3572A5", "#a34d2e", "#89e051", "#e34c26", "#438eff", "#563d7c", "#c6538c", "#00ADD8", "#F18E33", "#244776"];
        const getColor = (index) => colorPalette[index % colorPalette.length];

        const cardsHtml = results.map((result, cardIndex) => {
            if (result.error) return `<div class="gts-card"><p style="color:red;">處理 ${result.title} 時發生錯誤: ${result.error}</p></div>`;
            const sortedSources = Object.entries(result.sourceCounts).sort(([, a], [, b]) => b - a);
            const total = result.registrants.length;
            // 【v4.2 修正】將 progressBarHtml 直接放入模板中
            const progressBarHtml = total > 0 ? sortedSources.map(([source, count], index) => `<div class="gts-progress-segment" style="width: ${(count/total)*100}%; background-color: ${getColor(index)};" title="${source}: ${count}"></div>`).join('') : '';
            const legendHtml = sortedSources.map(([source, count], index) => `<li class="gts-legend-item"><span class="gts-legend-dot" style="background-color: ${getColor(index)};"></span>${source} ${count}</li>`).join('');
            const totalClass = total < 25 ? 'is-low' : '';
            return `<div class="gts-card" id="gts-card-${cardIndex}"><div class="gts-card-main"><div class="gts-card-info"><h3 class="gts-card-title">${result.title}</h3><p class="gts-card-meta">${result.uiDate} ${result.time}</p></div><div class="gts-card-total ${totalClass}">${total}</div></div><div class="gts-card-footer"><div class="gts-progress-bar">${progressBarHtml}</div><ul class="gts-legend">${legendHtml}</ul></div></div>`;
        }).join('');
        modalBody.innerHTML = `<div class="gts-report-container">${cardsHtml}</div>`;

        results.forEach((_, cardIndex) => {
            const card = document.getElementById(`gts-card-${cardIndex}`);
            if(!card) return;
            const progressBar = card.querySelector('.gts-progress-bar');
            const legend = card.querySelector('.gts-legend');
            const legendItems = Array.from(legend.querySelectorAll('.gts-legend-item'));
            const progressBarWidth = progressBar.offsetWidth;
            let currentWidth = 0;
            legend.innerHTML = '';
            for (const item of legendItems) {
                legend.appendChild(item);
                currentWidth = legend.offsetWidth;
                if (currentWidth > progressBarWidth) {
                    legend.removeChild(item);
                    const moreItem = document.createElement('li');
                    moreItem.className = 'gts-legend-item';
                    moreItem.textContent = '...';
                    legend.appendChild(moreItem);
                    break;
                }
            }
        });
    }

    // --- 其餘輔助函數保持不變 ---
    function fetchRegistrantsDirect(webinarKey, authToken) { const url = `https://global.gotowebinar.com/api/webinars/${webinarKey}/registrants?includePaymentInfo=false`; return new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "GET", url: url, headers: { "Authorization": `Token ${authToken}`, "Accept": "application/json" }, onload: function(response) { if (response.status >= 200 && response.status < 300) { resolve(JSON.parse(response.responseText)); } else { reject(new Error(`API請求失敗，狀態碼: ${response.status}`)); } }, onerror: function(error) { reject(new Error(`網路請求錯誤`)); } }); }); }
    function countSources(registrants) { return registrants.reduce((acc, reg) => { const sourceKey = reg || '(空白)'; acc[sourceKey] = (acc[sourceKey] || 0) + 1; return acc; }, {}); }
    function showModal(content) { let overlay = document.querySelector('.gts-modal-overlay'); if (!overlay) { overlay = document.createElement('div'); overlay.className = 'gts-modal-overlay'; document.body.appendChild(overlay); } overlay.innerHTML = ` <div class="gts-modal-content"> <div class="gts-modal-header"> <h2 class="gts-modal-title">報名來源統計結果</h2> <button class="gts-modal-close">×</button> </div> <div class="gts-modal-body">${content}</div> </div> `; overlay.querySelector('.gts-modal-close').addEventListener('click', () => {overlay.remove(); allProcessedResults = [];}); overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.remove(); allProcessedResults = []; } }); }
    function updateStatus(text) { const statusText = document.getElementById('gts-status-text'); if (statusText) { statusText.textContent = text; } }
    function injectStyles() { GM_addStyle(` #gts-floating-button { position: fixed; bottom: 25px; right: 30px; background-color: #007bff; color: white; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer; z-index: 9998; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease-in-out; font-size: 24px; height: 56px; width: 56px; overflow: hidden; } #gts-floating-button:hover { width: 180px; background-color: #0056b3; } #gts-floating-button .gts-button-text { font-size: 16px; font-weight: bold; white-space: nowrap; margin-left: 8px; opacity: 0; transition: opacity 0.1s ease-in-out; } #gts-floating-button:hover .gts-button-text { opacity: 1; transition-delay: 0.1s; } .gts-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;} .gts-modal-content { display: flex; flex-direction: column; background: #fff; border-radius: 8px; padding: 0; width: 95%; max-width: 900px; height: 95%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; } .gts-modal-header { flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 15px 25px; } .gts-modal-title { font-size: 20px; color: #333; font-weight: 600; } .gts-modal-body { flex-grow: 1; overflow-y: auto; background-color: #f9f9f9; } .gts-report-container { padding: 20px 25px; } .gts-modal-close { font-size: 28px; font-weight: bold; color: #aaa; cursor: pointer; border: none; background: none; } .gts-spinner { border: 8px solid #f3f3f3; border-radius: 50%; border-top: 8px solid #3498db; width: 60px; height: 60px; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .gts-status-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; } .gts-export-buttons { display: flex; gap: 10px; } .gts-export-btn { background-color: #2da44e; color: white; border: none; border-radius: 6px; padding: 5px 12px; font-size: 14px; cursor: pointer; transition: background-color 0.2s; } .gts-export-btn:hover { background-color: #2c974b; } #gts-download-img { background-color: #8250df; } #gts-download-img:hover { background-color: #7645cf; } .gts-card { background-color: white; border: 1px solid #d0d7de; border-radius: 6px; margin-bottom: 16px; padding: 16px; } .gts-card-main { display: flex; justify-content: space-between; align-items: flex-start; } .gts-card-info { flex-grow: 1; padding-right: 16px; } .gts-card-title { font-size: 18px; font-weight: 600; margin: 0 0 4px 0; color: #0969da; } .gts-card-meta { font-size: 12px; color: #57606a; margin: 0; } .gts-card-total { font-size: 48px; font-weight: bold; color: #1f2328; margin-left: 20px; line-height: 1; } .gts-card-total.is-low { color: #d73a49; } .gts-card-footer { margin-top: 16px; } .gts-progress-bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 8px; background-color: #e1e4e8; } .gts-progress-segment { height: 100%; } .gts-legend { display: flex; list-style: none; padding: 0; margin: 0; flex-wrap: nowrap; gap: 12px; font-size: 12px; color: #57606a; white-space: nowrap; overflow: hidden; } .gts-legend-item { display: flex; align-items: center; flex-shrink: 0; } .gts-legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; flex-shrink: 0; } `); }
})();