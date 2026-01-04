// ==UserScript==
// @name         Ironwood RPG - Combat Loot Logger
// @namespace    http://tampermonkey.net/
// @version      2.8.2
// @description  Adds a copy-to-clipboard button for the session stats.
// @author       Rivea (UI by Gemini)
// @match        https://ironwoodrpg.com/skill/14/*
// @match        https://ironwoodrpg.com/skill/8/*
// @match        https://ironwoodrpg.com/skill/6/*
// @match        https://ironwoodrpg.com/skill/7/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542634/Ironwood%20RPG%20-%20Combat%20Loot%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/542634/Ironwood%20RPG%20-%20Combat%20Loot%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** SCRIPT STATE & CACHE ***/
    let killCount = 0;

    // --- Time Tracking ---
    let totalActiveTimeMs = 0;
    let currentSessionStartTime = 0;
    let isPaused = true; // Start in paused state

    // --- Loot Tracking (Persistent) ---
    let totalLootGained = {};
    let initialLootState = {};
    let lootInitialized = false;

    // --- Consumable Tracking (Persistent) ---
    let consumedConsumables = {};
    let initialConsumablesData = {};
    let consumablesInitialized = false;

    // --- State Tracking ---
    let monsterIsPresent = false; // Tracks if a monster name is VISIBLE
    let lastKnownMonsterName = "Unknown";

    // --- UI Element Cache ---
    let cachedElements = {
        loggerLootElement: null,
        statTarget: null,
        statKills: null,
        statTime: null,
        statKPH: null
    };
    let cachedCards = [];


    function createLoggerUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'lootLoggerContainer';

        uiContainer.innerHTML = `
            <div id="lootLoggerHeader">
                <span id="lootLoggerTitle">Loot Logger</span>
                <div id="lootLoggerControls">
                    <span id="lootLoggerCopy" title="Copy Stats">📋</span>
                    <span id="lootLoggerToggle" title="Minimize">_</span>
                </div>
            </div>
            <div id="lootLoggerStats">
                <div>Target: <span id="stat-target">None</span></div>
                <div>Kills: <span id="stat-kills">0</span></div>
                <div>Time: <span id="stat-time">0m 0s</span></div>
                <div>KPH: <span id="stat-kph">0.00</span></div>
            </div>
            <div id="lootLoggerLoot">
                Waiting for combat to start...
            </div>
        `;
        document.body.appendChild(uiContainer);

        const styles = `
            #lootLoggerContainer {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                max-height: 400px;
                background: #2b2b2b;
                border: 1px solid #444;
                border-radius: 5px;
                color: #ddd;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 9999;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
            }
            #lootLoggerHeader {
                padding: 5px 8px;
                background: #3c3c3c;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #444;
                border-radius: 5px 5px 0 0;
            }
            #lootLoggerTitle { font-weight: bold; user-select: none; }

            #lootLoggerControls {
                display: flex;
                gap: 4px;
            }
            #lootLoggerToggle, #lootLoggerCopy {
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                padding: 0 5px;
                border: 1px solid #666;
                border-radius: 3px;
                user-select: none;
                line-height: 1.4;
            }
            #lootLoggerCopy {
                font-size: 12px;
                padding: 1px 5px;
            }
            #lootLoggerToggle:hover, #lootLoggerCopy:hover { background: #555; }

            #lootLoggerStats {
                padding: 8px 10px;
                background: #333;
                border-bottom: 1px solid #444;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px 10px;
                font-size: 13px;
                line-height: 1.4;
            }
            #lootLoggerStats span {
                font-weight: bold;
                color: #fff;
            }
            #lootLoggerLoot {
                padding: 10px;
                white-space: pre-wrap;
                overflow-y: auto;
                flex-grow: 1;
                min-height: 50px;
            }
            #lootLoggerContainer.minimized #lootLoggerStats,
            #lootLoggerContainer.minimized #lootLoggerLoot {
                display: none;
            }
            #lootLoggerContainer.minimized {
                max-height: none;
                width: auto;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);


        cachedElements.loggerLootElement = document.getElementById('lootLoggerLoot');
        cachedElements.statTarget = document.getElementById('stat-target');
        cachedElements.statKills = document.getElementById('stat-kills');
        cachedElements.statTime = document.getElementById('stat-time');
        cachedElements.statKPH = document.getElementById('stat-kph');

        const toggleButton = document.getElementById('lootLoggerToggle');
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            uiContainer.classList.toggle('minimized');
            toggleButton.textContent = uiContainer.classList.contains('minimized') ? '[]' : '_';
        });


        const copyButton = document.getElementById('lootLoggerCopy');
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger drag
            copyStatsToClipboard();
        });

        const header = document.getElementById('lootLoggerHeader');
        let isDragging = false;
        let offset = { x: 0, y: 0 };
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - uiContainer.getBoundingClientRect().left;
            offset.y = e.clientY - uiContainer.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            uiContainer.style.left = `${e.clientX - offset.x}px`;
            uiContainer.style.top = `${e.clientY - offset.y}px`;
            uiContainer.style.bottom = 'auto';
            uiContainer.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
            document.body.style.userSelect = 'auto';
        });
    }

    function copyStatsToClipboard() {
        const target = cachedElements.statTarget.textContent;
        const kills = cachedElements.statKills.textContent;
        const time = cachedElements.statTime.textContent;
        const kph = cachedElements.statKPH.textContent;
        const lootReport = cachedElements.loggerLootElement.textContent;

        const copyText = `
