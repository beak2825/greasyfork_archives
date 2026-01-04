// ==UserScript==
// @name         TIP.cc [ Automatization - redpacket ]
// @namespace    Terminator.Scripts
// @version      0.1
// @description  Automate getting rewards from redpacket at tip.cc bot
// @author       TERMINATOR
// @license      MIT
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490600/TIPcc%20%5B%20Automatization%20-%20redpacket%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/490600/TIPcc%20%5B%20Automatization%20-%20redpacket%20%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetButtonText = "Claim envelope";

    const clickEnterAirdropButton = () => {
        const buttons = document.querySelectorAll('button');
        for (let i = buttons.length - 1; i >= 0; i--) {
            const button = buttons[i];
            const buttonText = button.textContent.trim();
            if (buttonText === targetButtonText) {
                button.click();
                break;
            }
        }
    };

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    //clickEnterAirdropButton();
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(() => {
        clickEnterAirdropButton();
    }, 10000);
})();
