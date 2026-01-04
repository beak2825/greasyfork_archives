// ==UserScript==
// @name         Handshake UX+
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Ban keywords found in job listings
// @author       TigerYT
// @include      *://*.joinhandshake.co.uk/job-search/*
// @icon         https://cdn.joinhandshake.co.uk/favicon.png
// @grant        GM_registerMenuCommand
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/541445/Handshake%20UX%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/541445/Handshake%20UX%2B.meta.js
// ==/UserScript==

unsafeWindow.bannedList = ["Chef", "Sport", "Finance", "Market", "Chemist", "Communications", "Talent", "Analyst", "Founder", "CEO", "Business", "Growth", "Sale", "Material", "Administrator"];
// Update this in Chrome DevTools with `window.bannedList`, e.g;
// window.bannedList = ["Developer", "Engineer", "AI"]

function executeUsercript() {
    'use strict';

    const jobList = Array.from(document.querySelector('div:has(> :nth-child(20))').children);

    jobList.forEach((job) => {
        if (job.children.length != 4) return;

        const hideButton = job.querySelector('[overlay="Hide"] > button');
        const jobTitle = job.querySelector('[id]').textContent;

        if (bannedList.some((bans) => jobTitle.toLowerCase().includes(bans.toLowerCase()))) {
            hideButton.click();
        };
    });
};

// Register context menu option
GM_registerMenuCommand("Remove Banned Jobs", executeUsercript);