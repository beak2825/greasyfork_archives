// ==UserScript==
// @name         Meet Record
// @namespace    https://github.com/rokn/automation_scripts
// @version      1.0
// @description  Automatically record a meeting
// @author       Antonio Mindov
// @match        https://meet.google.com/*-*-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457844/Meet%20Record.user.js
// @updateURL https://update.greasyfork.org/scripts/457844/Meet%20Record.meta.js
// ==/UserScript==

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const findElement = (xpath, within=document) => {
    return document.evaluate(xpath, within, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const waitForElement = async (xpath, retries = -1, timeout = 300, within=document) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            console.log(`Searching for ${xpath}`);
            const el = findElement(xpath, within);
            console.log(`Result ${el}`);
            if (el) {
                resolve(el);
                clearInterval(interval);
                return
            }
            if (retries > 0) {
                retries-=1;
            }
            if (retries === 0) {
                clearInterval(interval);
                reject();
            }

        }, timeout);
    });
}


(async function() {
    'use strict';
    // Wait for an element which is after joining, the chat button.
    await waitForElement("//button[contains(@aria-label, 'Chat')]");
    // Get the more options button.
    const moreOptions = await waitForElement("//button[contains(@aria-label, 'More options')]");
    moreOptions.click();
    let recordingButton = null;
    try {
        recordingButton = await waitForElement("//li[span[contains(text(), 'recording')]]", 3);
    } catch {
        console.log("no recording button found");
        moreOptions.click();
        return;
    }

    recordingButton.click();
    delay(300);

    const recordingHeader = await waitForElement("//div[contains(text(), 'Recording')]");
    const closeButton = await waitForElement("//button[contains(@aria-label, 'Close')]", -1, 300, recordingHeader.parentNode);

    const startRecording = await waitForElement("//button[span[contains(text(), 'Start recording')]]");
    startRecording.click();
    console.log(closeButton);
    closeButton.click();
})();