// ==UserScript==
// @name         ClaimCoin Multi Faucet Rotator PRO
// @namespace    https://claimcoin.in/
// @version      1.3
// @description  Auto Login + Smart UI + 100 Claims + 3-Click Trigger
// @author       Rubystance
// @license      MIT
// @match        https://claimcoin.in/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546106/ClaimCoin%20Multi%20Faucet%20Rotator%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/546106/ClaimCoin%20Multi%20Faucet%20Rotator%20PRO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMAIL = "YOUR_FAUCETPAY_EMAIL_HERE"; // << YOUR_FAUCETPAY_EMAIL
    const MAX_CLAIMS = 100;
    const REF_URL = "https://claimcoin.in/multi/?r=783";

    const faucets = [
        { name: "LTC", url: "https://claimcoin.in/multi/faucet/currency/ltc" },
        { name: "DOGE", url: "https://claimcoin.in/multi/faucet/currency/doge" },
        { name: "TRX", url: "https://claimcoin.in/multi/faucet/currency/trx" },
        { name: "SOL", url: "https://claimcoin.in/multi/faucet/currency/sol" },
        { name: "USDT", url: "https://claimcoin.in/multi/faucet/currency/usdt" },
        { name: "BNB", url: "https://claimcoin.in/multi/faucet/currency/bnb" },
        { name: "BCH", url: "https://claimcoin.in/multi/faucet/currency/bch" },
        { name: "DASH", url: "https://claimcoin.in/multi/faucet/currency/dash" },
        { name: "DGB", url: "https://claimcoin.in/multi/faucet/currency/dgb" },
        { name: "ZEC", url: "https://claimcoin.in/multi/faucet/currency/zec" }
    ];

    let manualClicks = 0;

    if (document.getElementById("InputEmail")) {
        const email = document.getElementById("InputEmail");
        const btn = document.querySelector("button[type='submit']");
        email.value = EMAIL;
        setTimeout(() => btn.click(), 800);
        return;
    }

    let current = GM_getValue("currentFaucet", 0);
    if (current >= faucets.length) current = 0;
    let faucet = faucets[current];

    if (!location.href.includes(faucet.url) && !location.href.includes("multi/?r=")) {
        location.href = faucet.url;
        return;
    }

    const key = "claims_" + faucet.name;
    let claims = GM_getValue(key, 0);

    if (claims >= MAX_CLAIMS) {
        nextFaucet();
        return;
    }

    const ui = document.createElement("div");
    ui.innerHTML = `
    <div style="position:fixed;top:20px;right:20px;background:#0b1320;color:#00ffd5;padding:15px;border-radius:12px;font-family:Segoe UI;z-index:99999;width:230px;box-shadow:0 0 15px #00ffd5;">
        <b style="font-size:16px;">CLAIMCOIN PRO</b><br>
        <small>Status: Click images 3x</small><hr style="border:0.5px solid #1a2635">
        Faucet: <b>${faucet.name}</b><br>
        Claims: <b>${claims}/${MAX_CLAIMS}</b><br>
        <button id="nextF" style="margin-top:10px;width:100%;background:#00ffd5;border:none;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;color:#0b1320;">NEXT FAUCET</button>
        <button id="resetF" style="margin-top:5px;width:100%;background:#ff4d4d;border:none;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;color:white;">RESET ALL</button>
    </div>`;
    document.body.appendChild(ui);

    document.getElementById("nextF").onclick = () => nextFaucet();
    document.getElementById("resetF").onclick = () => {
        if(confirm("Reset all?")) {
            faucets.forEach(f => GM_setValue("claims_" + f.name, 0));
            GM_setValue("currentFaucet", 0);
            location.reload();
        }
    };

    const observer = new MutationObserver(() => {
        const success = document.querySelector(".swal2-title");
        if (success && success.innerText.includes("Success")) {
            GM_setValue(key, claims + 1);
            manualClicks = 0;
            setTimeout(nextFaucet, 1000);
        }

        handleManualClicks();
        autoGoClaim();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function handleManualClicks() {

        const images = document.querySelectorAll('img[src^="data:image/png;base64"]');
        images.forEach(img => {
            const link = img.closest('a');
            if (link && !link.dataset.hooked) {
                link.dataset.hooked = "true";
                link.addEventListener('click', function(e) {
                    manualClicks++;
                    if (manualClicks >= 3) {
                        const claimBtn = document.getElementById("subbutt");
                        if (claimBtn) {
                            setTimeout(() => claimBtn.click(), 300);
                            manualClicks = 0;
                        }
                    }
                });
            }
        });
    }

    function autoGoClaim() {
        const goBtn = document.querySelector("a.btn.btn-primary");
        if (goBtn && goBtn.innerText.toLowerCase().includes("go claim") && !goBtn.dataset.clicked) {
            goBtn.dataset.clicked = "true";
            setTimeout(() => goBtn.click(), 2000);
        }
    }

    function nextFaucet() {
        let next = GM_getValue("currentFaucet", 0) + 1;
        if (next >= faucets.length) next = 0;
        GM_setValue("currentFaucet", next);
        location.href = faucets[next].url;
    }

})();