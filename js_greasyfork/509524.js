// ==UserScript==
// @name         Reddit Top-Level Comment Navigator
// @namespace    https://www.reddit.com/
// @version      1.1
// @description  Adds a button to jump to the next top-level comment on Reddit
// @author       Written using ChatGPT o1 preview
// @match        https://www.reddit.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509524/Reddit%20Top-Level%20Comment%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/509524/Reddit%20Top-Level%20Comment%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let topLevelComments = [];
    let currentIndex = -1; // Start before the first comment

    function getTopLevelComments() {
        const comments = document.querySelectorAll('shreddit-comment[depth="0"]');
        return Array.from(comments);
    }

    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Next Top-Level Comment';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#FF4500';
        button.style.color = '#FFFFFF';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = 1000;
        button.addEventListener('click', scrollToNextComment);
        document.body.appendChild(button);
    }

    function scrollToNextComment() {
        if (topLevelComments.length === 0) {
            topLevelComments = getTopLevelComments();
        }

        currentIndex++;
        if (currentIndex >= topLevelComments.length) {
            currentIndex = 0; // Loop back to the first comment
        }

        const comment = topLevelComments[currentIndex];
        if (comment) {
            comment.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Initialize the script
    window.addEventListener('load', () => {
        createButton();
        topLevelComments = getTopLevelComments();
    });

    // Update comments list when the DOM changes
    const observer = new MutationObserver(() => {
        topLevelComments = getTopLevelComments();
        currentIndex = -1; // Reset index when comments change
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
