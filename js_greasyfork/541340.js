// ==UserScript==
// @name         Auto-retry for Doubledouble.top
// @author       ap
// @namespace    https://github.com/appel/userscripts
// @version      0.1
// @description  Automatically retries downloads on doubledouble.top after 10 seconds if an error is encountered. Gives up after 15 retries. Also ensures the 'private' checkbox is checked. Based on 'Auto Retry for lucida.to' by cracktorio.
// @match        *://doubledouble.top/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541340/Auto-retry%20for%20Doubledoubletop.user.js
// @updateURL https://update.greasyfork.org/scripts/541340/Auto-retry%20for%20Doubledoubletop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_RETRIES = 15; // Max retry attempts
    const RETRY_SECONDS = 10; // Configurable countdown time in seconds
    let retryCount = 0;
    let isRetryScheduled = false;
    let retriesHalted = false;
    let countdownIntervalId = null;

    const errorDivSelector = '#error';
    const downloadButtonSelector = '#dl-button';
    const privateCheckboxSelector = '#private';

    console.log(`Retry countdown set to ${RETRY_SECONDS} seconds.`);

    const bannerElement = document.createElement('div');
    const messageSpan = document.createElement('span');
    const cancelButton = document.createElement('button');

    Object.assign(bannerElement.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        padding: '12px',
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        color: 'white',
        zIndex: '9999',
        fontFamily: 'sans-serif',
        fontSize: '16px',
        textAlign: 'center',
        display: 'none',
        boxSizing: 'border-box'
    });

    Object.assign(cancelButton.style, {
        marginLeft: '20px',
        padding: '5px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#555',
        color: 'white',
        cursor: 'pointer'
    });
    cancelButton.textContent = 'Cancel retries';

    bannerElement.appendChild(messageSpan);
    bannerElement.appendChild(cancelButton);
    document.body.appendChild(bannerElement);

    cancelButton.addEventListener('click', () => {
        console.log("Retry cancelled by user.");
        clearInterval(countdownIntervalId);
        retriesHalted = true;
        isRetryScheduled = false;
        messageSpan.textContent = 'Auto-retry cancelled. Reload to try again.';
        bannerElement.style.color = '#FF4136'; // Red
        cancelButton.style.display = 'none';
    });


    const runTasks = () => {
        const privateCheckbox = document.querySelector(privateCheckboxSelector);
        if (privateCheckbox) {
            if (privateCheckbox.disabled) privateCheckbox.disabled = false;
            if (!privateCheckbox.checked) privateCheckbox.checked = true;
        }

        const isErrorVisible = document.querySelector(errorDivSelector) && window.getComputedStyle(document.querySelector(errorDivSelector)).display !== 'none';

        if (isErrorVisible) {
            if (isRetryScheduled || retriesHalted) return; // A retry is busy or has been stopped

            if (retryCount < MAX_RETRIES) {
                isRetryScheduled = true;
                retryCount++;
                let countdown = RETRY_SECONDS; // Use the configurable variable

                console.log(`Error detected. Starting ${RETRY_SECONDS}s countdown for retry #${retryCount}.`);
                messageSpan.textContent = `Error detected. Auto-retry attempt ${retryCount} of ${MAX_RETRIES} in ${countdown}...`;
                bannerElement.style.color = '#FFD700'; // Gold
                cancelButton.style.display = 'inline-block';
                bannerElement.style.display = 'block';

                countdownIntervalId = setInterval(() => {
                    countdown--;
                    messageSpan.textContent = `Error detected. Auto-retry attempt ${retryCount} of ${MAX_RETRIES} in ${countdown}...`;
                    if (countdown <= 0) {
                        clearInterval(countdownIntervalId);
                        console.log(`Executing retry attempt #${retryCount}.`);
                        document.querySelector(downloadButtonSelector)?.click();
                        isRetryScheduled = false;
                        bannerElement.style.display = 'none'; // Hide banner after click
                    }
                }, 1000);

            } else {
                retriesHalted = true;
                console.log("Max retry limit reached. Halting auto-retry.");
                messageSpan.textContent = `Max retry limit of ${MAX_RETRIES} was reached. Please intervene manually.`;
                bannerElement.style.color = '#FF4136';
                cancelButton.style.display = 'none';
                bannerElement.style.display = 'block';
            }

        } else {
            if (isRetryScheduled) {
                clearInterval(countdownIntervalId);
                isRetryScheduled = false;
            }
            if (retryCount > 0 || retriesHalted) {
                console.log("No error detected. Resetting retry state.");
                retryCount = 0;
                retriesHalted = false;
                bannerElement.style.display = 'none';
            }
        }
    };

    // Run the main task function every second to keep checking the page state.
    setInterval(runTasks, 1000);

})();