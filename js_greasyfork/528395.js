// ==UserScript==
// @name         Google Gemini <Think> remover
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  Removes all THINK text from the feed cleaning up the chat without all the think spam.
// @author       Gemini 2.0 Flash Thinking Pro Experimental 02-28
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528395/Google%20Gemini%20%3CThink%3E%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/528395/Google%20Gemini%20%3CThink%3E%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    const defaultSettings = {
        showThinkingProcess: true,
    };

    // **Ensure default settings are saved on first run**
    for (const key in defaultSettings) {
        if (GM_getValue(key) === undefined) {
            GM_setValue(key, defaultSettings[key]);
        }
    }

    // Initialize settings
    let settings = {
        useCustomStyles: GM_getValue('useCustomStyles', defaultSettings.useCustomStyles),
        showUserPrompts: GM_getValue('showUserPrompts', defaultSettings.showUserPrompts),
        showThinkingProcess: GM_getValue('showThinkingProcess', defaultSettings.showThinkingProcess),
        showSystemInstructions: GM_getValue('showSystemInstructions', defaultSettings.showSystemInstructions),
        showInputBox: GM_getValue('showInputBox', defaultSettings.showInputBox)
    };

    // Menu Definition (similar to example)
    var menu_ALL = [
        [
            "useCustomStyles",
            "Custom Styles",
        ],
        [
            "showUserPrompts",
            "User Messages Display",
        ],
        [
            "showThinkingProcess",
            "Thinking Process Display",
        ],
        [
            "showSystemInstructions",
            "System Instructions Display",
        ],
        [
            "showInputBox",
            "Input Box Display",
        ],
        [
            "toggleAllDisplays", // Special key for toggle all
            "Toggle All Displays",
        ],
    ];
    var menu_ID = []; // Array to store menu command IDs for unregistering

    // Custom styles (no changes needed here)
    const customStyles = `
        .chunk-editor-main {
            background: #e6e5e0 !important;
            font-size: 2em !important;
        }
        .chunk-editor-main p {
            font-family: "Times New Roman", "思源宋体 CN", 文泉驿等宽微米黑, "FZLanTingKanSongK" !important;
        }
        .user-prompt-container .text-chunk {
            background: #d6d5b7 !important;
        }
        .model-prompt-container {
            background: #f3f2ee !important;
            padding: 15px !important;
            border-radius: 16px !important;
        }
        .model-prompt-container:has(.mat-accordion) {
            background: none !important;
        }
        .turn-footer {
            font-size: 10px !important;
            background: none !important;
        }
        .user-prompt-container p {
            font-size: 15px !important;
            line-height: 1.3 !important;
        }
        .model-prompt-container p {
            font-size: 20px !important;
            line-height: 2 !important;
        }
        .mat-accordion p {
            font-size: 15px !important;
        }
    `;

    const hideUserPromptsStyle = `
        .chat-turn-container:has(.user-prompt-container) {
            display: none !important;
        }
    `;

    const hideThinkingProcessStyle = `
    .response-content .model-thoughts { /* More specific selector */
        display: none !important;
    }
`;
    const hideSystemInstructionsStyle = `
        .system-instructions {
            display: none !important;
        }
    `;

    const hideInputBoxStyle = `
        footer:has(.prompt-input-wrapper){
            display: none !important;
        }
    `;


    // Function to apply styles based on settings (no changes needed here)
    function updateStyles() {
        // Remove existing style elements
        const existingStyles = document.querySelectorAll('style[data-custom-styles]');
        existingStyles.forEach(style => style.remove());

        // Apply custom styles if enabled
        if (settings.useCustomStyles) {
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-custom-styles', 'base');
            styleElement.textContent = customStyles;
            document.head.appendChild(styleElement);
        }

        // Apply user prompts visibility style if hidden
        if (!settings.showUserPrompts) {
            const hideUserStyle = document.createElement('style');
            hideUserStyle.setAttribute('data-custom-styles', 'user-visibility');
            hideUserStyle.textContent = hideUserPromptsStyle;
            document.head.appendChild(hideUserStyle);
        }

        // Apply thinking process visibility style if hidden
        if (!settings.showThinkingProcess) {
            const hideThinkingStyle = document.createElement('style');
            hideThinkingStyle.setAttribute('data-custom-styles', 'thinking-visibility');
            hideThinkingStyle.textContent = hideThinkingProcessStyle;
            document.head.appendChild(hideThinkingStyle);
        }

        // Apply system instructions visibility style if hidden
        if (!settings.showSystemInstructions) {
            const hideSystemInstructions = document.createElement('style');
            hideSystemInstructions.setAttribute('data-custom-styles', 'system-instructions-visibility');
            hideSystemInstructions.textContent = hideSystemInstructionsStyle;
            document.head.appendChild(hideSystemInstructions);
        }

        // Apply input box visibility style if hidden
        if (!settings.showInputBox) {
            const hideInputBox = document.createElement('style');
            hideInputBox.setAttribute('data-custom-styles', 'input-box-visibility');
            hideInputBox.textContent = hideInputBoxStyle;
            document.head.appendChild(hideInputBox);
        }
    }

    // Function to show a floating notification (no changes needed here)
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999; /* Make sure it's on top */
            opacity: 1;
            transition: opacity 1s ease-in-out;
        `;
        document.body.appendChild(notification);

        // Fade out and remove after 1 second
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 1000); // Wait for fade out transition to complete (1s)
        }, 1000); // Show for 1 second
    }


    // Register script menus
    function registerMenuCommand() {
        console.log("[AI Studio Enhancer] - registerMenuCommand, menu_ALL : ", menu_ALL);
        for (let i = 0; i < menu_ID.length; i++) {
            GM_unregisterMenuCommand(menu_ID[i]); // Unregister previous commands
        }
        menu_ID = []; // Clear the menu_ID array

        for (let i = 0; i < menu_ALL.length; i++) {
            const localStorageKeyName = menu_ALL[i][0];
            const baseMenuText = menu_ALL[i][1];

            if (localStorageKeyName === "toggleAllDisplays") {
                // Handle "Toggle All Displays" menu text specifically
                const displaySettingsKeys = ["showUserPrompts", "showThinkingProcess", "showSystemInstructions", "showInputBox"];
                // Determine current "all displays" state based on the first setting (e.g., showUserPrompts)
                const currentAllDisplaysState = settings[displaySettingsKeys[0]];
                // Corrected menu text:
                const menuText = `${currentAllDisplaysState ? "🔴 Disable All Displays" : "🟢 Enable All Displays"}`;
                menu_ID.push(GM_registerMenuCommand(
                    menuText,
                    function () {
                        toggleAllDisplays(); // Call toggleAllDisplays function
                    }
                ));
            } else {
                const currentSettingValue = GM_getValue(localStorageKeyName, defaultSettings[localStorageKeyName]); // Get current setting
                const menuText = `${currentSettingValue ? "🔴 Disable" : "🟢 Enable"} ${baseMenuText}`; // Dynamic menu text
                menu_ID.push(GM_registerMenuCommand(
                    menuText,
                    function () {
                        menuSwitch(localStorageKeyName); // Call menuSwitch with the key
                    }
                ));
            }
        }
    }


    //切换单个选项
    function menuSwitch(localStorageKeyName) {
        let currentValue = GM_getValue(localStorageKeyName);
        let newValue = !currentValue; // Toggle the boolean value

        settings[localStorageKeyName] = newValue; // Update settings object
        GM_setValue(localStorageKeyName, newValue); // Save to GM_setValue

        updateStyles(); // Apply style changes
        registerMenuCommand(); // Re-register menus to update text and emoji

        const baseMenuText = menu_ALL.find(item => item[0] === localStorageKeyName)[1]; // Find base text for notification
        showNotification(`${baseMenuText} ${newValue ? 'Enabled' : 'Disabled'}`); // Show notification
    }

    // 切换全部显示项
    function toggleAllDisplays() {
        const displaySettingsKeys = ["showUserPrompts", "showThinkingProcess", "showSystemInstructions", "showInputBox"];
        // Determine the new state - if any is enabled, disable all, otherwise enable all
        const enableAll = !settings[displaySettingsKeys[0]]; // Toggle based on the first setting

        displaySettingsKeys.forEach(key => {
            settings[key] = enableAll;
            GM_setValue(key, enableAll);
        });

        updateStyles();
        registerMenuCommand(); // Update menus to reflect new states

        showNotification(`All Displays ${enableAll ? 'Enabled' : 'Disabled'}`);
    }


    // Initial style application
    updateStyles();
    // Initial menu command registration
    registerMenuCommand();


    // Watch for dynamic content changes (no changes needed here, but keep it)
    const observer = new MutationObserver(() => {
        updateStyles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();