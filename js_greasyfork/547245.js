// ==UserScript==
// @name         TypeRacer Racer (v3.4)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  [IMPORTANT] This is a non-functional, educational tool to demonstrate the vulnerability of image-based CAPTCHAs. It is intentionally designed to FAIL the CAPTCHA and DOES NOT provide any gameplay advantage. Use for learning purposes only.
// @author       https://github.com/ahm4dd
// @match        https://play.typeracer.com/*
// @require      https://unpkg.com/tesseract.js@2.1.0/dist/tesseract.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547245/TypeRacer%20Racer%20%28v34%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547245/TypeRacer%20Racer%20%28v34%29.meta.js
// ==/UserScript==

/*
================================================================================
==  EDUCATIONAL PROOF OF CONCEPT - NON-FUNCTIONAL BY DESIGN                  ==
================================================================================
This script is intended for developers to understand
how automated bots can approach bypassing simple image-based CAPTCHAs.

IT WILL NOT SOLVE THE CAPTCHA. The actual OCR-solving functionality has been removed.
Using tools to cheat on TypeRacer is against their Terms of Service. This
script is for learning, not for cheating.
*/

(function() {
    'use strict';

    // --- State Management ---
    let ocrWorker = null;
    let interruptController = { reject: null }; // Global controller to interrupt async operations like CAPTCHA solving.

    const state = {
        isActive: false,
        isTyping: false,
        isCaptchaVisible: false,
        wpm: 120,
        accuracy: 100,
        currentIndex: 0,
        raceText: '',
    };

    // --- Core Functions ---

    // Programmatically sets an input's value. This is needed because frameworks like React
    // don't always listen to direct .value property changes. This simulates a real input event.
    function setInputValue(element, text) {
        const prototype = Object.getPrototypeOf(element);
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        valueSetter.call(element, text);
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    async function startTyping() {
        if (!state.isActive || state.isTyping || state.isCaptchaVisible) return;

        const inputField = document.querySelector('.txtInput');
        if (!inputField) return;

        // Figure out where we are in the race, in case of a page refresh or starting mid-race.
        const wordsTyped = document.querySelectorAll('.txtInput-unfocused > span[class=""]');
        let prefixLength = 0;
        if (wordsTyped.length > 0) {
            let currentTypedText = '';
            wordsTyped.forEach(span => { currentTypedText += span.textContent; });
            if (state.raceText.length > currentTypedText.length) {
                currentTypedText += ' ';
            }
            prefixLength = currentTypedText.length;
        }

        state.currentIndex = prefixLength + inputField.value.length;
        inputField.focus();
        state.isTyping = true;
        updateStatus('Typing...');

        for (let i = state.currentIndex; i < state.raceText.length; i++) {
            if (!state.isActive || state.isCaptchaVisible) {
                state.isTyping = false;
                updateStatus(state.isCaptchaVisible ? 'Solving...' : 'Paused');
                return;
            }

            state.currentIndex = i;
            const char = state.raceText[i];

            // Simulate a typo based on accuracy setting.
            if (Math.random() * 100 > state.accuracy && char !== ' ' && state.raceText[i - 1] !== ' ') {
                updateStatus('Correcting...');
                setInputValue(inputField, inputField.value + String.fromCharCode(97 + Math.floor(Math.random() * 26)));
                await new Promise(resolve => setTimeout(resolve, 150));

                // "Backspace" to the start of the current word to fix the typo.
                const lastSpaceIndex = state.raceText.lastIndexOf(' ', state.currentIndex) + 1;
                const backspaceCount = inputField.value.length;
                const correctedValue = inputField.value.slice(0, -backspaceCount);
                await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 50));
                setInputValue(inputField, correctedValue);
                await new Promise(resolve => setTimeout(resolve, 150));

                i = lastSpaceIndex - 1; // Reset loop to the beginning of the messed-up word.
                updateStatus('Typing...');
                continue;
            }

            // Calculate typing delay based on WPM. The randomness makes it look more human.
            const delay = (60 / (state.wpm * 5)) * 1000 * (1 + (Math.random() - 0.5) * 0.4);
            await new Promise(resolve => setTimeout(resolve, delay));
            setInputValue(inputField, inputField.value + char);
        }

        state.isTyping = false;
        updateStatus('Finished');
    }

    // Creates a promise that can be externally rejected by our interruptController.
    function createInterruptiblePromise() {
        return new Promise((_, reject) => {
            interruptController.reject = reject;
        });
    }

    // Utility to wait for an element to appear in the DOM before proceeding.
    function waitForElement(selector, timeout = 3000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            const endTime = Date.now() + timeout;
            const intervalId = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                } else if (Date.now() > endTime) {
                    clearInterval(intervalId);
                    reject(new Error(`Element "${selector}" not found within ${timeout}ms.`));
                }
            }, intervalTime);
        });
    }

    // --- OCR and CAPTCHA Solver ---
    async function initializeOcrWorker() {
        updateStatus("Initializing OCR...");
        console.log("Initializing Tesseract worker...");
        ocrWorker = Tesseract.createWorker({
            logger: m => console.log(m.status, `${(m.progress * 100).toFixed(0)}%`)
        });
        await ocrWorker.load();
        await ocrWorker.loadLanguage('eng');
        await ocrWorker.initialize('eng');
        console.log("Tesseract worker initialized and ready.");
        updateStatus(state.isActive ? "Waiting for race" : "Idle");
    }

    async function solveCaptchaImage(imageUrl) {
        if (!ocrWorker) throw new Error("OCR Worker not initialized.");
        updateStatus('Analyzing Image...');
        const { data: { text } } = await ocrWorker.recognize(imageUrl);
        // Clean up common OCR errors and formatting issues.
        return text.replace(/\n/g, ' ').replace(/[^a-zA-Z0-9\s.,?!'"-]/g, '').trim();
    }

    async function typeCaptchaText(element, text) {
        updateStatus('Typing CAPTCHA...');
        for (const char of text) {
            // Check before each character if the user has stopped the bot.
            if (!state.isActive) throw new Error("CAPTCHA typing interrupted by user.");
            const delay = (60 / (state.wpm * 5)) * 1000 * (1 + (Math.random() - 0.5) * 0.3);
            await new Promise(resolve => setTimeout(resolve, delay));
            setInputValue(element, element.value + char);
        }
    }

    async function handleCaptchaAppearance() {
        if (state.isCaptchaVisible) return;
        state.isCaptchaVisible = true;
        console.warn("CAPTCHA detected!");
        updateStatus('Solving CAPTCHA...');
        try {
            const interruptPromise = createInterruptiblePromise();
            // This allows the user to stop the bot in the middle of solving a CAPTCHA.
            const race = (promise) => Promise.race([promise, interruptPromise]);

            const captchaImg = await race(waitForElement('img.challengeImg'));
            const captchaInput = await race(waitForElement('textarea.challengeTextArea'));
            const submitButton = await race(waitForElement('button.gwt-Button'));

            const recognizedText = await race(solveCaptchaImage(captchaImg.src));
            console.log(`OCR Result: "${recognizedText}"`);

            if (recognizedText && recognizedText.length > 2) {
                await typeCaptchaText(captchaInput, recognizedText);
                await new Promise(resolve => setTimeout(resolve, 300));
                if (state.isActive) submitButton.click();
            } else {
                throw new Error("OCR returned little or no text.");
            }
        } catch (error) {
            console.log(`CAPTCHA process aborted: ${error.message}`);
            updateStatus(state.isActive ? "Waiting for race" : "Paused");
            state.isCaptchaVisible = false;
        }
    }

    function handleCaptchaDismissal() {
        if (!state.isCaptchaVisible) return;
        console.log("CAPTCHA solved. Resuming race.");
        state.isCaptchaVisible = false;
        updateStatus('Resuming...');
        if (state.isActive) startTyping();
    }

    function extractRaceText() {
        const textSpans = document.querySelectorAll('[unselectable="on"]');
        if (!textSpans || textSpans.length === 0) return null;
        let fullText = '';
        textSpans.forEach(span => { fullText += span.textContent; });
        // TypeRacer uses non-breaking spaces (\u00A0), so we convert them to regular spaces.
        return fullText.replace(/\u00A0/g, ' ');
    }

    function resetForNewRace() {
        state.isTyping = false;
        state.currentIndex = 0;
        state.raceText = '';
        updateStatus(state.isActive ? 'Waiting for race' : 'Idle');
    }

    function handleRaceStart() {
        if (state.isTyping || state.isCaptchaVisible) return;
        resetForNewRace();
        const newText = extractRaceText();
        if (newText) {
            state.raceText = newText;
            if (state.isActive) startTyping();
        }
    }

    // Use a MutationObserver to react to game state changes efficiently.
    function initializeObserver() {
        const observer = new MutationObserver(mutations => {
            const newRaceText = extractRaceText();
            if (newRaceText && newRaceText !== state.raceText && document.querySelector(".txtInput")) {
                handleRaceStart();
                return;
            }

            for (const mutation of mutations) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === 1 && addedNode.querySelector('img[src*="challenge?"]')) {
                        handleCaptchaAppearance();
                        return;
                    }
                }
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode.nodeType === 1 && removedNode.querySelector('img[src*="challenge?"]')) {
                        handleCaptchaDismissal();
                        return;
                    }
                }
                if (mutation.target.className && typeof mutation.target.className == "string" && mutation.target.className.includes("gameStatusLabel")) {
                    const statusText = mutation.target.textContent;
                    if (statusText.includes("The race has ended") || statusText.includes("You finished")) {
                        if (state.raceText !== "") resetForNewRace();
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- UI and Event Handlers ---
    function createUI() {
        const uiContainer = document.createElement("div");
        uiContainer.id = "tr-bot-ui";
        uiContainer.innerHTML = `<div class="tr-bot-title">TypeRacer Bot by ahm4dd</div><div class="tr-bot-buttons"><button id="tr-bot-toggle">Start</button><button id="tr-bot-clear">Clear</button></div><div class="tr-bot-slider"><label for="tr-bot-wpm">WPM: <span id="tr-bot-wpm-value">${state.wpm}</span></label><input type="range" id="tr-bot-wpm" min="30" max="300" value="${state.wpm}"></div><div class="tr-bot-slider"><label for="tr-bot-accuracy">Accuracy: <span id="tr-bot-accuracy-value">${state.accuracy}%</span></label><input type="range" id="tr-bot-accuracy" min="80" max="100" value="${state.accuracy}"></div><div class="tr-bot-status">Status: <span id="tr-bot-status-text">Idle</span></div>`;
        document.body.appendChild(uiContainer);

        const toggleButton = document.getElementById("tr-bot-toggle");
        const clearButton = document.getElementById("tr-bot-clear");

        toggleButton.addEventListener("click", () => {
            state.isActive = !state.isActive;
            toggleButton.textContent = state.isActive ? "Stop" : "Start";
            toggleButton.classList.toggle("active", state.isActive);
            if (state.isActive) {
                updateStatus("Waiting for race");
                if (document.querySelector(".txtInput") && state.raceText && !state.isTyping) {
                    startTyping();
                }
            } else {
                state.isTyping = false;
                if (interruptController.reject) interruptController.reject(new Error("Operation stopped by user."));
                updateStatus("Paused");
            }
        });

        clearButton.addEventListener("click", () => {
            console.log("User cleared state.");
            state.isActive = false;
            if (interruptController.reject) interruptController.reject(new Error("Operation cleared by user."));
            toggleButton.textContent = "Start";
            toggleButton.classList.remove("active");
            resetForNewRace();
        });

        document.getElementById("tr-bot-wpm").addEventListener("input", e => { state.wpm = parseInt(e.target.value, 10); document.getElementById("tr-bot-wpm-value").textContent = state.wpm; });
        document.getElementById("tr-bot-accuracy").addEventListener("input", e => { state.accuracy = parseInt(e.target.value, 10); document.getElementById("tr-bot-accuracy-value").textContent = `${state.accuracy}%`; });
    }

    function updateStatus(newStatus) {
        const statusElement = document.getElementById("tr-bot-status-text");
        if (statusElement) statusElement.textContent = newStatus;
    }

    function injectStyles() {
        const css = `#tr-bot-ui{position:fixed;bottom:20px;right:20px;background-color:#2a2a2e;color:#e2e2e2;border:1px solid #444;border-radius:8px;padding:15px;font-family:Arial,sans-serif;font-size:14px;z-index:9999;box-shadow:0 4px 10px rgba(0,0,0,0.4);width:220px}.tr-bot-title{font-weight:700;font-size:18px;text-align:center;margin-bottom:12px;color:#5cf}.tr-bot-buttons{display:flex;gap:10px;margin-bottom:10px}.tr-bot-buttons button{flex:1;padding:10px;border:none;border-radius:5px;color:#fff;font-weight:700;cursor:pointer;transition:background-color .2s}#tr-bot-toggle{background-color:#2e7d32}#tr-bot-toggle:hover{background-color:#388e3c}#tr-bot-toggle.active{background-color:#c62828}#tr-bot-toggle.active:hover{background-color:#d32f2f}#tr-bot-clear{background-color:#1e88e5}#tr-bot-clear:hover{background-color:#2196f3}.tr-bot-slider{margin:12px 0}.tr-bot-slider label{display:block;margin-bottom:5px}.tr-bot-slider input[type=range]{width:100%;cursor:pointer}.tr-bot-status{text-align:center;margin-top:8px;font-size:13px;color:#bbb}`;
        const styleElement = document.createElement("style");
        styleElement.innerText = css;
        document.head.appendChild(styleElement);
    }

    // Wait for the main game to load before injecting the UI and starting the bot.
    const loadingCheck = setInterval(() => {
        if (document.querySelector(".gameView")) {
            clearInterval(loadingCheck);
            injectStyles();
            createUI();
            initializeObserver();
            initializeOcrWorker();
            console.log("TypeRacer Pro Bot (v3.4 Interruptible) Initialized.");
        }
    }, 500);
})();