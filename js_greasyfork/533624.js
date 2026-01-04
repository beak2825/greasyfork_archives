// ==UserScript==
// @name         MZ - Federasyon Çatışması Puanlama
// @namespace    Nicotin
// @version      6.3
// @description  Fetches user data etc. with auto-sorting by FED PUANI, adds Fenerbahçe analysis tools, and includes a Top ranking analyzer.
// @author       Tuncay
// @match        https://www.managerzone.com/?p=federations&sub=league&tab=division
// @match        https://www.managerzone.com/?p=rank&sub=userrank*
// @icon         https://flagcdn.com/16x12/tr.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @resource     NPROGRESS_CSS https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533624/MZ%20-%20Federasyon%20%C3%87at%C4%B1%C5%9Fmas%C4%B1%20Puanlama.user.js
// @updateURL https://update.greasyfork.org/scripts/533624/MZ%20-%20Federasyon%20%C3%87at%C4%B1%C5%9Fmas%C4%B1%20Puanlama.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====================================================================================
    // BÖLÜM 1: SÜRÜM KONTROLÜ VE GÜNCELLEME BİLDİRİMİ
    // ====================================================================================

    const CURRENT_SCRIPT_VERSION = GM_info.script.version;
    const LAST_VERSION_KEY = 'federasyonCatismasi_lastVersion';
    const lastSeenVersion = GM_getValue(LAST_VERSION_KEY, '0');

    function showUpdateNotification() {
        const existingNotification = document.getElementById('script-update-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notificationDiv = document.createElement('div');
        notificationDiv.id = 'script-update-notification';
        notificationDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #34495e; color: #ecf0f1; padding: 25px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); z-index: 10001; font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; width: 90%; font-size: 1rem;">
                <h4 style="margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #7f8c8d; padding-bottom: 15px; font-size: 1.4em; font-weight: 600; color: #ffffff;">MZ - Federasyon Çatışması Puanlama Güncellendi!</h4>
                <p style="margin-bottom: 15px; font-size: 1em; line-height: 1.6;">
                    Script <strong>v${CURRENT_SCRIPT_VERSION}</strong> sürümüne güncellendi.
                </p>
                <p style="margin-bottom: 15px; font-size: 1em; line-height: 1.6;">
                    <strong>Yenilikler/Değişiklikler:</strong>
                    <ul style="margin-top: 8px; padding-left: 25px; font-size: 0.95em; line-height: 1.7; list-style-type: disc;">
                         <li style="margin-bottom: 8px;"><strong>Hata Düzeltmesi:</strong> "Tüm Verileri Güncelle" butonunun veri çekme ve arayüzü yenileme işlevselliği onarıldı. Bu düzeltme ile "Karşılaştır" ve diğer bağlı özellikler tekrar sorunsuz çalışmaktadır.</li>
                    </ul>
                </p>
                <button id="close-script-update-notification" style="background-color: #566573; color: #ecf0f1; border: 1px solid #7f8c8d; padding: 10px 20px; border-radius: 6px; cursor: pointer; float: right; font-size: 0.95em; font-weight: 500; transition: background-color 0.2s ease, border-color 0.2s ease;" onmouseover="this.style.backgroundColor='#7f8c8d'; this.style.borderColor='#95a5a6';" onmouseout="this.style.backgroundColor='#566573'; this.style.borderColor='#7f8c8d';">Kapat</button>
                <div style="clear:both;"></div>
            </div>
        `;
        document.body.appendChild(notificationDiv);

        document.getElementById('close-script-update-notification').addEventListener('click', () => {
            notificationDiv.remove();
        });
    }

    if (CURRENT_SCRIPT_VERSION !== lastSeenVersion) {
        console.log(`Script güncellendi: ${lastSeenVersion} -> ${CURRENT_SCRIPT_VERSION}`);
        showUpdateNotification();
        GM_setValue(LAST_VERSION_KEY, CURRENT_SCRIPT_VERSION);
    }


    // ====================================================================================
    // BÖLÜM 2: GLOBAL DEĞİŞKENLER, SABİTLER VE CSS STİLLERİ
    // ====================================================================================

    // --- Global Değişkenler ve Sabitler ---
    const FENERBAHCE_FID = '114';
    const FENERBAHCE_TEAM_ID = '930867';
    const FENERBAHCE_NAME_FOR_ANALYSIS = 'Fenerbahçe - Türkiye';
    const FENERBAHCE_SEASON_LEAGUES = [
        { season: '88', subSeason: '1', level: 5, division: 1, leagueName: 'Division 4.1' },
        { season: '88', subSeason: '2', level: 4, division: 7, leagueName: 'Division 3.7' },
        { season: '89', subSeason: '1', level: 3, division: 3, leagueName: 'Division 2.3' },
        { season: '89', subSeason: '2', level: 2, division: 2, leagueName: 'Division 1.2' },
        { season: '90', subSeason: '1', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '90', subSeason: '2', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '91', subSeason: '1', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '91', subSeason: '2', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '92', subSeason: '1', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '92', subSeason: '2', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '93', subSeason: '1', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '93', subSeason: '2', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '94', subSeason: '1', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '94', subSeason: '2', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '95', subSeason: '1', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '95', subSeason: '2', level: 2, division: 2, leagueName: 'Division 1.2' },
        { season: '96', subSeason: '1', level: 1, division: 1, leagueName: 'Elite Division' },
        { season: '96', subSeason: '2', level: 2, division: 2, leagueName: 'Division 1.2' }
    ];

    let fenerbahceOverallStandings = {};
    let fenerbahceAnalysisModalOverlay = null;
    let fenerbahceLeaguePerfModalOverlay = null;
    const FB_ANALYSIS_CACHE_PREFIX = 'fbAnalysisCache_';

    let currentSeasonOpponentFids = new Set();

    let summaryTableSort = { column: 'avgFedPuani', direction: 'desc' };
    const SUMMARY_TABLE_CONTAINER_ID = 'federation-summary-container';

    let federationScheduleCache = null; // Fikstür sayfasının HTML'ini önbelleğe almak için
    let tooltipElement = null; // Tooltip için global element referansı

    // Orijinal betikteki i18n objesi yerine basit bir sabit
    const i18n_strings = {
        locationHome: '(E)',
        locationAway: '(D)',
        roundPrefix: 'Tur'
    };

    // Tooltip'i oluşturan ve olayları bağlayan yardımcı fonksiyon
    function initializeTooltip() {
        if (tooltipElement) return;
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'mz-custom-tooltip';
        document.body.appendChild(tooltipElement);
    }

    function addTooltipEvents(element) {
        if (!tooltipElement) initializeTooltip();

        element.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            // İkonun 'status' (win/loss/draw) verisini alıyoruz
            const status = target.dataset.status;

            // Tooltip'e hem genel sınıfı hem de duruma özel renk sınıfını atıyoruz
            tooltipElement.className = `mz-custom-tooltip tooltip-${status}`;
            tooltipElement.textContent = target.dataset.tooltipText;
            tooltipElement.style.display = 'block';
            tooltipElement.style.top = `${rect.top + window.scrollY + rect.height / 2 - tooltipElement.offsetHeight / 2}px`;
            tooltipElement.style.left = `${rect.right + window.scrollX + 10}px`;
        });

        element.addEventListener('mouseleave', () => {
            tooltipElement.style.display = 'none';
        });
    }

    // --- CSS Stilleri ---
    GM_addStyle(GM_getResourceText('NPROGRESS_CSS'));
    GM_addStyle(`
        /* ===== MESSENGER Z-INDEX DÜZELTMESİ BAŞLANGICI ===== */
        /* Analiz modalı açıkken, messenger'ın onun üzerinde görünmesini sağlar */
        #messenger {
            z-index: 99999 !important;
        }
        /* ===== MESSENGER Z-INDEX DÜZELTMESİ BİTİŞİ ===== */

        /* Genel Stiller */
        .federation-container { display: flex; align-items: center; gap: 8px; }
        #federation-select, .modal-federation-select { min-width: 200px; height: 32px; border: 1px solid #2a2a2a; border-radius: 6px; background: #1a1a1a; font-size: 13px; color: #fff; padding: 0 12px; transition: all 0.2s ease; }
        #federation-select:hover, .modal-federation-select:hover { border-color: #3a3a3a; background: #222; }
        #federation-select:disabled, .modal-federation-select:disabled { background: #1a1a1a; color: #666; cursor: not-allowed; }
        .federation-spinner { width: 16px; height: 16px; border: 2px solid #333; border-top: 2px solid #4a9eff; border-radius: 50%; animation: spin 1s linear infinite; display: inline-block; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        #nprogress .bar { background: #4a9eff !important; height: 3px !important; }

        /* Modal Stilleri */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px); z-index: 9998; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; cursor: pointer; }
        .modal-overlay.visible { opacity: 1; }
        .modal-content { background: #1a1a1a; border-radius: 12px; width: 90%; max-width: 1200px; max-height: 90vh; overflow-y: auto; position: relative; transform: scale(0.95); opacity: 0; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .modal-content::-webkit-scrollbar { width: 8px; height: 8px; }
        .modal-content::-webkit-scrollbar-track { background: transparent; }
        .modal-content::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .modal-content::-webkit-scrollbar-thumb:hover { background: #444; }
        .modal-content.visible { transform: scale(1); opacity: 1; }
        .modal-header { position: sticky; top: 0; right: 0; z-index: 10; background: #1a1a1a; padding: 16px 24px; border-bottom: 1px solid #2a2a2a; display: flex; justify-content: space-between; align-items: center; }
        .modal-close { width: 32px; height: 32px; border-radius: 50%; background: #2a2a2a; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; transition: all 0.2s ease; }
        .modal-close:hover { background: #333; transform: rotate(90deg); }
        .federation-display { padding: 24px; }
        .federation-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #2a2a2a; }
        .federation-header h2 { color: #fff; font-size: 24px; margin: 0; font-weight: 500; }

        /* Tablo Stilleri */
        .federation-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .federation-table th { text-align: left; padding: 12px; color: #888; font-weight: 500; background: #1a1a1a; position: sticky; top: 0; z-index: 1; }
        .federation-table th.sortable { cursor: pointer; user-select: none; transition: color 0.2s ease; }
        .federation-table th.sortable:hover { color: #fff; }
        .federation-table th.sortable::after { content: '⇕'; margin-left: 8px; opacity: 0.5; }
        .federation-table th.sort-asc::after { content: '↑'; opacity: 1; }
        .federation-table th.sort-desc::after { content: '↓'; opacity: 1; }
        .federation-table td { padding: 12px; border-bottom: 1px solid #2a2a2a; color: #fff; }
        .federation-table tr:hover { background: #222; }
        .key-member { border-left: 3px solid #ffd700; }
        .position-badge { padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: 500; }
        .position-top { background: #15803d; color: #fff; }
        .position-bottom { background: #991b1b; color: #fff; }
        .position-mid { background: #374151; color: #fff; }
        .member-info { display: flex; align-items: center; gap: 8px; }
        .flag-img { border-radius: 2px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
        .team-link { color: #4a9eff; text-decoration: none; transition: color 0.2s ease; }
        .team-link:hover { color: #60b0ff; }

        /* FED PUANI Hücre Stili */
        .fed-puani-cell { font-family: monospace; font-weight: 600; font-size: 1.1em; padding: 8px 12px !important; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 8px; color: #4a9eff; text-shadow: 0 0 10px rgba(74, 158, 255, 0.3); background: linear-gradient(45deg, #1a1a1a, #222); border-radius: 4px; }
        .fed-puani-total { padding: 1px 3px !important; border-radius: 6px !important; display: inline-block !important; text-align: center !important; font-weight: 600 !important; font-size: 1em !important; font-family: monospace !important; line-height: 1.5 !important; }
        .fed-puani-total.fed-puani-low { background-color: #f87171 !important; color: #000 !important; }
        .fed-puani-total.fed-puani-medium { background-color: #facc15 !important; color: #000 !important; }
        .fed-puani-total.fed-puani-high { background-color: #4ade80 !important; color: #000 !important; }
        .fed-puani-cell button.toggle-breakdown { color: #4a9eff !important; margin-left: 0 !important; }

        /* Karşılaştırma Modalı Stilleri */
        .comparison-container { display: flex; flex-direction: column; gap: 24px; margin-top: 24px; }
        .comparison-section { flex: 1; }
        .comparison-section h3 { color: #fff; font-size: 20px; margin-bottom: 16px; }

        /* Canlı Güncelleme ve Puan Tablosu Stilleri */
        .standings-updated-animation { transition: box-shadow 0.5s ease-in-out; box-shadow: 0 0 15px rgba(74, 158, 255, 0.7); }
        .nice_table tbody tr.red-bottom-border { border-bottom: 2px solid red !important; }
        .live-match-indicator { margin-left: 5px; font-size: 0.9em; color: #28a745; vertical-align: middle; font-weight: bold; text-shadow: 0 0 5px rgba(40, 167, 69, 0.5); }

        /* Federasyon Güç Özeti Tablosu Stilleri (Modern Tasarım v2) */
        #${SUMMARY_TABLE_CONTAINER_ID} {
            margin-top: 20px;
            margin-bottom: 20px;
            background: linear-gradient(145deg, #2c3e50, #1f2833);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            overflow-x: auto; /* <-- DEĞİŞTİRİLDİ: Sadece yatayda ve gerektiğinde kaydırma çubuğu göster */
            transition: all 0.3s ease-in-out;
        }
        #${SUMMARY_TABLE_CONTAINER_ID} .summary-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 18px;
            background-color: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            user-select: none;
        }
        #${SUMMARY_TABLE_CONTAINER_ID} h3 {
            color: #ecf0f1;
            font-size: 1.2em;
            margin: 0;
            padding: 0;
            border: none;
            font-weight: 500;
            flex-grow: 1;
            transition: color 0.2s;
        }
        #${SUMMARY_TABLE_CONTAINER_ID} .summary-header:hover h3 {
            color: #ffffff;
        }
        #${SUMMARY_TABLE_CONTAINER_ID} h3::after {
            content: '▲';
            font-size: 0.8em;
            margin-left: 10px;
            color: #7f8c8d;
            display: inline-block;
            transition: transform 0.3s ease-in-out;
        }
        #${SUMMARY_TABLE_CONTAINER_ID}.collapsed h3::after {
            transform: rotate(180deg);
        }
        #${SUMMARY_TABLE_CONTAINER_ID}.collapsed .summary-table,
        #${SUMMARY_TABLE_CONTAINER_ID}.collapsed #fetch-all-elos-btn {
            display: none;
        }
        #fetch-all-elos-btn {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
            transition: all 0.2s;
            margin-left: 15px;
        }
        #fetch-all-elos-btn:hover { background-color: #5dade2; }
        #fetch-all-elos-btn:disabled { background-color: #566573; cursor: not-allowed; }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-table th, .summary-table td {
            padding: 12px 18px;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
            white-space: nowrap; /* <-- EKLENDİ: Hücre içeriğinin alta kaymasını engelle, böylece tablo genişler */
        }
        /* Değişiklik: Başlıkların font boyutu ve kalınlığı artırıldı */
        .summary-table th {
            color: #c8d6e5;
            font-weight: 700; /* Daha kalın */
            font-size: 0.95em; /* Daha büyük */
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-top: 14px;
            padding-bottom: 14px;
        }
        .summary-table td {
            color: #bdc3c7;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            transition: background-color 0.2s ease, color 0.2s ease;
        }
        .summary-table td:first-child,
.summary-table td:nth-child(2) {
    font-weight: 500;
    color: #ecf0f1;
}
        .summary-table tbody tr:last-child td {
            border-bottom: none;
        }
        .summary-table tbody tr:hover td {
            background-color: rgba(52, 152, 219, 0.15);
            color: #ffffff;
        }
        .summary-table .rank-cell { text-align: center; width: 40px; }

        /* Değişiklik: Tüm değer hücreleri (Takım Değeri, ELO, FED PUANI) aynı stile sahip oldu */
        .summary-table .value-cell {
            text-align: right;
            font-family: monospace;
            font-weight: 500;
            color: #5dade2;
            text-shadow: 0 0 5px rgba(93, 173, 226, 0.3);
        }

        /* Değişiklik: puani-cell artık sadece ekstra kalınlık veriyor, renk .value-cell'den geliyor */
        .summary-table .puani-cell {
            font-weight: 700; /* FED PUANI'nı diğerlerinden biraz daha kalın yap */
        }
        .summary-table th.sortable { cursor: pointer; }
        .summary-table th.sortable:hover { color: #fff; }
        .summary-table th.sortable::after { content: ' ⇕'; opacity: 0.6; }
        .summary-table th.sort-asc::after { content: ' ↑'; opacity: 1; }
        .summary-table th.sort-desc::after { content: ' ↓'; opacity: 1; }
        .summary-table .federation-spinner { margin: 0 auto; }

        /* Fenerbahçe Analiz Modalı Stilleri */
        #fenerbahce-analysis-modal-body .federation-table,
        #fenerbahce-league-perf-modal-body .federation-table { border-collapse: collapse; margin-top: 10px; width: 100%; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25); background-color: #181818; }
        #fenerbahce-analysis-modal-body .federation-table th,
        #fenerbahce-league-perf-modal-body .federation-table th { background-color: #34495e !important; color: #ecf0f1 !important; padding: 10px 12px !important; text-align: left; border: 1px solid #46627f; font-weight: 600; }
        #fenerbahce-analysis-modal-body .federation-table td,
        #fenerbahce-league-perf-modal-body .federation-table td { padding: 9px 12px !important; border: 1px solid #3a3a3a; color: #bdc3c7; vertical-align: middle; }
        #fenerbahce-analysis-modal-body .federation-table tbody tr:nth-child(even) td,
        #fenerbahce-league-perf-modal-body .federation-table tbody tr:nth-child(even) td { background-color: #232323; }
        #fenerbahce-analysis-modal-body .federation-table tbody tr:hover td,
        #fenerbahce-league-perf-modal-body .federation-table tbody tr:hover td { background-color: #2f2f2f !important; color: #fff !important; }
        #fenerbahce-analysis-modal-body .federation-table a.team-link,
        #fenerbahce-league-perf-modal-body .federation-table a.team-link { color: #5dade2 !important; text-decoration: none; font-weight: 500; }
        #fenerbahce-analysis-modal-body .federation-table a.team-link:hover,
        #fenerbahce-league-perf-modal-body .federation-table a.team-link:hover { color: #85c1e9 !important; text-decoration: underline; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(1) { text-align: center; color: #95a5a6; width: 3%; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(2) { width: 30%; text-align: left !important; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(3),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(4),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(5),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(6),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(7),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(8),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(9),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(10) { text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 5%; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(4) { color: #2ecc71; font-weight: bold; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(5) { color: #f39c12; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(6) { color: #e74c3c; font-weight: bold; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(9) { font-weight: 500; color: #ecf0f1; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(10) { font-weight: bold; color: #f1c40f; }
        #fenerbahce-analysis-modal-body .federation-table tfoot tr td { background-color: #2c3e50 !important; color: #ecf0f1 !important; font-weight: bold; border-top: 2px solid #3498db !important; }
        #fenerbahce-analysis-modal-body .federation-table button.show-matches-btn { background-color: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.9em; transition: background-color 0.2s; }
        #fenerbahce-analysis-modal-body .federation-table button.show-matches-btn:hover { background-color: #2980b9; }
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(11) { width: 8%; }
        #fenerbahce-analysis-modal-body .federation-table td.match-result-G { color: #2ecc71 !important; font-weight: bold; }
        #fenerbahce-analysis-modal-body .federation-table td.match-result-B { color: #f39c12 !important; }
        #fenerbahce-analysis-modal-body .federation-table td.match-result-M { color: #e74c3c !important; font-weight: bold; }
        #fenerbahce-analysis-modal-body .federation-table td.match-score-cell { font-family: monospace; font-weight: 500; font-size: 1.05em; text-align: center !important; }
        #fenerbahce-analysis-modal-body .federation-table th:nth-child(1),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(1) { width: 30px; padding-left: 1px; padding-right: 1px; text-align: center; }
        #fenerbahce-analysis-modal-body .federation-table th:nth-child(2),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(2) { width: 35%; text-align: center; }
        #fenerbahce-analysis-modal-body .federation-table th:nth-child(3),
        #fenerbahce-analysis-modal-body .federation-table td:nth-child(3) { width: 20%; text-align: center; }
        #fenerbahce-analysis-modal-content .modal-header,
        #fenerbahce-league-perf-modal-content .modal-header { background-color: #1f2c39 !important; border-bottom: 1px solid #34495e !important; padding: 12px 20px !important; }
        #fenerbahce-analysis-modal-content .modal-header h2,
        #fenerbahce-league-perf-modal-content .modal-header h2 { font-size: 1.3em; color: #ecf0f1; margin: 0; display: flex; align-items: center; gap: 15px; }
        #fenerbahce-analysis-modal-content .modal-header button,
        #fenerbahce-analysis-modal-content .modal-header .modal-close,
        #fenerbahce-league-perf-modal-content .modal-header button,
        #fenerbahce-league-perf-modal-content .modal-header .modal-close { padding: 6px 12px; font-size: 0.9em; }
        #fenerbahce-analysis-modal-content .modal-close:hover,
        #fenerbahce-league-perf-modal-content .modal-close:hover { background-color: #c0392b !important; color: white !important; }
        #fenerbahce-analysis-modal-content #analysis-progress,
        #fenerbahce-league-perf-modal-content #analysis-progress { margin-top: 20px; }
        #fenerbahce-analysis-modal-content #analysis-progress-bar,
        #fenerbahce-league-perf-modal-content #analysis-progress-bar { background-color: #2980b9 !important; font-weight: bold; text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3); }
        #fenerbahce-analysis-modal-body .average-score-per-match { font-size: 0.85em; font-weight: 500; color: #85c1e9; margin-left: 5px; }

        /* Fenerbahçe Analiz Tablosu için Gelişmiş Vurgulama ve Tooltip Stilleri */
        tr.current-season-opponent > td {
            background-color: rgba(52, 152, 219, 0.12) !important;
        }
        tr.current-season-opponent > td:first-child {
            border-left: 3px solid #3498db;
        }

        /* Wrapper için stil (tooltip konumlandırması için) */
.current-opponent-wrapper {
    /* --- YENİ EKLENEN/DEĞİŞTİRİLEN STİLLER --- */
    display: inline-flex;      /* İçindeki resmi merkezlemek için */
    align-items: center;        /* Dikeyde merkezle */
    justify-content: center;    /* Yatayda merkezle */
    width: 20px;                /* Çemberin genişliği */
    height: 20px;               /* Çemberin yüksekliği */
    background-color: #ffffe5;  /* Çemberin iç rengi */
    border-radius: 50%;         /* Daire şekli için */
    border: 1px solid #5dade2;  /* Dairenin kenarlığı */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    cursor: help;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    /* --- ESKİDEN DE BURADA OLAN STİLLER --- */
    position: relative;
    vertical-align: middle;
    margin-left: 8px;
}

        /* İkonun kendisi için stil (<img> etiketi) */
img.current-opponent-icon {
    /* Sadece kılıçların boyutunu ayarlayın. Çemberden küçük olmalı! */
    width: 16px;
    height: 16px;

    /* --- BU STİLLERİN HEPSİ YUKARIDAKİ WRAPPER'A TAŞINDI, BURADAN SİLİN ---
    background-color: #ffffe5;
    border-radius: 50%;
    border: 2px solid #5dade2;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    cursor: help;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    */
}

        .current-opponent-wrapper:hover {   /* YENİ HALİ */
    transform: scale(1.15); /* Hoverda daha belirgin büyüme */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
}

        /* Tooltip'i wrapper'a göre konumlandır */
        .current-opponent-wrapper .tooltip-text {
            /* ... (Bu stil bloğu zaten scriptinizde var, olduğu gibi kalabilir) ... */
            /* Sadece konumlandırma değerlerini kontrol edelim */
            visibility: hidden;
            width: 180px;
            background-color: #1c1c1c;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 8px 12px;
            position: absolute;
            z-index: 10;
            bottom: 125%; /* İkonun biraz üstünde */
            left: 50%;
            margin-left: -90px;
            opacity: 0;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            pointer-events: none;
        }
        .current-opponent-wrapper .tooltip-text::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #1c1c1c transparent transparent transparent;
        }
        .current-opponent-wrapper:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        /* Özel Tooltip Stili */
        .current-opponent-indicator .tooltip-text {
            visibility: hidden; /* Başlangıçta gizli */
            width: 180px;
            background-color: #1c1c1c;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 8px 12px;
            position: absolute;
            z-index: 10;
            bottom: 150%; /* İkonun üstünde konumlandır */
            left: 50%;
            margin-left: -90px; /* Genişliğin yarısı kadar sola çekerek ortala */
            opacity: 0; /* Başlangıçta tamamen şeffaf */
            transition: opacity 0.3s ease, visibility 0.3s ease;
            font-size: 0.9em;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
            pointer-events: none; /* Tooltip'in fare olaylarını engellememesi için */
        }

        /* Tooltip'in altındaki ok */
        .current-opponent-indicator .tooltip-text::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #1c1c1c transparent transparent transparent;
        }

        /* Fare üzerine gelindiğinde tooltip'i görünür yap */
        .current-opponent-indicator:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }

        /* ===== YENİ VE GELİŞTİRİLMİŞ RAKİP ANALİZİ STİLLERİ BAŞLANGICI ===== */
        .mz-team-cell { display: flex; align-items: center; }
        .mz-indicators-wrapper {
            margin-left: auto; /* İkonları en sağa yaslar */
            margin-right: 3px; /* Sağdan biraz boşluk bırakır */
            display: flex;
            align-items: center;
            white-space: nowrap;
            padding-left: 10px;
        }
        .match-indicator {
            display: inline-block;
            width: 13.5px; /* Boyut büyütüldü */
            height: 12.5px; /* Boyut büyütüldü */
            border-radius: 50%;
            margin-left: 8px; /* İkonlar arası boşluk arttırıldı */
            vertical-align: middle;
            border: 1px solid rgba(0,0,0,0.6);
            cursor: pointer; /* Tıklanabilir imleç */
            flex-shrink: 0;
        }
        .match-win { background-color: #28a745; }
        .match-loss { background-color: #dc3545; }
        .match-draw { background-color: #ffc107; }
        .match-future {
            font-size: 11px;
            color: #000; /* Renk değiştirildi */
            margin-left: 8px;
            font-style: italic;
            font-weight: bold;
        }

        .mz-custom-tooltip {
            position: absolute;
            display: none;
            padding: 8px 12px; /* Daha büyük padding */
            color: #fff;
            border-radius: 6px; /* Daha yuvarlak kenarlar */
            font-size: 14px; /* Yazı boyutu büyütüldü */
            font-weight: bold;
            z-index: 99999;
            pointer-events: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            line-height: 1;
            white-space: nowrap;
            /* Tooltip rengini ikon rengine göre ayarlıyoruz */
            border: 1px solid;
        }
        .mz-custom-tooltip::before {
            content: '';
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: -6px;
            border-width: 6px;
            border-style: solid;
        }
        /* ===== FİNAL RAKİP ANALİZİ STİLLERİ (Doğru ve Kaydırmaz Hizalama) ===== */

/* 1. ADIM: Ana hücreye "position: relative" ekliyoruz.
   Bu, içindeki mutlak konumlandırılmış öğelerin bu hücreye göre hizalanmasını sağlar. */
.mz-team-cell {
    position: relative; /* KRİTİK DEĞİŞİKLİK */
}

/* 2. ADIM: İkon sarmalayıcısını "position: absolute" yapıyoruz.
   Bu, ikonları normal metin akışından tamamen çıkarır ve kaymayı önler.
   Sağdan ve üstten hizalayarak hücrenin sonuna düzgünce yerleştiririz. */
.mz-indicators-wrapper {
    position: absolute;      /* KRİTİK DEĞİŞİKLİK: Öğeyi akıştan çıkarır */
    right: 15px;             /* Hücrenin sağ kenarından 15 piksel içeride konumlandır */
    top: 50%;                /* Hücrenin dikey olarak ortasına hizala */
    transform: translateY(-50%); /* Dikey hizalamayı mükemmelleştirmek için kendi yüksekliğinin yarısı kadar yukarı çek */

    /* Bu stiller, ikonların kendi içindeki hizalaması için korunmalıdır */
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
}

/* Geri kalan stilleriniz doğru ve olduğu gibi kalabilir */
.match-indicator {
    display: inline-block;
    width: 13.5px;
    height: 12.5px;
    border-radius: 50%;
    margin-left: 8px;
    vertical-align: middle;
    border: 1px solid rgba(0,0,0,0.6);
    cursor: pointer;
    flex-shrink: 0;
}
.match-win { background-color: #28a745; }
.match-loss { background-color: #dc3545; }
.match-draw { background-color: #ffc107; }
.match-future {
    font-size: 11px;
    color: #000;
    margin-left: 8px;
    font-style: italic;
    font-weight: bold;
}
/* SIRADAKİ RAKİP VURGULAMA STİLİ */
.mz-next-opponent {
    background-color: #fff3cd !important;
    font-weight: bold;
}
.mz-next-opponent a {
    color: #856404 !important;
}

.mz-custom-tooltip {
    position: absolute; display: none; padding: 8px 12px;
    color: #fff; border-radius: 6px; font-size: 14px; font-weight: bold;
    z-index: 99999; pointer-events: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5); line-height: 1; white-space: nowrap;
    border: 1px solid;
}
.mz-custom-tooltip::before {
    content: ''; position: absolute; top: 50%; right: 100%;
    margin-top: -6px; border-width: 6px; border-style: solid;
}
.tooltip-win { background-color: #28a745; border-color: #1e7e34; }
.tooltip-win::before { border-color: transparent #1e7e34 transparent transparent; }
.tooltip-loss { background-color: #dc3545; border-color: #b21f2d; }
.tooltip-loss::before { border-color: transparent #b21f2d transparent transparent; }
.tooltip-draw { background-color: #ffc107; border-color: #d39e00; color: #212529; text-shadow: none; }
.tooltip-draw::before { border-color: transparent #d39e00 transparent transparent; }
/* ===== FİNAL RAKİP ANALİZİ STİLLERİ BİTİŞİ ===== */

/* ===== FİNAL EŞLEŞTİRME TABLOSU STİLLERİ (Geliştirilmiş Başlık) ===== */
        .matched-comparison-container {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #4a9eff;
        }
        .matched-comparison-container h3 {
            color: #fff;
            font-size: 20px; /* Başlığı biraz küçülterek tabloya odaklanıyoruz */
            text-align: center;
            margin-bottom: 20px;
        }
        .matched-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background-color: rgba(0,0,0,0.2); /* Tabloya hafif bir arka plan */
            border-radius: 8px;
            overflow: hidden;
        }
        /* YENİ: Başlık sırasının tamamını vurguluyoruz */
        .matched-table thead tr {
            background-color: #1f2833;
        }
        .matched-table th, .matched-table td {
            padding: 12px 10px;
            text-align: center;
            border-bottom: 1px solid #2a2a2a;
            vertical-align: middle;
        }
        /* YENİ: Federasyon başlıklarını patlatacak stil */
        .matched-table th {
            font-size: 1.5em;
            font-weight: 600;
            color: #ffd700; /* Rengi VS ile aynı SARI yaptık */
            padding: 12px 10px;
            border-bottom: 3px solid #555; /* Alt çizgiyi nötr bir renge çektik */
            letter-spacing: 1px;
        }
        .matched-table .team-name-cell {
            text-align: right;
            width: 45%;
        }
        .matched-table .team-name-cell-away {
            text-align: left;
            width: 45%;
        }
        .matched-table .vs-cell {
            font-weight: bold;
            font-size: 1.2em;
            color: #ffd700;
            width: 10%;
        }
        /* YENİ: VS başlığının rengini sarı olarak koruyoruz */
        .matched-table th.vs-cell {
            font-size: 1.4em;
            color: #ffd700;
        }
        .matched-table tr:hover {
            background-color: #283747;
        }

        /* YENİ EKLENEN STİLLER: Sıralama Analizi için */
        .ranking-analysis-btn {
            margin-left: 8px;
            padding: 6px 12px;
            font-size: 0.9em;
            background: linear-gradient(to bottom, #f0ad4e, #eea236);
            color: white;
            border: 1px solid #d58512;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .ranking-analysis-btn:hover {
            background: linear-gradient(to bottom, #ec971f, #d58512);
            border-color: #985f0d;
        }
        #ranking-analysis-modal-content .modal-header {
             background-color: #1f2c39 !important;
        }
        #ranking-analysis-modal-content .modal-header h2 {
            font-size: 1.3em; color: #ecf0f1; margin: 0;
        }
        #ranking-analysis-modal-body .ranking-controls {
            display: flex; gap: 15px; margin-bottom: 15px; padding: 10px;
            background-color: rgba(0,0,0,0.2); border-radius: 6px;
        }
        #ranking-analysis-modal-body #ranking-search-input {
            flex-grow: 1; padding: 8px 12px; border: 1px solid #444; border-radius: 4px;
            background-color: #222; color: #fff; font-size: 1em;
        }
        #ranking-analysis-table {
            border-collapse: collapse; width: 100%;
        }
        #ranking-analysis-table th {
            background-color: #34495e !important; color: #ecf0f1 !important; padding: 10px 12px !important;
            text-align: left; border: 1px solid #46627f; font-weight: 600; cursor: pointer; user-select: none;
        }
        #ranking-analysis-table th::after { content: ' ⇕'; opacity: 0.5; }
        #ranking-analysis-table td {
            padding: 9px 12px !important; border: 1px solid #3a3a3a; color: #bdc3c7; vertical-align: middle;
        }
        #ranking-analysis-table tbody tr:nth-child(even) td { background-color: #232323; }
        #ranking-analysis-table tbody tr:hover td { background-color: #2f2f2f !important; color: #fff !important; }
        #ranking-analysis-table a { color: #5dade2 !important; text-decoration: none; font-weight: 500; }

    `);


    // ====================================================================================
    // BÖLÜM 3: ÇEKİRDEK İŞLEVSELLİK (PUAN DURUMU, SIRALAMA VB.)
    // ====================================================================================

    const CACHE_KEY = 'alex66';
    const FEDERATION_STANDINGS_TABLE_SELECTOR = 'table.nice_table';
    const COL_INDEX_FED_NAME = 1;
    const COL_INDEX_WINS = 2;
    const COL_INDEX_DRAWS = 3;
    const COL_INDEX_LOSSES = 4;
    const COL_INDEX_EBP = 5;
    const COL_INDEX_POINTS = 6;
    let activeFederationMatchResults = [];

    function updateFederationRowInTable(fid, result) {
        const table = document.querySelector(FEDERATION_STANDINGS_TABLE_SELECTOR);
        if (!table) {
            console.warn(`Ana federasyon puan durumu tablosu ('${FEDERATION_STANDINGS_TABLE_SELECTOR}') bulunamadı.`);
            return;
        }
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            console.warn(`Ana federasyon puan durumu tablosunda 'tbody' bulunamadı.`);
            return;
        }

        let federationRow = null;
        for (const row of Array.from(tbody.querySelectorAll('tr'))) {
            const fedLink = row.cells[COL_INDEX_FED_NAME]?.querySelector('a.fed_link');
            if (fedLink && fedLink.href.match(/fid=(\d+)/)?.[1] === fid) {
                federationRow = row;
                break;
            }
        }

        if (!federationRow) {
            console.warn(`Federasyon satırı bulunamadı (FID: ${fid}) ana puan tablosunda ('${FEDERATION_STANDINGS_TABLE_SELECTOR}').`);
            return;
        }

        const cells = federationRow.cells;
        if (cells.length < COL_INDEX_POINTS + 1) {
            console.warn(`Federasyon satırında (FID: ${fid}) yeterli hücre yok. Hücre sayısı: ${cells.length}, Beklenen en az: ${COL_INDEX_POINTS + 1}`);
            return;
        }

        const parseCell = c => parseInt(c.textContent.trim(), 10) || 0;

        const totalMatchesPlayed = parseCell(cells[COL_INDEX_WINS]) + parseCell(cells[COL_INDEX_DRAWS]) + parseCell(cells[COL_INDEX_LOSSES]);
        if (totalMatchesPlayed >= 11) {
            const fedName = cells[COL_INDEX_FED_NAME]?.querySelector('a.fed_link')?.title || `FID ${fid}`;
            console.log(`[Canlı Güncelleme] ${fedName} takımı sezonu tamamladığı (${totalMatchesPlayed} maç) için güncelleme atlandı.`);
            return;
        }

        const updateCell = (cellElement, newValue) => {
            if (cellElement) {
                cellElement.textContent = newValue;
                cellElement.style.backgroundColor = 'rgba(74, 158, 255, 0.3)';
                setTimeout(() => {
                    cellElement.style.backgroundColor = '';
                }, 2000);
            } else {
                console.warn("Güncellenecek hücre bulunamadı.");
            }
        };

        const newWins = parseCell(cells[COL_INDEX_WINS]) + (result.wins_to_add || 0);
        const newDraws = parseCell(cells[COL_INDEX_DRAWS]) + (result.draws_to_add || 0);
        const newLosses = parseCell(cells[COL_INDEX_LOSSES]) + (result.losses_to_add || 0);
        const newEBP = parseCell(cells[COL_INDEX_EBP]) + (result.score_achieved_in_match || 0);
        const newPoints = parseCell(cells[COL_INDEX_POINTS]) + (result.points_to_add || 0);

        updateCell(cells[COL_INDEX_WINS], newWins);
        updateCell(cells[COL_INDEX_DRAWS], newDraws);
        updateCell(cells[COL_INDEX_LOSSES], newLosses);
        updateCell(cells[COL_INDEX_EBP], newEBP);
        updateCell(cells[COL_INDEX_POINTS], newPoints);
    }

    function sortFederationTableByPoints() {
        const table = document.querySelector(FEDERATION_STANDINGS_TABLE_SELECTOR);
        if (!table) return;
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // DEĞİŞİKLİK 1: Temizleme işlemi güncellendi.
        // Hem kırmızı sınıfı hem de olası inline stilleri (yeşil çizgi için) temizliyoruz.
        tbody.querySelectorAll('tr').forEach(row => {
            row.classList.remove('red-bottom-border');
            row.style.removeProperty('border-bottom');
        });

        const dataRows = Array.from(tbody.querySelectorAll('tr')).filter(r => {
            const cells = r.querySelectorAll('td');
            return cells.length > COL_INDEX_POINTS && cells[COL_INDEX_POINTS] && !isNaN(parseInt(cells[COL_INDEX_POINTS].textContent.trim())) &&
                cells.length > COL_INDEX_EBP && cells[COL_INDEX_EBP] && !isNaN(parseInt(cells[COL_INDEX_EBP].textContent.trim()));
        });

        dataRows.sort((a, b) => {
            const getVal = (row, index) => parseInt(row.querySelectorAll('td')[index].textContent.trim().replace('+', ''), 10) || 0;

            const pointsA = getVal(a, COL_INDEX_POINTS);
            const pointsB = getVal(b, COL_INDEX_POINTS);
            if (pointsB !== pointsA) return pointsB - pointsA;

            const ebpA = getVal(a, COL_INDEX_EBP);
            const ebpB = getVal(b, COL_INDEX_EBP);
            if (ebpB !== ebpA) return ebpB - ebpA;

            const fedNameA = a.cells[COL_INDEX_FED_NAME]?.querySelector('a.fed_link')?.title || '';
            const fedNameB = b.cells[COL_INDEX_FED_NAME]?.querySelector('a.fed_link')?.title || '';
            return fedNameA.localeCompare(fedNameB);
        });

        const fragment = document.createDocumentFragment();
        dataRows.forEach((row, index) => {
            const posCell = row.querySelector('td:first-child');
            if (posCell) posCell.textContent = index + 1;
            fragment.appendChild(row);
        });

        Array.from(tbody.querySelectorAll('tr')).filter(r => !dataRows.includes(r)).forEach(r => fragment.appendChild(r));

        tbody.innerHTML = '';
        tbody.appendChild(fragment);

        const allRowsInTbody = tbody.children;

        // DEĞİŞİKLİK 2: Yeşil çizgi artık sınıf ile değil, DOĞRUDAN STİL olarak ekleniyor.
        // Ayrıca bu kuralın sadece üst liglerde (Elite ve Division 1) geçerli olduğunu kontrol ediyoruz.
        // LEAGUE_STATE.level 0 = Elite, 1 = Division 1 demektir.
        if (LEAGUE_STATE.level <= 1) {
            if (allRowsInTbody.length >= 3) {
                const thirdRow = allRowsInTbody[2]; // 3. satırın indeksi 2'dir.
                thirdRow.style.borderBottom = '2px solid green'; // CSS sınıfı yerine doğrudan stil ataması yapıyoruz.
            }
        }

        // Kırmızı çizgi mantığı eskisi gibi kalıyor, bu doğruydu.
        if (allRowsInTbody.length >= 6) {
            const sixthRow = allRowsInTbody[5]; // 6. satırın indeksi 5'tir.
            sixthRow.classList.add('red-bottom-border');
        }

        table.classList.add('standings-updated-animation');
        setTimeout(() => table.classList.remove('standings-updated-animation'), 2000);
    }

    function processFederationMatchResult(fid1, score1, fid2, score2) {
        let points_fid1 = 0;
        let points_fid2 = 0;

        if (score1 > score2) {
            points_fid1 = 3;
        } else if (score2 > score1) {
            points_fid2 = 3;
        } else {
            points_fid1 = 1;
            points_fid2 = 1;
        }

        let resultFid1 = {
            points_to_add: points_fid1,
            wins_to_add: (score1 > score2 ? 1 : 0),
            draws_to_add: (score1 === score2 ? 1 : 0),
            losses_to_add: (score1 < score2 ? 1 : 0),
            score_achieved_in_match: score1
        };
        let resultFid2 = {
            points_to_add: points_fid2,
            wins_to_add: (score2 > score1 ? 1 : 0),
            draws_to_add: (score1 === score2 ? 1 : 0),
            losses_to_add: (score2 < score1 ? 1 : 0),
            score_achieved_in_match: score2
        };

        updateFederationRowInTable(fid1, resultFid1);
        updateFederationRowInTable(fid2, resultFid2);
    }

    function updateFederationStandingsFromResults() {
        if (activeFederationMatchResults.length === 0) {
            console.log("Güncellenecek federasyon maçı sonucu yok.");
            return;
        }

        NProgress.start();

        activeFederationMatchResults.forEach(match => {
            if (match.fid1 && match.fid2 && typeof match.score1 === 'number' && typeof match.score2 === 'number') {
                processFederationMatchResult(match.fid1, match.score1, match.fid2, match.score2);
            }
        });

        sortFederationTableByPoints();

        NProgress.done();

        const statusMessage = document.createElement('div');
        statusMessage.textContent = 'Federasyon puan durumu güncellendi!';
        statusMessage.style.position = 'fixed';
        statusMessage.style.bottom = '20px';
        statusMessage.style.left = '20px';
        statusMessage.style.backgroundColor = '#4a9eff';
        statusMessage.style.color = 'white';
        statusMessage.style.padding = '10px';
        statusMessage.style.borderRadius = '5px';
        statusMessage.style.zIndex = '10000';
        document.body.appendChild(statusMessage);
        setTimeout(() => {
            statusMessage.remove();
        }, 3000);
    }


    // ====================================================================================
    // BÖLÜM 4: VERİ İŞLEME VE PUAN HESAPLAMA
    // ====================================================================================

    const LEAGUE_STATE = {
        season: null,
        subSeason: null,
        level: null,
        group: null,
        division: null,
        currentRound: null,
        federations: []
    };

    const CURRENCIES = {
        "R$": 0.286, EUR: 1, USD: 0.809, "点": 0.109, SEK: 0.109, NOK: 0.117, DKK: 0.135,
        GBP: 1.456, CHF: 0.639, RUB: 0.029, CAD: 0.622, AUD: 0.618, MZ: 0.109, MM: 0.109,
        PLN: 0.213, ILS: 0.185, INR: 0.019, THB: 0.019, ZAR: 0.135, SKK: 0.027, BGN: 0.513,
        MXN: 0.075, ARS: 0.288, BOB: 0.102, UYU: 0.028, PYG: 0.00014, ISK: 0.011, SIT: 0.004, JPY: 0.007
    };

    let modalOverlay = null;
    let currentSort = { column: 'fedPuani', direction: 'desc' };
    const fedPuaniCache = new Map();

    function getCachedData() {
        const cache = JSON.parse(GM_getValue(CACHE_KEY, '{}'));
        return cache;
    }

    function setCachedData(key, round, data) {
        const cache = getCachedData();
        cache[key] = { round, data, timestamp: Date.now() };
        GM_setValue(CACHE_KEY, JSON.stringify(cache));
    }

    function convertToEUR(value, fromCurrency) {
        if (!value || !fromCurrency) return value;
        const key = fromCurrency.trim();
        const fromRate = CURRENCIES[key] || 1;
        return value * fromRate;
    }

    function calculateFedPuani(member) {
        const cacheKey = `${member.teamId}_${member.league}_${member.worldLeague}`;
        if (fedPuaniCache.has(cacheKey)) {
            return fedPuaniCache.get(cacheKey);
        }

        const league = (member.league || '').toLowerCase();
        const worldLeague = (member.worldLeague || 'N/A').toLowerCase();
        const leaguePosition = member.leaguePosition || 0;
        const worldLeaguePosition = member.worldLeaguePosition || 0;
        const ranking = member.ranking || 0;
        const teamValue = member.startingXIValue || 0;

        const getLeagueBonus = () => {
            if (league.startsWith('div3')) return 10;
            if (league.startsWith('div2')) return 15;
            if (league.startsWith('div1')) return 20;
            if (/^div[4-9]/.test(league)) return 0;
            return 25;
        };

        const getLeaguePositionBonus = () => {
            if (league.startsWith('div3')) return Math.max(1, 13 - leaguePosition);
            if (league.startsWith('div2')) return Math.max(6, 18 - leaguePosition);
            if (league.startsWith('div1')) return Math.max(11, 23 - leaguePosition);
            if (/^div[4-9]/.test(league)) return 0;
            return Math.max(16, 28 - leaguePosition);
        };

        const getWLBonus = () => {
            if (worldLeague === 'n/a') return 0;
            if (worldLeague.startsWith('div5')) return 5;
            if (worldLeague.startsWith('div4')) return 10;
            if (worldLeague.startsWith('div3')) return 16;
            if (worldLeague.startsWith('div2')) return 20;
            if (worldLeague.startsWith('div1')) return 28;
            return 40;
        };

        const getWLPositionBonus = () => {
            if (worldLeague === 'n/a') return 0;
            const bonuses_div5 = [5, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const bonuses_div4 = [8, 6, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1];
            if (worldLeague.startsWith('div5')) return bonuses_div5[worldLeaguePosition - 1] || 1;
            if (worldLeague.startsWith('div4')) return bonuses_div4[worldLeaguePosition - 1] || 1;
            if (worldLeague.startsWith('div3')) return Math.max(1, 13 - worldLeaguePosition);
            if (worldLeague.startsWith('div2')) return Math.max(9, 21 - worldLeaguePosition);
            if (worldLeague.startsWith('div1')) return Math.max(17, 29 - worldLeaguePosition);
            return Math.max(29, 41 - worldLeaguePosition);
        };

        const getRankingBonus = () => {
    if (!ranking || ranking <= 0) {
        return 0; // Sıralama yoksa veya 0 ise 0 puan ver
    }
    // Maksimum 15 puandan başlayıp, sıralama arttıkça logaritmik olarak azalan pürüzsüz formül.
    const bonus = 5 * (4 - Math.log10(ranking));
    // Puanın 1-15 aralığında kalmasını ve 2 ondalık basamakla sınırlandırılmasını sağlıyoruz.
    return Math.max(1, Math.min(15, Number(bonus.toFixed(2))));
};

        const valueInMillions = teamValue / 1000000;
let teamValueBonus;
if (valueInMillions <= 1) {
    teamValueBonus = valueInMillions * 4;
} else {
    teamValueBonus = 15 * Math.log(valueInMillions);
}

const total = Number((getLeagueBonus() + getLeaguePositionBonus() + getWLBonus() + getWLPositionBonus() + getRankingBonus() + teamValueBonus).toFixed(2));
fedPuaniCache.set(cacheKey, total);
return total;
    }

   function calculateInternalPowerScores(members) {
    if (!members || members.length === 0) return [];

    const eloPuanlari = members.map(m => (typeof m.statsXenteElo === 'number' ? m.statsXenteElo : 1500));
    const fedPuanlari = members.map(m => calculateFedPuani(m));

    const minFedPuani = Math.min(...fedPuanlari);
    const maxFedPuani = Math.max(...fedPuanlari);
    const minElo = Math.min(...eloPuanlari);
    const maxElo = Math.max(...eloPuanlari);

    const rangeFed = maxFedPuani - minFedPuani;
    const rangeElo = maxElo - minElo;

    return members.map(member => {
        const fedPuani = calculateFedPuani(member);
        const elo = (typeof member.statsXenteElo === 'number' ? member.statsXenteElo : 1500);

        // HATA DÜZELTMESİ: Eğer aralık (range) sıfır ise, bu tüm değerlerin aynı olduğu anlamına gelir.
        // Bu durumda normalleştirilmiş skoru 0.5 (orta nokta) olarak kabul et. Bu, sıfıra bölme hatasını (NaN) tamamen önler.
        const normalizedFed = rangeFed > 0 ? (fedPuani - minFedPuani) / rangeFed : 0.5;
        const normalizedElo = rangeElo > 0 ? (elo - minElo) / rangeElo : 0.5;

        // Ağırlıklı Güç Skoru Hesaplama
        const internalPowerScore = (normalizedFed * 0.3) + (normalizedElo * 0.7);

        // Yeni özelliği üyeye ekleyerek döndür
        return { ...member, internalPowerScore };
    });
}

    function getFedPuaniBreakdown(member) {
        const league = (member.league || '').toLowerCase();
        const worldLeague = (member.worldLeague || 'N/A').toLowerCase();
        const leaguePosition = member.leaguePosition || 0;
        const worldLeaguePosition = member.worldLeaguePosition || 0;
        const ranking = member.ranking || 0;
        const teamValue = member.startingXIValue || 0;

        let leagueBonus;
        if (league.startsWith('div3')) leagueBonus = 10;
        else if (league.startsWith('div2')) leagueBonus = 15;
        else if (league.startsWith('div1')) leagueBonus = 20;
        else if (/^div[4-9]/.test(league)) leagueBonus = 0;
        else leagueBonus = 25;

        let leaguePositionBonus;
        if (league.startsWith('div3')) leaguePositionBonus = Math.max(1, 13 - leaguePosition);
        else if (league.startsWith('div2')) leaguePositionBonus = Math.max(6, 18 - leaguePosition);
        else if (league.startsWith('div1')) leaguePositionBonus = Math.max(11, 23 - leaguePosition);
        else if (/^div[4-9]/.test(league)) leaguePositionBonus = 0;
        else leaguePositionBonus = Math.max(16, 28 - leaguePosition);

        let wlBonus;
        if (worldLeague === 'n/a') wlBonus = 0;
        else if (worldLeague.startsWith('div5')) wlBonus = 5;
        else if (worldLeague.startsWith('div4')) wlBonus = 10;
        else if (worldLeague.startsWith('div3')) wlBonus = 16;
        else if (worldLeague.startsWith('div2')) wlBonus = 20;
        else if (worldLeague.startsWith('div1')) wlBonus = 28;
        else wlBonus = 40;

        let wlPositionBonus;
        const bonuses_div5 = [5, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const bonuses_div4 = [8, 6, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1];
        if (worldLeague === 'n/a') wlPositionBonus = 0;
        else if (worldLeague.startsWith('div5')) wlPositionBonus = bonuses_div5[worldLeaguePosition - 1] || 1;
        else if (worldLeague.startsWith('div4')) wlPositionBonus = bonuses_div4[worldLeaguePosition - 1] || 1;
        else if (worldLeague.startsWith('div3')) wlPositionBonus = Math.max(1, 13 - worldLeaguePosition);
        else if (worldLeague.startsWith('div2')) wlPositionBonus = Math.max(9, 21 - worldLeaguePosition);
        else if (worldLeague.startsWith('div1')) wlPositionBonus = Math.max(17, 29 - worldLeaguePosition);
        else wlPositionBonus = Math.max(29, 41 - worldLeaguePosition);

        let rankingBonus;
if (!ranking || ranking <= 0) {
    rankingBonus = 0; // Sıralama yoksa veya 0 ise 0 puan ver
} else {
    // Maksimum 15 puandan başlayıp, sıralama arttıkça logaritmik olarak azalan pürüzsüz formül.
    const bonus = 5 * (4 - Math.log10(ranking));
    // Puanın 1-15 aralığında kalmasını ve 2 ondalık basamakla sınırlandırılmasını sağlıyoruz.
    rankingBonus = Math.max(1, Math.min(15, Number(bonus.toFixed(2))));
}

        const valueInMillions = teamValue / 1000000;
let teamValueBonus;
if (valueInMillions <= 1) {
    // Değeri 1 Milyon'dan az olan takımlar için negatif sonuçlar almamak adına lineer bir başlangıç yapıyoruz.
    teamValueBonus = valueInMillions * 4;
} else {
    // Değer arttıkça etkinin azaldığı logaritmik formül.
    // Çarpanı (örneğin 15) ayarlayarak bonusun etkisini artırıp azaltabilirsiniz.
    teamValueBonus = 15 * Math.log(valueInMillions);
}
teamValueBonus = Number(teamValueBonus.toFixed(2));
        const total = Number((leagueBonus + leaguePositionBonus + wlBonus + wlPositionBonus + rankingBonus + teamValueBonus).toFixed(2));
        return { leagueBonus, leaguePositionBonus, wlBonus, wlPositionBonus, rankingBonus, teamValueBonus, total };
    }


    // ====================================================================================
    // BÖLÜM 5: VERİ ÇEKME (FETCH) İŞLEMLERİ
    // ====================================================================================

    function sortMembers(members, column, direction) {
        return [...members].sort((a, b) => {
            let valA, valB;
            switch (column) {
                case 'startingXIValue':
                    valA = a.startingXIValue || 0;
                    valB = b.startingXIValue || 0;
                    break;
                case 'fedPuani':
                    valA = calculateFedPuani(a);
                    valB = calculateFedPuani(b);
                    break;
                case 'league':
                    valA = a.league || '';
                    valB = b.league || '';
                    break;
                case 'ranking':
                    valA = a.ranking || 0;
                    valB = b.ranking || 0;
                    break;
                case 'statsXenteElo':
                    valA = a.statsXenteElo || 0;
                    valB = b.statsXenteElo || 0;
                    break;
                // YENİ EKLENEN CASE
                case 'internalPowerScore':
                    valA = a.internalPowerScore || 0;
                    valB = b.internalPowerScore || 0;
                    break;
                default:
                    return 0;
            }
            if (typeof valA === 'string') return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return direction === 'asc' ? valA - valB : valB - valA;
        });
    }

    async function fetchWorldLeagueData(teamId) {
        try {
            const response = await fetch(`https://www.managerzone.com/?p=team&tid=${teamId}`);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const worldLeagueLink = doc.querySelector('#infoAboutTeam a[href*="type=world"]');
            if (!worldLeagueLink) return { worldLeague: 'N/A', worldLeagueId: null, worldLeaguePosition: null };

            const worldLeague = worldLeagueLink.textContent;
            const worldLeagueId = worldLeagueLink.href.match(/sid=(\d+)/)?.[1];
            if (!worldLeagueId) return { worldLeague, worldLeagueId: null, worldLeaguePosition: null };

            const positionResponse = await fetch(`https://www.managerzone.com/ajax.php?p=league&type=world&sid=${worldLeagueId}&tid=0&sport=soccer&sub=table`);
            const positionHtml = await positionResponse.text();
            const positionDoc = new DOMParser().parseFromString(positionHtml, 'text/html');

            for (let tr of Array.from(positionDoc.querySelectorAll('tr'))) {
                if (tr.innerHTML.includes(`tid=${teamId}`)) {
                    const positionCell = tr.querySelector('td:first-child');
                    return { worldLeague, worldLeagueId, worldLeaguePosition: parseInt(positionCell.textContent.trim()) };
                }
            }
            return { worldLeague, worldLeagueId, worldLeaguePosition: null };
        } catch (error) {
            return { worldLeague: 'N/A', worldLeagueId: null, worldLeaguePosition: null };
        }
    }

    async function fetchTeamEloFromStatsXente(teamId, teamName = '') {
        if (!teamId) return null;
        const url = `https://statsxente.com/MZ1/Graficos/graficoEloHistoryCompare.php?sport=soccer&category=SENIOR&idEquipo=${teamId}&equipo=${encodeURIComponent(teamName)}&idioma=ENGLISH&divisa=EUR`;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                timeout: 20000,
                onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        const match = res.responseText.match(/const\s+team_id0\s*=\s*(\[.*?\]);/s);
                        if (match && match[1]) {
                            try {
                                const history = JSON.parse(match[1]);
                                if (history.length > 0) resolve(Math.round(history[history.length - 1].y));
                                else resolve(null);
                            } catch (e) {
                                resolve(null);
                            }
                        } else resolve(null);
                    } else resolve(null);
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    async function fetchTeamStartingXIValue(teamId) {
        // Geçersiz ID'ler için işlemi baştan durdur
        if (!teamId) {
            return null;
        }

        const url = `https://www.managerzone.com/xml/team_playerlist.php?sport_id=1&team_id=${teamId}`;
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ method: "GET", url, onload: resolve, onerror: reject, timeout: 15000 });
            });

            const playersDoc = new DOMParser().parseFromString(response.responseText, 'text/xml');

            // XML'de bir hata olup olmadığını kontrol et
            const parserError = playersDoc.querySelector('parsererror');
            if (parserError) {
                console.error(`XML parse hatası (TID: ${teamId}):`, parserError.textContent);
                return null;
            }

            const teamPlayersNode = playersDoc.querySelector('TeamPlayers');
            if (!teamPlayersNode) {
                 console.warn(`'TeamPlayers' düğümü bulunamadı (TID: ${teamId}). Takım aktif olmayabilir.`);
                 return null;
            }

            // Takımın para birimini al
            const teamCurrency = (teamPlayersNode.getAttribute('teamCurrency') || 'USD').trim();

            // A takım oyuncularını filtrele, değerlerini al, sırala ve ilk 11'i seç
            const seniorPlayersValues = Array.from(playersDoc.querySelectorAll('Player'))
                .filter(p => p.getAttribute('junior') === '0')
                .map(p => parseInt(p.getAttribute('value')) || 0)
                .sort((a, b) => b - a)
                .slice(0, 11);

            // İlk 11 oyuncunun toplam değerini hesapla
            const totalValue = seniorPlayersValues.reduce((sum, val) => sum + val, 0);

            // Hesaplanan değeri Euro'ya çevir ve tam sayı olarak döndür
            return Math.round(convertToEUR(totalValue, teamCurrency));

        } catch (error) {
            console.error(`Top 11 değeri çekilirken hata (TID: ${teamId}):`, error);
            return null; // Hata durumunda null döndür
        }
    }

    async function fetchEnhancedMemberData(member) {
        try {
            const managerResponse = await fetch(`https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${member.username}`);
            const managerDoc = new DOMParser().parseFromString(await managerResponse.text(), 'text/xml');
            const teamData = managerDoc.querySelector('Team[sport="soccer"]');
            if (!teamData) return null;

            const userData = managerDoc.querySelector('UserData');
            const enhancedData = {
                ...member,
                teamName: teamData.getAttribute('teamName'),
                country: userData.getAttribute('countryShortname'),
                league: teamData.getAttribute('seriesName'),
                teamId: teamData.getAttribute('teamId'),
                seriesId: teamData.getAttribute('seriesId'),
                ranking: parseInt(teamData.getAttribute('rankPos')) || 0
            };

            const leagueResponse = await fetch(`https://www.managerzone.com/xml/team_league.php?sport_id=1&league_id=${enhancedData.seriesId}`);
            const leagueDoc = new DOMParser().parseFromString(await leagueResponse.text(), 'text/xml');
            const teamEntry = Array.from(leagueDoc.querySelectorAll('Team')).find(t => t.getAttribute('teamId') === enhancedData.teamId);
            enhancedData.leaguePosition = teamEntry ? parseInt(teamEntry.getAttribute('pos')) : null;

            const playersResponse = await fetch(`https://www.managerzone.com/xml/team_playerlist.php?sport_id=1&team_id=${enhancedData.teamId}`);
            const playersDoc = new DOMParser().parseFromString(await playersResponse.text(), 'text/xml');
            const teamCurrency = (playersDoc.querySelector('TeamPlayers')?.getAttribute('teamCurrency') || 'USD').trim();
            const seniorPlayers = Array.from(playersDoc.querySelectorAll('Player'))
                .filter(p => p.getAttribute('junior') === '0')
                .map(p => parseInt(p.getAttribute('value')) || 0)
                .sort((a, b) => b - a).slice(0, 11);
            enhancedData.startingXIValue = Math.round(convertToEUR(seniorPlayers.reduce((sum, val) => sum + val, 0), teamCurrency));

            const worldLeagueData = await fetchWorldLeagueData(enhancedData.teamId);
            enhancedData.worldLeague = worldLeagueData.worldLeague;
            enhancedData.worldLeaguePosition = worldLeagueData.worldLeaguePosition;

            return enhancedData;
        } catch (error) {
            return null;
        }
    }

    async function processMembersInBatches(members) {
        const batchSize = 10;
        const delay = 500;
        const results = [];
        for (let i = 0; i < members.length; i += batchSize) {
            const batch = members.slice(i, i + batchSize);
            const batchPromises = batch.map(member => fetchEnhancedMemberData(member));
            results.push(...(await Promise.all(batchPromises)).filter(Boolean));
            if (i + batchSize < members.length) await new Promise(resolve => setTimeout(resolve, delay));
        }
        return results;
    }

    async function fetchFederationMembers(federation) {
        const cache = getCachedData();
        if (cache[federation.fid]?.data) return cache[federation.fid].data;

        const response = await fetch(`https://www.managerzone.com/?p=federations&fid=${federation.fid}`);
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        const membersList = doc.getElementById('federation_clash_members_list');
        if (!membersList) return null;

        const members = Array.from(membersList.querySelectorAll('tbody tr:not([style])')).map(row => {
            const userLink = row.querySelector('a');
            return userLink ? { username: userLink.textContent, keyMember: !!row.querySelector('.fa-universal-access') } : null;
        }).filter(Boolean);

        const enhancedMembers = await processMembersInBatches(members);
        setCachedData(federation.fid, LEAGUE_STATE.currentRound, enhancedMembers);
        return enhancedMembers;
    }

    async function fetchFederationEloFromStatsXente(federationId) {
    if (!federationId) return { elo: 0, value: 0, valueLM: 0 }; // ID yoksa boş veri dön

    // statsxente.com'daki API'ye istek göndereceğiz.
    // Bu API, birden çok federasyonun verisini tek seferde dönebilir.
    const url = `https://statsxente.com/MZ1/Functions/tamper_federations.php?sport=soccer&id0=${federationId}`;

    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout: 15000, // 15 saniye zaman aşımı
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // Gelen veriden ilgili federasyonun bilgilerini al
                        const fedData = data[federationId];
                        if (fedData) {
                            resolve({
                                elo: Math.round(fedData.elo) || 0,
                                value: Math.round(fedData.value) || 0,
                                valueLM: Math.round(fedData.valueLM) || 0
                            });
                        } else {
                            resolve({ elo: 0, value: 0, valueLM: 0 }); // Federasyon verisi bulunamazsa
                        }
                    } catch (e) {
                        console.error("Federasyon ELO verisi parse edilemedi (FID: " + federationId + "):", e);
                        resolve({ elo: 0, value: 0, valueLM: 0 }); // JSON parse hatası
                    }
                } else {
                    resolve({ elo: 0, value: 0, valueLM: 0 }); // HTTP hatası
                }
            },
            onerror: function(error) {
                console.error("Federasyon ELO verisi çekilirken ağ hatası (FID: " + federationId + "):", error);
                resolve({ elo: 0, value: 0, valueLM: 0 });
            },
            ontimeout: function() {
                console.error("Federasyon ELO verisi çekilirken zaman aşımı (FID: " + federationId + ")");
                resolve({ elo: 0, value: 0, valueLM: 0 });
            }
        });
    });
}


    // ====================================================================================
    // BÖLÜM 6: ARAYÜZ OLUŞTURMA VE GÖRSELLEŞTİRME (MODAL, TABLO VB.)
    // ====================================================================================

    let isFetchingAllElos = false; // ELO çekme işleminin durumunu takip eder

async function fetchAllFederationElos() {
    if (isFetchingAllElos) return; // Zaten çalışıyorsa tekrar başlatma
    isFetchingAllElos = true;

    // Butonu devre dışı bırak ve metnini güncelle
    const fetchButton = document.getElementById('fetch-all-elos-btn');
    if (fetchButton) {
        fetchButton.disabled = true;
        fetchButton.textContent = 'ELO Puanları Çekiliyor...';
    }

    // Tabloyu yükleniyor durumuyla yeniden çiz
    renderFederationSummaryTable();

    // LEAGUE_STATE içindeki her federasyon için ELO çekme işlemini başlat
    const eloPromises = LEAGUE_STATE.federations.map(fed =>
        fetchFederationEloFromStatsXente(fed.fid)
    );

    // Tüm isteklerin tamamlanmasını bekle
    const eloResults = await Promise.all(eloPromises);

    // Gelen sonuçları ana federasyon verisine işle
    LEAGUE_STATE.federations.forEach((fed, index) => {
        fed.statsXenteElo = eloResults[index].elo;
    });

    console.log("Tüm federasyonların ELO puanları çekildi.");
    isFetchingAllElos = false; // İşlemi bitir

    // Butonu tekrar aktif et
    if (fetchButton) {
        fetchButton.disabled = false;
        fetchButton.textContent = 'Tüm ELO Puanlarını Çek';
    }

    // Tabloyu son ve güncel verilerle yeniden çiz
    renderFederationSummaryTable();
}
// ================= YENİ KOD BLOĞU BİTİŞİ =================

function renderFederationTable(federation) {
    const table = document.createElement('table');
    table.className = 'federation-table';

    // GÜNCELLENDİ: Sıralamadan önce tüm üyelere AGS'yi hesaplayıp ekleyelim
    const membersWithScore = calculateInternalPowerScores(federation.members);
    const sortedMembers = sortMembers(membersWithScore, currentSort.column, currentSort.direction);

    // Ortalama hesaplamaları (AGS eklendi)
    const startingXIValues = sortedMembers.map(member => member.startingXIValue || 0);
    const averageStartingXIValue = (startingXIValues.reduce((sum, value) => sum + value, 0) / startingXIValues.length).toFixed(0);
    const fedPuaniValues = sortedMembers.map(member => calculateFedPuani(member));
    const averageFedPuani = (fedPuaniValues.reduce((sum, value) => sum + value, 0) / fedPuaniValues.length).toFixed(2);
    const initialEloValues = sortedMembers.map(member => member.statsXenteElo || 0).filter(elo => elo > 0);
    const averageStatsXenteElo = initialEloValues.length > 0 ? (initialEloValues.reduce((sum, value) => sum + value, 0) / initialEloValues.length).toFixed(0) : '-';
    const agsValues = sortedMembers.map(member => member.internalPowerScore || 0);
    const averageAGS = (agsValues.reduce((sum, value) => sum + value, 0) / agsValues.length).toFixed(3);


    const getSortClass = (column) => {
        return currentSort.column !== column ? 'sortable' : `sortable sort-${currentSort.direction}`;
    };

    // GÜNCELLENDİ: Tablo başlığına AGS sütunu eklendi
    table.innerHTML = `
        <thead>
            <tr>
                <th style="width: 5px;">No</th>
                <th>Manager</th>
                <th>Team</th>
                <th>Country</th>
                <th class="${getSortClass('startingXIValue')}" data-sort="startingXIValue">StartingXIValue (EUR)</th>
                <th class="${getSortClass('league')}" data-sort="league">League</th>
                <th style="text-align:center">LP</th>
                <th>WL</th>
                <th style="text-align:center">WLP</th>
                <th class="${getSortClass('ranking')}" data-sort="ranking">Ranking</th>
                <th class="${getSortClass('statsXenteElo')}" data-sort="statsXenteElo" style="text-align:center;">SX ELO</th>
                <th class="${getSortClass('fedPuani')}" data-sort="fedPuani" style="text-align:right">FED PUANI</th>
                <th class="${getSortClass('internalPowerScore')}" data-sort="internalPowerScore" style="text-align:right; color: #4a9eff;">AGS</th>
            </tr>
        </thead>
        <tbody>
            ${sortedMembers.map((member, index) => {
                const breakdown = getFedPuaniBreakdown(member);
                const totalFedPuani = breakdown.total;
                let colorClass = '';
                if (totalFedPuani >= 140) colorClass = 'fed-puani-high';
                else if (totalFedPuani >= 100) colorClass = 'fed-puani-medium';
                else colorClass = 'fed-puani-low';
                const formattedFedPuani = totalFedPuani.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const agsValue = typeof member.internalPowerScore === 'number' ? member.internalPowerScore.toFixed(3) : '-';

                // GÜNCELLENDİ: Tablo satırına AGS hücresi eklendi
                return `
                    <tr class="${member.keyMember ? 'key-member' : ''}">
                        <td>${index + 1}</td>
                        <td><div class="member-info"><img src="https://flagcdn.com/16x12/${(member.country || '').toLowerCase()}.png" class="flag-img" width="16" height="12"><span>${member.username}</span></div></td>
                        <td><a href="https://www.managerzone.com/?p=team&tid=${member.teamId}" class="team-link" target="_blank">${member.teamName}</a></td>
                        <td>${member.country}</td>
                        <td style="font-family:monospace;">${(member.startingXIValue || 0).toLocaleString('en')}</td>
                        <td>${member.league}</td>
                        <td style="text-align:center">${member.leaguePosition ? `<span class="position-badge ${member.leaguePosition <= 3 ? 'position-top' : member.leaguePosition >= 14 ? 'position-bottom' : 'position-mid'}">${member.leaguePosition}</span>` : '-'}</td>
                        <td>${member.worldLeague}</td>
                        <td style="text-align:center">${member.worldLeague !== 'N/A' && member.worldLeaguePosition ? `<span class="position-badge ${member.worldLeaguePosition <= 3 ? 'position-top' : member.worldLeaguePosition >= 14 ? 'position-bottom' : 'position-mid'}">${member.worldLeaguePosition}</span>` : '-'}</td>
                        <td>${member.ranking?.toLocaleString() || '-'}</td>
                        <td style="font-family:monospace; text-align:center;" data-elocell-teamid="${member.teamId}">-</td>
                        <td class="fed-puani-cell">
                            <span class="fed-puani-total ${colorClass}">${formattedFedPuani}</span>
                            <button class="toggle-breakdown" style="background:transparent;border:none;cursor:pointer;">▼</button>
                            <div class="fed-puani-breakdown" style="display:none;margin-top:4px;font-size:0.9em;color:#aaa; position: absolute; background: #1a1a1a; padding: 8px; border: 1px solid #333; border-radius: 4px; z-index: 2;">
                                League Bonus: ${breakdown.leagueBonus} | LP Bonus: ${breakdown.leaguePositionBonus} | WL Bonus: ${breakdown.wlBonus} | WLP Bonus: ${breakdown.wlPositionBonus} | Ranking Bonus: ${breakdown.rankingBonus} | Value Bonus: ${breakdown.teamValueBonus}
                            </div>
                        </td>
                        <td style="font-family:monospace; font-weight:bold; text-align:right; color: #4a9eff;">${agsValue}</td>
                    </tr>
                `;
            }).join('')}
            <!-- GÜNCELLENDİ: Ortalama satırına AGS eklendi -->
            <tr>
                <td colspan="10" style="text-align: right; font-weight: bold;">Ortalama Değerler:</td>
                <td style="font-family:monospace; font-weight: bold; text-align:center;" data-average-elo-cell>${averageStatsXenteElo}</td>
                <td class="fed-puani-cell" style="font-weight: bold; justify-content: flex-end;"><span class="fed-puani-total" style="background: none !important; color: inherit !important;">${averageFedPuani}</span></td>
                <td style="font-family:monospace; font-weight:bold; text-align:right; color: #4a9eff;">${averageAGS}</td>
            </tr>
        </tbody>
    `;

    const fetchAndDisplayElosForFederation = async (federationMembers, tableElement) => {
        const eloCells = Array.from(tableElement.querySelectorAll('td[data-elocell-teamid]'));
        let elosFetched = false;

        for (const cell of eloCells) {
            const teamId = cell.dataset.elocellTeamid;
            if (!teamId) continue;
            const member = federation.members.find(m => m.teamId === teamId);

            if (member && (member.statsXenteElo === undefined || member.statsXenteElo === null)) {
                cell.innerHTML = '<div class="federation-spinner" style="width:12px;height:12px;margin:auto;"></div>';
                const elo = await fetchTeamEloFromStatsXente(member.teamId, member.teamName || '');
                member.statsXenteElo = elo; // Store it
                cell.textContent = elo && elo > 0 ? elo.toLocaleString('en') : '-';
                elosFetched = true;
            } else if (member) {
                cell.textContent = member.statsXenteElo && member.statsXenteElo > 0 ? member.statsXenteElo.toLocaleString('en') : '-';
            }
        }

        // Eğer ELO verileri yeni çekildiyse, tabloyu yeni AGS ile yeniden çiz
        if (elosFetched) {
            console.log("ELO verileri çekildi, tablo AGS ile yeniden çiziliyor.");
            const newTable = renderFederationTable(federation);
            table.replaceWith(newTable);
        }
    };

    if (federation && federation.members && table) {
        setTimeout(() => fetchAndDisplayElosForFederation(federation.members, table), 100);
    }

    table.querySelectorAll('.toggle-breakdown').forEach(btn => { /* Bu kısım aynı kalıyor */ });

    table.addEventListener('click', (e) => {
        const th = e.target.closest('th.sortable');
        if (!th) return;
        const column = th.getAttribute('data-sort');
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            // GÜNCELLENDİ: AGS'nin de büyükten küçüğe sıralanmasını sağla
            if (['fedPuani', 'startingXIValue', 'ranking', 'statsXenteElo', 'internalPowerScore'].includes(column)) {
                currentSort.direction = 'desc';
            } else {
                currentSort.direction = 'asc';
            }
        }
        const newTable = renderFederationTable(federation);
        table.replaceWith(newTable);
    });

    return table;
}
    function createFederationDisplay(federation) {
        const container = document.createElement('div');
        container.className = 'federation-display';
        const header = document.createElement('div');
        header.className = 'federation-header';
        header.innerHTML = `<h2>${federation.name}</h2>`;
        container.appendChild(header);
        const table = renderFederationTable(federation);
        container.appendChild(table);
        return container;
    }

    function createLoadingElements() {
        const container = document.createElement('div');
        container.className = 'federation-container';
        const select = document.createElement('select');
        select.id = 'federation-select';
        select.disabled = true;
        const option = document.createElement('option');
        option.textContent = 'Loading federation data...';
        select.appendChild(option);
        const spinner = document.createElement('div');
        spinner.className = 'federation-spinner';
        container.appendChild(select);
        container.appendChild(spinner);
        return container;
    }

    function createFederationSelect() {
        const container = document.createElement('div');
        container.className = 'federation-container';
        const select = document.createElement('select');
        select.id = 'federation-select';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Federasyon Seç';
        select.appendChild(defaultOption);
        LEAGUE_STATE.federations.forEach(fed => {
            const option = document.createElement('option');
            option.value = fed.fid;
            option.textContent = fed.name;
            select.appendChild(option);
        });
        select.addEventListener('change', async (event) => {
            const selectedFed = LEAGUE_STATE.federations.find(fed => fed.fid === event.target.value);
            if (selectedFed) {
                const modalContent = createModal();
                modalContent.querySelector('.modal-federation-select').value = selectedFed.fid;
                const display = createFederationDisplay(selectedFed);
                modalContent.appendChild(display);
            }
        });
        container.appendChild(select);
        return container;
    }

    function createModal() {
        if (modalOverlay) {
            modalOverlay.remove();
        }
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        const content = document.createElement('div');
        content.className = 'modal-content';
        const header = document.createElement('div');
        header.className = 'modal-header';
        const closeBtn = document.createElement('div');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '×';
        const select = document.createElement('select');
        select.className = 'modal-federation-select';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Federation';
        select.appendChild(defaultOption);
        LEAGUE_STATE.federations.forEach(fed => {
            const option = document.createElement('option');
            option.value = fed.fid;
            option.textContent = fed.name;
            select.appendChild(option);
        });
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export';
        exportBtn.style.background = '#4a9eff';
        exportBtn.style.color = '#fff';
        exportBtn.style.border = 'none';
        exportBtn.style.borderRadius = '4px';
        exportBtn.style.padding = '4px 8px';
        exportBtn.style.cursor = 'pointer';
        exportBtn.addEventListener('click', function (e) {
            const table = content.querySelector('table.federation-table');
            if (!table) return;
            const clone = table.cloneNode(true);
            clone.querySelectorAll('td.fed-puani-cell').forEach(cell => {
                const span = cell.querySelector('.fed-puani-total');
                if (span) cell.textContent = span.textContent;
            });
            let federationName = "";
            const h2 = content.querySelector('.federation-header h2');
            if (h2) federationName = h2.textContent.trim();
            if (!federationName) federationName = "federation";
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = federationName + "_" + timestamp + ".xlsx";

            const wb = XLSX.utils.table_to_book(clone, { sheet: "Sheet1" });
            const ws = wb.Sheets["Sheet1"];

            const headerRange = XLSX.utils.decode_range(ws['!ref']);
            for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: headerRange.s.r, c: C });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        font: { bold: true },
                        alignment: { horizontal: 'center' },
                        fill: { fgColor: { rgb: "4a9eff" } }
                    };
                }
            }

            ws['!cols'] = [
                { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
                { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }
            ];

            const fedPuaniColIndex = 9; // FED PUANI sütunu
            for (let R = headerRange.s.r + 1; R <= headerRange.e.r; ++R) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: fedPuaniColIndex });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        font: { bold: true, color: { rgb: "FFFFFF" } },
                        fill: { fgColor: { rgb: "4a9eff" } }
                    };
                }
            }

            XLSX.writeFile(wb, filename);
        });
        header.appendChild(select);
        header.appendChild(exportBtn);
        header.appendChild(closeBtn);
        content.appendChild(header);
        modalOverlay.appendChild(content);
        document.body.appendChild(modalOverlay);
        requestAnimationFrame(() => {
            modalOverlay.classList.add('visible');
            content.classList.add('visible');
        });
        const closeModal = () => {
            modalOverlay.classList.remove('visible');
            content.classList.remove('visible');
            setTimeout(() => {
                modalOverlay.remove();
                modalOverlay = null;
            }, 300);
        };
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeModal();
        };
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) closeModal();
        };
        select.addEventListener('change', async (event) => {
            const selectedFed = LEAGUE_STATE.federations.find(fed => fed.fid === event.target.value);
            if (selectedFed) {
                const display = createFederationDisplay(selectedFed);
                const oldDisplay = content.querySelector('.federation-display');
                if (oldDisplay) {
                    content.removeChild(oldDisplay);
                }
                content.appendChild(display);
            }
        });
        return content;
    }

    function createUpdateButton() {
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Tüm Verileri Güncelle';
        updateButton.style.marginLeft = '8px';
        updateButton.style.padding = '6px 12px';
        updateButton.style.background = '#4a9eff';
        updateButton.style.color = '#fff';
        updateButton.style.border = 'none';
        updateButton.style.borderRadius = '4px';
        updateButton.style.cursor = 'pointer';
        updateButton.style.transition = 'background 0.2s ease';
        updateButton.addEventListener('mouseover', () => {
            updateButton.style.background = '#60b0ff';
        });
        updateButton.addEventListener('mouseout', () => {
            updateButton.style.background = '#4a9eff';
        });
        updateButton.addEventListener('click', async () => {
            updateButton.disabled = true;
            updateButton.textContent = 'Güncelleniyor...';
            await clearCacheAndFetchData();
            updateButton.disabled = false;
            updateButton.textContent = 'Tüm Verileri Güncelle';
        });
        return updateButton;
    }

    async function clearCacheAndFetchData() {
        GM_setValue(CACHE_KEY, JSON.stringify({}));
        NProgress.start();
        try {
            for (const federation of LEAGUE_STATE.federations) {
                const members = await fetchFederationMembers(federation);
                if (members) {
                    federation.members = members;
                }
            }

            const header = document.querySelector('.federation-clash-league-header');
            const oldSelectContainer = header.querySelector('.federation-container');
            if (oldSelectContainer) {
                oldSelectContainer.replaceWith(createFederationSelect());
            }

            renderFederationSummaryTable();

        } catch (error) {
            console.error('Veri güncelleme sırasında hata oluştu:', error);
        }
        NProgress.done();
    }

    function createComparisonSection(federation) {
        const section = document.createElement('div');
        section.className = 'comparison-section';
        const header = document.createElement('h3');
        header.textContent = federation.name;
        section.appendChild(header);
        const table = renderFederationTable(federation);
        section.appendChild(table);
        return section;
    }

    function createMatchedComparisonTable(members1, members2, fed1Name, fed2Name) {
        const container = document.createElement('div');
        container.className = 'matched-comparison-container';

        const members1WithScore = calculateInternalPowerScores(members1);
        const members2WithScore = calculateInternalPowerScores(members2);
        const sortedMembers1 = members1WithScore.sort((a, b) => (b.internalPowerScore || 0) - (a.internalPowerScore || 0));
        const sortedMembers2 = members2WithScore.sort((a, b) => (b.internalPowerScore || 0) - (a.internalPowerScore || 0));

        let tableBodyHTML = '';
        const rowCount = Math.max(sortedMembers1.length, sortedMembers2.length);

        for (let i = 0; i < rowCount; i++) {
            const member1 = sortedMembers1[i];
            const member2 = sortedMembers2[i];

            if (!member1 || !member2) continue;

            const name1Original = member1.teamName;

            // --- DEĞİŞİKLİK BURADA: Ayraç rengi turuncu (#e67e22) yapıldı ve kalınlaştırıldı ---
            const name1Alt = `<span style='color: #f1c40f; font-weight:bold;'>${member1.username}</span> <span style='color: #e67e22; font-weight:bold; font-size: 1.1em;'> / </span> <span style='color: #5dade2;'>${member1.teamName}</span>`;

            const name2Original = member2.teamName;
            const name2Alt = `<span style='color: #f1c40f; font-weight:bold;'>${member2.username}</span> <span style='color: #e67e22; font-weight:bold; font-size: 1.1em;'> / </span> <span style='color: #5dade2;'>${member2.teamName}</span>`;
            // -----------------------------------------------------------------------------------

            const teamName1 = `<a href="/?p=team&tid=${member1.teamId}" class="team-link toggle-name-link" target="_blank" data-orig="${name1Original}" data-alt="${name1Alt}">${name1Original}</a>`;
            const teamName2 = `<a href="/?p=team&tid=${member2.teamId}" class="team-link toggle-name-link" target="_blank" data-orig="${name2Original}" data-alt="${name2Alt}">${name2Original}</a>`;

            tableBodyHTML += `
                <tr>
                    <td class="team-name-cell" style="text-align: right !important; padding-right: 15px;">${teamName1}</td>
                    <td class="vs-cell">${i + 1}</td>
                    <td class="team-name-cell-away" style="text-align: left !important; padding-left: 15px;">${teamName2}</td>
                </tr>
            `;
        }

        container.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; gap:15px; margin-bottom:20px;">
                <h3 style="margin:0;">AGS'ye Göre Eşleştirme</h3>
                <button id="toggle-names-btn" style="padding: 4px 8px; font-size: 0.85em; background: #e67e22; color: white; border: none; border-radius: 4px; cursor: pointer;">Kullanıcı Adı Göster</button>
            </div>
            <table class="matched-table">
                <thead>
                    <tr>
                        <th class="team-name-cell" style="text-align: right !important; padding-right: 15px;">${fed1Name}</th>
                        <th class="vs-cell">VS</th>
                        <th class="team-name-cell-away" style="text-align: left !important; padding-left: 15px;">${fed2Name}</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableBodyHTML}
                </tbody>
            </table>
        `;

        const toggleBtn = container.querySelector('#toggle-names-btn');
        let showUsernames = false;

        toggleBtn.addEventListener('click', () => {
            showUsernames = !showUsernames;
            toggleBtn.textContent = showUsernames ? "Sadece Takım Adı" : "Kullanıcı Adı Göster";
            toggleBtn.style.background = showUsernames ? "#d35400" : "#e67e22";

            const links = container.querySelectorAll('.toggle-name-link');
            links.forEach(link => {
                if (showUsernames) {
                    link.innerHTML = link.dataset.alt;
                } else {
                    link.textContent = link.dataset.orig;
                }
            });
        });

        return container;
    }

    function createComparisonModal(federation1, federation2) {
    if (modalOverlay) {
        modalOverlay.remove();
    }
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    const content = document.createElement('div');
    content.className = 'modal-content';
    const header = document.createElement('div');
    header.className = 'modal-header';
    const closeBtn = document.createElement('div');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '×';
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export';
    exportBtn.style.cssText = 'background:#4a9eff; color:#fff; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; margin-left: auto;';

    header.appendChild(exportBtn); // Export butonu başa geldi
    header.appendChild(closeBtn);
    content.appendChild(header);

    const comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'comparison-container';

    const section1 = createComparisonSection(federation1);
    const section2 = createComparisonSection(federation2);
    comparisonContainer.appendChild(section1);
    comparisonContainer.appendChild(section2);

    // Eşleştirme tablosu için YER TUTUCU oluştur
    const matchedTablePlaceholder = document.createElement('div');
    matchedTablePlaceholder.id = 'matched-table-placeholder';
    // YÜKLENİYOR BİLGİSİ EKLENDİ
    matchedTablePlaceholder.innerHTML = `
        <div class="matched-comparison-container" style="min-height: 200px;">
            <div style="text-align:center; padding: 40px 0;">
                <div class="federation-spinner" style="margin: 0 auto 15px auto;"></div>
                <p style="color: #ccc;">Tüm ELO skorları çekiliyor, eşleştirme tablosu hazırlanıyor...</p>
            </div>
        </div>
    `;
    comparisonContainer.appendChild(matchedTablePlaceholder);

    content.appendChild(comparisonContainer);
    modalOverlay.appendChild(content);
    document.body.appendChild(modalOverlay);

    requestAnimationFrame(() => {
        modalOverlay.classList.add('visible');
        content.classList.add('visible');
    });

    const waitForElosAndRenderMatchedTable = async () => {
        try {
            const ensureFullData = async (federation) => {
                if (!federation.members || federation.members.length === 0) {
                    const members = await fetchFederationMembers(federation);
                    if (!members || !Array.isArray(members) || members.length === 0) throw new Error(`${federation.name} üye listesi çekilemedi.`);
                    federation.members = members;
                }
                const allElosLoaded = () => federation.members.every(m => m.statsXenteElo !== undefined);
                while (!allElosLoaded()) {
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
            };

            await Promise.all([ensureFullData(federation1), ensureFullData(federation2)]);

            const matchedTable = createMatchedComparisonTable(federation1.members, federation2.members, federation1.name, federation2.name);
            matchedTablePlaceholder.replaceWith(matchedTable);

            setTimeout(() => { content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' }); }, 100);

        } catch (error) {
            console.error("Eşleştirme verileri çekilirken hata:", error);
            matchedTablePlaceholder.innerHTML = `<div class="matched-comparison-container"><h3>Hata</h3><p style="text-align:center; color: #e74c3c;">${error.message}</p></div>`;
        }
    };

    waitForElosAndRenderMatchedTable();

    // DÜZELTİLMİŞ EXPORT BUTONU MANTIĞI
    exportBtn.addEventListener('click', function () {
        const wb = XLSX.utils.book_new();

        // 1. Federasyon Tablosu
        const table1 = section1.querySelector('table.federation-table');
        if (table1) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(table1), federation1.name.substring(0, 30));
        }

        // 2. Federasyon Tablosu
        const table2 = section2.querySelector('table.federation-table');
        if (table2) {
            XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(table2), federation2.name.substring(0, 30));
        }

        // Eşleştirme Tablosu
        const matchedTableElement = comparisonContainer.querySelector('table.matched-table');
        if (matchedTableElement) {
             XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(matchedTableElement), "Eşleştirme");
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        XLSX.writeFile(wb, `Karsilastirma_${timestamp}.xlsx`);
    });

    const closeModal = () => {
        modalOverlay.classList.remove('visible');
        content.classList.remove('visible');
        setTimeout(() => { modalOverlay.remove(); modalOverlay = null; }, 300);
    };
    closeBtn.onclick = (e) => { e.stopPropagation(); closeModal(); };
    modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };
}

    function createCompareButton() {
    const compareButton = document.createElement('button');
    compareButton.textContent = 'Karşılaştır';
    compareButton.style.marginLeft = '8px';
    compareButton.style.padding = '6px 12px';
    compareButton.style.background = '#2980b9';
    compareButton.style.color = '#fff';
    compareButton.style.border = 'none';
    compareButton.style.borderRadius = '4px';
    compareButton.style.cursor = 'pointer';
    compareButton.style.transition = 'background 0.2s ease';
    compareButton.addEventListener('mouseover', () => { compareButton.style.background = '#3498db'; });
    compareButton.addEventListener('mouseout', () => { compareButton.style.background = '#2980b9'; });

    compareButton.addEventListener('click', () => {
        const compareModal = document.createElement('div');
        compareModal.className = 'modal-overlay';
        const compareContent = document.createElement('div');
        compareContent.className = 'modal-content';
        compareContent.style.maxWidth = '500px';

        const compareHeader = document.createElement('div');
        compareHeader.className = 'modal-header';
        const headerTitle = document.createElement('h3');
        headerTitle.textContent = 'Federasyonları Karşılaştır';
        headerTitle.style.color = '#fff';
        headerTitle.style.margin = '0';
        compareHeader.appendChild(headerTitle);

        const compareCloseBtn = document.createElement('div');
        compareCloseBtn.className = 'modal-close';
        compareCloseBtn.innerHTML = '×';
        compareHeader.appendChild(compareCloseBtn);
        compareContent.appendChild(compareHeader);

        const compareBody = document.createElement('div');
        compareBody.style.padding = '24px';
        compareBody.style.display = 'flex';
        compareBody.style.flexDirection = 'column';
        compareBody.style.gap = '15px';

        const fedSelect1 = document.createElement('select');
        fedSelect1.className = 'modal-federation-select';
        fedSelect1.innerHTML = `<option value="">1. Federasyonu Seçin</option>` + LEAGUE_STATE.federations.map(f => `<option value="${f.fid}">${f.name}</option>`).join('');

        const fedSelect2 = document.createElement('select');
        fedSelect2.className = 'modal-federation-select';
        fedSelect2.innerHTML = `<option value="">2. Federasyonu Seçin</option>` + LEAGUE_STATE.federations.map(f => `<option value="${f.fid}">${f.name}</option>`).join('');

        compareBody.appendChild(fedSelect1);
        compareBody.appendChild(fedSelect2);

        const compareSubmitBtn = document.createElement('button');
        compareSubmitBtn.textContent = 'Karşılaştır';
        compareSubmitBtn.style.padding = '10px 15px';
        compareSubmitBtn.style.background = '#4a9eff';
        compareSubmitBtn.style.color = '#fff';
        compareSubmitBtn.style.border = 'none';
        compareSubmitBtn.style.borderRadius = '4px';
        compareSubmitBtn.style.cursor = 'pointer';

        compareSubmitBtn.addEventListener('click', () => {
            const fid1 = fedSelect1.value;
            const fid2 = fedSelect2.value;

            if (!fid1 || !fid2 || fid1 === fid2) {
                alert('Lütfen iki FARKLI federasyon seçin.');
                return;
            }

            const fed1 = LEAGUE_STATE.federations.find(f => f.fid === fid1);
            const fed2 = LEAGUE_STATE.federations.find(f => f.fid === fid2);

            // Veri çekmeyi beklemeden modal'ı HEMEN aç
            createComparisonModal(fed1, fed2);
            closeCompareModal();
        });

        compareBody.appendChild(compareSubmitBtn);
        compareContent.appendChild(compareBody);
        compareModal.appendChild(compareContent);
        document.body.appendChild(compareModal);

        requestAnimationFrame(() => {
            compareModal.classList.add('visible');
            compareContent.classList.add('visible');
        });

        const closeCompareModal = () => {
            compareModal.classList.remove('visible');
            compareContent.classList.remove('visible');
            setTimeout(() => { compareModal.remove(); }, 300);
        };

        compareCloseBtn.onclick = (e) => { e.stopPropagation(); closeCompareModal(); };
        compareModal.onclick = (e) => { if (e.target === compareModal) closeCompareModal(); };
    });

    return compareButton;
}

    function createLiveUpdateButton() {
        const updateStandingsButton = document.createElement('button');
        updateStandingsButton.id = 'liveUpdateStandingsButton';
        updateStandingsButton.textContent = 'Canlı Maçlardan Puan Durumunu Güncelle';
        updateStandingsButton.title = 'Sayfada bulunan canlı/biten federasyon çatışması maç sonuçlarını kullanarak ana lig puan tablosunu günceller. Bu buton sayfa başına sadece bir kez çalışır.';
        updateStandingsButton.style.cssText = 'margin-left: 8px; padding: 6px 12px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer;';

        let liveUpdateAlreadyClicked = false;
        updateStandingsButton.addEventListener('click', () => {
            if (liveUpdateAlreadyClicked) return;
            activeFederationMatchResults = [];
            const matchTable = document.querySelector('div.mainContent table.hitlist.marker');
            if (!matchTable) return alert("Sayfada canlı maç sonuçları tablosu bulunamadı.");

            Array.from(matchTable.querySelectorAll('tbody tr')).forEach(row => {
                const cells = row.cells;
                if (cells.length < 3) return;
                const fed1Link = cells[0].querySelector('a.fed_link');
                const scoreLink = cells[1].querySelector('a');
                const fed2Link = cells[2].querySelector('a.fed_link');
                if (!fed1Link || !scoreLink || !fed2Link) return;

                const fid1 = fed1Link.href.match(/fid=(\d+)/)?.[1];
                const fid2 = fed2Link.href.match(/fid=(\d+)/)?.[1];
                const scores = scoreLink.textContent.trim().split(/\s*-\s*/).map(s => parseInt(s.trim(), 10));

                if (fid1 && fid2 && scores.length === 2 && !isNaN(scores[0])) {
                    activeFederationMatchResults.push({ fid1, score1: scores[0], fid2, score2: scores[1] });
                }
            });

            if (activeFederationMatchResults.length > 0) {
                updateFederationStandingsFromResults();
                liveUpdateAlreadyClicked = true;
                updateStandingsButton.disabled = true;
                updateStandingsButton.textContent = 'Puan Durumu Güncellendi';
                updateStandingsButton.style.background = '#6c757d';
            }
        });
        return updateStandingsButton;
    }

    async function fetchAllElosInBackground() {
        if (isFetchingAllElos) {
            console.log("Zaten bir ELO çekme işlemi devam ediyor.");
            return;
        }
        isFetchingAllElos = true;

        const fetchButton = document.getElementById('fetch-all-elos-btn');
        if (fetchButton) {
            fetchButton.disabled = true;
            fetchButton.textContent = 'ELO Puanları Çekiliyor...';
        }
        renderFederationSummaryTable();

        for (const fed of LEAGUE_STATE.federations) {
            if (!fed.members || fed.members.length === 0) continue;

            const eloPromises = fed.members.map(member => {
                if (member.statsXenteElo === undefined || member.statsXenteElo === null) {
                    return fetchTeamEloFromStatsXente(member.teamId, member.teamName || '');
                }
                return Promise.resolve(member.statsXenteElo);
            });

            const eloResults = await Promise.all(eloPromises);

            fed.members.forEach((member, index) => {
                member.statsXenteElo = eloResults[index];
            });

            renderFederationSummaryTable();
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log("Tüm ELO çekme işlemi tamamlandı.");
        isFetchingAllElos = false;
        if (fetchButton) {
            fetchButton.disabled = false;
            fetchButton.textContent = 'Tüm ELO Puanlarını Çek';
        }
        renderFederationSummaryTable();
    }

    function renderFederationSummaryTable() {
    let container = document.getElementById(SUMMARY_TABLE_CONTAINER_ID);

    // ---- YENİ VE DOĞRU MANTIK ----
    if (!container) {
        // Eğer container (tablo kutusu) henüz sayfada yoksa, onu oluştur.
        container = document.createElement('div');
        container.id = SUMMARY_TABLE_CONTAINER_ID;

        // İLK KEZ OLUŞTURULDUĞU İÇİN 'collapsed' SINIFINI BURADA EKLE!
        // Bu, tablonun her zaman kapalı başlamasını garantiler.
        container.classList.add('collapsed');

        const mainTable = document.querySelector(FEDERATION_STANDINGS_TABLE_SELECTOR);
        if (mainTable && mainTable.parentNode) {
            mainTable.parentNode.insertBefore(container, mainTable.nextSibling);
        } else {
            return; // Ana tablo bulunamazsa devam etme
        }
    }
    // ---- YENİ VE DOĞRU MANTIK BİTTİ ----

    // Buradan sonraki kod, tablonun içeriğini oluşturur.
    // Durum hatırlama mantığını tamamen kaldırdık.

    const summaryData = LEAGUE_STATE.federations.map(fed => {
        const avgElo = fed.statsXenteElo || 0;
        if (!fed.members || fed.members.length === 0) {
            return { fid: fed.fid, name: fed.name, avgValue: 0, avgElo: avgElo, avgFedPuani: 0, dataAvailable: false };
        }
        const validMembersWithValue = fed.members.filter(m => m.startingXIValue);
        const avgValue = validMembersWithValue.length > 0 ? validMembersWithValue.reduce((sum, m) => sum + m.startingXIValue, 0) / validMembersWithValue.length : 0;
        const avgFedPuani = fed.members.reduce((sum, m) => sum + calculateFedPuani(m), 0) / fed.members.length;

        return { fid: fed.fid, name: fed.name, avgValue, avgElo, avgFedPuani, dataAvailable: true };
    });

    summaryData.sort((a, b) => {
        const valA = a[summaryTableSort.column];
        const valB = b[summaryTableSort.column];
        const direction = summaryTableSort.direction === 'asc' ? 1 : -1;
        if (typeof valA === 'string') {
             return valA.localeCompare(valB) * direction;
        }
        return (valA - valB) * direction;
    });

    const getSortClass = (column) => `sortable ${summaryTableSort.column === column ? `sort-${summaryTableSort.direction}` : ''}`;

    container.innerHTML = `
        <div class="summary-header">
            <h3>Federasyon Güç Özeti</h3>
            <button id="fetch-all-elos-btn">Tüm ELO Puanlarını Çek</button>
        </div>
        <table class="summary-table">
            <thead>
                <tr>
                    <th class="rank-cell">#</th>
                    <th>Federasyon</th>

                    <!-- Değişiklik: text-align:center yapıldı (Ortalandı) -->
                    <th class="${getSortClass('avgValue')}" data-sort="avgValue" style="text-align:center; line-height: 1.2;">Ort. Takım Değeri<br><span style="font-size:0.9em; opacity:0.8;">(EUR)</span></th>

                    <!-- Değişiklik: Simetri bozulmasın diye bu da ortalandı -->
                    <th class="${getSortClass('avgElo')}" data-sort="avgElo" style="text-align:center;">SX ELO</th>

                    <!-- Değişiklik: text-align:center yapıldı (Ortalandı) -->
                    <th class="${getSortClass('avgFedPuani')}" data-sort="avgFedPuani" style="text-align:center; line-height: 1.2;">Ort.<br>FED PUANI</th>
                </tr>
            </thead>
            <tbody>
                ${summaryData.map((data, index) => {
                    // Fenerbahçe Vurgulama Mantığı
                    const isFb = data.fid === FENERBAHCE_FID; // FID: 114 kontrolü
                    // Fenerbahçe ise: Arka planı hafif sarı yap, sola sarı çizgi çek ve yazıyı kalınlaştır
                    const rowStyle = isFb ? 'background-color: rgba(255, 215, 0, 0.15) !important; font-weight: bold; border-left: 3px solid #ffd700;' : '';
                    // Fenerbahçe ise: Takım ismini 'Sarı' (#ffd700) yap
                    const nameStyle = isFb ? 'color: #ffd700;' : '';

                    return `
                    <tr data-fid="${data.fid}" style="${rowStyle}">
                        <td class="rank-cell">${index + 1}</td>
                        <td style="${nameStyle}">${data.name}</td>
                        <td class="value-cell" style="text-align:center;">${data.dataAvailable ? Math.round(data.avgValue).toLocaleString('en') : '<i>Veri bekleniyor...</i>'}</td>
                        <td class="value-cell" data-elo-cell="true" style="text-align:center;">
                            ${isFetchingAllElos && data.avgElo === 0 ? '<div class="federation-spinner"></div>' : (data.avgElo > 0 ? data.avgElo.toLocaleString('en') : '<i>-</i>')}
                        </td>
                        <td class="value-cell puani-cell" style="text-align:center;">${data.dataAvailable ? data.avgFedPuani.toFixed(2) : '<i>-</i>'}</td>
                    </tr>
                `;
                }).join('')}
            </tbody>
        </table>
    `;

    // Olay dinleyicilerini (event listener) yeniden ekle
    const summaryHeader = container.querySelector('.summary-header');
    if (summaryHeader) {
        summaryHeader.addEventListener('click', () => {
            container.classList.toggle('collapsed');
        });
    }

    const fetchButton = document.getElementById('fetch-all-elos-btn');
    if (fetchButton) {
        fetchButton.addEventListener('click', (e) => {
            e.stopPropagation();
            fetchAllFederationElos();
        });
        if (isFetchingAllElos) {
            fetchButton.disabled = true;
            fetchButton.textContent = 'ELO Puanları Çekiliyor...';
        }
    }

    container.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', (e) => {
            e.stopPropagation();
            const column = th.dataset.sort;
            if (summaryTableSort.column === column) {
                summaryTableSort.direction = summaryTableSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                summaryTableSort.column = column;
                summaryTableSort.direction = 'desc';
            }
            renderFederationSummaryTable();
        });
    });
}


    // ====================================================================================
    // BÖLÜM 7: FENERBAHÇE GEÇMİŞ SEZON ANALİZİ FONKSİYONLARI
    // ====================================================================================

    function getFbAnalysisCacheKey(season, subSeason, level, divId) {
    return `${FB_ANALYSIS_CACHE_PREFIX}${season}_${subSeason}_${level}_${divId}`;
}

function getCachedSeasonData(season, subSeason, level, divId) {
    const cacheKey = getFbAnalysisCacheKey(season, subSeason, level, divId);
    const cachedData = GM_getValue(cacheKey, null);
    if (cachedData) {
        try {
            return JSON.parse(cachedData);
        } catch (e) {
            console.error("Önbellek verisi parse edilemedi:", e);
            GM_deleteValue(cacheKey);
            return null;
        }
    }
    return null;
}

function setCachedSeasonData(season, subSeason, level, divId, dataToCache, isCompleted) {
    const cacheKey = getFbAnalysisCacheKey(season, subSeason, level, divId);
    const cacheEntry = { data: dataToCache, timestamp: Date.now(), completed: !!isCompleted };
    GM_setValue(cacheKey, JSON.stringify(cacheEntry));
}

function clearFbAnalysisCache() {
    let clearedCount = 0;
    GM_listValues().forEach(key => {
        if (key.startsWith(FB_ANALYSIS_CACHE_PREFIX) || key.startsWith('fb_league_perf_cache_')) {
            GM_deleteValue(key);
            clearedCount++;
        }
    });
    console.log(`${clearedCount} Fenerbahçe analiz önbellek kaydı temizlendi.`);
    if (fenerbahceAnalysisModalOverlay) {
        const content = fenerbahceAnalysisModalOverlay.querySelector('.modal-content');
        if (content) {
            fenerbahceAnalysisModalOverlay.classList.remove('visible');
            content.classList.remove('visible');
            setTimeout(() => {
                if (fenerbahceAnalysisModalOverlay) fenerbahceAnalysisModalOverlay.remove();
                fenerbahceAnalysisModalOverlay = null;
                const fbAnalysisBtn = document.getElementById('fenerbahce-season-analysis-btn');
                if (fbAnalysisBtn && !fbAnalysisBtn.disabled) {
                    fbAnalysisBtn.click();
                } else {
                    startFenerbahceSeasonAnalysis();
                }
            }, 350);
        } else {
            if (fenerbahceAnalysisModalOverlay) fenerbahceAnalysisModalOverlay.remove();
            fenerbahceAnalysisModalOverlay = null;
            startFenerbahceSeasonAnalysis();
        }
    } else {
        console.log("Önbellek temizlendi. Bir sonraki analiz tüm verileri yeniden çekecektir.");
    }
}

    function createFenerbahceAnalysisButton() {
        const button = document.createElement('button');
        button.textContent = 'FB Geçmiş Analizi';
        button.id = 'fenerbahce-season-analysis-btn';
        button.style.cssText = 'margin-left: 8px; padding: 6px 12px; background: #f0ad4e; color: #fff; border: none; border-radius: 4px; cursor: pointer; transition: background 0.2s ease;';
        button.onmouseover = () => { button.style.background = '#ec971f'; };
        button.onmouseout = () => { button.style.background = '#f0ad4e'; };
        button.addEventListener('click', async () => {
            button.disabled = true;
            button.textContent = 'Analiz Başlatılıyor...';
            if (fenerbahceAnalysisModalOverlay) fenerbahceAnalysisModalOverlay.remove();
            if (fenerbahceLeaguePerfModalOverlay) fenerbahceLeaguePerfModalOverlay.remove();
            await startFenerbahceSeasonAnalysis();
            button.disabled = false;
            button.textContent = 'FB Geçmiş Analizi';
        });
        return button;
    }

    function createFenerbahceAnalysisModal(titleText = 'Analiz Sonuçları') {
        if (fenerbahceAnalysisModalOverlay) fenerbahceAnalysisModalOverlay.remove();
        if (fenerbahceLeaguePerfModalOverlay) fenerbahceLeaguePerfModalOverlay.remove();

        fenerbahceAnalysisModalOverlay = document.createElement('div');
        fenerbahceAnalysisModalOverlay.className = 'modal-overlay';
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.id = 'fenerbahce-analysis-modal-content';

        const header = document.createElement('div');
        header.className = 'modal-header';
        const title = document.createElement('h2');
        title.innerHTML = `<span>${titleText}</span>`;

        const leagueAnalysisBtn = createFenerbahceLeagueAnalysisButton();
        title.appendChild(leagueAnalysisBtn);
        header.appendChild(title);

        const exportAnalysisBtn = document.createElement('button');
        exportAnalysisBtn.textContent = "Excel'e Aktar";
        exportAnalysisBtn.style.cssText = 'margin-left: auto; margin-right: 10px; padding: 6px 12px; font-size: 0.9em; background: #5cb85c; color: white; border: none; border-radius: 4px; cursor: pointer;';
        exportAnalysisBtn.addEventListener('click', exportFenerbahceAnalysisToExcel);
        header.appendChild(exportAnalysisBtn);

        const clearCacheBtn = document.createElement('button');
        clearCacheBtn.textContent = 'Önbelleği Temizle';
        clearCacheBtn.title = 'Fenerbahçe geçmiş analizine ait tüm önbellek verilerini siler ve tam bir yeniden tarama başlatır.';
        clearCacheBtn.style.cssText = 'margin-left: 10px; padding: 6px 12px; font-size: 0.9em; background: #d9534f; color: white; border: none; border-radius: 4px; cursor: pointer;';
        clearCacheBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Diğer tıklama olaylarını engelle
            if (confirm("Fenerbahçe analiz önbelleğini temizlemek istediğinizden emin misiniz? Bu işlem, tüm geçmiş sezon verilerinin yeniden taranmasına neden olur.")) {
                clearFbAnalysisCache();
            }
        });
        header.appendChild(clearCacheBtn);

        const closeBtn = document.createElement('div');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '×';
        header.appendChild(closeBtn);
        content.appendChild(header);

        const body = document.createElement('div');
        body.className = 'federation-display';
        body.id = 'fenerbahce-analysis-modal-body';
        body.style.paddingTop = '10px';
        body.innerHTML = `<p style="color:#fff; text-align:center; padding:20px;">Veriler yükleniyor, lütfen bekleyin...</p><div id="analysis-progress" style="width: 80%; margin: 10px auto; background-color: #555; border-radius: 5px; text-align: center; color: white;"><div id="analysis-progress-bar" style="width: 0%; background-color: #4a9eff; height: 20px; border-radius: 5px; line-height: 20px;">0%</div></div>`;
        content.appendChild(body);

        fenerbahceAnalysisModalOverlay.appendChild(content);
        document.body.appendChild(fenerbahceAnalysisModalOverlay);

        requestAnimationFrame(() => {
            fenerbahceAnalysisModalOverlay.classList.add('visible');
            content.classList.add('visible');
        });

        const closeModal = () => {
            if (!fenerbahceAnalysisModalOverlay) return;
            fenerbahceAnalysisModalOverlay.classList.remove('visible');
            content.classList.remove('visible');
            setTimeout(() => {
                if (fenerbahceAnalysisModalOverlay) fenerbahceAnalysisModalOverlay.remove();
                fenerbahceAnalysisModalOverlay = null;
            }, 300);
        };

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeModal();
        };
        fenerbahceAnalysisModalOverlay.onclick = (e) => {
            if (e.target === fenerbahceAnalysisModalOverlay) closeModal();
        };

        return body;
    }

    async function startFenerbahceSeasonAnalysis() {
        // ======================== YENİ EKLENEN BLOK: CANLI MAÇ BİLGİSİNİ OKUMA ========================
        // Analiz başlamadan önce, ana sayfadaki "Maç Oynanıyor" tablosunu okuyup
        // global 'activeFederationMatchResults' dizisini dolduruyoruz.
        // Bu sayede yeşil canlı maç ikonu (🟢) anında doğru rakibin yanında belirir.
        activeFederationMatchResults = []; // Her seferinde listeyi temizle
        const liveMatchTable = document.querySelector('div.mainContent table.hitlist.marker');

        if (liveMatchTable) {
            Array.from(liveMatchTable.querySelectorAll('tbody tr')).forEach(row => {
                const cells = row.cells;
                if (cells.length < 3) return;
                const fed1Link = cells[0].querySelector('a.fed_link');
                const scoreLink = cells[1].querySelector('a');
                const fed2Link = cells[2].querySelector('a.fed_link');
                if (!fed1Link || !scoreLink || !fed2Link) return;

                const fid1 = fed1Link.href.match(/fid=(\d+)/)?.[1];
                const fid2 = fed2Link.href.match(/fid=(\d+)/)?.[1];
                const scores = scoreLink.textContent.trim().split(/\s*-\s*/).map(s => parseInt(s.trim(), 10));

                if (fid1 && fid2 && scores.length === 2 && !isNaN(scores[0])) {
                    activeFederationMatchResults.push({ fid1, score1: scores[0], fid2, score2: scores[1] });
                }
            });
        }
        // =================================== YENİ BLOK BİTİŞİ ===================================


        // Önceki çözümden gelen ligdeki rakipleri belirleme kodu (bu da kalmalı)
        const mainStandingsTable = document.querySelector(FEDERATION_STANDINGS_TABLE_SELECTOR);
        if (mainStandingsTable) {
            currentSeasonOpponentFids.clear();
            const rows = mainStandingsTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const fedLink = row.querySelector('a.fed_link');
                if (fedLink) {
                    const fid = fedLink.href.match(/fid=(\d+)/)?.[1];
                    if (fid && fid !== FENERBAHCE_FID) {
                        currentSeasonOpponentFids.add(fid);
                    }
                }
            });
        }


        const modalBody = createFenerbahceAnalysisModal(`${FENERBAHCE_NAME_FOR_ANALYSIS} Geçmiş Sezon Analizi`);
        if (!modalBody) return;

        fenerbahceOverallStandings = {};

        const progressBar = document.getElementById('analysis-progress-bar');
        const progressTextElement = document.querySelector('#fenerbahce-analysis-modal-body > p');
        NProgress.start();
        let totalSeasonsToProcess = FENERBAHCE_SEASON_LEAGUES.length;
        let seasonsProcessedCount = 0;

        for (const leagueInfo of FENERBAHCE_SEASON_LEAGUES) {
            const { season, subSeason, level, division, leagueName } = leagueInfo;
            seasonsProcessedCount++;

            const progressMessage = `Federasyon Maçları Taranıyor: Sezon ${season}.${subSeason} (${leagueName}) işleniyor... (${seasonsProcessedCount}/${totalSeasonsToProcess})`;
            if (progressTextElement) {
                progressTextElement.innerHTML = `<p style="color:#fff; text-align:center; padding:10px;">${progressMessage}</p>`;
            }

            const cachedSeason = getCachedSeasonData(season, subSeason, level, division);
            const currentMzSeason = (typeof mz !== 'undefined' && mz && typeof mz.season === 'number') ? mz.season : 0;
            const currentMzSubSeason = (typeof mz !== 'undefined' && mz && typeof mz.subSeason === 'number') ? mz.subSeason : 2;
            let isPastSeason = false;
            if (currentMzSeason > 0) {
                isPastSeason = parseInt(season) < currentMzSeason || (parseInt(season) === currentMzSeason && parseInt(subSeason) < currentMzSubSeason);
            } else {
                console.warn("ManagerZone güncel sezon bilgisi (mz.season) alınamadı.");
            }

            let seasonMatchData = [];

            if (cachedSeason && cachedSeason.completed && isPastSeason) {
                seasonMatchData = cachedSeason.data || [];
            } else {
                try {
                    const { processedMatches, allRoundsProcessed } = await fetchSeasonScheduleAndProcess(season, subSeason, level, division, leagueName);
                    seasonMatchData = processedMatches;
                    if (isPastSeason && allRoundsProcessed && seasonMatchData && seasonMatchData.length > 0) {
                        setCachedSeasonData(season, subSeason, level, division, seasonMatchData, true);
                    }
                } catch (error) {
                    console.error(`Sezon ${season}.${subSeason} işlenirken hata:`, error);
                }
                if (seasonsProcessedCount < totalSeasonsToProcess) {
                    await new Promise(resolve => setTimeout(resolve, 600));
                }
            }

            if (seasonMatchData && Array.isArray(seasonMatchData)) {
                seasonMatchData.forEach(matchData => {
                    if (matchData && typeof matchData === 'object' && matchData.opponentFid) {
                        const opponentFid = matchData.opponentFid;
                        if (!fenerbahceOverallStandings[opponentFid]) {
                            fenerbahceOverallStandings[opponentFid] = { name: matchData.opponentName || 'Bilinmeyen Rakip', G: 0, B: 0, M: 0, P: 0, AG: 0, YG: 0, AV: 0, played: 0, matches: [] };
                        }
                        const stats = fenerbahceOverallStandings[opponentFid];
                        stats.played++;
                        stats.AG += (matchData.targetScore || 0);
                        stats.YG += (matchData.opponentScore || 0);
                        stats.AV = stats.AG - stats.YG;
                        if (matchData.result === 'G') { stats.G++; stats.P += 3; }
                        else if (matchData.result === 'M') { stats.M++; }
                        else if (matchData.result === 'B') { stats.B++; stats.P += 1; }
                        stats.matches.push(matchData);
                    }
                });
            }

            const percentComplete = Math.round((seasonsProcessedCount / totalSeasonsToProcess) * 100);
            if (progressBar) {
                progressBar.style.width = `${percentComplete}%`;
                progressBar.textContent = `${percentComplete}%`;
            }
        }

        NProgress.done();
        renderFenerbahceAnalysisTable(fenerbahceOverallStandings, modalBody);
    }

    async function fetchSeasonScheduleAndProcess(season, subSeason, level, divId, leagueName) {
        const url = `/ajax.php?p=federations&sub=schedule&sport=soccer&season=${season}&sub_season=${subSeason}&level=${level}&div=${divId}`;
        let processedFbMatches = [];
        let allRoundsProcessedCleanly = true;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                allRoundsProcessedCleanly = false;
                return { processedMatches: [], allRoundsProcessed: false };
            }

            const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
            const roundHeaders = doc.querySelectorAll('h2.subheader');
            const roundTables = doc.querySelectorAll('div.mainContent table.hitlist.marker');

            if (roundTables.length === 0) {
                allRoundsProcessedCleanly = false;
            }

            roundTables.forEach((table, tableIndex) => {
                const roundHeaderText = roundHeaders[tableIndex] ? roundHeaders[tableIndex].textContent.trim() : `Tur ${tableIndex + 1}`;
                table.querySelectorAll('tbody tr').forEach(row => {
                    const fbMatchData = processSingleMatchRowForFenerbahce(row, FENERBAHCE_FID, FENERBAHCE_NAME_FOR_ANALYSIS, roundHeaderText, true, season, subSeason, leagueName);
                    if (fbMatchData) {
                        processedFbMatches.push(fbMatchData);
                    } else {
                        const scoreCell = row.cells[1]?.querySelector('a');
                        if (scoreCell && scoreCell.textContent.trim().toLowerCase() === 'x - x') {
                            allRoundsProcessedCleanly = false;
                        }
                    }
                });
            });

            return { processedMatches: processedFbMatches, allRoundsProcessed: allRoundsProcessedCleanly && roundTables.length > 0 };
        } catch (error) {
            console.error(`Veri çekme hatası (${url}):`, error);
            return { processedMatches: [], allRoundsProcessed: false };
        }
    }

    function processSingleMatchRowForFenerbahce(row, targetFid, targetName, roundInfo, returnMatchData = false, season, subSeason, leagueName) {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return returnMatchData ? null : undefined;

        const fed1Anchor = cells[0].querySelector('a.fed_link');
        const scoreAnchor = cells[1].querySelector('a');
        const fed2Anchor = cells[2].querySelector('a.fed_link');
        if (!fed1Anchor || !scoreAnchor || !fed2Anchor) return returnMatchData ? null : undefined;

        const scoreText = scoreAnchor.textContent.trim();
        if (scoreText.toLowerCase() === 'x - x') return returnMatchData ? null : undefined;

        const scores = scoreText.split(/\s*-\s*/).map(s => parseInt(s.trim(), 10));
        if (scores.length !== 2 || isNaN(scores[0]) || isNaN(scores[1])) return returnMatchData ? null : undefined;

        const fid1Match = fed1Anchor.href.match(/fid=(\d+)/);
        const fid2Match = fed2Anchor.href.match(/fid=(\d+)/);
        if (!fid1Match || !fid2Match) return returnMatchData ? null : undefined;

        const fid1 = fid1Match[1];
        const name1 = fed1Anchor.title || fed1Anchor.textContent.trim();
        const score1 = scores[0];
        const fid2 = fid2Match[1];
        const name2 = fed2Anchor.title || fed2Anchor.textContent.trim();
        const score2 = scores[1];

        let opponentFid = null, opponentName = null, fbScore, oppScore;
        if (fid1 === targetFid) {
            opponentFid = fid2;
            opponentName = name2;
            fbScore = score1;
            oppScore = score2;
        } else if (fid2 === targetFid) {
            opponentFid = fid1;
            opponentName = name1;
            fbScore = score2;
            oppScore = score1;
        } else {
            return returnMatchData ? null : undefined;
        }

        let matchResultChar = '';
if (fbScore > oppScore) {
    matchResultChar = 'G';
} else if (fbScore < oppScore) {
    matchResultChar = 'M';
} else {
    matchResultChar = 'B';
}

        const matchEntry = {
            round: roundInfo,
            season: season,
            subSeason: subSeason,
            leagueName: leagueName,
            opponentName: opponentName,
            opponentFid: opponentFid,
            score: `${fbScore} - ${oppScore}`,
            targetScore: fbScore,
            opponentScore: oppScore,
            result: matchResultChar
        };

        if (returnMatchData) {
            return matchEntry;
        }
    }

    let fenerbahceAnalysisSortState = { column: 'P', direction: 'desc' };

    function renderFenerbahceAnalysisTable(standingsData, modalBodyElement) {
        const progressBarContainer = document.getElementById('analysis-progress');
        if (progressBarContainer) progressBarContainer.style.display = 'none';
        modalBodyElement.innerHTML = '';

        function getFbAnalysisSortClass(columnName) {
            if (fenerbahceAnalysisSortState.column === columnName) {
                return `sortable sort-${fenerbahceAnalysisSortState.direction}`;
            }
            return 'sortable';
        }

        const table = document.createElement('table');
        table.className = 'federation-table';
        table.style.marginTop = '10px';
        table.style.tableLayout = 'fixed';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="width: 30px; text-align:center; padding-left: 1px; padding-right: 1px;">#</th>
                <th class="${getFbAnalysisSortClass('name')}" data-sortkey="name" style="cursor:pointer; min-width: 280px; width: auto;" title="Rakip Federasyon Adına Göre Sırala">Rakip Federasyon</th>
                <th style="width: 50px; text-align:center;" class="${getFbAnalysisSortClass('played')}" data-sortkey="played" style="cursor:pointer;" title="Oynanan Maç Sayısına Göre Sırala">O</th>
                <th style="width:5%; text-align:center;" class="${getFbAnalysisSortClass('G')}" data-sortkey="G" style="cursor:pointer;" title="Galibiyet Sayısına Göre Sırala">G</th>
                <th style="width:5%; text-align:center;" class="${getFbAnalysisSortClass('B')}" data-sortkey="B" style="cursor:pointer;" title="Beraberlik Sayısına Göre Sırala">B</th>
                <th style="width:5%; text-align:center;" class="${getFbAnalysisSortClass('M')}" data-sortkey="M" style="cursor:pointer;" title="Mağlubiyet Sayısına Göre Sırala">M</th>
                <th style="width:5%; text-align:center;" class="${getFbAnalysisSortClass('AG')}" data-sortkey="AG" style="cursor:pointer;" title="Attığı Gol Sayısına Göre Sırala">AG</th>
                <th style="width:5%; text-align:center;" class="${getFbAnalysisSortClass('YG')}" data-sortkey="YG" style="cursor:pointer;" title="Yediği Gol Sayısına Göre Sırala">YG</th>
                <th style="width:5%; text-align:center;" class="${getFbAnalysisSortClass('AV')}" data-sortkey="AV" style="cursor:pointer;" title="Averaja Göre Sırala">AV</th>
                <th style="width: 50px; text-align:center;" class="${getFbAnalysisSortClass('P')}" data-sortkey="P" style="cursor:pointer;" title="Puana Göre Sırala">P</th>
                <th style="width: 70px; text-align:center;" class="${getFbAnalysisSortClass('successRate')}" data-sortkey="successRate" style="cursor:pointer;" title="Başarı Yüzdesine Göre Sırala">Başarı %</th>
                <th style="width: 70px; text-align:center;">Detaylar</th>
            </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const fenerbahceCurrentOpponentsFids = new Set();
        activeFederationMatchResults.forEach(match => {
            if (match.fid1 === FENERBAHCE_FID) {
                fenerbahceCurrentOpponentsFids.add(match.fid2);
            } else if (match.fid2 === FENERBAHCE_FID) {
                fenerbahceCurrentOpponentsFids.add(match.fid1);
            }
        });
        let opponentsArray = Object.entries(standingsData);

        const calculateSuccessRate = (dataObj) => {
            if (dataObj.played === 0) return 0;
            return ((dataObj.G * 3 + dataObj.B * 1) / (dataObj.played * 3)) * 100;
        };

        opponentsArray.sort((entryA, entryB) => {
            const [, a] = entryA;
            const [, b] = entryB;
            let valA_primary, valB_primary, comparison_primary;

            if (fenerbahceAnalysisSortState.column === 'successRate') {
                valA_primary = calculateSuccessRate(a);
                valB_primary = calculateSuccessRate(b);
            } else if (fenerbahceAnalysisSortState.column === 'name') {
                valA_primary = (a.name || '').toLowerCase();
                valB_primary = (b.name || '').toLowerCase();
            } else {
                valA_primary = Number(a[fenerbahceAnalysisSortState.column]) || 0;
                valB_primary = Number(b[fenerbahceAnalysisSortState.column]) || 0;
            }

            if (fenerbahceAnalysisSortState.column === 'name') {
                comparison_primary = valA_primary.localeCompare(valB_primary);
            } else {
                if (valA_primary > valB_primary) comparison_primary = 1;
                else if (valA_primary < valB_primary) comparison_primary = -1;
                else comparison_primary = 0;
            }

            if (comparison_primary !== 0) {
                return fenerbahceAnalysisSortState.direction === 'desc' ? comparison_primary * -1 : comparison_primary;
            }

            if (b.P !== a.P) return b.P - a.P;
            const successRateA = calculateSuccessRate(a);
            const successRateB = calculateSuccessRate(b);
            if (successRateB !== successRateA) return successRateB - successRateA;
            if (b.AV !== a.AV) return b.AV - a.AV;
            if (b.AG !== a.AG) return b.AG - a.AG;
            return (a.name || '').localeCompare(b.name || '');
        });

        if (opponentsArray.length === 0) {
            tbody.innerHTML = '<tr><td colspan="12" style="text-align:center; color:#fff; padding:15px;">Belirtilen sezonlarda Fenerbahçe için işlenecek maç bulunamadı.</td></tr>';
        } else {
            opponentsArray.forEach(([fid, data], index) => {
            // ================= YENİ DEĞİŞİKLİKLER BAŞLANGICI =================
            const isCurrentOpponent = currentSeasonOpponentFids.has(fid);
            // Eğer rakip bu sezondaysa özel bir sınıf ata
            const rowClass = isCurrentOpponent ? 'current-season-opponent' : '';
            // ================= YENİ DEĞİŞİKLİKLER BİTİŞİ =================

            const row = tbody.insertRow();
            row.className = rowClass; // Satıra sınıfı ekle

            row.innerHTML = `
                <td style="text-align:center; padding-left: 1px; padding-right: 1px;">${index + 1}</td>
                <td>
                    <a href="/?p=federations&fid=${fid}" target="_blank" class="team-link" title="${data.name}">${data.name}</a>

                    <!-- Doğrudan <img> etiketi ile ikon ve wrapper -->
                    ${isCurrentOpponent ? `
                        <span class="current-opponent-wrapper">
                            <img class="current-opponent-icon" src="https://www.statsxente.com/MZ1/View/Images/clash_icon.png" alt="Rakip">
                            <span class="tooltip-text">Bu sezonki lig rakiplerinden biri.</span>
                        </span>
                    ` : ''}

                    ${fenerbahceCurrentOpponentsFids.has(fid) ? '<span class="live-match-indicator" title="Fenerbahçe ile bu federasyon arasında devam eden/sonuçlanmış bir maç bulunuyor.">🟢</span>' : ''}
                </td>
                    <td style="text-align:center;">${data.played}</td>
                    <td style="text-align:center; color: #4CAF50;">${data.G}</td>
                    <td style="text-align:center; color: #FFC107;">${data.B}</td>
                    <td style="text-align:center; color: #F44336;">${data.M}</td>
                    <td style="text-align:center;">${data.AG} <span class="average-score-per-match">(${(data.played > 0 ? (data.AG / data.played).toFixed(1) : '0.0')})</span></td>
                    <td style="text-align:center;">${data.YG} <span class="average-score-per-match">(${(data.played > 0 ? (data.YG / data.played).toFixed(1) : '0.0')})</span></td>
                    <td style="text-align:center;">${data.AV > 0 ? '+' : ''}${data.AV}</td>
                    <td style="text-align:center;"><b>${data.P}</b></td>
                    <td style="text-align:center;">${calculateSuccessRate(data).toFixed(2)}%</td>
                    <td style="text-align:center;">
                        <button class="show-matches-btn" data-fid="${fid}" style="padding: 3px 6px; font-size: 0.8em; background-color: #3498db; color:white; border:none; border-radius:3px; cursor:pointer;">Maçlar</button>
                    </td>
                `;
            });
        }
        table.appendChild(tbody);

        thead.addEventListener('click', (e) => {
            const th = e.target.closest('th.sortable');
            if (!th) return;
            const sortKey = th.dataset.sortkey;
            if (!sortKey) return;

            if (fenerbahceAnalysisSortState.column === sortKey) {
                fenerbahceAnalysisSortState.direction = fenerbahceAnalysisSortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                fenerbahceAnalysisSortState.column = sortKey;
                if (['P', 'G', 'AG', 'AV', 'played', 'successRate'].includes(sortKey)) {
                    fenerbahceAnalysisSortState.direction = 'desc';
                } else if (['M', 'YG'].includes(sortKey)) {
                    fenerbahceAnalysisSortState.direction = 'asc';
                } else {
                    fenerbahceAnalysisSortState.direction = 'asc';
                }
            }
            renderFenerbahceAnalysisTable(standingsData, modalBodyElement);
        });

        const tfoot = document.createElement('tfoot');
        let totalPlayed = 0, totalG = 0, totalB = 0, totalM = 0, totalP = 0, totalAG = 0, totalYG = 0;
        Object.values(standingsData).forEach(data => {
            totalPlayed += data.played;
            totalG += data.G;
            totalB += data.B;
            totalM += data.M;
            totalP += data.P;
            totalAG += data.AG;
            totalYG += data.YG;
        });

        if (totalPlayed > 0) {
            tfoot.innerHTML = `
                <tr style="font-weight:bold; border-top: 2px solid #555;">
                    <td colspan="2" style="text-align:right;">TOPLAM:</td>
                    <td style="text-align:center;">${totalPlayed}</td>
                    <td style="text-align:center; color: #4CAF50;">${totalG}</td>
                    <td style="text-align:center; color: #FFC107;">${totalB}</td>
                    <td style="text-align:center; color: #F44336;">${totalM}</td>
                    <td style="text-align:center;">${totalAG} <span class="average-score-per-match">(${(totalPlayed > 0 ? (totalAG / totalPlayed).toFixed(1) : '0.0')})</span></td>
                    <td style="text-align:center;">${totalYG} <span class="average-score-per-match">(${(totalPlayed > 0 ? (totalYG / totalPlayed).toFixed(1) : '0.0')})</span></td>
                    <td style="text-align:center;">${totalAG - totalYG > 0 ? '+' : ''}${totalAG - totalYG}</td>
                    <td style="text-align:center;"><b>${totalP}</b></td>
                    <td style="text-align:center;"><b>${calculateSuccessRate({ G: totalG, B: totalB, M: totalM, played: totalPlayed }).toFixed(2)}%</b></td>
                    <td></td>
                </tr>`;
            table.appendChild(tfoot);
        }

        modalBodyElement.appendChild(table);

        table.querySelectorAll('.show-matches-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const opponentFid = e.target.getAttribute('data-fid');
                const opponentData = standingsData[opponentFid];
                if (opponentData && opponentData.matches) {
                    showMatchDetailsModal(opponentData);
                }
            });
        });
    }

    function showMatchDetailsModal(opponentData) {
        const modalTitle = `${FENERBAHCE_NAME_FOR_ANALYSIS} vs ${opponentData.name} - Maç Detayları`;
        const detailsModalBody = createFenerbahceAnalysisModal(modalTitle);
        detailsModalBody.innerHTML = '';

        const backButton = document.createElement('button');
        backButton.textContent = '← Geri Dön';
        backButton.style.cssText = 'padding: 5px 10px; margin-bottom: 10px; background-color: #7f8c8d; color: white; border: none; border-radius: 3px; cursor: pointer;';
        backButton.addEventListener('click', () => {
            if (fenerbahceAnalysisModalOverlay) {
                // Modalın gövdesini ve başlığını bul
                const modalBody = fenerbahceAnalysisModalOverlay.querySelector('#fenerbahce-analysis-modal-body');
                const modalTitleSpan = fenerbahceAnalysisModalOverlay.querySelector('.modal-header h2 span');

                if (modalBody && modalTitleSpan) {
                    // 1. Sadece modalın içeriğini temizle (kapatıp açma)
                    modalBody.innerHTML = '';

                    // 2. Modal başlığını ana analiz başlığına geri döndür
                    modalTitleSpan.textContent = `${FENERBAHCE_NAME_FOR_ANALYSIS} Geçmiş Sezon Analizi`;

                    // 3. Ana analiz tablosunu doğrudan aynı modal içine yeniden çizdir
                    renderFenerbahceAnalysisTable(fenerbahceOverallStandings, modalBody);
                }
            }
        });
        detailsModalBody.appendChild(backButton);

        const table = document.createElement('table');
        table.className = 'federation-table';
        table.style.marginTop = '5px';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Sezon / Lig Bilgisi</th>
                    <th>Skor (${FENERBAHCE_NAME_FOR_ANALYSIS} - ${opponentData.name})</th>
                    <th>Sonuç</th>
                </tr>
            </thead>
            <tbody>
                ${opponentData.matches.map(match => `
                    <tr>
                        <td>S.${match.season}.${match.subSeason} - ${match.leagueName} (Tur: ${match.round})</td>
                        <td class="match-score-cell">${match.score}</td>
                        <td style="text-align:center;" class="match-result-${match.result}">${match.result}</td>
                    </tr>`).join('')}
            </tbody>
        `;
        detailsModalBody.appendChild(table);
    }

    function exportFenerbahceAnalysisToExcel() {
        const modalContent = document.getElementById('fenerbahce-analysis-modal-content');
        if (!modalContent) {
            alert("Aktarılacak tablo bulunamadı.");
            return;
        }
        const table = modalContent.querySelector('table.federation-table');
        if (!table) {
            alert("Aktarılacak tablo bulunamadı.");
            return;
        }

        const tableClone = table.cloneNode(true);
        const headers = tableClone.querySelectorAll('thead th');
        const bodies = tableClone.querySelectorAll('tbody tr');
        const footers = tableClone.querySelectorAll('tfoot tr');

        if (headers.length > 0 && headers[headers.length - 1].textContent === "Detaylar") {
            headers[headers.length - 1].remove();
        }
        bodies.forEach(row => {
            if (row.cells.length > 0 && row.cells[row.cells.length - 1].querySelector('.show-matches-btn')) {
                row.cells[row.cells.length - 1].remove();
            }
        });
        footers.forEach(row => {
            if (row.cells.length > 0 && row.cells[row.cells.length - 1].textContent === "") {
                row.cells[row.cells.length - 1].remove();
            }
        });

        const wb = XLSX.utils.table_to_book(tableClone, { sheet: "Fenerbahce Analiz" });
        const ws = wb.Sheets["Fenerbahce Analiz"];
        ws['!cols'] = [
            { wch: 5 }, { wch: 30 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
            { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 10 }
        ];

        const timestamp = new Date().toISOString().replace(/[:.T-]/g, '').substring(0, 14);
        const filename = `Fenerbahce_Sezon_Analizi_${timestamp}.xlsx`;
        XLSX.writeFile(wb, filename);
    }


    // ====================================================================================
    // BÖLÜM 8: FENERBAHÇE LİG PERFORMANSI BÖLÜMÜ
    // ====================================================================================

    function createFenerbahceLeagueAnalysisButton() {
        const button = document.createElement('button');
        button.textContent = 'FB Lig Analizi';
        button.title = 'Fenerbahçe - Türkiye takımının geçmiş sezonlardaki lig performansını gösterir.';
        button.style.cssText = 'padding: 4px 8px; font-size: 0.9em; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.2s;';
        button.onmouseover = () => button.style.backgroundColor = '#2980b9';
        button.onmouseout = () => button.style.backgroundColor = '#3498db';

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            startFenerbahceLeagueAnalysis();
        });
        return button;
    }

    function parseCurrentSeasonDataFromDOM() {
        const table = document.querySelector(FEDERATION_STANDINGS_TABLE_SELECTOR);
        if (!table) return null;

        const rows = table.querySelectorAll('tbody tr');
        for (const row of rows) {
            const fedLink = row.querySelector(`a.fed_link[href*="fid=${FENERBAHCE_FID}"]`);
            if (fedLink) {
                const cells = row.cells;
                if (cells.length > 6) {
                    return {
                        position: parseInt(cells[0].textContent.trim(), 10) || '-',
                        wins: parseInt(cells[2].textContent.trim(), 10) || 0,
                        draws: parseInt(cells[3].textContent.trim(), 10) || 0,
                        losses: parseInt(cells[4].textContent.trim(), 10) || 0,
                        ebp: parseInt(cells[5].textContent.trim(), 10) || 0,
                        points: parseInt(cells[6].textContent.trim(), 10) || 0,
                    };
                }
            }
        }
        return null;
    }

    async function fetchCompleteLeagueDataForSeason(leagueInfo) {
        const { season, subSeason, level, division } = leagueInfo;
        const url = `/ajax.php?p=federations&sub=league&tab=division&sport=soccer&season=${season}&sub_season=${subSeason}&level=${level}&div=${division}`;

        try {
            const response = await fetch(url);
            if (!response.ok) return null;

            const htmlText = await response.text();
            const doc = new DOMParser().parseFromString(htmlText, 'text/html');

            const leagueTable = doc.querySelector('table.nice_table');
            if (!leagueTable) return null;

            const allRows = leagueTable.querySelectorAll('tbody tr');
            for (const row of allRows) {
                const fedLink = row.querySelector(`a.fed_link[href*="fid=${FENERBAHCE_FID}"]`);
                if (fedLink) {
                    const cells = row.cells;
                    if (cells.length > 6) {
                        return {
                            position: parseInt(cells[0].textContent.trim(), 10) || '-',
                            wins: parseInt(cells[2].textContent.trim(), 10) || 0,
                            draws: parseInt(cells[3].textContent.trim(), 10) || 0,
                            losses: parseInt(cells[4].textContent.trim(), 10) || 0,
                            ebp: parseInt(cells[5].textContent.trim(), 10) || 0,
                            points: parseInt(cells[6].textContent.trim(), 10) || 0,
                        };
                    }
                }
            }
        } catch (error) {
            console.error(`Tüm lig verilerini çekme hatası (Sezon ${season}.${subSeason}):`, error);
        }
        return null;
    }

    async function startFenerbahceLeagueAnalysis() {
    const modalBody = createFenerbahceAnalysisModal(`${FENERBAHCE_NAME_FOR_ANALYSIS} Geçmiş Sezon Lig Performansı`);
    if (!modalBody) return;

    const FB_LEAGUE_PERF_CACHE_PREFIX = 'fb_league_perf_cache_';
    const progressBar = document.getElementById('analysis-progress-bar');
    const progressTextElement = document.querySelector('#fenerbahce-analysis-modal-body > p');
    NProgress.start();

    // Sayfada seçili olan sezon bilgisini al
    const seasonSelect = document.getElementById('season-select');
    const selectedSeasonOption = seasonSelect.options[seasonSelect.selectedIndex];
    const currentDisplayedSeason = selectedSeasonOption.getAttribute('data-season');
    const currentDisplayedSubSeason = selectedSeasonOption.getAttribute('data-sub-season');

    // ManagerZone'un güncel sezon bilgisini al
    const currentMzSeason = (typeof mz !== 'undefined' && mz && typeof mz.season === 'number') ? mz.season : 999;
    const currentMzSubSeason = (typeof mz !== 'undefined' && mz && typeof mz.subSeason === 'number') ? mz.subSeason : 2;

    const allSeasonResults = [];
    let seasonsProcessedCount = 0;
    const totalSeasonsToProcess = FENERBAHCE_SEASON_LEAGUES.length;

    for (const leagueInfo of FENERBAHCE_SEASON_LEAGUES) {
        seasonsProcessedCount++;
        const progressMessage = `Veriler Taranıyor: Sezon ${leagueInfo.season}.${leagueInfo.subSeason} işleniyor... (${seasonsProcessedCount}/${totalSeasonsToProcess})`;
        if (progressTextElement) {
            progressTextElement.innerHTML = `<p style="color:#fff; text-align:center; padding:10px;">${progressMessage}</p>`;
        }

        const isCurrentlyDisplayedOnPage = (leagueInfo.season === currentDisplayedSeason && leagueInfo.subSeason === currentDisplayedSubSeason);
        const isPastCompletedSeason = parseInt(leagueInfo.season) < currentMzSeason || (parseInt(leagueInfo.season) === currentMzSeason && parseInt(leagueInfo.subSeason) < currentMzSubSeason);
        const cacheKey = `${FB_LEAGUE_PERF_CACHE_PREFIX}S${leagueInfo.season}_${leagueInfo.subSeason}`;
        let seasonStats = null;

        // 1. Veriyi Al (Öncelik sırasına göre)
        if (isCurrentlyDisplayedOnPage) {
            // Eğer o an sayfada görüntülenen sezonsa, en güncel veri DOM'dadır.
            seasonStats = parseCurrentSeasonDataFromDOM();
            console.log(`FB Lig Analizi: Mevcut sezon (${leagueInfo.season}.${leagueInfo.subSeason}) DOM'dan okundu.`);
        } else if (isPastCompletedSeason) {
            // Eğer geçmiş bir sezonsa, önce önbelleği kontrol et.
            const cachedData = GM_getValue(cacheKey, null);
            if (cachedData) {
                try {
                    seasonStats = JSON.parse(cachedData);
                    console.log(`FB Lig Analizi: Geçmiş sezon (${leagueInfo.season}.${leagueInfo.subSeason}) önbellekten okundu.`);
                } catch (e) { seasonStats = null; }
            }
        }

        // Eğer yukarıdaki adımlarda veri bulunamadıysa, internetten çek.
        if (!seasonStats) {
            seasonStats = await fetchCompleteLeagueDataForSeason(leagueInfo);
            console.log(`FB Lig Analizi: Sezon (${leagueInfo.season}.${leagueInfo.subSeason}) internetten çekildi.`);
            // Sadece geçmiş ve tamamlanmış sezonların sonucunu önbelleğe kaydet.
            if (seasonStats && isPastCompletedSeason) {
                GM_setValue(cacheKey, JSON.stringify(seasonStats));
                console.log(`FB Lig Analizi: Sezon (${leagueInfo.season}.${leagueInfo.subSeason}) önbelleğe kaydedildi.`);
            }
        }

        allSeasonResults.push({
            season: `${leagueInfo.season}.${leagueInfo.subSeason}`,
            leagueName: leagueInfo.leagueName,
            ...(seasonStats || { position: '-', wins: 0, draws: 0, losses: 0, ebp: 0, points: 0 })
        });

        // İlerleme çubuğunu güncelle
        const percentComplete = Math.round((seasonsProcessedCount / totalSeasonsToProcess) * 100);
        if (progressBar) {
            progressBar.style.width = `${percentComplete}%`;
            progressBar.textContent = `${percentComplete}%`;
        }

        // İstekler arası bekleme
        if (!isPastCompletedSeason || !seasonStats) {
           await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    NProgress.done();
    renderFenerbahceLeaguePerfTable(allSeasonResults, modalBody);
}

    function renderFenerbahceLeaguePerfTable(data, modalBodyElement) {
        modalBodyElement.innerHTML = '';

        const backButton = document.createElement('button');
        backButton.textContent = '← Geri Dön';
        backButton.style.cssText = 'padding: 5px 10px; margin-bottom: 10px; background-color: #7f8c8d; color: white; border: none; border-radius: 3px; cursor: pointer;';
        backButton.addEventListener('click', () => {
            if (fenerbahceAnalysisModalOverlay) {
                // Modalın gövdesini ve başlığını bul
                const modalBody = fenerbahceAnalysisModalOverlay.querySelector('#fenerbahce-analysis-modal-body');
                const modalTitleSpan = fenerbahceAnalysisModalOverlay.querySelector('.modal-header h2 span');

                if (modalBody && modalTitleSpan) {
                    // 1. Sadece modalın içeriğini temizle (kapatıp açma)
                    modalBody.innerHTML = '';

                    // 2. Modal başlığını ana analiz başlığına geri döndür
                    modalTitleSpan.textContent = `${FENERBAHCE_NAME_FOR_ANALYSIS} Geçmiş Sezon Analizi`;

                    // 3. Ana analiz tablosunu doğrudan aynı modal içine yeniden çizdir
                    // Daha önce hesaplanan fenerbahceOverallStandings verisini kullanıyoruz.
                    renderFenerbahceAnalysisTable(fenerbahceOverallStandings, modalBody);
                }
            }
        });
        modalBodyElement.appendChild(backButton);

        let fenerbahceLeaguePerfSortState = { column: 'season', direction: 'desc' };

        function sortData() {
            data.sort((a, b) => {
                const col = fenerbahceLeaguePerfSortState.column;
                const dir = fenerbahceLeaguePerfSortState.direction === 'asc' ? 1 : -1;
                let valA = a[col];
                let valB = b[col];
                if (valA === '-') valA = dir === 1 ? Infinity : -Infinity;
                if (valB === '-') valB = dir === 1 ? Infinity : -Infinity;
                if (col === 'season') {
                    const [majorA, minorA] = a.season.split('.').map(Number);
                    const [majorB, minorB] = b.season.split('.').map(Number);
                    if (majorA !== majorB) return (majorA - majorB) * dir;
                    return (minorA - minorB) * dir;
                }
                if (typeof valA === 'string') return (valA || '').localeCompare(valB || '') * dir;
                return (valA - valB) * dir;
            });
        }

        function renderTable() {
            sortData();
            const getSortClass = (columnName) => `sortable ${fenerbahceLeaguePerfSortState.column === columnName ? `sort-${fenerbahceLeaguePerfSortState.direction}` : ''}`;
            const table = document.createElement('table');
            table.className = 'federation-table';

            // ========================= YENİ EKLENEN/DEĞİŞEN SATIRLAR =========================
            table.style.tableLayout = 'fixed'; // Sütun genişliklerini zorla (EN ÖNEMLİ DEĞİŞİKLİK)
            table.style.width = '100%';       // Tablonun konteynere yayılmasını sağla
            // =================================================================================

            const thead = document.createElement('thead');
            // Genişlikler ayarlandı
            thead.innerHTML = `
                <tr>
                    <th class="${getSortClass('season')}" data-sortkey="season" title="Sezona Göre Sırala" style="width: 15%;">Sezon</th>
                    <th class="${getSortClass('leagueName')}" data-sortkey="leagueName" title="Lig Adına Göre Sırala" style="width: 30%;">Lig</th>
                    <th class="${getSortClass('position')}" data-sortkey="position" title="Sıralamaya Göre Sırala" style="width: 8%; text-align:center;">Sıra</th>
                    <th class="${getSortClass('wins')}" data-sortkey="wins" title="Galibiyet" style="width: 8%; text-align:center;">G</th>
                    <th class="${getSortClass('draws')}" data-sortkey="draws" title="Beraberlik" style="width: 8%; text-align:center;">B</th>
                    <th class="${getSortClass('losses')}" data-sortkey="losses" title="Mağlubiyet" style="width: 8%; text-align:center;">M</th>
                    <th class="${getSortClass('ebp')}" data-sortkey="ebp" title="Extra Bonus Puanı" style="width: 10%; text-align:center;">EBP</th>
                    <th class="${getSortClass('points')}" data-sortkey="points" title="Puan" style="width: 10%; text-align:center;">Puan</th>
                </tr>
            `;
            table.appendChild(thead);

            thead.addEventListener('click', (e) => {
                const th = e.target.closest('th.sortable');
                if (!th) return;
                const sortKey = th.dataset.sortkey;
                if (!sortKey) return;
                if (fenerbahceLeaguePerfSortState.column === sortKey) {
                    fenerbahceLeaguePerfSortState.direction = fenerbahceLeaguePerfSortState.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    fenerbahceLeaguePerfSortState.column = sortKey;
                    fenerbahceLeaguePerfSortState.direction = ['season', 'points', 'wins', 'ebp'].includes(sortKey) ? 'desc' : 'asc';
                }
                modalBodyElement.innerHTML = '';
                modalBodyElement.appendChild(renderTable());
            });

            const tbody = document.createElement('tbody');
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">İşlenecek veri bulunamadı.</td></tr>';
            } else {
                data.forEach(d => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${d.season}</td>
                            <td>${d.leagueName}</td>
                            <td style="text-align:center; font-weight: 500;">${d.position}</td>
                            <td style="text-align:center; color: #2ecc71;">${d.wins}</td>
                            <td style="text-align:center; color: #f39c12;">${d.draws}</td>
                            <td style="text-align:center; color: #e74c3c;">${d.losses}</td>
                            <td style="text-align:center;">${d.ebp}</td>
                            <td style="text-align:center; font-weight: bold; color: #f1c40f;">${d.points}</td>
                        </tr>
                    `;
                });
            }
            table.appendChild(tbody);

            // Ortalama satırı
            if (data.length > 0) {
                const tfoot = document.createElement('tfoot');
                let totalPosition = 0;
                let validPositionCount = 0;
                let totalWins = 0;
                let totalDraws = 0;
                let totalLosses = 0;
                let totalEbp = 0;
                let totalPoints = 0;

                data.forEach(d => {
                    if (typeof d.position === 'number' && !isNaN(d.position)) {
                        totalPosition += d.position;
                        validPositionCount++;
                    }
                    totalWins += d.wins;
                    totalDraws += d.draws;
                    totalLosses += d.losses;
                    totalEbp += d.ebp;
                    totalPoints += d.points;
                });

                const seasonCount = data.length;
                const averagePosition = validPositionCount > 0 ? (totalPosition / validPositionCount).toFixed(1) : '-';
                const averageWins = (totalWins / seasonCount).toFixed(1);
                const averageDraws = (totalDraws / seasonCount).toFixed(1);
                const averageLosses = (totalLosses / seasonCount).toFixed(1);
                const averageEbp = (totalEbp / seasonCount).toFixed(0);
                const averagePoints = (totalPoints / seasonCount).toFixed(1);

                tfoot.innerHTML = `
                    <tr style="font-weight:bold; border-top: 2px solid #3498db; background-color: #2c3e50; color: #ecf0f1;">
                        <td></td>  <!-- 1. Sütun (Sezon) için boş hücre -->
                        <td style="text-align:right; padding-right:10px;">Ortalama:</td> <!-- 2. Sütun (Lig) içine hizalanmış etiket -->
                        <td style="text-align:center;">${averagePosition}</td> <!-- 3. Sütun (Sıra) içine ortalanmış değer -->
                        <td style="text-align:center;">${averageWins}</td>
                        <td style="text-align:center;">${averageDraws}</td>
                        <td style="text-align:center;">${averageLosses}</td>
                        <td style="text-align:center;">${averageEbp}</td>
                        <td style="text-align:center;">${averagePoints}</td>
                    </tr>
                `;
                table.appendChild(tfoot);
            }

            return table;
        }

        modalBodyElement.appendChild(renderTable());
    }

    // ====================================================================================
    // BÖLÜM 8.5: FENERBAHÇE RAKİP ANALİZİ FONKSİYONLARI (FİNAL VERSİYON)
    // ====================================================================================

    async function fetchAndCacheFederationSchedule() {
        if (federationScheduleCache) return federationScheduleCache;

        // LEAGUE_STATE objesinin dolu olduğundan emin ol
        if (!LEAGUE_STATE.season || !LEAGUE_STATE.subSeason || LEAGUE_STATE.level === null || !LEAGUE_STATE.group) {
            console.error("[Rakip Analizi] LEAGUE_STATE verileri eksik. Fikstür URL'si oluşturulamıyor.");
            return null;
        }

        // Dropdown menülerdeki güncel bilgilere göre doğru AJAX URL'sini oluşturuyoruz.
        // NOT: LEAGUE_STATE.level 0'dan başlar (Elite=0), URL ise 1'den başlar (Elite=1). Bu yüzden +1 ekliyoruz.
        const scheduleUrl = `/ajax.php?p=federations&sub=schedule&sport=soccer&season=${LEAGUE_STATE.season}&sub_season=${LEAGUE_STATE.subSeason}&level=${LEAGUE_STATE.level + 1}&div=${LEAGUE_STATE.group}`;

        console.log("[Rakip Analizi] Dinamik olarak çekilen Fikstür URL'si:", scheduleUrl);

        try {
            // Bu URL'den veriyi çekiyoruz.
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: scheduleUrl,
                    onload: resolve,
                    onerror: reject
                });
            });

            const htmlText = response.responseText;
            federationScheduleCache = { htmlText };
            return federationScheduleCache;
        } catch (error) {
            console.error(`[Rakip Analizi] Fikstür sayfası çekilemedi (${scheduleUrl}):`, error);
            return null;
        }
    }

    /**
     * Fikstür HTML'ini analiz ederek Fenerbahçe'nin tüm rakipleriyle olan maçlarını bulur.
     * Bu versiyon, takımları en güvenilir yöntem olan FID (Federasyon ID) ile eşleştirir.
     */
    function parseFenerbahceFixture(htmlText) {
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const fixture = {};
        const roundRegex = /\d+/;
        let nextMatch = { round: Infinity, opponentName: null }; // Sıradaki rakibi bulmak için

        doc.querySelectorAll('h2.subheader').forEach(header => {
            const roundMatch = header.textContent.match(roundRegex);
            if (!roundMatch) return;
            const round = parseInt(roundMatch[0], 10);

            const table = header.nextElementSibling?.querySelector('table');
            if (!table) return;

            table.querySelectorAll('tbody tr').forEach(row => {
                const [homeCell, scoreCell, awayCell] = row.cells;
                if (!homeCell || !scoreCell || !awayCell) return;

                const homeTeamLink = homeCell.querySelector('a.fed_link');
                const awayTeamLink = awayCell.querySelector('a.fed_link');
                if (!homeTeamLink || !awayTeamLink) return;

                const homeTeamFid = homeTeamLink.href.match(/fid=(\d+)/)?.[1];
                const awayTeamFid = awayTeamLink.href.match(/fid=(\d+)/)?.[1];
                if (!homeTeamFid || !awayTeamFid) return;

                const homeTeamName = homeTeamLink.title.trim();
                const awayTeamName = awayTeamLink.title.trim();

                const isHomeFenerbahce = (homeTeamFid === FENERBAHCE_FID);
                const isAwayFenerbahce = (awayTeamFid === FENERBAHCE_FID);

                if (isHomeFenerbahce || isAwayFenerbahce) {
                    const opponentName = isHomeFenerbahce ? awayTeamName : homeTeamName;
                    if (!fixture[opponentName]) {
                        fixture[opponentName] = { played: [], futureRounds: [] };
                    }

                    const scoreLink = scoreCell.querySelector('a');
                    const location = isHomeFenerbahce ? i18n_strings.locationHome : i18n_strings.locationAway;
                    const currentRoundText = `${i18n_strings.roundPrefix} ${round}`;

                    if (scoreLink && /^\d+\s*-\s*\d+$/.test(scoreLink.textContent.trim())) {
                        // Oynanmış maç
                        const scores = scoreLink.textContent.trim().split('-').map(s => parseInt(s.trim()));
                        const fbScore = isHomeFenerbahce ? scores[0] : scores[1];
                        const oppScore = isHomeFenerbahce ? scores[1] : scores[0];
                        fixture[opponentName].played.push({
                            score: `${fbScore} - ${oppScore}`, matchURL: scoreLink.href, location: location,
                            status: fbScore > oppScore ? 'win' : (fbScore < oppScore ? 'loss' : 'draw'),
                        });
                    } else {
                        // Oynanmamış (gelecek) maç
                        fixture[opponentName].futureRounds.push(currentRoundText);
                        // Bu maç, şu ana kadar bulduğumuz en yakın tarihli maç mı?
                        if (round < nextMatch.round) {
                            nextMatch = { round, opponentName };
                        }
                    }
                }
            });
        });

        console.log(`[Rakip Analizi] Sıradaki rakip: ${nextMatch.opponentName || 'Bulunamadı'}`);
        // Hem fikstür verisini hem de sıradaki rakibin adını döndür
        return { fixture, nextOpponentName: nextMatch.opponentName };
    }

    /**
     * Analiz edilen fikstür verisini kullanarak puan tablosuna görselleri ve vurgulamayı ekler.
     */
    function applyFederationVisuals({ fixture, nextOpponentName }) {
        if (!fixture) return;

        const tableBody = document.querySelector(FEDERATION_STANDINGS_TABLE_SELECTOR)?.querySelector('tbody');
        if (!tableBody) return;

        // Önceki eklemeleri temizle
        tableBody.querySelectorAll('.mz-indicators-wrapper').forEach(el => el.remove());
        tableBody.querySelectorAll('.mz-team-cell').forEach(el => el.classList.remove('mz-team-cell'));
        tableBody.querySelectorAll('.mz-next-opponent').forEach(el => el.classList.remove('mz-next-opponent'));

        tableBody.querySelectorAll("tr").forEach(row => {
            const fedLink = row.cells[COL_INDEX_FED_NAME]?.querySelector('a.fed_link');
            const isFenerbahceRow = fedLink && fedLink.href.includes(`fid=${FENERBAHCE_FID}`);
            if (!fedLink || isFenerbahceRow) return;

            const teamCell = fedLink.parentNode;
            teamCell.classList.add('mz-team-cell');
            const fedName = fedLink.title.trim();

            // Sıradaki rakipse satırı vurgula
            if (nextOpponentName && fedName === nextOpponentName) {
                row.classList.add('mz-next-opponent');
            }

            const result = fixture[fedName];
            if (result) {
                const wrapper = document.createElement('span');
                wrapper.className = 'mz-indicators-wrapper';

                if (result.played && result.played.length > 0) {
                    result.played.forEach(playedMatch => {
                        const icon = document.createElement('span');
                        icon.className = `match-indicator match-${playedMatch.status}`;
                        icon.dataset.tooltipText = `${playedMatch.location} ${playedMatch.score}`;
                        icon.dataset.status = playedMatch.status;
                        icon.addEventListener('click', () => window.open(playedMatch.matchURL, '_blank'));
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

                if (wrapper.hasChildNodes()) {
                    // İkonları, takım isminin bulunduğu linkten hemen sonra ekliyoruz.
                    fedLink.parentNode.insertBefore(wrapper, fedLink.nextSibling);
                }
            }
        });
    }

    /**
     * Rakip analizi sürecini başlatan ve yöneten ana fonksiyon.
     */
    async function runOpponentAnalysis() {
        initializeTooltip();
        try {
            const scheduleData = await fetchAndCacheFederationSchedule();
            if (scheduleData && scheduleData.htmlText) {
                // Fikstür verisi artık hem maçları hem de sıradaki rakibi içeriyor
                const fixtureData = parseFenerbahceFixture(scheduleData.htmlText);
                applyFederationVisuals(fixtureData);
            }
        } catch (error) {
            console.error("[Rakip Analizi] Analiz sırasında hata oluştu:", error);
        }
    }


    // ====================================================================================
    // BÖLÜM 9: BAŞLANGIÇ VE ANA YÜRÜTME MANTIĞI
    // ====================================================================================

    async function initialize(header, table, rows) {
        const seasonSelect = document.getElementById('season-select');
        const divisionSelect = document.getElementById('division-select');
        if (!seasonSelect || !divisionSelect) return;

        const selectedSeason = seasonSelect.options[seasonSelect.selectedIndex];
        LEAGUE_STATE.season = selectedSeason.getAttribute('data-season');
        LEAGUE_STATE.subSeason = selectedSeason.getAttribute('data-sub-season');

        const selectedDivision = divisionSelect.options[divisionSelect.selectedIndex];
        LEAGUE_STATE.level = selectedDivision.getAttribute('data-level') - 1;
        LEAGUE_STATE.group = selectedDivision.getAttribute('data-div');
        LEAGUE_STATE.division = LEAGUE_STATE.level !== 0 ? `Division ${LEAGUE_STATE.level}.${LEAGUE_STATE.group}` : 'Elite Division';

        const roundTitle = document.querySelector('.round-title');
        if (roundTitle) {
            const roundMatch = roundTitle.textContent.match(/\d+/);
            LEAGUE_STATE.currentRound = roundMatch ? parseInt(roundMatch[0]) : null;
        }

        LEAGUE_STATE.federations = Array.from(rows)
            .map(row => {
                const fedLink = row.querySelector('a.fed_link');
                if (!fedLink) return null;
                const fid = fedLink.href.match(/fid=(\d+)/)?.[1];
                if (!fid) return null;
                return {
                    fid: fid,
                    name: fedLink.title,
                    position: row.cells[0]?.textContent?.trim() || ''
                };
            })
            .filter(fed => fed !== null);

        const cache = getCachedData();
        LEAGUE_STATE.federations.forEach(federation => {
            // Tur (round) kontrolünü kaldır. Sadece verinin var olup olmadığını kontrol et.
            if (cache[federation.fid]?.data) {
                federation.members = cache[federation.fid].data;
            }
        });

        currentSeasonOpponentFids.clear(); // Her başlangıçta seti temizle
        LEAGUE_STATE.federations.forEach(fed => {
            if (fed.fid !== FENERBAHCE_FID) {
                currentSeasonOpponentFids.add(fed.fid);
            }
        });
        // ================= YENİ EKLENECEK BLOK BİTİŞİ =================

        header.appendChild(createFederationSelect());
        header.appendChild(createUpdateButton());
        header.appendChild(createCompareButton());
        header.appendChild(createLiveUpdateButton());
        header.appendChild(createFenerbahceAnalysisButton());
        header.appendChild(createRankingAnalysisButton()); // <-- YENİ BUTONU BURAYA EKLEYİN

        renderFederationSummaryTable();
        runOpponentAnalysis();
    }

    const observer = new MutationObserver((mutations, obs) => {
        const header = document.querySelector('.federation-clash-league-header');
        const table = document.querySelector('table.nice_table');
        if (!header || !table) return;

        const rows = table.querySelectorAll('tbody tr');
        if (rows.length === 0) return;

        obs.disconnect();
        initialize(header, table, rows);
    });

    observer.observe(document.body, { childList: true, subtree: true });

   // ====================================================================================
// BÖLÜM 10: SIRALAMA ANALİZİ FONKSİYONLARI (PERFORMANS OPTİMİZASYONLU)
// ====================================================================================

// --- YENİ EKLENEN ÖNBELLEK DEĞİŞKENLERİ ---
let rankingAnalysisCache = {
    data: null,
    isFetching: false,
    timestamp: 0
};
const RANKING_CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // 4 saat
const TEAM_FED_INFO_CACHE_PREFIX = 'teamFedInfo_';

/**
 * Sıralama analizi için modal pencereyi oluşturur.
 */
function createRankingAnalysisModal() {
    const modalId = 'ranking-analysis-modal';
    if (document.getElementById(modalId)) document.getElementById(modalId).remove();

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-content" id="ranking-analysis-modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>En İyi Takımlar Analizi</h2>
                <div class="modal-close">×</div>
            </div>
            <div class="federation-display" id="ranking-analysis-modal-body" style="padding-top: 10px;">
                <p style="color:#fff; text-align:center; padding:20px;">Sıralama verileri hazırlanıyor, lütfen bekleyin...</p>
                <div id="analysis-progress" style="width: 80%; margin: 10px auto; background-color: #555; border-radius: 5px; text-align: center; color: white;">
                    <div id="analysis-progress-bar" style="width: 0%; background-color: #4a9eff; height: 20px; border-radius: 5px; line-height: 20px;">0%</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const content = overlay.querySelector('.modal-content');
    requestAnimationFrame(() => {
        overlay.classList.add('visible');
        content.classList.add('visible');
    });

    const closeModal = () => {
        overlay.classList.remove('visible');
        content.classList.remove('visible');
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('.modal-close').onclick = closeModal;
    overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };

    return overlay.querySelector('#ranking-analysis-modal-body');
}

   // =================== YENİ EKLENEN FONKSİYON BAŞLANGICI ===================
/**
 * Bir takımın ManagerZone sıralamasını kendi sayfasından çeker.
 * Sadece sıralaması henüz bilinmeyen takımlar için kullanılır.
 */
async function fetchTeamMzRank(teamId) {
    // Eğer takım ID'si yoksa veya geçersizse, işlem yapma
    if (!teamId) {
        return null;
    }

    const url = `/?p=team&tid=${teamId}`;
    try {
        // Takım sayfasını çekmek için istek gönder
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ method: "GET", url, onload: resolve, onerror: reject, timeout: 10000 });
        });

        // Gelen HTML metnini ayrıştır
        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

        // Sıralama bilgisini içeren o özel 'span' elementini bul
        // En güvenilir yol, 'title' özelliğinde "Puan" kelimesinin geçmesidir.
        const rankElement = doc.querySelector('#infoAboutTeam dd span[title*="Puan"]');

        // Element bulunduysa, içindeki metni (sayıyı) al, parse et ve döndür
        if (rankElement) {
            const rank = parseInt(rankElement.textContent.trim(), 10);
            return isNaN(rank) ? null : rank;
        }

        // Eğer element bulunamazsa, null döndür
        return null;

    } catch (error) {
        console.error(`Sıralama bilgisi çekilirken hata (TID: ${teamId}):`, error);
        // Hata durumunda da null döndürerek akışın devam etmesini sağla
        return null;
    }
}
// =================== YENİ EKLENEN FONKSİYON BİTİŞİ ===================

/**
 * Bir takımın hem federasyon bilgisini hem de MZ sıralamasını tek seferde çeker.
 * SONUÇLARI KALICI OLARAK ÖNBELLEĞE ALIR.
 */
async function fetchTeamFederationInfo(teamId, forceRefresh = false) {
    if (!teamId) {
        return { federationName: 'N/A', federationLink: '#', federationLeague: 'N/A', federationLeagueLink: '#', managerUid: null, mzRank: null };
    }

    const cacheKey = TEAM_FED_INFO_CACHE_PREFIX + teamId;

    if (!forceRefresh) {
        const cachedData = GM_getValue(cacheKey, null);
        if (cachedData) {
            return cachedData;
        }
    }

    const url = `/?p=team&tid=${teamId}`;
    try {
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({ method: "GET", url, onload: resolve, onerror: reject, timeout: 15000 });
        });

        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

        // 1. Menajer UID Alma
        const profileLinkElement = doc.querySelector('#expander-menu a[href*="?p=profile&uid="]');
        let managerUid = null;
        if (profileLinkElement) {
            const uidMatch = profileLinkElement.href.match(/uid=(\d+)/);
            if (uidMatch && uidMatch[1]) managerUid = uidMatch[1];
        }

        // 2. Federasyon Bilgilerini Alma
        const fedContainer = doc.querySelector('.first-team-federation');
        let fedInfo = { federationName: 'Yok', federationLink: '#', federationLeague: 'N/A', federationLeagueLink: '#' };
        if (fedContainer) {
            const fedLinkElement = fedContainer.querySelector('a.fed_link');
            const leagueLinkElement = fedContainer.querySelector('a[href*="&sub=league"]');
            fedInfo = {
                federationName: fedLinkElement ? fedLinkElement.title.trim() : 'Bulunamadı',
                federationLink: fedLinkElement ? fedLinkElement.href : '#',
                federationLeague: leagueLinkElement ? leagueLinkElement.title.trim() : 'N/A',
                federationLeagueLink: leagueLinkElement ? leagueLinkElement.href : '#'
            };
        }

        // 3. MZ Sıralamasını (Rank) Alma - AYNI SAYFA İÇİNDEN
        // "Puan" kelimesini içeren span'ı buluyoruz (Örn: "Puan: 1234")
        let rank = null;
        const rankElement = doc.querySelector('#infoAboutTeam dd span[title*="Puan"]');
        if (rankElement) {
            rank = parseInt(rankElement.textContent.trim(), 10);
            if (isNaN(rank)) rank = null;
        }

        // Sonuçları birleştir ve kaydet
        const result = { ...fedInfo, managerUid: managerUid, mzRankFromPage: rank };
        GM_setValue(cacheKey, result);
        return result;

    } catch (error) {
        console.error(`Takım bilgisi çekilirken hata (TID: ${teamId}):`, error);
        return { federationName: 'Hata', federationLink: '#', federationLeague: 'Hata', federationLeagueLink: '#', managerUid: null, mzRankFromPage: null };
    }
}


/**
 * Statsxente'den ELO'ya göre sıralanmış ilk 100 takımı çeker.
 * GÜNCELLENDİ: Artık her takım için Top 11 Değerini de çekiyor.
 */
async function fetchTop100EloTeams(progressBar, forceRefresh = false) { // <-- YENİ PARAMETRE
    const url = 'https://statsxente.com/MZ1/Functions/lecturaEquipos2.0.php?noheader=true&idioma=TURKISH&divisa=EUR&eloButtonType=2&eloButtonCat=SENIOR&idJugador=&idEquipo=&idLiga=&pais=&division=&fechMin=2019-10-10&fechMax=2100-10-10&fechMax=2100-10-10&edadMin=15&edadMax=45&salarioMin=0&salarioMax=1000000&valorMin=0&valorMax=30000000000000&valor23Min=0&valor23Max=30000000000000&valor21Min=0&valor21Max=30000000000000&valor18Min=0&valor18Max=30000000000000&valorNoNacMin=0&valorNoNacMax=30000000000000&equipo=&limite=100&ordenar=elo&numJugadores=0&valor11=1&valor=1&valor23=0&valor21=0&valor18=0&salario=0&edad=0&valor11_23=0&valor11_21=0&valor11_18=0&noNac=0&edadTop11=0&edadSenior=0&valorUPSenior=1&valorUPSUB23=0&valorUPSUB21=0&valorUPSUB18=0&elo=1&usuario=&elo21=&elo23=&elo18=&liga_world=0&liga_world23=0&liga_world21=0&liga_world18=0&liga_juv23=0&liga_juv21=0&liga_juv18=0';

    progressBar.style.width = '10%';
    progressBar.textContent = 'Statsxente ELO sıralaması çekiliyor...';

    const initialTeamsData = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { "Referer": "https://statsxente.com/MZ1/View/filtroEquipos.php" },
            timeout: 30000,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const rows = doc.querySelectorAll('#myTableEquipos tbody tr');
                    const teamsData = [];
                    const headerCells = Array.from(doc.querySelectorAll('#myTableEquipos thead td'));
                    // HEM ELO HEM DE DEĞER SÜTUNUNUN INDEKSİNİ BUL
                    const eloColumnIndex = headerCells.findIndex(cell => cell.id === 'eloShow');
                    const valueColumnIndex = headerCells.findIndex(cell => cell.id === 'valor11Show'); // <-- YENİ

                    if (eloColumnIndex === -1 || valueColumnIndex === -1) { // <-- GÜNCELLENDİ
                        reject('ELO veya Değer sütunu sayfada bulunamadı.');
                        return;
                    }

                    Array.from(rows).slice(0, 100).forEach((row, index) => {
                        try {
                            const teamLink = row.cells[2]?.querySelector('a');
                            const eloCell = row.cells[eloColumnIndex];
                            const valueCell = row.cells[valueColumnIndex]; // <-- YENİ
                            const mzLink = row.querySelector('a[href*="managerzone.com"]');

                            if (teamLink && mzLink && eloCell && valueCell) { // <-- GÜNCELLENDİ
                                const teamIdMatch = mzLink.href.match(/tid=(\d+)/);
                                const eloValue = parseFloat(eloCell.textContent.trim().replace(',', '.'));
                                // DEĞERİ PARSE ET (Örn: "17.493.081" -> 17493081)
                                const value = parseInt(valueCell.textContent.trim().replace(/\./g, ''), 10); // <-- YENİ

                                teamsData.push({
                                    rank: index + 1,
                                    team: teamLink.textContent.trim(),
                                    teamId: teamIdMatch ? teamIdMatch[1] : null,
                                    elo: isNaN(eloValue) ? 0 : eloValue,
                                    value: isNaN(value) ? 0 : value // <-- YENİ
                                });
                            }
                        } catch (e) { console.error(`Satır ${index + 1} işlenirken hata oluştu, atlanıyor:`, e); }
                    });
                    resolve(teamsData);
                } else { reject('Statsxente sunucusundan geçerli bir yanıt alınamadı. (Status: ' + response.status + ')'); }
            },
            onerror: () => reject('Statsxente verisi çekilirken bir ağ hatası oluştu.'),
            ontimeout: () => reject('Statsxente sunucusundan veri çekme işlemi zaman aşımına uğradı.')
        });
    });

    // Bu fonksiyondaki federasyon çekme mantığı kaldırıldığı için bu kısmı silebiliriz.
    // Artık federasyon bilgisi birleştirme sonrası tek seferde çekilecek.
    return initialTeamsData;
}

   /**
 * Statsxente'den Top 11 Değerine göre sıralanmış ilk 100 takımı çeker.
 * GÜNCELLENDİ: Artık her takım için ELO Puanını da çekiyor.
 */
async function fetchTop100ValueTeams(progressBar) {
    const url = 'https://statsxente.com/MZ1/Functions/lecturaEquipos2.0.php?noheader=true&idioma=TURKISH&divisa=EUR&eloButtonType=2&eloButtonCat=SENIOR&idJugador=&idEquipo=&idLiga=&pais=&division=&fechMin=2019-10-10&fechMax=2100-10-10&fechMax=2100-10-10&edadMin=15&edadMax=45&salarioMin=0&salarioMax=1000000&valorMin=0&valorMax=30000000000000&valor23Min=0&valor23Max=30000000000000&valor21Min=0&valor21Max=30000000000000&valor18Min=0&valor18Max=30000000000000&valorNoNacMin=0&valorNoNacMax=30000000000000&equipo=&limite=100&ordenar=valor11&numJugadores=0&valor11=1&valor=1&valor23=0&valor21=0&valor18=0&salario=0&edad=0&valor11_23=0&valor11_21=0&valor11_18=0&noNac=0&edadTop11=0&edadSenior=0&valorUPSenior=1&valorUPSUB23=0&valorUPSUB21=0&valorUPSUB18=0&elo=1&usuario=&elo21=&elo23=&elo18=&liga_world=0&liga_world23=0&liga_world21=0&liga_world18=0&liga_juv23=0&liga_juv21=0&liga_juv18=0';

    progressBar.style.width = '10%';
    progressBar.textContent = 'Statsxente Top 11 Değer sıralaması çekiliyor...';

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { "Referer": "https://statsxente.com/MZ1/View/filtroEquipos.php" },
            timeout: 30000,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const rows = doc.querySelectorAll('#myTableEquipos tbody tr');
                    const teamsData = [];
                    const headerCells = Array.from(doc.querySelectorAll('#myTableEquipos thead td'));
                    // HEM DEĞER HEM DE ELO SÜTUNUNUN INDEKSİNİ BUL
                    const valueColumnIndex = headerCells.findIndex(cell => cell.id === 'valor11Show');
                    const eloColumnIndex = headerCells.findIndex(cell => cell.id === 'eloShow'); // <-- YENİ

                    if (valueColumnIndex === -1 || eloColumnIndex === -1) { // <-- GÜNCELLENDİ
                        reject('Değer veya ELO sütunu sayfada bulunamadı.');
                        return;
                    }

                    Array.from(rows).slice(0, 100).forEach((row, index) => {
                        try {
                            const teamLink = row.cells[2]?.querySelector('a');
                            const valueCell = row.cells[valueColumnIndex];
                            const eloCell = row.cells[eloColumnIndex]; // <-- YENİ
                            const mzLink = row.querySelector('a[href*="managerzone.com"]');

                            if (teamLink && mzLink && valueCell && eloCell) { // <-- GÜNCELLENDİ
                                const teamIdMatch = mzLink.href.match(/tid=(\d+)/);
                                // DEĞERİ PARSE ET (Örn: "17.493.081" -> 17493081)
                                const value = parseInt(valueCell.textContent.trim().replace(/\./g, ''), 10);
                                // ELO'YU PARSE ET
                                const eloValue = parseFloat(eloCell.textContent.trim().replace(',', '.')); // <-- YENİ

                                teamsData.push({
                                    team: teamLink.textContent.trim(),
                                    teamId: teamIdMatch ? teamIdMatch[1] : null,
                                    value: isNaN(value) ? 0 : value,
                                    elo: isNaN(eloValue) ? 0 : eloValue // <-- YENİ
                                });
                            }
                        } catch (e) { console.error(`Değer listesi satır ${index + 1} işlenirken hata oluştu, atlanıyor:`, e); }
                    });
                    resolve(teamsData);
                } else { reject('Statsxente (Değer) sunucusundan geçerli bir yanıt alınamadı. (Status: ' + response.status + ')'); }
            },
            onerror: () => reject('Statsxente (Değer) verisi çekilirken bir ağ hatası oluştu.'),
            ontimeout: () => reject('Statsxente (Değer) sunucusundan veri çekme işlemi zaman aşımına uğradı.')
        });
    });
}

   /**
 * ManagerZone'un resmi menajer sıralaması sayfasından ilk 100 takımı çeker.
 * GÜNCELLENDİ: Artık takım adını da doğru bir şekilde çekiyor.
 */
async function fetchTop100MzRankingTeams(progressBar) {
    const url = 'https://www.managerzone.com/?p=rank&sub=userrank&cid=0&div=0';

    progressBar.style.width = '10%';
    progressBar.textContent = 'MZ Sıralaması çekiliyor...';

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout: 30000,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const table = doc.getElementById('userRankTable');
                    if (!table) {
                        reject('MZ Sıralama tablosu (#userRankTable) bulunamadı.');
                        return;
                    }

                    const rows = table.querySelectorAll('tbody tr');
                    const teamsData = [];

                    Array.from(rows).slice(0, 100).forEach(row => {
                        try {
                            const rankCell = row.cells[0];
                            // Takım linki 4. hücrede (indeks 3) yer alıyor.
                            const teamLink = row.cells[3]?.querySelector('a');

                            if (rankCell && teamLink) {
                                const teamIdMatch = teamLink.href.match(/tid=(\d+)/);
                                const rank = parseInt(rankCell.textContent.trim(), 10);
                                const teamName = teamLink.textContent.trim(); // Takım adını buradan alıyoruz.

                                if (teamIdMatch && teamName && !isNaN(rank)) {
                                    teamsData.push({
                                        teamId: teamIdMatch[1],
                                        team: teamName, // Çekilen takım adını objeye ekliyoruz.
                                        mzRank: rank
                                    });
                                }
                            }
                        } catch (e) {
                            console.error(`MZ Sıralama satırı işlenirken hata oluştu, atlanıyor:`, e);
                        }
                    });
                    resolve(teamsData);
                } else {
                    reject('MZ Sıralama sayfasından geçerli bir yanıt alınamadı. (Status: ' + response.status + ')');
                }
            },
            onerror: () => reject('MZ Sıralama verisi çekilirken bir ağ hatası oluştu.'),
            ontimeout: () => reject('MZ Sıralama sunucusundan veri çekme işlemi zaman aşımına uğradı.')
        });
    });
}
// =================== YENİ FONKSİYON BİTİŞİ ===================

/**
 * Çekilen ve birleştirilen verileri interaktif bir tabloya dönüştürür.
 * GÜNCELLENDİ: MZ Sıralaması sütunu eklenmiştir.
 */
function renderRankingTable(data, container) {
    container.innerHTML = `
        <div class="ranking-controls">
            <input type="text" id="ranking-search-input" placeholder="Takım, federasyon veya lig adıyla ara...">
            <button id="force-refresh-ranking-btn" class="ranking-analysis-btn" style="background: #337ab7; border-color: #2e6da4; margin-left: auto;">Yenile</button>
            <button id="export-ranking-btn" class="ranking-analysis-btn" style="background: #5cb85c; border-color: #4cae4c;">Excel'e Aktar</button>
        </div>
        <div style="max-height: 60vh; overflow-y: auto;">
            <table id="ranking-analysis-table">
                <thead>
                    <tr>
                        <th data-sort="rank" style="width: 5%;">Sıra</th>
                        <th data-sort="team" style="width: 25%;">Takım Adı</th>
                        <th data-sort="federationName" style="width: 20%;">Federasyon</th>
                        <th data-sort="federationLeague" style="width: 15%;">Federasyon Ligi</th>
                        <th data-sort="mzRank" style="width: 10%; text-align:center;">MZ Sıralama</th>
                        <th data-sort="value" style="width: 13%; text-align:right;">Top 11 Değeri</th>
                        <th data-sort="elo" style="width: 12%; text-align:right;">ELO Puanı</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;

    const tbody = container.querySelector('tbody');
    const searchInput = container.querySelector('#ranking-search-input');
    let currentSort = { column: 'elo', direction: 'desc' };

    const sortAndRender = () => {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredData = data;

        if (searchTerm) {
            filteredData = data.filter(d =>
                d.team.toLowerCase().includes(searchTerm) ||
                d.federationName.toLowerCase().includes(searchTerm) ||
                (d.federationLeague || '').toLowerCase().includes(searchTerm)
            );
        }

        filteredData.sort((a, b) => {
            const col = currentSort.column;
            const direction = currentSort.direction === 'asc' ? 1 : -1;

            const valA = a[col];
            const valB = b[col];

            // Değerlerin var olup olmadığını kontrol et (0, null, undefined olmamalı)
            const aHasValue = !(valA == null || valA === 0);
            const bHasValue = !(valB == null || valB === 0);

            // Kural 1: Değeri olan her zaman değeri olmayandan önce gelir.
            if (aHasValue && !bHasValue) return -1;
            if (!aHasValue && bHasValue) return 1;

            // Kural 2: İkisinin de değeri yoksa veya ikisinin de değeri varsa normal sıralama yap.
            // İkisinin de değeri yoksa, return 0 olur ve sıraları değişmez.
            if (!aHasValue && !bHasValue) return 0;

            // Buraya ulaştıysak, ikisinin de geçerli bir değeri var demektir.
            if (typeof valA === 'number') {
                return (valA - valB) * direction;
            }
            return (valA || '').localeCompare(valB || '') * direction;
        });

        // ELO'ya göre sıralanmış verideki genel sırayı koru
        if (currentSort.column !== 'rank') {
           filteredData.forEach((item, index) => item.rank = index + 1);
        }

        tbody.innerHTML = filteredData.map(t => `
            <tr>
                <td style="text-align:center;">${t.rank}</td>
                <td>
                    ${t.managerUid ? `
                        <a class="messenger-link" href="/?p=messenger&uid=${t.managerUid}" title="Menajere Mesaj Gönder" style="margin-right: 8px; text-decoration: none;">
                            <i class="fa fa-comment-o fa-lg" aria-hidden="true" style="color: #f1c40f;"></i>
                        </a>
                    ` : `
                        <span style="display: inline-block; width: 24px; margin-right: 8px;"></span>
                    `}
                    <a href="/?p=team&tid=${t.teamId}" target="_blank">${t.team}</a>
                </td>
                <td><a href="${t.federationLink}" target="_blank">${t.federationName}</a></td>
                <td><a href="${t.federationLeagueLink}" target="_blank">${t.federationLeague}</a></td>
                <td style="text-align:center;">${t.mzRank || '<i>-</i>'}</td>
                <td style="text-align:right; font-family: monospace;">${t.value ? t.value.toLocaleString('de-DE') + ' €' : '<i>-</i>'}</td>
                <td style="text-align:right; font-weight: bold; color: #f1c40f;">${t.elo ? t.elo.toFixed(2) : '<i>-</i>'}</td>
            </tr>
        `).join('');
    };

    searchInput.addEventListener('input', sortAndRender);

    container.querySelectorAll('th').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.sort;
            if (!column) return;
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                // Değer ve ELO büyükten küçüğe, diğer her şey küçükten büyüğe başlasın
                currentSort.direction = (column === 'elo' || column === 'value') ? 'desc' : 'asc';
            }
            sortAndRender();
        });
    });

    container.querySelector('#force-refresh-ranking-btn').addEventListener('click', () => {
        initializeRankingAnalysis(true);
    });

    container.querySelector('#export-ranking-btn').addEventListener('click', () => {
        const currentDataOnTable = Array.from(tbody.querySelectorAll('tr')).map(tr => {
            const teamLink = tr.cells[1].querySelector('a[href*="tid="]');
            // Hücre indeksleri yeni sütuna göre güncellendi
            return {
                'Sıra': tr.cells[0].textContent.trim(),
                'Takım': teamLink ? teamLink.textContent.trim() : tr.cells[1].textContent.trim(),
                'Federasyon': tr.cells[2].textContent.trim(),
                'Federasyon Ligi': tr.cells[3].textContent.trim(),
                'MZ Sıralaması': tr.cells[4].textContent.trim(), // YENİ
                'Top 11 Değeri (€)': tr.cells[5].textContent.replace(' €', '').replace(/\./g, ''),
                'ELO Puanı': tr.cells[6].textContent.trim()
            };
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(currentDataOnTable);
        // Yeni sütun için genişlik eklendi
        ws['!cols'] = [ {wch:5}, {wch:30}, {wch:30}, {wch:25}, {wch:12}, {wch:20}, {wch:15} ];
        XLSX.utils.book_append_sheet(wb, ws, "Top Takim Analizi");
        XLSX.writeFile(wb, "MZ_Top_Takim_Analizi.xlsx");
    });

    // Başlangıçta genel ELO sırasına göre sırala
    currentSort = { column: 'rank', direction: 'asc' };
    sortAndRender();
}

// --- YENİ EKLENEN SABİT: Tüm Top 100 listesi için kalıcı önbellek anahtarı
const RANKING_DATA_CACHE_KEY = 'ranking_top100_data';

/**
 * Sıralama analizi sürecini başlatan ana fonksiyon.
 * OPTİMİZE EDİLDİ: Gruplu işleme (Batching) ile donma sorunu giderildi.
 */
async function initializeRankingAnalysis(forceRefresh = false) {
    if (rankingAnalysisCache.isFetching) return;

    const modalBody = createRankingAnalysisModal();

    // Önbellek kontrolü
    if (!forceRefresh) {
        const cachedData = GM_getValue(RANKING_DATA_CACHE_KEY, null);
        if (cachedData && (Date.now() - cachedData.timestamp < RANKING_CACHE_DURATION_MS)) {
            rankingAnalysisCache.data = cachedData.data;
            rankingAnalysisCache.timestamp = cachedData.timestamp;
            renderRankingTable(cachedData.data, modalBody);
            return;
        }
    }

    rankingAnalysisCache.isFetching = true;
    const progressBar = document.getElementById('analysis-progress-bar');
    if(document.querySelector('#ranking-analysis-modal-body > p')) {
       document.querySelector('#ranking-analysis-modal-body > p').textContent = 'Sıralama listeleri çekiliyor...';
    }

    try {
        // 1. ADIM: Listeleri çek
        const [eloList, valueList, mzRankList] = await Promise.all([
            fetchTop100EloTeams(progressBar, forceRefresh),
            fetchTop100ValueTeams(progressBar),
            fetchTop100MzRankingTeams(progressBar)
        ]);

        progressBar.style.width = '25%';
        progressBar.textContent = 'Veriler birleştiriliyor...';

        // 2. ADIM: Listeleri Birleştir
        const combinedTeamsMap = new Map();
        const addToMap = (team) => {
            if (!team.teamId) return;
            if (!combinedTeamsMap.has(team.teamId)) {
                combinedTeamsMap.set(team.teamId, { ...team });
            } else {
                const existingTeam = combinedTeamsMap.get(team.teamId);
                if (!existingTeam.elo && team.elo) existingTeam.elo = team.elo;
                if (!existingTeam.value && team.value) existingTeam.value = team.value;
                if (!existingTeam.mzRank && team.mzRank) existingTeam.mzRank = team.mzRank;
            }
        };

        eloList.forEach(addToMap);
        valueList.forEach(addToMap);
        mzRankList.forEach(addToMap);

        const combinedList = Array.from(combinedTeamsMap.values());
        let finalTeamsData = [];

        // ================= DONMA SORUNU ÇÖZÜMÜ: BATCH PROCESSING =================
        // Tüm takımları aynı anda işlemek yerine 5'erli gruplar halinde işliyoruz.
        const BATCH_SIZE = 5; // Aynı anda sadece 5 takım işlenir (Donmayı engeller)
        const totalTeams = combinedList.length;

        for (let i = 0; i < totalTeams; i += BATCH_SIZE) {
            const batch = combinedList.slice(i, i + BATCH_SIZE);

            // Bu gruptaki takımlar için işlemleri başlat
            const batchPromises = batch.map(async (team) => {
                // 1. Federasyon ve Sıralama bilgisini tek istekte çek (Optimize edildi)
                const fedInfo = await fetchTeamFederationInfo(team.teamId, forceRefresh);

                // Eğer ana listede MZ Rank yoksa, sayfa içinden çekilen rank'i kullan
                let currentMzRank = team.mzRank;
                if (typeof currentMzRank !== 'number' && fedInfo.mzRankFromPage) {
                    currentMzRank = fedInfo.mzRankFromPage;
                }

                // 2. ELO Eksikse Çek
                let currentElo = team.elo;
                if (typeof currentElo !== 'number') {
                    currentElo = await fetchTeamEloFromStatsXente(team.teamId, team.team);
                }

                // 3. Değer (Value) Eksikse Çek
                let currentValue = team.value;
                if (typeof currentValue !== 'number' || currentValue <= 0) {
                    currentValue = await fetchTeamStartingXIValue(team.teamId);
                }

                return {
                    ...team,
                    ...fedInfo,
                    mzRank: currentMzRank,
                    elo: currentElo,
                    value: currentValue
                };
            });

            // Bu grubun bitmesini bekle
            const batchResults = await Promise.all(batchPromises);
            finalTeamsData.push(...batchResults);

            // İlerleme çubuğunu güncelle
            const percentComplete = 25 + Math.round(((i + batchResults.length) / totalTeams) * 75);
            progressBar.style.width = `${percentComplete}%`;
            progressBar.textContent = `Analiz ediliyor: ${i + batchResults.length}/${totalTeams}`;

            // Tarayıcının arayüzü güncellemesi ve donmaması için çok kısa bir bekleme (Yielding)
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        // =========================================================================

        // Filtreleme
        finalTeamsData = finalTeamsData.filter(team => (!team.value || team.value >= 12000000) && (team.elo >= 1450) && (team.mzRank <= 11000));

        // Sıralama
        finalTeamsData.sort((a, b) => (b.elo || 0) - (a.elo || 0));
        finalTeamsData.forEach((item, index) => item.rank = index + 1);

        // Kaydetme ve Gösterme
        if (finalTeamsData.length > 0) {
            GM_setValue(RANKING_DATA_CACHE_KEY, { data: finalTeamsData, timestamp: Date.now() });
            rankingAnalysisCache.data = finalTeamsData;
            rankingAnalysisCache.timestamp = Date.now();
            renderRankingTable(finalTeamsData, modalBody);
        } else {
            modalBody.innerHTML = '<p style="color: #e74c3c; text-align:center;">Yeterli veri toplanamadı.</p>';
        }

    } catch (error) {
        console.error("Sıralama analizi hatası:", error);
        modalBody.innerHTML = `<p style="color: #e74c3c; text-align:center;">Bir hata oluştu: ${error}</p>`;
    } finally {
        rankingAnalysisCache.isFetching = false;
    }
}


/**
 * Sıralama Analizi butonunu oluşturan fonksiyon.
 */
function createRankingAnalysisButton() {
    const button = document.createElement('button');
    button.className = 'ranking-analysis-btn';
    button.textContent = 'Sıralama Analizi';
    // --- GÜNCELLEME: Artık tıklandığında varsayılan (önbelleği kullanan) davranışı tetikler.
    button.addEventListener('click', () => initializeRankingAnalysis(false));
    return button;
}

    // ====================================================================================
// BÖLÜM 11: MENAJER SIRALAMA SAYFASINA MESSENGER İKONU EKLEME (HIZLANDIRILMIŞ)
// ====================================================================================

/**
 * Menajer sıralaması sayfasındaki tabloya messenger ikonları ekler.
 * İstekleri sıralı göndererek hissedilen performansı artırır.
 */
async function addMessengerIconsToUserRankPage() {
    const rankTable = document.getElementById('userRankTable');
    if (!rankTable) {
        return; // Tablo bulunamazsa işlemi durdur
    }

    // 1. Tablo Başlığını Düzenle (Sadece bir kere yapılır)
    if (!rankTable.querySelector('.messenger-header-col')) {
        const headerRow = rankTable.querySelector('thead tr');
        if (headerRow && headerRow.cells.length > 2) {
            const newTh = document.createElement('th');
            newTh.innerHTML = '&nbsp;'; // Boş başlık
            newTh.style.width = '25px'; // Simge için küçük bir genişlik
            newTh.classList.add('messenger-header-col'); // Tekrar eklenmesini önlemek için işaretle
            headerRow.insertBefore(newTh, headerRow.cells[2]);
        }
    }

    // 2. Tablodaki Her Bir Satırı Sırayla İşle
    const tableRows = rankTable.querySelectorAll('tbody tr');
    for (const row of tableRows) {
        // Eğer satırda zaten ikon hücresi varsa, tekrar ekleme
        if (row.querySelector('.messenger-icon-cell')) continue;

        const newTd = row.insertCell(2);
        newTd.style.textAlign = 'center';
        newTd.style.verticalAlign = 'middle';
        newTd.classList.add('messenger-icon-cell'); // Tekrar eklenmesini önlemek için işaretle

        const teamLink = row.querySelector('a[href*="?p=team&tid="]');
        if (!teamLink) continue;

        const tidMatch = teamLink.href.match(/tid=(\d+)/);
        if (!tidMatch || !tidMatch[1]) continue;

        const teamId = tidMatch[1];

        newTd.innerHTML = '<div class="federation-spinner" style="width:12px;height:12px;margin:auto;"></div>';

        try {
            // "await" sayesinde bir sonraki satıra geçmeden bu takımın bilgisinin gelmesini bekler
            const info = await fetchTeamFederationInfo(teamId);

            if (info && info.managerUid) {
                newTd.innerHTML = `
                    <a class="messenger-link" href="/?p=messenger&uid=${info.managerUid}" title="Menajere Mesaj Gönder" style="text-decoration: none;">
                        <i class="fa fa-comment-o fa-lg" aria-hidden="true" style="color: #3498db;"></i>
                    </a>`;
            } else {
                newTd.innerHTML = ''; // UID yoksa hücreyi temizle
            }
        } catch (error) {
            console.error(`Menajer UID'si çekilirken hata (TID: ${teamId}):`, error);
            newTd.textContent = 'X';
        }
    }
}

// Bu kod bloğunun sadece menajer sıralaması sayfasında çalışmasını sağla
if (window.location.search.includes('p=rank&sub=userrank')) {
    // Betik zaten "document-idle" anında çalıştığı için tablo hazır olacaktır.
    addMessengerIconsToUserRankPage();
}

})();