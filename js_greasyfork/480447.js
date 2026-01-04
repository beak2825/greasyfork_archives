// ==UserScript==
// @name         Phabricator URLs
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Converts Phabricator links to actual links rather than strings on GH projects board
// @author       Gergely Juhasz
// @match        https://github.com/orgs/Automattic/projects/733/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480447/Phabricator%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/480447/Phabricator%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert plain text URLs inside span elements to clickable links
    function convertSpanTextToLinks(span) {
        span.innerHTML = span.textContent.replace(/(https:\/\/(?:code|github)\.a8c\.com\/[^\s]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`);
    }

    function findAndConvertLinks() {
        document.querySelectorAll('span').forEach(span => {
            if (span.textContent.includes(".a8c.com") && !span.innerHTML.includes('target="_blank"')) {
                convertSpanTextToLinks(span);
            }
        });
    }

    // Observe changes in the board to handle dynamically loaded content
    const observer = new MutationObserver(findAndConvertLinks);
    window.onload = () => {
        observer.observe(document.querySelector('[data-dnd-drop-id=board]'), {
            attributes: true, childList: true, subtree: true
        });
    };
})();