// ==UserScript==
// @name         Gartic.io Casino Panel - Multiplayer
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Gartic.io için multiplayer casino paneli
// @author       You
// @match        https://gartic.io/*
// @match        https://*.gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545560/Garticio%20Casino%20Panel%20-%20Multiplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/545560/Garticio%20Casino%20Panel%20-%20Multiplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dumCoins = 50000;
    let currentGame = 'rulet';
    let aviatorMultiplier = 1.00;
    let aviatorActive = false;
    let aviatorInterval = null;
    let minesBoard = [];
    let minesRevealed = [];
    let slotSpinning = false;
    let gameActive = false;
    let plinkoActive = false;
    let autoDropping = false;

    // Multiplayer özellikleri
    let playerNick = '';
    let playerId = '';
    let leaderboardData = [];
    let isOnline = false;
    let updateInterval = null;
    let lastUpdate = Date.now();
    let websocket = null;

    let blackjackGame = {
        deck: [], playerCards: [], dealerCards: [],
        gameActive: false, playerStand: false, dealerHidden: true, bet: 0
    };

    let plinkoStats = { totalDrops: 0, totalWinnings: 0, bestMultiplier: 0, totalWins: 0 };
    let casinoStats = { totalBets: 0, totalWon: 0, totalLost: 0, gamesPlayed: 0, biggestWin: 0, biggestLoss: 0 };
    let sessionStats = { startCoins: 50000, sessionsPlayed: 0, biggestSession: 0 };

    // Multiplayer fonksiyonları
    function generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    function connectToServer() {
        // JSONBin.io kullanarak basit bir backend simülasyonu
        // Gerçek projede WebSocket servisi kullanılmalı
        try {
            isOnline = true;
            console.log('🌐 Sunucuya bağlanıldı (Simülasyon)');
            updatePlayerData();
            startDataSync();
        } catch (error) {
            console.log('❌ Sunucu bağlantısı başarısız:', error);
            isOnline = false;
        }
    }

    function startDataSync() {
        if (updateInterval) clearInterval(updateInterval);

        updateInterval = setInterval(() => {
            if (isOnline && playerNick) {
                updatePlayerData();
                fetchLeaderboard();
            }
        }, 2000); // Her 2 saniyede bir güncelle
    }

    function updatePlayerData() {
        if (!playerNick || !isOnline) return;

        const playerData = {
            id: playerId,
            nick: playerNick,
            coins: dumCoins,
            stats: casinoStats,
            plinkoStats: plinkoStats,
            sessionStats: sessionStats,
            lastActive: Date.now(),
            currentGame: currentGame,
            status: autoDropping ? 'Auto Playing' : gameActive ? 'Playing' : 'Online'
        };

        // localStorage'da oyuncuları sakla (gerçek projede API kullanılmalı)
        const allPlayers = JSON.parse(localStorage.getItem('casino_players') || '{}');
        allPlayers[playerId] = playerData;
        localStorage.setItem('casino_players', JSON.stringify(allPlayers));
    }

    function fetchLeaderboard() {
        try {
            const allPlayers = JSON.parse(localStorage.getItem('casino_players') || '{}');
            const currentTime = Date.now();

            // Son 5 dakika içinde aktif olan oyuncuları filtrele
            leaderboardData = Object.values(allPlayers)
                .filter(player => currentTime - player.lastActive < 300000) // 5 dakika
                .sort((a, b) => b.coins - a.coins)
                .slice(0, 10); // İlk 10

            updateLeaderboardDisplay();
        } catch (error) {
            console.log('Leaderboard güncellenemiyor:', error);
        }
    }

    function updateLeaderboardDisplay() {
        const leaderboard = document.getElementById('multiplayer-leaderboard');
        if (!leaderboard) return;

        if (leaderboardData.length === 0) {
            leaderboard.innerHTML = '<div style="color: #666; text-align: center; padding: 10px;">Henüz oyuncu yok</div>';
            return;
        }

        let html = '<div style="color: #FFD700; font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 8px;">🏆 CANLI SIRALAM</div>';

        leaderboardData.forEach((player, index) => {
            const isCurrentPlayer = player.id === playerId;
            const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            const statusColor = player.status === 'Auto Playing' ? '#FF6B6B' : player.status === 'Playing' ? '#FFA500' : '#4CAF50';
            const netProfit = player.stats.totalWon - player.stats.totalLost;

            html += `
                <div style="
                    background: ${isCurrentPlayer ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'};
                    border: ${isCurrentPlayer ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)'};
                    border-radius: 6px; padding: 6px; margin: 3px 0; font-size: 10px;
                    display: grid; grid-template-columns: 20px 1fr 60px; gap: 6px; align-items: center;
                ">
                    <div style="text-align: center;">${rankIcon}</div>
                    <div style="color: ${isCurrentPlayer ? '#FFD700' : '#FFF'}; font-weight: ${isCurrentPlayer ? 'bold' : 'normal'};">
                        <div style="font-size: 11px;">${player.nick}</div>
                        <div style="font-size: 9px; color: ${statusColor};">● ${player.status}</div>
                    </div>
                    <div style="text-align: right; color: #FFD700; font-weight: bold;">
                        <div>${player.coins.toLocaleString()}</div>
                        <div style="font-size: 8px; color: ${netProfit >= 0 ? '#4CAF50' : '#F44336'};">${netProfit >= 0 ? '+' : ''}${netProfit}</div>
                    </div>
                </div>
            `;
        });

        // Online oyuncu sayısı
        html += `<div style="text-align: center; color: #666; font-size: 9px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px;">
            🌐 ${leaderboardData.length} oyuncu online
        </div>`;

        leaderboard.innerHTML = html;
    }

    function showNickDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex;
            align-items: center; justify-content: center; font-family: Arial;
        `;

        dialog.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 3px solid #FFD700; border-radius: 15px; padding: 30px;
                text-align: center; color: white; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            ">
                <h2 style="color: #FFD700; margin-bottom: 20px;">🎰 DUM CASINO 🎰</h2>
                <p style="margin-bottom: 20px;">Multiplayer moduna katılmak için nick girin:</p>
                <input type="text" id="nick-input" placeholder="Nickinizi girin..." style="
                    width: 200px; padding: 10px; border: 2px solid #FFD700; border-radius: 8px;
                    text-align: center; font-size: 16px; margin-bottom: 20px;
                ">
                <br>
                <button onclick="startMultiplayer()" style="
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    border: none; color: #000; padding: 12px 25px; border-radius: 10px;
                    cursor: pointer; font-weight: bold; font-size: 14px; margin-right: 10px;
                ">🚀 BAŞLA</button>
                <button onclick="startOffline()" style="
                    background: linear-gradient(135deg, #666 0%, #444 100%);
                    border: none; color: white; padding: 12px 25px; border-radius: 10px;
                    cursor: pointer; font-weight: bold; font-size: 14px;
                ">🔒 ÇEVRİMDIŞI</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // Enter tuşu ile başlat
        document.getElementById('nick-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') startMultiplayer();
        });

        window.startMultiplayer = () => {
            const nick = document.getElementById('nick-input').value.trim();
            if (!nick || nick.length < 3) {
                alert('Nick en az 3 karakter olmalı!');
                return;
            }
            if (nick.length > 15) {
                alert('Nick en fazla 15 karakter olabilir!');
                return;
            }

            playerNick = nick;
            playerId = generatePlayerId();
            sessionStats.startCoins = dumCoins;

            document.body.removeChild(dialog);
            connectToServer();

            // Multiplayer panelini göster
            const multiplayerPanel = document.getElementById('multiplayer-panel');
            if (multiplayerPanel) multiplayerPanel.style.display = 'block';
        };

        window.startOffline = () => {
            document.body.removeChild(dialog);
            isOnline = false;

            // Multiplayer panelini gizle
            const multiplayerPanel = document.getElementById('multiplayer-panel');
            if (multiplayerPanel) multiplayerPanel.style.display = 'none';
        };

        // Fokus ver
        setTimeout(() => {
            document.getElementById('nick-input').focus();
        }, 100);
    }

    function loadGameData() {
        try {
            const savedCoins = localStorage.getItem('dumCoins');
            const savedPlinkoStats = localStorage.getItem('plinkoStats');
            const savedCasinoStats = localStorage.getItem('casinoStats');
            const savedSessionStats = localStorage.getItem('sessionStats');

            if (savedCoins) dumCoins = parseInt(savedCoins);
            if (savedPlinkoStats) plinkoStats = JSON.parse(savedPlinkoStats);
            if (savedCasinoStats) casinoStats = JSON.parse(savedCasinoStats);
            if (savedSessionStats) sessionStats = JSON.parse(savedSessionStats);
        } catch (error) {
            console.log('Veri yükleme hatası:', error);
        }
    }

    function saveGameData() {
        try {
            localStorage.setItem('dumCoins', dumCoins.toString());
            localStorage.setItem('plinkoStats', JSON.stringify(plinkoStats));
            localStorage.setItem('casinoStats', JSON.stringify(casinoStats));
            localStorage.setItem('sessionStats', JSON.stringify(sessionStats));
        } catch (error) {
            console.log('Veri kaydetme hatası:', error);
        }
    }

    function updateCoinDisplay() {
        const display = document.getElementById('coin-display');
        if (display) display.textContent = dumCoins.toLocaleString();

        // Session stats güncelle
        const sessionProfit = dumCoins - sessionStats.startCoins;
        if (Math.abs(sessionProfit) > Math.abs(sessionStats.biggestSession)) {
            sessionStats.biggestSession = sessionProfit;
        }

        saveGameData();
        if (isOnline) updatePlayerData();
    }

    function updateBetStats(betAmount, winAmount, gameType) {
        casinoStats.totalBets += betAmount;
        casinoStats.gamesPlayed++;
        if (winAmount > betAmount) {
            const profit = winAmount - betAmount;
            casinoStats.totalWon += profit;
            if (profit > casinoStats.biggestWin) casinoStats.biggestWin = profit;
        } else {
            const loss = betAmount - winAmount;
            casinoStats.totalLost += loss;
            if (loss > casinoStats.biggestLoss) casinoStats.biggestLoss = loss;
        }
        saveGameData();
        updateCasinoStatsDisplay();
        if (isOnline) updatePlayerData();
    }

    function updateCasinoStatsDisplay() {
        const statsContainer = document.getElementById('casino-stats');
        if (statsContainer) {
            const netProfit = casinoStats.totalWon - casinoStats.totalLost;
            const sessionProfit = dumCoins - sessionStats.startCoins;

            statsContainer.innerHTML = `
                <div style="color: #FFD700; font-size: 12px; font-weight: bold;">📊 İSTATİSTİK:</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 11px; color: #FFF; margin-top: 5px;">
                    <div>Oyun: ${casinoStats.gamesPlayed}</div>
                    <div style="color: ${netProfit >= 0 ? '#4CAF50' : '#F44336'};">Toplam: ${netProfit >= 0 ? '+' : ''}${netProfit}</div>
                    <div style="color: ${sessionProfit >= 0 ? '#4CAF50' : '#F44336'};">Oturum: ${sessionProfit >= 0 ? '+' : ''}${sessionProfit}</div>
                    <div style="color: #FFD700;">En İyi: ${sessionStats.biggestSession >= 0 ? '+' : ''}${sessionStats.biggestSession}</div>
                </div>
            `;
        }
    }

    function createCasinoPanel() {
        loadGameData();

        const panel = document.createElement('div');
        panel.id = 'casino-panel';
        panel.style.cssText = `
            position: fixed; top: 10px; left: 10px; width: 380px; height: 580px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border: 3px solid #FFD700; border-radius: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            z-index: 9999; font-family: 'Arial', sans-serif; color: white; overflow: hidden;
        `;

        panel.innerHTML = `
            <div style="padding: 15px; text-align: center; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-bottom: 2px solid #B8860B; color: #000;">
                <h3 style="margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🎰 DUM CASINO 🎰</h3>
                <div style="margin-top: 5px; font-size: 18px; font-weight: bold;">
                    💰 <span id="coin-display">${dumCoins.toLocaleString()}</span> DumCoin
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); background: rgba(0,0,0,0.3);">
                <button onclick="switchGame('rulet')" class="game-btn" id="rulet-btn">🎡</button>
                <button onclick="switchGame('aviator')" class="game-btn" id="aviator-btn">✈️</button>
                <button onclick="switchGame('mines')" class="game-btn" id="mines-btn">💣</button>
                <button onclick="switchGame('slot')" class="game-btn" id="slot-btn">🎰</button>
                <button onclick="switchGame('blackjack')" class="game-btn" id="blackjack-btn">🃏</button>
                <button onclick="switchGame('plinko')" class="game-btn" id="plinko-btn">🎯</button>
            </div>
            <div id="casino-stats" style="background: rgba(0,0,0,0.4); padding: 8px; margin: 5px; border-radius: 8px; border: 1px solid #666; font-size: 11px;"></div>
            <div id="game-area" style="padding: 15px; height: 380px; overflow-y: auto;"></div>
        `;

        document.body.appendChild(panel);

        // Multiplayer paneli
        const multiplayerPanel = document.createElement('div');
        multiplayerPanel.id = 'multiplayer-panel';
        multiplayerPanel.style.cssText = `
            position: fixed; top: 10px; right: 10px; width: 280px; height: 400px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border: 3px solid #FFD700; border-radius: 15px; box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            z-index: 9998; font-family: 'Arial', sans-serif; color: white; overflow: hidden;
            display: none;
        `;

        multiplayerPanel.innerHTML = `
            <div style="padding: 12px; text-align: center; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-bottom: 2px solid #B8860B; color: #000;">
                <h4 style="margin: 0; font-size: 16px;">🌐 MULTIPLAYER</h4>
                <div style="font-size: 12px; margin-top: 3px;">Nick: <span id="player-nick-display"></span></div>
            </div>
            <div id="multiplayer-leaderboard" style="padding: 10px; height: 350px; overflow-y: auto;"></div>
        `;

        document.body.appendChild(multiplayerPanel);

        const style = document.createElement('style');
        style.textContent = `
            .game-btn { padding: 12px 6px; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s ease; }
            .game-btn:hover { background: linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,140,0,0.2) 100%); }
            .game-btn.active { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; border-bottom: 3px solid #B8860B; }
            .bet-input { width: 100px; padding: 8px; border: 2px solid #FFD700; border-radius: 8px; text-align: center; font-size: 14px; font-weight: bold; background: rgba(255,255,255,0.9); color: #333; }
            .action-btn { background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%); border: none; color: white; padding: 12px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 14px; transition: all 0.3s ease; margin: 5px; }
            .action-btn:hover:not(:disabled) { transform: translateY(-2px); }
            .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .success-btn { background: linear-gradient(135deg, #2ED573 0%, #1DD1A1 100%) !important; }
            .warning-btn { background: linear-gradient(135deg, #FFA502 0%, #FF7675 100%) !important; }
            .card { display: inline-block; width: 35px; height: 50px; background: white; border: 2px solid #333; border-radius: 6px; margin: 2px; text-align: center; line-height: 46px; font-size: 11px; font-weight: bold; color: #333; vertical-align: top; }
            .card.red { color: #d63031; }
            .result-display { background: rgba(0,0,0,0.6); border: 2px solid #FFD700; border-radius: 10px; padding: 10px; margin: 10px 0; font-weight: bold; text-align: center; min-height: 20px; }
            .plinko-ball { width: 8px; height: 8px; background: radial-gradient(circle, #FFD700 0%, #FF6B6B 100%); border: 1px solid #FFF; border-radius: 50%; position: absolute; z-index: 10; }
            .plinko-peg { width: 6px; height: 6px; background: #FFF; border-radius: 50%; position: absolute; }
            .plinko-bucket { position: absolute; bottom: 0; width: 16px; height: 35px; border: 2px solid #FFD700; border-radius: 5px 5px 0 0; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; color: #FFD700; }
        `;
        document.head.appendChild(style);

        window.switchGame = switchGame;
        window.playRulet = playRulet;
        window.startAviator = startAviator;
        window.cashoutAviator = cashoutAviator;
        window.revealMine = revealMine;
        window.startMines = startMines;
        window.cashoutMines = cashoutMines;
        window.spinSlot = spinSlot;
        window.startBlackjack = startBlackjack;
        window.hitBlackjack = hitBlackjack;
        window.standBlackjack = standBlackjack;
        window.dropPlinkoBall = dropPlinkoBall;
        window.dropMultipleBalls = dropMultipleBalls;
        window.autoDropBalls = autoDropBalls;

        switchGame('rulet');
        updateCasinoStatsDisplay();

        // Nick dialog göster
        setTimeout(() => {
            showNickDialog();
        }, 1000);
    }

    function switchGame(game) {
        currentGame = game;
        document.querySelectorAll('.game-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(game + '-btn');
        if (activeBtn) activeBtn.classList.add('active');

        const gameArea = document.getElementById('game-area');
        if (!gameArea) return;

        switch(game) {
            case 'rulet': gameArea.innerHTML = createRuletGame(); break;
            case 'aviator': gameArea.innerHTML = createAviatorGame(); break;
            case 'mines': gameArea.innerHTML = createMinesGame(); initMinesBoard(); break;
            case 'slot': gameArea.innerHTML = createSlotGame(); break;
            case 'blackjack': gameArea.innerHTML = createBlackjackGame(); break;
            case 'plinko': gameArea.innerHTML = createPlinkoGame(); setupPlinkoBoard(); break;
        }

        // Online oyuncuya hangi oyunu oynadığını güncelle
        if (isOnline) updatePlayerData();
    }

    // Oyun fonksiyonları (önceki script'teki gibi kalacak - çok uzun olduğu için kısaltıyorum)
    function createRuletGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">🎡 RULET MASASI</h3>
                <div style="margin: 20px 0;">
                    <div style="position: relative; display: inline-block;">
                        <div id="roulette-wheel" style="width: 120px; height: 120px; border: 4px solid #FFD700; border-radius: 50%; margin: 0 auto; background: conic-gradient(#00FF00 0deg 9.7deg, #FF0000 9.7deg 19.4deg, #000000 19.4deg 29.1deg, #FF0000 29.1deg 38.8deg, #000000 38.8deg 48.5deg, #FF0000 48.5deg 58.2deg, #000000 58.2deg 67.9deg, #FF0000 67.9deg 77.6deg, #000000 77.6deg 87.3deg, #FF0000 87.3deg 97deg, #000000 97deg 106.7deg, #FF0000 106.7deg 116.4deg, #000000 116.4deg 126.1deg, #FF0000 126.1deg 135.8deg, #000000 135.8deg 145.5deg, #FF0000 145.5deg 155.2deg, #000000 155.2deg 164.9deg, #FF0000 164.9deg 174.6deg, #000000 174.6deg 184.3deg, #FF0000 184.3deg 194deg, #000000 194deg 203.7deg, #FF0000 203.7deg 213.4deg, #000000 213.4deg 223.1deg, #FF0000 223.1deg 232.8deg, #000000 232.8deg 242.5deg, #FF0000 242.5deg 252.2deg, #000000 252.2deg 261.9deg, #FF0000 261.9deg 271.6deg, #000000 271.6deg 281.3deg, #FF0000 281.3deg 291deg, #000000 291deg 300.7deg, #FF0000 300.7deg 310.4deg, #000000 310.4deg 320.1deg, #FF0000 320.1deg 329.8deg, #000000 329.8deg 339.5deg, #FF0000 339.5deg 349.2deg, #000000 349.2deg 358.9deg, #FF0000 358.9deg 360deg); transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);"></div>
                        <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 16px solid #FFD700; z-index: 10; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"></div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%; z-index: 5;"></div>
                    </div>
                    <div id="roulette-result-display" class="result-display" style="margin-top: 15px; font-size: 18px; color: #FFD700;">Bahis yapın!</div>
                </div>
                <div style="margin: 15px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="rulet-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0;">
                    <button class="action-btn" onclick="playRulet('red')" style="background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%);">🔴 KIRMIZI</button>
                    <button class="action-btn" onclick="playRulet('black')" style="background: linear-gradient(135deg, #333333 0%, #000000 100%);">⚫ SİYAH</button>
                    <button class="action-btn" onclick="playRulet('even')">⚪ ÇİFT</button>
                    <button class="action-btn" onclick="playRulet('odd')">⚪ TEK</button>
                </div>
                <div id="rulet-result" class="result-display">Bahis seçin ve şansınızı deneyin!</div>
            </div>
        `;
    }

    function playRulet(bet) {
        const betAmount = parseInt(document.getElementById('rulet-bet').value);
        if (betAmount > dumCoins || betAmount < 10) return;

        dumCoins -= betAmount;
        updateCoinDisplay();

        // Rastgele sonuç ve fiziksel hesaplama
        const result = Math.floor(Math.random() * 37); // 0-36

        // Gerçek rulet düzeni - sırayla yerleştirilmiş sayılar
        const wheelOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

        // Sonucun wheel'daki pozisyonunu bul
        const resultIndex = wheelOrder.indexOf(result);
        const sectorAngle = 360 / 37; // Her sektör için açı
        const resultAngle = resultIndex * sectorAngle;

        // Renk belirleme
        let isRed = redNumbers.includes(result);
        let isBlack = result > 0 && !isRed;
        let isEven = result > 0 && result % 2 === 0;
        let isOdd = result > 0 && result % 2 === 1;

        const wheel = document.getElementById('roulette-wheel');
        if (wheel) {
            // Wheel'i döndür - sonuç üstteki çubuk altına gelecek şekilde
            const spins = Math.floor(Math.random() * 5) + 4; // 4-8 tur
            const finalAngle = (spins * 360) + (360 - resultAngle); // Çubuk altına gelecek açı
            wheel.style.transform = `rotate(${finalAngle}deg)`;
        }

        // Sonucu bekle ve göster
        setTimeout(() => {
            let resultColor = result === 0 ? '#00FF00' : (isRed ? '#FF0000' : '#FFFFFF');
            let categoryText = result === 0 ? '(YEŞİL-0)' : (isRed ? '(KIRMIZI)' : '(SİYAH)');

            document.getElementById('roulette-result-display').innerHTML =
                `<span style="color: ${resultColor}; font-weight: bold; background: rgba(${result === 0 ? '0,255,0' : isRed ? '255,0,0' : '255,255,255'},0.2); padding: 5px 10px; border-radius: 15px;">${result} ${categoryText}</span>`;

            let won = (bet === 'red' && isRed) || (bet === 'black' && isBlack) || (bet === 'even' && isEven) || (bet === 'odd' && isOdd);

            if (won) {
                const winAmount = betAmount * 2;
                dumCoins += winAmount;
                updateBetStats(betAmount, winAmount, 'rulet');
                document.getElementById('rulet-result').innerHTML =
                    `<span style="color: #00FF00;">🎉 KAZANDINIZ!</span><br>Çıkan: ${result} ${categoryText}<br><span style="color: #FFD700;">+${winAmount} DumCoin</span>`;
            } else {
                updateBetStats(betAmount, 0, 'rulet');
                document.getElementById('rulet-result').innerHTML =
                    `<span style="color: #FF6B6B;">😢 KAYBETTİNİZ!</span><br>Çıkan: ${result} ${categoryText}<br><span style="color: #FF6B6B;">-${betAmount} DumCoin</span>`;
            }
            updateCoinDisplay();
        }, 3200);
    }

    function createAviatorGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">✈️ AVIATOR UÇAĞI</h3>
                <div style="margin: 20px 0;">
                    <div style="width: 280px; height: 150px; background: linear-gradient(to bottom, #87CEEB, #98FB98); border: 3px solid #FFD700; border-radius: 15px; margin: 0 auto; position: relative;">
                        <div id="aviator-plane" style="position: absolute; bottom: 20px; left: 20px; font-size: 30px;">✈️</div>
                        <div id="aviator-multiplier" style="position: absolute; top: 15px; right: 15px; font-size: 24px; font-weight: bold; color: #333; background: rgba(255,255,255,0.8); padding: 8px 15px; border-radius: 10px;">1.00x</div>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="aviator-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="aviator-start-btn" class="action-btn" onclick="startAviator()" style="background: linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%);">🚀 UÇUŞU BAŞLAT</button>
                    <button id="aviator-cashout-btn" class="action-btn success-btn" onclick="cashoutAviator()" disabled>💰 PARA ÇEK</button>
                </div>
                <div id="aviator-result" class="result-display">Uçağın düşmeden önce para çekin!</div>
            </div>
        `;
    }

    function startAviator() {
        const betAmount = parseInt(document.getElementById('aviator-bet').value);
        if (betAmount > dumCoins || betAmount < 10) return;

        dumCoins -= betAmount;
        updateCoinDisplay();

        aviatorActive = true;
        aviatorMultiplier = 1.00;

        document.getElementById('aviator-start-btn').disabled = true;
        document.getElementById('aviator-cashout-btn').disabled = false;
        document.getElementById('aviator-result').innerHTML = '<span style="color: #00FF00;">✈️ Uçak havalandı!</span>';

        const crashPoint = 1.0 + Math.random() * 8;

        aviatorInterval = setInterval(() => {
            if (!aviatorActive) return;

            aviatorMultiplier += 0.01;
            document.getElementById('aviator-multiplier').textContent = aviatorMultiplier.toFixed(2) + 'x';

            const plane = document.getElementById('aviator-plane');
            const progress = Math.min((aviatorMultiplier - 1) * 40, 200);
            plane.style.left = (20 + progress) + 'px';
            plane.style.bottom = (20 + progress/4) + 'px';
            plane.style.transform = `rotate(${progress/15}deg)`;

            if (aviatorMultiplier >= crashPoint) {
                aviatorActive = false;
                clearInterval(aviatorInterval);
                updateBetStats(betAmount, 0, 'aviator');
                document.getElementById('aviator-result').innerHTML = `<span style="color: #FF6B6B;">💥 Uçak düştü! ${aviatorMultiplier.toFixed(2)}x'de</span>`;
                document.getElementById('aviator-start-btn').disabled = false;
                document.getElementById('aviator-cashout-btn').disabled = true;

                setTimeout(() => {
                    plane.style.left = '20px';
                    plane.style.bottom = '20px';
                    plane.style.transform = 'rotate(0deg)';
                    document.getElementById('aviator-multiplier').textContent = '1.00x';
                }, 1500);
            }
        }, 100);
    }

    function cashoutAviator() {
        if (!aviatorActive) return;

        aviatorActive = false;
        clearInterval(aviatorInterval);

        const betAmount = parseInt(document.getElementById('aviator-bet').value);
        const winAmount = Math.floor(betAmount * aviatorMultiplier);

        dumCoins += winAmount;
        updateBetStats(betAmount, winAmount, 'aviator');
        updateCoinDisplay();

        document.getElementById('aviator-result').innerHTML = `<span style="color: #00FF00;">🎉 Başarılı çıkış! ${aviatorMultiplier.toFixed(2)}x</span><br>+${winAmount} DumCoin`;
        document.getElementById('aviator-start-btn').disabled = false;
        document.getElementById('aviator-cashout-btn').disabled = true;
    }

    function createMinesGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">💣 MAYIN TARLASI</h3>
                <div style="margin: 15px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="mines-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>
                <div style="display: flex; justify-content: center; gap: 15px; margin: 15px 0;">
                    <button class="action-btn" onclick="startMines()" id="mines-start-btn">🎮 OYUNU BAŞLAT</button>
                    <button class="action-btn success-btn" onclick="cashoutMines()" id="mines-cashout-btn" disabled>💰 PARA ÇEK</button>
                </div>
                <div id="mines-board" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 20px auto; width: 200px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;"></div>
                <div id="mines-result" class="result-display">4 mayın var! Elmasları bulun!</div>
            </div>
        `;
    }

    function initMinesBoard() {
        minesBoard = Array(16).fill(false);
        minesRevealed = Array(16).fill(false);
        updateMinesBoard();
    }

    function updateMinesBoard() {
        const board = document.getElementById('mines-board');
        if (!board) return;

        board.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                width: 40px; height: 40px; background: linear-gradient(135deg, #666 0%, #444 100%);
                border: 2px solid #999; border-radius: 8px; display: flex; align-items: center;
                justify-content: center; cursor: pointer; font-size: 20px; transition: all 0.3s ease;
            `;

            if (minesRevealed[i]) {
                if (minesBoard[i]) {
                    cell.textContent = '💣';
                    cell.style.background = 'linear-gradient(135deg, #FF4757 0%, #CC2E3F 100%)';
                } else {
                    cell.textContent = '💎';
                    cell.style.background = 'linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%)';
                }
                cell.style.cursor = 'default';
            } else {
                if (gameActive) {
                    cell.addEventListener('click', () => revealMine(i));
                    cell.addEventListener('mouseenter', () => {
                        cell.style.background = 'linear-gradient(135deg, #888 0%, #666 100%)';
                    });
                    cell.addEventListener('mouseleave', () => {
                        cell.style.background = 'linear-gradient(135deg, #666 0%, #444 100%)';
                    });
                }
            }
            board.appendChild(cell);
        }
    }

    function startMines() {
        const betAmount = parseInt(document.getElementById('mines-bet').value);
        if (betAmount > dumCoins || betAmount < 10) return;

        dumCoins -= betAmount;
        updateCoinDisplay();
        gameActive = true;

        minesBoard = Array(16).fill(false);
        minesRevealed = Array(16).fill(false);

        let minesPlaced = 0;
        while (minesPlaced < 4) {
            const pos = Math.floor(Math.random() * 16);
            if (!minesBoard[pos]) {
                minesBoard[pos] = true;
                minesPlaced++;
            }
        }

        updateMinesBoard();
        document.getElementById('mines-result').innerHTML = '<span style="color: #FFD700;">💎 Elmasları bulun!</span>';
        document.getElementById('mines-start-btn').disabled = true;
        document.getElementById('mines-cashout-btn').disabled = false;
    }

    function revealMine(index) {
        if (minesRevealed[index] || !gameActive) return;

        minesRevealed[index] = true;
        updateMinesBoard();

        const betAmount = parseInt(document.getElementById('mines-bet').value);

        if (minesBoard[index]) {
            gameActive = false;
            updateBetStats(betAmount, 0, 'mines');
            document.getElementById('mines-result').innerHTML = `<span style="color: #FF6B6B;">💣 Mayına bastınız!</span><br>-${betAmount} DumCoin`;
            document.getElementById('mines-start-btn').disabled = false;
            document.getElementById('mines-cashout-btn').disabled = true;

            setTimeout(() => {
                for (let i = 0; i < 16; i++) {
                    if (minesBoard[i]) minesRevealed[i] = true;
                }
                updateMinesBoard();
            }, 500);
        } else {
            const revealedCount = minesRevealed.filter((revealed, i) => revealed && !minesBoard[i]).length;
            const multiplier = 1 + (revealedCount * 0.4);
            const currentWin = Math.floor(betAmount * multiplier);

            document.getElementById('mines-result').innerHTML = `<span style="color: #00FF00;">💎 ${revealedCount} elmas!</span><br>Kazanç: ${currentWin} DC (${multiplier.toFixed(1)}x)`;

            if (revealedCount === 12) {
                gameActive = false;
                dumCoins += currentWin;
                updateBetStats(betAmount, currentWin, 'mines');
                updateCoinDisplay();
                document.getElementById('mines-result').innerHTML = `<span style="color: #00FF00;">🎉 Tüm elmaslar!</span><br>+${currentWin} DumCoin`;
                document.getElementById('mines-start-btn').disabled = false;
                document.getElementById('mines-cashout-btn').disabled = true;
            }
        }
    }

    function cashoutMines() {
        if (!gameActive) return;

        const betAmount = parseInt(document.getElementById('mines-bet').value);
        const revealedCount = minesRevealed.filter((revealed, i) => revealed && !minesBoard[i]).length;

        if (revealedCount === 0) {
            document.getElementById('mines-result').innerHTML = '<span style="color: #FF6B6B;">❌ Önce elmas bulun!</span>';
            return;
        }

        gameActive = false;
        const multiplier = 1 + (revealedCount * 0.4);
        const winAmount = Math.floor(betAmount * multiplier);

        dumCoins += winAmount;
        updateBetStats(betAmount, winAmount, 'mines');
        updateCoinDisplay();

        document.getElementById('mines-result').innerHTML = `<span style="color: #00FF00;">💰 Para çekildi!</span><br>+${winAmount} DumCoin`;
        document.getElementById('mines-start-btn').disabled = false;
        document.getElementById('mines-cashout-btn').disabled = true;
    }

    function createSlotGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">🎰 SLOT MAKİNESİ</h3>
                <div style="margin: 20px 0;">
                    <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 20px; border-radius: 15px; display: inline-block;">
                        <div style="display: flex; justify-content: center; gap: 15px;">
                            <div id="reel1" style="width: 60px; height: 80px; border: 3px solid #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 30px; background: white; color: black;">🍒</div>
                            <div id="reel2" style="width: 60px; height: 80px; border: 3px solid #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 30px; background: white; color: black;">🍋</div>
                            <div id="reel3" style="width: 60px; height: 80px; border: 3px solid #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 30px; background: white; color: black;">🍊</div>
                        </div>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="slot-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>
                <button class="action-btn" onclick="spinSlot()" id="slot-spin-btn" style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); font-size: 16px; padding: 15px 30px;">🎰 ÇEVİR!</button>
                <div style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <div style="color: #FFD700; font-size: 14px; font-weight: bold;">🏆 KAZANÇ TABLOSU:</div>
                    <div style="font-size: 12px; color: #FFF;">💎💎💎 = 20x • 🍒🍒🍒 = 10x • 🍋🍋🍋 = 8x • 🍊🍊🍊 = 6x</div>
                </div>
                <div id="slot-result" class="result-display">Üç aynı sembol ile kazanın!</div>
            </div>
        `;
    }

    function spinSlot() {
        const betAmount = parseInt(document.getElementById('slot-bet').value);
        if (betAmount > dumCoins || betAmount < 10 || slotSpinning) return;

        dumCoins -= betAmount;
        updateCoinDisplay();
        slotSpinning = true;

        const spinBtn = document.getElementById('slot-spin-btn');
        if (spinBtn) spinBtn.disabled = true;

        const symbols = ['🍒', '🍋', '🍊', '💎', '⭐', '🍇'];
        const reels = ['reel1', 'reel2', 'reel3'];
        const results = [];

        document.getElementById('slot-result').innerHTML = '<span style="color: #FFD700;">🎰 Makaralar dönüyor...</span>';

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            reels.forEach(reelId => {
                const reel = document.getElementById(reelId);
                if (reel) {
                    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.textContent = randomSymbol;
                }
            });

            spinCount++;
            if (spinCount > 25) {
                clearInterval(spinInterval);

                results.length = 0;
                reels.forEach(reelId => {
                    const reel = document.getElementById(reelId);
                    if (reel) {
                        const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                        reel.textContent = finalSymbol;
                        results.push(finalSymbol);
                    }
                });

                let multiplier = 0;
                if (results.length === 3 && results[0] === results[1] && results[1] === results[2]) {
                    switch(results[0]) {
                        case '💎': multiplier = 20; break;
                        case '🍒': multiplier = 10; break;
                        case '🍋': multiplier = 8; break;
                        case '🍊': multiplier = 6; break;
                        case '⭐': multiplier = 15; break;
                        case '🍇': multiplier = 5; break;
                        default: multiplier = 4;
                    }
                }

                if (multiplier > 0) {
                    const winAmount = betAmount * multiplier;
                    dumCoins += winAmount;
                    updateBetStats(betAmount, winAmount, 'slot');
                    document.getElementById('slot-result').innerHTML = `<span style="color: #00FF00;">🎉 JACKPOT!</span><br>${results.join(' ')}<br>+${winAmount} DumCoin (${multiplier}x)`;
                } else {
                    updateBetStats(betAmount, 0, 'slot');
                    document.getElementById('slot-result').innerHTML = `<span style="color: #FF6B6B;">😢 Şanssızlık!</span><br>${results.join(' ')}<br>-${betAmount} DumCoin`;
                }

                updateCoinDisplay();
                slotSpinning = false;
                if (spinBtn) spinBtn.disabled = false;
            }
        }, 80);
    }

    function createBlackjackGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">🃏 BLACKJACK 21</h3>
                <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <div style="margin-bottom: 15px;">
                        <div style="color: #FFD700; font-weight: bold;">🎭 KRUPYE:</div>
                        <div id="dealer-cards" style="min-height: 60px; display: flex; justify-content: center; flex-wrap: wrap;"></div>
                        <div id="dealer-total" style="color: #FFF; font-weight: bold;"></div>
                    </div>
                    <div>
                        <div style="color: #00FF00; font-weight: bold;">👤 SİZ:</div>
                        <div id="player-cards" style="min-height: 60px; display: flex; justify-content: center; flex-wrap: wrap;"></div>
                        <div id="player-total" style="color: #FFF; font-weight: bold;"></div>
                    </div>
                </div>
                <div style="margin: 20px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="blackjack-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>
                <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button class="action-btn" onclick="startBlackjack()" id="blackjack-start-btn">🃏 BAŞLAT</button>
                    <button class="action-btn warning-btn" onclick="hitBlackjack()" id="blackjack-hit-btn" disabled>📥 KART ÇEK</button>
                    <button class="action-btn success-btn" onclick="standBlackjack()" id="blackjack-stand-btn" disabled>✋ PAS</button>
                </div>
                <div id="blackjack-result" class="result-display">21'e yaklaş ama geçme!</div>
            </div>
        `;
    }

    function createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];

        for (let suit of suits) {
            for (let value of values) {
                deck.push({
                    value: value,
                    suit: suit,
                    numValue: value === 'A' ? 11 : (value === 'J' || value === 'Q' || value === 'K') ? 10 : parseInt(value)
                });
            }
        }

        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function calculateHandValue(cards) {
        let value = 0;
        let aces = 0;

        for (let card of cards) {
            if (card.value === 'A') {
                aces++;
                value += 11;
            } else {
                value += card.numValue;
            }
        }

        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }

    function renderCards(cards, containerId, hideFirst = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const cardElement = document.createElement('div');

            if (hideFirst && i === 0) {
                cardElement.className = 'card';
                cardElement.style.background = '#333';
                cardElement.style.color = '#666';
                cardElement.textContent = '?';
            } else {
                const isRed = card.suit === '♥' || card.suit === '♦';
                cardElement.className = `card ${isRed ? 'red' : ''}`;
                cardElement.textContent = card.value + card.suit;
            }

            container.appendChild(cardElement);
        }
    }

    function startBlackjack() {
        const betAmount = parseInt(document.getElementById('blackjack-bet').value);
        if (betAmount > dumCoins || betAmount < 10) return;

        dumCoins -= betAmount;
        updateCoinDisplay();

        blackjackGame.deck = createDeck();
        blackjackGame.playerCards = [];
        blackjackGame.dealerCards = [];
        blackjackGame.gameActive = true;
        blackjackGame.bet = betAmount;

        blackjackGame.playerCards.push(blackjackGame.deck.pop());
        blackjackGame.dealerCards.push(blackjackGame.deck.pop());
        blackjackGame.playerCards.push(blackjackGame.deck.pop());
        blackjackGame.dealerCards.push(blackjackGame.deck.pop());

        renderCards(blackjackGame.playerCards, 'player-cards');
        renderCards(blackjackGame.dealerCards, 'dealer-cards', true);

        const playerTotal = calculateHandValue(blackjackGame.playerCards);
        document.getElementById('player-total').textContent = `Toplam: ${playerTotal}`;
        document.getElementById('dealer-total').textContent = 'Toplam: ?';

        document.getElementById('blackjack-start-btn').disabled = true;
        document.getElementById('blackjack-hit-btn').disabled = false;
        document.getElementById('blackjack-stand-btn').disabled = false;

        if (playerTotal === 21) {
            document.getElementById('blackjack-result').innerHTML = '🎉 BLACKJACK!';
            setTimeout(() => endBlackjackGame(), 1000);
        } else {
            document.getElementById('blackjack-result').textContent = 'Kart çek veya pas geç!';
        }
    }

    function hitBlackjack() {
        if (!blackjackGame.gameActive) return;

        blackjackGame.playerCards.push(blackjackGame.deck.pop());
        renderCards(blackjackGame.playerCards, 'player-cards');

        const playerTotal = calculateHandValue(blackjackGame.playerCards);
        document.getElementById('player-total').textContent = `Toplam: ${playerTotal}`;

        if (playerTotal > 21) {
            document.getElementById('blackjack-result').innerHTML = `💥 BATTI! ${playerTotal}`;
            endBlackjackGame();
        } else if (playerTotal === 21) {
            document.getElementById('blackjack-result').textContent = '🎯 21! Krupye sırası...';
            setTimeout(() => standBlackjack(), 1000);
        } else {
            document.getElementById('blackjack-result').textContent = `Toplam: ${playerTotal} - Devam!`;
        }
    }

    function standBlackjack() {
        if (!blackjackGame.gameActive) return;

        blackjackGame.playerStand = true;
        blackjackGame.dealerHidden = false;

        renderCards(blackjackGame.dealerCards, 'dealer-cards', false);
        let dealerTotal = calculateHandValue(blackjackGame.dealerCards);
        document.getElementById('dealer-total').textContent = `Toplam: ${dealerTotal}`;

        document.getElementById('blackjack-hit-btn').disabled = true;
        document.getElementById('blackjack-stand-btn').disabled = true;

        const dealerPlay = () => {
            if (dealerTotal < 17) {
                setTimeout(() => {
                    blackjackGame.dealerCards.push(blackjackGame.deck.pop());
                    renderCards(blackjackGame.dealerCards, 'dealer-cards', false);
                    dealerTotal = calculateHandValue(blackjackGame.dealerCards);
                    document.getElementById('dealer-total').textContent = `Toplam: ${dealerTotal}`;

                    if (dealerTotal < 17) {
                        dealerPlay();
                    } else {
                        setTimeout(() => endBlackjackGame(), 1000);
                    }
                }, 1000);
            } else {
                setTimeout(() => endBlackjackGame(), 1000);
            }
        };

        dealerPlay();
    }

    function endBlackjackGame() {
        if (!blackjackGame.gameActive) return;

        blackjackGame.gameActive = false;
        const playerTotal = calculateHandValue(blackjackGame.playerCards);
        const dealerTotal = calculateHandValue(blackjackGame.dealerCards);

        renderCards(blackjackGame.dealerCards, 'dealer-cards', false);
        document.getElementById('dealer-total').textContent = `Toplam: ${dealerTotal}`;

        let result = '';
        let winAmount = 0;

        if (playerTotal > 21) {
            result = `💥 BATTI! -${blackjackGame.bet} DumCoin`;
        } else if (dealerTotal > 21) {
            result = `🎉 KRUPYE BATTI! +${blackjackGame.bet * 2} DumCoin`;
            winAmount = blackjackGame.bet * 2;
        } else if (playerTotal === 21 && blackjackGame.playerCards.length === 2) {
            result = `🃏 BLACKJACK! +${Math.floor(blackjackGame.bet * 2.5)} DumCoin`;
            winAmount = Math.floor(blackjackGame.bet * 2.5);
        } else if (playerTotal > dealerTotal) {
            result = `🎉 KAZANDINIZ! +${blackjackGame.bet * 2} DumCoin`;
            winAmount = blackjackGame.bet * 2;
        } else if (playerTotal < dealerTotal) {
            result = `😢 KAYBETTİNİZ! -${blackjackGame.bet} DumCoin`;
        } else {
            result = `🤝 BERABERE! +${blackjackGame.bet} DumCoin`;
            winAmount = blackjackGame.bet;
        }

        dumCoins += winAmount;
        updateBetStats(blackjackGame.bet, winAmount, 'blackjack');
        updateCoinDisplay();

        document.getElementById('blackjack-result').innerHTML = result;
        document.getElementById('blackjack-start-btn').disabled = false;
        document.getElementById('blackjack-hit-btn').disabled = true;
        document.getElementById('blackjack-stand-btn').disabled = true;
    }

    function createPlinkoGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">🎯 PLINKO</h3>
                <div style="margin: 15px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis: </label>
                    <input type="number" id="plinko-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>
                <div style="position: relative; width: 350px; height: 280px; margin: 20px auto; background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%); border: 3px solid #FFD700; border-radius: 10px; overflow: hidden;" id="plinko-board"></div>
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button class="action-btn" onclick="dropPlinkoBall()">🎯 AT</button>
                    <button class="action-btn" onclick="dropMultipleBalls()">🎯 5x</button>
                    <button class="action-btn" onclick="autoDropBalls()" id="plinko-auto-btn">⚡ AUTO</button>
                </div>
                <div id="plinko-stats" style="background: rgba(0,0,0,0.4); padding: 8px; border-radius: 8px; margin: 10px 0;">
                    <div style="color: #FFD700; font-size: 12px;">📊 STATS:</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 11px; color: #FFF;">
                        <div>Atış: <span id="total-drops">0</span></div>
                        <div>Net: <span id="total-winnings">0</span></div>
                    </div>
                </div>
                <div id="plinko-result" class="result-display">Top at!</div>
            </div>
        `;
    }

    function setupPlinkoBoard() {
        const board = document.getElementById('plinko-board');
        if (!board) return;

        board.innerHTML = '';

        // BÜYÜK ÇİVİLER - Daha geniş dağılım
        for (let row = 1; row < 12; row++) {
            const pegsInRow = row + 2; // Daha fazla çivi
            const startX = (350 - (pegsInRow * 30)) / 2; // Geniş spacing

            for (let col = 0; col < pegsInRow; col++) {
                const peg = document.createElement('div');
                peg.className = 'plinko-peg';
                peg.style.left = (startX + col * 30) + 'px'; // 30px spacing
                peg.style.top = (15 + row * 22) + 'px'; // Daha geniş aralık
                board.appendChild(peg);
            }
        }

        // DAHA FAZLA KOVA - 26 adet, çoğu kaybettiren
        const multipliers = [1000, 130, 26, 9, 2, 1, 0.5, 0.3, 0.2, 0.1, 0.1, 0.2, 0.3, 0.2, 0.1, 0.1, 0.2, 0.3, 0.5, 1, 2, 9, 26, 130, 1000];
        const bucketWidth = 13;
        const startX = (350 - (multipliers.length * bucketWidth)) / 2;

        multipliers.forEach((mult, index) => {
            const bucket = document.createElement('div');
            bucket.className = 'plinko-bucket';
            bucket.style.left = (startX + index * bucketWidth) + 'px';
            bucket.style.width = bucketWidth + 'px';
            bucket.style.height = '40px'; // Daha yüksek kovalar

            let bgColor = mult >= 100 ? '#FF1744' : mult >= 10 ? '#FF9800' : mult >= 2 ? '#4CAF50' : mult >= 1 ? '#2196F3' : mult >= 0.3 ? '#FF5722' : '#8B0000';

            bucket.style.background = bgColor;
            bucket.style.fontSize = '7px';
            bucket.textContent = mult + 'x';
            bucket.setAttribute('data-multiplier', mult);
            board.appendChild(bucket);
        });

        updatePlinkoStats();
    }

    function updatePlinkoStats() {
        saveGameData();
        const elements = {
            'total-drops': plinkoStats.totalDrops,
            'total-winnings': plinkoStats.totalWinnings
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });
    }

    function dropPlinkoBall() {
        const betAmount = parseInt(document.getElementById('plinko-bet').value);
        if (betAmount > dumCoins || betAmount < 10) return;

        dumCoins -= betAmount;
        updateCoinDisplay();
        createAndAnimateBall(betAmount);
    }

    function dropMultipleBalls() {
        const betAmount = parseInt(document.getElementById('plinko-bet').value);
        const totalCost = betAmount * 5;

        if (totalCost > dumCoins || betAmount < 10) return;

        dumCoins -= totalCost;
        updateCoinDisplay();

        for (let i = 0; i < 5; i++) {
            setTimeout(() => createAndAnimateBall(betAmount), i * 200);
        }
    }

    function autoDropBalls() {
        const btn = document.getElementById('plinko-auto-btn');

        if (autoDropping) {
            autoDropping = false;
            btn.textContent = '⚡ AUTO';
            return;
        }

        const betAmount = parseInt(document.getElementById('plinko-bet').value);
        if (betAmount > dumCoins || betAmount < 10) return;

        autoDropping = true;
        btn.textContent = '⏸️ DURDUR';

        const autoInterval = setInterval(() => {
            if (!autoDropping || dumCoins < betAmount) {
                autoDropping = false;
                btn.textContent = '⚡ AUTO';
                clearInterval(autoInterval);
                return;
            }

            dumCoins -= betAmount;
            updateCoinDisplay();
            createAndAnimateBall(betAmount);
        }, 500);
    }

    function createAndAnimateBall(betAmount) {
        const board = document.getElementById('plinko-board');
        const ball = document.createElement('div');
        ball.className = 'plinko-ball';

        // Başlangıç pozisyonu - orta ağırlıklı ama biraz rastgele
        let ballX = 175 + (Math.random() - 0.5) * 30; // Daha dar başlangıç
        let ballY = 5;
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';

        board.appendChild(ball);
        plinkoStats.totalDrops++;
        updatePlinkoStats();

        const maxY = 240;
        const speed = 2.5;
        let lastHitRow = -1;

        const animate = () => {
            ballY += speed;

            const currentRow = Math.floor((ballY - 15) / 22);
            if (currentRow >= 1 && currentRow < 12 && currentRow !== lastHitRow) {
                const pegsInRow = currentRow + 2;
                const startX = (350 - (pegsInRow * 30)) / 2;

                // En yakın çiviyi bul - GENİŞ MENZIL
                let closestPegX = null;
                let minDistance = Infinity;

                for (let i = 0; i < pegsInRow; i++) {
                    const pegX = startX + i * 30;
                    const distance = Math.abs(ballX - pegX);
                    if (distance < minDistance && distance < 20) { // Büyük çarpma alanı
                        minDistance = distance;
                        closestPegX = pegX;
                    }
                }

                if (closestPegX !== null) {
                    lastHitRow = currentRow;

                    // ORTA AĞIRLIKLI SEKME - Kenarlara zor gider
                    const direction = Math.random();
                    if (direction < 0.25) {
                        ballX -= (6 + Math.random() * 10); // Orta sol
                    } else if (direction < 0.50) {
                        ballX += (6 + Math.random() * 10); // Orta sağ
                    } else if (direction < 0.85) {
                        // %35 şansla orta düşme
                        ballX += (Math.random() - 0.5) * 8;
                    } else {
                        // %15 şansla güçlü sekme
                        ballX += Math.random() < 0.5 ? -(12 + Math.random() * 15) : (12 + Math.random() * 15);
                    }
                    ballX = Math.max(10, Math.min(340, ballX)); // Kenarlara zor ulaşır
                }
            }

            ball.style.left = ballX + 'px';
            ball.style.top = ballY + 'px';

            if (ballY < maxY) {
                requestAnimationFrame(animate);
            } else {
                // MEGA GENİŞ KAPLAMA SİSTEMİ
                const buckets = document.querySelectorAll('.plinko-bucket');
                let hitBucket = null;
                let minDistance = Infinity;

                // En yakın kovayı bul - dar kaplama alanı
                buckets.forEach(bucket => {
                    const bucketRect = bucket.getBoundingClientRect();
                    const ballRect = ball.getBoundingClientRect();
                    const boardRect = board.getBoundingClientRect();

                    const ballCenterX = ballRect.left - boardRect.left + 4;
                    const bucketCenterX = bucketRect.left - boardRect.left + 6.5;
                    const distance = Math.abs(ballCenterX - bucketCenterX);

                    if (distance < minDistance && distance < 18) { // Dar kaplama
                        minDistance = distance;
                        hitBucket = bucket;
                    }
                });

                // Hiçbir kovaya düşmediyse ORTA kovalara yönlendir
                if (!hitBucket) {
                    const ballCenterX = ball.getBoundingClientRect().left - board.getBoundingClientRect().left + 4;

                    // %90 şansla orta kaybettiren kovalara yönlendir
                    if (Math.random() < 0.9) {
                        const middleBuckets = Array.from(buckets).slice(8, 17); // Orta kaybettiren kovalar
                        hitBucket = middleBuckets[Math.floor(Math.random() * middleBuckets.length)];
                    } else {
                        // %10 şansla kenar kovalara
                        if (ballCenterX < 175) {
                            const leftBuckets = Array.from(buckets).slice(0, 4);
                            hitBucket = leftBuckets[Math.floor(Math.random() * leftBuckets.length)];
                        } else {
                            const rightBuckets = Array.from(buckets).slice(-4);
                            hitBucket = rightBuckets[Math.floor(Math.random() * rightBuckets.length)];
                        }
                    }
                }

                // Fiziksel kovadaki çarpanı al
                let multiplier = 1;
                if (hitBucket) {
                    multiplier = parseFloat(hitBucket.getAttribute('data-multiplier'));

                    // KÜÇÜK GÖRSEL EFEKT
                    hitBucket.style.background = multiplier >= 10 ? '#FFD700' : multiplier >= 1 ? '#00FF00' : '#FF0000';
                    hitBucket.style.transform = 'scale(1.5)';
                    hitBucket.style.border = '3px solid #FFFFFF';
                    hitBucket.style.boxShadow = '0 0 15px rgba(255,215,0,0.6)';
                    hitBucket.style.zIndex = '100';

                    setTimeout(() => {
                        let bgColor = multiplier >= 100 ? '#FF1744' : multiplier >= 10 ? '#FF9800' : multiplier >= 2 ? '#4CAF50' : multiplier >= 1 ? '#2196F3' : multiplier >= 0.3 ? '#FF5722' : '#8B0000';
                        hitBucket.style.background = bgColor;
                        hitBucket.style.transform = 'scale(1)';
                        hitBucket.style.border = '2px solid #FFD700';
                        hitBucket.style.boxShadow = 'none';
                        hitBucket.style.zIndex = 'auto';
                    }, 1000);
                }

                const winAmount = Math.floor(betAmount * multiplier);
                dumCoins += winAmount;
                updateBetStats(betAmount, winAmount, 'plinko');
                updateCoinDisplay();

                plinkoStats.totalWinnings += winAmount - betAmount;
                if (multiplier > plinkoStats.bestMultiplier) {
                    plinkoStats.bestMultiplier = multiplier;
                }
                if (multiplier >= 1) {
                    plinkoStats.totalWins++;
                }
                updatePlinkoStats();

                if (!autoDropping) {
                    if (multiplier >= 100) {
                        document.getElementById('plinko-result').innerHTML = `<span style="color: #FFD700; font-size: 18px;">🚀 ${multiplier}x MEGA WIN!</span><br>Bahis: ${betAmount} → Kazanç: ${winAmount}<br><span style="color: #FFD700; font-size: 16px;">Net: +${winAmount - betAmount} DC 💰</span>`;
                    } else if (multiplier >= 1) {
                        const netProfit = winAmount - betAmount;
                        document.getElementById('plinko-result').innerHTML = `<span style="color: #00FF00;">🎉 ${multiplier}x KAZANÇ!</span><br>Bahis: ${betAmount} → Kazanç: ${winAmount}<br><span style="color: #FFD700;">Net: +${netProfit} DC</span>`;
                    } else {
                        const netLoss = betAmount - winAmount;
                        document.getElementById('plinko-result').innerHTML = `<span style="color: #FF6B6B;">😢 ${multiplier}x Kayıp</span><br>Bahis: ${betAmount} → Dönüş: ${winAmount}<br><span style="color: #FF6B6B;">Net: -${netLoss} DC</span>`;
                    }
                }

                setTimeout(() => ball.remove(), 3000);
            }
        };

        animate();
    }

    // Panel başlatma
    setTimeout(() => {
        createCasinoPanel();

        // Nick dialog'ını göster
        setTimeout(() => {
            if (document.getElementById('player-nick-display')) {
                document.getElementById('player-nick-display').textContent = playerNick || 'Çevrimdışı';
            }
        }, 100);
    }, 1000);

    // Sayfa kapatılırken temizlik
    window.addEventListener('beforeunload', () => {
        if (updateInterval) clearInterval(updateInterval);
        if (isOnline && playerId) {
            // Son güncellemeyi gönder
            const allPlayers = JSON.parse(localStorage.getItem('casino_players') || '{}');
            if (allPlayers[playerId]) {
                allPlayers[playerId].lastActive = Date.now() - 600000; // 10 dakika öncesi yap (offline göster)
                localStorage.setItem('casino_players', JSON.stringify(allPlayers));
            }
        }
    });

})();