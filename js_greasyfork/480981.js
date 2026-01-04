// ==UserScript==
// @name         F95 Zone Auto Redirect
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Will auto redirect when clicking on download links
// @author       https://github.com/IrisV3rm
// @match        https://f95zone.to/masked/*
// @icon         https://f95zone.to/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480981/F95%20Zone%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/480981/F95%20Zone%20Auto%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickDownloadLink() {
        document.title = "Auto | Redirecting..."
        const downloadLinks = document.querySelectorAll('.host_link');
        if (downloadLinks.length > 0) {
            downloadLinks[0].click();
        }
    }

    const observer = new MutationObserver(mutations => {
        const errorElement = document.querySelector("#error");
        if (errorElement && errorElement.children.length > 0) {
            clickDownloadLink();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(clickDownloadLink, 50);
})();
