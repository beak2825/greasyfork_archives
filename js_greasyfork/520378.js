// ==UserScript==
// @name         拓元 step3 自動同意並選擇表單 新寫法
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  攔截特定 CAPTCHA 圖片請求
// @author       你
// @license      MIT
// @include      https://tixcraft.com/ticket/ticket/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520378/%E6%8B%93%E5%85%83%20step3%20%E8%87%AA%E5%8B%95%E5%90%8C%E6%84%8F%E4%B8%A6%E9%81%B8%E6%93%87%E8%A1%A8%E5%96%AE%20%E6%96%B0%E5%AF%AB%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520378/%E6%8B%93%E5%85%83%20step3%20%E8%87%AA%E5%8B%95%E5%90%8C%E6%84%8F%E4%B8%A6%E9%81%B8%E6%93%87%E8%A1%A8%E5%96%AE%20%E6%96%B0%E5%AF%AB%E6%B3%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'CAP-5BFE32ACA1FA9EFFEC1E0180A4F46CCA'; // 替換為你的 CapSolver API 密鑰
    let captchaImg
    let startTime
    const auto =true // 自動輸入驗證碼
    const tickets = 2 // 購買票數

    const intervalId = setInterval(() => {
        captchaImg = document.querySelector('#TicketForm_verifyCode-image');
        startTime = Date.now();
        if(captchaImg){
            handleAgreeButton()
            handleFormSelection()

            if(auto){
                handleCaptcha()
            }else{
                checkCaptchaInput()
            }

            clearInterval(intervalId);
        }
    }, 100);



  function handleCaptcha() {
    if (!captchaImg) {
        console.log("未找到驗證碼圖片");
        return;
    }

    const imgSrc = captchaImg.src; // 圖片的 URL

    // 使用 fetch 獲取圖片數據
    fetch(imgSrc)
        .then(response => {
            if (!response.ok) {
                throw new Error(`圖片請求失敗: ${response.statusText}`);
            }
            return response.blob(); // 獲取圖片二進制數據
        })
        .then(blob => {
            // 將 blob 轉換為 Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result.replace("data:image/png;base64,", "");
                uploadToCapSolver(base64Image);
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            console.error("無法處理驗證碼圖片:", error);
        });
}


    // 上傳驗證碼到 CapSolver 的函數
    function uploadToCapSolver(base64Image) {
        const requestData = {
            clientKey: API_KEY,
            task: {
                websiteURL: "",
                module: "module_001",
                type: "ImageToTextTask",
                body: base64Image
            }
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.capsolver.com/createTask",
            data: JSON.stringify(requestData),
            headers: {
                "Content-Type": "application/json"
            },
            onload: (response) => handleCapSolverResponse(response)
        });
    }

    // 處理 CapSolver 響應的函數
    function handleCapSolverResponse(response) {
        const captchaInput = document.querySelector('#TicketForm_verifyCode');
        if (response.status !== 200) {
            console.error("上傳請求失敗，狀態碼:", response.status);
            return;
        }

        const jsonResponse = JSON.parse(response.responseText);
        if (jsonResponse.errorId !== 0) {
            console.error("上傳驗證碼失敗:", jsonResponse.errorDescription);
            return;
        }

        const captchaText = jsonResponse.solution.text;
        const submitButton = document.querySelector('button[type="submit"]');
        console.log("驗證碼解碼成功:", captchaText);
        if (captchaInput) {
            endProcess();
            captchaInput.value = captchaText;
            if (submitButton) submitButton.click();
            console.log("驗證碼已自動填寫並提交");
        } else {
            console.error("未找到驗證碼輸入框");
        }
    }

    // 處理 "同意" 按鈕的函數
    function handleAgreeButton() {
        const agreeButton = document.querySelector("#TicketForm_agree");
        if (agreeButton) {
            agreeButton.click();
            console.log("同意按鈕已點擊");
        }
    }

    // 處理表單選擇的函數
    function handleFormSelection() {
        const greyInput = document.querySelector(".greyInput");
        const formSelect = document.querySelector(".form-select");
        if (formSelect) {
            formSelect.value = tickets;
            console.log("表單選項已設置為 1");
        }
        if (greyInput) {
            greyInput.focus();
            console.log("焦點已設置到灰色輸入框");
        }
    }

    function checkCaptchaInput(){
        const submitButton = document.querySelector('button[type="submit"]');
        const captchaInput = document.querySelector('#TicketForm_verifyCode');
        if (captchaInput) {
            captchaInput.addEventListener('input', () => {
                if (captchaInput.value.length === 4 && submitButton) {
                    submitButton.click();
                    console.log("驗證碼輸入完成，通過輸入框點擊觸發提交表單");
                    endProcess();
                }
            });
        }
    }

        function endProcess() {
        const endTime = Date.now();
        const totalElapsedTime = (endTime - startTime) / 1000; // 以秒為單位
        console.log(`流程結束，總共運行時間: ${totalElapsedTime.toFixed(2)} 秒`);

    }


})();
