// ==UserScript==
// @name         MZone Advanced: Table, Stats & Play-off / MZone Gelişmiş: Tablo, İstatistik & Play-off
// @name:tr      MZone Gelişmiş: Tablo, İstatistik & Play-off
// @namespace    http://tampermonkey.net/
// @version      2.94
// @description  A powerful suite combining the Advanced League Table (live scores, FD), Player Stat Averages, and the new Play-off/Play-out Predictor. Now with Excel export, Shortlist Filtering and Transfer Tracker with charts.
// @description:tr Gelişmiş Lig Tablosu (canlı skorlar, FZ), Oyuncu İstatistik Ortalamaları ve yeni Play-Off/Play-Out Tahmincisi betiklerini tek bir güçlü araçta birleştirir. Şimdi Excel'e aktarma, Takip Listesi Filtreleme ve Grafikli Transfer Takipçisi özelliğiyle.
// @author       alex66
// @match        https://www.managerzone.com/?p=league*
// @match        https://www.managerzone.com/?p=friendlyseries*
// @match        https://www.managerzone.com/?p=private_cup*
// @match        https://www.managerzone.com/?p=cup*
// @match        https://www.managerzone.com/?p=players*
// @match        https://www.managerzone.com/?p=player&pid=*
// @match        https://www.managerzone.com/?p=match&sub=played*
// @match        https://www.managerzone.com/?p=match&sub=result*
// @match        https://www.managerzone.com/?p=match&sub=stats*
// @match        https://www.managerzone.com/?p=match&sub=scheduled*
// @match        https://www.managerzone.com/?p=shortlist*
// @match        https://www.managerzone.com/?p=transfer*
// @match        https://www.managerzone.com/?p=statistics*
// @match        https://www.managerzone.com/?p=rank*
// @match        https://www.managerzone.com/?p=federations&sub=clash
// @match        https://www.managerzone.com/?p=messenger
// @match        https://www.managerzone.com/?p=tactics*
// @match        https://www.managerzone.com/?p=league&type=*
// @match        https://www.managerzone.com/?p=match&sub=result&mid=*
// @match        *://www.managerzone.com/*
// @match        *://managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM
// @require      https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://code.highcharts.com/highcharts.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     NPROGRESS_CSS https://unpkg.com/nprogress@0.2.0/nprogress.css
// @connect      managerzone.com
// @connect      statsxente.com
// @downloadURL https://update.greasyfork.org/scripts/542702/MZone%20Advanced%3A%20Table%2C%20Stats%20%20Play-off%20%20MZone%20Geli%C5%9Fmi%C5%9F%3A%20Tablo%2C%20%C4%B0statistik%20%20Play-off.user.js
// @updateURL https://update.greasyfork.org/scripts/542702/MZone%20Advanced%3A%20Table%2C%20Stats%20%20Play-off%20%20MZone%20Geli%C5%9Fmi%C5%9F%3A%20Tablo%2C%20%C4%B0statistik%20%20Play-off.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    try {

        /****************************************************************************************
     *                                                                                      *
     *  BÖLÜM X: GENEL GÖZLEMCİ MAÇI PENCERESİ DÜZENLEMESİ (v8 - Hata Ayıklama Modlu)         *
     *                                                                                      *
     ****************************************************************************************/
        function initializeGlobalScoutMatchListener() {
            document.body.addEventListener('mousedown', async function(event) {
                const logPrefix = '[MZone Scout Helper]';

                // 1. ADIM: İlgili olabilecek bir butona tıklandığını tespit et
                const scoutButton = event.target.closest('a[onclick*="instantchallenge"], a[onclick*="purchaseChallenge"]');
                if (!scoutButton) return;

                console.log(`${logPrefix} Bir buton tıklandı.`, scoutButton);
                const onclickAttr = scoutButton.getAttribute('onclick');
                console.log(`${logPrefix} Butonun onclick özelliği:`, onclickAttr);

                let teamId = null;
                let teamIdMatch;

                // 2. ADIM: Takım ID'sini bulmak için iki farklı strateji dene

                // Strateji A: Standart "Gözlemci Maçı" butonu (instantchallenge)
                // Bu, 'instantchallenge' fonksiyonu içindeki tırnak içindeki sayıları arar.
                teamIdMatch = onclickAttr.match(/instantchallenge.+?['"](\d+)['"]/);
                if (teamIdMatch && teamIdMatch[1]) {
                    teamId = teamIdMatch[1];
                    console.log(`${logPrefix} Strateji A (Standart) başarılı. Bulunan ID:`, teamId);
                } else {
                    // Strateji B: Federasyon sayfasındaki "Meydan Oku" butonu (purchaseChallenge)
                    // Bu, 'purchaseChallenge' fonksiyonundaki son sayısal parametreyi arar. Örn: ..., 514687)
                    teamIdMatch = onclickAttr.match(/purchaseChallenge\(.*,\s*['"]?(\d+)['"]?\)/);
                    if (teamIdMatch && teamIdMatch[1]) {
                        teamId = teamIdMatch[1];
                        console.log(`${logPrefix} Strateji B (Federasyon) başarılı. Bulunan ID:`, teamId);
                    }
                }

                if (!teamId) {
                    console.error(`${logPrefix} HATA: Her iki strateji de takım ID'sini bulamadı.`);
                    return;
                }

                // 3. ADIM: Takım adını bul
                let teamName = `(ID: ${teamId})`;
                try {
                    // Butonun bulunduğu en yakın satır (`tr`) veya `div`'i bul.
                    const container = scoutButton.closest('tr, div.flex-nowrap');
                    console.log(`${logPrefix} Takım adını aramak için ana konteyner:`, container);

                    let teamLink = null;
                    if (container) {
                        // Önce, Federasyon sayfasındaki gibi `.team-name` sınıfına sahip linki ara. Bu daha spesifik.
                        teamLink = container.querySelector('a.team-name');
                        if (teamLink) {
                            console.log(`${logPrefix} Takım adı ".team-name" sınıfıyla bulundu.`);
                        } else {
                            // Eğer bulunamazsa, standart `tid=` içeren linki ara.
                            teamLink = container.querySelector(`a[href*="tid=${teamId}"]`);
                            if(teamLink) console.log(`${logPrefix} Takım adı "tid=" içeren link ile bulundu.`);
                        }
                    }

                    if (teamLink) {
                        teamName = teamLink.textContent.trim().replace(/\s\s+/g, ' ');
                        console.log(`${logPrefix} Bulunan Takım Adı:`, teamName);
                    } else {
                        console.warn(`${logPrefix} Sayfa içinde takım adı bulunamadı. API'den çekilecek...`);
                        // Yedek olarak takım sayfasından adı çekme.
                        const response = await new Promise((resolve, reject) => GM_xmlhttpRequest({ method: "GET", url: `/?p=team&tid=${teamId}`, onload: resolve, onerror: reject }));
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const titleElement = doc.querySelector('h1.win_title');
                        if (titleElement) {
                            teamName = titleElement.textContent.trim();
                            console.log(`${logPrefix} Takım adı API'den başarıyla çekildi:`, teamName);
                        } else {
                            console.error(`${logPrefix} HATA: API'den de takım adı çekilemedi.`);
                        }
                    }
                } catch (error) {
                    console.error(`${logPrefix} Takım adı aranırken bir hata oluştu:`, error);
                }

                // 4. ADIM: Açılan pencereyi izle ve takım adını ekle
                let tries = 0;
                console.log(`${logPrefix} Açılacak olan pencere bekleniyor...`);
                const interval = setInterval(function() {
                    const powerboxTitleDiv = document.querySelector('div.mz_powerboxTitle');

                    if (powerboxTitleDiv && powerboxTitleDiv.offsetParent !== null) {
                        const nobrTag = powerboxTitleDiv.querySelector('nobr');
                        if (nobrTag && (nobrTag.textContent.includes('Gözlemci maçı') || nobrTag.textContent.includes('Hemen Maç Yap'))) {
                            console.log(`${logPrefix} Pencere bulundu! Başlık:`, nobrTag.textContent);
                            if (!nobrTag.querySelector('.injected-team-name')) {
                                const nameSpan = document.createElement('span');
                                nameSpan.className = 'injected-team-name';
                                nameSpan.textContent = ` - ${teamName}`;
                                nameSpan.style.fontWeight = 'bold';

                                nobrTag.appendChild(nameSpan);
                                console.log(`${logPrefix} BAŞARILI: Takım adı pencereye eklendi.`);
                                clearInterval(interval);
                            }
                        }
                    }
                    tries++;
                    if (tries > 40) {
                        console.warn(`${logPrefix} Zaman aşımı: İlgili pencere bulunamadı.`);
                        clearInterval(interval);
                    }
                }, 100);

            }, true);
        }

        // ▼▼▼ AYAR ALTYAPISI BAŞLANGICI ▼▼▼

        const MODULE_SETTINGS_KEY = 'mz_advanced_script_module_settings_v1';
        let scriptSettings = {}; // Ayarları tutacak global değişken

        // Modüllerin isimlerini ve ayar anahtarlarını tutan merkezi nesne
        const MODULES = {
            leagueTable: { nameKey: "leagueTitle" },
            playerStats: { nameKey: "playersTitle" },
            playoffPredictor: { nameKey: "fixtureToolsTitle" },
            shortlistFilter: { nameKey: "shortlistTitle" },
            transferTracker: { nameKey: "shortlistDesc" },
            statisticsSummary: { nameKey: "statisticsTitle" },
            retirementIndicator: { nameKey: "retireWarning" },
            fixtureElo: { nameKey: "fixturePageEloName" },
            matchFinder: { nameKey: "matchFinderName" },
            messengerTools: { nameKey: "messengerToolsTitle" },
            ghostRobot: { nameKey: "ghostRobotTitle" },
            friendlyMatchAuto: { nameKey: "friendlyMatchAutoTitle" },
            linkEnhancements: { nameKey: "linkEnhancementsTitle" },
            transferScoutFilter: { nameKey: "transferScoutFilterTitle" },

            // ▼▼▼ BUNU EKLE ▼▼▼
            skillColoring: { nameKey: "rankingTweaksTitle" },
            // ▼▼▼ YENİ MODÜL AYARI ▼▼▼
            maxedBallColoring: { nameKey: "maxedBallTitle" }
        };

        // Ayarları tarayıcı hafızasından yükleyen fonksiyon
        async function loadScriptSettings() {
            // Varsayılan olarak tüm modüllerin açık olduğu bir şablon
            const defaultSettings = {};
            for (const key in MODULES) {
                defaultSettings[key] = true;
            }
            const savedSettings = JSON.parse(await GM_getValue(MODULE_SETTINGS_KEY, '{}'));
            // Kayıtlı ayarları varsayılanların üzerine yazarak son ayarları oluştur
            scriptSettings = { ...defaultSettings, ...savedSettings };
        }

        // ▲▲▲ AYAR ALTYAPISI SONU ▲▲▲

        const $ = unsafeWindow.jQuery; // jQuery'yi burada tanımlayalım

        /****************************************************************************************
     *                                                                                      *
     *  BÖLÜM 1: GELİŞMİŞ LİG TABLOSU BETİĞİ (ManagerZone Universal Advanced League Table)     *
     *                                                                                      *
     ****************************************************************************************/
        function initializeLeagueTableScript() {
            // =================================================================================
            // BÖLÜM -1: ULUSLARARASILAŞTIRMA (i18n)
            // =================================================================================

            const i18n = {
                translations: {
                    en: {
                        scriptName: 'ManagerZone Universal Advanced League Table',
                        leagueTableTitle: 'Table',
                        fixtureDifficultyHeader: 'FD',
                        fixtureDifficultyTitle: 'Fixture Difficulty (Higher value is advantageous, lower is disadvantageous)',
                        settingsTitle: 'Change settings',
                        fetchLiveScoresBtn: 'Fetch Live Scores',
                        processingBtn: 'Processing...',
                        tableUpdatedBtn: 'Table Updated!',
                        scriptUpdatedTitle: "'${scriptName}' has been updated!",
                        updateNotesIntro: "Here's what's new in version v${version}:",
                        updateModalCloseBtn: 'Got it, Close',
                        settingsModalTitle: 'Settings',
                        logoVisibilityLabel: 'Logo Visibility (Show team logos)',
                        saveBtn: 'Save',
                        roundPrefix: 'Round',
                        fzNotAvailable: 'Fixture analysis is not available for this page.',
                        fzTooltip: 'Remaining matches: ${remaining}\nOpponent rank sum: ${rankSum}',
                        fzNoMatchesLeft: 'No matches left',
                        locationHome: '(H)',
                        locationAway: '(A)',
                        homeAwayFiltersLabel: 'Table View Filters (Overall/Home/Away)',
                        /* YENİ EKLENEN ÇEVİRİLER */
                        home: 'Home',
                        away: 'Away',
                        overall: 'Overall',
                        updateNotes: {
                            '2.6': ["Fixed a critical bug where the script would fail on non-Turkish/English languages. The script now correctly parses fixture data regardless of the selected language and uses an English UI for all non-Turkish languages."]
                        }
                    },
                    tr: {
                        scriptName: 'ManagerZone Evrensel Gelişmiş Lig Tablosu',
                        leagueTableTitle: 'Puan Tablosu',
                        fixtureDifficultyHeader: 'FZ',
                        fixtureDifficultyTitle: 'Fikstür Zorluğu (Değer yüksekse avantajlı, düşükse dezavantajlı)',
                        settingsTitle: 'Ayarları değiştir',
                        fetchLiveScoresBtn: 'Canlı Maç Sonuçlarını Al',
                        processingBtn: 'İşleniyor...',
                        tableUpdatedBtn: 'Tablo Güncellendi!',
                        scriptUpdatedTitle: "'${scriptName}' Güncellendi!",
                        updateNotesIntro: "Yeni sürüm (v${version}) ile gelen yenilikler:",
                        updateModalCloseBtn: 'Anladım, Kapat',
                        settingsModalTitle: 'Ayarlar',
                        logoVisibilityLabel: 'Logo Görünürlüğü (Takım logoları gösterilsin)',
                        saveBtn: 'Kaydet',
                        roundPrefix: 'Tur',
                        fzNotAvailable: 'Fikstür analizi bu sayfa için mevcut değil.',
                        fzTooltip: 'Kalan maç: ${remaining}\nRakip sıra top: ${rankSum}',
                        fzNoMatchesLeft: 'Kalan maç yok',
                        locationHome: '(E)',
                        locationAway: '(D)',
                        homeAwayFiltersLabel: 'Puan Tablosu Filtresi (Genel/İç Saha/Dış Saha)',

                        /* YENİ EKLENEN ÇEVİRİLER */
                        home: 'İç Saha',
                        away: 'Dış Saha',
                        overall: 'Genel',
                        updateNotes: {
                            '2.6': ["Türkçe/İngilizce dışındaki dillerde betiğin çalışmamasına neden olan kritik hata düzeltildi. Betik artık seçilen dilden bağımsız olarak fikstür verisini doğru bir şekilde analiz ediyor ve Türkçe dışındaki tüm diller için İngilizce arayüz kullanıyor."]
                        }
                    }
                },
                detectLanguage: function() {
                    const langMeta = document.querySelector('meta[name="language"]');
                    if (langMeta && langMeta.getAttribute('content') === 'tr') {
                        return 'tr';
                    }
                    return 'en';
                },
                get: function(key, replacements = {}) {
                    let lang = this.currentLang || this.detectLanguage();
                    let text;
                    if (this.translations[lang] && this.translations[lang][key] !== undefined) {
                        text = this.translations[lang][key];
                    } else {
                        text = this.translations['en']?.[key];
                    }
                    if (text === undefined) {
                        console.warn(`i18n key not found: ${key}`);
                        return `[${key}]`;
                    }
                    if (key === 'updateNotes' && typeof text === 'object') {
                        return text;
                    }
                    for (const placeholder in replacements) {
                        text = text.replace(new RegExp(`\\$\\{${placeholder}\\}`, 'g'), replacements[placeholder]);
                    }
                    return text;
                }
            };

            i18n.currentLang = i18n.detectLanguage();


            // =================================================================================
            // BÖLÜM 0: YAPILANDIRMA VE SABİTLER
            // =================================================================================

            const CONFIG = {
                SELECTORS: {
                    LEAGUE_TABLE: 'table.nice_table',
                    TABLE_HEADER_ROW: 'table.nice_table thead tr',
                    TABLE_BODY: 'table.nice_table tbody',
                    TABLE_ROWS: 'table.nice_table tbody tr',
                    TEAM_LINK_IN_ROW: 'a[href*="&tid="]',
                    MY_TEAM_ROW: 'tr.highlight_row',
                    ONGOING_MATCH_LINK: 'table.hitlist a[href*="mid="], .team-matches-vs a[href*="mid="]',
                    LEAGUE_TABLE_HEADER: 'h2.subheader',
                    SCHEDULE_TAB_LINK: '#league_tab_schedule',
                    UPDATE_BUTTON: '.mz-fetch-button',
                    SETTINGS_BUTTON: '.mz-settings-button',
                    CONTENT_DIV: '#contentDiv',
                    SETTINGS_MODAL: '#mz-settings-modal',
                    SETTINGS_MODAL_CLOSE: '.mz-modal-close',
                    SETTINGS_MODAL_SAVE: '#mz-settings-save',
                    LOGO_VISIBILITY_CHECKBOX: '#mz-logo-visibility-checkbox',
                    HOME_AWAY_FILTERS_CHECKBOX: '#mz-home-away-filters-checkbox',
                    UPDATE_MODAL: '#mz-update-modal',
                    UPDATE_MODAL_CLOSE: '#mz-update-close-button',
                },
                CLASSES: {
                    NEXT_OPPONENT: 'mz-next-opponent',
                    UPDATED_CELL: 'updated-cell',
                    INDICATORS_WRAPPER: 'mz-indicators-wrapper',
                    TOOLTIP: 'mz-custom-tooltip',
                    BUTTON_DISABLED: 'disabled',
                    BUTTON_DONE: 'done',
                    FZ_HEADER: 'mz-fz-header',
                    TEAM_LOGO: 'mz-team-logo',
                    SETTINGS_ACTIVE: 'mz-settings-active',
                    SETTINGS_BUTTON: 'mz-settings-button', // <-- BU SATIRI EKLEYİN
                },
                COLUMNS: {
                    POSITION: 0,
                    TEAM_NAME: 1,
                    PLAYED: 2,
                    WINS: 3,
                    DRAWS: 4,
                    LOSSES: 5,
                    GOALS_FOR: 6,
                    GOALS_AGAINST: 7,
                    GOAL_DIFFERENCE: 8,
                    POINTS: 9,
                    FIXTURE_DIFFICULTY: 10
                },
                API: {
                    MATCH_INFO: 'https://www.managerzone.com/xml/match_info.php?sport_id=1&match_id=',
                }
            };


            const SCRIPT_INFO = GM_info.script;
            const LAST_SEEN_VERSION_KEY = 'mz_advanced_table_last_version';
            const UPDATE_NOTES = i18n.get('updateNotes');

            function injectStyles() {
                GM_addStyle(GM_getResourceText('NPROGRESS_CSS'));
                GM_addStyle(`
            .mz-team-cell { display: flex; align-items: center; }
            .mz-team-logo { height: 2.0em; width: auto; margin-right: 6px; vertical-align: middle; flex-shrink: 0; }
            .mz-indicators-wrapper { margin-left: auto; margin-right: 15px; display: flex; align-items: center; white-space: nowrap; padding-left: 10px; }
            .match-indicator { display: inline-block; width: 13.5px; height: 12.5px; border-radius: 50%; margin-left: 8px; vertical-align: middle; border: 1px solid rgba(0,0,0,0.6); cursor: pointer; flex-shrink: 0; }
            .match-win { background-color: #28a745; }
            .match-loss { background-color: #dc3545; }
            .match-draw { background-color: #ffc107; }
            .match-future { font-size: 11px; color: #000; margin-left: 5px; font-style: italic; font-weight: bold; }
            .mz-next-opponent { background-color: #fff3cd !important; font-weight: bold; }
            .mz-next-opponent:hover { background-color: #ffeeba !important; }
            .mz-next-opponent a { color: #856404 !important; }

            .mz-custom-tooltip { position: absolute; display: none; padding: 8px 12px; color: #fff; border-radius: 6px; font-size: 14px; font-weight: bold; z-index: 9999; pointer-events: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3); text-shadow: 1px 1px 2px rgba(0,0,0,0.5); line-height: 1; white-space: nowrap; }
            .mz-custom-tooltip::before { content: ''; position: absolute; top: 50%; right: 100%; margin-top: -6px; border-width: 6px; border-style: solid; }
            .tooltip-win { background-color: #28a745; border: 1px solid #1e7e34; }
            .tooltip-win::before { border-color: transparent #1e7e34 transparent transparent; }
            .tooltip-loss { background-color: #dc3545; border: 1px solid #b21f2d; }
            .tooltip-loss::before { border-color: transparent #b21f2d transparent transparent; }
            .tooltip-draw { background-color: #ffc107; border: 1px solid #d39e00; color: #212529; text-shadow: none; }
            .tooltip-draw::before { border-color: transparent #d39e00 transparent transparent; }

            .mz-fetch-button { margin-left: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s; }
            .mz-fetch-button:hover:not(.disabled) { background-color: #45a049; }
            .mz-fetch-button.disabled { background-color: #ccc; cursor: not-allowed; }
            .mz-fetch-button.done { background-color: #007bff; }
            .${CONFIG.CLASSES.FZ_HEADER}, table.nice_table td:nth-child(${CONFIG.COLUMNS.FIXTURE_DIFFICULTY + 1}) { text-align: center; font-weight: bold; cursor: help; }

            .mz-settings-button { margin-left: 8px; cursor: pointer; color: #999; font-size: 1.6em; transition: color 0.3s; vertical-align: middle;}
            .mz-settings-button:hover { color: #333; }
            .mz-settings-button.mz-settings-active { color: #4CAF50; }

            .mz-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); z-index: 10000; display: none; justify-content: center; align-items: center; }
            .mz-modal-content { background: #fefefe; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); min-width: 300px; display: flex; flex-direction: column; max-width: 500px; }
            .mz-modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
            .mz-modal-header h3 { margin: 0; font-size: 18px; }
            .mz-modal-close { font-size: 24px; font-weight: bold; cursor: pointer; color: #888; }
            .mz-modal-close:hover { color: #000; }
            .mz-modal-body { display: flex; flex-direction: column; gap: 15px; }
            .mz-modal-body label { display: flex; align-items: center; font-size: 16px; cursor: pointer; }
            .mz-modal-body input[type="checkbox"] { width: 18px; height: 18px; margin-right: 10px; }
            .mz-modal-footer { border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; text-align: right; }
            #mz-settings-save { padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            #mz-settings-save:hover { background-color: #45a049; }

            #mz-update-modal .mz-modal-body ul { list-style-type: none; padding-left: 0; margin: 10px 0; }
            #mz-update-modal .mz-modal-body li { margin-bottom: 10px; padding-left: 20px; position: relative; }
            #mz-update-modal .mz-modal-body li::before { content: '✓'; color: #4CAF50; position: absolute; left: 0; font-weight: bold; }
            #mz-update-modal .mz-modal-footer { text-align: center; }
            #mz-update-close-button { padding: 10px 25px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            #mz-update-close-button:hover { background-color: #0069d9; }

            @media (max-width: 768px) {
                .mz-team-logo { height: 1.6em !important; width: auto !important; max-width: 20px !important; }

                /* === MOBİL GÖRÜNÜM DÜZELTMESİ BURADA === */
                .mz-indicators-wrapper {
                    flex-wrap: nowrap; /* İkonların ve yazıların alt satıra kaymasını engeller */
                    margin-left: auto;   /* İkon grubunu hücrenin sağına yaslar */
                    margin-right: 5px;
                    justify-content: flex-end;
                }
                /* === DÜZELTME SONU === */

                .mz-team-cell a { white-space: normal; }
            }

            /* YENİ EKLENEN ELO STİLİ */
            .elo-score-header, .elo-score-cell {
                text-align: center !important;
                font-weight: bold;
                cursor: help;
            }

.mz-table-filters .mzbtn span {
                text-shadow: none !important;
            }

         /* FIKSTÜR SAYFASI ELO PUANI STILI */
.fixture-elo-score {
    font-size: 11px;
    font-weight: bold;
    color: #555;
    background-color: #f0f0f0;
    padding: 1px 4px;
    border-radius: 3px;
    border: 1px solid #ddd;
    margin-top: 3px;
    display: inline-block;
}

    `);
            }

            function request(options) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({ ...options,
                                       onload: resolve,
                                       onerror: reject,
                                       ontimeout: reject
                                      });
                });
            }

            let myTeamInfo = {
                id: null,
                name: null
            };
            let originalTableBody = null;
            const liveMatchResults = new Map();
            const tooltip = document.createElement('div');
            document.body.appendChild(tooltip);
            let fullScheduleCache = null;
            let isLogoDisplayEnabled = true;
            let isHomeAwayFiltersEnabled = true;
            let allPlayedMatchesCache = null; // YENİ EKLENEN DEĞİŞKEN
            let isAddingEloScores = false;

            function findOngoingMatches() {
                const ongoingMatches = [];
                document.querySelectorAll(CONFIG.SELECTORS.ONGOING_MATCH_LINK).forEach(link => {
                    const scoreText = link.textContent.trim();
                    if (!/^\d+\s*-\s*\d+$/.test(scoreText) && !scoreText.includes('X - X')) {
                        const mid = new URLSearchParams(link.href).get('mid');
                        if (mid) ongoingMatches.push({
                            mid,
                            linkElement: link
                        });
                    }
                });
                return ongoingMatches;
            }

            function findMainLeagueTableHeader() {
                const allHeaders = document.querySelectorAll(CONFIG.SELECTORS.LEAGUE_TABLE_HEADER);
                for (const header of allHeaders) {
                    const nextElement = header.nextElementSibling;
                    if (nextElement && (nextElement.matches(CONFIG.SELECTORS.LEAGUE_TABLE) || nextElement.querySelector(CONFIG.SELECTORS.LEAGUE_TABLE))) {
                        return header;
                    }
                }
                return null;
            }

            function isMainLeagueTableVisible() {
                const tables = document.querySelectorAll('#contentDiv table.nice_table');
                for (const table of tables) {
                    const header = table.querySelector('thead');
                    const body = table.querySelector('tbody');
                    if (header && body && body.rows.length > 2 && header.rows[0].cells.length >= 8) {
                        return true;
                    }
                }
                return false;
            }

            function setupLiveUpdateFeature() {
                const ongoingMatches = findOngoingMatches();
                if (ongoingMatches.length === 0) return;
                const titleHeader = findMainLeagueTableHeader();
                if (!titleHeader || document.querySelector(CONFIG.SELECTORS.UPDATE_BUTTON)) return;
                const button = document.createElement('button');
                button.className = 'mz-fetch-button';
                button.textContent = i18n.get('fetchLiveScoresBtn');
                button.addEventListener('click', () => handleLiveUpdateClick(button, ongoingMatches));
                titleHeader.appendChild(button);
            }

            function createUpdateModal(version, notes) {
                if (document.querySelector(CONFIG.SELECTORS.UPDATE_MODAL)) return;
                const modalOverlay = document.createElement('div');
                modalOverlay.id = 'mz-update-modal';
                modalOverlay.className = 'mz-modal-overlay';
                const notesHtml = notes.map(note => `<li>${note}</li>`).join('');
                const scriptName = i18n.get('scriptName');
                modalOverlay.innerHTML = `
            <div class="mz-modal-content">
                <div class="mz-modal-header">
                    <h3>${i18n.get('scriptUpdatedTitle', { scriptName })}</h3>
                </div>
                <div class="mz-modal-body">
                    <p>${i18n.get('updateNotesIntro', { version })}</p>
                    <ul>${notesHtml}</ul>
                </div>
                <div class="mz-modal-footer">
                    <button id="mz-update-close-button">${i18n.get('updateModalCloseBtn')}</button>
                </div>
            </div>`;
                document.body.appendChild(modalOverlay);
                modalOverlay.querySelector(CONFIG.SELECTORS.UPDATE_MODAL_CLOSE).addEventListener('click', async () => {
                    modalOverlay.style.display = 'none';
                    await GM_setValue(LAST_SEEN_VERSION_KEY, SCRIPT_INFO.version);
                });
            }

            function createSettingsModal() {
                if (document.querySelector(CONFIG.SELECTORS.SETTINGS_MODAL)) return;
                const modalOverlay = document.createElement('div');
                modalOverlay.id = 'mz-settings-modal';
                modalOverlay.className = 'mz-modal-overlay';
                modalOverlay.innerHTML = `
            <div class="mz-modal-content">
                <div class="mz-modal-header">
                    <h3>${i18n.get('settingsModalTitle')}</h3>
                    <span class="mz-modal-close">×</span>
                </div>
                <div class="mz-modal-body">
                    <label>
                        <input type="checkbox" id="mz-logo-visibility-checkbox" />
                        ${i18n.get('logoVisibilityLabel')}
                    </label>
										                    <label>
                        <input type="checkbox" id="mz-home-away-filters-checkbox" />
                        ${i18n.get('homeAwayFiltersLabel')}
                    </label>
                </div>
                <div class="mz-modal-footer">
                    <button id="mz-settings-save">${i18n.get('saveBtn')}</button>
                </div>
            </div>`;
                document.body.appendChild(modalOverlay);
                modalOverlay.querySelector(CONFIG.SELECTORS.SETTINGS_MODAL_CLOSE).addEventListener('click', closeSettingsModal);
                modalOverlay.querySelector(CONFIG.SELECTORS.SETTINGS_MODAL_SAVE).addEventListener('click', saveSettingsAndClose);
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === modalOverlay) {
                        closeSettingsModal();
                    }
                });
            }

            function openSettingsModal() {
                const modal = document.querySelector(CONFIG.SELECTORS.SETTINGS_MODAL);
                const logoCheckbox = document.querySelector(CONFIG.SELECTORS.LOGO_VISIBILITY_CHECKBOX);
                const filtersCheckbox = document.querySelector(CONFIG.SELECTORS.HOME_AWAY_FILTERS_CHECKBOX);
                if (!modal || !logoCheckbox || !filtersCheckbox) return;
                logoCheckbox.checked = isLogoDisplayEnabled;
                filtersCheckbox.checked = isHomeAwayFiltersEnabled;
                modal.style.display = 'flex';
            }

            function closeSettingsModal() {
                const modal = document.querySelector(CONFIG.SELECTORS.SETTINGS_MODAL);
                if (modal) modal.style.display = 'none';
            }

            function saveSettingsAndClose() {
                const logoCheckbox = document.querySelector(CONFIG.SELECTORS.LOGO_VISIBILITY_CHECKBOX);
                const filtersCheckbox = document.querySelector(CONFIG.SELECTORS.HOME_AWAY_FILTERS_CHECKBOX);

                if (logoCheckbox) {
                    isLogoDisplayEnabled = logoCheckbox.checked;
                    GM_setValue('showTeamLogos', isLogoDisplayEnabled);
                    updateSettingsIconState();
                    toggleLogoVisibility();
                }
                if (filtersCheckbox) {
                    isHomeAwayFiltersEnabled = filtersCheckbox.checked;
                    GM_setValue('showHomeAwayFilters', isHomeAwayFiltersEnabled);
                    toggleHomeAwayFiltersVisibility();
                }
                closeSettingsModal();
            }

            function setupSettingsMenu() {
                const titleHeader = findMainLeagueTableHeader();
                if (!titleHeader || document.querySelector(CONFIG.SELECTORS.SETTINGS_BUTTON)) return;
                const settingsIcon = document.createElement('span');
                settingsIcon.className = CONFIG.CLASSES.SETTINGS_BUTTON;
                settingsIcon.textContent = '⚙️';
                settingsIcon.addEventListener('click', openSettingsModal);
                titleHeader.appendChild(settingsIcon);
                updateSettingsIconState();
            }

            function updateSettingsIconState() {
                const settingsIcon = document.querySelector(CONFIG.SELECTORS.SETTINGS_BUTTON);
                if (!settingsIcon) return;
                settingsIcon.classList.toggle(CONFIG.CLASSES.SETTINGS_ACTIVE, isLogoDisplayEnabled);
                settingsIcon.title = i18n.get('settingsTitle');
            }

            function toggleHomeAwayFiltersVisibility() {
                // İlk olarak, filtre butonlarının şu an sayfada olup olmadığını kontrol et
                const filters = document.querySelector('.mz-table-filters');

                // Eğer ayarlarda "Filtre Butonları" seçeneği AÇIK ise:
                if (isHomeAwayFiltersEnabled) {
                    // ve butonlar henüz ekranda YOKSA:
                    if (!filters) {
                        // Butonları oluşturan fonksiyonu çağırarak onları ekrana getir.
                        setupHomeAwayFilters();
                    }
                }
                // Eğer ayarlarda "Filtre Butonları" seçeneği KAPALI ise:
                else {
                    // ve butonlar şu an ekranda VARSA:
                    if (filters) {
                        // Onları ekrandan tamamen kaldır.
                        filters.remove();
                    }
                }
            }

            async function handleLiveUpdateClick(button, matches) {
                button.textContent = i18n.get('processingBtn');
                button.classList.add(CONFIG.CLASSES.BUTTON_DISABLED);
                button.disabled = true;
                NProgress.start();
                const currentTbody = document.querySelector(CONFIG.SELECTORS.TABLE_BODY);
                if (currentTbody && originalTableBody) {
                    currentTbody.parentNode.replaceChild(originalTableBody.cloneNode(true), currentTbody);
                    addFixtureDifficultyColumn();
                    toggleLogoVisibility();
                }
                liveMatchResults.clear();
                for (let i = 0; i < matches.length; i++) {
                    NProgress.set((i / matches.length) * 0.5);
                    try {
                        const response = await request({
                            method: 'GET',
                            url: CONFIG.API.MATCH_INFO + matches[i].mid
                        });
                        const xmlDoc = new DOMParser().parseFromString(response.responseText, 'application/xml');
                        const homeNode = xmlDoc.querySelector('Team[field="home"]');
                        const awayNode = xmlDoc.querySelector('Team[field="away"]');
                        if (homeNode && awayNode) {
                            const matchData = {
                                mid: matches[i].mid,
                                homeTid: homeNode.getAttribute('id'),
                                awayTid: awayNode.getAttribute('id'),
                                homeGoals: parseInt(homeNode.getAttribute('goals'), 10) || 0,
                                awayGoals: parseInt(awayNode.getAttribute('goals'), 10) || 0
                            };
                            liveMatchResults.set(matchData.mid, matchData);
                            matches[i].linkElement.textContent = `${matchData.homeGoals} - ${matchData.awayGoals}`;
                        }
                    } catch (error) {
                        console.error(`Maç ID ${matches[i].mid} için veri çekilemedi:`, error);
                    }
                }
                NProgress.set(0.6);
                liveMatchResults.forEach(data => {
                    const {
                        homeResult,
                        awayResult
                    } = calculateMatchResult(data);
                    updateTeamRow(data.homeTid, homeResult);
                    updateTeamRow(data.awayTid, awayResult);
                });
                NProgress.set(0.8);
                sortTableByPoints();
                await calculateAndDisplayFixtureDifficulty(liveMatchResults);
                if (myTeamInfo.id) {
                    NProgress.set(0.9);
                    await performFullOpponentAnalysis();
                }
                NProgress.done();
                button.textContent = i18n.get('tableUpdatedBtn');
                button.classList.add(CONFIG.CLASSES.BUTTON_DONE);
            }

            function calculateMatchResult(data) {
                if (data.homeGoals > data.awayGoals) return {
                    homeResult: {
                        p: 3,
                        w: 1,
                        d: 0,
                        l: 0,
                        gf: data.homeGoals,
                        ga: data.awayGoals
                    },
                    awayResult: {
                        p: 0,
                        w: 0,
                        d: 0,
                        l: 1,
                        gf: data.awayGoals,
                        ga: data.homeGoals
                    }
                };
                if (data.homeGoals < data.awayGoals) return {
                    homeResult: {
                        p: 0,
                        w: 0,
                        d: 0,
                        l: 1,
                        gf: data.homeGoals,
                        ga: data.awayGoals
                    },
                    awayResult: {
                        p: 3,
                        w: 1,
                        d: 0,
                        l: 0,
                        gf: data.awayGoals,
                        ga: data.homeGoals
                    }
                };
                return {
                    homeResult: {
                        p: 1,
                        w: 0,
                        d: 1,
                        l: 0,
                        gf: data.homeGoals,
                        ga: data.awayGoals
                    },
                    awayResult: {
                        p: 1,
                        w: 0,
                        d: 1,
                        l: 0,
                        gf: data.awayGoals,
                        ga: data.homeGoals
                    }
                };
            }

            function updateTeamRow(tid, result) {
                const teamRow = document.querySelector(`.nice_table a[href*="&tid=${tid}"]`)?.closest('tr');
                if (!teamRow) return;
                const cells = teamRow.cells;
                const C = CONFIG.COLUMNS;
                const parseCellInt = (index) => parseInt(cells[index]?.textContent.trim(), 10) || 0;
                const updateCell = (index, value) => {
                    if (cells[index]) {
                        cells[index].textContent = value;
                        cells[index].classList.add(CONFIG.CLASSES.UPDATED_CELL);
                        setTimeout(() => cells[index].classList.remove(CONFIG.CLASSES.UPDATED_CELL), 2000);
                    }
                };
                updateCell(C.PLAYED, parseCellInt(C.PLAYED) + 1);
                updateCell(C.WINS, parseCellInt(C.WINS) + result.w);
                updateCell(C.DRAWS, parseCellInt(C.DRAWS) + result.d);
                updateCell(C.LOSSES, parseCellInt(C.LOSSES) + result.l);
                const newGF = parseCellInt(C.GOALS_FOR) + result.gf;
                const newGA = parseCellInt(C.GOALS_AGAINST) + result.ga;
                updateCell(C.GOALS_FOR, newGF);
                updateCell(C.GOALS_AGAINST, newGA);
                updateCell(C.GOAL_DIFFERENCE, newGF - newGA);
                updateCell(C.POINTS, parseCellInt(C.POINTS) + result.p);
            }

            function applyPromotionRelegationStyles() {
                const tableRows = document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS);
                if (!tableRows || tableRows.length < 1) return;

                // Önce mevcut tüm stilleri temizle ki yanlış yerde kalmasınlar.
                tableRows.forEach(row => {
                    row.style.borderBottom = '';
                });

                // GÜVENİLİR YÖNTEM: Lig türünü sayfa URL'sinden al
                const urlParams = new URLSearchParams(window.location.search);
                const leagueType = urlParams.get('type') || ''; // Örn: 'u23_world', 'senior', 'world_series'

                // Lig türü URL'de 'world' kelimesini içeriyorsa, bu bir Dünya Ligi'dir.
                if (leagueType.includes('world')) {
                    // === DÜNYA LİGİ KURALLARI (U18, U21, U23 dahil) ===

                    // 1. sıraya düz yeşil çizgi (Şampiyon)
                    if (tableRows.length >= 1) {
                        const promotionRow = tableRows[0]; // 1. sıra (index 0)
                        promotionRow.style.borderBottom = '2px solid green';
                    }

                    // 2. sıraya kesikli yeşil çizgi (Play-Off)
                    if (tableRows.length >= 2) {
                        const playOffRow = tableRows[1]; // 2. sıra (index 1)
                        playOffRow.style.borderBottom = '2px dashed green';
                    }

                    // 8. sıraya düz kırmızı çizgi (Düşme)
                    if (tableRows.length >= 8) {
                        const relegationRow = tableRows[7]; // 8. sıra (index 7)
                        relegationRow.style.borderBottom = '2px solid red';
                    }

                } else {
                    // === NORMAL LİG KURALLARI ===

                    // 7. sıraya kesikli kırmızı çizgi (Play-out)
                    if (tableRows.length >= 7) {
                        const playOutRow = tableRows[6]; // 7. sıra (index 6)
                        playOutRow.style.borderBottom = '2px dashed #D60000';
                    }

                    // 9. sıraya düz kırmızı çizgi (Düşme)
                    if (tableRows.length >= 9) {
                        const relegationRow = tableRows[8]; // 9. sıra (index 8)
                        relegationRow.style.borderBottom = '2px solid red';
                    }
                }
            }

            function sortTableByPoints() {
                const tbody = document.querySelector(CONFIG.SELECTORS.TABLE_BODY);
                if (!tbody) return;
                const rows = Array.from(tbody.rows);
                const C = CONFIG.COLUMNS;
                rows.sort((a, b) => {
                    const val = (r, i) => parseInt(r.cells[i]?.textContent.trim(), 10) || 0;
                    return val(b, C.POINTS) - val(a, C.POINTS) || val(b, C.GOAL_DIFFERENCE) - val(a, C.GOAL_DIFFERENCE) || val(b, C.GOALS_FOR) - val(a, C.GOALS_FOR);
                });
                rows.forEach((row, index) => {
                    row.cells[C.POSITION].textContent = index + 1;
                    tbody.appendChild(row);
                });

                // YENİ EKLENEN SATIR: Sıralama sonrası çizgileri yeniden uygula.
                applyPromotionRelegationStyles();
            }
            function toggleLogoVisibility() {
                if (isLogoDisplayEnabled) {
                    addTeamLogos();
                } else {
                    removeTeamLogos();
                }
            }

            function addTeamLogos() {
                if (!isLogoDisplayEnabled) return;
                document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS).forEach(row => {
                    const teamLink = row.querySelector(CONFIG.SELECTORS.TEAM_LINK_IN_ROW);
                    if (teamLink && teamLink.parentNode && !row.querySelector(`.${CONFIG.CLASSES.TEAM_LOGO}`)) {
                        const tid = new URLSearchParams(teamLink.href).get('tid');
                        if (tid) {
                            const logo = document.createElement('img');
                            logo.src = `/dynimg/badge.php?team_id=${tid}&sport=soccer`;
                            logo.className = CONFIG.CLASSES.TEAM_LOGO;
                            logo.alt = 'Logo';
                            teamLink.parentNode.insertBefore(logo, teamLink);
                        }
                    }
                });
            }

            function removeTeamLogos() {
                document.querySelectorAll(`.${CONFIG.CLASSES.TEAM_LOGO}`).forEach(logo => logo.remove());
            }

            async function performFullOpponentAnalysis() {
                try {
                    if (!myTeamInfo.name || !fullScheduleCache) return;
                    const fixtureData = parseMyTeamFixture(fullScheduleCache.htmlText);
                    applyAllVisuals(fixtureData);
                } catch (error) {
                    console.error("Opponent analysis failed:", error);
                }
            }

            function applyAllVisuals({
                fixture,
                nextOpponentName
            }) {
                if (!fixture) return;
                const tableBody = document.querySelector(CONFIG.SELECTORS.TABLE_BODY);
                if (!tableBody) return;
                document.querySelectorAll(`.${CONFIG.CLASSES.INDICATORS_WRAPPER}`).forEach(el => el.remove());
                document.querySelectorAll(`.${CONFIG.CLASSES.NEXT_OPPONENT}`).forEach(el => el.classList.remove(CONFIG.CLASSES.NEXT_OPPONENT));
                tableBody.querySelectorAll("tr").forEach(row => {
                    const teamLink = row.querySelector(CONFIG.SELECTORS.TEAM_LINK_IN_ROW);
                    if (!teamLink || row.classList.contains('highlight_row')) return;
                    const teamCell = teamLink.parentNode;
                    teamCell.classList.add('mz-team-cell');
                    const teamName = teamLink.textContent.trim();
                    const result = fixture[teamName];
                    if (nextOpponentName === teamName) row.classList.add(CONFIG.CLASSES.NEXT_OPPONENT);
                    if (result) {
                        const wrapper = document.createElement('span');
                        wrapper.className = CONFIG.CLASSES.INDICATORS_WRAPPER;
                        if (result.played && result.played.length > 0) {
                            result.played.forEach(playedMatch => {
                                const icon = document.createElement('span');
                                icon.className = `match-indicator match-${playedMatch.status}`;
                                icon.dataset.tooltipText = `${playedMatch.location} ${playedMatch.score}`;
                                icon.dataset.status = playedMatch.status;
                                icon.addEventListener('click', () => GM_openInTab(playedMatch.matchURL, true));
                                addTooltipEvents(icon);
                                wrapper.appendChild(icon);
                            });
                        }
                        if (result.futureRounds.length > 0) {
                            const text = document.createElement('span');
                            text.className = 'match-future';
                            text.textContent = `(${result.futureRounds.join(', ')})`;
                            wrapper.appendChild(text);
                        }
                        if (wrapper.hasChildNodes()) teamCell.appendChild(wrapper);
                    }
                });
            }

            function addTooltipEvents(element) {
                element.addEventListener('mouseenter', (e) => {
                    const target = e.currentTarget;
                    const wrapperElement = target.closest(`.${CONFIG.CLASSES.INDICATORS_WRAPPER}`);
                    const positioningElement = wrapperElement || target;
                    const rect = positioningElement.getBoundingClientRect();
                    tooltip.className = `${CONFIG.CLASSES.TOOLTIP} tooltip-${target.dataset.status}`;
                    tooltip.textContent = target.dataset.tooltipText;
                    tooltip.style.display = 'block';
                    tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2 - tooltip.offsetHeight / 2}px`;
                    tooltip.style.left = `${rect.right + window.scrollX + 10}px`;
                });
                element.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            }

            function addFixtureDifficultyColumn() {
                const headerRow = document.querySelector(CONFIG.SELECTORS.TABLE_HEADER_ROW);
                if (!headerRow || headerRow.querySelector(`.${CONFIG.CLASSES.FZ_HEADER}`)) return;
                const newHeader = document.createElement('th');
                newHeader.textContent = i18n.get('fixtureDifficultyHeader');
                newHeader.title = i18n.get('fixtureDifficultyTitle');
                newHeader.classList.add(CONFIG.CLASSES.FZ_HEADER);
                headerRow.insertBefore(newHeader, headerRow.children[CONFIG.COLUMNS.POINTS + 1]);
                document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS).forEach(row => {
                    const newCell = row.insertCell(CONFIG.COLUMNS.FIXTURE_DIFFICULTY);
                    newCell.textContent = '...';
                });
            }

            async function fetchAndCacheSchedule() {
                if (fullScheduleCache) return fullScheduleCache;
                const scheduleTabLink = document.querySelector(CONFIG.SELECTORS.SCHEDULE_TAB_LINK);
                if (!scheduleTabLink) return null;
                try {
                    const response = await request({
                        method: "GET",
                        url: scheduleTabLink.href
                    });
                    fullScheduleCache = {
                        htmlText: response.responseText
                    };
                    return fullScheduleCache;
                } catch (error) {
                    console.error("Could not fetch schedule page:", error);
                    return null;
                }
            }

            function parseMyTeamFixture(htmlText) {
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const fixture = {};
                let nextMatch = {
                    round: Infinity,
                    opponentName: null
                };
                const roundRegex = /\d+/;

                doc.querySelectorAll(CONFIG.SELECTORS.LEAGUE_TABLE_HEADER).forEach(header => {
                    const roundMatch = header.textContent.match(roundRegex);
                    if (!roundMatch) return;

                    const round = parseInt(roundMatch[0], 10);
                    const table = header.nextElementSibling?.querySelector('table');
                    if (!table) return;

                    table.querySelectorAll('tr').forEach(row => {
                        const [homeCell, scoreCell, awayCell] = row.cells;
                        if (!homeCell || !scoreCell || !awayCell) return;
                        const homeTeam = homeCell.textContent.trim();
                        const awayTeam = awayCell.textContent.trim();
                        if (homeTeam === myTeamInfo.name || awayTeam === myTeamInfo.name) {
                            const opponentName = homeTeam === myTeamInfo.name ? awayTeam : homeTeam;
                            if (!fixture[opponentName]) fixture[opponentName] = {
                                played: [],
                                futureRounds: []
                            };
                            const scoreLink = scoreCell.querySelector('a');
                            const mid = scoreLink ? new URLSearchParams(scoreLink.href).get('mid') : null;

                            const location = homeTeam === myTeamInfo.name ? i18n.get('locationHome') : i18n.get('locationAway');
                            const currentRoundText = `${i18n.get('roundPrefix')} ${round}`;

                            if (mid && liveMatchResults.has(mid)) {
                                const d = liveMatchResults.get(mid);
                                const myScore = d.homeTid === myTeamInfo.id ? d.homeGoals : d.awayGoals;
                                const oppScore = d.homeTid === myTeamInfo.id ? d.awayGoals : d.homeGoals;
                                fixture[opponentName].played.push({
                                    score: `${myScore} - ${oppScore}`,
                                    matchURL: scoreLink.href,
                                    location: location,
                                    status: myScore > oppScore ? 'win' : (myScore < oppScore ? 'loss' : 'draw'),
                                });
                            } else if (scoreLink && /^\d+\s*-\s*\d+$/.test(scoreLink.textContent.trim())) {
                                const scores = scoreLink.textContent.trim().split('-').map(s => parseInt(s.trim()));
                                const myScore = homeTeam === myTeamInfo.name ? scores[0] : scores[1];
                                const oppScore = homeTeam === myTeamInfo.name ? scores[1] : scores[0];
                                fixture[opponentName].played.push({
                                    score: `${myScore} - ${oppScore}`,
                                    matchURL: scoreLink.href,
                                    location: location,
                                    status: myScore > oppScore ? 'win' : (myScore < oppScore ? 'loss' : 'draw'),
                                });
                            } else {
                                fixture[opponentName].futureRounds.push(currentRoundText);
                                if (round < nextMatch.round) nextMatch = {
                                    round,
                                    opponentName
                                };
                            }
                        }
                    });
                });
                return {
                    fixture,
                    nextOpponentName: nextMatch.opponentName
                };
            }

            // DEĞİŞİKLİK BAŞLANGICI: Evrenselleştirilmiş Fonksiyon
            function parseScheduleForAllTeams(htmlText, newlyFinishedMatches = new Map()) {
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const allFixtures = {};
                document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS).forEach(row => {
                    const teamLink = row.querySelector(CONFIG.SELECTORS.TEAM_LINK_IN_ROW);
                    if (teamLink) allFixtures[teamLink.textContent.trim()] = {
                        futureOpponents: []
                    };
                });
                const matchRows = doc.querySelectorAll('table.hitlist tbody tr, .matches_container table tbody tr');
                matchRows.forEach(row => {
                    if (row.cells.length < 3) return;
                    const scoreCell = row.cells[1];
                    const scoreText = scoreCell.textContent.trim();
                    const scoreLink = scoreCell.querySelector('a[href*="mid="]');
                    const mid = scoreLink ? new URLSearchParams(scoreLink.href).get('mid') : null;

                    // ESKİ HALİ (Kırılgan): if ((!/^\d+\s*-\s*\d+$/.test(scoreText) || scoreText.includes('vs')) && !newlyFinishedMatches.has(mid))
                    // YENİ HALİ (Evrensel): Oynanmamış bir maçı tespit etmek için sadece skor formatını kontrol etmek yeterlidir.
                    // Bu, 'vs', 'gegen', 'X-X' veya diğer dil varyasyonlarını otomatik olarak yakalar.
                    if (!/^\d+\s*-\s*\d+$/.test(scoreText) && !newlyFinishedMatches.has(mid)) {
                        const homeTeam = row.cells[0].textContent.trim();
                        const awayTeam = row.cells[2].textContent.trim();
                        if (allFixtures[homeTeam] && allFixtures[awayTeam]) {
                            allFixtures[homeTeam].futureOpponents.push(awayTeam);
                            allFixtures[awayTeam].futureOpponents.push(homeTeam);
                        }
                    }
                });
                return allFixtures;
            }
            // DEĞİŞİKLİK SONU

            async function calculateAndDisplayFixtureDifficulty(newlyFinishedMatches = new Map()) {
                const scheduleData = await fetchAndCacheSchedule();
                if (!scheduleData) {
                    document.querySelectorAll(`td:nth-child(${CONFIG.COLUMNS.FIXTURE_DIFFICULTY + 1})`).forEach(cell => {
                        if (cell) {
                            cell.textContent = '-';
                            cell.title = i18n.get('fzNotAvailable');
                        }
                    });
                    return;
                }
                const allFixtures = parseScheduleForAllTeams(scheduleData.htmlText, newlyFinishedMatches);
                const teamRankings = new Map();
                document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS).forEach(row => {
                    const teamLink = row.querySelector(CONFIG.SELECTORS.TEAM_LINK_IN_ROW);
                    const rank = parseInt(row.cells[CONFIG.COLUMNS.POSITION].textContent, 10);
                    if (teamLink && !isNaN(rank)) teamRankings.set(teamLink.textContent.trim(), rank);
                });
                document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS).forEach(row => {
                    const teamLink = row.querySelector(CONFIG.SELECTORS.TEAM_LINK_IN_ROW);
                    if (!teamLink) return;
                    const teamName = teamLink.textContent.trim();
                    const teamFixture = allFixtures[teamName];
                    const fzCell = row.cells[CONFIG.COLUMNS.FIXTURE_DIFFICULTY];
                    if (fzCell && teamFixture && teamFixture.futureOpponents.length > 0) {
                        const rankSum = teamFixture.futureOpponents.reduce((sum, opponentName) => sum + (teamRankings.get(opponentName) || 0), 0);
                        const fzValue = rankSum / teamFixture.futureOpponents.length;
                        fzCell.textContent = fzValue.toFixed(1);
                        fzCell.title = i18n.get('fzTooltip', {
                            remaining: teamFixture.futureOpponents.length,
                            rankSum: rankSum
                        });
                    } else if (fzCell) {
                        fzCell.textContent = '-';
                        fzCell.title = i18n.get('fzNoMatchesLeft');
                    }
                });
            }

            // =================================================================================
            // BÖLÜM: İÇ SAHA / DIŞ SAHA FİLTRELEME FONKSİYONLARI (YENİ EKLENDİ)
            // =================================================================================

            /**
 * Maç programı sayfasındaki tüm OYNANMIŞ maçları ayrıştırır ve bir dizi olarak döndürür.
 * Sonuçları `allPlayedMatchesCache` içinde saklar.
 */
            function parseAllPlayedMatches() {
                if (allPlayedMatchesCache) return allPlayedMatchesCache;
                if (!fullScheduleCache || !fullScheduleCache.htmlText) return [];

                const doc = new DOMParser().parseFromString(fullScheduleCache.htmlText, 'text/html');
                const playedMatches = [];
                const scoreRegex = /^\d+\s*-\s*\d+$/;

                // Fikstür sayfalarındaki tüm maç satırlarını bul
                doc.querySelectorAll('.matches_container table tbody tr, table.hitlist tbody tr').forEach(row => {
                    const cells = row.cells;
                    if (cells.length < 3) return;

                    const homeTeam = cells[0].textContent.trim();
                    const scoreText = cells[1].textContent.trim();
                    const awayTeam = cells[2].textContent.trim();

                    // Sadece skoru olan (oynanmış) maçları işle
                    if (scoreRegex.test(scoreText)) {
                        const scores = scoreText.split('-').map(s => parseInt(s.trim(), 10));
                        playedMatches.push({
                            homeTeam,
                            awayTeam,
                            homeGoals: scores[0],
                            awayGoals: scores[1]
                        });
                    }
                });

                allPlayedMatchesCache = playedMatches;
                return playedMatches;
            }

            /**
 * Verilen maç listesine ve filtre türüne göre puan durumunu hesaplar.
 * @param {string[]} allTeams - Ligdeki tüm takımların adlarını içeren dizi.
 * @param {object[]} allMatches - Oynanmış tüm maçların verilerini içeren dizi.
 * @param {'home'|'away'} filterType - Hesaplanacak tablo türü.
 * @returns {object} - Her takım için hesaplanmış istatistikleri içeren nesne.
 */
            function calculateTableFromMatches(allTeams, allMatches, filterType) {
                const standings = {};
                // Tüm takımlar için istatistikleri sıfırla
                allTeams.forEach(team => {
                    standings[team] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, played: 0 };
                });

                allMatches.forEach(match => {
                    const { homeTeam, awayTeam, homeGoals, awayGoals } = match;

                    // Maç sonucunu belirle
                    let homeResult, awayResult;
                    if (homeGoals > awayGoals) {
                        homeResult = { p: 3, w: 1, d: 0, l: 0 };
                        awayResult = { p: 0, w: 0, d: 0, l: 1 };
                    } else if (awayGoals > homeGoals) {
                        homeResult = { p: 0, w: 0, d: 0, l: 1 };
                        awayResult = { p: 3, w: 1, d: 0, l: 0 };
                    } else {
                        homeResult = { p: 1, w: 0, d: 1, l: 0 };
                        awayResult = { p: 1, w: 0, d: 1, l: 0 };
                    }

                    // Filtreye göre istatistikleri güncelle
                    if (filterType === 'home' && standings[homeTeam]) {
                        standings[homeTeam].played++;
                        standings[homeTeam].p += homeResult.p;
                        standings[homeTeam].w += homeResult.w;
                        standings[homeTeam].d += homeResult.d;
                        standings[homeTeam].l += homeResult.l;
                        standings[homeTeam].gf += homeGoals;
                        standings[homeTeam].ga += awayGoals;
                    }

                    if (filterType === 'away' && standings[awayTeam]) {
                        standings[awayTeam].played++;
                        standings[awayTeam].p += awayResult.p;
                        standings[awayTeam].w += awayResult.w;
                        standings[awayTeam].d += awayResult.d;
                        standings[awayTeam].l += awayResult.l;
                        standings[awayTeam].gf += awayGoals;
                        standings[awayTeam].ga += homeGoals;
                    }
                });

                return standings;
            }

            /**
 * Hesaplanan yeni puan durumu verileriyle DOM'daki tabloyu günceller.
 * @param {object} standings - Hesaplanmış istatistikleri içeren nesne.
 */
            function updateTableDisplay(standings) {
                const tableRows = document.querySelectorAll(CONFIG.SELECTORS.TABLE_ROWS);
                tableRows.forEach(row => {
                    const teamLink = row.querySelector(CONFIG.SELECTORS.TEAM_LINK_IN_ROW);
                    if (!teamLink) return;

                    const teamName = teamLink.textContent.trim();
                    const stats = standings[teamName];
                    if (!stats) return;

                    const C = CONFIG.COLUMNS;
                    const cells = row.cells;
                    cells[C.PLAYED].textContent = stats.played;
                    cells[C.WINS].textContent = stats.w;
                    cells[C.DRAWS].textContent = stats.d;
                    cells[C.LOSSES].textContent = stats.l;
                    cells[C.GOALS_FOR].textContent = stats.gf;
                    cells[C.GOALS_AGAINST].textContent = stats.ga;
                    cells[C.GOAL_DIFFERENCE].textContent = stats.gf - stats.ga;
                    cells[C.POINTS].textContent = stats.p;
                });

                sortTableByPoints();
            }

            /**
 * Filtre butonlarını oluşturur ve sayfaya ekler.
 */
            function setupHomeAwayFilters() {
                const titleHeader = findMainLeagueTableHeader();
                if (!titleHeader || document.querySelector('.mz-table-filters')) return;

                // Önceki denemelerden kalmış olabilecek eski konteynerleri temizle
                const existingFilters = titleHeader.querySelector('.mz-table-filters');
                if (existingFilters) existingFilters.remove();

                const filterContainer = document.createElement('div');
                filterContainer.className = 'mz-table-filters';
                filterContainer.style.cssText = 'display: inline-flex; gap: 5px; margin-left: 15px; vertical-align: middle;';

                const filters = [
                    { type: 'all', text: i18n.get('overall') },
                    { type: 'home', text: i18n.get('home') },
                    { type: 'away', text: i18n.get('away') }
                ];

                filters.forEach(filter => {
                    const buttonLink = document.createElement('a');
                    buttonLink.href = '#';
                    buttonLink.className = 'mzbtn buttondiv button_account';
                    buttonLink.dataset.filter = filter.type;
                    buttonLink.style.margin = '0';

                    // YENİ EKLENDİ: Butonun büyüme animasyonunu akıcı hale getirir.
                    buttonLink.style.transition = 'transform 0.15s ease-in-out';

                    buttonLink.innerHTML = `
            <span class="buttonClassMiddle">
                <span style="white-space: nowrap;">${filter.text}</span>
            </span>
            <span class="buttonClassRight"> </span>`;

                    if (filter.type === 'all') {
                        // ESKİ HALİ: buttonLink.style.filter = 'brightness(85%)';
                        // YENİ HALİ: Sayfa ilk açıldığında "Genel" butonu aktif ve büyük görünür.
                        buttonLink.style.transform = 'scale(1.05)';
                        buttonLink.style.zIndex = '1'; // Diğer butonların üzerine çıkması için
                    }

                    buttonLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleFilterClick(filter.type);
                    });

                    filterContainer.appendChild(buttonLink);
                });

                titleHeader.appendChild(filterContainer);
            }

            /**
 * Filtre butonuna tıklandığında tetiklenir. (Güncellenmiş Versiyon)
 */
            function handleFilterClick(filterType) {
                // Aktif buton stilini ayarla
                document.querySelectorAll('.mz-table-filters .mzbtn').forEach(btn => {
                    // ESKİ MANTIK (Karartma):
                    // btn.style.filter = '';
                    // if (btn.dataset.filter === filterType) {
                    //     btn.style.filter = 'brightness(85%)';
                    // }

                    // YENİ MANTIK (Büyütme):
                    // Önce tüm butonları varsayılan (küçük) haline geri getir.
                    btn.style.transform = 'scale(1)';
                    btn.style.zIndex = '0';

                    // Sadece tıklanan butonu büyüt ve öne çıkar.
                    if (btn.dataset.filter === filterType) {
                        btn.style.transform = 'scale(1.15)'; // Hafifçe büyüt
                        btn.style.zIndex = '1'; // Diğer butonların üzerine çıkmasını sağla
                    }
                });

                const currentTbody = document.querySelector(CONFIG.SELECTORS.TABLE_BODY);
                if (!currentTbody || !originalTableBody) return;

                if (filterType === 'all') {
                    currentTbody.parentNode.replaceChild(originalTableBody.cloneNode(true), currentTbody);
                    addFixtureDifficultyColumn();
                    toggleLogoVisibility();
                    calculateAndDisplayFixtureDifficulty();
                    if (myTeamInfo.id) {
                        performFullOpponentAnalysis();
                    }
                    return;
                }

                const allMatches = parseAllPlayedMatches();
                if (!allMatches || allMatches.length === 0) return;

                const allTeams = Array.from(originalTableBody.querySelectorAll(CONFIG.SELECTORS.TEAM_LINK_IN_ROW))
                .map(link => link.textContent.trim());

                const newStandings = calculateTableFromMatches(allTeams, allMatches, filterType);
                updateTableDisplay(newStandings);
            }

            // BÖLÜM: ELO SCORE FONKSİYONLARI (YENİ EKLENDİ)
            // =================================================================================
            async function addEloScores() {
                // 1. KİLİT KONTROLÜ: Fonksiyon zaten çalışıyorsa, tekrar çalıştırmadan çık.
                if (isAddingEloScores) {
                    return;
                }

                const leagueTable = document.querySelector(CONFIG.SELECTORS.LEAGUE_TABLE);
                // 2. MEVCUT KONTROL: Eğer tablo veya zaten eklenmiş bir ELO başlığı varsa, tekrar çalışma.
                if (!leagueTable || leagueTable.querySelector('.elo-score-header')) {
                    return;
                }

                // İŞLEMİ KİLİTLE
                isAddingEloScores = true;

                try {
                    const teamIds = [];
                    const tableRows = leagueTable.querySelectorAll('tbody tr');
                    const teamIdMap = new Map();

                    tableRows.forEach(row => {
                        const teamLink = row.querySelector('a[href*="&tid="]');
                        if (teamLink) {
                            const tid = new URLSearchParams(teamLink.href).get('tid');
                            if (tid) {
                                teamIds.push(tid);
                                teamIdMap.set(tid, row);
                            }
                        }
                    });

                    if (teamIds.length === 0) return; // return'den önce kilidi açmak için finally'ye gidecek

                    const apiUrl = `https://statsxente.com/MZ1/Functions/tamper_teams.php?sport=soccer${teamIds.map((id, i) => `&idEquipo${i}=${id}`).join('')}`;
                    const response = await request({ method: "GET", url: apiUrl });

                    if (!response || !response.responseText) {
                        console.warn("ELO API'sinden boş yanıt alındı. Bu lig için ELO verisi mevcut değil.");
                        return;
                    }

                    const eloData = JSON.parse(response.responseText);

                    if (Object.keys(eloData).length === 0) {
                        console.warn("ELO API'sinden veri geldi ancak bu takımlar için ELO puanı bulunamadı.");
                        return;
                    }

                    const headerRow = leagueTable.querySelector('thead tr');
                    if (!headerRow) return;

                    const newHeader = document.createElement('th');
                    newHeader.textContent = 'ELO';
                    newHeader.title = 'ELO Puanı';
                    newHeader.className = 'elo-score-header';
                    headerRow.appendChild(newHeader);

                    tableRows.forEach(row => {
                        const newCell = row.insertCell(-1);
                        newCell.textContent = '-';
                        newCell.className = 'elo-score-cell';
                    });

                    for (const teamId in eloData) {
                        const row = teamIdMap.get(teamId);
                        if (row && eloData[teamId]?.elo) {
                            const eloScore = Math.round(eloData[teamId].elo);
                            const eloCell = row.cells[row.cells.length - 1];
                            if (eloCell) {
                                eloCell.textContent = eloScore.toLocaleString('de-DE');
                            }
                        }
                    }
                } catch (error) {
                    console.error("ELO verileri işlenirken bir hata oluştu:", error);
                } finally {
                    // İŞLEM BİTTİĞİNDE VEYA HATA OLDUĞUNDA KİLİDİ AÇ
                    isAddingEloScores = false;
                }
            }
            async function run() {
                if (!isMainLeagueTableVisible()) {
                    return;
                }
                if (!originalTableBody) {
                    const tbody = document.querySelector(CONFIG.SELECTORS.TABLE_BODY);
                    if (tbody) originalTableBody = tbody.cloneNode(true);
                }
                toggleLogoVisibility();
                // DEĞİŞİKLİK BAŞLANGICI: FZ sütunu sadece Fikstür sekmesi varsa eklenir.
                const scheduleTabLink = document.querySelector(CONFIG.SELECTORS.SCHEDULE_TAB_LINK);
                if (scheduleTabLink) {
                    addFixtureDifficultyColumn();
                    await fetchAndCacheSchedule(); // Sadece FZ hesaplanacaksa Fikstür çekilir
                    await calculateAndDisplayFixtureDifficulty();
                }
                // DEĞİŞİKLİK SONU
                const myTeamRow = document.querySelector(CONFIG.SELECTORS.MY_TEAM_ROW);
                const myTeamLink = myTeamRow?.querySelector(CONFIG.SELECTORS.TEAM_LINK_IN_ROW);
                if (myTeamLink) {
                    myTeamInfo.name = myTeamLink.textContent.trim();
                    myTeamInfo.id = new URLSearchParams(myTeamLink.href).get('tid');
                }
                // fetchAndCacheSchedule zaten yukarıda çağrıldı, tekrar gerek yok
                if (myTeamInfo.id) {
                    await performFullOpponentAnalysis();
                }
                setupLiveUpdateFeature();
                setupSettingsMenu();
                toggleHomeAwayFiltersVisibility();
                addEloScores();
            }

            async function initializeScript() {
                isLogoDisplayEnabled = await GM_getValue('showTeamLogos', true);
                // <<< BU SATIRI EKLEYİN >>>
                isHomeAwayFiltersEnabled = await GM_getValue('showHomeAwayFilters', true);

                injectStyles();
                createSettingsModal();
                NProgress.configure({
                    showSpinner: false
                });
                const contentArea = document.querySelector(CONFIG.SELECTORS.CONTENT_DIV);
                if (!contentArea) return;
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length) {
                            if (isMainLeagueTableVisible() && !document.querySelector(`.${CONFIG.CLASSES.FZ_HEADER}`)) {
                                fullScheduleCache = null;
                                originalTableBody = null;
                                run();
                                break;
                            }
                        }
                    }
                });
                observer.observe(contentArea, {
                    childList: true,
                    subtree: true
                });
                run();
            }

            initializeScript();
        }

        const RETIREMENT_DATA_KEY = 'mz_retirement_data_v2';

        /****************************************************************************************
     *                                                                                      *
     *  BÖLÜM 2: OYUNCU İSTATİSTİK BETİĞİ (ManagerZone Player Stat Averages)                  *
     *                                                                                      *
     ****************************************************************************************/
        function initializePlayerStatsScript() {
            // --- INTERNATIONALIZATION (i18n) ---
            const translations = {
                tr: {
                    // UI Buttons & Titles
                    autoScan: "Otomatik Tara",
                    statistics: "İstatistikler",
                    compare: "Karşılaştır",
                    clearData: "Verileri Sil",
                    compareAllPlayers: "Tüm Oyuncuları Karşılaştır",
                    autoScanOptions: "Otomatik Tarama Seçenekleri",
                    playerComparison: "Oyuncu Karşılaştırması",
                    scanSelectedCategories: (count) => `Seçilen ${count} Kategoride Taramayı Başlat`,
                    avgStatsForMatches: (count) => `Ortalama İstatistikler (${count} maç)`,
                    exportToExcel: "Excel'e Aktar",
                    exporting: "Dışa aktarılıyor...",
                    backupData: "Verileri Yedekle (JSON)",
                    restoreData: "Yedekten Geri Yükle (JSON)",
                    backupInProgress: "Yedekleniyor...",
                    restoreInProgress: "Geri Yüklüyorum...",
                    restoreSuccess: "Veriler başarıyla geri yüklendi! Tablo yenileniyor...",
                    restoreError: "Geçersiz yedek dosyası! Lütfen betik tarafından oluşturulmuş bir JSON dosyası seçtiğinizden emin olun.",
                    // UI Texts & Placeholders
                    scanInfo: "Aşağıdan istatistiklerini toplamak istediğiniz maç türlerini seçin.",
                    selectAll: "Tümünü Seç",
                    deselectAll: "Seçimi Kaldır",
                    // Popups & Alerts
                    loadingPlayerList: "Oyuncu listeniz oluşturuluyor, lütfen bekleyin...",
                    noDataFound: "Karşılaştırılacak oyuncu veya istatistik bulunamadı. Lütfen önce 'Oyuncular' sayfanızı ziyaret ederek listenizi oluşturun veya bir tarama yapın.",
                    confirmClearData: "Tüm oyuncu istatistikleri ve taranan maç kayıtları kalıcı olarak silinecek. Emin misiniz?",
                    allDataCleared: "Tüm istatistik verileri başarıyla temizlendi.",
                    noMatchTypes: "Taranacak maç tipi bulunamadı.",
                    confirmScan: (count) => `${count} farklı maç tipi taranacak. Bu işlem arka planda çalışacak ve biraz zaman alabilir. Devam edilsin mi?`,
                    scanStarting: "Tarama başlıyor...",
                    scanningCategory: (name, current, total) => `Kategori taranıyor: ${name} (${current}/${total})`,
                    processingNewMatch: (catIndex, catTotal, category, matchCurrent, matchTotal, totalScanned, totalOverall) => `Kategori: ${catIndex}/${catTotal} (${category}) | Maç: ${matchCurrent}/${matchTotal} | Toplam: ${totalScanned}/${totalOverall}`,
                    errorFetchingMatch: (mid) => `Hata: Maç ID ${mid} çekilemedi.`,
                    errorProcessingCategory: (name) => `Hata: ${name} işlenemedi. Sonrakine geçiliyor...`,
                    scanFinishedVerifying: "Tarama bitti, kadro listesi doğrulanıyor...",
                    scanSuccessNewMatches: "Otomatik tarama başarıyla tamamlandı! Yeni maç istatistikleri eklendi.",
                    scanSuccessNoNewMatches: "Tarama tamamlandı. Seçilen kategorilerde taranacak yeni maç bulunamadı.",
                    noPlayersToShow: "Gösterilecek oyuncu bulunamadı.",
                    noMatchesForCriteria: "Seçili kriterlere uygun maç bulunamadı.",
                    exportError: "Excel'e aktarma sırasında bir hata oluştu.",
                    // Filters & Table Headers
                    all: "Tümü",
                    none: "Yok",
                    league: "Lig",
                    under18: "Altı 18",
                    under21: "Altı 21",
                    under23: "Altı 23",
                    player: "Oyuncu",
                    age: "Yaş",
                    matches: "Maç",
                    totalSuffix: "(Toplam)",
                    avgSuffix: "(Ort.)",
                    // Stat Mappings (Türkçe)
                    statMappings: {
                        'N': 'Ortalama Puan', 'MP': 'Oynadığı Süre (dk)', 'G': 'Gol', 'A': 'Asist',
                        'SOT': 'Kaleyi Bulan Şut', 'SOT%': 'Kaleyi Bulan Şut Yüzdesi', 'P%': 'Başarılı Pas Yüzdesi',
                        'PL': 'Ortalama Başarılı Pas Mesafesi (m)', 'In': 'Akın Kesme', 'T': 'Top Çalma',
                        'T%': 'Top Çalma Yüzdesi', 'Pos%': 'Tüm takım içinde topa sahip olma yüzdesi', 'Dist': 'Kat Edilen Mesafe (km)',
                        'DistP': 'Topla toplam katedilen mesafesi (km)', 'SpP': 'Topla ortalama hızı (km/s)',
                        'SpR': 'Koşarken ortalama hızı (km/s)', 'Pen': 'Penaltı', 'YC': 'Sarı Kart',
                        'RC': 'Kırmızı Kart', 'SV': 'Kurtarış'
                    },
                    // DEĞİŞİKLİK: Kategori değerlerini ve metinlerini eşleştirmek için
                    categoryValueMap: {
                        'league_senior': 'Lig', 'series': 'Lig', 'friendlyseries': 'Dostluk Ligi', 'world_series': 'Dünya Ligi',
                        'friendly': 'Hazırlık Maçı', 'cup': 'Resmi Kupa', 'u18_world_series': 'U18 Dünya Ligi',
                        'u21_world_series': 'U21 Dünya Ligi', 'u23_world_series': 'U23 Dünya Ligi', 'private_cup': 'Ödüllü/Dostluk Kupası'
                    }
                },
                en: {
                    // UI Buttons & Titles
                    autoScan: "Auto-Scan",
                    statistics: "Statistics",
                    compare: "Compare",
                    clearData: "Clear Data",
                    compareAllPlayers: "Compare All Players",
                    autoScanOptions: "Auto-Scan Options",
                    playerComparison: "Player Comparison",
                    scanSelectedCategories: (count) => `Start Scan for ${count} Selected Categories`,
                    avgStatsForMatches: (count) => `Average Statistics (${count} matches)`,
                    exportToExcel: "Export to Excel",
                    exporting: "Exporting...",
                    backupData: "Backup Data (JSON)",
                    restoreData: "Restore from Backup (JSON)",
                    backupInProgress: "Backing up...",
                    restoreInProgress: "Restoring...",
                    restoreSuccess: "Data restored successfully! Refreshing table...",
                    restoreError: "Invalid backup file! Please make sure you select a JSON file created by the script.",
                    // UI Texts & Placeholders
                    scanInfo: "Select the match types you want to collect statistics from below.",
                    selectAll: "Select All",
                    deselectAll: "Deselect All",
                    // Popups & Alerts
                    loadingPlayerList: "Creating your player list, please wait...",
                    noDataFound: "No players or statistics found to compare. Please visit your 'Squad' page first to create your list or perform a scan.",
                    confirmClearData: "All player statistics and scanned match records will be permanently deleted. Are you sure?",
                    allDataCleared: "All statistics data has been successfully cleared.",
                    noMatchTypes: "No match types found to scan.",
                    confirmScan: (count) => `${count} different match types will be scanned. This process will run in the background and may take some time. Do you want to continue?`,
                    scanStarting: "Scan is starting...",
                    scanningCategory: (name, current, total) => `Scanning category: ${name} (${current}/${total})`,
                    processingNewMatch: (catIndex, catTotal, category, matchCurrent, matchTotal, totalScanned, totalOverall) => `Category: ${catIndex}/${catTotal} (${category}) | Match: ${matchCurrent}/${matchTotal} | Total: ${totalScanned}/${totalOverall}`,
                    errorFetchingMatch: (mid) => `Error: Could not fetch match ID ${mid}.`,
                    errorProcessingCategory: (name) => `Error: Could not process ${name}. Skipping to the next one...`,
                    scanFinishedVerifying: "Scan finished, verifying squad list...",
                    scanSuccessNewMatches: "Automated scan completed successfully! New match statistics have been added.",
                    scanSuccessNoNewMatches: "Scan completed. No new matches were found to scan in the selected categories.",
                    noPlayersToShow: "No players to display.",
                    noMatchesForCriteria: "No matches found for the selected criteria.",
                    exportError: "An error occurred during the Excel export.",
                    // Filters & Table Headers
                    all: "All",
                    none: "None",
                    league: "League",
                    under18: "Under 18",
                    under21: "Under 21",
                    under23: "Under 23",
                    player: "Player",
                    age: "Age",
                    matches: "Matches",
                    totalSuffix: "(Total)",
                    avgSuffix: "(Avg.)",
                    // Stat Mappings (English) - Based on the provided HTML
                    statMappings: {
                        'MP': 'Minutes played', 'N': 'Rating', 'G': 'Goals', 'A': 'Assists', 'S': 'Shots', 'G%': 'Goal percentage',
                        'SOT': 'Shots on target', 'SOT%': 'Shots on target percentage', 'P%': 'Successful pass percentage',
                        'PL': 'Average successful pass length (m)', 'In': 'Interceptions', 'T': 'Tackles',
                        'T%': 'Successful tackle percentage', 'Pos%': 'Team possession percentage', 'Dist': 'Distance covered (km)',
                        'DistP': 'Distance covered with ball (km)', 'SpP': 'Average speed with ball (km/h)',
                        'SpR': 'Average running speed (km/h)', 'Pen': 'Penalties', 'YC': 'Yellow Cards',
                        'RC': 'Red Cards', 'SV': 'Saves'
                    },
                    // DEĞİŞİKLİK: Kategori değerlerini ve metinlerini eşleştirmek için
                    categoryValueMap: {
                        'league_senior': 'League', 'series': 'League', 'friendlyseries': 'Friendly League', 'world_series': 'World League',
                        'friendly': 'Friendly', 'cup': 'Official Cup', 'u18_world_series': 'U18 World League',
                        'u21_world_series': 'U21 World League', 'u23_world_series': 'U23 World League', 'private_cup': 'Prized/Friendly Cup'
                    }
                }
            };

            const detectedLang = $('meta[name="language"]').attr('content') || 'en';
            const lang = detectedLang === 'tr' ? 'tr' : 'en';
            const i18n = translations[lang];

            function getShortCategoryName(categoryText) {
                // DEĞİŞİKLİK BAŞLANGICI: i18n'den gelen metinlerle çalış
                const trMap = translations.tr.categoryValueMap;
                const enMap = translations.en.categoryValueMap;
                // Metnin hangi haritadan geldiğini bul
                if (Object.values(trMap).includes(categoryText)) {
                    if (categoryText === "Federasyon Çatışması Gözlemci Maçı") return "Fed. Gözlemci";
                    if (categoryText === "Federasyon Çatışması Mücadelesi") return "Fed. Mücadelesi";
                    if (categoryText === "Ödüllü/Dostluk Kupası") return "Ödüllü/Dostluk";
                } else if (Object.values(enMap).includes(categoryText)) {
                    if (categoryText === "Federation Clash Scout Match") return "Fed. Scout";
                    if (categoryText === "Federation Clash Challenge") return "Fed. Challenge";
                    if (categoryText === "Prized/Friendly Cup") return "Prized/Friendly";
                    if (categoryText === "Federationsclash: Scoutmatch") return "Fed. Scout";
                    if (categoryText === "Federationsclash: Utmaning") return "Fed. Utmaning";
                }
                return categoryText;
                // DEĞİŞİKLİK SONU
            }

            // Global variable
            let squadPlayersWithStats = [];
            let userTeamId = null;

            // --- Helper Functions ---
            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // --- Style Definitions ---
            GM_addStyle(`
        .mz-script-button {
            padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;
            font-size: 14px; font-weight: bold; color: white; text-align: center;
            transition: background-color 0.2s, opacity 0.2s; vertical-align: middle; margin: 5px;
        }
        .mz-script-button:disabled { background-color: #6c757d !important; opacity: 0.7; cursor: not-allowed; }
        .mz-script-button:hover:not(:disabled) { filter: brightness(110%); }
        #comparePlayersButton { background-color: #17a2b8; }
        #player-stats-popup, #player-comparison-popup, #scrape-options-popup {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #f8f9fa; border: 2px solid #343a40; border-radius: 10px;
            padding: 15px; z-index: 10000; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            color: #212529; font-family: Dosis, sans-serif;
            width: 95vw; max-width: 1500px; max-height: 85vh;
            overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;
        }
        .popup-content-scrollable { overflow-y: auto; flex-grow: 1; padding-right: 5px; }
        .popup-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; padding-bottom: 10px; margin-bottom: 15px; flex-shrink: 0; }
        .popup-header h3 { margin: 0; color: #00529B; font-size: 1.1rem; }
        .popup-filters { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; flex-shrink: 0; align-items: center; }
        .popup-filters select, #player-switcher { padding: 8px; border-radius: 4px; border: 1px solid #ccc; background-color: white; }
        #player-switcher { margin-right: 15px; }
        #player-stats-popup table, #player-comparison-popup table { width: 100%; border-collapse: collapse; font-size: 13px; }
        #player-stats-popup th, #player-stats-popup td, #player-comparison-popup th, #player-comparison-popup td { border: 1px solid #dee2e6; padding: 8px; text-align: left; white-space: nowrap; }
        #player-stats-popup th, #player-comparison-popup th { background-color: #e9ecef; }
        [data-tooltip] { cursor: help !important; }
        #player-comparison-popup .sort-asc::after { content: ' ▲'; color: #007bff; }
        #player-comparison-popup .sort-desc::after { content: ' ▼'; color: #007bff; }
        #player-comparison-popup .sort-sum-desc::after { content: ' (T ▼)'; color: #dc3545; }
        #player-comparison-popup .sort-sum-asc::after { content: ' (T ▲)'; color: #dc3545; }
        #player-comparison-popup .sort-avg-desc::after { content: ' (O ▼)'; color: #28a745; }
        #player-comparison-popup .sort-avg-asc::after { content: ' (O ▲)'; color: #28a745; }
        .table-responsive-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid #ddd; border-radius: 5px; }
        .popup-close { font-size: 28px; font-weight: bold; cursor: pointer; color: #adb5bd; line-height: 1; }
        #age-slider-filter-container {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 5px 0;
            width: 250px; /* Genişliği diğer filtrelere göre ayarlayabilirsiniz */
        }
        #age-slider-filter-container label {
            font-weight: bold;
            color: #333;
            flex-shrink: 0;
            margin-bottom: 0; /* popup-filters'tan gelen stili ezer */
        }
        #age-slider-filter-container input.age-slider-input {
            width: 45px;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px;
        }
        #age-slider-range {
            flex-grow: 1;
        }
        /* jQuery UI Slider Stilleri (Oyunun stiliyle uyumlu) */
        .ui-slider {
            position: relative;
            text-align: left;
        }
        .ui-slider .ui-slider-handle {
            position: absolute;
            z-index: 2;
            width: 1.2em;
            height: 1.2em;
            cursor: default;
            touch-action: none;
            border-radius: 50%;
            background: #f6f6f6;
            border: 1px solid #ccc;
            outline: none;
        }
        .ui-slider .ui-slider-handle:hover {
            border-color: #999;
        }
        .ui-slider .ui-slider-range {
            position: absolute;
            z-index: 1;
            font-size: .7em;
            display: block;
            border: 0;
            background-position: 0 0;
            background-color: #007bff; /* Mavi renk aralık için */
        }
        .ui-widget-content .ui-slider-range {
            background-color: #007bff;
        }
        .ui-slider-horizontal {
            height: .8em;
        }
        .ui-slider-horizontal .ui-slider-handle {
            top: -.3em;
            margin-left: -.6em;
        }
        .ui-slider-horizontal .ui-slider-range {
            top: 0;
            height: 100%;
        }
        .ui-slider-horizontal .ui-slider-range-min {
            left: 0;
        }
        .ui-slider-horizontal .ui-slider-range-max {
            right: 0;
        }
        #mz-stat-loader { position: fixed; top: 0; left: 0; width: 100%; background: #28a745; color: white; padding: 10px 0; z-index: 10001; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); text-align: center; font-size: 16px; display: none; }
        #custom-tooltip { position: fixed; display: none; background-color: #222; color: white; padding: 8px 12px; border-radius: 5px; z-index: 10005; font-size: 12px; max-width: 250px; text-align: center; pointer-events: none; }
        .colored-cell { color: black; font-weight: bold; }
        #mz-stats-actions-container { display: inline-flex; gap: 8px; margin-left: 15px; vertical-align: middle; flex-wrap: wrap; justify-content: center; }
        #mz-stats-actions-container button {
            padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;
            font-weight: bold; color: white; text-align: center; transition: opacity 0.2s, background-color 0.2s;
        }
        #mz-stats-actions-container button:disabled { background-color: #6c757d !important; opacity: 0.7; cursor: not-allowed; }
        #scrapeStatsButton { background-color: #007bff; }
        #viewPlayerStatsButton { background-color: #fd7e14; }
        #comparePlayersButtonMatchPage { background-color: #17a2b8; }
        #clearAllStatsButton { background-color: #dc3545; }
        #scrape-options-list { list-style-type: none; padding: 0; margin: 0 0 15px 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; max-height: 300px; overflow-y: auto; }
        #scrape-options-list li { background: #e9ecef; padding: 8px; border-radius: 4px; }
        #scrape-options-list label { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
        .scrape-options-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        #start-scrape-button { background-color: #28a745; color: white; padding: 12px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; width: 100%; }

        #player-stats-popup {
            width: auto;
            min-width: 500px;
        }
        #popup-stats-table {
            margin: 0 auto;
        }

        .dynamic-stats-container {
            position: relative;
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            margin-left: 4px;
            white-space: nowrap;
        }
        .stats-display-area {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            font-size: 11px;
        }
        .stats-display-area .category-name {
            font-weight: bold;
            color: #00529B;
        }
        .stats-display-area .stats-values span {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            margin-left: 4px;
        }
        .stats-display-area img {
            width: 10px;
            height: 10px;
            vertical-align: middle;
        }
        .assist-icon {
            font-family: "Arial", sans-serif;
            font-weight: bold;
            font-size: 14px;
            color: #28a745;
            vertical-align: middle;
            line-height: 1;
        }
        .stats-category-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 10010;
            list-style-type: none;
            padding: 5px 0;
            margin: 2px 0 0 0;
            max-height: 200px;
            overflow-y: auto;
        }
        .stats-category-dropdown li {
            padding: 6px 15px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
        }
        .stats-category-dropdown li:hover {
            background-color: #f0f0f0;
        }


        @media (max-width: 768px) {
            .popup-filters { flex-direction: column; align-items: stretch; }
            #player-switcher { margin: 10px 0; }
            .popup-header h3 { font-size: 1rem; }
        }


    `);

            // --- Page Router ---
            const params = new URLSearchParams(window.location.search);
            const p = params.get('p');
            const sub = params.get('sub');

            if (p === 'match' && sub === 'played') {
                initMatchPage();
            } else if (p === 'players' || (p === 'player' && params.has('pid'))) {
                initPlayersPage();
            }


            // --- Core Functions ---
            async function updateUserPlayerList() {
                const players = [];
                $('.playerContainer').each(function() {
                    const pid = $(this).find('span.player_id_span').text();
                    const name = $(this).find('h2.subheader a .player_name').text().trim();
                    if (pid && name) {
                        const ageText = $(this).find('.dg_playerview_info table tr:first-child td:first-child').text();
                        let age = parseInt(ageText.replace(/[^0-9]/g, ''));
                        if (isNaN(age)) {
                            age = 0;
                        }
                        players.push({
                            pid: pid,
                            name: name,
                            age: age
                        });
                    }
                });
                if (players.length > 0) {
                    await GM_setValue('myPlayerList', JSON.stringify(players));
                }
            }

            async function populateSquadPlayers() {
                const myPlayerList = JSON.parse(await GM_getValue('myPlayerList', '[]'));
                if (myPlayerList.length > 0) {
                    squadPlayersWithStats = [...myPlayerList];
                    squadPlayersWithStats.sort((a, b) => a.name.localeCompare(b.name, lang === 'tr' ? 'tr-TR' : undefined));
                } else {
                    squadPlayersWithStats = [];
                }
            }

            async function refreshUserPlayerListFromSource() {
                try {
                    const response = await fetch('https://www.managerzone.com/?p=players');
                    if (!response.ok) {
                        return false;
                    }
                    const html = await response.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const players = [];
                    $(doc).find('.playerContainer').each(function() {
                        const pid = $(this).find('span.player_id_span').text();
                        const name = $(this).find('h2.subheader a .player_name').text().trim();
                        if (pid && name) {
                            const ageText = $(this).find('.dg_playerview_info table tr:first-child td:first-child').text();
                            let age = parseInt(ageText.replace(/[^0-9]/g, ''));
                            if (isNaN(age)) {
                                age = 0;
                            }
                            players.push({
                                pid: pid,
                                name: name,
                                age: age
                            });
                        }
                    });
                    if (players.length > 0) {
                        await GM_setValue('myPlayerList', JSON.stringify(players));
                        return true;
                    } else {
                        return false;
                    }
                } catch (error) {
                    return false;
                }
            }


            // =================================================================== //
            // --- MATCH PAGE FUNCTIONS --- //
            // =================================================================== //

            async function initMatchPage() {
                // Maçlar sayfasında takım ID'sini bulmak için sayfadaki ilk uygun linki kullan
                const firstTeamLink = $('#fixtures-results-list a[href*="&tid="]').first();
                if (firstTeamLink.length > 0) {
                    const urlParams_match = new URLSearchParams(firstTeamLink.attr('href').split('?')[1]);
                    userTeamId = urlParams_match.get('tid');
                }

                $('body').append('<div id="custom-tooltip"></div>').append(`<div id="mz-stat-loader"></div>`);
                setupTooltipListeners();

                // --- MOBİL UYUMLULUK DÜZELTMESİ BURADA BAŞLIYOR ---
                // Butonları eklemek için daha güvenilir bir hedef element bulma mantığı
                let targetElement;

                // Önce masaüstü görünümünde kullanılan standart elementi arayalım.
                targetElement = $('#squad-search-toggle');

                // Eğer bulunamazsa, mobil ve diğer görünümlerde de olan filtreleme formunu arayalım.
                if (targetElement.length === 0) {
                    targetElement = $('select[name="selectType"]').closest('form');
                }

                // Eğer form da bulunamazsa, filtrelerin bulunduğu genel kapsayıcıyı arayalım.
                // Bu, genellikle .baz.bazCenter yapısı içinde olur.
                if (targetElement.length === 0) {
                    targetElement = $('select[name="selectType"]').closest('.baz.bazCenter > div');
                }

                // Hiçbiri bulunamazsa, son çare olarak ana içerik alanının en üstüne ekleyelim.
                if (targetElement.length === 0) {
                    targetElement = $('.mainContent').first();
                    if (targetElement.length > 0) {
                        // Bu durumda 'after' yerine 'prepend' kullanarak en başa eklemek daha mantıklı.
                        const actionsContainer = $('<div id="mz-stats-actions-container" style="margin-bottom: 10px;"></div>');
                        targetElement.prepend(actionsContainer);
                        createScrapeButton(actionsContainer);
                        createMatchPageActionButtons(actionsContainer);
                        return; // İşlemi burada bitir.
                    }
                }
                // --- MOBİL UYUMLULUK DÜZELTMESİ BURADA BİTİYOR ---

                if (targetElement.length > 0) {
                    const actionsContainer = $('<div id="mz-stats-actions-container"></div>');
                    targetElement.after(actionsContainer); // Bulunan elementin sonrasına ekliyoruz.
                    createScrapeButton(actionsContainer);
                    createMatchPageActionButtons(actionsContainer);
                }
            }

            function createScrapeButton(container) {
                $(`<button id="scrapeStatsButton" class="mz-script-button">${i18n.autoScan}</button>`)
                    .appendTo(container)
                    .on('click', showMatchTypeSelectionPopup);
            }

            async function ensurePlayerListIsPopulated() {
                await populateSquadPlayers();
                if (squadPlayersWithStats.length === 0) {
                    const loader = $('#mz-stat-loader');
                    loader.text(i18n.loadingPlayerList).show();
                    const success = await refreshUserPlayerListFromSource();
                    loader.hide();
                    if (success) {
                        await populateSquadPlayers();
                    }
                }
                if (squadPlayersWithStats.length === 0) {
                    alert(i18n.noDataFound);
                    return false;
                }
                return true;
            }

            async function updateMatchPageButtonStates() {
                const statsData = await GM_getValue('playerStatsRaw', '{}');
                const hasData = Object.keys(JSON.parse(statsData)).length > 0;
                $('#viewPlayerStatsButton').prop('disabled', !hasData);
                $('#comparePlayersButtonMatchPage').prop('disabled', !hasData);
                $('#clearAllStatsButton').prop('disabled', !hasData);
            }

            function createMatchPageActionButtons(container) {
                container.find('#viewPlayerStatsButton, #comparePlayersButtonMatchPage, #clearAllStatsButton').remove();
                $(`<button id="viewPlayerStatsButton" class="mz-script-button">${i18n.statistics}</button>`)
                    .appendTo(container)
                    .on('click', async () => {
                    if (await ensurePlayerListIsPopulated()) showStatsPopup(squadPlayersWithStats[0].pid);
                });
                $(`<button id="comparePlayersButtonMatchPage" class="mz-script-button">${i18n.compare}</button>`)
                    .appendTo(container)
                    .on('click', async () => {
                    if (await ensurePlayerListIsPopulated()) showAllPlayersComparisonPopup();
                });
                $(`<button id="clearAllStatsButton" class="mz-script-button">${i18n.clearData}</button>`)
                    .appendTo(container)
                    .on('click', async () => {
                    if (confirm(i18n.confirmClearData)) {
                        await GM_deleteValue('playerStatsRaw');
                        await GM_deleteValue('processedMatchIds');
                        await updateMatchPageButtonStates();
                    }
                });
                updateMatchPageButtonStates();
            }

            function showMatchTypeSelectionPopup() {
                $('#scrape-options-popup').remove();
                const matchTypes = [];

                $('select[name="selectType"] optgroup:first option').each(function() {
                    matchTypes.push({
                        value: $(this).val(),
                        text: $(this).text().trim()
                    });
                });

                if (matchTypes.length === 0) {
                    alert(i18n.noMatchTypes);
                    return;
                }

                const optionsHTML = matchTypes.map(mt => `<li><label><input type="checkbox" class="match-type-checkbox" value="${mt.value}" data-text="${mt.text}" checked> ${mt.text}</label></li>`).join('');

                // YENİ DÜĞMELERİN EKLENDİĞİ GÜNCELLENMİŞ HTML
                const popupHTML = `
    <div id="scrape-options-popup">
        <div class="popup-header"><h3>${i18n.autoScanOptions}</h3><span class="popup-close">×</span></div>
        <div class="popup-content-scrollable">
            <p>${i18n.scanInfo}</p>
            <div class="scrape-options-controls"><a href="#" id="select-all-types">${i18n.selectAll}</a><a href="#" id="deselect-all-types">${i18n.deselectAll}</a></div>
            <ul id="scrape-options-list">${optionsHTML}</ul>

            <!-- YENİ EKLENEN BÖLÜM -->
            <div style="border-top: 1px solid #ccc; margin: 15px 0; padding-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                <button id="start-scrape-button">${i18n.scanSelectedCategories(matchTypes.length)}</button>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="backup-json-btn" class="mz-script-button" style="background-color: #007bff; flex-grow: 1;">${i18n.backupData}</button>
                    <button id="restore-json-btn" class="mz-script-button" style="background-color: #ffc107; color: #212529; flex-grow: 1;">${i18n.restoreData}</button>
                </div>
            </div>
            <!-- YENİ BÖLÜM SONU -->

        </div>
    </div>`;
                $('body').append(popupHTML);

                // Olay dinleyicileri (event listeners)
                $('.popup-close').on('click', () => $('#scrape-options-popup').remove());

                $('#select-all-types').on('click', (e) => {
                    e.preventDefault();
                    $('.match-type-checkbox').prop('checked', true).trigger('change');
                });

                $('#deselect-all-types').on('click', (e) => {
                    e.preventDefault();
                    $('.match-type-checkbox').prop('checked', false).trigger('change');
                });

                $('.match-type-checkbox').on('change', () => {
                    const count = $('.match-type-checkbox:checked').length;
                    $('#start-scrape-button').text(i18n.scanSelectedCategories(count)).prop('disabled', count === 0);
                });

                $('#start-scrape-button').on('click', function() {
                    const selectedTypes = [];
                    $('.match-type-checkbox:checked').each(function() {
                        selectedTypes.push({
                            value: $(this).val(),
                            text: $(this).data('text')
                        });
                    });
                    if (selectedTypes.length > 0) {
                        $('#scrape-options-popup').remove();
                        startAutomatedScrape(selectedTypes);
                    }
                    $(this).prop('disabled', true);
                });

                // --- YENİ EKLENEN OLAY DİNLEYİCİLERİ ---
                $('#backup-json-btn').on('click', function() {
                    handleJsonBackup($(this));
                });

                $('#restore-json-btn').on('click', function() {
                    // Geri yükleme işlemi gizli bir dosya girişini tetikler.
                    // Bu girişin var olduğundan emin olalım.
                    if ($('#restore-file-input').length === 0) {
                        $('<input type="file" id="restore-file-input" style="display: none;" accept=".json">')
                            .appendTo('body')
                            .on('change', processRestoreFile);
                    }
                    handleJsonRestore();
                });
                // --- YENİ DİNLEYİCİLER SONU ---
            }

            async function startAutomatedScrape(selectedTypes) {
                const loader = $('#mz-stat-loader');
                loader.text(i18n.scanStarting).show();

                const canonicalStatHeaders = [
                    null, 'Po', 'MP', 'G', 'A', 'S', 'G%', 'SOT', 'SOT%', 'OG', 'P', 'P_S', 'P_F',
                    'P%', 'PL', 'In', 'T_raw', 'T_S', 'T_F', 'T%', 'PosTime', 'Pos%', 'Dist',
                    'DistP', 'SpP', 'SpR', 'Cr', 'Fk', 'Pen', 'YC', 'RC', 'SV'
                ];

                let newMatchesFound = false,
                    playerStats = JSON.parse(await GM_getValue('playerStatsRaw', '{}')),
                    processedMatchIds = new Set(JSON.parse(await GM_getValue('processedMatchIds', '[]'))),
                    myPlayerList = JSON.parse(await GM_getValue('myPlayerList', '[]')),
                    myPlayerPids = new Set(myPlayerList.map(p => p.pid));

                let totalMatchesToScan = 0;
                let totalMatchesScanned = 0;

                loader.text(lang === 'tr' ? 'Taranacak toplam maç sayısı hesaplanıyor...' : 'Calculating total matches to scan...').show();
                for (const category of selectedTypes) {
                    try {
                        const categoryUrl = `https://www.managerzone.com/?p=match&sub=played&selectType=${category.value}&selectTimeLimit=maximum`;
                        const categoryResponse = await fetch(categoryUrl);
                        const categoryHtml = await categoryResponse.text();
                        const categoryDoc = new DOMParser().parseFromString(categoryHtml, 'text/html');
                        const uniqueLinksMap = new Map();
                        $(categoryDoc).find('#fixtures-results-list a.gradientSunriseIcon[href*="sub=stats"]').each(function() {
                            const href = $(this).attr('href'),
                                  mid = new URLSearchParams(href.split('?')[1]).get('mid');
                            if (mid && !uniqueLinksMap.has(mid)) uniqueLinksMap.set(mid, { mid: mid });
                        });
                        const newLinksToScrape = Array.from(uniqueLinksMap.values()).filter(linkInfo => !processedMatchIds.has(linkInfo.mid));
                        totalMatchesToScan += newLinksToScrape.length;
                    } catch (e) {
                        console.error(`Ön tarama hatası: ${category.text}`, e);
                    }
                }


                for (const [categoryIndex, category] of selectedTypes.entries()) {
                    loader.text(i18n.scanningCategory(category.text, categoryIndex + 1, selectedTypes.length));
                    try {
                        const categoryUrl = `https://www.managerzone.com/?p=match&sub=played&selectType=${category.value}&selectTimeLimit=maximum`;
                        const categoryResponse = await fetch(categoryUrl);
                        const categoryHtml = await categoryResponse.text();
                        const categoryDoc = new DOMParser().parseFromString(categoryHtml, 'text/html');
                        const uniqueLinksMap = new Map();
                        $(categoryDoc).find('#fixtures-results-list a.gradientSunriseIcon[href*="sub=stats"]').each(function() {
                            const href = $(this).attr('href'),
                                  mid = new URLSearchParams(href.split('?')[1]).get('mid');
                            if (mid && !uniqueLinksMap.has(mid)) uniqueLinksMap.set(mid, {
                                href: href,
                                mid: mid
                            });
                        });
                        const newLinksToScrape = Array.from(uniqueLinksMap.values()).filter(linkInfo => !processedMatchIds.has(linkInfo.mid));

                        if (newLinksToScrape.length > 0) {
                            newMatchesFound = true;
                            for (const [linkIndex, linkInfo] of newLinksToScrape.entries()) {
                                totalMatchesScanned++;
                                loader.text(i18n.processingNewMatch(
                                    categoryIndex + 1,
                                    selectedTypes.length,
                                    category.text,
                                    linkIndex + 1,
                                    newLinksToScrape.length,
                                    totalMatchesScanned,
                                    totalMatchesToScan
                                ));

                                try {
                                    const matchUrl = new URL('https://www.managerzone.com/');
                                    matchUrl.search = new URLSearchParams(linkInfo.href.split('?')[1]);
                                    const matchResponse = await fetch(matchUrl.toString());
                                    const matchHtml = await matchResponse.text();
                                    const matchDoc = new DOMParser().parseFromString(matchHtml, 'text/html');

                                    let ageLimit = i18n.none;
                                    const categoryTextLower = category.text.toLowerCase();
                                    if (categoryTextLower.includes('18')) ageLimit = i18n.under18;
                                    else if (categoryTextLower.includes('21')) ageLimit = i18n.under21;
                                    else if (categoryTextLower.includes('23')) ageLimit = i18n.under23;

                                    const ratingsMap = {};
                                    // Özet tabloları bul (Class yapısı senin verdiğin HTML'e göre ayarlandı)
                                    $(matchDoc).find('table.hitlist.soccer.statsLite.marker.tablesorter tbody tr').each(function() {
                                        const playerLink = $(this).find('a[href*="pid="]');
                                        if (playerLink.length) {
                                            const pid = new URLSearchParams(playerLink.attr('href').split('?')[1]).get('pid');
                                            // Not sütunu (N) tablonun son sütunudur
                                            const ratingText = $(this).find('td').last().text().trim();
                                            const rating = parseFloat(ratingText);
                                            if (pid && !isNaN(rating)) {
                                                ratingsMap[pid] = rating;
                                            }
                                        }
                                    });

                                    $(matchDoc).find('.matchStats--detailed tbody tr').each(function() {
                                        const playerLink = $(this).find('a.player_link');
                                        if (playerLink.length) {
                                            const pid = new URLSearchParams(playerLink.attr('href').split('?')[1]).get('pid'),
                                                  name = playerLink.text().trim();
                                            if (!myPlayerPids.has(pid)) {
                                                myPlayerList.push({
                                                    pid,
                                                    name,
                                                    age: 0
                                                });
                                                myPlayerPids.add(pid);
                                            }
                                            if (!playerStats[pid]) playerStats[pid] = {
                                                name: name,
                                                matches: []
                                            };
                                            playerStats[pid].name = name;
                                            const currentMatchStats = {};

                                            $(this).find('td').each(function(colIndex) {
                                                const statName = canonicalStatHeaders[colIndex];
                                                if (statName && !['Po', 'OG', 'Cr', 'Fk', 'P', 'P_S', 'P_F', 'T_raw', 'T_S', 'T_F', 'PosTime'].includes(statName)) {
                                                    const rawValue = $(this).text().trim().replace('%', '').replace(',', '.').replace("'", "");
                                                    let numValue = parseFloat(rawValue);
                                                    if (statName === 'T' && currentMatchStats['T%'] !== undefined) {
                                                    } else if (!isNaN(numValue)) {
                                                        currentMatchStats[statName] = numValue;
                                                    }
                                                }
                                            });

                                            if (ratingsMap[pid] !== undefined) {
                                                currentMatchStats['N'] = ratingsMap[pid];
                                            }

                                            if (Object.keys(currentMatchStats).length > 0) {
                                                // DEĞİŞİKLİK BAŞLANGICI: Evrensel Filtreleme için `matchTypeValue` ekle
                                                playerStats[pid].matches.push({
                                                    matchId: linkInfo.mid,
                                                    matchType: category.text, // Görüntüleme için
                                                    matchTypeValue: category.value, // Filtreleme için
                                                    ageLimit: ageLimit,
                                                    stats: currentMatchStats
                                                });
                                                // DEĞİŞİKLİK SONU
                                            }
                                        }
                                    });
                                    processedMatchIds.add(linkInfo.mid);
                                } catch (error) {
                                    console.error(i18n.errorFetchingMatch(linkInfo.mid), error);
                                }
                                await sleep(250);
                            }
                        } else {
                            await sleep(500);
                        }
                    } catch (error) {
                        loader.text(i18n.errorProcessingCategory(category.text));
                        await sleep(2000);
                    }
                }
                await GM_setValue('playerStatsRaw', JSON.stringify(playerStats));
                await GM_setValue('processedMatchIds', JSON.stringify(Array.from(processedMatchIds)));
                loader.text(i18n.scanFinishedVerifying);
                await refreshUserPlayerListFromSource();
                await populateSquadPlayers();
                loader.hide();
                await updateMatchPageButtonStates();
                $('#start-scrape-button').prop('disabled', false);
            }

            // ========================================================================= //
            // --- PLAYER PAGE FUNCTIONS --- //
            // ========================================================================= //

            const displayColumns = ['N', 'MP', 'G', 'A', 'S', 'G%', 'SOT', 'SOT%', 'P%', 'PL', 'In', 'T%', 'Pos%', 'Dist', 'DistP', 'SpP', 'SpR', 'YC', 'RC', 'SV'];
            const sumAvgColumns = ['G', 'A', 'YC', 'RC'];

            // DEĞİŞİKLİK BAŞLANGICI: Fonksiyonu `matchTypeValue` kullanacak şekilde güncelle
            function calculateAverages(playerData, filterTypeValue, filterAge) {
                if (!playerData || !playerData.matches) return null;
                const filteredMatches = playerData.matches.filter(match =>
                                                                  (filterTypeValue === 'all' || match.matchTypeValue === filterTypeValue) &&
                                                                  (filterAge === i18n.all || match.ageLimit === filterAge)
                                                                 );
                // DEĞİŞİKLİK SONU
                if (filteredMatches.length === 0) return {
                    name: playerData.name,
                    matches: 0
                };
                const totalStats = {},
                      statCounts = {};
                filteredMatches.forEach(match => {
                    for (const key in match.stats) {
                        totalStats[key] = (totalStats[key] || 0) + match.stats[key];
                        statCounts[key] = (statCounts[key] || 0) + 1;
                    }
                });
                const summary = {};
                for (const key in totalStats) {
                    if (sumAvgColumns.includes(key)) {
                        summary[`${key}_sum`] = totalStats[key];
                        summary[`${key}_avg`] = (totalStats[key] / filteredMatches.length).toFixed(2);
                    } else {
                        summary[key] = (totalStats[key] / statCounts[key]).toFixed(2);
                    }
                }
                return {
                    name: playerData.name,
                    matches: filteredMatches.length,
                    ...summary
                };
            }

            async function initPlayersPage() {
                // --- TAKIM ID'SİNİ ALMA KISMI (DOKUNMAYIN) ---
                const urlParams_players = new URLSearchParams(window.location.search);
                userTeamId = urlParams_players.get('tid');
                if (!userTeamId) {
                    const firstPlayerLink = $('h2.subheader a[href*="&tid="]').first();
                    if (firstPlayerLink.length > 0) {
                        const hrefParams = new URLSearchParams(firstPlayerLink.attr('href').split('?')[1]);
                        userTeamId = hrefParams.get('tid');
                    }
                }
                // ---------------------------------------------------------------------

                $('body').append('<div id="custom-tooltip"></div>');

                // --- EN ÖNEMLİ DÜZELTME BURADA ---
                // Sadece ana kadro sayfasındaysak (URL'de pid= yoksa) listeyi güncelle ve butonu ekle.
                if ($('.playerContainer').length > 0 && !urlParams_players.has('pid')) {
                    await updateUserPlayerList();
                    $(`<button id="comparePlayersButton" class="mz-script-button">${i18n.compareAllPlayers}</button>`)
                        .insertAfter('#squad-search-toggle')
                        .on('click', showAllPlayersComparisonPopup);
                }
                // ---------------------------------------------------------------------

                await populateSquadPlayers();
                await injectStatsIcons();
                setupTooltipListeners();
                $(document).on('click', '.stats-button', function() {
                    showStatsPopup($(this).data('pid'));
                });

                $(document).on('click', '.stats-display-area', function(e) {
                    e.stopPropagation();
                    $('.stats-category-dropdown').not($(this).siblings('.stats-category-dropdown')).hide();
                    $(this).siblings('.stats-category-dropdown').toggle();
                });

                $(document).on('click', '.stats-category-dropdown li', async function(e) {
                    e.stopPropagation();
                    const selectedCategoryValue = $(this).data('value');
                    const selectedCategoryText = $(this).text();
                    const container = $(this).closest('.dynamic-stats-container');
                    const pid = container.data('pid');

                    const rawData = JSON.parse(await GM_getValue('playerStatsRaw', '{}'));
                    const stats = getCategorySummaryStats(pid, selectedCategoryValue, rawData);

                    const displayArea = container.find('.stats-display-area');
                    displayArea.find('.category-name').text(getShortCategoryName(selectedCategoryText));
                    displayArea.find('.stat-g').text(stats.G);
                    displayArea.find('.stat-a').text(stats.A);
                    displayArea.find('.stat-yc').text(stats.YC);
                    displayArea.find('.stat-rc').text(stats.RC);

                    $(this).parent().hide();
                });

                $(document).on('click', function() {
                    $('.stats-category-dropdown').hide();
                });
            }


            async function injectStatsIcons() {
                await populateSquadPlayers();
                const rawData = JSON.parse(await GM_getValue('playerStatsRaw', '{}'));
                if (Object.keys(rawData).length === 0) return;

                const myPlayerPidsWithStats = new Set(Object.keys(rawData));
                const statsButtonHTML = `<button class="stats-button" style="padding: 2px 8px; font-size: 12px; margin-left: 10px; vertical-align: middle; background-color: #007bff; color: white; border: 1px solid #006fe6; border-radius: 12px; cursor: pointer;">${i18n.statistics}</button>`;

                const injectContent = (container) => {
                    const pid = container.find('span.player_id_span').text().trim() || new URLSearchParams(window.location.search).get('pid');
                    if (!pid) return;

                    const isSinglePlayerPage = container.is('div.player-title');
                    const headerTarget = isSinglePlayerPage ? container.find('h2') : container.find('h2.subheader a');

                    if (myPlayerPidsWithStats.has(pid) && headerTarget.parent().find('.stats-button').length === 0) {
                        $(statsButtonHTML).data('pid', pid).insertAfter(headerTarget);
                    }

                    const statsTd = container.find('td[colspan="2"][style*="padding-top: 12px;"]');
                    if (statsTd.length > 0 && statsTd.find('.dynamic-stats-container').length === 0 && myPlayerPidsWithStats.has(pid)) {
                        const playerData = rawData[pid];
                        if (!playerData || !playerData.matches || playerData.matches.length === 0) return;

                        // DEĞİŞİKLİK BAŞLANGICI: Kategorileri value ve text olarak ayır
                        const availableCategories = new Map();
                        playerData.matches.forEach(m => {
                            if (m.matchTypeValue && !availableCategories.has(m.matchTypeValue)) {
                                availableCategories.set(m.matchTypeValue, m.matchType);
                            }
                        });
                        if (availableCategories.size === 0) return;

                        let sortedCategories = Array.from(availableCategories.entries()).sort((a,b) => a[1].localeCompare(b[1]));
                        sortedCategories.unshift(['all', i18n.all]);
                        const defaultCategoryValue = 'all';
                        const defaultCategoryText = i18n.all;
                        // DEĞİŞİKLİK SONU

                        const defaultStats = getCategorySummaryStats(pid, defaultCategoryValue, rawData);

                        // DEĞİŞİKLİK: `data-value` ve `data-category` ekle
                        const dropdownItemsHTML = sortedCategories.map(([value, text]) => `<li data-value="${value}">${getShortCategoryName(text)}</li>`).join('');

                        const dynamicStatsHTML = `
                        <div class="dynamic-stats-container" data-pid="${pid}">
                            <div class="stats-display-area" title="İstatistik kategorisini değiştirmek için tıklayın">
                                <span class="category-name">${getShortCategoryName(defaultCategoryText)}</span><span style="font-weight: bold; font-size: 10px; margin-left: 2px;">▼</span>
                                <div class="stats-values">
                                    <span title="${i18n.statMappings['G']}"><img src="/nocache-936/img/soccer/goal.gif"> <strong class="stat-g">${defaultStats.G}</strong></span>
                                    <span title="${i18n.statMappings['A']}"><span class="assist-icon">👟</span> <strong class="stat-a">${defaultStats.A}</strong></span>
                                    <span title="${i18n.statMappings['YC']}"><img src="/nocache-936/img/card_yellow.gif"> <strong class="stat-yc">${defaultStats.YC}</strong></span>
                                    <span title="${i18n.statMappings['RC']}"><img src="/nocache-936/img/card_red.gif"> <strong class="stat-rc">${defaultStats.RC}</strong></span>
                                </div>
                            </div>
                            <ul class="stats-category-dropdown">${dropdownItemsHTML}</ul>
                        </div>
                    `;

                        statsTd.find('img[src*="goal.gif"], img[src*="card_yellow.gif"], img[src*="card_red.gif"], br').remove();
                        statsTd.contents().filter(function() { return this.nodeType === 3; }).remove();
                        statsTd.prepend(dynamicStatsHTML);
                    }
                };

                if ($('.playerContainer').length > 0) {
                    $('.playerContainer').each(function() {
                        injectContent($(this));
                    });
                } else if (window.location.href.includes('p=player&pid=')) {
                    injectContent($('div.player-title').closest('.mainContent'));
                }
            }

            // DEĞİŞİKLİK BAŞLANGICI: `matchTypeValue` ile filtreleme yapacak şekilde güncelle
            function getCategorySummaryStats(pid, filterTypeValue, rawData) {
                const playerData = rawData[pid];
                if (!playerData || !playerData.matches) return { G: 0, A: 0, YC: 0, RC: 0 };

                const filteredMatches = playerData.matches.filter(match => {
                    if (!match.matchTypeValue) return false;
                    if (filterTypeValue === 'all') return true;
                    if (filterTypeValue === 'league') { // "Lig" için özel filtreleme
                        return match.matchTypeValue.includes('league') || match.matchTypeValue.includes('series');
                    }
                    return match.matchTypeValue === filterTypeValue;
                });
                // DEĞİŞİKLİK SONU

                if (filteredMatches.length === 0) return { G: 0, A: 0, YC: 0, RC: 0 };

                return filteredMatches.reduce((acc, match) => {
                    acc.G += match.stats.G || 0;
                    acc.A += match.stats.A || 0;
                    acc.YC += match.stats.YC || 0;
                    acc.RC += match.stats.RC || 0;
                    return acc;
                }, { G: 0, A: 0, YC: 0, RC: 0 });
            }


            async function showStatsPopup(pid) {
                $('#player-stats-popup').remove();
                await populateSquadPlayers();
                if (squadPlayersWithStats.length === 0) {
                    alert(i18n.noPlayersToShow);
                    return;
                }

                const rawData = JSON.parse(await GM_getValue('playerStatsRaw', '{}'));
                const playerOptionsHTML = squadPlayersWithStats.map(player => `<option value="${player.pid}" ${player.pid === pid ? 'selected' : ''}>${player.name}</option>`).join('');

                const popupHTML = `
                <div id="player-stats-popup">
                    <div class="popup-header">
                        <h3 id="popup-title"></h3><span class="popup-close">×</span>
                    </div>
                    <div class="popup-content-scrollable">
                         <div style="display: flex; align-items: center;">
                           <select id="player-switcher">${playerOptionsHTML}</select>
                         </div>
                        <div id="popup-category-selector" class="popup-filters" style="flex-direction: column; align-items: stretch; border: 1px solid #ccc; border-radius: 5px; padding: 5px; cursor: pointer; position: relative; margin-top: 15px;">
                            <div id="category-display-wrapper" style="display: flex; justify-content: space-between; align-items: center;">
                                <span id="current-category-name" style="font-weight: bold; color: #00529B;"></span>
                                <div id="current-category-stats" style="display: flex; gap: 10px; align-items: center; font-size: 12px;"></div>
                                <span id="category-dropdown-trigger" style="font-weight: bold; padding: 0 5px;">▼</span>
                            </div>
                            <ul id="category-dropdown-list" style="display: none; position: absolute; top: 100%; left: -1px; right: -1px; background: white; border: 1px solid #ccc; list-style: none; padding: 0; margin: 5px 0 0; z-index: 10001; max-height: 200px; overflow-y: auto; border-radius: 0 0 5px 5px;">
                            </ul>
                        </div>
                        <table id="popup-stats-table" style="margin-top:15px;"><thead><tr><th>${i18n.statistics}</th><th>Value</th></tr></thead><tbody></tbody></table>
                    </div>
                </div>`;
                $('body').append(popupHTML);

                const updatePopupForPlayer = (currentPid) => {
                    const playerData = rawData[currentPid];
                    const availableCategories = new Map();
                    if (playerData && playerData.matches) {
                        playerData.matches.forEach(m => { if(m.matchTypeValue) availableCategories.set(m.matchTypeValue, m.matchType) });
                    }
                    const sortedCategories = Array.from(availableCategories.entries()).sort((a,b) => a[1].localeCompare(b[1]));

                    if (sortedCategories.length > 0) {
                        sortedCategories.unshift(['all', i18n.all]);

                        const categoryDropdown = $('#category-dropdown-list').empty();
                        sortedCategories.forEach(([value, text]) => {
                            categoryDropdown.append(`<li data-value="${value}" style="padding: 8px 12px; cursor: pointer;">${getShortCategoryName(text)}</li>`);
                        });
                        $('#popup-category-selector').show();

                        const defaultCategoryValue = 'all';
                        $('#popup-category-selector').attr('data-selected-category', defaultCategoryValue);
                        $('#current-category-name').text(getShortCategoryName(i18n.all));
                        updateCategoryStatsDisplay(currentPid, defaultCategoryValue, rawData);
                        updateStatsPopupTable(currentPid, defaultCategoryValue);
                    } else {
                        $('#popup-category-selector').hide();
                        updateStatsPopupTable(currentPid, 'all');
                    }
                };

                const updateCategoryStatsDisplay = (currentPid, categoryValue, rawData) => {
                    const stats = getCategorySummaryStats(currentPid, categoryValue, rawData);
                    $('#current-category-stats').html(`
                    <span title="${i18n.statMappings['G']}"><img src="/nocache-936/img/soccer/goal.gif" style="width:10px; vertical-align: middle;"> ${stats.G}</span>
                    <span title="${i18n.statMappings['A']}"><span class="assist-icon" style="vertical-align: middle;">👟</span> ${stats.A}</span>
                    <span title="${i18n.statMappings['YC']}"><img src="/nocache-936/img/card_yellow.gif" style="width:8px; vertical-align: middle;"> ${stats.YC}</span>
                    <span title="${i18n.statMappings['RC']}"><img src="/nocache-936/img/card_red.gif" style="width:8px; vertical-align: middle;"> ${stats.RC}</span>
                `);
                };

                $('#player-switcher').on('change', function() { updatePopupForPlayer($(this).val()); });
                $('#popup-category-selector').on('click', (e) => { e.stopPropagation(); $('#category-dropdown-list').slideToggle(200); });
                $('#category-dropdown-list').on('mouseenter', 'li', function(){ $(this).css('background-color', '#f0f0f0'); });
                $('#category-dropdown-list').on('mouseleave', 'li', function(){ $(this).css('background-color', 'white'); });
                $('#category-dropdown-list').on('click', 'li', function(e) {
                    e.stopPropagation();
                    const selectedCategoryValue = $(this).data('value');
                    const selectedCategoryText = $(this).text();
                    $('#popup-category-selector').attr('data-selected-category', selectedCategoryValue);
                    $('#current-category-name').text(getShortCategoryName(selectedCategoryText));
                    const currentPid = $('#player-switcher').val();
                    updateCategoryStatsDisplay(currentPid, selectedCategoryValue, rawData);
                    updateStatsPopupTable(currentPid, selectedCategoryValue);
                    $('#category-dropdown-list').hide();
                });
                $(document).on('click.statsPopup', function(e) { if (!$('#popup-category-selector').is(e.target) && $('#popup-category-selector').has(e.target).length === 0) { $('#category-dropdown-list').slideUp(200); } });
                $('#player-stats-popup .popup-close').on('click', () => { $('#player-stats-popup').remove(); $(document).off('click.statsPopup'); });

                updatePopupForPlayer(pid);
            }

            async function updateStatsPopupTable(pid, filterTypeValue) {
                $('#player-stats-popup').data('pid', pid);
                const rawData = JSON.parse(await GM_getValue('playerStatsRaw', '{}'));
                let data = calculateAverages(rawData[pid], filterTypeValue, i18n.all);

                const tableBody = $('#popup-stats-table tbody').empty();
                if (!data) {
                    const playerInfo = squadPlayersWithStats.find(p => p.pid === pid);
                    data = { name: playerInfo ? playerInfo.name : 'Unknown Player', matches: 0 };
                }

                const matchesText = data.matches > 0 ? i18n.avgStatsForMatches(data.matches) : '';
                $('#popup-title').html(`${data.name} <br><small style="color: #6c757d;">${matchesText}</small>`);

                if (data.matches > 0) {
                    displayColumns.forEach(key => {
                        const displayName = i18n.statMappings[key] || key;
                        if (sumAvgColumns.includes(key)) {
                            const sum = data[`${key}_sum`] || 0,
                                  avg = data[`${key}_avg`] || '0.00';
                            tableBody.append(`<tr><td>${displayName} (Tot/Avg)</td><td><strong>${sum} / ${avg}</strong></td></tr>`);
                        } else if (data[key] !== undefined) {
                            const suffix = key.includes('%') ? ' %' : '';
                            tableBody.append(`<tr><td>${displayName}</td><td><strong>${data[key]}${suffix}</strong></td></tr>`);
                        }
                    });
                } else {
                    tableBody.append(`<tr><td colspan="2">${i18n.noMatchesForCriteria}</td></tr>`);
                }
            }


            async function showAllPlayersComparisonPopup() {
                $('#player-comparison-popup').remove();
                if (window.location.href.includes('?p=players')) { await updateUserPlayerList(); }
                await populateSquadPlayers();
                if (squadPlayersWithStats.length === 0) { alert(i18n.noDataFound); return; }
                const rawData = JSON.parse(await GM_getValue('playerStatsRaw', '{}'));

                const allMatches = Object.values(rawData).flatMap(p => p.matches || []);
                const matchTypes = new Map([['all', i18n.all]]);
                allMatches.forEach(m => {
                    if(m.matchTypeValue && !matchTypes.has(m.matchTypeValue)) {
                        matchTypes.set(m.matchTypeValue, m.matchType);
                    }
                });
                const sortedMatchTypes = Array.from(matchTypes.entries()).sort((a,b) => a[0] === 'all' ? -1 : (b[0] === 'all' ? 1 : a[1].localeCompare(b[1])));
                const matchTypeOptions = sortedMatchTypes.map(([value, text]) => `<option value="${value}">${text}</option>`).join('');

                const ageLimits = [i18n.all, i18n.none, i18n.under18, i18n.under21, i18n.under23];
                let tableHeaderHTML = `<th data-sort-type="text" data-tooltip="${i18n.player}">${i18n.player}</th><th data-sort-type="numeric" data-tooltip="${i18n.age}">${i18n.age}</th><th data-sort-type="numeric" data-tooltip="${i18n.matches}">${i18n.matches}</th>${displayColumns.map(col => `<th data-sort-type="numeric" data-tooltip="${i18n.statMappings[col] || col}">${col}</th>`).join('')}`;

                // --- KOŞULLU HTML OLUŞTURMA (MOBİL / MASAÜSTÜ AYRIMI) ---
                let ageFilterHTML = '';
                if ($.fn.slider) {
                    // MASAÜSTÜ: Slider'lı filtre
                    ageFilterHTML = `
                <div id="age-slider-filter-container">
                    <label for="agea_slider_input">Yaş:</label>
                    <input type="text" id="agea_slider_input" class="age-slider-input">
                    <div id="age-slider-range" class="ui-slider ui-widget-content ui-corner-all"></div>
                    <input type="text" id="ageb_slider_input" class="age-slider-input">
                </div>`;
                } else {
                    // MOBİL: Basit input'lu ve "Uygula" butonlu filtre
                    ageFilterHTML = `
                <div id="age-filter-container-mobile" style="display:flex; align-items:center; gap: 5px; flex-wrap: wrap;">
                     <label for="min-age-input" style="font-weight:bold; margin-bottom:0;">Yaş:</label>
                     <input type="text" inputmode="numeric" pattern="[0-9]*" id="min-age-input" class="age-slider-input" placeholder="Min" value="16" maxlength="2" style="width: 55px;">
                     <span>-</span>
                     <input type="text" inputmode="numeric" pattern="[0-9]*" id="max-age-input" class="age-slider-input" placeholder="Max" value="38" maxlength="2" style="width: 55px;">
                     <button id="apply-age-filter-btn" class="mz-script-button" style="padding: 4px 8px; font-size: 12px; background-color: #007bff; margin-left: 5px;">Uygula</button>
                </div>`;
                }

                const popupHTML = `
            <div id="player-comparison-popup">
                <div class="popup-header"><h3>${i18n.playerComparison}</h3><span class="popup-close">×</span></div>
                <div class="popup-content-scrollable">
                    <div class="popup-filters">
                        <select id="compare-filter-type">${matchTypeOptions}</select>
                        <select id="compare-filter-age">${ageLimits.map(opt => `<option>${opt}</option>`).join('')}</select>
                        ${ageFilterHTML}
                        <button id="export-to-excel-btn" class="mz-script-button" style="background-color: #28a745; margin-left: auto;">${i18n.exportToExcel}</button>
                    </div>
                    <div class="table-responsive-wrapper">
                        <table id="comparison-table"><thead><tr>${tableHeaderHTML}</tr></thead><tbody></tbody></table>
                    </div>
                </div>
            </div>`;
                $('body').append(popupHTML);

                if ($.fn.slider) {
                    // --- MASAÜSTÜ ÖZEL KODU ---
                    const minAgeInput = $("#agea_slider_input");
                    const maxAgeInput = $("#ageb_slider_input");
                    const ageSlider = $("#age-slider-range");
                    let debounceTimer;

                    ageSlider.slider({
                        range: true, min: 16, max: 38, values: [16, 38],
                        slide: (event, ui) => { minAgeInput.val(ui.values[0]); maxAgeInput.val(ui.values[1]); },
                        change: (event, ui) => { if (event.originalEvent) { updateComparisonTable(); } }
                    });
                    minAgeInput.val(ageSlider.slider("values", 0));
                    maxAgeInput.val(ageSlider.slider("values", 1));

                    minAgeInput.add(maxAgeInput).on("input", function() {
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(() => {
                            let min = parseInt(minAgeInput.val(), 10), max = parseInt(maxAgeInput.val(), 10);
                            const currentValues = ageSlider.slider("values");
                            const sliderMin = isNaN(min) ? currentValues[0] : Math.max(16, min);
                            const sliderMax = isNaN(max) ? currentValues[1] : Math.min(38, max);
                            if (sliderMin <= sliderMax) ageSlider.slider("values", [sliderMin, sliderMax]);
                            updateComparisonTable();
                        }, 400);
                    }).on("blur", function() {
                        let min = parseInt(minAgeInput.val(), 10) || 16, max = parseInt(maxAgeInput.val(), 10) || 38;
                        if (min > max) [min, max] = [max, min];
                        min = Math.max(16, min); max = Math.min(38, max);
                        minAgeInput.val(min); maxAgeInput.val(max);
                    });
                } else {
                    // --- MOBİL ÖZEL KODU ---
                    $('#apply-age-filter-btn').on('click', function() {
                        updateComparisonTable();
                    });
                }

                updateComparisonTable();

                $(document).off('click', '#comparison-table td:first-child').on('click', '#comparison-table td:first-child', function() {
                    const pid = $(this).closest('tr').data('pid');
                    if (pid && userTeamId) GM_openInTab(`https://www.managerzone.com/?p=players&pid=${pid}&tid=${userTeamId}`, false);
                });
                $('#player-comparison-popup .popup-close').on('click', () => $('#player-comparison-popup').remove());
                $('#player-comparison-popup .popup-filters select').on('change', updateComparisonTable);
                $('#export-to-excel-btn').on('click', handleExcelExport);
            }

            async function handleExcelExport() {
                const button = $('#export-to-excel-btn');
                const originalText = button.text();
                button.text(i18n.exporting).prop('disabled', true);

                try {
                    const wb = XLSX.utils.book_new();
                    const rawData = JSON.parse(await GM_getValue('playerStatsRaw', '{}'));
                    const filterAge = $('#compare-filter-age').val();

                    const matchTypes = new Map();
                    $('#compare-filter-type option').each(function() {
                        matchTypes.set($(this).val(), $(this).text());
                    });

                    for (const [filterTypeValue, filterTypeText] of matchTypes.entries()) {
                        const sheetData = await generateSheetData(rawData, filterTypeValue, filterAge);
                        if (sheetData.length > 0) {
                            const ws = XLSX.utils.json_to_sheet(sheetData);
                            const sheetName = filterTypeText.replace(/[\/\\?*\[\]]/g, '').substring(0, 31);
                            XLSX.utils.book_append_sheet(wb, ws, sheetName);
                        }
                    }

                    XLSX.writeFile(wb, 'ManagerZone_Player_Comparison.xlsx');

                } catch (error) {
                    console.error("Excel export failed:", error);
                    alert(i18n.exportError);
                } finally {
                    button.text(originalText).prop('disabled', false);
                }
            }

            // Yedekten geri yükleme işlemini başlatan fonksiyon
            async function handleJsonBackup(button) {
                const originalText = button.text();
                button.text(i18n.backupInProgress).prop('disabled', true);

                try {
                    // <<< DEĞİŞİKLİK BAŞLADI >>>
                    // Sadece istatistikleri değil, işlenmiş maç ID'lerini de alıyoruz.
                    const rawData = await GM_getValue('playerStatsRaw', '{}');
                    const processedIds = await GM_getValue('processedMatchIds', '[]');

                    // İki veriyi de tek bir nesnede birleştiriyoruz.
                    // Bu, yedeği daha eksiksiz ve güvenilir hale getirir.
                    const backupObject = {
                        stats: JSON.parse(rawData),
                        processedIds: JSON.parse(processedIds)
                    };

                    // Bu birleştirilmiş nesneyi JSON formatına çeviriyoruz.
                    const dataStr = JSON.stringify(backupObject, null, 2);
                    // <<< DEĞİŞİKLİK SONA ERDİ >>>

                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `mz_player_stats_backup_${new Date().toISOString().slice(0,10)}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                } catch (error) {
                    console.error("JSON backup failed:", error);
                    alert("Yedekleme sırasında bir hata oluştu.");
                } finally {
                    button.text(originalText).prop('disabled', false);
                }
            }

            // Yedekten geri yükleme işlemini başlatan fonksiyon
            function handleJsonRestore() {
                $('#restore-file-input').click(); // Gizli dosya girişini tetikle
            }

            // Kullanıcı bir dosya seçtiğinde çalışan fonksiyon
            async function processRestoreFile(event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        const content = e.target.result;
                        const jsonData = JSON.parse(content);

                        // <<< DEĞİŞİKLİK BAŞLADI >>>
                        // YENİ FORMAT KONTROLÜ: Yedek dosyası hem 'stats' hem de 'processedIds' içeriyor mu?
                        if (typeof jsonData === 'object' && jsonData.stats && Array.isArray(jsonData.processedIds)) {
                            // Yeni format algılandı. Her iki veriyi de geri yüklüyoruz.
                            await GM_setValue('playerStatsRaw', JSON.stringify(jsonData.stats));
                            await GM_setValue('processedMatchIds', JSON.stringify(jsonData.processedIds)); // EN ÖNEMLİ DÜZELTME

                            alert(i18n.restoreSuccess);
                            updateMatchPageButtonStates();

                        } else if (typeof jsonData === 'object' && Object.keys(jsonData).every(key => !isNaN(parseInt(key)))) {
                            // GERİ UYUMLULUK: Sadece istatistik içeren eski formatta bir yedek algılandı.
                            console.warn("Eski formatta yedek dosyası algılandı. İşlenmiş Maç ID'leri istatistiklerden yeniden oluşturuluyor.");
                            await GM_setValue('playerStatsRaw', JSON.stringify(jsonData));

                            // İstatistik verilerinden yola çıkarak 'processedMatchIds' listesini yeniden oluşturuyoruz.
                            const allIds = new Set();
                            Object.values(jsonData).forEach(player => {
                                if (player.matches && Array.isArray(player.matches)) {
                                    player.matches.forEach(match => {
                                        if (match.matchId) allIds.add(match.matchId);
                                    });
                                }
                            });
                            await GM_setValue('processedMatchIds', JSON.stringify(Array.from(allIds)));

                            alert(i18n.restoreSuccess + " (Eski yedek formatı algılandı, eksik veriler yeniden oluşturuldu.)");
                            updateMatchPageButtonStates();

                        } else {
                            // Dosya formatı tanınmıyorsa hata ver.
                            throw new Error("Invalid data structure");
                        }
                        // <<< DEĞİŞİKLİK SONA ERDİ >>>

                    } catch (error) {
                        console.error("Failed to process restore file:", error);
                        alert(i18n.restoreError);
                    }
                };
                reader.readAsText(file);
                // Aynı dosyayı tekrar seçebilmek için input'u sıfırla
                event.target.value = '';
            }

            async function generateSheetData(rawData, filterTypeValue, filterAge) {
                const dataForSheet = [];
                for (const player of squadPlayersWithStats) {
                    const data = calculateAverages(rawData[player.pid], filterTypeValue, filterAge);
                    if (data && data.matches > 0) {
                        const playerRow = {};
                        playerRow[i18n.player] = player.name;
                        playerRow[i18n.age] = player.age > 0 ? player.age : '?';
                        playerRow[i18n.matches] = data.matches;

                        displayColumns.forEach(col => {
                            const displayName = i18n.statMappings[col] || col;
                            if (sumAvgColumns.includes(col)) {
                                const sum = data[`${col}_sum`] || 0;
                                const avg = data[`${col}_avg`] || '0.00';
                                playerRow[`${displayName} ${i18n.totalSuffix}`] = sum;
                                playerRow[`${displayName} ${i18n.avgSuffix}`] = parseFloat(avg);
                            } else {
                                const statValue = data[col] || '0.00';
                                playerRow[displayName] = parseFloat(statValue);
                            }
                        });
                        dataForSheet.push(playerRow);
                    }
                }
                return dataForSheet;
            }

            // --- KESİN ÇALIŞAN SIRALAMA FONKSİYONU (VERSİYON 3) --- //
            // =================================================================== //
            /**
         * Tabloyu, her satırdaki "yeşil" (iyi) ve "kırmızı" (kötü) hücrelere göre
         * bir puan hesaplayarak başlangıçta sıralar. En yüksek puana sahip (en yeşil)
         * oyuncu en üste gelir.
         * @param {jQuery} table - Sıralanacak tablo nesnesi.
         */
            function initialSortByGreenness(table) {
                const rows = table.find('tbody tr').get();

                rows.sort((a, b) => {
                    let scoreA = 0;
                    let scoreB = 0;

                    // A satırı için puanı, önceden kaydettiğimiz 'data-hue' üzerinden hesapla
                    $(a).find('td[data-hue]').each(function() {
                        const hue = parseFloat($(this).attr('data-hue')) || 0;
                        // Puanlama mantığı: Yeşil (120) pozitif, Kırmızı (0) negatif puan verir.
                        scoreA += (hue - 60);
                    });

                    // B satırı için puanı, önceden kaydettiğimiz 'data-hue' üzerinden hesapla
                    $(b).find('td[data-hue]').each(function() {
                        const hue = parseFloat($(this).attr('data-hue')) || 0;
                        scoreB += (hue - 60);
                    });

                    // Puanı yüksek olan (daha çok yeşil olan) üste gelecek şekilde sırala
                    return scoreB - scoreA;
                });

                // Satırları yeni sıralamalarına göre tabloya yeniden ekle
                $.each(rows, (idx, row) => table.children('tbody').append(row));
            }

            async function updateComparisonTable() {
                // YENİ EKLENDİ: Emeklilik verilerini tarayıcı hafızasından çekiyoruz.
                const retirementDataJSON = await GM_getValue(RETIREMENT_DATA_KEY, '{}');
                const retirementData = JSON.parse(retirementDataJSON);

                const minAge = parseInt($('#agea_slider_input').val() || $('#min-age-input').val(), 10) || 16;
                const maxAge = parseInt($('#ageb_slider_input').val() || $('#max-age-input').val(), 10) || 38;

                const filterTypeValue = $('#compare-filter-type').val(),
                      filterAge = $('#compare-filter-age').val(),
                      rawData = JSON.parse(await GM_getValue('playerStatsRaw', '{}')),
                      tableBody = $('#comparison-table tbody').empty();

                if (!userTeamId) {
                    console.error("Takım ID'si bulunamadı! Linkler oluşturulamıyor.");
                    tableBody.append('<tr><td colspan="100%">Hata: Takım ID alınamadı. Lütfen sayfayı yenileyip tekrar deneyin.</td></tr>');
                    return;
                }

                for (const player of squadPlayersWithStats) {
                    if (player.age < minAge || player.age > maxAge) {
                        continue;
                    }
                    const data = calculateAverages(rawData[player.pid], filterTypeValue, filterAge);
                    if (data && data.matches > 0) {
                        const currentAge = player.age,
                              displayAge = currentAge > 0 ? currentAge : '?';

                        // YENİ EKLENDİ: Oyuncunun emeklilik durumuna göre ikonları oluşturacak bölüm.
                        let retirementIconsHTML = '';
                        if (retirementData[player.pid]) {
                            // Eğer oyuncu emeklilik listesindeyse, ikon HTML'ini hazırlıyoruz.
                            // Bu kod, diğer modüldekiyle tamamen aynıdır, böylece görünüm tutarlı olur.
                            retirementIconsHTML = `<span class="retirement-indicator-container" style="display: inline-flex; align-items: center; gap: 4px; margin-right: 6px; vertical-align: middle;">`;

                            // Uyarı üçgeni
                            retirementIconsHTML += `<i class="fa fa-exclamation-triangle" title="${i18n.retireWarning}" style="font-size: 14px; color: rgb(230, 0, 0); cursor: help; line-height: 1;"></i>`;

                            // Eğer uzatılabiliyorsa, kalp ikonu
                            if (retirementData[player.pid].extendable) {
                                retirementIconsHTML += `<span class="player_icon_placeholder view_extend_career" title="${i18n.canExtendRetirement}" style="cursor: help; margin: 0px; padding: 0px; display: inline-flex; align-items: center;">
                                                        <span class="player_icon_wrapper" style="display: inline-flex; align-items: center;">
                                                            <i class="fa-duotone fa-heart-pulse extend-career-icon" style="font-size: 14px;"></i>
                                                        </span>
                                                    </span>`;
                            }
                            retirementIconsHTML += `</span>`;
                        }

                        // Oyuncu ismini içeren hücreyi oluştururken, hazırladığımız ikon HTML'ini başına ekliyoruz.
                        let row = `<tr data-pid="${player.pid}">
               <td style="color: #00529B; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                   <span style="text-decoration: underline;">${player.name}</span>
                   ${retirementIconsHTML}
               </td>
               <td data-sort="${currentAge}">${displayAge}</td>
               <td data-sort="${data.matches}">${data.matches}</td>`;

                        displayColumns.forEach(col => {
                            if (sumAvgColumns.includes(col)) {
                                const sum = data[`${col}_sum`] || 0,
                                      avg = data[`${col}_avg`] || '0.00';
                                row += `<td data-sort-sum="${sum}" data-sort-avg="${avg}">${sum} / ${avg}</td>`;
                            } else {
                                const statValue = data[col] || '0.00',
                                      suffix = col.includes('%') ? ' %' : '';
                                row += `<td data-sort="${parseFloat(statValue)}">${statValue}${suffix}</td>`;
                            }
                        });
                        row += '</tr>';
                        tableBody.append(row);
                    }
                }
                makeTableSortable($('#comparison-table'));
                applyCellColoring($('#comparison-table'));
                initialSortByGreenness($('#comparison-table'));
            }

            function makeTableSortable(table) {
                table.find('th[data-sort-type]').off('click').on('click', function() {
                    const th = $(this),
                          index = th.index(),
                          headerText = th.text().trim(),
                          isSpecialSort = sumAvgColumns.includes(headerText);
                    table.find('th').not(th).removeClass('sort-asc sort-desc sort-sum-asc sort-sum-desc sort-avg-asc sort-avg-desc').removeAttr('data-sort-state');
                    let sortKey, direction, sortAttribute;
                    if (isSpecialSort) {
                        const states = ['sum-desc', 'sum-asc', 'avg-desc', 'avg-asc'],
                              currentState = th.attr('data-sort-state') || '',
                              nextIndex = (states.indexOf(currentState) + 1) % states.length,
                              newState = states[nextIndex];
                        th.attr('data-sort-state', newState).removeClass('sort-asc sort-desc sort-sum-asc sort-sum-desc sort-avg-asc sort-avg-desc').addClass(`sort-${newState}`);
                        [sortKey, direction] = newState.split('-');
                        sortAttribute = `data-sort-${sortKey}`;
                    } else {
                        direction = th.hasClass('sort-asc') ? 'desc' : 'asc';
                        th.removeClass('sort-asc sort-desc').addClass(`sort-${direction}`);
                        sortAttribute = 'data-sort';
                        th.removeAttr('data-sort-state');
                    }
                    const rows = table.find('tbody tr').get();
                    rows.sort((a, b) => {
                        let valA, valB;
                        const tdA = $(a).find('td').eq(index),
                              tdB = $(b).find('td').eq(index);
                        if (isSpecialSort) {
                            valA = parseFloat(tdA.attr(sortAttribute)) || 0;
                            valB = parseFloat(tdB.attr(sortAttribute)) || 0;
                        } else {
                            valA = tdA.attr(sortAttribute) || 0;
                            valB = tdB.attr(sortAttribute) || 0;
                            if (isNaN(parseFloat(valA)) || isNaN(parseFloat(valB))) return direction === 'asc' ? valA.localeCompare(valB, lang === 'tr' ? 'tr-TR' : undefined) : valB.localeCompare(valA, lang === 'tr' ? 'tr-TR' : undefined);
                            valA = parseFloat(valA);
                            valB = parseFloat(valB);
                        }
                        return direction === 'asc' ? valA - valB : valB - valA;
                    });
                    $.each(rows, (idx, row) => table.children('tbody').append(row));
                });
            }

            function applyCellColoring(table) {
                const headers = table.find('thead th').map(function() {
                    return $(this).text();
                }).get();
                const goodStats = ['MP', 'G', 'A', 'S', 'G%', 'SOT', 'SOT%', 'P%', 'PL', 'In', 'T', 'T%', 'Pos%', 'Dist', 'DistP', 'SpR', 'SV', 'SpP'];
                const badStats = ['YC', 'RC'];
                headers.forEach((header, index) => {
                    if (goodStats.includes(header) || badStats.includes(header)) {
                        let values = [];
                        table.find(`tbody tr td:nth-child(${index + 1})`).each(function() {
                            let sortVal = sumAvgColumns.includes(header) ? $(this).attr('data-sort-avg') : $(this).attr('data-sort');
                            values.push(parseFloat(sortVal) || 0);
                        });
                        const min = Math.min(...values),
                              max = Math.max(...values);
                        if (min === max) return;
                        table.find(`tbody tr td:nth-child(${index + 1})`).each(function() {
                            let sortVal = sumAvgColumns.includes(header) ? $(this).attr('data-sort-avg') : $(this).attr('data-sort');
                            const value = parseFloat(sortVal) || 0,
                                  normalized = max === min ? 0.5 : (value - min) / (max - min);
                            let hue = badStats.includes(header) ? 120 - (normalized * 120) : normalized * 120;
                            // DEĞİŞEN SATIR BURASI: .attr('data-hue', hue) eklendi
                            $(this).css('background-color', `hsla(${hue}, 70%, 75%, 0.6)`).addClass('colored-cell').attr('data-hue', hue);
                        });
                    }
                });
            }

            function setupTooltipListeners() {
                const tooltip = $('#custom-tooltip');
                let currentTarget = null;
                $(document).on('click', '[data-tooltip]', function(e) {
                    e.stopPropagation();
                    const target = $(this);
                    const tooltipText = target.attr('data-tooltip');
                    if (currentTarget && currentTarget[0] === target[0]) {
                        tooltip.hide();
                        currentTarget = null;
                        return;
                    }
                    currentTarget = target;
                    if (tooltipText) {
                        tooltip.html(tooltipText).show();
                        const targetOffset = target.offset(),
                              targetHeight = target.outerHeight(),
                              targetWidth = target.outerWidth(),
                              tooltipHeight = tooltip.outerHeight(),
                              tooltipWidth = tooltip.outerWidth();
                        let top = targetOffset.top - tooltipHeight - 10;
                        let left = targetOffset.left + (targetWidth / 2) - (tooltipWidth / 2);
                        if (top < 0) top = targetOffset.top + targetHeight + 10;
                        if (left < 0) left = 5;
                        if (left + tooltipWidth > $(window).width()) left = $(window).width() - tooltipWidth - 5;
                        tooltip.css({
                            top: top,
                            left: left
                        });
                    }
                });
                $(document).on('click', function(e) {
                    if (currentTarget && !$(e.target).is(currentTarget)) {
                        tooltip.hide();
                        currentTarget = null;
                    }
                });
                $(document).on('mouseenter', '[data-tooltip]', function() {
                    if ('ontouchstart' in window) return; // Don't show on hover for touch devices
                    const target = $(this);
                    const tooltipText = target.attr('data-tooltip');
                    if (tooltipText) {
                        tooltip.html(tooltipText).show();
                        const targetOffset = target.offset(),
                              targetHeight = target.outerHeight(),
                              targetWidth = target.outerWidth(),
                              tooltipHeight = tooltip.outerHeight(),
                              tooltipWidth = tooltip.outerWidth();
                        let top = targetOffset.top - tooltipHeight - 10;
                        let left = targetOffset.left + (targetWidth / 2) - (tooltipWidth / 2);
                        if (top < 0) top = targetOffset.top + targetHeight + 10;
                        if (left < 0) left = 5;
                        if (left + tooltipWidth > $(window).width()) left = $(window).width() - tooltipWidth - 5;
                        tooltip.css({
                            top: top,
                            left: left
                        });
                    }
                }).on('mouseleave', '[data-tooltip]', function() {
                    if ('ontouchstart' in window) return; // Don't hide on leave for touch devices if it was opened by click
                    if (!currentTarget) { // Only hide if it wasn't "click-locked"
                        tooltip.hide();
                    }
                });
            }
        }


        /****************************************************************************************
     *                                                                                      *
     *  BÖLÜM 3: PLAY-OFF/PLAY-OUT TAHMİNCİSİ (Evrensel)                                     *
     *                                                                                      *
     ****************************************************************************************/
        function initializePlayoffPredictorScript() {
            let isJobRunning = false;

            function parseLeagueName(name) {
                const lowerName = name.toLowerCase().trim();
                const match = lowerName.match(/div(\d+)\.(\d+)/);

                if (match) {
                    return {
                        level: parseInt(match[1], 10),
                        index: parseInt(match[2], 10),
                        isTopLeague: false
                    };
                } else if (lowerName && !lowerName.startsWith('div')) {
                    return {
                        level: 0,
                        index: 1,
                        isTopLeague: true
                    };
                }
                return null;
            }

            function generateRules(level, index, currentLeagueName, isTopLeague) {
                const generatedRules = [];

                if (!isTopLeague) {
                    const parentLevel = level - 1;
                    const parentIndex = Math.floor((index - 1) / 3) + 1;

                    const leagueSelect = getLeagueSelect();
                    let parentLeagueName = `div${parentLevel}.${parentIndex}`;
                    if (parentLevel === 0) {
                        for (const option of leagueSelect.options) {
                            const leagueInfo = parseLeagueName(option.text);
                            if (leagueInfo && leagueInfo.isTopLeague) {
                                parentLeagueName = option.text;
                                break;
                            }
                        }
                    }

                    const firstSiblingIndex = (parentIndex - 1) * 3 + 1;
                    const childLeague1 = `div${level}.${firstSiblingIndex}`;
                    const childLeague2 = `div${level}.${firstSiblingIndex + 1}`;
                    const childLeague3 = `div${level}.${firstSiblingIndex + 2}`;

                    const groupBaseNum = parentIndex * 2;

                    generatedRules.push({
                        name: `Play-Off Grup ${groupBaseNum - 1} (Yükselme)`,
                        type: 'playoff',
                        teams: [
                            { league: parentLeagueName, rank: 8 },
                            { league: childLeague1, rank: 2 },
                            { league: childLeague2, rank: 3 },
                            { league: childLeague3, rank: 3 }
                        ]
                    });
                    generatedRules.push({
                        name: `Play-Off Grup ${groupBaseNum} (Yükselme)`,
                        type: 'playoff',
                        teams: [
                            { league: parentLeagueName, rank: 9 },
                            { league: childLeague1, rank: 3 },
                            { league: childLeague2, rank: 2 },
                            { league: childLeague3, rank: 2 }
                        ]
                    });
                }

                if (level < 6) {
                    const nextLevel = level + 1;
                    const childBaseIndex = (index - 1) * 3;
                    const childLeague1 = `div${nextLevel}.${childBaseIndex + 1}`;
                    const childLeague2 = `div${nextLevel}.${childBaseIndex + 2}`;
                    const childLeague3 = `div${nextLevel}.${childBaseIndex + 3}`;

                    const groupNameSuffix = isTopLeague ? "(Yükselme/Düşme)" : "(Düşme)";

                    const groupBaseIndex = isTopLeague ? 0 : (((3 ** (level - 1) - 1) / 2) + index - 1);
                    const groupNum1 = (groupBaseIndex * 2) + 1;
                    const groupNum2 = (groupBaseIndex * 2) + 2;

                    generatedRules.push({
                        name: `Play-Out Grup ${isTopLeague ? 'A' : groupNum1} ${groupNameSuffix}`,
                        type: 'playout',
                        teams: [
                            { league: currentLeagueName, rank: 8 },
                            { league: childLeague1, rank: 2 },
                            { league: childLeague2, rank: 3 },
                            { league: childLeague3, rank: 3 }
                        ]
                    });
                    generatedRules.push({
                        name: `Play-Out Grup ${isTopLeague ? 'B' : groupNum2} ${groupNameSuffix}`,
                        type: 'playout',
                        teams: [
                            { league: currentLeagueName, rank: 9 },
                            { league: childLeague1, rank: 3 },
                            { league: childLeague2, rank: 2 },
                            { league: childLeague3, rank: 2 }
                        ]
                    });
                }

                const uniqueRules = [];
                const seenNames = new Set();
                for (const rule of generatedRules) {
                    if (!seenNames.has(rule.name)) {
                        uniqueRules.push(rule);
                        seenNames.add(rule.name);
                    }
                }

                if (isTopLeague) {
                    return uniqueRules.filter(rule => rule.type === 'playout');
                }

                return uniqueRules;
            }

            function findRelevantRules(currentLeagueName) {
                const leagueInfo = parseLeagueName(currentLeagueName);
                if (!leagueInfo) {
                    console.warn("Mevcut lig ayrıştırılamadı:", currentLeagueName);
                    return [];
                }

                if (leagueInfo.level >= 7) {
                    return [];
                }

                return generateRules(leagueInfo.level, leagueInfo.index, currentLeagueName, leagueInfo.isTopLeague);
            }

            async function startJob() {
                if (isJobRunning) {
                    alert("Zaten devam eden bir işlem var. Lütfen tamamlanmasını bekleyin.");
                    return;
                }
                isJobRunning = true;
                showProgressIndicator("İşlem Başlatılıyor...");

                const leagueSelect = getLeagueSelect();
                if (!leagueSelect) {
                    alert("Lig seçme menüsü bulunamadı!");
                    isJobRunning = false;
                    removeProgressIndicator();
                    return;
                }

                const currentLeagueName = leagueSelect.options[leagueSelect.selectedIndex].text;
                const relevantRules = findRelevantRules(currentLeagueName);

                if (!relevantRules || relevantRules.length === 0) {
                    let predictorContainer = document.getElementById('playoff-predictor-container');
                    if (!predictorContainer) {
                        const mainContentArea = document.querySelector('#league_navigation > div.ui-tabs-panel');
                        predictorContainer = setupContainer(mainContentArea);
                    }
                    predictorContainer.innerHTML = `<div style="padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; text-align: center; margin-top: 20px;">Bu lig (${currentLeagueName}) için gösterilecek Play-Off/Out kuralı bulunmuyor.</div>`;
                    isJobRunning = false;
                    removeProgressIndicator();
                    return;
                }

                const allTeamDefs = getUniqueTeamDefs(relevantRules);
                const leagueIdMap = createLeagueIdMap(leagueSelect);
                const collectedData = [];
                let hiddenIframe = null;

                try {
                    hiddenIframe = document.createElement('iframe');
                    hiddenIframe.style.cssText = 'display: none !important;';
                    document.body.appendChild(hiddenIframe);

                    const teamDefsToFetchInIframe = allTeamDefs.filter(def => def.league.toLowerCase() !== currentLeagueName.toLowerCase());
                    const teamDefsOnCurrentPage = allTeamDefs.filter(def => def.league.toLowerCase() === currentLeagueName.toLowerCase());

                    teamDefsOnCurrentPage.forEach(def => {
                        const teamData = parseTeamFromDocument(document, def.rank, window.location.href);
                        if (teamData) collectedData.push({ ...teamData,
                                                          league: def.league
                                                         });
                    });

                    let leaguesProcessed = teamDefsOnCurrentPage.length;
                    for (const teamDef of teamDefsToFetchInIframe) {
                        if (!isJobRunning) {
                            throw new Error("İşlem kullanıcı tarafından iptal edildi.");
                        }
                        updateProgressIndicator(`Lig Verileri Toplanıyor... (${leaguesProcessed}/${allTeamDefs.length}) - ${teamDef.league}`);
                        const teamData = await fetchLeagueDataViaIframe(teamDef, leagueIdMap, hiddenIframe);
                        collectedData.push(teamData);
                        leaguesProcessed++;
                    }

                    updateProgressIndicator("Lig verileri toplandı. Takım değerleri hesaplanıyor...");
                    let teamsWithValueProcessed = 0;
                    const validTeams = collectedData.filter(d => d && d.url && d.url !== '#');
                    const totalTeamsWithValue = validTeams.length;

                    const valuePromises = validTeams.map(team => {
                        if (!isJobRunning) return Promise.reject(new Error("İşlem iptal edildi."));
                        return fetchTop11Value(team).then(result => {
                            teamsWithValueProcessed++;
                            updateProgressIndicator(`En İyi 11 Değerleri Hesaplanıyor... (${teamsWithValueProcessed}/${totalTeamsWithValue})`);
                            return result;
                        });
                    });
                    const finalDataWithValues = await Promise.all(valuePromises);

                    const finalData = collectedData.map(team => {
                        const teamWithValue = finalDataWithValues.find(t => t && team && t.url === team.url);
                        return teamWithValue || team;
                    });

                    if (!isJobRunning) return;
                    updateProgressIndicator("Tablo Oluşturuluyor...");
                    const mainContentArea = document.querySelector('#league_navigation > div.ui-tabs-panel');
                    let predictorContainer = setupContainer(mainContentArea);
                    const finalHtml = createTablesHTML(relevantRules, finalData);
                    predictorContainer.innerHTML = finalHtml;

                } catch (error) {
                    if (error.message.includes("iptal edildi")) {
                        console.log("İşlem durduruldu.");
                    } else {
                        console.error("Betiğin çalışması sırasında bir hata oluştu:", error);
                        alert("Betiğin çalışması sırasında bir hata oluştu. Lütfen konsolu kontrol edin.");
                    }
                } finally {
                    if (hiddenIframe) hiddenIframe.remove();
                    removeProgressIndicator();
                    isJobRunning = false;
                }
            }

            function fetchLeagueDataViaIframe(teamDef, leagueIdMap, iframe) {
                return new Promise((resolve) => {
                    const leagueNameLower = teamDef.league.toLowerCase();
                    const sid = leagueIdMap[leagueNameLower];
                    if (!sid) {
                        console.warn(`Lig ID bulunamadı: ${teamDef.league}`);
                        resolve({
                            rank: teamDef.rank,
                            league: teamDef.league,
                            name: `(Lig bulunamadı)`,
                            url: '#'
                        });
                        return;
                    }
                    const url = `https://www.managerzone.com/?p=league&type=senior&sid=${sid}`;

                    let poller = null;
                    let timeout = null;

                    const cleanup = () => {
                        if (poller) clearInterval(poller);
                        if (timeout) clearTimeout(timeout);
                        iframe.onload = null;
                        iframe.onerror = null;
                    };

                    const fail = (errorType) => {
                        console.warn(`${errorType} for league: ${teamDef.league}`);
                        cleanup();
                        resolve({
                            rank: teamDef.rank,
                            league: teamDef.league,
                            name: `(${errorType})`,
                            url: '#'
                        });
                    };

                    timeout = setTimeout(() => fail('Timeout Hatası'), 15000);

                    iframe.onload = () => {
                        poller = setInterval(() => {
                            try {
                                const doc = iframe.contentDocument;
                                if (doc && doc.querySelector('.nice_table tbody tr')) {
                                    cleanup();
                                    const teamData = parseTeamFromDocument(doc, teamDef.rank, url);
                                    resolve({ ...teamData,
                                             league: teamDef.league
                                            });
                                }
                            } catch (e) {
                                // ignore error
                            }
                        }, 300);
                    };

                    iframe.onerror = () => fail('Yükleme Hatası');
                    iframe.src = url;
                });
            }

            function fetchTop11Value(team) {
                if (!team || !team.url) return Promise.resolve({ ...team,
                                                                top11Value: 'URL Yok'
                                                               });
                const teamId = new URL(team.url).searchParams.get('tid');
                if (!teamId) return Promise.resolve({ ...team,
                                                     top11Value: 'ID Yok'
                                                    });
                const playersUrl = `https://www.managerzone.com/?p=players&sub=alt&tid=${teamId}`;
                return fetch(playersUrl)
                    .then(response => {
                    if (!response.ok) throw new Error(`HTTP hatası! Durum: ${response.status}`);
                    return response.text();
                })
                    .then(html => ({ ...team,
                                    top11Value: calculateTop11ValueFromHTML(html)
                                   }))
                    .catch(error => {
                    console.error(`Takım ID ${teamId} için "En İyi 11" değeri alınamadı:`, error);
                    return { ...team,
                            top11Value: 'Hata'
                           };
                });
            }

            function waitForElement(selector, callback) {
                const i = setInterval(() => {
                    const e = document.querySelector(selector);
                    if (e) {
                        clearInterval(i);
                        callback();
                    }
                }, 100);
            }

            function createLeagueIdMap(leagueSelect) {
                const map = {};
                for (const o of leagueSelect.options) {
                    map[o.text.toLowerCase().trim()] = o.value;
                }
                return map;
            }

            function setupContainer(parent) {
                let c = document.getElementById('playoff-predictor-container');
                if (c) {
                    c.innerHTML = '';
                } else {
                    c = document.createElement('div');
                    c.id = 'playoff-predictor-container';
                    const t = parent.querySelector('.nice_table');
                    if (t) t.parentNode.insertAdjacentElement('afterend', c);
                    else parent.appendChild(c);
                }
                return c;
            }

            function getLeagueSelect() {
                const s = document.querySelectorAll('select[onchange*="p=league&type=senior&sid="]');
                return s.length > 1 ? s[1] : s[0];
            }

            function getUniqueTeamDefs(rules) {
                const u = [];
                const seen = new Set();
                rules.forEach(g => {
                    g.teams.forEach(t => {
                        const key = `${t.league}-${t.rank}`;
                        if (!seen.has(key)) {
                            u.push(t);
                            seen.add(key);
                        }
                    });
                });
                return u;
            }

            function parseTeamFromDocument(doc, rank, sourceUrl = 'Bilinmiyor') {
                if (!doc) {
                    console.warn(`Belge (document) yok. Sıra: ${rank}, Kaynak: ${sourceUrl}`);
                    return {
                        rank,
                        name: `(Belge Okunamadı)`,
                        url: '#'
                    };
                }
                const tr = [...doc.querySelectorAll('.nice_table tbody tr')].find(r => r.cells[0]?.textContent.trim() == rank);
                if (tr && tr.cells[1]) {
                    const a = tr.cells[1].querySelector('a[href*="p=team&tid="]');
                    if (a) {
                        const stats = {
                            g: tr.cells[3]?.textContent.trim(),
                            b: tr.cells[4]?.textContent.trim(),
                            m: tr.cells[5]?.textContent.trim(),
                            a: tr.cells[6]?.textContent.trim(),
                            y: tr.cells[7]?.textContent.trim(),
                            av: tr.cells[8]?.textContent.trim(),
                            p: tr.cells[9]?.textContent.trim()
                        };
                        return {
                            rank,
                            name: a.textContent.trim(),
                            url: a.href,
                            ...stats
                        };
                    }
                }
                console.warn(`Takım bulunamadı. Sıra: ${rank}, Kaynak: ${sourceUrl}`);
                return {
                    rank,
                    name: `(Sıra ${rank} bulunamadı)`,
                    url: '#'
                };
            }

            // DEĞİŞİKLİK BAŞLANGICI: Evrensel Değer Sütunu Tespiti
            function calculateTop11ValueFromHTML(htmlText) {
                try {
                    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                    const playerTable = doc.getElementById('playerAltViewTable');
                    if (!playerTable) return 'Tablo Yok';

                    const firstDataRow = playerTable.querySelector('tbody tr');
                    if (!firstDataRow) return 'Oyuncu Yok';

                    let valueColumnIndex = -1;
                    const headers = playerTable.querySelectorAll('thead th');
                    const firstDataRowCells = firstDataRow.cells;

                    // 1. Strateji: Başlıklarda "Değer" veya benzeri bir kelime ara (Regex ile evrensel)
                    if (headers.length > 0) {
                        for (let i = 0; i < headers.length; i++) {
                            if (/value|değer|wert|valore|valor/i.test(headers[i].textContent)) {
                                valueColumnIndex = i;
                                break;
                            }
                        }
                    }

                    // 2. Strateji: Başlık bulunamazsa, ilk veri satırında para birimi ara
                    if (valueColumnIndex === -1 && firstDataRowCells) {
                        for (let i = 0; i < firstDataRowCells.length; i++) {
                            if (/\s(EUR|USD|TRY)/.test(firstDataRowCells[i].textContent)) {
                                valueColumnIndex = i;
                                break;
                            }
                        }
                    }

                    if (valueColumnIndex === -1) {
                        console.warn("Değer sütunu bulunamadı.");
                        return 'Sütun Yok';
                    }

                    const values = [];
                    playerTable.querySelectorAll('tbody tr').forEach(row => {
                        const cell = row.cells[valueColumnIndex];
                        if (cell) {
                            const numericValue = parseInt(cell.textContent.trim().replace(/[^0-9]/g, ''), 10);
                            if (!isNaN(numericValue)) {
                                values.push(numericValue);
                            }
                        }
                    });

                    if (values.length === 0) return 'Değer Yok';

                    values.sort((a, b) => b - a);
                    const sum = values.slice(0, 11).reduce((acc, val) => acc + val, 0);
                    return `${sum.toLocaleString('de-DE')} EUR`;
                } catch (e) {
                    console.error("HTML parse/hesaplama hatası:", e);
                    return "Hesaplama Hatası";
                }
            }
            // DEĞİŞİKLİK SONU

            function createTablesHTML(rules, data) {
                const playoffRules = rules.filter(r => r.type === 'playoff');
                const playoutRules = rules.filter(r => r.type === 'playout');

                let h = `<h2 class="subheader clearfix" style="margin-top: 20px;">Potansiyel Play-Off / Play-Out Grupları</h2><div style="font-size: 0.9em; padding: 5px; background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px; margin-bottom: 10px; color: #856404;"><strong>Not:</strong> Bu tablolar, anlık puan durumlarına göre oluşturulmuş bir <strong>tahmindir</strong> ve resmi değildir.</div>`;

                const generateHtmlForRules = (ruleSet) => {
                    let partialHtml = '';
                    ruleSet.forEach(g => {
                        partialHtml += `<h3 class="subheader clearfix">${g.name}</h3><div class="mainContent" style="padding: 5px; margin-bottom: 20px;"><table class="nice_table" style="width:100%;">
<thead><tr><th style="width:13%;">Lig</th><th style="width:5%; text-align: center;">Sıra</th><th style="width:18%;">Potansiyel Takım</th><th title="Oynanan Maç" style="width:4%; text-align: center;">O</th><th title="Galibiyet" style="width:4%; text-align: center;">G</th><th title="Beraberlik" style="width:4%; text-align: center;">B</th><th title="Mağlubiyet" style="width:4%; text-align: center;">M</th><th title="Attığı Gol" style="width:4%; text-align: center;">A</th><th title="Yediği Gol" style="width:4%; text-align: center;">Y</th><th title="Averaj" style="width:4%; text-align: center;">Av</th><th title="Puan" style="width:5%; text-align: center;">P</th><th style="width:15%; text-align: center;">En Değerli 11</th></tr></thead><tbody>`;
                        g.teams.forEach(t => {
                            const d = data.find(ad => ad && ad.league && t.league && ad.league.toLowerCase() === t.league.toLowerCase() && ad.rank === t.rank);
                            let teamCell = `...`;
                            let playedMatchesCell = '<td style="text-align:center;">-</td>';
                            let statsCells = '<td colspan="7" style="text-align:center;">- Veri Yok -</td>'; // Colspan düzeltildi
                            let top11Cell = '<td>...</td>';
                            let rankCell = `<td style="text-align: center;">${t.rank}</td>`;
                            if (d) {
                                teamCell = d.url && d.url !== '#' ? `<a href="${d.url}" target="_blank" title="${d.name}">${d.name}</a>` : d.name;
                                if (d.p !== undefined) {
                                    const g = parseInt(d.g, 10) || 0;
                                    const b = parseInt(d.b, 10) || 0;
                                    const m = parseInt(d.m, 10) || 0;
                                    const o = g + b + m;
                                    // DEĞİŞİKLİK: 'O' sütunundaki <b> etiketi kaldırıldı.
                                    playedMatchesCell = `<td style="text-align: center;">${o}</td>`;

                                    // DEĞİŞİKLİK: 'P' sütunundaki <b> etiketi kaldırıldı.
                                    statsCells = `<td style="text-align: center;">${d.g || '-'}</td><td style="text-align: center;">${d.b || '-'}</td><td style="text-align: center;">${d.m || '-'}</td><td style="text-align: center;">${d.a || '-'}</td><td style="text-align: center;">${d.y || '-'}</td><td style="text-align: center;">${d.av || '-'}</td><td style="text-align: center;">${d.p}</td>`;
                                }
                                top11Cell = `<td style="text-align: center;">${d.top11Value || 'Hesaplanıyor...'}</td>`;
                            } else {
                                teamCell = `<span style="color:red;">(Veri alınamadı)</span>`;
                            }
                            partialHtml += `<tr><td>${t.league}</td>${rankCell}<td>${teamCell}</td>${playedMatchesCell}${statsCells}${top11Cell}</tr>`;
                        });
                        partialHtml += `</tbody></table></div>`;
                    });
                    return partialHtml;
                };

                if (playoffRules.length > 0) {
                    h += generateHtmlForRules(playoffRules);
                }
                if (playoutRules.length > 0) {
                    h += generateHtmlForRules(playoutRules);
                }

                h += `<hr><div style="font-size:0.9em; padding:10px; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 4px;"><h4>Bilgi</h4><p>Yukarıdaki puan tablosunun kesin olmadığını, takım pozisyonlarının çekişmeli olması durumunda play-off/out gruplarının değişebileceğini unutmayın. Olası eşitlik durumlarında sıralamaların hesaplanması için aşağıdaki öncelik sırasına göre bir dizi kural uygulanır:</p><ul><li><strong>Puanı en yüksek olan takım:</strong> En temel sıralama ölçütüdür.</li><li><strong>Averaj:</strong> Puan eşitliğinde averajı daha iyi olan takım üstte yer alır.</li><li><strong>Sezon içi galibiyet sayısı:</strong> Puan ve averaj eşitliğinde daha fazla galibiyeti olan takım önceliklidir.</li><li><strong>Gol sayısı:</strong> Yukarıdaki tüm kriterler eşitse, daha fazla gol atan takım üstte yer alır.</li><li><strong>Kura çekimi:</strong> Tüm istatistiklerin tamamen aynı olması gibi çok nadir bir durumda sıralama kura ile belirlenir.</li></ul></div>`;
                return h;
            }

            function showProgressIndicator(message) {
                removeProgressIndicator();
                const i = document.createElement('div');
                i.id = 'mz-predictor-progress';
                i.style = "position: fixed; top: 0; left: 0; width: 100%; background: #00529B; color: white; padding: 10px; z-index: 9999; text-align: center; font-size: 1.1em; border-bottom: 2px solid #003666; box-shadow: 0 2px 5px rgba(0,0,0,0.5);";
                i.innerHTML = `<span><i class="fa fa-spinner fa-pulse"></i> ${message}</span> <button id="cancelJobBtn" style="margin-left: 20px; background: #c00; color: white; border: 1px solid white; border-radius: 4px; cursor: pointer; padding: 2px 8px;">Durdur</button>`;
                document.body.appendChild(i);
                document.getElementById('cancelJobBtn').onclick = () => {
                    isJobRunning = false;
                };
            }

            function updateProgressIndicator(message) {
                const i = document.getElementById('mz-predictor-progress');
                if (i) i.querySelector('span').innerHTML = `<i class="fa fa-spinner fa-pulse"></i> ${message}`;
            }

            function removeProgressIndicator() {
                const i = document.getElementById('mz-predictor-progress');
                if (i) i.remove();
            }

            function initButton() {
                const container = document.querySelector('div[style*="float: right; line-height: 36px;"]');
                if (container && !document.getElementById('runPredictorBtn')) {
                    const btn = document.createElement('a');
                    btn.href = '#';
                    btn.className = 'mzbtn buttondiv button_account';
                    btn.id = 'runPredictorBtn';
                    btn.style.marginLeft = '10px';
                    btn.innerHTML = `<span class="buttonClassMiddle"><span style="white-space: nowrap;"><i class="fa fa-sitemap" aria-hidden="true"></i> Play-Off/Out Tahmin Et</span></span><span class="buttonClassRight"> </span>`;
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        startJob();
                    });
                    container.appendChild(btn);
                }
            }

            waitForElement('div[style*="float: right; line-height: 36px;"]', initButton);
        }


        /****************************************************************************************
     *                                                                                      *
     *  BÖLÜM 4: TAKİP LİSTESİ FİLTRELEME (Shortlist Filter) - DÜZELTİLDİ v4 (SON VERSİYON)   *
     *                                                                                      *
     ****************************************************************************************/

        function initializeShortlistFilterScript() {
            let userCountryCode = null;
            const i18n = {
                tr: {
                    downloadImageTitle: "Oyuncu profilini resim olarak indir",
                    downloading: "İndiriliyor...",
                    downloadError: "Oyuncu resmi indirilirken bir hata oluştu.",
                    playerDataNotFound: "Resme dönüştürülecek oyuncu verisi bulunamadı."
                },
                en: {
                    downloadImageTitle: "Download player profile as image",
                    downloading: "Downloading...",
                    downloadError: "An error occurred while downloading the player image.",
                    playerDataNotFound: "Could not find player data to capture."
                }
            };
            const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
            const getText = (key) => i18n[lang][key];

            function gmRequest(options) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        ...options,
                        onload: (response) => resolve(response),
                        onerror: (error) => reject(error),
                        ontimeout: (error) => reject(error)
                    });
                });
            }

            async function fetchAndSetUserCountryCode() {
                if (userCountryCode !== null) return userCountryCode;
                try {
                    const cachedCode = await GM_getValue('user_country_code');
                    if (cachedCode) {
                        userCountryCode = cachedCode;
                        return userCountryCode;
                    }
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://www.managerzone.com/?p=team",
                            onload: resolve,
                            onerror: reject
                        });
                    });
                    const html = response.responseText;
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const countryImg = doc.querySelector('#infoAboutTeam img[src*="img/flags/s_"]');
                    if (countryImg) {
                        const src = countryImg.getAttribute('src');
                        const match = src.match(/s_([a-z]{2})\.gif/);
                        if (match && match[1]) {
                            userCountryCode = match[1];
                            await GM_setValue('user_country_code', userCountryCode);
                        } else {
                            userCountryCode = '';
                        }
                    } else {
                        userCountryCode = '';
                    }
                } catch (error) {
                    console.error("Kullanıcı ülke kodu alınırken hata oluştu:", error);
                    userCountryCode = '';
                }
                return userCountryCode;
            }
            // Bu fonksiyon, HTML'den gelen metinleri tarih nesnesine çevirir.
            function parseMzDateTime(dateTimeString) {
                if (!dateTimeString) return null;
                // Hem "DD-MM-YYYY HH:MM" hem de "DD-MM-YYYY HH:MM:SS" formatlarını yakalar
                const parts = dateTimeString.match(/(\d{2})-(\d{2})-(\d{4})\s(\d{2}):(\d{2}):?(\d{2})?/);
                if (!parts) return null;
                const day = parseInt(parts[1], 10);
                const month = parseInt(parts[2], 10) - 1; // JS'de aylar 0'dan başlar
                const year = parseInt(parts[3], 10);
                const hour = parseInt(parts[4], 10);
                const minute = parseInt(parts[5], 10);
                const second = parts[6] ? parseInt(parts[6], 10) : 0;
                return new Date(year, month, day, hour, minute, second);
            }

            // En güvenilir saat alma yöntemi: Sayfanın kendi JS değişkeninden okur.
            function getGameTime() {
                // `unsafeWindow` kullanarak sayfanın global scope'undaki değişkenlere erişiyoruz.
                if (typeof unsafeWindow.server_time === 'object' && unsafeWindow.server_time instanceof Date) {
                    return unsafeWindow.server_time;
                }
                // Yedek olarak HTML'den okumayı dener.
                const timeElement = document.querySelector('#header-stats-wrapper h5:first-child');
                if (timeElement) {
                    const match = timeElement.textContent.match(/(\d{2}-\d{2}-\d{4}\s\d{2}:\d{2})/);
                    if (match && match[1]) {
                        return parseMzDateTime(match[1]);
                    }
                }
                console.error("KRİTİK HATA: Oyun saati alınamadı.");
                return null;
            }

            async function handlePlayerImageDownload(event) {
                const button = $(event.currentTarget);
                const pid = button.data('pid');
                const playerName = button.data('player-name');

                const originalIcon = button.html();
                button.html('⏳').prop('disabled', true).attr('title', getText('downloading'));

                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.top = '-9999px';
                iframe.style.left = '-9999px';
                iframe.style.border = 'none';
                iframe.style.width = '1200px';

                try {
                    const sourceElement = button.closest('.playerContainer')[0];
                    if (!sourceElement) {
                        throw new Error("Kaynak oyuncu konteyneri bulunamadı.");
                    }

                    const sourceRect = sourceElement.getBoundingClientRect();
                    const sourceWidth = sourceRect.width;

                    document.body.appendChild(iframe);

                    await new Promise(resolve => {
                        iframe.onload = resolve;
                        iframe.src = 'about:blank';
                    });

                    const iframeDoc = iframe.contentDocument;
                    if (!iframeDoc) {
                        throw new Error("Iframe içeriğine erişilemedi.");
                    }

                    let allStyles = '';
                    document.querySelectorAll('link[rel="stylesheet"], style').forEach(styleEl => {
                        allStyles += styleEl.outerHTML;
                    });

                    const iframeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <base href="https://www.managerzone.com/">
                ${allStyles}
                <style>
                    body {
                        /* Arka plan rengini burada da ayarlamak, render tutarlılığına yardımcı olabilir */
                        background-color: #e6e6e6 !important;
                        margin: 20px;
                    }
                    .capture-wrapper {
                        width: ${sourceWidth}px !important;
                    }
                </style>
            </head>
            <body>
                <div class="capture-wrapper">
                    ${sourceElement.outerHTML}
                </div>
            </body>
            </html>
        `;

                    iframeDoc.open();
                    iframeDoc.write(iframeHtml);
                    iframeDoc.close();

                    await new Promise(r => setTimeout(r, 1500));

                    const targetElementInIframe = iframeDoc.querySelector('.playerContainer');
                    if (!targetElementInIframe) {
                        throw new Error("Oyuncu konteyneri iframe içine kopyalanamadı.");
                    }

                    const transferDisclaimer = targetElementInIframe.querySelector('.bid-history-lite-wrapper p');
                    if (transferDisclaimer) {
                        transferDisclaimer.remove();
                    }

                    // ▼▼▼ EN ÖNEMLİ DEĞİŞİKLİK BURADA ▼▼▼
                    // Arka plan rengini, istediğimiz açık gri renk (#e6e6e6) olarak açıkça belirtiyoruz.
                    const canvas = await html2canvas(targetElementInIframe, {
                        useCORS: true,
                        allowTaint: true,
                        scale: 1.5,
                        backgroundColor: '#e6e6e6' // <-- DÜZELTME BURADA
                    });
                    // ▲▲▲ DEĞİŞİKLİK SONA ERDİ ▲▲▲

                    const link = document.createElement('a');
                    link.download = `MZ_Player_${playerName.replace(/\s/g, '_')}_${pid}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                } catch (error) {
                    console.error(getText('downloadError'), error);
                    alert(getText('downloadError'));
                } finally {
                    if (iframe) {
                        iframe.remove();
                    }
                    button.html(originalIcon).prop('disabled', false).attr('title', getText('downloadImageTitle'));
                }
            }

            function addFilterUI() {
                GM_addStyle(`
            /* ... stiller aynı kalabilir ... */
            .sl-action-btn { padding: 5px 12px !important; cursor: pointer; color: white !important; border: 1px solid rgba(0,0,0,0.2) !important; border-radius: 4px !important; font-weight: bold !important; font-size: 13px !important; text-decoration: none !important; display: inline-block !important; line-height: normal !important; height: auto !important; }
            #shortlist-filter-btn { background-color: #4CAF50; } #shortlist-filter-btn:hover { background-color: #45a049; }
            #script-controls-wrapper { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; padding: 10px; background: #f1f1f1; border: 1px solid #ddd; border-radius: 5px; }
            #shortlist-filter-controls { display: flex; align-items: center; gap: 5px; }
            #shortlist-filter-count { font-weight: bold; color: #00529B; }
            .sl-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); z-index: 10010; display: none; justify-content: center; align-items: center; }
            .sl-modal-content { background: #fefefe; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); min-width: 300px; display: flex; flex-direction: column; max-width: 450px; }
            .sl-modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
            .sl-modal-header h3 { margin: 0; font-size: 18px; } .sl-modal-close { font-size: 24px; font-weight: bold; cursor: pointer; color: #888; }
            .sl-modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .sl-filter-group { border: 1px solid #ddd; padding: 10px; border-radius: 5px; background: #fafafa; }
            .sl-filter-group h4 { margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .sl-filter-group label { display: block; margin-bottom: 5px; } .sl-age-inputs { display: flex; align-items: center; gap: 5px; }
            .sl-modal-content input[type="number"] { width: 60px; padding: 5px; border: 1px solid #ccc; border-radius: 3px; }
            .sl-modal-footer { border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px; text-align: center; }
            .sl-modal-footer button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; margin: 0 5px; }
            #shortlist-filter-apply { background-color: #007bff; } #shortlist-filter-reset { background-color: #6c757d; }
        .player-download-btn {
                padding: 0px 7px; margin-left: 8px; font-weight: bold; cursor: pointer;
                background-color: #28a745; color: white; border: 1px solid #1e7e34;
                border-radius: 4px; font-size: 12px; vertical-align: middle;
            }
        `);

                const modalHTML = `
            <div id="shortlist-filter-modal" class="sl-modal-overlay"> <div class="sl-modal-content"> <div class="sl-modal-header"> <h3>Oyuncu Filtrele</h3> <span class="sl-modal-close">×</span> </div> <div class="sl-modal-body"> <div class="sl-filter-group"> <h4>Yaş Aralığı</h4> <div class="sl-age-inputs"> <input type="number" id="min-age" placeholder="Min" min="15" max="40"> <span>-</span> <input type="number" id="max-age" placeholder="Max" min="15" max="40"> </div> </div> <div class="sl-filter-group"> <h4>Diğer</h4> <label> <input type="checkbox" id="retiring-only"> Emekli Olacaklar </label> <label> <input type="checkbox" id="on-transfer-only"> Transferde Olanlar (Aktif) </label> <label> <input type="checkbox" id="expired-transfer-only"> Transferi Bitmişler </label> </div> <div class="sl-filter-group" style="grid-column: 1 / -1;"> <h4>Milliyet</h4> <label><input type="radio" name="nationality" value="all" checked> Tümü</label> <label><input type="radio" name="nationality" value="national"> Yerli</label> <label><input type="radio" name="nationality" value="foreign"> Yabancı</label> </div> </div> <div class="sl-modal-footer"> <button id="shortlist-filter-apply">Filtrele</button> <button id="shortlist-filter-reset">Sıfırla</button> </div> </div> </div>
        `;
                $('body').append(modalHTML);

                const playersListContainer = $('#players_container');
                if (playersListContainer.length > 0 && $('#script-controls-wrapper').length === 0) {
                    const scriptWrapper = $(`<div id="script-controls-wrapper"><div id="shortlist-filter-controls"><button id="shortlist-filter-btn" class="sl-action-btn">Filtrele</button><span id="shortlist-filter-count"></span></div></div>`);
                    playersListContainer.before(scriptWrapper);
                }

                $('#shortlist-filter-btn').on('click', () => $('#shortlist-filter-modal').css('display', 'flex'));
                $('#shortlist-filter-modal .sl-modal-close').on('click', () => $('#shortlist-filter-modal').hide());
                $('#shortlist-filter-apply').on('click', applyFilters);
                $('#shortlist-filter-reset').on('click', resetFilters);
                $('#shortlist-filter-modal input[type="number"]').on('keydown keyup keypress', event => event.stopPropagation());
            }

            function applyFilters() {
                const minAge = parseInt($('#min-age').val(), 10) || 0;
                const maxAge = parseInt($('#max-age').val(), 10) || 100;
                const retiringOnly = $('#retiring-only').is(':checked');
                const onTransferOnly = $('#on-transfer-only').is(':checked');
                const expiredTransferOnly = $('#expired-transfer-only').is(':checked');
                const nationalityFilter = $('input[name="nationality"]:checked').val();

                const currentGameTime = getGameTime();
                if (!currentGameTime && (onTransferOnly || expiredTransferOnly)) {
                    alert("Hata: Transfer filtresini kullanmak için oyun saati sayfadan alınamadı. Filtreleme yapılamıyor.");
                    return;
                }

                let visibleCount = 0;
                $('.playerContainer').each(function() {
                    const player = $(this);
                    let show = true;

                    // Önceki filtreler (yaş, emeklilik vb.)
                    if (show) {
                        let age = -1;
                        player.find('.dg_playerview_info table td').each(function() {
                            if (/yaş:|age:/i.test($(this).text())) {
                                const ageMatch = $(this).text().match(/\d+/);
                                if (ageMatch) { age = parseInt(ageMatch[0], 10); return false; }
                            }
                        });
                        if (age !== -1 && (age < minAge || age > maxAge)) {
                            show = false;
                        }
                    }
                    if (show && retiringOnly) {
                        if (player.find('.dg_playerview_retire').length === 0) {
                            show = false;
                        }
                    }

                    // *** YENİ ve DÜZELTİLMİŞ TRANSFER FİLTRELEME MANTIĞI (v2 - VEYA Mantığı) ***
                    if (show && (onTransferOnly || expiredTransferOnly)) {
                        let isPlayerOnTransfer = false;
                        let isTransferActive = false;

                        // "Bitiş tarihi:" etiketini içeren <span> elementini bul
                        const deadlineLabel = player.find('span').filter(function() {
                            return $(this).text().trim() === 'Bitiş tarihi:';
                        });

                        if (deadlineLabel.length > 0) {
                            // Etiketin bir sonraki kardeşi olan <span> içindeki metni al.
                            const rawDeadlineText = deadlineLabel.next('span').text();
                            // Regex ile sadece tarih ve saat kısmını güvenli bir şekilde al.
                            const match = rawDeadlineText.match(/(\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}(?::\d{2})?)/);

                            if (match && match[1]) {
                                const deadlineTime = parseMzDateTime(match[1]);
                                if (deadlineTime) {
                                    isPlayerOnTransfer = true;
                                    // Oyun saati ile karşılaştır.
                                    isTransferActive = deadlineTime > currentGameTime;
                                }
                            }
                        }

                        // --- HATA DÜZELTMESİ BAŞLANGICI ---
                        // Oyuncunun seçili kriterlerden herhangi birine uyup uymadığını kontrol etmek için bir değişken.
                        let matchesTransferCriteria = false;

                        // 1. "Aktif" filtresi seçiliyse ve oyuncu aktif transferdeyse, kriteri karşılar.
                        if (onTransferOnly && isPlayerOnTransfer && isTransferActive) {
                            matchesTransferCriteria = true;
                        }

                        // 2. "Bitmiş" filtresi seçiliyse ve oyuncunun transferi bitmişse, kriteri karşılar.
                        // Bu bir VEYA (OR) durumu olduğu için, önceki koşul doğru olsa bile bunu kontrol ederiz.
                        if (expiredTransferOnly && isPlayerOnTransfer && !isTransferActive) {
                            matchesTransferCriteria = true;
                        }

                        // Eğer her iki filtre de seçiliyse, bu blok zaten yukarıdaki iki if bloğu sayesinde
                        // doğru çalışacaktır. Oyuncu ya aktif ya da bitmiş transferdeyse matchesTransferCriteria = true olur.
                        // Eğer sadece bir filtre seçiliyse ve oyuncu o kritere uymuyorsa matchesTransferCriteria = false kalır.

                        // Eğer oyuncu, seçilen transfer kriterlerinden HİÇBİRİNİ karşılamıyorsa gizle.
                        if (!matchesTransferCriteria) {
                            show = false;
                        }
                        // --- HATA DÜZELTMESİ SONU ---
                    }

                    // Milliyet filtresi
                    if (show && userCountryCode && nationalityFilter !== 'all') {
                        const playerFlagImg = player.find('img[src*="img/flags/s_"]');
                        let playerCountryCode = null;
                        if (playerFlagImg.length > 0) {
                            const src = playerFlagImg.attr('src');
                            const match = src.match(/s_([a-z]{2})\.gif/);
                            if (match && match[1]) {
                                playerCountryCode = match[1];
                            }
                        }
                        if (playerCountryCode) {
                            if (nationalityFilter === 'national' && playerCountryCode !== userCountryCode) {
                                show = false;
                            }
                            if (nationalityFilter === 'foreign' && playerCountryCode === userCountryCode) {
                                show = false;
                            }
                        }
                    }

                    player.toggle(show);
                    if (show) {
                        visibleCount++;
                    }
                });

                const isFiltered = minAge > 0 || maxAge < 100 || retiringOnly || onTransferOnly || expiredTransferOnly || nationalityFilter !== 'all';
                $('#shortlist-filter-count').text(isFiltered ? `${visibleCount} oyuncu filtrelendi.` : '');
                $('#shortlist-filter-modal').hide();
            }

            function resetFilters() {
                $('#min-age').val('');
                $('#max-age').val('');
                $('#retiring-only').prop('checked', false);
                $('#on-transfer-only').prop('checked', false);
                $('#expired-transfer-only').prop('checked', false);
                $('input[name="nationality"][value="all"]').prop('checked', true);
                $('.playerContainer').show();
                $('#shortlist-filter-count').text('');
                $('#shortlist-filter-modal').hide();
            }

            function init() {
                if ($('#players_container').length) {
                    fetchAndSetUserCountryCode();
                    addFilterUI();

                    // GÜNCELLENDİ: İndirme butonunu her oyuncu için ekliyoruz
                    $('.playerContainer').each(function() {
                        const pid = $(this).find('span.player_id_span').text().trim();
                        const playerName = $(this).find('span.player_name').text().trim();

                        // Eğer buton zaten varsa tekrar ekleme
                        if (pid && $(this).find('.player-download-btn').length === 0) {
                            // ▼▼▼ DEĞİŞTİRİLECEK SATIR BURASI ▼▼▼
                            const downloadBtn = $(`<button class="player-download-btn" title="${getText('downloadImageTitle')}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; pointer-events: none;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>`);
                            // ▲▲▲ DEĞİŞTİRİLECEK SATIR BURASI ▲▲▲
                            downloadBtn.data('pid', pid).data('player-name', playerName);


                            // Butonu mevcut Transfer Takipçisi butonunun yanına ekle
                            const actionContainer = $(this).find('h2.subheader .floatRight');
                            if (actionContainer.length > 0) {
                                actionContainer.append(downloadBtn);
                            }
                        }
                    });

                    // YENİ EKLENDİ: Butonlara tıklama olayını atıyoruz.
                    // Sayfa dinamik olarak değişebileceği için 'document' üzerinden olay atamak daha güvenlidir.
                    $(document).off('click', '.player-download-btn').on('click', '.player-download-btn', handlePlayerImageDownload);
                }
            }
            init();
        }

        /****************************************************************************************
     *                                                                                      *
     *  BÖLÜM 5: TRANSFER TAKİPÇİSİ (Transfer Tracker) - YENİ MODÜL                         *
     *                                                                                      *
     ****************************************************************************************/
        function initializeTransferTrackerScript() {
            const i18nData = {
                tr: {
                    trackPlayer: "Oyuncunun Transfer Geçmişini Takip Et",
                    historyFor: "için Transfer Geçmişi",
                    checking: "Kontrol ediliyor...",
                    noHistory: "Bu oyuncu için kayıtlı transfer geçmişi yok.",
                    clearHistory: "Geçmişi Temizle",
                    confirmClear: "Bu oyuncunun tüm transfer geçmişi silinecek. Emin misiniz?",
                    date: "Tarih",
                    status: "Durum",
                    price: "Fiyat",
                    bid: "Teklif",
                    deadline: "Bitiş",
                    buyer: "Alıcı",
                    statusListed: "Listelendi",
                    statusSold: "Satıldı",
                    statusExpired: "Satılmadı",
                    statusEnded: "Bitti (Kontrol bekleniyor)",
                    statusBid: "Teklif Var",
                    checkingShortlist: "Takip listesi transferleri kontrol ediliyor...",
                    checkComplete: "Transfer kontrolü tamamlandı.",
                    scanShortlistBtn: "Takip Listesini Tara",
                },
                en: {
                    trackPlayer: "Track Player's Transfer History",
                    historyFor: "Transfer History for",
                    checking: "Checking...",
                    noHistory: "No transfer history recorded for this player.",
                    clearHistory: "Clear History",
                    confirmClear: "Are you sure you want to delete all transfer history for this player?",
                    date: "Date",
                    status: "Status",
                    price: "Price",
                    bid: "Bid",
                    deadline: "Deadline",
                    buyer: "Buyer",
                    statusListed: "Listed",
                    statusSold: "Sold",
                    statusExpired: "Expired",
                    statusEnded: "Ended (Awaiting check)",
                    statusBid: "Bid Placed",
                    checkingShortlist: "Checking shortlist transfers...",
                    checkComplete: "Transfer check complete.",
                    scanShortlistBtn: "Scan Transfers",
                }
            };
            const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
            const getText = (key) => i18nData[lang][key];

            const TRANSFER_HISTORY_KEY = 'mz_transfer_history_v2';

            GM_addStyle(`
            .transfer-track-btn {
                padding: 0px 7px; margin-left: 8px; font-weight: bold; cursor: pointer;
                background-color: #17a2b8; color: white; border: 1px solid #107686;
                border-radius: 4px; font-size: 12px; vertical-align: middle;
            }
            .tt-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.6); z-index: 10020; display: none;
                justify-content: center; align-items: center;
            }
            .tt-modal-content {
                background: #f8f9fa; padding: 20px; border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 90%; max-width: 850px;
                max-height: 90vh; display: flex; flex-direction: column;
            }
            .tt-modal-header {
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid #dee2e6; padding-bottom: 10px; margin-bottom: 15px;
            }
            .tt-modal-header h3 { margin: 0; font-size: 18px; color: #00529B;}
            .tt-modal-close { font-size: 24px; font-weight: bold; cursor: pointer; color: #888; }
            .tt-modal-body {
                overflow-y: auto;
                flex-grow: 1;
            }
            .tt-tab-container {
                display: flex;
                border-bottom: 1px solid #dee2e6;
                margin-bottom: 15px;
            }
            .tt-tab {
                padding: 8px 16px;
                cursor: pointer;
                border: 1px solid transparent;
                border-bottom: none;
                margin-bottom: -1px;
                font-weight: bold;
                color: #00529B;
            }
            .tt-tab.active {
                background-color: #fff;
                border-color: #dee2e6 #dee2e6 #fff;
                border-radius: 4px 4px 0 0;
            }
            .tt-tab-content {
                display: none;
            }
            .tt-tab-content.active {
                display: block;
            }
            #tt-chart-container {
                width: 100%;
                height: 400px;
            }
            .tt-history-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .tt-history-table th, .tt-history-table td { border: 1px solid #dee2e6; padding: 8px; text-align: left; }
            .tt-history-table th { background-color: #e9ecef; }
            .tt-history-table .status-listed { color: #007bff; }
            .tt-history-table .status-bid { color: #ff8c00; }
            .tt-history-table .status-sold { color: #28a745; font-weight: bold; }
            .tt-history-table .status-expired { color: #dc3545; }
            .tt-modal-footer { margin-top: 15px; text-align: right; }
        `);

            async function showTransferHistoryModal(pid, playerName) {
                $('#transfer-tracker-modal').remove();

                const allHistory = JSON.parse(await GM_getValue(TRANSFER_HISTORY_KEY, '{}'));
                const playerHistory = allHistory[pid] || [];

                let tableRows = '';
                const chartData = [];
                let soldEntry = null;

                if (playerHistory.length > 0) {
                    playerHistory.forEach(entry => {
                        const statusClass = `status-${entry.status.toLowerCase()}`;
                        const statusText = getText(`status${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}`) || entry.status;
                        const priceNum = parseInt((entry.askingPrice || '0').replace(/\D/g, ''), 10);
                        const bidNum = parseInt((entry.finalBid || '0').replace(/\D/g, ''), 10);

                        tableRows = `
                        <tr>
                            <td>${new Date(entry.timestamp).toLocaleString()}</td>
                            <td class="${statusClass}">${statusText}</td>
                            <td>${entry.askingPrice || '-'}</td>
                            <td>${entry.finalBid || '-'}</td>
                            <td>${entry.deadline || '-'}</td>
                            <td>${entry.buyer || '-'}</td>
                        </tr>` + tableRows;

                        if (priceNum > 0) {
                            chartData.push({
                                x: entry.timestamp,
                                y: priceNum,
                                name: `İstenen: ${entry.askingPrice}`
                        });
                        }
                        if (bidNum > 0) {
                            chartData.push({
                                x: entry.timestamp,
                                y: bidNum,
                                name: `Teklif: ${entry.finalBid}`
                        });
                        }
                        if (entry.status === 'sold') {
                            soldEntry = {
                                x: entry.timestamp,
                                y: bidNum,
                                name: `Satıldı: ${entry.finalBid}`
                        };
                    }
                    });
                } else {
                    tableRows = `<tr><td colspan="6" style="text-align:center;">${getText('noHistory')}</td></tr>`;
                }
                chartData.sort((a, b) => a.x - b.x);

                const modalHTML = `
                <div id="transfer-tracker-modal" class="tt-modal-overlay">
                    <div class="tt-modal-content">
                        <div class="tt-modal-header">
                            <h3>${getText('historyFor')} ${playerName}</h3>
                            <span class="tt-modal-close">×</span>
                        </div>
                        <div class="tt-tab-container">
                            <div class="tt-tab active" data-tab="table">Tablo</div>
                            <div class="tt-tab" data-tab="chart">Grafik</div>
                        </div>
                        <div class="tt-modal-body">
                            <div id="tt-content-table" class="tt-tab-content active">
                                <table class="tt-history-table">
                                    <thead>
                                        <tr>
                                            <th>${getText('date')}</th>
                                            <th>${getText('status')}</th>
                                            <th>${getText('price')}</th>
                                            <th>${getText('bid')}</th>
                                            <th>${getText('deadline')}</th>
                                            <th>${getText('buyer')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>${tableRows}</tbody>
                                </table>
                            </div>
                            <div id="tt-content-chart" class="tt-tab-content">
                                <div id="tt-chart-container"></div>
                            </div>
                        </div>
                        <div class="tt-modal-footer">
                             <button id="tt-clear-history" class="mz-script-button" style="background-color: #dc3545;">${getText('clearHistory')}</button>
                        </div>
                    </div>
                </div>`;
                $('body').append(modalHTML);

                $('.tt-tab').on('click', function() {
                    const tabId = $(this).data('tab');
                    $('.tt-tab').removeClass('active');
                    $(this).addClass('active');
                    $('.tt-tab-content').removeClass('active');
                    $('#tt-content-' + tabId).addClass('active');
                });

                if (playerHistory.length > 0) {
                    unsafeWindow.Highcharts.chart('tt-chart-container', {
                        chart: { type: 'line' },
                        title: { text: `${playerName} - Fiyat Değişimi` },
                        xAxis: {
                            type: 'datetime',
                            title: { text: 'Tarih' }
                        },
                        yAxis: {
                            title: { text: 'Fiyat (EUR)' },
                            labels: {
                                formatter: function() { return this.value.toLocaleString('de-DE') + ' EUR'; }
                            },
                            min: 0
                        },
                        tooltip: {
                            formatter: function() {
                                return `<b>${this.point.name}</b><br/>${new Date(this.x).toLocaleString()}`;
                            }
                        },
                        series: [{
                            name: 'Fiyat Geçmişi',
                            data: chartData,
                            step: 'left',
                            marker: {
                                enabled: true,
                                radius: 4
                            }
                        },
                                 ...(soldEntry ? [{
                                     type: 'scatter',
                                     name: 'Satış Noktası',
                                     data: [soldEntry],
                                     marker: {
                                         symbol: 'diamond',
                                         fillColor: '#28a745',
                                         radius: 7,
                                         lineWidth: 2,
                                         lineColor: '#FFF'
                                     }
                                 }] : [])]
                    });
                } else {
                    $('#tt-chart-container').html(`<div style="text-align:center; padding-top: 50px;">${getText('noHistory')}</div>`);
                }


                const modal = $('#transfer-tracker-modal');
                modal.css('display', 'flex');
                modal.find('.tt-modal-close').on('click', () => modal.remove());
                modal.on('click', (e) => { if (e.target === modal[0]) modal.remove(); });
                $('#tt-clear-history').on('click', async () => {
                    if(confirm(getText('confirmClear'))) {
                        const currentHistory = JSON.parse(await GM_getValue(TRANSFER_HISTORY_KEY, '{}'));
                        delete currentHistory[pid];
                        await GM_setValue(TRANSFER_HISTORY_KEY, JSON.stringify(currentHistory));
                        modal.remove();
                    }
                });
            }

            function init() {
                $('.playerContainer').each(function() {
                    const pid = $(this).find('span.player_id_span').text().trim();
                    const playerName = $(this).find('span.player_name').text().trim();
                    if (pid) {
                        const trackBtn = $(`<button class="transfer-track-btn" title="${getText('trackPlayer')}">T</button>`);
                        trackBtn.data('pid', pid).data('player-name', playerName);
                        $(this).find('h2.subheader .floatRight').append(trackBtn);
                    }
                });

                $(document).on('click', '.transfer-track-btn', function() {
                    const pid = $(this).data('pid');
                    const playerName = $(this).data('player-name');
                    showTransferHistoryModal(pid, playerName);
                });

            }

            init();
        }


        /****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 7: İSTATİSTİK SAYFASI ÖZETİ (Statistics Summary) - v3.2 (Final Düzeltme)      *
 *                                                                                      *
 ****************************************************************************************/
        function initializeStatisticsSummaryScript() {
            'use strict';
            const $ = unsafeWindow.jQuery;

            // --- Dil Desteği (i18n) ---
            const i18n = {
                tr: {
                    summarizeSeasons: "Bu Sekmeyi Özetle",
                    summarizeAll: "TÜM SEKMELERİ ÖZETLE",
                    clearCache: "Sıfırla",
                    // Vurgulanan Değişiklikler BAŞLANGIÇ
                    updateCurrentTab: "Tüm Son Sezonları Güncelle", // <<< YENİ METİN (Bu butonu kullanacağız)
                    tabCacheCleared: (tabName) => `${tabName} sekmesi son sezon önbelleği temizlendi. Güncelleniyor...`,
                    lastSeasonUpdateComplete: "TÜM sekmelerin en son sezonları güncellendi!", // <<< YENİ METİN
                    // Vurgulanan Değişiklikler SON
                    summaryTitle: "Sezon Performansı Özeti",
                    processing: "İşleniyor...",
                    fetchingSeason: (season, current, total) => `${season}. Sezon verileri alınıyor... (${current}/${total})`,
                    processingTab: (tabName, current, total) => `Sekme işleniyor: ${tabName} (${current}/${total})`,
                    summaryComplete: "Tamamlandı! Veriler kaydedildi.",
                    generatingReport: "Rapor oluşturuluyor...",
                    close: "Kapat",
                    season: "Sezon",
                    league: "Lig",
                    rank: "Sıra",
                    points: "Puan",
                    goalsFor: "A.Gol",
                    goalsAgainst: "Y.Gol",
                    avgGoalsFor: "Ort.A",
                    avgGoalsAgainst: "Ort.Y",
                    chartTitle: (metric) => `Sezonlara Göre ${metric} Değişimi`,
                    yAxisTitleLeague: "Lig Seviyesi (Düşük = İyi)",
                    average: "Ortalama",
                    errorActiveTab: "Aktif istatistik sekmesi bulunamadı!",
                    errorTeamId: "Takım ID'si bulunamadı.",
                    errorNoSeasons: "Bu sekmede özetlenecek sezon bulunamadı.",
                    cacheCleared: "Önbellek temizlendi. Veriler baştan taranacak.",
                },
                en: {
                    summarizeSeasons: "Summarize This Tab",
                    summarizeAll: "SUMMARIZE ALL TABS",
                    clearCache: "Reset",
                    // Vurgulanan Değişiklikler BAŞLANGIÇ
                    updateCurrentTab: "Update All Last Seasons", // <<< NEW TEXT (This button will be used)
                    tabCacheCleared: (tabName) => `Last season cache for ${tabName} tab cleared. Updating...`,
                    lastSeasonUpdateComplete: "All sections' last seasons updated!", // <<< NEW TEXT
                    // Vurgulanan Değişiklikler SON
                    summaryTitle: "Season Performance Summary",
                    processing: "Processing...",
                    fetchingSeason: (season, current, total) => `Fetching season ${season}... (${current}/${total})`,
                    processingTab: (tabName, current, total) => `Processing tab: ${tabName} (${current}/${total})`,
                    summaryComplete: "Complete! Data saved.",
                    generatingReport: "Generating report...",
                    close: "Close",
                    season: "Season",
                    league: "League",
                    rank: "Rank",
                    points: "Points",
                    goalsFor: "GF",
                    goalsAgainst: "GA",
                    avgGoalsFor: "Avg. GF",
                    avgGoalsAgainst: "Avg. GA",
                    chartTitle: (metric) => `${metric} History by Season`,
                    yAxisTitleLeague: "League Level (Lower = Better)",
                    average: "Average",
                    errorActiveTab: "Could not find the active statistics tab!",
                    errorTeamId: "Could not find Team ID.",
                    errorNoSeasons: "No seasons found to summarize in this tab.",
                    cacheCleared: "Cache cleared. Data will be rescanned.",
                }
            };

            const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
            const getText = (key, ...args) => {
                const text = i18n[lang][key] || i18n['en'][key];
                return typeof text === 'function' ? text(...args) : text;
            };

            // --- Stil Tanımlamaları ---
            function injectStyles() {
                GM_addStyle(`
            #stats-summary-wrapper { display: flex; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid #ddd; margin-bottom: 10px; flex-wrap: wrap; }
            #stats-summary-btn, #stats-summary-all-btn, #stats-clear-cache-btn, #stats-update-tab-btn { vertical-align: middle; }

            /* Genel Mat Yeşil Stil (Yeni eklenen butonlar için) */
            .mz-mat-green-btn {
                background-color: #629c62 !important;
                background-image: linear-gradient(to bottom, #72a872, #629c62) !important;
                border-color: #538b53 !important;
                color: #fff !important;
            }
            .mz-mat-green-btn:hover { background-color: #538b53 !important; }

            /* KIRMIZI SIFIRLA Butonu DÜZELTME (Mevcut kırmızı stili korur) */
            #stats-clear-cache-btn .buttonClassMiddle {
                background-color: #dc3545 !important;
                background-image: linear-gradient(to bottom, #e35a57, #dc3545) !important;
                border-color: #c82333 !important;
                color: white !important;
            }
            #stats-clear-cache-btn:hover .buttonClassMiddle { background-color: #c82333 !important; }
            .stats-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10050; display: none; justify-content: center; align-items: center; }
            .stats-modal-content { background: #f4f4f4; padding: 20px; border-radius: 8px; width: 90%; max-width: 1000px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 5px 20px rgba(0,0,0,0.4); }
            .stats-modal-header { border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .stats-modal-header h3 { margin: 0; font-size: 20px; color: #333; }
            .stats-modal-close { font-size: 28px; font-weight: bold; cursor: pointer; color: #888; }
            .stats-modal-body { overflow-y: auto; padding-right: 10px; }
            .stats-summary-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .stats-summary-table th, .stats-summary-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .stats-summary-table th { background-color: #e9ecef; position: sticky; top: 0; z-index: 1; }
            .stats-summary-table tbody tr:nth-child(odd) { background-color: #f9f9f9; }
            .stats-summary-table th.chartable-header { cursor: pointer; transition: background-color 0.2s; }
            .stats-summary-table th.chartable-header:hover { background-color: #dcdcdc; }
            .stats-summary-table th.active-metric { background-color: #007bff !important; color: white !important; }
            #stats-history-chart-container { width: 100%; height: 400px; margin-top: 20px; border-top: 2px solid #ccc; padding-top: 20px; }
            #mz-toast-notification {
                position: fixed; bottom: 20px; right: 20px; background-color: #28a745; color: white; padding: 12px 20px; border-radius: 5px; z-index: 10099; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                opacity: 0; transform: translateY(20px); transition: opacity 0.4s ease, transform 0.4s ease; font-size: 14px; font-weight: bold;
            }
            #mz-toast-notification.visible { opacity: 1; transform: translateY(0); }
        `);
            }

            function showToastNotification(message, duration = 3500) {
                $('#mz-toast-notification').remove();
                const toast = $(`<div id="mz-toast-notification"></div>`).text(message);
                $('body').append(toast);
                setTimeout(() => { toast.addClass('visible'); }, 10);
                setTimeout(() => { toast.removeClass('visible'); setTimeout(() => { toast.remove(); }, 500); }, duration);
            }

            // --- Ana Fonksiyonlar ---
            function addSummaryButton() {
                const targetContainer = $('.statsTabs .ui-tabs-nav').first();
                if (targetContainer.length > 0 && $('#stats-summary-wrapper').length === 0) {

                    // Vurgulanan Değişiklikler BAŞLANGIÇ: YENİ BUTONLAR (Mat Yeşil Renk Düzeltmesi)
                    const MAT_YESIL_CLASS = "mz-mat-green-btn"; // Yeni tanımladığımız sınıf

                    // 1. YENİ BUTON: "Tüm Son Sezonları Güncelle" (Mat Yeşil)
                    const updateAllLastSeasonsBtn = $(`<a href="#" id="stats-update-tab-btn" class="mzbtn buttondiv button_account ${MAT_YESIL_CLASS}">
                                            <span class="buttonClassMiddle"><span>${getText('updateCurrentTab')}</span></span>
                                            <span class="buttonClassRight"> </span>
                                          </a>`);

                    // 2. MEVCUT BUTON (Bu Sekmeyi Özetle): Mat Yeşil
                    const summarizeCurrentBtn = $(`<a href="#" id="stats-summary-btn" class="mzbtn buttondiv button_account ${MAT_YESIL_CLASS}">
                                    <span class="buttonClassMiddle"><span>${getText('summarizeSeasons')}</span></span>
                                    <span class="buttonClassRight"> </span>
                                  </a>`);

                    // 3. MEVCUT BUTON (TÜM SEKMELERİ ÖZETLE): Mat Yeşil
                    const summaryAllBtn = $(`<a href="#" id="stats-summary-all-btn" class="mzbtn buttondiv button_account ${MAT_YESIL_CLASS}">
                                    <span class="buttonClassMiddle"><span>${getText('summarizeAll')}</span></span>
                                    <span class="buttonClassRight"> </span>
                                  </a>`);

                    // 4. MEVCUT BUTON (Sıfırla): Kırmızı Renk (Stili CSS'ten geliyor)
                    const clearCacheBtn = $(`<a href="#" id="stats-clear-cache-btn" class="mzbtn buttondiv button_account" title="Tüm verileri sil ve baştan tara">
                                    <span class="buttonClassMiddle"><span>${getText('clearCache')}</span></span>
                                    <span class="buttonClassRight"> </span>
                                  </a>`);

                    // Event Atamaları
                    summarizeCurrentBtn.on('click', handleSummaryClick);
                    summaryAllBtn.on('click', handleSummaryAllClick);
                    // 👇 SIFIRLA BUTONUNUN EVENT'İ BURADA. KODUNUZDA ZATEN VARDI VE BU KISIM DÜZELTME GEREKİYORSA O BURADADIR
                    clearCacheBtn.on('click', handleClearCacheClick);
                    // 👆 DÜZELTME SONU

                    updateAllLastSeasonsBtn.on('click', handleUpdateAllLastSeasonsClick);

                    // DÜĞME SIRALAMASI: Görseldeki sırayı koruyacak şekilde ekliyoruz:
                    const buttonWrapper = $('<div id="stats-summary-wrapper"></div>')
                    .append(updateAllLastSeasonsBtn)
                    .append(summarizeCurrentBtn)
                    .append(summaryAllBtn)
                    .append(clearCacheBtn);

                    targetContainer.after(buttonWrapper);
                }
            }

            async function handleClearCacheClick(e) {
                e.preventDefault();
                console.log("[MZone Advanced] 'Sıfırla' butonu tıklandı. Önbellek temizleme başlıyor...");

                // 1. ADIM: Güvenilir Team ID Bulma
                let teamId = new URLSearchParams(window.location.search).get('tid');

                // Eğer URL'de yoksa, AJAX sekmelerinden birinden almaya çalış
                if (!teamId) {
                    const allMainTabs = $('.statsTabs > ul.ui-tabs-nav > li > a');
                    try {
                        const firstAjaxTab = allMainTabs.filter(':not([href^="#"])').first();
                        if (firstAjaxTab.length > 0) {
                            teamId = new URLSearchParams(firstAjaxTab.attr('href').split('?')[1]).get('tid');
                        }
                    } catch (error) {
                        console.error("[MZone Advanced] Team ID alınırken hata:", error);
                    }
                }

                if (!teamId) {
                    alert(getText('errorTeamId') + " (Sıfırlama işlemi için Team ID bulunamadı.)");
                    console.error("[MZone Advanced] HATA: Sıfırlama için Team ID bulunamadı.");
                    return;
                }

                // 2. ADIM: Kullanıcı Onayı
                if (!confirm("Bu takımın (ID: " + teamId + ") kayıtlı tüm Sezon Özet verileri kalıcı olarak silinecek ve tekrar tarama yapmanız gerekecek. Emin misiniz?")) {
                    console.log("[MZone Advanced] Sıfırlama işlemi kullanıcı tarafından iptal edildi.");
                    return;
                }

                // 3. ADIM: ÖnBelleği Silme
                const CACHE_KEY = 'mz_stats_summary_cache_v2';

                try {
                    const allCaches = JSON.parse(await GM_getValue(CACHE_KEY, '{}'));

                    if (allCaches[teamId]) {
                        delete allCaches[teamId];
                        await GM_setValue(CACHE_KEY, JSON.stringify(allCaches));
                        showToastNotification(getText('cacheCleared'));
                        console.log(`[MZone Advanced] BAŞARILI: Takım ID ${teamId} için önbellek temizlendi.`);
                    } else {
                        showToastNotification("Önbellekte bu takıma ait veri bulunamadı.");
                        console.warn(`[MZone Advanced] UYARI: Takım ID ${teamId} için önbellekte veri bulunamadı.`);
                    }
                } catch (error) {
                    alert("Önbellek silinirken kritik bir hata oluştu. Konsolu kontrol edin.");
                    console.error("[MZone Advanced] KRİTİK HATA: Önbellek silinirken hata:", error);
                }
            }

            async function handleSummaryAllClick(e) {
                e.preventDefault();
                const button = $('#stats-summary-all-btn');
                const originalText = button.find('.buttonClassMiddle span').text();
                button.find('.buttonClassMiddle span').text(getText('processing')).css('pointer-events', 'none');
                NProgress.start();

                const allMainTabs = $('.statsTabs > ul.ui-tabs-nav > li > a');
                let teamId = new URLSearchParams(window.location.search).get('tid');
                if (!teamId) {
                    try {
                        const firstAjaxTab = allMainTabs.filter(':not([href^="#"])').first();
                        if (firstAjaxTab.length > 0) {
                            teamId = new URLSearchParams(firstAjaxTab.attr('href').split('?')[1]).get('tid');
                        }
                    } catch (error) { console.error(error); }
                }
                if (!teamId) {
                    alert(getText('errorTeamId'));
                    NProgress.done();
                    button.find('.buttonClassMiddle span').text(originalText).css('pointer-events', 'auto');
                    return;
                }

                const CACHE_KEY = 'mz_stats_summary_cache_v2';
                const allCaches = JSON.parse(await GM_getValue(CACHE_KEY, '{}'));
                if (!allCaches[teamId]) allCaches[teamId] = {};
                const teamCache = allCaches[teamId];

                for (let i = 0; i < allMainTabs.length; i++) {
                    const tabLink = $(allMainTabs[i]);
                    const categoryKey = tabLink.text().trim();
                    const tabUrl = tabLink.attr('href');

                    NProgress.set((i + 0.1) / allMainTabs.length);
                    button.find('.buttonClassMiddle span').text(getText('processingTab', categoryKey, i + 1, allMainTabs.length));

                    let tabHtml;
                    if (tabUrl.startsWith('#')) {
                        tabHtml = $(tabUrl).html();
                    } else {
                        try {
                            const response = await GM.xmlHttpRequest({ method: "GET", url: tabUrl });
                            tabHtml = response.responseText;
                        } catch (error) {
                            console.error(`Sekme '${categoryKey}' yüklenemedi:`, error);
                            continue;
                        }
                    }

                    const seasonTabs = $(`<div>${tabHtml}</div>`).find('.leagueStats > ul > li > a, .topScorers > ul > li > a, .topBadBoys > ul > li > a').first().closest('ul').find('a');
                    if (seasonTabs.length === 0) continue;

                    if (!teamCache[categoryKey]) teamCache[categoryKey] = [];
                    const cachedSeasons = new Map(teamCache[categoryKey].map(d => [d.season, d]));
                    let hasChanges = false;

                    for (let j = 0; j < seasonTabs.length; j++) {
                        const seasonTab = $(seasonTabs[j]);
                        const season = seasonTab.text().trim();
                        const existingData = cachedSeasons.get(season);

                        // DÜZELTME: Eğer veri daha önce tarandıysa (scanned: true), boş olsa bile tekrar çekme.
                        // Sadece hiç taranmamışsa (undefined) çek.
                        if (!existingData || !existingData.scanned) {
                            try {
                                const seasonUrl = new URL(seasonTab.attr('href'), window.location.origin).href;
                                const response = await GM.xmlHttpRequest({ method: "GET", url: seasonUrl });
                                const parsedData = { season, ...parseLeagueDataFromHtml(response.responseText) };
                                cachedSeasons.set(season, parsedData);
                                hasChanges = true;
                            } catch (error) {
                                console.error(`Sezon ${season} ('${categoryKey}') verisi alınamadı:`, error);
                            }
                        }
                    }
                    if (hasChanges) {
                        teamCache[categoryKey] = Array.from(cachedSeasons.values());
                    }
                }
                await GM_setValue(CACHE_KEY, JSON.stringify(allCaches));
                NProgress.done();
                button.find('.buttonClassMiddle span').text(originalText).css('pointer-events', 'auto');
                showToastNotification(getText('summaryComplete'));
            }

            // Vurgulanan Değişiklikler BAŞLANGIÇ: Yeni, Tüm Sekmelerin Son Sezonunu Güncelleyen Fonksiyon
            async function handleUpdateAllLastSeasonsClick(e) {
                e.preventDefault();
                const button = $('#stats-update-tab-btn');
                const originalText = button.find('.buttonClassMiddle span').text();
                const resetButton = () => button.find('.buttonClassMiddle span').text(originalText).css('pointer-events', 'auto').fadeTo('fast', 1);
                button.find('.buttonClassMiddle span').text(getText('processing')).css('pointer-events', 'none').fadeTo('fast', 0.7);
                NProgress.start();

                const allMainTabs = $('.statsTabs > ul.ui-tabs-nav > li > a');

                // GÜVENİLİR TEAM ID BULMA BAŞLANGICI
                let teamId = new URLSearchParams(window.location.search).get('tid');
                if (!teamId) {
                    try {
                        const firstAjaxTab = allMainTabs.filter(':not([href^="#"])').first();
                        if (firstAjaxTab.length > 0) {
                            teamId = new URLSearchParams(firstAjaxTab.attr('href').split('?')[1]).get('tid');
                        }
                    } catch (error) { console.error(error); }
                }
                if (!teamId) {
                    alert(getText('errorTeamId'));
                    NProgress.done();
                    resetButton();
                    return;
                }
                // GÜVENİLİR TEAM ID BULMA SONU

                const CACHE_KEY = 'mz_stats_summary_cache_v2';
                const allCaches = JSON.parse(await GM_getValue(CACHE_KEY, '{}'));
                if (!allCaches[teamId]) allCaches[teamId] = {};
                const teamCache = allCaches[teamId];

                let totalTabsToProcess = allMainTabs.length;
                let tabsProcessed = 0;
                let hasChanges = false;


                for (let i = 0; i < allMainTabs.length; i++) {
                    const tabLink = $(allMainTabs[i]);
                    const categoryKey = tabLink.text().trim();
                    const tabUrl = tabLink.attr('href');

                    NProgress.set((i + 0.1) / totalTabsToProcess);
                    button.find('.buttonClassMiddle span').text(getText('processingTab', categoryKey, i + 1, totalTabsToProcess));
                    tabsProcessed++;

                    let tabHtml;
                    if (tabUrl.startsWith('#')) {
                        // Aktif sekme için DOM'dan al
                        const activePanel = $('.statsTabs > .ui-tabs-panel:visible');
                        if (activePanel.length > 0) {
                            tabHtml = activePanel.html();
                        } else {
                            continue; // Boş sekme
                        }
                    } else {
                        // Diğer sekmeler için AJAX ile çek
                        try {
                            const response = await GM.xmlHttpRequest({ method: "GET", url: tabUrl });
                            tabHtml = response.responseText;
                        } catch (error) {
                            console.error(`Sekme '${categoryKey}' yüklenemedi:`, error);
                            continue;
                        }
                    }

                    // 1. Sekmedeki EN SON SEZON bilgisini bul.
                    const seasonTabs = $(`<div>${tabHtml}</div>`).find('.leagueStats > ul > li > a, .topScorers > ul > li > a, .topBadBoys > ul > li > a').first().closest('ul').find('a');

                    if (seasonTabs.length > 0) {
                        const lastSeasonElement = $(seasonTabs[0]); // En üstteki (en son) sezon
                        const lastSeason = lastSeasonElement.text().trim();

                        // 2. Sadece bu sezonun önbelleğini temizle (Eğer varsa)
                        if (teamCache[categoryKey]) {
                            const categoryCache = teamCache[categoryKey];
                            // Sadece son sezonun verisini önbellekten kaldırarak yeniden taramaya zorla
                            const newCache = categoryCache.filter(d => d.season !== lastSeason);
                            teamCache[categoryKey] = newCache;
                            hasChanges = true;

                            // 3. O sezonu hemen çek ve önbelleğe ekle (handleSummaryClick'in içindeki tek sezon mantığı)
                            try {
                                const seasonUrl = new URL(lastSeasonElement.attr('href'), window.location.origin).href;
                                const response = await GM.xmlHttpRequest({ method: "GET", url: seasonUrl });
                                const parsedData = { season: lastSeason, ...parseLeagueDataFromHtml(response.responseText) };
                                teamCache[categoryKey].push(parsedData);
                                teamCache[categoryKey].sort((a, b) => parseFloat(b.season) - parseFloat(a.season)); // Sıralamayı koru
                            } catch (error) {
                                console.error(`Sezon ${lastSeason} ('${categoryKey}') verisi alınamadı:`, error);
                            }
                        }
                    }
                }

                if (hasChanges) {
                    await GM_setValue(CACHE_KEY, JSON.stringify(allCaches));
                }

                NProgress.done();
                resetButton();
                showToastNotification(getText('lastSeasonUpdateComplete'));
            }

            async function handleSummaryClick(e) {
                e.preventDefault();
                const button = $('#stats-summary-btn');
                const originalText = button.find('.buttonClassMiddle span').text();
                const resetButton = () => button.find('.buttonClassMiddle span').text(originalText).css('pointer-events', 'auto').fadeTo('fast', 1);
                button.find('.buttonClassMiddle span').text(getText('processing')).css('pointer-events', 'none').fadeTo('fast', 0.7);
                NProgress.start();

                const activePanel = $('.statsTabs > .ui-tabs-panel:visible');
                const activeCategoryKey = $('.statsTabs > .ui-tabs-nav > li.ui-tabs-active > a').text().trim();

                if (activePanel.length === 0 || !activeCategoryKey) {
                    alert(getText('errorActiveTab')); NProgress.done(); resetButton(); return;
                }

                const seasonTabs = activePanel.find('.leagueStats > ul > li > a, .topScorers > ul > li > a, .topBadBoys > ul > li > a').first().closest('ul').find('a');
                if (seasonTabs.length === 0) {
                    alert(getText('errorNoSeasons')); NProgress.done(); resetButton(); return;
                }

                let teamId = new URLSearchParams(window.location.search).get('tid');
                if (!teamId) {
                    try { teamId = new URLSearchParams(seasonTabs.first().attr('href').split('?')[1]).get('tid'); } catch (error) {}
                }
                if (!teamId) {
                    alert(getText('errorTeamId')); NProgress.done(); resetButton(); return;
                }

                const CACHE_KEY = 'mz_stats_summary_cache_v2';
                const allCaches = JSON.parse(await GM_getValue(CACHE_KEY, '{}'));
                const teamCache = allCaches[teamId] || {};
                const categoryCache = teamCache[activeCategoryKey] || [];
                const cachedSeasons = new Map(categoryCache.map(d => [d.season, d]));
                let hasChanges = false;

                for (let i = 0; i < seasonTabs.length; i++) {
                    const tab = $(seasonTabs[i]);
                    const season = tab.text().trim();
                    const existingData = cachedSeasons.get(season);

                    NProgress.set((i + 1) / seasonTabs.length);
                    button.find('.buttonClassMiddle span').text(getText('fetchingSeason', season, i + 1, seasonTabs.length));

                    // DÜZELTME: Sürekli taramayı önlemek için 'scanned' kontrolü eklendi.
                    // Veri boş olsa bile 'scanned: true' ise tekrar çekmez.
                    if (!existingData || !existingData.scanned) {
                        try {
                            const response = await GM.xmlHttpRequest({ method: "GET", url: tab.attr('href') });
                            const parsedData = { season, ...parseLeagueDataFromHtml(response.responseText) };
                            cachedSeasons.set(season, parsedData);
                            hasChanges = true;
                        } catch (error) {
                            console.error(`Sezon ${season} verisi alınamadı:`, error);
                        }
                    }
                }

                if (hasChanges) {
                    if (!allCaches[teamId]) allCaches[teamId] = {};
                    allCaches[teamId][activeCategoryKey] = Array.from(cachedSeasons.values());
                    await GM_setValue(CACHE_KEY, JSON.stringify(allCaches));
                }

                button.find('.buttonClassMiddle span').text(getText('generatingReport'));
                createAndShowModal(Array.from(cachedSeasons.values()), activeCategoryKey);
                NProgress.done();
                resetButton();
            }

            // Vurgulanan Değişiklikler BAŞLANGIÇ: Yeni Güncelleme Fonksiyonu
            async function handleUpdateCurrentTabClick(e) {
                e.preventDefault();
                const button = $('#stats-update-tab-btn');
                const originalText = button.find('.buttonClassMiddle span').text();
                const resetButton = () => button.find('.buttonClassMiddle span').text(originalText).css('pointer-events', 'auto').fadeTo('fast', 1);

                const activePanel = $('.statsTabs > .ui-tabs-panel:visible');
                const activeCategoryKey = $('.statsTabs > .ui-tabs-nav > li.ui-tabs-active > a').text().trim();
                const teamId = new URLSearchParams(window.location.search).get('tid');

                if (activePanel.length === 0 || !activeCategoryKey) { alert(getText('errorActiveTab')); return; }
                if (!teamId) { alert(getText('errorTeamId')); return; }

                // 1. Sekmedeki EN SON SEZON bilgisini bul.
                const seasonTabs = activePanel.find('.leagueStats > ul > li > a, .topScorers > ul > li > a, .topBadBoys > ul > li > a').first().closest('ul').find('a');
                if (seasonTabs.length === 0) { alert(getText('errorNoSeasons')); return; }

                // En son (en üstteki) sezonu al
                const lastSeasonElement = $(seasonTabs[0]);
                const lastSeason = lastSeasonElement.text().trim();

                // 2. Sadece bu sezonun önbelleğini temizle
                const CACHE_KEY = 'mz_stats_summary_cache_v2';
                const allCaches = JSON.parse(await GM_getValue(CACHE_KEY, '{}'));

                if (allCaches[teamId] && allCaches[teamId][activeCategoryKey]) {
                    const categoryCache = allCaches[teamId][activeCategoryKey];
                    // Sadece son sezonun verisini önbellekten kaldır
                    allCaches[teamId][activeCategoryKey] = categoryCache.filter(d => d.season !== lastSeason);
                    await GM_setValue(CACHE_KEY, JSON.stringify(allCaches));
                }

                showToastNotification(getText('tabCacheCleared', activeCategoryKey));

                // 3. Güncelleme (handleSummaryClick fonksiyonunu taklit et)
                button.find('.buttonClassMiddle span').text(getText('processing')).css('pointer-events', 'none').fadeTo('fast', 0.7);

                // handleSummaryClick'i çağırarak tarama işlemini başlat
                await handleSummaryClick(e);

                // İşlem bittikten sonra düğmeyi sıfırla
                resetButton();
            }

            function parseLeagueDataFromHtml(html) {
                const data = { scanned: true }; // Varsayılan olarak tarandı işareti ekle
                const tempDiv = $(`<div>${html}</div>`);
                const rowIndexToDataKeyMap = {
                    0: 'league', 1: 'points', 2: 'rank', 3: 'goalsFor',
                    4: 'goalsAgainst', 5: 'avgGoalsFor', 6: 'avgGoalsAgainst'
                };
                const rows = tempDiv.find('.hitlist tbody tr');

                if (rows.length > 0) {
                    rows.each(function(index) {
                        const key = rowIndexToDataKeyMap[index];
                        if (key) {
                            const value = $(this).find('td').eq(1).text().trim();
                            data[key] = value;
                        }
                    });
                } else {
                    // Eğer tablo satırı yoksa (takım oynamamışsa), boş değerler ata
                    data.league = '-';
                    data.points = '0';
                    data.rank = '-';
                }
                return data;
            }

            function createAndShowModal(data, categoryTitle) {
                $('#stats-summary-modal').remove();
                // Sadece lig verisi olanları göster, boşları grafikten/tablodan hariç tutabiliriz veya "-" gösterebiliriz
                data.sort((a, b) => parseFloat(b.season) - parseFloat(a.season));

                let tableRows = data.map(d => `<tr><td>${d.season}</td><td>${d.league || '-'}</td><td>${d.rank || '-'}</td><td>${d.points || '-'}</td><td>${d.goalsFor || '-'}</td><td>${d.goalsAgainst || '-'}</td><td>${d.avgGoalsFor || '-'}</td><td>${d.avgGoalsAgainst || '-'}</td></tr>`).join('');

                const modalHTML = `
            <div id="stats-summary-modal" class="stats-modal-overlay">
                <div class="stats-modal-content">
                    <div class="stats-modal-header"><h3>${categoryTitle} - ${getText('summaryTitle')}</h3><span class="stats-modal-close">×</span></div>
                    <div class="stats-modal-body">
                        <table class="stats-summary-table">
                            <thead>
                                <tr>
                                    <th>${getText('season')}</th>
                                    <th class="chartable-header active-metric" data-metric="level">${getText('league')}</th>
                                    <th class="chartable-header" data-metric="rank">${getText('rank')}</th>
                                    <th class="chartable-header" data-metric="points">${getText('points')}</th>
                                    <th class="chartable-header" data-metric="goalsFor">${getText('goalsFor')}</th>
                                    <th class="chartable-header" data-metric="goalsAgainst">${getText('goalsAgainst')}</th>
                                    <th class="chartable-header" data-metric="avgGoalsFor">${getText('avgGoalsFor')}</th>
                                    <th class="chartable-header" data-metric="avgGoalsAgainst">${getText('avgGoalsAgainst')}</th>
                                </tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                        <div id="stats-history-chart-container"></div>
                    </div>
                </div>
            </div>`;
                $('body').append(modalHTML);
                renderHistoryChart(data, 'level');
                const modal = $('#stats-summary-modal');
                modal.css('display', 'flex');
                modal.find('.stats-modal-close').on('click', () => modal.remove());
                modal.on('click', '.chartable-header', function() {
                    const metric = $(this).data('metric');
                    modal.find('.chartable-header').removeClass('active-metric');
                    $(this).addClass('active-metric');
                    renderHistoryChart(data, metric);
                });
            }

            function parseLeagueLevel(leagueName) {
                if (!leagueName || typeof leagueName !== 'string' || leagueName.toLowerCase().includes('hata!') || leagueName === '-') return null;
                const match = leagueName.toLowerCase().match(/div(\d+)\.(\d+)/);
                if (match) return parseInt(match[1], 10) + 1;
                if (/dünya ligi|world league/i.test(leagueName)) return 1;
                return 1;
            }

            function renderHistoryChart(data, metric) {
                const metricConfig = {
                    level: { key: 'league', yAxisTitle: getText('yAxisTitleLeague'), reversed: true, parser: parseLeagueLevel, name: getText('league') },
                    rank: { key: 'rank', yAxisTitle: getText('rank'), reversed: true, parser: s => parseFloat(s), name: getText('rank') },
                    points: { key: 'points', yAxisTitle: getText('points'), reversed: false, parser: s => parseFloat(s), name: getText('points') },
                    goalsFor: { key: 'goalsFor', yAxisTitle: getText('goalsFor'), reversed: false, parser: s => parseFloat(s), name: getText('goalsFor') },
                    goalsAgainst: { key: 'goalsAgainst', yAxisTitle: getText('goalsAgainst'), reversed: false, parser: s => parseFloat(s), name: getText('goalsAgainst') },
                    avgGoalsFor: { key: 'avgGoalsFor', yAxisTitle: getText('avgGoalsFor'), reversed: false, parser: s => parseFloat(s), name: getText('avgGoalsFor') },
                    avgGoalsAgainst: { key: 'avgGoalsAgainst', yAxisTitle: getText('avgGoalsAgainst'), reversed: false, parser: s => parseFloat(s), name: getText('avgGoalsAgainst') }
                };

                const config = metricConfig[metric];
                if (!config) return;

                const chartData = data
                .map(d => ({
                    season: parseFloat(d.season),
                    y: config.parser(d[config.key]),
                    originalValue: d[config.key]
                }))
                .filter(d => d.y !== null && !isNaN(d.y))
                .sort((a, b) => a.season - b.season);

                if (chartData.length === 0) {
                    $('#stats-history-chart-container').html(`<div style="text-align:center; padding-top:50px;">Grafik için veri bulunamadı.</div>`);
                    return;
                }

                const total = chartData.reduce((sum, point) => sum + point.y, 0);
                const average = chartData.length > 0 ? total / chartData.length : 0;

                unsafeWindow.Highcharts.chart('stats-history-chart-container', {
                    chart: { type: 'line' },
                    title: { text: getText('chartTitle', config.name) },
                    xAxis: { title: { text: getText('season') }, categories: chartData.map(d => d.season.toString()) },
                    yAxis: {
                        title: { text: config.yAxisTitle },
                        reversed: config.reversed,
                        plotLines: [{ value: average, color: '#d9534f', dashStyle: 'shortdash', width: 2, 'zIndex': 5, label: { useHTML: true, formatter: function() { return `<div style="background-color: rgba(217, 83, 79, 0.9); color: white; padding: 3px 6px; border-radius: 4px; font-weight: bold; font-size: 11px; box-shadow: 0 1px 3px rgba(0,0,0,0.4); text-shadow: none;">${getText('average')}: ${average.toFixed(2)}</div>`; }, align: 'right', x: -5, y: -7 } }]
                    },
                    tooltip: { formatter: function() { const pointData = chartData.find(d => d.season.toString() === this.x); return `<b>${getText('season')} ${this.x}</b><br/>${config.name}: <b>${pointData.originalValue}</b>`; } },
                    legend: { enabled: false },
                    series: [{ name: config.name, data: chartData.map(d => d.y), marker: { enabled: true, radius: 4 }, dataLabels: { enabled: true, formatter: function() { const pointData = chartData.find(d => d.season.toString() === this.x); return pointData ? pointData.originalValue : ''; }, style: { fontSize: '10px', fontWeight: 'bold', color: 'gray', textOutline: '1px white' } } }]
                });
            }

            function init() {
                if ($('.statsTabs').length) {
                    injectStyles();
                    addSummaryButton();
                }
            }
            $(document).ready(init);
        }

        /****************************************************************************************
     *                                                                                      *
     *  BÖLÜM EK: GHOST ROBOT - DURAN TOP KOPYALAYICI (Çoklu Dil)                           *
     *                                                                                      *
     ****************************************************************************************/
        function initializeGhostRobotScript() {
            'use strict';
            const $ = unsafeWindow.jQuery;

            // --- Dil Desteği ---
            const i18n = {
                tr: {
                    btnTitle: "Duran Toplar A Taktiğini Kopyala",
                    logReady: "[MZ GHOST] Hazır.",
                    logStart: "--- İŞLEM BAŞLADI ---",
                    errorNoXML: "Kaynak XML alınamadı.",
                    errorNoPlayer: "Kaynak taktikte oyuncu bulunamadı.",
                    errorNoTarget: "Kopyalanacak başka taktik yok.",
                    confirmMsg: (tabName, count) => `"${tabName}" taktiğindeki sıralama alınıp, ${count} adet taktiğe kopyalanacak.\n\nİşlem bitene kadar bekleyin.\n\nBaşlasın mı?`,
                    successMsg: "İŞLEM BAŞARILI!\n\nLütfen aşağıdaki 'HEPSİNİ KAYDET' butonuna basarak işlemi bitirin.",
                    processing: "İşleniyor..."
                },
                en: {
                    btnTitle: "Copy Set Pieces from Tactic A",
                    logReady: "[MZ GHOST] Ready.",
                    logStart: "--- PROCESS STARTED ---",
                    errorNoXML: "Source XML could not be retrieved.",
                    errorNoPlayer: "No players found in source tactic.",
                    errorNoTarget: "No other tactics found to copy to.",
                    confirmMsg: (tabName, count) => `Set pieces from "${tabName}" will be copied to ${count} other tactics.\n\nPlease wait until the process finishes.\n\nStart?`,
                    successMsg: "PROCESS SUCCESSFUL!\n\nPlease click the 'SAVE ALL' button below to finish.",
                    processing: "Processing..."
                }
            };
            const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
            const getText = (key, ...args) => {
                const text = i18n[lang][key] || i18n['en'][key];
                return typeof text === 'function' ? text(...args) : text;
            };

            // Global değişkenler (Modül kapsamında)
            let sourceDataMap = {};
            let tacticsQueue = [];
            let popupKillerInterval = null;

            const waitForButton = setInterval(() => {
                const testBtn = $('#test_tactics_button');
                const container = testBtn.parent();

                if (container.length > 0 && $('#xml_ghost_btn').length === 0) {
                    clearInterval(waitForButton);
                    container.css('position', 'relative');

                    const btn = $(`<a href="#" id="xml_ghost_btn" class="mzbtn buttondiv button_account"
                    style="position: absolute; top: 28px; right: 0px; width: auto; background-color: #1b5e20; border: 1px solid #66bb6a; z-index: 999;">
                    <span class="buttonClassMiddle" style="color: white; font-weight: bold;">
                        <span style="white-space: nowrap">${getText('btnTitle')}</span>
                    </span>
                    <span class="buttonClassRight">&nbsp;</span>
                </a>`);

                    btn.on('click', function(e) {
                        e.preventDefault();
                        startGhostProcess();
                    });

                    container.append(btn);
                    console.log(getText('logReady'));
                }
            }, 1000);

            function startPopupKiller() {
                if (popupKillerInterval) clearInterval(popupKillerInterval);
                popupKillerInterval = setInterval(() => {
                    const powerboxBtn = $('#powerbox_confirm_ok_button');
                    if (powerboxBtn.length > 0 && powerboxBtn.is(':visible')) {
                        powerboxBtn[0].click();
                    }
                    const dialogs = $('.ui-dialog:visible');
                    dialogs.each(function() {
                        const text = $(this).text();
                        // Evrensel kontrol: Türkçe, İngilizce veya genel "Tamam/OK"
                        if (text.includes("başarı ile eklendi") || text.includes("successfully added") || text.includes("Tamam") || text.includes("OK")) {
                            const okBtn = $(this).find('.ui-dialog-buttonpane button');
                            if (okBtn.length > 0) okBtn.click();
                        }
                    });
                }, 200);
            }

            function stopPopupKiller() {
                if (popupKillerInterval) clearInterval(popupKillerInterval);
            }

            async function startGhostProcess() {
                try {
                    console.clear();
                    console.log(getText('logStart'));

                    const editor = unsafeWindow.teamTactic.editor;
                    const textArea = $('#importExportData');

                    $('#importExportTacticsWindow').css({ 'opacity': '0.01', 'pointer-events': 'none' });

                    if (!$('#importExportTacticsWindow').is(':visible')) {
                        unsafeWindow.toggleImportExportWindow();
                    }

                    textArea.val('');
                    editor.exportTactic();
                    await wait(300);

                    const sourceXML = textArea.val();
                    if (!sourceXML) {
                        alert(getText('errorNoXML'));
                        restoreUI();
                        return;
                    }

                    sourceDataMap = parseXMLToMap(sourceXML);
                    if (Object.keys(sourceDataMap).length === 0) {
                        alert(getText('errorNoPlayer'));
                        restoreUI();
                        return;
                    }

                    const mzData = unsafeWindow.teamTactic.tacticsData;
                    let allTactics = [];
                    if (mzData.TeamTactics && mzData.TeamTactics.Tactic) {
                        allTactics = mzData.TeamTactics.Tactic;
                    } else if (mzData.tactics && mzData.tactics.TeamTactics) {
                        allTactics = mzData.tactics.TeamTactics.Tactic;
                    }
                    if (!Array.isArray(allTactics)) allTactics = [allTactics];

                    const currentTabId = $('#current_tab').val();
                    const currentTabName = $(`#tacticTab_${currentTabId} span`).text();

                    tacticsQueue = allTactics
                        .filter(t => t['@attributes'].name !== currentTabId && t.TacticPlayer)
                        .map(t => t['@attributes'].name);

                    if (tacticsQueue.length === 0) {
                        alert(getText('errorNoTarget'));
                        restoreUI();
                        return;
                    }

                    if(!confirm(getText('confirmMsg', currentTabName, tacticsQueue.length))) {
                        restoreUI();
                        return;
                    }

                    startPopupKiller();
                    processNextTactic();

                } catch (err) {
                    console.error(err);
                    alert("Error: " + err.message);
                    stopPopupKiller();
                    restoreUI();
                }
            }

            async function processNextTactic() {
                if (tacticsQueue.length === 0) {
                    finishProcess();
                    return;
                }
                const tabId = tacticsQueue.shift();
                try {
                    const textArea = $('#importExportData');
                    const editor = unsafeWindow.teamTactic.editor;

                    unsafeWindow.changeTacticTab(tabId);
                    await wait(700);

                    textArea.val('');
                    editor.exportTactic();
                    await wait(200);

                    let targetXML = textArea.val();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(targetXML, "text/xml");

                    const positions = [];
                    const posNodes = xmlDoc.getElementsByTagName("Pos");
                    const subNodes = xmlDoc.getElementsByTagName("Sub");
                    for(let i=0; i<posNodes.length; i++) positions.push(posNodes[i]);
                    for(let i=0; i<subNodes.length; i++) positions.push(subNodes[i]);

                    let hasChanges = false;
                    for (let i = 0; i < positions.length; i++) {
                        const node = positions[i];
                        const pid = node.getAttribute("pid");
                        if (sourceDataMap[pid]) {
                            const sourceInfo = sourceDataMap[pid];
                            if (sourceInfo.pt && node.getAttribute("pt") !== sourceInfo.pt) {
                                node.setAttribute("pt", sourceInfo.pt);
                                hasChanges = true;
                            }
                            if (sourceInfo.fk && node.getAttribute("fk") !== sourceInfo.fk) {
                                node.setAttribute("fk", sourceInfo.fk);
                                hasChanges = true;
                            }
                        }
                    }

                    if (hasChanges) {
                        const serializer = new XMLSerializer();
                        const modifiedXML = serializer.serializeToString(xmlDoc);
                        textArea.val(modifiedXML);
                        editor.importTactic();
                        await wait(600);
                    }
                    processNextTactic();
                } catch (err) {
                    console.error(`Tactic ${tabId} error:`, err);
                    processNextTactic();
                }
            }

            function finishProcess() {
                stopPopupKiller();
                restoreUI();
                unsafeWindow.toggleImportExportWindow();
                $('#save_all').val('1');
                alert(getText('successMsg'));
                const saveBtn = $('#saveallb');
                $('html, body').animate({ scrollTop: saveBtn.offset().top }, 500);
                saveBtn.css({'border': '5px solid red', 'transform': 'scale(1.2)', 'transition': '0.5s'});
            }

            function restoreUI() {
                $('#importExportTacticsWindow').css({'opacity': '1', 'pointer-events': 'auto'});
            }

            function parseXMLToMap(xmlString) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, "text/xml");
                const map = {};
                const positions = [];
                const posNodes = xmlDoc.getElementsByTagName("Pos");
                const subNodes = xmlDoc.getElementsByTagName("Sub");
                for(let i=0; i<posNodes.length; i++) positions.push(posNodes[i]);
                for(let i=0; i<subNodes.length; i++) positions.push(subNodes[i]);

                for (let i = 0; i < positions.length; i++) {
                    const node = positions[i];
                    const pid = node.getAttribute("pid");
                    const pt = node.getAttribute("pt");
                    const fk = node.getAttribute("fk");
                    if (pid) {
                        map[pid] = {};
                        if (pt) map[pid].pt = pt;
                        if (fk) map[pid].fk = fk;
                    }
                }
                return map;
            }

            function wait(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }

        /****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 8: GENEL BİLGİ MENÜSÜ ve AYARLAR MODALI (GÖRÜNÜM DÜZELTİLDİ - FINAL + MOBİL)    *
 *                                                                                      *
 ****************************************************************************************/
        function initializeGlobalInfoMenu() {
            'use strict';
            const $ = unsafeWindow.jQuery;

            // --- Dil Desteği (i18n) ---
            const i18n = {
                tr: {
                    menuTitle: "Betik Özellikleri",
                    leagueTitle: "Gelişmiş Puan Tablosu",
                    leagueDesc: "Canlı skorlar, fikstür zorluğu ve ELO puanları.",
                    playersTitle: "Oyuncu İstatistikleri",
                    playersDesc: "Oyuncularınızın maç istatistiklerini toplayın ve analiz edin.",
                    shortlistTitle: "Gelişmiş Takip Listesi",
                    shortlistDesc: "Transfer geçmişini takip edin.",
                    statisticsTitle: "Sezon Özeti Grafikleri",
                    statisticsDesc: "Takımınızın geçmiş performansını grafiklerle görün.",
                    fixtureToolsTitle: "Rakiplerin Geçmiş Maçlarını Analiz Edin",
                    fixtureToolsDesc: "Fikstürdeki takımların ELO puanlarını görüntüleyin.",
                    resultsToolsTitle: "Gelişmiş Maç Bulucu",
                    resultsToolsDesc: "Rakip takımların geçmiş maçlarını ve taktiklerini bulun.",
                    rankingTweaksTitle: "Menajer Sıralaması Geliştirmeleri",
                    rankingTweaksDesc: "Sıralama sayfasından hızlıca gözlemci maçı teklif edin.",
                    sendMessageToAuthor: "Betik yazarına mesaj gönder",
                    dragToMove: "Taşımak için basılı tutup sürükleyin.",
                    retireWarning: "Emeklilik Göstergesi",
                    maxedBallTitle: "Tıkalı Yetenek (Kırmızı Top)",
                    // --- EKLENTİLER ---
                    fixturePageEloName: "Fikstür Sayfası ELO",
                    matchFinderName: "Gelişmiş Maç Bulucu",
                    transferScoutFilterTitle: "Transfer Gözlemci Filtresi",
                    transferScoutFilterDesc: "Transfer listesini Yüksek/Düşük Potansiyel yıldızlarına göre filtreleyin.",
                    messengerToolsTitle: "Messenger Toplu Silme",
                    ghostRobotTitle: "Taktik: Otomatik Kopyalama",
                    ghostRobotDesc: "Duran toplardaki penaltı ve frikik atan oyuncuları bir taktikten diğerlerine otomatik kopyalayın.",
                    // ------------------
                    friendlyMatchAutoTitle: "Hazırlık Maçı Otomasyonu",
                    friendlyMatchAutoDesc: "Belirlenen rakiplere günlük, otomatik hazırlık maçı teklifleri gönderin.",

                    settings: "Ayarlar",
                    featureSettingsTitle: "Özellik Ayarları",
                    saveSettings: "Ayarları Kaydet",
                    reloadToApply: "Değişikliklerin geçerli olması için sayfanın yeniden yüklenmesi gerekebilir.",
                    selectAll: "Tümünü Seç",
                    linkEnhancementsTitle: "Link İyileştirmeleri",
                    linkEnhancementsDesc: "Lig sayfalarındaki takım linklerini düzeltir ve genç maçlarına eksik lig linkini ekler.",
                    deselectAll: "Tümünü Kaldır"
                },
                en: {
                    menuTitle: "Script Features",
                    leagueTitle: "Advanced League Table",
                    leagueDesc: "Live scores, fixture difficulty, and ELO ratings.",
                    playersTitle: "Player Statistics",
                    playersDesc: "Collect and analyze your players' match statistics.",
                    shortlistTitle: "Advanced Shortlist",
                    shortlistDesc: "Track transfer history.",
                    statisticsTitle: "Season Summary Charts",
                    statisticsDesc: "Visualize your team's past performance with charts.",
                    fixtureToolsTitle: "Analyze Opponents' Past Matches",
                    fixtureToolsDesc: "View ELO scores for teams in the fixture list.",
                    resultsToolsTitle: "Advanced Match Finder",
                    resultsToolsDesc: "Find past matches and tactics of opponent teams.",
                    rankingTweaksTitle: "Manager Ranking Improvements",
                    rankingTweaksDesc: "Quickly propose an observer match from the ranking page.",
                    sendMessageToAuthor: "Send a message to the author",
                    dragToMove: "Press and drag to move.",
                    retireWarning: "Retirement Indicator",
                    maxedBallTitle: "Maxed Skill (Red Ball)",
                    // --- MISSING KEYS ---
                    fixturePageEloName: "Fixture Page ELO",
                    matchFinderName: "Advanced Match Finder",
                    transferScoutFilterTitle: "Transfer Scout Filter",
                    transferScoutFilterDesc: "Filter transfer list by High/Low Potential stars.",
                    messengerToolsTitle: "Messenger Bulk Delete",
                    ghostRobotTitle: "Tactics: Automatic Copy",
                    ghostRobotDesc: "Automatically copy players who take penalties and free kicks from one tactic to another.",
                    // --------------------
                    friendlyMatchAutoTitle: "Friendly Match Automation",
                    friendlyMatchAutoDesc: "Send daily, automated friendly match offers to selected opponents.",

                    settings: "Settings",
                    featureSettingsTitle: "Feature Settings",
                    saveSettings: "Save Settings",
                    reloadToApply: "A page reload may be required for changes to take effect.",
                    selectAll: "Select All",
                    linkEnhancementsTitle: "Link Enhancements",
                    linkEnhancementsDesc: "Fixes team links on league pages and adds missing league links to youth matches.",
                    deselectAll: "Deselect All"
                }
            };
            const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
            const getText = (key) => i18n[lang][key] || i18n['en'][key];

            // Menü Linkleri
            const featurePages = [
                { url: "/?p=league", titleKey: "leagueTitle", descKey: "leagueDesc" },
                { url: "/?p=statistics", titleKey: "statisticsTitle", descKey: "statisticsDesc" },
                { url: "/?p=shortlist", titleKey: "shortlistTitle", descKey: "shortlistDesc" },
                { url: "/?p=players", titleKey: "playersTitle", descKey: "playersDesc" },
                // 👇 YENİ MODÜL LİNKİ BURADA
                { url: "/?p=challenges", titleKey: "friendlyMatchAutoTitle", descKey: "friendlyMatchAutoDesc" },
                // 👇 DİĞER LİNKLER
                { url: "/?p=match&sub=scheduled", titleKey: "fixtureToolsTitle", descKey: "fixtureToolsDesc" },
                { url: "/?p=match&sub=played", titleKey: "resultsToolsTitle", descKey: "resultsToolsDesc" },
                { url: "/?p=rank&sub=userrank", titleKey: "rankingTweaksTitle", descKey: "rankingTweaksDesc" },
                { url: "/?p=tactics", titleKey: "ghostRobotTitle", descKey: "ghostRobotDesc" },
                { url: "/?p=league", titleKey: "linkEnhancementsTitle", descKey: "linkEnhancementsDesc" }
            ];

            const POSITION_KEY = 'mz_global_info_btn_position';

            // --- Gerekli Stiller (CSS) - DÜZELTİLDİ + MOBİL KÜÇÜLTME ---
            GM_addStyle(`
        /* Ana Buton */
        #mz-global-info-btn {
            position: fixed; bottom: 350px; right: 2px;
            width: 45px; height: 45px;
            background-color: #00529B; color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; font-weight: bold; font-family: 'Georgia', serif;
            cursor: grab; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 99998;
            transition: transform 0.2s ease-in-out, background-color 0.2s, width 0.3s, right 0.3s, opacity 0.3s;
            border: 2px solid white; user-select: none;
        }
        #mz-global-info-btn:hover { transform: scale(1.1); background-color: #0066c2; }
        #mz-global-info-btn.is-dragging { cursor: grabbing !important; transform: scale(1.15); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }

        /* MOBİL İÇİN KÜÇÜLTME BUTONU VE STİLLERİ */
        #mz-mobile-toggle-btn {
            display: none; /* Masaüstünde gizli */
            position: absolute;
            top: -5px;
            left: -5px;
            width: 20px;
            height: 20px;
            background: #ffc107;
            color: #000;
            border-radius: 50%;
            font-size: 16px;
            line-height: 18px;
            text-align: center;
            cursor: pointer;
            z-index: 99999;
            border: 2px solid #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
            font-weight: bold;
        }

        @media (max-width: 768px) {
            #mz-mobile-toggle-btn {
                display: block; /* Mobilde göster */
            }

            /* Küçültülmüş Hal - Sağ kenara yapışık */
            #mz-global-info-btn.mz-minimized {
                width: 20px !important;
                height: 40px !important;
                right: 0 !important; /* Sağa yapış */
                left: auto !important; /* Sol konumu sıfırla */
                border-radius: 10px 0 0 10px !important;
                opacity: 0.4;
                font-size: 0 !important; /* İ harfini gizle */
                background-color: #00529B !important;
                transform: none !important; /* Drag efektini sıfırla */
                cursor: pointer;
            }

            /* Küçültülmüş haldeyken toggle butonu */
            #mz-global-info-btn.mz-minimized #mz-mobile-toggle-btn {
                display: none; /* Küçüldüğünde toggle butonunu gizle, ana butona tıklamak açacak */
            }

            /* Küçültülmüş haldeyken içine ok işareti koy */
            #mz-global-info-btn.mz-minimized::after {
                content: '«';
                font-size: 20px;
                color: white;
                line-height: 40px;
                margin-left: 2px;
                font-weight: bold;
            }
        }

        /* Bilgi Paneli */
        #mz-global-info-panel {
            position: fixed; width: 340px;
            background-color: #f8f9fa; border: 1px solid #ccc; border-radius: 8px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.3); z-index: 99999;
            opacity: 0; transform: translateY(10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none; font-family: Dosis, sans-serif;
            display: flex; flex-direction: column;
            max-height: 85vh;
        }
        #mz-global-info-panel.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }

        /* Header */
        .mz-gip-header {
            padding: 15px; font-size: 16px; font-weight: bold; color: #fff;
            background-color: #343a40; border-radius: 8px 8px 0 0;
            border-bottom: 1px solid #4a4a4a; position: relative; flex-shrink: 0;
        }

        /* Liste (Scroll Sorunu Düzeltildi) */
        .mz-gip-list {
            list-style: none; padding: 10px; margin: 0;
            overflow-y: auto; flex-grow: 1;
        }
        .mz-gip-list li { margin-bottom: 4px; }
        .mz-gip-list a {
            display: block; padding: 10px 12px; text-decoration: none;
            color: #212529; border-radius: 5px;
            transition: background-color 0.2s, color 0.2s; border: 1px solid transparent;
        }
        .mz-gip-list a:hover { background-color: #e9ecef; color: #0056b3; border-color: #dee2e6; }

        /* Yazı Tipleri */
        .mz-gip-list strong { font-size: 14px; color: #00529B; display: block; margin-bottom: 3px; }
        .mz-gip-list p { font-size: 12px; margin: 0; color: #6c757d; line-height: 1.35; }

        /* Yazar Linki */
        .author-link {
            text-decoration: none; cursor: pointer; color: inherit;
            transition: background-color 0.2s, color 0.2s; padding: 2px 4px;
            border-radius: 3px; margin: -2px -4px;
        }
        .author-link:hover { text-decoration: none !important; background-color: #ffc107; color: #212529 !important; }

        /* Ayarlar Modalı Stilleri */
        #mz-feature-settings-modal { display: none; position: fixed; z-index: 100000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); justify-content: center; align-items: center; }
        .mz-fs-content { background: #f8f9fa; padding: 20px; border-radius: 8px; width: 90%; max-width: 550px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .mz-fs-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; padding-bottom: 10px; margin-bottom: 15px; }
        .mz-fs-header h3 { margin: 0; font-size: 18px; } .mz-fs-close { font-size: 24px; font-weight: bold; cursor: pointer; color: #888; }
        .mz-fs-controls { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #eee; }
        .mz-fs-controls a { font-size: 12px; color: #007bff; text-decoration: none; font-weight: bold; } .mz-fs-controls a:hover { text-decoration: underline; }
        .mz-fs-body { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .mz-fs-label { display: flex; align-items: center; gap: 8px; background: #f0f0f0; padding: 8px; border-radius: 4px; cursor: pointer; border: 1px solid #ddd; }
        .mz-fs-footer { text-align: center; border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 15px; }
    `);

            // --- Fonksiyonlar ---
            function createFeatureSettingsModal() {
                if ($('#mz-feature-settings-modal').length > 0) return;
                let checkboxesHTML = '';

                for (const key in MODULES) {
                    let rawName = getText(MODULES[key].nameKey);
                    if (!rawName) {
                        console.warn(`[MZone] Çeviri bulunamadı: ${MODULES[key].nameKey}`);
                        rawName = `[${MODULES[key].nameKey}]`;
                    }
                    const moduleName = rawName.replace(/<[^>]*>?/gm, '');
                    checkboxesHTML += `<label class="mz-fs-label"><input type="checkbox" id="setting-${key}" data-key="${key}"><span>${moduleName}</span></label>`;
                }

                const modalHTML = `<div id="mz-feature-settings-modal"><div class="mz-fs-content"><div class="mz-fs-header"><h3>${getText('featureSettingsTitle')}</h3><span class="mz-fs-close">×</span></div><div class="mz-fs-controls"><a href="#" id="mz-fs-select-all">${getText('selectAll')}</a><a href="#" id="mz-fs-deselect-all">${getText('deselectAll')}</a></div><div class="mz-fs-body">${checkboxesHTML}</div><div class="mz-fs-footer"><button id="mz-save-feature-settings" class="mz-script-button" style="background-color: #28a745;">${getText('saveSettings')}</button><p style="font-size: 11px; color: #6c757d; margin-top: 10px;">${getText('reloadToApply')}</p></div></div></div>`;
                $('body').append(modalHTML);
                $('#mz-feature-settings-modal .mz-fs-close').on('click', () => $('#mz-feature-settings-modal').hide());
                $('#mz-save-feature-settings').on('click', saveAndCloseFeatureSettings);
                $('#mz-fs-select-all').on('click', (e) => { e.preventDefault(); $('#mz-feature-settings-modal .mz-fs-body input[type="checkbox"]').prop('checked', true); });
                $('#mz-fs-deselect-all').on('click', (e) => { e.preventDefault(); $('#mz-feature-settings-modal .mz-fs-body input[type="checkbox"]').prop('checked', false); });
            }

            async function openFeatureSettingsModal() {
                const modal = $('#mz-feature-settings-modal');
                for (const key in MODULES) {
                    modal.find(`#setting-${key}`).prop('checked', scriptSettings[key]);
                }
                modal.css('display', 'flex');
            }

            async function saveAndCloseFeatureSettings() {
                for (const key in MODULES) {
                    scriptSettings[key] = $(`#setting-${key}`).is(':checked');
                }
                await GM_setValue(MODULE_SETTINGS_KEY, JSON.stringify(scriptSettings));
                $('#mz-feature-settings-modal').hide();
                alert('Ayarlar kaydedildi. Değişikliklerin geçerli olması için sayfayı yenilemeniz gerekebilir.');
            }

            async function createMenu() {
                if ($('#mz-global-info-btn').length > 0) return;

                // 1. Önce Butonu Oluştur - MOBİL TOGGLE DAHİL
                const infoButton = $(`<div id="mz-global-info-btn" title="${getText('menuTitle')}\n${getText('dragToMove')}">i<div id="mz-mobile-toggle-btn">-</div></div>`);
                const infoPanel = $('<div id="mz-global-info-panel"></div>');

                // 2. Panel İçeriğini Hazırla
                const baseTitle = getText('menuTitle');
                const scriptAuthor = GM_info.script.author;
                const hardcodedTeamName = "☆TC☆ NiCoTiN ☆TC☆";
                const scriptNameToDisplay = (lang === 'tr') ? "MZone Gelişmiş: Tablo, İstatistik & Play-off" : "MZone Advanced: Table, Stats & Play-off";
                const authorLineHtml = `<a href="#" id="author-message-link" class="author-link" title="${getText('sendMessageToAuthor')}">by ${scriptAuthor} (${hardcodedTeamName})</a>`;
                const fullHeaderHtml = `${baseTitle}<br><small style="font-weight: normal; font-size: 0.75em; opacity: 0.85; line-height: 1.4;">${scriptNameToDisplay}<br>${authorLineHtml}</small>`;
                const settingsButtonHtml = `<span id="mz-open-feature-settings" title="${getText('settings')}" style="position: absolute; top: 10px; right: 12px; font-size: 20px; cursor: pointer; transition: transform 0.2s;">⚙️</span>`;
                let listItems = featurePages.map(page => {
                    const urlParams = new URLSearchParams(page.url.split('?')[1]);
                    let moduleKey = '';
                    if (page.url.includes('p=league')) moduleKey = 'leagueTable';
                    else if (page.url.includes('p=statistics')) moduleKey = 'statisticsSummary';
                    else if (page.url.includes('p=shortlist')) moduleKey = 'shortlistFilter';
                    else if (page.url.includes('p=players')) moduleKey = 'playerStats';
                    else if (page.url.includes('p=challenges')) moduleKey = 'friendlyMatchAuto';
                    else if (page.url.includes('p=tactics')) moduleKey = 'ghostRobot';

                    if (moduleKey && scriptSettings[moduleKey] === false) {
                        return '';
                    }
                    return `<li><a href="${page.url}"><strong>${getText(page.titleKey)}</strong><p>${getText(page.descKey)}</p></a></li>`;
                }).join('');

                infoPanel.html(`<div class="mz-gip-header">${fullHeaderHtml}${settingsButtonHtml}</div><ul class="mz-gip-list">${listItems}</ul>`);

                // 3. Konumlandırma
                try {
                    const savedPosition = JSON.parse(await GM_getValue(POSITION_KEY, 'null'));
                    if (savedPosition && savedPosition.top !== undefined && savedPosition.left !== undefined) {
                        let topVal = parseInt(savedPosition.top);
                        let leftVal = parseInt(savedPosition.left);
                        const winHeight = $(window).height();
                        const winWidth = $(window).width();

                        if (!isNaN(topVal) && !isNaN(leftVal) && topVal >= 0 && topVal < winHeight && leftVal >= 0 && leftVal < winWidth) {
                            infoButton.css({ top: savedPosition.top, left: savedPosition.left, bottom: 'auto', right: 'auto' });
                        }
                    }
                } catch (e) {
                    console.error("Konum yüklenirken hata oluştu:", e);
                }

                $('body').append(infoButton).append(infoPanel);

                // MOBİL TOGGLE İÇİN EVENT
                infoButton.find('#mz-mobile-toggle-btn').on('click', function(e) {
                    e.stopPropagation(); // Butonun sürüklenmesini veya menü açmasını engelle
                    $('#mz-global-info-btn').addClass('mz-minimized');
                    $('#mz-global-info-panel').removeClass('visible'); // Menü açıksa kapat
                });

                // Küçültülmüş butona tıklayınca geri açma
                infoButton.on('click', function(e) {
                    if ($(this).hasClass('mz-minimized')) {
                        e.stopPropagation(); // Menünün hemen açılmasını engelle, önce boyutu düzelt
                        $(this).removeClass('mz-minimized');
                    }
                });
            }

            function makeButtonInteractive() {
                const button = $('#mz-global-info-btn'); let isDragging = false; let hasMoved = false; let startX, startY, offsetX, offsetY;
                button.on('mousedown touchstart', function(e) {
                    // Eğer küçültülmüşse sürüklemeyi engelle
                    if(button.hasClass('mz-minimized')) return;

                    const evt = e.type === 'touchstart' ? e.originalEvent.touches[0] : e;
                    if (e.type === 'mousedown' && e.which !== 1) return;
                    // e.preventDefault(); // Touch scrollu engellememesi için mobilde dikkatli kullanılmalı
                    if(e.type === 'mousedown') e.preventDefault();

                    startX = evt.clientX; startY = evt.clientY;
                    const buttonPos = button.offset();
                    offsetX = evt.clientX - buttonPos.left;
                    offsetY = evt.clientY - buttonPos.top;

                    if(e.type === 'touchstart') {
                        $(document).on('touchmove.interactive', onMouseMove);
                        $(document).on('touchend.interactive', onMouseUp);
                    } else {
                        $(document).on('mousemove.interactive', onMouseMove);
                        $(document).on('mouseup.interactive', onMouseUp);
                    }
                });

                function onMouseMove(e) {
                    const evt = e.type === 'touchmove' ? e.originalEvent.touches[0] : e;
                    if (!isDragging) {
                        const moveThreshold = 5;
                        if (Math.abs(evt.clientX - startX) > moveThreshold || Math.abs(evt.clientY - startY) > moveThreshold) {
                            isDragging = true; hasMoved = true; button.addClass('is-dragging');
                        }
                    }
                    if (isDragging) {
                        if(e.type === 'touchmove') e.preventDefault(); // Sürüklerken sayfa kaymasını engelle
                        updatePosition(evt);
                    }
                }

                function updatePosition(e) {
                    let newLeft = e.clientX - offsetX; let newTop = e.clientY - offsetY;
                    const buttonWidth = button.outerWidth(); const buttonHeight = button.outerHeight();
                    const windowWidth = $(window).width(); const windowHeight = $(window).height();
                    newLeft = Math.max(0, Math.min(newLeft, windowWidth - buttonWidth));
                    newTop = Math.max(0, Math.min(newTop, windowHeight - buttonHeight));
                    button.css({ top: newTop, left: newLeft, bottom: 'auto', right: 'auto' });
                }

                async function onMouseUp(e) {
                    $(document).off('mousemove.interactive mouseup.interactive touchmove.interactive touchend.interactive');
                    if (isDragging) {
                        const finalPosition = { top: button.css('top'), left: button.css('left') };
                        await GM_setValue(POSITION_KEY, JSON.stringify(finalPosition));
                    }
                    if (!hasMoved && !button.hasClass('mz-minimized')) {
                        // Eğer buton minimize değilse ve sürüklenmediyse menüyü aç/kapat
                        // Tıklanan yer toggle butonu değilse (zaten yukarıda stopPropagation var ama garanti olsun)
                        if(!$(e.target).is('#mz-mobile-toggle-btn')) {
                            positionPanelRelativeToButton();
                            $('#mz-global-info-panel').toggleClass('visible');
                        }
                    }
                    isDragging = false; hasMoved = false; button.removeClass('is-dragging');
                }
            }

            function positionPanelRelativeToButton() {
                const button = $('#mz-global-info-btn'); const panel = $('#mz-global-info-panel'); const margin = 10;
                panel.css({ visibility: 'hidden', display: 'block' }); const panelWidth = panel.outerWidth(); const panelHeight = panel.outerHeight(); panel.css({ visibility: '', display: '' });
                const buttonOffset = button.offset(); const buttonWidth = button.outerWidth(); const buttonHeight = button.outerHeight(); const windowWidth = $(window).width(); const windowHeight = $(window).height();
                const buttonCenterX = buttonOffset.left + buttonWidth / 2; const buttonCenterY = buttonOffset.top + buttonHeight / 2;
                let targetTop, targetLeft;

                // Dikey Konumlandırma
                if (buttonCenterY > windowHeight / 2) {
                    targetTop = buttonOffset.top - panelHeight - margin;
                } else {
                    targetTop = buttonOffset.top + buttonHeight + margin;
                }

                // Yatay Konumlandırma
                if (buttonCenterX > windowWidth / 2) {
                    targetLeft = buttonOffset.left + buttonWidth - panelWidth;
                } else {
                    targetLeft = buttonOffset.left;
                }

                // Ekran sınırlarını aşmasını engelle
                targetLeft = Math.max(margin, Math.min(targetLeft, windowWidth - panelWidth - margin));
                targetTop = Math.max(margin, Math.min(targetTop, windowHeight - panelHeight - margin));

                panel.css({ top: `${targetTop}px`, left: `${targetLeft}px`, bottom: 'auto', right: 'auto' });
            }

            // --- Başlatıcı ---
            $(document).ready(function() {
                createFeatureSettingsModal();
                createMenu().then(() => {
                    makeButtonInteractive();
                    $(document).on('click', '#mz-open-feature-settings', openFeatureSettingsModal);
                });
                $(document).on('click', '#author-message-link', function(e) { e.preventDefault(); const tempMessengerLink = $(`<a href="/?p=messenger&uid=3111770" class="messenger-link"></a>`); tempMessengerLink.css('display', 'none').appendTo('body'); tempMessengerLink[0].click(); tempMessengerLink.remove(); });
                $(document).on('click', function(e) {
                    const panel = $('#mz-global-info-panel');
                    const button = $('#mz-global-info-btn');
                    // Panel açıkken, panele veya butona tıklanmadıysa paneli kapat
                    if (!panel.is(e.target) && panel.has(e.target).length === 0 && !button.is(e.target) && button.has(e.target).length === 0) {
                        panel.removeClass('visible');
                    }
                });
            });
        }

        /****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 17: OYUNCU BECERİ RENKLENDİRME (Van Style Coloring) - NİHAİ SÜRÜM (v8)         *
 *                                                                                      *
 ****************************************************************************************/
function initializeSkillColoringScript() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    console.log('[MZ Skill Coloring] Modül Başlatıldı (Nihai Sürüm v8 - Panel Durumu Kayıtlı).');

    // ▼▼▼ YENİ EKLENEN KOD BAŞLANGICI ▼▼▼
    const PANEL_STATE_KEY = 'mz_scout_filter_panel_state';

    // Panel durumunu kaydetmek için helper fonksiyon
    function savePanelState(isOpen) {
        localStorage.setItem(PANEL_STATE_KEY, isOpen ? 'open' : 'closed');
    }

    // Panel durumunu okumak için helper fonksiyon
    function getSavedPanelState() {
        return localStorage.getItem(PANEL_STATE_KEY) === 'open';
    }
    // ▲▲▲ YENİ EKLENEN KOD SONU ▲▲▲


    // --- SABİTLER ---
    const PERSISTENT_CACHE_KEY = 'mz_scout_report_cache_v7';
    let persistentCache = {};
    let currentRosterPids = new Set();
    let isSyncing = false;

    // --- DİL DESTEĞİ (i18n) ---
    const i18n_scout = {
        tr: {
            filterTitle: "Oyuncu Filtresi",
            filterHP: "YP (Yüksek Potansiyel):",
            filterLP: "DP (Düşük Potansiyel):",
            filterTS: "AH (Ant. Hızı):",
            applyBtn: "Filtrele",
            filterCount: (visible, total) => `${visible} / ${total} Oyuncu Görüntüleniyor`,
            loadingStatus: (newCount) => newCount > 0 ? `Önbellek güncelleniyor: ${newCount} yeni oyuncu taranıyor...` : `Önbellek hazır.`,
            unscouted: "Gözlemlenmemiş",
            selectAll: "Tümünü Seç",
            deselectAll: "Tümünü Kaldır",
            btnRefreshCache: "Yenile (Tam Tarama)",
            alertRefreshConfirm: "Tüm oyuncu verilerinin önbelleği silinecek ve tüm oyuncular yeniden taranacaktır. Bu işlem biraz zaman alabilir. Emin misiniz?",
        },
        en: {
            filterTitle: "Player Filter (Fast)",
            filterHP: "HP (High Potential):",
            filterLP: "LP (Low Potential):",
            filterTS: "TS (Train Speed):",
            applyBtn: "Filter",
            filterCount: (visible, total) => `${visible} / ${total} Players Displayed`,
            loadingStatus: (newCount) => newCount > 0 ? `Cache updating: Scanning ${newCount} new players...` : `Cache ready.`,
            unscouted: "Unscouted",
            selectAll: "Select All",
            deselectAll: "Deselect All",
            btnRefreshCache: "Refresh Cache (Full Scan)",
            alertRefreshConfirm: "The cache for all player data will be deleted and all players will be rescanned. This may take some time. Are you sure?",
        }
    };
    const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
    const getText = (key, ...args) => { const t = i18n_scout[lang][key] || i18n_scout['en'][key]; return typeof t === 'function' ? t(...args) : t; };

    // --- CSS STİLLERİ ---
    GM_addStyle(`
        .gm_scout_h { font-weight: bold; }
        .gm_s1 { color: red !important; }
        .gm_s2 { color: darkgoldenrod !important; }
        .gm_s3 { color: blue !important; }
        .gm_s4 { color: fuchsia !important; }
        .skill_name_colored { transition: color 0.3s; }
        /* FİLTRE STİLLERİ */
        #mz-scout-filter-panel-wrapper { margin-top: 10px; margin-bottom: -1px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        #mz-scout-filter-toggle-btn { background: #007bff; color: white; padding: 5px 10px; font-weight: bold; font-size: 14px; cursor: pointer; border-radius: 4px 4px 0 0; text-align: center; user-select: none; transition: background 0.2s; }
        #mz-scout-filter-toggle-btn:hover { background: #0056b3; }
        #mz-scout-filter-panel { padding: 10px; background: #f8f9fa; border-top: 1px solid #ddd; border-radius: 0 0 5px 5px; display: flex; flex-direction: column; gap: 10px; }
        .mz-filter-group { display: flex; align-items: center; gap: 8px; border: 1px solid #ccc; padding: 5px 10px; border-radius: 4px; }
        .mz-filter-group label { font-size: 13px; cursor: pointer; user-select: none; }
        .mz-filter-group input[type="checkbox"] { margin-right: 2px; accent-color: #00529B; }
        #mz-filter-count { font-weight: bold; color: #00529B; font-size: 13px; }
        #mz-scout-filter-panel { margin-top: 10px; padding: 10px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center; justify-content: space-between; }
        #mz-filter-actions { display: flex; gap: 10px; margin-top: 10px; }
        .mz-action-link { font-size: 12px; color: #007bff; text-decoration: none; cursor: pointer; font-weight: bold; }
        .mz-action-link:hover { text-decoration: underline; }
        #mz-apply-filter-btn { display: none !important; }
        .mz-refresh-btn {
            padding: 4px 10px; background: #FF9800; color: white; border: none; border-radius: 4px;
            cursor: pointer; font-weight: bold; font-size: 11px; transition: background 0.2s;
        }
        .mz-refresh-btn:hover { background: #E68900; }
    `);

    // --- YARDIMCI FONKSİYONLAR ---
    function debounce(func, wait) { let timeout; return function(...args) { const context = this; clearTimeout(timeout); timeout = setTimeout(() => func.apply(context, args), wait); }; }
    async function saveCache() { await GM_setValue(PERSISTENT_CACHE_KEY, JSON.stringify(persistentCache)); }
    function getPid(container) { return container.find('.player_id_span').text().trim() || null; }

    /**
     * DOM'daki mevcut kadro ile önbelleği senkronize eder.
     */
    async function syncRosterAndCache() {
        if (isSyncing) return [];
        isSyncing = true;

        currentRosterPids.clear();
        $('.playerContainer').each(function() {
            const pid = getPid($(this));
            if (pid) currentRosterPids.add(pid);
        });

        try {
            persistentCache = JSON.parse(await GM_getValue(PERSISTENT_CACHE_KEY, '{}'));
        } catch(e) {
            persistentCache = {};
        }

        const stalePids = [];
        const newPids = [];

        for (const pid in persistentCache) {
            if (!currentRosterPids.has(pid)) {
                stalePids.push(pid);
                delete persistentCache[pid];
            }
        }
        if(stalePids.length > 0) console.log(`[MZ Skill Coloring] ${stalePids.length} giden oyuncu önbellekten silindi.`);

        currentRosterPids.forEach(pid => {
            if (!persistentCache.hasOwnProperty(pid)) {
                newPids.push(pid);
            }
        });

        await saveCache();
        isSyncing = false;
        return newPids;
    }

    /**
     * Oyuncu kartlarına renkleri ve potansiyel bilgisini uygular.
     */
    function applyColors(container, report) {
        let skillElements = container.find(".player-skills span.responsive-hide.responsive-container, td > span.clippable, td > span.skill_name span:first-child");
        if (skillElements.length === 0) {
            skillElements = container.find('td').filter(function(index) { return index >= 5 && index <= 15; }).find('span:first');
        }

        container.find('.gm_scout_h, .gm_s1, .gm_s2, .gm_s3, .gm_s4').each(function() {
             $(this).removeClass('gm_scout_h gm_s1 gm_s2 gm_s3 gm_s4 skill_name_colored');
        });

        skillElements.each(function() {
            const el = $(this);
            const skillName = el.text().trim();
            const parent = el.parent();

            // Yüksek Potansiyel Kontrolü
            if (report.hp.skills.includes(skillName)) {
                parent.addClass(`gm_scout_h gm_s${report.hp.stars}`);
                el.addClass(`gm_scout_h gm_s${report.hp.stars} skill_name_colored`);
            }
            // Düşük Potansiyel Kontrolü
            else if (report.lp.skills.includes(skillName)) {
                parent.addClass(`gm_s${report.lp.stars}`);
                el.addClass(`gm_s${report.lp.stars} skill_name_colored`);
            }
        });

        container.attr({
            'data-hp-stars': report.hp.stars,
            'data-lp-stars': report.lp.stars,
            'data-ts-stars': report.ts.stars,
            'data-unscouted': report.unscouted
        }).show();
    }

    /**
     * AJAX isteği ile tek bir oyuncu raporunu çeker.
     */
    function fetchSingleReport(pid) {
        return new Promise((resolve, reject) => {
            const url = `/ajax.php?p=players&sub=scout_report&pid=${pid}&sport=soccer`;
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const divs = doc.querySelectorAll("dd div.flex-grow-1");
                        const starSpans = doc.querySelectorAll("dd span.stars");
                        const countStars = (span) => span ? span.querySelectorAll(".lit").length : 0;
                        const extractSkills = (el) => Array.from(el.querySelectorAll(".blurred span")).map(s => s.textContent.trim()).filter(t => t !== "Trzxyvopaxis");

                        let hpSkills = [], lpSkills = [];
                        let hpStars = 0, lpStars = 0, tsStars = 0;
                        let unscouted = starSpans.length === 0;

                        if (divs.length >= 2) {
                            hpStars = countStars(starSpans[0]);
                            hpSkills = extractSkills(divs[0]);
                            lpStars = countStars(starSpans[1]);
                            lpSkills = extractSkills(divs[1]);
                            if(starSpans.length > 2) { tsStars = countStars(starSpans[2]); }
                        }

                        resolve({
                            pid: pid,
                            hp: { stars: hpStars, skills: hpSkills },
                            lp: { stars: lpStars, skills: lpSkills },
                            ts: { stars: tsStars },
                            unscouted: unscouted
                        });
                    } catch (e) { reject(e); }
                },
                onerror: reject
            });
        });
    }

    /**
     * Yeni oyuncuların raporlarını çeker ve önbelleği günceller.
     */
    async function fetchNewReports(newPids) {
        const statusEl = $('#mz-filter-count');
        if (newPids.length === 0) {
            statusEl.text(getText('loadingStatus', 0));
            return;
        }

        for (let i = 0; i < newPids.length; i++) {
            const pid = newPids[i];
            statusEl.text(getText('loadingStatus', newPids.length - i));
            try {
                const report = await fetchSingleReport(pid);
                persistentCache[pid] = report;
                await saveCache();
                const container = $(`.playerContainer:has(.player_id_span:contains('${pid}'))`);
                if (container.length) applyColors(container, report);
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                console.error(`[MZ Skill Coloring] Yeni oyuncu ${pid} için rapor çekilemedi.`, e);
            }
        }
        statusEl.text(getText('loadingStatus', 0));
    }


    /**
     * Filtre arayüzünü DOM'a ekler. (YP/AH 2★ eklendi, Panel Durumu Kaydı)
     */
    function addScoutFilterUI() {
        const target = $('.playerContainer h2.subheader').first().closest('.playerContainer');
        if (target.length === 0 || $('#mz-scout-filter-panel-wrapper').length > 0) return;

        const filterHTML = `
            <div id="mz-scout-filter-panel" style="padding: 10px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 0 0 5px 5px; display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: center; justify-content: space-between;">

                    <!-- YP FİLTRESİ (4★, 3★, 2★) -->
                    <div class="mz-filter-group" data-filter-type="hp">
                        <span style="font-weight: bold; color: #00529B;">${getText('filterHP')}</span>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="hp" data-star="4" checked> 4★</label>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="hp" data-star="3" checked> 3★</label>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="hp" data-star="2" checked> 2★</label>
                    </div>

                    <!-- DP FİLTRESİ -->
                    <div class="mz-filter-group" data-filter-type="lp">
                        <span style="font-weight: bold; color: #00529B;">${getText('filterLP')}</span>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="lp" data-star="2" checked> 2★</label>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="lp" data-star="1" checked> 1★</label>
                    </div>

                    <!-- AH FİLTRESİ (1★, 2★, 3★, 4★) -->
                    <div class="mz-filter-group" data-filter-type="ts">
                        <span style="font-weight: bold; color: #00529B;">${getText('filterTS')}</span>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="ts" data-star="4" checked> 4★</label>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="ts" data-star="3" checked> 3★</label>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="ts" data-star="2" checked> 2★</label>
                        <label><input type="checkbox" class="mz-scout-filter" data-filter-type="ts" data-star="1" checked> 1★</label>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #dee2e6; padding-top: 10px;">
                    <span id="mz-filter-count" style="font-weight: bold;">${getText('loadingStatus', 0)}</span>
                    <div id="mz-filter-actions">
                        <button id="mz-refresh-cache-btn" class="mz-refresh-btn">${getText('btnRefreshCache')}</button>
                        <a href="#" id="mz-select-all-filters" class="mz-action-link">${getText('selectAll')}</a>
                        <a href="#" id="mz-deselect-all-filters" class="mz-action-link">${getText('deselectAll')}</a>
                    </div>
                </div>

            </div>
        `;

        const wrapperHTML = `
            <div id="mz-scout-filter-panel-wrapper" style="margin-top: 10px; margin-bottom: -1px; border: 1px solid #ddd; border-bottom: none; border-radius: 5px 5px 0 0;">
                <div id="mz-scout-filter-toggle-btn" style="background: #007bff; color: white; padding: 5px 10px; font-weight: bold; font-size: 14px; cursor: pointer; border-radius: 4px 4px 0 0; text-align: center; user-select: none;">
                    🔍 ${getText('filterTitle')}
                </div>
                ${filterHTML}
            </div>
        `;

        target.before(wrapperHTML);
        $('#mz-scout-filter-panel').hide();

        // Olay Atamaları
        $('#mz-scout-filter-toggle-btn').on('click', (e) => {
            e.preventDefault();
            const panel = $('#mz-scout-filter-panel');
            panel.slideToggle(200, function() {
                // Kapatma/Açma işlemi bittikten sonra durumu kaydet
                savePanelState(panel.is(':visible'));
            });
            $('#mz-scout-filter-toggle-btn').css('background', panel.is(':visible') ? '#dc3545' : '#007bff');
        });

        const debouncedFilter = debounce(applyScoutFilters, 150);

        // Checkbox değişimi anında filtrelemeyi tetikle
        $('.mz-scout-filter').on('change', debouncedFilter);

        // ÖNBELLEK YENİLEME BUTONU OLAYI
        $('#mz-refresh-cache-btn').on('click', async (e) => {
            e.preventDefault();
            if (confirm(getText('alertRefreshConfirm'))) {
                await GM_deleteValue(PERSISTENT_CACHE_KEY);
                // Panel durumunu kaydet (açık olarak) ve sayfayı yenile
                savePanelState(true);
                alert("Önbellek temizlendi. Yeniden tarama başlatılıyor...");
                location.reload();
            }
        });

        // EKLE/KALDIR DÜĞMELERİNİN FONKSİYONLARI
        $('#mz-select-all-filters').on('click', (e) => {
            e.preventDefault();
            $('.mz-scout-filter').prop('checked', true).trigger('change');
        });

        $('#mz-deselect-all-filters').on('click', (e) => {
            e.preventDefault();
            $('.mz-scout-filter').prop('checked', false).trigger('change');
        });

        // Sayfa yüklendiğinde paneli açma mantığı
        const isPanelInitiallyOpen = getSavedPanelState();
        if (isPanelInitiallyOpen) {
            $('#mz-scout-filter-panel').show();
            $('#mz-scout-filter-toggle-btn').css('background', '#dc3545');
        } else {
            // İlk yüklemede durumu kaydet (varsayılan: kapalı)
            savePanelState(false);
        }
    }

    /**
     * Filtreleme mantığını uygular (AND Mantığı)
     */
    function applyScoutFilters() {
        const filters = {
            hp: $('.mz-scout-filter[data-filter-type="hp"]:checked').map(function() { return parseInt($(this).data('star')); }).get(),
            lp: $('.mz-scout-filter[data-filter-type="lp"]:checked').map(function() { return parseInt($(this).data('star')); }).get(),
            ts: $('.mz-scout-filter[data-filter-type="ts"]:checked').map(function() { return parseInt($(this).data('star')); }).get()
        };

        let visibleCount = 0;
        let totalCount = 0;

        $('.playerContainer').each(function() {
            const container = $(this);
            const pid = getPid(container);
            const report = persistentCache[pid];
            totalCount++;

            // Eğer oyuncu henüz taranmamışsa (yeni eklenmiş) görünür kalsın
            if (!report) {
                container.show();
                visibleCount++;
                return;
            }

            // Gözlemlenmemiş oyuncuysa gizle
            if (report.unscouted) {
                container.hide();
                return;
            }

            // --- FİLTRE MANTIĞI (AND) ---

            // 1. HP filtresi (Seçili değer yoksa başarılı)
            const passesHP = filters.hp.length === 0 || filters.hp.includes(report.hp.stars);

            // 2. LP filtresi
            const passesLP = filters.lp.length === 0 || filters.lp.includes(report.lp.stars);

            // 3. TS filtresi
            const passesTS = filters.ts.length === 0 || filters.ts.includes(report.ts.stars);

            // Tüm filtre gruplarını sağlıyorsa göster.
            if (passesHP && passesLP && passesTS) {
                container.show();
                visibleCount++;
            } else {
                container.hide();
            }
        });

        $('#mz-filter-count').text(getText('filterCount', visibleCount, totalCount));
    }


    /**
     * Oyuncu kartlarını renklendirir (Senkronizasyonun ilk adımı)
     */
    function processPlayersInitial() {
        $('.playerContainer').each(function() {
            const container = $(this);
            const pid = getPid(container);

            if (pid && persistentCache[pid]) {
                applyColors(container, persistentCache[pid]);
            } else {
                container.show(); // Veri yoksa göster
            }
        });

        // Renklendirme bitti, filtreleme panelini oluştur ve filtreyi uygula
        addScoutFilterUI();
        applyScoutFilters();
    }


    // --- ANA BAŞLATICI ---
    async function init() {
        const newPids = await syncRosterAndCache();
        processPlayersInitial();

        if (newPids.length > 0) {
            fetchNewReports(newPids).then(() => {
                applyScoutFilters();
                console.log("[MZ Skill Coloring] Yeni oyuncu taraması tamamlandı ve filtre güncellendi.");
            });
        }
    }

    // Başlatıcı
    if (window.location.href.includes('p=players')) {
        setTimeout(init, 500);

        const observer = new MutationObserver(debounce(() => {
            const target = document.querySelector('#squad_container');
            if (target && target.childElementCount > 0) {
                init();
            }
        }, 250));

        const targetNode = document.body;
        observer.observe(targetNode, { childList: true, subtree: true });
    }
}

      /****************************************************************************************
         *                                                                                      *
         *  BÖLÜM 18: YETENEK RENKLENDİRİCİ - FINAL V5 (ORİJİNAL RENK MANTIĞI + İKON)           *
         *                                                                                      *
         ****************************************************************************************/
        function initializeMaxedBallColoringScript() {
            'use strict';
            const $ = unsafeWindow.jQuery;
            console.log('[MZ Ball Colorizer] Modül Başlatıldı (Strict Color + Icon).');

            // 1. RESİMLER (BASE64)
            const IMG_RED = "data:image/gif;base64,R0lGODlhDAAKAJEDAP////8AAMyZmf///yH5BAEAAAMALAAAAAAMAAoAAAIk3BQZYp0CAAptxvjMgojTEVwKpl0dCQrQJX3T+jpLNDXGlDUFADs=";
            const IMG_BLUE = "data:image/gif;base64,R0lGODlhDAAKAJEDAP///8zM/wAA/////yH5BAEAAAMALAAAAAAMAAoAAAIk3CIpYZ0BABJtxvjMgojTIVwKpl0dCQbQJX3T+jpLNDXGlDUFADs=";

            // 2. HTML OLUŞTURUCU
            function generateBallHtml(count, imgSource, extraIconsHtml) {
                if (!count || count < 0) count = 0;

                let html = '<div class="mz-custom-skill-container" style="display:inline-flex; align-items:center; vertical-align:middle; white-space:nowrap; height: 12px;">';

                // Topları ekle
                for (let i = 0; i < count; i++) {
                    html += `<img src="${imgSource}" style="vertical-align:middle; margin-right:1px;">`;
                }

                // Yeşil antrenman ikonu varsa ekle
                if (extraIconsHtml) {
                    html += `<span class="mz-training-icon-wrapper" style="margin-left:6px; display:inline-flex; align-items:center;">${extraIconsHtml}</span>`;
                }

                html += '</div>';
                return html;
            }

            // 3. ANA RENKLENDİRME FONKSİYONU
            function colorizeBalls() {
                $('img.skill').each(function() {
                    const img = $(this);
                    const src = img.attr('src') || '';
                    const altText = img.attr('alt') || '';
                    const parentRow = img.closest('tr'); // Değişkeni burada bir kez tanımlıyoruz

                    // --- YENİ EKLEME: Tecrübe ve Form satırlarını boyama (Pas geç) ---
                    const skillLabel = parentRow.find('td:first').text().toLowerCase();
                    if (skillLabel.includes('tecrübe') ||
                        skillLabel.includes('experience') ||
                        skillLabel.includes('form')) {
                        return;
                    }
                    // ---------------------------------------------------------------

                    // A) Eğer bu resim yeşil antrenman ikonuysa (blevel), işleme ama GİZLEME.
                    if (src.includes('blevel')) {
                        if (img.parent().find('.mz-custom-skill-container').length > 0) {
                            img.hide();
                        }
                        return;
                    }

                    // B) Zaten işlenmiş mi?
                    if (img.next().hasClass('mz-custom-skill-container')) return;

                    // C) Değeri Bulma (Alt Etiketi Yöntemi - En Güvenlisi)
                    let skillValue = 0;
                    if (altText) {
                        const parts = altText.split(':');
                        if (parts.length > 1) {
                            skillValue = parseInt(parts[1].trim(), 10);
                        }
                    }

                    if (!skillValue || isNaN(skillValue)) {
                        const text = parentRow.text();
                        const matches = text.match(/\((\d+)\)/);
                        if (matches && matches[1]) {
                            skillValue = parseInt(matches[1], 10);
                        }
                    }

                    if (!skillValue || isNaN(skillValue)) return;

                    // D) Renk Kararı (ORİJİNAL MANTIK)
                    // Not: parentRow yukarıda tanımlandığı için burada tekrar 'const' kullanmıyoruz.
                    let isMaxed = parentRow.find('.maxed').length > 0;

                    if (!isMaxed) {
                        isMaxed = parentRow.find('font, span').filter(function() {
                            const color = $(this).css('color');
                            const attrColor = $(this).attr('color');
                            return (color === 'rgb(255, 0, 0)' || color === 'red' || attrColor === 'red');
                        }).length > 0;
                    }

                    const targetImg = isMaxed ? IMG_RED : IMG_BLUE;

                    // E) Yeşil İkonu Yakalama ve Kopyalama
                    let extraIconsHtml = '';
                    const parentDiv = img.parent();

                    parentDiv.find('img').each(function() {
                        const sSrc = $(this).attr('src') || '';
                        if (sSrc.includes('blevel')) {
                            let cleanHtml = this.outerHTML.replace(/style="[^"]*display:\s*none[^"]*"/g, '').replace('display: none', '');
                            extraIconsHtml += cleanHtml;
                            $(this).hide();
                        }
                    });

                    // F) Değişimi Uygula
                    img.hide();
                    const newHtml = generateBallHtml(skillValue, targetImg, extraIconsHtml);
                    img.after(newHtml);
                });
            }

            // Sayfa yüklenince çalıştır
            setTimeout(colorizeBalls, 500);

            // AJAX takibi
            const observer = new MutationObserver(function(mutations) {
                let shouldRun = false;
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0 && !$(mutation.target).hasClass('mz-custom-skill-container')) {
                        shouldRun = true;
                    }
                });
                if (shouldRun) setTimeout(colorizeBalls, 200);
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }


        /****************************************************************************************
     *                                                                                      *
     *  ANA YÖNLENDİRİCİ (MASTER ROUTER) - HATA YAKALAMA VE FİKSTÜR DESTEĞİ İLE GÜNCELLENDİ  *
     *                                                                                      *
     ****************************************************************************************/
        function masterRouter() {
            if (typeof $ === 'undefined' || typeof $.fn.on === 'undefined') {
                console.log("SUITE: jQuery is not available yet. Waiting...");
                setTimeout(masterRouter, 200);
                return;
            }

            initializeSellTaxCalculator();

            try {
                // Global menü her zaman çalışmalı, çünkü ayarlara erişim buradan sağlanıyor.
                initializeGlobalInfoMenu();
            } catch (error) {
                console.error(`[MZone Advanced Script] 'Global Info Menu' modülü başlatılırken bir hata oluştu:`, error);
            }

            const params = new URLSearchParams(window.location.search);
            const p_param = params.get('p');
            const sub_param = params.get('sub');
            const type_param = params.get('type');
            const scriptName = GM_info.script.name;

            function runModule(name, initFunction) {
                try {
                    console.log(`SUITE: Initializing ${name}...`);
                    initFunction();
                } catch (error) {
                    console.error(`[${scriptName}] '${name}' modülü başlatılırken bir hata oluştu:`, error);
                }
            }

            const leagueTablePages = ['league', 'friendlyseries', 'private_cup', 'cup'];
            if (scriptSettings.leagueTable && leagueTablePages.includes(p_param)) {
                runModule("Advanced League Table", initializeLeagueTableScript);
            }

            const playerStatsPages_p = ['players', 'player'];
            const playerStatsPages_sub = ['played', 'result', 'stats'];
            if ((scriptSettings.playerStats || scriptSettings.retirementIndicator) && (playerStatsPages_p.includes(p_param) || (p_param === 'match' && playerStatsPages_sub.includes(sub_param)))) {
                if (scriptSettings.playerStats) {
                    runModule("Player Stats", initializePlayerStatsScript);
                }
                if (scriptSettings.retirementIndicator && p_param === 'players') {
                    runModule("Retirement Indicator", initializeRetirementIndicatorScript);
                }
            }

            // ▼▼▼ DÜZELTME BURADA: Doğru fonksiyonu çağırıyor ▼▼▼
            if (scriptSettings.fixtureElo && p_param === 'match' && sub_param === 'scheduled') {
                // runFixtureEloModule fonksiyonu kendi içinde bekleme mantığına sahip olduğu için doğrudan çağırabiliriz.
                runModule("Fixture ELO Scores", runFixtureEloModule);
            }
            // ▲▲▲ DÜZELTME SONU ▲▲▲

            if (scriptSettings.playoffPredictor && p_param === 'league' && type_param === 'senior') {
                runModule("Play-off Predictor", initializePlayoffPredictorScript);
            }

            if ((scriptSettings.shortlistFilter || scriptSettings.transferTracker) && p_param === 'shortlist') {
                if (scriptSettings.shortlistFilter) runModule("Shortlist Filter", initializeShortlistFilterScript);
                if (scriptSettings.transferTracker) runModule("Transfer Tracker UI", initializeTransferTrackerScript);
            }

            if (scriptSettings.statisticsSummary && p_param === 'statistics') {
                runModule("Statistics Summary", initializeStatisticsSummaryScript);
            }

            if (p_param === 'rank' && sub_param === 'userrank') {
                runModule("Ranking Page Tweaks", initializeRankingPageTweaks);
            }

            if (scriptSettings.matchFinder && p_param === 'match' && (sub_param === 'played' || sub_param === 'scheduled')) {
                runModule("Advanced Match Finder", initializeMatchFinderScript);
            }

            // --- YENİ EKLENEN BLOK ---
            if (scriptSettings.messengerTools && p_param === 'messenger') {
                runModule("Messenger Enhancements", initializeMessengerEnhancements);
            }

            if (scriptSettings.ghostRobot && p_param === 'tactics') {
                runModule("Ghost Robot", initializeGhostRobotScript);
            }

            if (scriptSettings.friendlyMatchAuto) {
                runModule("Friendly Match Automation", initializeFriendlyMatchAutomationScript);
            }

            if (scriptSettings.linkEnhancements) {
                if ((p_param === 'league') || (p_param === 'match' && sub_param === 'result')) {
                    runModule("Link Enhancements", initializeLinkEnhancements);
                }
            }

            if (scriptSettings.transferScoutFilter && p_param === 'transfer') {
                runModule("Transfer Scout Filter", initializeTransferScoutFilterScript);
            }

            // ▼▼▼ YENİ EKLENECEK KISIM BURASI ▼▼▼
            // Transfer, Oyuncular veya Kısa Liste sayfalarında çalışsın
            if (p_param === 'transfer' || p_param === 'players' || p_param === 'shortlist') {
                runModule("Skill Coloring (Van Style)", initializeSkillColoringScript);
            }
            // ▲▲▲ YENİ EKLENECEK KISIM BURASI ▲▲▲
            if (scriptSettings.maxedBallColoring && (p_param === 'transfer' || p_param === 'players' || p_param === 'shortlist')) {
                runModule("Maxed Skill Ball Colorizer", initializeMaxedBallColoringScript);
            }
        }

        (async () => {
            await loadScriptSettings(); // Önce ayarları yükle
            initializeGlobalScoutMatchListener();
            masterRouter();             // Sonra yönlendiriciyi çalıştır
        })();

        /****************************************************************************************
         *                                                                                      *
         *  BÖLÜM 9: FİKSTÜR SAYFASI ELO MODÜLÜ (Doğrudan Tetiklemeli) - DÜZELTİLMİŞ VERSİYON    *
         *                                                                                      *
         ****************************************************************************************/
        function runFixtureEloModule() {
            // Sadece fikstür sayfasında çalışmasını garantile
            const params = new URLSearchParams(window.location.search);
            if (params.get('p') !== 'match' || params.get('sub') !== 'scheduled') {
                return;
            }

            console.log("SUITE: Fikstür sayfası algılandı. ELO modülü başlatılıyor.");

            // Maç listesinin yüklenmesini bekle (AJAX uyumluluğu için)
            const waitForFixtures = setInterval(function() {
                const matchEntries = $('dd.odd'); // HTML koduna göre doğru seçici
                if (matchEntries.length > 0) {
                    clearInterval(waitForFixtures);
                    console.log(`SUITE: ${matchEntries.length} maç satırı bulundu. ELO verileri çekiliyor.`);

                    const myTeamId = $('#challenge-team-id-1').val() || null;
                    if (!myTeamId) {
                        console.warn("SUITE: Kullanıcı Takım ID'si bulunamadı. Kendi takımınızın ELO'su gösterilemeyebilir.");
                    }

                    const teamIds = new Set();

                    // 1. ADIM: Sayfadaki tüm takım ID'lerini topla
                    matchEntries.each(function() {
                        $(this).find('a.clippable[href*="p=team"]').each(function() {
                            const teamLink = $(this);
                            const href = teamLink.attr('href');
                            let tid = null;

                            if (href.includes('&tid=')) {
                                const url = new URL(href, window.location.origin);
                                tid = url.searchParams.get('tid');
                            } else if (myTeamId) {
                                tid = myTeamId;
                            }

                            if (tid) {
                                teamIds.add(tid);
                            }
                        });
                    });

                    if (teamIds.size === 0) return;

                    // 2. ADIM: API isteği için ID'leri hazırla
                    const linkIds = Array.from(teamIds).map((id, i) => `&idEquipo${i}=${id}`).join('');

                    // 3. ADIM: statsxente.com API'sine istek gönder
                    GM_xmlhttpRequest({
                        method: "GET",
                        // DİKKAT: Diğer betikle aynı API endpoint'ini kullanıyoruz
                        url: `https://statsxente.com/MZ1/Functions/tamper_elo_values.php?sport=soccer${linkIds}`,
                        headers: { "Content-Type": "application/json" },
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                const eloData = data.teams;
                                if (!eloData) return;

                                // 4. ADIM: ELO puanlarını ilgili takımların altına ekle
                                matchEntries.each(function() {
                                    const matchRow = $(this);

                                    // ▼▼▼ DEĞİŞİKLİK BURADA BAŞLIYOR ▼▼▼

                                    // KATEGORİYİ BELİRLEMEK İÇİN DOĞRU YÖNTEM
                                    let eloCategory = 'SENIOR'; // Varsayılan kategori
                                    // Sadece linki değil, tüm metni içeren kapsayıcıyı buluyoruz.
                                    const categoryContainer = matchRow.find('.responsive-hide.match-reference-text-wrapper');
                                    if (categoryContainer.length > 0) {
                                        // Artık tüm metni ('U18 Dünya Ligi div5.110') kontrol ediyoruz.
                                        const categoryText = categoryContainer.text().toLowerCase();
                                        if (categoryText.includes('u23')) {
                                            eloCategory = 'U23';
                                        } else if (categoryText.includes('u21')) {
                                            eloCategory = 'U21';
                                        } else if (categoryText.includes('u18')) {
                                            eloCategory = 'U18';
                                        }
                                    }

                                    // Takımları bul ve ELO'larını ekle/güncelle
                                    matchRow.find('a.clippable[href*="p=team"]').each(function() {
                                        const teamLink = $(this);
                                        // Takım adını ve bayrağı içeren .flex-grow-1 elementini buluyoruz
                                        const elementContainer = teamLink.closest('.flex-grow-1');

                                        const href = teamLink.attr('href');
                                        let tid = null;

                                        if (href.includes('&tid=')) {
                                            const url = new URL(href, window.location.origin);
                                            tid = url.searchParams.get('tid');
                                        } else if (myTeamId) {
                                            tid = myTeamId;
                                        }

                                        if (!tid) return;

                                        const teamEloData = eloData[tid];
                                        if (teamEloData && teamEloData[eloCategory] !== undefined) {
                                            const eloScore = Math.round(parseFloat(teamEloData[eloCategory]));

                                            // Önce mevcut ELO span'ını bulmaya çalış
                                            let eloSpan = elementContainer.find('.fixture-elo-score');

                                            // Eğer span yoksa, oluştur ve ekle
                                            if (eloSpan.length === 0) {
                                                eloSpan = $('<br><span class="fixture-elo-score"></span>');
                                                elementContainer.append(eloSpan);
                                            }

                                            // İçeriğini doğru ELO puanı ile güncelle
                                            eloSpan.text(`ELO: ${eloScore.toLocaleString('de-DE')}`);
                                        }
                                    });
                                    // ▲▲▲ DEĞİŞİKLİK BURADA BİTİYOR ▲▲▲
                                });

                            } catch (error) {
                                console.error("SUITE: ELO verisi işlenirken hata oluştu:", error);
                            }
                        },
                        onerror: function(error) {
                            console.error("SUITE: ELO API hatası:", error);
                        }
                    });
                }
            }, 500); // Her yarım saniyede bir kontrol et

            setTimeout(() => clearInterval(waitForFixtures), 10000); // 10 saniye sonra dur
        }        

    } catch (error) { // <-- BU BLOKU OLDUĞU GİBİ EKLEYİN
        // Betik adını alarak daha anlaşılır bir hata mesajı oluştur
        const scriptName = GM_info.script.name || 'MZone Advanced Script';
        console.error(`[${scriptName}] KRİTİK HATA YAKALANDI! Betiğin çalışması durdu.`);
        console.error("Hata Detayları:", error);
        console.error("Lütfen bu hatayı ve oluştuğu sayfayı betik geliştiricisine bildirin.");
    }

    /****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 10: GELİŞMİŞ MAÇ BULUCU (Advanced Match Finder) - YENİ MODÜL (i18n EKLENDİ)    *
 *                                                                                      *
 ****************************************************************************************/
    function initializeMatchFinderScript() {
        'use strict';

        const $ = unsafeWindow.jQuery;

        // ▼▼▼ DEĞİŞİKLİK 1: i18n NESNESİ VE DİL ALGILAMA EKLENDİ ▼▼▼
        const i18n = {
            tr: {
                // Arayüz
                teamUserInputLabel: "Takım / Kullanıcı Adı:",
                teamUserInputPlaceholder: "Tam adı girin...",
                findMatchesButton: "Maçları Ara",
                showResultsButton: "Sonuçları Göster",
                // Durum Mesajları
                statusSearching: "Arama yapılıyor...",
                statusNotFound: "Arama sonucu bulunamadı. Lütfen adı kontrol edin.",
                statusExactMatch: (name) => `Tam eşleşme bulundu: "${name}". İşleniyor...`,
                statusSingleMatch: (name) => `Tek sonuç bulundu: "${name}". İşleniyor...`,
                statusMultipleMatches: "Birden fazla sonuç bulundu, lütfen birini seçin:",
                statusSelected: (name) => `"${name}" seçildi, işleniyor...`,
                statusScanningProfile: "Kullanıcı profili taranıyor...",
                statusFetchingMatches: (tid) => `Takım ID (${tid}) ile maç listesi alınıyor...`,
                statusComplete: (count) => `İşlem tamamlandı. ${count} maç bulundu.`,
                statusErrorPrefix: "Hata: ",
                // Hata Mesajları
                errorSearchComponents: "Sitenin ana arama bileşenleri bulunamadı.",
                errorInvalidTid: "Seçilen hedeften geçerli bir takım IDsi alınamadı.",
                errorFetchingList: (status) => `Maç listesi alınamadı (HTTP ${status})`,
                alertFetchError: (msg) => `Rakip bilgileri alınırken bir hata oluştu: ${msg}`,
                alertFilterFirst: 'Lütfen incelemek için önce maçları filtreleyin.',
                // Sonuçlar Modalı
                modalTitle: (teamName, count) => `'<strong>${teamName}</strong>' Arama Sonucu (${count} Maç)`,
                filterByResultLabel: "Sonuca Göre Filtrele:",
                filterAll: "Tümü",
                filterWins: "Galibiyetler",
                filterLosses: "Mağlubiyetler",
                filterDraws: "Beraberlikler",
                filterByTimeLabel: "Zaman Aralığı:",
                timeAll: "Tümü (Maksimum)",
                time1Week: "Son 1 Hafta",
                time2Weeks: "Son 2 Hafta",
                filterByTournamentLabel: "Turnuvaya Göre Filtrele:",
                selectAll: "Tümünü Seç",
                deselectAll: "Seçimi Kaldır",
                viewTacticsButton: "Filtrelenmiş Taktikleri Görüntüle",
                tableHeaderDate: "Tarih",
                tableHeaderTournament: "Turnuva",
                tableHeaderOpponent: "Rakip",
                tableHeaderScore: "Skor",
                noMatchesFound: "Bu kriterlere uygun maç bulunamadı.",
                // Taktik İnceleme
                tooltipProcessing: "İşleniyor...",
                tooltipImageError: "Resim işlenemedi.",
                reviewButtonPreparing: "Görseller Hazırlanıyor...",
                reviewProgress: (current, total) => `${current} / ${total} taktik hazırlandı...`,
                visualReviewTitle: (count) => `Filtrelenmiş Maç Taktikleri (${count} Maç)`,
                // Fikstür İkonu
                analyzeOpponentTitle: "Rakibin maç sonuçlarını analiz et",
                analyzingOpponentTitle: "Analiz ediliyor...",
                // Diğer
                resultTypeTeam: "Takım",
                resultTypeUser: "Kullanıcı",
                resultTypeUnknown: "Bilinmiyor",
                // Maç Filtreleme Anahtar Kelimeleri
                excludedMatchTypeKeywords: ['Hazırlık Maçı', 'Gözlemci Maçı', 'Hemen Maç Yap', 'Dostluk Ligi']
            },
            en: {
                // UI
                teamUserInputLabel: "Team / User Name:",
                teamUserInputPlaceholder: "Enter the full name...",
                findMatchesButton: "Find Matches",
                showResultsButton: "Show Results",
                // Status Messages
                statusSearching: "Searching...",
                statusNotFound: "No search results found. Please check the name.",
                statusExactMatch: (name) => `Exact match found: "${name}". Processing...`,
                statusSingleMatch: (name) => `Single result found: "${name}". Processing...`,
                statusMultipleMatches: "Multiple results found, please select one:",
                statusSelected: (name) => `Selected "${name}", processing...`,
                statusScanningProfile: "Scanning user profile...",
                statusFetchingMatches: (tid) => `Fetching match list with Team ID (${tid})...`,
                statusComplete: (count) => `Process complete. Found ${count} matches.`,
                statusErrorPrefix: "Error: ",
                // Error Messages
                errorSearchComponents: "Could not find the site's main search components.",
                errorInvalidTid: "Could not retrieve a valid team ID from the selected target.",
                errorFetchingList: (status) => `Failed to fetch match list (HTTP ${status})`,
                alertFetchError: (msg) => `An error occurred while fetching opponent data: ${msg}`,
                alertFilterFirst: 'Please filter the matches to review first.',
                // Results Modal
                modalTitle: (teamName, count) => `Search Result for '<strong>${teamName}</strong>' (${count} Matches)`,
                filterByResultLabel: "Filter by Result:",
                filterAll: "All",
                filterWins: "Wins",
                filterLosses: "Losses",
                filterDraws: "Draws",
                filterByTimeLabel: "Time Range:",
                timeAll: "All (Maximum)",
                time1Week: "Last 1 Week",
                time2Weeks: "Last 2 Weeks",
                filterByTournamentLabel: "Filter by Tournament:",
                selectAll: "Select All",
                deselectAll: "Deselect All",
                viewTacticsButton: "View Filtered Tactics",
                tableHeaderDate: "Date",
                tableHeaderTournament: "Tournament",
                tableHeaderOpponent: "Opponent",
                tableHeaderScore: "Score",
                noMatchesFound: "No matches found for these criteria.",
                // Tactic Review
                tooltipProcessing: "Processing...",
                tooltipImageError: "Could not process image.",
                reviewButtonPreparing: "Preparing Visuals...",
                reviewProgress: (current, total) => `${current} / ${total} tactics prepared...`,
                visualReviewTitle: (count) => `Filtered Match Tactics (${count} Matches)`,
                // Fixture Icon
                analyzeOpponentTitle: "Analyze opponent's match results",
                analyzingOpponentTitle: "Analyzing...",
                // Other
                resultTypeTeam: "Team",
                resultTypeUser: "User",
                resultTypeUnknown: "Unknown",
                // Match Filtering Keywords
                excludedMatchTypeKeywords: ['Friendly Match', 'Scout Match', 'Instant Match', 'Friendly League']
            }
        };

        const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
        const getText = (key, ...args) => {
            const text = i18n[lang][key] || i18n.en[key]; // Fallback to English
            if (typeof text === 'function') {
                return text(...args);
            }
            return text;
        };
        // ▲▲▲ DEĞİŞİKLİK 1 SONU ▲▲▲

        let allFoundMatches = [];
        let currentFilteredMatches = [];
        let currentSearchInput = '';
        const tacticImageCache = {};

        function addStyles() { GM_addStyle(` #quickSearchResponsePlaceholder { position: fixed !important; top: -9999px !important; left: -9999px !important; opacity: 0 !important; pointer-events: none !important; z-index: -1 !important; } #lmf-tactic-tooltip { display: none; position: absolute; z-index: 10001; background-color: #1C2833; border: 1px solid #566573; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); padding: 10px; width: auto; pointer-events: none; } #lmf-tactic-tooltip img { display: block; max-width: 350px; border-radius: 4px; } #lmf-tactic-tooltip .tooltip-loading { font-style: italic; color: #999; padding: 20px; text-align: center; } #lmf-container { position: relative; padding: 15px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; margin: 15px 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; } #lmf-team-input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; width: 300px; font-size: 14px; } #lmf-find-button { padding: 8px 18px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px; transition: background-color 0.2s; } #lmf-find-button:disabled { background-color: #aaa; cursor: not-allowed; } #lmf-status { font-style: italic; color: #555; } #lmf-results-modal, #lmf-visual-review-modal { display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.7); backdrop-filter: blur(4px); font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; } .lmf-modal-content { background: #283747; color: #D5D8DC; margin: 5% auto; padding: 25px 30px; border-top: 4px solid #3498DB; border-radius: 8px; width: 90%; max-width: 950px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); } #lmf-visual-review-modal .lmf-modal-content { max-width: 1400px; } .lmf-modal-close { color: #999; position: absolute; top: 15px; right: 20px; font-size: 28px; font-weight: bold; cursor: pointer; transition: color 0.2s, transform 0.2s; } .lmf-modal-close:hover { color: #fff; transform: scale(1.1); } .lmf-modal-title { font-size: 22px; text-align: center; padding-bottom: 15px; margin-bottom: 20px; border-bottom: 1px solid #4A5568; color: #fff; } .lmf-modal-title strong { color: #3498DB; font-weight: 700; } #lmf-result-filter-pane, #lmf-filter-pane { background-color: #1C2833; padding: 15px; border-radius: 6px; margin-bottom: 15px; } #lmf-result-filter-controls { display: flex; justify-content: space-between; align-items: center; } #lmf-result-filter-controls > div { display: flex; align-items: center; } #lmf-result-filter-controls span { font-weight: bold; font-size: 14px; color: #EAECEE; } #lmf-result-filter-controls label { font-size: 13px; color: #D5D8DC; margin-left: 15px; cursor: pointer; } #lmf-result-filter-controls input[type="radio"] { margin-right: 5px; vertical-align: middle; accent-color: #3498DB; } #lmf-time-filter-group { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 14px; color: #EAECEE; } #lmf-time-filter { background-color: #283747; color: #D5D8DC; border: 1px solid #566573; border-radius: 4px; padding: 5px 8px; } #lmf-filter-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #4A5568; } #lmf-filter-controls > span { font-weight: bold; font-size: 14px; color: #EAECEE; } #lmf-filter-controls button { background: #3498DB; border: none; color: white; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s; } #lmf-filter-controls button:hover { background: #5DADE2; } #lmf-filter-controls #lmf-deselect-all { background: #566573; } #lmf-filter-controls #lmf-deselect-all:hover { background: #808B96; } #lmf-checkbox-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; max-height: 120px; overflow-y: auto; padding: 10px 5px; } .lmf-checkbox-label { display: flex; align-items: center; background-color: #283747; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; font-size: 13px; color: #D5D8DC; } .lmf-checkbox-label:hover { background-color: #566573; } .lmf-checkbox-label input { margin-right: 10px; width: 15px; height: 15px; accent-color: #3498DB; } #lmf-review-button-container { text-align: center; margin: -5px 0 10px 0; } #lmf-review-button { font-size: 14px; padding: 10px 25px; background-color: #27AE60; border: none; color: white; border-radius: 4px; cursor: pointer; transition: all 0.2s; } #lmf-review-button:disabled { background-color: #999; cursor: not-allowed; } #lmf-review-button:hover:not(:disabled) { background-color: #2ECC71; } #lmf-review-progress-status { text-align: center; color: #F1C40F; padding: 5px 0; height: 20px; font-style: italic; font-weight: bold; } #lmf-results-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; } #lmf-results-table th, #lmf-results-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #4A5568; } #lmf-results-table th { background-color: #1C2833; color: #EAECEE; font-size: 12px; text-transform: uppercase; } #lmf-results-table td { color: #D5D8DC; } #lmf-results-table tbody tr:hover { background-color: #4A5568; } .lmf-score-cell { font-weight: bold; color: #fff; cursor: help; } .lmf-score-cell-loss { background-color: rgba(192, 57, 43, 0.4); } .lmf-score-cell-win { background-color: rgba(39, 174, 96, 0.4); } .lmf-score-cell-draw { background-color: rgba(241, 196, 15, 0.4); } #lmf-results-table a { color: #5DADE2; text-decoration: none; font-weight: 600; } #lmf-visual-review-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-top: 20px; max-height: 70vh; overflow-y: auto; padding: 10px; } .visual-tactic-item { background-color: #1C2833; border: 1px solid #4A5568; border-radius: 8px; padding: 15px; text-align: center; display: flex; flex-direction: column; align-items: center; } .visual-tactic-item img { width: 100%; max-width: 300px; height: auto; border-radius: 4px; background-color: #006400; } .visual-tactic-info { margin-top: 12px; font-size: 14px; width: 100%; } .visual-tactic-info .opponent { font-weight: bold; color: #EAECEE; } .visual-tactic-info .score { font-size: 16px; font-weight: bold; margin-top: 5px; padding: 4px 10px; border-radius: 4px; display: inline-block; } .score-win { background-color: rgba(39, 174, 96, 0.4); color: #fff; } .score-loss { background-color: rgba(192, 57, 43, 0.4); color: #fff; } .score-draw { background-color: rgba(241, 196, 15, 0.4); color: #fff; } `); }

        function scrapeAndDisplayAllMatches(teamName, searchContext) {
            const allMatches = [];
            let currentDate = '';
            // ▼▼▼ DEĞİŞİKLİK 2: Filtreleme için dil-bağımsız anahtar kelimeler kullanılıyor ▼▼▼
            const excludedKeywords = getText('excludedMatchTypeKeywords');

            searchContext.querySelectorAll('#fixtures-results-list > dd').forEach(dd => {
                if (dd.classList.contains('group')) { currentDate = dd.textContent.trim(); return; }
                const scoreEl = dd.querySelector('.score-shown');
                if (!scoreEl) return;
                const homeTeamEl = dd.querySelector('.home-team-column');
                const awayTeamEl = dd.querySelector('.away-team-column');
                if (!homeTeamEl || !awayTeamEl || (!homeTeamEl.querySelector('strong') && !awayTeamEl.querySelector('strong'))) return;
                const matchTypeEl = dd.querySelector('.responsive-hide.match-reference-text-wrapper > span');
                const matchType = matchTypeEl ? matchTypeEl.textContent.trim() : getText('resultTypeUnknown');

                // Maç türü anahtar kelime kontrolü
                if (excludedKeywords.some(keyword => matchType.includes(keyword))) {
                    return;
                }

                const dateParts = currentDate.split('-');
                const matchDateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
                const isOurTeamHome = !!homeTeamEl.querySelector('strong');
                const scoreParts = scoreEl.textContent.trim().split('-').map(s => parseInt(s.trim(), 10));
                if (scoreParts.length !== 2 || isNaN(scoreParts[0]) || isNaN(scoreParts[1])) return;
                let result = 'Draw';
                const ourScore = isOurTeamHome ? scoreParts[0] : scoreParts[1];
                const opponentScore = isOurTeamHome ? scoreParts[1] : scoreParts[0];
                if (ourScore > opponentScore) result = 'Win';
                else if (ourScore < opponentScore) result = 'Loss';
                const finalScore = `${ourScore} - ${opponentScore}`;
                const opponentName = isOurTeamHome ? awayTeamEl.querySelector('.full-name').textContent.trim() : homeTeamEl.querySelector('.full-name').textContent.trim();
                allMatches.push({
                    date: currentDate,
                    matchDateObject: matchDateObject,
                    type: matchType,
                    opponent: opponentName,
                    score: finalScore,
                    link: scoreEl.closest('a').href,
                    isHome: isOurTeamHome,
                    result: result
                });
            });

            allFoundMatches = allMatches;
            currentSearchInput = teamName;
            displayResultsModal(allFoundMatches, teamName);
            document.getElementById('lmf-results-modal').style.display = 'block';
            if (document.getElementById('lmf-find-button')) {
                updateMainButtonToToggleModal(teamName);
            }
        }

        function displayResultsModal(matches, teamName) {
            let modal = document.getElementById('lmf-results-modal');
            if (modal) modal.remove();
            modal = document.createElement('div');
            modal.id = 'lmf-results-modal';

            const totalMatches = matches.length;
            const uniqueTournamentTypes = [...new Set(matches.map(m => m.type))].sort();
            const checkboxHTML = uniqueTournamentTypes.map(type => `<label class="lmf-checkbox-label"><input type="checkbox" class="lmf-type-checkbox" value="${type}" checked> ${type}</label>`).join('');

            // ▼▼▼ DEĞİŞİKLİK 3: Modal içindeki tüm metinler getText() ile değiştirildi ▼▼▼
            modal.innerHTML = `
            <div class="lmf-modal-content">
                <span class="lmf-modal-close">×</span>
                <div id="lmf-modal-dynamic-title" class="lmf-modal-title">${getText('modalTitle', teamName, totalMatches)}</div>
                <div id="lmf-result-filter-pane">
                    <div id="lmf-result-filter-controls">
                        <div>
                            <span>${getText('filterByResultLabel')}</span>
                            <label><input type="radio" name="resultFilter" value="All" checked> ${getText('filterAll')}</label>
                            <label><input type="radio" name="resultFilter" value="Win"> ${getText('filterWins')}</label>
                            <label><input type="radio" name="resultFilter" value="Loss"> ${getText('filterLosses')}</label>
                            <label><input type="radio" name="resultFilter" value="Draw"> ${getText('filterDraws')}</label>
                        </div>
                        <div id="lmf-time-filter-group">
                            <span>${getText('filterByTimeLabel')}</span>
                            <select id="lmf-time-filter">
                                <option value="all">${getText('timeAll')}</option>
                                <option value="1week">${getText('time1Week')}</option>
                                <option value="2weeks">${getText('time2Weeks')}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div id="lmf-filter-pane">
                    <div id="lmf-filter-controls">
                        <span>${getText('filterByTournamentLabel')}</span>
                        <div>
                            <button id="lmf-select-all">${getText('selectAll')}</button>
                            <button id="lmf-deselect-all" style="margin-left: 5px;">${getText('deselectAll')}</button>
                        </div>
                    </div>
                    <div id="lmf-checkbox-container">${checkboxHTML}</div>
                </div>
                <div id="lmf-review-button-container">
                    <button id="lmf-review-button">${getText('viewTacticsButton')}</button>
                </div>
                <div id="lmf-review-progress-status"></div>
                <table id="lmf-results-table">
                    <thead>
                        <tr>
                            <th>${getText('tableHeaderDate')}</th>
                            <th>${getText('tableHeaderTournament')}</th>
                            <th>${getText('tableHeaderOpponent')}</th>
                            <th>${getText('tableHeaderScore')}</th>
                        </tr>
                    </thead>
                    <tbody>${generateTableRowsHTML(matches)}</tbody>
                </table>
            </div>`;
            document.body.appendChild(modal);

            modal.querySelector('.lmf-modal-close').onclick = () => { modal.style.display = 'none'; };
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
            document.querySelectorAll('.lmf-type-checkbox, input[name="resultFilter"], #lmf-time-filter').forEach(el => el.addEventListener('change', handleFilterChange));
            document.getElementById('lmf-select-all').addEventListener('click', () => toggleAllCheckboxes(true));
            document.getElementById('lmf-deselect-all').addEventListener('click', () => toggleAllCheckboxes(false));
            document.getElementById('lmf-review-button').addEventListener('click', runVisualReview);
            const tableBody = modal.querySelector('#lmf-results-table tbody');
            tableBody.addEventListener('mouseover', handleScoreHover);
            tableBody.addEventListener('mouseout', handleScoreMouseOut);
            handleFilterChange();
        }

        function handleFilterChange() {
            const selectedResult = document.querySelector('input[name="resultFilter"]:checked').value;
            const checkedBoxes = document.querySelectorAll('.lmf-type-checkbox:checked');
            const selectedTypes = Array.from(checkedBoxes).map(cb => cb.value);
            const selectedTimeRange = document.getElementById('lmf-time-filter').value;
            let filteredMatches = allFoundMatches;
            if (selectedResult !== 'All') { filteredMatches = filteredMatches.filter(match => match.result === selectedResult); }
            filteredMatches = filteredMatches.filter(match => selectedTypes.includes(match.type));
            if (selectedTimeRange !== 'all') {
                const now = new Date();
                const daysToSubtract = selectedTimeRange === '1week' ? 7 : 14;
                const cutoffDate = new Date();
                cutoffDate.setDate(now.getDate() - daysToSubtract);
                cutoffDate.setHours(0, 0, 0, 0);
                filteredMatches = filteredMatches.filter(match => match.matchDateObject >= cutoffDate);
            }
            currentFilteredMatches = filteredMatches;
            document.querySelector('#lmf-results-table tbody').innerHTML = generateTableRowsHTML(filteredMatches);
            const titleEl = document.getElementById('lmf-modal-dynamic-title');
            if (titleEl) { titleEl.innerHTML = getText('modalTitle', currentSearchInput, filteredMatches.length); }
        }

        function createTacticTooltip() {
            if (document.getElementById('lmf-tactic-tooltip')) return;
            const tooltip = document.createElement('div');
            tooltip.id = 'lmf-tactic-tooltip';
            document.body.appendChild(tooltip);
        }

        function getModifiedTacticImage(imageUrl, colorToReplace, callback) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const targetRgb = colorToReplace === 'Sarı' ? [255, 255, 0] : [0, 0, 0];
                const replacementRgb = [0, 191, 255];
                for (let i = 0; i < data.length; i += 4) {
                    const redDiff = Math.abs(data[i] - targetRgb[0]);
                    const greenDiff = Math.abs(data[i + 1] - targetRgb[1]);
                    const blueDiff = Math.abs(data[i + 2] - targetRgb[2]);
                    const tolerance = 30;
                    if (redDiff < tolerance && greenDiff < tolerance && blueDiff < tolerance) {
                        data[i] = replacementRgb[0]; data[i + 1] = replacementRgb[1]; data[i + 2] = replacementRgb[2];
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                callback(canvas.toDataURL());
            };
            img.onerror = () => { callback(null); };
            img.src = imageUrl;
        }

        function handleScoreHover(e) {
            const scoreCell = e.target.closest('.lmf-score-cell');
            if (!scoreCell) return;
            const isHome = scoreCell.dataset.ishome === 'true';
            const ourColorName = isHome ? 'Sarı' : 'Siyah';
            const matchIdLink = scoreCell.querySelector('a').href;
            const matchIdMatch = matchIdLink.match(/match_id=(\d+)|mid=(\d+)/);
            if (!matchIdMatch) return;
            const matchId = matchIdMatch[1] || matchIdMatch[2];
            const tacticImageUrl = `https://www.managerzone.com/dynimg/pitch.php?match_id=${matchId}`;
            const cacheKey = `${matchId}-${ourColorName}`;
            const tooltip = document.getElementById('lmf-tactic-tooltip');
            const updateTooltipPosition = (event) => {
                tooltip.style.visibility = 'hidden'; tooltip.style.display = 'block';
                const tooltipRect = tooltip.getBoundingClientRect();
                let top = event.pageY + 15; let left = event.pageX + 15;
                if (top + tooltipRect.height > window.innerHeight + window.scrollY) { top = event.pageY - tooltipRect.height - 15; }
                if (left + tooltipRect.width > window.innerWidth + window.scrollX) { left = event.pageX - tooltipRect.width - 15; }
                tooltip.style.top = `${top}px`; tooltip.style.left = `${left}px`;
                tooltip.style.visibility = 'visible';
            };
            const displayImage = (imageUrl) => {
                const rotationStyle = !isHome ? 'style="transform: rotate(180deg);"' : '';
                tooltip.innerHTML = `<img src="${imageUrl}" ${rotationStyle} alt="Processed Tactic Board">`;
                updateTooltipPosition(e);
            };
            if (tacticImageCache[cacheKey]) { displayImage(tacticImageCache[cacheKey]); }
            else {
                tooltip.innerHTML = `<div class="tooltip-loading">${getText('tooltipProcessing')}</div>`;
                updateTooltipPosition(e);
                getModifiedTacticImage(tacticImageUrl, ourColorName, (modifiedDataUrl) => {
                    if (modifiedDataUrl) {
                        tacticImageCache[cacheKey] = modifiedDataUrl;
                        if (scoreCell.matches(':hover')) displayImage(modifiedDataUrl);
                    } else {
                        tooltip.innerHTML = `<div class="tooltip-loading">${getText('tooltipImageError')}</div>`;
                        updateTooltipPosition(e);
                    }
                });
            }
        }

        function handleScoreMouseOut() { const tooltip = document.getElementById('lmf-tactic-tooltip'); if (tooltip) tooltip.style.display = 'none'; }

        async function runVisualReview() {
            const reviewBtn = document.getElementById('lmf-review-button');
            const statusEl = document.getElementById('lmf-review-progress-status');
            if (!currentFilteredMatches || currentFilteredMatches.length === 0) { alert(getText('alertFilterFirst')); return; }
            reviewBtn.disabled = true; reviewBtn.textContent = getText('reviewButtonPreparing');
            statusEl.textContent = getText('reviewProgress', 0, currentFilteredMatches.length);
            const matchPromises = currentFilteredMatches.map((match, index) => {
                return new Promise(async (resolve) => {
                    const matchIdMatch = match.link.match(/match_id=(\d+)|mid=(\d+)/);
                    if (!matchIdMatch) return resolve(null);
                    const matchId = matchIdMatch[1] || matchIdMatch[2];
                    const tacticImageUrl = `https://www.managerzone.com/dynimg/pitch.php?match_id=${matchId}`;
                    const ourColor = match.isHome ? 'Sarı' : 'Siyah';
                    const cacheKey = `${matchId}-${ourColor}`;
                    const processImage = (imageUrl) => {
                        getModifiedTacticImage(imageUrl, ourColor, (modifiedDataUrl) => {
                            if (modifiedDataUrl) {
                                tacticImageCache[cacheKey] = modifiedDataUrl;
                                statusEl.textContent = getText('reviewProgress', index + 1, currentFilteredMatches.length);
                                resolve({ ...match, imageDataUrl: modifiedDataUrl });
                            } else { resolve(null); }
                        });
                    };
                    if (tacticImageCache[cacheKey]) {
                        statusEl.textContent = getText('reviewProgress', index + 1, currentFilteredMatches.length);
                        resolve({ ...match, imageDataUrl: tacticImageCache[cacheKey] });
                    } else { processImage(tacticImageUrl); }
                });
            });
            const reviewedMatches = (await Promise.all(matchPromises)).filter(Boolean);
            statusEl.textContent = ''; reviewBtn.disabled = false; reviewBtn.textContent = getText('viewTacticsButton');
            displayVisualReviewModal(reviewedMatches);
        }

        function displayVisualReviewModal(matches) {
            let modal = document.getElementById('lmf-visual-review-modal');
            if (modal) modal.remove();
            const resultsHTML = matches.map(match => {
                const rotationStyle = !match.isHome ? 'style="transform: rotate(180deg);"' : '';
                const scoreClass = `score-${match.result.toLowerCase()}`;
                return `<div class="visual-tactic-item"><img src="${match.imageDataUrl}" ${rotationStyle} alt="Tactic Board"><div class="visual-tactic-info"><p class="opponent">vs ${match.opponent}</p><p class="score ${scoreClass}">${match.score}</p><p class="tournament-type" style="font-size: 12px; color: #99A3A4; margin-top: 4px;">${match.type}</p></div></div>`; // <-- YENİ EKLENEN SATIR BURADA
            }).join('');
            modal = document.createElement('div');
            modal.id = 'lmf-visual-review-modal';
            modal.innerHTML = `
            <div class="lmf-modal-content">
                <span class="lmf-modal-close">×</span>
                <div class="lmf-modal-title">${getText('visualReviewTitle', matches.length)}</div>
                <div id="lmf-visual-review-results">${resultsHTML}</div>
            </div>`;
            document.body.appendChild(modal);
            modal.style.display = 'block';
            modal.querySelector('.lmf-modal-close').onclick = () => { modal.style.display = 'none'; };
            modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        }

        function generateTableRowsHTML(matches) {
            if (!matches || matches.length === 0) return `<tr><td colspan="4" style="text-align:center; padding: 20px;">${getText('noMatchesFound')}</td></tr>`;
            return matches.map(m => {
                const scoreClass = `lmf-score-cell-${m.result.toLowerCase()}`;
                return `<tr><td>${m.date}</td><td>${m.type}</td><td>${m.opponent}</td><td class="lmf-score-cell ${scoreClass}" data-ishome="${m.isHome}"><a href="${m.link}" target="_blank">${m.score}</a></td></tr>`;
            }).join('');
        }

        function createInitialUI() {
            const container = document.createElement('div');
            container.id = 'lmf-container';
            container.innerHTML = `
            <label for="lmf-team-input">${getText('teamUserInputLabel')}</label>
            <input type="text" id="lmf-team-input" placeholder="${getText('teamUserInputPlaceholder')}">
            <button id="lmf-find-button">${getText('findMatchesButton')}</button>
            <span id="lmf-status"></span>
            <div id="lmf-search-results" style="display:none;"></div>`;
            const targetArea = document.querySelector('#results-fixtures-header');
            if (targetArea) {
                targetArea.insertAdjacentElement('afterend', container);
                document.getElementById('lmf-find-button').addEventListener('click', startSearch);
            }
        }

        function startSearch() {
            const searchInput = document.getElementById('lmf-team-input').value.trim();
            if (!searchInput) return;
            const button = document.getElementById('lmf-find-button');
            const statusEl = document.getElementById('lmf-status');
            const resultsContainer = document.getElementById('lmf-search-results');
            const quickSearchInput = document.getElementById('quickSearchField');
            const searchResponseContainer = document.getElementById('quickSearchResponseContainer');
            if (!quickSearchInput || !searchResponseContainer) { statusEl.textContent = getText('errorSearchComponents'); return; }
            button.disabled = true; statusEl.textContent = getText('statusSearching');
            resultsContainer.innerHTML = ''; resultsContainer.style.display = 'none';
            const observer = new MutationObserver((mutations, obs) => {
                obs.disconnect();
                const links = Array.from(searchResponseContainer.querySelectorAll('a'));
                if (links.length === 0) { statusEl.textContent = getText('statusNotFound'); button.disabled = false; return; }
                const exactMatches = links.filter(link => link.textContent.trim().toLowerCase() === searchInput.toLowerCase());
                if (exactMatches.length > 0) {
                    let targetLink = exactMatches.find(link => link.href.includes('&tid=')) || exactMatches[0];
                    statusEl.textContent = getText('statusExactMatch', targetLink.textContent.trim());
                    processSelection(targetLink.href, targetLink.textContent.trim());
                    return;
                }
                if (links.length === 1) {
                    let targetLink = links[0];
                    statusEl.textContent = getText('statusSingleMatch', targetLink.textContent.trim());
                    processSelection(targetLink.href, targetLink.textContent.trim());
                    return;
                }
                statusEl.textContent = getText('statusMultipleMatches');
                links.forEach(link => {
                    const href = link.href;
                    const name = link.textContent.trim();
                    let type = href.includes('&tid=') ? getText('resultTypeTeam') : (href.includes('&uid=') ? getText('resultTypeUser') : getText('resultTypeUnknown'));
                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = `<span>${name}</span> <span class="result-type">${type}</span>`;
                    resultDiv.addEventListener('click', () => {
                        resultsContainer.style.display = 'none';
                        statusEl.textContent = getText('statusSelected', name);
                        button.disabled = true; processSelection(href, name);
                    });
                    resultsContainer.appendChild(resultDiv);
                });
                resultsContainer.style.display = 'block'; button.disabled = false;
            });
            observer.observe(searchResponseContainer, { childList: true, subtree: true });
            quickSearchInput.value = searchInput;
            quickSearchInput.dispatchEvent(new Event('focus', { bubbles: true }));
            quickSearchInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        }

        async function processSelection(url, teamNameFromLink) {
            const button = document.getElementById('lmf-find-button');
            const statusEl = document.getElementById('lmf-status');
            let teamId = null;
            let finalTeamName = teamNameFromLink || document.getElementById('lmf-team-input').value.trim();
            try {
                if (url.includes('&tid=')) { const match = url.match(/tid=(\d+)/); if (match) teamId = match[1]; }
                else if (url.includes('&uid=')) {
                    statusEl.textContent = getText('statusScanningProfile');
                    const userMatch = url.match(/uid=(\d+)/);
                    if (userMatch) {
                        const userId = userMatch[1];
                        const profileUrl = `https://www.managerzone.com/?p=profile&uid=${userId}`;
                        const profileResponse = await fetch(profileUrl);
                        const profileHtml = await profileResponse.text();
                        const profileDoc = new DOMParser().parseFromString(profileHtml, 'text/html');
                        const profileTeamLink = profileDoc.querySelector('a[href*="p=team&tid="]');
                        if (profileTeamLink) { const teamMatch = profileTeamLink.href.match(/tid=(\d+)/); if (teamMatch) teamId = teamMatch[1]; }
                    }
                }
                if (!teamId) { throw new Error(getText('errorInvalidTid')); }
                await fetchAndScrapeMatches(teamId, finalTeamName);
            } catch (error) { statusEl.textContent = getText('statusErrorPrefix') + error.message; button.disabled = false; }
        }

        async function fetchAndScrapeMatches(teamId, teamName) {
            const statusEl = document.getElementById('lmf-status');
            if (statusEl) statusEl.textContent = getText('statusFetchingMatches', teamId);
            try {
                const matchesUrl = `https://www.managerzone.com/?p=match&sub=played&tid=${teamId}&limit=max`;
                const matchesResponse = await fetch(matchesUrl);
                if (!matchesResponse.ok) throw new Error(getText('errorFetchingList', matchesResponse.status));
                const matchesHtml = await matchesResponse.text();
                const matchesDoc = new DOMParser().parseFromString(matchesHtml, 'text/html');
                scrapeAndDisplayAllMatches(teamName, matchesDoc);
            } catch (error) {
                if (statusEl) { statusEl.textContent = getText('statusErrorPrefix') + error.message; document.getElementById('lmf-find-button').disabled = false; }
                else { console.error('MZ Advanced Match Finder Error:', error); alert(getText('alertFetchError', error.message)); }
            }
        }

        function updateMainButtonToToggleModal(teamName) {
            const button = document.getElementById('lmf-find-button');
            const statusEl = document.getElementById('lmf-status');
            const modal = document.getElementById('lmf-results-modal');
            if (!button || !statusEl || !modal) return;
            button.textContent = getText('showResultsButton');
            statusEl.textContent = getText('statusComplete', allFoundMatches.length);
            button.disabled = false;
            button.removeEventListener('click', startSearch);
            button.addEventListener('click', () => { modal.style.display = 'block'; });
        }

        function toggleAllCheckboxes(shouldBeChecked) { document.querySelectorAll('.lmf-type-checkbox').forEach(cb => cb.checked = shouldBeChecked); handleFilterChange(); }

        function initializeFixturesPage() {
            const analysisIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer;" title="${getText('analyzeOpponentTitle')}"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="3" x2="12" y2="22"></line><line x1="12" y1="12" x2="18" y2="9"></line><line x1="6" y1="9" x2="12" y2="12"></line></svg>`;
            const matchRows = document.querySelectorAll('#fixtures-results-list > dd:not(.group)');
            matchRows.forEach(row => {
                const opponentLink = row.querySelector('a.clippable:not(:has(strong))');
                if (opponentLink) {
                    const opponentName = opponentLink.querySelector('.full-name').textContent.trim();
                    const opponentUrl = opponentLink.href;
                    const tidMatch = opponentUrl.match(/tid=(\d+)/);
                    if (tidMatch) {
                        const opponentTid = tidMatch[1];
                        const iconWrapper = document.createElement('span');
                        iconWrapper.innerHTML = analysisIconSVG;
                        iconWrapper.style.marginLeft = '8px'; iconWrapper.style.display = 'inline-flex'; iconWrapper.style.alignItems = 'center'; iconWrapper.style.verticalAlign = 'middle';
                        iconWrapper.addEventListener('click', (e) => {
                            e.preventDefault(); e.stopPropagation();
                            const svgIcon = iconWrapper.firstElementChild;
                            svgIcon.style.color = '#e74c3c'; svgIcon.style.transform = 'scale(1.2)'; svgIcon.setAttribute('title', getText('analyzingOpponentTitle'));
                            fetchAndScrapeMatches(opponentTid, opponentName).finally(() => {
                                svgIcon.style.color = 'currentColor'; svgIcon.style.transform = 'scale(1)'; svgIcon.setAttribute('title', getText('analyzeOpponentTitle'));
                            });
                        });
                        opponentLink.insertAdjacentElement('afterend', iconWrapper);
                    }
                }
            });
        }

        function main() {
            addStyles();
            createTacticTooltip();
            if (window.location.href.includes('sub=scheduled')) { initializeFixturesPage(); }
            else if (window.location.href.includes('sub=played')) { createInitialUI(); }
        }

        main();
    }

/****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 11: EMEKLİLİK GÖSTERGESİ (Retirement Indicator) - v11 (AJAX Uyumlu)            *
 *                                                                                      *
 ****************************************************************************************/
function initializeRetirementIndicatorScript() {
    'use strict';
    // --- Dil Desteği (i18n) ---
    const i18n = {
        tr: {
            retireWarning: "Bu oyuncu sezon sonunda emekli olacak",
            canExtendRetirement: "Bu oyuncunun emekliliği 1 sezon ertelenebilir",
        },
        en: {
            retireWarning: "This player will retire at the end of the season",
            canExtendRetirement: "This player's retirement can be postponed for 1 season",
        }
    };
    const lang = (document.querySelector('meta[name="language"]')?.getAttribute('content') || 'en') === 'tr' ? 'tr' : 'en';
    const getText = (key) => i18n[lang][key] || i18n.en[key];

    const RETIREMENT_DATA_KEY = 'mz_retirement_data_v2';

    // Bu fonksiyon, oyuncu profilleri sayfasında çalışarak emeklilik verilerini depolar.
    async function scanAndStoreRetirementData() {
        const retirementData = {};
        const playerContainers = document.querySelectorAll('.playerContainer');

        playerContainers.forEach(container => {
            const retireDiv = container.querySelector('.dg_playerview_retire');
            if (retireDiv) {
                const pidSpan = container.querySelector('span.player_id_span');
                if (pidSpan && pidSpan.textContent) {
                    const pid = pidSpan.textContent.trim();
                    let isExtendable = false;
                    const extendIconContainer = container.querySelector('.view_extend_career');
                    if (extendIconContainer && !extendIconContainer.closest('.semi_transparent')) {
                        isExtendable = true;
                    }
                    retirementData[pid] = { extendable: isExtendable };
                }
            }
        });

        await GM_setValue(RETIREMENT_DATA_KEY, JSON.stringify(retirementData));
        console.log(`[Emeklilik Göstergesi] Tarama tamamlandı. ${Object.keys(retirementData).length} emekli oyuncu durumu kaydedildi.`);
    }

    /**
     * Kadro özet sayfasındaki tabloya emeklilik ve kariyer uzatma ikonlarını ekler.
     * Bu fonksiyon artık hem sayfa ilk yüklendiğinde hem de AJAX sonrası çağrılacak.
     */
    async function displayRetirementIcons() {
        // Stil kuralını her seferinde eklemek sorun yaratmaz ve tutarlılığı garantiler.
        GM_addStyle(`
            #playerAltViewTable td, .alt-view-table-mobile td {
                vertical-align: middle !important;
            }
        `);

            const retirementDataJSON = await GM_getValue(RETIREMENT_DATA_KEY, '{}');
            const retirementData = JSON.parse(retirementDataJSON);

            if (Object.keys(retirementData).length === 0) {
                return; // Gösterilecek veri yoksa çık.
            }

            // Hem masaüstü hem mobil tabloyu hedef alıyoruz.
            const tableRows = document.querySelectorAll('#playerAltViewTable tbody tr, .alt-view-table-mobile tbody tr');

            tableRows.forEach(row => {
                const checkbox = row.querySelector('input.snapshot__check-player');
                let pid = checkbox ? checkbox.dataset.playerId : null;

                if (!pid) {
                    const playerLinkEl = row.querySelector('a[href*="&pid="]');
                    if (playerLinkEl) {
                        const urlParams = new URLSearchParams(new URL(playerLinkEl.href).search);
                        pid = urlParams.get('pid');
                    }
                }

                if (pid && retirementData[pid]) {
                    const nameCell = row.cells[1] || row.cells[0]; // Masaüstü için 1, mobil için 0. hücre
                    const playerLink = nameCell ? nameCell.querySelector('a') : null;

                    // Eğer oyuncu linki varsa ve daha önce ikon eklenmemişse devam et.
                    if (playerLink && !nameCell.querySelector('.retirement-indicator-container')) {
                        const iconContainer = document.createElement('span');
                        iconContainer.className = 'retirement-indicator-container';
                        iconContainer.style.display = 'inline-flex';
                        iconContainer.style.alignItems = 'center';
                        iconContainer.style.gap = '4px';
                        iconContainer.style.marginRight = '6px';
                        iconContainer.style.verticalAlign = 'middle';

                        const warningIcon = document.createElement('i');
                        warningIcon.className = 'fa fa-exclamation-triangle';
                        warningIcon.style.fontSize = '14px';
                        warningIcon.style.color = '#e60000';
                        warningIcon.style.cursor = 'help';
                        warningIcon.style.lineHeight = '1';
                        warningIcon.title = getText('retireWarning');
                        iconContainer.appendChild(warningIcon);

                        if (retirementData[pid].extendable) {
                            const heartContainer = document.createElement('span');
                            heartContainer.className = 'player_icon_placeholder view_extend_career';
                            heartContainer.title = getText('canExtendRetirement');
                            heartContainer.style.cursor = 'help';
                            heartContainer.style.margin = '0';
                            heartContainer.style.padding = '0';
                            heartContainer.style.display = 'inline-flex';
                            heartContainer.style.alignItems = 'center';

                            const heartIcon = document.createElement('i');
                            heartIcon.className = 'fa-duotone fa-heart-pulse extend-career-icon';
                            heartIcon.style.fontSize = '14px';

                            const iconWrapper = document.createElement('span');
                            iconWrapper.className = 'player_icon_wrapper';
                            iconWrapper.style.display = 'inline-flex';
                            iconWrapper.style.alignItems = 'center';
                            iconWrapper.appendChild(heartIcon);

                            heartContainer.appendChild(iconWrapper);
                            iconContainer.appendChild(heartContainer);
                        }

                        playerLink.before(iconContainer);
                    }
                }
            });
            console.log(`[Emeklilik Göstergesi] İkonlar başarıyla uygulandı.`);
        }

        /**
     * ▼▼▼ YENİ FONKSİYON: AJAX DEĞİŞİKLİKLERİNİ İZLEYİCİ ▼▼▼
     * Bu fonksiyon, tablo içeriği değiştiğinde displayRetirementIcons'ı tekrar tetikler.
     */
        function setupAjaxObserver() {
            // Filtreleme sonucunda içeriği değişen ana kapsayıcıyı hedef alıyoruz.
            const targetNode = document.getElementById('squad_summary');

            if (!targetNode) {
                console.warn("[Emeklilik Göstergesi] Gözlemlenecek hedef ('squad_summary') bulunamadı.");
                return;
            }

            const observer = new MutationObserver(mutations => {
                // Herhangi bir değişiklik algılandığında, fonksiyonumuzu tekrar çalıştırıyoruz.
                // Küçük bir gecikme, DOM'un tamamen oturmasını garantiler.
                setTimeout(displayRetirementIcons, 100);
            });

            // Gözlemciyi, hedef elementin altındaki eleman değişikliklerini izleyecek şekilde ayarlıyoruz.
            observer.observe(targetNode, { childList: true, subtree: true });
            console.log("[Emeklilik Göstergesi] AJAX gözlemcisi aktif.");
        }

        // --- Modül Yönlendiricisi ---
        const params = new URLSearchParams(window.location.search);
        const sub = params.get('sub');

        if (sub === 'alt') {
            // Sayfa ilk yüklendiğinde ve AJAX ile güncellendiğinde çalışacak yapıyı kuruyoruz.
            setTimeout(() => {
                displayRetirementIcons(); // 1. Sayfa ilk açıldığında ikonları ekle.
                setupAjaxObserver();      // 2. Gelecekteki tüm filtreleme işlemleri için gözlemciyi başlat.
            }, 500); // Sayfanın tam olarak oturması için yarım saniye beklemek her zaman daha sağlıklıdır.
        } else if (!params.has('pid')) {
            // Diğer oyuncular sayfalarında (profil görünümleri) tarama yapmaya devam ediyoruz.
            scanAndStoreRetirementData();
        }
    }

/****************************************************************************************
     *                                                                                      *
     *  BÖLÜM 12: MENAJER SIRALAMASI GELİŞTİRMELERİ (Ranking Page Tweaks) - NİHAİ SÜRÜM      *
     *                                                                                      *
     ****************************************************************************************/
function initializeRankingPageTweaks() {
    'use strict';
    // Sadece menajer sıralaması sayfasında çalıştığından emin ol
    const params = new URLSearchParams(window.location.search);
    if (params.get('p') !== 'rank' || params.get('sub') !== 'userrank') {
        return;
    }

    const rankingTable = document.getElementById('userRankTable');
    if (!rankingTable) {
        console.warn('[MZone Advanced] Sıralama tablosu bulunamadı.');
        return;
    }

    // Başlık satırına ikonu ekle (sadece bir kez)
    const headerRow = rankingTable.querySelector('thead tr');
    if (headerRow && headerRow.cells.length > 2 && !headerRow.querySelector('.scout-header')) {
        const newHeader = document.createElement('th');
        newHeader.innerHTML = '<i class="fa fa-user-secret" title="Gözlemci Maçı"></i>';
        newHeader.className = 'scout-header';
        newHeader.style.width = '25px';
        newHeader.style.textAlign = 'center';
        headerRow.cells[2].insertAdjacentElement('afterend', newHeader);
    }

    // Her takım satırına tıklanabilir gözlemci ikonunu ekle
    const bodyRows = rankingTable.querySelectorAll('tbody tr');
    bodyRows.forEach(row => {
        // İkonun tekrar eklenmesini önle
        if (row.querySelector('.scout-cell')) return;

        const teamLink = row.querySelector('a[href*="p=team&tid="]');
        const newCell = document.createElement('td');
        newCell.className = 'scout-cell';
        newCell.style.textAlign = 'center';
        newCell.style.verticalAlign = 'middle';

        if (teamLink) {
            const href = teamLink.getAttribute('href');
            const teamIdMatch = href.match(/tid=(\d+)/);

            if (teamIdMatch && teamIdMatch[1]) {
                const teamId = teamIdMatch[1];
                const buttonId = `scout_button_${teamId}`; // Her buton için benzersiz bir ID

                // Çalışan butondaki onclick fonksiyonunu doğrudan kopyalıyoruz.
                // Bu, ManagerZone'un kendi, çalışan kodunu kullanmamızı sağlar.
                const onClickAttribute = `button_onClick('${buttonId}', "purchaseChallenge(1, 'instantchallenge', '${teamId}')", 'multi_delay', 'account'); return false;`;

                const scoutLink = document.createElement('a');
                scoutLink.href = 'javascript:;'; // Sayfanın üste kaymasını engeller
                scoutLink.title = "Gözlemci maçı teklif et";
                scoutLink.id = buttonId; // butona ID veriyoruz
                scoutLink.setAttribute('onclick', onClickAttribute); // onclick olayını doğrudan atıyoruz
                scoutLink.innerHTML = `
                        <span class="fa-stack challenge" style="font-size: 0.8em;">
                            <i class="fa fa-user-secret fa-stack-2x"></i>
                            <i class="fa fa-star fa-stack-1x"></i>
                        </span>`;

                newCell.appendChild(scoutLink);
            }
        }
            // Yeni hücreyi, mesaj ikonundan sonraki sütuna ekle
            row.cells[2].insertAdjacentElement('afterend', newCell);
        });
    }

/****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 13: MESSENGER TOPLU SİLME ARACI (Nihai Sürüm - Tıklama Simülasyonu)             *
 *                                                                                      *
 ****************************************************************************************/
function initializeMessengerEnhancements() {
    'use strict';
    // Sadece messenger sayfasında çalışmasını garantile
    if (new URLSearchParams(window.location.search).get('p') !== 'messenger') {
        return;
    }

    if (typeof waitForKeyElements !== "function") {
        alert("HATA: MZone Gelişmiş betiğinin bir parçası olan 'waitForKeyElements' kütüphanesi yüklenemedi. Lütfen betiğinizin başındaki @require satırlarını kontrol edin.");
        return;
    }

    const $ = unsafeWindow.jQuery;

    // --- Dil Desteği ---
    const i18n = {
        tr: {
            selectAll: "Tümünü Seç",
            deselectAll: "Tümünü Kaldır",
            deleteSelected: "Seçilenleri Sil",
            confirmDelete: (count) => `${count} adet sohbet kalıcı olarak silinecek. Emin misiniz?`,
            deleting: (current, total) => `Siliniyor: ${current}/${total}...`,
            deletionComplete: "Silme işlemi tamamlandı.",
            noSelection: "Lütfen silmek için en az bir sohbet seçin."
        }
    };
    const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
    const getText = (key, ...args) => {
        const textOrFunction = i18n.tr[key] || key;
        return typeof textOrFunction === 'function' ? textOrFunction(...args) : textOrFunction;
    };

    // --- Stiller ---
    GM_addStyle(`
        #messenger-bulk-controls { display: inline-flex; align-items: center; gap: 10px; float: right; margin-right: 15px; font-size: 12px; line-height: normal; position: relative; top: 2px; }
        #messenger-bulk-controls a { color: #FFFFFF; text-decoration: none; font-weight: bold; cursor: pointer; }
        #messenger-bulk-controls a:hover { text-decoration: underline; }
        #messenger-bulk-controls .delete-btn { background-color: #d9534f; color: white !important; padding: 4px 10px; border-radius: 4px; border: 1px solid #d43f3a; }
        #messenger-bulk-controls .delete-btn:hover { background-color: #c9302c; text-decoration: none; }
        #messenger-list .notification { position: relative; padding-left: 35px; }
        .messenger-convo-checkbox { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; cursor: pointer; z-index: 10; }
    `);

        let uiInitialized = false;

        // --- Arayüz ve Olay Yöneticileri ---
        function addBulkControls(jNode) {
            if (uiInitialized) return;
            const controlsContainer = $('<div id="messenger-bulk-controls"></div>');
            const selectAllLink = $(`<a>${getText('selectAll')}</a>`).on('click', (e) => { e.preventDefault(); toggleCheckboxes(true); });
            const deselectAllLink = $(`<a>${getText('deselectAll')}</a>`).on('click', (e) => { e.preventDefault(); toggleCheckboxes(false); });
            const deleteButton = $(`<a class="delete-btn">${getText('deleteSelected')}</a>`).on('click', (e) => { e.preventDefault(); handleDeleteSelected(); });
            controlsContainer.append(selectAllLink, deselectAllLink, deleteButton).insertBefore(jNode);
            uiInitialized = true;
        }

        function addConversationCheckbox(jNode) {
            if (jNode.find('.messenger-convo-checkbox').length === 0) {
                const checkbox = $('<input type="checkbox" class="messenger-convo-checkbox">');
                checkbox.on('click', (event) => event.stopPropagation());
                jNode.prepend(checkbox);
            }
        }

        function toggleCheckboxes(checkedState) {
            $('.messenger-convo-checkbox').prop('checked', checkedState);
        }

        async function handleDeleteSelected() {
            const selected = $('.messenger-convo-checkbox:checked');
            if (selected.length === 0) { alert(getText('noSelection')); return; }
            // Bu seferki onay, betiğin kendi onayıdır. Diğerleri çıkmayacak.
            if (!confirm(getText('confirmDelete', selected.length))) { return; }

            const conversationsToDelete = [];
            selected.each(function() {
                conversationsToDelete.push($(this).closest('.notification'));
            });

            const deleteButton = $('#msg-delete-selected');
            const originalText = deleteButton.text();
            deleteButton.css('pointer-events', 'none');

            for (let i = 0; i < conversationsToDelete.length; i++) {
                const convoElement = conversationsToDelete[i];
                deleteButton.text(getText('deleting', i + 1, conversationsToDelete.length));
                try {
                    // Kullanıcı tıklamalarını taklit eden yeni fonksiyonu çağır
                    await deleteSingleConversationBySimulation(convoElement);
                    // Başarılı olursa ekrandan kaldır
                    convoElement.fadeOut(300, function() { $(this).remove(); });
                } catch (error) {
                    console.error(`Bir sohbet silinirken hata oluştu:`, error);
                    convoElement.css('background-color', 'rgba(255, 0, 0, 0.3)');
                }
                await new Promise(resolve => setTimeout(resolve, 500)); // Adımlar arasına biraz bekleme ekle
            }

            deleteButton.text(originalText).css('pointer-events', 'auto');
            alert(getText('deletionComplete'));
        }

        // ▼▼▼ TAMAMEN YENİ, KULLANICI EYLEMLERİNİ TAKLİT EDEN SİLME FONKSİYONU ▼▼▼
        function deleteSingleConversationBySimulation(convoElement) {
            return new Promise(async (resolve, reject) => {
                try {
                    // Adım 1: Silinecek sohbet satırına tıkla
                    convoElement.trigger('click');
                    await new Promise(r => setTimeout(r, 750)); // Pencerenin yüklenmesini bekle

                    // Adım 2: Sağda açılan aktif sohbet penceresindeki ayarlar (çark) ikonuna tıkla
                    const activeDialog = $('.messenger-dialog.active');
                    if (!activeDialog.length) throw new Error("Aktif sohbet penceresi bulunamadı.");
                    activeDialog.find('.dialog-menu').trigger('click');
                    await new Promise(r => setTimeout(r, 250)); // Menünün açılmasını bekle

                    // Adım 3: Açılan menüdeki #messenger-link-remove ID'li "Sohbeti sil" linkine tıkla
                    const deleteLink = $('#messenger-link-remove');
                    if (!deleteLink.length) throw new Error("'Sohbeti Sil' linki (#messenger-link-remove) bulunamadı.");
                    deleteLink.trigger('click');

                    // Adım 4: Onay penceresinin ("powerbox") ve "Evet" butonunun çıkmasını bekle
                    const yesButton = await new Promise((res, rej) => {
                        const startTime = Date.now();
                        const interval = setInterval(() => {
                            const button = $('#powerbox_confirm_ok_button');
                            if (button.length > 0) {
                                clearInterval(interval);
                                res(button);
                            }
                            if (Date.now() - startTime > 5000) {
                                clearInterval(interval);
                                rej("Onay penceresi ('Evet' butonu) zaman aşımına uğradı.");
                            }
                        }, 100);
                    });

                    // Adım 5: "Evet" butonuna tıkla ve işlemi bitir
                    yesButton.trigger('click');
                    await new Promise(r => setTimeout(r, 300)); // Pencerenin kapanması için bekle

                    resolve();

                } catch (error) {
                    reject(error);
                }
            });
        }
        // ▲▲▲ YENİ SİLME FONKSİYONU SONU ▲▲▲

        // --- waitForKeyElements'i Başlat ---
        waitForKeyElements("#messenger-settings", addBulkControls, true);
        waitForKeyElements("#messenger-list > div[id^='notification_message_']", addConversationCheckbox);
    }


function waitForKeyElements (
selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
 bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
 iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
            .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements (    selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

/****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 14: MZ HAZIRLIK MAÇI OTOMASYONU (Friendly Match Automation) - v10 (6 Saatlik) *
 *                                                                                      *
 ****************************************************************************************/
function initializeFriendlyMatchAutomationScript() {
    'use strict';

    const $ = window.jQuery || unsafeWindow.jQuery;

    // =================================================================================
    // 1. SABİTLER VE TANIMLAMALAR
    // =================================================================================

    const urlParams = new URLSearchParams(window.location.search);
    const isWorkerMode = urlParams.get('mz_mode') === 'worker';
    const isChallengePage = window.location.href.includes('p=challenges');

    const VALID_DAYS = [1, 2, 4, 5, 6];

    const KEY_USER_LIST = 'mz_challenge_user_list_v5';
    const KEY_SELECTED_USERS = 'mz_challenge_selected_users_v10';
    const KEY_SETTINGS = 'mz_otomasyon_ayarlari_v4_dual_tactic';
    const KEY_TACTIC_NAMES = 'mz_user_tactic_names_v8';
    const KEY_AUTO_STATUS = 'mz_auto_status_v21_6hours'; // Versiyonu değiştirdik

    // 6 Saat = 6 * 60 * 60 * 1000 milisaniye
    const INTERVAL_MS = 6 * 60 * 60 * 1000;

    const DEFAULT_TACTICS = [{val: 'a', txt: 'ASIL'}, {val: 'b', txt: 'LİG'}, {val: 'c', txt: '5-3-2N'}, {val: 'l', txt: 'Taktik'}];

    const mod_i18n = {
        tr: {
            dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
            modalHelper: "Sadece maç oynanan 5 gün listelenir:",
            btnSelectAll: "Hepsini Seç",
            btnSave: "Kaydet",
            btnCancel: "İptal",
            panelTitle: "MZ Otomatik Hazırlık Maçı Teklifi",
            settingsTitle: "Otomasyon Ayarları",
            saveButton: "Ayarları Kaydet",
            resetButton: "Ayarları Sıfırla",
            closeButton: "Kapat",
            colOfferDay: "Teklif Günü",
            colMatchDay: "Maç Günü",
            colActive: "Aktif",
            colTacticHome: "İç Saha Taktik",
            colTacticAway: "Dış Saha Taktik",
            inputPlaceholder: "Kullanıcı adı...",
            addBtn: "Ekle",
            addFriendsBtn: "Arkadaşları Çek",
            listHeader: "Seçili Olanlara Gönderilir:",
            selectAll: "Tümü",
            deleteSelected: "Sil",
            autoModeLabel: "OTOMATİK MOD (6 SAATTE BİR)", // Metin güncellendi
            settingsToggle: "🛠️ Taktik Ayarları",
            startBtn: "MANUEL BAŞLAT",
            stopBtn: "DUR",
            alertSaved: "Ayarlar Kalıcı Olarak Kaydedildi!",
            alertSaveError: "Kaydederken hata oluştu: ",
            alertResetConfirm: "Tüm ayarlar silinecek. Onaylıyor musunuz?",
            settingsNote: "Değişiklik yaptıktan sonra KAYDET butonuna basmayı unutmayın.",
            confirmDelete: (count) => `${count} adet kullanıcı kalıcı olarak silinecek. Emin misiniz?`,
            noSelection: "Kimse seçilmedi!",
            noBuddyList: "Arkadaş listesi açık değil.",
            logSystemStart: (count) => `> SİSTEM BAŞLATILDI. KUYRUK: ${count} KİŞİ`,
            logRobotCall: `> ARKA PLAN ROBOTU ÇAĞRILIYOR...`,
            logSearch: (user) => `> ${user} ARANIYOR...`,
            logNotFound: (user) => `> ${user} BULUNAMADI, GEÇİLİYOR.`,
            logNoDay: (user) => `> ${user}: UYGUN GÜN YOK (AYARLARA BAKIN).`,
            logDayOff: "> GÜNLÜK AYAR KAPALI.",
            logOfferSent: (user, day) => `> ${user}: ${day} TEKLİFİ GÖNDERİLDİ.`,
            logErrorTimeout: '> HATA: Sayfa zaman aşımı.',
            logProcessDone: (user, remaining) => `> ${user} İŞLEMİ BİTTİ. KALAN: ${remaining}`,
            logAllComplete: "> TÜM GÖREVLER TAMAMLANDI. 6 SAAT SONRA TEKRARLANACAK. ✅",
            logError: "> HATA:",
            logWarn: "> UYARI:",
            logInfo: "> BİLGİ:",
            emptyList: "Liste boş. İsim ekleyin veya arkadaşları çekin."
        },
        en: {
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            modalHelper: "Only the 5 match days are listed:",
            btnSelectAll: "Select All",
            btnSave: "Save",
            btnCancel: "Cancel",
            panelTitle: "MZ Automatic Friendly Match Offer",
            settingsTitle: "Automation Settings",
            saveButton: "Save Settings",
            resetButton: "Reset Settings",
            closeButton: "Close",
            colOfferDay: "Offer Day",
            colMatchDay: "Match Day",
            colActive: "Active",
            colTacticHome: "Home Tactic",
            colTacticAway: "Away Tactic",
            inputPlaceholder: "Username...",
            addBtn: "Add",
            addFriendsBtn: "Fetch Friends",
            listHeader: "Will be sent to selected:",
            selectAll: "All",
            deleteSelected: "Delete",
            autoModeLabel: "AUTO MODE (EVERY 6 HOURS)",
            settingsToggle: "🛠️ Tactic Settings",
            startBtn: "MANUAL START",
            stopBtn: "STOP",
            alertSaved: "Settings Saved Permanently!",
            alertSaveError: "Error while saving: ",
            alertResetConfirm: "All settings will be deleted. Are you sure?",
            settingsNote: "Don't forget to click SAVE after making changes.",
            confirmDelete: (count) => `Are you sure you want to delete ${count} users permanently?`,
            noSelection: "No one selected!",
            noBuddyList: "Friend list is not open.",
            logSystemStart: (count) => `> SYSTEM STARTED. QUEUE: ${count} PEOPLE`,
            logRobotCall: `> BACKGROUND ROBOT IS BEING CALLED...`,
            logSearch: (user) => `> SEARCHING ${user}...`,
            logNotFound: (user) => `> ${user} NOT FOUND, SKIPPING.`,
            logNoDay: (user) => `> ${user}: NO SUITABLE DAY.`,
            logDayOff: "> DAILY SETTING IS OFF.",
            logOfferSent: (user, day) => `> ${user}: OFFER SENT FOR ${day}.`,
            logErrorTimeout: '> ERROR: Page timeout.',
            logProcessDone: (user, remaining) => `> ${user} PROCESS DONE. REMAINING: ${remaining}`,
            logAllComplete: "> ALL TASKS COMPLETED. REPEATS IN 6 HOURS. ✅",
            logError: "> ERROR:",
            logWarn: "> WARNING:",
            logInfo: "> INFO:",
            emptyList: "List empty. Add names or fetch friends."
        }
    };

    const scriptLang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
    const getText = (key, ...args) => {
        const text = mod_i18n[scriptLang][key] || mod_i18n.en[key];
        return typeof text === 'function' ? text(...args) : text;
    };

    const GUNLER = getText('dayNames');

    // =================================================================================
    // 2. YARDIMCI FONKSİYONLAR
    // =================================================================================

    function getPersistentData(key, defaultVal) {
        try {
            let val = GM_getValue(key);
            if (val !== undefined && val !== null) return val;
            let local = localStorage.getItem(key);
            if (local !== null) {
                GM_setValue(key, local);
                return local;
            }
        } catch(e) { console.warn("Storage Error:", e); }
        return defaultVal;
    }

    function setPersistentData(key, value) {
        try { GM_setValue(key, value); } catch(e) {}
    }

    function removePersistentData(key) {
        try { GM_deleteValue(key); } catch(e) {}
    }

    function getQueueData() {
        return JSON.parse(localStorage.getItem(KEY_AUTO_STATUS) || '{"enabled": false, "lastRun": 0, "queue": []}');
    }

    function setQueueData(data) {
        localStorage.setItem(KEY_AUTO_STATUS, JSON.stringify(data));
    }

    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    function logToWidget(msg, type = 'info') {
        let w = document.getElementById('mz-universal-widget');
        if (!w) {
            w = document.createElement('div');
            w.id = 'mz-universal-widget';
            document.body.appendChild(w);
        }
        const time = new Date().toLocaleTimeString();
        let spanClass = 'mz-log-info';
        if (type === 'sent') spanClass = 'mz-log-sent';
        if (type === 'success') spanClass = 'mz-log-success';
        if (type === 'error') spanClass = 'mz-log-error';
        if (type === 'warn') spanClass = 'mz-log-warn';
        w.innerHTML = `<div class="mz-widget-row"><span class="mz-w-time">[${time}]</span><span class="${spanClass}">${msg}</span></div>` + w.innerHTML;
        w.style.display = 'block';
    }

    // =================================================================================
    // 3. CSS STİLLERİ
    // =================================================================================
    if (!isWorkerMode) {
        const style = document.createElement('style');
        style.innerHTML = `
        #mz-main-panel {
            background-color: #2b2b2b; color: #fff; border: 1px solid #10559C;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); width: 300px; float: right;
            clear: both; position: relative; margin-bottom: 15px; border-radius: 4px;
            font-family: Arial, sans-serif; z-index: 80;
        }
        #mz-panel-header {
            padding: 10px; background: linear-gradient(to bottom, #1E74B3, #1562A8);
            color: white !important; font-weight: bold; cursor: pointer; border: 2px solid white;
            box-sizing: border-box; display: flex; justify-content: space-between;
            align-items: center; user-select: none; font-size: 14px; border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); position: relative; z-index: 90;
        }
        #mz-panel-header:hover { background: linear-gradient(to bottom, #1562A8, #1E74B3); box-shadow: 0 1px 5px rgba(0, 0, 0, 0.6); }
        #mz-panel-body {
            padding: 10px; display: none; background-color: #1a1a1a; position: absolute;
            top: 100%; left: 0; width: 100%; box-sizing: border-box; border: 1px solid #444; border-top: none;
            box-shadow: 0 10px 20px rgba(0,0,0,0.9); z-index: 90; border-radius: 0 0 4px 4px;
        }
        #mz-panel-header span { color: white !important; text-shadow: 0 1px 1px rgba(0,0,0,0.4); }
        #mz-list-container {
            background: #2b2b2b !important;
            border: 1px solid #333 !important;
            min-height: 60px;
            max-height: 200px;
            overflow-y: auto;
        }
        #mz-universal-widget {
            position: fixed; bottom: 10px; right: 10px; width: 380px; height: auto; max-height: 250px;
            background: #000000; color: #00ff00; padding: 10px; border-radius: 4px; font-family: 'Courier New', Courier, monospace;
            font-size: 12px; font-weight: bold; z-index: 999999; border: 1px solid #00ff00; overflow-y: auto; display: none;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.2); pointer-events: none; transition: opacity 0.3s ease; line-height: 1.4;
        }
        .mz-widget-row { margin-bottom: 3px; text-shadow: 0 0 2px #003300; }
        .mz-w-time { color: #006400; margin-right: 8px; font-size: 11px; }
        .mz-log-sent { color: #00FFFF; font-weight: bold; text-shadow: 0 0 5px #00FFFF; }
        .mz-log-success { color: #00FF00; }
        .mz-log-error { color: #FF3333; }
        .mz-log-warn { color: #FFA500; }
        .mz-log-info { color: #CCCCCC; }
        .mz-user-row { padding: 2px 0; cursor: grab; user-select: none; }
        .mz-user-row:hover { background-color: #333; }
        .mz-user-row.dragging { opacity: 0.5; border: 1px dashed #ffcc00; background-color: #1a1a1a; }
        #mz-ayar-paneli {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #fff; border: 1px solid #ccc; box-shadow: 0 5px 30px rgba(0,0,0,0.5);
            z-index: 10000; padding: 20px; border-radius: 8px; display: none; width: 800px;
            color: #333; font-family: Arial, sans-serif;
        }
        .ayar-satiri { display: flex; align-items: center; padding: 8px 4px; border-bottom: 1px solid #eee; }
        .ayar-baslik { font-weight: bold; background-color: #eee; display: flex; padding: 8px 4px; border-bottom: 2px solid #ccc; }
        .sutun { padding: 0 5px; }
        .sutun-teklif { flex: 1.5; }
        .sutun-mac { flex: 1.5; font-weight: bold; color: #007bff; }
        .sutun-aktif { flex: 0.5; text-align: center; }
        .sutun-taktik { flex: 3; }
        .buton-grup { margin-top: 15px; text-align: right; }
        .buton-grup button { padding: 8px 15px; margin-left: 5px; cursor: pointer; border: 1px solid #aaa; border-radius: 4px; }
        .kaydet-btn { background: #4CAF50; color: white; border: none !important; }
        .sifirla-btn { background: #FF9800; color: white; border: none !important; }
        .kapat-btn { background: #f44336; color: white; border: none !important; }
        `;
            document.head.appendChild(style);
        }

        // =================================================================================
        // 4. VERİ YÖNETİMİ
        // =================================================================================
        function getStoredUsers() {
            let raw = [];
            try { raw = JSON.parse(getPersistentData(KEY_USER_LIST, '[]')); } catch (e) { raw = []; }
            if (raw.length === 0) return [];
            let hasChanges = false;
            const normalized = raw.map(u => {
                if (typeof u === 'string') { hasChanges = true; return { name: u, days: [...VALID_DAYS] }; }
                else if (typeof u === 'object' && u !== null) {
                    if (!Array.isArray(u.days)) { u.days = [...VALID_DAYS]; hasChanges = true; }
                    return u;
                }
                return null;
            }).filter(u => u !== null);
            if (hasChanges) setPersistentData(KEY_USER_LIST, JSON.stringify(normalized));
            return normalized;
        }

        function saveStoredUsers(usersObjArray, forceSort = false) {
            const userMap = new Map();
            usersObjArray.forEach(user => { if (!userMap.has(user.name)) userMap.set(user.name, user); });
            const uniqueList = Array.from(userMap.values());
            if (forceSort) uniqueList.sort((a, b) => a.name.localeCompare(b.name));
            setPersistentData(KEY_USER_LIST, JSON.stringify(uniqueList));
            renderList();
        }

        function getSelectedUsers() { return JSON.parse(getPersistentData(KEY_SELECTED_USERS, '[]')); }

        function saveSelectionState() {
            const checkboxes = document.querySelectorAll('.mz-user-checkbox');
            const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
            setPersistentData(KEY_SELECTED_USERS, JSON.stringify(selected));
        }

        function getTacticsList() { return JSON.parse(getPersistentData(KEY_TACTIC_NAMES) || '[]').length > 0 ? JSON.parse(getPersistentData(KEY_TACTIC_NAMES)) : DEFAULT_TACTICS; }

        function fetchAndSaveTactics() {
            fetch(location.origin + '/?p=tactics').then(res => res.text()).then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const newTactics = [];
                const letters = "abcdefghijklmnopqrst".split("");
                letters.forEach(c => {
                    const tabId = `tacticTab_${c}`; const spanId = `tactic${c.toUpperCase()}Tab`;
                    const liElement = doc.getElementById(tabId); const spanElement = doc.getElementById(spanId);
                    if (liElement && spanElement && !liElement.classList.contains('ui-state-disabled')) {
                        newTactics.push({ val: c, txt: spanElement.innerText.trim() });
                    }
                });
                if(newTactics.length > 0) setPersistentData(KEY_TACTIC_NAMES, JSON.stringify(newTactics));
            });
        }

        // =================================================================================
        // 5. ARAYÜZ (PANEL) FONKSİYONLARI
        // =================================================================================
        let dragSourceEl = null; let autoScrollInterval = null; const SCROLL_SPEED = 5; const SCROLL_AREA_SIZE = 20;
        function startAutoScroll(direction) { if (autoScrollInterval) return; const listContainer = document.getElementById('mz-list-container'); autoScrollInterval = setInterval(() => { if (direction === 'up') listContainer.scrollTop -= SCROLL_SPEED; else if (direction === 'down') listContainer.scrollTop += SCROLL_SPEED; }, 20); }
        function stopAutoScroll() { if (autoScrollInterval) { clearInterval(autoScrollInterval); autoScrollInterval = null; } }
        function handleDragStart(e) { dragSourceEl = this; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/html', this.innerHTML); this.classList.add('dragging'); }
        function handleDragEnd(e) { this.classList.remove('dragging'); stopAutoScroll(); saveSelectionState(); }
        function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; const listContainer = document.getElementById('mz-list-container'); const rect = listContainer.getBoundingClientRect(); const mouseY = e.clientY; if (mouseY < rect.top + SCROLL_AREA_SIZE) startAutoScroll('up'); else if (mouseY > rect.bottom - SCROLL_AREA_SIZE) startAutoScroll('down'); else stopAutoScroll(); return false; }
        function handleDrop(e) { e.stopPropagation(); stopAutoScroll(); if (dragSourceEl !== this) { const listContainer = document.getElementById('mz-list-container'); const targetRow = this; const sourceRow = dragSourceEl; const children = Array.from(listContainer.children); const sourceIndex = children.indexOf(sourceRow); const targetIndex = children.indexOf(targetRow); if (sourceIndex < targetIndex) listContainer.insertBefore(sourceRow, targetRow.nextSibling); else listContainer.insertBefore(sourceRow, targetRow); } return false; }

        function renderList() {
            const c = document.getElementById('mz-list-container');
            if (!c) return;
            c.innerHTML = '';
            const allUsers = getStoredUsers();
            if (allUsers.length === 0) {
                c.innerHTML = `<div style="padding:10px; color:#999; text-align:center; font-style:italic; font-size:11px;">${getText('emptyList')}</div>`;
                return;
            }
            const selectedUsers = getSelectedUsers();
            allUsers.forEach((uObj, index) => {
                const uName = uObj.name;
                const validDayCount = uObj.days.filter(d => VALID_DAYS.includes(d)).length;
                const dayBadgeColor = validDayCount === 0 ? '#ff4444' : (validDayCount < 5 ? '#ffbb33' : '#00C851');
                const d = document.createElement('div');
                d.className = 'mz-user-row';
                d.draggable = true;
                d.style.display = 'flex'; d.style.alignItems = 'center'; d.style.justifyContent = 'space-between'; d.style.padding = '4px';
                d.addEventListener('dragstart', handleDragStart); d.addEventListener('dragover', handleDragOver); d.addEventListener('drop', handleDrop); d.addEventListener('dragend', handleDragEnd);
                const isChecked = selectedUsers.includes(uName) ? 'checked' : '';
                d.innerHTML = `
                <div style="display:flex; align-items:center; gap:5px; overflow:hidden;">
                    <input type="checkbox" class="mz-user-checkbox" value="${uName}" ${isChecked}>
                    <span onclick="this.previousElementSibling.click()" style="cursor:pointer; font-weight:bold;">${uName}</span>
                </div>
                <button class="mz-day-config-btn" data-index="${index}" style="background:none; border:1px solid ${dayBadgeColor}; color:${dayBadgeColor}; border-radius:4px; cursor:pointer; font-size:9px; padding:2px 5px;" title="Günleri Düzenle">
                    📅 ${validDayCount}/5
                </button>
            `;
                c.appendChild(d);
                d.querySelector('.mz-user-checkbox').addEventListener('change', saveSelectionState);
                d.querySelector('.mz-day-config-btn').addEventListener('click', (e) => { e.stopPropagation(); openUserDaySettings(index); });
            });
        }

        function openUserDaySettings(userIndex) {
            const allUsers = getStoredUsers();
            const userObj = allUsers[userIndex];
            const dayNamesList = getText('dayNames');
            const modalId = 'mz-user-day-modal';
            document.getElementById(modalId)?.remove();
            const modal = document.createElement('div');
            modal.id = modalId;
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:100000; display:flex; justify-content:center; align-items:center;';
            let checksHtml = '';
            VALID_DAYS.forEach(i => {
                const isChecked = userObj.days.includes(i) ? 'checked' : '';
                checksHtml += `<label style="display:block; padding:8px 5px; cursor:pointer; border-bottom:1px solid #eee;"><input type="checkbox" class="mz-uday-check" value="${i}" ${isChecked}> ${dayNamesList[i]}</label>`;
            });
            modal.innerHTML = `
            <div style="background:#fff; padding:20px; border-radius:8px; width:260px; color:#333; font-family:Arial; box-shadow:0 0 20px rgba(0,0,0,0.5);">
                <h4 style="margin-top:0; border-bottom:2px solid #007bff; padding-bottom:5px; color:#007bff;">${userObj.name}</h4>
                <div style="font-size:11px; color:#666; margin-bottom:10px;">${getText('modalHelper')}</div>
                <div style="margin-bottom:15px; max-height:250px; overflow-y:auto;">${checksHtml}</div>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button id="mz-uday-select-all" style="background:#607D8B; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px; font-size:11px;">${getText('btnSelectAll')}</button>
                    <div>
                        <button id="mz-uday-save" style="background:#4CAF50; color:white; border:none; padding:5px 15px; cursor:pointer; border-radius:4px;">${getText('btnSave')}</button>
                        <button id="mz-uday-close" style="background:#f44336; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px; margin-left:5px;">${getText('btnCancel')}</button>
                    </div>
                </div>
            </div>`;
            document.body.appendChild(modal);
            modal.querySelector('#mz-uday-close').onclick = () => modal.remove();
            modal.querySelector('#mz-uday-select-all').onclick = () => {
                const allChecks = modal.querySelectorAll('.mz-uday-check');
                const areAllChecked = Array.from(allChecks).every(cb => cb.checked);
                allChecks.forEach(cb => cb.checked = !areAllChecked);
            };
            modal.querySelector('#mz-uday-save').onclick = () => {
                const newDays = [];
                modal.querySelectorAll('.mz-uday-check:checked').forEach(cb => newDays.push(parseInt(cb.value)));
                const freshList = getStoredUsers();
                if (freshList[userIndex]) { freshList[userIndex].days = newDays; saveStoredUsers(freshList, false); }
                modal.remove();
            };
        }

        function initMainPanel() {
            const mainPanel = document.createElement('div');
            mainPanel.id = 'mz-main-panel';
            mainPanel.innerHTML = `
            <div id="mz-panel-header"><span>${getText('panelTitle')}</span><span id="mz-arrow">▼</span></div>
            <div id="mz-panel-body">
                <div style="margin-bottom:8px;">
                    <textarea id="mz-input-area" placeholder="${getText('inputPlaceholder')}" style="width:96%; height:40px; background:#333; color:#fff; border:1px solid #555; font-size:11px; margin-bottom:2px;"></textarea>
                    <div style="display:flex; gap:2px;">
                        <button id="mz-add-btn" style="flex:1; background:#2196F3; color:white; border:none; padding:4px; cursor:pointer;">${getText('addBtn')}</button>
                        <button id="mz-add-friends-btn" style="flex:1; background:#9C27B0; color:white; border:none; padding:4px; cursor:pointer;">${getText('addFriendsBtn')}</button>
                    </div>
                </div>
                <div style="border-top:1px solid #444; border-bottom:1px solid #444; padding:5px 0; margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                        <span style="font-size:11px; color:#aaa;">${getText('listHeader')}</span>
                        <div><a href="#" id="mz-select-all" style="color:#aaa;">${getText('selectAll')}</a> / <a href="#" id="mz-delete-selected" style="color:#f44336;">${getText('deleteSelected')}</a></div>
                    </div>
                    <div id="mz-list-container"></div>
                </div>
                <div style="background:#333; padding:5px; border-radius:4px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;">
                    <label for="mz-auto-mode-toggle" style="cursor:pointer; color:#0f0; font-weight:bold; font-size:11px;">${getText('autoModeLabel')}</label>
                    <input type="checkbox" id="mz-auto-mode-toggle" style="cursor:pointer;">
                </div>
                <div style="display:flex; gap:2px; margin-bottom: 8px;">
                     <button id="mz-settings-toggle" style="flex:1; background:#607D8B; color:white; border:none; padding:6px; cursor:pointer;">${getText('settingsToggle')}</button>
                </div>
                <div style="display:flex; gap:5px;">
                    <button id="mz-start-btn" style="flex:1; background: #4CAF50; color: white; border: none; padding: 8px; cursor: pointer;">${getText('startBtn')}</button>
                    <button id="mz-stop-btn" style="flex:1; background: #f44336; color: white; border: none; padding: 8px; cursor: pointer;">${getText('stopBtn')}</button>
                </div>
            </div>
        `;
            bindEvents(mainPanel);
            const targetID = 'back-to-overview';
            const checkExist = setInterval(() => {
                const target = document.getElementById(targetID);
                if (target && target.parentNode && !document.getElementById('mz-main-panel')) {
                    clearInterval(checkExist); target.parentNode.insertBefore(mainPanel, target);
                    setTimeout(() => {
                        fetchAndSaveTactics();
                        renderList();
                        const autoStatus = getQueueData();
                        const toggle = mainPanel.querySelector('#mz-auto-mode-toggle');
                        if(toggle) toggle.checked = autoStatus.enabled;
                    }, 500);
                }
            }, 250);
        }

        function bindEvents(panel) {
            const header = panel.querySelector('#mz-panel-header');
            const body = panel.querySelector('#mz-panel-body');
            const arrow = panel.querySelector('#mz-arrow');

            if(header) {
                header.onclick = function() {
                    if (body.style.display === 'none' || body.style.display === '') {
                        body.style.display = 'block';
                        arrow.innerText = '▲';
                        renderList();
                    } else {
                        body.style.display = 'none';
                        arrow.innerText = '▼';
                    }
                };
            }

            panel.querySelector('#mz-auto-mode-toggle').addEventListener('change', (e) => {
                const status = getQueueData();
                status.enabled = e.target.checked;
                if(!e.target.checked) status.queue = [];
                setQueueData(status);
                logToWidget(e.target.checked ? "> OTO MOD AÇILDI" : "> OTO MOD KAPATILDI", e.target.checked ? 'success' : 'warn');
            });

            panel.querySelector('#mz-settings-toggle').addEventListener('click', () => {
                ayarlarPaneliniOlustur();
                document.getElementById('mz-ayar-paneli').style.display = 'block';
            });

            panel.querySelector('#mz-add-btn').addEventListener('click', () => {
                const area = panel.querySelector('#mz-input-area');
                const rawTxt = area.value.trim();
                if(!rawTxt) return;
                const namesToAdd = rawTxt.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                const currentStoredList = getStoredUsers();
                namesToAdd.forEach(name => {
                    const exists = currentStoredList.some(user => user.name === name);
                    if (!exists) {
                        currentStoredList.push({ name: name, days: [...VALID_DAYS] });
                    }
                });
                saveStoredUsers(currentStoredList, true);
                area.value = '';
            });

            panel.querySelector('#mz-add-friends-btn').addEventListener('click', () => {
                const buddyList = document.getElementById('buddy_list');
                if (!buddyList) { alert(getText('noBuddyList')); return; }
                const links = buddyList.querySelectorAll('a.clippable');
                const namesToAdd = Array.from(links).map(l => l.innerText.trim());
                const currentStoredList = getStoredUsers();
                let addedCount = 0;
                namesToAdd.forEach(name => {
                    const exists = currentStoredList.some(user => user.name === name);
                    if (!exists) {
                        currentStoredList.push({ name: name, days: [...VALID_DAYS] });
                        addedCount++;
                    }
                });
                saveStoredUsers(currentStoredList, true);
                alert(`${addedCount} yeni kişi eklendi.`);
            });

            panel.querySelector('#mz-select-all').addEventListener('click', (e) => {
                e.preventDefault(); const cbs = document.querySelectorAll('.mz-user-checkbox');
                const all = Array.from(cbs).every(cb => cb.checked);
                cbs.forEach(cb => cb.checked = !all); saveSelectionState();
            });

            panel.querySelector('#mz-delete-selected').addEventListener('click', (e) => {
                e.preventDefault();
                const cbs = document.querySelectorAll('.mz-user-checkbox');
                const toDeleteNames = Array.from(cbs).filter(cb => cb.checked).map(cb => cb.value);
                if(toDeleteNames.length > 0 && confirm(getText('confirmDelete', toDeleteNames.length))) {
                    const currentList = getStoredUsers();
                    const newList = currentList.filter(u => !toDeleteNames.includes(u.name));
                    saveStoredUsers(newList, false);
                    const currentSelected = getSelectedUsers();
                    const newSelected = currentSelected.filter(u => !toDeleteNames.includes(u));
                    setPersistentData(KEY_SELECTED_USERS, JSON.stringify(newSelected));
                }
            });

            panel.querySelector('#mz-start-btn').addEventListener('click', () => {
                const cbs = document.querySelectorAll('.mz-user-checkbox:checked');
                const selectedNames = Array.from(cbs).map(cb => cb.value);
                if (selectedNames.length === 0) { alert(getText('noSelection')); return; }
                const allUsers = getStoredUsers();
                const queueObjs = allUsers.filter(u => selectedNames.includes(u.name));

                const status = getQueueData();
                status.enabled = true;
                status.queue = queueObjs;
                status.lastRun = 0; // Manuel başlatıldığı için 0 yapıyoruz
                setQueueData(status);

                document.getElementById('mz-auto-mode-toggle').checked = true;
                location.reload();
            });

            panel.querySelector('#mz-stop-btn').addEventListener('click', () => {
                const status = getQueueData();
                status.enabled = false; status.queue = [];
                setQueueData(status);
                location.reload();
            });
        }

        function ayarlarPaneliniOlustur() {
            if (document.getElementById('mz-ayar-paneli')) { document.getElementById('mz-ayar-paneli').style.display = 'block'; return; }
            const panel = document.createElement('div'); panel.id = 'mz-ayar-paneli';
            let html = `<h3 style="border-bottom: 2px solid #ccc; padding-bottom:10px;">${getText('settingsTitle')}</h3>
                    <div class="ayar-tablosu">
                        <div class="ayar-baslik">
                            <span class="sutun sutun-teklif">${getText('colOfferDay')}</span>
                            <span class="sutun sutun-mac">${getText('colMatchDay')}</span>
                            <span class="sutun sutun-aktif" style="text-align:center">${getText('colActive')}</span>
                            <span class="sutun sutun-taktik">${getText('colTacticHome')}</span>
                            <span class="sutun sutun-taktik">${getText('colTacticAway')}</span>
                        </div>`;
            const currentTactics = getTacticsList();
            const options = currentTactics.map(t => `<option value="${t.val}">${t.txt} (${t.val.toUpperCase()})</option>`).join('');
            const customGroups = [
                { matchDay: GUNLER[2], offerIndices: [1] },
                { matchDay: GUNLER[4], offerIndices: [2, 3] },
                { matchDay: GUNLER[5], offerIndices: [4] },
                { matchDay: GUNLER[6], offerIndices: [5] },
                { matchDay: GUNLER[1], offerIndices: [6, 0] }
            ];
            const getOfferDayNames = (indices) => indices.map(i => GUNLER[i]).join(', ');
            customGroups.forEach(group => {
                const offerDays = getOfferDayNames(group.offerIndices);
                html += `<div class="ayar-satiri" data-indices="${group.offerIndices.join(',')}">
                        <span class="sutun sutun-teklif" style="font-size:12px;">${offerDays}</span>
                        <span class="sutun sutun-mac" style="font-size:12px;">${group.matchDay}</span>
                        <span class="sutun sutun-aktif"><input type="checkbox" class="gun-aktif-check"></span>
                        <span class="sutun sutun-taktik"><select class="taktik-secim-home" style="display:none; width:95%; font-size:11px;">${options}</select></span>
                        <span class="sutun sutun-taktik"><select class="taktik-secim-away" style="display:none; width:95%; font-size:11px;">${options}</select></span>
                     </div>`;
            });
            html += `</div>
                 <div class="buton-grup">
                    <button class="kaydet-btn" style="background: #4CAF50; color: white;">${getText('saveButton')}</button>
                    <button class="sifirla-btn" style="background: #FF5722; color: white;">${getText('resetButton')}</button>
                    <button class="kapat-btn" style="background: #607D8B; color: white;">${getText('closeButton')}</button>
                 </div>
                 <div style="font-size:10px; color:#666; margin-top:10px; text-align:center;">${getText('settingsNote')}</div>`;
            panel.innerHTML = html; document.body.appendChild(panel);
            panel.querySelector('.kapat-btn').addEventListener('click', () => panel.style.display = 'none');
            panel.querySelector('.kaydet-btn').addEventListener('click', () => {
                try {
                    const settings = {};
                    panel.querySelectorAll('.ayar-satiri').forEach(row => {
                        const active = row.querySelector('.gun-aktif-check').checked;
                        const tacticHomeVal = row.querySelector('.taktik-secim-home').value;
                        const tacticAwayVal = row.querySelector('.taktik-secim-away').value;
                        row.dataset.indices.split(',').forEach(dayIndex => { settings[dayIndex] = { aktif: active, taktikHome: tacticHomeVal, taktikAway: tacticAwayVal }; });
                    });
                    setPersistentData(KEY_SETTINGS, JSON.stringify(settings));
                    alert(getText('alertSaved'));
                    panel.style.display = 'none';
                } catch (e) { alert(getText('alertSaveError') + e.message); }
            });
            panel.querySelector('.sifirla-btn').addEventListener('click', () => {
                if(confirm(getText('alertResetConfirm'))) {
                    removePersistentData(KEY_SETTINGS);
                    removePersistentData(KEY_TACTIC_NAMES);
                    location.reload();
                }
            });
            panel.querySelectorAll('.gun-aktif-check').forEach(cb => {
                cb.addEventListener('change', e => {
                    const row = e.target.closest('.ayar-satiri');
                    row.querySelector('.taktik-secim-home').style.display = e.target.checked ? 'inline-block' : 'none';
                    row.querySelector('.taktik-secim-away').style.display = e.target.checked ? 'inline-block' : 'none';
                });
            });
            loadSettingsToPanel();
        }

        function loadSettingsToPanel() {
            const settings = JSON.parse(getPersistentData(KEY_SETTINGS, '{}'));
            document.querySelectorAll('#mz-ayar-paneli .ayar-satiri').forEach(row => {
                const idx = row.dataset.indices.split(',')[0];
                const conf = settings[idx];
                const cb = row.querySelector('.gun-aktif-check');
                const selHome = row.querySelector('.taktik-secim-home');
                const selAway = row.querySelector('.taktik-secim-away');
                if(conf) {
                    cb.checked = conf.aktif;
                    selHome.value = conf.taktikHome || 'a';
                    selAway.value = conf.taktikAway || 'a';
                    selHome.style.display = conf.aktif ? 'inline-block' : 'none';
                    selAway.style.display = conf.aktif ? 'inline-block' : 'none';
                } else {
                    cb.checked = false; selHome.style.display = 'none'; selAway.style.display = 'none';
                }
            });
        }

        // =================================================================================
        // 6. YÖNETİCİ (BACKGROUND MANAGER) FONKSİYONLARI (GÜNCELLENDİ: 6 SAAT KONTROLÜ)
        // =================================================================================
        function initBackgroundManager() {
            const autoStatus = getQueueData();
            const now = Date.now();
            const lastRun = parseInt(autoStatus.lastRun) || 0; // Timestamp olarak al
            const selectedUsers = JSON.parse(getPersistentData(KEY_SELECTED_USERS, '[]'));

            // --- ZAMAN KONTROLÜ (6 SAAT) ---
            // Eğer 6 saat geçtiyse (21600000 ms) ve listede kullanıcı varsa çalıştır
            if (selectedUsers.length > 0 && (now - lastRun > INTERVAL_MS)) {
                // Otomatik mod kapalı olsa bile zaman geldiyse zorla aç
                if (!autoStatus.enabled) {
                    autoStatus.enabled = true;
                    setQueueData(autoStatus);
                    console.log("[MZ Otomasyon] 6 saat doldu. Otomatik başlatıldı.");
                }
            }

            if (!autoStatus.enabled) return;

            // Eğer süre dolmadıysa ve kuyruk boşsa dur
            if ((now - lastRun < INTERVAL_MS) && autoStatus.queue.length === 0) return;

            // Kuyruk boşsa ve zamanı geldiyse kuyruğu doldur
            if (!autoStatus.queue || autoStatus.queue.length === 0) {
                const allUserObjects = getStoredUsers();
                const queueObjects = allUserObjects.filter(u => selectedUsers.includes(u.name));

                if (queueObjects.length > 0) {
                    autoStatus.queue = queueObjects;
                    // lastRun'ı hemen güncelleme, işlem bitince güncelleyeceğiz
                    setQueueData(autoStatus);
                    logToWidget(getText('logSystemStart', queueObjects.length), 'success');
                } else { return; }
            }

            if (autoStatus.queue.length > 0) {
                logToWidget(getText('logRobotCall'), 'warn');
                createWorkerIframe();
            }

            window.addEventListener('message', function(e) {
                if (e.data.type === 'MZ_WORKER_LOG') {
                    logToWidget(e.data.msg, e.data.logType);
                }
                if (e.data.type === 'MZ_WORKER_READY') {
                    const currentStatus = getQueueData();
                    if (currentStatus.queue && currentStatus.queue.length > 0) {
                        const nextUser = currentStatus.queue[0];
                        const allSettings = JSON.parse(getPersistentData(KEY_SETTINGS, '{}'));
                        const allTactics = getTacticsList();

                        const iframe = document.getElementById('mz_worker_frame');
                        if(iframe) {
                            iframe.contentWindow.postMessage({
                                type: 'MZ_START_JOB',
                                user: nextUser,
                                settings: allSettings,
                                tactics: allTactics
                            }, '*');
                        }
                    }
                }
                if (e.data.type === 'MZ_WORKER_USER_DONE') {
                    const currentStatus = getQueueData();
                    const finishedUserObj = currentStatus.queue.shift();
                    const finishedUserName = finishedUserObj ? finishedUserObj.name : "Unknown";
                    setQueueData(currentStatus);
                    logToWidget(getText('logProcessDone', finishedUserName, currentStatus.queue.length), 'success');
                    const frame = document.getElementById('mz_worker_frame');
                    if (currentStatus.queue.length > 0) {
                        if(frame) frame.src = frame.src;
                    } else {
                        // --- İŞLEM TAMAMLANDI: ZAMANI KAYDET ---
                        currentStatus.lastRun = Date.now(); // Şimdiki zamanı kaydet
                        setQueueData(currentStatus);

                        logToWidget(getText('logAllComplete'), 'success');
                        if(frame) frame.remove();
                        setTimeout(() => {
                            document.getElementById('mz-universal-widget')?.remove();
                            localStorage.setItem('mz_redirect_to_sent_offers', 'true');
                            location.reload();
                        }, 2000);
                    }
                }
            });
        }

        function createWorkerIframe() {
            if (document.getElementById('mz_worker_frame')) return;
            const iframe = document.createElement('iframe');
            iframe.id = 'mz_worker_frame';
            iframe.name = 'mz_auto_worker_frame';
            iframe.src = 'https://www.managerzone.com/?p=challenges&mz_mode=worker';
            iframe.style.width = '1366px'; iframe.style.height = '768px'; iframe.style.position = 'fixed';
            iframe.style.bottom = '0'; iframe.style.right = '0'; iframe.style.opacity = '0.01';
            iframe.style.pointerEvents = 'none'; iframe.style.zIndex = '99999'; iframe.style.left = '-10000px';
            document.body.appendChild(iframe);
        }

        // =================================================================================
        // 7. İŞÇİ (WORKER) FONKSİYONLARI
        // =================================================================================
        function waitForSearchBox(attempts = 0) {
            const searchInput = document.getElementById('search-string');
            if (searchInput) {
                if(window.parent) window.parent.postMessage({type: 'MZ_WORKER_READY'}, '*');
                window.addEventListener('message', (e) => {
                    if (e.data.type === 'MZ_START_JOB') {
                        processUserLoop(e.data.user, e.data.settings, e.data.tactics);
                    }
                });
            } else {
                if (attempts < 40) setTimeout(() => waitForSearchBox(attempts + 1), 500);
                else {
                    if(window.parent) window.parent.postMessage({type: 'MZ_WORKER_LOG', msg: getText('logErrorTimeout'), logType: 'error'}, '*');
                    if(window.parent) window.parent.postMessage({type: 'MZ_WORKER_USER_DONE'}, '*');
                }
            }
        }

        async function processUserLoop(userObj, globalSettings, globalTactics) {
            if (typeof userObj === 'string') {
                userObj = { name: userObj, days: [0,1,2,3,4,5,6] };
            }

            const user = userObj.name;
            const allowedDays = userObj.days;

            const searchInput = document.getElementById('search-string');
            const searchBtn = document.getElementById('fss-submit');
            if (!searchInput) { window.parent.postMessage({type: 'MZ_WORKER_USER_DONE'}, '*'); return; }

            const currentFound = document.querySelector('#search-response-found a');
            const isAlreadySearched = currentFound && document.getElementById('search-string').value === user;

            if (!isAlreadySearched) {
                window.parent.postMessage({type: 'MZ_WORKER_LOG', msg: getText('logSearch', user), logType: 'info'}, '*');
                searchInput.value = user; searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                if(searchBtn.onclick) searchBtn.click();
                else searchBtn.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
                await wait(2500);
            }

            const teamLink = document.querySelector('#search-response-found a');
            if (!teamLink) {
                window.parent.postMessage({type: 'MZ_WORKER_LOG', msg: getText('logNotFound', user), logType: 'warn'}, '*');
                window.parent.postMessage({type: 'MZ_WORKER_USER_DONE'}, '*');
                return;
            }
            const targetTeamName = teamLink.innerText.trim();

            const buttons = document.querySelectorAll('.fss-challenge-button');
            let targetBtn = null;
            let dayText = "";
            let settingKeyToUse = null;
            let detectedMatchDayCode = "";
            const gunIsimleri = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

            const getSettingKeyFromMatchDay = (matchDayIndex) => {
                if (matchDayIndex === 2) return '1';
                if (matchDayIndex === 4) return '2';
                if (matchDayIndex === 5) return '4';
                if (matchDayIndex === 6) return '5';
                if (matchDayIndex === 1) return '6';
                return null;
            };

            const isChallengeAlreadySent = (targetTeamName, dayText) => {
                const outTable = document.querySelector('#matches_out tbody');
                if (!outTable) return false;
                const rows = outTable.querySelectorAll('tr');
                for (let row of rows) {
                    const dayCell = row.querySelector('td:nth-child(2) span');
                    const rowDay = dayCell ? dayCell.innerText.trim() : "";
                    if (!rowDay.includes(dayText)) continue;
                    const teamLink = row.querySelector('td:nth-child(1) a');
                    const rowTeamName = teamLink ? teamLink.innerText.trim() : "";
                    if (rowTeamName === targetTeamName) return true;
                }
                return false;
            };

            const savedSettings = globalSettings || {};

            for (let btn of buttons) {
                if (btn.offsetParent !== null && (btn.innerText.includes("Maç Teklifleri") || btn.innerText.includes("Challenge"))) {
                    const dayContainer = btn.closest('.fss-d');
                    if (dayContainer) {
                        const header = dayContainer.querySelector('.fss-header');
                        const dayNum = header.innerText.replace(/\D/g, '');
                        const currentDayText = `Gün ${dayNum}`;

                        if (isChallengeAlreadySent(targetTeamName, currentDayText)) continue;

                        const dateStrong = dayContainer.querySelector('.date-range strong');
                        if (dateStrong) {
                            const rawText = dateStrong.innerText;
                            const dateMatch = rawText.match(/(\d{1,2})[\/.-](\d{1,2})/);

                            if (dateMatch) {
                                const dayVal = parseInt(dateMatch[1], 10);
                                const monthVal = parseInt(dateMatch[2], 10) - 1;
                                const now = new Date();
                                let yearVal = now.getFullYear();
                                if (now.getMonth() === 11 && monthVal === 0) yearVal++;
                                const matchDateObj = new Date(yearVal, monthVal, dayVal);
                                const dayIndex = matchDateObj.getDay();

                                if (!allowedDays.includes(dayIndex)) {
                                    continue;
                                }

                                const dayName = gunIsimleri[dayIndex];
                                const foundKey = getSettingKeyFromMatchDay(dayIndex);
                                if (foundKey && savedSettings[foundKey] && savedSettings[foundKey].aktif) {
                                    settingKeyToUse = foundKey;
                                    targetBtn = btn;
                                    dayText = currentDayText;
                                    detectedMatchDayCode = dayName;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if (!targetBtn || !settingKeyToUse) {
                window.parent.postMessage({type: 'MZ_WORKER_LOG', msg: getText('logNoDay', user), logType: 'info'}, '*');
                window.parent.postMessage({type: 'MZ_WORKER_USER_DONE'}, '*');
                return;
            }

            const configToUse = savedSettings[settingKeyToUse];
            targetBtn.click();
            await wait(2000);

            const applyTactic = (selector, tacticVal) => {
                if (!tacticVal) return;
                const storedTactics = globalTactics || [];
                const tacticConfig = storedTactics.find(t => t.val === tacticVal);
                const targetName = tacticConfig ? tacticConfig.txt.trim() : null;
                const selectEl = $(selector);
                if (selectEl.length > 0) {
                    let foundIndex = -1;
                    let foundValue = null;
                    selectEl.find('option').each(function(index) {
                        if (targetName && $(this).text().trim().toLowerCase() === targetName.toLowerCase()) {
                            foundIndex = index; foundValue = $(this).val(); return false;
                        }
                    });
                    if (foundIndex === -1) {
                        const letterIndex = tacticVal.toLowerCase().charCodeAt(0) - 97;
                        if (letterIndex < selectEl[0].options.length) {
                            foundIndex = letterIndex; foundValue = selectEl[0].options[letterIndex].value;
                        }
                    }
                    if (foundIndex !== -1 && foundValue) {
                        selectEl[0].selectedIndex = foundIndex;
                        selectEl[0].value = foundValue;
                        selectEl.val(foundValue);
                        selectEl[0].dispatchEvent(new Event('change', { bubbles: true }));
                        selectEl.trigger('change');
                    }
                }
            };

            if (configToUse.taktikHome) applyTactic('select[name="tactic_home"]', configToUse.taktikHome);
            if (configToUse.taktikAway) applyTactic('select[name="tactic_away"]', configToUse.taktikAway);

            await wait(1000);

            let sendBtn = null;
            document.querySelectorAll('.send-challenge-btn').forEach(b => { if (b.offsetParent !== null) sendBtn = b; });
            if (sendBtn) {
                sendBtn.click();
                window.parent.postMessage({type: 'MZ_WORKER_LOG', msg: getText('logOfferSent', user, dayText + " (" + detectedMatchDayCode + ")"), logType: 'sent'}, '*');
                await wait(2500);
                location.reload();
            } else {
                const closeBtn = document.querySelector('.fss-reset');
                if(closeBtn) closeBtn.click();
                window.parent.postMessage({type: 'MZ_WORKER_USER_DONE'}, '*');
            }
        }

        // =================================================================================
        // 8. ÇALIŞTIRMA MANTIĞI
        // =================================================================================
        if (isWorkerMode) {
            if (document.readyState === "complete" || document.readyState === "interactive") {
                waitForSearchBox();
            } else {
                window.addEventListener('load', () => waitForSearchBox());
            }
        } else if (window.top === window.self) {
            // Normal sayfadaysak:
            // 1. Panel arayüzünü sadece challenges sayfasındaysak yükle
            if (isChallengePage) initMainPanel();

            // 2. Arka plan yöneticisini HER SAYFADA yükle (Artık 6 saat kontrolünü burada yapıyor)
            if (document.readyState === "complete" || document.readyState === "interactive") {
                initBackgroundManager();
            } else {
                window.addEventListener('load', initBackgroundManager);
            }
        }

        if (localStorage.getItem('mz_redirect_to_sent_offers') === 'true') {
            localStorage.removeItem('mz_redirect_to_sent_offers');
            $(document).ready(function() {
                setTimeout(() => {
                    const targetTab = $('a[href="#matches_out_wrapper"]');
                    if (targetTab.length > 0) {
                        targetTab.click();
                        $('html, body').animate({ scrollTop: targetTab.offset().top - 150 }, 500);
                    }
                }, 800);
            });
        }
    }

/****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 15: LINK ENHANCEMENTS (Link İyileştirmeleri) - v5.0 (Başlık Eşleştirme)       *
 *                                                                                      *
 ****************************************************************************************/
function initializeLinkEnhancements() {
    'use strict';
    const currentUrl = window.location.href;
    const $ = unsafeWindow.jQuery;

    // --- Alt Modül: Lig Tablosu Link Düzeltici (Değişiklik Yok) ---
    if (currentUrl.includes('?p=league')) {
        const fixLeagueLinks = () => {
            const rows = document.querySelectorAll('.nice_table tbody tr');
            if (rows.length === 0) return;

            rows.forEach(row => {
                const weirdLink = row.querySelector('a[href*="?p=league"][href*="tid="]');
                if (weirdLink) {
                    try {
                        const hrefParts = weirdLink.getAttribute('href').split('?')[1];
                        const urlParams = new URLSearchParams(hrefParts);
                        const tid = urlParams.get('tid');

                        if (tid) {
                            weirdLink.href = `/?p=team&tid=${tid}`;
                        }
                    } catch (e) {
                        // Sessizce geç
                    }
                }
            });
        };

        fixLeagueLinks();

        const observer = new MutationObserver((mutations) => {
            const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);
            if (hasAddedNodes) fixLeagueLinks();
        });

        const contentDiv = document.getElementById('contentDiv');
        if (contentDiv) {
            observer.observe(contentDiv, { childList: true, subtree: true });
        }
    }

    // --- Alt Modül: Maç Sayfası Lig Linki Ekleme (YENİ MANTIK) ---
    else if (currentUrl.includes('?p=match&sub=result&mid=')) {

        // Profilden belirli bir kategoriye (etikete) ait ligi bulan fonksiyon
        const findSpecificLeagueFromProfile = (htmlContent, matchCategoryText) => {
            const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
            const infoBlock = doc.querySelector('#infoAboutTeam');
            if (!infoBlock) return null;

            const rows = infoBlock.querySelectorAll('dd');

            // "U18 Ligi" gibi başlıkları temizleyip eşleştirmek için yardımcı
            const cleanText = (txt) => txt.replace(':', '').trim().toLowerCase();
            const targetCategory = cleanText(matchCategoryText);

            for (let row of rows) {
                const labelSpan = row.querySelector('.teamExpText');
                if (!labelSpan) continue;

                const labelText = cleanText(labelSpan.textContent);

                // EŞLEŞTİRME MANTIĞI:
                // Maç başlığındaki yazı (örn: "U18 Ligi") ile profil satırındaki yazı eşleşiyor mu?
                if (labelText === targetCategory) {
                    const link = row.querySelector('a');
                    if (link) {
                        return {
                            name: link.textContent.trim(), // Örn: "Turkey - div2.3"
                            url: link.href // Örn: /?p=league&type=u18&sid=...
                        };
                    }
                }
            }
            return null;
        };

        const enrichMatchHeader = async () => {
            const wrapper = document.querySelector('#match-info-wrapper');
            if (!wrapper) return;

            // 1. ADIM: Maçın Kategorisini H1'den Al (Örn: "U18 Ligi", "Lig", "Resmi Kupa")
            const headerH1 = wrapper.querySelector('h1');
            if (!headerH1) return;

            const matchCategoryText = headerH1.textContent.trim();
            if (!matchCategoryText) return;

            const subHeader = wrapper.querySelector('h2');

            // Eğer H2 içinde zaten "divX.X" gibi çalışan bir link varsa dokunmayalım (Opsiyonel, duruma göre kaldırılabilir)
            // Ancak MZ bazen yanlış link veriyor (örnekteki u23_world hatası gibi), o yüzden her durumda düzeltmeyi deneyebiliriz.
            // if (subHeader && subHeader.querySelector('a')) return;

            // Takım Linkini Bul (Sadece ev sahibi yeterli olur ama garanti olsun diye ilk bulduğumuzu alalım)
            const teamLink = wrapper.querySelector('a[href*="/?p=team&tid="]');
            if (!teamLink) return;

            try {
                // Takımın profil sayfasını çek
                const response = await fetch(teamLink.href);
                const html = await response.text();

                // H1'deki kategoriye (matchCategoryText) karşılık gelen ligi profilden bul
                const foundLeague = findSpecificLeagueFromProfile(html, matchCategoryText);

                if (foundLeague) {
                    // URL'den tid parametresini temizle (temiz lig linki olsun)
                    let cleanUrl = foundLeague.url;
                    /* Eğer URL tam path değilse başına domain ekle (Browser otomatik halleder ama garanti olsun) */

                    // H2 etiketi varsa içini değiştir, yoksa oluştur.
                    if (subHeader) {
                        subHeader.innerHTML = `<a href="${cleanUrl}">${foundLeague.name}</a>`;
                    } else {
                        const newH2 = document.createElement('h2');
                        newH2.style.margin = "0 0 10px 10px";
                        newH2.style.padding = "0";
                        newH2.style.fontSize = "12px";
                        newH2.innerHTML = `<a href="${cleanUrl}">${foundLeague.name}</a>`;
                        headerH1.after(newH2);
                    }
                    console.log(`[LinkEnhancer] Lig linki düzeltildi: ${matchCategoryText} -> ${foundLeague.name}`);
                } else {
                    console.log(`[LinkEnhancer] Bu kategori (${matchCategoryText}) için profilde karşılık bulunamadı.`);
                }

            } catch (err) {
                console.error("[LinkEnhancer] Veri çekme hatası:", err);
            }
        };

        enrichMatchHeader();
    }
}

/****************************************************************************************
 *                                                                                      *
 *  BÖLÜM EK: SATIŞ VERGİSİ HESAPLAYICI (EVRENSEL DİL DESTEĞİ v7)                       *
 *                                                                                      *
 ****************************************************************************************/
function initializeSellTaxCalculator() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    console.log('[MZ TAX v7] Modül Başlatıldı (Universal Language Fix).');

    const i18n = {
        tr: {
            calcTitle: "Vergi İndirimi Hesaplayıcısı",
            lastTransferDate: "Son Transfer Tarihi",
            daysElapsed: "Geçen Süre",
            currentTax: "Mevcut Vergi",
            days: "gün",
            taxDrop50: "%50'ye Düşüş",
            taxDrop15: "%15'e Düşüş",
            originalPlayer: "İlk/Altyapı Oyuncusu",
            originalNote: "Vergi sadece yaşa bağlıdır.",
            passed: "Geçti",
            age: "Yaş",
            nextSeason: "Gelecek Sezon",
            taxDrop20: "%20'ye Düşüş (20 Yaş)",
            taxDrop15_age: "%15'e Düşüş (21 Yaş)",
            minTaxReached: "Minimum vergi oranına ulaşıldı (%15)."
        },
        en: {
            calcTitle: "Tax Calculator",
            lastTransferDate: "Last Transfer",
            daysElapsed: "Elapsed",
            currentTax: "Current Tax",
            days: "days",
            taxDrop50: "Drop to 50%",
            taxDrop15: "Drop to 15%",
            originalPlayer: "Original Player",
            originalNote: "Tax depends on age only.",
            passed: "Passed",
            age: "Age",
            nextSeason: "Next Season",
            taxDrop20: "Drop to 20% (Age 20)",
            taxDrop15_age: "Drop to 15% (Age 21)",
            minTaxReached: "Minimum tax rate reached (15%)."
        }
    };
    const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
    const getText = (key) => i18n[lang][key] || i18n['en'][key];

    function formatDate(date) {
        return date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB');
    }

    /**
     * Oyuncunun yaşını bulur. (Dilden bağımsız - Yapısal Analiz)
     * MZ HTML yapısında yaş, oyuncu bilgi tablosundaki kalın (strong) yazılan
     * ve 10-50 arasında olan İLK sayıdır.
     */
    function getPlayerAge() {
        let age = null;

        // Yaşı ayıklayan yardımcı fonksiyon
        const extractAgeFromContainer = (container) => {
            // Konteyner içindeki tüm kalın (strong) etiketlerini bul
            const strongTags = container.find('strong');

            for (let i = 0; i < strongTags.length; i++) {
                // Sayısal değeri al
                const val = parseInt($(strongTags[i]).text().trim(), 10);

                // Kontrol: Sayı mı? Mantıklı bir yaş aralığında mı? (15-50 arası)
                // Değer (Value) veya Maaş (Wage) çok yüksek sayılar olduğu için karışmaz.
                if (!isNaN(val) && val >= 10 && val <= 60) {
                    return val; // İlk bulduğu mantıklı sayıyı yaş olarak döndür
                }
            }
            return null;
        };

        // 1. YÖNTEM: Tıklanan son oyuncu kutusundan (Kadro Listesi)
        if (window.mzLastClickedPlayerContainer) {
            age = extractAgeFromContainer(window.mzLastClickedPlayerContainer);
        }

        // 2. YÖNTEM: Tekil Oyuncu Sayfası (.dg_playerview_info)
        if (!age && $('.dg_playerview_info').length > 0) {
            age = extractAgeFromContainer($('.dg_playerview_info'));
        }

        // 3. YÖNTEM: Mobil Görünüm (.pp-1-1)
        if (!age && $('.pp-1-1').length > 0) {
            age = extractAgeFromContainer($('.pp-1-1'));
        }

        return age;
    }

    // Tıklamaları izleyip son tıklanan oyuncu konteynerini kaydet
    $(document).on('click', '.sell_player a', function() {
        window.mzLastClickedPlayerContainer = $(this).closest('.playerContainer');
    });

    function watchForPopup() {
        if ($('#mz-tax-calculator-panel').length > 0) return;

        const helpBtns = $('.help_button');

        helpBtns.each(function() {
            const btn = $(this);
            if (!btn.is(':visible')) return;
            if (btn.data('tax-processed')) return;

            const onClick = this.getAttribute('onclick');
            if (!onClick || onClick.indexOf('showHelpLayer') === -1) return;

            try {
                // showHelpLayer parametrelerini al
                const match = onClick.match(/showHelpLayer\(['"]([^'"]+)['"]/);

                if (match) {
                    const decoded = decodeURIComponent(match[1].replace(/\+/g, ' '));

                    // --- DİLDEN BAĞIMSIZ KONTROL ---
                    // 1. Tarih formatı var mı? (Transfer geçmişi)
                    const hasDate = /\d{1,2}[-./]\d{1,2}[-./]\d{4}/.test(decoded);

                    // 2. HTML Tablosu var mı? (Altyapı oyuncularında vergi tablosu çıkar)
                    // "tablesorter" sınıfı tüm dillerde aynıdır.
                    const hasTable = decoded.includes('tablesorter');

                    if (hasDate || hasTable) {
                        console.log('[MZ TAX v7] Hedef bulundu, panel ekleniyor.');
                        injectPanel(btn, decoded);
                        btn.data('tax-processed', true);
                        return false;
                    }
                }
            } catch (e) {
                console.error("[MZ TAX v7] Hata:", e);
            }
        });
    }

    function injectPanel(helpBtn, decodedHtml) {
        const dateRegex = /(\d{1,2})[-./](\d{1,2})[-./](\d{4})/;
        const dateMatch = decodedHtml.match(dateRegex);

        const panel = $('<div id="mz-tax-calculator-panel"></div>').css({
            'background': '#f1f8e9', 'border': '1px solid #81c784', 'padding': '8px',
            'margin-top': '8px', 'border-radius': '4px', 'font-size': '11px', 'color': '#333',
            'line-height': '1.4', 'z-index': '99999', 'position': 'relative', 'display': 'block',
            'box-shadow': '0 2px 5px rgba(0,0,0,0.1)'
        });

        let content = `<div style="font-weight:bold; color:#2e7d32; border-bottom:1px solid #a5d6a7; margin-bottom:4px;">${getText('calcTitle')}</div>`;

        if (dateMatch) {
            // --- TRANSFERLİ OYUNCU ---
            const day = parseInt(dateMatch[1], 10);
            const month = parseInt(dateMatch[2], 10) - 1;
            const year = parseInt(dateMatch[3], 10);
            const transferDate = new Date(year, month, day);

            // --- DÜZELTME: Saat farkını sıfırla ve +1 gün ekle ---
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Saati gece yarısına çekiyoruz

            const diffTime = Math.abs(now - transferDate);
            // "Geçen Süre" gösterimi için bugünü dahil et (+1)
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // OYUN MANTIĞI: Oyuncu listelendiğinde en erken 1 gün sonra satılır.
            // Bu yüzden vergi oranı, (Bugün + 1) gün sonrasına göre hesaplanmalıdır.
            // Örn: Bugün 70. gün ise, satış 71. gün olur ve vergi %15'e düşer.
            const effectiveSaleDays = diffDays + 1;
            // --- DÜZELTME SONU ---

            // Menajerler için önemli olan "Hangi gün listeye koyabilirim?" sorusudur.
            // Satış 1 gün sonra olduğu için, listeleme tarihi 1 gün erkendir.
            // %50 için: 29. gün satış olması lazım -> 28. gün (27 gün sonrası) listelenebilir.
            const date50 = new Date(transferDate);
            date50.setDate(date50.getDate() + 27);

            // %15 için: 71. gün satış olması lazım -> 70. gün (69 gün sonrası) listelenebilir.
            const date15 = new Date(transferDate);
            date15.setDate(date15.getDate() + 69);

            let taxRateDisplay = "15%";
            let taxColor = "green";

            // Hesaplamada 'diffDays' yerine 'effectiveSaleDays' kullanıyoruz
            if (effectiveSaleDays <= 28) { taxRateDisplay = "95%"; taxColor = "#d32f2f"; }
            else if (effectiveSaleDays <= 70) { taxRateDisplay = "50%"; taxColor = "#f57c00"; }

            // İçerik oluşturulurken "Geçen Süre" olarak hala 'diffDays' (70 gün) gösteriyoruz
            content += `
                <div style="display:flex; justify-content:space-between;">
                    <span>${getText('currentTax')}:</span> <strong style="color:${taxColor}; font-size:12px;">${taxRateDisplay}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>${getText('daysElapsed')}:</span> <strong>${diffDays} ${getText('days')}</strong>
                </div>
                <hr style="margin:4px 0; border:0; border-top:1px dashed #ccc;">
                <div style="display:flex; justify-content:space-between; color:${effectiveSaleDays > 28 ? '#999' : '#333'}">
                    <span>${getText('taxDrop50')}:</span> <span>${effectiveSaleDays > 28 ? getText('passed') : formatDate(date50)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; color:${effectiveSaleDays > 70 ? '#999' : '#333'}">
                    <span>${getText('taxDrop15')}:</span> <span>${effectiveSaleDays > 70 ? getText('passed') : formatDate(date15)}</span>
                </div>
            `;
            } else {
                // --- ALTYAPI OYUNCUSU (Dilden Bağımsız Yaş Tespiti) ---
                const age = getPlayerAge();
                let taxRate = "15%";
                let taxColor = "green";
                let nextInfo = "";

                if (age !== null) {
                    if (age <= 19) {
                        taxRate = "25%"; taxColor = "#d32f2f";
                        nextInfo = `<div style="margin-top:4px; color:#555;">${getText('taxDrop20')}: <strong>${getText('nextSeason')}</strong></div>`;
                    } else if (age === 20) {
                        taxRate = "20%"; taxColor = "#f57c00";
                        nextInfo = `<div style="margin-top:4px; color:#555;">${getText('taxDrop15_age')}: <strong>${getText('nextSeason')}</strong></div>`;
                    } else {
                        taxRate = "15%"; taxColor = "green";
                        nextInfo = `<div style="margin-top:4px; color:green; font-style:italic;">${getText('minTaxReached')}</div>`;
                    }

                    content += `
                    <div style="color:#1565c0; margin-bottom:2px;">${getText('originalPlayer')}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${getText('age')}: <strong>${age}</strong></span>
                        <span>${getText('currentTax')}: <strong style="color:${taxColor}; font-size:12px;">${taxRate}</strong></span>
                    </div>
                    <hr style="margin:4px 0; border:0; border-top:1px dashed #ccc;">
                    ${nextInfo}
                `;
                } else {
                    // Yaş bulunamazsa
                    content += `<div style="color:#1565c0;">${getText('originalPlayer')}</div><div style="font-style:italic; font-size:10px;">${getText('originalNote')}</div>`;
                }
            }

            panel.html(content);

            const container = helpBtn.closest('td');
            if(container.length > 0) {
                container.append(panel);
            } else {
                helpBtn.parent().parent().append(panel);
            }
        }

        setInterval(watchForPopup, 1000);
    }

/****************************************************************************************
 *                                                                                      *
 *  BÖLÜM 16: TRANSFER GÖZLEMCİ FİLTRESİ (V43 - FİLTRE KAYMASI DÜZELTİLDİ)              *
 *                                                                                      *
 ****************************************************************************************/
function initializeTransferScoutFilterScript() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    console.log('[MZ Scout Filter] Modül Başlatıldı (V43 - Fixed Indexing).');

    const STORAGE_KEY_PRESETS = 'mz_tsf_presets_v1';

    const i18n = {
        tr: {
            btnTitle: "Gözlemci Robotu",
            modalTitle: "Hızlı Transfer Tarayıcı",
            startMsg: "Transfer listesini tarar, oyuncuların YP (¹) ve DP (²) özelliklerini analiz eder.",
            minStarLabel: "En Az Kaç Yıldız (YP) Kaydedilsin:",
            starInfo: "Sadece 2, 3 veya 4 yazabilirsiniz.",
            btnStart: "TARAMAYI BAŞLAT",
            btnClose: "Kapat",
            btnStop: "DURDUR",
            scanningMsg: "Hızlı Tarama ve Analiz Yapılıyor... ",
            waitMsg: "Yükleniyor...",
            pageInfo: "İşlenen Sayfa: ",
            foundInfo: "Bulunan Oyuncu: ",
            finishMsg: "Tarama Tamamlandı!",
            panelTitle: "FİLTRELEME PANELİ",
            lblHP: "Yüksek Potansiyel (YP)",
            lblLP: "Düşük Potansiyel (DP)",
            lblSpeed: "Hız (AH)",
            lblUnscouted: "Gözlemlenmemiş",
            countVisible: "Filtrelenen Sonuç: ",
            prevPage: "« Geri",
            nextPage: "İleri »",
            pageOf: "Sayfa",
            stoppedMsg: "Durduruldu.",
            viewModeCard: "Kart Görünümü",
            viewModeTable: "Tablo Görünümü",
            toggleFilters: "Detaylı Potansiyel Filtresi ▼",
            filterYP: "YP",
            filterNotYP: "YP Yok",
            filterNotDP: "DP Yok",
            // Preset (Ayar) Kısmı
            presetLabel: "Kayıtlı Ayarlar:",
            btnSavePreset: "Kaydet",
            btnLoadPreset: "Yükle",
            btnDeletePreset: "Sil",
            phPresetName: "Ayar İsmi...",
            alertPresetSaved: "Ayarlar başarıyla kaydedildi!",
            alertPresetLoaded: "Ayarlar yüklendi!",
            alertPresetDeleted: "Ayar silindi.",
            alertEnterName: "Lütfen bir ayar ismi giriniz.",
            // Özellik İsimleri
            skSpeed: "Hız", skStamina: "Dayanıklılık", skPlayInt: "Oyun Zekası",
            skPassing: "Paslaşma", skShooting: "Şut Çekme", skHeading: "Kafa Vuruşu",
            skKeeping: "Kalecilik", skControl: "Top Kontrolü", skTackling: "Top Çalma",
            skAerial: "Orta Yapma", skSetPlays: "Duran Top"
        },
        en: {
            btnTitle: "Scout Robot",
            modalTitle: "Fast Transfer Scanner",
            startMsg: "Scans list and reads HP (¹) and LP (²) markers.",
            minStarLabel: "Min High Potential (HP) to Save:",
            starInfo: "Only 2, 3, or 4 allowed.",
            btnStart: "START SCAN",
            btnClose: "Close",
            btnStop: "STOP",
            scanningMsg: "Fast Scanning & Analyzing... ",
            waitMsg: "Loading...",
            pageInfo: "Processed Page: ",
            foundInfo: "Found Players: ",
            finishMsg: "Scan Completed!",
            panelTitle: "FILTER DASHBOARD",
            lblHP: "High Potential",
            lblLP: "Low Potential",
            lblSpeed: "Speed",
            lblUnscouted: "Unscouted",
            countVisible: "Showing: ",
            prevPage: "« Prev",
            nextPage: "Next »",
            pageOf: "Page",
            stoppedMsg: "Stopped.",
            viewModeCard: "Card View",
            viewModeTable: "Table View",
            toggleFilters: "Detailed Potential Filter ▼",
            filterYP: "HP",
            filterNotYP: "Not HP",
            filterNotDP: "Not LP",
            // Preset Section
            presetLabel: "Saved Presets:",
            btnSavePreset: "Save",
            btnLoadPreset: "Load",
            btnDeletePreset: "Delete",
            phPresetName: "Preset Name...",
            alertPresetSaved: "Settings saved successfully!",
            alertPresetLoaded: "Settings loaded!",
            alertPresetDeleted: "Preset deleted.",
            alertEnterName: "Please enter a preset name.",
            // Skills
            skSpeed: "Speed", skStamina: "Stamina", skPlayInt: "Play Int",
            skPassing: "Passing", skShooting: "Shooting", skHeading: "Heading",
            skKeeping: "Keeping", skControl: "Ball Ctrl", skTackling: "Tackling",
            skAerial: "Aerial", skSetPlays: "Set Plays"
        }
    };

    const lang = ($('meta[name="language"]').attr('content') || 'en') === 'tr' ? 'tr' : 'en';
    const getText = (key, ...args) => { const t = i18n[lang][key] || i18n['en'][key]; return typeof t === 'function' ? t(...args) : t; };

    const skillMap = [
        { key: 'speed', tr: 'Hız', en: 'Speed', labelKey: 'skSpeed' },
        { key: 'stamina', tr: 'Dayanıklılık', en: 'Stamina', labelKey: 'skStamina' },
        { key: 'play_intelligence', tr: 'Oyun zekası', en: 'Play intelligence', labelKey: 'skPlayInt' },
        { key: 'passing', tr: 'Paslaşma', en: 'Passing', labelKey: 'skPassing' },
        { key: 'shooting', tr: 'Şut çekme', en: 'Shooting', labelKey: 'skShooting' },
        { key: 'heading', tr: 'Kafa vuruşu', en: 'Heading', labelKey: 'skHeading' },
        { key: 'keeping', tr: 'Kalecilik', en: 'Keeping', labelKey: 'skKeeping' },
        { key: 'ball_control', tr: 'Top kontrolü', en: 'Ball control', labelKey: 'skControl' },
        { key: 'tackling', tr: 'Top çalma', en: 'Tackling', labelKey: 'skTackling' },
        { key: 'aerial_passing', tr: 'Orta yapma', en: 'Aerial passing', labelKey: 'skAerial' },
        { key: 'set_plays', tr: 'Duran top', en: 'Set plays', labelKey: 'skSetPlays' }
    ];

    let isScanning = false;
    let stopRequested = false;
    let collectedPlayerData = [];
    let filteredPlayerData = [];
    let scanPageCount = 0;
    let lastFirstPlayerId = "";
    let minStarToCollect = 0;

    let currentPage = 1;
    const itemsPerPage = 10;

    // --- DEBOUNCE ---
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // CSS
    GM_addStyle(`
        #mz-scout-filter-btn { float: right; margin-right: 5px; cursor: pointer; background: #6f42c1; color: white; border: 1px solid #59359a; font-weight:bold; }
        .tsf-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10050; display: none; justify-content: center; align-items: center; }
        .tsf-modal { background: #fff; padding: 20px; border-radius: 8px; width: 420px; text-align: center; box-shadow: 0 0 25px rgba(0,0,0,0.5); font-family: sans-serif; }
        .tsf-btn-start { padding: 12px; font-size: 15px; font-weight: bold; color: white; background: #28a745; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 15px; transition: 0.2s; }
        .tsf-btn-start:hover { background: #218838; transform: scale(1.02); }
        .tsf-input-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6; }
        .tsf-input-limit { padding: 5px; width: 60px; text-align: center; font-weight: bold; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; color: #d63031; }
        .tsf-info-text { font-size: 11px; color: #d63031; text-align: right; margin-bottom: 15px; font-style: italic; }

        #tsf-scan-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.92); z-index: 20000; display: none; flex-direction: column; justify-content: center; align-items: center; color: white; }
        #tsf-scan-status { font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #4CAF50; }
        #tsf-scan-count { font-size: 18px; color: #ddd; margin-bottom: 20px; line-height: 1.5; text-align: center; }
        .tsf-btn-stop { padding: 8px 30px; background: #dc3545; color: white; border: 2px solid #fff; border-radius: 50px; font-weight: bold; cursor: pointer; font-size: 14px; transition: transform 0.2s; }
        .tsf-btn-stop:hover { transform: scale(1.1); }
        .tsf-loader { border: 5px solid #333; border-top: 5px solid #00d2ff; border-radius: 50%; width: 60px; height: 60px; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        #tsf-dashboard {
            background: #1e272e; color: white; padding: 15px; margin-bottom: 15px;
            border-radius: 8px; position: relative; z-index: 100;
            border-bottom: 4px solid #0fbcf9; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        /* PRESET BAR STYLE */
        .tsf-preset-row {
            display: flex; align-items: center; gap: 8px; padding-bottom: 10px;
            margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);
            flex-wrap: wrap; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px;
        }
        .tsf-preset-label { font-weight: bold; color: #ff9ff3; font-size: 13px; }
        #tsf-preset-select { padding: 5px; border-radius: 4px; border: none; font-size: 12px; background: #333; color: white; }
        #tsf-preset-name { padding: 5px; border-radius: 4px; border: none; font-size: 12px; width: 120px; }
        .tsf-btn-p { padding: 5px 10px; border-radius: 4px; border: none; font-size: 11px; cursor: pointer; color: white; font-weight: bold; }
        .tsf-btn-save { background: #00b894; }
        .tsf-btn-load { background: #0984e3; }
        .tsf-btn-del { background: #d63031; }

        .tsf-filter-row { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; align-items: center; margin-bottom: 15px; }
        .tsf-filter-group { background: rgba(255,255,255,0.08); padding: 5px 10px; border-radius: 5px; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.1); }
        .tsf-filter-title { font-weight: bold; font-size: 12px; color: #ffd32a; margin-right: 5px; }
        .tsf-lbl { font-size: 12px; cursor: pointer; user-select: none; display: flex; align-items: center; }
        .tsf-lbl input { margin-right: 4px; }

        .tsf-skill-matrix {
            display: none; flex-wrap: wrap; gap: 10px; justify-content: center;
            background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;
            border: 1px solid #333; margin-bottom: 15px;
        }
        .tsf-skill-matrix.show-matrix { display: flex !important; }

        .tsf-skill-box { display: flex; flex-direction: column; align-items: center; background: #2f3640; border: 1px solid #555; padding: 8px; border-radius: 5px; width: 100px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: transform 0.2s; }
        .tsf-skill-box:hover { transform: translateY(-2px); border-color: #777; }
        .tsf-skill-name { font-size: 11px; font-weight: bold; color: #fff; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: center; border-bottom: 1px solid #444; padding-bottom: 3px; }
        .tsf-chk-row { display: flex; align-items: center; justify-content: space-between; gap: 5px; font-size: 10px; color: #ddd; width: 100%; margin-bottom: 2px; cursor: pointer; }
        .tsf-chk-row input { margin: 0; cursor: pointer; }

        #tsf-counter { font-size: 14px; font-weight: bold; color: #0fbcf9; margin-left: auto; display: flex; align-items: center; gap: 10px; justify-content: space-between; width: 100%; border-top: 1px solid #444; padding-top: 10px; }
        .tsf-toggle-filters-btn { background: #16a085; color: white; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; transition: background 0.2s; }
        .tsf-toggle-filters-btn:hover { background: #1abc9c; }

        .tsf-pagination-controls button { background: #3c40c6; color: white; border: none; padding: 5px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; font-weight: bold; }
        .tsf-pagination-controls button:disabled { background: #57606f; cursor: not-allowed; }

        .tsf-p-wrap {
            content-visibility: auto;
            contain-intrinsic-size: 150px;
            margin-bottom: 10px;
        }
        #mz-tsf-results-container { contain: content; }
    `);

    function createUI() {
        if ($('#mz-scout-filter-btn').length > 0) return;
        const targetArea = $('.buttons-wrapper #tds');
        if (targetArea.length) {
            const btn = $(`<a href="#" id="mz-scout-filter-btn" class="mzbtn buttondiv button_account">
                <span class="buttonClassMiddle"><span><i class="fa fa-rocket"></i> ${getText('btnTitle')}</span></span>
                <span class="buttonClassRight">&nbsp;</span>
            </a>`);
            btn.on('click', (e) => { e.preventDefault(); openModal(); });
            targetArea.before(btn);
        }

        const modalHTML = `
        <div id="tsf-modal-overlay" class="tsf-modal-overlay">
            <div class="tsf-modal">
                <h3 style="color:#333; margin:0 0 15px 0;">${getText('modalTitle')}</h3>
                <p style="font-size:12px; color:#666; margin-bottom:20px;">${getText('startMsg')}</p>

                <div class="tsf-input-row">
                    <label style="font-size:13px; color:#333; font-weight:bold;">${getText('minStarLabel')}</label>
                    <input type="text" id="tsf-min-hp" class="tsf-input-limit" value="" placeholder="2,3,4">
                </div>
                <div class="tsf-info-text">${getText('starInfo')}</div>

                <button id="tsf-start-scan" class="tsf-btn-start">${getText('btnStart')}</button>
                <div style="margin-top:10px; cursor:pointer; color:#999; font-size:11px; text-decoration:underline;" onclick="$('#tsf-modal-overlay').hide()">${getText('btnClose')}</div>
            </div>
        </div>

        <div id="tsf-scan-overlay">
            <div class="tsf-loader"></div>
            <div id="tsf-scan-status">${getText('scanningMsg')}</div>
            <div id="tsf-scan-count"></div>
            <button id="tsf-stop-scan" class="tsf-btn-stop">${getText('btnStop')}</button>
        </div>`;

        $('body').append(modalHTML);
        $('#tsf-start-scan').on('click', startScanningProcess);
        $('#tsf-stop-scan').on('click', () => { stopRequested = true; $('#tsf-scan-status').text(getText('stoppedMsg')); });

        $('#tsf-min-hp').on('input', function() {
            let val = $(this).val();
            val = val.replace(/[^234]/g, '');
            if (val.length > 1) val = val.slice(-1);
            $(this).val(val);
        });
    }

    function openModal() { $('#tsf-modal-overlay').css('display', 'flex'); }

    function isStarActive(element) {
        if (element.style.color === 'rgb(0, 0, 0)') return false;
        if (element.classList.contains('fa-star-o')) return false;
        const style = window.getComputedStyle(element);
        const color = style.color;
        const opacity = style.opacity;
        if (opacity && parseFloat(opacity) < 0.5) return false;
        if (color && color.includes('rgb')) {
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const r = parseInt(rgb[0]), g = parseInt(rgb[1]), b = parseInt(rgb[2]);
                const saturation = Math.max(r, g, b) - Math.min(r, g, b);
                if (saturation < 20) return false;
                return true;
            }
        }
        return true;
    }

    function countActiveStarsInContainer(wrapper, selector) {
        let count = 0;
        wrapper.find(selector).each(function() { if (isStarActive(this)) count++; });
        return count;
    }

    // --- DÜZELTİLMİŞ ANALİZ FONKSİYONU (V43) ---
    function analyzeSkillPotentials(container, playerName) {
        const skillAnalysis = { hp: [], lp: [] };

        // ManagerZone Standart Beceri Sıralaması (Bu sıra asla değişmez)
        const skillOrder = [
            'speed', 'stamina', 'play_intelligence', 'passing', 'shooting',
            'heading', 'keeping', 'ball_control', 'tackling', 'aerial_passing', 'set_plays'
        ];

        // DÜZELTME: Sadece "skill_name" içeren satırları seçiyoruz.
        // Bu, başlıkları veya boş satırları atlar ve indeksin kaymasını önler.
        const skillRows = container.find('.skill_name').closest('tr');

        skillRows.each(function(index) {
            // Eğer beklenenden fazla satır varsa (nadiren olur), hata vermesin diye durdur.
            if (index >= skillOrder.length) return;

            const currentSkillKey = skillOrder[index];
            const supElement = $(this).find('.sup');

            if (supElement.length > 0) {
                const supVal = supElement.text().trim();

                if (currentSkillKey) {
                    if (supVal === '1') { // Yüksek Potansiyel
                        skillAnalysis.hp.push(currentSkillKey);
                    } else if (supVal === '2') { // Düşük Potansiyel
                        skillAnalysis.lp.push(currentSkillKey);
                    }
                }
            }
        });

        return skillAnalysis;
    }

    function extractBasicInfo(container) {
        const name = container.find('a.player_link').text().trim();
        const link = container.find('a.player_link').attr('href');
        let age = 0;
        const ageMatch = container.text().match(/(?:Age|Yaş):\s*(\d+)/i);
        if (ageMatch) age = parseInt(ageMatch[1]);
        return { name, link, age };
    }

    // --- TARAMA ---
    function startScanningProcess() {
        console.clear();
        console.log("--- TRANSFER TARAMASI BAŞLADI (V43) ---");
        isScanning = true;
        stopRequested = false;
        collectedPlayerData = [];
        scanPageCount = 0;
        lastFirstPlayerId = "";

        let rawMinStar = $('#tsf-min-hp').val();
        minStarToCollect = (rawMinStar === '') ? 0 : parseInt(rawMinStar);

        $('#tsf-modal-overlay').hide();
        $('#tsf-scan-overlay').css('display', 'flex');
        $('#tsf-scan-count').html(`${getText('pageInfo')} 0`);

        processPage();
    }

    function processPage() {
        if (!isScanning) return;
        if (stopRequested) { finishScanning(); return; }

        const playersOnPage = $('.playerContainer');
        if (playersOnPage.length === 0) { finishScanning(); return; }

        const currentFirstId = playersOnPage.first().find('.player_id_span').text().trim();
        if (currentFirstId === lastFirstPlayerId && scanPageCount > 0) { finishScanning(); return; }
        lastFirstPlayerId = currentFirstId;
        scanPageCount++;

        playersOnPage.each(function() {
            const container = $(this);
            const basics = extractBasicInfo(container);
            const reportRow = container.find('.scout_report_row');
            let counts = { hp: 0, lp: 0, speed: 0, unscouted: false };

            if (reportRow.length === 0) {
                counts.unscouted = true;
            } else {
                counts.hp = countActiveStarsInContainer(reportRow.find('.high-stars'), 'i.fa-star');
                counts.lp = countActiveStarsInContainer(reportRow.find('.low-stars'), 'i.fa-star');
                counts.speed = countActiveStarsInContainer(reportRow.find('.scout_report_stars').eq(2), 'i.fa-star');
            }

            if (counts.unscouted || counts.hp < minStarToCollect) return;

            const potentials = analyzeSkillPotentials(container, basics.name);

            // --- HIZLI RENKLENDİRME (DÜZELTİLMİŞ) ---
            // Buradaki mantık da yukarıdaki analyzeSkillPotentials ile aynı olmalı.
            const colorSkillOrder = [
                'speed', 'stamina', 'play_intelligence', 'passing', 'shooting',
                'heading', 'keeping', 'ball_control', 'tackling', 'aerial_passing', 'set_plays'
            ];

            // Yine güvenli satır seçiciyi kullanıyoruz
            const skillRows = container.find('.skill_name').closest('tr');

            skillRows.each(function(index) {
                if (index >= colorSkillOrder.length) return;
                const currentKey = colorSkillOrder[index];
                const row = $(this);

                // Renklendirilecek hedefi bul (Yazı veya Span)
                let target = row.find('td:first span.skill_name span:first');
                if(target.length === 0) target = row.find('td:first'); // Yedek seçim

                if (potentials.hp.includes(currentKey)) {
                    // Yüksek Potansiyel Rengi
                    target.addClass(`gm_scout_h gm_s${counts.hp} skill_name_colored`);
                    target.closest('td').addClass(`gm_scout_h gm_s${counts.hp}`);
                } else if (potentials.lp.includes(currentKey)) {
                    // Düşük Potansiyel Rengi
                    target.addClass(`gm_s${counts.lp} skill_name_colored`);
                    target.closest('td').addClass(`gm_s${counts.lp}`);
                }
            });
            // ----------------------------------------

            let html = container[0].outerHTML;

            collectedPlayerData.push({
                html: html,
                hp: counts.hp,
                lp: counts.lp,
                speed: counts.speed,
                unscouted: counts.unscouted,
                potentials: potentials,
                basics: basics
            });
        });

        $('#tsf-scan-count').html(`${getText('pageInfo')} ${scanPageCount} <br> ${getText('foundInfo')} ${collectedPlayerData.length}`);

        const nextButton = findNextButton();
        if (nextButton && nextButton.length > 0) {
            nextButton[0].click();
            let checks = 0;
            const checkInt = setInterval(() => {
                if (stopRequested) {
                    clearInterval(checkInt);
                    finishScanning();
                    return;
                }
                if (!isScanning) {
                    clearInterval(checkInt);
                    return;
                }

                const newFirst = $('.playerContainer').first().find('.player_id_span').text().trim();
                if (newFirst && newFirst !== lastFirstPlayerId) {
                    clearInterval(checkInt);
                    processPage();
                }
                if (++checks > 40) { clearInterval(checkInt); finishScanning(); }
            }, 100);
        } else {
            finishScanning();
        }
    }

    function findNextButton() {
        const container = $('.transferSearchPages.top:visible');
        if (container.length === 0) return null;
        let activeEl = container.find('.nav_select, strong').first();
        if (activeEl.length === 0) {
            container.contents().each(function() {
                if (this.nodeName !== 'A') {
                    const txt = $(this).text().trim();
                    if (txt.length > 0 && !isNaN(parseInt(txt))) {
                        activeEl = $(this);
                        return false;
                    }
                }
            });
        }
        if (activeEl.length === 0) return null;
        let targetBtn = null;
        const activeNode = activeEl[0];
        const allLinks = container.find('a');
        allLinks.each(function() {
            const linkNode = this;
            if (activeNode.compareDocumentPosition(linkNode) & 4) {
                targetBtn = $(linkNode);
                return false;
            }
        });
        return targetBtn;
    }

    function finishScanning() {
        isScanning = false;
        $('#tsf-scan-status').text(getText('finishMsg'));
        $('#tsf-stop-scan').hide();
        setTimeout(() => {
            $('#tsf-scan-overlay').hide();
            collectedPlayerData.sort((a, b) => {
                if (b.hp !== a.hp) return b.hp - a.hp;
                if (b.lp !== a.lp) return b.lp - a.lp;
                return b.speed - a.speed;
            });
            filteredPlayerData = [...collectedPlayerData];
            renderDashboardAndList();
        }, 800);
    }

    // --- SONUÇ GÖSTERİMİ & PRESET YÖNETİMİ ---
    function getPresets() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
            return raw ? JSON.parse(raw) : {};
        } catch(e) { return {}; }
    }

    function savePreset(name) {
        if(!name) { alert(getText('alertEnterName')); return; }
        const config = {
            hp: $('.tsf-live-filter[data-type="hp"]:checked').map(function(){return parseInt(this.value)}).get(),
            lp: $('.tsf-live-filter[data-type="lp"]:checked').map(function(){return parseInt(this.value)}).get(),
            speed: $('.tsf-live-filter[data-type="speed"]:checked').map(function(){return parseInt(this.value)}).get(),
            matrix: {}
        };

        $('.tsf-mx-yp:checked').each(function() {
            const k = $(this).data('key');
            if(!config.matrix[k]) config.matrix[k] = [];
            config.matrix[k].push('yp');
        });
        $('.tsf-mx-notyp:checked').each(function() {
            const k = $(this).data('key');
            if(!config.matrix[k]) config.matrix[k] = [];
            config.matrix[k].push('notyp');
        });
        $('.tsf-mx-notdp:checked').each(function() {
            const k = $(this).data('key');
            if(!config.matrix[k]) config.matrix[k] = [];
            config.matrix[k].push('notdp');
        });

        const presets = getPresets();
        presets[name] = config;
        localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
        updatePresetDropdown(name);
        alert(getText('alertPresetSaved'));
    }

    function loadPreset(name) {
        const presets = getPresets();
        const config = presets[name];
        if(!config) return;

        $('.tsf-live-filter, .tsf-mx-yp, .tsf-mx-notyp, .tsf-mx-notdp').prop('checked', false);

        if(config.hp) config.hp.forEach(v => $(`.tsf-live-filter[data-type="hp"][value="${v}"]`).prop('checked', true));
        if(config.lp) config.lp.forEach(v => $(`.tsf-live-filter[data-type="lp"][value="${v}"]`).prop('checked', true));
        if(config.speed) config.speed.forEach(v => $(`.tsf-live-filter[data-type="speed"][value="${v}"]`).prop('checked', true));

        if(config.matrix) {
            for (const [key, types] of Object.entries(config.matrix)) {
                if(types.includes('yp')) $(`.tsf-mx-yp[data-key="${key}"]`).prop('checked', true);
                if(types.includes('notyp')) $(`.tsf-mx-notyp[data-key="${key}"]`).prop('checked', true);
                if(types.includes('notdp')) $(`.tsf-mx-notdp[data-key="${key}"]`).prop('checked', true);
            }
        }

        applyLiveFilters();
        alert(getText('alertPresetLoaded'));
    }

    function deletePreset(name) {
        if(!name) return;
        const presets = getPresets();
        delete presets[name];
        localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
        updatePresetDropdown();
        alert(getText('alertPresetDeleted'));
    }

    function updatePresetDropdown(selectName = null) {
        const presets = getPresets();
        const sel = $('#tsf-preset-select');
        sel.empty();
        sel.append(`<option value="">-- Seçiniz --</option>`);
        for (const name of Object.keys(presets)) {
            sel.append(`<option value="${name}">${name}</option>`);
        }
        if(selectName) sel.val(selectName);
    }

    function renderDashboardAndList() {
        $('#players_container').remove();
        $('.transferSearchPages').remove();
        const newContainer = $('<div id="mz-tsf-results-container" class="players_transfer_container" style="min-height: 500px;"></div>');

        let skillMatrixHTML = '';
        skillMap.forEach(s => {
            const skillName = getText(s.labelKey);
            skillMatrixHTML += `
                <div class="tsf-skill-box">
                    <span class="tsf-skill-name" title="${skillName}">${skillName}</span>
                    <label class="tsf-chk-row" style="color:#2ecc71;">${getText('filterYP')} <input type="checkbox" class="tsf-mx-yp" data-key="${s.key}"></label>
                    <label class="tsf-chk-row" style="color:#f39c12;">${getText('filterNotYP')} <input type="checkbox" class="tsf-mx-notyp" data-key="${s.key}"></label>
                    <label class="tsf-chk-row" style="color:#e74c3c;">${getText('filterNotDP')} <input type="checkbox" class="tsf-mx-notdp" data-key="${s.key}"></label>
                </div>
            `;
        });

        const dashboardHTML = `
        <div id="tsf-dashboard">
            <div class="tsf-preset-row">
                <span class="tsf-preset-label">${getText('presetLabel')}</span>
                <select id="tsf-preset-select"></select>
                <button id="tsf-btn-load" class="tsf-btn-p tsf-btn-load">${getText('btnLoadPreset')}</button>
                <div style="flex-grow:1;"></div>
                <input type="text" id="tsf-preset-name" placeholder="${getText('phPresetName')}">
                <button id="tsf-btn-save" class="tsf-btn-p tsf-btn-save">${getText('btnSavePreset')}</button>
                <button id="tsf-btn-del" class="tsf-btn-p tsf-btn-del">${getText('btnDeletePreset')}</button>
            </div>

            <div class="tsf-filter-row">
                <div class="tsf-filter-group">
                    <span class="tsf-filter-title">${getText('lblHP')}</span>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="hp" value="4" checked>4★</label>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="hp" value="3" checked>3★</label>
                </div>
                <div class="tsf-filter-group">
                    <span class="tsf-filter-title">${getText('lblLP')}</span>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="lp" value="2" checked>2★</label>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="lp" value="1" checked>1★</label>
                </div>
                <div class="tsf-filter-group">
                    <span class="tsf-filter-title">${getText('lblSpeed')}</span>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="speed" value="4" checked>4★</label>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="speed" value="3" checked>3★</label>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="speed" value="2" checked>2★</label>
                    <label class="tsf-lbl"><input type="checkbox" class="tsf-live-filter" data-type="speed" value="1" checked>1★</label>
                </div>
                <button class="tsf-toggle-filters-btn">${getText('toggleFilters')}</button>
            </div>

            <div class="tsf-skill-matrix">
                ${skillMatrixHTML}
            </div>

            <div id="tsf-counter">
                <span id="tsf-status-text">${getText('countVisible')} ${filteredPlayerData.length} / ${collectedPlayerData.length}</span>
                <div class="tsf-pagination-controls">
                    <button id="tsf-prev-btn" disabled>${getText('prevPage')}</button>
                    <span id="tsf-page-info" class="tsf-page-info">${getText('pageOf')} 1</span>
                    <button id="tsf-next-btn">${getText('nextPage')}</button>
                </div>
            </div>
        </div>
        <div id="tsf-player-list"></div>`;

        newContainer.append(dashboardHTML);
        $('.transfer_window').last().after(newContainer);
        $(window).scrollTop(0);
        currentPage = 1;
        renderCurrentPage();
        updatePresetDropdown();

        const debouncedFilter = debounce(applyLiveFilters, 300);
        $(document).on('change', '.tsf-live-filter, .tsf-mx-yp, .tsf-mx-notdp, .tsf-mx-notyp', debouncedFilter);

        $('#tsf-btn-save').on('click', () => savePreset($('#tsf-preset-name').val().trim()));
        $('#tsf-btn-load').on('click', () => loadPreset($('#tsf-preset-select').val()));
        $('#tsf-btn-del').on('click', () => deletePreset($('#tsf-preset-select').val()));
        $('#tsf-preset-select').on('change', function() { $('#tsf-preset-name').val(this.value); });

        $('#tsf-prev-btn').on('click', () => { if(currentPage > 1) { currentPage--; renderCurrentPage(true); } });
        $('#tsf-next-btn').on('click', () => {
            const maxPage = Math.ceil(filteredPlayerData.length / itemsPerPage);
            if(currentPage < maxPage) { currentPage++; renderCurrentPage(true); }
        });

        $('.tsf-toggle-filters-btn').on('click', () => {
            $('.tsf-skill-matrix').toggleClass('show-matrix');
        });
    }

    function renderCurrentPage(scrollToTop = false) {
        const listDiv = $('#tsf-player-list');
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredPlayerData.length);
        const pageData = filteredPlayerData.slice(startIndex, endIndex);

        let htmlBuffer = '';
        pageData.forEach(p => {
            htmlBuffer += `<div class="tsf-p-wrap">${p.html}</div>`;
        });

        listDiv.html(htmlBuffer);

        const maxPage = Math.ceil(filteredPlayerData.length / itemsPerPage) || 1;
        $('#tsf-prev-btn').prop('disabled', currentPage === 1);
        $('#tsf-next-btn').prop('disabled', currentPage === maxPage);
        $('#tsf-page-info').text(`${getText('pageOf')} ${currentPage} / ${maxPage}`);

        if (scrollToTop) {
            $(window).scrollTop(0);
        }
    }

    function applyLiveFilters() {
        const hpVals = $('.tsf-live-filter[data-type="hp"]:checked').map(function(){return parseInt(this.value)}).get();
        const lpVals = $('.tsf-live-filter[data-type="lp"]:checked').map(function(){return parseInt(this.value)}).get();
        const speedVals = $('.tsf-live-filter[data-type="speed"]:checked').map(function(){return parseInt(this.value)}).get();

        const mustBeHP = [];
        const mustNotBeHP = [];
        const mustNotBeDP = [];

        $('.tsf-mx-yp:checked').each(function() { mustBeHP.push($(this).data('key')); });
        $('.tsf-mx-notyp:checked').each(function() { mustNotBeHP.push($(this).data('key')); });
        $('.tsf-mx-notdp:checked').each(function() { mustNotBeDP.push($(this).data('key')); });

        filteredPlayerData = collectedPlayerData.filter(p => {
            if (p.unscouted) return false;

            const hpMatch = hpVals.length === 0 || hpVals.includes(p.hp);
            const lpMatch = lpVals.length === 0 || lpVals.includes(p.lp);
            const speedMatch = speedVals.length === 0 || speedVals.includes(p.speed);

            if (!(hpMatch && lpMatch && speedMatch)) return false;

            for (let skillKey of mustBeHP) {
                if (!p.potentials.hp.includes(skillKey)) return false;
            }

            for (let skillKey of mustNotBeHP) {
                if (p.potentials.hp.includes(skillKey)) return false;
            }

            for (let skillKey of mustNotBeDP) {
                if (p.potentials.lp.includes(skillKey)) return false;
            }

            return true;
        });

        currentPage = 1;
        $('#tsf-status-text').text(`${getText('countVisible')} ${filteredPlayerData.length} / ${collectedPlayerData.length}`);
        renderCurrentPage(false);
    }

    setTimeout(createUI, 1000);
    const observer = new MutationObserver(() => createUI());
    const target = document.querySelector('.buttons-wrapper');
    if(target) observer.observe(target, { childList: true, subtree: true });
}

})();