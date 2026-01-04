// ==UserScript==
// @name         Messages Tracker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tracks new messages and displays them in a resizable box
// @author       Gigachad Coder
// @match        *://spellbook.scale.com/app/*/prompt
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462036/Messages%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/462036/Messages%20Tracker.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = `
    #messagesTracker {
        position: fixed;
        top: 40px;
        right: 20px;
        width: 25%;
        max-height: 75%;
        overflow-y: auto;
        border: 1px solid #ccc;
        background-color: #222;
        color: #eee;
        font-family: 'Courier New', monospace;
        padding: 10px;
        opacity: 1;
        z-index: 9999;
        resize: both;
        direction: rtl;
        display: none;
    }
    #messagesTracker.resized {
        max-height: none;
    }
    #messagesTracker pre {
        margin: 5px 0;
        padding: 6px;
        background-color: rgba(74, 74, 74, 1);
        border: 3px solid rgba(51, 51, 51, 1);
        border-radius: 4px;
        opacity: 1;
        direction: ltr;
        color: rgba(238, 238, 238, 1);
    }
    #messagesTracker::-webkit-scrollbar {
        width: 10px;
    }
    #messagesTracker::-webkit-scrollbar-thumb {
        background-color: darkgrey;
        outline: 1px solid slategrey;
    }
    #messagesTracker::-webkit-scrollbar-track {
        background-color: grey;
    }
    #toggleButton {
        position: fixed;
        top: 14px;
        right: 20px;
        width: 25%;
        padding: 5px;
        background-color: #222;
        color: #eee;
        font-family: 'Courier New', monospace;
        text-align: center;
        cursor: pointer;
        border: 1px solid #ccc;
        opacity: 0.9;
        z-index: 9999;
    }
   #checkboxWrapper {
        display: inline-block;
        position: fixed;
        right: 19px;
    }
`;
    document.head.appendChild(style);

    let messagesBox = document.createElement('div');
    messagesBox.id = 'messagesTracker';
    document.body.appendChild(messagesBox);

    let toggleButton = document.createElement('div');
    toggleButton.id = 'toggleButton';
    toggleButton.innerText = 'Toggle Messages';
    document.body.appendChild(toggleButton);

    let checkboxWrapper = document.createElement('span');
    checkboxWrapper.id = 'checkboxWrapper';
    let autoClickCheckbox = document.createElement('input');
    autoClickCheckbox.type = 'checkbox';
    autoClickCheckbox.id = 'autoClickCheckbox';
    let checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = 'autoClickCheckbox';
    checkboxWrapper.appendChild(autoClickCheckbox);
    checkboxWrapper.appendChild(checkboxLabel);
    toggleButton.appendChild(checkboxWrapper);

    autoClickCheckbox.addEventListener('click', (event) => {
    event.stopPropagation();
    });

    autoClickCheckbox.addEventListener("mouseover", function() {
    autoClickCheckbox.title = "Autoclicks generate after every message";
});

        let isResized = false;

    messagesBox.addEventListener('mousedown', (e) => {
        if (e.target === messagesBox) {
            messagesBox.classList.add('resized');
            isResized = true;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResized) {
            messagesBox.style.maxHeight = '';
            isResized = false;
        }
    });

    let isHidden = true;

    toggleButton.addEventListener('click', () => {
        if (isHidden) {
            messagesBox.style.display = 'block';
            isHidden = false;
        } else {
            messagesBox.style.display = 'none';
            isHidden = true;
        }
    });

function copyMessage(message) {
    let messageElement = document.createElement('pre');
    messageElement.style.whiteSpace = 'pre-wrap';
    messageElement.innerText = message;
        if (messagesBox.childNodes.length > 0) {
            messagesBox.insertBefore(messageElement, messagesBox.childNodes[0]);
        } else {
            messagesBox.appendChild(messageElement);
        }
        messagesBox.scrollTop = messagesBox.scrollHeight;

        // Auto-click button logic
        if (autoClickCheckbox.checked) {
            let button = document.querySelector("#root > div > main > div.MuiBox-root.css-14coqzk > button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.MuiButton-sizeMedium.MuiButton-outlinedSizeMedium.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.MuiButton-sizeMedium.MuiButton-outlinedSizeMedium.css-1uaoirk");
            if (button) {
                button.click();
            }
        }
    }

    let latestMessage = '';

    function checkMessages() {
        let cell = document.querySelector('#root > div > main > div.MuiPaper-root.MuiPaper-outlined.MuiPaper-rounded.MuiTableContainer-root.css-192ozh4 > table > tbody > tr > td.MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-lxjiw6');

        if (cell) {
            let span = cell.querySelector('span');

            if (span) {
                let message = span.innerText;

                if (latestMessage !== message && message.trim() !== '') {
                    latestMessage = message;
                    copyMessage(message);
                    messagesBox.scrollTop = messagesBox.scrollHeight;
                }
            }
        }

        setTimeout(checkMessages, 1000);
    }

    checkMessages();
})();
