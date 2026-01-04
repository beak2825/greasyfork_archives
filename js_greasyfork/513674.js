// ==UserScript==
// @name         Auto Fill Captcha Example
// @namespace    http://tampermonkey.net/
// @version      1.191
// @description  自动填充验证码的示例代码
// @match        *://tixcraft.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/tesseract.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513674/Auto%20Fill%20Captcha%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/513674/Auto%20Fill%20Captcha%20Example.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 等待頁面加載完成
    await new Promise(resolve => window.addEventListener('load', resolve));

    // 自動點擊驗證碼圖片以刷新驗證碼
    const captchaImg = document.getElementById("TicketForm_verifyCode-image");
    if (captchaImg) {
        // 模擬點擊驗證碼圖片
        captchaImg.click();
        console.log("驗證碼圖片已被點擊以刷新。");
    } else {
        console.warn("找不到驗證碼圖片");
    }

    // 選擇票數
    const ticketSelect = document.querySelector('select[id^="TicketForm_ticketPrice_"]');
    if (ticketSelect) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        ticketSelect.value = '2'; // 選擇2張票
        console.log("已選票數: 2");
    } else {
        console.warn("找不到票數選擇元素");
    }

    // 勾選服務條款
    const termsCheckbox = document.querySelector('input[id="TicketForm_agree"]');
    if (termsCheckbox) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        termsCheckbox.checked = true; // 勾選
        console.log("已勾選服務條款");
    } else {
        console.warn("找不到服務條款勾選框");
    }

    // 識別驗證碼並存儲結果（成功後自動刷新頁面）
    if (captchaImg) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = captchaImg.src;

        img.onload = async function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // 將驗證碼圖像轉換為 Base64 格式
            const base64Value = canvas.toDataURL('image/png');

            try {
                // 發送請求到本地 OCR 識別服務
                const response = await fetch("http://localhost:8000/recognize/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ url: base64Value })
                });

                if (!response.ok) {
                    throw new Error("請求失敗，狀態碼: " + response.status);
                }

                const result = await response.json();
                console.log("識別的驗證碼: ", result.result.trim());

                // 將識別結果與圖片 Base64 一起記錄在 LocalStorage
                const captchaData = {
                    image: base64Value, // Captcha 圖片的 Base64
                    result: result.result.trim(), // OCR 識別結果
                    timestamp: new Date().toISOString() // 記錄時間
                };

                const storedData = JSON.parse(localStorage.getItem("captchaData")) || [];
                storedData.push(captchaData);
                localStorage.setItem("captchaData", JSON.stringify(storedData));

                console.log("已存儲驗證碼數據", captchaData);

                // 刷新頁面以繼續獲取新的驗證碼
                console.log("刷新頁面以繼續訓練...");
                setTimeout(() => location.reload(), 2000); // 2秒後刷新頁面
            } catch (error) {
                console.error('OCR 請求識別失敗', error);
                console.log("驗證碼識別失敗，正在刷新頁面...");
                location.reload(); // F5 刷新頁面
            }
        };
    } else {
        console.warn("找不到驗證碼圖片");
    }

})();
