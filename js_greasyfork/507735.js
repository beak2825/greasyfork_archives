// ==UserScript==
// @name         noredinkhack
// @version      0.7
// @description  Clicks a button with ID 'nri-quiz-submit-button' every 500ms for 5 seconds. If not found, clicks 'try-similar-problem' instead.
// @match        *://www.noredink.com/learn/quiz/*
// @grant        none
// @namespace https://greasyfork.org/users/1365527
// @downloadURL https://update.greasyfork.org/scripts/507735/noredinkhack.user.js
// @updateURL https://update.greasyfork.org/scripts/507735/noredinkhack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Count of clicks for each button
    let submitButtonCount = 0;
    let trySimilarButtonCount = 0;

    // Function to click the buttons
    function clickButton() {
        // Try to select the button with ID 'nri-quiz-submit-button'
        const submitButton = document.getElementById('nri-quiz-submit-button');
        if (submitButton) {
            submitButton.click();
            submitButtonCount++;
            console.log(`'Submit answer' button clicked ${submitButtonCount} times`);
        } else {
            // If 'nri-quiz-submit-button' is not found, try the 'try-similar-problem' button
            const trySimilarButton = document.getElementById('try-similar-problem');
            if (trySimilarButton) {
                trySimilarButton.click();
                trySimilarButtonCount++;
                console.log(`'Try a similar problem' button clicked ${trySimilarButtonCount} times`);
            } else {
                console.log('Both buttons not found');
            }
        }
    }

    // Click the buttons every 500 milliseconds
    const intervalId = setInterval(clickButton, 500);

    // Stop clicking after 5 seconds
    setTimeout(() => {
        clearInterval(intervalId);
        console.log(`Stopped clicking. Total 'Submit answer' clicks: ${submitButtonCount}`);
        console.log(`Total 'Try a similar problem' clicks: ${trySimilarButtonCount}`);
    }, 5000); // 5000 milliseconds = 5 seconds
})();
