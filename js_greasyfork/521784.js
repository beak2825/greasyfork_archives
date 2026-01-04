// ==UserScript==
// @name Mediablock Midnight Reset
// @description Closes social media from 7 AM to 6 PM on weekdays, 6 AM to 10 AM Saturdays, and completely free on Sundays! Tracks attempts and resets at midnight. Assumes 5 mins on average visit. 
// @include https://*.reddit.com/*
// @include https://discord.com/*
// @include https://*.temu.com/*
// @include https://*.amazon.com/*
// @include https://*.snaptchat.com/*
// @include https://*.facebook.com/*
// @include https://*.twitter.com/*
// @include https://*.x.com/*
// @include https://*.youtube.com/*
// @include https://*.instagram.com/*
// @run-at document-start
// @version 3
// @grant GM_getValue
// @grant GM_setValue
// @namespace https://greasyfork.org/users/1415664
// @downloadURL https://update.greasyfork.org/scripts/521784/Mediablock%20Midnight%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/521784/Mediablock%20Midnight%20Reset.meta.js
// ==/UserScript==

const STORAGE_DATE_KEY = 'lastResetDate';
const STORAGE_COUNT_KEY = 'accessCount';

async function block() {
    var current = window.location.href;

    // Increment today's access count
    await incrementAccessCount();

    // Show a popup with today's total access attempts and total time saved
    await showPopup();

    // Attempt to leave the page
    window.history.back(); // If no previous page, this won't work.
    if (window.location.href === current) {
        window.close(); // If the tab can't close, this won't work.
        if (window.location.href === current) {
            window.location.href = "edge://newtab"; // This always works as a fallback.
        }
    }
}

async function incrementAccessCount() {
    const today = new Date().toISOString().slice(0, 10); // Get today's date as "YYYY-MM-DD"

    // Get the last reset date from Tampermonkey storage
    const lastResetDate = await GM_getValue(STORAGE_DATE_KEY, null);

    // If it's a new day, reset the counter
    if (lastResetDate !== today) {
        await GM_setValue(STORAGE_COUNT_KEY, 0); // Reset the counter to 0
        await GM_setValue(STORAGE_DATE_KEY, today); // Set today's date as the reset date
    }

    // Increment today's access count
    let accessCount = await GM_getValue(STORAGE_COUNT_KEY, 0);
    accessCount += 1;
    await GM_setValue(STORAGE_COUNT_KEY, accessCount);
}

async function getAccessCount() {
    // Get today's access count from storage
    const accessCount = await GM_getValue(STORAGE_COUNT_KEY, 0);
    return accessCount;
}

async function showPopup() {
    const accessCount = await getAccessCount();
    const timeSaved = accessCount * 5; // 5 minutes saved per attempt
    alert(`🚫 Social Media Blocked! 🚫\n\nTotal attempts today: ${accessCount}\nTime saved today: ${timeSaved} minutes`);
}

var date1 = new Date();
var hours = date1.getHours(); // Current hour
var day = date1.getDay(); // Day of the week (0 = Sunday, 6 = Saturday)

if (day === 6) { // If it's a Saturday
    if (hours >= 6 && hours <= 9) { // Block 6 AM to 10 AM
        block();
    }
} else if (day !== 0 && hours >= 7 && hours <= 18) { // If it's not Sunday and it's 7 AM to 6 PM
    block();
}