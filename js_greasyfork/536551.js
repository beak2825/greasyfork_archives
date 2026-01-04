// ==UserScript==
// @name         ÖBA Videoları Gelişmiş Otomatik İzleyici
// @namespace    https://greasyfork.org/tr/users/1472170-mstycnklc
// @version      1.0.3
// @description  ÖBA videolarını gelişmiş özelliklerle (ayarlar, video sonu yenileme ile sonraki videoya geçiş vb.) otomatik olarak izlemenizi sağlar.
// @author       MstyCnklc
// @homepage     https://greasyfork.org/tr/scripts/536543-%C3%B6ba-videolar%C4%B1-geli%C5%9Fmi%C5%9F-otomatik-i-zleyici
// @supportURL   https://greasyfork.org/tr/scripts/536543-%C3%B6ba-videolar%C4%B1-geli%C5%9Fmi%C5%9F-otomatik-i-zleyici/feedback
// @match        https://www.oba.gov.tr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oba.gov.tr
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536551/%C3%96BA%20Videolar%C4%B1%20Geli%C5%9Fmi%C5%9F%20Otomatik%20%C4%B0zleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/536551/%C3%96BA%20Videolar%C4%B1%20Geli%C5%9Fmi%C5%9F%20Otomatik%20%C4%B0zleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Ayarlar ve Varsayılan Değerler ---
    const SCRIPT_PREFIX = 'OBAGelismişIzleyici';

    const DEFAULTS = {
        // autoPlayNext: true, // KALDIRILDI
        // skipIntroSeconds: 0, // KALDIRILDI
        // skipOutroSeconds: 0, // KALDIRILDI
        startMuted: false,
        volumeLevel: 0.75,
        lowVolumeLevel: 0.01,
        refreshForNextVideo: true,      // YENİ AD & ANLAM: Video bitince sonrakine geçmek için sayfayı yenile
        refreshForNextVideoDelay: 5,  // YENİ: Yenileme öncesi bekleme (saniye)
        showNotifications: true,
        hideOriginalVolumeControl: true,
        enableBackgroundPlayFix: true,
    };

    let settings = {};
    let backgroundPlayErrorLogged = false;
    let initialAutoplayAttemptedSuccessfully = false;
    let autoplayRetryCount = 0;
    const MAX_AUTOPLAY_RETRIES = 5;
    const AUTOPLAY_RETRY_DELAY_BASE = 1000;
    // let outroSkipTriggeredForCurrentVideo = false; // KALDIRILDI
    let nextVideoRefreshTimeoutId = null; // Video sonu yenileme için zamanlayıcı ID'si

    // --- DOM Element ID'leri ve Seçiciler ---
    const VIDEO_ELEMENT_ID = "video_html5_api";
    const ORIGINAL_VOLUME_PANEL_SELECTOR = '.vjs-volume-panel';
    // NEXT_VIDEO_INDICATOR_ICON_TEXT, BREADCRUMB_LINK_SELECTOR, DETAIL_PATH_SEGMENT, PLAY_PATH_SEGMENT artık doğrudan kullanılmıyor.
    // Ancak ÖBA'nın yenileme sonrası sonraki videoyu yüklemesi için bu yapının hala var olduğunu varsayıyoruz.

    const CONTROL_PANEL_ID = `${SCRIPT_PREFIX}-controlPanel`;
    const MUTE_BUTTON_ID = `${SCRIPT_PREFIX}-muteButton`;
    const SETTINGS_BUTTON_ID = `${SCRIPT_PREFIX}-settingsButton`;
    const SETTINGS_PANEL_ID = `${SCRIPT_PREFIX}-settingsPanel`;
    const NOTIFICATION_AREA_ID = `${SCRIPT_PREFIX}-notificationArea`;
    const RESET_SETTINGS_BUTTON_ID = `${SCRIPT_PREFIX}-resetSettings`;

    // --- Yardımcı Fonksiyonlar ---
    const log = (message) => console.log(`[${SCRIPT_PREFIX}] ${message}`);
    const warn = (message) => console.warn(`[${SCRIPT_PREFIX}] ${message}`);
    const error = (message) => console.error(`[${SCRIPT_PREFIX}] ${message}`);
    function loadSettings() { for (const key in DEFAULTS) { settings[key] = GM_getValue(`${SCRIPT_PREFIX}_${key}`, DEFAULTS[key]); } log("Ayarlar yüklendi: " + JSON.stringify(settings)); }
    function saveSetting(key, value) { settings[key] = value; GM_setValue(`${SCRIPT_PREFIX}_${key}`, value); log(`Ayar kaydedildi: ${key} = ${value}`); }
    function showNotification(message, duration = 3000, type = 'info') { if (!settings.showNotifications && type !== 'critical') return; let notificationArea = document.getElementById(NOTIFICATION_AREA_ID); if (!notificationArea) { notificationArea = document.createElement('div'); notificationArea.id = NOTIFICATION_AREA_ID; document.body.appendChild(notificationArea); } const notification = document.createElement('div'); notification.className = `notification ${type}`; notification.textContent = message; notificationArea.appendChild(notification); setTimeout(() => { notification.classList.add('hiding'); setTimeout(() => notification.remove(), 600); }, duration); }
    function formatVideoTime(totalSeconds) { if (isNaN(totalSeconds) || !isFinite(totalSeconds) || totalSeconds < 0) { return 'N/A'; } const hours = Math.floor(totalSeconds / 3600); const minutes = Math.floor((totalSeconds % 3600) / 60); const seconds = Math.floor(totalSeconds % 60); let timeString = ""; if (hours > 0) { timeString += `${hours.toString().padStart(2, '0')}:`; } timeString += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; return timeString; }

    // --- CSS Stilleri ---
    // injectStyles fonksiyonu öncekiyle aynı (v7.0.5), kısaltıldı.
    function injectStyles() { GM_addStyle(`#${CONTROL_PANEL_ID}{position:fixed;bottom:10px;right:10px;background-color:rgba(0,0,0,0.9);color:#e0e0e0;padding:8px 12px;border-radius:6px;display:flex;align-items:center;gap:10px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:13px;z-index:99999;box-shadow:0 2px 10px rgba(0,0,0,0.5);border:1px solid #333}#${CONTROL_PANEL_ID} button{background-color:#d32f2f;color:#fff;border:none;padding:6px 10px;border-radius:4px;cursor:pointer;font-size:13px;transition:background-color .2s,transform .1s}#${CONTROL_PANEL_ID} button:hover{background-color:#e53935}#${CONTROL_PANEL_ID} button:active{transform:scale(.95)}#${CONTROL_PANEL_ID} #${SETTINGS_BUTTON_ID}{background-color:#424242}#${CONTROL_PANEL_ID} #${SETTINGS_BUTTON_ID}:hover{background-color:#616161}#${CONTROL_PANEL_ID} #${SETTINGS_BUTTON_ID}.active{background-color:#b71c1c;box-shadow:0 0 5px #b71c1c}#${SETTINGS_PANEL_ID}{display:none;position:fixed;bottom:60px;right:10px;background-color:rgba(15,15,15,0.97);color:#e0e0e0;padding:20px;border-radius:8px;z-index:100000;box-shadow:0 5px 15px rgba(0,0,0,0.6);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:13px;width:380px;border:1px solid #444;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}#${SETTINGS_PANEL_ID} h4{margin-top:0;margin-bottom:20px;text-align:center;color:#fff;border-bottom:1px solid #d32f2f;padding-bottom:10px}#${SETTINGS_PANEL_ID} .setting-row{margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}#${SETTINGS_PANEL_ID} label{margin-right:10px;flex-shrink:0;color:#c5c5c5}#${SETTINGS_PANEL_ID} input[type=checkbox],#${SETTINGS_PANEL_ID} input[type=number],#${SETTINGS_PANEL_ID} select,#${SETTINGS_PANEL_ID} input[type=range]{margin-left:8px;padding:5px 8px;border-radius:4px;border:1px solid #555;background-color:#252525;color:#e0e0e0}#${SETTINGS_PANEL_ID} input[type=checkbox]{cursor:pointer}#${SETTINGS_PANEL_ID} input[type=number]:focus,#${SETTINGS_PANEL_ID} select:focus,#${SETTINGS_PANEL_ID} input[type=range]:focus{border-color:#d32f2f;box-shadow:0 0 5px rgba(211,47,47,0.5);outline:0}#${SETTINGS_PANEL_ID} input[type=number]{width:50px;text-align:center}#${SETTINGS_PANEL_ID} .button-row{margin-top:20px;text-align:right}#${SETTINGS_PANEL_ID} #${RESET_SETTINGS_BUTTON_ID}{background-color:#b71c1c;color:#fff;padding:8px 15px;border:none;border-radius:4px;cursor:pointer;transition:background-color .2s}#${SETTINGS_PANEL_ID} #${RESET_SETTINGS_BUTTON_ID}:hover{background-color:#d32f2f}#${NOTIFICATION_AREA_ID}{position:fixed;top:20px;right:20px;z-index:100001;display:flex;flex-direction:column;gap:10px}#${NOTIFICATION_AREA_ID} .notification{background-color:rgba(30,30,30,0.9);color:#fff;padding:12px 18px;border-radius:6px;box-shadow:0 3px 7px rgba(0,0,0,0.35);opacity:1;transition:opacity .5s ease-out,transform .5s ease-out;transform:translateX(0);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-size:14px}#${NOTIFICATION_AREA_ID} .notification.error{background-color:#c62828}#${NOTIFICATION_AREA_ID} .notification.success{background-color:#2e7d32}#${NOTIFICATION_AREA_ID} .notification.hiding{transform:translateX(120%);opacity:0}`); }


    // --- UI Oluşturma ---
    let videoElement;
    function createControlPanel(){const e=document.createElement("div");e.id=CONTROL_PANEL_ID,e.innerHTML=`<button id="${MUTE_BUTTON_ID}" title="Sesi Aç/Kapat"></button><button id="${SETTINGS_BUTTON_ID}" title="Ayarlar">⚙️</button>`,document.body.appendChild(e),document.getElementById(MUTE_BUTTON_ID).onclick=toggleMute,document.getElementById(SETTINGS_BUTTON_ID).onclick=toggleSettingsPanel,updateMuteButtonUI()}
    function createSettingsPanel(){const e=document.createElement("div");e.id=SETTINGS_PANEL_ID,e.innerHTML=`<h4>Gelişmiş İzleyici Ayarları</h4>
        <div class="setting-row"><label for="${SCRIPT_PREFIX}-refreshForNextVideoToggle">Video Bitince Sonrakine Geç (Yenileyerek):</label><input type="checkbox" id="${SCRIPT_PREFIX}-refreshForNextVideoToggle"></div>
        <div class="setting-row"><label for="${SCRIPT_PREFIX}-refreshForNextVideoDelayInput">Sonraki Video İçin Yenileme Gecikmesi (sn):</label><input type="number" id="${SCRIPT_PREFIX}-refreshForNextVideoDelayInput" min="0" step="1"></div>
        <div class="setting-row"><label for="${SCRIPT_PREFIX}-startMutedToggle">Kısık Sesle Başlat:</label><input type="checkbox" id="${SCRIPT_PREFIX}-startMutedToggle"></div>
        <div class="setting-row"><label for="${SCRIPT_PREFIX}-defaultVolumeSlider">Ses Seviyesi (Açıkken):</label><input type="range" id="${SCRIPT_PREFIX}-defaultVolumeSlider" min="0" max="1" step="0.01" style="flex-grow: 1;"><span id="${SCRIPT_PREFIX}-volumeValueLabel" style="min-width: 35px; text-align: right;"></span></div>
        <div class="setting-row"><label for="${SCRIPT_PREFIX}-hideOriginalVolumeToggle">Orijinal Ses Kontrolünü Gizle:</label><input type="checkbox" id="${SCRIPT_PREFIX}-hideOriginalVolumeToggle"></div>
        <div class="setting-row"><label for="${SCRIPT_PREFIX}-showNotificationsToggle">Bildirimleri Göster:</label><input type="checkbox" id="${SCRIPT_PREFIX}-showNotificationsToggle"></div>
        <div class="setting-row"><label for="${SCRIPT_PREFIX}-enableBackgroundPlayFixToggle">Arkaplan Oynatma Düzeltmesi:</label><input type="checkbox" id="${SCRIPT_PREFIX}-enableBackgroundPlayFixToggle"></div>
        <div class="button-row"><button id="${RESET_SETTINGS_BUTTON_ID}" title="Tüm ayarları varsayılan fabrika ayarlarına döndürür.">Ayarları Sıfırla</button></div>
        `,document.body.appendChild(e),populateSettingsPanel()}
    function populateSettingsPanel(){const e=document.getElementById(SETTINGS_PANEL_ID);if(e){const t=t=>e.querySelector(`#${SCRIPT_PREFIX}-${t}`);
        // autoPlayNext, skipIntro, skipOutro UI ve logiği kaldırıldı.
        const refreshForNextVideoToggle = t("refreshForNextVideoToggle"); refreshForNextVideoToggle.checked = settings.refreshForNextVideo; refreshForNextVideoToggle.onchange = (e) => { saveSetting('refreshForNextVideo', e.target.checked); showNotification(`Video bitince sonraki için yenileme ${e.target.checked ? 'aktif' : 'devre dışı'}.`); };
        const refreshForNextVideoDelayInput = t("refreshForNextVideoDelayInput"); refreshForNextVideoDelayInput.value = settings.refreshForNextVideoDelay; refreshForNextVideoDelayInput.onchange = (e) => { const val = parseInt(e.target.value, 10); if (!isNaN(val) && val >= 0) { saveSetting('refreshForNextVideoDelay', val); showNotification(`Sonraki video için yenileme gecikmesi ${val}sn olarak ayarlandı.`); } else { e.target.value = settings.refreshForNextVideoDelay; }};
        t("startMutedToggle").checked=settings.startMuted,t("startMutedToggle").onchange=e=>{saveSetting("startMuted",e.target.checked),applyVolumeSettings(),showNotification(`Kısık sesle başlatma ${e.target.checked?"aktif":"devre dışı"}.`)};const o=t("defaultVolumeSlider"),n=t("volumeValueLabel");o.value=settings.volumeLevel,n.textContent=Math.round(100*settings.volumeLevel)+"%",o.oninput=()=>n.textContent=Math.round(100*o.value)+"%",o.onchange=e=>{const t=parseFloat(e.target.value);saveSetting("volumeLevel",t),settings.startMuted&&!(videoElement&&videoElement.volume>settings.lowVolumeLevel)||(videoElement&&(videoElement.volume=t,videoElement.muted=!1)),updateMuteButtonUI(),showNotification(`Varsayılan ses seviyesi %${Math.round(100*t)} olarak ayarlandı.`)};
        t("hideOriginalVolumeToggle").checked=settings.hideOriginalVolumeControl,t("hideOriginalVolumeToggle").onchange=e=>{saveSetting("hideOriginalVolumeControl",e.target.checked),toggleOriginalVolumeControl(e.target.checked),showNotification(`Orijinal ses kontrolünü gizleme ${e.target.checked?"aktif":"devre dışı"}.`)},t("showNotificationsToggle").checked=settings.showNotifications,t("showNotificationsToggle").onchange=e=>{saveSetting("showNotifications",e.target.checked),e.target.checked&&showNotification("Bildirimler aktif.")};const a=t("enableBackgroundPlayFixToggle");a.checked=settings.enableBackgroundPlayFix,a.onchange=e=>{saveSetting("enableBackgroundPlayFix",e.target.checked),showNotification(`Arkaplan oynatma düzeltmesi ${e.target.checked?"aktif":"devre dışı"}. Değişiklik için sayfa yenilemesi gerekebilir.`),applyAllSettingsToPlayer()},document.getElementById(RESET_SETTINGS_BUTTON_ID).onclick=()=>{confirm("Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?")&&(Object.keys(DEFAULTS).forEach(e=>{GM_setValue(`${SCRIPT_PREFIX}_${e}`,DEFAULTS[e])}),loadSettings(),populateSettingsPanel(),applyAllSettingsToPlayer(),showNotification("Ayarlar varsayılan değerlere sıfırlandı.",3e3,"success"))}}}
    const handleClickOutsideSettings=e=>{const t=document.getElementById(SETTINGS_PANEL_ID),o=document.getElementById(SETTINGS_BUTTON_ID);t&&"block"===t.style.display&&o?(t.contains(e.target)||o.contains(e.target)||(t.style.display="none",o.classList.remove("active"),document.removeEventListener("click",handleClickOutsideSettings,!0),log("Ayarlar paneli dışarıya tıklanarak kapatıldı."))):document.removeEventListener("click",handleClickOutsideSettings,!0)};function toggleSettingsPanel(){const e=document.getElementById(SETTINGS_PANEL_ID),t=document.getElementById(SETTINGS_BUTTON_ID);if(e&&t){const o="none"===e.style.display;o?(e.style.display="block",t.classList.add("active"),setTimeout(()=>{document.addEventListener("click",handleClickOutsideSettings,!0)},0),(initialAutoplayAttemptedSuccessfully||videoElement?.currentTime>0)&&showNotification("Ayarlar paneli açıldı.",1500)):(e.style.display="none",t.classList.remove("active"),document.removeEventListener("click",handleClickOutsideSettings,!0))}}

    // --- Oynatıcı Kontrolleri ---
    function applyVolumeSettings(){if(!videoElement)return;settings.startMuted?videoElement.volume=settings.lowVolumeLevel:(videoElement.volume=settings.volumeLevel,videoElement.muted=!1),updateMuteButtonUI()} function toggleMute(){if(!videoElement)return;const e=videoElement.volume<=settings.lowVolumeLevel||videoElement.muted;e?(videoElement.volume=settings.volumeLevel,videoElement.muted=!1,showNotification(`Ses açıldı (%${Math.round(100*videoElement.volume)})`,1500)):(videoElement.volume=settings.lowVolumeLevel,videoElement.muted=!0,showNotification("Ses kısıldı",1500)),updateMuteButtonUI()} function updateMuteButtonUI(){const e=document.getElementById(MUTE_BUTTON_ID);if(!e||!videoElement)return;const t=videoElement.volume<=settings.lowVolumeLevel||videoElement.muted;e.textContent=t?"🔇":"🔊",e.title=t?"Sesi Aç":"Sesi Kıs"} let originalVolumePanel={element:null,parent:null,nextSibling:null};function toggleOriginalVolumeControl(e){e?(!originalVolumePanel.element&&(originalVolumePanel.element=document.querySelector(ORIGINAL_VOLUME_PANEL_SELECTOR),originalVolumePanel.element&&(originalVolumePanel.parent=originalVolumePanel.element.parentNode,originalVolumePanel.nextSibling=originalVolumePanel.element.nextSibling)),originalVolumePanel.element&&originalVolumePanel.element.parentNode&&(originalVolumePanel.element.parentNode.removeChild(originalVolumePanel.element),log("Orijinal ses kontrol paneli kaldırıldı."))):originalVolumePanel.element&&originalVolumePanel.parent&&!document.querySelector(ORIGINAL_VOLUME_PANEL_SELECTOR)?(originalVolumePanel.nextSibling?originalVolumePanel.parent.insertBefore(originalVolumePanel.element,originalVolumePanel.nextSibling):originalVolumePanel.parent.appendChild(originalVolumePanel.element),log("Orijinal ses kontrol paneli geri yüklendi.")):originalVolumePanel.element||warn("Orijinal ses kontrol paneli hiç bulunamadığı için geri yüklenemiyor.")}

    // --- Ana Mantık ---
    let keepPlayingIntervalId = null;

    function attemptAutoPlay(reason = "bilinmiyor") {
        if (!videoElement || videoElement.ended || (!videoElement.paused && initialAutoplayAttemptedSuccessfully)) { if (videoElement && !videoElement.paused && !videoElement.ended) { initialAutoplayAttemptedSuccessfully = true; autoplayRetryCount = 0; } return; }
        if (initialAutoplayAttemptedSuccessfully && videoElement.paused) { return; }
        log(`Otomatik oynatma denemesi #${autoplayRetryCount + 1} (${reason})...`);
        videoElement.play().then(() => {
            videoElement.playbackRate = 1.0; // Hız her zaman 1.0x
            log(`Video otomatik oynatılıyor (${reason}).`);
            if (!initialAutoplayAttemptedSuccessfully) { showNotification(`Video başlatıldı`, 2000); }
            initialAutoplayAttemptedSuccessfully = true;
            autoplayRetryCount = 0;
            // outroSkipTriggeredForCurrentVideo = false; // KALDIRILDI
            // Giriş atlama logiği kaldırıldı
        }).catch(playError => {
            warn(`Video otomatik başlatılamadı (${reason}, deneme #${autoplayRetryCount + 1}): ${playError.message}`);
            autoplayRetryCount++;
            if (autoplayRetryCount < MAX_AUTOPLAY_RETRIES) {
                const delay = AUTOPLAY_RETRY_DELAY_BASE * autoplayRetryCount;
                log(`${delay / 1000} saniye sonra tekrar denenecek...`);
                setTimeout(() => attemptAutoPlay(`yeniden deneme (${reason})`), delay);
            } else {
                warn(`Maksimum otomatik oynatma denemesine (${MAX_AUTOPLAY_RETRIES}) ulaşıldı.`);
                if (!initialAutoplayAttemptedSuccessfully) { showNotification("Video otomatik başlatılamadı. Lütfen oynat tuşuna basın.", 5000, 'error');}
            }
        });
    }
    // findAndPlayNextVideo() fonksiyonu kaldırıldı.
    function tryToPreventBackgroundPausing(enablePeriodicCheck = true) { if (keepPlayingIntervalId) { clearInterval(keepPlayingIntervalId); keepPlayingIntervalId = null; } if (!settings.enableBackgroundPlayFix || !enablePeriodicCheck || !videoElement) { log("Arkaplanda oynatma için periyodik kontrol devreden çıkarıldı veya gerekli koşullar sağlanmadı."); return; } log("Arkaplanda oynatma için periyodik kontrolcü devrede (deneysel)."); keepPlayingIntervalId = setInterval(() => { if (videoElement.paused && !videoElement.ended) { videoElement.play().catch(e => { if (!backgroundPlayErrorLogged) { warn(`Arkaplanda devam ettirme denemesi (periyodik) başarısız oldu. Tarayıcı engellemiş olabilir. Bu uyarı bir daha gösterilmeyecektir. Detay: ${e.message}`); backgroundPlayErrorLogged = true; } }); } }, 2500); }
    // setupDynamicRefresh ve clearDynamicRefresh fonksiyonları kaldırıldı.

    function handleVideoEnd(){
        log("Video bitti.");
        initialAutoplayAttemptedSuccessfully = false;
        autoplayRetryCount = 0;
        // outroSkipTriggeredForCurrentVideo = false; // KALDIRILDI

        if (nextVideoRefreshTimeoutId) { // Eğer önceki bir zamanlayıcı varsa temizle
            clearTimeout(nextVideoRefreshTimeoutId);
            nextVideoRefreshTimeoutId = null;
        }

        if (settings.refreshForNextVideo) {
            const delaySeconds = settings.refreshForNextVideoDelay >= 0 ? settings.refreshForNextVideoDelay : 5;
            log(`Video bitti. Sonraki videoya geçmek için sayfa ${delaySeconds} saniye sonra yenilenecek.`);
            showNotification(`Video bitti. Sonraki için sayfa ${delaySeconds}sn sonra yenileniyor...`, (delaySeconds * 1000) - Math.min(500, delaySeconds * 1000) ); // Bildirim süresi max 4.5sn veya gecikme-0.5sn
            nextVideoRefreshTimeoutId = setTimeout(() => {
                window.location.reload();
            }, delaySeconds * 1000);
        } else {
            showNotification("Video bitti. Otomatik sonraki video (yenileme ile) devre dışı.", 3000);
            log("Tüm videolar tamamlandı veya sonraki video için yenileme ayarı kapalı.");
        }
    }

    function applyAllSettingsToPlayer() {
        if (!videoElement) return;
        videoElement.playbackRate = 1.0;
        applyVolumeSettings();
        toggleOriginalVolumeControl(settings.hideOriginalVolumeControl);
        // Dinamik/Periyodik yenileme ile ilgili eski çağrılar kaldırıldı. Yenileme sadece handleVideoEnd'de.
        if (settings.enableBackgroundPlayFix) { tryToPreventBackgroundPausing(true); }
        else { tryToPreventBackgroundPausing(false); }
    }

    function initialize() {
        log("Betik başlatılıyor...");
        loadSettings();
        injectStyles();
        initialAutoplayAttemptedSuccessfully = false;
        autoplayRetryCount = 0;
        // outroSkipTriggeredForCurrentVideo = false; // KALDIRILDI

        if (settings.enableBackgroundPlayFix) {
            try { Object.defineProperty(document, 'hidden', { value: false, configurable: true, writable: false }); Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true, writable: false }); if (document.hidden === false && document.visibilityState === 'visible') { log("Page Visibility API (hidden & visibilityState) ayarlandı."); } else { warn("Page Visibility API (hidden & visibilityState) ayarlanamadı."); } document.dispatchEvent(new Event('visibilitychange')); } catch (e) { warn(`Page Visibility API (hidden & visibilityState) ayarlanamadı: ${e.message}.`); }
            try { if (typeof document.hasFocus === 'function') { Object.defineProperty(document, 'hasFocus', { value: () => true, configurable: true, writable: false }); if (document.hasFocus() === true) { log("document.hasFocus() her zaman true dönecek şekilde ayarlandı."); } else { warn("document.hasFocus() ayarlanamadı."); } } } catch (e) { warn(`document.hasFocus() ayarlanamadı: ${e.message}.`); }
        }

        videoElement = document.getElementById(VIDEO_ELEMENT_ID);
        if (!videoElement) { error("Video elementi bulunamadı. Betik sonlandırılıyor."); return; }
        log("Video elementi bulundu.");

        window.onblur = () => { if (settings.enableBackgroundPlayFix && videoElement && videoElement.paused && !videoElement.ended) { videoElement.play().catch(e => {}); } };
        window.onfocus = () => {};

        createControlPanel();
        createSettingsPanel();

        if (videoElement) {
            applyVolumeSettings();
            toggleOriginalVolumeControl(settings.hideOriginalVolumeControl);
            if (settings.enableBackgroundPlayFix) { tryToPreventBackgroundPausing(true); }
            else { tryToPreventBackgroundPausing(false); }
        }

        videoElement.onloadedmetadata = () => {
            log(`Video metadata yüklendi. Süre: ${formatVideoTime(videoElement.duration)}`);
            // outroSkipTriggeredForCurrentVideo = false; // KALDIRILDI
            applyAllSettingsToPlayer(); // Ses vb. ayarlar için
            if (videoElement.paused && !initialAutoplayAttemptedSuccessfully) {
                attemptAutoPlay("loadedmetadata");
            }
        };
        videoElement.oncanplay = () => { log("Video 'canplay' durumunda."); /* outroSkipTriggeredForCurrentVideo = false; */ if (videoElement.paused && !initialAutoplayAttemptedSuccessfully) { attemptAutoPlay("canplay"); } };
        // videoElement.ontimeupdate kaldırıldı (outro skip için kullanılıyordu)
        videoElement.onvolumechange = () => { if (document.getElementById(CONTROL_PANEL_ID)) { updateMuteButtonUI(); if (videoElement.volume > settings.lowVolumeLevel && !videoElement.muted) { saveSetting('volumeLevel', videoElement.volume); const vs = document.getElementById(`${SCRIPT_PREFIX}-defaultVolumeSlider`); const vl = document.getElementById(`${SCRIPT_PREFIX}-volumeValueLabel`); if (vs) vs.value = videoElement.volume; if (vl) vl.textContent = Math.round(videoElement.volume*100)+'%'; } } };
        videoElement.onended = handleVideoEnd;

        setTimeout(() => { if (videoElement.paused && !initialAutoplayAttemptedSuccessfully) { attemptAutoPlay("initial timeout"); } }, 250);
    }

    // --- Betiği Başlat ---
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initialize); }
    else { initialize(); }

})();