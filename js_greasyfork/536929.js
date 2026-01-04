// ==UserScript==
// @name         Rule34Video Tag Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skip videos containing blacklisted tags
// @author       You
// @match        https://rule34video.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/536929/Rule34Video%20Tag%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/536929/Rule34Video%20Tag%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    let blacklistedTags = GM_getValue('blacklistedTags', '').split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
    let blacklistedTitles = GM_getValue('blacklistedTitles', '').split(',').map(title => title.trim().toLowerCase()).filter(title => title);
    let minimumPercentage = GM_getValue('minimumPercentage', 0);

    // Settings UI
    function showTagSettings() {
        const currentTags = GM_getValue('blacklistedTags', '');
        const newTags = prompt('Enter blacklisted tags (comma separated):', currentTags);
        if (newTags !== null) {
            GM_setValue('blacklistedTags', newTags);
            blacklistedTags = newTags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
            console.log('Blacklisted tags updated:', blacklistedTags);
        }
    }

    function showTitleSettings() {
        const currentTitles = GM_getValue('blacklistedTitles', '');
        const newTitles = prompt('Enter blacklisted title keywords (comma separated):', currentTitles);
        if (newTitles !== null) {
            GM_setValue('blacklistedTitles', newTitles);
            blacklistedTitles = newTitles.split(',').map(title => title.trim().toLowerCase()).filter(title => title);
            console.log('Blacklisted titles updated:', blacklistedTitles);
        }
    }

    function showPercentageSettings() {
        const currentPercentage = GM_getValue('minimumPercentage', 0);
        const newPercentage = prompt('Enter minimum percentage (0-100):', currentPercentage);
        if (newPercentage !== null) {
            const percentage = parseInt(newPercentage);
            if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                GM_setValue('minimumPercentage', percentage);
                minimumPercentage = percentage;
                console.log('Minimum percentage updated:', minimumPercentage);
            } else {
                alert('Please enter a valid percentage between 0 and 100');
            }
        }
    }

    // Register menu commands
    GM_registerMenuCommand('Configure Blacklisted Tags', showTagSettings);
    GM_registerMenuCommand('Configure Blacklisted Titles', showTitleSettings);
    GM_registerMenuCommand('Set Minimum Percentage', showPercentageSettings);

    // Helper functions
    function checkBlacklistedTags() {
        const tagElements = document.querySelectorAll('.wrap .tag_item');
        for (let tagElement of tagElements) {
            const tagText = tagElement.textContent.toLowerCase();
            for (let blacklistedTag of blacklistedTags) {
                if (tagText.includes(blacklistedTag)) {
                    console.log(`Blacklisted tag found: ${tagText} contains ${blacklistedTag}`);
                    return true;
                }
            }
        }
        return false;
    }

    function checkBlacklistedTitles() {
        const titleElement = document.querySelector('h1.title_video');
        if (titleElement) {
            const titleText = titleElement.textContent.toLowerCase();
            for (let blacklistedTitle of blacklistedTitles) {
                if (titleText.includes(blacklistedTitle)) {
                    console.log(`Blacklisted title keyword found: ${titleText} contains ${blacklistedTitle}`);
                    return true;
                }
            }
        }
        return false;
    }

    function checkMinimumPercentage() {
        const voterElement = document.querySelector('span.voters.count');
        if (voterElement) {
            const voterText = voterElement.textContent;
            const percentageMatch = voterText.match(/(\d+)%/);
            if (percentageMatch) {
                const currentPercentage = parseInt(percentageMatch[1]);
                if (currentPercentage < minimumPercentage) {
                    console.log(`Video percentage too low: ${currentPercentage}% < ${minimumPercentage}%`);
                    return true;
                }
            }
        }
        return false;
    }

    function goToNextVideo() {
        const nextButton = document.querySelector('a.link-video.next.js-url-next');
        if (nextButton) {
            console.log('Clicking next video button');
            nextButton.click();
        } else {
            console.log('Next video button not found');
        }
    }

    // Main monitoring function
    function monitorVideo() {
        // Check for blacklisted tags and skip if found
        if (checkBlacklistedTags()) {
            console.log('Blacklisted tags detected, skipping video');
            goToNextVideo();
            return;
        }

        // Check for blacklisted titles and skip if found
        if (checkBlacklistedTitles()) {
            console.log('Blacklisted title detected, skipping video');
            goToNextVideo();
            return;
        }

        // Check minimum percentage and skip if too low
        if (checkMinimumPercentage()) {
            console.log('Video percentage below minimum, skipping video');
            goToNextVideo();
            return;
        }
    }

    // Initialize script
    function init() {
        console.log('Rule34Video Tag Skipper initialized');
        console.log('Blacklisted tags:', blacklistedTags);
        console.log('Blacklisted titles:', blacklistedTitles);
        console.log('Minimum percentage:', minimumPercentage + '%');

        // Check for blacklisted tags every 1 second
        setInterval(monitorVideo, 1000);
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();