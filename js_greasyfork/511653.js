// ==UserScript==
// @name         配送STOPボタンスクリプト
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add a new "配送STOP" button next to the "保存" button and toggle input value on click
// @author       akaminekagu
// @match        https://akaminekagu.cybozu.com/k/7*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511653/%E9%85%8D%E9%80%81STOP%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/511653/%E9%85%8D%E9%80%81STOP%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the "配送STOP" button
    function createStopButton() {
        const buttonContainer = document.querySelector('.gaia-argoui-app-edit-buttons');
        if (buttonContainer && !document.querySelector('.stop-button')) { // Avoid creating duplicate buttons
            const stopButton = document.createElement('button');
            stopButton.textContent = '配送STOP';
            stopButton.classList.add('stop-button'); // Add a class to identify this button
            stopButton.style.width = '163px';
            stopButton.style.height = '48px';
            stopButton.style.backgroundColor = 'red';
            stopButton.style.color = '#fff';
            stopButton.style.marginLeft = '10px';
            stopButton.style.border = '2px solid #e3e7e8';
            stopButton.style.cursor = 'pointer';
            stopButton.type = 'button';

            // Append the new button next to the existing buttons
            buttonContainer.appendChild(stopButton);

            // Function to toggle "★配送STOP★" in input fields
            function toggleInputValues() {
                const inputs = document.querySelectorAll('[id*="_5118321"], [id*="_5118335"], [id*="_5118322"], [id*="_9166"], [id*="_5118324"]');
                const hasValue = Array.from(inputs).some(input => input.value !== '');
                if (hasValue) {
                    const confirmOverwrite = confirm('入力フィールドに既に文字が入っています。上書きしてもよろしいですか？');
                    if (!confirmOverwrite) return;
                }
                inputs.forEach(input => {
                    input.value = input.value === '★配送STOP★' ? '' : '★配送STOP★';
                });
            }

            // Add click event to the new button to toggle values
            stopButton.addEventListener('click', toggleInputValues);
        }
    }

    // Observe changes in the DOM to ensure the button is created
    const observer = new MutationObserver(function() {
        createStopButton(); // Attempt to create the button whenever DOM changes
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attempt to create the button when the page loads
    window.addEventListener('load', createStopButton, false);
})();
