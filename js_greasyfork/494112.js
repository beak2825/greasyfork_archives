// ==UserScript==
// @name         Markdown Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  One click to copy a markdown link of current page.
// @author       YourName
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494112/Markdown%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/494112/Markdown%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show a hovering, styled div with the page title
    function displayHoveringTitle() {
        const pageTitle = document.title; // Get the current page title
        const pageUrl = new URL(window.location.href);

        // Optionally, clean the URL by removing search parameters and hash
        pageUrl.search = ""; // Remove query strings
        pageUrl.hash = ""; // Remove fragment identifier

        // Create the markdown link for copy purpose only
        const markdownLink = `[${pageTitle}](${pageUrl.href})`;

        // Create a div element for displaying the title
        const floatingDiv = document.createElement('div');
        floatingDiv.textContent = pageTitle; // Set the content to page title only
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.bottom = '10px';
        floatingDiv.style.right = '10px';
        floatingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)'; // Semi-transparent black background
        floatingDiv.style.color = 'white';
        floatingDiv.style.padding = '10px';
        floatingDiv.style.borderRadius = '5px';
        floatingDiv.style.zIndex = '1000';
        floatingDiv.style.cursor = 'pointer'; // Change cursor to pointer to indicate clickable

        // Append the div to the body of the page
        document.body.appendChild(floatingDiv);

        // Add click event listener to copy markdown link to clipboard
        floatingDiv.addEventListener('click', function() {
            navigator.clipboard.writeText(markdownLink).then(() => {
                console.log('Markdown link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy markdown link: ', err);
            });
        });
    }

    // Add an event listener to call the function when the userscript is loaded
    window.addEventListener('load', displayHoveringTitle);
})();