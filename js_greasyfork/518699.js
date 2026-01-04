// ==UserScript==
// @name         Discord/Shapes - Main Logic
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Handling the logic of Rules and Lorebook
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        unsafeWindow
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/518699/DiscordShapes%20-%20Main%20Logic.user.js
// @updateURL https://update.greasyfork.org/scripts/518699/DiscordShapes%20-%20Main%20Logic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check localStorage and reload if not ready
    function checkLocalStorageAndReload() {
        try {
            if (localStorage.length > 0) {
                console.log("LocalStorage has items. Proceeding with script...");
                initializeScript();
            } else {
                console.warn("LocalStorage is empty. Reloading page...");
                setTimeout(() => {
                    location.reload();
                }, 5000); // Wait 5 seconds before reloading
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            setTimeout(() => {
                location.reload();
            }, 5000); // Wait 5 seconds before reloading
        }
    }

    // Initial check for localStorage existence
    checkLocalStorageAndReload();

    function initializeScript() {
        // Retrieve settings from localStorage or set default values
        let enterKeyDisabled = JSON.parse(localStorage.getItem('enterKeyDisabled')) || false;
        let customRuleEnabled = JSON.parse(localStorage.getItem('customRuleEnabled')) || true;
        let scanForKeywordsEnabled = JSON.parse(localStorage.getItem('scanForKeywordsEnabled')) || true;

        // Create the settings window
        unsafeWindow.settingsWindow = document.createElement('div');
   //     settingsWindow.style.position = 'fixed';
        settingsWindow.style.bottom = '60px';
        settingsWindow.style.right = '20px';
        settingsWindow.style.width = '250px';
        settingsWindow.style.padding = '15px';
 //       settingsWindow.style.backgroundColor = '#2f3136';
        settingsWindow.style.color = 'white';
//        settingsWindow.style.border = '1px solid #5865F2';
        settingsWindow.style.borderRadius = '5px';
  //      settingsWindow.style.display = 'none';
        settingsWindow.style.zIndex = '1001';
        DCstoragePanel.appendChild(settingsWindow);
        // Custom Rule Checkbox
        const enableCustomRuleCheckbox = document.createElement('input');
        enableCustomRuleCheckbox.type = 'checkbox';
        enableCustomRuleCheckbox.checked = customRuleEnabled;
        enableCustomRuleCheckbox.id = 'enableCustomRuleCheckbox';

        const enableCustomRuleLabel = document.createElement('label');
        enableCustomRuleLabel.htmlFor = 'enableCustomRuleCheckbox';
        enableCustomRuleLabel.innerText = ' Enable Custom Rules';

        // Scan for Keywords Checkbox
        const enableScanForKeywordsCheckbox = document.createElement('input');
        enableScanForKeywordsCheckbox.type = 'checkbox';
        enableScanForKeywordsCheckbox.checked = scanForKeywordsEnabled;
        enableScanForKeywordsCheckbox.id = 'enableScanForKeywordsCheckbox';

        const enableScanForKeywordsLabel = document.createElement('label');
        enableScanForKeywordsLabel.htmlFor = 'enableScanForKeywordsCheckbox';
        enableScanForKeywordsLabel.innerText = ' Enable Lorebook';

        // Append elements to settings window
        settingsWindow.appendChild(enableCustomRuleCheckbox);
        settingsWindow.appendChild(enableCustomRuleLabel);
        settingsWindow.appendChild(document.createElement('br'));
        settingsWindow.appendChild(enableScanForKeywordsCheckbox);
        settingsWindow.appendChild(enableScanForKeywordsLabel);
  //      document.body.appendChild(settingsWindow);


        // Update customRuleEnabled when checkbox is toggled, and save it in localStorage
        enableCustomRuleCheckbox.addEventListener('change', function() {
            customRuleEnabled = enableCustomRuleCheckbox.checked;
            localStorage.setItem('customRuleEnabled', JSON.stringify(customRuleEnabled));
        });

        // Update scanForKeywordsEnabled when checkbox is toggled, and save it in localStorage
        enableScanForKeywordsCheckbox.addEventListener('change', function() {
            scanForKeywordsEnabled = enableScanForKeywordsCheckbox.checked;
            localStorage.setItem('scanForKeywordsEnabled', JSON.stringify(scanForKeywordsEnabled));
        });


// Function to get the correct input element based on the mode
// Function to get the correct input element based on the mode
// Function to get the correct input element based on the mode
function getInputElement() {
    return document.querySelector('[data-slate-editor="true"]') || document.querySelector('textarea[class*="textArea_"]');
}

// Add event listener to handle Enter key behavior
window.addEventListener('keydown', function(event) {
    const inputElement = getInputElement();

    if (event.key === 'Enter' && !event.shiftKey && !enterKeyDisabled) {
        if (inputElement && inputElement.nodeName === 'TEXTAREA') {
            // Mobile version: Only allow line break
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log('Enter key disabled');
        enterKeyDisabled = true;

        // Execute main handler for Enter key
        handleEnterKey();

        enterKeyDisabled = false;
    }
}, true); // Use capture mode to intercept the event before Discord's handlers

// Add event listener to the send button to execute handleEnterKey when clicked
window.addEventListener('click', function(event) {
    const sendButton = document.querySelector('button[aria-label="Nachricht senden"]');
    if (sendButton && sendButton.contains(event.target)) {
        // Execute main handler for Enter key
        handleEnterKey();
    }
}, true);

// Main function that handles Enter key behavior
function handleEnterKey() {
    let inputElement = getInputElement();
    if (inputElement) {
        inputElement.focus();
        setCursorToEnd(inputElement);
        if (customRuleEnabled) {
            applyCustomRule(inputElement);
        }
        setCursorToEnd(inputElement);
        if (scanForKeywordsEnabled) {
            scanForKeywords(inputElement);
        }
        getRandomEntry(inputElement);
        sendMessage(inputElement);
        anotherCustomFunction();
    }
}

// Function to apply custom rules for the input field
function applyCustomRule(inputElement) {
    const customRule = unsafeWindow.customRuleLogic ? unsafeWindow.customRuleLogic.getCurrentText() : '';

    if (inputElement.nodeName === 'TEXTAREA') {
        // For mobile version where input is <textarea>
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, inputElement.value + customRule);

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        inputElement.dispatchEvent(inputEvent);
    } else {
        // For desktop version where input is a Slate editor
        const inputEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: customRule,
        });
        inputElement.dispatchEvent(inputEvent);
    }
}

