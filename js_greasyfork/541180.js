// ==UserScript==
// @name         FC2PPVDB MISSAV 檢查器
// @name:en      FC2PPVDB MISSAV Checker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動在 FC2PPVDB 文章頁面顯示 missav123.com 上的搜尋結果。
// @description:en Automatically displays search results from missav123.com on FC2PPVDB article pages.
// @author       Your Name
// @match        https://fc2ppvdb.com/articles/*
// @match        https://www.fc2ppvdb.com/articles/*
// @grant        GM_xmlhttpRequest
// @connect      missav123.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541180/FC2PPVDB%20MISSAV%20%E6%AA%A2%E6%9F%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541180/FC2PPVDB%20MISSAV%20%E6%AA%A2%E6%9F%A5%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 獲取當前網頁的 URL
    const currentUrl = window.location.href;
    // 使用正則表達式提取文章 ID，這樣無論有無 www 都能匹配
    const match = currentUrl.match(/articles\/(\d+)/);

    // 確保我們在正確的文章頁面
    if (match && match[1]) {
        const articleId = match[1];
        const missavSearchUrl = `https://missav123.com/search/${articleId}`;

        // 創建一個顯示結果的元素，並將其添加到頁面中
        const resultDisplay = document.createElement('div');
        resultDisplay.id = 'missav-checker-result'; // 給它一個 ID 以便樣式化和識別
        resultDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #007bff; /* 藍色背景，表示正在處理 */
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-size: 16px;
            font-weight: bold;
            z-index: 99999; /* 確保在最上層 */
            max-width: 300px;
            text-align: center;
            opacity: 0.9;
            transition: all 0.3s ease-in-out;
        `;
        resultDisplay.textContent = `正在檢查 MISSAV 關於 ${articleId} 的結果...`;
        document.body.appendChild(resultDisplay);

        // 使用 GM_xmlhttpRequest 發送跨域請求
        // 這是 Greasemonkey/Tampermonkey 推薦的方式，用來繞過 CORS 限制
        GM_xmlhttpRequest({
            method: "GET",
            url: missavSearchUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://missav123.com/"
            },
            onload: function (response) {
                // 請求成功，處理響應內容
                const html = response.responseText;
                let resultMessage = '';

                // 判斷 MISSAV 頁面是否有結果的邏輯
                const noResultsText = 'No results found.'; // 假設無結果時頁面中會包含這段文字
                const hasResultsIndicator = `fc2-ppv-${articleId}`; // 檢查是否包含 "fc2-ppv-ID" 的字串

                if (html.includes(hasResultsIndicator)) {
                    resultMessage = `MISSAV 上可能找到 ID 為 ${articleId} 的結果！ ${missavSearchUrl}`;
                } else if (html.includes(noResultsText)) {
                    resultMessage = `MISSAV 上沒有找到 ID 為 ${articleId} 的結果。`;
                } else {
                    // 如果兩者都沒找到，可能是頁面結構未知或載入不完整
                    resultMessage = `MISSAV 頁面結構未知，無法精確判斷結果。請手動檢查： ${missavSearchUrl}`;
                }

                updateResultDisplay(resultMessage);
            },
            onerror: function (error) {
                // 請求失敗，處理錯誤
                console.error('檢查 MISSAV 頁面時發生錯誤:', error);
                const errorMessage = error.statusText || '請求失敗，請檢查網路或腳本設置。';
                updateResultDisplay(`檢查 MISSAV 失敗：${errorMessage}`);
            }
        });

        // 更新顯示結果的函數
        function updateResultDisplay(message) {
            let bgColor = '#28a745'; // 預設綠色 (成功)

            if (message.includes('沒有找到')) {
                bgColor = '#dc3545'; // 紅色 (無結果)
            } else if (message.includes('可能找到')) {
                bgColor = '#ffc107'; // 黃色 (可能找到)
                const link = message.match(/(https:\/\/missav123\.com\/search\/\d+)/);
                if (link && link[1]) {
                    const url = link[1];
                    // 將訊息替換為更簡潔的、包含連結的內容
                    message = `在 MISSAV 上可能找到結果！ <a href="${url}" target="_blank" style="color: black; font-weight: bold; text-decoration: underline;">點此查看</a>`;
                }
            } else if (message.includes('失敗') || message.includes('未知')) {
                 bgColor = '#6c757d'; // 灰色 (未知或錯誤)
                 const link = message.match(/(https:\/\/missav123\.com\/search\/\d+)/);
                 if (link && link[1]) {
                     const url = link[1];
                     message = message.replace(url, `<a href="${url}" target="_blank" style="color: white; text-decoration: underline;">手動檢查</a>`);
                 }
            }


            resultDisplay.style.backgroundColor = bgColor;
            resultDisplay.innerHTML = message;
            resultDisplay.style.opacity = '1';

            // 點擊後立即淡出
            resultDisplay.addEventListener('click', () => {
                resultDisplay.style.opacity = '0';
                setTimeout(() => resultDisplay.remove(), 300);
            });

            // 15 秒後自動淡出
            setTimeout(() => {
                resultDisplay.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(resultDisplay)) {
                        resultDisplay.remove();
                    }
                }, 300); // 在淡出動畫後移除元素
            }, 15000); // 顯示 15 秒
        }
    }
})();
