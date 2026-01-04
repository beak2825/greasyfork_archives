// ==UserScript==
// @name         HAPUS TAWARAN
// @namespace    https://www.facebook.com/behesty7
// @version      2.1
// @description  RELIST
// @author       BEHESTY
// @match        https://www.facebook.com/marketplace/selling/relist_items/?is_routable_dialog=*
// @match        https://web.facebook.com/marketplace/selling/relist_items/?is_routable_dialog=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546034/HAPUS%20TAWARAN.user.js
// @updateURL https://update.greasyfork.org/scripts/546034/HAPUS%20TAWARAN.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let running = false;

    /* ==========================
       UI LOG + START/STOP BUTTON
       ========================== */

    const box = document.createElement('div');
    Object.assign(box.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '260px',
        background: 'rgba(0,0,0,0.85)',
        padding: '10px',
        borderRadius: '10px',
        color: '#fff',
        zIndex: 999999,
        fontSize: '12px',
        fontFamily: 'monospace'
    });

    box.innerHTML = `
        <button id="btnToggle"
            style="width:100%; padding:6px; margin-bottom:8px; background:#28a745; border:none; color:white; font-weight:bold; cursor:pointer; border-radius:5px;">
            START
        </button>
        <textarea id="logTerm" style="width:100%; height:200px; background:#111; color:#0f0; padding:5px; border:none; border-radius:5px; resize:none;"></textarea>
    `;
    document.body.appendChild(box);

    const logTerm = document.getElementById('logTerm');
    const btnToggle = document.getElementById('btnToggle');

    function log(msg) {
        const t = new Date().toLocaleTimeString();
        logTerm.value += `[${t}] ${msg}\n`;
        logTerm.scrollTop = logTerm.scrollHeight;
    }

    btnToggle.onclick = () => {
        running = !running;
        btnToggle.style.background = running ? "#dc3545" : "#28a745";
        btnToggle.textContent = running ? "STOP" : "START";

        if (running) {
            log("▶ START ditekan, memulai proses...");
            startMain();
        } else {
            log("⏹ STOP ditekan, menghentikan proses...");
        }
    };

    /* ==========================
       UTIL
       ========================== */
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const randomDelay = () => delay(500 + Math.random() * 1500);

    /* ==========================
       STEP 1: CARI "Perbarui"
       ========================== */

    async function findUpdateButtons(maxTries = 90, interval = 1000) {
        log(`🔎 Mencari tombol "Hapus Tawaran..." (max ${maxTries} percobaan)...`);

        for (let i = 1; i <= maxTries; i++) {
            if (!running) return [];

            const btns = [...document.querySelectorAll('div[aria-label="Hapus & Tawarkan Ulang"]')]
                .filter(b => b.offsetHeight > 0);

            if (btns.length) {
                log(`✅ Menemukan ${btns.length} tombol Hapus Tawaran...`);
                return btns;
            }

            log(`⌛ Percobaan ${i}/${maxTries} - belum muncul`);
            await delay(interval);
        }

        log("⚠️ Tidak menemukan tombol Hapus Tawaran...");
        return [];
    }

    /* ==========================
       STEP 2: KLIK SEMUA PERBARUI
       ========================== */

    async function clickAllUpdateButtons(buttons) {
        for (let btn of buttons) {
            if (!running) return;
            btn.scrollIntoView({ behavior: "smooth", block: "center" });
            log("🔁 Klik Hapus Tawaran...");
            btn.click();
            await randomDelay();
        }
    }

    /* ==========================
       STEP 3: CARI TOMBOL SELESAI
       ========================== */

    async function clickDoneIfExists() {
        log("🔎 Mencari tombol Selesai...");

        for (let i = 0; i < 30; i++) {
            if (!running) return;

            const done = [...document.querySelectorAll('div[aria-label="Selesai"]')]
                .find(b => b.offsetHeight > 0);

            if (done) {
                done.scrollIntoView({ behavior: "smooth", block: "center" });
                log("✔ Klik tombol Selesai");
                done.click();
                return;
            }

            await delay(500);
        }

        log("⚠️ Tombol Selesai tidak ditemukan.");
    }

    /* ==========================
       STEP 4: COUNTDOWN + RELOAD
       ========================== */

    async function countdown(sec = 3) {
        for (let i = sec; i > 0; i--) {
            if (!running) return;
            log(`⏳ Reload dalam ${i} detik...`);
            await delay(1000);
        }
    }

    /* ==========================
       MAIN LOOP
       ========================== */

    async function startMain() {
        if (!running) return;

        log("⏱ Menunggu 2 detik sebelum mulai...");
        await delay(2000);

        while (running) {
            /* 1. Cari tombol perbarui */
            const buttons = await findUpdateButtons(90, 1000);

            if (!running) break;
            if (buttons.length === 0) {
                log("🏁 Tidak ada tombol Hapus Tawaran. Proses dihentikan.");
                break;
            }

            /* 2. Klik semuanya */
            await clickAllUpdateButtons(buttons);

            if (!running) break;

            /* 3. Klik Selesai jika ada */
            await clickDoneIfExists();

            if (!running) break;

            /* 4. Countdown */
            await countdown(20);

            /* 5. Reload halaman */
            log("🔄 Reload halaman untuk batch berikutnya...");
            window.location.href = 'https://www.facebook.com/marketplace/selling/relist_items/?is_routable_dialog=true&show_only_delete_and_relist=true';
            break;
        }
    }

    /* AUTO START */
    running = true;
    btnToggle.textContent = "STOP";
    btnToggle.style.background = "#dc3545";
    log("▶ AUTO START aktif. Memulai proses...");
    startMain();

})();