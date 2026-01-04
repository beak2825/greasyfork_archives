// ==UserScript==
// @name         Disable Squash and Merge on Mondays
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Disable buttons with text "Squash and merge" on Mondays
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520515/Disable%20Squash%20and%20Merge%20on%20Mondays.user.js
// @updateURL https://update.greasyfork.org/scripts/520515/Disable%20Squash%20and%20Merge%20on%20Mondays.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if today is Monday
    const today = new Date();
    const isMonday = today.getDay() === 1;
    let disabledButtons = [];

      let autoMergeIntervalId;
      let disableButtonsIntervalId;

    if (isMonday && window.location.href.includes("https://github.com/Crezco-Limited/Crezco-App/pull/")) {
        // Function to disable buttons
        const disableButtons = () => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent.trim() === 'Squash and merge' || button.textContent.trim() === 'Enable auto-merge (squash)') {
                    button.disabled = true;
                    disabledButtons.push(button);
                }
            });
        };

        const checkForButtonAndShowDialog = () => {
            const button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Disable auto-merge');

            if (button) {
                const userConfirmed = confirm('It is Monday and likely you should not be merging, do you want to disable auto-merge?');
                if (userConfirmed) {
                    button.click();
                } else {
                    clearInterval(autoMergeIntervalId);
                }
            }
        };

        const enableButtons = () => {
            disabledButtons.forEach(button => {
                button.disabled = false;
            });
            disabledButtons = [];
        };

        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.backgroundColor = 'green';
        banner.style.color = 'white';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        banner.style.zIndex = '1000';
        banner.textContent = 'It is Monday and you might not want to be merging since it will interfere with release!';

        const button = document.createElement('button');
        button.textContent = 'Re-enable Merging (Release is over)';
        button.style.marginLeft = '20px';
        button.onclick = () => {
            clearInterval(autoMergeIntervalId);
            clearInterval(disableButtonsIntervalId);
            enableButtons();
            banner.remove();
        };

        banner.appendChild(button);
        document.body.appendChild(banner);


        autoMergeIntervalId = setInterval(checkForButtonAndShowDialog, 2000);
        disableButtonsIntervalId = setInterval(disableButtons, 2000);
    }
})();