// ==UserScript==
// @name         Scoodle answers
// @namespace    http://tampermonkey.net/
// @version      2024-12-07
// @description  Gives you access to all the answers on scoodle.
// @author       Galaxic
// @match        *://*.plantyn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520033/Scoodle%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/520033/Scoodle%20answers.meta.js
// ==/UserScript==


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        startProcessing();
    });
} else {
    startProcessing();
}

function startProcessing() {
    setInterval(() => {
        const elements = document.getElementsByClassName("answerrow");
        if (elements.length) {
            console.log(`${elements.length} elements found with class "answerrow"`);

            // Loop through and remove inline styles
            Array.from(elements).forEach(element => {
                element.removeAttribute('style');
                console.log("Removed styles from:", element);
            });
        } else {
            console.log("No elements found with class 'answerrow'.");
        }
    }, 3000); // Run every 3 seconds
}
