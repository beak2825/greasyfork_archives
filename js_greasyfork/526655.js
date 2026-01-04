// ==UserScript==
// @name         Improve 4plebs Thread Page Title
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fetch and update page title using subject and body for archive.4plebs.org threads
// @author       wolffgang
// @match        *://archive.4plebs.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526655/Improve%204plebs%20Thread%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/526655/Improve%204plebs%20Thread%20Page%20Title.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TITLE_LIMIT = 190; // Maximum title length

    function fetchThreadDetails() {
        // Dynamically fetch board name from URL
        const boardName = `/${location.pathname.split('/')[1]}/`;

        const subjectElement = document.querySelector('h2.post_title');
        const bodyElement = document.querySelector('div.text');

        let subject = subjectElement ? subjectElement.textContent.trim() : '';
        let body = bodyElement ? bodyElement.textContent.trim() : '';

        // Combine board name, subject, and body intelligently
        let newTitle = boardName;
        if (subject) {
            newTitle += ` - ${subject}`;
        }
        if (body) {
            newTitle += subject ? `: ${body}` : ` - ${body}`;
        }

        // Truncate if it exceeds TITLE_LIMIT
        if (newTitle.length > TITLE_LIMIT) {
            newTitle = newTitle.slice(0, TITLE_LIMIT - 3) + '...';
        }

        // Update the document's title
        document.title = newTitle;
    }

    // Execute the function when the page is fully loaded
    window.addEventListener('load', fetchThreadDetails);
})();