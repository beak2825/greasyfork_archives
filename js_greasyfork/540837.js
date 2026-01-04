// ==UserScript==
// @name         Conditional Auto & Manual VERIFY2 (SPA-Aware) with Modern UI
// @namespace    Violentmonkey Scripts
// @match        *://his.kaauh.org/lab/*
// @grant        none
// @version      2.6
// @author       Hamad AlShegifi
// @description  SPA-AWARE version. Features a modern UI with an animated toggle switch for the auto-verify function.
// @downloadURL https://update.greasyfork.org/scripts/540837/Conditional%20Auto%20%20Manual%20VERIFY2%20%28SPA-Aware%29%20with%20Modern%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/540837/Conditional%20Auto%20%20Manual%20VERIFY2%20%28SPA-Aware%29%20with%20Modern%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const VERIFIED1_STATUS_TEXT = 'Verified 1';
    const RESULTED_STATUS_TEXT = 'Resulted';
    const STATUS_CELL_SELECTOR = 'div[col-id="ResultStatus"]';
    const VERIFY1_BUTTON_SELECTOR = 'button.verify1-btn';
    const VERIFY2_BUTTON_SELECTOR = 'button.verify2-btn';
    const HISTORY_BUTTON_SELECTOR = 'button.backBtn[translateid="edit-lab-order.HistoryResults"]';
    const VERIFICATION_MODAL_SELECTOR = '.modal-content';
    const CHECK_INTERVAL_MS = 2000;

    // --- State Management ---
    let isAutoVerifyEnabled = true;
    let isVerificationProcessStarted = false;
    let hasAutoClicked = false;
    let autoVerifyInterval;
    let debounceTimer;

    // --- Core Logic ---
    function clickVerifyButton() {
        const verifyButton = document.querySelector(VERIFY2_BUTTON_SELECTOR);
        if (verifyButton) {
            console.log('Script Action: "VERIFY2" button found. Clicking it.');
            verifyButton.click();
        } else {
            console.log('Script Action: "VERIFY2" button not found on the page.');
        }
    }

    function hasResultedStatus() {
        const statusCells = document.querySelectorAll(STATUS_CELL_SELECTOR);
        for (const cell of statusCells) {
            if (cell.textContent && cell.textContent.trim().includes(RESULTED_STATUS_TEXT)) {
                return true;
            }
        }
        return false;
    }

    function hasVerified1Status() {
        const statusCells = document.querySelectorAll(STATUS_CELL_SELECTOR);
        for (const cell of statusCells) {
            if (cell.textContent && cell.textContent.trim().includes(VERIFIED1_STATUS_TEXT)) {
                return true;
            }
        }
        return false;
    }

    function isModalVisible() {
        const modal = document.querySelector(VERIFICATION_MODAL_SELECTOR);
        if (modal) {
            const modalTitle = modal.querySelector('h4.modal-title');
            if (modalTitle && modalTitle.textContent.trim() === 'Primary Verification') {
                return true;
            }
        }
        return false;
    }

    function runSafetyChecks() {
        if (isModalVisible()) {
            console.log('Safety Check: Blocked by modal.');
            return false;
        }
        if (hasResultedStatus()) {
            console.log(`Safety Check: Blocked by "${RESULTED_STATUS_TEXT}" status.`);
            return false;
        }
        return true;
    }

    function checkAndAutoClick() {
        if (!isAutoVerifyEnabled || !isVerificationProcessStarted || hasAutoClicked) return;
        if (!runSafetyChecks()) return;
        if (hasVerified1Status()) {
            console.log(`Auto-Verify: Found "${VERIFIED1_STATUS_TEXT}". Clicking VERIFY2.`);
            clickVerifyButton();
            hasAutoClicked = true;
        }
    }

    // --- UI Redesign and Injection ---

    function injectStyles() {
        const styleId = 'auto-verify-modern-styles';
        if (document.getElementById(styleId)) return;

        const styleSheet = document.createElement("style");
        styleSheet.id = styleId;
        styleSheet.innerText = `
            /* Modern Toggle Switch Component */
            .auto-verify-toggle {
                display: inline-flex;
                align-items: center;
                gap: 12px;
                padding: 6px 10px;
                border: 1px solid #ccc;
                border-radius: 20px;
                background-color: #f8f9fa;
                cursor: pointer;
                transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
                user-select: none;
            }
            .auto-verify-toggle.is-active {
                border-color: #7ab5ff;
                background-color: #e7f1ff;
                animation: pulse-glow 2s infinite;
            }
            .toggle-label {
                font-size: 12px;
                font-weight: 600;
                color: #333;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .toggle-switch {
                position: relative;
                width: 40px;
                height: 22px;
                background-color: #ccc;
                border-radius: 11px;
                transition: background-color 0.3s ease;
            }
            .auto-verify-toggle.is-active .toggle-switch {
                background-color: #007bff;
            }
            .toggle-thumb {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 18px;
                height: 18px;
                background-color: white;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            .auto-verify-toggle.is-active .toggle-thumb {
                transform: translateX(18px);
            }

            /* Pulse Animation for Active State */
            @keyframes pulse-glow {
                0% { box-shadow: 0 0 0 0px rgba(0, 123, 255, 0.3); }
                70% { box-shadow: 0 0 0 8px rgba(0, 123, 255, 0); }
                100% { box-shadow: 0 0 0 0px rgba(0, 123, 255, 0); }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    function updateVerifyUI() {
        // Update Modern Toggle
        const toggle = document.getElementById('autoVerifyToggleContainer');
        if (toggle) {
            if (isAutoVerifyEnabled) {
                toggle.classList.add('is-active');
            } else {
                toggle.classList.remove('is-active');
            }
        }

        // Update VERIFY2 Button
        const verify2Button = document.querySelector(VERIFY2_BUTTON_SELECTOR);
        if (verify2Button) {
            if (!verify2Button.dataset.redesigned) {
                // Set the button text ONCE, with no icon markup
                verify2Button.textContent = 'VERIFY2 (F8)';
                Object.assign(verify2Button.style, { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500', transition: 'border-color 0.3s ease' });
                verify2Button.dataset.redesigned = 'true';
            }

            // Update border color for feedback, but add no icons
            verify2Button.style.borderColor = isAutoVerifyEnabled ? '#007bff' : '';
        }
    }

    function redesignHistoryButton() {
        const historyButton = document.querySelector(HISTORY_BUTTON_SELECTOR);
        if (!historyButton || historyButton.dataset.redesigned) return;

        historyButton.innerHTML = `<span style="margin-right: 6px;">🕒</span> View History`;
        historyButton.title = "Click to view patient's full lab history";
        Object.assign(historyButton.style, { display: 'inline-flex', alignItems: 'center', fontWeight: '500' });
        historyButton.dataset.redesigned = 'true';
    }

    function injectModernToggle() {
        const historyButton = document.querySelector(HISTORY_BUTTON_SELECTOR);
        if (!historyButton || document.getElementById('autoVerifyToggleContainer')) return;

        const buttonParent = historyButton.parentElement;
        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'autoVerifyToggleContainer';
        toggleContainer.className = 'auto-verify-toggle';

        toggleContainer.innerHTML = `
            <span class="toggle-label">
                <span style="font-size: 14px;">🤖</span>
                <span>AUTO VERIFY 2</span>
            </span>
            <div class="toggle-switch">
                <div class="toggle-thumb"></div>
            </div>
        `;

        toggleContainer.addEventListener('click', () => {
            isAutoVerifyEnabled = !isAutoVerifyEnabled; // Toggle the state
            console.log(`Auto-Verify: ${isAutoVerifyEnabled ? 'ENABLED' : 'DISABLED'}.`);
            updateVerifyUI(); // Update all UI elements
        });

        Object.assign(toggleContainer.style, {
            marginRight: '15px',
            verticalAlign: 'middle'
        });

        buttonParent.insertBefore(toggleContainer, historyButton);
    }

    // --- Event Listeners and Initialization ---

    function handleKeyPress(event) {
        if (event.key === 'F8') {
            event.preventDefault();
            console.log('Hotkey: F8 pressed.');
            if (runSafetyChecks()) {
                clickVerifyButton();
            }
        }
    }

    function handlePageClick(event) {
        if (event.target.closest(VERIFY1_BUTTON_SELECTOR)) {
            isVerificationProcessStarted = true;
            hasAutoClicked = false;
            console.log('Auto-Verify: VERIFY1 clicked. Process activated.');
        }
    }

    // --- Script Start ---
    console.log('Conditional Auto & Manual VERIFY2 (SPA-Aware) script with Modern UI loaded.');
    injectStyles();

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handlePageClick);
    autoVerifyInterval = setInterval(checkAndAutoClick, CHECK_INTERVAL_MS);

    const spaObserver = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            injectModernToggle();
            redesignHistoryButton();
            updateVerifyUI();
        }, 150);
    });

    spaObserver.observe(document.body, { childList: true, subtree: true });
    console.log('SPA-aware observer started.');

    // Initial run to place elements
    setTimeout(() => {
        injectModernToggle();
        redesignHistoryButton();
        updateVerifyUI();
    }, 150);
})();