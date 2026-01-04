// ==UserScript==
// @name        Fast mute subreddits
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/r/*
// @match       https://new.reddit.com/r/*
// @match       https://old.reddit.com/r/*
// @grant       none
// @version     1.1
// @author      TOVOT + Copilot + help by Reddit user _1Zen_
// @description 2/9/2024
// @license     Public Domain
// @downloadURL https://update.greasyfork.org/scripts/486983/Fast%20mute%20subreddits.user.js
// @updateURL https://update.greasyfork.org/scripts/486983/Fast%20mute%20subreddits.meta.js
// ==/UserScript==

'use strict';

// Delay function to allow page load
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Main function to mute subreddit
async function muteSubreddit() {
    // Find the mute button
    let muteButton = document.querySelector('shreddit-subreddit-header-buttons').shadowRoot.querySelector('shreddit-subreddit-overflow-control').shadowRoot.querySelector('[action="mute"] > li > div');

    // Click the mute button if it exists
    if (muteButton) {
        muteButton.click();
        await delay(1000);
        let muteConfirm = document.querySelector('shreddit-subreddit-mute-modal').shadowRoot.querySelector('[slot="primaryButton"] > button');
        if (muteConfirm) muteConfirm.click();
        console.log('Subreddit muted');
        window.close(); // Close the current tab
    } else {
        console.log('Mute button not found');
    }
}

// Add event keydown when page loaded
window.addEventListener('load', e => {
    // Listen for the shortcut key
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'm') {
            muteSubreddit();
        }
    });
});