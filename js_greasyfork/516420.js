// ==UserScript==
// @name         Button Go to the Top of Response on ChatGPT.com
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Adds a button that scrolls to the top of each response on ChatGPT.com
// @author
// @match        http://*.chatgpt.com/*
// @match        https://*.chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516420/Button%20Go%20to%20the%20Top%20of%20Response%20on%20ChatGPTcom.user.js
// @updateURL https://update.greasyfork.org/scripts/516420/Button%20Go%20to%20the%20Top%20of%20Response%20on%20ChatGPTcom.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function addButtons() {
        const responses = document.querySelectorAll('article[data-testid^="conversation-turn-"] > div');

        responses.forEach((response, index) => {
            if (response.querySelector('.go-to-top-button')) {
                return;
            }

            const button = document.createElement('button');
            button.textContent = '^';
            button.className = 'go-to-top-button';
            button.style.position = 'absolute';
            button.style.bottom = '10px';
            button.style.right = '10px';
            button.style.zIndex = '1000';
            button.style.padding = '8px 12px';
            button.style.backgroundColor = '#808080';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.cursor = 'pointer';

            button.addEventListener('click', () => {
                response.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            response.style.position = 'relative';
            response.appendChild(button);
        });

        // Make only the last button fixed
        const lastButton = responses[responses.length - 1]?.querySelector('.go-to-top-button');
        if (lastButton) {
            lastButton.style.position = 'fixed';
            lastButton.textContent = 'last answer ↑';
            lastButton.style.top = '6px';
            lastButton.style.top = '8px';
            lastButton.style.right = '27px';
            lastButton.style.backgroundColor = '#000000';
            lastButton.style.height = '40px';
        }
    }

    function start() {
        addButtons();
    }

    const observer = new MutationObserver(() => {
        start();
        // Set position of specific element to absolute
        const targetElement = document.querySelector("body > div.relative.flex.h-full.w-full.overflow-hidden.transition-colors.z-0 > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.composer-parent.flex.h-full.flex-col.focus-visible\\:outline-0 > div.flex-1.overflow-hidden > div > div > div > div > div")
        if (targetElement) {
            targetElement.style.position = 'absolute';
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    start();
})();
