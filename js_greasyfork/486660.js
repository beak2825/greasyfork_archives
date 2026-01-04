// ==UserScript==
// @name         Enhanced O365 Unread Email Highlighter - Adjusted
// @version      1.1
// @description  Attempt to more reliably highlight unread emails in Outlook Web App.
// @match        https://outlook.office365.com/*
// @match        https://outlook.office.com/*
// @grant        none
// @author       chaoscreater
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @namespace https://greasyfork.org/users/1056895
// @downloadURL https://update.greasyfork.org/scripts/486660/Enhanced%20O365%20Unread%20Email%20Highlighter%20-%20Adjusted.user.js
// @updateURL https://update.greasyfork.org/scripts/486660/Enhanced%20O365%20Unread%20Email%20Highlighter%20-%20Adjusted.meta.js
// ==/UserScript==


'use strict';

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    /* Attempts to change the background color of unread email items */
    .jGG6V[aria-label*="Unread"] .xc0ZS.JtO0E {
        background-color: #ffc2b3 !important; /* Light red color for unread emails */
    }

    /* Ensure text within unread emails remains legible */
    .jGG6V[aria-label*="Unread"] .gy2aJ.U2XB8,
    .jGG6V[aria-label*="Unread"] .FqgPc.gy2aJ.U2XB8 {
        color: #000 !important; /* Black color for contrast */
    }

    /* Changes the background color to gray when hovering over email items */
    .jGG6V[aria-label*="Unread"] .xc0ZS.JtO0E:hover {
        background-color: #808080 !important; /* gray color */
    }
`;
document.getElementsByTagName('head')[0].appendChild(style);
