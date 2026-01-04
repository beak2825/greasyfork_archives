// ==UserScript==
// @name         React App to Yahoo Mail Sync (Gmail Version)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sync text from React app to Yahoo Mail
// @author       You
// @match        *://*.yahoo.com/*
// @match        *://localhost:*/*
// @match        *://192.168.30.1:*
// @match        *://10.*.*.*:*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.focus
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525088/React%20App%20to%20Yahoo%20Mail%20Sync%20%28Gmail%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525088/React%20App%20to%20Yahoo%20Mail%20Sync%20%28Gmail%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants for message types
    const MESSAGE_TYPES = {
        RECIPIENT: 'recipient',
        SUBJECT: 'subject',
        BODY: 'body'
    };

    // Debug logging function
    function debugLog(message) {
        console.log(`[Text Sync Debug] ${message}`);
    }

    // Function to determine message type from button text
    function getMessageType(buttonText) {
        const baseText = buttonText.split(':')[0].trim();
        if (baseText.startsWith('Recipient')) {
            return MESSAGE_TYPES.RECIPIENT;
        } else if (baseText.startsWith('Subject')) {
            return MESSAGE_TYPES.SUBJECT;
        } else if (baseText.startsWith('Body')) {
            return MESSAGE_TYPES.BODY;
        }
        return '';
    }

    // Function to update synced text
    function updateSyncedText(messageType, text) {
        if (messageType) {
            debugLog(`Storing text for type: ${messageType}`);
            GM_setValue('syncedText', {
                type: messageType,
                content: text,
                timestamp: Date.now()
            });
        }
    }

    // Function to check React app state
    function checkReactAppState() {
        // Check text content
        const selectedButton = document.querySelector('.context-button.selected');
        const textDisplay = document.querySelector('.text-display[contenteditable="true"]');

        if (selectedButton && textDisplay) {
            const messageType = getMessageType(selectedButton.textContent);
            const currentText = textDisplay.textContent;
            const lastSync = GM_getValue('syncedText');

            if (!lastSync || lastSync.content !== currentText) {
                updateSyncedText(messageType, currentText);
            }
        }

        // Check button states
        const sentButton = document.querySelector('.keyboard-button.sent');
        if (sentButton) {
            const lastTrigger = GM_getValue('buttonTrigger');
            if (sentButton.textContent === 'Sent!') {
                if (!lastTrigger || lastTrigger.status !== 'pending' || lastTrigger.action !== 'send') {
                    debugLog('Send button changed to Sent! status');
                    GM_setValue('buttonTrigger', {
                        timestamp: Date.now(),
                        status: 'pending',
                        action: 'send'
                    });

                    setTimeout(() => {
                        const normalButton = document.querySelector('.keyboard-button.sendemail.default');
                        if (normalButton && normalButton.textContent === 'Send Email') {
                            debugLog('Send button returned to normal, resetting trigger');
                            GM_setValue('buttonTrigger', {
                                timestamp: Date.now(),
                                status: 'reset',
                                action: 'send'
                            });
                        }
                    }, 2000);
                }
            } else if (sentButton.textContent === 'Start composing') {
                if (!lastTrigger || lastTrigger.status !== 'pending' || lastTrigger.action !== 'compose') {
                    debugLog('Compose button changed to Start composing status');
                    GM_setValue('buttonTrigger', {
                        timestamp: Date.now(),
                        status: 'pending',
                        action: 'compose'
                    });

                    setTimeout(() => {
                        const normalButton = document.querySelector('.keyboard-button.compose.default');
                        if (normalButton && normalButton.textContent === 'Compose') {
                            debugLog('Compose button returned to normal, resetting trigger');
                            GM_setValue('buttonTrigger', {
                                timestamp: Date.now(),
                                status: 'reset',
                                action: 'compose'
                            });
                        }
                    }, 2000);
                }
            }
        }
    }

    // Function to handle React app logic
    function handleReactApp() {
        debugLog('Initializing React app polling');
        setInterval(checkReactAppState, 500);
    }

    // Function to update Yahoo Mail elements
    function updateYahooMailElement(type, content) {
        let targetElement = null;
        let elementType = '';

        if (type === MESSAGE_TYPES.RECIPIENT) {
            targetElement = document.querySelector('#to');
            elementType = 'recipient';
        } else if (type === MESSAGE_TYPES.SUBJECT) {
            targetElement = document.querySelector('#subject');
            elementType = 'subject';
        } else if (type === MESSAGE_TYPES.BODY) {
            targetElement = document.querySelector('#editorPlainText');
            elementType = 'body';
        }

        if (targetElement) {
            debugLog(`Updating ${elementType} element with new content`);
            targetElement.value = content;
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            debugLog(`${elementType} element not found in Yahoo Mail`);
        }
    }

    // Function to handle Yahoo Mail logic
    function handleYahooMail() {
        let lastTimestamp = 0;
        let lastButtonTimestamp = 0;
        debugLog('Yahoo Mail handler initialized');

        setInterval(() => {
            // Check for button triggers
            const buttonTrigger = GM_getValue('buttonTrigger');
            if (buttonTrigger && buttonTrigger.timestamp > lastButtonTimestamp) {
                lastButtonTimestamp = buttonTrigger.timestamp;

                if (buttonTrigger.status === 'pending') {
                    if (buttonTrigger.action === 'send') {
                        debugLog('Send trigger received, looking for send button');
                        const sendButton = document.querySelector('button[name="action"][value="sendMessage"]');
                        if (sendButton) {
                            debugLog('Send button found, clicking it');
                            sendButton.click();
                        } else {
                            debugLog('Send button not found');
                        }
                    } else if (buttonTrigger.action === 'compose') {
                        debugLog('Compose trigger received, looking for compose button');
                        const composeButton = document.querySelector('a[data-test-id="compose-button"]');
                        if (composeButton) {
                            debugLog('Compose button found, clicking it');
                            composeButton.click();
                        } else {
                            debugLog('Compose button not found');
                        }
                    }
                } else if (buttonTrigger.status === 'reset') {
                    debugLog(`${buttonTrigger.action} trigger reset received`);
                }
            }

            // Regular text sync check
            const syncedData = GM_getValue('syncedText');
            if (syncedData && syncedData.timestamp > lastTimestamp) {
                lastTimestamp = syncedData.timestamp;
                debugLog(`New synced data received of type: ${syncedData.type}`);
                updateYahooMailElement(syncedData.type, syncedData.content);
            }
        }, 500);
    }

    // Add delay before initialization
    debugLog('Waiting 1000ms for page to load...');
    setTimeout(() => {
        if (window.location.hostname.includes('mail.yahoo.com')) {
            debugLog('Initializing Yahoo Mail handler');
            handleYahooMail();
        } else {
            debugLog('Initializing React app handler');
            handleReactApp();
        }
    }, 1000);
})();


