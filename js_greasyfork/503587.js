// ==UserScript==
// @name         Always Allow API Actions
// @namespace    ViolentMonkey scripts
// @version      0.1
// @description  Auto-clicks the 'Confirm' or 'Always Allow' buttons when prompted for an API call
// @author       bmpq
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503587/Always%20Allow%20API%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/503587/Always%20Allow%20API%20Actions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickButtons() {
        // Click the Confirm button
        const confirmButtons = document.querySelectorAll('.btn.relative.btn-primary.btn-small');
        confirmButtons.forEach((button) => {
            const buttonText = button.querySelector('div').textContent.trim();
            if (buttonText === 'Confirm') {
                button.click();
                console.log('Confirm button clicked!');
            }
        });

        // Click the Always Allow button
        const allowButtons = document.querySelectorAll('.btn.relative.btn-secondary.btn-small');
        allowButtons.forEach((button) => {
            const buttonText = button.querySelector('div').textContent.trim();
            if (buttonText === 'Always Allow') {
                button.click();
                console.log('Always Allow button clicked!');
            }
        });
    }

    const observer = new MutationObserver(clickButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();