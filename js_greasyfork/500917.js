// ==UserScript==
// @name         Enhanced Hide Signatures on IGN Boards
// @namespace    https://www.ignboards.com/members/magof.5211856/
// @version      0.2
// @author       Magof
// @description  Enhanced version with better performance and maintainability
// @match        https://www.ignboards.com/threads/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/500917/Enhanced%20Hide%20Signatures%20on%20IGN%20Boards.user.js
// @updateURL https://update.greasyfork.org/scripts/500917/Enhanced%20Hide%20Signatures%20on%20IGN%20Boards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const STORAGE_KEY = 'hiddenUsers';
    const BUTTON_CLASSES = ['signature-toggle-button', 'button--link', 'button', 'rippleButton'];
    const ICONS = {
        visible: '<i class="fas fa-eye-slash"></i>',
        hidden: '<i class="fas fa-eye"></i>'
    };
    const TOOLTIPS = {
        visible: 'Hide this user\'s signature',
        hidden: 'Show this user\'s signature'
    };

    // Cache DOM elements
    let postsContainer;

    /**
     * Toggle signature visibility for a specific user
     * @param {string} user - The username to toggle
     * @param {boolean} isVisible - Whether to show or hide the signature
     */
    function toggleSignatureVisibility(user, isVisible) {
        const posts = postsContainer.querySelectorAll('.message');
        posts.forEach(post => {
            const authorElement = post.querySelector('.message-userExtras');
            if (!authorElement) return;

            const postUser = authorElement.textContent.trim().split(',')[0];
            if (postUser !== user) return;

            const signature = post.querySelector('.message-signature');
            const button = post.querySelector('.signature-toggle-button');
            
            if (signature) {
                signature.style.display = isVisible ? 'block' : 'none';
            }
            
            if (button) {
                button.innerHTML = isVisible ? ICONS.visible : ICONS.hidden;
                button.title = isVisible ? TOOLTIPS.visible : TOOLTIPS.hidden;
            }
        });
    }

    /**
     * Update storage and toggle signature visibility
     * @param {string} user - The username to toggle
     */
    function handleSignatureToggle(user) {
        const hiddenUsers = JSON.parse(GM_getValue(STORAGE_KEY, '[]'));
        const userIndex = hiddenUsers.indexOf(user);
        const isVisible = userIndex === -1;

        if (isVisible) {
            hiddenUsers.push(user);
        } else {
            hiddenUsers.splice(userIndex, 1);
        }

        GM_setValue(STORAGE_KEY, JSON.stringify(hiddenUsers));
        toggleSignatureVisibility(user, !isVisible);
    }

    /**
     * Create and add toggle buttons to posts
     */
    function addToggleButtons() {
        const posts = postsContainer.querySelectorAll('.message');
        posts.forEach(post => {
            const signature = post.querySelector('.message-signature');
            if (!signature) return;

            const authorElement = post.querySelector('.message-userExtras');
            if (!authorElement) return;

            const user = authorElement.textContent.trim().split(',')[0];
            const button = document.createElement('button');
            
            button.innerHTML = ICONS.visible;
            button.title = TOOLTIPS.visible;
            button.classList.add(...BUTTON_CLASSES);
            button.addEventListener('click', () => handleSignatureToggle(user));

            const avatar = post.querySelector('.message-avatar');
            if (avatar) {
                avatar.parentNode.appendChild(button);
            }
        });
    }

    /**
     * Apply saved preferences for hidden users
     */
    function applySavedPreferences() {
        const hiddenUsers = JSON.parse(GM_getValue(STORAGE_KEY, '[]'));
        hiddenUsers.forEach(user => toggleSignatureVisibility(user, false));
    }

    // Initialize script
    function init() {
        postsContainer = document.querySelector('.messageList') || document.body;
        addToggleButtons();
        applySavedPreferences();
    }

    // Add styles
    GM_addStyle(`
        .signature-toggle-button {
            margin-left: 50px;
            padding: 5px;
            background-color: transparent;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .signature-toggle-button:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        .signature-toggle-button i {
            font-size: 1.2em;
            pointer-events: none;
        }
    `);

    // Run initialization
    window.addEventListener('load', init);
})();