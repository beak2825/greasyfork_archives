// ==UserScript==
// @name         Podcast Notes Unblocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes subscribe overlay, text-blurring CSS, and email popup from podcastnotes.org.
// @author       You
// @match        https://podcastnotes.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=podcastnotes.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450866/Podcast%20Notes%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/450866/Podcast%20Notes%20Unblocker.meta.js
// ==/UserScript==

// denotes whether there is/was a paywall on the page at one point
var payWallExists = false;

(function() {
    'use strict';

    // Your code here...
    let observer = new MutationObserver(reactToMutation);
    var domToWatch = document.querySelector('body')

    observer.observe(domToWatch, {
        characterDataOldValue: true,
        subtree: true,
        childList: true,
        characterData: true
    });
})();

function reactToMutation(mutations) {
    mutations.forEach((mutation) => {
        let oldValue = mutation.oldValue;
        let newValue = mutation.target;
        var payWallElem = document.querySelector('.paywall-overlay')
        if (oldValue !== newValue) {
            if(!payWallExists && payWallElem) payWallExists = true
            // only act if this page was paywalled
            if(payWallExists) {
                if(payWallElem) payWallElem.remove()
                var allNodes = document.querySelectorAll('.post-single-content *')
                for(var node of allNodes) {
                    node.style['text-shadow'] = 'none'
                    node.style.color = 'black'
                }
                let emailOverlay = document.querySelector('.mailing-list-cta-overlay')
                if(emailOverlay) emailOverlay.remove()
            }
        }
    });
}