// ==UserScript==
// @name         Bing Human Search
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Ricerche umanizzate senza scrolling
// @author       Nayila Yassin
// @license MIT
// @match        https://www.bing.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      api.datamuse.com
// @connect      random-word-api.herokuapp.com
// @downloadURL https://update.greasyfork.org/scripts/533799/Bing%20Human%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/533799/Bing%20Human%20Search.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const STATE_KEY = 'BingHumanSearch_State';
    const WORD_CACHE_KEY = 'BingHumanSearch_Words';

    // Configurazione aggiornata (tempo ridotto)
    const config = {
        typing: {
            min: 150,  // Minimo tempo per digitare un carattere (ms)
            max: 500,  // Massimo tempo per digitare un carattere (ms)
            errorRate: 0.15,  // Probabilità di errore di battitura
            correctionProbability: 0.2  // Probabilità di correzione dell'errore
        },
        timing: {
            // 🔁 Tempo tra una ricerca e l'altra (15-30 secondi)
            searchDelay: { min: 15000, max: 30000 },  // Modificato da originale (60s-120s)

            // ⏱️ Tempo di caricamento risultati (6-12 secondi)
            resultLoad: { min: 6000, max: 12000 },

            // 🕵️ Tempo massimo di attesa per gli elementi (15 secondi)
            elementWait: { max: 15000, interval: 500 },

            // 📜 Configurazione dello scroll
            scrollStep: { min: 300, max: 500 },     // Altezza singolo scroll (px)
            scrollPause: { min: 500, max: 1500 },   // Pausa tra scroll consecutivi (ms)
            scrollCount: { min: 2, max: 4 }         // Numero di scroll effettuati
        }
    };

    let isRunning = GM_getValue(STATE_KEY, false);
    let wordCache = GM_getValue(WORD_CACHE_KEY, []);
    let controlPanel;

    // Stili CSS globali
    GM_addStyle(`
        .bhs-control-panel {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 99999;
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid #e0e0e0;
            min-width: 180px;
            font-family: 'Segoe UI', system-ui;
        }
        .bhs-button {
            background: ${isRunning ? '#e74c3c' : '#2ecc71'};
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            transition: all 0.25s ease;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .bhs-button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .bhs-status {
            margin-top: 12px;
            font-size: 0.9em;
            color: #555;
            text-align: center;
        }
    `);

    async function init() {
        createControlPanel();
        refreshWordCache();
        if(isRunning) startAutomation();
    }

    function createControlPanel() {
        controlPanel = document.createElement('div');
        controlPanel.className = 'bhs-control-panel';
        const btn = document.createElement('button');
        btn.className = 'bhs-button';
        btn.textContent = isRunning ? '⏹ STOP' : '▶ START';
        btn.onclick = toggleAutomation;
        const status = document.createElement('div');
        status.className = 'bhs-status';
        status.textContent = 'Status: ' + (isRunning ? 'Active 🔄' : 'Paused ⏸');
        controlPanel.append(btn, status);
        document.body.appendChild(controlPanel);
    }

    function updateStatus(text) {
        const status = controlPanel.querySelector('.bhs-status');
        if(status) status.textContent = `Status: ${text}`;
    }

    function toggleAutomation() {
        isRunning = !isRunning;
        GM_setValue(STATE_KEY, isRunning);
        refreshControlPanel();
        if(isRunning) {
            startAutomation();
        } else {
            updateStatus('Paused ⏸');
        }
    }

    function refreshControlPanel() {
        const btn = controlPanel.querySelector('.bhs-button');
        if(btn) {
            btn.textContent = isRunning ? '⏹ STOP' : '▶ START';
            btn.style.backgroundColor = isRunning ? '#e74c3c' : '#2ecc71';
        }
    }

    async function refreshWordCache() {
        if(wordCache.length > 20) return;
        try {
            const source = config.wordSources[Math.floor(Math.random() * config.wordSources.length)];
            const words = await fetchJSON(source);
            if(Array.isArray(words)) {
                wordCache = words.slice(0, 50).map(w => w.word || w);
                GM_setValue(WORD_CACHE_KEY, wordCache);
            }
        } catch(e) {
            console.warn('Failed to refresh word cache, using fallback');
            wordCache = ['test', 'search', 'demo', 'example', 'hello'];
        }
    }

    function getRandomWord() {
        return wordCache.length > 0
            ? wordCache.splice(Math.floor(Math.random() * wordCache.length), 1)[0]
            : 'search';
    }

    async function waitForElement(selector, timeout = config.timing.elementWait.max) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = setInterval(() => {
                const el = document.querySelector(selector);
                if(el) {
                    clearInterval(check);
                    resolve(el);
                } else if(Date.now() - start > timeout) {
                    clearInterval(check);
                    reject(new Error('Element not found'));
                }
            }, config.timing.elementWait.interval);
        });
    }

    async function humanType(text, element) {
        let currentText = '';
        for(const char of text) {
            if(!isRunning) break;
            if(Math.random() < config.typing.errorRate) {
                const fakeChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                currentText += fakeChar;
                await updateElement(element, currentText);
                if(Math.random() < config.typing.correctionProbability) {
                    currentText = currentText.slice(0, -1);
                    await updateElement(element, currentText);
                    await randomDelay(50, 150);
                }
            }
            currentText += char;
            await updateElement(element, currentText);
            await randomDelay(config.typing.min, config.typing.max);
        }
    }

    async function updateElement(element, value) {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    async function smoothScrollDown() {
        const scrollCount = Math.floor(Math.random() *
            (config.timing.scrollCount.max - config.timing.scrollCount.min + 1)) +
            config.timing.scrollCount.min;

        for(let i = 0; i < scrollCount && isRunning; i++) {
            const scrollAmount = Math.floor(Math.random() *
                (config.timing.scrollStep.max - config.timing.scrollStep.min + 1)) +
                config.timing.scrollStep.min;

            window.scrollBy({
                top: scrollAmount,
                left: 0,
                behavior: 'smooth'
            });

            await randomDelay(config.timing.scrollPause.min, config.timing.scrollPause.max);
        }
    }

    async function performSearch() {
        try {
            updateStatus('Starting search... ⏳');
            const searchBox = await waitForElement('input[name="q"], textarea[name="q"]');
            searchBox.value = '';
            searchBox.focus();
            await randomDelay(500, 1200);
            const word = getRandomWord();
            updateStatus(`Typing: ${word} ⌨️`);
            await humanType(word, searchBox);
            updateStatus('Submitting form... 📨');
            searchBox.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                composed: true
            }));
            updateStatus('Loading results... ⏳');
            await waitForElement('#b_results');
            await randomDelay(
                config.timing.resultLoad.min,
                config.timing.resultLoad.max
            );

            // Nuovo scroll aggiunto qui
            updateStatus('Scrolling results... 📜');
            await smoothScrollDown();

            updateStatus('Waiting next cycle... ⏳');
            await randomDelay(
                config.timing.searchDelay.min,
                config.timing.searchDelay.max
            );
            if(isRunning) performSearch();
        } catch(error) {
            console.error('Automation error:', error);
            updateStatus(`Error: ${error.message} ⚠️`);
            if(isRunning) setTimeout(performSearch, 5000);
        }
    }

    function startAutomation() {
        if(!isRunning) return;
        updateStatus('Initializing... ⚡');
        performSearch().catch(e => console.error('Fatal error:', e));
    }

    function randomDelay(min, max) {
        return new Promise(r => setTimeout(r, Math.random() * (max - min) + min));
    }

    function fetchJSON(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: r => resolve(JSON.parse(r.responseText)),
                onerror: reject
            });
        });
    }

    window.addEventListener('load', init, false);
})();