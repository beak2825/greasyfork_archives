// ==UserScript==
// @name         Ticket Bot
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Ticket booking bot with timing and CSP bypass
// @author       Scott
// @match        https://tixcraft.com/ticket/ticket/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513767/Ticket%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/513767/Ticket%20Bot.meta.js
// ==/UserScript==



(async function () {
    'use strict';

    const CONFIG = {
        TICKET_VALUE: '2',
        MAX_RETRIES: 10,
        RETRY_DELAY: 50,
        DEBUG: true,
        SERVER_URL: 'http://localhost:8000/ocr'
    };

    let retryCount = 0;
    let isProcessing = false;

    const logger = {
        debug: (message, ...args) => {
            if (CONFIG.DEBUG) {
                console.log(`[除錯] ${message}`, ...args);
            }
        },
        error: (message, ...args) => {
            console.error(`[錯誤] ${message}`, ...args);
        }
    };

    function initElements() {
        return {
            captchaImg: document.getElementById("TicketForm_verifyCode-image"),
            captchaInput: document.getElementById("TicketForm_verifyCode"),
            submitButton: document.querySelector('button[type="submit"]'),
            ticketSelect: document.querySelector('select[id^="TicketForm_ticketPrice_"]'),
            termsCheckbox: document.querySelector('input[id="TicketForm_agree"]'),
            form: document.getElementById('form-ticket-ticket')
        };
    }

    async function recognizeCaptcha(base64Value) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: CONFIG.SERVER_URL,
                data: JSON.stringify({ url: base64Value }),
                headers: { "Content-Type": "application/json" },
                onload: function (response) {
                    if (response.status === 200) {
                        const responseData = JSON.parse(response.responseText);
                        resolve(responseData.result?.trim());
                    } else {
                        reject(new Error(`HTTP 錯誤: ${response.status}`));
                    }
                },
                onerror: (err) => reject(new Error(`HTTP 錯誤: ${err}`))
            });
        });
    }

    async function processCaptcha() {
        const elements = initElements();
        if (!elements.captchaImg) {
            logger.error('找不到驗證碼圖片元素');
            return null;
        }
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = async () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const base64Value = canvas.toDataURL('image/png');
                logger.debug('驗證碼轉為 Base64');
                const result = await recognizeCaptcha(base64Value);
                resolve(result);
            };
            img.src = elements.captchaImg.src;
        });
    }

    async function simulateClick(element) {
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        element.dispatchEvent(clickEvent);
    }

    async function submitForm(captchaValue) {
        const elements = initElements();
        if (!elements.form || !elements.captchaInput) {
            logger.error('找不到表單元素');
            return false;
        }
        elements.captchaInput.value = captchaValue;
        logger.debug('填入驗證碼:', captchaValue);

        try {
            await simulateClick(elements.submitButton); // 模擬提交
            logger.debug('表單已提交');
            return true;
        } catch (error) {
            logger.error('表單提交失敗:', error);
            return false;
        }
    }

    async function retry() {
        if (isProcessing) return;
        retryCount++;
        if (retryCount >= CONFIG.MAX_RETRIES) {
            logger.debug('已達最大重試次數');
            return;
        }
        isProcessing = true;
        logger.debug(`開始第 ${retryCount} 次嘗試`);

        try {
            const captchaValue = await processCaptcha();
            if (captchaValue && captchaValue.length === 4 && /^[A-Za-z]+$/.test(captchaValue)) {
                const success = await submitForm(captchaValue);
                if (success) return;
            }

            logger.debug('嘗試失敗，準備重試');
            await refreshCaptcha();
            setTimeout(retry, CONFIG.RETRY_DELAY);
        } finally {
            isProcessing = false;
        }
    }

    async function initialize() {
        logger.debug('初始化腳本...');
        if (document.readyState !== 'complete') {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }
        window.alert = (message) => {
            logger.debug('攔截到警告:', message);
            if (message.includes("驗證碼不正確")) {
                refreshCaptcha().then(() => setTimeout(retry, 0));
            }
        };
        window.confirm = () => true;

        const elements = initElements();
        if (elements.ticketSelect) elements.ticketSelect.value = CONFIG.TICKET_VALUE;
        if (elements.termsCheckbox) elements.termsCheckbox.checked = true;

        retry();
    }

    async function refreshCaptcha() {
        const elements = initElements();
        if (!elements.captchaImg) return;
        elements.captchaImg.click();
        logger.debug('驗證碼已刷新');
    }

    initialize().catch(error => logger.error('初始化失敗:', error));
})();