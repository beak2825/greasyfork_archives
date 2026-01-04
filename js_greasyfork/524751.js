// ==UserScript==
// @name         Deepseek Privacy
// @namespace    https://github.com/landifrancesco/Deepseek-Privacy
// @version      1
// @description  Hide and replace sensitive data on the chat interface with a user-friendly UI.
// @author       Francesco Landi
// @match        https://chat.deepseek.com/a/chat/s/*
// @grant        GM_addStyle
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/525247/Deepseek%20Privacy.user.js
// @updateURL https://update.greasyfork.org/scripts/525247/Deepseek%20Privacy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load saved sensitive data from localStorage
    let sensitiveData = JSON.parse(localStorage.getItem('sensitiveData')) || {};
    let caseSensitive = JSON.parse(localStorage.getItem('caseSensitive')) || false;

    // Function to replace sensitive data
    function replaceSensitiveData() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;

        while (node = walker.nextNode()) {
            // Skip if the node is within the popup
            if (node.parentElement.closest('#sensitiveDataPopup')) continue;

            let text = node.nodeValue;

            // Replace each sensitive word
            for (const [word, replacement] of Object.entries(sensitiveData)) {
                const regex = new RegExp(word, caseSensitive ? "g" : "gi"); // Use "g" or "gi" based on caseSensitive
                text = text.replace(regex, replacement);
            }

            node.nodeValue = text;
        }
    }

    // Function to detect the page theme
    function detectTheme() {
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
            const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
            return brightness > 128 ? 'light' : 'dark';
        }
        return 'light'; // Default to light theme if detection fails
    }

    // Function to create the lock icon and popup UI
    function createUI() {
        const theme = detectTheme();
        const isDarkTheme = theme === 'dark';

        // Add styles for the lock icon and popup
        GM_addStyle(`
            #sensitiveDataLock {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1000;
                cursor: pointer;
                font-size: 24px;
                color: ${isDarkTheme ? '#fff' : '#555'};
            }
            #sensitiveDataPopup {
                display: none;
                position: fixed;
                top: 50px;
                right: 10px;
                z-index: 1000;
                background: ${isDarkTheme ? '#333' : '#fff'};
                border: 1px solid ${isDarkTheme ? '#555' : '#ccc'};
                padding: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                width: 300px;
                color: ${isDarkTheme ? '#fff' : '#000'};
            }
            #sensitiveDataPopup input {
                width: 100%;
                margin-bottom: 10px;
                padding: 5px;
                background: ${isDarkTheme ? '#444' : '#fff'};
                color: ${isDarkTheme ? '#fff' : '#000'};
                border: 1px solid ${isDarkTheme ? '#555' : '#ccc'};
            }
            #sensitiveDataPopup button {
                padding: 5px 10px;
                margin-right: 5px;
                background: ${isDarkTheme ? '#555' : '#eee'};
                color: ${isDarkTheme ? '#fff' : '#000'};
                border: 1px solid ${isDarkTheme ? '#666' : '#ccc'};
                cursor: pointer;
            }
            #sensitiveDataList {
                max-height: 200px;
                overflow-y: auto;
                margin-bottom: 10px;
            }
            .case-sensitive-container {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .case-sensitive-container label {
                margin-left: 5px;
            }
        `);

        // Create the lock icon
        const lockIcon = document.createElement('div');
        lockIcon.id = 'sensitiveDataLock';
        lockIcon.innerHTML = '🔒';
        document.body.appendChild(lockIcon);

        // Create the popup
        const popup = document.createElement('div');
        popup.id = 'sensitiveDataPopup';
        popup.innerHTML = `
            <h3>Sensitive Data Hider</h3>
            <input id="sensitiveWordInput" placeholder="Sensitive Word">
            <input id="replacementInput" placeholder="Replacement">
            <div class="case-sensitive-container">
                <input type="checkbox" id="caseSensitiveCheckbox">
                <label for="caseSensitiveCheckbox">Case Sensitive</label>
            </div>
            <button id="addSensitiveData">Add</button>
            <div id="sensitiveDataList"></div>
            <button id="closePopup">Close</button>
        `;
        document.body.appendChild(popup);

        // Toggle popup visibility
        lockIcon.addEventListener('click', () => {
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
            updateSensitiveDataList();
            // Update the checkbox state when the popup is opened
            document.getElementById('caseSensitiveCheckbox').checked = caseSensitive;
        });

        // Close popup
        document.getElementById('closePopup').addEventListener('click', () => {
            popup.style.display = 'none';
        });

        // Add new sensitive word and replacement
        document.getElementById('addSensitiveData').addEventListener('click', () => {
            const word = document.getElementById('sensitiveWordInput').value.trim();
            const replacement = document.getElementById('replacementInput').value.trim();

            if (word && replacement) {
                sensitiveData[word] = replacement;
                localStorage.setItem('sensitiveData', JSON.stringify(sensitiveData));
                updateSensitiveDataList();
                replaceSensitiveData();
                document.getElementById('sensitiveWordInput').value = '';
                document.getElementById('replacementInput').value = '';
            }
        });

        // Update the list of sensitive words and replacements
        function updateSensitiveDataList() {
            const list = document.getElementById('sensitiveDataList');
            list.innerHTML = Object.entries(sensitiveData)
                .map(([word, replacement]) => `
                    <div>
                        <strong>${word}</strong> → ${replacement}
                        <button data-word="${word}" class="removeButton">Remove</button>
                    </div>
                `)
                .join('');

            // Add event listeners to the remove buttons
            document.querySelectorAll('.removeButton').forEach(button => {
                button.addEventListener('click', () => {
                    const word = button.getAttribute('data-word');
                    removeSensitiveData(word);
                });
            });
        }

        // Remove a sensitive word and replacement
        function removeSensitiveData(word) {
            delete sensitiveData[word];
            localStorage.setItem('sensitiveData', JSON.stringify(sensitiveData));
            updateSensitiveDataList();
            replaceSensitiveData();
        }

        // Toggle case sensitivity
        document.getElementById('caseSensitiveCheckbox').addEventListener('change', (event) => {
            caseSensitive = event.target.checked;
            localStorage.setItem('caseSensitive', JSON.stringify(caseSensitive));
            replaceSensitiveData(); // Reapply replacements with the new case sensitivity setting
        });

        // Initialize the checkbox state
        document.getElementById('caseSensitiveCheckbox').checked = caseSensitive;
    }

    // Initialize the UI and replace sensitive data
    createUI();
    replaceSensitiveData();

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver(replaceSensitiveData);
    observer.observe(document.body, { childList: true, subtree: true });
})();