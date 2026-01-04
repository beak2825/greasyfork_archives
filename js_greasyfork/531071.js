// ==UserScript==
// @name         AudiobookBay Image Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify image attributes on AudiobookBay
// @author       You
// @match        https://audiobookbay.lu/abss/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531071/AudiobookBay%20Image%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/531071/AudiobookBay%20Image%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current page URL
    const currentPageUrl = window.location.href;

    // Find the <a> element that points to the current page URL
    const linkElement = document.querySelector(`a[href="${currentPageUrl}"]`);
    if (!linkElement) return;

    // Check if the <a> element wraps an <img>
    const imgElement = linkElement.querySelector('img');
    if (imgElement) {
        // Remove the <a> element but keep the <img>
        linkElement.replaceWith(imgElement);
    }
})();
