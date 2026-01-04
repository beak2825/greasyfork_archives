// ==UserScript==
// @name         Discord/Shapes - Send Function with UI Toggle
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Part 2: Sending function for custom texts on Discord, with UI toggle
// @author       Vishanka
// @match        https://discord.com/channels/1165405556421435483/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518639/DiscordShapes%20-%20Send%20Function%20with%20UI%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/518639/DiscordShapes%20-%20Send%20Function%20with%20UI%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enterKeyDisabled = false;
    let customRuleEnabled = true; // Variable to enable/disable custom rule

    // Create and add the UI button
    const uiButton = document.createElement('button');
    uiButton.innerHTML = 'Toggle Custom Rule';
    uiButton.style.position = 'fixed';
    uiButton.style.bottom = '20px';
    uiButton.style.right = '20px';
    uiButton.style.zIndex = '1000';
    uiButton.style.padding = '10px';
    uiButton.style.backgroundColor = '#5865F2';
    uiButton.style.color = 'white';
    uiButton.style.border = 'none';
    uiButton.style.borderRadius = '5px';
    uiButton.style.cursor = 'pointer';

    document.body.appendChild(uiButton);

    // Create the settings window
    const settingsWindow = document.createElement('div');
    settingsWindow.style.position = 'fixed';
    settingsWindow.style.bottom = '60px';
    settingsWindow.style.right = '20px';
    settingsWindow.style.width = '200px';
    settingsWindow.style.padding = '15px';
    settingsWindow.style.backgroundColor = '#2f3136';
    settingsWindow.style.color = 'white';
    settingsWindow.style.border = '1px solid #5865F2';
    settingsWindow.style.borderRadius = '5px';
    settingsWindow.style.display = 'none';
    settingsWindow.style.zIndex = '1001';

    const enableCustomRuleCheckbox = document.createElement('input');
    enableCustomRuleCheckbox.type = 'checkbox';
    enableCustomRuleCheckbox.checked = customRuleEnabled;
    enableCustomRuleCheckbox.id = 'enableCustomRuleCheckbox';

    const enableCustomRuleLabel = document.createElement('label');
    enableCustomRuleLabel.htmlFor = 'enableCustomRuleCheckbox';
    enableCustomRuleLabel.innerText = ' Enable Custom Rule';

    settingsWindow.appendChild(enableCustomRuleCheckbox);
    settingsWindow.appendChild(enableCustomRuleLabel);
    document.body.appendChild(settingsWindow);

    // Event listener to open/close settings window
    uiButton.addEventListener('click', function() {
        settingsWindow.style.display = settingsWindow.style.display === 'none' ? 'block' : 'none';
    });

    // Update customRuleEnabled when checkbox is toggled
    enableCustomRuleCheckbox.addEventListener('change', function() {
        customRuleEnabled = enableCustomRuleCheckbox.checked;
    });

    // Add event listener to handle Enter key behavior
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey && !enterKeyDisabled && customRuleEnabled) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            console.log('Enter key disabled');
            enterKeyDisabled = true;

            // Get the correct input element depending on the mode
            let inputElement = document.querySelector('[data-slate-editor="true"]') || document.querySelector('textarea[class*="textArea_"]');

            if (inputElement) {
                inputElement.focus();

                // Get custom text from the first script
                const customRule = window.customRuleLogic.getCurrentText();

                // Use a React-compatible approach to update the value of the input field
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

                // Set the cursor position to the end after inserting the text
                if (inputElement.nodeName === 'TEXTAREA') {
                    inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
                } else {
                    const range = document.createRange();
                    range.selectNodeContents(inputElement);
                    range.collapse(false);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }

                // For mobile version, click the send button after adding text
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


                // Wait for scanForKeywords function to be available, then execute it
                let attemptCount = 0;
                const maxAttempts = 50;
                const waitForScanForKeywords = setInterval(function() {
                    attemptCount++;
                    console.log(`Waiting for scanForKeywords function... Attempt ${attemptCount}`);
                    if (typeof window.scanForKeywords === 'function') {
                        console.log('scanForKeywords function found');
    console.log('scanForKeywords function found');
                        clearInterval(waitForScanForKeywords);
                        console.log('Stopped waiting for scanForKeywords function.');
                        window.scanForKeywords();
                        console.log('Keywords scanned');
                    }
                if (attemptCount >= maxAttempts) {
                        clearInterval(waitForScanForKeywords);
                        console.error('scanForKeywords function not found within the time limit.');
                    }
                }, 100); // Check every 100ms

                enterKeyDisabled = false;
            } else {
                console.log('Input element not found');
                enterKeyDisabled = false;
            }
        }
    }, true); // Use capture mode to intercept the event before Discord's handlers
})();