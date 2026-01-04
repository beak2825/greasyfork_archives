// ==UserScript==
// @name         Buzzheavier Auto Download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically downloads the file from the site
// @author       Marcer_f
// @icon         https://buzzheavier.com/favicon.ico
// @license      MIT
// @match        https://buzzheavier.com/*
// @exclude      https://buzzheavier.com/
// @exclude      https://buzzheavier.com/login*
// @exclude      https://buzzheavier.com/pricing*
// @exclude      https://buzzheavier.com/blog*
// @exclude      https://buzzheavier.com/speedtest*
// @exclude      https://buzzheavier.com/whyareyougay*
// @exclude      https://buzzheavier.com/developers*
// @exclude      https://buzzheavier.com/privacy*
// @exclude      https://buzzheavier.com/terms*
// @exclude      https://buzzheavier.com/contact*
// @exclude      https://buzzheavier.com/help*
// @exclude      https://buzzheavier.com/notfound*
// @exclude      https://buzzheavier.com/favicon.ico*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527471/Buzzheavier%20Auto%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/527471/Buzzheavier%20Auto%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current URL
    let currentUrl = window.location.href;

    // Check that we are not already on the download page
    if (!currentUrl.endsWith('/download')) {
        // Neue URL mit /download erstellen
        let newUrl = currentUrl.replace(/(https:\/\/buzzheavier\.com\/[^\/]*)(\/.*)?$/, '$1/download');

        // Redirect
        window.location.replace(newUrl);

        // Close the page after 750ms
        setTimeout(() => {
            window.close();
        }, 750);
    }
})();
