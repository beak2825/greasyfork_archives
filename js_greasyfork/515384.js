// ==UserScript==
// @name         Remove Chat Avatars on fishtank.live
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove chat avatars
// @author       Blungs
// @match        https://*.fishtank.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/515384/Remove%20Chat%20Avatars%20on%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/515384/Remove%20Chat%20Avatars%20on%20fishtanklive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove avatar elements
    function removeAvatars() {
        const avatars = document.querySelectorAll('.chat-message-default_avatar__eVmdi');
        avatars.forEach(avatar => avatar.remove());
    }

    // Run the function initially in case some avatars are already present
    removeAvatars();

    // Set up a MutationObserver to detect new avatars added dynamically
    const observer = new MutationObserver(removeAvatars);

    // Observe changes to the document body for dynamically added elements
    observer.observe(document.body, { childList: true, subtree: true });
})();
