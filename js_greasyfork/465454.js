// ==UserScript==
// @name         Wanikani Community User De-spoofer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Replace specified user's avatar and change username, should they be trying to trick us!
// @author       Joeni
// @match        https://community.wanikani.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465454/Wanikani%20Community%20User%20De-spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/465454/Wanikani%20Community%20User%20De-spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    function replaceAvatarAndUsername() {
        const usersToFix = JSON.parse(localStorage.getItem('usersToFix') || '[]');

        usersToFix.forEach(user => {
            const avatarRegex = new RegExp(`^https:\/\/.*discourse-cdn.com\/wanikanicommunity\/user_avatar\/community.wanikani.com\/${user.originalUsername}\/.*\/.*\.png$`);

            const postAvatars = document.querySelectorAll('.topic-avatar img');
            const emberAvatars = document.querySelectorAll('.ember-view img');
            const userCardAvatars = document.querySelectorAll('#user-card .user-card-avatar img');
            const allAvatars = [...postAvatars, ...emberAvatars, ...userCardAvatars];

            allAvatars.forEach(avatar => {
                if (avatarRegex.test(avatar.src)) {
                    avatar.src = user.replacementAvatar;
                }
            });

            const usernameElements = document.querySelectorAll('.username, .topic-meta-data .post-infos a span');
            usernameElements.forEach(element => {
                if (element.textContent === user.originalUsername) {
                    element.textContent = user.spoofingUsername;
                }
            });
        });
    }

    function addUserToFix() {
        const spoofingUsername = prompt('Enter the user\'s original username:');
        const originalUsername = prompt('Enter the username they\'re hiding behind:');
        const replacementAvatar = prompt('Enter the replacement avatar image URL:');

        if (originalUsername && spoofingUsername && replacementAvatar) {
            const usersToFix = JSON.parse(localStorage.getItem('usersToFix') || '[]');
            usersToFix.push({
                originalUsername,
                spoofingUsername,
                replacementAvatar
            });
            localStorage.setItem('usersToFix', JSON.stringify(usersToFix));
            replaceAvatarAndUsername();
        } else {
            alert('Please provide valid input for all fields.');
        }
    }

    function addButton() {
        const buttonContainer = document.querySelector('.topic-footer-main-buttons');
        if (buttonContainer && !buttonContainer.querySelector('.fix-user-button')) {
            const button = document.createElement('button');
            button.className = 'btn widget-button no-text btn-icon fix-user-button';
            button.title = 'De-spoof';
            button.textContent = 'De-spoof';
            button.addEventListener('click', addUserToFix);
            buttonContainer.appendChild(button);
        }
    }

    // Run the functions initially
    addButton();
    replaceAvatarAndUsername();

    // Observe the changes in the document and re-run the functions when needed
    const observer = new MutationObserver(debounce((mutations) => {
        let shouldReplace = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                shouldReplace = true;
            }
        });

        if (shouldReplace) {
            addButton();
            replaceAvatarAndUsername();
        }
    }, 250));

    observer.observe(document, {childList: true, subtree: true});
})();
