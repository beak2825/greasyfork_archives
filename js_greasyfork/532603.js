// ==UserScript==
// @name         Playground.ru Prize Game Helper (with Auto-Confirm)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Помогает нажимать на мешочки/ветки в призовой игре Playground.ru. Включает ОПЦИОНАЛЬНОЕ автоподтверждение ветки. Используйте с особой осторожностью!
// @author       YourName
// @match        https://www.playground.ru/bonus/prizes/*-*
// @license MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/532603/Playgroundru%20Prize%20Game%20Helper%20%28with%20Auto-Confirm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532603/Playgroundru%20Prize%20Game%20Helper%20%28with%20Auto-Confirm%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DEFAULT_DELAY_MS = 2500; // Default delay between clicks in milliseconds
    const MIN_DELAY_MS = 500;     // Minimum allowed delay
    const CONFIRM_CLICK_DELAY_MS = 400; // Delay before clicking the confirmation button

    // --- State Variables ---
    let autoClickInterval = null;
    let isAutoClickingCell = false;
    let isAutoClickingBranch = false;
    let clickDelay = parseInt(GM_getValue('pgPrizeClickDelay', DEFAULT_DELAY_MS.toString()), 10);
    let autoConfirmBranch = GM_getValue('pgPrizeAutoConfirm', false); // <<< New State for Auto-Confirm

    if (isNaN(clickDelay) || clickDelay < MIN_DELAY_MS) {
        clickDelay = DEFAULT_DELAY_MS;
    }

    // --- UI Elements ---
    let statusDiv = null;
    let stopButton = null;
    let autoCellButton = null;
    let autoBranchButton = null;
    let delayInput = null;
    let autoConfirmCheckbox = null; // <<< New UI Element

    // --- CSS Styles ---
    GM_addStyle(`
        #pgHelperPanel {
            position: fixed;
            bottom: 15px;
            left: 15px;
            background-color: rgba(40, 40, 40, 0.88); /* Slightly darker */
            border: 1px solid #777;
            border-radius: 6px;
            padding: 12px 15px; /* More padding */
            z-index: 10001; /* Ensure it's above most elements */
            color: #eee;
            font-family: 'Roboto Condensed', Arial, sans-serif;
            font-size: 13px;
            min-width: 220px; /* Wider */
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            /* Dark Reader Compatibility Hints */
            --darkreader-inline-bgcolor: rgba(40, 40, 40, 0.88);
            --darkreader-inline-border-top: #555;
            --darkreader-inline-border-right: #555;
            --darkreader-inline-border-bottom: #555;
            --darkreader-inline-border-left: #555;
            --darkreader-inline-color: #ddd;
            --darkreader-inline-boxshadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        #pgHelperPanel button {
            background-color: #606060;
            color: white;
            border: 1px solid #888;
            padding: 6px 12px;
            margin: 6px 3px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            transition: background-color 0.2s ease;
             /* Dark Reader */
            --darkreader-inline-bgcolor: #4a4a4a;
            --darkreader-inline-color: #e8e6e3;
            --darkreader-inline-border-top: #6a6a6a;
            --darkreader-inline-border-right: #6a6a6a;
            --darkreader-inline-border-bottom: #6a6a6a;
            --darkreader-inline-border-left: #6a6a6a;
        }
         #pgHelperPanel button:hover:not(:disabled) {
            background-color: #777;
             /* Dark Reader */
            --darkreader-inline-bgcolor: #5c5c5c;
        }
        #pgHelperPanel button.active:not(:disabled) {
            background-color: #c04040; /* Red when active */
             /* Dark Reader */
            --darkreader-inline-bgcolor: #a03030;
             border-color: #d05050;
             --darkreader-inline-border-top: #b04040;
             --darkreader-inline-border-right: #b04040;
             --darkreader-inline-border-bottom: #b04040;
             --darkreader-inline-border-left: #b04040;
        }
        #pgHelperPanel button:disabled {
            background-color: #444;
            cursor: not-allowed;
            opacity: 0.7;
            /* Dark Reader */
             --darkreader-inline-bgcolor: #333;
        }
        #pgHelperStatus {
            margin-top: 8px;
            font-weight: bold;
            min-height: 16px;
            color: #ffcc66; /* Amber status color */
            /* Dark Reader */
            --darkreader-inline-color: #ffcc66;
        }
        #pgHelperDelayInput {
            width: 60px;
            margin: 0 6px 0 0; /* Adjust margin */
            padding: 3px 5px;
            background-color: #f0f0f0;
            border: 1px solid #aaa;
            color: #222;
            border-radius: 3px;
            font-size: 12px;
            text-align: right;
             /* Dark Reader */
             --darkreader-inline-bgcolor: #2b2e2f;
             --darkreader-inline-border-top: #7e7468;
             --darkreader-inline-border-right: #7e7468;
             --darkreader-inline-border-bottom: #7e7468;
             --darkreader-inline-border-left: #7e7468;
             --darkreader-inline-color: #dcd8d3;
        }
         #pgHelperPanel label {
             vertical-align: middle;
             margin-right: 4px;
         }
         #pgHelperAutoConfirmDiv {
            margin-top: 8px;
            border-top: 1px dashed #666; /* Separator */
            padding-top: 8px;
             /* Dark Reader */
            --darkreader-inline-border-top: #4a4a4a;
         }
         #pgHelperAutoConfirmDiv label {
             color: #ff8080; /* Warning color */
             font-weight: bold;
             /* Dark Reader */
            --darkreader-inline-color: #ff6666;
         }
         #pgHelperAutoConfirm {
             vertical-align: middle;
             margin-right: 5px;
         }
    `);

    // --- UI Creation ---
    function createControlPanel() {
        if (document.getElementById('pgHelperPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'pgHelperPanel';

        // Status Display
        statusDiv = document.createElement('div');
        statusDiv.id = 'pgHelperStatus';
        statusDiv.textContent = 'Idle';

        // Action Buttons
        autoCellButton = document.createElement('button');
        autoCellButton.id = 'pgAutoCellBtn';
        autoCellButton.textContent = 'Auto-Open Cell';
        autoCellButton.title = 'Automatically clicks the first available single pouch (cost: 100)';
        autoCellButton.onclick = startAutoClickCell;

        autoBranchButton = document.createElement('button');
        autoBranchButton.id = 'pgAutoBranchBtn';
        autoBranchButton.textContent = 'Auto-Open Branch';
        autoBranchButton.title = 'Automatically clicks the first available branch (tower, chest, etc.)';
        autoBranchButton.onclick = startAutoClickBranch;

        stopButton = document.createElement('button');
        stopButton.id = 'pgStopBtn';
        stopButton.textContent = 'STOP';
        stopButton.onclick = stopAutoClick;
        stopButton.disabled = true;

        // Delay Setting
        const delayDiv = document.createElement('div');
        delayDiv.style.marginTop = '8px';
        const delayLabel = document.createElement('label');
        delayLabel.htmlFor = 'pgHelperDelayInput';
        delayLabel.textContent = 'Delay (ms):';
        delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.id = 'pgHelperDelayInput';
        delayInput.value = clickDelay;
        delayInput.min = MIN_DELAY_MS.toString();
        delayInput.step = "100";
        delayInput.onchange = () => {
            let val = parseInt(delayInput.value, 10);
            if (isNaN(val) || val < MIN_DELAY_MS) {
                val = MIN_DELAY_MS;
                delayInput.value = val;
            }
            clickDelay = val;
            GM_setValue('pgPrizeClickDelay', clickDelay);
            console.log(`Helper: Click delay set to ${clickDelay}ms`);
        };
        delayInput.onkeyup = delayInput.onchange;
        delayDiv.appendChild(delayLabel);
        delayDiv.appendChild(delayInput);

        // <<< Auto-Confirm Checkbox >>>
        const autoConfirmDiv = document.createElement('div');
        autoConfirmDiv.id = 'pgHelperAutoConfirmDiv';
        const autoConfirmLabel = document.createElement('label');
        autoConfirmLabel.htmlFor = 'pgHelperAutoConfirm';
        autoConfirmLabel.textContent = 'Auto-Confirm Branch?';
        autoConfirmLabel.title = 'WARNING: Automatically clicks "Continue" on branch confirmation modals. Use with EXTREME caution!';
        autoConfirmCheckbox = document.createElement('input');
        autoConfirmCheckbox.type = 'checkbox';
        autoConfirmCheckbox.id = 'pgHelperAutoConfirm';
        autoConfirmCheckbox.checked = autoConfirmBranch;
        autoConfirmCheckbox.onchange = () => {
            autoConfirmBranch = autoConfirmCheckbox.checked;
            GM_setValue('pgPrizeAutoConfirm', autoConfirmBranch);
            console.log(`Helper: Auto-Confirm Branch set to ${autoConfirmBranch}`);
        };
        autoConfirmDiv.appendChild(autoConfirmCheckbox);
        autoConfirmDiv.appendChild(autoConfirmLabel);


        // Assemble Panel
        panel.appendChild(autoCellButton);
        panel.appendChild(autoBranchButton);
        panel.appendChild(stopButton);
        panel.appendChild(delayDiv);
        panel.appendChild(autoConfirmDiv); // <<< Add new checkbox div
        panel.appendChild(statusDiv);

        document.body.appendChild(panel);
        console.log("Helper: Control Panel created.");
    }

    // --- Core Logic ---
    function updateStatus(text, isRunning = false) {
        if (statusDiv) statusDiv.textContent = text;
        const anyButtonClickable = !!(findClickableCell() || findClickableBranch());

        if (stopButton) stopButton.disabled = !isRunning;
        if (autoCellButton) {
             autoCellButton.disabled = isRunning || !anyButtonClickable;
             autoCellButton.classList.toggle('active', isAutoClickingCell && isRunning);
        }
        if (autoBranchButton) {
            autoBranchButton.disabled = isRunning || !anyButtonClickable;
            autoBranchButton.classList.toggle('active', isAutoClickingBranch && isRunning);
        }
         if (delayInput) delayInput.disabled = isRunning;
         if (autoConfirmCheckbox) autoConfirmCheckbox.disabled = isRunning; // <<< Disable checkbox when running

        // Special case: if stopped because nothing was found, re-enable buttons
        if (!isRunning && (text.includes("No cells found") || text.includes("No branches found"))) {
             if (autoCellButton) autoCellButton.disabled = !anyButtonClickable;
             if (autoBranchButton) autoBranchButton.disabled = !anyButtonClickable;
             if (delayInput) delayInput.disabled = false;
             if (autoConfirmCheckbox) autoConfirmCheckbox.disabled = false; // <<< Re-enable checkbox
        }
    }

    function stopAutoClick(reason = "Manual stop") {
        if (!isAutoClickingCell && !isAutoClickingBranch) return;

        console.log(`Helper: Stopping Auto-Click. Reason: ${reason}`);
        if (autoClickInterval) {
            clearTimeout(autoClickInterval);
            autoClickInterval = null;
        }
        isAutoClickingCell = false;
        isAutoClickingBranch = false;
        updateStatus(`Stopped (${reason})`, false);
    }

    function startAutoClickCell() {
        if (isAutoClickingCell || isAutoClickingBranch) return;
        console.log("Helper: Starting Auto-Click Cell...");
        isAutoClickingCell = true;
        isAutoClickingBranch = false;
        updateStatus('Starting Cells...', true);
        scheduleNextClick();
    }

    function startAutoClickBranch() {
        if (isAutoClickingCell || isAutoClickingBranch) return;
        console.log(`Helper: Starting Auto-Click Branch (Auto-Confirm: ${autoConfirmBranch})...`);
        isAutoClickingCell = false;
        isAutoClickingBranch = true;
        updateStatus('Starting Branches...', true);
        scheduleNextClick();
    }

    function scheduleNextClick() {
        if (autoClickInterval) {
            clearTimeout(autoClickInterval);
        }
        if (isAutoClickingCell || isAutoClickingBranch) {
            // Use the configured delay for the next check/click attempt
            autoClickInterval = setTimeout(performAutoClick, clickDelay);
        }
    }

    function findClickableCell() {
         return document.querySelector(
            '.bonusgame-card.flip-card.pouch:not(.open):not(.opened-auto):not(.flip-animation) .action-button:not(.disable)'
        );
    }

    function findClickableBranch() {
        return document.querySelector(
            '.bonusgame-card.flip-card:not(.pouch):not(.open):not(.opened-auto):not(.flip-animation) .bonusgame-card-pack-unlock:not(.disable)'
        );
    }

    function performAutoClick() {
        if (!isAutoClickingCell && !isAutoClickingBranch) return; // Stopped check

        // 1. Check for blocking modals FIRST
        const modalActive = document.querySelector('.bonusgame-modal-window.active');
        if (modalActive) {
            const continueButton = modalActive.querySelector('.btn.btn-proceed');
            const cancelButton = modalActive.querySelector('.btn.btn-cancel'); // Help identify the specific modal
            const isConfirmationModal = !!(continueButton && cancelButton && modalActive.textContent.includes('Вы собираетесь открыть'));

            // <<< Auto-Confirm Logic >>>
            if (isAutoClickingBranch && autoConfirmBranch && isConfirmationModal) {
                updateStatus('Auto-Confirming Branch...', true);
                console.log('Helper: Found branch confirmation modal, attempting auto-click "Продолжить"...');
                // Add a short delay before clicking confirm
                setTimeout(() => {
                    if (continueButton && document.body.contains(continueButton)) { // Check if button still exists
                       console.log("Helper: Clicking 'Продолжить'");
                       continueButton.click();
                       // IMPORTANT: Schedule the next check *immediately* after the click attempt.
                       // Don't wait for the modal to disappear here. The next check will handle the new state.
                       scheduleNextClick();
                    } else {
                         console.log("Helper: 'Продолжить' button disappeared before click.");
                         scheduleNextClick(); // Continue checking state
                    }
                }, CONFIRM_CLICK_DELAY_MS);
                return; // <<< Exit performAutoClick for this cycle, confirmation attempt is underway.
            } else {
                // It's a different modal (error, win, etc.) OR auto-confirm is off
                const modalType = modalActive.querySelector('[class*="bonusgame-modal-content"] > div:first-child')?.className || 'unknown';
                console.log(`Helper: Modal detected (${modalType}), pausing auto-click.`);
                updateStatus(`Paused (Modal Active)`, true);
                scheduleNextClick(); // Keep checking, but don't click anything else
                return; // <<< Exit performAutoClick for this cycle
            }
        } // <<< End Modal Check

        // 2. Check if the game container is still present
        const gameWrapper = document.getElementById('prizeGameWrapper');
        if (!gameWrapper || !gameWrapper.querySelector('.bonusgame-canvas')) {
             stopAutoClick("Game wrapper missing");
             return;
        }

        // 3. Find the target button based on mode (only if no modal was active)
        let targetButton = null;
        let clickType = "";

        if (isAutoClickingCell) {
            targetButton = findClickableCell();
            clickType = "Cell";
        } else if (isAutoClickingBranch) {
            targetButton = findClickableBranch();
            clickType = "Branch";
        }

        // 4. Perform the click or handle "not found"
        if (targetButton) {
            console.log(`Helper: Found clickable ${clickType}, clicking...`, targetButton);
            updateStatus(`Clicking ${clickType}...`, true);
            targetButton.click();
            scheduleNextClick(); // Click successful, schedule the next one
        } else {
            const statusMsg = isAutoClickingCell ? 'No cells found' : 'No branches found';
            console.log(`Helper: ${statusMsg} in current view.`);
            updateStatus(`${statusMsg} (Waiting)`, true);
            scheduleNextClick(); // Keep checking
        }
    }

    // --- Initialization ---
    function initializeHelper() {
        const observer = new MutationObserver((mutationsList, obs) => {
            const gameContainer = document.getElementById('prizeGameWrapper');
            // Check if the control panel doesn't exist yet AND the game container is ready
            if (!document.getElementById('pgHelperPanel') && gameContainer && gameContainer.querySelector('.bonusgame-canvas')) {
                console.log("Helper: Game container loaded.");
                createControlPanel();
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const gameContainer = document.getElementById('prizeGameWrapper');
         if (!document.getElementById('pgHelperPanel') && gameContainer && gameContainer.querySelector('.bonusgame-canvas')) {
             console.log("Helper: Game container found immediately.");
             createControlPanel();
             observer.disconnect();
         } else if (!document.getElementById('pgHelperPanel')) {
             console.log("Helper: Waiting for game container...");
         }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHelper);
    } else {
        initializeHelper();
    }

})();