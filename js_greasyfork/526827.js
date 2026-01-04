// ==UserScript==
// @name         Remove Profile Pictures from Messages & DMs on Twitter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes profile pictures from Twitter Messages and DMs (Direct Messages).
// @author       YourName
// @match        https://twitter.com/messages/*
// @match        https://x.com/messages/*
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526827/Remove%20Profile%20Pictures%20from%20Messages%20%20DMs%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/526827/Remove%20Profile%20Pictures%20from%20Messages%20%20DMs%20on%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeProfilePictures() {
        const profilePics = document.querySelectorAll('img[src*="profile_images"]');
        profilePics.forEach(img => img.style.display = 'none');
    }

    // Run initially
    removeProfilePictures();
    
    // Observe for dynamic changes
    const observer = new MutationObserver(removeProfilePictures);
    observer.observe(document.body, { childList: true, subtree: true });
})();
