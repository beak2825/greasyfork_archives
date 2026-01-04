// ==UserScript==
// @name         自動選擇書名欄位
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  當在特定頁面時自動選擇「申請書名」欄位
// @author       User
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J62_MyApplication.php?&Pact=DisplayAll
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J62_MyApplication.php?&Pact=DisplayAll*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522250/%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E6%9B%B8%E5%90%8D%E6%AC%84%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/522250/%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87%E6%9B%B8%E5%90%8D%E6%AC%84%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待 DOM 完全加載後的一小段時間，確保所有元素已載入
    setTimeout(function() {
        // 使用名稱或 ID 定位「申請書名」欄位
        const bookTitleField = document.querySelector("select[name='FO_查詢欄位']");

        if (bookTitleField) {
            // 確認選擇「申請書名」選項
            bookTitleField.value = 'Title';
            // 觸發 change 事件以確保更改生效
            bookTitleField.dispatchEvent(new Event('change'));
            // 焦點移至該欄位
            bookTitleField.focus();
        }
    }, 500); // 延遲 500 毫秒
})();
