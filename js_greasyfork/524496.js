// ==UserScript==
// @name         DeepSeek Auto-Continue
// @namespace    https://github.com/stusaddler
// @version      1.1
// @icon         https://i.ibb.co/3c8mNXh/deepseek-color.png
// @description  Automatically clicks the "Continue" button for long DeepSeek responses
// @author       Stuart Saddler
// @match        https://chat.deepseek.com/*
// @icon         https://chat.deepseek.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524496/DeepSeek%20Auto-Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/524496/DeepSeek%20Auto-Continue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL_DELAY = 1000;
    let continueInterval;

    function clickContinueButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        const continueBtn = buttons.find(btn => 
            btn.textContent.includes('Continue') && 
            !btn.disabled &&
            btn.offsetParent !== null
        );

        if (continueBtn) {
            continueBtn.click();
            console.log('Continue button clicked');
            return true;
        }
        return false;
    }

    function shouldActivate() {
        const lastMessage = document.querySelector('.assistant-message:last-child');
        return lastMessage && 
               lastMessage.textContent.length > 500 &&
               !lastMessage.querySelector('.loading-indicator');
    }

    function checkAndContinue() {
        if (shouldActivate()) {
            if (!clickContinueButton()) {
                setTimeout(checkAndContinue, 500);
            }
        }
    }

    function init() {
        if (!continueInterval) {
            continueInterval = setInterval(checkAndContinue, INTERVAL_DELAY);
            console.log('DeepSeek Auto-Continue activated');
        }
    }

    // Start when messages container exists
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.messages-container')) {
            init();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cleanup
    window.addEventListener('beforeunload', () => {
        clearInterval(continueInterval);
    });
})();