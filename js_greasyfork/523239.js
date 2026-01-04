// ==UserScript==
// @name         Letterboxd Auto-Follow and Auto-Review opener Button
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Adds a button to auto-follow all users on a Letterboxd fans page and opens their reviews in new tabs with random delays to mimic human behavior.
// @author       Your Name
// @match        https://letterboxd.com/film/*/fans/page/*
// @match        https://letterboxd.com/film/*/fans/
// @match        https://letterboxd.com/film/*/members/rated/*/by/rating/*
// @match        https://letterboxd.com/*/followers/*/*/
// @match        https://letterboxd.com/*/followers/
// @match        https://letterboxd.com/*/following/*/*/
// @match        https://letterboxd.com/*/following/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523239/Letterboxd%20Auto-Follow%20and%20Auto-Review%20opener%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/523239/Letterboxd%20Auto-Follow%20and%20Auto-Review%20opener%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the auto-follow button
    function addAutoFollowButton() {
        const button = document.createElement('button');
        button.textContent = 'Auto-Follow All & Open Reviews';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#ffcc00';
        button.style.color = '#000';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', startAutoFollowAndOpenReviews);

        document.body.appendChild(button);
    }

    // Function to generate a random delay between 0.5 and 2 seconds
    function getRandomDelay() {
        return Math.random() * (2000 - 500) + 500;
    }

    // Function to auto-follow all users and open their reviews in new tabs with random delays
    async function startAutoFollowAndOpenReviews() {
        const followButtons = document.querySelectorAll('.js-button-follow');
        const reviewLinks = document.querySelectorAll('td a.has-icon.icon-16.icon-review.tooltip');

        // Log the number of follow buttons and review links
        console.log(`Found ${followButtons.length} follow buttons`);
        console.log(`Found ${reviewLinks.length} review links`);

        // Follow all users with random delays
        for (let i = 0; i < followButtons.length; i++) {
            const button = followButtons[i];
            if (button.style.display !== 'none') {
                button.click();
                await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
            }
        }

        // Open reviews in new tabs with random delays
        for (let i = 0; i < reviewLinks.length; i++) {
            const link = reviewLinks[i];
            console.log(`Opening review link: ${link.href}`);
            const newWindow = window.open(link.href, '_blank');
            if (!newWindow) {
                console.error('Failed to open new window for review link:', link.href);
            }
            await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
        }
    }

    // Add the button when the page loads
    window.addEventListener('load', addAutoFollowButton);
})();