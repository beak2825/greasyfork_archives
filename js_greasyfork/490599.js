// ==UserScript==
// @name         TIP.cc [ Automatization ]
// @namespace    Terminator.Scripts
// @version      0.6
// @description  Automate getting rewards from airdrops at tip.cc bot
// @author       TERMINATOR
// @license      MIT
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490599/TIPcc%20%5B%20Automatization%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/490599/TIPcc%20%5B%20Automatization%20%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = true;
    const targetButtonText = "Enter airdrop";
    let clickedButtons = [];
    const intervals = [2500, 3000, 3500];

    const clickEnterAirdropButton = () => {
        const buttons = document.querySelectorAll('button');
        for (let i = buttons.length - 1; i >= 0; i--) {
            const button = buttons[i];
            const buttonText = button.textContent.trim();
            if (buttonText === targetButtonText && !clickedButtons.includes(button)) {
                const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];
                setTimeout(() => {
                    button.click();
                }, randomInterval);
                clickedButtons.push(button);
                break;
            }
        }
    };

    const clickZahoditZpravuLink = () => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const text = link.textContent.trim();
            if (text === "Zahodit zprávu") {
                link.click();
            }
        });
    };

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && isEnabled) {
                    clickEnterAirdropButton();
                    clickZahoditZpravuLink();
                }
            });
        });
    });

    const addButton = () => {
        if (document.getElementById('actionButton')) {
            return;
        }

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'actionButtonContainer';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '9999';

        // Create the toggle button
        const actionButton = document.createElement('button');
        actionButton.id = 'actionButton';
        actionButton.style.background = "GREEN";
        actionButton.style.color = "WHITE";
        actionButton.style.padding = '5px 10px';
        actionButton.style.borderRadius = '4px';
        actionButton.style.border = 'none';
        actionButton.style.cursor = 'pointer';
        actionButton.style.fontWeight = 'bold';
        actionButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        actionButton.innerText = 'AUTOMATION: ON';
        actionButton.onclick = performAction;

        // Add button to container and container to body
        buttonContainer.appendChild(actionButton);
        document.body.prepend(buttonContainer);
    };

    const performAction = () => {
        let actionBTN = document.getElementById("actionButton");
        if (isEnabled === true) {
            isEnabled = false;
            actionBTN.innerText = 'AUTOMATION: OFF';
            actionBTN.style.background = "RED";
        } else {
            isEnabled = true;
            actionBTN.innerText = 'AUTOMATION: ON';
            actionBTN.style.background = "GREEN";
        }
        console.log('Automation toggled');
    };

    // Wait for body to be available
    const checkBody = setInterval(() => {
        if (document.body) {
            clearInterval(checkBody);
            addButton();
        }
    }, 100);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();