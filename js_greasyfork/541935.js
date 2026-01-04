// ==UserScript==
// @name         YouTube UTTP Spam Comment Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove UTTP and similar spam comments from YouTube
// @author       Phiality
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541935/YouTube%20UTTP%20Spam%20Comment%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/541935/YouTube%20UTTP%20Spam%20Comment%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keywords and patterns to identify spam comments
    const spamPatterns = [
        /UTTP/i,
        /FIRST WARNING/i,
        /MY UPLOADS ARE BETTER/i,
        /‮REC̶C̶IN/,
        /@AngelSovieteUTTP/i,
        // Add more patterns here as needed
    ];

    // Function to check if a comment contains spam
    function isSpamComment(text) {
        return spamPatterns.some(pattern => pattern.test(text));
    }

    // Function to remove spam comments
    function removeSpamComments() {
        // Select all comment elements
        const comments = document.querySelectorAll('ytd-comment-view-model, ytd-comment-renderer');
        
        comments.forEach(comment => {
            // Get the comment text content
            const commentText = comment.querySelector('#content-text');
            const authorName = comment.querySelector('#author-text');
            
            if (commentText || authorName) {
                const textContent = commentText ? commentText.textContent : '';
                const authorContent = authorName ? authorName.textContent : '';
                const fullContent = textContent + ' ' + authorContent;
                
                // Check if it's spam and remove the entire comment element
                if (isSpamComment(fullContent)) {
                    comment.remove();
                    console.log('Removed spam comment:', fullContent.substring(0, 50) + '...');
                }
            }
        });
    }

    // Function to handle mutations (new comments loaded)
    function handleMutations(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Debounce to avoid excessive processing
                clearTimeout(window.spamRemovalTimeout);
                window.spamRemovalTimeout = setTimeout(removeSpamComments, 100);
            }
        });
    }

    // Initial cleanup
    setTimeout(removeSpamComments, 1000);

    // Set up mutation observer to watch for new comments
    const observer = new MutationObserver(handleMutations);
    
    // Start observing when the comments section is available
    const startObserving = () => {
        const commentsSection = document.querySelector('ytd-comments, ytd-item-section-renderer');
        if (commentsSection) {
            observer.observe(commentsSection, {
                childList: true,
                subtree: true
            });
            console.log('YouTube spam comment remover is active');
        } else {
            // Retry if comments section not found yet
            setTimeout(startObserving, 1000);
        }
    };

    startObserving();

    // Also run cleanup when scrolling (as YouTube loads comments dynamically)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(removeSpamComments, 500);
    });

})();