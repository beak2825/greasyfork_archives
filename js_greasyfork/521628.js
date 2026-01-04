// ==UserScript==
// @name         Advent of Code Light Theme
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Apply a light theme to Advent of Code with proper styling for <code> elements
// @author       Nestorliao
// @match        https://adventofcode.com/*
// @icon         https://adventofcode.com/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521628/Advent%20of%20Code%20Light%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/521628/Advent%20of%20Code%20Light%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom styles for the light theme
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #fdfdfd !important; /* Light background */
            color: #333 !important; /* Darker text for contrast */
        }

        pre, code {
            background-color: #f4f4f4 !important; /* Light background for code blocks */
            color: #333 !important; /* Darker text */
            font-family: Consolas, "Courier New", monospace !important; /* Monospace font */
            border: 1px solid #ddd !important; /* Border for better visibility */
            padding: 2px 4px; /* Add padding for readability */
            border-radius: 4px; /* Rounded edges for a modern look */
        }

        a {
            color: #007acc !important; /* Blue links */
        }

        em {
            color: #333 !important; /* Match regular text color */
            font-style: italic; /* Preserve emphasis styling */
        }

        .leaderboard-entry {
            background-color: #fff !important; /* Light background for leaderboard */
        }

        header {
            background-color: #f1f1f1 !important; /* Light header background */
            border-bottom: 1px solid #ddd !important;
        }

        .day {
            background-color: #e6f7ff !important; /* Light blue background for days */
        }

        .day:hover {
            background-color: #cceeff !important; /* Slightly darker hover */
        }
    `;
    document.head.appendChild(style);
})();
