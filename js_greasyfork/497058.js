// ==UserScript==
// @name         Remove Tumblr App Prompt
// @description  Removes the prompt to open Tumblr in the app from the top of the page.
// @namespace    remove-tumblr-app-prompt
// @match        *://www.tumblr.com/*
// @match        https://www.tumblr.com/dashboard
// @match        https://www.tumblr.com/dashboard/following
// @match        https://www.tumblr.com/dashboard/hubs
// @match        https://www.tumblr.com/explore/trending
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/497058/Remove%20Tumblr%20App%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/497058/Remove%20Tumblr%20App%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeAppPrompt = () => {
        const appPrompt = document.querySelector('.tmblr-iframe--app-promo');
        if (appPrompt) {
            appPrompt.remove();
        }
    };

    removeAppPrompt();
})();