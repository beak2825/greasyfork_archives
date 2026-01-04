// ==UserScript==
// @name         GitLab Reviewer Shortcut
// @namespace    kayw
// @version      1.1
// @license      MIT
// @description  Adds keyboard shortcut to quickly assign reviewers in GitLab MRs
// @match        https://*.gitlab.com/*
// @match        http://*.gitlab.com/*
// @match        https://gitlab.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530341/GitLab%20Reviewer%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/530341/GitLab%20Reviewer%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Key for storing reviewer name in localStorage
    const REVIEWER_KEY = 'gitlab_default_reviewer';
  
    // Initialize or get saved reviewer - defaults to 'leo' if not set
    const defaultReviewer = localStorage.getItem(REVIEWER_KEY); // example @Jack
  
    // Register keyboard shortcut
    document.addEventListener('keydown', function(event) {
        // Ctrl+R to assign reviewer
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key === 'r') {
            // Prevent browser refresh
            event.preventDefault();
      
            // Simulate pressing 'r' key to focus GitLab comment input
            const rKeyEvent = new KeyboardEvent('keydown', {
                key: 'r',
                code: 'KeyR',
                keyCode: 82,
                which: 82,
                bubbles: true
            });
            document.dispatchEvent(rKeyEvent);
      
            // Wait for input to get focus
            setTimeout(function() {
                // Find comment input field
                const commentInput = document.querySelector('.js-comment-input, .note-textarea');
        
                if (commentInput) {
                    // Focus the input
                    commentInput.focus();
          
                    // Set text to assign reviewer
                    commentInput.value = `/assign_reviewer ${defaultReviewer}`;
          
                    // Trigger input event for GitLab to recognize the change
                    commentInput.dispatchEvent(new Event('input', { bubbles: true }));
          
                    // Simulate Command+Enter to submit
                    setTimeout(function() {
                        const cmdEnterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            metaKey: true,
                            bubbles: true
                        });
                        commentInput.dispatchEvent(cmdEnterEvent);
                    }, 100);
                }
            }, 200);
        }
    });
  
    // Add initialization message
    console.log(`GitLab reviewer shortcut initialized. Current reviewer: @${defaultReviewer}`);
    console.log('Use Ctrl+R (or Cmd+R) to assign reviewer');
    console.log('To change the reviewer, set localStorage.setItem("gitlab_default_reviewer", "username")');
})();