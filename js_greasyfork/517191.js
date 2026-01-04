// ==UserScript==
// @name         IDP - Auto Approve Stack
// @namespace    http://tampermonkey.net/
// @version      2025-12-06
// @description  Automates environment selection, discards changes, and approves for specific environments.
// @match        https://*.cloudfront.net/*
// @grant        GM_log
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517191/IDP%20-%20Auto%20Approve%20Stack.user.js
// @updateURL https://update.greasyfork.org/scripts/517191/IDP%20-%20Auto%20Approve%20Stack.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_log("Auto-Environment-Clicker script running...");

    const params = new URLSearchParams(window.location.search);
    const environment = params.get('environment');

    if (!environment) {
        console.warn("No 'environment' parameter found in the URL.");
        return;
    }


    GM_log(`Environment parameter found: ${environment}`);

    function notify(message) {
        const stackName = document.querySelectorAll("h1")[0].innerText.replace(" STACK", "").toLowerCase();

        // Get the current time in a human-readable format
        const currentTime = new Date().toLocaleString('en-US', {
            weekday: 'short', // Short day name
            year: 'numeric',
            month: 'short', // Short month name
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true // AM/PM format
        });

        // Format the message
        const m = `${currentTime}: ${message}`;

        // Send the message to the ntfy topic
        fetch('https://ntfy.sh/' + stackName, {
            method: 'POST',
            body: m
        })
            .then(response => {
                if (response.ok) {
                    GM_log(`Notification sent successfully: ${message}`);
                } else {
                    console.error('Failed to send notification.', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error while sending notification:', error);
            });
    }

    function findAndClickEnvironmentSpan() {
        GM_log("running findAndClickEnvironmentSpan");
        const span = [...document.querySelectorAll('span.title')].find(el => el.textContent.trim().toLowerCase() === environment);
        const current_environment = document.querySelector("body > app-root > div > stack-home > div > div.card-container > div.environments > div").children[0].children[0].children[0].children[1].children[0].children[0].innerText.trim().toLowerCase()

        GM_log(current_environment, environment)

        if (current_environment == environment) {
            GM_log(`Skipping clicking on span as environment is already on ${environment}`)
            clearInterval(environmentCheckInterval);
            waitForApproveButton();
        }
        else if (span) {
            GM_log(`Found environment span: ${span.textContent}. Clicking it...`);
            span.click();
            clearInterval(environmentCheckInterval);
            // waitForDiscardDiaGM_log();
            waitForApproveButton();
        } else {
            GM_log(`Looking for span with environment name: ${environment}`);
        }
    }

    /*function waitForDiscardDiaGM_log() {
        GM_log("running waitForDiscardDialog")

        const discardCheckInterval = setInterval(() => {
            const yesButton = [...document.querySelectorAll('button')].find(btn => btn.textContent.trim() === 'Yes');

            if (yesButton) {
                GM_log("Found 'Yes' button in discard changes dialog. Clicking it...");
                yesButton.click();
                clearInterval(discardCheckInterval);
                waitForApproveButton();
            } else {
                GM_log("Looking for 'Yes' button in discard changes dialog...");
            }
        }, 1000);
    }*/

    function waitForApproveButton() {
        GM_log("running waitForApproveButton");

        const approveInterval = setInterval(() => {
            const approveButton = Array.from(document.querySelectorAll("button"))
                .find(button => button.textContent.trim().toUpperCase() === "APPROVE");

            if (approveButton) {
                GM_log("Found 'Approve' button. Clicking and stopping script...");
                approveButton.click();
                clearInterval(approveInterval);
                waitForOKButton();

                notify("APPROVED")

            } else {
                GM_log("Approve button not found yet ... waiting 1 sec");
            }
        }, 1000);
    }

    function waitForOKButton() {
        GM_log("running waitForOKButton");

        const okButtonInterval = setInterval(() => {
            const okButton = Array.from(document.querySelectorAll(".mat-focus-indicator.mat-stroked-button.mat-button-base.ng-star-inserted"))
                .find(button => button.innerText.trim() === "OK");

            if (okButton) {
                GM_log("Found 'OK' button. Clicking it...");
                okButton.click();
                clearInterval(okButtonInterval);
                waitForStackStatus();
            } else {
                GM_log("Looking for 'OK' button...");
            }
        }, 1000);
    }

    function waitForStackStatus() {
        GM_log("running waitForStackStatus");

        const stackStatusInterval = setInterval(() => {
            // Search only through div elements containing "Stack Status: " text
            const allDivs = Array.from(document.querySelectorAll('div'));
            const stackStatusElements = allDivs.filter(el => 
                el.innerText && 
                el.innerText.includes('Stack Status: ')
            );

            // Find the most specific element (smallest text content)
            const stackStatusElement = stackStatusElements.reduce((smallest, current) => {
                if (!smallest) return current;
                return current.innerText.length < smallest.innerText.length ? current : smallest;
            }, null);

            if (stackStatusElements.length > 0) {
                GM_log(`Found ${stackStatusElements.length} elements with "Stack Status: "`);
                stackStatusElements.forEach((el, index) => {
                    GM_log(`  ${index + 1}. [${el.tagName}] "${el.innerText.trim()}"`);
                });
            } else {
                GM_log("No elements found containing 'Stack Status: '");
            }

            const statusText = stackStatusElement ? stackStatusElement.innerText.trim() : "";

            GM_log(`Current Stack Status: "${statusText}"`);

            if (statusText === "Stack Status: READY" || statusText === "Stack Status: FAILED") {
                GM_log(`Stack Status updated: ${statusText}. Stopping script and closing window.`);

                notify(statusText);

                clearInterval(stackStatusInterval);

                // Add a small delay before closing to ensure the notification is sent
                setTimeout(() => {
                    GM_log("Closing window...");
                    window.close();
                }, 1000);
            } else {
                GM_log(`Waiting for stack status to change to READY or FAILED...`);
            }
        }, 1000);
    }

    const environmentCheckInterval = setInterval(findAndClickEnvironmentSpan, 1000);

})();