// Function to set the cursor position to the end after inserting the text
function setCursorToEnd(inputElement) {
    if (inputElement.nodeName === 'TEXTAREA') {
        // For mobile version where input is <textarea>
        inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
    } else {
        // For desktop version where input is a Slate editor
        inputElement.focus();

        // Simulate repeated Ctrl + ArrowRight key press events to move cursor to the end
        const repeatPresses = 150; // Number of times to simulate Ctrl + ArrowRight
        for (let i = 0; i < repeatPresses; i++) {
            const ctrlArrowRightEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39, // ArrowRight key code
                charCode: 0,
                which: 39,
                bubbles: true,
                cancelable: true,
                ctrlKey: true // Set Ctrl key to true
            });
            inputElement.dispatchEvent(ctrlArrowRightEvent);
        }
    }
}

// Function to send the message (either click send button or simulate Enter key)
function sendMessage(inputElement) {
    if (inputElement.nodeName === 'TEXTAREA') {
        // Mobile version: Do not send message, just return to allow linebreak
        return;
    }

    let sendButton = document.querySelector('button[aria-label="Nachricht senden"]');
    if (sendButton) {
        sendButton.click();
        console.log('Send button clicked to send message');
    } else {
        // For desktop version, simulate pressing Enter to send the message
        let enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        inputElement.dispatchEvent(enterEvent);
        console.log('Enter key simulated to send message');
    }
}



// Example of adding another function
function anotherCustomFunction() {
    console.log('Another custom function executed');
}

