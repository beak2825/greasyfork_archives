// ==UserScript==
// @name         Character AI URL Redirect
// @namespace    Violentmonkey Scripts
// @match        https://beta.character.ai/chat2*
// @grant        none
// @description  redirect you from "chat2?char=" to "chat?char="
// @version 0.0.1.20230828085346
// @downloadURL https://update.greasyfork.org/scripts/474079/Character%20AI%20URL%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/474079/Character%20AI%20URL%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentURL = window.location.href;

    // Replace "chat2" with "chat" in the URL
    var newURL = currentURL.replace('/chat2', '/chat');

    // Redirect to the new URL
    window.location.href = newURL;
})();