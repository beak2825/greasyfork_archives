// ==UserScript==
// @name         Gift card guesser / rng string generator v2.1.1
// @namespace    http://tampermonkey.net/
// @version      2024-10-31
// @description  random string generator, more information on script run.
// @author       Gosh227
// @match        https://www.google.com.*/
// @match        https://*
// @match        https://www.fortnite.*/*
// @match        https://www.roblox.com/*
// @match        https://www.apple.com.*/*
// @match        https://www.jbhifi.com/*
// @match        https://www.steam.com.*/*
// @match        https://www.*
// @match        http*://www.amazon.com.*/*
// @match        https://www.fortnite.com/vbuckscard?lang=en-US
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514960/Gift%20card%20guesser%20%20rng%20string%20generator%20v211.user.js
// @updateURL https://update.greasyfork.org/scripts/514960/Gift%20card%20guesser%20%20rng%20string%20generator%20v211.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastRandomString = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let length = 10;

    // Show welcome message
    alert("Made by Gosh227\n\n" +
          "Ctrl + Q runs customization menu\n" +
          "Ctrl + B runs basic autopaste\n" +
          "Ctrl + L runs advanced autopaste + Bypass\n" +
          "To add more websites, go to string gen > edit > // @match https://'Your website'/*\n" +
          "More features coming soon ig");

    // Function to generate a random string
    function generateRandomString(length, characters) {
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Function to insert the random string into the selected text box
    function insertRandomString() {
        length = parseInt(prompt("Enter the length of the random string:", length)) || length;
        characters = prompt("Enter the characters to use (leave blank for default: A-Z, a-z, 0-9):", characters) || characters;

        lastRandomString = generateRandomString(length, characters);

        const activeElement = document.activeElement;
        if (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea') {
            activeElement.value = lastRandomString;
        } else {
            alert("Please select a text box or input field.");
        }
    }

    // Function to instantly paste a new random string and clear previous text
    function pasteNewRandomString() {
        const activeElement = document.activeElement;
        if (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea') {
            lastRandomString = generateRandomString(length, characters); // Generate a new string using the same settings
            activeElement.value = lastRandomString; // Clear previous text and insert new string
        } else {
            alert("Please select a text box or input field.");
        }
    }

    // Function to enter a new random string after a delay
    function delayedPasteNewRandomString() {
        const activeElement = document.activeElement;
        if (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea') {
            lastRandomString = generateRandomString(length, characters); // Generate a new string using the same settings
            activeElement.value = lastRandomString; // Insert new string
            setTimeout(() => {
                // Simulate pressing Enter after 1 second
                const event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13
                });
                activeElement.dispatchEvent(event);
            }, 1000);
        } else {
            alert("Please select a text box or input field.");
        }
    }

    // Add keyboard shortcuts (Ctrl + Q, Ctrl + B, and Ctrl + L)
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'q') {
            event.preventDefault(); // Prevent default action
            insertRandomString();
        } else if (event.ctrlKey && event.key === 'b') {
            event.preventDefault(); // Prevent default action
            pasteNewRandomString();
        } else if (event.ctrlKey && event.key === 'l') {
            event.preventDefault(); // Prevent default action
            delayedPasteNewRandomString();
        }
    });
})();