// ==UserScript==
// @name         BanScore
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Подсчет блокировок и количества баллов
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475379/BanScore.user.js
// @updateURL https://update.greasyfork.org/scripts/475379/BanScore.meta.js
// ==/UserScript==

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function calculateTotalWarningPoints() {
    let rows = document.querySelectorAll('.dataTable tbody .dataRow'), totalWarningPoints = 0;

    rows.forEach(row => {
        let warningPoints = parseInt(row.querySelector('.warningPoints')?.textContent || 0, 10);
        if (!isNaN(warningPoints)) totalWarningPoints += warningPoints;
    });

    console.log(`Общее количество warningPoints: ${totalWarningPoints}`);
    return totalWarningPoints;
}

function calculateTotalBlocks() {
    let logFields = document.querySelectorAll('.dataTable.userChangeLogs td.logField'), totalBlocks = 0;

    logFields.forEach(logField => {
        if (logField.textContent.trim() === 'Заблокирован(а)' && logField.parentNode.lastElementChild.textContent.trim() === 'Да') {
            totalBlocks++;
        }
    });

    console.log(`Общее количество блокировок: ${totalBlocks}`);
    return totalBlocks;
}

function observerWarningPointsCallback(mutations, observer) {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            const rows = document.querySelectorAll('.dataTable tbody .dataRow');
            if (rows.length > 0) {
                const warningList = document.querySelector('.warningList');
                if (warningList && warningList.children.length > 0) {
                    let totalWarningPoints = calculateTotalWarningPoints();
                    let firstRow = rows[0];
                    let expiryHeader = firstRow.querySelector('.warningExpiry');
                    if (expiryHeader && !firstRow.querySelector('.warningTotal')) {
                        let totalHeader = document.createElement('th');
                        totalHeader.className = 'warningTotal';
                        totalHeader.setAttribute('width', '30%');
                        totalHeader.textContent = `Общее количество баллов (${totalWarningPoints})`;
                        expiryHeader.parentNode.insertBefore(totalHeader, expiryHeader.nextSibling);
                    }
                    observer.disconnect();
                }
            }
        }
    });
}

function observerBlocksCallback(mutations, observer) {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            if (document.querySelector('.dataTable.userChangeLogs') && document.querySelectorAll('.dataTable.userChangeLogs td.logField').length > 0) {
                let totalBlocks = calculateTotalBlocks();
                let banLogsSection = document.querySelector('.banLogs.section');
                let dataRow = banLogsSection?.querySelector('.dataRow');
                let totalBanHeader = dataRow?.querySelector('.totalBans');
                let banHeader = dataRow?.querySelector('#change-logs > div > div > table > tbody > tr:nth-child(1) > th:nth-child(3)');
                if (!totalBanHeader && banHeader && totalBlocks) {
                    totalBanHeader = document.createElement('th');
                    totalBanHeader.className = 'totalBans';
                    totalBanHeader.setAttribute('width', '30%');
                    totalBanHeader.textContent = `Общее количество банов (${totalBlocks})`;

                    Array.from(document.querySelectorAll('tr.dataRow.secondaryContent>td')).forEach((cell) => {
                        cell.setAttribute('colspan', '4');
                    });

                    banHeader.parentNode.insertBefore(totalBanHeader, banHeader.nextSibling);
                } else if (totalBlocks) {
                     totalBanHeader.textContent = `Общее количество банов (${totalBlocks})`;
                }
                observer.disconnect();
            }
        }
    });
}

let config = { childList: true, subtree: true };
let observerWarningPoints = new MutationObserver(debounce(observerWarningPointsCallback, 10));
let observerBlocks = new MutationObserver(debounce(observerBlocksCallback, 10));


observerWarningPoints.observe(document.body, config);
observerBlocks.observe(document.body, config);