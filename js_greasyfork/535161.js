// ==UserScript==
// @name         Fallout Terminal Minigame
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  TERMINAL
// @author       Laïn
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/535161/Fallout%20Terminal%20Minigame.user.js
// @updateURL https://update.greasyfork.org/scripts/535161/Fallout%20Terminal%20Minigame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants & Configuration ---
    const Z_INDEX = 100001;
    const CHARS_PER_LINE_COLUMN = 12;
    const LINES_PER_COLUMN = 17;
    const TOTAL_CHARS_PER_COLUMN = CHARS_PER_LINE_COLUMN * LINES_PER_COLUMN;
    const TOTAL_SCREEN_CHARS = TOTAL_CHARS_PER_COLUMN * 2;
    const MAX_ALLOWANCES = 4;
    const JUNK_CHARS = "!@#$%^&*()_+-=[]{};':\",./<>?|`~§£¥";

    // --- EXPANDED MASTER_WORD_LIST ---
    const MASTER_WORD_LIST = {
        4: ["CODE", "LOCK", "SAFE", "SCAN", "CORE", "DATA", "DISK", "FILE", "LINK", "NODE", "PORT", "USER", "HACK", "PASS", "ROOT"],
        5: ["ROBOT", "LASER", "POWER", "WATER", "ADMIN", "ALERT", "VIRUS", "PROXY", "CACHE", "DEBUG", "LOGIN", "QUERY", "INPUT", "GUARD", "ENTRY"],
        6: ["SECURE", "ACCESS", "SYSTEM", "KERNEL", "SERVER", "BACKUP", "CIPHER", "ENCRYPT", "HACKER", "SCRIPT", "MODULE", "VERIFY", "DENIED", "REMOTE", "BYPASS"],
        7: ["NETWORK", "FIREWALL", "PROGRAM", "COMMAND", "CONTROL", "PROCESS", "ROUTINE", "ANALYZE", "DISPLAY", "OVERSEE", "WARNING", "FAILURE", "RECORDS", "ARCHIVE", "INSTALL"],
        8: ["TERMINAL", "PASSWORD", "PROTOCOL", "SECURITY", "DATABASE", "OVERRIDE", "CRACKING", "RESPONSE", "EJECTION", "DISABLED", "LOCKDOWN", "MASTERKEY", "INTRUSION", "PRIORITY", "AUTHORIZED"],
        9: ["EXECUTE", "CONFIGURE", "INTERFACE", "ALGORITHM", "ENCRYPTION", "DIRECTORY", "COMPONENT", "AUTOMATED", "LOGISTICS", "MAINBOARD", "PROTECTED", "REBOOTING", "HIJACKING", "PERIMETER", "UNLOCKING"],
        10: [
            "CONNECTION", "AUTHENTICATE", "PERMISSION", "DECRYPTION", "PROTECTION",
            "CALIBRATION", "OVERLOADING", "REDIRECTION", "INTERDICTION", "TERMINATION",
            "INITIALIZE", "DOWNLOADING", "UPLOADING", "REPLICATOR", "GENERATION"
        ], // 15 words
        11: [
            "UNAUTHORIZED", "ESTABLISHING", "COMMUNICATION", "DEACTIVATING", "INTERROGATING",
            "REPROGRAMING", "MODIFICATION", "SURVEILLANCE", "TRANSMISSION", "RECALIBRATE",
            "RECONFIGURE", "ENCAPSULATE", "CONSTRUCTION", "DISABLING", "OVERWRITING"
        ], // 15 words
        12: [
            "VERIFICATION", "TRANSMITTING", "INITIALIZING", "AUTHENTICATION", "AUTHORIZATION",
            "DECONTAMINATE", "NEUTRALIZATION", "REINFORCEMENT", "DECOMPOSITION", "INFILTRATION",
            "SYSTEMATICALLY", "CIRCUMVENTION", "COMPREHENSION", "DISCONNECTION", "MANIPULATION"
        ]  // 15 words
    };
    // --- END OF EXPANDED MASTER_WORD_LIST ---

    const DIFFICULTY_SETTINGS = [
        { name: "Novice",   wordLengthRange: [4, 5],   numWords: 5,  dudRemovers: 2, allowanceResets: 1 },
        { name: "Advanced", wordLengthRange: [6, 7],   numWords: 8,  dudRemovers: 1, allowanceResets: 1 },
        { name: "Expert",   wordLengthRange: [8, 9],   numWords: 12, dudRemovers: 1, allowanceResets: 0 },
        { name: "Master",   wordLengthRange: [10, 12], numWords: 15, dudRemovers: 0, allowanceResets: 0 }
    ];


    // --- Game State Variables ---
    let gameActive = false;
    let gameWindow = null;
    let screenContentEl = null;
    let attemptsLeftEl = null;
    let logEl = null;
    let difficultySelectEl = null;

    let currentDifficultySetting;
    let passwordLength;
    let numCandidateWords; // This will store the *actual* number of words used, after potential adjustments
    let currentAllowances;
    let actualPassword;
    let candidateWords = [];
    let screenCharacters = [];
    let wordLocations = [];
    let bracketTrickLocations = [];

    // --- Utility Functions ---
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function getRandomJunkChar() {
        return JUNK_CHARS[getRandomInt(0, JUNK_CHARS.length - 1)];
    }

    // --- DOM Elements Creation ---
    function createGameWindow() {
        if (gameWindow) return;

        gameWindow = document.createElement('div');
        gameWindow.id = 'fallout-terminal-game';
        gameWindow.style.display = 'none';

        const header = document.createElement('div');
        header.className = 'terminal-header';
        header.innerHTML = `
            ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL<br>
            ENTER PASSWORD NOW<br>
            <span id="terminal-attempts-left"></span> ATTEMPT(S) LEFT: <span id="terminal-attempts-bars"></span>
        `;

        difficultySelectEl = document.createElement('select');
        difficultySelectEl.id = 'terminal-difficulty-select';
        DIFFICULTY_SETTINGS.forEach((diff, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = diff.name;
            difficultySelectEl.appendChild(option);
        });
        const startButton = document.createElement('button');
        startButton.textContent = 'Start New Game';
        startButton.id = 'terminal-start-button';
        startButton.onclick = () => initializeMinigame(parseInt(difficultySelectEl.value));

        const controlPanel = document.createElement('div');
        controlPanel.className = 'terminal-controls';
        controlPanel.appendChild(document.createTextNode('Difficulty: '));
        controlPanel.appendChild(difficultySelectEl);
        controlPanel.appendChild(startButton);


        screenContentEl = document.createElement('div');
        screenContentEl.id = 'terminal-screen-content';
        screenContentEl.onclick = handleScreenClick;

        logEl = document.createElement('div');
        logEl.id = 'terminal-log';

        const closeButton = document.createElement('button');
        closeButton.id = 'terminal-close-button';
        closeButton.textContent = 'Close [X]';
        closeButton.onclick = toggleGameWindow;


        gameWindow.appendChild(closeButton);
        gameWindow.appendChild(header);
        gameWindow.appendChild(controlPanel);
        gameWindow.appendChild(screenContentEl);
        gameWindow.appendChild(logEl);

        document.body.appendChild(gameWindow);

        attemptsLeftEl = document.getElementById('terminal-attempts-left');

        GM_addStyle(`
            #fallout-terminal-game {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 720px;
                background-color: #000;
                color: #00FF00;
                border: 2px solid #00FF00;
                padding: 15px;
                font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace;
                font-size: 14px;
                line-height: 1.3;
                z-index: ${Z_INDEX};
                box-shadow: 0 0 20px #00FF00;
            }
            #terminal-close-button {
                position: absolute;
                top: 5px;
                right: 5px;
                background: #333;
                color: #0F0;
                border: 1px solid #0F0;
                cursor: pointer;
            }
            .terminal-header {
                text-align: center;
                margin-bottom: 10px;
                white-space: pre;
            }
            .terminal-controls {
                margin-bottom: 10px;
                text-align: center;
            }
            #terminal-difficulty-select, #terminal-start-button {
                 background: #111; color: #0F0; border: 1px solid #0F0; margin: 0 5px;
            }
            #terminal-screen-content {
                display: grid;
                grid-template-columns: auto 1fr auto 1fr;
                gap: 0px 10px;
                margin-bottom: 10px;
                white-space: pre;
                user-select: none;
            }
            .terminal-mem-address {
                color: #00A000;
            }
            .terminal-char, .terminal-word-char, .terminal-bracket-char {
                cursor: default;
                display: inline-block;
            }
            .terminal-word-char, .terminal-bracket-char {
                cursor: pointer;
            }
            .terminal-word-char:hover, .terminal-bracket-char:hover {
                background-color: #00FF00;
                color: #000000;
            }
            .dud-removed {
                color: #005000 !important;
                pointer-events: none;
            }
            .dud-removed:hover { background-color: transparent !important; color: #005000 !important; }
            .trick-used {
                color: #005000 !important;
                pointer-events: none;
            }
            .trick-used:hover { background-color: transparent !important; color: #005000 !important; }
            #terminal-log {
                height: 75px; /* Slightly increased height for more log visibility */
                border-top: 1px dashed #00FF00;
                padding-top: 5px;
                overflow-y: auto;
            }
            #terminal-log > p { margin: 0 0 3px 0; }
            .log-entry::before { content: "> "; }
            .log-success { color: #A0FFA0; }
            .log-fail { color: #FFA0A0; }
        `);
    }

    // --- Game Logic ---
    function initializeMinigame(difficultyIndex = 0) {
        if (!gameWindow) createGameWindow();
        gameActive = true;
        logEl.innerHTML = '';
        addLogMessage("Initializing ROBCO Industries (TM) Termlink...");

        currentDifficultySetting = DIFFICULTY_SETTINGS[difficultyIndex];
        passwordLength = getRandomInt(currentDifficultySetting.wordLengthRange[0], currentDifficultySetting.wordLengthRange[1]);
        let desiredNumCandidateWords = currentDifficultySetting.numWords; // How many we want
        currentAllowances = MAX_ALLOWANCES;

        // 1. Select Password
        const availableWordsForLength = MASTER_WORD_LIST[passwordLength];
        if (!availableWordsForLength || availableWordsForLength.length === 0) {
            addLogMessage(`FATAL ERROR: No words available for length ${passwordLength}.`, "log-fail");
            gameActive = false;
            return;
        }
        if (availableWordsForLength.length < 2 && desiredNumCandidateWords > 1) {
             addLogMessage(`CRITICAL WARNING: Insufficient unique words (${availableWordsForLength.length}) in master list for length ${passwordLength} to meet desired ${desiredNumCandidateWords} words.`, "log-fail");
             if (availableWordsForLength.length < desiredNumCandidateWords) {
                desiredNumCandidateWords = availableWordsForLength.length; // Cap at what's available
                if (desiredNumCandidateWords < 1) desiredNumCandidateWords = 1; // Must have at least one word (the password)
             }
        }
        actualPassword = availableWordsForLength[getRandomInt(0, availableWordsForLength.length - 1)];

        // 2. Select Decoy Words
        candidateWords = [actualPassword];
        let decoysPool = availableWordsForLength.filter(w => w !== actualPassword);
        shuffleArray(decoysPool);

        addLogMessage(`Password length: ${passwordLength}. Target words: ${desiredNumCandidateWords}.`);
        addLogMessage(`Password: ${actualPassword}. Available unique decoys: ${decoysPool.length}.`);

        for (let i = 0; i < desiredNumCandidateWords - 1 && decoysPool.length > 0; i++) {
            candidateWords.push(decoysPool.pop());
        }

        numCandidateWords = candidateWords.length; // Set the *actual* number of words we have

        if (numCandidateWords < desiredNumCandidateWords) {
            addLogMessage(`Warning: Only selected ${numCandidateWords} total words (wanted ${desiredNumCandidateWords}).`, "log-fail");
        }
        if (numCandidateWords < 2 && desiredNumCandidateWords > 1) { // Check if we have at least 1 password and 1 decoy
             addLogMessage("CRITICAL: Not enough unique words for a challenging game (less than 2 total words found).", "log-fail");
             // Game can still proceed with 1 word, but it's trivial.
        }
        shuffleArray(candidateWords);

        // 3. Prepare Screen Grid
        screenCharacters = new Array(TOTAL_SCREEN_CHARS).fill('');
        wordLocations = [];
        bracketTrickLocations = [];

        // 4. Place Words
        let wordsSuccessfullyPlaced = 0;
        for (const word of candidateWords) {
            let placed = false;
            for (let attempt = 0; attempt < 150 && !placed; attempt++) { // Increased attempts slightly for denser screens
                const startIndex = getRandomInt(0, TOTAL_SCREEN_CHARS - passwordLength);
                let validPlacement = true;
                const startLineVirt = Math.floor(startIndex / CHARS_PER_LINE_COLUMN);
                const endLineVirt = Math.floor((startIndex + passwordLength - 1) / CHARS_PER_LINE_COLUMN);

                if (startLineVirt !== endLineVirt) {
                    validPlacement = false;
                }

                if (validPlacement) {
                    for (let i = 0; i < passwordLength; i++) {
                        if (screenCharacters[startIndex + i] !== '') {
                            validPlacement = false;
                            break;
                        }
                    }
                }

                if (validPlacement) {
                    for (let i = 0; i < passwordLength; i++) {
                        screenCharacters[startIndex + i] = word[i];
                    }
                    wordLocations.push({ word: word, startIndex: startIndex, endIndex: startIndex + passwordLength - 1, isDud: false, isGuessed: false });
                    placed = true;
                    wordsSuccessfullyPlaced++;
                }
            }
            if (!placed) addLogMessage(`Warning: Could not place word "${word}".`, "log-fail");
        }
        addLogMessage(`Attempted to place ${numCandidateWords} words. Successfully placed: ${wordsSuccessfullyPlaced}.`);
        if (wordsSuccessfullyPlaced < numCandidateWords && wordsSuccessfullyPlaced < 2) {
            addLogMessage("CRITICAL: Failed to place enough words for a playable game.", "log-fail");
            // gameActive = false; // Optionally halt if too few words placed
        }


        // 5. Place Bracket Tricks
        const bracketPairs = ["()", "[]", "{}", "<>"];
        let tricksToPlace = [
            ...Array(currentDifficultySetting.dudRemovers).fill("DUD"),
            ...Array(currentDifficultySetting.allowanceResets).fill("RESET")
        ];
        shuffleArray(tricksToPlace);
        let tricksPlaced = 0;

        for (const trickType of tricksToPlace) {
            let placed = false;
            for (let attempt = 0; attempt < 100 && !placed; attempt++) {
                const pair = bracketPairs[getRandomInt(0, bracketPairs.length - 1)];
                const innerLength = getRandomInt(1, 7); // Ensure at least 1 junk char inside
                const totalTrickLength = 2 + innerLength;
                const startIndex = getRandomInt(0, TOTAL_SCREEN_CHARS - totalTrickLength);

                let validPlacement = true;
                 const startLineVirt = Math.floor(startIndex / CHARS_PER_LINE_COLUMN);
                 const endLineVirt = Math.floor((startIndex + totalTrickLength -1) / CHARS_PER_LINE_COLUMN);
                 if (startLineVirt !== endLineVirt) {
                    validPlacement = false;
                 }

                if(validPlacement) {
                    for (let i = 0; i < totalTrickLength; i++) {
                        if (screenCharacters[startIndex + i] !== '') {
                            validPlacement = false;
                            break;
                        }
                    }
                }

                if (validPlacement) {
                    screenCharacters[startIndex] = pair[0];
                    for (let i = 0; i < innerLength; i++) {
                        screenCharacters[startIndex + 1 + i] = getRandomJunkChar();
                    }
                    screenCharacters[startIndex + 1 + innerLength] = pair[1];
                    bracketTrickLocations.push({
                        type: trickType,
                        startIndex: startIndex,
                        endIndex: startIndex + totalTrickLength - 1,
                        innerStartIndex: startIndex + 1,
                        innerEndIndex: startIndex + innerLength,
                        isUsed: false
                    });
                    placed = true;
                    tricksPlaced++;
                }
            }
            if (!placed) addLogMessage(`Warning: Could not place a ${trickType} trick.`, "log-fail");
        }
        if (tricksToPlace.length > 0) addLogMessage(`Attempted to place ${tricksToPlace.length} tricks. Successfully placed: ${tricksPlaced}.`);


        // 6. Fill Remaining Screen with Junk
        for (let i = 0; i < TOTAL_SCREEN_CHARS; i++) {
            if (screenCharacters[i] === '') {
                screenCharacters[i] = getRandomJunkChar();
            }
        }

        updateAttemptsDisplay();
        renderScreen();
        addLogMessage(`SYSTEM READY. ${wordsSuccessfullyPlaced} potential passwords displayed.`);
    }

    function renderScreen() {
        screenContentEl.innerHTML = '';
        let charIndex = 0;
        for (let col = 0; col < 2; col++) {
            const memAddrCol = document.createElement('div');
            memAddrCol.className = 'terminal-mem-address-col';
            const charCol = document.createElement('div');
            charCol.className = 'terminal-char-col';

            for (let line = 0; line < LINES_PER_COLUMN; line++) {
                const memAddressBase = 0xF000 + (col * TOTAL_CHARS_PER_COLUMN + line * CHARS_PER_LINE_COLUMN);
                const memAddress = memAddressBase.toString(16).toUpperCase().padStart(4, '0');

                const addrSpan = document.createElement('span');
                addrSpan.className = 'terminal-mem-address';
                addrSpan.textContent = `0x${memAddress} `;
                memAddrCol.appendChild(addrSpan);
                memAddrCol.appendChild(document.createElement('br'));

                for (let c = 0; c < CHARS_PER_LINE_COLUMN; c++) {
                    const absIndex = charIndex;
                    if (absIndex >= TOTAL_SCREEN_CHARS) break;

                    const char = screenCharacters[absIndex];
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.dataset.absIndex = absIndex;

                    const wordInfo = wordLocations.find(w => absIndex >= w.startIndex && absIndex <= w.endIndex);
                    if (wordInfo) {
                        charSpan.classList.add('terminal-word-char');
                        charSpan.dataset.wordIndex = wordLocations.indexOf(wordInfo);
                        if (wordInfo.isDud || (wordInfo.isGuessed && wordInfo.word !== actualPassword)) {
                             charSpan.classList.add('dud-removed');
                        }
                    } else {
                        const trickInfo = bracketTrickLocations.find(t => absIndex >= t.startIndex && absIndex <= t.endIndex);
                        if (trickInfo) {
                            charSpan.classList.add('terminal-bracket-char');
                            charSpan.dataset.trickIndex = bracketTrickLocations.indexOf(trickInfo);
                             if (trickInfo.isUsed) {
                                charSpan.classList.add('trick-used');
                            }
                        } else {
                            charSpan.classList.add('terminal-char');
                        }
                    }
                    charCol.appendChild(charSpan);
                    charIndex++;
                }
                charCol.appendChild(document.createElement('br'));
            }
            screenContentEl.appendChild(memAddrCol);
            screenContentEl.appendChild(charCol);
        }
    }


    function handleScreenClick(event) {
        if (!gameActive) return;

        const target = event.target;
        // const absIndex = parseInt(target.dataset.absIndex); // Not directly needed here

        if (target.classList.contains('terminal-word-char')) {
            const wordIndex = parseInt(target.dataset.wordIndex);
            if (isNaN(wordIndex) || wordIndex < 0 || wordIndex >= wordLocations.length) return; // Safety check
            const wordInfo = wordLocations[wordIndex];
            if (wordInfo.isDud || wordInfo.isGuessed) return;

            processWordGuess(wordInfo);

        } else if (target.classList.contains('terminal-bracket-char')) {
            const trickIndex = parseInt(target.dataset.trickIndex);
            if (isNaN(trickIndex) || trickIndex < 0 || trickIndex >= bracketTrickLocations.length) return; // Safety check
            const trickInfo = bracketTrickLocations[trickIndex];
            if (trickInfo.isUsed) return;

            processBracketTrick(trickInfo);
        }
    }

    function processWordGuess(wordInfo) {
        currentAllowances--;
        wordInfo.isGuessed = true;

        const likeness = calculateLikeness(wordInfo.word, actualPassword);
        addLogMessage(`Entry: ${wordInfo.word}... Likeness: ${likeness}`);

        if (wordInfo.word === actualPassword) {
            addLogMessage("Exact match detected!", "log-success");
            addLogMessage("PASSWORD ACCEPTED. ACCESS GRANTED.", "log-success");
            gameActive = false;
            for(let i = wordInfo.startIndex; i <= wordInfo.endIndex; i++) {
                const el = screenContentEl.querySelector(`[data-abs-index="${i}"]`);
                if(el) {
                    el.style.backgroundColor = '#00FF00';
                    el.style.color = '#000000';
                    el.classList.remove('terminal-word-char:hover'); // Attempt to remove hover style if stuck
                }
            }
        } else {
            addLogMessage("Entry denied. Incorrect password.", "log-fail");
            if (currentAllowances === 0) {
                addLogMessage("!!! WARNING: ATTEMPTS EXHAUSTED !!!", "log-fail");
                addLogMessage("TERMINAL LOCKOUT IMMINENT. SYSTEM OFFLINE.", "log-fail");
                gameActive = false;
            }
        }
        updateAttemptsDisplay();
        renderScreen();
    }

    function calculateLikeness(guess, password) {
        let count = 0;
        for (let i = 0; i < password.length; i++) {
            if (guess[i] === password[i]) {
                count++;
            }
        }
        return count;
    }

    function processBracketTrick(trickInfo) {
        trickInfo.isUsed = true;
        let trickTextContent = "";
        for(let i = trickInfo.startIndex; i <= trickInfo.endIndex; i++) {
            trickTextContent += screenCharacters[i]; // Build from screenCharacters for accuracy
        }
        addLogMessage(`Bracket sequence activated: ${trickTextContent}`);

        if (trickInfo.type === "DUD") {
            const potentialDuds = wordLocations.filter(w => w.word !== actualPassword && !w.isDud && !w.isGuessed);
            if (potentialDuds.length > 0) {
                shuffleArray(potentialDuds);
                const dudToMark = potentialDuds[0];
                dudToMark.isDud = true;
                addLogMessage(`Result: Dud removed ('${dudToMark.word}').`);
            } else {
                addLogMessage("Result: No duds available to remove.");
            }
        } else if (trickInfo.type === "RESET") {
            currentAllowances = MAX_ALLOWANCES;
            addLogMessage("Result: Allowances replenished.");
        }
        updateAttemptsDisplay();
        renderScreen();
    }


    function updateAttemptsDisplay() {
        attemptsLeftEl.textContent = currentAllowances;
        const attemptsBarsEl = document.getElementById('terminal-attempts-bars');
        attemptsBarsEl.textContent = '▮'.repeat(currentAllowances) + '▯'.repeat(MAX_ALLOWANCES - currentAllowances);
    }

    function addLogMessage(message, className = "") {
        const p = document.createElement('p');
        p.textContent = message;
        p.className = "log-entry " + className;
        logEl.appendChild(p);
        logEl.scrollTop = logEl.scrollHeight;
    }


    // --- Event Listeners & Initialization ---
    function toggleGameWindow() {
        createGameWindow();
        if (gameWindow.style.display === 'none') {
            gameWindow.style.display = 'block';
            if (!gameActive) {
                 initializeMinigame(parseInt(difficultySelectEl.value));
            }
        } else {
            gameWindow.style.display = 'none';
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === 'n') {
            e.preventDefault();
            toggleGameWindow();
        }
    });

    GM_registerMenuCommand("Toggle Fallout Terminal Minigame", toggleGameWindow, "n");

    console.log("Fallout Terminal Minigame script loaded. Press Ctrl+Alt+N to open.");

})();