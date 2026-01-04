// ==UserScript==
// @name         9GAG Auto View Replies and User Search Menu (Find Navigation)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Adds a menu to search for specific usernames in 9GAG comments and highlights their comments, with find navigation buttons for manual scrolling.
// @author       FunkyJustin
// @match        https://9gag.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519887/9GAG%20Auto%20View%20Replies%20and%20User%20Search%20Menu%20%28Find%20Navigation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519887/9GAG%20Auto%20View%20Replies%20and%20User%20Search%20Menu%20%28Find%20Navigation%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let targetUsername = ""; // Username to search for
    let foundComments = []; // Array to store highlighted comments
    let currentIndex = -1; // Index to track the currently highlighted comment

    // Create the search menu
    const menu = document.createElement('div');
    menu.id = 'user-search-menu';
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.zIndex = '10000';
    menu.style.padding = '10px';
    menu.style.backgroundColor = '#333'; // Dark background
    menu.style.color = '#fff'; // White text
    menu.style.border = '2px solid #555'; // Subtle border
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.width = '250px';

    menu.innerHTML = `
        <h3 style="margin: 0; font-size: 16px; color: #fff;">User Search</h3>
        <label for="username-input" style="font-size: 14px; color: #ddd;">Username:</label>
        <input type="text" id="username-input" style="width: 100%; margin-bottom: 10px; padding: 5px; font-size: 14px; background-color: #222; color: #fff; border: 1px solid #555; border-radius: 4px;" />
        <button id="start-search" style="width: 100%; padding: 5px; font-size: 14px; cursor: pointer; background-color: #444; color: #fff; border: none; border-radius: 4px;">Search</button>
        <div style="display: flex; gap: 5px; margin-top: 5px;">
            <button id="find-prev" style="flex: 1; padding: 5px; font-size: 14px; cursor: pointer; background-color: #444; color: #fff; border: none; border-radius: 4px;">Find Prev</button>
            <button id="find-next" style="flex: 1; padding: 5px; font-size: 14px; cursor: pointer; background-color: #444; color: #fff; border: none; border-radius: 4px;">Find Next</button>
        </div>
        <button id="minimize-menu" style="width: 100%; padding: 5px; font-size: 14px; cursor: pointer; background-color: #444; color: #fff; border: none; border-radius: 4px; margin-top: 5px;">Minimize</button>
    `;

    document.body.appendChild(menu);

    // Minimize functionality
    let isMinimized = false;
    const minimizeButton = document.getElementById('minimize-menu');
    minimizeButton.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (isMinimized) {
            menu.style.width = '60px';
            menu.style.height = 'auto';
            menu.style.overflow = 'hidden';
            menu.querySelectorAll('input, button, label, h3').forEach(el => {
                el.style.display = 'none';
            });
            const maximizeButton = document.createElement('button');
            maximizeButton.id = 'maximize-menu';
            maximizeButton.style.width = '100%';
            maximizeButton.style.padding = '5px';
            maximizeButton.style.fontSize = '14px';
            maximizeButton.style.cursor = 'pointer';
            maximizeButton.style.backgroundColor = '#444';
            maximizeButton.style.color = '#fff';
            maximizeButton.style.border = 'none';
            maximizeButton.style.borderRadius = '4px';
            maximizeButton.innerText = 'Expand';
            maximizeButton.addEventListener('click', () => {
                isMinimized = false;
                menu.style.width = '250px';
                menu.style.height = 'auto';
                menu.style.overflow = 'visible';
                menu.querySelectorAll('input, button, label, h3').forEach(el => {
                    el.style.display = '';
                });
                maximizeButton.remove(); // Remove the expand button after expanding
            });
            menu.appendChild(maximizeButton);
        }
    });

    // Search button functionality
    const searchButton = document.getElementById('start-search');
    searchButton.addEventListener('click', () => {
        targetUsername = document.getElementById('username-input').value.trim();
        if (targetUsername) {
            clearHighlights(); // Clear any existing highlights
            highlightUserComments(); // Highlight comments with the specified username
        }
    });

    // "Find Next" and "Find Previous" button functionality
    const findNextButton = document.getElementById('find-next');
    const findPrevButton = document.getElementById('find-prev');

    findNextButton.addEventListener('click', () => {
        if (foundComments.length > 0) {
            currentIndex = (currentIndex + 1) % foundComments.length; // Cycle forward
            scrollToComment(foundComments[currentIndex]);
        }
    });

    findPrevButton.addEventListener('click', () => {
        if (foundComments.length > 0) {
            currentIndex = (currentIndex - 1 + foundComments.length) % foundComments.length; // Cycle backward
            scrollToComment(foundComments[currentIndex]);
        }
    });

    // Function to click all "View replies" buttons
    function clickViewReplies() {
        const replyButtons = document.querySelectorAll('.comment-item-view-replies');
        replyButtons.forEach(button => {
            if (button.innerText.includes('View')) {
                button.click();
            }
        });
    }

    // Function to clear highlights
    function clearHighlights() {
        foundComments.forEach(comment => {
            comment.style.backgroundColor = ''; // Reset to default background
            comment.style.color = ''; // Reset to default text color
        });
        foundComments = [];
        currentIndex = -1;
    }

    // Function to highlight comments with the target username
    function highlightUserComments() {
        const comments = document.querySelectorAll('.ui-comment-header__container');
        comments.forEach(comment => {
            const usernameElement = comment.querySelector('.ui-comment-header__username');
            if (usernameElement) {
                const usernameText = usernameElement.innerText.replace("(OP) ", "").trim(); // Remove "(OP)" prefix if present
                if (usernameText === targetUsername) {
                    const commentContainer = comment.parentElement;
                    highlightComment(commentContainer);
                    foundComments.push(commentContainer);
                }
            }
        });
    }

    // Function to highlight a comment
    function highlightComment(comment) {
        comment.style.backgroundColor = '#FF8C00'; // Dark orange highlight
        comment.style.color = '#fff'; // Ensure text is white
    }

    // Function to scroll to a specific comment
    function scrollToComment(comment) {
        comment.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Observe the DOM for dynamically loaded content
    const observer = new MutationObserver(() => {
        clickViewReplies();
        if (targetUsername) {
            clearHighlights();
            highlightUserComments();
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
