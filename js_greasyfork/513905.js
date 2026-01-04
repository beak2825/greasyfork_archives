// ==UserScript==
// @name           GameGIF
// @namespace      http://tampermonkey.net/
// @version        1.3
// @icon           https://s.gjcdn.net/img/favicon.png
// @description    This replaces your profile picture on Game Jolt with a GIF
// @author         LeashedSkies
// @match          https://gamejolt.com/*
// @match          https://*.gamejolt.com/*
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/513905/GameGIF.user.js
// @updateURL https://update.greasyfork.org/scripts/513905/GameGIF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define your current profile picture URL and the GIF URL
    const currentProfilePicSrc = 'https://m.gjcdn.net/user-avatar/200/8034218-crop36_0_615_579-eiseypvx-v4.webp'; // Change this to your profile picture URL, you can use inspect element, or any other tool, might be hard to do on Mobile.
    const gifUrl = 'https://c.tenor.com/OhUxPkhdcgAAAAAd/tenor.gif'; // Your GIF URL, Go to a GIF, Hold tap or Right click, click Copy Image Link, paste in, .GIF only.

    // Function to replace the profile picture on the profile page
    function replaceProfilePicture() {
        const avatarElement = document.querySelector(`img[src="${currentProfilePicSrc}"]`);
        if (avatarElement) {
            avatarElement.src = gifUrl;
        }
    }

    // Function to replace profile pictures in posts
    function replacePostProfilePictures() {
        const postLinks = document.querySelectorAll('a[href^="https://gamejolt.com/p/"]');
        postLinks.forEach((link) => {
            const postAvatarWrapper = link.querySelector('.user-avatar-img._img'); // Select the wrapper
            if (postAvatarWrapper) {
                const postAvatar = postAvatarWrapper.querySelector('img');
                if (postAvatar && postAvatar.src === currentProfilePicSrc) {
                    postAvatarWrapper.innerHTML = `
                        <img src="${gifUrl}" class="img-responsive" style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;" alt="">
                    `;
                }
            }
        });
    }

    // Function to replace profile pictures in comments
    function replaceCommentProfilePictures() {
        const commentAvatars = document.querySelectorAll('.user-avatar-img img'); // Adjust this selector if needed
        commentAvatars.forEach((avatarElement) => {
            if (avatarElement.src === currentProfilePicSrc) {
                avatarElement.src = gifUrl;
                avatarElement.style.borderRadius = '100%'; // Circular
                avatarElement.style.width = '50px'; // Comment width
                avatarElement.style.height = '50px'; // Comment height
                avatarElement.style.objectFit = 'cover'; // Ensure proper fit
            }
        });
    }

    // Function to replace the top right icon's profile picture
    function replaceTopRightProfilePicture() {
        const topRightAvatar = document.querySelector('.user-avatar-img._img img');
        if (topRightAvatar && topRightAvatar.src === currentProfilePicSrc) {
            topRightAvatar.src = gifUrl;
            topRightAvatar.style.borderRadius = '50%'; // Circular
            topRightAvatar.style.width = '100px'; // Adjust width to match requirements
            topRightAvatar.style.height = '100px'; // Adjust height to match requirements
            topRightAvatar.style.objectFit = 'cover'; // Ensure proper fit
        }
    }

    // Use MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(() => {
        replaceProfilePicture();
        replacePostProfilePictures();
        replaceCommentProfilePictures();
        replaceTopRightProfilePicture(); // Add top right icon replacement
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial calls to replace the profile pictures
    replaceProfilePicture();
    replacePostProfilePictures();
    replaceCommentProfilePictures();
    replaceTopRightProfilePicture(); // Initial call for top right icon replacement
})();
