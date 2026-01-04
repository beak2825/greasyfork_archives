// ==UserScript==
// @license MIT
// @name         Instagram Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect to a specific variant on Instagram
// @author       Daniel
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483326/Instagram%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/483326/Instagram%20Redirector.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Redirect to the variant URL if not already there
    if (window.location.href === "https://www.instagram.com/") {
        window.location.href = "https://www.instagram.com/?variant=following";
    }
})();
