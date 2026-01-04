// ==UserScript==
// @name         驗證碼提交處理
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提交驗證碼並處理響應
// @author       Scott
// @match        https://tixcraft.com/ticket/ticket/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513758/%E9%A9%97%E8%AD%89%E7%A2%BC%E6%8F%90%E4%BA%A4%E8%99%95%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/513758/%E9%A9%97%E8%AD%89%E7%A2%BC%E6%8F%90%E4%BA%A4%E8%99%95%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('form-ticket-ticket').addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表單提交

        // 使用 AJAX 提交表單
        const formData = new FormData(this);
        fetch(this.action, {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('網絡響應不正常，狀態碼: ' + response.status);
            }
            return response.text(); // 獲取 HTML 響應
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            // 檢查是否有驗證錯誤的消息
            const errorMessage = doc.querySelector('script');
            if (errorMessage && errorMessage.innerHTML.includes("您所輸入的驗證碼不正確")) {
                console.log("發現驗證碼錯誤，隱藏彈窗");
                // 隱藏彈窗的邏輯
                const modal = document.querySelector('.modal-selector'); // 替換為你的彈窗選擇器
                if (modal) {
                    modal.style.display = 'none';
                }
                return; // 終止函數，表示這是錯誤的情況
            }

            // 如果沒有錯誤，處理正確的響應
            console.log("收到正確的響應:", data);
            
            // 更新當前頁面內容
            document.body.innerHTML = doc.body.innerHTML; // 用返回的 HTML 更新當前頁面內容
        })
        .catch(error => console.error('提交失敗:', error));
    });
})();
