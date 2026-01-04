// ==UserScript==
// @name         pepeW Spammer 5
// @namespace    http://tampermonkey.net/
// @version      14.6
// @description  Wersja z ulepszonym interfejsem do dodawania i usuwania pojedynczych wiadomości z listy.
// @author       ewa
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541943/pepeW%20Spammer%205.user.js
// @updateURL https://update.greasyfork.org/scripts/541943/pepeW%20Spammer%205.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const pepewImg = "https://i.pinimg.com/originals/02/06/8e/02068e2e1a90365496eebe40702f87d4.gif";
 
    const style = document.createElement("style");
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
    @keyframes panel-flash-animation { 50% { box-shadow: 0 0 25px 5px #00ffa0; } }
    .panel-flash { animation: panel-flash-animation 0.4s ease-in-out; }
    #pepewPanel {
        position: fixed; top: 12px; right: 12px; width: 320px;
        background: url('${pepewImg}') no-repeat center center / cover;
        border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 255, 165, 0.3);
        font-family: 'Inter', sans-serif; color: #d0d0d0; user-select: none;
        z-index: 99999999; transition: height 0.3s ease, width 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
        overflow: visible; display: flex; flex-direction: column; cursor: default; left: auto;
    }
    #pepewPanel::before {
        content: ""; position: absolute; inset: 0; border-radius: 12px;
        background-color: rgba(0, 0, 0, 0.6); pointer-events: none; z-index: 0; backdrop-filter: brightness(0.75);
    }
    #pepewPanel.minimized {
        width: 190px !important; height: 36px !important; background: #000; cursor: pointer;
        justify-content: center !important; align-items: center !important; padding: 0 16px 0 8px !important;
        color: #00ffa0 !important; font-weight: 600 !important; font-size: 16px !important;
        text-shadow: 0 0 12px #00ffa0cc !important; flex-direction: row !important; gap: 8px !important;
        white-space: nowrap; overflow: visible !important; backdrop-filter: brightness(0.25);
    }
    #pepewPanel.minimized::before { background: none !important; }
    #pepewPanel.minimized #pepewPanelHeader, #pepewPanel.minimized #pepewPanelContent {
        visibility: hidden !important; height: 0 !important; margin: 0 !important; padding: 0 !important;
        overflow: hidden !important; user-select: none !important;
    }
    #pepewPanel.minimized #miniLabel, #pepewPanel.minimized #miniImg {
        visibility: visible !important; margin: 0 !important; padding: 0 !important;
        user-select: text !important; display: flex !important; align-items: center !important;
    }
    #miniLabel { color: #00ffa0; font-weight: 600; text-shadow: 0 0 8px #00ffa0cc; user-select: text; white-space: nowrap; font-family: 'Inter', sans-serif; line-height: 1; }
    #miniImg { width: 25px; height: 25px; border-radius: 3px; image-rendering: pixelated; user-select: none; }
    #pepewPanelHeader {
        background: transparent; padding: 8px 12px; font-weight: 600; font-size: 16px; cursor: move;
        display: flex; justify-content: space-between; align-items: center; color: #00ffa0;
        text-shadow: 0 0 5px #00ffa0cc; position: relative; z-index: 10;
    }
    #pepewPanelContent { display: flex; flex-direction: column; gap: 10px; padding: 12px; position: relative; z-index: 1; }
    #pepewPanel input[type="text"], #pepewPanel input[type="number"], #pepewPanel textarea {
        width: 100%; padding: 6px 8px; border-radius: 6px; border: none; font-family: 'Inter', sans-serif;
        font-size: 14px; background: #111; color: #eee; box-sizing: border-box; box-shadow: inset 0 0 5px #00ffa0cc; resize: vertical;
    }
    #pepewPanel input[type="range"] { width: 100%; }
    #pepewPanel button {
        background: #00ffa0; border: none; border-radius: 6px; padding: 8px 16px; font-weight: 600;
        cursor: pointer; color: #000; box-shadow: 0 0 8px #00ffa0cc; transition: background 0.3s ease;
    }
    #pepewPanel button:hover { background: #00cc80; }
    #toggleMinimizeBtn { padding: 0; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; font-size: 20px; line-height: 1; }
    #counterDisplay { font-size: 14px; color: #00ffa0; text-align: center; font-weight: 600; text-shadow: 0 0 5px #00ffa0cc; }
    #countdownDisplay { font-size: 12px; color: #b0b0b0; text-align: center; min-height: 16px; font-weight: 500; margin-top: 4px; }
    .custom-dropdown { position: absolute; top: 50%; right: 50px; transform: translateY(-50%); width: 90px; }
    .dropdown-selected {
        background-color: #222; color: #ccc; border: 1px solid #444; border-radius: 6px; padding: 4px 8px;
        font-family: 'Inter', sans-serif; font-weight: 600; font-size: 12px; cursor: pointer; display: flex;
        justify-content: space-between; align-items: center;
    }
    .dropdown-selected::after { content: '▼'; font-size: 10px; transition: transform 0.2s ease; }
    .custom-dropdown.open .dropdown-selected::after { transform: rotate(180deg); }
    .dropdown-options {
        position: absolute; top: 110%; left: 0; right: 0; background-color: #222; border: 1px solid #444;
        border-radius: 6px; list-style: none; padding: 4px; margin: 0; z-index: 11; opacity: 0;
        visibility: hidden; pointer-events: none; transform: translateY(-10px);
        transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    }
    .custom-dropdown.open .dropdown-options { opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0); }
    .dropdown-options li { padding: 6px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background-color 0.2s ease; }
    .dropdown-options li:hover { background-color: #00ffa0; color: #000; }
    #msgCountContainer, #keywordContainer { display: flex; flex-direction: column; gap: 4px; }
 
    /* === NOWE STYLE DLA ZARZĄDZANIA WIADOMOŚCIAMI === */
    #addMessageContainer { display: flex; gap: 8px; }
    #newMessageInput { flex-grow: 1; }
    #addMessageBtn { padding: 0; width: 32px; flex-shrink: 0; font-size: 20px; }
    #messageList {
        display: flex; flex-direction: column; gap: 6px;
        max-height: 120px; overflow-y: auto; padding: 4px;
        background: rgba(0,0,0,0.2); border-radius: 6px;
    }
    .message-item {
        display: flex; justify-content: space-between; align-items: center;
        background: #222; padding: 4px 8px; border-radius: 4px;
        font-size: 13px;
    }
    .message-item-text { word-break: break-all; }
    .delete-msg-btn {
        background: none; border: none; color: #ff5555; cursor: pointer;
        font-size: 16px; line-height: 1; padding: 0 4px; font-weight: bold;
    }
    .delete-msg-btn:hover { color: #ff8888; }
    `;
    document.head.appendChild(style);
 
    const panel = document.createElement("div");
    panel.id = "pepewPanel";
    panel.innerHTML = `
        <div id="pepewPanelHeader">
            <div>pepeW Spammer</div>
            <div class="custom-dropdown" id="modeDropdownContainer">
                <div class="dropdown-selected" id="selectedMode">Czas</div>
                <ul class="dropdown-options" id="modeOptions">
                    <li data-value="time">Czas</li>
                    <li data-value="chat">Czat</li>
                    <li data-value="keyword">Słowo</li>
                </ul>
            </div>
            <button id="toggleMinimizeBtn">−</button>
        </div>
        <div id="pepewPanelContent">
            <label>Wiadomości:</label>
            <div id="messageList"></div>
            <div id="addMessageContainer">
                <input type="text" id="newMessageInput" placeholder="Wpisz nową wiadomość...">
                <button id="addMessageBtn">+</button>
            </div>
            <div id="timeSliders">
                <div><label>Min (s): <span id="minValDisplay">1.0</span></label><input type="range" id="minDelay" min="0" max="30" step="0.5" value="1" /></div>
                <div><label>Max (s): <span id="maxValDisplay">2.0</span></label><input type="range" id="maxDelay" min="0" max="30" step="0.5" value="2" /></div>
            </div>
            <div id="msgCountContainer" style="display:none;">
                <label for="msgCountInput">Co ile wiadomości na czacie:</label>
                <input type="number" id="msgCountInput" min="1" value="5" />
            </div>
            <div id="keywordContainer" style="display:none;">
                <label for="keywordInput">Wyzwalacze (każdy w nowej linii):</label>
                <textarea id="keywordInput" rows="3"></textarea>
            </div>
            <button id="startStopBtn">Start</button>
            <div id="counterDisplay">Wysłano wiadomości: 0</div>
            <div id="countdownDisplay">Oczekuje na start...</div>
        </div>
        <img id="miniImg" src="${pepewImg}" style="visibility:hidden; user-select:none;" />
        <div id="miniLabel" style="visibility:hidden; user-select:none;">pepeW Spammer</div>
    `;
    document.body.appendChild(panel);
 
    // === ZMIENNE ===
    const countdownDisplay = document.getElementById("countdownDisplay");
    const minSlider = document.getElementById("minDelay");
    const maxSlider = document.getElementById("maxDelay");
    const minDisplay = document.getElementById("minValDisplay");
    const maxDisplay = document.getElementById("maxValDisplay");
    const startStopBtn = document.getElementById("startStopBtn");
    const toggleMinimizeBtn = document.getElementById("toggleMinimizeBtn");
    const header = document.getElementById("pepewPanelHeader");
    const counterDisplay = document.getElementById("counterDisplay");
    const modeDropdownContainer = document.getElementById("modeDropdownContainer");
    const selectedModeDiv = document.getElementById("selectedMode");
    const modeOptions = document.getElementById("modeOptions");
    const msgCountInput = document.getElementById("msgCountInput");
    const msgCountContainer = document.getElementById("msgCountContainer");
    const timeSliders = document.getElementById("timeSliders");
    const keywordInput = document.getElementById("keywordInput");
    const keywordContainer = document.getElementById("keywordContainer");
 
    // NOWE ELEMENTY UI WIADOMOŚCI
    const messageListDiv = document.getElementById('messageList');
    const newMessageInput = document.getElementById('newMessageInput');
    const addMessageBtn = document.getElementById('addMessageBtn');
 
    let running = false;
    let timeoutId = null;
    let messageCount = 0;
    let observer = null;
    let mode = "time";
    let countdownInterval = null;
    let targetTime = 0;
    let isSending = false;
    let myUsername = null;
    const settingsKey = 'pepewSpammerSettings_v14.4'; // Zaktualizowany klucz dla nowej wersji
    let messagesArray = []; // Tablica przechowująca wiadomości
 
    // === ZARZĄDZANIE WIADOMOŚCIAMI ===
 
    function renderMessages() {
        messageListDiv.innerHTML = ''; // Wyczyść listę
        messagesArray.forEach((msg, index) => {
            const item = document.createElement('div');
            item.className = 'message-item';
            item.innerHTML = `
                <span class="message-item-text">${msg}</span>
                <button class="delete-msg-btn" data-index="${index}" title="Usuń wiadomość">×</button>
            `;
            messageListDiv.appendChild(item);
        });
    }
 
    function addMessage() {
        const newMessage = newMessageInput.value.trim();
        if (newMessage) {
            messagesArray.push(newMessage);
            newMessageInput.value = '';
            renderMessages();
            saveSettings();
        }
    }
 
    messageListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-msg-btn')) {
            const index = parseInt(e.target.dataset.index, 10);
            messagesArray.splice(index, 1);
            renderMessages();
            saveSettings();
        }
    });
 
    addMessageBtn.addEventListener('click', addMessage);
    newMessageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMessage();
        }
    });
 
    // === GŁÓWNA LOGIKA ===
 
    function applyMode(newMode) { /* ... bez zmian ... */
        mode = newMode;
        timeSliders.style.display = 'none';
        msgCountContainer.style.display = 'none';
        keywordContainer.style.display = 'none';
        switch (newMode) {
            case 'time': timeSliders.style.display = 'block'; selectedModeDiv.textContent = "Czas"; break;
            case 'chat': msgCountContainer.style.display = 'flex'; selectedModeDiv.textContent = "Czat"; break;
            case 'keyword': keywordContainer.style.display = 'flex'; selectedModeDiv.textContent = "Słowo"; break;
        }
    }
 
    function saveSettings() {
        const settings = {
            messages: messagesArray, // Zapisujemy nową tablicę
            minDelay: minSlider.value, maxDelay: maxSlider.value,
            msgCount: msgCountInput.value, keyword: keywordInput.value, mode: mode,
            left: panel.style.left, top: panel.style.top,
        };
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }
 
    function loadSettings() {
        const saved = localStorage.getItem(settingsKey);
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                messagesArray = Array.isArray(settings.messages) ? settings.messages : ['pepeW'];
                minSlider.value = settings.minDelay || '1';
                maxSlider.value = settings.maxDelay || '2';
                msgCountInput.value = settings.msgCount || '5';
                keywordInput.value = settings.keyword || '';
                const savedMode = settings.mode || 'time';
                applyMode(savedMode);
                if (settings.left && settings.top) {
                    panel.style.left = settings.left;
                    panel.style.top = settings.top;
                    panel.style.right = "auto";
                }
            } catch (e) { console.error("Błąd wczytywania ustawień:", e); messagesArray = ['pepeW']; }
        } else {
            messagesArray = ['pepeW']; // Domyślna wiadomość przy pierwszym uruchomieniu
        }
        renderMessages(); // Wyrenderuj wczytane wiadomości
        updateSlidersDisplay();
    }
 
    const triggerSendFlash = () => panel.classList.add('panel-flash');
    panel.addEventListener('animationend', () => panel.classList.remove('panel-flash'));
    const updateCounter = () => counterDisplay.textContent = `Wysłano wiadomości: ${messageCount}`;
    const updateSlidersDisplay = () => { /* ... bez zmian ... */
        minDisplay.textContent = parseFloat(minSlider.value).toFixed(1);
        maxDisplay.textContent = parseFloat(maxSlider.value).toFixed(1);
    };
    const getRandomDelay = () => (Math.random() * (parseFloat(maxSlider.value) - parseFloat(minSlider.value)) + parseFloat(minSlider.value)) * 1000;
 
    function getRandomMessage() {
        if (messagesArray.length === 0) return null;
        return messagesArray[Math.floor(Math.random() * messagesArray.length)];
    }
 
    const sendMessage = msg => { /* ... bez zmian ... */
        if (!msg) return false;
        const inputDiv = document.querySelector('div.editor-input[contenteditable="true"][data-testid="chat-input"]');
        if (!inputDiv) { console.error("PEPEW SPAMMER: Nie znaleziono pola wiadomości."); return false; }
        inputDiv.focus(); inputDiv.textContent = ""; document.execCommand('insertText', false, msg);
        inputDiv.dispatchEvent(new Event('input', { bubbles: true }));
        inputDiv.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', code: 'Enter', which: 13, keyCode: 13 }));
        triggerSendFlash(); return true;
    };
 
    function getMyUsername() { /* ... bez zmian ... */
        const usernameElement = document.querySelector('.user-menu-item-username');
        if (usernameElement) {
            myUsername = usernameElement.textContent.trim().toLowerCase();
            console.log(`PEPEW SPAMMER: Wykryto nazwę użytkownika: ${myUsername}`);
        } else {
            setTimeout(getMyUsername, 2000);
        }
    }
 
    function updateTimerCountdown() { /* ... bez zmian ... */
        if (!running) return;
        const remaining = targetTime - Date.now();
        if (remaining > 0) {
            countdownDisplay.textContent = `Następna za ${(remaining / 1000).toFixed(1)} s...`;
        } else {
            countdownDisplay.textContent = "Wysyłanie...";
        }
    }
 
    const spamLoopTime = () => { /* ... bez zmian ... */
        if (!running || mode !== "time") return;
        const msg = getRandomMessage();
        if (!msg) return stopSpamming();
        if (sendMessage(msg)) {
            messageCount++;
            updateCounter();
        }
        const delay = getRandomDelay();
        targetTime = Date.now() + delay;
        timeoutId = setTimeout(spamLoopTime, delay);
    };
 
    const setupChatObserver = () => { /* ... bez zmian ... */
        if (observer) observer.disconnect();
        const chatContainer = document.querySelector('#chatroom-messages > div');
        if (!chatContainer) { stopSpamming(); return; }
        console.log("PEPEW SPAMMER: Tryb czatu aktywny.");
        let newMessagesSinceLastSend = 0;
        const userSetCount = parseInt(msgCountInput.value, 10);
        countdownDisplay.textContent = `Oczekiwanie na ${userSetCount} wiadomości...`;
        observer = new MutationObserver(mutations => {
            if (!running || mode !== "chat" || isSending) return;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    newMessagesSinceLastSend += mutation.addedNodes.length;
                }
            }
            const remaining = Math.max(0, userSetCount - newMessagesSinceLastSend);
            countdownDisplay.textContent = `Oczekiwanie na ${remaining} wiadomości...`;
            if (newMessagesSinceLastSend >= userSetCount) {
                isSending = true;
                countdownDisplay.textContent = "Wysyłanie...";
                setTimeout(() => {
                    const msg = getRandomMessage();
                    if (msg && sendMessage(msg)) { messageCount++; updateCounter(); }
                    newMessagesSinceLastSend = 0;
                    countdownDisplay.textContent = `Oczekiwanie na ${userSetCount} wiadomości...`;
                    isSending = false;
                }, 200);
            }
        });
        observer.observe(chatContainer, { childList: true });
    };
 
    function setupKeywordObserver() { /* ... bez zmian ... */
        if (observer) observer.disconnect();
        const chatContainer = document.querySelector('#chatroom-messages > div');
        if (!chatContainer) { stopSpamming(); return; }
        console.log("PEPEW SPAMMER: Tryb wyzwalacza słownego aktywny.");
        function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
        const keywords = keywordInput.value.toLowerCase().split('\n').map(k => k.trim()).filter(k => k);
        if (keywords.length === 0) {
            countdownDisplay.textContent = 'Brak słów kluczowych!'; stopSpamming(); return;
        }
        const keywordRegexes = keywords.map(k => ({ keyword: k, regex: new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i') }));
        countdownDisplay.textContent = `Czuwanie na słowa...`;
        observer = new MutationObserver(mutations => {
            if (!running || mode !== 'keyword' || isSending) return;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            const usernameEl = node.querySelector('.chat-entry-username');
                            if (myUsername && usernameEl && usernameEl.textContent.trim().toLowerCase() === myUsername) continue;
                            const messageText = node.textContent.toLowerCase();
                            const foundMatch = keywordRegexes.find(item => item.regex.test(messageText));
                            if (foundMatch) {
                                isSending = true;
                                countdownDisplay.textContent = `Wyzwalacz: "${foundMatch.keyword}"`;
                                setTimeout(() => {
                                    const spamMsg = getRandomMessage();
                                    if (spamMsg && sendMessage(spamMsg)) { messageCount++; updateCounter(); }
                                    setTimeout(() => {
                                        if (running && mode === 'keyword') { countdownDisplay.textContent = `Czuwanie na słowa...`; }
                                        isSending = false;
                                    }, 2000);
                                }, 150);
                                return;
                            }
                        }
                    }
                }
            }
        });
        observer.observe(chatContainer, { childList: true });
    }
 
    const startSpamming = () => { /* ... bez zmian ... */
        if (running) return;
        running = true; startStopBtn.textContent = "Stop"; messageCount = 0; updateCounter();
        switch (mode) {
            case 'time':
                if (countdownInterval) clearInterval(countdownInterval);
                countdownInterval = setInterval(updateTimerCountdown, 100); spamLoopTime(); break;
            case 'chat': setupChatObserver(); break;
            case 'keyword': setupKeywordObserver(); break;
        }
    };
    const stopSpamming = () => { /* ... bez zmian ... */
        running = false; startStopBtn.textContent = "Start";
        if (timeoutId) clearTimeout(timeoutId); timeoutId = null;
        if (countdownInterval) clearInterval(countdownInterval); countdownInterval = null;
        if (observer) { observer.disconnect(); observer = null; console.log("PEPEW SPAMMER: Obserwator rozłączony."); }
        countdownDisplay.textContent = "Oczekuje na start...";
    };
 
    // === EVENT LISTENERS (BEZ ZMIAN W WIĘKSZOŚCI) ===
    startStopBtn.onclick = () => running ? stopSpamming() : startSpamming();
    selectedModeDiv.addEventListener('click', () => modeDropdownContainer.classList.toggle('open'));
    modeOptions.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const newMode = e.target.dataset.value;
            if (newMode !== mode) {
                if (running) stopSpamming();
                applyMode(newMode);
                saveSettings();
            }
            modeDropdownContainer.classList.remove('open');
        }
    });
    window.addEventListener('click', (e) => { if (!modeDropdownContainer.contains(e.target)) { modeDropdownContainer.classList.remove('open'); } });
    minSlider.oninput = () => { if (parseFloat(minSlider.value) > parseFloat(maxSlider.value)) maxSlider.value = minSlider.value; updateSlidersDisplay(); saveSettings(); };
    maxSlider.oninput = () => { if (parseFloat(maxSlider.value) < parseFloat(minSlider.value)) minSlider.value = maxSlider.value; updateSlidersDisplay(); saveSettings(); };
    msgCountInput.addEventListener('input', saveSettings);
    keywordInput.addEventListener('input', saveSettings);
    toggleMinimizeBtn.onclick = e => {
        e.stopPropagation(); panel.classList.toggle("minimized");
        toggleMinimizeBtn.textContent = panel.classList.contains("minimized") ? "+" : "−";
    };
    panel.addEventListener("click", () => {
        if (panel.classList.contains("minimized")) {
            panel.classList.remove("minimized");
            toggleMinimizeBtn.textContent = "−";
        }
    });
    let isDragging = false, dragStartX, dragStartY, startLeft, startTop;
    header.onmousedown = e => {
        if (e.target.closest('.custom-dropdown') || e.target === toggleMinimizeBtn) return;
        isDragging = true; dragStartX = e.clientX; dragStartY = e.clientY;
        const rect = panel.getBoundingClientRect(); startLeft = rect.left; startTop = rect.top;
        document.body.style.userSelect = "none";
    };
    document.onmousemove = e => {
        if (!isDragging) return;
        const newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, startLeft + (e.clientX - dragStartX)));
        const newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, startTop + (e.clientY - dragStartY)));
        panel.style.left = `${newX}px`; panel.style.top = `${newY}px`;
        panel.style.right = "auto"; panel.style.bottom = "auto";
    };
    document.onmouseup = () => {
        if (isDragging) { isDragging = false; document.body.style.userSelect = "auto"; saveSettings(); }
    };
 
    // Inicjalizacja skryptu
    getMyUsername();
    loadSettings();
})();