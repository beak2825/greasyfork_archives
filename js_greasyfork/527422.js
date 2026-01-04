// ==UserScript==
// @name         ChatGPT Text Splitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically split long messages into parts for ChatGPT, with responsive buttons that instantly reappear!
// @author       6969RandomGuy6969
// @match        https://chatgpt.com/*
// @icon         https://chatgpt-prompt-splitter.jjdiaz.dev/static/chatgpt_prompt_splitter.png
// @grant        none
// @license      GNU GENERAL PUBLIC LICENSE
// @downloadURL https://update.greasyfork.org/scripts/527422/ChatGPT%20Text%20Splitter.user.js
// @updateURL https://update.greasyfork.org/scripts/527422/ChatGPT%20Text%20Splitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_CHUNK_SIZE = 15000;
    const SCISSOR_EMOJI = '✂️';
    const PAPER_EMOJI = '📄';
    let longContent = '';
    let splitParts = [];
    let currentPartIndex = 0;

    function createButton(text, bgColor) {
        const button = document.createElement('button');
        button.innerHTML = text;
        Object.assign(button.style, {
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: bgColor,
            color: 'white',
            border: '1px solid hsl(0deg 0% 100% / 15%)',
            borderRadius: '20px',
            cursor: 'pointer',
            zIndex: '1000',
            transition: '0.2s ease-in-out',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
            width: '100px',
            textAlign: 'center'
        });
        button.addEventListener('mouseenter', () => button.style.opacity = '0.8');
        button.addEventListener('mouseleave', () => button.style.opacity = '1');
        return button;
    }

    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '50px',
        right: '10px',
        display: 'flex',
        gap: '10px',
        zIndex: '1000',
        flexWrap: 'wrap'
    });

    const scissorButton = createButton(SCISSOR_EMOJI + ' Split', '#212121');
    const paperButton = createButton(PAPER_EMOJI + ' Paste', '#212121');

    container.appendChild(scissorButton);
    container.appendChild(paperButton);
    document.body.appendChild(container);

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#2f2f2f',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: '999',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function splitText(content) {
        let parts = [];
        let numParts = Math.ceil(content.length / MAX_CHUNK_SIZE);
        for (let i = 0; i < numParts; i++) {
            let start = i * MAX_CHUNK_SIZE;
            let end = start + MAX_CHUNK_SIZE;
            parts.push(content.slice(start, end));
        }
        return parts;
    }

    scissorButton.addEventListener('click', () => {
        const editableDiv = document.querySelector('#prompt-textarea');
        if (!editableDiv) {
            alert('Unable to find the input field!');
            return;
        }

        longContent = editableDiv.innerText.trim();
        splitParts = splitText(longContent);
        currentPartIndex = 0;

        editableDiv.innerText = `The content is too large and will be sent in parts.\nWait for the final message: ALL PARTS SENT.`;
        editableDiv.focus();
        showNotification("Press Enter to send instructions. Then use Paste button for parts.");
    });

    paperButton.addEventListener('click', () => {
        if (splitParts.length === 0) {
            showNotification("Click Split first to prepare the content.");
            return;
        }

        const editableDiv = document.querySelector('#prompt-textarea');
        if (!editableDiv) return;

        if (currentPartIndex >= splitParts.length) {
            editableDiv.innerText = "ALL PARTS SENT";
            showNotification("All parts sent! ChatGPT can now process the data.");
            currentPartIndex = 0;
            return;
        }

        let partText = splitParts[currentPartIndex];
        let totalParts = splitParts.length;
        let partNumber = currentPartIndex + 1;

        editableDiv.innerText = `[START PART ${partNumber}/${totalParts}]\n${partText}\n[END PART ${partNumber}/${totalParts}]`;
        editableDiv.focus();

        showNotification(`Sent Part ${partNumber}/${totalParts}. Press Enter.`);
        currentPartIndex++;
    });

    // Improved auto-hide: Instant reappear
    document.addEventListener('click', (event) => {
        const profileButton = document.querySelector('[aria-label="Open Profile Menu"]');
        const profileMenu = document.querySelector('[role="menu"]');

        if (profileButton && profileButton.contains(event.target)) {
            container.style.display = 'none';
        } else if (!profileMenu || !profileMenu.contains(event.target)) {
            container.style.display = 'flex';
        }
    });
})();
