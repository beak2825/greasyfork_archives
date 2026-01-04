// ==UserScript==
// @name         Gartic.io Casino Panel
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Gartic.io için casino paneli - Rulet, Aviator, Mines, Slot, Blackjack
// @author       Muho
// @match        https://gartic.io/*
// @match        https://*.gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545538/Garticio%20Casino%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/545538/Garticio%20Casino%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dumCoins = 50000; // Başlangıç parası
    let currentGame = 'rulet';
    let aviatorMultiplier = 1.00;
    let aviatorActive = false;
    let aviatorInterval = null;
    let minesBoard = [];
    let minesRevealed = [];
    let slotSpinning = false;
    let gameActive = false; // Mines için oyun durumu

    // Blackjack oyun durumu
    let blackjackGame = {
        deck: [],
        playerCards: [],
        dealerCards: [],
        gameActive: false,
        playerStand: false,
        dealerHidden: true,
        bet: 0
    };

    // Ana panel oluştur
    function createCasinoPanel() {
        const panel = document.createElement('div');
        panel.id = 'casino-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 380px;
            height: 550px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border: 3px solid #FFD700;
            border-radius: 15px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.5);
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            color: white;
            overflow: hidden;
        `;

        panel.innerHTML = `
            <div style="padding: 15px; text-align: center; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); border-bottom: 2px solid #B8860B; color: #000;">
                <h3 style="margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🎰 DUM CASINO 🎰</h3>
                <div style="margin-top: 5px; font-size: 18px; font-weight: bold;">
                    💰 <span id="coin-display">${dumCoins.toLocaleString()}</span> DumCoin
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(5, 1fr); background: rgba(0,0,0,0.3);">
                <button onclick="window.switchGame('rulet')" class="game-btn" id="rulet-btn">🎡 Rulet</button>
                <button onclick="window.switchGame('aviator')" class="game-btn" id="aviator-btn">✈️ Aviator</button>
                <button onclick="window.switchGame('mines')" class="game-btn" id="mines-btn">💣 Mines</button>
                <button onclick="window.switchGame('slot')" class="game-btn" id="slot-btn">🎰 Slot</button>
                <button onclick="window.switchGame('blackjack')" class="game-btn" id="blackjack-btn">🃏 21</button>
            </div>

            <div id="game-area" style="padding: 15px; height: 420px; overflow-y: auto;"></div>
        `;

        document.body.appendChild(panel);

        // CSS stilleri ekle
        const style = document.createElement('style');
        style.textContent = `
            .game-btn {
                padding: 12px 8px;
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                transition: all 0.3s ease;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .game-btn:hover {
                background: linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,140,0,0.2) 100%);
                transform: translateY(-1px);
            }
            .game-btn.active {
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                color: #000;
                border-bottom: 3px solid #B8860B;
                text-shadow: none;
            }
            .bet-input {
                width: 100px;
                padding: 8px;
                border: 2px solid #FFD700;
                border-radius: 8px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                background: rgba(255,255,255,0.9);
                color: #333;
            }
            .action-btn {
                background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%);
                border: none;
                color: white;
                padding: 12px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: all 0.3s ease;
                margin: 5px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                box-shadow: 0 4px 12px rgba(255,107,107,0.3);
            }
            .action-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255,107,107,0.4);
            }
            .action-btn:active:not(:disabled) {
                transform: translateY(0px);
            }
            .action-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
                box-shadow: none !important;
            }
            .success-btn {
                background: linear-gradient(135deg, #2ED573 0%, #1DD1A1 100%) !important;
                box-shadow: 0 4px 12px rgba(46,213,115,0.3) !important;
            }
            .success-btn:hover:not(:disabled) {
                box-shadow: 0 6px 20px rgba(46,213,115,0.4) !important;
            }
            .warning-btn {
                background: linear-gradient(135deg, #FFA502 0%, #FF7675 100%) !important;
                box-shadow: 0 4px 12px rgba(255,165,2,0.3) !important;
            }
            .card {
                display: inline-block;
                width: 40px;
                height: 56px;
                background: white;
                border: 2px solid #333;
                border-radius: 6px;
                margin: 2px;
                text-align: center;
                line-height: 52px;
                font-size: 12px;
                font-weight: bold;
                color: #333;
                vertical-align: top;
            }
            .card.red {
                color: #d63031;
            }
            .result-display {
                background: rgba(0,0,0,0.6);
                border: 2px solid #FFD700;
                border-radius: 10px;
                padding: 10px;
                margin: 10px 0;
                font-weight: bold;
                text-align: center;
                min-height: 20px;
            }
        `;
        document.head.appendChild(style);

        // Global fonksiyonları tanımla
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

        switchGame('rulet');
    }

    function updateCoinDisplay() {
        const display = document.getElementById('coin-display');
        if (display) {
            display.textContent = dumCoins.toLocaleString();
        }
    }

    function switchGame(game) {
        currentGame = game;

        // Buton durumlarını güncelle
        document.querySelectorAll('.game-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(game + '-btn');
        if (activeBtn) activeBtn.classList.add('active');

        const gameArea = document.getElementById('game-area');
        if (!gameArea) return;

        switch(game) {
            case 'rulet':
                gameArea.innerHTML = createRuletGame();
                break;
            case 'aviator':
                gameArea.innerHTML = createAviatorGame();
                break;
            case 'mines':
                gameArea.innerHTML = createMinesGame();
                initMinesBoard();
                break;
            case 'slot':
                gameArea.innerHTML = createSlotGame();
                break;
            case 'blackjack':
                gameArea.innerHTML = createBlackjackGame();
                break;
        }
    }

    function createRuletGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">🎡 RULET MASASI</h3>
                <div style="margin: 20px 0;">
                    <div style="position: relative; display: inline-block;">
                        <div id="roulette-wheel" style="width: 180px; height: 180px; border: 4px solid #FFD700; border-radius: 50%; margin: 0 auto; position: relative; background: conic-gradient(#00FF00 0deg 9.7deg, #FF0000 9.7deg 19.4deg, #000000 19.4deg 29.1deg, #FF0000 29.1deg 38.8deg, #000000 38.8deg 48.5deg, #FF0000 48.5deg 58.2deg, #000000 58.2deg 67.9deg, #FF0000 67.9deg 77.6deg, #000000 77.6deg 87.3deg, #FF0000 87.3deg 97deg, #000000 97deg 106.7deg, #FF0000 106.7deg 116.4deg, #000000 116.4deg 126.1deg, #FF0000 126.1deg 135.8deg, #000000 135.8deg 145.5deg, #FF0000 145.5deg 155.2deg, #000000 155.2deg 164.9deg, #FF0000 164.9deg 174.6deg, #000000 174.6deg 184.3deg, #FF0000 184.3deg 194deg, #000000 194deg 203.7deg, #FF0000 203.7deg 213.4deg, #000000 213.4deg 223.1deg, #FF0000 223.1deg 232.8deg, #000000 232.8deg 242.5deg, #FF0000 242.5deg 252.2deg, #000000 252.2deg 261.9deg, #FF0000 261.9deg 271.6deg, #000000 271.6deg 281.3deg, #FF0000 281.3deg 291deg, #000000 291deg 300.7deg, #FF0000 300.7deg 310.4deg, #000000 310.4deg 320.1deg, #FF0000 320.1deg 329.8deg, #000000 329.8deg 339.5deg, #FF0000 339.5deg 349.2deg, #000000 349.2deg 358.9deg, #FF0000 358.9deg 360deg); transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1); box-shadow: inset 0 0 20px rgba(255,215,0,0.3);">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 15px; height: 15px; background: white; border-radius: 50%; box-shadow: 0 0 10px rgba(255,255,255,0.8);"></div>
                        </div>
                        <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 16px solid #FFD700; z-index: 10; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></div>
                    </div>
                    <div id="roulette-result-display" class="result-display" style="margin-top: 15px; font-size: 20px; color: #FFD700;">Bahis yapın ve şansınızı deneyin!</div>
                </div>

                <div style="margin: 15px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="rulet-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0;">
                    <button class="action-btn" onclick="window.playRulet('red')" id="rulet-red-btn" style="background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%);">🔴 KIRMIZI (2x)</button>
                    <button class="action-btn" onclick="window.playRulet('black')" id="rulet-black-btn" style="background: linear-gradient(135deg, #333333 0%, #000000 100%);">⚫ SİYAH (2x)</button>
                    <button class="action-btn" onclick="window.playRulet('even')" id="rulet-even-btn">⚪ ÇİFT SAYI (2x)</button>
                    <button class="action-btn" onclick="window.playRulet('odd')" id="rulet-odd-btn">⚪ TEK SAYI (2x)</button>
                </div>

                <div id="rulet-result" class="result-display" style="font-size: 16px;">Bahis seçin ve oyunu başlatın!</div>
            </div>
        `;
    }

    function createAviatorGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">✈️ AVIATOR UÇAĞI</h3>
                <div style="margin: 20px 0;">
                    <div style="width: 300px; height: 180px; background: linear-gradient(to bottom, #87CEEB, #98FB98); border: 3px solid #FFD700; border-radius: 15px; margin: 0 auto; position: relative; overflow: hidden; box-shadow: inset 0 0 20px rgba(255,215,0,0.2);">
                        <div id="aviator-plane" style="position: absolute; bottom: 20px; left: 20px; font-size: 35px; transition: all 0.1s; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">✈️</div>
                        <div id="aviator-multiplier" style="position: absolute; top: 20px; right: 20px; font-size: 28px; font-weight: bold; color: #333; background: rgba(255,255,255,0.8); padding: 8px 15px; border-radius: 10px; border: 2px solid #FFD700;">1.00x</div>
                        <div style="position: absolute; bottom: 10px; left: 10px; font-size: 12px; color: #333; background: rgba(255,255,255,0.7); padding: 5px; border-radius: 5px;">Uçak yükseldikçe çarpan artar!</div>
                    </div>
                </div>

                <div style="margin: 20px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="aviator-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>

                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="aviator-start-btn" class="action-btn" onclick="window.startAviator()" style="background: linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%); box-shadow: 0 4px 12px rgba(0,210,255,0.3);">🚀 UÇUŞU BAŞLAT</button>
                    <button id="aviator-cashout-btn" class="action-btn success-btn" onclick="window.cashoutAviator()" disabled>💰 PARA ÇEK</button>
                </div>

                <div id="aviator-result" class="result-display" style="font-size: 16px;">Uçağın düşmeden önce para çekin!</div>
            </div>
        `;
    }

    function createMinesGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">💣 MAYIN TARLASI</h3>

                <div style="background: rgba(255,215,0,0.1); padding: 10px; border-radius: 10px; margin: 10px 0; border: 2px solid #FFD700;">
                    <div style="font-size: 14px; color: #FFD700; margin-bottom: 5px;">📋 OYUN KURALLARI:</div>
                    <div style="font-size: 12px; color: #FFF;">4 mayın var • Elmas bul kazanç artar • Mayına basarsan kaybedersin</div>
                </div>

                <div style="margin: 15px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="mines-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>

                <div style="display: flex; justify-content: center; gap: 15px; margin: 15px 0;">
                    <button class="action-btn" onclick="window.startMines()" id="mines-start-btn">🎮 OYUNU BAŞLAT</button>
                    <button class="action-btn success-btn" onclick="window.cashoutMines()" id="mines-cashout-btn" disabled>💰 PARA ÇEK</button>
                </div>

                <div id="mines-board" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 20px auto; width: 240px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; border: 2px solid #FFD700;"></div>

                <div id="mines-result" class="result-display">Oyunu başlatın ve dikkatli seçim yapın!</div>
            </div>
        `;
    }

    function createSlotGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">🎰 SLOT MAKİNESİ</h3>

                <div style="margin: 20px 0;">
                    <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 20px; border-radius: 15px; display: inline-block; border: 3px solid #B8860B;">
                        <div style="display: flex; justify-content: center; gap: 15px; margin: 10px 0;">
                            <div class="slot-reel" id="reel1" style="width: 70px; height: 90px; border: 3px solid #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 35px; background: white; color: black; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);">🍒</div>
                            <div class="slot-reel" id="reel2" style="width: 70px; height: 90px; border: 3px solid #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 35px; background: white; color: black; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);">🍋</div>
                            <div class="slot-reel" id="reel3" style="width: 70px; height: 90px; border: 3px solid #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 35px; background: white; color: black; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);">🍊</div>
                        </div>
                    </div>
                </div>

                <div style="margin: 20px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="slot-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>

                <button class="action-btn" onclick="window.spinSlot()" id="slot-spin-btn" style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); font-size: 16px; padding: 15px 30px;">🎰 ÇEVİR!</button>

                <div style="background: rgba(255,215,0,0.1); padding: 15px; border-radius: 10px; margin: 20px 0; border: 2px solid #FFD700;">
                    <div style="color: #FFD700; font-size: 14px; font-weight: bold; margin-bottom: 8px;">🏆 KAZANÇ TABLOSU:</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; font-size: 12px; color: #FFF;">
                        <div>💎💎💎 = 20x</div>
                        <div>🍒🍒🍒 = 10x</div>
                        <div>🍋🍋🍋 = 8x</div>
                        <div>🍊🍊🍊 = 6x</div>
                    </div>
                </div>

                <div id="slot-result" class="result-display">Üç aynı sembol ile kazanın!</div>
            </div>
        `;
    }

    function createBlackjackGame() {
        return `
            <div style="text-align: center;">
                <h3 style="color: #FFD700; margin-bottom: 15px;">🃏 BLACKJACK 21</h3>

                <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 10px; margin: 15px 0; border: 2px solid #FFD700;">
                    <div style="margin-bottom: 15px;">
                        <div style="color: #FFD700; font-weight: bold; margin-bottom: 5px;">🎭 KRUPYE ELLERİ:</div>
                        <div id="dealer-cards" style="min-height: 60px; display: flex; justify-content: center; flex-wrap: wrap; align-items: center;"></div>
                        <div id="dealer-total" style="color: #FFF; font-weight: bold; margin-top: 5px;"></div>
                    </div>

                    <div>
                        <div style="color: #00FF00; font-weight: bold; margin-bottom: 5px;">👤 SİZİN ELLERİNİZ:</div>
                        <div id="player-cards" style="min-height: 60px; display: flex; justify-content: center; flex-wrap: wrap; align-items: center;"></div>
                        <div id="player-total" style="color: #FFF; font-weight: bold; margin-top: 5px;"></div>
                    </div>
                </div>

                <div style="margin: 20px 0;">
                    <label style="color: #FFD700; font-weight: bold;">💰 Bahis Miktarı: </label>
                    <input type="number" id="blackjack-bet" class="bet-input" value="100" min="10" max="${dumCoins}">
                </div>

                <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button class="action-btn" onclick="window.startBlackjack()" id="blackjack-start-btn">🃏 OYUNU BAŞLAT</button>
                    <button class="action-btn warning-btn" onclick="window.hitBlackjack()" id="blackjack-hit-btn" disabled>📥 KART ÇEK</button>
                    <button class="action-btn success-btn" onclick="window.standBlackjack()" id="blackjack-stand-btn" disabled>✋ PAS</button>
                </div>

                <div style="background: rgba(255,215,0,0.1); padding: 10px; border-radius: 10px; margin: 15px 0; border: 2px solid #FFD700;">
                    <div style="color: #FFD700; font-size: 12px; font-weight: bold;">📋 KURALLAR:</div>
                    <div style="font-size: 11px; color: #FFF;">21'e yaklaş ama geçme • As = 1 veya 11 • J,Q,K = 10</div>
                </div>

                <div id="blackjack-result" class="result-display">Bahis yapın ve kartları çekin!</div>
            </div>
        `;
    }

    // Blackjack fonksiyonları
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

        // Kartları karıştır
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

        // As'ları düzelt (11'den 1'e çevir)
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
        if (betAmount > dumCoins || betAmount < 10) {
            document.getElementById('blackjack-result').textContent = '❌ Geçersiz bahis miktarı!';
            return;
        }

        dumCoins -= betAmount;
        updateCoinDisplay();

        blackjackGame.deck = createDeck();
        blackjackGame.playerCards = [];
        blackjackGame.dealerCards = [];
        blackjackGame.gameActive = true;
        blackjackGame.playerStand = false;
        blackjackGame.dealerHidden = true;
        blackjackGame.bet = betAmount;

        // İlk kartları dağıt
        blackjackGame.playerCards.push(blackjackGame.deck.pop());
        blackjackGame.dealerCards.push(blackjackGame.deck.pop());
        blackjackGame.playerCards.push(blackjackGame.deck.pop());
        blackjackGame.dealerCards.push(blackjackGame.deck.pop());

        renderCards(blackjackGame.playerCards, 'player-cards');
        renderCards(blackjackGame.dealerCards, 'dealer-cards', true);

        const playerTotal = calculateHandValue(blackjackGame.playerCards);
        document.getElementById('player-total').textContent = `Toplam: ${playerTotal}`;
        document.getElementById('dealer-total').textContent = 'Toplam: ?';

        // Butonları güncelle
        document.getElementById('blackjack-start-btn').disabled = true;
        document.getElementById('blackjack-hit-btn').disabled = false;
        document.getElementById('blackjack-stand-btn').disabled = false;

        // Blackjack kontrolü
        if (playerTotal === 21) {
            document.getElementById('blackjack-result').innerHTML = '🎉 BLACKJACK! Otomatik kazanç!';
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
            document.getElementById('blackjack-result').innerHTML = `💥 BATTI! ${playerTotal} - Kaybettiniz!<br>-${blackjackGame.bet} DumCoin`;
            endBlackjackGame();
        } else if (playerTotal === 21) {
            document.getElementById('blackjack-result').textContent = '🎯 21! Krupye sırası...';
            setTimeout(() => standBlackjack(), 1000);
        } else {
            document.getElementById('blackjack-result').textContent = `Toplam: ${playerTotal} - Devam edin!`;
        }
    }

    function standBlackjack() {
        if (!blackjackGame.gameActive) return;

        blackjackGame.playerStand = true;
        blackjackGame.dealerHidden = false;

        // Krupye kartlarını göster
        renderCards(blackjackGame.dealerCards, 'dealer-cards', false);
        let dealerTotal = calculateHandValue(blackjackGame.dealerCards);
        document.getElementById('dealer-total').textContent = `Toplam: ${dealerTotal}`;

        document.getElementById('blackjack-hit-btn').disabled = true;
        document.getElementById('blackjack-stand-btn').disabled = true;

        // Krupye 17'ye kadar kart çeker
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

        // Tüm kartları göster
        renderCards(blackjackGame.dealerCards, 'dealer-cards', false);
        document.getElementById('dealer-total').textContent = `Toplam: ${dealerTotal}`;

        let result = '';
        let winAmount = 0;

        if (playerTotal > 21) {
            result = `💥 BATTI! Siz: ${playerTotal}<br>-${blackjackGame.bet} DumCoin`;
        } else if (dealerTotal > 21) {
            result = `🎉 KRUPYE BATTI! Kazandınız!<br>+${blackjackGame.bet * 2} DumCoin`;
            winAmount = blackjackGame.bet * 2;
        } else if (playerTotal === 21 && blackjackGame.playerCards.length === 2) {
            result = `🃏 BLACKJACK! Süper kazanç!<br>+${Math.floor(blackjackGame.bet * 2.5)} DumCoin`;
            winAmount = Math.floor(blackjackGame.bet * 2.5);
        } else if (playerTotal > dealerTotal) {
            result = `🎉 KAZANDINIZ! Siz: ${playerTotal} vs ${dealerTotal}<br>+${blackjackGame.bet * 2} DumCoin`;
            winAmount = blackjackGame.bet * 2;
        } else if (playerTotal < dealerTotal) {
            result = `😢 KAYBETTİNİZ! Siz: ${playerTotal} vs ${dealerTotal}<br>-${blackjackGame.bet} DumCoin`;
        } else {
            result = `🤝 BERABERE! Siz: ${playerTotal} vs ${dealerTotal}<br>+${blackjackGame.bet} DumCoin (İade)`;
            winAmount = blackjackGame.bet;
        }

        dumCoins += winAmount;
        updateCoinDisplay();

        document.getElementById('blackjack-result').innerHTML = result;
        document.getElementById('blackjack-start-btn').disabled = false;
        document.getElementById('blackjack-hit-btn').disabled = true;
        document.getElementById('blackjack-stand-btn').disabled = true;
    }

    function playRulet(bet) {
        const betAmount = parseInt(document.getElementById('rulet-bet').value);
        if (betAmount > dumCoins || betAmount < 10) {
            document.getElementById('rulet-result').innerHTML = '<span style="color: #FF6B6B;">❌ Geçersiz bahis miktarı!</span>';
            return;
        }

        // Butonları devre dışı bırak
        const buttons = ['rulet-red-btn', 'rulet-black-btn', 'rulet-even-btn', 'rulet-odd-btn'];
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.disabled = true;
        });

        dumCoins -= betAmount;
        updateCoinDisplay();

        // Rulet sonucunu önceden hesapla
        const result = Math.floor(Math.random() * 37); // 0-36
        const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(result);
        const isBlack = result > 0 && !isRed;
        const isEven = result > 0 && result % 2 === 0;
        const isOdd = result > 0 && result % 2 === 1;

        // Dönme animasyonu
        const wheel = document.getElementById('roulette-wheel');
        const resultDisplay = document.getElementById('roulette-result-display');

        if (wheel && resultDisplay) {
            document.getElementById('rulet-result').innerHTML = '<span style="color: #FFD700;">🎡 Rulet dönüyor... Şansınızı deneyin!</span>';
            resultDisplay.innerHTML = '<span style="color: #FFD700;">🎰 Rulet dönüyor...</span>';

            // Her sayı için açı hesapla (37 sektör)
            const sectorAngle = 360 / 37;
            const resultAngle = result * sectorAngle;

            // Random dönüş sayısı + hedef açı
            const spins = Math.floor(Math.random() * 5) + 4;
            const targetAngle = (spins * 360) - resultAngle;

            wheel.style.transform = `rotate(${targetAngle}deg)`;

            // Sonucu göster
            setTimeout(() => {
                let resultColor = result === 0 ? '#00FF00' : (isRed ? '#FF0000' : '#FFFFFF');
                let resultBg = result === 0 ? 'rgba(0,255,0,0.3)' : (isRed ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,0,0.8)');

                resultDisplay.innerHTML = `<span style="color: ${resultColor}; background: ${resultBg}; padding: 8px 20px; border-radius: 25px; border: 2px solid ${resultColor}; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${result}</span>`;

                let won = false;
                if ((bet === 'red' && isRed) ||
                    (bet === 'black' && isBlack) ||
                    (bet === 'even' && isEven) ||
                    (bet === 'odd' && isOdd)) {
                    won = true;
                    dumCoins += betAmount * 2;
                    document.getElementById('rulet-result').innerHTML = `<span style="color: #00FF00;">🎉 KAZANDINIZ!</span><br>Çıkan Sayı: <span style="color: ${resultColor}; font-weight: bold;">${result}</span><br><span style="color: #FFD700;">+${betAmount * 2} DumCoin</span>`;
                } else {
                    document.getElementById('rulet-result').innerHTML = `<span style="color: #FF6B6B;">😢 KAYBETTİNİZ!</span><br>Çıkan Sayı: <span style="color: ${resultColor}; font-weight: bold;">${result}</span><br><span style="color: #FF6B6B;">-${betAmount} DumCoin</span>`;
                }

                updateCoinDisplay();

                // Butonları tekrar aktif et
                setTimeout(() => {
                    buttons.forEach(btnId => {
                        const btn = document.getElementById(btnId);
                        if (btn) btn.disabled = false;
                    });
                }, 1000);
            }, 3200);
        }
    }

    function startAviator() {
        const betAmount = parseInt(document.getElementById('aviator-bet').value);
        if (betAmount > dumCoins || betAmount < 10) {
            document.getElementById('aviator-result').innerHTML = '<span style="color: #FF6B6B;">❌ Geçersiz bahis miktarı!</span>';
            return;
        }

        dumCoins -= betAmount;
        updateCoinDisplay();

        aviatorActive = true;
        aviatorMultiplier = 1.00;

        const startBtn = document.getElementById('aviator-start-btn');
        const cashoutBtn = document.getElementById('aviator-cashout-btn');
        if (startBtn) startBtn.disabled = true;
        if (cashoutBtn) cashoutBtn.disabled = false;

        document.getElementById('aviator-result').innerHTML = '<span style="color: #00FF00;">✈️ Uçak havalandı! Düşmeden para çekin!</span>';

        // Çıkma olasılığı sistemi - daha gerçekçi
        let crashPoint = 1.0 + Math.random() * 4; // 1.0 - 5.0 arası
        if (Math.random() < 0.05) crashPoint = 1.0 + Math.random() * 10; // %5 şansla yüksek çarpan

        aviatorInterval = setInterval(() => {
            if (!aviatorActive) return;

            aviatorMultiplier += 0.01;
            const multiplierDisplay = document.getElementById('aviator-multiplier');
            if (multiplierDisplay) {
                multiplierDisplay.textContent = aviatorMultiplier.toFixed(2) + 'x';
            }

            // Uçak animasyonu
            const plane = document.getElementById('aviator-plane');
            if (plane) {
                const progress = Math.min((aviatorMultiplier - 1) * 60, 250);
                plane.style.left = (20 + progress) + 'px';
                plane.style.bottom = (20 + progress/3) + 'px';
                plane.style.transform = `rotate(${progress/10}deg)`;
            }

            // Crash kontrolü
            if (aviatorMultiplier >= crashPoint) {
                aviatorActive = false;
                clearInterval(aviatorInterval);

                document.getElementById('aviator-result').innerHTML = `<span style="color: #FF6B6B;">💥 Uçak düştü! ${aviatorMultiplier.toFixed(2)}x'de</span><br><span style="color: #FF6B6B;">-${betAmount} DumCoin</span>`;

                if (startBtn) startBtn.disabled = false;
                if (cashoutBtn) cashoutBtn.disabled = true;

                // Reset animasyonu
                setTimeout(() => {
                    if (plane) {
                        plane.style.left = '20px';
                        plane.style.bottom = '20px';
                        plane.style.transform = 'rotate(0deg)';
                    }
                    if (multiplierDisplay) {
                        multiplierDisplay.textContent = '1.00x';
                    }
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
        updateCoinDisplay();

        document.getElementById('aviator-result').innerHTML = `<span style="color: #00FF00;">🎉 Başarılı çıkış! ${aviatorMultiplier.toFixed(2)}x</span><br><span style="color: #FFD700;">+${winAmount} DumCoin</span>`;

        const startBtn = document.getElementById('aviator-start-btn');
        const cashoutBtn = document.getElementById('aviator-cashout-btn');
        if (startBtn) startBtn.disabled = false;
        if (cashoutBtn) cashoutBtn.disabled = true;

        // Reset animasyonu
        setTimeout(() => {
            const plane = document.getElementById('aviator-plane');
            const multiplierDisplay = document.getElementById('aviator-multiplier');
            if (plane) {
                plane.style.left = '20px';
                plane.style.bottom = '20px';
                plane.style.transform = 'rotate(0deg)';
            }
            if (multiplierDisplay) {
                multiplierDisplay.textContent = '1.00x';
            }
        }, 1000);
    }

    function initMinesBoard() {
        minesBoard = Array(16).fill(false);
        minesRevealed = Array(16).fill(false);
        gameActive = false; // Oyun başlatılmadı

        // 4 mayın yerleştir
        let minesPlaced = 0;
        while (minesPlaced < 4) {
            const pos = Math.floor(Math.random() * 16);
            if (!minesBoard[pos]) {
                minesBoard[pos] = true;
                minesPlaced++;
            }
        }

        updateMinesBoard();
    }

    function updateMinesBoard() {
        const board = document.getElementById('mines-board');
        if (!board) return;

        board.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #666 0%, #444 100%);
                border: 2px solid #999;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;

            if (minesRevealed[i]) {
                if (minesBoard[i]) {
                    cell.textContent = '💣';
                    cell.style.background = 'linear-gradient(135deg, #FF4757 0%, #CC2E3F 100%)';
                    cell.style.boxShadow = '0 0 15px rgba(255,71,87,0.5)';
                } else {
                    cell.textContent = '💎';
                    cell.style.background = 'linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%)';
                    cell.style.boxShadow = '0 0 15px rgba(0,210,255,0.5)';
                }
                cell.style.cursor = 'default';
            } else {
                cell.addEventListener('click', () => window.revealMine(i));
                cell.addEventListener('mouseenter', () => {
                    if (gameActive) {
                        cell.style.background = 'linear-gradient(135deg, #888 0%, #666 100%)';
                        cell.style.transform = 'translateY(-2px)';
                    }
                });
                cell.addEventListener('mouseleave', () => {
                    cell.style.background = 'linear-gradient(135deg, #666 0%, #444 100%)';
                    cell.style.transform = 'translateY(0px)';
                });
            }

            board.appendChild(cell);
        }
    }

    function startMines() {
        const betAmount = parseInt(document.getElementById('mines-bet').value);
        if (betAmount > dumCoins || betAmount < 10) {
            document.getElementById('mines-result').innerHTML = '<span style="color: #FF6B6B;">❌ Geçersiz bahis miktarı!</span>';
            return;
        }

        dumCoins -= betAmount;
        updateCoinDisplay();
        gameActive = true;

        // Yeni oyun için board'u sıfırla
        minesBoard = Array(16).fill(false);
        minesRevealed = Array(16).fill(false);

        // 4 mayın yerleştir
        let minesPlaced = 0;
        while (minesPlaced < 4) {
            const pos = Math.floor(Math.random() * 16);
            if (!minesBoard[pos]) {
                minesBoard[pos] = true;
                minesPlaced++;
            }
        }

        updateMinesBoard();
        document.getElementById('mines-result').innerHTML = '<span style="color: #FFD700;">💎 Elmasları bulun! Mayınlardan kaçının!</span>';

        const startBtn = document.getElementById('mines-start-btn');
        const cashoutBtn = document.getElementById('mines-cashout-btn');
        if (startBtn) startBtn.disabled = true;
        if (cashoutBtn) cashoutBtn.disabled = false;
    }

    function revealMine(index) {
        if (minesRevealed[index] || !gameActive) return;

        minesRevealed[index] = true;
        updateMinesBoard();

        const betAmount = parseInt(document.getElementById('mines-bet').value);

        if (minesBoard[index]) {
            // Mayın buldu - oyun bitti
            gameActive = false;
            document.getElementById('mines-result').innerHTML = `<span style="color: #FF6B6B;">💣 Mayına bastınız! Oyun bitti!</span><br><span style="color: #FF6B6B;">-${betAmount} DumCoin</span>`;

            const startBtn = document.getElementById('mines-start-btn');
            const cashoutBtn = document.getElementById('mines-cashout-btn');
            if (startBtn) startBtn.disabled = false;
            if (cashoutBtn) cashoutBtn.disabled = true;

            // Tüm mayınları göster
            setTimeout(() => {
                for (let i = 0; i < 16; i++) {
                    if (minesBoard[i]) minesRevealed[i] = true;
                }
                updateMinesBoard();
            }, 500);
        } else {
            // Güvenli alan
            const revealedCount = minesRevealed.filter((revealed, i) => revealed && !minesBoard[i]).length;
            const multiplier = 1 + (revealedCount * 0.4); // Her elmas %40 bonus
            const currentWin = Math.floor(betAmount * multiplier);

            document.getElementById('mines-result').innerHTML = `<span style="color: #00FF00;">💎 Elmas bulundu!</span><br>Mevcut kazanç: <span style="color: #FFD700;">${currentWin} DumCoin (${multiplier.toFixed(1)}x)</span>`;

            // Tüm güvenli alanlar bulundu
            if (revealedCount === 12) {
                gameActive = false;
                dumCoins += currentWin;
                updateCoinDisplay();
                document.getElementById('mines-result').innerHTML = `<span style="color: #00FF00;">🎉 Tüm elmasları buldunuz!</span><br><span style="color: #FFD700;">+${currentWin} DumCoin</span>`;

                const startBtn = document.getElementById('mines-start-btn');
                const cashoutBtn = document.getElementById('mines-cashout-btn');
                if (startBtn) startBtn.disabled = false;
                if (cashoutBtn) cashoutBtn.disabled = true;
            }
        }
    }

    function cashoutMines() {
        if (!gameActive) {
            document.getElementById('mines-result').innerHTML = '<span style="color: #FF6B6B;">❌ Önce oyunu başlatın!</span>';
            return;
        }

        const betAmount = parseInt(document.getElementById('mines-bet').value);
        const revealedCount = minesRevealed.filter((revealed, i) => revealed && !minesBoard[i]).length;

        if (revealedCount === 0) {
            document.getElementById('mines-result').innerHTML = '<span style="color: #FF6B6B;">❌ Önce bir elmas bulun!</span>';
            return;
        }

        gameActive = false;
        const multiplier = 1 + (revealedCount * 0.4);
        const winAmount = Math.floor(betAmount * multiplier);

        dumCoins += winAmount;
        updateCoinDisplay();

        document.getElementById('mines-result').innerHTML = `<span style="color: #00FF00;">💰 Para çekildi! ${revealedCount} elmas bulundu</span><br><span style="color: #FFD700;">+${winAmount} DumCoin (${multiplier.toFixed(1)}x)</span>`;

        const startBtn = document.getElementById('mines-start-btn');
        const cashoutBtn = document.getElementById('mines-cashout-btn');
        if (startBtn) startBtn.disabled = false;
        if (cashoutBtn) cashoutBtn.disabled = true;

        // Oyunu sıfırla
        setTimeout(() => {
            minesBoard = Array(16).fill(false);
            minesRevealed = Array(16).fill(false);
            updateMinesBoard();
        }, 2000);
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

        // Animasyonlu spin
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

                // Final sonuçları belirle
                results.length = 0;
                reels.forEach(reelId => {
                    const reel = document.getElementById(reelId);
                    if (reel) {
                        const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                        reel.textContent = finalSymbol;
                        results.push(finalSymbol);
                    }
                });

                // Kazanç hesapla
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
                    document.getElementById('slot-result').innerHTML = `<span style="color: #00FF00;">🎉 JACKPOT!</span><br>${results.join(' ')}<br><span style="color: #FFD700;">+${winAmount} DumCoin (${multiplier}x)</span>`;
                } else {
                    document.getElementById('slot-result').innerHTML = `<span style="color: #FF6B6B;">😢 Şanssızlık!</span><br>${results.join(' ')}<br><span style="color: #FF6B6B;">-${betAmount} DumCoin</span>`;
                }

                updateCoinDisplay();
                slotSpinning = false;
                if (spinBtn) spinBtn.disabled = false;
            }
        }, 80);
    }

    // Oyun başlatıldığında paneli oluştur
    setTimeout(createCasinoPanel, 1000);

})();