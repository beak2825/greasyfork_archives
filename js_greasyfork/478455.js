// ==UserScript==
// @name        OkCupid Utils
// @match       https://www.okcupid.com/*
// @grant       none
// @version     1.1.2
// @author      kelo & Asafff
// @license     BSD
// @description Add keybinds for easy navigation
// @namespace   https://greasyfork.org/users/1090195
// @downloadURL https://update.greasyfork.org/scripts/478455/OkCupid%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/478455/OkCupid%20Utils.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ========================================
     * Who Likes You - Unblur Functionality
     * ========================================
     * This section is currently disabled as the paywall bypass no longer works.
     * Kept for reference in case OkCupid reverts changes or exposes similar functionality.
     *
     * To re-enable: uncomment this section and the waitForElementToDisplay call at the bottom.
     */

    /*
    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector) != null) {
            removePaywallClickEvent();
            hideElement();
            changeFilterProperty();
            allowOverflow();
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    function changeFilterProperty() {
        let elements = document.querySelectorAll(".usercard-placeholder-thumb");

        elements.forEach(function(element) {
            element.style.filter = "none";
        });
    }

    function allowOverflow() {
        let usercardElem = document.querySelector('.usercard-placeholder');
        let parent = usercardElem.parentElement;
        let grandparent = parent.parentElement;

        // Remove fading gradient
        parent.style.width = '81.5%';
        parent.style.zIndex = 0;

        // Allow overflow
        grandparent.style.height = '100%';
        grandparent.style.maxHeight = '100%';
    }

    function hideElement() {
        let elementToHide = document.querySelector(".likes-you-paywall-explainer-cta");

        if(elementToHide) {
            elementToHide.style.display = "none";
        }
    }

    function removePaywallClickEvent() {
        const elementToReplace = document.querySelector('.likes-you-paywall-with-likes-link');

        if (elementToReplace) {
            const newDiv = document.createElement('div');
            newDiv.innerHTML = elementToReplace.innerHTML;
            elementToReplace.parentNode.replaceChild(newDiv, elementToReplace);
        }
    }
    */

    /* ========================================
     * Navigation Keybinds
     * ========================================
     */

    /**
     * Determines if the keyboard event originated from an input element
     * where text editing is expected and hotkeys should be suppressed.
     * @param {KeyboardEvent} event - The keyboard event to check
     * @returns {boolean} True if event originated from a text input context
     */
    function isTextInputContext(event) {
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        const inputType = target.type?.toLowerCase();

        // Check for text input elements
        if (tagName === 'textarea') {
            return true;
        }

        if (tagName === 'input') {
            const textInputTypes = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'];
            return !inputType || textInputTypes.includes(inputType);
        }

        // Check for contenteditable elements
        if (target.isContentEditable) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the photo overlay modal is currently open.
     * @returns {boolean} True if the modal is open
     */
    function isPhotoModalOpen() {
        const modal = document.querySelector('.photo-overlay-fullscreenoverlay');
        return modal !== null;
    }

    /**
     * Closes the photo overlay modal by clicking the close button.
     */
    function closePhotoModal() {
        const closeButton = document.getElementById('closeButton');
        if (closeButton) {
            closeButton.click();
        }
    }

    /**
     * Executes navigation actions based on keyboard input.
     * Ignores events originating from text input contexts.
     *
     * Keybinds:
     * - X: Pass on current profile
     * - V: Like current profile
     * - F or Right Arrow: Next picture
     * - D or Left Arrow: Previous picture
     * - Space: Open picture in fullscreen
     * - Up Arrow: Scroll up (closes photo modal if open)
     * - Down Arrow: Scroll down (closes photo modal if open)
     *
     * @param {KeyboardEvent} event - The keyboard event to handle
     */
    function handleNavigationKeyPress(event) {
        // Suppress hotkeys when typing in input fields
        if (isTextInputContext(event)) {
            return;
        }

        const modalOpen = isPhotoModalOpen();

        // Close modal and scroll when up/down arrows are pressed while modal is open
        if (modalOpen && (event.code === 'ArrowUp' || event.code === 'ArrowDown')) {
            event.preventDefault();
            closePhotoModal();

            // Small delay to allow modal to close before scrolling
            setTimeout(() => {
                const scrollAmount = event.code === 'ArrowUp' ? -100 : 100;
                window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            }, 100);
            return;
        }

        // Allow native left/right navigation in the modal
        if (modalOpen && (event.code === 'ArrowLeft' || event.code === 'ArrowRight' ||
                          event.code === 'KeyD' || event.code === 'KeyF')) {
            return;
        }

        const passBtn = document.querySelector('button.dt-action-buttons-button.pass');
        const likeBtn = document.querySelector('button.dt-action-buttons-button.like');
        const picturesPrev = document.querySelector('button.sliding-pagination-button.prev');
        const picturesNext = document.querySelector('button.sliding-pagination-button.next');
        const picSliderDiv = document.querySelector('div.sliding-pagination-inner-content');

        switch(event.code) {
            case 'KeyX':
                event.preventDefault();
                passBtn?.click();
                break;
            case 'KeyV':
                event.preventDefault();
                likeBtn?.click();
                break;
            case 'ArrowRight':
            case 'KeyF':
                event.preventDefault();
                picturesNext?.click();
                break;
            case 'ArrowLeft':
            case 'KeyD':
                event.preventDefault();
                picturesPrev?.click();
                break;
            case 'Space':
                event.preventDefault();
                picSliderDiv?.firstChild?.click();
                break;
            case 'ArrowUp':
                event.preventDefault();
                window.scrollBy({ top: -100, behavior: 'smooth' });
                break;
            case 'ArrowDown':
                event.preventDefault();
                window.scrollBy({ top: 100, behavior: 'smooth' });
                break;
            default:
                break;
        }
    }

    document.addEventListener('keydown', handleNavigationKeyPress);

    /* ========================================
     * Initialization
     * ========================================
     */

    // Uncomment to re-enable "Who Likes You" unblur functionality:
    // waitForElementToDisplay(".userrows-main", 4000);
})();