// ==UserScript==
// @name         MZ - Federasyon Çatışma Maçları
// @namespace    nicotin
// @version      5.5
// @description  Kendi federasyonunuz ve rakip federasyonun son maçlarını getirir, ev sahibi (kendi fed) ve deplasman (rakip) maç istatistiklerini gösterir ve Excel ve jpeg aktarır (XLSX formatı). Dil seçenekleri eklendi (TR, EN, ES).
// @author       alex66
// @match        https://www.managerzone.com/?p=federations&sub=clash
// @icon         https://flagcdn.com/16x12/tr.png
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://unpkg.com/nprogress@0.2.0/nprogress.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @resource     NPROGRESS_CSS https://unpkg.com/nprogress@0.2.0/nprogress.css
// @resource     latestFedClashMatchesStyles https://u18mz.vercel.app/mz/userscript/other/latestFedClashMatches.css
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536199/MZ%20-%20Federasyon%20%C3%87at%C4%B1%C5%9Fma%20Ma%C3%A7lar%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/536199/MZ%20-%20Federasyon%20%C3%87at%C4%B1%C5%9Fma%20Ma%C3%A7lar%C4%B1.meta.js
// ==/UserScript==

// -------------------- KULLANICI ID KONTROLÜ BAŞLANGICI --------------------
const USER_DATABASE = [
    { id: 3111770, user: "alex66",          team: "Fenerbahçe" },
    { id: 3491819, user: "srknk3",  team: "Osmanlı İmparatorluğu" },
    { id: 3917106, user: "serkancan78",  team: "MaviAteşSK" },
    { id: 2958284, user: "kaka17",        team: "Blue Mountain State" },
    { id: 3913870, user: "fboguz94",        team: "SAFRANBOLU ⚜️" },
    { id: 8282764, user: "vospinac",        team: "Club Ibiza" },
    { id: 8567102, user: "ibrahimkerdige",  team: "1stanbuL FootbaLL CluB" },
    { id: 3105279, user: "demrespor",        team: "BATMAN SK" },
    { id: 7524111, user: "rebellious",        team: "- JOKER -" },
    { id: 2475273, user: "turkishfootballer",        team: "XL-Azrail Team" },
    { id: 5732750, user: "jonher",        team: "Vikingos FC" },
    { id: 7568168, user: "matem05",        team: "!MUŞRUF F.C 05!" },
    { id: 3146846, user: "gorkem1",        team: "Büyükada Commandos" },
    { id: 3231868, user: "gurkan170",        team: "Thracia59" },
    { id: 8440444, user: "mutlug",        team: "Sarı kaya FK" },
    { id: 8577497, user: "douglaskampl",        team: "E195-E2 PH-NXZ" },
    { id: 1194128, user: "cowboy84",        team: "AC DeMiRHaN" },
    { id: 7708777, user: "perinn",        team: "SaHNoYaN HuN TüRK•iCON" },
    // Yeni kişi eklerken aşağıdaki satırı kopyalayıp bilgileri değiştirin:
    // { id: 1234567, user: "Yeni Kişi",     team: "Yeni Takım" },
];

// Bu satır, yukarıdaki listeden sadece ID'leri çeker ve betiğin çalışmasını sağlar.
// Buraya dokunmanıza gerek yoktur.
const ALLOWED_USER_IDS = USER_DATABASE.map(u => u.id);

async function getLoggedInUserIdForAuth() {
    const usernameElement = document.getElementById('header-username');
    if (!usernameElement) {
        console.warn("MZ - Federasyon Çatışma Maçları Türkiye (Yetkilendirme): Kullanıcı adı elementi ('header-username') bulunamadı.");
        return null;
    }
    const username = usernameElement.textContent.trim();
    if (!username) {
        console.warn("MZ - Federasyon Çatışma Maçları Türkiye (Yetkilendirme): Kullanıcı adı alınamadı.");
        return null;
    }

    try {
        const response = await fetch(`https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${encodeURIComponent(username)}`);
        if (!response.ok) {
            console.warn(`MZ - Federasyon Çatışma Maçları Türkiye (Yetkilendirme): '${username}' için yönetici verileri alınamadı, HTTP durum: ${response.status}`);
            return null;
        }
        const text = await response.text();
        const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        const userData = xmlDoc.querySelector('UserData');
        const userIdAttr = userData ? userData.getAttribute('userId') : null;

        if (userIdAttr) {
            return parseInt(userIdAttr, 10);
        } else {
            const pError = xmlDoc.querySelector('parsererror');
            if (pError) {
                console.error('MZ - Federasyon Çatışma Maçları Türkiye (Yetkilendirme): XML parse hatası:', pError.textContent);
            } else {
                console.warn(`MZ - Federasyon Çatışma Maçları Türkiye (Yetkilendirme): '${username}' için XML'den userId ayrıştırılamadı.`);
            }
            return null;
        }
    } catch (error) {
        console.error(`MZ - Federasyon Çatışma Maçları Türkiye (Yetkilendirme): '${username}' için yönetici verileri alınırken hata:`, error);
        return null;
    }
}
// -------------------- KULLANICI ID KONTROLÜ BİTİŞİ ----------------------

