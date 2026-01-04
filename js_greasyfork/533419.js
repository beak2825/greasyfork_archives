// ==UserScript==
// @name         Gartic Anonimbiri Bot Panel
// @name:tr      Gartic Anonimbiri Bot Paneli
// @namespace    http://tampermonkey.net/
// @version      2025-07-02
// @description  Advanced bot control panel for gartic.io with a gorgeous dark theme, smart inputs, AFK prevention, and i18n support.
// @description:tr Harika koyu tema, akıllı girdiler, AFK önleme ve çoklu dil desteği ile gartic.io için gelişmiş bot kontrol paneli.
// @author       anonimbiri
// @license      MIT
// @match        https://gartic.io/anonimbiri
// @icon         https://cdn.jsdelivr.net/gh/GameSketchers/Kawaii-Helper@refs/heads/main/Assets/kawaii-logo.png
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/533419/Gartic%20Anonimbiri%20Bot%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/533419/Gartic%20Anonimbiri%20Bot%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom console logging
    const log = (msg, error = false) => {
        console.log(`%c[anonimbiri] ${msg}`, `color:${error ? '#ff5555' : '#00ff88'};font-weight:bold;font-family:monospace;background:#1a1a2e;padding:2px 4px;border-radius:3px`);
    };

    // Initial cookie deletion for the main panel page
    GM_cookie.delete({ name: 'garticio' }, (error) => log(error ? '✖ garticio cookie error' : '✔ garticio cookie deleted'));
    GM_cookie.delete({ name: 'cf_clearance' }, (error) => log(error ? '✖ cf_clearance cookie error' : '✔ cf_clearance cookie deleted'));

    // Replace page with the new modern dark theme
    document.documentElement.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

            :root { --c-primary: #ffb6c1; --c-primary-dark: #ff69b4; --c-grad: linear-gradient(45deg, var(--c-primary-dark), var(--c-primary)); --transition-speed: 0.2s; }

            * { margin: 0; padding: 0; box-sizing: border-box; }

            body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%); color: #ffffff; min-height: 100vh; overflow-x: hidden; }

            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            ::-webkit-scrollbar-thumb { background: var(--c-grad); border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: linear-gradient(45deg, #ff1493, var(--c-primary-dark)); }
            * { scrollbar-width: thin; scrollbar-color: var(--c-primary-dark) rgba(255, 255, 255, 0.1); }

            .container { display: grid; grid-template-columns: 200px 1fr; min-height: 100vh; gap: 20px; padding: 20px; max-width: 1400px; margin: 0 auto; }
            .mascot-sidebar { display: flex; flex-direction: column; align-items: center; background: rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 182, 193, 0.2); height: fit-content; }
            .mascot-image { width: 150px; height: auto; border-radius: 15px; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(255, 182, 193, 0.3)); }
            .language-selector { width: 100%; margin-top: 10px; }
            .main-content { display: flex; flex-direction: column; gap: 20px; }
            .panel { background: rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 25px; backdrop-filter: blur(15px); border: 1px solid rgba(255, 182, 193, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
            .panel-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 20px; color: var(--c-primary); display: flex; align-items: center; gap: 10px; }
            .room-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .info-item { background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 12px; border: 1px solid rgba(255, 182, 193, 0.1); }
            .info-label { font-size: 0.9rem; color: var(--c-primary); margin-bottom: 5px; }
            .info-value { font-size: 1.1rem; font-weight: 500; word-break: break-all; }
            .players-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
            .player-card { background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 12px; border: 1px solid rgba(255, 182, 193, 0.1); display: flex; align-items: center; gap: 12px; transition: transform var(--transition-speed) ease; }
            .player-card:hover { transform: translateY(-3px); }
            .player-avatar { width: 45px; height: 45px; border-radius: 50%; background-size: cover; background-position: center; border: 2px solid var(--c-primary); flex-shrink: 0; }
            .player-name { flex: 1; font-weight: 500; }
            .player-stats { color: #d1d1d1; font-weight: 400; }
            .kick-btn { background: linear-gradient(45deg, #ff1744, #ff5722); border: none; padding: 8px 12px; border-radius: 8px; color: white; cursor: pointer; font-size: 0.8rem; transition: all var(--transition-speed) ease; }
            .kick-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 23, 68, 0.4); }
            .form-group { margin-bottom: 20px; }
            .form-label { display: block; margin-bottom: 8px; color: var(--c-primary); font-weight: 500; }
            .form-input { width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 182, 193, 0.3); border-radius: 10px; color: #ffffff; font-size: 1rem; transition: all var(--transition-speed) ease; font-family: 'Poppins', sans-serif; }
            .form-input:focus { outline: none; border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.2); }
            .form-input::placeholder { color: rgba(255, 255, 255, 0.5); }

            .number-input-container { position: relative; width: 100%; }
            .number-input { width: 100%; padding: 12px 50px 12px 16px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 182, 193, 0.3); border-radius: 10px; color: #ffffff; font-size: 1rem; transition: all var(--transition-speed) ease; font-family: 'Poppins', sans-serif; -moz-appearance: textfield; }
            .number-input::-webkit-outer-spin-button, .number-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            .number-input:focus { outline: none; border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.2); }
            .number-controls { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 2px; }
            .number-btn { width: 24px; height: 18px; background: var(--c-grad); border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-speed) ease; color: #000; font-size: 10px; font-weight: bold; }
            .number-btn:hover { background: linear-gradient(45deg, #ff1493, var(--c-primary-dark)); transform: scale(1.1); }
            .number-btn:active { transform: scale(0.95); }

            .custom-select { position: relative; width: 100%; }
            .select-display { width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 182, 193, 0.3); border-radius: 10px; color: #ffffff; font-size: 1rem; cursor: pointer; transition: all var(--transition-speed) ease; font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; }
            .select-display:hover, .select-display.active { border-color: var(--c-primary); }
            .select-arrow { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--c-primary); transition: transform var(--transition-speed) ease; }
            .select-display.active .select-arrow { transform: rotate(180deg); }
            .select-options { position: absolute; top: 100%; left: 0; right: 0; background: rgba(20, 20, 40, 0.9); border: 1px solid rgba(255, 182, 193, 0.3); border-radius: 10px; margin-top: 4px; z-index: 1000; opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all var(--transition-speed) ease; backdrop-filter: blur(10px); }
            .select-options.active { opacity: 1; visibility: visible; transform: translateY(0); }
            .select-option { padding: 12px 16px; cursor: pointer; transition: all var(--transition-speed) ease; border-bottom: 1px solid rgba(255, 182, 193, 0.1); }
            .select-option:last-child { border-bottom: none; }
            .select-option:hover { background: rgba(255, 182, 193, 0.1); }
            .select-option.selected { background: linear-gradient(90deg, rgba(255, 105, 180, 0.2), rgba(255, 182, 193, 0.2)); color: var(--c-primary); }

            .btn { background: var(--c-grad); border: none; padding: 12px 24px; border-radius: 10px; color: #000; font-weight: 600; cursor: pointer; transition: all var(--transition-speed) ease; margin-bottom: 10px; font-family: 'Poppins', sans-serif; width: 100%; }
            .btn:disabled { background: linear-gradient(45deg, #555, #777); cursor: not-allowed; color: #aaa; box-shadow: none; transform: none; }
            .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4); }
            .btn-danger { background: linear-gradient(45deg, #ff4757, #ff3742); color: white; }
            .btn-danger:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4); }
            .button-group { display: flex; flex-direction: column; gap: 10px; }

            .console { background: rgba(0, 0, 0, 0.6); border-radius: 10px; padding: 15px; font-family: 'Courier New', monospace; font-size: 0.9rem; height: 150px; overflow-y: auto; border: 1px solid rgba(255, 182, 193, 0.2); }
            .console-line { margin-bottom: 5px; color: #00ff88; word-break: break-all; }
            .console-line.spam { color: var(--c-primary); }

            .footer { text-align: center; padding: 20px; color: rgba(255, 182, 193, 0.7); font-size: 0.9rem; }
            .icon { width: 24px; height: 24px; fill: currentColor; }

            .bot-controls, .spam-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .spam-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: end; }

            @media (max-width: 992px) { .container { grid-template-columns: 1fr; } .mascot-sidebar { order: -1; } }
            @media (max-width: 768px) { .room-info, .spam-layout { grid-template-columns: 1fr; } }
        </style>

        <div class="container">
            <div class="mascot-sidebar">
                <img src="https://cdn.jsdelivr.net/gh/GameSketchers/Kawaii-Helper@refs/heads/main/Assets/kawaii-logo.png" alt="Kawaii Mascot" class="mascot-image">
                <div class="language-selector">
                    <div class="custom-select" id="languageSelectContainer">
                        <div class="select-display"><span class="select-text"></span><div class="select-arrow"></div></div>
                        <div class="select-options">
                            <div class="select-option" data-value="tr">🇹🇷 Türkçe</div>
                            <div class="select-option" data-value="en">🇺🇸 English</div>
                            <div class="select-option" data-value="ja">🇯🇵 日本語</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="main-content">
                <!-- Players Panel -->
                <div class="panel">
                    <h2 class="panel-title">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M16,13C16.53,13 17.04,13.07 17.5,13.2C17.15,12.28 16.16,11.69 15,11.5L14.07,9.63C15.5,8.81 16.19,7 15.42,5.53C14.65,4.06 12.83,3.37 11.37,4.14C9.9,4.91 9.21,6.73 10,8.2L10.93,10.07L8,11.5C6.84,11.69 5.85,12.28 5.5,13.2C5.96,13.07 6.47,13 7,13H16M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
                        <span data-translate="playersTitle"></span>
                    </h2>
                    <div class="room-info">
                        <div class="info-item">
                            <div class="info-label" data-translate="roomCodeLabel"></div>
                            <div class="info-value" id="roomCodeDisplay"></div>
                        </div>
                        <div class="info-item">
                            <div class="info-label" data-translate="themeLabel"></div>
                            <div class="info-value" id="roomTheme"></div>
                        </div>
                    </div>
                    <div class="players-grid" id="playerList"></div>
                </div>

                <!-- Bot Control Panel -->
                <div class="panel">
                    <h2 class="panel-title">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/></svg>
                        <span data-translate="botControlTitle"></span>
                    </h2>
                    <div class="bot-controls">
                        <div class="form-group">
                            <label class="form-label" data-translate="botCountLabel"></label>
                            <div class="number-input-container">
                                <input type="number" class="number-input" id="botCount" value="5" min="1" max="20">
                                <div class="number-controls">
                                    <button type="button" class="number-btn" data-target="botCount" data-step="up">▲</button>
                                    <button type="button" class="number-btn" data-target="botCount" data-step="down">▼</button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" data-translate="roomCodeInputLabel"></label>
                            <input type="text" class="form-input" id="roomCode" data-translate-placeholder="roomCodePlaceholder">
                        </div>
                    </div>
                    <button class="btn" id="startBots" data-translate="startBotsBtn" style="width: auto;"></button>
                    <div class="form-group" style="margin-top: 20px; margin-bottom: 0;">
                        <label class="form-label" data-translate="statusConsoleLabel"></label>
                        <div class="console" id="statusLog"></div>
                    </div>
                </div>

                <!-- Spam Control Panel -->
                <div class="panel">
                    <h2 class="panel-title">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2M6,9V7H18V9H6M14,11V13H6V11H14M6,15V17H16V15H6Z"/></svg>
                        <span data-translate="spamControlTitle"></span>
                    </h2>
                    <div class="spam-layout">
                        <div>
                           <div class="form-group">
                                <label class="form-label" data-translate="spamTextLabel"></label>
                                <input type="text" class="form-input" id="spamText" data-translate-placeholder="spamTextPlaceholder">
                            </div>
                             <div class="form-group">
                                <label class="form-label" data-translate="spamIntervalLabel"></label>
                                <div class="number-input-container">
                                    <input type="number" class="number-input" id="spamInterval" min="100" value="1000">
                                    <div class="number-controls">
                                        <button type="button" class="number-btn" data-target="spamInterval" data-step="up">▲</button>
                                        <button type="button" class="number-btn" data-target="spamInterval" data-step="down">▼</button>
                                    </div>
                                </div>
                            </div>
                             <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label" data-translate="spamChannelLabel"></label>
                                <div class="custom-select" id="spamChannelSelectContainer">
                                    <div class="select-display">
                                        <span class="select-text"></span>
                                        <div class="select-arrow"></div>
                                    </div>
                                    <div class="select-options">
                                        <div class="select-option selected" data-value="answers" data-translate="spamChannelAnswers"></div>
                                        <div class="select-option" data-value="chat" data-translate="spamChannelChat"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="button-group">
                            <button class="btn" id="startSpam" data-translate="startSpamBtn"></button>
                            <button class="btn btn-danger" id="reportDrawing" data-translate="reportDrawingBtn"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer"><p>by anonimbiri</p></div>
    `;

    // --- I18N (Internationalization) ---
    const translations = {
        en: {
            playersTitle: "Players in Room", roomCodeLabel: "Room Code:", themeLabel: "Theme:", notConnected: "Not connected", noTheme: "-", noPlayers: "No player information yet...",
            botControlTitle: "Gartic Bot Control", botCountLabel: "Bot Count:", roomCodeInputLabel: "Room Code:", roomCodePlaceholder: "e.g. 32v1sA", startBotsBtn: "Start Bots", creatingBotsBtn: "Creating...", deleteBotsBtn: "Delete All Bots",
            statusConsoleLabel: "Status Console:", spamControlTitle: "Bot Spam Control", spamTextLabel: "Spam Text:", spamTextPlaceholder: "Message to send", spamIntervalLabel: "Spam Interval (ms):", spamChannelLabel: "Spam Channel:",
            spamChannelAnswers: "Answers (42[13])", spamChannelChat: "Chat (42[11])", startSpamBtn: "Start Spam", stopSpamBtn: "Stop Spam", reportDrawingBtn: "Report Drawing",
            kickBtn: "Kick", points: "Points", wins: "Wins",
            initLog: "Bot panel active! Enter details and click the button to start.", startingBotsLog: (c, r) => `${c} bots are starting... Room: ${r}`, websocketUrlLog: "WebSocket URL created.",
            botCreatingLog: i => `Creating bot ${i}...`, playBtnLog: i => `Bot ${i}: Clicked play button`, playBtnErrLog: i => `Bot ${i}: Play button not found`, credsLog: i => `Bot ${i}: Credentials received`,
            jsonErrLog: i => `Bot ${i}: JSON parse error`, iframeErrLog: i => `Bot ${i}: Iframe loading error`, iframeRemovedLog: "Temporary iframe removed.", wsConnectingLog: i => `Bot ${i}: Connecting to game server...`,
            wsOpenLog: i => `Bot ${i}: Connection opened`, wsJoinedLog: (i, n) => `Bot ${i}: Joined as "${n}"`, wsReadyLog: i => `Bot ${i}: Active and ready`, wsDataErrLog: i => `Bot ${i}: Game data parse error`,
            wsRoomFullLog: i => `Bot ${i}: Error 3 - Room is full`, wsInGameLog: (i, c) => `Bot ${i}: Error 4 - Already in game. Use viewer: https://gartic.io/${c}/viewer`,
            wsLeaveConfirmLog: i => `Bot ${i}: Leave confirmed`, wsErrorLog: i => `Bot ${i}: Connection error`, wsCloseLog: i => `Bot ${i}: Connection closed`,
            allBotsSuccessLog: c => `All ${c} bots started successfully! ✨`, noBotsToKick: "No active connection to perform kick!", kickSentLog: (p, s) => `Kick request sent for player: ${p} (Socket ${s})`,
            kickFailLog: "Kick failed: Missing player ID", noBotsToSpam: "No active bots for spam!", spamTextRequired: "Please enter a spam text!", spamStartedLog: (t, c) => `Spam started: "${t}" (${c})`,
            spamStoppedLog: "Spam stopped.", noBotsToDelete: "No active bots to delete!", leaveCmdLog: (i, p) => `Bot ${i} leave command sent: ${p}`, urlExtractedLog: c => `Room code extracted from URL: ${c}`,
            newPlayerLog: n => `New player: ${n}`, playerLeftLog: i => `Player left: ID ${i}`
        },
        tr: {
            playersTitle: "Odadaki Oyuncular", roomCodeLabel: "Oda Kodu:", themeLabel: "Tema:", notConnected: "Henüz bağlanılmadı", noTheme: "-", noPlayers: "Henüz oyuncu bilgisi yok...",
            botControlTitle: "Gartic Bot Kontrol", botCountLabel: "Bot Sayısı:", roomCodeInputLabel: "Oda Kodu:", roomCodePlaceholder: "Örn. 32v1sA", startBotsBtn: "Botları Başlat", creatingBotsBtn: "Oluşturuluyor...", deleteBotsBtn: "Tüm Botları Sil",
            statusConsoleLabel: "Durum Konsolu:", spamControlTitle: "Bot Spam Kontrol", spamTextLabel: "Spam Metni:", spamTextPlaceholder: "Gönderilecek mesaj", spamIntervalLabel: "Spam Aralığı (ms):", spamChannelLabel: "Spam Kanalı:",
            spamChannelAnswers: "Cevaplar (42[13])", spamChannelChat: "Sohbet (42[11])", startSpamBtn: "Spam Başlat", stopSpamBtn: "Spam Durdur", reportDrawingBtn: "Çizimi Raporla",
            kickBtn: "At", points: "Puan", wins: "Galibiyet",
            initLog: "Bot paneli aktif! Bilgileri girip botları başlatmak için butona tıklayın.", startingBotsLog: (c, r) => `${c} bot başlatılıyor... Oda: ${r}`, websocketUrlLog: "WebSocket URL oluşturuldu.",
            botCreatingLog: i => `Bot ${i} oluşturuluyor...`, playBtnLog: i => `Bot ${i}: Oyun butonuna tıklandı`, playBtnErrLog: i => `Bot ${i}: Oyun butonu bulunamadı`, credsLog: i => `Bot ${i}: Kimlik bilgileri alındı`,
            jsonErrLog: i => `Bot ${i}: JSON ayrıştırma hatası`, iframeErrLog: i => `Bot ${i}: Iframe yükleme hatası`, iframeRemovedLog: "Geçici iframe kaldırıldı.", wsConnectingLog: i => `Bot ${i}: Oyun sunucusuna bağlanıyor...`,
            wsOpenLog: i => `Bot ${i}: Bağlantı açıldı`, wsJoinedLog: (i, n) => `Bot ${i}: "${n}" olarak katıldı`, wsReadyLog: i => `Bot ${i}: Aktif ve hazır`, wsDataErrLog: i => `Bot ${i}: Oyun verisi ayrıştırma hatası`,
            wsRoomFullLog: i => `Bot ${i}: Hata 3 - Oda dolu`, wsInGameLog: (i, c) => `Bot ${i}: Hata 4 - Zaten oyundasınız. İzleyici moduna geçin: https://gartic.io/${c}/viewer`,
            wsLeaveConfirmLog: i => `Bot ${i}: Ayrılma onaylandı`, wsErrorLog: i => `Bot ${i}: Bağlantı hatası`, wsCloseLog: i => `Bot ${i}: Bağlantı kapandı`,
            allBotsSuccessLog: c => `Tüm ${c} bot başarıyla başlatıldı! ✨`, noBotsToKick: "Atma işlemi için aktif bağlantı bulunamadı!", kickSentLog: (p, s) => `Oyuncu atma işlemi gönderildi: ${p} (Soket ${s})`,
            kickFailLog: "Atma başarısız: Oyuncu ID eksik", noBotsToSpam: "Spam için aktif bot bulunamadı!", spamTextRequired: "Lütfen bir spam metni girin!", spamStartedLog: (t, c) => `Spam başlatıldı: "${t}" (${c})`,
            spamStoppedLog: "Spam durduruldu.", noBotsToDelete: "Silinecek aktif bot bulunamadı!", leaveCmdLog: (i, p) => `Bot ${i} ayrılma komutu gönderildi: ${p}`, urlExtractedLog: c => `URL'den oda kodu çıkarıldı: ${c}`,
            newPlayerLog: n => `Yeni oyuncu: ${n}`, playerLeftLog: i => `Oyuncu ayrıldı: ID ${i}`
        },
        ja: {
            playersTitle: "ルーム内のプレイヤー", roomCodeLabel: "ルームコード:", themeLabel: "テーマ:", notConnected: "未接続", noTheme: "-", noPlayers: "プレイヤー情報がまだありません...",
            botControlTitle: "Garticボットコントロール", botCountLabel: "ボット数:", roomCodeInputLabel: "ルームコード:", roomCodePlaceholder: "例: 32v1sA", startBotsBtn: "ボットを開始", creatingBotsBtn: "作成中...", deleteBotsBtn: "全ボットを削除",
            statusConsoleLabel: "ステータスコンソール:", spamControlTitle: "ボットスパム制御", spamTextLabel: "スパムテキスト:", spamTextPlaceholder: "送信するメッセージ", spamIntervalLabel: "スパム間隔 (ms):", spamChannelLabel: "スパムチャンネル:",
            spamChannelAnswers: "回答 (42[13])", spamChannelChat: "チャット (42[11])", startSpamBtn: "スパムを開始", stopSpamBtn: "スパムを停止", reportDrawingBtn: "描画を報告",
            kickBtn: "追放", points: "ポイント", wins: "勝利数",
            initLog: "ボットパネルがアクティブです！詳細を入力してボタンをクリックして開始します。", startingBotsLog: (c, r) => `${c}体のボットを開始しています... ルーム: ${r}`, websocketUrlLog: "WebSocket URLが作成されました。",
            botCreatingLog: i => `ボット${i}を作成中...`, playBtnLog: i => `ボット${i}: 再生ボタンをクリック`, playBtnErrLog: i => `ボット${i}: 再生ボタンが見つかりません`, credsLog: i => `ボット${i}: 資格情報を受信`,
            jsonErrLog: i => `ボット${i}: JSON解析エラー`, iframeErrLog: i => `ボット${i}: Iframe読み込みエラー`, iframeRemovedLog: "一時的なiframeが削除されました。", wsConnectingLog: i => `ボット${i}: ゲームサーバーに接続中...`,
            wsOpenLog: i => `ボット${i}: 接続が開きました`, wsJoinedLog: (i, n) => `ボット${i}: "${n}"として参加`, wsReadyLog: i => `ボット${i}: アクティブで準備完了`, wsDataErrLog: i => `ボット${i}: ゲームデータ解析エラー`,
            wsRoomFullLog: i => `ボット${i}: エラー3 - ルームが満員です`, wsInGameLog: (i, c) => `ボット${i}: エラー4 - 既にゲームに参加中。視聴者モードを使用: https://gartic.io/${c}/viewer`,
            wsLeaveConfirmLog: i => `ボット${i}: 退出を確認`, wsErrorLog: i => `ボット${i}: 接続エラー`, wsCloseLog: i => `ボット${i}: 接続が閉じました`,
            allBotsSuccessLog: c => `全${c}体のボットが正常に開始されました！✨`, noBotsToKick: "追放アクションを実行する接続がありません！", kickSentLog: (p, s) => `プレイヤー追放リクエスト送信: ${p} (ソケット ${s})`,
            kickFailLog: "追放失敗: プレイヤーIDがありません", noBotsToSpam: "スパム用のアクティブなボットがいません！", spamTextRequired: "スパムテキストを入力してください！", spamStartedLog: (t, c) => `スパム開始: "${t}" (${c})`,
            spamStoppedLog: "スパムを停止しました。", noBotsToDelete: "削除するアクティブなボットがいません！", leaveCmdLog: (i, p) => `ボット${i}退出コマンド送信: ${p}`, urlExtractedLog: c => `URLからルームコード抽出: ${c}`,
            newPlayerLog: n => `新しいプレイヤー: ${n}`, playerLeftLog: i => `プレイヤーが退出: ID ${i}`
        }
    };
    let currentLang = 'tr';

    const applyTranslations = () => {
        const t = translations[currentLang];
        document.querySelectorAll('[data-translate]').forEach(el => { if (t[el.dataset.translate]) el.textContent = t[el.dataset.translate]; });
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => { if (t[el.dataset.translatePlaceholder]) el.placeholder = t[el.dataset.translatePlaceholder]; });
        document.getElementById('roomCodeDisplay').textContent = t.notConnected;
        document.getElementById('roomTheme').textContent = t.noTheme;
        document.getElementById('playerList').innerHTML = `<div class="info-value" style="grid-column: 1 / -1; text-align: center;">${t.noPlayers}</div>`;
        updateButtonState(); stopSpam(); updatePlayerListUI();
    };

    // --- UI INTERACTION ---
    const initCustomUI = () => {
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetInput = document.getElementById(btn.dataset.target);
                const step = btn.dataset.step === 'up' ? 1 : -1;
                const min = parseInt(targetInput.min); const max = parseInt(targetInput.max);
                let value = (parseInt(targetInput.value) || 0) + step;
                if (!isNaN(min) && value < min) value = min;
                if (!isNaN(max) && value > max) value = max;
                targetInput.value = value;
            });
        });

        document.querySelectorAll('.custom-select').forEach(container => {
            const display = container.querySelector('.select-display');
            const optionsContainer = container.querySelector('.select-options');
            const textEl = container.querySelector('.select-text');

            display.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = optionsContainer.classList.toggle('active');
                display.classList.toggle('active', isActive);
            });

            optionsContainer.querySelectorAll('.select-option').forEach(option => {
                option.addEventListener('click', () => {
                    textEl.textContent = translations[currentLang][option.dataset.translate] || option.textContent;
                    container.dataset.value = option.dataset.value;
                    container.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    if (container.id === 'languageSelectContainer') setLanguage(option.dataset.value);
                });
            });
            const initialSelected = optionsContainer.querySelector('.select-option.selected') || optionsContainer.querySelector('.select-option');
            if (initialSelected) {
                textEl.textContent = translations[currentLang][initialSelected.dataset.translate] || initialSelected.textContent;
                container.dataset.value = initialSelected.dataset.value;
            }
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select').forEach(container => {
                container.querySelector('.select-options').classList.remove('active');
                container.querySelector('.select-display').classList.remove('active');
            });
        });
    };

    const setLanguage = (lang) => {
        currentLang = translations[lang] ? lang : 'tr';
        const langContainer = document.getElementById('languageSelectContainer');
        const selectedLangOption = langContainer.querySelector(`.select-option[data-value="${currentLang}"]`);
        if(selectedLangOption) {
            langContainer.querySelector('.select-text').textContent = selectedLangOption.textContent;
            langContainer.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
            selectedLangOption.classList.add('selected');
        }
        const spamContainer = document.getElementById('spamChannelSelectContainer');
        const selectedSpamOption = spamContainer.querySelector('.select-option.selected');
        if(selectedSpamOption) {
            spamContainer.querySelector('.select-text').textContent = translations[currentLang][selectedSpamOption.dataset.translate];
        }
        applyTranslations();
    };

    // --- CORE BOT LOGIC ---
    const statusLog = (msg, type = '') => {
        const logEl = document.getElementById('statusLog');
        if (!logEl) return;
        const newLine = document.createElement('div');
        newLine.className = `console-line ${type}`;
        newLine.textContent = `→ ${msg}`;
        logEl.appendChild(newLine);
        logEl.scrollTop = logEl.scrollHeight;
    };
    const spamLog = (msg) => { statusLog(msg, 'spam'); };

    let token, sala, botCount, roomCode, websocketUrl = null;
    let playerList = [], socketList = [], botQueue = [], botChoices = new Map();
    let botsCreated = 0, isCreatingBot = false, currentIframe = null, spamInterval = null, isSpamming = false;
    let afkInterval = null;
    const startBotsButton = document.getElementById('startBots');
    const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2061', '\u2062', '\u2063'];
    function insertInvisibleChar(text) { const r = invisibleChars[Math.floor(Math.random()*invisibleChars.length)], p = Math.floor(Math.random()*(text.length+1)); return text.slice(0,p)+r+text.slice(p); }

    function updateButtonState(isLoading = false) {
        const t = translations[currentLang];
        startBotsButton.textContent = isLoading ? t.creatingBotsBtn : (socketList.length > 0 ? t.deleteBotsBtn : t.startBotsBtn);
        startBotsButton.disabled = isLoading;
        startBotsButton.classList.toggle('btn-danger', !isLoading && socketList.length > 0);
    }

    function startSpam() {
        const t = translations[currentLang];
        if (socketList.length === 0) { spamLog(t.noBotsToSpam); return; }
        const spamTextBase = document.getElementById('spamText').value.trim();
        const spamChannel = document.getElementById('spamChannelSelectContainer').dataset.value;
        const spamIntervalValue = parseInt(document.getElementById('spamInterval').value) || 1000;
        if (!spamTextBase) { spamLog(t.spamTextRequired); return; }
        isSpamming = true;
        const startSpamButton = document.getElementById('startSpam');
        startSpamButton.textContent = t.stopSpamBtn; startSpamButton.classList.add('btn-danger');
        const channelName = document.querySelector(`#spamChannelSelectContainer .select-option.selected`).textContent;
        spamLog(t.spamStartedLog(spamTextBase, channelName));
        const commandCode = spamChannel === "answers" ? "13" : "11";
        clearInterval(spamInterval);
        spamInterval = setInterval(() => {
            socketList.forEach((socket, index) => {
                if (socket.readyState === WebSocket.OPEN && socket.playerId) {
                    socket.send(`42[${commandCode},${socket.playerId},"${insertInvisibleChar(spamTextBase)}"]`);
                    log(`Spam message sent from socket ${index} (${commandCode})`);
                }
            });
        }, spamIntervalValue);
    }

    function stopSpam() {
        const t = translations[currentLang];
        const startSpamButton = document.getElementById('startSpam');
        startSpamButton.textContent = t.startSpamBtn; startSpamButton.classList.remove('btn-danger');
        if (isSpamming) { clearInterval(spamInterval); isSpamming = false; spamInterval = null; spamLog(t.spamStoppedLog); }
    }

    function cleanRoomCode(input) {
        if (!input) return "";
        const match = input.match(/(?:\/|gartic\.io\/)([a-zA-Z0-9]{5,})(?:\/viewer)?$/);
        return match ? match[1] : input.trim();
    }

    function startBots() {
        const t = translations[currentLang];
        botCount = parseInt(document.getElementById('botCount').value) || 5;
        roomCode = cleanRoomCode(document.getElementById('roomCode').value.trim());
        if (!roomCode) { alert(t.roomCodeInputLabel + ' ' + t.roomCodePlaceholder); return; }
        botsCreated = 0; botQueue = Array.from({ length: botCount }, (_, i) => i); isCreatingBot = false;
        log(`Starting ${botCount} bots for room ${roomCode}`); statusLog(t.startingBotsLog(botCount, roomCode));
        document.getElementById('roomCodeDisplay').textContent = `${roomCode}`;
        updateButtonState(true); createNextBot(); startPeriodicMessage(); startAfkPrevention();
    }

    function deleteAllBots() { const t = translations[currentLang]; if (socketList.length === 0) { statusLog(t.noBotsToDelete); updateButtonState(); return; } if (isSpamming) stopSpam(); clearInterval(afkInterval); afkInterval = null; socketList.forEach((socket, index) => { if (socket.readyState === WebSocket.OPEN && socket.playerId) { socket.send(`42[24,${socket.playerId}]`); statusLog(t.leaveCmdLog(index + 1, socket.playerId)); } }); }

    function createNextBot() { if (botQueue.length === 0 || isCreatingBot) { if (botQueue.length === 0 && !isCreatingBot && botsCreated > 0) { updateButtonState(); } return; } isCreatingBot = true; const index = botQueue.shift(); createIframe(index); }

    function createIframe(index) {
        const t = translations[currentLang]; statusLog(t.botCreatingLog(index + 1)); const iframe = document.createElement('iframe'); iframe.src = `https://gartic.io/${roomCode}`; iframe.style.display = 'none'; document.body.appendChild(iframe); currentIframe = iframe;
        iframe.onload = () => {
            const iw = iframe.contentWindow;
            setTimeout(() => {
                const playButton = iw.document.querySelector('.ic-playHome');
                if (playButton) { playButton.click(); statusLog(t.playBtnLog(index + 1)); } else { statusLog(t.playBtnErrLog(index + 1)); cleanupIframe(); isCreatingBot = false; botsCreated++; createNextBot(); return; }

                GM_cookie.delete({ name: 'garticio' }, (error) => log(error ? `✖ Bot ${index+1} garticio cookie error` : `✔ Bot ${index+1} garticio cookie deleted`));
                GM_cookie.delete({ name: 'cf_clearance' }, (error) => log(error ? `✖ Bot ${index+1} cf_clearance cookie error` : `✔ Bot ${index+1} cf_clearance cookie deleted`));

                const originalXHROpen = iw.XMLHttpRequest.prototype.open; iw.XMLHttpRequest.prototype.open = function(m, u) { if (u.includes('server?check=')) this.isServerCheck = true; return originalXHROpen.apply(this, arguments); };
                const originalXHRSend = iw.XMLHttpRequest.prototype.send; iw.XMLHttpRequest.prototype.send = function() {
                    if (this.isServerCheck) { this.addEventListener('readystatechange', function() {
                        if (this.readyState === 4 && this.status === 200) { try { const m = this.responseText.match(/(https:\/\/[^?]+)\?c=([^&]+)/); if (m) { websocketUrl = `wss://${m[1].replace('https://','')}/socket.io/?c=${m[2]}&EIO=3&transport=websocket`; statusLog(t.websocketUrlLog); createBotSocket(index, websocketUrl, index === 0); } else { statusLog(t.jsonErrLog(index+1)); cleanupIframe(); isCreatingBot=false; botsCreated++; createNextBot(); } } catch(e) { statusLog(t.jsonErrLog(index+1)); cleanupIframe(); isCreatingBot=false; botsCreated++; createNextBot(); } } }); }
                    return originalXHRSend.apply(this, arguments);
                };
                const originalSend = iw.WebSocket.prototype.send; iw.WebSocket.prototype.send = function(d) {
                    if (typeof d === 'string' && d.startsWith('42[3,{')) { try { const p = JSON.parse(d.substring(2)); if(p[1]?.token){ token=p[1].token; sala=p[1].sala||roomCode; statusLog(t.credsLog(index+1)); document.getElementById('roomCodeDisplay').textContent=sala; return; } } catch(e){ statusLog(t.jsonErrLog(index+1)); cleanupIframe(); isCreatingBot=false; botsCreated++; createNextBot(); } }
                    return originalSend.apply(this, arguments);
                };
            }, 1500);
        };
        iframe.onerror = () => { statusLog(t.iframeErrLog(index+1)); cleanupIframe(); isCreatingBot = false; botsCreated++; createNextBot(); };
    }

    function cleanupIframe() { if (currentIframe) { currentIframe.remove(); currentIframe = null; statusLog(translations[currentLang].iframeRemovedLog); } }

    function isBot(p) { if (!p.nick) return false; const c = p.nick.replace(/[\u200B-\u200D\u2061-\u2063]/g, ''); return c === 'anonimbiri' || c === 'AnonimBiri'; }

    function createBotSocket(index, wsUrl, isFirstBot = false) {
        const t = translations[currentLang]; if (!wsUrl) { statusLog(t.websocketUrlLog); cleanupIframe(); isCreatingBot = false; botsCreated++; createNextBot(); return; }
        statusLog(t.wsConnectingLog(index + 1)); const ws = new WebSocket(wsUrl); ws.index = index; socketList.push(ws);
        ws.onopen = () => statusLog(t.wsOpenLog(index + 1));
        ws.onmessage = (e) => {
            if (e.data === '40') { const n = insertInvisibleChar(isFirstBot ? 'AnonimBiri' : 'anonimbiri'); ws.send(`42[3,{"v":20000,"token":"${token}","nick":"${n}","avatar":"","platform":0,"sala":"${sala}"}]`); statusLog(t.wsJoinedLog(index + 1, n)); }
            if (e.data === '42["6",3]') { statusLog(t.wsRoomFullLog(index + 1)); botQueue = []; cleanupIframe(); isCreatingBot = false; updateButtonState(); return; }
            if (e.data === '42["6",4]') { alert(t.wsInGameLog(index + 1, roomCode)); statusLog(t.wsInGameLog(index + 1, roomCode)); botQueue = []; cleanupIframe(); isCreatingBot = false; updateButtonState(); return; }
            if (e.data.startsWith('42["5",')) {
                try { const p = JSON.parse(e.data.substring(2)); ws.playerId = p[2]; ws.send(`42[46,${ws.playerId}]`); statusLog(t.wsReadyLog(index + 1)); if (p[2] && Array.isArray(p[5])) { const ri=p[4], np=p[5].filter(pl => !isBot(pl)); playerList=updatePlayerListNoDuplicates(np); document.getElementById('roomTheme').textContent=ri.tema||t.noTheme; updatePlayerListUI(); } cleanupIframe(); isCreatingBot=false; botsCreated++; if (botQueue.length === 0) { updateButtonState(); statusLog(t.allBotsSuccessLog(botCount)); } createNextBot(); } catch (er) { statusLog(t.wsDataErrLog(index + 1)); cleanupIframe(); isCreatingBot=false; botsCreated++; createNextBot(); }
            }
            if (e.data === '42["6",null]') { statusLog(t.wsLeaveConfirmLog(index + 1)); socketList=socketList.filter(s=>s!==ws); if(ws.readyState===WebSocket.OPEN)ws.close(); if(socketList.length===0)updateButtonState(); }
            if (typeof e.data === 'string') { try {
                if(e.data.startsWith('42["23",')) { const np=JSON.parse(e.data.substring(2))[1]; if(np&&np.id&&!isBot(np)&&!playerList.some(p=>String(p.id)===String(np.id))){ playerList.push(np); updatePlayerListUI(); statusLog(t.newPlayerLog(np.nick)); } }
                if(e.data.startsWith('42["24",')) { const lpi=JSON.parse(e.data.substring(2))[1]; playerList=playerList.filter(p=>String(p.id)!==String(lpi)); updatePlayerListUI(); statusLog(t.playerLeftLog(lpi)); }
                if(e.data.startsWith('42["16",')) { const p=JSON.parse(e.data.substring(2)), o=[p[1],p[3]], ci=Math.floor(Math.random()*2), c=o[ci]; botChoices.set(ws.playerId,c); log(`Bot ${index} chose ${c}`); setTimeout(()=>{if(ws.readyState===WebSocket.OPEN&&ws.playerId)ws.send(`42[34,${ws.playerId},${ci}]`);}, 8000); }
                if (e.data.startsWith('42["34",')) {
                    if (ws.readyState === WebSocket.OPEN && ws.playerId) {
                        for(let i=0; i<4; i++) ws.send(`42[30,${ws.playerId}]`);
                        log(`Bot ${index}: Confirmed choice. Sent ready signals.`);
                        const choice = botChoices.get(ws.playerId);
                        if (choice) {
                            setTimeout(() => {
                                socketList.forEach((otherSocket) => {
                                    if (otherSocket !== ws && otherSocket.readyState === WebSocket.OPEN && otherSocket.playerId) {
                                        otherSocket.send(`42[13,${otherSocket.playerId},"${choice}"]`);
                                        log(`Bot ${index}: Sent choice "${choice}" to bot ${otherSocket.index+1}`);
                                    }
                                });
                            }, 1000); // 1 second delay
                        }
                    }
                }
            } catch(er) { log(`Bot ${index}: Error parsing update: ${er}`, true); } }
        };
        ws.onerror = () => { statusLog(t.wsErrorLog(index + 1)); socketList=socketList.filter(s=>s!==ws); cleanupIframe(); isCreatingBot = false; botsCreated++; createNextBot(); };
        ws.onclose = () => { statusLog(t.wsCloseLog(index + 1)); socketList=socketList.filter(s=>s!==ws); cleanupIframe(); isCreatingBot = false; createNextBot(); if(socketList.length===0)updateButtonState(); };
    }

    function updatePlayerListNoDuplicates(np) { const e=new Set(playerList.map(p=>String(p.id))), u=[...playerList]; np.forEach(p=>{if(!e.has(String(p.id))){u.push(p);e.add(String(p.id));}}); return u; }

    function updatePlayerListUI() {
        const t = translations[currentLang], el = document.getElementById('playerList');
        if (!playerList || playerList.length === 0) { el.innerHTML = `<div class="info-value" style="grid-column: 1 / -1; text-align: center;">${t.noPlayers}</div>`; return; }
        el.innerHTML = playerList.map(p => `
            <div class="player-card" data-id="${p.id}">
                <div class="player-avatar" style="background-image: url('${getAvatarUrl(p)}');"></div>
                <div class="player-name">${p.nick}<br><small class="player-stats">${t.points}: ${p.pontos||0} | ${t.wins}: ${p.vitorias||0}</small></div>
                <button class="kick-btn" data-id="${p.id}">${t.kickBtn}</button>
            </div>`).join('');
        el.querySelectorAll('.kick-btn').forEach(b => b.addEventListener('click', function() { kickPlayer(this.dataset.id); }));
    }

    function kickPlayer(pId) { const t=translations[currentLang]; if(socketList.length===0){statusLog(t.noBotsToKick);return;} if(pId){socketList.forEach((s,i)=>{if(s.readyState===WebSocket.OPEN&&s.playerId){s.send(`42[45,${s.playerId},["${pId}",true]]`);statusLog(t.kickSentLog(pId, i+1));}});}else{statusLog(t.kickFailLog);} }
    function reportDrawing() { const t=translations[currentLang]; if(socketList.length===0){statusLog(t.noBotsToKick);return;} socketList.forEach((s,i)=>{if(s.readyState===WebSocket.OPEN&&s.playerId){s.send(`42[35,${s.playerId}]`); statusLog(`${t.reportDrawingBtn} request sent (Socket ${i+1})`);}}); }
    function getAvatarUrl(p) { if (p.foto) return p.foto; if (p.avatar !== undefined && p.avatar !== null) return `https://gartic.io/static/images/avatar/svg/${p.avatar}.svg`; return 'https://gartic.io/static/images/avatar/svg/0.svg'; }
    function startPeriodicMessage() { setInterval(()=>{socketList.forEach(s=>{if(s.readyState===WebSocket.OPEN&&s.playerId)s.send(`42[42,${s.playerId}]`);});}, 20000); }

    function startAfkPrevention() {
        if (afkInterval) clearInterval(afkInterval);
        afkInterval = setInterval(() => {
            if (socketList.length > 0) {
                const randomBot = socketList[Math.floor(Math.random() * socketList.length)];
                if (randomBot && randomBot.readyState === WebSocket.OPEN && randomBot.playerId) {
                    const adText = insertInvisibleChar("bot link: ") + "https://greasyfork.org/en/scripts/533419-gartic-anonimbiri-bot-panel";
                    randomBot.send(`42[11,${randomBot.playerId},"${adText}"]`);
                    log(`Bot ${randomBot.index + 1} sent AFK prevention message.`);
                }
            }
        }, 30000); // Send every 30 seconds
    }

    // --- INITIALIZATION ---
    function initialize() {
        startBotsButton.addEventListener('click', () => { (startBotsButton.textContent === translations[currentLang].startBotsBtn) ? startBots() : deleteAllBots(); });
        document.getElementById('startSpam').addEventListener('click', () => { (document.getElementById('startSpam').textContent === translations[currentLang].startSpamBtn) ? startSpam() : stopSpam(); });
        document.getElementById('reportDrawing').addEventListener('click', reportDrawing);

        initCustomUI();

        const browserLang = navigator.language.split('-')[0];
        setLanguage(translations[browserLang] ? browserLang : 'tr');

        const lastPart = window.location.pathname.split('/').pop();
        if (lastPart && lastPart !== 'anonimbiri') {
            const cleanedCode = cleanRoomCode(lastPart);
            document.getElementById('roomCode').value = cleanedCode;
            if (cleanedCode) statusLog(translations[currentLang].urlExtractedLog(cleanedCode));
        }

        log("Gartic Anonimbiri Bot Panel v2025-05-08 initialized");
        statusLog(translations[currentLang].initLog);
    }

    initialize();
})();