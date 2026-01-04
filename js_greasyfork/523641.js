// ==UserScript==
// @name         Twitter Gelişmiş Tweet Silme Aracı
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Twitter'da belirli bir kullanıcı adı, kelime ve tarih aralığına göre tweet'leri siler, gelişmiş filtreleme, otomatik kaydırma, işlem geçmişi, hata yönetimi ve işlem hızı ayarlama özelliği içerir.
// @author       odk-0160
// @match        *://twitter.com/*
// @match        *://x.com/*
// @match        *://mobile.twitter.com/*
// @match        *://mobile.x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523641/Twitter%20Geli%C5%9Fmi%C5%9F%20Tweet%20Silme%20Arac%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/523641/Twitter%20Geli%C5%9Fmi%C5%9F%20Tweet%20Silme%20Arac%C4%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Yeni Panel HTML'i
    const panelHTML = `
    <div id="tweetDeletePanel" style="position: fixed; top: 10px; right: 10px; background: var(--background-color, #ffffff); padding: 10px; border: 1px solid var(--border-color, #e1e8ed); border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); z-index: 1000; font-family: 'TwitterChirp', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: var(--text-color, #000000); width: 280px;">
        <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: var(--text-color, #000000);">Gelişmiş Tweet Silme Aracı</h3>
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <input type="text" id="usernameInput" placeholder="Kullanıcı Adı" style="flex: 1; padding: 6px 10px; border: 1px solid var(--border-color, #e1e8ed); border-radius: 6px; background: var(--background-color, #ffffff); color: var(--text-color, #000000); font-size: 12px;">
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <input type="text" id="keywordInput" placeholder="Kelime (Opsiyonel)" style="flex: 1; padding: 6px 10px; border: 1px solid var(--border-color, #e1e8ed); border-radius: 6px; background: var(--background-color, #ffffff); color: var(--text-color, #000000); font-size: 12px;">
        </div>

        <!-- Tarih Aralığı Seçme -->
        <div style="margin-bottom: 10px;">
            <label style="font-size: 12px; color: var(--text-secondary, #657786);">Tarih Aralığı:</label>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                <input type="date" id="startDateInput" style="flex: 1; padding: 6px 10px; border: 1px solid var(--border-color, #e1e8ed); border-radius: 6px; background: var(--background-color, #ffffff); color: var(--text-color, #000000); font-size: 12px;">
                <input type="date" id="endDateInput" style="flex: 1; padding: 6px 10px; border: 1px solid var(--border-color, #e1e8ed); border-radius: 6px; background: var(--background-color, #ffffff); color: var(--text-color, #000000); font-size: 12px;">
            </div>
        </div>

        <!-- Silme Hızı Ayarları -->
        <div style="margin-bottom: 10px;">
            <label for="deleteSpeedInput" style="font-size: 12px; color: var(--text-secondary, #657786);">Silme Hızı (ms):</label>
            <input id="deleteSpeedInput" type="number" min="500" value="1000" style="width: 100%; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color, #e1e8ed); background: var(--background-color, #ffffff); color: var(--text-color, #000000); font-size: 12px;">
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <button id="applySpeedButton" style="flex: 1; padding: 6px 10px; background: #1DA1F2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.2s;">Hızı Uygula</button>
        </div>

        <!-- Arama Butonu -->
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <button id="searchButton" style="flex: 1; padding: 6px 10px; background: #1DA1F2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.2s;">Arama Yap</button>
        </div>

        <!-- Silme ve Durdurma Butonları -->
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <button id="deleteButton" style="flex: 1; padding: 6px 10px; background: #1DA1F2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.2s;">Tweetleri Sil</button>
            <button id="stopButton" style="flex: 1; padding: 6px 10px; background: #ff4b4b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.2s;">İşlemi Durdur</button>
        </div>

        <!-- Hariç Tutulan Tweetler -->
        <div style="margin-bottom: 10px;">
            <label style="font-size: 12px; color: var(--text-secondary, #657786);">Hariç Tutulan Tweetler:</label>
            <div id="excludeList" style="height: 80px; overflow-y: auto; background: var(--log-background, #f5f8fa); border: 1px solid var(--border-color, #e1e8ed); border-radius: 6px; padding: 5px; font-size: 11px; color: var(--text-color, #000000);"></div>
        </div>

        <!-- İşlem Geçmişi -->
        <div style="margin-bottom: 10px;">
            <label style="font-size: 12px; color: var(--text-secondary, #657786);">İşlem Geçmişi:</label>
            <div id="historyList" style="height: 80px; overflow-y: auto; background: var(--log-background, #f5f8fa); border: 1px solid var(--border-color, #e1e8ed); border-radius: 6px; padding: 5px; font-size: 11px; color: var(--text-color, #000000);"></div>
        </div>

        <!-- Log Çıktısı -->
        <div style="margin-bottom: 10px;">
            <label style="font-size: 12px; color: var(--text-secondary, #657786);">İşlem Logu:</label>
            <div id="logOutput" style="height: 80px; overflow-y: auto; background: var(--log-background, #f5f8fa); border: 1px solid var(--border-color, #e1e8ed); border-radius: 6px; padding: 5px; font-size: 11px; color: var(--text-color, #000000);"></div>
        </div>
    </div>
    `;

    // Paneli sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Logları panele yazdırma fonksiyonu
    function logToPanel(message) {
        const logOutput = document.getElementById('logOutput');
        logOutput.innerHTML += `<div>${message}</div>`;
        logOutput.scrollTop = logOutput.scrollHeight; // Otomatik kaydırma
    }

    // Hariç tutulacak ID'leri saklamak için dizi
    let excludeIds = [];

    // İşlem geçmişi
    let deletionHistory = [];

    // Silme hızı (varsayılan değer)
    let deleteSpeed = 1000; // Silme hızı (ms)

    // Tarih aralığı (varsayılan değerler)
    let startDate = null;
    let endDate = null;

    // Hız ayarlarını uygula butonu tıklama işlemi
    document.getElementById('applySpeedButton').addEventListener('click', () => {
        const newDeleteSpeed = parseInt(document.getElementById('deleteSpeedInput').value, 10);

        if (isNaN(newDeleteSpeed) || newDeleteSpeed < 0) {
            alert("Lütfen geçerli bir hız değeri girin!");
            return;
        }

        deleteSpeed = newDeleteSpeed;
        logToPanel(`⚡ Silme hızı güncellendi: ${deleteSpeed}ms`);
    });

    // Tarih aralığını güncelleme fonksiyonu
    function updateDateRange() {
        const startDateInput = document.getElementById('startDateInput').value;
        const endDateInput = document.getElementById('endDateInput').value;

        startDate = startDateInput ? new Date(startDateInput) : null;
        endDate = endDateInput ? new Date(endDateInput) : null;

        if (startDate && endDate && startDate > endDate) {
            alert("Başlangıç tarihi, bitiş tarihinden büyük olamaz!");
            return;
        }

        logToPanel(`📅 Tarih aralığı güncellendi: ${startDate ? startDate.toLocaleDateString() : 'Sınırsız'} - ${endDate ? endDate.toLocaleDateString() : 'Sınırsız'}`);
    }

    // Tarih aralığı input'larını dinle
    document.getElementById('startDateInput').addEventListener('change', updateDateRange);
    document.getElementById('endDateInput').addEventListener('change', updateDateRange);

    // Arama butonu tıklama işlemi
    document.getElementById('searchButton').addEventListener('click', () => {
        const username = document.getElementById('usernameInput').value.trim();
        const keyword = document.getElementById('keywordInput').value.trim();
        const startDateInput = document.getElementById('startDateInput').value;
        const endDateInput = document.getElementById('endDateInput').value;

        if (!username) {
            alert("Lütfen kullanıcı adı girin!");
            return;
        }

        // Arama URL'sini oluştur ve yönlendir
        let searchURL = `https://x.com/search?q=from%3A${username}`;
        if (keyword) searchURL += `+${encodeURIComponent(keyword)}`;
        if (startDateInput) searchURL += `+since%3A${startDateInput}`;
        if (endDateInput) searchURL += `+until%3A${endDateInput}`;
        searchURL += "&f=live"; // En son gönderiler için
        window.location.href = searchURL;
    });

    // Silme işlemini durdurma değişkeni
    let isStopped = false;

    // Tweet silme fonksiyonu (Otomatik Kaydırma)
    async function deleteTweets() {
        let totalDeleted = 0;

        while (!isStopped) {
            try {
                const tweets = document.querySelectorAll('[data-testid="tweet"]');
                let foundTweetToDelete = false;

                for (const tweet of tweets) {
                    if (isStopped) break; // İşlem durdurulduysa döngüyü kır

                    const tweetLink = tweet.querySelector('a[href*="/status/"]');
                    const tweetId = tweetLink?.href.split('/status/')[1];
                    const tweetDate = tweet.querySelector('time')?.datetime;
                    const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.innerText;

                    // Hariç tutulacak ID kontrolü
                    if (tweetId && excludeIds.includes(tweetId)) {
                        logToPanel(`🚫 Hariç tutulan tweet atlandı: ${tweetId}`);
                        continue;
                    }

                    // Tarih aralığı kontrolü
                    if (tweetDate) {
                        const tweetDateObj = new Date(tweetDate);
                        if (startDate && tweetDateObj < startDate) continue;
                        if (endDate && tweetDateObj > endDate) continue;
                    }

                    // Kelime kontrolü
                    const keyword = document.getElementById('keywordInput').value.trim();
                    if (keyword && tweetText && !tweetText.includes(keyword)) continue;

                    const menuButton = tweet.querySelector('[data-testid="caret"]');
                    if (menuButton) {
                        menuButton.click();
                        await new Promise(resolve => setTimeout(resolve, deleteSpeed));

                        const deleteButton = await findDeleteButton();
                        if (deleteButton) {
                            deleteButton.click();
                            await new Promise(resolve => setTimeout(resolve, deleteSpeed));

                            const confirmButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');
                            if (confirmButton) {
                                confirmButton.click();
                                totalDeleted++;
                                logToPanel(`✅ Tweet silindi. Toplam silinen tweet sayısı: ${totalDeleted}`);
                                deletionHistory.push({ id: tweetId, timestamp: new Date().toLocaleString() });
                                updateHistory();
                                await new Promise(resolve => setTimeout(resolve, deleteSpeed));
                                foundTweetToDelete = true;
                            }
                        }
                    }
                }

                if (!foundTweetToDelete) {
                    logToPanel("⏭️ Silinecek tweet bulunamadı. Sayfa kaydırılıyor...");
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(resolve => setTimeout(resolve, deleteSpeed));
                }
            } catch (error) {
                // Hata yönetimi
                logToPanel(`❌ Hata oluştu: ${error.message}`);
                console.error(error);
                break;
            }
        }

        if (isStopped) {
            logToPanel("🛑 İşlem kullanıcı tarafından durduruldu.");
        } else {
            logToPanel(`🏁 İşlem tamamlandı. Toplam silinen tweet sayısı: ${totalDeleted}`);
        }
    }

    // Sil butonunu bulma fonksiyonu
    async function findDeleteButton() {
        await new Promise(resolve => setTimeout(resolve, deleteSpeed / 2));
        const menuItems = document.querySelectorAll('[role="menuitem"]');
        for (const item of menuItems) {
            const span = item.querySelector('span');
            if (span && span.textContent === "Sil") {
                return item;
            }
        }
        return null;
    }

    // İşlem geçmişini güncelleme fonksiyonu
    function updateHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = deletionHistory.map(entry => `<div>ID: ${entry.id} - ${entry.timestamp}</div>`).join('');
    }

    // Hariç tutulan tweet'leri güncelleme fonksiyonu
    function updateExcludeList() {
        const excludeList = document.getElementById('excludeList');
        excludeList.innerHTML = excludeIds.map(id => `<div>${id}</div>`).join('');
    }

    // Tweet silme butonu tıklama işlemi
    document.getElementById('deleteButton').addEventListener('click', () => {
        isStopped = false;
        deleteTweets();
    });

    // İşlemi durdur butonu tıklama işlemi
    document.getElementById('stopButton').addEventListener('click', () => {
        isStopped = true;
    });

    // Her tweetin üstüne "+" butonu ekleme fonksiyonu
    function addExcludeButtons() {
        const tweets = document.querySelectorAll('[data-testid="tweet"]');
        tweets.forEach(tweet => {
            const tweetLink = tweet.querySelector('a[href*="/status/"]');
            const tweetId = tweetLink?.href.split('/status/')[1];

            if (tweetId && !tweet.querySelector('.excludeButton')) {
                const excludeButton = document.createElement('button');
                excludeButton.innerText = '+';
                excludeButton.style.position = 'absolute';
                excludeButton.style.top = '5px';
                excludeButton.style.right = '5px';
                excludeButton.style.background = '#1DA1F2';
                excludeButton.style.color = 'white';
                excludeButton.style.border = 'none';
                excludeButton.style.borderRadius = '50%';
                excludeButton.style.width = '20px';
                excludeButton.style.height = '20px';
                excludeButton.style.cursor = 'pointer';
                excludeButton.classList.add('excludeButton');

                excludeButton.addEventListener('click', () => {
                    if (!excludeIds.includes(tweetId)) {
                        excludeIds.push(tweetId);
                        updateExcludeList();
                        logToPanel(`📌 Hariç tutulan tweet eklendi: ${tweetId}`);
                    }
                });

                tweet.style.position = 'relative';
                tweet.appendChild(excludeButton);
            }
        });
    }

    // Sayfa yüklendiğinde panel durumunu kontrol et
    function checkPageAndShowPanel() {
        document.getElementById('deleteButton').style.display = 'block';
        document.getElementById('stopButton').style.display = 'block';
        addExcludeButtons(); // Tweet'lere "+" butonu ekle
    }

    // Sayfa yüklendiğinde ve her URL değişikliğinde kontrol et
    window.addEventListener('load', () => {
        setTimeout(checkPageAndShowPanel, 3000); // 3 saniye sonra kontrol et
    });
    window.addEventListener('popstate', () => {
        setTimeout(checkPageAndShowPanel, 3000); // 3 saniye sonra kontrol et
    });

    // Sayfa dinamik olarak yüklendiğinde de kontrol et (Twitter/X için)
    const observer = new MutationObserver(() => {
        checkPageAndShowPanel();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();