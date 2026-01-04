// ==UserScript==
// @name         Rule34Video Tag Skipper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skip videos containing blacklisted tags with dual minimum score system
// @author       You
// @match        https://rule34video.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/540070/Rule34Video%20Tag%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/540070/Rule34Video%20Tag%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    let blacklistedTags = GM_getValue('blacklistedTags', '').split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
    let blacklistedTitles = GM_getValue('blacklistedTitles', '').split(',').map(title => title.trim().toLowerCase()).filter(title => title);

    // Dual minimum score settings
    let minpct1_percentage = GM_getValue('minpct1_percentage', 100);
    let minpct1_votes = GM_getValue('minpct1_votes', 5);
    let minpct2_percentage = GM_getValue('minpct2_percentage', 75);
    let minpct2_votes = GM_getValue('minpct2_votes', 100);

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

    function showMinScore1Settings() {
        const currentPct = GM_getValue('minpct1_percentage', 100);
        const currentVotes = GM_getValue('minpct1_votes', 5);

        const newPct = prompt(`Enter minimum percentage for threshold 1 (current: ${currentPct}%):`);
        if (newPct !== null) {
            const percentage = parseInt(newPct);
            if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                const newVotes = prompt(`Enter minimum vote count for threshold 1 (current: ${currentVotes}):`);
                if (newVotes !== null) {
                    const votes = parseInt(newVotes);
                    if (!isNaN(votes) && votes >= 0) {
                        GM_setValue('minpct1_percentage', percentage);
                        GM_setValue('minpct1_votes', votes);
                        minpct1_percentage = percentage;
                        minpct1_votes = votes;
                        console.log(`MinScore1 updated: ${percentage}% with ${votes} votes`);
                    } else {
                        alert('Please enter a valid vote count (0 or higher)');
                    }
                }
            } else {
                alert('Please enter a valid percentage between 0 and 100');
            }
        }
    }

    function showMinScore2Settings() {
        const currentPct = GM_getValue('minpct2_percentage', 75);
        const currentVotes = GM_getValue('minpct2_votes', 100);

        const newPct = prompt(`Enter minimum percentage for threshold 2 (current: ${currentPct}%):`);
        if (newPct !== null) {
            const percentage = parseInt(newPct);
            if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                const newVotes = prompt(`Enter minimum vote count for threshold 2 (current: ${currentVotes}):`);
                if (newVotes !== null) {
                    const votes = parseInt(newVotes);
                    if (!isNaN(votes) && votes >= 0) {
                        GM_setValue('minpct2_percentage', percentage);
                        GM_setValue('minpct2_votes', votes);
                        minpct2_percentage = percentage;
                        minpct2_votes = votes;
                        console.log(`MinScore2 updated: ${percentage}% with ${votes} votes`);
                    } else {
                        alert('Please enter a valid vote count (0 or higher)');
                    }
                }
            } else {
                alert('Please enter a valid percentage between 0 and 100');
            }
        }
    }

    // Register menu commands
    GM_registerMenuCommand('Configure Blacklisted Tags', showTagSettings);
    GM_registerMenuCommand('Configure Blacklisted Titles', showTitleSettings);
    GM_registerMenuCommand('Set Minimum Score 1 (High Threshold)', showMinScore1Settings);
    GM_registerMenuCommand('Set Minimum Score 2 (Low Threshold)', showMinScore2Settings);

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

    function checkDualMinimumScore() {
        const voterElement = document.querySelector('span.voters.count');
        if (voterElement) {
            const voterText = voterElement.textContent;
            // Match pattern like "100% (2)" to extract percentage and vote count
            const match = voterText.match(/(\d+)%\s*\((\d+)\)/);
            if (match) {
                const currentPercentage = parseInt(match[1]);
                const currentVotes = parseInt(match[2]);

                console.log(`Current score: ${currentPercentage}% (${currentVotes} votes)`);

                // If votes are below minpct1 threshold, skip automatically
                if (currentVotes < minpct1_votes) {
                    console.log(`Video skipped: insufficient votes ${currentVotes} < ${minpct1_votes} minimum`);
                    return true;
                }
                // If votes are above minpct2 threshold, use minpct2 percentage requirement
                else if (currentVotes >= minpct2_votes) {
                    if (currentPercentage < minpct2_percentage) {
                        console.log(`Video below threshold 2: ${currentPercentage}% < ${minpct2_percentage}% (votes: ${currentVotes} >= ${minpct2_votes})`);
                        return true;
                    }
                }
                // If votes are between thresholds, use linear interpolation
                else {
                    const voteRange = minpct2_votes - minpct1_votes;
                    const pctRange = minpct1_percentage - minpct2_percentage;
                    const voteProgress = (currentVotes - minpct1_votes) / voteRange;
                    const requiredPercentage = minpct1_percentage - (pctRange * voteProgress);

                    if (currentPercentage < requiredPercentage) {
                        console.log(`Video below interpolated threshold: ${currentPercentage}% < ${requiredPercentage.toFixed(1)}% (votes: ${currentVotes}, interpolated between ${minpct1_votes}-${minpct2_votes})`);
                        return true;
                    } else {
                        console.log(`Video passes interpolated threshold: ${currentPercentage}% >= ${requiredPercentage.toFixed(1)}% (votes: ${currentVotes})`);
                    }
                }
            } else {
                console.log('Could not parse vote data from:', voterText);
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

        // Check dual minimum score system and skip if below threshold
        if (checkDualMinimumScore()) {
            console.log('Video score below minimum threshold, skipping video');
            goToNextVideo();
            return;
        }
    }

    // Initialize script
    function init() {
        console.log('Rule34Video Tag Skipper initialized');
        console.log('Blacklisted tags:', blacklistedTags);
        console.log('Blacklisted titles:', blacklistedTitles);
        console.log(`Score Threshold 1: ${minpct1_percentage}% with ${minpct1_votes} votes`);
        console.log(`Score Threshold 2: ${minpct2_percentage}% with ${minpct2_votes} votes`);

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