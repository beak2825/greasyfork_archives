// ==UserScript==
// @name         21點算牌輔助工具 (Tampermonkey 版)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在網頁上顯示21點算牌資訊和建議 (需手動輸入牌面或自行擴展網頁讀取邏輯)
// @author       Your Name
// @match        *://*/* // 匹配所有網頁，您應將此改為特定21點遊戲網站的URL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542949/21%E9%BB%9E%E7%AE%97%E7%89%8C%E8%BC%94%E5%8A%A9%E5%B7%A5%E5%85%B7%20%28Tampermonkey%20%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542949/21%E9%BB%9E%E7%AE%97%E7%89%8C%E8%BC%94%E5%8A%A9%E5%B7%A5%E5%85%B7%20%28Tampermonkey%20%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 算牌核心邏輯 (從Python轉換) ---
    // 牌面點數對應算牌值 (Hi-Lo System)
    const cardValues = {
        '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
        '7': 0, '8': 0, '9': 0, '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
    };

    // 21點基本策略表 (從Python轉換，這裡僅為部分範例，需完整轉換)
    // 莊家明牌點數對應：2, 3, 4, 5, 6, 7, 8, 9, 10, A(11)
    const hardStrategy = {
        17: 'S',
        16: {2:'H', 3:'H', 4:'S', 5:'S', 6:'S', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        15: {2:'H', 3:'H', 4:'S', 5:'S', 6:'S', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        14: {2:'H', 3:'H', 4:'S', 5:'S', 6:'S', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        13: {2:'H', 3:'H', 4:'S', 5:'S', 6:'S', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        12: {2:'H', 3:'H', 4:'S', 5:'S', 6:'S', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        11: 'D',
        10: 'D',
        9: {2:'H', 3:'D', 4:'D', 5:'D', 6:'D', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        8: 'H', 7: 'H', 6: 'H', 5: 'H', 4: 'H'
    };
    // 軟牌策略 (Soft Totals)
    const softStrategy = {
        19: 'S',
        18: {2:'S', 3:'D', 4:'D', 5:'D', 6:'D', 7:'S', 8:'S', 9:'H', 10:'H', 11:'H'},
        17: {2:'H', 3:'D', 4:'D', 5:'D', 6:'D', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        16: {2:'H', 3:'H', 4:'D', 5:'D', 6:'D', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        15: {2:'H', 3:'H', 4:'D', 5:'D', 6:'D', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        14: {2:'H', 3:'H', 4:'D', 5:'D', 6:'D', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        13: {2:'H', 3:'H', 4:'D', 5:'D', 6:'D', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'}
    };
    // 對子策略 (Pairs)
    const pairStrategy = {
        'A': 'P', 'K': 'S', 'Q': 'S', 'J': 'S', '10': 'S',
        '9': {2:'P', 3:'P', 4:'P', 5:'P', 6:'P', 7:'S', 8:'P', 9:'P', 10:'S', 11:'S'},
        '8': 'P',
        '7': {2:'P', 3:'P', 4:'P', 5:'P', 6:'P', 7:'P', 8:'H', 9:'H', 10:'H', 11:'H'},
        '6': {2:'P', 3:'P', 4:'P', 5:'P', 6:'P', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        '5': 'D', // 對 5 總是雙倍
        '4': {2:'H', 3:'H', 4:'H', 5:'P', 6:'P', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        '3': {2:'P', 3:'P', 4:'P', 5:'P', 6:'P', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'},
        '2': {2:'P', 3:'P', 4:'P', 5:'P', 6:'P', 7:'H', 8:'H', 9:'H', 10:'H', 11:'H'}
    };

    // 指數策略偏離點 (僅為範例，實際更複雜)
    const deviationRules = {
        // [玩家點數/牌型, 莊家明牌點數]: {True Count Threshold: 'Action'}
        '16-10': {0: 'S'}, // 硬16 vs 莊家10, 真數 >= 0 時停牌
        '12-2': {3: 'S'},  // 硬12 vs 莊家2, 真數 >= 3 時停牌
        '12-3': {2: 'S'},  // 硬12 vs 莊家3, 真數 >= 2 時停牌
        '10-10': {4: 'H'}, // 硬10 vs 莊家10, 真數 >= 4 時補牌 (而非雙倍)
        '11-11': {1: 'H'}, // 硬11 vs 莊家A, 真數 >= 1 時補牌 (而非雙倍)
        'P9-7': {3: 'P'},  // 對9 vs 莊家7, 真數 >= 3 時分牌 (而非停牌)
        'P10-5': {4: 'S'}, // 對10 vs 莊家5, 真數 >= 4 時停牌 (而非雙倍)
    };


    let deckCount = 0;
    let runningCount = 0;
    let trueCount = 0.0;
    let remainingCards = 0;
    let redCardThreshold = 0;
    let allDealtCards = []; // 記錄所有已發出的牌
    let playerHand = [];
    let dealerUpCard = null;

    // 計算手牌點數
    function calculateHandValue(hand, softAceValue = 11) {
        let value = 0;
        let numAces = 0;
        for (const card of hand) {
            if (card === 'J' || card === 'Q' || card === 'K') {
                value += 10;
            } else if (card === 'A') {
                numAces += 1;
                value += softAceValue;
            } else {
                value += parseInt(card);
            }
        }

        while (value > 21 && numAces > 0) {
            value -= 10; // 將 A 從 11 變成 1
            numAces -= 1;
        }
        return value;
    }

    // 判斷是否為軟牌
    function isSoftHand(hand) {
        if (hand.includes('A')) {
            const valueWithOneAceAs11 = calculateHandValue(hand, 11);
            const valueWithAllAcesAs1 = calculateHandValue(hand, 1);
            return valueWithOneAceAs11 <= 21 && valueWithOneAceAs11 !== valueWithAllAcesAs1;
        }
        return false;
    }

    // 獲取基本策略建議
    function getBasicStrategySuggestion(playerHand, dealerUpCard) {
        const playerPoints = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue([dealerUpCard]);

        if (playerPoints > 21) {
            return "爆牌！";
        }

        // 對子
        if (playerHand.length === 2 && playerHand[0] === playerHand[1]) {
            const cardFace = playerHand[0];
            if (pairStrategy[cardFace]) {
                const action = pairStrategy[cardFace];
                if (typeof action === 'object') {
                    return action[dealerValue] || 'H';
                }
                return action;
            }
        }

        // 軟牌
        if (isSoftHand(playerHand)) {
            if (softStrategy[playerPoints]) {
                const action = softStrategy[playerPoints];
                if (typeof action === 'object') {
                    return action[dealerValue] || 'H';
                }
                return action;
            }
        }

        // 硬牌
        if (hardStrategy[playerPoints]) {
            const action = hardStrategy[playerPoints];
            if (typeof action === 'object') {
                return action[dealerValue] || 'H';
            }
            return action;
        }

        return "S (停牌)"; // 預設停牌
    }

    // 獲取真數偏離建議
    function getTrueCountDeviationSuggestion(playerHand, dealerUpCard, trueCount) {
        const playerPoints = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue([dealerUpCard]);

        let playerKey = playerPoints;
        if (playerHand.length === 2 && playerHand[0] === playerHand[1]) {
            playerKey = 'P' + playerHand[0];
        }

        const deviationKey = `${playerKey}-${dealerValue}`;
        if (deviationRules[deviationKey]) {
            const deviations = deviationRules[deviationKey];
            const sortedThresholds = Object.keys(deviations).map(Number).sort((a, b) => a - b);

            for (const threshold of sortedThresholds) {
                if (trueCount >= threshold) {
                    const action = deviations[threshold];
                    const basicSugg = getBasicStrategySuggestion(playerHand, dealerUpCard);
                    if (action !== basicSugg) {
                        return `當前真數 [+${trueCount.toFixed(1)}]，建議偏離基本策略，請 ${action}。`;
                    }
                }
            }
        }
        return "";
    }

    // 更新算牌數據
    function updateCardCounts(cardFace) {
        if (cardValues[cardFace] !== undefined) {
            runningCount += cardValues[cardFace];
            remainingCards -= 1;
            if (remainingCards > 0) {
                trueCount = runningCount / (remainingCards / 52.0);
            } else {
                trueCount = 0.0;
            }
        }
    }

    // --- GUI 元素創建與網頁互動 ---
    function createBlackjackOverlay() {
        // 創建一個浮動的面板
        const overlay = document.createElement('div');
        overlay.id = 'blackjack-counter-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '10px';
        overlay.style.right = '10px';
        overlay.style.width = '250px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.border = '1px solid #333';
        overlay.style.borderRadius = '8px';
        overlay.style.padding = '15px';
        overlay.style.zIndex = '99999';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        overlay.style.cursor = 'grab'; // 讓使用者可以拖動

        // 拖動功能
        let isDragging = false;
        let offsetX, offsetY;
        overlay.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - overlay.getBoundingClientRect().left;
            offsetY = e.clientY - overlay.getBoundingClientRect().top;
            overlay.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            overlay.style.left = `${e.clientX - offsetX}px`;
            overlay.style.top = `${e.clientY - offsetY}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            overlay.style.cursor = 'grab';
        });


        overlay.innerHTML = `
            <h3 style="margin-top:0; color:#4CAF50;">21點算牌助手</h3>
            <div style="margin-bottom: 10px;">
                <strong>流水數 (RC):</strong> <span id="rc-display">0</span><br>
                <strong>真數 (TC):</strong> <span id="tc-display">0.0</span><br>
                <strong>剩餘牌數:</strong> <span id="remaining-cards-display">0</span><br>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>打牌建議:</strong> <span id="play-suggestion" style="color: lightblue;"></span><br>
                <strong>下注建議:</strong> <span id="bet-suggestion" style="color: lightgreen;"></span>
            </div>
            <div style="margin-bottom: 10px;">
                <label for="card-input">輸入牌面 (A, K, 10, 5):</label>
                <input type="text" id="card-input" style="width: 80px; padding: 5px; border-radius: 4px; border: 1px solid #555; background-color: #333; color: white;">
                <button id="add-card-btn" style="padding: 5px 10px; margin-left: 5px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">新增</button>
            </div>
            <div style="text-align: center;">
                <button id="reset-shoe-btn" style="padding: 8px 15px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">新牌靴</button>
                <button id="history-btn" style="padding: 8px 15px; background-color: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer;">歷史</button>
            </div>
            <div id="status-message" style="margin-top: 10px; font-size: 0.9em; color: #aaa;"></div>
        `;
        document.body.appendChild(overlay);

        // 獲取DOM元素
        const rcDisplay = document.getElementById('rc-display');
        const tcDisplay = document.getElementById('tc-display');
        const remainingCardsDisplay = document.getElementById('remaining-cards-display');
        const playSuggestion = document.getElementById('play-suggestion');
        const betSuggestion = document.getElementById('bet-suggestion');
        const cardInput = document.getElementById('card-input');
        const addCardBtn = document.getElementById('add-card-btn');
        const resetShoeBtn = document.getElementById('reset-shoe-btn');
        const historyBtn = document.getElementById('history-btn');
        const statusMessage = document.getElementById('status-message');

        // 更新顯示函數
        function updateDisplay() {
            rcDisplay.textContent = runningCount;
            tcDisplay.textContent = trueCount.toFixed(1);
            remainingCardsDisplay.textContent = remainingCards;
            // 建議在實際遊戲中，這些建議會根據當前牌局自動更新
            // 這裡只是預留位置，需要您手動觸發或從網頁讀取
            playSuggestion.textContent = '等待輸入...';
            betSuggestion.textContent = '等待輸入...';
        }

        // 處理牌面輸入
        addCardBtn.addEventListener('click', () => {
            const cardFace = cardInput.value.toUpperCase().trim();
            cardInput.value = ''; // 清空輸入框

            if (!cardValues.hasOwnProperty(cardFace)) {
                statusMessage.textContent = '無效的牌面！請輸入 2-10, J, Q, K, A。';
                return;
            }

            updateCardCounts(cardFace);
            allDealtCards.push(cardFace);
            statusMessage.textContent = `已輸入牌面: ${cardFace}`;
            updateDisplay();

            // 在這裡，您需要從網頁讀取您的手牌和莊家明牌，然後調用建議函數
            // 範例：假設您已經有 playerHand 和 dealerUpCard
            // const currentPlaySuggestion = getBasicStrategySuggestion(playerHand, dealerUpCard);
            // const currentDeviationSuggestion = getTrueCountDeviationSuggestion(playerHand, dealerUpCard, trueCount);
            // playSuggestion.textContent = currentPlaySuggestion + (currentDeviationSuggestion ? ` (${currentDeviationSuggestion})` : '');
            // betSuggestion.textContent = getBettingSuggestion(); // 您需要實現這個函數
        });

        cardInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCardBtn.click();
            }
        });

        // 重置牌靴
        resetShoeBtn.addEventListener('click', () => {
            const numDecks = prompt("請輸入牌副數 (例如 6 或 8):", "6");
            const redCardRatio = prompt("請輸入紅卡切牌比例 (例如 0.75):", "0.75");

            if (numDecks === null || redCardRatio === null) return; // 使用者取消

            try {
                const parsedNumDecks = parseInt(numDecks);
                const parsedRedCardRatio = parseFloat(redCardRatio);

                if (isNaN(parsedNumDecks) || !(parsedNumDecks >= 2 && parsedNumDecks <= 8)) {
                    throw new Error("牌副數應為 2 到 8 的整數。");
                }
                if (isNaN(parsedRedCardRatio) || !(parsedRedCardRatio >= 0.5 && parsedRedCardRatio <= 0.9)) {
                    throw new Error("紅卡比例應為 0.5 到 0.9 的數字。");
                }

                deckCount = parsedNumDecks;
                runningCount = 0;
                trueCount = 0.0;
                remainingCards = deckCount * 52;
                redCardThreshold = Math.floor(remainingCards * (1 - parsedRedCardRatio));
                allDealtCards = [];
                playerHand = [];
                dealerUpCard = null;
                statusMessage.textContent = `新牌靴已準備。紅卡約在牌盒剩下 ${redCardThreshold} 張牌時觸及。`;
                updateDisplay();
            } catch (error) {
                alert(`設定錯誤: ${error.message}`);
                statusMessage.textContent = `設定失敗: ${error.message}`;
            }
        });

        // 歷史查詢
        historyBtn.addEventListener('click', () => {
            alert("已發出的牌: " + allDealtCards.join(', '));
        });

        // 初始化顯示
        updateDisplay();
        statusMessage.textContent = "請設定新牌靴。";
    }

    // 延遲執行以確保網頁內容已載入
    window.addEventListener('load', createBlackjackOverlay);

    // --- 如何讀取網頁上的牌面資訊 (概念性範例) ---
    // 這部分需要您根據實際遊戲網站的HTML結構來編寫。
    // 範例：假設您的手牌顯示在一個ID為 'my-hand' 的 div 中，每張牌是一個 class 為 'card-face' 的 span。
    function readPlayerHandFromWebpage() {
        const playerHandElements = document.querySelectorAll('#my-hand .card-face');
        const hand = [];
        playerHandElements.forEach(el => {
            hand.push(el.textContent.trim()); // 假設牌面文字直接在span中
        });
        return hand;
    }

    // 範例：假設莊家明牌顯示在一個ID為 'dealer-up-card' 的 span 中。
    function readDealerUpCardFromWebpage() {
        const dealerCardElement = document.getElementById('dealer-up-card');
        if (dealerCardElement) {
            return dealerCardElement.textContent.trim();
        }
        return null;
    }

    // 您可以設置一個定時器，定期檢查網頁上的牌面變化，並自動更新算牌數據和建議。
    // setInterval(() => {
    //     playerHand = readPlayerHandFromWebpage();
    //     dealerUpCard = readDealerUpCardFromWebpage();
    //     // 這裡需要更複雜的邏輯來判斷哪些牌是新出的，哪些是舊的，以正確更新 runningCount
    //     // 簡單示範：每次都重新計算，但這不適合實戰
    //     // updateCardCounts(...);
    //     // playSuggestion.textContent = getBasicStrategySuggestion(playerHand, dealerUpCard);
    // }, 1000); // 每秒檢查一次
})();
