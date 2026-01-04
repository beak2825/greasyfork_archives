// ==UserScript==
// @name         Save Leetcode Problem to Obsidian
// @namespace    http://tampermonkey.net/
// @version      2024-07-26
// @description  Save the current leetcode problem as new obsidian note.
// @author       miscde
// @match        https://leetcode.com/problems/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_openInTab
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500966/Save%20Leetcode%20Problem%20to%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/500966/Save%20Leetcode%20Problem%20to%20Obsidian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and return the timer value
    let containerElement = document.querySelector('#ide-top-btns');

    function getTimerValue() {
        if (containerElement) {
            // Find the timer element within the container
            let timerElement = containerElement.querySelector('.select-none.pr-2.text-sm.text-text-secondary.dark\\:text-text-secondary');

            if (timerElement) {
                let timerValue = timerElement.textContent || timerElement.innerText;
                console.log('Current Timer Value:', timerValue);
                return timerValue;
            } else {
                console.log('Timer element not found within the container');
                return null;
            }
        } else {
            console.log('Container element not found');
            return null;
        }
    }

// Call the function to capture and log the timer value
    let timerValue = getTimerValue();
    let [hours, minutes, seconds] = timerValue.split(':').map(Number);
    let minutesSpent = hours * 60 + minutes + Math.round(seconds / 60);

    let currentUrl = window.location.href;

    let difficultyElement = document.querySelector('[class*="text-difficulty-"]');

    // Function to get the difficulty level
    function getDifficulty() {
        if (difficultyElement) {
            let difficultyText = difficultyElement.textContent || difficultyElement.innerText;
            difficultyText = difficultyText.toLowerCase();
            console.log('Problem Difficulty:', difficultyText);
            return difficultyText;
        } else {
            console.log('Difficulty element not found');
            return null;
        }
    }

    // Call the function to capture and log the difficulty
    let difficultyValue = getDifficulty();

    let fullPath = window.location.pathname;

    // Extract the relevant part (/problems/xxxx)
    let matchedPath = fullPath.match(/\/problems\/[^\/]+/)[0];

    // Find the <a> element with the matching href attribute
    let linkElement = document.querySelector(`a[href*="${matchedPath}"]`);

    // Function to get the text of the <a> element
    function getProblemName() {
        if (linkElement) {
            let linkText = linkElement.textContent || linkElement.innerText;
            linkText = linkText.replace(/\?/g, "");
            console.log('Link Text:', linkText);
            return linkText;
        } else {
            console.log('Link element not found for href:', matchedPath);
            return null;
        }
    }

    // Call the function to capture and log the link text
    let problemName = getProblemName();
    let today = new Date().toISOString().split('T')[0];

    let content = `---
lc-link: ${currentUrl}
minutes-spent: ${minutesSpent}
attempts:
difficulty: ${difficultyValue}
solved-on: ${today}
comment:
review-on:
---
# Algorithm


# Complexities

- Time:
- Space:

# Alternative Approach


# New Functions`;


    async function createObsidianDocument(obsidianUrl, documentPath, content, token) {
        // check if exists
        let fileExists = false;
        try {
            let response = await fetch(obsidianUrl + '/vault' + documentPath, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/markdown',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fileExists = true;
            }
        } catch (error) {
            console.error('Error:', error);
        }

        // not exist, create it
        if (!fileExists) {
            try {
                let response = await fetch(obsidianUrl + '/vault' + documentPath, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'text/markdown',
                        'Authorization': `Bearer ${token}`
                    },
                    body: content
                });

                if (response.ok) {
                    console.log('Document created successfully:', response.statusText);
                } else {
                    console.error('Error creating document:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function openObsidianLink() {
            GM_openInTab('obsidian://', { active: true, insert: true });
        }

        // open the file in obsidian
        try {
            let response = await fetch(obsidianUrl + '/open' + documentPath, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!fileExists) {
                GM_notification({ title: 'Problem Imported Successfully', text: `Please open your Obsidian editor to see it.`, timeout: 5000, onclick: openObsidianLink });
            } else {
                GM_notification({ title: 'Problem Exists!', text: `Please open your Obsidian editor to see it.`, timeout: 5000, onclick: openObsidianLink });
            }
        } catch (error) {
            console.error('Error:', error);
            GM_notification({ title: 'Error Occurred', text: `${error} Do you have Obsidian opened?`, timeout: 5000 });
        }
    }

    // Function to get the bearer token
    function getOrPromptForKey(key, promptText) {
        let token = GM_getValue(key, null);
        if (!token) {
            token = prompt(promptText);
            if (token) {
                GM_setValue(key, token);
                GM_notification({ title: 'Input Saved', text: `Your input for ${key} has been saved.`, timeout: 5000 });
            }
        }
        return token;
    }

    function saveToObsidian() {
        let token = getOrPromptForKey('obsidian_web_api_key', 'Please enter your Obsidian API key:');
        let obsidianUrl = getOrPromptForKey('obsidian_api_url', 'Please enter the obsidian HTTPS API URL').replace(/\/$/, '');
        let documentPath = `/Algorithms/LeetCode/${problemName}.md`

        if (token) {
            // Call the function to create the Obsidian document
            createObsidianDocument(obsidianUrl, documentPath, content, token);
        } else {
            console.error('Bearer token is not available.');
        }
    }

    saveToObsidian();

})();