// Function to scan for keywords and access local storage
function scanForKeywords(inputElement) {
    const currentProfile = getCurrentProfile();
    if (currentProfile) {
        // Retrieve all messages before iterating through storage keys
        const messageItems = document.querySelectorAll('div[class*="messageContent_"]');
        let relevantMessages = Array.from(messageItems).slice(-15); // Last 15 messages
        const lastMessage = Array.from(messageItems).slice(-1); // Last message only


// Iterate over the last 15 messages to extract hidden bracket content
relevantMessages = relevantMessages.map(msg => {
    // Retrieve all span elements within the message
    const spans = msg.querySelectorAll('span');

    // Filter out the spans based on both style conditions: opacity and position
    const hiddenSpans = Array.from(spans).filter(span => {
        const style = window.getComputedStyle(span);
        return style.opacity === '0' && style.position === 'absolute';
    });

    // Join the text content of all matching spans
    const bracketContent = hiddenSpans.map(span => span.textContent).join('');

    // Extract content within square brackets, if any
    const match = bracketContent.match(/\[(.*?)\]/);
    return match ? match[1] : null;
}).filter(content => content !== null);

// Log the filtered messages for debugging purposes
console.log("Filtered Relevant Messages (content in brackets, last 15):", relevantMessages);
        console.log("Last Message:", lastMessage.map(msg => msg.textContent));

        // Track how many entries have been appended
        let appendedCount = 0;
        const maxAppends = 3;

        // Check if the last message contains a specific link pattern
        const mp3LinkPattern = /https:\/\/files\.shapes\.inc\/.*\.mp3/;
        let mp3LinkValue = null;

        if (lastMessage.length > 0) {
            const lastMessageText = lastMessage[0].textContent;
            const mp3LinkMatch = lastMessageText.match(mp3LinkPattern);
            if (mp3LinkMatch) {
                const mp3LinkKey = mp3LinkMatch[0];
                mp3LinkValue = localStorage.getItem(mp3LinkKey);
                console.log(`MP3 Link detected: ${mp3LinkKey}. Retrieved value: ${mp3LinkValue}`);
            }
        }

        // Create an array to hold all entry keys that need to be checked
        let allEntryKeys = [];

        // Iterate through all localStorage keys that match the profile-lorebook prefix
        Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith(`${currentProfile}-lorebook:`)) {
                const entryKeys = storageKey.replace(`${currentProfile}-lorebook:`, '').split(',');
                const entryValue = localStorage.getItem(storageKey);

                // Log the entry keys for debugging purposes
                console.log(`Entry Keys: `, entryKeys);

                entryKeys.forEach(entryKey => {
                    allEntryKeys.push({ entryKey, entryValue });
                });
            }
        });

        // If mp3LinkValue is present, parse it for keywords as well
        if (mp3LinkValue) {
            console.log(`Scanning MP3 link value for keywords: ${mp3LinkValue}`);
            const mp3Keywords = mp3LinkValue.split(',');
            mp3Keywords.forEach(keyword => {
                const trimmedKeyword = keyword.trim();
                console.log(`Adding keyword from MP3 value: ${trimmedKeyword}`);
                // Add mp3 keywords but set entryValue to an empty string instead of null
                allEntryKeys.push({ entryKey: trimmedKeyword, entryValue: '' });
            });
        }

        // Iterate over all collected entry keys and perform the checks
        allEntryKeys.forEach(({ entryKey, entryValue }) => {
            if (appendedCount >= maxAppends) return; // Stop if max appends reached

            // Log each keyword being checked
            console.log(`Checking keyword: ${entryKey}`);

            // Check input element text for complete word match of keyword (case-insensitive)
            const inputText = inputElement.value || inputElement.textContent;

            // Combine check for keyword in input, in the last message, or in the mp3 link value
            const isKeywordInInput = inputText && new RegExp(`\\b${entryKey}\\b`, 'i').test(inputText);
            const isKeywordInLastMessage = lastMessage.some(message => {
                const lastMessageText = message.textContent;
                return new RegExp(`\\b${entryKey}\\b`, 'i').test(lastMessageText);
            });
            const isKeywordInMp3LinkValue = mp3LinkValue && mp3LinkValue.includes(entryKey);

            console.log(`Keyword '${entryKey}' in input: ${isKeywordInInput}, in last message: ${isKeywordInLastMessage}, in MP3 value: ${isKeywordInMp3LinkValue}`);

            if ((isKeywordInInput || isKeywordInLastMessage || isKeywordInMp3LinkValue) && entryValue) {
                const keywordAlreadyUsed = relevantMessages.some(bracketContent => {
                    return new RegExp(`\\b${entryKey}\\b`, 'i').test(bracketContent);
                });

                if (!keywordAlreadyUsed) {
                    // Append the entryValue to the input element only if entryValue is not null or empty
                    if (inputElement.nodeName === 'TEXTAREA') {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                        nativeInputValueSetter.call(inputElement, inputElement.value + '\n' + entryValue);

                        const inputEvent = new Event('input', {
                            bubbles: true,
                            cancelable: true,
                        });
                        inputElement.dispatchEvent(inputEvent);
                    } else {
                        const inputEvent = new InputEvent('beforeinput', {
                            bubbles: true,
                            cancelable: true,
                            inputType: 'insertText',
                            data: '\n' + entryValue,
                        });
                        inputElement.dispatchEvent(inputEvent);
                    }
                    appendedCount++; // Increment the count
                    console.log(`Keyword '${entryKey}' detected. Appended lorebook entry to the input.`);
                } else {
                    console.log(`Keyword '${entryKey}' already found in recent bracketed messages or entryValue is null/empty. Skipping append.`);
                }
            }
        });

        // Log the total number of entries appended
        console.log(`Total lorebook entries appended: ${appendedCount}`);
    }
}


