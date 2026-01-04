// ==UserScript==
// @name         Auto-scroll new posts
// @author       Joshh
// @namespace    https://tljoshh.com
// @version      0.1
// @description  Auto-scroll to the bottom of page when new posts are added
// @match        *://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468236/Auto-scroll%20new%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/468236/Auto-scroll%20new%20posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    main();

    function main() {
        const postsContainer = document.querySelector('#messages');
        const nextPageBtn = document.querySelector('#nextpage');

        startMutationObserver(postsContainer);
        startNextPageObserver(nextPageBtn);
    }

    // Add event listener to any posts added to DOM via livelinks
    function startMutationObserver(targetNode) {
        // Options for the observer (which mutations to observe)
        const config = { childList: true, attributes: true, attributeFilter: ['style'] };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            // For all mutations made to the target node, check if any nodes were added...
            for (const mutation of mutationList) {
                handleMutation(mutation);
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    // Handle any changes made to the messages container.
    function handleMutation(mutation) {
        // For all nodes that were added, scroll to the bottom of the page.
        if(mutation.addedNodes.length) {
            for (const addedNode of mutation.addedNodes) {
                if (!addedNode.tagName) continue; // Not an element
                if(addedNode.classList.contains('post')) {
                    if(document.body.scrollTop >= document.body.scrollHeight - window.innerHeight * 2) {
                        addedNode.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        }
    }

    function startNextPageObserver(targetNode) {
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, attributeFilter: ['style'] };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if(mutation.type === 'attributes') {
                    setTimeout(() => targetNode.click(), 1500);
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
})();