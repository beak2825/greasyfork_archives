// ==UserScript==
// @name         AliExpress Report Autofill (Blacklist request)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autofills the AliExpress report form for 'Advertisements or spam' and submits it.
// @author       Hegy
// @match        https://*.aliexpress.com/p/complaint-center/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536960/AliExpress%20Report%20Autofill%20%28Blacklist%20request%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536960/AliExpress%20Report%20Autofill%20%28Blacklist%20request%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const REPORT_TEXT = 'Please add the following names to the blacklist for product reviews to prevent further mentions: "shopruihalo", "шо приїхало", "what arrived", "шо прибуло". These are used to promote a Telegram group: https://t.me/shopruihalo . The group asks users to mention its name in reviews and upload specific photos in exchange for rewards. These reviews are used as advertising, not for sharing genuine product experience. This violates AliExpress rules by turning the review section into a promotion channel. Blocking these keywords will help stop further abuse.';
    const RADIO_VALUE_TO_SELECT = 'Ads_or_spam';

    const PAUSE_AFTER_EACH_ACTION_MS = 250;
    const PRE_SUBMIT_LOGIC_PAUSE_MS = 350;
    const TEXT_INPUT_EVENT_DELAY_MS = 60;
    const WAIT_FOR_ELEMENT_TIMEOUT_MS = 10000; // 10 seconds to wait for an element
    const WAIT_FOR_ELEMENT_POLL_INTERVAL_MS = 200; // Check every 200ms

    const CONFIRM_BUTTON_SELECTOR = 'button.comet-v2-btn.comet-v2-btn-primary.comet-v2-btn-important span'; // Targeting the span with "confirm"

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Waits for an element to appear in the DOM.
     * @param {string} selector - The CSS selector of the element to wait for.
     * @param {number} timeout - Maximum time to wait in milliseconds.
     * @param {number} pollInterval - How often to check for the element.
     * @returns {Promise<Element|null>} The found element or null if timed out.
     */
    async function waitForElement(selector, timeout = WAIT_FOR_ELEMENT_TIMEOUT_MS, pollInterval = WAIT_FOR_ELEMENT_POLL_INTERVAL_MS) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            // If targeting text content, we need a more specific check
            if (selector.includes('span') && selector.toLowerCase().includes('confirm')) {
                const buttons = document.querySelectorAll('button.comet-v2-btn.comet-v2-btn-primary.comet-v2-btn-important');
                for (const button of buttons) {
                    const span = button.querySelector('span');
                    if (span && span.textContent.trim().toLowerCase() === 'confirm') {
                        return button; // Return the button itself, not just the span
                    }
                }
            } else { // Fallback for general selectors
                const element = document.querySelector(selector);
                if (element) {
                    return element;
                }
            }
            await delay(pollInterval);
        }
        console.warn(`waitForElement: Element with selector "${selector}" not found within ${timeout}ms.`);
        return null;
    }


    function createActionButton() {
        const button = document.createElement('button');
        button.textContent = 'Autofill, Submit & Confirm';
        button.style.position = 'fixed';
        button.style.top = '15px';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#ff4747';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.2)';

        button.addEventListener('click', handleReportAction);
        document.body.appendChild(button);
    }

    async function setFrameworkCompatibleValue(element, value) {
        element.focus();
        await delay(TEXT_INPUT_EVENT_DELAY_MS);
        const prototype = Object.getPrototypeOf(element);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, value);
        } else {
            element.value = value;
        }
        await delay(TEXT_INPUT_EVENT_DELAY_MS);
        element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        await delay(TEXT_INPUT_EVENT_DELAY_MS);
        element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        await delay(TEXT_INPUT_EVENT_DELAY_MS);
        element.blur();
    }

    async function handleReportAction() {
        console.log("Starting autofill process...");

        const radioButton = document.querySelector(`input.comet-v2-radio-input[value="${RADIO_VALUE_TO_SELECT}"]`);
        if (!radioButton) {
            alert(`Error: Could not find the '${RADIO_VALUE_TO_SELECT}' radio button.`);
            return;
        }
        radioButton.click();
        console.log("Radio button clicked.");
        await delay(PAUSE_AFTER_EACH_ACTION_MS);

        const textarea = document.querySelector('textarea.adm-text-area-element#reportTextProof');
        if (textarea) {
            console.log("Textarea found. Attempting to set value.");
            await setFrameworkCompatibleValue(textarea, REPORT_TEXT);
            console.log("Textarea value set (attempted). Current value:", textarea.value);
        } else {
            console.warn("Optional textarea with id 'reportTextProof' not found.");
        }
        await delay(PAUSE_AFTER_EACH_ACTION_MS);

        const declarationCheckbox = document.querySelector('div.PC--statement--16_6-Mf input.comet-v2-checkbox-input');
        if (!declarationCheckbox) {
            alert("Error: Could not find the declaration checkbox.");
            return;
        }
        if (!declarationCheckbox.checked) {
            declarationCheckbox.click();
            console.log("Declaration checkbox clicked.");
        } else {
            console.log("Declaration checkbox already checked.");
        }
        await delay(PAUSE_AFTER_EACH_ACTION_MS);

        console.log("Pausing before submit logic...");
        await delay(PRE_SUBMIT_LOGIC_PAUSE_MS);

        const submitButton = document.querySelector('.adm-form-footer button.comet-v2-btn-important[type="submit"]');
        if (!submitButton) {
            alert("Error: Could not find the initial submit button.");
            return;
        }
        console.log("Initial submit button found. Disabled state:", submitButton.disabled);

        if (submitButton.disabled) {
            console.log("Initial submit button is disabled, waiting a bit longer...");
            await delay(PRE_SUBMIT_LOGIC_PAUSE_MS * 2);
            console.log("Initial submit button disabled state after extra wait:", submitButton.disabled);
            if (submitButton.disabled) {
                 alert("Error: Initial submit button remains disabled. Please check form completion and try manually.");
                 return;
            }
        }
        console.log("Clicking initial submit button...");
        submitButton.click();
        console.log("Initial submit button clicked.");

        // --- Wait for and click the confirm button ---
        console.log("Waiting for the 'confirm' button to appear...");
        const confirmButton = await waitForElement(CONFIRM_BUTTON_SELECTOR); // Using the more specific check within waitForElement

        if (confirmButton) {
            console.log("'Confirm' button found. Clicking it.");
            confirmButton.click();
            console.log("'Confirm' button clicked.");
        } else {
            alert("The 'confirm' button did not appear within the time limit. Please check the page manually.");
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createActionButton();
    } else {
        window.addEventListener('DOMContentLoaded', createActionButton);
    }

})();