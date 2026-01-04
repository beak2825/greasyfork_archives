// ==UserScript==
// @name         Printer App Popup
// @namespace    http://tampermonkey.net/
// @version      1.6.4
// @description  Draggable, collapsible popup with printer cost info and a "Set Price" popup to set creditAmount to RM1, RM2, RM3. Now with Auto Submit and keystroke functionality for setting amount.
// @author       Michael S.
// @match        http://srv-printer:9191/app*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/534974/Printer%20App%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/534974/Printer%20App%20Popup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoSubmitEnabled = true;
    const MAX_HISTORY = 10;
    const USERNAME_KEY = 'creditUserHistory';
    let confirmAmount = null; // To store the amount that needs to be confirmed

    function getUserHistory() {
        return JSON.parse(localStorage.getItem(USERNAME_KEY) || '[]');
    }

    function saveUserToHistory(username) {
        let history = getUserHistory();
        history = history.filter(u => u !== username); // Remove duplicates
        history.unshift(username); // Add to top
        if (history.length > MAX_HISTORY) history.pop(); // Limit to 10
        localStorage.setItem(USERNAME_KEY, JSON.stringify(history));
        refreshHistoryList(); // Update UI
    }

    function refreshHistoryList() {
        const container = document.getElementById('usernameHistoryList');
        if (!container) return;
        container.innerHTML = '';
        const history = getUserHistory();

        if (history.length === 0) {
            const noneItem = document.createElement('div');
            noneItem.textContent = 'None';
            noneItem.style.fontStyle = 'italic';
            noneItem.style.color = '#888';
            container.appendChild(noneItem);
            return;
        }

        history.forEach(name => {
            const item = document.createElement('div');
            item.textContent = name;
            item.className = 'username-entry';
            item.addEventListener('click', () => {
                const input = document.getElementById('credit-user');
                if (input) input.value = name;
            });
            container.appendChild(item);
        });
    }

    function createPopup(title, contentId, contentHtml) {
        const popup = document.createElement('div');
        popup.id = contentId;
        popup.innerHTML = `
    <div class="popup-header" id="${contentId}Header">
        <span class="popup-title">${title}</span>
        <button class="toggle-btn" id="toggleBtn${contentId}" title="Collapse/Expand">−</button>
    </div>
    <div class="popup-content" id="${contentId}Content">
        ${contentHtml}
    </div>
`;

        document.body.appendChild(popup);
        return popup;
    }

    function applyStyles() {
        const style = document.createElement('style');
        style.textContent =
            `#cheatSheetPopup, #setPricePopup, #usernameHistoryPopup {
                position: fixed;
                top: 20px;
                background: #ffffff;
                border: 1px solid #ccc;
                border-radius: 6px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #333;
                z-index: 9999;
                user-select: none;
            }

            #cheatSheetPopup {
                right: 20px;
                width: 220px;
            }

            #setPricePopup {
                right: 20px;
                top: 150px;
                width: 220px;
            }

            #usernameHistoryPopup {
                right: 250px;
                bottom: auto;
                top: 20px;
                left: auto;
                width: 220px;
                max-height: 250px;
                overflow-y: auto;
            }

            .popup-header {
                background: #f0f0f0;
                padding: 8px 10px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ddd;
            }

            .popup-title {
                font-weight: bold;
                font-size: 14px;
            }

            .toggle-btn {
                background: #000;
                border: none;
                font-size: 18px;
                color: #fff;
                cursor: pointer;
                padding: 0 6px;
                margin-left: 10px;
                line-height: 1;
                border-radius: 3px;
                transition: background 0.3s ease;
            }

            .toggle-btn:hover {
                background: #333;
            }

            .popup-content {
                padding: 10px;
            }

            .popup-content p {
                margin: 6px 0;
            }

            .popup-content button {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 3px;
                width: 100%;
            }

            .popup-content button:hover {
                background-color: #45a049;
            }

            .auto-submit-toggle {
                margin-top: 10px;
                display: flex;
                align-items: center;
                font-size: 14px;
                cursor: pointer;
            }

            .auto-submit-toggle input {
                margin-right: 8px;
            }

            .warning-tooltip {
                position: relative;
                display: inline-block;
            }

            .warning-tooltip .tooltiptext {
                visibility: hidden;
                width: 180px;
                background-color: #555;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px;
                position: absolute;
                z-index: 10000;
                bottom: 125%;
                left: 50%;
                margin-left: -90px;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .warning-tooltip .tooltiptext::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #555 transparent transparent transparent;
            }

            .warning-tooltip:hover .tooltiptext {
                visibility: visible;
                opacity: 1;
            }

            .username-entry {
                padding: 6px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
            }

            .username-entry:hover {
                background-color: #f5f5f5;
            }
        `;
        document.head.appendChild(style);
    }

    function makeDraggable(popup, handle) {
        handle.onmousedown = function (e) {
            e.preventDefault();
            let offsetX = e.clientX - popup.getBoundingClientRect().left;
            let offsetY = e.clientY - popup.getBoundingClientRect().top;

            function mouseMoveHandler(e) {
                popup.style.left = (e.clientX - offsetX) + 'px';
                popup.style.top = (e.clientY - offsetY) + 'px';
                popup.style.right = 'auto';
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };
    }

    function setupCollapseToggle(contentId) {
        const toggleBtn = document.getElementById(`toggleBtn${contentId}`);
        const content = document.getElementById(`${contentId}Content`);

        toggleBtn.addEventListener('click', () => {
            const isCollapsed = content.style.display === 'none';
            content.style.display = isCollapsed ? 'block' : 'none';
            toggleBtn.textContent = isCollapsed ? '−' : '+';
        });
    }

    function setCreditAmount(value) {
        const creditAmountField = document.querySelector('#creditAmount, [name="creditAmount"]');

        if (creditAmountField) {
            creditAmountField.value = value;
            console.log(`Credit amount set to ${value}`);
            if (autoSubmitEnabled) {
                const submitButton = document.getElementsByName('$Submit$0')[0];
                const usernameField = document.getElementById('credit-user');
                if (usernameField) saveUserToHistory(usernameField.value || '');
                if (submitButton) {
                    submitButton.click();
                    console.log('Submit button clicked due to Auto Submit');
                } else {
                    console.warn('Submit button ($Submit$0) not found.');
                }
            }
        } else {
            console.warn("No creditAmount input field found on this page.");
        }
    }

    // New logic for keystrokes and confirmation
    function handleKeyPress(e) {
        const key = e.key;

        if (key >= 1 && key <= 5) {
            const amount = `RM${key}.00`;

            if (autoSubmitEnabled) {
                // Show confirmation popup
                const confirmationPopup = window.confirm(`Auto Submit is enabled. Are you sure you want to set the amount to ${amount}? Press the number again to confirm.`);
                if (confirmationPopup) {
                    setCreditAmount(amount);
                }
            } else {
                setCreditAmount(amount);
            }
        }
    }

    applyStyles();

    const cheatSheetPopup = createPopup("📋 Print Cost", "cheatSheetPopup",
        `<p><strong>Color:</strong> 0.80 per page</p>
        <p><strong>B.W:</strong> 0.10 per page</p>`
    );
    makeDraggable(cheatSheetPopup, document.getElementById('cheatSheetPopupHeader'));
    setupCollapseToggle("cheatSheetPopup");

    const setPricePopup = createPopup("💲 Set Price", "setPricePopup",
        `<button id="btn1RM">1RM</button>
        <button id="btn2RM">2RM</button>
        <button id="btn3RM">3RM</button>
        <button id="btn4RM">4RM</button>
        <button id="btn5RM">5RM</button>
        <label class="auto-submit-toggle">
            <input type="checkbox" id="autoSubmitCheckbox" checked />
            Auto Submit
            <span class="warning-tooltip">⚠️
                <span class="tooltiptext">Auto Submit will also click the Submit button with no undos!</span>
            </span>
        </label>`
    );

    makeDraggable(setPricePopup, document.getElementById('setPricePopupHeader'));
    setupCollapseToggle("setPricePopup");

    // ✅ Set up Auto Submit toggle logic
    const autoSubmitCheckbox = document.getElementById('autoSubmitCheckbox');
    if (autoSubmitCheckbox) {
        autoSubmitCheckbox.checked = autoSubmitEnabled;
        autoSubmitCheckbox.addEventListener('change', () => {
            autoSubmitEnabled = autoSubmitCheckbox.checked;
            console.log("Auto Submit is now", autoSubmitEnabled ? "enabled" : "disabled");
        });
    }

    const usernameHistoryPopup = createPopup("👤 Recent Users", "usernameHistoryPopup",
        `<div id="usernameHistoryList"></div>`
    );
    makeDraggable(usernameHistoryPopup, document.getElementById('usernameHistoryPopupHeader'));
    setupCollapseToggle("usernameHistoryPopup");
    refreshHistoryList();

    document.getElementById("btn1RM").addEventListener("click", () => setCreditAmount("RM1.00"));
    document.getElementById("btn2RM").addEventListener("click", () => setCreditAmount("RM2.00"));
    document.getElementById("btn3RM").addEventListener("click", () => setCreditAmount("RM3.00"));
    document.getElementById("btn4RM").addEventListener("click", () => setCreditAmount("RM4.00"));
    document.getElementById("btn5RM").addEventListener("click", () => setCreditAmount("RM5.00"));

    // Optional: Capture manual form submit
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', () => {
            const usernameField = document.getElementById('credit-user');
            if (usernameField) saveUserToHistory(usernameField.value || '');
        });
    }

    // Listen for keypresses for setting credit amounts
    document.addEventListener('keypress', handleKeyPress);
})();
