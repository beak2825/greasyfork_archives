// ==UserScript==
// @name         Say My Name.
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces (Y/N) in fanfics with your actual name or whatever you want. Coded by ChatGPT.
// @author       Xhepyxopila
// @license MIT
// @match       *://archiveofourown.org/*
// @match       *://*.fanfiction.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506178/Say%20My%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/506178/Say%20My%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set your custom name or text here
    const customName = 'YourName';

    // Function to replace Y/N with the custom name
    function replaceYN(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(/\(Y\/N\)|\{Y\/N\}|\[Y\/N\]/gi, customName);
        } else {
            for (let child of node.childNodes) {
                replaceYN(child);
            }
        }
    }

    // Replace Y/N on page load
    replaceYN(document.body);

    // Replace Y/N on dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                replaceYN(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
