// ==UserScript==
// @name         賣貨便-"交易規範及慎防詐騙提醒"彈跳視窗之自動點擊
// @namespace    http://tampermonkey.net/
// @version      2025-02-24
// @description  自動點"我知道了"
// @author       紫弦
// @match        https://myship.7-11.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=7-11.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528004/%E8%B3%A3%E8%B2%A8%E4%BE%BF-%22%E4%BA%A4%E6%98%93%E8%A6%8F%E7%AF%84%E5%8F%8A%E6%85%8E%E9%98%B2%E8%A9%90%E9%A8%99%E6%8F%90%E9%86%92%22%E5%BD%88%E8%B7%B3%E8%A6%96%E7%AA%97%E4%B9%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/528004/%E8%B3%A3%E8%B2%A8%E4%BE%BF-%22%E4%BA%A4%E6%98%93%E8%A6%8F%E7%AF%84%E5%8F%8A%E6%85%8E%E9%98%B2%E8%A9%90%E9%A8%99%E6%8F%90%E9%86%92%22%E5%BD%88%E8%B7%B3%E8%A6%96%E7%AA%97%E4%B9%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickConfirmButton() {
        let modal = document.getElementById('BulletinModal_4');
        if (!modal) return;

        let confirmButton = modal.querySelector('button, .btn, .confirm');
        if (confirmButton) {
            confirmButton.click();
            console.log('已自動點擊「我知道了」');
        }
    }

    // **使用 setInterval 每 1ms 檢查一次，確保更快點擊**
    let interval = setInterval(() => {
        if (document.getElementById('BulletinModal_4')) {
            clickConfirmButton();
        }
    }, 1); // 每 1ms 檢查一次，比 MutationObserver 觸發更快

    // **使用 MutationObserver 監聽 BulletinModal_4 是否加入 DOM**
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                let modal = document.getElementById('BulletinModal_4');
                if (modal) {
                    clickConfirmButton();
                }
            }
        }
    });

    // **只監聽 body 內部的子元素變化**
    observer.observe(document.body, { childList: true, subtree: false });

})();