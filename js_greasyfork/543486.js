// ==UserScript==
// @name         EA FC 25 Ultimate Pack Manager
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Öffnet Packs automatisch und sortiert Karten nach Wertung
// @author       Your Name
// @match        https://www.ea.com/*fc*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/543486/EA%20FC%2025%20Ultimate%20Pack%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/543486/EA%20FC%2025%20Ultimate%20Pack%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isOpening = false;
    let openInterval;
    let cardProcessing = false;
    let totalCardsProcessed = 0;

    // Styling für zusätzliche UI-Elemente
    GM_addStyle(`
        .fc-control-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background: rgba(40, 40, 40, 0.93);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 2px solid #00aeff;
            width: 300px;
            color: white;
            font-family: Arial, sans-serif;
        }
        .fc-control-btn {
            display: block;
            width: 100%;
            padding: 15px;
            margin: 10px 0;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            color: white;
        }
        #fc-start-btn {
            background: linear-gradient(to right, #00c853, #009624);
        }
        #fc-start-btn:hover {
            background: linear-gradient(to right, #00e676, #00c853);
            transform: translateY(-2px);
        }
        #fc-start-btn.stopping {
            background: linear-gradient(to right, #ff5252, #b71c1c);
        }
        .fc-stats {
            text-align: center;
            margin: 15px 0;
            font-size: 16px;
            color: #00aeff;
        }
        .fc-status {
            margin-top: 15px;
            padding: 10px;
            background: rgba(0, 50, 80, 0.4);
            border-radius: 8px;
            font-size: 14px;
            min-height: 40px;
        }
    `);

    // Control Panel erstellen
    const controlPanel = document.createElement('div');
    controlPanel.className = 'fc-control-panel';
    controlPanel.innerHTML = `
        <h3 style="text-align:center; margin-top:0; color:#00aeff">FC 25 Pack Manager</h3>
        <button id="fc-start-btn" class="fc-control-btn">START AUTO-OPEN</button>
        <div class="fc-stats">
            Verarbeitete Karten: <span id="fc-card-count">0</span>
        </div>
        <div class="fc-status" id="fc-status">Bereit zum Starten...</div>
    `;
    document.body.appendChild(controlPanel);

    const startButton = document.getElementById('fc-start-btn');
    const cardCount = document.getElementById('fc-card-count');
    const statusDisplay = document.getElementById('fc-status');

    function updateStatus(message) {
        statusDisplay.textContent = message;
    }

    function findPackElements() {
        // Aktualisierte Selektoren für EA FC 25
        return {
            packButton: document.querySelector('.ut-store-pack-item .ut-store-pack-details-view .ut-button-group button'),
            cardElements: document.querySelectorAll('.ut-item-view .item-info'),
            quickSellBtn: document.querySelector('[data-tid="quick-sell-btn"]'),
            sendToClubBtn: document.querySelector('[data-tid="send-to-club-btn"]'),
            sendToSbcBtn: document.querySelector('[data-tid="squad-building-challenge-btn"]'),
            confirmBtn: document.querySelector('.ut-dialog-content .ut-confirmation-dialog-view .call-to-action'),
            closeBtn: document.querySelector('.ut-dialog-content .ut-dialog-close')
        };
    }

    function getCardRating(cardElement) {
        try {
            const ratingText = cardElement.querySelector('.item-rating').textContent;
            return parseInt(ratingText);
        } catch (e) {
            return 0;
        }
    }

    async function processCard(cardElement) {
        cardProcessing = true;
        cardElement.click();
        await wait(1500);

        const elements = findPackElements();
        const cardRating = getCardRating(cardElement);

        if (cardRating >= 85) {
            // Versuche zuerst in den Verein zu senden
            if (elements.sendToClubBtn) {
                elements.sendToClubBtn.click();
                updateStatus(`Karte (${cardRating}) zum Verein hinzugefügt`);
            } 
            // Falls nicht verfügbar, versende zu SBC
            else if (elements.sendToSbcBtn) {
                elements.sendToSbcBtn.click();
                updateStatus(`Karte (${cardRating}) zu SBC hinzugefügt`);
            }
        } else {
            if (elements.quickSellBtn) {
                elements.quickSellBtn.click();
                await wait(1000);
                
                if (elements.confirmBtn) {
                    elements.confirmBtn.click();
                    updateStatus(`Karte (${cardRating}) schnellverkauft`);
                }
            }
        }

        totalCardsProcessed++;
        cardCount.textContent = totalCardsProcessed;
        await wait(2000);
        cardProcessing = false;
    }

    async function processPack() {
        updateStatus("Verarbeite Pack...");
        await wait(4000);

        const elements = findPackElements();
        if (!elements.cardElements || elements.cardElements.length === 0) {
            updateStatus("Keine Karten gefunden");
            return false;
        }

        // Verarbeite jede Karte nacheinander
        for (const card of elements.cardElements) {
            if (!isOpening) break;
            await processCard(card);
            await wait(1000);
        }

        return true;
    }

    function openNextPack() {
        const elements = findPackElements();
        
        if (elements.packButton && !cardProcessing) {
            elements.packButton.click();
            updateStatus("Öffne Pack...");
            return true;
        }
        
        return false;
    }

    function closePack() {
        const elements = findPackElements();
        if (elements.closeBtn) {
            elements.closeBtn.click();
            updateStatus("Pack geschlossen");
            return true;
        }
        return false;
    }

    async function packOpeningCycle() {
        if (!isOpening) return;

        if (openNextPack()) {
            await wait(3000);
            await processPack();
            await wait(2000);
            closePack();
            await wait(3000);
        } else {
            updateStatus("Warte auf verfügbare Packs...");
        }

        if (isOpening) {
            setTimeout(packOpeningCycle, 3000);
        }
    }

    function startOpening() {
        if (isOpening) return;
        isOpening = true;
        startButton.textContent = 'STOPP';
        startButton.classList.add('stopping');
        updateStatus("Starte automatisches Öffnen...");
        totalCardsProcessed = 0;
        cardCount.textContent = '0';
        packOpeningCycle();
    }

    function stopOpening() {
        isOpening = false;
        startButton.textContent = 'START AUTO-OPEN';
        startButton.classList.remove('stopping');
        updateStatus("Prozess gestoppt");
    }

    startButton.addEventListener('click', function() {
        if (isOpening) {
            stopOpening();
        } else {
            startOpening();
        }
    });

    // Hilfsfunktion für Wartezeiten
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();