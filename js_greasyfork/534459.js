// ==UserScript==
// @name         自動註冊 Udemy 免費課程
// @namespace    http://tampermonkey.net/
// @version      0.12.2
// @description  在特定網站自動執行
// @license      GPL-3.0
// @match        https://www.udemy.com/*
// @grant        none
// @author       twozwu
// @downloadURL https://update.greasyfork.org/scripts/534459/%E8%87%AA%E5%8B%95%E8%A8%BB%E5%86%8A%20Udemy%20%E5%85%8D%E8%B2%BB%E8%AA%B2%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534459/%E8%87%AA%E5%8B%95%E8%A8%BB%E5%86%8A%20Udemy%20%E5%85%8D%E8%B2%BB%E8%AA%B2%E7%A8%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("腳本自動執行中！");

    const observer = new MutationObserver(() => {
        const bodyText = document.body.innerText;
        if (bodyText.includes("立即註冊")) {
            console.log("✅ 偵測到免費");

            const btn = document.querySelector('[data-purpose="buy-now-button"]');
            const btn2 = document.querySelector('.ud-btn-large .ud-btn-label');

            if (btn && btn.innerText.includes("立即註冊") || btn2.innerText.includes("立即註冊")) {
                console.log("✅ 找到按鈕，可點擊");
                document.querySelectorAll('button').forEach(btn => btn.disabled = false);
                //setTimeout((() => btn.click()), 2500);
                if(btn) btn.click();
                if(btn2) btn2.click();
                observer.disconnect(); // 停止監聽
            }
        } else {
            let btn = document.querySelector('[data-purpose="buy-now-button"]');
            if (['立即購買', '前往課程'].includes(btn.innerText)) {
                window.close();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();