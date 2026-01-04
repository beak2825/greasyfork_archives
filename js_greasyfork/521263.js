// ==UserScript==
// @name         Slack Conversation Scraper & Custom Buttons
// @version      2.7.1
// @description  Combines conversation scraper and custom message buttons with smooth UI and arrow key toggle animation.
// @author       Mahmudul Hasan Shawon
// @icon         https://www.slack.com/favicon.ico
// @match        https://app.slack.com/client/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1392874
// @downloadURL https://update.greasyfork.org/scripts/521263/Slack%20Conversation%20Scraper%20%20Custom%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/521263/Slack%20Conversation%20Scraper%20%20Custom%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const buttons = [
        { id: 'goodMorningButton', text: 'GM!', message: 'Good morning!' },
        { id: 'okButton', text: 'Ok', message: 'Ok' },
        { id: 'scrapeConversationButton', text: '📋 Scrape All', message: '' },
        { id: 'copyConversationButton', text: '✨ Guess Reply', message: '' },
    ];

    function waitForSlackInterface() {
        const checkInterval = setInterval(() => {
            const textBox = document.querySelector('[data-message-input="true"] .ql-editor');
            if (textBox) {
                clearInterval(checkInterval);
                addControlBox();
            }
        }, 1000);
    }

    function addControlBox() {
        const controlBox = document.createElement('div');
        Object.assign(controlBox.style, {
            position: 'fixed',
            bottom: '35px',
            right: '100px',
            width: '200px',
            padding: '15px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Arial, sans-serif',
            zIndex: '9999',
            transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            transform: 'translateY(0)',
            opacity: '1',
        });
        controlBox.id = 'slackControlBox';

        const toggleButton = document.createElement('div');
        Object.assign(toggleButton.style, {
            position: 'fixed',
            bottom: '46px',
            right: '120px',
            width: '36px',
            height: '36px',
            backgroundColor: '#C3FF93',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '10000',
        });
        toggleButton.innerHTML = `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M12 3v18" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        toggleButton.title = 'Hide/Show Control Box';
        toggleButton.addEventListener('click', () => toggleControlBox(controlBox));

        document.body.appendChild(toggleButton);

        const sideBySideContainer = document.createElement('div');
        Object.assign(sideBySideContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '10px',
        });

        const goodMorningButton = createButton(buttons[0]);
        const okButton = createButton(buttons[1]);
        goodMorningButton.style.flex = '1';
        okButton.style.flex = '1';

        sideBySideContainer.appendChild(goodMorningButton);
        sideBySideContainer.appendChild(okButton);
        controlBox.appendChild(sideBySideContainer);

        buttons.slice(2).forEach((btn) => {
            const button = createButton(btn);
            controlBox.appendChild(button);
        });

        const inputField = createInputField();
        controlBox.appendChild(inputField);

        document.body.appendChild(controlBox);

        // Add keyboard toggle functionality
        document.addEventListener('keydown', (e) => handleKeyPress(e, controlBox));
    }

    function toggleControlBox(controlBox) {
        const isHidden = controlBox.style.opacity === '0';
        controlBox.style.opacity = isHidden ? '1' : '0';
        controlBox.style.transform = isHidden ? 'translateY(0)' : 'translateY(20px)';
    }

    function handleKeyPress(event, controlBox) {
        if (event.key === 'ArrowDown') {
            controlBox.style.opacity = '0';
            controlBox.style.transform = 'translateY(20px)';
        } else if (event.key === 'ArrowUp') {
            controlBox.style.opacity = '1';
            controlBox.style.transform = 'translateY(0)';
        }
    }

    function createButton({ id, text, message }) {
        const button = document.createElement('button');
        Object.assign(button.style, {
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '8px 0',
            backgroundColor: '#f3f3f3',
            color: '#333',
            fontSize: '14px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
        });
        button.id = id;
        button.textContent = text;
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#e0e0e0';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#f3f3f3';
        });

        button.addEventListener('click', () => {
            if (id === 'copyConversationButton') copyMessages();
            else if (id === 'scrapeConversationButton') scrapeConversation();
            else sendMessage(message);
        });
        return button;
    }

    function createInputField() {
        const input = document.createElement('input');
        Object.assign(input.style, {
            width: '65%',
            padding: '8px',
            fontSize: '12px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textAlign: 'center',
            boxSizing: 'border-box',
        });
        input.id = 'messageCountInputField';
        input.type = 'number';
        input.placeholder = 'Number of messages';
        return input;
    }

    function scrapeConversation() {
        const messageBlocks = Array.from(document.querySelectorAll('.c-message_kit__background'));
        let conversation = '', lastSender = null;

        messageBlocks.forEach((block) => {
            const sender = block.querySelector('.c-message__sender_button')?.textContent.trim() || lastSender;
            if (sender) lastSender = sender;

            const messageText = Array.from(block.querySelectorAll('.p-rich_text_section'))
                .map((el) => el.textContent.trim())
                .join(' ').trim();

            if (messageText) {
                conversation += `${lastSender}: ${messageText}\n\n`;
            }
        });

        if (conversation.trim()) {
            copyToClipboard(conversation, 'All conversations copied!');
        } else {
            showPopUp('No conversation found.');
        }
    }




   function copyMessages() {
    const numberOfMessages = document.getElementById('messageCountInputField').value || 2;
    const messageBlocks = Array.from(document.querySelectorAll('.c-message_kit__background')).slice(-numberOfMessages);
    let conversation = '', lastSender = null;

    messageBlocks.forEach((block) => {
        const sender = block.querySelector('.c-message__sender_button')?.textContent.trim() || lastSender;
        if (sender) lastSender = sender;

        const messageText = Array.from(block.querySelectorAll('.p-rich_text_section'))
            .map((el) => el.textContent.trim())
            .join(' ').trim();

        if (messageText) {
            conversation += `${lastSender}: ${messageText}\n\n`;
        }
    });

    if (conversation.trim()) {
        const formatted = `${conversation}Guess reply:`;
        copyToClipboard(formatted, `Last ${numberOfMessages} messages copied!`);
    } else {
        showPopUp(`Unable to copy ${numberOfMessages} messages.`);
    }
}






    function copyToClipboard(text, message) {
        navigator.clipboard.writeText(text)
            .then(() => showPopUp(message))
            .catch(() => showPopUp('Failed to copy.'));
    }

    function sendMessage(message) {
        const textBox = document.querySelector('[data-message-input="true"] .ql-editor');
        const sendButton = document.querySelector('[data-qa="texty_send_button"]');

        if (textBox) {
            textBox.focus();
            document.execCommand('insertText', false, message);
            setTimeout(() => sendButton?.click(), 500);
        } else {
            showPopUp('Message box not found.');
        }
    }

    function showPopUp(message) {
        const popUp = document.createElement('div');
        Object.assign(popUp.style, {
            position: 'fixed',
            bottom: '245px',
            right: '100px',
            backgroundColor: '#A294F9',
            color: '#FFFFFF',
            padding: '10px 15px',
            borderRadius: '16px 16px 0px 16px',
            fontSize: '14px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            animation: 'fadeInOut 3s ease-in-out',
            zIndex: '9999',
        });
        popUp.textContent = message;
        document.body.appendChild(popUp);

        setTimeout(() => popUp.remove(), 3000);
    }

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes fadeInOut {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            10% {
                opacity: 1;
                transform: translateY(0);
            }
            90% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(20px);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    waitForSlackInterface();
})();
