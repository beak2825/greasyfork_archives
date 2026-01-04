// ==UserScript==
// @name         Epic Games Auto Redirect
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Removes the annoying "Redirect to external site" notification screen when you leave the epic games environment such as UE Marketplace.
// @author       https://www.finalfactory.de/
// @match        https://redirect.epicgames.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unrealengine.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480872/Epic%20Games%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/480872/Epic%20Games%20Auto%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the redirect URL parameter
    function getRedirectUrl() {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get('redirectTo');
    }

    // Perform the redirection
    const redirectUrl = getRedirectUrl();
    if (redirectUrl) {
        window.location.href = redirectUrl;
    }
})();