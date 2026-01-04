// ==UserScript==
// @name         Twitter Blue Block
// @namespace    https://github.com/aetherwu/BlockTwitterBlue
// @version      0.1
// @description  Block all tweets with blue tick on Twitter home page (timeline) and search results page (latest tab) on desktop browsers (Chrome, Firefox, Edge, Safari, Opera, Brave, etc)
// @author       Aether
// @match        https://twitter.com/home
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469647/Twitter%20Blue%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/469647/Twitter%20Blue%20Block.meta.js
// ==/UserScript==

function hideVerifiedTweets() {
    let verifiedIcons = document.querySelectorAll('svg[data-testid="icon-verified"]:not([data-processed="true"])');
    verifiedIcons.forEach((icon, index) => {
        console.log(index)
        let parentElement = icon.parentElement;

        // Loop to find the ancestor with data-testid="cellInnerDiv"
        while(parentElement && parentElement.getAttribute('data-testid') !== 'cellInnerDiv') {
            parentElement = parentElement.parentElement;
        }

        // If found, hide this ancestor
        if(parentElement && parentElement.getAttribute('data-testid') === 'cellInnerDiv') {
            parentElement.style.display = 'none';
            console.log(`Hid the parent div of verified icon at index ${index}`);
        }

        // Mark as processed
        icon.setAttribute('data-processed', 'true');
    });

    if(verifiedIcons.length === 0) {
        console.log('No verified icons found');
    }
}

(function() {
    'use strict';

    // Your code here...
    // Call the function
    setInterval(hideVerifiedTweets, 300)
})();
