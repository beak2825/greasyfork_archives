// ==UserScript==
// @name         ClaimFreeCoins Auto Faucet Widget-демо версия
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Удобный виджет для кранов ClaimFreeCoins + поддержка FaucetPay Email (сохраняется). Работает на любых сайтах.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/546090/ClaimFreeCoins%20Auto%20Faucet%20Widget-%D0%B4%D0%B5%D0%BC%D0%BE%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/546090/ClaimFreeCoins%20Auto%20Faucet%20Widget-%D0%B4%D0%B5%D0%BC%D0%BE%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ==================== User Configuration ====================
    const defaultEmail = "sstels215@gmail.com";
    const faucetpayEmail = GM_getValue("faucetpayEmail", defaultEmail);

    const websiteData = [
        { url: "https://claimfreecoins.io/bitcoin-faucet/?r=" + faucetpayEmail, coin: "Bitcoin" },
        { url: "https://claimfreecoins.io/dogecoin-faucet/?r=" + faucetpayEmail, coin: "Dogecoin" },
        { url: "https://claimfreecoins.io/litecoin-faucet/?r=" + faucetpayEmail, coin: "Litecoin" },
        { url: "https://claimfreecoins.io/tron-faucet/?r=" + faucetpayEmail, coin: "Tron" },
        { url: "https://claimfreecoins.io/bnb-faucet/?r=" + faucetpayEmail, coin: "BNB" },
        { url: "https://claimfreecoins.io/solana-faucet/?r=" + faucetpayEmail, coin: "Solana" },
        { url: "https://claimfreecoins.io/tether-faucet/?r=" + faucetpayEmail, coin: "USDT" },
        { url: "https://claimfreecoins.io/polygon-faucet/?r=" + faucetpayEmail, coin: "Polygon" },
        { url: "https://claimfreecoins.io/ethereum-faucet/?r=" + faucetpayEmail, coin: "Ethereum" },
        { url: "https://claimfreecoins.io/bch-faucet/?r=" + faucetpayEmail, coin: "BCH" },
        { url: "https://claimfreecoins.io/dash-faucet/?r=" + faucetpayEmail, coin: "Dash" },
        { url: "https://claimfreecoins.io/zcash-faucet/?r=" + faucetpayEmail, coin: "Zcash" },
        { url: "https://claimfreecoins.io/digibyte-faucet/?r=" + faucetpayEmail, coin: "DigiByte" },
        { url: "https://claimfreecoins.io/feyorra-faucet/?r=" + faucetpayEmail, coin: "Feyorra" },
        { url: "https://claimfreecoins.io/usdc-faucet/?r=" + faucetpayEmail, coin: "USDC" },
        { url: "https://claimfreecoins.io/ripple-faucet/?r=" + faucetpayEmail, coin: "XRP" },
        { url: "https://claimfreecoins.io/toncoin-faucet/?r=" + faucetpayEmail, coin: "Toncoin" },
        { url: "https://claimfreecoins.io/cardano-faucet/?r=" + faucetpayEmail, coin: "Cardano" },
        { url: "https://claimfreecoins.io/monero-faucet/?r=" + faucetpayEmail, coin: "Monero" },
        { url: "https://claimfreecoins.io/stellar-faucet/?r=" + faucetpayEmail, coin: "Stellar" }
    ];

    // ==================== Styles ====================
    const style = document.createElement("style");
    style.textContent = `
    #faucet-widget {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 260px;
        background: #1e1e2f;
        color: #fff;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        font-family: Arial, sans-serif;
        z-index: 99999;
        overflow: hidden;
    }
    #faucet-widget header {
        background: #ff9800;
        padding: 10px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
    }
    #faucet-widget .content {
        display: none;
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
    }
    #faucet-widget button {
        width: 100%;
        margin: 5px 0;
        padding: 8px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }
    #faucet-widget button:hover {
        opacity: 0.9;
    }
    .coin-btn {
        background: #3f51b5;
        color: #fff;
    }
    .all-btn {
        background: #4caf50;
        color: #fff;
    }
    .save-btn {
        background: #ff5722;
        color: #fff;
    }
    #email-input {
        width: 95%;
        padding: 6px;
        border-radius: 6px;
        border: none;
        margin-bottom: 10px;
    }
    `;
    document.head.appendChild(style);

    // ==================== Widget ====================
    const widget = document.createElement("div");
    widget.id = "faucet-widget";
    widget.innerHTML = `
        <header>💰 ClaimFreeCoins</header>
        <div class="content">
            <input type="email" id="email-input" value="${faucetpayEmail}" placeholder="Введите FaucetPay Email"/>
            <button class="save-btn">💾 Сохранить Email</button>
            <button class="all-btn">🌐 Открыть все краны</button>
            <div id="coin-list"></div>
        </div>
    `;
    document.body.appendChild(widget);

    const header = widget.querySelector("header");
    const content = widget.querySelector(".content");
    header.addEventListener("click", () => {
        content.style.display = content.style.display === "block" ? "none" : "block";
    });

    const coinList = widget.querySelector("#coin-list");
    websiteData.forEach(site => {
        const btn = document.createElement("button");
        btn.textContent = site.coin;
        btn.className = "coin-btn";
        btn.addEventListener("click", () => {
            GM_openInTab(site.url, { active: true });
        });
        coinList.appendChild(btn);
    });

    widget.querySelector(".all-btn").addEventListener("click", () => {
        websiteData.forEach(site => {
            GM_openInTab(site.url, { active: false });
        });
    });

    widget.querySelector(".save-btn").addEventListener("click", () => {
        const newEmail = widget.querySelector("#email-input").value.trim();
        if (newEmail) {
            GM_setValue("faucetpayEmail", newEmail);
            alert("✅ Email сохранён! Перезагрузите страницу.");
        }
    });
})();
