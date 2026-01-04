// ==UserScript==
// @name         Show Deleted Posts Button
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      1.1
// @description  Click a button to show all deleted posts in a thread or thread overview page.
// @author       kloob
// @match        www.gaiaonline.com/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491659/Show%20Deleted%20Posts%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/491659/Show%20Deleted%20Posts%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateClick(element) {
        if (element) {
            const clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            element.dispatchEvent(clickEvent);
        }
    }

    function autoShowDeletedPosts(event) {
        // First, click all "Show" links for deleted posts
        document.querySelectorAll('.show-message-trigger').forEach(simulateClick);

        // Then, handle the input button for showing deleted posts, if it exists
        const showDeletedButton = document.getElementById('showDeleted');
        if (showDeletedButton) {
            simulateClick(showDeletedButton);
            // Alternatively, if you need to directly call the onclick function:
            // showDeletedPost(2); // Assuming 'showDeletedPost' is globally accessible
        }

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function addShowDeletedPostsButton() {
        // Check if either .show-message-trigger or #showDeleted exists before adding the button
        const showMessageTrigger = document.querySelector('.show-message-trigger');
        const showDeletedButton = document.getElementById('showDeleted');

        if (showMessageTrigger || showDeletedButton) {
            const button = document.createElement('button');
            button.textContent = 'Show All Deleted Posts';
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.zIndex = '1000';
            button.onclick = autoShowDeletedPosts;

            document.body.appendChild(button);
        }
    }

    addShowDeletedPostsButton();
})();