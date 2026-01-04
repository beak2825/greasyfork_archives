// ==UserScript==
// @name         SimpleBits Direct to Faucet with Automation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Direct to faucet page on SimpleBits website with automation
// @author       ibomen
// @match        https://simplebits.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495624/SimpleBits%20Direct%20to%20Faucet%20with%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/495624/SimpleBits%20Direct%20to%20Faucet%20with%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to perform clicks based on XPath
    function clickElement(xpath) {
        let element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.click();
        }
    }

    // Wait for the element to be visible
    function waitForElement(xpath, timeout = 15000) {
        return new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                reject(new Error("Timeout waiting for element"));
            }, timeout);

            let checkExist = setInterval(() => {
                let element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    clearInterval(checkExist);
                    clearTimeout(timer);
                    resolve(element);
                }
            }, 100);
        });
    }

    // Function to create and start a countdown timer
    function startCountdown(duration, display) {
        let timer = duration, minutes, seconds;
        let countdownInterval = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(countdownInterval);
                location.reload(); // Refresh the page when countdown is complete
            }
        }, 1000);
    }

    // Function to inject the countdown timer and creator info into the page
    function injectElements() {
        let containerDiv = document.createElement('div');
        containerDiv.style.position = 'fixed';
        containerDiv.style.top = '10px';
        containerDiv.style.right = '10px';
        containerDiv.style.zIndex = '10000';
        containerDiv.style.textAlign = 'center';
        containerDiv.style.color = 'white';

        let countdownDiv = document.createElement('div');
        countdownDiv.id = 'countdown-timer';
        countdownDiv.style.fontSize = '20px';
        countdownDiv.style.backgroundColor = 'black'; // Set background color to black
        countdownDiv.style.padding = '10px'; // Add padding
        countdownDiv.textContent = '01:00';

        let creatorDiv = document.createElement('div');
        creatorDiv.id = 'creator-info';
        creatorDiv.style.fontSize = '12px';
        creatorDiv.style.backgroundColor = 'black'; // Set background color to black
        creatorDiv.style.padding = '10px'; // Add padding
        creatorDiv.textContent = 'Created by ibomen';

        containerDiv.appendChild(countdownDiv);
        containerDiv.appendChild(creatorDiv);

        document.body.appendChild(containerDiv);

        let duration = 60 * 1; // 1 minute countdown
        startCountdown(duration, countdownDiv);
    }

    // Function to redirect to the faucet page
    function redirectToFaucet() {
        if (window.location.href !== 'https://simplebits.io/faucet') {
            window.location.href = 'https://simplebits.io/faucet';
        }
    }

    // Main script to automate the process
    async function automateFaucet() {
        // Click the initial button to start the process
        clickElement('//*[@id="main-content"]/div/div/section[3]/div/div/button');
        await sleep(5000); // Wait 5 seconds

        // Wait for the captcha to appear
        await waitForElement('//div[contains(text(),"SimpleBits.io Captcha")]');

        // Perform the captcha clicks and claim
        for (let i = 0; i < 3; i++) {
            clickElement('//button[3]//img[1]');
            await sleep(5000); // Wait 5 seconds
            clickElement('//button[2]//img[1]');
            await sleep(5000); // Wait 5 seconds
            clickElement('//button[normalize-space()="Claim"]');
            await sleep(5000); // Wait 5 seconds
        }
    }

    // Function to introduce delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Run the script after the page loads
    window.onload = function() {
        if (window.location.href === 'https://simplebits.io/faucet') {
            injectElements();
            automateFaucet();
        } else {
            redirectToFaucet();
        }
    };
})();
