// ==UserScript==
// @name         GitHub Animated Profile Picture
// @namespace    https://github.com/PatoFlamejanteTV
// @version      1.40
// @description  Replace GitHub profile picture with a custom image from the user's repository if the image exists
// @author       PatoFlamejanteTV
// @license MIT
// @match        *://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514730/GitHub%20Animated%20Profile%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/514730/GitHub%20Animated%20Profile%20Picture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    const profilePictureClasses = [
        'avatar mr-2 d-none d-md-block avatar-user',
        'avatar avatar-user width-full border color-bg-default',
        'avatar circle',
    ];

    const username = window.location.pathname.split('/').filter(Boolean)[0];
    const customImageUrl = `https://raw.githubusercontent.com/${username}/${username}/refs/heads/main/anim_pfp/pfp.gif`;

    console.log("Checking Image:", customImageUrl);

    function attemptProfilePictureChange(attempts) {
        checkImage(customImageUrl).then(exists => {
            if (exists) {
                profilePictureClasses.forEach(profileClass => {
                    const profilePictures = document.getElementsByClassName(profileClass);
                    Array.from(profilePictures).forEach(img => {
                        img.src = customImageUrl;
                        img.srcset = customImageUrl;
                    });
                });
            } else if (attempts > 0) {
                console.log(`Attempt failed. Retrying... (${attempts} attempts left)`);
                setTimeout(() => attemptProfilePictureChange(attempts - 1), 2000);
            } else {
                console.log("Animated PFP not found after multiple attempts.");
            }
        });
    }

    attemptProfilePictureChange(3); // Start with 3 attempts
})();