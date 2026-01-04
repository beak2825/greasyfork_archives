// ==UserScript==
// @name         Chatgpt query inserter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert Text from query parameters into chatgpt textarea and confirm
// @author       Manimo
// @match        https://chat.openai.com/*
// @grant        none
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/464955/Chatgpt%20query%20inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/464955/Chatgpt%20query%20inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryParam(name) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(name);
    }

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);

        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    function clickButton(textarea) {
        const button = textarea.nextElementSibling;
        if (button) {
            button.click();
            console.log('Tampermonkey script: Button clicked');
        } else {
            console.log('Tampermonkey script: Button not found');
        }
    }

    function insertTaskIntoTextarea() {
        const task = getQueryParam('task');
        console.log('Tampermonkey script: Insert Task into Textarea - Running');

        if (task) {
            console.log(`Tampermonkey script: Task value found: ${task}`);
            waitForElement('textarea', (textarea) => {
                textarea.value = task;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Tampermonkey script: Task value inserted into textarea');

                // Wait for 500 milliseconds before clicking the button
                setTimeout(() => {
                    clickButton(textarea);
                }, 500);
            });
        } else {
            console.log('Tampermonkey script: Task value not found');
        }
    }

    // Wait for 1.5 seconds before starting the whole script
    setTimeout(() => {
        insertTaskIntoTextarea();
    }, 1500);
})();
