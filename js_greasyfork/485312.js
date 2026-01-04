// ==UserScript==
// @name         Corny Ban/Offensive item changer
// @namespace    http://tampermonkey.net/
// @version      0.001
// @description  Changes the offensive item
// @author       BigBlackMonkey/rusello25
// @match        https://www.roblox.com/not-approved*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485312/Corny%20BanOffensive%20item%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/485312/Corny%20BanOffensive%20item%20changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the class of the parent div
    var parentDivClass = 'punishment-section';
    // Define the class of the <p> element
    var targetParagraphClass = 'message-section';

    // Select the parent div by class
    var parentDiv = document.querySelector('.' + parentDivClass);

    // Check if the parent div is found
    if (parentDiv) {
        // Select all <p> elements within the parent div by class
        var targetParagraphs = parentDiv.querySelectorAll('.' + targetParagraphClass);

        // Iterate through each <p> element
        targetParagraphs.forEach(function(targetParagraph) {
            // Select the <b> element within the <p> element
            var targetBoldElement = targetParagraph.querySelector('b');

            // Check if the <b> element is found and the text content of <p> does not contain "Reason: "
            if (targetBoldElement && !targetParagraph.textContent.includes('Reason:')) {
                // Replace the text content of the <b> element with "Corny is cool"
                targetBoldElement.textContent = 'Corny is cool';
            }
        });
    }
})();