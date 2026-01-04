// ==UserScript==
// @name         HKUST AC Timer Setter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add AC timer setter to HKUST AC control page and display simplified response, thanks claude3.5 Sonnet
// @match        https://w5.ab.ust.hk/njggt/app/home
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508058/HKUST%20AC%20Timer%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/508058/HKUST%20AC%20Timer%20Setter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addTimerElements() {
        const targetElement = document.querySelector('div[style*="align-items: center; width: 100%; margin-top: 10px; border: 1px solid rgb(242, 242, 242);"]');
        if (!targetElement) return;

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.marginTop = '10px';

        const inputWrapper = document.createElement('div');
        inputWrapper.style.display = 'flex';
        inputWrapper.style.alignItems = 'center';
        inputWrapper.style.marginBottom = '10px';

        const timePicker = document.createElement('input');
        timePicker.type = 'datetime-local';
        timePicker.style.marginRight = '10px';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.onclick = sendTimerRequest;

        inputWrapper.appendChild(timePicker);
        inputWrapper.appendChild(confirmButton);

        const responseDisplay = document.createElement('div');
        responseDisplay.style.marginTop = '10px';
        responseDisplay.style.padding = '10px';
        responseDisplay.style.border = '1px solid #ccc';
        responseDisplay.style.borderRadius = '4px';
        responseDisplay.style.backgroundColor = '#f8f8f8';
        responseDisplay.style.display = 'none';

        wrapper.appendChild(inputWrapper);
        wrapper.appendChild(responseDisplay);

        targetElement.parentNode.insertBefore(wrapper, targetElement.nextSibling);
    }

    function sendTimerRequest() {
        const timePicker = document.querySelector('input[type="datetime-local"]');
        const responseDisplay = document.querySelector('div[style*="margin-top: 10px; padding: 10px;"]');
        if (!timePicker || !responseDisplay) return;

        const selectedTime = new Date(timePicker.value).toISOString();

        responseDisplay.textContent = 'Setting timer...';
        responseDisplay.style.display = 'block';

        fetch("https://w5.ab.ust.hk/njggt/api/app/prepaid/ac-timer", {
            "headers": {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6",
                "authorization": "Bearer u8dfHVNzja7lUr9Be1Xy",
                "content-type": "application/json",
                "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://w5.ab.ust.hk/njggt/app/home",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify({"ac_timer":{"timer": selectedTime}}),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
        .then(response => response.json())
        .then(data => {
            console.log('Timer set response:', data);
            if (data.meta && data.meta.code === 200) {
                const acTimer = new Date(data.data.ac_timer);
                responseDisplay.textContent = `Success! AC will turn off at: ${acTimer.toLocaleString()}`;
                responseDisplay.style.color = 'green';
            } else {
                throw new Error('Unexpected response');
            }
        })
        .catch(error => {
            console.error('Error setting timer:', error);
            responseDisplay.textContent = 'Error: ' + error.message + '\n\nFull response:\n' + JSON.stringify(error.response || {}, null, 2);
            responseDisplay.style.color = 'red';
        });
    }

    window.addEventListener('load', addTimerElements);
})();