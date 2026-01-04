// ==UserScript==
// @name         Facebook Business Automation
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Automates actions in Facebook Business Manager, specifically Rights Manager.
// @author       You
// @match        https://business.facebook.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526696/Facebook%20Business%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/526696/Facebook%20Business%20Automation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to get element by XPath
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Utility function to wait for an element to appear in the DOM
    function waitForElement(selector, timeoutSeconds = 15) {
        return new Promise((resolve, reject) => {
            const intervalTime = 500; // Check every 500ms
            let elapsedTime = 0;

            const interval = setInterval(() => {
                const element = typeof selector === 'string' ? document.querySelector(selector) : selector();
                if (element) {
                    clearInterval(interval); // Stop checking
                    resolve(element); // Resolve with the found element
                } else if (elapsedTime >= timeoutSeconds * 1000) {
                    clearInterval(interval); // Stop checking after timeout
                    reject(new Error(`Element not found: ${selector}`));
                }
                elapsedTime += intervalTime;
            }, intervalTime);
        });
    }

    // Function to click on an element using XPath and return a promise
    function clickElementByXPath(xpath) {
        return new Promise((resolve, reject) => {
            const element = getElementByXpath(xpath);
            if (element) {
                element.click();
                console.log(`Clicked element with XPath: ${xpath}`);
                resolve(true);
            } else {
                console.log(`Element with XPath not found: ${xpath}`);
                reject(new Error(`Element not found: ${xpath}`));
            }
        });
    }

    // Function to simulate typing into a textarea
    function simulateTyping(element, text) {
        return new Promise(resolve => {
            let index = 0;
            const typingInterval = 50; // Adjust typing speed here (milliseconds per character)

            function typeNextCharacter() {
                if (index < text.length) {
                    const char = text[index];
                    const keyCode = char.charCodeAt(0);

                    // Trigger keydown event
                    const keydownEvent = new KeyboardEvent('keydown', {
                        key: char,
                        code: `Key${char.toUpperCase()}`,
                        which: keyCode,
                        keyCode: keyCode,
                        bubbles: true,
                        cancelable: true
                    });
                    element.dispatchEvent(keydownEvent);

                    // Trigger keypress event
                    const keypressEvent = new KeyboardEvent('keypress', {
                        key: char,
                        code: `Key${char.toUpperCase()}`,
                        which: keyCode,
                        keyCode: keyCode,
                        bubbles: true,
                        cancelable: true
                    });
                    element.dispatchEvent(keypressEvent);

                    // Update the textarea value
                    element.value += char;
                    element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

                    // Trigger keyup event
                    const keyupEvent = new KeyboardEvent('keyup', {
                        key: char,
                        code: `Key${char.toUpperCase()}`,
                        which: keyCode,
                        keyCode: keyCode,
                        bubbles: true,
                        cancelable: true
                    });
                    element.dispatchEvent(keyupEvent);

                    index++;
                    setTimeout(typeNextCharacter, typingInterval);
                } else {
                    // All characters have been typed
                    element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    resolve();
                }
            }

            typeNextCharacter();
        });
    }

    // Function to insert text using execCommand
    function insertTextWithExecCommand(textarea, text) {
        textarea.focus();
        try {
            const success = document.execCommand('insertText', false, text);
            if (!success) {
                console.warn("execCommand('insertText') failed, falling back to simulateTyping");
                simulateTyping(textarea, text); // Use simulateTyping as a fallback
            }
        } catch (err) {
            console.error("Error using execCommand, falling back to simulateTyping:", err);
            simulateTyping(textarea, text); // Use simulateTyping as a fallback
        }
        // Dispatch necessary events
        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    }

    function scrollToTextareaAndEnterText(containerXPath, textareaXPath, text, maxScrollAttempts = 10) {
        return new Promise((resolve, reject) => {
            const container = getElementByXpath(containerXPath);
            if (!container) {
                return reject(new Error(`Scrollable container not found: ${containerXPath}`));
            }

            let attempts = 0;

            function tryScroll() {
                // Query the textarea directly using the placeholder attribute.
                const textarea = getElementByXpath(textareaXPath);

                if (textarea) {
                    console.log(`Found target textarea with XPath: ${textareaXPath}`);

                    // Clear existing text reliably
                    textarea.value = '';
                    textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

                    // Insert text using execCommand
                    insertTextWithExecCommand(textarea, text);
                    console.log(`Entered text into textarea with XPath: ${textareaXPath}`);
                    setTimeout(() => { // ADDED WAIT TIME HERE
                        resolve();
                    }, 6000);

                } else if (attempts < maxScrollAttempts) {
                    container.scrollBy(0, 300); // Scroll down by 300px
                    attempts++;
                    console.log(`Scrolling attempt ${attempts}...`);
                    setTimeout(tryScroll, 500); // Retry after a short delay
                } else {
                    reject(new Error(`Target textarea not found after ${maxScrollAttempts} scrolling attempts.`));
                }
            }

            tryScroll();
        });
    }

    // Function to check and click "Confirm my ownership" and handle dispute submission
    function checkAndClickConfirmOwnership() {
        const actionDivSelector = 'div[aria-labelledby][role="menuitem"]';
        const nextItemXPath = "/html[1]/body[1]/span[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]";
        const chooseActionXPath = "/html/body/span[2]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div/div[1]/div/div/div/div/div/div/div/div/div[1]/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div[2]/div[1]";

        const disputeTextareaXPath = "/html[1]/body[1]/span[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[2]/div[1]/div[3]/div[3]/div[1]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/textarea[1]";
        const disputeText = "Per the supplied composition and CWR Data, West One Music Group is the owner of this sound recording.";
        const submitDisputeXPath = "/html/body/span[2]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div/div[1]/div/div/div/div/div/div/div/div[2]/div/div[2]/div/span/div/div/div";
        const confirmButtonXPath = "/html/body/div[6]/div[1]/div[1]/div/div/div/div/div[3]/div/div[2]/div/span/div/div/div"; // Confirm button after Submit Dispute
        const scrollableContainerXPath = "/html/body/span[2]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div/div[1]/div/div/div/div/div/div/div/div[1]/div[1]";

        function tryConfirmOwnership() {
            waitForElement(actionDivSelector)
                .then(() => {
                    const actionDivs = document.querySelectorAll(actionDivSelector);
                    for (let i = 0; i < actionDivs.length; i++) {
                        if (actionDivs[i].textContent.includes("Confirm my ownership")) {
                            actionDivs[i].click();
                            console.log("Clicked 'Confirm my ownership'");
                            setTimeout(() => { // ADDED WAIT TIME HERE
                                // Scroll to textarea, enter text, submit dispute, confirm, then move to next item
                                scrollToTextareaAndEnterText(scrollableContainerXPath, disputeTextareaXPath, disputeText)
                                    .then(() => clickElementByXPath(submitDisputeXPath))
                                    .then(() => {
                                        console.log("Added 9-second delay after submitting dispute");
                                        return new Promise(resolve => setTimeout(resolve, 7000)); // 9-second delay
                                    })
                                    // .then(() => waitForElement(() => getElementByXpath(confirmButtonXPath), 15)) // Wait for the confirm button to appear
                                    .then(() => clickElementByXPath(confirmButtonXPath)) // Click the confirm button
                                    .then(() => {
                                        console.log("Waiting for 5 seconds before submitting dispute...");
                                        return new Promise(resolve => setTimeout(resolve, 6000)); // 5-second delay
                                    })
                                    .then(() => {
                                        console.log("Submitted dispute and confirmed. Moving to next item.");
                                        // Add a 5-second wait here
                                        setTimeout(function () {
                                            // Move to the next item and loop indefinitely
                                            clickElementByXPath(nextItemXPath)
                                                .then(() => clickElementByXPath(chooseActionXPath))
                                                .then(() => {
                                                    console.log("Waiting for 4 seconds before submitting dispute...");
                                                    return new Promise(resolve => setTimeout(resolve, 4000)); // 5-second delay
                                                })
                                                .then(() => tryConfirmOwnership())
                                                .catch(error => {
                                                    console.error("Error moving to next item:", error);
                                                    console.log("Retrying from beginning...");
                                                    setTimeout(resumeAutomation, 5000);
                                                });
                                        }, 5000); // 5000 milliseconds = 5 seconds
                                    })
                                    .catch(error => { // This is the important part - catching the rejection from scrollToTextareaAndEnterText
                                        console.error("Error during scrollToTextareaAndEnterText or subsequent actions:", error);
                                        console.log("Retrying from beginning...");
                                        setTimeout(resumeAutomation, 5000);
                                    });
                            }, 6000);

                            return; // Stop looking for "Confirm my ownership" in this iteration
                        }
                    }
                    console.log("Confirm my ownership not available");
                    // Move to the next item if "Confirm my ownership" is not available
                    clickElementByXPath(nextItemXPath)
                        .then(() => {
                            console.log("Waiting for 5 seconds before submitting dispute...");
                            return new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
                        })
                        .then(() => clickElementByXPath(chooseActionXPath))
                        .then(() => {
                            console.log("Waiting for 5 seconds before submitting dispute...");
                            return new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
                        })
                        .then(() => tryConfirmOwnership())
                        .catch(error => {
                            console.error("Error moving to next item:", error);
                        });
                })
                .catch(error => {
                    console.error("Error in checkAndClickConfirmOwnership:", error);
                });
        }

        tryConfirmOwnership();
    }

    function navigateAndLog() {
        GM_setValue('automationActive', true);
        window.location.href = 'https://business.facebook.com/latest/rights_manager/rights_manager_action_items?asset_id=114882491608990';
    }

    // Function to wait for a non-empty first row in <tbody> using MutationObserver
    function waitForFirstRowInTbody(tbodySelector, callback, timeoutSeconds = 30) {
        const tbody = document.querySelector(tbodySelector);
        if (!tbody) {
            console.error('Tbody not found:', tbodySelector);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const firstRow = tbody.querySelector('tr:first-child');
                    if (firstRow && firstRow.textContent.trim() !== '') {
                        observer.disconnect(); // Stop observing once the row is found
                        callback(firstRow);
                        return;
                    }
                }
            }
        });

        observer.observe(tbody, { childList: true, subtree: true });

        // Optional: Add a timeout to stop observing after a certain period
        setTimeout(() => {
            observer.disconnect();
            console.error('Timeout: First row not found within the specified time.');
        }, timeoutSeconds * 1000);
    }

    function resumeAutomation() {
        const automationActive = GM_getValue('automationActive', false);

        if (automationActive) {
            console.log('Resuming automation...');

            // Wait for 7 seconds before proceeding
            setTimeout(() => {
                console.log("Waited for 7 seconds before submitting dispute...");

                waitForFirstRowInTbody('tbody', (firstRow) => {
                    console.log('First item in <tbody>:', firstRow.textContent.trim());

                    setTimeout(() => {
                        const checkbox = firstRow.querySelector('input[type="checkbox"]');
                        if (checkbox) {
                            checkbox.click();
                            console.log('Checkbox clicked!');

                            setTimeout(() => {
                                const see_details_xpath = "/html/body/div[1]/div/div[1]/div/div[2]/div/div/div[1]/span/div/div/div[1]/div[1]/div/div/div/div/div/div/div/div/div/div[2]/div[2]/div/div/div/div/div[1]/div[2]/span[2]/div[8]/div[1]/div/div[3]/div[2]/div[1]/div";
                                const choose_action_xpath = "/html/body/span[2]/div/div[1]/div[1]/div/div/div/div/div/div[3]/div/div[1]/div/div/div/div/div/div/div/div/div[1]/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div[2]/div[1]";

                                clickElementByXPath(see_details_xpath)
                                    .then(() => {
                                        console.log("Clicked 'See Details', waiting for 'Choose Action'...");
                                        return waitForElement(() => getElementByXpath(choose_action_xpath), 15);
                                    })
                                    .then(() => {
                                        console.log("Waiting for 5 seconds before submitting dispute...");
                                        return new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
                                    })
                                    .then(() => {
                                        console.log("'Choose Action' element found, clicking...");
                                        return clickElementByXPath(choose_action_xpath);
                                    })
                                    .then(() => {
                                        console.log("Waiting for 5 seconds before submitting dispute...");
                                        return new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
                                    })
                                    .then(() => {
                                        console.log("Clicked 'Choose Action'");
                                        setTimeout(checkAndClickConfirmOwnership, 3000);
                                    })
                                    .then(() => {
                                        console.log("Waiting for 5 seconds before submitting dispute...");
                                        return new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
                                    })
                                    .catch(error => {
                                        console.error("Error in automation sequence:", error);
                                    });
                            }, 5000);
                        } else {
                            console.warn('Checkbox not found in the first row.');
                        }

                        GM_setValue('automationActive', false);
                    }, 7000);
                });
            }, 7000); // 7-second delay
        }
    }

    // Add Start button
    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.style.position = 'fixed';
    startButton.style.top = '20px';
    startButton.style.left = '20px';
    startButton.style.zIndex = '1000';
    startButton.style.backgroundColor = '#4267B2';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.padding = '10px 20px';
    startButton.style.cursor = 'pointer';
    startButton.style.borderRadius = '5px';

    startButton.addEventListener('click', navigateAndLog);
    document.body.appendChild(startButton);

    resumeAutomation();
})();
