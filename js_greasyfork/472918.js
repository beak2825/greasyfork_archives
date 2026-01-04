// ==UserScript==
// @name         Flickr Pro Nag Remover
// @namespace    https://greasyfork.org/en/users/1148791-vuccala
// @version      1.0
// @description  Removes the obnoxious "Upgrade to Flickr Pro to hide these ads" nag screen (that normally appears every 6 image slides) by deleting the 'adCounter' cookie that tracks your slideshow clicks.
// @author       Vuccala
// @icon         https://archive.org/download/no-nag-flickr-icon/flic.png
// @match        *://*.flickr.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472918/Flickr%20Pro%20Nag%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/472918/Flickr%20Pro%20Nag%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to delete a cookie by name
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.flickr.com;';
    }

    // Function to check and delete the "adCounter" cookie
    function checkAndDeleteCookie() {
        if (document.cookie.includes("adCounter")) {
            deleteCookie("adCounter");
            console.log("Deleted adCounter cookie.");
        }
    }

    // Observe changes in the document
    const observer = new MutationObserver(() => {
        checkAndDeleteCookie();
    });

    // Observe the entire document and subtree changes
    observer.observe(document, { childList: true, subtree: true });

    // Initial check for the cookie
    checkAndDeleteCookie();
})();
