// ==UserScript==
// @name         Bing News Auto Search (API Word List, Auto Off)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto-search 30 random words on Bing News using new API, with countdown and auto-stop after list ends.
// @author       GPT
// @match        https://www.bing.com/news*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545020/Bing%20News%20Auto%20Search%20%28API%20Word%20List%2C%20Auto%20Off%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545020/Bing%20News%20Auto%20Search%20%28API%20Word%20List%2C%20Auto%20Off%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'bingNewsAutoSearchRunning';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createToggleButton() {
        const btn = document.createElement('button');
        btn.id = 'autoSearchToggle';
        btn.textContent = 'Search: OFF';
        btn.style.position = 'fixed';
        btn.style.top = '22px';
        btn.style.left = '10px';
        btn.style.zIndex = 1000;
        btn.style.padding = '10px';
        btn.style.background = '#0078d7';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        document.body.appendChild(btn);
        return btn;
    }

    async function fetchWords() {
        try {
            const response = await fetch('https://random-words-api.kushcreates.com/api?category=softwares&words=35');
            const data = await response.json();
            if (Array.isArray(data)) {
                return data.map(item => item.word); // Extract just the word
            }
        } catch (e) {
            console.error('Failed to fetch random words:', e);
        }
        return [];
    }

    async function autoSearchLoop(button) {
        const words = await fetchWords();
        if (!words.length) {
            button.textContent = 'Search: Fetch Failed';
            localStorage.setItem(STORAGE_KEY, 'false');
            return;
        }

        for (let i = 0; i < words.length; i++) {
            if (localStorage.getItem(STORAGE_KEY) !== 'true') break;

            const randomWord = words[i];
            const searchInput = document.querySelector('input[name="q"]');
            if (!searchInput) break;

            searchInput.value = randomWord;

            const waitTime = Math.random() * 3000 + 5000; // 5000–8000 ms (5–8 s)
            const start = Date.now();
            const end = start + waitTime;

            // Countdown with 1-second precision
            while (Date.now() < end && localStorage.getItem(STORAGE_KEY) === 'true') {
                const remaining = ((end - Date.now()) / 1000).toFixed(0);
                button.textContent = `Search: ON (${remaining}s)`;
                await sleep(1000);
            }

            if (localStorage.getItem(STORAGE_KEY) !== 'true') {
                button.textContent = 'Search: OFF';
                return;
            }

            // Submit the form
            const form = searchInput.closest('form');
            if (form) {
                localStorage.setItem(STORAGE_KEY, 'true'); // ensure it remains ON across reload
                form.submit(); // reloads the page and breaks the loop
                return;
            }
        }

        // End of word list: auto stop
        localStorage.setItem(STORAGE_KEY, 'false');
        button.textContent = 'Search: Done';
    }

    // --- Initialize ---
    const toggleBtn = createToggleButton();

    if (localStorage.getItem(STORAGE_KEY) === 'true') {
        toggleBtn.textContent = 'Search: ON';
        autoSearchLoop(toggleBtn);
    }

    toggleBtn.addEventListener('click', () => {
        const currentState = localStorage.getItem(STORAGE_KEY) === 'true';
        if (currentState) {
            localStorage.setItem(STORAGE_KEY, 'false');
            toggleBtn.textContent = 'Search: OFF';
        } else {
            localStorage.setItem(STORAGE_KEY, 'true');
            toggleBtn.textContent = 'Search: ON';
            autoSearchLoop(toggleBtn);
        }
    });
})();
