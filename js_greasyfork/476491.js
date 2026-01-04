// ==UserScript==
// @name         Khan Academy Custom Profile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to change the avatar image on Khan Academy.
// @author       ThatDoggoLover
// @match        *://www.khanacademy.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476491/Khan%20Academy%20Custom%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/476491/Khan%20Academy%20Custom%20Profile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeAvatar() {
        // Define the URL of your custom image the (only thing you need to change and don't erase the single quotes)
        var customImageUrl = 'https://i.imgur.com/g4hSoPc.gif';

        // Attempt to select the target element every 500 milliseconds until it is found
        var attemptToSelectElement = setInterval(function() {
            var avatarElement = document.querySelector('.user-avatar-background .avatar-pic');

            // If the avatar element is found, change the avatar image and stop attempting to select the element
            if (avatarElement) {
                avatarElement.src = customImageUrl;
                avatarElement.alt = 'Custom Avatar';
                clearInterval(attemptToSelectElement); // Stop the interval
            }
        }, 500); // Check every 500 milliseconds
    }

    // Run the function after the page has completely loaded
    window.addEventListener('load', changeAvatar);
})();
