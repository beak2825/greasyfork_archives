// ==UserScript==
// @name         AutoBot FBMP Enhanced
// @namespace    http://tampermonkey.net/
// @version      5.0.5
// @description  Perbaikan: stop tidak reload, jika kedua proses 0 berhenti, skip cooldown jika relist=0, dan safeguard pada redirect/countdown
// @author       Behesty
// @match        https://www.facebook.com/marketplace/you/dashboard*
// @match        https://web.facebook.com/marketplace/you/dashboard*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540187/AutoBot%20FBMP%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/540187/AutoBot%20FBMP%20Enhanced.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // ⚙️ Konfigurasi dasar
  // =========================
  let retryInterval = 1000;
  let maxTriesPerRound = 30;
  let maxRetryRounds = 5;
  let maxLoops = 100;

  // =========================
  // 🔁 Status runtime
  // =========================
  let running = true; // toggle oleh tombol STOP/START
  let loopCounter = 0;
  let isLooping = false;

  // =========================
  // 🔕 Skip flags
  // =========================
  let skipRelist = false;
  let skipUpdate = false;

  // =========================
  // 🧰 UI log box
  // =========================
  const logBox = document.createElement('div');
  Object.assign(logBox.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
    fontSize: '12px',
    zIndex: '99999',
    borderRadius: '8px',
    whiteSpace: 'pre-line'
  });
  logBox.innerText = '📢 FB Marketplace Auto Bot (v5.0)\n';
  document.body.appendChild(logBox);

  function log(msg) {
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    const line = `[${time}] ${msg}`;
    console.log('[FBMBot]', line);
    logBox.innerText += line + '\n';
    logBox.scrollTop = logBox.scrollHeight;
  }

  // =========================
  // 🕒 Delay & Countdown helpers
  // - countdown(seconds) -> returns true if completed, false if aborted (running==false)
  // =========================
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  async function countdown(seconds) {
    for (let i = seconds; i > 0; i--) {
      if (!running) {
        log('⏹ Countdown dibatalkan (running=false).');
        return false; // dibatalkan
      }
      log(`⏳ Menunggu ${i} detik...`);
      await delay(1000);
    }
    return true; // selesai normal
  }

  const randomDelay = (min = 500, max = 1500) =>
    delay(Math.floor(Math.random() * (max - min + 1)) + min);

  // =========================
  // 🔍 Wait helpers
  // =========================
  async function waitForElement(selector) {
    for (let round = 1; round <= maxRetryRounds; round++) {
      for (let i = 1; i <= maxTriesPerRound; i++) {
        if (!running) return null;
        const el = document.querySelector(selector);
        if (el && el.offsetHeight > 0) return el;
        await delay(retryInterval);
      }
    }
    return null;
  }

  async function waitForVisibleElements(selector) {
    for (let round = 1; round <= maxRetryRounds; round++) {
      for (let i = 1; i <= maxTriesPerRound; i++) {
        if (!running) return [];
        const els = Array.from(document.querySelectorAll(selector)).filter(e => e.offsetHeight > 0);
        if (els.length > 0) return els;
        await delay(retryInterval);
      }
    }
    return [];
  }

  // =========================
  // 🔎 Find & click link "Untuk dihapus & ditawarkan ulang"
  // =========================
  async function findAndClickRelistButton() {
    log('🔎 Mencari tombol "Tawarkan ulang"...');
    for (let round = 1; round <= maxRetryRounds; round++) {
      if (!running) return false;
      const links = Array.from(document.querySelectorAll('a[role="link"]')).filter(a => a.offsetHeight > 0);
      for (const link of links) {
        const text = link.innerText;
        if (text.includes('Untuk dihapus & ditawarkan ulang')) {
          const count = parseInt(text.match(/\d+/)?.[0] || '0');
          log(`ℹ️ Ditemukan relist link (${count} listing)`);
          if (count < 2) {
            log('✅ Listing terlalu sedikit - dilewati.');
            return false;
          }
          link.scrollIntoView({ behavior: 'smooth', block: 'center' });
          link.click();
          log('📌 Klik link relist.');
          return true;
        }
      }
      await delay(retryInterval);
    }
    log('❌ Tidak menemukan link relist setelah retry.');
    return false;
  }

  // =========================
  // 🔎 Find & click link "Untuk diperbarui"
  // =========================
    async function findAndClickUpdateButton() {
        log('🔎 Mencari tombol "Untuk diperbarui"...');
        for (let round = 1; round <= maxRetryRounds; round++) {
            if (!running) return false;
            const links = Array.from(document.querySelectorAll('a[role="link"]')).filter(a => a.offsetHeight > 0);
            for (const link of links) {
                const text = link.innerText;
                if (text.includes('Untuk diperbarui')) {
                    const count = parseInt(text.match(/\d+/)?.[0] || '0');
                    log(`ℹ️ Ditemukan update link (${count} listing)`);
                    if (count < 2) {
                        log('✅ Listing terlalu sedikit - dilewati.');
                        return false;
                    }
                    link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    link.click();
                    log('📌 Klik link update.');
                    return true;
                }
            }
            await delay(retryInterval);
        }
        log('❌ Tidak menemukan link update setelah retry.');
        return false;
    }

    // =========================
    // 🔘 Klik tombol "Selesai"
    // =========================
    async function clickDoneButton() {
  if (!running) return false;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // wrapper overlay dialog FB
  const getDialogWrapper = () =>
    document.querySelector('div.x1cy8zhl > div[role="dialog"]')?.parentElement || null;

  const isWrapperVisible = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      getComputedStyle(el).visibility !== 'hidden' &&
      getComputedStyle(el).display !== 'none'
    );
  };

  const isDialogClosed = (wrapper) => {
    if (!wrapper) return true;
    if (!wrapper.isConnected) return true;
    if (!isWrapperVisible(wrapper)) return true;
    if (!wrapper.querySelector('div[role="dialog"]')) return true;
    return false;
  };

  async function tryClick(label) {
    const btn = await waitForElement(
      `div[role="button"][aria-label="${label}"]`,
      2000
    );
    if (!btn) {
      log(`⚠️ Tombol "${label}" tidak ditemukan`);
      return false;
    }

    if (!running) return false;

    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    btn.click();
    log(`✅ Klik tombol "${label}"`);
    return true;
  }

  const wrapper = getDialogWrapper();
  if (!wrapper) {
    log('ℹ️ Dialog wrapper tidak ditemukan (sudah tertutup)');
    return true;
  }

  // 1️⃣ SELESAI
  if (await tryClick('Selesai')) {
    await sleep(1500);
    if (isDialogClosed(wrapper)) {
      log('✔️ Dialog tertutup');
      return true;
    }
    log('❌ "Selesai" tidak menutup dialog');
  }

  // 2️⃣ TUTUP
  if (await tryClick('Tutup')) {
    await sleep(2000);
    if (isDialogClosed(wrapper)) {
      log('✔️ Dialog tertutup');
      return true;
    }
    log('❌ "Tutup" tidak menutup dialog');
  }

  // 3️⃣ KEMBALI
  if (await tryClick('Kembali ke halaman sebelumnya.')) {
    await sleep(2000);
    if (isDialogClosed(wrapper)) {
      log('✔️ Dialog tertutup');
      return true;
    }
  }

  log('⛔ Dialog masih benar-benar terbuka');
  return false;
}


