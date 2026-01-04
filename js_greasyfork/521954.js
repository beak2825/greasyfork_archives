// ==UserScript==
// @name         ISBN申請時自動勾選紙本書並進入下一頁
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically selects "紙本書" and clicks "確定"
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J61_MyAppISBN.php?&Pact=PageSelectType
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521954/ISBN%E7%94%B3%E8%AB%8B%E6%99%82%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8%E7%B4%99%E6%9C%AC%E6%9B%B8%E4%B8%A6%E9%80%B2%E5%85%A5%E4%B8%8B%E4%B8%80%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/521954/ISBN%E7%94%B3%E8%AB%8B%E6%99%82%E8%87%AA%E5%8B%95%E5%8B%BE%E9%81%B8%E7%B4%99%E6%9C%AC%E6%9B%B8%E4%B8%A6%E9%80%B2%E5%85%A5%E4%B8%8B%E4%B8%80%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectAndConfirm() {
        // Select the "紙本書" checkbox
        const checkbox = document.querySelector("input[type='checkbox'][value='1']");
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }

        // Click the "確定" button
        const confirmButton = document.querySelector("a.btn_primary");
        if (confirmButton) {
            confirmButton.click();
        }
    }

    // Run the function after a short delay to ensure elements are loaded
    setTimeout(selectAndConfirm, 500);
})();
