// ==UserScript==
// @name         Auto-embed Imgur links.
// @author       Joshh
// @namespace    https://tljoshh.com
// @version      0.1.1
// @description  Find Imgur direct links and embed them directly into a post.
// @match        *://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463790/Auto-embed%20Imgur%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/463790/Auto-embed%20Imgur%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    main();

    function main() {
        const postsContainer = document.querySelector('#messages');
        const posts = document.querySelectorAll('.post');

        // Look for imgur links
        for (const post of posts) {
            handlePost(post);
        };
        // Listen for imgur links in new posts added by livelinks
        startMutationObserver(postsContainer);
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
        // For all nodes that were added, check if any where posts made by a user and add a click event listener.
        if(mutation.addedNodes.length) {
            for (const addedNode of mutation.addedNodes) {
                if (!addedNode.tagName) continue; // Not an element
                if(addedNode.classList.contains('post')) {
                    handlePost(addedNode);
                }
            }
        }
    }

    function handlePost(post) {
        const imgurLinks = post.querySelectorAll('.message-contents a[href*="imgur.com"]');
        const regex = new RegExp('https:\/\/(i\.)?imgur\.com\/([a-zA-Z0-9]{7})\.([a-zA-Z]+)');
        const links = [...imgurLinks].filter(link => link.href.match(regex) !== null);
        for (const link of links) {
            const matches = link.href.match(regex);
            const id = matches[2];
            const fileType = matches[3]

            link.style.display = "none";
            const node = createEmbedNode(id, fileType);
            link.parentNode.insertBefore(node, link.nextSibling);
        }
    }

    function createEmbedNode(id) {
        const container = document.createElement('div');
        const script = createImgurScript();

        const node = document.createElement('blockquote');
        node.classList.add('imgur-embed-pub');
        node.lang = 'en';
        node.dataset.id = id;
        node.dataset.context = false;

        const innerNode = document.createElement('a');
        innerNode.href = `https://imgur.com/${id}`;

        node.appendChild(innerNode);
        container.appendChild(node);
        container.appendChild(script);
        return container;
    }

    function createImgurScript() {
        const script = document.createElement('script');
        script.src = 'https://s.imgur.com/min/embed.js';
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('async', '');
        return script;
    }
})();