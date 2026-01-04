// ==UserScript==
// @name         Bing Random Search Bot
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Auto search random words on Bing based on search results with a start button and settings
// @author       YAD
// @license      MIT
// @icon         https://logos-world.net/wp-content/uploads/2021/02/Bing-Emblem.png
// @match        https://www.bing.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/514046/Bing%20Random%20Search%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/514046/Bing%20Random%20Search%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchCount = GM_getValue('searchCount', 0);
    let maxSearches = GM_getValue('maxSearches', 5);
    let startWord = GM_getValue('startWord', 'technology');
    let isRunning = GM_getValue('isRunning', false);
    let previousSearches = GM_getValue('previousSearches', []); // Store previous searches

    const additives = ["ly", "ed", "ing", "ion", "s"]; // Common endings

    // Add Start/Stop button
    const controlButton = document.createElement('button');
    controlButton.textContent = isRunning ? `🤚 (${searchCount})` : `🔎`;
    controlButton.style.position = 'fixed';
    controlButton.style.top = '100px';
    controlButton.style.right = '0px';
    controlButton.style.zIndex = '9999';
    controlButton.style.padding = '10px';
    controlButton.style.fontSize = '10px';
    controlButton.style.backgroundColor = '#11428c';
    controlButton.style.color = 'white';
    controlButton.style.borderRadius = '25px 0 0 25px';
    controlButton.style.textShadow = '0px 0px 3px #fff';
    controlButton.style.border = 'none';
    controlButton.style.cursor = 'pointer';
    document.body.appendChild(controlButton);

    // Add settings modal
    const settingsModal = document.createElement('div');
    settingsModal.innerHTML = `
        <div style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background:white;padding:20px;border:1px solid black;width:320px;">
            <h3>Settings</h3>
            <label>Number of Searches:</label>
            <input type="number" id="maxSearchesInput" value="${maxSearches}" style="width:100%; margin-bottom:10px;">
            <label>Start Word:</label>
            <input type="text" id="startWordInput" value="${startWord}" style="width:95%; margin-bottom:10px;">
            <button id="saveSettings" style="padding:10px; background-color:#4CAF50; color:white;">Save</button>
            <button id="closeSettings" style="padding:10px; margin-left:10px;">Close</button>
            <button id="clearCache" style="padding:10px; margin-top:10px; background-color:#f44336; color:white;">Reset</button>
        </div>`;
    document.body.appendChild(settingsModal);

    const modal = settingsModal.querySelector('div');
    const maxSearchesInput = settingsModal.querySelector('#maxSearchesInput');
    const startWordInput = settingsModal.querySelector('#startWordInput');
    const saveButton = settingsModal.querySelector('#saveSettings');
    const closeButton = settingsModal.querySelector('#closeSettings');
    const clearCacheButton = settingsModal.querySelector('#clearCache');

    controlButton.addEventListener('click', () => {
        if (isRunning) {
            stopSearching();
        } else {
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        }
    });

    saveButton.addEventListener('click', () => {
        maxSearches = Math.max(1, parseInt(maxSearchesInput.value));
        startWord = startWordInput.value;
        GM_setValue('maxSearches', maxSearches);
        GM_setValue('startWord', startWord);
        modal.style.display = 'none';
        previousSearches = []; // Reset previous searches
        GM_setValue('previousSearches', previousSearches); // Store new empty history
        startSearching();
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    clearCacheButton.addEventListener('click', () => {
        GM_deleteValue('searchCount');
        GM_deleteValue('maxSearches');
        GM_deleteValue('startWord');
        GM_deleteValue('isRunning');
        GM_deleteValue('previousSearches');
        alert('Reset Done! Reload the page!');
        searchCount = 0;
        maxSearches = 5;
        startWord = 'technology';
        previousSearches = [];
        controlButton.textContent = `🔎`; // Reset button text
    });

    function startSearching() {
        if (isRunning) return;
        isRunning = true;
        GM_setValue('isRunning', true);
        searchCount = 0;
        GM_setValue('searchCount', searchCount);
        updateControlButtonText();
        performSearch(startWord);
    }

    function stopSearching() {
        isRunning = false;
        GM_setValue('isRunning', false);
        controlButton.textContent = `🔎`;
    }

    function updateControlButtonText() {
        controlButton.textContent = `🔎 (${searchCount})`;
    }

    function performSearch(word) {
        if (!isRunning || searchCount >= maxSearches) {
            stopSearching();
            return;
        }

        searchCount++;
        GM_setValue('searchCount', searchCount);
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(word.replace(/[^\w\s]/g, ""))}`;
        window.location.href = searchUrl;
    }

    if (isRunning && searchCount < maxSearches) {
        setTimeout(() => {
            const results = document.querySelectorAll('.b_algo h2 a');
            if (results.length > 0) {
                let uniqueWords = [];
                results.forEach(result => {
                    const words = result.textContent.split(' ').map(word => word.toLowerCase());
                    uniqueWords.push(...words);
                });

                uniqueWords = uniqueWords.filter(word =>
                    !previousSearches.includes(word) &&
                    !['stop', 'pause'].includes(word)
                );

                const selectedWords = [];
                while (selectedWords.length < 2) {
                    const word = uniqueWords[Math.floor(Math.random() * uniqueWords.length)];
                    if (!selectedWords.includes(word)) {
                        const hasAdditive = additives.some(additive => word.endsWith(additive));
                        selectedWords.push(word);
                        if (hasAdditive && uniqueWords.length > 1) {
                            selectedWords.push(uniqueWords.find(w => w !== word) || "");
                        }
                    }
                }
                const newSearchTerm = selectedWords.join(' ');
                previousSearches.push(...selectedWords);
                GM_setValue('previousSearches', previousSearches);
                updateControlButtonText();
                performSearch(newSearchTerm);
            } else {
                stopSearching();
            }
        }, 4000);
    }
})();