--- Ironwood RPG Loot Log ---
Target: ${target}
Kills: ${kills}
Time Elapsed: ${time}
Kills/Hour: ${kph}

${lootReport}
        `.trim().replace(/^\s+/gm, ''); // Remove leading whitespace

        navigator.clipboard.writeText(copyText).then(() => {
            const copyButton = document.getElementById('lootLoggerCopy');
            if (copyButton) {
                copyButton.textContent = '✅';
                setTimeout(() => {
                    copyButton.textContent = '📋';
                }, 1500);
            }
        }).catch(err => {
            // Error
            console.error('Loot Logger: Failed to copy to clipboard', err);
            const copyButton = document.getElementById('lootLoggerCopy');
            if (copyButton) {
                copyButton.textContent = '❌';
                setTimeout(() => {
                    copyButton.textContent = '📋';
                }, 1500);
            }
        });
    }

    function updateCardsCache() {
        cachedCards = [...document.querySelectorAll('.card')];
    }

    function getCurrentLootFromUI() {
        updateCardsCache();
        const lootCard = cachedCards.find(card =>
            card.querySelector('.header .name')?.textContent.trim() === 'Loot'
        );
        if (!lootCard) return [];
        return [...lootCard.querySelectorAll('.row')].map(row => ({
            name: row.querySelector('.name')?.textContent.trim() || "Unknown",
            amount: parseInt(row.querySelector('.amount')?.textContent.trim().replace(/,/g, ''), 10) || 0
        }));
    }

    function initializeLoot() {
        const currentLoot = getCurrentLootFromUI();
        initialLootState = {};
        currentLoot.forEach(item => {
            initialLootState[item.name] = item.amount;
        });
        lootInitialized = true;
        console.log("Loot baseline re-initialized:", initialLootState);
    }

    function updateTotalLootGained() {
        if (!lootInitialized) return;

        const currentLootOnScreen = getCurrentLootFromUI();
        const currentLootMap = Object.fromEntries(
            currentLootOnScreen.map(item => [item.name, item.amount])
        );

        const allItemNames = new Set([
            ...Object.keys(initialLootState),
            ...Object.keys(currentLootMap)
        ]);

        for (const name of allItemNames) {
            const currentAmount = currentLootMap[name] || 0;
            if (!(name in initialLootState)) {
                initialLootState[name] = 0;
            }
            const initialAmount = initialLootState[name];
            if (currentAmount > initialAmount) {
                const diff = currentAmount - initialAmount;
                totalLootGained[name] = (totalLootGained[name] || 0) + diff;
                initialLootState[name] = currentAmount;
            } else if (currentAmount < initialAmount) {
                initialLootState[name] = currentAmount;
            }
        }
    }


    function getConsumables() {
        updateCardsCache();
        const consumablesCard = cachedCards.find(card => card.querySelector('.header .name')?.textContent.trim() === 'Consumables');
        if (!consumablesCard) return [];
        return [...consumablesCard.querySelectorAll('.row')].map(row => ({
            name: row.querySelector('.name')?.textContent.trim() || "Unknown",
            amount: parseInt(row.querySelector('.amount')?.textContent.trim().replace(/,/g, ''), 10) || 0
        }));
    }

    function initializeConsumables() {
        const currentConsumables = getConsumables();
        initialConsumablesData = {};
        currentConsumables.forEach(item => {
            initialConsumablesData[item.name] = item.amount;
            if (!(item.name in consumedConsumables)) {
                consumedConsumables[item.name] = 0;
            }
        });
        consumablesInitialized = true;
        console.log("Consumables baseline re-initialized:", initialConsumablesData);
    }

    function updateConsumables() {
        if (!consumablesInitialized) return;
        const currentConsumables = getConsumables();
        if (currentConsumables.length === 0) return;

        currentConsumables.forEach(item => {
            const name = item.name;
            const currentAmount = item.amount;

            if (!(name in initialConsumablesData)) {
                initialConsumablesData[name] = currentAmount;
                consumedConsumables[name] = 0;
                return;
            }

            const initialAmount = initialConsumablesData[name];
            if (currentAmount < initialAmount) {
                consumedConsumables[name] += (initialAmount - currentAmount);
            }
            initialConsumablesData[name] = currentAmount;
        });
    }

    function getConsumedConsumables() {
        return Object.entries(consumedConsumables)
            .filter(([_, amount]) => amount > 0)
            .map(([name, amount]) => ({ name, amount }));
    }



    function getActiveTime() {
        let currentTotalMs = totalActiveTimeMs;
        if (!isPaused) {
            currentTotalMs += (Date.now() - currentSessionStartTime);
        }
        const diffSecs = Math.floor(currentTotalMs / 1000);
        return {
            minutes: Math.floor(diffSecs / 60),
            seconds: diffSecs % 60,
            hours: currentTotalMs / (1000 * 60 * 60),
            totalMs: currentTotalMs
        };
    }

    function updateLiveStats() {
        const time = getActiveTime();
        const timeString = `${time.minutes}m ${time.seconds}s`;
        const killsPerHour = time.hours > 0 ? (killCount / time.hours).toFixed(2) : (0).toFixed(2);

        if (cachedElements.statTime) cachedElements.statTime.textContent = timeString;
        if (cachedElements.statKPH) cachedElements.statKPH.textContent = killsPerHour;
    }

    function updateLootReport() {
        if (!lootInitialized || !consumablesInitialized) {
            console.log("Loot Logger: Kill detected, but initialization not complete. Skipping log.");
            return;
        }

        updateTotalLootGained();
        updateConsumables();

        if (cachedElements.statKills) cachedElements.statKills.textContent = killCount;
        if (cachedElements.statTarget) cachedElements.statTarget.textContent = "Waiting..."; // Set on respawn

        const lootLines = Object.entries(totalLootGained).map(([name, total]) => {
            const time = getActiveTime();
            const perHour = time.hours > 0 ? (total / time.hours).toFixed(2) : 0;
            return `  ${name}: ${total.toLocaleString()} | Per Hour: ${perHour}`;
        }).join("\n");

        const usedConsumables = getConsumedConsumables();
        const consumablesLines = usedConsumables.map(({ name, amount }) => {
            const time = getActiveTime();
            const perHour = time.hours > 0 ? (amount / time.hours).toFixed(2) : 0;
            return `  ${name}: ${amount.toLocaleString()} | Per Hour: ${perHour}`;
        }).join("\n");

        let fullLog = "";
        if (lootLines) {
            fullLog += `Loot Gained (This Session):\n${lootLines}`;
        }
        if (consumablesLines) {
            fullLog += `\n\nConsumables Used (This Session):\n${consumablesLines}`;
        }

        if (cachedElements.loggerLootElement) {
            cachedElements.loggerLootElement.textContent = fullLog.trim() || "No loot drops or consumables used yet.";
        }
    }

    function checkAndInitialize() {
        updateCardsCache();
        const lootCard = cachedCards.find(card => card.querySelector('.header .name')?.textContent.trim() === 'Loot');
        const consumablesCard = cachedCards.find(card => card.querySelector('.header .name')?.textContent.trim() === 'Consumables');

        if (!lootCard || !consumablesCard) {
            console.log("Loot Logger: Combat active, but UI not ready. Waiting 200ms...");
            setTimeout(checkAndInitialize, 200); // Try again
            return;
        }

        console.log("Loot Logger: UI ready. Initializing baselines.");
        initializeLoot();
        initializeConsumables();
    }


    const observer = new MutationObserver(() => {
        const isCombatActive = !!document.querySelector('.action-stop');
        const currentMonsterName = document.querySelector('.interface.monster .header .name')?.textContent.trim() || null;


        if (isCombatActive) {

            if (isPaused) {
                console.log("Loot Logger: Combat Resumed / Detected.");
                isPaused = false;
                currentSessionStartTime = Date.now(); // Start timer
                monsterIsPresent = !!currentMonsterName; // Sync name state
                lastKnownMonsterName = currentMonsterName || "Unknown";

                if (cachedElements.statTarget) {
                    cachedElements.statTarget.textContent = lastKnownMonsterName;
                }

                checkAndInitialize();
            } else {

                if (!currentMonsterName && monsterIsPresent) {
                    console.log("Loot Logger: Kill detected (respawn). Timer continues.");
                    killCount++;
                    monsterIsPresent = false; // Flag that we're waiting for a new name
                    updateLootReport(); // Log the kill

                } else if (currentMonsterName && !monsterIsPresent) {
                    console.log("Loot Logger: New monster spawned.");
                    monsterIsPresent = true;
                    lastKnownMonsterName = currentMonsterName;
                    if (cachedElements.statTarget) {
                        cachedElements.statTarget.textContent = lastKnownMonsterName;
                    }
                }
            }
        } else {


            if (!isPaused) {
                console.log("Loot Logger: Combat Paused.");
                isPaused = true;
                monsterIsPresent = false;
                lootInitialized = false; // Reset init flags
                consumablesInitialized = false;

                totalActiveTimeMs += (Date.now() - currentSessionStartTime); // Save time

                if (cachedElements.statTarget) {
                    cachedElements.statTarget.textContent = "Waiting...";
                }
            }
        }
    });


    createLoggerUI();
    setInterval(updateLiveStats, 1000); // Start the live updater
    observer.observe(document.body, { childList: true, subtree: true });

})();