(async function () {
    'use strict';

    const loggedInUserId = await getLoggedInUserIdForAuth();

    if (loggedInUserId === null || !ALLOWED_USER_IDS.includes(loggedInUserId)) {
        console.warn(`MZ - Federasyon Çatışma Maçları Türkiye: Kullanıcı (ID: ${loggedInUserId || 'Bilinmiyor'}) bu betiği kullanma yetkisine sahip değil.`);
        const unauthorizedMsgDiv = document.createElement('div');
        unauthorizedMsgDiv.id = 'fcm-unauthorized-msg';
        unauthorizedMsgDiv.textContent = 'MZ - Federasyon Çatışma Maçları Türkiye: Bu betiği kullanma yetkiniz bulunmamaktadır.';
        unauthorizedMsgDiv.style.cssText = 'position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background-color: #FFB612; color: #041E42; padding: 15px; border-radius: 8px; z-index: 20000; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid #041E42; text-align: center;';
        setTimeout(() => {
            document.body.appendChild(unauthorizedMsgDiv);
        }, 500);
        setTimeout(() => {
            if (document.getElementById('fcm-unauthorized-msg')) document.getElementById('fcm-unauthorized-msg').remove();
        }, 10000);
        return;
    }
    console.log(`MZ - Federasyon Çatışma Maçları Türkiye: Yetkili kullanıcı (ID: ${loggedInUserId}). Betik devam ediyor.`);

    const CLOG = {
        '1.3': ['Federasyonda oynayan tüm takımların istatistikte gösterimi sağlandı'],
    };

    const CUR_VER = GM_info.script.version;
    const LSV_KEY = 'lastSeenVersion_FederasyonCatismaTR';
    const LSL_KEY = 'lastSelectedLanguage_FederasyonCatismaTR';
    const OLD_S_VER = '6.2';
    const GM_S_VER = GM_getValue('scriptVersion', '0');

    const TRANSLATION_STRINGS = {
        "scriptUpdatePopupTitle": { "tr": "Betik Güncellendi!", "en": "Script Updated!", "es": "¡Script Actualizado!" },
        "scriptUpdatePopupMessage": { "tr": "<b>MZ - Federasyon Çatışma Maçları Türkiye</b> betiği <strong>%oldVer%</strong> sürümünden <strong>%newVer%</strong> sürümüne güncellendi.", "en": "<b>MZ - Federation Clash Matches Turkey</b> script has been updated from version <strong>%oldVer%</strong> to <strong>%newVer%</strong>.", "es": "El script <b>MZ - Partidos de Choque de Federaciones Turquía</b> ha sido actualizado de la versión <strong>%oldVer%</strong> a la <strong>%newVer%</strong>." },
        "scriptUpdatePopupChangesTitle": { "tr": "Sürüm %ver% Değişiklikleri:", "en": "Version %ver% Changes:", "es": "Cambios de la Versión %ver%:" },
        "scriptUpdatePopupNoChanges": { "tr": "Bu sürüm için değişiklik listesi bulunamadı.", "en": "Changelog not found for this version.", "es": "No se encontró el registro de cambios para esta versión." },
        "scriptUpdatePopupUnderstandButton": { "tr": "Anladım", "en": "Understood", "es": "Entendido" },
        "progressStatusCheckingFedData": { "tr": "Federasyon verileri kontrol ediliyor...", "en": "Checking federation data...", "es": "Comprobando datos de la federación..." },
        "progressStatusLoadingCache": { "tr": "Önbellekten veri yükleniyor...", "en": "Loading data from cache...", "es": "Cargando datos desde caché..." },
        "progressStatusCacheLoaded": { "tr": "Veriler önbellekten başarıyla yüklendi!", "en": "Data successfully loaded from cache!", "es": "¡Datos cargados exitosamente desde caché!" },
        "progressStatusCacheFail": { "tr": "Önbellek yüklenemedi, veriler yeniden alınıyor...", "en": "Cache could not be loaded, refetching data...", "es": "No se pudo cargar el caché, recuperando datos..." },
        "progressStatusUpdatingData": { "tr": "Veriler güncelleniyor...", "en": "Updating data...", "es": "Actualizando datos..." },
        "progressStatusParsingScheduleOpponent": { "tr": "Takvim verileri (rakip/geçmiş) ayrıştırılıyor...", "en": "Parsing schedule data (opponent/past)...", "es": "Analizando datos del calendario (oponente/pasado)..." },
        "progressStatusLoadingOwnFedMembers": { "tr": "Kendi federasyon üyeleri yükleniyor...", "en": "Loading own federation members...", "es": "Cargando miembros de la propia federación..." },
        "progressStatusLoadingOpponentFedMembers": { "tr": "Rakip federasyon üyeleri yükleniyor...", "en": "Loading opponent federation members...", "es": "Cargando miembros de la federación oponente..." },
        "progressStatusLoadingOpponentClashMatches": { "tr": "Rakip çatışma maçları yükleniyor...", "en": "Loading opponent clash matches...", "es": "Cargando partidos de choque del oponente..." },
        "progressStatusLoadingAllPastFedClashes": { "tr": "TÜM geçmiş federasyon çatışmaları yükleniyor...", "en": "Loading ALL past federation clashes...", "es": "Cargando TODOS los choques de federaciones pasados..." },
        "progressStatusLoadingFixture": { "tr": "Fikstür yükleniyor...", "en": "Loading fixture...", "es": "Cargando calendario..." },
        "progressStatusRoundOpponentMatches": { "tr": "%round% turundaki rakip maçları yükleniyor...", "en": "Loading opponent matches for round %round%...", "es": "Cargando partidos del oponente para la ronda %round%..." },
        "progressStatusRoundOwnMatches": { "tr": "%round% turundaki maçlar yükleniyor (Tüm Kendi Maçları)...", "en": "Loading matches for round %round% (All Own Matches)...", "es": "Cargando partidos para la ronda %round% (Todos los Partidos Propios)..." },
        "progressStatusDataReady": { "tr": "Veriler hazır!", "en": "Data ready!", "es": "¡Datos listos!" },
        "progressStatusError": { "tr": "Hata: %message%", "en": "Error: %message%", "es": "Error: %message%" },
        "mainModalTitle": { "tr": "Önceki Çatışma Maçları", "en": "Previous Clash Matches", "es": "Partidos de Choque Anteriores" },
        "mainModalUserLabel": { "tr": "Kullanıcı:", "en": "User:", "es": "Usuario:" },
        "mainModalAwayOnlyLabel": { "tr": "Sadece deplasman", "en": "Away only", "es": "Solo visitante" },
        "opponentDefenseStatsTitle": { "tr": "RAKİP SAVUNMA İSTATİSTİKLERİ", "en": "OPPONENT DEFENSIVE STATISTICS", "es": "ESTADÍSTICAS DEFENSIVAS DEL OPONENTE" },
        "exportExcelButton": { "tr": "EXCEL", "en": "EXCEL", "es": "EXCEL" },
        "exportJpegButton": { "tr": "JPEG", "en": "JPEG", "es": "JPEG" },
        "tableHeaderRank": { "tr": "Sıra", "en": "Rank", "es": "Pos." },
        "tableHeaderRankAbbr": { "tr": "Sıra Numarası", "en": "Rank Number", "es": "Número de Posición" },
        "tableHeaderTeam": { "tr": "Takım", "en": "Team", "es": "Equipo" },
        "tableHeaderMatches": { "tr": "Maç", "en": "Matches", "es": "PJ" },
        "tableHeaderMatchesAbbr": { "tr": "Maç Sayısı", "en": "Number of Matches", "es": "Número de Partidos" },
        "tableHeaderRounds": { "tr": "T", "en": "R", "es": "R" },
        "tableHeaderRoundsAbbr": { "tr": "Katıldığı Tur Sayısı", "en": "Number of Rounds Participated", "es": "Número de Rondas Participadas" },
        "tableHeaderWins": { "tr": "G", "en": "W", "es": "G" },
        "tableHeaderWinsAbbr": { "tr": "Galibiyet Sayısı", "en": "Number of Wins", "es": "Número de Victorias" },
        "tableHeaderDraws": { "tr": "B", "en": "D", "es": "E" },
        "tableHeaderDrawsAbbr": { "tr": "Beraberlik Sayısı", "en": "Number of Draws", "es": "Número de Empates" },
        "tableHeaderLosses": { "tr": "M", "en": "L", "es": "P" },
        "tableHeaderLossesAbbr": { "tr": "Mağlubiyet Sayısı", "en": "Number of Losses", "es": "Número de Derrotas" },
        "tableHeaderPoints": { "tr": "Puan", "en": "Points", "es": "Pts" },
        "tableHeaderPointsAbbr": { "tr": "Kazanılan Puan", "en": "Points Earned", "es": "Puntos Ganados" },
        "tableHeaderTotalPoints": { "tr": "T.P", "en": "T.P", "es": "P.T" },
        "tableHeaderTotalPointsAbbr": { "tr": "Toplam Puan (Kazanılan Puan + Oynanan Maç Sayısı)", "en": "Total Points (Points Earned + Matches Played)", "es": "Puntos Totales (Puntos Ganados + Partidos Jugados)" },
        "tableHeaderAvgPointsPerMatch": { "tr": "O.P", "en": "Avg.P", "es": "P.P" },
        "tableHeaderAvgPointsPerMatchAbbr": { "tr": "Maç Başına Ortalama Puan", "en": "Average Points Per Match", "es": "Promedio de Puntos Por Partido" },
        "tableHeaderSuccessRate": { "tr": "B. %", "en": "S. %", "es": "É. %" },
        "tableHeaderSuccessRateAbbr": { "tr": "Başarı Yüzdesi", "en": "Success Percentage", "es": "Porcentaje de Éxito" },
        "homeStatsModalTitle": { "tr": "Fenerbahçe - Türkiye İstatistikleri", "en": "Fenerbahçe - Turkey Statistics", "es": "Fenerbahçe - Estadísticas de Turquía" },
        "homeStatsOffensiveTitle": { "tr": "HÜCUM İSTATİSTİKLERİ (EV SAHİBİ)", "en": "OFFENSIVE STATISTICS (HOME)", "es": "ESTADÍSTICAS OFENSIVAS (LOCAL)" },
        "homeStatsDefensiveTitle": { "tr": "SAVUNMA İSTATİSTİKLERİ (DEPLASMAN)", "en": "DEFENSIVE STATISTICS (AWAY)", "es": "ESTADÍSTICAS DEFENSIVAS (VISITANTE)" },
        "homeStatsGeneralTitle": { "tr": "GENEL İSTATİSTİKLER (HÜCUM + SAVUNMA)", "en": "GENERAL STATISTICS (OFFENSE + DEFENSE)", "es": "ESTADÍSTICAS GENERALES (OFENSIVA + DEFENSA)" },
        "alertNoStatsToGenerate": { "tr": "Ev ve deplasman istatistikleri oluşturulamadı. Eşleşen takım bulunamadı.", "en": "Home and away statistics could not be generated. No matching teams found.", "es": "No se pudieron generar estadísticas de local y visitante. No se encontraron equipos coincidentes." },
        "errorDisplayingHomeStats": { "tr": "Fenerbahçe - Türkiye istatistiklerini gösterme hatası:", "en": "Error displaying Fenerbahçe - Turkey statistics:", "es": "Error al mostrar las estadísticas de Fenerbahçe - Turquía:" },
        "alertErrorDisplayingStats": { "tr": "İstatistikler gösterilirken bir hata oluştu. Detaylar için konsolu kontrol edin.", "en": "An error occurred while displaying statistics. Check the console for details.", "es": "Ocurrió un error al mostrar las estadísticas. Revisa la consola para más detalles." },
        "matchTacticChangesError": { "tr": "Taktik değişim getirme hatası:", "en": "Error fetching tactic changes:", "es": "Error al obtener cambios de táctica:" },
        "matchTacticChangesNone": { "tr": "Değişiklik bulunamadı", "en": "No changes found", "es": "No se encontraron cambios" },
        "matchTacticChangesUnavailable": { "tr": "Bilgi mevcut değil", "en": "Information not available", "es": "Información no disponible" },
        "matchTacticTimePrefix": { "tr": "Dakika", "en": "Minute", "es": "Minuto" },
        "matchTacticChangedTo": { "tr": "şuna değiştirildi:", "en": "changed to:", "es": "cambiado a:" },
        "matchView2D": { "tr": "2D İzle", "en": "View 2D", "es": "Ver 2D" },
        "matchTacticsButton": { "tr": "Taktikler", "en": "Tactics", "es": "Tácticas" },
        "matchDetailsLink": { "tr": "Maç Detayları", "en": "Match Details", "es": "Detalles del Partido" },
        "fixtureLoading": { "tr": "Fikstür yükleniyor...", "en": "Fixture loading...", "es": "Cargando calendario..." },
        "fixtureTitle": { "tr": "FENERBAHÇE - TÜRKİYE SEZON FİKSTÜRÜ", "en": "FENERBAHÇE - TURKEY SEASON FIXTURE", "es": "FENERBAHÇE - CALENDARIO DE TEMPORADA DE TURQUÍA" },
        "fixtureNoData": { "tr": "Gösterilecek fikstür verisi bulunamadı.", "en": "No fixture data available to display.", "es": "No hay datos de calendario disponibles para mostrar." },
        "fixtureHeaderRoundNo": { "tr": "S.No", "en": "R.No", "es": "No.R" },
        "fixtureHeaderRound": { "tr": "Tur", "en": "Round", "es": "Ronda" },
        "fixtureHeaderRoundDate": { "tr": "Tur Tarihi", "en": "Round Date", "es": "Fecha Ronda" },
        "fixtureHeaderOpponent": { "tr": "Rakip Federasyon", "en": "Opponent Federation", "es": "Federación Oponente" },
        "fixtureHeaderScore": { "tr": "Skor", "en": "Score", "es": "Resultado" },
        "fixtureHeaderLeagueRank": { "tr": "Lig S.", "en": "L.Rank", "es": "Pos.L." },
        "fixtureUnknown": { "tr": "Bilinmiyor", "en": "Unknown", "es": "Desconocido" },
        "fixtureDateUnknown": { "tr": "Tarih bilinmiyor", "en": "Date unknown", "es": "Fecha desconocida" },
        "fixtureAvgScore": { "tr": "Ortalama Skor (Oynanan %count% Maç):", "en": "Average Score (%count% Matches Played):", "es": "Resultado Promedio (%count% Partidos Jugados):" },
        "fixtureDataUnavailable": { "tr": "Fikstür verisi alınamadı veya bulunamadı.", "en": "Fixture data could not be retrieved or found.", "es": "No se pudieron recuperar o encontrar los datos del calendario." },
        "fixtureErrorLoading": { "tr": "Fikstür yüklenirken hata oluştu.", "en": "Error loading fixture.", "es": "Error al cargar el calendario." },
        "errorBasicFedInfo": { "tr": "Temel federasyon bilgileri (seviye/bölüm/ID) sayfadan alınamadı.", "en": "Basic federation info (level/division/ID) could not be retrieved from the page.", "es": "No se pudo recuperar la información básica de la federación (nivel/división/ID) de la página." },
        "errorFetchSchedule": { "tr": "Takvim alınamadı: %status%", "en": "Could not fetch schedule: %status%", "es": "No se pudo obtener el calendario: %status%" },
        "errorInit": { "tr": "Başlatma hatası:", "en": "Initialization error:", "es": "Error de inicialización:" },
        "errorCriticalOnInit": { "tr": "DataExtr başlatılırken kritik hata:", "en": "Critical error during DataExtr initialization:", "es": "Error crítico durante la inicialización de DataExtr:" },
        "buttonSelectStatistics": { "tr": "İSTATİSTİKLERİ SEÇ", "en": "STATS", "es": "ESTADÍSTICAS" },
        "buttonFenerbahceTurkeyStats": { "tr": "FENERBAHÇE - TÜRKİYE İSTATİSTİKLERİ", "en": "FENERBAHÇE - TURKEY STATISTICS", "es": "FENERBAHÇE - ESTADÍSTICAS DE TURQUÍA" },
        "buttonOpponentDefenseStats": { "tr": "RAKİP SAVUNMA İSTATİSTİKLERİ", "en": "OPPONENT DEFENSIVE STATISTICS", "es": "ESTADÍSTICAS DEFENSIVAS DEL OPONENTE" },
        "buttonUpdateAllData": { "tr": "TÜM VERİLERİ GÜNCELLE", "en": "UPDATE ALL DATA", "es": "ACTUALIZAR TODOS LOS DATOS" },
        "buttonConfirmUpdate": { "tr": "GÜNCELLEMEYİ ONAYLA?", "en": "CONFIRM UPDATE?", "es": "¿CONFIRMAR ACTUALIZACIÓN?" },
        "alertUIError": { "tr": "Arayüz hatası oluştu. Lütfen sayfayı yenileyin.", "en": "UI error occurred. Please refresh the page.", "es": "Ocurrió un error en la interfaz. Por favor, actualiza la página." },
        "alertOwnFedDataMissing": { "tr": "Kendi federasyon verileri eksik. Lütfen önce verileri güncelleyin.", "en": "Own federation data is missing. Please update the data first.", "es": "Faltan datos de la propia federación. Por favor, actualiza los datos primero." },
        "alertNoClashData": { "tr": "Gösterilecek federasyon çatışma verisi bulunamadı.", "en": "No federation clash data found to display.", "es": "No se encontraron datos de choques de federaciones para mostrar." },
        "alertOpponentDataMissing": { "tr": "Rakip federasyon verileri veya önceki maçlar eksik.", "en": "Opponent federation data or previous matches are missing.", "es": "Faltan datos de la federación oponente o partidos anteriores." },
        "alertNoPastMatchesOpponent": { "tr": "Bu rakibe karşı geçmiş maç bulunamadı.", "en": "No past matches found against this opponent.", "es": "No se encontraron partidos pasados contra este oponente." },
        "alertScriptErrorStorageManager": { "tr": "Betik hatası: Depo yöneticisi yüklenemedi.", "en": "Script error: Storage manager could not be loaded.", "es": "Error de script: No se pudo cargar el gestor de almacenamiento." },
        "languageLabelTR": { "tr": "Türkçe", "en": "Türkçe", "es": "Türkçe" },
        "languageLabelEN": { "tr": "English", "en": "English", "es": "English" },
        "languageLabelES": { "tr": "Español", "en": "Español", "es": "Español" },
        "languageSwitcherTitle": { "tr": "🌍", "en": "🌍", "es": "🌍" },
        "errorSerializingData": { "tr": "Veri serileştirme hatası", "en": "Data serialization error", "es": "Error de serialización de datos" },
        "errorDeserializingDataMissingFields": { "tr": "Serileştirme çözmede eksik alanlar:", "en": "Missing fields in deserialization:", "es": "Campos faltantes en la deserialización:" },
        "errorDeserializingDataNoData": { "tr": "Serileştirme çözme başarısız: Veri sağlanmadı.", "en": "Deserialization failed: No data provided.", "es": "Falló la deserialización: No se proporcionaron datos." },
        "errorDeserializingGeneric": { "tr": "Serileştirme çözme hatası:", "en": "Deserialization error:", "es": "Error de deserialización:" },
        "errorSerializingMissingInfo": { "tr": "Serileştirme başarısız: fInfo veya actM eksik.", "en": "Serialization failed: fInfo or actM missing.", "es": "Falló la serialización: Falta fInfo o actM." },
        "errorParsingProcessedRounds": { "tr": "İşlenen turları ayrıştırma hatası:", "en": "Error parsing processed rounds:", "es": "Error al analizar rondas procesadas:" },
        "logCacheCleared": { "tr": "Temel önbellek temizlendi.", "en": "Core cache cleared.", "es": "Caché principal borrado." },
        "logAllFedsStored": { "tr": "[YENİ DEPOLAMA] TUM_FEDERASYONLAR'da tüm federasyonlar saklandı:", "en": "[NEW STORAGE] All federations stored in ALL_FEDERATIONS:", "es": "[NUEVO ALMACENAMIENTO] Todas las federaciones almacenadas en TODAS_LAS_FEDERACIONES:" },
        "errorUIInit": { "tr": "Arayüz başlatma hatası:", "en": "UI initialization error:", "es": "Error de inicialización de la interfaz:" },
        "errorAddingStyles": { "tr": "Stil ekleme hatası:", "en": "Error adding styles:", "es": "Error al añadir estilos:" },
        "errorDisplayingAwayStats": { "tr": "Deplasman istatistiklerini gösterme hatası:", "en": "Error displaying away statistics:", "es": "Error al mostrar estadísticas de visitante:" },
        "errorExportExcel": { "tr": "Excel'e aktarma hatası:", "en": "Error exporting to Excel:", "es": "Error al exportar a Excel:" },
        "errorCreatingJPEGGeneralStats": { "tr": "Genel istatistikler JPEG oluşturma hatası:", "en": "Error creating General Statistics JPEG:", "es": "Error al crear JPEG de Estadísticas Generales:" },
        "errorGeneralStatsTableNotFoundJPEG": { "tr": "Genel İstatistikler tablosu JPEG oluşturma için bulunamadı.", "en": "General Statistics table not found for JPEG creation.", "es": "No se encontró la tabla de Estadísticas Generales para la creación de JPEG." },
        "warningGeneralStatsJPEGButtonNotFound": { "tr": "Genel istatistikler JPEG butonu bulunamadı.", "en": "General statistics JPEG button not found.", "es": "No se encontró el botón JPEG de estadísticas generales." },
        "errorSortedTableRenderTbodyNotFound": { "tr": "Sıralanmış tablo render için tbody bulunamadı: #%tableId% tbody", "en": "tbody not found for sorted table render: #%tableId% tbody", "es": "tbody no encontrado para renderizar tabla ordenada: #%tableId% tbody" },
        "errorDisplayMainModal": { "tr": "Ana modalı gösterme hatası:", "en": "Error displaying main modal:", "es": "Error al mostrar modal principal:" },
        "errorProcessingMatchTactics": { "tr": "Maç taktiklerini işleme hatası:", "en": "Error processing match tactics:", "es": "Error al procesar tácticas del partido:" },
        "errorCreatingMatchElement": { "tr": "Maç öğesi oluşturma hatası:", "en": "Error creating match element:", "es": "Error al crear elemento de partido:" },
        "errorRenderingMatches": { "tr": "Maçları render etme hatası:", "en": "Error rendering matches:", "es": "Error al renderizar partidos:" },
        "errorParsingMatch": { "tr": "Maç ayrıştırma hatası:", "en": "Match parsing error:", "es": "Error al analizar partido:" },
        "errorAddingFixturePlaceholder": { "tr": "Fikstür yer tutucusunu eklerken hata (%method%, hedef: %target%):", "en": "Error adding fixture placeholder (%method%, target: %target%):", "es": "Error al añadir marcador de posición del calendario (%method%, objetivo: %target%):" },
        "errorFinalFallbackAppendBody": { "tr": "Final Fallback (body'e ekleme) hatası:", "en": "Final Fallback (appending to body) error:", "es": "Error de Fallback Final (añadiendo al body):" },
        "errorNoValidFixtureContainer": { "tr": "Fikstür yer tutucusunun ekleneceği hiçbir geçerli container bulunamadı.", "en": "No valid container found to add fixture placeholder.", "es": "No se encontró un contenedor válido para añadir el marcador de posición del calendario." },
        "errorFixtureTableRenderContainerNotFound": { "tr": "Fikstür tablosunun render edileceği container bulunamadı.", "en": "Container not found to render fixture table.", "es": "No se encontró el contenedor para renderizar la tabla del calendario." },
        "warningInvalidScoreFormatFixture": { "tr": "Geçersiz skor formatı bulundu: %score% (Tur: %round%)", "en": "Invalid score format found: %score% (Round: %round%)", "es": "Formato de resultado inválido encontrado: %score% (Ronda: %round%)" },
        "errorFixtureRenderCall": { "tr": "[Fikstür Debug] rendFixTbl ÇAĞIRILIRKEN HATA:", "en": "[Fixture Debug] ERROR CALLING rendFixTbl:", "es": "[Depuración Calendario] ERROR AL LLAMAR rendFixTbl:" },
        "errorParsingFixtureOwnFedIdUnknown": { "tr": "Fikstür ayrıştırılamadı: Kendi Federasyon ID'si bilinmiyor.", "en": "Could not parse fixture: Own Federation ID is unknown.", "es": "No se pudo analizar el calendario: ID de Federación Propia desconocido." },
        "errorFetchManagerData": { "tr": "Error fetching manager data for %username%:", "en": "Error fetching manager data for %username%:", "es": "Error al obtener datos del mánager para %username%:" },
        "errorXMLParse": { "tr": "XML parse error for %username%:", "en": "XML parse error for %username%:", "es": "Error de análisis XML para %username%:" },
        "errorProcessingMember": { "tr": "Error processing member %username%:", "en": "Error processing member %username%:", "es": "Error al procesar miembro %username%:" },
        "errorFetchFedMembers": { "tr": "Error fetching federation members for %fedId%:", "en": "Error fetching federation members for %fedId%:", "es": "Error al obtener miembros de la federación para %fedId%:" },
        "errorFetchClashMatches": { "tr": "Error fetching clash matches from %url%:", "en": "Error fetching clash matches from %url%:", "es": "Error al obtener partidos de choque de %url%:" },
        "errorFetchMatchesForClash": { "tr": "Error fetching matches for clash %link%:", "en": "Error fetching matches for clash %link%:", "es": "Error al obtener partidos para el choque %link%:" },
        "scriptErrorGeneric": { "tr": "Betikte bir hata oluştu:", "en": "An error occurred in the script:", "es": "Ocurrió un error en el script:" },
        "tooltipOpponentMatchesTitle": { "tr": "%fedName% Maçları:", "en": "%fedName%'s Matches:", "es": "Partidos de %fedName%:" },
        "tooltipNoData": { "tr": "Bu federasyon için detaylı maç verisi mevcut değil.", "en": "No detailed match data available for this federation.", "es": "No hay datos detallados de partidos disponibles para esta federación." },
        "tooltipVsOpponent": { "tr": "%oppName% ile", "en": "vs %oppName%", "es": "vs %oppName%" },
        "tooltipScoreFormat": { "tr": "Skor: %own% - %opp%", "en": "Score: %own% - %opp%", "es": "Resultado: %own% - %opp%" },
        "tooltipHomeIndicator": { "tr": "(E)", "en": "(H)", "es": "(L)" },
        "tooltipAwayIndicator": { "tr": "(D)", "en": "(A)", "es": "(V)" },
        "tooltipMatchDetailsIcon": { "tr": "📋", "en": "📋", "es": "📋" },
        "tooltipUnknownOpponent": { "tr": "Bilinmeyen Rakip", "en": "Unknown Opponent", "es": "Oponente Desconocido" },
        "alertScriptErrorConsole": { "tr": "Betikte bir hata oluştu. Lütfen konsolu kontrol edin.", "en": "An error occurred in the script. Please check the console.", "es": "Ocurrió un error en el script. Por favor, revisa la consola." },
        "tableHeaderAvgGoalsScored": { "tr": "A.G.O", "en": "Avg.GS", "es": "P.GF" },
        "tableHeaderAvgGoalsScoredAbbr": { "tr": "Maç Başına Ortalama Atılan Gol", "en": "Average Goals Scored Per Match", "es": "Promedio de Goles Anotados por Partido" },
        "tableHeaderAvgGoalsConceded": { "tr": "Y.G.O", "en": "Avg.GC", "es": "P.GC" },
        "tableHeaderAvgGoalsConcededAbbr": { "tr": "Maç Başına Ortalama Yenilen Gol", "en": "Average Goals Conceded Per Match", "es": "Promedio de Goles Recibidos por Partido" },
    };

    const U = {
        C: 'https://www.managerzone.com/?p=federations&sub=clash',
        T: (lv, dv) => `https://www.managerzone.com/ajax.php?p=federations&sub=schedule&level=${lv}&div=${dv}&sport=soccer`,
        F: fId => `https://www.managerzone.com/?p=federations&fid=${fId}`,
        MD: uName => `https://www.managerzone.com/xml/manager_data.php?sport_id=1&username=${uName}`,
        MS: mId => `https://www.managerzone.com/matchviewer/getMatchFiles.php?type=stats&mid=${mId}&sport=soccer`,
    };

    class SM {
        static K = {
            CS: 'guncelSezon',
            FD: 'federasyonVeri',
            PT: 'islenenTurlar',
            AF: 'tumFederasyonlar',
        };

        static srlz(st) {
            try {
                const fd = {
                    lu: new Date().toISOString(),
                    f: {
                        i: st.fInfo.ownFid || null,
                        lv: st.fInfo.divLvl || null,
                        dv: st.fInfo.divNum || null,
                        at: st.fInfo.actRnd || null,
                    },
                    o: {
                        i: st.actM.opId || null,
                        n: st.actM.opName || null,
                        km: (st.actM.keyMbrs || []).map(m => ({
                            un: m.un,
                            ui: m.ui,
                            tm: { n: m.tmName, i: m.tmId },
                        })),
                    },
                    okm: (st.ownKeyMbrs || []).map(m => ({
                        un: m.un,
                        ui: m.ui,
                        tm: { n: m.tmName, i: m.tmId },
                    })),
                    ch: (st.actM.prevClashData || []).map(c => ({
                        r: c.r,
                        lk: c.lk,
                        sc: c.sc,
                        oh: c.oh,
                        m: (c.m || []).map(g => ({
                            ts: g.ts,
                            sc: g.sc,
                            lk: g.lk,
                        })),
                    })),
                    kf: Array.from(st.allFeds || new Map()).map(([i, n]) => ({ i, n })),
                    ac: (st.allFedClashData || []).map(c => ({
                        r: c.r,
                        lk: c.lk,
                        sc: c.sc,
                        oh: c.oh,
                        m: (c.m || []).map(g => ({
                            ts: g.ts,
                            sc: g.sc,
                            lk: g.lk,
                        })),
                    })),
                    sf: st.sFixture || [],
                    lt: (st.leagueTable || []).map(ltEntry => ({ ...ltEntry })),
                    afm: Array.from(st.allFederationMatches || new Map()).map(([fedId, matches]) => ({ fedId, matches })),
                };
                return JSON.stringify(fd, null, 2);
            } catch (e) {
                console.error(UI.getTranslatedText('errorSerializingGeneric'), e);
                return null;
            }
        }

        static dsrlz(js) {
            if (!js) {
                console.error(UI.getTranslatedText('errorDeserializingDataNoData'));
                return null;
            }
            try {
                const d = JSON.parse(js);
                const st = new FedState();
                const reqFlds = ['f', 'o', 'ch', 'kf'];
                const misFlds = reqFlds.filter(f => !d[f]);
                if (misFlds.length > 0) {
                    console.error(UI.getTranslatedText('errorDeserializingDataMissingFields'), misFlds.join(', '));
                    return null;
                }
                st.fInfo = {
                    ownFid: d.f?.i,
                    divLvl: d.f?.lv,
                    divNum: d.f?.dv,
                    actRnd: d.f?.at,
                };
                st.ownKeyMbrs = (d.okm || []).map(m => ({
                    un: m.un,
                    ui: m.ui,
                    tmName: m.tm?.n,
                    tmId: m.tm?.i,
                }));
                st.actM = {
                    opId: d.o?.i,
                    opName: d.o?.n,
                    keyMbrs: (d.o?.km || []).map(m => ({
                        un: m.un,
                        ui: m.ui,
                        tmName: m.tm?.n,
                        tmId: m.tm?.i,
                    })),
                    prevClashData: d.ch.map(c => ({
                        r: c.r,
                        lk: c.lk,
                        sc: c.sc,
                        oh: c.oh,
                        m: (c.m || []).map(g => ({
                            ts: g.ts,
                            sc: g.sc,
                            lk: g.lk,
                        })),
                    })),
                };
                st.allFeds = new Map(d.kf?.map(f => [f.i, f.n]) || []);
                st.allFedClashData = (d.ac || []).map(c => ({
                    r: c.r,
                    lk: c.lk,
                    sc: c.sc,
                    oh: c.oh,
                    m: (c.m || []).map(g => ({
                        ts: g.ts,
                        sc: g.sc,
                        lk: g.lk,
                    })),
                }));
                st.sFixture = d.sf || [];
                st.leagueTable = (d.lt || []).map(ltEntry => ({ ...ltEntry }));
                st.allFederationMatches = new Map((d.afm || []).map(item => [String(item.fedId), item.matches]));

                return st;
            } catch (e) {
                console.error(UI.getTranslatedText('errorDeserializingGeneric'), e);
                return null;
            }
        }

        static async sv(st) {
            const srlzD = this.srlz(st);
            if (!srlzD) {
                throw new Error(UI.getTranslatedText('errorSerializingData'));
            }
            GM_setValue(this.K.FD, srlzD);
            return true;
        }

        static async ld() {
            const srlzD = GM_getValue(this.K.FD);
            if (!srlzD) return null;
            return this.dsrlz(srlzD);
        }

        static gcs() {
            return GM_getValue(this.K.CS);
        }

        static scs(s) {
            GM_setValue(this.K.CS, s);
        }

        static gpt() {
            try {
                return JSON.parse(GM_getValue(this.K.PT, '[]'));
            } catch (e) {
                console.error(UI.getTranslatedText('errorParsingProcessedRounds'), e);
                return [];
            }
        }

        static apt(r) {
            const rs = this.gpt();
            if (!rs.includes(r)) {
                rs.push(r);
                GM_setValue(this.K.PT, JSON.stringify(rs));
            }
        }

        static cpt() {
            GM_setValue(this.K.PT, '[]');
        }

        static co() {
            GM_setValue(this.K.FD, null);
            GM_setValue(this.K.CS, null);
            this.cpt();
            console.log(UI.getTranslatedText('logCacheCleared'));
        }

        static saf(fa) {
            GM_setValue(this.K.AF, JSON.stringify(fa));
            console.log(UI.getTranslatedText('logAllFedsStored'), fa);
        }

        static gaf() {
            const d = GM_getValue(this.K.AF);
            return d ? JSON.parse(d) : [];
        }
    }

    const UI = {
        statEl: null,
        mainMdl: null,
        opKeyMbrs: null,
        ownKeyMbrs: null,
        prevClashes: null,
        allFedClashes: null,
        keyMbrs: null,
        tacCache: {},
        _currentLang: GM_getValue(LSL_KEY, 'tr'),
        opponentTooltipElement: null,

        opponentDefensiveStats: [], // Rakip savunma istatistiklerini burada saklayacağız

        _starSortOrder: 'desc', // Sıralama yönünü takip eder: 'desc' (azalan) veya 'asc' (artan)

        sortTeamsByStars() {
            const table = document.querySelector('table.hitlist.challenges-list');
            if (!table) return;

            const tbody = table.querySelector('tbody');
            // tbody içindeki tüm satırları (tr) al
            const rows = Array.from(tbody.querySelectorAll('tr'));

            // Satırları, sakladığımız 'data-defensive-success' değerine göre sırala
            rows.sort((a, b) => {
                const valA = parseFloat(a.dataset.defensiveSuccess || 0);
                const valB = parseFloat(b.dataset.defensiveSuccess || 0);

                if (this._starSortOrder === 'desc') {
                    return valB - valA; // Büyükten küçüğe sırala
                } else {
                    return valA - valB; // Küçükten büyüğe sırala
                }
            });

            // Sıralanmış satırları tekrar tabloya ekle
            rows.forEach(row => tbody.appendChild(row));

            // Bir sonraki tıklama için sıralama yönünü tersine çevir
            this._starSortOrder = this._starSortOrder === 'desc' ? 'asc' : 'desc';

            // Başlıktaki ikonu güncelle
            const teamHeader = table.querySelector('th');
            const icon = teamHeader.querySelector('.sort-icon');
            if (icon) {
                icon.className = 'fas sort-icon'; // İkon sınıflarını sıfırla
                if (this._starSortOrder === 'asc') { // Not: Bu durum *bir sonraki* tıklama için geçerlidir
                    icon.classList.add('fa-sort-up');
                } else {
                    icon.classList.add('fa-sort-down');
                }
            }
        },

        createStarRatingHTML(percentageString) {
            const percentage = parseFloat(percentageString);
            if (isNaN(percentage)) return '';

            // Puanı 0-5 arası bir değere çevirip en yakın yarıma yuvarla
            const roundedStars = Math.round(((percentage / 100) * 5) * 2) / 2;
            const fullStars = Math.floor(roundedStars);
            const halfStar = (roundedStars % 1) !== 0 ? 1 : 0;
            const emptyStars = 5 - fullStars - halfStar;

            let starsHTML = `<span class="defensive-stars" title="Savunma Başarısı: ${percentage}%">`;
            for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
            if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
            for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';
            starsHTML += '</span>';

            return starsHTML;
        },

        injectStarRatings() {
            if (!this.opponentDefensiveStats || this.opponentDefensiveStats.length === 0) {
                console.log("Yıldızları eklemek için rakip savunma istatistikleri bulunamadı.");
                return;
            }

            const statsMap = new Map(this.opponentDefensiveStats.map(stat => [stat.tmName, stat]));

            // Ana çatışma listesindeki takım isimlerini seç
            document.querySelectorAll('table.hitlist.challenges-list .team-name').forEach(teamEl => {
                // Eğer yıldızlar zaten eklenmişse tekrar ekleme
                if (teamEl.parentElement.querySelector('.defensive-stars')) return;

                const teamName = teamEl.textContent.trim();
                const teamStats = statsMap.get(teamName);

                if (teamStats) {
                    const starsHTML = this.createStarRatingHTML(teamStats.basariOrani);
                    teamEl.insertAdjacentHTML('afterend', starsHTML);

                    // ÖNEMLİ: Sıralama için veriyi takımın bulunduğu satıra (tr) ekle
                    const parentRow = teamEl.closest('tr');
                    if (parentRow) {
                        parentRow.dataset.defensiveSuccess = teamStats.basariOrani;
                    }
                }
            });
            // YENİ: "Takım" başlığına tıklama özelliğini ekle
            const teamHeader = document.querySelector('table.hitlist.challenges-list th');
            if (teamHeader && teamHeader.textContent.trim() === 'Takım') {
                teamHeader.style.cursor = 'pointer';
                teamHeader.title = 'Savunma gücüne göre sırala';

                // Başlığa bir sıralama ikonu ekle (eğer daha önce eklenmemişse)
                if (!teamHeader.querySelector('.sort-icon')) {
                    teamHeader.innerHTML += ' <i class="fas fa-sort sort-icon"></i>';
                }

                // Birden fazla listener eklemeyi önlemek için kontrol
                if (!teamHeader.hasAttribute('data-listener-added')) {
                    teamHeader.addEventListener('click', () => this.sortTeamsByStars());
                    teamHeader.setAttribute('data-listener-added', 'true');
                }
            }
        },

        getTranslatedText(key, params = {}) {
            let txt = TRANSLATION_STRINGS[key]?.[this._currentLang] || TRANSLATION_STRINGS[key]?.['tr'] || key;
            for (const pKey in params) {
                txt = txt.replace(`%${pKey}%`, params[pKey]);
            }
            return txt;
        },

        async setLanguage(lang) {
            if (['tr', 'en', 'es'].includes(lang)) {
                this._currentLang = lang;
                GM_setValue(LSL_KEY, lang);
                await this.refreshUIForLanguage();
                console.log(`Language changed to: ${lang}`);
                return true;
            }
            console.warn(`Unsupported language: ${lang}`);
            return false;
        },

        async refreshUIForLanguage() {
            this.updateStaticTexts();
            if (this.mainMdl && this.mainMdl.style.display === 'block') {
                const uSelVal = this.mainMdl.querySelector('#user-select')?.value;
                const awayOnlyVal = this.mainMdl.querySelector('#away-only')?.checked;
                this.mainMdl.remove();
                this.mkMainMdl();
                this.showMainMdl(this.keyMbrs, this.prevClashes, uSelVal);
                if (this.mainMdl.querySelector('#user-select')) this.mainMdl.querySelector('#user-select').value = uSelVal;
                if (this.mainMdl.querySelector('#away-only')) this.mainMdl.querySelector('#away-only').checked = awayOnlyVal;
                this.rendMatches();
            }
            const evModal = document.getElementById('evSahibiIstatistikleriModal');
            if (evModal && evModal.style.display === 'block') {
                const data = evModal.dataset.statData ? JSON.parse(evModal.dataset.statData) : null;
                if (data) await this.showHomeStats(data.km, data.cs, true);
            }
            const awayModal = document.getElementById('deplasmanIstatistikleriModal');
            if (awayModal && awayModal.style.display === 'block') {
                const data = awayModal.dataset.statData ? JSON.parse(awayModal.dataset.statData) : null;
                if (data) this.showAwayStats(data.km, data.pc, true);
            }
            const fixtureContainer = document.getElementById('sezon-fikstur-container');
            if (fixtureContainer && window.dataExtrInstance?.st.sFixture) {
                this.rendFixTbl(window.dataExtrInstance.st.sFixture);
            }
            this.updateButtonTexts();
            this.updatePopupTextsIfVisible();
        },

        updateStaticTexts() {
            const updateText = (selector, textKey, attr = null) => {
                const el = document.querySelector(selector);
                if (el) {
                    const txt = this.getTranslatedText(textKey);
                    if (attr) el.setAttribute(attr, txt);
                    else el.textContent = txt;
                }
            };
            updateText('#progress-status', 'progressStatusCheckingFedData');
            updateText('.fb-main-button > span', 'buttonSelectStatistics');
        },

        updateButtonTexts() {
            const mainBtnContainer = document.querySelector('.fb-selection-container');
            if (mainBtnContainer) {
                mainBtnContainer.remove();
                const newSelBtn = mkSelBtn();
                const tgCont = document.querySelector('.flex-wrap.challenges-options.box_light.padding');
                if (tgCont) {
                    const ffg = tgCont.querySelector('div.flex-grow-1');
                    if (ffg) ffg.insertAdjacentElement('afterend', newSelBtn);
                    else tgCont.appendChild(newSelBtn);
                } else {
                    const mcArea = document.querySelector('#page_federations_clash .mainContent') || document.querySelector('.mainContent') || document.body;
                    mcArea.insertBefore(newSelBtn, mcArea.firstChild);
                }
            }
        },

        updatePopupTextsIfVisible() {
            const popup = document.getElementById('update-popup-modal');
            if (popup && popup.parentElement.style.display !== 'none') {
                const curVer = popup.dataset.curVer;
                const prevVer = popup.dataset.prevVer;
                popup.parentElement.remove();
                this.showUpdPop(curVer, prevVer, CLOG);
            }
        },

        init() {
            try {
                this.addCSS();
                this.mkStatEl();
                this.startProg();
                this.mkMainMdl();
                this.addFixPlace();
                this.addLangSwitcher();
            } catch (e) {
                console.error(this.getTranslatedText('errorUIInit'), e);
            }
        },

        addCSS() {
    try {
        GM_addStyle(GM_getResourceText('NPROGRESS_CSS'));
        GM_addStyle(GM_getResourceText('latestFedClashMatchesStyles'));
        GM_addStyle(`
            /* --- Core Styles (Copied from original) --- */
            :root { --fb-dark-blue: #041E42; --fb-yellow: #FFED00; --fb-light-blue: #1A4FA3; --tr-red: #E30A17; --tr-white: #FFFFFF; }
            #progress-status { position: fixed; top: 10px; left: 10px; background: var(--fb-dark-blue); color: var(--fb-yellow); padding: 10px 15px; border-radius: 6px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-weight: bold; border: 2px solid var(--fb-yellow); font-family: 'Arial', sans-serif; text-transform: uppercase; letter-spacing: 1px; }
            #deplasmanIstatistikleriModal .modal-content, #evSahibiIstatistikleriModal .modal-content, #anaModal .modal-content { background: linear-gradient(135deg, var(--fb-dark-blue) 70%, var(--fb-light-blue) 100%); color: var(--fb-yellow); border-radius: 12px; padding: 25px; box-shadow: 0 8px 24px rgba(0,0,0,0.8); border: 3px solid var(--fb-yellow); position: relative; overflow-y: auto; max-height: 90vh; }
            #deplasmanIstatistikleriModal .modal-content::before, #anaModal .modal-content::before { content: ""; position: absolute; top: -62px; left: -300px; width: 100%; height: 100%; background-image: url('https://media.fenerbahce.org/FB/media/FB/Images/Logo/logo.png?ext=.png'); background-size: 200px; background-repeat: no-repeat; background-position: bottom right; opacity: 1; z-index: -1; pointer-events: none; }
            #evSahibiIstatistikleriModal .modal-content::before, #anaModal .modal-content::before { content: ""; position: absolute; top: -470px; left: -300px; width: 100%; height: 100%; background-image: url('https://media.fenerbahce.org/FB/media/FB/Images/Logo/logo.png?ext=.png'); background-size: 200px; background-repeat: no-repeat; background-position: bottom right; opacity: 1; z-index: -1; pointer-events: none; }

            /* --- BURADAN İTİBAREN DEĞİŞİKLİKLER --- */
            /* SİLİNDİ: Mutlak konumlandırmaya sahip eski buton stilleri kaldırıldı. */
            /* #export-deplasman-jpeg-button { position: absolute; top: -395px; right: -680px; } */
            /* #export-ev-jpeg-button { position: absolute; top: 47px; right: -620px; } */
            /* #export-ev-button { position: absolute; top: 47px; right: -620px; } */

            /* GÜNCELLENDİ: #export-genel-jpeg-button'dan kaymaya neden olan margin ve float kaldırıldı. */
            #export-genel-jpeg-button.export-jpeg-button-class { background: linear-gradient(145deg, var(--fb-yellow) 0%, #FFB612 100%); color: var(--fb-dark-blue); border: none; padding: 7px 14px; border-radius: 8px; cursor: pointer; margin: 0; font-weight: bold; text-transform: uppercase; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all .3s; }
            #export-genel-jpeg-button.export-jpeg-button-class:hover { background: linear-gradient(145deg, #FFB612 0%, var(--fb-yellow) 100%); transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }
            /* --- DEĞİŞİKLİKLERİN SONU --- */

            #genel-stats-table { width: 100%; border-collapse: collapse; margin-top: 1px; font-size: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); border: 2px solid var(--fb-yellow); background-color: rgba(4,30,66,0.7); }
            #genel-stats-table th, #ev-stats-table th, #ev-deplasman-stats-table th, #deplasman-stats-table th {
    padding: 1px;
    text-align: center;
    background-color: var(--fb-dark-blue);
    color: var(--fb-yellow);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid var(--fb-yellow);
}
            #genel-stats-table td { padding: 1px; text-align: center; background-color: rgba(10,40,80,0.7); color: var(--tr-white); border-bottom: 1px solid rgba(255,237,0,0.3); }
            #genel-stats-table tr:hover td { background-color: var(--fb-light-blue); transition: background-color .3s; }
            @media (max-width:768px) { #export-genel-jpeg-button.export-jpeg-button-class { position: static; display: block; float: none; margin-left: auto; margin-right: auto; margin-top: 10px; width: fit-content; padding: 6px 10px; font-size: 10px; } }

            #deplasman-stats-table, #ev-stats-table, #ev-deplasman-stats-table { width: 100%; border-collapse: collapse; margin-top: 1px; font-size: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); border: 2px solid var(--fb-yellow); background-color: rgba(4,30,66,0.7); }
            #deplasman-stats-table td, #ev-stats-table td, #ev-deplasman-stats-table td { padding: 1px; text-align: center; background-color: rgba(10,40,80,0.7); color: var(--tr-white); border-bottom: 1px solid rgba(255,237,0,0.3); }
            #deplasman-stats-table tr:hover td, #ev-stats-table tr:hover td, #ev-deplasman-stats-table tr:hover td { background-color: var(--fb-light-blue); transition: background-color .3s; }
            #deplasman-stats-title, #ev-stats-title, #matches-title {
    font-size: 19px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 15px;
    color: var(--fb-yellow);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
    border-bottom: 3px solid var(--fb-yellow);
    padding-bottom: 10px;
    position: relative;
    letter-spacing: 2px;
    flex-grow: 1; /* BU SATIRI EKLEYİN */
    text-align: center; /* BU SATIRI EKLEYİN */
}
            #export-button, #export-ev-button { background: linear-gradient(145deg, var(--fb-yellow) 0%, #FFB612 100%); color: var(--fb-dark-blue); border: none; padding: 7px 14px; border-radius: 8px; cursor: pointer; /* GÜNCELLENDİ: margin-bottom kaldırıldı çünkü artık flex container içinde */ font-weight: bold; text-transform: uppercase; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all .3s; letter-spacing: 1px; position: relative; overflow: hidden; }
            #export-button:hover, #export-ev-button:hover { background: linear-gradient(145deg, #FFB612 0%, var(--fb-yellow) 100%); transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }
            #export-jpeg-button { background: linear-gradient(145deg, var(--fb-yellow) 0%, #FFB612 100%); color: var(--fb-dark-blue); border: none; padding: 7px 14px; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: uppercase; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all .3s; }
            #export-jpeg-button:hover { background: linear-gradient(145deg, #FFB612 0%, var(--fb-yellow) 100%); transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }

            #export-ev-jpeg-button, #export-deplasman-jpeg-button { background: linear-gradient(145deg, var(--fb-yellow) 0%, #FFB612 100%); color: var(--fb-dark-blue); border: none; padding: 7px 14px; border-radius: 8px; cursor: pointer; /* GÜNCELLENDİ: margin-bottom kaldırıldı */ font-weight: bold; text-transform: uppercase; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all .3s; letter-spacing: 1px; position: relative; overflow: hidden; }
            #export-ev-jpeg-button:hover, #export-deplasman-jpeg-button:hover { background: linear-gradient(145deg, #FFB612 0%, var(--fb-yellow) 100%); transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }

            .fenerbahce-btn::before { content: ""; position: absolute; width: 20px; height: 20px; left: 10px; background-size: contain; background-repeat: no-repeat; }
            .fenerbahce-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.5); }
            .fenerbahce-btn.yenile { background: linear-gradient(135deg, var(--tr-red) 0%, #B00814 100%); color: white; bottom: 10px; border-color: white; }
            .fenerbahce-btn.deplasman { background: linear-gradient(135deg, var(--fb-dark-blue) 0%, var(--fb-light-blue) 100%); color: var(--fb-yellow); bottom: 50px; border-color: var(--fb-yellow); }
            .fenerbahce-btn.ev { background: linear-gradient(135deg, var(--fb-yellow) 0%, #FFB612 100%); color: var(--fb-dark-blue); bottom: 90px; border-color: var(--fb-dark-blue); font-weight: 900; }
            .match-item { background: linear-gradient(135deg, var(--fb-dark-blue) 0%, rgba(26,79,163,0.9) 100%); border: 20px solid var(--fb-yellow); border-radius: 10px; padding: 15px; margin-bottom: 15px; color: white; position: relative; overflow: hidden; }
            .match-item::before { content: "🇹🇷"; position: absolute; top: 5px; right: 5px; font-size: 20px; opacity: .3; pointer-events: none; }
            .match-item a { color: var(--fb-blue); text-decoration: none; font-weight: bold; transition: color .3s; }
            .match-item a:hover { color: #ffb612; text-decoration: underline; }
            .match-item .matchIcon { background: var(--tr-red); padding: 6px 10px; border-radius: 6px; margin-top: 10px; display: inline-block; color: white; transition: all .3s; }
            .match-item .matchIcon:hover { background: #B00814; transform: translateY(-2px); }
            .match-item .tactics-button { background: var(--fb-yellow); color: var(--fb-dark-blue); padding: 6px 10px; border-radius: 20px; margin-left: 10px; display: inline-block; transition: all .3s; }
            .match-item .tactics-button:hover { background: #FFB612; transform: translateY(-2px); }
            #nprogress .bar { background: var(--fb-yellow) !important; height: 4px !important; }
            #nprogress .peg { box-shadow: 0 0 10px var(--fb-yellow), 0 0 5px var(--fb-yellow) !important; }
            #deplasmanIstatistikleriModal .modal-close, #evSahibiIstatistikleriModal .modal-close, #anaModal .modal-close { color: #ff4012; font-size: 32px; font-weight: bold; cursor: pointer; position: absolute; top: 3px; right: 20px; transition: color .3s, transform .3s; z-index: 10; }
            #deplasmanIstatistikleriModal .modal-close:hover, #evSahibiIstatistikleriModal .modal-close:hover, #anaModal .modal-close:hover { color: var(--tr-red); transform: rotate(90deg); }

            /* --- YENİ HİZALAMA KURALLARI EKLENDİ VE GÜNCELLENDİ --- */
            .modal-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    gap: 10px; /* Butonlar ve başlık arasına boşluk ekler */
}

            .modal-header-container .export-buttons {
                margin-bottom: 0;
                display: flex;
                gap: 10px;
            }
            .table-section {
    margin-bottom: 30px;
}
            #evSahibiIstatistikleriModal .table-title,
#deplasmanIstatistikleriModal .table-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--fb-yellow);
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
            #evSahibiIstatistikleriModal .baslik-container { margin-bottom: 0 !important; } /* Eskiden kalan bu kural sıfırlandı */
            #evSahibiIstatistikleriModal .table-title > span::before { /* ::before artık span'i hedefliyor */
    content: "1907";
                background: var(--fb-yellow);
                color: var(--fb-dark-blue);
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 10px;
                font-size: 12px;
                font-weight: 900;
            }
            #evSahibiIstatistikleriModal .table-title::before,
#deplasmanIstatistikleriModal .table-title::before {
    content: none; /* Eski ::before kuralı iptal edildi */
}
            #export-ev-jpeg-button,
            #export-deplasman-jpeg-button,
            #export-genel-jpeg-button.export-jpeg-button-class {
                margin: 0; /* Boşluklar sıfırlandı */
                padding: 5px 10px;
                font-size: 11px;
                flex-shrink: 0; /* Butonların küçülmesini engeller */
            }
            /* --- YENİ KURALLARIN SONU --- */

            #filter-panel { background: rgba(4,30,66,0.7); border: 1px solid var(--fb-yellow); padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 15px; }
            #filter-panel label { color: var(--fb-yellow); font-weight: bold; display: flex; align-items: center; gap: 8px; }
            #user-select { background: var(--fb-dark-blue); color: white; border: 1px solid var(--fb-yellow); padding: 8px; border-radius: 4px; outline: none; }
            #user-select:focus { box-shadow: 0 0 0 2px rgba(255,237,0,0.5); }
            #away-only { width: 18px; height: 18px; accent-color: var(--fb-yellow); }
            .tactics-image { width: 150px; height: auto; top: 100%; left: 0; display: none; position: relative; z-index: 1000; background: rgba(4,30,66,0.9); border: 2px solid var(--fb-yellow); border-radius: 8px; padding: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
            [style*="position: absolute"][style*="background: #333"] { background: var(--fb-dark-blue) !important; color: var(--fb-yellow) !important; border: 2px solid var(--fb-yellow) !important; border-radius: 8px !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; padding: 10px !important; z-index: 9999 !important; max-width: 300px !important; font-size: 63px !important; }
            .modal-content::-webkit-scrollbar { width: 12px; }
            .modal-content::-webkit-scrollbar-track { background: var(--fb-dark-blue); border-radius: 6px; }
            .modal-content::-webkit-scrollbar-thumb { background: var(--fb-yellow); border-radius: 6px; border: 2px solid var(--fb-dark-blue); }
            .modal-content::-webkit-scrollbar-thumb:hover { background: #FFB612; }
            .fb-selection-container { display: flex; align-items: center; gap: 5px; margin-left: 5px; align-self: center; }
            .fb-main-button { background: linear-gradient(135deg, #041E42 0%, #1A4FA3 100%); color: #FFED00; border: 2px solid #FFED00; border-radius: 30px; padding: 8px 15px; cursor: pointer; font-weight: bold; font-size: 12px; text-transform: uppercase; display: flex; align-items: center; justify-content: space-between; min-width: 200px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all .3s; white-space: nowrap; }
            .fb-main-button:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }
            .fb-main-button > i:not(.fa-chevron-down) { margin-right: 5px; }
            .fb-main-button > span { margin-right: auto; padding-left: 5px; }
            .fb-dropdown { display: none; position: absolute; top: 100%; margin-top: 5px; left: 0; background: #041E42; border: 2px solid #FFED00; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 1001; min-width: 100%; }
            .fb-dropdown.show { display: block; }
            .fb-option { padding: 8px 15px; cursor: pointer; color: white; font-size: 12px; transition: all .2s; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
            .fb-option:hover { background: #1A4FA3; }
            .fb-option i { width: 15px; text-align: center; }
            .fb-confirm-btn { background: #E30A17; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px; display: none; align-items: center; justify-content: center; opacity: .5; transition: all .2s; box-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-left: 5px; flex-shrink: 0; }
            .fb-confirm-btn.active { opacity: 1; transform: scale(1.1); display: flex !important; }
            .fb-confirm-btn:hover { background: #B00814; opacity: 1; }
            #update-popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 19999; display: flex; justify-content: center; align-items: center; }
            #update-popup-modal { background: linear-gradient(135deg, var(--fb-dark-blue) 70%, var(--fb-light-blue) 100%); color: var(--fb-yellow); border-radius: 12px; padding: 25px 35px; box-shadow: 0 8px 24px rgba(0,0,0,0.8); border: 3px solid var(--fb-yellow); position: relative; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; font-family: 'Arial', sans-serif; }
            #update-popup-modal h2 { font-size: 22px; font-weight: bold; text-transform: uppercase; margin-top: 0; margin-bottom: 15px; color: var(--fb-yellow); text-shadow: 1px 1px 2px rgba(0,0,0,0.7); border-bottom: 2px solid var(--fb-yellow); padding-bottom: 10px; letter-spacing: 1px; display: flex; align-items: center; gap: 10px; }
            #update-popup-modal h2::before { content: "⭐"; font-size: 18px; }
            #update-popup-modal p { margin-bottom: 20px; line-height: 1.5; color: var(--tr-white); }
            #update-popup-modal strong { color: var(--fb-yellow); }
            #update-popup-modal h3 { font-size: 16px; color: var(--fb-yellow); margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,237,0,0.5); padding-bottom: 5px; }
            #update-popup-modal ul { list-style: none; padding-left: 10px; margin-bottom: 25px; }
            #update-popup-modal ul li { margin-bottom: 8px; padding-left: 20px; position: relative; color: var(--tr-white); font-size: 14px; }
            #update-popup-modal ul li::before { content:"✔️"; color: var(--fb-yellow); position: absolute; left: 0; top: 1px; }
            #update-popup-close-btn { display: block; margin: 20px auto 0 auto; background: linear-gradient(145deg, var(--fb-yellow) 0%, #FFB612 100%); color: var(--fb-dark-blue); border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; text-transform: uppercase; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all .3s; letter-spacing: 1px; }
            #update-popup-close-btn:hover { background: linear-gradient(145deg, #FFB612 0%, var(--fb-yellow) 100%); transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.4); }
            #sezon-fikstur-container { width: 100%; margin: 15px 0; border: 2px solid var(--fb-yellow); border-radius: 8px; overflow: hidden; }
            #sezon-fikstur-title {
    cursor: pointer;
    background: linear-gradient(135deg, var(--fb-dark-blue) 0%, var(--fb-light-blue) 100%);
    color: var(--fb-yellow);
    padding: 12px 20px;
    font-weight: bold;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid var(--fb-yellow);
    text-transform: uppercase; /* Bu harfleri büyütür */
    letter-spacing: 1px;      /* Bu harf aralığını açar */
    text-shadow: 1px 1px 3px rgba(0,0,0,0.6); /* Bu gölge efekti ekler */
}

#sezon-fikstur-title::before {
    content: "1907";
    background: var(--fb-yellow);
    color: var(--fb-dark-blue);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 900;
    margin-right: 10px; /* Bu, logo ile metin arasına boşluk koyar */
    text-shadow: none;      /* BU SATIRI EKLEYİN: Miras alınan gölgeyi iptal eder */
}

            #fikstur-toggle-icon { margin-left: 10px; transition: transform .3s; }
            #fikstur-table { width: 100%; border-collapse: collapse; background: rgba(4,30,66,0.8); }
            #fikstur-table th { background: var(--fb-dark-blue); color: var(--fb-yellow); padding: 10px; text-align: center; border: 1px solid var(--fb-yellow); }
            #fikstur-table td { padding: 8px 10px; border: 1px solid rgba(255,237,0,0.3); text-align: center; color: white; }
            #sezon-fikstur-container.fikstur-collapsed #fikstur-toggle-icon { transform: rotate(-90deg); }
            #sezon-fikstur-container.fikstur-collapsed #fikstur-table { display: none; }
            #language-switcher-container { display: flex; align-items: center; margin-left: 15px; background: rgba(4,30,66,0.7); padding: 5px 10px; border-radius: 8px; border: 1px solid var(--fb-yellow); }
            #language-switcher-container label { color: var(--fb-yellow); font-weight: bold; margin-right: 8px; font-size: 12px; }
            #language-select { background: var(--fb-dark-blue); color: white; border: 1px solid var(--fb-yellow); padding: 6px 8px; border-radius: 4px; outline: none; font-size: 12px; }
            #language-select:focus { box-shadow: 0 0 0 2px rgba(255,237,0,0.5); }
            .opponent-matches-tooltip { position: absolute; background-color: var(--fb-dark-blue, #041E42); color: var(--fb-yellow, #FFED00); border: 2px solid var(--fb-yellow, #FFED00); padding: 12px 15px; border-radius: 8px; z-index: 10005; font-size: 13px; line-height: 1.5; max-width: 400px; box-shadow: 0 5px 15px rgba(0,0,0,0.7); display: none; pointer-events: none; font-family: Arial, sans-serif; }
            .opponent-matches-tooltip .tooltip-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--fb-light-blue, #1A4FA3); color: var(--fb-yellow, #FFED00); text-align: center; }
            .opponent-matches-tooltip ul { list-style: none; padding: 0; margin: 0; }
            .opponent-matches-tooltip li { padding: 6px 0; border-bottom: 1px dashed rgba(255, 237, 0, 0.3); color: var(--tr-white, #FFFFFF); display: flex; justify-content: space-between; align-items: center; gap: 8px; }
            .opponent-matches-tooltip li:last-child { border-bottom: none; }
            .opponent-matches-tooltip .match-info { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .opponent-matches-tooltip .match-round { font-weight: bold; margin-right: 5px; color: var(--fb-yellow, #FFED00); }
            .opponent-matches-tooltip .match-score-venue { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
            .opponent-matches-tooltip .match-score { font-weight: bold; color: var(--fb-yellow, #FFED00); padding: 2px 5px; background-color: rgba(0,0,0,0.2); border-radius: 3px; }
            .opponent-matches-tooltip .match-venue { font-style: italic; font-size: 0.9em; color: #ccc; }
            .opponent-matches-tooltip a.match-detail-link { color: var(--fb-light-blue, #87CEFA); text-decoration: none; font-size: 0.9em; font-weight: bold; padding: 2px 4px; }
            .opponent-matches-tooltip a.match-detail-link:hover { text-decoration: underline; color: var(--fb-yellow, #FFED00); }
            .tooltip-no-data { font-style: italic; color: #aaa; text-align: center; padding: 10px 0; }

            .defensive-stars {
                /* 1. Adım: İç rengi (dolgu) ayarla */
                color: #FBC02D; /* Canlı sarı dolgu rengi */

                /* 2. Adım: Dış çerçeveyi (stroke) ekle */
                -webkit-text-stroke-width: 0.75px; /* Çerçevenin kalınlığı */
                -webkit-text-stroke-color: var(--fb-dark-blue); /* Fenerbahçe mavisi çerçeve rengi */
                text-stroke-width: 0.75px; /* Standart özellik */
                text-stroke-color: var(--fb-dark-blue); /* Standart özellik */

                /* Diğer stil ayarları */
                font-size: 12px;
                margin-left: 8px;
                vertical-align: middle;
                white-space: nowrap;
                letter-spacing: 1px;
                /* Gölgeyi kaldırıyoruz çünkü çerçeve daha iyi bir ayrım sağlıyor */
                text-shadow: none;
            }

            /* Boş yıldızların içini soluk gri yap, çerçevesi ana kuraldan miras alınır (mavi kalır) */
            .defensive-stars .far.fa-star {
                color: #B0BEC5; /* Soluk gri dolgu rengi */
            }

            .sort-icon {
                color: #B0BEC5;
                margin-left: 5px;
                transition: color 0.2s;
            }
            th:hover .sort-icon {
                color: white;
            }

            @media (max-width: 768px) {
                .fb-selection-container { display: flex !important; flex-direction: column; align-items: center; width: 90%; max-width: 500px; margin: 15px auto; padding: 10px; background-color: rgba(4,30,66,0.8); border: 1px solid var(--fb-yellow); border-radius: 8px; order: -1; }
                .fb-main-button { width: 100%; margin-bottom: 5px; min-width: unset; padding: 4px 10px; font-size: 12px; white-space: normal; justify-content: center; flex-wrap: wrap; text-align: center; }
                .fb-main-button > i { margin: 0 3px 2px 3px; }
                .fb-main-button > span { padding-left: 0; margin-right: 0; flex-basis: 100%; text-align: center; margin-top: 3px; }
                .fb-main-button > .fa-chevron-down { font-size: .8em; margin-left: 5px; }
                .fb-dropdown { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: auto; min-width: 290px; max-width: calc(100vw - 30px); white-space: nowrap; z-index: 1001; font-size: 11px; background: #041E42; border: 2px solid #FFED00; border-radius: 10px; overflow: visible; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: none; }
                .fb-option { padding: 6px 10px; font-size: 11px; }
                .fb-option i { width: 12px; margin-right: 5px; }
                .fb-confirm-btn { margin-left: 0; margin-top: 5px; }
                #evSahibiIstatistikleriModal .modal-content table, #deplasmanIstatistikleriModal .modal-content table { font-size: 10px; width: 100%; max-width: 100%; box-sizing: border-box; border-collapse: collapse; table-layout: auto; margin-bottom: 8px; }
                #evSahibiIstatistikleriModal .modal-content th, #evSahibiIstatistikleriModal .modal-content td, #deplasmanIstatistikleriModal .modal-content th, #deplasmanIstatistikleriModal .modal-content td { padding: 3px 2px; white-space: normal; word-break: break-word; text-align: center; vertical-align: middle; line-height: 1.15; border: 1px solid rgba(255,237,0,0.2); }
                #evSahibiIstatistikleriModal .modal-content th, #deplasmanIstatistikleriModal .modal-content th { background-color: var(--fb-dark-blue); color: var(--fb-yellow); font-weight: bold; }
                #evSahibiIstatistikleriModal .modal-content td:nth-child(2), #deplasmanIstatistikleriModal .modal-content td:nth-child(2) { text-align: left; padding-left: 4px; min-width: 55px; }
                #evSahibiIstatistikleriModal .table-section {
    margin-bottom: 1px;
    padding-bottom: 5px;
}
                #evSahibiIstatistikleriModal .modal-content, #deplasmanIstatistikleriModal .modal-content { padding: 15px 5px 10px 5px !important; overflow-x: hidden; }
                /* Ana Başlık (Fenerbahçe - Türkiye İstatistikleri) */
#evSahibiIstatistikleriModal #ev-stats-title,
#deplasmanIstatistikleriModal #deplasman-stats-title {
    font-size: 13px; /* Ana başlık, alt başlıklardan daha büyük olacak */
    font-weight: bold;
    margin-bottom: 15px; /* Altındaki bölümle arasını biraz açalım */
    padding-bottom: 8px;
    text-align: center;
    flex-grow: 1; /* Butonlarla hizalamayı korumak için */
}

/* Alt Başlıklar (HÜCUM, SAVUNMA, GENEL) */
#evSahibiIstatistikleriModal .table-title,
#deplasmanIstatistikleriModal .table-title {
    font-size: 11px; /* Punto boyutu küçültülerek hiyerarşi sağlandı */
    margin-bottom: 8px;
    padding-bottom: 5px;
}
 #evSahibiIstatistikleriModal .table-title > span::before {
        font-size: 8px;
        padding: 2px 4px;
        margin-right: 5px;
    }
                #evSahibiIstatistikleriModal .export-buttons, #deplasmanIstatistikleriModal .export-buttons { display: flex; justify-content: space-around; margin-bottom: 10px; }
                #evSahibiIstatistikleriModal .export-buttons button, #deplasmanIstatistikleriModal .export-buttons button { padding: 3px 6px; font-size: 10px; margin: 0; }
                #export-ev-jpeg-button, #export-deplasman-jpeg-button { position: static; margin-top: 0; display: inline-block; margin-right: 0; }
                #export-deplasman-jpeg-button { float: right; }
                #evSahibiIstatistikleriModal .table-section:last-child { padding-bottom: 35px; }
                #export-deplasman-jpeg-button { font-size: 10px; padding: 3px 6px; }
                /* #export-ev-jpeg-button { position: static; } -- Bu kural zaten yukarıda vardı, tekrarına gerek yok */
                 #fikstur-table th, #fikstur-table td { padding: 5px 4px; font-size: 10px; white-space: normal; word-break: break-word; }
                #fikstur-table th:nth-child(4), #fikstur-table td:nth-child(4) { min-width: 80px; }
                #sezon-fikstur-title { font-size: 12px; padding: 8px 10px; }
                #sezon-fikstur-container { display: block !important; visibility: visible !important; width: 100%; box-sizing: border-box; margin: 15px 0 !important; }
                #fikstur-table { display: table !important; visibility: visible !important; }
                #sezon-fikstur-container.fikstur-collapsed #fikstur-table { display: none !important; }
                #language-switcher-container { flex-direction: column; align-items: flex-start; margin-top: 10px; width: 100%; }
                #language-switcher-container label { margin-bottom: 5px; }
                #language-select { width: 100%; }
            }
        `);
    } catch (e) {
        console.error(this.getTranslatedText('errorAddingStyles'), e);
    }
},

        showUpdPop(curV, prevV, clogData) {
            const ovl = document.createElement('div');
            ovl.id = 'update-popup-overlay';

            const mdl = document.createElement('div');
            mdl.id = 'update-popup-modal';
            mdl.dataset.curVer = curV;
            mdl.dataset.prevVer = prevV;

            let chHTML = '';
            if (clogData[curV]) {
                chHTML += `<h3>${this.getTranslatedText('scriptUpdatePopupChangesTitle', { ver: curV })}</h3><ul>`;
                clogData[curV].forEach(ch => (chHTML += `<li>${ch}</li>`));
                chHTML += '</ul>';
            } else {
                chHTML = `<p>${this.getTranslatedText('scriptUpdatePopupNoChanges')}</p>`;
            }

            mdl.innerHTML = `
                <h2>${this.getTranslatedText('scriptUpdatePopupTitle')}</h2>
                <p>${this.getTranslatedText('scriptUpdatePopupMessage', { oldVer: prevV, newVer: curV })}</p>
                <div id="changelog-content">${chHTML}</div>
                <button id="update-popup-close-btn">${this.getTranslatedText('scriptUpdatePopupUnderstandButton')}</button>
            `;

            ovl.appendChild(mdl);
            document.body.appendChild(ovl);

            const clBtn = mdl.querySelector('#update-popup-close-btn');
            const clPop = () => {
                ovl.remove();
                GM_setValue(LSV_KEY, curV);
            };
            clBtn.addEventListener('click', clPop);
            ovl.addEventListener('click', e => {
                if (e.target === ovl) clPop();
            });
        },

        mkStatEl() {
            const sDiv = document.createElement('div');
            sDiv.id = 'progress-status';
            document.body.appendChild(sDiv);
            this.statEl = sDiv;
        },

        startProg() {
            NProgress.configure({
                minimum: 0.1,
                trickleSpeed: 200,
                showSpinner: false,
            });
        },

        setStat(msgKey, params = {}) {
            if (this.statEl) this.statEl.textContent = this.getTranslatedText(msgKey, params);
        },

        clear() {
            setTimeout(() => {
                if (this.statEl) this.statEl.remove();
            }, 2000);
        },

        mkMainMdl() {
            const m = document.createElement('div');
            m.id = 'anaModal';
            m.className = 'modal';
            m.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">×</span>
                    <div id="matches-title">${this.getTranslatedText('mainModalTitle')}</div>
                    <div id="filter-panel">
                        <label>${this.getTranslatedText('mainModalUserLabel')} <select id="user-select"></select></label>
                        <label><input type="checkbox" id="away-only" checked/> ${this.getTranslatedText('mainModalAwayOnlyLabel')}</label>
                    </div>
                    <div id="matches-container"></div>
                </div>
            `;
            document.body.appendChild(m);
            m.querySelector('.modal-close').onclick = () => (m.style.display = 'none');
            m.onclick = e => {
                if (e.target === m) m.style.display = 'none';
            };
            m.querySelector('#user-select').addEventListener('change', () => this.rendMatches());
            m.querySelector('#away-only').addEventListener('change', () => this.rendMatches());
            this.mainMdl = m;
        },

        // --- REFACTOR HELPER FUNCTIONS ---
        _createStatsTableHeaderHTML() {
            return `
                <thead>
                    <tr>
                        <th><abbr title="${this.getTranslatedText('tableHeaderRankAbbr')}">${this.getTranslatedText('tableHeaderRank')}</abbr></th>
                        <th>${this.getTranslatedText('tableHeaderTeam')}</th>
                        <th class="sortable" data-sort="toplamMaclar"><abbr title="${this.getTranslatedText('tableHeaderMatchesAbbr')}">${this.getTranslatedText('tableHeaderMatches')}</abbr></th>
                        <th class="sortable" data-sort="katildigiTurSayisi"><abbr title="${this.getTranslatedText('tableHeaderRoundsAbbr')}">${this.getTranslatedText('tableHeaderRounds')}</abbr></th>
                        <th class="sortable" data-sort="galibiyetler"><abbr title="${this.getTranslatedText('tableHeaderWinsAbbr')}">${this.getTranslatedText('tableHeaderWins')}</abbr></th>
                        <th class="sortable" data-sort="beraberlikler"><abbr title="${this.getTranslatedText('tableHeaderDrawsAbbr')}">${this.getTranslatedText('tableHeaderDraws')}</abbr></th>
                        <th class="sortable" data-sort="maglubiyetler"><abbr title="${this.getTranslatedText('tableHeaderLossesAbbr')}">${this.getTranslatedText('tableHeaderLosses')}</abbr></th>
                        <th class="sortable" data-sort="ortalamaAtilanGol"><abbr title="${this.getTranslatedText('tableHeaderAvgGoalsScoredAbbr')}">${this.getTranslatedText('tableHeaderAvgGoalsScored')}</abbr></th>
                        <th class="sortable" data-sort="ortalamaYenilenGol"><abbr title="${this.getTranslatedText('tableHeaderAvgGoalsConcededAbbr')}">${this.getTranslatedText('tableHeaderAvgGoalsConceded')}</abbr></th>
                        <th class="sortable" data-sort="puanlar"><abbr title="${this.getTranslatedText('tableHeaderPointsAbbr')}">${this.getTranslatedText('tableHeaderPoints')}</abbr></th>
                        <th class="sortable" data-sort="toplamPuanlar"><abbr title="${this.getTranslatedText('tableHeaderTotalPointsAbbr')}">${this.getTranslatedText('tableHeaderTotalPoints')}</abbr></th>
                        <th class="sortable" data-sort="ortalamaPuanMacBasi"><abbr title="${this.getTranslatedText('tableHeaderAvgPointsPerMatchAbbr')}">${this.getTranslatedText('tableHeaderAvgPointsPerMatch')}</abbr></th>
                        <th class="sortable" data-sort="basariOrani"><abbr title="${this.getTranslatedText('tableHeaderSuccessRateAbbr')}">${this.getTranslatedText('tableHeaderSuccessRate')}</abbr></th>
                    </tr>
                </thead>
            `;
        },

        _createStatsTableBodyHTML(statsData) {
            return `
                <tbody>
                    ${statsData
                        .filter(s => s.toplamMaclar > 0) // <-- SADECE BU SATIR EKLENDİ
                        .map(
                            (s, idx) => `
                        <tr>
                            <td>${idx + 1}</td>
                            <td>${s.tmName}</td>
                            <td>${s.toplamMaclar}</td>
                            <td>${s.katildigiTurSayisi}</td>
                            <td>${s.galibiyetler}</td>
                            <td>${s.beraberlikler}</td>
                            <td>${s.maglubiyetler}</td>
                            <td>${s.ortalamaAtilanGol}</td>
                            <td>${s.ortalamaYenilenGol}</td>
                            <td>${s.puanlar}</td>
                            <td>${s.toplamPuanlar}</td>
                            <td>${s.ortalamaPuanMacBasi}</td>
                            <td>${s.basariOrani}</td>
                        </tr>`
                        )
                        .join('')}
                </tbody>
            `;
        },

        _addTableSortingListeners(modal, tableId, data, renderCallback) {
            modal.querySelectorAll(`#${tableId} .sortable`).forEach(hdr => {
                hdr.style.cursor = 'pointer';
                hdr.addEventListener('click', () => {
                    const sk = hdr.getAttribute('data-sort');
                    const isAsc = hdr.classList.toggle('asc');
                    hdr.classList.toggle('desc', !isAsc);

                    modal.querySelectorAll(`#${tableId} .sortable`).forEach(h => {
                        if (h !== hdr) h.classList.remove('asc', 'desc');
                    });

                    this.srtTbl(data, sk, isAsc);
                    renderCallback(modal, data, tableId);
                });
            });
        },
        // --- END OF REFACTOR HELPER FUNCTIONS ---

        showAwayStats(km, pc, isRefresh = false) {
            try {
                const awayStats = this.calcAwayStats(km, pc);
                if (!awayStats.length) return;

                this.srtTbl(awayStats, 'basariOrani', false);
                const lastR_full = pc.length > 0 ? pc[pc.length - 1].r : 'Bilinmiyor';
const lastR = lastR_full.split(' - ')[0];

                let m = document.getElementById('deplasmanIstatistikleriModal');
                if (m && isRefresh) m.remove();
                if (!m || isRefresh) {
                    m = document.createElement('div');
                    m.id = 'deplasmanIstatistikleriModal';
                    m.className = 'modal';
                    document.body.appendChild(m);
                }

                m.dataset.statData = JSON.stringify({ km, pc });
                m.innerHTML = `
    <div class="modal-content">
        <span class="modal-close">×</span>
        <div class="modal-header-container">
            <div id="deplasman-stats-title">${this.getTranslatedText('opponentDefenseStatsTitle', { round: lastR })}</div>
            <div class="export-buttons">
                <button id="export-button">${this.getTranslatedText('exportExcelButton')}</button>
                <button id="export-jpeg-button">${this.getTranslatedText('exportJpegButton')}</button>
            </div>
        </div>
        <table id="deplasman-stats-table">
            ${this._createStatsTableHeaderHTML()}
            ${this._createStatsTableBodyHTML(awayStats)}
        </table>
    </div>
`;

                m.querySelector('#export-button').addEventListener('click', () => this.expXLS(awayStats, 'deplasman_istatistikleri.xlsx'));
                m.querySelector('#export-jpeg-button').addEventListener('click', () => {
                    html2canvas(m.querySelector('#deplasman-stats-table')).then(can => {
                        const lnk = document.createElement('a');
                        lnk.download = 'deplasman_istatistikleri.jpeg';
                        lnk.href = can.toDataURL('image/jpeg', 0.9);
                        lnk.click();
                    });
                });

                this._addTableSortingListeners(m, 'deplasman-stats-table', awayStats, this.rendSrtTbl);

                m.querySelector('.modal-close').onclick = () => m.remove();
                m.onclick = e => {
                    if (e.target === m) m.remove();
                };
                m.style.display = 'block';
            } catch (e) {
                console.error(this.getTranslatedText('errorDisplayingAwayStats'), e);
            }
        },

        async showHomeStats(km, cs, isRefresh = false) {
    try {
        const manuallyAddedUsernames = USER_DATABASE.map(u => u.user);
        let comprehensiveKm = [...km];
        const knownUsernames = new Set(comprehensiveKm.map(member => member.un));
        const usernamesToFetch = manuallyAddedUsernames.filter(username => !knownUsernames.has(username));

        if (usernamesToFetch.length > 0) {
            const managerDataPromises = usernamesToFetch.map(username => (window.dataExtrInstance && typeof window.dataExtrInstance.getMgrData === 'function' ? window.dataExtrInstance.getMgrData(username).catch(() => null) : Promise.resolve(null)));
            const additionalManagerDataArray = await Promise.all(managerDataPromises);
            additionalManagerDataArray.forEach(managerData => {
                if (managerData?.tmName && !new Set(comprehensiveKm.map(m => m.tmName)).has(managerData.tmName)) {
                    comprehensiveKm.push(managerData);
                }
            });
        }

        const jokerTeamMember = comprehensiveKm.find(member => member.un === 'rebellious' || member.tmName.trim() === 'JOKER');
        if (jokerTeamMember) {
            jokerTeamMember.tmName = '- JOKER -';
        }

        const homeS = this.calcHomeStats(comprehensiveKm, cs);
        const awayS = this.calcOwnFedAwayStats(comprehensiveKm, cs);
        if (!homeS.length && !awayS.length) {
            alert(this.getTranslatedText('alertNoStatsToGenerate'));
            return;
        }
        this.srtTbl(homeS, 'basariOrani', false);
        this.srtTbl(awayS, 'basariOrani', false);
        const genS = this.calcGenStats(homeS, awayS);
        this.srtTbl(genS, 'basariOrani', false);
        const lastR = cs.length > 0 ? cs[cs.length - 1].r : 'Bilinmiyor';
        const shortRoundTitle = lastR.split(' - ')[0];

        let mdl = document.getElementById('evSahibiIstatistikleriModal');
        if (mdl && isRefresh) mdl.remove();
        if (!mdl || isRefresh) {
            mdl = document.createElement('div');
            mdl.id = 'evSahibiIstatistikleriModal';
            mdl.className = 'modal';
            document.body.appendChild(mdl);
        }

        mdl.dataset.statData = JSON.stringify({ km: comprehensiveKm, cs });
        mdl.innerHTML = `
<div class="modal-content">
<span class="modal-close">×</span>
<div class="modal-header-container">
<div id="ev-stats-title">${this.getTranslatedText('homeStatsModalTitle', { round: shortRoundTitle })}</div>
<div class="export-buttons">
<button id="export-ev-button">${this.getTranslatedText('exportExcelButton')}</button>
</div>
</div>

<div class="table-section">
<div class="table-title">
<span>${this.getTranslatedText('homeStatsOffensiveTitle')}</span>
<button id="export-ev-jpeg-button">${this.getTranslatedText('exportJpegButton')}</button>
</div>
<table id="ev-stats-table">${this._createStatsTableHeaderHTML()}${this._createStatsTableBodyHTML(homeS)}</table>
</div>

<div class="table-section">
<div class="table-title">
<span>${this.getTranslatedText('homeStatsDefensiveTitle')}</span>
<button id="export-deplasman-jpeg-button">${this.getTranslatedText('exportJpegButton')}</button>
</div>
<table id="ev-deplasman-stats-table">${this._createStatsTableHeaderHTML()}${this._createStatsTableBodyHTML(awayS)}</table>
</div>

<div class="table-section">
<div class="table-title">
<span>${this.getTranslatedText('homeStatsGeneralTitle')}</span>
<button id="export-genel-jpeg-button" class="export-jpeg-button-class">${this.getTranslatedText('exportJpegButton')}</button>
</div>
<table id="genel-stats-table">${this._createStatsTableHeaderHTML()}${this._createStatsTableBodyHTML(genS)}</table>
</div>
</div>
`;

        const createJpeg = (tableId, filename) => {
            const tbl = mdl.querySelector(`#${tableId}`);
            if (!tbl) return console.error(this.getTranslatedText('errorGeneralStatsTableNotFoundJPEG'));
            html2canvas(tbl)
                .then(can => {
                    const lnk = document.createElement('a');
                    lnk.download = filename;
                    lnk.href = can.toDataURL('image/jpeg', 0.9);
                    lnk.click();
                })
                .catch(err => console.error(this.getTranslatedText('errorCreatingJPEGGeneralStats'), err));
        };

        mdl.querySelector('#export-ev-button').addEventListener('click', () => this.expXLS3(homeS, awayS, genS));
        mdl.querySelector('#export-ev-jpeg-button').addEventListener('click', () => createJpeg('ev-stats-table', 'fenerbahce_hucum_istatistikleri.jpeg'));
        mdl.querySelector('#export-deplasman-jpeg-button').addEventListener('click', () => createJpeg('ev-deplasman-stats-table', 'fenerbahce_savunma_istatistikleri.jpeg'));
        mdl.querySelector('#export-genel-jpeg-button')?.addEventListener('click', () => createJpeg('genel-stats-table', 'fenerbahce_genel_istatistikleri.jpeg'));

        this._addTableSortingListeners(mdl, 'ev-stats-table', homeS, this.rendSrtTbl);
        this._addTableSortingListeners(mdl, 'ev-deplasman-stats-table', awayS, this.rendSrtTbl);
        this._addTableSortingListeners(mdl, 'genel-stats-table', genS, this.rendSrtTbl);

        mdl.querySelector('.modal-close').onclick = () => mdl.remove();
        mdl.onclick = e => {
            if (e.target === mdl) mdl.remove();
        };
        mdl.style.display = 'block';
    } catch (e) {
        console.error(this.getTranslatedText('errorDisplayingHomeStats'), e);
        alert(this.getTranslatedText('alertErrorDisplayingStats'));
    }
},

        _calcStatsBase(km, pc, isHome) {
    if (!km || !Array.isArray(km)) return [];
    const sm = new Map();
    km.forEach(m => {
        if (m.tmName) {
            const trimmedName = m.tmName.trim();
            if (!sm.has(trimmedName)) {
                sm.set(trimmedName, {
                    tmName: trimmedName,
                    toplamMaclar: 0, galibiyetler: 0, beraberlikler: 0, maglubiyetler: 0, puanlar: 0,
                    turlerKatildi: new Set(), toplamAtilanGol: 0, toplamYenilenGol: 0,
                });
            }
        }
    });

    pc.forEach(c => {
        c.m.forEach(match => {
            const [ht, at] = match.ts.split(' - ').map(t => t.trim());
            const [hs, as] = match.sc.split(' - ').map(Number);
            let targetTeam = isHome ? ht : at;
            const targetScore = isHome ? hs : as;
            const oppScore = isHome ? as : hs;

            // --- NİHAİ ÇÖZÜM: ESNEK EŞLEŞTİRME ---
            // Eğer takım adı doğrudan bulunamazsa, JOKER takımının diğer olası formatını kontrol et.
            if (!sm.has(targetTeam)) {
                if (targetTeam === "- JOKER") {
                    targetTeam = "- JOKER -"; // Hatalı ayrıştırılmış adı, doğru adla değiştir.
                } else if (targetTeam === "- JOKER -") {
                    targetTeam = "- JOKER"; // Tersi durum için de kontrol ekleyelim.
                }
            }
            // --- DÜZELTME SONU ---

            if (sm.has(targetTeam)) {
                const s = sm.get(targetTeam);
                s.toplamMaclar++;
                s.turlerKatildi.add(c.r);
                s.toplamAtilanGol += targetScore;
                s.toplamYenilenGol += oppScore;
                if (targetScore > oppScore) s.galibiyetler++, (s.puanlar += 3);
                else if (targetScore === oppScore) s.beraberlikler++, (s.puanlar += 1);
                else s.maglubiyetler++;
            }
        });
    });

    const res = [];
    for (const s of sm.values()) {
        s.katildigiTurSayisi = s.turlerKatildi.size;
        s._turlerSeti = s.turlerKatildi;
        s.toplamPuanlar = s.puanlar + s.toplamMaclar;
        s.ortalamaPuanMacBasi = s.toplamMaclar > 0 ? (s.toplamPuanlar / s.toplamMaclar).toFixed(2) : '0.00';
        s.basariOrani = s.toplamMaclar > 0 ? ((s.puanlar * 100) / (s.toplamMaclar * 3)).toFixed(2) : '0.00';
        s.ortalamaAtilanGol = s.toplamMaclar > 0 ? (s.toplamAtilanGol / s.toplamMaclar).toFixed(2) : '0.00';
        s.ortalamaYenilenGol = s.toplamMaclar > 0 ? (s.toplamYenilenGol / s.toplamMaclar).toFixed(2) : '0.00';
        res.push(s);
    }
    return res;
},

        calcAwayStats(km, pc) {
            return this._calcStatsBase(km, pc, false);
        },

        calcHomeStats(km, pc) {
            return this._calcStatsBase(km, pc, true);
        },

        calcOwnFedAwayStats(km, pc) {
            return this._calcStatsBase(km, pc, false);
        },

        calcGenStats(homeS, awayS) {
            const genMap = new Map();
            const proc = stats => {
                stats.forEach(s => {
                    if (!genMap.has(s.tmName)) {
                        genMap.set(s.tmName, { tmName: s.tmName, toplamMaclar: 0, galibiyetler: 0, beraberlikler: 0, maglubiyetler: 0, puanlar: 0, _birlesikTurlerSeti: new Set(), toplamAtilanGol: 0, toplamYenilenGol: 0 });
                    }
                    const gs = genMap.get(s.tmName);
                    gs.toplamMaclar += s.toplamMaclar;
                    gs.galibiyetler += s.galibiyetler;
                    gs.beraberlikler += s.beraberlikler;
                    gs.maglubiyetler += s.maglubiyetler;
                    gs.puanlar += s.puanlar;
                    gs.toplamAtilanGol += s.toplamAtilanGol || 0;
                    gs.toplamYenilenGol += s.toplamYenilenGol || 0;
                    if (s._turlerSeti) s._turlerSeti.forEach(r => gs._birlesikTurlerSeti.add(r));
                });
            };
            proc(homeS);
            proc(awayS);

            const res = [];
            for (const s of genMap.values()) {
                s.katildigiTurSayisi = s._birlesikTurlerSeti.size;
                delete s._birlesikTurlerSeti;
                s.toplamPuanlar = s.puanlar + s.toplamMaclar;
                s.ortalamaPuanMacBasi = s.toplamMaclar > 0 ? (s.toplamPuanlar / s.toplamMaclar).toFixed(2) : '0.00';
                s.basariOrani = s.toplamMaclar > 0 ? ((s.puanlar * 100) / (s.toplamMaclar * 3)).toFixed(2) : '0.00';
                s.ortalamaAtilanGol = s.toplamMaclar > 0 ? (s.toplamAtilanGol / s.toplamMaclar).toFixed(2) : '0.00';
                s.ortalamaYenilenGol = s.toplamMaclar > 0 ? (s.toplamYenilenGol / s.toplamMaclar).toFixed(2) : '0.00';
                res.push(s);
            }
            return res;
        },

        srtTbl(d, sk, asc) {
            d.sort((a, b) => (asc ? parseFloat(a[sk]) - parseFloat(b[sk]) : parseFloat(b[sk]) - parseFloat(a[sk])));
        },

        rendSrtTbl(m, d, tId) {
            const tb = m.querySelector(`#${tId} tbody`);
            if (!tb) {
                console.error(this.getTranslatedText('errorSortedTableRenderTbodyNotFound', { tableId: tId }));
                return;
            }
            tb.innerHTML = this._createStatsTableBodyHTML(d);
        },

        expXLS(stats, fName = 'istatistikler.xlsx') {
            try {
                const headers = ['tableHeaderRank', 'tableHeaderTeam', 'tableHeaderMatches', 'tableHeaderRounds', 'tableHeaderWins', 'tableHeaderDraws', 'tableHeaderLosses', 'tableHeaderAvgGoalsScored', 'tableHeaderAvgGoalsConceded', 'tableHeaderPoints', 'tableHeaderTotalPoints', 'tableHeaderAvgPointsPerMatch', 'tableHeaderSuccessRate'];
                const wsData = [
                    headers.map(h => this.getTranslatedText(h)),
                    ...stats.map((s, idx) => [idx + 1, s.tmName, s.toplamMaclar, s.katildigiTurSayisi, s.galibiyetler, s.beraberlikler, s.maglubiyetler, s.ortalamaAtilanGol, s.ortalamaYenilenGol, s.puanlar, s.toplamPuanlar, s.ortalamaPuanMacBasi, s.basariOrani]),
                ];
                const ws = XLSX.utils.aoa_to_sheet(wsData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, this.getSafeSheetName('tableHeaderTeam'));
                const xlBuff = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([xlBuff], { type: 'application/octet-stream' });
                const lnk = document.createElement('a');
                lnk.href = URL.createObjectURL(blob);
                lnk.download = fName;
                lnk.click();
            } catch (e) {
                console.error(this.getTranslatedText('errorExportExcel'), e);
            }
        },

        expXLS3(homeS, awayS, genS) {
            try {
                const mkSheetData = stats => {
                    const headers = ['tableHeaderRank', 'tableHeaderTeam', 'tableHeaderMatches', 'tableHeaderRounds', 'tableHeaderWins', 'tableHeaderDraws', 'tableHeaderLosses', 'tableHeaderAvgGoalsScored', 'tableHeaderAvgGoalsConceded', 'tableHeaderPoints', 'tableHeaderTotalPoints', 'tableHeaderAvgPointsPerMatch', 'tableHeaderSuccessRate'];
                    return [headers.map(h => this.getTranslatedText(h)), ...stats.map((s, idx) => [idx + 1, s.tmName, s.toplamMaclar, s.katildigiTurSayisi, s.galibiyetler, s.beraberlikler, s.maglubiyetler, s.ortalamaAtilanGol, s.ortalamaYenilenGol, s.puanlar, s.toplamPuanlar, s.ortalamaPuanMacBasi, s.basariOrani])];
                };

                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mkSheetData(homeS)), this.getSafeSheetName('homeStatsOffensiveTitle'));
                XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mkSheetData(awayS)), this.getSafeSheetName('homeStatsDefensiveTitle'));
                XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mkSheetData(genS)), this.getSafeSheetName('homeStatsGeneralTitle'));

                const xlBuff = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([xlBuff], { type: 'application/octet-stream' });
                const lnk = document.createElement('a');
                lnk.href = URL.createObjectURL(blob);
                lnk.download = 'fenerbahce_turkiye_tum_istatistikleri.xlsx';
                lnk.click();
            } catch (e) {
                console.error(this.getTranslatedText('errorExportExcel'), e);
            }
        },

        showMainMdl(km, pc, startUser) {
            try {
                this.keyMbrs = km || [];
                this.prevClashes = pc || [];
                const uSel = this.mainMdl.querySelector('#user-select');
                uSel.innerHTML = '';
                this.keyMbrs.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m.un;
                    opt.textContent = m.un;
                    uSel.appendChild(opt);
                });
                if (this.keyMbrs.length) {
                    const found = this.keyMbrs.find(m => m.un.toLowerCase() === (startUser || '').toLowerCase());
                    uSel.value = found ? found.un : this.keyMbrs[0].un;
                }
                this.mainMdl.style.display = 'block';
                this.rendMatches();
            } catch (e) {
                console.error(this.getTranslatedText('errorDisplayMainModal'), e);
            }
        },

        async getTacChgs(mID) {
            if (this.tacCache[mID]) return this.tacCache[mID];
            try {
                const rsp = await fetch(U.MS(mID));
                const txtD = await rsp.text();
                const prsd = new DOMParser().parseFromString(txtD, 'text/xml');
                const tacNodes = prsd.querySelectorAll('Tactic');
                const chgs = [];
                tacNodes.forEach(n => {
                    const type = n.getAttribute('type');
                    if (type === 'playstyle' || type === 'aggression' || type === 'tactic') {
                        chgs.push(`${this.getTranslatedText('matchTacticTimePrefix')} ${n.getAttribute('time')}: ${type} ${this.getTranslatedText('matchTacticChangedTo')} ${n.getAttribute('new_setting')}`);
                    }
                });
                const info = chgs.length ? chgs.join('<br>') : this.getTranslatedText('matchTacticChangesNone');
                this.tacCache[mID] = info;
                return info;
            } catch (err) {
                console.error(this.getTranslatedText('matchTacticChangesError'), err);
                return (this.tacCache[mID] = this.getTranslatedText('matchTacticChangesUnavailable'));
            }
        },

        procTacImg(tacImg, cont) {
            try {
                const canv = document.createElement('canvas');
                const ctx = canv.getContext('2d');
                tacImg.crossOrigin = 'anonymous';
                tacImg.onload = () => {
                    canv.width = tacImg.width;
                    canv.height = tacImg.height;
                    ctx.drawImage(tacImg, 0, 0);
                    const imgD = ctx.getImageData(0, 0, canv.width, canv.height);
                    const d = imgD.data;
                    for (let i = 0; i < d.length; i += 4) {
                        if (d[i] > 200 && d[i + 1] > 200 && d[i + 2] < 100) (d[i] = 0), (d[i + 1] = 150), (d[i + 2] = 0); // Yellowish to green
                        if (d[i] < 30 && d[i + 1] < 30 && d[i + 2] < 30) (d[i] = 222), (d[i + 1] = 222), (d[i + 2] = 222); // Dark to light gray
                    }
                    ctx.putImageData(imgD, 0, 0);
                    const wrp = document.createElement('div');
                    wrp.appendChild(canv);
                    cont.innerHTML = '';
                    cont.appendChild(wrp);
                };
            } catch (e) {
                console.error(this.getTranslatedText('errorProcessingMatchTactics'), e);
            }
        },

        mkMatchEl(m) {
            try {
                const dv = document.createElement('div');
                dv.className = 'match-item';
                const mID = this.extrMID(m.lk);

                const tdLnk = document.createElement('a');
                tdLnk.className = 'matchIcon shadow_soft';
                tdLnk.href = `/?p=match&sub=result&type=2d&play=2d&mid=${mID}`;
                tdLnk.title = this.getTranslatedText('matchView2D');
                tdLnk.rel = 'nofollow';
                tdLnk.innerHTML = `<i>2D</i><span>&nbsp;${this.getTranslatedText('matchView2D')}&nbsp;</span>`;

                const tip = document.createElement('div');
                tip.style.cssText = 'position: absolute; background: #333; color: #fff; padding: 5px; border-radius: 3px; font-size: 12px; display: none; z-index: 9999;';

                tdLnk.addEventListener('mouseover', async ev => {
                    tip.style.display = 'block';
                    tip.style.top = `${ev.pageY + 15}px`;
                    tip.style.left = `${ev.pageX + 5}px`;
                    tip.innerHTML = await this.getTacChgs(mID);
                });
                tdLnk.addEventListener('mousemove', ev => {
                    tip.style.top = `${ev.pageY + 15}px`;
                    tip.style.left = `${ev.pageX + 5}px`;
                });
                tdLnk.addEventListener('mouseout', () => (tip.style.display = 'none'));
                document.body.appendChild(tip);

                tdLnk.addEventListener('click', e => {
                    e.preventDefault();
                    this.mainMdl.style.display = 'none';
                    if (typeof powerboxCloseAll === 'function') powerboxCloseAll();
                    if (typeof mz?.openGameLayer === 'function') mz.openGameLayer('2d', mID);
                    if (typeof mz?.noSleep?.enable === 'function') mz.noSleep.enable();
                });

                const tacBtn = document.createElement('a');
                tacBtn.className = 'tactics-button';
                tacBtn.href = 'javascript:void(0)';
                tacBtn.textContent = this.getTranslatedText('matchTacticsButton');

                const tacImgDiv = document.createElement('div');
                tacImgDiv.className = 'tactics-image';
                const img = new Image();
                img.src = `https://www.managerzone.com/dynimg/pitch.php?match_id=${mID}`;
                img.alt = this.getTranslatedText('matchTacticsButton');
                tacImgDiv.appendChild(img);
                tacBtn.appendChild(tacImgDiv);

                tacBtn.addEventListener('mouseover', () => {
                    tacImgDiv.style.display = 'block';
                    this.procTacImg(img, tacImgDiv);
                });
                tacBtn.addEventListener('mouseout', () => (tacImgDiv.style.display = 'none'));

                dv.innerHTML = `<strong>${m.r}</strong><br>${m.ht} ${m.hs} - ${m.as} ${m.at}<br><a href="https://www.managerzone.com${m.lk}" target="_blank">${this.getTranslatedText('matchDetailsLink')}</a>`;
                dv.appendChild(tdLnk);
                dv.appendChild(tacBtn);
                return dv;
            } catch (e) {
                console.error(this.getTranslatedText('errorCreatingMatchElement'), e);
                return null;
            }
        },

        extrMID(lnk) {
            return new URLSearchParams(lnk.split('?')[1]).get('mid');
        },

        rendMatches() {
            try {
                const uSel = this.mainMdl.querySelector('#user-select');
                const onlyAway = this.mainMdl.querySelector('#away-only').checked;
                const cont = this.mainMdl.querySelector('#matches-container');
                cont.innerHTML = '';

                if (!this.keyMbrs?.length) {
                    this.getAllMatches().forEach(m => {
                        const mEl = this.mkMatchEl(m);
                        if (mEl) cont.appendChild(mEl);
                    });
                    return;
                }

                const selUser = uSel.value;
                const userObj = this.keyMbrs.find(km => km.un === selUser);
                if (!userObj) return;

                let userMatches = this.getTeamMatches(userObj.tmName);
                if (onlyAway) userMatches = userMatches.filter(m => m.at === userObj.tmName);

                userMatches.forEach(m => {
                    const mEl = this.mkMatchEl(m);
                    if (mEl) cont.appendChild(mEl);
                });
            } catch (e) {
                console.error(this.getTranslatedText('errorRenderingMatches'), e);
            }
        },

        getAllMatches() {
            const ms = [];
            if (!this.prevClashes?.length) return ms;
            this.prevClashes.forEach(c => {
                if (!c.m?.length) return;
                c.m.forEach(m => {
                    try {
                        const [tA, tB] = (m.ts || '').split(' - ').map(t => t?.trim());
                        const [sA, sB] = (m.sc || '').split(' - ').map(s => parseInt(s?.trim(), 10));
                        if (tA && tB && !isNaN(sA) && !isNaN(sB)) {
                            ms.push({ r: c.r, lk: m.lk, ht: tA, at: tB, hs: sA, as: sB });
                        }
                    } catch (e) {
                        console.error(this.getTranslatedText('errorParsingMatch'), e);
                    }
                });
            });
            return ms;
        },

        getTeamMatches(tmName) {
            const ms = [];
            if (!tmName || !this.prevClashes?.length) return ms;
            this.prevClashes.forEach(c => {
                if (!c.m?.length) return;
                c.m.forEach(m => {
                    try {
                        const [tA, tB] = (m.ts || '').split(' - ').map(t => t?.trim());
                        const [sA, sB] = (m.sc || '').split(' - ').map(s => parseInt(s?.trim(), 10));
                        if (tA && tB && !isNaN(sA) && !isNaN(sB) && (tA === tmName || tB === tmName)) {
                            ms.push({ r: c.r, lk: m.lk, ht: tA, at: tB, hs: sA, as: sB });
                        }
                    } catch (e) {
                        console.error(this.getTranslatedText('errorParsingMatch'), e);
                    }
                });
            });
            return ms;
        },

        onBtnClick(uName, km, pc) {
            this.showMainMdl(km, pc, uName);
        },

        addIconsToUNames(km, pc) {
            document.querySelectorAll('table.hitlist.challenges-list tr.odd, table.hitlist.challenges-list tr.even').forEach(row => {
                const firstUNameEl = row.querySelector('a.username, span.username');
                if (!firstUNameEl) return;
                const flagImg = document.createElement('img');
                flagImg.className = 'tiny-img';
                flagImg.src = 'https://flagcdn.com/16x12/tr.png';
                flagImg.style.cssText = 'cursor: pointer; margin-left: 5px;';
                flagImg.onclick = () => this.onBtnClick(firstUNameEl.textContent.trim(), km, pc);
                firstUNameEl.parentNode.insertBefore(flagImg, firstUNameEl.nextSibling);
            });
        },

        addFixPlace() {
            let insTg = document.querySelector('.flex-wrap.challenges-options.box_light.padding');
            let insMeth = 'afterend';
            if (!insTg) {
                insTg = document.querySelector('#page_federations_clash .mainContent') || document.querySelector('.mainContent') || document.body;
                insMeth = 'beforeend';
            }
            if (insTg && !document.getElementById('sezon-fikstur-container')) {
                const fixDiv = document.createElement('div');
                fixDiv.id = 'sezon-fikstur-container';
                fixDiv.style.marginTop = '20px';
                fixDiv.innerHTML = `<p style="text-align:center;font-weight:bold;color:var(--fb-dark-blue);">${this.getTranslatedText('fixtureLoading')}</p>`;
                try {
                    if (insMeth === 'afterend') insTg.insertAdjacentElement('afterend', fixDiv);
                    else insTg.appendChild(fixDiv);
                } catch (e) {
                    console.error(this.getTranslatedText('errorAddingFixturePlaceholder', { method: insMeth, target: insTg.tagName }), e);
                    if (insTg !== document.body) {
                        try {
                            document.body.appendChild(fixDiv);
                        } catch (e2) {
                            console.error(this.getTranslatedText('errorFinalFallbackAppendBody'), e2);
                        }
                    }
                }
            } else if (!insTg) {
                console.error(this.getTranslatedText('errorNoValidFixtureContainer'));
            }
        },

        rendFixTbl(fixD) {
            const cont = document.getElementById('sezon-fikstur-container');
            if (!cont) {
                console.error(this.getTranslatedText('errorFixtureTableRenderContainerNotFound'));
                return;
            }
            if (!fixD || fixD.length === 0) {
                cont.innerHTML = `<p style="text-align:center;color:var(--fb-yellow);">${this.getTranslatedText('fixtureNoData')}</p>`;
                return;
            }

            let totPM = 0,
                totOS = 0,
                totOpS = 0;
            const leagueTable = window.dataExtrInstance?.st?.leagueTable || [];
            let tblHTML = `
    <div id="sezon-fikstur-title">
        ${this.getTranslatedText('fixtureTitle')}
        <span id="fikstur-toggle-icon" class="fas fa-chevron-down"></span>
    </div>
    <table id="fikstur-table">
                    <thead>
                        <tr style="background-color:var(--fb-dark-blue);">
                            <th style="color:var(--fb-yellow);">${this.getTranslatedText('fixtureHeaderRoundNo')}</th>
                            <th style="color:var(--fb-yellow);">${this.getTranslatedText('fixtureHeaderRound')}</th>
                            <th style="color:var(--fb-yellow);">${this.getTranslatedText('fixtureHeaderRoundDate')}</th>
                            <th style="color:var(--fb-yellow);">${this.getTranslatedText('fixtureHeaderOpponent')}</th>
                            <th style="color:var(--fb-yellow); text-align:center;">${this.getTranslatedText('fixtureHeaderLeagueRank')}</th>
                            <th style="color:var(--fb-yellow);">${this.getTranslatedText('fixtureHeaderScore')}</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            fixD.forEach((fx, idx) => {
                const bgC = idx % 2 === 0 ? 'rgba(4,30,66,0.8)' : 'rgba(10,40,80,0.8)';
                const opName = fx.opponentName || this.getTranslatedText('fixtureUnknown');
                const opLnk = fx.opponentId ? `<a href="/?p=federations&fid=${fx.opponentId}" target="_blank" title="${opName}" style="color:var(--fb-yellow);text-decoration:none;">${opName}</a>` : opName;
                const dispSc = fx.score === null || fx.score === undefined || String(fx.score).toUpperCase() === 'NAN - NAN' ? 'X - X' : fx.score;
                let scSpnSty = 'color:white;';

                if (dispSc !== 'X - X') {
                    if (fx.resultType === 'win') scSpnSty = 'background-color:rgba(0,200,0,0.5);color:white;';
                    else if (fx.resultType === 'draw') scSpnSty = 'background-color:#FFED00;color:black;';
                    else if (fx.resultType === 'loss') scSpnSty = 'background-color:#930000;color:white;';
                    const scoreParts = String(dispSc).split(' - ');
                    if (scoreParts.length === 2) {
                        const s1 = Number(scoreParts[0]),
                            s2 = Number(scoreParts[1]);
                        if (!isNaN(s1) && !isNaN(s2)) {
                            totPM++;
                            totOS += s1;
                            totOpS += s2;
                        }
                    }
                }

                const opponentDataInLeague = fx.opponentId && leagueTable.length > 0 ? leagueTable.find(team => String(team.fedId).trim() === String(fx.opponentId).trim()) : null;
                const opponentRankDisplay = opponentDataInLeague?.rank || '-';

                tblHTML += `
                    <tr style="background-color:${bgC};" onmouseover="this.style.backgroundColor='var(--fb-light-blue)';" onmouseout="this.style.backgroundColor='${bgC}';">
                        <td style="padding:6px 8px;text-align:center;color:white;border-bottom:1px solid rgba(255,237,0,0.2);">${idx + 1}</td>
                        <td style="padding:6px 8px;text-align:center;color:white;border-bottom:1px solid rgba(255,237,0,0.2);">${fx.round || this.getTranslatedText('fixtureUnknown')}</td>
                        <td style="padding:6px 8px;text-align:center;color:white;border-bottom:1px solid rgba(255,237,0,0.2);">${fx.roundDate || this.getTranslatedText('fixtureDateUnknown')}</td>
                        <td style="padding:6px 8px;text-align:left;color:white;border-bottom:1px solid rgba(255,237,0,0.2);" data-opponent-id="${fx.opponentId || ''}" data-opponent-name="${fx.opponentName || ''}">${opLnk}</td>
                        <td style="padding:6px 8px;text-align:center;color:white;border-bottom:1px solid rgba(255,237,0,0.2);">${opponentRankDisplay}</td>
                        <td style="padding:6px 8px;text-align:center;font-weight:bold;border-bottom:1px solid rgba(255,237,0,0.2);"><span style="display:inline-block;padding:2px 6px;border-radius:4px;${scSpnSty}">${dispSc}</span></td>
                    </tr>
                `;
            });

            const avgOS = totPM > 0 ? (totOS / totPM).toFixed(1) : '0.0';
            const avgOpS = totPM > 0 ? (totOpS / totPM).toFixed(1) : '0.0';

            tblHTML += `
                    <tr class="average-score-row" style="background-color:rgba(4,30,66,0.9);color:var(--fb-yellow);font-weight:bold;">
                        <td colspan="5" style="text-align:right;padding:8px 10px;border-right:1px solid var(--fb-yellow);">${this.getTranslatedText('fixtureAvgScore', { count: totPM })}</td>
                        <td style="text-align:center;padding:8px 10px;border-left:1px solid var(--fb-yellow);"><span style="display:inline-block;padding:2px 6px;border-radius:4px;background-color:var(--fb-yellow);color:var(--fb-dark-blue);">${avgOS} - ${avgOpS}</span></td>
                    </tr>
                </tbody></table>
            `;
            cont.innerHTML = tblHTML;
            cont.classList.add('fikstur-collapsed');

            cont.querySelectorAll('td[data-opponent-id]').forEach(cell => {
                const oppId = cell.dataset.opponentId;
                let oppName = cell.dataset.opponentName || (oppId && window.dataExtrInstance?.st.allFeds ? window.dataExtrInstance.st.allFeds.get(String(oppId)) : UI.getTranslatedText('fixtureUnknown'));
                if (oppId && oppId !== 'null') {
                    cell.addEventListener('mouseover', event => UI.showOpponentTooltip(event, oppId, oppName));
                    cell.addEventListener('mouseout', () => UI.hideOpponentTooltip());
                }
            });

            cont.querySelector('#sezon-fikstur-title')?.addEventListener('click', () => cont.classList.toggle('fikstur-collapsed'));
        },

        addLangSwitcher() {
            const selCont = document.querySelector('.fb-selection-container');
            if (!selCont) return;

            const langDiv = document.createElement('div');
            langDiv.id = 'language-switcher-container';

            langDiv.innerHTML = `
                <label for="language-select">${this.getTranslatedText('languageSwitcherTitle')}</label>
                <select id="language-select">
                    <option value="tr">${this.getTranslatedText('languageLabelTR')}</option>
                    <option value="en">${this.getTranslatedText('languageLabelEN')}</option>
                    <option value="es">${this.getTranslatedText('languageLabelES')}</option>
                </select>
            `;
            langDiv.querySelector('#language-select').value = this._currentLang;
            langDiv.querySelector('#language-select').addEventListener('change', e => this.setLanguage(e.target.value));

            document.getElementById('language-switcher-container')?.remove();
            selCont.parentNode.insertBefore(langDiv, selCont.nextSibling);
        },

        getSafeSheetName(textKey) {
            let name = this.getTranslatedText(textKey);
            return name.replace(/[\\/?*[\]]/g, '_').substring(0, 31);
        },

        showOpponentTooltip(event, opponentFedId, opponentFedName) {
            if (!window.dataExtrInstance?.st.allFederationMatches) return;
            const opponentIdStr = String(opponentFedId);
            const opponentMatches = window.dataExtrInstance.st.allFederationMatches.get(opponentIdStr);

            if (!this.opponentTooltipElement) {
                this.opponentTooltipElement = document.createElement('div');
                this.opponentTooltipElement.className = 'opponent-matches-tooltip';
                document.body.appendChild(this.opponentTooltipElement);
            }

            const actualOpponentName = opponentFedName || window.dataExtrInstance.st.allFeds.get(opponentIdStr) || UI.getTranslatedText('fixtureUnknown');
            let tooltipHTML = `<div class="tooltip-title">${UI.getTranslatedText('tooltipOpponentMatchesTitle', { fedName: actualOpponentName })}</div>`;

            if (opponentMatches && opponentMatches.length > 0) {
                tooltipHTML += '<ul>';
                opponentMatches.forEach(match => {
                    const opponentIdString = String(match.opponentFedId);
                    const vsOpponentName = window.dataExtrInstance.st.allFeds.get(opponentIdString) || match.opponentFedName || UI.getTranslatedText('tooltipUnknownOpponent');
                    const scoreDisplay = UI.getTranslatedText('tooltipScoreFormat', { own: match.ownScore ?? 'X', opp: match.opponentScore ?? 'X' });
                    tooltipHTML += `<li><span class="match-info"><span class="match-round">R.${match.roundNumber}:</span> ${vsOpponentName}</span><span class="match-score-venue"><span class="match-score">${scoreDisplay}</span></span></li>`;
                });
                tooltipHTML += '</ul>';
            } else {
                tooltipHTML += `<p class="tooltip-no-data">${UI.getTranslatedText('tooltipNoData')}</p>`;
            }
            this.opponentTooltipElement.innerHTML = tooltipHTML;

            const targetRect = event.currentTarget.getBoundingClientRect();
            let x = targetRect.left + window.scrollX + targetRect.width / 2;
            let y = targetRect.bottom + window.scrollY + 5;
            this.opponentTooltipElement.style.display = 'block';
            const tooltipRect = this.opponentTooltipElement.getBoundingClientRect();
            if (x + tooltipRect.width / 2 > window.innerWidth - 10) x = window.innerWidth - tooltipRect.width / 2 - 10;
            if (x - tooltipRect.width / 2 < 10) x = tooltipRect.width / 2 + 10;
            if (y + tooltipRect.height > window.innerHeight - 10) y = targetRect.top + window.scrollY - tooltipRect.height - 5;
            this.opponentTooltipElement.style.left = `${x - tooltipRect.width / 2}px`;
            this.opponentTooltipElement.style.top = `${y}px`;
        },

        hideOpponentTooltip() {
            if (this.opponentTooltipElement) this.opponentTooltipElement.style.display = 'none';
        },
    };

    class FedState {
        constructor() {
            this.fInfo = { ownFid: null, divLvl: null, divNum: null, actRnd: null };
            this.allFeds = new Map();
            this.ownKeyMbrs = [];
            this.actM = { opId: null, opName: null, keyMbrs: [], prevClashData: [] };
            this.allFedClashData = [];
            this.sFixture = [];
            this.currentRoundSchedule = { roundTitle: '', matches: [] };
            this.leagueTable = [];
            this.allFederationMatches = new Map();
        }
    }

    class DataExtr {
        constructor() {
            this.st = new FedState();
        }

        async getCurSzn(d) {
            const sSel = d.querySelector('#season-select option[selected]');
            return sSel ? `${sSel.getAttribute('data-season')}.${sSel.getAttribute('data-sub-season')}` : null;
        }

        getRndNum(rTitle) {
            const m = rTitle?.match(/\d+/);
            return m ? parseInt(m[0], 10) : 0;
        }

        async _fetchAndParseLeagueTableFromSubLeague(url) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const html = await response.text();
                    return await this.extractLeagueTable(new DOMParser().parseFromString(html, 'text/html'));
                }
                console.warn(`Lig tablosu sayfası (sub=league) yüklenemedi: ${response.status}`);
            } catch (e) {
                console.error(`Lig tablosu (sub=league) çekilirken/ayrıştırılırken hata:`, e);
            }
            return [];
        }

        async _fetchAndParseLeagueTableFromSubSchedule(schedulePageDoc) {
            return await this.extractCurrentRoundSchedule(schedulePageDoc);
        }

        async extractLeagueTable(leaguePageDoc) {
            const leagueTableData = [];
            let tableNode = null;
            const headers = leaguePageDoc.querySelectorAll('h2.subheader.clearfix');
            for (const header of headers) {
                if (header.textContent.trim() === 'Tablo') {
                    let currentElement = header.nextElementSibling;
                    while (currentElement) {
                        if (currentElement.classList?.contains('mainContent')) {
                            tableNode = currentElement.querySelector('table.nice_table');
                            if (tableNode) break;
                        }
                        currentElement = currentElement.nextElementSibling;
                    }
                    if (tableNode) break;
                }
            }

            if (!tableNode) {
                const allNiceTables = leaguePageDoc.querySelectorAll('table.nice_table');
                if (allNiceTables.length > 0) tableNode = allNiceTables[allNiceTables.length - 1];
            }

            if (!tableNode) {
                console.warn(UI.getTranslatedText('fixtureDataUnavailable') + ' (Lig puan durumu tablosu AJAX yanıtında bulunamadı).');
                return (this.st.leagueTable = []);
            }

            tableNode.querySelectorAll('tbody tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const rank = parseInt(cells[0]?.textContent.trim().replace('.', ''), 10);
                    const fedLinkElement = cells[1]?.querySelector('a.fed_link');
                    const fedName = fedLinkElement?.getAttribute('title') || fedLinkElement?.textContent.trim();
                    const fedIdMatch = fedLinkElement?.getAttribute('href')?.match(/fid=(\d+)/);
                    if (fedIdMatch && fedName && !isNaN(rank)) {
                        leagueTableData.push({ rank: rank, fedId: fedIdMatch[1], fedName: fedName });
                    }
                }
            });
            return (this.st.leagueTable = leagueTableData);
        }

        async extractCurrentRoundSchedule(d) {
            const leagueTableData = [];
            let tableNode;
            const headers = d.querySelectorAll('h2.subheader');
            for (const header of headers) {
                if (header.textContent.trim() === UI.getTranslatedText('fixtureHeaderScore')) {
                    const mainContentDiv = header.nextElementSibling;
                    if (mainContentDiv?.classList.contains('mainContent')) {
                        tableNode = mainContentDiv.querySelector('table.nice_table');
                        if (tableNode) break;
                    }
                }
            }
            if (!tableNode) tableNode = d.querySelector('table.nice_table');
            if (!tableNode) {
                console.warn(UI.getTranslatedText('fixtureDataUnavailable') + ' (lig tablosu bulunamadı).');
                return (this.st.leagueTable = []);
            }

            tableNode.querySelectorAll('tbody tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 7) return;
                const fedLinkElement = cells[1]?.querySelector('a.fed_link');
                const fedNameLong = cells[1]?.querySelector('.federations-responsive-hide a.fed_link');
                const fedName = fedNameLong?.getAttribute('title') || fedNameLong?.textContent.trim() || fedLinkElement?.getAttribute('title') || fedLinkElement?.textContent.trim();
                const fedIdMatch = fedLinkElement?.getAttribute('href')?.match(/fid=(\d+)/);

                leagueTableData.push({
                    rank: cells[0]?.textContent.trim(),
                    fedId: fedIdMatch ? fedIdMatch[1] : null,
                    fedName,
                    clashesWon: cells[2]?.textContent.trim(),
                    clashesDrawn: cells[3]?.textContent.trim(),
                    clashesLost: cells[4]?.textContent.trim(),
                    ebp: cells[5]?.textContent.trim(),
                    points: cells[6]?.textContent.trim(),
                    last6: cells.length > 7 ? cells[7]?.textContent.trim() : '',
                });
            });
            return (this.st.leagueTable = leagueTableData);
        }

        async getCurRnd(d) {
            const tbls = Array.from(d.querySelectorAll('table.hitlist'));
            for (const t of tbls) {
                if (t.querySelector('div.textCenter')) {
                    const rTE = t.closest('div.mainContent')?.previousElementSibling;
                    if (rTE) return this.getRndNum(rTE.textContent.trim());
                }
            }
            if (tbls.length > 0) {
                const rTE = tbls[tbls.length - 1].closest('div.mainContent')?.previousElementSibling;
                if (rTE) return this.getRndNum(rTE.textContent.trim());
            }
            return 0;
        }

        async needsUpd(d) {
            const curS = await this.getCurSzn(d);
            if (!curS) return true;
            if (curS !== SM.gcs()) {
                SM.cpt();
                return true;
            }
            const curR = await this.getCurRnd(d);
            const procRs = SM.gpt();
            if (procRs.length === 0) return true;
            if (curR === 0) return false;
            return curR - 1 > Math.max(...procRs, 0);
        }

        async ldCache() {
            const s = await SM.ld();
            if (s) {
                this.st = s;
                return true;
            }
            return false;
        }

        async svCache(curS, curR) {
            if (curR === 0) return;
            await SM.sv(this.st);
            SM.scs(curS);
            const procRs = SM.gpt();
            const uniRs = [...new Set(this.st.actM.prevClashData.map(c => this.getRndNum(c.r)))];
            uniRs.forEach(r => {
                if (r > 0 && !procRs.includes(r)) SM.apt(r);
            });
        }

        extrFedLnk(lnk) {
            const hr = lnk.getAttribute('href');
            if (!hr) return null;
            const fidM = hr.match(/fid=(\d+)/);
            return fidM ? { i: fidM[1], n: lnk.getAttribute('title') || lnk.textContent.trim() } : null;
        }

        getFedBasics(d) {
            // URL'den fid parametresini kontrol et
            const urlParams = new URLSearchParams(window.location.search);
            const urlFid = urlParams.get('fid');
            // Sayfadaki dropdown değerini al
            const selVal = d.querySelector('#federation-select')?.value ?? null;

            // Eğer URL'de ID varsa onu kullan, yoksa dropdown'ı kullan
            const targetFid = urlFid || selVal;

            const divLnk = d.querySelector('a[title^="Division"], a[title^="Elite"]');
            if (!divLnk) return false;
            const hr = divLnk.getAttribute('href');
            const lvlM = hr.match(/level=(\d+)/);
            const divM = hr.match(/div=(\d+)/);
            const isE = divLnk.title.startsWith('Elite');
            if (!isE && (!lvlM || !divM)) return false;

            // targetFid değişkenini buraya atıyoruz
            this.st.fInfo.ownFid = targetFid;

            this.st.fInfo.divLvl = isE ? '1' : lvlM[1];
            this.st.fInfo.divNum = isE ? '1' : divM[1];
            return true;
        }

        async getMgrData(uName) {
            try {
                const rsp = await fetch(U.MD(uName));
                if (!rsp.ok) throw new Error(`HTTP error! status: ${rsp.status}`);
                const xmlD = new DOMParser().parseFromString(await rsp.text(), 'text/xml');
                if (xmlD.querySelector('parsererror')) {
                    console.error(UI.getTranslatedText('errorXMLParse', { username: uName }), xmlD.querySelector('parsererror').textContent);
                    return null;
                }
                const uData = xmlD.querySelector('UserData');
                const fTeam = xmlD.querySelector('Team[sport="soccer"]');
                return uData && fTeam ? { un: uData.getAttribute('username'), ui: uData.getAttribute('userId'), tmName: fTeam.getAttribute('teamName'), tmId: fTeam.getAttribute('teamId') } : null;
            } catch (e) {
                console.error(UI.getTranslatedText('errorFetchManagerData', { username: uName }), e);
                return null;
            }
        }

        async getFedKeyMbrs(fId) {
            try {
                const rsp = await fetch(U.F(fId));
                if (!rsp.ok) throw new Error(`HTTP error! status: ${rsp.status}`);
                const d = new DOMParser().parseFromString(await rsp.text(), 'text/html');
                const mTbl = d.querySelector('#federation_clash_members_list');
                if (!mTbl) return [];

                const km = [];
                const mProms = Array.from(mTbl.querySelectorAll('tr.a, tr.b')).map(row => {
                    const uLnk = row.querySelector('a[href*="uid"]');
                    if (uLnk) {
                        const uName = uLnk.textContent.trim();
                        return this.getMgrData(uName)
                            .then(data => data && km.push(data))
                            .catch(err => console.error(UI.getTranslatedText('errorProcessingMember', { username: uName }), err));
                    }
                    return Promise.resolve();
                });
                await Promise.all(mProms);
                return km;
            } catch (e) {
                console.error(UI.getTranslatedText('errorFetchFedMembers', { fedId: fId }), e);
                return [];
            }
        }

        async getOwnFedKeyMbrs(fId) {
            return this.getFedKeyMbrs(fId);
        }

        async getClashMatches(cUrl) {
    try {
        const rsp = await fetch(`https://www.managerzone.com${cUrl}`);
        if (!rsp.ok) throw new Error(`HTTP error! status: ${rsp.status}`);
        const d = new DOMParser().parseFromString(await rsp.text(), 'text/html');
        const mTbl = d.querySelector('#latest-challenges table.hitlist');
        if (!mTbl) return [];

        const ms = [];
        mTbl.querySelectorAll('tr').forEach(tr => {
            const mLnkEl = tr.querySelector('.challenge-link__name');
            const tsEl = mLnkEl?.querySelector('span.nobr');
            const scEl = tr.querySelector('.latest-challenges__cell.textCenter span.nobr');
            if (tsEl && scEl && mLnkEl) {
                // Hatalı filtreleme bloku buradan kaldırıldı.
                ms.push({ ts: tsEl.textContent.trim(), sc: scEl.textContent.trim(), lk: mLnkEl.getAttribute('href') });
            }
        });
        return ms;
    } catch (e) {
        console.error(UI.getTranslatedText('errorFetchClashMatches', { url: cUrl }), e);
        return [];
    }
}

        findOpInRow(row) {
            return Array.from(row.querySelectorAll('a.fed_link')).some(lnk => this.extrFedLnk(lnk)?.i === this.st.actM.opId);
        }

        findOwnInRow(row) {
            return Array.from(row.querySelectorAll('a.fed_link')).some(lnk => this.extrFedLnk(lnk)?.i === this.st.fInfo.ownFid);
        }

        extrClashInfo(row, rTitle) {
            const cLnk = row.querySelector('td:nth-child(2) a');
            if (!cLnk) return null;
            const opHome = row.querySelector('a.fed_link')?.getAttribute('href')?.includes(`fid=${this.st.actM.opId}`);
            return { r: rTitle, lk: cLnk.getAttribute('href'), sc: cLnk.textContent.trim(), oh: opHome === true, m: [] };
        }

        procClashRow(row) {
            let ownFound = false,
                op = null;
            row.querySelectorAll('a.fed_link').forEach(lnk => {
                const fed = this.extrFedLnk(lnk);
                if (fed) {
                    if (fed.i === this.st.fInfo.ownFid) ownFound = true;
                    else op = fed;
                }
            });
            return ownFound && op ? op : null;
        }

        findActClash(tbl) {
            for (const row of tbl.querySelectorAll('tr')) {
                const op = this.procClashRow(row);
                if (op) return op;
            }
            return null;
        }

        extrSchedData(d) {
            const tbls = Array.from(d.querySelectorAll('table.hitlist'));
            let actRndIdx = -1;
            for (let i = 0; i < tbls.length; i++) {
                if (tbls[i].querySelector('div.textCenter')) {
                    actRndIdx = i;
                    const rTE = tbls[i].closest('div.mainContent')?.previousElementSibling;
                    if (rTE) {
                        this.st.fInfo.actRnd = rTE.textContent.trim();
                        const op = this.findActClash(tbls[i]);
                        if (op) (this.st.actM.opId = op.i), (this.st.actM.opName = op.n);
                    }
                    break;
                }
            }
            if (actRndIdx === -1 && tbls.length > 0) {
                actRndIdx = tbls.length - 1;
                const rTE = tbls[actRndIdx].closest('div.mainContent')?.previousElementSibling;
                if (rTE) {
                    this.st.fInfo.actRnd = rTE.textContent.trim();
                    const op = this.findActClash(tbls[actRndIdx]);
                    if (op) (this.st.actM.opId = op.i), (this.st.actM.opName = op.n);
                }
            }
            if (this.st.actM.opId) {
                const opAllClashes = [];
                for (let i = 0; i <= actRndIdx; i++) {
                    const t = tbls[i];
                    const rTE = t.closest('div.mainContent')?.previousElementSibling;
                    if (!rTE) continue;
                    const rTitle = rTE.textContent.trim();
                    if (this.getRndNum(rTitle) > 0) {
                        t.querySelectorAll('tr').forEach(row => {
                            if (this.findOpInRow(row)) {
                                const cInfo = this.extrClashInfo(row, rTitle);
                                if (cInfo) opAllClashes.push(cInfo);
                            }
                        });
                        t.querySelectorAll('a.fed_link').forEach(lnk => {
                            const fed = this.extrFedLnk(lnk);
                            if (fed && !this.st.allFeds.has(fed.i)) this.st.allFeds.set(fed.i, fed.n);
                        });
                    }
                }
                this.st.actM.prevClashData = opAllClashes.sort((a, b) => this.getRndNum(a.r) - this.getRndNum(b.r));
            } else {
                this.st.actM.prevClashData = [];
            }
            if (this.st.fInfo.ownFid) {
                const ownFName = d.querySelector(`#federation-select option[value="${this.st.fInfo.ownFid}"]`)?.textContent || 'Kendi Federasyon';
                this.st.allFeds.set(this.st.fInfo.ownFid, ownFName);
            }
        }

        collAllFeds(d) {
            const af = new Map();
            d.querySelectorAll('a.fed_link').forEach(l => {
                const f = this.extrFedLnk(l);
                if (f?.i) af.set(f.i, f.n);
            });
            const ofi = d.querySelector('#federation-select')?.value;
            const ofo = ofi ? d.querySelector(`#federation-select option[value="${ofi}"]`) : null;
            if (ofi && ofo && !af.has(ofi)) {
                af.set(ofi, ofo.textContent.trim().replace('Our challenges', '').trim() || 'Kendi Federasyon');
            }
            return Array.from(af, ([i, n]) => ({ i, n }));
        }

        async procAllClashPages() {
            if (!this.st.actM?.prevClashData?.length) return;
            let proc = 0;
            const totalClashes = this.st.actM.prevClashData.length;
            NProgress.set(0.7);
            for (const c of this.st.actM.prevClashData) {
                if (this.getRndNum(c.r) > 0 && c.lk) {
                    UI.setStat('progressStatusRoundOpponentMatches', { round: c.r });
                    try {
                        c.m = await this.getClashMatches(c.lk);
                    } catch (e) {
                        console.error(UI.getTranslatedText('errorFetchMatchesForClash', { link: c.lk }), e);
                        c.m = [];
                    }
                    proc++;
                    NProgress.set(0.7 + (proc / totalClashes) * 0.1);
                } else {
                    c.m = [];
                }
            }
        }

        async getAllFedClashes() {
            const schedRsp = await fetch(U.T(this.st.fInfo.divLvl, this.st.fInfo.divNum));
            if (!schedRsp.ok) throw new Error(UI.getTranslatedText('errorFetchSchedule', { status: schedRsp.status }));
            const schedD = new DOMParser().parseFromString(await schedRsp.text(), 'text/html');
            const tbls = Array.from(schedD.querySelectorAll('table.hitlist'));
            const allClashes = [];
            let actRndIdx = tbls.findIndex(t => t.querySelector('div.textCenter'));
            if (actRndIdx === -1) actRndIdx = tbls.length - 1;

            for (let i = 0; i <= actRndIdx; i++) {
                const t = tbls[i];
                const rTE = t.closest('div.mainContent')?.previousElementSibling;
                if (!rTE) continue;
                const rTitle = rTE.textContent.trim();
                if (this.getRndNum(rTitle) > 0) {
                    t.querySelectorAll('tr').forEach(row => {
                        if (this.findOwnInRow(row)) {
                            const cLnk = row.querySelector('td:nth-child(2) a');
                            if (!cLnk) return;
                            const opHome = row.querySelector('a.fed_link')?.href.includes(`fid=${this.st.fInfo.ownFid}`) === false;
                            allClashes.push({ r: rTitle, lk: cLnk.getAttribute('href'), sc: cLnk.textContent.trim(), oh: opHome, m: [] });
                        }
                    });
                }
            }
            allClashes.sort((a, b) => this.getRndNum(a.r) - this.getRndNum(b.r));

            let proc = 0;
            const totalClashesCount = allClashes.length;
            if (totalClashesCount > 0) NProgress.set(0.8);

            for (const c of allClashes) {
                if (c.lk) {
                    UI.setStat('progressStatusRoundOwnMatches', { round: c.r });
                    try {
                        c.m = await this.getClashMatches(c.lk);
                    } catch (e) {
                        console.error(UI.getTranslatedText('errorFetchMatchesForClash', { link: c.lk }), e);
                        c.m = [];
                    }
                    proc++;
                    if (totalClashesCount > 0) NProgress.set(0.8 + (proc / totalClashesCount) * 0.15);
                } else {
                    c.m = [];
                }
            }
            return allClashes;
        }

        _addMatchToAllFederationMatches(currentFedId, currentFedName, roundTitle, roundNumber, opponentOfCurrentFedId, opponentOfCurrentFedName, scoreOfCurrentFed, scoreOfOpponent, isCurrentFedHome, matchLink) {
            if (!currentFedId || !opponentOfCurrentFedId) return;
            const fedIdStr = String(currentFedId);
            if (!this.st.allFederationMatches.has(fedIdStr)) {
                this.st.allFederationMatches.set(fedIdStr, []);
            }
            const fedMatches = this.st.allFederationMatches.get(fedIdStr);
            const existingMatch = fedMatches.find(m => m.roundNumber === roundNumber && String(m.opponentFedId) === String(opponentOfCurrentFedId) && m.isHome === isCurrentFedHome);
            if (existingMatch) return;

            fedMatches.push({
                roundTitle: roundTitle,
                roundNumber: roundNumber,
                opponentFedId: String(opponentOfCurrentFedId),
                opponentFedName: opponentOfCurrentFedName || UI.getTranslatedText('fixtureUnknown'),
                ownScore: scoreOfCurrentFed,
                opponentScore: scoreOfOpponent,
                isHome: isCurrentFedHome,
                matchLink: matchLink,
            });
        }

        async populateAllFederationMatchesFromSchedule(schedD) {
            this.st.allFederationMatches.clear();
            const tbls = Array.from(schedD.querySelectorAll('table.hitlist'));
            tbls.forEach(t => {
                const rTE = t.closest('div.mainContent')?.previousElementSibling;
                if (!rTE) return;
                const rTitle = rTE.textContent.trim();
                const rNo = this.getRndNum(rTitle);
                if (rNo > 0) {
                    t.querySelectorAll('tr').forEach(row => {
                        if (row.cells.length < 3) return;
                        const fed1Info = this.extrFedLnk(row.cells[0].querySelector('a.fed_link'));
                        const fed2Info = this.extrFedLnk(row.cells[2].querySelector('a.fed_link'));
                        const cLnkEl = row.cells[1].querySelector('a');
                        const scoreText = cLnkEl ? cLnkEl.textContent.trim() : null;
                        if (fed1Info?.i && fed2Info?.i && scoreText?.includes(' - ')) {
                            const [score1Str, score2Str] = scoreText.split(' - ').map(s => s.trim());
                            const score1 = score1Str.toUpperCase() === 'X' ? null : parseInt(score1Str, 10);
                            const score2 = score2Str.toUpperCase() === 'X' ? null : parseInt(score2Str, 10);
                            const matchDetailLink = cLnkEl.getAttribute('href');
                            if ((!isNaN(score1) || score1 === null) && (!isNaN(score2) || score2 === null)) {
                                this._addMatchToAllFederationMatches(fed1Info.i, fed1Info.n, rTitle, rNo, fed2Info.i, fed2Info.n, score1, score2, true, matchDetailLink);
                                this._addMatchToAllFederationMatches(fed2Info.i, fed2Info.n, rTitle, rNo, fed1Info.i, fed1Info.n, score2, score1, false, matchDetailLink);
                            }
                        }
                    });
                }
            });
            this.st.allFederationMatches.forEach(matches => matches.sort((a, b) => a.roundNumber - b.roundNumber));
        }

        extrAllSFixture(d) {
            const fix = [];
            const ownFid = this.st.fInfo.ownFid;
            if (!ownFid) {
                console.error(UI.getTranslatedText('errorParsingFixtureOwnFedIdUnknown'));
                return [];
            }
            d.querySelectorAll('table.hitlist').forEach(t => {
                const rTE = t.closest('div.mainContent')?.previousElementSibling;
                const rTitle = rTE?.textContent.trim() || `Tur ${fix.length + 1}`;
                const rNo = this.getRndNum(rTitle) || fix.length + 1;
                const tParts = rTE?.textContent.trim().split(' - ');
                let rDate = tParts?.length > 1 ? tParts[1].trim().split(' ')[0].split('-').reverse().join('.') : UI.getTranslatedText('fixtureDateUnknown');

                t.querySelectorAll('tr').forEach(row => {
                    let opFed = null,
                        ownFound = false;
                    row.querySelectorAll('a.fed_link').forEach(l => {
                        const fed = this.extrFedLnk(l);
                        if (fed) {
                            if (fed.i === ownFid) ownFound = true;
                            else opFed = { i: fed.i, n: fed.n || l.textContent.trim() };
                        }
                    });

                    if (ownFound && opFed) {
                        const sc = row.querySelector('td:nth-child(2) a')?.textContent.trim();
                        let scDisp = null,
                            resType = null;
                        if (sc?.includes('-')) {
                            const [hS, aS] = sc.split('-').map(Number);
                            const ownHome = row.querySelector(`a.fed_link[href*="fid=${ownFid}"]`) === row.querySelectorAll('a.fed_link')[0];
                            const ownScore = ownHome ? hS : aS;
                            const oppScore = ownHome ? aS : hS;
                            resType = ownScore > oppScore ? 'win' : ownScore < oppScore ? 'loss' : 'draw';
                            scDisp = `${ownScore} - ${oppScore}`;
                        }
                        fix.push({ round: `${UI.getTranslatedText('fixtureHeaderRound')} ${rNo}`, roundNumber: rNo, roundDate: rDate, opponentId: opFed.i, opponentName: opFed.n, score: scDisp, resultType: resType });
                    }
                });
            });
            return fix.sort((a, b) => a.roundNumber - b.roundNumber);
        }

        async init() {
            try {
                UI.setStat('progressStatusCheckingFedData');
                NProgress.start();
                if (GM_S_VER !== OLD_S_VER) (SM.co(), GM_setValue('scriptVersion', OLD_S_VER));
                if (!this.getFedBasics(document)) throw new Error(UI.getTranslatedText('errorBasicFedInfo'));

                this.st.leagueTable = [];
                const ajaxLeagueTableUrl = `https://www.managerzone.com/ajax.php?p=federations&sub=league&level=${this.st.fInfo.divLvl}&div=${this.st.fInfo.divNum}&sport=soccer`;
                let primaryLeagueTableData = await this._fetchAndParseLeagueTableFromSubLeague(ajaxLeagueTableUrl);
                if (primaryLeagueTableData?.length > 0) this.st.leagueTable = primaryLeagueTableData;

                const schedRsp = await fetch(U.T(this.st.fInfo.divLvl, this.st.fInfo.divNum));
                if (!schedRsp.ok) throw new Error(UI.getTranslatedText('errorFetchSchedule', { status: schedRsp.status }));
                const schedD = new DOMParser().parseFromString(await schedRsp.text(), 'text/html');

                if (!(this.st.leagueTable?.length > 0)) {
                    let fallbackLeagueTableData = await this._fetchAndParseLeagueTableFromSubSchedule(schedD);
                    if (fallbackLeagueTableData?.length > 0) this.st.leagueTable = fallbackLeagueTableData;
                }

                if (!Array.isArray(this.st.leagueTable)) this.st.leagueTable = [];
                console.log('Kullanılacak nihai lig tablosu verisi:', JSON.parse(JSON.stringify(this.st.leagueTable)));

                this.st.sFixture = this.extrAllSFixture(schedD);
                await this.populateAllFederationMatchesFromSchedule(schedD);
                SM.saf(this.collAllFeds(schedD));
                this.extrSchedData(schedD);

                const needsRef = await this.needsUpd(schedD);
                const curS = await this.getCurSzn(schedD);
                const curR = await this.getCurRnd(schedD);

                if (!needsRef) {
                    UI.setStat('progressStatusLoadingCache');
                    NProgress.set(0.3);
                    const ld = await this.ldCache();
                    if (ld) {
                        UI.setStat('progressStatusCacheLoaded');
                        if (!this.st.sFixture?.length) this.st.sFixture = this.extrAllSFixture(schedD);
                        if (!this.st.leagueTable?.length && ld.leagueTable?.length > 0) this.st.leagueTable = ld.leagueTable;
                        NProgress.set(0.95);
                    } else {
                        UI.setStat('progressStatusCacheFail');
                        await this.fetchProcData(schedD, curS, curR);
                        await this.svCache(curS, curR);
                    }
                } else {
                    UI.setStat('progressStatusUpdatingData');
                    SM.cpt();
                    await this.fetchProcData(schedD, curS, curR);
                    await this.svCache(curS, curR);
                }
                UI.setStat('progressStatusDataReady');
                NProgress.done();
                UI.clear();
            } catch (e) {
                console.error(UI.getTranslatedText('errorInit'), e);
                UI.setStat('progressStatusError', { message: e.message });
                NProgress.done();
                UI.clear();
            }
        }

        async fetchProcData(schedD, curS, curR) {
            NProgress.set(0.5);
            UI.setStat('progressStatusLoadingOwnFedMembers');
            this.st.ownKeyMbrs = this.st.fInfo.ownFid ? await this.getOwnFedKeyMbrs(this.st.fInfo.ownFid) : [];
            NProgress.set(0.6);
            UI.setStat('progressStatusLoadingOpponentFedMembers');
            this.st.actM.keyMbrs = this.st.actM.opId ? await this.getFedKeyMbrs(this.st.actM.opId) : [];
            NProgress.set(0.7);
            UI.setStat('progressStatusLoadingOpponentClashMatches');
            await this.procAllClashPages();
            NProgress.set(0.8);
            UI.setStat('progressStatusLoadingAllPastFedClashes');
            this.st.allFedClashData = await this.getAllFedClashes();
            NProgress.set(0.95);
        }
    }

    function cmpVers(v1, v2) {
        if (!v1 || !v2) return 0;
        const p1 = v1.split('.').map(Number);
        const p2 = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
            const n1 = p1[i] || 0,
                n2 = p2[i] || 0;
            if (n1 > n2) return 1;
            if (n1 < n2) return -1;
        }
        return 0;
    }

    const lsv = GM_getValue(LSV_KEY, '0');
    UI.init();
    if (cmpVers(CUR_VER, lsv) > 0) {
        UI.showUpdPop(CUR_VER, lsv, CLOG);
    }

    const dataExtr = new DataExtr();
    window.dataExtrInstance = dataExtr;

    dataExtr
        .init()
        .then(async () => {
            UI.ownKeyMbrs = dataExtr.st.ownKeyMbrs;
            UI.opKeyMbrs = dataExtr.st.actM.keyMbrs;
            UI.prevClashes = dataExtr.st.actM.prevClashData;
            UI.allFedClashes = dataExtr.st.allFedClashData;

            if (dataExtr.st.actM?.prevClashData?.length > 0 && dataExtr.st.actM?.keyMbrs?.length > 0) {
                UI.addIconsToUNames(dataExtr.st.actM.keyMbrs, dataExtr.st.actM.prevClashData);
            }

            // 1. Adım: Tabloyu ilk olarak önbellekteki veriyle çizelim.
            if (dataExtr.st.sFixture?.length > 0) {
                UI.rendFixTbl(dataExtr.st.sFixture);
            } else {
                const cont = document.getElementById('sezon-fikstur-container');
                if (cont) cont.innerHTML = `<p style="text-align:center;color:var(--fb-yellow);">${UI.getTranslatedText('fixtureDataUnavailable')}</p>`;
            }

            // *** KESİN ÇÖZÜM: DOĞRU SEÇİCİLER VE ZAMANLAMA KONTROLÜ ***
            const updateFixtureWithLiveScore = () => {
                // 2. Adım: Sizin belirttiğiniz DOĞRU ID'lere sahip elementleri bulalım.
                const homeScoreEl = document.getElementById('score-1');
                const awayScoreEl = document.getElementById('score-2');

                // Elementler henüz sayfada yoksa, işlem yapmadan çık.
                if (!homeScoreEl || !awayScoreEl) {
                    return false;
                }

                try {
                    const homeScore = parseInt(homeScoreEl.textContent.trim(), 10);
                    const awayScore = parseInt(awayScoreEl.textContent.trim(), 10);
                    const currentRoundNumber = dataExtr.getRndNum(dataExtr.st.fInfo.actRnd);
                    const currentFixture = dataExtr.st.sFixture.find(fx => fx.roundNumber === currentRoundNumber);

                    if (currentFixture && !isNaN(homeScore) && !isNaN(awayScore)) {
                        const newScore = `${homeScore} - ${awayScore}`;
                        // Sadece skor farklıysa tabloyu yeniden çizerek güncelle.
                        if (currentFixture.score !== newScore) {
                            currentFixture.score = newScore;
                            currentFixture.resultType = homeScore > awayScore ? 'win' : homeScore < awayScore ? 'loss' : 'draw';
                            UI.rendFixTbl(dataExtr.st.sFixture);
                            console.log(`[ANLIK GÜNCELLEME BAŞARILI] Fikstür ${newScore} skoruyla güncellendi.`);
                        }
                        return true; // Başarılı, döngüyü durdur.
                    }
                } catch (e) {
                    console.error("Anlık skor güncellenirken hata oluştu:", e);
                    return true; // Hata olsa bile döngüyü durdur.
                }
                return false;
            };

            // 3. Adım: Sayfadaki skor elementlerinin yüklenmesini bekleyelim.
            let attempts = 0;
            const liveScoreInterval = setInterval(() => {
                attempts++;
                if (updateFixtureWithLiveScore() || attempts >= 50) { // 10 saniye boyunca dener
                    clearInterval(liveScoreInterval);
                }
            }, 200);
            // --- GÜNCELLEME SONU ---

            await initScript();
        })
        .catch(e => {
            console.error(UI.getTranslatedText('errorCriticalOnInit'), e);
            UI.setStat('progressStatusError', { message: e.message });
            NProgress.done();
            const cont = document.getElementById('sezon-fikstur-container');
            if (cont) cont.innerHTML = `<p style="text-align:center;color:red;">${UI.getTranslatedText('fixtureErrorLoading')}</p>`;
        });

    const mkSelBtn = () => {
        const c = document.createElement('div');
        c.className = 'fb-selection-container';
        const bw = document.createElement('div');
        bw.style.position = 'relative';
        bw.style.display = 'flex';
        bw.style.alignItems = 'center';
        const mb = document.createElement('div');
        mb.className = 'fb-main-button';
        mb.innerHTML = `<i class="fas fa-home"></i><i class="fas fa-shield-alt"></i><i class="fas fa-sync-alt"></i><span>${UI.getTranslatedText('buttonSelectStatistics')}</span><i class="fas fa-chevron-down"></i>`;
        const dd = document.createElement('div');
        dd.className = 'fb-dropdown';
        dd.innerHTML = `
            <div class="fb-option" data-action="ev"><i class="fas fa-home"></i><span>${UI.getTranslatedText('buttonFenerbahceTurkeyStats')}</span></div>
            <div class="fb-option" data-action="deplasman"><i class="fas fa-shield-alt"></i><span>${UI.getTranslatedText('buttonOpponentDefenseStats')}</span></div>
            <div class="fb-option" data-action="yenile"><i class="fas fa-sync-alt"></i><span>${UI.getTranslatedText('buttonUpdateAllData')}</span></div>
        `;
        bw.appendChild(mb);
        bw.appendChild(dd);
        c.appendChild(bw);

        const cb = document.createElement('button');
        cb.className = 'fb-confirm-btn';
        cb.title = UI.getTranslatedText('buttonConfirmUpdate');
        cb.innerHTML = '<i class="fas fa-check"></i>';
        cb.style.display = 'none';
        c.appendChild(cb);

        // --- ARAMA KUTUSU KODLARI BURADAN SİLİNDİ ---

        let selAct = null;
        mb.addEventListener('click', e => (e.stopPropagation(), dd.classList.toggle('show')));

        dd.querySelectorAll('.fb-option').forEach(opt => {
            opt.addEventListener('click', e => {
                e.stopPropagation();
                const act = e.currentTarget.getAttribute('data-action');
                dd.querySelectorAll('.fb-option').forEach(o => (o.style.background = ''));
                mb.querySelector('span').textContent = UI.getTranslatedText('buttonSelectStatistics');
                cb.style.display = 'none';
                cb.classList.remove('active');
                selAct = null;

                if (act === 'yenile') {
                    selAct = act;
                    e.currentTarget.style.background = '#FFED0033';
                    mb.querySelector('span').textContent = UI.getTranslatedText('buttonConfirmUpdate');
                    cb.style.display = 'flex';
                    cb.classList.add('active');
                    dd.classList.remove('show');
                } else {
                    execSelAct(act);
                    dd.classList.remove('show');
                }
            });
        });

        async function execSelAct(act) {
            if (typeof UI === 'undefined') return alert(UI.getTranslatedText('alertUIError'));
            switch (act) {
                case 'ev': {
                    if (!UI.ownKeyMbrs?.length) return alert(UI.getTranslatedText('alertOwnFedDataMissing'));
                    const ecs = UI.allFedClashes?.length > 0 ? UI.allFedClashes : UI.prevClashes;
                    if (!ecs?.length) return alert(UI.getTranslatedText('alertNoClashData'));
                    await UI.showHomeStats(UI.ownKeyMbrs, ecs);
                    break;
                }
                case 'deplasman':
                    if (!UI.opKeyMbrs || !UI.prevClashes) return alert(UI.getTranslatedText('alertOpponentDataMissing'));
                    if (UI.prevClashes.length === 0) return alert(UI.getTranslatedText('alertNoPastMatchesOpponent'));
                    UI.showAwayStats(UI.opKeyMbrs, UI.prevClashes);
                    break;
                case 'yenile':
                    if (typeof SM !== 'undefined') (SM.co(), location.reload());
                    else alert(UI.getTranslatedText('alertScriptErrorStorageManager'));
                    break;
            }
            dd.querySelectorAll('.fb-option').forEach(o => (o.style.background = ''));
        }

        cb.addEventListener('click', e => {
            e.stopPropagation();
            if (selAct === 'yenile') execSelAct('yenile');
            selAct = null;
            cb.style.display = 'none';
            cb.classList.remove('active');
            dd.classList.remove('show');
            mb.querySelector('span').textContent = UI.getTranslatedText('buttonSelectStatistics');
            dd.querySelectorAll('.fb-option').forEach(o => (o.style.background = ''));
        });

        document.addEventListener('click', () => dd.classList.remove('show'));
        return c;
    };

    const initScript = async () => {
    if (document.querySelector('.fb-selection-container')) return;
    document.querySelectorAll('.fenerbahce-btn').forEach(b => b.remove());
    const tgCont = document.querySelector('.flex-wrap.challenges-options.box_light.padding');
    if (tgCont) {
        const ffg = tgCont.querySelector('div.flex-grow-1');
        const sbCont = mkSelBtn();
        if (ffg) ffg.insertAdjacentElement('afterend', sbCont);
        else tgCont.appendChild(sbCont);
    } else {
        const mcArea = document.querySelector('#page_federations_clash .mainContent') || document.querySelector('.mainContent') || document.body;
        try {
            mcArea.insertBefore(mkSelBtn(), mcArea.firstChild);
        } catch (e) {
            if (mcArea !== document.body) {
                try {
                    document.body.appendChild(mkSelBtn());
                } catch (e2) {}
            }
        }
    }

        if (window.dataExtrInstance && window.dataExtrInstance.st.actM.keyMbrs && window.dataExtrInstance.st.actM.prevClashData) {
            UI.opponentDefensiveStats = UI.calcAwayStats(
                window.dataExtrInstance.st.actM.keyMbrs,
                window.dataExtrInstance.st.actM.prevClashData
            );
            // Hesaplanan istatistiklere göre yıldızları DOM'a ekle
            UI.injectStarRatings();
        }

    // --- YENİ EKLENEN/GÜNCELLENEN BÖLÜM BAŞLANGICI ---

    // 1. Yeni maç takip tablosu için CSS stillerini ekle.
    MatchTracker.addTrackerStyles();

    // 2. Rakip federasyonun ID'sini ana betikten al. Bu, arka planda doğru sayfayı çekmek için gereklidir.
    // Güvenli erişim için ?. operatörleri kullanılıyor.
    const opponentFedId = window.dataExtrInstance?.st?.actM?.opId;

    // 3. Maç takip modülünü başlat. Bu fonksiyon artık asenkron (async) çünkü içinde veri çekme işlemi var.
    // Kendi federasyon üyelerimizi ve rakip ID'sini parametre olarak gönderiyoruz.
    await MatchTracker.init(window.dataExtrInstance?.st?.ownKeyMbrs || [], opponentFedId);

    // --- YENİ EKLENEN/GÜNCELLENEN BÖLÜM SONU ---

    UI.addLangSwitcher();
    await UI.refreshUIForLanguage();
    MaxScoreCalculator.init();
};