//  async function clickDoneButton() {
//    const btn = await waitForElement('div[aria-label="Selesai"]');
//    if (btn) {
//      if (!running) return false;
//      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
//      btn.click();
//      log('✅ Klik tombol "Selesai"');
//      return true;
//    }
//    log('⚠️ Tombol "Selesai" tidak ditemukan.');
//    return false;
//  }

    // =========================
    // // 🔎 Fungsi cek beberapa pesan error (safeguard)
    // Jika ditemukan pesan error ini akan mencoba reload,
    // namun hanya lakukan reload bila running masih true.
    // =========================
    async function checkErrorMessage(selector, ...args) {
        // Argumen terakhir = context (misal: 'Update' atau 'Relist')
        const context = args.pop();
        // Sisanya = daftar kemungkinan teks error
        const messages = args;

        // Cari semua elemen yang cocok dengan selector
        const elements = Array.from(document.querySelectorAll(selector));

        // Cari elemen yang teksnya cocok dengan salah satu pesan error
        const found = elements.find(el => {
            const text = el.textContent.trim();
            return messages.some(msg => text.includes(msg));
        });

        if (found) {
            // Dapat pesan error
            const matchedMsg = messages.find(msg => found.textContent.includes(msg));
            log(`⚠️ Pesan error ditemukan (${context}): "${matchedMsg}"`);

            // Countdown 5 detik sebelum reload
            const ok = await countdown(5);
            if (!running || !ok) return true; // berhenti jika user stop

            // Reload hanya jika script masih aktif
            if (running) {
                window.location.href = 'https://www.facebook.com/marketplace/you/dashboard';
                return true;
            }
        }

        // Tidak ada pesan error ditemukan
        return false;
    }

  // =========================
  // 🔁 runCycle => proses relist lalu update
  // Perubahan penting:
  // - Jika relistClickCounter === 0 -> langsung ke update (tidak countdown 10s)
  // - Jika kedua tombol 0 -> **stop** (running = false) dan tidak reload
  // - Semua redirect countdown selalu periksa running (batal bila stop)
  // - Log setiap klik per tombol
  // =========================
  async function runCycle() {
    if (!running) return;
    loopCounter++;
    log(`🚀 Mulai siklus ${loopCounter}`);
    let didSomething = false;

    let relistClickCounter = 0;
    let updateClickCounter = 0;

    // ----- RELIST (jika tidak di-skip)
    if (!skipRelist) {
      const relistClicked = await findAndClickRelistButton();
      if (relistClicked && running) {
        // tunggu sedikit sebelum mencari tombol tindakan
        await delay(2000);
        const buttons = await waitForVisibleElements('div[aria-label="Hapus & Tawarkan Ulang"]');
        if (buttons.length > 0 && running) {
          for (const [i, btn] of buttons.entries()) {
            if (!running) break;
            try {
              btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
              btn.click();
              relistClickCounter++;
              log(`🟣 Klik Hapus... ke-${relistClickCounter}`);
            } catch (err) {
              console.warn('Error klik relist button', err);
            }
            await randomDelay();
          }
          await clickDoneButton();
          didSomething = didSomething || (relistClickCounter > 0);
        } else {
          // cek pesan error khusus relist
          await checkErrorMessage(
            'span[dir="auto"]',
            'Ini tidak bisa diperbarui lagi, tetapi Anda bisa menawarkan ulang dan menghapus tawaran asli.',
            'Anda tidak lagi memiliki tawaran yang memenuhi syarat untuk dihapus dan ditawarkan ulang.',
            'Anda tidak lagi memiliki tawaran yang memenuhi syarat untuk diperbarui.',
            'Halaman ini saat ini tidak tersedia',
            'Relist'
          );
        }
      }
    } else {
      log('⏭️ Relist dilewati (skipRelist aktif).');
    }

    // Jika relistClickCounter === 0, tidak perlu countdown 10s -> langsung ke update
    if (relistClickCounter === 0) {
      log('ℹ️ Relist = 0 → proses Update.');
    } else {
      // Hanya lakukan cooldown antar proses jika relistClickCounter > 0 AND update tidak di-skip
      if (!skipUpdate) {
        log('⏳ Cooldown: 5 detik...');
        const ok = await countdown(5);
        if (!ok || !running) {
          log('⏹ Cooldown antar proses dibatalkan.');
          // jika dibatalkan karena stop, keluar siklus
          if (!running) return;
        }
      } else {
        log('ℹ️ Update di-skip,');
      }
    }

    // ----- UPDATE (jika tidak di-skip)
    if (!skipUpdate) {
      const updateClicked = await findAndClickUpdateButton();
      if (updateClicked && running) {
        await delay(2000);
        const buttons = await waitForVisibleElements('div[aria-label="Perbarui"]');
        if (buttons.length > 0 && running) {
          for (const [i, btn] of buttons.entries()) {
            if (!running) break;
            try {
              btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
              btn.click();
              updateClickCounter++;
              log(`🟢 Klik Perbarui ke-${updateClickCounter}`);
            } catch (err) {
              console.warn('Error klik update button', err);
            }
            await randomDelay();
          }
          await clickDoneButton();
          didSomething = didSomething || (updateClickCounter > 0);
        } else {
          await checkErrorMessage(
            'span[dir="auto"]',
            'Ini tidak bisa diperbarui lagi, tetapi Anda bisa menawarkan ulang dan menghapus tawaran asli.',
            'Anda tidak lagi memiliki tawaran yang memenuhi syarat untuk dihapus dan ditawarkan ulang.',
            'Anda tidak lagi memiliki tawaran yang memenuhi syarat untuk diperbarui.',
            'Halaman ini saat ini tidak tersedia',
            'Update'
          );
        }
      }
    } else {
      log('⏭️ Update dilewati (skipUpdate aktif).');
    }

    // ----- Ringkasan siklus
    log(`📊 Hasil siklus ${loopCounter} → Relist klik: ${relistClickCounter} | Update klik: ${updateClickCounter}`);

    // ----- Jika kedua tombol = 0 -> STOP (tidak reload)
    if (relistClickCounter === 0 && updateClickCounter === 0) {
      log('⛔ Semua 0 klik. Menghentikan script.');
      running = false;
      return;
    }

    // ----- Logika skip: bila <20 -> set skip flag
    skipRelist = relistClickCounter < 20;
    skipUpdate = updateClickCounter < 20;

    // Jika kedua proses < 20 tapi bukan 0-0, perilaku sebelumnya adalah reload.
    // Jika kamu ingin tetap reload saat keduanya <20 (tapi bukan 0-0), biarkan.
    // Sekarang kita akan melakukan reload hanya jika BOTH <20 **dan** setidaknya salah satu >0.
    if (skipRelist && skipUpdate && (relistClickCounter > 0 || updateClickCounter > 0)) {
      log('🔁 Reload untuk menyegarkan.');
      const ok = await countdown(20);
      if (!ok || !running) {
        log('⏹ Reload dibatalkan karena stop.');
        return;
      }
      if (running) {
        window.location.href = 'https://www.facebook.com/marketplace/you/dashboard';
        return;
      } else {
        return;
      }
    }

    // Jika tidak ada aksi sama sekali (didSomething false), hentikan
    if (!didSomething) {
      log('✅ Tidak ada aksi tersisa. Menghentikan script.');
      running = false;
      return;
    }

    log('✅ Siklus selesai — menuju cooldown');
  }

  // =========================
  // 🔂 mainLoop: mengulang runCycle + cooldown antar siklus 20s
  // =========================
  async function mainLoop() {
    if (isLooping) return;
    isLooping = true;

    while (running && loopCounter < maxLoops) {
      await runCycle();
      if (!running) break;
      log('⏳ Cooldown antar siklus: menunggu 20 detik...');
      const ok = await countdown(20);
      if (!ok) break; // dibatalkan oleh stop
    }

    isLooping = false;

    // Jika mencapai maxLoops dan masih running => reload (sebagai safety)
    if (loopCounter >= maxLoops && running) {
      log(`🔄 Maksimum ${maxLoops} siklus tercapai. Reload halaman...`);
      await delay(2000);
      if (running) window.location.href = 'https://www.facebook.com/marketplace/you/dashboard';
    } else {
      log('🛑 mainLoop berhenti.');
    }
  }

  // =========================
  // 🧭 UI Controls: Start/Stop + maxLoop input (diperbaiki toggle)
  // =========================
  function createUIControls() {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position: 'fixed',
      bottom: '35px',
      left: '20px',
      zIndex: 100000,
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    });

    const btn = document.createElement('button');
    btn.innerText = '⏹ STOP';
    Object.assign(btn.style, {
      padding: '12px 70px',
      background: '#333',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    });

    const input = document.createElement('input');
    input.type = 'number';
    input.value = maxLoops;
    input.min = 1;
    input.max = 1000;
    input.style.fontSize = '15px';
    input.style.width = '60px';
    input.style.height = '35px';
    input.title = 'Max Loop';

    input.onchange = () => {
      maxLoops = parseInt(input.value) || 100;
      log(`🔧 maxLoops diubah menjadi ${maxLoops}`);
    };

    btn.onclick = async () => {
      // Toggle running
      if (running) {
        // sedang jalan → stop
        running = false;
        btn.innerText = '▶️ START';
        log('⏹ Script dihentikan oleh pengguna.');
      } else {
        // sedang stop → start ulang
        running = true;
        btn.innerText = '⏹ STOP';
        loopCounter = 0;
        skipRelist = false;
        skipUpdate = false;
        log('▶️ Script dijalankan kembali dari awal.');
        if (!isLooping) mainLoop();
      }
    };

    wrapper.appendChild(btn);
    wrapper.appendChild(input);
    document.body.appendChild(wrapper);
  }

  // =========================
  // ▶️ Auto-start setelah halaman siap
  // =========================
  setTimeout(() => {
    createUIControls();
    mainLoop();
  }, 2000);
})();
