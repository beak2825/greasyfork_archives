// ==UserScript==
// @name         Submit & status shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.100
// @author       khaled_eg ( https://codeforces.com/profile/khaled_eg )
// @match        https://codeforces.com/*
// @grant        none
// @license MIT
// @description Replace a word in the URL and redirect to the new URL when Ctrl+Shift+S is pressed (Works only on Codeforces)
// @downloadURL https://update.greasyfork.org/scripts/487433/Submit%20%20status%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/487433/Submit%20%20status%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the first occurrence of a word from the right in the URL
    function replaceWordInURL(wordToReplace, replacement) {
        let currentURL = window.location.href;
        let reversedURL = currentURL.split('').reverse().join('');
        let reversedWordToReplace = wordToReplace.split('').reverse().join('');
        let reversedReplacement = replacement.split('').reverse().join('');
        let reversedNewURL = reversedURL.replace(reversedWordToReplace, reversedReplacement);
        let newURL = reversedNewURL.split('').reverse().join('');
        return newURL;
    }

    // Function to handle keydown event
    function handleKeyDown(event) {
        // Check if Ctrl+Shift+S is pressed
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            // Check if the URL contains the word "problem"
            if (window.location.href.includes("problem")) {
                // Replace the first occurrence of "problem" with "submit"
                let newURL = replaceWordInURL("problem", "submit");
                // Redirect to the new URL
                window.location.href = newURL;
            } else {
                // If neither "problem" found, search for "status" and replace it with "submit"
                let newURL = replaceWordInURL("status", "submit");
                // Redirect to the new URL
                window.location.href = newURL;
            }
        }
        // Check if Ctrl+Shift+U is pressed
        if (event.ctrlKey && event.shiftKey && event.key === 'U') {
            // Check if the URL contains the word "problem"
            if (window.location.href.includes("problem")) {
                // Replace the first occurrence of "problem" with "status"
                let newURL = replaceWordInURL("problem", "status");
                // Check if "?friends=on" already exists at the end of the URL
                if (!newURL.includes("?friends=on")) {
                    newURL += newURL.includes("?") ? "&friends=on" : "?friends=on";
                }
                // Redirect to the new URL
                window.location.href = newURL;
            } else if (window.location.href.includes("submit")) {
                // Replace the first occurrence of "submit" with "status"
                let newURL = replaceWordInURL("submit", "status");
                // Check if "?friends=on" already exists at the end of the URL
                if (!newURL.includes("?friends=on")) {
                    newURL += newURL.includes("?") ? "&friends=on" : "?friends=on";
                }
                // Redirect to the new URL
                window.location.href = newURL;
            }
        }
    }

    // Add event listener for keydown event
    document.addEventListener('keydown', handleKeyDown);
})();
