// ==UserScript==
// @name         AUTO SETUJUI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Silahkan di kembagkan
// @author       LuthfiDIKBUD
// @match        https://presensi.palukota.go.id
// @license      LuthfiDIKBUD-License
// @downloadURL https://update.greasyfork.org/scripts/533848/AUTO%20SETUJUI.user.js
// @updateURL https://update.greasyfork.org/scripts/533848/AUTO%20SETUJUI.meta.js
// ==/UserScript==

/*
  Lisensi: LuthfiDIKBUD-License
  - Anda diizinkan menggunakan script ini untuk keperluan pribadi.
  - Tidak diizinkan menyebarkan ulang tanpa izin tertulis dari pembuat.
  - Nama pembuat asli (LuthfiDIKBUD) harus tetap dicantumkan.
*/

(function () {
    'use strict';

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function autoApprove() {
        console.log("🔍 Mulai pencarian baris status 'pengajuan' atau yang belum disetujui...");
        const rows = document.querySelectorAll("table.grocery-crud-table tbody tr");
        let count = 0;

        for (const row of rows) {
            const statusCell = row.querySelector("td:nth-child(13)");
            const actionDropdown = row.querySelector(".dropdown-menu");

            if (!statusCell || !actionDropdown) continue;

            const statusText = statusCell.innerText.trim().toLowerCase();

            // Gantilah ini kalau ternyata status yang ingin kamu proses punya nama lain
            if (statusText !== "disetujui") {
                const setujuLink = Array.from(actionDropdown.querySelectorAll("a"))
                    .find(a => a.innerText.trim().toLowerCase() === "setuju");

                if (setujuLink) {
                    console.log(`✅ Menyetujui baris: ${statusText}`);
                    setujuLink.click();
                    count++;
                    await delay(2000); // beri jeda agar server tidak overload
                }
            }
        }

        console.log(`🎉 Selesai! Total yang disetujui: ${count}`);
        return count;
    }

    async function continuousAutoApprove() {
        while (true) {
            const approvedCount = await autoApprove();
            if (approvedCount === 0) {
                console.log("Tidak ada baris yang perlu disetujui. Menunggu reload...");
                await delay(5000); // Tunggu 5 detik sebelum reload
            }
            window.location.reload();
        }
    }

    // Mulai proses secara otomatis saat halaman dimuat
    window.addEventListener("load", () => {
        console.log("🚀 Mulai proses setuju otomatis...");
        continuousAutoApprove();
    });
})();