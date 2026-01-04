// ==UserScript==
// @name         ChatGPT Character Counter Limit (CCCL) FIXED BY 人民的勤务员
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a character counter to the input field with a limit of 32732 characters. (ChatGPT has a limit of 32732 characters.)
// @author       Emree.el on instagram AND THE PERSON WHO FIXED IT: https://greasyfork.org/en/users/1169082
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505802/ChatGPT%20Character%20Counter%20Limit%20%28CCCL%29%20FIXED%20BY%20%E4%BA%BA%E6%B0%91%E7%9A%84%E5%8B%A4%E5%8A%A1%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/505802/ChatGPT%20Character%20Counter%20Limit%20%28CCCL%29%20FIXED%20BY%20%E4%BA%BA%E6%B0%91%E7%9A%84%E5%8B%A4%E5%8A%A1%E5%91%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add character counter and handle its behavior
    function addCharacterCounter() {
        let textarea = document.querySelector('#prompt-textarea');

        if (textarea) {
            // Check if the counter already exists to prevent stacking
            if (document.querySelector('.char-counter')) return;

            let charCounter = document.createElement('div');
            charCounter.classList.add('char-counter');  // Assign a class for easy tracking
            charCounter.style.fontSize = '14px';
            charCounter.style.fontWeight = 'bold';
            charCounter.style.marginTop = '5px';
            charCounter.style.color = 'white';
            charCounter.style.textShadow = '0px 0px 5px white'; // Default text shadow

            charCounter.textContent = '0/32732';

            textarea.parentElement.appendChild(charCounter);

            function updateCounter() {
                let charCount = textarea.value.length;
                charCounter.textContent = `${charCount}/32732`;

                if (charCount > 32732) {
                    charCounter.style.color = 'white';
                    charCounter.style.textShadow = '0px 0px 8px red';
                } else if (charCount > 0) {
                    charCounter.style.color = 'white';
                    charCounter.style.textShadow = '0px 0px 8px green';
                } else {
                    charCounter.style.color = 'white';
                    charCounter.style.textShadow = '0px 0px 5px white';
                }
            }

            textarea.addEventListener('input', function() {
                updateCounter();
            });

            // Mutation observer to handle page changes
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    addCharacterCounter();
                    console.log("Page URL changed, updating character counter.");
                }
            }).observe(document, { subtree: true, childList: true });

            // Handle button click to reset counter
            document.querySelector('body').addEventListener('click', function(event) {
                const button = event.target.closest('button[data-testid="send-button"]');
                if (button) {
                    setTimeout(function() {
                        textarea.value = ''; // Clear the textarea
                        charCounter.textContent = '0/32732'; // Reset the counter
                        charCounter.style.color = 'white';
                        charCounter.style.textShadow = '0px 0px 5px white'; // Reset color and glow
                    }, 100); // Slight delay to ensure message is sent before resetting
                }
            });
        } else {
            // Retry if the textarea isn't loaded yet
            setTimeout(addCharacterCounter, 500);
        }
    }

    // Run the function after the page loads
    window.addEventListener('load', addCharacterCounter);
})();


