// ==UserScript==
// @name         自動刷新 goopi.co 頁面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動刷新頁面
// @author       你的名字
// @match        https://www.goopi.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481789/%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0%20goopico%20%E9%A0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/481789/%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0%20goopico%20%E9%A0%81%E9%9D%A2.meta.js
// ==/UserScript==

const targetTexts = ['goopi', '付款資料'];
let refreshDelay = 300;

function refreshPage() {
    // 檢查網頁上是否存在指定的文字
    let found = targetTexts.some(text => document.body.textContent.includes(text));

    if (found) {
        console.log(`找到匹配的文字`);
    } else {
        console.log(`未找到匹配的文字，重新刷新網頁`);
        setTimeout(function() {
            location.reload();
        }, refreshDelay);
    }
}

// 在刷新前增加延遲時間
setTimeout(refreshPage, refreshDelay);

