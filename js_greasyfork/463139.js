// ==UserScript==
// @name         ChatGPT Continue Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a Continue button to ChatGPT
// @author       stucci
// @license      MIT
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463139/ChatGPT%20Continue%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/463139/ChatGPT%20Continue%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(text, handler) {
        const button = document.createElement('button');
        button.className = 'custombtn btn relative btn-neutral border-0 md:border';
        button.innerHTML = text;
        button.onclick = handler;
        return button;
    }

    function addButtonIfNotExists() {
        if (document.querySelector('.custombtn')) {
            return;
        }

        const textBox = document.querySelector('form');
        if (!textBox) {
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.marginBottom = '10px';

        buttonContainer.append(
            createButton('Continue⏎', function() {
                const textArea = document.querySelector('textarea');
                textArea.value = 'Continue';
                textArea.focus();

                const disabledButtons = document.querySelectorAll("button[disabled]");
                const lastDisabledButton = disabledButtons[disabledButtons.length - 1];
                lastDisabledButton.removeAttribute("disabled");

                if (lastDisabledButton) {
                    lastDisabledButton.click();
                }
            })
        );

        textBox.parentNode.insertBefore(buttonContainer, textBox);
    }

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(addButtonIfNotExists);

    observer.observe(targetNode, config);
})();
