// ==UserScript==
// @name         Kick.com Chat Spammer
// @namespace    kick.chat.spammer
// @version      1.0.0
// @description  Script para spamear y bypass emote-only en Kick.com
// @author       Tu Nombre
// @match        https://kick.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546086/Kickcom%20Chat%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/546086/Kickcom%20Chat%20Spammer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear la UI
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.width = '300px';
    container.style.padding = '20px';
    container.style.border = '1px solid #444';
    container.style.borderRadius = '5px';
    container.style.backgroundColor = '#2e2e2e';
    container.style.color = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.zIndex = '10000';

    const title = document.createElement('h2');
    title.textContent = 'Chat Spammer';
    container.appendChild(title);

    const messageLabel = document.createElement('label');
    messageLabel.textContent = 'Mensaje:';
    messageLabel.style.display = 'block';
    messageLabel.style.marginBottom = '5px';
    container.appendChild(messageLabel);

    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = 'Escribe tu mensaje aquí';
    messageInput.style.width = '100%';
    messageInput.style.padding = '10px';
    messageInput.style.border = '1px solid #444';
    messageInput.style.borderRadius = '5px';
    messageInput.style.backgroundColor = '#3e3e3e';
    messageInput.style.color = '#ffffff';
    container.appendChild(messageInput);

    const emoteLabel = document.createElement('label');
    emoteLabel.textContent = 'Emote:';
    emoteLabel.style.display = 'block';
    emoteLabel.style.marginBottom = '5px';
    emoteLabel.style.marginTop = '10px';
    container.appendChild(emoteLabel);

    const emoteSelect = document.createElement('select');
    emoteSelect.style.width = '100%';
    emoteSelect.style.padding = '10px';
    emoteSelect.style.border = '1px solid #444';
    emoteSelect.style.borderRadius = '5px';
    emoteSelect.style.backgroundColor = '#3e3e3e';
    emoteSelect.style.color = '#ffffff';
    const emoteOption = document.createElement('option');
    emoteOption.value = '👮‍♂️';
    emoteOption.textContent = '👮‍♂️';
    emoteSelect.appendChild(emoteOption);
    container.appendChild(emoteSelect);

    const delayLabel = document.createElement('label');
    delayLabel.textContent = 'Delay (ms):';
    delayLabel.style.display = 'block';
    delayLabel.style.marginBottom = '5px';
    delayLabel.style.marginTop = '10px';
    container.appendChild(delayLabel);

    const delayInput = document.createElement('input');
    delayInput.type = 'number';
    delayInput.value = '0';
    delayInput.style.width = '100%';
    delayInput.style.padding = '10px';
    delayInput.style.border = '1px solid #444';
    delayInput.style.borderRadius = '5px';
    delayInput.style.backgroundColor = '#3e3e3e';
    delayInput.style.color = '#ffffff';
    container.appendChild(delayInput);

    const randomEmoteLabel = document.createElement('label');
    randomEmoteLabel.textContent = 'Random Emote:';
    randomEmoteLabel.style.display = 'block';
    randomEmoteLabel.style.marginBottom = '5px';
    randomEmoteLabel.style.marginTop = '10px';
    container.appendChild(randomEmoteLabel);

    const randomEmoteCheckbox = document.createElement('input');
    randomEmoteCheckbox.type = 'checkbox';
    randomEmoteCheckbox.style.marginLeft = '10px';
    container.appendChild(randomEmoteCheckbox);

    const bypassEmoteOnlyLabel = document.createElement('label');
    bypassEmoteOnlyLabel.textContent = 'Bypass Emote Only:';
    bypassEmoteOnlyLabel.style.display = 'block';
    bypassEmoteOnlyLabel.style.marginBottom = '5px';
    bypassEmoteOnlyLabel.style.marginTop = '10px';
    container.appendChild(bypassEmoteOnlyLabel);

    const bypassEmoteOnlyCheckbox = document.createElement('input');
    bypassEmoteOnlyCheckbox.type = 'checkbox';
    bypassEmoteOnlyCheckbox.style.marginLeft = '10px';
    container.appendChild(bypassEmoteOnlyCheckbox);

    const spamButton = document.createElement('button');
    spamButton.textContent = 'SPAM';
    spamButton.style.width = '100%';
    spamButton.style.padding = '10px';
    spamButton.style.border = 'none';
    spamButton.style.borderRadius = '5px';
    spamButton.style.backgroundColor = '#4caf50';
    spamButton.style.color = '#ffffff';
    spamButton.style.cursor = 'pointer';
    spamButton.style.marginTop = '10px';
    container.appendChild(spamButton);

    document.body.appendChild(container);

    spamButton.addEventListener('click', function() {
        const message = messageInput.value;
        const emote = emoteSelect.value;
        const delay = parseInt(delayInput.value);
        const randomEmote = randomEmoteCheckbox.checked;
        const bypassEmoteOnly = bypassEmoteOnlyCheckbox.checked;

        if (bypassEmoteOnly) {
            const wrappedMessage = `${emote}${message}${emote}`;
            sendMessage(wrappedMessage, delay);
        } else {
            sendMessage(message, delay);
        }
    });

    function sendMessage(message, delay) {
        const chatElement = document.querySelector('[data-testid="chat-input"]');
        if (chatElement) {
            chatElement.value = message;
            const sendEvent = new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true });
            chatElement.dispatchEvent(sendEvent);
            if (delay > 0) {
                setTimeout(() => {
                    sendMessage(message, delay);
                }, delay);
            }
        }
    }
})();