// ==UserScript==
// @name         Gemini Download Conversation
// @namespace    https://github.com/DavidLJz/userscripts
// @version      0.1.2
// @time         2025-06-08 19:00:00
// @description  Download a conversation from Gemini to a markdown file.
// @author       DavidLJz
// @license      MIT
// @match        https://gemini.google.com/app/*
// @match        https://gemini.google.com/app
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526338/Gemini%20Download%20Conversation.user.js
// @updateURL https://update.greasyfork.org/scripts/526338/Gemini%20Download%20Conversation.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const logger = (msg, level = 'log') => {
        console[level](`[Gemini Download Conversation] ${msg}`);
    }

    logger('Script started'); // Add this line to verify script execution

    const getCopyButton = () => {
        const icon = document.querySelector('.mat-menu-above mat-icon[data-mat-icon-name="content_copy"]')

        if (!icon) {
            throw new Error('Copy button not found.');
        }

        const btn = icon.closest('button');

        if (!btn) {
            throw new Error('Button not found.');
        }

        return btn;
    }

    const getConversationIdFromUrl = () => {
        const url = window.location.href;

        // https://gemini.google.com/app/xxxx
        const urlParts = url.split('/');

        if (urlParts.length < 5) {
            throw new Error('Invalid URL.');
        }

        return urlParts[4];
    }

    const downloadMarkdownFile = (filename, text) => {
        const blob = new Blob([text], { type: 'text/markdown' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;

        a.download = filename;

        a.click();

        logger('Conversation saved.');

        URL.revokeObjectURL(url);

        a.remove();
    }

    const getUserQuery = (modelResponse) => {
        const conversationContainer = modelResponse.closest('.conversation-container');

        if (!conversationContainer) {
            logger('Conversation container not found.', 'error');
            return '';
        }

        const userQuery = conversationContainer.querySelector('user-query');

        if (!userQuery) {
            logger('User query not found.', 'error');
            return '';
        }

        const text = userQuery.textContent.trim().replace(/\n{2,}/g, '\n\n')

        if (!text) {
            logger('User query text not found.', 'error');
            return '';
        }

        return `**User:** ${text}\n\n`;
    }

    const saveConversation = async (chatWindow) => {
        if (!chatWindow) {
            logger('Chat window not found. Exiting.', 'error');
            return;
        }

        logger('Saving conversation...');

        const modelResponses = chatWindow.querySelectorAll('model-response')

        if (!modelResponses.length) {
            alert('No modelResponses found. Exiting.');

            logger('No modelResponses found. Exiting.', 'error');
            return;
        }

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        const fullTextList = [];

        for (let index = 0; index < modelResponses.length; index++) {
            const modelResponse = modelResponses[index];

            logger(`Saving message ${index + 1} of ${modelResponses.length}...`);

            try {
                let text = getUserQuery(modelResponse);

                modelResponse.querySelector('.more-menu-button').dispatchEvent(clickEvent);

                getCopyButton().dispatchEvent(clickEvent);

                // Wait for message to be copied and then check the clipboard
                await new Promise(resolve => setTimeout(resolve, 1250));

                const clipboardText = (await navigator.clipboard.readText()).trim()

                if (!clipboardText) {
                    throw new Error('No text copied.');
                }

                text += `**Gemini**: ${clipboardText}`;

                fullTextList.push(text);

                logger(`Message ${index + 1} of ${modelResponses.length} copied: ${text.length > 50 ? text.substring(0, 50) + '...' : text}`);
            }
            catch (error) {
                // Handle NotAllowedError: Failed to execute 'readText' on 'Clipboard': Document is not focused.
                if (error.name === 'NotAllowedError') {
                    alert('Please do not switch tabs or windows while the script is running. Exiting.');

                    logger('Document is not focused. Exiting.', 'error');
                    return;
                }

                logger(`Error copying message ${index + 1} of ${modelResponses.length}.`, 'error');

                logger(error, 'error');
            }
        }

        if (!fullTextList.length) {
            logger('No messages copied. Exiting.', 'error');
            return;
        }

        const conversationId = getConversationIdFromUrl();

        const separator = '\n\n---\n\n';

        const fullText = fullTextList.join(separator);

        logger('All messages copied. Saving to file...');

        downloadMarkdownFile(`gemini-${conversationId}.md`, fullText);

        logger('Exiting.');
    }

    const getChatWindow = async () => {
        let chatWindow = null;

        while (!chatWindow) {
            logger('Waiting for chat window...');

            chatWindow = document.querySelector('chat-window infinite-scroller');

            if (chatWindow) {
                logger('Chat window found.');
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return chatWindow;
    }

    const chatWindow = await getChatWindow();

    if (!chatWindow) {
        logger('Chat window not found. Exiting.', 'error');
        return;
    }

    const floatingTriggerButton = document.createElement('button');

    floatingTriggerButton.textContent = 'Save Conversation';
    floatingTriggerButton.style.position = 'fixed';
    floatingTriggerButton.style.bottom = '10px';
    floatingTriggerButton.style.right = '10px';
    floatingTriggerButton.style.zIndex = '9999';
    floatingTriggerButton.style.padding = '10px';
    floatingTriggerButton.style.border = 'none';
    floatingTriggerButton.style.backgroundColor = 'green';
    floatingTriggerButton.style.color = 'white';
    floatingTriggerButton.style.cursor = 'pointer';

    logger('Chat window found. Waiting for user click to start saving...');

    floatingTriggerButton.addEventListener('click', () => {
        logger('User clicked. Starting to save conversation...');

        // Scroll until all messages are loaded
        const scrollInterval = setInterval(() => {
            chatWindow.scrollTop = 0;

            if (chatWindow.scrollTop === 0) {
                clearInterval(scrollInterval);
                logger('All messages loaded.');
                saveConversation(chatWindow);
            }

        }, 1000);
    });

    document.body.appendChild(floatingTriggerButton);
})();