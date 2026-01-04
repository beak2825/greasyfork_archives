// ==UserScript==
// @name         GPT4.0支付-自动展开地址勾选复选框
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Assist in OpenAI payment processing, check the checkbox and click the button on the payment page
// @author       Your Name
// @license      ChatGPT4V
// @icon         https://p.sda1.dev/14/ae911be8b862bed51bc3496d8b48f4a1/1568.png
// @match        https://chat.openai.com/
// @match        https://pay.openai.com/*
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/480098/GPT40%E6%94%AF%E4%BB%98-%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%9C%B0%E5%9D%80%E5%8B%BE%E9%80%89%E5%A4%8D%E9%80%89%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/480098/GPT40%E6%94%AF%E4%BB%98-%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%9C%B0%E5%9D%80%E5%8B%BE%E9%80%89%E5%A4%8D%E9%80%89%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasRun = false;

    function extractUrl(result) {
        try {
            const parsedResult = JSON.parse(result);
            return parsedResult.url;
        } catch (error) {
            console.error('Error parsing result:', error);
            return null;
        }
    }

    function clickButtonOnPaymentPage() {
        let button = document.getElementsByClassName('Button Button--link Button--checkoutSecondaryLink Button--md');
        if (button.length > 0 && !hasRun) {
            button[0].click();
            hasRun = true; // Prevent further clicks
        }
    }

    function checkAndClickCheckbox() {
        let checkbox = document.querySelector('#termsOfServiceConsentCheckbox');
        if (checkbox && !checkbox.checked) {
            checkbox.click(); // Trigger a click to check it
        }
    }

    if (window.location.href.indexOf("https://pay.openai.com") !== -1) {
        // This event listener ensures we only try to click the checkbox after the page has loaded
        window.addEventListener('load', function() {
            checkAndClickCheckbox();
            clickButtonOnPaymentPage(); // We also want to click the button after ensuring the checkbox is checked
        });
    } else if (window.location.href.indexOf("https://chat.openai.com") !== -1 && !hasRun) {
        // Your logic to handle the initial page and possibly trigger the redirection to the payment page
        fetch("https://chat.openai.com/api/auth/session")
            .then(response => response.json())
            .then(data => {
                const accessToken = data.accessToken;
                return fetch("https://chat.openai.com/backend-api/payments/checkout", {
                    method: "POST",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                        "Authorization": "Bearer " + accessToken
                    },
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer'
                });
            })
            .then(response => response.text())
            .then(result => {
                const url = extractUrl(result);
                if (url) {
                    GM_openInTab(url, {active: true}); // Open the payment page in a new tab
                    hasRun = true; // Prevent re-running this block
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    // Other code can go here if needed
})();