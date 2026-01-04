// ==UserScript==
// @name         考選部試題下載器
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  按下「下載全部」按鈕，同時高亮顯示符合條件的連結並下載。
// @author
// @match        https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx
// @match        https://wwwq.moex.gov.tw/exam/wFrmExamQandASearch.aspx?*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521937/%E8%80%83%E9%81%B8%E9%83%A8%E8%A9%A6%E9%A1%8C%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521937/%E8%80%83%E9%81%B8%E9%83%A8%E8%A9%A6%E9%A1%8C%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addDownloadButtons() {
        document.querySelectorAll("label[for^='ctl00_holderContent_chk_']").forEach(function (examCategoryLabel) {
            console.log('找到考試類科標籤: ', examCategoryLabel.innerText);
            const parentRow = examCategoryLabel.closest('tr');
            if (parentRow && !parentRow.querySelector('.exam-title')) {
                const parentCell = examCategoryLabel.parentElement;
                if (parentCell && !parentCell.querySelector('.download-button')) {
                    // 下載全部按鈕（已合併測試的功能）
                    const downloadButton = document.createElement('button');
                    downloadButton.innerText = '下載全部';
                    downloadButton.classList.add('download-button');
                    downloadButton.style.marginLeft = '10px';
                    downloadButton.addEventListener('click', function (event) {
                        event.preventDefault();
                        console.log('「下載全部」按鈕被點擊');
                        // 1. 清除舊有標記
                        clearHighlight();
                        // 2. 取得目標 &c 值
                        const targetCValue = getTargetCValue(parentRow);
                        if (!targetCValue) {
                            console.log('無法取得目標 &c 值，無法下載與高亮');
                            return;
                        }
                        // 3. 高亮顯示符合該 &c 值的連結
                        highlightAllLinksForCValue(targetCValue);
                        // 4. 下載符合該 &c 值的連結
                        downloadAllLinksForCValue(targetCValue);
                    });
                    parentCell.appendChild(downloadButton);
                }
            }
        });
    }

    // 清除所有高亮顯示
    function clearHighlight() {
        document.querySelectorAll('a[href*="wHandExamQandA_File.ashx"]').forEach(function (link) {
            link.style.backgroundColor = '';
        });
    }

    // 從 href 中取得 &c 參數值的輔助函式
    function getCValueFromHref(href) {
        const urlParams = new URLSearchParams(href.split('?')[1]);
        return urlParams.get('c');
    }

    // 取得目標 &c 值：以 startRow 之後最近的符合條件連結為準
    function getTargetCValue(startRow) {
        const allLinks = Array.from(document.querySelectorAll('a[href*="wHandExamQandA_File.ashx"]:not([href*="t=A"]):not([href*="t=B"])'));
        const allRows = Array.from(document.querySelectorAll('tr'));
        const startRowIndex = allRows.indexOf(startRow);

        for (let link of allLinks) {
            const linkRow = link.closest('tr');
            if (linkRow) {
                const linkRowIndex = allRows.indexOf(linkRow);
                if (linkRowIndex > startRowIndex) {
                    const targetCValue = getCValueFromHref(link.href);
                    console.log('目標 &c= 值為:', targetCValue);
                    return targetCValue;
                }
            }
        }
        return null;
    }

    // 高亮顯示符合指定 &c 值的所有連結
    function highlightAllLinksForCValue(targetCValue) {
        const allLinks = Array.from(document.querySelectorAll('a[href*="wHandExamQandA_File.ashx"]:not([href*="t=A"]):not([href*="t=B"])'));
        allLinks.forEach(function (link) {
            const cValue = getCValueFromHref(link.href);
            if (cValue === targetCValue) {
                link.style.backgroundColor = 'yellow';
                console.log('高亮顯示連結: ', link.href);
            }
        });
    }

    // 下載符合指定 &c 值的所有連結
    function downloadAllLinksForCValue(targetCValue) {
        const allLinks = Array.from(document.querySelectorAll('a[href*="wHandExamQandA_File.ashx"]:not([href*="t=A"]):not([href*="t=B"])'));
        const matchedLinks = allLinks.filter(link => getCValueFromHref(link.href) === targetCValue);

        if (matchedLinks.length === 0) {
            console.log('未找到符合 &c=' + targetCValue + ' 的連結，無法下載');
            return;
        } else {
            console.log('共找到符合 &c=' + targetCValue + ' 的連結數: ', matchedLinks.length);
        }

        // 去重並下載
        const uniqueLinks = [];
        const hrefSet = new Set();
        matchedLinks.forEach(function (link) {
            if (!hrefSet.has(link.href)) {
                hrefSet.add(link.href);
                uniqueLinks.push(link);
            }
        });

        uniqueLinks.forEach(function (link, index) {
            setTimeout(() => {
                const fileName = generateFileName(link);
                console.log('開始下載檔案: ', fileName, link.href);
                downloadUsingBlob(link.href, fileName);
            }, index * 1000); // 延遲下載以減少被瀏覽器阻擋的機會
        });
    }

    // 根據連結生成文件名
    function generateFileName(link) {
        const linkText = link.innerText.trim();
        const subjectLabelElement = link.closest('tr') ? link.closest('tr').querySelector('label.exam-title') : null;
        const subjectLabel = subjectLabelElement ? subjectLabelElement.innerText.trim() : '未知科目';
        let fileName = `${subjectLabel}_${linkText}`;
        return fileName.replace(/[\/:*?"<>|]/g, ''); // 移除不適合檔名的符號
    }

    // 使用 Blob 下載功能進行下載
    function downloadUsingBlob(url, fileName) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = fileName + '.pdf';
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(objectUrl);
                document.body.removeChild(a);
            })
            .catch(error => console.error('下載失敗: ', error));
    }

    // 在 document-end 時執行加入按鈕的動作
    addDownloadButtons();

})();
