// ==UserScript==
// @name        ltcviews Auto PTC and Faucet Claim
// @namespace   Violentmonkey Scripts
// @match       https://www.ltcviews.com/*
// @grant       none
// @version     1.0
// @author      info1944
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ltcviews.com
// @grant       none
// @description auto open PTC and Faucet
// @downloadURL https://update.greasyfork.org/scripts/536772/ltcviews%20Auto%20PTC%20and%20Faucet%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/536772/ltcviews%20Auto%20PTC%20and%20Faucet%20Claim.meta.js
// ==/UserScript==


(function () {
    'use strict';

    console.log("🚀 Script Auto Click Visit Ad dimulai...");

    function autoClickVisitAd() {
        const buttons = document.querySelectorAll('button.btn.btn-outline-success');

        for (const btn of buttons) {
            if (btn.textContent.trim().toLowerCase() === 'visit ad') {
                console.log("✅ Tombol 'Visit Ad' ditemukan, mengklik...");
                btn.click();
                return; // klik hanya satu tombol
            }
        }

        console.log("⏳ Tombol 'Visit Ad' belum ditemukan, cek ulang 3 detik...");
        setTimeout(autoClickVisitAd, 3000);
    }

    // Mulai cek setelah halaman dimuat
    window.addEventListener("load", () => {
        setTimeout(autoClickVisitAd, 2000);
    });


    console.log("🚀 Script mulai untuk Visit Ad ➜ Claim Faucet loop...");

    function clickVisitAd() {
        const visitBtn = document.querySelector("a.btn.btn-primary[onclick*='startTimer']");
        if (visitBtn) {
            console.log("✅ Klik tombol Visit Ad...");
            visitBtn.click();

            // Tunggu 20 detik, lalu lanjut ke tombol claim
            setTimeout(clickClaimButton, 20000);
        } else {
            console.log("❌ Tombol Visit Ad tidak ditemukan, ulangi dalam 3 detik...");
            setTimeout(clickVisitAd, 3000);
        }
    }

    function clickClaimButton() {
        const claimBtn = document.querySelector("button#claimBtn1.btn.btn-success[onclick*='claimAd']");
        if (claimBtn) {
            console.log("✅ Klik tombol Claim Faucet...");
            claimBtn.click();

            // Tunggu 5 detik, lalu mulai ulang proses
            setTimeout(() => {
                console.log("🔁 Ulangi proses ke tombol Visit Ad...");
                clickVisitAd();
            }, 5000);
        } else {
            console.log("❌ Tombol Claim Faucet tidak ditemukan, cek ulang dalam 3 detik...");
            setTimeout(clickClaimButton, 3000);
        }
    }

    // Mulai otomatis 3 detik setelah halaman load
    setTimeout(clickVisitAd, 3000);

})();