// ==UserScript==
// @name         Torn Scamming Crime Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  Helps with the Torn scamming crime.
// @author       Elaine [2047176]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534309/Torn%20Scamming%20Crime%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/534309/Torn%20Scamming%20Crime%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Torn Scamming Helper v0.1.11 Loading...");

    // --- Constants ---
    const SETTINGS_KEY = 'scammingHelperSettings_Marks_v2';
    const TARGET_MARKS = [
        "Young Adult Male", "Young Adult Female",
        "Middle-Aged Male", "Middle-Aged Female",
        "Senior Male", "Senior Female",
        "Professional Male", "Professional Female",
        "Affluent Male", "Affluent Female"
    ];
    const DEFAULT_SETTINGS = {
        hideUnselected: false
    };
    TARGET_MARKS.forEach(mark => {
        DEFAULT_SETTINGS[mark] = true;
    });
    const DEFAULT_ROW_HEIGHT = 51; // Default height for most rows
    const LAST_ROW_HEIGHT = 64; // Height for the "Launch Spam Wave" row


    // --- Styles ---
    GM_addStyle(`
        /* Style the header to allow button placement */
        div[class*="crimes-app-header"] {
            display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        div[class*="crimes-app-header"] h4[class*="heading"] {
             margin-bottom: 0 !important; flex-shrink: 0;
        }

        /* Settings Button - Text Style */
        .scam-helper-settings-button {
            background: #e3e3e3; border: 1px solid #bbb; border-radius: 5px;
            padding: 4px 10px; cursor: pointer; display: inline-flex;
            align-items: center; justify-content: center; z-index: 1001;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            transition: background-color 0.3s, border-color 0.3s;
            font-size: 12px; font-weight: bold; color: #333;
            text-shadow: 0 1px 0 rgba(255,255,255,0.5);
            order: 2; line-height: 1.5; height: auto; min-width: auto;
        }
        .scam-helper-settings-button:hover { background-color: #dcdcdc; border-color: #aaa; }

        /* Modal Overlay */
        .scam-helper-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6); z-index: 1002;
            display: none; align-items: center; justify-content: center;
        }
        /* Modal Content - Light Mode */
        .scam-helper-modal-content {
            background-color: #f9f9f9; color: #333; padding: 20px;
            border-radius: 8px; border: 1px solid #ccc;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            width: 90%; max-width: 350px; max-height: 80vh; position: relative;
            display: flex; flex-direction: column;
        }
        /* Dropdown Toggle - Button Style */
         .scam-helper-modal-dropdown-toggle {
            background: #f0f0f0; border: 1px solid #ccc; border-radius: 5px;
            padding: 8px 12px; margin-top: 0;
            color: #555; cursor: pointer; display: flex; justify-content: space-between;
            align-items: center; font-weight: bold; transition: background-color 0.2s, border-color 0.2s;
            position: relative; box-shadow: inset 0 1px 0 #fff, 0 1px 1px rgba(0,0,0,.1);
            text-shadow: 0 1px 0 rgba(255,255,255,.5);
            width: 100%; box-sizing: border-box;
         }
         .scam-helper-modal-dropdown-toggle:hover { background-color: #e8e8e8; border-color: #bbb; }
         .scam-helper-modal-dropdown-toggle::after {
             content: '▼'; font-size: 12px; transition: transform 0.3s; color: #888; margin-left: 10px;
         }
         .scam-helper-modal-dropdown-toggle.open::after { transform: rotate(180deg); }

        .scam-helper-modal-close {
            position: absolute; top: 8px; right: 10px; background: none; border: none;
            font-size: 24px; font-weight: bold; cursor: pointer; color: #aaa;
            line-height: 1; padding: 5px; z-index: 1003;
        }
         .scam-helper-modal-close:hover { color: #777; }

        .scam-helper-dropdown-content {
             max-height: 55vh; overflow-y: auto; display: none;
             border: 1px solid #ddd; border-radius: 5px; padding: 15px;
             margin-top: 5px; background-color: #fff;
             width: 100%; box-sizing: border-box;
        }
        .scam-helper-dropdown-content.open { display: block; }

        /* Section for the hide checkbox */
        .scam-helper-hide-section {
            margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;
            display: flex; align-items: center;
        }

        /* Checkbox List - Light Mode */
        .scam-helper-checkbox-list { list-style: none; padding: 0; margin: 0; }
        .scam-helper-checkbox-list li, .scam-helper-hide-section { margin-bottom: 12px; display: flex; align-items: center; }
        .scam-helper-checkbox-list input[type="checkbox"],
        .scam-helper-hide-section input[type="checkbox"] {
            margin-right: 10px; cursor: pointer; appearance: none;
            background-color: #fff; border: 1px solid #ccc; border-radius: 3px;
            width: 16px; height: 16px; position: relative; top: -1px;
            transition: background-color 0.2s, border-color 0.2s; flex-shrink: 0;
        }
        .scam-helper-checkbox-list input[type="checkbox"]:checked,
        .scam-helper-hide-section input[type="checkbox"]:checked {
            background-color: #799427; border-color: #6a8121;
        }
        .scam-helper-checkbox-list input[type="checkbox"]:checked::after,
        .scam-helper-hide-section input[type="checkbox"]:checked::after {
            content: '✔'; color: white; position: absolute; left: 50%; top: 50%;
            transform: translate(-50%, -50%); font-size: 12px; line-height: 1;
        }
        .scam-helper-checkbox-list label, .scam-helper-hide-section label {
            cursor: pointer; flex-grow: 1; color: #555; font-size: 14px;
        }

        /* --- Disabling and Hiding --- */
        /* Style for the disabled target row itself */
        .scam-helper-target-disabled {
            opacity: 0.4; background-color: #f0f0f0;
            border-left: 3px solid #b0b0b0; transition: opacity 0.3s, background-color 0.3s;
        }
        /* Hiding is done via JS display:none */
        /* Removed .scam-helper-target-hidden class */

         /* Disable interactions for specific elements within the disabled (but not hidden) row */
         .scam-helper-target-disabled button[class*="responseTypeButton"],
         .scam-helper-target-disabled .react-dropdown-default,
         .scam-helper-target-disabled button[class*="commitButton"] {
             pointer-events: none !important; cursor: not-allowed !important; opacity: 0.7 !important;
         }
         /* Keep the avatar button clickable even when disabled */
         .scam-helper-target-disabled button[class*="avatarButton"] {
             pointer-events: auto !important; cursor: pointer !important; opacity: 1 !important;
         }
         .scam-helper-target-disabled button[class*="commitButton"] {
             background-color: #b0b0b0 !important; border-color: #a0a0a0 !important;
         }
         .scam-helper-target-disabled button[class*="commitButton"] span[class*="title"],
         .scam-helper-target-disabled button[class*="commitButton"] span[class*="nerve"] {
             color: #777 !important;
         }

        /* --- Dark Mode Overrides --- */
        body.dark-mode .scam-helper-settings-button,
        .dark-mode .scam-helper-settings-button {
            background: #555; border-color: #444; color: #ccc; text-shadow: none;
        }
        body.dark-mode .scam-helper-settings-button:hover,
        .dark-mode .scam-helper-settings-button:hover {
            background-color: #666; border-color: #555;
        }

        body.dark-mode .scam-helper-modal-content,
        .dark-mode .scam-helper-modal-content {
            background-color: #333; color: #ccc; border-color: #555;
        }
        body.dark-mode .scam-helper-modal-dropdown-toggle,
        .dark-mode .scam-helper-modal-dropdown-toggle {
            color: #ddd; background: #444; border: 1px solid #666;
            box-shadow: inset 0 1px 0 #555, 0 1px 1px rgba(0,0,0,.2); text-shadow: none;
         }
         body.dark-mode .scam-helper-modal-dropdown-toggle:hover,
         .dark-mode .scam-helper-modal-dropdown-toggle:hover {
            background-color: #505050; border-color: #777;
         }
         body.dark-mode .scam-helper-modal-dropdown-toggle::after,
         .dark-mode .scam-helper-modal-dropdown-toggle::after { color: #aaa; }
         body.dark-mode .scam-helper-modal-close,
         .dark-mode .scam-helper-modal-close { color: #888; }
         body.dark-mode .scam-helper-modal-close:hover,
         .dark-mode .scam-helper-modal-close:hover { color: #ccc; }
         body.dark-mode .scam-helper-dropdown-content,
         .dark-mode .scam-helper-dropdown-content {
             border-color: #555; background-color: #3a3a3a;
         }
         body.dark-mode .scam-helper-hide-section,
         .dark-mode .scam-helper-hide-section {
             border-top-color: #555;
         }

        body.dark-mode .scam-helper-checkbox-list input[type="checkbox"],
        body.dark-mode .scam-helper-hide-section input[type="checkbox"],
        .dark-mode .scam-helper-checkbox-list input[type="checkbox"],
        .dark-mode .scam-helper-hide-section input[type="checkbox"] {
            background-color: #555; border-color: #777;
        }
        body.dark-mode .scam-helper-checkbox-list input[type="checkbox"]:checked,
        body.dark-mode .scam-helper-hide-section input[type="checkbox"]:checked,
        .dark-mode .scam-helper-checkbox-list input[type="checkbox"]:checked,
        .dark-mode .scam-helper-hide-section input[type="checkbox"]:checked {
            background-color: #799427; border-color: #8fb137;
        }
        body.dark-mode .scam-helper-checkbox-list input[type="checkbox"]:checked::after,
        body.dark-mode .scam-helper-hide-section input[type="checkbox"]:checked::after,
        .dark-mode .scam-helper-checkbox-list input[type="checkbox"]:checked::after,
        .dark-mode .scam-helper-hide-section input[type="checkbox"]:checked::after { color: #fff; }

        body.dark-mode .scam-helper-checkbox-list label,
        body.dark-mode .scam-helper-hide-section label,
        .dark-mode .scam-helper-checkbox-list label,
        .dark-mode .scam-helper-hide-section label { color: #ccc; }

        body.dark-mode .scam-helper-target-disabled,
        .dark-mode .scam-helper-target-disabled {
            opacity: 0.5; background-color: #2a2a2a; border-left-color: #555;
        }
        body.dark-mode .scam-helper-target-disabled:not(.scam-helper-target-hidden) button[class*="commitButton"],
        .dark-mode .scam-helper-target-disabled:not(.scam-helper-target-hidden) button[class*="commitButton"] {
             background-color: #444 !important; border-color: #333 !important;
         }
        body.dark-mode .scam-helper-target-disabled:not(.scam-helper-target-hidden) button[class*="commitButton"] span[class*="title"],
        body.dark-mode .scam-helper-target-disabled:not(.scam-helper-target-hidden) button[class*="commitButton"] span[class*="nerve"],
        .dark-mode .scam-helper-target-disabled:not(.scam-helper-target-hidden) button[class*="commitButton"] span[class*="title"],
        .dark-mode .scam-helper-target-disabled:not(.scam-helper-target-hidden) button[class*="commitButton"] span[class*="nerve"] {
             color: #888 !important;
         }
    `);

    // --- Settings Management ---
    function loadSettings() {
        let settings = GM_getValue(SETTINGS_KEY, null);
        if (!settings || typeof settings !== 'object') {
             settings = { ...DEFAULT_SETTINGS };
        } else {
             let updated = false;
             TARGET_MARKS.forEach(mark => {
                 if (settings[mark] === undefined) {
                     settings[mark] = DEFAULT_SETTINGS[mark];
                     updated = true;
                 }
             });
             if (settings.hideUnselected === undefined) {
                 settings.hideUnselected = DEFAULT_SETTINGS.hideUnselected;
                 updated = true;
             }
             Object.keys(settings).forEach(key => {
                 if (!TARGET_MARKS.includes(key) && key !== 'hideUnselected') {
                     delete settings[key];
                     updated = true;
                 }
             });
             if (updated) saveSettings(settings);
        }
        return settings;
    }

    function saveSettings(settings) {
        GM_setValue(SETTINGS_KEY, settings);
    }

    // --- UI Creation ---
    let settingsModalOverlay = null;
    let settingsDropdownContent = null;
    let settingsDropdownToggle = null;

    function createSettingsButton(headerElement) {
        if (document.querySelector('.scam-helper-settings-button')) return;
        const button = document.createElement('button');
        button.className = 'scam-helper-settings-button';
        button.title = 'Scamming Helper Settings';
        button.textContent = 'Helper Settings';

        button.addEventListener('click', toggleSettingsModal);
        headerElement.appendChild(button);
        console.log("Settings button added.");
    }

    function createSettingsModal() {
        if (settingsModalOverlay) return;

        const settings = loadSettings();

        settingsModalOverlay = document.createElement('div');
        settingsModalOverlay.className = 'scam-helper-modal-overlay';

        const modalContent = document.createElement('div');
        modalContent.className = 'scam-helper-modal-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'scam-helper-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.title = 'Close Settings';
        closeButton.addEventListener('click', toggleSettingsModal);
        modalContent.appendChild(closeButton);

        settingsDropdownToggle = document.createElement('button');
        settingsDropdownToggle.className = 'scam-helper-modal-dropdown-toggle';
        settingsDropdownToggle.type = 'button';
        settingsDropdownToggle.textContent = 'Enabled Scam Targets';
        settingsDropdownToggle.addEventListener('click', toggleDropdown);
        modalContent.appendChild(settingsDropdownToggle);

        settingsDropdownContent = document.createElement('div');
        settingsDropdownContent.className = 'scam-helper-dropdown-content';

        const list = document.createElement('ul');
        list.className = 'scam-helper-checkbox-list';

        TARGET_MARKS.forEach(mark => {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `scam-helper-chk-${mark.replace(/\s+/g, '-')}`;
            checkbox.dataset.markName = mark;
            checkbox.checked = settings[mark] !== false;
            checkbox.addEventListener('change', handleCheckboxChange);

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = mark;

            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            list.appendChild(listItem);
        });

        settingsDropdownContent.appendChild(list);
        modalContent.appendChild(settingsDropdownContent);

        // --- Add Hide Unselected Checkbox Section ---
        const hideSection = document.createElement('div');
        hideSection.className = 'scam-helper-hide-section';

        const hideCheckbox = document.createElement('input');
        hideCheckbox.type = 'checkbox';
        hideCheckbox.id = 'scam-helper-chk-hide';
        hideCheckbox.checked = settings.hideUnselected === true;
        hideCheckbox.addEventListener('change', handleCheckboxChange);

        const hideLabel = document.createElement('label');
        hideLabel.htmlFor = hideCheckbox.id;
        hideLabel.textContent = 'Hide Unselected Targets';

        hideSection.appendChild(hideCheckbox);
        hideSection.appendChild(hideLabel);
        modalContent.appendChild(hideSection);

        // --- End Hide Section ---

        settingsModalOverlay.appendChild(modalContent);

        settingsModalOverlay.addEventListener('click', (event) => {
            if (event.target === settingsModalOverlay) {
                toggleSettingsModal();
            }
        });

        document.body.appendChild(settingsModalOverlay);
        console.log("Settings modal created.");
    }

    // --- Event Handlers ---
     function toggleSettingsModal() {
        if (!settingsModalOverlay) return;
        const display = settingsModalOverlay.style.display;
        settingsModalOverlay.style.display = (display === 'none' || display === '') ? 'flex' : 'none';
        if (settingsModalOverlay.style.display === 'none' && settingsDropdownContent) {
             settingsDropdownContent.classList.remove('open');
             settingsDropdownToggle.classList.remove('open');
             settingsDropdownContent.style.display = 'none';
        }
        console.log("Settings Modal toggled to:", settingsModalOverlay.style.display);
    }

    function toggleDropdown() {
        if (settingsDropdownContent && settingsDropdownToggle) {
            settingsDropdownContent.classList.toggle('open');
            settingsDropdownToggle.classList.toggle('open');
            settingsDropdownContent.style.display = settingsDropdownContent.classList.contains('open') ? 'block' : 'none';
             console.log("Dropdown toggled:", settingsDropdownContent.classList.contains('open'));
        } else {
            console.error("Dropdown elements not found for toggling.");
        }
    }


    function handleCheckboxChange() {
        const settings = loadSettings();
        const markCheckboxes = settingsModalOverlay.querySelectorAll('.scam-helper-checkbox-list input[type="checkbox"]');
        const hideCheckbox = settingsModalOverlay.querySelector('#scam-helper-chk-hide');

        markCheckboxes.forEach(chk => {
            settings[chk.dataset.markName] = chk.checked;
        });
        settings.hideUnselected = hideCheckbox.checked;

        saveSettings(settings);
        applyStylingAndPositioning(); // Update UI
        console.log("Settings saved:", settings);
    }

    // --- Target Manipulation ---
    function getMarkNameFromAriaLabel(ariaLabel) {
        if (!ariaLabel) return null;
        const match = ariaLabel.match(/^(.+?)\s+abandon$/i);
        return match ? match[1].trim() : null;
    }

    // Function to apply styling and adjust positioning
    function applyStylingAndPositioning() {
        const settings = loadSettings();
        const hideTargets = settings.hideUnselected === true;

        const targetListContainer = document.querySelector('div[class*="currentCrime"] div[class*="virtualList"]');
        if (!targetListContainer) {
            console.error("Target list container not found for applying visibility.");
            return;
        }

        const virtualItems = Array.from(targetListContainer.querySelectorAll(':scope > div[class*="virtualItem"]'));

        if (virtualItems.length === 0) {
            return;
        }

        console.log(`Applying styles and positioning for ${virtualItems.length} items. Hide unselected: ${hideTargets}`);

        let currentOffset = 0;

        virtualItems.forEach(itemElement => {
            const row = itemElement.querySelector('div[class*="crimeOptionWrapper"]'); // Find any crime option wrapper
            if (!row) { // If it's not a standard row (like backdrop or spacer), hide it if needed
                 if (hideTargets && itemElement.matches('div[class*="virtualItemsBackdrop"]')) {
                     itemElement.style.display = 'none';
                 } else {
                     // For other non-target rows (like "Farm", "Spam", "Awaiting"), keep them and update offset
                     itemElement.style.display = ''; // Ensure visible
                     itemElement.style.transform = `translateY(${currentOffset}px)`;
                     currentOffset += itemElement.offsetHeight || DEFAULT_ROW_HEIGHT; // Use actual or default height
                 }
                 return; // Skip further processing for non-target rows
            }

            // Now process target rows specifically
            if (!row.matches('[class*="target"]')) { // If it's "Farm" or "Spam" row
                 itemElement.style.display = ''; // Ensure visible
                 itemElement.style.transform = `translateY(${currentOffset}px)`;
                 currentOffset += itemElement.offsetHeight || DEFAULT_ROW_HEIGHT;
                 return;
            }

            // It's a target row, determine if enabled
            const avatarButton = row.querySelector('button[class*="avatarButton"]');
            let markName = null;
            let isEnabled = true;

            if (avatarButton) {
                markName = getMarkNameFromAriaLabel(avatarButton.getAttribute('aria-label'));
            }

            if (markName && TARGET_MARKS.includes(markName)) {
                isEnabled = settings[markName] !== false;
            } else {
                isEnabled = true; // Default unknown/unidentifiable marks to enabled
            }

            // Reset styles first
            row.classList.remove('scam-helper-target-disabled');
            itemElement.style.display = ''; // Reset display

            // Apply new state and position
            if (isEnabled) {
                itemElement.style.transform = `translateY(${currentOffset}px)`;
                currentOffset += itemElement.offsetHeight || DEFAULT_ROW_HEIGHT; // Use actual or default height
                // Ensure buttons are enabled
                row.querySelectorAll('button[class*="responseTypeButton"], .react-dropdown-default, button[class*="commitButton"], button[class*="avatarButton"]').forEach(el => {
                    el.style.pointerEvents = 'auto';
                    el.style.cursor = 'pointer';
                    el.style.opacity = '1';
                    if (el.matches('button[class*="commitButton"]')) el.disabled = false;
                });
            } else {
                // Target is disabled
                if (hideTargets) {
                    itemElement.style.display = 'none'; // Hide the parent item
                    // Do NOT increment offset
                } else {
                    row.classList.add('scam-helper-target-disabled'); // Grey out row
                    itemElement.style.transform = `translateY(${currentOffset}px)`; // Position it
                    currentOffset += itemElement.offsetHeight || DEFAULT_ROW_HEIGHT; // Increment offset even for greyed out
                    // Disable interactions except avatar
                    row.querySelectorAll('button[class*="responseTypeButton"], .react-dropdown-default, button[class*="commitButton"]').forEach(el => {
                        el.style.pointerEvents = 'none';
                        el.style.cursor = 'not-allowed';
                        el.style.opacity = '0.7';
                         if (el.matches('button[class*="commitButton"]')) el.disabled = true;
                    });
                     if(avatarButton) {
                         avatarButton.style.pointerEvents = 'auto';
                         avatarButton.style.cursor = 'pointer';
                         avatarButton.style.opacity = '1';
                     }
                }
            }
        });
        console.log(`Applied JS positioning. Final offset: ${currentOffset}`);
    }


    // --- Initialization and Observation ---
    let mainObserver = null;
    let targetListObserver = null;
    let initTimeout = null;
    let scriptInitialized = false;

    function initializeScript() {
        if (scriptInitialized) return;
        if (initTimeout) clearTimeout(initTimeout);

        const crimeRoot = document.querySelector('div[class*="crime-root"][class*="scamming-root"]');
        const headerElement = document.querySelector('div[class*="crimes-app-header"]');
        const targetListContainer = crimeRoot ? crimeRoot.querySelector('div[class*="currentCrime"] div[class*="virtualList"]') : null;

        if (!crimeRoot || !headerElement || !targetListContainer) {
            console.log("Still waiting for crime root, header, or list container...");
             if (!mainObserver || mainObserver.takeRecords().length === 0) {
                 initTimeout = setTimeout(initializeScript, 500);
             }
            return;
        }

        console.log("All elements found. Initializing script...");
        scriptInitialized = true;
        if (mainObserver) { mainObserver.disconnect(); mainObserver = null; console.log("Main observer disconnected.");}

        if (!document.querySelector('.scam-helper-settings-button')) {
             createSettingsButton(headerElement);
        }
        if (!settingsModalOverlay) {
             createSettingsModal();
        }

        applyStylingAndPositioning(); // Initial run

        if (!targetListObserver) {
            targetListObserver = new MutationObserver((mutationsList, observer) => {
                 let needsUpdate = false;
                 for (const mutation of mutationsList) {
                     if (mutation.type === 'childList' || mutation.type === 'subtree') {
                         needsUpdate = true;
                         break;
                     }
                 }
                if(needsUpdate) {
                    console.log("Target list potentially changed, re-applying visibility/positioning...");
                    requestAnimationFrame(() => {
                         setTimeout(applyStylingAndPositioning, 300); // Call the correct function
                    });
                }
            });

            targetListObserver.observe(targetListContainer, { childList: true, subtree: true });
            console.log("Target list observer attached.");
        }
    }

    // Main observer
    mainObserver = new MutationObserver((mutationsList, observer) => {
        if (scriptInitialized) {
             // Disconnect observer once initialized to prevent unnecessary checks
             observer.disconnect();
             console.log("Main observer disconnected post-init.");
             return;
        }
        // Check frequently if the required elements are present
        if (document.querySelector('div[class*="crime-root"][class*="scamming-root"]') &&
            document.querySelector('div[class*="crimes-app-header"]') &&
            document.querySelector('div[class*="currentCrime"] div[class*="virtualList"]'))
        {
            console.log("All required elements detected by main observer.");
            initializeScript();
        }
    });

    console.log("Attaching main observer to body.");
    mainObserver.observe(document.body, { childList: true, subtree: true });

    // Fallback check
    initTimeout = setTimeout(initializeScript, 3000);


    console.log("Torn Scamming Crime Helper v0.1.10 Loaded");

})();
