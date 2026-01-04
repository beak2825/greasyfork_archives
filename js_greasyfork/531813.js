// ==UserScript==
// @name        YouTube Avatar Enlarger
// @namespace   to.soon.userjs.ytavatar
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.2
// @author      Fox <https://github.com/f-o>
// @description Script to view larger avatars in YouTube comments section, by hovering over the avatars of commentors.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531813/YouTube%20Avatar%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/531813/YouTube%20Avatar%20Enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the floating box
    function createFloatingBox(src) {
        const floatingBox = document.createElement('div');
        floatingBox.style.position = 'absolute';
        floatingBox.style.zIndex = '1000';
        floatingBox.style.border = '1px solid #ccc';
        floatingBox.style.backgroundColor = 'white';
        floatingBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        floatingBox.style.padding = '5px';
        floatingBox.style.borderRadius = '5px';
        floatingBox.style.pointerEvents = 'none'; // Prevent interaction
        floatingBox.style.transition = 'opacity 0.2s';
        floatingBox.style.opacity = '0';
        floatingBox.style.transition = 'opacity 0.2s';

        const img = document.createElement('img');
        img.src = src;
        img.style.width = '300px'; // Set the desired width
        img.style.height = '300px'; // Set the desired height
        img.style.borderRadius = '5px';

        floatingBox.appendChild(img);
        document.body.appendChild(floatingBox);

        return floatingBox;
    }

    // Function to handle mouseover and mouseout events
    function handleAvatarHover(event) {
        const avatarImg = event.currentTarget.querySelector('img');
        const src = avatarImg.src.replace(/=s\d+/, '=s300'); // Change size to larger version

        const floatingBox = createFloatingBox(src);
        const rect = avatarImg.getBoundingClientRect();

        // Position the floating box above the avatar, if there's enough space
        // Otherwise, position it below
        const boxHeight = 310; // Image height + padding
        let top = rect.top - boxHeight; // Above the avatar
        if (top < 0) {
            top = rect.bottom; // Below the avatar
        }
        const left = rect.left + (rect.width / 2) - 150; // Centered horizontally
        floatingBox.style.top = `${top + window.scrollY}px`;
        floatingBox.style.left = `${Math.max(left, 5) + window.scrollX}px`; // Prevent overflow on the left
        if (left + 300 > window.innerWidth) { // Prevent overflow on the right
            floatingBox.style.left = `${window.innerWidth - 305 + window.scrollX}px`;
        }



        // Show the floating box
        floatingBox.style.opacity = '1';

        // Remove the floating box on mouseout
        avatarImg.addEventListener('mouseout', () => {
            floatingBox.style.opacity = '0';
            setTimeout(() => {
                floatingBox.remove();
            }, 200); // Wait for the fade-out transition
        });
    }

    // Function to add event listeners to avatar images
    function addAvatarListeners() {
        const avatars = document.querySelectorAll('#author-thumbnail img, #avatar img');
        avatars.forEach(avatar => {
            avatar.parentElement.addEventListener('mouseover', handleAvatarHover);
        });
    }

    // Observe for changes in the comment section to add listeners dynamically
    const observer = new MutationObserver(addAvatarListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to add listeners
    addAvatarListeners();
})();
