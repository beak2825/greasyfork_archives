// ==UserScript==
// @name         Remove Roblox Agreement
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Removes the user agreement on Roblox
// @author       Hoover
// @icon         https://images.rbxcdn.com/7bba321f4d8328683d6e59487ce514eb
// @match        *://*.roblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513373/Remove%20Roblox%20Agreement.user.js
// @updateURL https://update.greasyfork.org/scripts/513373/Remove%20Roblox%20Agreement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the modal and restore scrolling
    function removeModal() {
        var modalBackdrop = document.querySelector('.modal-backdrop.in');
        var agreementModal = document.getElementById('user-agreements-checker-modal');

        // Remove the elements if they exist
        if (modalBackdrop) {
            modalBackdrop.remove();
        }

        if (agreementModal) {
            agreementModal.remove();
        }

        // Ensure the body can scroll again
        document.body.style.overflow = 'scroll';
    }

    // Observe DOM changes to detect when the modal is added
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            removeModal(); // Call removeModal whenever a mutation occurs
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attempt to remove the modal in case it’s already there
    removeModal();
})();
