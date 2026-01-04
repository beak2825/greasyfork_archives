// ==UserScript==
// @name         Accessibility
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keyboard Bindings for Lorwolf
// @author       Unknown
// @match        https://www.lorwolf.com/Campaign*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484499/Accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/484499/Accessibility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click on the explore buttons 0/1
    function clickButton(optionId) {
        const button = document.querySelector(`.exploreOption[data-option-id="${optionId}"]`);
        if (button) {
            button.click();
        }
    }

    // Function to simulate a click on the "Explore Again" link
    function clickExploreAgain() {
        const exploreAgainLink = document.querySelector('.exploreAgainOption');
        if (exploreAgainLink) {
            exploreAgainLink.click();
        }
    }

    // Function to simulate a click on the "Feed All" button
    function clickFeedAll() {
        const feedAllButton = document.querySelector('.partyFeedAllButton');
        if (feedAllButton) {
            feedAllButton.click();
        }
    }

    // Function to close the modal and remove the backdrop
    function closeModal() {
        const closeButton = document.querySelector('.modal-header .close');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        const wolfToyModal = document.getElementById('wolfToyRewardsModalContent');

        if (closeButton) {
            closeButton.click();
        }

        if (modalBackdrop) {
            modalBackdrop.remove();
        }

        if (wolfToyModal) {
            wolfToyModal.remove();
        }
    }

    // Event listener for key presses
    document.addEventListener('keydown', function(event) {
        // Checking if key pressed corresponds to the below
        // You can change the keybinds to whatever you want. If you want to use arrow keys, use Arrow then the direction, ie. (event.key === 'ArrowUp')
        if (event.key === 'q') {
            clickButton(0); // Press the top button when 'q' is pressed
        } else if (event.key === 'w') {
            clickButton(1); // Press the bottom button when 'w' is pressed
        } else if (event.key === 'e') {
            clickExploreAgain(); // Press the "Explore Again" link when 'e' is pressed
        } else if (event.key === 'f') {
            clickFeedAll(); // Press the "Feed All" button when 'f' is pressed
        } else if (event.key === 'x') {
            closeModal(); // Press 'x' to close the "Feed All" pop-up
        } else if (event.key === 'r') {
            location.reload(); // Refresh the page when 'r' is pressed
        }
    });
})();
