// ==UserScript==
// @name         Uzaktan Eğitim Kapısı Videolarını Otomatik İzle
// @namespace    https://uzaktanegitimkapisi.cbiko.gov.tr/
// @version      v3.8
// @description  Uzaktan Eğitim Kapısı Videolarını, Bilgisayara Dokunmadan, Arka Arkaya, Arkaplanda İzlemenizi Sağlar (Video süresine göre sonraki videoya geçiş)
// @author       MstyCnklc
// @homepage     https://greasyfork.org/tr/scripts/537685-uzaktan-e%C4%9Fitim-kap%C4%B1s%C4%B1-videolar%C4%B1n%C4%B1-otomatik-i-zle-geli%C5%9Fmi%C5%9F-oynay%C4%B1c%C4%B1
// @supportURL   https://greasyfork.org/tr/scripts/537685-uzaktan-e%C4%9Fitim-kap%C4%B1s%C4%B1-videolar%C4%B1n%C4%B1-otomatik-i-zle-geli%C5%9Fmi%C5%9F-oynay%C4%B1c%C4%B1/feedback
// @match        https://uzaktanegitimkapisi.cbiko.gov.tr/Egitimler/video*
// @match        https://uzaktanegitimkapisi.cbiko.gov.tr/Egitimler/Video*
// @match        https://uzaktanegitimkapisi.gov.tr/Egitimler/video*
// @match        https://uzaktanegitimkapisi.gov.tr/Egitimler/Video*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/537685/Uzaktan%20E%C4%9Fitim%20Kap%C4%B1s%C4%B1%20Videolar%C4%B1n%C4%B1%20Otomatik%20%C4%B0zle.user.js
// @updateURL https://update.greasyfork.org/scripts/537685/Uzaktan%20E%C4%9Fitim%20Kap%C4%B1s%C4%B1%20Videolar%C4%B1n%C4%B1%20Otomatik%20%C4%B0zle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS_DEFAULTS = {
        autoPlay: true,
        startMuted: false,
        playInBackground: true,
        autoConfirm: true,
        autoReload: true, // Genel periyodik yenileme
        reloadIntervalMinutes: 25,
        autoAdvanceNextVideo: true // Video bitince sonraki videoya geç (artık süreye göre yenileme ile)
    };

    function loadSettings() {
        let settings = {};
        for (const key in SETTINGS_DEFAULTS) {
            settings[key] = GM_getValue(key, SETTINGS_DEFAULTS[key]);
        }
        settings.reloadIntervalMinutes = parseInt(settings.reloadIntervalMinutes, 10) || SETTINGS_DEFAULTS.reloadIntervalMinutes;
        ['autoPlay', 'startMuted', 'playInBackground', 'autoConfirm', 'autoReload', 'autoAdvanceNextVideo'].forEach(key => {
            if (typeof settings[key] !== 'boolean') {
                settings[key] = SETTINGS_DEFAULTS[key];
            }
        });
        return settings;
    }

    function saveSettings(settings) {
        for (const key in settings) {
            GM_setValue(key, settings[key]);
        }
    }

    let currentSettings = loadSettings();
    var myPlayer;
    var pageRefreshInterval = null; // Genel sayfa yenileme zamanlayıcısı
    let pageAdvanceRefreshTimeoutId = null; // Video sonu için yenileme zamanlayıcısı
    let originalDocTitle = "";

    // --- Ayar Paneli (HTML ve CSS) ---
    GM_addStyle(`
        #uek-settings-button {
            position: fixed; bottom: 20px; right: 20px;
            background-color: #007bff; color: white; padding: 10px 15px;
            border: none; border-radius: 5px; cursor: pointer; z-index: 9999;
            font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #uek-settings-button:hover { background-color: #0056b3; }
        #uek-settings-panel {
            position: fixed; bottom: 70px; right: 20px;
            background-color: #f8f9fa; border: 1px solid #dee2e6;
            border-radius: 8px; padding: 20px; z-index: 10000;
            display: none; width: 360px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-family: Arial, sans-serif;
        }
        #uek-settings-panel h3 {
            margin-top: 0; margin-bottom: 20px; font-size: 18px; color: #343a40;
            text-align: center; border-bottom: 1px solid #e9ecef; padding-bottom: 10px;
        }
        #uek-settings-panel .setting-item {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 15px;
        }
        #uek-settings-panel label { font-size: 14px; color: #495057; flex-grow: 1; }
        #uek-settings-panel input[type="checkbox"] {
            margin-left: 10px; transform: scale(1.1); cursor: pointer;
        }
        #uek-settings-panel input[type="number"] {
            width: 70px; padding: 6px 8px; border: 1px solid #ced4da;
            border-radius: 4px; margin-left: 10px; text-align: right;
        }
        #uek-save-settings-button {
            background-color: #28a745; color: white; padding: 10px 15px;
            border: none; border-radius: 5px; cursor: pointer; font-size: 15px;
            display: block; width: 100%; margin-top: 15px;
            transition: background-color 0.2s ease;
        }
        #uek-save-settings-button:hover { background-color: #218838; }
    `);

    const settingsButton = $('<button id="uek-settings-button">⚙️ Ayarlar</button>');
    const settingsPanel = $(`
        <div id="uek-settings-panel">
            <h3>Video İzleme Ayarları</h3>
            <div class="setting-item">
                <label for="uek-autoPlay">Otomatik Oynat (Sayfa Yüklenince)</label>
                <input type="checkbox" id="uek-autoPlay">
            </div>
            <div class="setting-item">
                <label for="uek-startMuted">Videoları Sessiz Başlat</label>
                <input type="checkbox" id="uek-startMuted">
            </div>
            <div class="setting-item">
                <label for="uek-autoAdvanceNextVideo">Video Bitince Sonrakine Geç (Süreye Göre Yenile)</label>
                <input type="checkbox" id="uek-autoAdvanceNextVideo">
            </div>
            <div class="setting-item">
                <label for="uek-playInBackground">Arka Planda Oynat (Sekme Değişince)</label>
                <input type="checkbox" id="uek-playInBackground">
            </div>
            <div class="setting-item">
                <label for="uek-autoConfirm">Onayları Otomatik Tıkla</label>
                <input type="checkbox" id="uek-autoConfirm">
            </div>
            <div class="setting-item">
                <label for="uek-autoReload">Periyodik Sayfa Yenile (Video Takılırsa)</label>
                <input type="checkbox" id="uek-autoReload">
            </div>
            <div class="setting-item">
                <label for="uek-reloadIntervalMinutes">Periyodik Yenileme Sıklığı (dk):</label>
                <input type="number" id="uek-reloadIntervalMinutes" min="1" max="120">
            </div>
            <button id="uek-save-settings-button">Ayarları Kaydet</button>
        </div>
    `);

    $('body').append(settingsButton);
    $('body').append(settingsPanel);

    function updatePanelValues() {
        $('#uek-autoPlay').prop('checked', currentSettings.autoPlay);
        $('#uek-startMuted').prop('checked', currentSettings.startMuted);
        $('#uek-autoAdvanceNextVideo').prop('checked', currentSettings.autoAdvanceNextVideo);
        $('#uek-playInBackground').prop('checked', currentSettings.playInBackground);
        $('#uek-autoConfirm').prop('checked', currentSettings.autoConfirm);
        $('#uek-autoReload').prop('checked', currentSettings.autoReload);
        $('#uek-reloadIntervalMinutes').val(currentSettings.reloadIntervalMinutes);
    }

    $('#uek-settings-button').on('click', function() {
        currentSettings = loadSettings();
        updatePanelValues();
        $('#uek-settings-panel').slideToggle(200);
    });

    $('#uek-save-settings-button').on('click', function() {
        // Ayarları UI'dan al
        currentSettings.autoPlay = $('#uek-autoPlay').is(':checked');
        currentSettings.startMuted = $('#uek-startMuted').is(':checked');
        currentSettings.autoAdvanceNextVideo = $('#uek-autoAdvanceNextVideo').is(':checked');
        currentSettings.playInBackground = $('#uek-playInBackground').is(':checked');
        currentSettings.autoConfirm = $('#uek-autoConfirm').is(':checked');
        currentSettings.autoReload = $('#uek-autoReload').is(':checked');
        let newInterval = parseInt($('#uek-reloadIntervalMinutes').val());
        if (isNaN(newInterval) || newInterval < 1) {
            newInterval = SETTINGS_DEFAULTS.reloadIntervalMinutes;
            $('#uek-reloadIntervalMinutes').val(newInterval);
        }
        currentSettings.reloadIntervalMinutes = newInterval;

        saveSettings(currentSettings);
        alert('Ayarlar kaydedildi!');
        $('#uek-settings-panel').slideUp(200);

        // Zamanlayıcıları ve oynatıcı etkileşimlerini güncelle
        // Önce tüm zamanlayıcıları temizle
        if (pageRefreshInterval) clearInterval(pageRefreshInterval);
        pageRefreshInterval = null;
        if (pageAdvanceRefreshTimeoutId) clearTimeout(pageAdvanceRefreshTimeoutId);
        pageAdvanceRefreshTimeoutId = null;

        // Sonra ayara göre yeniden başlat
        setupPageRefresh(); // Bu, pageAdvanceRefreshTimeoutId'yi kontrol eder.

        if (myPlayer) {
            $(window).off('.uekscript'); // Arka plan dinleyicilerini temizle
            // initializePlayerInteractions içindeki loadedmetadata ve ended yeniden bağlanacak
            initializePlayerInteractions(); // Bu, video sonu yenilemesini ve diğer oynatıcı olaylarını ayarlar.

            // Mevcut videonun ses durumunu ve başlığını anında güncelle
            if (typeof myPlayer.muted === 'function') {
                if (myPlayer.muted() !== currentSettings.startMuted) {
                     myPlayer.muted(currentSettings.startMuted);
                }
            }
            if (!currentSettings.playInBackground) { // Arka planda oynatma kapatıldıysa başlığı düzelt
                 document.title = originalDocTitle || "Uzaktan Eğitim Kapısı";
            }
        }
    });

    function applyMuteSetting(player) {
        if (player && typeof player.muted === 'function') {
            if (player.muted() !== currentSettings.startMuted) {
                player.muted(currentSettings.startMuted);
                console.log(`Video ses durumu ayarlandı: ${currentSettings.startMuted ? 'Sessiz' : 'Sesli'}`);
            }
        }
    }

    function attemptPlayWithRetries(player, retries = 5, delay = 1000) {
        if (!currentSettings.autoPlay || !player || typeof player.play !== 'function') {
            if (player) applyMuteSetting(player);
            return;
        }
        player.play()
            .then(() => { /* 'play' olayı zaten applyMuteSetting'i çağıracak */ })
            .catch(error => {
                if (retries > 0) {
                    setTimeout(() => attemptPlayWithRetries(player, retries - 1, delay), delay);
                } else { console.error("Maksimum otomatik oynatma denemesine ulaşıldı."); }
            });
    }

    function setupBackgroundPlayListeners() {
        $(window).on('blur.uekscript', function () {
            if (!myPlayer || !currentSettings.playInBackground) return;
            if (currentSettings.autoPlay && myPlayer.paused() && !myPlayer.ended()) {
                myPlayer.play().catch(e => console.warn("Arka planda oynatma hatası (blur):", e.name, e.message));
            } else if (!currentSettings.startMuted && myPlayer.muted()) {
                myPlayer.muted(false);
            }
            if (myPlayer && !myPlayer.paused() && !myPlayer.ended()) document.title = "▶️ UEK - Oynatılıyor...";
            else if (myPlayer && (myPlayer.paused() || myPlayer.ended())) document.title = "⏸️ UEK - Duraklatıldı/Bitti";
        });
        $(window).on('focus.uekscript', function () {
            if (!currentSettings.playInBackground && (document.title.startsWith("▶️") || document.title.startsWith("⏸️"))) {
                document.title = originalDocTitle || "Uzaktan Eğitim Kapısı";
            } else if (currentSettings.playInBackground) {
                document.title = originalDocTitle || "Uzaktan Eğitim Kapısı";
            }
            if (!myPlayer || !currentSettings.playInBackground) return;
            if (currentSettings.autoPlay && myPlayer.paused() && !myPlayer.ended()) {
                myPlayer.play().catch(e => console.warn("Arka planda oynatma hatası (focus):", e.name, e.message));
            } else if (!currentSettings.startMuted && myPlayer.muted()) {
                myPlayer.muted(false);
            }
        });
    }

    function initializePlayerInteractions() {
        if (!myPlayer) {
            console.warn("Oyuncu başlatılamadı (initializePlayerInteractions).");
            return;
        }

        // Önceki dinleyicileri temizle (özellikle namespace ile eklenenleri veya yeniden tanımlanacakları)
        myPlayer.off('.uekAdvance'); // .uekAdvance namespace'i ile eklenen tüm 'loadedmetadata' ve 'ended' olaylarını temizle
        myPlayer.off('play.uekMain');
        myPlayer.off('pause.uekMain');
        myPlayer.off('error.uekMain');
        // myPlayer.off('ended.uekTitle'); // Eğer başlık için ayrı ended varsa

        // Video sonu için sayfa yenileme zamanlayıcısını temizle (fonksiyon her çağrıldığında)
        if (pageAdvanceRefreshTimeoutId) {
            clearTimeout(pageAdvanceRefreshTimeoutId);
            pageAdvanceRefreshTimeoutId = null;
            console.log("Önceki video sonu yenileme zamanlayıcısı temizlendi.");
        }

        myPlayer.on('error.uekMain', function() {
            const error = myPlayer.error();
            console.error("Video Oynatıcı Hatası:", error ? `${error.code} - ${error.message}` : "Bilinmeyen hata");
        });

        myPlayer.on('play.uekMain', function() {
            console.log("Video 'play' olayı tetiklendi.");
            applyMuteSetting(myPlayer);
            if (document.hidden && currentSettings.playInBackground) {
                 document.title = "▶️ UEK - Oynatılıyor...";
            } else if (!document.hidden) {
                 document.title = originalDocTitle || "Uzaktan Eğitim Kapısı";
            }
        });

        myPlayer.on('pause.uekMain', function() {
            if (document.hidden && currentSettings.playInBackground && !myPlayer.ended()) {
                document.title = "⏸️ UEK - Duraklatıldı (Arka Plan)";
            }
        });

        // YENİ: Video süresine göre sonraki videoya geçiş
        myPlayer.on('loadedmetadata.uekAdvance', function() {
            console.log("'loadedmetadata' olayı tetiklendi.");
            if (currentSettings.autoAdvanceNextVideo && myPlayer) {
                const duration = myPlayer.duration();
                if (duration && duration > 0 && isFinite(duration)) {
                    const refreshDelayMillis = (Math.ceil(duration) + 3) * 1000; // Süre + 3 saniye (milisaniye cinsinden)

                    console.log(`Video süresi: ${duration.toFixed(0)} saniye. Sayfa ~${(refreshDelayMillis / 1000).toFixed(0)} saniye sonra yenilenecek.`);

                    // Eğer varsa, genel periyodik yenileme zamanlayıcısını iptal et
                    if (pageRefreshInterval) {
                        clearInterval(pageRefreshInterval);
                        pageRefreshInterval = null; // Tekrar kurulmaması için null yap
                        console.log("Genel sayfa yenileme, video sonu yenilemesi için iptal edildi.");
                    }

                    pageAdvanceRefreshTimeoutId = setTimeout(function() {
                        console.log(`Video süresi (${duration.toFixed(0)}s) + 3s doldu. Sayfa sonraki video için yenileniyor...`);
                        window.location.reload(true); // Sayfayı yenile
                    }, refreshDelayMillis);
                } else {
                    console.warn("Video süresi alınamadı veya geçersiz. Süreye göre sayfa yenileme ayarlanamadı.");
                }
            }
        });

        myPlayer.on('ended.uekAdvance', function() { // .uekAdvance namespace'ini kullanmaya devam et
            console.log("Video 'ended' olayı (Süreye göre yenileme aktif). Sayfa yenilemesi bekleniyor.");
            if (document.hidden && currentSettings.playInBackground) {
                document.title = "✅ UEK - Tamamlandı (Yenileniyor...)";
            }
            // Burada artık buton tıklama yok, zamanlanmış yenileme esas alınır.
        });

        // Otomatik oynatma ve ilk ses ayarı
        if (currentSettings.autoPlay) {
            setTimeout(() => attemptPlayWithRetries(myPlayer), 500);
        } else {
             setTimeout(() => applyMuteSetting(myPlayer), 600); // Oynatma kapalıysa bile ses ayarını uygula
        }

        // Arka plan oynatma ve başlık dinleyicilerini ayarla
        $(window).off('.uekscript'); // Öncekileri temizle
        if (currentSettings.playInBackground) {
            setupBackgroundPlayListeners();
        } else {
            if (document.title.startsWith("▶️") || document.title.startsWith("⏸️") || document.title.startsWith("✅")) {
                document.title = originalDocTitle || "Uzaktan Eğitim Kapısı";
            }
        }
    }

    let mainIntervalTimer = 2000;
    let mainInterval = setInterval(() => {
        if (!myPlayer || typeof myPlayer.paused !== 'function' || typeof myPlayer.ended !== 'function') {
            // Oyuncu henüz yüklenmediyse veya geçerli değilse, onay butonlarını kontrol et
             if (currentSettings.autoConfirm) {
                 var confirmButton = $(".swal-button--confirm:visible");
                 if (confirmButton.length) {
                     console.log("Otomatik onay (Oyuncu yokken): Standart 'confirm' butonu tıklandı.");
                     confirmButton.click();
                 } else {
                     var alertButton = $(".swal-button:visible").not(".swal-button--cancel");
                     if (alertButton.length) {
                         console.log("Otomatik onay (Oyuncu yokken): Genel 'alert' (Tamam/OK) butonu tıklandı.");
                         alertButton.first().click();
                     }
                 }
             }
            return;
        }

        // Otomatik oynatmayı (büyük play butonu) dene
        if (currentSettings.autoPlay && myPlayer.paused() && !myPlayer.ended() && !pageAdvanceRefreshTimeoutId) { // Yenileme zamanlayıcısı yoksa oynatmayı dene
            var autoPlayButton = $('.vjs-big-play-button:visible');
            if (autoPlayButton.length) autoPlayButton.click();
        }

        // --- Otomatik Onaylama ---
        if (currentSettings.autoConfirm) {
            // Önce standart 'confirm' (Evet/Onayla) butonunu ara
            var confirmButton = $(".swal-button--confirm:visible");
            if (confirmButton.length) {
                console.log("Otomatik onay: Standart 'confirm' butonu tıklandı.");
                confirmButton.click();
            } else {
                // Eğer 'confirm' butonu yoksa, 'Yapay Zeka' gibi tek butonlu
                // 'alert' modalları için genel 'swal-button' ara.
                // 'cancel' (İptal) butonu olmayanları filtrele
                var alertButton = $(".swal-button:visible").not(".swal-button--cancel");
                if (alertButton.length) {
                    console.log("Otomatik onay: Genel 'alert' (Tamam/OK) butonu tıklandı.");
                    alertButton.first().click(); // Bulunan ilk butonu tıkla (genelde tek buton olur)
                }
            }
        }
        // --- Onaylama Sonu ---

    }, mainIntervalTimer);

    function setupPageRefresh() {
        if (pageRefreshInterval) { // Önce mevcut olanı temizle
            clearInterval(pageRefreshInterval);
            pageRefreshInterval = null;
        }

        // Eğer video sonu için bir yenileme zaten ayarlanmışsa, genel periyodik yenilemeyi başlatma.
        if (pageAdvanceRefreshTimeoutId) {
            console.log("Video sonu yenileme zamanlayıcısı aktif, periyodik genel yenileme başlatılmayacak.");
            return;
        }

        if (currentSettings.autoReload && currentSettings.reloadIntervalMinutes > 0) {
            console.log(`Periyodik sayfa yenileme ${currentSettings.reloadIntervalMinutes} dakika olarak ayarlandı.`);
            pageRefreshInterval = setInterval(function() {
                // Yenilemeden önce video sonu yenileme hala aktif mi diye son bir kontrol (normalde buraya düşmemeli)
                if (pageAdvanceRefreshTimeoutId) {
                    console.log("Periyodik yenileme: Video sonu yenilemesi hala aktif, bu yenileme atlanıyor.");
                    clearInterval(pageRefreshInterval); // Bu intervali durdur, bir sonrakini bekle
                    pageRefreshInterval = null;
                    return;
                }
                console.log(`Sayfa ${currentSettings.reloadIntervalMinutes} dakika sonra periyodik olarak yenilenecek.`);
                window.location.reload(true);
            }, currentSettings.reloadIntervalMinutes * 60 * 1000);
        } else {
            console.log("Periyodik sayfa yenileme devre dışı.");
        }
    }

    $(document).ready(function(){
        originalDocTitle = document.title;
        console.log(`Orijinal sayfa başlığı: "${originalDocTitle}"`);
        currentSettings = loadSettings(); // Ayarları en başta yükle

        let playerCheckRetries = 0;
        const maxPlayerCheckRetries = 20;
        let playerCheckInterval = setInterval(function() {
            playerCheckRetries++;
            if (typeof videojs !== 'undefined' && videojs.getPlayer('CbikoPl')) {
                myPlayer = videojs.getPlayer('CbikoPl');
                clearInterval(playerCheckInterval);
                console.log("Video.js oyuncusu bulundu: CbikoPl");
                initializePlayerInteractions(); // Oynatıcıyı ve olaylarını başlat
                setupPageRefresh(); // Genel yenileme zamanlayıcısını oynatıcıdan sonra kur
            } else if (playerCheckRetries >= maxPlayerCheckRetries) {
                clearInterval(playerCheckInterval);
                console.warn("Video.js oyuncusu 'CbikoPl' belirtilen sürede bulunamadı.");
                // Oyuncu bulunamazsa bile genel yenileme çalışsın
                setupPageRefresh();
            }
        }, 500);

         // Oyuncu bulunamazsa bile onay butonlarını kontrol etmeye başla
         // (Bu, mainInterval içindeki oyuncu kontrolünden bağımsız olarak çalışır)
         // Düzeltme: mainInterval zaten oyuncu olmasa bile çalışıyor, oradaki kontrol yeterli.
         // Sadece mainInterval'deki oyuncu kontrolünü güncelledim.
    });
})();