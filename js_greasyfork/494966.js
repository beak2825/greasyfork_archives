// ==UserScript==
// @name         Twitch Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.5.5
// @description  Automatically claim channel points, enable theater mode, claim prime rewards, claim drops, and add redeem buttons for GOG and Legacy Games on Twitch and Amazon Gaming websites.
// @author       JJJ
// @match        https://www.twitch.tv/*
// @match        https://gaming.amazon.com/*
// @match        https://luna.amazon.com/*
// @match        https://www.twitch.tv/drops/inventory*
// @match        https://www.gog.com/en/redeem
// @match        https://promo.legacygames.com/*
// @icon         https://th.bing.com/th/id/R.d71be224f193da01e7e499165a8981c5?rik=uBYlAxJ4XyXmJg&riu=http%3a%2f%2fpngimg.com%2fuploads%2ftwitch%2ftwitch_PNG28.png&ehk=PMc5m5Fil%2bhyq1zilk3F3cuzxSluXFBE80XgxVIG0rM%3d&risl=&pid=ImgRaw&r=0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494966/Twitch%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/494966/Twitch%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration settings
    const CONFIG = {
        enableAutoClaimPoints: GM_getValue('enableAutoClaimPoints', true),
        enableTheaterMode: GM_getValue('enableTheaterMode', true),
        enableClaimPrimeRewards: GM_getValue('enableClaimPrimeRewards', true),
        enableClaimDrops: GM_getValue('enableClaimDrops', true),
        enableGogRedeemButton: GM_getValue('enableGogRedeemButton', true),
        enableLegacyGamesRedeemButton: GM_getValue('enableLegacyGamesRedeemButton', true),
        enableHideGlobalMenu: GM_getValue('enableHideGlobalMenu', true),
        enableAutoRefreshDrops: GM_getValue('enableAutoRefreshDrops', true),
        enableClaimAllButton: GM_getValue('enableClaimAllButton', true),
        enableRemoveAllButton: GM_getValue('enableRemoveAllButton', true),
        settingsKey: GM_getValue('settingsKey', 'F2') // Default to F2 if not set
    };

    // Add logger configuration
    const Logger = {
        styles: {
            info: 'color: #2196F3; font-weight: bold',
            warning: 'color: #FFC107; font-weight: bold',
            success: 'color: #4CAF50; font-weight: bold',
            error: 'color: #F44336; font-weight: bold'
        },
        prefix: '[TwitchEnhancements]',
        getTimestamp() {
            return new Date().toISOString().split('T')[1].slice(0, -1);
        },
        info(msg) {
            console.log(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.info);
        },
        warning(msg) {
            console.warn(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.warning);
        },
        success(msg) {
            console.log(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.success);
        },
        error(msg) {
            console.error(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.error);
        }
    };

    // Twitch Constants
    const PLAYER_SELECTOR = '.video-player';
    const THEATER_MODE_BUTTON_SELECTOR = [
        'button[aria-label="Modo cine (alt+t)"]',
        'button[aria-label="Theatre Mode (alt+t)"]',
        'button[aria-label="Theater Mode (alt+t)"]'
    ].join(',');
    const CLOSE_MENU_BUTTON_SELECTOR = [
        'button[aria-label="Close Menu"]',
        'button[aria-label="Cerrar Menú"]'
    ].join(',');
    const CLOSE_MODAL_BUTTON_SELECTOR = [
        'button[aria-label="Close modal"]',
        'button[aria-label="Cerrar modal"]'
    ].join(',');
    const THEATER_MODE_CLASS = 'theatre-mode';
    const CLAIMABLE_BONUS_SELECTOR = '.claimable-bonus__icon';
    const CLAIM_DROPS_SELECTOR = [
        'button.ScCoreButton-sc-ocjdkq-0.eWlfQB',
        'button[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]'
    ].join(',');
    const PRIME_REWARD_SELECTOR = [
        'button.tw-interactive.tw-button.tw-button--full-width[data-a-target="buy-box_call-to-action"] span.tw-button__text div.tw-inline-block p.tw-font-size-5.tw-md-font-size-4[title="Get game"]',
        'button.tw-interactive.tw-button.tw-button--full-width[data-a-target="buy-box_call-to-action"] span.tw-button__text div.tw-inline-block p.tw-font-size-5.tw-md-font-size-4[title="Obtener juego"]',
        'p.tw-font-size-5.tw-md-font-size-4[data-a-target="buy-box_call-to-action-text"][title="Get game"]',
        'p.tw-font-size-5.tw-md-font-size-4[data-a-target="buy-box_call-to-action-text"][title="Obtener juego"]'
    ].join(',');

    // Redeem on GOG Constants
    const GOG_REDEEM_CODE_INPUT_SELECTOR = '#codeInput';
    const GOG_CONTINUE_BUTTON_SELECTOR = 'button[type="submit"][aria-label="Proceed to the next step"]';
    const GOG_FINAL_REDEEM_BUTTON_SELECTOR = 'button[type="submit"][aria-label="Redeem the code"]';

    // Redeem on Legacy Games Constants
    const LEGACY_GAMES_REDEEM_URL = 'https://promo.legacygames.com/gallery-of-things-reveries-prime-deal/';
    const LEGACY_GAMES_CODE_INPUT_SELECTOR = '#primedeal_game_code';
    const LEGACY_GAMES_EMAIL_INPUT_SELECTOR = '#primedeal_email';
    const LEGACY_GAMES_EMAIL_VALIDATE_INPUT_SELECTOR = '#primedeal_email_validate';
    const LEGACY_GAMES_SUBMIT_BUTTON_SELECTOR = '#submitbutton';
    const LEGACY_GAMES_NEWSLETTER_CHECKBOX_SELECTOR = '#primedeal_newsletter';

    let claiming = false;

    // Check if MutationObserver is supported
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    // Settings Dialog Functions
    function createSettingsDialog() {
        const dialogHTML = `
            <div id="twitchEnhancementsDialog" class="te-dialog">
                <h3>Twitch Enhancements Settings</h3>
                ${createToggle('enableAutoClaimPoints', 'Auto Claim Channel Points', 'Automatically claim channel points')}
                ${createToggle('enableTheaterMode', 'Auto Theater Mode', 'Automatically enable theater mode')}
                ${createToggle('enableClaimPrimeRewards', 'Auto Claim Prime Rewards', 'Automatically claim prime rewards')}
                ${createToggle('enableClaimDrops', 'Auto Claim Drops', 'Automatically claim Twitch drops')}
                ${createToggle('enableGogRedeemButton', 'GOG Redeem Button', 'Add GOG redeem button on Amazon Gaming')}
                ${createToggle('enableLegacyGamesRedeemButton', 'Legacy Games Button', 'Add Legacy Games redeem button on Amazon Gaming')}
                ${createToggle('enableHideGlobalMenu', 'Hide Global Menu', 'Hide the global menu on Twitch')}
                ${createToggle('enableAutoRefreshDrops', 'Auto Refresh Drops', 'Automatically refresh drops inventory page every 15 minutes')}
                ${createToggle('enableClaimAllButton', 'Enable Claim All Button', 'Add Claim All button on Amazon Gaming')}
                ${createToggle('enableRemoveAllButton', 'Enable Remove All Button', 'Add Remove All button on Amazon Gaming')}
                <div class="te-key-setting">
                    <label for="settingsKey" class="te-key-label">Settings Toggle Key:</label>
                    <div class="te-key-input-container">
                        <input type="text" id="settingsKey" class="te-key-input" value="${CONFIG.settingsKey}" readonly>
                        <button id="changeKeyButton" class="te-key-button">Change Key</button>
                    </div>
                    <div id="keyInstructions" class="te-key-instructions" style="display:none;">Press any key...</div>
                </div>
                <div class="te-button-container">
                    <button id="saveSettingsButton" class="te-button te-button-save">Save</button>
                    <button id="cancelSettingsButton" class="te-button te-button-cancel">Cancel</button>
                </div>
            </div>
        `;

        const styleSheet = `
            <style>
                .te-dialog {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(18, 16, 24, 0.9);
                    border: 1px solid #772ce8;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
                    z-index: 9999999; /* Increased z-index to ensure it appears above all elements */
                    color: white;
                    width: 350px;
                    font-family: 'Roobert', 'Inter', Helvetica, Arial, sans-serif;
                }
                .te-dialog h3 {
                    margin-top: 0;
                    font-size: 1.4em;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #bf94ff;
                }
                .te-toggle-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .te-toggle-label {
                    flex-grow: 1;
                    font-size: 0.95em;
                }
                .te-toggle {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .te-toggle input {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                    margin: 0;
                }
                .te-toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #333;
                    transition: .4s;
                    border-radius: 24px;
                }
                .te-toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                .te-toggle input:checked + .te-toggle-slider {
                    background-color: #9147ff;
                }
                .te-toggle input:checked + .te-toggle-slider:before {
                    transform: translateX(26px);
                }
                .te-button-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                .te-button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.95em;
                    transition: background-color 0.3s;
                }
                .te-button-save {
                    background-color: #9147ff;
                    color: white;
                }
                .te-button-save:hover {
                    background-color: #772ce8;
                }
                .te-button-cancel {
                    background-color: #464649;
                    color: white;
                }
                .te-button-cancel:hover {
                    background-color: #2d2d30;
                }
                .te-key-setting {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #464649;
                }
                .te-key-label {
                    display: block;
                    margin-bottom: 10px;
                    font-size: 0.95em;
                }
                .te-key-input-container {
                    display: flex;
                    gap: 10px;
                }
                .te-key-input {
                    flex: 1;
                    background-color: #18181b;
                    color: white;
                    border: 1px solid #464649;
                    border-radius: 4px;
                    padding: 8px;
                    text-align: center;
                    font-size: 14px;
                }
                .te-key-button {
                    background-color: #464649;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 12px;
                    cursor: pointer;
                    font-size: 0.85em;
                }
                .te-key-button:hover {
                    background-color: #5c5c5f;
                }
                .te-key-instructions {
                    margin-top: 10px;
                    font-size: 0.85em;
                    color: #bf94ff;
                    text-align: center;
                }
            </style>
        `;

        const dialogWrapper = document.createElement('div');
        dialogWrapper.innerHTML = styleSheet + dialogHTML;
        document.body.appendChild(dialogWrapper);

        // Add event listeners to toggles with improved feedback - MODIFIED
        // Store toggle changes in memory instead of immediately updating CONFIG
        const pendingChanges = {}; // Object to track pending changes

        document.querySelectorAll('.te-toggle input').forEach(toggle => {
            toggle.addEventListener('change', (event) => {
                const { id, checked } = event.target;
                Logger.info(`Toggle changed: ${id} = ${checked}`);
                // Instead of updating CONFIG directly, store the pending change
                pendingChanges[id] = checked;
            });
        });

        // Add event listeners to buttons
        document.getElementById('saveSettingsButton').addEventListener('click', () => saveAndCloseDialog(pendingChanges));
        document.getElementById('cancelSettingsButton').addEventListener('click', closeDialog);

        // Add event listener for change key button
        const changeKeyButton = document.getElementById('changeKeyButton');
        changeKeyButton.addEventListener('click', function () {
            const keyInput = document.getElementById('settingsKey');
            const keyInstructions = document.getElementById('keyInstructions');

            // Show instructions and focus on input
            keyInstructions.style.display = 'block';
            keyInstructions.textContent = 'Press key combination (e.g. Ctrl+Shift+K)...';
            keyInput.value = 'Press keys...';

            // Change button text to indicate canceling is possible
            changeKeyButton.textContent = 'Cancel';

            // Flag to track if we're in key capture mode
            let capturingKey = true;

            // Variables to store key combination
            let modifiers = {
                ctrl: false,
                alt: false,
                shift: false,
                meta: false
            };
            let mainKey = '';

            // Function to format current key combination
            const formatKeyCombination = () => {
                const parts = [];
                if (modifiers.ctrl) parts.push('Ctrl');
                if (modifiers.alt) parts.push('Alt');
                if (modifiers.shift) parts.push('Shift');
                if (modifiers.meta) parts.push('Meta');
                if (mainKey && !['Control', 'Alt', 'Shift', 'Meta'].includes(mainKey)) {
                    parts.push(mainKey);
                }
                return parts.join('+');
            };

            // Function to update the input with current combination
            const updateKeyDisplay = () => {
                const combination = formatKeyCombination();
                if (combination) {
                    keyInput.value = combination;
                } else {
                    keyInput.value = 'Press keys...';
                }
            };

            // Function to handle key down
            const handleKeyDown = function (e) {
                if (!capturingKey) return;

                e.preventDefault();
                e.stopPropagation();

                // Track modifier keys
                if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'Meta') {
                    switch (e.key) {
                        case 'Control': modifiers.ctrl = true; break;
                        case 'Alt': modifiers.alt = true; break;
                        case 'Shift': modifiers.shift = true; break;
                        case 'Meta': modifiers.meta = true; break;
                    }
                } else {
                    // Track main key
                    mainKey = e.key;
                }

                // Update the display
                updateKeyDisplay();
            };

            // Function to handle key up
            const handleKeyUp = function (e) {
                if (!capturingKey) return;

                e.preventDefault();
                e.stopPropagation();

                // Handle modifier keys being released
                if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'Meta') {
                    switch (e.key) {
                        case 'Control': modifiers.ctrl = false; break;
                        case 'Alt': modifiers.alt = false; break;
                        case 'Shift': modifiers.shift = false; break;
                        case 'Meta': modifiers.meta = false; break;
                    }

                    // Update the display
                    updateKeyDisplay();
                } else {
                    // If a non-modifier key was released, complete the capture
                    const keyCombination = formatKeyCombination();

                    // Only save if we have a valid combination (at least one key)
                    if (keyCombination && keyCombination !== 'Press keys...') {
                        keyInput.value = keyCombination;

                        // Exit key capture mode
                        document.removeEventListener('keydown', handleKeyDown, true);
                        document.removeEventListener('keyup', handleKeyUp, true);
                        keyInstructions.style.display = 'none';
                        changeKeyButton.textContent = 'Change Key';
                        capturingKey = false;

                        // Log the captured combination
                        Logger.info(`Key combination captured: ${keyCombination}`);
                    }
                }
            };

            // Function to cancel key capture
            const cancelCapture = function () {
                if (!capturingKey) return;

                document.removeEventListener('keydown', handleKeyDown, true);
                document.removeEventListener('keyup', handleKeyUp, true);
                keyInput.value = CONFIG.settingsKey;
                keyInstructions.style.display = 'none';
                changeKeyButton.textContent = 'Change Key';
                capturingKey = false;
            };

            // Allow canceling key capture by clicking the button again
            changeKeyButton.addEventListener('click', cancelCapture, { once: true });

            // Capture key events
            document.addEventListener('keydown', handleKeyDown, true);
            document.addEventListener('keyup', handleKeyUp, true);
        });
    }

    function createToggle(id, label, title) {
        return `
            <div class="te-toggle-container" title="${title}">
                <label class="te-toggle">
                    <input type="checkbox" id="${id}" ${CONFIG[id] ? 'checked' : ''}>
                    <span class="te-toggle-slider"></span>
                </label>
                <label for="${id}" class="te-toggle-label">${label}</label>
            </div>
        `;
    }

    // Modified saveAndCloseDialog function to apply changes dynamically
    function saveAndCloseDialog(pendingChanges = {}) {
        // Create a deep copy of the CONFIG object before any changes are made
        const oldConfig = JSON.parse(JSON.stringify(CONFIG));
        let changesMade = false;

        // Improved debugging output
        Logger.info("Checking for settings changes...");

        // Save toggle settings
        Object.keys(CONFIG).forEach(key => {
            if (key === 'settingsKey') return; // Handle separately

            // Check if this setting has a pending change
            if (pendingChanges.hasOwnProperty(key)) {
                const oldValue = oldConfig[key];
                const newValue = pendingChanges[key];

                // Log the comparison for debugging
                Logger.info(`Comparing ${key}: old=${oldValue} (${typeof oldValue}), new=${newValue} (${typeof newValue})`);

                // Compare values - both should be booleans for toggle settings
                if (oldValue !== newValue) {
                    changesMade = true;
                    Logger.info(`Changed ${key} from ${oldValue} to ${newValue}`);
                    CONFIG[key] = newValue;
                    GM_setValue(key, newValue);
                }
            } else {
                // If no pending change, get value from form element
                const element = document.getElementById(key);
                if (element) {
                    const oldValue = oldConfig[key];
                    const newValue = element.checked;

                    // Log the comparison for debugging
                    Logger.info(`Comparing ${key}: old=${oldValue} (${typeof oldValue}), new=${newValue} (${typeof newValue})`);

                    // Compare values
                    if (oldValue !== newValue) {
                        changesMade = true;
                        Logger.info(`Changed ${key} from ${oldValue} to ${newValue}`);
                        CONFIG[key] = newValue;
                        GM_setValue(key, newValue);
                    }
                }
            }
        });

        // Save settings key
        const keyInput = document.getElementById('settingsKey');
        if (keyInput && keyInput.value !== oldConfig.settingsKey) {
            changesMade = true;
            Logger.info(`Changed settings key from ${oldConfig.settingsKey} to ${keyInput.value}`);
            CONFIG.settingsKey = keyInput.value;
            GM_setValue('settingsKey', keyInput.value);
        }

        closeDialog();

        if (changesMade) {
            Logger.success('Settings saved and applied immediately');
            applySettingsChanges(oldConfig);
        } else {
            // Show more helpful message when no changes are detected
            Logger.info('No changes detected. Settings remain the same.');
        }
    }

    // Function to dynamically apply settings changes
    function applySettingsChanges(oldConfig) {
        // Restart observers or update UI elements based on config changes

        // Handle auto refresh drops changes
        if (oldConfig.enableAutoRefreshDrops !== CONFIG.enableAutoRefreshDrops) {
            setupAutoRefreshDrops();
        }

        // Handle claim points observer changes
        if (oldConfig.enableAutoClaimPoints !== CONFIG.enableAutoClaimPoints) {
            restartClaimPointsObserver();
        }

        // Handle claim drops observer changes
        if (oldConfig.enableClaimDrops !== CONFIG.enableClaimDrops) {
            restartClaimDropsObserver();
        }

        // Handle Amazon gaming buttons changes
        if (oldConfig.enableGogRedeemButton !== CONFIG.enableGogRedeemButton ||
            oldConfig.enableLegacyGamesRedeemButton !== CONFIG.enableLegacyGamesRedeemButton) {
            updateRedeeemButtons();
        }

        // Handle PrimeOfferPopover changes for Claim All/Remove All buttons
        if (oldConfig.enableClaimAllButton !== CONFIG.enableClaimAllButton ||
            oldConfig.enableRemoveAllButton !== CONFIG.enableRemoveAllButton) {
            if (document.getElementById("PrimeOfferPopover-header")) {
                updatePrimeOfferButtons();
            }
        }

        // Handle Theater Mode changes
        if (!oldConfig.enableTheaterMode && CONFIG.enableTheaterMode) {
            enableTheaterMode();
        }

        // Handle Hide Global Menu changes
        if (CONFIG.enableHideGlobalMenu) {
            hideGlobalMenu();
        } else if (!CONFIG.enableHideGlobalMenu && oldConfig.enableHideGlobalMenu) {
            showGlobalMenu();
        }
    }

    // Function to show global menu (when setting is turned off)
    function showGlobalMenu() {
        const GLOBAL_MENU_SELECTOR = 'div.ScBalloonWrapper-sc-14jr088-0.eEhNFm';
        const globalMenu = document.querySelector(GLOBAL_MENU_SELECTOR);
        if (globalMenu) {
            globalMenu.style.display = '';
            Logger.info('Global menu restored');
        }
    }

    // Variables to track observers
    let claimPointsObserver = null;
    let claimDropsObserver = null;
    let autoRefreshInterval = null;

    // Function to restart claim points observer
    function restartClaimPointsObserver() {
        if (claimPointsObserver) {
            claimPointsObserver.disconnect();
            claimPointsObserver = null;
            Logger.info('Auto claim points observer disconnected');
        }

        if (CONFIG.enableAutoClaimPoints) {
            setupAutoClaimBonus();
        }
    }

    // Function to restart claim drops observer
    function restartClaimDropsObserver() {
        if (claimDropsObserver) {
            claimDropsObserver.disconnect();
            claimDropsObserver = null;
            Logger.info('Claim drops observer disconnected');
        }

        if (CONFIG.enableClaimDrops) {
            setupClaimDrops();
        }
    }

    // Function to setup auto refresh drops timer
    function setupAutoRefreshDrops() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
            Logger.info('Auto refresh drops timer cleared');
        }

        if (CONFIG.enableAutoRefreshDrops) {
            autoRefreshInterval = setInterval(function () {
                if (window.location.href.startsWith('https://www.twitch.tv/drops/inventory')) {
                    Logger.info('Auto-refreshing drops inventory page');
                    window.location.reload();
                }
            }, 15 * 60000);
            Logger.info('Auto refresh drops timer started');
        }
    }

    // Function to update redeem buttons
    function updateRedeeemButtons() {
        if (window.location.hostname === 'gaming.amazon.com') {
            if (CONFIG.enableGogRedeemButton) {
                addGogRedeemButton();
            } else {
                // Remove GOG buttons
                const gogButtons = document.querySelectorAll('.gog-redeem-button');
                gogButtons.forEach(button => button.remove());
                Logger.info('GOG redeem buttons removed');
            }

            if (CONFIG.enableLegacyGamesRedeemButton) {
                addLegacyGamesRedeemButton();
            } else {
                // Remove Legacy Games buttons
                const legacyButtons = document.querySelectorAll('.legacy-games-redeem-button');
                legacyButtons.forEach(button => button.remove());
                Logger.info('Legacy Games redeem buttons removed');
            }
        }
    }

    // Function to update the Prime Offer Popover buttons
    function updatePrimeOfferButtons() {
        const primeOfferHeader = document.getElementById("PrimeOfferPopover-header");
        if (!primeOfferHeader) return;

        let o = new MutationObserver((m) => {
            if (!CONFIG.enableClaimAllButton && !CONFIG.enableRemoveAllButton) {
                // Remove all custom buttons
                const customButtonsContainer = document.querySelector('#PrimeOfferPopover-header > div');
                if (customButtonsContainer) {
                    customButtonsContainer.remove();
                }
                return;
            }

            // Trigger a refresh of the buttons
            const headerElement = document.getElementById("PrimeOfferPopover-header");
            if (headerElement) {
                // Force refresh by triggering our main observer
                const dummyDiv = document.createElement('div');
                document.body.appendChild(dummyDiv);
                document.body.removeChild(dummyDiv);
            }
        });

        // Trigger the observer
        o.observe(document.body, { childList: true });
        setTimeout(() => o.disconnect(), 500); // Disconnect after a short time
    }

    // Function to setup auto claim bonus
    function setupAutoClaimBonus() {
        if (!CONFIG.enableAutoClaimPoints || !MutationObserver) return;

        Logger.info('Auto claimer is enabled.');

        claimPointsObserver = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && CONFIG.enableAutoClaimPoints) {
                    let bonus = document.querySelector(CLAIMABLE_BONUS_SELECTOR);
                    if (bonus && !claiming) {
                        bonus.click();
                        let date = new Date();
                        claiming = true;
                        setTimeout(() => {
                            Logger.success('Claimed at ' + date.toLocaleString());
                            claiming = false;
                        }, Math.random() * 1000 + 2000);
                    }
                }
            }
        });

        claimPointsObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Function to setup claim drops
    function setupClaimDrops() {
        if (!CONFIG.enableClaimDrops || !MutationObserver) return;

        var onMutate = function (mutationsList) {
            mutationsList.forEach(mutation => {
                if (CONFIG.enableClaimDrops && document.querySelector(CLAIM_DROPS_SELECTOR)) {
                    document.querySelector(CLAIM_DROPS_SELECTOR).click();
                }
            });
        };

        claimDropsObserver = new MutationObserver(onMutate);
        claimDropsObserver.observe(document.body, { childList: true, subtree: true });
        Logger.info('Claim drops observer started');
    }

    function closeDialog() {
        const dialog = document.getElementById('twitchEnhancementsDialog');
        if (dialog) {
            dialog.remove();
        }
    }

    function toggleSettingsDialog() {
        const dialog = document.getElementById('twitchEnhancementsDialog');
        if (dialog) {
            dialog.remove();
        } else {
            createSettingsDialog();
        }
    }

    // Register menu command
    GM_registerMenuCommand('Twitch Enhancements Settings', toggleSettingsDialog);

    // Function to click a button
    function clickButton(buttonSelector) {
        if (!MutationObserver) return;

        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length) {
                    const button = document.querySelector(buttonSelector);
                    if (button) {
                        button.click();
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    // Function to enable theater mode
    function enableTheaterMode() {
        if (!CONFIG.enableTheaterMode) return;

        const player = document.querySelector(PLAYER_SELECTOR);
        if (player) {
            if (!player.classList.contains(THEATER_MODE_CLASS)) {
                clickButton(THEATER_MODE_BUTTON_SELECTOR);
            }
        } else {
            Logger.error('Player not found');
        }
    }

    // Function to hide the global menu
    function hideGlobalMenu() {
        if (!CONFIG.enableHideGlobalMenu) return;

        const GLOBAL_MENU_SELECTOR = 'div.ScBalloonWrapper-sc-14jr088-0.eEhNFm';
        const globalMenu = document.querySelector(GLOBAL_MENU_SELECTOR);
        if (globalMenu) {
            globalMenu.style.display = 'none';
        } else {
            Logger.error('Global menu not found');
        }
    }

    // Function to automatically claim channel points
    function autoClaimBonus() {
        if (!CONFIG.enableAutoClaimPoints || !MutationObserver) return;

        Logger.info('Auto claimer is enabled.');

        let observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    let bonus = document.querySelector(CLAIMABLE_BONUS_SELECTOR);
                    if (bonus && !claiming) {
                        bonus.click();
                        let date = new Date();
                        claiming = true;
                        setTimeout(() => {
                            Logger.success('Claimed at ' + date.toLocaleString());
                            claiming = false;
                        }, Math.random() * 1000 + 2000);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to claim prime rewards with retry
    function claimPrimeReward() {
        if (!CONFIG.enableClaimPrimeRewards) return;

        const maxAttempts = 5;
        let attempts = 0;

        const tryClaim = () => {
            if (attempts >= maxAttempts) {
                Logger.warning('Max attempts reached for claiming prime reward');
                return;
            }
            attempts++;

            const element = document.querySelector(PRIME_REWARD_SELECTOR) || document.querySelector(PRIME_REWARD_SELECTOR_2);
            if (element) {
                const lang = element.getAttribute('title') === 'Obtener juego' ? 'Spanish' : 'English';
                element.click();
                Logger.success(`Prime reward claimed (${lang})`);
            } else {
                Logger.info(`Attempt ${attempts}/${maxAttempts}: Waiting for prime reward button...`);
                setTimeout(tryClaim, 1000);
            }
        };

        setTimeout(tryClaim, 2000);
    }

    // Function to claim drops
    function claimDrops() {
        if (!CONFIG.enableClaimDrops || !MutationObserver) return;

        var onMutate = function (mutationsList) {
            mutationsList.forEach(mutation => {
                if (document.querySelector(CLAIM_DROPS_SELECTOR)) document.querySelector(CLAIM_DROPS_SELECTOR).click();
            })
        }
        var observer = new MutationObserver(onMutate);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to add the "Redeem on GOG" button
    function addGogRedeemButton() {
        if (!CONFIG.enableGogRedeemButton) return;

        const claimCodeButton = document.querySelector('p[title="Claim Code"]');
        if (claimCodeButton && !document.querySelector('.gog-redeem-button')) {
            const claimCodeWrapper = claimCodeButton.closest('.claim-button-wrapper');
            if (claimCodeWrapper) {
                const gogRedeemButtonDiv = document.createElement('div');
                gogRedeemButtonDiv.className = 'claim-button tw-align-self-center gog-redeem-button';

                const gogRedeemButton = document.createElement('a');
                gogRedeemButton.href = 'https://www.gog.com/en/redeem';
                gogRedeemButton.rel = 'noopener noreferrer';
                gogRedeemButton.className = 'tw-interactive tw-button tw-button--full-width';
                gogRedeemButton.dataset.aTarget = 'redeem-on-gog';
                gogRedeemButton.innerHTML = '<span class="tw-button__text" data-a-target="tw-button-text"><div class="tw-inline-flex"><p class="" title="Redeem on GOG">Redeem on GOG</p>&nbsp;&nbsp;<figure aria-label="ExternalLinkWithBox" class="tw-svg"><svg class="tw-svg__asset tw-svg__asset--externallinkwithbox tw-svg__asset--inherit" width="12px" height="12px" version="1.1" viewBox="0 0 11 11" x="0px" y="0px"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.3125 6.875V9.625C10.3125 10.3844 9.69689 11 8.9375 11H1.375C0.615608 11 0 10.3844 0 9.625V2.0625C0 1.30311 0.615608 0.6875 1.375 0.6875H4.125V2.0625H1.375V9.625H8.9375V6.875H10.3125ZM9.62301 2.34727L5.29664 6.67364L4.32437 5.70136L8.65073 1.375H6.18551V0H10.998V4.8125H9.62301V2.34727Z"></path></svg></figure></div></span>';

                gogRedeemButtonDiv.appendChild(gogRedeemButton);
                claimCodeWrapper.appendChild(gogRedeemButtonDiv);

                gogRedeemButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    const codeInput = document.querySelector('input[aria-label]');
                    if (codeInput) {
                        const code = codeInput.value;
                        if (code) {
                            navigator.clipboard.writeText(code).then(function () {
                                window.location.href = 'https://www.gog.com/en/redeem';
                            });
                        }
                    }
                });

                const style = document.createElement('style');
                style.innerHTML = `
                    .claim-button-wrapper {
                        display: flex;
                        flex-direction: column;
                        margin-top: 15px;
                    }
                    .claim-button,
                    .gog-redeem-button {
                        margin: 5px 0;
                    }
                    .tw-mg-l-1 {
                        margin-top: 10px;
                    }
                    .claimable-item {
                        flex-direction: column !important;
                        gap: 15px;
                    }
                    .tw-flex-grow-1 {
                        width: 100%;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Function to redeem code on GOG
    function redeemCodeOnGOG() {
        navigator.clipboard.readText().then(function (code) {
            const codeInput = document.querySelector(GOG_REDEEM_CODE_INPUT_SELECTOR);
            if (codeInput) {
                codeInput.value = code;

                // Simulate input event to ensure any listeners are triggered
                const inputEvent = new Event('input', { bubbles: true });
                codeInput.dispatchEvent(inputEvent);

                // Click the continue button after a short delay
                setTimeout(() => {
                    const continueButton = document.querySelector(GOG_CONTINUE_BUTTON_SELECTOR);
                    if (continueButton) {
                        continueButton.click();

                        // Wait for the "Redeem" button to appear and click it
                        const checkRedeemButton = setInterval(() => {
                            const redeemButton = document.querySelector(GOG_FINAL_REDEEM_BUTTON_SELECTOR);
                            if (redeemButton) {
                                clearInterval(checkRedeemButton);
                                redeemButton.click();
                            }
                        }, 500); // Check every 500ms for the Redeem button
                    }
                }, 500); // Adjust the delay as needed
            }
        }).catch(function (err) {
            Logger.error('Failed to read clipboard contents: ' + err);
        });
    }

    // Function to add the "Redeem on Legacy Games" button
    function addLegacyGamesRedeemButton() {
        if (!CONFIG.enableLegacyGamesRedeemButton) return;

        const copyCodeButton = document.querySelector('button[aria-label="Copy code to your clipboard"]');
        if (copyCodeButton && !document.querySelector('.legacy-games-redeem-button')) {
            const copyCodeWrapper = copyCodeButton.closest('.copy-button-wrapper');
            if (copyCodeWrapper) {
                const legacyGamesRedeemButtonDiv = document.createElement('div');
                legacyGamesRedeemButtonDiv.className = 'copy-button tw-align-self-center legacy-games-redeem-button';

                const legacyGamesRedeemButton = document.createElement('button');
                legacyGamesRedeemButton.ariaLabel = 'Redeem on Legacy Games';
                legacyGamesRedeemButton.className = 'tw-interactive tw-button tw-button--full-width';
                legacyGamesRedeemButton.dataset.aTarget = 'redeem-on-legacy-games';
                legacyGamesRedeemButton.innerHTML = '<span class="tw-button__text" data-a-target="tw-button-text">Redeem on Legacy Games</span>';

                legacyGamesRedeemButtonDiv.appendChild(legacyGamesRedeemButton);
                copyCodeWrapper.appendChild(legacyGamesRedeemButtonDiv);

                legacyGamesRedeemButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    const codeInput = document.querySelector('input[aria-label]');
                    if (codeInput) {
                        const code = codeInput.value;
                        if (code) {
                            navigator.clipboard.writeText(code).then(function () {
                                const email = GM_getValue('legacyGamesEmail', null);

                                // Try to find a dynamic "here" link or any legacygames link on the page
                                const findLegacyUrl = () => {
                                    try {
                                        // 1) Prefer anchors with visible text 'here' or 'click here' (most specific)
                                        const hereAnchors = Array.from(document.querySelectorAll('a[href]')).filter(a => {
                                            const text = (a.textContent || '').trim().toLowerCase();
                                            return text === 'here' || text === 'click here' || text === 'here ›' || text === 'here »' || /\bhere\b/.test(text);
                                        });
                                        for (let a of hereAnchors) {
                                            const href = a.getAttribute('href');
                                            if (!href) continue;
                                            if (href.indexOf('javascript:') === 0) continue;
                                            // Normalize relative URLs
                                            if (href.startsWith('/')) return window.location.origin + href;
                                            if (href.startsWith('http')) return href;
                                        }

                                        // 2) Search inside claim instructions block if present (more likely to contain the per-game promo link)
                                        const claimContainers = document.querySelectorAll('[data-a-target="claim-instructions"], .claim-instructions, [data-a-target="claim-instructions_text"]');
                                        for (let c of claimContainers) {
                                            const anchors = c.querySelectorAll('a[href]');
                                            for (let a of anchors) {
                                                const href = a.getAttribute('href');
                                                if (!href) continue;
                                                if (href.indexOf('javascript:') === 0) continue;
                                                if (href.startsWith('/')) return window.location.origin + href;
                                                if (href.startsWith('http')) return href;
                                            }
                                        }

                                        // 3) Prefer explicit promo subdomain links
                                        const promo = Array.from(document.querySelectorAll('a[href]')).map(a => a.href).find(h => h.includes('promo.legacygames.com'));
                                        if (promo) return promo;

                                        // 4) Then any legacygames.com link that isn't just the root domain
                                        const lg = Array.from(document.querySelectorAll('a[href]')).map(a => a.href).find(h => h.includes('legacygames.com') && !/^https?:\/\/(?:www\.)?legacygames\.com\/?$/.test(h));
                                        if (lg) return lg;

                                    } catch (e) {
                                        // ignore and fallback
                                    }
                                    return null;
                                };

                                const targetUrl = findLegacyUrl() || LEGACY_GAMES_REDEEM_URL;
                                Logger.info('Legacy Games target URL selected: ' + targetUrl);

                                if (!email) {
                                    const userEmail = prompt('Please enter your email address:');
                                    if (userEmail) {
                                        GM_setValue('legacyGamesEmail', userEmail);
                                        window.location.href = targetUrl;
                                    }
                                } else {
                                    window.location.href = targetUrl;
                                }
                            });
                        }
                    }
                });

                const style = document.createElement('style');
                style.innerHTML = `
                    .copy-button-wrapper {
                        display: flex;
                        flex-direction: column;
                        margin-top: 15px;
                    }
                    .copy-button,
                    .legacy-games-redeem-button {
                        margin: 5px 0;
                    }
                    .tw-mg-l-1 {
                        margin-top: 10px;
                    }
                    .claimable-item {
                        flex-direction: column !important;
                        gap: 15px;
                    }
                    .tw-flex-grow-1 {
                        width: 100%;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Function to redeem code on Legacy Games
    function redeemCodeOnLegacyGames() {
        const maxAttempts = 5;
        let attempts = 0;

        const tryRedeem = () => {
            if (attempts >= maxAttempts) return;
            attempts++;

            navigator.clipboard.readText().then(function (code) {
                const codeInput = document.querySelector(LEGACY_GAMES_CODE_INPUT_SELECTOR);
                const emailInput = document.querySelector(LEGACY_GAMES_EMAIL_INPUT_SELECTOR);
                const emailValidateInput = document.querySelector(LEGACY_GAMES_EMAIL_VALIDATE_INPUT_SELECTOR);
                const submitButton = document.querySelector(LEGACY_GAMES_SUBMIT_BUTTON_SELECTOR);
                const newsletterCheckbox = document.querySelector(LEGACY_GAMES_NEWSLETTER_CHECKBOX_SELECTOR);
                const email = GM_getValue('legacyGamesEmail', null);

                if (!codeInput || !emailInput || !emailValidateInput || !submitButton) {
                    Logger.info('Waiting for elements to load...');
                    setTimeout(tryRedeem, 1000);
                    return;
                }

                if (email && code) {
                    // Fill in the form
                    codeInput.value = code;
                    emailInput.value = email;
                    emailValidateInput.value = email;

                    // Ensure newsletter checkbox is unchecked
                    if (newsletterCheckbox) {
                        newsletterCheckbox.checked = false;
                    }

                    // Trigger input events
                    [codeInput, emailInput, emailValidateInput].forEach(input => {
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    });

                    // Submit the form
                    setTimeout(() => {
                        submitButton.click();
                        Logger.success('Form submitted with code: ' + code + ' and email: ' + email);
                    }, 500);
                }
            }).catch(function (err) {
                Logger.error('Failed to read clipboard contents: ' + err);
            });
        };

        // Start the redemption process
        setTimeout(tryRedeem, 2000);
    }

    // Function to open all "Claim Game" buttons in new tabs
    function openClaimGameTabs() {
        const claimGameButtons = document.querySelectorAll('div[data-a-target="tw-core-button-label-text"].Layout-sc-1xcs6mc-0.bFxzAY');
        claimGameButtons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            // Check for both English and Spanish variations
            if (buttonText === 'claim game' || buttonText === 'claim' ||
                buttonText === 'obtener juego' || buttonText === 'obtener') {
                const parentButton = button.closest('a');
                if (parentButton) {
                    window.open(parentButton.href, '_blank');
                }
            }
        });
    }

    if (window.location.hostname === 'gaming.amazon.com') {
        const observer = new MutationObserver((mutations, obs) => {
            const claimCodeButton = document.querySelector('p[title="Claim Code"]');
            if (claimCodeButton && CONFIG.enableGogRedeemButton) {
                addGogRedeemButton();
            }
            const copyCodeButton = document.querySelector('button[aria-label="Copy code to your clipboard"]');
            if (copyCodeButton && CONFIG.enableLegacyGamesRedeemButton) {
                addLegacyGamesRedeemButton();
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });

        if (CONFIG.enableGogRedeemButton) addGogRedeemButton();
        if (CONFIG.enableLegacyGamesRedeemButton) addLegacyGamesRedeemButton();
    }

    if (window.location.hostname === 'www.gog.com' && window.location.pathname === '/en/redeem') {
        window.addEventListener('load', redeemCodeOnGOG);
    }

    if (window.location.hostname === 'promo.legacygames.com') {
        window.addEventListener('load', redeemCodeOnLegacyGames);
    }

    setTimeout(enableTheaterMode, 1000);
    setTimeout(setupAutoClaimBonus, 1000);
    setTimeout(claimPrimeReward, 1000);
    setTimeout(() => clickButton(CLOSE_MENU_BUTTON_SELECTOR), 1000);
    setTimeout(() => clickButton(CLOSE_MODAL_BUTTON_SELECTOR), 1000);
    setTimeout(hideGlobalMenu, 1000);
    setTimeout(setupClaimDrops, 1000);

    // Auto refresh drops inventory page
    if (CONFIG.enableAutoRefreshDrops) {
        setInterval(function () {
            if (window.location.href.startsWith('https://www.twitch.tv/drops/inventory')) {
                window.location.reload();
            }
        }, 15 * 60000);
    }

    // Add keyboard shortcut to toggle settings - now using the configured key
    document.addEventListener('keyup', (event) => {
        // Parse the configured key combination
        const parts = CONFIG.settingsKey.split('+');
        const requiredModifiers = {
            Ctrl: parts.includes('Ctrl'),
            Alt: parts.includes('Alt'),
            Shift: parts.includes('Shift'),
            Meta: parts.includes('Meta')
        };

        // The main key is the last part if it's not a modifier
        const mainKey = parts.filter(part => !['Ctrl', 'Alt', 'Shift', 'Meta'].includes(part)).pop();

        // Check if the event matches our configured combination
        const matchesModifiers =
            (!requiredModifiers.Ctrl || event.ctrlKey) &&
            (!requiredModifiers.Alt || event.altKey) &&
            (!requiredModifiers.Shift || event.shiftKey) &&
            (!requiredModifiers.Meta || event.metaKey);

        const matchesMainKey = mainKey ? event.key === mainKey : true;

        if (matchesModifiers && matchesMainKey) {
            // Only trigger on the exact key combination
            if (
                // If Ctrl is in the combination, ensure it's pressed
                (!parts.includes('Ctrl') || event.ctrlKey) &&
                // If Alt is in the combination, ensure it's pressed
                (!parts.includes('Alt') || event.altKey) &&
                // If Shift is in the combination, ensure it's pressed
                (!parts.includes('Shift') || event.shiftKey) &&
                // If Meta is in the combination, ensure it's pressed
                (!parts.includes('Meta') || event.metaKey) &&
                // If a main key is specified, ensure it matches
                (mainKey ? event.key === mainKey : true)
            ) {
                // Prevent default behavior
                event.preventDefault();
                toggleSettingsDialog();

                // Log for debugging
                Logger.info(`${CONFIG.settingsKey} key combination pressed - toggling settings dialog`);
            }
        }
    });

    // Make sure event is captured at the document level with capture phase
    document.addEventListener('keydown', (event) => {
        // Parse the configured key combination
        const parts = CONFIG.settingsKey.split('+');
        const requiredModifiers = {
            Ctrl: parts.includes('Ctrl'),
            Alt: parts.includes('Alt'),
            Shift: parts.includes('Shift'),
            Meta: parts.includes('Meta')
        };

        // The main key is the last part if it's not a modifier
        const mainKey = parts.filter(part => !['Ctrl', 'Alt', 'Shift', 'Meta'].includes(part)).pop();

        // Check if the event matches our configured combination
        const matchesModifiers =
            (!requiredModifiers.Ctrl || event.ctrlKey) &&
            (!requiredModifiers.Alt || event.altKey) &&
            (!requiredModifiers.Shift || event.shiftKey) &&
            (!requiredModifiers.Meta || event.metaKey);

        const matchesMainKey = mainKey ? event.key === mainKey : true;

        if (matchesModifiers && matchesMainKey) {
            // Prevent default behavior for our combination
            event.preventDefault();
        }
    }, true);

    let o = new MutationObserver((m) => {
        if (!CONFIG.enableClaimAllButton && !CONFIG.enableRemoveAllButton) return;

        // Check if the PrimeOfferPopover-header element exists
        const primeOfferHeader = document.getElementById("PrimeOfferPopover-header");
        if (!primeOfferHeader) {
            // If we're on a page where this element doesn't exist, we should stop
            return;
        }

        let script = document.createElement("script");
        script.innerHTML = `
        // Add logger configuration for client-side script
        const Logger = {
            styles: {
                info: 'color: #2196F3; font-weight: bold',
                warning: 'color: #FFC107; font-weight: bold',
                success: 'color: #4CAF50; font-weight: bold',
                error: 'color: #F44336; font-weight: bold'
            },
            prefix: '[TwitchEnhancements]',
            getTimestamp() {
                return new Date().toISOString().split('T')[1].slice(0, -1);
            },
            info(msg) {
                console.log(\`%c\${this.prefix} \${this.getTimestamp()} - \${msg}\`, this.styles.info);
            },
            warning(msg) {
                console.warn(\`%c\${this.prefix} \${this.getTimestamp()} - \${msg}\`, this.styles.warning);
            },
            success(msg) {
                console.log(\`%c\${this.prefix} \${this.getTimestamp()} - \${msg}\`, this.styles.success);
            },
            error(msg) {
                console.error(\`%c\${this.prefix} \${this.getTimestamp()} - \${msg}\`, this.styles.error);
            }
        };

        const openClaimGameTabs = () => {
            // More specific selector targeting only prime offer buttons
            const allButtonTexts = document.querySelectorAll('div[data-a-target="tw-core-button-label-text"]');

            // Filter buttons to only include those with text "Claim Game" or just "Claim"
            const claimGameButtons = Array.from(allButtonTexts).filter(button => {
                const text = button.textContent.trim();
                return (text === "Claim Game" || text === "Claim") &&
                       button.closest('a') && // Must be inside an anchor tag
                       button.closest('.prime-offer'); // Must be inside a prime offer
            });

            Logger.info(\`Found \${claimGameButtons.length} valid claim buttons\`);

            // Open each valid claim button in a new tab
            claimGameButtons.forEach(button => {
                const parentButton = button.closest('a');
                if (parentButton && parentButton.href &&
                    (parentButton.href.includes('gaming.amazon.com') ||
                     parentButton.href.includes('?ingress=twch'))) {
                    window.open(parentButton.href, '_blank');
                }
            });
        };

        const removeClaimedItems = () => {
            // Find ALL items in the list, not just claimed ones
            const allItems = document.querySelectorAll('.prime-offer');
            let dismissedCount = 0;
            let dismissButtons = [];

            Logger.info(\`Found \${allItems.length} total items to dismiss\`);

            // First collect all dismiss buttons - use multiple methods to ensure we catch all
            // Method 1: Find buttons by attribute and data target
            document.querySelectorAll('button[aria-label="Dismiss"][data-a-target="prime-offer-dismiss-button"]').forEach(btn => {
                dismissButtons.push(btn);
            });

            // Method 2: Find buttons by test selector attribute as backup
            document.querySelectorAll('button[data-test-selector="prime-offer-dismiss-button"]').forEach(btn => {
                if (!dismissButtons.includes(btn)) {
                    dismissButtons.push(btn);
                }
            });

            // Method 3: Find by class and structure if the above methods miss any
            document.querySelectorAll('.prime-offer__dismiss button').forEach(btn => {
                if (!dismissButtons.includes(btn)) {
                    dismissButtons.push(btn);
                }
            });

            // Deduplicate just in case
            dismissButtons = [...new Set(dismissButtons)];

            Logger.info(\`Found \${dismissButtons.length} dismiss buttons to click\`);

            // Process dismiss buttons with a delay to avoid UI lockups
            if (dismissButtons.length > 0) {
                const clickNextButton = (index) => {
                    if (index < dismissButtons.length) {
                        try {
                            dismissButtons[index].click();
                            dismissedCount++;

                            // Show progress in console
                            if (dismissedCount % 5 === 0 || dismissedCount === dismissButtons.length) {
                                Logger.info(\`Dismissed \${dismissedCount} of \${dismissButtons.length} items...\`);
                            }
                        } catch (e) {
                            Logger.error(\`Error clicking button \${index}: \` + e);
                        }

                        // Schedule next button click with a small delay
                        setTimeout(() => clickNextButton(index + 1), 75);
                    } else {
                        Logger.success(\`Completed! Dismissed \${dismissedCount} items total.\`);

                        // Look for any dismiss buttons that might have been missed
                        const remainingButtons = document.querySelectorAll('button[aria-label="Dismiss"]');
                        if (remainingButtons.length > 0) {
                            Logger.warning(\`Found \${remainingButtons.length} additional buttons to try\`);

                            // Try to click any remaining dismiss buttons as a final pass
                            remainingButtons.forEach(btn => {
                                try {
                                    btn.click();
                                    dismissedCount++;
                                } catch(e) {}
                            });

                            Logger.success(\`Final dismissal count: \${dismissedCount}\`);
                        }
                    }
                };

                // Start the dismissal process
                clickNextButton(0);
            } else {
                Logger.warning('No dismiss buttons found to click');

                // Last attempt fallback - try to find any button with "Dismiss" in aria-label
                const fallbackButtons = document.querySelectorAll('button[aria-label="Dismiss"]');
                if (fallbackButtons.length > 0) {
                    Logger.warning(\`Fallback: Found \${fallbackButtons.length} buttons with aria-label="Dismiss"\`);
                    fallbackButtons.forEach(btn => {
                        try {
                            btn.click();
                            dismissedCount++;
                        } catch(e) {}
                    });
                    Logger.success(\`Fallback dismissal completed: \${dismissedCount} items dismissed\`);
                }
            }
        };
    `;

        // Safely clear and append to the header
        primeOfferHeader.innerHTML = "";
        primeOfferHeader.appendChild(script);

        if (CONFIG.enableClaimAllButton || CONFIG.enableRemoveAllButton) {
            primeOfferHeader.innerHTML += `
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                ${CONFIG.enableClaimAllButton ? `
                <input type='button' style='border: none; background-color: #9147ff; color: white; padding: 10px 20px; font-size: 14px; border-radius: 4px; cursor: pointer; flex: 1;'
                    class='tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative'
                    value='Claim All'
                    onclick='openClaimGameTabs();'>
                ` : ''}
                ${CONFIG.enableRemoveAllButton ? `
                <input type='button' style='border: none; background-color: #772ce8; color: white; padding: 10px 20px; font-size: 14px; border-radius: 4px; cursor: pointer; flex: 1;'
                    class='tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative'
                    value='Remove All'
                    onclick='removeClaimedItems();'>
                ` : ''}
            </div>
        `;
        }
    });

    o.observe(document.body, { childList: true });
})();