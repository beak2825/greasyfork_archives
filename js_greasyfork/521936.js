// ==UserScript==
// @name         技術士技能檢定試題下載（不適用按摩職類）
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  點擊PDF連結後，自動下載PDF檔案並命名為科目名 + 等級 + 學科/術科，特定網址和疑義處理公告保持原樣，並凍結標題列
// @author       您的名字
// @match        https://owinform.wdasec.gov.tw/ExamNet/owInform/PastQuestions.aspx?yserno=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wdasec.gov.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521936/%E6%8A%80%E8%A1%93%E5%A3%AB%E6%8A%80%E8%83%BD%E6%AA%A2%E5%AE%9A%E8%A9%A6%E9%A1%8C%E4%B8%8B%E8%BC%89%EF%BC%88%E4%B8%8D%E9%81%A9%E7%94%A8%E6%8C%89%E6%91%A9%E8%81%B7%E9%A1%9E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521936/%E6%8A%80%E8%A1%93%E5%A3%AB%E6%8A%80%E8%83%BD%E6%AA%A2%E5%AE%9A%E8%A9%A6%E9%A1%8C%E4%B8%8B%E8%BC%89%EF%BC%88%E4%B8%8D%E9%81%A9%E7%94%A8%E6%8C%89%E6%91%A9%E8%81%B7%E9%A1%9E%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 凍結表格標題列
    const table = document.querySelector('#gvFile');
    if (table) {
        const headerRow = table.querySelector('tr'); // 獲取表格的標題列
        if (headerRow) {
            headerRow.style.position = 'sticky';
            headerRow.style.top = '0';
            headerRow.style.backgroundColor = '#ffffff'; // 設定背景色，避免遮擋
            headerRow.style.zIndex = '1000'; // 確保浮動在上方
            headerRow.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.1)'; // 添加陰影以提升可視性
        }
    }

    // 儲存上一個科目名稱與等級名稱
    let lastSubjectName = "";
    let lastLevelName = "";

    // 獲取所有表格行
    const rows = document.querySelectorAll('tr');

    rows.forEach(row => {
        // 找到所有 align="center" 單元格
        const subjectCells = row.querySelectorAll('td[align="center"]');
        const subjectCell = subjectCells[1]; // 使用第二個 align="center" 單元格
        const levelCell = row.querySelector('td:nth-child(4)');

        // 檢查是否存在 <a> 標籤且前面出現 align="center"></td>
        const isLinkWithNoSubject = row.querySelector('a[href]') && (!subjectCell || subjectCell.textContent.trim() === "");

        // 提取科目名稱與等級名稱
        const subjectName = isLinkWithNoSubject ? lastSubjectName : (subjectCell ? subjectCell.textContent.trim() : lastSubjectName);
        const levelName = levelCell ? levelCell.textContent.trim() : lastLevelName;

        // 更新最後一個有效的科目名稱與等級名稱
        if (subjectCell && subjectCell.textContent.trim() !== "") lastSubjectName = subjectName;
        if (levelCell) lastLevelName = levelName;

        // 找到PDF下載連結
        const pdfLinks = row.querySelectorAll('a[href$=".pdf"], a[href*=".pdf?"]');

        pdfLinks.forEach((link, index) => {
            // 如果超連結文字包含"疑義處理公告"，保持原樣
            if (link.textContent.includes("疑義處理公告")) {
                console.log(`疑義處理公告連結保持原樣: ${link.href}`);
                return;
            }

            // 根據條件確定是否為術科
            const type = link.getAttribute('href').includes("-1") ? "學科" : "術科";

            // 替換按鈕內容
            const downloadButton = document.createElement('button');
            downloadButton.textContent = "下載";
            downloadButton.style.cursor = "pointer";

            // 替換原有圖片
            const parentCell = link.closest('td');
            if (parentCell) {
                parentCell.innerHTML = ""; // 清空原內容
                parentCell.appendChild(downloadButton);
            }

            // 為按鈕添加點擊事件
            downloadButton.addEventListener('click', function (event) {
                event.preventDefault(); // 防止預設行為

                const fileName = `${subjectName}${levelName}${type}.pdf`;

                // 獲取完整的PDF連結
                const relativeUrl = link.getAttribute('href');
                const fullUrl = relativeUrl.startsWith('http')
                    ? relativeUrl
                    : `${window.location.origin}${relativeUrl.replace('..', '')}`;

                // 創建隱藏的<a>元素用於下載
                const anchor = document.createElement('a');
                anchor.href = fullUrl;
                anchor.download = fileName; // 設定檔名
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);

                console.log(`已下載PDF: ${fullUrl}, 檔名: ${fileName}`);
            });
        });
    });
})();
