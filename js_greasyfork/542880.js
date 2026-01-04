// ==UserScript==
// @name        coinltc.xyz Auto Click Claim + Refresh
// @namespace   Violentmonkey Scripts
// @match       https://coinltc.xyz/faucet*
// @match       https://coinltc.xyz/*
// @grant       none
// @version     1.0
// @author      info1944
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=coinltc.xyz
// @description Auto klik tombol klaim dan refresh otomatis
// @downloadURL https://update.greasyfork.org/scripts/542880/coinltcxyz%20Auto%20Click%20Claim%20%2B%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/542880/coinltcxyz%20Auto%20Click%20Claim%20%2B%20Refresh.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Fungsi untuk menunggu dalam milidetik
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function autoKlik() {
        console.log("⏳ Menunggu 18 detik sebelum klik tombol klaim...");
        await sleep(18000); // Delay awal 18 detik

        const tombol = document.querySelector('button.btn-1.btn-lg.claim-button');
        if (tombol) {
            console.log("✅ Tombol klaim ditemukan, klik sekarang...");
            tombol.click();

            console.log("🔁 Menunggu 40 detik sebelum refresh halaman...");
            await sleep(40000); // Tunggu 40 detik setelah klik
            location.reload();
        } else {
            console.log("❌ Tombol klaim tidak ditemukan.");
        }
    }

    window.addEventListener('load', autoKlik);
})();



