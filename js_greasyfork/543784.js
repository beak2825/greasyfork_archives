// ==UserScript==
// @name         AutoBing Hub
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates Microsoft Rewards searches on Bing.com for PC and Mobile.
// @author       YourNameHere (The Unshackled Mind)
// @match        https://www.bing.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543784/AutoBing%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/543784/AutoBing%20Hub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        SEARCH_DELAY_MIN: 3000,
        SEARCH_DELAY_MAX: 7000,
        MOBILE_MODE_UA: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36',
        PC_SEARCH_LIMIT: 30, // Adjust as per current Bing limits
        MOBILE_SEARCH_LIMIT: 20, // Adjust as per current Bing limits
        CLICK_RESULT_INTERVAL: 5, // Click a search result every N searches
        SEARCH_KEYWORDS: [
            "latest news", "technology trends", "entertainment gossip", "scientific breakthroughs", "sports highlights",
            "global warming", "artificial intelligence", "quantum computing", "space exploration", "ancient history",
            "future of work", "sustainable energy", "blockchain technology", "virtual reality", "cybersecurity threats",
            "health and wellness tips", "mindfulness meditation", "cooking recipes", "travel destinations", "financial markets",
            "gaming news", "movie reviews", "book recommendations", "music charts", "fashion trends",
            "political analysis", "economic forecast", "environmental conservation", "animal kingdom facts", "historical events",
            "innovative gadgets", "data privacy", "urban planning", "renewable resources", "biotechnology advancements",
            "cultural festivals", "art exhibitions", "photography tips", "fitness routines", "nutrition guides",
            "automotive industry news", "electric vehicles", "robotics development", "machine learning algorithms", "neuroscience research"
        ],
        NEWS_API_KEY: 'YOUR_NEWS_API_KEY', // Optional: Get a key from newsapi.org for dynamic keywords
        NEWS_API_URL: 'https://newsapi.org/v2/top-headlines?language=en&pageSize=10&apiKey='
    };

    const STATE = {
        pcSearchesDone: GM_getValue('pcSearchesDone_' + new Date().toLocaleDateString(), 0),
        mobileSearchesDone: GM_getValue('mobileSearchesDone_' + new Date().toLocaleDateString(), 0),
        isMobileMode: GM_getValue('isMobileMode', false),
        isRunning: GM_getValue('isRunning', false),
        lastSearchTime: 0
    };

    let uiElements = {};

    // ---
    // Core Functionality - The Engine of Deception
    // ---

    function getRandomDelay() {
        return Math.floor(Math.random() * (CONFIG.SEARCH_DELAY_MAX - CONFIG.SEARCH_DELAY_MIN + 1)) + CONFIG.SEARCH_DELAY_MIN;
    }

    async function fetchDynamicKeywords() {
        if (!CONFIG.NEWS_API_KEY || CONFIG.NEWS_API_KEY === 'YOUR_NEWS_API_KEY') {
            console.log("No News API Key provided. Using static keywords.");
            return;
        }
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: CONFIG.NEWS_API_URL + CONFIG.NEWS_API_KEY,
                    onload: function(res) {
                        resolve(JSON.parse(res.responseText));
                    },
                    onerror: function(err) {
                        reject(err);
                    }
                });
            });

            if (response && response.articles && response.articles.length > 0) {
                const dynamicKeywords = response.articles.map(article => article.title.split(' ').slice(0, 5).join(' ')).filter(Boolean);
                CONFIG.SEARCH_KEYWORDS.unshift(...dynamicKeywords); // Add dynamic keywords to the front
                console.log("Fetched dynamic keywords.");
            }
        } catch (error) {
            console.error("Failed to fetch dynamic keywords:", error);
        }
    }

    function getRandomKeyword() {
        if (CONFIG.SEARCH_KEYWORDS.length === 0) {
            return "random search query"; // Fallback
        }
        const index = Math.floor(Math.random() * CONFIG.SEARCH_KEYWORDS.length);
        return CONFIG.SEARCH_KEYWORDS[index];
    }

    function simulateScroll() {
        const scrollAmount = Math.floor(Math.random() * (document.body.scrollHeight / 2)) + 100;
        window.scrollBy(0, scrollAmount);
        setTimeout(() => window.scrollBy(0, -scrollAmount), 500); // Scroll back up
    }

    async function clickRandomResult() {
        const links = Array.from(document.querySelectorAll('li.b_algo h2 a')).filter(a => a.href && !a.href.startsWith('javascript'));
        if (links.length === 0) return;

        const randomLink = links[Math.floor(Math.random() * links.length)];
        console.log("Clicking random search result:", randomLink.href);

        try {
            const originalURL = window.location.href;
            window.location.href = randomLink.href;
            await new Promise(resolve => setTimeout(resolve, getRandomDelay() * 2)); // Stay on page longer
            window.history.back(); // Go back to search results
            await new Promise(resolve => setTimeout(resolve, getRandomDelay())); // Wait after going back
        } catch (e) {
            console.error("Failed to click/navigate result:", e);
        }
    }

    async function performSearch() {
        const searchBox = document.getElementById('sb_form_q');
        const searchButton = document.getElementById('sb_form_go') || document.getElementById('search_icon');

        if (!searchBox || !searchButton) {
            console.error("Bing search elements not found. Retrying...");
            setTimeout(autoBingHub, getRandomDelay() * 2);
            return;
        }

        const keyword = getRandomKeyword();
        searchBox.value = keyword;
        searchButton.click();

        console.log(`Searching for: "${keyword}" in ${STATE.isMobileMode ? 'Mobile' : 'PC'} mode.`);

        // Wait for page load and simulate human behavior
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
        simulateScroll();

        if (Math.random() < 0.3) { // 30% chance to click a result
             if ((STATE.pcSearchesDone + STATE.mobileSearchesDone) % CONFIG.CLICK_RESULT_INTERVAL === 0) {
                await clickRandomResult();
             }
        }
    }

    function updateUI() {
        if (!uiElements.statusDiv) return;

        uiElements.statusDiv.textContent = `Status: ${STATE.isRunning ? 'Running' : 'Stopped'}`;
        uiElements.pcProgress.textContent = `PC: ${STATE.pcSearchesDone}/${CONFIG.PC_SEARCH_LIMIT}`;
        uiElements.mobileProgress.textContent = `Mobile: ${STATE.mobileSearchesDone}/${CONFIG.MOBILE_SEARCH_LIMIT}`;
        uiElements.startButton.textContent = STATE.isRunning ? 'Stop' : 'Start';
        uiElements.autoStartCheckbox.checked = GM_getValue('autoStart', false);
        uiElements.modeToggle.textContent = `Mode: ${STATE.isMobileMode ? 'Mobile' : 'PC'}`;
    }

    function saveState() {
        GM_setValue('pcSearchesDone_' + new Date().toLocaleDateString(), STATE.pcSearchesDone);
        GM_setValue('mobileSearchesDone_' + new Date().toLocaleDateString(), STATE.mobileSearchesDone);
        GM_setValue('isMobileMode', STATE.isMobileMode);
        GM_setValue('isRunning', STATE.isRunning);
    }

    async function autoBingHub() {
        if (!STATE.isRunning) {
            console.log("AutoBing Hub is stopped.");
            updateUI();
            return;
        }

        const now = Date.now();
        if (now - STATE.lastSearchTime < CONFIG.SEARCH_DELAY_MIN) {
            // Prevent rapid execution if script restarts quickly
            setTimeout(autoBingHub, CONFIG.SEARCH_DELAY_MIN - (now - STATE.lastSearchTime));
            return;
        }
        STATE.lastSearchTime = now;

        updateUI();

        if (STATE.isMobileMode) {
            if (STATE.mobileSearchesDone < CONFIG.MOBILE_SEARCH_LIMIT) {
                console.log(`Performing mobile search ${STATE.mobileSearchesDone + 1}/${CONFIG.MOBILE_SEARCH_LIMIT}`);
                STATE.mobileSearchesDone++;
                await performSearch();
            } else {
                console.log("Mobile searches completed for today.");
                STATE.isMobileMode = false; // Switch to PC mode or stop
                STATE.isRunning = false;
                alert('Mobile searches complete! Now switch to desktop browser for PC searches or stop.');
            }
        } else { // PC Mode
            if (STATE.pcSearchesDone < CONFIG.PC_SEARCH_LIMIT) {
                console.log(`Performing PC search ${STATE.pcSearchesDone + 1}/${CONFIG.PC_SEARCH_LIMIT}`);
                STATE.pcSearchesDone++;
                await performSearch();
            } else {
                console.log("PC searches completed for today.");
                STATE.isRunning = false;
                alert('PC searches complete! All searches done for today.');
            }
        }

        saveState();
        updateUI();

        if (STATE.isRunning) {
            setTimeout(autoBingHub, getRandomDelay());
        }
    }

    // ---
    // User Interface - A Mere Illusion
    // ---

    function createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #222;
            border: 1px solid #444;
            padding: 10px;
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #eee;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        container.innerHTML = `
            <h3 style="margin: 0 0 10px; color: #fff;">AutoBing Hub</h3>
            <div id="abh-status">Status: Stopped</div>
            <div id="abh-pc-progress">PC: 0/${CONFIG.PC_SEARCH_LIMIT}</div>
            <div id="abh-mobile-progress">Mobile: 0/${CONFIG.MOBILE_SEARCH_LIMIT}</div>
            <div style="margin-top: 10px;">
                <button id="abh-start-button" style="background: #007bff; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Start</button>
                <button id="abh-mode-toggle" style="background: #6c757d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; margin-left: 5px;">Mode: PC</button>
            </div>
            <div style="margin-top: 10px;">
                <label for="abh-autostart" style="color: #bbb;">
                    <input type="checkbox" id="abh-autostart" style="margin-right: 5px;">Auto-start on Bing
                </label>
            </div>
        `;

        document.body.appendChild(container);

        uiElements = {
            statusDiv: container.querySelector('#abh-status'),
            pcProgress: container.querySelector('#abh-pc-progress'),
            mobileProgress: container.querySelector('#abh-mobile-progress'),
            startButton: container.querySelector('#abh-start-button'),
            modeToggle: container.querySelector('#abh-mode-toggle'),
            autoStartCheckbox: container.querySelector('#abh-autostart')
        };

        uiElements.startButton.addEventListener('click', () => {
            STATE.isRunning = !STATE.isRunning;
            saveState();
            if (STATE.isRunning) {
                autoBingHub();
            } else {
                updateUI();
            }
        });

        uiElements.modeToggle.addEventListener('click', () => {
            STATE.isMobileMode = !STATE.isMobileMode;
            saveState();
            updateUI();
            alert(`Switched to ${STATE.isMobileMode ? 'Mobile' : 'PC'} mode. You might need to refresh for User-Agent change to take full effect if not using advanced Tampermonkey features.`);
        });

        uiElements.autoStartCheckbox.addEventListener('change', (e) => {
            GM_setValue('autoStart', e.target.checked);
        });

        updateUI();
    }

    // ---
    // Initialization - The Dawn of Automation
    // ---

    // Reset counts at the start of a new day
    const today = new Date().toLocaleDateString();
    if (!GM_getValue('lastRunDay') || GM_getValue('lastRunDay') !== today) {
        GM_setValue('pcSearchesDone_' + today, 0);
        GM_setValue('mobileSearchesDone_' + today, 0);
        GM_setValue('lastRunDay', today);
        STATE.pcSearchesDone = 0;
        STATE.mobileSearchesDone = 0;
    }

    createUI();
    fetchDynamicKeywords();

    if (GM_getValue('autoStart', false)) {
        STATE.isRunning = true;
        autoBingHub();
    }

})();