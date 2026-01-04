// ==UserScript==
// @name         Indeed ステータス CSV エクスポート
// @namespace    http://tampermonkey.net/
// @version      2025-07-24
// @description  Indeedの求人一覧をCSVにエクスポートする
// @author       You
// @match        https://employers.indeed.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/543562/Indeed%20%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%20CSV%20%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/543562/Indeed%20%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%20CSV%20%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'CSVダウンロード';
        button.style.position = 'fixed';
        button.style.top = '150px';
        button.style.right = '30px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#0073b1';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', startExport);
        document.body.appendChild(button);
    }

    let allData = [];
    const headers = ["会社名", "職種名", "勤務地", "ステータス", "投稿日", "応募者数", "キャンペーン", "表示回数", "推奨アクション数", "メッセージ"];

    async function startExport() {
        allData = [];
        allData.push(headers);

        await scrapeCurrentPage();

        while (await clickNextButton()) {
            await waitForPageLoad();
            await scrapeCurrentPage();
        }

        downloadCSV(allData);
    }

    function formatDate(jpDate) {
        if (!jpDate) return "";
        const months = {
            "1月": "01", "2月": "02", "3月": "03", "4月": "04", "5月": "05",
            "6月": "06", "7月": "07", "8月": "08", "9月": "09", "10月": "10",
            "11月": "11", "12月": "12"
        };
        const match = jpDate.match(/(\d{1,2}月) (\d{1,2}), (\d{4})/);
        if (match) {
            const mm = months[match[1]] || "00";
            const dd = match[2].padStart(2, "0");
            const yyyy = match[3];
            return `${yyyy}/${mm}/${dd}`;
        }
        return jpDate;
    }

    async function scrapeCurrentPage() {
        const rows = document.querySelectorAll('tr[data-testid="job-row"]');
        rows.forEach(row => {
            const company = row.querySelector('td.css-kbryu1 div.css-bo1iy7')?.textContent.trim() || "";
            const title = row.querySelector('td.css-kbryu1 a.css-rf7x53')?.textContent.trim() || "";
            const location = row.querySelector('td.css-1r79iz1')?.textContent.trim() || "";
            const status = row.querySelector('[data-testid="top-level-job-status"]')?.textContent.trim() || "";
            let dateRaw = row.querySelector('[data-testid="job-created-date"] span:last-child')?.textContent.trim() || "";
            const date = formatDate(dateRaw);
            let applicants = row.querySelector('a[href*="/candidates?id="]')?.textContent.trim() || "";
            applicants = applicants.replace(/[^\d]/g, "");
            let salary = row.querySelector('td.css-pdcv40')?.textContent.trim() || "";
            let impressions = row.querySelector('td.css-1tn4797')?.textContent.trim() || "";
            impressions = impressions.replace(/[^\d]/g, "");
            const actions = row.querySelector('div.css-yu5l5a span.css-reqzaf')?.textContent.replace("件の推奨アクション","").trim() || "";

            const messageNode = row.nextElementSibling?.querySelector('.css-11qm511.e37uo190');
            let message = "";
            if(messageNode){
                const heading = messageNode.querySelector('h2.css-1b2lj83')?.textContent.trim() || "";
                let details = "";
                for (const child of messageNode.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        details += child.textContent.trim();
                    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "H2" && child.tagName !== "BUTTON") {
                        details += child.textContent.trim();
                    }
                }
                message = (heading + " " + details).trim();
            }

            if (company || title) {
                allData.push([company, title, location, status, date, applicants, salary, impressions, actions, message]);
            }
        });
    }

    async function clickNextButton() {
        const nextBtn = document.querySelector('#ejsJobListPaginationNextBtn');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
            return true;
        }
        return false;
    }

    function waitForPageLoad() {
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                const nextBtn = document.querySelector('#ejsJobListPaginationNextBtn');
                if (nextBtn) {
                    observer.disconnect();
                    setTimeout(resolve, 500);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function downloadCSV(data) {
        const csvContent = data.map(row =>
            row.map(item => `"${(item || "").replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'indeed_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    window.addEventListener('load', addDownloadButton);
})();
