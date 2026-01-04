// ==UserScript==
// @name         URL ile Dinamik Tarihli Oda Kontrolcüsü (v2.3 Düzeltilmiş) - Alanya Öğretmenevi
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Alanya Öğretmenevi sayfasında, ayarlardan DD-MM-YYYY formatında girilen tarihleri kullanarak hedef URL'ye gider, ARA butonuna tıklar ve oda durumuna göre sesli bildirim gönderir. (Hata düzeltmeleri ve UI iyileştirmesi)
// @author       Sizin Adınız (İsteğe Bağlı)
// @match        https://alanyaogretmenevi.rezervasyonal.com/
// @match        https://alanyaogretmenevi.rezervasyonal.com/?*
// @grant        GM_notification
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536543/URL%20ile%20Dinamik%20Tarihli%20Oda%20Kontrolc%C3%BCs%C3%BC%20%28v23%20D%C3%BCzeltilmi%C5%9F%29%20-%20Alanya%20%C3%96%C4%9Fretmenevi.user.js
// @updateURL https://update.greasyfork.org/scripts/536543/URL%20ile%20Dinamik%20Tarihli%20Oda%20Kontrolc%C3%BCs%C3%BC%20%28v23%20D%C3%BCzeltilmi%C5%9F%29%20-%20Alanya%20%C3%96%C4%9Fretmenevi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Tarih Formatı Yardımcı Fonksiyonları ---
    function toYyyyMmDd(dateStrDdMmYyyy) {
        if (!dateStrDdMmYyyy || !/^\d{2}-\d{2}-\d{4}$/.test(dateStrDdMmYyyy)) return "";
        const parts = dateStrDdMmYyyy.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    function toDdMmYyyy(dateStrYyyyMmDd) {
        if (!dateStrYyyyMmDd || !/^\d{4}-\d{2}-\d{2}$/.test(dateStrYyyyMmDd)) return "";
        const parts = dateStrYyyyMmDd.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // --- Varsayılan Ayarlar Başlangıç ---
    const defaultSettings = {
        refreshMode: 'fixed',
        fixedIntervalSeconds: 300,
        minRandomSeconds: 240,
        maxRandomSeconds: 600,
        checkinDate: '',
        checkoutDate: '',
        adultCount: '2',
        childCount: '0',
        childAges: '',
        language: 'tr',
        clickDelayMs: 3500, // ARA sonrası bekleme biraz artırıldı
        popupCloseAttemptDelayMs: 1500,
        noRoomText: "Aradığınız tarih aralığında müsait oda bulunamadı, lütfen tarihleri değiştiriniz ya da konaklama şartlarını dikkate alarak arama yapınız.",
        notificationTitle: "Oda Durumu",
        roomFoundMessage: "ODA BULUNDU!",
        roomNotFoundMessage: "ODA BULUNAMADI",
        searchButtonText: "ARA",
        popupCloseSelectors: [
            '.modal-close', '.popup-close', '[data-dismiss="modal"]',
            '.ui-dialog-titlebar-close', '.mfp-close', 'button.close',
            // Ekstra: Bazı sitelerde görülen genel kapatma butonları
            '[aria-label="Close"]', '[aria-label="Kapat"]'
        ],
    };
    const currentVersionPrefix = 'v2_3'; // Ayar anahtarları için ön ek
    // --- Varsayılan Ayarlar Bitiş ---

    // --- Kayıtlı Ayarları Yükle (YYYY-MM-DD formatında) ---
    let settings = {};
    function loadSettings() {
        settings = {
            refreshMode: GM_getValue(`refreshMode_${currentVersionPrefix}`, defaultSettings.refreshMode),
            fixedIntervalMs: GM_getValue(`fixedIntervalMs_${currentVersionPrefix}`, defaultSettings.fixedIntervalSeconds * 1000),
            minRandomMs: GM_getValue(`minRandomMs_${currentVersionPrefix}`, defaultSettings.minRandomSeconds * 1000),
            maxRandomMs: GM_getValue(`maxRandomMs_${currentVersionPrefix}`, defaultSettings.maxRandomSeconds * 1000),
            checkinDate: GM_getValue(`checkinDate_${currentVersionPrefix}_yyyyMMdd`, defaultSettings.checkinDate),
            checkoutDate: GM_getValue(`checkoutDate_${currentVersionPrefix}_yyyyMMdd`, defaultSettings.checkoutDate),
            adultCount: GM_getValue(`adultCount_${currentVersionPrefix}`, defaultSettings.adultCount),
            childCount: GM_getValue(`childCount_${currentVersionPrefix}`, defaultSettings.childCount),
            childAges: GM_getValue(`childAges_${currentVersionPrefix}`, defaultSettings.childAges),
        };
        console.log("Ayarlar yüklendi:", settings);
    }
    // --- Kayıtlı Ayarlar Bitiş ---

    // --- AYAR ARAYÜZÜ ---
    function createSettingsUI() {
        GM_addStyle(`
            #odaKontrolAyarButonu { position: fixed; bottom: 10px; right: 10px; z-index: 10001; padding: 8px 12px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
            #odaKontrolAyarPaneli {
                position: fixed; bottom: 50px; right: 10px; z-index: 10000;
                background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px;
                padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); display: none; width: 400px;
                max-height: calc(100vh - 70px); /* Ekran yüksekliğine göre max yükseklik */
                overflow-y: auto; /* Gerekirse kaydırma çubuğu */
            }
            .ayarPaneliBolum { margin-bottom: 15px; }
            .ayarPaneliBolum label { display: block; margin-bottom: 3px; font-weight: bold;}
            .ayarPaneliBolum input[type="number"],
            .ayarPaneliBolum input[type="text"] { width: calc(100% - 12px); padding: 6px; border: 1px solid #ccc; border-radius: 3px; box-sizing: border-box; margin-bottom: 5px;}
            .ayarPaneliBolum input[type="radio"] { display: inline-block; margin-right: 5px; width: auto; vertical-align: middle;}
            .radioLabel { margin-right: 15px; display: inline-block !important; font-weight: normal !important;}
            #fixedIntervalSection_${currentVersionPrefix}, #randomIntervalSection_${currentVersionPrefix} { margin-top: 10px; padding-top:10px; border-top: 1px solid #eee;}
            #odaKontrolAyarPaneli button { padding: 8px 12px; margin-right: 5px; cursor:pointer; border-radius: 3px; border: 1px solid transparent; }
            #saveSettingsButton_${currentVersionPrefix} { background-color: #28a745; color: white; border-color: #28a745;}
            #closeSettingsButton_${currentVersionPrefix} { background-color: #6c757d; color: white; border-color: #6c757d;}
            .date-params-inline label {display: inline-block !important; margin-right: 5px; width: auto !important;}
            .date-params-inline input[type="text"] {width: 80px !important; display: inline-block !important; margin-right:10px;}
        `);

        const settingsButton = document.createElement('button');
        settingsButton.id = 'odaKontrolAyarButonu';
        settingsButton.innerHTML = '&#x1F527; Ayarlar';
        document.body.appendChild(settingsButton);

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'odaKontrolAyarPaneli';
        // Input ID'leri ve name atribüleri için currentVersionPrefix kullanıldı
        settingsPanel.innerHTML = `
            <h3>Genel Ayarlar</h3>
            <div class="ayarPaneliBolum">
                <strong>Yenileme Modu:</strong>
                <label class="radioLabel"><input type="radio" name="refreshMode_${currentVersionPrefix}" value="fixed">Sabit</label>
                <label class="radioLabel"><input type="radio" name="refreshMode_${currentVersionPrefix}" value="random">Rastgele</label>
            </div>
            <div id="fixedIntervalSection_${currentVersionPrefix}" class="ayarPaneliBolum" style="display: none;">
                <label for="fixedIntervalInput_${currentVersionPrefix}">Sabit Sıklık (saniye):</label>
                <input type="number" id="fixedIntervalInput_${currentVersionPrefix}" min="10">
            </div>
            <div id="randomIntervalSection_${currentVersionPrefix}" class="ayarPaneliBolum" style="display: none;">
                <label for="minRandomIntervalInput_${currentVersionPrefix}">En Az Sıklık (saniye):</label>
                <input type="number" id="minRandomIntervalInput_${currentVersionPrefix}" min="10">
                <label for="maxRandomIntervalInput_${currentVersionPrefix}">En Çok Sıklık (saniye):</label>
                <input type="number" id="maxRandomIntervalInput_${currentVersionPrefix}" min="10">
            </div>
            <hr>
            <h3>Tarih ve Kişi Ayarları (URL için)</h3>
            <div class="ayarPaneliBolum">
                <label for="checkinDateInput_${currentVersionPrefix}">Giriş Tarihi (GG-AA-YYYY):</label>
                <input type="text" id="checkinDateInput_${currentVersionPrefix}" placeholder="GG-AA-YYYY">
            </div>
            <div class="ayarPaneliBolum">
                <label for="checkoutDateInput_${currentVersionPrefix}">Çıkış Tarihi (GG-AA-YYYY):</label>
                <input type="text" id="checkoutDateInput_${currentVersionPrefix}" placeholder="GG-AA-YYYY">
            </div>
            <div class="ayarPaneliBolum date-params-inline">
                <label for="adultCountInput_${currentVersionPrefix}">Yetişkin:</label>
                <input type="text" id="adultCountInput_${currentVersionPrefix}" placeholder="2">
                <label for="childCountInput_${currentVersionPrefix}">Çocuk:</label>
                <input type="text" id="childCountInput_${currentVersionPrefix}" placeholder="0">
            </div>
            <div class="ayarPaneliBolum">
                 <label for="childAgesInput_${currentVersionPrefix}">Çocuk Yaşları (virgülle ayrılmış, örn: 5,7):</label>
                 <input type="text" id="childAgesInput_${currentVersionPrefix}" placeholder="Çocuk Yaşları">
            </div>
            <hr>
            <button id="saveSettingsButton_${currentVersionPrefix}">Kaydet ve Uygula</button>
            <button id="closeSettingsButton_${currentVersionPrefix}">Kapat</button>
        `;
        document.body.appendChild(settingsPanel);

        const fixedSection = document.getElementById(`fixedIntervalSection_${currentVersionPrefix}`);
        const randomSection = document.getElementById(`randomIntervalSection_${currentVersionPrefix}`);
        const radioButtons = document.querySelectorAll(`input[name="refreshMode_${currentVersionPrefix}"]`);

        function updatePanelVisibility(mode) {
            fixedSection.style.display = mode === 'fixed' ? 'block' : 'none';
            randomSection.style.display = mode === 'random' ? 'block' : 'none';
        }
        radioButtons.forEach(radio => radio.addEventListener('change', (event) => updatePanelVisibility(event.target.value)));

        settingsButton.addEventListener('click', () => {
            loadSettings(); // Paneli açmadan önce en güncel ayarları yükle
            settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
            if (settingsPanel.style.display === 'block') {
                document.querySelector(`input[name="refreshMode_${currentVersionPrefix}"][value="${settings.refreshMode}"]`).checked = true;
                document.getElementById(`fixedIntervalInput_${currentVersionPrefix}`).value = settings.fixedIntervalMs / 1000;
                document.getElementById(`minRandomIntervalInput_${currentVersionPrefix}`).value = settings.minRandomMs / 1000;
                document.getElementById(`maxRandomIntervalInput_${currentVersionPrefix}`).value = settings.maxRandomMs / 1000;
                document.getElementById(`checkinDateInput_${currentVersionPrefix}`).value = toDdMmYyyy(settings.checkinDate);
                document.getElementById(`checkoutDateInput_${currentVersionPrefix}`).value = toDdMmYyyy(settings.checkoutDate);
                document.getElementById(`adultCountInput_${currentVersionPrefix}`).value = settings.adultCount;
                document.getElementById(`childCountInput_${currentVersionPrefix}`).value = settings.childCount;
                document.getElementById(`childAgesInput_${currentVersionPrefix}`).value = settings.childAges;
                updatePanelVisibility(settings.refreshMode);
            }
        });
        document.getElementById(`closeSettingsButton_${currentVersionPrefix}`).addEventListener('click', () => settingsPanel.style.display = 'none');

        document.getElementById(`saveSettingsButton_${currentVersionPrefix}`).addEventListener('click', () => {
            console.log("Kaydet butonuna basıldı.");
            const selectedMode = document.querySelector(`input[name="refreshMode_${currentVersionPrefix}"]:checked`).value;
            GM_setValue(`refreshMode_${currentVersionPrefix}`, selectedMode);

            if (selectedMode === 'fixed') {
                const fixedSec = parseInt(document.getElementById(`fixedIntervalInput_${currentVersionPrefix}`).value, 10);
                if (fixedSec && fixedSec >= 10) {
                    GM_setValue(`fixedIntervalMs_${currentVersionPrefix}`, fixedSec * 1000);
                    console.log("Sabit interval kaydedildi:", fixedSec * 1000);
                } else { alert("Sabit sıklık en az 10 saniye olmalıdır."); return; }
            } else if (selectedMode === 'random') {
                const minSec = parseInt(document.getElementById(`minRandomIntervalInput_${currentVersionPrefix}`).value, 10);
                const maxSec = parseInt(document.getElementById(`maxRandomIntervalInput_${currentVersionPrefix}`).value, 10);
                if (minSec && maxSec && minSec >= 10 && maxSec >= 10) {
                    if (minSec > maxSec) { alert("En az sıklık, en çok sıklıktan büyük olamaz."); return; }
                    GM_setValue(`minRandomMs_${currentVersionPrefix}`, minSec * 1000);
                    GM_setValue(`maxRandomMs_${currentVersionPrefix}`, maxSec * 1000);
                    console.log("Random interval kaydedildi:", minSec * 1000, maxSec * 1000);
                } else { alert("Rastgele sıklık değerleri en az 10 saniye olmalıdır."); return; }
            }

            const checkinStrDdMmYyyy = document.getElementById(`checkinDateInput_${currentVersionPrefix}`).value.trim();
            const checkoutStrDdMmYyyy = document.getElementById(`checkoutDateInput_${currentVersionPrefix}`).value.trim();
            const dateRegexDdMmYyyy = /^\d{2}-\d{2}-\d{4}$/;
            let checkinYyyyMmDd = "", checkoutYyyyMmDd = "";

            if (checkinStrDdMmYyyy) {
                if (!dateRegexDdMmYyyy.test(checkinStrDdMmYyyy)) { alert("Giriş tarihi formatı hatalı! GG-AA-YYYY olmalı."); return; }
                checkinYyyyMmDd = toYyyyMmDd(checkinStrDdMmYyyy);
            }
            if (checkoutStrDdMmYyyy) {
                if (!dateRegexDdMmYyyy.test(checkoutStrDdMmYyyy)) { alert("Çıkış tarihi formatı hatalı! GG-AA-YYYY olmalı."); return; }
                checkoutYyyyMmDd = toYyyyMmDd(checkoutStrDdMmYyyy);
            }
            if (checkinYyyyMmDd && checkoutYyyyMmDd && new Date(checkinYyyyMmDd) >= new Date(checkoutYyyyMmDd)) {
                alert("Giriş tarihi, çıkış tarihinden önce olmalıdır."); return;
            }

            GM_setValue(`checkinDate_${currentVersionPrefix}_yyyyMMdd`, checkinYyyyMmDd);
            GM_setValue(`checkoutDate_${currentVersionPrefix}_yyyyMMdd`, checkoutYyyyMmDd);
            GM_setValue(`adultCount_${currentVersionPrefix}`, document.getElementById(`adultCountInput_${currentVersionPrefix}`).value.trim() || defaultSettings.adultCount);
            GM_setValue(`childCount_${currentVersionPrefix}`, document.getElementById(`childCountInput_${currentVersionPrefix}`).value.trim() || defaultSettings.childCount);
            GM_setValue(`childAges_${currentVersionPrefix}`, document.getElementById(`childAgesInput_${currentVersionPrefix}`).value.trim());
            console.log("Tarih ve kişi ayarları kaydedildi.");

            settingsPanel.style.display = 'none';
            // alert("Ayarlar kaydedildi. Sayfa yeni ayarlara göre yönlendirilecek/yenilenecek."); // Alert kaldırıldı
            console.log("Ayarlar kaydedildi, sayfa yenileniyor...");
            window.location.reload();
        });
    }
    // --- AYAR ARAYÜZÜ BİTİŞ ---

    async function tryToClosePopups() {
        console.log(new Date().toLocaleString() + " - Pop-up kapatma denemesi...");
        let closedAPopup = false;
        for (const selector of defaultSettings.popupCloseSelectors) {
            try {
                const closeButtons = document.querySelectorAll(selector);
                for (const closeButton of closeButtons) {
                    if (closeButton && closeButton.offsetParent !== null && closeButton.checkVisibility()) { // Görünür ve tıklanabilir mi?
                        console.log(`Pop-up kapatma elemanı (${selector}) bulundu ve tıklanıyor.`);
                        closeButton.click();
                        closedAPopup = true;
                        await new Promise(resolve => setTimeout(resolve, 300)); // Her tıklama sonrası kısa bekleme
                    }
                }
            } catch (e) {
                console.warn(`Pop-up kapatma elemanına (${selector}) erişirken veya tıklarken hata:`, e.message);
            }
        }
        if (closedAPopup) console.log("Pop-up kapatma denemeleri tamamlandı.");
        else console.log("Kapatılacak aktif pop-up bulunamadı/tıklanamadı.");
    }

    function findAndClickSearchButton() {
        console.log(new Date().toLocaleString() + " - " + defaultSettings.searchButtonText + " butonu aranıyor...");
        const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a')); // 'a' linklerini de dahil et
        let foundButton = null;

        for (let button of buttons) {
            const buttonText = (button.innerText || button.value || button.textContent || button.title || "").trim().toUpperCase();
            // Butonun görünür ve tıklanabilir olduğundan emin olmaya çalış
            if (buttonText.includes(defaultSettings.searchButtonText.toUpperCase()) && button.offsetParent !== null && button.checkVisibility()) {
                console.log("Potansiyel ARA butonu bulundu:", button, "Metin:", buttonText);
                // En spesifik olanı seçmeye çalışabiliriz ya da ilk bulduğumuzu alırız
                // Örneğin, sadece 'ARA' içeren ama 'DAHA FAZLA ARA' olmayan
                if (buttonText === defaultSettings.searchButtonText.toUpperCase()) {
                    foundButton = button;
                    break;
                }
                if (!foundButton) foundButton = button; // Daha az spesifik ama yine de bir eşleşme
            }
        }

        if (foundButton) {
            console.log(new Date().toLocaleString() + " - '" + defaultSettings.searchButtonText + "' butonu bulundu ve tıklanıyor:", foundButton);
            foundButton.click();
            return true;
        } else {
            console.error(new Date().toLocaleString() + " - '" + defaultSettings.searchButtonText + "' butonu bulunamadı veya görünür değil.");
            GM_notification({ title: "Betik Hatası", text: `'${defaultSettings.searchButtonText}' butonu bulunamadı.`, silent: false });
            return false;
        }
    }

    function calculateNextRefreshDelay() {
        loadSettings(); // En güncel ayarları al
        let nextRefreshDelayMs;
        if (settings.refreshMode === 'random') {
            nextRefreshDelayMs = (settings.maxRandomMs > settings.minRandomMs) ?
                Math.floor(Math.random() * (settings.maxRandomMs - settings.minRandomMs + 1)) + settings.minRandomMs :
                settings.minRandomMs;
        } else {
            nextRefreshDelayMs = settings.fixedIntervalMs;
        }
        // Minimum 10 saniye olduğundan emin ol (aşırı yüklenmeyi önlemek için)
        return Math.max(nextRefreshDelayMs, 10000);
    }

    function checkRoomStatusAndNotify() {
        console.log(new Date().toLocaleString() + " - Oda durumu kontrol ediliyor...");
        // Sayfa içeriğinin tamamen yüklenmesini beklemek için kısa bir gecikme
        // Bu, ARA butonuna bastıktan sonra AJAX sonuçlarının gelmesi için önemlidir.
        // clickDelayMs zaten bu işlevi görüyor olmalı, ama emin olmak için burada da kontrol edebiliriz.

        const pageContent = document.body.innerText;
        const noRoom = pageContent.includes(defaultSettings.noRoomText);

        console.log(noRoom ? "ODA BULUNAMADI metni sayfada mevcut." : "ODA BULUNAMADI metni sayfada YOK.");

        GM_notification({
            title: defaultSettings.notificationTitle,
            text: noRoom ? defaultSettings.roomNotFoundMessage : defaultSettings.roomFoundMessage,
            silent: false,
            highlight: !noRoom,
            onclick: function() { window.focus(); }
        });
        console.log(new Date().toLocaleString() + " - Bildirim gönderildi: " + (noRoom ? defaultSettings.roomNotFoundMessage : defaultSettings.roomFoundMessage));

        const nextRefreshDelayMs = calculateNextRefreshDelay();
        const logMessagePart = settings.refreshMode === 'random' ?
            `rastgele (min ${settings.minRandomMs/1000}, max ${settings.maxRandomMs/1000}sn) -> ${nextRefreshDelayMs / 1000}` :
            `sabit ${nextRefreshDelayMs / 1000}`;
        console.log(new Date().toLocaleString() + " - Bir sonraki yenileme " + logMessagePart + " saniye sonra.");
        setTimeout(() => {
            console.log(new Date().toLocaleString() + " - Sayfa yenileniyor...");
            window.location.reload();
        }, nextRefreshDelayMs);
    }

    // --- ANA İŞLEM AKIŞI ---
    window.addEventListener('load', async function() {
        loadSettings(); // Betik başladığında ayarları yükle
        console.log(new Date().toLocaleString() + ` - Sayfa yüklendi. v${currentVersionPrefix} Kontrolcü başlatılıyor. Mod: ${settings.refreshMode}`);
        createSettingsUI();

        const { checkinDate, checkoutDate, adultCount, childCount, childAges } = settings;

        if (!checkinDate || !checkoutDate) {
            console.warn("Giriş ve Çıkış tarihleri ayarlarda tanımlanmamış.");
            // Kullanıcıyı uyarmak için bildirimi burada da gösterebiliriz.
            // Ayar panelini otomatik açmak opsiyonel:
            // document.getElementById('odaKontrolAyarPaneli').style.display = 'block';
            // GM_notification({ title: "Eksik Bilgi", text: "Lütfen betik ayarlarından tarihleri ve kişi sayılarını tanımlayın.", silent: false });
            // Eğer tarihler yoksa, bu noktada işlem yapmadan bekleyebilir veya kullanıcıya ayar yapması için bilgi verebilir.
            // Şimdilik, eğer tarihler yoksa ve kullanıcı ayar butonuna basıp kaydetmezse bir şey yapmayacak.
            // "Kaydet ve Uygula" sonrası reload zaten bu kontrolü tekrar yapacak.
            return;
        }

        const targetUrl = `https://alanyaogretmenevi.rezervasyonal.com/?Checkin=${checkinDate}&Checkout=${checkoutDate}&Adult=${adultCount}&child=${childCount}&ChildAges=${childAges}&language=${defaultSettings.language}`;
        const currentUrl = window.location.href;

        const normalizeUrl = (urlStr) => {
            try {
                const url = new URL(urlStr);
                url.searchParams.sort();
                return url.protocol + "//" + url.host + url.pathname + "?" + url.searchParams.toString();
            } catch (e) { return urlStr; }
        };

        const normalizedCurrentUrl = normalizeUrl(currentUrl);
        const normalizedTargetUrl = normalizeUrl(targetUrl);

        console.log("Mevcut Normalize URL:", normalizedCurrentUrl);
        console.log("Hedef Normalize URL:", normalizedTargetUrl);

        if (normalizedCurrentUrl !== normalizedTargetUrl) {
            console.log(`Mevcut URL hedef URL'den farklı. Yönlendiriliyor: ${targetUrl}`);
            window.location.href = targetUrl;
            return;
        }

        console.log("Hedef tarihli sayfada işlemler devam ediyor.");

        await new Promise(resolve => setTimeout(resolve, defaultSettings.popupCloseAttemptDelayMs));
        await tryToClosePopups();
        // Pop-up kapandıktan sonra sayfanın oturması için ek bir bekleme
        await new Promise(resolve => setTimeout(resolve, 700));


        if (findAndClickSearchButton()) {
            console.log(new Date().toLocaleString() + " - ARA butonuna tıklandı. Sonuçların yüklenmesi için " + (defaultSettings.clickDelayMs / 1000) + " saniye bekleniyor...");
            setTimeout(checkRoomStatusAndNotify, defaultSettings.clickDelayMs);
        } else {
            console.error("ARA butonu bulunamadı veya tıklanamadı. İşlem devam edemiyor. Sayfa periyodik olarak yenilenecek.");
            const errorRefreshDelay = calculateNextRefreshDelay();
            setTimeout(() => {
                console.log(new Date().toLocaleString() + " - ARA butonu hatası sonrası sayfa yenileniyor...");
                window.location.reload();
            }, errorRefreshDelay);
        }
    });

})();