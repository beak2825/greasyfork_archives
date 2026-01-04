// ==UserScript==
// @name         🚀 ClaimFreeCoins Ultimate Faucet Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматизация ClaimFreeCoins + Панель управления + Авто-капча (hCaptcha / reCAPTCHA)
// @author       👑
// @match        *://claimfreecoins.io/*
// @match        *://*.youtube.com/*
// @match        *://web.telegram.org/*
// @match        *://web.telegram.org/a/*
// @match        *://*.vk.com/*
// @match        *://*.t.me/*
// @match        *://*.x.com/*
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @match        *://*google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimfreecoins.io
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546132/%F0%9F%9A%80%20ClaimFreeCoins%20Ultimate%20Faucet%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/546132/%F0%9F%9A%80%20ClaimFreeCoins%20Ultimate%20Faucet%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔑 Настройки
    const faucetpayEmail = "youremail@domain.com"; // 🔹 Твой FaucetPay email
    const twoCaptchaApiKey = "YOUR_2CAPTCHA_API_KEY"; // 🔹 API ключ 2Captcha

    // 📌 Список кранов ClaimFreeCoins
    const faucets = [
        { name: "Bitcoin", url: "https://claimfreecoins.io/free-bitcoin" },
        { name: "Ethereum", url: "https://claimfreecoins.io/free-ethereum" },
        { name: "Litecoin", url: "https://claimfreecoins.io/free-litecoin" },
        { name: "Dogecoin", url: "https://claimfreecoins.io/free-dogecoin" },
        { name: "BNB", url: "https://claimfreecoins.io/free-bnb" },
        { name: "Tron", url: "https://claimfreecoins.io/free-tron" },
        { name: "Solana", url: "https://claimfreecoins.io/free-solana" },
        { name: "USDT", url: "https://claimfreecoins.io/free-tether" },
        { name: "Polygon", url: "https://claimfreecoins.io/free-matic" },
        { name: "BCH", url: "https://claimfreecoins.io/free-bitcoincash" },
        { name: "DASH", url: "https://claimfreecoins.io/free-dash" },
        { name: "ZEC", url: "https://claimfreecoins.io/free-zcash" },
        { name: "DGB", url: "https://claimfreecoins.io/free-digibyte" },
        { name: "FEY", url: "https://claimfreecoins.io/free-feyorra" },
        { name: "USDC", url: "https://claimfreecoins.io/free-usdc" },
        { name: "XRP", url: "https://claimfreecoins.io/free-xrp" },
        { name: "TON", url: "https://claimfreecoins.io/free-ton" },
        { name: "ADA", url: "https://claimfreecoins.io/free-cardano" },
        { name: "XMR", url: "https://claimfreecoins.io/free-monero" },
        { name: "XLM", url: "https://claimfreecoins.io/free-stellar" }
    ];

    // 🎨 Стили для панели
    GM_addStyle(`
        #faucet-panel {
            position: fixed;
            top: 50px;
            right: 0;
            width: 250px;
            background: #1e1e2f;
            color: #fff;
            border-radius: 12px 0 0 12px;
            box-shadow: -3px 3px 15px rgba(0,0,0,0.5);
            padding: 10px;
            z-index: 99999;
            font-family: Arial, sans-serif;
        }
        #faucet-panel h2 {
            font-size: 16px;
            margin: 5px 0;
            text-align: center;
        }
        #faucet-panel button {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: none;
            border-radius: 8px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            font-weight: bold;
        }
        #faucet-panel button:hover {
            background: #45a049;
        }
        #faucet-list {
            max-height: 400px;
            overflow-y: auto;
            margin-top: 10px;
        }
        .faucet-btn {
            background: #2a2a40;
            color: #fff;
            margin: 3px 0;
            padding: 6px;
            border-radius: 6px;
            text-align: center;
            cursor: pointer;
        }
        .faucet-btn:hover {
            background: #3c3c5c;
        }
    `);

    // 📌 Создание панели
    const panel = document.createElement("div");
    panel.id = "faucet-panel";
    panel.innerHTML = `
        <h2>💰 ClaimFreeCoins</h2>
        <button id="openAll">🌐 Открыть все</button>
        <div id="faucet-list"></div>
    `;
    document.body.appendChild(panel);

    // 📌 Заполняем список кранов
    const list = document.getElementById("faucet-list");
    faucets.forEach(f => {
        const btn = document.createElement("div");
        btn.className = "faucet-btn";
        btn.innerText = f.name;
        btn.onclick = () => window.open(f.url, "_blank");
        list.appendChild(btn);
    });

    // 📌 Кнопка "Открыть все"
    document.getElementById("openAll").onclick = () => {
        faucets.forEach(f => window.open(f.url, "_blank"));
    };

    // 🔄 Авто-вставка email и авто-Claim
    function autoClaim() {
        const emailField = document.querySelector("input[name='address'], input[name='email']");
        const claimBtn = document.querySelector("button[type='submit'], .btn.btn-primary");

        if (emailField) {
            emailField.value = faucetpayEmail;
        }
        if (claimBtn) {
            claimBtn.click();
        }
    }
    setTimeout(autoClaim, 3000);

    // 🤖 Обход hCaptcha / reCAPTCHA
    function solveCaptcha() {
        const hcaptcha = document.querySelector("iframe[src*='hcaptcha.com']");
        const recaptcha = document.querySelector("iframe[src*='recaptcha']");
        if (!hcaptcha && !recaptcha) return;

        const sitekey = hcaptcha
            ? hcaptcha.src.match(/sitekey=([^&]+)/)[1]
            : recaptcha.closest("div").getAttribute("data-sitekey");

        const pageurl = window.location.href;

        // Отправка задачи в 2Captcha
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://2captcha.com/in.php",
            data: `key=${twoCaptchaApiKey}&method=${hcaptcha ? "hcaptcha" : "userrecaptcha"}&sitekey=${sitekey}&pageurl=${pageurl}&json=1`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function (res) {
                const taskId = JSON.parse(res.responseText).request;
                const interval = setInterval(() => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `http://2captcha.com/res.php?key=${twoCaptchaApiKey}&action=get&id=${taskId}&json=1`,
                        onload: function (r) {
                            const result = JSON.parse(r.responseText);
                            if (result.status === 1) {
                                clearInterval(interval);
                                const token = result.request;

                                let textarea = document.querySelector("#g-recaptcha-response, #h-captcha-response");
                                if (textarea) {
                                    textarea.value = token;
                                }

                                document.querySelector("form").submit();
                            }
                        }
                    });
                }, 8000);
            }
        });
    }
    setTimeout(solveCaptcha, 5000);

})();
