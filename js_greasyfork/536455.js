// ==UserScript==
// @name         Keep MillenniumBCP Session Active
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script that observes the pages via MutationObserver and quickly captures and activates the button to extend the session and not be signed off.
// @author       JoaoWorkspace
// @icon         https://ptpimg.me/hy2wdn.png
// @grant        none
// @match        https://corp.millenniumbcp.pt/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536455/Keep%20MillenniumBCP%20Session%20Active.user.js
// @updateURL https://update.greasyfork.org/scripts/536455/Keep%20MillenniumBCP%20Session%20Active.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Updated number revealing how many times the session has been extended.
    let revivalCount = 0;

      /*______________*/
    /* Common tools */
    /*______________*/

    // The number of times the mutation observer executes (meaning also, how many mutations detected), variable to be incremented by the code.
    let executionCount = 0;
    const debug = false;

    async function incrementExecutionNumber(mutations){
        executionCount ++;
        if(executionCount > 999){
            observer.disconnect();
            logWithTimestamp(`Execution Count: ${executionCount} has reached a huge number. Stopping program...`);
        }
        // This formats number 1 to 001 and 23 to 023.
        // It predicts the execution count (meaning number of mutations) in the same page doesn't surpass 999 executions.
        // A very realistic number, safe for edge cases, like videogames.
        const formattedNumber = executionCount.toString().padStart(3, '0');
        console.log('####################################################');
        console.log(`############### Execution Number ${formattedNumber} ###############`);
        console.log('####################################################');
        if (mutations) {
            // Count each type of mutation
            const mutationCounts = mutations.reduce(
                (counts, mutation) => {
                    counts[mutation.type] = (counts[mutation.type] || 0) + 1;
                    return counts;
                },
                { attributes: 0, characterData: 0, childList: 0 }
            );
            console.log('################## Mutation Stats ##################');
            console.log(`# Attribute Mutations: ${mutationCounts.attributes}`);
            console.log(`# Character Data Mutations: ${mutationCounts.characterData}`);
            console.log(`# Child List Mutations: ${mutationCounts.childList}`);
        }
        console.log('####################################################');
    }

    async function giveStatusUpdate(section){
        const formattedNumber = executionCount.toString().padStart(3, '0');
        const formattedTimestamp = new Date()
        .toISOString()
        .replace('T', ' ')
        .replace(/\.\d+/, match => match.substring(0, 2)) // Keep only the first decimal of milliseconds
        .replace('Z', ''); // Remove trailing 'Z'
        console.log('####################################################');
        console.log(`############### Execution ${formattedNumber} Result ###############`);
        console.log(`############### ${formattedTimestamp} ##############`);
        console.log('####################################################');
        console.log(`# Section ${section} complete...`);
        console.log('####################################################');
        console.log(`# Session Revivals: ${revivalCount}`);
        console.log('####################################################');
    }

    // Utility function for logging with a timestamp
    function logWithTimestamp(message, ...optionalParams) {
        const formattedTimestamp = new Date()
        .toISOString()
        .replace('T', ' ')
        .replace(/\.\d+/, match => match.substring(0, 2)) // Keep only the first decimal of milliseconds
        .replace('Z', ''); // Remove trailing 'Z'
        console.log(`${formattedTimestamp} | ${message}`, ...optionalParams);
    }

        // Debug function for adding varied listeners to the target element
    async function injectEventListeners(targetElement) {
        targetElement.addEventListener('focus', (e) => logWithTimestamp('Focused!', e));
        targetElement.addEventListener('click', (e) => logWithTimestamp('Clicked!', e));
        targetElement.addEventListener('blur', (e) => logWithTimestamp('Blurred!', e));
        targetElement.addEventListener('change', (e) => logWithTimestamp('Changed!', e));
        targetElement.addEventListener('input', (e) => logWithTimestamp('Received Input!', e));
        targetElement.addEventListener('keyup', (e) => logWithTimestamp('Key Up!', e));
        targetElement.addEventListener('keydown', (e) => logWithTimestamp('Key Down!', e));
        targetElement.addEventListener('keypress', (e) => logWithTimestamp('Key Pressed!', e));
        targetElement.addEventListener('mousedown', (e) => logWithTimestamp('Mouse Down!', e));
        targetElement.addEventListener('mouseup', (e) => logWithTimestamp('Mouse Up!', e));
    }

    // Waits for a single element matching the selector
    async function waitForElement(selector, source, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = source.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                if(debug) logWithTimestamp(`Element with selector \"${selector}\" not found within timeout.`);
                resolve(null);
            }, timeout);
        });
    }

    // Waits for at least a single element matching the selector
    async function waitForElements(selector, source, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const elements = source.querySelectorAll(selector);
                if (elements) {
                    clearInterval(interval);
                    resolve(elements);
                }
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                if(debug) logWithTimestamp(`Elements with selector \"${selector}\" not found within timeout.`);
                resolve(null);
            }, timeout);
        });
    }

    // Sets the value of the input element and ensures changes are registered
    async function setInputValue(inputElement, value) {
        if (inputElement) {
            const valueSetter = Object.getOwnPropertyDescriptor(
                Object.getPrototypeOf(inputElement),
                'value'
            )?.set;

            if (valueSetter) {
                valueSetter.call(inputElement, value);
            } else {
                inputElement.value = value;
            }
            dispatchInputChange(inputElement);
        } else {
            logWithTimestamp("Input element is null or undefined.", "warn");
        }
    }

    // Dispatches input and change events for the input element
    async function dispatchInputChange(inputElement) {
        logWithTimestamp(`Dispatching Change Event to ${inputElement.name}`);
        if (inputElement) {
            ['change', 'input'].forEach((eventType) => {
                const event = new Event(eventType, { bubbles: true });
                inputElement.dispatchEvent(event);
            });
        }
    }

    // Finds and clicks the submit button
    async function findAndClickButton(submitButton) {
        if (submitButton) {
            if (submitButton.getAttribute('aria-disabled') === 'true') {
                logWithTimestamp("Submit button is disabled. Removing disabled attribute.");
            }
            submitButton.removeAttribute('aria-disabled');
            submitButton.click();
            logWithTimestamp("Submit button clicked.");
        } else {
            logWithTimestamp("Submit button not found.", "warn");
        }
    }

    // To control debounce timing
    let debounceTimeout = null;
    // The DEBOUNCE_DELAY prevents the script from executing actions too frequently by grouping mutation events within a set interval (1 second by default).
    const DEBOUNCE_DELAY = 1000;

    /*
     * Use MutationObserver with Debounce and log the many times it gets triggered
     * Guarantees that when there's a rapid successive number of mutations on the page, it ignores it
     * Only "processes mutations" after at least 1 second without mutations occurs.
    */
    const observer = new MutationObserver((mutations) => {
        if(debug) logWithTimestamp(`Observer Triggered... Clearing timeout of ${debounceTimeout} ms`);
        if (debounceTimeout) clearTimeout(debounceTimeout); // Clear the previous timeout
        if(debug) logWithTimestamp(`Setting a timeout of ${DEBOUNCE_DELAY} ms`);
        debounceTimeout = setTimeout(() => processMutations(mutations), DEBOUNCE_DELAY);
    });

    /*_____________________*/
    /* End of Common Tools */
    /*_____________________*/

    async function processMutations(mutations) {
        console.clear();
        if(debug) logWithTimestamp(`Found the following mutations`,mutations);
        await incrementExecutionNumber(mutations);
        if(await locateKeepAliveAndExtendSession()){
            revivalCount++;
        }
        giveStatusUpdate("Keep-Alive");
    }

    // Define a function to locate the Keep-Alive button and press it to extend it
    async function locateKeepAliveAndExtendSession() {
        const sessionButtons = await waitForElements('button.cf-button', document);
        for (const button of sessionButtons) {
            // Check if the button's text content is "Sim"
            if (button.textContent.trim() === 'Sim') {
                logWithTimestamp('Session keep-alive button found:', button);
                await findAndClickButton(button); // Your existing function to click the button
                return true; // Indicate success
            }
        }
        logWithTimestamp('Session keep-alive button not found!')
        return false; // Indicate failure
    }

    console.log(`JoaoWorkspace's Userscript injected! Starting observer on this page's document: ${window.location.href}`);
    // Start observing only after the entire page is fully loaded
    window.addEventListener('load', () => {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Observer started after window load.');
    });

})();