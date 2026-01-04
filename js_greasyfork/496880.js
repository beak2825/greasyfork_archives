// ==UserScript==
// @name         WebShuffler
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Shuffles every text on websites
// @author       lxvdev
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496880/WebShuffler.user.js
// @updateURL https://update.greasyfork.org/scripts/496880/WebShuffler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to shuffle all the text on the website
    function shuffleText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent.trim();
            if (text.length > 1) {
                let shuffledText = text.split('').sort(() => Math.random() - 0.5).join('');
                node.textContent = shuffledText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(function(childNode) {
                shuffleText(childNode);
            });
        }
    }

    // Function to shuffle the page title
    function shuffleTitle() {
        let title = document.title.trim();
        if (title.length > 1) {
            let shuffledTitle = title.split('').sort(() => Math.random() - 0.5).join('');
            document.title = shuffledTitle;
        }
    }

    // Function for shuffling text that changed
    function handleMutations(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                        shuffleText(node);
                    }
                });
            }
        });
    }

    // Checks if there is running observers
    function isObserverRunning() {
        return observer.takeRecords().length > 0;
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

    // Starts observing for text changes
    function startObserver() {
        if (!isObserverRunning()) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Starts observing and shuffles text if the tab gets focused again
    window.addEventListener('focus', () => {
        shuffleTitle();
        startObserver();
        shuffleText(document.body);
    });

    // Stops observing if the tab isn't focused
    window.addEventListener('blur', () => {
        observer.disconnect();
    });

    // Shuffles text on load
    window.onload = function() {
        shuffleTitle();
        shuffleText(document.body);
    };
})();
