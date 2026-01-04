// ==UserScript==
// @name         Twitter Retweet Temizleyici
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Twitter'da retweet'leri otomatik olarak siler, hızı ayarlar ve istatistikleri gösterir.
// @author       odk-0160
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524754/Twitter%20Retweet%20Temizleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/524754/Twitter%20Retweet%20Temizleyici.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Panel HTML'i
    const panelHTML = `
    <div id="retweetCleanerPanel" style="position: fixed; top: 10px; right: 10px; background: var(--background-color, #ffffff); padding: 15px; border: 1px solid var(--border-color, #e1e8ed); border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); z-index: 1000; font-family: 'TwitterChirp', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: var(--text-color, #000000); width: 320px;">
        <h3 style="margin: 0 0 15px; font-size: 16px; font-weight: 700; color: var(--text-color, #000000);">Retweet Temizleyici</h3>
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button id="startButton" style="flex: 1; padding: 8px 12px; background: #1DA1F2; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;">Başlat</button>
            <button id="stopButton" style="flex: 1; padding: 8px 12px; background: #ff4b4b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s;">Durdur</button>
        </div>
        <div style="margin-bottom: 15px;">
            <label for="limitInput" style="font-size: 14px; color: var(--text-secondary, #657786);">Kaç RT silinsin? (Boş bırakılırsa sınır yok):</label>
            <input id="limitInput" type="number" min="1" placeholder="Boş bırakın" style="width: 100%; padding: 5px; border-radius: 8px; border: 1px solid var(--border-color, #e1e8ed); background: var(--background-color, #ffffff); color: var(--text-color, #000000);">
        </div>
        <div style="margin-bottom: 15px;">
            <label for="speedInput" style="font-size: 14px; color: var(--text-secondary, #657786);">Hız (ms cinsinden):</label>
            <input id="speedInput" type="number" min="500" value="1000" style="width: 100%; padding: 5px; border-radius: 8px; border: 1px solid var(--border-color, #e1e8ed); background: var(--background-color, #ffffff); color: var(--text-color, #000000);">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="font-size: 14px; color: var(--text-secondary, #657786);">İstatistikler:</label>
            <div style="font-size: 14px; color: var(--text-color, #000000);">
                <span>Kaldırılan: <span id="removedCount">0</span></span><br>
                <span>Atlanan: <span id="skippedCount">0</span></span><br>
                <span>Hatalar: <span id="errorCount">0</span></span>
            </div>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="font-size: 14px; color: var(--text-secondary, #657786);">İşlem Logu:</label>
            <div id="logBox" style="height: 100px; overflow-y: auto; background: var(--log-background, #f5f8fa); border: 1px solid var(--border-color, #e1e8ed); border-radius: 8px; padding: 5px; font-size: 12px; color: var(--text-color, #000000);">
                <!-- Log mesajları buraya eklenecek -->
            </div>
        </div>
    </div>
    `;

    // Paneli sayfaya ekle
    document.body.insertAdjacentHTML('afterbegin', panelHTML);

    // Değişkenler
    let isRunning = false;
    let totalUnretweets = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Log mesajı ekleme fonksiyonu
    function addLog(message) {
        const logBox = document.getElementById('logBox');
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logBox.appendChild(logEntry);
        logBox.scrollTop = logBox.scrollHeight; // Otomatik kaydırma
    }

    // Retweet'leri geri alma fonksiyonu
    async function unretweetAll() {
        const limitInput = document.getElementById('limitInput');
        const speedInput = document.getElementById('speedInput');
        const limit = limitInput.value ? parseInt(limitInput.value, 10) : Infinity;
        const speed = parseInt(speedInput.value, 10);

        while (isRunning && totalUnretweets < limit) {
            let unretweetButtons = document.querySelectorAll('[data-testid="unretweet"]');

            if (unretweetButtons.length === 0) {
                addLog("⏭️ Kaldırılacak retweet bulunamadı. Sayfa kaydırılıyor...");
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, speed));
                continue;
            }

            for (const button of unretweetButtons) {
                if (!isRunning || totalUnretweets >= limit) break;

                button.click();
                await new Promise(resolve => setTimeout(resolve, 500));

                const confirmButton = document.querySelector('[data-testid="unretweetConfirm"]');
                if (confirmButton) {
                    confirmButton.click();
                    totalUnretweets++;
                    document.getElementById('removedCount').textContent = totalUnretweets;
                    addLog(`✅ Retweet kaldırıldı. Toplam kaldırılan retweet sayısı: ${totalUnretweets}`);
                } else {
                    skippedCount++;
                    document.getElementById('skippedCount').textContent = skippedCount;
                    addLog("⏭️ Retweet atlandı (onay butonu bulunamadı).");
                }

                await new Promise(resolve => setTimeout(resolve, speed));
            }
        }

        if (isRunning) {
            addLog("🏁 İşlem tamamlandı.");
            isRunning = false;
        }
    }

    // Başlat butonu
    document.getElementById('startButton').addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            addLog("▶️ İşlem başlatıldı.");
            unretweetAll();
        }
    });

    // Durdur butonu
    document.getElementById('stopButton').addEventListener('click', () => {
        if (isRunning) {
            isRunning = false;
            addLog("🛑 İşlem durduruldu.");
        }
    });
})();