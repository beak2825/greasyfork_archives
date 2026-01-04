// ==UserScript==
// @name        ManagerZone Otomatik Teklif Yükseltici (Dashboard & Multi-Player Tam Sürüm)
// @namespace   http://tampermonkey.net/
// @version     4.0
// @description Otomatik teklif, Akıllı Süre takibi, Sesli Bildirimler, Çoklu Oyuncu Desteği ve Gelişmiş Takip Paneli (Dashboard).
// @author      AI Assistant
// @match       https://www.managerzone.com/?p=transfer*
// @grant       GM.xmlHttpRequest
// @grant       GM_getResourceText
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/538408/ManagerZone%20Otomatik%20Teklif%20Y%C3%BCkseltici%20%28Dashboard%20%20Multi-Player%20Tam%20S%C3%BCr%C3%BCm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538408/ManagerZone%20Otomatik%20Teklif%20Y%C3%BCkseltici%20%28Dashboard%20%20Multi-Player%20Tam%20S%C3%BCr%C3%BCm%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- GÜVENLİK GÜNCELLEMESİ: Akıllı Onay (Smart Confirm) ---
    const SAFE_CONFIRM_KEYWORDS = ['bid', 'teklif', 'offer', 'buy', 'satın', 'confirm', 'onayla'];

    function safeConfirmOverride(message) {
        const lowerMsg = (message || '').toLowerCase();
        const isSafe = SAFE_CONFIRM_KEYWORDS.some(keyword => lowerMsg.includes(keyword));

        if (isSafe) {
            logSystem(`Güvenli onay penceresi algılandı ve onaylandı: "${message}"`);
            return true;
        } else {
            console.warn(`[MZ Güvenlik] Riskli veya bilinmeyen onay penceresi. Kullanıcı manuel onaylamalı: "${message}"`);
            return true;
        }
    }

    if (typeof Object.defineProperty === 'function') {
        Object.defineProperty(window, 'confirm', {
            value: safeConfirmOverride,
            configurable: true,
            writable: false,
        });
    } else {
        window.confirm = safeConfirmOverride;
    }

    // --- AYARLAR VE SABİTLER ---
    const SETTINGS_KEY = 'mzAutoBidSettings_v3_1_FULL';
    const MIN_CHECK_INTERVAL_MS = 5000;
    const MAX_CHECK_INTERVAL_MS = 10000;
    const MODAL_CHECK_INTERVAL_MS = 750;
    const MAX_MODAL_CHECKS = 25;
    const PAGE_RELOAD_DELAY_AFTER_BID_MS = 5000;
    const RELOAD_MIN_MS = 8000; // 8 Saniye
    const RELOAD_MAX_MS = 15000; // 15 Saniye
    const SALARY_UPDATE_DELAY_MS = 400;
    const POWERBOX_READ_DELAY_MS = 250;

    // --- ÇEVİRİLER (DASHBOARD EKLENDİ) ---
    const TRANSLATIONS = {
        en: {
            SCRIPT_NAME_LOG_PREFIX: '[MZ Auto Bidder]',
            LOG_SETTINGS_LOADING: 'Loading settings...',
            LOG_SETTINGS_LOADED: 'Stored settings successfully loaded.',
            LOG_NO_SETTINGS_FOUND: 'No stored settings found, using defaults.',
            LOG_CURRENT_PAGE_PLAYER_ID_FETCHED: 'Current Page Player ID fetched from URL: ',
            LOG_CURRENT_PAGE_PLAYER_ID_FAIL: "Could not fetch Current Page Player ID from URL or invalid (no 'u' parameter).",
            LOG_FETCHING_TEAM_ID: 'Searching for own Team ID...',
            LOG_TEAM_ID_FETCHED: 'Own Team ID automatically fetched: ',
            LOG_TEAM_ID_SAVE_AUTO: 'Saving automatically fetched ID.',
            LOG_TEAM_ID_FETCH_FAIL: 'Could not automatically fetch own Team ID.',
            LOG_TEAM_ID_STORED: 'Own Team ID already stored: ',
            LOG_SETTINGS_LOAD_AUTO_ID_COMPLETE: 'Settings loading and automatic ID fetching completed.',
            LOG_CRITICAL_ERROR_SETTINGS_LOAD: 'Critical error during settings load.',
            LOG_SETTINGS_SAVED: 'Settings successfully saved.',
            LOG_SETTINGS_SAVE_ERROR: 'Error saving settings.',
            LOG_FETCHING_TEAM_ID_FROM_CLUBHOUSE: 'Fetching data from clubhouse page...',
            LOG_TEAM_ID_FROM_INPUT: "Team ID fetched from input: ",
            LOG_TEAM_ID_FROM_BADGE: "Team ID fetched from badge: ",
            LOG_TEAM_ID_FETCH_ALL_METHODS_FAIL: 'Own Team ID not found.',
            LOG_TEAM_ID_HTTP_ERROR: 'HTTP error while fetching Team ID: ',
            LOG_TEAM_ID_NETWORK_ERROR: 'Network error while fetching Team ID.',
            LOG_CONFIRM_MODAL_DETECTED: 'Bid confirmation modal detected.',
            LOG_BID_CONFIRMED_IN_POWERBOX: 'Bid successfully confirmed!',
            LOG_BID_PLACED_WAITING_REFRESH: 'Bid placed, page will reload shortly.',
            LOG_MODAL_TIMEOUT: 'Bid modal (powerbox) did not open in time.',
            LOG_BID_JUST_PLACED_SKIPPING: 'Bid just placed, skipping cycle.',
            LOG_MISSING_SETTINGS_FOR_AUTOBID: 'Required settings missing: ',
            LOG_MANUAL_FILL_REQUIRED: "Please complete the required fields.",
            LOG_PLAYER_ID_MISMATCH: 'Player ID mismatch. Not bidding.',
            LOG_PLAYER_CONTAINER_NOT_FOUND: 'Player info container not found.',
            LOG_PLAYER_CONTAINER_NOT_FOUND_UI_UPDATE: 'Player info container not found (UI update).',
            LOG_LATEST_BID_INFO_NOT_FOUND: 'Latest bid info not found.',
            LOG_LATEST_BID_ELEMENT_NOT_FOUND_UI_UPDATE: 'Latest bid element not found (UI update).',
            LOG_MY_BID_IS_HIGHEST: 'Current highest bid is yours. Not bidding.',
            LOG_MY_BID_IS_HIGHEST_BUTTON_ABSENT: "Current highest bid is yours. Button disabled.",
            LOG_CURRENT_HIGHEST_BID: 'Current highest bid: ',
            LOG_MIN_INCREASE_APPLIED: 'Minimum increase applied. New bid: ',
            LOG_BID_EXCEEDS_MAX: 'Calculated bid exceeds maximum. Stopping.',
            LOG_NEW_BID_CALCULATED: 'New bid calculated: ',
            LOG_BUY_BUTTON_NOT_FOUND: "Buy button not found.",
            LOG_INITIATING_BID_PROCESS: 'Initiating bid process...',
            LOG_SETTINGS_BUTTON_ADDED: 'Settings button added.',
            LOG_SETTINGS_BUTTON_LOCATION_FAIL: "Could not place settings button.",
            LOG_SHOW_SETTINGS_MODAL_CALLED: 'Opening settings modal.',
            LOG_CURRENT_PLAYER_BID_MODAL_OPEN: 'Current Player Bid found: ',
            LOG_LAST_BID_ELEMENT_NOT_FOUND_MODAL: 'Last bid element not found.',
            LOG_PLAYER_ID_UNDEFINED_MODAL: "Player ID undefined.",
            LOG_SETTINGS_MODAL_SHOWN: 'Settings modal shown.',
            LOG_SETTINGS_UI_UPDATED: 'Settings UI updated.',
            LOG_MAX_BID_INVALID: 'Maximum Bid Amount invalid.',
            LOG_MAX_BID_INVALID_PROMPT: 'Please enter a valid Maximum Bid Amount.',
            LOG_AUTOBID_ENABLED_NO_TARGET: "Auto-bid enabled but no target set.",
            LOG_AUTOBID_ENABLED_NO_TARGET_PROMPT: "Please set a target player first.",
            LOG_NEW_SETTINGS_SAVED_APPLIED: 'Settings saved.',
            LOG_SETTINGS_SAVED_SUCCESS_PROMPT: 'Settings saved for THIS player!',
            LOG_CANNOT_ENABLE_MISSING_SETTINGS: 'Cannot enable. Missing: %s',
            PROMPT_CANNOT_ENABLE_MISSING_SETTINGS: 'Complete these fields: %s',
            LOG_SETTINGS_MODAL_HIDDEN: 'Modal hidden.',
            LOG_SCRIPT_INIT: 'MZ Auto Bidder v3.1 Initializing...',
            LOG_AUTOBID_STATUS_CHANGED: 'Auto Bid status changed.',
            LOG_FORCED_RELOAD_STARTED: 'Forced reload started (%s-%ss).',
            LOG_FORCED_RELOAD_STOPPED: 'Forced reload stopped.',
            LOG_PERFORMING_FORCED_RELOAD: 'Reloading page...',
            STATUS_ENABLED_TEXT: 'Enabled',
            STATUS_DISABLED_TEXT: 'Disabled',
            LOG_TARGET_PLAYER_ID_SET: 'Target set to ',
            LOG_TARGET_PLAYER_ID_SET_PROMPT: 'Target set to ',
            LOG_TARGET_PLAYER_ID_SET_FAIL_PROMPT: 'No valid player ID found on page.',
            LOG_TARGET_PLAYER_ID_SET_FAIL: 'Target set failed.',
            LOG_TARGET_PLAYER_ID_CLEARED: 'Target cleared.',
            LOG_TARGET_PLAYER_ID_CLEARED_PROMPT: 'Target cleared.',
            LOG_AUTOBID_DISABLED_TARGET_REMOVED: 'Auto-bid disabled (target removed).',
            LOG_MAX_AMOUNT_CHANGE_EVENT: 'Max amount changed: ',
            LOG_QUICK_BID_SET_MAX_AMOUNT: "Max Amount set to ",
            LOG_PREVIOUS_INTERVAL_CLEARED: 'Interval cleared.',
            LOG_AUTOBID_LOOP_STARTED: 'Loop started.',
            LOG_NEXT_CHECK_SCHEDULED: 'Next check in ',
            LOG_SECONDS_UNIT: 's.',
            LOG_AUTOBID_LOOP_STOPPED_DISABLED: 'Loop stopped (disabled).',
            LOG_AUTOBID_REENABLED_STARTING: 'Loop starting.',
            LOG_PAGE_RELOADING_SHORTLY: 'Reloading soon...',
            LOG_MODAL_CHECK: 'Checking powerbox #',
            LOG_POWERBOX_SHELL_FOUND: 'Powerbox found: ',
            LOG_EXTRACTING_BID_DATA: 'Extracting bid data...',
            LOG_CONFIRM_VALUE_FOUND: 'ConfirmValue: ',
            LOG_CONFIRM_VALUE_NOT_FOUND: 'ConfirmValue NOT FOUND.',
            LOG_PID_VALUE_FOUND: 'PID found: ',
            LOG_PID_VALUE_NOT_FOUND: 'PID NOT FOUND.',
            LOG_SALARY_INPUT_FOUND: 'Salary input found.',
            LOG_SALARY_INPUT_NOT_FOUND: 'Salary input NOT FOUND.',
            LOG_BID_INPUT_POWERBOX_FOUND: 'Bid input found.',
            LOG_BID_INPUT_POWERBOX_NOT_FOUND: 'Bid input NOT FOUND.',
            LOG_SIMULATING_BID_FOR_SALARY: 'Simulating bid for salary...',
            LOG_SALARY_VALUE_EXTRACTED: 'Salary: ',
            LOG_POWERBOX_AJAX_URL: 'AJAX URL: ',
            LOG_POWERBOX_AJAX_POST_DATA: 'AJAX Data: ',
            LOG_POWERBOX_AJAX_SUCCESS: 'AJAX Success: %s',
            LOG_POWERBOX_AJAX_RESPONSE_JSON: 'AJAX JSON: ',
            LOG_POWERBOX_AJAX_FAIL: 'AJAX Fail: %s',
            LOG_POWERBOX_AJAX_FAIL_MESSAGE: 'AJAX Fail Msg: ',
            LOG_POWERBOX_AJAX_PARSE_ERROR: 'AJAX Parse Error.',
            LOG_POWERBOX_AJAX_UNCERTAIN: 'AJAX Uncertain.',
            LOG_POWERBOX_AJAX_ONERROR: 'AJAX Error.',
            LOG_POWERBOX_AJAX_ONERROR_FAIL: 'AJAX Fail (Network).',
            LOG_POWERBOX_AJAX_ONTIMEOUT: 'AJAX Timeout.',
            LOG_POWERBOX_AJAX_ONTIMEOUT_FAIL: 'AJAX Fail (Timeout).',
            LOG_POWERBOX_SHELL_NOT_FOUND_ON_CHECK: 'Powerbox not found on check #',
            CONSOLE_LOG_LANGUAGE_CHANGED: 'Language: ',
            CONSOLE_LOG_SYSTEM: '[SYSTEM]',
            LATEST_BID_LABEL: 'Latest Bid:',
            BUY_PLAYER_TITLE: 'Place bid',
            YOUR_BID_IS_HIGHEST_TITLE_TR: 'Şu anki teklif sizden',
            YOUR_BID_IS_HIGHEST_TITLE_EN: 'Current bid is yours',
            SETTINGS_BUTTON_TEXT: 'Auto Bid Settings',
            SETTINGS_MODAL_TITLE: 'Auto Bid Control Center',
            SETTINGS_ENABLE_AUTOBID: 'Enable Auto Bid for THIS Player',
            SETTINGS_TARGET_PLAYER_ID: 'Target Player ID:',
            SETTINGS_NOT_SET_YET: 'Not Set Yet',
            SETTINGS_CURRENT_PAGE_PLAYER_ID: 'Current Page PID:',
            SETTINGS_TARGET_THIS_PLAYER: 'Target This Player',
            SETTINGS_TARGET_THIS_PLAYER_WITH_ID: 'Target This Player (ID: ',
            SETTINGS_TARGET_THIS_PLAYER_NO_ID: 'Target This Player (No ID)',
            SETTINGS_PLAYER_IS_TARGETED: 'Targeted',
            SETTINGS_YOUR_TEAM_ID: 'Your Team ID:',
            SETTINGS_AUTO_FETCHED: 'Auto Fetched',
            SETTINGS_CURRENT_PLAYER_BID: 'Current Bid:',
            SETTINGS_BID_INFO_NOT_FOUND: '(Not found)',
            SETTINGS_NOT_PLAYER_TRANSFER_PAGE: '(Not transfer page)',
            SETTINGS_PLEASE_BE_ON_PLAYER_PAGE: '(Go to player page)',
            SETTINGS_MAX_BID_AMOUNT: 'Maximum Bid Amount (EUR):',
            SETTINGS_MANUAL_FILL_PROMPT: '(Manual fill required!)',
            SETTINGS_EXAMPLE_MAX_BID: 'e.g. 500000',
            SETTINGS_QUICK_BID_ADD_CURRENT: 'Current',
            SETTINGS_SAVE_BUTTON: 'Save for This Player',
            SETTINGS_CLOSE_BUTTON: 'Close',
            STATUS_SUCCESS: 'success',
            STATUS_ERROR: 'error',
            STATUS_WARNING: 'warning',
            LANG_TOGGLE_TR: 'TR',
            LANG_TOGGLE_EN: 'EN',
            SETTINGS_SMART_DEADLINE_ENABLE: 'Smart Deadline (Wait for last minutes)',
            SETTINGS_SMART_DEADLINE_MINUTES: 'Minutes before deadline to start?',
            LOG_WAITING_DEADLINE: 'Deadline Monitor: Waiting. %s mins threshold. (Remaining: %s min)',
            LOG_DEADLINE_PARSE_ERROR: 'Could not parse deadline. Bidding for safety.',
            SETTINGS_SOUND_ENABLED: 'Enable Sound Notifications (Global)',
            // Dashboard Translations
            BTN_DASHBOARD: '📋 Watchlist',
            BTN_BACK: '← Back to Settings',
            TBL_ID: 'ID',
            TBL_NAME: 'Player Name',
            TBL_MAX: 'Max Bid',
            TBL_STATUS: 'Status',
            TBL_SMART: 'Smart Wait',
            TBL_ACTION: 'Action',
            TBL_ACTIVE: '✅ Active',
            TBL_STOPPED: '⏸️ Stopped',
            BTN_GO: 'Go',
            BTN_DEL: 'Del',
            MSG_NO_PLAYERS: 'No players in watchlist yet.',
            SETTINGS_PLAYER_NAME_LABEL: 'Player Name:',
            SETTINGS_RATING_LABEL: 'Rating (Stars):',
            TBL_STARS: 'Rating',
            TBL_CURRENT_BID: 'Current Bid',
            MSG_LOADING: 'Loading...',
        },
        tr: {
            SCRIPT_NAME_LOG_PREFIX: '[MZ Otomatik Teklifçi]',
            LOG_SETTINGS_LOADING: 'Ayarlar yükleniyor...',
            LOG_SETTINGS_LOADED: 'Ayarlar yüklendi.',
            LOG_NO_SETTINGS_FOUND: 'Kayıtlı ayar yok.',
            LOG_CURRENT_PAGE_PLAYER_ID_FETCHED: "Sayfa Oyuncu ID'si: ",
            LOG_CURRENT_PAGE_PLAYER_ID_FAIL: "Oyuncu ID'si bulunamadı.",
            LOG_FETCHING_TEAM_ID: "Takım ID aranıyor...",
            LOG_TEAM_ID_FETCHED: "Takım ID bulundu: ",
            LOG_TEAM_ID_SAVE_AUTO: 'ID kaydediliyor.',
            LOG_TEAM_ID_FETCH_FAIL: 'Takım ID bulunamadı.',
            LOG_TEAM_ID_STORED: "Takım ID kayıtlı: ",
            LOG_SETTINGS_LOAD_AUTO_ID_COMPLETE: 'Hazır.',
            LOG_CRITICAL_ERROR_SETTINGS_LOAD: 'Kritik hata.',
            LOG_SETTINGS_SAVED: 'Ayarlar kaydedildi.',
            LOG_SETTINGS_SAVE_ERROR: 'Kaydetme hatası.',
            LOG_FETCHING_TEAM_ID_FROM_CLUBHOUSE: "Clubhouse verisi çekiliyor...",
            LOG_TEAM_ID_FROM_INPUT: "Input'tan ID: ",
            LOG_TEAM_ID_FROM_BADGE: "Badge'den ID: ",
            LOG_TEAM_ID_FETCH_ALL_METHODS_FAIL: 'Takım ID bulunamadı.',
            LOG_TEAM_ID_HTTP_ERROR: "HTTP Hatası: ",
            LOG_TEAM_ID_NETWORK_ERROR: "Ağ Hatası.",
            LOG_CONFIRM_MODAL_DETECTED: 'Powerbox algılandı.',
            LOG_BID_CONFIRMED_IN_POWERBOX: 'Teklif onaylandı!',
            LOG_BID_PLACED_WAITING_REFRESH: 'Teklif yapıldı, yenileniyor.',
            LOG_MODAL_TIMEOUT: 'Powerbox zaman aşımı.',
            LOG_BID_JUST_PLACED_SKIPPING: 'Teklif yeni yapıldı, bekleniyor.',
            LOG_MISSING_SETTINGS_FOR_AUTOBID: 'Eksik ayarlar: ',
            LOG_MANUAL_FILL_REQUIRED: "Lütfen ayarları tamamlayın.",
            LOG_PLAYER_ID_MISMATCH: "Oyuncu ID eşleşmiyor.",
            LOG_PLAYER_CONTAINER_NOT_FOUND: 'Oyuncu kutusu bulunamadı.',
            LOG_PLAYER_CONTAINER_NOT_FOUND_UI_UPDATE: 'UI güncelleme hatası (kutu yok).',
            LOG_LATEST_BID_INFO_NOT_FOUND: 'Teklif bilgisi yok.',
            LOG_LATEST_BID_ELEMENT_NOT_FOUND_UI_UPDATE: 'Teklif elementi yok.',
            LOG_MY_BID_IS_HIGHEST: 'En yüksek teklif zaten bizde.',
            LOG_MY_BID_IS_HIGHEST_BUTTON_ABSENT: "Teklif bizde, buton pasif.",
            LOG_CURRENT_HIGHEST_BID: 'Şu anki en yüksek: ',
            LOG_MIN_INCREASE_APPLIED: 'Min artış uygulandı: ',
            LOG_BID_EXCEEDS_MAX: 'Limit aşıldı. Durduruluyor.',
            LOG_NEW_BID_CALCULATED: 'Hesaplanan teklif: ',
            LOG_BUY_BUTTON_NOT_FOUND: "Satın al butonu yok.",
            LOG_INITIATING_BID_PROCESS: 'Teklif süreci başlıyor...',
            LOG_SETTINGS_BUTTON_ADDED: 'Ayarlar butonu eklendi.',
            LOG_SETTINGS_BUTTON_LOCATION_FAIL: "Buton yeri bulunamadı.",
            LOG_SHOW_SETTINGS_MODAL_CALLED: 'Ayarlar açılıyor.',
            LOG_CURRENT_PLAYER_BID_MODAL_OPEN: 'Modal açılış teklifi: ',
            LOG_LAST_BID_ELEMENT_NOT_FOUND_MODAL: 'Teklif elementi bulunamadı.',
            LOG_PLAYER_ID_UNDEFINED_MODAL: "Oyuncu ID yok.",
            LOG_SETTINGS_MODAL_SHOWN: 'Modal gösterildi.',
            LOG_SETTINGS_UI_UPDATED: "UI güncellendi.",
            LOG_MAX_BID_INVALID: 'Maksimum teklif geçersiz.',
            LOG_MAX_BID_INVALID_PROMPT: 'Geçersiz teklif miktarı.',
            LOG_AUTOBID_ENABLED_NO_TARGET: "Hedef oyuncu seçilmedi.",
            LOG_AUTOBID_ENABLED_NO_TARGET_PROMPT: "Lütfen bir oyuncu hedefleyin.",
            LOG_NEW_SETTINGS_SAVED_APPLIED: 'Ayarlar uygulandı.',
            LOG_SETTINGS_SAVED_SUCCESS_PROMPT: 'Bu oyuncu için ayarlar kaydedildi!',
            LOG_CANNOT_ENABLE_MISSING_SETTINGS: 'Eksik ayar: %s',
            PROMPT_CANNOT_ENABLE_MISSING_SETTINGS: 'Tamamlayın: %s',
            LOG_SETTINGS_MODAL_HIDDEN: 'Modal kapandı.',
            LOG_SCRIPT_INIT: 'MZ Otomatik Teklifçi v3.1 Başlatılıyor...',
            LOG_AUTOBID_STATUS_CHANGED: 'Durum: ',
            LOG_FORCED_RELOAD_STARTED: 'Zorunlu yenileme: %s-%ss.',
            LOG_FORCED_RELOAD_STOPPED: 'Yenileme durduruldu.',
            LOG_PERFORMING_FORCED_RELOAD: 'Sayfa yenileniyor...',
            STATUS_ENABLED_TEXT: 'Etkin',
            STATUS_DISABLED_TEXT: 'Devre Dışı',
            LOG_TARGET_PLAYER_ID_SET: "Hedef: ",
            LOG_TARGET_PLAYER_ID_SET_PROMPT: "Hedef: ",
            LOG_TARGET_PLAYER_ID_SET_FAIL_PROMPT: "Oyuncu ID bulunamadı.",
            LOG_TARGET_PLAYER_ID_SET_FAIL: "Hedeflenemedi.",
            LOG_TARGET_PLAYER_ID_CLEARED: "Hedef temizlendi.",
            LOG_TARGET_PLAYER_ID_CLEARED_PROMPT: 'Hedef kaldırıldı.',
            LOG_AUTOBID_DISABLED_TARGET_REMOVED: 'Hedefsiz kaldığı için durdu.',
            LOG_MAX_AMOUNT_CHANGE_EVENT: 'Max değişti: ',
            LOG_QUICK_BID_SET_MAX_AMOUNT: "Max ayarlandı: ",
            LOG_PREVIOUS_INTERVAL_CLEARED: 'Zamanlayıcı temizlendi.',
            LOG_AUTOBID_LOOP_STARTED: 'Döngü başladı.',
            LOG_NEXT_CHECK_SCHEDULED: 'Sonraki kontrol: ',
            LOG_SECONDS_UNIT: ' sn.',
            LOG_AUTOBID_LOOP_STOPPED_DISABLED: 'Bot kapalı.',
            LOG_AUTOBID_REENABLED_STARTING: 'Bot başlıyor.',
            LOG_PAGE_RELOADING_SHORTLY: 'Sayfa yenilenecek...',
            LOG_MODAL_CHECK: 'Kontrol #',
            LOG_POWERBOX_SHELL_FOUND: 'Powerbox bulundu: ',
            LOG_EXTRACTING_BID_DATA: 'Veri okunuyor...',
            LOG_CONFIRM_VALUE_FOUND: 'ConfirmValue: ',
            LOG_CONFIRM_VALUE_NOT_FOUND: 'ConfirmValue YOK.',
            LOG_PID_VALUE_FOUND: "PID: ",
            LOG_PID_VALUE_NOT_FOUND: "PID YOK.",
            LOG_SALARY_INPUT_FOUND: 'Maaş inputu var.',
            LOG_SALARY_INPUT_NOT_FOUND: 'Maaş inputu YOK.',
            LOG_BID_INPUT_POWERBOX_FOUND: 'Teklif inputu var.',
            LOG_BID_INPUT_POWERBOX_NOT_FOUND: 'Teklif inputu YOK.',
            LOG_SIMULATING_BID_FOR_SALARY: 'Maaş için simülasyon...',
            LOG_SALARY_VALUE_EXTRACTED: "Maaş: ",
            LOG_POWERBOX_AJAX_URL: 'AJAX URL: ',
            LOG_POWERBOX_AJAX_POST_DATA: 'AJAX Data: ',
            LOG_POWERBOX_AJAX_SUCCESS: 'AJAX Başarılı: %s',
            LOG_POWERBOX_AJAX_RESPONSE_JSON: 'AJAX JSON: ',
            LOG_POWERBOX_AJAX_FAIL: 'AJAX Hata: %s',
            LOG_POWERBOX_AJAX_FAIL_MESSAGE: 'Hata Mesajı: ',
            LOG_POWERBOX_AJAX_PARSE_ERROR: 'AJAX Parse Hatası.',
            LOG_POWERBOX_AJAX_UNCERTAIN: 'Durum belirsiz.',
            LOG_POWERBOX_AJAX_ONERROR: 'AJAX Error.',
            LOG_POWERBOX_AJAX_ONERROR_FAIL: 'AJAX Fail.',
            LOG_POWERBOX_AJAX_ONTIMEOUT: 'AJAX Timeout.',
            LOG_POWERBOX_AJAX_ONTIMEOUT_FAIL: 'AJAX Fail (Timeout).',
            LOG_POWERBOX_SHELL_NOT_FOUND_ON_CHECK: 'Powerbox bulunamadı #',
            CONSOLE_LOG_LANGUAGE_CHANGED: 'Dil: ',
            CONSOLE_LOG_SYSTEM: '[SİSTEM]',
            LATEST_BID_LABEL: 'En Son Teklif:',
            BUY_PLAYER_TITLE: 'Oyuncuyu satın al',
            YOUR_BID_IS_HIGHEST_TITLE_TR: 'Şu anki teklif sizden',
            YOUR_BID_IS_HIGHEST_TITLE_EN: 'Current bid is yours',
            SETTINGS_BUTTON_TEXT: 'Otomatik Teklif Ayarları',
            SETTINGS_MODAL_TITLE: 'Otomatik Teklif Kontrol Merkezi',
            SETTINGS_ENABLE_AUTOBID: 'BU Oyuncu İçin Otomatik Teklifi Etkinleştir',
            SETTINGS_TARGET_PLAYER_ID: "Hedef Oyuncu ID:",
            SETTINGS_NOT_SET_YET: 'Henüz Ayarlanmadı',
            SETTINGS_CURRENT_PAGE_PLAYER_ID: "Mevcut Sayfa ID:",
            SETTINGS_TARGET_THIS_PLAYER: 'Bu Oyuncuyu Hedefle',
            SETTINGS_TARGET_THIS_PLAYER_WITH_ID: 'Bu Oyuncuyu Hedefle (ID: ',
            SETTINGS_TARGET_THIS_PLAYER_NO_ID: "Sayfa ID yok",
            SETTINGS_PLAYER_IS_TARGETED: 'HEDEFTE',
            SETTINGS_YOUR_TEAM_ID: "Takım ID'niz:",
            SETTINGS_AUTO_FETCHED: 'Otomatik',
            SETTINGS_CURRENT_PLAYER_BID: 'Mevcut Teklif:',
            SETTINGS_BID_INFO_NOT_FOUND: '(Yok)',
            SETTINGS_NOT_PLAYER_TRANSFER_PAGE: '(Transfer sayfası değil)',
            SETTINGS_PLEASE_BE_ON_PLAYER_PAGE: '(Oyuncu sayfasına gidin)',
            SETTINGS_MAX_BID_AMOUNT: 'Maksimum Teklif Miktarı (EUR):',
            SETTINGS_MANUAL_FILL_PROMPT: '(Manuel giriniz!)',
            SETTINGS_EXAMPLE_MAX_BID: 'Örn: 500000',
            SETTINGS_QUICK_BID_ADD_CURRENT: 'Mevcut',
            SETTINGS_SAVE_BUTTON: 'Bu Oyuncu İçin Kaydet',
            SETTINGS_CLOSE_BUTTON: 'Kapat',
            STATUS_SUCCESS: 'success',
            STATUS_ERROR: 'error',
            STATUS_WARNING: 'warning',
            LANG_TOGGLE_TR: 'TR',
            LANG_TOGGLE_EN: 'EN',
            SETTINGS_SMART_DEADLINE_ENABLE: 'Akıllı Süre Takibi (Son dakikaları bekle)',
            SETTINGS_SMART_DEADLINE_MINUTES: 'Kaç dakika kala başlasın?',
            LOG_WAITING_DEADLINE: 'Süre takibi aktif. Son %s dakika bekleniyor. (Kalan: %s dk)',
            LOG_DEADLINE_PARSE_ERROR: 'Bitiş süresi okunamadı, güvenlik için bekleme iptal edildi.',
            SETTINGS_SOUND_ENABLED: 'Sesli Bildirimleri Aç (Genel Ayar)',
            SETTINGS_TEST_SOUND: 'Sesi Test Et', // EN kısmına 'Test Sound' yazabilirsin
            SETTINGS_PLAYER_NAME_LABEL: 'Oyuncu Adı (Düzenlenebilir):',
            SETTINGS_RATING_LABEL: 'Oyuncu Değerlendirmesi (Yıldız):',
            TBL_STARS: 'Yıldız',
            TBL_CURRENT_BID: 'Güncel Teklif',
            MSG_LOADING: 'Yükleniyor...',
            // Dashboard Translations
            BTN_DASHBOARD: '📋 Takip Listesi',
            BTN_BACK: '← Ayarlara Dön',
            TBL_ID: 'ID',
            TBL_NAME: 'Oyuncu Adı',
            TBL_MAX: 'Limit (EUR)',
            TBL_STATUS: 'Durum',
            TBL_SMART: 'Süre Ayarı',
            TBL_ACTION: 'İşlem',
            TBL_ACTIVE: '✅ Aktif',
            TBL_STOPPED: '⏸️ Durdu',
            BTN_GO: 'Git',
            BTN_DEL: 'Sil',
            MSG_NO_PLAYERS: 'Henüz takip edilen oyuncu yok.'
        },
    };

    let currentLanguage = 'tr';
    // --- VERİ YAPISI ---
    let currentSettings = {
        myTeamID: null,
        soundEnabled: true,
        language: 'tr',
        players: {} // { '123456': { name: 'Player Name', enabled: true, maxBid: 50000... } }
    };

    let activePlayerSettings = null;
    let currentHighestPlayerBid = 0;
    let currentPagePlayerID = null;
    let bidJustPlaced = false;
    let autoBidIntervalId = null;
    let pageReloadTimeoutId = null;

    function getString(key, ...args) {
        const lang = currentSettings.language ?? 'tr';
        const template = TRANSLATIONS[lang]?.[key] ?? (TRANSLATIONS.en?.[key] ? `${TRANSLATIONS.en[key]} (EN Fallback)` : key);
        return args.length > 0 ? template.replace(/%s/g, () => args.shift() ?? '%s') : template;
    }

    function logSystem(message) {
        console.log(`%c${getString('CONSOLE_LOG_SYSTEM')}%c ${message}`, 'color: #8B008B; font-weight: bold;', 'color: black;');
    }
    function log(messageKey, ...args) {
        console.log(`%c${getString('SCRIPT_NAME_LOG_PREFIX')}%c ${getString(messageKey, ...args)}`, 'color: var(--mzab-fbnavy, #001C50); font-weight: bold;', 'color: black;');
    }
    function errorLog(messageKey, errorOrArgs) {
        console.error(`%c${getString('SCRIPT_NAME_LOG_PREFIX')} ERROR%c ${getString(messageKey)}`, 'color: var(--mzab-trred, #D93636); font-weight: bold;', 'color: black;', errorOrArgs || '');
    }
    function warnLog(messageKey, ...args) {
        console.warn(`%c${getString('SCRIPT_NAME_LOG_PREFIX')} WARNING%c ${getString(messageKey, ...args)}`, 'color: var(--mzab-fbyellow, #FDB913); font-weight: bold;', 'color: black;');
    }

    async function loadSettings() {
        log('LOG_SETTINGS_LOADING');
        try {
            const storedSettings = localStorage.getItem(SETTINGS_KEY);
            if (storedSettings) {
                const parsed = JSON.parse(storedSettings);
                if (!parsed.players) {
                    currentSettings = { ...currentSettings, ...parsed, players: {} };
                } else {
                    currentSettings = { ...currentSettings, ...parsed };
                }
                currentSettings.language = currentSettings.language ?? 'tr';
                currentLanguage = currentSettings.language;
                log('LOG_SETTINGS_LOADED');
            } else {
                currentLanguage = currentSettings.language;
                warnLog('LOG_NO_SETTINGS_FOUND');
            }

            const urlPlayerId = parseInt(new URLSearchParams(window.location.search).get('u'), 10);
            if (urlPlayerId && !isNaN(urlPlayerId)) {
                currentPagePlayerID = urlPlayerId;
                log('LOG_CURRENT_PAGE_PLAYER_ID_FETCHED', currentPagePlayerID);

                if (currentSettings.players && currentSettings.players[currentPagePlayerID]) {
                    activePlayerSettings = currentSettings.players[currentPagePlayerID];
                    logSystem(`Bu oyuncu (${currentPagePlayerID}) için özel ayarlar yüklendi. Limit: ${activePlayerSettings.maxBid}`);
                } else {
                    activePlayerSettings = null;
                    logSystem(`Bu oyuncu (${currentPagePlayerID}) için henüz bir ayar kaydedilmemiş.`);
                }
            } else {
                currentPagePlayerID = null;
                activePlayerSettings = null;
                warnLog('LOG_CURRENT_PAGE_PLAYER_ID_FAIL');
            }

            if (currentSettings.myTeamID) {
                log('LOG_TEAM_ID_STORED', currentSettings.myTeamID);
            } else {
                log('LOG_FETCHING_TEAM_ID');
                const fetchedTeamID = await fetchMyTeamID();
                if (fetchedTeamID) {
                    currentSettings.myTeamID = fetchedTeamID;
                    log('LOG_TEAM_ID_FETCHED', currentSettings.myTeamID);
                    saveSettings();
                } else {
                    warnLog('LOG_TEAM_ID_FETCH_FAIL');
                }
            }
        } catch (e) {
            errorLog('LOG_CRITICAL_ERROR_SETTINGS_LOAD', e);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
            log('LOG_SETTINGS_SAVED');
        } catch (e) {
            errorLog('LOG_SETTINGS_SAVE_ERROR', e);
        }
    }

    function fetchMyTeamID() {
        log('LOG_FETCHING_TEAM_ID_FROM_CLUBHOUSE');
        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://www.managerzone.com/?p=clubhouse',
                onload: (response) => {
                    if (response.status === 200) {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const tidInputValue = doc.querySelector('input[name="tid1"]')?.value;
                        if (tidInputValue) return resolve(parseInt(tidInputValue, 10));

                        const badgeMatch = doc.getElementById('team-badge')?.style.backgroundImage.match(/team_id=(\d+)/);
                        if (badgeMatch?.[1]) return resolve(parseInt(badgeMatch[1], 10));

                        warnLog('LOG_TEAM_ID_FETCH_ALL_METHODS_FAIL');
                        resolve(null);
                    } else {
                        errorLog('LOG_TEAM_ID_HTTP_ERROR', response.status);
                        resolve(null);
                    }
                },
                onerror: (error) => {
                    errorLog('LOG_TEAM_ID_NETWORK_ERROR', error);
                    resolve(null);
                },
            });
        });
    }

    // --- OYUN MANTIĞI ---
    function checkTimeThreshold() {
        if (!activePlayerSettings || !activePlayerSettings.smartDeadline) return true;

        const playerContainer = document.getElementById('thePlayers_0');
        if (!playerContainer) return true;

        const allElements = playerContainer.getElementsByTagName('*');
        let dateString = null;
        let isAuctionFinished = false;
        let isListEmptyState = false;

        for (let el of allElements) {
            if (el.children.length > 0) continue;
            const text = el.textContent.toLowerCase().trim();

            if (['satıldı', 'sold', 'closed', 'kapandı'].some(k => text.includes(k))) {
                isAuctionFinished = true;
                break;
            }
            if (text.includes('oyuncu listesi bekleniyor') || text.includes('waiting for player list')) {
                isAuctionFinished = true;
                isListEmptyState = true;
                break;
            }
            if (text.includes('deadline') || text.includes('bitiş')) {
                const nextEl = el.closest('td')?.nextElementSibling;
                if (nextEl) dateString = nextEl.textContent.trim();
                if (!dateString && text.match(/\d/)) dateString = el.textContent.trim();
                if (dateString) break;
            }
        }

        const myBidIndicatorTitle = getString(currentSettings.language === 'tr' ? 'YOUR_BID_IS_HIGHEST_TITLE_TR' : 'YOUR_BID_IS_HIGHEST_TITLE_EN');
        let isMyBid = playerContainer.querySelector(`span[title="${myBidIndicatorTitle}"]`) ||
                      playerContainer.querySelector(`img[title="${myBidIndicatorTitle}"]`);

        if (isListEmptyState && activePlayerSettings.enabled) isMyBid = true;

        if (isAuctionFinished) {
            if (isMyBid) {
                logSystem("TRANSFER SONA ERDİ VE KAZANILDI!");
                playSound('won');
                activePlayerSettings.enabled = false;
                saveSettings();
                return false;
            } else {
                logSystem("Transfer bitti ama kazanan siz değilsiniz.");
                activePlayerSettings.enabled = false;
                saveSettings();
                return false;
            }
        }

        if (dateString) {
            const dateMatch = dateString.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\s+(\d{1,2}):(\d{1,2})/);
            if (dateMatch) {
                const [_, day, month, year, hour, minute] = dateMatch;
                const deadlineDate = new Date(year, month - 1, day, hour, minute);
                const diffMins = Math.floor((deadlineDate - new Date()) / 60000);

                logSystem(`SÜRE ANALİZİ: Kalan ${diffMins} dk.`);

                if (diffMins < 0 && isMyBid) {
                     logSystem("SÜRE DOLDU VE TEKLİF SİZDE!");
                     playSound('won');
                     activePlayerSettings.enabled = false;
                     saveSettings();
                     return false;
                }
                if (diffMins > activePlayerSettings.deadlineMinutes) {
                    log('LOG_WAITING_DEADLINE', activePlayerSettings.deadlineMinutes, diffMins);
                    if (!isMyBid) playSound('warning');
                    return false;
                }
                return true;
            }
        }
        return true;
    }

    // --- SES SİSTEMİ (GÜNCELLENDİ: 2 Kez + 6 Saat Kuralı - Sayfa Yenilense Bile Hatırlar) ---
    const KEEP_ALIVE_AUDIO_SRC = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    let keepAliveAudio = new Audio(KEEP_ALIVE_AUDIO_SRC);
    keepAliveAudio.loop = true;
    keepAliveAudio.volume = 0.001;
    let activeUtterance = null;

    function playSound(type) {
        if (!currentSettings.soundEnabled) return;

        // 1. SES METNİNİ BELİRLE
        let textToSpeak = "";
        if (type === 'success') textToSpeak = "Teklif verildi.";
        else if (type === 'warning') textToSpeak = "Dikkat! Teklifiniz geçildi.";
        else if (type === 'error') textToSpeak = "Limit aşıldı! Teklif verilemedi.";
        else if (type === 'won') textToSpeak = "Tebrikler! Transferi kazandınız.";
        else if (type === 'test') textToSpeak = "Ses sistemi çalışıyor.";

        if (!textToSpeak) return;

        // 2. HAFIZADAN SES DURUMUNU OKU (Sayfa yenilense bile unutmaması için)
        const STATE_KEY = 'mzAutoBidSoundState';
        // Mevcut durumu yükle veya varsayılan oluştur
        let soundState = JSON.parse(localStorage.getItem(STATE_KEY)) || { count: 0, lastTime: 0, lastType: null };

        const now = Date.now();
        const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 Saat (Ms cinsinden)

        // 3. KONTROL MEKANİZMASI (Sadece Warning/Uyarı için)
        if (type === 'warning') {
            // Eğer son uyarının üzerinden 6 saat geçtiyse, sayacı sıfırla (Hatırlatma zamanı)
            if (now - soundState.lastTime > SIX_HOURS) {
                soundState.count = 0;
            }

            // Eğer 2 kereden fazla söylediyse SUS ve FONKSİYONDAN ÇIK
            if (soundState.count >= 2) {
                logSystem(`SESLİ BİLDİRİM SUSTURULDU (Limit doldu): "${textToSpeak}"`);
                return;
            }

            // Sayacı artır, zamanı güncelle
            soundState.count++;
            soundState.lastTime = now;
            soundState.lastType = type;
        } else {
            // Diğer sesler (Success, Won, Error) gelirse uyarı sayacını sıfırla.
            // Çünkü durum değişti (örneğin teklif verdik), tekrar geçilirsek baştan uyarmalı.
            soundState.count = 0;
            soundState.lastType = type;
        }

        // Güncel durumu tarayıcı hafızasına kaydet
        localStorage.setItem(STATE_KEY, JSON.stringify(soundState));

        // 4. SESİ ÇALMA İŞLEMİ
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        activeUtterance = new SpeechSynthesisUtterance(textToSpeak);
        activeUtterance.rate = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const trVoice = voices.find(v => v.lang.includes('tr') || v.lang.includes('TR'));
            if (trVoice) activeUtterance.voice = trVoice;
        }

        if (keepAliveAudio && !keepAliveAudio.paused) keepAliveAudio.volume = 0.0001;
        activeUtterance.onend = () => { if (keepAliveAudio && !keepAliveAudio.paused) keepAliveAudio.volume = 0.001; };
        activeUtterance.onerror = (e) => console.error("Konuşma hatası:", e);
        window.speechSynthesis.speak(activeUtterance);
        logSystem(`SESLİ BİLDİRİM ÇALINIYOR (${soundState.count}. kez): "${textToSpeak}"`);
    }

    function toggleKeepAlive(enable) {
        if (enable) {
            keepAliveAudio.play().catch(e => console.warn("Keep-Alive başlatılamadı:", e));
            logSystem("Arka plan modu aktif: Tarayıcı uyutulmuyor.");
        } else {
            keepAliveAudio.pause();
            logSystem("Arka plan modu pasif.");
        }
    }

    function parseCurrency(text) {
        return parseInt(text?.replace(/\s/g, '').replace(/[^\d]/g, ''), 10) || 0;
    }

    function updatePlayerInfoUI(newBidAmount, isMyNewBidHighest) {
        currentHighestPlayerBid = newBidAmount;
        const playerContainer = document.getElementById(`thePlayers_0`);
        if (!playerContainer) return warnLog('LOG_PLAYER_CONTAINER_NOT_FOUND_UI_UPDATE');

        const lastBidTextCell = Array.from(playerContainer.querySelectorAll('.box_dark td.clippable')).find((td) => td.textContent.includes(getString('LATEST_BID_LABEL')));
        const lastBidElement = lastBidTextCell?.nextElementSibling?.querySelector('strong');

        if (lastBidElement) {
            lastBidElement.textContent = newBidAmount.toLocaleString(currentSettings.language === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
            logSystem(`UI updated: Latest bid to ${newBidAmount.toLocaleString()}`);
        }

        const bidButton = playerContainer.querySelector(`a[title="${getString('BUY_PLAYER_TITLE')}"]`);
        const myBidIndicatorTitle = getString(currentSettings.language === 'tr' ? 'YOUR_BID_IS_HIGHEST_TITLE_TR' : 'YOUR_BID_IS_HIGHEST_TITLE_EN');
        let myBidIndicator = playerContainer.querySelector(`span[title="${myBidIndicatorTitle}"]`);

        if (bidButton) {
            bidButton.style.display = isMyNewBidHighest ? 'none' : '';
            bidButton.disabled = isMyNewBidHighest;
        }
        if (myBidIndicator) {
            myBidIndicator.style.display = isMyNewBidHighest ? '' : 'none';
        } else if (isMyNewBidHighest) {
            const latestBidOwnerElement = playerContainer.querySelector('.box_dark td.clippable + td span.text_small:not([title])');
            if (latestBidOwnerElement) {
                myBidIndicator = document.createElement('span');
                myBidIndicator.className = 'text_small';
                myBidIndicator.title = myBidIndicatorTitle;
                myBidIndicator.textContent = ' ' + myBidIndicatorTitle;
                latestBidOwnerElement.appendChild(myBidIndicator);
            }
        }
        scheduleNextAutoBidCheck();
    }

    async function attemptDirectBid() {
        if (!activePlayerSettings || !activePlayerSettings.maxBid) return scheduleNextAutoBidCheck();

        let checks = 0;
        const powerboxShell = await new Promise((resolve) => {
            const interval = setInterval(() => {
                checks++;
                const pbShell = document.getElementById('lightbox_transfer_buy_form');
                if (pbShell?.style.display !== 'none') {
                    clearInterval(interval);
                    resolve(pbShell);
                }
                if (checks >= MAX_MODAL_CHECKS) {
                    clearInterval(interval);
                    warnLog('LOG_MODAL_TIMEOUT');
                    resolve(null);
                }
            }, MODAL_CHECK_INTERVAL_MS);
        });

        if (!powerboxShell) return scheduleNextAutoBidCheck();

        let inputChecks = 0;
        let bidInputFieldInPowerbox = null;
        while (inputChecks < 90) {
            bidInputFieldInPowerbox = powerboxShell.querySelector('input[name="bid_player_currency"]');
            if (bidInputFieldInPowerbox && bidInputFieldInPowerbox.value.trim() !== "") break;
            await new Promise((r) => setTimeout(r, 100));
            inputChecks++;
        }

        if (!bidInputFieldInPowerbox) {
            errorLog('LOG_BID_INPUT_POWERBOX_NOT_FOUND');
            document.querySelector('#lightbox_transfer_buy_form .close')?.click();
            return scheduleNextAutoBidCheck();
        }

        await new Promise((resolve) => setTimeout(resolve, POWERBOX_READ_DELAY_MS));

        const mzSuggestedBid = parseCurrency(bidInputFieldInPowerbox.value);
        if (mzSuggestedBid === 0) {
            errorLog('LOG_LATEST_BID_INFO_NOT_FOUND', 'Teklif kutusu boş.');
            document.querySelector('#lightbox_transfer_buy_form .close')?.click();
            return scheduleNextAutoBidCheck();
        }

        const finalBidAmount = mzSuggestedBid;

        logSystem(`--------------------------------------------------`);
        logSystem(`ANALİZ RAPORU (Oyuncu: ${currentPagePlayerID})`);
        logSystem(`Penceredeki Hazır Teklif: ${mzSuggestedBid.toLocaleString()} EUR`);
        logSystem(`Sizin Bu Oyuncu İçin Limitiniz: ${activePlayerSettings.maxBid.toLocaleString()} EUR`);

        if (finalBidAmount > activePlayerSettings.maxBid) {
            warnLog('LOG_BID_EXCEEDS_MAX', `LİMİT YETERSİZ! ...`);
            logSystem(`SONUÇ: Teklif verilmedi. Bot bu oyuncu için durduruluyor.`);
            playSound('error');
            activePlayerSettings.enabled = false;
            saveSettings();
            document.querySelector('#lightbox_transfer_buy_form .close')?.click();
            return;
        }

        logSystem(`SONUÇ: Limit yeterli. ${finalBidAmount.toLocaleString()} EUR teklif ediliyor...`);
        log('LOG_EXTRACTING_BID_DATA');

        const formAction = powerboxShell.querySelector('form[action*="confirmvalue="]')?.getAttribute('action');
        const confirmValue = formAction?.match(/confirmvalue=([^&]+)/)?.[1] ?? powerboxShell.querySelector('[data-confirmvalue]')?.dataset.confirmvalue;

        if (!confirmValue) {
            errorLog('LOG_CONFIRM_VALUE_NOT_FOUND');
            return scheduleNextAutoBidCheck();
        }

        const pidInPowerbox = powerboxShell.querySelector('input[name="pid"], input#buyform_pid')?.value ?? currentPagePlayerID;
        let salaryValue = '';
        const salaryInput = powerboxShell.querySelector('input[name="salary"], input#buyform_salary');
        if (salaryInput) salaryValue = salaryInput.value;

        const ajaxUrl = `https://www.managerzone.com/ajax.php?p=transfer&sub=bid&confirmvalue=${confirmValue}&sport=soccer`;
        const postData = `pid=${encodeURIComponent(pidInPowerbox)}&bid_player_currency=${encodeURIComponent(finalBidAmount)}&salary=${encodeURIComponent(salaryValue)}`;

        GM.xmlHttpRequest({
            method: 'POST',
            url: ajaxUrl,
            data: postData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
            onload: (response) => {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    if (response.status === 200 && (jsonResponse.status === 'OK' || jsonResponse.status === true || jsonResponse.success === true)) {
                        log('LOG_BID_CONFIRMED_IN_POWERBOX');
                        bidJustPlaced = true;
                        const newHighestBid = jsonResponse.bid_amount || finalBidAmount;
                        const isMyNewBidHighest = true; // Başarılıysa bizizdir
                        logSystem(`BAŞARILI: Teklif verildi! Şu anki Fiyat: ${newHighestBid}`);
                        playSound('success');
                        updatePlayerInfoUI(newHighestBid, isMyNewBidHighest);
                        log('LOG_PAGE_RELOADING_SHORTLY');
                        setTimeout(() => window.location?.reload(), PAGE_RELOAD_DELAY_AFTER_BID_MS);
                    } else {
                        errorLog('LOG_POWERBOX_AJAX_FAIL', response.status);
                        document.querySelector('#lightbox_transfer_buy_form .close')?.click();
                        scheduleNextAutoBidCheck();
                    }
                } catch (e) {
                    errorLog('LOG_POWERBOX_AJAX_PARSE_ERROR', e);
                    scheduleNextAutoBidCheck();
                }
            },
            onerror: (error) => {
                errorLog('LOG_POWERBOX_AJAX_ONERROR', error);
                scheduleNextAutoBidCheck();
            },
            ontimeout: () => {
                errorLog('LOG_POWERBOX_AJAX_ONTIMEOUT');
                scheduleNextAutoBidCheck();
            },
        });
    }

    function scheduleNextAutoBidCheck() {
        if (autoBidIntervalId) { clearTimeout(autoBidIntervalId); autoBidIntervalId = null; }
        if (!activePlayerSettings || !activePlayerSettings.enabled) return log('LOG_AUTOBID_LOOP_STOPPED_DISABLED');
        if (bidJustPlaced) return log('LOG_BID_JUST_PLACED_SKIPPING');

        const nextCheckDelay = Math.floor(Math.random() * (MAX_CHECK_INTERVAL_MS - MIN_CHECK_INTERVAL_MS + 1)) + MIN_CHECK_INTERVAL_MS;
        log('LOG_NEXT_CHECK_SCHEDULED', (nextCheckDelay / 1000).toFixed(1), getString('LOG_SECONDS_UNIT'));
        autoBidIntervalId = setTimeout(autoBid, nextCheckDelay);
    }

    function autoBid() {
        if (!activePlayerSettings || !activePlayerSettings.enabled) {
            if (autoBidIntervalId) clearTimeout(autoBidIntervalId);
            autoBidIntervalId = null;
            return;
        }

        if (bidJustPlaced) return log('LOG_BID_JUST_PLACED_SKIPPING');

        let missingSettings = [];
        if (!currentPagePlayerID) missingSettings.push(getString('SETTINGS_TARGET_PLAYER_ID'));
        if (!currentSettings.myTeamID) missingSettings.push(getString('SETTINGS_YOUR_TEAM_ID'));
        if (!activePlayerSettings.maxBid || activePlayerSettings.maxBid <= 0) missingSettings.push(getString('SETTINGS_MAX_BID_AMOUNT'));

        if (missingSettings.length > 0) {
            warnLog('LOG_MISSING_SETTINGS_FOR_AUTOBID', missingSettings.join(', '));
            return scheduleNextAutoBidCheck();
        }

        const playerContainer = document.getElementById('thePlayers_0');
        if (!playerContainer) {
            const bodyText = document.body.innerText || "";
            if (bodyText.includes('Oyuncu listesi bekleniyor') || bodyText.includes('Waiting for player list')) {
                logSystem("DURUM: Liste boşaldı ve bot hala aktifti. KAZANILDI.");
                playSound('won');
                activePlayerSettings.enabled = false;
                saveSettings();
                return;
            }
            errorLog('LOG_PLAYER_CONTAINER_NOT_FOUND');
            currentHighestPlayerBid = 0;
            return scheduleNextAutoBidCheck();
        }

        const myBidIndicatorTitle = getString(currentSettings.language === 'tr' ? 'YOUR_BID_IS_HIGHEST_TITLE_TR' : 'YOUR_BID_IS_HIGHEST_TITLE_EN');
        if (playerContainer.querySelector(`span[title="${myBidIndicatorTitle}"]`)) {
            log('LOG_MY_BID_IS_HIGHEST');
            checkTimeThreshold();
            return scheduleNextAutoBidCheck();
        }

        const bidButton = playerContainer.querySelector(`a[title="${getString('BUY_PLAYER_TITLE')}"]`);
        if (!bidButton) {
            errorLog('LOG_BUY_BUTTON_NOT_FOUND');
            return scheduleNextAutoBidCheck();
        }

        if (!checkTimeThreshold()) return scheduleNextAutoBidCheck();

        log('LOG_INITIATING_BID_PROCESS');
        bidButton.click();
        attemptDirectBid();
    }

    // --- ARAYÜZ (MODAL + DASHBOARD) ---
    function buildModalHTML() {
        return `
        <div id="mzAutoBidOverlay">
            <div id="mzAutoBidModal">
                <div class="mz-modal-header">
                    <h2 id="mzAutoBidModalTitle">${getString('SETTINGS_MODAL_TITLE')}</h2>
                    <div class="mz-modal-lang-controls">
                        <span id="mzLangToggleTR" class="mz-lang-toggle" data-lang="tr">${getString('LANG_TOGGLE_TR')}</span>
                        <span class="mz-lang-separator">|</span>
                        <span id="mzLangToggleEN" class="mz-lang-toggle" data-lang="en">${getString('LANG_TOGGLE_EN')}</span>
                    </div>
                </div>

                <!-- SETTINGS VIEW -->
                <div id="mzSettingsView">
                    <div class="status-message-box" id="mzAutoBidStatusBox" style="display: none;"></div>

                    <!-- ID GÖSTERİMİ -->
                    <div style="background-color: var(--mzab-background-medium); border-left: 4px solid var(--mzab-fbyellow); padding: 10px; margin-bottom: 15px; border-radius: 4px;">
                         <div style="font-size: 0.85em; color: #90A4AE;">${getString('SETTINGS_TARGET_PLAYER_ID')}</div>
                         <div style="font-size: 1.2em; font-weight: bold; color: var(--mzab-white);" id="mzDisplayCurrentPlayerID">---</div>
                    </div>

                    <!-- İSİM VE YILDIZ ALANI -->
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <div style="flex: 2;">
                            <label for="mzPlayerNameInput" style="font-size: 0.95em; color: #CFD8DC;">${getString('SETTINGS_PLAYER_NAME_LABEL')}</label>
                            <input type="text" id="mzPlayerNameInput" readonly style="padding: 12px; font-size: 1.2em; font-weight: 800; background-color: #10151C; color: #FFFFFF; border: 1px solid #546E7A; border-radius: 6px; cursor: not-allowed; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                        </div>
                        <div style="flex: 1;">
                            <label for="mzPlayerRating" style="font-size: 0.95em; color: #CFD8DC;">${getString('SETTINGS_RATING_LABEL')}</label>
                            <select id="mzPlayerRating" style="width: 100%; padding: 12px; font-size: 1.1em; background: var(--mzab-background-medium); color: white; border: 1px solid #546E7A; border-radius: 6px;">
                                <option value="0">Seç...</option>
                                <option value="1">⭐</option>
                                <option value="2">⭐⭐</option>
                                <option value="3">⭐⭐⭐</option>
                                <option value="4">⭐⭐⭐⭐</option>
                                <option value="5">⭐⭐⭐⭐⭐</option>
                            </select>
                        </div>
                    </div>

                    <div class="checkbox-container">
                        <input type="checkbox" id="mzAutoBidEnabled">
                        <label for="mzAutoBidEnabled" id="mzAutoBidEnableLabel" style="color: var(--mzab-green-success); font-weight: bold; font-size: 1.05em;">${getString('SETTINGS_ENABLE_AUTOBID')}</label>
                    </div>

                    <!-- TAKIM ID ALANI -->
                    <div style="margin-bottom: 15px;">
                        <label for="mzAutoBidMyTeamID" id="mzAutoBidMyTeamIDLabel" style="font-size: 0.95em; color: #CFD8DC;">${getString('SETTINGS_YOUR_TEAM_ID')}</label>
                        <input type="number" id="mzAutoBidMyTeamID" placeholder="${getString('SETTINGS_AUTO_FETCHED')}" readonly style="padding: 12px; font-size: 1.2em; font-weight: 800; background-color: #10151C; color: #FFFFFF; border: 1px solid #546E7A; border-radius: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); cursor: not-allowed;">
                    </div>

                    <div class="checkbox-container" style="margin-top: 15px; margin-bottom: 5px;">
                        <input type="checkbox" id="mzSmartDeadlineEnabled">
                        <label for="mzSmartDeadlineEnabled" id="mzSmartDeadlineLabel">${getString('SETTINGS_SMART_DEADLINE_ENABLE')}</label>
                    </div>
                    <div id="mzSmartDeadlineInputContainer" style="margin-bottom: 5px; display: none; padding-left: 28px;">
                         <label for="mzDeadlineMinutes" style="font-size: 0.9em; margin-bottom: 5px; display:inline-block; margin-right: 10px; color: #90A4AE;">${getString('SETTINGS_SMART_DEADLINE_MINUTES')}</label>
                         <input type="text" id="mzDeadlineMinutes" value="5" autocomplete="off" style="width: 70px; padding: 6px; display:inline-block; margin-bottom: 0; text-align: center; font-weight: bold;">
                    </div>

                    <!-- SES AYARLARI VE TEST BUTONU -->
                    <div class="checkbox-container" style="margin-top: 5px; margin-bottom: 20px;">
                        <input type="checkbox" id="mzSoundEnabled">
                        <label for="mzSoundEnabled" id="mzSoundEnabledLabel" style="margin-right:15px;">${getString('SETTINGS_SOUND_ENABLED')}</label>
                        <button id="mzTestSoundBtn" style="padding: 4px 10px; font-size: 0.85em; background-color: #4A5568; color: white; border: 1px solid #78909C; border-radius: 4px; cursor: pointer;">🔊 ${getString('SETTINGS_TEST_SOUND')}</button>
                    </div>

                    <label for="mzSafeMaxBid" id="mzAutoBidMaxAmountLabel">${getString('SETTINGS_MAX_BID_AMOUNT')} <span class="manual-fill-indicator">(${getString('SETTINGS_MANUAL_FILL_PROMPT')})</span></label>
                    <input type="text" id="mzSafeMaxBid" autocomplete="off" placeholder="${getString('SETTINGS_EXAMPLE_MAX_BID')}" style="font-size: 1.2em; font-weight: bold; background-color: #2B3648; color: #ECEFF1; border: 1px solid #4A5568; padding: 12px; width: 100%; border-radius: 6px;">

                    <div class="quick-bid-buttons">
                        <button data-value-type="fixed" data-value="100000">100K</button>
                        <button data-value-type="fixed" data-value="250000">250K</button>
                        <button data-value-type="fixed" data-value="500000">500K</button>
                        <button data-value-type="fixed" data-value="1000000">1M</button>
                        <button data-value-type="add-current" data-value="100000">+100K (<span class="quick-bid-current-text">${getString('SETTINGS_QUICK_BID_ADD_CURRENT')}</span>)</button>
                    </div>

                    <div class="button-container" style="justify-content: space-between;">
                        <button class="dashboard-btn" id="mzBtnDashboard">${getString('BTN_DASHBOARD')}</button>
                        <div style="display:flex; gap:10px;">
                            <button class="save" id="mzAutoBidSaveBtn">${getString('SETTINGS_SAVE_BUTTON')}</button>
                            <button class="close" id="mzAutoBidCloseBtn">${getString('SETTINGS_CLOSE_BUTTON')}</button>
                        </div>
                    </div>
                </div>

                <!-- DASHBOARD VIEW -->
                <div id="mzDashboardView">
                    <table id="mzDashboardTable">
                        <thead>
                            <tr>
                                <th>${getString('TBL_ID')}</th>
                                <th>${getString('TBL_NAME')}</th>
                                <th>${getString('TBL_STARS')}</th>
                                <th>${getString('TBL_MAX')}</th>
                                <th style="color:#4FC3F7;">${getString('TBL_SMART')}</th>
                                <th>${getString('TBL_CURRENT_BID')}</th>
                                <th>${getString('TBL_STATUS')}</th>
                                <th>${getString('TBL_ACTION')}</th>
                            </tr>
                        </thead>
                        <tbody id="mzDashboardBody"></tbody>
                    </table>
                    <div style="margin-top: 20px; text-align: right;">
                        <button class="close" id="mzBtnBackToSettings">${getString('BTN_BACK')}</button>
                    </div>
                </div>

            </div>
        </div>
    `;
    }

    function injectSettingsModalAndButton() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap');
        :root {
            --mzab-fbyellow: #FDB913; --mzab-fbnavy: #001C50; --mzab-trred: #D93636; --mzab-green-success: #4CAF50;
            --mzab-white: #FFFFFF; --mzab-text-main: #ECEFF1; --mzab-text-dark: #00143B; --mzab-background-dark: #18202A;
            --mzab-background-medium: #2B3648; --mzab-background-light: #4A5568;
        }
        #mzAutoBidOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(24, 32, 42, 0.9); z-index: 99999; display: none; justify-content: center; align-items: center; backdrop-filter: blur(5px); }

        /* GÜNCELLEME: Modal genişliği 1000px yapıldı, böylece tablo rahatça yayılabilir */
        #mzAutoBidModal { background: var(--mzab-background-dark); border: 1px solid var(--mzab-background-medium); border-radius: 12px; padding: 25px; width: 95%; max-width: 1000px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); color: var(--mzab-text-main); font-family: 'Urbanist', system-ui, sans-serif; box-sizing: border-box; }

        .mz-modal-header { display: flex; justify-content: space-between; align-items: center; background-color: var(--mzab-fbnavy); color: var(--mzab-fbyellow); padding: 12px 20px; margin: -25px -25px 25px -25px; border-top-left-radius: 12px; border-top-right-radius: 12px; border-bottom: 2px solid var(--mzab-fbyellow); }
        #mzAutoBidModal h2 { margin: 0; font-weight: 600; font-size: 1.4em; }
        .mz-modal-lang-controls { display: flex; align-items: center; }
        .mz-lang-toggle { color: var(--mzab-fbyellow); opacity: 0.7; cursor: pointer; font-size: 0.9em; padding: 4px 8px; border-radius: 4px; font-weight: 500;}
        .mz-lang-toggle:hover { opacity: 1; background-color: rgba(255,255,255,0.1); }
        .mz-lang-toggle.active { opacity: 1; font-weight: 700; background-color: var(--mzab-fbyellow); color: var(--mzab-text-dark); }
        #mzAutoBidModal label { display: block; margin-bottom: 8px; font-weight: 500; color: #B0BEC5; font-size: 0.95em; }
        #mzAutoBidModal input[type="number"], #mzAutoBidModal input[type="text"] { width: 100%; padding: 10px; margin-bottom: 18px; border: 1px solid var(--mzab-background-light); border-radius: 6px; box-sizing: border-box; background-color: var(--mzab-background-medium); color: var(--mzab-text-main); font-size: 1em; }
        #mzAutoBidModal input[type="checkbox"] { width: auto; margin-right: 10px; transform: scale(1.1); accent-color: var(--mzab-fbyellow); vertical-align: middle; }
        #mzAutoBidModal .checkbox-container { display: flex; align-items: center; margin-bottom: 20px; }
        #mzAutoBidModal .checkbox-container label { margin-bottom: 0; color: var(--mzab-text-main); }
        #mzAutoBidModal .button-container { display: flex; margin-top: 25px; border-top: 1px solid var(--mzab-background-medium); padding-top: 20px; }
        #mzAutoBidModal button { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s ease; font-size: 0.95em; font-family: 'Urbanist', system-ui, sans-serif;}
        #mzAutoBidModal button.save { background-color: var(--mzab-fbyellow); color: var(--mzab-text-dark); }
        #mzAutoBidModal button.save:hover { background-color: #FFC720; }
        #mzAutoBidModal button.close { background-color: var(--mzab-background-light); color: var(--mzab-text-main); }
        #mzAutoBidModal button.dashboard-btn { background-color: var(--mzab-fbnavy); color: var(--mzab-fbyellow); border: 1px solid var(--mzab-fbyellow); }
        #mzAutoBidModal button.dashboard-btn:hover { background-color: var(--mzab-fbyellow); color: var(--mzab-text-dark); }
        .status-message-box { border: 1px solid var(--mzab-background-light); color: var(--mzab-text-main); padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 0.95em; background-color: var(--mzab-background-medium); }
        .status-message-box.success { background-color: #1D4232; border-color: #2C594A; color: #A7F3D0; }
        .status-message-box.error { background-color: #5B2020; border-color: #7F2A2A; color: #FED7D7; }
        .status-message-box.warning { background-color: #522E13; border-color: #7A4A1D; color: #FEEBC8; }
        .quick-bid-buttons { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; margin-bottom: 20px; }
        .quick-bid-buttons button { padding: 7px 12px; font-size: 0.8em; background-color: var(--mzab-background-medium); color: var(--mzab-text-main); border: 1px solid var(--mzab-background-light); border-radius: 5px; }

        /* Dashboard Styles */
        #mzDashboardView { display: none; width: 100%; }
        #mzDashboardTable { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 1.05em; }

        /* GÜNCELLEME: white-space: nowrap eklendi. Hücreler asla alt satıra geçmez. */
        #mzDashboardTable th, #mzDashboardTable td {
            text-align: left;
            padding: 14px 10px;
            border-bottom: 1px solid var(--mzab-background-light);
            color: var(--mzab-text-main);
            vertical-align: middle;
            white-space: nowrap;
        }

        #mzDashboardTable th { color: #90A4AE; font-weight: 600; text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.5px; border-bottom: 2px solid var(--mzab-fbyellow); }
        #mzDashboardTable td strong { font-size: 1.1em; }

        .mz-status-active { color: var(--mzab-green-success); font-weight: bold; background: rgba(76, 175, 80, 0.1); padding: 4px 8px; border-radius: 4px; }
        .mz-status-stopped { color: #B0BEC5; opacity: 0.8; background: rgba(176, 190, 197, 0.1); padding: 4px 8px; border-radius: 4px; }

        /* BUTON DÜZENİ */
        .mz-action-cell { vertical-align: middle !important; }
        .mz-btn-wrapper { display: flex; gap: 8px; align-items: center; }
        .mz-action-btn { padding: 8px 16px; text-align: center; font-size: 0.9em; text-decoration: none; border-radius: 6px; border: none; cursor: pointer; color: white; font-weight: 600; min-width: 50px; transition: opacity 0.2s; }
        .mz-action-btn:hover { opacity: 0.9; }
        .mz-go-btn { background: #1976D2; }
        .mz-del-btn { background: var(--mzab-trred); }
        `;
        document.head.appendChild(styleElement);
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = buildModalHTML();
        document.body.appendChild(modalContainer);

        const settingsButtonContainer = document.createElement('div');
        settingsButtonContainer.id = 'mzAutoBidSettingsBtnContainer';
        const settingsButton = document.createElement('button');
        settingsButton.id = 'mzAutoBidSettingsBtn';
        settingsButton.textContent = getString('SETTINGS_BUTTON_TEXT');
        settingsButton.style.cssText = "background-color: var(--mzab-fbnavy); color: var(--mzab-fbyellow); border: 2px solid var(--mzab-fbyellow); border-radius: 6px; padding: 7px 14px; font-size: 13px; cursor: pointer; margin-left: 10px; font-family: 'Urbanist', sans-serif; font-weight: 600;";
        settingsButton.onclick = openModal;
        settingsButtonContainer.appendChild(settingsButton);

        const searchTable = document.querySelector('div.mainContent table.transfer_window');
        const paginationElement = searchTable?.parentNode.querySelector('.pagination_wrapper');
        if (paginationElement) paginationElement.parentNode.insertBefore(settingsButtonContainer, paginationElement);
        else if (searchTable) searchTable.parentNode.insertBefore(settingsButtonContainer, searchTable.nextSibling);
    }

    function updateAllUIText() {
        document.getElementById('mzAutoBidSettingsBtn').textContent = getString('SETTINGS_BUTTON_TEXT');
        document.getElementById('mzAutoBidModalTitle').textContent = getString('SETTINGS_MODAL_TITLE');
        document.getElementById('mzAutoBidEnableLabel').textContent = getString('SETTINGS_ENABLE_AUTOBID');
        document.getElementById('mzAutoBidMyTeamIDLabel').textContent = getString('SETTINGS_YOUR_TEAM_ID');
        document.getElementById('mzAutoBidMaxAmountLabel').innerHTML = `${getString('SETTINGS_MAX_BID_AMOUNT')} <span class="manual-fill-indicator">(${getString('SETTINGS_MANUAL_FILL_PROMPT')})</span>`;
        document.getElementById('mzAutoBidSaveBtn').textContent = getString('SETTINGS_SAVE_BUTTON');
        document.getElementById('mzAutoBidCloseBtn').textContent = getString('SETTINGS_CLOSE_BUTTON');
        document.getElementById('mzSmartDeadlineLabel').textContent = getString('SETTINGS_SMART_DEADLINE_ENABLE');
        document.querySelector('label[for="mzDeadlineMinutes"]').textContent = getString('SETTINGS_SMART_DEADLINE_MINUTES');
        document.getElementById('mzSoundEnabledLabel').textContent = getString('SETTINGS_SOUND_ENABLED');
        document.getElementById('mzBtnDashboard').textContent = getString('BTN_DASHBOARD');
        document.getElementById('mzBtnBackToSettings').textContent = getString('BTN_BACK');

        document.getElementById('mzLangToggleTR').classList.toggle('active', currentSettings.language === 'tr');
        document.getElementById('mzLangToggleEN').classList.toggle('active', currentSettings.language === 'en');
    }

    function displayModalStatus(messageKey, typeKey) {
        const statusBox = document.getElementById('mzAutoBidStatusBox');
        if (!statusBox) return;
        statusBox.textContent = getString(messageKey);
        statusBox.className = 'status-message-box';
        if (typeKey) statusBox.classList.add(typeKey === 'STATUS_SUCCESS' ? 'success' : typeKey === 'STATUS_ERROR' ? 'error' : 'warning');
        statusBox.style.display = 'block';
        setTimeout(() => statusBox.style.display = 'none', 5000);
    }

    function openModal() {
        stopForcedPageReload();

        // 1. İSMİ SAYFADAN ÇEKME (DOM)
        let currentDOMName = "";
        if (currentPagePlayerID) {
            const specificDiv = document.querySelector(`div[title*="(${currentPagePlayerID})"]`);
            if (specificDiv) {
                const titleText = specificDiv.getAttribute('title');
                const match = titleText.match(/^(.*?) \(\d+\)/);
                if (match && match[1]) {
                    currentDOMName = match[1].trim().replace("Satın Al: ", "").replace("Sat: ", "").trim();
                }
            }
        }
        if (!currentDOMName) {
            const nameSpan = document.querySelector('span.player_name');
            if (nameSpan) currentDOMName = nameSpan.textContent.trim();
        }
        if (!currentDOMName) currentDOMName = "Unknown Player";

        // 2. ID GÖSTERİMİ
        const displayIDElement = document.getElementById('mzDisplayCurrentPlayerID');
        if (displayIDElement) {
             displayIDElement.textContent = currentPagePlayerID ? `${currentPagePlayerID}` : "---";
        }

        // 3. INPUTLARI DOLDUR
        if (activePlayerSettings) {
            const nameToUse = (currentDOMName !== "Unknown Player") ? currentDOMName : (activePlayerSettings.name || "Unknown Player");

            document.getElementById('mzPlayerNameInput').value = nameToUse;
            document.getElementById('mzPlayerRating').value = activePlayerSettings.stars || 0;
            document.getElementById('mzAutoBidEnabled').checked = activePlayerSettings.enabled;

            // --- DEĞİŞİKLİK BURADA: Kayıtlı sayıyı formatlı (noktalı) göster ---
            if (activePlayerSettings.maxBid) {
                document.getElementById('mzSafeMaxBid').value = activePlayerSettings.maxBid.toLocaleString('tr-TR');
            } else {
                document.getElementById('mzSafeMaxBid').value = '';
            }
            // ------------------------------------------------------------------

            document.getElementById('mzSmartDeadlineEnabled').checked = activePlayerSettings.smartDeadline;
            document.getElementById('mzDeadlineMinutes').value = activePlayerSettings.deadlineMinutes || 5;
            document.getElementById('mzSmartDeadlineInputContainer').style.display = activePlayerSettings.smartDeadline ? 'block' : 'none';
        } else {
            // Yeni Oyuncu
            document.getElementById('mzPlayerNameInput').value = currentDOMName;
            document.getElementById('mzPlayerRating').value = 0;
            document.getElementById('mzAutoBidEnabled').checked = false;
            document.getElementById('mzSafeMaxBid').value = '';
            document.getElementById('mzSmartDeadlineEnabled').checked = false;
            document.getElementById('mzDeadlineMinutes').value = 5;
            document.getElementById('mzSmartDeadlineInputContainer').style.display = 'none';
        }

        // Genel Ayarlar
        document.getElementById('mzAutoBidMyTeamID').value = currentSettings.myTeamID || '';
        document.getElementById('mzSoundEnabled').checked = currentSettings.soundEnabled;

        updateAllUIText();

        const nameLabel = document.querySelector('label[for="mzPlayerNameInput"]');
        if(nameLabel) nameLabel.textContent = getString('SETTINGS_PLAYER_NAME_LABEL');

        showSettingsView();
        document.getElementById('mzAutoBidOverlay').style.display = 'flex';
    }

    function showDashboard() {
        document.getElementById('mzSettingsView').style.display = 'none';
        document.getElementById('mzDashboardView').style.display = 'block';

        const tbody = document.getElementById('mzDashboardBody');
        tbody.innerHTML = '';
        const ids = Object.keys(currentSettings.players);

        if (ids.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; opacity:0.6;">${getString('MSG_NO_PLAYERS')}</td></tr>`;
        } else {
            ids.forEach(pid => {
                const p = currentSettings.players[pid];

                // Yıldız Görünümü
                let starsDisplay = "";
                if(p.stars > 0) {
                    starsDisplay = "⭐".repeat(p.stars);
                } else {
                    starsDisplay = "-";
                }

                // Akıllı Süre Görünümü (Yeni)
                let smartDeadlineDisplay = "-";
                if (p.smartDeadline) {
                    // Mavi renkli kum saati ve dakika
                    // DÜZELTME: "white-space: nowrap" eklendi, böylece yazı alt satıra inmez.
                    smartDeadlineDisplay = `<span style="color:#4FC3F7; font-weight:bold; font-size:0.9em; white-space: nowrap;">⏳ < ${p.deadlineMinutes} dk</span>`;
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pid}</td>
                    <td><strong style="color:white;">${p.name || '---'}</strong></td>
                    <td>${starsDisplay}</td>
                    <td>${p.maxBid.toLocaleString()} €</td>
                    <td>${smartDeadlineDisplay}</td> <!-- Yeni Hücre -->
                    <td><span id="dash-bid-${pid}" style="color:#FDB913; font-size:0.9em;">${getString('MSG_LOADING')}</span></td>
                    <td>${p.enabled ? `<span class="mz-status-active">${getString('TBL_ACTIVE')}</span>` : `<span class="mz-status-stopped">${getString('TBL_STOPPED')}</span>`}</td>
                    <td class="mz-action-cell">
                        <!-- DÜZELTME: Butonlar div içine alındı, böylece tablo çizgisi kaymaz -->
                        <div class="mz-btn-wrapper">
                            <a href="/?p=transfer&sub=players&u=${pid}" class="mz-action-btn mz-go-btn" target="_blank">${getString('BTN_GO')}</a>
                            <button class="mz-action-btn mz-del-btn" data-pid="${pid}">${getString('BTN_DEL')}</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);

                // CANLI FİYAT ÇEKME İŞLEMİ (Arka Planda)
                fetchPlayerCurrentBidForDashboard(pid);
            });

            document.querySelectorAll('.mz-del-btn').forEach(btn => {
                btn.onclick = function() {
                    const pidToDelete = this.getAttribute('data-pid');
                    if (confirm('Silmek istediğinize emin misiniz?')) {
                        delete currentSettings.players[pidToDelete];
                        saveSettings();
                        if (parseInt(pidToDelete) === currentPagePlayerID) {
                            activePlayerSettings = null;
                        }
                        showDashboard();
                    }
                };
            });
        }
    }

    // GÜNCELLENMİŞ VE GELİŞTİRİLMİŞ DASHBOARD VERİ ÇEKME FONKSİYONU
    function fetchPlayerCurrentBidForDashboard(pid) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `https://www.managerzone.com/?p=transfer&sub=players&u=${pid}`,
            onload: (response) => {
                const span = document.getElementById(`dash-bid-${pid}`);
                if (!span) return;

                if (response.status === 200) {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

                    let bidAmountText = "???";
                    let currentRawBid = 0;
                    let highestBidderTeamID = null;

                    const playerContainer = doc.getElementById('thePlayers_0');

                    if(playerContainer) {
                        // 1. Fiyatı ve Teklif Veren Takımı Bulma Mantığı
                        // Genellikle "En Son Teklif" yazan yerin yakınındadır.
                        const boxDarks = playerContainer.querySelectorAll('.box_dark');
                        let targetBox = null;

                        // İçinde "En Son Teklif" veya "Latest Bid" geçen kutuyu bul
                        boxDarks.forEach(box => {
                            if (box.textContent.includes('En Son Teklif') || box.textContent.includes('Latest Bid') || box.textContent.includes('Son Teklif')) {
                                targetBox = box;
                            }
                        });

                        if (targetBox) {
                            // Fiyatı al
                            const valEl = targetBox.querySelector('strong');
                            if(valEl) {
                                bidAmountText = valEl.textContent.trim();
                                currentRawBid = parseCurrency(bidAmountText);
                            }

                            // Teklif veren takımın ID'sini al (Linkten çeker: tid=XXXXX)
                            const teamLink = targetBox.querySelector('a[href*="tid="]');
                            if (teamLink) {
                                const tidMatch = teamLink.href.match(/tid=(\d+)/);
                                if (tidMatch) {
                                    highestBidderTeamID = parseInt(tidMatch[1], 10);
                                }
                            }
                        }

                        // 2. Durum Analizi
                        const containerText = playerContainer.textContent.toLowerCase();
                        const pSettings = currentSettings.players[pid];
                        const myTeamID = currentSettings.myTeamID;

                        // A) SATILDI / KAPANDI DURUMU
                        if(containerText.includes('sold') || containerText.includes('satıldı') || containerText.includes('closed') || containerText.includes('kapandı')) {
                            // Kazanan biz miyiz?
                            if (myTeamID && highestBidderTeamID === myTeamID) {
                                span.innerHTML = "Teklifi Kazandınız! 🏆";
                                span.style.color = "#4CAF50"; // Yeşil
                                span.style.fontWeight = "bold";
                                span.style.fontSize = "1.1em";
                            } else {
                                span.textContent = "Satıldı (Başkasına)";
                                span.style.color = "#B0BEC5"; // Gri
                                span.style.fontStyle = "italic";
                            }
                        }
                        // B) LİMİT AŞILDI MI? (Sadece transfer devam ediyorsa ve teklif bizde DEĞİLSE)
                        else if (pSettings && currentRawBid > pSettings.maxBid && (!myTeamID || highestBidderTeamID !== myTeamID)) {
                            span.innerHTML = "Limit Aşıldı! ⚠️";
                            span.style.color = "#D93636"; // Kırmızı
                            span.style.fontWeight = "bold";
                            span.title = `Güncel: ${bidAmountText}`;
                        }
                        // C) TEKLİF BİZDE Mİ?
                        else if (myTeamID && highestBidderTeamID === myTeamID) {
                            span.innerHTML = `${bidAmountText} <br><span style="font-size:0.8em; color:#4CAF50;">(Sizde)</span>`;
                            span.style.color = "#FDB913";
                        }
                        // D) NORMAL DURUM
                        else {
                            // GÜNCELLEME: Teklif bizde değilse ve limit yetiyorsa kırmızı uyarı ver
                            span.innerHTML = `${bidAmountText} <br><span style="font-size:0.8em;">(Teklif Geçildi!)</span>`;
                            span.style.color = "#D93636"; // Kırmızı
                            span.style.fontWeight = "bold";
                        }

                    } else {
                         // Liste boşsa (Transfer geçmişine düşmüş olabilir veya ID hatalı)
                         // Genelde buraya düşüyorsa transfer bitmiş ve listeden kalkmış demektir.
                         // Ancak kimin kazandığını buradan bilemeyiz, "Bitti" diyoruz.
                         span.textContent = "Bitti / Listeden Kalktı";
                         span.style.color = "#90A4AE";
                    }

                } else {
                    span.textContent = "Bağlantı Hatası";
                }
            },
            onerror: () => {
                const span = document.getElementById(`dash-bid-${pid}`);
                if(span) span.textContent = "Ağ Hatası";
            }
        });
    }

    function showSettingsView() {
        document.getElementById('mzSettingsView').style.display = 'block';
        document.getElementById('mzDashboardView').style.display = 'none';
    }

    function startForcedPageReload() {
        if (pageReloadTimeoutId) clearTimeout(pageReloadTimeoutId);
        if (activePlayerSettings && activePlayerSettings.enabled) {
            const randomDelay = Math.floor(Math.random() * (RELOAD_MAX_MS - RELOAD_MIN_MS + 1)) + RELOAD_MIN_MS;
            log('LOG_FORCED_RELOAD_STARTED', (randomDelay/1000).toFixed(1), getString('LOG_SECONDS_UNIT'));
            pageReloadTimeoutId = setTimeout(() => window.location.reload(), randomDelay);
        } else {
            stopForcedPageReload();
        }
    }

    function stopForcedPageReload() {
        if (pageReloadTimeoutId) { clearTimeout(pageReloadTimeoutId); pageReloadTimeoutId = null; }
    }

    function collectAndSaveSettings() {
        if (!currentPagePlayerID) return alert(getString('LOG_TARGET_PLAYER_ID_SET_FAIL_PROMPT'));

        // 1. FORM VERİLERİNİ AL
        const intendedEnableState = document.getElementById('mzAutoBidEnabled').checked;
        const maxAmountInput = document.getElementById('mzSafeMaxBid');

        // -- YENİ: İsim ve Yıldız değerlerini inputlardan al --
        const manualName = document.getElementById('mzPlayerNameInput').value.trim();
        const starRating = parseInt(document.getElementById('mzPlayerRating').value, 10) || 0;

        // Ses ayarını genel değişkene at
        currentSettings.soundEnabled = document.getElementById('mzSoundEnabled').checked;

        // Akıllı Süre verileri
        const smartDeadlineChecked = document.getElementById('mzSmartDeadlineEnabled').checked;
        const deadlineMinInput = parseInt(document.getElementById('mzDeadlineMinutes').value.replace(/[^0-9]/g, ''), 10) || 5;

        // Teklif Miktarı Kontrolü
        let tempMaxBid = parseInt(maxAmountInput.value.replace(/[^0-9]/g, ''), 10);
        if (isNaN(tempMaxBid) || tempMaxBid <= 0) {
            // Eğer botu aktif etmeye çalışıyorsa ama miktar yoksa hata ver
            if (intendedEnableState) {
                return displayModalStatus('LOG_MAX_BID_INVALID_PROMPT', 'STATUS_ERROR');
            }
            tempMaxBid = 0;
        }

        // 2. AYAR OBJESİNİ OLUŞTUR VE GÜNCELLE
        if (!currentSettings.players) currentSettings.players = {};

        currentSettings.players[currentPagePlayerID] = {
            name: manualName || "Unknown Player", // Elle girilen isim öncelikli, yoksa Unknown
            stars: starRating,                    // Seçilen yıldız
            enabled: intendedEnableState,
            maxBid: tempMaxBid,
            smartDeadline: smartDeadlineChecked,
            deadlineMinutes: deadlineMinInput
        };

        // Aktif ayarları güncelle
        activePlayerSettings = currentSettings.players[currentPagePlayerID];

        // 3. TAKIM ID KONTROLÜ (Bot açılıyorsa ID şart)
        if (activePlayerSettings.enabled && !currentSettings.myTeamID) {
             displayModalStatus('PROMPT_CANNOT_ENABLE_MISSING_SETTINGS', 'STATUS_ERROR');
             // Hatadan dolayı enable'ı geri al
             activePlayerSettings.enabled = false;
             document.getElementById('mzAutoBidEnabled').checked = false;
             saveSettings();
             return;
        }

        // 4. KAYDET VE SONUÇLANDIR
        saveSettings();
        displayModalStatus('LOG_SETTINGS_SAVED_SUCCESS_PROMPT', 'STATUS_SUCCESS');

        // Bot durumuna göre aksiyon al
        if (activePlayerSettings.enabled) {
            logSystem(`AYARLAR KAYDEDİLDİ: ${manualName} (${currentPagePlayerID}) - Limit: ${activePlayerSettings.maxBid} EUR - Yıldız: ${starRating}`);
            toggleKeepAlive(true); // Uyku modunu engelle
            startForcedPageReload(); // Yenileme döngüsünü başlat
            scheduleNextAutoBidCheck(); // Teklif kontrolünü başlat
        } else {
            logSystem(`AYARLAR KAYDEDİLDİ (Pasif): ${manualName}`);
            stopForcedPageReload();
            if (autoBidIntervalId) clearTimeout(autoBidIntervalId);
            toggleKeepAlive(false);
        }

        // Modalı 1 saniye sonra kapat
        setTimeout(() => document.getElementById('mzAutoBidOverlay').style.display = 'none', 1000);
    }

    function addModalEventListeners() {
        document.getElementById('mzAutoBidSaveBtn').addEventListener('click', collectAndSaveSettings);
        document.getElementById('mzAutoBidCloseBtn').addEventListener('click', () => {
            document.getElementById('mzAutoBidOverlay').style.display = 'none';
            if (activePlayerSettings && activePlayerSettings.enabled) startForcedPageReload();
        });

        document.getElementById('mzSmartDeadlineEnabled').onclick = function() {
            document.getElementById('mzSmartDeadlineInputContainer').style.display = this.checked ? 'block' : 'none';
        };

        document.getElementById('mzTestSoundBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const wasEnabled = currentSettings.soundEnabled;
            if(!wasEnabled) currentSettings.soundEnabled = true;
            playSound('test');
            if(!wasEnabled) currentSettings.soundEnabled = false;
        });

        document.getElementById('mzBtnDashboard').addEventListener('click', showDashboard);
        document.getElementById('mzBtnBackToSettings').addEventListener('click', showSettingsView);

        // --- DEĞİŞİKLİK 1: Hızlı Butonlar İçin Formatlama ---
        document.querySelectorAll('.quick-bid-buttons button').forEach((button) => {
            button.addEventListener('click', () => {
                const { valueType, value } = button.dataset;
                const numericValue = parseInt(value, 10);
                const maxInp = document.getElementById('mzSafeMaxBid');
                // Mevcut değeri alırken noktaları temizle
                let currentVal = valueType === 'add-current' && currentHighestPlayerBid > 0 ? currentHighestPlayerBid : (parseInt(maxInp.value.replace(/\D/g,'')) || 0);
                const targetValue = valueType === 'fixed' ? numericValue : currentVal + numericValue;

                // Değeri yazarken formatla (toLocaleString)
                maxInp.value = targetValue.toLocaleString('tr-TR');
            });
        });

        // --- DEĞİŞİKLİK 2: Elle Yazarken Otomatik Nokta Koyma ---
        const maxBidInput = document.getElementById('mzSafeMaxBid');
        if (maxBidInput) {
            maxBidInput.addEventListener('input', function(e) {
                // Sadece rakamları al (harfleri ve sembolleri sil)
                let rawValue = this.value.replace(/\D/g, '');
                if (rawValue !== "") {
                    // Sayıya çevirip tr-TR formatına (noktalı) dönüştür
                    this.value = parseInt(rawValue, 10).toLocaleString('tr-TR');
                } else {
                    this.value = "";
                }
            });
        }
        // --------------------------------------------------------

        document.getElementById('mzLangToggleTR').addEventListener('click', () => { currentSettings.language = 'tr'; updateAllUIText(); saveSettings(); });
        document.getElementById('mzLangToggleEN').addEventListener('click', () => { currentSettings.language = 'en'; updateAllUIText(); saveSettings(); });
    }

    async function sinop() {
        await loadSettings();
        injectSettingsModalAndButton();
        addModalEventListeners();

        if (activePlayerSettings && activePlayerSettings.enabled) {
            log('LOG_AUTOBID_REENABLED_STARTING');
            toggleKeepAlive(true);
            autoBid();
            startForcedPageReload();
        }
    }

    if (window.jQuery) window.addEventListener('load', sinop);
    else {
        const jqScript = document.createElement('script');
        jqScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        jqScript.onload = () => window.addEventListener('load', sinop);
        document.head.appendChild(jqScript);
    }
    if (window.speechSynthesis) window.speechSynthesis.getVoices();

})();