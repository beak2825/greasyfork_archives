// ==UserScript==
// @name         Auto Verify Code for Orochi Network with 60s Interval
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fetches verification code every 60 seconds, updates if changed, retries on failure with human-like input, refreshes on reCAPTCHA failure
// @author       You
// @match        *://*.auth.orochi.network/*
// @match        https://orochi.network/onactive
// @grant        GM_xmlhttpRequest
// @connect      apiai.natapp1.cc
// @downloadURL https://update.greasyfork.org/scripts/529058/Auto%20Verify%20Code%20for%20Orochi%20Network%20with%2060s%20Interval.user.js
// @updateURL https://update.greasyfork.org/scripts/529058/Auto%20Verify%20Code%20for%20Orochi%20Network%20with%2060s%20Interval.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let lastCode = null;
    const FETCH_INTERVAL =10 * 1000; // 60 seconds in milliseconds

    // Utility: Wait for an element to appear
    async function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) return resolve(element);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(`Element ${selector} not found within ${timeout}ms`);
            }, timeout);
        });
    }

    // Utility: Random delay between min and max ms
    function randomy(min, max) {
        return new Promise(resolve => {
            setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min);
        });
    }

    // Utility: Simulate paste action
    async function simulatePaste(element, text) {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', text);
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: clipboardData,
            bubbles: true,
            cancelable: true
        });
        element.value = text; // Ensure the value is set first
        element.dispatchEvent(pasteEvent);
    }

    // Function to fetch the latest code from the API
    function fetchLatestCode() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://apiai.natapp1.cc/api/discord/latest",
                onload: function(response) {
                    console.log("API Response:", response.responseText.trim());
                    const code = response.responseText.trim();
                    if (code) {
                        resolve(code);
                    } else {
                        reject("Empty code received");
                    }
                },
                onerror: function(error) {
                    console.error("API request failed:", error);
                    reject("Network error");
                }
            });
        });
    }

    // Function to simulate human-like text input with clearing
    async function inputText(selector, eventType, inputValue, isPaste = false) {
        try {
            const inputElement = await waitForElement(selector);

            // Clear the input field if it has content
            if (inputElement.value !== '') {
                inputElement.value = ''; // Clear existing value
                await randomy(100, 300); // Small delay after clearing
                console.log(`Cleared input field ${selector}`);
            }

            inputElement.focus();
            await randomy(100, 300);

            if (isPaste) {
                await simulatePaste(inputElement, inputValue);
            } else {
                document.execCommand('insertText', false, inputValue.toString());
            }

            inputElement.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
            await randomy(100, 300);
            inputElement.blur();

            if (inputElement.value === inputValue.toString()) {
                console.log(`Input completed for ${selector} with value: ${inputValue}`);
                return true;
            } else {
                console.log(`Input verification failed for ${selector}, value mismatch`);
                return false;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    // Function to update input and click verify
    async function performVerification(code) {
        try {
            const inputSuccess = await inputText('input[placeholder="Input code..."]', 'input', code, false);
            if (!inputSuccess) {
                console.error("Failed to input code, retrying next cycle");
                return;
            }

            const verifyButton = await waitForElement('button > p.text-nowrap') || await waitForElement('button');
            if (verifyButton) {
                await randomy(200, 500);
                verifyButton.closest('button').click();
                console.log("Verification attempted with code:", code);
            } else {
                console.error("Verify button not found");
            }
        } catch (error) {
            console.error("Error during verification:", error);
        }
    }

    // Function to check for code updates and perform actions
    async function checkAndVerify() {
        const targetButton = document.querySelector('button.bg-white.px-4.py-3.text-black.lg\\:px-2.lg\\:py-\\[3px\\]');
        if (targetButton && targetButton.textContent.trim() === 'Sign-up via ONID') {
            console.log('Sign-up via ONID button found, skipping verification this cycle');
            return; // 如果找到按钮，跳过本次验证
        }

        try {
            const newCode = await fetchLatestCode();
            console.log("Fetched code:", newCode);

            if (newCode && newCode !== lastCode && newCode.trim().length > 0) {
                console.log("Code updated, performing verification...");
                lastCode = newCode;
                await performVerification(newCode);
            } else {
                console.log("Code unchanged or invalid, waiting for next fetch...");
            }
        } catch (error) {
            console.error("Error during fetch or verification:", error);
        }
    }

    // Mutation Observer to detect failure popup, reCAPTCHA failure, and reset
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                // Detect general verification failure
                const failurePopup = document.querySelector('.proof-processing-failed') || document.querySelector('[class*="failed"]');
                if (failurePopup && (failurePopup.textContent.includes('FAILED') || failurePopup.textContent.includes('invalid'))) {
                    console.log("Verification failed, continuing cycle...");
                    const inputField = document.querySelector('input[placeholder="Input code..."]');
                    if (inputField && inputField.value) {
                        inputField.value = '';
                        console.log("Reset input field due to failure");
                    }
                }

                // Detect reCAPTCHA failure and refresh
                const recaptchaFailure = document.querySelector('div[role="alert"]');
                if (recaptchaFailure && recaptchaFailure.textContent.includes('Verify reCAPTCHA failed')) {
                    console.log("Detected reCAPTCHA failure, refreshing page...");
                    location.reload();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Auto-click SVG close button (from previous request

    // Initial fetch and set interval for code verification
    checkAndVerify();
    const intervalId = setInterval(checkAndVerify, FETCH_INTERVAL);

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        observer.disconnect();
        clearInterval(intervalId);
    });
})();



(function() {
    'use strict';

    // Function to check for reCAPTCHA failure
    function checkForRecaptchaFailure() {
        const alertDiv = document.querySelector('div[role="alert"]');
        if (alertDiv && alertDiv.textContent.includes('verify the reCAPTCHA')) {
            console.log("reCAPTCHA failure detected, refreshing page...");
            setTimeout(() => location.reload(), 2000); // 2-second delay before refresh
        }
    }

    // Mutation Observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            checkForRecaptchaFailure();
        });
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the alert is already present
    checkForRecaptchaFailure();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})();

/**
(function() {
    'use strict';

    // 定义核心逻辑函数
    function checkButtons() {
        const signUp = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            let found = false;
            buttons.forEach(button => {
                if (button.textContent.includes('Sign-up via ONID') && 
                    !button.hasAttribute('disabled')) {
                    button.click();
                    found = true;
                    clearInterval(signUp);
                }
            });
            if (!found) {
                console.log('No matching "Sign-up via ONID" button found yet');
            }
        }, 5000);

        // 检查 "Google" 按钮
        const googleSignIn = setInterval(() => {
            const buttons = document.querySelectorAll('button.rounded-btn');
            buttons.forEach(button => {
                if (button.textContent.includes('Google') && 
                    !button.hasAttribute('disabled')) {
                    button.click();
                    clearInterval(googleSignIn);
                }
            });
        }, 5000);
    }
    checkButtons();
    setInterval(checkButtons, 600000); // 600秒 = 600000毫秒
})();

**/