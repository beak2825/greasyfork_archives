// ==UserScript==
// @name        Hotfaucet.in Auto Klik Claim + Refresh
// @namespace   Violentmonkey Scripts
// @match       https://hotfaucet.in/faucet*
// @match       https://hotfaucet.in/madfaucet*
// @grant       none
// @version     1.0
// @author      info1944
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=hotfaucet.in
// @description Auto klik tombol klaim dan refresh otomatis
// @downloadURL https://update.greasyfork.org/scripts/542878/Hotfaucetin%20Auto%20Klik%20Claim%20%2B%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/542878/Hotfaucetin%20Auto%20Klik%20Claim%20%2B%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fungsi untuk menunggu dalam milidetik
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function autoKlik() {
        console.log("⏳ Menunggu 12 detik sebelum klik tombol klaim...");
        await sleep(12000); // Delay awal 12 detik

        const tombol = document.querySelector('button.btn.btn-success.btn-lg.claim-button');
        if (tombol) {
            console.log("✅ Tombol klaim ditemukan, klik sekarang...");
            tombol.click();

            console.log("🔁 Menunggu 100 detik sebelum refresh halaman...");
            await sleep(100000); // Tunggu 100 detik setelah klik
            location.reload();
        } else {
            console.log("❌ Tombol klaim tidak ditemukan.");
        }
    }

    window.addEventListener('load', autoKlik);
})();
