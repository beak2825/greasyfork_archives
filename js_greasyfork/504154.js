// ==UserScript==
// @name         ChatGPT datetimestamp
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  Update <time> element to show chat title and datetime on chatgpt.com
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504154/ChatGPT%20datetimestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/504154/ChatGPT%20datetimestamp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update the <time> element with chat title and datetime
    function updateTimeElement() {
        var timeElement = document.querySelector('time'); // Selects the first <time> element
        var chatTitle = document.title; // Gets the content of the <title> element
        var datetime = timeElement ? timeElement.getAttribute('title') : 'No datetime found';

        if (timeElement) {
            // Update the content of the time element with the chat title and datetime
            timeElement.innerHTML = `
                <span>Chat Title: ${chatTitle}</span><br>
                <span>Date and Time: ${datetime}</span>
            `;
            console.log('Update successful');
            return true; // Indicate successful update
        } else {
            console.log('No <time> element found');
            return false; // Indicate no update
        }
    }

    // Retry function with limited attempts
    function tryUpdate(maxAttempts, interval) {
        let attempts = 0;
        
        const intervalId = setInterval(() => {
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('Max attempts reached');
                return;
            }
            
            if (updateTimeElement()) {
                clearInterval(intervalId); // Stop retrying on successful update
            }
            
            attempts++;
        }, interval);
    }

    // Run the retry function with 5 attempts and a 1-second interval
    tryUpdate(5, 1000);

})();
