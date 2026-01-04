// ==UserScript==
// @name         FBMP Listing Manager
// @namespace    http://tampermonkey.net/
// @version      6.8.0
// @description  The ultimate Facebook Marketplace listing deletion machine - now with AI-powered evasion and ninja-like stealth
// @author       Behesty
// @match        https://www.facebook.com/marketplace/you/selling?order=*
// @match        https://web.facebook.com/marketplace/you/selling?order=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541418/FBMP%20Listing%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/541418/FBMP%20Listing%20Manager.meta.js
// ==/UserScript==

console.log("🧪 [FBMP Terminator] Script loaded.");
(function() {
    'use strict';

    // Mission Control Configuration
    const config = {
        running: false,
        cycle: 0,
        maxCycles: 5,
        coolDown: 1,
        stealthMode: true,
        aiBehavior: "random", // "random", "sold", "unsold", "no_answer"
        maxFailures: 5,
        version: "6.8"
    };

    // AI Response Bank
    const aiResponses = {
        deletion: [
            "Terminating listing with extreme prejudice",
            "Making listing disappear like magic",
            "Sending listing to the shadow realm",
            "Executing order 66 on this listing"
        ],
        failure: [
            "Target evaded deletion!",
            "The listing fought back!",
            "Mission failed, we'll get 'em next time",
            "Facebook countermeasures detected!"
        ],
        waiting: [
            "Maintaining operational security",
            "Hiding from Facebook's watchful eyes",
            "Simulating human browsing patterns",
            "Calculating next move..."
        ]
    };

    // Stealth Operations
    function getRandomDelay() {
        return config.stealthMode ?
            500 + Math.random() * 1000 : // Random delay between 500-1500sm in stealth mode
        200 + Math.random() * 700; // Faster operation when stealth is off
    }

    async function sleep(ms) {
        for (let i = 0; i < ms; i += 200) {
            if (!config.running) throw new Error("TERMINATED");
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    async function delayDinamis({
        checkFn = () => false, // Fungsi pengecekan target (misalnya elemen muncul)
        interval = 200, // Interval cek per langkah
        maxCycle = 25, // Berapa kali maksimal dicek (default 25 × 200ms = 500ms)
        log = false, // Aktifkan log jika perlu
        logLabel = "Menunggu target"
    } = {}) {
        for (let i = 0; i < maxCycle; i++) {
            if (await checkFn()) {
                if (log) log(`✅ ${logLabel} muncul lebih cepat pada ${i * interval}ms`);
                return true;
            }
            if (log) log(`⏳ ${logLabel}... (${i + 1}/${maxCycle})`);
            await sleep(interval);
        }

        if (log) log(`⏳ ${logLabel} tidak muncul setelah ${interval * maxCycle}ms`);
        return false;
    }

    function log(message) {
        const logBox = document.getElementById('terminator-log');
        if (logBox) {
            const timestamp = new Date().toLocaleTimeString();
            logBox.value += `[${timestamp}] ${message}\n`;
            logBox.scrollTop = logBox.scrollHeight;
        }
    }

    function normalizeLabel(s) {
        return (s || "")
            .replace(/\u00A0/g, " ") // nbsp
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
    }

    // Tactical UI Elements
    function createTerminatorUI() {
        const panel = document.createElement('div');
        panel.id = 'terminator-panel';
        panel.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 35%;
        right: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 40px 15px 15px;
        background: rgba(0,0,0,0.80);
        border: 2px solid #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        color: #ffffff;
        box-shadow: 0 -2px 15px rgba(0, 255, 0, 0.3);
        max-width: 100vw;
    `;

        // Header
        const header = document.createElement('div');
        header.textContent = `Listing Manager v${config.version}`;
        header.style.cssText = `
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
        background: #000;
        color: #0f0;
        padding: 5px 15px;
        border-radius: 6px;
        border: 1px solid #00ff00;
        font-weight: bold;
        font-size: 14px;
        z-index: 10000;
        pointer-events: none;
    `;
        panel.appendChild(header);

        // Kontainer isi
        const container = document.createElement('div');
        container.style.cssText = `
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 5px;
        justify-content: space-between;
        padding: 5px;
    `;

        // Baris input
        const inputRow = document.createElement('div');
        inputRow.style.cssText = `
        display: flex;
        gap: 0px;
        flex-wrap: wrap;
        width: 100%;
        align-items: center;
        font-size: 9px;
    `;
        inputRow.innerHTML = `
  <label id="dynamicLabel" style="flex:1; color:#fff;">
      Cari teks:
      <input type="text" id="dynamicInput" placeholder="contoh: 10/10 atau 12/05"
          style="height:20px;width:70%;background:#111;color:#0f0;border:1px solid #333;">
  </label>

  <label style="flex:1; color:#fff;">
      Cool Down:
      <input type="number" id="coolDown" value="${config.coolDown}"
          style="height:20px;width:45%;background:#111;color:#0f0;border:1px solid #333;">
  </label>

  <label style="flex:1; color:#fff;margin-right:auto;">
      Status: <span id="statusIndicator" style="color:#ff0;">STANDBY</span>
  </label>

  <label style="flex:1; color:#fff;">
      <input type="checkbox" id="stealthMode" style="transform: scale(2.0); margin-right: 5px;" ${config.stealthMode ? 'checked' : ''}>
      Stealth Mode
  </label>
`;
        container.appendChild(inputRow);

        // Select Mode
        const rows = document.createElement('div');
        rows.style.cssText = `
        display: flex;
        gap: 0px;
        flex-wrap: wrap;
    `;
        rows.innerHTML = `
    <div style="flex:1;">
        <select id="aiBehavior" style="padding:15px;background:#111;color:#0f0;border:1px solid #333;width:100%;">
                    <option value="random">Random Behavior</option>
                    <option value="sold">Mark as Sold</option>
                    <option value="unsold">Mark as Unsold</option>
                    <option value="no_answer">No Answer</option>
                </select>
                 </div>
<div style="flex:1;">
     <select id="operationMode" style="padding:15px;background:#111;color:#0f0;border:1px solid #333;width:100%;">
                    <option value="terminator">TERMINATOR MODE</option>
                    <option value="repost">REPOST MODE</option>
                    <option value="update">UPDATE MODE</option>
                    <option value="manual">MANUAL MODE</option>
                    <option value="scroll">SCROLL MODE</option>
                </select>
                 </div>
    `;
        container.appendChild(rows);

        // Log
        const start = document.createElement('div');
        start.style.cssText = `
       display: flex;
       gap: 5px;
       flex-wrap: wrap;
       justify-content: space-between;
       align-items: center;
       max-width: 100vw
       padding: 0px;
        `;
        start.innerHTML = `
    <label style="flex:1; color:#fff;font-size:21px;">
    <button id="toggleButton" style="padding: 35px;margin-top: 1px;width: 100%;background:linear-gradient(180deg, #00cc00 0%, #009900 100%);border:none;color:white;border-radius:3px;cursor:pointer;font-weight:bold;">
    ▶ START
    </button>  </label>

    <label style="flex:1; color:#fff;">
    <textarea id="terminator-log" rows="6" cols="35" readonly style="margin-top: 1px;width:100%;resize:none;background:#111;color:#fff;border:1px solid #333;font-family:monospace;">
    </textarea>  </label>
`;
        container.appendChild(start);

        // Gabungkan ke panel
        panel.appendChild(container);

        // Tambahkan ke dokumen
        const style = document.createElement('style');
        style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(0.98); }
            100% { transform: scale(1); }
        }
    `;

        const extraStyle = document.createElement('style');
        extraStyle.textContent = `
        body, html {
            padding-bottom: 140px;
        }
    `;

        document.body.appendChild(panel);
        document.head.appendChild(style);
        document.head.appendChild(extraStyle);


        document.getElementById('toggleButton').addEventListener('click', () => {
            config.running = !config.running;
            const status = document.getElementById('statusIndicator');
            const button = document.getElementById('toggleButton');

            if (config.running) {
                button.innerHTML = '⏹ HENTIKAN';
                button.style.background = 'linear-gradient(180deg, #ff3300 0%, #cc0000 100%)';
                status.textContent = 'ACTIVE';
                status.style.color = '#0f0';
                log('DIAKTIFKAN ULANG');

                const mode = document.getElementById('operationMode').value;

                if (mode === 'terminator') {
                    startTerminationSequence();
                } else if (mode === 'repost') {
                    startRepostSequence(); // ← pastikan kamu membuat fungsi ini
                }else if (mode === 'update') {
                    startUpdateSequence(); // ← pastikan kamu membuat fungsi ini
                }else if (mode === 'manual') {
                    startManualSequence(); // ← pastikan kamu membuat fungsi ini
                }else if (mode === 'scroll') {
                    startScrollSequence();
                }

            }else {
                button.innerHTML = '▶ START';
                button.style.background = 'linear-gradient(180deg, #00cc00 0%, #009900 100%)';
                status.textContent = 'STANDBY';
                status.style.color = '#ff0';
                log('SCRIPT DIJEDA');
            }
        });

        document.getElementById('stealthMode').addEventListener('change', (e) => {
            config.stealthMode = e.target.checked;
            log(`STEALTH MODE ${config.stealthMode ? 'ENABLED' : 'DISABLED'}`);
        });

        document.getElementById('aiBehavior').addEventListener('change', (e) => {
            config.aiBehavior = e.target.value;
            log(`AI BEHAVIOR SET TO: ${e.target.value.toUpperCase()}`);
        });

        // Perbarui coolDown secara langsung saat input berubah
        document.getElementById('coolDown').addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0) {
                config.coolDown = val;
                log(`⏳ CoolDown diubah menjadi: ${val} detik`);
            }
        });

        document.getElementById('operationMode').addEventListener('change', (e) => {
            const mode = e.target.value;
            log(`⚙️ Operation Mode berubah ke: ${mode.toUpperCase()}`);
            updateDynamicInputByMode();
        });

            }

    function updateDynamicInputByMode() {
        const mode = document.getElementById('operationMode')?.value || '';
        const label = document.getElementById('dynamicLabel');
        if (!label) return;

        if (mode === 'manual' || mode === 'update') {
            label.innerHTML = `
            Cari teks:
            <input type="text" id="dynamicInput" placeholder="contoh: 10/10 atau 12/05"
                style="height:20px;width:70%;background:#111;color:#0f0;border:1px solid #333;">
        `;
        } else if (mode === 'repost' || mode === 'terminator') {
            label.innerHTML = `
            Proses:
            <input type="number" id="dynamicInput" value="1"
                style="height:20px;width:45%;background:#111;color:#0f0;border:1px solid #333;">
        `;
        } else {
            label.innerHTML = `
            <span style="color:#888;">(Mode ini tidak memerlukan input)</span>
        `;
        }
    }


    function resetToggleUI() {
        config.running = false;

        const button = document.getElementById('toggleButton');
        const status = document.getElementById('statusIndicator');

        button.innerHTML = '▶ START';
        button.style.background = 'linear-gradient(180deg, #00cc00 0%, #009900 100%)';
        status.textContent = 'STANDBY';
        status.style.color = '#ff0';
    }


    // ====== START OF startTerminationSequence() ====== //
    async function startTerminationSequence() {
        try {
            config.maxCycles = parseInt(document.getElementById("dynamicInput").value) || 50;
            config.coolDown = parseInt(document.getElementById("coolDown").value) || 5;
            log("Cooldown dari input:", config.coolDown);

            log(`Memulai Urutan Penghapusan - ${config.maxCycles} TARGETS`);
            log(`STRATEGY: ${config.aiBehavior.toUpperCase()} | STEALTH: ${config.stealthMode ? 'ON' : 'OFF'}`);

            // Beralih ke Tampilan Daftar (List View)
            const listButton = [...document.querySelectorAll('div[aria-label="Tampilan Daftar"]')].find(isVisibleTermination);
            if (listButton && listButton.getAttribute('aria-pressed') === 'false') {
                humanLikeClickTermination(listButton);
                log("📃 Beralih ke Tampilan Daftar...");
                await sleep(500);
            }

            let consecutiveFailures = 0;

            for (config.cycle = 1; config.cycle <= config.maxCycles; config.cycle++) {
                if (!config.running) break;

                log(`MISSION ${config.cycle} OF ${config.maxCycles}`);

                // Phase 1: Engage ellipsis
                if (!await engageEllipsis()) {
                    consecutiveFailures++;
                    log(`WARNING: TARGET MENGHINDAR (${consecutiveFailures}/${config.maxFailures})`);

                    if (consecutiveFailures >= config.maxFailures) {
                        log("CRITICAL FAILURE - MEMULAI PENGELAKAN");
                        window.location.href = "/marketplace/you/selling";
                        return;
                    }
                    continue;
                } else {
                    consecutiveFailures = 0;
                }

                await sleep(500);

                // Phase 2: Engage deletion
                if (!await engageElement("Hapus tawaran")) {
                    log("DIHENTIKAN - TARGET TERTUTUP");
                    continue;
                }

                await sleep(500);

                // Phase 3: Confirm deletion
                if (!await engageDeleteConfirmation("Hapus")) {
                    log("KONFIRMASI GAGAL - MUNGKIN MASIH AKTIF");
                    continue;
                }

                // Phase 4: AI Reason Step (conditional)
                await sleep(300);
                const reasonExists = Array.from(document.querySelectorAll('span'))
                .some(span => ["Ya, terjual di Facebook", "Ya, terjual di tempat lain", "Tidak, belum terjual", "Memilih tidak menjawab"]
                      .includes(span.textContent.trim()));

                if (reasonExists) {
                    const responseText = getStrategicResponse();
                    await engageElement(responseText);
                    await engageElement("Berikutnya");
                } else {
                    const nextBtn = Array.from(document.querySelectorAll('span'))
                    .find(span => span.textContent.trim() === "Berikutnya" && isVisibleTermination(span));

                    if (nextBtn) {
                        executeClick(nextBtn);
                        log("KONFIRMASI : TERHAPUS");
                        await sleep(getRandomDelay());
                    } else {
                        log("⚠️ Tidak ada alasan penawaran. Menganggap listing sudah dihapus.");
                    }
                }

                await sleep(1000);

                // Phase 5: AI Response (lagi, jika muncul ulang)
                const responseText = getStrategicResponse();
                if (await engageElement(responseText)) {
                    await engageElement("Berikutnya");
                } else {
                    const confirmBtn = Array.from(document.querySelectorAll('span'))
                    .find(span => span.textContent.trim() === "Berikutnya" && isVisibleTermination(span));

                    if (confirmBtn) {
                        executeClick(confirmBtn);
                        log("KONFIRMASI : TERHAPUS");
                        await sleep(getRandomDelay());
                    }
                }

                // Cool down period
                const waitingMsg = getAIResponse('waiting');
                log(`${waitingMsg} (${config.coolDown} detik)...`);
                for (let s = 1; s <= config.coolDown; s++) {
                    if (!config.running) {
                        log("🛑 PROSES Dihentikan oleh pengguna.");
                        return;
                    }
                    log(`🕒 ${s}`);
                    await sleep(1000);
                }
            }

            log("PROSES HAPUS BERHASIL");
            resetToggleUI();

            //        log("ALL TARGETS NEUTRALIZED OR MISSION ABORTED");
        } catch (e) {
            if (e.message === "TERMINATED") {
                log("🛑 PROSES DIHENTIKAN LANGSUNG OLEH PENGGUNA");
            } else {
                log(`❌ ERROR: ${e.message}`);
            }
            resetToggleUI();
        }
    }

    // ====== HELPER FUNCTIONS startTerminationSequence() ====== //

    function getAIResponse(type) {
        const responses = aiResponses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function findZeroClickListingButton() {
        // Temukan semua elemen yang berisi teks "0 klik tawaran"
        const zeroClickElements = Array.from(document.querySelectorAll("div.x1rg5ohu"))
        .filter(el => el.textContent.includes("0 klik tawaran"));

        for (const el of zeroClickElements) {
            // Naik ke atas sampai container listing
            let current = el;
            for (let i = 0; i < 15; i++) {
                if (!current) break;
                if (current.querySelector("div[aria-label^='Opsi lainnya untuk']") ||
                   current.querySelector("div[aria-label^='More options']")) {
                    const ellipsisBtn = current.querySelector("div[aria-label^='More options']");
                    if (ellipsisBtn) return ellipsisBtn;
                }
                current = current.parentElement;
            }
        }
        // Jika tidak ada tombol ⋯ ditemukan dalam listing dengan 0 klik tawaran
        return null;
    }

    function executeClick(elem) {
        if (!elem) return false;

        const rect = elem.getBoundingClientRect();
        const mouseEventInit = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + rect.width/2,
            clientY: rect.top + rect.height/2
        };

        ['mousedown', 'mouseup', 'click'].forEach(type => {
            elem.dispatchEvent(new MouseEvent(type, mouseEventInit));
        });

        return true;
    }

    async function engageDeleteConfirmation() {
        // Cari semua tombol "Hapus" yang terlihat
        const candidates = Array.from(document.querySelectorAll('div[role="dialog"] span'))
        .filter(span => span.textContent.trim() === "Hapus" && isVisibleTermination(span));

        if (candidates.length === 0) {
            log("❌ Tidak menemukan tombol 'Hapus' di dalam dialog.");
            return false;
        }

        // Ambil yang paling bawah (biasanya tombol konfirmasi biru)
        const button = candidates[candidates.length - 1];
        button.scrollIntoView({ behavior: "smooth", block: "center" });
        await sleep(getRandomDelay());
        executeClick(button);
        log(`🧨 Konfirmasi 'Hapus' dieksekusi.`);
        await sleep(500);
        return true;
    }

    async function engageElement(text, tag = 'span') {
        const elements = Array.from(document.querySelectorAll(tag));
        const lowerText = text.toLowerCase();

        const target = elements.find(el => {
            const match = el.textContent.trim().toLowerCase() === lowerText;
            const visible = isVisibleTermination(el);
            return match && visible;
        });

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            await sleep(getRandomDelay());
            executeClick(target);
            log(`${getAIResponse('deletion')}: "${text}"`);
            await sleep(getRandomDelay());
            return true;
        } else {
            log(`${getAIResponse('failure')} - Target tidak ditemukan: "${text}"`);
            return false;
        }
    }

    function getStrategicResponse() {
        switch(config.aiBehavior) {
            case "sold":
                return Math.random() > 0.5 ? "Ya, terjual di Facebook" : "Ya, terjual di tempat lain";
            case "unsold":
                return "Tidak, belum terjual";
            case "no_answer":
                return "Memilih tidak menjawab";
            default:{
                const options = [
                    "Memilih tidak menjawab",
                    "Ya, terjual di Facebook",
                    "Ya, terjual di tempat lain",
                    "Tidak, belum terjual",
                ];
                return options[Math.floor(Math.random() * options.length)];
            }
        }
    }

    async function engageEllipsis() {
        const target = findZeroClickListingButton();
        if (!target) {
            log("❌ Tidak ada listing dengan '0 klik tawaran' ditemukan.");
            return false;
        }

        target.scrollIntoView({ behavior: "smooth", block: "center" });
        await sleep(1000);
        executeClick(target);
        log("🎯 Target '0 klik tawaran' ditemukan dan diserang.");
        await sleep(getRandomDelay());
        return true;
    }

    function humanLikeClickTermination(elem) {
        if (!elem) return false;
        const rect = elem.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const options = {
            bubbles: true,
            cancelable: true,
            composed: true,
            clientX: x,
            clientY: y,
            pointerType: 'mouse'
        };
        elem.dispatchEvent(new PointerEvent('pointerdown', options));
        elem.dispatchEvent(new PointerEvent('pointerup', options));
        elem.dispatchEvent(new PointerEvent('click', options));
        return true;
    }

    function isVisibleTermination(elem) {
        return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
    }

    // ====== END OF startTerminationSequence() ====== //
    // ====== START OF startUpdateSequence() ====== //

    async function startUpdateSequence() {
        let successCount = 0;
        let totalProcessed = 0;
        try {
            log("Memulai Update Mode");

            if (!(await switchToListViewRepost())) {
                log("⚠️ Gagal beralih ke tampilan daftar, melanjutkan dengan tampilan saat ini");
            }

            let consecutiveFailures = 0;
            let scrollAttempts = 0;
            const maxScrollAttempts = 50;
            let consecutiveFails = 0;
            const maxConsecutiveFails = 5;


            while (scrollAttempts < maxScrollAttempts && consecutiveFails < maxConsecutiveFails) {
                // Improved method to find "Tips :" listings
                const tipsElements = await findTipsElements();

                if (tipsElements.length === 0) {
                    log("❌ Tidak menemukan listing dengan Tips:...");
                    if (totalProcessed === 0 && scrollAttempts > 10) {
                        log("⚠️ Tidak menemukan listing dengan Tips:... sama sekali");
                        break;
                    }

                    await smartScrollUpdate();
                    scrollAttempts++;
                    consecutiveFails++;
                    await sleep(500);
                    continue;
                }
                log(`🔍 Ditemukan ${tipsElements.length} listing dengan Tips:...`);
                consecutiveFails = 0;

                // Find the parent listing card
                for (let i = 0; i < tipsElements.length; i++) {
                    const listing = tipsElements[i];
                    listing.scrollIntoView({ behavior: "smooth", block: "center" });
                    await sleep(500);
                    log(`🔄 Memproses listing (${totalProcessed + 1}/${tipsElements.length})`);
                    try {
                        const listingCard = await findUpdateListingCard(listing);

                        if (!listingCard) {
                            log("⚠️ Gagal memproses listing ini");
                            continue;
                        }

                        // Find ellipsis menu button - more reliable method
                        const ellipsisBtn = findEllipsisButton(listingCard);

                        if (!ellipsisBtn || !isClickable(ellipsisBtn)) {
                            log("⚠️ Tombol menu ellipsis tidak ditemukan atau tidak dapat diklik");
                            continue;
                        }


                        // Click the ellipsis menu
                        executeClick(ellipsisBtn);
                        log("📌 Membuka menu ellipsis...");
                        // Tunggu sampai menu dan item pertama siap terdeteksi
                        await delayDinamis({
                            checkFn: () => !!findFirstMenuItem(), // gunakan helper baru
                        });

                        const firstBtn = findFirstMenuItem();
                        let firstLabel = "";
                        if (firstBtn) {
                            firstLabel = normalizeLabel(firstBtn ? (firstBtn.innerText || firstBtn.textContent) : "").toLowerCase().trim();
                        }

                        if (firstBtn && firstLabel.includes("perbarui penawaran")) {
                            // klik elemen yang benar-benar klikable (ancestor menuitem/button)
                            const clickable = getClickableAncestor(firstBtn) || firstBtn;
                            executeClick(clickable);
                            log("🔄 Memperbarui penawaran...");

                            listing.textContent = "✅ Diperbarui";
                            listing.style.color = "#00ff00";
                            listing.style.fontWeight = "bold";
                            successCount++;
                            await sleep(500);
                        } else {
                            log("⏩ Tombol pertama bukan 'Perbarui penawaran', skip...");
                            // Tutup menu bila tombol pertama bukan 'Perbarui penawaran'
                            if (ellipsisBtn && isClickable(ellipsisBtn)) {
                                executeClick(ellipsisBtn);
                            }

                            listing.textContent = "⚠️ Skipped";
                            listing.style.color = "#ff9900";
                            listing.style.fontWeight = "bold";
                            await sleep(500);
                        }
                        // === END LOGIKA BARU ===
                        // Cool down period
                        const waitingMsg = getAIResponse('waiting');
                        log(`${waitingMsg} (${config.coolDown} detik)...`);
                        for (let s = 1; s <= config.coolDown; s++) {
                            if (!config.running) {
                                log("🛑 PROSES Dihentikan.");
                                return;
                            }
                            log(`🕒 ${s}`);
                            await sleep(1000);
                        }
                    } catch (e) {
                        log(`❌ Error: ${e.message}`);
                    }
                    totalProcessed++;
                }
            }

            log("PROSES UPDATE SELESAI");

        } catch (e) {
            if (e.message === "TERMINATED") {
                log("🛑 PROSES DIHENTIKAN LANGSUNG OLEH PENGGUNA");
            } else {
                log(`❌ ERROR: ${e.message}`);
                console.error(e);
            }
        }finally {
            // ⬇️ ringkasan SELALU ditampilkan, baik normal selesai maupun dihentikan
            log(`✅ Berhasil memperbarui ${successCount}/${totalProcessed}`);
            resetToggleUI();
        }
    }


    // ====== HELPER FUNCTIONS startUpdateSequence() ====== //
    async function smartScrollUpdate() {
        window.scrollBy({
            top: window.innerHeight * 1.5,
            behavior: 'smooth'
        });
        await sleep(1000);
        window.scrollBy(0, 200);
    }

    function findUpdateListingCard(element) {
        // Traverse up the DOM to find the listing card container
        let current = element;
        const maxLevels = 10;
        let levels = 0;

        while (current && levels < maxLevels) {
            // Check for common listing card indicators
            if (current.getAttribute('role') === 'article' ||
                current.classList.toString().includes('marketplace') ||
                current.querySelector('[aria-label^="Opsi lainnya untuk"]') ||
                current.querySelector('[aria-label^="More options"]')) {
                return current;
            }
            current = current.parentElement;
            levels++;
        }
        return null;
    }

    function findTipsElements() {
        // Multiple ways to find "Stok Ada" text since Facebook changes classes often
        const possibleSelectors = [
            'span:contains("Tips: Perbarui tawaran Anda?)', // jQuery-style selector (may not work)
            'div:contains("Tips: Perbarui tawaran Anda?")',
            '//*[text()="Tips: Perbarui tawaran Anda?"]', // XPath
            '[aria-label*="Tips: Perbarui tawaran Anda?"]'
        ];

        // Try each selector until we find matches
        for (const selector of possibleSelectors) {
            try {
                let elements = [];
                // Try XPath if selector starts with //
                if (selector.startsWith('//')) {
                    const result = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                    for (let i = 0; i < result.snapshotLength; i++) {
                        elements.push(result.snapshotItem(i));
                    }
                } else {
                    // Try querySelectorAll
                    elements = Array.from(document.querySelectorAll(selector));
                }

                // Filter visible elements
                elements = elements.filter(el =>
                                           isVisible(el)&&
                                           el.textContent.trim()=== "Tips: Perbarui tawaran Anda?" &&
                                           !el.hasAttribute('data-updated')
                                          );

                if (elements.length > 0) {
                    return elements;
                }
            } catch (e) {
                console.log(`Selector ${selector} failed:`, e);
            }
        }

        // Fallback: Search all text nodes
        const allElements = Array.from(document.querySelectorAll('span, div, a, p, li'));
        return allElements.filter(el => {
            return el.textContent.trim() === "Tips: Perbarui tawaran Anda?" && isVisible(el);
        });
    }


    // ====== END OF startUpdateSequence() ====== //

    // ====== START OF startRepostSequence() ====== //

    async function startRepostSequence() {
        try {
            log("🔄 MEMULAI REPOST SEQUENCE - Mencari listing dengan 'Hapus & Tawarkan Ulang'");

            // Switch to list view for better scanning
            if (!(await switchToListViewRepost())) {
                log("⚠️ Gagal beralih ke tampilan daftar, melanjutkan dengan tampilan saat ini");
            }

            let totalProcessed = 0;
            let scrollAttempts = 0;
            const maxScrollAttempts = 50;
            let consecutiveFails = 0;
            const maxConsecutiveFails = 5;
            let lastButtonCount = 0;
            let sameButtonCountOccurrences = 0;

            // Initial load wait
            await sleep(1000);

            while (scrollAttempts < maxScrollAttempts && consecutiveFails < maxConsecutiveFails) {
                // Find all unprocessed buttons with fresh scan
                const allButtons = await comprehensiveButtonScanRepost();
                const unprocessedButtons = allButtons.filter(btn =>
                                                             isVisibleRepost(btn) &&
                                                             isClickableRepost(btn) &&
                                                             !btn.hasAttribute('data-processed')
                                                            );

                // Check if we're seeing the same number of buttons repeatedly (possible infinite loop)
                if (unprocessedButtons.length === lastButtonCount) {
                    sameButtonCountOccurrences++;
                    if (sameButtonCountOccurrences > 3) {
                        log("⚠️ Deteksi kemungkinan infinite loop, melakukan reset...");
                        sameButtonCountOccurrences = 0;
                        await reloadPage();
                        continue;
                    }
                } else {
                    sameButtonCountOccurrences = 0;
                    lastButtonCount = unprocessedButtons.length;
                }

                if (unprocessedButtons.length === 0) {
                    log(`ℹ️ Tidak menemukan tombol baru (scroll ${scrollAttempts + 1}/${maxScrollAttempts})`);

                    // Special handling when no buttons found
                    if (totalProcessed === 0 && scrollAttempts > 10) {
                        log("⚠️ Tidak menemukan tombol sama sekali setelah beberapa scroll");
                        break;
                    }

                    let prevListingCount = await countListingsRepost();
                    await aggressiveScrollRepost();
                    await sleep(1000); // beri waktu loading
                    let newListingCount = await countListingsRepost();

                    if (newListingCount > prevListingCount) {
                        log(`📈 Ditemukan ${newListingCount - prevListingCount} listing baru setelah scroll`);
                        continue; // skip ke atas untuk scan ulang
                    } else {
                        log("📉 Tidak ada listing baru setelah scroll");
                    }
                }

                log(`🔍 Ditemukan ${unprocessedButtons.length} tombol aktif yang belum diproses`);
                consecutiveFails = 0; // Reset fail counter

                // Process all unprocessed buttons in this batch
                for (let i = 0; i < unprocessedButtons.length; i++) {
                    const button = unprocessedButtons[i];

                    // Verify button still exists and is clickable
                    if (!document.contains(button) || !isClickableRepost(button)) {
                        log("ℹ️ Tombol tidak valid lagi, melanjutkan...");
                        continue;
                    }

                    const listing = findParentListingRepost(button);

                    if (!listing) {
                        log("⚠️ Tidak dapat menemukan parent listing, menandai tombol sebagai gagal");
                        button.setAttribute('data-processed', 'failed');
                        continue;
                    }

                    log(`🔄 Memproses listing ${totalProcessed + 1}/${unprocessedButtons.length}`);
                    highlightButtonRepost(button, 'processing');

                    // More robust clicking with multiple fallbacks
                    const success = await robustButtonClickRepost(button, listing);

                    if (success) {
                        totalProcessed++;
                        highlightButtonRepost(button, 'success');
                        // More permanent marking of processed buttons
                        button.setAttribute('data-processed', 'true');
                        button.setAttribute('data-processed-time', Date.now());
                        log(`✅ Berhasil memproses (Total: ${totalProcessed})`);

                        // After successful processing, check if listing disappeared
                        if (!document.contains(listing)) {
                            log("ℹ️ Listing menghilang setelah diproses");
                        }
                    } else {
                        highlightButtonRepost(button, 'failed');
                        button.setAttribute('data-processed', 'failed');
                        log("⚠️ Gagal memproses tombol ini");
                    }

                    // Randomized delay between buttons (1-2 seconds)
                    await sleep(1000 + Math.random() * 1000);
                }
                await sleep(1000);
                // Final verification scan
                const remainingButtons = (await comprehensiveButtonScanRepost()).filter(btn =>
                                                                                        isVisibleRepost(btn) &&
                                                                                        isClickableRepost(btn) &&
                                                                                        !btn.hasAttribute('data-processed')
                                                                                       );

                if (remainingButtons.length > 0) {
                    log(`ℹ️ Masih ada ${remainingButtons.length} tombol yang belum diproses`);

                    // More aggressive scroll if we still have unprocessed buttons
                    await aggressiveScrollRepost();
                    scrollAttempts++;
                    await sleep(3000);
                } else {
                    log("✔️ Semua tombol telah diproses");
                    break;
                }
            }

            log(`🎉 Selesai! Total tombol berhasil diklik: ${totalProcessed}`);
            resetToggleUI();

        } catch (e) {
            log(`❌ ERROR: ${e.message}`);
            console.error(e);
        }
        resetToggleUI();
    }

    // ====== HELPER FUNCTIONS startRepostSequence() ====== //
    function highlightButtonRepost(button, state) {
        const colors = {
            processing: 'hsl(30, 100%, 50%)', // Orange
            success: 'hsl(120, 100%, 40%)', // Green
            failed: 'hsl(0, 100%, 45%)' // Red
        };

        button.style.border = `2px solid ${colors[state]}`;
        button.style.borderRadius = '6px';
        button.style.transition = 'all 0.3s ease';
        button.style.padding = '2px';

        if (state === 'processing') {
            button.style.boxShadow = '0 0 0 3px rgba(255,165,0,0.3)';
            button.style.animation = 'pulse 0.5s 2';
        } else {
            button.style.boxShadow = 'none';
            button.style.animation = 'none';
        }

        // Create temporary highlight effect
        const highlight = document.createElement('div');
        highlight.style.position = 'absolute';
        highlight.style.backgroundColor = state === 'success' ? 'rgba(76, 175, 80, 0.2)' :
        state === 'failed' ? 'rgba(244, 67, 54, 0.2)' :
        'rgba(255, 165, 0, 0.2)';
        highlight.style.borderRadius = 'inherit';
        highlight.style.inset = '0';
        highlight.style.pointerEvents = 'none';
        highlight.style.zIndex = '9999';

        button.style.position = 'relative';
        button.appendChild(highlight);

        setTimeout(() => {
            highlight.style.opacity = '0';
            highlight.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                button.removeChild(highlight);
                button.style.border = '';
                button.style.borderRadius = '';
                button.style.padding = '';
            }, 500);
        }, 1000);
    }

    function verifyClickSuccessRepost(button, listing, initialButtonState, initialListingExists, initialButtonText) {
        return (
            (initialButtonState && !isClickableRepost(button)) ||
            (initialListingExists && !document.contains(listing)) ||
            (button.textContent !== initialButtonText) ||
            (window.getComputedStyle(button).opacity < 0.5) ||
            (button.getAttribute('aria-disabled') === 'true')
        );
    }

    function isVisibleRepost(elem) {
        if (!elem) return false;
        const style = window.getComputedStyle(elem);
        return style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            elem.offsetWidth > 0 &&
            elem.offsetHeight > 0 &&
            elem.getClientRects().length;
    }

    function isClickableRepost(element) {
        if (!element || !isVisibleRepost(element)) return false;
        try {
            const style = window.getComputedStyle(element);
            return !(style.pointerEvents === 'none' ||
                     style.cursor === 'not-allowed' ||
                     parseFloat(style.opacity) < 0.6 ||
                     element.disabled);
        } catch (e) {
            console.log('Error checking clickable:', e);
            return false;
        }
    }

    async function reloadPage() {
        log("🔄 Memuat ulang halaman...");
        window.scrollTo(0, 0);
        await sleep(2000);
        window.location.reload();
    }

    async function aggressiveScrollRepost() {
        // Scroll further than viewport height to ensure loading
        const scrollDistance = window.innerHeight * 2;
        window.scrollBy({
            top: scrollDistance,
            behavior: 'smooth'
        });

        // Additional micro-scrolls to trigger loading
        await sleep(1000);
        window.scrollBy(0, 300);
        await sleep(500);
        window.scrollBy(0, 100);
    }

    async function robustButtonClickRepost(button, listing) {
        try {
            // Double-check button state
            if (!isVisibleRepost(button) || !isClickableRepost(button)) {
                return false;
            }

            // Store initial state
            const initialButtonState = isClickableRepost(button);
            const initialListingExists = document.contains(listing);
            const initialButtonText = button.textContent;
            const initialButtonHTML = button.outerHTML;

            // Scroll to button with offset to account for headers
            const yOffset = -100; // Adjust for fixed headers
            const buttonRect = button.getBoundingClientRect();
            window.scrollTo({
                top: window.scrollY + buttonRect.top + yOffset,
                behavior: 'smooth'
            });
            await sleep(800);

            // Try multiple click methods with visual feedback
            const clickMethods = [
                () => {
                    button.style.transform = 'scale(0.98)';
                    button.click();
                },
                () => humanLikeClickRepost(button),
                () => simulateMouseClickRepost(button),
                () => {
                    const rect = button.getBoundingClientRect();
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        clientX: rect.left + rect.width/2,
                        clientY: rect.top + rect.height/2
                    });
                    button.dispatchEvent(clickEvent);
                }
            ];

            let clickSuccess = false;
            for (const method of clickMethods) {
                if (clickSuccess) break;
                try {
                    method();
                    await sleep(300 + Math.random() * 700); // Vary delay between attempts

                    // Immediate verification
                    if (verifyClickSuccessRepost(button, listing, initialButtonState, initialListingExists, initialButtonText)) {
                        clickSuccess = true;
                        break;
                    }
                } catch (e) {
                    console.log(`Click method failed: ${e.message}`);
                }
            }

            // Reset button style
            button.style.transform = '';

            if (!clickSuccess) return false;

            // Progressive verification with multiple checks
            const verificationChecks = [
                // Immediate check
                () => verifyClickSuccessRepost(button, listing, initialButtonState, initialListingExists, initialButtonText),
                // Delayed check
                async () => {
                    await sleep(1500);
                    return verifyClickSuccessRepost(button, listing, initialButtonState, initialListingExists, initialButtonText);
                },
                // DOM change check
                () => button.outerHTML !== initialButtonHTML
            ];

            for (const check of verificationChecks) {
                if (await check()) {
                    return true;
                }
            }

            return false;

        } catch (e) {
            log(`⚠️ Click error: ${e.message}`);
            return false;
        }
    }

    function humanLikeClickRepost(elem) {
        if (!elem) return false;
        const rect = elem.getBoundingClientRect();
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;

        const events = [
            new MouseEvent('mouseover', { bubbles: true }),
            new MouseEvent('mousedown', { bubbles: true }),
            new MouseEvent('mouseup', { bubbles: true }),
            new MouseEvent('click', { bubbles: true })
        ];

        events.forEach(evt => {
            elem.dispatchEvent(evt);
        });

        return true;
    }

    function simulateMouseClickRepost(element) {
        if (!element || !isVisibleRepost(element)) return false;

        try {
            const rect = element.getBoundingClientRect();
            const mouseEventInit = {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: rect.left + rect.width/2,
                clientY: rect.top + rect.height/2
            };

            ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(type => {
                element.dispatchEvent(new MouseEvent(type, mouseEventInit));
            });
            return true;
        } catch (e) {
            console.error('Mouse simulation failed:', e);
            return false;
        }
    }

    async function switchToListViewRepost() {
        try {
            const listButton = [...document.querySelectorAll('div[aria-label="Tampilan Daftar"]')]
            .find(btn => isVisibleRepost(btn) && btn.getAttribute('aria-pressed') === 'false');

            if (listButton) {
                humanLikeClickRepost(listButton);
                log("📃 Beralih ke Tampilan Daftar...");
                await sleep(1000);
                return true;
            }
            return false;
        } catch (e) {
            log(`⚠️ Gagal beralih ke tampilan daftar: ${e.message}`);
            return false;
        }
    }

    function executeClickRepost(elem) {
        if (!elem) return false;
        const rect = elem.getBoundingClientRect();
        const mouseEventInit = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + rect.width/2,
            clientY: rect.top + rect.height/2
        };

        ['mousedown', 'mouseup', 'click'].forEach(type => {
            elem.dispatchEvent(new MouseEvent(type, mouseEventInit));
        });
        return true;
    }

    async function countListingsRepost() {
        const selectors = [
            '[data-testid="marketplace_your_listing_card"]',
            'div.x1lliihq.x1n2onr6.x1jchvi3',
            'div[role="article"]'
        ];
        for (const selector of selectors) {
            const listings = document.querySelectorAll(selector);
            if (listings.length > 0) return listings.length;
        }
        return 0;
    }

    function findParentListingRepost(element) {
        const selectors = [
            'div[data-testid="marketplace_your_listing_card"]',
            'div.x1lliihq.x1n2onr6.x1jchvi3',
            'div[role="article"]',
            'div.x1qjc9v5.x78zum5.x1q0g3np.x1a02dak.x1qughib'
        ];
        for (const selector of selectors) {
            const parent = element.closest(selector);
            if (parent) return parent;
        }
        return element.closest('div[role="button"]') ||
            element.closest('a[href*="/marketplace/item/"]');
    }

    async function comprehensiveButtonScanRepost() {
        const scanMethods = [
            () => document.querySelectorAll('div[aria-label="Hapus & Tawarkan Ulang"]'),
            () => document.querySelectorAll('span:contains("Hapus & Tawarkan Ulang")'),
            () => {
                const xpath = "//*[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'hapus & tawarkan ulang')]";
                const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                const elements = [];
                for (let i = 0; i < result.snapshotLength; i++) {
                    elements.push(result.snapshotItem(i));
                }
                return elements;
            },
            () => document.querySelectorAll('div.x1i10hfl.xjbqb8w.x6umtig') // Common FB button class
        ];

        const allButtons = new Set();
        const now = Date.now();

        for (const method of scanMethods) {
            try {
                const buttons = method();
                for (const btn of buttons) {
                    try {
                        // Skip buttons processed in the last 5 minutes to handle Facebook re-rendering
                        const processedTime = btn.getAttribute('data-processed-time');
                        if (processedTime && (now - parseInt(processedTime)) < 300000) {
                            continue;
                        }

                        if (btn.textContent &&
                            btn.textContent.toLowerCase().includes('hapus') &&
                            btn.textContent.toLowerCase().includes('tawarkan ulang')) {
                            allButtons.add(btn);
                        }
                    } catch (e) {
                        console.log('Error processing button:', e);
                    }
                }
            } catch (e) {
                console.log(`Scan method error: ${e.message}`);
            }
        }

        return Array.from(allButtons);
    }
    // ====== END OF startRepostSequence() ====== //
    // ====== START OF startManualSequence() ====== //
    async function startManualSequence() {
        let successCount = 0;
        let totalProcessed = 0;
        try {
            const searchText = document.getElementById("dynamicInput").value.trim().toLowerCase();
            config.coolDown = parseInt(document.getElementById("coolDown").value) || 5;
            log(`🧭 Memulai Mode Manual - mencari teks: "${searchText}"`);

            if (!searchText) {
                log("⚠️ Input 'Cari teks' kosong! Silakan isi terlebih dahulu.");
                resetToggleUI();
                return;
            }

            if (!(await switchToListViewRepost())) {
                log("⚠️ Gagal beralih ke tampilan daftar, melanjutkan dengan tampilan saat ini");
            }

            let consecutiveFailures = 0;
            let foundElements = [];

            while (config.running) {
                // Cari elemen dengan teks yang cocok
                const stockElements = findStockElements(searchText);

                if (stockElements.length === 0) {
                    log(`❌ Tidak menemukan teks "${searchText}" di halaman ini.`);
                    consecutiveFailures++;

                    // scroll terus ke bawah sampai ketemu
                    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
                    log("📜 Scroll ke bawah mencari listing berikutnya...");
                    await sleep(1500);

                    // kalau sudah di bawah, naik lagi dan ulang
                    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                        log("🚧 Sudah di bawah halaman, kembali ke atas untuk ulang pencarian...");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        await sleep(2000);
                    }

                    continue; // ulangi pencarian lagi
                }

                consecutiveFailures = 0; // reset kalau ketemu
                log(`✅ Ditemukan ${stockElements.length} listing dengan teks "${searchText}"`);

                // proses SEMUA listing yang ditemukan di halaman
                for (const targetElement of stockElements) {
                    if (!config.running) break;

                    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    await sleep(1000);

                    const listingCard = findParentListingCard(targetElement);
                    if (!listingCard) {
                        log("⚠️ Tidak dapat menemukan card listing terkait");
                        continue;
                    }

                    const ellipsisBtn = findEllipsisButton(listingCard);
                    if (!ellipsisBtn || !isClickable(ellipsisBtn)) {
                        log("⚠️ Tombol menu ellipsis tidak ditemukan atau tidak dapat diklik");
                        continue;
                    }

                    executeClick(ellipsisBtn);
                    log("📌 Membuka menu ellipsis...");
                    await delayDinamis({
                        checkFn: () => !!findFirstMenuItem(),
                    });

                    const firstBtn = findFirstMenuItem();
                    let firstLabel = "";
                    if (firstBtn) {
                        firstLabel = normalizeLabel(firstBtn.innerText || firstBtn.textContent).toLowerCase().trim();
                    }

                    if (firstBtn && firstLabel.includes("perbarui penawaran")) {
                        const clickable = getClickableAncestor(firstBtn) || firstBtn;
                        executeClick(clickable);
                        log("🔄 Memperbarui penawaran...");

                        const matchTextElem = Array.from(listingCard.querySelectorAll("span"))
                        .find(el => el.textContent.toLowerCase().includes(searchText));
                        if (matchTextElem) {
                            matchTextElem.textContent = "✅ Diperbarui";
                            matchTextElem.style.color = "#00ff00";
                            matchTextElem.style.fontWeight = "bold";
                        }

                        successCount++;
                        totalProcessed++;
                    } else {
                        log("⏩ Tombol pertama bukan 'Perbarui penawaran', skip...");
                        if (ellipsisBtn && isClickable(ellipsisBtn)) executeClick(ellipsisBtn);

                        const matchTextElem = Array.from(listingCard.querySelectorAll("span"))
                        .find(el => el.textContent.toLowerCase().includes(searchText));
                        if (matchTextElem) {
                            matchTextElem.textContent = "⚠️ Skipped";
                            matchTextElem.style.color = "#ff9900";
                            matchTextElem.style.fontWeight = "bold";
                        }

                        totalProcessed++;
                    }

                    // Cooldown antar listing
                    const waitingMsg = getAIResponse("waiting");
                    log(`${waitingMsg} (${config.coolDown} detik)...`);
                    for (let s = 1; s <= config.coolDown; s++) {
                        if (!config.running) {
                            log("🛑 PROSES Dihentikan oleh pengguna.");
                            return;
                        }
                        log(`🕒 ${s}`);
                        await sleep(1000);
                    }
                }

                // scroll lagi setelah selesai satu batch
                log("📜 Scroll ke bawah mencari batch berikutnya...");
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
                await sleep(1500);
            }

            log("✅ Proses Manual Selesai (semua listing ditemukan sudah diproses).");
            resetToggleUI();

        } catch (e) {
            if (e.message === "TERMINATED") {
                log("🛑 PROSES DIHENTIKAN LANGSUNG OLEH PENGGUNA");
            } else {
                log(`❌ ERROR: ${e.message}`);
                console.error(e);
            }
        } finally {
            log(`📊 Ringkasan: ${successCount} listing diperbarui dari ${totalProcessed} yang diproses.`);
            resetToggleUI();
        }
    }

    // ====== HELPER FUNCTIONS startManualSequence() ====== //
    function getMenuContainers() {
        // Ambil semua kandidat container menu; ambil yang terakhir (biasanya overlay terbaru)
        return Array.from(document.querySelectorAll('[role="menu"], [role="dialog"]')).filter(isVisible);
    }

    function findUpdateButton() {
        // Look for "Perbarui penawaran" in the popup menu
        const menus = Array.from(document.querySelectorAll('[role="menu"], [role="dialog"]'));
        for (const menu of menus) {
            if (!isVisible(menu)) continue;

            const buttons = Array.from(menu.querySelectorAll('div, span'));
            const updateBtn = buttons.find(el => el.textContent.trim() === "Perbarui penawaran");
            if (updateBtn) return updateBtn;
        }
        return null;
    }

    function findFirstMenuItem() {
        const menus = getMenuContainers();
        if (!menus.length) return null;

        const menu = menus[menus.length - 1]; // menu yang paling baru muncul
        // kandidat item yang bisa diklik (bukan wrapper/separator)
        let items = Array.from(menu.querySelectorAll('[role="menuitem"], [role="button"], [tabindex]'))
        .filter(el => isVisible(el));

        // Filter hanya yang punya label text yang valid
        items = items.filter(el => normalizeLabel(el.innerText || el.textContent));

        if (!items.length) return null;

        // Urutkan secara visual: paling atas, lalu paling kiri
        items.sort((a, b) => {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            if (ra.top !== rb.top) return ra.top - rb.top;
            return ra.left - rb.left;
        });

        return items[0] || null;
    }

    function getClickableAncestor(el) {
        return el.closest('[role="menuitem"], [role="button"], [tabindex]:not([tabindex="-1"])') || el;
    }

    function isClickable(element) {
        if (!element || !isVisible(element)) return false;
        try {
            const style = window.getComputedStyle(element);
            return !(style.pointerEvents === 'none' ||
                     style.cursor === 'not-allowed' ||
                     parseFloat(style.opacity) < 0.6 ||
                     element.disabled);
        } catch (e) {
            console.log('Error checking clickable:', e);
            return false;
        }
    }

    function isVisible(elem) {
        if (!elem) return false;
        const style = window.getComputedStyle(elem);
        return style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            elem.offsetWidth > 0 &&
            elem.offsetHeight > 0 &&
            elem.getClientRects().length;
    }

    function findStockElements(searchText = "Stok Ada") {
        const containers = Array.from(document.querySelectorAll('div.x12nagc'));

        const matched = containers.flatMap(container => {
            const spans = Array.from(container.querySelectorAll('span'));
            return spans.filter(span => {
                const text = span.textContent?.trim().toLowerCase() || "";
                return text.includes(searchText.toLowerCase());
            });
        });

        return matched.filter(isVisible);
    }

    function findEllipsisButton(listingCard) {
        // Multiple ways to find the ellipsis button
        const possibleSelectors = [
            'div[aria-label^="Opsi lainnya untuk"]',
            'div[aria-label*="More options"]',
            '[aria-haspopup="menu"]',
            'div[role="button"] svg' // Ellipsis icon
        ];

        for (const selector of possibleSelectors) {
            const button = listingCard.querySelector(selector);
            if (button && isVisible(button)) {
                return button.closest('[role="button"], [aria-haspopup]') || button;
            }
        }

        return null;
    }

    function findParentListingCard(element) {
        // Traverse up the DOM to find the listing card container
        let current = element;
        const maxLevels = 15;
        let levels = 0;

        while (current && levels < maxLevels) {
            // Check for common listing card indicators
            if (current.getAttribute('role') === 'article' ||
                current.classList.toString().includes('marketplace') ||
                current.querySelector('[aria-label^="Opsi lainnya untuk"]') ||
                current.classList.toString().includes('x1daaz14 ') ||
                current.querySelector('[aria-label^="More options"]')
               )
            {
                return current;
            }
            current = current.parentElement;
            levels++;
        }
        return null;
    }
    // ====== END OF startManualSequence() ====== //
    // ====== SRART OF startManualSequence() ====== //

    async function startScrollSequence() {
        try {
            log("📜 Memulai Scroll Otomatis Mode...");
            while (config.running) {
                window.scrollBy({ top: 2500, behavior: 'smooth' });
                log("Scrolling . . .");
                await sleep(2000);
            }
            log("🛑 Scroll Dihentikan oleh pengguna.");
        } catch (e) {
            if (e.message === "TERMINATED") {
                log("🛑 SCROLL MODE DIHENTIKAN LANGSUNG OLEH PENGGUNA");
            } else {
                log(`❌ ERROR (Scroll Mode): ${e.message}`);
            }
        }
    }


    // Activation Protocol
    (function waitForPageReady() {
        if (document.readyState !== 'complete') {
            return setTimeout(waitForPageReady, 500);
        }

        createTerminatorUI();
        log("SYSTEM ONLINE");
        log("MENUNGGU PERINTAH");

    })();
    window.createTerminatorUI = createTerminatorUI;
    window.startTerminationSequence = startTerminationSequence;
    window.startUpdateSequence = startUpdateSequence;
    window.startRepostSequence = startRepostSequence;
    window.startManualSequence = startManualSequence;
    window.startScrollSequence = startScrollSequence;
    window.log = log;
})();
