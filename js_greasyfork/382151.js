// ==UserScript==
// @name        Facebook Mobilizer
// @namespace   https://marcotrulla.it/
// @description Add a link to the mobile version of any post in timeline
// @author      Marco Trulla
// @match       *://www.facebook.com/*
// @version     0.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382151/Facebook%20Mobilizer.user.js
// @updateURL https://update.greasyfork.org/scripts/382151/Facebook%20Mobilizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select FB's content node (timeline) that will be observed for mutations
    let targetNode = document.getElementById('content');

    // We observe only modifications in childList and subtree
    let config = { attributes: false, childList: true, subtree: true };

    // On changes we add the links
    let callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type == 'childList') {
                addMobileLinks();
            }
        }
    };

    // Start observing our contents
    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // This callback function get all stories not yet processed and add the link to the mobile version
    function addMobileLinks() {
        // Retrieves the subtitles not yet mobilized
        let postSubtitle = document.querySelectorAll('[data-testid=story-subtitle]:not([data-mobilized=true]');

        for (let post of postSubtitle) {
            // Retrieve the story detail link
            let postDetailLink = post.querySelector(':nth-child(3)').querySelector('a');

            // Clone the link, set the mobile URL, and append it to the subtitle
            if (postDetailLink) {
                let mobileDetailLink = postDetailLink.href.replace('www.facebook.com', 'm.facebook.com');
                let mobileLink = postDetailLink.cloneNode();
                mobileLink.href = mobileDetailLink;
                mobileLink.textContent = 'Mobile ';
                post.insertBefore(mobileLink, post.lastChild);

                // Set the subtitle as processed
                post.dataset.mobilized = true;
            }
        }
    }
})();
