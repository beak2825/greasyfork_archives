// ==UserScript==
// @name         ISBN步驟1:填寫申請資料(紙本書)
// @namespace    http://tampermonkey.net/
// @version      1.6.4
// @description  自動填入 ISBN 申請人表單欄位並送出
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J61_MyAppISBN.php?&Pact=Step1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521955/ISBN%E6%AD%A5%E9%A9%9F1%3A%E5%A1%AB%E5%AF%AB%E7%94%B3%E8%AB%8B%E8%B3%87%E6%96%99%28%E7%B4%99%E6%9C%AC%E6%9B%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521955/ISBN%E6%AD%A5%E9%A9%9F1%3A%E5%A1%AB%E5%AF%AB%E7%94%B3%E8%AB%8B%E8%B3%87%E6%96%99%28%E7%B4%99%E6%9C%AC%E6%9B%B8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fillAndSubmitForm() {
        // 檢查是否存在含有"選擇新增模式"的 legend 元素
        const legendElement = document.querySelector("legend.min_width-120");
        if (legendElement && legendElement.textContent.includes("選擇新增模式")) {
            console.log("頁面包含'選擇新增模式'，腳本不執行");
            return;
        }

        // 確認所有欄位是否已存在
        const applicantInput = document.getElementById("FO_Applicant");
        const emailInput = document.getElementById("FO_Applicant_EMail");
        const phoneInput = document.getElementById("FO_Applicant_PhoneNo");
        const extensionInput = document.getElementById("FO_Applicant_PhoneNoExtension");
        const submitButton = document.querySelector("a.btn_primary");

        if (applicantInput && emailInput && phoneInput && extensionInput && submitButton) {
            // 填寫表單欄位
            applicantInput.value = "廖信凱";
            emailInput.value = "yokan@chienhua.com.tw";
            phoneInput.value = "0222289070";
            extensionInput.value = "240";

            console.log("表單欄位已填寫完成");

            // 點擊提交按鈕
            setTimeout(() => {
                submitButton.click();
                console.log("表單已自動提交");
            }, 1000); // 延遲1秒以確保所有欄位填寫完成

            // 停止監控
            observer.disconnect();
        }
    }

    function selectAndConfirm() {
        // 檢查是否存在含有"選擇新增模式"的 legend 元素
        const legendElement = document.querySelector("legend.min_width-120");
        if (legendElement && legendElement.textContent.includes("選擇新增模式")) {
            console.log("頁面包含'選擇新增模式'，腳本不執行");
            return;
        }

        // Select the "紙本書" checkbox
        const checkbox = document.querySelector("input[type='checkbox'][value='1']");
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }

        console.log("選項已選擇完成");
    }

    // Run the functions after a short delay to ensure elements are loaded
    setTimeout(() => {
        selectAndConfirm();
        setTimeout(fillAndSubmitForm, 500); // 確保選項選擇完成後再填寫表單
    }, 500);
})();