// ===================================================================================
// ==================== FEDERASYON MAÇ TAKİP MODÜLÜ (FİNAL DÜZELTME 3) ===============
// ===================================================================================
// KULLANICI İSTEĞİ: 2 maçını da kazanamayan normal üyelerin durumu,
// artık son oynadıkları maçın sonucuna göre belirleniyor.
// ===================================================================================

const MatchTracker = {
    fetchAndIdentifyKeyMembers: async function(opponentFedId) {
        if (!opponentFedId) return [];
        const url = `/?p=federations&sub=clash&fid=${opponentFedId}`;
        try {
            const response = await fetch(url);
            const htmlText = await response.text();
            const parser = new DOMParser();
            const opponentPageDoc = parser.parseFromString(htmlText, 'text/html');
            const keyMembers = [];
            opponentPageDoc.querySelectorAll('table.hitlist.challenges-list tbody tr').forEach(row => {
                const teamContainer = row.querySelector('td:first-child .flex-grow-1');
                if (teamContainer && teamContainer.querySelector('.fa-universal-access')) {
                    const teamName = teamContainer.querySelector('.team-name')?.textContent.trim();
                    if (teamName) keyMembers.push(teamName);
                }
            });
            return keyMembers;
        } catch (error) {
            console.error("Anahtar üyeler çekilirken hata oluştu:", error);
            return [];
        }
    },

    init: async function(federationMembers, opponentFedId) {
        console.log("Maç Takip Modülü Başlatılıyor (Final Düzeltme 5)...");
        const federationSelect = document.getElementById('federation-select');
        if (federationSelect && federationSelect.value !== '114') return;

        const allRelevantTeamNames = federationMembers.map(member => member.tmName);
        const keyMembers = await this.fetchAndIdentifyKeyMembers(opponentFedId);

        const teamStatus = this.parseMatchData(allRelevantTeamNames);
        const finalStatus = this.calculateAllStatuses(teamStatus, keyMembers);
        this.renderTrackerTable(finalStatus, keyMembers);
    },

    parseScoreAndGetResult: function(scoreText) {
        const cleanedScore = scoreText.replace(/[()]/g, '').trim();
        const scoreParts = cleanedScore.split('-').map(s => parseInt(s.trim(), 10));
        let result = 'draw';
        if (scoreParts.length === 2 && !isNaN(scoreParts[0]) && !isNaN(scoreParts[1])) {
            if (scoreParts[0] > scoreParts[1]) result = 'win';
            if (scoreParts[0] < scoreParts[1]) result = 'loss';
        }
        return { score: cleanedScore, result: result };
    },

    parseMatchData: function(allTeamNames) {
        let status = {};
        allTeamNames.forEach(name => {
            status[name] = { teamName: name, matches: [] };
        });

        document.querySelectorAll('.challenges__item').forEach(block => {
            const teamNameEl = block.querySelector('.team-name');
            if (!teamNameEl) return;

            const teamName = teamNameEl.textContent.trim();
            if (!allTeamNames.includes(teamName)) {
                return;
            }

            const parentContainer = block.parentElement;
            const isStacked = parentContainer.classList.contains('challenges') && parentContainer.children.length > 1;
            const isExtra = isStacked && !block.querySelector('.challenges__older');

            const mainResultLink = block.querySelector('.challenges--result a');
            if (mainResultLink) {
                const matchInfo = this.parseScoreAndGetResult(mainResultLink.textContent);
                matchInfo.isExtra = isExtra;
                status[teamName].matches.push(matchInfo);
            }

            const prevResultLink = block.querySelector('.challenges--prev a');
            if (prevResultLink) {
                const matchInfo = this.parseScoreAndGetResult(prevResultLink.textContent);
                matchInfo.isExtra = false;
                status[teamName].matches.push(matchInfo);
            }
        });

        return status;
    },

    // ===============================================================
    // !!! İSTEĞİNİZE GÖRE SON KEZ GÜNCELLENEN FONKSİYON !!!
    // ===============================================================
    calculateAllStatuses: function(teamStatusData, keyMembers) {
        const finalStatuses = [];
        const resultToIcon = {
            win: '<span class="icon-win">✔</span>',
            loss: '<span class="icon-loss">❌</span>',
            draw: '<span class="icon-draw">🟡</span>'
        };

        for (const teamName in teamStatusData) {
            const team = teamStatusData[teamName];
            const isKeyMember = keyMembers.includes(teamName);

            const ownMatches = team.matches.filter(m => !m.isExtra);
            const extraMatch = team.matches.find(m => m.isExtra);

            let resultsText = team.matches.map(m => `${m.score} (${m.result.charAt(0).toUpperCase()})`).join(', ');
            let statusText = '';
            let statusClass = '';

            if (!isKeyMember) {
                // Normal üye mantığı (değişiklik yok)
                const hasWin = ownMatches.some(m => m.result === 'win');
                if (hasWin) {
                    statusText = resultToIcon.win;
                } else {
                    switch (ownMatches.length) {
                        case 0:
                            statusText = 'Maç Yapmadı';
                            statusClass = 'status-pending';
                            break;
                        case 1:
                            statusText = '1 Maç Hakkı Kaldı';
                            statusClass = 'status-attention';
                            break;
                        default: {
                            const lastMatch = ownMatches[0];
                            if (lastMatch.result === 'draw') {
                                statusText = resultToIcon.draw;
                            } else {
                                statusText = resultToIcon.loss;
                            }
                            break;
                        }
                    }
                }
            } else {
                // --- NİHAİ ANAHTAR ÜYE MANTIĞI ---
                // Ekstra maç durumu her zaman bellidir, en başta belirleyelim.
                const extraStatusText = extraMatch ? (extraMatch.result === 'win' ? resultToIcon.win : resultToIcon.loss) : 'Ekstra Maç Bekleniyor';

                // Şimdi normal maçların durumunu belirleyelim.
                let ownStatusText;
                const hasWin = ownMatches.some(m => m.result === 'win');

                if (hasWin) {
                    // Normal maçlardan en az birini kazandı.
                    ownStatusText = resultToIcon.win;
                } else {
                    // Henüz galibiyeti yok, oynanan maç sayısına göre karar ver.
                    switch (ownMatches.length) {
                        case 0:
                            ownStatusText = 'Maç Yapmadı';
                            statusClass = 'status-pending';
                            break;
                        case 1:
                            // 1 maç oynamış ve kazanamamışsa, hakkı devam ediyor.
                            ownStatusText = '1 Maç Hakkı Kaldı';
                            statusClass = 'status-attention';
                            break;
                        default: // 2 veya daha fazla maç yapmışsa
                            // İki normal maçını da oynamış ve kazanamamış.
                            ownStatusText = resultToIcon.loss;
                            break;
                    }
                }

                // İki durumu orijinal formatta birleştir.
                statusText = `${ownStatusText}, ${extraStatusText}`;

                // Ekstra maç bekleme durumunda özel renklendirme yapalım.
                if (ownStatusText === resultToIcon.loss && !extraMatch) {
                    statusClass = 'status-extra-pending';
                }
            }

            finalStatuses.push({
                name: team.teamName,
                matchCount: team.matches.length,
                results: resultsText || '-',
                status: { text: statusText, class: statusClass }
            });
        }
        return finalStatuses.sort((a, b) => a.name.localeCompare(b.name));
    },

    renderTrackerTable: function(finalStatusData, keyMembers) {
        const oldContainer = document.getElementById('match-tracker-container');
        if (oldContainer) oldContainer.remove();

        const currentTheme = GM_getValue('matchTrackerTheme', 'dark');

        const container = document.createElement('div');
        container.id = 'match-tracker-container';
        container.className = 'tracker-collapsed';
        if (currentTheme === 'light') {
            container.classList.add('theme-light');
        }

        const keyMemberIconHTML = `<span class="superuser-icon-small valignMiddle" style="font-size: 12px; margin-right: 5px;"><i title="Anahtar Üye" class="fa fa-universal-access" aria-hidden="true"></i></span>`;
        const themeIcon = currentTheme === 'light' ? 'fa-moon' : 'fa-sun';

        let tableHTML = `
            <div id="match-tracker-title">
                <span class="title-text"><i class="fas fa-list-ul"></i>FEDERASYON MAÇ DURUM TAKİBİ</span>
                <div class="title-controls">
                    <span id="theme-toggle-btn" class="fas ${themeIcon}" title="Temayı Değiştir"></span>
                    <span id="tracker-toggle-icon" class="fas fa-chevron-right"></span>
                </div>
            </div>
            <table id="match-tracker-table">
                <thead>
                    <tr><th>S.No</th><th>Takım</th><th>Oynanan Maç</th><th>Sonuçlar</th><th>Durum</th></tr>
                </thead>
                <tbody>`;

        finalStatusData.forEach((team, index) => { // index parametresi eklendi
            const isKeyMember = keyMembers.includes(team.name);
            const teamDisplayName = isKeyMember ? keyMemberIconHTML + team.name : team.name;
            tableHTML += `
                <tr class="${team.status.class}">
                    <td>${index + 1}</td> <!-- Sıra numarası hücresi eklendi -->
                    <td>${teamDisplayName}</td>
                    <td>${team.matchCount}</td>
                    <td>${team.results || '-'}</td>
                    <td>${team.status.text}</td>
                </tr>`;
        });
        tableHTML += `</tbody></table>`;
        container.innerHTML = tableHTML;

        const targetElement = document.querySelector('#sezon-fikstur-container');
        if (targetElement) {
            targetElement.insertAdjacentElement('beforebegin', container);
        } else {
            document.querySelector('.mainContent.top-pane')?.insertAdjacentElement('afterend', container);
        }

        container.querySelector('#match-tracker-title').addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle-btn')) return;
            container.classList.toggle('tracker-collapsed');
        });

        const themeToggleButton = container.querySelector('#theme-toggle-btn');
        themeToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isLight = container.classList.toggle('theme-light');
            const newTheme = isLight ? 'light' : 'dark';
            GM_setValue('matchTrackerTheme', newTheme);
            themeToggleButton.classList.toggle('fa-sun', !isLight);
            themeToggleButton.classList.toggle('fa-moon', isLight);
        });
    },

    addTrackerStyles: function() {
        GM_addStyle(`
            /* --- Ana Konteyner ve Başlık (Her Zaman Aynı) --- */
            #match-tracker-container { border: 2px solid var(--fb-yellow); border-radius: 8px; margin: 20px 0; overflow: hidden; }
            #match-tracker-title {
                cursor: pointer;
                background: linear-gradient(135deg, var(--fb-dark-blue) 0%, var(--fb-light-blue) 100%);
                color: var(--fb-yellow); padding: 12px 20px; font-weight: bold;
                display: flex; align-items: center; justify-content: flex-end; /* Kontrolleri sağa yasla */
                position: relative; /* Mutlak pozisyonlama için anahtar */
                text-transform: uppercase; letter-spacing: 1px; text-shadow: 1px 1px 3px rgba(0,0,0,0.6);
            }
            .title-text {
                position: absolute; /* Başlığı akıştan çıkar */
                left: 50%; /* Konteynerin ortasına hizala */
                top: 50%;
                transform: translate(-50%, -50%); /* Tam ortalamak için ince ayar */
                white-space: nowrap; /* Başlığın bölünmesini engelle */
            }
            .title-text > i { margin-right: 10px; }
            .title-controls { display: flex; align-items: center; gap: 15px; z-index: 2; /* Başlığın üstünde kalması için */ }
            #theme-toggle-btn { font-size: 18px; cursor: pointer; transition: color 0.3s; }
            #theme-toggle-btn:hover { color: white; }
            #tracker-toggle-icon { transition: transform .3s; font-size: 16px; }
            #match-tracker-container.tracker-collapsed #match-tracker-table { display: none; }
            #match-tracker-container:not(.tracker-collapsed) #tracker-toggle-icon { transform: rotate(90deg); }
            /* ============================================= */
            /* =============== KOYU TEMA (VARSAYILAN) ====== */
            /* ============================================= */
            #match-tracker-table {
                background: rgba(4,30,66,0.8); width: 100%; border-collapse: collapse; font-size: 12px;
            }
            #match-tracker-table th, #match-tracker-table td {
                padding: 6px 10px; border: 1px solid var(--fb-yellow); vertical-align: middle;
            }
            #match-tracker-table th { background: var(--fb-dark-blue); color: var(--fb-yellow); font-weight: bold; text-align: center; }
            #match-tracker-table tbody tr { background-color: var(--fb-dark-blue); }
            #match-tracker-table tbody tr:nth-child(even) { background-color: rgba(10,40,80,0.8); }
            #match-tracker-table tbody tr:hover td { background-color: var(--fb-light-blue) !important; }
            #match-tracker-table td:nth-child(1) { color: white; text-align: center; }
            /* GÜNCELLENDİ: Takım sütunu artık 2. çocuk */
            #match-tracker-table td:nth-child(2) { color: var(--fb-yellow); text-align: left; }
            /* GÜNCELLENDİ: Diğer sütunlar 3. ve 4. oldu */
            #match-tracker-table td:nth-child(3), #match-tracker-table td:nth-child(4) { color: white; text-align: center; }
            /* GÜNCELLENDİ: Durum sütunu 5. oldu */
            #match-tracker-table td:nth-child(5) { text-align: center; font-weight: bold; color: white; }
            #match-tracker-table td:first-child i.fa-universal-access { color: #5b99c4 !important; text-shadow: none; }

            /* KESİN ÇÖZÜM: background-color kurallarının sonuna !important eklendi. */
            #match-tracker-table tr.status-pending { background-color: #5d1725 !important; }
            #match-tracker-table tr.status-attention { background-color: #66460D !important; }
            #match-tracker-table tr.status-extra-pending { background-color: #004085 !important; }

            .icon-win { color: #00E676; text-shadow: 1px 1px 2px rgba(0,0,0,0.7); }
            .icon-loss { color: #F44336; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
            .icon-draw { color: #FFC107; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
            /* ============================================= */
            /* =============== AÇIK TEMA =================== */
            /* ============================================= */
            #match-tracker-container.theme-light #match-tracker-table {
                background: white; color: #333; font-family: Arial, sans-serif;
            }
            #match-tracker-container.theme-light #match-tracker-table th,
            #match-tracker-container.theme-light #match-tracker-table td {
                border: 1px solid #ddd;
            }
            #match-tracker-container.theme-light #match-tracker-table th {
                background-color: #f2f2f2; color: #333;
            }
            #match-tracker-container.theme-light #match-tracker-table tbody tr { background-color: white; }
            #match-tracker-container.theme-light #match-tracker-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
            #match-tracker-container.theme-light #match-tracker-table tbody tr:hover td { background-color: #e9f5ff !important; }
            #match-tracker-container.theme-light #match-tracker-table td:nth-child(1) { color: #555; text-align: center; }
            /* GÜNCELLENDİ: Takım sütunu 2. oldu */
            #match-tracker-container.theme-light #match-tracker-table td:nth-child(2) { color: #0056b3; font-weight: bold; }
            /* GÜNCELLENDİ: Diğer sütunlar 3. ve 4. oldu */
            #match-tracker-container.theme-light #match-tracker-table td:nth-child(3),
            #match-tracker-container.theme-light #match-tracker-table td:nth-child(4) { color: #555; }
            /* GÜNCELLENDİ: Durum sütunu 5. oldu */
            #match-tracker-container.theme-light #match-tracker-table td:nth-child(5) { color: #333; }

            /* KESİN ÇÖZÜM: background-color kurallarının sonuna !important eklendi. */
            #match-tracker-container.theme-light #match-tracker-table tr.status-pending { background-color: #ffcdd2 !important; color: #c62828; }
            #match-tracker-container.theme-light #match-tracker-table tr.status-attention { background-color: #fff8e1 !important; color: #f57f17; }
            #match-tracker-container.theme-light #match-tracker-table tr.status-extra-pending { background-color: #e3f2fd !important; color: #1565c0; }

            .theme-light .icon-win { color: #2e7d32; text-shadow: none; }
            .theme-light .icon-loss { color: #c62828; text-shadow: none; }
            .theme-light .icon-draw { color: #f57f17; text-shadow: none; }
            /* --- MOBİL UYUMLULUK İÇİN EKLENEN KOD --- */
            @media (max-width: 768px) {
                #match-tracker-title {
                    padding: 10px 15px;
                }
                .title-controls {
                    width: 100%;
                    justify-content: space-between;
                }
                .title-text {
                    max-width: calc(100% - 70px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        `);
    }
};

