// ==UserScript==
// @name         EnhanceSneedex
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Some random enhancements for sneedex.moe
// @author       Vodes
// @match        https://sneedex.moe/*
// @match        https://static.sneedex.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sneedex.moe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526483/EnhanceSneedex.user.js
// @updateURL https://update.greasyfork.org/scripts/526483/EnhanceSneedex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifySecretTrackerLink() {
        const secretLinks = document.querySelectorAll('a.secret-tracker-link');
        secretLinks.forEach(link => {
            const url = link.href;
            const domainStartIndex = url.indexOf("://") + 3;
            const domainEndIndex = url.indexOf("/", domainStartIndex);
            const pathAfterDomain = url.substring(domainEndIndex + 1);
            link.href = "https://animebytes.tv/" + pathAfterDomain;
            link.classList.remove('secret-tracker-link');
        });
    }

    const observer = new MutationObserver(modifySecretTrackerLink);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run the function once on page load
    modifySecretTrackerLink();
})();