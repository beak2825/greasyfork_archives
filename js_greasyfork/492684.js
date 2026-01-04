// ==UserScript==
// @name         TipSatoX [ Automatization ]
// @namespace    Terminator.Scripts
// @version      0.2
// @description  Automate getting rewards from monsters at TipSatoX bot and add sword reaction to TipSatoX messages
// @author       TERMINATOR
// @license      MIT
// @match        https://discord.com/channels/954156720639316028/1036352574833577994
// @icon         https://www.google.com/s2/favicons?sz=64&domain=satoverse.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492684/TipSatoX%20%5B%20Automatization%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/492684/TipSatoX%20%5B%20Automatization%20%5D.meta.js
// ==/UserScript==


/*

                                           |    TipSatoX Script    |
       I would like to warn you, the script only clicks on the sword emoji, it cannot heal you by itself!

*/



(function() {
    'use strict';

    let isEnabled = true;
    const intervals = [5000]//, 10000]//, 20000];
    let clickedReactions = [];

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && isEnabled) {
                    clickSwordReactions(node);
                }
            });
        });
    });

    const clickSwordReactions = (node) => {
        const emoji = node.querySelector('img[alt="sword"]');
        if (emoji) {
            if (!clickedReactions.includes(emoji)) {
                const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];
                setTimeout(() => {
                    emoji.click();
                    clickedReactions.push(emoji);
                }, randomInterval);
            }
        }
    };

    const addButton = () => {
        const actionButton = document.createElement('button');
        actionButton.id = 'actionButton';
        actionButton.style.position = 'fixed';
        actionButton.style.top = '60px';
        actionButton.style.right = '20px';
        actionButton.style.background = "GREEN";
        actionButton.style.color = "WHITE";
        actionButton.innerText = 'Turned ON';
        actionButton.onclick = performAction;
        document.body.appendChild(actionButton);
    };

    const performAction = () => {
        let actionBTN = document.getElementById("actionButton");
        if (isEnabled === true) {
            isEnabled = false;
            actionBTN.innerText = 'Turned OFF';
            actionBTN.style.background = "RED";
        } else {
            isEnabled = true;
            actionBTN.innerText = 'Turned ON';
            actionBTN.style.background = "GREEN";
        }
        console.log('Provádí se akce...');
    };

    addButton();


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