// Function to get the current profile from local storage
function getCurrentProfile() {
    return localStorage.getItem('currentProfile');
}


function getRandomEntry(inputElement) {
    const selectedProfile = localStorage.getItem('events.selectedProfile');
    if (selectedProfile) {
        let profileEntries = [];
        const currentHour = new Date().getHours();
for (let key in localStorage) {
    if (key.startsWith(`events.${selectedProfile}:`)) {
        const entryData = JSON.parse(localStorage.getItem(key));
        const [startHour, endHour] = entryData.timeRange.split('-').map(Number);
        // Check if current hour is within the time range
        if (
            (startHour <= endHour && currentHour >= startHour && currentHour < endHour) || // Normal range
            (startHour > endHour && (currentHour >= startHour || currentHour < endHour)) // Crosses midnight
        ) {
            profileEntries.push({ key, ...entryData });
        }
    }
}

        if (profileEntries.length > 0) {
            const probability = parseInt(localStorage.getItem('events.probability') || '100', 10);
            let selectedEntry = null;
            while (profileEntries.length > 0) {
                // Randomly select an entry from the available entries
                const randomIndex = Math.floor(Math.random() * profileEntries.length);
                const randomEntry = profileEntries[randomIndex];
                // Check if the entry passes the individual probability check
                if (Math.random() * 100 < randomEntry.probability) {
                    selectedEntry = randomEntry;
                    break;
                } else {
                    // Remove the entry from the list if it fails the probability check
                    profileEntries.splice(randomIndex, 1);
                }
            }
            if (selectedEntry && Math.random() * 100 < probability) {
                console.log(`Random Entry Selected: ${selectedEntry.value}`);
                appendToInput(inputElement, selectedEntry.value); // Append the random entry to the input element
            }
        } else {
            console.log('No entries available for the selected profile in the current time range.');
        }
    } else {
        console.log('No profile selected. Please select a profile to retrieve a random entry.');
    }
}

// Helper function to append text to the input element
function appendToInput(inputElement, text) {
    const lineBreak = '\n';
    if (!inputElement) {
        console.error('Input element not found.');
        return;
    }

    if (inputElement.nodeName === 'TEXTAREA') {
        // Mobile: Append text to <textarea>
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, inputElement.value + `${lineBreak}${text}`);

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        inputElement.dispatchEvent(inputEvent);
    } else if (inputElement.hasAttribute('data-slate-editor')) {
        // Desktop: Append text for Slate editor
        const inputEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: `${lineBreak}${text}`,
        });
        inputElement.dispatchEvent(inputEvent);
    } else {
        console.error('Unsupported input element type.');
    }
}



// Expose the function to be accessible from other scripts
unsafeWindow.getRandomEntry = getRandomEntry;


  }
})();
