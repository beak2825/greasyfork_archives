// ==UserScript==
// @name         Auto-embed Instagram links.
// @author       Joshh
// @namespace    https://tljoshh.com
// @version      0.1.3
// @description  Find Instagram links and embed them directly into a post.
// @match        *://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463635/Auto-embed%20Instagram%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/463635/Auto-embed%20Instagram%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    main();

    function main() {
        const postsContainer = document.querySelector('#messages');
        const posts = document.querySelectorAll('.post');

        // Look for instagram links
        for (const post of posts) {
            handlePost(post);
        };
        // Listen for instagram links in new posts added by livelinks
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
            if(typeof instgrm !== 'undefined' && typeof instgrm.Embeds !== 'undefined') {
                instgrm.Embeds.process();
            }
        }
    }

    function handlePost(post) {
        const instagramLinks = post.querySelectorAll('.message-contents a[href*="instagram.com/p/"], .message-contents a[href*="instagram.com/reel/]');
        for (const link of instagramLinks) {
            link.style.display = "none";
            const embedURL = formatEmbedURL(link.href);
            const node = createEmbedNode(embedURL);
            link.parentNode.insertBefore(node, link.nextSibling);
        }
        if(instagramLinks.length && typeof instgrm === 'undefined') {
            createInstagramScript();
        }
    }

    function formatEmbedURL(href) {
        const url = new URL(href);
        return url.toString().replace(url.search, '');
    }

    function createEmbedNode(embedURL) {
        const node = document.createElement('blockquote');
        node.classList.add('instagram-media');
        node.dataset.instgrmCaptioned = true;
        node.dataset.instgrmPermalink = `${embedURL}?utm_source=ig_embed&amp;utm_campaign=loading`;
        node.dataset.instgrmVersion = 14;
        node.style = 'background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 5px 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);';
        return node;
    }

    function createInstagramScript() {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('async', '');
        document.body.appendChild(script);
    }
})();