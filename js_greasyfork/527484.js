// ==UserScript==
// @name         GauthMath Premium Unlocker
// @namespace    github.com/longkidkoolstar
// @version      1.0.1
// @description  Unlock premium features on GauthMath with this userscript. Enter your premium key to access exclusive content and solutions.
// @author       longkidkoolstar
// @match        https://www.gauthmath.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gauthmath.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527484/GauthMath%20Premium%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/527484/GauthMath%20Premium%20Unlocker.meta.js
// ==/UserScript==

console.log('GauthMath notification system loaded!');

const targetSelector = "#__next > div.Layout_main-wrap__KzRPxo > main > div > div.Solution_solutionContainer__o8AMps > div.Solution_solutionMain__SYCF2Q > div.PCAnswerResult_answer-result__gCp2gu > div > div.Tabs_tabs-panel-wrap__EP9hZn > div:nth-child(1) > div > div > div > div.PCSolutionMask_Mask__aiEpdC > div";

// Create custom notification system
const createNotification = (message, duration = 5000) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        transition: opacity 0.3s;
        max-width: 300px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    notification.innerHTML = message;

    // Style all links in notifications
    const links = notification.getElementsByTagName('a');
    for (let link of links) {
        link.style.cssText = `
            color: #00ff00;
            text-decoration: underline;
            cursor: pointer;
        `;
    }

    document.body.appendChild(notification);

    // Fade out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);

    return notification;
};

// Create custom input dialog
const createInputDialog = () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-width: 400px;
        width: 90%;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your premium key';
    input.style.cssText = `
        width: 100%;
        padding: 8px;
        margin: 10px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
    `;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.cssText = `
        padding: 8px 16px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        padding: 8px 16px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(submitButton);
    dialog.appendChild(input);
    dialog.appendChild(buttonContainer);
    overlay.appendChild(dialog);

    return new Promise((resolve) => {
        submitButton.onclick = () => {
            overlay.remove();
            resolve(input.value);
        };
        cancelButton.onclick = () => {
            overlay.remove();
            resolve(null);
        };
        document.body.appendChild(overlay);
        input.focus();
    });
};

const getKey = async () => {
    const key = await createInputDialog();
    if (key) {
        validateKey(key);
    } else {
        createNotification('No key entered. Please try again.');
        setTimeout(getKey, 1000);
    }
};

const validateKey = (key) => {
    setTimeout(() => {
        createNotification('Invalid key. Please visit our Discord server: <a href="https://discord.gg/JrweGzdjwA" target="_blank">discord.gg/JrweGzdjwA</a> to purchase a valid key.', 7000);
    }, 1000);
};

const observeElement = () => {
    new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const target = document.querySelector(targetSelector);
                if (target) {
                    createNotification('Get GauthMath Plus! Join our Discord server: <a href="https://discord.gg/JrweGzdjwA" target="_blank">discord.gg/JrweGzdjwA</a>');
                    observer.disconnect();
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true });
};

// Initialize
getKey();
observeElement();