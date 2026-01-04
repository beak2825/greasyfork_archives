// ==UserScript==
// @name            Show YouTube comments while watching 2025 (MacOS)
// @description     Moves comments to the right side and adds a button to toggle between comments and recommended videos
// @version         3.6
// @author          barn852 & Eloren1
// @license         MIT
// @match           *://*.youtube.com/*
// @include         *://*.youtube.com/watch*
// @grant           none
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at          document-end
// @noframes
// @namespace https://greasyfork.org/users/572660
// @downloadURL https://update.greasyfork.org/scripts/528662/Show%20YouTube%20comments%20while%20watching%202025%20%28MacOS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528662/Show%20YouTube%20comments%20while%20watching%202025%20%28MacOS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let showComments = true; // Show comments by default

    const moveComments = () => {
        let comments = document.getElementById('comments');
        let sidebar = document.querySelector('#secondary-inner');

        if (comments && sidebar && !sidebar.contains(comments)) {
            // Create a new container for the scrollable comments
            let commentsContainer = document.createElement('div');
            commentsContainer.id = 'comments-container';
            commentsContainer.style.overflowY = 'auto';
            commentsContainer.style.maxHeight = 'calc(100vh - 60px)';
            commentsContainer.style.width = '100%';
            commentsContainer.appendChild(comments);

            // Append the new container to the sidebar
            sidebar.appendChild(commentsContainer);
            console.log('Moved comments to the right side');
        }
    };

    const updateView = () => {
        let comments = document.getElementById('comments');
        let related = document.getElementById('related');

        if (comments && related) {
            comments.style.display = showComments ? 'block' : 'none';
            related.style.display = showComments ? 'none' : 'block';
        }
    };

    const toggleView = () => {
        showComments = !showComments;
        updateView();
    };

    const observer = new MutationObserver(() => {
        moveComments();
        updateView();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    let button = document.createElement('button');
    button.innerHTML = '<svg width="24" height="24" viewBox="0 0 22 22"><g fill="currentColor"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></g></svg>';
    button.style = 'background: transparent; border: 0; color: rgb(96,96,96); outline: 0; cursor: pointer; padding: 5px 10px;';

    button.onclick = toggleView;

    let waitButton = setInterval(() => {
        let menu = document.getElementById('end');
        if (menu) {
            clearInterval(waitButton);
            menu.insertBefore(button, menu.lastElementChild);
            updateView();
        }
    }, 500);

    // Prevent YouTube from showing comments on hover
    document.addEventListener('mouseover', (event) => {
        if (!showComments && event.target.closest('#related')) {
            let comments = document.getElementById('comments');
            if (comments) {
                comments.style.display = 'none';
            }
        }
    });

})();