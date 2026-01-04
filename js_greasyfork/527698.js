// ==UserScript==
// @name         Дурак онлайн Tracker
// @namespace    http://tampermonkey.net/
// @version      8.6
// @description  Полное исправление багов с картами и добавление обработки отмены действий
// @license MIT
// @author       lREDI
// @match        *https://durak.rstgames.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527698/%D0%94%D1%83%D1%80%D0%B0%D0%BA%20%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/527698/%D0%94%D1%83%D1%80%D0%B0%D0%BA%20%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DECK_CONFIG = {
        24: { start: 9, ranks: ['9','10','J','Q','K','A'], cols: 6 },
        36: { start: 6, ranks: ['6','7','8','9','10','J','Q','K','A'], cols: 9 },
        52: { start: 2, ranks: ['2','3','4','5','6','7','8','9','10','J','Q','K','A'], cols: 13 }
    };

    const SUIT_ORDER = ['♠', '♥', '♣', '♦'];
    const RANK_POWER = {
        '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7,
        '9': 8, '10': 9, 'J': 10, 'Q': 11, 'K': 12, 'A': 13
    };

    const CARD_SIZE = { width: 40, height: 60 };
    const PLAYER_PANEL_WIDTH = 300;

    let gameState = {
        myId: null,
        deckType: null,
        deckSize: 0,
        trump: null,
        discardPile: new Set(),
        players: new Map(),
        activeCards: new Set(),
        currentAttack: [],
        currentDefense: [],
        cardOwners: new Map(),
        currentPlayer: null,
        fullDeck: []
    };

    let isUIAttached = false;
    let firstUpdate = true;
    let uiObserver = null;

    const generatePlayerColor = (() => {
        const colors = new Map();
        return (id) => {
            if (!colors.has(id)) {
                const hue = Math.floor(Math.random() * 360);
                colors.set(id, `hsl(${hue}, 70%, 40%)`);
            }
            return colors.get(id);
        };
    })();

    function initUI() {
        if (isUIAttached) return;

        const container = document.createElement('div');
        container.id = 'durak-tracker-container';
        Object.assign(container.style, {
            position: 'fixed',
            right: '20px',
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            zIndex: '99999',
            pointerEvents: 'none'
        });

        const controlPanel = createControlPanel();
        container.appendChild(controlPanel);
        container.appendChild(createDeckPanel());
        container.appendChild(createPlayersPanel());

        document.body.appendChild(container);
        isUIAttached = true;

        uiObserver = new MutationObserver((mutations) => {
            if (!document.body.contains(container)) {
                document.body.appendChild(container);
            }
        });
        uiObserver.observe(document.body, { childList: true });
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <button id="reset-tracker-btn" style="
                padding: 8px 16px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s;
                pointer-events: auto;
            ">🔄 Сбросить состояние</button>
        `;
        Object.assign(panel.style, {
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'center'
        });

        panel.querySelector('#reset-tracker-btn').addEventListener('click', () => {
            resetGame();
            showNotification('Состояние скрипта сброшено!');
        });

        return panel;
    }

    function showNotification(text, duration = 3000) {
        const notification = document.createElement('div');
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: '100000',
            animation: 'slideIn 0.3s ease-out',
            pointerEvents: 'none'
        });
        notification.textContent = text;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    function createDeckPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <h3 style="margin:0 0 10px 0;font-size:16px;pointer-events:auto;">🗑 Карты</h3>
            <div class="deck-grid" style="
                display: flex;
                flex-direction: column;
                gap: 5px;
                max-height: 400px;
                overflow-y: auto;
                pointer-events:auto;
            "></div>
        `;
        Object.assign(panel.style, {
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        });
        return panel;
    }

    function createPlayersPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <h3 style="margin:0 0 10px 0;font-size:16px;pointer-events:auto;">🎮 Игроки</h3>
            <div id="players-content" style="
                max-height: 500px;
                overflow-y: auto;
                pointer-events:auto;
            "></div>
        `;
        Object.assign(panel.style, {
            width: `${PLAYER_PANEL_WIDTH}px`,
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
        });
        return panel;
    }

    function parseCard(cardStr) {
        const patterns = [
            /^([♦♣♥♠])(10|[2-9JQKA])$/,
            /^(10|[2-9JQKA])([♦♣♥♠])$/
        ];

        for (const pattern of patterns) {
            const match = cardStr.match(pattern);
            if (match) {
                const suit = match[1]?.match(/[♦♣♥♠]/)?.[0] || match[3];
                const value = match[2] || match[1];
                return {
                    value: value,
                    suit: suit,
                    id: `${value}${suit}`
                };
            }
        }

        console.error('[CARD] Неверный формат:', cardStr);
        return { value: '?', suit: '?', id: 'invalid' };
    }

    function generateFullDeck() {
        const sortedDeck = [];
        const config = DECK_CONFIG[gameState.deckType];

        SUIT_ORDER.forEach(suit => {
            config.ranks
                .sort((a, b) => RANK_POWER[a] - RANK_POWER[b])
                .forEach(rank => {
                    sortedDeck.push({
                        value: rank,
                        suit: suit,
                        id: `${rank}${suit}`,
                        isTrump: suit === gameState.trump
                    });
                });
        });

        return sortedDeck;
    }

    function updateDeckView() {
        const grid = document.querySelector('.deck-grid');
        if (!grid) return;

        if (!gameState.deckType || !DECK_CONFIG[gameState.deckType]) {
            grid.innerHTML = '<div style="color:red; padding:10px;">Ошибка загрузки колоды</div>';
            return;
        }

        const suitsGroup = {'♠': [], '♥': [], '♣': [], '♦': []};
        gameState.fullDeck.forEach(card => {
            suitsGroup[card.suit].push(card);
        });

        grid.innerHTML = '';
        SUIT_ORDER.forEach(suit => {
            const group = document.createElement('div');
            Object.assign(group.style, {
                display: 'flex',
                gap: '3px',
                marginBottom: '5px',
                flexWrap: 'wrap'
            });

            suitsGroup[suit].forEach(card => {
                const isActive = gameState.activeCards.has(card.id);
                const isDiscarded = gameState.discardPile.has(card.id);
                const ownerId = gameState.cardOwners.get(card.id);

                const cardEl = document.createElement('div');
                Object.assign(cardEl.style, {
                    width: `${CARD_SIZE.width}px`,
                    height: `${CARD_SIZE.height}px`,
                    border: `1px solid ${card.isTrump ? '#ff5722' : '#ddd'}`,
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    fontSize: '12px',
                    background: getCardBackground(card),
                    color: getCardColor(card),
                    pointerEvents: 'none'
                });

                if (isActive) {
                    cardEl.style.boxShadow = '0 0 0 2px #ffeb3b';
                    cardEl.style.animation = 'pulse 1.5s infinite';
                }

                cardEl.innerHTML = `
                    <div class="card-value">${card.value}</div>
                    <div class="card-suit">${card.suit}</div>
                    ${card.isTrump ? '<div style="position:absolute;top:2px;right:2px;color:#ff9800;font-size:10px;">★</div>' : ''}
                    ${isDiscarded ? '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#f44336;font-size:24px;opacity:0.8;">✖</div>' : ''}
                `;

                cardEl.dataset.cardId = card.id;
                group.appendChild(cardEl);
            });

            grid.appendChild(group);
        });
    }

    function getCardColor(card) {
        if (gameState.discardPile.has(card.id)) return '#fff';
        if (gameState.cardOwners.has(card.id)) return '#fff';
        return ['♦','♥'].includes(card.suit) ? '#c62828' : '#2d2d2d';
    }

    function getCardBackground(card) {
        if (gameState.discardPile.has(card.id)) return '#616161';
        if (gameState.cardOwners.has(card.id)) {
            return generatePlayerColor(gameState.cardOwners.get(card.id));
        }
        return 'white';
    }

    function handleGameMessage(type, data) {
        console.log('[WS IN] Processing:', type, data);
        try {
            switch(type) {
                case 'game':
                    initDeck(data);
                    gameState.currentPlayer = data.currentPlayer;
                    if(data.players?.[0]?.id && !gameState.myId) {
                        gameState.myId = data.players[0].id;
                    }
                    setTimeout(() => updateUI(), 500);
                    break;
                case 't':
                case 'f':
                case 's':
                    processAttack(data.c);
                    break;
                case 'b':
                    processDefense(data.c, data.b);
                    break;
                case 'rt': // Отмена атаки
                case 'rf': // Отмена атаки
                case 'rs': // Отмена атаки
                    revertAttack(data.c);
                    break;
                case 'rb': // Отмена защиты
                    revertDefense(data.c, data.b);
                    break;
                case 'end_turn':
                    processEndTurn(data || {});
                    break;
                case 'mode':
                    handlePlayerModes(data);
                    break;
                case 'game_reset':
                    resetGame();
                    break;
                case 'cp':
                    if(!gameState.myId && data.user) {
                        gameState.myId = data.id;
                    }
                    updatePlayer(data);
                    break;
                case 'hand':
                    if(gameState.myId !== null) {
                        Array.from(gameState.cardOwners.entries())
                            .filter(([card, owner]) => owner === gameState.myId)
                            .forEach(([card]) => gameState.cardOwners.delete(card));

                        data.cards.forEach(cardStr => {
                            const card = parseCard(cardStr);
                            if(card && card.id !== 'invalid') {
                                gameState.cardOwners.set(card.id, gameState.myId);
                            }
                        });
                    }
                    break;
                case 'p':
                    updatePlayer(data);
                    break;
            }
            updateUI();
        } catch (e) {
            console.error('[INCOMING ERROR]', e);
        }
    }

    function handleOutgoingMessage(type, data) {
        console.log('[WS OUT] Processing:', type, data);
        try {
            switch(type) {
                case 't':
                case 'f':
                case 's':
                    if(data.c) {
                        const cards = Array.isArray(data.c) ? data.c : [data.c];
                        cards.forEach(card => processAttack(card, true));
                    }
                    break;
                case 'b':
                    if(data.c && data.b) {
                        processDefense(data.c, data.b, true);
                    }
                    break;
                case 'take':
                    handleTakeCards(gameState.currentPlayer);
                    break;
            }
            updateUI();
        } catch(e) {
            console.error('[OUTGOING ERROR]', e);
        }
    }

    function initDeck(data) {
        const deckSize = data.deck;
        if ([24, 36, 52].includes(deckSize)) {
            gameState.deckType = deckSize;
        } else {
            console.error('[ERROR] Invalid deck size:', deckSize);
            gameState.deckType = 36;
        }

        gameState.fullDeck = generateFullDeck();
        gameState.trump = data.trump?.[0] || '?';
        gameState.deckSize = deckSize;
    }

    function processAttack(cardId, isOutgoing = false) {
        const card = parseCard(cardId);
        if (!card || card.id === 'invalid') return;

        if (!gameState.discardPile.has(card.id)) {
            gameState.currentAttack.push(card.id);
            gameState.activeCards.add(card.id);

            // Не удаляем карту из cardOwners, так как она может быть отменена
            if (isOutgoing && gameState.myId !== null) {
                // Помечаем карту как активную, но не удаляем из владельца
                gameState.cardOwners.set(card.id, gameState.myId);
            }
        }
    }

    function processDefense(attackCard, defenseCard, isOutgoing = false) {
        const attack = parseCard(attackCard);
        const defense = parseCard(defenseCard);

        if (!attack || !defense) return;

        const isValid = ![attack.id, defense.id].some(c =>
            gameState.discardPile.has(c) ||
            (gameState.cardOwners.has(c) && gameState.cardOwners.get(c) !== gameState.myId)
        );

        if (isValid) {
            gameState.currentDefense.push({
                attack: attack.id,
                defense: defense.id
            });
            [attack.id, defense.id].forEach(c => {
                gameState.activeCards.add(c);

                // Не удаляем карту из cardOwners, так как она может быть отменена
                if (isOutgoing && c === defense.id && gameState.myId !== null) {
                    // Помечаем карту как активную, но не удаляем из владельца
                    gameState.cardOwners.set(c, gameState.myId);
                }
            });
        }
    }

    function revertAttack(cardId) {
        const card = parseCard(cardId);
        if (!card || card.id === 'invalid') return;

        // Удаляем карту из активных
        gameState.activeCards.delete(card.id);

        // Возвращаем карту владельцу (если она была на руках)
        if (gameState.cardOwners.has(card.id)) {
            const ownerId = gameState.cardOwners.get(card.id);
            gameState.players.get(ownerId)?.cards.push(card.id);
        }

        // Удаляем карту из текущей атаки
        gameState.currentAttack = gameState.currentAttack.filter(id => id !== card.id);
    }

    function revertDefense(attackCard, defenseCard) {
        const attack = parseCard(attackCard);
        const defense = parseCard(defenseCard);

        if (!attack || !defense) return;

        // Удаляем карты из активных
        gameState.activeCards.delete(attack.id);
        gameState.activeCards.delete(defense.id);

        // Возвращаем карты владельцам (если они были на руках)
        if (gameState.cardOwners.has(attack.id)) {
            const ownerId = gameState.cardOwners.get(attack.id);
            gameState.players.get(ownerId)?.cards.push(attack.id);
        }
        if (gameState.cardOwners.has(defense.id)) {
            const ownerId = gameState.cardOwners.get(defense.id);
            gameState.players.get(ownerId)?.cards.push(defense.id);
        }

        // Удаляем карты из текущей защиты
        gameState.currentDefense = gameState.currentDefense.filter(
            pair => pair.attack !== attack.id && pair.defense !== defense.id
        );
    }

    function removeFromOwners(cardId) {
        gameState.cardOwners.delete(cardId);
    }

    function processEndTurn(data) {
        console.log('[END TURN] Data:', data);

        const allCards = [
            ...gameState.activeCards,
            ...gameState.currentAttack,
            ...gameState.currentDefense.flatMap(p => [p.attack, p.defense])
        ];

        const uniqueCards = [...new Set(allCards)];

        uniqueCards.forEach(c => {
            gameState.activeCards.delete(c);

            if(data.id !== undefined) {
                gameState.cardOwners.set(c, data.id);
                gameState.discardPile.delete(c);
            } else {
                gameState.discardPile.add(c);
                gameState.cardOwners.delete(c);
            }
        });

        gameState.currentAttack = [];
        gameState.currentDefense = [];

        if(data.id !== undefined) {
            gameState.activeCards.forEach(c => {
                if(gameState.cardOwners.get(c) === data.id) {
                    gameState.activeCards.delete(c);
                }
            });
        }

        updateUI();
    }

    function handlePlayerModes(data) {
        Object.entries(data).forEach(([playerId, mode]) => {
            const pid = Number(playerId);
            const player = gameState.players.get(pid);
            if (player) {
                player.mode = mode;
                if (mode === 7) handleTakeCards(pid);
            }
        });
    }

    function handleTakeCards(playerId) {
        const taken = Array.from(gameState.activeCards)
            .filter(c => !gameState.discardPile.has(c));

        taken.forEach(c => {
            gameState.cardOwners.set(c, playerId);
            gameState.activeCards.delete(c);
        });

        gameState.currentAttack = [];
        gameState.currentDefense = [];
    }

    function updatePlayer(data) {
        const player = {
            id: data.id,
            name: data.user?.name || 'Аноним',
            avatar: data.user?.avatar || 'https://via.placeholder.com/30',
            cards: data.user?.cards || [],
            mode: data.mode || 6,
            isActive: data.id === gameState.currentPlayer
        };
        gameState.players.set(data.id, player);
    }

    function updateUI() {
        if (firstUpdate) {
            setTimeout(() => {
                updateDeckView();
                updatePlayersUI();
                firstUpdate = false;
            }, 1000);
        } else {
            updateDeckView();
            updatePlayersUI();
        }
    }

    function updatePlayersUI() {
        const content = document.getElementById('players-content');
        if (!content) return;

        content.innerHTML = Array.from(gameState.players.values()).map(player => `
            <div class="player" style="
                margin:8px 0;
                padding:12px;
                background:${player.isActive ? '#f8f9fa' : '#fff'};
                border:2px solid ${player.isActive ? generatePlayerColor(player.id) : '#eee'};
                border-radius:8px;
            ">
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="${player.avatar}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">
                    <div style="flex-grow:1;">
                        <div style="font-weight:600;color:${generatePlayerColor(player.id)}">
                            ${player.name}
                        </div>
                        <div style="font-size:12px;color:#666;">
                            <span class="status ${getStatusClass(player.mode)}">
                                ${getStatusText(player.mode)}
                            </span>
                            • ${player.cards.length} 🃏
                        </div>
                    </div>
                </div>
                ${renderTakenCards(player.id)}
            </div>
        `).join('');
    }

    function renderTakenCards(playerId) {
        const taken = Array.from(gameState.cardOwners.entries())
            .filter(([cardId, owner]) =>
                owner === playerId &&
                !gameState.discardPile.has(cardId))
            .map(([card]) => card);

        return taken.length ? `
            <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #eee;font-size:12px;color:#666;">
                Взято: ${taken.slice(-3).join(', ')}${taken.length > 3 ? ` (+${taken.length - 3})` : ''}
            </div>
        ` : '';
    }

    function getStatusClass(mode) {
        const map = {0:'status-throw',1:'status-attack',7:'status-take',8:'status-defend',9:'status-defend'};
        return map[mode] || 'status-wait';
    }

    function getStatusText(mode) {
        const map = {0:'Подкидывает',1:'Атакует',7:'Взял',8:'Защита',9:'Отбивается'};
        return map[mode] || 'Ожидает';
    }

    function resetGame() {
        gameState = {
            myId: null,
            deckType: null,
            deckSize: 0,
            trump: null,
            discardPile: new Set(),
            players: new Map(),
            activeCards: new Set(),
            currentAttack: [],
            currentDefense: [],
            cardOwners: new Map(),
            currentPlayer: null,
            fullDeck: []
        };

        updateUI();
        showNotification('Состояние скрипта сброшено!');
    }

    const css = `
        @keyframes pulse {
            0% { box-shadow:0 0 0 0 rgba(255,235,59,0.4); }
            70% { box-shadow:0 0 0 6px rgba(255,235,59,0); }
            100% { box-shadow:0 0 0 0 rgba(255,235,59,0); }
        }

        @keyframes slideIn {
            from { transform: translate(-50%, -30px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translate(-50%, 0); opacity: 1; }
            to { transform: translate(-50%, -30px); opacity: 0; }
        }

        .status-throw { background:#d1ecf1; color:#0c5460; }
        .status-attack { background:#fff3cd; color:#856404; }
        .status-defend { background:#d4edda; color:#155724; }
        .status-take { background:#f8d7da; color:#721c24; }
        .status-wait { background:#e9ecef; color:#495057; }

        #reset-tracker-btn:hover {
            background: #c82333 !important;
        }

        .deck-grid::-webkit-scrollbar,
        #players-content::-webkit-scrollbar {
            width:6px;
        }
        .deck-grid::-webkit-scrollbar-track,
        #players-content::-webkit-scrollbar-track {
            background:#f1f1f1;
        }
        .deck-grid::-webkit-scrollbar-thumb,
        #players-content::-webkit-scrollbar-thumb {
            background:#888;
            border-radius:3px;
        }
    `;

    function init() {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        initUI();

        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function(url) {
            const ws = new OriginalWebSocket(url);

            const originalSend = ws.send.bind(ws);
            ws.send = function(data) {
                try {
                    const strData = String(data);
                    const typeEnd = strData.indexOf('{');
                    const type = typeEnd > 0 ? strData.slice(0, typeEnd) : strData;
                    const jsonData = typeEnd > 0 ? JSON.parse(strData.slice(typeEnd)) : {};
                    handleOutgoingMessage(type, jsonData);
                } catch(e) {
                    console.error('[WS SEND ERROR]', e);
                }
                originalSend(data);
            };

            ws.addEventListener('message', event => {
                try {
                    const raw = event.data.toString();
                    const typeEnd = raw.indexOf('{');
                    const type = typeEnd > 0 ? raw.slice(0, typeEnd) : raw;
                    const data = typeEnd > 0 ? JSON.parse(raw.slice(typeEnd)) : {};
                    handleGameMessage(type, data);
                } catch(e) {
                    console.error('[WS RECV ERROR]', e);
                }
            });

            return ws;
        };
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();