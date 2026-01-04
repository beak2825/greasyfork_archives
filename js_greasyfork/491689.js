// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Auto Coinfarmer
// @version      8000
// @author       Spacekiller
// @description  Makes bots to buy any item(s) you want.
// @match        https://www.brick-hill.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhautocoinfarmer
// @downloadURL https://update.greasyfork.org/scripts/491689/%5BBrick-Kill%5D%20Auto%20Coinfarmer.user.js
// @updateURL https://update.greasyfork.org/scripts/491689/%5BBrick-Kill%5D%20Auto%20Coinfarmer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*-    SETTINGS    -*/

    // TIP: For maximum profit, make sure link one is 1 buck and link two is 10 bits.
    const Buy_link_1 = 'https://www.brick-hill.com/shop/#'
    const Buy_link_2 = 'https://www.brick-hill.com/shop/#'

    const Username_type = "random"; // Types of usernames; put either: random, numbers, letters.
    const Random_username_length = 26; // The number of characters you want in your username. Max is 26.

    const Custom_password = false; // Set to true if you want a custom password.
    const password = "anypassword123"; // What you want the password to be.

    /*-    INSTRUCTIONS    -*/
    // 1. Log out or use incognito mode.

    // 2. Edit the script and fill in the buy links with the items you want to buy.

    // 3. Enable the script through your script manager. (The one you're reading this in...)

    // 4. Go to the register page if you haven't already.

    /*-    TIPS    -*/
    // You can use this extension to automate captchas: https://chromewebstore.google.com/detail/captcha-solver-auto-hcapt/hlifkpholllijblknnmbfagnkjneagid

    // Switch around IP addresses with a VPN to get around rate limiting.


    runScript();

    function runScript() {

        const url = window.location.href;

        const tasks = [{
            condition: url.includes("brick-hill.com/register"),
            action: () => {
                GM_setValue('loopRegister', true);

                const errorMessageSpan = document.querySelector('span');
                if (errorMessageSpan && errorMessageSpan.textContent === "Error 429: Too Many Requests") {
                    GM_setValue('threeAccounts', 3);
                    window.location.href = 'https://www.brick-hill.com/register';
                    return;
                }

                const errorMessageSpan2 = document.querySelector('span');

                if (errorMessageSpan2 && errorMessageSpan2.textContent === "Error 419: Authentication Timeout") {
                    window.location.href = 'https://www.brick-hill.com/register';
                }

                elementBlocker();

                if (GM_getValue('threeAccounts', 0) >= 3) {
                    startTimer(300);
                    const hCaptchaElement = document.querySelector('.h-captcha');
                    if (hCaptchaElement) {
                        hCaptchaElement.remove();
                    }
                    return;
                }

                autoRegister();

            }
        },
                       {
                           condition: url.includes("brick-hill.com/logout"),
                           action: () => {
                               const errorMessageSpan = document.querySelector('span');

                               if (errorMessageSpan && errorMessageSpan.textContent === "Error 419: Authentication Timeout") {
                                   window.location.href = 'https://www.brick-hill.com/register';
                               }
                           }
                       },
                       {
                           condition: document.querySelector('button.button.blue.no-overflow') !== null,
                           action: () => {
                               window.location.href = 'https://www.brick-hill.com/register';
                           }
                       },
                       {
                           condition: url.includes(".hcaptcha.com/"),
                           action: () => {
                               window.addEventListener('load', hCaptchaClicker);
                           }
                       },
                       {
                           condition: url.includes(Buy_link_1),
                           action: () => {
                               setInterval(autoPurchase, 2000); // Call the function directly
                           }
                       },
                       {
                           condition: url.includes(Buy_link_2),
                           action: () => {
                               setInterval(autoPurchase2, 2000); // Call the function directly
                           }
                       },
                       {
                           condition: url.includes("brick-hill.com/dashboard"),
                           action: () => {
                               if (GM_getValue('threeAccounts', 0) >= 3) {
                                   startTimer(300);
                               }
                               window.location.href = Buy_link_1;
                           }
                       },
                       {
                           condition: url.includes("brick-hill.com/login"),
                           action: () => {
                               window.location.href = "register"
                           }
                       }
                      ];

        tasks.forEach(task => {
            if (task.condition) {
                task.action();
            }
        });
    }

    let startTime;
    let timerDuration;

    function hCaptchaClicker() {
        const CHECKBOX_ID = "checkbox";
        const ARIA_CHECKED = "aria-checked";

        const checkbox = document.getElementById(CHECKBOX_ID);

        if (checkbox && window.location.href.includes("checkbox")) {
            const checkboxInterval = setInterval(() => {
                const isChecked = checkbox.getAttribute(ARIA_CHECKED) === "true";
                const isNotHidden = checkbox.offsetParent !== null;

                if (isChecked) {
                    clearInterval(checkboxInterval);
                } else if (isNotHidden) {
                    checkbox.click();
                }
            }, 300);
        }
    }

    function startTimer(duration) {
        let startTime = parseInt(GM_getValue('startTime'));
        let timer = parseInt(GM_getValue('timerDuration')) || duration;

        if (!startTime) {
            startTime = Date.now();
            GM_setValue('startTime', startTime.toString());
        }

        const timerElement = document.createElement('div');
        timerElement.style.position = 'fixed';
        timerElement.style.top = '10px';
        timerElement.style.right = '10px';
        timerElement.style.backgroundColor = '#fff';
        timerElement.style.color = '#000';
        timerElement.style.padding = '10px';
        timerElement.style.border = '1px solid #ccc';
        document.body.appendChild(timerElement);

        const intervalId = setInterval(function () {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const remainingTime = timer - Math.floor(elapsedTime / 1000);

            if (remainingTime <= 0) {
                clearInterval(intervalId);
                GM_deleteValue('startTime');
                GM_deleteValue('timerDuration');
                GM_setValue('threeAccounts', '0');
                document.body.removeChild(timerElement);
                location.reload();
                return;
            }

            const minutes = parseInt(remainingTime / 60, 10);
            const seconds = parseInt(remainingTime % 60, 10);

            const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
            const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

            timerElement.textContent = `Rate limit ending in: ${formattedMinutes}:${formattedSeconds}`;

            GM_setValue('timerDuration', remainingTime.toString());

            timerElement.addEventListener('click', () => {
                GM_setValue('threeAccounts', '0');
                GM_deleteValue('startTime');
                GM_deleteValue('timerDuration');
                clearInterval(intervalId);
                document.body.removeChild(timerElement);
                location.reload();
            });
        }, 1000);
    }

    async function autoRegister() {
        let hCaptchaResponse;
        let csrfToken;

        try {

            hCaptchaResponse = await new Promise((resolve, reject) => {
                const iframeObserver = new MutationObserver((mutationsList, observer) => {
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                        const response = iframe.getAttribute('data-hcaptcha-response');
                        if (response && response.trim()) {
                            observer.disconnect();
                            resolve(response);
                        }
                    }
                });

                iframeObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            });

            const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
            if (csrfTokenElement) {
                csrfToken = csrfTokenElement.content;
            } else {
                throw new Error('CSRF token not found');
            }

        } catch (error) {
            console.error('Error:', error);
            return;
        }

        try {

            const username = generateRandomString(Random_username_length, Username_type);
            let passwordToSend = generateRandomString(12);

            if (Custom_password) {
                passwordToSend = password;
            }

            const passwordConfirmation = passwordToSend;

            await sendRequest(csrfToken, username, passwordToSend, passwordConfirmation, hCaptchaResponse);

        } catch (error) {
            console.error('Error in autoRegister:', error);
        }
    }

    async function sendRequest(csrfToken, username, password, passwordConfirmation, hCaptchaResponse) {
        try {
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRF-Token": csrfToken
            };

            const params = new URLSearchParams({
                username,
                password,
                password_confirmation: passwordConfirmation,
                'h-captcha-response': hCaptchaResponse
            });

            const response = await fetch("https://www.brick-hill.com/register", {
                method: "POST",
                headers,
                body: params,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.text();

            let count = Number(GM_getValue('threeAccounts', 0));
            GM_setValue('threeAccounts', count + 1);

            if (count >= 3) {
                const hCaptchaElement = document.querySelector('.h-captcha');
                if (hCaptchaElement) {
                    hCaptchaElement.remove();
                }
                startTimer(300);
                return;
            }

            window.location.href = Buy_link_1;

        } catch (error) {
            console.error("Error sending request:", error);
            startTimer(300);
            const hCaptchaElement = document.querySelector('.h-captcha');
            if (hCaptchaElement) {
                hCaptchaElement.remove();
            }
        }
    }

    function generateRandomString(length, Username_type) {
        let characters = getCharactersForType(Username_type);
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function getCharactersForType(Username_type) {
        switch (Username_type) {
            case "random":
                return 'abcdefghijklmnopqrstuvwxyz0123456789';
            case "numbers":
                return '0123456789';
            case "letters":
                return 'abcdefghijklmnopqrstuvwxyz';
            default:
                return 'abcdefghijklmnopqrstuvwxyz0123456789';
        }
    }

    function autoPurchase() {
        const triangleElement = document.querySelector('div.triangle.large.owns');

        if (!triangleElement) {
            const selectors = ['.bits.width-100', '.bits.button', '.bucks.width-100', '.bucks.button', '.free.width-100', '.free.button'];
            const elements = selectors.map(selector => document.querySelector(selector)).filter(el => el);

            elements.forEach(element => element.click());
        } else if (Buy_link_2) {
            window.location.href = Buy_link_2;
        }
    }

    function autoPurchase2() {
        const triangleElement = document.querySelector('div.triangle.large.owns');

        if (!triangleElement) {
            const selectors = ['.bits.width-100', '.bits.button', '.bucks.width-100', '.bucks.button', '.free.width-100', '.free.button'];
            const elements = selectors.map(selector => document.querySelector(selector)).filter(el => el);

            elements.forEach(element => element.click());
        } else if (Buy_link_2) {
            logout();
        }
    }

    function elementBlocker() {
        const elementsToBlock = [
            'button.blue[type="submit"]',
            '#email',
            'h3.dark-gray-text:nth-of-type(3)',
            'h6.light-gray-text:nth-of-type(3)',
            '#password',
            '#password_confirmation',
            'h6.light-gray-text:nth-of-type(2)',
            'h3.dark-gray-text:nth-of-type(2)',
            '#username',
            'h6.light-gray-text:nth-of-type(1)',
            'h3.dark-gray-text:nth-of-type(1)'
        ];

        function blockElements() {
            const combinedSelector = elementsToBlock.join(', ');
            document.querySelectorAll(combinedSelector).forEach(element => element.remove());
        }

        observeMutations(blockElements);
    }

    function observeMutations(callback, options = {
        childList: true,
        subtree: true,
        attributes: true
    }) {
        const observer = new MutationObserver(callback);
        observer.observe(document.body, options);
        return observer;
    }

    async function logout() {
        try {
            const tokenInput = document.querySelector('input[name="_token"]');
            if (!tokenInput) {
                console.error('Token input not found');
                return;
            }

            const token = tokenInput.value;

            const formData = new URLSearchParams();
            formData.append('_token', token);

            const response = await fetch('https://www.brick-hill.com/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            if (response.ok) {
                console.log('Successfully logged out');
                window.location.href = 'https://www.brick-hill.com/register';
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

})();