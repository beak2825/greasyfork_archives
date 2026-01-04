// ==UserScript==
// @name         Auto Delete Listing
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  FBMP AUTO DELETE LISTING
// @author       Behesty
// @match        https://www.facebook.com/marketplace/you/selling?order=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542919/Auto%20Delete%20Listing.user.js
// @updateURL https://update.greasyfork.org/scripts/542919/Auto%20Delete%20Listing.meta.js
// ==/UserScript==

console.log("🧪 [FBMP Terminator] Script loaded.");
(function() {
    'use strict';

    // Mission Control Configuration
    const config = {
        running: false,
        cycle: 0,
        maxCycles: 50,
        coolDown: 5,
        stealthMode: true,
        aiBehavior: "random", // "random", "sold", "unsold", "no_answer"
        maxFailures: 3,
        version: "1.2"
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

    // Tactical UI Elements
    function createTerminatorUI() {
        const panel = document.createElement('div');
        panel.id = 'terminator-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 9999;
            padding: 15px;
            background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
            border-radius: 10px;
            color: #ffffff;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            border: 1px solid #00ff00;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
        `;

        panel.innerHTML = `
            <h3 style="margin-top:0;border-bottom:1px solid #fff;padding-bottom:5px;color:#fff;text-align: center;">
                Listing Manager v${config.version}
            </h3>
            <div style="margin-bottom:10px;">
                <label style="color:#fff;">Listing yang dihapus: <input type="number" id="maxCycles" value="${config.maxCycles}" style="width:60px;background:#111;color:#0f0;border:1px solid #333;"></label><br>
                <label style="color:#fff;">Cool Down: <input type="number" id="coolDown" value="${config.coolDown}" style="width:60px;background:#111;color:#0f0;border:1px solid #333;">s</label><br>
                <label style="display:block;margin-top:5px;color:#fff;">
                    <input type="checkbox" id="stealthMode" ${config.stealthMode ? 'checked' : ''}> Stealth Mode
                </label>
                <select id="aiBehavior" style="margin-top:5px;background:#111;color:#0f0;border:1px solid #333;width:100%">
                    <option value="random">Random Behavior</option>
                    <option value="sold">Mark as Sold</option>
                    <option value="unsold">Mark as Unsold</option>
                    <option value="no_answer">No Answer</option>
                </select>
                    <select id="operationMode" style="margin-top:5px;background:#111;color:#0f0;border:1px solid #333;width:100%">
                    <option value="terminator">TERMINATOR MODE</option>
                </select>
            </div>
            <button id="toggleButton" style="background:linear-gradient(180deg, #00cc00 0%, #009900 100%);border:none;color:white;padding:5px 10px;border-radius:3px;cursor:pointer;font-weight:bold;">
                ▶ START
            </button>
            <div style="margin-top:10px;font-size:12px;">
                Status: <span id="statusIndicator" style="color:#ff0;">STANDBY</span>
            </div>
            <textarea id="terminator-log" rows="10" cols="35" readonly style="width:100%;resize:none;background:#111;color:#fff;border:1px solid #333;margin-top:10px;font-family:monospace;"></textarea>
        `;

        const style = document.createElement('style');
        style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.98); }
        100% { transform: scale(1); }
    }
`;

        document.body.appendChild(panel);

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
                log(`MODE: ${mode.toUpperCase()}`);

                if (mode === 'terminator') {
                    startTerminationSequence();
                }
//                else if (mode === 'repost') {
//                    startRepostSequence(); // ← pastikan kamu membuat fungsi ini
//                }
//            else if (mode === 'update') {
//                   startUpdateSequence(); // ← pastikan kamu membuat fungsi ini
//                }
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

    }

        // ====== GENERAL HELPER FUNCTIONS ====== //

    // Stealth Operations
    function getRandomDelay() {
        return config.stealthMode ?
            1000 + Math.random() * 2000 : // Random delay between 1-5s in stealth mode
        500 + Math.random() * 700; // Faster operation when stealth is off
    }

    // Mission Logging System
    function log(message) {
        const logBox = document.getElementById('terminator-log');
        if (logBox) {
            const timestamp = new Date().toLocaleTimeString();
            logBox.value += `[${timestamp}] ${message}\n`;
            logBox.scrollTop = logBox.scrollHeight;
        }
    }

    async function sleep(ms) {
        for (let i = 0; i < ms; i += 200) {
            if (!config.running) throw new Error("TERMINATED");
            await new Promise(resolve => setTimeout(resolve, 200));
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

    function humanLikeClick(elem) {
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

    // ====== HELPER FUNCTIONS OF TERMINATOR ====== //

    function getAIResponse(type) {
        const responses = aiResponses[type];
        return responses[Math.floor(Math.random() * responses.length)];
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

    async function engageElement(text, tag = 'span') {
        const elements = Array.from(document.querySelectorAll(tag));
        const lowerText = text.toLowerCase();

        const target = elements.find(el => {
            const match = el.textContent.trim().toLowerCase() === lowerText;
            const visible = isVisible(el);
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

    async function engageDeleteConfirmation() {
        // Cari semua tombol "Hapus" yang terlihat
        const candidates = Array.from(document.querySelectorAll('div[role="dialog"] span'))
        .filter(span => span.textContent.trim() === "Hapus" && isVisible(span));

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
        await sleep(1000);
        return true;
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

    function findZeroClickListingButton() {
        // Temukan semua elemen yang berisi teks "0 klik tawaran"
        const zeroClickElements = Array.from(document.querySelectorAll("div.x78zum5.x1q0g3np.xg7h5cd"))
        .filter(el => el.textContent.includes("0 klik tawaran"));

        for (const el of zeroClickElements) {
            // Naik ke atas sampai container listing
            let current = el;
            for (let i = 0; i < 10; i++) {
                if (!current) break;
                if (current.querySelector("div[aria-label^='Opsi lainnya untuk']")) {
                    const ellipsisBtn = current.querySelector("div[aria-label^='Opsi lainnya untuk']");
                    if (ellipsisBtn) return ellipsisBtn;
                }
                current = current.parentElement;
            }
        }
        // Jika tidak ada tombol ⋯ ditemukan dalam listing dengan 0 klik tawaran
        return null;
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

    // ====== START OF startTerminationSequence() ====== //
    async function startTerminationSequence() {
        try {
            config.maxCycles = parseInt(document.getElementById("maxCycles").value) || 50;
            config.coolDown = parseInt(document.getElementById("coolDown").value) || 5;
            log("Cooldown dari input:", config.coolDown);

            log(`Memulai Urutan Penghapusan - ${config.maxCycles} TARGETS`);
            log(`STRATEGY: ${config.aiBehavior.toUpperCase()} | STEALTH: ${config.stealthMode ? 'ON' : 'OFF'}`);

            // Beralih ke Tampilan Daftar (List View)
            const listButton = [...document.querySelectorAll('div[aria-label="Tampilan Daftar"]')].find(isVisible);
            if (listButton && listButton.getAttribute('aria-pressed') === 'false') {
                humanLikeClick(listButton);
                log("📃 Beralih ke Tampilan Daftar...");
                await sleep(1000);
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
                    .find(span => span.textContent.trim() === "Berikutnya" && isVisible(span));

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
                    .find(span => span.textContent.trim() === "Berikutnya" && isVisible(span));

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
            //        log("ALL TARGETS NEUTRALIZED OR MISSION ABORTED");
        } catch (e) {
            if (e.message === "TERMINATED") {
                log("🛑 PROSES DIHENTIKAN LANGSUNG OLEH PENGGUNA");
            } else {
                log(`❌ ERROR: ${e.message}`);
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
//window.startUpdateSequence = startUpdateSequence;
//window.startRepostSequence = startRepostSequence;
window.log = log;
})();