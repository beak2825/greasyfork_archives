// ==UserScript==
// @name         UnShorts
// @name:ru      UnShorts
// @namespace    http://tampermonkey.net/
// @version      29.12.2024
// @description  Simple script for replace all shorts links on youtube page.
// @description:ru Простой скрипт заменяющий ссылки Shorts на обычные.
// @author       Aster-db
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @homepage     https://github.com/Askas-db/tampermonkey-scripts/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522228/UnShorts.user.js
// @updateURL https://update.greasyfork.org/scripts/522228/UnShorts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //REGEX AND SELECTOR VALUES
    const shortsRegex = /^\/shorts\/([a-zA-Z0-9_-]+)$/;
    const mediaContainer = '#media-container-link';

    function replaceShortsLink(e) {
    // Get the current href of the element
        let href = e.getAttribute('href');
        if(href) {
        // Check if the link matches the format /shorts/{videoId}
        const match = href.match(shortsRegex);

            if (match) {
                // Get videoId from the link
                const videoId = match[1];
                // console test
                // console.log("Found: ", videoId);

                // Replace the link with the new
                const newHref = `/watch?v=${videoId}`;
                e.setAttribute('href', newHref);
            }
        }
    }
    // Function to replace all links on the page
    function replaceShortsLinks() {
        // Get all elements with the required selector
        const elements = document.querySelectorAll('a');
        console.log(elements);
        // Iterate through each element
        elements.forEach(element => {
            replaceShortsLink(element);
        });
    }

    // Function to add an event handler for element update
    function startObserving() {
        const targetNode = document.querySelector(mediaContainer);
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    replaceShortsLinks();
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    // Wait for the autoplayer to load #media-container-link, YouTube replaces the link on the fly.
    function waitForElement() {
        const element = document.querySelector(mediaContainer);
        if (element) {
            replaceShortsLinks();
            startObserving();
        } else {
            setTimeout(waitForElement, 100);
        }
    }
    waitForElement();
})();