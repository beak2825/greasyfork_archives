// ==UserScript==
// @name         Foxlinks styled quotes
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Format quotes like Foxlinks
// @author       sintrode
// @author       Joshh
// @match        https://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464119/Foxlinks%20styled%20quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/464119/Foxlinks%20styled%20quotes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("blockquote { border: var(--MsgTop) 2px solid; margin: 10px 4px; border-radius: 5px; padding: 8px; }");
    GM_addStyle("blockquote > blockquote { margin-left: 2px; margin-right: 2px; }");
    GM_addStyle("blockquote > blockquote:last-child { margin-bottom: 0; }");
    GM_addStyle("blockquote>p:first-of-type { padding: 4px; background-color: var(--MsgTop); border-radius: 3px 3px 0 0; margin: -8px 0 8px -8px; max-width: initial; width: calc(100% + 8px); }");
    GM_addStyle(".standalone-blockquote {  }");
    GM_addStyle(".standalone-blockquote>p:first-of-type { background: none; margin-bottom: 0; display: inline; }");

    main();

    function main() {
        const postsContainer = document.querySelector('#messages');
        startMutationObserver(postsContainer);

        const blockquotes = postsContainer.querySelectorAll('.message-contents blockquote > p:first-of-type');
        handleBlockquotes(blockquotes);
    }

    // Add event listener to any posts added to DOM via livelinks
    function startMutationObserver(targetNode) {
        // Options for the observer (which mutations to observe)
        const config = { childList: true };

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
        if(mutation.addedNodes.length) {
            for (const addedNode of mutation.addedNodes) {
                if (!addedNode.tagName) continue; // Not an element
                if(addedNode.classList.contains('post')) {
                    const addedNodeBlockquotes = addedNode.querySelectorAll('.message-contents blockquote > p:first-of-type');
                    handleBlockquotes(addedNodeBlockquotes);
                }
            }
        }
    }

    function handleBlockquotes(blockquotes) {
        for (const blockquote of blockquotes) {
            const innerHTML = blockquote.innerHTML;
            if(innerHTML.slice(0, 4) === 'From') {
                const brIndex = innerHTML.indexOf("<br>");
                if(brIndex !== -1) {
                    const html = innerHTML.slice(brIndex + 4);
                    const node = document.createElement('p');
                    node.innerHTML = html;
                    blockquote.innerHTML = innerHTML.slice(0, brIndex);
                    blockquote.parentNode.insertBefore(node, blockquote.nextSibling);
                }
            } else {
                blockquote.parentNode.classList.add('standalone-blockquote');
            }
        }
    }
})();