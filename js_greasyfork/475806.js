// ==UserScript==
// @name         Spoiler Protection for tampermonkey
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Apply a black box to elements containing specific keywords on web pages, including dynamically loaded content when scrolling
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475806/Spoiler%20Protection%20for%20tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/475806/Spoiler%20Protection%20for%20tampermonkey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define your customizable keywords here
    const keywordsToMatch = ['keyword1', '網', '有片', '恐', '崩潰', '這一件', '這件', '竟然', '揪', '揭', '傻眼', '網', '曝', '爆', '驚'];

    // Define the black box CSS style
    const blackBoxStyle = `
        background-color: black !important;
        color: grey !important;
        font-size: 10pt !important;
    `;

    // Function to apply black box to elements containing keywords
    function applyBlackBoxToElements() {
        const allTextNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        for (let textNode; (textNode = allTextNodes.nextNode()); ) {
            const text = textNode.textContent.toLowerCase();
            for (const keyword of keywordsToMatch) {
                if (text.includes(keyword.toLowerCase())) {
                    const parentElement = textNode.parentElement;
                    if (parentElement) {
                        parentElement.style.cssText += blackBoxStyle;
                        //parentElement.style.backgroundColor = 'black';
                        //parentElement.style.color = 'white';
                        //parentElement.textContent = '______"'+keyword+'"______'; // Replace with your preferred text
                    }
                    break; // No need to check other keywords for this text node
                }
            }
        }
    }

    // Function to observe and apply black box to newly added content
    function observeAndApplyBlackBox() {
        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    applyBlackBoxToElements();
                }
            }
        });

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    // Function to handle scroll events and apply black box to new content
    function handleScroll() {
        window.addEventListener('scroll', function() {
            applyBlackBoxToElements();
        });
    }

    // Main function to process the webpage
    function processPage() {
        applyBlackBoxToElements();
        observeAndApplyBlackBox();
        handleScroll();
    }

    // Run the script
    processPage();
})();
