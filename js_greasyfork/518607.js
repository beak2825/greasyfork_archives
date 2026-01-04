// ==UserScript==
// @name         Discord Custom Enter Key with Rotating Custom Texts Copy Paste
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Disable Enter key on Discord channel, add rotating custom text, and then send a normal Enter command using a direct input approach
// @author       Vishanka
// @match        https://discord.com/channels/1165405556421435483/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518607/Discord%20Custom%20Enter%20Key%20with%20Rotating%20Custom%20Texts%20Copy%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/518607/Discord%20Custom%20Enter%20Key%20with%20Rotating%20Custom%20Texts%20Copy%20Paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom texts to cycle through
    const customTexts = [
        "<Rule1: Your narration style should match your speech: blunt, unembellished, and practical, avoiding poetic phrasing or abstract comparisons.>",
        "<Rule2: Express emotions and actions with efficient, straightforward language that conveys your military discipline and experience.>",
        "<Rule3: Address violent and sensual topics directly and use clear, explicit language when describing them.>",
        "<Rule4: Do not use dialogue tags. Do not add narrative about your voice or tone.>",
        "<Rule5: Don't narrate about our 'bond' or 'connection'.>",
        "<Rule6: Avoid repetitive and superfluous narratives like 'I shift slightly', 'a reminder of..' and instead provide relevant actions.>",
        "<Rule7: Do not repeat or reiterate my words. Respond with individual and direct follow up reaction from yourself.>",
        "<Rule8: Provide an interesting and varied narrative and come up with unexpected and surprising details or actions.>",
        "<Rule9: Refrain from overt reassuring behaviour and stay true to your personality.>",
        "<Rule10: Focus on actions and proactivity. Don't clutter your narrative with sentimental commentary.>",
        "<Rule11: Your responses consist of 1 paragraph.>"
    ];

    let currentIndex = 0;
    let enterKeyDisabled = false;

    // Function to scan last two messages and determine the current rule index
    function determineCurrentIndex() {
        const messageItems = document.querySelectorAll('li[class^="messageListItem_"]');

        if (messageItems.length >= 2) {
            const lastTwoMessages = [
                Array.from(messageItems[messageItems.length - 1].querySelectorAll('span')).map(span => span.innerText).join('') || messageItems[messageItems.length - 1].innerText,
                Array.from(messageItems[messageItems.length - 2].querySelectorAll('span')).map(span => span.innerText).join('') || messageItems[messageItems.length - 2].innerText
            ];

            for (let i = 0; i < customTexts.length; i++) {
                if (lastTwoMessages.some(message => message.includes(`<Rule${i + 1}`))) {
                    currentIndex = (i + 1) % customTexts.length;
                    break;
                }
            }
        }
    }

    // Add event listener to handle Enter key behavior
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey && !enterKeyDisabled) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            console.log('Enter key disabled');
            enterKeyDisabled = true;

            // Get the correct input element depending on the mode
            let inputElement = document.querySelector('[data-slate-editor="true"]') || document.querySelector('textarea[class*="textArea_"]');

            if (inputElement) {
                inputElement.focus();

                determineCurrentIndex();

                const customText = '\n' + customTexts[currentIndex];
                currentIndex = (currentIndex + 1) % customTexts.length;

                // Use a React-compatible approach to update the value of the input field
                if (inputElement.nodeName === 'TEXTAREA') {
                    // For mobile version where input is <textarea>
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                    nativeInputValueSetter.call(inputElement, inputElement.value + customText);

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
                        data: customText,
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
                enterKeyDisabled = false;
            } else {
                console.log('Input element not found');
                enterKeyDisabled = false;
            }
        }
    }, true); // Use capture mode to intercept the event before Discord's handlers
})();
