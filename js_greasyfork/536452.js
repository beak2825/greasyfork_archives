// ==UserScript==
// @name         Auto-authenticate MillenniumBCP Company Account
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Given your UserCode, Password and NIF, authenticates you automatically once you land on the login page for MillenniumBCP (Company Version).
// @author       JoaoWorkspace
// @match        https://idp.millenniumbcp.pt/a/connect/login*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536452/Auto-authenticate%20MillenniumBCP%20Company%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/536452/Auto-authenticate%20MillenniumBCP%20Company%20Account.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Map NIF positions to corresponding ordinal values (1ª -> 1, 2ª -> 2, etc.)
    const positionMap = {
        "1ª": 0,
        "2ª": 1,
        "3ª": 2,
        "4ª": 3,
        "5ª": 4,
        "6ª": 5,
        "7ª": 6,
        "8ª": 7,
        "9ª": 8
    };

    // Your static NIF
    const NIF = "IntroduceYourNIF";

    // Your static UserCode
    const UserCode = "IntroduceYourUserCode";

    // Your static UserPassword
    const UserPassword = "IntroduceYourPassword";

    /*Variables of Control*/
    let userCodeSubmitted = false; // This variable of control guarantees we only attempt to fill the userCode one time in the code's runtime, given every mutation to the document causes these variables to be re-validated.
    let userPasswordSubmitted = false; // This variable of control guarantees we only attempt to fill the userPassword one time in the code's runtime, given every mutation to the document causes these variables to be re-validated.
    let nifSecurityQuestionSubmitted = false; // This variable of control guarantees we only attempt to fill the NIF Security Question one time in the code's runtime, given every mutation to the document causes these variables to be re-validated.

    /*______________*/
    /* Common tools */
    /*______________*/

    // The number of times the mutation observer executes (meaning also, how many mutations detected), variable to be incremented by the code.
    let executionCount = 0;
    const debug = false;

    async function incrementExecutionNumber(mutations){
        if(!debug){
            executionCount ++;
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
    }

    async function giveStatusUpdate(section){
        if(!debug){
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
            console.log(`# User Code Submitted: ${userCodeSubmitted}`);
            console.log(`# User Password Submitted: ${userPasswordSubmitted}`);
            console.log(`# NIF Submitted: ${nifSecurityQuestionSubmitted}`);
            console.log('####################################################');
        }
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

    // Use MutationObserver to catch all the subtle mutations in the page's document
    async function processMutations(mutations) {
        console.clear();
        if(debug) logWithTimestamp(`Found the following mutations`,mutations);
        await incrementExecutionNumber(mutations);
        if (!userCodeSubmitted) {
            logWithTimestamp("Attempting to locate and fill user code...");
            if (await locateAndFillUserCode()) {
                logWithTimestamp("UserCode input filled successfully.");
                userCodeSubmitted = true; // Mark as submitted
            }
        }
        await giveStatusUpdate('UserCode');

        if (userCodeSubmitted && !userPasswordSubmitted) {
            logWithTimestamp("Attempting to locate and fill user password...");
            if (await locateAndFillUserPassword()) {
                logWithTimestamp("UserPassword input filled successfully.");
                userPasswordSubmitted = true; // Mark as submitted
            }
        }
        await giveStatusUpdate('UserPassword');

        if (userCodeSubmitted && userPasswordSubmitted && !nifSecurityQuestionSubmitted) {
            logWithTimestamp("Attempting to locate and fill NIF security questions...");
            if (await locateAndFillNifSecurityQuestion()) {
                logWithTimestamp("NIF security questions filled successfully.");
                nifSecurityQuestionSubmitted = true; // Mark as submitted
            }
        }
        await giveStatusUpdate('NIF');
    }

    // Define a function to locate and fill the UserCode input field
    async function locateAndFillUserCode() {
        const formElement = await waitForElement('#root form', document);
        if (!formElement) {
            logWithTimestamp('LocateAndFillUserCode: Form element not found!');
            return false; // Indicate failure
        }
        logWithTimestamp('Form Found:', formElement);

        try {
            const userCodeInput = await waitForElement('input[name="userAlias"]', formElement);
            logWithTimestamp('UserCode input found:', userCodeInput);

            // Fill the input and dispatch an event
            await setInputValue(userCodeInput, UserCode);
            logWithTimestamp('Finally set value of userCode!');

            // Locate and click the continue button
            const continueButton = await waitForElement('button.cf-button', formElement);
            if (continueButton) {
                logWithTimestamp('Continue button found:', continueButton);
                await findAndClickButton(continueButton);
                return true;
            } else {
                logWithTimestamp('Continue button not found!');
            }

            return false;
        } catch (error) {
            logWithTimestamp('Error locating or interacting with userAlias input:', error);
            return false; // Indicate failure
        }
    }

    // Define a function to locate and fill the UserPassword input field
    async function locateAndFillUserPassword() {
        const formElement = await waitForElement('#root form', document);
        if (!formElement) {
            logWithTimestamp('LocateAndFillUserPassword: Form element not found!');
            return false; // Indicate failure
        }
        logWithTimestamp('Form Found:', formElement);

        try {
            const userPasswordInput = await waitForElement('input[name="password"]', formElement);
            logWithTimestamp('UserPassword input found:', userPasswordInput);

            // Fill the input and dispatch an event
            await setInputValue(userPasswordInput, UserPassword);
            logWithTimestamp('Finally set value of password!');

            // Locate and click the continue button
            const continueButton = await waitForElement('button.cf-button', formElement);
            if (continueButton) {
                logWithTimestamp('Continue button found:', continueButton);
                await findAndClickButton(continueButton);
                return true; // Indicate success
            } else {
                logWithTimestamp('Continue button not found!');
            }

            return false;
        } catch (error) {
            logWithTimestamp('Error locating or interacting with password input:', error);
            return false; // Indicate failure
        }
    }

    // Define a function to locate and fill the NIF Security Question input field
    async function locateAndFillNifSecurityQuestion() {
        try {
            // Wait for the form element
            const formElement = await waitForElement('#root form', document);
            if (!formElement) {
                logWithTimestamp("LocateAndFillNifSecurityQuestion: Form element not found!");
                return false; // Indicate failure
            }

            logWithTimestamp("Form Found:", formElement);

            // Wait for <p> elements inside the form
            const pElements = await waitForElements('p', formElement);
            if (pElements.length === 0) {
                logWithTimestamp("No label elements found.");
                return false;
            }

            logWithTimestamp("Found label elements:", pElements);

            const necessaryInputsFilled = 2;
            let totalInputsFilled = 0;
            // Iterate over the labels
            for (const label of pElements) {
                const text = label.textContent.trim();
                const position = positionMap[text]; // Lookup position in positionMap

                // Check if the label matches a position
                if (position !== undefined) {
                    logWithTimestamp("Possible NIF Security Question label found:", label);

                    let parentDiv = label.parentElement;

                    // Traverse up to find a parent <div> containing the input
                    while (parentDiv && parentDiv.querySelector('input.cf-input') === null) {
                        logWithTimestamp("Did not find input.cf-input on", parentDiv);
                        parentDiv = parentDiv.parentElement;
                    }

                    if (parentDiv) {
                        logWithTimestamp("Found parent div containing the NIF Security Question input:", parentDiv);
                        const inputElement = await waitForElement('input.cf-input', parentDiv);
                        if (!inputElement) {
                            logWithTimestamp("Input element not found inside parentDiv.");
                            continue;
                        }

                        logWithTimestamp("Found the NIF Security Question input:", inputElement);
                        await setInputValue(inputElement, NIF[position]);
                        logWithTimestamp(`Successfully set value of NIF: ${NIF[position]} into its input field: ${text}`);
                        totalInputsFilled++;
                    }
                }
            }
            // If the totalInputsFilled === necessaryaInputsFilled, we are sure we filled enough fields to activate the submit form button
            if(totalInputsFilled === necessaryInputsFilled){
                // Locate and click the continue button
                const continueButton = await waitForElement('button.cf-button', formElement);
                if (continueButton) {
                    logWithTimestamp("Continue button found:", continueButton);
                    await findAndClickButton(continueButton);
                    return true; // Indicate success
                } else {
                    logWithTimestamp("Continue button not found!");
                }
            }
            return true; // Indicate failure if no valid label/input is found
        } catch (error) {
            logWithTimestamp("Error locating or interacting with NIF input:", error);
            return false;
        }
    }

    console.log(`JoaoWorkspace's Userscript injected! Starting observer on this page's document: ${window.location.href}`);
    // Start observing only after the entire page is fully loaded
    window.addEventListener('load', () => {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Observer started after window load.');
    });
})();
