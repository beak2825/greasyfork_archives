// ==UserScript==
// @name         JKLM Hardcore Enhanced
// @namespace    http://tampermonkey.net/
// @version      2024-08-02
// @license MIT
// @description  Enhance JKLM Bomb Party game with customizable difficulty and syllable display
// @author       SÜSSWASSERZIERFISCH
// @match        https://*.jklm.fun/games/bombparty/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jklm.fun
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      huggingface.co
// @downloadURL https://update.greasyfork.org/scripts/538929/JKLM%20Hardcore%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/538929/JKLM%20Hardcore%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variables
    let silben_obj = {};
    let silben_list = [];
    let silben_map = new Map();
    let einstellungen = {};
    let enabled = false;
    let selfID = -1;
    let currentModifiedSyllable = "";
    let originalSyllable = "";

    // Pseudo alphabet mapping
const pseudoAlphabetArray = ["𝖠","𝖡","𝖢","𝖣","𝖤","𝖥","𝖦","𝖧","𝖨","𝖩","𝖪","𝖫","𝖬","𝖭","𝖮","𝖯","𝖰","𝖱","𝖲","𝖳","𝖴","𝖵","𝖶","𝖷","𝖸","𝖹"];
const normalAlphabetArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    const SILLABLE_URL = 'https://huggingface.co/susswasserzierfisch/silben-modell/resolve/main/silben.tsv';
    const DEFAULT_SETTINGS = {
        enabled: true,
        min: 50,
        max: 500,
        showSolution: false,
        letters: [3, 4],
        prepend: true
    };

    // Convert normal text to pseudo alphabet
