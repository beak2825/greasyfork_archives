// ==UserScript==
// @name         Extract Most Wanted Names
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extract names from a message on a page
// @author       Hwa
// @match        https://www.torn.com/messages.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538605/Extract%20Most%20Wanted%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/538605/Extract%20Most%20Wanted%20Names.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let currentUrl = location.href; // Track the current URL
    let observer = null; // Keep track of the observer to avoid duplicates

    // for all paragraphs, if names found, replace with link
    function replaceNamesWithLinks() {
        const nameRegex = /([a-zA-Z0-9_-]+) \[(\d+)\]/g;

        const elements = document.querySelectorAll(
            '.reply-mail-container.t-blue-cont.h .editor-content'
        );

        elements.forEach(element => {
            let content = element.innerHTML;

            // Replace the names matching the regex
            content = content.replace(nameRegex, (match, name, id) => {
                const profileUrl = `https://www.torn.com/profiles.php?XID=${id}`;
                return `<a href="${profileUrl}" target="_blank">${name} [${id}]</a>`;
            });

            // Update the content of the element
            element.innerHTML = content;
        });
    }

    // Function to initialize the MutationObserver
    function initializeObserver() {
        // disconnect the observer
        if (observer) {
            observer.disconnect();
        }

        // create a new one
        observer = new MutationObserver(() => {
            const links = document.querySelectorAll('.reply-mail-container.t-blue-cont.h .editor-content');
            if (links.length > 0) {
                replaceNamesWithLinks();
                observer.disconnect(); // stop once paragraphs are done
                observer = null;
            }
        });

        // start observing dom for changes bc fuck torn reload dont work
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('New observer initialized.');
    }

    setInterval(() => {
        if (location.href !== currentUrl) {
            console.log('URL changed.');
            currentUrl = location.href;

            // Check if the URL starts with the desired prefix
            if (currentUrl.startsWith('https://www.torn.com/messages.php#/p=read')) {
                console.log('URL matches target. Reinitializing observer...');
                initializeObserver(); // reinitialize if new URL matches
            } else {
                console.log('URL does not match. Stopping observer.');
                if (observer) {
                    observer.disconnect(); // Stop observing if the URL does not match
                    observer = null;
                }
            }
        }
    }, 1000);

    // initialize observer at start
    initializeObserver();
})();