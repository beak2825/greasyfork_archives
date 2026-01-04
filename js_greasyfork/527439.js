// ==UserScript==
// @license      Apache2
// @name         KonfluxMessageCleanup
// @namespace    https://gitlab.cee.redhat.com/
// @version      2025-02-19-1
// @description  Blast away konflux messages
// @author       David O Neill
// @match        *://gitlab.cee.redhat.com/*
// @icon         https://cdn.imgbin.com/3/22/25/imgbin-six-thinking-hats-red-hat-enterprise-linux-fedora-cartoon-cowboy-hat-i5r6w8BjC5Ua6Y7HxHZzFsEb9.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527439/KonfluxMessageCleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/527439/KonfluxMessageCleanup.meta.js
// ==/UserScript==

// Helper function to click all open confirmation modals
function clickAllModals() {
    const modals = document.querySelectorAll('div[data-testid="confirmation-modal"] button[data-testid="confirm-ok-button"]');
    if (modals.length > 0) {
        modals.forEach(btn => {
        btn.click();
        console.log('Clicked confirm on a modal');
        });
    }
}

// Continuously check for confirmation modals every 300ms
const modalInterval = setInterval(() => {
    clickAllModals();
    // Optionally stop checking if no more comments are being processed
}, 300);

// Function to delete all comments by 'konflux'
function deleteAllKonfluxComments() {
    document.querySelectorAll('.timeline-entry').forEach(comment => {
      const author = comment.querySelector('span[data-testid="author-name"]');
      if (author && author.textContent.trim() === 'konflux') {
        console.log(`Found comment by konflux: ${comment.id}`);

        // Open the 'More actions' menu
        const moreActionsButton = comment.querySelector('.more-actions-toggle button');
        if (moreActionsButton) {
          moreActionsButton.click();
          console.log('Opened more actions menu');

          // Short delay for dropdown
          setTimeout(() => {
            const deleteButton = comment.querySelector('.js-note-delete button');
            if (deleteButton) {
              deleteButton.click();
              console.log('Clicked delete button, waiting for modal...');
            }
          }, 500);
        }
      }
    });
}

function RHOTPLoaded() {
    console.log("Delete all comments")
    deleteAllKonfluxComments();
}


(function() {
    'use strict';
    window.addEventListener('load', RHOTPLoaded, false);
})();