function toPseudoAlphabet(text) {
    return text.toUpperCase().split('').map(char => {
        const index = normalAlphabetArray.indexOf(char);
        return index !== -1 ? pseudoAlphabetArray[index] : char;
    }).join('');
}
    // Simulate typing function
    function simulateType(text, isSend) {
        if (typeof socket !== 'undefined' && socket.emit) {
            socket.emit("setWord", text, isSend);
        }
    }

    // Send chat message function
    function sendChatMessage(message) {
        if (typeof socket !== 'undefined' && socket.emit) {
            socket.emit("chat", message);
        }
    }

    // Helper function to extract only letters, apostrophes, and hyphens
    function extractValidChars(text) {
        return text.replace(/[^a-zA-Z'-]/g, '').toLowerCase();
    }

    // Helper function to check if text contains syllable
    function containsSyllable(text, syllable) {
        const cleanText = extractValidChars(text);
        const cleanSyllable = extractValidChars(syllable);
        return cleanText.includes(cleanSyllable);
    }

    // Initialize the script
    function init() {
        loadSettings();
        if (localStorage.silben) {
            loadSilben(localStorage.silben);
            setupUI();
        } else {
            fetchSilben();
        }
    }

    // Fetch syllables data from the server
    function fetchSilben() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: SILLABLE_URL,
            headers: { 'Accept': 'application/json' },
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        localStorage.silben = response.responseText;
                        loadSilben(localStorage.silben);
                        setupUI();
                    } catch (e) {
                        console.error("Failed to process syllables data:", e);
                    }
                } else {
                    console.error("Failed to fetch syllables data. Status:", response.status);
                }
            },
            onerror: function(error) {
                console.error("Error fetching syllables data:", error);
            }
        });
    }

    // Load settings from localStorage
    function loadSettings() {
        einstellungen = JSON.parse(localStorage.einstellungen || JSON.stringify(DEFAULT_SETTINGS));
        enabled = einstellungen.enabled;
    }

    // Load syllables data and build the syllables map
    function loadSilben(silben) {
        silben.split("\n").forEach(line => {
            let [silbe, count, solution] = line.split("\t");
            if (silbe && count) {
                silben_obj[silbe] = { count, solution };
                silben_list.push([silbe, count]);
            }
        });
        silben_map = buildSilbenMap(silben_list);
    }

    // Build a map of syllables for quick lookup
    function buildSilbenMap(silben_list) {
        const silbenMap = new Map();
        for (const [silbe, value] of silben_list) {
            for (let i = 0; i < silbe.length; i++) {
                for (let j = i + 1; j <= silbe.length; j++) {
                    const subsilbe = silbe.substring(i, j);
                    if (!silbenMap.has(subsilbe)) {
                        silbenMap.set(subsilbe, []);
                    }
                    silbenMap.get(subsilbe).push([silbe, value]);
                }
            }
        }
        return silbenMap;
    }

    // Set up the user interface
    function setupUI() {
        if (document.querySelector("#hardcore-settings")) return;

        const hardcoreSettings = document.createElement("div");
        hardcoreSettings.id = "hardcore-settings";
        hardcoreSettings.className = "setting rule hardcoreSettings";
        hardcoreSettings.innerHTML = `
            <div class="label" data-text="hardcoreMode">⚔️ Hardcore-Addon</div>
            <div class="info">Hardcore-Addon Aktivieren?</div>
            <div class="field">
                <input type="checkbox" id="hardcore-toggle">
            </div>
            <div class="info">Aktivierte Buchstabenzahlen</div>
            <div class="field">
                <div class="bonusAlphabetField">
                    <div class="bonusLetterField">
                        3 <input type="checkbox" id="hardcore-letter-3">
                    </div>
                    <div class="bonusLetterField">
                        4 <input type="checkbox" id="hardcore-letter-4">
                    </div>
                    <div class="bonusLetterField">
                        5 <input type="checkbox" id="hardcore-letter-5">
                    </div>
                </div>
            </div>
            <div class="info">Silbenschwierigkeit</div>
            <div class="field">
                <table>
                    <tbody>
                        <tr>
                            <th>Min:</th>
                            <td class="range">
                                <input type="number" id="min-number" min="1" max="50000">
                                <input type="range" id="min-range" min="1" max="5000">
                            </td>
                        </tr>
                        <tr>
                            <th>Max:</th>
                            <td class="range">
                                <input type="number" id="max-number" min="1" max="50000">
                                <input type="range" id="max-range" min="1" max="5000">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="info">Silbe voranstellen?</div>
            <div class="field">
                <input type="checkbox" id="prepend-toggle">
            </div>`;

        // Wait for the rules element to exist
        const waitForRules = setInterval(() => {
            const rulesElement = document.querySelector(".rules");
            if (rulesElement) {
                rulesElement.appendChild(hardcoreSettings);
                setupEventListeners();
                clearInterval(waitForRules);
            }
        }, 100);
    }

    // Set up event listeners for UI elements
    function setupEventListeners() {
        const minNumber = document.querySelector("#min-number");
        const minRange = document.querySelector("#min-range");
        const maxNumber = document.querySelector("#max-number");
        const maxRange = document.querySelector("#max-range");
        const toggleCheckbox = document.querySelector("#hardcore-toggle");
        const letter3Checkbox = document.querySelector("#hardcore-letter-3");
        const letter4Checkbox = document.querySelector("#hardcore-letter-4");
        const letter5Checkbox = document.querySelector("#hardcore-letter-5");
        const prependCheckbox = document.querySelector("#prepend-toggle");

        if (!minNumber || !toggleCheckbox) return;

        // Set initial values
        minNumber.value = minRange.value = einstellungen.min;
        maxNumber.value = maxRange.value = einstellungen.max;
        toggleCheckbox.checked = einstellungen.enabled;
        letter3Checkbox.checked = einstellungen.letters.includes(3);
        letter4Checkbox.checked = einstellungen.letters.includes(4);
        letter5Checkbox.checked = einstellungen.letters.includes(5);
        prependCheckbox.checked = einstellungen.prepend;

        // Event listeners
        minNumber.addEventListener("input", () => updateMinMax('min', minNumber, minRange));
        minRange.addEventListener("input", () => updateMinMax('min', minRange, minNumber));
        maxNumber.addEventListener("input", () => updateMinMax('max', maxNumber, maxRange));
        maxRange.addEventListener("input", () => updateMinMax('max', maxRange, maxNumber));
        toggleCheckbox.addEventListener("change", () => {
            einstellungen.enabled = toggleCheckbox.checked;
            enabled = einstellungen.enabled;
            updateSettings();
        });
        letter3Checkbox.addEventListener("change", () => updateLetters(3, letter3Checkbox.checked));
        letter4Checkbox.addEventListener("change", () => updateLetters(4, letter4Checkbox.checked));
        letter5Checkbox.addEventListener("change", () => updateLetters(5, letter5Checkbox.checked));
        prependCheckbox.addEventListener("change", () => {
            einstellungen.prepend = prependCheckbox.checked;
            updateSettings();
        });
    }

    // Update min/max values in settings
    function updateMinMax(type, primary, secondary) {
        secondary.value = primary.value;
        einstellungen[type] = parseInt(primary.value, 10);
        updateSettings();
    }

    // Update enabled letters in settings
    function updateLetters(letter, isChecked) {
        if (isChecked) {
            if (!einstellungen.letters.includes(letter)) {
                einstellungen.letters.push(letter);
            }
        } else {
            einstellungen.letters = einstellungen.letters.filter(l => l !== letter);
        }
        updateSettings();
    }

    // Save settings to localStorage
    function updateSettings() {
        localStorage.einstellungen = JSON.stringify(einstellungen);
    }

    // Choose a syllable based on enabled letters and difficulty range
    function silbeWahlen(subsilbe) {
        if (!enabled) return subsilbe;

        const candidates = (silben_map.get(subsilbe) || []).filter(silbe => {
            const syllableLength = silbe[0].length;
            const syllableValue = parseInt(silbe[1], 10);
            return einstellungen.letters.includes(syllableLength) &&
                   syllableValue >= einstellungen.min &&
                   syllableValue <= einstellungen.max;
        });

        if (candidates.length > 0) {
            let randomIndex = Math.floor(Math.random() * candidates.length);
            return candidates[randomIndex][0];
        }

        return subsilbe;
    }

    // Utility function to split the incoming string
    function splitString(input) {
        const regex = /^(\d+)(.*)/;
        const match = input.match(regex);
        return match ? { digits: match[1], rest: match[2] } : { digits: null, rest: input };
    }


    function modifySend(data) {
    try {
        let { digits, rest } = splitString(data);

        // Check if there's actually JSON data to parse
        if (!rest || rest.length === 0) {
            return data;
        }

        let json = JSON.parse(rest);

        // Check if this is a setWord message
        if (data.includes("setWord") && json.length >= 3) {
            console.log("HELLO", data);
            console.log("Original JSON:", json);

            // The structure is ["setWord", word, isSend]
            let userInput = json[1]; // The word is at index 1
            let isSend = json[2];    // The boolean is at index 2

            // Fix 2: Don't modify if input starts with '/'
            if (userInput && typeof userInput === 'string' && userInput.startsWith('/')) {
                return data;
            }

            // Updated logic: Prevent sending if word contains original syllable but not modified one
            if (userInput && typeof userInput === 'string' && originalSyllable && currentModifiedSyllable) {
                const containsOriginal = containsSyllable(userInput, originalSyllable);
                const containsModified = containsSyllable(userInput, currentModifiedSyllable);

                // If word contains original syllable but not the modified one, prevent sending
                if (containsOriginal && !containsModified) {
                    json[2] = false; // Set isSend to false
                }
                // If word doesn't contain original syllable at all, allow sending (don't change isSend)
                // If word contains modified syllable, allow sending (don't change isSend)
            }

            // Check if userInput exists and currentModifiedSyllable is valid
            if (userInput &&
                typeof userInput === 'string' &&
                userInput.length < 30 &&
                currentModifiedSyllable &&
                currentModifiedSyllable !== originalSyllable &&
                currentModifiedSyllable.trim() !== '' &&
                enabled &&
                einstellungen.prepend) {

                let pseudoSyllable = toPseudoAlphabet(currentModifiedSyllable.toUpperCase());
                let modifiedInput = `(${pseudoSyllable}) ${userInput}`;

                // Only prepend the syllable if the final result is 30 characters or less
                if (modifiedInput.length <= 30) {
                    json[1] = modifiedInput;
                    console.log("MODIFIED!", json);
                    return digits + JSON.stringify(json);
                }
            }
        }
    } catch (err) {
        console.log("Failed to modify send:", err);
    }

    // Always return the original data if no modification was made
    return data;
}
    // Modify incoming string messages after receiving
    function modifyReceive(data) {
        let { digits, rest } = splitString(data);

        // Check if there's actually JSON data to parse
        if (!rest || rest.length === 0) {
            return data;
        }

        try {
            let json = JSON.parse(rest);

            if (data.includes("nextTurn") && json.length >= 3) {
                let [, targetUser, newSilbe] = json;
                originalSyllable = newSilbe;

                if (targetUser === selfID) {
                    currentModifiedSyllable = silbeWahlen(newSilbe.toUpperCase()).toLowerCase();

                    // Send the modified syllable in pseudo alphabet immediately only if enabled and prepend is on
                    if (currentModifiedSyllable !== originalSyllable && enabled && einstellungen.prepend) {
                        let pseudoSyllable = toPseudoAlphabet(currentModifiedSyllable.toUpperCase());
                        setTimeout(() => {
                            sendChatMessage(`(${pseudoSyllable})`);
                        }, 100);
                    }

                    // Fix 3: Automatically write the syllable when turn starts only if enabled and prepend is on
                    if (enabled && einstellungen.prepend) {
                        setTimeout(() => {
                            simulateType(currentModifiedSyllable, false);
                        }, 150);
                    }

                    newSilbe = currentModifiedSyllable;
                }
                json[2] = newSilbe;
                return digits + JSON.stringify(json);
            }

            if (data.includes("syllable") && json.length >= 2 && json[1] && json[1].currentPlayerPeerId !== undefined) {
                let targetUser = json[1].currentPlayerPeerId;
                let newSilbe = json[1].syllable;
                originalSyllable = newSilbe;

                if (targetUser === selfID) {
                    currentModifiedSyllable = silbeWahlen(newSilbe.toUpperCase()).toLowerCase();

                    // Send the modified syllable in pseudo alphabet immediately only if enabled and prepend is on
                    if (currentModifiedSyllable !== originalSyllable && enabled && einstellungen.prepend) {
                        let pseudoSyllable = toPseudoAlphabet(currentModifiedSyllable.toUpperCase());
                        setTimeout(() => {
                            sendChatMessage(`(${pseudoSyllable})`);
                        }, 100);
                    }

                    // Fix 3: Automatically write the syllable when turn starts only if enabled and prepend is on
                    if (enabled && einstellungen.prepend) {
                        setTimeout(() => {
                            simulateType(currentModifiedSyllable, false);
                        }, 150);
                    }

                    json[1].syllable = currentModifiedSyllable;
                }
                return digits + JSON.stringify(json);
            }

            if (data.includes("selfPeerId") && json.length >= 2 && json[1] && json[1].selfPeerId !== undefined) {
                selfID = json[1].selfPeerId;
            }
        } catch (err) {
            console.log("Failed to parse JSON:", err);
        }
        return data;
    }

    // Override the WebSocket send method
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        let [dataToSend] = args;
        if (typeof dataToSend === 'string') {
            console.log("[WebSocket Interceptor] Sending:", dataToSend);
            dataToSend = modifySend(dataToSend);
            args[0] = dataToSend;
        }
        return originalSend.apply(this, args);
    };

    // Intercept incoming WebSocket messages
    function interceptWebSocketMessages() {
        let originalDescriptor = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        Object.defineProperty(MessageEvent.prototype, "data", {
            get: function() {
                let originalData = originalDescriptor.get.call(this);
                if (this.currentTarget instanceof WebSocket && typeof originalData === 'string') {
                    console.log("[WebSocket Interceptor] Received:", originalData);
                    return modifyReceive(originalData);
                }
                return originalData;
            }
        });
    }

    // Initialize the script
    init();
    interceptWebSocketMessages();
})();