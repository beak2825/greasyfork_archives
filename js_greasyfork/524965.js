// ==UserScript==
// @name         GeoGuessr Retry Hotkey
// @namespace    https://www.geoguessr.com/
// @version      1.4
// @description  Quickly resets the game by navigating to the last visited map and starting a new game.
// @author       Shukaaa (aduchi nom)
// @match        https://www.geoguessr.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.focus
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524965/GeoGuessr%20Retry%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/524965/GeoGuessr%20Retry%20Hotkey.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants for script metadata, storage keys
    const SCRIPT_NAME = "GeoGuessr Retry Hotkey";
    const LAST_VISITED_MAP_KEY = "lastVisitedMap";
    const PLAY_TRIGGERED_KEY = "playTriggered";
    const RESET_KEY_STORAGE = "resetKey";
    const DELAY_STORAGE = "rh-delay";

    // Retry Hotkey
    let RESET_KEY = localStorage.getItem(RESET_KEY_STORAGE) || "p";
    let DELAY = localStorage.getItem(DELAY_STORAGE) || 50;

    // Helper: Logging function for consistent console outputs
    const log = (message, level = "log") => {
        const levels = {
            log: console.log,
            warn: console.warn
        };
        const logFunction = levels[level] || console.log;
        logFunction(`[${SCRIPT_NAME}] ${message}`);
    };

    // Helper: Save to GM storage
    const saveToStorage = (key, value) => GM_setValue(key, value);

    // Helper: Load from GM storage
    const loadFromStorage = (key, defaultValue = null) => GM_getValue(key, defaultValue);

    // Handle keydown for resetting the game
    const handleKeyDown = (event) => {
        const currentURL = window.location.href;

        // Trigger reset
        if (currentURL.includes("/game/") && event.key === RESET_KEY) {
            const lastVisitedMap = loadFromStorage(LAST_VISITED_MAP_KEY);

            if (lastVisitedMap) {
                log(`'${RESET_KEY.toUpperCase()}' key pressed. Navigating to: ${lastVisitedMap}`);
                saveToStorage(PLAY_TRIGGERED_KEY, true); // Set playTriggered to true
                window.location.href = lastVisitedMap; // Redirect to the map
            } else {
                log("No last map URL found. Reset aborted.", "warn");
            }
        }

        if (!currentURL.includes("/game/")) {
            log("Reset aborted: Not on a game page.", "warn");
        }
    };

    // Automatically click the play button on the map page
    const attemptPlay = () => {
        const currentURL = window.location.href;
        const playTriggered = loadFromStorage(PLAY_TRIGGERED_KEY, false);

        if (currentURL.includes("/maps/") && playTriggered) {
            log("Map page detected with playTriggered=true. Attempting to start a new game...");

            // Try finding the play button container
            const playButtonContainer = document.querySelector("div[class*='map-selector_playButtons']");
            if (playButtonContainer) {
                const playButton = playButtonContainer.querySelector("button");
                if (playButton) {
                    saveToStorage(PLAY_TRIGGERED_KEY, false);
                    playButton.focus();
                    setTimeout(() => {
                        playButton.click();
                    }, DELAY);
                } else {
                    log("'Play' button not found inside container.", "warn");
                }
            } else {
                log("Play button container not found.", "warn");
            }
        }
    };

    // Save the current map URL if on a map page
    const saveCurrentMap = () => {
        const currentURL = window.location.href;
        if (currentURL.includes("/maps/")) {
            log(`Saving current map URL: ${currentURL}`);
            saveToStorage(LAST_VISITED_MAP_KEY, currentURL);
        }
    };

    // Check for URL Changes
    const observeUrlChanges = () => {
        let lastUrl = window.location.href;

        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;

            if (currentUrl !== lastUrl) {
                log(`URL changed: ${currentUrl}`);
                lastUrl = currentUrl;

                // Save the map URL if it's a map page
                saveCurrentMap();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const addConfigurationsToMenuOverlay = () => {
        const SETTINGS_INITIALIZED_ATTR = "data-retry-hotkey-settings-initialized";

        // Utility functions for creating reusable components made by geoguessr
        const cloneComponent = (selector, modifier = (clone) => clone) => {
            const component = document.querySelector(selector);
            if (!component) return null;
            const clone = component.cloneNode(true);
            return modifier(clone);
        };

        const createTitle = (title) =>
        cloneComponent("div[class*='game-menu_headerContainer']", (clone) => {
            clone.childNodes[0].innerHTML = title;
            return clone;
        });

        const createDivider = () => cloneComponent("div[class*='game-menu_divider']");

        const createOptionContainer = (optionName) =>
        cloneComponent("div[class*='game-menu_volumeContainer']", (clone) => {
            clone.removeChild(clone.lastChild);
            clone.childNodes[0].innerHTML = optionName;
            return clone;
        });

        const createButton = (text, onClick) => {
            const button = document.createElement("button");
            button.style.cursor = "pointer";
            button.style.color = "#fff";
            button.style.border = ".0625rem solid var(--ds-color-white-80)";
            button.style.padding = "0.75rem 1.5rem";
            button.style.borderRadius = "3.75rem";
            button.style.marginTop = "1em";
            button.innerHTML = text;
            if (onClick) button.onclick = onClick;
            return button;
        };

        const createBlockquote = (text) => {
            const blockquote = document.createElement("blockquote");
            blockquote.style.borderLeft = ".333rem solid #ccc";
            blockquote.style.color = "#ccc";
            blockquote.style.marginLeft = "0";
            blockquote.style.paddingLeft = "0.5em";
            blockquote.innerHTML = text
            return blockquote
        }

        const initializeSettingsMenu = () => {
            const settingsContainer = document.querySelector("div[class*='game-menu_settingsContainer']");
            if (!settingsContainer || settingsContainer.hasAttribute(SETTINGS_INITIALIZED_ATTR)) return;

            settingsContainer.appendChild(createDivider());
            settingsContainer.appendChild(createTitle("Retry Hotkey Settings"));

            const switchHotkeySetting = createOptionContainer("Hotkey");
            const updateHotkeyButton = createButton("Set new hotkey (Current Hotkey: " + RESET_KEY.toUpperCase() + ")", () => {
                updateHotkeyButton.innerHTML = "Press a new key to set as the hotkey";
                updateHotkeyButton.style.color = "#ccc";
                updateHotkeyButton.disabled = true;

                const handleNewKey = (event) => {
                    RESET_KEY = event.key;
                    localStorage.setItem(RESET_KEY_STORAGE, RESET_KEY);
                    log(`New hotkey set: ${RESET_KEY}`);
                    alert(`New hotkey set to: ${RESET_KEY.toUpperCase()}`);

                    updateHotkeyButton.disabled = false;
                    updateHotkeyButton.style.color = "#fff";
                    updateHotkeyButton.innerHTML = "Set new hotkey (Current Hotkey: " + RESET_KEY.toUpperCase() + ")";
                    document.removeEventListener("keydown", handleNewKey);
                };

                document.addEventListener("keydown", handleNewKey);
            });

            switchHotkeySetting.appendChild(updateHotkeyButton);

            const changeDelaySetting = createOptionContainer("Delay");
            const changeDelayInfoText = createBlockquote("When dealing with bad internet connection or bugs that the match won't automatically start, it can be helpful to increase the delay")
            const changeDelayButton = createButton("Change Delay (Current Delay: " + DELAY + "ms)", () => {
                const newDelay = prompt("Enter new delay in ms")

                if (isNaN(newDelay)) {
                    alert("Input is not a number")
                    return
                }

                DELAY = Number(newDelay)
                localStorage.setItem(DELAY_STORAGE, DELAY);
                log(`New delay set: ${DELAY}`);
                alert(`New delay set to: ${DELAY}`);
                changeDelayButton.innerHTML = "Change Delay (Current Delay: " + DELAY + "ms)"
            });

            changeDelaySetting.appendChild(changeDelayInfoText);
            changeDelaySetting.appendChild(changeDelayButton);

            settingsContainer.appendChild(switchHotkeySetting);
            settingsContainer.appendChild(changeDelaySetting);
            settingsContainer.setAttribute(SETTINGS_INITIALIZED_ATTR, true);
        };

        initializeSettingsMenu();
    };

    const observeSettingsView = () => {
        const observer = new MutationObserver(() => {
            const settingsView = document.querySelector("div[class*='game-menu_inGameMenuOverlay']");
            if (settingsView) {
                log("Settings view loaded.");
                addConfigurationsToMenuOverlay()
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Initialize script
    const initialize = () => {
        document.addEventListener("keydown", handleKeyDown); // Add keydown listener
        attemptPlay(); // Check if play needs to be triggered
        saveCurrentMap(); // Save the map URL if relevant
        observeUrlChanges(); // Start observing DOM and URL changes
        observeSettingsView(); // Start observing the menu overlay view to add own settings
    };

    // Run the script
    initialize();
})();
