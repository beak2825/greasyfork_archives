// ==UserScript==
// @name         Bangumi Netaba.re Link
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a link to Netaba.re for Bangumi subject pages, styled like existing tabs and opens in a new tab.
// @author       juzeon
// @match        *://bangumi.tv/subject/*
// @match        *://bgm.tv/subject/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534283/Bangumi%20Netabare%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/534283/Bangumi%20Netabare%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to make the new link look like the existing tabs
    // We target the <a> element within the new <li> and apply styles
    // similar to the existing tab links.
    GM_addStyle(`
        .subjectNav .navTabs li.netabare-tab a {
            display: block; /* Make the link a block element to apply padding/margin */
            padding: 0 10px; /* Match padding of existing links */
            margin: 0 0 0 -1px; /* Match margin of existing links */
            line-height: 24px; /* Match line-height for vertical alignment */
            border-left: 1px solid #E0E0E0; /* Add left border for separation */
            color: #333; /* Default link color */
            text-decoration: none; /* Remove underline */
        }
        .subjectNav .navTabs li.netabare-tab a:hover {
             color: #000; /* Hover text color */
             background-color: #F0F0F0; /* Hover background color */
        }
        /* Optional: Adjust for the very last item if needed, though margin/border usually handles it */
        /* .subjectNav .navTabs li:last-child.netabare-tab a { ... } */
    `);


    // Get the subject ID from the URL
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    let subjectId = null;

    // Check if the URL path is in the format /subject/ID
    if (parts.length >= 3 && parts[1] === 'subject') {
        subjectId = parts[2];
    }

    // If a subject ID was found
    if (subjectId) {
        // Find the navigation tabs list
        const navTabs = document.querySelector('.subjectNav .navTabs');

        // If the navigation tabs list exists
        if (navTabs) {
            // Create the new list item (<li>) and link (<a>)
            const newLi = document.createElement('li');
            newLi.classList.add('netabare-tab'); // Add a class to the li for specific styling

            const newLink = document.createElement('a');

            // Set the link's attributes
            newLink.href = `https://netaba.re/subject/${subjectId}`;
            newLink.textContent = 'ネタバレ'; // The button text
            newLink.target = '_blank'; // Open in a new tab

            // The styling is applied via the GM_addStyle block using the .netabare-tab class

            // Append the link to the list item
            newLi.appendChild(newLink);

            // Append the new list item to the navigation tabs
            // This will add it as the last item in the list
            navTabs.appendChild(newLi);
        }
    }
})();
