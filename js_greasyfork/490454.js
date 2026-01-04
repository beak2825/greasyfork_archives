// ==UserScript==
// @name         Fuck Suyu Posts
// @namespace    http://tampermonkey.net/
// @version      2024-03-21
// @description  Removes any element containing "suyu" in the element...
// @author       Oroborius
// @match        *.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490454/Fuck%20Suyu%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/490454/Fuck%20Suyu%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Select the node that will be observed for mutations
    const targetNode = document.getElementsByClassName("rpBJOHq2PR60pnwJlUyP0")[0];

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            [...document.querySelectorAll("a")]
                .filter(a => a.textContent.toLowerCase().includes("suyu"))
                .forEach(a => a.parentElement.parentElement.remove());
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

})();