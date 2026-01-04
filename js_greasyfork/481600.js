// ==UserScript==
// @name         網頁解密插件
// @namespace    https://bing.com
// @version      1.0
// @description  在網頁中尋照可以填入的方框，輸入數字（依序從000～999），並按下顯示「立即解密」的按鈕，如果過一秒後網頁中尋找得到「❌ 密碼錯誤」就換下一個數字，否則就停下
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481600/%E7%B6%B2%E9%A0%81%E8%A7%A3%E5%AF%86%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481600/%E7%B6%B2%E9%A0%81%E8%A7%A3%E5%AF%86%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義一個函數，用於將數字轉換為三位數的字符串，如001，010，099等
    function pad(num) {
        return num.toString().padStart(3, '0');
    }

    // 定義一個變數，用於儲存當前嘗試的數字，初始值為0
    let current = 0;

    // 定義一個函數，用於嘗試解密網頁
    function tryDecrypt() {
        // 尋找網頁中的輸入框，如果沒有找到，則結束函數
        let input = document.querySelector('input[type="text"]');
        if (!input) return;

        // 尋找網頁中的按鈕，如果沒有找到，則結束函數
        let button = document.querySelector('button:contains("立即解密")');
        if (!button) return;

        // 將當前數字轉換為字符串，並填入輸入框
        let code = pad(current);
        input.value = code;

        // 按下按鈕
        button.click();

        // 等待一秒後，檢查網頁中是否有「❌ 密碼錯誤」的提示，如果有，則將當前數字加一，並繼續嘗試，如果沒有，則停止嘗試
        setTimeout(function() {
            let error = document.querySelector('p:contains("❌ 密碼錯誤")');
            if (error) {
                current++;
                tryDecrypt();
            } else {
                alert('解密成功，密碼是' + code);
            }
        }, 1000);
    }

    // 執行嘗試解密的函數
    tryDecrypt();
})();
