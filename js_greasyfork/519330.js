// ==UserScript==
// @name         Reddit exact post time
// @namespace    https://rant.li/boson
// @version      1.1
// @description  Create a static copy of exact time of Reddit post time on side with formatted date
// @author       Boson
// @match        *://*.reddit.com/*
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/519330/Reddit%20exact%20post%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/519330/Reddit%20exact%20post%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatDate(date) {
        const options = {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return date.toLocaleString('en-US', options);
    }

    function createStaticCopy(originalTimeElement) {
        const datetime = originalTimeElement.getAttribute('datetime');
        const utcDate = new Date(datetime);
        const localDate = new Date(utcDate.getTime());
        const formattedDate = formatDate(localDate);

        const staticTimeElement = document.createElement('time');
        staticTimeElement.setAttribute('class', 'static-timestamp'); // Different class to avoid live update
        staticTimeElement.setAttribute('datetime', datetime);
        staticTimeElement.setAttribute('title', formattedDate);
        staticTimeElement.textContent = ` - ${formattedDate}`;
        return staticTimeElement;
    }

    function processTimeElements() {
        const timeElements = document.querySelectorAll('time.live-timestamp');
        timeElements.forEach(originalTimeElement => {
            const staticCopy = createStaticCopy(originalTimeElement);
            originalTimeElement.parentNode.insertBefore(staticCopy, originalTimeElement.nextSibling);
        });
    }

    function processNewNodes(nodes) {
        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const timeElements = node.querySelectorAll ? node.querySelectorAll('time.live-timestamp') : [];
                timeElements.forEach(originalTimeElement => {
                    const staticCopy = createStaticCopy(originalTimeElement);
                    originalTimeElement.parentNode.insertBefore(staticCopy, originalTimeElement.nextSibling);
                });
            }
        });
    }

    function handleMutations(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                processNewNodes(mutation.addedNodes);
            }
        }
    }

    window.addEventListener('load', function() {
        processTimeElements();
        const observer = new MutationObserver(handleMutations);
        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    });
})();