// ===================================================================================
// ==================== PUAN HESAPLAMA (MOBİL DÜZELTME SİLİNDİ - FİNAL) =============
// ===================================================================================

const MaxScoreCalculator = {
    init: async function() {

        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobileDevice) {
            return;
        }

        const oldContainer = document.getElementById('max-score-container');
        if (oldContainer) oldContainer.remove();

        const targetElement = document.querySelector('.mainContent.top-pane');
        if (!targetElement) return;

        const container = document.createElement('div');
        container.id = 'max-score-container';
        targetElement.insertAdjacentElement('afterend', container);

        // --- 1. SAYFADAKİ HÜKMEN UYARISINI OKU ---
        const walkoverInfo = this.parseWalkoverData(document);

        // --- 2. EV SAHİBİ VERİLERİ ---
        const allRows = Array.from(document.querySelectorAll('table.hitlist.challenges-list tbody tr'));
        const ownRows = allRows.filter(row => row.querySelector('td:first-child .team-name'));

        const score1El = document.getElementById('score-1');
        const ownOfficialScore = score1El ? parseInt(score1El.textContent.trim(), 10) : 0;
        const leftNameEl = document.querySelector('.top-pane__name-score .name-score:nth-child(2) b');
        const ownName = leftNameEl ? leftNameEl.textContent.trim() : "EV SAHİBİ";

        let ownMissingCount = 0;
        if (walkoverInfo.found && walkoverInfo.fedName === ownName) {
            ownMissingCount = walkoverInfo.count;
        }

        // --- 3. RAKİP VERİLERİ (FETCH) ---
        let oppRows = [];
        let oppOfficialScore = 0;
        let oppName = "RAKİP";
        let opponentDataReady = false;
        let oppMissingCount = 0;

        let opponentFid = window.dataExtrInstance?.st?.actM?.opId;
        if (opponentFid) {
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'opp-loading';
            loadingDiv.style.cssText = "text-align:center; color:#aaa; font-size:10px; padding:5px;";
            loadingDiv.textContent = "Rakip verileri ve cezalar kontrol ediliyor...";
            container.appendChild(loadingDiv);

            try {
                const response = await fetch(`/?p=federations&sub=clash&fid=${opponentFid}`);
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                const allOppRows = Array.from(doc.querySelectorAll('table.hitlist.challenges-list tbody tr'));
                oppRows = allOppRows.filter(row => row.querySelector('td:first-child .team-name'));

                const oppScoreEl = doc.getElementById('score-1');
                oppOfficialScore = oppScoreEl ? parseInt(oppScoreEl.textContent.trim(), 10) : 0;
                const oppNameEl = doc.querySelector('.top-pane__name-score .name-score:nth-child(2) b');
                oppName = oppNameEl ? oppNameEl.textContent.trim() : "RAKİP";

                const oppWalkover = this.parseWalkoverData(doc);
                if (oppWalkover.found && oppWalkover.fedName === oppName) {
                     oppMissingCount = oppWalkover.count;
                } else if (walkoverInfo.found && walkoverInfo.fedName === oppName) {
                    oppMissingCount = walkoverInfo.count;
                }

                opponentDataReady = true;
                loadingDiv.remove();
            } catch (e) {
                console.error("Rakip verisi hatası:", e);
                if(document.getElementById('opp-loading')) loadingDiv.remove();
            }
        }

        // --- 4. KONSOL RAPORU ---
        console.group(`📊 DETAYLI ÇATIŞMA ANALİZİ`);

        console.log(`%c ${ownName}:`, 'font-weight:bold');
        if (ownMissingCount > 0) console.log(`⚠️ ${ownMissingCount} takım eksik (Tabloda işaretlenip düşülecek).`);
        else console.log(`✔️ Tam Kadro.`);

        if (opponentDataReady) {
            console.log(`%c ${oppName}:`, 'font-weight:bold');
            if (oppMissingCount > 0) console.log(`⚠️ ${oppMissingCount} takım eksik (Tabloda işaretlenip düşülecek).`);
            else console.log(`✔️ Tam Kadro.`);
        }
        console.groupEnd();

        // --- 5. HESAPLAMA VE ÇİZİM ---
        const ownStats = this.calculateLogic(ownRows, ownOfficialScore, ownName, ownMissingCount);
        this.renderBar(container, ownStats, 'own');

        if (opponentDataReady) {
            const oppStats = this.calculateLogic(oppRows, oppOfficialScore, oppName, oppMissingCount);
            this.renderBar(container, oppStats, 'opp');
        }
    },

    parseWalkoverData: function(docContext) {
        const result = { found: false, fedName: null, count: 0 };
        const woInfo = docContext.querySelector('table.nice_table th.wo-info');

        if (woInfo) {
            const fedLink = woInfo.querySelector('a.fed_link');
            const textContent = woInfo.textContent || "";

            if (fedLink) {
                result.found = true;
                result.fedName = fedLink.getAttribute('title') || fedLink.textContent.trim();
                const numberMatch = textContent.match(/(\d+)\s+hükmen/i);
                if (numberMatch && numberMatch[1]) {
                    result.count = parseInt(numberMatch[1], 10);
                } else {
                    result.count = 1;
                }
            }
        }
        return result;
    },

    calculateLogic: function(validRows, officialScore, fedName, missingCount = 0) {
        let rawNormalPotential = 0;
        let jokerCandidates = [];
        let usedJokers = 0;
        let listNormalPot = [];
        let listJokerPot = [];

        const isMobile = window.innerWidth <= 900 || document.getElementById('mzViewport') !== null;

        // 1. ADIM: Tüm takımları tara ve ham potansiyeli bul
        validRows.forEach((row) => {
            const teamNameEl = row.querySelector('td:first-child .team-name');
            const teamName = teamNameEl ? teamNameEl.textContent.trim() : "Bilinmiyor";

            // Maç sayımı
            const allMatches = Array.from(row.querySelectorAll('.challenges__item a[href*="mid="], .challenges__older a[href*="mid="]'));
            let matchCount = allMatches.length;
            if (matchCount === 0 && isMobile) {
                 const simpleLinks = row.querySelectorAll('.challenges__item a');
                 matchCount = simpleLinks.length;
            }

            const hasWin = row.querySelector('.challenges--win') !== null;
            const latestMatchLink = row.querySelector('.challenges--result a');
            let isDraw = false;
            if (matchCount > 0 && latestMatchLink) isDraw = latestMatchLink.classList.contains('challenges--draw');

            // Puanlama
            let participationScore = matchCount > 0 ? 1 : 0;
            let performanceScore = 0;
            if (hasWin) performanceScore = 3;
            else if (matchCount > 0) performanceScore = (isDraw ? 1 : 0);

            const rowScore = participationScore + performanceScore;

            if (matchCount >= 3) usedJokers++;

            // Potansiyel Hesapla
            const gap = 4 - rowScore;
            if (gap > 0) {
                if (matchCount < 2) {
                    rawNormalPotential += gap;
                    listNormalPot.push({
                        'Takım': teamName,
                        'Maç Sayısı': matchCount,
                        'Mevcut Puan': rowScore,
                        'Beklenen': gap, // Sayısal tutuyoruz, tabloda işleyeceğiz
                        'Durum': 'Potansiyel Var'
                    });
                } else if (matchCount === 2) { // DÜZELTME: Sadece tam 2 maç yapanlar joker adayı olabilir. 3 maç yapanlar (matchCount >= 3) jokerini kullanmıştır, listeye eklenmez.
                    jokerCandidates.push({ team: teamName, gain: gap, current: rowScore });
                }
            }
        });

        // 2. ADIM: JOKERLER
        const maxJokers = 2;
        const remainingJokers = Math.max(0, maxJokers - usedJokers);
        jokerCandidates.sort((a, b) => b.gain - a.gain);

        let jokerPotential = 0;
        jokerCandidates.forEach((cand, idx) => {
            const isSelected = idx < remainingJokers;
            if (isSelected) jokerPotential += cand.gain;
            listJokerPot.push({
                'Takım': cand.team,
                'Potansiyel': `+${cand.gain}`,
                'Sonuç': isSelected ? '✅ EKLENDİ' : '❌ SIRAYA GİREMEDİ'
            });
        });

        // 3. ADIM: HÜKMEN DÜŞME İŞLEMİ VE TABLO GÜNCELLEME
        let penalty = 0;
        let markedCount = 0;

        // Listeyi "Maç Sayısı"na göre sırala (0 maç yapanlar en üste)
        listNormalPot.sort((a, b) => a['Maç Sayısı'] - b['Maç Sayısı']);

        const displayList = listNormalPot.map(item => {
            let note = "";
            let expected = `+${item.Beklenen}`;

            // Eğer hala düşülecek hükmen sayısı varsa ve bu takım hiç oynamamışsa
            if (markedCount < missingCount && item['Maç Sayısı'] === 0) {
                penalty += item.Beklenen; // Genelde 4 puan
                note = "⚠️ HÜKMEN DÜŞÜLDÜ";
                expected = `(${item.Beklenen}) -> 0`;
                markedCount++;
            }

            return {
                'Takım': item['Takım'],
                'Durum': item['Maç Sayısı'] === 0 ? 'Hiç Oynamadı' : 'Devam Ediyor',
                'Beklenen': expected,
                'Açıklama': note
            };
        });

        // Nihai Normal Potansiyel
        let finalNormalPotential = Math.max(0, rawNormalPotential - penalty);

        // --- KONSOL ÇIKTISI (AÇIK) ---
        console.group(`📝 ${fedName} HESAP DETAYI`);
        console.log(`Mevcut Puan: ${officialScore}`);
        console.log(`Ham Potansiyel: ${rawNormalPotential}`);
        if (penalty > 0) console.log(`%c 🔻 HÜKMEN CEZASI: -${penalty} Puan (${markedCount} Takım)`, 'color:red; font-weight:bold');
        console.log(`Net Normal Potansiyel: ${finalNormalPotential}`);
        console.log(`Joker Potansiyel: ${jokerPotential}`);

        if (displayList.length > 0) {
            console.log("%c 👇 NORMAL MAÇ LİSTESİ (Hükmenler İşaretli)", "color: #2980b9; font-weight: bold;");
            console.table(displayList);
        } else {
            console.log("Normal maç potansiyeli yok.");
        }

        if (listJokerPot.length > 0) {
            console.log("%c 👇 JOKER LİSTESİ", "color: #e67e22; font-weight: bold;");
            console.table(listJokerPot);
        }
        console.groupEnd();

        return {
            name: fedName,
            current: officialScore,
            potentialGain: finalNormalPotential,
            extraGain: jokerPotential,
            finalScore: officialScore + finalNormalPotential + jokerPotential
        };
    },

    renderBar: function(container, stats, type) {
        if (!container.querySelector('.ms-main-title')) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'ms-main-title';
            titleDiv.innerHTML = '<i class="fas fa-calculator"></i> MAKSİMUM PUAN TAHMİNİ';
            titleDiv.style.cssText = 'color: #FFED00; font-size: 14px; font-weight: 900; margin-bottom: 4px; text-align: center; letter-spacing: 1.5px; text-shadow: 2px 2px 0px #000000; text-transform: uppercase; line-height: 1;';
            container.prepend(titleDiv);
        }

        const barDiv = document.createElement('div');
        barDiv.className = `ms-row ${type}`;

        const bgStyle = type === 'own'
            ? 'background: linear-gradient(90deg, #041E42 0%, #1A4FA3 100%); border: 1px solid #FFED00;'
            : 'background: linear-gradient(90deg, #1B5E20 0%, #2E7D32 100%); border: 1px solid #FFC107; margin-top: 4px;';

        barDiv.innerHTML = `
            <div class="ms-header" title="${stats.name}">
                ${type === 'own' ? '<i class="fas fa-home"></i>' : '<i class="fas fa-plane"></i>'}
                <span>${stats.name}</span>
            </div>
            <div class="ms-separator"></div>
            <div class="ms-data-container">
                <div class="ms-stat-box">
                    <div class="ms-label">MEVCUT</div>
                    <div class="ms-val">${stats.current}</div>
                </div>
                <div class="ms-op"><i class="fas fa-plus"></i></div>
                <div class="ms-stat-box" title="Normal Maçlardan Gelebilecek">
                    <div class="ms-label">NORMAL</div>
                    <div class="ms-val text-yellow">${stats.potentialGain}</div>
                </div>
                <div class="ms-op"><i class="fas fa-plus"></i></div>
                <div class="ms-stat-box" title="Jokerlerden Gelebilecek">
                    <div class="ms-label">JOKER</div>
                    <div class="ms-val text-orange">${stats.extraGain}</div>
                </div>
                <div class="ms-op equals"><i class="fas fa-equals"></i></div>
                <div class="ms-stat-box result">
                    <div class="ms-label">MAKSİMUM</div>
                    <div class="ms-val text-green">${stats.finalScore}</div>
                </div>
            </div>
        `;

        barDiv.style.cssText = `
            ${bgStyle}
            border-radius: 8px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            font-family: 'Roboto', 'Arial', sans-serif;
            height: 55px;
            position: relative;
        `;

        const styleEl = document.createElement('style');
        if (!document.getElementById('ms-dynamic-style-v8')) {
            styleEl.id = 'ms-dynamic-style-v8';
            styleEl.textContent = `
                #max-score-container { margin: 4px 0 -10px 0; padding: 5px; background: rgba(0,0,0,0.4); border-radius: 10px; border: 1px solid rgba(255,237,0,0.2); }
                .ms-header { flex: 0 0 240px; display: flex; align-items: center; background: transparent; color: #fff; font-size: 13px; font-weight: bold; text-shadow: 1px 1px 2px black; overflow: hidden; }
                .ms-header i { margin-right: 8px; font-size: 16px; color: rgba(255,255,255,0.9); flex-shrink: 0; }
                .ms-header span { text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ms-separator { width: 1px; height: 30px; background: rgba(255,255,255,0.2); margin: 0 5px; flex-shrink: 0; }
                .ms-data-container { flex: 1; display: flex; align-items: center; justify-content: space-evenly; }
                .ms-stat-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 35px; }
                .ms-label { font-size: 9px; color: rgba(255,255,255,0.7); text-transform: uppercase; margin-bottom: 3px; font-weight: bold; letter-spacing: 0.5px; }
                .ms-val { font-size: 20px; font-weight: 900; color: white; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
                .ms-op { color: #fff; opacity: 0.9; font-size: 14px; margin-top: 10px; }
                .ms-op.equals { color: #fff; opacity: 1; font-size: 14px; margin-top: 10px; }
                .text-yellow { color: #FFED00; }
                .text-orange { color: #FF9800; }
                .text-green { color: #00E676; font-size: 25px; }
                .ms-stat-box.result { transform: scale(1.05); }
                @media (max-width: 768px) {
                    .ms-row { height: auto; flex-direction: column; padding: 8px; align-items: stretch; }
                    .ms-header { margin-bottom: 5px; padding: 0; flex: auto; justify-content: center; }
                    .ms-separator { display: none; }
                    .ms-data-container { justify-content: space-between; gap: 5px; }
                }
            `;
            document.head.appendChild(styleEl);
        }
        container.appendChild(barDiv);
    }
};

})();