// ==UserScript==
// @name         map-making.app Tags Keyboard Shortcuts
// @version      0.1
// @description  Keyboard shortcuts (1-9) to add tags
// @author       @teqoa9
// @match        https://map-making.app/maps/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1375871-teqoa1
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/537532/map-makingapp%20Tags%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/537532/map-makingapp%20Tags%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==


/* To use:
 * Each tag (1-9) receives a number (written in [square brackets] before the tag name in the 'click to add' view);
 * Press a number on your keyboard to assign the corresponding tag to the loc;
 * Press enter to save the loc, as you normally would.
*/


(function() {
    'use strict';

    let tagMappings = new Map(); // tagName -> number
    let numberMappings = new Map(); // number -> button element
    let originalTagTexts = new Map(); // button -> original text

    function assignNumbersToTags() {
        const tagList = document.querySelector('ol.tag-list');
        if (!tagList) return;

        const tagItems = tagList.querySelectorAll('li.tag.is-small.has-button');

        numberMappings.clear();

        tagItems.forEach((li, index) => {
            const textSpan = li.querySelector('span.tag__text');
            const button = li.querySelector('button.tag__button.tag__button--add');

            if (!textSpan || !button) return;

            let originalText;
            if (originalTagTexts.has(button)) {
                originalText = originalTagTexts.get(button);
            } else {
                originalText = textSpan.textContent;
                originalTagTexts.set(button, originalText);
            }

            let assignedNumber;

            if (tagMappings.has(originalText)) {
                assignedNumber = tagMappings.get(originalText);
            } else {
                assignedNumber = index + 1;
                while (Array.from(tagMappings.values()).includes(assignedNumber) && assignedNumber <= 9) {
                    assignedNumber++;
                }

                if (assignedNumber <= 9) {
                    tagMappings.set(originalText, assignedNumber);
                }
            }
            if (assignedNumber <= 9) {
                textSpan.textContent = `[${assignedNumber}] ${originalText}`;

                numberMappings.set(assignedNumber, button);
            }
        });
    }

    function handleKeyPress(event) {
        const keyNum = parseInt(event.key);
        if (isNaN(keyNum) || keyNum < 1 || keyNum > 9) return;


        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }

        const button = numberMappings.get(keyNum);
        if (button && button.isConnected) {
            event.preventDefault();
            button.click();
        }
    }

    function observeTagList() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && node.classList.contains('tag-list')) {
                                shouldProcess = true;
                            } else if (node.querySelector && node.querySelector('ol.tag-list')) {
                                shouldProcess = true;
                            }
                        }
                    });
                }

                if (mutation.target.closest && mutation.target.closest('ol.tag-list')) {
                    shouldProcess = true;
                }
            });

            if (shouldProcess) {
                setTimeout(assignNumbersToTags, 10);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(assignNumbersToTags, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeTagList);
    } else {
        observeTagList();
    }

    document.addEventListener('keydown', handleKeyPress);

})();