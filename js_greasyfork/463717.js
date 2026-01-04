// ==UserScript==
// @name         Auto-embed Twitter links.
// @author       Joshh
// @namespace    https://tljoshh.com
// @version      0.5.3
// @description  Find Twitter links and embed them directly into a post.
// @match        *://*.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463717/Auto-embed%20Twitter%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/463717/Auto-embed%20Twitter%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const storageKey = 'twitterWidgetTheme';
    main();

    function main() {
        // Setup widget's default color scheme
        let theme = localStorage.getItem(storageKey);
        if(localStorage.getItem(storageKey) === null) {
            localStorage.setItem(storageKey, 'dark');
            theme = 'dark';
        }

        // Look for twitter links
        const postsContainer = document.querySelector('#messages');
        const posts = document.querySelectorAll('.post');
        for (const post of posts) {
            handlePost(post, theme);
        };
        // Look for twitter links in posts added by livelinks
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

    // Handle any changes made to the messages container (usually via livelinks)
    function handleMutation(mutation) {
        if(mutation.addedNodes.length) {
            const theme = localStorage.getItem(storageKey);
            for (const addedNode of mutation.addedNodes) {
                if (!addedNode.tagName) continue; // Not an element
                if(addedNode.classList.contains('post')) {
                    handlePost(addedNode, theme);
                }
            }
        }
    }

    function handlePost(post, theme) {
        const links = post.querySelectorAll('.message-contents > p a[href*="twitter.com"]');
        const twitterLinkRegex = new RegExp('http(?:s)?:\/\/(?:www\.)?(?:mobile\.)?twitter.com\/(?:.*)\/status\/(\\d+)(?:.*)?');
        const twitterLinks = [...links].filter(link => link.href.match(twitterLinkRegex) !== null);
        if(twitterLinks.length) {
            if(typeof twttr === 'undefined') {
                createTwitterScript();
            }
            twttr.ready((twttr) => {
                for (const link of twitterLinks) {
                    link.style.display = "none";
                    const matchGroups = link.href.match(twitterLinkRegex);
                    const tweetId = matchGroups[1];
                    const node = createEmbedNode(tweetId);
                    link.parentNode.insertBefore(node, link.nextSibling);
                    twttr.widgets.createTweet(tweetId, node, { theme });
                    const swapThemeNode = createSwapThemeNode(theme);
                    node.parentNode.insertBefore(swapThemeNode, node.nextSibling);
                }
            });
        }
    }

    function createEmbedNode(tweetId) {
        const node = document.createElement('div');
        node.setAttribute('id', `tweet-${tweetId}`);
        return node;
    }

    function createTwitterScript() {
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.appendChild(document.createTextNode('window.twttr=function(t,e,r){var n,s=t.getElementsByTagName(e)[0],i=window.twttr||{};return t.getElementById(r)||((n=t.createElement(e)).id=r,n.src="https://platform.twitter.com/widgets.js",s.parentNode.insertBefore(n,s),i._e=[],i.ready=function(t){i._e.push(t)}),i}(document,"script","twitter-wjs");'));
        document.head.appendChild(script);
    }

    function createSwapThemeNode(currentTheme) {
        const node = document.createElement('div');
        node.innerText = `Swap to ${currentTheme === 'light' ? 'dark' : 'light'} mode (requires refresh)`;
        node.style = 'cursor:pointer;font-size: 11px;position: relative; top: -8px; text-decoration: underline;';
        node.addEventListener('click', (e) => {
            if(currentTheme === 'light') {
                localStorage.setItem(storageKey, 'dark');
            } else {
                localStorage.setItem(storageKey, 'light');
            }
            if(confirm('Changes will take effect the next time the page is loaded. Refresh the page now?')) {
                window.location.reload();
            }
        });
        return node;
    }
})();