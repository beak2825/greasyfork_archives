// ==UserScript==
// @name         Correct highlighting on typing-lessons.org
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Makes spaces visible on typing-lessons.org
// @author       carbolymer
// @match        https://www.typing-lessons.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392875/Correct%20highlighting%20on%20typing-lessonsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/392875/Correct%20highlighting%20on%20typing-lessonsorg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = document.getElementById('typing_field');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.target.tagName === 'SPAN' && mutation.target.getAttribute("style") === 'color: lightgrey;') {
                mutation.target.style = 'color: lightgrey; background: darkgray;';
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

})();