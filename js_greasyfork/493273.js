// ==UserScript==
// @name         ClintBetterScheduledMessages
// @namespace    ClintAddons
// @version      1.0.10
// @description  Adds template support for Clint scheduled messages.
// @author       Renato Bispo
// @match        https://app.clint.digital/chat
// @icon         https://assets-global.website-files.com/5f906e5e35f79f2a13828e8b/630be88d07ee33f2c1a4571e_clint-icone.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493273/ClintBetterScheduledMessages.user.js
// @updateURL https://update.greasyfork.org/scripts/493273/ClintBetterScheduledMessages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // State
    let shouldSetupPasteHandler = true;
    
    // Helpers
    const log = (message) => console.log(`[ClintBetterScheduledMessages] ${message}`);

    // Element selectors
    const customerNameSelector = '.message-area-header span';
    const scheduleMsgTextAreaSelector = '.schedule-message-modal textarea';

    // Selector functions
    const getFirstName = () => {
        const nameRaw = document.querySelector(customerNameSelector).innerHTML.split(' ')[0];

        const [firstLetter, ...restOfName] = nameRaw.split('');

        return `${firstLetter.toUpperCase()}${restOfName.join('').toLowerCase()}`
    }
    const getScheduleMsgTextArea = () => document.querySelector(scheduleMsgTextAreaSelector)

    // Paste handler setup function
    const setupPasteHandler = () => {
        shouldSetupPasteHandler = false;
        log('Setting up paste handler...');
        const scheduledMsgTextArea = getScheduleMsgTextArea();
        
        const pasteHandler = (event) => {
            log('Handling paste...');
            event.preventDefault();

            const clipboardData = (event.clipboardData || window.clipboardData).getData('text');
            const firstName = getFirstName();
            const transformedClipboardData = clipboardData.replace('[CONTACT.FIRST_NAME]', firstName);

            const nativeTextAreaValueSetter = Object
            .getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

            nativeTextAreaValueSetter.call(scheduledMsgTextArea, transformedClipboardData);

            const inputEvent = new Event('input', { bubbles: true});
            scheduledMsgTextArea.dispatchEvent(inputEvent);
        }

        scheduledMsgTextArea.removeEventListener('paste', pasteHandler);
        scheduledMsgTextArea.addEventListener('paste', pasteHandler);
        log('Finished setting up paste handler.');
    }

    const observerTarget = document;
    const observerConfig = { attributes: false, childList: true, subtree: true };
    const observerCallback = () => {
        const scheduleMsgTextArea = getScheduleMsgTextArea();

        if (scheduleMsgTextArea) {
            shouldSetupPasteHandler && setupPasteHandler();
        } else {
            shouldSetupPasteHandler = true;
        }
    }

    const observer = new MutationObserver(observerCallback);

    observer.observe(observerTarget, observerConfig);
})();