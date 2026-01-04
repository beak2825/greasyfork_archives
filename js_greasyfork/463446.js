// ==UserScript==
// @name         Quote specific images in a post.
// @author       Joshh
// @namespace    https://tljoshh.com
// @version      0.3
// @description  Alt + Click on one or more images in a post to quote them.
// @match        *://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463446/Quote%20specific%20images%20in%20a%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/463446/Quote%20specific%20images%20in%20a%20post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastQuotedMsg = null;
    const form = document.querySelector('#reply-form');
    const replyBox = document.querySelector('#reply-content');
    const postsContainer = document.querySelector('#messages');
    const posts = document.querySelectorAll('.post');

    // Listen to all for an alt+click event
    for (const post of posts) {
        post.addEventListener('click', handleClick);
    };
    // Listen for new posts added by livelinks
    startMutationObserver(postsContainer);
    // Clear last quoted message upon submission of new post
    form.addEventListener('submit', handlePostSubmission);

    // Remove the last quoted msg id
    function handlePostSubmission() {
       lastQuotedMsg = null;
    }

    // Target event: alt+click on images in a post
    function handleClick(e) {
        const { altKey, target, currentTarget } = e;
        if (altKey && target.tagName === 'IMG') {
            e.preventDefault();
            handleImageClick(currentTarget, target);
        }
    };

    // Add the markdown formatted text for the quoted message identifier and the image to the reply textarea
    function handleImageClick(post, image) {
        // Append quoted message identifier
        const authorBoxNotAdded = !checkIfAuthorBoxAdded(post);
        if(authorBoxNotAdded) {
            addAuthorBox(post);
        }

        // Append quoted image to replybox
        addQuotedImage(image);
    }

    // Add an image to the reply textarea
    function addQuotedImage(img) {
        const { alt, src } = img;
        replyBox.value += `\n> ![${alt}](${src})`;
    };

    // Add quoted message identifier to reply textarea and store the permalink id
    function addAuthorBox(post) {
        const username = post.querySelector('.post-author').innerText;
        const messageTopLinks = post.querySelectorAll('.message-top > a');
        const filteredThreadPermalink = new URL(messageTopLinks[2].href);
        const filteredThreadPermalinkTokens = filteredThreadPermalink.pathname.split('/');
        const date = messageTopLinks[1].querySelector('.desktop-only').innerText;
        const messagePermalink = new URL(messageTopLinks[1].href);
        if(lastQuotedMsg !== null && replyBox.value.length) {
            replyBox.value += `\n\n`;
        } else if(replyBox.value.length) {
            replyBox.value += `\n`;
        }
        const messagePermalinkTokens = messagePermalink.pathname.split('/');
        replyBox.value += `> From: [${username}](${filteredThreadPermalink.pathname}) at [${date}](/thread/${messagePermalinkTokens[2]}#msg-${filteredThreadPermalinkTokens[3]})\n>`;
        lastQuotedMsg = messagePermalink.pathname;
    };

    // Check what the last quoted message identifier was and determine if we need to add an author box.
    function checkIfAuthorBoxAdded(post) {
        const messageTopLinks = post.querySelectorAll('.message-top > a');
        const messagePermalink = new URL(messageTopLinks[1].href);
        return lastQuotedMsg === messagePermalink.pathname;
    };

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
        // For all nodes that were added, check if any where posts made by a user and add a click event listener.
        if(mutation.addedNodes.length) {
            for (const addedNode of mutation.addedNodes) {
                if (!addedNode.tagName) continue; // Not an element
                if(addedNode.classList.contains('post')) {
                    addedNode.addEventListener('click', handleClick);
                }
            }
        }
    }
})();