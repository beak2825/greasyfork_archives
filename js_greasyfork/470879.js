// ==UserScript==
// @name         Google Search to YouTube Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a YouTube button to Google search results with a modified search query URL
// @author       Zapper
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470879/Google%20Search%20to%20YouTube%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/470879/Google%20Search%20to%20YouTube%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the target div and textarea elements
    const targetDiv = document.querySelector('div.RNNXgb');
    const searchInput = document.querySelector('textarea.gLFyf');

    // Create a button element
    const youtubeButton = document.createElement('button');
    youtubeButton.innerText = 'Youtube';

    // Apply CSS styling to the button
    youtubeButton.style.color = '#FFFFFF';
    youtubeButton.style.padding = '10px';
    youtubeButton.style.background = 'linear-gradient(to left, rgba(255, 68, 54, 1), rgba(255, 68, 54, 0))';
    youtubeButton.style.border = 'none';
    youtubeButton.style.borderRadius = '24px';
    youtubeButton.style.borderTopLeftRadius = '0';
    youtubeButton.style.borderBottomLeftRadius = '0';
    youtubeButton.style.cursor = 'pointer';
    youtubeButton.href = 'https://www.youtube.com/results?search_query';

    // Handle button click event
    youtubeButton.addEventListener('click', function() {
        // Get the current search query from the textarea
        const searchQuery = searchInput.value.trim();

        // Replace spaces with '+'
        const modifiedQuery = searchQuery.replace(/ /g, '+');

        // Create the YouTube search URL
        const youtubeURL = `https://www.youtube.com/results?search_query=${modifiedQuery}`;

        // Open the YouTube URL in a new tab
        window.open(youtubeURL);
    });

    // Append the button to the target div
    targetDiv.appendChild(youtubeButton);

    // Add scroll event listener
    window.addEventListener('scroll', function() {
        // Check if the user is at the top of the page
        const isAtTop = window.pageYOffset === 0;

        // Update the button's border radius based on scroll position
        youtubeButton.style.borderRadius = isAtTop ? '24px' : '16px';
    });

    // Set the URL as the tooltip when hovering over the button
    youtubeButton.addEventListener('mouseenter', function() {
        const searchQuery = searchInput.value.trim();
        const modifiedQuery = searchQuery.replace(/ /g, '+');
        const youtubeURL = `https://www.youtube.com/results?search_query=${modifiedQuery}`;
        youtubeButton.title = `Go to YouTube: ${youtubeURL}`;
    });

    // Remove the tooltip when not hovering over the button
    youtubeButton.addEventListener('mouseleave', function() {
        youtubeButton.removeAttribute('title');
    });
})();